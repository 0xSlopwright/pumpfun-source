// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n =
    (e.e && e.e.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.default = function (e) {
      let { apiKey: t, ...r } = e,
        n = { ...r, key: t },
        { html: a } = (0, s.GoogleMapsEmbed)(n);
      return (0, i.jsx)(o.default, {
        height: n.height || null,
        width: n.width || null,
        html: a,
        dataNtpc: "GoogleMapsEmbed",
      });
    }));
  let i = e.r(732486),
    s = e.r(508751),
    o = n(e.r(375066));
};
