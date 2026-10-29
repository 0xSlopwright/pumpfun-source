// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(944410),
    r = e.i(690877),
    i = e.i(613677),
    o = e.i(169119),
    s = e.i(342463);
  let a = i.z.object({
    map: o.z.record(
      s.z.string(),
      i.z.object({
        playlistUrl: s.z.string().nullish(),
        playlistUrlLow: s.z.string().nullish(),
        playlistUrlHigh: s.z.string().nullish(),
        vodPlaylistUrl: s.z.string().nullish(),
        startedAt: s.z.string().nullish(),
        endedAt: s.z.string().nullish(),
        updatedAt: s.z.string().nullish(),
        status: s.z.string().nullish(),
      }),
    ),
  });
  e.s([
    "S",
    0,
    a,
    "K",
    0,
    (e) => e?.vodPlaylistUrl || e?.playlistUrl,
    "W",
    0,
    (e, i) => {
      let o,
        s,
        l,
        c,
        u,
        d,
        m = (0, t.c)(16);
      m[0] !== i
        ? (({ onSuccess: o, ...s } = i), (m[0] = i), (m[1] = o), (m[2] = s))
        : ((o = m[1]), (s = m[2]));
      let E = (0, n.useLivestreamApiClient)();
      return (
        m[3] !== e
          ? ((l = ["stream-playlist", e]), (m[3] = e), (m[4] = l))
          : (l = m[4]),
        m[5] !== E || m[6] !== o || m[7] !== e
          ? ((c = async () => {
              let t = await E.post("livestream/playlist-map", {
                  json: { mints: [e] },
                }).json(),
                n = a.parse(t);
              return (o?.(n.map[e]), n.map[e]);
            }),
            (m[5] = E),
            (m[6] = o),
            (m[7] = e),
            (m[8] = c))
          : (c = m[8]),
        m[9] !== s
          ? ((u = (e) =>
              !!(
                s?.enabled &&
                (!e.state.data || e.state.data?.endedAt || !s.isPlaylistActive)
              ) && 5e3),
            (m[9] = s),
            (m[10] = u))
          : (u = m[10]),
        m[11] !== s || m[12] !== l || m[13] !== c || m[14] !== u
          ? ((d = { queryKey: l, queryFn: c, refetchInterval: u, ...s }),
            (m[11] = s),
            (m[12] = l),
            (m[13] = c),
            (m[14] = u),
            (m[15] = d))
          : (d = m[15]),
        (0, r.useQuery)(d)
      );
    },
  ]);
};
