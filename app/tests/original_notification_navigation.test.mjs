import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import {
  recover,
  verify,
  outputPath,
} from "../scripts/original-notification-navigation.mjs";
import {
  navigationIntent,
  hrefForIntent,
  pumpLinkIntent,
  resolveNotificationHref,
  notificationHref,
  dmNavigationMarker,
  activateNotification,
} from "../reconstruction/notification-navigation/client.mjs";
import {
  readInboxPage,
  visibleInboxItems,
} from "../reconstruction/notifications-inbox/client.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const contract = await verify(root);
const hash = (value) => createHash("sha256").update(value).digest("hex");

test("source binds actual topbar row/click/router/imports and preserves explicit missing-reader boundary", () => {
  assert.equal(contract.inventoryVariants, 5947);
  assert.equal(contract.sources.length, 9);
  assert.equal(contract.incoming.rowExport, "763956.f");
  assert.equal(contract.incoming.surface, "topbar");
  assert.equal(contract.activation.entryPoint, 8);
  assert.equal(contract.marker.persistenceOrReaderImplemented, false);
  assert.equal(
    contract.destinations.responseOrUrlSecurityValidatorAdded,
    false,
  );
  assert.equal(contract.compatibilityQualified, false);
  for (const m of contract.sources)
    for (const imported of m.imports) assert.ok(imported.variants.length > 0);
});

test("all captured special structured route families keep their encoding/remapping", () => {
  const cases = [
    ["/coins/[mint]", { mint: "mint /" }, "/coin/mint%20%2F"],
    ["/profile/[id]", { id: " user / " }, "/profile/%20user%20%2F%20"],
    ["/profile/[id]", { userIdentifier: "fallback" }, "/profile/fallback"],
    [
      "/achievements/[id]",
      { id: "pack /" },
      "/achievements/pack%20%2F?reveal=1",
    ],
    [
      "/trending/[mint]",
      { mint: "m", source: "ignored-in-href" },
      "/trending/m",
    ],
    [
      "/bounties/[taskId]",
      { taskId: "task /", submissionId: "sub", comment: "comment /" },
      "/go/task%20%2F/submissions/sub?comment=comment%20%2F",
    ],
    [
      "/go/[id]/submissions/[submissionId]",
      { id: "task", submissionId: "sub" },
      "/go/task/submissions/sub",
    ],
    ["/go/[id]", { id: "task", comment: "yes" }, "/go/task?comment=yes"],
    ["/communities", undefined, "/communities"],
    ["/coins/community/[mint]", { mint: "m /" }, "/coins/community/m%20%2F"],
    ["/dms", undefined, "/messages"],
    ["/dms/[userId]", { userId: "peer /" }, "/messages/peer%20%2F"],
  ];
  for (const [pathname, params, expected] of cases)
    assert.equal(
      resolveNotificationHref({ listNavigation: { pathname, params } }),
      expected,
    );
});

test("structured fallbacks preserve nullish identity choice, first-only placeholders and malformed shapes", () => {
  assert.equal(
    resolveNotificationHref({
      listNavigation: {
        pathname: "/profile/[id]",
        params: { id: "", userIdentifier: "fallback" },
      },
    }),
    "/profile/",
  );
  assert.equal(
    resolveNotificationHref({
      listNavigation: {
        pathname: "/x/[id]/[id]",
        params: { id: "a/b", unused: "x" },
      },
    }),
    "/x/a%2Fb/[id]",
  );
  assert.equal(
    resolveNotificationHref({
      listNavigation: { pathname: "/literal", params: { unused: "x" } },
    }),
    "/literal",
  );
  assert.equal(
    notificationHref({ navigation: {}, deeplink: "/fallback" }),
    undefined,
  );
  assert.throws(
    () => resolveNotificationHref({ listNavigation: { params: { id: "x" } } }),
    TypeError,
  );
  assert.equal(
    hrefForIntent({ type: "profile", id: { address: " ", userId: " id / " } }),
    "/profile/id%20%2F",
  );
  assert.equal(hrefForIntent({ type: "profile", id: null }), null);
  assert.equal(hrefForIntent({ type: "unknown" }), "/");
});

