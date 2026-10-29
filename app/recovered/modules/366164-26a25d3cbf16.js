// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    n = e.i(48416),
    r = e.i(278051),
    i = e.i(617821),
    o = e.i(565693),
    l = e.i(443589),
    a = e.i(297454),
    s = e.i(648585),
    u = e.i(309899),
    c = e.i(739774),
    d = e.i(681402),
    f = e.i(593978),
    p = e.i(862995),
    g = e.i(231332);
  let h = t.createContext({
    formRef: { current: { fields: new Map() } },
    errors: {},
    clearErrors: a.x,
    validationMode: "onSubmit",
    submitAttemptedRef: { current: !1 },
  });
  function v() {
    return t.useContext(h);
  }
  var m = e.i(759795);
  let b = t.createContext({
    controlId: void 0,
    registerControlId: a.x,
    labelId: void 0,
    setLabelId: a.x,
    messageIds: [],
    setMessageIds: a.x,
    getDescriptionProps: (e) => e,
  });
  function x() {
    return t.useContext(b);
  }
  var y = e.i(303232),
    S = e.i(92615),
    w = e.i(523686),
    _ = e.i(559545),
    E = e.i(498546),
    C = e.i(732486);
  let R = t.forwardRef(function (e, h) {
    let {
        checked: b,
        className: R,
        defaultChecked: P,
        "aria-labelledby": T,
        id: D,
        inputRef: N,
        name: A,
        nativeButton: M = !1,
        onCheckedChange: O,
        readOnly: I = !1,
        required: k = !1,
        disabled: F = !1,
        render: B,
        uncheckedValue: z,
        value: j,
        ...$
      } = e,
      { clearErrors: L } = v(),
      {
        state: H,
        setTouched: W,
        setDirty: U,
        validityData: Y,
        setFilled: V,
        setFocused: X,
        shouldValidateOnChange: q,
        validationMode: K,
        disabled: Z,
        name: G,
        validation: J,
      } = (0, m.f)(),
      { labelId: Q } = x(),
      ee = Z || F,
      et = G ?? A,
      en = (0, r.f)(O),
      er = t.useRef(null),
      ei = (0, i.A)(er, N, J.inputRef),
      eo = t.useRef(null),
      el = (0, c.f)(),
      ea = (function (e = {}) {
        let { id: n, implicit: i = !1, controlRef: l } = e,
          { controlId: s, registerControlId: u } = x(),
          d = (0, c.f)(n),
          f = i ? s : void 0,
          p = (0, y.f)(() => Symbol("labelable-control")),
          g = t.useRef(!1),
          h = t.useRef(null != n),
          v = (0, r.f)(() => {
            g.current && u !== a.x && ((g.current = !1), u(p.current, void 0));
          });
        return (
          (0, o.f)(() => {
            let e;
            if (u !== a.x) {
              if (i) {
                let t = l?.current;
                e =
                  (0, S.m)(t) && null != t.closest("label")
                    ? (n ?? null)
                    : (f ?? d);
              } else if (null != n) ((h.current = !0), (e = n));
              else {
                if (!h.current) return void v();
                e = d;
              }
              if (void 0 === e) return void v();
              ((g.current = !0), u(p.current, e));
            }
          }, [n, l, f, u, i, d, p, v]),
          t.useEffect(() => v, [v]),
          s ?? d
        );
      })({ id: D, implicit: !1, controlRef: eo }),
      es = M ? void 0 : ea,
      [eu, ec] = (0, n.f)({
        controlled: b,
        default: !!P,
        name: "Switch",
        state: "checked",
      });
    (!(function (e) {
      let {
          enabled: t = !0,
          value: n,
          id: i,
          name: l,
          controlRef: a,
          commit: s,
        } = e,
        { formRef: u } = v(),
        {
          invalid: c,
          markedDirtyRef: d,
          validityData: f,
          setValidityData: p,
        } = (0, m.f)(),
        h = (0, r.f)(e.getValue);
      ((0, o.f)(() => {
        if (!t) return;
        let e = n;
        (void 0 === e && (e = h()),
          null === f.initialValue &&
            null !== e &&
            p((t) => ({ ...t, initialValue: e })));
      }, [t, p, n, f.initialValue, h]),
        (0, o.f)(() => {
          t &&
            i &&
            u.current.fields.set(i, {
              getValue: h,
              name: l,
              controlRef: a,
              validityData: {
                ...f,
                state: { ...f.state, valid: !c && f.state.valid },
              },
              validate(e = !0) {
                let t = n;
                (void 0 === t && (t = h()),
                  (d.current = !0),
                  e ? g.flushSync(() => s(t)) : s(t));
              },
            });
        }, [s, a, t, u, h, i, c, d, l, f, n]),
        (0, o.f)(() => {
          let e = u.current.fields;
          return () => {
            i && e.delete(i);
          };
        }, [u, i]));
    })({
      id: el,
      commit: J.commit,
      value: eu,
      controlRef: eo,
      name: et,
      getValue: () => eu,
    }),
      (0, o.f)(() => {
        er.current && V(er.current.checked);
      }, [er, V]),
      (0, E.f)(eu, () => {
        (L(et),
          U(eu !== Y.initialValue),
          V(eu),
          q() ? J.commit(eu) : J.commit(eu, !0));
      }));
    let { getButtonProps: ed, buttonRef: ef } = (0, d.f)({
        disabled: ee,
        native: M,
      }),
      ep = (function (e, n, r, i = !0, l) {
        let [a, s] = t.useState(),
          u = (0, c.f)(l ? `${l}-label` : void 0),
          d = e ?? n ?? a;
        return (
          (0, o.f)(() => {
            let t =
              e || n || !i
                ? void 0
                : (function (e, t) {
                    let n = (function (e) {
                      if (!e) return;
                      let t = e.parentElement;
                      if (t && "LABEL" === t.tagName) return t;
                      let n = e.id;
                      if (n) {
                        let t = e.nextElementSibling;
                        if (t && t.htmlFor === n) return t;
                      }
                      let r = e.labels;
                      return r && r[0];
                    })(e);
                    if (n) return (!n.id && t && (n.id = t), n.id || void 0);
                  })(r.current, u);
            a !== t && s(t);
          }),
          d
        );
      })(T, Q, er, !M, es),
      eg = t.useMemo(
        () =>
          (0, u.w)(
            {
              checked: eu,
              disabled: ee,
              id: es,
              name: et,
              required: k,
              style: et ? l.L : l.p,
              tabIndex: -1,
              type: "checkbox",
              "aria-hidden": !0,
              ref: ei,
              onChange(e) {
                if (e.nativeEvent.defaultPrevented) return;
                let t = e.target.checked,
                  n = (0, w.f)(_.f.none, e.nativeEvent);
                (en?.(t, n), n.isCanceled || ec(t));
              },
              onFocus() {
                eo.current?.focus();
              },
            },
            J.getInputValidationProps,
            void 0 !== j ? { value: j } : a.w,
          ),
        [eu, ee, ei, es, et, en, k, ec, J, j],
      ),
      eh = t.useMemo(
        () => ({ ...H, checked: eu, disabled: ee, readOnly: I, required: k }),
        [H, eu, ee, I, k],
      ),
      ev = (0, s.f)("span", e, {
        state: eh,
        ref: [h, eo, ef],
        props: [
          {
            id: M ? ea : el,
            role: "switch",
            "aria-checked": eu,
            "aria-readonly": I || void 0,
            "aria-required": k || void 0,
            "aria-labelledby": ep,
            onFocus() {
              ee || X(!0);
            },
            onBlur() {
              let e = er.current;
              e && !ee && (W(!0), X(!1), "onBlur" === K && J.commit(e.checked));
            },
            onClick(e) {
              I ||
                ee ||
                (e.preventDefault(),
                er.current?.dispatchEvent(
                  new PointerEvent("click", {
                    bubbles: !0,
                    shiftKey: e.shiftKey,
                    ctrlKey: e.ctrlKey,
                    altKey: e.altKey,
                    metaKey: e.metaKey,
                  }),
                ));
            },
          },
          J.getValidationProps,
          $,
          ed,
        ],
        stateAttributesMapping: p.f,
      });
    return (0, C.jsxs)(f.L.Provider, {
      value: eh,
      children: [
        ev,
        !eu &&
          et &&
          void 0 !== z &&
          (0, C.jsx)("input", { type: "hidden", name: et, value: z }),
        (0, C.jsx)("input", { ...eg }),
      ],
    });
  });
  e.s(["SwitchRoot", 0, R], 366164);
};
