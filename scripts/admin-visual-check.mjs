import fs from 'node:fs/promises';
const origin = process.env.QA_ORIGIN ?? 'http://localhost:3001';
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

const routes = ['/admin', '/admin/orders', '/admin/orders/ZB-1403-1004', '/admin/payments', '/admin/payments/PAY-7842', '/admin/products', '/admin/users', '/admin/inventory'];
const results = [];
await fs.mkdir('outputs/admin-polish', { recursive: true });
try {
  for (const width of [390, 768, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1100, deviceScaleFactor: 1, mobile: false });
    for (const route of routes) {
      await send('Page.navigate', { url: origin + route });
      await waitFor("document.readyState === 'complete' && !!document.querySelector('h1') && location.pathname === " + JSON.stringify(route));
      await evaluate('document.fonts.ready');
      await waitFor("(() => { const button = document.querySelector('button'); return button && Object.keys(button).some(key => key.startsWith('__reactProps')); })()");
      const state = await evaluate(`({ width: innerWidth, scroll: document.documentElement.scrollWidth, title: document.querySelector('h1').textContent, tables: [...document.querySelectorAll('.admin-data-table')].map(el => ({width:el.clientWidth,scroll:el.scrollWidth})), outside: [...document.querySelectorAll(".admin-content, .admin-top, .admin-desktop-sidebar")].filter(el => { const r=el.getBoundingClientRect();return r.width && (r.left < -1 || r.right > innerWidth+1); }).map(el=>({class:el.className,x:el.getBoundingClientRect().x,width:el.getBoundingClientRect().width})), clipped: [...document.querySelectorAll('.admin-cell-text, .ds-badge, .table-actions .ds-button')].filter(el => el.scrollWidth > el.clientWidth + 2).map(el=>el.textContent) })`);
      if (route === '/admin/orders' || route === '/admin/payments') {
        await waitFor("!!document.querySelector('.admin-financial-record')");
        const recordLayout = await evaluate("({ tableCount: document.querySelectorAll('.admin-resource table').length, grid: getComputedStyle(document.querySelector('.admin-financial-main')).display, broken: [...document.querySelectorAll('.admin-financial-nowrap dd')].filter(el => getComputedStyle(el).whiteSpace !== 'nowrap' || el.scrollWidth > el.clientWidth + 1).map(el => el.textContent) })");
        if (recordLayout.tableCount || recordLayout.grid !== 'grid' || recordLayout.broken.length) throw new Error(JSON.stringify(recordLayout));
        state.financial = recordLayout;
      }
      results.push({route, ...state});
      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      await fs.writeFile('outputs/admin-polish/' + width + route.replaceAll('/', '-') + '.png', Buffer.from(shot.data, 'base64'));
      if (state.scroll > width + 1 || state.clipped.length || state.outside.length) throw new Error(JSON.stringify(results.at(-1)));
      if (width === 390 && state.tables.some(table => table.scroll > table.width + 1)) throw new Error('Mobile table overflow: ' + route);
      if (state.tables.some(table => table.scroll > table.width + 1)) {
        const scrollable = await evaluate("(() => { const tables = [...document.querySelectorAll('.admin-data-table')].filter(el => el.clientWidth && el.scrollWidth > el.clientWidth); return tables.every(el => { el.scrollLeft = -el.scrollWidth; return Math.abs(el.scrollLeft) > 0; }); })()");
        if (!scrollable) throw new Error('Table cannot scroll: ' + route);
        const end = await send('Page.captureScreenshot', { format: 'png' });
        await fs.writeFile('outputs/admin-polish/' + width + route.replaceAll('/', '-') + '-scroll-end.png', Buffer.from(end.data, 'base64'));
      }
      // Exercise every existing detail tab, retaining the original tab behavior.
      const tabCount = await evaluate("document.querySelectorAll('[role=tab]').length");
      for (let tab = 0; tab < tabCount; tab++) {
        await waitFor("(() => { const el = document.querySelectorAll('[role=tab]')[" + tab + "]; return el && Object.keys(el).some(key => key.startsWith('__reactProps')); })()");
        await evaluate("document.querySelectorAll('[role=tab]')[" + tab + "].click()");
        await waitFor("document.querySelectorAll('[role=tab]')[" + tab + "].getAttribute('aria-selected') === 'true'");
        if (await evaluate('document.documentElement.scrollWidth > innerWidth + 1')) throw new Error('Detail tab overflow');
      }
    }
    console.log('Verified ' + routes.length + ' routes at ' + width);
  }
  if (exceptions.length || consoleErrors.length) throw new Error(JSON.stringify({exceptions, consoleErrors}));
} finally {
  await fs.writeFile('outputs/admin-polish/results.json', JSON.stringify({results, exceptions, consoleErrors}, null, 2));
  await send('Target.closeTarget', {targetId}); socket.close();
}
