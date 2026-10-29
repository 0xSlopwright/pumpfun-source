#!/usr/bin/env python3
"""Build research/amm-claim-token-incentives-20261029 receipts.

claim_token_incentives, pinned at runtime (2nd run packet #4; run 1
never covered it, 2nd #2 covered the sibling claim_cashback and 2nd
#3 the admin updater, not the claim side):
- reset: now < start and last < start zeroes total_claimed and clears
  has_total_claimed_tokens (base case: claimed 7 -> 0, then the 5-token
  claim lands as 5); last >= start skips the reset (claimed 7 -> 12);
  the stored user field is overwritten with the caller's key even
  when it held another key;
- reward: previous_day < today, previous_day <= end_day,
  sol_volumes[previous_day] > 0 and current_sol_volume > 0, reward =
  volume * total_token_supply[previous_day] / sol_volumes[previous_day]
  with integer floor (3 * 1000 / 7 = 428); reward accrues even after
  end_time when previous_day <= end_day, and not when previous_day
  is past end_day or equals today, or when the previous bucket volume
  is zero; period 0 skips the whole update block;
- zero claim: amount 0 logs "No tokens to claim" and succeeds with
  no transfer, but still advances last_update_timestamp (21) and
  recomputes needs_claim;
- transfer path always stamps last_update_timestamp and sets
  needs_claim = current_sol_volume > 0 after the transfer, so
  after-end and same-day claims also move last to now;
- panics (ProgramFailedToComplete, full rollback except the 5000
  fee): sol_volumes[today] with today >= 30 indexes out of bounds
  (volume_accumulator.rs:391:43, "the len is 30 but the index is 30")
  whether or not a reward was computed; stored end < start panics
  "end_time should be bigger than start_time" (:387:14); unclaimed
  checked_add panics "Unexpected overflow" (:109:14); total_claimed
  checked_add unwrap panics "called `Option::unwrap()` on a `None`
  value" (:137:14);
- errors: reward overflow -> Truncation 6024; stored foreign mint ->
  InvalidIncentiveMint 6038 (has_one on global_volume_accumulator);
  vault short -> Token program custom 1 (insufficient funds);
  missing vault / user accumulator / global accumulator -> 3012
  AccountNotInitialized; unsigned payer -> 3010 (fee paid by
  OUTSIDER); readonly accumulator / user ATA / vault -> 2000
  ConstraintMut; wrong user key -> 2015 ConstraintTokenOwner
  (user ATA authority mismatch); wrong accumulator key -> 2006
  ConstraintSeeds; 89-byte accumulator / 543-byte global accumulator
  -> 3003 AccountDidNotDeserialize; 164-byte token accounts and
  81-byte mint -> InvalidAccountData;
- a missing user ATA is created by init_if_needed: payer delta
  2044280 = 5000 fee + 2039280 rent, then the claim lands in it;
  Token-2022 program accounts work;
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

from pump_amm_incentives_differential import run, G, U, MINT, TOKEN, TOKEN22, ATA
from pump_amm_admin_differential import PAYER, OUTSIDER

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-claim-token-incentives-20261029"
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
MAX = 2**64 - 1


def sha(data):
    return hashlib.sha256(data).hexdigest()


def conv(snap):
    out = {}
    for k, v in snap.items():
        out[k] = None if v is None else {
            "owner": v["owner"], "lamports": v["lamports"], "data_hex": v["data"]}
    return out


def parse_uva(entry):
    if entry is None:
        return {"uva_len": None, "user": None, "needs": None, "unclaimed": None,
                "claimed": None, "volume": None, "last": None, "has_claimed": None}
    data = bytes.fromhex(entry["data_hex"])
    if len(data) < 90:
        return {"uva_len": len(data), "user": None, "needs": None, "unclaimed": None,
                "claimed": None, "volume": None, "last": None, "has_claimed": None}
    needs, unclaimed, claimed, volume, last, hasc, _, _ = struct.unpack_from(
        "<BQQQqBQQ", data, 40)
    return {"uva_len": len(data), "user": data[8:40].hex(), "needs": needs,
            "unclaimed": unclaimed, "claimed": claimed, "volume": volume,
            "last": last, "has_claimed": hasc}


def ata_amount(entry):
    if entry is None:
        return None
    data = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", data, 64)[0] if len(data) >= 72 else None


CLAIM = {"instruction": "claim_token_incentives"}
# ok: ("ok", needs, unclaimed, claimed, volume, last, has_claimed,
#      vault_amt, user_amt, payer_delta)
CASES = [
    ("base-before-start", {**CLAIM},
     ("ok", 1, 0, 5, 20, 10, 1, 999999995, 22, 5000)),
    ("reward-day", {**CLAIM, "now": 21, "last": 20},
     ("ok", 0, 0, 212, 0, 21, 1, 999999795, 222, 5000)),
    ("zero-claim", {**CLAIM, "now": 21, "last": 20, "unclaimed": 0, "volume": 0},
     ("ok", 0, 0, 7, 0, 21, 1, 1000000000, 17, 5000)),
    ("reward-only-unclaimed-0", {**CLAIM, "now": 21, "last": 20,
                                 "unclaimed": 0, "volume": 20},
     ("ok", 0, 0, 207, 0, 21, 1, 999999800, 217, 5000)),
    ("period-0", {**CLAIM, "now": 21, "last": 20, "period": 0},
     ("ok", 1, 0, 12, 20, 21, 1, 999999995, 22, 5000)),
    ("after-end-reward", {**CLAIM, "now": 60, "last": 20},
     ("ok", 0, 0, 212, 0, 60, 1, 999999795, 222, 5000)),
    ("prev-after-end", {**CLAIM, "now": 60, "last": 50},
     ("ok", 1, 0, 12, 20, 60, 1, 999999995, 22, 5000)),
    ("same-day", {**CLAIM, "now": 21, "last": 21},
     ("ok", 1, 0, 12, 20, 21, 1, 999999995, 22, 5000)),
    ("zero-prev-volume", {**CLAIM, "now": 21, "last": 20, "volumes": [0] * 30},
     ("ok", 1, 0, 12, 20, 21, 1, 999999995, 22, 5000)),
    ("start-boundary", {**CLAIM, "now": 20, "last": 20},
     ("ok", 1, 0, 12, 20, 20, 1, 999999995, 22, 5000)),
    ("reset-skip", {**CLAIM, "now": 10, "last": 25},
     ("ok", 1, 0, 12, 20, 10, 1, 999999995, 22, 5000)),
    ("stored-other-user", {**CLAIM, "stored_other_user": True},
     ("ok", 1, 0, 5, 20, 10, 1, 999999995, 22, 5000)),
    ("token22-reward", {**CLAIM, "token22": True, "now": 21, "last": 20},
     ("ok", 0, 0, 212, 0, 21, 1, 999999795, 222, 5000)),
    ("missing-user-ata", {**CLAIM, "missing": ["user_ata"]},
     ("ok", 1, 0, 5, 20, 10, 1, 999999995, 5, 2044280)),
    ("period-10-reward", {**CLAIM, "period": 10, "now": 30, "last": 20},
     ("ok", 0, 0, 212, 0, 30, 1, 999999795, 222, 5000)),
    ("end-boundary-today", {**CLAIM, "now": 49, "last": 20},
     ("ok", 0, 0, 212, 0, 49, 1, 999999795, 222, 5000)),
    ("reward-ratio", {**CLAIM, "now": 21, "last": 20, "volume": 50,
                      "supplies": [3000] * 30, "volumes": [200] * 30},
     ("ok", 0, 0, 762, 0, 21, 1, 999999245, 772, 5000)),
    ("reward-floor", {**CLAIM, "now": 21, "last": 20, "volume": 3,
                      "supplies": [1000] * 30, "volumes": [7] * 30},
     ("ok", 0, 0, 440, 0, 21, 1, 999999567, 450, 5000)),
    ("today-oob-reward", {**CLAIM, "now": 50, "last": 20, "end": 100},
     ("error", "ProgramFailedToComplete",
      "index out of bounds: the len is 30 but the index is 30")),
    ("today-oob-noreward", {**CLAIM, "now": 50, "last": 0, "end": 100},
     ("error", "ProgramFailedToComplete",
      "index out of bounds: the len is 30 but the index is 30")),
    ("end-inverted", {**CLAIM, "now": 21, "last": 20, "end": 10},
     ("error", "ProgramFailedToComplete",
      "end_time should be bigger than start_time")),
    ("truncation", {**CLAIM, "now": 21, "last": 20, "volume": MAX,
                    "supplies": [MAX] * 30, "volumes": [1] * 30},
     ("error", "6024", "Truncation")),
    ("unclaimed-overflow", {**CLAIM, "now": 21, "last": 20, "unclaimed": MAX},
     ("error", "ProgramFailedToComplete", "Unexpected overflow")),
    ("claimed-overflow", {**CLAIM, "now": 21, "last": 20, "volume": 0,
                          "claimed": MAX},
     ("error", "ProgramFailedToComplete",
      "called `Option::unwrap()` on a `None` value")),
    ("wrong-mint", {**CLAIM, "wrong_mint": True},
     ("error", "6038", "InvalidIncentiveMint")),
    ("vault-short", {**CLAIM, "vault_amount": 4},
     ("error", "InstructionErrorCustom(1)", "custom program error: 0x1")),
    ("missing-vault", {**CLAIM, "missing": ["global_incentive_token_account"]},
     ("error", "3012", "AccountNotInitialized")),
    ("missing-uva", {**CLAIM, "missing": ["user_volume_accumulator"]},
     ("error", "3012", "AccountNotInitialized")),
    ("missing-gva", {**CLAIM, "missing": ["global_volume_accumulator"]},
     ("error", "3012", "AccountNotInitialized")),
    ("unsigned-payer", {**CLAIM, "unsigned": "payer"},
     ("error", "3010", "AccountNotSigner")),
    ("readonly-uva", {**CLAIM, "readonly": "user_volume_accumulator"},
     ("error", "2000", "ConstraintMut")),
    ("readonly-user-ata", {**CLAIM, "readonly": "user_ata"},
     ("error", "2000", "ConstraintMut")),
    ("readonly-vault", {**CLAIM, "readonly": "global_incentive_token_account"},
     ("error", "2000", "ConstraintMut")),
    ("wrong-user", {**CLAIM, "wrong_account": "user"},
     ("error", "2015", "ConstraintTokenOwner")),
    ("wrong-uva", {**CLAIM, "wrong_account": "user_volume_accumulator"},
     ("error", "2006", "ConstraintSeeds")),
    ("uva-len-89", {**CLAIM, "mutate": "user_volume_accumulator", "length": 89},
     ("error", "3003", "AccountDidNotDeserialize")),
    ("gva-len-543", {**CLAIM, "mutate": "global_volume_accumulator", "length": 543},
     ("error", "3003", "AccountDidNotDeserialize")),
    ("user-ata-len-164", {**CLAIM, "mutate": "user_ata", "length": 164},
     ("error", "InvalidAccountData", "InvalidAccountData")),
    ("vault-len-164", {**CLAIM, "mutate": "global_incentive_token_account",
                       "length": 164},
     ("error", "InvalidAccountData", "InvalidAccountData")),
    ("mint-len-81", {**CLAIM, "mutate": "mint", "length": 81},
     ("error", "InvalidAccountData", "InvalidAccountData")),
]

receipts_global = []
report_cases = []
for index, (label, case, expected) in enumerate(CASES):
    row = {"case": {"instruction": "claim_token_incentives", "label": label,
                    "params": case, "expected": list(expected)}}
    seen = set()
    token = TOKEN22 if case.get("token22") else TOKEN
    ga_key = str(Pubkey.find_program_address(
        [bytes(G), bytes(token), bytes(MINT)], ATA)[0])
    ua_key = str(Pubkey.find_program_address(
        [bytes(OUTSIDER.pubkey()), bytes(token), bytes(MINT)], ATA)[0])
    for image in ("original", "control", "candidate"):
        r = run(case) if image == "original" else run(case, str(IMAGES[image]))
        raw = base64.b64decode(r["transaction_base64"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == 1, (label, image, checks)
        before, after = conv(r["before"]), conv(r["after"])
        payer_key = str(tx.message.account_keys[0])
        payer_delta = before[payer_key]["lamports"] - after[payer_key]["lamports"]
        uva_after = parse_uva(after[str(U)])
        observed = dict(uva_after)
        observed["vault_amt"] = ata_amount(after.get(ga_key))
        observed["user_amt"] = ata_amount(after.get(ua_key))
        observed["vault_lamports"] = after[ga_key]["lamports"] if after.get(ga_key) else None
        observed["user_lamports"] = after[ua_key]["lamports"] if after.get(ua_key) else None
        observed["payer_delta"] = payer_delta
        err = r["error"]
        logs = r["logs"]
        if expected[0] == "ok":
            assert err is None, (label, image, err)
            assert uva_after["needs"] == expected[1], (label, image, uva_after, expected)
            assert uva_after["unclaimed"] == expected[2], (label, image, uva_after, expected)
            assert uva_after["claimed"] == expected[3], (label, image, uva_after, expected)
            assert uva_after["volume"] == expected[4], (label, image, uva_after, expected)
            assert uva_after["last"] == expected[5], (label, image, uva_after, expected)
            assert uva_after["has_claimed"] == expected[6], (label, image, uva_after, expected)
            assert observed["vault_amt"] == expected[7], (label, image, observed, expected)
            assert observed["user_amt"] == expected[8], (label, image, observed, expected)
            assert payer_delta == expected[9], (label, image, payer_delta, expected)
            assert uva_after["uva_len"] == 137, (label, image, uva_after)
            if label == "stored-other-user":
                assert uva_after["user"] == USER_HEX, (label, image, uva_after)
            if label == "missing-user-ata":
                assert observed["user_lamports"] == 2039280, (label, image, observed)
            if label != "zero-claim":
                assert any(l.startswith("Program data: ") for l in logs), (label, image, "no event")
            else:
                assert any("No tokens to claim" in l for l in logs), (label, image, "no no-claim log")
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
                        "instruction": "claim_token_incentives",
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
        print(f"  {label} [{image}] error={err} uva={uva_after} vault={observed['vault_amt']} user={observed['user_amt']} payer_delta={payer_delta}")
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
report = {"schema": 1, "packet": "amm-claim-token-incentives-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("claim_token_incentives on synthetic user-volume-accumulator "
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
