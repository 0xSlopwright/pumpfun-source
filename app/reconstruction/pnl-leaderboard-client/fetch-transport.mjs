/**
 * Local transport capability for the recovered PnL client, not recovered server
 * or contract-client internals. The caller supplies the destination and fetch.
 * No production origin, credential store, ranking or response schema is added.
 */
export function createPnlFetchTransport({ baseUrl, fetch: send }) {
  const base = new URL(baseUrl);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) {
    throw new TypeError('Supply an HTTP(S) base URL without credentials, query or fragment');
  }
  if (typeof send !== 'function') throw new TypeError('An explicit fetch capability is required');

  return async (operation, options) => {
    if (operation !== 'GET /pnl-leaderboard') throw new TypeError('Unsupported PnL operation');
    const url = new URL(base);
    url.pathname = `${base.pathname.replace(/\/$/, '')}/pnl-leaderboard`;
    for (const name of ['period', 'sort', 'limit']) {
      const value = options.query[name];
      if (value !== undefined) url.searchParams.set(name, String(value));
    }
    const request = new Request(url, {
      method: 'GET', credentials: options.credentials,
      headers: options.headers, signal: options.signal,
    });
    const response = await send(request);
    for (const hook of options.hooks?.afterResponse ?? []) {
      await hook(request, options, response);
    }
    return response.json();
  };
}
