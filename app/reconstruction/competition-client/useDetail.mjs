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
      c = (0, t.c)(17),
      { idOrSlug: m, isVisible: p } = e,
      h = (0, r.useClientServerContract)(),
      f = (0, n.f)("competitions"),
      g = null !== m,
      y = (0, i.q)(15e3, g && p);
    (c[0] !== m || c[1] !== f
      ? ((s = a.f.detail(m ?? "", f)), (c[0] = m), (c[1] = f), (c[2] = s))
      : (s = c[2]),
      c[3] !== h || c[4] !== m
        ? ((o = (e) => {
            let { signal: t } = e;
            return h("GET /competitions/{idOrSlug}", {
              params: { idOrSlug: m ?? "" },
              signal: t,
            });
          }),
          (c[3] = h),
          (c[4] = m),
          (c[5] = o))
        : (o = c[5]),
      c[6] !== g || c[7] !== y || c[8] !== s || c[9] !== o
        ? ((d = {
            queryKey: s,
            queryFn: o,
            enabled: g,
            staleTime: 5e3,
            refetchInterval: y,
          }),
          (c[6] = g),
          (c[7] = y),
          (c[8] = s),
          (c[9] = o),
          (c[10] = d))
        : (d = c[10]));
    let b = (0, l.useQuery)(d),
      v = g ? b.data : void 0,
      w = g && b.isLoading;
    return (
      c[11] !== b.isError ||
      c[12] !== b.isRefetching ||
      c[13] !== b.refetch ||
      c[14] !== v ||
      c[15] !== w
        ? ((u = {
            data: v,
            isLoading: w,
            isError: b.isError,
            isRefetching: b.isRefetching,
            refetch: b.refetch,
          }),
          (c[11] = b.isError),
          (c[12] = b.isRefetching),
          (c[13] = b.refetch),
          (c[14] = v),
          (c[15] = w),
          (c[16] = u))
        : (u = c[16]),
      u
    );
  };
}
