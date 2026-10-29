// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(528600),
    i = e.i(4911),
    r = e.i(639374);
  let n = ({ calloutId: e, authorWallet: t }) => {
    if (!e?.trim()) return;
    let i = t?.trim();
    if (i && (0, r.f)(i)) return i;
  };
  e.s(
    [
      "O",
      0,
      ({ calloutId: e, authorWallet: t }) => {
        let i = n({ calloutId: e, authorWallet: t });
        if (i && e) return { calloutUser: i, calloutId: e };
      },
      "T",
      0,
      n,
    ],
    266610,
  );
  var o = e.i(503630),
    a = e.i(605587);
  let s = (e) =>
      [e?.canonical_svm_wallet, e?.address].find(
        (e) => "string" == typeof e && (0, r.f)(e),
      ),
    u = async (e) => {
      if ((0, r.f)(e)) return e;
      try {
        return s(
          await (0, t.e)({
            clientServerUrl: (0, o.R)(),
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
        sponsored: i,
        isPrivyEmbeddedSigner: r,
      }) => {
        if ((i || r) && e && (0, a.I)(e.mint, t))
          return n({
            calloutId: e.impression.calloutId,
            authorWallet: e.impression.calloutAuthorWallet,
          });
      },
      "r",
      0,
      ({ authorId: e, authorCcUserId: t }) => {
        let n = e?.trim();
        if (n && (0, r.f)(n)) return n;
        let o = t?.trim();
        return o || (n && (0, i.f)(n, { strict: !1 }) ? n : void 0);
      },
      "M",
      0,
      u,
      "n",
      0,
      s,
    ],
    257004,
  );
};
