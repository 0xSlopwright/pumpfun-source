# Retained ELF identity admission

The archived layout reader checks ELF64 class and endianness but does not check
the machine, object type, identification/header versions or ELF-header size.
Copied Pump payloads with a foreign machine or internally inconsistent identity
still pass the saved-capture gate after their copied hashes are updated.

This successor checks the retained Solana ELF profile (ET_DYN; legacy BPF machine
247 or SBPF machine 263; current identification/header versions; 64-byte header),
then uses the accepted optimization-safe layout/hash verifier from #961.
Both machine IDs are present in the unchanged nine-capture corpus. This is not a
general ELF-format validator, a complete loader verifier or runtime execution.

```
python research/capture-elf-identity/test_verify.py
python research/capture-elf-identity/verify.py
```

Tests prove old-gate acceptance and new-gate rejection of five independently
mutated header fields using a detached private copy. All nine real captures pass
in normal, `-O`, and `-OO` modes. Root helpers, original bytes and prior packets
remain unchanged. Other capture-domain gates retain their separate scope; no
consensus, source-equivalence or security-clearance claim is added.
