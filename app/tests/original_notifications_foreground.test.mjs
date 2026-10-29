import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { once } from "node:events";
import { createHash } from "node:crypto";
import {
  recover,
  verify,
  outputPath,
} from "../scripts/original-notifications-foreground.mjs";
import { recover as recoverInbox } from "../scripts/original-notifications-inbox.mjs";
import {
  foregroundHandler,
  deliveryClient,
  confirmDelivery,
  dmTarget,
  dmDisposition,
  parseGenericV1,
  activeRoomRegistry,
  achievementToastContexts,
} from "../reconstruction/notifications-foreground/client.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const contract = await verify(root);
const hash = (value) => createHash("sha256").update(value).digest("hex");
const generic = (overrides = {}) =>
  JSON.stringify({
    notificationSubtype: "example",
    showAsToast: true,
    ...overrides,
  });
const dm = (overrides = {}) => ({
  data: {
    deeplink: "pump://dms/conversation",
    title: "Synthetic message",
    body: "Synthetic body",
    ...overrides,
  },
});
function harness(overrides = {}) {
  const events = [],
    rooms = activeRoomRegistry(),
    contexts = achievementToastContexts();
  const ports = {
    hermesApi: null,
    queryClient: {
      invalidateQueries: ({ queryKey }) =>
        events.push(["invalidate", queryKey]),
      getQueriesData: () => [],
    },
    getDeviceId: () => {
      events.push(["device"]);
      return "synthetic-device";
    },
    isActiveRoom: rooms.has,
    isAchievementToastOpen: contexts.isOpen,
    loadSensitiveContentDetector: async () => {
      events.push(["load-detector"]);
      return {
        containsDmSensitiveContent: (body) =>
          body === "[synthetic redacted content]",
      };
    },
    showToast: (view, options) => events.push(["toast", view, options]),
    now: () => 1000,
    ...overrides,
  };
  return { events, rooms, contexts, ports, handle: foregroundHandler(ports) };
}

test("source binds used handler/caller, both Hermes providers, complete available direct imports and chunk-selected detector", () => {
  assert.equal(contract.inventoryVariants, 5947);
  assert.equal(contract.sources.length, 9);
  assert.equal(contract.transport.providers.length, 2);
  assert.equal(
    contract.delivery.browserPath,
    "/api/hermes/notifications/confirm-delivery",
  );
  assert.equal(contract.delivery.awaitedByHandler, false);
  assert.equal(
    contract.delivery.serverAcknowledgementOrPersistenceEstablished,
    false,
  );
  assert.equal(contract.delivery.acceptHeaderAdded, false);
  assert.deepEqual(
    [
      contract.directMessages.durationMs,
      contract.nonDirectMessages.generic.durationMs,
      contract.nonDirectMessages.simple.durationMs,
    ],
    [8000, 10000, 8000],
  );
  const detector = contract.directMessages.detector;
  assert.equal(detector.allIdVariantsRetained.length, 5);
  assert.equal(
    detector.selected.sha256,
    "682c89dfd98fd2721db352a5bdbe3af30f02f94705d5f7c50c67d0b1a32d5503",
  );
  assert.ok(detector.chunkUrl.endsWith("/1wcrcydfivjkv.js"));
  for (const source of contract.sources)
    for (const imported of source.imports)
      assert.ok(imported.variants.length > 0);
  assert.equal(contract.compatibilityQualified, false);
});

test("empty/nullish presentation, explicit empty values and duplicate IDs retain captured branches", async () => {
  const h = harness();
  await h.handle({ payload: {}, pathname: "/" });
  assert.deepEqual(h.events[0], [
    "toast",
    {
      kind: "simple",
      title: "Notification",
      body: "",
      imageUrl: undefined,
      deeplink: undefined,
      listNavigation: undefined,
    },
    { duration: 8000, id: "hermes-simple-Notification" },
  ]);
  const payload = {
    notification: { title: "", body: "", image: "" },
    data: {
      title: "ignored",
      body: "ignored",
      imageUrl: "ignored",
      messageId: "",
    },
  };
  await h.handle({ payload, pathname: "/" });
  await h.handle({ payload, pathname: "/" });
  assert.equal(h.events[1][1].title, "");
  assert.equal(h.events[1][1].imageUrl, "");
  assert.equal(h.events[1][2].id, "hermes-simple-");
  assert.deepEqual(h.events[2], h.events[1]); // Renderer may deduplicate; handler does not.
});

