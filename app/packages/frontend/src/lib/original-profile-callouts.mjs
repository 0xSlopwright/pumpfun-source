// Independent reconstruction of the bounded request/server-page callbacks in
// captured 399346 → 735821.H. No fetch, auth, React or TanStack runtime is used.
// See contracts/ORIGINAL-PROFILE-CALLOUTS.md for exact source and exclusions.
function options(input) {
  const { userId, limit, sortBy, sortOrder, includeMembers, window, enabled } = input;
  return { userId, limit: limit === undefined ? 30 : limit,
    sortBy: sortBy === undefined ? 'TIMESTAMP' : sortBy,
    sortOrder: sortOrder === undefined ? 'DESC' : sortOrder,
    includeMembers: includeMembers !== undefined && includeMembers, window, enabled };
}

export function planProfileCallouts(input) {
  const value = options(input);
  return {
    enabled: (value.enabled === undefined || value.enabled) && !!value.userId,
    queryKey: ['callouts', 'by-user', value.userId ?? null, value.limit,
      value.sortBy, value.sortOrder, value.includeMembers, value.window ?? null],
    initialPageParam: undefined,
    staleTime: 60000,
    gcTime: 300000,
    refetchOnWindowFocus: false,
  };
}

export function profileCalloutsRequest(input, pageToken, signal) {
  const value = options(input);
  // This is the query callback's guard, including when an external caller
  // explicitly invokes a callback whose query was disabled.
  if (!value.userId) throw Error('userId is required');
  return {
    operation: 'GET /callout/list/{userId}',
    params: { userId: value.userId },
    query: { limit: value.limit, sortBy: value.sortBy, sortOrder: value.sortOrder,
      pageToken: pageToken || undefined, includeMembers: value.includeMembers || undefined,
      window: value.window || undefined },
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    signal,
  };
}

export function mapProfileCallout(row) {
  const { thesis, likes, hasLiked, hasReposted, perp, ...rest } = row;
  return { ...rest,
    ...(perp !== undefined ? { perp } : {}),
    ...(thesis !== undefined ? { note: thesis } : {}),
    ...(likes !== undefined ? { likeCount: likes } : {}),
    ...(typeof hasLiked === 'boolean' ? { likedByViewer: hasLiked } : {}),
    ...(typeof hasReposted === 'boolean' ? { repostedByViewer: hasReposted } : {}) };
}

export function mapProfileCalloutsResponse(response) {
  return { callouts: (response.callouts ?? []).map(mapProfileCallout),
    ...(response.nextPageToken !== undefined ? { nextPageToken: response.nextPageToken } : {}) };
}

export function profileCalloutsPage(clientResponse, input) {
  const { limit } = options(input);
  const callouts = clientResponse.callouts ?? [];
  return { callouts,
    next: clientResponse.nextPageToken && callouts.length >= limit ? clientResponse.nextPageToken : undefined };
}

export function nextProfileCalloutsPage(page, _pages, previousPageParam) {
  return page.next && page.next !== previousPageParam ? page.next : undefined;
}

export function flattenProfileCallouts(data) {
  const seen = new Set();
  const rows = [];
  for (const page of data.pages) for (const row of page.callouts) {
    if (!seen.has(row.calloutId)) {
      seen.add(row.calloutId);
      rows.push(row);
    }
  }
  return rows;
}

// Separate reconstruction of the DECLARED window field pipeline in 957263.
// The captured website request builder does not invoke this parser.
export function parseDeclaredProfileWindow(input) {
  if (input === undefined) return { success: true, value: undefined };
  if (typeof input !== 'string') return { success: false };
  const value = input.trim().toUpperCase() || undefined;
  return value === undefined || ['DAILY', 'WEEKLY', 'MONTHLY', 'ALLTIME', 'LAST_ROUND'].includes(value)
    ? { success: true, value } : { success: false };
}
