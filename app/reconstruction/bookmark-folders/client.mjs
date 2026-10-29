// Original selected folder workflow with explicit request/cache/UI ports.
// No default origin, auth provider, storage, server or network side effect.
export class BookmarksHttpError extends Error {
  constructor(status) {
    super(`HTTP error! Status: ${status}`);
    this.name = "BookmarksHttpError";
    this.status = status;
  }
}
const discard = () => {};
const failure = (message) => (_request, _options, response) => {
  if (!response.ok) throw Error(message);
};

/** request is the original contract-client-shaped operation port, not fetch. */
export function bookmarkFolderClient({ request }) {
  return {
    async list() {
      const rows = await request("GET /bookmarks", {
        query: {},
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        throwHttpErrors: false,
        hooks: {
          afterResponse: [
            (_request, _options, response) => {
              if (!response.ok && response.status !== 304)
                throw new BookmarksHttpError(response.status);
            },
          ],
        },
      });
      return rows.map((row) => ({
        ...row,
        bookmark_items_with_created_at:
          row.bookmark_items_with_created_at ?? [],
      }));
    },
    async create(name) {
      return request("POST /bookmarks", {
        body: { name },
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        throwHttpErrors: false,
        hooks: { afterResponse: [failure("Failed to create bookmark")] },
      });
    },
    async rename({ bookmarkId, newName }) {
      await request("PUT /bookmarks/{bookmarkId}", {
        params: { bookmarkId },
        body: { newName },
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        parseJson: discard,
        throwHttpErrors: false,
        hooks: { afterResponse: [failure("Failed to update bookmark name")] },
      });
      return { bookmarkId, newName };
    },
    async remove(bookmarkId) {
      await request("DELETE /bookmarks/{bookmarkId}", {
        params: { bookmarkId },
        credentials: "include",
        parseJson: discard,
        throwHttpErrors: false,
        hooks: { afterResponse: [failure("Failed to delete bookmark")] },
      });
      return { bookmarkId };
    },
  };
}

export const folderQueryKey = (viewer) => ["bookmarks", viewer];
// Original row presentation rule, not an authorization or server constraint.
export const canManageFolder = (row) => row.name !== "default";
export const retryFolderQuery = (count, error) =>
  !(error instanceof BookmarksHttpError && [401, 403].includes(error.status)) &&
  count < 1;

export function folderQueryOptions({
  requested,
  viewer,
  decodedJwt,
  now,
  client,
}) {
  return {
    queryKey: folderQueryKey(viewer),
    queryFn: client.list,
    enabled:
      !!requested &&
      viewer !== null &&
      Number.isFinite(decodedJwt?.exp) &&
      (decodedJwt?.exp ?? 0) * 1000 > now(),
    staleTime: 300000,
    retry: retryFolderQuery,
  };
}

// Framework option callbacks, with the original cache port signatures. The host
// owns scheduling, retry, session changes and pending/render state.
export function folderMutationOptions({
  client,
  cache,
  viewer,
  coinListsFor,
  now,
  notify,
}) {
  const key = folderQueryKey(viewer);
  const invalidate = () => {
    for (const prefix of [
      "bookmarks",
      "bookmarkedCoins",
      "sidebarBookmarkedCoins",
    ])
      cache.invalidateQueries({ queryKey: [prefix, viewer] });
  };
  const rollback = (context) => {
    if (context?.previousBookmarks)
      cache.setQueryData(key, context.previousBookmarks);
    for (const { key, coins } of context?.previousCoinLists ?? [])
      if (coins) cache.setQueryData(key, coins);
  };
  return {
    create: {
      mutationFn: client.create,
      async onMutate(name) {
        await cache.cancelQueries({ queryKey: key });
        const previousBookmarks = cache.getQueryData(key);
        const tempBookmark = {
          id: `temp-${now()}`,
          name,
          created_at: new Date(now()).toISOString(),
          bookmark_items: [],
          bookmark_items_with_created_at: [],
        };
        cache.setQueryData(key, (rows = []) => [...rows, tempBookmark]);
        return { previousBookmarks, tempBookmark };
      },
      onError(_error, _name, context) {
        rollback(context);
        notify("error", "bookmarks.failed_to_create_watchlist", {
          description: "web.watchlist.create_failed_description",
        });
      },
      onSuccess(value) {
        invalidate();
        notify("success", "web.watchlist.watchlist_created", {
          description: value?.name
            ? {
                key: "web.watchlist.created_description",
                values: { name: value.name },
              }
            : "web.watchlist.created_description_generic",
          duration: 5000,
        });
      },
    },
    rename: {
      mutationFn: client.rename,
      async onMutate({ bookmarkId, newName }) {
        await cache.cancelQueries({ queryKey: key });
        const previousBookmarks = cache.getQueryData(key);
        cache.setQueryData(key, (rows = []) =>
          rows.map((row) =>
            row.id === bookmarkId ? { ...row, name: newName } : row,
          ),
        );
        return { previousBookmarks };
      },
      onError(_error, _variables, context) {
        rollback(context);
        notify("error", "web.watchlist.rename_failed", {
          description: "web.watchlist.rename_failed_description",
        });
      },
      onSuccess() {
        invalidate();
        notify("success", "web.watchlist.renamed");
      },
    },
    remove: {
      mutationFn: client.remove,
      async onMutate(bookmarkId) {
        const lists = coinListsFor(bookmarkId);
        await Promise.all(
          [key, ...lists].map((key) =>
            cache.cancelQueries({ queryKey: key, exact: true }),
          ),
        );
        const previousBookmarks = cache.getQueryData(key);
        const previousCoinLists = lists.map((key) => ({
          key,
          coins: cache.getQueryData(key),
        }));
        cache.setQueryData(key, (rows = []) =>
          rows.filter((row) => row.id !== bookmarkId),
        );
        for (const key of lists) cache.setQueryData(key, []);
        return { previousBookmarks, previousCoinLists, bookmarkId };
      },
      onError(_error, _variables, context) {
        rollback(context);
        notify("error", "web.watchlist.delete_failed", {
          description: "web.watchlist.delete_failed_description",
        });
      },
      onSuccess({ bookmarkId }, _variables, context) {
        invalidate();
        const name = context?.previousBookmarks?.find(
          (row) => row.id === bookmarkId,
        )?.name;
        notify("success", "web.watchlist.deleted", {
          description: name
            ? { key: "web.watchlist.deleted_description", values: { name } }
            : "web.watchlist.deleted_description_generic",
          duration: 5000,
        });
      },
    },
  };
}

