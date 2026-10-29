# Independent V2 and sweep boundary review

Frozen candidate: `3f6190cae0e52a583dacddef9f55bc8f1b512489744242e05e0ea3ed8b5d26e4`. Baseline: `97bd5553c199cd24fb2d07034c365527bee5b138bf5dd7a0aa3099186aad2643`.

The independent recount is **653/785 normalized windows, 148 raw windows, 818,944 matched text bytes**. The two gains are the original 1,072-byte sweep wrappers at `0xe9b90` and `0xe9fc0`; there are no normalized or raw losses. All 38 public instructions in the captured IDL now have matching complete wrapper bodies and relocation patterns. This is not whole-program equality.

Both wrappers retain the original shared handler call at byte 440 and pass selectors 0 and 1 in r3. Their actual parser (7,104 bytes), memcpy (32 bytes), and exit (560 bytes) targets match complete normalized bodies and relocation patterns. The shared sweep handler remains unequal: original 4,456 bytes, candidate 4,968 bytes. It reads Context fields 8 and 33, and both source filename references now resolve to the original `programs/pump-amm/src/instructions/sweep_fees.rs` path.

The shared handler has 31 direct calls to 26 distinct targets in each artifact. The report records actual offsets and target mappings. Twenty-two target bodies match; four remain unequal: pool preparation, protocol recipient validation, available quote reserves and accrued-fee withdrawal. This mapping does not assert matching call order or behavior of the unequal bodies.

The original uses the same event address (stack offset -536) for both Event::data calls. The candidate uses offsets -456 and -640. The current `emit!(event.clone())` therefore has a concrete, source-backed no-clone follow-up; no such change is part of this packet. Two exact 616-byte Event::data target bodies are checked. The original/candidate instruction and operand evidence is retained in `audit.json` and recomputed by `audit.py`.

The packet contains both full ELFs/symbol sets, both 52-file local source trees, exact V2 and sweep patches, and build records. The verifier checks every local source input and confirms that only the recorded source transformations occur. It does **not** reauthenticate external dependency files or claim a new compile, strict repeat, runtime result, or complete transitive data closure. Those are separately owned qualification gates. Existing input records with private path names are historical metadata; the active verifier never opens those paths.

Run from any directory:

```sh
python3 -B /absolute/packet/verify.py --root /absolute/repository
```

Python API: `verify(root)`. The only external artifact it reads is the exact original ELF at `root/evidence/original/pump_amm/deployed.so`; candidate, baseline, symbols, source and tools are local to the packet. Manifest authentication, four wrapper-census negative controls, wrong-selector, shifted-filename and event-pointer-alias checks are included. No binary is modified.
