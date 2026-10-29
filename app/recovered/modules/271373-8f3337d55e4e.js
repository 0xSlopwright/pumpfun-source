// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = (e, t) => e?.find((e) => e.url === t)?.contentType,
    s = { "video/quicktime": "video/mp4" },
    r = new Set(["mov", "qt"]),
    l = new Set(["png", "jpg", "jpeg", "gif", "webp", "avif", "svg"]),
    a = new Set(["mp4", "webm", "ogv", "mov", "m4v"]);
  e.s([
    "Y",
    0,
    function (e, t) {
      return Math.max(0, e.length - t);
    },
    "h",
    0,
    function (e) {
      if (!e.length) return null;
      let t = e.filter((e) => "image" === e.kind).map((e) => e.url);
      if (t.length >= 2) return { type: "gallery", urls: t };
      if (1 === t.length) return { type: "image", url: t[0] };
      let s = e.find((e) => "video" === e.kind);
      if (s) {
        let e = (function (e) {
          if ("video" !== e.kind) return [];
          let t = [],
            s = new Set(),
            r = (e, r) => {
              !e || s.has(e) || (s.add(e), t.push({ src: e, mimeType: r }));
            };
          return (
            "ready" === e.processingStatus &&
              (r(e.playback?.hlsUrl, "application/x-mpegURL"),
              r(e.playback?.mp4Url, "video/mp4")),
            r(e.url, e.contentType),
            t
          );
        })(s);
        return {
          type: "video",
          url: s.url,
          mimeType: s.contentType,
          sources: e,
          posterUrl: s.playback?.posterUrl,
          processingStatus: s.processingStatus,
        };
      }
      return null;
    },
    "U",
    0,
    function (e) {
      let t;
      try {
        t = new URL(e);
      } catch {
        return null;
      }
      if ("https:" !== t.protocol && "http:" !== t.protocol) return null;
      let s = t.pathname.split("/").filter(Boolean).at(-1);
      if (!s) return null;
      let r = s.lastIndexOf(".");
      if (r <= 0 || r === s.length - 1) return null;
      let i = s.slice(r + 1).toLowerCase();
      return l.has(i)
        ? { type: "image", url: t.href }
        : a.has(i)
          ? { type: "video", url: t.href, sources: [{ src: t.href }] }
          : null;
    },
    "X",
    0,
    function (e) {
      if (e) {
        if ("image" === e.type) return e.url;
        if ("gallery" === e.type) return e.urls[0];
      }
    },
    "D",
    0,
    function (e, s) {
      if (!e) return null;
      if ("image" === e.type)
        return { url: e.url, kind: "image", contentType: t(s, e.url) };
      if ("video" === e.type)
        return { url: e.url, kind: "video", contentType: e.mimeType };
      let r = e.urls[0];
      return { url: r, kind: "image", contentType: t(s, r) };
    },
    "g",
    0,
    function ({ src: e, mimeType: t }) {
      if (t) return s[t.toLowerCase()] ?? t;
      let l = (function (e) {
        let t = e.split(/[?#]/, 1)[0].split("/").filter(Boolean).at(-1);
        if (!t) return;
        let s = t.lastIndexOf(".");
        if (!(s <= 0) && s !== t.length - 1)
          return t.slice(s + 1).toLowerCase();
      })(e);
      if (l && r.has(l)) return "video/mp4";
    },
  ]);
};
