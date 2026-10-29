# Pump V3 buy fee-tuple recovery (partial)

Four Rust line edits retain the V3 buy event's fee tuple immediately after fee calculation. The actual compiled handler shrinks from **3,800 to 3,760 bytes**, toward the original **3,672-byte** function at `0x147ba0`. Its sequence-aligned, narrowly normalized difference falls **263 → 196 eight-byte slots**. The complete target remains unequal. The full Linux census stays **1,019/1,035 normalized and 183 raw**, with every existing membership preserved.

Apply `source.patch` to the selected D037 66-file workspace qualified by `research/pump-program-creator-notice-qualification-20261028`. The exact parent and candidate source archives, hash maps and readable changed files are included. Only `programs/pump/src/trade_v3.rs` lines 812, 814, 843 and 844 change; physical source line counts remain fixed.

```rust
let fees=v3_trade_fees(a,quote)?; let fees=(fees.protocol_fee,fees.creator_fee,fees.protocol_fee_bps,fees.creator_fee_bps);
```

Later costs/execute calls use `fees.0` and `fees.1`, and the event call borrows `&fees`. The four fields are owned `u64` values in a Copy type with no destructor. Their order, arithmetic, error propagation and intervening calls are unchanged. No reference to the prior local escapes to those calls.

The qualified parent LLVM trace ends the 40-byte fee-result lifetime after extracting four scalar values, then starts a separate 32-byte tuple lifetime immediately before `v3_emit_buy`. Original assembly instead stores the four values into the contiguous stack block `[-0x110,-0xf8]` after fee calculation and passes that block to the event helper. The candidate now uses that same block and removes the parent's seven late reconstruction instructions (three loads and four stores). Other spill changes make the net reduction five instructions / 40 bytes. The new block is not claimed raw-identical to the original: register allocation and ordering still differ.

`analysis/buy.ll` comes from the existing diagnostic compile whose entire buy body is raw-equal to the normal parent; `buy-ir-qualification.json` records that comparison. Candidate IR was not emitted or edited. Actual normal-build assembly establishes the change. The instruction alignment is a diagnostic using `SequenceMatcher(autojunk=False)` after the unchanged official narrow normalization, not a count of all positional byte differences or a full-function match.

Across all 1,071 shared named functions, only this buy function's complete normalized body changes; no symbols appear or disappear. The parent and candidate preserve all 29 direct-call sites in the same linear order across 22 distinct targets. Every complete callee body is narrow-normalized equal; four are raw-equal and 18 contain relocated operands. The audit also resolves those callees' own 215 call and 221 address operands. All 15 bounded data objects directly referenced by the target resolve equally in original, parent and candidate. Original correspondence is exact for 20 of the 22 callee targets / 27 sites. These checks are recorded by `audit_refs.py` and `audit/reference-audit.json`. The original's costs (`0x80df8`) and execute (`0x83c00`) callees are still unmatched, and original linear call ordering differs around `memcmp`; this packet does not claim full original callee equivalence, identical linear call order, or recursive reference closure.

Both candidate builds use the same normal offline Cargo recipe and produce identical complete symbol and stripped images. Each includes one actual root compilation with unchanged inputs. Cached dependencies are reused, so these are not empty-cache builds. Executed command arrays, compiler/controller/source hashes and compressed build logs are retained. The unchanged controller's historical Pump673 scope label is preserved; the actual 66-input hash map binds the selected D037 creator-notice workspace.

The baseline is the same selected source used for the qualified V3 costs and key-copy packets, with parent map digest `ffec01de903f07b258b2f62263a0785ed3cd03bf329386d5a782ec0d58b9f8aa`. This candidate does **not** include the separate costs patch in #831/#896 or the accumulator copy patch in #904. The measurements describe this independent patch on the stated parent, not a combined build of those changes. The native Mac cohort's 188 raw matches and this Linux cohort's 183 are pre-existing different baselines.

