// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let { ArrayPrototypePop: n, Promise: i } = e.r(763323),
    { isIterable: o, isNodeStream: a, isWebStream: s } = e.r(283234),
    { pipelineImpl: l } = e.r(755755),
    { finished: u } = e.r(294343);
  (e.r(914557),
    (t.exports = {
      finished: u,
      pipeline: function (...e) {
        return new i((t, r) => {
          let i,
            u,
            d = e[e.length - 1];
          if (d && "object" == typeof d && !a(d) && !o(d) && !s(d)) {
            let t = n(e);
            ((i = t.signal), (u = t.end));
          }
          l(
            e,
            (e, n) => {
              e ? r(e) : t(n);
            },
            { signal: i, end: u },
          );
        });
      },
    }));
};
