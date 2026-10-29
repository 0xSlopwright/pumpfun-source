// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    l = e.i(574472),
    a = e.i(132838),
    s = e.i(606933),
    r = e.i(352386);
  e.i(12692);
  var i = e.i(398902),
    n = e.i(63289),
    o = e.i(258182),
    c = e.i(408750);
  let d = ["callouts", "home-feed"],
    u = ["callouts", "following-alerts"],
    m = ["callouts", "alerts-feed-rail"],
    p = (e, t, l) => {
      if (!e?.length) return e;
      let a = !1,
        s = e.map((e) =>
          e.id !== t
            ? e
            : ((a = !0), { ...e, likeCount: Math.max(e.likeCount + l, 0) }),
        );
      return a ? s : e;
    },
    x = (e, t, l) => {
      if (!e?.pages?.length) return e;
      let a = !1,
        s = e.pages.map((e) => {
          if (!e.items?.length) return e;
          let s = !1,
            r = e.items.map((e) => {
              let a = e;
              if (e.callout) {
                let s = p(e.callout.updates, t, l);
                s !== e.callout.updates &&
                  (a = { ...a, callout: { ...e.callout, updates: s } });
              }
              let r = e.reply,
                i = r?.callout,
                n = i?.callout;
              if (r && i && n) {
                let e = p(n.updates, t, l);
                e !== n.updates &&
                  (a = {
                    ...a,
                    reply: {
                      ...r,
                      callout: { ...i, callout: { ...n, updates: e } },
                    },
                  });
              }
              return (a !== e && (s = !0), a);
            });
          return s ? ((a = !0), { ...e, items: r }) : e;
        });
      return a ? { ...e, pages: s } : e;
    };
  function f(e, t) {
    let { updateId: l, delta: a } = t;
    for (let t of (e.setQueriesData({ queryKey: d }, (e) =>
      ((e, t, l) => {
        if (!e?.coins?.length) return e;
        let a = !1,
          s = e.coins.map((e) => {
            let s = e.position,
              r = s?.callout;
            if (!s || !r) return e;
            let i = p(r.updates, t, l);
            return i === r.updates
              ? e
              : ((a = !0),
                { ...e, position: { ...s, callout: { ...r, updates: i } } });
          });
        return a ? { ...e, coins: s } : e;
      })(e, l, a),
    ),
    [u, m]))
      e.setQueriesData({ queryKey: t }, (e) => x(e, l, a));
  }
  var h = e.i(595673),
    g = e.i(198825);
  e.s(
    [
      "f",
      0,
      function (e) {
        let d,
          u,
          m,
          p,
          x,
          y,
          b,
          v = (0, t.c)(34),
          {
            mint: w,
            calloutId: j,
            replyId: _,
            likeCount: k,
            likedByViewer: N,
            surface: I,
          } = e,
          { t: C } = (0, i.f)(),
          S = (0, s.useQueryClient)(),
          { address: A } = (0, l.F)(),
          { setShowWallet: U } = (0, g.useConnectWallet)();
        (v[0] !== _
          ? ((d = (e) => (0, c.K)({ messageId: _, liked: e })),
            (v[0] = _),
            (v[1] = d))
          : (d = v[1]),
          v[2] !== j || v[3] !== w || v[4] !== S || v[5] !== _
            ? ((u = async (e) => {
                let t = (0, o.o)(w, j);
                await S.cancelQueries({ queryKey: t });
                let l = S.getQueriesData({ queryKey: t }),
                  a = e ? 1 : -1;
                for (let [t, s] of l)
                  s &&
                    S.setQueryData(
                      t,
                      s.map((t) =>
                        t.replyId === _
                          ? {
                              ...t,
                              likedByViewer: e,
                              likeCount: Math.max((t.likeCount ?? 0) + a, 0),
                            }
                          : t,
                      ),
                    );
                let s = (0, o.j)(_, e);
                return (
                  (0, o.K)(_, a),
                  f(S, { updateId: _, delta: a }),
                  { previousEntries: l, previousOverride: s }
                );
              }),
              (v[2] = j),
              (v[3] = w),
              (v[4] = S),
              (v[5] = _),
              (v[6] = u))
            : (u = v[6]),
          v[7] !== S || v[8] !== _ || v[9] !== C
            ? ((m = (e, t, l) => {
                for (let [e, t] of l?.previousEntries ?? [])
                  S.setQueryData(e, t);
                (l && (0, o.w)(_, l.previousOverride),
                  (0, o.K)(_, t ? -1 : 1),
                  f(S, { updateId: _, delta: t ? -1 : 1 }),
                  n.c.error(C("web.callouts.like_update_failed")));
              }),
              (v[7] = S),
              (v[8] = _),
              (v[9] = C),
              (v[10] = m))
            : (m = v[10]),
          v[11] !== j || v[12] !== w || v[13] !== S
            ? ((p = () => {
                S.invalidateQueries({ queryKey: (0, o.o)(w, j) });
              }),
              (v[11] = j),
              (v[12] = w),
              (v[13] = S),
              (v[14] = p))
            : (p = v[14]),
          v[15] !== d || v[16] !== u || v[17] !== m || v[18] !== p
            ? ((x = { mutationFn: d, onMutate: u, onError: m, onSettled: p }),
              (v[15] = d),
              (v[16] = u),
              (v[17] = m),
              (v[18] = p),
              (v[19] = x))
            : (x = v[19]));
        let L = (0, a.f)(x),
          z = (0, r.useRef)(!1);
        v[20] !== N ||
        v[21] !== w ||
        v[22] !== L ||
        v[23] !== _ ||
        v[24] !== U ||
        v[25] !== I ||
        v[26] !== C ||
        v[27] !== A
          ? ((y = () => {
              if (z.current || L.isPending) return;
              if (!A) return void U(!0);
              if (_.startsWith("pending-"))
                return void (0, n.c)(C("web.callouts.update_still_posting"));
              z.current = !0;
              let e = !N;
              L.mutate(e, {
                onSuccess: () => {
                  (0, h.tu)({ mint: w, replyId: _, isLiked: e, surface: I });
                },
                onSettled: () => {
                  z.current = !1;
                },
              });
            }),
            (v[20] = N),
            (v[21] = w),
            (v[22] = L),
            (v[23] = _),
            (v[24] = U),
            (v[25] = I),
            (v[26] = C),
            (v[27] = A),
            (v[28] = y))
          : (y = v[28]);
        let P = y;
        return (
          v[29] !== k || v[30] !== N || v[31] !== L.isPending || v[32] !== P
            ? ((b = {
                likeCount: k,
                isLiked: N,
                isBusy: L.isPending,
                toggle: P,
              }),
              (v[29] = k),
              (v[30] = N),
              (v[31] = L.isPending),
              (v[32] = P),
              (v[33] = b))
            : (b = v[33]),
          b
        );
      },
    ],
    428189,
  );
};
