// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = async (e) => {
      try {
        let t = await fetch(`/api/share-link?path=${encodeURIComponent(e)}`, {
          signal: AbortSignal.timeout(1800),
        });
        if (!t.ok) return null;
        let r = await t.json();
        return "string" == typeof r.url &&
          r.url.startsWith("https://join.pump.fun/")
          ? r.url
          : null;
      } catch {
        return null;
      }
    },
    r = async ({ path: e, fallbackUrl: r }) => {
      let n = t(e).then(
        (e) => e ?? r,
        () => r,
      );
      "u" > typeof ClipboardItem &&
      "function" == typeof navigator.clipboard?.write
        ? await navigator.clipboard.write([
            new ClipboardItem({
              "text/plain": n.then(
                (e) => new Blob([e], { type: "text/plain" }),
              ),
            }),
          ])
        : await navigator.clipboard.writeText(await n);
    };
  e.s([
    "B",
    0,
    r,
    "Z",
    0,
    t,
    "_",
    0,
    (e) => {
      if (e.startsWith("http"))
        try {
          return new URL(e).pathname;
        } catch {
          return e;
        }
      return e.split("?")[0];
    },
  ]);
};
