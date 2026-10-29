# Lane w3-swaphop (wave 3): 0x5b3b0 `multi_hop_curve::swap_hop`

Base: origin/main 665499915 (1022 normalized / 276 raw). Approach: stack-slot / local-layout
reconstruction, then the LLVM-IR oracle.

## Step 0: port of round-2 pf1

PR #1248 merged only round 1 of the multihop-reconstruction lane. Its round-2 commits
(d2e730407 mac1 `macro_rules! route_event!`, 1e90f38b7 pf1 deferred `let post_fill;`) never
reached main. Applied unchanged on 665499915 (attempt 051b0bbc):

| build | bytes (orig 18,584) | win ratio | opregs | op | segdist opregs / exact | official |
|---|---:|---:|---:|---:|---:|---|
| main 665499915 | 18,376 | 0.0915 | 0.6574 | 0.7370 | 1132 / 1886 | 1022 / 276 |
| pf1m (pf1 on main) | 18,272 | 0.2148 | 0.7233 | 0.8071 | 903 / 1628 | 1022 / 276, no losses |

pf1m unstripped sha256 83fbc9e46b15bc0443afa9c136154f0edd29a2a97aa20ae9b2bc031acb8c29e4.
