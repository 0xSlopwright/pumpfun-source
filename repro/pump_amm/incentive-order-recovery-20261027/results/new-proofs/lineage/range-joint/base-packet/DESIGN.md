# Legacy reserve method-call recovery

The patch changes only legacy_buy.rs in a private copy of joint e995d6a. The resize block, shared native-recipient call, fee calculation, token transfers and account context are unchanged.

Original normal buy calls available_quote_reserves at +0x190 and effective_quote_reserves at +0x1e0, then consumes the effective result in quote_for_base at +0x238. Exact-quote buy calls the same pair at +0xa28/+0xa78 after its incoming transfer-fee adjustment. The available result is checked and discarded; effective overwrites the same output area and its returned u64 is used. Current existing method bodies are the same size as original (640 and 1088 bytes) and differ only in validated source-line fields after the retained normalization.

The old implementation manually computed accrued fees, then checked virtual-plus-accrued for can_boost before the reserve guards. The patch calls the two existing methods in the original order. Event virtual reserves and can_boost are read at event construction; the original likewise loads both halves of virtual reserves immediately before the late can_boost call (+0x1de0 normal, +0x2988 exact).

Let Q be raw quote reserves, F be the checked u64 sum of accrued fees, and V be virtual reserves. Success of available establishes A=Q-F in [0,U64_MAX]. Success of effective establishes E=Q+V in [0,U64_MAX]. Therefore V+F=E-A lies in [-U64_MAX,U64_MAX], so the later can_boost computation cannot overflow i128 on a successful path. The cached Pool fields are not assigned or reloaded in this handler; late event reads preserve their numeric values across the existing CPIs. Earlier failures retain the Overflow error code, while source metadata now comes from the methods used by the original.

This is a source and numeric-order argument, not proof of historical source text or whole-program equivalence. The method-call boundary and explicit error metadata remain independently measured and tested. The original r5-only track argument and runtime-exact specialization gap are not changed in this patch.
