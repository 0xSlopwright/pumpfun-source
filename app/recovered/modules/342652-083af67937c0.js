// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(313017),
    a = e.i(503630);
  e.i(22675);
  var r = e.i(371047),
    n = e.i(233404);
  let i = (e) => Math.min(600 * 2 ** (e - 1), 1200),
    l = (e) => e >= 500 || 429 === e,
    s = (e) => new Promise((t) => setTimeout(t, e)),
    o = (e, t) => {
      let a = new AbortController(),
        r = setTimeout(
          () =>
            a.abort(
              new DOMException(
                `Request timed out after ${t} ms`,
                "TimeoutError",
              ),
            ),
          t,
        ),
        n = () => a.abort(e?.reason);
      return (
        e?.aborted ? n() : e?.addEventListener("abort", n, { once: !0 }),
        {
          signal: a.signal,
          release: () => {
            (clearTimeout(r), e?.removeEventListener("abort", n));
          },
        }
      );
    };
  async function d(e, t, a = {}) {
    return u({ method: "POST", path: e, json: t, options: a });
  }
  async function c(e, t = {}) {
    return u({ method: "GET", path: e, options: t });
  }
  async function u({ method: e, path: d, json: c, options: f }) {
    let m,
      h = (0, a.t)().replace(/\/+$/, ""),
      p = `${h}/${d.replace(/^\/+/, "")}`,
      g = f.retryLimit ?? 2,
      w = f.timeoutMs ?? 3e4;
    for (let a = 0; a <= g; a++) {
      let d, u;
      if ((a > 0 && (await s(i(a))), f.signal?.aborted)) throw f.signal.reason;
      let h = o(f.signal, w);
      try {
        d = await fetch(p, {
          method: e,
          headers:
            "POST" === e
              ? {
                  "Content-Type": "application/json",
                  ...(0, r.c)(f.txEncoding),
                  ...(0, t.z)(),
                }
              : (0, t.z)(),
          ...("POST" === e ? { body: JSON.stringify((0, n.Y)(c ?? {})) } : {}),
          signal: h.signal,
        });
      } catch (e) {
        if ((h.release(), f.signal?.aborted)) throw e;
        m = e;
        continue;
      }
      if (l(d.status) && a < g) {
        h.release();
        continue;
      }
      try {
        u = await d.json();
      } catch {
        u = void 0;
      } finally {
        h.release();
      }
      return { status: d.status, body: u };
    }
    throw m instanceof Error
      ? m
      : Error("Network error calling blockchain-api-service");
  }
  e.s(["p", 0, c, "b", 0, d]);
};
