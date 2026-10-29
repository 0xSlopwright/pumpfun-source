import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  FeedDataError,
  LOCAL_FEED_DATA_SOURCE,
  POSTS_SEED_SHA256,
  USERS_SEED_SHA256,
  validateLocalFeed,
} from "../packages/frontend/src/components/feed/feed-data.ts";

const postsSeed = new URL(
  "../packages/backend/src/posts-seed.json",
  import.meta.url,
);
const usersSeed = new URL(
  "../packages/backend/src/users-seed.json",
  import.meta.url,
);

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

async function checkedInSeeds() {
  const [postsBytes, usersBytes] = await Promise.all([
    readFile(postsSeed),
    readFile(usersSeed),
  ]);
  return {
    postsBytes,
    usersBytes,
    posts: JSON.parse(postsBytes.toString("utf8")),
    users: JSON.parse(usersBytes.toString("utf8")),
  };
}

function user(overrides: Record<string, unknown> = {}) {
  return {
    address: "11111111111111111111111111111111",
    userId: "user-one",
    username: "Example author",
    ...overrides,
  };
}

function post(overrides: Record<string, unknown> = {}) {
  return {
    postId: "post-one",
    authorId: "user-one",
    kind: "root",
    content: "Local example content",
    mediaUrl: null,
    createdAt: "2024-01-01T00:00:00.000Z",
    parentPostId: null,
    rootPostId: null,
    quotedPostId: null,
    repostedPostId: null,
    likeCount: 0,
    replyCount: 0,
    repostCount: 0,
    quoteCount: 0,
    mentions: [],
    deleted: false,
    hidden: false,
    ...overrides,
  };
}

test("walletless feed authors preserve stable user ids without a fabricated address", () => {
  const users = [
    user({ address: "", userId: "group-one", username: "Group one" }),
    user({ address: "", userId: "group-two", username: null }),
  ];
  const result = validateLocalFeed(
    [
      post({ postId: "one", authorId: "group-one" }),
      post({ postId: "two", authorId: "group-two" }),
    ],
    users,
  );
  assert.deepEqual(
    result.posts.map((entry) => entry.author),
    [
      { address: "", userId: "group-one", name: "Group one", missing: false },
      {
        address: "",
        userId: "group-two",
        name: "Unnamed local account",
        missing: false,
      },
    ],
  );
  for (const userId of [undefined, "", " "]) {
    assert.throws(
      () => validateLocalFeed([], [user({ address: "", userId })]),
      FeedDataError,
    );
  }
  assert.throws(
    () => validateLocalFeed([], [users[0], users[0]]),
    /repeats an identity/,
  );
  assert.throws(
    () =>
      validateLocalFeed(
        [],
        [users[0], user({ address: "group-one", userId: "another" })],
      ),
    /repeats an identity/,
  );
});

test("authenticates and adapts the exact checked-in synthetic seeds", async () => {
  const { postsBytes, usersBytes, posts, users } = await checkedInSeeds();
  assert.equal(sha256(postsBytes), POSTS_SEED_SHA256);
  assert.equal(sha256(usersBytes), USERS_SEED_SHA256);

  const result = validateLocalFeed(posts, users);
  assert.equal(result.dataSource, LOCAL_FEED_DATA_SOURCE);
  assert.deepEqual(
    result.posts.map((item) => item.author.name),
    ["chad_group", "bob_degen", "alice_pump"],
  );
  assert.deepEqual(result.excluded, {
    replies: 5,
    deleted: 2,
    hidden: 1,
    nonRoot: 4,
  });
  assert.equal(result.posts[2]?.content, "First post on synthetic pump!");
  assert.equal(result.posts[2]?.hasMedia, true);
  assert.equal(result.posts[2]?.likes, 5);
  assert.equal(result.posts[2]?.dataSource, LOCAL_FEED_DATA_SOURCE);
  assert.doesNotMatch(JSON.stringify(result), /pump\.mypinata\.cloud/);
});

