# Independent event/rent/decoder candidate review

Frozen joint artifact: `0881a95dafe465623c7220fb3da84b3f9c7d9b0094d572f62487f05cbd80a07c`. Symbols: `16ddd88d35140ffce422dac700a1bc2eb5b505b7c0eccef3d363b8d306a520e3`.

The independent all-window recount finds **647/785 normalized, 148 raw**, compared with sixth `be10ca1a…` at 643/148. There are four normalized gains and no normalized or raw losses. The exact sixth baseline candidate and symbols are included under `baseline/`; no unpublished baseline path is needed.

New matches are the 1,784-byte sell-event builder at original `0x52c58`, 344-byte boolean decoder at `0x6f4b0`, and the two 1,856-byte legacy buy/exact-quote wrappers at `0xe7648` and `0xe7d88`. The actual immediate targets of the event builder and decoder all match. Across all four gains, 19 immediate target bodies match, while the two legacy business handlers called at wrapper offset 600 remain unequal: 9,936 versus 10,088 bytes and 12,936 versus 13,152 bytes. Thus the two wrapper gains are not recursive handler recovery.

The data check preserves the exact 16/28-byte instruction log strings, five full string descriptors and three actual 40-byte formatter code pointers. It rejects shifted pointers and changed terminal bytes. Full recomputation of the retained call/descriptor relation gives 587 bounded static-closed windows. That relation remains limited to its recognized descriptor and vtable schemas; it is not whole-data or whole-ELF identity.

The build binding uses the actual `a5565b…` logical-target adapter and the same nine authenticated crate archives. It verifies all 227 recorded inputs: 51 canonical standalone inputs become 52 real workspace inputs without changing Rust, plus 175 archived registry files. The dependency gate verifies 166 archived files, nine generated metadata files, all nine package versions/checksums, compiler/SDK/tool provenance, the physical/logical target mount and 762 unchanged dependency artifacts. The metadata copied here is from this exact joint build, not the sixth build.

Seven source/mapping and two target-mount negative cases are retained. The packet includes source, canonical source, candidate/symbols, baseline, dependency archives, the recorded builder and all required verifier code. Recorded historical path strings are provenance only; the active gates map external names to the included archive bytes. `provenance/recorded-build-static-check.py` is the original worker script retained as build history, not the portable entrypoint.

Run:

```sh
PYTHONDONTWRITEBYTECODE=1 python -B verify.py --root /absolute/path/to/pumpfun-source
```

Python API: `verify(root)`. The repository supplies only the preserved original ELF and public reader hash. `test_portable.py --root REPOSITORY` repeats this verification from a temporary directory outside the repository. No new compiler or VM execution occurs; strict-repeat and behavioral acceptance are separately owned by the root checkpoint.
