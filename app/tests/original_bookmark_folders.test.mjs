import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readFile,
  writeFile,
  mkdir,
  mkdtemp,
  copyFile,
  rm,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { once } from "node:events";
import { createHash } from "node:crypto";
import { verify, outputPath } from "../scripts/original-bookmark-folders.mjs";
import {
  bookmarkFolderClient,
  BookmarksHttpError,
  retryFolderQuery,
  folderQueryOptions,
  folderQueryKey,
  canManageFolder,
  folderMutationOptions,
  folderActions,
  folderDialogWorkflow,
} from "../reconstruction/bookmark-folders/client.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const contract = await verify(root);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
};
function cacheHarness() {
  const data = new Map(),
    calls = [];
  const key = (value) => JSON.stringify(value);
  return {
    data,
    calls,
    getQueryData(k) {
      return data.get(key(k));
    },
    setQueryData(k, value) {
      const next =
        typeof value === "function" ? value(data.get(key(k))) : value;
      if (next !== undefined) data.set(key(k), next);
      calls.push(["set", k, next]);
    },
    async cancelQueries(options) {
      calls.push(["cancel", options]);
    },
    invalidateQueries(options) {
      calls.push(["invalidate", options]);
    },
  };
}
function optionsHarness(extra = {}) {
  const cache = cacheHarness(),
    notifications = [],
    key = folderQueryKey("viewer-A");
  const rows = [
    {
      id: "one",
      name: "First",
      bookmark_items: ["synthetic-item"],
      bookmark_items_with_created_at: [],
    },
  ];
  cache.setQueryData(key, rows);
  let clock = 1700000000000;
  const options = folderMutationOptions({
    client: {
      create: async () => ({ name: "created" }),
      rename: async (v) => v,
      remove: async (bookmarkId) => ({ bookmarkId }),
    },
    cache,
    viewer: "viewer-A",
    coinListsFor: () => [],
    now: () => clock++,
    notify: (...args) => notifications.push(args),
    ...extra,
  });
  return { cache, notifications, key, rows, options };
}
// Only the selected callback sequence is exercised here, not a reimplementation
// or qualification of TanStack Query scheduling/retries/concurrent mutations.
async function selectedMutation(options, variables) {
  const context = await options.onMutate(variables);
  let result;
  try {
    result = await options.mutationFn(variables);
  } catch (error) {
    options.onError(error, variables, context);
    throw error;
  }
  options.onSuccess(result, variables, context);
  return result;
}

