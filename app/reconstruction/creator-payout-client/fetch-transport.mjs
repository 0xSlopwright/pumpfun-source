/** Local read transport capability. No original server or HTTP-framework claim. */
export function createPayoutFetchTransport({ baseUrl, fetch: send }) {
  const base = new URL(baseUrl);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) {
    throw new TypeError('Supply an HTTP(S) base URL without credentials, query or fragment');
  }
  if (typeof send !== 'function') throw new TypeError('An explicit fetch capability is required');
  const routes = new Map([
    ['GET /payouts/leaderboard', ['/payouts/leaderboard', ['page', 'pageSize', 'period']]],
    ['GET /payouts', ['/payouts', ['page', 'pageSize']]],
  ]);
  return async (operation, options) => {
    const route = routes.get(operation);
    if (!route) throw new TypeError('Unsupported payout read operation');
    const url = new URL(base);
    url.pathname = `${base.pathname.replace(/\/$/, '')}${route[0]}`;
    for (const name of route[1]) {
      const value = options.query[name];
      if (value !== undefined) url.searchParams.set(name, String(value));
    }
    const request = new Request(url, { method: 'GET', credentials: options.credentials,
      headers: options.headers, signal: options.signal });
    const response = await send(request);
    for (const hook of options.hooks?.afterResponse ?? []) await hook(request, options, response);
    return response.json();
  };
}
