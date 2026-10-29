// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let { ObjectSetPrototypeOf: n } = e.r(763323);
  t.exports = o;
  let i = e.r(860325);
  function o(e) {
    if (!(this instanceof o)) return new o(e);
    i.call(this, e);
  }
  (n(o.prototype, i.prototype),
    n(o, i),
    (o.prototype._transform = function (e, t, r) {
      r(null, e);
    }));
};
