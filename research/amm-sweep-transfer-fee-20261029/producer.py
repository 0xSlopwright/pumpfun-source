#!/usr/bin/env python3
"""Build research/amm-sweep-transfer-fee-20261029 receipts.

Fee sweeps CAN move Token-2022 quote fees when the caller passes the
matching Token-2022 program -- the #48 packet's IncorrectProgramId
only shows when the Token program is passed for Token-2022 accounts
(the mirror control case is included here). With the matching
program, the sweep moves the full accrued amount out of the vault,
the recipient ATA gains the net amount, the fee is withheld into
the recipient ATA's TransferFeeAmount extension, the pool fee field
is zeroed regardless, and the SweepPoolFeeEvent still reports the
gross amount. A 100% fee succeeds with zero delivery. Caps bind the
withheld amount only. The fee schedule switches from the older to
the newer schedule exactly at the newer epoch. A pre-existing
destination without extension space fails with Token-2022 custom
error 0xd, while one with extension space accumulates withheld
fees. A zero fee bucket is a silent no-op (no ATA, no event).
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

from pump_amm_admin_differential import Harness
from pump_amm_liquidity_differential import (
    CONFIG, CONFIG_KEY, EVENT, IDL, OUTSIDER, PAYER, PROGRAM, RAW, TOKEN, TOKEN22,
    base, f, pool, poolraw, quote, vaultquote,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-sweep-transfer-fee-20261029"
WS = Path.home() / "workspace/slop-verify"
ATA = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')

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
M = 2 ** 64 - 1

# (instruction, label, mode, epoch, expected)
# mode: ("token",) | ("token22-nofee",) | ("tf", bps, maxfee)
#     | ("epoch", older_bps, newer_bps, newer_epoch) | ("mismatch",)
#     | ("zero",) | ("preata-withheld",) | ("preata-noext",)
# expected: ("sweep", ata_amount, vault_spent, fee_left, withheld_or_None,
#            payer_delta, event_amount, event_bucket, ata_len)
#         | ("noop", payer_delta)
#         | ("error", code_in_err, fragment_in_logs)
CASES = [
    ("sweep_protocol_fee", "proto-token-baseline", ("token",), 0,
     ("sweep", 2488, 2488, 0, None, 2044280, 2488, 0, 165)),
    ("sweep_protocol_fee", "proto-token22-nofee", ("token22-nofee",), 0,
     ("sweep", 2488, 2488, 0, 0, 2079080, 2488, 0, 170)),
    ("sweep_protocol_fee", "proto-tf100", ("tf", 100, M), 0,
     ("sweep", 2463, 2488, 0, 25, 2162600, 2488, 0, 182)),
    ("sweep_protocol_fee", "proto-tf5000", ("tf", 5000, M), 0,
     ("sweep", 1244, 2488, 0, 1244, 2162600, 2488, 0, 182)),
    ("sweep_protocol_fee", "proto-tf10000", ("tf", 10000, M), 0,
     ("sweep", 0, 2488, 0, 2488, 2162600, 2488, 0, 182)),
    ("sweep_protocol_fee", "proto-tf5000-max100", ("tf", 5000, 100), 0,
     ("sweep", 2388, 2488, 0, 100, 2162600, 2488, 0, 182)),
    ("sweep_protocol_fee", "proto-tf100-preata-withheld", ("preata-withheld",), 0,
     ("sweep", 7463, 2488, 0, 1025, 5000, 2488, 0, 182)),
    ("sweep_protocol_fee", "proto-tf100-preata-noext", ("preata-noext",), 0,
     ("error", "InstructionErrorCustom(13)", "custom program error: 0xd")),
    ("sweep_protocol_fee", "proto-zero-fee", ("zero",), 0,
     ("noop", 5000)),
    ("sweep_protocol_fee", "proto-epoch0", ("epoch", 100, 5000, 10), 0,
     ("sweep", 2463, 2488, 0, 25, 2162600, 2488, 0, 182)),
    ("sweep_protocol_fee", "proto-epoch9", ("epoch", 100, 5000, 10), 9,
     ("sweep", 2463, 2488, 0, 25, 2162600, 2488, 0, 182)),
    ("sweep_protocol_fee", "proto-epoch10", ("epoch", 100, 5000, 10), 10,
     ("sweep", 1244, 2488, 0, 1244, 2162600, 2488, 0, 182)),
    ("sweep_protocol_fee", "proto-epoch11", ("epoch", 100, 5000, 10), 11,
     ("sweep", 1244, 2488, 0, 1244, 2162600, 2488, 0, 182)),
    ("sweep_protocol_fee", "proto-token22prog-tokenaccounts", ("mismatch",), 0,
     ("error", "IncorrectProgramId", "incorrect program id for instruction")),
    ("sweep_creator_fee", "creator-token-baseline", ("token",), 0,
     ("sweep", 123394, 123394, 0, None, 2044280, 123394, 1, 165)),
    ("sweep_creator_fee", "creator-token22-nofee", ("token22-nofee",), 0,
     ("sweep", 123394, 123394, 0, 0, 2079080, 123394, 1, 170)),
    ("sweep_creator_fee", "creator-tf100", ("tf", 100, M), 0,
     ("sweep", 122160, 123394, 0, 1234, 2162600, 123394, 1, 182)),
    ("sweep_creator_fee", "creator-tf5000", ("tf", 5000, M), 0,
     ("sweep", 61697, 123394, 0, 61697, 2162600, 123394, 1, 182)),
    ("sweep_creator_fee", "creator-tf10000", ("tf", 10000, M), 0,
     ("sweep", 0, 123394, 0, 123394, 2162600, 123394, 1, 182)),
    ("sweep_creator_fee", "creator-tf5000-max100", ("tf", 5000, 100), 0,
     ("sweep", 123294, 123394, 0, 100, 2162600, 123394, 1, 182)),
    ("sweep_creator_fee", "creator-zero-fee", ("zero",), 0,
     ("noop", 5000)),
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        out[str(k)] = {"owner": str(a.owner), "lamports": a.lamports,
                       "executable": a.executable, "data_hex": a.data.hex()} if a else None
    return out


def amount_at(data_hex, offset):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


def apply_tf(vm, first, second):
    """Write a Token-2022 transfer-fee extension onto the quote mint
    (first = older schedule, second = newer schedule, each
    (epoch, maxfee, bps)) and a zero-withheld extension onto the
    quote vault, both Token-2022-owned."""
    mint = vm.get_account(quote)
    d = bytearray(mint.data[:82])
    d += bytes(83) + bytes([1])
    conf = bytes(72) + struct.pack("<QQH", *first) + struct.pack("<QQH", *second)
    d += struct.pack("<HH", 1, len(conf)) + conf
    vm.set_account(quote, Account(mint.lamports, bytes(d), TOKEN22))
    a = vm.get_account(vaultquote)
    dd = bytearray(a.data[:165])
    dd += bytes([2]) + struct.pack("<HHQ", 2, 8, 0)
    vm.set_account(vaultquote, Account(a.lamports, bytes(dd), TOKEN22))


def convert_token22(vm):
    mint = vm.get_account(quote)
    vm.set_account(quote, Account(mint.lamports, bytes(mint.data), TOKEN22))
    a = vm.get_account(vaultquote)
    vm.set_account(vaultquote, Account(a.lamports, bytes(a.data), TOKEN22))


def token_account_data(mint, owner, amount, withheld):
    """A valid Token-2022 token account: 165-byte base (state=1 at
    offset 108) plus, when withheld is not None, the extension area
    observed on program-created ATAs (marker + zero-length
    extension + TransferFeeAmount extension, withheld at 174)."""
    data = bytearray(165)
    data[0:32] = bytes(mint)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    if withheld is None:
        return bytes(data)
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) \
        + struct.pack("<HHQ", 2, 8, withheld)


receipts_global = []
report_cases = []
for index, (instruction, label, mode, epoch, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == instruction)
    if instruction == "sweep_protocol_fee":
        recipient = Pubkey.from_bytes(bytes(RAW[57:89]))
        fee_offset = 271
        gross = 2488
    else:
        recipient = Pubkey.find_program_address([b'creator_vault', bytes(poolraw[211:243])], PROGRAM)[0]
        fee_offset = 279
        gross = 123394
    if mode[0] == "token":
        prog = TOKEN
    else:
        prog = TOKEN22
    ata = Pubkey.find_program_address([bytes(recipient), bytes(prog), bytes(quote)], ATA)[0]
    keys = [PAYER.pubkey(), CONFIG_KEY, pool, quote, prog, vaultquote, recipient, ata,
            Pubkey.default(), ATA, EVENT, PROGRAM]
    row = {"case": {"instruction": instruction, "label": label,
                    "mode": list(mode), "epoch": epoch,
                    "expected": list(expected)}}
    for image in ("original", "control", "candidate"):
        h = Harness(IMAGES[image])
        vm = h.vm
        vm.set_clock(Clock(100, 1234567890, epoch, 0, 1234567890))
        for pid, n in ((TOKEN, 'spl_token'), (TOKEN22, 'spl_token_2022'), (ATA, 'associated_token')):
            vm.add_program_from_file(pid, str(ROOT / 'evidence/dependencies' / n / 'deployed.so'))
        for rrow in f["accounts"].values():
            vm.set_account(Pubkey.from_string(rrow["address"]),
                           Account(rrow["lamports"], base64.b64decode(rrow["data_base64"]),
                                   Pubkey.from_string(rrow["owner"])))
        if mode[0] == "zero":
            pr = bytearray(poolraw)
            struct.pack_into("<Q", pr, fee_offset, 0)
            vm.set_account(pool, Account(10 ** 9, bytes(pr), PROGRAM))
        else:
            vm.set_account(pool, Account(10 ** 9, bytes(poolraw), PROGRAM))
        vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(RAW), PROGRAM))
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])]
        if mode[0] == "token22-nofee":
            convert_token22(vm)
        elif mode[0] == "tf":
            apply_tf(vm, (0, mode[2], mode[1]), (0, mode[2], mode[1]))
        elif mode[0] == "epoch":
            apply_tf(vm, (0, M, mode[1]), (mode[3], M, mode[2]))
        elif mode[0] == "preata-withheld":
            apply_tf(vm, (0, M, 100), (0, M, 100))
            vm.set_account(ata, Account(2162600,
                                        token_account_data(quote, recipient, 5000, 1000),
                                        TOKEN22))
        elif mode[0] == "preata-noext":
            apply_tf(vm, (0, M, 100), (0, M, 100))
            vm.set_account(ata, Account(2039280,
                                        token_account_data(quote, recipient, 0, None),
                                        TOKEN22))
        before_keys = sorted({str(m.pubkey) for m in metas} | {str(OUTSIDER.pubkey())}, key=str)
        before = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        tx = Transaction.new_signed_with_payer(
            [Instruction(PROGRAM, bytes(ix["discriminator"]), metas)],
            PAYER.pubkey(), [PAYER], vm.latest_blockhash())
        raw = bytes(tx)
        checks = tx.verify_with_results()
        assert checks and all(checks), "new transaction must verify"
        r = vm.send_transaction(tx)
        failed = isinstance(r, FailedTransactionMetadata)
        meta = r.meta() if failed else r
        after = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        err = str(r.err()) if failed else None
        logs = meta.logs()
        payer_key = str(PAYER.pubkey())
        payer_delta = before[payer_key]["lamports"] - after[payer_key]["lamports"]
        # Event lines: Anchor emit! produces one "Program data:" line
        # per emitted event; decode the sweep event (185 bytes:
        # 8 disc + 8 timestamp + 5x32 keys + 8 amount + 1 bucket).
        events = []
        for line in logs:
            if line.startswith("Program data: "):
                blob = base64.b64decode(line[len("Program data: "):])
                if len(blob) == 185:
                    events.append({"amount": struct.unpack_from("<Q", blob, 176)[0],
                                   "bucket": blob[184]})
        observed = {}
        if expected[0] == "sweep":
            _, ata_amount, vault_spent, fee_left, withheld, exp_payer, ev_amount, ev_bucket, ata_len = expected
            assert not failed and err is None, (label, image, err)
            ata_after = after[str(ata)]
            assert ata_after is not None, (label, image, "ATA must exist")
            assert len(bytes.fromhex(ata_after["data_hex"])) == ata_len, \
                (label, image, len(bytes.fromhex(ata_after["data_hex"])), ata_len)
            assert amount_at(ata_after["data_hex"], 64) == ata_amount, \
                (label, image, amount_at(ata_after["data_hex"], 64), ata_amount)
            got_vault = amount_at(before[str(vaultquote)]["data_hex"], 64) \
                - amount_at(after[str(vaultquote)]["data_hex"], 64)
            assert got_vault == vault_spent, (label, image, got_vault, vault_spent)
            fee_after = struct.unpack_from("<Q", bytes.fromhex(after[str(pool)]["data_hex"]), fee_offset)[0]
            assert fee_after == fee_left, (label, image, fee_after, fee_left)
            if withheld is None:
                got_withheld = None
            elif len(bytes.fromhex(ata_after["data_hex"])) >= 182:
                got_withheld = struct.unpack_from("<Q", bytes.fromhex(ata_after["data_hex"]), 174)[0]
            else:
                got_withheld = 0
            assert got_withheld == withheld, (label, image, got_withheld, withheld)
            assert payer_delta == exp_payer, (label, image, payer_delta, exp_payer)
            assert events == [{"amount": ev_amount, "bucket": ev_bucket}], \
                (label, image, events)
            observed = {"ata_amount": ata_amount, "vault_spent": vault_spent,
                        "fee_left": fee_left, "withheld": withheld,
                        "payer_delta": payer_delta, "event_amount": ev_amount,
                        "event_bucket": ev_bucket, "ata_len": ata_len}
        elif expected[0] == "noop":
            assert not failed and err is None, (label, image, err)
            assert after[str(ata)] is None, (label, image, "no ATA must be created")
            assert events == [], (label, image, events)
            assert payer_delta == expected[1], (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback except payer")
            observed = {"ata_exists": False, "vault_spent": 0,
                        "payer_delta": payer_delta, "events": 0}
        else:
            assert failed and err is not None and expected[1] in err, (label, image, err)
            assert expected[2] in "\n".join(logs), (label, image, logs[-3:])
            assert events == [], (label, image, events)
            assert payer_delta == 5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback")
            observed = {"error": expected[1], "fragment": expected[2],
                        "payer_delta": payer_delta}
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": instruction,
                        "label": label},
            "transaction_base64": base64.b64encode(raw).decode(),
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
            "all_signatures_verified": True, "signature_fields": 1,
            "before": before, "after": after,
            "metadata": {"signature": str(meta.signature()), "logs": logs,
                         "inner_instructions": str(meta.inner_instructions()),
                         "compute_units_consumed": str(meta.compute_units_consumed()),
                         "return_data": str(meta.return_data())},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": epoch,
                      "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
            "loaded_programs": {
                str(PROGRAM): {"path": "evidence/original/pump_amm/deployed.so",
                               "sha256": IMAGE_SHA[image]},
                str(TOKEN): {"path": "evidence/dependencies/spl_token/deployed.so",
                             "sha256": "8190d3f7ceb6cb7a7a8d8924bff89f9f611e15ce1f806f2b6237f3311a98f697"},
                str(TOKEN22): {"path": "evidence/dependencies/spl_token_2022/deployed.so",
                               "sha256": "15a2e615a42e20f31714bbaaee43002ae6f1cda2e8d7118243117ab3c1342e2d"},
                str(ATA): {"path": "evidence/dependencies/associated_token/deployed.so",
                           "sha256": sha((ROOT / "evidence/dependencies/associated_token/deployed.so").read_bytes())}},
            "error": err, "rollback_except_payer_fee": failed,
            "payer_delta_lamports": payer_delta,
            "observed": observed,
        })
        row[image] = {"error": err, "logs": logs, "observed": observed}
        print(f"  {label} [{image}] error={err} observed={observed}")
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
report = {
    "scope": "Fresh normally signed original/control/candidate triples pinning "
             "fee sweeps under a matching Token-2022 quote program: the "
             "sweep moves the full accrued amount out of the vault, the "
             "recipient ATA gains the net amount, the fee is withheld "
             "into the recipient ATA's TransferFeeAmount extension, the "
             "pool fee field is zeroed regardless, and the "
             "SweepPoolFeeEvent still reports the gross amount. A 100% "
             "fee succeeds with zero delivery. Caps bind the withheld "
             "amount only. The fee schedule switches from the older to "
             "the newer schedule exactly at the newer epoch. A "
             "pre-existing destination without extension space fails "
             "with Token-2022 custom error 0xd, while one with extension "
             "space accumulates withheld fees. A zero fee bucket is a "
             "silent no-op. Receipts are stored as parts to stay under "
             "GitHub's 25MB web-upload limit; verify.py reads them in order.",
    "fresh_vm_environment": "1",
    "image_sha256": IMAGE_SHA,
    "input_sha256": {
        "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json":
            sha((ROOT / "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json").read_bytes()),
        "research/imported-lab/analysis/pump_fun/config-snapshot.json":
            sha((ROOT / "research/imported-lab/analysis/pump_fun/config-snapshot.json").read_bytes()),
        "evidence/upstream/pump_amm.json":
            sha((ROOT / "evidence/upstream/pump_amm.json").read_bytes()),
        "evidence/dependencies/spl_token/deployed.so":
            sha((ROOT / "evidence/dependencies/spl_token/deployed.so").read_bytes()),
        "evidence/dependencies/spl_token_2022/deployed.so":
            sha((ROOT / "evidence/dependencies/spl_token_2022/deployed.so").read_bytes()),
        "evidence/dependencies/associated_token/deployed.so":
            sha((ROOT / "evidence/dependencies/associated_token/deployed.so").read_bytes()),
    },
    "counts": {"vms": len(receipts_global), "transactions": len(receipts_global),
               "signature_fields": len(receipts_global)},
    "case_count": len(report_cases),
    "classifications": {"fee-sweeps": 21},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
