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
})();
