// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(352386),
    r = e.i(599077);
  function n() {
    return false;
  }
  function i(e) {
    return RegExp(`/${e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=[/?#]|$)`);
  }
  var a = "https://va.vercel-scripts.com/v1/speed-insights",
    s = `${a}/script.js`,
    o = `${a}/script.debug.js`;
  function l(e) {
    let r = (0, t.useRef)(null);
    return (
      (0, t.useEffect)(() => {
        if (r.current) e.route && r.current(e.route);
        else {
          let t = (function (e = {}) {
            var t;
            if (!("u" > typeof window) || null === e.route) return null;
            window.si ||
              (window.si = function (...e) {
                (window.siq = window.siq || []).push(e);
              });
            let r = !!e.dsn,
              i =
                e.scriptSrc ||
                (n() ? o : r ? s : "/_vercel/speed-insights/script.js");
            if (document.head.querySelector(`script[src*="${i}"]`)) return null;
            e.beforeSend &&
              (null == (t = window.si) ||
                t.call(window, "beforeSend", e.beforeSend));
            let a = document.createElement("script");
            return (
              (a.src = i),
              (a.defer = !0),
              (a.dataset.sdkn =
                "@vercel/speed-insights" +
                (e.framework ? `/${e.framework}` : "")),
              (a.dataset.sdkv = "1.0.12"),
              e.sampleRate && (a.dataset.sampleRate = e.sampleRate.toString()),
              e.route && (a.dataset.route = e.route),
              e.endpoint && (a.dataset.endpoint = e.endpoint),
              e.dsn && (a.dataset.dsn = e.dsn),
              n() && !1 === e.debug && (a.dataset.debug = "false"),
              (a.onerror = () => {
                console.log(
                  `[Vercel Speed Insights] Failed to load script from ${i}. Please check if any content blockers are enabled and try again.`,
                );
              }),
              document.head.appendChild(a),
              {
                setRoute: (e) => {
                  a.dataset.route = e ?? void 0;
                },
              }
            );
          })({ framework: e.framework || "react", ...e });
          t && (r.current = t.setRoute);
        }
      }, [e.route]),
      null
    );
  }
  function c(e) {
    let n,
      a,
      s,
      o,
      c =
        ((n = (0, r.useParams)()),
        (a = (0, r.useSearchParams)() || new URLSearchParams()),
        (s = (0, r.usePathname)()),
        (o = { ...Object.fromEntries(a.entries()), ...(n || {}) }),
        n
          ? (function (e, t) {
              if (!e || !t) return e;
              let r = e;
              try {
                let e = Object.entries(t);
                for (let [t, n] of e)
                  if (!Array.isArray(n)) {
                    let e = i(n);
                    e.test(r) && (r = r.replace(e, `/[${t}]`));
                  }
                for (let [t, n] of e)
                  if (Array.isArray(n)) {
                    let e = i(n.join("/"));
                    e.test(r) && (r = r.replace(e, `/[...${t}]`));
                  }
                return r;
              } catch (t) {
                return e;
              }
            })(s, o)
          : null);
    return t.default.createElement(l, { route: c, ...e, framework: "next" });
  }
  e.s([
    "SpeedInsights",
    0,
    function (e) {
      return t.default.createElement(
        t.Suspense,
        { fallback: null },
        t.default.createElement(c, { ...e }),
      );
    },
  ]);
};
