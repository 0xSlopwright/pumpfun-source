import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  recover,
  verify,
  outputPath,
} from "../scripts/original-dm-realtime.mjs";
import {
  dmRealtimeSession,
  parseDmSignal,
  dmRealtimeSubject,
  perUserAuthReady,
} from "../reconstruction/dm-realtime/client.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const contract = await verify(root);
const hash = (v) => createHash("sha256").update(v).digest("hex");
const signal = (id, extra = {}) => ({
  type: "dm_message",
  messageId: id,
  conversationId: "synthetic-room",
  senderId: "synthetic-peer",
  ...extra,
});

function clock() {
  let now = 0,
    serial = 0;
  const jobs = new Map();
  return {
    jobs,
    set(fn, delay) {
      const id = ++serial;
      jobs.set(id, { fn, at: now + delay, delay });
      return id;
    },
    clear(id) {
      jobs.delete(id);
    },
    advance(ms) {
      const end = now + ms;
      for (;;) {
        const next = [...jobs]
          .filter(([, v]) => v.at <= end)
          .sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
        if (!next) break;
        const [id, job] = next;
        now = job.at;
        jobs.delete(id);
        job.fn();
      }
      now = end;
    },
  };
}
function harness({ initial = {}, ...changes } = {}) {
  const timers = clock(),
    bus = new EventTarget(),
    visibility = new EventTarget();
  const calls = [],
    subscriptions = new Map(),
    peers = [],
    errors = [],
    invalidated = [];
  let sequence = 0,
    state = "hidden";
  const ports = {
    queryClient: {
      invalidateQueries({ queryKey }) {
        invalidated.push(queryKey);
      },
    },
    subscribe(type, subject, callback, fourth, options) {
      calls.push(["subscribe", type, subject, fourth, options]);
      const id = `synthetic-${++sequence}`;
      const listener = (event) => callback(event.data);
      bus.addEventListener(subject, listener);
      subscriptions.set(id, { subject, listener });
      return id;
    },
    unsubscribe(type, id) {
      calls.push(["unsubscribe", type, id]);
      const record = subscriptions.get(id);
      if (record) bus.removeEventListener(record.subject, record.listener);
      subscriptions.delete(id);
    },
    visibilityTarget: visibility,
    visibilityState: () => state,
    onPeerMessage: (value) => peers.push(value),
    onSubscriptionError: (...args) => errors.push(args),
    setTimer: timers.set,
    clearTimer: timers.clear,
    random: () => 0.25,
    initial: {
      enabled: true,
      userId: "synthetic-user",
      viewer: "synthetic-viewer",
      authReady: true,
      connected: false,
      ...initial,
    },
    ...changes,
  };
  const session = dmRealtimeSession(ports);
  return {
    session,
    ports,
    timers,
    calls,
    peers,
    errors,
    invalidated,
    subscriptions,
    emit(value, subject = "dm.user.synthetic-user") {
      bus.dispatchEvent(new MessageEvent(subject, { data: value }));
    },
    visibility(value) {
      state = value;
      visibility.dispatchEvent(new Event("visibilitychange"));
    },
  };
}

test("contract authenticates actual shell/loader/reexport/hook and both enum variants without an invented broker URL", () => {
  assert.equal(contract.inventoryVariants, 5947);
  assert.equal(contract.incoming.chain.length, 6);
  assert.ok(contract.incoming.chunkUrl.endsWith("/3sy33-ehp6vax.js"));
  assert.equal(contract.subscription.coreVariants.length, 2);
  assert.equal(contract.subscription.transportOrigin, null);
  assert.equal(contract.subscription.wireProtocolOrServerAuthQualified, false);
  assert.equal(contract.event.dedup.capacity, 500);
  assert.equal(contract.refresh.trailingWindowMs, 1000);
  assert.equal(contract.reconnect.jitterMs, 5000);
  assert.equal(contract.compatibilityQualified, false);
  for (const m of contract.sources)
    for (const imported of m.imports) assert.ok(imported.variants.length > 0);
});

test("parser requires captured string fields, strips extras and preserves empty strings", () => {
  assert.deepEqual(
    parseDmSignal(signal("one", { ignored: true })),
    signal("one"),
  );
  assert.deepEqual(
    parseDmSignal({ type: "", messageId: "", conversationId: "" }),
    { type: "", messageId: "", conversationId: "" },
  );
  for (const value of [
    null,
    [],
    "x",
    {},
    signal("x", { senderId: null }),
    signal("x", { createdAt: 5 }),
    signal(1),
  ])
    assert.equal(parseDmSignal(value), undefined);
  assert.equal(dmRealtimeSubject("id /"), "dm.user.id /");
  assert.equal(perUserAuthReady({ flag: false, ready: false }), true);
  assert.equal(perUserAuthReady({ flag: true, ready: false }), false);
  assert.equal(perUserAuthReady({ flag: true, ready: true }), true);
});

