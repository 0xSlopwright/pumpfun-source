# MultiHop logical module and initializer candidate

The included Rust candidate moves MultiHop into the original descriptor's
`instructions/swap/multi_hop_swap.rs` module. Existing program, per-hop account
and fee types are grouped coherently. Each existing AmmHop has_one constraint is
written separately. The main Accounts derive consequently lands at line 68.
No dummy declarations, blank padding, coordinate directives or binary patching
are used. This is a candidate source organization, not historical source text.

All 16 function bodies are preserved. The 639/785 normalized-window result adds
only original initializer 0xb5a90/8128 over frozen e97 (638 windows), retaining
all 128 raw matches. The earlier coherent derive-63 control is preserved under
control/: it retained 638/128 and differed from the original initializer only
in its validated Source line field. Full ELF identity remains unachieved.

The standard 735-case MultiHop suite and 328-case route boundary suite are
verified on the base and candidate. Route probes include genuine signed raised
compute budgets, two/three-hop paths and destination aliases. The saved verifier
redecodes signatures and checks same-message pairing, dependencies, observations,
source composition, all windows and typed source-origin comparisons. Run:

`PYTHONDONTWRITEBYTECODE=1 python3 -B verify_packet.py`

This performs no build or VM execution. The source-origin audit distinguishes
matching filenames from remaining line/column and data-record inventory gaps.
The 63-line control moved 23 static filename records to the correct module path;
the original has 12 such records, so full data identity is not claimed.

Apply independent MultiHop behavior changes first, then run relocate.py on that
source tree. The recipe checks its import contract and preserves function bodies;
ordering-check.json records composition with the generated-return branch patch.
Other swap module declarations and validators are retained. A combined candidate
must receive its own build and replay evidence.
