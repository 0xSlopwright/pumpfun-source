#!/usr/bin/env python3
"""Build research/amm-collect-token22-transfer-fee-20261029 receipts.

collect_coin_creator_fee CAN move Token-2022 quote fees when the
caller passes the matching Token-2022 program -- the #47 packet's
2023 ConstraintAssociatedTokenTokenProgram only shows when the
Token program is passed for Token-2022 accounts (or vice versa).
With the matching program, the vault drains in full, the
destination gains the net amount, the fee is withheld into the
destination's TransferFeeAmount extension, and the
CollectCoinCreatorFeeEvent still reports the gross amount. A 100%
fee succeeds with zero delivery. Caps bind the withheld amount
only. The fee schedule switches from the older to the newer
schedule exactly at the newer epoch. A destination without
extension space fails with Token-2022 custom error 0xd, while a
pre-existing destination with extension space accumulates
withheld fees. An empty vault is a silent no-op (no event), but
the destination must still exist (missing destination fails
3012 AccountNotInitialized). The mismatch map is symmetric:
TOKEN22 program + Token accounts gives 2023, a Token destination
at a Token-2022-derived address gives 2021
ConstraintTokenTokenProgram, and a Token vault at a
Token-derived address gives 2023.
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
    EVENT, IDL, PAYER, PROGRAM, TOKEN, TOKEN22,
    f, poolraw, quote, token,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-collect-token22-transfer-fee-20261029"
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
CREATOR = Pubkey.from_bytes(bytes(poolraw[211:243]))
AUTH, _BUMP = Pubkey.find_program_address([b'creator_vault', bytes(CREATOR)], PROGRAM)
VAULT_AMOUNT = 123394

# (label, prog, vault_key_prog, dest_key_prog, mint_setup, vault_setup,
#  dest_setup, epoch, expected)
# mint_setup: ("token",) | ("t22-nofee",) | ("tf", bps, maxfee)
#           | ("epoch", older_bps, newer_bps, newer_epoch)
# vault_setup / dest_setup account kinds: "token" | "t22" | "t22-ext"
#   | "t22-pre" (dest only: amount 5000, withheld 1000) | "none" (dest only)
# expected: ("collect", vault_delta, dest_delta, dest_final, withheld_or_None,
#            dest_len, event_fee)
#         | ("noop", dest_len) | ("error", code_in_err, fragment_in_logs)
CASES = [
    ("collect-token-baseline", TOKEN, TOKEN, TOKEN, ("token",),
     ("token", VAULT_AMOUNT), ("token", 0), 0,
     ("collect", -VAULT_AMOUNT, VAULT_AMOUNT, VAULT_AMOUNT, None, 165, VAULT_AMOUNT)),
    ("collect-t22-nofee", TOKEN22, TOKEN22, TOKEN22, ("t22-nofee",),
     ("t22", VAULT_AMOUNT), ("t22", 0), 0,
     ("collect", -VAULT_AMOUNT, VAULT_AMOUNT, VAULT_AMOUNT, None, 165, VAULT_AMOUNT)),
    ("collect-t22-nofee-extdest", TOKEN22, TOKEN22, TOKEN22, ("t22-nofee",),
     ("t22", VAULT_AMOUNT), ("t22-ext", 0), 0,
     ("collect", -VAULT_AMOUNT, VAULT_AMOUNT, VAULT_AMOUNT, 0, 182, VAULT_AMOUNT)),
    ("collect-tf100", TOKEN22, TOKEN22, TOKEN22, ("tf", 100, M),
     ("t22", VAULT_AMOUNT), ("t22-ext", 0), 0,
     ("collect", -VAULT_AMOUNT, 122160, 122160, 1234, 182, VAULT_AMOUNT)),
    ("collect-tf5000", TOKEN22, TOKEN22, TOKEN22, ("tf", 5000, M),
     ("t22", VAULT_AMOUNT), ("t22-ext", 0), 0,
     ("collect", -VAULT_AMOUNT, 61697, 61697, 61697, 182, VAULT_AMOUNT)),
    ("collect-tf10000", TOKEN22, TOKEN22, TOKEN22, ("tf", 10000, M),
     ("t22", VAULT_AMOUNT), ("t22-ext", 0), 0,
     ("collect", -VAULT_AMOUNT, 0, 0, VAULT_AMOUNT, 182, VAULT_AMOUNT)),
    ("collect-tf5000-max100", TOKEN22, TOKEN22, TOKEN22, ("tf", 5000, 100),
     ("t22", VAULT_AMOUNT), ("t22-ext", 0), 0,
     ("collect", -VAULT_AMOUNT, 123294, 123294, 100, 182, VAULT_AMOUNT)),
    ("collect-tf100-noext-dest", TOKEN22, TOKEN22, TOKEN22, ("tf", 100, M),
     ("t22", VAULT_AMOUNT), ("t22", 0), 0,
     ("error", "InstructionErrorCustom(13)", "custom program error: 0xd")),
    ("collect-tf100-pre-withheld", TOKEN22, TOKEN22, TOKEN22, ("tf", 100, M),
     ("t22", VAULT_AMOUNT), ("t22-pre", 5000), 0,
     ("collect", -VAULT_AMOUNT, 122160, 127160, 2234, 182, VAULT_AMOUNT)),
    ("collect-epoch0", TOKEN22, TOKEN22, TOKEN22, ("epoch", 100, 5000, 10),
     ("t22", VAULT_AMOUNT), ("t22-ext", 0), 0,
     ("collect", -VAULT_AMOUNT, 122160, 122160, 1234, 182, VAULT_AMOUNT)),
    ("collect-epoch9", TOKEN22, TOKEN22, TOKEN22, ("epoch", 100, 5000, 10),
     ("t22", VAULT_AMOUNT), ("t22-ext", 0), 9,
     ("collect", -VAULT_AMOUNT, 122160, 122160, 1234, 182, VAULT_AMOUNT)),
    ("collect-epoch10", TOKEN22, TOKEN22, TOKEN22, ("epoch", 100, 5000, 10),
     ("t22", VAULT_AMOUNT), ("t22-ext", 0), 10,
     ("collect", -VAULT_AMOUNT, 61697, 61697, 61697, 182, VAULT_AMOUNT)),
    ("collect-epoch11", TOKEN22, TOKEN22, TOKEN22, ("epoch", 100, 5000, 10),
     ("t22", VAULT_AMOUNT), ("t22-ext", 0), 11,
     ("collect", -VAULT_AMOUNT, 61697, 61697, 61697, 182, VAULT_AMOUNT)),
    ("collect-zero-extdest", TOKEN22, TOKEN22, TOKEN22, ("t22-nofee",),
     ("t22", 0), ("t22-ext", 0), 0,
     ("noop", 182)),
    ("collect-zero-plaindest", TOKEN22, TOKEN22, TOKEN22, ("t22-nofee",),
     ("t22", 0), ("t22", 0), 0,
     ("noop", 165)),
    ("collect-zero-nodest", TOKEN22, TOKEN22, TOKEN22, ("t22-nofee",),
     ("t22", 0), ("none", 0), 0,
     ("error", "InstructionErrorCustom(3012)", "AccountNotInitialized")),
    ("collect-mismatch-all-token", TOKEN22, TOKEN, TOKEN, ("token",),
     ("token", VAULT_AMOUNT), ("token", 0), 0,
     ("error", "InstructionErrorCustom(2023)", "ConstraintAssociatedTokenTokenProgram")),
    ("collect-mismatch-dest-token", TOKEN22, TOKEN22, TOKEN22, ("t22-nofee",),
     ("t22", VAULT_AMOUNT), ("token", 0), 0,
     ("error", "InstructionErrorCustom(2021)", "ConstraintTokenTokenProgram")),
    ("collect-mismatch-vault-token", TOKEN22, TOKEN, TOKEN22, ("t22-nofee",),
     ("token", VAULT_AMOUNT), ("t22-ext", 0), 0,
     ("error", "InstructionErrorCustom(2023)", "ConstraintAssociatedTokenTokenProgram")),
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


def t22acct(mint, owner, amount, withheld=None):
    data = bytearray(165)
    data[0:32] = bytes(mint)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    if withheld is None:
        return bytes(data)
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) \
        + struct.pack("<HHQ", 2, 8, withheld)


def apply_tf(vm, first, second):
    """Write a Token-2022 transfer-fee extension onto the quote mint
    (first = older schedule, second = newer schedule, each
    (epoch, maxfee, bps)); the mint becomes Token-2022-owned."""
    mint = vm.get_account(quote)
    d = bytearray(mint.data[:82])
    d += bytes(83) + bytes([1])
    conf = bytes(72) + struct.pack("<QQH", *first) + struct.pack("<QQH", *second)
    d += struct.pack("<HH", 1, len(conf)) + conf
    vm.set_account(quote, Account(mint.lamports, bytes(d), TOKEN22))


def setup_account(vm, key, kind, amount):
    if kind == "token":
        vm.set_account(key, Account(amount + 2039280, token(quote, AUTH if key == VAULT_KEY[0] else CREATOR, amount, True), TOKEN))
    elif kind == "t22":
        owner = AUTH if key == VAULT_KEY[0] else CREATOR
        vm.set_account(key, Account(amount + 2039280, t22acct(quote, owner, amount), TOKEN22))
    elif kind == "t22-ext":
        owner = AUTH if key == VAULT_KEY[0] else CREATOR
        vm.set_account(key, Account(amount + 2039280, t22acct(quote, owner, amount, 0), TOKEN22))
    elif kind == "t22-pre":
        vm.set_account(key, Account(amount + 2039280, t22acct(quote, CREATOR, amount, 1000), TOKEN22))
    elif kind == "none":
        pass
    else:
        raise AssertionError(kind)


# setup_account needs the vault key to pick the owner; set per case.
VAULT_KEY = [None]

receipts_global = []
report_cases = []
for index, (label, prog, vault_key_prog, dest_key_prog, mint_setup,
            vault_setup, dest_setup, epoch, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == "collect_coin_creator_fee")
    VAULT = Pubkey.find_program_address([bytes(AUTH), bytes(vault_key_prog), bytes(quote)], ATA)[0]
    DEST = Pubkey.find_program_address([bytes(CREATOR), bytes(dest_key_prog), bytes(quote)], ATA)[0]
    VAULT_KEY[0] = VAULT
    keys = [quote, prog, CREATOR, AUTH, VAULT, DEST, EVENT, PROGRAM]
    row = {"case": {"instruction": "collect_coin_creator_fee", "label": label,
                    "mint_setup": list(mint_setup), "vault_setup": list(vault_setup),
                    "dest_setup": list(dest_setup), "epoch": epoch,
                    "expected": list(expected)}}
    for image in ("original", "control", "candidate"):
        h = Harness(IMAGES[image])
        vm = h.vm
        vm.set_clock(Clock(100, 1234567890, epoch, 0, 1234567890))
        for pid, n in ((TOKEN, 'spl_token'), (TOKEN22, 'spl_token_2022')):
            vm.add_program_from_file(pid, str(ROOT / 'evidence/dependencies' / n / 'deployed.so'))
        rrow = f["accounts"]["quote_mint"]
        vm.set_account(quote, Account(rrow["lamports"], base64.b64decode(rrow["data_base64"]), TOKEN))
        if mint_setup[0] == "t22-nofee":
            vm.set_account(quote, Account(vm.get_account(quote).lamports,
                                          bytes(vm.get_account(quote).data), TOKEN22))
        elif mint_setup[0] == "tf":
            apply_tf(vm, (0, mint_setup[2], mint_setup[1]), (0, mint_setup[2], mint_setup[1]))
        elif mint_setup[0] == "epoch":
            apply_tf(vm, (0, M, mint_setup[1]), (mint_setup[3], M, mint_setup[2]))
        setup_account(vm, VAULT, vault_setup[0], vault_setup[1])
        setup_account(vm, DEST, dest_setup[0], dest_setup[1])
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])]
        before_keys = sorted({str(m.pubkey) for m in metas} | {str(PAYER.pubkey())}, key=str)
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
        # Collect event blob: 8 disc + 8 timestamp + 32 creator + 8 fee
        # + 32 vault + 32 dest = 120 bytes; fee at offset 48.
        events = []
        for line in logs:
            if line.startswith("Program data: "):
                blob = base64.b64decode(line[len("Program data: "):])
                if len(blob) == 120:
                    events.append({"fee": struct.unpack_from("<Q", blob, 48)[0],
                                   "vault": str(Pubkey.from_bytes(blob[56:88])),
                                   "dest": str(Pubkey.from_bytes(blob[88:120]))})
        observed = {}
        if expected[0] == "collect":
            _, vault_delta, dest_delta, dest_final, withheld, dest_len, event_fee = expected
            assert not failed and err is None, (label, image, err)
            assert amount_at(after[str(VAULT)]["data_hex"], 64) == 0, (label, image)
            got_vault_delta = amount_at(after[str(VAULT)]["data_hex"], 64) \
                - amount_at(before[str(VAULT)]["data_hex"], 64)
            assert got_vault_delta == vault_delta, (label, image, got_vault_delta)
            assert amount_at(after[str(DEST)]["data_hex"], 64) == dest_final, (label, image)
            got_dest_delta = amount_at(after[str(DEST)]["data_hex"], 64) \
                - amount_at(before[str(DEST)]["data_hex"], 64)
            assert got_dest_delta == dest_delta, (label, image, got_dest_delta)
            assert len(bytes.fromhex(after[str(DEST)]["data_hex"])) == dest_len, (label, image)
            if withheld is None:
                assert dest_len == 165, (label, image)
                got_withheld = None
            else:
                got_withheld = amount_at(after[str(DEST)]["data_hex"], 174)
                assert got_withheld == withheld, (label, image, got_withheld)
            assert payer_delta == 5000, (label, image, payer_delta)
            assert events == [{"fee": event_fee, "vault": str(VAULT), "dest": str(DEST)}], \
                (label, image, events)
            observed = {"vault_delta": vault_delta, "dest_delta": dest_delta,
                        "dest_final": dest_final, "withheld": withheld,
                        "dest_len": dest_len, "payer_delta": payer_delta,
                        "event_fee": event_fee}
        elif expected[0] == "noop":
            assert not failed and err is None, (label, image, err)
            assert amount_at(after[str(VAULT)]["data_hex"], 64) == 0, (label, image)
            assert amount_at(after[str(DEST)]["data_hex"], 64) == 0, (label, image)
            assert len(bytes.fromhex(after[str(DEST)]["data_hex"])) == expected[1], (label, image)
            assert events == [], (label, image, events)
            assert payer_delta == 5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback except payer")
            observed = {"vault_amount": 0, "dest_amount": 0,
                        "dest_len": expected[1], "payer_delta": payer_delta, "events": 0}
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
            "context": {"index": index, "image": image, "instruction": "collect_coin_creator_fee",
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
                               "sha256": "15a2e615a42e20f31714bbaaee43002ae6f1cda2e8d7118243117ab3c1342e2d"}},
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
             "collect_coin_creator_fee under a matching Token-2022 quote "
             "program: the vault drains in full, the destination gains "
             "the net amount, the fee is withheld into the destination's "
             "TransferFeeAmount extension, and the "
             "CollectCoinCreatorFeeEvent still reports the gross amount. "
             "A 100% fee succeeds with zero delivery. Caps bind the "
             "withheld amount only. The fee schedule switches from the "
             "older to the newer schedule exactly at the newer epoch. "
             "A destination without extension space fails with "
             "Token-2022 custom error 0xd, while a pre-existing "
             "destination with extension space accumulates withheld "
             "fees. An empty vault is a silent no-op (no event), but "
             "the destination must still exist. The mismatch map is "
             "symmetric with #47: TOKEN22 program + Token accounts "
             "gives 2023, a Token destination at a Token-2022-derived "
             "address gives 2021, and a Token vault at a Token-derived "
             "address gives 2023. Receipts are stored as parts to stay "
             "under GitHub's 25MB web-upload limit; verify.py reads "
             "them in order.",
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
    },
    "counts": {"vms": len(receipts_global), "transactions": len(receipts_global),
               "signature_fields": len(receipts_global)},
    "case_count": len(report_cases),
    "classifications": {"collect-creator-fee": 19},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")
