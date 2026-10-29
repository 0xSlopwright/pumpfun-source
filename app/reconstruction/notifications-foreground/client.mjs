// Reconstructed from authenticated captured factories, never imported from them.
// Explicit ports only: importing this module attaches no listeners or transport.
const DM_INBOX = ["dms", "inbox"];
const DM_MESSAGES = ["dms", "messages"];
const VARIANTS = new Set([
  "primary",
  "secondary",
  "positive-primary",
  "negative-secondary",
]);
const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const strings = (value) =>
  isObject(value) && Object.values(value).every((v) => typeof v === "string");

function navigation(value) {
  if (
    !isObject(value) ||
    typeof value.pathname !== "string" ||
    (value.params !== undefined && !strings(value.params))
  )
    throw Error("invalid navigation");
  return {
    pathname: value.pathname,
    ...(value.params !== undefined ? { params: { ...value.params } } : {}),
  };
}

// The captured Zod object schema strips unknown keys; it does not validate the
// whole Firebase payload. Undefined here is the original safeParse failure path.
export function parseGenericV1(text) {
  if (!text) return;
  try {
    const value = JSON.parse(text);
    if (
      !isObject(value) ||
      typeof value.notificationSubtype !== "string" ||
      typeof value.showAsToast !== "boolean"
    )
      return;
    const result = {
      notificationSubtype: value.notificationSubtype,
      showAsToast: value.showAsToast,
    };
    if (value.toastButtons !== undefined) {
      if (!Array.isArray(value.toastButtons)) return;
      result.toastButtons = value.toastButtons.map((button) => {
        if (
          !isObject(button) ||
          !["dismiss", "route"].includes(button.type) ||
          typeof button.label !== "string" ||
          !VARIANTS.has(button.variant)
        )
          throw Error("invalid button");
        const { type, label, variant } = button;
        return {
          type,
          label,
          variant,
          ...(type === "route" ? navigation(button) : {}),
        };
      });
    }
    if (value.listNavigation !== undefined)
      result.listNavigation = navigation(value.listNavigation);
    if (value.coinMetadata !== undefined) {
      const coin = value.coinMetadata;
      if (
        !isObject(coin) ||
        typeof coin.mintAddress !== "string" ||
        (coin.coinName !== undefined && typeof coin.coinName !== "string") ||
        (coin.coinSymbol !== undefined && typeof coin.coinSymbol !== "string")
      )
        return;
      result.coinMetadata = {
        mintAddress: coin.mintAddress,
        ...(coin.coinName !== undefined ? { coinName: coin.coinName } : {}),
        ...(coin.coinSymbol !== undefined
          ? { coinSymbol: coin.coinSymbol }
          : {}),
      };
    }
    if (value.metadata !== undefined) {
      if (!strings(value.metadata)) return;
      result.metadata = { ...value.metadata };
    }
    return result;
  } catch {
    return;
  }
}

