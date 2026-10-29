// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let r = "https://images.pump.fun",
    s = (e) => {
      try {
        return new URL(e);
      } catch {
        return null;
      }
    },
    t = (e) => {
      let r = s(e);
      return (
        r?.origin === "https://imagedelivery.net" &&
        r.pathname.startsWith("/WL1JOIJiM_NAChp6rtB6Cw/")
      );
    },
    o = ({ url: e, variant: r }) => {
      let s = new URL(e);
      return (s.searchParams.set("variant", r), s.toString());
    };
  e.s([
    "M",
    0,
    ({ id: e, variant: s }) =>
      `${r}/${e
        .split("/")
        .map((e) => encodeURIComponent(e).replace(/%3A/g, ":"))
        .join("/")}?variant=${encodeURIComponent(s)}`,
    "H",
    0,
    t,
    "T",
    0,
    (e) => s(e)?.origin === r,
    "N",
    0,
    (e) => {
      if (!t(e)) return e;
      let s = new URL(e),
        a = s.pathname.split("/").slice(2),
        n = a.pop();
      if (!n || 0 === a.length) return e;
      let i = new URL(`${r}/${a.join("/")}`);
      return (
        (i.search = s.search),
        o({ url: i.toString(), variant: decodeURIComponent(n) })
      );
    },
    "F",
    0,
    o,
  ]);
};
