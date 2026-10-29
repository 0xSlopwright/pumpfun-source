"""Independently scan retained signed rows and review the six-case CLI; no VM."""
from pathlib import Path
import base64
import gzip
import hashlib
import json
import struct
import sys
from solders.transaction import Transaction

R = Path(__file__).resolve().parents[2]
W = R / "work/parallel-main-positive-sync-fixtures"
O = Path(__file__).resolve().parent
sys.path.insert(0, str(R / "work/parallel-main-r41-log-oracle"))
from paired_receipt_reader import records

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
read = lambda p: json.loads(p.read_text())
proof = read(W / "DEDUP-ADDENDUM02.json")
assert sha(W / "DEDUP-ADDENDUM02.json") == "0271879a9899137abdb495295f82aba9984a60874fe97b783dfe7201c5329cdd"
new = json.loads(gzip.decompress((W / "RESULT01.json.gz").read_bytes()))
assert sha(W / "RESULT01.json.gz") == proof["evidence_sha256"]["new_report"]
selected = {r["case"]["name"]: r["original"] for r in new["cases"] if r["case"]["name"] in proof["admitted_names"]}
assert len(selected) == proof["new_distinct_cases"] == 6

def fingerprint(value):
    if value is None:
        return None
    result = {k: value[k] for k in ["owner", "lamports", "executable"] if k in value}
    choices = []
    if isinstance(value.get("data_hex"), str):
        choices = [bytes.fromhex(value["data_hex"])]
    elif isinstance(value.get("data_base64"), str):
        choices = [base64.b64decode(value["data_base64"])]
    elif isinstance(value.get("data"), list):
        choices = [bytes(value["data"])]
    elif isinstance(value.get("data"), str):
        try:
            choices.append(bytes.fromhex(value["data"]))
        except ValueError:
            pass
        try:
            choices.append(base64.b64decode(value["data"], validate=True))
        except ValueError:
            pass
    if choices:
        result["hashes"] = {hashlib.sha256(x).hexdigest() for x in choices}
    elif isinstance(value.get("data_sha256"), str):
        result["hashes"] = {value["data_sha256"]}
    return result

def differing(left, right):
    if left is None or right is None:
        return left != right
    for key in left.keys() & right.keys():
        if key == "hashes":
            if not left[key] & right[key]:
                return True
        elif left[key] != right[key]:
            return True
    return False

targets = {}
for name, row in selected.items():
    txbytes = base64.b64decode(row["transaction_base64"])
    tx = Transaction.from_bytes(txbytes)
    assert all(tx.verify_with_results())
    header, keys = tx.message.header, tx.message.account_keys
    readonly = {str(k) for i, k in enumerate(keys) if not (i < header.num_required_signatures - header.num_readonly_signed_accounts if i < header.num_required_signatures else i < len(keys) - header.num_readonly_unsigned_accounts)}
    targets[name] = {"txhash": hashlib.sha256(txbytes).hexdigest(), "state": {k: fingerprint(v) for k, v in row["full_before"].items()}, "clock": row["clock"], "readonly": readonly, "collisions": 0, "known_different": 0, "source_resolved": []}