test("explicit source gates control actual EventTarget subscription; connected is not a gate", () => {
  for (const initial of [
    { enabled: false },
    { userId: null },
    { authReady: false },
  ]) {
    const h = harness({ initial });
    assert.equal(h.calls.length, 0);
    h.session.dispose();
  }
  const h = harness();
  assert.deepEqual(h.calls, [
    [
      "subscribe",
      "CORE",
      "dm.user.synthetic-user",
      undefined,
      { coalesce: false },
    ],
  ]);
  h.emit(signal("one"));
  assert.equal(h.invalidated.length, 2);
  h.session.dispose();
  const empty = harness({ initial: { userId: "" } });
  assert.equal(empty.calls[0][2], "dm.user.");
  empty.session.dispose();
});

test("real local event source exercises leading refresh, one trailing refresh and no cooldown from trailing", () => {
  const h = harness();
  h.emit(signal("a"));
  assert.deepEqual(h.invalidated, [
    ["dms", "inbox", "synthetic-viewer"],
    ["dms", "messages", "synthetic-viewer"],
  ]);
  h.emit(signal("a"));
  h.timers.advance(999);
  assert.equal(h.invalidated.length, 2);
  h.timers.advance(1);
  assert.equal(h.invalidated.length, 2); // Duplicate did not set pending.
  h.emit(signal("b"));
  h.emit(signal("c"));
  h.emit(signal("d"));
  assert.equal(h.invalidated.length, 4);
  h.timers.advance(1000);
  assert.equal(h.invalidated.length, 6);
  assert.equal(h.timers.jobs.size, 0);
  h.emit(signal("e"));
  assert.equal(h.invalidated.length, 8);
  h.session.dispose();
});

test("dedup is FIFO capped at 500 and duplicates do not renew the oldest insertion", () => {
  const h = harness();
  for (let i = 0; i < 500; i++) h.emit(signal(`id-${i}`));
  assert.equal(h.peers.length, 500);
  h.emit(signal("id-0"));
  assert.equal(h.peers.length, 500);
  h.emit(signal("id-500"));
  h.emit(signal("id-0"));
  assert.equal(h.peers.length, 502);
  assert.equal(h.invalidated.length, 2);
  h.timers.advance(1000);
  assert.equal(h.invalidated.length, 4);
  h.session.dispose();
});

test("only accepted unique dm_message signals report defined non-self sender before refresh", () => {
  const sequence = [];
  const h = harness({
    onPeerMessage: (value) => sequence.push(["peer", value]),
    queryClient: {
      invalidateQueries: ({ queryKey }) =>
        sequence.push(["invalidate", queryKey]),
    },
  });
  for (const value of [
    null,
    signal("bad", { senderId: null }),
    signal("ignored", { type: "other" }),
  ])
    h.emit(value);
  assert.equal(sequence.length, 0);
  h.emit(signal("a", { createdAt: "synthetic-time" }));
  assert.equal(sequence[0][0], "peer");
  assert.deepEqual(sequence[0][1], {
    messageId: "a",
    conversationId: "synthetic-room",
    peerId: "synthetic-peer",
    deliveryChannel: 1,
    createdAt: "synthetic-time",
  });
  assert.equal(sequence[1][0], "invalidate");
  h.emit(signal("b", { senderId: "synthetic-user" }));
  h.emit(signal("c", { senderId: undefined }));
  assert.equal(sequence.filter(([kind]) => kind === "peer").length, 1);
  h.session.dispose();
});

test("initial connection does not refresh; a seen disconnect/reconnect gets bounded injected jitter", () => {
  const h = harness();
  h.session.configure({ connected: true });
  assert.equal(h.timers.jobs.size, 0);
  h.session.configure({ connected: false });
  h.session.configure({ connected: true });
  assert.equal([...h.timers.jobs.values()][0].delay, 1250);
  h.timers.advance(1249);
  assert.equal(h.invalidated.length, 0);
  h.timers.advance(1);
  assert.equal(h.invalidated.length, 2);
  h.session.configure({ connected: true });
  assert.equal(h.timers.jobs.size, 0);
  h.session.dispose();
});

