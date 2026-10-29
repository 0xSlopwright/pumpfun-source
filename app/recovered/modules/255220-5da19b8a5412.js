// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  let e, s;
  var a,
    i = function (t, e, s, a) {
      if ("a" === s && !a)
        throw TypeError("Private accessor was defined without a getter");
      if ("function" == typeof e ? t !== e || !a : !e.has(t))
        throw TypeError(
          "Cannot read private member from an object whose class did not declare it",
        );
      return "m" === s ? a : "a" === s ? a.call(t) : a ? a.value : e.get(t);
    },
    l = function (t, e, s, a, i) {
      if ("m" === a) throw TypeError("Private method is not writable");
      if ("a" === a && !i)
        throw TypeError("Private accessor was defined without a setter");
      if ("function" == typeof e ? t !== e || !i : !e.has(t))
        throw TypeError(
          "Cannot write private member to an object whose class did not declare it",
        );
      return ("a" === a ? i.call(t, s) : i ? (i.value = s) : e.set(t, s), s);
    };
  let n = new Set(),
    m = {};
  function c() {
    if (
      s ||
      ((s = Object.freeze({ register: u, get: r, on: o })), "u" < typeof window)
    )
      return s;
    let t = Object.freeze({ register: u });
    try {
      window.addEventListener(
        "wallet-standard:register-wallet",
        ({ detail: e }) => e(t),
      );
    } catch (t) {
      console.error(
        "wallet-standard:register-wallet event listener could not be added\n",
        t,
      );
    }
    try {
      window.dispatchEvent(new b(t));
    } catch (t) {
      console.error(
        "wallet-standard:app-ready event could not be dispatched\n",
        t,
      );
    }
    return s;
  }
  function u(...t) {
    return (t = t.filter((t) => !n.has(t))).length
      ? (t.forEach((t) => {
          ((e = void 0), n.add(t));
        }),
        m.register?.forEach((e) => h(() => e(...t))),
        function () {
          (t.forEach((t) => {
            ((e = void 0), n.delete(t));
          }),
            m.unregister?.forEach((e) => h(() => e(...t))));
        })
      : () => {};
  }
  function r() {
    return (e || (e = [...n]), e);
  }
  function o(t, e) {
    return (
      m[t]?.push(e) || (m[t] = [e]),
      function () {
        m[t] = m[t]?.filter((t) => e !== t);
      }
    );
  }
  function h(t) {
    try {
      t();
    } catch (t) {
      console.error(t);
    }
  }
  class b extends Event {
    get detail() {
      return i(this, a, "f");
    }
    get type() {
      return "wallet-standard:app-ready";
    }
    constructor(t) {
      (super("wallet-standard:app-ready", {
        bubbles: !1,
        cancelable: !1,
        composed: !1,
      }),
        a.set(this, void 0),
        l(this, a, t, "f"));
    }
    preventDefault() {
      throw Error("preventDefault cannot be called");
    }
    stopImmediatePropagation() {
      throw Error("stopImmediatePropagation cannot be called");
    }
    stopPropagation() {
      throw Error("stopPropagation cannot be called");
    }
  }
  ((a = new WeakMap()),
    t.s([
      "c",
      0,
      function () {
        if (s || ((s = c()), "u" < typeof window)) return s;
        let t = window.navigator.wallets || [];
        if (!Array.isArray(t))
          return (console.error("window.navigator.wallets is not an array"), s);
        let { register: e } = s,
          a = (...t) => t.forEach((t) => h(() => t({ register: e })));
        try {
          Object.defineProperty(window.navigator, "wallets", {
            value: Object.freeze({ push: a }),
          });
        } catch (t) {
          return (
            console.error("window.navigator.wallets could not be set"),
            s
          );
        }
        return (a(...t), s);
      },
      "T",
      0,
      c,
    ]));
};
