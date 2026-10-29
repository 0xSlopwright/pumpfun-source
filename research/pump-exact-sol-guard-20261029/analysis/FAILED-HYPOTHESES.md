# Rejected hypotheses and compiler-stage boundary

The accepted candidate contains ONLY the branch-local corrected-quote guard.
The source spelling of the original private project is not claimed.

- An immediate Result closure at Source133 actually outlined a 608-byte helper;
  the target shrank to 12768B and seven previously matched windows were lost.
  Reject. The first attempt reused stale target output and is invalid; only
  `error-result-boundary-fresh` was a real compilation. Producers now require
  exactly one root rustc invocation and preserve all source content hashes.
- `Err::<(), Error>(error!(...).with_values(...))?` on the accepted branch patch
  produced the identical complete ELF. No gain.
- An inline(always) budget helper changed the target to 13048B. Reject.
- Explicitly matching and reconstructing both Error variants produced the
  identical complete ELF. No gain.

The diagnostic compiler trace was captured on the 673-based branch-local-zero
candidate, not relabeled as the latest multi-hop composition. Its exact target
raw bytes equal that normally compiled candidate. The two remaining stack loads
first appear in payload-then-tag order after instruction selection; greedy
allocation and virtual-register rewriting preserve that order. LLVM already
extracts the tag first, so textual extract order does not explain the scheduler
choice. The existing evidence does not justify another equivalent expression
rewrite. `673-trace-qualification.json` and `experiments.json.gz` preserve the hashes,
scopes and excluded results. No edited compiler IR or machine code is submitted.

The publication's independent current-image audit and fresh runtime records use
ONLY the latest current-parent/current-guard ELF hashes reported in README.