test("item navigation uses nullish selection before the resolver's truthy structured gate", () => {
  const item = {
    navigation: { pathname: "/profile/[id]", params: { id: "first" } },
    genericV1: { listNavigation: { pathname: "/dms" } },
    deeplink: "pump://coins/mint",
  };
  assert.equal(notificationHref(item), "/profile/first");
  assert.equal(notificationHref({ ...item, navigation: null }), "/messages");
  assert.equal(notificationHref({ ...item, navigation: "" }), "/coin/mint"); // Does not select generic listNavigation.
  assert.equal(
    notificationHref({
      deeplink: "/plain",
      genericV1: '{"listNavigation":{"pathname":"/dms"}}',
    }),
    "/plain",
  ); // No JSON parse here.
});

test("legacy/modern pump links cover every captured hostname family and preserve encoded segments", () => {
  const cases = [
    ["pump://coin/mint", "/coin/mint"],
    ["pump://coins/mint?source=feed", "/coin/mint"],
    ["pump://coin?mint=a%2Fb", "/coin/a%2Fb"],
    ["pump://profile/a%2Fb", "/profile/a%252Fb"],
    ["pump://trending/mint", "/trending/mint"],
    ["pump://communities", "/communities"],
    ["pump://communities/mint", "/coins/community/mint"],
    [
      "pump://communities/mint/posts/post",
      "/coins/community/replies/mint/post",
    ],
    [
      "pump://go/task/submissions/sub?comment=a+b",
      "/go/task/submissions/sub?comment=a%20b",
    ],
    ["pump://account/privacy?ignored=1", "/account/privacy"],
    ["pump://dms", "/messages"],
    ["pump://dms/a%2Fb", "/messages/a%252Fb"],
    ["pump://achievements/pack", "/achievements/pack?reveal=1"],
    ["pump://custom/path?ignored=1", "/custom/path"],
  ];
  for (const [deeplink, expected] of cases)
    assert.equal(resolveNotificationHref({ deeplink }), expected);
  assert.equal(pumpLinkIntent("pump://coins/mint?source=").source, "");
  assert.equal(pumpLinkIntent("pump://coins/mint").source, "notification");
  for (const deeplink of [
    "pump://coins",
    "pump://profile",
    "pump://trending",
    "pump://go",
    "pump://achievements",
    "PUMP://coins/mint",
    "not a link",
  ])
    assert.equal(resolveNotificationHref({ deeplink }), "/");
});

test("NEAR prefix is stripped only for captured account regex; generic routes do not validate mints", () => {
  for (const mint of ["alice.near", "ab", "name-with-dash"])
    assert.equal(
      hrefForIntent({ type: "coin", mint: `near:mainnet:${mint}` }),
      `/coin/${mint}`,
    );
  assert.equal(
    hrefForIntent({ type: "coin", mint: "near:mainnet:invalid_" }),
    "/coin/near%3Amainnet%3Ainvalid_",
  );
  assert.equal(
    hrefForIntent({ type: "coin", mint: "other:mainnet:alice.near" }),
    "/coin/other%3Amainnet%3Aalice.near",
  );
  assert.throws(() => hrefForIntent({ type: "coin", mint: 1 }), TypeError);
});

test("relative and lowercase http-prefix fallbacks retain source URL boundaries", () => {
  assert.equal(
    resolveNotificationHref({ deeplink: "/profile/../raw?x=1#part" }),
    "/profile/../raw?x=1#part",
  );
  assert.equal(
    resolveNotificationHref({
      deeplink: "https://example.invalid/path?x=1#part",
    }),
    "/path?x=1",
  );
  assert.equal(
    resolveNotificationHref({ deeplink: "httpp://example.invalid/path?x=1" }),
    "/path?x=1",
  );
  assert.equal(
    resolveNotificationHref({ deeplink: "HTTPS://example.invalid/path" }),
    "/",
  );
  assert.equal(resolveNotificationHref({ deeplink: "http://[" }), "/");
  assert.equal(resolveNotificationHref({}), "/");
  assert.throws(() => resolveNotificationHref({ deeplink: 7 }), TypeError);
  assert.equal(
    navigationIntent({ pathname: "/go/[id]", params: { id: "x", comment: "" } })
      .comment,
    undefined,
  );
});

