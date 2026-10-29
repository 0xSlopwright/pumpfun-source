import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { once } from "node:events";
import {
  recover,
  verify,
  outputPath,
} from "../scripts/original-notifications-inbox.mjs";
import {
  inboxRequest,
  inboxQueryKey,
  inboxEnabled,
  viewerScope,
  readInboxPage,
  normalizeNotification,
  normalizeInboxPage,
  nextInboxPage,
  visibleInboxItems,
  isUnread,
  unreadCount,
  openedAtStore,
} from "../reconstruction/notifications-inbox/client.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const contract = await verify(root);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const item = (id, overrides = {}) => ({
  notificationId: id,
  deeplink: "pump://coin/mint",
  timestamp: "2026-10-28T12:00:00Z",
  ...overrides,
});
async function temporary() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "pump-inbox-"));
  const files = new Set([
    "recovered/modules.json",
    "evidence/web/manifest.json",
    "contracts/internal-operations.json",
    outputPath,
  ]);
  for (const source of [
    ...contract.sources.map((s) => s.source),
    ...contract.transport.providers.map((p) => p.source),
  ])
    files.add(source.source);
  for (const file of files) {
    await fs.mkdir(path.dirname(path.join(dir, file)), { recursive: true });
    await fs.copyFile(path.join(root, file), path.join(dir, file));
  }
  return {
    dir,
    async close() {
      await fs.rm(dir, { recursive: true, force: true });
    },
  };
}
async function reseal(dir, id, change) {
  const indexPath = path.join(dir, "recovered/modules.json"),
    index = JSON.parse(await fs.readFile(indexPath));
  const record = index.modules.find((m) => m.ids.includes(id));
  assert.equal(record.origins.length, 1);
  const origin = record.origins[0],
    sourcePath = path.join(dir, origin.source),
    text = await fs.readFile(sourcePath, "utf8");
  const original = text.slice(origin.start, origin.end),
    changed = change(original);
  assert.notEqual(original, changed);
  assert.equal(original.length, changed.length);
  await fs.writeFile(
    sourcePath,
    text.slice(0, origin.start) + changed + text.slice(origin.end),
  );
  record.sha256 = hash(changed);
  await fs.writeFile(indexPath, JSON.stringify(index));
  const manifestPath = path.join(dir, "evidence/web/manifest.json"),
    manifest = JSON.parse(await fs.readFile(manifestPath));
  for (const r of manifest.records)
    if (r.path === origin.source)
      r.sha256 = hash(await fs.readFile(sourcePath));
  await fs.writeFile(manifestPath, JSON.stringify(manifest));
}
function storage() {
  const values = new Map();
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("inbox source binds actual query, alias exports, both transport providers and all direct import variants", () => {
  assert.equal(contract.inventoryVariants, 5947);
  assert.equal(contract.transport.providers.length, 2);
  assert.equal(contract.operation.newRelativeToHistoricalLedger, true);
  assert.equal(contract.operation.historicalLedgerOperations, 330);
  assert.equal(
    contract.operation.browserPath,
    "/api/hermes/notifications/user",
  );
  assert.equal(contract.query.staleTimeMs, 5000);
  assert.equal(contract.query.refetchIntervalMs, 60000);
  assert.equal(contract.query.refetchIntervalInBackground, false);
  assert.equal(contract.query.refetchOnWindowFocus, true);
  assert.equal(contract.watermark.markReadServerMutation, false);
  for (const source of contract.sources)
    for (const imported of source.imports)
      assert.ok(imported.variants.length > 0);
  assert.equal(contract.compatibilityQualified, false);
});
test("request keeps original truthy query order, empty question mark and URLSearchParams escaping", () => {
  assert.equal(
    inboxRequest({ origin: "http://localhost:1234" }).url,
    "http://localhost:1234/api/hermes/notifications/user?",
  );
  const signal = new AbortController().signal;
  const request = inboxRequest({
    origin: "https://example.invalid/path",
    pageParam: "next+/ =",
    filters: {
      notificationType: "a b",
      priority: 0,
      channel: false,
      mintAddress: "mint&x",
      unknown: "ignored",
    },
    signal,
  });
  assert.equal(
    request.url,
    "https://example.invalid/api/hermes/notifications/user?lastEvaluatedKey=next%2B%2F+%3D&notificationType=a+b&mintAddress=mint%26x",
  );
  assert.equal(request.init.signal, signal);
  assert.equal(request.init.credentials, "same-origin");
  assert.equal(request.timeoutMs, 60000);
  assert.deepEqual(request.init.headers, { accept: "application/json" });
  assert.throws(() => inboxRequest({ origin: "file:///tmp/example" }), /HTTP/);
  assert.throws(() => inboxRequest({}), TypeError);
});
test("query scope prefers user ID; every filter partitions cache; optional enabled is not a default-true coercion", () => {
  assert.equal(viewerScope({ userId: " user ", address: " wallet " }), "user");
  assert.equal(viewerScope({ userId: " ", address: " wallet " }), "wallet");
  assert.equal(viewerScope({}), null);
  assert.deepEqual(inboxQueryKey({ userId: "a" }, { priority: "high" }), [
    "hermes-notifications",
    "inbox",
    "a",
    undefined,
    "high",
    undefined,
    undefined,
  ]);
  assert.notDeepEqual(
    inboxQueryKey({ userId: "a" }),
    inboxQueryKey({ userId: "b" }),
  );
  const state = {
    featureEnabled: true,
    clientAvailable: true,
    viewer: { userId: "a" },
  };
  assert.equal(inboxEnabled(state), true);
  for (const enabled of [false, null, 0, ""])
    assert.equal(inboxEnabled({ ...state, enabled }), false);
  for (const value of [
    { featureEnabled: false },
    { clientAvailable: false },
    { viewer: null },
  ])
    assert.equal(inboxEnabled({ ...state, ...value }), false);
});
test("wire fallbacks retain original OR semantics and do not validate or preserve arbitrary fields", () => {
  const genericV1 = {
    listNavigation: { pathname: "/notifications" },
    coinMetadata: { mintAddress: "fallback" },
  };
  const normalized = normalizeNotification(
    item("", {
      messageId: "message",
      timestamp: "",
      createdAt: "created",
      imageURL: "",
      genericV1,
      navigation: { pathname: "/ignored" },
      extra: 42,
    }),
  );
  assert.equal(normalized.id, "message");
  assert.equal(normalized.timestamp, "created");
  assert.equal(normalized.imageUrl, undefined);
  assert.equal(normalized.navigation, genericV1.listNavigation);
  assert.equal(normalized.mintAddress, "fallback");
  assert.equal(normalized.extra, undefined);
  const page = normalizeInboxPage({
    notifications: [item("a")],
    hasMore: true,
    lastEvaluatedKey: "cursor",
    count: 999,
  });
  assert.equal(page.count, 999);
  assert.equal(nextInboxPage(page), "cursor");
  assert.equal(nextInboxPage({ ...page, hasMore: false }), undefined);
  assert.throws(() => normalizeInboxPage({ notifications: null }), TypeError);
});
test("visible loaded pages exclude DM variants, keep duplicates, and count only loaded items", () => {
  const rows = [
    item("a"),
    item("a"),
    ...contract.presentation.directMessageSubtypes.map((type) =>
      item(type, { genericV1: { notificationSubtype: type } }),
    ),
    item("navigation", {
      genericV1: { listNavigation: { pathname: "/dms/thread" } },
    }),
    item("deeplink", { deeplink: "pump://dms/one" }),
  ];
  const visible = visibleInboxItems({
    pages: [normalizeInboxPage({ notifications: rows, count: 1000 })],
  });
  assert.deepEqual(
    visible.map((r) => r.id),
    ["a", "a"],
  );
  assert.equal(unreadCount(visible, null), 2);
  assert.deepEqual(visibleInboxItems(undefined), []);
  assert.throws(() => visibleInboxItems({}), TypeError);
  assert.throws(() => visibleInboxItems({ pages: null }), TypeError);
  assert.throws(
    () =>
      visibleInboxItems({ pages: [{ notifications: [{ timestamp: "x" }] }] }),
    TypeError,
  );
});
test("unread compares strict valid timestamps; null watermark counts even malformed timestamps", () => {
  const at = "2026-10-28T12:00:00Z";
  assert.equal(isUnread({ timestamp: at }, at), false);
  assert.equal(isUnread({ timestamp: "2026-10-28T12:00:01Z" }, at), true);
  assert.equal(isUnread({ timestamp: "2026-10-28T11:59:59Z" }, at), false);
  assert.equal(isUnread({ timestamp: "bad" }, at), false);
  assert.equal(isUnread({ timestamp: at }, "bad"), false);
  assert.equal(isUnread({ timestamp: "bad" }, null), true);
});
test("watermark survives recreation, isolates exact keys and preserves pre-open row snapshot", () => {
  const local = storage(),
    now = Date.parse("2026-10-28T12:00:00Z");
  const store = openedAtStore({ storage: local, adjustedNow: () => now });
  store.markOpened("wallet-a");
  assert.equal(store.current("wallet-a"), new Date(now).toISOString());
  assert.equal(store.previous("wallet-a"), null);
  assert.equal(store.current("wallet-b"), null);
  const restarted = openedAtStore({
    storage: local,
    adjustedNow: () => now + 1000,
  });
  assert.equal(restarted.current("wallet-a"), new Date(now).toISOString());
  assert.equal(restarted.previous("wallet-a"), new Date(now).toISOString());
  restarted.markOpened("wallet-a");
  assert.equal(restarted.previous("wallet-a"), new Date(now).toISOString());
  store.markOpened(" wallet-a ", "arbitrary");
  assert.equal(store.current(" wallet-a "), "arbitrary");
  assert.equal(store.current("wallet-a"), new Date(now + 1000).toISOString()); // The writer itself does not trim.
  assert.equal(store.current(null), null);
  assert.equal(store.previous(null), null);
});
test("storage errors do not fabricate current persistence; subscribers follow original broad prefix behavior", () => {
  const failed = openedAtStore({
    storage: {
      getItem() {
        throw Error("denied");
      },
      setItem() {
        throw Error("quota");
      },
    },
    adjustedNow: () => 0,
  });
  let count = 0;
  const unsubscribe = failed.subscribe(() => count++);
  failed.markOpened("a");
  assert.equal(failed.current("a"), null);
  assert.equal(failed.previous("a"), null);
  assert.equal(count, 1);
  failed.storageEvent("unrelated");
  assert.equal(count, 1);
  failed.storageEvent(failed.key("someone-else"));
  failed.storageEvent(null);
  assert.equal(count, 3);
  unsubscribe();
  failed.markOpened("b");
  assert.equal(count, 3);
});
test("real loopback receives GET filters and pages; refresh occurs only on falsy first cursor", async () => {
  const requests = [];
  const server = createServer((req, res) => {
    requests.push({ method: req.method, url: req.url, headers: req.headers });
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        notifications: [item("n")],
        hasMore: requests.length === 1,
        lastEvaluatedKey: "next+/=",
        count: 1,
      }),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = `http://127.0.0.1:${server.address().port}`;
  let refreshed = 0;
  try {
    const first = await readInboxPage({
      origin,
      filters: { priority: "high" },
      fetchImplementation: fetch,
      refreshUser: () => {
        refreshed++;
      },
    });
    const second = await readInboxPage({
      origin,
      pageParam: nextInboxPage(first),
      fetchImplementation: fetch,
      refreshUser: () => {
        refreshed++;
      },
    });
    assert.equal(refreshed, 1);
    assert.equal(second.notifications[0].id, "n");
    assert.deepEqual(
      requests.map((r) => [r.method, r.url]),
      [
        ["GET", "/api/hermes/notifications/user?priority=high"],
        [
          "GET",
          "/api/hermes/notifications/user?lastEvaluatedKey=next%2B%2F%3D",
        ],
      ],
    );
    assert.equal(requests[0].headers.authorization, undefined);
    assert.equal(requests[0].headers.accept, "application/json");
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
test("real loopback HTTP/JSON failure and abort stay errors; malformed page refresh ordering is retained", async () => {
  const server = createServer((req, res) => {
    const mode = new URL(req.url, "http://localhost").searchParams.get(
      "channel",
    );
    if (mode === "abort") return;
    res.statusCode = mode === "error" ? 503 : mode === "204" ? 204 : 200;
    res.end(
      mode === "json"
        ? "not-json"
        : mode === "empty" || mode === "204"
          ? ""
          : JSON.stringify({ notifications: null }),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = `http://127.0.0.1:${server.address().port}`;
  let refreshed = 0;
  const read = (channel, signal) =>
    readInboxPage({
      origin,
      filters: { channel },
      signal,
      fetchImplementation: fetch,
      refreshUser: () => {
        refreshed++;
      },
    });
  try {
    await assert.rejects(read("error"), { status: 503 });
    await assert.rejects(read("json"), SyntaxError);
    assert.equal(refreshed, 0);
    await assert.rejects(read("malformed"), TypeError);
    assert.equal(refreshed, 1);
    await assert.rejects(read("204"), TypeError);
    await assert.rejects(read("empty"), TypeError);
    assert.equal(refreshed, 3);
    const controller = new AbortController();
    const pending = read("abort", controller.signal);
    controller.abort();
    await assert.rejects(pending, { name: "AbortError" });
    assert.equal(refreshed, 3);
    await assert.rejects(readInboxPage({ origin }), /Explicit transport/);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
test("raw corruption and missing provider variant fail closed", async () => {
  const temp = await temporary();
  try {
    const source = contract.sources[0].source.source;
    await fs.appendFile(path.join(temp.dir, source), " ");
    await assert.rejects(recover(temp.dir), /authentication failed/);
  } finally {
    await temp.close();
  }
  const temp2 = await temporary();
  try {
    const p = path.join(temp2.dir, "recovered/modules.json"),
      j = JSON.parse(await fs.readFile(p));
    j.modules = j.modules.filter(
      (m) => m.sha256 !== contract.transport.providers[0].source.sha256,
    );
    await fs.writeFile(p, JSON.stringify(j));
    await assert.rejects(recover(temp2.dir), /both captured/);
  } finally {
    await temp2.close();
  }
});
test("resealed query, decoder, cursor and watermark comparator changes cannot pass the old relationships", async () => {
  const changes = [
    ['a.set("priority",l)', 'a.set("priority",s)'],
    [".json()", ".text()"],
    ["e.hasMore?e.lastEvaluatedKey", "e.count  ?e.lastEvaluatedKey"],
    ["n>a", "n<a"],
    ["t||f()", "t&&f()"],
  ];
  for (const [before, after] of changes) {
    const temp = await temporary();
    try {
      await reseal(temp.dir, 763956, (s) => s.replace(before, after));
      await assert.rejects(recover(temp.dir));
    } finally {
      await temp.close();
    }
  }
});
test("resealed timing and key-prefix variants are derived; stale or invented response-validator metadata is rejected", async () => {
  const temp = await temporary();
  try {
    await reseal(temp.dir, 763956, (s) =>
      s.replace("staleTime:5e3", "staleTime:7e3"),
    );
    assert.equal((await recover(temp.dir)).query.staleTimeMs, 7000);
    await assert.rejects(verify(temp.dir), /differs/);
  } finally {
    await temp.close();
  }
  const temp2 = await temporary();
  try {
    await reseal(temp2.dir, 763956, (s) =>
      s.replace(
        "pump.notifications.opened-at:",
        "pump.notifications.opened-to:",
      ),
    );
    assert.equal(
      (await recover(temp2.dir)).watermark.keyPrefix,
      "pump.notifications.opened-to:",
    );
    await assert.rejects(verify(temp2.dir), /differs/);
  } finally {
    await temp2.close();
  }
  const temp3 = await temporary();
  try {
    const p = path.join(temp3.dir, outputPath),
      j = JSON.parse(await fs.readFile(p));
    j.operation.successfulDecoder = "runtime schema validated";
    await fs.writeFile(p, JSON.stringify(j));
    await assert.rejects(verify(temp3.dir), /differs/);
  } finally {
    await temp3.close();
  }
});
test("all selected semantic witnesses use exact original UTF-16/strict UTF-8 expression ranges", async () => {
  let count = 0;
  const visit = async (value) => {
    if (!value || typeof value !== "object") return;
    if (value.source && value.utf16 && value.utf8 && value.sha256) {
      const bytes = await fs.readFile(path.join(root, value.source)),
        text = bytes.toString("utf8");
      assert.equal(hash(bytes.subarray(...value.utf8)), value.sha256);
      assert.equal(hash(text.slice(...value.utf16)), value.sha256);
      count++;
    }
    for (const child of Object.values(value)) {
      if (Array.isArray(child)) for (const v of child) await visit(v);
      else await visit(child);
    }
  };
  await visit(contract);
  assert.ok(count > 25);
});
