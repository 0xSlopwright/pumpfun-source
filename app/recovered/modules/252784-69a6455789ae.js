// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (e.i(149502), Object.defineProperty(r, "__esModule", { value: !0 }));
  var n = {
    isRecoverableError: function () {
      return s;
    },
    onRecoverableError: function () {
      return c;
    },
  };
  for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
  let a = e.r(836437),
    i = e.r(443256),
    l = a._(e.r(458455)),
    u = e.r(951758),
    d = new WeakSet();
  function s(e) {
    return d.has(e);
  }
  let c = (e) => {
    let t = (0, l.default)(e) && "cause" in e ? e.cause : e;
    (0, i.isBailoutToCSRError)(t) || (0, u.reportGlobalError)(t);
  };
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
