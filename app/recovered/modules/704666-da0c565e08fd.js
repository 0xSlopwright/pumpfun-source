// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(352386),
    n = e.i(282837),
    i = e.i(544514);
  let a = new Set([
    "pid",
    "c",
    "share_type",
    "content_type",
    "deep_link_value",
    "is_retargeting",
    "shortlink",
    "mint",
  ]);
  var s = e.i(896180);
  let o = () => {
    let e = ((e) => {
      let t;
      try {
        t = new URL(e);
      } catch {
        return null;
      }
      let r = t.searchParams;
      if (!r.has("pid")) return null;
      let n = [...r.keys()];
      if (!n.some((e) => e.startsWith("af_"))) return null;
      for (let e of n) (e.startsWith("af_") || a.has(e)) && r.delete(e);
      return t.href === e ? null : t.href;
    })(window.location.href);
    e && window.history.replaceState(window.history.state, "", e);
  };
  e.s(
    [
      "AppsFlyerPbaLoader",
      0,
      function () {
        let e,
          a,
          l = (0, t.c)(3),
          c = (0, i.f)();
        return (
          l[0] !== c
            ? ((e = () => {
                if (!c) return;
                if (!n.Z.WEB_APP_ID) return void o();
                let { scriptEl: e } = (0, s.J)(n.Z.WEB_KEY),
                  t = window.setTimeout(o, 4e3),
                  r = () => {
                    (window.clearTimeout(t), window.setTimeout(o, 0));
                  };
                return (
                  e?.addEventListener("load", r),
                  e?.addEventListener("error", r),
                  () => {
                    (window.clearTimeout(t),
                      e?.removeEventListener("load", r),
                      e?.removeEventListener("error", r));
                  }
                );
              }),
              (a = [c]),
              (l[0] = c),
              (l[1] = e),
              (l[2] = a))
            : ((e = l[1]), (a = l[2])),
          (0, r.useEffect)(e, a),
          null
        );
      },
    ],
    704666,
  );
};
