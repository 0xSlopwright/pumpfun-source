import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProfileHeader } from "../src/components/profile/ProfileHeader";
import { FeedItem } from "../src/components/feed/FeedItem";
import type { LocalProfile } from "../src/components/profile/profile-data";
import type { LocalFeedPost } from "../src/components/feed/feed-data";

const profile: LocalProfile = {
  address: "",
  userId: "synthetic-walletless",
  displayName: "Synthetic group",
  username: "Synthetic group",
  bio: null,
  kind: "group",
  memberCount: 2,
  followers: 0,
  following: 0,
  banned: false,
  isPumpUser: false,
  xUsername: null,
  hasRecordedAvatar: false,
  posts: [],
  dataSource: "synthetic-seed-play",
};

test("walletless header discloses absent wallet and renders no empty clipboard control", () => {
  const html = renderToStaticMarkup(createElement(ProfileHeader, { profile }));
  assert.match(html, /Synthetic group/);
  assert.match(html, /No wallet address recorded/);
  assert.doesNotMatch(html, /Copy wallet address|Copy address|<code><\/code>/);
  assert.match(html, /Synthetic identity/);
  assert.match(
    html,
    /disabled=""[^>]*title="Authentication and follow writes are unavailable offline"/,
  );
  const walletHtml = renderToStaticMarkup(
    createElement(ProfileHeader, {
      profile: { ...profile, address: "synthetic-wallet-address" },
    }),
  );
  assert.match(walletHtml, /Copy wallet address/);
  assert.match(walletHtml, /synthetic-wallet-address/);
  assert.doesNotMatch(walletHtml, /No wallet address recorded/);
});

test("walletless post markup is distinct from an unresolved author", () => {
  const item: LocalFeedPost = {
    id: "synthetic-post",
    author: { address: "", name: "Synthetic group", missing: false },
    content: "Synthetic text",
    timestamp: "2024-01-01T00:00:00.000Z",
    timestampLabel: "Jan 1, 2024",
    likes: 0,
    replies: 0,
    reposts: 0,
    quotes: 0,
    hasMedia: false,
    dataSource: "synthetic-seed-play",
  };
  const html = renderToStaticMarkup(createElement(FeedItem, { item }));
  assert.match(html, /No wallet address recorded/);
  assert.doesNotMatch(html, /Unresolved seed identity/);
  assert.match(html, /Synthetic example/);
  const unresolved = renderToStaticMarkup(
    createElement(FeedItem, {
      item: { ...item, author: { ...item.author, missing: true } },
    }),
  );
  assert.match(unresolved, /Unresolved seed identity/);
  assert.doesNotMatch(unresolved, /No wallet address recorded/);
});
