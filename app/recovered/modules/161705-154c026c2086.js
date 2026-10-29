// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(574472),
    a = e.i(690877),
    l = e.i(606933),
    r = e.i(85324),
    i = e.i(759257),
    n = e.i(541710),
    o = e.i(646908),
    s = e.i(779106);
  let c = { eligible: !0, createDenialVerdict: null, positionValueUsd: null },
    u = new Set([
      "INSUFFICIENT_BALANCE",
      "COOLDOWN",
      "RESTRICTED",
      "WALLET_NOT_LINKED",
      "MAYHEM_NOT_COMPLETED",
    ]);
  e.s([
    "f",
    0,
    function (e) {
      let {
          mint: d,
          chainId: m,
          chain: f,
          enabled: p = !0,
          pollWhileDenied: _ = !1,
        } = e,
        h = (0, n.l)(),
        g =
          f ?? ((0, o.L)(m) ? o.J : (0, o.B)(m) && (0, n.M)(h) ? o.d : void 0),
        { address: b } = (0, t.F)(),
        x = (0, s.f)("callout-eligibility"),
        y = (0, l.useQueryClient)(),
        v = ["callouts", "eligibility", d, x, ...(g ? [{ chain: g }] : [])],
        E = y.getQueryData(v)?.createDenialVerdict === "INSUFFICIENT_BALANCE",
        w = (0, r.q)(5e3, _ && E);
      return (0, a.useQuery)({
        queryKey: v,
        queryFn: async () => {
          var e;
          let t, a, l;
          if (!d) throw Error("mint is required");
          if (!b) return c;
          try {
            t = await (0, i.j)()("GET /callout/eligibility/{coinMint}", {
              params: { coinMint: d },
              ...(g ? { query: { chain: g } } : {}),
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            });
          } catch {
            return c;
          }
          if ("boolean" != typeof t?.eligible) return c;
          let r =
            ((e = t.preflight),
            (a = e?.create?.verdict),
            (l = e?.postableAccounts?.[0]?.position?.valueUsd),
            {
              createDenialVerdict: "string" == typeof a && u.has(a) ? a : null,
              positionValueUsd:
                "number" == typeof l && Number.isFinite(l) ? l : null,
            });
          if (t.eligible) return { eligible: !0, ...r };
          let n =
            t.reason?.type === "EXISTING_CALLOUT"
              ? t.reason.existingCallout
              : void 0;
          return {
            eligible: !1,
            reason: t.reason?.type ?? "EXISTING_CALLOUT",
            existingCalloutId: n?.calloutId,
            calloutAt: n?.createdAt,
            ...r,
          };
        },
        enabled: p && !!d,
        staleTime: 5e3,
        gcTime: 6e4,
        refetchOnWindowFocus: !1,
        refetchInterval: w,
        retry: !1,
      });
    },
  ]);
};
