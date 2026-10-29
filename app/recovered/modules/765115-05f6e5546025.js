// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(352386),
    n = {
      303: "Multiple adapter contexts detected. This might happen in monorepos.",
      404: "nuqs requires an adapter to work with your framework.",
      409: "Multiple versions of the library are loaded. This may lead to unexpected behavior. Currently using `%s`, but `%s` (via the %s adapter) was about to load on top.",
      414: "Max safe URL length exceeded. Some browsers may not be able to accept this URL. Consider limiting the amount of state stored in the URL.",
      429: "URL update rate-limited by the browser. Consider increasing `throttleMs` for key(s) `%s`. %O",
      500: "Empty search params cache. Search params can't be accessed in Layouts.",
      501: "Search params cache already populated. Have you called `parse` twice?",
    };
  function r(e) {
    return `[nuqs] ${n[e]}
  See https://err.47ng.com/NUQS-${e}`;
  }
  var a = (function () {
      try {
        if ("u" < typeof localStorage) return !1;
        let e = "nuqs-localStorage-test";
        localStorage.setItem(e, e);
        let t = localStorage.getItem(e) === e;
        if ((localStorage.removeItem(e), !t)) return !1;
      } catch (e) {
        return (
          console.error(
            "[nuqs]: debug mode is disabled (localStorage unavailable).",
            e,
          ),
          !1
        );
      }
      return (localStorage.getItem("debug") ?? "").includes("nuqs");
    })(),
    i = (0, t.createContext)({
      useAdapter() {
        throw Error(r(404));
      },
    });
  ((i.displayName = "NuqsAdapterContext"),
    a &&
      "u" > typeof window &&
      (window.__NuqsAdapterContext &&
        window.__NuqsAdapterContext !== i &&
        console.error(r(303)),
      (window.__NuqsAdapterContext = i)),
    e.s([
      "W",
      0,
      function (e) {
        return ({ children: n, ...r }) =>
          (0, t.createElement)(
            i.Provider,
            { ...r, value: { useAdapter: e } },
            n,
          );
      },
      "h",
      0,
      function (e, ...t) {
        if (!a) return;
        let n = (function (e, ...t) {
          return e.replace(/%[sfdO]/g, (e) => {
            let n = t.shift();
            return "%O" === e && n
              ? JSON.stringify(n).replace(/"([^"]+)":/g, "$1:")
              : String(n);
          });
        })(e, ...t);
        performance.mark(n);
        try {
          console.log(e, ...t);
        } catch (e) {
          console.log(n);
        }
      },
      "C",
      0,
      r,
      "D",
      0,
      function (e) {
        if (0 === e.size) return "";
        let t = [];
        for (let [n, r] of e.entries()) {
          let e = n
            .replace(/#/g, "%23")
            .replace(/&/g, "%26")
            .replace(/\+/g, "%2B")
            .replace(/=/g, "%3D")
            .replace(/\?/g, "%3F");
          t.push(
            `${e}=${r
              .replace(/%/g, "%25")
              .replace(/\+/g, "%2B")
              .replace(/ /g, "+")
              .replace(/#/g, "%23")
              .replace(/&/g, "%26")
              .replace(/"/g, "%22")
              .replace(/'/g, "%27")
              .replace(/`/g, "%60")
              .replace(/</g, "%3C")
              .replace(/>/g, "%3E")
              .replace(/[\x00-\x1F]/g, (e) => encodeURIComponent(e))}`,
          );
        }
        return "?" + t.join("&");
      },
      "J",
      0,
      function () {
        let e = (0, t.useContext)(i);
        if (!("useAdapter" in e)) throw Error(r(404));
        return e.useAdapter();
      },
      "S",
      0,
      function (e, ...t) {
        a && console.warn(e, ...t);
      },
    ]));
};
