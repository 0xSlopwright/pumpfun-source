import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { once } from "node:events";
import {
  USER_REPLIES_LIMIT,
  mapReplyCallout,
  mapUserReplyRow,
  replyContextPreview,
  userRepliesResponseHook,
  fetchUserReplies,
  nextUserRepliesPage,
  flattenUserReplyPages,
  userRepliesQueryOptions,
} from "../reconstruction/user-replies/client.mjs";
import { extractUserReplies } from "../scripts/original-user-replies.mjs";
import { openCorpus, sha256 } from "../scripts/original-contracts/source.mjs";
import { validateDeclared } from "../scripts/original-contracts/validate.mjs";
import {
  withContractErrorNormalization,
  ContractError,
} from "../reconstruction/contract-http-errors/decode.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const artifact = await extractUserReplies(root),
  corpus = await openCorpus(root);
function row(id, extra = {}) {
  return {
    reply: {
      id,
      userId: "cc-id",
      walletAddress: " wallet ",
      accountKind: "person",
      userName: " Alice ",
      profileImage: " avatar ",
      content: " content ",
      createdAt: "2026-10-28T01:02:03Z",
      rootMessageId: null,
      ...extra,
    },
    parent: null,
    callout: {
      userName: " Bob ",
      walletAddress: " author-wallet ",
      profileImage: " author-avatar ",
      coinMint: "mint",
      callout: {
        calloutId: "callout",
        thesis: " note ",
        mediaUrl: "media",
        calloutTimestamp: "2026-10-28T00:00:00Z",
      },
    },
  };
}

test("registered287129 read/mapper and546803 query are separate from236315 mutation export", () => {
  assert.equal(artifact.entry.readModule, 287129);
  assert.equal(artifact.entry.queryModule, 546803);
  assert.deepEqual(
    artifact.consumers.map((x) => x.module),
    [349919, 16503],
  );
  for (const key of Object.values(artifact.entry.ranges)) {
    const fragment = artifact.fragments.find(
      (x) => `${x.source}:${x.utf16.join(":")}` === key,
    );
    assert.doesNotMatch(fragment.text, /POST |DELETE |mutationFn|onSuccess/);
  }
  assert.match(artifact.limits.join(" "), /no importing546803/);
});

test("artifact reproduces exact original ranges, maintained implementation and complete declarations", async () => {
  assert.equal(
    await fs.readFile(
      path.join(root, "reconstruction/user-replies/contract.json"),
      "utf8",
    ),
    JSON.stringify(artifact, null, 2) + "\n",
  );
  for (const fragment of artifact.fragments) {
    const c = await corpus.capture(fragment.source);
    assert.equal(sha256(c.bytes.subarray(...fragment.utf8)), fragment.sha256);
    assert.equal(c.text.slice(...fragment.utf16), fragment.text);
  }
  assert.equal(
    sha256(await fs.readFile(path.join(root, artifact.implementation.path))),
    artifact.implementation.sha256,
  );
  assert.equal(Object.keys(artifact.declarations.$defs).length, 13);
});

test("modified read source fails capture authentication", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "user-reply-source-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  for (const name of [
    "evidence/web/manifest.json",
    "recovered/modules.json",
    artifact.entry.factory.source,
  ]) {
    const target = path.join(dir, name);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(root, name), target);
  }
  const target = path.join(dir, artifact.entry.factory.source),
    bytes = await fs.readFile(target);
  bytes[12000] ^= 1;
  await fs.writeFile(target, bytes);
  await assert.rejects(
    extractUserReplies(dir),
    /capture authentication failed/,
  );
});

test("reply mapping preserves source identity precedence, raw content/avatar and nullable defaults", () => {
  const mapped = mapUserReplyRow(row("r"));
  assert.deepEqual(mapped.reply, {
    replyId: "r",
    calloutId: "callout",
    userId: "wallet",
    authorCcUserId: "cc-id",
    authorAccountKind: "person",
    content: " content ",
    createdAt: Date.parse("2026-10-28T01:02:03Z"),
    likeCount: 0,
    likedByViewer: false,
    mediaUrl: null,
    caller: {
      username: "Alice",
      avatarUrl: " avatar ",
      walletAddress: "wallet",
    },
  });
  assert.equal(mapped.parent, null);
  assert.equal(mapped.isNested, false);
  const absent = mapUserReplyRow({
    reply: {
      id: "empty",
      walletAddress: " ",
      createdAt: "invalid",
      rootMessageId: "",
    },
  });
  assert.equal(absent.reply.userId, "");
  assert.equal(Object.hasOwn(absent.reply, "authorCcUserId"), false);
  assert.deepEqual(absent.reply.caller, {});
  assert.equal(absent.reply.createdAt, 0);
  assert.equal(absent.reply.calloutId, "");
  assert.equal(absent.callout, null);
  assert.equal(absent.isNested, true);
  assert.equal(
    mapUserReplyRow(row("cc", { walletAddress: " ", userId: "cc-only" })).reply
      .userId,
    "cc-only",
  );
});

