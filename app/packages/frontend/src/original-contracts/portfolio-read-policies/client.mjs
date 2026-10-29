// Maintained read-only boundaries from 261756 and 947305. Dependencies are
// explicitly supplied; captured code, React and the HTTP runtime are not loaded.
export const dustFloorKey = (address) => ["userPortfolioDustFloor", address];
export const spamMintsKey = (address) => ["userPortfolioSpamMints", address];
const normalizeMint = (mint) =>
  mint.startsWith("0x") ? mint.toLowerCase() : mint;
export const hasSpamMint = (items, mint) =>
  items?.includes(normalizeMint(mint)) ?? false;
export function addSpamMint(items, mint) {
  const key = normalizeMint(mint);
  return items?.includes(key) ? items : [...(items ?? []), key];
}
export function removeSpamMint(items, mint) {
  const key = normalizeMint(mint);
  return items?.includes(key) ? items.filter((value) => value !== key) : items;
}
const selectSpamMints = (items) => new Set(items);

export function createPortfolioReadPolicies({ createClient, memo, useQuery }) {
  const readDustFloor = async ({ signal }) => {
    const result = await createClient()("GET /user-portfolio/dust-floor", {
      credentials: "include",
      signal,
      throwHttpErrors: false,
      hooks: {
        afterResponse: [
          (_request, _options, response) => {
            if (!response.ok)
              throw new Error(`Failed to fetch dust floor: ${response.status}`);
          },
        ],
      },
    });
    const value = result.dustFloorUsd;
    // The captured getter does not check finite or impose its dialog's 1e9 cap.
    return typeof value === "number" && value > 0 ? value : null;
  };
  return {
    readDustFloor,
    useDustFloor({ address, enabled }) {
      const cache = memo(5);
      let key, options;
      if (cache[0] !== address) {
        key = dustFloorKey(address);
        cache[0] = address;
        cache[1] = key;
      } else key = cache[1];
      const admitted = !!address && enabled;
      if (cache[2] !== key || cache[3] !== admitted) {
        options = {
          queryKey: key,
          enabled: admitted,
          staleTime: 60000,
          queryFn: readDustFloor,
        };
        cache[2] = key;
        cache[3] = admitted;
        cache[4] = options;
      } else options = cache[4];
      return useQuery(options);
    },
    useSpamMints({ address, enabled }) {
      const cache = memo(8);
      let key, queryFn, options;
      if (cache[0] !== address) {
        key = spamMintsKey(address);
        cache[0] = address;
        cache[1] = key;
      } else key = cache[1];
      const admitted = !!address && enabled;
      if (cache[2] !== address) {
        queryFn = async ({ signal }) =>
          [
            ...new Set(
              (
                await createClient()("GET /user-portfolio/{userId}", {
                  params: { userId: address ?? "" },
                  query: {
                    filter: "open",
                    spamOnly: true,
                    sortBy: "POSITION_SIZE",
                    page: 0,
                    pageSize: 200,
                  },
                  credentials: "include",
                  signal,
                  throwHttpErrors: false,
                  hooks: {
                    afterResponse: [
                      (_request, _options, response) => {
                        if (!response.ok)
                          throw new Error(
                            `Failed to fetch spam positions: ${response.status}`,
                          );
                      },
                    ],
                  },
                })
              ).positions.map((row) => normalizeMint(row.coinMint)),
            ),
          ].sort();
        cache[2] = address;
        cache[3] = queryFn;
      } else queryFn = cache[3];
      if (cache[4] !== key || cache[5] !== admitted || cache[6] !== queryFn) {
        options = {
          queryKey: key,
          enabled: admitted,
          staleTime: 30000,
          queryFn,
          select: selectSpamMints,
        };
        cache[4] = key;
        cache[5] = admitted;
        cache[6] = queryFn;
        cache[7] = options;
      } else options = cache[7];
      return useQuery(options);
    },
  };
}
