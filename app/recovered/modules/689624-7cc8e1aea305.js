// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    Object.defineProperty(r, "AppRouterAnnouncer", {
      enumerable: !0,
      get: function () {
        return i;
      },
    }));
  let n = e.r(352386),
    o = e.r(231332),
    a = "next-route-announcer";
  function i({ tree: e }) {
    let [t, r] = (0, n.useState)(null);
    (0, n.useEffect)(
      () => (
        r(
          (function () {
            let e = document.getElementsByName(a)[0];
            if (e?.shadowRoot?.childNodes[0]) return e.shadowRoot.childNodes[0];
            {
              let e = document.createElement(a);
              e.style.cssText = "position:absolute";
              let t = document.createElement("div");
              return (
                (t.ariaLive = "assertive"),
                (t.id = "__next-route-announcer__"),
                (t.role = "alert"),
                (t.style.cssText =
                  "position:absolute;border:0;height:1px;margin:-1px;padding:0;width:1px;clip:rect(0 0 0 0);overflow:hidden;white-space:nowrap;word-wrap:normal"),
                e.attachShadow({ mode: "open" }).appendChild(t),
                document.body.appendChild(e),
                t
              );
            }
          })(),
        ),
        () => {
          let e = document.getElementsByTagName(a)[0];
          e?.isConnected && document.body.removeChild(e);
        }
      ),
      [],
    );
    let [l, u] = (0, n.useState)(""),
      d = (0, n.useRef)(void 0);
    return (
      (0, n.useEffect)(() => {
        let e = "";
        if (document.title) e = document.title;
        else {
          let t = document.querySelector("h1");
          t && (e = t.innerText || t.textContent || "");
        }
        (void 0 !== d.current && d.current !== e && u(e), (d.current = e));
      }, [e]),
      t ? (0, o.createPortal)(l, t) : null
    );
  }
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