test("DM marker writes only another normalized messages path and reads clock only on eligible writes", () => {
  const calls = [],
    entries = [];
  const location = {
    get origin() {
      calls.push("origin");
      return "http://local.invalid";
    },
    get pathname() {
      calls.push("pathname");
      return "/elsewhere/";
    },
  };
  const mark = dmNavigationMarker({
    location,
    now: () => {
      calls.push("now");
      return 123;
    },
    recordEntry: (e) => {
      calls.push("entry");
      entries.push(e);
    },
  });
  mark({ href: "/profile/x", entryPoint: 8 });
  assert.deepEqual(calls, ["origin"]);
  calls.length = 0;
  mark({ href: "/messages/peer/", entryPoint: 8 });
  assert.deepEqual(calls, ["origin", "pathname", "now", "entry"]);
  assert.deepEqual(entries, [
    { pathname: "/messages/peer", entryPoint: 8, at: 123 },
  ]);
  mark({ href: "/messagex/peer", entryPoint: 8 });
  assert.equal(entries.length, 1);
  mark({ href: "https://different.invalid/messages/peer", entryPoint: 8 });
  assert.equal(entries.length, 2); // Original has no origin check.
});

test("marker keeps one-slash normalization and URL resolution distinct from raw router input", () => {
  const entries = [],
    location = { origin: "http://local.invalid", pathname: "/messages/peer/" };
  const mark = dmNavigationMarker({
    location,
    recordEntry: (e) => entries.push(e),
    now: () => 1,
  });
  mark({ href: "/messages/peer", entryPoint: 8 });
  assert.equal(entries.length, 0);
  location.pathname = "/messages";
  mark({ href: "/messages//", entryPoint: 8 });
  assert.equal(entries[0].pathname, "/messages/");
  mark({ href: "/coin/../messages", entryPoint: 8 });
  assert.equal(entries.length, 1); // Resolved target is current /messages.
  const broken = dmNavigationMarker({
    location: {
      get origin() {
        throw Error("synthetic origin unavailable");
      },
    },
    recordEntry: () => assert.fail("unexpected mark"),
  });
  assert.equal(broken({ href: "/messages" }), undefined);
});

test("activation order is click→resolve→marker→router; original callback returns undefined", () => {
  const events = [],
    item = { deeplink: "/messages/peer" };
  const result = activateNotification({
    item,
    surface: "topbar",
    trackClick: (e) => events.push(["click", e]),
    markNavigation: (e) => events.push(["mark", e]),
    router: {
      push: (href) => {
        events.push(["push", href]);
        return "ignored";
      },
    },
  });
  assert.equal(result, undefined);
  assert.deepEqual(events, [
    ["click", { item, surface: "topbar" }],
    ["mark", { href: "/messages/peer", entryPoint: 8 }],
    ["push", "/messages/peer"],
  ]);
});

test("click/resolution/marker/router failures stop later effects without manufactured fallback", () => {
  for (const fail of ["click", "resolve", "mark", "push"]) {
    const events = [],
      item = { deeplink: fail === "resolve" ? 7 : "/messages" };
    const stage = (name) => {
      events.push(name);
      if (name === fail) throw Error(`synthetic ${name}`);
    };
    assert.throws(() =>
      activateNotification({
        item,
        surface: "inbox",
        trackClick: () => stage("click"),
        markNavigation: () => stage("mark"),
        router: { push: () => stage("push") },
      }),
    );
    assert.deepEqual(
      events,
      fail === "click" || fail === "resolve"
        ? ["click"]
        : fail === "mark"
          ? ["click", "mark"]
          : ["click", "mark", "push"],
    );
  }
});

