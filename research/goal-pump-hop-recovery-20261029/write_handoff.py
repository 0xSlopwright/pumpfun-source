#!/usr/bin/env python3
from pathlib import Path
import collections,gzip,hashlib,json
R=Path(__file__).resolve().parent
ordered=['matched-arithmetic','matched-post-payment','matched-business-inline-events','matched-business-snapshots','matched-business-direct-events','matched-business-seed-gates','matched-business-closed-arms','matched-business-completion-order','matched-business-late-completion','matched-business-late-mutable','matched-business-output-record','matched-business-nested-post-gate','matched-business-native-payment-arm','matched-business-branch-capped-output','matched-business-native-payout-guard','matched-business-post-value','matched-business-none-first-fill']
table=['| Source control | Bytes | Machine blocks | Direct calls | Native normalized/raw |','|---|---:|---:|---:|---|','| Original |18584|263|107|reference|','| Canonical e38 / earlier BEST root |18536|322|98|1019/188|']
for name in ordered:
 v=json.loads((R/'probes'/name/'RESULT.json').read_text());label=name.replace('matched-business-','').replace('matched-','')
 table.append(f'|{label}|'+(f"{v['target_bytes']}|{v['machine_blocks'][1]}|{v['callee_calls'][1]}|{v['normalized']}/{v['raw']}|"if v['ok']else'compile E0502|—|—|no image|'))
reference={}
for name in ['matched-business-branch-capped-output','matched-business-none-first-fill','matched-business-post-value']:
 d=R/'probes'/name;v=json.loads((d/'RESULT.json').read_text());manifest=json.loads((d/'SOURCE-MANIFEST.json').read_text());g=json.loads(gzip.decompress((d/'call-gate-projection.json.gz').read_bytes()));counts={side:dict(collections.Counter(str((n['term'].get('opcode'),n['term'].get('immediate')))for n in g[side]['nodes']if n['term']['kind']=='conditional'))for side in ['original','candidate']}
 reference[name]={'unstripped_sha256':v['unstripped_sha256'],'stripped_sha256':v['candidate_sha256'],'source_files':manifest['files'],'bytes':v['target_bytes'],'machine_blocks':v['machine_blocks'],'direct_calls':v['callee_calls'],'diagnostic_call_gate_nodes':{s:len(g[s]['nodes'])for s in ['original','candidate']},'conditional_histograms':counts,'strict_window_match':False,'new_windows':0}
