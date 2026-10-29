// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    r = e.i(732486);
  e.i(231332);
  var a = t.forwardRef((e, a) => {
    let { children: n, ...s } = e,
      o = t.Children.toArray(n),
      c = o.find(i);
    if (c) {
      let e = c.props.children,
        n = o.map((r) =>
          r !== c
            ? r
            : t.Children.count(e) > 1
              ? t.Children.only(null)
              : t.isValidElement(e)
                ? e.props.children
                : null,
        );
      return (0, r.jsx)(l, {
        ...s,
        ref: a,
        children: t.isValidElement(e) ? t.cloneElement(e, void 0, n) : null,
      });
    }
    return (0, r.jsx)(l, { ...s, ref: a, children: n });
  });
  a.displayName = "Slot";
  var l = t.forwardRef((e, r) => {
    let { children: a, ...l } = e;
    if (t.isValidElement(a)) {
      var n;
      let e,
        i,
        s =
          ((n = a),
          (i =
            (e = Object.getOwnPropertyDescriptor(n.props, "ref")?.get) &&
            "isReactWarning" in e &&
            e.isReactWarning)
            ? n.ref
            : (i =
                  (e = Object.getOwnPropertyDescriptor(n, "ref")?.get) &&
                  "isReactWarning" in e &&
                  e.isReactWarning)
              ? n.props.ref
              : n.props.ref || n.ref);
      return t.cloneElement(a, {
        ...(function (e, t) {
          let r = { ...t };
          for (let a in t) {
            let l = e[a],
              n = t[a];
            /^on[A-Z]/.test(a)
              ? l && n
                ? (r[a] = (...e) => {
                    (n(...e), l(...e));
                  })
                : l && (r[a] = l)
              : "style" === a
                ? (r[a] = { ...l, ...n })
                : "className" === a &&
                  (r[a] = [l, n].filter(Boolean).join(" "));
          }
          return { ...e, ...r };
        })(l, a.props),
        ref: r
          ? (function (...e) {
              return (t) =>
                e.forEach((e) => {
                  "function" == typeof e ? e(t) : null != e && (e.current = t);
                });
            })(r, s)
          : s,
      });
    }
    return t.Children.count(a) > 1 ? t.Children.only(null) : null;
  });
  l.displayName = "SlotClone";
  var n = ({ children: e }) => (0, r.jsx)(r.Fragment, { children: e });
  function i(e) {
    return t.isValidElement(e) && e.type === n;
  }
  var s = [
      "a",
      "button",
      "div",
      "form",
      "h2",
      "h3",
      "img",
      "input",
      "label",
      "li",
      "nav",
      "ol",
      "p",
      "span",
      "svg",
      "ul",
    ].reduce((e, l) => {
      let n = t.forwardRef((e, t) => {
        let { asChild: n, ...i } = e,
          s = n ? a : l;
        return (
          "u" > typeof window && (window[Symbol.for("radix-ui")] = !0),
          (0, r.jsx)(s, { ...i, ref: t })
        );
      });
      return ((n.displayName = `Primitive.${l}`), { ...e, [l]: n });
    }, {}),
    o = "Progress",
    [c, d] = (function (e, a = []) {
      let l = [],
        n = () => {
          let r = l.map((e) => t.createContext(e));
          return function (a) {
            let l = a?.[e] || r;
            return t.useMemo(
              () => ({ [`__scope${e}`]: { ...a, [e]: l } }),
              [a, l],
            );
          };
        };
      return (
        (n.scopeName = e),
        [
          function (a, n) {
            let i = t.createContext(n),
              s = l.length;
            function o(a) {
              let { scope: l, children: n, ...o } = a,
                c = l?.[e][s] || i,
                d = t.useMemo(() => o, Object.values(o));
              return (0, r.jsx)(c.Provider, { value: d, children: n });
            }
            return (
              (l = [...l, n]),
              (o.displayName = a + "Provider"),
              [
                o,
                function (r, l) {
                  let o = l?.[e][s] || i,
                    c = t.useContext(o);
                  if (c) return c;
                  if (void 0 !== n) return n;
                  throw Error(`\`${r}\` must be used within \`${a}\``);
                },
              ]
            );
          },
          (function (...e) {
            let r = e[0];
            if (1 === e.length) return r;
            let a = () => {
              let a = e.map((e) => ({ useScope: e(), scopeName: e.scopeName }));
              return function (e) {
                let l = a.reduce((t, { useScope: r, scopeName: a }) => {
                  let l = r(e)[`__scope${a}`];
                  return { ...t, ...l };
                }, {});
                return t.useMemo(() => ({ [`__scope${r.scopeName}`]: l }), [l]);
              };
            };
            return ((a.scopeName = r.scopeName), a);
          })(n, ...a),
        ]
      );
    })(o),
    [u, m] = c(o),
    h = t.forwardRef((e, t) => {
      var a, l;
      let {
        __scopeProgress: n,
        value: i = null,
        max: o,
        getValueLabel: c = p,
        ...d
      } = e;
      (o || 0 === o) &&
        !g(o) &&
        console.error(
          ((a = `${o}`),
          `Invalid prop \`max\` of value \`${a}\` supplied to \`Progress\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`),
        );
      let m = g(o) ? o : 100;
      null === i ||
        y(i, m) ||
        console.error(
          ((l = `${i}`),
          `Invalid prop \`value\` of value \`${l}\` supplied to \`Progress\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`),
        );
      let h = y(i, m) ? i : null,
        f = b(h) ? c(h, m) : void 0;
      return (0, r.jsx)(u, {
        scope: n,
        value: h,
        max: m,
        children: (0, r.jsx)(s.div, {
          "aria-valuemax": m,
          "aria-valuemin": 0,
          "aria-valuenow": b(h) ? h : void 0,
          "aria-valuetext": f,
          role: "progressbar",
          "data-state": v(h, m),
          "data-value": h ?? void 0,
          "data-max": m,
          ...d,
          ref: t,
        }),
      });
    });
  h.displayName = o;
  var f = "ProgressIndicator",
    x = t.forwardRef((e, t) => {
      let { __scopeProgress: a, ...l } = e,
        n = m(f, a);
      return (0, r.jsx)(s.div, {
        "data-state": v(n.value, n.max),
        "data-value": n.value ?? void 0,
        "data-max": n.max,
        ...l,
        ref: t,
      });
    });
  function p(e, t) {
    return `${Math.round((e / t) * 100)}%`;
  }
  function v(e, t) {
    return null == e ? "indeterminate" : e === t ? "complete" : "loading";
  }
  function b(e) {
    return "number" == typeof e;
  }
  function g(e) {
    return b(e) && !isNaN(e) && e > 0;
  }
  function y(e, t) {
    return b(e) && !isNaN(e) && e <= t && e >= 0;
  }
  ((x.displayName = f), e.s(["S", 0, x, "F", 0, h], 177560));
};
