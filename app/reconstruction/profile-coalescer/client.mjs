// One instance represents one captured782067 module context. Host capabilities
// are explicit; this module supplies no production transport or query runtime.
import {
  UserFetchError,
  userAliases,
  userKey,
} from "../profile-lookup/client.mjs";

export const PROFILE_BATCH_ORIGIN = "https://frontend-api-v3.pump.fun";
export const profileBatchKey = (address) => ["user-profile-batch", address];
export const retryProfileBatch = (count, error) =>
  (!(error instanceof UserFetchError) ||
    error.status === undefined ||
    !(error.status >= 400) ||
    !(error.status < 500)) &&
  count < 1;

export function indexProfiles(profiles) {
  const byIdentifier = new Map();
  for (const profile of profiles) {
    if (profile?.address) byIdentifier.set(profile.address, profile);
    if (profile?.userId) byIdentifier.set(profile.userId, profile);
  }
  return byIdentifier;
}

export function parseLaxProfileBatch(text) {
  const value = JSON.parse(text);
  return Array.isArray(value)
    ? value
    : value &&
        typeof value === "object" &&
        "users" in value &&
        Array.isArray(value.users)
      ? value.users
      : [];
}

export function requireProfileBatchOk(_request, _options, response) {
  if (!response.ok)
    throw new UserFetchError({
      reason: response.status === 404 ? "not_found" : "http_error",
      status: response.status,
    });
}

export function createProfileBatchReader({ createClient, schedule }) {
  const resolvers = new Map();
  async function fetchBatch(serverUrl, identifiers) {
    const addresses = [...new Set(identifiers)].filter(Boolean);
    return addresses.length === 0
      ? []
      : createClient({ clientServerUrl: serverUrl })("POST /users/batch", {
          body: { addresses },
          credentials: "same-origin",
          hooks: { afterResponse: [requireProfileBatchOk] },
          parseJson: parseLaxProfileBatch,
        });
  }
  function resolverFor(serverUrl) {
    let resolver = resolvers.get(serverUrl);
    if (!resolver) {
      let queue = new Map(),
        timer = null;
      const flush = () => {
        timer = null;
        const current = queue;
        queue = new Map();
        const identifiers = [...current.keys()];
        for (let offset = 0; offset < identifiers.length; offset += 100) {
          const batch = identifiers.slice(offset, offset + 100);
          fetchBatch(serverUrl, batch)
            .then((profiles) => {
              const byIdentifier = indexProfiles(profiles);
              for (const identifier of batch) {
                const profile = byIdentifier.get(identifier) ?? null;
                for (const waiter of current.get(identifier) ?? [])
                  waiter.resolve(profile);
              }
            })
            .catch((error) => {
              for (const identifier of batch)
                for (const waiter of current.get(identifier) ?? [])
                  waiter.reject(error);
            });
        }
      };
      resolver = {
        fetch: (identifier) =>
          new Promise((resolve, reject) => {
            const waiters = queue.get(identifier) ?? [];
            waiters.push({ resolve, reject });
            queue.set(identifier, waiters);
            if (timer === null) timer = schedule(flush, 50);
          }),
      };
      resolvers.set(serverUrl, resolver);
    }
    return resolver;
  }
  return {
    fetchBatch,
    queryOptions(queryClient, input) {
      const { address, enabled } = input;
      return {
        queryKey: profileBatchKey(address ?? ""),
        queryFn: async () => {
          const profile = await resolverFor(PROFILE_BATCH_ORIGIN).fetch(
            address ?? "",
          );
          if (!profile) return null;
          for (const alias of [
            profile.address,
            ...userAliases(profile, profile.address),
          ])
            if (alias)
              queryClient.setQueryData(
                userKey(alias),
                (current) => current ?? profile,
              );
          return profile;
        },
        initialData: () =>
          address ? queryClient.getQueryData(userKey(address)) : undefined,
        initialDataUpdatedAt: () =>
          address
            ? queryClient.getQueryState(userKey(address))?.dataUpdatedAt
            : undefined,
        enabled: (enabled === undefined || enabled) && !!address,
        staleTime: 300000,
        retry: retryProfileBatch,
      };
    },
  };
}
