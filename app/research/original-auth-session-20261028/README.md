# Original browser session reader and unverified claims

This unit source-adapts the captured frontend reader350741 and claims decoder683023 into an independently importable, typed browser-logic boundary. All three retained source contexts and all six distinct original factory hashes remain separate. It adds no login service, session issuer, wallet challenge, backend authorization, network request or active UI integration.

The public entry is `packages/frontend/src/original-contracts/auth/index.ts`. A caller must provide an exact supported capture source, browser capabilities and a React `useSyncExternalStore` binding. No global browser state or default module variant is selected. The extracted JavaScript kernels retain original declarations and export expressions; `.d.mts` declarations and the TypeScript facade describe their public types. The kernel internals are JavaScript, not independently TypeScript-checked original source.

## Original evidence and scope

`PROVENANCE.json` binds each factory, every retained origin, each original declaration/export expression and the AuthProviders consumer witnesses to immutable captured URLs, complete-object SHA256, UTF-16 ranges, corresponding UTF-8 byte ranges and raw-slice SHA256. Current inventory and capture-manifest SHA256 are pinned separately. `INDEX-COMPATIBILITY.json` also records exact equality of the seven complete selected entries under the separately recovered expanded inventory7b52e2cfb; that inventory change is not included here. Regenerate provenance after reviewing any future inventory update. Inputs are the successful responses in `evidence/web/manifest.json` and actual registration ASTs in their original objects, not formatted `recovered/modules/*.js`.

| Capture source basename | Reader350741 SHA256 prefix | Decoder683023 SHA256 prefix |
| --- | --- | --- |
| f4e16ef1b0b97d5e.js | b7990dc05987 | d48cce6d6408 |
| 87a44458ebf665fe.js | 9dbafa1f0ea5 | 6acdbc74d187 |
| 27a1ee00eb5909ec.js | 160a6dc5c856 | b672846d9145 |

The static consumer589428 (`4d12898c1c6c…`, captured `9bafadffbe6dc98b.js`) imports numeric350741, exports AuthProviders, invokes its reader hook four times, clears the cookie and requests `POST /auth/logout` with credentials. These exact expressions are witnessed. The consumer's cross-chunk variant resolution remains ambiguous: this unit does not choose one of the three readers for it. The full provider and original server session implementation are not recovered.

This is a shared auth dependency of the included routes in `contracts/routes.json`, including `/`, `/profile/:id`, `/portfolio` and `/create`. No route, authenticated-state, visual or API compatibility milestone is advanced. The missing authenticated states listed in `contracts/coverage.json` remain missing. This unit is independent of PR657's under-review source graph and does not modify it or its reported denominator.

## Preserved behavior

- Cookie `auth_token` takes precedence over `localStorage["decoded-jwt"]`; malformed cookie claims fall back to parsed storage claims. Both raw inputs determine cache invalidation. Unchanged inputs retain snapshot identity.
- `UnverifiedUiClaims` means decoded frontend data. The code performs no JWT signature verification, address validation, permission authorization or session check. Roles remain an array of unknown values; permissions survive only as a string array. Finite `exp` is accepted, with finite `iat` or zero.
- All three captured expiry predicates return false. Past expiry values remain visible here. The larger AuthProviders consumer has separate expiry/authentication behavior; this predicate is not a complete security policy.
- Base64url conversion uses the captured `atob` binary-string behavior before JSON parsing. No new UTF-8 repair is added.
- SSR snapshot is null. Storage access errors become null; cookie getter exceptions propagate. Focus, storage and visibility listeners are shared until the last unsubscribe. The captured scheduling function is empty.
- Cookie clearing writes the host cookie and parent-domain variants except the top-level domain, then notifies listeners. It does not clear local storage; the separate consumer performs additional logout cleanup.

## Source adaptation and verification

`node scripts/original-contracts/auth/recover.mjs` verifies the checked-in kernels and provenance. `--write` deterministically regenerates them after an explicit source/index review.

The reviewed transform removes the Turbopack wrapper, replaces only the two runtime imports with explicit parameters, shadows browser globals with injected lexical capabilities, and replaces export registration with a returned object of the same expression nodes. Existing subscribe and SSR functions are also exposed for testing. Original local identifiers, operators, literals, declaration order, functions and export expressions are retained. No captured factory, bundle, runtime, dynamic import target or generated string is evaluated during extraction or verification.

Verification reconstructs expected adapted ASTs directly from authenticated original registration nodes and compares the entire adapted module AST. Its AST comparison ignores only formatting, comments and source locations; the canonical generated bytes and their SHA256 are checked separately. Negative controls change expiry, cookie keys, fallback ordering, token length checks and add executable code; all are rejected. The shared source helper also rejects invalid UTF-8, source/hash/range/registration substitutions, ambiguous origins, forged non-object paths and symlinks.

## Validation

From `app/`, with pinned pnpm10.24.0:

```sh
node scripts/original-contracts/auth/recover.mjs
node --experimental-strip-types --test tests/original_source.test.mjs tests/original_auth.test.mjs
corepack pnpm --filter @pump-reconstruction/frontend typecheck
corepack pnpm verify:evidence
```

The focused run has24 auth tests plus11 shared source-authentication tests. Browser capabilities contain synthetic in-memory cookie/storage/event state only; test tokens carry synthetic unsigned claims. No user profiles, browser credentials, production cookies, network auth, captured bundle execution or wallet signatures are used. This is no UI change, so no visual parity or browser screenshot claim is made. The complete required gates were also run for publication; see the results below.

## Shared prerequisite attribution

`source.mjs` and its11 tests are unchanged shared source-authentication work by the search/contracts lane, original commitsf6e469c3b,124f1194c and0a9a1f084. They are included as a necessary two-file prerequisite while absent from maintained main, not claimed as new auth work. The inventory expansion7b52e2cfb is separately attributed and omitted from this PR.

## Publication gates

`PUBLICATION-VALIDATION.json` records the exact tested source heads, command results, log hashes and unchanged baseline files. Full build, aggregate typecheck,698-object app evidence verification,9 root capture checks and6 tooling tests passed. The final focused run passes35/35 (24 auth plus11 shared helper tests).

The full app test run passes230 backend tests,72 app Node tests, all focused/Python suites and90/91 Playwright tests. It exits1 because the unchanged leaderboard test selects weekly then realized but observes daily/realized. Both the implementation and test bytes equal maintained main; the independently reproduced existing fix is PR663. This unrelated fix is not included. Build/full-test inputs predate only the small static shared-helper outer-metadata correction; its final11-test suite passes separately, and no served route or auth adapter changed. No completely green aggregate test result is claimed.

The earlier `VALIDATION.json` preserves the independent initial expanded-inventory qualification. The publication receipt and current `PROVENANCE.json` bind the maintained-index PR.

## Inventory anchor update

`PROVENANCE.json` now binds `recovered/modules.json` sha256 `1d268ae7f2eb0f61eaaffd222269bf29d9ce06e9946372861721b2f159d868e2` (main after #679, which only added factory files and index entries) instead of `9631271006faa37ea6055a11be4ec1faf971b45e2c7cdb78fc08a6530e777a50`. Every cited factory and its complete index entry is byte-identical across both indexes, and `INDEX-COMPATIBILITY.json` is unchanged. The anchor was the only regenerated field (`recover.mjs --write`).
