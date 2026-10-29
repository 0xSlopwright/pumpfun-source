// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  Object.defineProperty(n, "__esModule", { value: !0 });
  var r = {
    default: function () {
      return E;
    },
    handleClientScriptLoad: function () {
      return y;
    },
    initScriptLoader: function () {
      return v;
    },
  };
  for (var i in r) Object.defineProperty(n, i, { enumerable: !0, get: r[i] });
  let a = e.r(836437),
    o = e.r(56421),
    l = e.r(732486),
    s = a._(e.r(231332)),
    u = o._(e.r(352386)),
    c = e.r(724243),
    d = e.r(885524),
    f = e.r(923450),
    p = e.r(447707),
    m = new Map(),
    g = new Set(),
    h = (e) => {
      let {
          src: t,
          id: n,
          onLoad: r = () => {},
          onReady: i = null,
          dangerouslySetInnerHTML: a,
          children: o = "",
          strategy: l = "afterInteractive",
          onError: u,
          stylesheets: c,
        } = e,
        f = n || t;
      if (f && g.has(f)) return;
      if (m.has(t)) {
        (g.add(f), m.get(t).then(r, u));
        return;
      }
      let p = () => {
          (i && i(), g.add(f));
        },
        h = document.createElement("script"),
        y = new Promise((e, t) => {
          (h.addEventListener("load", function (t) {
            (e(), r && r.call(this, t), p());
          }),
            h.addEventListener("error", function (e) {
              t(e);
            }));
        }).catch(function (e) {
          u && u(e);
        });
      (a
        ? ((h.innerHTML = a.__html || ""), p())
        : o
          ? ((h.textContent =
              "string" == typeof o ? o : Array.isArray(o) ? o.join("") : ""),
            p())
          : t && ((h.src = t), m.set(t, y)),
        (0, d.setAttributesFromProps)(h, e),
        "worker" === l && h.setAttribute("type", "text/partytown"),
        h.setAttribute("data-nscript", l),
        c &&
          ((e) => {
            if (s.default.preinit)
              return e.forEach((e) => {
                s.default.preinit(e, { as: "style" });
              });
            if ("u" > typeof window) {
              let t = document.head;
              e.forEach((e) => {
                let n = document.createElement("link");
                ((n.type = "text/css"),
                  (n.rel = "stylesheet"),
                  (n.href = e),
                  t.appendChild(n));
              });
            }
          })(c),
        document.body.appendChild(h));
    };
  function y(e) {
    let { strategy: t = "afterInteractive" } = e;
    "lazyOnload" === t
      ? window.addEventListener("load", () => {
          (0, f.requestIdleCallback)(() => h(e));
        })
      : h(e);
  }
  function v(e) {
    (e.forEach(y),
      [
        ...document.querySelectorAll('[data-nscript="beforeInteractive"]'),
        ...document.querySelectorAll('[data-nscript="beforePageRender"]'),
      ].forEach((e) => {
        let t = e.id || e.getAttribute("src");
        g.add(t);
      }));
  }
  function _(e) {
    let {
        id: t,
        src: n = "",
        onLoad: r = () => {},
        onReady: i = null,
        strategy: a = "afterInteractive",
        onError: o,
        stylesheets: d,
        ...m
      } = e,
      {
        updateScripts: y,
        scripts: v,
        getIsSsr: _,
        appDir: E,
        nonce: w,
      } = (0, u.useContext)(c.HeadManagerContext);
    w = m.nonce || w;
    let b = (0, u.useRef)(!1);
    (0, u.useEffect)(() => {
      let e = t || n;
      b.current || (i && e && g.has(e) && i(), (b.current = !0));
    }, [i, t, n]);
    let S = (0, u.useRef)(!1);
    if (
      ((0, u.useEffect)(() => {
        if (!S.current) {
          if ("afterInteractive" === a) h(e);
          else
            "lazyOnload" === a &&
              ("complete" === document.readyState
                ? (0, f.requestIdleCallback)(() => h(e))
                : window.addEventListener("load", () => {
                    (0, f.requestIdleCallback)(() => h(e));
                  }));
          S.current = !0;
        }
      }, [e, a]),
      ("beforeInteractive" === a || "worker" === a) &&
        (y
          ? ((v[a] = (v[a] || []).concat([
              {
                id: t,
                src: n,
                onLoad: r,
                onReady: i,
                onError: o,
                ...m,
                nonce: w,
              },
            ])),
            y(v))
          : _ && _()
            ? g.add(t || n)
            : _ && !_() && h({ ...e, nonce: w })),
      E)
    ) {
      if (
        (d &&
          d.forEach((e) => {
            s.default.preinit(e, { as: "style" });
          }),
        "beforeInteractive" === a)
      )
        if (!n)
          return (
            m.dangerouslySetInnerHTML &&
              ((m.children = m.dangerouslySetInnerHTML.__html),
              delete m.dangerouslySetInnerHTML),
            (0, l.jsx)("script", {
              nonce: w,
              dangerouslySetInnerHTML: {
                __html: `(self.__next_s=self.__next_s||[]).push(${(0, p.htmlEscapeJsonString)(JSON.stringify([0, { ...m, id: t }]))})`,
              },
            })
          );
        else
          return (
            s.default.preload(
              n,
              m.integrity
                ? {
                    as: "script",
                    integrity: m.integrity,
                    nonce: w,
                    crossOrigin: m.crossOrigin,
                  }
                : { as: "script", nonce: w, crossOrigin: m.crossOrigin },
            ),
            (0, l.jsx)("script", {
              nonce: w,
              dangerouslySetInnerHTML: {
                __html: `(self.__next_s=self.__next_s||[]).push(${(0, p.htmlEscapeJsonString)(JSON.stringify([n, { ...m, id: t }]))})`,
              },
            })
          );
      "afterInteractive" === a &&
        n &&
        s.default.preload(
          n,
          m.integrity
            ? {
                as: "script",
                integrity: m.integrity,
                nonce: w,
                crossOrigin: m.crossOrigin,
              }
            : { as: "script", nonce: w, crossOrigin: m.crossOrigin },
        );
    }
    return null;
  }
  Object.defineProperty(_, "__nextScript", { value: !0 });
  let E = _;
  ("function" == typeof n.default ||
    ("object" == typeof n.default && null !== n.default)) &&
    void 0 === n.default.__esModule &&
    (Object.defineProperty(n.default, "__esModule", { value: !0 }),
    Object.assign(n.default, n),
    (t.exports = n.default));
};
