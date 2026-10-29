# Frozen651 math and dependency review

Base: `97bd5553c199cd24fb2d07034c365527bee5b138bf5dd7a0aa3099186aad2643` (651 normalized / 148 raw). This review changes no selected or publication source. The H7 math/dependency partition still has23 unmatched original windows against this base; `partition.json` and `mapped.json` preserve their call and nearest-body evidence. Similarity scores are search aids, not matches.

## Selected source-only handoff

`recovery.patch` changes only `programs/pump-amm/src/curve/fees.rs`: borrow `pool.quote_mint` during fee-schedule comparisons instead of copying its32 bytes. The three compared public keys and every fee branch/threshold remain unchanged.

Original selector0x14088/1656 addresses the quote key in its parent pool:0x14510 takes pool+0x40, with memcmp calls at0x14538,0x14578,0x145b8. Current651 copies four u64 words from that field to the stack at selector+0x490..0x4c8 before its first quote comparison. The borrowed-key object takes the direct pool+0x40 address at+0x468..0x470 and has no corresponding32-byte copy. `borrow-selector.asm` retains the complete control.

The unmodified direct object calibrates to every normalized byte of the current1,760-byte selector, with the same relocation/call-position inventory. The borrowed variant is1,632 bytes and retains the same13 logical direct callees and actual ordered three32-byte quote keys as the original. It is still different from the original1,656-byte body. In particular, original canonical-key comparison precedes the short-config error branch, whereas the current/control machine layout places the check first. No complete-window gain, runtime equivalence, transitive identity, or historical source-text identity is claimed here. Parent will qualify the patch in the combined linked build.

A separate owned-selected-fees experiment copies the selected fee record before applying the creator override. It yields1,616 bytes but moves canonical memcmp after error construction and does not restore the original instruction schedule. This is an unselected diagnostic (`source-owned`, `owned.o`); it is not in `recovery.patch`.

The first object invocation mixed old and current Anchor artifacts, causing trait-identity errors before code generation. Its complete failed command/log is retained in `failed-mixed-anchor-diagnostic`. The accepted controls use the actual final651 Anchor pair selected by root fingerprints (`anchor_lang-c26e3b3b316f08d7`, `anchor_spl-ada1e0c2ba94cd91`) and read-only target/SDK mounts. No cached source or artifact was changed.

## Remaining partition

Seven windows match after masking only typed source-record filename-length and line stores:0x11e70,0x123a0,0x12840,0x12b08,0x13190,0x13d30,0x74900. `source-only.json` gives the exact old/current records. They are not counted as normalized matches and no coordinate fitting is proposed.

The native fee arithmetic originals0xf2d60/368 and0xf2ed0/776 already have exact standalone natural Rust controls in `work/amm-fee-native-next-20261027`: separate amount-zero return and delayed maximum-fee read. Their application boundary/native24-byte record copy remains unresolved; current SPL packed conversions and same-crate inlining do not establish historical dependency provenance. The prior public-method, cross-crate, parser spelling and wide-u128 quote controls remain bounded negative evidence; they were not repeated here.

Original0xc5d0/1240 serializes seven32-byte public keys (last load offsets0xc0..0xd8), with two calls from0x19138. Current nearest array serializer is the distinct eight-key1,424-byte instantiation. This is a missing serialization boundary, not evidence that Borsh bytes or dependencies differ. The event/data lane owns followup.

A separate source/control review is proceeding for `from_mint`: original0x74128 calls Clock::get at+0x2f8 after any successful TLV result, then tests the no-fee variant at+0x4b8. Current source returns the no-fee variant before reading Clock. That hypothesis is isolated in `work/amm-transfer-fee-clock-next-20261027`; it is not included in this handoff.

Run `python3 -B work/amm-math-dependency-review-20261027/verify_static.py` from the original repository for the offline bounded object, key-byte, source-composition and calibration checks. No compilation or target execution occurs in that verifier.
