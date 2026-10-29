# Lane w4-buyexactquote-v3 (wave 4)

Target `0x1489f8` `trade::buy_exact_quote` (v3), original 7856 B. Base origin/main 630a07412 (1023 normalized / 277 raw):
7776 B, ratio 0.61352 (llc-oracle masked 0.8532), 66/66 calls.

Tools: `scripts/` (copied from w3-buyexactquote-v3, paths pointed at this lane: trial.py, ir.py, rawexp.sh, hc.py, bbmap.py).

## Trials (ledger keys `0x1489f8-main-630a074-*-v1`)

| trial | mechanism | bytes | ratio | masked | result |
| --- | --- | ---: | ---: | ---: | --- |
| base | main 630a07412 | 7776 | 0.6135 | 0.8532 | |
| **t01** | `pub fn buy_exact_quote(..){buy_exact_quote_body(..)} #[inline(always)] fn buy_exact_quote_body(..)` (sell_v3 s04 idiom) | 7776 | 0.6367 | 0.8574 | kept |
| u01/u04 | nested fn / closure wrapping the 891 require | 8000 | 0.3592 | 0.7829 | rejected |
| u02 | 891 require inside a block with rebinding locals | 7784 | 0.6343 | 0.8570 | rejected |
| v01 | `require_neq!(available,0)` on t01 | 7776 | = t01 | | identical |
| v02 | v01 + post_fee via match with the Err arm first | 7776 | = t01 | | identical |
| **x01** | `let (is_sol,quote_fee);` declared before the 881 check, `(is_sol,quote_fee)=check_quote(a)?;`, `require_neq!(available,0)` | 7768 | 0.6519 | 0.8906 | kept (raw drift 0xa868) |
| x02 | x01 declaration with require_gt | 7776 | 0.6220 | 0.8522 | rejected |

t01: the LLVM-inlined body changes the frame layout: the name String now sits at -0x180 as in the original.
Remaining: a global register rotation (orig ctx r6 / 5th arg r9 / return tag r8; ours r9 / r8 / r6), and the
891-error/EXIT chain placement (orig places [891 err, EXIT] after the non-whitelist arm).

## 891 error / exit-join mechanism (x01)

Raw-opt oracle (`scripts/rawexp.sh`, RSYM=buy_exact_quote_body17h): the bad shape is a block of the error-return path
created *directly after* bb23 (the `v3_trade_fees` call block) in rustc's block-creation order. With require_gt that block is the
891 err block (created as the `otherwise` target together with bb23). With require_neq it is bb112, the scope-exit
block (`lifetime.end(quote_fee)`), which the err block creates when it is codegen'd (rustc codegens the 0-target err first; RPO
visits successors with `next_back`). Moving either away from bb23 gives 0.6667 / masked 0.8959 (oracle).
In source: declaring `quote_fee` before the 881 check makes the first error (L881) the first reference to
quote_fee's scope-exit block, so it already exists when the 891 err is codegen'd. Official x01: 7768 B, 0.6519 / masked 0.8906.

Caveat: raw loss `0xa868`. That is a 24-byte `<&T as Debug>::fmt` thunk at 0xa7b0 whose call crosses buy_exact_quote; its
raw match depended on the total byte span matching the original by coincidence. Any change in the target's size breaks it (u02, x01).
PRs #1539 and #1542 report the same drift.
