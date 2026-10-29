// Selected original client workflow. All transport/cache/wallet/UI ports are explicit.
// No request, listener, storage or browser activity is initiated by importing it.
export function parseMuteList(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    !Array.isArray(value.userIds) ||
    Array.from(value.userIds).some((id) => typeof id !== "string")
  )
    throw new TypeError("Expected a mute-list object with string userIds");
  // Captured z.object strips unknown keys and z.array produces a new array.
  // This finite JSON-shape check does not reproduce Zod's error class/details.
  return { userIds: [...value.userIds] };
}

export function mutesClient({ api }) {
  return {
    async list({ signal } = {}) {
      return parseMuteList(await api("GET /mutes", { signal }));
    },
    async mute({ userId }) {
      await api("POST /mutes/{userId}", { params: { userId } });
    },
    async unmute({ userId }) {
      await api("DELETE /mutes/{userId}", { params: { userId } });
    },
  };
}
export const muteQueryKey = (viewer) => ["mutes", "list", viewer];
export function muteQueryOptions({ client, viewer, enabled }) {
  return {
    queryKey: muteQueryKey(viewer),
    queryFn: ({ signal }) => client.list({ signal }),
    select: (value) => value.userIds,
    enabled: (enabled === undefined || enabled) && viewer !== null,
    staleTime: 60000,
  };
}
export function muteMutationOptions({ client, cache, viewer, reportError }) {
  const key = muteQueryKey(viewer);
  function options(operation) {
    return {
      mutationFn: (variables) => client[operation](variables),
      async onMutate({ userId }) {
        await cache.cancelQueries({ queryKey: key });
        const previous = cache.getQueryData(key);
        cache.setQueryData(key, (value) => {
          if (!value) return value;
          if (operation === "mute")
            return value.userIds.includes(userId)
              ? value
              : { userIds: [userId, ...value.userIds] };
          const userIds = value.userIds.filter((id) => id !== userId);
          return userIds.length === value.userIds.length ? value : { userIds };
        });
        return { previous };
      },
      onError(error, { userId }, context) {
        if (context?.previous) cache.setQueryData(key, context.previous);
        reportError({
          error,
          feature: "mutes",
          operation,
          context: { userId },
        });
      },
      onSettled() {
        cache.invalidateQueries({ queryKey: key });
      },
    };
  }
  return { mute: options("mute"), unmute: options("unmute") };
}

/** Settled callout-menu decisions; the host owns rendering/query subscriptions. */
export function muteMenu({
  author,
  getWalletAddress,
  getMutedIds,
  mute,
  unmute,
  showWallet,
  notify,
}) {
  const target = () => author.userId || null;
  const isMuted = () =>
    target() !== null && (getMutedIds()?.includes(target()) ?? false);
  return {
    getState() {
      const muted = isMuted();
      return {
        visible: target() !== null,
        muted,
        disabled: mute.isPending || unmute.isPending,
        label: muted
          ? { key: "profile.mutes.unmute" }
          : {
              key: "profile.mutes.mute_user",
              values: { user_name: `@${author.name}` },
            },
      };
    },
    queryEnabled(menuOpen) {
      return menuOpen && target() !== null;
    },
    stopPropagation(event) {
      return event.stopPropagation();
    },
    toggle() {
      const userId = target();
      if (userId === null) return;
      if (!getWalletAddress()) {
        showWallet(true);
        return;
      }
      const muted = isMuted();
      (muted ? unmute : mute).mutate(
        { userId },
        {
          onSuccess: () =>
            notify(
              "success",
              muted
                ? "profile.mutes.unmute_success"
                : "profile.mutes.mute_success",
            ),
          onError: () => notify("error", "web.callouts.more.mute_failed"),
        },
      );
    },
  };
}

export const mutedIdSet = (ids) => new Set(ids ?? []);
// Exported captured helper only: no incoming captured consumer was found.
// Supplying it to a new feed is an explicit authored integration, not proven
// original global feed filtering or a server-side visibility guarantee.
export function filterMutedRows({ rows, mutedUserIds, getAuthorId }) {
  if (!rows || !mutedUserIds || mutedUserIds.size === 0) return rows;
  const filtered = rows.filter((row) => {
    const id = getAuthorId(row);
    return !(mutedUserIds && id && mutedUserIds.has(id));
  });
  return filtered.length === rows.length ? rows : filtered;
}