test("normalization uses nullish count/like/media defaults rather than truthiness coercion", () => {
  const raw = row("r", { likeCount: -2, hasLiked: "raw", mediaUrl: "" });
  assert.equal(mapUserReplyRow(raw).reply.likeCount, -2);
  assert.equal(mapUserReplyRow(raw).reply.likedByViewer, "raw");
  assert.equal(mapUserReplyRow(raw).reply.mediaUrl, "");
  assert.equal(mapUserReplyRow(row("r", { rootMessageId: 0 })).isNested, true);
  assert.throws(() => mapUserReplyRow({ reply: null }), TypeError);
});

test("callout and reply timestamps have distinct zero/negative behavior and trimming rules", () => {
  const raw = row("r");
  raw.callout.callout.calloutTimestamp = "1969-12-31T23:59:59Z";
  raw.reply.createdAt = raw.callout.callout.calloutTimestamp;
  assert.equal(mapUserReplyRow(raw).reply.createdAt, -1000);
  assert.equal(mapUserReplyRow(raw).callout.createdAtMs, null);
  assert.deepEqual(mapReplyCallout(raw.callout), {
    calloutId: "callout",
    createdAtMs: null,
    coinMint: "mint",
    author: {
      username: "Bob",
      avatarUrl: "author-avatar",
      walletAddress: "author-wallet",
    },
    note: "note",
    mediaUrl: "media",
  });
  assert.deepEqual(
    mapReplyCallout({
      callout: { calloutTimestamp: "invalid", thesis: " ", mediaUrl: "" },
    }),
    { calloutId: null, createdAtMs: null, coinMint: undefined, author: {} },
  );
});

test("strict tombstones and parent-first context preserve deleted versus missing callouts", () => {
  const raw = row("r");
  raw.parent = { ...raw.reply, id: "parent", tombstone: true };
  let mapped = mapUserReplyRow(raw);
  assert.deepEqual(mapped.parent, { tombstone: true, reply: null });
  assert.deepEqual(replyContextPreview(mapped), { deleted: true });
  raw.parent.tombstone = "true";
  mapped = mapUserReplyRow(raw);
  assert.equal(mapped.parent.tombstone, false);
  assert.equal(mapped.parent.reply.replyId, "parent");
  assert.deepEqual(replyContextPreview(mapped), {
    deleted: false,
    authorName: "Alice",
    authorAddress: "wallet",
    text: " content ",
  });
  raw.parent = null;
  assert.deepEqual(replyContextPreview(mapUserReplyRow(raw)), {
    deleted: false,
    authorName: "Bob",
    authorAddress: "author-wallet",
    text: "note",
  });
  assert.deepEqual(
    replyContextPreview({ parent: { reply: null }, callout: mapped.callout }),
    { deleted: true },
  );
  assert.deepEqual(replyContextPreview({ parent: null, callout: null }), {
    deleted: true,
  });
});

test("direct request defaults and falsy cursor/member omission retain exact signal and credential overrides", async () => {
  assert.equal(USER_REPLIES_LIMIT, 30);
  const seen = [],
    signal = new AbortController().signal;
  const transport = async (...args) => {
    seen.push(args);
    return { replies: [] };
  };
  await fetchUserReplies(transport, {
    userId: "id",
    beforeId: "",
    includeMembers: false,
    signal,
  });
  assert.deepEqual(seen[0], [
    "GET /callout/replies/list/{userId}",
    {
      params: { userId: "id" },
      query: { limit: 30, beforeId: undefined, includeMembers: undefined },
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      signal,
      hooks: { afterResponse: [userRepliesResponseHook] },
    },
  ]);
  await fetchUserReplies(transport, {
    userId: "id",
    limit: 2,
    beforeId: "cursor",
    includeMembers: true,
  });
  assert.deepEqual(seen[1][1].query, {
    limit: 2,
    beforeId: "cursor",
    includeMembers: true,
  });
  assert.equal(Object.hasOwn(seen[1][1].query, "filter"), false);
});