test("reconnect effect cancellation retains pending flag and refreshes the updated viewer", () => {
  const h = harness({ initial: { connected: true }, random: () => 1 });
  h.session.configure({ connected: false });
  h.session.configure({ connected: true });
  assert.equal(h.timers.jobs.size, 1);
  h.timers.advance(4000);
  h.session.configure({ viewer: "new-viewer" });
  assert.equal(h.calls.filter(([kind]) => kind === "subscribe").length, 1); // Callback ref update only.
  h.timers.advance(1000);
  assert.equal(h.invalidated.length, 0);
  h.timers.advance(4000);
  assert.deepEqual(h.invalidated, [
    ["dms", "inbox", "new-viewer"],
    ["dms", "messages", "new-viewer"],
  ]);
  h.session.dispose();
});

test("visibility uses weaker enabled/user gate, exact visible state, and real listener cleanup", () => {
  const h = harness({ initial: { authReady: false } });
  assert.equal(h.calls.length, 0);
  h.visibility("hidden");
  assert.equal(h.invalidated.length, 0);
  h.visibility("visible");
  assert.equal(h.invalidated.length, 2);
  h.session.configure({ viewer: "next" });
  h.visibility("visible");
  assert.deepEqual(h.invalidated.at(-1), ["dms", "messages", "next"]);
  h.session.configure({ enabled: false });
  h.visibility("visible");
  assert.equal(h.invalidated.length, 4);
  h.session.dispose();
});

test("input changes retain hook-lifetime dedup and first-event pending timer's old viewer", () => {
  const h = harness();
  h.emit(signal("a"));
  h.emit(signal("b"));
  h.session.configure({ userId: "second-user", viewer: "second-viewer" });
  assert.equal(h.subscriptions.size, 1);
  assert.equal(h.calls.at(-1)[2], "dm.user.second-user");
  h.emit(signal("a"), "dm.user.second-user");
  assert.equal(h.peers.length, 2);
  h.timers.advance(1000);
  assert.deepEqual(h.invalidated.at(-1), [
    "dms",
    "messages",
    "synthetic-viewer",
  ]);
  h.emit(signal("c"), "dm.user.second-user");
  assert.deepEqual(h.invalidated.at(-1), ["dms", "messages", "second-viewer"]);
  h.session.dispose();
});

test("disabling does not invent cancellation of the original event window; dispose does", () => {
  const h = harness();
  h.emit(signal("a"));
  h.emit(signal("b"));
  h.session.configure({ enabled: false });
  h.timers.advance(1000);
  assert.equal(h.invalidated.length, 4);
  h.session.configure({ enabled: true, connected: true });
  h.emit(signal("c"));
  h.emit(signal("d"));
  h.session.configure({ connected: false });
  h.session.configure({ connected: true });
  assert.equal(h.timers.jobs.size, 2);
  h.session.dispose();
  h.session.dispose();
  assert.equal(h.timers.jobs.size, 0);
  assert.equal(h.subscriptions.size, 0);
  const before = h.invalidated.length;
  h.emit(signal("after"));
  h.visibility("visible");
  h.timers.advance(10000);
  assert.equal(h.invalidated.length, before);
  assert.throws(() => h.session.configure({ enabled: true }), /Disposed/);
});

test("subscription errors remain reported and retry only follows changed effect dependencies", () => {
  const h = harness({
    subscribe: () => {
      throw Error("synthetic subscription unavailable");
    },
  });
  assert.equal(h.errors.length, 1);
  assert.match(h.errors[0][0], /dm.user.synthetic-user/);
  h.session.configure({ viewer: "next" });
  assert.equal(h.errors.length, 1);
  h.session.configure({ authReady: false });
  h.session.configure({ authReady: true });
  assert.equal(h.errors.length, 2);
  h.session.dispose();
  const falsy = harness({ subscribe: () => 0 });
  falsy.session.dispose();
  assert.equal(
    falsy.calls.filter(([kind]) => kind === "unsubscribe").length,
    0,
  );
});

test("peer callback and invalidation failures are observable before later side effects", () => {
  let callback;
  const h = harness({
    subscribe: (_type, _subject, receive) => {
      callback = receive;
      return "id";
    },
    unsubscribe: () => {},
    onPeerMessage: () => {
      throw Error("synthetic peer callback failure");
    },
  });
  assert.throws(() => callback(signal("a")), /peer callback/);
  callback(signal("a"));
  assert.equal(h.invalidated.length, 0);
  assert.equal(h.timers.jobs.size, 0);
  h.session.dispose();
  const fail = harness({
    subscribe: (_type, _subject, receive) => {
      callback = receive;
      return "id";
    },
    unsubscribe: () => {},
    queryClient: {
      invalidateQueries: () => {
        throw Error("synthetic invalidate failure");
      },
    },
  });
  assert.throws(() => callback(signal("b")), /invalidate failure/);
  assert.equal(fail.timers.jobs.size, 0);
  fail.session.dispose();
});

