// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    a = e.i(445242),
    i = e.i(745018);
  function n(e) {
    let i,
      n,
      s,
      l,
      r,
      o = (0, a.c)(6),
      { size: c } = e,
      u = void 0 === c ? 18 : c;
    return (
      o[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((i = (0, t.jsx)("path", {
            d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
            fill: "#4285F4",
          })),
          (n = (0, t.jsx)("path", {
            d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
            fill: "#34A853",
          })),
          (s = (0, t.jsx)("path", {
            d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
            fill: "#FBBC05",
          })),
          (l = (0, t.jsx)("path", {
            d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
            fill: "#EA4335",
          })),
          (o[0] = i),
          (o[1] = n),
          (o[2] = s),
          (o[3] = l))
        : ((i = o[0]), (n = o[1]), (s = o[2]), (l = o[3])),
      o[4] !== u
        ? ((r = (0, t.jsxs)("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: u,
            height: u,
            viewBox: "0 0 24 24",
            "aria-hidden": !0,
            children: [i, n, s, l],
          })),
          (o[4] = u),
          (o[5] = r))
        : (r = o[5]),
      r
    );
  }
  function s(e) {
    let i,
      n,
      s = (0, a.c)(3),
      { size: l } = e,
      r = void 0 === l ? 18 : l;
    return (
      s[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((i = (0, t.jsx)("path", {
            d: "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11.04 11.04 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.12 3.04.73.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5z",
          })),
          (s[0] = i))
        : (i = s[0]),
      s[1] !== r
        ? ((n = (0, t.jsx)("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: r,
            height: r,
            viewBox: "0 0 24 24",
            fill: "currentColor",
            "aria-hidden": !0,
            children: i,
          })),
          (s[1] = r),
          (s[2] = n))
        : (n = s[2]),
      n
    );
  }
  (e.s(
    [
      "P",
      0,
      s,
      "y",
      0,
      n,
      "m",
      0,
      {
        google: {
          label: "Google",
          renderLogo: (e) => (0, t.jsx)(n, { size: e }),
        },
        apple: {
          label: "Apple",
          renderLogo: (e) => (0, t.jsx)(i.Te, { size: e, "aria-hidden": !0 }),
        },
        twitter: {
          label: "X",
          renderLogo: (e) => (0, t.jsx)(i.Tc, { size: e, "aria-hidden": !0 }),
        },
        github: {
          label: "GitHub",
          renderLogo: (e) => (0, t.jsx)(s, { size: e }),
        },
      },
    ],
    20077,
  ),
    e.s(
      [
        "U",
        0,
        function (e, t) {
          switch (e) {
            case "oauth_account_suspended":
              return t("web.auth.oauth_account_suspended");
            case "missing_or_invalid_privy_app_id":
            case "missing_or_invalid_privy_client_id":
              return t("web.auth.oauth_misconfigured");
            case "oauth_unique_user_required":
              return t("web.auth.oauth_account_already_linked");
            case "allowlist_rejected":
              return t("web.auth.oauth_not_allowed");
            case "captcha_failed":
              return t("web.auth.oauth_captcha_failed");
            case "":
              return t("web.auth.oauth_failed_generic");
            default: {
              let a = e.replace(/_/g, " ").trim();
              if (!a) return t("web.auth.oauth_failed_generic");
              return t("web.auth.oauth_failed_reason", { reason: a });
            }
          }
        },
        "w",
        0,
        function (e) {
          return (
            "exited_auth_flow" === e ||
            "user_exited_auth_flow" === e ||
            "exited_link_flow" === e
          );
        },
        "G",
        0,
        function (e) {
          if (!e) return "";
          if ("string" == typeof e) return e;
          if (e instanceof Error) return e.message;
          if ("object" == typeof e && "message" in e) {
            let t = e.message;
            if ("string" == typeof t) return t;
          }
          return "";
        },
      ],
      802323,
    ));
};
