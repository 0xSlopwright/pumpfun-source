// Maintained reconstruction of 384886/528766; no captured code is evaluated.
export const MAX_POSITION_QUOTE = 1e13; // Used 26077.N, not a pricing rule.
export const isPositionQuoteOutlier = (value) =>
  typeof value === "number" &&
  (!Number.isFinite(value) || Math.abs(value) > MAX_POSITION_QUOTE);

function normalizePosition(row) {
  const coin =
    row.coin && isPositionQuoteOutlier(row.coin.marketCapUsd)
      ? { ...row.coin, marketCapUsd: null }
      : row.coin;
  if (
    isPositionQuoteOutlier(row.valueUsd) ||
    isPositionQuoteOutlier(row.pnlUsd)
  ) {
    return {
      ...row,
      valueUsd: undefined,
      tokenPriceUsd: undefined,
      pnlUsd: null,
      pnlPercentage: null,
      coin: coin ? { ...coin, marketCapUsd: null } : coin,
      servedQuoteRejected: true,
    };
  }
  return coin === row.coin ? row : { ...row, coin };
}
export const normalizePositionRows = (rows) => rows.map(normalizePosition);

export function createMintPositionReader({ createClient }) {
  const readChunk = async (userId, mints) =>
    normalizePositionRows(
      (
        await createClient()("GET /user-positions/{userId}", {
          params: { userId },
          query: { mints: [...mints], updatesLimit: 0 },
          timeout: 8000,
          hooks: {
            afterResponse: [
              (_request, _options, response) => {
                if (response.status === 404)
                  return Response.json({ positions: [] });
                if (!response.ok)
                  throw new Error(
                    `user-positions request failed: ${response.status} ${response.statusText}`,
                  );
              },
            ],
          },
        })
      ).positions ?? [],
    );
  const readMany = async ({ userId, mints }) => {
    const unique = Array.from(new Set(mints.filter(Boolean)));
    if (unique.length === 0) return [];
    const chunks = [];
    for (let offset = 0; offset < unique.length; offset += 200)
      chunks.push(unique.slice(offset, offset + 200));
    return (
      await Promise.all(chunks.map((chunk) => readChunk(userId, chunk)))
    ).flat();
  };
  return {
    readMany,
    async readOne({ userId, mint }) {
      const rows = await readMany({ userId, mints: [mint] });
      const lower = mint.toLowerCase();
      return rows.find((row) => row.coinMint?.toLowerCase() === lower) ?? null;
    },
  };
}

export function mintPositionMap(rows) {
  const result = new Map();
  for (const row of rows)
    if (row.coinMint) result.set(row.coinMint.toLowerCase(), row);
  return result;
}
export const lookupMintPosition = (map, mint) =>
  mint ? map.get(mint.toLowerCase()) : undefined;
export const positionLookupKey = (mint, chain) =>
  ["ton:-239", "starknet:SN_MAIN", "near:mainnet"].includes(chain)
    ? `${chain}:${mint}`
    : mint;
