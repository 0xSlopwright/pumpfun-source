# Pump SellV2 event snapshots: bounded source overlay

This packet recovers a concrete evaluation-order difference in the remaining
SellV2 window `0x144508`. The captured program compares the event's quote mint
with the default key, snapshots the event user and base-mint keys, and then calls
`Clock::get`. Selected composition 673 calls `Clock::get` first and only reads
those values on its success path. The included source overlay expresses the
captured order using the existing operations and their actual event consumers.
**The overlay has not been compiled or executed. It is not a new matched window,
a runtime-defect claim, or a change to the selected program source.**

## Exact inputs

The reference is main `1285b5e9e3a29c1e2cf32246d6046035e5d66fad`, selected packet
`research/pump-final-composition-673-20261028`. The publication branch starts at
main `a18e1e89b59bf9d734955550c92f321c97c95e62`; that packet's tree is unchanged.
No prior published packet or capture is modified or recopied here.

| Input | SHA256 |
| --- | --- |
| Captured Pump allocation | `7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d` |
| Selected symbols ELF | `49df399b8a36a0a60de03e8d55f1417261dc451e44845ca9d17a94040968c680` |
| Official complete inventory gzip | `c66bb5ece1676933838403fa99c120b636eba9c3db4e543bb32d614bcac6451d` |
| Selected `source/src/sell_v2.rs` | `0a214cbd9077b5606c1c867e831d9ccc5cc2705262d568061c03925334783b4c` |
| Proposed `overlay/sell_v2.rs` | `f1f484c50a792c82fba414dff31b6bfc55f03cbec54d7115782c60ad5870b45d` |

Original `0x144508` is 13,976 bytes. The actual selected `sell_v2::execute` symbol
starts at `0x86170` and is 14,104 bytes. The official inventory keeps this window
unmatched; overall qualification remains 1,019/1,035 normalized and 188 raw.

## Recomputed facts

`verify.py` authenticates all five inputs, decodes the complete two function
windows, checks every internal jump target, builds the instruction CFG, and checks
reachability with a proposed dominator removed. Calls are modeled with an ordinary
returning fallthrough edge. This is an intraprocedural control-flow model, not a
universal semantic model of callees.

| Used operation | Original offset | Selected offset |
| --- | --- | --- |
| Quote-mint comparison (`memcmp`) | `+0x29e8` | `+0x2a90` |
| User key input chain begins | `+0x2a00` | `+0x2aa0` |
| Base-mint key input chain begins | `+0x2a50` | `+0x2af0` |
| `Clock::get` | `+0x2ab8` | `+0x2a20` |
| First actual `TradeEvent::data` | `+0x31e8` | `+0x3260` |

The original comparison and each final key-word store dominate `Clock::get`.
There is no alternate internal CFG entry into the original comparison/key/Clock
region. The selected `Clock::get` dominates the comparison instead. The original
Clock result guard is checked after the key snapshots; the selected guard precedes
them. Thus this finding does not rely on physical cold-block order alone.

Both images read the user through account-bundle offset `0x158`, and the base mint
through offset `0xf8`, its AccountInfo reference at `+0x58`, and the key pointer at
`+0`. All four words of each key are tracked into their local snapshots and then
into the actual event input (mint at event `+0x30`, user at event `+0x60`). The eight
checked event-copy stores dominate the first event serialization. No intervening
direct stack write targets those snapshot slots. The exact load/store witnesses
and CFG results are in `STATIC-PROOF.json`.

The actual comparison, Clock and both event-data calls target members of the
corresponding complete original windows' official normalized match sets. This
checks callee identity separately from ordering. Normalized callee membership
still does not establish literal whole-program identity or arbitrary memory-effect
and alias equivalence. Calls between snapshots and serialization use distinct
explicit result buffers; the packet does not claim a universal alias proof.

## One natural source proposal

`source.patch` changes only physical lines 402 and 403 of the selected source.
It moves the existing `is_sol` evaluation before the clock, binds `user` and `mint`
there, and uses those real locals in the event. It introduces no unused operation,
helper, constant, binary padding or byte injection. It changes no arithmetic,
transfer fee, minimum-output guard, domain restriction, validation, CPI or reserve
operation. The selected source remains immutable; the full isolated overlay is
provided to make a future one-recipe compiler measurement reviewable.

Every existing macro invocation retains its physical line and column, including
all Source-emitting `require!`/`error!` sites. Existing deliberate inherited Source
positioning remains explicitly inherited reconstruction, not a claim to original
Rust spelling or authorship. No formatting or representation variants are proposed.

The stopped **new SellV2 corrective/transfer-fee probe** stays stopped. **No SellV2
VM execution is authorized or performed for this packet.** A later compiler
measurement must first reproduce the exact selected control using the documented
native macOS v1.44 compiler and authenticated Linux v1.44 SBPF libraries. It must
freshly compile both local crates, bind all actual source/build inputs, retain the
full official census and verify actual call targets. That future work is not
claimed here, and this packet does not promote the overlay to maintained source.

## Repeatable validation

From a repository checkout containing the existing frozen input packet:

```sh
python3 research/pump-sell-event-order-20261029/verify.py --output /tmp/sell-event-order.json
cmp research/pump-sell-event-order-20261029/STATIC-PROOF.json /tmp/sell-event-order.json
python3 research/pump-sell-event-order-20261029/test_verify.py
```

Sparse checkouts may provide `--original`, `--symbols`, `--inventory`, and `--source`
paths to the same hash-bound files. This mode performs no network access. Ten tests
use the real frozen inputs and in-memory corruptions: bypassing the key snapshots,
changing a source account field, changing the consumed stack slot, inserting an
intervening overwrite, replacing the Clock call, corrupting the candidate, and
introducing an unrelated arithmetic edit are rejected. The positive test requires
exact equality with the retained proof, including its explicit unqualified status.

See `VALIDATION.json` for exact commands, hashes and common-gate status. These
static checks do not run a compiler, loader, transaction or stopped probe.
