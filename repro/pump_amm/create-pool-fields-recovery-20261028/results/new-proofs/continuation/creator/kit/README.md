# Focused replay kit

From the repository root, using the existing solders environment:

    work/test-env/bin/python -B work/amm-admin-cto-order-20261027/replay-kit/run.py --candidate CANDIDATE.so --output NEW_OUTPUT_DIRECTORY --root .
    work/test-env/bin/python -B NEW_OUTPUT_DIRECTORY/kit/verify.py --proof NEW_OUTPUT_DIRECTORY --candidate CANDIDATE.so --root .

The runner copies this kit into the new output directory, binds repository inputs
and candidate bytes, and runs three groups in parallel. It rejects existing
output paths. The verifier rechecks the exact saved inventory and signatures.

The cashback146 and CTO159 groups retain captured dependencies. Only140 of the
159 CTO scenarios enter AMM. The order8 group explicitly substitutes a synthetic
local CPI caller for Pump. It retains normal invoke_signed/PDA and transaction
signature rules, but is not evidence of reachability through captured Pump or
live state. Its source and48KB artifact are included; the oracle forwards only
the supplied AMM call and derives the pool-authority signer from the base mint.