(R/'REFERENCE-PARTIALS.json').write_text(json.dumps({'status':'unqualified_source_research_only','canonical_changed':False,'scope':'Exact callee/predicate counts are diagnostics only. No complete rooted instruction/argument/branch bijection and no whole body/ELF identity.','cases':reference},indent=2)+'\n')
text='''# Pump swap_hop source recovery, 2026-10-29

Status: **incomplete; zero new windows**. Pump remains1019/1035 normalized and188 raw in the identity native lane. Original `multi_hop::swap_hop` at0x5b3b0 remains unmatched. No maintained source changed, no binary/IR/object edits, and no runtime execution occurred.

## Inputs and reproduction

`INPUTS.json` pins original SHA7a19affa…, canonical unstripped0f50faa8… / stripped d0377d7c…, the earlier BEST proposal, and unchanged build/scorer/graph tools. `src/` is the exact67-file immutable e38a8b97a Pump source inventory. The latest sparse worktree `work/goal-final-windows-current` is the independent source check; dirty `work/latest-main` is used only for pinned passive graph tools. Own source and `build/ws` are restored after every trial.

The identity recipe uses v1.44 rustc with pinned Linux SBPF target libraries. `native-baseline/` independently reproduces the canonical complete ELF. The earlier BEST packet changes two V3-related files, but its root swap_hop body,98callees and322machine blocks are unchanged from canonical. It has no recovery for this window.

`verify_saved.py` recounts all1035 windows for every image, replays every complete graph and the caller's32 actual precall slots, checks all source rows/hashes, matches each original callee to existing canonical code, verifies passive snapshots and confirms restored source/stage. It also checks both prior frozen handoff manifest hashes. `runtime_valid` in build records denotes absence of stack-overflow warnings; it is not runtime validation.

## Actual business and helper evidence

All107 original defined direct callees already have exact depth2 bindings in the canonical ELF (`canonical/all-callee-bindings.json`). The difference is orchestration and record/control boundaries. Original caller0x567d8 has a matched complete body; its call at0xc60 targets the correct private root with32 identical setup slots in every trial.

The source partials recover actual helper boundaries: `buy_fee_market_cap`, `constant_product::tokens_for_quote`, existing `trade::sub3`, native quote payout, and the full Copy `PostComplete` plus its existing post-event factory. Original quote-zero failure belongs inside the matched tokens_for_quote helper; canonical's additional root Overflow gate is absent from the original error-discriminant census. The original has one fee-config data_len read and one Clock fetch, each before its downstream uses.

Event emission follows the resolved Anchor0.31.2 event-attribute expansion: separately scoped log serialization, then tagged iterator collection, Instruction::new_with_bytes and invoke_signed. Its source bytes equal the initially read0.31.1 attribute source; `EMITTER-BASIS.json` records both pins. This recovers all three original inline event call groups rather than outlining a generic Result-returning emitter.

Validation passes the borrowed actual recipient, false native argument and quote-program key. The original early seed Clone is the base-mint AccountInfo used to build bonding-curve signer seeds; the next Clone owns the fee-config temporary for data_len. Equal Clone counts alone had hidden these different roles.

The main buy/sell arms contain their actual input transfer, state application and output helper. Matched helpers own zero-output guards; redundant outer zero guards are absent. The original late complete store occurs only after the ordinary trade CPI, checks reserves alone, and encloses both completion emission and optional post-completion emission. `original/NESTED-POST-GATE-PROVENANCE.json` proves the complete-store node dominates the post-option gate and post factory in the preserved syntactic graph.

Correction: an earlier call-only traversal mismatch at output Clone0x4150 did not establish that output construction preceded the post-event on the same path. That Clone was reached on the no-completion route. The output-record probe is retained and rejected; the later nested event gate resolves the actual business divergence.

Removing pre-branch `base.min(reserves)` uses the reserves directly in the already established exceed arm and removes one extra comparison. A None-first match on the actual complete-fill Option restores the original tag0/1 predicate histogram. These are source recoveries, but none has qualified the complete window.

## Source controls

Every successful control preserves the exact1019 normalized memberships. All preserve188 raw memberships except the outlined-inline-event control, which loses raw0xd240 and has187. There are no normalized or raw gains. All source line counts and existing error Source rows are preserved.

'''+ '\n'.join(table)+'''

## Remaining concrete mechanism

`matched-business-branch-capped-output` has263 machine blocks and107 exact unordered depth2 callees, with237 diagnostic call/gate nodes versus original237. `matched-business-none-first-fill` has261machine blocks and also107callees/237projected nodes; its complete conditional opcode/immediate histogram is identical to original. Both still fail the strict body test and full data/register/branch graph. `REFERENCE-PARTIALS.json` pins these alternatives and the by-value post-record control; none is a proposal for promotion.

The diagnostic call/gate projection discards **all data operations and branch registers**. It is a separate analysis file, not a changed matcher or acceptance metric. Its first179 mapped nodes end at a shared Clock predecessor because native/direction predicates are ordered differently: original native→direction→last, current direction→native→last. It does not prove semantics or support237/237 acceptance.

Passive pre-CodeGenPrepare and pre/post machine-block-placement snapshots reproduce the N image exactly (36027e21…). IR already forms `and native,last`, negates it, then ORs buy; this lowers to the observed direction-first chain before placement. Explicitly nesting only the native payout guard produces the **entire identical ELF**. Grouping the entire native buyback+payout arm changes the graph but does not reproduce original flag-first sharing. Thus another layout-only probe is not justified by this evidence.

The original complete-fill success scalar-spills post fields and reconstructs its8-field record before the final factory. Reading the actual Copy post Option by value changes that materialization and preserves all calls, but gives259machine blocks and no match. Original Result tag2/error then tag0/None versus current tag2/error then tag1/Some motivated the bounded None-first match; its predicate census now agrees, without resolving the ordered native gate or full body.

A possible next source mechanism to reason about is the original flag-first native payment hierarchy: flag-off native check and native-buyback success join the same direction/last payout guard. Current IR fuses a native/last expression shared with the flag-off path. Establish the exact IR formation/guard-sharing rule before more controls; broad boolean spelling or compiler-flag sweeps are not supported.

## Prior sealed lanes

Swap's sole0x4c750 and Pump migration token helper0x4c158 remain open. Their frozen handoffs are unchanged: `goal-swap-recovery-20261028/phase6` manifest025f454b… and `goal-pump-migrate-token-recovery-20261029` manifest72b7320e…. No proof from those lanes is weakened or promoted by these diagnostics.
'''
(R/'README.md').write_text(text)