The fresh focused runtime contains **28 original/parent/candidate triples and 84 signed transactions**. Eight buy cases exercise the affected fee values and event paths:

| Focused case | Original outcome | Observed protocol / creator fee | Events |
| --- | --- | --- | --- |
| SOL protocol + creator | Success | 26,564 / 8,389 | Trade |
| SOL creator zero | Success | 26,564 / 0 | Trade |
| SOL zero fee table | Success | 0 / 0 | Trade |
| SOL mayhem flag | Success | 26,564 / 8,389 | Trade |
| Token protocol + creator | Success | 26,564 / 8,389 | Trade |
| Token exact completion | Success | 1 / 1 | Trade, Complete |
| Token post-completion | Success | 1 / 1 | Trade, Complete, PostCompleteBuy |
| SOL zero max-cost | Error 6002 | No event | None |

The retained case label `sol_mayhem_exempt` is historical and too broad: it sets the mayhem flag but **does not exempt protocol/creator fees**. The actual payload values above are authoritative. No whitelist-exemption branch coverage is claimed. `analysis/focused-event-outcomes.json` decodes the original event payloads; all three images have identical complete payload bytes.

Twenty existing V3 controls add buyback and arithmetic error coverage. There are 20 successful original executions across the 28 triples. Errors, account states, CPI, events, return data and ordered logs agree across the three images; only complete compute-consumption log lines are excluded. The focused observer records exact pre/post state and actual loaded-image receipts. All24 focused raw metadata records are joined to their cryptographically verified signed transaction signature, complete logs, CPI/inner instructions, return data and derived event payloads; only compute-unit totals may differ across images. The twenty existing controls retain result accounts and loader records, without a passive full-before-state observation. Eight focused cases plus the twenty-case loader yield 85 Pump load records, including one fixture-initialization load. The execution receipt preserves all 25 input hashes and sizes and confirms they remained unchanged. Repeated signatures do not imply 84 distinct transaction wires.

These synthetic local executions establish bounded behavior for the retained cases. They do not establish whole-program equivalence, production behavior, execution attestation, native build identity or a new complete function. No live RPC, production transaction, compiler/IR/assembly patch, or dependency download was used.

From the repository root, check the retained evidence without compiling or running a VM:

```sh
python -B research/pump-v3-buy-fees-20261029/verify.py --repo-root .
python -B research/pump-v3-buy-fees-20261029/test_verify.py --repo-root .
python -B research/pump-v3-buy-fees-20261029/audit_refs.py --repo-root . --compare-retained
```

Python 3.12 and `solders==0.27.1` suffice. The verifier follows the finite provenance and fixture/wire binding approach accepted in #896 and qualified #904: independently pinned source parent, source/archive/build joins, exact executed controllers and fixture inputs, signed instruction/account layouts, expected synthetic pre-state, image allocation joins and recomputed outcomes. Eighteen resealed packet-mutation controls, separate fixture and output-receipt controls, and optimized-mode guards exercise those concrete checks. The verifier also pins the actual command arrays and v1.44 tool hashes, compares the retained fixture with the repository fixture bytes, and joins the exact runtime result/output membership and per-result stdout/stderr hashes. All four verification entrypoints reject Python `-O`, which would disable assertions.

For fresh builds, use the unchanged maintained recipe with `source-candidate.tar.gz`. `build/*/launch.json` retains actual arguments and tool hashes; the controller and physical source wrapper are under `controllers/`. The pinned image is `solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50`, platform-tools v1.44, offline locked dependencies and read-only source/SDK mounts. Map historical local paths to prepared equivalent locations. Candidate labels were `buy-fees-tuple` and `buy-fees-tuple-repeat`. `runtime/execution.json` retains actual replay commands and inputs; `runtime/inputs/focused_buy_fees.py` is the small observer/case adaptation, and `runtime/executed-scripts` contains the exact existing suite/fixture/loader implementations used.
