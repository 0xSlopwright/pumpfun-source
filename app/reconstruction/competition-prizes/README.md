# Original competition prize display components

The captured competition page has a complete prize-tier display and a distinct
ranked-entry badge. These were not available as editable, source-checked React
components on the review base. This unit recovers that display boundary, with a
usable component factory and real React rendering evidence. It does not change
the maintained page, API adapter or DTO projection.

## Components and source boundaries

`original-prizes.tsx` retains the complete **590407.D** tier component, **T**
heading and the exact conditional prize badge from **X**. Its JSX, React compiler
cache decisions, translation keys and utility classes remain intact; TypeScript
annotations are outside the original function bodies. `CompetitionPrizeDisplay`
binds the actual React JSX/compiler runtime and exposes `PrizeTier`,
`PrizeHeading` and `RankPrize` for a stable source context.

The formatter adapter preserves **706615.J** (the first covering rank range),
**k** (numeric-string currency formatting), the numeric regex, **592209** locale
canonicalization, **36489.Z** rank formatting and the used **890088** bounded
NumberFormat cache. Both captured NumberFormat variants are retained separately
with their original local identifiers; the caller must supply a reviewed full
source hash. There is no guessed global runtime winner. The rank palette literal
is identical in both reviewed **179537** variants; that does not establish whole
factory or deployment equivalence.

`contract.json` binds all reviewed variants/origins, raw capture hashes and exact
UTF-16/UTF-8 AST witnesses, including actual tier callers, the row planner and
the **139209** DTO field. The generator independently authenticates registration
IDs/ranges using the unchanged shared source reader, regenerates the complete
used bodies and rejects maintained AST, byte or contract drift. Captured bundles,
runtime factories and route-schema code are parsed, never executed. Generated
maintained adapters are the code exercised by tests.

## Host contract and attribution

Create the components once for the host's source context, outside render:

```tsx
const { PrizeTier, PrizeHeading, RankPrize } = createCompetitionPrizeComponents({
  numberVariant: reviewedFullSha256,
  useTranslation: legitimateHostTranslationHook,
});
// A separately qualified host supplies validated Prize props and served rank.
// <PrizeHeading title={hostTitle} />
// <PrizeTier prize={prize} />
// <RankPrize prizes={prizes} rank={servedRank} />
```

The host supplies translation and validated `{rankFrom, rankTo, amount}` props.
This unit provides no English label catalog or production prop parser. The class
join capability covers only the original display's finite nonconflicting
size/color strings; it is not a reconstruction of the complete class-merge
library. Heterogeneous compiler slots use `any[]` because original TS slot types
were not recovered; public component props are typed.

Accepted **PR864**, head `18689c86aa592b7a15819c90ae16225912c5ca46`, (merged2026-10-29T05:34:56Z), owns
the maintained prize projection, rules modal and captured English labels. Its
prior 706615 tracing is credited. None of that work is shipped or qualified
here. In particular, no claim is made that its sparse-array guard behavior is
unchanged. Future page wiring requires a separately qualified projection/provider;
this component-only PR neither duplicates nor repairs that dependency. The
unpublished earlier projection prototype and its receipts remain private and are
not evidence for this revised unit.

## Repeatable rendering outcome

The source-complete display preserves an observable distinction: numeric tier
amount `"1000"` renders as `$1,000` in English, while the entry badge retains raw
`1000`. Textual `2 SOL` remains text. Single and range tiers retain their different
translation calls; overlapping ranges choose the first covering prize and
uncovered ranks render no badge. Locale changes update formatting without
changing the supplied props or rank badge text.

The browser harness imports the actual maintained component factory, React and
compiler runtime. A loopback **test-only** host admits synthetic props using the
existing generic validator and retained public OpenAPI prizes schema. It tests
missing props, valid props, an invalid amount rejected before rendering, locale
updates and clearing. The source component itself makes no requests. Every
observed browser request is a loopback GET; there is no production service,
account, cookie, wallet, transaction or payout operation.

Both source contexts render at1280×900 desktop and375×812 mobile without
horizontal overflow. The four [screenshots](visual/README.md) are controlled
component-host output with clearly synthetic labels, not upstream screenshots
or evidence of a working main-page integration. Actual React SSR also checks
HTML escaping and unchanged input props. No full Next browser, translation
tenant, server ranking, pricing, scoring, payout or native API compatibility
claim is made. Upstream material retains its authorship; adapter names are local.

```sh
node scripts/original-competition-prizes.mjs --check
node --test tests/original_competition_prizes.test.mjs \
  tests/original_competition_prizes_browser.test.mjs tests/original_source.test.mjs
pnpm typecheck
pnpm verify:evidence
```

`validation.json` records the exact tested inputs, tools, outputs and raw logs.
The focused result is21 passes: nine source/formatter/schema-admission/SSR checks,
one real React/Chromium workflow covering four context/viewport combinations and
eleven unchanged shared-source tests. Aggregate app build/full tests and root
common gates are coordinator-owned; pending gates are explicitly recorded rather
than inferred from these finite checks. SDK, captures, lockfile, feature ledger,
API/types/page and completion counts are unchanged.
