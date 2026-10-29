// Source-backed user-search query/data operations. Caller supplies an API client
// and the debounce runtime's current value; no default service or timer exists.
export const isLabelledWallet = (row) => void 0 !== row.wallet_label;
export const userSearchIdentity = (row) => row.userId?.trim() || row.address;
export function isUserRow(row) { return !isLabelledWallet(row); }
export function isPaginationUser(row) { return !isLabelledWallet(row); }

export function selectUserSearchPages(data) {
  let rows = data.pages.flat(), identities = new Set, addresses = new Set, users = [];
  for (let row of rows) {
    if (isLabelledWallet(row)) continue;
    let identity = userSearchIdentity(row);
    if (identity) {
      if (identities.has(identity)) continue;
      identities.add(identity);
    }
    row.address && addresses.add(row.address), users.push(row);
  }
  let wallets = [];
  for (let row of rows) !isLabelledWallet(row) || addresses.has(row.address) || (addresses.add(row.address), wallets.push(row));
  return [...users, ...wallets];
}

export function createUserSearchRequest(getContractClient) {
  return async ({ searchTerm, offset, limit, signal }) => getContractClient()('GET /users/search-v2', {
    query: { offset, limit, includeLabelledWallets: true, searchTerm: searchTerm || void 0 },
    signal, credentials: 'include', headers: { 'Content-Type': 'application/json' },
    throwHttpErrors: false,
    hooks: { afterResponse: [(request, options, response) => {
      if (!response.ok) throw Error(`Failed to search users for the term: ${searchTerm}`);
    }] },
  });
}

export function createUserSearchNextPage(pageSize) {
  return (lastPage, pages) => {
    let users = (lastPage ?? []).filter(isUserRow);
    if (users.length && !(users.length < pageSize)) return pages.flat().filter(isPaginationUser).length;
  };
}

// This callback factory models one captured render, not React/compiler caching
// or a debounce scheduler. A new render gets a new query snapshot.
export function createUserSearchQuery({ searchTerm, enabled, pageSize, debouncedTerm }, getContractClient) {
  const active = void 0 === enabled || enabled;
  const limit = void 0 === pageSize ? 20 : pageSize;
  const trimmedTerm = searchTerm?.trim() ?? '';
  const isSearchTermTooShort = active && debouncedTerm.length < 2;
  const isDebouncing = active && (searchTerm?.trim() ?? '') !== debouncedTerm;
  const request = createUserSearchRequest(getContractClient);
  const queryKey = ['users', 'search-v2', debouncedTerm, limit];
  const queryFn = (context) => {
    let { pageParam, signal } = context;
    return request({ searchTerm: debouncedTerm, offset: pageParam, limit, signal });
  };
  const getNextPageParam = createUserSearchNextPage(limit);
  const queryEnabled = active && !isSearchTermTooShort;
  const queryOptions = { queryKey, queryFn, initialPageParam: 0, getNextPageParam, select: selectUserSearchPages,
    enabled: queryEnabled, staleTime: 30000, refetchOnWindowFocus: false };
  return { queryOptions, trimmedTerm, isSearchTermTooShort, isDebouncing, minSearchTermLength: 2, debounceMs: 500 };
}
