#!/usr/bin/env python3
"""Build research/amm-admin-token-incentives-20261029 receipts.

admin_update_token_incentives, pinned at runtime (2nd run packet #3;
run 1 never covered this instruction, and 2nd #2 covered the sibling
claim_cashback, not the admin updater):
- the updater writes seconds_in_a_day and mint unconditionally, then
  runs the time block only when both new start and new end are
  nonzero; a zero start or end skips ALL time validation (past,
  ordering, range) while period/mint/supply still update;
- changing start resets total_token_supply and sol_volumes to zero;
  keeping start leaves both arrays untouched;
- time errors, in source order: StartTimeInThePast 6030
  (volume_accumulator.rs:313), EndTimeInThePast 6031 (:327),
  EndTimeBeforeStartTime 6032 (:329), TimeRangeTooLarge 6033 (:331,
  also for a negative period), EndTimeBeforeCurrentDay 6034 (:352);
- when now is past the stored start, sol_volumes[current+1..=end]
  are zeroed (current=(now-start)/period, end=(end-start)/period);
- supply errors: SupplyUpdateForFinishedRange 6035 (now > end),
  DayIndexAfterEndIndex 6036 (day < 30 but past end_day),
  DayInActiveRange 6037 (day < current day); day_number >= 30
  fills total_token_supply[current..=end] instead of one slot;
  supply 0 skips the supply block entirely;
- two panic paths (ProgramFailedToComplete, everything rolls back):
  period 0 with supply > 0, and a stored end < start, both via
  end_day()'s "end_time should be bigger than start_time" expect
  (volume_accumulator.rs:387:14); a period so large that
  period*30 overflows panics "Unexpected overflow" (:334:18);
- account checks: wrong admin 6005 InvalidAdmin (caused by account:
  global_config), unsigned admin 3010 (fee paid by OUTSIDER, not
  PAYER), readonly accumulator 2000 ConstraintMut, missing
  accumulator 3012 AccountNotInitialized, 543-byte accumulator
  3003 AccountDidNotDeserialize while 544 bytes (the exact struct
  size) succeeds and keeps length 544;
- a missing global incentive token account is created by
  init_if_needed: payer delta 2044280 = 5000 fee + 2039280 rent;
- the stored mint is replaced unconditionally (a stored foreign
  mint becomes the call's mint); Token-2022 program accounts work;
- all three images (original / #424 control / #427 candidate)
  agree on every case: this packet pins behavior, it does not
  claim a divergence.
"""
import base64
import gzip
import hashlib
import json
import struct
import sys
from pathlib import Path

import os
sys.path.insert(0, str(Path.home() / "workspace/pumpfun-sparse/scripts"))
os.chdir(Path.home() / "workspace/pumpfun-sparse")
from solders.pubkey import Pubkey
from solders.transaction import Transaction

from pump_amm_incentives_differential import run, G, MINT, TOKEN, TOKEN22, ATA
from pump_amm_admin_differential import PAYER, OUTSIDER

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-admin-token-incentives-20261029"
WS = Path.home() / "workspace/slop-verify"

IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
TOKEN_SHA = {
    "spl_token": hashlib.sha256(
        (ROOT / "evidence/dependencies/spl_token/deployed.so").read_bytes()).hexdigest(),
    "spl_token_2022": hashlib.sha256(
        (ROOT / "evidence/dependencies/spl_token_2022/deployed.so").read_bytes()).hexdigest(),
}
MINT_HEX = bytes(MINT).hex()
USER_HEX = bytes(OUTSIDER.pubkey()).hex()


def S(base, overrides=None):
    out = [base] * 30
    for i, v in (overrides or {}).items():
        out[i] = v
    return out


