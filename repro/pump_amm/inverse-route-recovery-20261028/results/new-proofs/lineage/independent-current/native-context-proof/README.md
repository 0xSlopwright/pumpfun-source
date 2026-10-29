# Independent native inverse contextual check

Candidate `98ed250d3999e79b55683daa574b984fb7f650dc9eef0e3256671d0612b49fc3` contains the original complete native inverse-fee method: 776 bytes, with matching direct-call positions and raw-identical `__multi3` / `__udivti3` callees. Its existing 368-byte native fee method also remains exact under call-address normalization.

The 688-byte `amount_before_fee` caller now copies the full native 24-byte value and reaches the native inverse method at offset +120. All five actual direct callees have equal complete normalized bodies and relocation patterns. Only one caller instruction differs: the typed `Source` line-number store at +584 contains 34 instead of original 67. Both source descriptors identify `programs/pump-amm/src/utils/transfer_fee.rs` with length 43. No source padding was introduced to close that remaining coordinate.

`review.json` binds the observed functions and their actual callees; `source-fields.json` records the typed descriptor decoding. `verify.py` recomputes both and verifies the copied source inputs against the successful build record. The full candidate's runtime, strict-repeat, all-window counts and selection are separate worker/parent gates. No compiler or VM runs in this packet, and no historical crate identity or whole-binary equality is claimed.
