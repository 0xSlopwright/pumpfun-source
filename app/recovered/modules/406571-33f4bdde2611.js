// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(352386),
    i = e.i(63289);
  let a = "[data-sonner-toast]";
  function s(e) {
    if ("true" === e.dataset.textSelectFix) return;
    e.dataset.textSelectFix = "true";
    let t = !1;
    e.addEventListener(
      "pointerdown",
      (e) => {
        let r = e.target;
        t =
          r instanceof Element &&
          null !== r.closest("[data-content]") &&
          null === r.closest("[data-button], [data-close-button], a, button");
      },
      !0,
    );
    let r = e.setPointerCapture.bind(e);
    e.setPointerCapture = (e) => {
      t || r(e);
    };
  }
  function o() {
    document.querySelectorAll(a).forEach(s);
    let e = new MutationObserver(l);
    return (
      e.observe(document.body, { childList: !0, subtree: !0 }),
      () => e.disconnect()
    );
  }
  function l(e) {
    for (let t of e)
      for (let e of t.addedNodes)
        e instanceof HTMLElement &&
          (e.matches(a) && s(e), e.querySelectorAll(a).forEach(s));
  }
  let c = {
    toast:
      "data-[styled=true]:!rounded-xl data-[styled=true]:!border data-[styled=true]:!border-border-tertiary data-[styled=true]:!text-text-primary data-[styled=true]:!shadow-lg data-[styled=true]:!bg-bg-primary data-[styled=true]:!p-4 data-[styled=true]:!gap-3 data-[styled=true]:!text-[13px] data-[styled=true]:!font-medium data-[styled=true]:!leading-5",
    title:
      "[[data-styled=true]_&]:!text-[13px] [[data-styled=true]_&]:!font-medium [[data-styled=true]_&]:!leading-5",
    description: "!text-xs !leading-4 !text-text-tertiary",
    icon: "!size-4 [&_svg]:!size-4",
    error: "[&_[data-icon]]:!text-loss [&_[data-title]]:!text-loss",
    actionButton:
      "!inline-flex !h-7 !shrink-0 !items-center !gap-1 !rounded-md !bg-bg-tertiary !px-2.5 !text-xs !font-medium !text-text-primary hover:!bg-bg-quaternary",
    cancelButton:
      "!h-7 !rounded-md !bg-transparent !px-2.5 !text-xs !font-medium !text-text-tertiary hover:!text-text-primary",
    closeButton:
      "!border-border-tertiary !bg-bg-quaternary !text-text-tertiary hover:!bg-bg-tertiary hover:!text-text-primary",
  };
  e.s([
    "Toaster",
    0,
    function (e) {
      let a,
        s,
        l,
        u = (0, r.c)(6);
      return (
        u[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((a = []), (u[0] = a))
          : (a = u[0]),
        (0, n.useEffect)(o, a),
        u[1] !== e.toastOptions
          ? ((s = { classNames: c, ...e.toastOptions }),
            (u[1] = e.toastOptions),
            (u[2] = s))
          : (s = u[2]),
        u[3] !== e || u[4] !== s
          ? ((l = (0, t.jsx)(i.K, {
              theme: "dark",
              position: "top-center",
              visibleToasts: 5,
              toastOptions: s,
              ...e,
            })),
            (u[3] = e),
            (u[4] = s),
            (u[5] = l))
          : (l = u[5]),
        l
      );
    },
  ]);
};
