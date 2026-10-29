# Sweep Context and logical module control

This packet is a source-only control against frozen 651 candidate `97bd5553…`; it is not a compiled replacement.

Both original wrappers (`0xe9b90` and `0xe9fc0`, 1,072 bytes each) call the **same** 4,456-byte helper at `0x59408`, with selector values 0 and 1. The binary supports the shared runtime-selector path. Splitting that implementation into distinct handlers would not follow this evidence.

The original wrappers build the full 40-byte Anchor Context. The helper reads its accounts field at offset 8 and event-authority bump at offset 33. Current 984-byte wrappers call the shared 4,920-byte implementation using promoted fields instead. Two actual filename references inside the original helper identify `programs/pump-amm/src/instructions/sweep_fees.rs`.

The patch moves existing `sweep.rs` bytes unchanged into that logical module and adds a narrow public module alias. No account constraint, argument, event, or handler statement changes. There are no new representation or inlining attributes and no fabricated source coordinates. It is intended to preserve the full external handler Context boundary, as in the independently demonstrated V2 case.

The attribute-free object control uses the actual Anchor Context type with two bump bytes and a real nonzero-recipient guard. The public variant retains a 40-byte Context plus a bool argument; the private variant inlines. Tiny arithmetic-only variants emit no useful standalone helper and are retained as negative controls. The earlier copied explicit-inline-guard variants are historical diagnostic controls, not the selected proof and not proposed source attributes. This calibration does not prove that the full source patch compiles or matches the wrappers; the combined build must establish that.

`verify.py --root REPOSITORY` verifies the baseline identities and all 52 local workspace inputs, exact source-only patch, unchanged parser/exit callees, original selector values and Context reads, filename evidence, and selected object signatures. It does not rebuild dependencies or execute transactions. Baseline dependency authenticity remains in the separately sealed 651 checkpoint.

The existing focused runtime producer is `scripts/pump_amm_sweep_differential.py` in the frozen runtime input root. Run it through the retained `owner6048-v144/runtime/observe_suite.py` with `--candidate` and `--output`; it is not rerun here because this source has not been compiled.
