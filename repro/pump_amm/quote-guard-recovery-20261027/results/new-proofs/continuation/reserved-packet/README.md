# Reserved-fee account context recovery

The only source edit changes `SetReservedFeeRecipients.global_config` from
`Box<Account<GlobalConfig>>` to `Account<GlobalConfig>`. Constraints, field
order, handlers and source line positions are preserved.

The original parser at `0x85e28` stores the decoded account inline; the
619-window baseline allocates a box. The original wrapper at `0xe4c68`
copies the larger inline aggregate. `packet/analysis/layout-evidence.json`
records the native offsets; these are not serialized account-data offsets.

The strict private-cache build produces candidate
`c012f83275d74ea7cbe5cd897b4f6295f635ab9154e395c7efedbd7d74438455`.
It has **621/785 normalized windows, 128 raw matches, 164 unmatched**, and
**721,080/1,162,040 matched text bytes**. It gains only `0x85e28` (3,984 bytes)
and `0xe4c68` (1,552 bytes) over baseline
`0714ed3d214bf876cb8ae5884c8b5a5737773ef08f11dd1bc939c8a033f3f03e`;
there are no normalized or raw losses. Full ELF identity remains false.

Focused signed diagnostics pass against both the baseline and the changed
candidate: 267 quick admin cases, 157 reserved-recipient cases and 369
buyback cases. The 793 distinct case inputs were replayed as original/baseline
and original/fixed pairs, yielding 3,172 verified transaction signatures.
Errors, serialized states and event outputs agree; admin rollback fields
also agree. These synthetic local fixtures are bounded behavior evidence.
No expanded coverage or whole-program equivalence is claimed.

`verify.py` checks the working evidence without running a VM. The sealed
`packet/` preserves the sources, patch, artifacts, build receipt, suite
inputs and saved observations. `packet/verify_packet.py` performs portable
read-only verification using Python and solders. The build used private
APFS-cloned Cargo and target caches; private host directories were mounted
at the original guest paths for dependency path stability. The 217 recorded
source inputs and 732 cached dependency artifacts were unchanged across
the build. This is a controlled cached build, not a claim of a hermetic
standalone toolchain package. The three pre-existing incentive wrapper
stack diagnostics remain; no new such diagnostic appeared.

The legacy admin producer's `source_sha256` field inventories the repository
root working tree, not the candidate source. Candidate binding instead uses
the frozen source composition, build inventory and observer-loaded hashes.
Root source, root caches and the publication checkout were not modified.

Portable focused replay (793 inputs, 1,586 signed transactions):

```sh
python3 -B replay.py --candidate /absolute/path/to/candidate.so --output /absolute/path/to/new-run
```

The output directory must not already exist and must be outside this sealed
packet. This command executes only local LiteSVM replays, makes no RPC calls,
and leaves packet inputs untouched. Python with the `solders` package is
required. `verify_packet.py` only verifies saved evidence and does not run a VM.
