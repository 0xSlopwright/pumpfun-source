// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(747337),
    r = e.i(256617);
  let n = ["legendary", "big_win", "small_win", "loss"];
  e.s(
    [
      "C",
      0,
      "#0A0A0F",
      "J",
      0,
      {
        primary: "#FF8A3D",
        accent: "#FF6A00",
        glowRgb: "255, 138, 61",
        badgeBg: "rgba(255, 138, 61, 0.16)",
        gradient: ["#3A1C0B", "#FF8A3D", "#FFD9B0"],
      },
      "l",
      0,
      {
        legendary: {
          primary: "#FFD700",
          accent: "#FFA500",
          glowRgb: "255, 215, 0",
          badgeBg: "rgba(255, 215, 0, 0.2)",
          gradient: ["#3B2F0B", "#D4AF37", "#FFF3B0"],
        },
        big_win: {
          primary: "#00FF88",
          accent: "#00CC6A",
          glowRgb: "0, 255, 136",
          badgeBg: "rgba(0, 255, 136, 0.15)",
          gradient: ["#052E16", "#22C55E", "#86EFAC"],
        },
        small_win: {
          primary: "#5DDF6C",
          accent: "#3DBF4E",
          glowRgb: "93, 223, 108",
          badgeBg: "rgba(93, 223, 108, 0.15)",
          gradient: ["#06281F", "#10B981", "#6EE7B7"],
        },
        loss: {
          primary: "#FF4444",
          accent: "#CC3333",
          glowRgb: "255, 68, 68",
          badgeBg: "rgba(255, 68, 68, 0.15)",
          gradient: ["#2E0B0B", "#EF4444", "#FCA5A5"],
        },
      },
      "d",
      0,
      n,
      "x",
      0,
      (e, t) => {
        let r = 0;
        for (let t of e)
          "." === t || "," === t
            ? (r += 0.34)
            : /[A-Za-z]/.test(t)
              ? (r += 0.76)
              : (r += 0.66);
        return r * t;
      },
      "e",
      0,
      (e) => {
        let t = Math.abs(e);
        return Number.isFinite(t)
          ? t >= 1e3
            ? `${t.toLocaleString("en-US", { notation: "compact", compactDisplay: "short", maximumFractionDigits: +(t < 1e4) })}%`
            : `${t.toFixed(t >= 100 ? 0 : 2)}%`
          : "0.00%";
      },
      "t",
      0,
      (e) =>
        e >= 1e3
          ? "legendary"
          : e >= 100
            ? "big_win"
            : e >= 0
              ? "small_win"
              : "loss",
      "s",
      0,
      ({ isClosed: e, pnlPct: t }) => (e || t >= 100 ? "pnl" : "callout"),
      "u",
      0,
      (e) =>
        `${(e ?? "position").replace(/^\$/, "").replace(/[^\w-]+/g, "") || "position"}-pnl.png`,
      "p",
      0,
      (e) => {
        let t = e.maxMultiplier ?? e.multiple;
        return "number" == typeof t && Number.isFinite(t) && t > 1 ? t : null;
      },
      "f",
      0,
      ({ requestedMode: e, hasCalloutCard: t, hasMultipleCard: r }) =>
        ("callout" !== e || t) && ("multiple" !== e || r) ? e : "pnl",
    ],
    538794,
  );
  let i = "https://customer-6l8lsi10ia0kjxi9.cloudflarestream.com",
    a = (e) => `${i}/${e}/downloads/default.mp4`,
    l = (e) =>
      `${i}/${e}/thumbnails/thumbnail.jpg?width=320&height=320&fit=crop`,
    o = {
      legendary: {
        videoUrl: a("3613f74977d1bbc83dea3869a2cf32ff"),
        posterUrl: l("3613f74977d1bbc83dea3869a2cf32ff"),
        gradient: ["#3B2F0B", "#D4AF37", "#FFF3B0"],
      },
      big_win: {
        videoUrl: a("19e57f8a16177904d6f3eda8fbbaa41e"),
        posterUrl: l("19e57f8a16177904d6f3eda8fbbaa41e"),
        gradient: ["#052E16", "#22C55E", "#86EFAC"],
      },
      small_win: {
        videoUrl: a("4b8f5563434e6255bd94f2473d46b015"),
        posterUrl: l("4b8f5563434e6255bd94f2473d46b015"),
        gradient: ["#06281F", "#10B981", "#6EE7B7"],
      },
      loss: {
        videoUrl: a("9c3cc1d7c2ad9f75cdb29d8fa9592fa7"),
        posterUrl: l("9c3cc1d7c2ad9f75cdb29d8fa9592fa7"),
        gradient: ["#2E0B0B", "#EF4444", "#FCA5A5"],
      },
    },
    s = "paper_hands",
    c = "mayhem",
    u = "holder",
    d = ["#3A2E14", "#D8A75A", "#F3E3C4"],
    f = [
      {
        id: "big_loss",
        fit: "right_square",
        videoUrl: a("a6a10d66db08820372882f26412e72e4"),
        posterUrl: l("a6a10d66db08820372882f26412e72e4"),
        gradient: ["#2E0B0B", "#EF4444", "#FCA5A5"],
        durationSeconds: 6.042,
      },
      {
        id: s,
        fit: "right_square",
        videoUrl: a("98e8515e51c1e2e29827599e5b7168ba"),
        posterUrl: l("98e8515e51c1e2e29827599e5b7168ba"),
        gradient: ["#3A1C0B", "#FF8A3D", "#FFD9B0"],
        cardDesign: "fumbled",
        durationSeconds: 9.083,
      },
      {
        id: c,
        fit: "right_square",
        videoUrl: a("b731e5f523fe00d013857be3617fc304"),
        posterUrl: l("b731e5f523fe00d013857be3617fc304"),
        gradient: ["#0B2E1A", "#22C55E", "#EF4444"],
        cardDesign: "mayhem",
        durationSeconds: 5.042,
      },
    ],
    h = ({ id: e, width: n, height: i }) =>
      (0, t.M)({
        id: `share-card-presets/${e}`,
        variant: (0, r.l)({ width: n, height: i }),
      }),
    m = h({ id: "rick-roll", width: 400, height: 400 }),
    p = [
      { id: "rick-roll", uri: m, kind: "gif" },
      ...["pnl_default", "pnl_sky", "pnl_tv", "pnl_accent", "pnl_nuke"].map(
        (e) => ({
          id: e,
          uri: h({ id: e, width: 1200, height: 750 }),
          kind: "image",
        }),
      ),
    ],
    g = (e, t, r) => {
      if ("tier" === e.type) {
        let t = o[e.tier];
        return {
          aura: {
            type: "loop",
            videoUrl: t.videoUrl,
            posterUrl: t.posterUrl,
            fit: "right_square",
          },
          exportKind: "video",
          compose: { tier: e.tier },
        };
      }
      if ("loop" === e.type) {
        let t,
          n =
            ((t = e.loopId), (t === u ? r : f.find((e) => e.id === t)) ?? f[0]);
        return {
          aura: {
            type: "loop",
            videoUrl: n.videoUrl,
            posterUrl: n.posterUrl,
            fit: n.fit,
          },
          exportKind: "video",
          cardDesign: n.cardDesign,
          compose: {
            backgroundUrl: n.videoUrl,
            fit: n.fit,
            durationSeconds: n.durationSeconds,
          },
        };
      }
      if ("preset" === e.type) {
        let t,
          r = ((t = e.presetId), p.find((e) => e.id === t) ?? p[0]);
        return "image" === r.kind
          ? { aura: { type: "image", uri: r.uri }, exportKind: "png" }
          : {
              aura:
                "video" === r.kind
                  ? { type: "video", uri: r.uri }
                  : { type: "image", uri: r.uri },
              exportKind: "video",
              compose: { backgroundUrl: r.uri, fit: "cover" },
            };
      }
      let i = t.find((t) => t.uri === e.uri);
      return i
        ? "image" === i.kind
          ? { aura: { type: "image", uri: i.uri }, exportKind: "png" }
          : {
              aura:
                "video" === i.kind
                  ? { type: "video", uri: i.uri }
                  : { type: "image", uri: i.uri },
              exportKind: "video",
              compose: {
                file: i.file,
                fit: "cover",
                durationSeconds: i.durationSeconds,
              },
            }
        : g({ type: "tier", tier: n[2] }, t, r);
    };
  e.s(
    [
      "I",
      0,
      u,
      "U",
      0,
      c,
      "N",
      0,
      s,
      "t",
      0,
      p,
      "Y",
      0,
      f,
      "z",
      0,
      o,
      "Z",
      0,
      m,
      "$",
      0,
      (e) => {
        if (
          "string" == typeof e?.uid &&
          "" !== e.uid &&
          "number" == typeof e.durationSeconds &&
          e.durationSeconds > 0
        )
          return {
            id: u,
            fit: "cover",
            videoUrl: a(e.uid),
            posterUrl: l(e.uid),
            gradient: d,
            durationSeconds: e.durationSeconds,
          };
      },
      "C",
      0,
      (e) => {
        let t = e.type?.toLowerCase() ?? "";
        if ("image/gif" === t) return "gif";
        if (t.startsWith("video/")) return "video";
        let r = e.name?.toLowerCase() ?? "";
        return r.endsWith(".gif")
          ? "gif"
          : [".mp4", ".mov", ".m4v", ".webm"].some((e) => r.endsWith(e))
            ? "video"
            : "image";
      },
      "v",
      0,
      (e) => {
        switch (e.type) {
          case "tier":
            return `tier:${e.tier}`;
          case "loop":
            return `loop:${e.loopId}`;
          case "preset":
            return `preset:${e.presetId}`;
          case "custom":
            return `custom:${e.uri}`;
        }
      },
      "a",
      0,
      g,
    ],
    188291,
  );
};
