# Independent event ownership and quote ABI review

Candidate `4e6a5617a7a8c3474ed7662f0188df4b1824c08253ebfb08212351ca5249da12` is independently compared with frozen 651 candidate `97bd5553c199cd24fb2d07034c365527bee5b138bf5dd7a0aa3099186aad2643` and the original captured PumpSwap program.

The recount is **653/785 normalized windows, 148 raw windows and 818,944 matched text bytes**. Both gains are the 1,072-byte sweep instruction wrappers, with no normalized or raw losses. All 38 public IDL instruction wrappers match complete normalized bodies and relocation patterns. The intermediate 653 source-boundary trial is historical context; the comparison baseline bundled here is the published 651 candidate.

Eight event sites now pass the same known stack address to both exact Event::data callees: CreatePool, InitBoost, AdminCtoPool, ExtendAccount, legacy Sell, both Boost emissions and Sweep. The original also reuses the same event at each site. A conservative whole-function CFG analysis propagates stack-address registers, invalidates unknown writes and caller-saved registers, and intersects facts at joins. It does not infer pointer values from stack loads. The result proves the removed duplicate event objects; it does not prove complete handler identity. The seven business handlers containing these eight sites retain other instruction differences.

The borrowed-quote selector is 1,632 bytes and equals the calibrated direct object in every normalized byte. Its 13 actual direct calls and three full quote-mint public keys are checked. The original selector is 1,656 bytes, so complete selector identity remains open. The original key order is preserved; there is no owned 32-byte quote key copy.

The source gate binds **51 canonical inputs → 52 workspace inputs + 175 archived registry inputs = 227 compiled inputs**. The workspace recipe only relocates Cargo profile/lock configuration and never rewrites Rust. The dependency gate authenticates all nine crate archives, 166 archived files, nine Cargo metadata files, lock selection, builder/SDK metadata and 762 unchanged dependency artifacts. It checks the physical-target/logical-CARGO_TARGET_DIR mount against the recorded strip command. Seven source/external negative controls and two target-mapping negative controls are retained.

The call/data audit retains its previous bounded scope: recognized descriptors, direct target relationships and known alias alternatives. It does not establish general indirect-call closure, every allocation extent, all source origins, dependency provenance beyond the authenticated nine-root package, or whole-ELF equality. Runtime and strict-repeat qualification are performed separately by the producing workers and parent.

All candidate, baseline, symbol, source, registry and tool inputs used by this verifier are bundled. The only external program read is `root/evidence/original/pump_amm/deployed.so`, checked by exact hash. Historical build records retain their original absolute paths, but no private path is opened by the active gates.

```sh
python3 -B /absolute/packet/verify.py --root /absolute/repository
```

Python API: `verify(root)`. `test_portable.py` runs a temporary copy outside the repository. No build, runtime transaction, source edit or network action is performed by verification.
