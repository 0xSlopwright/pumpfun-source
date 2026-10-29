// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(223021),
    n = e.i(395136);
  let r = [
      "/docs",
      "/landing",
      "/u",
      "/join",
      "/livechat",
      "/moderation",
      "/blocked",
      "/r",
      "/voice-chat",
      n.S,
      t.i,
    ],
    i = new RegExp(n.s);
  [
    ...r.map((e) => `p==='${e}'||p.indexOf('${e}/')===0`),
    `new RegExp(${JSON.stringify(n.s)}).test(p)`,
  ].join("||");
  let a = new Set(),
    o = "pump:clickwrap-accepted",
    l = "data-app-shell",
    s = `[${l}]`;
  e.s([
    "p",
    0,
    l,
    "d",
    0,
    s,
    "c",
    0,
    "clickwrap_accepted",
    "U",
    0,
    o,
    "_",
    0,
    "/dialog-clickwrap-cover.webp",
    "K",
    0,
    "data-clickwrap-oos",
    "E",
    0,
    "data-clickwrap-overlay",
    "Y",
    0,
    "show-how-it-works",
    "j",
    0,
    function () {
      let e = window;
      (e.__pumpClickwrapShellObserver?.disconnect(),
        (e.__pumpClickwrapShellObserver = null));
    },
    "o",
    0,
    function () {
      window.dispatchEvent(new Event(o));
    },
    "M",
    0,
    function (e) {
      return r.some((t) => e === t || e.startsWith(`${t}/`)) || i.test(e);
    },
    "t",
    0,
    function () {
      for (let e of a) e();
    },
    "C",
    0,
    function (e) {
      return (
        window.addEventListener(o, e),
        () => window.removeEventListener(o, e)
      );
    },
    "G",
    0,
    function (e) {
      return (
        a.add(e),
        () => {
          a.delete(e);
        }
      );
    },
  ]);
};
