#!/usr/bin/env python3
"""Build research/amm-extend-account-20261029 receipts.

extend_account, pinned at runtime (2nd run packet #1; run 1 never
covered this instruction):
- only four account discriminators are recognized, each with an
  exact target size: Pool -> 301, GlobalConfig -> 949,
  UserVolumeAccumulator -> 137, GlobalVolumeAccumulator -> 600;
- a truncated account is realloc'd to its target and funded with
  the rent delta (observed delta = (target - current) * 6960
  lamports, paid by the user through a System transfer);
- an account already at or above its target is a no-op success;
- the pre-existing body bytes are preserved and the new tail is
  zero-filled;
- any other discriminator (FeeConfig, SharingConfig, BondingCurve)
  or data shorter than 8 bytes fails 6027 AccountTypeNotSupported;
- a non-program-owned target fails 2004 ConstraintOwner, a
  read-only target fails 2000 ConstraintMut, an unsigned user
  fails 3010 AccountNotSigner, and instruction data shorter than
  the 8-byte discriminator fails 101 InstructionFallbackNotFound;
- all three images (original / #424 control / #427 candidate)
  agree on every case: this packet pins behavior, it does not
  claim a divergence.
"""
import base64
import gzip
import hashlib
import json
import sys
from pathlib import Path

import os
sys.path.insert(0, str(Path.home() / "workspace/pumpfun-sparse/scripts"))
os.chdir(Path.home() / "workspace/pumpfun-sparse")
from solders.account import Account
from solders.clock import Clock
from solders.instruction import AccountMeta, Instruction
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

