import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import {
  createOriginalDisplayRestore,
  originalDisplayRestoreSource,
} from "../packages/frontend/src/original-contracts/auth-display-restore/index.ts";
import {
  recover,
  assertOriginalAdaptation,
} from "../scripts/original-contracts/auth-display-restore/recover.mjs";
function fixture(options = {}) {
  const data = new Map(Object.entries(options.data ?? {})),
    events = [],
    timers = new Map();
  let snapshot = options.snapshot ?? null,
    requested = 0,
    timerId = 0,
    normalized = { address: "synthetic", exp: 1 };
  let request = options.request ?? (async () => ({ syntheticPayload: true }));
  const storage = {
    getItem(key) {
      events.push(`get:${key}`);
      if (options.getDenied) throw Error("synthetic get denial");
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      events.push(`set:${key}`);
      if (options.setDenied) throw Error("synthetic set denial");
      data.set(key, value);
    },
    removeItem(key) {
      events.push(`remove:${key}`);
      if (options.removeDenied) throw Error("synthetic remove denial");
      data.delete(key);
    },
  };
  const ports = {
    storage,
    reader: {
      D() {
        events.push("snapshot");
        if (options.readerDenied) throw Error("synthetic reader denial");
        return snapshot;
      },
      I() {
        events.push("notify");
        if (options.notifyDenied) throw Error("synthetic notify denial");
      },
    },
    normalize: {
      S(value) {
        assert.equal(this, undefined);
        events.push("normalize");
        if (options.normalizeDenied) throw Error("synthetic normalize denial");
        return normalized;
      },
    },
    clientBuilder: {
      K(config) {
        assert.equal(this, undefined);
        assert.deepEqual(config, { clientServerUrl: "synthetic.invalid" });
        events.push("builder");
        return async (operation, requestOptions) => {
          assert.equal(operation, "GET /auth/my-profile");
          assert.equal(requestOptions.credentials, "include");
          assert.deepEqual(requestOptions.headers, {
            "Cache-Control": "no-cache",
          });
          requested++;
          events.push("request");
          return request(requestOptions);
        };
      },
    },
    AbortController: class {
      signal = { aborted: false };
      constructor() {
        events.push("controller");
      }
      abort() {
        this.signal.aborted = true;
        events.push("abort");
      }
    },
    setTimeout(callback, ms) {
      assert.equal(ms, 8000);
      events.push("timer");
      const id = ++timerId;
      timers.set(id, callback);
      return id;
    },
    clearTimeout(id) {
      events.push("clear-timer");
      timers.delete(id);
    },
    logger: {
      info(message, metadata) {
        assert.equal(
          message,
          "cookie-session-recovery: restored display session",
        );
        assert.deepEqual(metadata, {});
        events.push("log");
        if (options.logDenied) throw Error("synthetic log denial");
      },
    },
  };
  const flow = createOriginalDisplayRestore(
    originalDisplayRestoreSource,
    ports,
  );
  events.length = 0;
  return {
    flow,
    ports,
    data,
    events,
    timers,
    get requested() {
      return requested;
    },
    set snapshot(value) {
      snapshot = value;
    },
    set normalized(value) {
      normalized = value;
    },
    set request(value) {
      request = value;
    },
  };
}
const run = (f) =>
  f.flow.restoreDisplay({ clientServerUrl: "synthetic.invalid" });

