// Source-adapted complete original hook. Providers remain explicit capabilities.
export function createHook({
  useMemoCache,
  useClientServerContract,
  useQuery,
  useForegroundInterval,
  keys,
  useViewerKey,
}) {
  var t = { c: useMemoCache },
    r = { useClientServerContract: useClientServerContract },
    l = { useQuery: useQuery },
    i = { q: useForegroundInterval },
    a = { f: keys },
    n = { f: useViewerKey };
  return (e) => {
    let s,
      o,
      d,
      u,
      c = (0, t.c)(14),
      { isVisible: m } = e,
      p = (0, r.useClientServerContract)(),
      h = (0, n.f)("competitions"),
      f = (0, i.q)(6e4, m);
    (c[0] !== h ? ((s = a.f.list(h)), (c[0] = h), (c[1] = s)) : (s = c[1]),
      c[2] !== p
        ? ((o = (e) => {
            let { signal: t } = e;
            return p("GET /competitions", { signal: t });
          }),
          (c[2] = p),
          (c[3] = o))
        : (o = c[3]),
      c[4] !== f || c[5] !== s || c[6] !== o
        ? ((d = {
            queryKey: s,
            queryFn: o,
            staleTime: 15e3,
            refetchInterval: f,
          }),
          (c[4] = f),
          (c[5] = s),
          (c[6] = o),
          (c[7] = d))
        : (d = c[7]));
    let g = (0, l.useQuery)(d);
    return (
      c[8] !== g.data ||
      c[9] !== g.isError ||
      c[10] !== g.isLoading ||
      c[11] !== g.isRefetching ||
      c[12] !== g.refetch
        ? ((u = {
            data: g.data,
            isLoading: g.isLoading,
            isError: g.isError,
            isRefetching: g.isRefetching,
            refetch: g.refetch,
          }),
          (c[8] = g.data),
          (c[9] = g.isError),
          (c[10] = g.isLoading),
          (c[11] = g.isRefetching),
          (c[12] = g.refetch),
          (c[13] = u))
        : (u = c[13]),
      u
    );
  };
}