from pump_amm_admin_differential import OUTSIDER
from pump_amm_liquidity_differential import (
    EVENT, IDL, PAYER, PROGRAM, TOKEN, acquire_harness, meta_mutation, mutate,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-extend-account-20261029"
WS = Path.home() / "workspace/slop-verify"
TARGET = Pubkey.from_bytes(bytes([91]) * 32)
SYSTEM = Pubkey.default()

IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {
    "original": "6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7",
    "control": "7a300434dced61413bde10788594b427d5649563e0223efcf09e6b214aff7ad3",
    "candidate": "d17a657baf5cc19736a924c41e75424604411ddbe9f6e72cddf41ab72a695007",
}
FEES_SHA = hashlib.sha256((ROOT / "evidence/original/pump_fees/deployed.so").read_bytes()).hexdigest()

# (label, kind, size, lamports, override, payload_length, expected)
# override: None | ("owner", owner) | ("readonly",) | ("unsigned",) | ("body", bytes)
# expected: ("extend", new_size, new_lamports[, "body", body_hex])
#         | ("error", code, fragment)
CASES = [
    ("pool-truncated-8", "Pool", 8, 10**9, None, None, ("extend", 301, 1002039280)),
    ("pool-truncated-300", "Pool", 300, 10**9, None, None, ("extend", 301, 1000006960)),
    ("pool-at-target", "Pool", 301, 10**9, None, None, ("extend", 301, 10**9)),
    ("pool-above-target", "Pool", 302, 10**9, None, None, ("extend", 302, 10**9)),
    ("config-truncated-100", "GlobalConfig", 100, 10**9, None, None, ("extend", 949, 1005909040)),
    ("config-at-target", "GlobalConfig", 949, 10**9, None, None, ("extend", 949, 10**9)),
    ("useracc-truncated-50", "UserVolumeAccumulator", 50, 10**9, None, None, ("extend", 137, 1000605520)),
    ("globalvol-truncated-100", "GlobalVolumeAccumulator", 100, 10**9, None, None, ("extend", 600, 1003480000)),
    ("globalvol-at-target", "GlobalVolumeAccumulator", 600, 10**9, None, None, ("extend", 600, 10**9)),
    ("feeconfig-unknown", "FeeConfig", 100, 10**9, None, None, ("error", "6027", "AccountTypeNotSupported")),
    ("sharing-unknown", "SharingConfig", 100, 10**9, None, None, ("error", "6027", "AccountTypeNotSupported")),
    ("pool-short-7", "Pool", 7, 10**9, None, None, ("error", "6027", "AccountTypeNotSupported")),
    ("pool-empty-0", "Pool", 0, 10**9, None, None, ("error", "6027", "AccountTypeNotSupported")),
    ("pool-owner-token", "Pool", 100, 10**9, ("owner", TOKEN), None, ("error", "2004", "ConstraintOwner")),
    ("pool-readonly", "Pool", 100, 10**9, ("readonly",), None, ("error", "2000", "ConstraintMut")),
    ("pool-unsigned", "Pool", 8, 10**9, ("unsigned",), None, ("error", "3010", "AccountNotSigner")),
    ("pool-payload-4", "Pool", 8, 10**9, None, 4, ("error", "101", "InstructionFallbackNotFound")),
    ("pool-body-preserved", "Pool", 50, 10**9, ("body", b"\xff" * 16), None,
     ("extend", 301, 1001746960, "body", "ff" * 16)),
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        if a is None or a.executable:
            out[str(k)] = None
        else:
            out[str(k)] = {"owner": str(a.owner), "lamports": a.lamports,
                           "executable": a.executable, "data_hex": a.data.hex()}
    return out


receipts_global = []
report_cases = []
for index, (label, kind, size, lamports, override, payload_length, expected) in enumerate(CASES):
    disc = bytes(next(x for x in IDL["accounts"] if x["name"] == kind)["discriminator"])
    ix = next(x for x in IDL["instructions"] if x["name"] == "extend_account")
    row = {"case": {"instruction": "extend_account", "label": label, "kind": kind,
                    "size": size, "lamports": lamports,
                    "override": ([override[0], str(override[1])] if override and override[0] == "owner"
                                 else [override[0]] if override else None),
                    "payload_length": payload_length,
                    "expected": list(expected)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        h = acquire_harness(IMAGES[image])
        vm = h.vm
        vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
        data = (disc + bytes(max(0, size - 8)))[:size]
        vm.set_account(TARGET, Account(lamports, data, PROGRAM))
        metas = [AccountMeta(TARGET, False, True),
                 AccountMeta(PAYER.pubkey(), True, True),
                 AccountMeta(SYSTEM, False, False),
                 AccountMeta(EVENT, False, False),
                 AccountMeta(PROGRAM, False, False)]
        fee_payer, fee_signer = PAYER.pubkey(), PAYER
        if override is not None:
            if override[0] == "owner":
                mutate(TARGET, 0, b"", owner=override[1])(h, metas)
            elif override[0] == "readonly":
                meta_mutation(0, "readonly")(h, metas)
            elif override[0] == "unsigned":
                metas[1] = AccountMeta(PAYER.pubkey(), False, True)
                fee_payer, fee_signer = OUTSIDER.pubkey(), OUTSIDER
            elif override[0] == "body":
                mutate(TARGET, 8, override[1])(h, metas)
        ix_data = bytes(ix["discriminator"])
        if payload_length is not None:
            ix_data = ix_data[:payload_length]
        snap_keys = sorted({str(m.pubkey) for m in metas} | {str(fee_payer)}, key=str)
        before = snap(vm, [Pubkey.from_string(k) for k in snap_keys])
        tx = Transaction.new_signed_with_payer(
            [Instruction(PROGRAM, ix_data, metas)], fee_payer, [fee_signer],
            vm.latest_blockhash())
        raw_tx = bytes(tx)
        checks = tx.verify_with_results()
        assert checks and all(checks), "new transaction must verify"
        r = vm.send_transaction(tx)
        failed = isinstance(r, FailedTransactionMetadata)
        meta = r.meta() if failed else r
        after = snap(vm, [Pubkey.from_string(k) for k in snap_keys])
        err = str(r.err()) if failed else None
        logs = meta.logs()
        payer_key = str(fee_payer)
        payer_delta = before[payer_key]["lamports"] - after[payer_key]["lamports"]
        target_key = str(TARGET)
        before_target = before[target_key]
        after_target = after[target_key]
        observed = {"size_before": len(bytes.fromhex(before_target["data_hex"])) if before_target else None,
                    "size_after": len(bytes.fromhex(after_target["data_hex"])) if after_target else None,
                    "lamports_before": before_target["lamports"] if before_target else None,
                    "lamports_after": after_target["lamports"] if after_target else None}
        if expected[0] == "extend":
            assert not failed and err is None, (label, image, err)
            assert observed["size_after"] == expected[1], (label, image, observed, expected)
            assert observed["lamports_after"] == expected[2], (label, image, observed, expected)
            assert payer_delta == 5000 + (observed["lamports_after"] - observed["lamports_before"]), \
                (label, image, payer_delta, observed)
            if len(expected) > 3 and expected[3] == "body":
                after_data = bytes.fromhex(after_target["data_hex"])
                assert after_data[8:24].hex() == expected[4], (label, image, after_data[8:24].hex())
                assert all(b == 0 for b in after_data[24:]), (label, image, "tail not zero")
                observed["body_preserved"] = True
                observed["tail_zero"] = True
        else:
            assert failed and err is not None and expected[1] in err, (label, image, err)
            assert expected[2] in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == 5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback")
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            row.setdefault("error_sites", {})[image] = site
        seen.add((err, observed["size_after"], observed["lamports_after"],
                  tuple(sorted(observed.items())) if expected[0] == "extend" and len(expected) > 3 else None))
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": "extend_account",
                        "label": label},
            "transaction_base64": base64.b64encode(raw_tx).decode(),
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw_tx),
            "all_signatures_verified": True, "signature_fields": 1,
            "before": before, "after": after,
            "metadata": {"signature": str(meta.signature()), "logs": logs,
                         "inner_instructions": str(meta.inner_instructions()),
                         "return_data": str(meta.return_data())},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                      "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
            "loaded_programs": {
                "pAMM": {"path": "evidence/original/pump_amm/deployed.so",
                         "sha256": IMAGE_SHA[image]},
                "pFEES": {"path": "evidence/original/pump_fees/deployed.so",
                          "sha256": FEES_SHA}},
            "error": err, "rollback_except_payer_fee": err is not None,
            "payer_fee_lamports": payer_delta,
            "observed": observed,
        })
        row[image] = {"error": err, "logs": logs,
                      "accounts": {k: v for k, v in after.items()},
                      "observed": observed}
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
    "scripts/pump_amm_extend_differential.py",
    "scripts/pump_amm_liquidity_differential.py",
    "scripts/pump_amm_admin_differential.py",
    "scripts/pump_amm_reusable_harness.py",
]
report = {"schema": 1, "packet": "amm-extend-account-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("extend_account on synthetic program-owned accounts, "
                    "fresh VM per case per image (original / #424 control / #427 candidate). "
                    "Receipts are stored as parts to stay under GitHub's 25MB web-upload limit; "
                    "verify.py reads them in order. Snapshots cover non-executable accounts only; "
                    "the program account itself is executable and excluded."),
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
