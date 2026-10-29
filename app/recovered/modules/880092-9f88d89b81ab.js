// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n =
      (e.e && e.e.__rest) ||
      function (e, t) {
        var r = {};
        for (var n in e)
          Object.prototype.hasOwnProperty.call(e, n) &&
            0 > t.indexOf(n) &&
            (r[n] = e[n]);
        if (null != e && "function" == typeof Object.getOwnPropertySymbols)
          for (
            var i = 0, n = Object.getOwnPropertySymbols(e);
            i < n.length;
            i++
          )
            0 > t.indexOf(n[i]) &&
              Object.prototype.propertyIsEnumerable.call(e, n[i]) &&
              (r[n[i]] = e[n[i]]);
        return r;
      },
    i =
      (e.e && e.e.__importDefault) ||
      function (e) {
        return e && e.__esModule ? e : { default: e };
      };
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.GoogleAnalytics = void 0));
  let s = i(e.r(40775)),
    o = e.r(6154);
  r.GoogleAnalytics = (e) => {
    var t = n(e, []);
    return (0, o.formatData)(s.default, t);
  };
};
