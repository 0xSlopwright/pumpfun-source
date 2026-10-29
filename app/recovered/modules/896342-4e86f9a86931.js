// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(149502),
    n = e.i(254667),
    r = e.i(313017),
    s = e.i(641947);
  e.i(22675);
  var i = e.i(371047),
    a = e.i(25572),
    o = e.i(526317);
  let l = { "x-pump-platform": "web" },
    u = () => {
      let e = t.default.env.NEXT_PUBLIC_BRIDGE_API_URL?.trim();
      return void 0 !== e && "" !== e
        ? e.replace(/\/+$/, "")
        : s.A
          ? "https://intents.pump.fun"
          : "";
    },
    c = async (e) => {
      let t;
      try {
        t = await e.json();
      } catch {
        t = void 0;
      }
      return new o.b({
        status: e.status,
        code: t?.code,
        message: t?.message ?? `Bridge request failed (${e.status})`,
      });
    },
    d = async ({ request: e, schema: t, label: s }) => {
      let i,
        a,
        d = u();
      if ("" === d)
        throw new o.b({
          code: "bridge_disabled",
          retryable: !1,
          message: "the bridge is not configured for this network",
        });
      let f = new URL(`${d}/${e.path.replace(/^\/+/, "")}`);
      for (let [t, n] of Object.entries(e.searchParams ?? {}))
        f.searchParams.set(t, n);
      try {
        i = await fetch(f, {
          method: e.method,
          credentials: "include",
          headers: {
            ...l,
            ...(0, r.z)(),
            ...(e.json ? { "content-type": "application/json" } : {}),
            ...e.headers,
          },
          body: e.json ? JSON.stringify(e.json) : void 0,
          signal: e.signal ?? AbortSignal.timeout(6e4),
        });
      } catch (e) {
        if (
          e instanceof DOMException
            ? "AbortError" === e.name || "TimeoutError" === e.name
            : e instanceof Error && "AbortError" === e.name
        )
          throw e;
        throw new o.b({
          retryable: !0,
          message:
            e instanceof Error ? e.message : "Network error calling the bridge",
        });
      }
      if (!i.ok) throw await c(i);
      try {
        a = await i.json();
      } catch {
        throw new o.b({ message: `malformed ${s} response` });
      }
      let m = t.safeParse(a);
      if (!m.success)
        throw (
          n.y.error(`[bridgeApi] Unexpected ${s} response shape`, {
            issues: m.error.issues,
          }),
          new o.b({ message: `malformed ${s} response` })
        );
      return m.data;
    };
  e.s([
    "f",
    0,
    (e, t = {}) =>
      d({
        request: {
          method: "POST",
          path: "v1/intents",
          json: { ...e, ...(0, a.c)() },
          headers: {
            ...(0, i.c)(),
            ...(t.idempotencyKey
              ? { "idempotency-key": t.idempotencyKey }
              : {}),
          },
          signal: t.signal,
        },
        schema: o.Z,
        label: "create-intent",
      }),
    "x",
    0,
    (e, t, n = {}) =>
      d({
        request: {
          method: "POST",
          path: "v1/intents/execute",
          json: { intent_id: e, ...t },
          signal: n.signal,
        },
        schema: o.P,
        label: "execute-intent",
      }),
    "M",
    0,
    (e, t = {}) =>
      d({
        request: {
          method: "GET",
          path: `v1/intents/${encodeURIComponent(e)}`,
          searchParams:
            void 0 === t.waitQuoteMs
              ? void 0
              : { wait_quote_ms: String(t.waitQuoteMs) },
          signal: t.signal,
        },
        schema: o.u,
        label: "intent",
      }),
    "o",
    0,
    (e, t = {}) =>
      d({
        request: {
          method: "POST",
          path: "v1/quotes",
          json: { ...e, ...(0, a.c)() },
          signal: t.signal,
        },
        schema: o.O,
        label: "quote",
      }),
    "l",
    0,
    ({ evmChainId: e, evmToken: t }, n = {}) =>
      d({
        request: {
          method: "GET",
          path: `v1/tokens/${e}/${encodeURIComponent(t)}`,
          signal: n.signal,
        },
        schema: o.m,
        label: "token-tradability",
      }),
    "z",
    0,
    () => `${u().replace(/^http/, "ws")}/v1/ws`,
    "_",
    0,
    () => "" !== u(),
  ]);
};
