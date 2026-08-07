(() => {
  const DB_NAME = 'civiclens-evidence-vault';
  const STORE = 'documents';
  let db;
  let selectedId = null;
  let selectedFiles = [];
  let activeFilter = 'all';
  let currentObjectUrl = null;

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

  function getAllDocuments() {
    return new Promise((resolve, reject) => {
      const request = transaction().getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)));
      request.onerror = () => reject(request.error);
    });
  }

  function getDocument(id) {
    return new Promise((resolve, reject) => {
      const request = transaction().get(Number(id));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function putDocument(document) {
    return new Promise((resolve, reject) => {
      const request = transaction('readwrite').put(document);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function deleteDocument(id) {
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

  function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, index)).toFixed(index ? 1 : 0)} ${units[index]}`;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function showToast(message, tone = 'success') {
    const toast = el('toast');
    toast.textContent = message;
    toast.className = `toast ${tone}`;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 3400);
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

  async function refreshLibrary() {
    const documents = await getAllDocuments();
    const query = librarySearch.value.trim().toLowerCase();
    const filtered = documents.filter((doc) => {
      const matchesFilter = activeFilter === 'all' || doc.type === activeFilter || (activeFilter === 'other' && !['budget', 'audit', 'contract'].includes(doc.type));
      const haystack = `${doc.name} ${doc.publisher} ${doc.fiscalYear} ${doc.type}`.toLowerCase();
      return matchesFilter && haystack.includes(query);
    });

    documentList.innerHTML = filtered.map((doc) => `
      <button class="document-card ${doc.id === selectedId ? 'active' : ''}" data-document-id="${doc.id}" type="button">
        <div class="document-card__top">
          <span class="doc-icon">${doc.mime === 'application/pdf' ? 'PDF' : 'IMG'}</span>
          <span><strong>${escapeHtml(doc.name)}</strong><small>${escapeHtml(doc.fiscalYear || 'Fiscal year not set')} · ${formatBytes(doc.size)}</small></span>
        </div>
        <span class="doc-status ${doc.status}">${doc.status === 'verified' ? 'Verified' : 'Awaiting review'}</span>
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

    documentList.querySelectorAll('[data-document-id]').forEach((button) => {
      button.addEventListener('click', () => selectDocument(Number(button.dataset.documentId)));
    });

    el('documentCount').textContent = documents.length;
    el('reviewCount').textContent = documents.filter((doc) => doc.status !== 'verified').length;
    el('verifiedCount').textContent = documents.filter((doc) => doc.status === 'verified').length;
  }

  async function selectDocument(id) {
    const doc = await getDocument(id);
    if (!doc) return;
    selectedId = id;
    viewerEmpty.hidden = true;
    viewerContent.hidden = false;

    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = URL.createObjectURL(doc.file);

    el('viewerType').textContent = `${doc.typeLabel} · ${doc.status === 'verified' ? 'Verified' : 'Review required'}`;
    el('viewerTitle').textContent = doc.name;
    el('viewerSubtitle').textContent = `${doc.publisher || 'Publisher not recorded'} · ${doc.fiscalYear || 'Fiscal year not recorded'}`;
    el('metaStatus').innerHTML = `<span class="doc-status ${doc.status}">${doc.status === 'verified' ? 'Verified' : 'Awaiting review'}</span>`;
    el('metaType').textContent = doc.typeLabel;
    el('metaYear').textContent = doc.fiscalYear || 'Not recorded';
    el('metaPublisher').textContent = doc.publisher || 'Not recorded';
    el('metaSource').innerHTML = doc.sourceUrl ? `<a href="${escapeHtml(doc.sourceUrl)}" target="_blank" rel="noopener noreferrer">Official source ↗</a>` : 'Not recorded';
    el('metaUploaded').textContent = new Date(doc.uploadedAt).toLocaleString();
    el('metaSize').textContent = formatBytes(doc.size);
    el('metaHash').textContent = doc.hash;
    el('reviewNotes').value = doc.notes || '';
    el('markVerified').textContent = doc.status === 'verified' ? 'Return to review' : 'Mark verified';

    const pdfPreview = el('pdfPreview');
    const imagePreview = el('imagePreview');
    const unsupportedPreview = el('unsupportedPreview');
    pdfPreview.hidden = imagePreview.hidden = unsupportedPreview.hidden = true;

    if (doc.mime === 'application/pdf' || doc.name.toLowerCase().endsWith('.pdf')) {
      pdfPreview.src = currentObjectUrl;
      pdfPreview.hidden = false;
    } else if (doc.mime.startsWith('image/')) {
      imagePreview.src = currentObjectUrl;
      imagePreview.hidden = false;
    } else {
      unsupportedPreview.hidden = false;
    }

    el('openOriginal').onclick = () => window.open(currentObjectUrl, '_blank', 'noopener');
    await refreshLibrary();
  }

  async function ingestFiles() {
    ingestButton.disabled = true;
    ingestButton.textContent = 'Creating records…';
    const type = el('documentType').value;
    const typeLabel = el('documentType').selectedOptions[0].textContent;
    const common = {
      type,
      typeLabel,
      fiscalYear: el('fiscalYear').value.trim(),
      publisher: el('publisher').value.trim(),
      sourceUrl: el('sourceUrl').value.trim(),
      status: 'review',
      notes: '',
      uploadedAt: new Date().toISOString()
    };

    try {
      let firstId;
      for (const file of selectedFiles) {
        const id = await putDocument({
          ...common,
          name: file.name,
          mime: file.type || 'application/octet-stream',
          size: file.size,
          lastModified: file.lastModified,
          hash: await hashFile(file),
          file
        });
        if (!firstId) firstId = id;
      }
      uploadDialog.close();
      resetUploadForm();
      await refreshLibrary();
      if (firstId) await selectDocument(firstId);
      showToast('Evidence record added. Review is required before verification.');
    } catch (error) {
      console.error(error);
      showToast('The browser could not preserve this file. Storage may be full.', 'error');
    } finally {
      ingestButton.textContent = 'Add to Evidence Vault';
      ingestButton.disabled = selectedFiles.length === 0;
    }
  }

  function openUploadDialog() {
    resetUploadForm();
    uploadDialog.showModal();
    setTimeout(() => dropZone.focus(), 20);
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
    if (!selectedId) return;
    const doc = await getDocument(selectedId);
    doc.notes = el('reviewNotes').value.trim();
    await putDocument(doc);
    showToast('Reviewer notes saved.');
  });

  el('markVerified').addEventListener('click', async () => {
    if (!selectedId) return;
    const doc = await getDocument(selectedId);
    doc.status = doc.status === 'verified' ? 'review' : 'verified';
    await putDocument(doc);
    await selectDocument(selectedId);
    showToast(doc.status === 'verified' ? 'Record marked verified.' : 'Record returned to review.');
  });

  el('removeDocument').addEventListener('click', async () => {
    if (!selectedId) return;
    const doc = await getDocument(selectedId);
    if (!confirm(`Remove "${doc.name}" from this browser's Evidence Vault?`)) return;
    await deleteDocument(selectedId);
    selectedId = null;
    viewerContent.hidden = true;
    viewerEmpty.hidden = false;
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
    await refreshLibrary();
    showToast('Evidence record removed.');
  });

  window.addEventListener('beforeunload', () => {
    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  });

  (async () => {
    try {
      db = await openDb();
      await refreshLibrary();
    } catch (error) {
      console.error(error);
      showToast('Evidence Vault storage is unavailable in this browser.', 'error');
    }
  })();
})();
