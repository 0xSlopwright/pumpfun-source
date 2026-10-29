import { buildSearchRequest } from '../search-client/request.mjs';

export const FALLBACK_IMAGE = 'https://pump.mypinata.cloud/ipfs/QmeSzchzEPqCU1jwTnsipwcBAeH7S4bmVvFGfF65iA1BY1';
const HTTP_URI = /^https?:\/\//i;

export function normalizeSearchUri(uri, ipfsPrefix) {
  var value;
  let match, resolved = (match = (value = uri ?? FALLBACK_IMAGE).match(/(Qm[a-zA-Z0-9]{44}|b[a-zA-Z0-9]{58})/)) && match[1]
    ? `https://ipfs.io/ipfs/${match[1]}` : value;
  return resolved.includes('ipfs.io/ipfs/')
    ? resolved.replace(/https:\/\/[^/]+\/ipfs\//, ipfsPrefix) : FALLBACK_IMAGE;
}

export function normalizeSearchCoins(coins, ipfsPrefix, searchTerm) {
  return coins.map((coin) => {
    var original;
    let rewritten;
    return (
      void 0 !== coin.created_at && void 0 === coin.created_timestamp && (coin.created_timestamp = coin.created_at),
      void 0 !== coin.recommendation_id && void 0 === coin.rec_id && (coin.rec_id = coin.recommendation_id),
      coin.image_uri && (original = coin.image_uri, rewritten = normalizeSearchUri(original, ipfsPrefix),
        coin.image_uri = original !== FALLBACK_IMAGE && rewritten === FALLBACK_IMAGE && HTTP_URI.test(original) ? original : rewritten),
      coin.metadata_uri && (coin.metadata_uri = normalizeSearchUri(coin.metadata_uri, ipfsPrefix)),
      searchTerm && (coin.searchTerm = searchTerm),
      true === coin.ischarity && void 0 === coin.is_charity && (coin.is_charity = true),
      coin
    );
  });
}

// Captured997887.l is an identity operation, not a response schema parser.
export const readSearchCoins = (value) => value;

export function createSearchCache({ now = Date.now } = {}) {
  const entries = new Map();
  const store = (key, value) => {
    if (entries.delete(key), entries.set(key, { ...value, storedAt: now() }), entries.size > 24) {
      let oldest = entries.keys().next().value;
      void 0 !== oldest && entries.delete(oldest);
    }
  };
  return { entries, store };
}

// State/ref capabilities correspond to the owning React hook. The operation
// below preserves the shared executor; it does not pretend to run React effects.
export function createSearchExecutor(
  { offset, limit, ipfsPrefix, socialTerminal },
  { entries, store, requestKeyRef, loadedKeyRef, sequenceRef, abortRef,
    setCoins, setPageSize, setHasNextPage, setLoadedKey, setErrorKey, setLoading,
    setServedCoins, emptyCoins, getContractClient, fetchResponse, parseBoard,
    now = Date.now, AbortController: Controller = globalThis.AbortController },
) {
  return async (request, showLoading = true, localFiltering = false, preserveExisting = false, filter, onSuccess) => {
    let cached, requestKey = requestKeyRef.current,
      identity = 'client' === request.kind ? JSON.stringify([request.route, request.query]) : request.url,
      cacheKey = `${identity}::${localFiltering ? `${offset}:${limit}` : 'full'}`,
      hit = preserveExisting ? null : (cached = entries.get(cacheKey))
        ? now() - cached.storedAt > 120000 ? (entries.delete(cacheKey), null) : cached : null;
    hit ? (setCoins(hit.coins), setPageSize(hit.unfilteredPageSize), setHasNextPage(hit.hasNextPage),
      setLoadedKey(requestKey), setErrorKey(null)) : showLoading && setLoading(true), sequenceRef.current += 1;
    let sequence = sequenceRef.current;
    abortRef.current && abortRef.current.abort();
    let controller = new Controller();
    abortRef.current = controller;
    let signal = controller.signal, started = now();
    try {
      let raw;
      if ('board' === request.kind || 'list' === request.kind) {
        let response = await fetchResponse(request.url, {
          credentials: 'include', headers: { 'Content-Type': 'application/json' }, signal,
          ...('list' === request.kind && request.cache ? { cache: request.cache } : {}),
        });
        if (!response.ok) throw Error(`Error fetching coins: ${response.statusText}`);
        let payload = await response.json();
        raw = 'board' === request.kind ? parseBoard(payload) : 'list' === request.kind && request.parse ? request.parse(payload) : payload;
      } else {
        let payload = await getContractClient()(request.route, {
          query: request.query, credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'x-pump-source': 'WEB', 'x-pump-platform': 'web' },
          signal, throwHttpErrors: false,
          hooks: { afterResponse: [(request, options, response) => {
            if (!response.ok) throw Error(`Error fetching coins: ${response.statusText}`);
          }] },
        });
        if (null === payload) throw Error('Failed to fetch coins');
        raw = readSearchCoins(payload);
      }
      let normalized = normalizeSearchCoins(raw, ipfsPrefix), filtered = filter ? filter(normalized) : normalized,
        current = sequence === sequenceRef.current;
      if (current) {
        if (onSuccess?.(normalized.length, now() - started), setErrorKey(null),
          setServedCoins('board' === request.kind && 'trending' === request.board ? raw : emptyCoins), localFiltering) {
          let page = filtered.slice(offset, offset + limit);
          setCoins(page);
          let pageSize = normalized.slice(offset, offset + limit).length, hasNextPage = normalized.length > offset + limit;
          setPageSize(pageSize), setHasNextPage(hasNextPage), store(cacheKey, { coins: page, unfilteredPageSize: pageSize, hasNextPage });
        } else setCoins(filtered), setPageSize(normalized.length), setHasNextPage(null),
          store(cacheKey, { coins: filtered, unfilteredPageSize: normalized.length, hasNextPage: null });
        setLoadedKey(requestKey);
      }
      return current;
    } catch (error) {
      let keep = socialTerminal ? preserveExisting && loadedKeyRef.current === requestKey : preserveExisting;
      return 'AbortError' === error.name || sequence !== sequenceRef.current || keep || hit ||
        (setCoins([]), setServedCoins(emptyCoins), setPageSize(0), setHasNextPage(null), setLoadedKey(requestKey), setErrorKey(requestKey)), false;
    } finally {
      sequence === sequenceRef.current && setLoading(false), abortRef.current = null;
    }
  };
}

