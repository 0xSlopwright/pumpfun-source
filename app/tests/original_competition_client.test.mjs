import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "node:http";
import { once } from "node:events";
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  copyFile,
  rm,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createCompetitionClient,
  foregroundVariants,
} from "../reconstruction/competition-client/client.mjs";
import { createCompetitionFetchTransport } from "../reconstruction/competition-client/fetch-transport.mjs";
import { verifyCompetitionClient } from "../scripts/original-competition-client.mjs";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Synthetic browser and injected hook providers only; no real cookies/accounts.
function browser() {
  const doc = new EventTarget(),
    win = new EventTarget();
  doc.visibilityState = "visible";
  doc.focused = true;
  doc.hasFocus = () => doc.focused;
  return { document: doc, window: win };
}
function harness(
  variant = foregroundVariants[0],
  { transport = async () => undefined, ssr = false } = {},
) {
  const env = browser();
  const caches = new Map();
  let key,
    viewer = "viewer-a";
  const result = {
    data: { injected: true },
    isLoading: false,
    isError: false,
    isRefetching: false,
    refetch() {},
  };
  const options = [],
    reads = [];
  const client = createCompetitionClient({
    foregroundVariant: variant,
    ...env,
    useSyncExternalStore(subscribe, snapshot, serverSnapshot) {
      reads.push({ subscribe, snapshot, serverSnapshot });
      return ssr ? serverSnapshot() : snapshot();
    },
    useMemoCache(size) {
      if (!caches.has(key))
        caches.set(
          key,
          Array(size).fill(Symbol.for("react.memo_cache_sentinel")),
        );
      const cache = caches.get(key);
      assert.equal(cache.length, size);
      return cache;
    },
    useClientServerContract: () => transport,
    useViewerKey(feature) {
      assert.equal(feature, "competitions");
      return viewer;
    },
    useQuery(value) {
      options.push(value);
      return result;
    },
  });
  return {
    client,
    ...env,
    reads,
    options,
    result,
    viewer(value) {
      viewer = value;
    },
    list(input = {}) {
      key = "list";
      return client.useList(input);
    },
    detail(input = {}) {
      key = "detail";
      return client.useDetail(input);
    },
  };
}
async function server(t, handle) {
  const http = createServer(handle);
  http.listen(0, "127.0.0.1");
  await once(http, "listening");
  t.after(async () => {
    const closed = new Promise((resolve) => http.close(resolve));
    http.closeAllConnections();
    await closed;
  });
  return `http://127.0.0.1:${http.address().port}/local-read`;
}

test("complete source expressions, both foreground variants and actual Cup consumers are authenticated", async () => {
  const contract = await verifyCompetitionClient();
  assert.equal(contract.adapters.length, 6);
  assert.equal(contract.consumers.length, 2);
  assert.ok(contract.adapters.some((row) => row.factory.ids.includes(626540)));
  assert.ok(
    contract.witnesses.some((row) =>
      row.label.includes("590407 call 961415.f"),
    ),
  );
  assert.ok(
    contract.witnesses.some((row) =>
      row.label.includes("869322 call 359516.f"),
    ),
  );
  assert.ok(
    contract.witnesses.every(
      (row) => row.sha256 && row.sourceSha256 && row.utf16 && row.utf8,
    ),
  );
});

test("source gate rejects a changed hook and independently rejects a provenance document change", async (t) => {
  const temporary = await mkdtemp(
    path.join(os.tmpdir(), "competition-source-"),
  );
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const contract = JSON.parse(
    await readFile(
      path.join(APP, "reconstruction/competition-client/contract.json"),
    ),
  );
  const names = new Set([
    "scripts/original-contracts/source.mjs",
    "evidence/web/manifest.json",
    "recovered/modules.json",
    ...contract.source.selectedIndexEntries.flatMap((row) =>
      row.origins.map((origin) => origin.source),
    ),
    ...contract.adapters.map(
      (row) => `reconstruction/competition-client/${row.path}`,
    ),
    "reconstruction/competition-client/client.mjs",
    "reconstruction/competition-client/contract.json",
  ]);
  for (const name of names) {
    const out = path.join(temporary, name);
    await mkdir(path.dirname(out), { recursive: true });
    await copyFile(path.join(APP, name), out);
  }
  const file = path.join(
    temporary,
    "reconstruction/competition-client/useDetail.mjs",
  );
  const original = await readFile(file, "utf8");
  assert.ok(original.includes("null !== m"));
  await writeFile(file, original.replace("null !== m", "!!m"));
  await assert.rejects(
    verifyCompetitionClient(temporary),
    /maintained AST differs/,
  );
  await writeFile(file, original);
  const document = path.join(
    temporary,
    "reconstruction/competition-client/contract.json",
  );
  await writeFile(
    document,
    JSON.stringify({ ...contract, scope: "changed" }, null, 2) + "\n",
  );
  await assert.rejects(
    verifyCompetitionClient(temporary),
    /source contract differs/,
  );
});

