"""Audit recorded trade sync outcomes independently; does not create a VM."""
from pathlib import Path
import argparse
import base64
import gzip
import hashlib
import json
import struct
import sys
from solders.transaction import Transaction

R = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(R / "work/parallel-main-r41-log-oracle"))
import audit

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def decode_event(raw, idl):
    if raw[:8] != hashlib.sha256(b"event:TradeEvent").digest()[:8]:
        return None
    types = {r["name"]: r["type"] for r in idl["types"]}
    cursor = 8
    def take(n):
        nonlocal cursor
        assert 0 <= n <= len(raw) - cursor
        value = raw[cursor:cursor+n]
        cursor += n
        return value
    def field(kind):
        if isinstance(kind, str):
            if kind == "pubkey":
                return take(32).hex()
            if kind == "bool":
                b = take(1)[0]
                assert b in (0, 1)
                return bool(b)
            if kind == "string":
                return take(int.from_bytes(take(4), "little")).decode()
            assert kind[0] in "ui" and kind[1:].isdigit()
            return int.from_bytes(take(int(kind[1:]) // 8), "little", signed=kind[0] == "i")
        if "vec" in kind:
            return [field(kind["vec"]) for _ in range(int.from_bytes(take(4), "little"))]
        if "array" in kind:
            return [field(kind["array"][0]) for _ in range(kind["array"][1])]
        if "defined" in kind:
            return {r["name"]: field(r["type"]) for r in types[kind["defined"]["name"]]["fields"]}
        raise AssertionError(kind)
    value = {r["name"]: field(r["type"]) for r in types["TradeEvent"]["fields"]}
    return value, raw[cursor:]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--folder", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    folder = args.folder.resolve()
    report = json.loads(gzip.decompress((folder / "RESULT01.json.gz").read_bytes()))
    plan = json.loads((folder / "PLAN01.json").read_text())
    identity_plan = plan if "retained_account_identities" in plan else json.loads((R / plan["based_on"]).read_text())
    idl_path = R / "evidence/upstream/pump.json"
    idl = json.loads(idl_path.read_text())
    assert report["plan_sha256"] == sha(folder / "PLAN01.json")
    assert report["script_sha256"] == sha(folder / "run_cases.py")
    assert report["candidate_sha256"] == sha(R / "work/parallel-main-integration/build-round47-identity/candidate.so")
    assert report["original_sha256"] == sha(R / "evidence/original/pump/deployed.so")
    assert not report["mismatches"] and not report["not_as_expected"]
    assert report["case_count"] == len(report["cases"]) == len(plan["cases"])
    identities = identity_plan["retained_account_identities"]
    key = lambda role: identities[role]["key"]
    summaries = []
    for row, spec in zip(report["cases"], plan["cases"]):
        assert row["case"] == spec
        o, c = row["original"], row["candidate"]
        assert o["error"] is None and c["error"] is None
        for name in ["accounts", "full_before", "clock", "return_data", "transaction_base64"]:
            assert o[name] == c[name], name
        for choices in [("inner_instructions", "inner"), ("event_payloads", "events")]:
            name = next(n for n in choices if n in o)
            assert o[name] == c[name], name
        assert audit.scope(audit.norm(o["logs"])) == audit.scope(audit.norm(c["logs"]))
        raw = base64.b64decode(o["transaction_base64"])
        tx = Transaction.from_bytes(raw)
        assert all(tx.verify_with_results())
        instructions = [x for x in tx.message.instructions if str(tx.message.account_keys[x.program_id_index]) == "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"]
        assert len(instructions) == 1
        default_suffix = [0, 0] if spec["operation"] in ["buy", "buy_exact_sol_in"] else [0] if spec["operation"].startswith("buy") else []
        suffix = spec.get("instruction_trailing_bytes", default_suffix)
        instruction_input = spec.get("instruction_input", spec.get("amount"))
        instruction_limit = spec.get("instruction_limit", spec.get("minimum_output"))
        assert bytes(instructions[0].data) == hashlib.sha256(("global:"+spec["operation"]).encode()).digest()[:8] + struct.pack("<QQ", instruction_input, instruction_limit) + bytes(suffix)
        for role in ["curve_base", "user_base", "mint"]:
            initial = o["full_before"][key(role)]
            assert initial["owner"] == identities[role]["owner"]
            assert hashlib.sha256(bytes(initial["data"])).hexdigest() == identities[role]["data_sha256"]
        before = bytes(o["full_before"][key("curve")]["data"])
        after = bytes(o["accounts"][key("curve")]["data"])
        ivt, ivq, irt, irq, supply = struct.unpack_from("<5Q", before, 8)
        vt, vq, rt, rq, final_supply = struct.unpack_from("<5Q", after, 8)
        assert final_supply == supply == identity_plan["retained_curve_inputs"]["token_total_supply"]
        is_buy = spec["operation"].startswith("buy")
        amount = ivt - vt if is_buy else vt - ivt
        quote = rq - irq if is_buy else irq - rq
        assert amount == spec.get("expected_token_amount", spec.get("amount")) and quote == spec.get("expected_trade_quote", spec.get("expected_gross_quote_floor"))
        direction = -1 if is_buy else 1
        assert rt == irt + direction * amount
        vault = struct.unpack_from("<Q", bytes(o["accounts"][key("curve_base")]["data"]), 64)[0]
        user = struct.unpack_from("<Q", bytes(o["accounts"][key("user_base")]["data"]), 64)[0]
        old_vault = struct.unpack_from("<Q", bytes(o["full_before"][key("curve_base")]["data"]), 64)[0]
        old_user = struct.unpack_from("<Q", bytes(o["full_before"][key("user_base")]["data"]), 64)[0]
        assert vault == old_vault + direction * amount and user == old_user - direction * amount
        native = before[83:115] == bytes(32)
        gd = bytes(o["full_before"][key("global")]["data"])
        signed_user = next(p for p in tx.message.account_keys if str(p) == key("user"))
        whitelisted = gd[451:483] == bytes(signed_user)
        denominator = 2 * supply - vault - user
        eligible = whitelisted and bool(after[81]) and not bool(after[48]) and denominator >= 10**12 and rq >= (10**7 if native else 10**6)
        plain = ivq + quote if is_buy else ivq - quote
        expected = min((denominator + vt) * rq // denominator, 2*10**12 if native else 160*10**9) if eligible else plain
        assert vq == expected and eligible == spec["expected_sync_update"]
        assert (vq != plain) == eligible
        events = o.get("event_payloads", o.get("events"))
        decoded = [value for x in events if (value := decode_event(base64.b64decode(x), idl)) is not None]
        assert len(decoded) == 1
        event, trailing = decoded[0]
        assert event["virtual_quote_reserves"] == vq and event["virtual_sol_reserves"] == (vq if native else 0)
        assert event["real_quote_reserves"] == rq and event["token_amount"] == amount and event["quote_amount"] == quote and event["is_buy"] == is_buy
        assert trailing == bytes(8)
        if whitelisted:
            assert event["fee"] == event["creator_fee"] == event["buyback_fee"] == 0
        for address, prior in o["full_before"].items():
            final = o["accounts"].get(address)
            if prior is not None and final is not None:
                assert prior["owner"] == final["owner"] and prior["executable"] == final["executable"]
        summaries.append({"name": spec["name"], "operation": spec["operation"], "transaction_sha256": hashlib.sha256(raw).hexdigest(), "native": native, "positive_update": eligible, "token_amount": amount, "trade_quote": quote, "post_virtual_quote": vq, "no_sync_virtual_quote": plain, "event_reserves_equal_state": True})
    out = {"status": "recorded_sync_results_review_passed", "input_sha256": {str(p.relative_to(R)): sha(p) for p in [folder / "RESULT01.json.gz", folder / "PLAN01.json", folder / "run_cases.py", idl_path]}, "case_count": len(summaries), "positive_updates": sum(r["positive_update"] for r in summaries), "cases": summaries, "checks": ["All signatures and exact main instruction inputs checked.", "Original and candidate errors, complete states, CPI/events/returns and ordinary logs agree.", "Original captured base account/mint bytes, owner/executable flags and supply are preserved.", "Post-CPI base deltas and independent reserve-sync formula verified from actual states.", "TradeEvent decoded independently from IDL; quote/base amounts and both virtual-quote fields agree with state."], "limits": ["Read-only evidence audit; no VM run by reviewer.", "Full-corpus dedup and final CLI manifest remain separate gates; no distinct-input count claimed here."]}
    args.output.write_text(json.dumps(out, indent=2) + "\n")
    print(json.dumps({"review_sha256": sha(args.output), "cases": len(summaries), "positive_updates": out["positive_updates"]}))

if __name__ == "__main__":
    main()
