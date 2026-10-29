# V2 quote-mint AccountInfo ownership recovery

Candidate dbb5dcfd restores three ordinary quote-mint AccountInfo temporaries before from_mint in buy_v2, buy_exact_quote_in_v2 and sell_v2. The existing H18 01a038ea source is the baseline; only instructions/swap/trade_v2.rs changes. Captured code clones AccountInfo, calls the decoder32bytes later and drops both Rc fields. The separate isolated proof checks original instruction/argument witnesses, allthree caller shapes and unchanged decoder. No padding, forced attributes or unrelated source changes were added.

The first strict build is reused from the isolated math lane and retained verbatim. A new strict repeat uses the same frozen physical source path with a private target cache; both ELFs and233 source inputs/765 dependencies are identical. The canonical57-input recipe maps exactly to58 workspace plus175 registry inputs. Native artifacts are unchanged from H15; its historical compilation remains historical.

Complete measurement remains660/785 normalized,159raw,125remaining,831376matched text bytes; no gains or losses. All38wrappers remain. All13 standard groups executed freshly for dbb5dcfd, with current17462core/1502private/1730incentive/2811supplemental/41CTO/216native/58decoder evidence. Further700incentive,283create/canonical,60order and14boost-helper controls pass. Same-artifact isolated870trade +174mint-boundary cases are reused without duplicateexecution. Cases overlap. Full caller/ELF identity remains unproven.

Raw14native Source-coordinate differences remain explicit. Current24default +24high-budget policy controls preserve the same4default resource mismatches, high-budget0, and retained24H16baseline (144signatures). The separate H18 allocation followup explains fixture loader-size cost but is not relabeled as this candidate's control.

An initial order60 attempt failed fixture import before sending transactions because of its workingdirectory. Only that suite was retried with the correct private input root; the failure and accurate commandmetadata are retained. Every actual orchestration subprocess is guarded for currentcandidate and output paths.

Run python -B verify.py with Python3.12+solders. Verification runs no compiler/VM/network. Whole-ELF identity, exhaustive behavior and live deployment compute parity remain open.

A separate current-candidate allocation-proof replays48 equal-allocation pairs (96signatures) for dbb5dcfd and derives the36764-unit executable-account charge difference. The H18 allocation result remains historical. Raw four default discrepancies and live-layout uncertainty are preserved.