test("page continuation uses raw last reply id and count>=limit; raw order and duplicates remain", async () => {
  const values = [row("duplicate"), row("duplicate")];
  const page = await fetchUserReplies(async () => ({ replies: values }), {
    userId: "id",
    limit: 2,
  });
  assert.deepEqual(
    page.rows.map((x) => x.reply.replyId),
    ["duplicate", "duplicate"],
  );
  assert.equal(page.hasMore, true);
  assert.equal(page.nextBeforeId, "duplicate");
  assert.equal(nextUserRepliesPage(page), "duplicate");
  assert.equal(nextUserRepliesPage({ ...page, hasMore: false }), undefined);
  assert.equal(nextUserRepliesPage({ ...page, nextBeforeId: "" }), undefined);
  const empty = await fetchUserReplies(async () => ({ replies: [] }), {
    userId: "id",
    limit: 0,
  });
  assert.equal(empty.hasMore, true);
  assert.equal(empty.nextBeforeId, null);
  assert.equal(nextUserRepliesPage(empty), undefined);
  const short = await fetchUserReplies(async () => ({ replies: values }), {
    userId: "id",
    limit: 3,
  });
  assert.equal(short.hasMore, false);
  assert.equal(short.nextBeforeId, "duplicate");
  assert.deepEqual(
    flattenUserReplyPages({ pages: [page, short] }).map((x) => x.reply.replyId),
    ["duplicate", "duplicate", "duplicate", "duplicate"],
  );
});

test("only nullish replies fall back to empty; invalid row/array shapes and transport failures propagate", async () => {
  for (const body of [{}, { replies: null }])
    assert.deepEqual(
      await fetchUserReplies(async () => body, { userId: "id" }),
      { rows: [], hasMore: false, nextBeforeId: null },
    );
  for (const body of [null, { replies: {} }, { replies: [null] }])
    await assert.rejects(
      fetchUserReplies(async () => body, { userId: "id" }),
      TypeError,
    );
  const reason = Error("transport failure");
  await assert.rejects(
    fetchUserReplies(
      async () => {
        throw reason;
      },
      { userId: "id" },
    ),
    (e) => e === reason,
  );
});

test("404 hook returns a new native200 JSON response and other non-OK errors are plain", async () => {
  const original = new Response("not JSON", { status: 404 });
  const replacement = userRepliesResponseHook(null, null, original);
  assert.ok(replacement instanceof Response);
  assert.notEqual(replacement, original);
  assert.equal(replacement.status, 200);
  assert.deepEqual(await replacement.json(), { replies: [] });
  assert.equal(original.bodyUsed, false);
  assert.throws(
    () =>
      userRepliesResponseHook(null, null, new Response("bad", { status: 503 })),
    (e) =>
      e instanceof Error &&
      !(e instanceof ContractError) &&
      e.message === "Failed to fetch user replies: 503" &&
      !Object.hasOwn(e, "response"),
  );
  assert.equal(
    userRepliesResponseHook(null, null, new Response("ok")),
    undefined,
  );
});

test("query keys/defaults partition user/limit/member mode without viewer identity; callback guards and forwards cursor/signal", async () => {
  const seen = [],
    input = { userId: "id", limit: 2, includeMembers: true };
  const options = userRepliesQueryOptions(async (...args) => {
    seen.push(args);
    return { replies: [] };
  }, input);
  input.userId = "changed";
  input.includeMembers = false;
  assert.deepEqual(options.queryKey, [
    "callouts",
    "user-replies",
    "id",
    2,
    true,
  ]);
  assert.equal(options.enabled, true);
  assert.equal(options.staleTime, 60000);
  assert.equal(options.gcTime, 300000);
  assert.equal(options.refetchOnWindowFocus, false);
  assert.equal(options.initialPageParam, undefined);
  assert.equal(options.getNextPageParam, nextUserRepliesPage);
  assert.equal(options.select, flattenUserReplyPages);
  const signal = new AbortController().signal;
  await options.queryFn({ pageParam: "next", signal });
  assert.deepEqual(seen[0][1].params, { userId: "id" });
  assert.deepEqual(seen[0][1].query, {
    limit: 2,
    beforeId: "next",
    includeMembers: true,
  });
  assert.equal(seen[0][1].signal, signal);
  const disabled = userRepliesQueryOptions(() => {
    assert.fail("missing user transport");
  }, {});
  assert.equal(disabled.enabled, false);
  assert.deepEqual(disabled.queryKey, [
    "callouts",
    "user-replies",
    null,
    30,
    false,
  ]);
  await assert.rejects(disabled.queryFn({}), /userId is required/);
  assert.equal(
    userRepliesQueryOptions(null, { userId: "id", enabled: null }).enabled,
    null,
  );
  assert.deepEqual(
    userRepliesQueryOptions(null, { userId: "id", includeMembers: null })
      .queryKey,
    ["callouts", "user-replies", "id", 30, null],
  );
});

