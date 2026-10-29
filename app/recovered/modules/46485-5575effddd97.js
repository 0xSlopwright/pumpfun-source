// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  Object.defineProperty(r, "__esModule", { value: !0 });
  var n = {
    getRedirectError: function () {
      return l;
    },
    getRedirectStatusCodeFromError: function () {
      return p;
    },
    getRedirectTypeFromError: function () {
      return d;
    },
    getURLFromRedirectError: function () {
      return s;
    },
    permanentRedirect: function () {
      return f;
    },
    redirect: function () {
      return c;
    },
  };
  for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
  let u = e.r(314368),
    i = e.r(601331),
    a = e.r(675942);
  function l(e, t, r = u.RedirectStatusCode.TemporaryRedirect) {
    let n = Error(i.REDIRECT_ERROR_CODE);
    return ((n.digest = `${i.REDIRECT_ERROR_CODE};${t};${e};${r};`), n);
  }
  function c(e, t) {
    throw l(
      e,
      (t ??= a.actionAsyncStorage?.getStore()?.isAction ? "push" : "replace"),
      u.RedirectStatusCode.TemporaryRedirect,
    );
  }
  function f(e, t = "replace") {
    throw l(e, t, u.RedirectStatusCode.PermanentRedirect);
  }
  function s(e) {
    return (0, i.isRedirectError)(e)
      ? e.digest.split(";").slice(2, -2).join(";")
      : null;
  }
  function d(e) {
    if (!(0, i.isRedirectError)(e)) throw Error("Not a redirect error");
    return e.digest.split(";", 2)[1];
  }
  function p(e) {
    if (!(0, i.isRedirectError)(e)) throw Error("Not a redirect error");
    return Number(e.digest.split(";").at(-2));
  }
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
