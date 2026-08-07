(() => {
  const AUTH_URL = '/api/evidence-auth';
  const STORAGE_URL = '/api/evidence-storage';
  const LEGACY_SESSION_KEY = 'civiclens-admin-key';
  const SESSION_SENTINEL = 'http-only-session';

  function showToast(message, tone = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${tone}`;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 4200);
  }

  async function authRequest(method = 'GET', body) {
    const response = await fetch(AUTH_URL, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store'
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || 'Authentication request failed.');
      error.status = response.status;
      throw error;
    }
    return data;
  }

  async function secureStorageRequest(body) {
    const response = await fetch(STORAGE_URL, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store'
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || 'Evidence Vault request failed.');
      error.status = response.status;
      throw error;
    }
    return data;
  }

  function removeLegacySecret() {
    const existing = sessionStorage.getItem(LEGACY_SESSION_KEY);
    if (existing && existing !== SESSION_SENTINEL) sessionStorage.removeItem(LEGACY_SESSION_KEY);
  }

  function installSessionBadge(authenticated) {
    let badge = document.getElementById('securitySessionBadge');
    if (!badge) {
      badge = document.createElement('span');
      badge.id = 'securitySessionBadge';
      badge.className = 'security-session-badge';
      document.querySelector('.topbar')?.appendChild(badge);
    }
    badge.textContent = authenticated ? 'SECURE SESSION' : 'SIGNED OUT';
    badge.dataset.state = authenticated ? 'secure' : 'locked';
  }

  function enhanceStorageDialog() {
    const label = document.querySelector('label[for="storageAdminKey"]');
    const help = document.querySelector('.storage-help');
    const connect = document.getElementById('connectStorage');
    const forget = document.getElementById('forgetStorageKey');
    const connected = document.getElementById('storageConnectedArea');

    if (label) label.textContent = 'CivicLens owner key';
    if (help) help.textContent = 'Your key is sent once over HTTPS to create a secure HttpOnly session. The key itself is not saved in browser storage.';
    if (connect) connect.textContent = 'Secure sign in';
    if (forget) forget.textContent = 'Sign out on this device';

    if (connected && !document.getElementById('viewAuditTrail')) {
      const button = document.createElement('button');
      button.id = 'viewAuditTrail';
      button.className = 'secondary-button full storage-secondary-action';
      button.type = 'button';
      button.textContent = 'View security & audit trail';
      connected.insertBefore(button, forget || null);
      button.addEventListener('click', openAuditTrail);
    }
  }

  function formatAction(action) {
    const labels = {
      'session.login': 'Signed in',
      'session.logout': 'Signed out',
      'evidence.upload_authorized': 'Upload authorized',
      'evidence.upload_completed': 'Evidence uploaded',
      'evidence.viewed': 'Evidence viewed',
      'evidence.updated': 'Evidence updated',
      'evidence.archived': 'Evidence archived'
    };
    return labels[action] || action;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function ensureAuditDialog() {
    if (document.getElementById('auditDialog')) return document.getElementById('auditDialog');
    document.body.insertAdjacentHTML('beforeend', `
      <dialog id="auditDialog" class="audit-dialog">
        <section class="audit-dialog__card">
          <div class="dialog-heading">
            <div><p class="eyebrow">Security record</p><h2>Evidence Vault audit trail</h2></div>
            <button class="close-button" id="closeAuditDialog" type="button" aria-label="Close audit trail">×</button>
          </div>
          <p class="audit-intro">CivicLens records administrative activity so changes to the evidence library can be traced.</p>
          <div id="auditEvents" class="audit-events"><p>Loading audit events…</p></div>
        </section>
      </dialog>`);
    document.getElementById('closeAuditDialog')?.addEventListener('click', () => document.getElementById('auditDialog').close());
    return document.getElementById('auditDialog');
  }

  async function openAuditTrail() {
    const dialog = ensureAuditDialog();
    const container = document.getElementById('auditEvents');
    container.innerHTML = '<p>Loading audit events…</p>';
    dialog.showModal();
    try {
      const data = await secureStorageRequest({ action: 'audit-list', limit: 60 });
      const events = data.events || [];
      if (!events.length) {
        container.innerHTML = '<div class="audit-empty"><strong>No audit activity yet</strong><p>Security and evidence events will appear here as you use the permanent vault.</p></div>';
        return;
      }
      container.innerHTML = events.map((event) => {
        const details = event.details || {};
        const recordId = details.recordId ? `<span>Record: ${escapeHtml(String(details.recordId).slice(0, 12))}…</span>` : '';
        const filename = details.filename ? `<span>${escapeHtml(details.filename)}</span>` : '';
        const outcome = event.outcome ? `<span>Outcome: ${escapeHtml(event.outcome)}</span>` : '';
        return `<article class="audit-event">
          <div class="audit-event__top"><strong>${escapeHtml(formatAction(event.action))}</strong><time>${escapeHtml(new Date(event.timestamp).toLocaleString())}</time></div>
          <div class="audit-event__meta"><span>Actor: ${escapeHtml(event.actor?.role || 'unknown')}</span>${outcome}${filename}${recordId}</div>
        </article>`;
      }).join('');
    } catch (error) {
      container.innerHTML = `<div class="audit-empty"><strong>Could not load audit trail</strong><p>${escapeHtml(error.message)}</p></div>`;
    }
  }

  async function secureLogin(button) {
    const input = document.getElementById('storageAdminKey');
    const key = input?.value.trim() || '';
    if (!key) return showToast('Enter the CivicLens owner key.', 'error');

    const oldText = button.textContent;
    button.disabled = true;
    button.textContent = 'Signing in securely…';
    try {
      await authRequest('POST', { key });
      if (input) input.value = '';
      sessionStorage.setItem(LEGACY_SESSION_KEY, SESSION_SENTINEL);
      showToast('Secure Evidence Vault session started.');
      window.location.reload();
    } catch (error) {
      if (input) input.value = '';
      sessionStorage.removeItem(LEGACY_SESSION_KEY);
      showToast(error.status === 401 ? 'That owner key is not correct.' : error.message, 'error');
      button.disabled = false;
      button.textContent = oldText;
    }
  }

  async function secureLogout(button) {
    const oldText = button.textContent;
    button.disabled = true;
    button.textContent = 'Signing out…';
    try {
      await authRequest('DELETE');
    } catch (error) {
      console.error(error);
    } finally {
      sessionStorage.removeItem(LEGACY_SESSION_KEY);
      showToast('Evidence Vault signed out.');
      window.location.reload();
      button.textContent = oldText;
    }
  }

  document.addEventListener('click', (event) => {
    const connect = event.target.closest?.('#connectStorage');
    if (connect) {
      event.preventDefault();
      event.stopImmediatePropagation();
      secureLogin(connect);
      return;
    }

    const forget = event.target.closest?.('#forgetStorageKey');
    if (forget) {
      event.preventDefault();
      event.stopImmediatePropagation();
      secureLogout(forget);
    }
  }, true);

  const observer = new MutationObserver(enhanceStorageDialog);
  observer.observe(document.body, { childList: true, subtree: true });
  enhanceStorageDialog();

  (async () => {
    removeLegacySecret();
    try {
      const status = await authRequest('GET');
      installSessionBadge(Boolean(status.authenticated));
      if (status.authenticated && sessionStorage.getItem(LEGACY_SESSION_KEY) !== SESSION_SENTINEL) {
        sessionStorage.setItem(LEGACY_SESSION_KEY, SESSION_SENTINEL);
        window.location.reload();
      }
      if (!status.authenticated) sessionStorage.removeItem(LEGACY_SESSION_KEY);
    } catch (error) {
      console.error(error);
      installSessionBadge(false);
      sessionStorage.removeItem(LEGACY_SESSION_KEY);
    }
  })();
})();
