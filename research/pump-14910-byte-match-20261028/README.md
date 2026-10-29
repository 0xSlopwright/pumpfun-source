# Pump `0x14910` exact-match recipe

Target: `0x14910` (`admit_associated_token_account`), 6,080 bytes.

The archived reconstruction sweep found a source-level recipe that makes this window byte-equal after normalization while preserving the existing behavior and all call sites. The tested variant reported 991/1035 normalized windows and 166 raw matches, with no losses; runtime validation passed and there were no stack warnings.

## Minimal source changes

In `programs/pump/src/buy_v2.rs`, inside `admit_associated_token_account`:

1. Change the `payer` parameter from:

```rust
payer:&AccountInfo<'info>
```

to:

```rust
payer:*const AccountInfo<'info>
```

and immediately before the create call use:

```rust
let payer=unsafe{&*payer};
```

2. Bind the owner check before the branch:

```rust
let needs_create=account.owner==&anchor_lang::system_program::ID;
if needs_create {
```

instead of branching directly on the comparison.

3. Pass copied keys to the ATA instruction:

```rust
create_associated_token_account_idempotent(&payer.key(),&authority.key(),mint,token_program)
```

rather than the direct field expressions.

## Why this matters

The original machine code re-reads `payer.key` after the CPI. The normal `&AccountInfo` parameter causes rustc to attach `noalias`, allowing GVN to reuse the earlier key load and changing register allocation for the entire function. The raw-pointer parameter removes that aliasing guarantee; the reconstruction sweep reports that this reproduces the original allocation. The boolean binding also changes the post-invoke block order to the original shape.

Behavior is unchanged: ATA derivation, ownership checks, optional idempotent creation, token-account deserialization, and mint validation remain the same.

Source evidence: `research/claude-pump-integration-20261027/r37-layout-35/tools/l33-inputs/fz-P-buyv2a-r1-01/README.md` records the successful run and the exact three-line recipe.

The recipe as a patch against the L31-base `programs/pump/src/buy_v2.rs` it was recorded on is `buy_v2-14910-exact.patch` in this directory (current `main` already carries the three changes, so it no longer applies there). It lives here rather than beside the source evidence because `r37-layout-35` is a sealed package whose `verify.py` requires its file set to equal `MANIFEST.json`.
