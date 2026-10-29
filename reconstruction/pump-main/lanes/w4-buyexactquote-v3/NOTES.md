# Lane w4-buyexactquote-v3 (wave 4)

Target `0x1489f8` `trade::buy_exact_quote` (v3), original 7856 B. Base origin/main 630a07412 (1023 normalized / 277 raw):
7776 B, ratio 0.61352 (llc-oracle masked 0.8532), 66/66 calls.

Tools: `scripts/` (copied from w3-buyexactquote-v3, paths pointed at this lane: trial.py, ir.py, rawexp.sh, hc.py, bbmap.py).

## Trials (ledger keys `0x1489f8-main-630a074-*-v1`)

| trial | mechanism | bytes | ratio | masked | result |
| --- | --- | ---: | ---: | ---: | --- |
| base | main 630a07412 | 7776 | 0.6135 | 0.8532 | |
| **t01** | `pub fn buy_exact_quote(..){buy_exact_quote_body(..)} #[inline(always)] fn buy_exact_quote_body(..)` (sell_v3 s04 idiom) | 7776 | 0.6367 | 0.8574 | kept |

t01: the LLVM-inlined body changes the frame layout: the name String now sits at -0x180 as in the original.
Remaining: a global register rotation (orig ctx r6 / 5th arg r9 / return tag r8; ours r9 / r8 / r6), and the
891-error/EXIT chain placement (orig places [891 err, EXIT] after the non-whitelist arm).
