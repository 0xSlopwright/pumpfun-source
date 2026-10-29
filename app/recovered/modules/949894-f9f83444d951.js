// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var r = e.i(689391);
  let o = r.q`
  from, to {
    background: var(--privy-color-foreground-4);
    color: var(--privy-color-foreground-4);
  }

  50% {
    background: var(--privy-color-foreground-accent);
    color: var(--privy-color-foreground-accent);
  }
`,
    t = r.m`
  ${(e) =>
    e.$isLoading
      ? r.m`
          width: 35%;
          animation: ${o} 2s linear infinite;
          border-radius: var(--privy-border-radius-sm);
        `
      : ""}
`;
  e.s(["L", 0, t]);
};
