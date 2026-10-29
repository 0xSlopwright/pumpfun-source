// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    a = e.i(156207),
    r = e.i(144977),
    n = e.i(93074),
    i = e.i(732486);
  e.s([
    "f",
    0,
    function (e) {
      let l = e + "CollectionProvider",
        [s, o] = (0, a.c)(l),
        [d, c] = s(l, { collectionRef: { current: null }, itemMap: new Map() }),
        u = (e) => {
          let { scope: a, children: r } = e,
            n = t.default.useRef(null),
            l = t.default.useRef(new Map()).current;
          return (0, i.jsx)(d, {
            scope: a,
            itemMap: l,
            collectionRef: n,
            children: r,
          });
        };
      u.displayName = l;
      let f = e + "CollectionSlot",
        m = (0, n.B)(f),
        h = t.default.forwardRef((e, t) => {
          let { scope: a, children: n } = e,
            l = c(f, a),
            s = (0, r.j)(t, l.collectionRef);
          return (0, i.jsx)(m, { ref: s, children: n });
        });
      h.displayName = f;
      let p = e + "CollectionItemSlot",
        g = "data-radix-collection-item",
        w = (0, n.B)(p),
        b = t.default.forwardRef((e, a) => {
          let { scope: n, children: l, ...s } = e,
            o = t.default.useRef(null),
            d = (0, r.j)(a, o),
            u = c(p, n);
          return (
            t.default.useEffect(
              () => (
                u.itemMap.set(o, { ref: o, ...s }),
                () => void u.itemMap.delete(o)
              ),
            ),
            (0, i.jsx)(w, { ...{ [g]: "" }, ref: d, children: l })
          );
        });
      return (
        (b.displayName = p),
        [
          { Provider: u, Slot: h, ItemSlot: b },
          function (a) {
            let r = c(e + "CollectionConsumer", a);
            return t.default.useCallback(() => {
              let e = r.collectionRef.current;
              if (!e) return [];
              let t = Array.from(e.querySelectorAll(`[${g}]`));
              return Array.from(r.itemMap.values()).sort(
                (e, a) => t.indexOf(e.ref.current) - t.indexOf(a.ref.current),
              );
            }, [r.collectionRef, r.itemMap]);
          },
          o,
        ]
      );
    },
  ]);
};
