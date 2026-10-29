// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = "mfa_timeout",
    n = "mfa_verification_max_attempts_reached",
    r = new Set([t, n, "missing_or_invalid_mfa"]),
    o = (e) => {
      if ("string" == typeof e) return i(e, !1);
      if ("object" != typeof e || null === e) return "none";
      let o = "string" == typeof e.type ? e.type : void 0;
      return o === t
        ? "timeout"
        : o === n
          ? "max_attempts"
          : i(
              "string" == typeof e.message
                ? e.message
                : "string" == typeof e.error
                  ? e.error
                  : "",
              void 0 !== o && r.has(o),
            );
    },
    i = (e, t) => {
      let n = e.toLowerCase();
      return n.includes("mfa cancel")
        ? "cancelled"
        : n.includes("timed out waiting for mfa code")
          ? "timeout"
          : n.includes("max mfa verification attempts")
            ? "max_attempts"
            : n.includes("code 429") && (t || n.includes("mfa"))
              ? "rate_limited"
              : "none";
    };
  e.s(
    [
      "n",
      0,
      function (e) {
        let t = ((e) => {
          let t = e;
          for (let e = 0; e <= 4 && null != t; e += 1) {
            let e = o(t);
            if ("none" !== e) return e;
            if ("object" != typeof t) break;
            let n = t,
              r = n.cause ?? n.error;
            if ("string" == typeof r) return i(r, !1);
            t = r;
          }
          return "none";
        })(e);
        if ("cancelled" === t) return "mfa_cancelled";
        if ("timeout" === t) return "mfa_timeout";
        if ("max_attempts" === t || "rate_limited" === t)
          return "mfa_max_attempts";
        let n = { haystack: "", codes: [] };
        !(function e(t, n, r) {
          if (null == t || r > 4) return;
          if ("string" == typeof t) {
            n.haystack += ` ${t}`;
            return;
          }
          if ("object" != typeof t) return;
          for (let e of ["name", "message", "errorName"]) {
            let r = t[e];
            "string" == typeof r && (n.haystack += ` ${r}`);
          }
          let { code: o } = t;
          ("number" == typeof o
            ? n.codes.push(o)
            : "string" == typeof o &&
              /^-?\d+$/.test(o) &&
              n.codes.push(Number(o)),
            e(t.cause, n, r + 1),
            e(t.error, n, r + 1));
        })(e, n, 0);
        let r = n.haystack.toLowerCase();
        return /session_cookie_rejected/.test(r)
          ? "session_cookie_rejected"
          : n.codes.includes(4001) ||
              /user rejected|user denied|user cancel|rejected the request|rejected the signing|request rejected|\bcancell?ed\b|declin|dismiss/.test(
                r,
              )
            ? "user_rejected"
            : /must be authenticated to use their embedded wallet|must be authenticated before signing/.test(
                  r,
                )
              ? "privy_session_expired"
              : /failed to initialize embedded wallet proxy|unable to connect to wallet/.test(
                    r,
                  )
                ? "privy_wallet_unreachable"
                : /not been authorized|not authorized by|method and\/or account/.test(
                      r,
                    )
                  ? "not_authorized"
                  : /keyring|wallet is locked|is locked|please unlock|no active account|account not found|wallet not connected|does not support signmessage/.test(
                        r,
                      )
                    ? "wallet_unavailable"
                    : /failed to fetch|timed out|timeout|network ?error|load failed|err_|offline|connection (failed|refused|reset)|\bnetwork\b/.test(
                          r,
                        )
                      ? "network"
                      : "unknown";
      },
      "_",
      0,
      (e) =>
        "mfa_cancelled" === e ||
        "mfa_timeout" === e ||
        "mfa_max_attempts" === e,
    ],
    932177,
  );
};
