# Selective Pump quote helper placement

This is an unbuilt source candidate based on the frozen 64-input R41 source. It does not reuse the earlier R37/R38 root-seed candidate. Only `create_v2.rs` changes and the real `pump_quote.rs` file is added.

The original filename `programs/pump/src/pump_quote.rs` occurs at `0x1b6ed6`. Fourteen original function windows reference it, and all fourteen are reachable from ancestor walk `0x18678`. Those functions cover depth checks, the root quote seed, quote pricing, pool records and token-vault validation. Original root-seed function `0x60ee0` has the sole direct caller `0x19048` in that walk. The complete raw reference and direct-call evidence is recorded separately.

R40 has 92 captured Anchor filename differences for this path: 78 InvalidQuotePool, five Overflow, four QuotePoolNotFound, two QuoteBondingCurveNotEligible, and one each QuoteReservesOutOfRange, CurveDepthExceeded and DivisionByZero. These are Anchor error origins, not the 108-value Rust `Location` cohort.

Moving the complete `nested_create` module would introduce new filename differences. Eighteen existing nested-helper errors correctly originate in `create_v2.rs`, including the one UnsupportedQuoteMint control. The retained nested suites contain 25 already-equal `create_v2.rs` origins in total, including seven outer-handler errors. The selective candidate keeps ancestor decoding and walk admission/iteration checks in their current file.

Nine helper bodies move verbatim to a private sibling module backed by `pump_quote.rs`. Only the visibility needed by the retained sibling caller is added. `Record` and its pool constants move with those helpers. The two existing depth statements are extracted into `next_depth(&curve, g)`, following original helper `0x60a80`, which reads the decoded curve's depth and global maximum. No extra check, inline/retention attribute, original-machine-code bytes, line directive, or source-line padding is added. Existing public entry points and calls to `nested_create::walk` and `nested_create::control_account` remain unchanged.

`STAGED01.json` binds the 64 baseline and 65 candidate inputs. `pump-quote-helpers01.patch` is the portable change. This stage has no compiler or VM result. After independent review, validation should retain all prior normalized/raw windows and complete Rust `Location` matches, compare the 92 target origins and 25 protected origins, and run the existing creation/nested suites through the qualified loader. Window counts may stay unchanged even if filename provenance improves.
