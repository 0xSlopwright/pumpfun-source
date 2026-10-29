// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var r = e.i(732486),
    o = e.i(352386),
    t = e.i(689391),
    i = e.i(42799),
    l = e.i(336651),
    a = e.i(933185),
    c = e.i(315430),
    n = e.i(995040),
    d = e.i(23915);
  let s = ({ value: e, onChange: o }) =>
      (0, r.jsx)("select", {
        value: e,
        onChange: o,
        children: i.h.map((e) =>
          (0, r.jsxs)(
            "option",
            { value: e.code, children: [e.code, " +", e.callCode] },
            e.code,
          ),
        ),
      }),
    h = (0, o.forwardRef)((e, t) => {
      let h = (0, a.a)(),
        [v, g] = (0, o.useState)(!1),
        { accountType: x } = (0, c.h)(),
        [f, y] = (0, o.useState)(""),
        [m, b] = (0, o.useState)(
          e.defaultCountry ?? h?.intl.defaultCountry ?? "US",
        ),
        w = (0, i.o)(f, m),
        k = (0, i.M)(m),
        C = (0, i.i)(m),
        $ = (0, l.f)(m),
        j = !w,
        [M, z] = (0, o.useState)(!1),
        L = $.length,
        S = (r) => {
          let o = r.target.value;
          (b(o),
            y(""),
            e.onChange &&
              e.onChange({
                rawPhoneNumber: f,
                qualifiedPhoneNumber: (0, i.A)(f, o),
                countryCode: o,
                isValid: (0, i.o)(f, m),
              }));
        },
        P = (r, o) => {
          try {
            let t =
              r.replace(/\D/g, "") === f.replace(/\D/g, "") ? r : k.input(r);
            (y(t),
              e.onChange &&
                e.onChange({
                  rawPhoneNumber: t,
                  qualifiedPhoneNumber: (0, i.A)(r, o),
                  countryCode: o,
                  isValid: (0, i.o)(r, o),
                }));
          } catch (e) {
            console.error("Error processing phone number:", e);
          }
        },
        V = () => {
          z(!0);
          let r = (0, i.A)(f, m);
          e.onSubmit({
            rawPhoneNumber: f,
            qualifiedPhoneNumber: r,
            countryCode: m,
            isValid: (0, i.o)(f, m),
          }).finally(() => z(!1));
        };
      return (
        (0, o.useEffect)(() => {
          if (e.defaultValue) {
            let r = (0, i.N)(e.defaultValue);
            (k.reset(),
              S({ target: { value: r.countryCode } }),
              P(r.phone, r.countryCode));
          }
        }, [e.defaultValue]),
        (0, r.jsxs)(r.Fragment, {
          children: [
            (0, r.jsx)(p, {
              children: (0, r.jsxs)(u, {
                $callingCodeLength: L,
                $stacked: e.stacked,
                children: [
                  (0, r.jsx)(s, { value: m, onChange: S }),
                  (0, r.jsx)("input", {
                    ref: t,
                    id: "phone-number-input",
                    className: "login-method-button",
                    type: "tel",
                    placeholder: C,
                    onFocus: () => g(!0),
                    onChange: (e) => {
                      P(e.target.value, m);
                    },
                    onKeyUp: (e) => {
                      "Enter" === e.key && V();
                    },
                    value: f,
                    autoComplete: "tel",
                  }),
                  "phone" !== x || v || e.hideRecent
                    ? e.stacked || e.noIncludeSubmitButton
                      ? (0, r.jsx)("span", {})
                      : (0, r.jsx)(n.E, {
                          isSubmitting: M,
                          onClick: V,
                          disabled: j,
                          children: "Submit",
                        })
                    : (0, r.jsx)(d.C, { color: "gray", children: "Recent" }),
                ],
              }),
            }),
            e.stacked && !e.noIncludeSubmitButton
              ? (0, r.jsx)(n.P, {
                  loading: M,
                  loadingText: null,
                  onClick: V,
                  disabled: j,
                  children: "Submit",
                })
              : null,
          ],
        })
      );
    }),
    p = t.z.div`
  width: 100%;
`,
    u = t.z.label`
  --country-code-dropdown-width: calc(54px + calc(12 * ${(e) => e.$callingCodeLength}px));
  --phone-input-extra-padding-left: calc(12px + calc(3 * ${(e) => e.$callingCodeLength}px));
  display: block;
  position: relative;
  width: 100%;

  /* Tablet and Up */
  @media (min-width: 441px) {
    --country-code-dropdown-width: calc(52px + calc(10 * ${(e) => e.$callingCodeLength}px));
  }

  && > select {
    font-size: 16px;
    height: 24px;
    position: absolute;
    margin: 13px calc(var(--country-code-dropdown-width) / 4);
    line-height: 24px;
    width: var(--country-code-dropdown-width);
    background-color: var(--privy-color-background);
    background-size: auto;
    background-position-x: right;
    cursor: pointer;

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      width: var(--country-code-dropdown-width);
    }

    :focus {
      outline: none;
      box-shadow: none;
    }
  }

  && > input {
    font-size: 16px;
    line-height: 24px;
    color: var(--privy-color-foreground);

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    padding: 12px 88px 12px
      calc(var(--country-code-dropdown-width) + var(--phone-input-extra-padding-left));
    padding-right: ${(e) => (e.$stacked ? "16px" : "88px")};
    flex-grow: 1;
    background: var(--privy-color-background);
    border: 1px solid var(--privy-color-foreground-4);
    border-radius: var(--privy-border-radius-md);
    width: 100%;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }

    :autofill,
    :-webkit-autofill {
      background: var(--privy-color-background);
    }

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      padding-right: 78px;
    }
  }

  && > :last-child {
    right: 16px;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
  }

  && > button:last-child {
    right: 0;
    line-height: 24px;
    padding: 13px 17px;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }
  }

  && > input::placeholder {
    color: var(--privy-color-foreground-3);
  }
`;
  e.s(["C", 0, h]);
};
