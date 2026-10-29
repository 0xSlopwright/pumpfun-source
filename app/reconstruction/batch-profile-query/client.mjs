// Independent576766 query/result/effect boundaries. The actual strict reader
// and error/key identities are unchanged dependencies from901 and870.
import { fetchUsersBatch } from "../user-batch/client.mjs";
import { isUserClientError, userKey } from "../profile-lookup/client.mjs";

function addressesFor(input) {
  return [...input.userAddresses].sort((a, b) => a.localeCompare(b));
}
function fallbackIdentifiers(input) {
  const joined = addressesFor(input).join(",");
  return joined === "" ? [] : joined.split(",");
}
export const batchProfileKey = (addresses) => ["users", addresses.join(",")];
export const retryBatchProfile = (count, error) =>
  !isUserClientError(error) && count < 1;

export function createBatchProfileQuery({ transport, now, report }) {
  let lastReport = 0,
    suppressed = 0;
  function shouldRefetch(query) {
    return (
      query.state.status === "error" &&
      now() - query.state.errorUpdatedAt >= 30000
    );
  }
  function refetchOnMount(query) {
    return shouldRefetch(query);
  }
  function refetchOnWindowFocus(query) {
    return shouldRefetch(query);
  }
  return {
    queryOptions(input) {
      const addresses = addressesFor(input);
      return {
        enabled: !!input.userAddresses.length,
        queryFn: () => fetchUsersBatch(transport, { userAddresses: addresses }),
        queryKey: batchProfileKey(addresses),
        retryOnMount: false,
        refetchOnMount,
        refetchOnWindowFocus,
        retry: retryBatchProfile,
        ...input.queryOptions,
      };
    },
    projectResult(input, queryClient, result) {
      if (!result.error) return result;
      const fallback = fallbackIdentifiers(input)
        .map((identifier) => queryClient.getQueryData(userKey(identifier)))
        .filter((profile) => profile !== undefined);
      return { ...result, data: result.data ?? fallback };
    },
    // Host invokes this port at the captured error-effect dependency boundary.
    // No network telemetry or React effect scheduling is supplied here.
    observeError(input, result) {
      if (!result.error) return;
      const time = now();
      if (time - lastReport < 30000) {
        suppressed += 1;
        return;
      }
      const previousSuppressed = suppressed;
      lastReport = time;
      suppressed = 0;
      report({
        error: result.error,
        feature: "profile",
        operation: "users-batch",
        context: {
          addressCount: fallbackIdentifiers(input).length,
          ...(previousSuppressed > 0
            ? { suppressedReports: previousSuppressed }
            : {}),
        },
      });
    },
  };
}
