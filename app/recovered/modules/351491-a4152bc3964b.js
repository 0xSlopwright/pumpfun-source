// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(439587),
    i = e.i(458310),
    a = e.i(599077),
    o = e.i(352386);
  e.i(12692);
  var l = e.i(117466),
    s = e.i(398902),
    u = e.i(182119),
    c = e.i(875429);
  let d = (0, e.i(338319).O)(c.h, {
    timeZone: "UTC",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  function f() {
    return (0, c.x)();
  }
  function p() {
    return (0, c.Z)();
  }
  function m(e) {
    return e.preventDefault();
  }
  function g(e) {
    return e.preventDefault();
  }
  function h() {}
  e.s([
    "f",
    0,
    function () {
      let e,
        y,
        v,
        _,
        E,
        w,
        b,
        S,
        I,
        P = (0, n.c)(21),
        { t: C } = (0, s.f)(),
        { isOpen: A, handleAccept: k } = (function () {
          let e,
            t,
            r,
            i = (0, n.c)(5),
            [l, s] = (0, o.useState)(p),
            [u] = (0, o.useState)(f),
            [d, m] = (0, o.useState)(!1),
            g = (0, a.usePathname)();
          i[0] !== l
            ? ((e = null != l && (0, c.Q)()), (i[0] = l), (i[1] = e))
            : (e = i[1]);
          let h = e,
            y = "/docs/terms-and-conditions" !== g && !d && u && !h;
          i[2] === Symbol.for("react.memo_cache_sentinel")
            ? ((t = function () {
                (m(!0), s((0, c.c)()));
              }),
              (i[2] = t))
            : (t = i[2]);
          let v = t;
          return (
            i[3] !== y
              ? ((r = { isOpen: y, handleAccept: v }), (i[3] = y), (i[4] = r))
              : (r = i[4]),
            r
          );
        })();
      return (
        P[0] !== C
          ? ((e = C("web.tos.updated_title")), (P[0] = C), (P[1] = e))
          : (e = P[1]),
        P[2] !== e
          ? ((y = (0, t.jsx)(u.s, {
              className: "text-center",
              children: (0, t.jsx)(u.F, {
                className: "text-center",
                children: e,
              }),
            })),
            (P[2] = e),
            (P[3] = y))
          : (y = P[3]),
        P[4] === Symbol.for("react.memo_cache_sentinel")
          ? ((v = (0, t.jsx)("div", {
              children: (0, t.jsx)(l.f, {
                components: {
                  tosLink: (0, t.jsx)(i.default, {
                    href: "/docs/terms-and-conditions",
                    prefetch: !1,
                    className: "font-medium underline",
                  }),
                },
                i18nKey: "web.tos.updated_body",
              }),
            })),
            (P[4] = v))
          : (v = P[4]),
        P[5] !== C
          ? ((_ = C("web.tos.last_updated", { date: d })),
            (P[5] = C),
            (P[6] = _))
          : (_ = P[6]),
        P[7] !== _
          ? ((E = (0, t.jsxs)("div", {
              className: "space-y-2 text-sm",
              children: [v, (0, t.jsx)("div", { children: _ })],
            })),
            (P[7] = _),
            (P[8] = E))
          : (E = P[8]),
        P[9] !== C
          ? ((w = C("common.continue")), (P[9] = C), (P[10] = w))
          : (w = P[10]),
        P[11] !== k || P[12] !== w
          ? ((b = (0, t.jsx)(r.K, {
              isFullWidth: !0,
              onClick: k,
              variant: "primary",
              children: w,
            })),
            (P[11] = k),
            (P[12] = w),
            (P[13] = b))
          : (b = P[13]),
        P[14] !== y || P[15] !== E || P[16] !== b
          ? ((S = (0, t.jsxs)(u.d, {
              className: "max-w-md bg-bg-primary px-6 text-center text-white",
              onPointerDownOutside: g,
              onEscapeKeyDown: m,
              children: [y, E, b],
            })),
            (P[14] = y),
            (P[15] = E),
            (P[16] = b),
            (P[17] = S))
          : (S = P[17]),
        P[18] !== A || P[19] !== S
          ? ((I = (0, t.jsx)(u.N, {
              open: A,
              onOpenChange: h,
              modal: !0,
              children: S,
            })),
            (P[18] = A),
            (P[19] = S),
            (P[20] = I))
          : (I = P[20]),
        I
      );
    },
  ]);
};
