import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import { createPortfolioChartReader, portfolioChartKeys, portfolioChartResponseSchema } from "../packages/frontend/src/original-contracts/portfolio-chart/reader.mjs";
import { localChartClient, LocalChartHTTPError } from "../packages/frontend/src/original-contracts/portfolio-chart/local-http.mjs";
import { verify, recover, APP_ROOT, OUTPUT } from "../scripts/original-portfolio-chart.mjs";

class HTTPError extends Error { constructor(response) { super("synthetic HTTPError"); this.response = response; } }
function harness(response = { period: "1d", points: [] }, parser = { parse: () => ({ discarded: true }) }) {
  const calls = [], options = [];
  const read = createPortfolioChartReader({ HTTPError, responseSchema: parser,
    createClient: (value) => { options.push(value); return (...args) => { calls.push(args); return Promise.resolve(response); }; } });
  return { read, calls, options };
}
const makeRetry = async () => { const h = harness(); await h.read({}); return h.options[0].retry; };

test("source contract binds actual reader/transport/alias registrations without qualification credit", async () => {
  const c = await verify();
  assert.equal(c.operation.websiteOrigin, "https://frontend-api-v3.pump.fun");
  assert.equal(c.operation.interchangeableHostsEstablished, false);
  assert.deepEqual(c.schema.aliases.map(x => x.utf16), [[27614,27651],[27524,27561],[27479,27516],[27569,27606]]);
  assert.deepEqual(c.qualifications, { nativeBackend: false, productionTraffic: false, uiIntegrated: false, featureCredit: false });
  assert.equal(c.keys.readUICallerEstablished, false);
});

test("getter forwards constructor options, undefined properties, unvalidated query and original response identity", async () => {
  const payload = { period: "1w", points: [{ time: -1.5, value: 0, extra: true }], extra: "kept" };
  const parsed = [], h = harness(payload, { parse: value => { parsed.push(value); return { different: true }; } });
  const signal = new AbortController().signal;
  assert.strictEqual(await h.read({ user: " owner ", period: "1w", signal }), payload);
  assert.strictEqual(parsed[0], payload);
  assert.deepEqual(h.calls[0], ["GET /portfolio-summary/chart", { query: { user: " owner ", period: "1w" } }]);
  assert.strictEqual(h.options[0].signal, signal);
  assert.equal(h.options[0].timeout, 30000);
  await h.read({ user: null, period: "not-an-enum" });
  assert.deepEqual(h.calls[1][1], { query: { user: null, period: "not-an-enum" } });
  assert.ok(Object.hasOwn(h.options[1], "signal"));
  assert.strictEqual(h.options[0].retry, h.options[1].retry);
  assert.notStrictEqual(h.options[0], h.options[1]);
});

test("get/parse failures propagate unchanged and parsing remains synchronous with discarded return", async () => {
  const transportError = Error("transport");
  const read = createPortfolioChartReader({ HTTPError, responseSchema: { parse: () => assert.fail() }, createClient: () => () => { throw transportError; } });
  await assert.rejects(read({}), e => e === transportError);
  const parseError = Error("parse"), h = harness({}, { parse: () => { throw parseError; } });
  await assert.rejects(h.read({}), e => e === parseError);
  const pending = new Promise(() => {}), p = { period: "1d", points: [] };
  assert.strictEqual(await harness(p, { parse: () => pending }).read({}), p);
});

test("keys retain raw identity/period and return fresh arrays, including undefined", () => {
  const user = {};
  assert.deepEqual(portfolioChartKeys.wallet(user, undefined), ["portfolioChart", user, undefined]);
  assert.deepEqual(portfolioChartKeys.walletPrefix(null), ["portfolioChart", null]);
  assert.notStrictEqual(portfolioChartKeys.walletPrefix(user), portfolioChartKeys.walletPrefix(user));
});

test("schema builder uses exact minimal constructor shape and only top-level passthrough", () => {
  const calls = [];
  const z = Object.fromEntries(["number", "enum", "array", "object"].map(kind => [kind, (...args) => {
    const value = { kind, args, passthrough() { calls.push(this); return { ...this, passthroughEnabled: true }; } };
    return value;
  }]));
  const schema = portfolioChartResponseSchema(z);
  assert.deepEqual(schema.args[0].period.args, [["1d", "1w", "1m", "all"]]);
  assert.deepEqual(Object.keys(schema.args[0]), ["period", "points"]);
  assert.equal(schema.args[0].points.kind, "array");
  const point = schema.args[0].points.args[0];
  assert.equal(point.kind, "object");
  assert.deepEqual(Object.keys(point.args[0]), ["time", "value"]);
  assert.equal(point.args[0].time.kind, "number");
  assert.equal(point.args[0].value.kind, "number");
  assert.equal(calls.length, 1);
  assert.strictEqual(calls[0].args, schema.args);
});

