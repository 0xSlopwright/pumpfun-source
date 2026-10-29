// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = "pump:bounties:intro-video-ftue:seen";
  e.s([
    "$",
    0,
    "video/mp4",
    "E",
    0,
    "/bounties-video/intro-poster.webp",
    "R",
    0,
    "/bounties-video/intro.mp4",
    "j",
    0,
    () => {
      try {
        window.localStorage.setItem(t, "true");
      } catch {
        console.error("Failed to mark bounties intro video FTUE as seen");
      }
    },
    "e",
    0,
    () =>
      !(() => {
        try {
          return "true" === window.localStorage.getItem(t);
        } catch {
          return !0;
        }
      })(),
  ]);
};
