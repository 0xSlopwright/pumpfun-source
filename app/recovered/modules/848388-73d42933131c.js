// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n =
    (e.e && e.e.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.default = function (e) {
      let { html: t, scripts: r, stylesheets: n } = (0, o.YouTubeEmbed)(e);
      return (0, i.jsx)(a.default, {
        height: e.height || null,
        width: e.width || null,
        html: t,
        dataNtpc: "YouTubeEmbed",
        children:
          null == r
            ? void 0
            : r.map((e) =>
                (0, i.jsx)(
                  s.default,
                  { src: e.url, strategy: l[e.strategy], stylesheets: n },
                  e.url,
                ),
              ),
      });
    }));
  let i = e.r(732486),
    s = n(e.r(54403)),
    o = e.r(508751),
    a = n(e.r(375066)),
    l = {
      server: "beforeInteractive",
      client: "afterInteractive",
      idle: "lazyOnload",
      worker: "worker",
    };
};
