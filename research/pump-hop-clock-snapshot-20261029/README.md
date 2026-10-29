# Shared Clock snapshot for multi-hop events

The original per-hop function acquires Clock once and uses the same timestamp in
TradeEvent, CompleteEvent and PostCompleteBuyEvent. Current main after merged
PR #711 acquires Clock separately for those three constructors. The retained three-line
source proposal restores that consumed snapshot in the recorded candidate. This
research publication keeps canonical734 and the maintained C0 checkpoint unchanged.
The proposed5871 source remains exact in `native-build/proposed-source.rs` and the
actual compiled archive. Earlier fee-accrual recovery is already accepted in #711 and
is not claimed again here. No event, payment, guard, Source position or field
ordering changes.

Base: `f57bbf0dd856b101acd02c242cb5c4a56bf276b1`. Before source SHA256 is
`734bdae1189dd4e4f54a27fd215624611228f36b92d3877b63f00df19ccc9e44`;
after is `5871a2cf35ebe0db502eb242db0f1652ef93e51e4971e56483016d900349ac2b`.
`MAIN-65-BOUND.json` binds all 65 current-main standalone source Git blobs to
the actual compiled archive; this is the sole changed file. All 66 actual
workspace inputs and both local-crate compilation entries are retained in the
native cold-build evidence.

The original Clock call at `0x5b3b0+0x3018` defines timestamp `r9` at `+0x30e8`.
The full conservative instruction CFG proves that definition is the sole
reaching value at all three timestamp uses. The actual candidate Clock call at
`0x67860+0x3760` defines `r7` at `+0x3958`, again the sole reaching value at
trade-event argument `+0x3b00`, completion field `+0x3cb8`, and post-event field
`+0x4008`. Clock dominates all three uses. All conditional successors are retained;
no runtime path is forced. The actual callee-identity count changes are exactly
Clock::get 3→1 and its ProgramError conversion 3→1. All other complete callee
identities and occurrence counts remain unchanged from the accepted parent.

[Native run 40795474496](https://github.com/shawkkkkk/pumpfun-source/actions/runs/40795474496)
produces stripped `0bc4a222f4040ad49b7228cd5ce7476ce8a3c96725a4634c476bc07fd5f83c89`
and symbols `4f8f22984af1a35d9c6b0978e4d33b9e9bfe13a80188c6aabc41eb85fe3a0b14`.
The actual body is 18,056 bytes / 94 direct calls; original is 18,584 / 107,
accepted parent 18,536 / 98. It remains unmatched. The complete 1,035-window
census retains **1,019 normalized / 188 raw, zero gains and losses**. No shorter
length, whole-function equality, whole-ELF identity or security acceptance is claimed.

Fresh strict replays against original/current c0e29/candidate 0bc4 pass:

| Corpus | Parameter cases | Executed outcomes | Signature occurrences | Distinct serialized transactions |
| --- | ---: | ---: | ---: | ---: |
| Existing creation | 14 | 42 | 84 | 10 |
| Existing multi-hop | 13 | 39 | 39 | 6 |

All 81 executions use the actual captured Pump loader. Multi-hop uses the genuine
captured AMM→Pump CPI and default signature/PDA checks. All ordered log lines
except complete compute-meter lines agree, including unchanged Source records.
The middle control is the accepted **c0e29** image. The 199fd image is explicitly
the historical SDK-cohort anchor, never relabeled current.

A separate unchanged eight-case signed crossing corpus passes on original,
historical 199fd, current c0e29 and candidate 0bc4: 32 executed outcomes / 32
signature occurrences, two distinct serialized messages. Two admitted crossings
emit all three event types; four ordinary successes and two whitelist rejections
also agree. The report's historical labels `control/perhop/clock` refer to
199fd/current c0e29/candidate 0bc4 respectively. Preflight binds the unchanged
fixture SHA, actual outer AMM and inner Pump multi-hop selectors and real signer
roles before execution. No field mutation, Mayhem state, initializer, filtered
BuyV3 instruction or signer/owner/PDA bypass is introduced. Every outcome retains
its own loader observation; the wrapper's final receipt holds its last observation.
These eight records remain separate from the 13+14 corpus.

The accepted parent packets and artifacts remain untouched. This packet retains
one actual changed-source cold build, all commands/source/tool/dependency receipts,
raw reports and exact before/after source. It does not promote a new maintained
canonical image or claim the parent's complete 44-suite checkpoint for this new
source. Independent identical-source repetition is not claimed. Historical
proposal descriptors remain dispatch-time evidence, not current qualification status.

The unchanged maintained twelve-counter corpus also passes separately on
original/current c0e29/candidate 0bc4: 12 parameter cases, 36 executed outcomes /
36 signature occurrences, two distinct serialized transactions. Exact saved
prestates/messages are reused without further counter mutation; original Source
and rollback observations agree literally. The authenticated original producers
and counter inputs remain available for review. No mainnet reachability follows
from these synthetic preexisting counter states.

The portable verifier passes exact source/diff/guard-position checks, all 65
current-main Git blob bindings, all 66 actual native workspace hashes, the full
1,035-window census, both complete CFG timestamp def-use proofs, the precise two
callee-count changes, and all saved strict replays/signatures/loader bindings.
`qualification/reports/final-verification.log` retains the actual verification
output. Required root capture/tooling gates are recorded on the exact final PR
head in the PR description.

Verify saved evidence with normal Python and `solders` installed:

```sh
python3 -B research/pump-hop-clock-snapshot-20261029/verify.py --repo .
```

Both verification entrypoints explicitly reject optimized Python before imports
or validation because retained native authentication uses assertions. The exact
authored77 verifier is retained for inspection in
`review/author-verify-77e1701.py.txt`; its saved final-verification log remains a
historical execution record. Its declared old section-parser pin requires the
exact frozen673 helper cohort, which independent review checked without repinning.
The new entrypoint verifies retained proposed source, actual cold receipts,
complete censuses/Clock dataflow and cryptographic signatures/full ProgramData
hash derivations while leaving canonical734 selected.

The prior independent reviewer counter replay is also retained unchanged:36
executions/signature occurrences/literal captured loads across the same12cases and
two signed messages. Exact source/image/build/corpus/producer inputs are unchanged
between974 and77, so this execution evidence transfers; it was not rerun for77.
The new authored36-outcome counter run is separately verified, including exact
per-case loader associations. These are overlapping execution corpora, not added
unique cases. Eight private resealed controls reject Source-only, signature,
loader, cold-flag, timestamp-claim, counter-prestate and two valid-wrong-image loader
substitutions after an unaltered baseline passes.

No full-window or observed behavior gain warrants maintained promotion or an
additional native repeat/full44-suite run. Current accepted artifacts and source
remain selected. The one actual recorded cold build retains native macOS v1.44
and Linux SBPF libraries; it is not a native Linux build.

The authored preparation helper and fresh replay commands remain in
[`COMMANDS.md`](COMMANDS.md); they require new owned output paths and normal Python. Source/fixtures and
actual cold receipts remain authenticated; no historical expected-image guard is
disabled, and current c0e29 is distinct from the historical 199fd SDK anchor. No
additional compiler variant or broader compatibility/security claim is made.
