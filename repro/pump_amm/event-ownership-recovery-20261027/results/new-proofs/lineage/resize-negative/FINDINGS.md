# Pool resize lifetime diagnostics

Target: original `0x58028`, 3,552 bytes, nine direct callers. The existing refined control remains `d97fe12f1b019772543b4e2ef3b24005745ea9c128618dc39f5b01b151c692c0`, with a 3,392-byte `utils::prepare_pool` at `0x26d48`. No selected source, root cache or existing proof was changed.

## Verified instruction differences

The original keeps the incoming AccountInfo pointer in r7, loads its Rc and header fields for the first clone, passes the clone to data_len at +304, then drops that clone before checking the returned length. For the second check it reloads the fields from the original pointer; the second data_len call is +728. Rent and minimum-balance calls follow at +896/+1040. The original uses the borrowed input pointer again for subsequent clones.

The control instead keeps the first Rc pointers and other AccountInfo header values in registers/stack slots across calls. Its data_len calls are +328/+720. The optimized Rust IR annotates all three borrowed AccountInfo arguments `noalias readonly align 8 dereferenceable(48)`. That metadata and the subsequent commoned field loads explain what the current compiler produced; they do not prove the original Rust parameter types or justify changing them to owned or mutable arguments. The current function also places the realloc branch physically before the CPI-transfer block, unlike the original.

## New bounded object batch

The direct-rustc batch uses the real SDK/Anchor extern artifacts and Solana bump allocator. The baseline object equals the complete 3,392-byte refined control after recorded relocation normalization, calibrating this diagnostic to the program build.

Two previously untested natural forms were compiled together:

- Two direct nested data_len checks, without the generic inner helper.
- The same direct checks with explicit first_len and second_len integer bindings.

Both produce 3,384 bytes and remain unmatched. SequenceMatcher alignment (8-byte slots, no autojunk) is 200/444 original slots, versus 134/444 for the calibrated 3,392-byte control. This is a diagnostic alignment metric, not identity. Both still cache the original header fields and do not recover the original clone/reload sequence. Their branch organization converges on the previously rejected early-return-style form. No full build or runtime replay was warranted; no reconstruction patch is recommended.

`verify_object.py` checks the object, source binding, the two original/control extracts and all three outcomes. `provenance.json` includes the original call list, the nine callers, source/object hashes and SDK/Anchor identities. The known prior negative forms (generic-inner, explicit clone, scoped clone length, early returns and rent-guard rewrites) were not rebuilt.

## Remaining evidence boundary

A faithful explanation must recover why the original does not retain the source AccountInfo header values across independent temporary clones. Adding a persistent clone, taking owned/mutable inputs, inserting optimization barriers, or forcing representation would change or obscure the observed lifetime contract. None was used. Further work should start from caller/parameter or compiler provenance evidence rather than repeat equivalent length or comparison spellings.
