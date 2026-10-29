# Checkout recovery review — 29 October 2026

This archive preserves previously unpublished work found in the local checkout.
The pull request is composed on upstream `2401d9a95b28e1521a3beda035a4606415063322` and adds
47,789 previously absent evidence/research files. Every existing
upstream file is retained byte for byte.

The full reviewed checkout is preserved as commit
`5426b0e8df8b852596bc666700eecdf67e944d96`, the second parent of the publication merge.
That snapshot includes the superseded Pump Round48 source and original local
evidence packaging; use it when reproducing that maintained-source binding.
The publication tree preserves newer upstream program selections and packaging
repairs. No historical checkpoint is promoted over them.

## Included work

- [Pump Round48](../../repro/pump/main-contract-round48-20261027/README.md),
  its full saved corpus, archived source, compiler controls and reproduction recipe.
- [AMM behavior/context recovery](../../repro/pump_amm/behavior-context-recovery-20261027/README.md),
  with its archived-source and signed saved-receipt verification.
- The `goal-pump-*` and `goal-swap-*` research workspaces, including retained
  alternatives, failed trials and later source proposals. They remain unpromoted.
- [Standalone Mayhem workspace](../mayhem-root-workspace-snapshot-20261029/README.md),
  relocated from the root so the maintained root workspace is preserved.
- Seven historical Round48 queue/update artifacts. Existing upstream queue
  metadata and documented limitations are retained.

## Review and validation

Pump Round48 verifies 65 source inputs, 10,468 full cases, 7,680 focused
executions and 18,144 diagnostic pairs; 3,794 distinct signed transactions
are reverified. Whole ELF equality remains false.

The previous maintained AMM checkpoint verifies 17,462 saved cases and 35,418
signature fields. The archived behavior checkpoint independently verifies the
same broad corpus counts and all 4,042 manifest blobs, without fresh runtime
execution or a current-source claim. The corpora overlap and are not additive.
Twenty-five focused tooling tests pass.

The source review found and corrected a scratch Mayhem package displacing the
root workspace, an AMM status selection without its source integration, and
stale/missing progress references. Those local corrections remain in the
snapshot; the publication retains the newer upstream maintained files.

The overlap review compared 139,050 artifact paths against upstream and found
19 differences. All 19 upstream versions are retained, including removal of
nonportable bytecode receipts, provenance-seal propagation, and additional
counterexample caveats. See [review.json](review.json) for exact paths,
counts, pinned commits and validation limits.

These checks establish archive integrity and bounded saved behavior. They do
not establish exhaustive equivalence, original historical build provenance,
current-chain acceptance, or acceptance of every retained experiment.
