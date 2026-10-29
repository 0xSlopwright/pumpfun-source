import "server-only";

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { POSTS_SEED_SHA256, USERS_SEED_SHA256 } from "../feed/feed-data";
import {
  isValidProfileIdentifier,
  parseProfileSeedBytes,
  resolveLocalProfile,
  validateLocalProfiles,
  type LocalProfile,
} from "./profile-data";

import {
  loadLocalFollowGraph,
  type LocalFollowGraphResult,
} from "./profile-follow-graph";

export type LocalProfileLoadResult =
  | { ok: true; profile: LocalProfile; followGraph: LocalFollowGraphResult }
  | {
      ok: false;
      reason: "invalid-identifier" | "not-found" | "invalid-data";
      error: string;
    };

export async function loadLocalProfile(
  identifier: string,
): Promise<LocalProfileLoadResult> {
  if (!isValidProfileIdentifier(identifier)) {
    return {
      ok: false,
      reason: "invalid-identifier",
      error: "The profile identifier is malformed.",
    };
  }
  try {
    const backendSource = resolve(process.cwd(), "../backend/src");
    const [postsBytes, usersBytes] = await Promise.all([
      readFile(resolve(backendSource, "posts-seed.json")),
      readFile(resolve(backendSource, "users-seed.json")),
    ]);
    const dataset = validateLocalProfiles(
      parseProfileSeedBytes("posts", postsBytes, POSTS_SEED_SHA256),
      parseProfileSeedBytes("users", usersBytes, USERS_SEED_SHA256),
    );
    const profile = resolveLocalProfile(dataset, identifier);
    return profile
      ? {
          ok: true,
          profile,
          followGraph: await loadLocalFollowGraph(dataset, profile, () =>
            readFile(resolve(backendSource, "following-seed.json")),
          ),
        }
      : {
          ok: false,
          reason: "not-found",
          error: "No profile matches this exact local identity.",
        };
  } catch (error) {
    return {
      ok: false,
      reason: "invalid-data",
      error:
        error instanceof Error
          ? error.message
          : "Unknown local profile validation failure",
    };
  }
}
