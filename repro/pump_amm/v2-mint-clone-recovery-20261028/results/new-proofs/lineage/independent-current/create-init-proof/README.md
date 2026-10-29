# Final canonical-only CreatePool field/store review

Candidate4fb73d3c0303e1f065e6356d32e86ba7341f75b27b861571cd8b8c586e46af98 is checked against original field/init semantics. This extends immutable7fpacket6159dcc8 and does not relabel its observations. Current order60/create246receipts and current source/artifacts are independently bound.

The canonical-only branch now encloses coin_creator,creator_fee_bps andcan_edit_creator_fee. Raw candidate branch0x48cc8 skips those stores for noncanonical pools and joins at0x48d50 before holder/minimum. Original canonical-success0x2cb18->0x2d858 writes them; valid noncanonical0fee/falseedit0x2cb48->0x2d8e0 skips them. The original guards and current source are consistent; complete handler/CFG equality remains unproved.

Omitted fields are read by Borsh from freshly allocated zero bytes, not supplied by a Rust Default implementation. Pool is Anchorinit with287bytes, and the279-byte unchecked body decoder is accounted for. Eight complete normalized init/parser bodies and relocation patterns match original. Current signed order60matches original:12preexisting controls have10rejections and2prefundedSystemzero-length fresh allocations. It is false that all preexisting accounts reject. Ordinary67original/current create successes expose the omitted values as zero.

No build or VM runs in this verifier. This is a narrow field/default/guard proof; it does not replace the full current acceptance/dependency packet or claim historical source identity, full transitive callees/data or whole ELF equality.
