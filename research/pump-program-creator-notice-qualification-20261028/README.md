# Qualified current-C0 program-creator notice correction

The sole source delta from the selected C0/d5 checkpoint restores the original
`Creator is a program; fees left in the vaults` notice when the existing creator
is executable. The current C0 image omits that line. The bounded witness selects
the already loaded, authentic Fees executable as creator and uses the ordinary
AdminCto transaction, signer/PDA checks and unchanged synthetic fixture values.
Original and corrected image agree in all state, errors, events, CPI and return
fields and in the complete ordered logs. Current C0 differs by exactly this one
notice before AdminCtoPool. Only complete compute-meter lines are excluded.

The source change is `src/creator/admin_cto.rs`, SHA
`3545aa72915c541810c3ea9219237f4d1791c7f40b0056b81e8a493e2cefcdb7`.
All other64 standalone inputs remain exact C0, including734 multi-hop accrual.
The17 explicit error/require/panic tokens retain their line and column positions.
The actual standalone65→workspace66 transformation and both compiled archives are
checked. No earlier F4/21 or Clock proposal is incorporated. Original private Rust
spelling and complete program equivalence remain unproved.

Two actual builds produce the same complete files:

- Stripped `d0377d7cef5b7378063f8bfabac5dc9c08d29eeaaaaa14022d36909688ff5e1b`.
- Symbols `0f50faa8c325104dc77898ed84866dec2ad1eec475b6abba72c475cf7bf9bab6`.

The warm build forced both local crates fresh, reused checked external artifacts,
and retained its honest nonempty-target flags and actual path prefixes. The
independent build used the byte-exact existing portable controllerc7d215a9 with
new explicit source/output expectations and an absent target; it rebuilt212 rustc
commands with zero Fresh lines in62.437seconds. Both use native macOS v1.44 tools
and admitted Linux v1.44 SBPF libraries. The cold run authenticates254 locked
archives,4176 dependency source files,1827 SDK files and25 target libraries before
and after compilation. These are the measured inputs, not historical SDK or
whole-host provenance. Actual receipts, source archives and flags are preserved
without relabelling or grafting. The extra archive SHA maps are data derivations
from the actual retained66-member archives.

The complete1035-window census retains exactly1019 normalized and188 raw matches:
zero gains and zero losses. Pump still has16 unmatched windows. No whole-function,
whole meaningful ELF, original compiler attribution or completion claim follows
from this behavior correction. Captured loader allocation remains separate from
compiler-produced bytes; the original executable is only a comparison/runtime
input outside the compiler workspace.

Fresh validation on this exact image includes44 suites/10468 case pairs,18343
serialized transaction fields and27875 verified signature fields. All ordered
Source/log lines match, excluding only complete compute-meter lines. The six
inherited focused families retain106 case records/318 outcomes/465 signature
fields, plus separate legacy284 pairs/568 signatures and extension126 pairs/252
signatures. Direct creation and the separate genuine captured-loader supplement
use the same14 cases; the latter records42 executions/84 signatures/42 actual
captured main loads. These overlapping finite corpora are not unique-input totals.

The inherited12 MAX-counter fixtures were freshly replayed on original,
historical199fd and newD037:36 executions/signatures/captured loads using two
signed wires. Three historical199fd Source differences remain regression controls;
that image is explicitly historical, distinct from the current C0 parent of this
notice correction. NewD037 has zero counter observation/Source differences. The
d5 producers are retained unchanged, alongside disclosed execution views changing
only repository/image/receipt locators and the expected new candidate hash. Their
case, counter-mutation, instruction, signature and log logic is unchanged, and the
new candidate assertion remains active. No Source-coordinate replacement is used.

The new notice witness is one case/three executions/six signatures/three actual
captured main loads and one signed wire. Independent review rederives the complete
message-account snapshots, actual Fees ELF metadata, signer/PDA roles, full
ProgramData hashes and exact notice order. The initial gap witness and its rejected
a606 trial image remain historical evidence with all three image loads resolved;
that old trial is not a current build or promotion candidate. Exact peer audit
sources and their seven pure-data control receipts are retained. A disclosed
portable path-map view runs the same semantic checks in a clean checkout.

The top-level verifier authenticates both actual builds, all source inputs,
complete memberships, full44/focused/captured/counter records, signatures,
captured loader allocations and the new notice. Eleven isolated controls cover
seven altered witness records plus source drift, a grafted compiled archive,
literal ELF drift and a false cold-target claim. Controls execute no compiler or
VM. The current canonical source, selector and publication are owned by the
integration task; this packet remains a proposal until that task promotes it.

After the integration task freezes the packet, use normal Python with `solders`:

```sh
python3 -B research/pump-program-creator-notice-qualification-20261028/verify.py
python3 -B research/pump-program-creator-notice-qualification-20261028/integrity_controls.py \
  --report work/notice-integrity-controls.json
```

`--allow-unsealed` is only for the ongoing review. New verification entrypoints
explicitly reject optimized Python before imports or validation, because inherited
assertion-based verification is called by normal children. Retained historical
peer control receipts under optimized Python describe those earlier pure-data
checks and are not an optimized-mode qualification of the new entrypoints.

The portable build CLI and inherited replay controllers are byte-identical to
the selected parent; `build-inputs.json` and `inputs.json` bind the actual new
source/candidate/receipt. Generated cold profile SDK/workspace directories and the
external cold target are excluded from publication and remain available locally.
This finite offline qualification does not establish mainnet reachability or a
security sign-off.
