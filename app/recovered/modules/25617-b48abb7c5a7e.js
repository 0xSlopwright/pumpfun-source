// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = (e) => {
    if (!e) return null;
    let t = e.match(/clip=([^&]+)/);
    return t ? t[1] : null;
  };
  e.s([
    "z",
    0,
    (e, r, n) => !!e && !!r && e.mintId === r && t(e.originPath) === n,
    "e",
    0,
    (e) => e?.streamType === "vod" || e?.streamType === "clip",
    "s",
    0,
    (e) => (e ? `${e.mintId}-${e.originPath ?? "live"}` : null),
    "a",
    0,
    (e) => e.originPath || `/coin/${e.mintId}`,
    "A",
    0,
    (e) => e.streamTitle || e.coinName || "Stream",
    "W",
    0,
    t,
  ]);
};