test("source binds actual lazy caller, all four dialog variants and folder-only transport/cache/action callbacks", () => {
  assert.equal(contract.inventoryVariants, 5947);
  assert.equal(contract.dialogs.length, 4);
  assert.equal(contract.sources.length, 12);
  assert.deepEqual(
    Object.values(contract.operations).map((o) => o.operation),
    [
      "GET /bookmarks",
      "POST /bookmarks",
      "PUT /bookmarks/{bookmarkId}",
      "DELETE /bookmarks/{bookmarkId}",
    ],
  );
  assert.equal(contract.origin.value, "https://frontend-api-v3.pump.fun");
  assert.match(contract.callbacks.createAction.syntax, /catch\{\}/);
  assert.match(contract.behavior.importantComposition, /clears create\/rename/);
});
test("query cache identity and expiry admission remain distinct from authentication and retry", () => {
  const params = {
    requested: true,
    viewer: "viewer-A",
    decodedJwt: { exp: 2 },
    now: () => 1000,
    client: { list: () => {} },
  };
  assert.equal(folderQueryOptions(params).enabled, true);
  for (const patch of [
    { requested: false },
    { viewer: null },
    { decodedJwt: null },
    { decodedJwt: { exp: "2" } },
    { decodedJwt: { exp: 1 } },
    { decodedJwt: { exp: Infinity } },
  ])
    assert.equal(folderQueryOptions({ ...params, ...patch }).enabled, false);
  assert.deepEqual(folderQueryOptions(params).queryKey, [
    "bookmarks",
    "viewer-A",
  ]);
  assert.equal(folderQueryOptions(params).staleTime, 300000);
  assert.equal(retryFolderQuery(0, new BookmarksHttpError(401)), false);
  assert.equal(retryFolderQuery(0, new BookmarksHttpError(403)), false);
  assert.equal(retryFolderQuery(0, new BookmarksHttpError(503)), true);
  assert.equal(retryFolderQuery(1, new Error("network")), false);
  assert.equal(retryFolderQuery(0, new Error("network")), true);
});
test("request functions preserve async rejection and submitted rename/delete return values without invented validation", async () => {
  const client = bookmarkFolderClient({
    request: () => {
      throw Error("port failed");
    },
  });
  let promise;
  assert.doesNotThrow(() => {
    promise = client.create("name");
  });
  await assert.rejects(promise, /port failed/);
  const permissive = bookmarkFolderClient({
    request: async () => ({ unvalidated: true }),
  });
  assert.deepEqual(await permissive.create(""), { unvalidated: true });
  assert.deepEqual(
    await permissive.rename({ bookmarkId: "not-a-uuid", newName: "" }),
    { bookmarkId: "not-a-uuid", newName: "" },
  );
  assert.deepEqual(await permissive.remove("raw-id"), { bookmarkId: "raw-id" });
  await assert.rejects(permissive.list(), TypeError);
});
test("create cancels before snapshot and uses two actual time samples; success invalidates without replacing temporary row", async () => {
  const h = optionsHarness();
  const context = await h.options.create.onMutate("New");
  assert.deepEqual(h.cache.calls[1], ["cancel", { queryKey: h.key }]);
  assert.equal(context.tempBookmark.id, "temp-1700000000000");
  assert.equal(
    context.tempBookmark.created_at,
    new Date(1700000000001).toISOString(),
  );
  assert.equal(h.cache.getQueryData(h.key).length, 2);
  h.options.create.onSuccess({ id: "server-id", name: "New" });
  assert.equal(h.cache.getQueryData(h.key)[1].id, context.tempBookmark.id);
  assert.deepEqual(
    h.cache.calls
      .filter(([type]) => type === "invalidate")
      .map(([, v]) => v.queryKey),
    [
      ["bookmarks", "viewer-A"],
      ["bookmarkedCoins", "viewer-A"],
      ["sidebarBookmarkedCoins", "viewer-A"],
    ],
  );
  assert.equal(h.notifications[0][2].duration, 5000);
});
test("failure restores truthy previous rows but absent initial cache does not fabricate rollback", async () => {
  const h = optionsHarness();
  const context = await h.options.create.onMutate("New");
  h.options.create.onError(Error("fail"), "New", context);
  assert.equal(h.cache.getQueryData(h.key), h.rows);
  h.cache.data.delete(JSON.stringify(h.key));
  const missing = await h.options.create.onMutate("New");
  assert.equal(missing.previousBookmarks, undefined);
  h.options.create.onError(Error("fail"), "New", missing);
  assert.equal(h.cache.getQueryData(h.key)[0].name, "New");
  assert.equal(h.notifications.length, 2);
});
test("rename preserves untouched fields and exact previous-cache identity on rejection", async () => {
  const h = optionsHarness();
  const context = await h.options.rename.onMutate({
    bookmarkId: "one",
    newName: "Renamed",
  });
  assert.deepEqual(h.cache.getQueryData(h.key)[0], {
    ...h.rows[0],
    name: "Renamed",
  });
  h.options.rename.onError(Error("fail"), {}, context);
  assert.equal(h.cache.getQueryData(h.key), h.rows);
});
test("delete cancels exact selected caches, clears them, restores snapshots and leaves the other viewer intact", async () => {
  const lists = [
    ["bookmarkedCoins", "viewer-A", "one"],
    ["sidebarBookmarkedCoins", "viewer-A", "one"],
  ];
  const h = optionsHarness({ coinListsFor: () => lists });
  const coins = [{ mint: "synthetic-mint" }];
  for (const key of lists) h.cache.setQueryData(key, coins);
  const other = folderQueryKey("viewer-B");
  h.cache.setQueryData(other, [{ id: "other" }]);
  const context = await h.options.remove.onMutate("one");
  assert.deepEqual(h.cache.getQueryData(h.key), []);
  for (const key of lists) assert.deepEqual(h.cache.getQueryData(key), []);
  assert.deepEqual(
    h.cache.calls.filter(([type]) => type === "cancel").map(([, v]) => v),
    [h.key, ...lists].map((queryKey) => ({ queryKey, exact: true })),
  );
  h.options.remove.onError(Error("fail"), "one", context);
  assert.equal(h.cache.getQueryData(h.key), h.rows);
  for (const key of lists) assert.equal(h.cache.getQueryData(key), coins);
  assert.deepEqual(h.cache.getQueryData(other), [{ id: "other" }]);
  h.options.remove.onSuccess({ bookmarkId: "one" }, "one", context);
  assert.equal(h.notifications.at(-1)[2].description.values.name, "First");
});
test("exported callbacks deny absent decoded JWT, swallow mutate errors and do not pretend to authenticate expired JWTs", async () => {
  const calls = [],
    notifications = [];
  let jwt = null;
  const mutations = Object.fromEntries(
    ["create", "rename", "remove"].map((name) => [
      name,
      {
        mutateAsync: async (value) => {
          calls.push([name, value]);
          throw Error("rejected");
        },
      },
    ]),
  );
  const actions = folderActions({
    mutations,
    getDecodedJwt: () => jwt,
    notify: (...args) => notifications.push(args),
  });
  assert.equal(await actions.createBookmark("name"), undefined);
  assert.equal(await actions.updateBookmarkName("id", "name"), undefined);
  assert.equal(await actions.deleteBookmark("id"), undefined);
  assert.equal(calls.length, 0);
  assert.equal(notifications.length, 3);
  jwt = { exp: 0 };
  assert.equal(await actions.updateBookmarkName("id", "name"), undefined);
  assert.deepEqual(calls, [["rename", { bookmarkId: "id", newName: "name" }]]);
});
test("dialog trims input, shares pending across operations and clears after a resolving prop", async () => {
  const pending = deferred(),
    calls = [],
    errors = [];
  const model = folderDialogWorkflow({
    createBookmark: async (name) => {
      calls.push(name);
      await pending.promise;
    },
    updateBookmarkName: async () => calls.push("rename"),
    deleteBookmark: async () => calls.push("delete"),
    logError: (...args) => errors.push(args),
    onOpenChange: () => {},
  });
  await model.create();
  assert.deepEqual(calls, []);
  model.setCreateName("  New List  ");
  const promise = model.create();
  assert.equal(model.getSnapshot().pending, true);
  model.edit({ id: "id", name: "changed" });
  await model.rename("id");
  await model.remove("id");
  assert.deepEqual(calls, ["New List"]);
  pending.resolve();
  await promise;
  assert.equal(model.getSnapshot().createName, "");
  assert.equal(model.getSnapshot().pending, false);
  assert.deepEqual(errors, []);
});
test("rejecting dialog props retain input while actual source error-swallowing callbacks clear it", async () => {
  const errors = [],
    mutations = {
      create: {
        mutateAsync: async () => {
          throw Error("fail");
        },
      },
    };
  const actions = folderActions({
    mutations,
    getDecodedJwt: () => ({}),
    notify: () => {},
  });
  const make = (createBookmark) =>
    folderDialogWorkflow({
      createBookmark,
      updateBookmarkName: async () => {},
      deleteBookmark: async () => {},
      logError: (...v) => errors.push(v),
      onOpenChange: () => {},
    });
  const rejecting = make(mutations.create.mutateAsync);
  rejecting.setCreateName("keep");
  await rejecting.create();
  assert.equal(rejecting.getSnapshot().createName, "keep");
  assert.equal(errors.length, 1);
  const actual = make(actions.createBookmark);
  actual.setCreateName("cleared even though request failed");
  await actual.create();
  assert.equal(actual.getSnapshot().createName, "");
});
test("dialog close clears editing only; default-name management is presentation rather than authorization", () => {
  const changes = [];
  const model = folderDialogWorkflow({
    createBookmark: async () => {},
    updateBookmarkName: async () => {},
    deleteBookmark: async () => {},
    logError: () => {},
    onOpenChange: (v) => changes.push(v),
  });
  model.setCreateName("keep");
  model.askDelete("id");
  model.edit({ id: "id", name: "Name" });
  model.changeOpen(false);
  assert.deepEqual(model.getSnapshot(), {
    createName: "keep",
    editingId: null,
    editingName: "",
    deletingId: "id",
    pending: false,
  });
  assert.deepEqual(changes, [false]);
  assert.equal(canManageFolder({ name: "default" }), false);
  assert.equal(canManageFolder({ name: "Default" }), true);
});