# (label, case-dict, expected)
# ok: ("ok", start, end, period, supplies[30], volumes[30], gva_len, payer_delta)
# err: ("error", code_substring, log_fragment)
ADMIN = {"instruction": "admin_update_token_incentives"}
CASES = [
    ("base-reset", {**ADMIN, "new_start": 30, "new_end": 59, "new_period": 1,
                    "day": 0, "supply": 1000},
     ("ok", 30, 59, 1, S(0, {0: 1000}), S(0), 600, 5000)),
    ("same-start-day5", {**ADMIN, "new_start": 20, "new_end": 49, "new_period": 1,
                         "day": 5, "supply": 2000},
     ("ok", 20, 49, 1, S(1000, {5: 2000}), S(100), 600, 5000)),
    ("range-boundary-day29", {**ADMIN, "new_start": 30, "new_end": 59, "new_period": 1,
                              "day": 29, "supply": 2000},
     ("ok", 30, 59, 1, S(0, {29: 2000}), S(0), 600, 5000)),
    ("zero-skip", {**ADMIN, "new_start": 0, "new_end": 59, "new_period": 2,
                   "day": 0, "supply": 2000},
     ("ok", 20, 49, 2, S(1000, {0: 2000}), S(100), 600, 5000)),
    ("zero-both", {**ADMIN, "new_start": 0, "new_end": 0, "new_period": 2,
                   "day": 3, "supply": 2000},
     ("ok", 20, 49, 2, S(1000, {3: 2000}), S(100), 600, 5000)),
    ("period-0-supply-0", {**ADMIN, "new_start": 0, "new_end": 0, "new_period": 0,
                           "day": 0, "supply": 0},
     ("ok", 20, 49, 0, S(1000), S(100), 600, 5000)),
    ("zero-volumes", {**ADMIN, "now": 25, "new_start": 20, "new_end": 49,
                      "new_period": 1, "day": 0, "supply": 0},
     ("ok", 20, 49, 1, S(1000), S(100, {i: 0 for i in range(6, 30)}), 600, 5000)),
    ("fill-range", {**ADMIN, "new_start": 0, "new_end": 0, "new_period": 1,
                    "day": 30, "supply": 2000},
     ("ok", 20, 49, 1, S(2000), S(100), 600, 5000)),
    ("fill-from-current", {**ADMIN, "now": 25, "new_start": 0, "new_end": 0,
                           "new_period": 1, "day": 30, "supply": 2000},
     ("ok", 20, 49, 1, S(1000, {i: 2000 for i in range(5, 30)}), S(100), 600, 5000)),
    ("supply-0-reset", {**ADMIN, "new_start": 30, "new_end": 59, "new_period": 1,
                        "day": 0, "supply": 0},
     ("ok", 30, 59, 1, S(0), S(0), 600, 5000)),
    ("end-zero-only", {**ADMIN, "new_start": 30, "new_end": 0, "new_period": 1,
                        "day": 0, "supply": 2000},
     ("ok", 20, 49, 1, S(1000, {0: 2000}), S(100), 600, 5000)),
    ("missing-ata", {**ADMIN, "missing": ["global_incentive_token_account"]},
     ("ok", 30, 59, 1, S(0, {0: 1000}), S(0), 600, 2044280)),
    ("wrong-mint-stored", {**ADMIN, "wrong_mint": True, "new_start": 0,
                           "new_end": 0, "new_period": 1, "day": 0, "supply": 0},
     ("ok", 20, 49, 1, S(1000), S(100), 600, 5000)),
    ("token22", {**ADMIN, "token22": True, "new_start": 0, "new_end": 0,
                 "new_period": 1, "day": 0, "supply": 2000},
     ("ok", 20, 49, 1, S(1000, {0: 2000}), S(100), 600, 5000)),
    ("gva-len-544", {**ADMIN, "mutate": "global_volume_accumulator", "length": 544,
                     "new_start": 0, "new_end": 0, "new_period": 1,
                     "day": 0, "supply": 2000},
     ("ok", 20, 49, 1, S(1000, {0: 2000}), S(100), 544, 5000)),
    ("start-past", {**ADMIN, "new_start": 5, "new_end": 59, "new_period": 1,
                    "day": 0, "supply": 1000},
     ("error", "6030", "StartTimeInThePast")),
    ("end-past", {**ADMIN, "new_start": 30, "new_end": 5, "new_period": 1,
                  "day": 0, "supply": 1000},
     ("error", "6031", "EndTimeInThePast")),
    ("end-before-start", {**ADMIN, "new_start": 30, "new_end": 30, "new_period": 1,
                          "day": 0, "supply": 1000},
     ("error", "6032", "EndTimeBeforeStartTime")),
    ("range-too-large", {**ADMIN, "new_start": 30, "new_end": 60, "new_period": 1,
                         "day": 0, "supply": 1000},
     ("error", "6033", "TimeRangeTooLarge")),
    ("negative-period", {**ADMIN, "new_start": 30, "new_end": 59, "new_period": -1,
                         "day": 0, "supply": 1000},
     ("error", "6033", "TimeRangeTooLarge")),
    ("period-0-supply", {**ADMIN, "new_start": 0, "new_end": 0, "new_period": 0,
                         "day": 0, "supply": 1000},
     ("error", "ProgramFailedToComplete", "end_time should be bigger than start_time")),
    ("stored-inverted", {**ADMIN, "start": 49, "end": 20, "new_start": 0,
                         "new_end": 0, "new_period": 1, "day": 0, "supply": 1000},
     ("error", "ProgramFailedToComplete", "end_time should be bigger than start_time")),
    ("period-overflow", {**ADMIN, "new_start": 30, "new_end": 59,
                         "new_period": 2**63 - 1, "day": 0, "supply": 1000},
     ("error", "ProgramFailedToComplete", "Unexpected overflow")),
    ("day-after-end", {**ADMIN, "new_start": 0, "new_end": 0, "new_period": 2,
                       "day": 15, "supply": 1000},
     ("error", "6036", "DayIndexAfterEndIndex")),
    ("day-in-active", {**ADMIN, "now": 25, "new_start": 0, "new_end": 0,
                       "new_period": 1, "day": 0, "supply": 1000},
     ("error", "6037", "DayInActiveRange")),
    ("finished-range", {**ADMIN, "now": 60, "new_start": 0, "new_end": 0,
                        "new_period": 1, "day": 0, "supply": 1000},
     ("error", "6035", "SupplyUpdateForFinishedRange")),
    ("end-before-current-day", {**ADMIN, "now": 25, "new_start": 20, "new_end": 26,
                                "new_period": 10, "day": 0, "supply": 0},
     ("error", "6034", "EndTimeBeforeCurrentDay")),
    ("wrong-admin", {**ADMIN, "mutate": "global_config", "offset": 8, "value": USER_HEX},
     ("error", "6005", "InvalidAdmin")),
    ("unsigned-admin", {**ADMIN, "unsigned": "admin"},
     ("error", "3010", "AccountNotSigner")),
    ("readonly-gva", {**ADMIN, "readonly": "global_volume_accumulator"},
     ("error", "2000", "ConstraintMut")),
    ("missing-gva", {**ADMIN, "missing": ["global_volume_accumulator"]},
     ("error", "3012", "AccountNotInitialized")),
    ("gva-len-543", {**ADMIN, "mutate": "global_volume_accumulator", "length": 543},
     ("error", "3003", "AccountDidNotDeserialize")),
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def conv(snap):
    out = {}
    for k, v in snap.items():
        out[k] = None if v is None else {
            "owner": v["owner"], "lamports": v["lamports"], "data_hex": v["data"]}
    return out


def parse_gva(entry):
    if entry is None:
        return {"gva_len": None, "start": None, "end": None, "period": None,
                "mint": None, "supplies": None, "volumes": None}
    data = bytes.fromhex(entry["data_hex"])
    if len(data) < 544:
        return {"gva_len": len(data), "start": None, "end": None, "period": None,
                "mint": None, "supplies": None, "volumes": None}
    start, end, period = struct.unpack_from("<qqq", data, 8)
    return {"gva_len": len(data), "start": start, "end": end, "period": period,
            "mint": data[32:64].hex(),
            "supplies": list(struct.unpack_from("<30Q", data, 64)),
            "volumes": list(struct.unpack_from("<30Q", data, 304))}


def ata_amount(entry):
    if entry is None:
        return None
    data = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", data, 64)[0] if len(data) >= 72 else None


receipts_global = []
report_cases = []
for index, (label, case, expected) in enumerate(CASES):
    row = {"case": {"instruction": "admin_update_token_incentives", "label": label,
                    "params": case, "expected": list(expected)}}
    seen = set()
    token = TOKEN22 if case.get("token22") else TOKEN
    ga_key = str(Pubkey.find_program_address(
        [bytes(G), bytes(token), bytes(MINT)], ATA)[0])
    for image in ("original", "control", "candidate"):
        r = run(case) if image == "original" else run(case, str(IMAGES[image]))
        raw = base64.b64decode(r["transaction_base64"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == 1, (label, image, checks)
        before, after = conv(r["before"]), conv(r["after"])
        payer_key = str(tx.message.account_keys[0])
        payer_delta = before[payer_key]["lamports"] - after[payer_key]["lamports"]
        gva_after = parse_gva(after[str(G)])
        observed = dict(gva_after)
        observed["payer_delta"] = payer_delta
        observed["ata_lamports"] = after[ga_key]["lamports"] if after.get(ga_key) else None
        observed["ata_amount"] = ata_amount(after.get(ga_key))
        if case.get("wrong_mint"):
            observed["mint_before"] = parse_gva(before[str(G)])["mint"]
        err = r["error"]
        logs = r["logs"]
        if expected[0] == "ok":
            assert err is None, (label, image, err)
            assert gva_after["start"] == expected[1], (label, image, gva_after, expected)
            assert gva_after["end"] == expected[2], (label, image, gva_after, expected)
            assert gva_after["period"] == expected[3], (label, image, gva_after, expected)
            assert gva_after["supplies"] == expected[4], (label, image, gva_after, expected)
            assert gva_after["volumes"] == expected[5], (label, image, gva_after, expected)
            assert gva_after["gva_len"] == expected[6], (label, image, gva_after, expected)
            assert gva_after["mint"] == MINT_HEX, (label, image, gva_after)
            assert payer_delta == expected[7], (label, image, payer_delta, expected)
            assert any(l.startswith("Program data: ") for l in logs), (label, image, "no event")
            if label == "missing-ata":
                assert observed["ata_lamports"] == 2039280, (label, image, observed)
                assert observed["ata_amount"] == 0, (label, image, observed)
        else:
            assert err is not None and expected[1] in err, (label, image, err)
            assert expected[2] in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == 5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback")
            site = next((l for l in logs
                         if "thrown in" in l or "caused by account" in l
                         or "panicked at" in l), None)
            row.setdefault("error_sites", {})[image] = site
        seen.add((err, json.dumps(observed, sort_keys=True)))
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image,
                        "instruction": "admin_update_token_incentives",
                        "label": label},
            "transaction_base64": r["transaction_base64"],
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
            "all_signatures_verified": True, "signature_fields": 1,
            "before": before, "after": after,
            "metadata": {"signature": str(tx.signatures[0]), "logs": logs,
                         "inner_instructions": r["inner"],
                         "events": r["events"]},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                      "leader_schedule_epoch": 0,
                      "unix_timestamp": case.get("now", 10)},
            "loaded_programs": {
                "pAMM": {"path": "evidence/original/pump_amm/deployed.so",
                         "sha256": IMAGE_SHA[image]},
                "spl_token": {"path": "evidence/dependencies/spl_token/deployed.so",
                              "sha256": TOKEN_SHA["spl_token"]},
                "spl_token_2022": {"path": "evidence/dependencies/spl_token_2022/deployed.so",
                                   "sha256": TOKEN_SHA["spl_token_2022"]}},
            "error": err, "rollback_except_payer_fee": err is not None,
            "payer_fee_lamports": payer_delta,
            "observed": observed,
        })
        row[image] = {"error": err, "logs": logs, "observed": observed}
        print(f"  {label} [{image}] error={err} gva={gva_after} payer_delta={payer_delta}")
    assert len(seen) == 1, (label, "images must agree", seen)
    report_cases.append(row)