// The actual exported hook callbacks check only decoded-JWT presence, emit the
// signed-out toast when absent, and swallow mutateAsync errors. They do not
// return its result or authenticate a request. Ports stay explicitly host-owned.
export function folderActions({ mutations, getDecodedJwt, notify }) {
  const action = async (type, variables, title, description) => {
    if (!getDecodedJwt()) return void notify("error", title, { description });
    try {
      await mutations[type].mutateAsync(variables);
    } catch {}
  };
  return {
    createBookmark: (name) =>
      action(
        "create",
        name,
        "bookmarks.failed_to_create_watchlist",
        "web.watchlist.create_failed_signed_out_description",
      ),
    updateBookmarkName: (bookmarkId, newName) =>
      action(
        "rename",
        { bookmarkId, newName },
        "web.watchlist.rename_failed",
        "web.watchlist.rename_failed_signed_out_description",
      ),
    deleteBookmark: (bookmarkId) =>
      action(
        "remove",
        bookmarkId,
        "web.watchlist.delete_failed",
        "web.watchlist.delete_failed_signed_out_description",
      ),
  };
}

/** Settled dialog action state; React interleavings/rendering stay host-owned. */
export function folderDialogWorkflow({
  createBookmark,
  updateBookmarkName,
  deleteBookmark,
  logError,
  onOpenChange,
}) {
  let state = {
    createName: "",
    editingId: null,
    editingName: "",
    deletingId: null,
    pending: false,
  };
  const listeners = new Set();
  function update(patch) {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  }
  async function action(callback, message, success) {
    if (state.pending) return;
    update({ pending: true });
    try {
      await callback();
      success?.();
    } catch (error) {
      logError(message, error);
    }
    update({ pending: false });
  }
  return {
    getSnapshot: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setCreateName: (createName) => update({ createName }),
    edit: (row) => update({ editingId: row.id, editingName: row.name }),
    setEditingName: (editingName) => update({ editingName }),
    cancelEdit: () => update({ editingId: null, editingName: "" }),
    askDelete: (deletingId) => update({ deletingId }),
    cancelDelete: () => update({ deletingId: null }),
    changeOpen(open) {
      if (!open) update({ editingId: null, editingName: "" });
      onOpenChange(open);
    },
    async create() {
      const name = state.createName.trim();
      if (!name) return;
      return action(
        () => createBookmark(name),
        "Failed to create bookmark:",
        () => update({ createName: "" }),
      );
    },
    async rename(bookmarkId) {
      const name = state.editingName.trim();
      if (!name) return;
      return action(
        () => updateBookmarkName(bookmarkId, name),
        "Failed to update bookmark name:",
        () => update({ editingId: null, editingName: "" }),
      );
    },
    async remove(bookmarkId) {
      return action(
        () => deleteBookmark(bookmarkId),
        "Failed to delete bookmark:",
      );
    },
  };
}
