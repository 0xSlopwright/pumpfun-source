# Main Pump contract reconstruction

The maintained source now uses the [qualified canonical frontier](../../repro/pump/canonical-frontier-20261028/README.md). It composes the recovered account/decoder paths, trade and cashback ordering, whitelist and crossing behavior, admin holder checks, and original overflow/panic diagnostics into one ordinary source tree.

The strict inventory is **1,019 / 1,035 normalized windows and 188 raw matches**, covering **1,611,088 / 1,792,208 original text bytes**. The same 16 function windows remain unmatched. Whole meaningful-ELF and full-file identity remain unfinished.

Two fresh local-crate builds and a separate empty-target build reproduce both complete ELF hashes. The portable build authenticates the pinned SDK/library profile, 254 locked registry archives and 4,176 actual registry source files. The [source/build mapping](../../repro/pump/canonical-frontier-20261028/CHECKPOINT.json) binds all 65 canonical inputs and 66 staged inputs; inherited synthetic Source layout remains disclosed.

The exact image passes the captured-loader **44-suite / 10,468-case** corpus and **65 focused cases** with no compared differences. Broad diagnostics cover 10,464 paired logs and exclude Source coordinates; focused checks separately preserve the newer Source and panic priorities. Rejected create quote mints now include the original compared-key payloads; their reconstructed Source70 versus original220 remains disclosed. These finite synthetic/captured-dependency corpora do not establish all-state equivalence or deployment acceptance.

Verify the current source, artifacts and saved signatures:

```sh
python3 -B repro/pump/canonical-frontier-20261028/verify.py --signatures
```

The packet documents the explicit portable build and fresh runtime replay commands. Earlier source and evidence remain in the immutable [Round9 checkpoint](../../repro/pump/main-contract-round9-20261027/README.md) and subsequent research packets.
