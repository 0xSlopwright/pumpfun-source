// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    a = e.i(445242);
  e.i(12692);
  var l = e.i(117466),
    r = e.i(398902),
    i = e.i(148003),
    n = e.i(338319);
  e.s(
    [
      "f",
      0,
      function (e) {
        let o,
          s,
          c,
          u,
          d,
          m,
          f,
          p,
          _,
          h,
          g,
          b,
          x,
          y,
          v,
          E = (0, a.c)(37),
          { density: w, onDismiss: L, className: C } = e,
          { t: N } = (0, r.f)();
        return (
          E[0] !== C
            ? ((o = (0, n.c)(C, "border-l-2 border-l-bg-accent")),
              (E[0] = C),
              (E[1] = o))
            : (o = E[1]),
          E[2] !== N
            ? ((s = N("web.callouts.quality_tip_title")),
              (E[2] = N),
              (E[3] = s))
            : (s = E[3]),
          E[4] !== s
            ? ((c = (0, t.jsx)("span", {
                "data-slot": "quality-tip-lead",
                className: "text-text-accent",
                children: s,
              })),
              (E[4] = s),
              (E[5] = c))
            : (c = E[5]),
          E[6] !== N
            ? ((u = N("web.callouts.quality_tip_dismiss_a11y")),
              (E[6] = N),
              (E[7] = u))
            : (u = E[7]),
          E[8] !== N
            ? ((d = N("common.dismiss")), (E[8] = N), (E[9] = d))
            : (d = E[9]),
          E[10] !== L || E[11] !== u || E[12] !== d
            ? ((m = (0, t.jsx)("button", {
                type: "button",
                onClick: L,
                "aria-label": u,
                className:
                  "ml-auto text-xs leading-4 text-text-tertiary underline underline-offset-2 transition-colors hover:text-text-primary",
                children: d,
              })),
              (E[10] = L),
              (E[11] = u),
              (E[12] = d),
              (E[13] = m))
            : (m = E[13]),
          E[14] !== c || E[15] !== m
            ? ((f = (0, t.jsxs)("span", {
                className: "flex items-center gap-3",
                children: [c, m],
              })),
              (E[14] = c),
              (E[15] = m),
              (E[16] = f))
            : (f = E[16]),
          E[17] !== N
            ? ((p = N("web.callouts.quality_tip_body")),
              (E[17] = N),
              (E[18] = p))
            : (p = E[18]),
          E[19] !== p
            ? ((_ = (0, t.jsx)("span", {
                "data-slot": "quality-tip-body",
                className: "mt-0.5 block text-text-secondary",
                children: p,
              })),
              (E[19] = p),
              (E[20] = _))
            : (_ = E[20]),
          E[21] !== N
            ? ((h = N("web.callouts.quality_tip_example_label")),
              (E[21] = N),
              (E[22] = h))
            : (h = E[22]),
          E[23] !== h
            ? ((g = (0, t.jsx)("span", {
                "data-slot": "quality-tip-example-label",
                className: "text-xs leading-4 text-text-quaternary",
                children: h,
              })),
              (E[23] = h),
              (E[24] = g))
            : (g = E[24]),
          E[25] === Symbol.for("react.memo_cache_sentinel")
            ? ((b = {
                cite: (0, t.jsx)("span", {
                  "data-slot": "quality-tip-source",
                  className: "text-text-accent underline underline-offset-2",
                }),
              }),
              (E[25] = b))
            : (b = E[25]),
          E[26] !== N
            ? ((x = (0, t.jsx)("span", {
                "data-slot": "quality-tip-example",
                className: "text-[13px] leading-[18px] text-text-secondary",
                children: (0, t.jsx)(l.f, {
                  t: N,
                  i18nKey: "web.callouts.quality_tip_example",
                  components: b,
                }),
              })),
              (E[26] = N),
              (E[27] = x))
            : (x = E[27]),
          E[28] !== g || E[29] !== x
            ? ((y = (0, t.jsxs)("span", {
                className:
                  "mt-1.5 flex flex-col gap-0.5 rounded-md bg-bg-tertiary px-3 py-1.5",
                children: [g, x],
              })),
              (E[28] = g),
              (E[29] = x),
              (E[30] = y))
            : (y = E[30]),
          E[31] !== w ||
          E[32] !== o ||
          E[33] !== y ||
          E[34] !== f ||
          E[35] !== _
            ? ((v = (0, t.jsxs)(i.f, {
                density: w,
                className: o,
                children: [f, _, y],
              })),
              (E[31] = w),
              (E[32] = o),
              (E[33] = y),
              (E[34] = f),
              (E[35] = _),
              (E[36] = v))
            : (v = E[36]),
          v
        );
      },
    ],
    46894,
  );
  var o = e.i(690877),
    s = e.i(536925),
    c = e.i(997887),
    u = e.i(759257),
    d = e.i(369091),
    m = e.i(358893),
    f = e.i(930234),
    p = e.i(493025);
  function _(e, t, a) {
    if (!a.ok) throw Error(`Coin search failed: ${a.status}`);
  }
  e.s(
    [
      "f",
      0,
      function (e) {
        let t,
          l,
          r,
          i,
          n = (0, a.c)(14),
          { term: h, enabled: g } = e;
        n[0] !== h ? ((t = h.trim()), (n[0] = h), (n[1] = t)) : (t = n[1]);
        let [b] = (0, s.r)(t, 250),
          { ipfsPrefix: x } = (0, d.useIpfsPrefix)(),
          y = (0, m.M)();
        n[2] !== b || n[3] !== y || n[4] !== x
          ? ((l = ["callouts", "coin-search", b, y, x]),
            (n[2] = b),
            (n[3] = y),
            (n[4] = x),
            (n[5] = l))
          : (l = n[5]);
        let v = (void 0 === g || g) && b.length >= 1;
        return (
          n[6] !== b || n[7] !== y || n[8] !== x
            ? ((r = async (e) => {
                let { signal: t } = e,
                  a = await (0, u.j)()("GET /coins/search-unrestricted", {
                    query: {
                      searchTerm: b,
                      limit: 10,
                      offset: 0,
                      includeNsfw: y,
                      sort: "market_cap",
                      order: "DESC",
                    },
                    credentials: "include",
                    signal: t,
                    hooks: { afterResponse: [_] },
                  });
                return (0, p.f)((0, c.l)(a), x).filter(f.f);
              }),
              (n[6] = b),
              (n[7] = y),
              (n[8] = x),
              (n[9] = r))
            : (r = n[9]),
          n[10] !== l || n[11] !== v || n[12] !== r
            ? ((i = { queryKey: l, enabled: v, staleTime: 3e4, queryFn: r }),
              (n[10] = l),
              (n[11] = v),
              (n[12] = r),
              (n[13] = i))
            : (i = n[13]),
          (0, o.useQuery)(i)
        );
      },
    ],
    342606,
  );
};
