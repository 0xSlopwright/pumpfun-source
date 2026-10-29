# Main Pump token reload and reserve synchronization

The original shared helper at `0x7890` reloads an `Account<TokenAccount>` from its backing account data. Its 688-byte body calls the matched `try_borrow_data`, TokenAccount decoder and error converter, writes the decoded token state back to the wrapper, and releases the borrow. `InterfaceAccount::reload` delegates to this inner Account method in the pinned Anchor source.

Eight original settlement bodies call this helper twice and then call the matched curve synchronization helper at `0xa23f0`. `ALL-RELOAD-CALLERS03.json` records their callsites and guard instructions.

The reload sequence is guarded. Each first reload entry is reached from a 32-byte equality comparison against `GlobalAccount + 0x288`; the compiled current whitelist test uses that same native offset. The V3 sell sequence reloads the base vault first, then the base user token account. The original exact token transfer call independently establishes the two account roles; the proof does not rely on Rust declaration order.

`source01` is rejected and retained only as research: it incorrectly inserted the calls unconditionally near event creation. Root stopped its selection when the full control-flow review found the missing whitelist guard.

`source02` is an uncompiled correction for V3 sell. It moves the existing `apply_sell` before the base token transfer, as in the original; follows that transfer with whitelist-gated reload and synchronization; and retains existing relative payment order. It only widens visibility of the existing main-Pump synchronization method. No source of the separate Mayhem program is edited.

This does not finish V3 sell reconstruction. The existing placement of fee accrual remains a separate source-order gap. Full existing-corpus state, event, return, error, ordinary-log and byte-window checks are required before selection. No new transaction was created in this lane.

`../parallel-main-v3-buy-reload-sync` stages the analogous V3 buy and exact-quote source hypothesis separately. Those handlers share the original settlement helper at `0x83c00`. Their patch remains pending independent full-CFG review and compilation.
