// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = (e) => `/api/share-image?url=${encodeURIComponent(e)}`;
  e.s([
    "f",
    0,
    (e) =>
      /^(data|blob):/i.test(e)
        ? e
        : e.startsWith("//")
          ? t(`https:${e}`)
          : /^[a-z][a-z0-9+.-]*:/i.test(e)
            ? t(e)
            : e,
  ]);
};