test("filters replies, deleted and hidden records without promoting them", () => {
  const input = [
    post(),
    post({
      postId: "reply",
      kind: "reply",
      parentPostId: "post-one",
      rootPostId: "post-one",
    }),
    post({ postId: "deleted", deleted: true }),
    post({ postId: "hidden", hidden: true }),
    post({ postId: "quote", kind: "quote", quotedPostId: "post-one" }),
  ];
  const result = validateLocalFeed(input, [user()]);
  assert.deepEqual(
    result.posts.map(({ id }) => id),
    ["post-one"],
  );
  assert.deepEqual(result.excluded, {
    replies: 1,
    deleted: 1,
    hidden: 1,
    nonRoot: 1,
  });
});

test("preserves missing-author records with an explicit unresolved identity", () => {
  const result = validateLocalFeed(
    [post({ authorId: "missing-user" })],
    [user()],
  );
  assert.deepEqual(result.posts[0]?.author, {
    address: "missing-user",
    name: "Unknown local author",
    missing: true,
  });
});

test("orders equal timestamps by stable post identity without mutating input", () => {
  const input = [
    post({ postId: "post-z", createdAt: "2024-02-01T00:00:00.000Z" }),
    post({ postId: "post-b", createdAt: "2024-03-01T00:00:00.000Z" }),
    post({ postId: "post-a", createdAt: "2024-03-01T00:00:00.000Z" }),
  ];
  const original = structuredClone(input);
  const result = validateLocalFeed(input, [user()]);
  assert.deepEqual(
    result.posts.map(({ id }) => id),
    ["post-a", "post-b", "post-z"],
  );
  assert.deepEqual(input, original);
});

test("preserves long content and represents media without retaining its URL", () => {
  const content = `Long text ${"word ".repeat(2_000)}`;
  const result = validateLocalFeed(
    [
      post({
        content,
        mediaUrl: "https://example.invalid/not-requested.png",
      }),
    ],
    [user()],
  );
  assert.equal(result.posts[0]?.content, content);
  assert.equal(result.posts[0]?.hasMedia, true);
  assert.doesNotMatch(
    JSON.stringify(result),
    /example\.invalid\/not-requested/,
  );
});

test("supports an honest empty result when every root is unavailable", () => {
  const result = validateLocalFeed(
    [
      post({ postId: "deleted", deleted: true }),
      post({ postId: "hidden", hidden: true }),
    ],
    [user()],
  );
  assert.deepEqual(result.posts, []);
});

test("preserves contract-permitted null and empty post content", () => {
  const result = validateLocalFeed(
    [post({ postId: "null-content", content: null }), post({ content: "" })],
    [user()],
  );
  assert.deepEqual(
    result.posts.map(({ content }) => content),
    [null, ""],
  );
});

test("fails closed on malformed identity, timestamps, counters and media", () => {
  const malformed = [
    [null],
    [post({ postId: "" })],
    [post({ createdAt: "not-a-date" })],
    [post({ likeCount: -1 })],
    [post({ replyCount: 1.5 })],
    [post({ repostCount: undefined })],
    [post({ mediaUrl: "javascript:alert(1)" })],
    [post(), post()],
  ];
  for (const input of malformed) {
    assert.throws(() => validateLocalFeed(input, [user()]), FeedDataError);
  }
  assert.throws(
    () => validateLocalFeed({}, [user()]),
    /posts must be an array/,
  );
  assert.throws(
    () => validateLocalFeed([post()], {}),
    /users must be an array/,
  );
});

test("rejects malformed and duplicate user identities", () => {
  assert.throws(
    () => validateLocalFeed([post()], [user(), user()]),
    /repeats an address/,
  );
  assert.throws(
    () => validateLocalFeed([post()], [user({ username: 42 })]),
    /username/,
  );
});
