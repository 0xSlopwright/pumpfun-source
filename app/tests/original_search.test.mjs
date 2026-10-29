import assert from 'node:assert/strict';
import { test } from 'node:test';
import http from 'node:http';
import { once } from 'node:events';
import { mkdtemp, mkdir, copyFile, readFile, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { parse } from '@babel/parser';
import { DEFAULT_APP_ROOT, CONTRACT_PATH, buildSearchContract, verifySearchContract, decodeSearchLoader } from '../scripts/original-search-contract.mjs';
import { validateDeclared } from '../scripts/original-contracts/validate.mjs';
import { encodeSearchQuery, buildSearchRequest, readSearchResolution, resolveIdentifierWith } from '../reconstruction/search-client/request.mjs';

const contract = await buildSearchContract();
const resolveOperation = 'GET /search/resolve';
const coinOperation = 'GET /coins/search-v2';
const unrestrictedOperation = 'GET /coins/search-unrestricted';

async function isolatedCorpus(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'original-search-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const paths = new Set(['evidence/web/manifest.json', 'recovered/modules.json', CONTRACT_PATH,
    ...contract.witnesses.map((witness) => witness.source), ...contract.loader.chunks.map((chunk) => chunk.path),
    ...contract.routes.map((route) => route.html.source),
    ...contract.routes.flatMap((route) => route.initialChunks.map((chunk) => chunk.source))]);
  for (const file of paths) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await copyFile(path.join(DEFAULT_APP_ROOT, file), path.join(root, file));
  }
  return root;
}

test('complete bounded search artifact reproduces from original captures without formatted factories', async () => {
  assert.deepEqual(await verifySearchContract(), contract);
  assert.equal(contract.loader.chunks.length, 14);
  assert.equal(contract.loader.targetId, 238128);
  assert.equal(contract.loader.lazyCoinHookCandidate.sha256, '350da5b767415ae168c12050d3627d71039bcc2c0a097572b5319ddbad04d8fe');
  assert.equal(contract.inventory.selectedEntries.length, 15);
  assert.match(contract.inventory.completeness, /Not claimed/);
  const explore = contract.routes.find((route) => route.route === '/explore');
  assert.deepEqual(explore.coinHookCandidates.map((candidate) => candidate.sha256),
    ['642cafc9d2b3c27f2d2d35ea8699a509ded856839fb3d33a8a132333d85c82d6', contract.loader.lazyCoinHookCandidate.sha256]);
  assert.match(explore.selection, /does not choose an active variant/);
  assert.equal(contract.routes.find((route) => route.route === '/').initialCoinHooks.length, 0);
  assert.equal(contract.coinRequestContexts.length, 2);
  assert.equal(contract.operations[resolveOperation].websiteOrigin, 'https://frontend-api-v3.pump.fun');
  assert.equal(contract.operations[resolveOperation].credentials, 'same-origin');
  assert.equal(contract.operations[coinOperation].credentials, 'include');
});

test('contract verification detects a changed generated origin and needs no recovered factory files', async (t) => {
  const root = await isolatedCorpus(t);
  await verifySearchContract(root);
  const edited = structuredClone(contract);
  edited.operations[resolveOperation].websiteOrigin = 'https://invented.invalid';
  await writeFile(path.join(root, CONTRACT_PATH), JSON.stringify(edited, null, 2) + '\n');
  await assert.rejects(verifySearchContract(root), /differs from authenticated/);
});

test('capture mutation fails authentication rather than keeping a stale search report', async (t) => {
  const root = await isolatedCorpus(t);
  const file = path.join(root, contract.loader.chunks[0].path);
  await writeFile(file, Buffer.concat([await readFile(file), Buffer.from(' ')]));
  await assert.rejects(verifySearchContract(root), /authentication failed/);
});

test('unrelated inventory growth does not stale the bounded selected-source contract', async (t) => {
  const root = await isolatedCorpus(t);
  const file = path.join(root, 'recovered/modules.json');
  const index = JSON.parse(await readFile(file, 'utf8'));
  index.modules.push({ ids: [999999999], sha256: 'f'.repeat(64), path: 'unused-synthetic.js', origins: [] });
  await writeFile(file, JSON.stringify(index));
  assert.deepEqual(await verifySearchContract(root), contract);
});

test('conflicting variants in the explicit loader context are not arbitrarily selected', async (t) => {
  const root = await isolatedCorpus(t);
  const file = path.join(root, 'recovered/modules.json');
  const index = JSON.parse(await readFile(file, 'utf8'));
  const selected = index.modules.find((module) => module.sha256 === contract.loader.lazyCoinHookCandidate.sha256);
  selected.origins.push({ ...selected.origins[0] });
  await writeFile(file, JSON.stringify(index));
  await assert.rejects(buildSearchContract(root), /explicit chunk context required/);
});

