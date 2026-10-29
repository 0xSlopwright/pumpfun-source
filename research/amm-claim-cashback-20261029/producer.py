#!/usr/bin/env python3
"""Build research/amm-claim-cashback-20261029 receipts.

claim_cashback, pinned at runtime (2nd run packet #2; run 1 never
covered this instruction):
- the claim moves the ENTIRE wsol balance of the accumulator's
  token account to the user's token account, then
  total_cashback_claimed += amount (checked);
- amount 0 succeeds with no movement; earned is reported in the
  event only and never gates the transfer;
- claimed + amount overflowing u64 fails 6023 Overflow (site:
  original token_incentives/claim.rs:228, control/candidate
  cashback.rs:36), everything else rolls back;
- the accumulator deserializes at >= 90 bytes (89 fails 3003
  AccountDidNotDeserialize, 90 succeeds) even though extend
  targets 137 bytes;
- the stored user field inside the accumulator is NOT re-checked:
  a stored-other-user accumulator still claims fine;
- the vault account IS ATA-bound (substitution fails 2009
  ConstraintAssociated) but the destination is NOT: any token
  account with matching mint + user authority accepts the claim;
- Token-2022 vaults and base-mint (non-native) vaults claim fine;
- readonly vault/accumulator fail 2000 ConstraintMut, a
  non-PDA accumulator fails 2006 ConstraintSeeds;
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

from pump_amm_cashback_differential import DEST, U, run
from pump_amm_liquidity_differential import PAYER

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-claim-cashback-20261029"
WS = Path.home() / "workspace/slop-verify"
SUB_KEY = Pubkey.from_bytes(bytes([238]) * 32)

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

# (label, case-dict, expected)
# expected: ("ok", vault_amount, dest_gain, claimed_after)
#         | ("error", code, fragment)
CASES = [
    ("base", {}, ("ok", 1000, 1000, 1013)),
    ("amount-0", {"amount": 0}, ("ok", 0, 0, 13)),
    ("amount-1e12", {"amount": 10**12}, ("ok", 10**12, 10**12, 1000000000013)),
    ("claimed-maxm1-amount1", {"claimed": 2**64 - 2, "amount": 1},
     ("ok", 1, 1, 2**64 - 1)),
    ("claimed-max-amount1", {"claimed": 2**64 - 1, "amount": 1},
     ("error", "6023", "Overflow")),
    ("claimed-max-amount0", {"claimed": 2**64 - 1, "amount": 0},
     ("ok", 0, 0, 2**64 - 1)),
    ("earned-max", {"earned": 2**64 - 1}, ("ok", 1000, 1000, 1013)),
    ("token22", {"token22": True}, ("ok", 1000, 1000, 1013)),
    ("non-native-base", {"non_native": True}, ("ok", 1000, 1000, 1013)),
    ("stored-other-user", {"stored_other_user": True}, ("ok", 1000, 1000, 1013)),
    ("acc-len-89", {"mutate_index": 1, "length": 89},
     ("error", "3003", "AccountDidNotDeserialize")),
    ("acc-len-90", {"mutate_index": 1, "length": 90}, ("ok", 1000, 1000, 1013)),
    ("readonly-vault", {"readonly": 4}, ("error", "2000", "ConstraintMut")),
    ("wrong-acc", {"wrong_index": 1}, ("error", "2006", "ConstraintSeeds")),
    ("wrong-vault", {"wrong_index": 4}, ("error", "2009", "ConstraintAssociated")),
    ("wrong-dest", {"wrong_index": 5}, ("ok", 1000, 1000, 1013)),
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def tok_amount(entry):
    if entry is None:
        return None
    data = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", data, 64)[0] if len(data) >= 72 else None


def claimed(entry):
    if entry is None:
        return None
    data = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", data, 82)[0] if len(data) >= 90 else None


def conv(snap):
    out = {}
    for k, v in snap.items():
        out[k] = None if v is None else {
            "owner": v["owner"], "lamports": v["lamports"], "data_hex": v["data"]}
    return out


receipts_global = []
report_cases = []
for index, (label, case, expected) in enumerate(CASES):
    row = {"case": {"instruction": "claim_cashback", "label": label,
                    "params": case, "expected": list(expected)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        r = run(case) if image == "original" else run(case, str(IMAGES[image]))
        raw = base64.b64decode(r["tx"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == 1, (label, image, checks)
        before, after = conv(r["before"]), conv(r["after"])
        payer_key = str(PAYER.pubkey())
        payer_delta = before[payer_key]["lamports"] - after[payer_key]["lamports"]
        # vault: substituted key on wrong-vault, else the token account owned by U.
        if case.get("wrong_index") == 4:
            vault_key = str(SUB_KEY)
        else:
            vault_key = next(k for k, v in before.items()
                             if v is not None and len(bytes.fromhex(v["data_hex"])) == 165
                             and bytes.fromhex(v["data_hex"])[32:64] == bytes(U))
        # dest: substituted key on wrong-dest, else DEST.
        dest_key = str(SUB_KEY) if case.get("wrong_index") == 5 else str(DEST)
        acc_key = str(U)
        observed = {
            "vault_before": tok_amount(before[vault_key]),
            "vault_after": tok_amount(after[vault_key]),
            "dest_before": tok_amount(before[dest_key]),
            "dest_after": tok_amount(after[dest_key]),
            "claimed_before": claimed(before[acc_key]),
            "claimed_after": claimed(after[acc_key]),
        }
        err = r["error"]
        logs = r["logs"]
        if expected[0] == "ok":
            assert err is None, (label, image, err)
            assert observed["vault_before"] == expected[1], (label, image, observed, expected)
            assert observed["vault_after"] == 0, (label, image, observed)
            assert observed["dest_after"] - observed["dest_before"] == expected[2], \
                (label, image, observed, expected)
            assert observed["claimed_after"] == expected[3], (label, image, observed, expected)
            assert payer_delta == 5000, (label, image, payer_delta)
            assert any(l.startswith("Program data: ") for l in logs), (label, image, "no event")
        else:
            assert err is not None and expected[1] in err, (label, image, err)
            assert expected[2] in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == 5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback")
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            row.setdefault("error_sites", {})[image] = site
        seen.add((err, tuple(sorted((k, str(v)) for k, v in observed.items()))))
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": "claim_cashback",
                        "label": label},
            "transaction_base64": r["tx"],
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
            "all_signatures_verified": True, "signature_fields": 1,
            "before": before, "after": after,
            "metadata": {"signature": str(tx.signatures[0]), "logs": logs,
                         "inner_instructions": r["inner"],
                         "events": r["events"]},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                      "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
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
        print(f"  {label} [{image}] error={err} observed={observed}")
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
    "scripts/pump_amm_cashback_differential.py",
    "scripts/pump_amm_liquidity_differential.py",
    "scripts/pump_amm_reusable_harness.py",
]
report = {"schema": 1, "packet": "amm-claim-cashback-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("claim_cashback on synthetic user-volume-accumulator fixtures, "
                    "fresh VM per case per image (original / #424 control / #427 candidate). "
                    "Receipts are stored as parts to stay under GitHub's 25MB web-upload limit; "
                    "verify.py reads them in order. Snapshots cover non-executable accounts only."),
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
