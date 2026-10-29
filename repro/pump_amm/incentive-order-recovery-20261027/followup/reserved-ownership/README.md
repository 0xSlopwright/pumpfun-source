# Administrative ownership diagnostics (unselected)

Three ordinary Rust builds test allocated recipient-key collection, direct AccountInfo.key validation and fixed-eight iteration. All remain656normalized/148raw, with no gains or losses, and have178passing reserved-recipient cases each (356verified signatures per variant). Their reserved body sizes are10760,11296 and11272, versus original9176 and selected10488. None is selected.

The original reserves256heap bytes, fills eight keys and copies the224byte tail before Rent::get. That demonstrates allocated ownership but does not uniquely prove Vec: native Vec<Pubkey> and Box<[Pubkey]> collection micro-objects have identical936byte executable bodies here; Box<[Pubkey;8]> differs. Deallocation is eliminated by the actual BumpAllocator, so it cannot establish ownership type. The selected source remains unchanged.

Original0x2288 is independently fingerprinted by an attribute-free `Error::with_account_name` call with an owned String argument: all232normalized bytes and both String::clone callsites agree. The original reserved handler formats the String then passes it as the fourth Rust-ABI argument alongside the Error tag/pointer. Borrowed String/str and fmt::Arguments controls differ. This corrects an earlier symbol-only collection-drop guess; it does not justify a new wrapper or forced outlining. Current source already supplies an owned format! String, so the remaining boundary needs more evidence.

`verify.py` rechecks saved source/build/runtime and type-fingerprint evidence; it runs no VM or compiler. No zero/gap padding, forced inline attributes, binary edits, or on-chain operations were used. The standalone micro-object findings do not certify source provenance or full linked equality.