test('an unindexed nested registration in a loaded chunk still makes the context ambiguous', async (t) => {
  const root = await isolatedCorpus(t);
  const source = contract.loader.chunks[0].path;
  const file = path.join(root, source);
  const bytes = Buffer.concat([await readFile(file), Buffer.from('\n(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["synthetic",[379705,e=>{}],9,e=>{}]);')]);
  await writeFile(file, bytes);
  const manifestFile = path.join(root, 'evidence/web/manifest.json');
  const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
  const record = manifest.records.find((entry) => entry.path === source);
  const { createHash } = await import('node:crypto');
  record.bytes = bytes.length;
  record.sha256 = createHash('sha256').update(bytes).digest('hex');
  await writeFile(manifestFile, JSON.stringify(manifest));
  await assert.rejects(buildSearchContract(root), /unambiguous loader-context/);
});

test('loader grammar rejects an unproven load method or callback', () => {
  const fixture = (text) => ({ runtime: 's', node: parse(`(${text})`).program.body[0].expression });
  const source = 's=>{s.v(t=>Promise.all(["chunk.js"].map(x=>s.l(x))).then(()=>t(238128)))}';
  assert.deepEqual(decodeSearchLoader(fixture(source)).chunks, ['chunk.js']);
  assert.throws(() => decodeSearchLoader(fixture(source.replace('s.l(x)', 's.other(x)'))), /runtime.l/);
  assert.throws(() => decodeSearchLoader(fixture(source.replace('t(238128)', 'other(238128)'))), /imported module callback/);
  assert.throws(() => decodeSearchLoader(fixture(source.replace('"chunk.js"', 'computed'))), /literal loader chunk/);
});

test('declared query acceptance preserves required arrays, int32/uint32 and operation-specific limits', () => {
  const doc = contract.querySchemas;
  const check = (op, value) => validateDeclared(doc, doc.properties[op], value).issues;
  assert.deepEqual(check(resolveOperation, { identifiers: ['mint'] }), []);
  assert.notDeepEqual(check(resolveOperation, {}), []);
  assert.notDeepEqual(check(resolveOperation, { identifiers: [] }), []);
  assert.notDeepEqual(check(resolveOperation, { identifiers: Array(6).fill('a') }), []);
  assert.deepEqual(check(resolveOperation, { identifiers: ['😀'.repeat(128)] }), []);
  assert.notDeepEqual(check(resolveOperation, { identifiers: ['😀'.repeat(129)] }), []);
  assert.deepEqual(check(coinOperation, { limit: 201, offset: 2147483647, maxDepth: 4294967295 }), []);
  assert.notDeepEqual(check(unrestrictedOperation, { limit: 201 }), []);
  assert.notDeepEqual(check(coinOperation, { offset: 2147483648 }), []);
  assert.notDeepEqual(check(coinOperation, { maxDepth: 4294967296 }), []);
  // Text saying a value clamps/defaults is retained as a description, not added as a runtime constraint.
  assert.equal(doc.properties[coinOperation].properties.limit.maximum, Number.MAX_SAFE_INTEGER);
  assert.equal(doc.properties[unrestrictedOperation].properties.limit.maximum, 200);
});

test('wire encoder retains original scalar, optional-empty and array-comma behavior', () => {
  assert.deepEqual(encodeSearchQuery(resolveOperation, { identifiers: ['a', 'b'], unused: undefined }), { identifiers: 'a,b' });
  assert.deepEqual(encodeSearchQuery(coinOperation, { quoteMints: [], boostModes: [], includeNsfw: false, offset: 0, nullValue: null }),
    { includeNsfw: 'false', offset: '0', nullValue: 'null' });
  assert.throws(() => encodeSearchQuery(resolveOperation, { identifiers: [] }), /requires at least one item/);
  assert.throws(() => encodeSearchQuery(coinOperation, { unknownField: [] }), /requires at least one item/);
  assert.throws(() => encodeSearchQuery(resolveOperation, { identifiers: ['a,b'] }), /array separator/);
  assert.deepEqual(encodeSearchQuery(resolveOperation, { identifiers: ['a'], commaScalar: 'a,b' }), { identifiers: 'a', commaScalar: 'a,b' });
  // The observed client encodes rather than validating ordinary values.
  assert.deepEqual(encodeSearchQuery(unrestrictedOperation, { limit: 201 }), { limit: '201' });
  assert.throws(() => encodeSearchQuery('POST /coins/search-v2', {}), /unsupported search operation/);
});

test('request plans require an explicit destination and preserve observed request options', () => {
  assert.throws(() => buildSearchRequest(resolveOperation, {}), /explicit baseUrl/);
  assert.throws(() => buildSearchRequest(resolveOperation, {}, { baseUrl: 'file:///tmp' }), /HTTP/);
  const controller = new AbortController();
  const resolver = buildSearchRequest(resolveOperation, { identifiers: ['a +é😀'] }, { baseUrl: 'http://127.0.0.1:1234', signal: controller.signal });
  assert.equal(new URL(resolver.url).searchParams.get('identifiers'), 'a +é😀');
  assert.equal(resolver.init.signal, controller.signal);
  assert.equal(resolver.init.credentials, 'same-origin');
  assert.deepEqual(resolver.init.headers, { 'x-pump-source': 'WEB', 'x-pump-platform': 'web', Accept: 'application/json' });
  const coin = buildSearchRequest(coinOperation, { searchTerm: 'a' }, { baseUrl: 'http://127.0.0.1:1234' });
  assert.equal(coin.init.credentials, 'include');
  assert.equal(coin.init.headers['Content-Type'], 'application/json');
});

