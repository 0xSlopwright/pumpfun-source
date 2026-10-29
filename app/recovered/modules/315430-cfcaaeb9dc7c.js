// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    a = e.i(689391),
    i = e.i(703114),
    n = e.i(336291),
    s = e.i(809845),
    l = e.i(732486),
    r = e.i(933185),
    o = e.i(623213),
    c = e.i(748117);
  (e.i(461687), e.i(582355));
  var u = e.i(78436);
  let m = a.z.div`
  text-align: left;
  flex-grow: 1;
`,
    d = a.z.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex-grow: 1;
`,
    h = a.z.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* for Internet Explorer, Edge */
  -ms-overflow-style: none;

  /* for Firefox */
  scrollbar-width: none;

  /* for Chrome, Safari, and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
`,
    p = (0, a.z)(h)`
  ${(e) => ("light" === e.$colorScheme ? "background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.06)) bottom;" : "dark" === e.$colorScheme ? "background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.06)) bottom;" : void 0)}

  background-repeat: no-repeat;
  background-size:
    100% 32px,
    100% 16px;
  background-attachment: local, scroll;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: none;
  padding: 3px;
`,
    f = a.m`
  && {
    width: 100%;
    font-size: 16px;
    line-height: 24px;
    min-height: 56px;

    /* Tablet and Up */
    @media (min-width: 440px) {
      font-size: 14px;
    }

    display: flex;
    gap: 12px;
    align-items: center;
    color: var(--privy-color-foreground);

    padding: 10px 12px;
    border: 1px solid var(--privy-color-foreground-4) !important;
    border-radius: var(--privy-border-radius-md);
    transition: background-color 200ms ease;

    cursor: pointer;

    &:hover {
      background-color: var(--privy-color-background-2);
    }

    &:disabled {
      cursor: pointer;
      background-color: var(--privy-color-background-2);
    }
  }
`,
    b = a.z.div`
  text-align: center;
  font-size: 14px;
  margin-bottom: 24px;
`,
    v = a.z.button.attrs({ className: "login-method-button" })`
  ${f}
`;
  a.z.a`
  ${f}
`;
  let g = a.z.div`
  width: 32px;
  height: 32px;
  border-radius: ${(e) => (e.$fullSize ? "0" : "4px")};
  background: ${(e) => (e.$fullSize ? "transparent" : "var(--privy-color-background-2)")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: ${(e) => (e.$fullSize ? "32px" : "18px")};
    height: ${(e) => (e.$fullSize ? "32px" : "18px")};
    color: ${(e) => (e.$fullSize ? "inherit" : "var(--privy-color-icon-muted)")};
  }
`,
    k = a.z.div`
  width: 100%;
  height: 100%;
  min-height: inherit;
  display: flex;
  flex-direction: column;
  ${(e) => (e.$if ? "display: none;" : "")}
`,
    x = a.z.div`
  width: 100%;
  height: 100%;
  padding: ${(e) => (e.$withPadding ? "64px 0px" : "0px")};
`,
    y = a.z.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  gap: 12px;
  & h3 {
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
  }
  & p {
    max-width: 300px;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
`;
  async function w(e, t, a) {
    if (!t.shouldEnforceDefaultChainOnConnect) return;
    let l = Number(e.chainId.replace("eip155:", ""));
    if (
      !t.chains.find((e) => e.id === l) &&
      ("wallet_connect_v2" !== e.connectorType ||
        "metamask" !== e.walletClientType)
    ) {
      a?.();
      try {
        (await e.switchChain(t.defaultChain.id),
          (e.chainId = (0, n.f)((0, i.g)(t.defaultChain.id))));
      } catch {
        s.c.warn("Unable to switch to default chain after connect", {
          chainId: t.defaultChain.id,
        });
      }
    }
  }
  let j = (0, t.createContext)({}),
    _ = (e) => `privy:${e}:recent-login-method`,
    P = (e) => `privy:${e}:recent-login-wallet-client`,
    C = (e) => `privy:${e}:recent-login-chain-type`,
    S = (0, u.$)(() => ({ isModalOpen: !1, resolvers: null }));
  (0, u.$)(() => ({}));
  e.s([
    "A",
    0,
    d,
    "E",
    0,
    x,
    "G",
    0,
    m,
    "H",
    0,
    k,
    "L",
    0,
    v,
    "R",
    0,
    ({ children: e }) => {
      let a = (0, r.a)(),
        [i, s] = (0, t.useState)({});
      return (
        (0, o.u)("login", {
          onComplete: ({ loginAccount: e }) => {
            e &&
              "passkey" !== e.type &&
              "cross_app" !== e.type &&
              ("wallet" !== e.type || "privy" !== e.walletClientType) &&
              (n.s.put(_(a.id), e.type),
              "wallet" === e.type
                ? (n.s.put(P(a.id), e.walletClientType),
                  n.s.put(C(a.id), e.chainType),
                  s({
                    accountType: e.type,
                    walletClientType: e.walletClientType,
                    chainType: e.chainType,
                  }))
                : (n.s.del(P(a.id)),
                  n.s.del(C(a.id)),
                  s({ accountType: e.type })));
          },
        }),
        (0, t.useEffect)(() => {
          if (!a.id) return;
          let e = n.s.get(_(a.id)),
            t = n.s.get(P(a.id)),
            i = n.s.get(C(a.id));
          e &&
            s(
              "wallet" === e
                ? { accountType: e, walletClientType: t, chainType: i }
                : { accountType: e },
            );
        }, [a.id]),
        (0, l.jsx)(j.Provider, { value: i, children: e })
      );
    },
    "S",
    0,
    b,
    "a",
    0,
    (e) => {
      (0, o.u)("fundWallet", e);
      let { fundWallet: t } = (0, c.u)();
      return { fundWallet: ({ address: e, options: a }) => t(e, a) };
    },
    "d",
    0,
    function (e) {
      let { login: a } = (0, t.useContext)(r.P);
      return ((0, o.u)("login", e), { login: a });
    },
    "e",
    0,
    w,
    "f",
    0,
    function (e) {
      let { logout: a } = (0, t.useContext)(r.P);
      return ((0, o.u)("logout", e), { logout: a });
    },
    "h",
    0,
    () => (0, t.useContext)(j),
    "m",
    0,
    g,
    "n",
    0,
    y,
    "o",
    0,
    p,
    "p",
    0,
    h,
    "s",
    0,
    ({ address: e, client: t, appId: a }) => {
      let i,
        s = `${t}:${e}`;
      (a && n.s.put(((i = a), `privy:${i}:active-wallet-connection`), s),
        S.setState({ wallet: s }));
    },
    "u",
    0,
    (e) => {
      let [a, i] = (0, t.useState)("auto");
      return (
        (0, t.useEffect)(() => {
          let t = new ResizeObserver((e) => {
            i(e[0]?.contentRect.height ?? "auto");
          });
          return (
            e.current && t.observe(e.current),
            () => {
              e.current && t.unobserve(e.current);
            }
          );
        }, [e.current]),
        a
      );
    },
  ]);
};
