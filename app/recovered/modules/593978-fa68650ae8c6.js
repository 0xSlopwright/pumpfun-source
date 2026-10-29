// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t,
    n,
    r = e.i(702232),
    i = e.i(352386);
  let o = i.createContext(void 0);
  e.s(
    [
      "L",
      0,
      o,
      "s",
      0,
      function () {
        let e = i.useContext(o);
        if (void 0 === e) throw Error((0, r.f)(63));
        return e;
      },
    ],
    593978,
  );
  let l =
      (((t = {}).disabled = "data-disabled"),
      (t.valid = "data-valid"),
      (t.invalid = "data-invalid"),
      (t.touched = "data-touched"),
      (t.dirty = "data-dirty"),
      (t.filled = "data-filled"),
      (t.focused = "data-focused"),
      t),
    a = { valid: null, touched: !1, dirty: !1, filled: !1, focused: !1 },
    s = { disabled: !1, ...a },
    u =
      (((n = {}).checked = "data-checked"),
      (n.unchecked = "data-unchecked"),
      (n.disabled = "data-disabled"),
      (n.readonly = "data-readonly"),
      (n.required = "data-required"),
      (n.valid = "data-valid"),
      (n.invalid = "data-invalid"),
      (n.touched = "data-touched"),
      (n.dirty = "data-dirty"),
      (n.filled = "data-filled"),
      (n.focused = "data-focused"),
      n);
  e.s(
    [
      "f",
      0,
      {
        valid: (e) =>
          null === e ? null : e ? { [l.valid]: "" } : { [l.invalid]: "" },
        checked: (e) => (e ? { [u.checked]: "" } : { [u.unchecked]: "" }),
      },
    ],
    862995,
  );
  var c = e.i(297454);
  let d = i.createContext({
    invalid: void 0,
    name: void 0,
    validityData: {
      state: {
        badInput: !1,
        customError: !1,
        patternMismatch: !1,
        rangeOverflow: !1,
        rangeUnderflow: !1,
        stepMismatch: !1,
        tooLong: !1,
        tooShort: !1,
        typeMismatch: !1,
        valid: null,
        valueMissing: !1,
      },
      errors: [],
      error: "",
      value: "",
      initialValue: null,
    },
    setValidityData: c.x,
    disabled: void 0,
    touched: a.touched,
    setTouched: c.x,
    dirty: a.dirty,
    setDirty: c.x,
    filled: a.filled,
    setFilled: c.x,
    focused: a.focused,
    setFocused: c.x,
    validate: () => null,
    validationMode: "onSubmit",
    validationDebounceTime: 0,
    shouldValidateOnChange: () => !1,
    state: s,
    markedDirtyRef: { current: !1 },
    validation: {
      getValidationProps: (e = c.w) => e,
      getInputValidationProps: (e = c.w) => e,
      inputRef: { current: null },
      commit: async () => {},
    },
  });
  e.s(
    [
      "f",
      0,
      function (e = !0) {
        let t = i.useContext(d);
        if (t.setValidityData === c.x && !e) throw Error((0, r.f)(28));
        return t;
      },
    ],
    759795,
  );
};
