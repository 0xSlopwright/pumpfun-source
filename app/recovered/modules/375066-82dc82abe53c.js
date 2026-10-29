// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.default = function ({
      html: e,
      height: t = null,
      width: r = null,
      children: s,
      dataNtpc: o = "",
    }) {
      return (
        (0, i.useEffect)(() => {
          o &&
            performance.mark("mark_feature_usage", {
              detail: { feature: `next-third-parties-${o}` },
            });
        }, [o]),
        (0, n.jsxs)(n.Fragment, {
          children: [
            s,
            e
              ? (0, n.jsx)("div", {
                  style: {
                    height: null != t ? `${t}px` : "auto",
                    width: null != r ? `${r}px` : "auto",
                  },
                  "data-ntpc": o,
                  dangerouslySetInnerHTML: { __html: e },
                })
              : null,
          ],
        })
      );
    }));
  let n = e.r(732486),
    i = e.r(352386);
};
