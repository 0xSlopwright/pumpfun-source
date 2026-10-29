#!/usr/bin/env python3
"""Build research/amm-claim-cashback-token22-transfer-fee-20261029 receipts.

claim_cashback under a matching Token-2022 transfer fee (2nd run
packet #24; run 2 #2 covered claim_cashback without fees, run 1
never covered this instruction):

- with a matching Token-2022 program, the claim moves the vault's
  entire balance and the recipient receives the NET amount while
  the fee is withheld into the recipient ATA's TransferFeeAmount
  extension (offset 174 u64);
- claimed increments by the GROSS vault amount, not the net
  receipt, so claimed-max still fails 6023 Overflow (site:
  original token_incentives/claim.rs:228, control/candidate
  cashback.rs:36) even under a fee;
- the event reports the GROSS amount (event layout: disc 8 +
  user 32 + amount u64 @40 + timestamp u64 @48 + claimed u64 @56
  + earned u64 @64), so reading only events overstates delivery
  under any nonzero fee;
- 100% fee still succeeds with receipt 0 (opposite of the trade
  paths' 100% errors: buy_exact 6039, non-exact buy 6023);
- caps bind the withheld amount only (tf5000-max100 -> withheld
  exactly 100);
- the fee schedule switches from older to newer exactly at the
  newer epoch (older 100bps / newer 5000bps @ epoch 10);
- a pre-existing destination without extension space fails with
  Token-2022 custom error 0xd, while one with extension space
  accumulates withheld fees; a no-fee destination needs no
  extension at all (165 bytes works);
- the vault itself needs no extension (plain 165-byte Token-2022
  vault works under every fee case);
- a Token program meta with Token-2022-owned accounts fails 2023
  ConstraintAssociatedTokenTokenProgram (AnchorError form, no
  thrown-in site);
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
from solders.account import Account
from solders.clock import Clock
from solders.instruction import AccountMeta, Instruction
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

from pump_amm_cashback_differential import DEST, U
from pump_amm_liquidity_differential import (
    EVENT, IDL, OUTSIDER, PAYER, PROGRAM, ROOT, TOKEN, TOKEN22, f, quote, token,
)
from pump_amm_reusable_harness import acquire_harness

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-claim-cashback-token22-transfer-fee-20261029"
WS = Path.home() / "workspace/slop-verify"
ATA = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
USER = OUTSIDER.pubkey()
M = 2 ** 64 - 1

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
# expected: ("ok", vault_before, dest_gain, withheld_after, claimed_after,
#            dest_len_after, event_amount)
#         | ("error", code, fragment)
CASES = [
    ("token-baseline", {"prog": "token", "amount": 100000},
     ("ok", 100000, 100000, None, 100013, 165, 100000)),
    ("token22-nofee", {"prog": "token22", "amount": 100000, "dest_ext": True, "dest_withheld": 0},
     ("ok", 100000, 100000, 0, 100013, 182, 100000)),
    ("token22-nofee-plain-dest", {"prog": "token22", "amount": 100000},
     ("ok", 100000, 100000, None, 100013, 165, 100000)),
    ("tf100", {"prog": "token22", "amount": 100000, "tf": (100, M), "dest_ext": True, "dest_withheld": 0},
     ("ok", 100000, 99000, 1000, 100013, 182, 100000)),
    ("tf5000", {"prog": "token22", "amount": 100000, "tf": (5000, M), "dest_ext": True, "dest_withheld": 0},
     ("ok", 100000, 50000, 50000, 100013, 182, 100000)),
    ("tf10000", {"prog": "token22", "amount": 100000, "tf": (10000, M), "dest_ext": True, "dest_withheld": 0},
     ("ok", 100000, 0, 100000, 100013, 182, 100000)),
    ("tf5000-max100", {"prog": "token22", "amount": 100000, "tf": (5000, 100), "dest_ext": True, "dest_withheld": 0},
     ("ok", 100000, 99900, 100, 100013, 182, 100000)),
    ("tf100-amount1000", {"prog": "token22", "amount": 1000, "tf": (100, M), "dest_ext": True, "dest_withheld": 0},
     ("ok", 1000, 990, 10, 1013, 182, 1000)),
    ("tf100-amount1", {"prog": "token22", "amount": 1, "tf": (100, M), "dest_ext": True, "dest_withheld": 0},
     ("ok", 1, 0, 1, 14, 182, 1)),
    ("tf100-amount0", {"prog": "token22", "amount": 0, "tf": (100, M), "dest_ext": True, "dest_withheld": 0},
     ("ok", 0, 0, 0, 13, 182, 0)),
    ("tf100-prewithheld", {"prog": "token22", "amount": 100000, "tf": (100, M), "dest_ext": True,
                           "dest_withheld": 1000, "dest_amount": 5000},
     ("ok", 100000, 99000, 2000, 100013, 182, 100000)),
    ("tf100-dest-noext", {"prog": "token22", "amount": 100000, "tf": (100, M)},
     ("error", "InstructionErrorCustom(13)", "custom program error: 0xd")),
    ("tf-epoch0", {"prog": "token22", "amount": 100000, "tf": (100, M), "older_bps": 100,
                   "newer_bps": 5000, "newer_epoch": 10, "epoch": 0,
                   "dest_ext": True, "dest_withheld": 0},
     ("ok", 100000, 99000, 1000, 100013, 182, 100000)),
    ("tf-epoch9", {"prog": "token22", "amount": 100000, "tf": (100, M), "older_bps": 100,
                   "newer_bps": 5000, "newer_epoch": 10, "epoch": 9,
                   "dest_ext": True, "dest_withheld": 0},
     ("ok", 100000, 99000, 1000, 100013, 182, 100000)),
    ("tf-epoch10", {"prog": "token22", "amount": 100000, "tf": (100, M), "older_bps": 100,
                    "newer_bps": 5000, "newer_epoch": 10, "epoch": 10,
                    "dest_ext": True, "dest_withheld": 0},
     ("ok", 100000, 50000, 50000, 100013, 182, 100000)),
    ("tf-epoch11", {"prog": "token22", "amount": 100000, "tf": (100, M), "older_bps": 100,
                    "newer_bps": 5000, "newer_epoch": 10, "epoch": 11,
                    "dest_ext": True, "dest_withheld": 0},
     ("ok", 100000, 50000, 50000, 100013, 182, 100000)),
    ("tf100-claimed-max", {"prog": "token22", "amount": 100000, "tf": (100, M),
                           "dest_ext": True, "dest_withheld": 0, "claimed": 2 ** 64 - 1},
     ("error", "6023", "Overflow")),
    ("tf100-claimed-maxm1-amount1", {"prog": "token22", "amount": 1, "tf": (100, M),
                                     "dest_ext": True, "dest_withheld": 0, "claimed": 2 ** 64 - 2},
     ("ok", 1, 0, 1, 2 ** 64 - 1, 182, 1)),
    ("tf100-earned-max", {"prog": "token22", "amount": 100000, "tf": (100, M),
                          "dest_ext": True, "dest_withheld": 0, "earned": 2 ** 64 - 1},
     ("ok", 100000, 99000, 1000, 100013, 182, 100000)),
    ("prog-mismatch", {"prog": "token22", "meta_prog": "token", "amount": 100000},
     ("error", "2023", "ConstraintAssociatedTokenTokenProgram")),
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def token_ext(mint, owner, amount, withheld):
    data = bytearray(165)
    data[0:32] = bytes(mint)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) + struct.pack("<HHQ", 2, 8, withheld)


def tok_amount(entry):
    if entry is None:
        return None
    data = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", data, 64)[0] if len(data) >= 72 else None


def withheld_at(entry):
    if entry is None:
        return None
    data = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", data, 174)[0] if len(data) >= 182 else None


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


def run_case(case, binary):
    h = acquire_harness(binary)
    vm = h.vm
    vm.with_sigverify(True)
    vm.set_clock(Clock(100, 1234567890, case.get("epoch", 0), 0, 1234567890))
    for pid, n in [(TOKEN, 'spl_token'), (TOKEN22, 'spl_token_2022')]:
        vm.add_program_from_file(pid, ROOT / 'evidence/dependencies' / n / 'deployed.so')
    own_prog = TOKEN22 if case["prog"] == "token22" else TOKEN
    meta_prog = TOKEN if case.get("meta_prog") == "token" else own_prog
    mint = quote
    row = f['accounts']['quote_mint']
    mint_data = base64.b64decode(row['data_base64'])
    if case.get("tf") is not None:
        bps, maxfee = case["tf"]
        older_bps = case.get("older_bps", bps)
        newer_bps = case.get("newer_bps", bps)
        newer_epoch = case.get("newer_epoch", 0)
        d = bytearray(mint_data[:82])
        d += bytes(83) + bytes([1])
        conf = bytes(72) + struct.pack("<QQH", 0, maxfee, older_bps) \
            + struct.pack("<QQH", newer_epoch, maxfee, newer_bps)
        d += struct.pack("<HH", 1, len(conf)) + conf
        mint_data = bytes(d)
    vm.set_account(mint, Account(row['lamports'], mint_data, own_prog))
    ud = hashlib.sha256(b'account:UserVolumeAccumulator').digest()[:8] + bytes(USER) \
        + struct.pack('<BQQQqBQQ', 1, 5, 7, 20, 0, 1, case.get('earned', 11), case.get('claimed', 13))
    vm.set_account(U, Account(10 ** 9, ud.ljust(137, b'\0'), PROGRAM))
    amount = case.get("amount", 100000)
    v = Pubkey.find_program_address([bytes(U), bytes(own_prog), bytes(mint)], ATA)[0]
    vm.set_account(v, Account(min(2 ** 64 - 1, amount + 2039280), token(mint, U, amount, False), own_prog))
    if case.get("dest_ext"):
        dest_data = token_ext(mint, USER, case.get("dest_amount", 0), case.get("dest_withheld", 0))
    else:
        dest_data = token(mint, USER, case.get("dest_amount", 0), False)
    vm.set_account(DEST, Account(2039280, dest_data, own_prog))
    ix = next(i for i in IDL['instructions'] if i['name'] == 'claim_cashback')
    keys = [USER, U, mint, meta_prog, v, DEST, Pubkey.default(), EVENT, PROGRAM]
    metas = [AccountMeta(k, bool(a.get('signer')), bool(a.get('writable')))
             for k, a in zip(keys, ix['accounts'])]

    def snap():
        out = {}
        for k in keys + [PAYER.pubkey()]:
            a = vm.get_account(k)
            if a is None or not a.executable:
                out[str(k)] = None if a is None else {'data': bytes(a.data).hex(),
                                                       'lamports': a.lamports, 'owner': str(a.owner)}
        return out

    before = snap()
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, bytes(ix['discriminator']), metas)],
        PAYER.pubkey(), [PAYER], vm.latest_blockhash())
    assert all(tx.verify_with_results())
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    after = snap()
    logs = meta.logs()
    events = [l for l in logs if l.startswith('Program data: ')]
    ev = None
    if events:
        raw = base64.b64decode(events[0][len('Program data: '):])
        assert len(raw) == 72, (len(raw), raw.hex())
        ev = {"amount": struct.unpack_from('<Q', raw, 40)[0],
              "timestamp": struct.unpack_from('<Q', raw, 48)[0],
              "claimed": struct.unpack_from('<Q', raw, 56)[0],
              "earned": struct.unpack_from('<Q', raw, 64)[0]}
    return {"tx": base64.b64encode(bytes(tx)).decode(),
            "error": str(r.err()) if failed else None, "logs": logs,
            "events": events, "event": ev,
            "before": conv(before), "after": conv(after),
            "vault_key": str(v), "dest_key": str(DEST), "acc_key": str(U),
            "payer_key": str(PAYER.pubkey())}


receipts_global = []
report_cases = []
for index, (label, case, expected) in enumerate(CASES):
    row = {"case": {"instruction": "claim_cashback", "label": label,
                    "params": case, "expected": list(expected)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        r = run_case(case, IMAGES[image])
        raw = base64.b64decode(r["tx"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == 1, (label, image, checks)
        before, after = r["before"], r["after"]
        payer_key = r["payer_key"]
        payer_delta = before[payer_key]["lamports"] - after[payer_key]["lamports"]
        vault_key, dest_key, acc_key = r["vault_key"], r["dest_key"], r["acc_key"]
        dest_len_after = len(bytes.fromhex(after[dest_key]["data_hex"])) if after[dest_key] else None
        observed = {
            "vault_before": tok_amount(before[vault_key]),
            "vault_after": tok_amount(after[vault_key]),
            "dest_before": tok_amount(before[dest_key]),
            "dest_after": tok_amount(after[dest_key]),
            "dest_withheld_before": withheld_at(before[dest_key]),
            "dest_withheld_after": withheld_at(after[dest_key]),
            "dest_len_after": dest_len_after,
            "claimed_before": claimed(before[acc_key]),
            "claimed_after": claimed(after[acc_key]),
            "event_count": len(r["events"]),
            "event_amount": r["event"]["amount"] if r["event"] else None,
            "event_claimed": r["event"]["claimed"] if r["event"] else None,
            "event_earned": r["event"]["earned"] if r["event"] else None,
            "payer_delta": payer_delta,
        }
        err = r["error"]
        logs = r["logs"]
        if expected[0] == "ok":
            assert err is None, (label, image, err)
            assert observed["vault_before"] == expected[1], (label, image, observed, expected)
            assert observed["vault_after"] == 0, (label, image, observed)
            assert observed["dest_after"] - observed["dest_before"] == expected[2], \
                (label, image, observed, expected)
            assert observed["dest_withheld_after"] == expected[3], (label, image, observed, expected)
            assert observed["claimed_after"] == expected[4], (label, image, observed, expected)
            assert observed["dest_len_after"] == expected[5], (label, image, observed, expected)
            assert observed["event_count"] == 1, (label, image, observed)
            assert observed["event_amount"] == expected[6], (label, image, observed, expected)
            assert observed["event_claimed"] == expected[4], (label, image, observed, expected)
            assert observed["event_earned"] == case.get("earned", 11), (label, image, observed)
            assert payer_delta == 5000, (label, image, payer_delta)
        else:
            assert err is not None and expected[1] in err, (label, image, err)
            assert expected[2] in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == 5000, (label, image, payer_delta)
            assert observed["event_count"] == 0, (label, image, observed)
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
                         "inner_instructions": [], "events": r["events"]},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890,
                      "epoch": case.get("epoch", 0),
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
report = {"schema": 1, "packet": "amm-claim-cashback-token22-transfer-fee-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("claim_cashback on synthetic user-volume-accumulator fixtures "
                    "with a matching Token-2022 transfer-fee extension on the "
                    "quote mint, fresh VM per case per image (original / #424 "
                    "control / #427 candidate). Receipts are stored as parts "
                    "to stay under GitHub's 25MB web-upload limit; verify.py "
                    "reads them in order. Snapshots cover non-executable "
                    "accounts only."),
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