export function dmTarget(data) {
  if (!data.deeplink?.startsWith("pump://")) return;
  let url;
  try {
    url = new URL(data.deeplink);
  } catch {
    return;
  }
  if (url.protocol !== "pump:" || url.hostname !== "dms") return;
  const id = url.pathname.replace(/^\//, "").split("/")[0]?.trim();
  let sender;
  if (data.genericV1) {
    try {
      const value = JSON.parse(data.genericV1);
      if (
        isObject(value) &&
        (value.metadata === undefined || strings(value.metadata))
      )
        sender = value.metadata?.senderUserId || undefined;
    } catch {
      /* Captured metadata parse failure leaves only the deeplink ID. */
    }
  }
  return {
    ...(id ? { conversationId: id } : {}),
    ...(sender ? { senderUserId: sender } : {}),
  };
}

export function activeRoomRegistry() {
  const counts = new Map();
  return {
    has: (id) => counts.has(id),
    register(ids) {
      const selected = ids.filter((id) => !!id);
      for (const id of selected) counts.set(id, (counts.get(id) ?? 0) + 1);
      let disposed = false;
      return () => {
        if (disposed) return;
        disposed = true;
        for (const id of selected) {
          const remaining = (counts.get(id) ?? 0) - 1;
          if (remaining > 0) counts.set(id, remaining);
          else counts.delete(id);
        }
      };
    },
  };
}

export function achievementToastContexts() {
  let count = 0;
  return {
    isOpen: () => count > 0,
    register() {
      count += 1;
      let disposed = false;
      return () => {
        if (!disposed) {
          disposed = true;
          count = Math.max(0, count - 1);
        }
      };
    },
  };
}

export function dmDisposition({
  target,
  pathname,
  queryClient,
  isActiveRoom,
  now = Date.now,
}) {
  const ids = [target.senderUserId, target.conversationId].filter((id) => !!id);
  if (ids.some(isActiveRoom)) return "active_room";
  if (pathname === "/messages") return "inbox_open";
  if (ids.length !== 0) {
    const selected = new Set(ids);
    for (const [, data] of queryClient.getQueriesData({
      queryKey: [...DM_INBOX],
    }))
      for (const page of data?.pages ?? [])
        for (const entry of page.entries)
          if (
            selected.has(entry.conversationId) ||
            selected.has(entry.peerId)
          ) {
            if (!entry.isMuted) return "toast";
            if (entry.mutedUntil === null) return "muted";
            return Date.parse(entry.mutedUntil) > now() ? "muted" : "toast";
          }
  }
  return "toast";
}

function coinMint(data) {
  if (data.mintAddress) return data.mintAddress;
  if (data.genericV1) {
    try {
      const value = JSON.parse(data.genericV1);
      if (value.coinMetadata?.mintAddress)
        return value.coinMetadata.mintAddress;
    } catch {
      /* This raw coin lookup precedes the stricter generic schema. */
    }
  }
  if (data.deeplink) {
    const text = data.deeplink.replace(/^pump:\/\/coin\//, "pump://coins/");
    try {
      const url = new URL(text);
      if (url.hostname === "coins")
        return url.pathname.replace(/^\//, "").split("/")[0] || undefined;
      if (url.hostname === "coin")
        return url.searchParams.get("mint") ?? undefined;
    } catch {
      return;
    }
  }
}

export async function confirmDelivery(api, payload) {
  await api
    .post("notifications/confirm-delivery", {
      json: {
        notificationId: payload.notificationId,
        userId: payload.userId,
        timestamp: payload.timestamp,
        platform: "web",
        deliveryLocation: "in_app",
        ...(payload.deviceId ? { deviceId: payload.deviceId } : {}),
      },
    })
    .catch(() => undefined);
}

// The HTTP-only destination restriction is local adapter design. No implicit
// production URL, auth hook, Accept header, response decode or network is added.
export function deliveryClient({ origin, transport }) {
  const destination = new URL(origin);
  if (!["http:", "https:"].includes(destination.protocol))
    throw Error("HTTP(S) destination required");
  if (typeof transport !== "function")
    throw TypeError("Explicit transport required");
  return {
    async post(input, { json }) {
      const response = await transport(
        new URL(`/api/hermes/${input}`, destination.origin),
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(json),
        },
      );
      if (!response.ok) throw Error(`Delivery HTTP ${response.status}`);
    },
  };
}

// Models the used `et` function, not Firebase registration, React effects, or
// the outer onMessage callback's separate fetchUser/inbox invalidation work.
export function foregroundHandler({
  hermesApi,
  queryClient,
  getDeviceId,
  isActiveRoom,
  isAchievementToastOpen,
  loadSensitiveContentDetector,
  showToast,
  now = Date.now,
}) {
  return async ({ payload, pathname, isDirectMessagesEnabled = true }) => {
    const data = payload.data ?? {};
    const title = payload.notification?.title ?? data.title ?? "Notification";
    const body = payload.notification?.body ?? data.body ?? "";
    const imageUrl =
      payload.notification?.image ??
      data.imageUrl ??
      data.imageURL ??
      data.enhancedPresentationIconUrl;
    const type = data.type ?? "hermesNotificationGenericV1";
    if (hermesApi && data.messageId && data.userId && data.timestamp) {
      void confirmDelivery(hermesApi, {
        notificationId: data.messageId,
        userId: data.userId,
        timestamp: data.timestamp,
        deviceId: getDeviceId(),
      });
    }
    const target = dmTarget(data);
    if (target) {
      queryClient.invalidateQueries({ queryKey: [...DM_INBOX] });
      queryClient.invalidateQueries({ queryKey: [...DM_MESSAGES] });
      if (
        !isDirectMessagesEnabled ||
        dmDisposition({ target, pathname, queryClient, isActiveRoom, now }) !==
          "toast"
      )
        return;
      const roomId = target.senderUserId ?? target.conversationId;
      const roomPath = roomId
        ? `/messages/${encodeURIComponent(roomId)}`
        : "/messages";
      const avatarUrl =
        data.enhancedPresentationIconUrl ||
        data.imageUrl ||
        data.imageURL ||
        payload.notification?.image ||
        undefined;
      const { containsDmSensitiveContent } =
        await loadSensitiveContentDetector();
      showToast(
        {
          kind: "dm",
          title,
          body,
          avatarUrl,
          isRedacted: containsDmSensitiveContent(body),
          roomPath,
        },
        {
          duration: 8000,
          id: `hermes-dm-${data.messageId ?? target.conversationId ?? title}`,
        },
      );
      return;
    }
    const mint = coinMint(data);
    if (mint && pathname.startsWith(`/coin/${mint}`)) return;
    const genericV1 = parseGenericV1(data.genericV1);
    if (
      genericV1?.notificationSubtype === "limit_order_filled" &&
      isAchievementToastOpen()
    )
      return;
    if (type === "hermesNotificationGenericV1" && genericV1?.showAsToast) {
      showToast(
        {
          kind: "generic",
          title,
          body,
          imageUrl,
          genericV1,
          deeplink: data.deeplink,
        },
        { duration: 10000, id: `hermes-${data.messageId ?? title}` },
      );
      return;
    }
    showToast(
      {
        kind: "simple",
        title,
        body,
        imageUrl,
        deeplink: data.deeplink,
        listNavigation: genericV1?.listNavigation,
      },
      { duration: 8000, id: `hermes-simple-${data.messageId ?? title}` },
    );
  };
}
