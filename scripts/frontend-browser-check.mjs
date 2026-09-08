import fs from 'node:fs/promises';
const origin = process.env.QA_ORIGIN ?? 'http://localhost:3000';
const browser = await fetch('http://127.0.0.1:9224/json/version').then(r => r.json());
const ws = new WebSocket(browser.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let next = 0;
const pending = new Map();
const errors = [];
let session;
ws.addEventListener('message', async event => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const call = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) call.reject(new Error(JSON.stringify(message.error))); else call.resolve(message.result);
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ': ' + (message.params.exceptionDetails.exception?.description ?? ''));
  if (message.method === 'Fetch.requestPaused') {
    const data = message.params.request.url.endsWith('/auth/me')
      ? { id: 'qa-user', mobile: '09123456789', firstName: 'QA', lastName: 'User', role: 'customer' }
      : [];
    await send('Fetch.fulfillRequest', { requestId: message.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: Buffer.from(JSON.stringify({ success: true, data })).toString('base64') }, message.sessionId);
  }
});
function send(method, params = {}, sessionId = session) {
  const id = ++next;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
session = (await send('Target.attachToTarget', { targetId, flatten: true })).sessionId;
await send('Page.enable');
await send('Runtime.enable');
await send('Fetch.enable', { patterns: [{ urlPattern: '*/api/v1/auth/me' }, { urlPattern: '*/api/v1/addresses' }] });
await send('Page.addScriptToEvaluateOnNewDocument', { source: `if (location.origin === ${JSON.stringify(origin)}) sessionStorage.setItem('pending-mobile','09123456789')` });
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(expression).catch(() => false)) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Timed out: ' + expression);
}
// SSR markup can precede hydration. Wait for React to bind the control before testing its handler.
async function waitForControl(selector) {
  await waitFor(`(() => { const element = document.querySelector(${JSON.stringify(selector)}); return element && Object.keys(element).some(key => key.startsWith('__reactProps')); })()`);
}
const routes = ['/', '/products', '/products?category=rings', '/products/ring-aftab', '/search?q=ZR-1001', '/search?q=missing', '/cart', '/checkout', '/login', '/otp', '/account', '/orders', '/orders/ZB-1403-1003', '/addresses', '/profile', '/wishlist', '/notifications', '/about', '/contact', '/faq', '/guide', '/terms', '/payment/success', '/payment/failed', '/admin', '/admin/products', '/admin/products/new', '/admin/products/1', '/admin/products/1/edit', '/admin/orders', '/admin/users', '/admin/categories', '/admin/inventory', '/admin/discounts', '/admin/banners', '/admin/payments', '/admin/audit', '/admin/settings', '/admin/roles', '/admin/content', '/admin/announcements'];
const output = [];
const interactions = [];
await fs.mkdir('outputs/frontend-qa', { recursive: true });
for (const width of [360, 480, 768, 1024, 1440]) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
  for (const route of routes) {
    const navigation = await send('Page.navigate', { url: origin + route });
    if (navigation.errorText) throw new Error(route + ': ' + navigation.errorText);
    // Wait for the actual route and initial client rendering, not a fixed screenshot of the previous page.
    for (let i = 0; i < 60; i++) {
      const ready = await evaluate(`location.href === ${JSON.stringify(origin + route)} && document.readyState === 'complete' && !!document.querySelector('h1, .hero')`).catch(() => false);
      if (ready) break;
      if (i === 59) throw new Error('Route did not render: ' + route);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    await evaluate("document.fonts.ready.then(() => new Promise(resolve => setTimeout(resolve, 120)))");
    const state = await evaluate(`({
      path: location.pathname + location.search, title: document.querySelector('h1')?.textContent,
      width: innerWidth, scroll: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll('body *')].filter(el => {
        const box = el.getBoundingClientRect(); const style = getComputedStyle(el);
        if (!box.width || style.position === 'fixed') return false;
        if (el.closest('.ds-table-wrapper, .account-nav nav, .product-gallery__thumbnails, .admin-tabs')) return false;
        return box.left < -1 || box.right > innerWidth + 1;
      }).slice(0, 10).map(el => el.tagName + '.' + el.className)
    })`);
    output.push({ route, viewport: width, ...state });
    if (['/', '/products/ring-aftab', '/cart', '/checkout', '/account', '/admin/products'].includes(route)) {
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      await fs.writeFile(`outputs/frontend-qa/${width}-${route.replace(/[^a-z0-9]+/gi, '-') || 'home'}.png`, Buffer.from(shot.data, 'base64'));
    }
  }
  await send('Page.navigate', { url: origin });
  await waitForControl('.header-search__trigger');
  await evaluate("document.querySelector('.header-search__trigger').click()");
  await waitFor("!!document.querySelector('.header-search__input')");
  const search = await evaluate(`({ focused: document.activeElement?.matches('.header-search__input'), width: document.documentElement.scrollWidth, viewport: innerWidth })`);
  if (!search.focused || search.width > width) throw new Error('Header search layout/focus failed at ' + width);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await evaluate("new Promise(resolve => setTimeout(resolve, 100))");
  if (await evaluate("!!document.querySelector('.header-search__input')")) throw new Error('Search did not close');
  if (width < 1024) {
    await send('Page.navigate', { url: origin + '/admin/products' });
    await waitForControl('.admin-menu-toggle');
    await evaluate("document.querySelector('.admin-menu-toggle').click()");
    await waitFor("!!document.querySelector('[role=dialog]') && document.body.style.overflow === 'hidden'");
    const drawer = await evaluate(`({ open: !!document.querySelector('[role=dialog]'), width: document.documentElement.scrollWidth, locked: document.body.style.overflow === 'hidden' })`);
    if (!drawer.open || !drawer.locked || drawer.width > width) throw new Error('Admin drawer failed at ' + width);
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  }
  interactions.push({ width, search: 'passed', drawer: width < 1024 ? 'passed' : 'desktop sidebar' });
  process.stdout.write('Checked ' + routes.length + ' routes at ' + width + 'px\n');
}
await fs.writeFile('outputs/frontend-qa/results.json', JSON.stringify({ output, interactions, errors }, null, 2));
console.log(JSON.stringify({ checked: output.length, overflow: output.filter(row => row.scroll > row.width + 1), errors }, null, 2));
await send('Target.closeTarget', { targetId });
ws.close();
