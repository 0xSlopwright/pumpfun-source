#!/usr/bin/env python3
"""Build research/amm-transfer-v2-token22-20261029 receipts.

transfer_creator_fees_to_pump_v2 CAN move non-native quote fees
when the caller passes the matching Token-2022 program -- the
#49 packet's 2023 ConstraintAssociatedTokenTokenProgram only
shows when the Token program is passed for Token-2022 accounts
(or vice versa). With the matching program, the vault drains in
full, the destination gains the net amount, the fee is withheld
into the destination's TransferFeeAmount extension, and a
missing destination ATA is created by the handler (payer-funded).
A 100% fee succeeds with zero delivery. Caps bind the withheld
amount only. The fee schedule switches from the older to the
newer schedule exactly at the newer epoch. A destination without
extension space fails with Token-2022 custom error 0xd, while a
pre-existing destination with extension space accumulates
withheld fees. The v1 handler cannot do non-native quotes at all
(6007 UnsupportedQuoteMint), and the native branch rejects a
Token-2022 vault with a balance (custom error 11) because it
tries to close it. The mismatch map is symmetric: TOKEN22
program + Token-owned vault gives 2023, and a Token-derived
destination key gives 2006 ConstraintSeeds.

The fixture quote mint is wSOL, so the non-native path needs a
synthetic non-native mint key (bytes [7]*32, fixture mint data).
Branch selection is by mint key, not by program: the wSOL
contrast cases pin that.
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
OUT = ROOT / "research/amm-transfer-v2-token22-20261029"
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
QUOTE2 = Pubkey(bytes([7] * 32))
VAULT22 = Pubkey.find_program_address([bytes(AUTH), bytes(TOKEN22), bytes(QUOTE2)], ATA)[0]
DEST22 = Pubkey.find_program_address([bytes(PUMPVAULT), bytes(TOKEN22), bytes(QUOTE2)], ATA)[0]
VAULT_T2 = Pubkey.find_program_address([bytes(AUTH), bytes(TOKEN), bytes(QUOTE2)], ATA)[0]
DEST_T2 = Pubkey.find_program_address([bytes(PUMPVAULT), bytes(TOKEN), bytes(QUOTE2)], ATA)[0]
VAULTW = Pubkey.find_program_address([bytes(AUTH), bytes(TOKEN22), bytes(quote)], ATA)[0]
DESTW = Pubkey.find_program_address([bytes(PUMPVAULT), bytes(TOKEN22), bytes(quote)], ATA)[0]

IX2 = next(x for x in IDL["instructions"] if x["name"] == "transfer_creator_fees_to_pump_v2")
IX1 = next(x for x in IDL["instructions"] if x["name"] == "transfer_creator_fees_to_pump")

M = 2 ** 64 - 1


def sha(data):
    return hashlib.sha256(data).hexdigest()


def token_account_data(mint, owner, amount, withheld):
    data = bytearray(165)
    data[0:32] = bytes(mint)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    if withheld is None:
        return bytes(data)
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) + struct.pack("<HHQ", 2, 8, withheld)


def mint_with_tf(base, first, second):
    d = bytearray(base[:82])
    d += bytes(83) + bytes([1])
    conf = bytes(72) + struct.pack("<QQH", *first) + struct.pack("<QQH", *second)
    d += struct.pack("<HH", 1, len(conf)) + conf
    return bytes(d)


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        out[str(k)] = {"owner": str(a.owner), "lamports": a.lamports,
                       "executable": a.executable, "data_hex": a.data.hex()} if a else None
    return out


def amount_at(data_hex, offset):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


# (instruction, label, epoch, mode, expected)
# mode: ("v2", tf, dest, vault_amt) | ("v2token",) | ("v2mismatch", which)
#       | ("v1synth",) | ("v1wsol",) | ("v2wsol",)
# tf: "nofee" | ("tf", bps, maxfee) | ("epoch", older_bps, newer_bps, newer_epoch)
# dest: "init0" | "funds" | "noext" | "none"
# expected: ("transfer", vault_delta, dest_delta, dest_final, withheld|None, dest_len, payer_delta)
#         | ("create", vault_delta, dest_final, withheld, dest_len, payer_delta, dest_lamports)
#         | ("error", code, fragment)
CASES = [
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-nofee", 0,
     ("v2", "nofee", "init0", 123394),
     ("transfer", -123394, 123394, 123394, 0, 182, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-tf100", 0,
     ("v2", ("tf", 100, M), "init0", 123394),
     ("transfer", -123394, 122160, 122160, 1234, 182, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-tf5000", 0,
     ("v2", ("tf", 5000, M), "init0", 123394),
     ("transfer", -123394, 61697, 61697, 61697, 182, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-tf10000", 0,
     ("v2", ("tf", 10000, M), "init0", 123394),
     ("transfer", -123394, 0, 0, 123394, 182, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-tf5000max100", 0,
     ("v2", ("tf", 5000, 100), "init0", 123394),
     ("transfer", -123394, 123294, 123294, 100, 182, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-tf100-destnone", 0,
     ("v2", ("tf", 100, M), "none", 123394),
     ("create", -123394, 122160, 1234, 182, 2162600, 2157600)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-tf100-destfunds", 0,
     ("v2", ("tf", 100, M), "funds", 123394),
     ("transfer", -123394, 122160, 127160, 2234, 182, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-tf100-destnoext", 0,
     ("v2", ("tf", 100, M), "noext", 123394),
     ("error", "13", "Invalid account state for operation")),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-epoch0", 0,
     ("v2", ("epoch", 100, 5000, 10), "init0", 123394),
     ("transfer", -123394, 122160, 122160, 1234, 182, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-epoch9", 9,
     ("v2", ("epoch", 100, 5000, 10), "init0", 123394),
     ("transfer", -123394, 122160, 122160, 1234, 182, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-epoch10", 10,
     ("v2", ("epoch", 100, 5000, 10), "init0", 123394),
     ("transfer", -123394, 61697, 61697, 61697, 182, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-epoch11", 11,
     ("v2", ("epoch", 100, 5000, 10), "init0", 123394),
     ("transfer", -123394, 61697, 61697, 61697, 182, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-tf100-small", 0,
     ("v2", ("tf", 100, M), "init0", 1000),
     ("transfer", -1000, 990, 990, 10, 182, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-tf100-zero", 0,
     ("v2", ("tf", 100, M), "init0", 0),
     ("transfer", 0, 0, 0, 0, 182, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-token-baseline", 0,
     ("v2token",),
     ("transfer", -123394, 123394, 123394, None, 165, 5000)),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-vaulttokenowned", 0,
     ("v2mismatch", "vaulttoken"),
     ("error", "2023", "ConstraintAssociatedTokenTokenProgram")),
    ("transfer_creator_fees_to_pump_v2", "v2-nonnative-desttokenderived", 0,
     ("v2mismatch", "desttoken"),
     ("error", "2006", "ConstraintSeeds")),
    ("transfer_creator_fees_to_pump", "v1-synthetic-mint", 0,
     ("v1synth",),
     ("error", "6007", "UnsupportedQuoteMint")),
    ("transfer_creator_fees_to_pump", "v1-wsol-token22vault", 0,
     ("v1wsol",),
     ("error", "11", "Non-native account can only be closed if its balance is zero")),
    ("transfer_creator_fees_to_pump_v2", "v2-wsol-token22vault", 0,
     ("v2wsol",),
     ("error", "11", "Non-native account can only be closed if its balance is zero")),
]

receipts_global = []
report_cases = []
for index, (instruction, label, epoch, mode, expected) in enumerate(CASES):
    ix = IX2 if instruction.endswith("_v2") else IX1
    row = {"case": {"instruction": instruction, "label": label, "epoch": epoch,
                    "mode": list(mode) if isinstance(mode, tuple) else mode,
                    "expected": list(expected)}}
    for image in ("original", "control", "candidate"):
        h = Harness(IMAGES[image])
        vm = h.vm
        vm.set_clock(Clock(100, 1234567890, epoch, 0, 1234567890))
        for pid, n in ((TOKEN, 'spl_token'), (TOKEN22, 'spl_token_2022'), (ATA, 'associated_token')):
            vm.add_program_from_file(pid, str(ROOT / 'evidence/dependencies' / n / 'deployed.so'))
        rrow = f["accounts"]["quote_mint"]
        base = bytes(base64.b64decode(rrow["data_base64"]))
        kind = mode[0]
        if kind == "v2":
            _, tf, dest, vault_amt = mode
            if tf == "nofee":
                vm.set_account(QUOTE2, Account(rrow["lamports"], base, TOKEN22))
            elif tf[0] == "tf":
                vm.set_account(QUOTE2, Account(rrow["lamports"],
                                               mint_with_tf(base, (0, tf[2], tf[1]), (0, tf[2], tf[1])), TOKEN22))
            else:
                vm.set_account(QUOTE2, Account(rrow["lamports"],
                                               mint_with_tf(base, (0, M, tf[1]), (tf[3], M, tf[2])), TOKEN22))
            vm.set_account(VAULT22, Account(1000 + 2039280,
                                            token_account_data(QUOTE2, AUTH, vault_amt, 0), TOKEN22))
            vm.set_account(AUTH, Account(10 ** 9, b"", Pubkey.default()))
            vm.set_account(PUMPVAULT, Account(10 ** 9, b"", Pubkey.default()))
            if dest == "init0":
                vm.set_account(DEST22, Account(2162600,
                                               token_account_data(QUOTE2, PUMPVAULT, 0, 0), TOKEN22))
            elif dest == "funds":
                vm.set_account(DEST22, Account(2162600,
                                               token_account_data(QUOTE2, PUMPVAULT, 5000, 1000), TOKEN22))
            elif dest == "noext":
                vm.set_account(DEST22, Account(2039280,
                                               token_account_data(QUOTE2, PUMPVAULT, 0, None), TOKEN22))
            keys = [PAYER.pubkey(), QUOTE2, TOKEN22, Pubkey.default(), ATA, CREATOR, AUTH,
                    VAULT22, PUMPVAULT, DEST22, EVENT, PROGRAM]
            vault_key, dest_key = VAULT22, DEST22
        elif kind == "v2token":
            # Plain Token baseline: synthetic mint owned by TOKEN, no extension.
            # Vault/dest lamports are set high: at the standard
            # 2,039,280-lamport rent level the harness rejects the
            # Token transfer with InsufficientFundsForRent (a
            # harness rent artifact; token deltas are unaffected).
            vm.set_account(QUOTE2, Account(rrow["lamports"], base, TOKEN))
            vm.set_account(VAULT_T2, Account(10 ** 9, token(QUOTE2, AUTH, 123394, True), TOKEN))
            vm.set_account(DEST_T2, Account(10 ** 9, token(QUOTE2, PUMPVAULT, 0, True), TOKEN))
            vm.set_account(AUTH, Account(10 ** 9, b"", Pubkey.default()))
            vm.set_account(PUMPVAULT, Account(10 ** 9, b"", Pubkey.default()))
            keys = [PAYER.pubkey(), QUOTE2, TOKEN, Pubkey.default(), ATA, CREATOR, AUTH,
                    VAULT_T2, PUMPVAULT, DEST_T2, EVENT, PROGRAM]
            vault_key, dest_key = VAULT_T2, DEST_T2
        elif kind == "v2mismatch":
            vm.set_account(QUOTE2, Account(rrow["lamports"],
                                           mint_with_tf(base, (0, M, 100), (0, M, 100)), TOKEN22))
            vm.set_account(AUTH, Account(10 ** 9, b"", Pubkey.default()))
            vm.set_account(PUMPVAULT, Account(10 ** 9, b"", Pubkey.default()))
            if mode[1] == "vaulttoken":
                vm.set_account(VAULT22, Account(1000 + 2039280,
                                                token(QUOTE2, AUTH, 123394, True), TOKEN))
                vm.set_account(DEST22, Account(2162600,
                                               token_account_data(QUOTE2, PUMPVAULT, 0, 0), TOKEN22))
            else:
                vm.set_account(VAULT22, Account(1000 + 2039280,
                                                token_account_data(QUOTE2, AUTH, 123394, 0), TOKEN22))
                vm.set_account(DEST_T2, Account(2162600,
                                                token_account_data(QUOTE2, PUMPVAULT, 0, 0), TOKEN22))
            dest_key = DEST22 if mode[1] == "vaulttoken" else DEST_T2
            keys = [PAYER.pubkey(), QUOTE2, TOKEN22, Pubkey.default(), ATA, CREATOR, AUTH,
                    VAULT22, PUMPVAULT, dest_key, EVENT, PROGRAM]
            vault_key = VAULT22
        elif kind == "v1synth":
            vm.set_account(QUOTE2, Account(rrow["lamports"],
                                           mint_with_tf(base, (0, M, 100), (0, M, 100)), TOKEN22))
            vm.set_account(VAULT22, Account(1000 + 2039280,
                                            token_account_data(QUOTE2, AUTH, 123394, 0), TOKEN22))
            vm.set_account(AUTH, Account(10 ** 9, b"", Pubkey.default()))
            vm.set_account(PUMPVAULT, Account(10 ** 9, b"", Pubkey.default()))
            keys = [QUOTE2, TOKEN22, Pubkey.default(), ATA, CREATOR, AUTH,
                    VAULT22, PUMPVAULT, EVENT, PROGRAM]
            vault_key, dest_key = VAULT22, None
        else:  # v1wsol / v2wsol: native branch with a Token-2022 vault
            vm.set_account(quote, Account(rrow["lamports"], base, TOKEN))
            vm.set_account(VAULTW, Account(1000 + 2039280,
                                           token_account_data(quote, AUTH, 1000, 0), TOKEN22))
            vm.set_account(AUTH, Account(10 ** 9, b"", Pubkey.default()))
            vm.set_account(PUMPVAULT, Account(10 ** 9, b"", Pubkey.default()))
            if kind == "v1wsol":
                keys = [quote, TOKEN22, Pubkey.default(), ATA, CREATOR, AUTH,
                        VAULTW, PUMPVAULT, EVENT, PROGRAM]
            else:
                keys = [PAYER.pubkey(), quote, TOKEN22, Pubkey.default(), ATA, CREATOR, AUTH,
                        VAULTW, PUMPVAULT, DESTW, EVENT, PROGRAM]
            vault_key, dest_key = VAULTW, None
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
        events = [l for l in logs if l.startswith("Program data: ")]
        observed = {}
        if expected[0] == "transfer":
            _, vault_delta, dest_delta, dest_final, withheld, dest_len, exp_payer = expected
            assert not failed and err is None, (label, image, err)
            assert events == [], (label, image, events)
            vb = amount_at(before[str(vault_key)]["data_hex"], 64)
            va = amount_at(after[str(vault_key)]["data_hex"], 64)
            db = amount_at(before[str(dest_key)]["data_hex"], 64)
            da = amount_at(after[str(dest_key)]["data_hex"], 64)
            assert va - vb == vault_delta, (label, image, va - vb)
            assert da - db == dest_delta, (label, image, da - db)
            assert da == dest_final, (label, image, da)
            assert len(bytes.fromhex(after[str(dest_key)]["data_hex"])) == dest_len
            if withheld is not None:
                got = amount_at(after[str(dest_key)]["data_hex"], 174)
                assert got == withheld, (label, image, got)
            assert payer_delta == exp_payer, (label, image, payer_delta)
            observed = {"vault_delta": vault_delta, "dest_delta": dest_delta,
                        "dest_final": dest_final, "withheld": withheld,
                        "dest_len": dest_len, "payer_delta": payer_delta, "events": 0}
        elif expected[0] == "create":
            _, vault_delta, dest_final, withheld, dest_len, exp_payer, dest_lamp = expected
            assert not failed and err is None, (label, image, err)
            assert events == [], (label, image, events)
            assert before[str(dest_key)] is None, (label, image, "dest must start missing")
            vb = amount_at(before[str(vault_key)]["data_hex"], 64)
            va = amount_at(after[str(vault_key)]["data_hex"], 64)
            da = amount_at(after[str(dest_key)]["data_hex"], 64)
            assert va - vb == vault_delta, (label, image, va - vb)
            assert da == dest_final, (label, image, da)
            assert amount_at(after[str(dest_key)]["data_hex"], 174) == withheld
            assert len(bytes.fromhex(after[str(dest_key)]["data_hex"])) == dest_len
            assert after[str(dest_key)]["lamports"] == dest_lamp, (label, image)
            assert payer_delta == exp_payer, (label, image, payer_delta)
            observed = {"vault_delta": vault_delta, "dest_final": dest_final,
                        "withheld": withheld, "dest_len": dest_len,
                        "payer_delta": payer_delta, "dest_lamports": dest_lamp, "events": 0}
        else:
            _, code, fragment = expected
            assert failed and err is not None and code in err, (label, image, err)
            assert fragment in "\n".join(logs), (label, image, logs[-3:])
            assert events == [], (label, image, events)
            assert payer_delta == 5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback")
            observed = {"error": code, "fragment": fragment, "payer_delta": 5000}
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image,
                        "instruction": instruction, "label": label},
            "transaction_base64": base64.b64encode(raw).decode(),
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
            "all_signatures_verified": True, "signature_fields": 1,
            "before": before, "after": after,
            "metadata": {"signature": str(meta.signature()), "logs": logs,
                         "inner_instructions": str(meta.inner_instructions()),
                         "return_data": str(meta.return_data())},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": epoch,
                      "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
            "loaded_programs": {
                "pAMM": {"path": "evidence/original/pump_amm/deployed.so",
                         "sha256": IMAGE_SHA[image]},
                "pFEES": {"path": "evidence/original/pump_fees/deployed.so",
                          "sha256": sha((ROOT / "evidence/original/pump_fees/deployed.so").read_bytes())}},
            "error": err, "rollback_except_payer_fee": err is not None,
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
    print(name, len(data), "bytes")
report = {
    "scope": "Fresh normally signed original/control/candidate triples pinning "
             "transfer_creator_fees_to_pump_v2 for a non-native quote "
             "under a matching Token-2022 program: the vault drains in "
             "full, the destination gains the net amount, the fee is "
             "withheld into the destination's TransferFeeAmount "
             "extension, and a missing destination ATA is created by "
             "the handler (payer-funded). A 100% fee succeeds with "
             "zero delivery. Caps bind the withheld amount only. The "
             "fee schedule switches from the older to the newer "
             "schedule exactly at the newer epoch. A destination "
             "without extension space fails with Token-2022 custom "
             "error 0xd, while a pre-existing destination with "
             "extension space accumulates withheld fees. The v1 "
             "handler cannot do non-native quotes at all (6007 "
             "UnsupportedQuoteMint), and the native branch rejects "
             "a Token-2022 vault with a balance (custom error 11). "
             "The mismatch map is symmetric with #49: TOKEN22 "
             "program + Token-owned vault gives 2023, and a "
             "Token-derived destination key gives 2006 "
             "ConstraintSeeds. The fixture quote mint is wSOL, so "
             "the non-native path uses a synthetic mint key and "
             "branch selection is by mint key, not by program. "
             "Receipts are stored as parts to stay under GitHub's "
             "25MB web-upload limit; verify.py reads them in order.",
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
    "classifications": {"transfer-v2-token22": 20},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")