test("original pending state, restore and effect caller authenticate", async () => {
  const proof = await recover();
  assert.equal(proof.pending.factory.id, 594435);
  assert.equal(proof.provider.factory.id, 589428);
  assert.ok(
    proof.provider.witnesses.some((w) => w.label === "actual effect consumer"),
  );
  assert.equal(proof.outputs.length, 2);
});
test("AST proof rejects once-guard, timeout, request, recheck and pending-state tampering", async () => {
  for (const file of ["restore", "pending"]) {
    const original = await readFile(
      new URL(
        `../packages/frontend/src/original-contracts/auth-display-restore/${file}.mjs`,
        import.meta.url,
      ),
      "utf8",
    );
    const variants =
      file === "restore"
        ? [
            original.replace("8e3", "1e3"),
            original.replace("e7 = !0", "e7 = !1"),
            original.replace(
              '"GET /auth/my-profile"',
              '"POST /auth/my-profile"',
            ),
            original + '\nthrow Error("extra");',
          ]
        : [
            original.replace('"pending-logout"', '"other"'),
            original.replace("r = !0", "r = !1"),
          ];
    for (const changed of variants) {
      assert.notEqual(changed, original);
      assert.throws(
        () => assertOriginalAdaptation(changed, original),
        /original AST/,
      );
    }
  }
});
test("explicit original context rejects missing and unrelated sources", () => {
  for (const source of [undefined, "", "594435", "toString", "other"])
    assert.throws(
      () => createOriginalDisplayRestore(source, {}),
      /Explicit supported/,
    );
});
test("successful recovery preserves request/normalize/recheck/persist/notify/log order and one attempt", async () => {
  const f = fixture();
  assert.equal(await run(f), true);
  assert.deepEqual(f.events, [
    "snapshot",
    "get:decoded-jwt",
    "get:pending-logout",
    "controller",
    "timer",
    "builder",
    "request",
    "normalize",
    "get:pending-logout",
    "snapshot",
    "set:decoded-jwt",
    "notify",
    "log",
    "clear-timer",
  ]);
  assert.deepEqual(JSON.parse(f.data.get("decoded-jwt")), {
    address: "synthetic",
    exp: 1,
  });
  assert.equal(f.requested, 1);
  assert.equal(f.timers.size, 0);
  f.events.length = 0;
  assert.equal(await run(f), false);
  assert.deepEqual(f.events, []);
  assert.equal(f.requested, 1);
});
test("existing snapshot, decoded storage and pending logout suppress request; once flag remains set", async () => {
  for (const options of [
    { snapshot: { address: "existing" } },
    { data: { "decoded-jwt": "anything" } },
    { data: { "decoded-jwt": "" } },
    { data: { "pending-logout": "1" } },
    { getDenied: true },
  ]) {
    const f = fixture(options);
    assert.equal(await run(f), false);
    assert.equal(f.requested, 0);
    assert.equal(f.timers.size, 0);
    f.data.clear();
    f.snapshot = null;
    assert.equal(await run(f), false);
    assert.equal(f.requested, 0);
  }
});
test("pending logout initializes from storage, latches memory and consumes via original persistent operations", () => {
  const f = fixture();
  assert.equal(f.flow.pendingLogout.isPending(), false);
  f.flow.pendingLogout.markPending();
  assert.equal(f.data.get("pending-logout"), "1");
  f.events.length = 0;
  assert.equal(f.flow.pendingLogout.isPending(), true);
  assert.deepEqual(f.events, []);
  assert.equal(f.flow.pendingLogout.consume(), true);
  assert.equal(f.data.has("pending-logout"), false);
  assert.equal(f.flow.pendingLogout.consume(), false);
  const persisted = fixture({ data: { "pending-logout": "1" } });
  assert.equal(persisted.flow.pendingLogout.isPending(), true);
  assert.equal(persisted.flow.pendingLogout.consume(), true);
});
test("pending storage denial preserves memory and failed persistent removal is observed again", () => {
  const denied = fixture({
    getDenied: true,
    setDenied: true,
    removeDenied: true,
  });
  assert.equal(denied.flow.pendingLogout.isPending(), false);
  denied.flow.pendingLogout.markPending();
  assert.equal(denied.flow.pendingLogout.consume(), true);
  assert.equal(denied.flow.pendingLogout.consume(), false);
  const persistent = fixture({
    data: { "pending-logout": "1" },
    removeDenied: true,
  });
  assert.equal(persistent.flow.pendingLogout.consume(), true);
  assert.equal(persistent.flow.pendingLogout.consume(), true);
});
test("logout during request or failed normalization suppresses display restoration", async () => {
  const f = fixture();
  f.request = async () => {
    f.flow.pendingLogout.markPending();
    return {};
  };
  assert.equal(await run(f), false);
  assert.equal(f.data.has("decoded-jwt"), false);
  assert.equal(f.events.includes("notify"), false);
  assert.equal(f.timers.size, 0);
  const malformed = fixture();
  malformed.normalized = null;
  assert.equal(await run(malformed), false);
  assert.equal(malformed.data.has("decoded-jwt"), false);
  assert.equal(malformed.timers.size, 0);
});
test("a concurrently restored reader yields true without overwriting storage or notifying", async () => {
  const f = fixture();
  f.request = async () => {
    f.snapshot = { address: "concurrent" };
    return {};
  };
  assert.equal(await run(f), true);
  assert.equal(f.data.has("decoded-jwt"), false);
  assert.equal(f.events.includes("notify"), false);
  assert.equal(f.events.includes("log"), false);
  assert.equal(f.timers.size, 0);
});
test("network, normalization, persistence, notification and logging errors keep original partial state and timer cleanup", async () => {
  for (const options of [
    {
      request: async () => {
        throw Error("synthetic request denial");
      },
    },
    { normalizeDenied: true },
    { setDenied: true },
    { notifyDenied: true },
    { logDenied: true },
  ]) {
    const f = fixture(options);
    assert.equal(await run(f), false);
    assert.equal(f.timers.size, 0);
    assert.equal(f.events.at(-1), "clear-timer");
    if (options.notifyDenied || options.logDenied)
      assert.equal(f.data.has("decoded-jwt"), true);
    f.events.length = 0;
    assert.equal(await run(f), false);
    assert.deepEqual(f.events, []);
  }
  const cyclic = fixture();
  const claim = {};
  claim.self = claim;
  cyclic.normalized = claim;
  assert.equal(await run(cyclic), false);
  assert.equal(cyclic.timers.size, 0);
});
test("timeout aborts the injected controller and a client rejection becomes false", async () => {
  const f = fixture();
  let rejectRequest, signal;
  f.request = (options) => {
    signal = options.signal;
    return new Promise((_resolve, reject) => {
      rejectRequest = reject;
    });
  };
  const pending = run(f);
  assert.equal(signal.aborted, false);
  assert.equal(f.timers.size, 1);
  [...f.timers.values()][0]();
  assert.equal(signal.aborted, true);
  rejectRequest(Error("synthetic abort"));
  assert.equal(await pending, false);
  assert.equal(f.timers.size, 0);
});
test("an abort-ignoring client may still restore after timeout, as the original has no abort-status guard", async () => {
  const f = fixture();
  let resolve;
  f.request = () =>
    new Promise((r) => {
      resolve = r;
    });
  const pending = run(f);
  [...f.timers.values()][0]();
  resolve({});
  assert.equal(await pending, true);
  assert.equal(f.data.has("decoded-jwt"), true);
  assert.equal(f.timers.size, 0);
});
test("reader/controller errors before try propagate and the once flag still prevents retries", async () => {
  const f = fixture({ readerDenied: true });
  await assert.rejects(run(f), /reader denial/);
  assert.equal(await run(f), false);
  const g = fixture();
  g.ports.AbortController = class {
    constructor() {
      throw Error("synthetic controller denial");
    }
  };
  // Kernels capture capabilities at construction, so construct the explicit controller variant.
  const flow = createOriginalDisplayRestore(
    originalDisplayRestoreSource,
    g.ports,
  );
  await assert.rejects(
    flow.restoreDisplay({ clientServerUrl: "synthetic.invalid" }),
    /controller denial/,
  );
  assert.equal(
    await flow.restoreDisplay({ clientServerUrl: "synthetic.invalid" }),
    false,
  );
});
