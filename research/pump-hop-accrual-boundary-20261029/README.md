# Per-hop fee-accrual call-boundary proposal

The source proposal has now received one authenticated native cold build and
strict affected replays. It reconstructs two used original call boundaries; it
is **not a new maintained canonical binary selection**. The original per-hop window `0x5b3b0` (18,584 bytes) calls the existing
`BondingCurve::accrue_fees` body twice. The maintained selected body `0x67860`
(19,536 bytes) calls it zero times and performs the used accounting inline.
Restore those two real calls rather than replacing the route with a historical
snapshot. No function-window gain, whole-file identity, or Mayhem fix is claimed.

The publication parent is current main
`506921d658deeef506b281233d98b911d60e08c0`. Its hop source is the same Git blob
`742644a74a43f555a4d6d8a74fcdc1b3e76f74fb` analyzed at
`1285b5e9e3a29c1e2cf32246d6046035e5d66fad`. Before SHA256 is
`679b34ae4965bf1cdc999e0f45f3ae5e171116c5f04173e7394c3b9e48a0fb43`;
the sole changed program source has SHA256
`734bdae1189dd4e4f54a27fd215624611228f36b92d3877b63f00df19ccc9e44`.
The selected control remains composition 673: stripped `199fd737…` and symbols
`49df399b…`, with 1,019 normalized / 188 raw windows. The changed candidate also retains exactly 1,019 normalized / 188 raw windows,
with zero gains or losses; complete meaningful ELF identity remains false.

## Original arguments, stores and result uses

The raw caller/callee extracts and complete per-hop actual-callee occurrence
ledger are retained. Callee identities compare entire bodies using the unchanged
official narrow call/ELF-pointer normalizer, rather than numeric call targets.
They do not establish historical Rust spelling.

| Original call offset within `0x5b3b0` | Arguments / state | Success result |
| --- | --- | --- |
| `+0x2508` | `r2=self` from frame `-0xab8`; `r3=global` from `*(frame[-0xa48])+8`; `r4=protocol` from `-0xaf8`; `r5=creator` from `-0xb00` | Result tag2 at `-0x6d0`, value at `-0x6c8` loaded into `r6` |
| `+0x25b8` | Only with post-fill flag `-0xa98` nonzero; same self/global, protocol `-0xb10`, creator `-0xb30`. Before the call, store post quote `-0xb08` at self `+0x98` and post base `-0xac8` at `+0x90` | Same Result slot; success value into `r9` |

The target `0xa1bd8` is 1,456 bytes and matches current `0xb39b0` under the
official normalization (SHA256 `cfd961a7…`). It reads the Mayhem flag at self
`+0x9a`, splits protocol fees, checks and stores retained protocol fees at
`+0x78` and creator fees at `+0x70`, and returns raw buyback. The caller checks
`r6+r9`, applies `post_fee_amount` to that sum and separately to `r9`, then checks
received-sum minus received-post. These are the maintained raw/received value
roles in the proposed source.

`proposal.diff` replaces only that used manual accounting, places post-fill
state stores before the second call as observed, and removes the later duplicate
fee stores. The existing helper retains both terminal split assertions and
checked additions. The existing route amount/Mayhem/whitelist guards, 673 fee
snapshot and shared vault admission, completion flag, transfers and events remain.
The ordering of fee writes and their failures deliberately changes to follow the
original call boundary; the finite ordinary cases below pass, while overflow/state-error paths remain
unqualified. Removed/moved source-operation lines remain blank to preserve
unrelated existing error positions. This is disclosed position preservation, not
a new padding recipe or evidence of historical source coordinates. Existing
layout annotations are untouched.

## Rejected Mayhem witness

Two already retained, genuinely signed AMM→Pump messages were run on the original
and selected immutable images, changing only serialized curve byte 81 from 0 to 1.
Both images rejected inside Pump with `6108 MultiHopMayhemCurveNotSupported`,
Source 484. The saved structured errors, events, inner instructions, return data
and account states agree. Compute-meter lines differ; literal full-log equality
is not claimed. This is **two distinct transactions, four executed outcomes and
four signature occurrences**, with the actual captured Pump loader and actual
AMM→Pump CPI. It does not qualify an admitted Mayhem hop, demonstrate a bug, or
test the subsequently compiled proposal. No initializer or signer/owner/domain bypass was used.

The gzip record retains complete prestates, public signed messages, outcomes and
input hashes. The original producer is preserved unchanged, including its
historical absolute paths; it is a provenance record, not a portable controller.
No private key or credential is included. `verify.py` checks the single-byte
mutation, actual Ed25519 signatures and recorded rejection without sending any
new transaction.

## Reproduce the static verification

With the repository's existing Python/solders environment and the immutable
composition 673 symbols artifact available:

```sh
python3 -B research/pump-hop-accrual-boundary-20261029/verify.py \
  --repository /absolute/path/to/pumpfun-source \
  --selected-symbols /absolute/path/to/composition 673/artifacts/unstripped.so
```

