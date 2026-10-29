// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (e.i(149502), Object.defineProperty(r, "__esModule", { value: !0 }));
  var n = {
    default: function () {
      return i;
    },
    getProperError: function () {
      return l;
    },
  };
  for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
  let a = e.r(278068);
  function i(e) {
    return "object" == typeof e && null !== e && "name" in e && "message" in e;
  }
  function l(e) {
    let t;
    return i(e)
      ? e
      : Error(
          (0, a.isPlainObject)(e)
            ? ((t = new WeakSet()),
              JSON.stringify(e, (e, r) => {
                if ("object" == typeof r && null !== r) {
                  if (t.has(r)) return "[Circular]";
                  t.add(r);
                }
                return r;
              }))
            : e + "",
        );
  }
};
