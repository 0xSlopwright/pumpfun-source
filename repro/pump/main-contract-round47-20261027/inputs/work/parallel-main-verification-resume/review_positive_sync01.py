"""Read recorded paired fixtures only; no VM invocation."""
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
P = Path(__file__).resolve().parent
sys.path.insert(0, str(R / "work/parallel-main-r41-log-oracle"))
import audit

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
digest = lambda b: hashlib.sha256(b).hexdigest()
result = json.loads(gzip.decompress((W / "RESULT01.json.gz").read_bytes()))
plan = json.loads((W / "PLAN01.json").read_text())
assert result["plan_sha256"] == sha(W / "PLAN01.json")
assert result["script_sha256"] == sha(W / "run_cases.py")
assert result["candidate_sha256"] == sha(R / "work/parallel-main-integration/build-round45/candidate.so")
assert result["original_sha256"] == sha(R / "evidence/original/pump/deployed.so")
assert result["case_count"] == len(result["cases"]) == len(plan["cases"]) == 8
assert not result["mismatches"] and not result["not_as_expected"]
identities = plan["retained_account_identities"]
key = lambda role: identities[role]["key"]
summaries = []
positive = []
for row, spec in zip(result["cases"], plan["cases"]):
    assert row["case"] == spec
    o, c = row["original"], row["candidate"]
    assert o["error"] is None and c["error"] is None
    for field in ["accounts", "before", "full_before", "clock", "inner_instructions", "event_payloads", "return_data", "transaction_base64"]:
        assert o[field] == c[field], (spec["name"], field)
    assert audit.scope(audit.norm(o["logs"])) == audit.scope(audit.norm(c["logs"]))
    assert o["full_before"] == o["before"]
    raw_tx = base64.b64decode(o["transaction_base64"])
    assert digest(raw_tx) == o["transaction_sha256"] == c["transaction_sha256"]
    tx = Transaction.from_bytes(raw_tx)
    assert tx.verify_with_results() and all(tx.verify_with_results())
    msg = tx.message
    instructions = [ix for ix in msg.instructions if str(msg.account_keys[ix.program_id_index]) == "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"]
    assert len(instructions) == 1
    data = bytes(instructions[0].data)
    assert data == hashlib.sha256(b"global:sell_v3").digest()[:8] + struct.pack("<QQ", spec["amount"], spec["minimum_output"])
    for name, value in o["dependency_sha256"].items():
        assert sha(R / name) == value == c["dependency_sha256"][name]
    for role in ["curve_base", "user_base", "mint"]:
        account = o["before"][key(role)]
        assert account["owner"] == identities[role]["owner"]
        assert digest(bytes(account["data"])) == identities[role]["data_sha256"]
    for address, before in o["before"].items():
        after = o["accounts"][address]
        if before is not None and after is not None:
            assert before["owner"] == after["owner"] and before["executable"] == after["executable"]
    initial = bytes(o["before"][key("curve")]["data"])
    final = bytes(o["accounts"][key("curve")]["data"])
    ivt, ivq, irt, irq, supply = struct.unpack_from("<5Q", initial, 8)
    vt, vq, rt, rq, final_supply = struct.unpack_from("<5Q", final, 8)
    assert final_supply == supply == plan["retained_curve_inputs"]["token_total_supply"]
    initial_vault = struct.unpack_from("<Q", bytes(o["before"][key("curve_base")]["data"]), 64)[0]
    initial_user = struct.unpack_from("<Q", bytes(o["before"][key("user_base")]["data"]), 64)[0]
    vault = struct.unpack_from("<Q", bytes(o["accounts"][key("curve_base")]["data"]), 64)[0]
    user = struct.unpack_from("<Q", bytes(o["accounts"][key("user_base")]["data"]), 64)[0]
    assert vault == initial_vault + spec["amount"] and user == initial_user - spec["amount"]
    assert vt == ivt + spec["amount"] and rt == irt + spec["amount"]
    native = initial[83:115] == bytes(32)
    global_data = bytes(o["before"][key("global")]["data"])
    # Decode the signed user key through the message; no fixture label determines eligibility.
    user_index = list(map(str, msg.account_keys)).index(key("user"))
    whitelist = global_data[451:483] == bytes(msg.account_keys[user_index])
    assert whitelist == spec["whitelist_user"]
    denom = 2 * supply - vault - user
    eligible = whitelist and bool(final[81]) and not bool(final[48]) and denom >= 10**12 and rq >= (10**7 if native else 10**6)
    plain = ivq - (irq - rq)
    expected = min((denom + vt) * rq // denom, 2 * 10**12 if native else 160 * 10**9) if eligible else plain
    assert eligible == spec["expected_sync_update"] and vq == expected
    if eligible:
        assert vq != plain
        positive.append(spec["name"])
    else:
        assert vq == plain
    summaries.append({"name": spec["name"], "signed_transaction_sha256": digest(raw_tx), "original_and_candidate_success": True, "all_compared_outcomes_equal": True, "native": native, "whitelisted": whitelist, "denominator": denom, "post_virtual_quote": vq, "no_sync_virtual_quote": plain, "sync_eligible": eligible, "positive_update": vq != plain})
assert positive == ["native-positive", "token-positive"]
report = {"status": "paired_positive_sync_review_passed", "scope": "Read-only independent review of eight recorded original/final-R45 SellV3 cases", "input_sha256": {str(p.relative_to(R)): sha(p) for p in [W / "RESULT01.json.gz", W / "PLAN01.json", W / "run_cases.py"]}, "cases": summaries, "counts": {"cases": 8, "success_pairs": 8, "positive_update_pairs": 2, "disabled_update_controls": 6}, "limits": ["No new VM or transaction executed by reviewer.", "Full-corpus dedup and final CLI manifest are separate gates; these eight definitions are not yet a claim of eight additional corpus inputs.", "Bounded local signed fixtures do not imply whole-program or current-chain equivalence."]}
dest = P / "POSITIVE-SYNC-REVIEW01.json"
dest.write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"review_sha256": sha(dest), "counts": report["counts"]}))