// Test-only j-shaped transport with native fetch and response replacement hooks.
function loopbackTransport(origin, observations) {
  return async (operation, options) =>
    withContractErrorNormalization(
      operation,
      async () => {
        const url = new URL(
          `${origin}/callout/replies/list/${encodeURIComponent(String(options.params.userId))}`,
        );
        for (const [key, value] of Object.entries(options.query))
          if (value !== undefined) url.searchParams.set(key, String(value));
        observations.push({ url: url.href, ...options });
        const request = new Request(url, {
          headers: options.headers,
          credentials: options.credentials,
          signal: options.signal,
        });
        let response = await fetch(request);
        for (const hook of options.hooks.afterResponse) {
          const replacement = await hook(request, options, response);
          if (replacement !== undefined) response = replacement;
        }
        if (!response.ok)
          throw Object.assign(Error("HTTP error"), { response });
        return response.json();
      },
      {
        contracts: {},
        routeErrorSchema: () => undefined,
        contractErrorBody: { safeParse: () => ({ success: false }) },
      },
    );
}
async function httpServer(t, handler) {
  const server = createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  return `http://127.0.0.1:${server.address().port}`;
}

test("real HTTP: infinite-query callback fetches two cursor pages and normalizes context in original order", async (t) => {
  const requests = [],
    seen = [];
  const origin = await httpServer(t, (req, res) => {
    requests.push(req.url);
    const url = new URL(req.url, "http://local");
    assert.equal(url.searchParams.get("includeMembers"), "true");
    const page = url.searchParams.get("beforeId")
      ? [row("last")]
      : [row("a"), row("b")];
    res.end(JSON.stringify({ replies: page }));
  });
  const q = userRepliesQueryOptions(loopbackTransport(origin, seen), {
    userId: "squad/slash ?",
    limit: 2,
    includeMembers: true,
  });
  const first = await q.queryFn({ pageParam: undefined }),
    cursor = q.getNextPageParam(first);
  assert.equal(cursor, "b");
  const second = await q.queryFn({ pageParam: cursor });
  assert.equal(q.getNextPageParam(second), undefined);
  const rows = q.select({ pages: [first, second] });
  assert.deepEqual(
    rows.map((x) => x.reply.replyId),
    ["a", "b", "last"],
  );
  assert.deepEqual(replyContextPreview(rows[0]), {
    deleted: false,
    authorName: "Bob",
    authorAddress: "author-wallet",
    text: "note",
  });
  assert.match(
    requests[0],
    /^\/callout\/replies\/list\/squad%2Fslash%20%3F\?limit=2&includeMembers=true$/,
  );
  assert.match(requests[1], /beforeId=b/);
  assert.equal(
    seen.every((x) => x.credentials === "include"),
    true,
  );
});

test("real HTTP: malformed404 becomes empty before JSON, while503 keeps the plain source error and200 malformed JSON propagates", async (t) => {
  const origin = await httpServer(t, (req, res) => {
    const id = req.url.split("/").at(-1).split("?")[0];
    res.writeHead(id === "missing" ? 404 : id === "bad" ? 503 : 200);
    res.end("not JSON");
  });
  const transport = loopbackTransport(origin, []);
  assert.deepEqual(await fetchUserReplies(transport, { userId: "missing" }), {
    rows: [],
    nextBeforeId: null,
    hasMore: false,
  });
  await assert.rejects(
    fetchUserReplies(transport, { userId: "bad" }),
    (e) =>
      e.message === "Failed to fetch user replies: 503" &&
      !(e instanceof ContractError),
  );
  await assert.rejects(
    fetchUserReplies(transport, { userId: "invalid" }),
    SyntaxError,
  );
});

test("real HTTP: query forwards exact cancellation instead of manufacturing a page", async (t) => {
  let reached;
  const ready = new Promise((resolve) => {
    reached = resolve;
  });
  const origin = await httpServer(t, () => reached()),
    seen = [],
    controller = new AbortController(),
    reason = Error("cancel local page");
  const q = userRepliesQueryOptions(loopbackTransport(origin, seen), {
    userId: "slow",
  });
  const result = assert.rejects(
    q.queryFn({ signal: controller.signal }),
    (e) => e === reason,
  );
  await ready;
  controller.abort(reason);
  await result;
  assert.equal(seen[0].signal, controller.signal);
});

test("declarations retain min-one limit and optional filter; captured client does not impose them", async () => {
  const doc = artifact.declarations,
    decl = doc["x-user-replies"];
  assert.equal(decl.scope, "content.read");
  assert.equal(validateDeclared(doc, decl.query, { limit: 0 }).success, false);
  assert.equal(
    validateDeclared(doc, decl.query, {
      limit: 1,
      filter: "QUOTES",
      includeMembers: true,
    }).success,
    true,
  );
  assert.equal(
    validateDeclared(doc, decl.query, { filter: "unknown" }).success,
    false,
  );
  const seen = [];
  await fetchUserReplies(
    async (_op, options) => {
      seen.push(options);
      return { replies: [] };
    },
    { userId: "id", limit: 0 },
  );
  assert.equal(seen[0].query.limit, 0);
  assert.equal(Object.hasOwn(seen[0].query, "filter"), false);
});
