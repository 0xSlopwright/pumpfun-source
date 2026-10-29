// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(526960),
    r = e.i(965142);
  async function o(e) {
    let { authorization: o, signature: s } = e;
    return (0, t.f)({ hash: (0, r.f)(o), signature: s ?? o });
  }
  e.s(["f", 0, o]);
};