test("retry options preserve undefined defer versus false stop, not a boolean retry instruction", async () => {
  const retry = await makeRetry(), { shouldRetry, ...options } = retry;
  assert.deepEqual(options, { limit: 3, methods: ["get"], statusCodes: [502,503], afterStatusCodes: [503], maxRetryAfter: 15000 });
  for (const retryCount of [0,1,2,3]) {
    const response = new Response('{"status":"computing"}', { status: 503 });
    assert.equal(await shouldRetry({ error: new HTTPError(response), retryCount }), undefined);
    assert.equal(response.bodyUsed, false);
    assert.deepEqual(await response.json(), { status: "computing" });
  }
  let clones = 0;
  const error = new HTTPError({ status: 503, clone() { clones++; throw Error(); } });
  assert.equal(await shouldRetry({ error, retryCount: 4 }), false);
  assert.equal(clones, 0);
});

test("503 non-computing/malformed/null/consumed/clone-failure stop without consuming original", async () => {
  const retry = await makeRetry();
  for (const body of ['{}', 'null', '[]', '"computing"', '{"status":"other"}', '{', '{"status":null}']) {
    const response = new Response(body, { status: 503 });
    assert.equal(await retry.shouldRetry({ error: new HTTPError(response), retryCount: 1 }), false);
    assert.equal(response.bodyUsed, false);
  }
  const response = new Response('{"status":"computing"}', { status: 503 });
  await response.text();
  assert.equal(await retry.shouldRetry({ error: new HTTPError(response), retryCount: 1 }), false);
  assert.equal(await retry.shouldRetry({ error: new HTTPError({ status: 503, clone() { throw Error(); } }), retryCount: 1 }), false);
});

test("computing predicate uses inherited status and object check; other-error admission is count-only", async () => {
  const retry = await makeRetry();
  const response = { status: 503, clone: () => ({ json: async () => Object.create({ status: "computing" }) }) };
  assert.equal(await retry.shouldRetry({ error: new HTTPError(response), retryCount: 3 }), undefined);
  for (const error of [new Error(), new TypeError(), { response }, new HTTPError({ status: 502 }), new HTTPError({ status: 400 })]) {
    assert.equal(await retry.shouldRetry({ error, retryCount: 1 }), undefined);
    assert.equal(await retry.shouldRetry({ error, retryCount: 2 }), false);
  }
});

// This explicit synthetic parser is a test port, not a replacement for Zod or
// a claimed implementation of its issue shape, transforms, or exotic inputs.
const parser = { parse(value) {
  if (!value || !["1d","1w","1m","all"].includes(value.period) || !Array.isArray(value.points) ||
    !value.points.every(p => p && Number.isFinite(p.time) && Number.isFinite(p.value))) throw new TypeError("synthetic chart schema rejected");
  return structuredClone(value);
} };

