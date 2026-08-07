(() => {
  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const response = await nativeFetch(input, init);

    let pathname = '';
    try {
      const rawUrl = typeof input === 'string' ? input : input?.url;
      pathname = new URL(rawUrl || '', window.location.href).pathname;
    } catch {
      return response;
    }

    if (pathname !== '/api/evidence-import' || response.ok) return response;

    try {
      const data = await response.clone().json();
      if (data?.code !== 'SOURCE_BLOCKED_SERVER_FETCH') return response;

      const headers = new Headers(response.headers);
      headers.set('content-type', 'application/json; charset=utf-8');
      headers.delete('content-length');
      headers.delete('content-encoding');

      return new Response(JSON.stringify({ ...data, code: 'SOURCE_BLOCKED' }), {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    } catch {
      return response;
    }
  };

  function clarifyImportFields() {
    const fiscal = document.getElementById('officialFiscalYear');
    const title = document.getElementById('officialTitle');
    const manifest = document.getElementById('officialManifestId');

    if (!fiscal || !title || !manifest) return false;

    fiscal.required = true;
    fiscal.placeholder = 'Enter fiscal year';
    fiscal.setAttribute('aria-required', 'true');

    title.required = true;
    title.placeholder = 'Enter official document title';
    title.setAttribute('aria-required', 'true');

    manifest.placeholder = 'Optional manifest document ID';

    const fiscalLabel = fiscal.closest('label');
    const titleLabel = title.closest('label');
    if (fiscalLabel && !fiscalLabel.querySelector('[data-required-note]')) {
      fiscalLabel.firstChild.textContent = 'Fiscal year ';
      fiscalLabel.insertAdjacentHTML('afterbegin', '<span data-required-note style="font-weight:600;color:#53636e">Required</span>');
    }
    if (titleLabel && !titleLabel.querySelector('[data-required-note]')) {
      titleLabel.firstChild.textContent = 'Official title ';
      titleLabel.insertAdjacentHTML('afterbegin', '<span data-required-note style="font-weight:600;color:#53636e">Required</span>');
    }

    return true;
  }

  if (!clarifyImportFields()) {
    const observer = new MutationObserver(() => {
      if (clarifyImportFields()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
