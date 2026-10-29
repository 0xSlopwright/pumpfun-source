// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(289795);
  let i = {
    attribute: !0,
    type: String,
    converter: e.s,
    reflect: !1,
    hasChanged: e.e,
  };
  function a(t) {
    return (e, a) => {
      let s;
      return "object" == typeof a
        ? ((t = i, e, a) => {
            let { kind: s, metadata: r } = a,
              o = globalThis.litPropertyMetadata.get(r);
            if (
              (void 0 === o &&
                globalThis.litPropertyMetadata.set(r, (o = new Map())),
              "setter" === s && ((t = Object.create(t)).wrapped = !0),
              o.set(a.name, t),
              "accessor" === s)
            ) {
              let { name: i } = a;
              return {
                set(a) {
                  let s = e.get.call(this);
                  (e.set.call(this, a), this.requestUpdate(i, s, t, !0, a));
                },
                init(e) {
                  return (void 0 !== e && this.C(i, void 0, t, e), e);
                },
              };
            }
            if ("setter" === s) {
              let { name: i } = a;
              return function (a) {
                let s = this[i];
                (e.call(this, a), this.requestUpdate(i, s, t, !0, a));
              };
            }
            throw Error("Unsupported decorator location: " + s);
          })(t, e, a)
        : ((s = e.hasOwnProperty(a)),
          e.constructor.createProperty(a, t),
          s ? Object.getOwnPropertyDescriptor(e, a) : void 0);
    };
  }
  (t.s(["f", 0, a], 772072),
    t.s(
      [
        "f",
        0,
        function (t) {
          return a({ ...t, state: !0, attribute: !1 });
        },
      ],
      601908,
    ),
    t.s([], 428531));
};