test("real loopback GET: scalar query/headers/identity boundary, computing body, errors, cancellation", async t => {
  const requests = [];
  const server = createServer((req,res) => {
    requests.push({ method: req.method, url: req.url, headers: req.headers });
    const user = new URL(req.url, 'http://localhost').searchParams.get('user');
    if (user === "wait") return; // Aborted below; server cleanup closes connections.
    res.setHeader('content-type', 'application/json');
    if (user === "computing") { res.statusCode = 503; res.setHeader('retry-after', '2'); return res.end('{"status":"computing","retryAfterSeconds":2}'); }
    if (user === "bad") return res.end('{"period":"1d","points":[{"time":1,"value":null}]}');
    if (user === "empty") { res.statusCode = 204; return res.end(); }
    if (user === "malformed") return res.end('{');
    return res.end('{"period":"1w","points":[{"time":-1.5,"value":0,"raw":true}],"extra":"retained"}');
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  const wire = [], options = [], client = localChartClient({
    baseUrl: `http://127.0.0.1:${server.address().port}/api/`,
    fetchImplementation: async (url, init) => {
      const response = await fetch(url, init);
      wire.push({ request: { method: init.method, pathAndQuery: url.pathname + url.search, headers: init.headers },
        response: { status: response.status, contentType: response.headers.get('content-type'),
          retryAfter: response.headers.get('retry-after'), body: await response.clone().text() } });
      return response;
    },
  });
  const read = createPortfolioChartReader({ HTTPError: LocalChartHTTPError, responseSchema: parser,
    createClient: value => { options.push(value); return client(value); } });
  const value = await read({ user: ' a+&雪 ', period: '1w' });
  assert.equal(value.extra, 'retained'); assert.equal(value.points[0].raw, true);
  const query = new URL(requests[0].url, 'http://localhost');
  assert.equal(query.pathname, '/api/portfolio-summary/chart');
  assert.equal(query.searchParams.get('user'), ' a+&雪 ');
  assert.equal(query.searchParams.get('period'), '1w');
  assert.equal(requests[0].method, 'GET');
  for (const [key, expected] of Object.entries({ accept: 'application/json', 'x-pump-source':'WEB', 'x-pump-platform':'web' })) assert.equal(requests[0].headers[key], expected);
  assert.equal(requests[0].headers.authorization, undefined);
  await assert.rejects(read({ user: 'bad' }), /synthetic chart schema rejected/);
  await assert.rejects(read({ user: 'empty' }), /synthetic chart schema rejected/);
  await assert.rejects(read({ user: 'malformed' }), SyntaxError);
  let error; try { await read({ user: 'computing' }); } catch (e) { error = e; }
  assert.ok(error instanceof LocalChartHTTPError);
  assert.equal(await options.at(-1).retry.shouldRetry({ error, retryCount: 3 }), undefined);
  assert.equal(error.response.headers.get('retry-after'), '2');
  assert.deepEqual(await error.response.json(), { status: 'computing', retryAfterSeconds: 2 });
  assert.equal(requests.filter(x => x.url.includes('user=computing')).length, 1, 'local transport does not claim retry scheduling');
  const abort = new AbortController(), pending = read({ user: 'wait', signal: abort.signal });
  abort.abort(); await assert.rejects(pending, e => e.name === 'AbortError');
  if (process.env.PUMP_CHART_WIRE_OUTPUT) {
    await writeFile(process.env.PUMP_CHART_WIRE_OUTPUT, JSON.stringify({
      provenance: 'synthetic isolated loopback HTTP; no production contact or captured response parity',
      normalization: 'ephemeral loopback origin omitted; exact method/path/query/selected headers/status/body retained',
      completedHTTPResponses: wire.length, abortCheck: 'AbortError; no response or server receipt assumed',
      parser: 'explicit synthetic parser port; no Zod runtime qualification', wire,
    }, null, 2) + '\n');
  }
});

test("local HTTP destination is explicit and invalid origins fail before transport", () => {
  for (const baseUrl of [undefined,'','file:///tmp/no','https://name:password@example.invalid','https://example.invalid/?','https://example.invalid/#']) {
    assert.throws(() => localChartClient({ baseUrl, fetchImplementation: () => assert.fail() }), TypeError);
  }
  assert.throws(() => localChartClient({ baseUrl: 'http://localhost' }), TypeError);
});

test("source/contract corruption and resealed semantics cannot silently upgrade qualification", async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'pump-chart-source-'));
  t.after(() => rm(root,{ recursive:true,force:true }));
  const contract = await verify();
  const files = new Set(['evidence/web/manifest.json','recovered/modules.json',OUTPUT,
    ...contract.factories.map(f => f.source),contract.schema.library.source]);
  for (const file of files) { await mkdir(path.dirname(path.join(root,file)),{recursive:true}); await cp(path.join(APP_ROOT,file),path.join(root,file)); }
  const metadata = JSON.parse(await readFile(path.join(root,OUTPUT)));
  metadata.qualifications.nativeBackend = true;
  await writeFile(path.join(root,OUTPUT),JSON.stringify(metadata));
  await assert.rejects(verify(root),/contract is stale/);
  const file = path.join(root,contract.factories[0].source), source = await readFile(file,'utf8');
  const next = source.replace('n<=3&&await s(e.response)', 'n<=2&&await s(e.response)');
  assert.notEqual(next,source); await writeFile(file,next);
  await assert.rejects(recover(root),/authentication failed/);
  const hash = text => createHash('sha256').update(text).digest('hex');
  const manifestFile = path.join(root,'evidence/web/manifest.json'), manifest = JSON.parse(await readFile(manifestFile));
  manifest.records.find(x=>x.path===contract.factories[0].source).sha256=hash(next);
  await writeFile(manifestFile,JSON.stringify(manifest));
  const indexFile=path.join(root,'recovered/modules.json'),index=JSON.parse(await readFile(indexFile));
  const mod=index.modules.find(x=>x.ids.includes(58159)),o=mod.origins[0];mod.sha256=hash(next.slice(o.start,o.end));
  await writeFile(indexFile,JSON.stringify(index));
  await assert.rejects(recover(root),/review required for changed factory 58159/);
});
