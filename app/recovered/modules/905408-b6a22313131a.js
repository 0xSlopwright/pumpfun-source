// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o,
    n = t.r(954767),
    i = t.r(83585);
  try {
    o = [].__proto__ === Array.prototype;
  } catch (t) {
    if (
      !t ||
      "object" != typeof t ||
      !("code" in t) ||
      "ERR_PROTO_ACCESS" !== t.code
    )
      throw t;
  }
  var a = !!o && i && i(Object.prototype, "__proto__"),
    u = Object,
    p = u.getPrototypeOf;
  r.exports =
    a && "function" == typeof a.get
      ? n([a.get])
      : "function" == typeof p &&
        function (t) {
          return p(null == t ? t : u(t));
        };
};
