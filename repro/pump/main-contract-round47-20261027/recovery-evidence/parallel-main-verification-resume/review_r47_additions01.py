"""One conservative historical and cross-suite input audit; no VM or build."""
from pathlib import Path
import ast
import base64
import gzip
import hashlib
import json
import struct
import sys
from solders.transaction import Transaction

R = Path(__file__).resolve().parents[2]
O = Path(__file__).resolve().parent
sys.path.insert(0, str(R / "work/parallel-main-r41-log-oracle"))
from paired_receipt_reader import records

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
read = lambda p: json.loads(p.read_text())
helper_ast = ast.parse((O / "review_positive_dedup01.py").read_text())
ns = {"base64": base64, "hashlib": hashlib}
exec(compile(ast.Module(body=[n for n in helper_ast.body if isinstance(n, ast.FunctionDef) and n.name in ["fingerprint", "differing"]], type_ignores=[]), "fingerprints", "exec"), ns)
fingerprint, differing = ns["fingerprint"], ns["differing"]
folders = {"parallel-main-positive-sync-fixtures": 6, "parallel-main-v2-positive-sync-fixtures": 12, "parallel-main-v3-buy-positive-sync-fixtures": 8, "parallel-main-legacy-positive-sync-fixtures": 6, "parallel-main-positive-sync-nonwhite-controls": 2}
sell_proof = read(R / "work/parallel-main-positive-sync-fixtures/DEDUP-ADDENDUM02.json")
v2_proof = read(R / "work/parallel-main-v2-positive-sync-fixtures/DEDUP-ADDENDUM01.json")
targets = []
excluded = []
manifests = {}
for folder, expected in folders.items():
    directory = R / "work" / folder
    manifest = read(directory / "CLI-MANIFEST.json")
    assert manifest["counts"] == {"full": 0, "additional": expected}
    assert sum(r["cases"] for r in manifest["suites"]) == expected
    for name, value in manifest["definition_sha256"].items():
        assert sha(R / name) == value, name
    driver = (directory / "probe_regression.py").read_text()
    assert "'--candidate'" in driver and "'--output'" in driver
    assert "h.run(a.candidate,c)" in driver or "'--expected-candidate-sha256',sha(a.candidate)" in driver
    assert "sha(a.candidate)=='e7ee" not in driver
    manifests[folder] = {"sha256": sha(directory / "CLI-MANIFEST.json"), "cases": expected}
    result = json.loads(gzip.decompress((directory / "RESULT01.json.gz").read_bytes()))
    selected = set(sell_proof["admitted_names"]) if expected == 6 and folder == "parallel-main-positive-sync-fixtures" else {x["case"]["name"] for x in result["cases"]}
    assert len(selected) == expected
    for row in result["cases"]:
        o = row["original"]
        tx = Transaction.from_bytes(base64.b64decode(o["transaction_base64"]))
        assert all(tx.verify_with_results())
        keys, header = tx.message.account_keys, tx.message.header
        readonly = {str(k) for i, k in enumerate(keys) if not (i < header.num_required_signatures - header.num_readonly_signed_accounts if i < header.num_required_signatures else i < len(keys) - header.num_readonly_unsigned_accounts)}
        state = {k: fingerprint(v) for k, v in o["full_before"].items()}
        data = bytes(o["full_before"]["DVtP3csJxif14jEnZv82vcK3mevC4MNEApbksz5hNF4Q"]["data"])
        t = {"folder": folder, "name": row["case"]["name"], "txhash": hashlib.sha256(base64.b64decode(o["transaction_base64"])).hexdigest(), "state": state, "readonly": readonly, "clock": o["clock"], "curve_real_quote": struct.unpack_from("<Q", data, 32)[0], "curve_virtual_quote": struct.unpack_from("<Q", data, 16)[0], "historical_collisions": 0, "known_different": 0, "source_resolved": [], "cross_suite_collisions": []}
        (targets if t["name"] in selected else excluded).append(t)
    del result
assert len(targets) == 34 and len(excluded) == 2

def distinct(a, b):
    return a["clock"] != b["clock"] or any(differing(a["state"][k], b["state"][k]) for k in a["state"].keys() & b["state"].keys())

for i, a in enumerate(targets):
    for b in targets[:i] + excluded:
        if a["txhash"] == b["txhash"]:
            assert distinct(a, b), (a["name"], b["name"])
            a["cross_suite_collisions"].append(b["folder"] + "/" + b["name"])

sell_resolutions = {x["name"]: {(r["group"], r["row"]): r for r in x["resolved_ambiguous_rows"]} for x in sell_proof["closed_rows"]}
v2_resolutions = {x["new_case"]: x for x in v2_proof["conservative_unknowns_resolved"]}
for name, value in v2_proof["input_sha256"].items():
    assert sha(R / name) == value