test("actual timer/EventTarget workflow fires one trailing refresh and removes its subscription", async () => {
  const h = harness({ setTimer: setTimeout, clearTimer: clearTimeout });
  try {
    h.emit(signal("a"));
    h.emit(signal("b"));
    assert.equal(h.invalidated.length, 2);
    await new Promise((resolve) => setTimeout(resolve, 1050));
    assert.equal(h.invalidated.length, 4);
  } finally {
    h.session.dispose();
  }
  h.emit(signal("after"));
  assert.equal(h.invalidated.length, 4);
});

async function temporary() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "pump-dm-realtime-"));
  const files = new Set([
    "recovered/modules.json",
    "evidence/web/manifest.json",
    outputPath,
    ...contract.sources.map((s) => s.source.source),
  ]);
  for (const file of files) {
    await fs.mkdir(path.dirname(path.join(dir, file)), { recursive: true });
    await fs.copyFile(path.join(root, file), path.join(dir, file));
  }
  return { dir, close: () => fs.rm(dir, { recursive: true, force: true }) };
}
async function reseal(dir, id, change) {
  const indexPath = path.join(dir, "recovered/modules.json"),
    index = JSON.parse(await fs.readFile(indexPath)),
    record = index.modules.find((m) => m.ids.includes(id));
  assert.equal(record.origins.length, 1);
  const origin = record.origins[0],
    source = path.join(dir, origin.source),
    text = await fs.readFile(source, "utf8"),
    before = text.slice(origin.start, origin.end),
    after = change(before);
  assert.notEqual(after, before);
  assert.equal(after.length, before.length);
  await fs.writeFile(
    source,
    text.slice(0, origin.start) + after + text.slice(origin.end),
  );
  record.sha256 = hash(after);
  await fs.writeFile(indexPath, JSON.stringify(index));
  const manifestPath = path.join(dir, "evidence/web/manifest.json"),
    manifest = JSON.parse(await fs.readFile(manifestPath));
  for (const row of manifest.records)
    if (row.path === origin.source)
      row.sha256 = hash(await fs.readFile(source));
  await fs.writeFile(manifestPath, JSON.stringify(manifest));
}

test("resealed dedup/cleanup/readiness/caller mutations fail their own source relationships", async () => {
  for (const [id, before, after] of [
    [754054, "r.has(n.data.messageId)", "r.add(n.data.messageId)"],
    [754054, "&&!!o", "||!!o"],
    [573525, "T.current=b", "T.current=e"],
    [283087, "!e||l", "!e&&l"],
    [543301, "3sy33-ehp6vax", "3sy33-ehp6vay"],
  ]) {
    const t = await temporary();
    try {
      await reseal(t.dir, id, (s) => s.replace(before, after));
      await assert.rejects(recover(t.dir), /DM realtime recovery:/);
    } finally {
      await t.close();
    }
  }
});

test("capacity/timer variants are derived only when actual exports agree; stale contract fails", async () => {
  for (const [change, check] of [
    [
      (s) => s.replace(">=500", ">=499"),
      (c) => assert.equal(c.event.dedup.capacity, 499),
    ],
    [
      (s) => s.replaceAll("1e3", "2e3"),
      (c) => assert.equal(c.refresh.trailingWindowMs, 2000),
    ],
  ]) {
    const t = await temporary();
    try {
      await reseal(t.dir, 754054, change);
      check(await recover(t.dir));
      await assert.rejects(verify(t.dir), /generated contract differs/);
    } finally {
      await t.close();
    }
  }
  const t = await temporary();
  try {
    await reseal(t.dir, 754054, (s) => s.replace("1e3", "2e3"));
    await assert.rejects(recover(t.dir), /exported timer constants differ/);
  } finally {
    await t.close();
  }
});

test("raw corruption, missing enum variant and invented server qualification fail closed", async () => {
  for (const variant of ["raw", "enum", "contract"]) {
    const t = await temporary();
    try {
      if (variant === "raw")
        await fs.appendFile(
          path.join(t.dir, contract.sources[0].source.source),
          " ",
        );
      if (variant === "enum") {
        const p = path.join(t.dir, "recovered/modules.json"),
          value = JSON.parse(await fs.readFile(p));
        value.modules = value.modules.filter(
          (m) =>
            m.sha256 !== contract.subscription.coreVariants[0].source.sha256,
        );
        await fs.writeFile(p, JSON.stringify(value));
      }
      if (variant === "contract") {
        const p = path.join(t.dir, outputPath),
          value = JSON.parse(await fs.readFile(p));
        value.subscription.wireProtocolOrServerAuthQualified = true;
        await fs.writeFile(p, JSON.stringify(value));
      }
      await assert.rejects(verify(t.dir));
    } finally {
      await t.close();
    }
  }
});