test("reviewed foreground variant must be selected explicitly", () => {
  assert.throws(() => createCompetitionClient({}), /Explicit reviewed/);
  assert.throws(
    () => createCompetitionClient({ foregroundVariant: "new-build" }),
    /Explicit reviewed/,
  );
});

for (const variant of foregroundVariants) {
  const label = variant.slice(0, 12);
  test(`${label}: foreground/visibility predicates retain numeric and truthiness semantics`, () => {
    const h = harness(variant);
    const f = h.client.foreground;
    assert.equal(f.useFocused(), true);
    assert.equal(f.useVisible(), true);
    for (const value of [0, -5, 15000, Infinity, -Infinity])
      assert.equal(f.useForegroundInterval(value), value);
    assert.ok(Number.isNaN(f.useForegroundInterval(NaN)));
    for (const value of ["15000", null, undefined, {}, false])
      assert.equal(f.useForegroundInterval(value), false);
    assert.equal(f.useForegroundInterval(15000, null), false);
    assert.equal(f.useForegroundInterval(15000, 1), 15000);
    h.document.focused = false;
    assert.equal(f.useForegroundInterval(15000), false);
    assert.equal(f.useVisibleInterval(15000), 15000);
    h.document.visibilityState = "hidden";
    assert.equal(f.useVisibleInterval(15000), false);
  });
  test(`${label}: foreground subscription and cleanup use exact visibility/focus/blur boundaries`, () => {
    const h = harness(variant);
    h.client.foreground.useFocused();
    const { subscribe, snapshot, serverSnapshot } = h.reads.at(-1);
    const seen = [];
    const dispose = subscribe(() => seen.push(snapshot()));
    h.document.focused = false;
    h.window.dispatchEvent(new Event("blur"));
    h.document.focused = true;
    h.window.dispatchEvent(new Event("focus"));
    h.document.visibilityState = "hidden";
    h.document.dispatchEvent(new Event("visibilitychange"));
    assert.deepEqual(seen, [false, true, false]);
    assert.equal(serverSnapshot(), false);
    dispose();
    h.window.dispatchEvent(new Event("focus"));
    h.document.dispatchEvent(new Event("visibilitychange"));
    assert.equal(seen.length, 3);
    h.client.foreground.useVisible();
    const v = h.reads.at(-1);
    let count = 0;
    const stop = v.subscribe(() => count++);
    h.window.dispatchEvent(new Event("focus"));
    assert.equal(count, 0);
    h.document.dispatchEvent(new Event("visibilitychange"));
    assert.equal(count, 1);
    stop();
    h.document.dispatchEvent(new Event("visibilitychange"));
    assert.equal(count, 1);
  });
  test(`${label}: SSR snapshot does not touch document/window`, () => {
    const client = createCompetitionClient({
      foregroundVariant: variant,
      useSyncExternalStore(_subscribe, _snapshot, serverSnapshot) {
        return serverSnapshot();
      },
    });
    assert.equal(client.foreground.useFocused(), false);
    assert.equal(client.foreground.useVisible(), false);
    assert.equal(client.foreground.useForegroundInterval(15000), false);
  });
  test(`${label}: list hook retains viewer key, memo identity, data/error/refetch and foreground policies`, () => {
    const h = harness(variant);
    const first = h.list({ isVisible: true });
    const options = h.options.at(-1);
    assert.deepEqual(options.queryKey, ["competitions", "list", "viewer-a"]);
    assert.equal(options.staleTime, 15000);
    assert.equal(options.refetchInterval, 60000);
    assert.deepEqual(Object.keys(options), [
      "queryKey",
      "queryFn",
      "staleTime",
      "refetchInterval",
    ]);
    assert.equal(first.data, h.result.data);
    assert.equal(first.refetch, h.result.refetch);
    assert.equal(h.list({ isVisible: true }), first);
    assert.equal(h.options.at(-1), options);
    h.viewer("viewer-b");
    h.list({ isVisible: true });
    assert.notEqual(h.options.at(-1), options);
    assert.deepEqual(h.options.at(-1).queryKey, [
      "competitions",
      "list",
      "viewer-b",
    ]);
    h.window.dispatchEvent(new Event("blur"));
    h.document.focused = false;
    h.list({ isVisible: true });
    assert.equal(h.options.at(-1).refetchInterval, false);
    h.document.focused = true;
    h.list({ isVisible: false });
    assert.equal(h.options.at(-1).refetchInterval, false);
    h.list();
    assert.equal(h.options.at(-1).refetchInterval, 60000);
    h.result.isError = true;
    h.result.isRefetching = true;
    const failed = h.list();
    assert.equal(failed.isError, true);
    assert.equal(failed.isRefetching, true);
    assert.equal(failed.data, h.result.data);
  });
  test(`${label}: detail null-disable and nullish parameter behavior remain exact`, async () => {
    const calls = [];
    const h = harness(variant, {
      transport: async (...args) => {
        calls.push(args);
        return "response";
      },
    });
    h.result.isLoading = true;
    h.result.isError = true;
    h.result.isRefetching = true;
    const disabled = h.detail({ idOrSlug: null, isVisible: true });
    const no = h.options.at(-1);
    assert.equal(no.enabled, false);
    assert.equal(no.refetchInterval, false);
    assert.equal(no.staleTime, 5000);
    assert.deepEqual(no.queryKey, ["competitions", "detail", "", "viewer-a"]);
    assert.equal(disabled.data, undefined);
    assert.equal(disabled.isLoading, false);
    assert.equal(disabled.isError, true);
    assert.equal(disabled.refetch, h.result.refetch);
    assert.equal(disabled.isRefetching, true);
    for (const idOrSlug of [undefined, "", 0, false, "cup-one"]) {
      const projected = h.detail({ idOrSlug, isVisible: true });
      const options = h.options.at(-1);
      assert.equal(options.enabled, true);
      assert.equal(options.refetchInterval, 15000);
      assert.equal(projected.data, h.result.data);
      assert.equal(projected.isLoading, true);
      const controller = new AbortController();
      assert.equal(
        await options.queryFn({ signal: controller.signal }),
        "response",
      );
      assert.deepEqual(calls.at(-1), [
        "GET /competitions/{idOrSlug}",
        { params: { idOrSlug: idOrSlug ?? "" }, signal: controller.signal },
      ]);
    }
    const projected = h.detail({ idOrSlug: "cup-one", isVisible: false });
    assert.equal(h.options.at(-1).refetchInterval, false);
    assert.equal(
      h.detail({ idOrSlug: "cup-one", isVisible: false }),
      projected,
    );
  });
  test(`${label}: real list→bucket selection→detail GET flow retains payloads, origin, signal and viewer separation`, async (t) => {
    const requests = [];
    const competition = {
      id: "cup /?#%雪",
      kind: "person",
      phase: "live",
      pnlUsd: -1.25,
    };
    const list = {
      live: [{ id: "squad", kind: "group" }, competition],
      upcoming: [{ id: "later", kind: "person" }],
      past: [],
    };
    const detail = {
      competition,
      leaderboard: {
        entries: [
          { rank: 2, pnlUsd: -5.25 },
          { rank: 1, pnlUsd: 4 },
        ],
      },
      viewer: { entry: { id: "self" } },
    };
    const baseUrl = await server(t, (req, res) => {
      requests.push({ url: req.url, method: req.method, headers: req.headers });
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify(req.url.endsWith("/competitions") ? list : detail),
      );
    });
    const sent = [];
    const transport = createCompetitionFetchTransport({
      baseUrl,
      fetch(request) {
        sent.push(request);
        return fetch(request);
      },
    });
    const h = harness(variant, { transport });
    const controller = new AbortController();
    h.list({ isVisible: true });
    const board = await h.options.at(-1).queryFn({ signal: controller.signal });
    const chosen = h.client.selectCompetition(board, "person");
    assert.equal(chosen.id, competition.id);
    assert.equal(h.client.hasLiveCompetition(board, "person"), true);
    h.detail({ idOrSlug: chosen.id, isVisible: true });
    const response = await h.options
      .at(-1)
      .queryFn({ signal: controller.signal });
    assert.deepEqual(response, detail);
    assert.deepEqual(
      response.leaderboard.entries.map((row) => row.rank),
      [2, 1],
    );
    assert.equal(
      requests[1].url,
      `/local-read/competitions/${encodeURIComponent(competition.id)}`,
    );
    assert.ok(
      requests.every(
        (req) =>
          req.method === "GET" &&
          !req.headers.cookie &&
          !req.headers.authorization,
      ),
    );
    assert.ok(
      requests.every(
        (req) =>
          req.headers["x-pump-source"] === "WEB" &&
          req.headers["x-pump-platform"] === "web",
      ),
    );
    assert.ok(sent.every((request) => request.credentials === "include"));
    assert.ok(
      sent.every(
        (request) => new URL(request.url).origin === new URL(baseUrl).origin,
      ),
    );
    h.viewer("different-unverified-viewer");
    h.detail({ idOrSlug: chosen.id, isVisible: true });
    assert.equal(
      h.options.at(-1).queryKey.at(-1),
      "different-unverified-viewer",
    );
    assert.equal(requests.length, 2); // changing a display cache key does not send auth or issue a request.
  });
  test(`${label}: original query functions preserve provider rejection identity and exact signal`, async () => {
    const failure = { status: 401, synthetic: true };
    const seen = [];
    const h = harness(variant, {
      transport: (...args) => {
        seen.push(args);
        return Promise.reject(failure);
      },
    });
    for (const kind of ["list", "detail"]) {
      h[kind]({ idOrSlug: "cup", isVisible: true });
      const options = h.options.at(-1);
      const controller = new AbortController();
      await assert.rejects(
        options.queryFn({ signal: controller.signal }),
        (error) => error === failure,
      );
      assert.equal(seen.at(-1)[1].signal, controller.signal);
      assert.equal(options.retry, undefined);
      assert.equal(options.refetchInterval, kind === "list" ? 60000 : 15000);
    }
  });
}

