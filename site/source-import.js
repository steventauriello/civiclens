(() => {
  const IMPORT_URL = '/api/evidence-import';
  const ASSISTED_URL = '/api/evidence-assisted-import';
  let assistedFile = null;
  let assistedMode = 'owner-selected-file';

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, index)).toFixed(index ? 1 : 0)} ${units[index]}`;
  };

  function showToast(message, tone = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${tone}`;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 4800);
  }

  function metadata() {
    return {
      type: document.getElementById('officialDocumentType').value,
      fiscalYear: document.getElementById('officialFiscalYear').value.trim(),
      title: document.getElementById('officialTitle').value.trim(),
      publisher: document.getElementById('officialPublisher').value.trim(),
      manifestDocumentId: document.getElementById('officialManifestId').value.trim()
    };
  }

  function installImportButton() {
    const heading = document.querySelector('.library-panel .panel-heading');
    const uploadButton = document.getElementById('openUpload');
    if (!heading || !uploadButton || document.getElementById('openOfficialImport')) return;

    let actions = heading.querySelector('.library-heading-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'library-heading-actions';
      heading.appendChild(actions);
      actions.appendChild(uploadButton);
    }

    const button = document.createElement('button');
    button.id = 'openOfficialImport';
    button.className = 'secondary-button import-source-button';
    button.type = 'button';
    button.textContent = '↓ Import official source';
    actions.insertBefore(button, uploadButton);
    button.addEventListener('click', openImportDialog);
  }

  function ensureDialog() {
    let dialog = document.getElementById('officialImportDialog');
    if (dialog) return dialog;

    document.body.insertAdjacentHTML('beforeend', `
      <dialog id="officialImportDialog" class="official-import-dialog">
        <form id="officialImportForm" class="official-import-card">
          <div class="dialog-heading">
            <div>
              <p class="eyebrow">Evidence preservation</p>
              <h2>Import official City source</h2>
            </div>
            <button class="close-button" id="closeOfficialImport" type="button" aria-label="Close official source importer">×</button>
          </div>

          <div class="official-import-trust">
            <strong>Official City sources only</strong>
            <p>TRACE verifies the City URL first. It attempts a secure server retrieval; if the City's firewall blocks that request, TRACE switches to a browser-assisted preservation path and keeps the source-verification distinction in the evidence record.</p>
          </div>

          <label class="official-import-field" for="officialSourceUrl">Official City PDF URL
            <input id="officialSourceUrl" type="url" inputmode="url" autocomplete="off" placeholder="https://www.cityofpsl.com/files/assets/public/...pdf" required />
            <small>Chrome PDF-viewer wrappers and tracking parameters are removed automatically.</small>
          </label>

          <div class="official-import-grid">
            <label class="official-import-field" for="officialDocumentType">Document type
              <select id="officialDocumentType">
                <option value="budget">Budget or financial report</option>
                <option value="audit">Audit or ACFR</option>
                <option value="contract">Contract or procurement</option>
                <option value="meeting">Council agenda or minutes</option>
                <option value="invoice">Invoice or payment record</option>
                <option value="other">Other official record</option>
              </select>
            </label>
            <label class="official-import-field" for="officialFiscalYear">Fiscal year
              <input id="officialFiscalYear" type="text" placeholder="FY 2024-25" />
            </label>
            <label class="official-import-field" for="officialTitle">Official title
              <input id="officialTitle" type="text" placeholder="Adopted Budget FY 24/25" />
            </label>
            <label class="official-import-field" for="officialPublisher">Publisher / agency
              <input id="officialPublisher" type="text" value="City of Port St. Lucie" />
            </label>
          </div>

          <label class="official-import-field" for="officialManifestId">Manifest document ID <span>optional</span>
            <input id="officialManifestId" type="text" autocomplete="off" placeholder="psl-budget-2024-25-adopted" />
          </label>

          <div class="official-import-process" aria-label="Official import process">
            <span>1. Verify City URL</span>
            <span>2. Retrieve / select original</span>
            <span>3. Server SHA-256</span>
            <span>4. Preserve + audit</span>
          </div>

          <div id="officialImportResult" class="official-import-result" role="status" aria-live="polite" hidden></div>

          <section id="assistedImportPanel" class="official-import-fallback" hidden>
            <strong>Browser-assisted preservation</strong>
            <p>The City is blocking TRACE's server from downloading this public PDF. Open the official PDF in your browser, save it to Files if needed, then select that PDF below. TRACE will upload it directly to private R2 and the server will independently compute SHA-256 from the stored object.</p>
            <a id="openOfficialPdf" class="secondary-button official-source-link" target="_blank" rel="noopener noreferrer">1. Open official City PDF ↗</a>
            <label class="official-import-field assisted-file-label" for="assistedOfficialFile">2. Choose the official PDF from Files
              <input id="assistedOfficialFile" type="file" accept="application/pdf,.pdf" />
            </label>
            <div id="assistedFileStatus" class="assisted-file-status">No PDF selected yet.</div>
            <button id="runAssistedImport" class="primary-button full" type="button" disabled>Preserve selected official PDF</button>
            <small class="assisted-disclosure">The official URL is allowlisted and recorded. When the City blocks server retrieval, exact URL-to-file byte matching remains a reviewer step unless the browser can retrieve the City file directly.</small>
          </section>

          <div class="official-import-actions">
            <button id="cancelOfficialImport" class="secondary-button" type="button">Cancel</button>
            <button id="runOfficialImport" class="primary-button" type="submit">Import to Evidence Vault</button>
          </div>
        </form>
      </dialog>`);

    dialog = document.getElementById('officialImportDialog');
    document.getElementById('closeOfficialImport')?.addEventListener('click', () => dialog.close());
    document.getElementById('cancelOfficialImport')?.addEventListener('click', () => dialog.close());
    document.getElementById('officialImportForm')?.addEventListener('submit', runImport);
    document.getElementById('assistedOfficialFile')?.addEventListener('change', chooseAssistedFile);
    document.getElementById('runAssistedImport')?.addEventListener('click', () => preserveAssistedFile(assistedFile, assistedMode));
    return dialog;
  }

  function resetAssisted() {
    assistedFile = null;
    assistedMode = 'owner-selected-file';
    const panel = document.getElementById('assistedImportPanel');
    const input = document.getElementById('assistedOfficialFile');
    const status = document.getElementById('assistedFileStatus');
    const button = document.getElementById('runAssistedImport');
    if (panel) panel.hidden = true;
    if (input) input.value = '';
    if (status) status.textContent = 'No PDF selected yet.';
    if (button) button.disabled = true;
  }

  function openImportDialog() {
    const dialog = ensureDialog();
    const result = document.getElementById('officialImportResult');
    if (result) {
      result.hidden = true;
      result.textContent = '';
      result.dataset.tone = '';
    }
    resetAssisted();
    dialog.showModal();
    setTimeout(() => document.getElementById('officialSourceUrl')?.focus(), 30);
  }

  function chooseAssistedFile(event) {
    const file = event.target.files?.[0];
    const status = document.getElementById('assistedFileStatus');
    const button = document.getElementById('runAssistedImport');
    if (!file) {
      assistedFile = null;
      if (status) status.textContent = 'No PDF selected yet.';
      if (button) button.disabled = true;
      return;
    }
    if (!file.name.toLowerCase().endsWith('.pdf') || (file.type && file.type !== 'application/pdf')) {
      assistedFile = null;
      if (status) status.textContent = 'That file is not a PDF.';
      if (button) button.disabled = true;
      return;
    }
    assistedFile = file;
    assistedMode = 'owner-selected-file';
    if (status) status.textContent = `${file.name} · ${formatBytes(file.size)} selected`;
    if (button) button.disabled = false;
  }

  async function tryBrowserDirect(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        headers: { accept: 'application/pdf,*/*;q=0.2' }
      });
      if (!response.ok) return null;
      const blob = await response.blob();
      const prefix = new TextDecoder('ascii').decode((await blob.slice(0, 5).arrayBuffer()));
      if (prefix !== '%PDF-') return null;
      const source = new URL(url);
      const filename = decodeURIComponent(source.pathname.split('/').pop() || 'official-document.pdf');
      return new File([blob], filename, { type: 'application/pdf', lastModified: Date.now() });
    } catch {
      return null;
    }
  }

  function revealAssisted(url, message) {
    const result = document.getElementById('officialImportResult');
    const panel = document.getElementById('assistedImportPanel');
    const link = document.getElementById('openOfficialPdf');
    const mainButton = document.getElementById('runOfficialImport');
    if (result) {
      result.hidden = false;
      result.dataset.tone = 'warning';
      result.textContent = message;
    }
    if (link) link.href = url;
    if (panel) panel.hidden = false;
    if (mainButton) mainButton.hidden = true;
  }

  async function assistedApi(body) {
    const response = await fetch(ASSISTED_URL, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || 'Browser-assisted preservation failed.');
      error.code = data.code;
      error.status = response.status;
      throw error;
    }
    return data;
  }

  async function preserveAssistedFile(file, retrievalMode) {
    if (!file) return;
    const result = document.getElementById('officialImportResult');
    const button = document.getElementById('runAssistedImport');
    const sourceInput = document.getElementById('officialSourceUrl');
    const url = window.CivicLensSourceUrl?.cleanInput(sourceInput) || sourceInput.value.trim();
    const meta = metadata();

    button.disabled = true;
    button.textContent = 'Preserving & server-hashing…';
    result.hidden = false;
    result.dataset.tone = 'working';
    result.textContent = 'Uploading the selected PDF directly to private R2. TRACE will then read the stored object on the server, validate the PDF signature, calculate SHA-256, check for duplicates, and write the audit receipt.';

    try {
      const auth = await assistedApi({
        action: 'authorize',
        sourceUrl: url,
        file: { name: file.name, size: file.size, type: file.type || 'application/pdf' },
        metadata: meta,
        retrievalMode
      });

      const upload = await fetch(auth.uploadUrl, {
        method: 'PUT',
        headers: { 'content-type': 'application/pdf' },
        body: file
      });
      if (!upload.ok) throw new Error(`Private cloud upload failed (HTTP ${upload.status}).`);

      const finalized = await assistedApi({
        action: 'finalize',
        id: auth.id,
        objectKey: auth.objectKey,
        sourceUrl: url,
        file: { name: file.name, size: file.size, type: file.type || 'application/pdf' },
        metadata: meta,
        retrievalMode
      });

      if (finalized.duplicate) {
        result.dataset.tone = 'success';
        result.textContent = `Exact duplicate confirmed by server SHA-256. No second copy was kept. TRACE attached the official source metadata to the existing record: ${finalized.record.hash}. Reloading the vault…`;
        showToast('Duplicate confirmed; official metadata attached to existing evidence.');
      } else {
        result.dataset.tone = 'success';
        result.textContent = `Preserved permanently: ${finalized.record.name} · ${formatBytes(finalized.record.size)} · server SHA-256 ${finalized.record.hash}. Reloading the vault…`;
        showToast('Official evidence preserved with server-side R2 fingerprinting.');
      }
      setTimeout(() => window.location.reload(), 2200);
    } catch (error) {
      result.dataset.tone = 'error';
      result.textContent = error.message;
      showToast(error.message, 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Preserve selected official PDF';
    }
  }

  async function runImport(event) {
    event.preventDefault();
    const button = document.getElementById('runOfficialImport');
    const result = document.getElementById('officialImportResult');
    const sourceInput = document.getElementById('officialSourceUrl');
    const url = window.CivicLensSourceUrl?.cleanInput(sourceInput) || sourceInput.value.trim();

    if (!url) return;

    resetAssisted();
    button.hidden = false;
    button.disabled = true;
    button.textContent = 'Retrieving & fingerprinting…';
    result.hidden = false;
    result.dataset.tone = 'working';
    result.textContent = 'TRACE is trying to retrieve the official City PDF on the secure server.';

    try {
      const response = await fetch(IMPORT_URL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url, metadata: metadata() })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.code === 'DUPLICATE_EVIDENCE' && data.existingRecord) {
          result.dataset.tone = 'warning';
          result.textContent = `Already preserved: ${data.existingRecord.name}. SHA-256 ${data.existingRecord.hash}. No duplicate copy was created.`;
          return;
        }
        if (data.code === 'SOURCE_BLOCKED' || (data.code === 'SOURCE_FETCH_FAILED' && /403/.test(data.error || ''))) {
          result.dataset.tone = 'working';
          result.textContent = 'The City blocked the secure server request. Trying direct retrieval through your browser…';
          const browserFile = await tryBrowserDirect(url);
          if (browserFile) {
            assistedFile = browserFile;
            assistedMode = 'browser-cors-direct';
            result.textContent = `Your browser retrieved the official City PDF directly (${formatBytes(browserFile.size)}). TRACE is preserving it now and will fingerprint the stored R2 object on the server.`;
            await preserveAssistedFile(browserFile, assistedMode);
            return;
          }
          revealAssisted(url, 'The City blocks TRACE server retrieval and does not permit a direct browser data fetch. Use the browser-assisted steps below.');
          return;
        }
        throw new Error(data.error || 'Official source import failed.');
      }

      result.dataset.tone = 'success';
      result.textContent = `Preserved permanently: ${data.record.name} · ${formatBytes(data.record.size)} · SHA-256 ${data.record.hash}. Reloading the vault…`;
      showToast('Official City source preserved with server SHA-256.');
      setTimeout(() => window.location.reload(), 1700);
    } catch (error) {
      result.dataset.tone = 'error';
      result.textContent = error.message;
      showToast(error.message, 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Import to Evidence Vault';
    }
  }

  installImportButton();
})();