with gzip.open(R / "work/parallel-main-integration/round45-captured-additional.json.gz", "rt") as stream:
    prefix = ""
    while '"suites":{' not in prefix:
        prefix += stream.read(65536)
runtime_head = json.loads(prefix[:prefix.index('"suites":{')] + '"suites":{}}')
archive = R / "repro/pump/main-contract-round44-20261027"
archive_manifest = read(archive / "MANIFEST.json")
for name in ["work/parallel-main-global-fee-waiver/probe-v2.py", "scripts/pump_sell_v2_differential.py", "scripts/pump_trade_fixture.py"]:
    assert archive_manifest["inputs/" + name] == sha(archive / "inputs" / name) == sha(R / name)
    if name != "scripts/pump_trade_fixture.py":
        assert runtime_head["input_sha256"][str(R / name)] == sha(R / name)
fixture = read(R / "research/imported-lab/analysis/pump_fun/curve-fresh-trades-v3-signed-surfpool.json")
captured = base64.b64decode(fixture["steps"][4]["before"]["curve"]["data_base64"])
assert struct.unpack_from("<Q", captured, 32)[0] == 27960
counts = {}
for group, expected in [("full", 10468), ("additional", 7643)]:
    total = 0
    for _, where, pair in records(R / f"work/parallel-main-integration/round45-captured-{group}.json.gz"):
        total += 1
        old = pair["original"]
        txhash = hashlib.sha256(base64.b64decode(old["transaction_base64"])).hexdigest()
        for t in targets:
            if t["txhash"] != txhash:
                continue
            t["historical_collisions"] += 1
            prior = old.get("full_before", old.get("before"))
            prior = {str(a.get("address", k)) if isinstance(a, dict) else str(k): fingerprint(a) for k, a in prior.items()} if isinstance(prior, dict) else {}
            if any(differing(prior[k], t["state"][k]) for k in prior.keys() & t["state"].keys()) or isinstance(old.get("clock"), dict) and old["clock"] != t["clock"]:
                t["known_different"] += 1
                continue
            post = old.get("accounts", {})
            if any(differing(fingerprint(post[k]), t["state"][k]) for k in t["readonly"] & post.keys() & t["state"].keys()):
                t["known_different"] += 1
                continue
            if t["folder"] == "parallel-main-positive-sync-fixtures":
                row = sell_resolutions[t["name"]][(group, where)]
                assert pair["case"] == row["case"] and t["curve_real_quote"] != row["source_before_real_quote_reserves"] == 27960
                t["source_resolved"].append(group + "/" + where)
            elif t["folder"] == "parallel-main-v2-positive-sync-fixtures":
                row = v2_resolutions[t["name"]]
                assert group == "additional" and where == "fee_waiver_27/cases/" + str(row["baseline_case_index"])
                c = pair["case"]
                assert c["name"] == row["baseline_case_name"] and c["kind"] == "sell_v2"
                assert set(c) <= {"name", "kind", "token_quote", "account_mutations"}
                assert set(c["account_mutations"]) == {"global"}
                assert all(451 <= offset < 483 for offset, _ in c["account_mutations"]["global"]["bytes"])
                assert t["curve_real_quote"] != row["old_curve_real_quote_prestate"] == 27960
                t["source_resolved"].append(group + "/" + where)
            else:
                raise AssertionError(("Unresolved compatible historical input", t["name"], group, where))
    assert total == expected
    counts[group] = total
for t in targets:
    assert t["historical_collisions"] == t["known_different"] + len(t["source_resolved"])
    for name in ["state", "readonly", "clock"]:
        t.pop(name)
report = {"status": "all_34_additions_distinct_and_cli_bound", "historical_cases_scanned": counts, "new_distinct_cases": 34, "manifest_counts": manifests, "targets": targets, "excluded_old_qualification_controls": [x["name"] for x in excluded], "checks": ["Every pair among all 34 admitted definitions compared; matching signed transactions have different complete observed prestate/Clock.", "All 18111 retained original input rows scanned with conservative partial-state and encoding rules.", "Only previously reviewed frozen-source decisive-field proofs resolve otherwise ambiguous SellV3/V2 rows.", "All five CLI manifests bind current definitions, accept the provided candidate dynamically, and require zero runtime mismatches."], "limits": ["No new VM or build performed by this reviewer.", "Final R47 full-corpus execution still required; source/identity qualification runs do not replace it."]}
out = O / "R47-ADDITIONS-REVIEW01.json"
out.write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"review_sha256": sha(out), "new_distinct_cases": 34, "historical_cases": counts, "same_transaction_pairs_checked": sum(len(t["cross_suite_collisions"]) for t in targets)}))
