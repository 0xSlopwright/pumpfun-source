// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t,
    n = e.i(352386),
    r = e.i(268932),
    i = e.i(648585),
    o = e.i(641645),
    l = e.i(92615);
  function a(e) {
    let t = (0, l.X)(e),
      n = parseFloat(t.width) || 0,
      r = parseFloat(t.height) || 0,
      i = (0, l.E)(e),
      a = i ? e.offsetWidth : n,
      s = i ? e.offsetHeight : r;
    return (
      ((0, o.H)(n) !== a || (0, o.H)(r) !== s) && ((n = a), (r = s)),
      { width: n, height: r }
    );
  }
  var s = e.i(904186),
    u = e.i(522737),
    c = e.i(578958);
  let d =
      (((t = {}).activeTabLeft = "--active-tab-left"),
      (t.activeTabRight = "--active-tab-right"),
      (t.activeTabTop = "--active-tab-top"),
      (t.activeTabBottom = "--active-tab-bottom"),
      (t.activeTabWidth = "--active-tab-width"),
      (t.activeTabHeight = "--active-tab-height"),
      t),
    f = n.createContext(void 0),
    p = { disableStyleElements: !1 };
  var g = e.i(732486);
  let h = { ...u.f, activeTabPosition: () => null, activeTabSize: () => null },
    v = n.forwardRef(function (e, t) {
      let { className: o, render: l, renderBeforeHydration: u = !1, ...v } = e,
        { nonce: m } = n.useContext(f) ?? p,
        {
          getTabElementBySelectedValue: b,
          orientation: x,
          tabActivationDirection: y,
          value: S,
        } = (0, s._)(),
        { tabsListElement: w, registerIndicatorUpdateListener: _ } = (0, c.K)(),
        [E, C] = n.useState(!1);
      (0, r.f)(() => C(!0));
      let R = (function () {
        let [, e] = n.useState({});
        return n.useCallback(() => {
          e({});
        }, []);
      })();
      n.useEffect(() => _(R), [_, R]);
      let P = 0,
        T = 0,
        D = 0,
        N = 0,
        A = 0,
        M = 0,
        O = !1;
      if (null != S && null != w) {
        let e = b(S);
        if (((O = !0), null != e)) {
          let { width: t, height: n } = a(e),
            { width: r, height: i } = a(w),
            o = e.getBoundingClientRect(),
            l = w.getBoundingClientRect(),
            s = r > 0 ? l.width / r : 1,
            u = i > 0 ? l.height / i : 1;
          if (Math.abs(s) > Number.EPSILON && Math.abs(u) > Number.EPSILON) {
            let e = o.left - l.left,
              t = o.top - l.top;
            ((P = e / s + w.scrollLeft - w.clientLeft),
              (D = t / u + w.scrollTop - w.clientTop));
          } else ((P = e.offsetLeft), (D = e.offsetTop));
          ((A = t),
            (M = n),
            (T = w.scrollWidth - P - A),
            (N = w.scrollHeight - D - M));
        }
      }
      let I = n.useMemo(
          () => (O ? { left: P, right: T, top: D, bottom: N } : null),
          [P, T, D, N, O],
        ),
        k = n.useMemo(() => (O ? { width: A, height: M } : null), [A, M, O]),
        F = n.useMemo(() => {
          if (O)
            return {
              [d.activeTabLeft]: `${P}px`,
              [d.activeTabRight]: `${T}px`,
              [d.activeTabTop]: `${D}px`,
              [d.activeTabBottom]: `${N}px`,
              [d.activeTabWidth]: `${A}px`,
              [d.activeTabHeight]: `${M}px`,
            };
        }, [P, T, D, N, A, M, O]),
        B = O && A > 0 && M > 0,
        z = (0, i.f)("span", e, {
          state: {
            orientation: x,
            activeTabPosition: I,
            activeTabSize: k,
            tabActivationDirection: y,
          },
          ref: t,
          props: [
            { role: "presentation", style: F, hidden: !B },
            v,
            { suppressHydrationWarning: !0 },
          ],
          stateAttributesMapping: h,
        });
      return null == S
        ? null
        : (0, g.jsxs)(n.Fragment, {
            children: [
              z,
              !E &&
                u &&
                (0, g.jsx)("script", {
                  nonce: m,
                  dangerouslySetInnerHTML: {
                    __html:
                      '!function(){const t=document.currentScript.previousElementSibling;if(!t)return;const e=t.closest(\'[role="tablist"]\');if(!e)return;const i=e.querySelector("[data-active]");if(!i)return;if(0===i.offsetWidth||0===e.offsetWidth)return;let o=0,n=0,h=0,l=0,r=0,f=0;function s(t){const e=getComputedStyle(t);let i=parseFloat(e.width)||0,o=parseFloat(e.height)||0;return(Math.round(i)!==t.offsetWidth||Math.round(o)!==t.offsetHeight)&&(i=t.offsetWidth,o=t.offsetHeight),{width:i,height:o}}if(null!=i&&null!=e){const{width:t,height:c}=s(i),{width:u,height:d}=s(e),a=i.getBoundingClientRect(),g=e.getBoundingClientRect(),p=u>0?g.width/u:1,b=d>0?g.height/d:1;if(Math.abs(p)>Number.EPSILON&&Math.abs(b)>Number.EPSILON){const t=a.left-g.left,i=a.top-g.top;o=t/p+e.scrollLeft-e.clientLeft,h=i/b+e.scrollTop-e.clientTop}else o=i.offsetLeft,h=i.offsetTop;r=t,f=c,n=e.scrollWidth-o-r,l=e.scrollHeight-h-f}function c(e,i){t.style.setProperty(`--active-tab-${e}`,`${i}px`)}c("left",o),c("right",n),c("top",h),c("bottom",l),c("width",r),c("height",f),r>0&&f>0&&t.removeAttribute("hidden")}();',
                  },
                  suppressHydrationWarning: !0,
                }),
            ],
          });
    });
  e.s(["TabsIndicator", 0, v], 454830);
};
