
(async () => {
  const id = '🦠injector🦠';
  const html = await (await fetch(location.href)).text();
  const sandbox = 'allow-scripts allow-same-origin allow-popups allow-modals allow-forms allow-downloads';
  const old = localStorage.getItem(id);
  const url = prompt(`insert script url to inject ${ old ? `or press OK to use "${ old }"` : ''}`) || old;

  try {
    url && new URL(url);
    document.documentElement.innerHTML = '';
    const { contentDocument: doc, contentWindow: win, style } = document.body.appendChild(
      Object.assign(document.createElement('iframe'), { sandbox, id })
    );
    const scripts = `
      <script> window.injector = { version: '0.0.1' }; </script>
      ${ url ? `<script src="${ url }">` : '' }
    `;

    if (old !== url) localStorage.setItem(id, url);

    onmessage = e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      win.dispatchEvent(new (e.constructor)(e.type, e));
    };

    style.cssText = `width:100vw;height:100vh;border:0;position:fixed;left:0;top:0;z-index:99999`;
    doc.open();
    doc.write(`${ scripts }${ html }`);
    doc.close();
  } catch (ex) { alert(ex.toString()) }
})();
