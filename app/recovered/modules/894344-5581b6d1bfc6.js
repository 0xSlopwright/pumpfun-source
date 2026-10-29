// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(352386);
  e.s([
    "f",
    0,
    function (e) {
      let i,
        a,
        s,
        o,
        l,
        c,
        u,
        d,
        m,
        f,
        p,
        h = (0, r.c)(23),
        { idleLabel: y, armedLabel: b, onConfirm: g } = e,
        [v, w] = (0, n.useState)(!1),
        [x, _] = (0, n.useState)(3),
        S = (0, n.useRef)(null),
        j = (0, n.useRef)(null),
        E = (0, n.useRef)(g);
      (h[0] !== g
        ? ((i = () => {
            E.current = g;
          }),
          (a = [g]),
          (h[0] = g),
          (h[1] = i),
          (h[2] = a))
        : ((i = h[1]), (a = h[2])),
        (0, n.useEffect)(i, a),
        h[3] === Symbol.for("react.memo_cache_sentinel")
          ? ((s = () => {
              (null !== S.current &&
                (window.clearTimeout(S.current), (S.current = null)),
                null !== j.current &&
                  (window.clearInterval(j.current), (j.current = null)),
                w(!1),
                _(3));
            }),
            (h[3] = s))
          : (s = h[3]));
      let k = s;
      h[4] === Symbol.for("react.memo_cache_sentinel")
        ? ((o = () => {
            w(!0);
            let e = Date.now();
            ((S.current = window.setTimeout(() => {
              ((S.current = null), k(), E.current());
            }, 3e3)),
              (j.current = window.setInterval(() => {
                _(Math.max(1, Math.ceil((3e3 - (Date.now() - e)) / 1e3)));
              }, 100)));
          }),
          (h[4] = o))
        : (o = h[4]);
      let C = o;
      (h[5] === Symbol.for("react.memo_cache_sentinel")
        ? ((l = () => k), (c = []), (h[5] = l), (h[6] = c))
        : ((l = h[5]), (c = h[6])),
        (0, n.useEffect)(l, c),
        h[7] !== v
          ? ((u = () => (v ? k() : C())), (h[7] = v), (h[8] = u))
          : (u = h[8]));
      let A = v ? "100%" : "0%",
        U = v ? "width 3000ms linear" : "width 150ms ease-out";
      return (
        h[9] !== A || h[10] !== U
          ? ((d = (0, t.jsx)("span", {
              "aria-hidden": !0,
              className: "absolute inset-y-0 left-0 bg-text-on-error/20",
              style: { width: A, transition: U },
            })),
            (h[9] = A),
            (h[10] = U),
            (h[11] = d))
          : (d = h[11]),
        h[12] !== b || h[13] !== y || h[14] !== v || h[15] !== x
          ? ((m = v ? b(x) : y),
            (h[12] = b),
            (h[13] = y),
            (h[14] = v),
            (h[15] = x),
            (h[16] = m))
          : (m = h[16]),
        h[17] !== m
          ? ((f = (0, t.jsx)("span", {
              className: "relative z-[1]",
              children: m,
            })),
            (h[17] = m),
            (h[18] = f))
          : (f = h[18]),
        h[19] !== d || h[20] !== f || h[21] !== u
          ? ((p = (0, t.jsxs)("button", {
              type: "button",
              onClick: u,
              className:
                "relative h-10 w-full select-none overflow-hidden rounded-md bg-loss px-3 text-[13px] font-semibold leading-normal text-text-on-error transition-colors hover:bg-loss/75",
              children: [d, f],
            })),
            (h[19] = d),
            (h[20] = f),
            (h[21] = u),
            (h[22] = p))
          : (p = h[22]),
        p
      );
    },
  ]);
};
