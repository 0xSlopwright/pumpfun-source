// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var r = e.i(732486),
    o = e.i(91163),
    t = e.i(689391);
  let i = t.z.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-warn-bg);
  border: 1px solid var(--privy-color-border-warning);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,
    l = t.z.div`
  color: ${(e) => ("dark" === e.$theme ? "var(--privy-color-foreground-2)" : "var(--privy-color-foreground)")};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  flex: 1;
  text-align: left;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;
  e.s([
    "W",
    0,
    ({ children: e, theme: t, className: a }) =>
      (0, r.jsxs)(i, {
        $theme: t,
        className: a,
        children: [
          (0, r.jsx)(o.f, {
            width: "16px",
            height: "16px",
            color: "var(--privy-color-icon-warning)",
            strokeWidth: 2,
            style: { flexShrink: 0 },
          }),
          (0, r.jsx)(l, { $theme: t, children: e }),
        ],
      }),
  ]);
};
