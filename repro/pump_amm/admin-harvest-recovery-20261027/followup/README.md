# Unselected follow-up controls

Neither experiment changes the selected 656-window candidate.

- [Flags iterator](flags-iterator/README.md): 478 signed route cases and 200 bounded micro-execution cases pass; no normalized/raw gain. The original compiler boundary remains unresolved.
- InitBoost alias elimination: removing the prebound Pool reference produces the exact same stripped and unstripped candidate bytes. This rules out that spelling as the cause of the remaining 24-byte gap. Its [verifier](init-boost-alias/verify.py) checks the source patch and build receipt; no additional VM execution is needed for the identical artifact.
