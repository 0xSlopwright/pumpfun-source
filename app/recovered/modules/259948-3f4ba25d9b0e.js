// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    a = e.i(527069),
    r = e.i(775453),
    n = e.i(144977),
    i = e.i(156207),
    l = e.i(534643),
    s = e.i(770460),
    o = e.i(337755),
    d = e.i(853233),
    c = e.i(556872),
    u = e.i(357784),
    f = e.i(732486),
    m = ["PageUp", "PageDown"],
    h = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
    p = {
      "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
      "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
      "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
      "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"],
    },
    g = "Slider",
    [w, b, y] = (0, u.f)(g),
    [v, x] = (0, i.c)(g, [y]),
    [_, S] = v(g),
    j = t.forwardRef((e, n) => {
      let {
          name: i,
          min: s = 0,
          max: o = 100,
          step: d = 1,
          orientation: c = "horizontal",
          disabled: u = !1,
          minStepsBetweenThumbs: p = 0,
          defaultValue: g = [s],
          value: b,
          onValueChange: y = () => {},
          onValueCommit: v = () => {},
          inverted: x = !1,
          form: S,
          ...j
        } = e,
        N = t.useRef(new Set()),
        k = t.useRef(0),
        C = "horizontal" === c,
        [T = [], R] = (0, l.f)({
          prop: b,
          defaultProp: g,
          onChange: (e) => {
            let t = [...N.current];
            (t[k.current]?.focus(), y(e));
          },
        }),
        P = t.useRef(T);
      function M(e, t, { commit: r } = { commit: !1 }) {
        let n,
          i = (String(d).split(".")[1] || "").length,
          l =
            Math.round(
              (Math.round((e - s) / d) * d + s) * (n = Math.pow(10, i)),
            ) / n,
          c = (0, a.f)(l, [s, o]);
        R((e = []) => {
          let a = (function (e = [], t, a) {
            let r = [...e];
            return ((r[a] = t), r.sort((e, t) => e - t));
          })(e, c, t);
          if (
            !(function (e, t) {
              if (t > 0)
                return (
                  Math.min(...e.slice(0, -1).map((t, a) => e[a + 1] - t)) >= t
                );
              return !0;
            })(a, p * d)
          )
            return e;
          {
            k.current = a.indexOf(c);
            let t = String(a) !== String(e);
            return (t && r && v(a), t ? a : e);
          }
        });
      }
      return (0, f.jsx)(_, {
        scope: e.__scopeSlider,
        name: i,
        disabled: u,
        min: s,
        max: o,
        valueIndexToChangeRef: k,
        thumbs: N.current,
        values: T,
        orientation: c,
        form: S,
        children: (0, f.jsx)(w.Provider, {
          scope: e.__scopeSlider,
          children: (0, f.jsx)(w.Slot, {
            scope: e.__scopeSlider,
            children: (0, f.jsx)(C ? E : I, {
              "aria-disabled": u,
              "data-disabled": u ? "" : void 0,
              ...j,
              ref: n,
              onPointerDown: (0, r.f)(j.onPointerDown, () => {
                u || (P.current = T);
              }),
              min: s,
              max: o,
              inverted: x,
              onSlideStart: u
                ? void 0
                : function (e) {
                    let t = (function (e, t) {
                      if (1 === e.length) return 0;
                      let a = e.map((e) => Math.abs(e - t)),
                        r = Math.min(...a);
                      return a.indexOf(r);
                    })(T, e);
                    M(e, t);
                  },
              onSlideMove: u
                ? void 0
                : function (e) {
                    M(e, k.current);
                  },
              onSlideEnd: u
                ? void 0
                : function () {
                    let e = P.current[k.current];
                    T[k.current] !== e && v(T);
                  },
              onHomeKeyDown: () => !u && M(s, 0, { commit: !0 }),
              onEndKeyDown: () => !u && M(o, T.length - 1, { commit: !0 }),
              onStepKeyDown: ({ event: e, direction: t }) => {
                if (!u) {
                  let a =
                      m.includes(e.key) || (e.shiftKey && h.includes(e.key)),
                    r = k.current;
                  M(T[r] + d * (a ? 10 : 1) * t, r, { commit: !0 });
                }
              },
            }),
          }),
        }),
      });
    });
  j.displayName = g;
  var [N, k] = v(g, {
      startEdge: "left",
      endEdge: "right",
      size: "width",
      direction: 1,
    }),
    E = t.forwardRef((e, a) => {
      let {
          min: r,
          max: i,
          dir: l,
          inverted: o,
          onSlideStart: d,
          onSlideMove: c,
          onSlideEnd: u,
          onStepKeyDown: m,
          ...h
        } = e,
        [g, w] = t.useState(null),
        b = (0, n.j)(a, (e) => w(e)),
        y = t.useRef(void 0),
        v = (0, s.f)(l),
        x = "ltr" === v,
        _ = (x && !o) || (!x && o);
      function S(e) {
        let t = y.current || g.getBoundingClientRect(),
          a = D([0, t.width], _ ? [r, i] : [i, r]);
        return ((y.current = t), a(e - t.left));
      }
      return (0, f.jsx)(N, {
        scope: e.__scopeSlider,
        startEdge: _ ? "left" : "right",
        endEdge: _ ? "right" : "left",
        direction: _ ? 1 : -1,
        size: "width",
        children: (0, f.jsx)(C, {
          dir: v,
          "data-orientation": "horizontal",
          ...h,
          ref: b,
          style: {
            ...h.style,
            "--radix-slider-thumb-transform": "translateX(-50%)",
          },
          onSlideStart: (e) => {
            let t = S(e.clientX);
            d?.(t);
          },
          onSlideMove: (e) => {
            let t = S(e.clientX);
            c?.(t);
          },
          onSlideEnd: () => {
            ((y.current = void 0), u?.());
          },
          onStepKeyDown: (e) => {
            let t = p[_ ? "from-left" : "from-right"].includes(e.key);
            m?.({ event: e, direction: t ? -1 : 1 });
          },
        }),
      });
    }),
    I = t.forwardRef((e, a) => {
      let {
          min: r,
          max: i,
          inverted: l,
          onSlideStart: s,
          onSlideMove: o,
          onSlideEnd: d,
          onStepKeyDown: c,
          ...u
        } = e,
        m = t.useRef(null),
        h = (0, n.j)(a, m),
        g = t.useRef(void 0),
        w = !l;
      function b(e) {
        let t = g.current || m.current.getBoundingClientRect(),
          a = D([0, t.height], w ? [i, r] : [r, i]);
        return ((g.current = t), a(e - t.top));
      }
      return (0, f.jsx)(N, {
        scope: e.__scopeSlider,
        startEdge: w ? "bottom" : "top",
        endEdge: w ? "top" : "bottom",
        size: "height",
        direction: w ? 1 : -1,
        children: (0, f.jsx)(C, {
          "data-orientation": "vertical",
          ...u,
          ref: h,
          style: {
            ...u.style,
            "--radix-slider-thumb-transform": "translateY(50%)",
          },
          onSlideStart: (e) => {
            let t = b(e.clientY);
            s?.(t);
          },
          onSlideMove: (e) => {
            let t = b(e.clientY);
            o?.(t);
          },
          onSlideEnd: () => {
            ((g.current = void 0), d?.());
          },
          onStepKeyDown: (e) => {
            let t = p[w ? "from-bottom" : "from-top"].includes(e.key);
            c?.({ event: e, direction: t ? -1 : 1 });
          },
        }),
      });
    }),
    C = t.forwardRef((e, t) => {
      let {
          __scopeSlider: a,
          onSlideStart: n,
          onSlideMove: i,
          onSlideEnd: l,
          onHomeKeyDown: s,
          onEndKeyDown: o,
          onStepKeyDown: d,
          ...u
        } = e,
        p = S(g, a);
      return (0, f.jsx)(c.V.span, {
        ...u,
        ref: t,
        onKeyDown: (0, r.f)(e.onKeyDown, (e) => {
          "Home" === e.key
            ? (s(e), e.preventDefault())
            : "End" === e.key
              ? (o(e), e.preventDefault())
              : m.concat(h).includes(e.key) && (d(e), e.preventDefault());
        }),
        onPointerDown: (0, r.f)(e.onPointerDown, (e) => {
          let t = e.target;
          (t.setPointerCapture(e.pointerId),
            e.preventDefault(),
            p.thumbs.has(t) ? t.focus() : n(e));
        }),
        onPointerMove: (0, r.f)(e.onPointerMove, (e) => {
          e.target.hasPointerCapture(e.pointerId) && i(e);
        }),
        onPointerUp: (0, r.f)(e.onPointerUp, (e) => {
          let t = e.target;
          t.hasPointerCapture(e.pointerId) &&
            (t.releasePointerCapture(e.pointerId), l(e));
        }),
      });
    }),
    T = "SliderTrack",
    R = t.forwardRef((e, t) => {
      let { __scopeSlider: a, ...r } = e,
        n = S(T, a);
      return (0, f.jsx)(c.V.span, {
        "data-disabled": n.disabled ? "" : void 0,
        "data-orientation": n.orientation,
        ...r,
        ref: t,
      });
    });
  R.displayName = T;
  var P = "SliderRange",
    M = t.forwardRef((e, a) => {
      let { __scopeSlider: r, ...i } = e,
        l = S(P, r),
        s = k(P, r),
        o = t.useRef(null),
        d = (0, n.j)(a, o),
        u = l.values.length,
        m = l.values.map((e) => L(e, l.min, l.max)),
        h = u > 1 ? Math.min(...m) : 0,
        p = 100 - Math.max(...m);
      return (0, f.jsx)(c.V.span, {
        "data-orientation": l.orientation,
        "data-disabled": l.disabled ? "" : void 0,
        ...i,
        ref: d,
        style: { ...e.style, [s.startEdge]: h + "%", [s.endEdge]: p + "%" },
      });
    });
  M.displayName = P;
  var $ = "SliderThumb",
    z = t.forwardRef((e, a) => {
      let r = b(e.__scopeSlider),
        [i, l] = t.useState(null),
        s = (0, n.j)(a, (e) => l(e)),
        o = t.useMemo(
          () => (i ? r().findIndex((e) => e.ref.current === i) : -1),
          [r, i],
        );
      return (0, f.jsx)(W, { ...e, ref: s, index: o });
    }),
    W = t.forwardRef((e, a) => {
      var i, l, s, o, u;
      let m,
        h,
        { __scopeSlider: p, index: g, name: b, ...y } = e,
        v = S($, p),
        x = k($, p),
        [_, j] = t.useState(null),
        N = (0, n.j)(a, (e) => j(e)),
        E = !_ || v.form || !!_.closest("form"),
        I = (0, d.f)(_),
        C = v.values[g],
        T = void 0 === C ? 0 : L(C, v.min, v.max),
        R =
          ((i = g),
          (l = v.values.length) > 2
            ? `Value ${i + 1} of ${l}`
            : 2 === l
              ? ["Minimum", "Maximum"][i]
              : void 0),
        P = I?.[x.size],
        M = P
          ? ((s = P),
            (o = T),
            (u = x.direction),
            (h = D([0, 50], [0, (m = s / 2)])),
            (m - h(o) * u) * u)
          : 0;
      return (
        t.useEffect(() => {
          if (_)
            return (
              v.thumbs.add(_),
              () => {
                v.thumbs.delete(_);
              }
            );
        }, [_, v.thumbs]),
        (0, f.jsxs)("span", {
          style: {
            transform: "var(--radix-slider-thumb-transform)",
            position: "absolute",
            [x.startEdge]: `calc(${T}% + ${M}px)`,
          },
          children: [
            (0, f.jsx)(w.ItemSlot, {
              scope: e.__scopeSlider,
              children: (0, f.jsx)(c.V.span, {
                role: "slider",
                "aria-label": e["aria-label"] || R,
                "aria-valuemin": v.min,
                "aria-valuenow": C,
                "aria-valuemax": v.max,
                "aria-orientation": v.orientation,
                "data-orientation": v.orientation,
                "data-disabled": v.disabled ? "" : void 0,
                tabIndex: v.disabled ? void 0 : 0,
                ...y,
                ref: N,
                style: void 0 === C ? { display: "none" } : e.style,
                onFocus: (0, r.f)(e.onFocus, () => {
                  v.valueIndexToChangeRef.current = g;
                }),
              }),
            }),
            E &&
              (0, f.jsx)(
                A,
                {
                  name:
                    b ??
                    (v.name
                      ? v.name + (v.values.length > 1 ? "[]" : "")
                      : void 0),
                  form: v.form,
                  value: C,
                },
                g,
              ),
          ],
        })
      );
    });
  z.displayName = $;
  var A = t.forwardRef(({ __scopeSlider: e, value: a, ...r }, i) => {
    let l = t.useRef(null),
      s = (0, n.j)(l, i),
      d = (0, o.f)(a);
    return (
      t.useEffect(() => {
        let e = l.current;
        if (!e) return;
        let t = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        ).set;
        if (d !== a && t) {
          let r = new Event("input", { bubbles: !0 });
          (t.call(e, a), e.dispatchEvent(r));
        }
      }, [d, a]),
      (0, f.jsx)(c.V.input, {
        style: { display: "none" },
        ...r,
        ref: s,
        defaultValue: a,
      })
    );
  });
  function L(e, t, r) {
    return (0, a.f)((100 / (r - t)) * (e - t), [0, 100]);
  }
  function D(e, t) {
    return (a) => {
      if (e[0] === e[1] || t[0] === t[1]) return t[0];
      let r = (t[1] - t[0]) / (e[1] - e[0]);
      return t[0] + r * (a - e[0]);
    };
  }
  ((A.displayName = "RadioBubbleInput"),
    e.s(["h", 0, M, "F", 0, j, "w", 0, z, "m", 0, R]));
};
