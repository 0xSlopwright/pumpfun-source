// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    i = e.i(775453),
    r = e.i(156207),
    n = e.i(144977),
    a = e.i(681289),
    o = e.i(732486);
  function s(e) {
    let i = e + "CollectionProvider",
      [s, l] = (0, r.c)(i),
      [d, c] = s(i, { collectionRef: { current: null }, itemMap: new Map() }),
      u = (e) => {
        let { scope: i, children: r } = e,
          n = t.default.useRef(null),
          a = t.default.useRef(new Map()).current;
        return (0, o.jsx)(d, {
          scope: i,
          itemMap: a,
          collectionRef: n,
          children: r,
        });
      };
    u.displayName = i;
    let m = e + "CollectionSlot",
      f = (0, a.f)(m),
      b = t.default.forwardRef((e, t) => {
        let { scope: i, children: r } = e,
          a = c(m, i),
          s = (0, n.j)(t, a.collectionRef);
        return (0, o.jsx)(f, { ref: s, children: r });
      });
    b.displayName = m;
    let p = e + "CollectionItemSlot",
      h = "data-radix-collection-item",
      w = (0, a.f)(p),
      v = t.default.forwardRef((e, i) => {
        let { scope: r, children: a, ...s } = e,
          l = t.default.useRef(null),
          d = (0, n.j)(i, l),
          u = c(p, r);
        return (
          t.default.useEffect(
            () => (
              u.itemMap.set(l, { ref: l, ...s }),
              () => void u.itemMap.delete(l)
            ),
          ),
          (0, o.jsx)(w, { ...{ [h]: "" }, ref: d, children: a })
        );
      });
    return (
      (v.displayName = p),
      [
        { Provider: u, Slot: b, ItemSlot: v },
        function (i) {
          let r = c(e + "CollectionConsumer", i);
          return t.default.useCallback(() => {
            let e = r.collectionRef.current;
            if (!e) return [];
            let t = Array.from(e.querySelectorAll(`[${h}]`));
            return Array.from(r.itemMap.values()).sort(
              (e, i) => t.indexOf(e.ref.current) - t.indexOf(i.ref.current),
            );
          }, [r.collectionRef, r.itemMap]);
        },
        l,
      ]
    );
  }
  e.s(["f", 0, s], 956017);
  var l = e.i(461194),
    d = e.i(362275),
    c = e.i(252960),
    u = e.i(534643),
    m = e.i(770460),
    f = "rovingFocusGroup.onEntryFocus",
    b = { bubbles: !1, cancelable: !0 },
    p = "RovingFocusGroup",
    [h, w, v] = s(p),
    [g, y] = (0, r.c)(p, [v]),
    [x, k] = g(p),
    C = t.forwardRef((e, t) =>
      (0, o.jsx)(h.Provider, {
        scope: e.__scopeRovingFocusGroup,
        children: (0, o.jsx)(h.Slot, {
          scope: e.__scopeRovingFocusGroup,
          children: (0, o.jsx)(S, { ...e, ref: t }),
        }),
      }),
    );
  C.displayName = p;
  var S = t.forwardRef((e, r) => {
      let {
          __scopeRovingFocusGroup: a,
          orientation: s,
          loop: l = !1,
          dir: h,
          currentTabStopId: v,
          defaultCurrentTabStopId: g,
          onCurrentTabStopIdChange: y,
          onEntryFocus: k,
          preventScrollOnEntryFocus: C = !1,
          ...S
        } = e,
        N = t.useRef(null),
        _ = (0, n.j)(r, N),
        j = (0, m.f)(h),
        [E, O] = (0, u.f)({
          prop: v,
          defaultProp: g ?? null,
          onChange: y,
          caller: p,
        }),
        [T, M] = t.useState(!1),
        A = (0, c.f)(k),
        F = w(a),
        I = t.useRef(!1),
        [R, W] = t.useState(0);
      return (
        t.useEffect(() => {
          let e = N.current;
          if (e)
            return (
              e.addEventListener(f, A),
              () => e.removeEventListener(f, A)
            );
        }, [A]),
        (0, o.jsx)(x, {
          scope: a,
          orientation: s,
          dir: j,
          loop: l,
          currentTabStopId: E,
          onItemFocus: t.useCallback((e) => O(e), [O]),
          onItemShiftTab: t.useCallback(() => M(!0), []),
          onFocusableItemAdd: t.useCallback(() => W((e) => e + 1), []),
          onFocusableItemRemove: t.useCallback(() => W((e) => e - 1), []),
          children: (0, o.jsx)(d.V.div, {
            tabIndex: T || 0 === R ? -1 : 0,
            "data-orientation": s,
            ...S,
            ref: _,
            style: { outline: "none", ...e.style },
            onMouseDown: (0, i.f)(e.onMouseDown, () => {
              I.current = !0;
            }),
            onFocus: (0, i.f)(e.onFocus, (e) => {
              let t = !I.current;
              if (e.target === e.currentTarget && t && !T) {
                let t = new CustomEvent(f, b);
                if ((e.currentTarget.dispatchEvent(t), !t.defaultPrevented)) {
                  let e = F().filter((e) => e.focusable);
                  P(
                    [e.find((e) => e.active), e.find((e) => e.id === E), ...e]
                      .filter(Boolean)
                      .map((e) => e.ref.current),
                    C,
                  );
                }
              }
              I.current = !1;
            }),
            onBlur: (0, i.f)(e.onBlur, () => M(!1)),
          }),
        })
      );
    }),
    N = "RovingFocusGroupItem",
    _ = t.forwardRef((e, r) => {
      let {
          __scopeRovingFocusGroup: n,
          focusable: a = !0,
          active: s = !1,
          tabStopId: c,
          children: u,
          ...m
        } = e,
        f = (0, l.f)(),
        b = c || f,
        p = k(N, n),
        v = p.currentTabStopId === b,
        g = w(n),
        {
          onFocusableItemAdd: y,
          onFocusableItemRemove: x,
          currentTabStopId: C,
        } = p;
      return (
        t.useEffect(() => {
          if (a) return (y(), () => x());
        }, [a, y, x]),
        (0, o.jsx)(h.ItemSlot, {
          scope: n,
          id: b,
          focusable: a,
          active: s,
          children: (0, o.jsx)(d.V.span, {
            tabIndex: v ? 0 : -1,
            "data-orientation": p.orientation,
            ...m,
            ref: r,
            onMouseDown: (0, i.f)(e.onMouseDown, (e) => {
              a ? p.onItemFocus(b) : e.preventDefault();
            }),
            onFocus: (0, i.f)(e.onFocus, () => p.onItemFocus(b)),
            onKeyDown: (0, i.f)(e.onKeyDown, (e) => {
              if ("Tab" === e.key && e.shiftKey) return void p.onItemShiftTab();
              if (e.target !== e.currentTarget) return;
              let t = (function (e, t, i) {
                var r;
                let n =
                  ((r = e.key),
                  "rtl" !== i
                    ? r
                    : "ArrowLeft" === r
                      ? "ArrowRight"
                      : "ArrowRight" === r
                        ? "ArrowLeft"
                        : r);
                if (
                  !(
                    "vertical" === t && ["ArrowLeft", "ArrowRight"].includes(n)
                  ) &&
                  !("horizontal" === t && ["ArrowUp", "ArrowDown"].includes(n))
                )
                  return j[n];
              })(e, p.orientation, p.dir);
              if (void 0 !== t) {
                if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
                e.preventDefault();
                let n = g()
                  .filter((e) => e.focusable)
                  .map((e) => e.ref.current);
                if ("last" === t) n.reverse();
                else if ("prev" === t || "next" === t) {
                  var i, r;
                  "prev" === t && n.reverse();
                  let a = n.indexOf(e.currentTarget);
                  n = p.loop
                    ? ((i = n),
                      (r = a + 1),
                      i.map((e, t) => i[(r + t) % i.length]))
                    : n.slice(a + 1);
                }
                setTimeout(() => P(n));
              }
            }),
            children:
              "function" == typeof u
                ? u({ isCurrentTabStop: v, hasTabStop: null != C })
                : u,
          }),
        })
      );
    });
  _.displayName = N;
  var j = {
    ArrowLeft: "prev",
    ArrowUp: "prev",
    ArrowRight: "next",
    ArrowDown: "next",
    PageUp: "first",
    Home: "first",
    PageDown: "last",
    End: "last",
  };
  function P(e, t = !1) {
    let i = document.activeElement;
    for (let r of e)
      if (
        r === i ||
        (r.focus({ preventScroll: t }), document.activeElement !== i)
      )
        return;
  }
  e.s(["M", 0, _, "F", 0, C, "B", 0, y], 291132);
};
