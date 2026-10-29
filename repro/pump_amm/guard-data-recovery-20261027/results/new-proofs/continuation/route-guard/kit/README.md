# Route owner-classifier replay

56 cases cover two-hop AMM/AMM, Pump/Pump, Pump/AMM and AMM/Pump routes, buys and sells, and original/unsupported owners at either position. Runs with all five imported fixture inputs checked before and after. Use `run.py --candidate CANDIDATE --output NEW --repo-root REPO`; baseline known mismatches can be authenticated with `--allow-mismatches`. Saved output exposes `verify.py::verify(directory,candidate,allow_mismatches=False)`.
