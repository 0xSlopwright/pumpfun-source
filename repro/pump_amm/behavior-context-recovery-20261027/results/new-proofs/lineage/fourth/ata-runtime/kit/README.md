# Focused ATA edge combinations

These60 cases add combinations absent from the existing broad suites: empty destination plus readonly/low funds/token-program ownership; zero payout plus empty/frozen/wrong-owner/wrong-mint/readonly destination; Token-2022 creation with readonly/low funds/zero payout. Each applies to legacy buy, exact-quote buy, sell, protocol sweep and creator sweep. Existing positive-state single-field tests are deliberately not repeated. run.py accepts candidate/output/repo-root, executes local signed transactions and produces a self-contained saved verifier.
