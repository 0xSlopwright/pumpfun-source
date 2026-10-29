// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    i = e.i(574472),
    a = e.i(352386);
  e.i(12692);
  var n = e.i(398902),
    l = e.i(56267),
    s = e.i(66732),
    o = e.i(887827),
    c = e.i(510021),
    m = e.i(960107),
    d = e.i(300157),
    u = e.i(338319);
  let h = (0, a.memo)((e) => {
    let h,
      g,
      v,
      b,
      y,
      w,
      j,
      N,
      _,
      k,
      S,
      C,
      T,
      I,
      M,
      A = (0, r.c)(55),
      {
        coin: z,
        isBookmarked: W,
        addToBookmark: F,
        removeFromBookmark: R,
        onManageWatchlistClick: E,
        position: D,
        analytics: P,
        align: G,
      } = e,
      O = void 0 === G ? "end" : G,
      { t: $ } = (0, n.f)(),
      { decodedJwt: B } = (0, i.F)(),
      [U, V] = (0, a.useState)(!1),
      [L, H] = (0, a.useState)(!1),
      [q, K] = (0, a.useState)(!1);
    B?.address;
    let Y = !!B?.address,
      {
        bookmarks: X,
        createBookmark: J,
        deleteBookmark: Q,
        updateBookmarkName: Z,
        checkIfCoinIsBookmarked: ee,
        addToBookmark: et,
        removeFromBookmark: er,
      } = (0, m.j)(!1, Y),
      ei = F ?? et,
      ea = R ?? er;
    A[0] !== z.chain_id || A[1] !== z.mint
      ? ((h = (0, d.y)({ mint: z.mint, chainId: z.chain_id })),
        (A[0] = z.chain_id),
        (A[1] = z.mint),
        (A[2] = h))
      : (h = A[2]);
    let en = h;
    A[3] !== en || A[4] !== ee
      ? ((g = ee(en)), (A[3] = en), (A[4] = ee), (A[5] = g))
      : (g = A[5]);
    let el = g ?? W;
    A[6] !== X
      ? ((v = X?.reduce(f, {}) || {}), (A[6] = X), (A[7] = v))
      : (v = A[7]);
    let es = v;
    A[8] !== ei ||
    A[9] !== P ||
    A[10] !== en ||
    A[11] !== es ||
    A[12] !== z.mint ||
    A[13] !== D ||
    A[14] !== ea
      ? ((b = (e) => {
          let t = es[e];
          ((0, m.w)(t, en)
            ? (P && void 0 !== D && P.trackBookmarkToggle(z.mint, "remove", D),
              ea((0, m.T)(t, en), e))
            : (P && void 0 !== D && P.trackBookmarkToggle(z.mint, "add", D),
              V(!0),
              ei(en, e),
              setTimeout(() => V(!1), 600)),
            H(!1));
        }),
        (A[8] = ei),
        (A[9] = P),
        (A[10] = en),
        (A[11] = es),
        (A[12] = z.mint),
        (A[13] = D),
        (A[14] = ea),
        (A[15] = b))
      : (b = A[15]);
    let eo = b;
    A[16] !== E
      ? ((y = () => {
          (E ? E() : K(!0), H(!1));
        }),
        (A[16] = E),
        (A[17] = y))
      : (y = A[17]);
    let ec = y;
    A[18] === Symbol.for("react.memo_cache_sentinel")
      ? ((w = (e) => {
          (e.preventDefault(), e.stopPropagation(), H(!0));
        }),
        (A[18] = w))
      : (w = A[18]);
    let em = w;
    A[19] !== el || A[20] !== $
      ? ((j = $(
          el
            ? "web.watchlist.remove_from_watchlist"
            : "web.watchlist.add_to_watchlist",
        )),
        (A[19] = el),
        (A[20] = $),
        (A[21] = j))
      : (j = A[21]);
    let ed = el
        ? "fill-positive text-positive"
        : "fill-none text-text-tertiary hover:text-positive",
      eu = U && "animate-pulse";
    return (
      A[22] !== eu || A[23] !== ed
        ? ((N = (0, u.c)("h-4 w-4", ed, eu)),
          (A[22] = eu),
          (A[23] = ed),
          (A[24] = N))
        : (N = A[24]),
      A[25] !== N
        ? ((_ = (0, t.jsx)(l.j, { className: N })), (A[25] = N), (A[26] = _))
        : (_ = A[26]),
      A[27] !== _ || A[28] !== j
        ? ((k = (0, t.jsx)(s.J, {
            asChild: !0,
            children: (0, t.jsx)("button", {
              onClick: em,
              className:
                "flex h-6 w-6 items-center justify-center rounded-sm transition-transform hover:scale-110 hover:bg-bg-secondary",
              "aria-label": j,
              children: _,
            }),
          })),
          (A[27] = _),
          (A[28] = j),
          (A[29] = k))
        : (k = A[29]),
      A[30] !== en ||
      A[31] !== es ||
      A[32] !== X ||
      A[33] !== eo ||
      A[34] !== ec ||
      A[35] !== Y ||
      A[36] !== $
        ? ((S = Y
            ? (0, t.jsx)(o.f, {
                bookmarks: X || [],
                bookmarkedItems: es,
                mint: en,
                onBookmarkClick: eo,
                onManageClick: ec,
              })
            : (0, t.jsx)("div", {
                className: "p-3 text-sm text-text-tertiary",
                children: $("web.watchlist.log_in_to_bookmark"),
              })),
          (A[30] = en),
          (A[31] = es),
          (A[32] = X),
          (A[33] = eo),
          (A[34] = ec),
          (A[35] = Y),
          (A[36] = $),
          (A[37] = S))
        : (S = A[37]),
      A[38] !== O || A[39] !== S
        ? ((C = (0, t.jsx)(s.T, {
            className:
              "w-48 border-border-secondary bg-bg-secondary p-0 text-text-primary",
            align: O,
            side: "bottom",
            children: S,
          })),
          (A[38] = O),
          (A[39] = S),
          (A[40] = C))
        : (C = A[40]),
      A[41] !== L || A[42] !== k || A[43] !== C
        ? ((T = (0, t.jsx)("div", {
            className: "flex justify-center",
            children: (0, t.jsx)("div", {
              className: "flex-shrink-0",
              onClick: x,
              onMouseDown: p,
              children: (0, t.jsxs)(s.V, {
                open: L,
                onOpenChange: H,
                children: [k, C],
              }),
            }),
          })),
          (A[41] = L),
          (A[42] = k),
          (A[43] = C),
          (A[44] = T))
        : (T = A[44]),
      A[45] !== X ||
      A[46] !== J ||
      A[47] !== Q ||
      A[48] !== q ||
      A[49] !== E ||
      A[50] !== Z
        ? ((I =
            !E &&
            (0, t.jsx)(c.ManageWatchlistDialog, {
              isOpen: q,
              onOpenChange: K,
              bookmarks: X || [],
              createBookmark: J,
              deleteBookmark: Q,
              updateBookmarkName: Z,
            })),
          (A[45] = X),
          (A[46] = J),
          (A[47] = Q),
          (A[48] = q),
          (A[49] = E),
          (A[50] = Z),
          (A[51] = I))
        : (I = A[51]),
      A[52] !== T || A[53] !== I
        ? ((M = (0, t.jsxs)(t.Fragment, { children: [T, I] })),
          (A[52] = T),
          (A[53] = I),
          (A[54] = M))
        : (M = A[54]),
      M
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
