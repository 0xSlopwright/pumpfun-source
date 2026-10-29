# Expanded helper input binding

This separate 315-case replay of the selected 623-window candidate binds the two import-time fixtures omitted from the first helper packet's explicit input list: evidence/upstream/pump.json and research/imported-lab/analysis/pump_fun/curve-fresh-trades-v3-signed-surfpool.json.

All 315 cases and 630 signatures pass with zero differences. The original packet remains immutable; its recorded transactions and before/after states remain evidence, but its explicit input list was not a complete import closure. The v2 replay supplies the additional input binding without changing contract source or selected ELF.

The v2 result seal is 0233a9fc28b2881776fd6a559612a93c45d958c7c3bc0b65b648a3bc987ba626. See swap-helper-inputs/provenance-clarification.json and the portable verifier in swap-helper-inputs/verify.py.
