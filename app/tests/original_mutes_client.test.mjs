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
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { once } from "node:events";
import { createHash } from "node:crypto";
import { verify, outputPath } from "../scripts/original-mutes-client.mjs";
import {
  parseMuteList,
  mutesClient,
  muteQueryKey,
  muteQueryOptions,
  muteMutationOptions,
  muteMenu,
  mutedIdSet,
  filterMutedRows,
} from "../reconstruction/mutes-client/client.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const contract = await verify(root);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
function cacheHarness() {
  const data = new Map(),
    calls = [],
    key = (k) => JSON.stringify(k);
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
function mutationHarness() {
  const cache = cacheHarness(),
    reports = [],
    client = { mute: async () => {}, unmute: async () => {} };
  const options = muteMutationOptions({
    client,
    cache,
    viewer: "viewer-A",
    reportError: (value) => reports.push(value),
  });
  return { cache, reports, client, options, key: muteQueryKey("viewer-A") };
}
test("source binds both actual comfortable-density callers, provider variants, captured schema parse and reused dated configurations", () => {
  assert.equal(Object.keys(contract.operations).length, 3);
  assert.equal(contract.providers.length, 2);
  assert.deepEqual(
    contract.callers.map((c) => c.kind),
    ["callout", "reply"],
  );
  assert.match(contract.operations.list.function.syntax, /p.parse/);
  assert.equal(contract.dependency.capturedConfigurations.length, 12);
  assert.equal(
    contract.dependency.capturedConfigurations.every(
      (c) => c.config.clientServerUrl === "https://frontend-api-v3.pump.fun",
    ),
    true,
  );
  assert.equal(contract.utility.consumerEstablished, false);
});
test("list validator clones required string arrays, preserves duplicates/empty strings, strips extra fields and rejects malformed/sparse arrays", () => {
  const input = { userIds: ["a", "a", ""], extra: "discard" };
  const parsed = parseMuteList(input);
  assert.deepEqual(parsed, { userIds: ["a", "a", ""] });
  assert.notEqual(parsed.userIds, input.userIds);
  for (const value of [
    null,
    [],
    {},
    { userIds: null },
    { userIds: ["a", 1] },
    { userIds: new Array(1) },
  ])
    assert.throws(() => parseMuteList(value), TypeError);
});
test("client forwards actual read AbortSignal and writes only userId params while discarding write results", async () => {
  const calls = [],
    signal = new AbortController().signal;
  const client = mutesClient({
    api: async (...args) => {
      calls.push(args);
      return args[0] === "GET /mutes"
        ? { userIds: ["one"], extra: true }
        : { mutedAt: "ignored" };
    },
  });
  assert.deepEqual(await client.list({ signal }), { userIds: ["one"] });
  assert.equal(calls[0][1].signal, signal);
  assert.equal(await client.mute({ userId: "one" }), undefined);
  assert.equal(await client.unmute({ userId: "one" }), undefined);
  assert.deepEqual(calls.slice(1), [
    ["POST /mutes/{userId}", { params: { userId: "one" } }],
    ["DELETE /mutes/{userId}", { params: { userId: "one" } }],
  ]);
});
test("query admission defaults on but requires viewer scope; select and signal remain framework options", async () => {
  const signal = new AbortController().signal,
    calls = [],
    client = {
      list: async (v) => {
        calls.push(v);
        return { userIds: ["one"] };
      },
    };
  const options = muteQueryOptions({ client, viewer: "viewer-A" });
  assert.equal(options.enabled, true);
  assert.equal(options.staleTime, 60000);
  assert.deepEqual(options.queryKey, ["mutes", "list", "viewer-A"]);
  assert.equal(muteQueryOptions({ client, viewer: null }).enabled, false);
  assert.equal(
    muteQueryOptions({ client, viewer: "viewer-A", enabled: false }).enabled,
    false,
  );
  const value = await options.queryFn({ signal });
  assert.equal(calls[0].signal, signal);
  assert.equal(options.select(value), value.userIds);
});
test("mute cancels before snapshot, prepends an absent ID, preserves duplicate identity and never initializes missing cache", async () => {
  const h = mutationHarness(),
    original = { userIds: ["old"], extra: 1 };
  h.cache.setQueryData(h.key, original);
  const context = await h.options.mute.onMutate({ userId: "new" });
  assert.equal(context.previous, original);
  assert.deepEqual(h.cache.calls[1], ["cancel", { queryKey: h.key }]);
  assert.deepEqual(h.cache.getQueryData(h.key), { userIds: ["new", "old"] });
  const duplicate = h.cache.getQueryData(h.key);
  await h.options.mute.onMutate({ userId: "new" });
  assert.equal(h.cache.getQueryData(h.key), duplicate);
  h.cache.data.delete(JSON.stringify(h.key));
  const missing = await h.options.mute.onMutate({ userId: "new" });
  assert.equal(missing.previous, undefined);
  assert.equal(h.cache.getQueryData(h.key), undefined);
});
test("unmute removes all exact matches, retains other case variants and keeps object identity when unchanged", async () => {
  const h = mutationHarness();
  h.cache.setQueryData(h.key, { userIds: ["same", "Same", "same"] });
  await h.options.unmute.onMutate({ userId: "same" });
  assert.deepEqual(h.cache.getQueryData(h.key), { userIds: ["Same"] });
  const same = h.cache.getQueryData(h.key);
  await h.options.unmute.onMutate({ userId: "missing" });
  assert.equal(h.cache.getQueryData(h.key), same);
});
test("error rollback/report and settled invalidation stay scoped to the captured viewer on either operation", async () => {
  const h = mutationHarness(),
    original = { userIds: ["old"] },
    other = muteQueryKey("viewer-B");
  h.cache.setQueryData(h.key, original);
  h.cache.setQueryData(other, { userIds: ["other"] });
  for (const operation of ["mute", "unmute"]) {
    const context = await h.options[operation].onMutate({ userId: "old" });
    const error = Error("synthetic");
    h.options[operation].onError(error, { userId: "old" }, context);
    assert.equal(h.cache.getQueryData(h.key), original);
    assert.deepEqual(h.reports.at(-1), {
      error,
      feature: "mutes",
      operation,
      context: { userId: "old" },
    });
    h.options[operation].onSettled();
  }
  assert.deepEqual(h.cache.getQueryData(other), { userIds: ["other"] });
  assert.deepEqual(
    h.cache.calls
      .filter(([type]) => type === "invalidate")
      .map(([, o]) => o.queryKey),
    [h.key, h.key],
  );
});
test("menu with no target stays hidden and never prompts; missing wallet prompts without sending a mutation", () => {
  const prompts = [],
    calls = [];
  const handles = { isPending: false, mutate: (...v) => calls.push(v) };
  const make = (userId) =>
    muteMenu({
      author: { userId, name: "Synthetic" },
      getWalletAddress: () => null,
      getMutedIds: () => [],
      mute: handles,
      unmute: handles,
      showWallet: (v) => prompts.push(v),
      notify: () => {},
    });
  const noTarget = make("");
  assert.equal(noTarget.getState().visible, false);
  assert.equal(noTarget.queryEnabled(true), false);
  noTarget.toggle();
  assert.deepEqual(prompts, []);
  const target = make("id");
  assert.equal(target.queryEnabled(false), false);
  assert.equal(target.queryEnabled(true), true);
  target.toggle();
  assert.deepEqual(prompts, [true]);
  assert.deepEqual(calls, []);
});
test("menu captures the selected operation for success messages and exposes pending UI rather than inventing callback authorization", () => {
  let ids = [];
  const calls = [],
    notifications = [];
  const mute = {
      isPending: false,
      mutate: (v, c) => calls.push(["mute", v, c]),
    },
    unmute = {
      isPending: false,
      mutate: (v, c) => calls.push(["unmute", v, c]),
    };
  const menu = muteMenu({
    author: { userId: "id", name: "Synthetic" },
    getWalletAddress: () => "explicit-client-gate",
    getMutedIds: () => ids,
    mute,
    unmute,
    showWallet: () => assert.fail(),
    notify: (...v) => notifications.push(v),
  });
  assert.deepEqual(menu.getState().label, {
    key: "profile.mutes.mute_user",
    values: { user_name: "@Synthetic" },
  });
  assert.equal(menu.toggle(), undefined);
  ids = ["id"];
  calls[0][2].onSuccess();
  assert.deepEqual(notifications[0], ["success", "profile.mutes.mute_success"]);
  menu.toggle();
  assert.equal(calls[1][0], "unmute");
  calls[1][2].onError();
  assert.deepEqual(notifications[1], [
    "error",
    "web.callouts.more.mute_failed",
  ]);
  unmute.isPending = true;
  assert.equal(menu.getState().disabled, true);
  let stopped = 0;
  menu.stopPropagation({
    stopPropagation() {
      stopped++;
    },
  });
  assert.equal(stopped, 1);
});
test("standalone filter keeps unknown authors and original array identity unless an exact muted author is removed", () => {
  const rows = [{ id: "muted" }, { id: "Muted" }, { id: null }, {}];
  let count = 0;
  const getAuthorId = (row) => {
    count++;
    return row.id;
  };
  assert.equal(
    filterMutedRows({ rows, mutedUserIds: new Set(), getAuthorId }),
    rows,
  );
  assert.equal(count, 0);
  const set = mutedIdSet(["muted", "muted"]);
  assert.equal(set.size, 1);
  assert.deepEqual(
    filterMutedRows({ rows, mutedUserIds: set, getAuthorId }),
    rows.slice(1),
  );
  assert.equal(
    filterMutedRows({ rows, mutedUserIds: new Set(["none"]), getAuthorId }),
    rows,
  );
  assert.equal(
    filterMutedRows({ rows: undefined, mutedUserIds: set, getAuthorId }),
    undefined,
  );
});
test("real loopback read → validated query cache → menu mute/unmute → rollback/settled/error notifications", async (t) => {
  const requests = [],
    notifications = [],
    reports = [];
  let writeStatus = 200;
  const userId = "00000000-0000-4000-8000-000000000001";
  const server = createServer((req, res) => {
    requests.push([req.method, req.url]);
    res.writeHead(req.method === "GET" ? 200 : writeStatus, {
      "content-type": "application/json",
    });
    res.end(
      JSON.stringify(
        req.method === "GET"
          ? { userIds: [], extra: "strip" }
          : { mutedAt: null },
      ),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(async () => {
    server.close();
    server.closeAllConnections();
    await once(server, "close");
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const client = mutesClient({
    api: async (operation, options) => {
      const [method, template] = operation.split(" ");
      const route = template.replace(/\{(\w+)\}/g, (_, key) =>
        encodeURIComponent(options.params[key]),
      );
      const response = await fetch(origin + route, {
        method,
        signal: options.signal,
      });
      if (!response.ok) throw Error(`Synthetic HTTP ${response.status}`);
      return response.json();
    },
  });
  const cache = cacheHarness(),
    key = muteQueryKey("viewer-A"),
    query = muteQueryOptions({ client, viewer: "viewer-A" });
  cache.setQueryData(key, await query.queryFn({ signal: undefined }));
  const options = muteMutationOptions({
    client,
    cache,
    viewer: "viewer-A",
    reportError: (v) => reports.push(v),
  });
  let last;
  const handle = (name) => ({
    isPending: false,
    mutate(variables, callbacks) {
      this.isPending = true;
      last = (async () => {
        const context = await options[name].onMutate(variables);
        let error;
        try {
          await options[name].mutationFn(variables);
        } catch (e) {
          error = e;
          options[name].onError(e, variables, context);
        }
        options[name].onSettled();
        this.isPending = false;
        error ? callbacks.onError(error) : callbacks.onSuccess();
      })();
    },
  });
  const mute = handle("mute"),
    unmute = handle("unmute");
  const menu = muteMenu({
    author: { userId, name: "Synthetic" },
    getWalletAddress: () => "explicit-client-gate",
    getMutedIds: () => cache.getQueryData(key).userIds,
    mute,
    unmute,
    showWallet: () => assert.fail(),
    notify: (...v) => notifications.push(v),
  });
  assert.equal(menu.toggle(), undefined);
  assert.equal(menu.getState().disabled, true);
  await last;
  assert.deepEqual(cache.getQueryData(key), { userIds: [userId] });
  assert.equal(menu.getState().muted, true);
  assert.deepEqual(notifications.at(-1), [
    "success",
    "profile.mutes.mute_success",
  ]);
  writeStatus = 503;
  menu.toggle();
  await last;
  assert.deepEqual(cache.getQueryData(key), { userIds: [userId] });
  assert.equal(reports[0].operation, "unmute");
  assert.deepEqual(notifications.at(-1), [
    "error",
    "web.callouts.more.mute_failed",
  ]);
  writeStatus = 200;
  menu.toggle();
  await last;
  assert.deepEqual(cache.getQueryData(key), { userIds: [] });
  assert.deepEqual(notifications.at(-1), [
    "success",
    "profile.mutes.unmute_success",
  ]);
  assert.deepEqual(requests, [
    ["GET", "/mutes"],
    ["POST", `/mutes/${userId}`],
    ["DELETE", `/mutes/${userId}`],
    ["DELETE", `/mutes/${userId}`],
  ]);
  assert.equal(cache.calls.filter(([type]) => type === "invalidate").length, 3);
});

function sourcePaths(value, result = new Set()) {
  if (
    typeof value === "string" &&
    /^evidence\/web\/objects\/[^/]+$/.test(value)
  )
    result.add(value);
  else if (Array.isArray(value))
    for (const item of value) sourcePaths(item, result);
  else if (value && typeof value === "object")
    for (const item of Object.values(value)) sourcePaths(item, result);
  return result;
}
async function corpusCopy() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "pump-mutes-source-"));
  const dependency = JSON.parse(
    await readFile(path.join(root, contract.dependency.path)),
  );
  for (const file of [
    "evidence/web/manifest.json",
    "recovered/modules.json",
    "contracts/internal-operations.json",
    outputPath,
    contract.dependency.path,
    ...new Set([...sourcePaths(contract), ...sourcePaths(dependency)]),
  ]) {
    await mkdir(path.dirname(path.join(dir, file)), { recursive: true });
    await copyFile(path.join(root, file), path.join(dir, file));
  }
  try {
    await verify(dir);
  } catch (error) {
    await rm(dir, { recursive: true, force: true });
    throw error;
  }
  return { dir, close: () => rm(dir, { recursive: true, force: true }) };
}
test("missing provider variants, stale prerequisite and invented global-filter claims fail closed", async () => {
  for (const mutation of ["variant", "dependency", "claim"]) {
    const f = await corpusCopy();
    try {
      const file = path.join(
        f.dir,
        mutation === "variant"
          ? "recovered/modules.json"
          : mutation === "dependency"
            ? contract.dependency.path
            : outputPath,
      );
      const value = JSON.parse(await readFile(file));
      if (mutation === "variant")
        value.modules = value.modules.filter(
          (m) => m.sha256 !== contract.providers[0].source.sha256,
        );
      else if (mutation === "dependency")
        value.configuration.captured_configurations[0].config.clientServerUrl =
          "https://synthetic.invalid";
      else value.utility.consumerEstablished = true;
      await writeFile(file, JSON.stringify(value));
      await assert.rejects(verify(f.dir));
    } finally {
      await f.close();
    }
  }
});
test("resealed capture/index hashes cannot silently replace the wallet-address gate with a function-presence gate", async () => {
  const f = await corpusCopy();
  try {
    const witness = contract.callbacks.walletGate.evidence,
      file = path.join(f.dir, witness.source),
      bytes = await readFile(file),
      body = bytes.subarray(...witness.utf8).toString();
    assert.ok(body.includes("!!ef"));
    const changed = Buffer.from(body.replace("!!ef", "!!eh"));
    assert.equal(changed.length, witness.utf8[1] - witness.utf8[0]);
    const mutated = Buffer.concat([
      bytes.subarray(0, witness.utf8[0]),
      changed,
      bytes.subarray(witness.utf8[1]),
    ]);
    await writeFile(file, mutated);
    const manifestFile = path.join(f.dir, "evidence/web/manifest.json"),
      manifest = JSON.parse(await readFile(manifestFile));
    manifest.records.find((r) => r.path === witness.source).sha256 =
      hash(mutated);
    await writeFile(manifestFile, JSON.stringify(manifest));
    const factory = contract.sources.find((m) => m.id === 609488),
      indexFile = path.join(f.dir, "recovered/modules.json"),
      index = JSON.parse(await readFile(indexFile));
    index.modules.find((m) => m.ids.includes(609488)).sha256 = hash(
      mutated.subarray(...factory.utf8),
    );
    await writeFile(indexFile, JSON.stringify(index));
    await assert.rejects(verify(f.dir), /review changed 609488/);
  } finally {
    await f.close();
  }
});
