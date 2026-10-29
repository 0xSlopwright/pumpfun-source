# Candidate TradeV2 context organization

Original compiled Source descriptors place the TradeV2 initializer context at instructions/swap/trade_v2.rs:31 and later helper diagnostics at103 onward. This candidate groups the context, its program marker, fee program IDs and fee account aliases ahead of the quote/event helpers in that existing instruction module. Trade.rs retains execution/event code and re-exports the context for existing callers.

Explicit imports name actual wrappers, traits, macro dependencies, SPL types and state. No empty padding or dummy declarations are added. The import layout and item order remain reconstruction choices; source descriptors do not prove historical text. Full-window measurement and runtime validation are required before this private candidate can be proposed.
