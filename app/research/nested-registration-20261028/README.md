# Leading nested Turbopack registrations

The previous inventory skipped genuine factories inside the leading nested registration array. In `af9a2670547bb6bb.js`, that lost the actual achievements client (IDs 456747/656246) while the independent literal inventory still recorded its `GET /users/{address}/achievements` call. This correction recovers the missing functions as editable, provenance-bound source artifacts; it does not add API behavior or claim original TypeScript paths.

The same source format occurs in 89 retained captures. One parser correction restores all 1,229 omitted occurrences, including 1,032 previously unindexed factory hashes and additional origins for 36 already-indexed hashes. The complete inventory becomes **5,947 unique variants / 7,337 occurrences**, with the same 330 operation candidates. The developer binding ledger already covered all 67 documented operations and is unchanged.

## Runtime evidence

The captured runtime `evidence/web/objects/f25d7686d048ae16.js` has SHA256 `b5f9b5199b99ab6c141f4540f0b7d0fe803c4ecf6956849ecb6e59d3d439272e` (11,255 bytes). Its registration function `X(t)` occupies UTF-16 range **[7978,8812)** and is installed as `globalThis.TURBOPACK={push:X}`. For an outer array with more than two elements, it calls the recursive registration function with `(t,1,E)`. That function checks only the leading slot: `Array.isArray(i)&&(e(i,0,n,o),l++)`, where `i=t[l]` and `l` starts at the supplied index. It then maps each group of IDs to the following factory. A two-element outer array instead passes metadata to `registerChunk`. The parser follows this grammar rather than searching arbitrary nested arrays or function bodies. The regression suite authenticates this exact runtime AST without evaluating it; `RUNTIME-PROOF.json` records the raw range and function hash.

The achievements capture has SHA256 `7f30748aebd39a40629e117e152c37d598a801d138642116c9b1fccf08c8ee39` (24,473 bytes). Its leading nested array contains 13 actual factory occurrences. Twelve hashes were globally absent; the thirteenth was indexed from another capture. The client factory at **[12560,13428)** has SHA256 `89c0d9ad83a1fef8e32185695b92752b89680a6a772ef0b9c396d9b2cb1522f8`; its route literal at **[12888,12923)** was already bound by the developer ledger. `NESTED-OCCURRENCES.json` records every newly recovered occurrence, raw object hash, ID group and range across the complete corpus.

## Preservation and ambiguity

The generator retains the old flat inventory first and appends nested records deterministically. This keeps all 4,915 existing factory files, canonical paths and ID order, and all 6,108 existing origins as exact prefixes. Without that presentation rule, an earlier nested alias would rename the already-indexed `613677-70218c512ac6.js`. Index order does not claim runtime evaluation order. Distinct factory hashes sharing an ID remain separate; numeric IDs must not be treated as globally unique. New consumers must use object/range/hash context.

Captured evidence, SDK source, historical `evidence/validation.json`, developer bindings, compatibility coverage and feature-credit ledgers remain unchanged. The updated source-count reports describe only this retained static corpus, not frontend completeness, reachability, live behavior or reconstructed backend source.

## Reproduce and verify

Use Node >=22 and the existing pnpm 10.24.0 lockfile. These commands parse source as inert data; none imports or evaluates a captured factory.

```sh
cd app
corepack pnpm inventory
node --test tests/inventory.test.mjs
node research/nested-registration-20261028/verify.mjs
corepack pnpm verify:evidence
corepack pnpm check:progress
```

`BASELINE.json` records an unchanged main `6aa66f03c6e83e23f546be406b1eed158e15a507` regeneration that exactly reproduced the 4,915/6,108 inventory and all formatted files/reports. The five initial regression tests produced four failures and one pass before the parser change (`baseline-tests.log`). The final suite also checks earlier aliases preserve canonical paths and authenticates the runtime's recursive AST: **28/28 pass**. Full-corpus verification compares every old factory file to its base Git blob, retains every old ID/origin, authenticates all raw ranges, binds **5,941 factories by complete canonical Babel AST**, and requires exact pinned-formatter byte re-derivation for six shape differences (three old, three newly recovered; all listed in the result). It independently checks the entire added occurrence set. `REPEAT.json` records deterministic regeneration with zero mismatches across 5,950 derived files; `VERIFY-RESULTS.json` contains the measured audit. The recovery suite passes 4/4 tests, progress checks pass 8/8, and evidence verification passes all 698 captured objects, npm integrity and unchanged SDK source. These are local static checks, not production observations; full application build/typecheck/browser suites are not part of this receipt.

`git diff --check` reports four trailing spaces inside original template-literal contents in newly recovered factory `971370-6b08c0805443.js` and eight whitespace-only diagnostic lines in the raw baseline TAP receipt. `WHITESPACE-AUDIT.json` binds each source finding to a parsed `TemplateElement` range and records the complete exception set. Those literal contents and the raw receipt are preserved; no whitespace policy is relaxed. All other changed files pass the check.
