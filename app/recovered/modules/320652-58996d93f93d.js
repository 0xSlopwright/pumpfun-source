// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var r = e.i(732486),
    s = e.i(445242),
    a = e.i(426091),
    t = e.i(705313),
    i = e.i(458310),
    l = e.i(599077);
  e.i(12692);
  var n = e.i(398902),
    o = e.i(741084),
    u = e.i(802630),
    p = e.i(813792),
    d = e.i(897665),
    m = e.i(816897),
    h = e.i(69399);
  e.s([
    "TopbarSquad",
    0,
    function () {
      let e,
        c,
        f,
        g,
        b,
        y,
        I,
        w,
        v,
        C = (0, s.c)(23),
        { t: A } = (0, n.f)(),
        E = (0, l.usePathname)(),
        { squad: U } = (0, m.f)(),
        _ = U?.squad.userId;
      C[0] !== _ || C[1] !== U?.squad
        ? ((e = _
            ? (0, h.Z)({ groupId: _, username: U?.squad.username })
            : null),
          (C[0] = _),
          (C[1] = U?.squad),
          (C[2] = e))
        : (e = C[2]);
      let T = e;
      C[3] !== T || C[4] !== E
        ? ((c = (e) => {
            0 !== e.button ||
              e.metaKey ||
              e.ctrlKey ||
              e.shiftKey ||
              e.altKey ||
              (null !== T && E === T && e.preventDefault());
          }),
          (C[3] = T),
          (C[4] = E),
          (C[5] = c))
        : (c = C[5]);
      let q = c;
      if (!U || !_ || null === T) return null;
      let { username: M, profileImage: P } = U.squad;
      C[6] !== A
        ? ((f = A("web.topbar.view_squad")), (C[6] = A), (C[7] = f))
        : (f = C[7]);
      let G = f,
        V = M || G;
      return (
        C[8] === Symbol.for("react.memo_cache_sentinel")
          ? ((g = (0, a.c)("group max-[480px]:hidden", u.F, u.p)), (C[8] = g))
          : (g = C[8]),
        C[9] === Symbol.for("react.memo_cache_sentinel")
          ? ((b = (0, a.c)(
              u.M,
              "transition-[box-shadow] group-hover:ring-text-quaternary",
            )),
            (C[9] = b))
          : (b = C[9]),
        C[10] !== P
          ? ((y = (0, o.f)(P)), (C[10] = P), (C[11] = y))
          : (y = C[11]),
        C[12] !== _ || C[13] !== y
          ? ((I = (0, r.jsx)("span", {
              "aria-hidden": !0,
              className: b,
              children: (0, r.jsx)(t.f, {
                address: _,
                alt: "",
                className: "size-7 rounded-md object-cover",
                height: 56,
                ipfsPrefix: d.f,
                isAnonymous: !1,
                src: y,
                width: 56,
              }),
            })),
            (C[12] = _),
            (C[13] = y),
            (C[14] = I))
          : (I = C[14]),
        C[15] !== T || C[16] !== G || C[17] !== q || C[18] !== I
          ? ((w = (0, r.jsx)(i.default, {
              "aria-label": G,
              className: g,
              "data-testid": "topbar-squad-trigger",
              href: T,
              onClick: q,
              prefetch: !1,
              children: I,
            })),
            (C[15] = T),
            (C[16] = G),
            (C[17] = q),
            (C[18] = I),
            (C[19] = w))
          : (w = C[19]),
        C[20] !== V || C[21] !== w
          ? ((v = (0, r.jsx)(p.f, { content: V, side: "bottom", children: w })),
            (C[20] = V),
            (C[21] = w),
            (C[22] = v))
          : (v = C[22]),
        v
      );
    },
  ]);
};