test('resolver handling preserves definitive, first-result, kind and truthiness decisions', () => {
  const fallback = { kind: 'fallback' };
  for (const payload of [undefined, {}, { results: [] }, { results: [null] },
    { results: [{ kind: 'coin', definitive: false, coin: { mint: 'x' } }] },
    { results: [{ kind: 'coin', definitive: true, coin: {} }] },
    { results: [{ kind: 'squad', definitive: true }] },
    { results: [{ kind: 'unknown', definitive: true }] }]) assert.deepEqual(readSearchResolution(payload), fallback);
  assert.deepEqual(readSearchResolution({ results: [{ definitive: true, kind: 'coin', coin: { mint: 'x' } }] }),
    { kind: 'coin', mint: 'x', chain: null });
  assert.deepEqual(readSearchResolution({ results: [{ definitive: true, kind: 'coin', coin: { mint: 'x' }, chain: 'near' }] }),
    { kind: 'coin', mint: 'x', chain: 'near' });
  for (const kind of ['user', 'external_wallet']) assert.deepEqual(readSearchResolution({ results: [{ definitive: true, kind }] }), { kind });
  assert.deepEqual(readSearchResolution({ results: [{ definitive: false }, { definitive: true, kind: 'user' }] }), fallback);
  // There is no response-schema parser on this path; keep the observed truthiness instead of silently tightening it.
  assert.deepEqual(readSearchResolution({ results: [{ definitive: 'yes', kind: 'coin', coin: { mint: 1 }, chain: false }] }),
    { kind: 'coin', mint: 1, chain: false });
});

test('resolver forwards the original request and treats thrown/aborted transports as fallback', async () => {
  const signal = new AbortController().signal;
  let request;
  assert.deepEqual(await resolveIdentifierWith('abc', async (...args) => { request = args; return { results: [{ definitive: true, kind: 'user' }] }; }, { signal }), { kind: 'user' });
  assert.deepEqual(request, [resolveOperation, { query: { identifiers: ['abc'] }, signal }]);
  for (const error of [new Error('503'), new DOMException('Aborted', 'AbortError')]) {
    assert.deepEqual(await resolveIdentifierWith('abc', async () => { throw error; }), { kind: 'fallback' });
  }
});

test('local HTTP server receives the encoded original read requests and resolver consumes its response', async (t) => {
  const requests = [];
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://local.invalid');
    requests.push({ method: request.method, url, headers: request.headers });
    response.setHeader('Content-Type', 'application/json');
    if (url.pathname === '/search/resolve') response.end(JSON.stringify({ results: [{ definitive: true, kind: 'coin', coin: { mint: 'resolved-mint' }, chain: 'solana' }] }));
    else response.end(JSON.stringify([{ mint: 'local-test-row' }]));
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); return new Promise((resolve) => server.close(resolve)); });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const transport = async (operation, { query, signal }) => {
    const plan = buildSearchRequest(operation, query, { baseUrl, signal });
    const response = await fetch(plan.url, plan.init);
    if (!response.ok) throw new Error(String(response.status));
    return response.json();
  };
  assert.deepEqual(await resolveIdentifierWith('one +é😀', transport), { kind: 'coin', mint: 'resolved-mint', chain: 'solana' });
  for (const operation of [coinOperation, unrestrictedOperation]) {
    const plan = buildSearchRequest(operation, { searchTerm: 'cat', quoteMints: ['mintA', 'mintB'], includeNsfw: false, offset: 0, limit: 48 }, { baseUrl });
    assert.deepEqual(await (await fetch(plan.url, plan.init)).json(), [{ mint: 'local-test-row' }]);
  }
  assert.equal(requests.length, 3);
  assert.deepEqual(requests.map((request) => [request.method, request.url.pathname]),
    [['GET', '/search/resolve'], ['GET', '/coins/search-v2'], ['GET', '/coins/search-unrestricted']]);
  assert.equal(requests[0].url.searchParams.get('identifiers'), 'one +é😀');
  assert.equal(requests[1].url.searchParams.get('quoteMints'), 'mintA,mintB');
  assert.equal(requests[1].url.searchParams.get('includeNsfw'), 'false');
  assert.equal(requests[1].headers['content-type'], 'application/json');
  for (const request of requests) {
    assert.equal(request.headers['x-pump-source'], 'WEB');
    assert.equal(request.headers['x-pump-platform'], 'web');
    assert.equal(request.headers.accept, 'application/json');
  }
});
