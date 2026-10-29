// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(702737),
    i = e.i(470083),
    f = e.i(612735);
  function s(e, i) {
    if ("number" == typeof i && i > 0 && i > (0, f.f)(e) - 1)
      throw new t.p({ offset: i, position: "start", size: (0, f.f)(e) });
  }
  function n(e, i, s) {
    if ("number" == typeof i && "number" == typeof s && (0, f.f)(e) !== s - i)
      throw new t.p({ offset: s, position: "end", size: (0, f.f)(e) });
  }
  function o(e, t, i, { strict: f } = {}) {
    s(e, t);
    let r = e.slice(t, i);
    return (f && n(r, t, i), r);
  }
  function r(e, t, i, { strict: f } = {}) {
    s(e, t);
    let o = `0x${e.replace("0x", "").slice((t ?? 0) * 2, (i ?? e.length) * 2)}`;
    return (f && n(o, t, i), o);
  }
  e.s([
    "M",
    0,
    function (e, t, f, { strict: s } = {}) {
      return (0, i.f)(e, { strict: !1 })
        ? r(e, t, f, { strict: s })
        : o(e, t, f, { strict: s });
    },
    "S",
    0,
    o,
    "n",
    0,
    r,
  ]);
};
