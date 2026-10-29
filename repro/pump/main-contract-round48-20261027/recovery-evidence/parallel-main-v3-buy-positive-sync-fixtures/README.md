# Main Pump V3 buy sync qualification

Eight local paired original/R47 executions passed with exact transaction, full prestate, Clock, account, CPI, event, return and ordered-log comparisons. All original calls succeeded. Four positive cases changed the virtual quote reserve; four mode-disabled controls retained the no-sync value. Both native and normal SPL quote paths are covered for buy and exact-quote buy.

The read-only dedup scan covered 18,111 retained inputs, the eight SellV3 qualification inputs, the twelve V2 qualification inputs and pairwise comparisons among these eight new inputs. All eight are distinct, with no unresolved collision. The CLI manifest adds eight additional cases only after coordinated corpus admission.

No production source, owners, executable flags, authorities, base mint supply or base prebalances were changed. No RPC was used. The initial read-only dedup attempts stopped before completion (missing in-progress result, then a top-level report-format mismatch); those logs and the pre-repair reader remain preserved. No VM was repeated.
