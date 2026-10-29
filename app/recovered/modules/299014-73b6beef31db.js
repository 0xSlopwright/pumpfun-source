// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n = e.i(753887);
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.default = function (e) {
      var t = e.length,
        r = t % 4;
      if (!r) return e;
      var i = t,
        o = 4 - r,
        a = t + o,
        s = n.Buffer.alloc(a);
      for (s.write(e); o--; ) s.write("=", i++);
      return s.toString();
    }));
};
