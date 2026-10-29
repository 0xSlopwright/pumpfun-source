# V3 costs: qualified Greedy allocation counterfactual

The source candidate in `../pump-v3-branch-layout-20261029` remains **2,136 bytes
and 23 aligned differing slots** against the original 2,120-byte function.
This companion packet explains most of that difference with a controlled
compiler experiment. It does **not** supply a new recovered Rust candidate.

For the unchanged extracted function, selecting one already evaluated register
split region produces 2,120 bytes with **two normalized slots / four bytes**
still differing. Both remaining slots are adjacent stack loads in reversed order:

| Offset | Original | Diagnostic |
| --- | --- | --- |
| 1,960 | `r2 = *(r10 - 368)` | `r1 = *(r10 - 376)` |
| 1,968 | `r1 = *(r10 - 376)` | `r2 = *(r10 - 368)` |

The derivative's default-off control reproduces the **entire stock extracted
object byte for byte**. With the opt-in flag, all 33 ordered relocation targets
(17 calls and 16 data references) remain bound, including complete referenced
constant objects and their recursive constant relocations. External function
names remain symbolic; this is not recursive function-body qualification.

## Observed allocation decision

The qualified passive trace shows the return pointer `%23` initially assigned
to r6, then evicted by `%3`. Its third allocation attempt evaluates ten global
split regions. The r9 region wins with printed cost `1.999998003`; the r3 region
has printed cost `1.999998271`. Their printed difference is `2.68E-7`. These are
formatted normalized block-frequency values, not the allocator's raw integer
costs or evidence of floating-point arithmetic.

The verifier reconstructs all 26 edge bundles from the 38-block machine CFG.
Block 27 has incoming bundle 19 and outgoing bundle 20. The r9 region includes
20 but not 19, causing a live-through `0 -> 1` transition and a reload on exit.
`SplitEditor::enterIntvAtEnd` inserts a copy at SlotIndex `4952B`, before the
branch. Spilling `%147`, the complement derived from `%23`, folds that copy
into a load of frame 19. The returned interval `%149` ultimately receives r6.
Selecting an r9 region therefore does not mean the resulting interval uses r9.

The retained pinned LLVM sources explain the strict `Cost < BestCost` selection
and the reload insertion path. Structural Before/After Greedy views match the
qualified root compiler capture (466 and 496 rows). This comparison explicitly
normalizes whitespace, IR block labels, frame debug names and first-seen constant
labels, and removes printed memory annotations. It preserves SlotIndexes,
registers, instructions, immediates, call names, CFG edges/probabilities and frame
sizes. It is **not literal stage-text equality**; emitted bytes are checked
independently. SlotIndex labels are not emitted byte addresses.

## Controlled intervention

An isolated copy of `RegAllocGreedy.cpp` adds a disabled-by-default
`-v3-diagnostic-force-r3` option. It applies only to the exact V3 costs symbol and
original virtual register 23, choosing the already evaluated r3 region (bundle
16) instead of the winning r9 region. One source translation unit, private
archive and private `llc` executable are rebuilt. The stock source/build
inventories remain unchanged. The complete patch, literal build commands,
response-file derivation and logs are retained; the local compiler executable's
SHA-256 is `383d7c4988afada09928ac6efc381aa31ddb01809b520c580cd3da842692aca7`.
The executable is not included in the public packet.

The default-off run equals the stock object exactly. The enabled run logs exactly
one intervention. It restores the original target length and these byte offsets:

| Observation | Original | Source candidate | Diagnostic |
| --- | ---: | ---: | ---: |
| `pre_fee_amount` call | 904 | 912 | 904 |
| Error branch | 928 | 936 | 928 |
| Error payload load | 1,008 | 1,992 | 1,008 |
| Shared store-tail entry | 1,712 | 1,728 | 1,712 |
| SP-400 loads | 1,712 r3; 1,984 r3 | 848 r6; 1,720 r6 | 1,712 r3; 1,984 r3 |

The result establishes that this split-region choice is sufficient to account
for the observed lifetime/tail differences in this extracted diagnostic. It
does not establish the original source spelling or compiler recipe. The next
source/provenance investigation should explain the region/frequency choice,
then the remaining load scheduling, without treating the forced allocator as
reconstruction progress.

## Exact cost model and stock-compiler profile control

A logging-only build now records every static and global block-frequency term
for all ten evaluated regions. On both inputs below, its complete object equals
the stock compiler's output. Removing only the added `COST_PROBE` log records
also reproduces the corresponding stock trace literally.

The original r3/r9 cost difference is **4,831,840,080 integer frequency units**,
against entry frequency 18,014,398,509,481,984. Summing the observed per-block
coefficients gives:

```text
cost(r3) - cost(r9)
 = F0 - F2 - F5 - F27 + F32 + F34 + F35 + F36
 = F3 - F31
 = 6,442,450,944 - 1,610,610,864
 = 4,831,840,080
```

