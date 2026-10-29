// Independent read-only reconstruction of287129 and546803. The j-shaped HTTP
// transport/query runtime remain explicit host capabilities; no captured JS runs.
export const USER_REPLIES_LIMIT = 30;
function parsedTime(value) {
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}
function mapReply(reply, calloutId) {
  const wallet = reply.walletAddress?.trim() || undefined;
  return {
    replyId: reply.id,
    calloutId,
    userId: wallet ?? reply.userId ?? "",
    ...(reply.userId ? { authorCcUserId: reply.userId } : {}),
    authorAccountKind: reply.accountKind,
    content: reply.content,
    createdAt: parsedTime(reply.createdAt),
    likeCount: reply.likeCount ?? 0,
    likedByViewer: reply.hasLiked ?? false,
    mediaUrl: reply.mediaUrl ?? null,
    caller: {
      ...(reply.userName?.trim() ? { username: reply.userName.trim() } : {}),
      ...(reply.profileImage ? { avatarUrl: reply.profileImage } : {}),
      ...(wallet ? { walletAddress: wallet } : {}),
    },
  };
}
export function mapReplyCallout(value) {
  const wallet = value.walletAddress?.trim() || undefined;
  const username = value.userName?.trim() || undefined;
  const avatar = value.profileImage?.trim() || undefined;
  const note = value.callout?.thesis?.trim() || undefined;
  const media = value.callout?.mediaUrl || undefined;
  const time = parsedTime(value.callout?.calloutTimestamp ?? null);
  return {
    calloutId: value.callout?.calloutId ?? null,
    createdAtMs: time > 0 ? time : null,
    coinMint: value.coinMint,
    author: {
      ...(username ? { username } : {}),
      ...(avatar ? { avatarUrl: avatar } : {}),
      ...(wallet ? { walletAddress: wallet } : {}),
    },
    ...(note ? { note } : {}),
    ...(media ? { mediaUrl: media } : {}),
  };
}
export function mapUserReplyRow(value) {
  const callout = value.callout ? mapReplyCallout(value.callout) : null;
  const calloutId = callout?.calloutId ?? "";
  const parent = value.parent ?? null;
  return {
    reply: mapReply(value.reply, calloutId),
    parent: parent
      ? {
          tombstone: parent.tombstone === true,
          reply: parent.tombstone === true ? null : mapReply(parent, calloutId),
        }
      : null,
    callout,
    isNested: value.reply.rootMessageId != null,
  };
}
export function replyContextPreview({ parent, callout }) {
  if (parent) {
    if (parent.tombstone || !parent.reply) return { deleted: true };
    const { caller, userId, content } = parent.reply;
    const name = caller?.username?.trim();
    const address = caller?.walletAddress?.trim() || userId;
    return {
      deleted: false,
      ...(name ? { authorName: name } : {}),
      ...(address ? { authorAddress: address } : {}),
      ...(content ? { text: content } : {}),
    };
  }
  return callout
    ? {
        deleted: false,
        ...(callout.author.username
          ? { authorName: callout.author.username }
          : {}),
        ...(callout.author.walletAddress
          ? { authorAddress: callout.author.walletAddress }
          : {}),
        ...(callout.note ? { text: callout.note } : {}),
      }
    : { deleted: true };
}
export function userRepliesResponseHook(_request, _options, response) {
  if (response.status === 404) return Response.json({ replies: [] });
  if (!response.ok)
    throw Error(`Failed to fetch user replies: ${response.status}`);
}
export async function fetchUserReplies(transport, input) {
  const {
    userId,
    limit = USER_REPLIES_LIMIT,
    beforeId,
    includeMembers = false,
    signal,
  } = input;
  const replies =
    (
      await transport("GET /callout/replies/list/{userId}", {
        params: { userId },
        query: {
          limit,
          beforeId: beforeId || undefined,
          includeMembers: includeMembers || undefined,
        },
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        signal,
        hooks: { afterResponse: [userRepliesResponseHook] },
      })
    ).replies ?? [];
  const rows = replies.map(mapUserReplyRow);
  const last = replies.at(-1);
  return {
    rows,
    nextBeforeId: last ? last.reply.id : null,
    hasMore: replies.length >= limit,
  };
}
export function nextUserRepliesPage(page) {
  return page.hasMore && page.nextBeforeId ? page.nextBeforeId : undefined;
}
export function flattenUserReplyPages(value) {
  return value.pages.flatMap((page) => page.rows);
}
export function userRepliesQueryOptions(transport, input) {
  const { userId, limit = USER_REPLIES_LIMIT, includeMembers, enabled } = input;
  const members = includeMembers !== undefined && includeMembers;
  return {
    enabled: (enabled === undefined || enabled) && !!userId,
    queryKey: ["callouts", "user-replies", userId ?? null, limit, members],
    queryFn: async ({ pageParam, signal }) => {
      if (!userId) throw Error("userId is required");
      return fetchUserReplies(transport, {
        userId,
        limit,
        beforeId: pageParam,
        includeMembers: members,
        signal,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: nextUserRepliesPage,
    staleTime: 60000,
    gcTime: 300000,
    refetchOnWindowFocus: false,
    select: flattenUserReplyPages,
  };
}
