#!/usr/bin/env python3
"""Build research/amm-transfer-v1-native-20261029 receipts.

The v1 handler transfer_creator_fees_to_pump was only ever pinned
for its failure modes (#22: a synthetic mint gives 6007
UnsupportedQuoteMint, a Token-2022 vault on the native branch
fails the close with Token custom error 11). Its native success
path was unmeasured. This packet pins it:

- The handler moves lamports only, never token amounts. It
  closes the creator vault wSOL ATA (lamports go to the
  creator_vault PDA authority), recreates that same ATA empty
  (2,039,280 lamports, amount 0), then transfers ALL authority
  lamports to the pump creator vault. The authority ends at
  zero in every success case.
- The gate is a lamport minimum, not an amount minimum:
  minimum = rent(165) + deficit, where deficit =
  rent(pump_vault.data_len) - pump_vault.lamports, saturating
  at zero. rent(n) = 890,880 + 6,960*n. Available counts only
  the vault ATA's lamports, never the authority's. Below the
  minimum the handler returns Ok silently (log message only),
  changing nothing except the payer's 5,000 fee.
- The token amount in the vault is irrelevant: a vault holding
  amount 10^9 with exactly minimum lamports transfers zero
  lamports to the pump vault and recreates an empty ATA.
- The recreated ATA makes the handler re-runnable: a second
  call (or second instruction) closes the empty ATA, recreates
  it, and transfers 0, leaving pump and vault unchanged.
- Account validation: synthetic mint -> 6007, wrong pump-vault
  or authority seeds -> 2006 ConstraintSeeds, missing vault ->
  3012 AccountNotInitialized, Token-2022 token program for a
  Token vault -> 2023 ConstraintAssociatedTokenTokenProgram.
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

from pump_amm_admin_differential import Harness, OUTSIDER
from pump_amm_liquidity_differential import (
    EVENT, IDL, PAYER, PROGRAM, TOKEN, TOKEN22,
    f, quote, token,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-transfer-v1-native-20261029"
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

CREATOR = OUTSIDER.pubkey()
AUTH, _ = Pubkey.find_program_address([b'creator_vault', bytes(CREATOR)], PROGRAM)
PUMP = Pubkey.from_string(json.load(open(ROOT / 'evidence/upstream/pump.json'))['address'])
PUMPVAULT = Pubkey.find_program_address([b'creator-vault', bytes(CREATOR)], PUMP)[0]
VAULT = Pubkey.find_program_address([bytes(AUTH), bytes(TOKEN), bytes(quote)], ATA)[0]
QUOTE2 = Pubkey(bytes([7] * 32))

IX1 = next(x for x in IDL["instructions"] if x["name"] == "transfer_creator_fees_to_pump")


def sha(data):
    return hashlib.sha256(data).hexdigest()


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        out[str(k)] = {"owner": str(a.owner), "lamports": a.lamports,
                       "executable": a.executable, "data_hex": a.data.hex()} if a else None
    return out


def amount_at(data_hex, offset=64):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


# Each case: (label, mode, expected)
# mode: ("std", vault_lamp|None, vault_amt, auth_lamp|None, pump_lamp|None, pump_data)
#     | ("errmint",) | ("errpump",) | ("errauth",) | ("errmissing",) | ("errtok22",)
# expected: ("success", pump_delta) | ("noop", minimum)
#         | ("repeat", pump_delta) | ("error", code, fragment)
CASES = [
    ("v1-base-success",
     ("std", 2044280, 100000, 10 ** 9, 10 ** 9, b""),
     ("success", 1000005000)),
    ("v1-below-min",
     ("std", 2039279, 100000, 10 ** 9, 10 ** 9, b""),
     ("noop", 2039280)),
    ("v1-exact-min",
     ("std", 2039280, 100000, 10 ** 9, 10 ** 9, b""),
     ("success", 10 ** 9)),
    ("v1-deficit-absent-below",
     ("std", 2930159, 100000, 10 ** 9, None, b""),
     ("noop", 2930160)),
    ("v1-deficit-absent-exact",
     ("std", 2930160, 100000, 10 ** 9, None, b""),
     ("success", 1000890880)),
    ("v1-deficit-data100-below",
     ("std", 3626059, 1000, 10 ** 9, 100, bytes(100)),
     ("noop", 3626060)),
    ("v1-deficit-data100-exact",
     ("std", 3626060, 1000, 10 ** 9, 100, bytes(100)),
     ("success", 1001586780)),
    ("v1-partial-below",
     ("std", 2430159, 1000, 10 ** 9, 500000, b""),
     ("noop", 2430160)),
    ("v1-partial-exact",
     ("std", 2430160, 1000, 10 ** 9, 500000, b""),
     ("success", 1000390880)),
    ("v1-auth-rich-vault-below",
     ("std", 100000, 100000, 10 ** 9, 10 ** 9, b""),
     ("noop", 2039280)),
    ("v1-amount-discarded",
     ("std", 2039280, 10 ** 9, None, 10 ** 9, b""),
     ("success", 0)),
    ("v1-amount0",
     ("std", 5000000, 0, 10 ** 9, 10 ** 9, b""),
     ("success", 1002960720)),
    ("v1-repeat-call",
     ("std", 5000000, 777, 10 ** 9, 10 ** 9, b""),
     ("repeat", 1002960720)),
    ("v1-huge",
     ("std", 10 ** 9, 123394, None, 10 ** 9, b""),
     ("success", 997960720)),
    ("v1-err-synth-mint",
     ("errmint",),
     ("error", "6007", "caused by account: wsol_mint")),
    ("v1-err-wrong-pump",
     ("errpump",),
     ("error", "2006", "caused by account: pump_creator_vault")),
    ("v1-err-wrong-auth",
     ("errauth",),
     ("error", "2006", "caused by account: coin_creator_vault_authority")),
    ("v1-err-vault-missing",
     ("errmissing",),
     ("error", "3012", "caused by account: coin_creator_vault_ata")),
    ("v1-err-tokprog22",
     ("errtok22",),
     ("error", "2023", "ConstraintAssociatedTokenTokenProgram")),
]

receipts_global = []
report_cases = []
for index, (label, mode, expected) in enumerate(CASES):
    mode_json = ([mode[0], mode[1], mode[2], mode[3], mode[4], len(mode[5])]
                 if mode[0] == "std" else list(mode))
    row = {"case": {"instruction": "transfer_creator_fees_to_pump", "label": label, "epoch": 0,
                    "mode": mode_json,
                    "expected": list(expected)}}
    for image in ("original", "control", "candidate"):
        h = Harness(IMAGES[image])
        vm = h.vm
        vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
        for pid, n in ((TOKEN, 'spl_token'), (TOKEN22, 'spl_token_2022'), (ATA, 'associated_token')):
            vm.add_program_from_file(pid, str(ROOT / 'evidence/dependencies' / n / 'deployed.so'))
        rrow = f["accounts"]["quote_mint"]
        base = bytes(base64.b64decode(rrow["data_base64"]))
        kind = mode[0]
        mint_key, tokprog, auth_key, pump_key = quote, TOKEN, AUTH, PUMPVAULT
        if kind == "std":
            _, vault_lamp, vault_amt, auth_lamp, pump_lamp, pump_data = mode
            vm.set_account(quote, Account(rrow["lamports"], base, TOKEN))
            vm.set_account(VAULT, Account(vault_lamp, token(quote, AUTH, vault_amt, True), TOKEN))
            if auth_lamp is not None:
                vm.set_account(AUTH, Account(auth_lamp, b"", Pubkey.default()))
            if pump_lamp is not None:
                vm.set_account(PUMPVAULT, Account(pump_lamp, pump_data, Pubkey.default()))
            vault_key = VAULT
        elif kind == "errmint":
            vm.set_account(QUOTE2, Account(rrow["lamports"], base, TOKEN))
            vm.set_account(VAULT, Account(5000000, token(QUOTE2, AUTH, 1000, True), TOKEN))
            vm.set_account(AUTH, Account(10 ** 9, b"", Pubkey.default()))
            vm.set_account(PUMPVAULT, Account(10 ** 9, b"", Pubkey.default()))
            mint_key, vault_key = QUOTE2, VAULT
        elif kind == "errpump":
            vm.set_account(quote, Account(rrow["lamports"], base, TOKEN))
            vm.set_account(VAULT, Account(5000000, token(quote, AUTH, 1000, True), TOKEN))
            vm.set_account(AUTH, Account(10 ** 9, b"", Pubkey.default()))
            vm.set_account(PUMPVAULT, Account(10 ** 9, b"", Pubkey.default()))
            pump_key = PAYER.pubkey()
            vault_key = VAULT
        elif kind == "errauth":
            vm.set_account(quote, Account(rrow["lamports"], base, TOKEN))
            vm.set_account(VAULT, Account(5000000, token(quote, AUTH, 1000, True), TOKEN))
            vm.set_account(AUTH, Account(10 ** 9, b"", Pubkey.default()))
            vm.set_account(PUMPVAULT, Account(10 ** 9, b"", Pubkey.default()))
            auth_key = PAYER.pubkey()
            vault_key = VAULT
        elif kind == "errmissing":
            vm.set_account(quote, Account(rrow["lamports"], base, TOKEN))
            vm.set_account(AUTH, Account(10 ** 9, b"", Pubkey.default()))
            vm.set_account(PUMPVAULT, Account(10 ** 9, b"", Pubkey.default()))
            vault_key = VAULT
        else:  # errtok22
            vm.set_account(quote, Account(rrow["lamports"], base, TOKEN))
            vm.set_account(VAULT, Account(5000000, token(quote, AUTH, 1000, True), TOKEN))
            vm.set_account(AUTH, Account(10 ** 9, b"", Pubkey.default()))
            vm.set_account(PUMPVAULT, Account(10 ** 9, b"", Pubkey.default()))
            tokprog, vault_key = TOKEN22, VAULT
        keys = [mint_key, tokprog, Pubkey.default(), ATA, CREATOR, auth_key,
                vault_key, pump_key, EVENT, PROGRAM]
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, IX1["accounts"])]
        before_keys = sorted({str(m.pubkey) for m in metas} | {str(PAYER.pubkey())}, key=str)
        before = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        payer_key = str(PAYER.pubkey())
        ntx = 2 if expected[0] == "repeat" else 1
        stages = []
        prev = before
        for stage in range(ntx):
            tx = Transaction.new_signed_with_payer(
                [Instruction(PROGRAM, bytes(IX1["discriminator"]), metas)],
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
            payer_delta = prev[payer_key]["lamports"] - after[payer_key]["lamports"]
            events = [l for l in logs if l.startswith("Program data: ")]
            stages.append({"tx": tx, "raw": raw, "failed": failed, "meta": meta,
                           "before": prev, "after": after, "err": err, "logs": logs,
                           "payer_delta": payer_delta, "events": events})
            prev = after
        after = stages[-1]["after"]

        def vault_row(s):
            v = s[str(VAULT)]
            if v is None:
                return None
            return (v["lamports"], len(bytes.fromhex(v["data_hex"])),
                    amount_at(v["data_hex"]), v["data_hex"][:64], v["data_hex"][64:128])

        if expected[0] in ("success", "repeat"):
            pump_delta = expected[1]
            for si, st in enumerate(stages):
                assert not st["failed"] and st["err"] is None, (label, image, si, st["err"])
                assert st["events"] == [], (label, image, si, st["events"])
                assert st["payer_delta"] == 5000, (label, image, si, st["payer_delta"])
                vb, va = st["before"], st["after"]
                assert va[str(AUTH)] is None, (label, image, si, "authority must drain to zero")
                vafter = va[str(VAULT)]
                assert vafter is not None, (label, image, si, "vault ATA must be recreated")
                assert vafter["lamports"] == 2039280, (label, image, si, vafter["lamports"])
                assert len(bytes.fromhex(vafter["data_hex"])) == 165
                assert amount_at(vafter["data_hex"]) == 0, (label, image, si)
                assert bytes.fromhex(vafter["data_hex"])[0:32] == bytes(quote)
                assert bytes.fromhex(vafter["data_hex"])[32:64] == bytes(AUTH)
                assert vafter["owner"] == str(TOKEN)
                pb = vb[str(PUMPVAULT)]
                pa = va[str(PUMPVAULT)]
                assert pa is not None, (label, image, si, "pump vault must exist after")
                assert pa["data_hex"] == (pb["data_hex"] if pb else ""), (label, image, si)
                if si == 0:
                    assert pa["lamports"] - (pb["lamports"] if pb else 0) == pump_delta, \
                        (label, image, si, pa["lamports"], pb)
                else:
                    assert pa["lamports"] == pb["lamports"], (label, image, si, "repeat transfers 0")
            if expected[0] == "success":
                observed = {"pump_delta": pump_delta, "vault_lamports": 2039280,
                            "vault_amount": 0, "auth": None, "payer_delta": 5000, "events": 0}
            else:
                observed = {"pump_delta": pump_delta, "vault_lamports": 2039280,
                            "vault_amount": 0, "auth": None, "payer_delta": 5000,
                            "events": 0, "repeat_second_delta": 0}
        elif expected[0] == "noop":
            _, minimum = expected
            st = stages[0]
            assert not st["failed"] and st["err"] is None, (label, image, st["err"])
            assert st["events"] == [], (label, image, st["events"])
            assert st["payer_delta"] == 5000, (label, image, st["payer_delta"])
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "noop rollback")
            msg = f"Available fees ({mode[1]}) below minimum transfer amount ({minimum}):"
            assert any(msg in l for l in st["logs"]), (label, image, st["logs"][-3:])
            observed = {"minimum": minimum, "vault_lamports": mode[1],
                        "vault_amount": mode[2], "payer_delta": 5000, "events": 0}
        else:
            _, code, fragment = expected
            st = stages[0]
            assert st["failed"] and st["err"] is not None and code in st["err"], \
                (label, image, st["err"])
            assert fragment in "\n".join(st["logs"]), (label, image, st["logs"][-3:])
            assert st["events"] == [], (label, image, st["events"])
            assert st["payer_delta"] == 5000, (label, image, st["payer_delta"])
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback")
            observed = {"error": code, "fragment": fragment, "payer_delta": 5000}
        for st in stages:
            receipts_global.append({
                "sequence": len(receipts_global), "vm": len(receipts_global),
                "context": {"index": index, "image": image,
                            "instruction": "transfer_creator_fees_to_pump", "label": label},
                "transaction_base64": base64.b64encode(st["raw"]).decode(),
                "signatures": [str(s) for s in st["tx"].signatures],
                "transaction_sha256": sha(st["raw"]),
                "all_signatures_verified": True, "signature_fields": 1,
                "before": st["before"], "after": st["after"],
                "metadata": {"signature": str(st["meta"].signature()), "logs": st["logs"],
                             "inner_instructions": str(st["meta"].inner_instructions()),
                             "return_data": str(st["meta"].return_data())},
                "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                          "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
                "loaded_programs": {
                    "pAMM": {"path": "evidence/original/pump_amm/deployed.so",
                             "sha256": IMAGE_SHA[image]},
                    "pFEES": {"path": "evidence/original/pump_fees/deployed.so",
                              "sha256": sha((ROOT / "evidence/original/pump_fees/deployed.so").read_bytes())}},
                "error": st["err"], "rollback_except_payer_fee": st["err"] is not None,
                "payer_delta_lamports": st["payer_delta"],
                "observed": observed,
            })
        if expected[0] == "repeat":
            row[image] = {"error": None, "logs": stages[-1]["logs"], "observed": observed,
                          "stages": len(stages),
                          "stage_logs": [s["logs"] for s in stages]}
        else:
            row[image] = {"error": stages[0]["err"], "logs": stages[0]["logs"], "observed": observed}
        print(f"  {label} [{image}] observed={observed}")
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
report = {
    "scope": "Fresh normally signed original/control/candidate triples pinning "
             "transfer_creator_fees_to_pump (v1, native wSOL path), whose "
             "success path was unmeasured: the handler moves lamports "
             "only, never token amounts. It closes the creator vault "
             "wSOL ATA, recreates that same ATA empty (2,039,280 "
             "lamports, amount 0), then transfers ALL authority "
             "lamports to the pump creator vault, leaving the "
             "authority at zero. The gate is a lamport minimum "
             "(rent(165) + pump-vault deficit, deficit saturating "
             "at zero); below it the handler returns Ok silently, "
             "changing nothing except the payer's 5,000 fee. "
             "Available counts only the vault ATA's lamports. The "
             "recreated ATA makes the handler re-runnable: a second "
             "call transfers 0. Validation: synthetic mint gives "
             "6007, wrong pump-vault or authority seeds give 2006, "
             "a missing vault gives 3012, a Token-2022 token program "
             "for a Token vault gives 2009. Receipts are stored as "
             "parts to stay under GitHub's 25MB web-upload limit; "
             "verify.py reads them in order.",
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
    "classifications": {"transfer-v1-native": 19},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")
