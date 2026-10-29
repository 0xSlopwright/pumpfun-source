// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    a = e.i(574472),
    l = e.i(352386);
  e.i(12692);
  var n = e.i(398902),
    i = e.i(56267),
    s = e.i(66732),
    o = e.i(887827),
    c = e.i(510021),
    d = e.i(960107),
    u = e.i(300157),
    m = e.i(338319);
  let h = (0, l.memo)((e) => {
    let h,
      v,
      b,
      g,
      y,
      j,
      N,
      w,
      k,
      _,
      C,
      S,
      T,
      I,
      G,
      R = (0, r.c)(55),
      {
        coin: F,
        isBookmarked: P,
        addToBookmark: E,
        removeFromBookmark: M,
        onManageWatchlistClick: D,
        position: B,
        analytics: O,
        align: $,
      } = e,
      A = void 0 === $ ? "end" : $,
      { t: U } = (0, n.f)(),
      { decodedJwt: q } = (0, a.F)(),
      [W, z] = (0, l.useState)(!1),
      [L, H] = (0, l.useState)(!1),
      [K, V] = (0, l.useState)(!1);
    q?.address;
    let Q = !!q?.address,
      {
        bookmarks: Y,
        createBookmark: J,
        deleteBookmark: X,
        updateBookmarkName: Z,
        checkIfCoinIsBookmarked: ee,
        addToBookmark: et,
        removeFromBookmark: er,
      } = (0, d.j)(!1, Q),
      ea = E ?? et,
      el = M ?? er;
    R[0] !== F.chain_id || R[1] !== F.mint
      ? ((h = (0, u.y)({ mint: F.mint, chainId: F.chain_id })),
        (R[0] = F.chain_id),
        (R[1] = F.mint),
        (R[2] = h))
      : (h = R[2]);
    let en = h;
    R[3] !== en || R[4] !== ee
      ? ((v = ee(en)), (R[3] = en), (R[4] = ee), (R[5] = v))
      : (v = R[5]);
    let ei = v ?? P;
    R[6] !== Y
      ? ((b = Y?.reduce(f, {}) || {}), (R[6] = Y), (R[7] = b))
      : (b = R[7]);
    let es = b;
    R[8] !== ea ||
    R[9] !== O ||
    R[10] !== en ||
    R[11] !== es ||
    R[12] !== F.mint ||
    R[13] !== B ||
    R[14] !== el
      ? ((g = (e) => {
          let t = es[e];
          ((0, d.w)(t, en)
            ? (O && void 0 !== B && O.trackBookmarkToggle(F.mint, "remove", B),
              el((0, d.T)(t, en), e))
            : (O && void 0 !== B && O.trackBookmarkToggle(F.mint, "add", B),
              z(!0),
              ea(en, e),
              setTimeout(() => z(!1), 600)),
            H(!1));
        }),
        (R[8] = ea),
        (R[9] = O),
        (R[10] = en),
        (R[11] = es),
        (R[12] = F.mint),
        (R[13] = B),
        (R[14] = el),
        (R[15] = g))
      : (g = R[15]);
    let eo = g;
    R[16] !== D
      ? ((y = () => {
          (D ? D() : V(!0), H(!1));
        }),
        (R[16] = D),
        (R[17] = y))
      : (y = R[17]);
    let ec = y;
    R[18] === Symbol.for("react.memo_cache_sentinel")
      ? ((j = (e) => {
          (e.preventDefault(), e.stopPropagation(), H(!0));
        }),
        (R[18] = j))
      : (j = R[18]);
    let ed = j;
    R[19] !== ei || R[20] !== U
      ? ((N = U(
          ei
            ? "web.watchlist.remove_from_watchlist"
            : "web.watchlist.add_to_watchlist",
        )),
        (R[19] = ei),
        (R[20] = U),
        (R[21] = N))
      : (N = R[21]);
    let eu = ei
        ? "fill-positive text-positive"
        : "fill-none text-text-tertiary hover:text-positive",
      em = W && "animate-pulse";
    return (
      R[22] !== em || R[23] !== eu
        ? ((w = (0, m.c)("h-4 w-4", eu, em)),
          (R[22] = em),
          (R[23] = eu),
          (R[24] = w))
        : (w = R[24]),
      R[25] !== w
        ? ((k = (0, t.jsx)(i.j, { className: w })), (R[25] = w), (R[26] = k))
        : (k = R[26]),
      R[27] !== k || R[28] !== N
        ? ((_ = (0, t.jsx)(s.J, {
            asChild: !0,
            children: (0, t.jsx)("button", {
              onClick: ed,
              className:
                "flex h-6 w-6 items-center justify-center rounded-sm transition-transform hover:scale-110 hover:bg-bg-secondary",
              "aria-label": N,
              children: k,
            }),
          })),
          (R[27] = k),
          (R[28] = N),
          (R[29] = _))
        : (_ = R[29]),
      R[30] !== en ||
      R[31] !== es ||
      R[32] !== Y ||
      R[33] !== eo ||
      R[34] !== ec ||
      R[35] !== Q ||
      R[36] !== U
        ? ((C = Q
            ? (0, t.jsx)(o.f, {
                bookmarks: Y || [],
                bookmarkedItems: es,
                mint: en,
                onBookmarkClick: eo,
                onManageClick: ec,
              })
            : (0, t.jsx)("div", {
                className: "p-3 text-sm text-text-tertiary",
                children: U("web.watchlist.log_in_to_bookmark"),
              })),
          (R[30] = en),
          (R[31] = es),
          (R[32] = Y),
          (R[33] = eo),
          (R[34] = ec),
          (R[35] = Q),
          (R[36] = U),
          (R[37] = C))
        : (C = R[37]),
      R[38] !== A || R[39] !== C
        ? ((S = (0, t.jsx)(s.T, {
            className:
              "w-48 border-border-secondary bg-bg-secondary p-0 text-text-primary",
            align: A,
            side: "bottom",
            children: C,
          })),
          (R[38] = A),
          (R[39] = C),
          (R[40] = S))
        : (S = R[40]),
      R[41] !== L || R[42] !== _ || R[43] !== S
        ? ((T = (0, t.jsx)("div", {
            className: "flex justify-center",
            children: (0, t.jsx)("div", {
              className: "flex-shrink-0",
              onClick: x,
              onMouseDown: p,
              children: (0, t.jsxs)(s.V, {
                open: L,
                onOpenChange: H,
                children: [_, S],
              }),
            }),
          })),
          (R[41] = L),
          (R[42] = _),
          (R[43] = S),
          (R[44] = T))
        : (T = R[44]),
      R[45] !== Y ||
      R[46] !== J ||
      R[47] !== X ||
      R[48] !== K ||
      R[49] !== D ||
      R[50] !== Z
        ? ((I =
            !D &&
            (0, t.jsx)(c.ManageWatchlistDialog, {
              isOpen: K,
              onOpenChange: V,
              bookmarks: Y || [],
              createBookmark: J,
              deleteBookmark: X,
              updateBookmarkName: Z,
            })),
          (R[45] = Y),
          (R[46] = J),
          (R[47] = X),
          (R[48] = K),
          (R[49] = D),
          (R[50] = Z),
          (R[51] = I))
        : (I = R[51]),
      R[52] !== T || R[53] !== I
        ? ((G = (0, t.jsxs)(t.Fragment, { children: [T, I] })),
          (R[52] = T),
          (R[53] = I),
          (R[54] = G))
        : (G = R[54]),
      G
    );
  });
  function f(e, t) {
    return ((e[t.id] = t.bookmark_items), e);
  }
  function x(e) {
    return e.stopPropagation();
  }
  function p(e) {
    return e.stopPropagation();
  }
  ((h.displayName = "BookmarkCell"), e.s(["f", 0, h]));
};
