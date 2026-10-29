// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n = e.i(753887);
  Object.defineProperty(r, "__esModule", { value: !0 });
  var i = e.r(299014);
  function o(e, t) {
    return (void 0 === t && (t = "utf8"), n.Buffer.isBuffer(e))
      ? s(e.toString("base64"))
      : s(n.Buffer.from(e, t).toString("base64"));
  }
  function a(e) {
    return (
      (e = e.toString()),
      i.default(e).replace(/\-/g, "+").replace(/_/g, "/")
    );
  }
  function s(e) {
    return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  ((o.encode = o),
    (o.decode = function (e, t) {
      return (
        void 0 === t && (t = "utf8"),
        n.Buffer.from(a(e), "base64").toString(t)
      );
    }),
    (o.toBase64 = a),
    (o.fromBase64 = s),
    (o.toBuffer = function (e) {
      return n.Buffer.from(a(e), "base64");
    }),
    (r.default = o));
};
