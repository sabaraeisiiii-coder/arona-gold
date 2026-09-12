import fs from 'node:fs/promises';
const origin = process.env.QA_ORIGIN ?? 'http://localhost:3000';
const mode = process.argv[2] ?? 'runtime';
if (!/^[a-z-]+$/.test(mode)) throw new Error('Invalid report name');
const routes = ['/', '/products', '/login', '/account', '/admin'];
const http = [];
for (const route of routes) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(origin + route, { signal: AbortSignal.timeout(30000) });
    const body = await response.text();
    const complete = body.includes('</html>') && !/internal error; reference|Internal Server Error|\$RX\(/.test(body);
    http.push({ route, attempt, status: response.status, bytes: Buffer.byteLength(body), complete });
    if (!response.ok || !complete) throw new Error('Incomplete SSR: ' + route);
  }
}
const browserInfo = await fetch('http://127.0.0.1:9224/json/version').then(response => response.json());
const socket = new WebSocket(browserInfo.webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
let id = 0, session;
const calls = new Map(), exceptions = [], consoleErrors = [];
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const call = calls.get(message.id);
    calls.delete(message.id);
    if (message.error) call.reject(new Error(JSON.stringify(message.error))); else call.resolve(message.result);
  }
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
    consoleErrors.push(message.params.args.map(argument => argument.value ?? argument.description).join(' '));
  }
});
function send(method, params = {}) {
  const next = ++id;
  return new Promise((resolve, reject) => { calls.set(next, { resolve, reject }); socket.send(JSON.stringify({ id: next, method, params, ...(session ? { sessionId: session } : {}) })); });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(expression).catch(() => false)) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Browser timeout: ' + expression);
}
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
session = (await send('Target.attachToTarget', { targetId, flatten: true })).sessionId;
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
const browser = [];
try {
  for (const route of routes) {
    const navigation = await send('Page.navigate', { url: origin + route });
    if (navigation.errorText) throw new Error(navigation.errorText);
    await waitFor("document.readyState === 'complete' && !!document.querySelector('h1')");
    if (route === '/account') await waitFor("location.pathname === '/login' && !!document.querySelector('h1') && !!document.querySelector('input[type=tel]')");
    else await waitFor(`location.pathname === ${JSON.stringify(route)}`);
    await waitFor("(() => { const button = document.querySelector('button'); return !button || Object.keys(button).some(key => key.startsWith('__reactProps')); })()");
    await evaluate("new Promise(resolve => setTimeout(resolve, 250))");
    const state = await evaluate(`({
      path: location.pathname + location.search,
      heading: document.querySelector('h1')?.textContent,
      overlay: [...document.querySelectorAll('vite-error-overlay, [data-vinext-dev-error-overlay]')].some(element => {
        const text = element.shadowRoot?.textContent ?? element.textContent;
        return /Build Error|Runtime Error|internal error; reference/.test(text || '');
      })
    })`);
    if (state.overlay) throw new Error('Error overlay on ' + route);
    browser.push({ route, ...state });
  }
  await send('Page.navigate', { url: origin });
  await waitFor("(() => { const element = document.querySelector('.header-search__trigger'); return element && Object.keys(element).some(key => key.startsWith('__reactProps')); })()");
  await evaluate("document.querySelector('.header-search__trigger').click()");
  await waitFor("!!document.querySelector('.header-search__input')");
  await waitFor("(() => { const element = document.querySelector('.hero__actions a[href=\"/products\"]'); return element && Object.keys(element).some(key => key.startsWith('__reactProps') && typeof element[key].onClick === 'function'); })()");
  await evaluate("document.querySelector('.hero__actions a[href=\"/products\"]').click()");
  await waitFor("location.pathname === '/products' && !!document.querySelector('.catalog-filters')");
  const navigation = { homeToProducts: 'passed', headerSearch: 'passed' };
  if (exceptions.length || consoleErrors.length) throw new Error(JSON.stringify({ exceptions, consoleErrors }));
  await fs.mkdir('outputs/frontend-qa', { recursive: true });
  const result = { mode, origin, http, browser, navigation, exceptions, consoleErrors };
  await fs.writeFile(`outputs/frontend-qa/${mode}-smoke.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(JSON.stringify({ http, browser, exceptions, consoleErrors, state: await evaluate("({url:location.href, text:document.body.innerText.slice(0,3000)})").catch(() => null) }, null, 2));
  throw error;
} finally {
  await send('Target.closeTarget', { targetId }); socket.close();
}
