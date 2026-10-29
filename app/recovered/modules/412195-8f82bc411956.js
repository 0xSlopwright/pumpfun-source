// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  Object.defineProperty(r, "__esModule", { value: !0 });
  var n = {
    ReadonlyURLSearchParams: function () {
      return u.ReadonlyURLSearchParams;
    },
    RedirectType: function () {
      return d;
    },
    forbidden: function () {
      return l.forbidden;
    },
    notFound: function () {
      return a.notFound;
    },
    permanentRedirect: function () {
      return i.permanentRedirect;
    },
    redirect: function () {
      return i.redirect;
    },
    unauthorized: function () {
      return c.unauthorized;
    },
    unstable_isUnrecognizedActionError: function () {
      return s;
    },
    unstable_rethrow: function () {
      return f.unstable_rethrow;
    },
  };
  for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
  let u = e.r(308727),
    i = e.r(46485),
    a = e.r(673392),
    l = e.r(312785),
    c = e.r(987520),
    f = e.r(738162);
  function s() {
    throw Error(
      "`unstable_isUnrecognizedActionError` can only be used on the client.",
    );
  }
  let d = { push: "push", replace: "replace" };
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
