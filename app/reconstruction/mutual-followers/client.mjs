// Independent reconstruction of the actual exported 366510.z. The caller supplies
// a website-client-shaped transport and viewer cache key, not proof of auth.
export const MUTUAL_FOLLOWER_LIMIT = 5;

export function mutualFollowersKey({ profileId, limit, viewer }) {
  return ["mutual-followers", profileId, limit, viewer];
}

export function requireMutualFollowersOk(_request, _options, response) {
  if (!response.ok)
    throw Error(`Failed to fetch mutual followers: ${response.status}`);
}

export function mutualFollowersQueryOptions(transport, input, viewerKey) {
  const { profileId, limit, enabled } = input;
  const pageLimit = limit === undefined ? MUTUAL_FOLLOWER_LIMIT : limit;
  return {
    queryKey: mutualFollowersKey({
      profileId: profileId ?? "",
      limit: pageLimit,
      viewer: viewerKey ?? "",
    }),
    enabled: (enabled === undefined || enabled) && !!profileId && !!viewerKey,
    staleTime: 60000,
    retry: 1,
    queryFn: async ({ signal }) =>
      transport("GET /users/{id}/mutual-followers", {
        params: { id: profileId ?? "" },
        query: { limit: pageLimit, offset: 0 },
        credentials: "include",
        signal,
        throwHttpErrors: false,
        hooks: { afterResponse: [requireMutualFollowersOk] },
      }),
  };
}
