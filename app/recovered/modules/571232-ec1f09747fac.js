// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.getWindowMetadata = void 0));
  let n = e.r(12791);
  r.getWindowMetadata = function () {
    let e, t, r;
    try {
      ((e = n.getDocumentOrThrow()), (t = n.getLocationOrThrow()));
    } catch (e) {
      return null;
    }
    function i(...t) {
      let r = e.getElementsByTagName("meta");
      for (let e = 0; e < r.length; e++) {
        let n = r[e],
          i = ["itemprop", "property", "name"]
            .map((e) => n.getAttribute(e))
            .filter((e) => !!e && t.includes(e));
        if (i.length && i) {
          let e = n.getAttribute("content");
          if (e) return e;
        }
      }
      return "";
    }
    let o =
        ((r = i("name", "og:site_name", "og:title", "twitter:title")) ||
          (r = e.title),
        r),
      s = i("description", "og:description", "twitter:description", "keywords"),
      a = t.origin;
    return {
      description: s,
      url: a,
      icons: (function () {
        let r = e.getElementsByTagName("link"),
          n = [];
        for (let e = 0; e < r.length; e++) {
          let i = r[e],
            o = i.getAttribute("rel");
          if (o && o.toLowerCase().indexOf("icon") > -1) {
            let e = i.getAttribute("href");
            if (e)
              if (
                -1 === e.toLowerCase().indexOf("https:") &&
                -1 === e.toLowerCase().indexOf("http:") &&
                0 !== e.indexOf("//")
              ) {
                let r = t.protocol + "//" + t.host;
                if (0 === e.indexOf("/")) r += e;
                else {
                  let n = t.pathname.split("/");
                  (n.pop(), (r += n.join("/") + "/" + e));
                }
                n.push(r);
              } else if (0 === e.indexOf("//")) {
                let r = t.protocol + e;
                n.push(r);
              } else n.push(e);
          }
        }
        return n;
      })(),
      name: o,
    };
  };
};
