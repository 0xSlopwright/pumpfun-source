// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    i = e.i(745018),
    a = e.i(439587),
    n = e.i(7284),
    l = e.i(352386);
  e.i(12692);
  var s = e.i(398902),
    o = e.i(182119),
    c = e.i(200165);
  e.s([
    "ManageWatchlistDialog",
    0,
    function (e) {
      let m,
        d,
        u,
        h,
        f,
        x,
        p,
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
        A,
        z,
        W,
        F,
        R,
        E,
        D,
        P,
        G,
        O,
        $,
        B = (0, r.c)(84),
        {
          isOpen: U,
          onOpenChange: V,
          bookmarks: L,
          createBookmark: H,
          deleteBookmark: q,
          updateBookmarkName: K,
        } = e,
        { t: Y } = (0, s.f)(),
        [X, J] = (0, l.useState)(""),
        [Q, Z] = (0, l.useState)(null),
        [ee, et] = (0, l.useState)(""),
        [er, ei] = (0, l.useState)(!1),
        [ea, en] = (0, l.useState)(null),
        el = (0, l.useRef)(null);
      (B[0] !== U
        ? ((m = () => {
            if (!U) return;
            let e = setTimeout(() => {
              el.current?.focus();
            }, 0);
            return () => clearTimeout(e);
          }),
          (d = [U]),
          (B[0] = U),
          (B[1] = m),
          (B[2] = d))
        : ((m = B[1]), (d = B[2])),
        (0, l.useEffect)(m, d),
        B[3] !== V
          ? ((u = (e) => {
              (e || (Z(null), et("")), V(e));
            }),
            (B[3] = V),
            (B[4] = u))
          : (u = B[4]));
      let es = u;
      B[5] !== H || B[6] !== er || B[7] !== X
        ? ((h = async () => {
            if (X.trim() && !er) {
              ei(!0);
              try {
                (await H(X.trim()), J(""));
              } catch (e) {
                console.error("Failed to create bookmark:", e);
              }
              ei(!1);
            }
          }),
          (B[5] = H),
          (B[6] = er),
          (B[7] = X),
          (B[8] = h))
        : (h = B[8]);
      let eo = h;
      B[9] !== q || B[10] !== er
        ? ((f = async (e) => {
            if (!er) {
              ei(!0);
              try {
                await q(e);
              } catch (e) {
                console.error("Failed to delete bookmark:", e);
              }
              ei(!1);
            }
          }),
          (B[9] = q),
          (B[10] = er),
          (B[11] = f))
        : (f = B[11]);
      let ec = f;
      B[12] === Symbol.for("react.memo_cache_sentinel")
        ? ((x = (e) => {
            (Z(e.id), et(e.name));
          }),
          (B[12] = x))
        : (x = B[12]);
      let em = x;
      B[13] !== ee || B[14] !== er || B[15] !== K
        ? ((p = async (e) => {
            if (ee.trim() && !er) {
              ei(!0);
              try {
                (await K(e, ee.trim()), Z(null), et(""));
              } catch (e) {
                console.error("Failed to update bookmark name:", e);
              }
              ei(!1);
            }
          }),
          (B[13] = ee),
          (B[14] = er),
          (B[15] = K),
          (B[16] = p))
        : (p = B[16]);
      let ed = p;
      B[17] === Symbol.for("react.memo_cache_sentinel")
        ? ((g = () => {
            (Z(null), et(""));
          }),
          (B[17] = g))
        : (g = B[17]);
      let eu = g;
      B[18] === Symbol.for("react.memo_cache_sentinel")
        ? ((v = (e) => {
            en(e);
          }),
          (B[18] = v))
        : (v = B[18]);
      let eh = v;
      B[19] === Symbol.for("react.memo_cache_sentinel")
        ? ((b = () => {
            en(null);
          }),
          (B[19] = b))
        : (b = B[19]);
      let ef = b;
      B[20] !== es
        ? ((y = () => es(!1)), (B[20] = es), (B[21] = y))
        : (y = B[21]);
      let ex = er && "cursor-not-allowed";
      return (
        B[22] !== ex
          ? ((w = (0, n.U)(
              "absolute right-4 top-4 rounded p-1 transition-colors hover:bg-bg-tertiary",
              ex,
            )),
            (B[22] = ex),
            (B[23] = w))
          : (w = B[23]),
        B[24] === Symbol.for("react.memo_cache_sentinel")
          ? ((j = (0, t.jsx)(i.x6, { className: "size-4 text-text-tertiary" })),
            (B[24] = j))
          : (j = B[24]),
        B[25] !== er || B[26] !== y || B[27] !== w
          ? ((N = (0, t.jsx)("button", {
              onClick: y,
              className: w,
              disabled: er,
              children: j,
            })),
            (B[25] = er),
            (B[26] = y),
            (B[27] = w),
            (B[28] = N))
          : (N = B[28]),
        B[29] !== Y
          ? ((_ = Y("web.watchlist.manage_lists")), (B[29] = Y), (B[30] = _))
          : (_ = B[30]),
        B[31] !== _
          ? ((k = (0, t.jsx)(o.F, { className: "mb-2", children: _ })),
            (B[31] = _),
            (B[32] = k))
          : (k = B[32]),
        B[33] !== Y
          ? ((S = Y("web.watchlist.manage_lists_description")),
            (B[33] = Y),
            (B[34] = S))
          : (S = B[34]),
        B[35] !== S
          ? ((C = (0, t.jsx)("p", {
              className: "text-sm text-text-tertiary",
              children: S,
            })),
            (B[35] = S),
            (B[36] = C))
          : (C = B[36]),
        B[37] !== k || B[38] !== C
          ? ((T = (0, t.jsxs)(o.s, { children: [k, C] })),
            (B[37] = k),
            (B[38] = C),
            (B[39] = T))
          : (T = B[39]),
        B[40] === Symbol.for("react.memo_cache_sentinel")
          ? ((I = (e) => J(e.target.value)), (B[40] = I))
          : (I = B[40]),
        B[41] !== eo || B[42] !== er || B[43] !== X
          ? ((M = (e) => {
              "Enter" === e.key && X.trim() && !er && eo();
            }),
            (B[41] = eo),
            (B[42] = er),
            (B[43] = X),
            (B[44] = M))
          : (M = B[44]),
        B[45] !== Y
          ? ((A = Y("web.watchlist.add_new_list_placeholder")),
            (B[45] = Y),
            (B[46] = A))
          : (A = B[46]),
        B[47] !== er || B[48] !== X || B[49] !== M || B[50] !== A
          ? ((z = (0, t.jsx)(c.f, {
              ref: el,
              value: X,
              onChange: I,
              onKeyDown: M,
              placeholder: A,
              className:
                "flex-1 border-border-tertiary bg-transparent text-text-primary placeholder:text-text-quaternary",
              disabled: er,
            })),
            (B[47] = er),
            (B[48] = X),
            (B[49] = M),
            (B[50] = A),
            (B[51] = z))
          : (z = B[51]),
        B[52] === Symbol.for("react.memo_cache_sentinel")
          ? ((W = (0, t.jsx)(i.YC, { className: "size-4" })), (B[52] = W))
          : (W = B[52]),
        B[53] !== Y
          ? ((F = Y("web.watchlist.create_new_list")), (B[53] = Y), (B[54] = F))
          : (F = B[54]),
        B[55] !== eo || B[56] !== er || B[57] !== F
          ? ((R = (0, t.jsx)(a.K, {
              onClick: eo,
              isDisabled: er,
              iconStart: W,
              children: F,
            })),
            (B[55] = eo),
            (B[56] = er),
            (B[57] = F),
            (B[58] = R))
          : (R = B[58]),
        B[59] !== z || B[60] !== R
          ? ((E = (0, t.jsxs)("div", {
              className: "flex gap-2",
              children: [z, R],
            })),
            (B[59] = z),
            (B[60] = R),
            (B[61] = E))
          : (E = B[61]),
        B[62] !== L ||
        B[63] !== ea ||
        B[64] !== Q ||
        B[65] !== ee ||
        B[66] !== ec ||
        B[67] !== ed ||
        B[68] !== er ||
        B[69] !== Y
          ? ((D =
              L && L.map
                ? L.map((e) =>
                    (0, t.jsx)(
                      "div",
                      {
                        className: (0, n.U)(
                          "group flex h-10 items-center justify-between gap-2 rounded p-2",
                          Q === e.id && "pl-[3px]",
                          Q !== e.id && "hover:bg-bg-tertiary",
                        ),
                        children:
                          Q === e.id
                            ? (0, t.jsxs)(t.Fragment, {
                                children: [
                                  (0, t.jsx)(c.f, {
                                    value: ee,
                                    onChange: (e) => et(e.target.value),
                                    onKeyDown: (t) => {
                                      "Enter" === t.key && ee.trim() !== e.name
                                        ? ed(e.id)
                                        : "Escape" === t.key && eu();
                                    },
                                    className:
                                      "flex-1 border-border-tertiary bg-transparent py-0 pl-[8px] text-sm text-text-primary",
                                    autoFocus: !0,
                                    disabled: er,
                                  }),
                                  (0, t.jsxs)("div", {
                                    className: "flex gap-2",
                                    children: [
                                      (0, t.jsx)("button", {
                                        onClick: () => ed(e.id),
                                        className: (0, n.U)(
                                          "rounded p-1 hover:bg-bg-quaternary",
                                          (er || ee.trim() === e.name) &&
                                            "cursor-not-allowed",
                                        ),
                                        disabled: er || ee.trim() === e.name,
                                        children: (0, t.jsx)(i.S7, {
                                          className: (0, n.U)(
                                            "size-4",
                                            ee.trim() === e.name
                                              ? "text-text-quaternary"
                                              : "text-text-accent",
                                          ),
                                        }),
                                      }),
                                      (0, t.jsx)("button", {
                                        onClick: eu,
                                        className: (0, n.U)(
                                          "rounded p-1 hover:bg-bg-quaternary",
                                          er && "cursor-not-allowed",
                                        ),
                                        disabled: er,
                                        children: (0, t.jsx)(i.x6, {
                                          className:
                                            "size-4 text-text-tertiary",
                                        }),
                                      }),
                                    ],
                                  }),
                                ],
                              })
                            : ea === e.id
                              ? (0, t.jsxs)(t.Fragment, {
                                  children: [
                                    (0, t.jsx)("span", {
                                      className:
                                        "flex h-7 flex-1 items-center px-1 py-0 text-sm text-text-error",
                                      children: Y("web.common.are_you_sure"),
                                    }),
                                    (0, t.jsxs)("div", {
                                      className: "flex gap-2",
                                      children: [
                                        (0, t.jsx)("button", {
                                          onClick: () => ec(e.id),
                                          className: (0, n.U)(
                                            "rounded bg-bg-error px-2 py-1 text-xs text-[var(--color-text-on-error)] hover:opacity-90",
                                            er &&
                                              "cursor-not-allowed opacity-50",
                                          ),
                                          disabled: er,
                                          children: Y("common.yes"),
                                        }),
                                        (0, t.jsx)("button", {
                                          onClick: ef,
                                          className: (0, n.U)(
                                            "rounded px-2 py-1 text-xs hover:bg-bg-quaternary",
                                            er && "cursor-not-allowed",
                                          ),
                                          disabled: er,
                                          children: Y(
                                            "web.watchlist.no_cancel",
                                          ),
                                        }),
                                      ],
                                    }),
                                  ],
                                })
                              : (0, t.jsxs)(t.Fragment, {
                                  children: [
                                    (0, t.jsx)("span", {
                                      className:
                                        "flex h-7 flex-1 items-center px-1 py-0 text-sm",
                                      children:
                                        "default" === e.name
                                          ? Y("home.tabs.watchlist")
                                          : e.name,
                                    }),
                                    "default" !== e.name
                                      ? (0, t.jsxs)("div", {
                                          className:
                                            "flex gap-2 opacity-0 transition-opacity group-hover:opacity-100",
                                          children: [
                                            (0, t.jsx)("button", {
                                              onClick: () => em(e),
                                              className: (0, n.U)(
                                                "rounded p-1 hover:bg-bg-quaternary",
                                                er && "cursor-not-allowed",
                                              ),
                                              disabled: er,
                                              children: (0, t.jsx)(i.yR, {
                                                className:
                                                  "size-4 text-text-tertiary",
                                              }),
                                            }),
                                            (0, t.jsx)("button", {
                                              onClick: () => eh(e.id),
                                              className: (0, n.U)(
                                                "rounded p-1 hover:bg-bg-quaternary",
                                                er && "cursor-not-allowed",
                                              ),
                                              disabled: er,
                                              children: (0, t.jsx)(i.bO, {
                                                className:
                                                  "size-4 text-text-error",
                                              }),
                                            }),
                                          ],
                                        })
                                      : null,
                                  ],
                                }),
                      },
                      e.id,
                    ),
                  )
                : null),
            (B[62] = L),
            (B[63] = ea),
            (B[64] = Q),
            (B[65] = ee),
            (B[66] = ec),
            (B[67] = ed),
            (B[68] = er),
            (B[69] = Y),
            (B[70] = D))
          : (D = B[70]),
        B[71] !== D
          ? ((P = (0, t.jsx)("div", {
              className: "max-h-[300px] space-y-2 overflow-y-auto py-1",
              children: D,
            })),
            (B[71] = D),
            (B[72] = P))
          : (P = B[72]),
        B[73] !== E || B[74] !== P
          ? ((G = (0, t.jsxs)("div", {
              className: "space-y-4",
              children: [E, P],
            })),
            (B[73] = E),
            (B[74] = P),
            (B[75] = G))
          : (G = B[75]),
        B[76] !== N || B[77] !== T || B[78] !== G
          ? ((O = (0, t.jsxs)(o.d, {
              className: "max-w-md bg-bg-primary p-4 text-text-primary",
              children: [N, T, G],
            })),
            (B[76] = N),
            (B[77] = T),
            (B[78] = G),
            (B[79] = O))
          : (O = B[79]),
        B[80] !== es || B[81] !== U || B[82] !== O
          ? (($ = (0, t.jsx)(o.N, { open: U, onOpenChange: es, children: O })),
            (B[80] = es),
            (B[81] = U),
            (B[82] = O),
            (B[83] = $))
          : ($ = B[83]),
        $
      );
    },
  ]);
};
