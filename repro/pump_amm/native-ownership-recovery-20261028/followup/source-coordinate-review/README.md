# Fee-coordinate and value-copy PR read-only review

PR409 at5645ada9beb7151649a1a3e7bec51057f584cc25 changes only whitespace in curve/fees.rs. The token stream is byte-identical after whitespace removal to selectedea14 source. It splits the fee signature and multiplication across lines and expands chained calls to place errors at19,21and32. This is coordinate fitting; it supplies no new ownership, type, control-flow or independently recovered file-organization evidence. Do not integrate its wholesale formatting patch.

The useful retained facts were independently checked against original andea14 binaries: ceil_div0x12b08 is1,672bytes with11directcalls; fee0x13190 is712bytes with6calls. All17calloffsets agree;16complete normalized callees agree, with the remaining actual edge fromfee+0x70 toceil_div. The only normalized body differences are the original/candidate Source-line stores19/18,21/19and32/25. They remain unresolved source-fidelity facts, not new matched windows. The PR's claimed alternate-host artifacts are named only byhash initsresult and omitted; this review does not certify those builds or their claimed gains.

PR408 ata48351294a2f6d578a7d2c6e5148d25ae399583e is a merge of upstreammain into629d266847a972a54634ec6e6fbb8b0fd3592e77. The source.patch, error_path_check.py, READMEandverify.py files are byte-identical tothatfirstparent. The merge adds no fee-recovery code or proof delta; it primarily incorporatesupstreamH12publication. Its already-qualified match *data change is present inea14. No additional source component is recommended from this head update.

This review performed API reads, source hashing and local ELF comparisons only. No canonical files, published checkpoints, builds, VM executions, PR state or comments were modified.