test("loopback delivery is received while handler is complete; acknowledgement is not an admission gate", async () => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const received = [];
  const server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    received.push({
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: JSON.parse(body),
    });
    await gate;
    response.writeHead(204);
    response.end();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const pending = [];
  try {
    const api = deliveryClient({
      origin: `http://127.0.0.1:${server.address().port}/ignored`,
      transport: (...args) => {
        const result = fetch(...args);
        pending.push(result);
        return result;
      },
    });
    const h = harness({ hermesApi: api });
    await h.handle({
      payload: {
        data: {
          messageId: "synthetic-id",
          userId: "synthetic-user",
          timestamp: "synthetic-time",
          title: "Arrived",
        },
      },
      pathname: "/",
    });
    assert.equal(h.events.at(-1)[0], "toast");
    release();
    await Promise.all(pending);
    assert.equal(received.length, 1);
    assert.equal(received[0].method, "POST");
    assert.equal(received[0].url, "/api/hermes/notifications/confirm-delivery");
    assert.equal(received[0].headers["content-type"], "application/json");
    assert.notEqual(received[0].headers.accept, "application/json");
    assert.equal(received[0].headers.authorization, undefined);
    assert.deepEqual(received[0].body, {
      notificationId: "synthetic-id",
      userId: "synthetic-user",
      timestamp: "synthetic-time",
      platform: "web",
      deliveryLocation: "in_app",
      deviceId: "synthetic-device",
    });
  } finally {
    release();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

test("actual HTTP failure and transport rejection are swallowed without response decoding or invented success data", async () => {
  let requests = 0;
  const server = createServer((request, response) => {
    requests++;
    request.resume();
    response.writeHead(503, { "content-type": "text/plain" });
    response.end("synthetic unavailable");
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const api = deliveryClient({
      origin: `http://127.0.0.1:${server.address().port}`,
      transport: fetch,
    });
    assert.equal(
      await confirmDelivery(api, {
        notificationId: "x",
        userId: "u",
        timestamp: "t",
        deviceId: "",
      }),
      undefined,
    );
    assert.equal(requests, 1);
    assert.equal(
      await confirmDelivery(
        { post: () => Promise.reject(Error("synthetic offline")) },
        {},
      ),
      undefined,
    );
    assert.throws(
      () => deliveryClient({ origin: "file:///example", transport: fetch }),
      /HTTP/,
    );
    assert.throws(
      () => deliveryClient({ origin: "http://127.0.0.1" }),
      /Explicit transport/,
    );
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

test("delivery truthy gates and optional device ID apply before all suppression", async () => {
  const calls = [],
    api = {
      post: (input, options) => {
        calls.push([input, options]);
        return Promise.resolve();
      },
    };
  const h = harness({ hermesApi: api, getDeviceId: () => "" });
  for (const data of [
    {},
    { messageId: "x" },
    { messageId: "x", userId: "u" },
    { messageId: "", userId: "u", timestamp: "t" },
  ])
    await h.handle({ payload: { data }, pathname: "/" });
  assert.equal(calls.length, 0);
  const close = h.rooms.register(["conversation"]);
  await h.handle({
    payload: dm({ messageId: "x", userId: "u", timestamp: "t" }),
    pathname: "/",
  });
  close();
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1].json.deviceId, undefined);
  assert.deepEqual(h.events.slice(-2), [
    ["invalidate", ["dms", "inbox"]],
    ["invalidate", ["dms", "messages"]],
  ]);
});

test("DM target uses only pump dms links and validated optional metadata; destination double-encoding is preserved", async () => {
  assert.equal(dmTarget({ deeplink: "https://dms/person" }), undefined);
  assert.equal(dmTarget({ deeplink: "pump://profile/person" }), undefined);
  assert.deepEqual(dmTarget({ deeplink: "pump://dms" }), {});
  assert.deepEqual(
    dmTarget({
      deeplink: "pump://dms/room",
      genericV1: '{"metadata":{"senderUserId":"peer","bad":1}}',
    }),
    { conversationId: "room" },
  );
  const h = harness();
  await h.handle({
    payload: dm({ deeplink: "pump://dms/a%2Fb" }),
    pathname: "/",
  });
  assert.equal(h.events.at(-1)[1].roomPath, "/messages/a%252Fb");
  await h.handle({
    payload: dm({
      genericV1: '{"metadata":{"senderUserId":"peer /"}}',
      messageId: null,
    }),
    pathname: "/",
  });
  assert.equal(h.events.at(-1)[1].roomPath, "/messages/peer%20%2F");
  assert.equal(h.events.at(-1)[2].id, "hermes-dm-conversation");
  await h.handle({
    payload: { data: { genericV1: generic({ notificationSubtype: "dm" }) } },
    pathname: "/",
  });
  assert.equal(h.events.at(-1)[1].kind, "generic"); // Inbox DM filtering has a distinct predicate.
});

test("active-room registration counts overlap/duplicate IDs and cleanup is idempotent", () => {
  const rooms = activeRoomRegistry();
  const a = rooms.register(["room", "room", null, ""]),
    b = rooms.register(["room", "peer"]);
  assert.equal(rooms.has("room"), true);
  a();
  a();
  assert.equal(rooms.has("room"), true);
  b();
  assert.equal(rooms.has("room"), false);
  assert.equal(rooms.has("peer"), false);
});

test("DM invalidations precede disabled/active/exact-inbox admission; only admitted messages load the detector", async () => {
  for (const route of ["disabled", "active", "inbox"]) {
    const h = harness();
    if (route === "active") h.rooms.register(["conversation"]);
    await h.handle({
      payload: dm(),
      pathname: route === "inbox" ? "/messages" : "/",
      ...(route === "disabled" ? { isDirectMessagesEnabled: false } : {}),
    });
    assert.deepEqual(h.events, [
      ["invalidate", ["dms", "inbox"]],
      ["invalidate", ["dms", "messages"]],
    ]);
  }
  const h = harness();
  await h.handle({ payload: dm(), pathname: "/messages/another" });
  assert.equal(h.events[2][0], "load-detector");
  assert.equal(h.events[3][1].kind, "dm");
});

test("cached mute uses first matching entry and strict future time with active-room priority", () => {
  const target = { senderUserId: "peer", conversationId: "room" };
  const disposition = (entries, changes = {}) =>
    dmDisposition({
      target,
      pathname: "/",
      isActiveRoom: () => false,
      now: () => 1000,
      queryClient: {
        getQueriesData: ({ queryKey }) => {
          assert.deepEqual(queryKey, ["dms", "inbox"]);
          return [[[], { pages: [{ entries }] }]];
        },
      },
      ...changes,
    });
  assert.equal(
    disposition([{ peerId: "peer", isMuted: true, mutedUntil: null }]),
    "muted",
  );
  for (const mutedUntil of [
    "invalid",
    new Date(1000).toISOString(),
    new Date(999).toISOString(),
    undefined,
  ])
    assert.equal(
      disposition([{ conversationId: "room", isMuted: true, mutedUntil }]),
      "toast",
    );
  assert.equal(
    disposition([
      {
        conversationId: "room",
        isMuted: true,
        mutedUntil: new Date(1001).toISOString(),
      },
    ]),
    "muted",
  );
  assert.equal(
    disposition([
      { conversationId: "room", isMuted: false },
      { peerId: "peer", isMuted: true, mutedUntil: null },
    ]),
    "toast",
  );
  assert.equal(
    disposition([
      { conversationId: "room", isMuted: true, mutedUntil: null },
      { peerId: "peer", isMuted: false },
    ]),
    "muted",
  );
  assert.equal(
    disposition([], { pathname: "/messages", isActiveRoom: () => true }),
    "active_room",
  );
  assert.throws(
    () =>
      disposition([], {
        queryClient: { getQueriesData: () => [[[], { pages: [{}] }]] },
      }),
    TypeError,
  );
});

test("DM avatar truthy priority differs from generic nullish image priority; async detector rejection stays an error", async () => {
  const h = harness();
  await h.handle({
    payload: {
      notification: { image: "notification-image" },
      data: {
        ...dm().data,
        enhancedPresentationIconUrl: "enhanced",
        imageUrl: "other",
        body: "[synthetic redacted content]",
      },
    },
    pathname: "/",
  });
  assert.equal(h.events.at(-1)[1].avatarUrl, "enhanced");
  assert.equal(h.events.at(-1)[1].isRedacted, true);
  const failure = harness({
    loadSensitiveContentDetector: async () => {
      throw Error("synthetic lazy failure");
    },
  });
  await assert.rejects(
    failure.handle({ payload: dm(), pathname: "/" }),
    /lazy failure/,
  );
  assert.equal(failure.events.length, 2);
});

test("same-coin prefix/raw mint suppression precedes generic validation and allows non-pump URL coin host", async () => {
  const h = harness();
  for (const data of [
    { mintAddress: "mint" },
    { genericV1: '{"coinMetadata":{"mintAddress":"mint"}}' },
    { deeplink: "pump://coin/mint" },
    { deeplink: "https://coins/mint" },
    { deeplink: "pump://coin?mint=mint" },
  ])
    await h.handle({ payload: { data }, pathname: "/coin/mint-longer" });
  assert.equal(h.events.length, 0);
  await h.handle({
    payload: {
      data: { mintAddress: "different", deeplink: "pump://coins/mint" },
    },
    pathname: "/coin/mint",
  });
  assert.equal(h.events.length, 1); // First truthy raw mint wins.
});

test("generic schema strips unknown object keys and rejects malformed nested buttons/records/nulls", () => {
  const value = parseGenericV1(
    generic({
      unknown: "drop",
      toastButtons: [
        {
          type: "route",
          label: "Open",
          variant: "primary",
          pathname: "/profile/[id]",
          params: { id: "synthetic" },
          ignored: true,
        },
        {
          type: "dismiss",
          label: "Close",
          variant: "secondary",
          pathname: "ignored",
        },
      ],
      listNavigation: { pathname: "/", extra: true },
      coinMetadata: { mintAddress: "m", unknown: true },
      metadata: { key: "value" },
    }),
  );
  assert.equal(value.unknown, undefined);
  assert.equal(value.toastButtons[0].ignored, undefined);
  assert.equal(value.toastButtons[1].pathname, undefined);
  assert.deepEqual(value.listNavigation, { pathname: "/" });
  assert.deepEqual(value.coinMetadata, { mintAddress: "m" });
  for (const text of [
    "",
    "null",
    "[]",
    "oops",
    '{"notificationSubtype":"x"}',
    generic({ metadata: { key: 1 } }),
    generic({ coinMetadata: null }),
    generic({ listNavigation: { pathname: "/", params: { id: 1 } } }),
    generic({
      toastButtons: [
        { type: "route", variant: "primary", label: "Missing path" },
      ],
    }),
    generic({
      toastButtons: [{ type: "dismiss", variant: "unknown", label: "x" }],
    }),
  ])
    assert.equal(parseGenericV1(text), undefined);
});

test("showAsToast false and invalid generic fall back; explicit non-generic type bypasses generic rendering", async () => {
  const h = harness();
  await h.handle({
    payload: { data: { genericV1: generic() } },
    pathname: "/",
  });
  assert.equal(h.events.at(-1)[1].kind, "generic");
  assert.equal(h.events.at(-1)[2].duration, 10000);
  for (const data of [
    { genericV1: generic({ showAsToast: false }) },
    { genericV1: "invalid" },
    { type: "", genericV1: generic() },
  ]) {
    await h.handle({ payload: { data }, pathname: "/" });
    assert.equal(h.events.at(-1)[1].kind, "simple");
    assert.equal(h.events.at(-1)[2].duration, 8000);
  }
});

test("toast contexts are reference-counted and only limit_order_filled is suppressed", async () => {
  const h = harness();
  const a = h.contexts.register(),
    b = h.contexts.register();
  a();
  a();
  assert.equal(h.contexts.isOpen(), true);
  await h.handle({
    payload: {
      data: {
        genericV1: generic({ notificationSubtype: "limit_order_filled" }),
      },
    },
    pathname: "/",
  });
  assert.equal(h.events.length, 0);
  await h.handle({
    payload: {
      data: {
        genericV1: generic({ notificationSubtype: "achievement_unlocked" }),
      },
    },
    pathname: "/",
  });
  assert.equal(h.events.length, 1);
  b();
  assert.equal(h.contexts.isOpen(), false);
  await h.handle({
    payload: {
      data: {
        genericV1: generic({ notificationSubtype: "limit_order_filled" }),
      },
    },
    pathname: "/",
  });
  assert.equal(h.events.length, 2);
});

async function temporary() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "pump-foreground-"));
  const inbox = JSON.parse(
    await fs.readFile(
      path.join(root, contract.transport.reusedVerifiedContract),
    ),
  );
  const files = new Set([
    "recovered/modules.json",
    "evidence/web/manifest.json",
    "contracts/internal-operations.json",
    outputPath,
    contract.transport.reusedVerifiedContract,
  ]);
  for (const record of [...contract.sources, ...inbox.sources])
    files.add(record.source.source);
  for (const p of [
    ...contract.transport.providers,
    ...inbox.transport.providers,
  ])
    files.add(p.source.source);
  for (const file of files) {
    await fs.mkdir(path.dirname(path.join(dir, file)), { recursive: true });
    await fs.copyFile(path.join(root, file), path.join(dir, file));
  }
  return { dir, close: () => fs.rm(dir, { recursive: true, force: true }) };
}
async function reseal(dir, id, change) {
  const indexPath = path.join(dir, "recovered/modules.json"),
    index = JSON.parse(await fs.readFile(indexPath));
  const module = index.modules.find((m) => m.ids.includes(id));
  assert.equal(module.origins.length, 1);
  const origin = module.origins[0],
    sourcePath = path.join(dir, origin.source),
    text = await fs.readFile(sourcePath, "utf8");
  const old = text.slice(origin.start, origin.end),
    changed = change(old);
  assert.notEqual(changed, old);
  assert.equal(changed.length, old.length);
  await fs.writeFile(
    sourcePath,
    text.slice(0, origin.start) + changed + text.slice(origin.end),
  );
  module.sha256 = hash(changed);
  await fs.writeFile(indexPath, JSON.stringify(index));
  const manifestPath = path.join(dir, "evidence/web/manifest.json"),
    manifest = JSON.parse(await fs.readFile(manifestPath));
  for (const record of manifest.records)
    if (record.path === origin.source)
      record.sha256 = hash(await fs.readFile(sourcePath));
  await fs.writeFile(manifestPath, JSON.stringify(manifest));
  // Refresh the prerequisite's source/index anchors too: its unrelated rules
  // still hold. The new unit's own semantic checks must reject the mutation.
  await fs.writeFile(
    path.join(dir, contract.transport.reusedVerifiedContract),
    JSON.stringify(await recoverInbox(dir)),
  );
}

test("resealed guard/delivery/schema changes cannot preserve stale workflow claims", async () => {
  for (const [id, before, after] of [
    [32596, '"toast"!==', '"toast"==='],
    [32596, "showAsToast", "showAsToass"],
    [808142, "confirm-delivery", "confirm-delivert"],
    [26498, "active_room", "active_roox"],
    [404224, "if(!n)", "if( n)"],
  ]) {
    const t = await temporary();
    try {
      await reseal(t.dir, id, (text) => text.replace(before, after));
      await assert.rejects(
        recover(t.dir),
        /Foreground recovery: review changed/,
      );
    } finally {
      await t.close();
    }
  }
});

test("duration variants are derived, while stale generated metadata is rejected", async () => {
  const t = await temporary();
  try {
    await reseal(t.dir, 32596, (text) =>
      text.replace("duration:8e3", "duration:9e3"),
    );
    assert.equal((await recover(t.dir)).directMessages.durationMs, 9000);
    await assert.rejects(verify(t.dir), /derived contract differs/);
  } finally {
    await t.close();
  }
});

test("raw corruption, invented qualification and missing selected dynamic variant fail closed", async () => {
  for (const mutation of ["raw", "contract", "variant"]) {
    const t = await temporary();
    try {
      if (mutation === "raw")
        await fs.appendFile(
          path.join(t.dir, contract.sources[0].source.source),
          " ",
        );
      if (mutation === "contract") {
        const value = JSON.parse(
          await fs.readFile(path.join(t.dir, outputPath)),
        );
        value.compatibilityQualified = true;
        await fs.writeFile(path.join(t.dir, outputPath), JSON.stringify(value));
      }
      if (mutation === "variant") {
        const p = path.join(t.dir, "recovered/modules.json"),
          value = JSON.parse(await fs.readFile(p));
        value.modules = value.modules.filter(
          (m) => m.sha256 !== contract.directMessages.detector.selected.sha256,
        );
        await fs.writeFile(p, JSON.stringify(value));
      }
      await assert.rejects(verify(t.dir));
    } finally {
      await t.close();
    }
  }
});
