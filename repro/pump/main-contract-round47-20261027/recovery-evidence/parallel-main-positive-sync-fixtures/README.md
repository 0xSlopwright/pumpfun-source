# Proposed positive reserve-sync coverage

No VM or transaction has been executed for these inputs. The existing 33
whitelisted successful SellV3 receipts all have the main contract's curve-mode
flag disabled, so they do not cover the reserve-sync update branch.

`PLAN01.json` contains eight ordinary-account inputs derived from the existing
captured V3 fixture: native and SPL quote variants, each with one positive sync
case and three controls (non-whitelisted user, disabled curve-mode flag, and quote
reserves below the sync threshold). This changes a flag in the main Pump curve;
no separate program is under test.

Base mint supply and both base token balances stay at their captured values. The
sell amount is half the captured user's base balance. Native curve funding is four
SOL, its tracked quote reserve is three SOL, and the user keeps an ordinary funded
balance. The SPL variant uses five quote units with a ten-unit virtual reserve.
The expected sync value must differ from the no-sync value, preventing a vacuous
positive result.

Root review is required before local paired execution. After execution, complete
input-state deduplication determines how many of these definitions are genuinely
new. No new-case count is claimed now.

The eight approved local paired cases have now passed against the captured
original and R45 final candidate. Both positive reserve updates differed from
their no-sync values. Six whitelisted definitions are proven distinct by the
source-bound decisive-field addendum; the two non-whitelisted cases remain
qualification controls and are excluded from the proposed six-case corpus
addition. The regression CLI has been prepared but not executed here.
