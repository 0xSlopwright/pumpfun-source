# Fresh creator/CTO verification of final651

Exact candidate97bd5553 was replayed against the captured original in394 cases:108 native payout/rent cases,267 retained creator-transfer cases,19 CTO controls. All826 signatures are redecoded/verified; all comparisons pass including full normalized logs, non-executable message-account snapshots, inner instructions and return data. The rent suite includes explicitly synthetic high-Rent states and does not imply a current-network Rent discrepancy.

The three suite directories are independently portable and retain producer bytes, input manifests, candidate hashes and saved receipts. `python -B verify.py` verifies all saved evidence without a VM; `verify(directory,candidate=None)` is also available. The generic nested kits can be used for fresh future-candidate replays. No compilation, source modification or full17k corpus was performed in this packet.
