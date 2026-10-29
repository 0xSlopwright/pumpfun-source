// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var r = e.i(732486),
    o = e.i(689391),
    t = e.i(949894);
  let i = o.z.span`
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem; /* 150% */
  border-radius: var(--privy-border-radius-xs);
  display: flex;
  align-items: center;
  ${(e) => {
    let r, t;
    ("green" === e.$color &&
      ((r = "var(--privy-color-success-dark)"),
      (t = "var(--privy-color-success-light)")),
      "red" === e.$color &&
        ((r = "var(--privy-color-error)"),
        (t = "var(--privy-color-error-light)")),
      "gray" === e.$color &&
        ((r = "var(--privy-color-foreground-2)"),
        (t = "var(--privy-color-background-2)")));
    let i = o.q`
      from, to {
        background-color: ${t};
      }

      50% {
        background-color: rgba(${t}, 0.8);
      }
    `;
    return o.m`
      color: ${r};
      background-color: ${t};
      ${
        e.$isPulsing &&
        o.m`
        animation: ${i} 3s linear infinite;
      `
      };
    `;
  }}

  ${t.L}
`;
  e.s([
    "C",
    0,
    ({ children: e, color: o, isLoading: t, isPulsing: l, ...a }) =>
      (0, r.jsx)(i, {
        $color: o,
        $isLoading: t,
        $isPulsing: l,
        ...a,
        children: e,
      }),
  ]);
};
