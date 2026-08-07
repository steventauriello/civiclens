(() => {
  const DB_NAME = 'civiclens-evidence-vault';
  const STORE = 'documents';
  const API_URL = '/api/evidence-storage';
  const ADMIN_KEY_SESSION = 'civiclens-admin-key';

  let db;
  let selectedRef = null;
  let selectedFiles = [];
  let activeFilter = 'all';
  let currentObjectUrl = null;
  let remoteRecords = [];
  let storageConfigured = false;
  let cloudUnlocked = false;
  let pendingOpenUpload = false;

  const el = (id) => document.getElementById(id);
  const uploadDialog = el('uploadDialog');
  const fileInput = el('fileInput');
  const dropZone = el('dropZone');
  const selectedFilesEl = el('selectedFiles');
  const ingestButton = el('ingestButton');
  const documentList = el('documentList');
  const emptyLibrary = el('emptyLibrary');
  const viewerEmpty = el('viewerEmpty');
  const viewerContent = el('viewerContent');
  const librarySearch = el('librarySearch');

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, index)).toFixed(index ? 1 : 0)} ${units[index]}`;
  }

  function showToast(message, tone = 'success') {
    const toast = el('toast');
    toast.textContent = message;
    toast.className = `toast ${tone}`;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 4200);
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        const store = database.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('uploadedAt', 'uploadedAt');
        store.createIndex('type', 'type');
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function transaction(mode = 'readonly') {
    return db.transaction(STORE, mode).objectStore(STORE);
  }

  function getAllLocalDocuments() {
    return new Promise((resolve, reject) => {
      const request = transaction().getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => String(b.uploadedAt).localeCompare(String(a.uploadedAt))));
      request.onerror = () => reject(request.error);
    });
  }

  function getLocalDocument(id) {
    return new Promise((resolve, reject) => {
      const request = transaction().get(Number(id));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function putLocalDocument(document) {
    return new Promise((resolve, reject) => {
      const request = transaction('readwrite').put(document);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function deleteLocalDocument(id) {
    return new Promise((resolve, reject) => {
      const request = transaction('readwrite').delete(Number(id));
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async function hashFile(file) {
    if (!crypto.subtle) return 'Hash unavailable in this browser';
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function getAdminKey() {
    return sessionStorage.getItem(ADMIN_KEY_SESSION) || '';
  }

  async function storageApi(body) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-civiclens-admin-key': getAdminKey()
      },
      body: JSON.stringify(body)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || 'Storage request failed.');
      error.status = response.status;
      error.code = data.code;
      throw error;
    }
    return data;
  }

  function installStorageControls() {
    const tile = document.querySelector('.status-strip > div:last-child');
    if (tile) {
      tile.innerHTML = `
        <button class="storage-status-button" id="storageStatusButton" type="button">
          <span>Storage</span><strong id="storageStatusText">Checking…</strong>
        </button>`;
    }

    document.body.insertAdjacentHTML('beforeend', `
      <dialog id="storageDialog" class="storage-dialog">
        <section class="storage-dialog__card">
          <div class="dialog-heading">
            <div><p class="eyebrow">Evidence Vault storage</p><h2>Permanent document storage</h2></div>
            <button class="close-button" id="closeStorageDialog" type="button" aria-label="Close storage settings">×</button>
          </div>
          <div class="storage-provider-card">
            <div><span class="storage-provider-dot" id="storageProviderDot"></span><strong id="storageProviderTitle">Checking storage…</strong></div>
            <p id="storageProviderMessage">Checking the CivicLens storage backend.</p>
          </div>
          <div id="storageUnlockArea">
            <label class="storage-key-label" for="storageAdminKey">CivicLens admin key</label>
            <input id="storageAdminKey" type="password" autocomplete="current-password" placeholder="Enter admin key" />
            <p class="storage-help">The key is kept only for this browser session and is never stored in the repository.</p>
            <button class="primary-button full" id="connectStorage" type="button">Unlock cloud storage</button>
          </div>
          <div id="storageConnectedArea" hidden>
            <div class="storage-connected-banner"><strong>Cloud storage unlocked</strong><span>New uploads will be stored permanently in R2.</span></div>
            <button class="secondary-button full" id="migrateLocalRecords" type="button">Move local records to permanent storage</button>
            <button class="secondary-button full storage-secondary-action" id="forgetStorageKey" type="button">Lock cloud storage on this device</button>
          </div>
        </section>
      </dialog>`);

    el('storageStatusButton')?.addEventListener('click', openStorageDialog);
    el('closeStorageDialog')?.addEventListener('click', () => el('storageDialog').close());
    el('connectStorage')?.addEventListener('click', connectStorage);
    el('forgetStorageKey')?.addEventListener('click', () => {
      sessionStorage.removeItem(ADMIN_KEY_SESSION);
      cloudUnlocked = false;
      remoteRecords = [];
      updateStorageUi();
      refreshLibrary();
    });
    el('migrateLocalRecords')?.addEventListener('click', migrateLocalRecords);
  }

  function openStorageDialog() {
    updateStorageUi();
    el('storageDialog').showModal();
    setTimeout(() => {
      if (!cloudUnlocked && storageConfigured) el('storageAdminKey')?.focus();
    }, 30);
  }

  function updateStorageUi() {
    const status = el('storageStatusText');
    const title = el('storageProviderTitle');
    const message = el('storageProviderMessage');
    const dot = el('storageProviderDot');
    const unlockArea = el('storageUnlockArea');
    const connectedArea = el('storageConnectedArea');

    if (!storageConfigured) {
      if (status) status.textContent = 'Local only';
      if (title) title.textContent = 'Cloud storage setup required';
      if (message) message.textContent = 'The permanent R2 backend is built, but its Netlify environment variables still need to be connected.';
      if (dot) dot.dataset.state = 'offline';
      if (unlockArea) unlockArea.hidden = true;
      if (connectedArea) connectedArea.hidden = true;
      return;
    }

    if (cloudUnlocked) {
      if (status) status.textContent = 'Permanent cloud';
      if (title) title.textContent = 'Cloudflare R2 connected';
      if (message) message.textContent = 'Original evidence files are stored independently of this browser and survive new deploys.';
      if (dot) dot.dataset.state = 'online';
      if (unlockArea) unlockArea.hidden = true;
      if (connectedArea) connectedArea.hidden = false;
    } else {
      if (status) status.textContent = 'Cloud locked';
      if (title) title.textContent = 'Cloudflare R2 is configured';
      if (message) message.textContent = 'Enter the CivicLens admin key to view and upload permanent evidence records.';
      if (dot) dot.dataset.state = 'locked';
      if (unlockArea) unlockArea.hidden = false;
      if (connectedArea) connectedArea.hidden = true;
    }
  }

  async function checkStorageStatus() {
    try {
      const response = await fetch(API_URL, { cache: 'no-store' });
      const data = await response.json();
      storageConfigured = Boolean(data.configured);
      updateStorageUi();
      if (storageConfigured && getAdminKey()) {
        await loadCloudRecords();
      }
    } catch (error) {
      console.error(error);
      storageConfigured = false;
      updateStorageUi();
    }
  }

  async function connectStorage() {
    const key = el('storageAdminKey').value.trim();
    if (!key) return showToast('Enter the CivicLens admin key.', 'error');
    sessionStorage.setItem(ADMIN_KEY_SESSION, key);
    el('connectStorage').disabled = true;
    el('connectStorage').textContent = 'Connecting…';
    try {
      await loadCloudRecords();
      el('storageDialog').close();
      showToast('Permanent cloud storage unlocked.');
      if (pendingOpenUpload) {
        pendingOpenUpload = false;
        openUploadDialog();
      }
    } catch (error) {
      sessionStorage.removeItem(ADMIN_KEY_SESSION);
      cloudUnlocked = false;
      updateStorageUi();
      showToast(error.status === 401 ? 'That admin key is not correct.' : error.message, 'error');
    } finally {
      el('connectStorage').disabled = false;
      el('connectStorage').textContent = 'Unlock cloud storage';
    }
  }

  async function loadCloudRecords() {
    const data = await storageApi({ action: 'list' });
    remoteRecords = data.records || [];
    cloudUnlocked = true;
    updateStorageUi();
    await refreshLibrary();
  }

  function decorateRecord(record, storage) {
    return {
      ...record,
      _storage: storage,
      _ref: `${storage}:${record.id}`
    };
  }

  async function allRecords() {
    const local = (await getAllLocalDocuments()).map((doc) => decorateRecord(doc, 'local'));
    const cloud = remoteRecords.map((doc) => decorateRecord(doc, 'cloud'));
    return [...cloud, ...local].sort((a, b) => String(b.uploadedAt).localeCompare(String(a.uploadedAt)));
  }

  async function refreshLibrary() {
    const documents = await allRecords();
    const query = librarySearch.value.trim().toLowerCase();
    const filtered = documents.filter((doc) => {
      const matchesFilter = activeFilter === 'all' || doc.type === activeFilter || (activeFilter === 'other' && !['budget', 'audit', 'contract'].includes(doc.type));
      const haystack = `${doc.name} ${doc.publisher} ${doc.fiscalYear} ${doc.type}`.toLowerCase();
      return matchesFilter && haystack.includes(query);
    });

    documentList.innerHTML = filtered.map((doc) => `
      <button class="document-card ${doc._ref === selectedRef ? 'active' : ''}" data-document-ref="${escapeHtml(doc._ref)}" type="button">
        <div class="document-card__top">
          <span class="doc-icon">${doc.mime === 'application/pdf' ? 'PDF' : 'IMG'}</span>
          <span><strong>${escapeHtml(doc.name)}</strong><small>${escapeHtml(doc.fiscalYear || 'Fiscal year not set')} · ${formatBytes(doc.size)}</small></span>
        </div>
        <div class="document-card__footer">
          <span class="doc-status ${doc.status}">${doc.status === 'verified' ? 'Verified' : 'Awaiting review'}</span>
          <span class="storage-badge ${doc._storage}">${doc._storage === 'cloud' ? 'Permanent' : 'This device'}</span>
        </div>
      </button>
    `).join('');

    emptyLibrary.hidden = documents.length > 0;
    documentList.hidden = filtered.length === 0;
    if (documents.length > 0 && filtered.length === 0) {
      emptyLibrary.hidden = false;
      emptyLibrary.querySelector('strong').textContent = 'No matching records';
      emptyLibrary.querySelector('p').textContent = 'Change the search or document filter.';
    } else if (documents.length === 0) {
      emptyLibrary.querySelector('strong').textContent = 'No records uploaded yet';
      emptyLibrary.querySelector('p').textContent = 'Add an official PDF, scanned document, or image to begin the evidence review workflow.';
    }

    documentList.querySelectorAll('[data-document-ref]').forEach((button) => {
      button.addEventListener('click', () => selectDocument(button.dataset.documentRef));
    });

    el('documentCount').textContent = documents.length;
    el('reviewCount').textContent = documents.filter((doc) => doc.status !== 'verified').length;
    el('verifiedCount').textContent = documents.filter((doc) => doc.status === 'verified').length;
  }

  async function resolveDocument(ref) {
    const [storage, rawId] = String(ref).split(':');
    if (storage === 'local') {
      const doc = await getLocalDocument(rawId);
      return doc ? decorateRecord(doc, 'local') : null;
    }
    const existing = remoteRecords.find((doc) => String(doc.id) === rawId);
    return existing ? decorateRecord(existing, 'cloud') : null;
  }

  async function selectDocument(ref) {
    let doc = await resolveDocument(ref);
    if (!doc) return;
    selectedRef = ref;
    viewerEmpty.hidden = true;
    viewerContent.hidden = false;

    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }

    let previewUrl;
    if (doc._storage === 'cloud') {
      try {
        const data = await storageApi({ action: 'sign-read', id: doc.id });
        doc = decorateRecord(data.record, 'cloud');
        previewUrl = data.downloadUrl;
      } catch (error) {
        showToast(error.message, 'error');
        return;
      }
    } else {
      currentObjectUrl = URL.createObjectURL(doc.file);
      previewUrl = currentObjectUrl;
    }

    el('viewerType').textContent = `${doc.typeLabel} · ${doc.status === 'verified' ? 'Verified' : 'Review required'}`;
    el('viewerTitle').textContent = doc.name;
    el('viewerSubtitle').textContent = `${doc.publisher || 'Publisher not recorded'} · ${doc.fiscalYear || 'Fiscal year not recorded'}`;
    el('metaStatus').innerHTML = `<span class="doc-status ${doc.status}">${doc.status === 'verified' ? 'Verified' : 'Awaiting review'}</span> <span class="storage-badge ${doc._storage}">${doc._storage === 'cloud' ? 'Permanent cloud' : 'This device only'}</span>`;
    el('metaType').textContent = doc.typeLabel;
    el('metaYear').textContent = doc.fiscalYear || 'Not recorded';
    el('metaPublisher').textContent = doc.publisher || 'Not recorded';
    el('metaSource').innerHTML = doc.sourceUrl ? `<a href="${escapeHtml(doc.sourceUrl)}" target="_blank" rel="noopener noreferrer">Official source ↗</a>` : 'Not recorded';
    el('metaUploaded').textContent = new Date(doc.uploadedAt).toLocaleString();
    el('metaSize').textContent = formatBytes(doc.size);
    el('metaHash').textContent = doc.hash || 'Not recorded';
    el('reviewNotes').value = doc.notes || '';
    el('markVerified').textContent = doc.status === 'verified' ? 'Return to review' : 'Mark verified';

    const pdfPreview = el('pdfPreview');
    const imagePreview = el('imagePreview');
    const unsupportedPreview = el('unsupportedPreview');
    pdfPreview.hidden = imagePreview.hidden = unsupportedPreview.hidden = true;
    pdfPreview.removeAttribute('src');
    imagePreview.removeAttribute('src');

    if (doc.mime === 'application/pdf' || doc.name.toLowerCase().endsWith('.pdf')) {
      pdfPreview.src = previewUrl;
      pdfPreview.hidden = false;
    } else if (doc.mime.startsWith('image/')) {
      imagePreview.src = previewUrl;
      imagePreview.hidden = false;
    } else {
      unsupportedPreview.hidden = false;
    }

    el('openOriginal').onclick = () => window.open(previewUrl, '_blank', 'noopener');
    await refreshLibrary();
  }

  function resetUploadForm() {
    selectedFiles = [];
    fileInput.value = '';
    selectedFilesEl.innerHTML = '';
    ingestButton.disabled = true;
    el('fiscalYear').value = '';
    el('sourceUrl').value = '';
  }

  function renderSelectedFiles() {
    selectedFilesEl.innerHTML = selectedFiles.map((file) => `
      <div class="selected-file"><span>${escapeHtml(file.name)}</span><strong>${formatBytes(file.size)}</strong></div>
    `).join('');
    ingestButton.disabled = selectedFiles.length === 0;
  }

  function acceptFiles(files, append = false) {
    const allowed = [...files].filter((file) => file.type === 'application/pdf' || file.type.startsWith('image/') || /\.(pdf|png|jpe?g|tiff?)$/i.test(file.name));
    if (allowed.length !== files.length) showToast('Some unsupported files were skipped.', 'error');
    const nextFiles = append ? [...selectedFiles, ...allowed] : allowed;
    selectedFiles = nextFiles.filter((file, index, all) => all.findIndex((candidate) => candidate.name === file.name && candidate.size === file.size && candidate.lastModified === file.lastModified) === index);
    renderSelectedFiles();
  }

  function currentUploadMetadata() {
    return {
      type: el('documentType').value,
      typeLabel: el('documentType').selectedOptions[0].textContent,
      fiscalYear: el('fiscalYear').value.trim(),
      publisher: el('publisher').value.trim(),
      sourceUrl: el('sourceUrl').value.trim()
    };
  }

  async function uploadFileToCloud(file, metadata) {
    const hash = await hashFile(file);
    const signed = await storageApi({
      action: 'sign-upload',
      file: { name: file.name, type: file.type || 'application/octet-stream', size: file.size },
      metadata
    });

    const uploadResponse = await fetch(signed.uploadUrl, {
      method: 'PUT',
      headers: { 'content-type': file.type || 'application/octet-stream' },
      body: file
    });
    if (!uploadResponse.ok) throw new Error(`Cloud upload failed with status ${uploadResponse.status}. Check the R2 CORS policy.`);

    const finalized = await storageApi({
      action: 'finalize-upload',
      id: signed.id,
      objectKey: signed.objectKey,
      file: { name: file.name, type: file.type || 'application/octet-stream', size: file.size },
      metadata,
      hash
    });
    return finalized.record;
  }

  async function ingestFiles() {
    if (storageConfigured && !cloudUnlocked) {
      pendingOpenUpload = true;
      uploadDialog.close();
      openStorageDialog();
      return;
    }

    ingestButton.disabled = true;
    const metadata = currentUploadMetadata();
    const usingCloud = storageConfigured && cloudUnlocked;

    try {
      let firstRef;
      for (let index = 0; index < selectedFiles.length; index += 1) {
        const file = selectedFiles[index];
        ingestButton.textContent = `${usingCloud ? 'Uploading' : 'Saving'} ${index + 1} of ${selectedFiles.length}…`;

        if (usingCloud) {
          const record = await uploadFileToCloud(file, metadata);
          remoteRecords.unshift(record);
          if (!firstRef) firstRef = `cloud:${record.id}`;
        } else {
          const id = await putLocalDocument({
            ...metadata,
            name: file.name,
            mime: file.type || 'application/octet-stream',
            size: file.size,
            lastModified: file.lastModified,
            hash: await hashFile(file),
            status: 'review',
            notes: '',
            uploadedAt: new Date().toISOString(),
            file
          });
          if (!firstRef) firstRef = `local:${id}`;
        }
      }

      uploadDialog.close();
      resetUploadForm();
      await refreshLibrary();
      if (firstRef) await selectDocument(firstRef);
      showToast(usingCloud ? 'Evidence record stored permanently in cloud storage.' : 'Saved on this device only. Configure cloud storage for permanent access.');
    } catch (error) {
      console.error(error);
      showToast(error.message || 'The evidence record could not be stored.', 'error');
    } finally {
      ingestButton.textContent = 'Add to Evidence Vault';
      ingestButton.disabled = selectedFiles.length === 0;
    }
  }

  async function migrateLocalRecords() {
    const button = el('migrateLocalRecords');
    const localDocuments = await getAllLocalDocuments();
    if (!localDocuments.length) return showToast('There are no local records to move.');
    if (!confirm(`Move ${localDocuments.length} local record${localDocuments.length === 1 ? '' : 's'} to permanent cloud storage? Local copies will be removed only after each upload succeeds.`)) return;

    button.disabled = true;
    try {
      for (let index = 0; index < localDocuments.length; index += 1) {
        const doc = localDocuments[index];
        button.textContent = `Moving ${index + 1} of ${localDocuments.length}…`;
        const metadata = {
          type: doc.type,
          typeLabel: doc.typeLabel,
          fiscalYear: doc.fiscalYear,
          publisher: doc.publisher,
          sourceUrl: doc.sourceUrl,
          title: doc.title || doc.name
        };
        const record = await uploadFileToCloud(doc.file, metadata);
        remoteRecords.unshift({ ...record, notes: doc.notes || '', status: doc.status || 'review' });
        if (doc.notes || doc.status === 'verified') {
          const updated = await storageApi({ action: 'update', id: record.id, patch: { notes: doc.notes || '', status: doc.status || 'review' } });
          const recordIndex = remoteRecords.findIndex((item) => item.id === record.id);
          if (recordIndex >= 0) remoteRecords[recordIndex] = updated.record;
        }
        await deleteLocalDocument(doc.id);
      }
      await loadCloudRecords();
      showToast('Local evidence moved to permanent cloud storage.');
      el('storageDialog').close();
    } catch (error) {
      console.error(error);
      showToast(`Migration stopped: ${error.message}`, 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Move local records to permanent storage';
      await refreshLibrary();
    }
  }

  function openUploadDialog() {
    if (storageConfigured && !cloudUnlocked) {
      pendingOpenUpload = true;
      openStorageDialog();
      return;
    }
    resetUploadForm();
    uploadDialog.showModal();
    setTimeout(() => dropZone.focus(), 20);
  }

  async function updateSelectedRecord(patch) {
    if (!selectedRef) return null;
    const doc = await resolveDocument(selectedRef);
    if (!doc) return null;

    if (doc._storage === 'cloud') {
      const data = await storageApi({ action: 'update', id: doc.id, patch });
      const index = remoteRecords.findIndex((item) => item.id === doc.id);
      if (index >= 0) remoteRecords[index] = data.record;
      return decorateRecord(data.record, 'cloud');
    }

    const local = await getLocalDocument(doc.id);
    Object.assign(local, patch);
    await putLocalDocument(local);
    return decorateRecord(local, 'local');
  }

  ['openUpload', 'emptyUpload'].forEach((id) => el(id).addEventListener('click', openUploadDialog));
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInput.click(); }
  });
  fileInput.addEventListener('change', () => acceptFiles(fileInput.files, selectedFiles.length > 0));
  ['dragenter', 'dragover'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
    event.preventDefault(); dropZone.classList.add('dragover');
  }));
  ['dragleave', 'drop'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
    event.preventDefault(); dropZone.classList.remove('dragover');
  }));
  dropZone.addEventListener('drop', (event) => acceptFiles(event.dataTransfer.files, selectedFiles.length > 0));
  ingestButton.addEventListener('click', ingestFiles);
  librarySearch.addEventListener('input', refreshLibrary);

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('active', item === button));
      refreshLibrary();
    });
  });

  el('saveNotes').addEventListener('click', async () => {
    try {
      await updateSelectedRecord({ notes: el('reviewNotes').value.trim() });
      await refreshLibrary();
      showToast('Reviewer notes saved.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  el('markVerified').addEventListener('click', async () => {
    const doc = selectedRef ? await resolveDocument(selectedRef) : null;
    if (!doc) return;
    try {
      const updated = await updateSelectedRecord({ status: doc.status === 'verified' ? 'review' : 'verified' });
      await selectDocument(updated._ref);
      showToast(updated.status === 'verified' ? 'Record marked verified.' : 'Record returned to review.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  el('removeDocument').addEventListener('click', async () => {
    const doc = selectedRef ? await resolveDocument(selectedRef) : null;
    if (!doc) return;
    const wording = doc._storage === 'cloud' ? 'permanent Evidence Vault' : "this browser's Evidence Vault";
    if (!confirm(`Remove "${doc.name}" from the ${wording}?`)) return;
    try {
      if (doc._storage === 'cloud') {
        await storageApi({ action: 'delete', id: doc.id });
        remoteRecords = remoteRecords.filter((item) => item.id !== doc.id);
      } else {
        await deleteLocalDocument(doc.id);
      }
      selectedRef = null;
      viewerContent.hidden = true;
      viewerEmpty.hidden = false;
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
      await refreshLibrary();
      showToast('Evidence record removed.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  window.addEventListener('beforeunload', () => {
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  });

  (async () => {
    installStorageControls();
    try {
      db = await openDb();
      await refreshLibrary();
      await checkStorageStatus();
    } catch (error) {
      console.error(error);
      showToast('Evidence Vault initialization failed.', 'error');
    }
  })();
})();
