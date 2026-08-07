// Deploy preview refresh: 2026-08-07T08:46-04:00
(() => {
  const IMPORT_URL = '/api/evidence-import';

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
            <strong>Direct official sources only</strong>
            <p>CivicLens accepts direct PDF files from the approved City of Port St. Lucie public-files domain. The server retrieves the original, verifies the PDF signature, computes SHA-256, preserves it in private R2 storage, and writes an audit event.</p>
          </div>

          <label class="official-import-field" for="officialSourceUrl">Official City PDF URL
            <input id="officialSourceUrl" type="url" inputmode="url" autocomplete="off" placeholder="https://www.cityofpsl.com/files/assets/public/...pdf" required />
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
            <span>2. Retrieve original</span>
            <span>3. Server SHA-256</span>
            <span>4. Preserve + audit</span>
          </div>

          <div id="officialImportResult" class="official-import-result" role="status" aria-live="polite" hidden></div>

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
    return dialog;
  }

  function openImportDialog() {
    const dialog = ensureDialog();
    const result = document.getElementById('officialImportResult');
    if (result) {
      result.hidden = true;
      result.textContent = '';
      result.dataset.tone = '';
    }
    dialog.showModal();
    setTimeout(() => document.getElementById('officialSourceUrl')?.focus(), 30);
  }

  async function runImport(event) {
    event.preventDefault();
    const button = document.getElementById('runOfficialImport');
    const result = document.getElementById('officialImportResult');
    const url = document.getElementById('officialSourceUrl').value.trim();

    if (!url) return;

    button.disabled = true;
    button.textContent = 'Retrieving & fingerprinting…';
    result.hidden = false;
    result.dataset.tone = 'working';
    result.textContent = 'CivicLens is retrieving the official source on the server, validating it, calculating SHA-256, and preserving the original. Large City reports can take a little while.';

    try {
      const response = await fetch(IMPORT_URL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          url,
          metadata: {
            type: document.getElementById('officialDocumentType').value,
            fiscalYear: document.getElementById('officialFiscalYear').value.trim(),
            title: document.getElementById('officialTitle').value.trim(),
            publisher: document.getElementById('officialPublisher').value.trim(),
            manifestDocumentId: document.getElementById('officialManifestId').value.trim()
          }
        })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.code === 'DUPLICATE_EVIDENCE' && data.existingRecord) {
          result.dataset.tone = 'warning';
          result.textContent = `Already preserved: ${data.existingRecord.name}. SHA-256 ${data.existingRecord.hash}. No duplicate copy was created.`;
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
