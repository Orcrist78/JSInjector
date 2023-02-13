
(async () => {
  const id = '🦠injector🦠';
  const old = localStorage.getItem(id) || '';
  const input = prompt(`insert script url to inject ${ old ? `or press OK to use ”${ old }”` : ''}`).trim() || old;
  const inline = input.startsWith('javascript:');
  const module = input.startsWith('module:') ? 'type="module"' : '';
  const url = module ? input.substring(7) : inline ? input.substring(11) : input;
  

  try {
    if (!inline) if (url) new URL(url); else throw 'Nothing to inject 🤷‍';

    // Try to clean real document as possible
    [...document.querySelectorAll('*'), window, document].forEach(e => e.removeAllListeners && e.removeAllListeners());
    [...document.documentElement.attributes].forEach(({ name }) => document.documentElement.removeAttribute(name));
    for (let i = setInterval(_ => _); i >= 0; i--) clearInterval(i);
    for (let i = setTimeout(_ => _); i >= 0; i--) clearTimeout(i);
    document.documentElement.innerHTML = '';

    const html = await (await fetch(location.href)).text();
    const sandbox = 'allow-scripts allow-same-origin allow-popups allow-modals allow-forms allow-downloads';
    const { contentDocument: doc, contentWindow: win, style } = document.body.appendChild(
      Object.assign(document.createElement('iframe'), { sandbox, id })
    );
    const scripts = `
      <script> self.injector = { version: '0.0.3' }; </script>
      ${ inline ? `<script>${ url }</script>` : `<script ${ module } src="${ url }">` }
    `;

    if (old !== input) localStorage.setItem(id, input);

    onmessage = e => win.dispatchEvent(new (e.constructor)(e.type, e));

    style.cssText = 'width:100vw;height:100vh;border:0;position:fixed;left:0;top:0;z-index:99999';
    doc.open();
    doc.write(`${ scripts }${ html }`);
    doc.close();
  } catch (ex) { alert(ex.toString()) }
})();