test("loopback inbox read uses unchanged projection/filter before actual activation ports and DM marker", async () => {
  const requests = [],
    effects = [],
    entries = [],
    location = { origin: "http://local.invalid", pathname: "/notifications" };
  const server = createServer((request, response) => {
    requests.push({ method: request.method, url: request.url });
    request.resume();
    response.writeHead(200, { "content-type": "application/json" });
    response.end(
      JSON.stringify({
        notifications: [
          {
            notificationId: "profile",
            deeplink: "pump://coins/fallback",
            genericV1: {
              listNavigation: {
                pathname: "/profile/[id]",
                params: { id: "synthetic-user" },
              },
            },
          },
          {
            notificationId: "relative",
            deeplink: "/messages/synthetic-peer",
            genericV1: { notificationSubtype: "example" },
          },
          {
            notificationId: "filtered",
            deeplink: "pump://dms/hidden",
            genericV1: { notificationSubtype: "dm_message" },
          },
        ],
        count: 3,
        hasMore: false,
      }),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const page = await readInboxPage({
      origin: `http://127.0.0.1:${server.address().port}`,
      fetchImplementation: fetch,
      refreshUser: () => effects.push("refresh"),
    });
    const items = visibleInboxItems({ pages: [page] });
    assert.deepEqual(
      items.map((x) => x.id),
      ["profile", "relative"],
    );
    const markNavigation = dmNavigationMarker({
      location,
      now: () => 42,
      recordEntry: (e) => entries.push(e),
    });
    for (const item of items)
      activateNotification({
        item,
        surface: "topbar",
        trackClick: ({ item }) => effects.push(`click:${item.id}`),
        markNavigation,
        router: {
          push: (href) => {
            effects.push(`push:${href}`);
            location.pathname = href;
          },
        },
      });
    assert.equal(requests.length, 1);
    assert.equal(requests[0].method, "GET");
    assert.ok(requests[0].url.startsWith("/api/hermes/notifications/user"));
    assert.deepEqual(effects, [
      "refresh",
      "click:profile",
      "push:/profile/synthetic-user",
      "click:relative",
      "push:/messages/synthetic-peer",
    ]);
    assert.deepEqual(entries, [
      { pathname: "/messages/synthetic-peer", entryPoint: 8, at: 42 },
    ]);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

async function temporary() {
  const dir = await fs.mkdtemp(
    path.join(os.tmpdir(), "pump-notification-navigation-"),
  );
  const files = new Set([
    "recovered/modules.json",
    "evidence/web/manifest.json",
    outputPath,
    ...contract.sources.map((m) => m.source.source),
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
  for (const r of manifest.records)
    if (r.path === origin.source) r.sha256 = hash(await fs.readFile(source));
  await fs.writeFile(manifestPath, JSON.stringify(manifest));
}
test("resealed priority/marker/click/entry/caller mutations cannot retain stale workflow claims", async () => {
  for (const [id, before, after] of [
    [808142, "e.navigation??", "e.navigation||"],
    [208912, '"/messages/"', '"/messagex/"'],
    [763956, "Y();let e=", "X();let e="],
    [292686, "NOTIFICATION_CENTER:8", "NOTIFICATION_CENTER:9"],
    [402659, 'surface:"topbar"', 'surface:"inbox "'],
  ]) {
    const t = await temporary();
    try {
      await reseal(t.dir, id, (s) => s.replace(before, after));
      await assert.rejects(recover(t.dir), /Notification navigation recovery:/);
    } finally {
      await t.close();
    }
  }
});
test("raw corruption, missing actual helper and invented security/reader claims fail closed", async () => {
  for (const mutation of ["raw", "missing", "contract"]) {
    const t = await temporary();
    try {
      if (mutation === "raw")
        await fs.appendFile(
          path.join(t.dir, contract.sources[0].source.source),
          " ",
        );
      if (mutation === "missing") {
        const p = path.join(t.dir, "recovered/modules.json"),
          v = JSON.parse(await fs.readFile(p));
        v.modules = v.modules.filter((m) => !m.ids.includes(692159));
        await fs.writeFile(p, JSON.stringify(v));
      }
      if (mutation === "contract") {
        const p = path.join(t.dir, outputPath),
          v = JSON.parse(await fs.readFile(p));
        v.marker.persistenceOrReaderImplemented = true;
        v.destinations.responseOrUrlSecurityValidatorAdded = true;
        await fs.writeFile(p, JSON.stringify(v));
      }
      await assert.rejects(verify(t.dir));
    } finally {
      await t.close();
    }
  }
});
