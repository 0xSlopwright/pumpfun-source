// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    r = e.i(745018),
    n = e.i(426091);
  e.i(12692);
  var a = e.i(398902),
    o = e.i(199995),
    s = e.i(372550),
    l = e.i(607122);
  let d = ["RANKED", "LATEST", "TOP"],
    c = ["open", "closed"],
    u = {
      RANKED: "coin_details.sections.callouts.sort_for_you",
      LATEST: "coin_details.sections.callouts.sort_most_recent",
      TOP: "coin_details.sections.callouts.sort_size",
    },
    m = {
      RANKED: "coin_details.sections.callouts.sort_for_you",
      LATEST: "coin_details.sections.callouts.sort_most_recent",
      TOP: "coin_details.sections.callouts.sort_size_option",
    },
    f = {
      open: "coin_details.sections.callouts.view_open",
      closed: "coin_details.sections.callouts.view_closed",
    };
  var b = e.i(352386),
    p = e.i(78436),
    h = e.i(634103);
  let w = (0, p.$)()(
      (0, h.V)(
        (e) => ({
          view: "open",
          openSort: null,
          setView: (t) => e({ view: t }),
          setOpenSort: (t) => e({ openSort: t }),
        }),
        {
          name: "coin-callouts-feed",
          storage: (0, h.j)(() => localStorage),
          version: 1,
          partialize: (e) => ({ openSort: e.openSort }),
          onRehydrateStorage: () => (e, t) => {
            t && y();
          },
          merge: (e, t) => ({
            ...t,
            openSort: ((e) => {
              if (!e || "object" != typeof e) return null;
              let t = e.openSort;
              return d.some((e) => e === t) ? t : null;
            })(e),
          }),
        },
      ),
    ),
    v = !1,
    g = new Set(),
    y = () => {
      for (let e of ((v = !0), g)) e();
    },
    x = (e) => {
      g.add(e);
      let t = w.persist?.onFinishHydration(e);
      return () => {
        (g.delete(e), t?.());
      };
    },
    k = () => !w.persist || w.persist.hasHydrated() || v,
    C = () => !1,
    S = () => {
      let e = (0, b.useSyncExternalStore)(x, k, C),
        t = w(_);
      return e ? (t ?? "TOP") : "TOP";
    },
    N = () => w(j);
  function _(e) {
    return e.openSort;
  }
  function j(e) {
    return e.view;
  }
  e.s(
    [
      "b",
      0,
      () => {
        let e,
          t = (0, i.c)(3),
          r = N(),
          n = S();
        if (t[0] !== n || t[1] !== r)
          ((e = "closed" === r ? "CLOSED_PNL" : n),
            (t[0] = n),
            (t[1] = r),
            (t[2] = e));
        else e = t[2];
        return e;
      },
      "W",
      0,
      N,
      "G",
      0,
      S,
    ],
    67016,
  );
  var P = e.i(595673);
  function E(e) {
    return e.view;
  }
  function O(e) {
    return e.setView;
  }
  function T(e) {
    return e.setOpenSort;
  }
  let M = {
    strip: o.C,
    row: "flex min-h-9 min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-border-secondary py-1.5",
    compact:
      "flex min-h-8 min-w-0 flex-wrap items-center gap-x-2 gap-y-1 border-b border-border-secondary px-1 pb-1.5",
  };
  e.s(
    [
      "f",
      0,
      function (e) {
        let o,
          b,
          p,
          h,
          v,
          g,
          y,
          x,
          k,
          C,
          N,
          _,
          j,
          A,
          F,
          I,
          R,
          W,
          V = (0, i.c)(26),
          { mint: L, variant: U, className: D } = e,
          z = void 0 === U ? "strip" : U,
          { t: B } = (0, a.f)(),
          {
            view: q,
            sort: H,
            showSortControl: $,
            onChangeView: K,
            onChangeSort: G,
          } = ((N = (0, i.c)(13)),
          (_ = w(E)),
          (j = w(O)),
          (A = w(T)),
          (F = S()),
          N[0] !== L || N[1] !== j
            ? ((x = (e) => {
                let t = w.getState().view;
                e !== t &&
                  ((0, P.PF)({ mint: L, fromValue: t, toValue: e }), j(e));
              }),
              (N[0] = L),
              (N[1] = j),
              (N[2] = x))
            : (x = N[2]),
          (I = x),
          N[3] !== L || N[4] !== A || N[5] !== F
            ? ((k = (e) => {
                let t = w.getState().openSort ?? F;
                e !== t &&
                  ((0, P.au)({ mint: L, fromValue: t, toValue: e }), A(e));
              }),
              (N[3] = L),
              (N[4] = A),
              (N[5] = F),
              (N[6] = k))
            : (k = N[6]),
          (R = k),
          (W = "open" === _),
          N[7] !== R || N[8] !== I || N[9] !== F || N[10] !== W || N[11] !== _
            ? ((C = {
                view: _,
                sort: F,
                showSortControl: W,
                onChangeView: I,
                onChangeSort: R,
              }),
              (N[7] = R),
              (N[8] = I),
              (N[9] = F),
              (N[10] = W),
              (N[11] = _),
              (N[12] = C))
            : (C = N[12]),
          C);
        V[0] !== B
          ? ((o = c.map((e) => ({
              value: e,
              label: (0, t.jsx)("span", {
                "data-testid": `coin-callouts-view-${e}`,
                children: B(f[e]),
              }),
            }))),
            (V[0] = B),
            (V[1] = o))
          : (o = V[1]);
        let Y = o;
        V[2] !== B
          ? ((b = d.map((e) => ({ value: e, label: B(m[e]) }))),
            (V[2] = B),
            (V[3] = b))
          : (b = V[3]);
        let Q = b,
          Z = M[z];
        return (
          V[4] !== D || V[5] !== Z
            ? ((p = (0, n.c)(Z, D)), (V[4] = D), (V[5] = Z), (V[6] = p))
            : (p = V[6]),
          V[7] !== B
            ? ((h = B("coin_details.sections.callouts.title")),
              (V[7] = B),
              (V[8] = h))
            : (h = V[8]),
          V[9] !== K || V[10] !== h || V[11] !== q || V[12] !== Y
            ? ((v = (0, t.jsx)(l.X, {
                density: "terminal",
                "aria-label": h,
                value: q,
                onValueChange: K,
                options: Y,
              })),
              (V[9] = K),
              (V[10] = h),
              (V[11] = q),
              (V[12] = Y),
              (V[13] = v))
            : (v = V[13]),
          V[14] !== G ||
          V[15] !== $ ||
          V[16] !== H ||
          V[17] !== Q ||
          V[18] !== B
            ? ((g = $
                ? (0, t.jsx)(s.f, {
                    density: "terminal",
                    "aria-label": B("common.sort_by"),
                    value: H,
                    label: B(u[H]),
                    onChange: G,
                    options: Q,
                    leading: (0, t.jsx)(r.v_, { "aria-hidden": !0 }),
                    align: "end",
                    className: "ml-auto",
                    "data-testid": "coin-callouts-sort",
                  })
                : null),
              (V[14] = G),
              (V[15] = $),
              (V[16] = H),
              (V[17] = Q),
              (V[18] = B),
              (V[19] = g))
            : (g = V[19]),
          V[20] !== p ||
          V[21] !== v ||
          V[22] !== g ||
          V[23] !== z ||
          V[24] !== q
            ? ((y = (0, t.jsxs)("div", {
                "data-testid": "coin-callouts-feed-controls",
                "data-variant": z,
                "data-view": q,
                className: p,
                children: [v, g],
              })),
              (V[20] = p),
              (V[21] = v),
              (V[22] = g),
              (V[23] = z),
              (V[24] = q),
              (V[25] = y))
            : (y = V[25]),
          y
        );
      },
    ],
    811619,
  );
};
