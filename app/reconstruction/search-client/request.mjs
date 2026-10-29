import contract from './contract.json' with { type: 'json' };

// Analyst-maintained adapters for the captured request and resolver operations.
// They do not load factories, contact a default origin, or implement a backend.
function operationContract(operation) {
  if (!Object.hasOwn(contract.operations, operation)) throw new TypeError(`unsupported search operation: ${operation}`);
  return contract.operations[operation];
}

function acceptsUndefined(schema, seen = new Set()) {
  if (!schema) return false;
  if (schema['x-zod-optional']) return true;
  if (schema.$ref) {
    if (!schema.$ref.startsWith('#/$defs/') || seen.has(schema.$ref)) return false;
    const key = schema.$ref.slice('#/$defs/'.length).replaceAll('~1', '/').replaceAll('~0', '~');
    return acceptsUndefined(contract.querySchemas.$defs[key], new Set([...seen, schema.$ref]));
  }
  return schema.anyOf?.some((value) => acceptsUndefined(value, seen)) ?? false;
}

// Source: 898661.createContractClient. In particular this is a wire encoder,
// not a request-schema validator: nonempty values are stringified unchanged.
export function encodeSearchQuery(operation, query) {
  operationContract(operation);
  if (!query) return undefined;
  const shape = contract.querySchemas.properties[operation].properties;
  const encoded = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      const items = value.map(String);
      if (items.length === 0) {
        if (acceptsUndefined(shape?.[key])) continue;
        throw new TypeError(`${operation}: query.${key} requires at least one item`);
      }
      const comma = items.find((item) => item.includes(','));
      if (comma !== undefined) {
        throw new TypeError(`${operation}: query.${key} item ${JSON.stringify(comma)} contains a comma, which is the array separator`);
      }
      encoded[key] = items.join(',');
    } else encoded[key] = String(value);
  }
  return encoded;
}

// baseUrl is deliberately required. Supplying the captured production origin
// is an operator decision; these tools never choose it or perform a fetch.
export function buildSearchRequest(operation, query, { baseUrl, signal } = {}) {
  const observed = operationContract(operation);
  if (typeof baseUrl !== 'string' || !baseUrl) throw new TypeError('an explicit baseUrl is required');
  const base = new URL(baseUrl);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) {
    throw new TypeError('baseUrl must be an HTTP(S) URL without credentials, query or fragment');
  }
  if (!base.pathname.endsWith('/')) base.pathname += '/';
  const url = new URL(observed.path.slice(1), base);
  const encoded = encodeSearchQuery(operation, query);
  if (encoded) url.search = new URLSearchParams(encoded).toString();
  const headers = { ...observed.headers };
  if (operation !== 'GET /search/resolve') headers['Content-Type'] = 'application/json';
  return { url: url.href, init: { method: 'get', credentials: observed.credentials, headers,
    ...(signal === undefined ? {} : { signal }) } };
}

// Source: SearchDialogLazy's e4 helper. It consumes the first verdict only;
// the schema's `squad` and `unknown` cases fall through to fallback.
export function readSearchResolution(payload) {
  let result;
  try { result = payload.results[0]; } catch { return { kind: 'fallback' }; }
  if (!result || !result.definitive) return { kind: 'fallback' };
  if (result.kind === 'coin') {
    const mint = result.coin?.mint;
    return mint ? { kind: 'coin', mint, chain: result.chain ?? null } : { kind: 'fallback' };
  }
  return result.kind === 'user' ? { kind: 'user' } :
    result.kind === 'external_wallet' ? { kind: 'external_wallet' } : { kind: 'fallback' };
}

// The caller provides transport semantics (including HTTP errors/retries).
// This retains the observed resolver catch/fallback and AbortSignal forwarding.
export async function resolveIdentifierWith(identifier, transport, { signal } = {}) {
  try {
    return readSearchResolution(await transport('GET /search/resolve', {
      query: { identifiers: [identifier] }, signal,
    }));
  } catch { return { kind: 'fallback' }; }
}
