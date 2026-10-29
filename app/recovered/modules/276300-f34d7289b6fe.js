// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(254667),
    s = t.i(896342),
    i = t.i(526317);
  let n = 3e3,
    a = "quote_unavailable",
    l = (t) => (t instanceof Error ? t.message : String(t)),
    u = (t) => new Promise((e) => setTimeout(e, t)),
    r = (t, e, s) => {
      let i = t.quote_status ?? void 0;
      if ("ready" === i) {
        let i = t.expected_out ?? void 0,
          n = t.min_out ?? void 0;
        if (void 0 === i || void 0 === n || "0" === n)
          return { status: "failed", code: a, source: e, waitMs: s };
        let l = t.slippage_bps ?? void 0;
        return {
          status: "ready",
          expectedOut: i,
          minOut: n,
          ...(void 0 === l ? {} : { slippageBps: l }),
          source: e,
          waitMs: s,
        };
      }
      if ("failed" === i)
        return {
          status: "failed",
          code: t.quote_fail_code ?? a,
          source: e,
          waitMs: s,
        };
    },
    m = (t, e) =>
      null == t.quote_status
        ? {
            status: "failed",
            code: "quote_status_missing",
            source: "get",
            waitMs: e,
          }
        : r(t, "get", e),
    o = async ({ intentId: t, feed: a, signal: o, waitQuoteMs: c = n }) => {
      let d,
        h,
        p = performance.now(),
        b = () => performance.now() - p,
        f = new AbortController(),
        g = () => f.abort();
      (o?.aborted && g(), o?.addEventListener("abort", g, { once: !0 }));
      let v = new Promise((t) => {
        d = t;
      });
      a?.listen((s) => {
        if (!(0, i.C)(s.intent_id, t)) return;
        let n = r(s, "push", b());
        n &&
          (e.y.info("[bridgeQuoteWait] quote_from_push", {
            intent_id: t,
            quote_status: n.status,
            code: "failed" === n.status ? n.code : void 0,
            seq: s.seq,
          }),
          d?.(n));
      });
      let k = async () => {
          let i = 0;
          for (;;) {
            let n;
            try {
              n = await (0, s.M)(t, { signal: f.signal, waitQuoteMs: c });
            } catch (s) {
              if (f.signal.aborted) {
                if (o?.aborted) throw s;
                return v;
              }
              if (
                ((i += 1),
                e.y.warn("[bridgeQuoteWait] read_failed", {
                  intent_id: t,
                  attempt: i,
                  error: l(s),
                }),
                i >= 3)
              )
                return {
                  status: "failed",
                  code: "quote_unreadable",
                  source: "get",
                  waitMs: b(),
                };
              await u(250);
              continue;
            }
            i = 0;
            let a = m(n, b());
            if (a) return a;
          }
        },
        _ = () => {
          (g(), o?.removeEventListener("abort", g));
        };
      try {
        h = await Promise.race([v, k()]);
      } catch (t) {
        throw (_(), t);
      }
      return (_(), h);
    };
  t.s(["f", 0, a, "Z", 0, o]);
};
