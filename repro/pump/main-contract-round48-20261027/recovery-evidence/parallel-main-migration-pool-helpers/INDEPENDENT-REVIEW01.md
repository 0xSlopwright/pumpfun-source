# Migration pool helper review

`source01` passes the bounded source and CPI ABI review. All 65 base and staged input hashes match `STAGED01.json`; only `src/migrate.rs` and `src/migrate_v2.rs` differ. No compiler, transaction or VM ran during this review.

The two replaced call sites retain byte-identical source before and after the call. The helpers preserve all 18 accounts in IDL order, including their signer and writable flags. The full role table is in `INDEPENDENT-REVIEW01.json`. Only `creator` (`pool_authority`) signs. Both paths pass 18 account metas and 19 account infos, including the repeated AMM program account. Neither path adds remaining accounts.

The generated instruction is the same 70-byte layout as the removed V2 encoder: 8-byte discriminator, u16 index, two u64 amounts, 32-byte creator key, two one-byte booleans, u64 creator fee, and two one-byte booleans. `OptionBool` and `OptionU64` are tuple structs, with no option tag. This follows the pinned IDL and Anchor/Borsh generator sources, not the AMM implementation.

Signer seeds remain `pool-authority`, the base mint key and the same context bump. The V1 token program selector preserves its previous predicate because `Program<Token>` already validates Tokenkeg. Re-reading curve arguments in the helper preserves the cached typed state: no mutation or reload of that value occurs before the replaced call.

The retained original confirms callers at `0x405a0` and `0x4aa78`, helper windows `0x43ea0` and `0x502f0`, selector `0x47e28`, and both generated CPI calls to `0x10c0b8`. The generated callee's normalized match was independently rechecked. The original Tokenkeg constant and seed literal were also checked against their bytes. This does not certify the complete staged helper bodies until the coordinated candidate is built and measured.

**Selection remains gated on the current build.** A historical inline generated CPI attempt exceeded the 4096-byte stack limit and failed 482 of 827 V2 migration cases. The standalone source matches the original structure, but compiler decisions after composition can still affect stack usage. Require no stack-overflow warning, no lost normalized matches, and the retained full runtime corpus including both migration suites. Historical L06 counts and runtime receipts do not qualify this staged source.

Reproduce the static checks with `python3 work/parallel-main-migration-pool-helpers/independent_review01.py`. The script hashes inputs, checks source boundaries and account mapping, and reads retained original/candidate bytes only.
