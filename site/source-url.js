(() => {
  const TRACKING_PARAMETERS = new Set([
    'fbclid',
    'gclid',
    'mc_cid',
    'mc_eid'
  ]);

  function clean(rawValue) {
    let value = String(rawValue || '').trim();
    if (!value) return '';

    // Chrome's PDF viewer copies addresses as
    // chrome-extension://.../https://official.example/document.pdf.
    // Keep the embedded public URL and discard the browser-only wrapper.
    const embeddedUrl = value.match(/https?:\/\/.+/i);
    if (embeddedUrl && !/^https?:\/\//i.test(value)) value = embeddedUrl[0];

    try {
      const url = new URL(value);
      if (!['http:', 'https:'].includes(url.protocol)) return value;

      for (const key of [...url.searchParams.keys()]) {
        if (key.toLowerCase().startsWith('utm_') || TRACKING_PARAMETERS.has(key.toLowerCase())) {
          url.searchParams.delete(key);
        }
      }

      return url.toString();
    } catch {
      return value;
    }
  }

  function cleanInput(input) {
    const cleaned = clean(input.value);
    if (cleaned && cleaned !== input.value.trim()) {
      input.value = cleaned;
      input.dispatchEvent(new CustomEvent('civiclens:url-cleaned', { bubbles: true }));
    }
    return cleaned;
  }

  function isSourceInput(target) {
    return target instanceof HTMLInputElement && ['sourceUrl', 'officialSourceUrl'].includes(target.id);
  }

  document.addEventListener('focusout', (event) => {
    if (isSourceInput(event.target)) cleanInput(event.target);
  });

  document.addEventListener('paste', (event) => {
    if (isSourceInput(event.target)) setTimeout(() => cleanInput(event.target), 0);
  });

  window.CivicLensSourceUrl = { clean, cleanInput };
})();
