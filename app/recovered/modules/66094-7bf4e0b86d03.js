// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(254667);
  let i = {
      targetBytes: 307200,
      jpegLadder: [
        { maxEdgePx: 1024, quality: 0.8 },
        { maxEdgePx: 1024, quality: 0.6 },
        { maxEdgePx: 768, quality: 0.6 },
        { maxEdgePx: 512, quality: 0.5 },
      ],
      pngLadder: [
        { maxEdgePx: 1024, quality: 1 },
        { maxEdgePx: 768, quality: 1 },
        { maxEdgePx: 512, quality: 1 },
      ],
    },
    r = new Set(["image/gif", "image/svg+xml"]),
    a = (e, t, i) => {
      if (t + i.length > e.length) return !1;
      for (let r = 0; r < i.length; r += 1)
        if (e[t + r] !== i.charCodeAt(r)) return !1;
      return !0;
    },
    n = (e, t) => {
      for (let i = 0; i + t.length <= e.length; i += 1)
        if (a(e, i, t)) return !0;
      return !1;
    },
    l = async (e) => {
      let t = new Uint8Array(await e.slice(0, 65536).arrayBuffer());
      return a(t, 0, "RIFF") && a(t, 8, "WEBP")
        ? n(t, "ANIM") || n(t, "ANMF")
        : !!(137 === t[0] && a(t, 1, "PNG")) && n(t, "acTL");
    },
    s = (e, t = i) =>
      e
        ? { mimeType: "image/png", extension: "png", ladder: t.pngLadder }
        : { mimeType: "image/jpeg", extension: "jpg", ladder: t.jpegLadder },
    o = (e, t) => {
      let i = Math.max(e.width, e.height);
      if (i <= t) return { width: e.width, height: e.height };
      let r = t / i;
      return {
        width: Math.max(1, Math.round(e.width * r)),
        height: Math.max(1, Math.round(e.height * r)),
      };
    },
    d = (e, t) => {
      let i = e.replace(/\.[^./\\]+$/, "");
      return `${i || "image"}.${t}`;
    },
    u = async (e) => {
      if ("function" == typeof createImageBitmap) return createImageBitmap(e);
      let t = URL.createObjectURL(e);
      try {
        let e = new Image();
        return ((e.decoding = "async"), (e.src = t), await e.decode(), e);
      } finally {
        URL.revokeObjectURL(t);
      }
    },
    c = (e, t) => {
      let i = document.createElement("canvas");
      ((i.width = t.width), (i.height = t.height));
      let r = i.getContext("2d");
      if (!r) throw Error("Could not get a 2D canvas context");
      return (
        (r.imageSmoothingEnabled = !0),
        (r.imageSmoothingQuality = "high"),
        r.drawImage(e, 0, 0, t.width, t.height),
        { canvas: i, ctx: r }
      );
    },
    m = (e, t, i, r) => {
      let { canvas: a } = c(e, t);
      return new Promise((e, t) => {
        a.toBlob((i) => (i ? e(i) : t(Error("Canvas export failed"))), i, r);
      });
    },
    h = (e) => ({ width: e.width, height: e.height }),
    f = (e, t) =>
      "image/png" === e.type ||
      ("image/jpeg" !== e.type &&
        ((e, t) => {
          let i = o(t, 256),
            { ctx: r } = c(e, i),
            { data: a } = r.getImageData(0, 0, i.width, i.height);
          for (let e = 3; e < a.length; e += 4) if (a[e] < 255) return !0;
          return !1;
        })(t, h(t))),
    g = async ({ file: e, source: t, profile: i }) => {
      let r,
        a,
        n = h(t),
        { mimeType: l, extension: u, ladder: c } = s(f(e, t), i);
      for (let e of c) {
        let s = o(n, e.maxEdgePx),
          d = `${s.width}x${s.height}@${e.quality}`;
        if (d === a) continue;
        a = d;
        let u = await m(t, s, l, e.quality);
        if (((!r || u.size < r.size) && (r = u), u.size <= i.targetBytes))
          break;
      }
      if (r && !(r.size >= e.size))
        return new File([r], d(e.name, u), { type: l });
    },
    p = async (e) => {
      if (
        !(e.size > 307200 && e.type.startsWith("image/") && !r.has(e.type)) ||
        "u" < typeof document
      )
        return e;
      try {
        if (await l(e)) return e;
        let t = await u(e),
          r = await g({ file: e, source: t, profile: i });
        return ("close" in t && t.close(), r ?? e);
      } catch (i) {
        return (
          t.y.warn("Coin image compression failed, uploading original", {
            error: i instanceof Error ? i.message : String(i),
          }),
          e
        );
      }
    };
  e.s([
    "R",
    0,
    r,
    "v",
    0,
    p,
    "$",
    0,
    u,
    "I",
    0,
    g,
    "d",
    0,
    m,
    "J",
    0,
    (e, t) => {
      if (e.width <= t) return { width: e.width, height: e.height };
      let i = t / e.width;
      return { width: t, height: Math.max(1, Math.round(e.height * i)) };
    },
    "A",
    0,
    s,
    "q",
    0,
    l,
    "e",
    0,
    d,
    "G",
    0,
    f,
    "H",
    0,
    h,
  ]);
};