test("real loopback HTTP → request options → optimistic cache → actual exported action → dialog success/failure workflow", async (t) => {
  const folderId = "00000000-0000-4000-8000-000000000001";
  const requests = [],
    notifications = [];
  let status = 201,
    readStatus = 200;
  const server = createServer(async (req, res) => {
    let text = "";
    for await (const chunk of req) text += chunk;
    requests.push({
      method: req.method,
      url: req.url,
      body: text ? JSON.parse(text) : undefined,
      contentType: req.headers["content-type"],
    });
    if (req.method === "GET") {
      res.writeHead(readStatus, { "content-type": "application/json" });
      res.end(
        readStatus === 304
          ? undefined
          : JSON.stringify([
              { id: folderId, name: "First", bookmark_items: [] },
            ]),
      );
      return;
    }
    res.writeHead(status, { "content-type": "application/json" });
    if (req.method === "POST")
      res.end(
        JSON.stringify(
          status === 201
            ? {
                id: "00000000-0000-4000-8000-000000000002",
                name: JSON.parse(text).name,
                items: [],
              }
            : { message: "synthetic failure" },
        ),
      );
    else res.end("not-json-but-discarded");
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(async () => {
    server.close();
    server.closeAllConnections();
    await once(server, "close");
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const optionsSeen = [];
  // Explicit authored finite HTTP port. No cookies/auth source, Ky retry or
  // server implementation/compatibility is inferred from this synthetic server.
  const client = bookmarkFolderClient({
    request: async (operation, options) => {
      optionsSeen.push(options);
      const [method, template] = operation.split(" ");
      const pathname = template.replace(/\{(\w+)\}/g, (_, key) =>
        encodeURIComponent(String(options.params[key])),
      );
      const response = await fetch(origin + pathname, {
        method,
        headers: options.headers,
        credentials: options.credentials,
        body:
          options.body === undefined ? undefined : JSON.stringify(options.body),
      });
      for (const hook of options.hooks.afterResponse)
        await hook(null, options, response);
      const text = await response.text();
      return text === ""
        ? ""
        : options.parseJson
          ? options.parseJson(text)
          : JSON.parse(text);
    },
  });
  const rows = await client.list();
  assert.deepEqual(rows[0].bookmark_items_with_created_at, []);
  const h = optionsHarness({ client, notify: (...v) => notifications.push(v) });
  h.cache.setQueryData(h.key, rows);
  const mutations = Object.fromEntries(
    Object.entries(h.options).map(([name, options]) => [
      name,
      { mutateAsync: (v) => selectedMutation(options, v) },
    ]),
  );
  const actions = folderActions({
    mutations,
    getDecodedJwt: () => ({}),
    notify: (...v) => notifications.push(v),
  });
  const model = folderDialogWorkflow({
    ...actions,
    logError: () => assert.fail("source wrappers swallow mutation errors"),
    onOpenChange: () => {},
  });
  model.setCreateName("  Useful List  ");
  await model.create();
  assert.equal(model.getSnapshot().createName, "");
  assert.equal(h.cache.getQueryData(h.key).at(-1).name, "Useful List");
  model.edit({ id: folderId, name: "First" });
  model.setEditingName(" Changed ");
  status = 200;
  await model.rename(folderId);
  assert.equal(model.getSnapshot().editingId, null);
  assert.equal(h.cache.getQueryData(h.key)[0].name, "Changed");
  const previous = h.cache.getQueryData(h.key);
  status = 503;
  model.setCreateName("fails");
  await model.create();
  assert.equal(h.cache.getQueryData(h.key), previous);
  assert.equal(model.getSnapshot().createName, "");
  status = 200;
  await model.remove(folderId);
  assert.equal(
    h.cache.getQueryData(h.key).some((row) => row.id === folderId),
    false,
  );
  assert.deepEqual(
    requests.map((r) => [r.method, r.url]),
    [
      ["GET", "/bookmarks"],
      ["POST", "/bookmarks"],
      ["PUT", `/bookmarks/${folderId}`],
      ["POST", "/bookmarks"],
      ["DELETE", `/bookmarks/${folderId}`],
    ],
  );
  assert.deepEqual(requests[1].body, { name: "Useful List" });
  assert.deepEqual(requests[2].body, { newName: "Changed" });
  assert.equal(
    optionsSeen.every(
      (o) => o.credentials === "include" && o.throwHttpErrors === false,
    ),
    true,
  );
  assert.equal(
    notifications.some(
      (v) =>
        v[0] === "error" && v[1] === "bookmarks.failed_to_create_watchlist",
    ),
    true,
  );
  readStatus = 401;
  await assert.rejects(
    client.list(),
    (error) => error instanceof BookmarksHttpError && error.status === 401,
  );
  readStatus = 304;
  // The hook admits 304, but empty HTTP JSON does not become a fabricated list.
  await assert.rejects(client.list(), TypeError);
});

async function corpusCopy() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "pump-bookmark-source-"));
  for (const file of [
    "evidence/web/manifest.json",
    "recovered/modules.json",
    outputPath,
    ...new Set([
      ...contract.sources.map((m) => m.source),
      ...contract.dialogs.map((d) => d.source.source),
    ]),
  ]) {
    await mkdir(path.dirname(path.join(dir, file)), { recursive: true });
    await copyFile(path.join(root, file), path.join(dir, file));
  }
  return { dir, close: () => rm(dir, { recursive: true, force: true }) };
}
test("missing dialog variants and invented durable/server claims cannot retain a source contract", async () => {
  for (const mutation of ["variant", "claim"]) {
    const f = await corpusCopy();
    try {
      const file = path.join(
        f.dir,
        mutation === "variant" ? "recovered/modules.json" : outputPath,
      );
      const value = JSON.parse(await readFile(file));
      if (mutation === "variant")
        value.modules = value.modules.filter(
          (m) => m.sha256 !== contract.dialogs[0].source.sha256,
        );
      else
        value.behavior.exportedActions =
          "authenticated server writes with durable success";
      await writeFile(file, JSON.stringify(value));
      await assert.rejects(verify(f.dir));
    } finally {
      await f.close();
    }
  }
});
test("resealing raw/index hashes cannot silently invert the source's signed-out mutation guard", async () => {
  const f = await corpusCopy();
  try {
    const source = contract.callbacks.createAction.evidence,
      filename = path.join(f.dir, source.source);
    const bytes = await readFile(filename),
      body = bytes.subarray(...source.utf8).toString();
    assert.ok(body.includes("!tf"));
    const changed = Buffer.from(body.replace("!tf", "+tf"));
    assert.equal(changed.length, source.utf8[1] - source.utf8[0]);
    const mutated = Buffer.concat([
      bytes.subarray(0, source.utf8[0]),
      changed,
      bytes.subarray(source.utf8[1]),
    ]);
    await writeFile(filename, mutated);
    const manifestFile = path.join(f.dir, "evidence/web/manifest.json"),
      manifest = JSON.parse(await readFile(manifestFile));
    manifest.records.find((r) => r.path === source.source).sha256 =
      hash(mutated);
    await writeFile(manifestFile, JSON.stringify(manifest));
    const indexFile = path.join(f.dir, "recovered/modules.json"),
      index = JSON.parse(await readFile(indexFile));
    const factory = contract.sources.find((m) => m.id === 960107);
    index.modules.find((m) => m.ids.includes(960107)).sha256 = hash(
      mutated.subarray(...factory.utf8),
    );
    await writeFile(indexFile, JSON.stringify(index));
    await assert.rejects(verify(f.dir), /review changed 960107/);
  } finally {
    await f.close();
  }
});
