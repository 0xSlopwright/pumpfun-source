// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(365089),
    r = e.i(528600),
    a = e.i(179736),
    n = e.i(741084),
    l = e.i(860787);
  e.s([
    "f",
    0,
    function (e) {
      let s,
        o,
        d,
        u,
        c = (0, t.c)(16),
        {
          address: m,
          user: h,
          fallbackName: f,
          fallbackAvatarUrl: g,
          fallbackXUsername: p,
          enabled: y,
        } = e,
        w = void 0 === y || y,
        x = m ?? "",
        v = w && !!m && null == h;
      c[0] !== x || c[1] !== v
        ? ((s = { userIdentifier: x, enabled: v }),
          (c[0] = x),
          (c[1] = v),
          (c[2] = s))
        : (s = c[2]);
      let { data: E } = (0, r.U)(s),
        _ = (0, a.s)(w ? (h?.userId ?? m) : void 0);
      if (!m) return null;
      let b = h ?? E;
      (c[3] !== m || c[4] !== f || c[5] !== b?.username
        ? ((o = b?.username?.trim() || f?.trim() || (0, i.d)(m, 4, 4)),
          (c[3] = m),
          (c[4] = f),
          (c[5] = b?.username),
          (c[6] = o))
        : (o = c[6]),
        c[7] !== g || c[8] !== b?.profile_image
          ? ((d =
              (0, l.Z)({
                sourceUrl: (0, n.f)(b?.profile_image) ?? (0, n.f)(g ?? void 0),
                width: l.z.list,
              }) ?? null),
            (c[7] = g),
            (c[8] = b?.profile_image),
            (c[9] = d))
          : (d = c[9]));
      let L = b?.x_username ?? p ?? null;
      return (
        c[10] !== m || c[11] !== _ || c[12] !== o || c[13] !== d || c[14] !== L
          ? ((u = {
              address: m,
              displayName: o,
              avatarUrl: d,
              isVerified: _,
              xUsername: L,
            }),
            (c[10] = m),
            (c[11] = _),
            (c[12] = o),
            (c[13] = d),
            (c[14] = L),
            (c[15] = u))
          : (u = c[15]),
        u
      );
    },
  ]);
};
