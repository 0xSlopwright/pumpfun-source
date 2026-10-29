// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(439587),
    i = e.i(292686),
    a = e.i(928529),
    s = e.i(458310),
    o = e.i(352386);
  e.i(12692);
  var l = e.i(117466),
    c = e.i(398902),
    u = e.i(4327),
    d = e.i(406882),
    m = e.i(536869);
  e.i(351491);
  var f = e.i(875429),
    p = e.i(595673);
  let h = new Set();
  function y(e) {
    return (
      h.add(e),
      window.addEventListener("storage", e),
      () => {
        (h.delete(e), window.removeEventListener("storage", e));
      }
    );
  }
  function b() {
    return document.cookie.split("; ").some((e) => e === `${u.c}=true`);
  }
  function g() {
    try {
      return null != localStorage.getItem(u.Y);
    } catch {
      return !1;
    }
  }
  function v() {
    return b() || g();
  }
  let w = () => !1;
  function x() {
    document.cookie = `${u.c}=true; path=/; max-age=31536000; samesite=lax`;
  }
  function _() {
    return (0, p.jU)({ linkType: i.jK.PRIVACY_POLICY });
  }
  function S() {
    return (0, p.jU)({ linkType: i.jK.TERMS });
  }
  function j() {
    let e = document.querySelector(u.d);
    e && !e.hasAttribute("inert") && e.setAttribute("inert", "");
  }
  function E() {
    !b() && g() && x();
  }
  function k() {
    return !1;
  }
  function C() {
    return (0, u.M)(window.location.pathname);
  }
  e.s(
    [
      "DialogClickwrap",
      0,
      function (e) {
        let i,
          b,
          g,
          A,
          U,
          q,
          N,
          L,
          O,
          P,
          T,
          D,
          R,
          F,
          $,
          I,
          M,
          z,
          W,
          K,
          Q,
          B,
          H,
          V,
          G,
          Y,
          Z,
          X,
          J,
          ee,
          et,
          er,
          en,
          ei = (0, r.c)(62),
          { copy: ea } = e;
        ei[0] !== ea
          ? ((i = () => {
              let e;
              return (
                (e = (0, d.p)())
                  .use(m.f)
                  .init({
                    compatibilityJSON: "v4",
                    lng: "en",
                    fallbackLng: "en",
                    ns: ["translation"],
                    defaultNS: "translation",
                    resources: { en: { translation: ea } },
                    partialBundledLanguages: !0,
                    interpolation: { escapeValue: !1 },
                    initAsync: !1,
                    react: { useSuspense: !1 },
                  }),
                e
              );
            }),
            (ei[0] = ea),
            (ei[1] = i))
          : (i = ei[1]);
        let [es] = (0, o.useState)(i);
        ei[2] !== es
          ? ((b = { i18n: es }), (ei[2] = es), (ei[3] = b))
          : (b = ei[3]);
        let { t: eo } = (0, c.f)("translation", b),
          el = (0, o.useRef)(!1),
          ec = (0, o.useRef)(null),
          eu = (0, o.useId)(),
          ed = (0, o.useId)(),
          em = (0, o.useSyncExternalStore)(y, v, w),
          [ef, ep] = (0, o.useState)(!1),
          eh = (0, o.useSyncExternalStore)(u.G, C, k),
          ey = !(em || ef) && !eh;
        (ei[4] !== eh
          ? ((g = () => {
              document.documentElement.toggleAttribute(u.K, eh);
            }),
            (A = [eh]),
            (ei[4] = eh),
            (ei[5] = g),
            (ei[6] = A))
          : ((g = ei[5]), (A = ei[6])),
          (0, o.useEffect)(g, A),
          ei[7] === Symbol.for("react.memo_cache_sentinel")
            ? ((U = function () {
                (ep(!0), x());
                try {
                  (localStorage.setItem(u.Y, "true"),
                    localStorage.setItem(f.i, (0, f.N)()));
                } catch {}
                for (let e of h) e();
                (0, u.o)();
              }),
              (ei[7] = U))
            : (U = ei[7]));
        let eb = U;
        ei[8] === Symbol.for("react.memo_cache_sentinel")
          ? ((q = function () {
              ((0, p.Kw)({ interactionType: "dismiss" }), eb());
            }),
            (ei[8] = q))
          : (q = ei[8]);
        let eg = q;
        ei[9] === Symbol.for("react.memo_cache_sentinel")
          ? ((N = function () {
              ((0, p.Kw)({ interactionType: "click" }), eb());
            }),
            (ei[9] = N))
          : (N = ei[9]);
        let ev = N;
        (ei[10] !== ey
          ? ((L = () => {
              !ey || el.current || v() || ((el.current = !0), (0, p.Qw)());
            }),
            (O = [ey]),
            (ei[10] = ey),
            (ei[11] = L),
            (ei[12] = O))
          : ((L = ei[11]), (O = ei[12])),
          (0, o.useEffect)(L, O),
          ei[13] === Symbol.for("react.memo_cache_sentinel")
            ? ((P = []), (ei[13] = P))
            : (P = ei[13]),
          (0, o.useEffect)(E, P),
          ei[14] === Symbol.for("react.memo_cache_sentinel")
            ? ((T = function (e) {
                "Escape" === e.key && (e.preventDefault(), eg());
              }),
              (ei[14] = T))
            : (T = ei[14]));
        let ew = T;
        return (ei[15] !== ey
          ? ((D = () => {
              let e = document.querySelector(u.d);
              if (!ey) {
                ((0, u.j)(), e?.removeAttribute("inert"));
                return;
              }
              let t = document.documentElement,
                r = t.style.overflow;
              t.style.overflow = "hidden";
              (j(), (0, u.j)());
              let n = new MutationObserver(j);
              n.observe(document.body ?? document.documentElement, {
                childList: !0,
                subtree: !0,
                attributes: !0,
                attributeFilter: ["inert"],
              });
              let i = document.activeElement;
              ec.current?.focus();
              let a = function (e) {
                let t = ec.current,
                  r = e.target;
                !(!t || !(r instanceof Element) || t.contains(r)) &&
                  r.closest(u.d) &&
                  (
                    t.querySelectorAll(
                      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
                    )[0] ?? t
                  ).focus();
              };
              return (
                document.addEventListener("focusin", a),
                () => {
                  (n.disconnect(),
                    (t.style.overflow = r),
                    document.querySelector(u.d)?.removeAttribute("inert"),
                    document.removeEventListener("focusin", a),
                    i?.focus?.());
                }
              );
            }),
            (R = [ey]),
            (ei[15] = ey),
            (ei[16] = D),
            (ei[17] = R))
          : ((D = ei[16]), (R = ei[17])),
        (0, o.useEffect)(D, R),
        ey)
          ? (ei[18] === Symbol.for("react.memo_cache_sentinel")
              ? ((F = { [u.E]: "" }), (ei[18] = F))
              : (F = ei[18]),
            ei[19] !== eo
              ? (($ = eo("common.dismiss")), (ei[19] = eo), (ei[20] = $))
              : ($ = ei[20]),
            ei[21] !== $
              ? ((I = (0, t.jsx)("button", {
                  "aria-label": $,
                  className: "absolute inset-0 cursor-default bg-black/75",
                  onClick: eg,
                  tabIndex: -1,
                  type: "button",
                })),
                (ei[21] = $),
                (ei[22] = I))
              : (I = ei[22]),
            ei[23] !== eo
              ? ((M = eo("web.consent.clickwrap_cover_alt")),
                (ei[23] = eo),
                (ei[24] = M))
              : (M = ei[24]),
            ei[25] !== M
              ? ((z = (0, t.jsx)(a.default, {
                  alt: M,
                  className:
                    "border border-solid border-border-secondary aspect-16-9 rounded-xl object-cover select-none max-[640px]:rounded-[20px]",
                  draggable: !1,
                  height: 333,
                  sizes: "(max-width: 640px) calc(100vw - 48px), 592px",
                  src: u._,
                  unoptimized: !0,
                  width: 592,
                })),
                (ei[25] = M),
                (ei[26] = z))
              : (z = ei[26]),
            ei[27] === Symbol.for("react.memo_cache_sentinel")
              ? ((W = (0, t.jsx)(n.k, { height: 24 })), (ei[27] = W))
              : (W = ei[27]),
            ei[28] === Symbol.for("react.memo_cache_sentinel")
              ? ((K = {
                  accent: (0, t.jsx)("span", { className: "text-text-accent" }),
                }),
                (ei[28] = K))
              : (K = ei[28]),
            ei[29] !== es || ei[30] !== eo
              ? ((Q = (0, t.jsx)(l.f, {
                  i18n: es,
                  t: eo,
                  i18nKey: "web.consent.clickwrap_title",
                  components: K,
                })),
                (ei[29] = es),
                (ei[30] = eo),
                (ei[31] = Q))
              : (Q = ei[31]),
            ei[32] !== Q || ei[33] !== eu
              ? ((B = (0, t.jsx)("p", {
                  className: "font-bold text-2xl text-text-primary text-center",
                  id: eu,
                  children: Q,
                })),
                (ei[32] = Q),
                (ei[33] = eu),
                (ei[34] = B))
              : (B = ei[34]),
            ei[35] === Symbol.for("react.memo_cache_sentinel")
              ? ((H = (0, t.jsx)(n.k, { height: 16 })), (ei[35] = H))
              : (H = ei[35]),
            ei[36] !== eo
              ? ((V = eo("web.consent.clickwrap_body")),
                (ei[36] = eo),
                (ei[37] = V))
              : (V = ei[37]),
            ei[38] !== ed || ei[39] !== V
              ? ((G = (0, t.jsx)("p", {
                  className: "text-text-tertiary text-center",
                  id: ed,
                  children: V,
                })),
                (ei[38] = ed),
                (ei[39] = V),
                (ei[40] = G))
              : (G = ei[40]),
            ei[41] === Symbol.for("react.memo_cache_sentinel")
              ? ((Y = (0, t.jsx)(n.k, { height: 24 })), (ei[41] = Y))
              : (Y = ei[41]),
            ei[42] !== eo
              ? ((Z = eo("common.continue")), (ei[42] = eo), (ei[43] = Z))
              : (Z = ei[43]),
            ei[44] !== Z
              ? ((X = (0, t.jsx)(n.K, {
                  isFullWidth: !0,
                  onClick: ev,
                  size: 48,
                  children: Z,
                })),
                (ei[44] = Z),
                (ei[45] = X))
              : (X = ei[45]),
            ei[46] === Symbol.for("react.memo_cache_sentinel")
              ? ((J = (0, t.jsx)(n.k, { height: 16 })), (ei[46] = J))
              : (J = ei[46]),
            ei[47] === Symbol.for("react.memo_cache_sentinel")
              ? ((ee = {
                  termsLink: (0, t.jsx)(s.default, {
                    className: "underline",
                    href: "/docs/terms-and-conditions",
                    prefetch: !1,
                    onClick: S,
                  }),
                  privacyLink: (0, t.jsx)(s.default, {
                    className: "underline",
                    href: "/docs/privacy-policy",
                    prefetch: !1,
                    onClick: _,
                  }),
                }),
                (ei[47] = ee))
              : (ee = ei[47]),
            ei[48] !== es || ei[49] !== eo
              ? ((et = (0, t.jsx)("p", {
                  className:
                    "text-xs text-text-tertiary mx-auto max-w-[480px] text-center",
                  children: (0, t.jsx)(l.f, {
                    i18n: es,
                    t: eo,
                    i18nKey: "web.consent.clickwrap_terms",
                    components: ee,
                  }),
                })),
                (ei[48] = es),
                (ei[49] = eo),
                (ei[50] = et))
              : (et = ei[50]),
            ei[51] !== z ||
            ei[52] !== B ||
            ei[53] !== G ||
            ei[54] !== X ||
            ei[55] !== et
              ? ((er = (0, t.jsxs)("div", {
                  className:
                    "relative flex w-full max-w-[640px] flex-col bg-bg-primary p-6 shadow-[0_0_0_1px_var(--color-border-secondary)] rounded-[16px] max-[640px]:rounded-b-none max-[640px]:rounded-t-[24px]",
                  ref: ec,
                  tabIndex: -1,
                  children: [z, W, B, H, G, Y, X, J, et],
                })),
                (ei[51] = z),
                (ei[52] = B),
                (ei[53] = G),
                (ei[54] = X),
                (ei[55] = et),
                (ei[56] = er))
              : (er = ei[56]),
            ei[57] !== ed || ei[58] !== I || ei[59] !== er || ei[60] !== eu
              ? ((en = (0, t.jsxs)("div", {
                  "aria-describedby": ed,
                  "aria-labelledby": eu,
                  "aria-modal": "true",
                  className:
                    "fixed inset-0 z-[999] flex items-center justify-center p-6 max-[640px]:items-end max-[640px]:p-0",
                  ...F,
                  onKeyDown: ew,
                  role: "dialog",
                  children: [I, er],
                })),
                (ei[57] = ed),
                (ei[58] = I),
                (ei[59] = er),
                (ei[60] = eu),
                (ei[61] = en))
              : (en = ei[61]),
            en)
          : null;
      },
    ],
    683826,
  );
};
