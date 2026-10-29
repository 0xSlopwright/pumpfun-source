# Pump exact-SOL queue-order observation

The initial export choice in the four-byte `buy_exact_sol_in` residual is now
observed: the scheduler compares `NodeQueueId` values 3 and 4, keeps the first
export, then prefers its load because of register pressure. The scheduler emits
the bottom-up sequence in reverse. This closes the unobserved initial-choice
boundary documented in the reviewed PR #848 / #872 packet.

An isolated derivative of SDK-pinned LLVM revision
`08aedd64bf3abe4f163407b7bcf680403b84b32d` adds logging around actual queue pops
and the existing comparison returns. Debug queue-display simulations are
excluded. The verifier reverses the logging additions and requires exact
equality with the pinned compiler source; all 20 original return expressions
remain intact. No compiler decision is overridden.

| Observation in `bb.53` / `bb63.i`, Source 133 | Baseline | Two-extract IR counterfactual |
| --- | --- | --- |
| First ready export | SU34, queue ID 3, tag | SU34, queue ID 3, payload |
| Second ready export | SU33, queue ID 4, payload | SU33, queue ID 4, tag |
| Decisive comparison | `3 > 4` is false; keep SU34 | Same |
| Next selection | Tag load SU32: pressure -1, remaining export +1 | Payload load SU2: pressure -1, remaining export +1 |
| Bottom-up load offsets in stack slot 107 | 0, then 8 | 8, then 0 |
| Emitted load offsets | 8, then 0 | 0, then 8 |

Both runs reproduce the respective **complete object bytes** from the unmodified
compiler. The 13,224-byte target and all 144 relocation records are independently
rechecked. Across the two inputs, exactly four instruction bytes at slots
1003/1004 differ, as in the parent packet. The verifier replays all 35 actual
queue pops in the selected block, checks the export-to-load wiring, and replays
the parent packet's source, stock compiler, object and IR-counterfactual bindings.

This is a compiler diagnostic. The counterfactual is edited LLVM IR; it is not
recovered Rust, a production build, or a raw match of the deployed whole ELF.
Maintained source, canonical images and reconstruction counts remain unchanged.
The deployed source and compiler remain unknown. No target program or VM was
executed, and no behavior or security conclusion follows from these observations.

## Reproduce the saved checks

From the repository root, using Python 3.11 or later:

```sh
python -I -B research/pump-exact-sol-queue-origin-20261029/verify.py --repo-root .
python -I -B -m unittest discover -s research/pump-exact-sol-queue-origin-20261029/tests
```

These commands use only local saved evidence. They require the reviewed parent
`research/pump-exact-sol-scheduler-20261029`, its source parent
`research/pump-exact-sol-guard-20261029`, and `evidence/original/pump/deployed.so`.
They work after copying that dependency set into a different directory.
Both entrypoints reject optimized Python (`-O`), preserving assertions in the
inherited ELF readers before those readers are imported.

The native build used existing qualified objects and libraries, recompiling
only `ScheduleDAGRRList.cpp`, rebuilding its library, and linking a separate
`llc.exe`. The full stock build inventory and stock source inventory were checked
unchanged afterward. Compiler executable bytes are identified by SHA-256 but
are not duplicated here. Build controllers retain the original Windows paths;
they document the actual incremental build, rather than a portable fresh-build
recipe. Saved receipts establish consistency, not cryptographic execution
attestation or exhaustive host-toolchain provenance.

The failed preparation check is retained: it expected 22 comparison returns;
the pinned functions actually contain 20. It stopped before compiler execution.
Further source work must reproduce the required export order while preserving
the rest of the function and its referents. Changing scheduler policy globally
or treating the IR counterfactual as recovered source is not justified by this
packet.