curve = "DVtP3csJxif14jEnZv82vcK3mevC4MNEApbksz5hNF4Q"
allowed_rows = {(x["group"], x["row"]): x for row in proof["closed_rows"] for x in row["resolved_ambiguous_rows"]}
assert len(allowed_rows) == 6
counts = {}
for group, expected in [("full", 10468), ("additional", 7643)]:
    p = R / f"work/parallel-main-integration/round45-captured-{group}.json.gz"
    total = 0
    for _, location, pair in records(p):
        total += 1
        old = pair["original"]
        txhash = hashlib.sha256(base64.b64decode(old["transaction_base64"])).hexdigest()
        for name, target in targets.items():
            if txhash != target["txhash"]:
                continue
            target["collisions"] += 1
            previous = old.get("full_before", old.get("before"))
            previous = {str(a.get("address", k)) if isinstance(a, dict) else str(k): fingerprint(a) for k, a in previous.items()} if isinstance(previous, dict) else {}
            if any(differing(previous[k], target["state"][k]) for k in previous.keys() & target["state"].keys()):
                target["known_different"] += 1
                continue
            if isinstance(old.get("clock"), dict) and old["clock"] != target["clock"]:
                target["known_different"] += 1
                continue
            post = old.get("accounts", {})
            if any(differing(fingerprint(post[k]), target["state"][k]) for k in target["readonly"] & post.keys() & target["state"].keys()):
                target["known_different"] += 1
                continue
            bound = allowed_rows.get((group, location))
            assert bound is not None, (name, group, location)
            assert pair["case"] == bound["case"]
            c = pair["case"]
            assert c["operation"] == "sell_v3" and not c.get("flags") and c.get("mutation", "none") not in ["complete", "creator_zero"]
            after = bytes.fromhex(old["accounts"][curve]["data_hex"])
            rq, vq = struct.unpack_from("<Q", after, 32)[0], struct.unpack_from("<Q", after, 16)[0]
            reconstructed = rq if old["error"] is not None else rq + c["reserve_out"] - vq
            assert reconstructed == bound["source_before_real_quote_reserves"] == 27960
            new_rq = struct.unpack_from("<Q", bytes(selected[name]["full_before"][curve]["data"]), 32)[0]
            assert new_rq != reconstructed
            target["source_resolved"].append({"group": group, "row": location, "old_real_quote": reconstructed, "new_real_quote": new_rq})
    assert total == expected
    counts[group] = total

archive = R / "repro/pump/main-contract-round44-20261027"
archive_manifest = read(archive / "MANIFEST.json")
for path, digest in proof["bound_source_sha256"].items():
    assert sha(R / path) == sha(archive / "inputs" / path) == digest == archive_manifest["inputs/" + path]
fixture = R / proof["committed_capture"]["path"]
assert sha(fixture) == proof["committed_capture"]["sha256"]
f = read(fixture)
captured = base64.b64decode(f["steps"][4]["before"]["curve"]["data_base64"])
assert struct.unpack_from("<Q", captured, 32)[0] == 27960
# The exact source blobs were inspected: curve writes target bytes 8..24, 24..32,
# 48, 49..81, 83..115, and 115..123; selected rows have no dynamic flags.
# Both frozen wrappers only replace Global; neither writes the curve's 32..40.
manifest = read(W / "CLI-MANIFEST.json")
assert manifest["counts"] == {"full": 0, "additional": 6}
assert len(manifest["suites"]) == 1 and manifest["suites"][0]["cases"] == 6
for name, digest in manifest["definition_sha256"].items():
    assert sha(R / name) == digest
cli = (W / "probe_regression.py").read_text()
assert "n=h.run(a.candidate,c)" in cli and "proof['admitted_names']" in cli
assert "original_sync_conditions" in cli and "assert not report['mismatches']" in cli
for target in targets.values():
    target.pop("state")
    target.pop("readonly")
    target.pop("clock")
    assert target["collisions"] == target["known_different"] + len(target["source_resolved"])
out = {"status": "six_case_dedup_and_cli_review_passed", "retained_case_counts": counts, "new_distinct_cases": 6, "targets": targets, "dedup_addendum_sha256": sha(W / "DEDUP-ADDENDUM02.json"), "cli_manifest_sha256": sha(W / "CLI-MANIFEST.json"), "cli_sha256": sha(W / "probe_regression.py"), "checks": ["All 18111 original signed input rows independently scanned with conservative mutually-observed account fields and encoding-aware data hashes.", "Every transaction collision is distinguished by known prestate/Clock/readonly data or one of six frozen-source reserve-field proofs; no compatible unknown remains for the six selected cases.", "All decisive reserve values are bound to archived source definitions and the exact captured fixture and cross-checked with recorded original outputs.", "CLI includes exactly six admitted cases, accepts the candidate argument, compares complete outcomes and original sync conditions, and fails on any mismatch."], "limits": ["No VM or transaction execution by reviewer; the new CLI remains subject to the coordinated full R47 replay.", "Two non-whitelist qualification controls remain excluded from added corpus counts.", "Source-bound decisive-field proof is not a fabricated complete historical prestate."]}
dest = O / "POSITIVE-SYNC-DEDUP-REVIEW01.json"
dest.write_text(json.dumps(out, indent=2) + "\n")
print(json.dumps({"review_sha256": sha(dest), "counts": counts, "new_distinct_cases": 6, "collisions": {k: v["collisions"] for k, v in targets.items()}}))
