# MultiHop logical module candidate

The original initializer Source descriptor names instructions/swap/multi_hop_swap.rs:68. Other original function descriptors name this module at 239 and later. This candidate moves the reconstructed implementation from multi_hop.rs to that real instruction path, keeps a one-line compatibility re-export for existing callers, and registers the module alongside other swap instructions.

Actual Anchor wrappers, traits and macros, SPL types, state types, and shared trade definitions are imported explicitly. The Pump program marker and independent per-hop account/fee types precede the transaction context; the borrowed fee context follows it. Existing function bodies and their relative order are preserved exactly. This coherent arrangement places each of AmmHop's four existing has_one constraints on a separate line; the resulting main Accounts derive is at 68, matching the original descriptor. No filler declarations, padding comments, artificial coordinates or source remapping are used.

The isolated generated-return patch may be applied before relocate.py: the recipe preserves the changed body and omits no-longer-used getter imports if the manual getter is absent. ordering-check.json records a private composition check, not a combined compilation.

The purpose of the measurement is to distinguish complete-window matches from source filename data improvements and remaining line-coordinate differences. Historical source text, full-ELF identity and whole-program runtime equivalence are not claimed.

The earlier coherent module control (derive 63) remains preserved in ../amm-multihop-module-20261027. Formatting agreement is not evidence of the historical text.
