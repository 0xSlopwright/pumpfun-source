// Maintained pure adapter. No captured code is imported or evaluated.
import contract from "./contract.json" with { type: "json" };

export function viewerScope(viewer) {
  const id = viewer?.userId?.trim();
  return id ? id : viewer?.address?.trim() || null;
}
export function inboxQueryKey(viewer, filters = {}) {
  return [
    ...contract.query.cachePrefix,
    viewerScope(viewer),
    ...contract.query.filterOrder.map((field) => filters[field]),
  ];
}
export function inboxEnabled({
  featureEnabled,
  clientAvailable,
  viewer,
  enabled,
}) {
  return !!(
    featureEnabled &&
    clientAvailable &&
    viewerScope(viewer) !== null &&
    (enabled === undefined || enabled)
  );
}
// Destination is required; there is no implicit production origin or transport.
export function inboxRequest({ origin, pageParam, filters = {}, signal }) {
  const destination = new URL(origin);
  if (
    !["http:", "https:"].includes(destination.protocol) ||
    destination.username ||
    destination.password
  )
    throw Error("Explicit HTTP(S) origin required");
  const values = { ...filters, lastEvaluatedKey: pageParam };
  const query = new URLSearchParams();
  for (const { name } of contract.operation.query)
    if (values[name]) query.set(name, values[name]);
  return {
    url: new URL(
      contract.operation.browserPath + "?" + query.toString(),
      destination.origin,
    ).href,
    init: {
      method: "GET",
      credentials: "same-origin",
      headers: { accept: contract.transport.acceptHeader },
      signal,
    },
    timeoutMs: contract.transport.timeoutMs,
  };
}
export function normalizeNotification(value) {
  return {
    id: value.notificationId || value.messageId,
    title: value.title,
    body: value.body,
    deeplink: value.deeplink,
    imageUrl: value.imageURL || undefined,
    timestamp: value.timestamp || value.createdAt,
    type: value.type,
    navigation: value.genericV1?.listNavigation,
    genericV1: value.genericV1,
    mintAddress:
      value.mintAddress || value.genericV1?.coinMetadata?.mintAddress,
  };
}
export function normalizeInboxPage(value) {
  return {
    notifications: value.notifications.map(normalizeNotification),
    lastEvaluatedKey: value.lastEvaluatedKey,
    hasMore: value.hasMore,
    count: value.count,
  };
}
export async function readInboxPage({
  fetchImplementation,
  refreshUser,
  ...request
}) {
  if (
    typeof fetchImplementation !== "function" ||
    typeof refreshUser !== "function"
  )
    throw Error("Explicit transport and user-refresh callback required");
  const plan = inboxRequest(request);
  const response = await fetchImplementation(plan.url, plan.init);
  // This local error boundary intentionally does not emulate Ky HTTPError/retries.
  if (!response.ok)
    throw Object.assign(Error(`Inbox HTTP ${response.status}`), {
      status: response.status,
    });
  const text = response.status === 204 ? "" : await response.text();
  const wire = text === "" ? "" : JSON.parse(text);
  if (!request.pageParam) refreshUser(); // Original does not await this callback.
  return normalizeInboxPage(wire);
}
export function nextInboxPage(page) {
  return page.hasMore ? page.lastEvaluatedKey : undefined;
}
export function isDirectMessage(item) {
  const subtype = item.genericV1?.notificationSubtype;
  return (
    !!(
      (subtype !== undefined &&
        contract.presentation.directMessageSubtypes.includes(subtype)) ||
      item.navigation?.pathname.startsWith("/dms")
    ) || item.deeplink.startsWith("pump://dms")
  );
}
export function visibleInboxItems(queryData) {
  return (queryData?.pages.flatMap((page) => page.notifications) ?? []).filter(
    (item) => !isDirectMessage(item),
  );
}
export function isUnread(item, watermark) {
  if (watermark === null) return true;
  const time = Date.parse(item.timestamp),
    at = Date.parse(watermark);
  return !(Number.isNaN(time) || Number.isNaN(at)) && time > at;
}
export function unreadCount(items, watermark) {
  return items.reduce((count, item) => count + +!!isUnread(item, watermark), 0);
}
// Storage and the already-adjusted clock are injected. This adapter does not
// synchronize /api/server-time or register browser/React event listeners.
export function openedAtStore({ storage, adjustedNow }) {
  if (typeof adjustedNow !== "function")
    throw Error("Explicit adjusted clock required");
  const before = new Map(),
    subscribers = new Set();
  const key = (owner) => contract.watermark.keyPrefix + owner;
  const read = (owner) => {
    try {
      return storage.getItem(key(owner));
    } catch {
      return null;
    }
  };
  return {
    key,
    current: (owner) => (owner === null ? null : read(owner)),
    previous: (owner) =>
      owner === null
        ? null
        : before.has(owner)
          ? before.get(owner).before
          : read(owner),
    markOpened(owner, at = new Date(adjustedNow()).toISOString()) {
      before.set(owner, { before: read(owner), at });
      try {
        storage.setItem(key(owner), at);
      } catch {
        /* Original ignores failure. */
      }
      for (const notify of subscribers) notify();
    },
    subscribe(notify) {
      subscribers.add(notify);
      return () => subscribers.delete(notify);
    },
    storageEvent(key) {
      if (key === null || key.startsWith(contract.watermark.keyPrefix))
        for (const notify of subscribers) notify();
    },
  };
}
