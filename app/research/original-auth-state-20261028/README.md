# Original frontend reauthentication predicates

Captured factory553301 (`daab8eaf8a9c658f957e38a5748b14b24972bd7ba4d53ca758d83c48af094545`) exports a normalization delegateU and frontend state predicatesK/O. The actual AuthProviders589428 imports this module and callsK with decodedJwt, `privyAuthenticated:false` and the current public-key address; it omits nowMs. This unit recovers that small, used client boundary independently of the full provider.

The public TypeScript API is `packages/frontend/src/original-contracts/auth-state/index.ts`. The caller explicitly selects the exact retained source, injects the decoder's S operation and supplies the clock. It selects no browser globals, decoder variant, cookies, credentials, wallet, network or server session. The JavaScript kernel retains all three original export expressions and has typed declarations; its internals are source-adapted JavaScript, not independently typechecked original TypeScript.

## Preserved decisions

K requests frontend wallet reauthentication when Privy is false, the current wallet address is truthy, and claims are missing/malformed, expired at `exp *1000 <= nowMs`, or describe a different address. The captured contract accepts any string address and finite numeric exp; it does not validate base58, permissions or signatures. Fractional seconds and finite multiplication overflow keep their JavaScript behavior. Default Date.now runs during parameter destructuring, even when Privy or absent-wallet short circuits would later return false. An explicit nowMs suppresses that default. Clock errors propagate.

O compares the current wallet with the previous wallet and unverified claim address; it requires a current wallet, claims with a string address and Privy false. It ignores exp and does not read the clock. U calls the injected S decoder unbound, preserving input/result identity and exceptions.

Only K has an observed caller in the captured AuthProviders consumer. O and U remain original exported operations without an asserted caller or reachability. This is **unverified frontend UI state**, not JWT signature verification, login issuance, backend authorization or a complete original authentication system. The distinct reader350741's always-false expiry predicate is not substituted for K; PR680 recovers that reader separately.

## Source authentication

`PROVENANCE.json` binds the complete successful captured object, exact original factory/export/import slices, all retained origins, and the actual same-capture consumer import/K-call expressions to URL, SHA256, UTF-16 code-unit offsets and UTF-8 byte offsets. The source is `evidence/web/objects/9bafadffbe6dc98b.js` (`https://pump.fun/_next/static/immutable/chunks/1x1vr6gub7ts_.js`). It is never evaluated during extraction or verification.

The reviewed static transform removes the Turbopack wrapper and decoder import, injects its original decoder binding and Date lexical binding, and returns the exact original U/K/O expression nodes. Generated whole-module AST and canonical bytes are compared to that original-backed transform. Changed expiry boundary, clock, short-circuit guard, address comparison and added statements are rejected by negative controls.

The decoder's import683023 crosses a chunk boundary. A variant is not chosen here; the API requires explicit injection. The known same-capture553301→589428 link and its actual input keys are checked independently. The shared source helper and11 tests originate from search/contracts commitsf6e469c3b,124f1194c and0a9a1f084; they are a credited two-file prerequisite, not new auth work. No PR680 dependency or inventory expansion is included. `INDEX-COMPATIBILITY.json` proves both selected complete entries unchanged under the expanded inventory. That inventory also exposes another553301 variant (`82910285b715…`, source2e9c0799b2d037f0.js); it is not selected or claimed as recovered here. Numeric ID uniqueness is not assumed.

The source supports a shared AuthProviders dependency of included routes in `contracts/routes.json`; it does not qualify route execution, authenticated UI parity or the missing authenticated states in `contracts/coverage.json`. No global feature milestone, capture, SDK, dependency, backend or served route is modified.

## Checks

From `app/` with pinned pnpm10.24.0:

```sh
node scripts/original-contracts/auth-state/recover.mjs
node --experimental-strip-types --test tests/original_source.test.mjs tests/original_auth_state.test.mjs
corepack pnpm build
corepack pnpm test
corepack pnpm typecheck
corepack pnpm verify:evidence
```

From the repository root:

```sh
python3 scripts/verify_evidence.py
python3 scripts/test_tooling.py
```

Focused tests are10 original predicate cases plus11 shared source cases. They use injected synthetic claims, decoder and clock only. No actual user profile, cookie, credentials, wallet signing or production request is used. Full gate results are recorded in VALIDATION.json; no visual parity claim is made for this logic-only unit.

## Gate results

The focused21/21 tests, full app build, aggregate typecheck,698-object app verification,9 root capture checks and6 tooling checks pass. The full app test command passes230 backend tests,59 app Node tests and all focused/Python suites; Playwright finishes89/91. Failures are the unchanged leaderboard weekly/realized URL-state race tracked in PR663 and the Explore shell-search URL assertion. The latter passes1/1 when run in isolation; the failed full run is preserved. Relevant implementation/test bytes equal maintained main, with hashes in VALIDATION.json. No completely green aggregate test result is claimed.

## Inventory anchor update

`PROVENANCE.json` now binds `recovered/modules.json` sha256 `1d268ae7f2eb0f61eaaffd222269bf29d9ce06e9946372861721b2f159d868e2` (main after #679, which only added factory files and index entries) instead of `9631271006faa37ea6055a11be4ec1faf971b45e2c7cdb78fc08a6530e777a50`. Every cited factory and its complete index entry is byte-identical across both indexes, and `INDEX-COMPATIBILITY.json` is unchanged. The anchor was the only regenerated field (`recover.mjs --write`).
