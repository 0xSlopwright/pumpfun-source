# Pump exact-SOL correction-branch recovery

This source proposal moves the corrected-quote zero check inside the fee-correction
branch in `buy_exact_sol_in` (original `0x14f4e0`). The original no-correction edge
jumps directly to token pricing. The selected source places the quote-zero guard
after the correction branch; moving it inside reproduces the original physical
block arrangement.

The 13,224-byte function now differs from the original in **4 narrowly normalized
bytes instead of 371**. This is a partial body improvement: two return-word loads
remain reversed, and **no new complete function window is claimed**.

| Same local build cohort | Parent | Candidate |
| --- | ---: | ---: |
| Target length | 13,224 | 13,224 |
| Different normalized bytes | 371 | 4 |
| Different 8-byte instruction slots | 94 | 2 |
| Sequence edit instruction count | 56 | 2 |
| Whole normalized windows | 1,019/1,035 | 1,019/1,035 |
| Raw-equal windows | 183 | 183 |

All normalized and raw memberships are unchanged. The independent comparison
cross-checks the official normalizer byte-for-byte, including its operand list.
Only internal CALL immediates and section-pointing LDDW operands are masked;
branch offsets, registers, stack offsets, syscalls and scalar constants are exact.
The last differences are slots 1003/1004: original `0x151438/0x151440` loads the
error tag into r3 then payload into r1, while the candidate reverses those loads.

## Source and behavior

`source.patch` contains the two-line delta; `source/programs/pump/src/buy.rs` is
the visible candidate. The parent and candidate workspace archives retain all
66 compiled inputs. Only `programs/pump/src/buy.rs` changes, at physical lines
96 and 110. The existing source coordinates and padding are preserved.

The dominating line92 check already proves `raw_quote > 0`. When total fees fit
within the spend budget, quote equals raw_quote, so the removed successful check
cannot fail or produce side effects. On the correction arm, the same subtraction,
Overflow propagation and zero check run in the same order at Source110. Original
assembly confirms the bypass edge at `0x14ffc0`, positive corrected quote test at
`0x150160`, and token-pricing join at `0x150268`.

The source parent is the maintained multi-hop-accrual composition selected at
`097c29aee55d0616df64260aa8635a536e759ec8`; the PR base is a later main with the
same buy source. This packet proposes the source delta without rewriting sealed
historical evidence or changing the canonical selected-image records.

## Actual local validation

Normal offline Cargo builds of parent and candidate use the same physical source
paths, release flags, v1.44 SBPF libraries and private dependency cache. A second
candidate compilation from a separate source directory repeats both complete
outputs. Each recorded root build actually invokes rustc once; the source hashes
remain unchanged. External dependencies are reused and this is not an empty-cache
repeat. `build/*/launch.json` records every executed argument, source hash and tool
hash; compressed build logs preserve the exact output bytes. `controllers/` preserves the exact local producers with their original paths.

These are Linux transport builds, **not** a reproduction of the maintained native
macOS ELF. The local parent itself has 183 raw windows versus the published 188;
that pre-existing host-cohort difference is not attributed to this patch. The
target parent's normalized bytes equal the published 673 target, and the latest
source parent differs from673 only in the already-maintained multi-hop file.

- Parent stripped SHA256: `de952d71e5fa89611eae1b024f4a3c3360a0f6b23d5a2b043f196f83e828f5bc`.
- Candidate/repeat stripped: `f872c751861f3b412ce79856cf2d3930668dc6e347231a8e69e4ea799b5c00c4`.
- Candidate/repeat symbols: `ce94d76742d68ee03fc278768356c3f8ef8939230618cfabe39e3ced14e1158a`.

The exact three imported runtime producers are retained under `runtime/producers/`
with their original source-commit hashes. The later main loader adds an allocation
cache; these earlier execution records are not relabeled as runs of that version.

Fresh local captured-loader validation executes 286 cases on each of original,
parent and candidate: **858 executions and 858 verified serialized signatures**,
209 original successes. All watched state, prestate, errors, returns, events,
inner instructions, transaction bytes and ordered logs agree. Only complete
compute-meter log lines are excluded; Source lines are never substituted.
The 284 existing legacy cases include correction/no-correction and partial-fill
successes. Two added spend boundaries exercise Source110 (spend2) and a positive
corrected quote that reaches the later Source143 minimum-token error (spend3).
No Source133 error fixture or full broad-suite coverage is claimed.

The parent-to-candidate outbound audit finds 101 calls to 41 distinct callees:
addresses, multiplicities and complete raw callee bodies are identical. All 43
LDDW sites retain 16 referents and multiplicities, with byte-identical complete
`.rodata` and `.data.rel.ro`. This is a one-hop reference-class audit, not recursive
or original-to-candidate call/data closure. Whole ELF equality remains false.

## Recheck saved evidence

From a checkout with the repository's pinned `requirements.txt` installed:

```sh
python -B research/pump-exact-sol-guard-20261029/verify.py --repo-root .
```

The verifier decompresses into a temporary directory, recomputes all 1035 windows,
rechecks the target/reference audit, source/build bindings, runtime observations
and transaction signatures. It does not execute Cargo or a VM; saved records are
not cryptographic execution attestation. The actual build commands and runtime
producer are retained separately so their exact execution scope is inspectable.

`analysis/FAILED-HYPOTHESES.md` records the rejected return-structure probes. No
compiler flag change, inline assembly, edited IR or post-link code patch is used.
Completing the remaining two-load order and qualifying native macOS integration
are still open.