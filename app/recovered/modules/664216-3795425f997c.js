// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  t.s([
    "f",
    0,
    function (t) {
      return function (e) {
        return "function" == typeof e
          ? (customElements.get(t) || customElements.define(t, e), e)
          : (function (t, e) {
              let { kind: i, elements: a } = e;
              return {
                kind: i,
                elements: a,
                finisher(e) {
                  customElements.get(t) || customElements.define(t, e);
                },
              };
            })(t, e);
      };
    },
  ]);
};
