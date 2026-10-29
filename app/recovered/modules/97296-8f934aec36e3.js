// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = /(https?:\/\/(?:[^\s"'(),;<>\]`]+|\([^\s"'(),;<>\]`]*\))+)/gi,
    r = /[!,.:;?]+$/;
  e.s([
    "f",
    0,
    (e) => {
      let n = [],
        i = 0;
      t.lastIndex = 0;
      let s = t.exec(e);
      for (; null !== s; ) {
        let a = s[0],
          l = s.index,
          o = l + a.length,
          c = a.match(r),
          u = c ? c[0] : "",
          d = u ? a.slice(0, -u.length) : a;
        (l > i && n.push({ kind: "text", text: e.slice(i, l) }),
          n.push({ kind: "link", text: d, url: d }),
          (i = o - u.length),
          (s = t.exec(e)));
      }
      return (i < e.length && n.push({ kind: "text", text: e.slice(i) }), n);
    },
  ]);
};
