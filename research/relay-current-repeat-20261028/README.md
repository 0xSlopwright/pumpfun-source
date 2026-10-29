# Current Relay repeat and exact loader qualification

The unchanged maintained 60-input Relay source has now reproduced both complete
ELFs in a second independent build from an empty target. The new offline Linux
build recompiles all dependencies, checks all 253 registry archives and 7,968
archive files before and after, and records unchanged source, SDK and linker
inputs. All 2,873 SDK files match the pre-existing pinned inventory.

The ordinary stripped output is exactly the original 818,280-byte meaningful
ELF (SHA-256 `56d81ec64a0ba070d3d23f3c1547b31d659e85716dfa2198ec4b0ce6cd355333`).
The symbol-bearing output also equals the first maintained build literally.
The explicit target-derived linker ordering is unchanged. This is reconstructed
source and a reproducible recipe; historical source spelling remains unproved.

The unchanged real upgradeable-loader controller deployed this fresh compiler
output through 912 normally signed offline transactions. An observer verified
914 signature fields and retained the actual ProgramData payload returned by the
VM. The loader produces all 830,448 captured payload bytes, including the separate
12,168-byte zero allocation suffix. The compiler output is never patched or padded.
The loader transaction metadata and history are fresh local observations.

The loader-produced payload then ran through all 536 retained records (534
unique fixtures) in the unchanged replay harness. Every observation field and
ordered log matches, excluding only compute consumption lines; 2,092 replay
signature fields verify independently. Direct ELF replay is also retained: its
user observations pass, but its own program account has a shorter allocation and
different rent balance. The equal-allocation run resolves that fixture difference
through genuine loader output, with no account-state comparison mask.

`verify.py` authenticates the two source maps, complete ELF and loader payload,
compiler receipts, all SDK pins, fresh loader transactions and equal-allocation
replay. It performs no compiler or target execution itself. Five controls reject
resealed false fresh-build claims, changed SDK/executable bytes, changed runtime
logs and extra maintained Rust input. The older sealed Relay selection and its
scanner bridge remain intact.

```sh
python3 -O -B research/relay-current-repeat-20261028/verify.py --repo .
python3 -O -B research/relay-current-repeat-20261028/test_verify.py
```

For a new build, supply the authenticated Linux v1.48 SDK and checksum-verified
registry, then a fresh output directory:

```sh
python3 -B research/relay-current-repeat-20261028/build.py \
  --sdk /absolute/pinned-v148-sdk --registry /absolute/offline-registry \
  --output /absolute/new-output
```

No RPC or live transaction is used. Finite runtime fixtures retain their coverage
limits; exact full meaningful ELF identity is the primary reconstruction proof.
