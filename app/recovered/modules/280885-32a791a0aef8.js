// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = t.r(795081),
    n = t.r(650865),
    i = o("RegExp.prototype.exec"),
    a = t.r(231473);
  r.exports = function (t) {
    if (!n(t)) throw new a("`regex` must be a RegExp");
    return function (r) {
      return null !== i(t, r);
    };
  };
};
