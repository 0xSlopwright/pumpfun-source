// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(254667),
    n = e.i(352386),
    i = e.i(515285);
  let a =
      /^(?:chrome-extension|moz-extension|safari-extension|safari-web-extension|webkit-masked-url):\/\//,
    s = /^\s+at .* @ (\S+?)(?::\d+:\d+)?$/,
    o = "'wasm-unsafe-eval' https://*.appsflyer.com",
    l = /the policy "/,
    c =
      /script-src 'unsafe-inline' 'unsafe-eval'; connect-src 'none'; report-uri https:\/\/csp-reporting\.cloud/,
    u =
      /csp_violation: '(?:wasm-)?eval' blocked by 'script-src(?:-elem|-attr)?' directive/,
    d =
      /(?:chrome-extension|moz-extension|safari-web-extension|safari-extension|user-script):|https:\/\/www\.googletagmanager\.com\//,
    m =
      /'unsafe-eval' is not an allowed source of script|because 'unsafe-eval' is not an allowed source of script/,
    f =
      /(?:chrome-extension|moz-extension|safari-web-extension|safari-extension|user-script):|tradingview|charting_library/i,
    p =
      /csp_violation: 'https:\/\/www\.google(?:\.[a-z]{2,3}){1,2}\/ads\/ga-audiences\?[^']*' blocked by 'connect-src' directive/,
    h =
      /csp_violation: 'https:\/\/(?:[a-z0-9-]+\.google-analytics\.com|analytics\.google\.com|stats\.g\.doubleclick\.net)\/[^']*' blocked by 'connect-src' directive/,
    y =
      /csp_violation: 'https:\/\/unpkg\.com(?::443)?\/web-vitals(?:@[^'\/]*)?\/[^']*' blocked by 'script-src(?:-elem)?' directive/,
    b =
      /csp_violation: 'wss?:\/\/[^']*:9222\/?' blocked by 'connect-src' directive/,
    g = new Set([
      "account",
      "application_id",
      "date",
      "ddtags",
      "error",
      "http",
      "logger",
      "message",
      "origin",
      "service",
      "session",
      "session_id",
      "status",
      "user_action",
      "usr",
      "view",
    ]),
    v = /(?:0x)?[\dA-Fa-f]{64}/g,
    w =
      /^(?:uncaught\s+)?"?resizeobserver loop (?:completed with undelivered notifications|limit exceeded)/i;
  var x = e.i(372123);
  let _ = /^ws error:/;
  var S = e.i(874568);
  let j = !1,
    E = { dedupeWindowMs: 2e3, maxPerMinute: 60, maxPerSession: 1e3 },
    k = async ({ applicationId: t, clientToken: r, env: n }, i) => {
      let g,
        v,
        { datadogRum: j } = await e.A(276838);
      if (i() || j.getInitConfiguration()) return;
      let k =
          ((v = 0),
          (e) => {
            if ("error" !== e.type || !w.test(e.error.message ?? "")) return !1;
            let t = e.view?.id;
            return (t !== g && ((g = t), (v = 0)), !(v < 1) || ((v += 1), !1));
          }),
        C = (0, x.D)({
          budget: (0, x.S)(E),
          onExhausted: (e) => {
            let { error: t, context: r } = (0, x.n)(e);
            j.addError(t, r);
          },
        });
      j.init({
        applicationId: t,
        clientToken: r,
        site: "datadoghq.com",
        service: "frontend",
        env: n,
        sessionSampleRate: 20,
        sessionReplaySampleRate: 1,
        trackUserInteractions: !0,
        trackResources: !1,
        trackLongTasks: !1,
        defaultPrivacyLevel: "mask-user-input",
        allowedTracingUrls: [
          {
            match: (e) => e.startsWith(window.location.origin),
            propagatorTypes: ["tracecontext"],
          },
        ],
        traceSampleRate: 20,
        beforeSend: (e) =>
          !(
            ((e) => {
              if ("error" !== e.type) return !1;
              let { error: t } = e;
              if (!t.message?.includes("csp_violation")) return !1;
              let r = `${t.message ?? ""} ${t.stack ?? ""}`;
              return !!l.test(r) && !r.includes(o);
            })(e) ||
            ((e) => {
              if ("error" !== e.type) return !1;
              let { error: t } = e;
              return (
                !!t.message?.includes("csp_violation") &&
                c.test(`${t.message ?? ""} ${t.stack ?? ""}`)
              );
            })(e) ||
            ((e) => {
              if ("error" !== e.type) return !1;
              let { error: t } = e,
                r = `${t.message ?? ""} ${t.stack ?? ""}`;
              return !!u.test(r) && d.test(r);
            })(e) ||
            ("error" === e.type && b.test(e.error.message ?? ""))
          ) &&
          !(
            ("error" === e.type && y.test(e.error.message ?? "")) ||
            ((e) => {
              if ("error" !== e.type) return !1;
              let { error: t } = e;
              if (!t.message?.includes("csp_violation")) return !1;
              if (p.test(t.message)) return !0;
              let r = `${t.message ?? ""} ${t.stack ?? ""}`;
              return !!r.includes(o) && h.test(r);
            })(e) ||
            ((e) => {
              if ("error" !== e.type) return !1;
              let { error: t } = e,
                r = `${t.message ?? ""} ${t.stack ?? ""}`;
              return !!m.test(r) && !!r.includes(o) && f.test(r);
            })(e) ||
            ((e) => {
              if ("error" !== e.type) return !1;
              let { error: t } = e;
              return "console" === t.source && _.test(t.message ?? "");
            })(e) ||
            k(e) ||
            ((e) => {
              if ("error" !== e.type) return !1;
              let t = e.error.stack;
              if (!t) return !1;
              let r = 0;
              for (let e of t.split("\n")) {
                let t = s.exec(e)?.[1];
                if (t && t.includes("://")) {
                  if (!a.test(t)) return !1;
                  r += 1;
                }
              }
              return r > 0;
            })(e) ||
            C(e)
          ) &&
          (e.view?.url && (e.view.url = (0, S.f)(e.view.url)),
          e.view?.referrer && (e.view.referrer = (0, S.f)(e.view.referrer)),
          !0),
      });
    };
  function C() {
    let e = "pubd53aa353c3fdab89107af32a2a8b48c0",
      t = "production";
    if (i.G.test(navigator.userAgent)) return;
    let n = !1,
      a = () => n,
      s = () => {
        ((({ clientToken: e, env: t }) => {
          j ||
            ((j = !0),
            r.y.init({
              clientToken: e,
              site: "datadoghq.com",
              service: "frontend",
              env: t,
              sourcePackage: "frontend",
              sessionSampleRate: 20,
              forwardErrorsToLogs: !1,
              forwardConsoleLogs: [],
              beforeSend: (e) => {
                for (let [t, r] of (e.view?.url &&
                  (e.view.url = (0, S.f)(e.view.url)),
                e.view?.referrer &&
                  (e.view.referrer = (0, S.f)(e.view.referrer)),
                e.message &&
                  (e.message = e.message.replace(
                    v,
                    "[REDACTED_EVM_PRIVATE_KEY]",
                  )),
                e.error?.stack &&
                  (e.error.stack = e.error.stack.replace(
                    v,
                    "[REDACTED_EVM_PRIVATE_KEY]",
                  )),
                Object.entries(e))) {
                  if (g.has(t)) continue;
                  let n = (function e(t, r = 0) {
                    let n = {};
                    for (let [i, a] of Object.entries(t))
                      n[i] = (function t(r, n) {
                        return n > 10
                          ? "[MAX_DEPTH]"
                          : "string" == typeof r
                            ? r.replace(v, "[REDACTED_EVM_PRIVATE_KEY]")
                            : Array.isArray(r)
                              ? r.map((e) => t(e, n + 1))
                              : null !== r &&
                                  "object" == typeof r &&
                                  (function (e) {
                                    let t = Object.getPrototypeOf(e);
                                    return t === Object.prototype || null === t;
                                  })(r)
                                ? e(r, n + 1)
                                : r;
                      })(a, r);
                    return n;
                  })({ [t]: r })[t];
                  e[t] = n;
                }
                return !0;
              },
            }));
        })({ clientToken: e, env: t }),
          k(
            {
              applicationId: "d742b24c-8e81-460e-b527-ab06bf4c2ba5",
              clientToken: e,
              env: t,
            },
            a,
          ));
      };
    if ("function" == typeof window.requestIdleCallback) {
      let e = window.requestIdleCallback(s, { timeout: 2e3 });
      return () => {
        ((n = !0), window.cancelIdleCallback?.(e));
      };
    }
    let o = setTimeout(s, 1);
    return () => {
      ((n = !0), clearTimeout(o));
    };
  }
  e.s(
    [
      "default",
      0,
      function () {
        let e,
          r = (0, t.c)(1);
        return (
          r[0] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = []), (r[0] = e))
            : (e = r[0]),
          (0, n.useEffect)(C, e),
          null
        );
      },
    ],
    704631,
  );
};