Here `Fn` is machine block n's integer frequency. Block 3 is the first inlined
`protocol_fee_split` panic path; block 31 is the net-error formatter's panic
path. Both call `unwrap_failed`. The pinned BPI implementation assigns
nonreturning blocks weight 1 and default blocks weight `0xfffff`, giving the
first panic edge inferred probability 1/1,048,576. These are heuristic
frequencies, not measured user traffic or evidence of actual panic rates.

One synthetic profile annotation changes only that first panic branch to
weights **[1, 16,777,215]**, plus its metadata definition. An unedited textual-IR
baseline reproduces the complete stock object. The changed input goes through
the **unmodified stock compiler**, with no forced allocator option. It emits
the same complete object as the earlier r3 counterfactual: 2,120 bytes, two
normalized slots remaining.

Before Greedy, every instruction, register, SlotIndex and CFG edge remains
unchanged. Only that edge's two probability fields and three printed range
metadata IDs differ. The underlying range metadata in the input is unchanged;
the verifier permits only these exact text changes. The initial analysis assumed
the printed metadata IDs would remain fixed and failed. Its script, diff and
failure are retained; no compiler rerun was required to correct the analysis.

All ten region cost coefficients remain unchanged. The first panic frequency
falls to 402,653,184, while the net-error formatter panic frequency becomes
1,610,611,404. The full summed cost difference is **-1,207,958,222**, so r3 wins.
The simple panic-frequency subtraction is -1,207,958,220; the verifier retains
the **-2 integer-flow residual** instead of dropping it or presenting a rounded
identity. This confirms the predicted cost-order reversal through an independent
input intervention, without choosing a physical region in the allocator.

The profile annotation is synthetic. It does not establish that the original
program used profile data, that a particular Rust spelling emits this metadata,
or that a compiler release reproduces the original. A source/provenance candidate
still needs to explain these frequency inputs and the remaining load order.
The logging build, five additional `llc` invocations and three host build commands
are retained under `evidence/costs`; no additional root Rust build or target
execution occurred.

## Qualification and rejected approaches

1. A fresh root Rust invocation changes only `--emit=dep-info,link` to
   `--emit=dep-info,link,llvm-bc,obj`. The 66 source inputs, tools, dependencies
   and environment otherwise match the selected candidate. Whole ELF identity
   **fails**: `.symtab` and `.strtab` section contents change. All other section
   contents, including complete `.text` and `.rodata`, are identical. ELF/section
   headers are not claimed equal. The raw target bytes and actual operands are
   identical to the selected candidate. The initial failed assertion is retained.
2. `llvm-extract --keep-const-init` on the saved bitcode preserves all raw target
   bytes in its compiled object. Literal relocation-name equality **fails**:
   constants lose their `.L` prefix through linkage promotion. The verifier
   independently binds complete constant bytes and recursive constant relocations;
   it does not silently ignore names. The failed assertion is retained.
3. Adding passive Greedy debug/print flags preserves the entire extracted object.
   The trace and root capture's structural stages agree as described above.
4. Stopping before Greedy and restarting from **unedited** MIR fails its control:
   both commands exit zero, but 243 raw target bytes differ. No MIR modification
   is attempted; the input, output, receipts and failed assertion remain available.
   The cause of that restart difference has not been established.
5. The first derivative preparation assumes inline archive object arguments.
   Ninja uses a transient response file, so preparation fails before compiling.
   The retry reconstructs the exact explicit object list from the generated
   Ninja edge and writes a private response file. Both controllers and the failure
   are retained.

This increment uses one root `rustc`, six `llc`, two other LLVM tool invocations
(extract/disassemble), and three host compiler/archive/link commands. None
executes an SBF target. The earlier source packet retains its own build counts.

## Offline replay

From the repository root, with the companion source packet present:

```sh
python -I -B research/pump-v3-regalloc-20261029/verify.py --repo-root .
python -I -B research/pump-v3-regalloc-20261029/tests/test_verify.py
python -I -B research/pump-v3-regalloc-20261029/tests/test_costs.py
```

The verifier first replays the pinned source packet, then verifies saved
source/command/log/output bindings, raw controls, constants, allocator trace,
edge bundles, the two remaining slots and the failed MIR control. It reads only
repository files and temporary decompressed copies. Historical private paths in
receipts/controllers are provenance strings and are not reopened or executed.
Tests mutate actual reference rows, default-off bytes, trace decisions and
unmasked instructions to reject false positive conclusions beyond seal checks.
Fourteen original diagnostic tests and eight cost/profile controls pass, in
addition to the source packet's sixteen tests. The cost controls reject altered
integer totals/frequencies, extra semantic IR changes, different profile weights
and changed machine instructions. The main verifier includes the full cost replay.

`MANIFEST.json` seals all files; `EVIDENCE.json` additionally binds uncompressed
bytes. Receipts demonstrate stored evidence consistency, not cryptographic
attestation of compiler execution. All new binaries are raw compiler outputs
or relocatable objects; no allocation image or byte-patched artifact is used.
The diagnostic comparison masks only relocation operands. There is no linked
derivative ELF, original raw-byte identity, complete-window gain, canonical
selection, VM/transaction execution, behavioral or security claim.