// Local fetch bridge, deliberately narrower than Ky: explicit destination,
// known search operations, one request, no retries or ContractError wrapping.
export function createSearchHttpClient({ baseUrl, fetchResponse = globalThis.fetch }) {
  // Validate the destination at construction without making a request.
  buildSearchRequest('GET /coins/search-v2', undefined, { baseUrl });
  return () => async (route, options) => {
    const wire = buildSearchRequest(route, options.query, { baseUrl, signal: options.signal });
    const response = await fetchResponse(wire.url, { ...wire.init, credentials: options.credentials,
      headers: { ...wire.init.headers, ...options.headers } });
    for (const hook of options.hooks?.afterResponse ?? []) await hook(wire.url, options, response);
    return response.json();
  };
}

// Usable headless state adapter. Explicit render() commits the key/ref snapshot;
// synchronous setters are a local design, not an emulation of React scheduling.
// Pass one cache to multiple sessions to reproduce the captured module-wide scope.
export function createSearchSession({ baseUrl, cache, fetchResponse = globalThis.fetch, now = Date.now, initialCoins = [] }) {
  if (!cache) throw new TypeError('an explicit shared search cache is required');
  const emptyCoins = [], requestKeyRef = { current: null }, loadedKeyRef = { current: null },
    sequenceRef = { current: 0 }, abortRef = { current: null };
  let state = { coins: initialCoins, pageSize: initialCoins.length, hasNextPage: null,
    loadedKey: null, errorKey: null, loading: false, servedCoins: emptyCoins };
  const set = (name) => (value) => { state = { ...state, [name]: value }; };
  const ports = { entries: cache.entries, store: cache.store, requestKeyRef, loadedKeyRef, sequenceRef, abortRef,
    emptyCoins, now, getContractClient: createSearchHttpClient({ baseUrl, fetchResponse }),
    fetchResponse: () => { throw new TypeError('board/list destinations require separate explicit capabilities'); },
    parseBoard: () => { throw new TypeError('board parsing is outside this search session'); },
    setCoins: set('coins'), setPageSize: set('pageSize'), setHasNextPage: set('hasNextPage'),
    setLoadedKey: set('loadedKey'), setErrorKey: set('errorKey'), setLoading: set('loading'), setServedCoins: set('servedCoins') };
  return {
    getState: () => state,
    render({ requestKey, offset, limit, ipfsPrefix, socialTerminal = false }) {
      requestKeyRef.current = requestKey; loadedKeyRef.current = state.loadedKey;
      const execute = createSearchExecutor({ offset, limit, ipfsPrefix, socialTerminal }, ports);
      return (request, ...args) => {
        if (request?.kind !== 'client' || !['GET /coins/search-v2', 'GET /coins/search-unrestricted'].includes(request.route)) {
          throw new TypeError('search session accepts only the two captured coin-search descriptors');
        }
        return execute(request, ...args);
      };
    },
    abort() { abortRef.current?.abort(); },
  };
}
