# Authenticated Turbopack route graph

This packet is a deterministic static analysis of retained Pump.fun frontend evidence. It does not execute captured JavaScript and does not claim recovery of original TypeScript or runtime/API compatibility.

## Measured scope

- Analyzed code lines: 258521
- Unique factory content hashes: 978
- Provenance-qualified identities: 1810
- Authenticated captured JavaScript objects: 176
- Import boundaries: 9381
- Exact / ambiguous / unresolved: 3966 / 442 / 4973
- Exact cross-chunk edges: 3166
- Authenticated route captures: 8
- Internal / developer operations attributed: 254 / 36

## Reproduction

From `app/` run:

```sh
pnpm install --frozen-lockfile
pnpm graph:build
pnpm graph:verify
pnpm test:graph
```

The builder authenticates manifest hashes and byte lengths, decodes UTF-8 strictly, and checks every recovered factory's UTF-16 half-open source range. Each recovered formatted factory must have a complete canonical AST equal to its authenticated raw factory. The canonical form excludes parser locations, comments, tokens, raw literal spelling, and empty no-op statements while preserving executable structure. For the small set where the pinned formatter itself changes Babel AST shape, exact byte-for-byte re-derivation through that formatter is required instead. Route seeds are keyed by module ID, factory hash, captured object, and source range, so identical bytes in an unreferenced object do not inherit another object's route. Captured factories are parsed without evaluation, and publication uses a temporary directory. `MANIFEST.json` binds every generated record; verification rebuilds the packet from current authenticated inputs.

## Interpretation boundaries

`EXACT` means the selected captured chunk context has one supported target, or the selected corpus contains one target identity. `AMBIGUOUS` preserves multiple compatible variants. `UNRESOLVED` means no target is present in the selected authenticated corpus; it is not evidence that the original application failed to resolve it. Route attribution requires captured HTML to reference an authenticated asset that contains the exact provenance-qualified factory identity. API attribution links existing ledgers to enclosing factory ranges and remains static evidence, not a live-service qualification. Exact captures were unavailable for `/profile/:id` and `/portfolio`; those entries are deliberately empty.
