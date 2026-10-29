// Original notification activation/route decisions; no app router or network is
// installed on import. Destination pages remain explicit integration boundaries.
const NEAR_PREFIX = "near:mainnet:";
const nearAccount =
  /^(?=.{2,64}$)(?:(?:[a-z\d]+[-_])*[a-z\d]+\.)*(?:[a-z\d]+[-_])*[a-z\d]+$/;
function profileHref(value) {
  if (value == null) return null;
  const id =
    typeof value === "string"
      ? value
      : value.address?.trim() || value.userId?.trim() || "";
  return id ? `/profile/${encodeURIComponent(id)}` : null;
}
export function navigationIntent({ pathname, params }) {
  const mint = params?.mint,
    id = params?.id ?? params?.userIdentifier,
    taskId = params?.taskId;
  if (pathname === "/coins/[mint]" && mint)
    return {
      type: "coin",
      mint,
      ...(params?.source ? { source: params.source } : {}),
    };
  if (pathname === "/profile/[id]" && id) return { type: "profile", id };
  if (pathname === "/achievements/[id]" && id)
    return { type: "achievement", id };
  if (pathname === "/trending/[mint]" && mint)
    return {
      type: "trending",
      mint,
      ...(params?.source ? { source: params.source } : {}),
    };
  if (pathname === "/bounties/[taskId]" && taskId)
    return {
      type: "bounty",
      taskId,
      ...(params?.submissionId ? { submissionId: params.submissionId } : {}),
      ...(params?.comment ? { comment: params.comment } : {}),
    };
  if (
    pathname === "/go/[id]/submissions/[submissionId]" &&
    params?.id &&
    params?.submissionId
  )
    return {
      type: "bounty",
      taskId: params.id,
      submissionId: params.submissionId,
      ...(params.comment ? { comment: params.comment } : {}),
    };
  if (pathname === "/go/[id]" && params?.id)
    return {
      type: "bounty",
      taskId: params.id,
      ...(params.submissionId ? { submissionId: params.submissionId } : {}),
      ...(params.comment ? { comment: params.comment } : {}),
    };
  if (pathname === "/communities") return { type: "communities" };
  if (pathname === "/coins/community/[mint]" && mint)
    return { type: "community", mint };
  if (pathname === "/dms") return { type: "dm" };
  if (pathname === "/dms/[userId]" && params?.userId)
    return { type: "dm", id: params.userId };
  return { type: "route", pathname, params };
}
export function hrefForIntent(intent) {
  switch (intent.type) {
    case "coin": {
      let mint = intent.mint;
      if (mint.startsWith(NEAR_PREFIX)) {
        const stripped = mint.slice(NEAR_PREFIX.length);
        if (nearAccount.test(stripped)) mint = stripped;
      }
      return `/coin/${encodeURIComponent(mint)}`;
    }
    case "profile":
      return profileHref(intent.id);
    case "achievement":
      return `/achievements/${encodeURIComponent(intent.id)}?reveal=1`;
    case "trending":
      return `/trending/${encodeURIComponent(intent.mint)}`;
    case "communities":
      return "/communities";
    case "community":
      return `/coins/community/${encodeURIComponent(intent.mint)}`;
    case "communityPost":
      return `/coins/community/replies/${encodeURIComponent(intent.mint)}/${encodeURIComponent(intent.postId)}`;
    case "bounty": {
      const base = intent.submissionId
        ? `/go/${encodeURIComponent(intent.taskId)}/submissions/${encodeURIComponent(intent.submissionId)}`
        : `/go/${encodeURIComponent(intent.taskId)}`;
      return intent.comment
        ? `${base}?comment=${encodeURIComponent(intent.comment)}`
        : base;
    }
    case "dm":
      return intent.id
        ? `/messages/${encodeURIComponent(intent.id)}`
        : "/messages";
    case "route":
      return intent.params
        ? Object.entries(intent.params).reduce(
            (href, [name, value]) =>
              href.replace(`[${name}]`, encodeURIComponent(value)),
            intent.pathname,
          )
        : intent.pathname;
    default:
      return "/";
  }
}
export function pumpLinkIntent(input) {
  const text = input.replace(/^pump:\/\/coin\//, "pump://coins/");
  try {
    const url = new URL(text);
    if (url.protocol !== "pump:") return null;
    const source = url.searchParams.get("source") ?? "notification";
    if (url.hostname === "coins") {
      const mint = url.pathname.replace(/^\//, "").split("/")[0];
      return mint ? { type: "coin", mint, source } : null;
    }
    if (url.hostname === "coin") {
      const mint = url.searchParams.get("mint");
      return mint ? { type: "coin", mint, source } : null;
    }
    if (url.hostname === "profile") {
      const id = url.pathname.replace(/^\//, "").split("/")[0];
      return id ? { type: "profile", id } : null;
    }
    if (url.hostname === "trending") {
      const mint = url.pathname.replace(/^\//, "").split("/")[0];
      return mint ? { type: "trending", mint, source } : null;
    }
    if (url.hostname === "communities") {
      const parts = url.pathname.split("/").filter(Boolean),
        mint = parts[0]?.trim();
      if (!mint) return { type: "communities" };
      const postId = parts[1] === "posts" ? parts[2]?.trim() : undefined;
      return postId
        ? { type: "communityPost", mint, postId }
        : { type: "community", mint };
    }
    if (url.hostname === "go") {
      const parts = url.pathname.split("/").filter(Boolean),
        taskId = parts[0]?.trim();
      if (!taskId) return null;
      const submissionId =
          parts[1] === "submissions" ? parts[2]?.trim() : undefined,
        comment = url.searchParams.get("comment") ?? undefined;
      return {
        type: "bounty",
        taskId,
        ...(submissionId ? { submissionId } : {}),
        ...(comment ? { comment } : {}),
      };
    }
    if (url.hostname === "account")
      return { type: "route", pathname: `/account${url.pathname}` };
    if (url.hostname === "dms") {
      const id = url.pathname.replace(/^\//, "").split("/")[0]?.trim();
      return id ? { type: "dm", id } : { type: "dm" };
    }
    if (url.hostname === "achievements") {
      const id = url.pathname.replace(/^\//, "").split("/")[0]?.trim();
      return id ? { type: "achievement", id } : null;
    }
    return {
      type: "route",
      pathname: `/${url.hostname}${url.pathname}`,
      params: Object.fromEntries(url.searchParams.entries()),
    };
  } catch {
    return null;
  }
}
export function resolveNotificationHref({ deeplink, listNavigation }) {
  if (listNavigation) return hrefForIntent(navigationIntent(listNavigation));
  if (deeplink?.startsWith("pump://")) {
    const intent = pumpLinkIntent(deeplink);
    if (intent) return hrefForIntent(intent);
  }
  if (deeplink?.startsWith("/")) return deeplink;
  if (deeplink?.startsWith("http")) {
    try {
      const url = new URL(deeplink);
      return `${url.pathname}${url.search}`;
    } catch {
      /* Original fallback is the root. */
    }
  }
  return "/";
}
export const notificationHref = (item) =>
  resolveNotificationHref({
    deeplink: item.deeplink,
    listNavigation: item.navigation ?? item.genericV1?.listNavigation,
  });

const withoutOneTrailingSlash = (pathname) =>
  pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
// Models only the used marker writer, not unproven downstream read consumers,
// entry expiry, performance-navigation inference or telemetry service behavior.
export function dmNavigationMarker({ location, recordEntry, now = Date.now }) {
  return ({ href, entryPoint }) => {
    let pathname;
    try {
      pathname = withoutOneTrailingSlash(
        new URL(href, location.origin).pathname,
      );
    } catch {
      return;
    }
    if (
      (pathname === "/messages" || pathname.startsWith("/messages/")) &&
      withoutOneTrailingSlash(location.pathname) !== pathname
    )
      recordEntry({ pathname, entryPoint, at: now() });
  };
}
export function activateNotification({
  item,
  surface,
  trackClick,
  markNavigation,
  router,
}) {
  trackClick({ item, surface });
  const href = notificationHref(item);
  markNavigation({ href, entryPoint: 8 });
  router.push(href);
}
