# Borrowed liquidity Context and supplied TokenProgram recovery

This is a source-structure proposal based on candidate `da29e99d0dbb63b50bb59655f7788fad0a06b7aa75dfdcebcf043d0f7ea76a59`, built from the 656-window baseline `58478a978292ea6bc4e6a9776a536f91a9384da7f1f82a2e1f9743659a34b58b`.

The new source retains **656/785 normalized windows**, **148 raw bodies**, and **826,112/1,162,040 matched executable bytes**. There are no gains or losses, and all 38 captured IDL instruction wrappers remain completely normalized-equal with equal relocation patterns. Whole ELF equality remains false. No new completion percentage is earned by this proposal.

Three Rust files change:

1. The Deposit/Withdraw helpers accept a borrowed mutable Context and remain public through the existing grouped module export. The tiny program entry methods pass the Context reference. The captured original retains the whole Context pointer and loads the event-authority bump immediately before event CPI; the prior candidate hoisted only the bump byte. The new natural boundary restores that observed pointer lifetime without forced inlining attributes.
2. Both handlers compare token mint ownership to the supplied TokenProgram account's key. The original loads that key from the accounts structure at offset `0x58`; the prior source compared against an embedded Token program constant. Existing Anchor validation still controls that supplied account's identity.
3. Reorder only the three pure reserve snapshot `let` bindings. Narrow compiler trials showed that this order emits the original pool-base, user-quote, user-base load sequence. Tuple and event-field-order alternatives did not. This changes no read/write ordering across external calls.

Deposit is now exactly **7,128 bytes**, with all **55 direct call positions** equal to the original. Exactly six normalized instructions remain unequal: four source-line immediates at offsets 800, 1536, 1920 and 3968, and a two-load scheduling swap at 4648/4656. These differences remain visible and are not normalized away. Original/candidate relocation patterns agree; fully paired actual callees are checked where a matched target exists, and unmatched helper targets remain unproved. Withdraw is **7,176 bytes versus 7,200** and retains 56 direct calls; its remaining 24-byte difference is in boosted reserve conversion/cold-error layout. Neither business body is claimed equal.

Fresh signed tests pass: **1,350 liquidity cases**, **1,996 arithmetic/validation boundary cases**, and **32 supplied-program identity/executable cases**. All **3,378 cases / 6,756 executions / 6,756 signature fields** were re-audited against saved full state and logs. Source coordinates and compute-consumption logs retain the established explicit normalization. This packet does not claim a strict repeat or a new full 17,462-case core replay; those belong to the next combined checkpoint.

One strict contextual build completed with all 227 recorded source inputs unchanged during compilation and all 762 cached dependencies unchanged. The verifier also checks the 51-to-52 canonical/workspace transformation and 175 files across nine authenticated registry roots. No new Cargo dependency, release-profile edit, padded line layout, injected assembly or manual register assignment is used.

The earlier Context-only diagnostic candidate lost three generated-IDL matches because its extra module-export line shifted the `#[program]` source coordinate. The final source groups the export in the existing declaration, preserving unrelated source layout; all three matches are retained. The earlier long-lived mint temporary and inconclusive micro-object variants are not selected. Their micro-object sizes were not treated as whole-build evidence.

```sh
python3.11 -B verify.py
```

`verify(root=None)` derives packet paths from its own file and accepts the parent loader's repository-root argument. It checks artifact/source hashes, patch application, complete window census, wrapper bodies, the six Deposit differences, paired actual callees, dependency archives, and the saved signed corpus. It executes no compiler or VM.
