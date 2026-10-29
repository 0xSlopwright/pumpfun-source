#!/usr/bin/env python3
"""Build research/amm-buyback-token22-transfer-fee-20261029 receipts.

The buyback leg of trade_v2 / buy_exact_quote_in_v2 under a Token-2022
quote transfer fee (2nd run packet #6; run 1 #14/#12 measured only the
user receipt, never the buyback recipient delta, and run 1 #18 measured
buyback authorization only against the plain Token program). Pinned at
runtime:

- buy_v2 (10^10 base out): no fee -> buyback +8,486, user spends
  1,847,796, vault quote +1,839,310. Quote tf 1% -> the user grosses
  up BOTH legs: spends 1,866,375, vault still receives exactly
  1,839,310, buyback receives 8,401 (8,486 - 85 withheld). Quote
  tf 50% -> user spends 3,687,106, buyback receives 4,243. Quote
  tf 50% with a 100 cap -> user spends 1,847,896 (vault + buyback
  net + 100 + 100 capped withholding), buyback receives 8,386
  (8,486 - 100). Quote tf 100% -> Overflow 6023 at
  transfer_fee.rs:67 (the buy gross-up, amount_before_fee, divides
  by zero) before any transfer;
- sell_v2 (10^9 base in): no fee -> user +180,212, vault -181,061,
  buyback +849. Quote tf 1% -> user +178,409 (1,803 withheld),
  buyback +840 (9 withheld), vault still pays the full gross
  181,061. Quote tf 50% -> user +90,106, buyback +424 (425
  withheld). Quote tf 50% with a 100 cap -> user +180,112,
  buyback +749 (100 withheld each). Quote tf 100% with limit 0 ->
  success with user 0 and buyback 0: the whole payout is withheld
  while the vault is still debited the gross 181,061;
- buy_exact_quote_in_v2 (10^9 quote in): no fee -> user spends
  10^9, vault +995,407,407, buyback +4,592,593, base out
  5,368,809,031,467. Quote tf 1% -> the available amount is
  computed first, so the user spends only 999,954,075, vault
  +985,453,333, buyback +4,501,200, base out 5,315,544,542,190.
  Quote tf 100% -> available is 0 -> 6039
  BuyNotEnoughQuoteTokensToCoverFees at trade_v2.rs:770;
- authorization under a Token-2022 quote program: a buyback ATA
  still owned by the plain Token program fails 6027
  AccountTypeNotSupported at trade_v2.rs:138 (buy and sell);
  a Token-2022 ATA of an unauthorized owner fails 6053
  BuybackFeeRecipientNotAuthorized at global_config.rs:336; a
  Token-2022 ATA of the authorized owner but for the base mint
  fails 6009 InvalidQuoteMint at trade_v2.rs:146;
- every success funds the user volume accumulator with exactly
  1,844,400 lamports (137 bytes, payer key at [8:40]), so the
  payer delta is -1,849,400 (rent + 5,000 fee). Every error rolls
  back everything except the payer's 5,000 fee (the unsigned case
  is paid by OUTSIDER);
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
from types import SimpleNamespace

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
    base, f, pool, quote, token, transferfee, userbase, userquote, vaultbase,
    vaultquote,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, volume

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-buyback-token22-transfer-fee-20261029"
WS = Path.home() / "workspace/slop-verify"

IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
FEES_SHA = hashlib.sha256((ROOT / "evidence/original/pump_fees/deployed.so").read_bytes()).hexdigest()
PUMP_SHA = hashlib.sha256((ROOT / "evidence/original/pump/deployed.so").read_bytes()).hexdigest()

ATA = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
BB22 = Pubkey.find_program_address([bytes(BB_OWNER), bytes(TOKEN22), bytes(quote)], ATA)[0]
WRONG22 = Pubkey.find_program_address([bytes(OUTSIDER.pubkey()), bytes(TOKEN22), bytes(quote)], ATA)[0]
BASEMINT22 = Pubkey.find_program_address([bytes(BB_OWNER), bytes(TOKEN22), bytes(base)], ATA)[0]

WATCH = {
    "userbase": userbase,
    "userquote": userquote,
    "vaultbase": vaultbase,
    "vaultquote": vaultquote,
    "buyback": buyback,
    "buyback22": BB22,
}

# deltas use the fixture token-account amount at offset 64; buyback22 is
# None in no-fee cases (the Token-2022 ATA is never created there).
BUY_NOTF = {"userbase": 10**10, "userquote": -1847796, "vaultbase": -10**10,
             "vaultquote": 1839310, "buyback": 8486, "buyback22": None}
BUY_TF100 = {"userbase": 10**10, "userquote": -1866375, "vaultbase": -10**10,
             "vaultquote": 1839310, "buyback": 0, "buyback22": 8401}
BUY_TF5000 = {"userbase": 10**10, "userquote": -3687106, "vaultbase": -10**10,
              "vaultquote": 1839310, "buyback": 0, "buyback22": 4243}
BUY_TF5000_MAX100 = {"userbase": 10**10, "userquote": -1847896, "vaultbase": -10**10,
                     "vaultquote": 1839310, "buyback": 0, "buyback22": 8386}
SELL_NOTF = {"userbase": -10**9, "userquote": 180212, "vaultbase": 10**9,
             "vaultquote": -181061, "buyback": 849, "buyback22": None}
SELL_TF100 = {"userbase": -10**9, "userquote": 178409, "vaultbase": 10**9,
              "vaultquote": -181061, "buyback": 0, "buyback22": 840}
SELL_TF5000 = {"userbase": -10**9, "userquote": 90106, "vaultbase": 10**9,
               "vaultquote": -181061, "buyback": 0, "buyback22": 424}
SELL_TF5000_MAX100 = {"userbase": -10**9, "userquote": 180112, "vaultbase": 10**9,
                      "vaultquote": -181061, "buyback": 0, "buyback22": 749}
SELL_TF10000 = {"userbase": -10**9, "userquote": 0, "vaultbase": 10**9,
                "vaultquote": -181061, "buyback": 0, "buyback22": 0}
EXACT_NOTF = {"userbase": 5368809031467, "userquote": -10**9,
              "vaultbase": -5368809031467, "vaultquote": 995407407,
              "buyback": 4592593, "buyback22": None}
EXACT_TF100 = {"userbase": 5315544542190, "userquote": -999954075,
               "vaultbase": -5315544542190, "vaultquote": 985453333,
               "buyback": 0, "buyback22": 4501200}

# (label, instruction, amount, limit, override, unsigned, expected)
# override: notf | tf100 | tf5000 | tf5000max100 | tf10000 | tokenata |
#           wrongowner | wrongmint
# expected: ("trade", delta-dict) | ("error", code, fragment)
CASES = [
    ("buy-notf", "buy_v2", 10**10, 2**64 - 1, "notf", False, ("trade", BUY_NOTF)),
    ("buy-tf100", "buy_v2", 10**10, 2**64 - 1, "tf100", False, ("trade", BUY_TF100)),
    ("buy-tf5000", "buy_v2", 10**10, 2**64 - 1, "tf5000", False, ("trade", BUY_TF5000)),
    ("buy-tf5000-max100", "buy_v2", 10**10, 2**64 - 1, "tf5000max100", False, ("trade", BUY_TF5000_MAX100)),
    ("buy-tf10000", "buy_v2", 10**10, 2**64 - 1, "tf10000", False, ("error", "6023", "Overflow")),
    ("sell-notf", "sell_v2", 10**9, 1, "notf", False, ("trade", SELL_NOTF)),
    ("sell-tf100", "sell_v2", 10**9, 1, "tf100", False, ("trade", SELL_TF100)),
    ("sell-tf5000", "sell_v2", 10**9, 1, "tf5000", False, ("trade", SELL_TF5000)),
    ("sell-tf5000-max100", "sell_v2", 10**9, 1, "tf5000max100", False, ("trade", SELL_TF5000_MAX100)),
    ("sell-tf10000-limit0", "sell_v2", 10**9, 0, "tf10000", False, ("trade", SELL_TF10000)),
    ("buyexact-notf", "buy_exact_quote_in_v2", 10**9, 1, "notf", False, ("trade", EXACT_NOTF)),
    ("buyexact-tf100", "buy_exact_quote_in_v2", 10**9, 1, "tf100", False, ("trade", EXACT_TF100)),
    ("buyexact-tf10000", "buy_exact_quote_in_v2", 10**9, 1, "tf10000", False, ("error", "6039", "BuyNotEnoughQuoteTokensToCoverFees")),
    ("buy-tf100-token-ata", "buy_v2", 10**10, 2**64 - 1, "tokenata", False, ("error", "6027", "AccountTypeNotSupported")),
    ("buy-tf100-wrong-owner", "buy_v2", 10**10, 2**64 - 1, "wrongowner", False, ("error", "6053", "BuybackFeeRecipientNotAuthorized")),
    ("buy-tf100-wrong-mint", "buy_v2", 10**10, 2**64 - 1, "wrongmint", False, ("error", "6009", "InvalidQuoteMint")),
    ("sell-tf100-token-ata", "sell_v2", 10**9, 1, "tokenata", False, ("error", "6027", "AccountTypeNotSupported")),
    ("buy-unsigned-tf100", "buy_v2", 10**10, 2**64 - 1, "tf100", True, ("error", "3010", "AccountNotSigner")),
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        if not a or a.executable:
            out[str(k)] = None
        else:
            out[str(k)] = {"lamports": a.lamports, "owner": str(a.owner),
                           "data_hex": bytes(a.data).hex()}
    return out


def amount_at(data_hex, offset):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


def make_override(kind):
    def ov(h, m):
        if kind == "notf":
            return
        if kind in ("tf100", "tf5000", "tf5000max100", "tf10000"):
            bps, maximum = {"tf100": (100, 2**64 - 1), "tf5000": (5000, 2**64 - 1),
                            "tf5000max100": (5000, 100), "tf10000": (10000, 2**64 - 1)}[kind]
            transferfee(quote, bps, maximum)(h, m)
            m[10] = AccountMeta(TOKEN22, False, False)
            a = h.vm.get_account(buyback)
            d = bytearray(a.data[:165]) + bytes([2]) + struct.pack('<HHQ', 2, 8, 0)
            h.vm.set_account(BB22, Account(a.lamports, bytes(d), TOKEN22))
            m[14] = AccountMeta(BB22, False, True)
            return
        if kind == "tokenata":
            transferfee(quote, 100)(h, m)
            m[10] = AccountMeta(TOKEN22, False, False)
            return
        if kind in ("wrongowner", "wrongmint"):
            transferfee(quote, 100)(h, m)
            m[10] = AccountMeta(TOKEN22, False, False)
            key, mint = (WRONG22, quote) if kind == "wrongowner" else (BASEMINT22, base)
            a = h.vm.get_account(buyback)
            d = bytearray(a.data[:165]) + bytes([2]) + struct.pack('<HHQ', 2, 8, 0)
            d[:32] = bytes(mint)
            h.vm.set_account(key, Account(a.lamports, bytes(d), TOKEN22))
            m[14] = AccountMeta(key, False, True)
            return
        raise ValueError(kind)
    return ov


receipts_global = []
report_cases = []
for index, (label, name, amount, limit, override, unsigned, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    row = {"case": {"instruction": name, "label": label,
                    "amount": amount, "limit": limit,
                    "override": override, "unsigned": unsigned,
                    "expected": {"kind": expected[0],
                                 **({"deltas": expected[1]} if expected[0] == "trade" else
                                    {"code": expected[1], "fragment": expected[2]})}}}
    for image in ("original", "control", "candidate"):
        h = Harness(IMAGES[image])
        vm = h.vm
        vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
        for pid, p in [(TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                       (TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so"),
                       (FEES, "evidence/original/pump_fees/deployed.so")]:
            vm.add_program_from_file(pid, ROOT / p)
        glob = bytearray(RAW)
        glob[56] = 0
        vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
        for n, rrow in f["accounts"].items():
            vm.set_account(Pubkey.from_string(rrow["address"]),
                           Account(rrow["lamports"], base64.b64decode(rrow["data_base64"]),
                                   Pubkey.from_string(rrow["owner"])))
        for k, m, native in ((userbase, base, False), (userquote, quote, True)):
            vm.set_account(k, Account(10**15 + 2039280 if native else 10**9,
                                      token(m, PAYER.pubkey(), 10**15, native), TOKEN))
        vm.set_account(volume, Account(0, b"", Pubkey.default()))
        if unsigned:
            vm.set_account(OUTSIDER.pubkey(), Account(10**9, b"", Pubkey.default()))
        keys = [pool, PAYER.pubkey(), CONFIG_KEY, base, quote, userbase, userquote,
                vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
                buyback, EVENT, PROGRAM]
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])]
        make_override(override)(SimpleNamespace(vm=vm), metas)
        payer = OUTSIDER if unsigned else PAYER
        if unsigned:
            metas[1] = AccountMeta(PAYER.pubkey(), False, True)
        data = bytes(ix["discriminator"]) + struct.pack("<QQ", amount, limit)
        before_keys = sorted({str(m.pubkey) for m in metas} | {str(payer.pubkey()),
                              str(buyback), str(BB22), str(WRONG22), str(BASEMINT22)}, key=str)
        before = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        tx = Transaction.new_signed_with_payer(
            [Instruction(PROGRAM, data, metas)], payer.pubkey(), [payer], vm.latest_blockhash())
        raw = bytes(tx)
        checks = tx.verify_with_results()
        assert checks and all(checks), "new transaction must verify"
        r = vm.send_transaction(tx)
        failed = isinstance(r, FailedTransactionMetadata)
        meta = r.meta() if failed else r
        after = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        err = str(r.err()) if failed else None
        logs = meta.logs()
        payer_key = str(payer.pubkey())
        payer_delta = after[payer_key]["lamports"] - before[payer_key]["lamports"] \
            if before[payer_key] and after[payer_key] else None
        observed = {}
        if expected[0] == "trade":
            assert not failed and err is None, (label, image, err)
            deltas = {}
            for wname, key in WATCH.items():
                b, a = before[str(key)], after[str(key)]
                if b is None or a is None:
                    deltas[wname] = None
                else:
                    deltas[wname] = amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            assert deltas == expected[1], (label, image, deltas, expected[1])
            assert payer_delta == -1849400, (label, image, payer_delta)
            vol = after[str(volume)]
            assert vol is not None and vol["lamports"] == 1844400, (label, image, vol)
            assert len(bytes.fromhex(vol["data_hex"])) == 137, (label, image, len(bytes.fromhex(vol["data_hex"])))
            assert bytes.fromhex(vol["data_hex"])[8:40] == bytes(PAYER.pubkey()), (label, image, "volume user")
            observed = {"deltas": deltas, "payer_lamports_delta": payer_delta,
                        "volume_lamports": 1844400, "volume_data_len": 137}
        else:
            assert failed and err is not None and expected[1] in err, (label, image, err)
            assert expected[2] in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == -5000, (label, image, payer_delta)
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            row.setdefault("error_sites", {})[image] = site
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback")
            observed = {"error_code": expected[1], "fragment": expected[2],
                        "payer_lamports_delta": payer_delta}
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": name,
                        "label": label},
            "transaction_base64": base64.b64encode(raw).decode(),
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
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
                          "sha256": FEES_SHA},
                "pPUMP": {"path": "evidence/original/pump/deployed.so",
                          "sha256": PUMP_SHA}},
            "error": err, "rollback_except_payer_fee": err is not None,
            "payer_fee_lamports": -payer_delta if payer_delta is not None else None,
            "observed": observed,
        })
        row[image] = {"error": err, "logs": logs,
                      "accounts": {k: v for k, v in after.items()},
                      "observed": observed}
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
             "the buyback leg of trade_v2 and buy_exact_quote_in_v2 under "
             "a Token-2022 quote transfer fee: buy_v2 10^10 base out moves "
             "the buyback recipient by +8,486 with no fee, +8,401 at 1%, "
             "+4,243 at 50%, +8,386 at 50% with a 100 cap, and fails "
             "Overflow 6023 at 100%; sell_v2 10^9 base in moves it by +849 "
             "with no fee, +840 at 1%, +424 at 50%, +749 at 50% with a 100 "
             "cap, and 0 at 100% with limit 0 while the vault still pays "
             "the gross 181,061; buy_exact_quote_in_v2 10^9 quote in moves "
             "it by +4,592,593 with no fee and +4,501,200 at 1%, and fails "
             "6039 at 100%. Under a Token-2022 quote program a plain-Token "
             "buyback ATA fails 6027, an unauthorized Token-2022 ATA fails "
             "6053, and a Token-2022 ATA for the base mint fails 6009. "
             "Every success funds the user volume accumulator with "
             "1,844,400 lamports (payer delta -1,849,400 with the 5,000 "
             "fee). All error cases roll back everything except the "
             "payer's 5,000 fee. All three images behave identically. "
             "Receipts are stored as parts to stay under GitHub's 25MB "
             "web-upload limit; verify.py reads them in order.",
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
        "evidence/original/pump_fees/deployed.so": FEES_SHA,
        "evidence/original/pump/deployed.so": PUMP_SHA,
    },
    "counts": {"vms": len(receipts_global), "transactions": len(receipts_global),
               "signature_fields": len(receipts_global)},
    "case_count": len(report_cases),
    "classifications": {"buyback-token22-transfer-fee": len(report_cases)},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")
