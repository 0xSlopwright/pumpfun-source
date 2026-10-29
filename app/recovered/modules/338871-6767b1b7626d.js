// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242);
  let n = null,
    r = null,
    i = () =>
      r
        ? Promise.resolve(r)
        : (n ??= e
            .A(816171)
            .then((e) => ((r = e), e))
            .catch((e) => {
              throw ((n = null), e);
            }));
  var a = e.i(732486),
    o = e.i(426091),
    l = e.i(574472),
    s = e.i(599077),
    u = e.i(352386),
    c = e.i(63289),
    d = e.i(759257);
  let f = { hmacToken: null, intercomUserId: null, forAddress: null };
  var p = e.i(184350);
  let m = Object.freeze({
      GENERAL: "general",
      UNKNOWN: "unknown-page",
      PROFILE_PAGE: "profile-page",
      HOME_PAGE: "home-page",
      EXPLORE_PAGE: "explore-page",
      COIN_PAGE: "coin-page",
      LINK_PAGE: "link-page",
      CREATE_PAGE: "create-page",
      SEARCH_PAGE: "search-page",
      TERMS_PAGE: "terms-page",
      PRIVACY_POLICY_PAGE: "privacy-policy-page",
      FEES_PAGE: "fees-page",
      MODERATION_MESSAGE_PAGE: "moderation-message-page",
      DOCS_PAGE: "docs-page",
    }),
    g = (e) =>
      e
        ? "/" === e
          ? m.HOME_PAGE
          : "/explore" === e
            ? m.EXPLORE_PAGE
            : e.startsWith("/coin/")
              ? m.COIN_PAGE
              : e.startsWith("/link/")
                ? m.LINK_PAGE
                : "/create" === e
                  ? m.CREATE_PAGE
                  : e.startsWith("/s")
                    ? m.SEARCH_PAGE
                    : e.startsWith("/profile/")
                      ? m.PROFILE_PAGE
                      : "/docs/terms-and-conditions" === e
                        ? m.TERMS_PAGE
                        : "/docs/privacy-policy" === e
                          ? m.PRIVACY_POLICY_PAGE
                          : "/docs/fees" === e
                            ? m.FEES_PAGE
                            : "/docs/moderation-message" === e
                              ? m.MODERATION_MESSAGE_PAGE
                              : e.startsWith("/docs/")
                                ? m.DOCS_PAGE
                                : m.GENERAL
        : m.UNKNOWN,
    h = "intercom-boot-error",
    y = () => {},
    v = async () => !1,
    _ = (e, t, n) => {
      let r = e.current;
      return (
        (!r || (r.userId === t && r.address === n)) &&
        ((e.current = { userId: t, address: n }), !0)
      );
    },
    E = (0, u.createContext)({
      hmacToken: null,
      isLoading: !1,
      error: null,
      refetchHmacToken: async () => {},
      trackPage: y,
      bootIntercom: v,
      shutdownIntercom: y,
      retryBoot: v,
      isIntercomOpen: !1,
      unreadCount: 0,
      bootStatus: "idle",
      bootError: null,
    }),
    w = () => (0, u.useContext)(E),
    b = (e) => {
      let n,
        i,
        a = (0, t.c)(8),
        {
          user: o,
          hmacToken: l,
          appId: c,
          bootedRef: d,
          identifiedClaimRef: f,
        } = e,
        p = (0, s.usePathname)();
      return (
        a[0] !== c ||
        a[1] !== d ||
        a[2] !== l ||
        a[3] !== f ||
        a[4] !== p ||
        a[5] !== o
          ? ((n = () => {
              if (d.current && o && o.userId && l && c) {
                let e = r;
                if (!e || !_(f, o.userId, o.address)) return;
                let t = g(p);
                e.update({
                  app_id: c,
                  user_id: o.userId,
                  email: o.email,
                  name: o.name,
                  user_hash: l,
                  address: o.address,
                  "Device Type": o["Device Type"],
                  browser: o.browser,
                  "Wallet Type": o["Wallet Type"],
                  currentPage: p,
                  pageName: t,
                  hide_default_launcher: !0,
                });
              }
            }),
            (i = [o, l, p, c, d, f]),
            (a[0] = c),
            (a[1] = d),
            (a[2] = l),
            (a[3] = f),
            (a[4] = p),
            (a[5] = o),
            (a[6] = n),
            (a[7] = i))
          : ((n = a[6]), (i = a[7])),
        (0, u.useEffect)(n, i),
        null
      );
    };
  function S(e) {
    return e.hide();
  }
  function I(e) {
    return e.show();
  }
  function P(e) {
    if (e) return i().then(I);
  }
  function C(e) {
    return e.showMessages();
  }
  function A(e) {
    if (e) return i().then(C);
  }
  function k(e) {
    (e.update({ hide_default_launcher: !0 }), e.show());
  }
  function T(e) {
    if (e) return i().then(k);
  }
  function O(e) {
    return e.hide();
  }
  function x() {
    i().then(O);
  }
  (e.s(
    [
      "Y",
      0,
      ({ children: e, appId: t, autoBootEnabled: n = !1 }) => {
        let { address: m, shouldUsePrivy: y, user: v } = (0, l.F)(),
          w = (0, p.G)(),
          S = (0, s.usePathname)(),
          [I, P] = (0, u.useState)("desktop"),
          [C, A] = (0, u.useState)(""),
          [k, T] = (0, u.useState)(!1),
          [O, x] = (0, u.useState)(0),
          [L, j] = (0, u.useState)("idle"),
          [R, N] = (0, u.useState)(null),
          G = (0, u.useRef)(!1),
          M = (0, u.useRef)(!1),
          D = (0, u.useRef)(null),
          U = (0, u.useRef)(null),
          H = (0, u.useRef)(0),
          B = (0, u.useRef)(null),
          F = (0, u.useRef)(!1),
          W = (0, u.useCallback)((e) => {
            H.current === e && (F.current = !1);
          }, []);
        (0, u.useEffect)(() => {
          (P(
            window.matchMedia("(max-width: 768px)").matches
              ? "mobile"
              : "desktop",
          ),
            A(window.navigator.userAgent));
        }, []);
        let {
            hmacToken: K,
            intercomUserId: Y,
            isLoading: J,
            error: q,
            refetch: $,
          } = (({ address: e }) => {
            let [t, n] = (0, u.useState)(f),
              [r, i] = (0, u.useState)(!1),
              [a, o] = (0, u.useState)(null),
              l = (0, u.useRef)(e);
            l.current = e;
            let s = (0, u.useCallback)(async () => {
              if (!e) return void i(!1);
              (i(!0), o(null), n(f));
              try {
                let t = await (0, d.j)()("GET /intercom/hmac", {
                  query: { platform: "web", subject: "auto" },
                  credentials: "include",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                });
                if (l.current !== e) return;
                n({
                  hmacToken: t.hmac_token || null,
                  intercomUserId: t.intercom_user_id || null,
                  forAddress: e,
                });
              } catch (r) {
                if (l.current !== e) return;
                let t = r instanceof Error ? r.message : "Unknown error";
                (o(Error(`Failed to fetch HMAC token: ${t}`)), n(f));
              } finally {
                l.current === e && i(!1);
              }
            }, [e]);
            (0, u.useEffect)(() => {
              s();
            }, [s]);
            let c = !!e && t.forAddress === e;
            return {
              hmacToken: c ? t.hmacToken : null,
              intercomUserId: c ? t.intercomUserId : null,
              isLoading: r,
              error: a,
              refetch: s,
            };
          })({ address: m }),
          V = m
            ? {
                userId: Y ?? (K ? m : null),
                email: w,
                name: v?.username ?? "",
                address: m,
                "Device Type": I,
                browser: C,
                "Wallet Type": y ? "privy" : (0, o.Y)() || "unknown",
              }
            : void 0,
          Q = (0, u.useRef)({ userData: V, hmacToken: K, pathname: S });
        Q.current = { userData: V, hmacToken: K, pathname: S };
        let X = (0, u.useCallback)(() => {
            U.current && (clearTimeout(U.current), (U.current = null));
          }, []),
          Z = (0, u.useCallback)(() => {
            (X(), (G.current = !0), (M.current = !0), j("ready"), N(null));
          }, [X]),
          z = (0, u.useCallback)(
            (e) => {
              M.current ||
                ((M.current = !0),
                e.onShow(() => {
                  (Z(), T(!0));
                }),
                e.onHide(() => {
                  T(!1);
                }),
                e.onUnreadCountChange((e) => {
                  (Z(), x(e ?? 0));
                }));
            },
            [Z],
          ),
          ee = (0, u.useCallback)(() => {
            if (!t) return Promise.resolve(!1);
            if (G.current) return B.current ?? Promise.resolve(!0);
            if (F.current && B.current) return B.current;
            ((G.current = !0), (F.current = !0));
            let e = ++H.current;
            (j("booting"),
              N(null),
              X(),
              (U.current = setTimeout(() => {
                ((G.current = !1),
                  (M.current = !1),
                  j("error"),
                  N(
                    (e) =>
                      e ??
                      Error(
                        "Intercom widget failed to load. Check your connection or any content blockers and try again.",
                      ),
                  ));
              }, 1e4)));
            let n = (async () => {
              try {
                let n = await i();
                if (H.current !== e) return !1;
                let { userData: r, hmacToken: a, pathname: o } = Q.current,
                  l = g(o ?? ""),
                  s = {
                    app_id: t,
                    currentPage: o ?? void 0,
                    pageName: l,
                    hide_default_launcher: !0,
                  };
                return (
                  r?.userId && a && _(D, r.userId, r.address)
                    ? n.default({
                        ...s,
                        user_id: r.userId,
                        email: r.email,
                        name: r.name,
                        user_hash: a,
                        address: r.address,
                        "Device Type": r["Device Type"],
                        browser: r.browser,
                        "Wallet Type": r["Wallet Type"],
                      })
                    : n.default(s),
                  z(n),
                  (G.current = !0),
                  W(e),
                  !0
                );
              } catch (n) {
                if ((W(e), H.current !== e)) return !1;
                (X(), (G.current = !1), (M.current = !1));
                let t =
                  n instanceof Error ? n : Error("Failed to boot Intercom");
                return (j("error"), N(t), !1);
              }
            })();
            return ((B.current = n), n);
          }, [t, z, X, W]),
          et = (0, u.useCallback)(() => {
            (X(),
              (G.current = !1),
              (M.current = !1),
              (D.current = null),
              H.current++,
              (F.current = !1),
              (B.current = null),
              T(!1),
              x(0),
              j("idle"),
              N(null),
              r?.shutdown());
          }, [X]),
          en = (0, u.useCallback)(async () => {
            if (
              (X(),
              (G.current = !1),
              (F.current = !1),
              (M.current = !1),
              (D.current = null),
              j("idle"),
              N(null),
              "u" > typeof document)
            ) {
              let e = document.getElementById("_intercom_npm_loader");
              e?.parentNode?.removeChild(e);
            }
            return ((window.Intercom = void 0), ee());
          }, [ee, X]),
          er = (0, u.useCallback)((e, t) => {
            if (!G.current) return;
            let n = t || g(e);
            r?.update({
              currentPage: e,
              pageName: n,
              ...(t && { supportSource: t }),
            });
          }, []);
        return (
          (0, u.useEffect)(() => {
            S && er(S);
          }, [S, er]),
          (0, u.useEffect)(() => {
            t && n && ee();
          }, [t, n, ee]),
          (0, u.useEffect)(() => {
            let e = D.current;
            e && e.address !== m && et();
          }, [m, et]),
          (0, u.useEffect)(() => X, [X]),
          (0, u.useEffect)(() => {
            "error" !== L
              ? c.c.dismiss(h)
              : c.c.error(
                  R?.message ?? "Couldn't open support. Please try again.",
                  {
                    id: h,
                    action: {
                      label: "Retry",
                      onClick: () => {
                        en();
                      },
                    },
                  },
                );
          }, [L, R, en]),
          (0, a.jsxs)(E.Provider, {
            value: {
              hmacToken: K,
              isLoading: J,
              error: q,
              refetchHmacToken: $,
              trackPage: er,
              bootIntercom: ee,
              shutdownIntercom: et,
              retryBoot: en,
              isIntercomOpen: k,
              unreadCount: O,
              bootStatus: L,
              bootError: R,
            },
            children: [
              (0, a.jsx)(b, {
                user: V,
                hmacToken: K,
                appId: t,
                bootedRef: G,
                identifiedClaimRef: D,
              }),
              e,
            ],
          })
        );
      },
      "U",
      0,
      w,
    ],
    797658,
  ),
    e.s(
      [
        "f",
        0,
        () => {
          let e,
            n,
            r,
            a,
            o,
            l,
            s = (0, t.c)(26),
            {
              bootIntercom: u,
              shutdownIntercom: c,
              retryBoot: d,
              isIntercomOpen: f,
              unreadCount: p,
              bootStatus: m,
              bootError: g,
            } = w();
          s[0] !== c
            ? ((e = () => {
                c();
              }),
              (s[0] = c),
              (s[1] = e))
            : (e = s[1]);
          let h = e;
          s[2] !== u || s[3] !== m || s[4] !== f || s[5] !== d
            ? ((n = () => {
                f ? i().then(S) : ("error" === m ? d() : u()).then(P);
              }),
              (s[2] = u),
              (s[3] = m),
              (s[4] = f),
              (s[5] = d),
              (s[6] = n))
            : (n = s[6]);
          let y = n;
          s[7] !== u
            ? ((r = () => {
                u().then(A);
              }),
              (s[7] = u),
              (s[8] = r))
            : (r = s[8]);
          let v = r;
          s[9] !== u
            ? ((a = () => {
                u().then(T);
              }),
              (s[9] = u),
              (s[10] = a))
            : (a = s[10]);
          let _ = a;
          s[11] !== u
            ? ((o = (e) => {
                u().then((t) => {
                  if (t) return i().then((t) => t.showNewMessage(e || ""));
                });
              }),
              (s[11] = u),
              (s[12] = o))
            : (o = s[12]);
          let E = o,
            b = "booting" === m,
            I = "error" === m;
          return (
            s[13] !== g ||
            s[14] !== m ||
            s[15] !== f ||
            s[16] !== h ||
            s[17] !== _ ||
            s[18] !== v ||
            s[19] !== E ||
            s[20] !== d ||
            s[21] !== b ||
            s[22] !== I ||
            s[23] !== y ||
            s[24] !== p
              ? ((l = {
                  logoutUser: h,
                  toggleChat: y,
                  openMessages: v,
                  openHelpCenter: _,
                  openNewMessage: E,
                  hide: x,
                  retryBoot: d,
                  isIntercomOpen: f,
                  unreadCount: p,
                  bootStatus: m,
                  bootError: g,
                  isBooting: b,
                  hasBootError: I,
                }),
                (s[13] = g),
                (s[14] = m),
                (s[15] = f),
                (s[16] = h),
                (s[17] = _),
                (s[18] = v),
                (s[19] = E),
                (s[20] = d),
                (s[21] = b),
                (s[22] = I),
                (s[23] = y),
                (s[24] = p),
                (s[25] = l))
              : (l = s[25]),
            l
          );
        },
      ],
      338871,
    ));
};