test("bucket selection preserves live/upcoming/past priority, first match and raw ordering", () => {
  const { client } = harness();
  const live = { id: "live", kind: "person" },
    later = { id: "later", kind: "person" },
    past = { id: "past", kind: "person" };
  assert.equal(client.selectCompetition(undefined, "person"), null);
  assert.equal(client.hasLiveCompetition(null, "person"), false);
  assert.equal(
    client.selectCompetition(
      { live: [live, later], upcoming: [later], past: [past] },
      "person",
    ),
    live,
  );
  assert.equal(
    client.selectCompetition(
      { live: [], upcoming: [later], past: [past] },
      "person",
    ),
    later,
  );
  assert.equal(
    client.selectCompetition(
      { live: [], upcoming: [], past: [past] },
      "person",
    ),
    past,
  );
  assert.equal(
    client.selectCompetition({ live: [], upcoming: [], past: [] }, "person"),
    null,
  );
  assert.throws(
    () => client.selectCompetition({ live: null }, "person"),
    TypeError,
  ); // no invented DTO repair.
});

test("local GET transport rejects mutation/unsupported routes and keeps a double-slash base on the supplied origin", async () => {
  const sent = [];
  const transport = createCompetitionFetchTransport({
    baseUrl: "http://localhost//nested",
    fetch: async (request) => {
      sent.push(request);
      return Response.json({});
    },
  });
  await transport("GET /competitions");
  await transport("GET /competitions/{idOrSlug}", {
    params: { idOrSlug: "//other.invalid/a" },
  });
  assert.ok(
    sent.every((request) => new URL(request.url).origin === "http://localhost"),
  );
  assert.equal(
    new URL(sent[1].url).pathname,
    "//nested/competitions/%2F%2Fother.invalid%2Fa",
  );
  for (const operation of [
    "POST /competitions",
    "GET /competitions/tos",
    "POST /competitions/tos/accept",
  ])
    await assert.rejects(transport(operation), /Unsupported/);
  for (const idOrSlug of [".", ".."])
    await assert.rejects(
      transport("GET /competitions/{idOrSlug}", { params: { idOrSlug } }),
      /Dot-segment/,
    );
  await assert.rejects(
    transport("GET /competitions/{idOrSlug}", { params: { idOrSlug: 0 } }),
    /string/,
  );
  for (const baseUrl of [
    "file:///tmp/a",
    "http://user@localhost",
    "http://localhost?q=x",
    "http://localhost/#x",
  ])
    assert.throws(
      () => createCompetitionFetchTransport({ baseUrl, fetch }),
      TypeError,
    );
  assert.throws(
    () => createCompetitionFetchTransport({ baseUrl: "http://localhost" }),
    TypeError,
  );
});

test("real local HTTP failure and abort propagate through the recovered query function", async (t) => {
  let entered;
  const started = new Promise((resolve) => {
    entered = resolve;
  });
  const baseUrl = await server(t, (req, res) => {
    if (req.url.endsWith("/slow")) {
      entered();
      return;
    }
    res.writeHead(401);
    res.end("not-json");
  });
  const h = harness(foregroundVariants[0], {
    transport: createCompetitionFetchTransport({ baseUrl, fetch }),
  });
  h.list();
  await assert.rejects(
    h.options.at(-1).queryFn({ signal: undefined }),
    (error) =>
      error.name === "LocalCompetitionHttpError" && error.status === 401,
  );
  h.detail({ idOrSlug: "slow", isVisible: true });
  const controller = new AbortController();
  const pending = h.options.at(-1).queryFn({ signal: controller.signal });
  await started;
  controller.abort();
  await assert.rejects(pending, (error) => error.name === "AbortError");
});