(OUT / "runtime").mkdir(parents=True, exist_ok=True)
lines = [json.dumps(r).encode() for r in receipts_global]
parts = []
for i in range(0, len(lines), 10):
    chunk = lines[i:i + 10]
    data = gzip.compress(b"\n".join(chunk) + b"\n", mtime=0)
    name = f"runtime/raw-transactions-part{i // 10 + 1}.jsonl.gz"
    (OUT / name).write_bytes(data)
    parts.append({"path": name, "sha256": sha(data), "receipts": len(chunk)})
    print(name, len(data), "bytes")
repo_inputs = [
    "evidence/original/pump_amm/deployed.so",
    "evidence/dependencies/spl_token/deployed.so",
    "evidence/dependencies/spl_token_2022/deployed.so",
    "scripts/pump_amm_incentives_differential.py",
    "scripts/pump_amm_admin_differential.py",
    "scripts/pump_amm_reusable_harness.py",
]
report = {"schema": 1, "packet": "amm-admin-token-incentives-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("admin_update_token_incentives on synthetic global-volume-accumulator "
                    "fixtures, fresh VM per case per image (original / #424 control / #427 "
                    "candidate). Receipts are stored as parts to stay under GitHub's 25MB "
                    "web-upload limit; verify.py reads them in order. Snapshots cover "
                    "non-executable accounts only."),
          "image_sha256": IMAGE_SHA,
          "cases": report_cases,
          "counts": {"vms": len(receipts_global),
                     "transactions": len(receipts_global),
                     "signature_fields": len(receipts_global)},
          "input_sha256": {n: sha((ROOT / n).read_bytes()) for n in repo_inputs},
          "transaction_receipts": {"parts": parts}}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(json.dumps(report, indent=1).encode(), mtime=0))
print(f"cases: {len(report_cases)} receipts: {len(receipts_global)}")
print(f"wrote: {OUT / 'runtime/report.json.gz'}")
