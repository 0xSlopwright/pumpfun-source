// Independent names for captured633113 and its actual18107/635666 consumer.
// No production destination, viewer resolver, flag provider or server policy.
import { isContractError } from '../contract-http-errors/decode.mjs';

export const BOUNTY_MIN_FOLLOWERS = 10;

export function followCountKey(type, userId) {
  return ['follow-count', type, userId];
}

export function requestFollowCount(transport, type, userId, signal) {
  return transport(type === 'following' ? 'GET /following/v3/following/count/{userId}' :
    'GET /following/v3/followers/count/{userId}', { params: { userId }, signal });
}

export function readFiniteFollowCount(payload) {
  return typeof payload.count === 'number' && Number.isFinite(payload.count) ? payload.count : null;
}

export function followCountQueryOptions(transport, userId, type, enabled) {
  return { queryKey: followCountKey(type, userId ?? ''),
    enabled: !!userId && (enabled === undefined || enabled),
    queryFn: async ({ signal }) => readFiniteFollowCount(await requestFollowCount(transport, type, userId ?? '', signal)),
    staleTime: 60000, refetchOnWindowFocus: false };
}

export function updateFollowCount(cached, delta) {
  return typeof cached === 'number' ? Math.max(0, cached + delta) : cached;
}

export function applyFollowCountDelta({ queryClient, type, userId, delta }) {
  queryClient.setQueryData(followCountKey(type, userId), (cached) => updateFollowCount(cached, delta));
}

export function classifyBountyFollowers({ count, threshold = BOUNTY_MIN_FOLLOWERS }) {
  return typeof count !== 'number' || !Number.isFinite(count) || count < 0 ? 'unknown' :
    count >= threshold ? 'eligible' : 'ineligible';
}

export function isBountyFollowerBlocked(eligibility) {
  return eligibility === 'ineligible';
}

// This consumed callback has no signal argument. Unlike633113's query, the
// actual bounty wrapper does not forward a query-runtime AbortSignal.
export async function readBountyFollowerCount(transport, userId) {
  try {
    return readFiniteFollowCount(await requestFollowCount(transport, 'followers', userId));
  } catch (error) {
    if (isContractError(error)) return null;
    throw error;
  }
}

export function bountyFollowerCountQueryOptions(transport, userId) {
  return { enabled: !!userId, queryKey: ['follow', 'followersCount', userId ?? null],
    queryFn: () => readBountyFollowerCount(transport, userId), staleTime: 60000 };
}

export function bountyFollowerGateQueryOptions(transport, flagEnabled, viewerKey) {
  return bountyFollowerCountQueryOptions(transport, flagEnabled && !!viewerKey ? viewerKey : null);
}

// queryResult must belong to the query key above. No auth/runtime cache is
// created here, and the UI result is not a backend authorization decision.
export function projectBountyFollowerGate(flagEnabled, viewerKey, queryResult) {
  const active = flagEnabled && !!viewerKey;
  const count = active ? queryResult.data ?? null : null;
  const eligibility = flagEnabled ? classifyBountyFollowers({ count }) : 'unknown';
  return { enabled: flagEnabled, eligibility, isBlocked: flagEnabled && isBountyFollowerBlocked(eligibility),
    followersCount: count, minFollowers: BOUNTY_MIN_FOLLOWERS, isLoading: active && queryResult.isLoading };
}

export function bountyFollowerRequirementMessage({ minFollowers, currentFollowers }) {
  const minimum = typeof minFollowers === 'number' && minFollowers > 0 ? minFollowers : BOUNTY_MIN_FOLLOWERS;
  const message = `Bounties need at least ${minimum} followers on your pump.fun profile.`;
  return typeof currentFollowers !== 'number' ? message :
    `${message} You have ${currentFollowers} ${currentFollowers === 1 ? 'follower' : 'followers'} right now.`;
}

export function bountyFollowerShortMessage(minFollowers) {
  const minimum = typeof minFollowers === 'number' && minFollowers > 0 ? minFollowers : BOUNTY_MIN_FOLLOWERS;
  return `You need at least ${minimum} ${minimum === 1 ? 'follower' : 'followers'} to do this`;
}
