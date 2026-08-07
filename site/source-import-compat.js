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

  const auditLabels = {
    'session.login': 'Signed in',
    'session.logout': 'Signed out',
    'evidence.upload_authorized': 'Upload authorized',
    'evidence.upload_completed': 'Evidence uploaded',
    'evidence.viewed': 'Evidence viewed',
    'evidence.updated': 'Evidence updated',
    'evidence.archived': 'Evidence archived',
    'evidence.official_imported': 'Official source preserved',
    'evidence.official_import_duplicate': 'Duplicate official source detected',
    'evidence.official_import_failed': 'Official source import blocked',
    'evidence.official_assisted_authorized': 'Assisted import authorized',
    'evidence.official_assisted_duplicate_attached': 'Duplicate confirmed — metadata attached',
    'evidence.official_assisted_preserved': 'Assisted official source preserved'
  };

  const displayedToRaw = {
    'Signed in': 'session.login',
    'Signed out': 'session.logout',
    'Upload authorized': 'evidence.upload_authorized',
    'Evidence uploaded': 'evidence.upload_completed',
    'Evidence viewed': 'evidence.viewed',
    'Evidence updated': 'evidence.updated',
    'Evidence archived': 'evidence.archived'
  };

  function enhanceAuditLabels(root = document) {
    root.querySelectorAll?.('.audit-event__top strong:not([data-audit-humanized])').forEach((heading) => {
      const shown = heading.textContent.trim();
      const raw = auditLabels[shown] ? shown : displayedToRaw[shown];
      if (!raw) return;

      const label = auditLabels[raw] || shown;
      heading.dataset.auditHumanized = 'true';
      heading.textContent = '';

      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      heading.appendChild(labelSpan);

      const code = document.createElement('code');
      code.textContent = raw;
      code.setAttribute('aria-label', `Audit event code ${raw}`);
      Object.assign(code.style, {
        display: 'block',
        marginTop: '4px',
        fontSize: '10px',
        lineHeight: '1.35',
        fontWeight: '600',
        color: '#6b7b86',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word'
      });
      heading.appendChild(code);
    });
  }

  const auditObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches?.('.audit-event') || node.querySelector?.('.audit-event')) {
          enhanceAuditLabels(node.matches?.('.audit-event') ? node.parentElement || node : node);
        }
      }
    }
  });

  auditObserver.observe(document.body, { childList: true, subtree: true });
  enhanceAuditLabels();
})();
