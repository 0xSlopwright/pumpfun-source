// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(528600),
    n = e.i(4911),
    r = e.i(639374);
  let a = ({ calloutId: e, authorWallet: t }) => {
    if (!e?.trim()) return;
    let n = t?.trim();
    if (n && (0, r.f)(n)) return n;
  };
  e.s(
    [
      "O",
      0,
      ({ calloutId: e, authorWallet: t }) => {
        let n = a({ calloutId: e, authorWallet: t });
        if (n && e) return { calloutUser: n, calloutId: e };
      },
      "T",
      0,
      a,
    ],
    266610,
  );
  var i = e.i(503630),
    o = e.i(605587);
  let s = (e) =>
      [e?.canonical_svm_wallet, e?.address].find(
        (e) => "string" == typeof e && (0, r.f)(e),
      ),
    l = async (e) => {
      if ((0, r.f)(e)) return e;
      try {
        return s(
          await (0, t.e)({
            clientServerUrl: (0, i.R)(),
            userIdentifier: e,
            fetchOptions: { signal: AbortSignal.timeout(3500) },
          }),
        );
      } catch {
        return;
      }
    };
  e.s(
    [
      "$",
      0,
      ({
        lastClickImpression: e,
        mint: t,
        sponsored: n,
        isPrivyEmbeddedSigner: r,
      }) => {
        if ((n || r) && e && (0, o.I)(e.mint, t))
          return a({
            calloutId: e.impression.calloutId,
            authorWallet: e.impression.calloutAuthorWallet,
          });
      },
      "r",
      0,
      ({ authorId: e, authorCcUserId: t }) => {
        let a = e?.trim();
        if (a && (0, r.f)(a)) return a;
        let i = t?.trim();
        return i || (a && (0, n.f)(a, { strict: !1 }) ? a : void 0);
      },
      "M",
      0,
      l,
      "n",
      0,
      s,
    ],
    257004,
  );
};
