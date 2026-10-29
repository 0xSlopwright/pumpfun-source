# Independent OptionalU64 reader review

The reviewed patch bce4ec35 is supported for the observed entrypoint reader, `&[u8]`. The original CreatePool wrapper at0xe31a0 initializes fee0, compares remaining length before reading eight bytes, and jumps over cursor updates when fewer than eight remain. The following two calls use the exact344-byte OptionBool decoder. Thus short bytes are still available to those booleans; only a complete u64 advances by eight.

The pinned v1.44 SDK `std::io::Read for &[u8]` checks buffer length first and returns UnexpectedEof before copying or updating the slice. Borsh0.10.4 has the std feature active and reexports std::io. Its deserialize(&mut &[u8]) dispatch reaches that reader. Therefore read_exact with a zero fallback on UnexpectedEof reproduces the captured slice behavior. The proposed code also propagates non-EOF errors.

Generic Read is different: its default read_exact loops over read(), retries Interrupted, and can consume partial bytes before reaching EOF. Historical behavior of arbitrary custom readers is not established by this SBF artifact. The source patch must not be described as a proof for every Read implementation.

The independent parser model predicts every saved outcome in the264-case corpus, including all123 original/baseline discrepancies. A full-field/log recount finds the same123 differences and no hidden log-only ones;528 signatures and paired pre-state/messages are independently checked. The original full negative packet remains authoritative for all fixture/build inputs; this small packet retains its manifest/hash, full reports/receipts, producer, reader sources and relevant original code bytes.

Suggested small supplement: repeat short-u64 patterns with cashback=1 and invalid bool bytes, to confirm deserialization rejection still precedes handler mode/canonical guards. This is a coverage improvement, not a blocker: the existing matrix already spans all short lengths, first byte0/1/2/255, valid/invalid following bools, full-u64 boundaries and trailing bytes.

Run `python -B verify.py` to verify the saved review. No compiler or VM is executed. SDK/Borsh source hashes, pinned compiler/archive provenance, exact original reader-region instructions and the matching OptionBool body are preserved; full external ELF/tool caches are intentionally not copied.
