// Independent reconstruction of captured 528600 and 448341. The caller supplies
// the K-shaped HTTP constructor and query cache; this module creates no session.
const UUID_ADDRESS =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const userKey = (identifier) => ["user", identifier];

export function userAliases(user, requestedIdentifier) {
  return !!user.address && UUID_ADDRESS.test(user.address)
    ? []
    : [user.userId, user.address, user.username].filter(
        (value) => !!value && value !== requestedIdentifier,
      );
}

export class UserFetchError extends Error {
  reason;
  status;
  constructor({ reason, status } = {}) {
    super("Failed to fetch user");
    this.name = "UserFetchError";
    this.status = status;
    this.reason =
      reason ??
      (status === 404
        ? "not_found"
        : status !== undefined
          ? "http_error"
          : "unknown");
  }
}

export const isUserMissing = (error) =>
  error instanceof UserFetchError && error.reason === "not_found";
export const isUserClientError = (error) =>
  error instanceof UserFetchError &&
  error.status !== undefined &&
  error.status >= 400 &&
  error.status < 500;
export const retryUserQuery = (failureCount, error) =>
  !isUserClientError(error) && failureCount < 3;

export async function requireUserResponse(_request, _options, response) {
  if (!response.ok)
    throw new UserFetchError({
      reason: response.status === 404 ? "not_found" : "http_error",
      status: response.status,
    });
  if ((await response.clone().text()).trim() === "")
    throw new UserFetchError({ reason: "empty_body" });
}

export async function fetchUser(createClient, input) {
  const { clientServerUrl, fetchOptions, userIdentifier } = input;
  try {
    return await createClient({ clientServerUrl })("GET /users/{id}", {
      ...fetchOptions,
      params: { id: userIdentifier },
      credentials: fetchOptions?.credentials ?? "same-origin",
      retry: 0,
      hooks: { afterResponse: [requireUserResponse] },
    });
  } catch (error) {
    if (error instanceof SyntaxError)
      throw new UserFetchError({ reason: "invalid_json" });
    throw error;
  }
}

export async function userExistence(createClient, input) {
  try {
    await fetchUser(createClient, input);
    return "exists";
  } catch (error) {
    return isUserMissing(error) ? "missing" : "unknown";
  }
}

export function userQueryOptions(createClient, queryClient, input) {
  const { clientServerUrl, enabled, queryOptions, userIdentifier } = input;
  return {
    enabled: (enabled ?? true) && !!userIdentifier,
    queryFn: async () => {
      const user = await fetchUser(createClient, {
        clientServerUrl,
        userIdentifier,
      });
      for (const alias of userAliases(user, userIdentifier))
        queryClient.setQueryData(userKey(alias), (current) => current ?? user);
      return user;
    },
    queryKey: userKey(userIdentifier),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: retryUserQuery,
    ...queryOptions,
  };
}
