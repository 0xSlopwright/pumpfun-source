// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    r = e.i(732486);
  e.i(231332);
  var i = t.forwardRef((e, i) => {
    let { children: n, ...s } = e,
      o = t.Children.toArray(n),
      c = o.find(l);
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
      return (0, r.jsx)(a, {
        ...s,
        ref: i,
        children: t.isValidElement(e) ? t.cloneElement(e, void 0, n) : null,
      });
    }
    return (0, r.jsx)(a, { ...s, ref: i, children: n });
  });
  i.displayName = "Slot";
  var a = t.forwardRef((e, r) => {
    let { children: i, ...a } = e;
    if (t.isValidElement(i)) {
      var n;
      let e,
        l,
        s =
          ((n = i),
          (l =
            (e = Object.getOwnPropertyDescriptor(n.props, "ref")?.get) &&
            "isReactWarning" in e &&
            e.isReactWarning)
            ? n.ref
            : (l =
                  (e = Object.getOwnPropertyDescriptor(n, "ref")?.get) &&
                  "isReactWarning" in e &&
                  e.isReactWarning)
              ? n.props.ref
              : n.props.ref || n.ref);
      return t.cloneElement(i, {
        ...(function (e, t) {
          let r = { ...t };
          for (let i in t) {
            let a = e[i],
              n = t[i];
            /^on[A-Z]/.test(i)
              ? a && n
                ? (r[i] = (...e) => {
                    (n(...e), a(...e));
                  })
                : a && (r[i] = a)
              : "style" === i
                ? (r[i] = { ...a, ...n })
                : "className" === i &&
                  (r[i] = [a, n].filter(Boolean).join(" "));
          }
          return { ...e, ...r };
        })(a, i.props),
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
    return t.Children.count(i) > 1 ? t.Children.only(null) : null;
  });
  a.displayName = "SlotClone";
  var n = ({ children: e }) => (0, r.jsx)(r.Fragment, { children: e });
  function l(e) {
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
    ].reduce((e, a) => {
      let n = t.forwardRef((e, t) => {
        let { asChild: n, ...l } = e,
          s = n ? i : a;
        return (
          "u" > typeof window && (window[Symbol.for("radix-ui")] = !0),
          (0, r.jsx)(s, { ...l, ref: t })
        );
      });
      return ((n.displayName = `Primitive.${a}`), { ...e, [a]: n });
    }, {}),
    o = "Progress",
    [c, m] = (function (e, i = []) {
      let a = [],
        n = () => {
          let r = a.map((e) => t.createContext(e));
          return function (i) {
            let a = i?.[e] || r;
            return t.useMemo(
              () => ({ [`__scope${e}`]: { ...i, [e]: a } }),
              [i, a],
            );
          };
        };
      return (
        (n.scopeName = e),
        [
          function (i, n) {
            let l = t.createContext(n),
              s = a.length;
            function o(i) {
              let { scope: a, children: n, ...o } = i,
                c = a?.[e][s] || l,
                m = t.useMemo(() => o, Object.values(o));
              return (0, r.jsx)(c.Provider, { value: m, children: n });
            }
            return (
              (a = [...a, n]),
              (o.displayName = i + "Provider"),
              [
                o,
                function (r, a) {
                  let o = a?.[e][s] || l,
                    c = t.useContext(o);
                  if (c) return c;
                  if (void 0 !== n) return n;
                  throw Error(`\`${r}\` must be used within \`${i}\``);
                },
              ]
            );
          },
          (function (...e) {
            let r = e[0];
            if (1 === e.length) return r;
            let i = () => {
              let i = e.map((e) => ({ useScope: e(), scopeName: e.scopeName }));
              return function (e) {
                let a = i.reduce((t, { useScope: r, scopeName: i }) => {
                  let a = r(e)[`__scope${i}`];
                  return { ...t, ...a };
                }, {});
                return t.useMemo(() => ({ [`__scope${r.scopeName}`]: a }), [a]);
              };
            };
            return ((i.scopeName = r.scopeName), i);
          })(n, ...i),
        ]
      );
    })(o),
    [d, u] = c(o),
    h = t.forwardRef((e, t) => {
      var i, a;
      let {
        __scopeProgress: n,
        value: l = null,
        max: o,
        getValueLabel: c = p,
        ...m
      } = e;
      (o || 0 === o) &&
        !b(o) &&
        console.error(
          ((i = `${o}`),
          `Invalid prop \`max\` of value \`${i}\` supplied to \`Progress\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`),
        );
      let u = b(o) ? o : 100;
      null === l ||
        y(l, u) ||
        console.error(
          ((a = `${l}`),
          `Invalid prop \`value\` of value \`${a}\` supplied to \`Progress\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`),
        );
      let h = y(l, u) ? l : null,
        f = v(h) ? c(h, u) : void 0;
      return (0, r.jsx)(d, {
        scope: n,
        value: h,
        max: u,
        children: (0, r.jsx)(s.div, {
          "aria-valuemax": u,
          "aria-valuemin": 0,
          "aria-valuenow": v(h) ? h : void 0,
          "aria-valuetext": f,
          role: "progressbar",
          "data-state": g(h, u),
          "data-value": h ?? void 0,
          "data-max": u,
          ...m,
          ref: t,
        }),
      });
    });
  h.displayName = o;
  var f = "ProgressIndicator",
    x = t.forwardRef((e, t) => {
      let { __scopeProgress: i, ...a } = e,
        n = u(f, i);
      return (0, r.jsx)(s.div, {
        "data-state": g(n.value, n.max),
        "data-value": n.value ?? void 0,
        "data-max": n.max,
        ...a,
        ref: t,
      });
    });
  function p(e, t) {
    return `${Math.round((e / t) * 100)}%`;
  }
  function g(e, t) {
    return null == e ? "indeterminate" : e === t ? "complete" : "loading";
  }
  function v(e) {
    return "number" == typeof e;
  }
  function b(e) {
    return v(e) && !isNaN(e) && e > 0;
  }
  function y(e, t) {
    return v(e) && !isNaN(e) && e <= t && e >= 0;
  }
  ((x.displayName = f), e.s(["S", 0, x, "F", 0, h], 177560));
};