The maintained source is read from this checkout; `--repository` supplies
authenticated existing scripts and original capture. `--original` can explicitly
select the unchanged captured Pump allocation. The verifier checks the exact
overlay/diff, retained Source-line positions, all 107 original and 109 selected
actual callee occurrences and complete normalized callee bodies, both helper
identities and original call offsets, and all four saved signature occurrences.
It performs no build or VM replay. Packet hashes are in `MANIFEST.json`.

## Actual native qualification

The unchanged native control [run 40791064153](https://github.com/shawkkkkk/pumpfun-source/actions/runs/40791064153)
reproduces composition 673 exactly. The isolated candidate
[run 40792780769](https://github.com/shawkkkkk/pumpfun-source/actions/runs/40792780769)
compiles only this frozen 734bdae1 source change. Complete retained artifacts,
commands, build logs, source archives, tool/library/registry receipts and workflow
bytes are in `native-builds/`. SDK archives are pinned by their full checksums.
The actual cold receipts authenticate all 65 standalone / 66 compiler-workspace
inputs before/after, with both local crates compiling from an empty target.
These cold builds are not relabeled as the historical ordinary local-crate builds.

| Image | SHA256 |
| --- | --- |
| Changed stripped | `c0e29e2d41c30e854f3548b37e87798d516e4e0e7769f40b7d8d16e31429795f` |
| Changed symbols | `dd73afe77d90d289e9383ee1aa12cdb26608752eb1a1f8b3a4135c0af786cb17` |

The complete official 1,035-window census remains 1,019 normalized / 188 raw,
with no gains or losses. `qualification/verify.py` recomputes every row with the
unchanged narrow official census implementation. Only its repository-input root
is supplied explicitly instead of inferred from a historical scratch path.

The changed per-hop body is 18,536 bytes / 98 actual direct calls, versus
18,584 /107 original and 19,536 /109 selected control. Its two actual calls at
`+0x30c0/+0x3150` target `0xb35c8`, the same complete 1,456-byte original-matched
helper. Raw caller disassembly retains the first call's self/global/protocol/creator
arguments, stores self `+0x98` post quote and `+0x90` post base before the second
call, and checks/uses the two returned buybacks. This proves the used call-boundary
recovery; the remaining full body/CFG differences are unresolved. Nearer length
is not a match or a gain.

Strict current 673 corpora were freshly run on original/current 199fd/changed c0e29e
with identical signed messages and prestates. All observations and **all ordered
log lines except complete compute-meter lines**, including Source coordinates,
agree. Captured upgradeable Pump accounts and actual AMM→Pump CPI are preserved.

| Corpus | Parameter cases | Executed outcomes | Signature occurrences | Distinct serialized transactions |
| --- | ---: | ---: | ---: | ---: |
| Creation |14|42|84|10|
| Multi-hop |13|39|39|6|

All 81 outcomes use captured Pump loader allocations. Creation includes successful
Tokenkeg/Token-2022 quote-ATA creation, rejected quote keys, remaining counts 0–3,
and readonly ATA privilege failures. Multi-hop includes ordinary Tokenkeg buy/sell,
actual Token-2022 zero/capped-fee flows and malformed-fee/ATA/owner priority cases.
These counts are parameter records and repeated outcomes, not 81 unique inputs.
An unchanged-control run passes the same scope separately. Raw reports, tool
hashes, the immutable historical producer and the explicit executed path/receipt
adapter diff are retained under `qualification/`.

Reproduce the native source/census proof and prepare the exact runtime harness:

```sh
python3 -B research/pump-hop-accrual-boundary-20261029/qualification/verify.py \
  --repository /absolute/path/to/pumpfun-source
python3 -B research/pump-hop-accrual-boundary-20261029/qualification/prepare_runtime.py \
  --repository /absolute/path/to/pumpfun-source --output /absolute/path/to/new-runtime
```

From the new runtime directory, use the commands in
[`qualification/COMMANDS.md`](qualification/COMMANDS.md). They authenticate the
actual native cold receipt/tar/tool/dependency data, preserve the old producer,
replace its historical canonical-image leg explicitly with current 199fd, and
strengthen its program-message-only check to every non-compute log line. The
current 673 receipt and its original producer are never overwritten or substituted.
`verify_native_replays.py` verifies the stored public reports without new execution;
absolute historical execution paths remain provenance rather than image identity.

This qualifies the bounded call reconstruction under finite affected tests. There
is one changed-source native build; an independent changed-source repeat and the
complete 44-suite checkpoint are **not claimed**. The 13-hop corpus does not close
all post-complete/overflow paths. No Mayhem-domain admission, new initializer,
whole-file identity, current selection promotion, security acceptance or historical
Rust spelling is claimed. Original SDK/captures/dependencies, comparator rules,
global completion ledgers, constructor, CTA helper and stopped work stay unchanged.
The source proposal directly changes this PR branch's program file; upstream's
qualified maintained selection remains the existing 673 image.
