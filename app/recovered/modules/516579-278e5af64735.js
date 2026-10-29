// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(947187);
  let i = /\/status\/(\d+)/,
    r = /\/i\/communities\/(\d+)/;
  function n(e) {
    let t = e.replace(/^www\./, "").toLowerCase();
    return "twitter.com" === t || "x.com" === t || "mobile.twitter.com" === t;
  }
  let l = new Set([
    "i",
    "home",
    "explore",
    "search",
    "notifications",
    "messages",
    "settings",
    "compose",
    "intent",
    "hashtag",
    "share",
    "login",
    "signup",
    "tos",
    "privacy",
  ]);
  e.s(
    [
      "l",
      0,
      n,
      "h",
      0,
      function (e) {
        let a = (function (e) {
          if (!e?.trim()) return null;
          let r = (0, t._)(e);
          if (!r) return null;
          try {
            let e,
              t = new URL(r);
            if (
              ((e = t.hostname.replace(/^www\./, "")),
              "twitter.com" !== e &&
                "x.com" !== e &&
                "mobile.twitter.com" !== e)
            )
              return null;
            let n = t.pathname.match(i);
            return n?.[1] ?? null;
          } catch {
            return null;
          }
        })(e);
        if (a) return { kind: "post", tweetId: a };
        if (!e?.trim()) return null;
        let s = (0, t._)(e);
        if (!s) return null;
        try {
          let e = new URL(s);
          if (!n(e.hostname)) return null;
          let t = e.pathname.match(r);
          if (t?.[1]) return { kind: "community", communityId: t[1] };
          if (e.pathname.includes("/status/")) return null;
          let i = e.pathname.split("/").filter(Boolean)[0]?.replace(/^@/, "");
          if (i && !l.has(i.toLowerCase()))
            return { kind: "profile", handle: i };
          return null;
        } catch {
          return null;
        }
      },
    ],
    516579,
  );
};
