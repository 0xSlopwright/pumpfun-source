// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    a = e.i(745018),
    l = e.i(439587),
    n = e.i(7284),
    i = e.i(352386);
  e.i(12692);
  var s = e.i(398902),
    o = e.i(182119),
    c = e.i(200165);
  e.s([
    "ManageWatchlistDialog",
    0,
    function (e) {
      let d,
        u,
        m,
        h,
        f,
        x,
        p,
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
        R,
        F,
        P,
        E,
        M,
        D,
        B,
        O,
        $,
        A,
        U,
        q = (0, r.c)(84),
        {
          isOpen: W,
          onOpenChange: z,
          bookmarks: L,
          createBookmark: H,
          deleteBookmark: K,
          updateBookmarkName: V,
        } = e,
        { t: Q } = (0, s.f)(),
        [Y, J] = (0, i.useState)(""),
        [X, Z] = (0, i.useState)(null),
        [ee, et] = (0, i.useState)(""),
        [er, ea] = (0, i.useState)(!1),
        [el, en] = (0, i.useState)(null),
        ei = (0, i.useRef)(null);
      (q[0] !== W
        ? ((d = () => {
            if (!W) return;
            let e = setTimeout(() => {
              ei.current?.focus();
            }, 0);
            return () => clearTimeout(e);
          }),
          (u = [W]),
          (q[0] = W),
          (q[1] = d),
          (q[2] = u))
        : ((d = q[1]), (u = q[2])),
        (0, i.useEffect)(d, u),
        q[3] !== z
          ? ((m = (e) => {
              (e || (Z(null), et("")), z(e));
            }),
            (q[3] = z),
            (q[4] = m))
          : (m = q[4]));
      let es = m;
      q[5] !== H || q[6] !== er || q[7] !== Y
        ? ((h = async () => {
            if (Y.trim() && !er) {
              ea(!0);
              try {
                (await H(Y.trim()), J(""));
              } catch (e) {
                console.error("Failed to create bookmark:", e);
              }
              ea(!1);
            }
          }),
          (q[5] = H),
          (q[6] = er),
          (q[7] = Y),
          (q[8] = h))
        : (h = q[8]);
      let eo = h;
      q[9] !== K || q[10] !== er
        ? ((f = async (e) => {
            if (!er) {
              ea(!0);
              try {
                await K(e);
              } catch (e) {
                console.error("Failed to delete bookmark:", e);
              }
              ea(!1);
            }
          }),
          (q[9] = K),
          (q[10] = er),
          (q[11] = f))
        : (f = q[11]);
      let ec = f;
      q[12] === Symbol.for("react.memo_cache_sentinel")
        ? ((x = (e) => {
            (Z(e.id), et(e.name));
          }),
          (q[12] = x))
        : (x = q[12]);
      let ed = x;
      q[13] !== ee || q[14] !== er || q[15] !== V
        ? ((p = async (e) => {
            if (ee.trim() && !er) {
              ea(!0);
              try {
                (await V(e, ee.trim()), Z(null), et(""));
              } catch (e) {
                console.error("Failed to update bookmark name:", e);
              }
              ea(!1);
            }
          }),
          (q[13] = ee),
          (q[14] = er),
          (q[15] = V),
          (q[16] = p))
        : (p = q[16]);
      let eu = p;
      q[17] === Symbol.for("react.memo_cache_sentinel")
        ? ((v = () => {
            (Z(null), et(""));
          }),
          (q[17] = v))
        : (v = q[17]);
      let em = v;
      q[18] === Symbol.for("react.memo_cache_sentinel")
        ? ((b = (e) => {
            en(e);
          }),
          (q[18] = b))
        : (b = q[18]);
      let eh = b;
      q[19] === Symbol.for("react.memo_cache_sentinel")
        ? ((g = () => {
            en(null);
          }),
          (q[19] = g))
        : (g = q[19]);
      let ef = g;
      q[20] !== es
        ? ((y = () => es(!1)), (q[20] = es), (q[21] = y))
        : (y = q[21]);
      let ex = er && "cursor-not-allowed";
      return (
        q[22] !== ex
          ? ((j = (0, n.U)(
              "absolute right-4 top-4 rounded p-1 transition-colors hover:bg-bg-tertiary",
              ex,
            )),
            (q[22] = ex),
            (q[23] = j))
          : (j = q[23]),
        q[24] === Symbol.for("react.memo_cache_sentinel")
          ? ((N = (0, t.jsx)(a.x6, { className: "size-4 text-text-tertiary" })),
            (q[24] = N))
          : (N = q[24]),
        q[25] !== er || q[26] !== y || q[27] !== j
          ? ((w = (0, t.jsx)("button", {
              onClick: y,
              className: j,
              disabled: er,
              children: N,
            })),
            (q[25] = er),
            (q[26] = y),
            (q[27] = j),
            (q[28] = w))
          : (w = q[28]),
        q[29] !== Q
          ? ((k = Q("web.watchlist.manage_lists")), (q[29] = Q), (q[30] = k))
          : (k = q[30]),
        q[31] !== k
          ? ((_ = (0, t.jsx)(o.F, { className: "mb-2", children: k })),
            (q[31] = k),
            (q[32] = _))
          : (_ = q[32]),
        q[33] !== Q
          ? ((C = Q("web.watchlist.manage_lists_description")),
            (q[33] = Q),
            (q[34] = C))
          : (C = q[34]),
        q[35] !== C
          ? ((S = (0, t.jsx)("p", {
              className: "text-sm text-text-tertiary",
              children: C,
            })),
            (q[35] = C),
            (q[36] = S))
          : (S = q[36]),
        q[37] !== _ || q[38] !== S
          ? ((T = (0, t.jsxs)(o.s, { children: [_, S] })),
            (q[37] = _),
            (q[38] = S),
            (q[39] = T))
          : (T = q[39]),
        q[40] === Symbol.for("react.memo_cache_sentinel")
          ? ((I = (e) => J(e.target.value)), (q[40] = I))
          : (I = q[40]),
        q[41] !== eo || q[42] !== er || q[43] !== Y
          ? ((G = (e) => {
              "Enter" === e.key && Y.trim() && !er && eo();
            }),
            (q[41] = eo),
            (q[42] = er),
            (q[43] = Y),
            (q[44] = G))
          : (G = q[44]),
        q[45] !== Q
          ? ((R = Q("web.watchlist.add_new_list_placeholder")),
            (q[45] = Q),
            (q[46] = R))
          : (R = q[46]),
        q[47] !== er || q[48] !== Y || q[49] !== G || q[50] !== R
          ? ((F = (0, t.jsx)(c.f, {
              ref: ei,
              value: Y,
              onChange: I,
              onKeyDown: G,
              placeholder: R,
              className:
                "flex-1 border-border-tertiary bg-transparent text-text-primary placeholder:text-text-quaternary",
              disabled: er,
            })),
            (q[47] = er),
            (q[48] = Y),
            (q[49] = G),
            (q[50] = R),
            (q[51] = F))
          : (F = q[51]),
        q[52] === Symbol.for("react.memo_cache_sentinel")
          ? ((P = (0, t.jsx)(a.YC, { className: "size-4" })), (q[52] = P))
          : (P = q[52]),
        q[53] !== Q
          ? ((E = Q("web.watchlist.create_new_list")), (q[53] = Q), (q[54] = E))
          : (E = q[54]),
        q[55] !== eo || q[56] !== er || q[57] !== E
          ? ((M = (0, t.jsx)(l.K, {
              onClick: eo,
              isDisabled: er,
              iconStart: P,
              children: E,
            })),
            (q[55] = eo),
            (q[56] = er),
            (q[57] = E),
            (q[58] = M))
          : (M = q[58]),
        q[59] !== F || q[60] !== M
          ? ((D = (0, t.jsxs)("div", {
              className: "flex gap-2",
              children: [F, M],
            })),
            (q[59] = F),
            (q[60] = M),
            (q[61] = D))
          : (D = q[61]),
        q[62] !== L ||
        q[63] !== el ||
        q[64] !== X ||
        q[65] !== ee ||
        q[66] !== ec ||
        q[67] !== eu ||
        q[68] !== er ||
        q[69] !== Q
          ? ((B =
              L && L.map
                ? L.map((e) =>
                    (0, t.jsx)(
                      "div",
                      {
                        className: (0, n.U)(
                          "group flex h-10 items-center justify-between gap-2 rounded p-2",
                          X === e.id && "pl-[3px]",
                          X !== e.id && "hover:bg-bg-tertiary",
                        ),
                        children:
                          X === e.id
                            ? (0, t.jsxs)(t.Fragment, {
                                children: [
                                  (0, t.jsx)(c.f, {
                                    value: ee,
                                    onChange: (e) => et(e.target.value),
                                    onKeyDown: (t) => {
                                      "Enter" === t.key && ee.trim() !== e.name
                                        ? eu(e.id)
                                        : "Escape" === t.key && em();
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
                                        onClick: () => eu(e.id),
                                        className: (0, n.U)(
                                          "rounded p-1 hover:bg-bg-quaternary",
                                          (er || ee.trim() === e.name) &&
                                            "cursor-not-allowed",
                                        ),
                                        disabled: er || ee.trim() === e.name,
                                        children: (0, t.jsx)(a.S7, {
                                          className: (0, n.U)(
                                            "size-4",
                                            ee.trim() === e.name
                                              ? "text-text-quaternary"
                                              : "text-text-accent",
                                          ),
                                        }),
                                      }),
                                      (0, t.jsx)("button", {
                                        onClick: em,
                                        className: (0, n.U)(
                                          "rounded p-1 hover:bg-bg-quaternary",
                                          er && "cursor-not-allowed",
                                        ),
                                        disabled: er,
                                        children: (0, t.jsx)(a.x6, {
                                          className:
                                            "size-4 text-text-tertiary",
                                        }),
                                      }),
                                    ],
                                  }),
                                ],
                              })
                            : el === e.id
                              ? (0, t.jsxs)(t.Fragment, {
                                  children: [
                                    (0, t.jsx)("span", {
                                      className:
                                        "flex h-7 flex-1 items-center px-1 py-0 text-sm text-text-error",
                                      children: Q("web.common.are_you_sure"),
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
                                          children: Q("common.yes"),
                                        }),
                                        (0, t.jsx)("button", {
                                          onClick: ef,
                                          className: (0, n.U)(
                                            "rounded px-2 py-1 text-xs hover:bg-bg-quaternary",
                                            er && "cursor-not-allowed",
                                          ),
                                          disabled: er,
                                          children: Q(
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
                                          ? Q("home.tabs.watchlist")
                                          : e.name,
                                    }),
                                    "default" !== e.name
                                      ? (0, t.jsxs)("div", {
                                          className:
                                            "flex gap-2 opacity-0 transition-opacity group-hover:opacity-100",
                                          children: [
                                            (0, t.jsx)("button", {
                                              onClick: () => ed(e),
                                              className: (0, n.U)(
                                                "rounded p-1 hover:bg-bg-quaternary",
                                                er && "cursor-not-allowed",
                                              ),
                                              disabled: er,
                                              children: (0, t.jsx)(a.yR, {
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
                                              children: (0, t.jsx)(a.bO, {
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
            (q[62] = L),
            (q[63] = el),
            (q[64] = X),
            (q[65] = ee),
            (q[66] = ec),
            (q[67] = eu),
            (q[68] = er),
            (q[69] = Q),
            (q[70] = B))
          : (B = q[70]),
        q[71] !== B
          ? ((O = (0, t.jsx)("div", {
              className: "max-h-[300px] space-y-2 overflow-y-auto py-1",
              children: B,
            })),
            (q[71] = B),
            (q[72] = O))
          : (O = q[72]),
        q[73] !== D || q[74] !== O
          ? (($ = (0, t.jsxs)("div", {
              className: "space-y-4",
              children: [D, O],
            })),
            (q[73] = D),
            (q[74] = O),
            (q[75] = $))
          : ($ = q[75]),
        q[76] !== w || q[77] !== T || q[78] !== $
          ? ((A = (0, t.jsxs)(o.d, {
              className: "max-w-md bg-bg-primary p-4 text-text-primary",
              children: [w, T, $],
            })),
            (q[76] = w),
            (q[77] = T),
            (q[78] = $),
            (q[79] = A))
          : (A = q[79]),
        q[80] !== es || q[81] !== W || q[82] !== A
          ? ((U = (0, t.jsx)(o.N, { open: W, onOpenChange: es, children: A })),
            (q[80] = es),
            (q[81] = W),
            (q[82] = A),
            (q[83] = U))
          : (U = q[83]),
        U
      );
    },
  ]);
};
