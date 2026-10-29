#!/usr/bin/env python3
"""Build research/amm-trade-dual-transfer-fee-20261029 receipts.

Trade_v2 / buy_exact_quote_in_v2 under Token-2022 transfer fees on
BOTH mints at once (2nd run packet #7; run 1 #14/#12/#43 and 2nd #6
measured only one taxed side at a time). Pinned at runtime:

- buy_v2 (10^10 base out): no fee -> user +10^10, spends 1,847,796,
  vault -10^10 / +1,839,310, buyback +8,486. Base 1% + quote 1% ->
  user +9,900,000,000 (base withholding), spends 1,866,375 (quote
  gross-up, identical to the quote-only figure), vault moves the
  GROSS on both sides (-10^10 / +1,839,310), buyback +8,401. Base
  50% + quote 50% -> user +5,000,000,000, spends 3,687,106,
  buyback +4,243. Base 100% + quote 1% -> user receives 0 but the
  trade still succeeds, vault still debited the gross 10^10. Base
  1% + quote 100% -> Overflow 6023 (the quote gross-up divides by
  zero) before any transfer. Caps of 100 on both legs at 50% ->
  user +9,999,999,900 (base withholding capped at 100), spends
  1,847,896 (no-fee spend + 100), buyback +8,386;
- the buy limit is checked against the GROSSED spend: base 1% +
  quote 1% with max_quote set to the no-fee spend 1,847,796 fails
  6004 ExceededSlippage, while max_quote set to the grossed spend
  1,866,375 succeeds (inclusive);
- sell_v2 (10^9 base in): no fee -> user +180,212, vault
  +10^9 / -181,061, buyback +849. Base 1% + quote 1% -> user
  +178,409, vault receives only the NET 990,000,000 base but still
  pays the full GROSS quote payout 181,061: the payout is computed
  from the gross amount in, not from what the vault received. Base
  100% + quote 1% -> vault receives 0 base yet still pays the
  gross 181,061. Base 1% + quote 100% with limit 1 fails 6004 (the
  net receipt 0 is below the limit), while limit 0 succeeds with
  user 0 and buyback 0 and the vault still debited the gross
  181,061. The sell limit is net-receipt based and inclusive:
  limit 178,409 succeeds. Caps of 100 on both legs at 50% ->
  user +180,112, vault +999,999,900 (gross in minus the 100 cap);
- buy_exact_quote_in_v2 (10^7 quote in): no fee -> user
  +54,115,018,303, spends 10,000,000, vault -54,115,018,303 /
  +9,954,074, buyback +45,926. Base 1% + quote 1% -> user
  +53,038,168,841 (the quote-only gross 53,573,907,921 net of the
  1% base withholding), spends 9,999,541 (available-first, as in
  the quote-only case), vault -53,573,907,921 / +9,854,533,
  buyback +45,012. Base 100% + quote 1% -> user receives 0, vault
  still debited the gross 53,573,907,921. Base 1% + quote 100% ->
  6039 BuyNotEnoughQuoteTokensToCoverFees (available is 0). Caps
  of 100 on both legs at 50% -> user +54,114,475,811 (gross
  54,114,475,911 minus the 100 base cap), spends the full
  10,000,000, vault +9,953,975, buyback +45,825;
- unsigned payer under both fees fails 3010 AccountNotSigner;
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
    base, combine, f, pool, quote, token, userbase, userquote, vaultbase,
    vaultquote,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, trade_transferfee, volume

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-trade-dual-transfer-fee-20261029"
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

WATCH = {
    "userbase": userbase,
    "userquote": userquote,
    "vaultbase": vaultbase,
    "vaultquote": vaultquote,
    "buyback": buyback,
    "buyback22": BB22,
}

BUY_NOTF = {"userbase": 10**10, "userquote": -1847796, "vaultbase": -10**10,
            "vaultquote": 1839310, "buyback": 8486, "buyback22": None}
SELL_NOTF = {"userbase": -10**9, "userquote": 180212, "vaultbase": 10**9,
             "vaultquote": -181061, "buyback": 849, "buyback22": None}
EXACT_NOTF = {"userbase": 54115018303, "userquote": -10000000, "vaultbase": -54115018303,
              "vaultquote": 9954074, "buyback": 45926, "buyback22": None}
BUY_B100_Q100 = {"userbase": 9900000000, "userquote": -1866375, "vaultbase": -10**10,
                 "vaultquote": 1839310, "buyback": 0, "buyback22": 8401}
BUY_B5000_Q5000 = {"userbase": 5000000000, "userquote": -3687106, "vaultbase": -10**10,
                   "vaultquote": 1839310, "buyback": 0, "buyback22": 4243}
BUY_B10000_Q100 = {"userbase": 0, "userquote": -1866375, "vaultbase": -10**10,
                   "vaultquote": 1839310, "buyback": 0, "buyback22": 8401}
BUY_CAPS = {"userbase": 9999999900, "userquote": -1847896, "vaultbase": -10**10,
            "vaultquote": 1839310, "buyback": 0, "buyback22": 8386}
SELL_B100_Q100 = {"userbase": -10**9, "userquote": 178409, "vaultbase": 990000000,
                  "vaultquote": -181061, "buyback": 0, "buyback22": 840}
SELL_B5000_Q5000 = {"userbase": -10**9, "userquote": 90106, "vaultbase": 500000000,
                    "vaultquote": -181061, "buyback": 0, "buyback22": 424}
SELL_B10000_Q100 = {"userbase": -10**9, "userquote": 178409, "vaultbase": 0,
                    "vaultquote": -181061, "buyback": 0, "buyback22": 840}
SELL_B100_Q10000_L0 = {"userbase": -10**9, "userquote": 0, "vaultbase": 990000000,
                       "vaultquote": -181061, "buyback": 0, "buyback22": 0}
SELL_CAPS = {"userbase": -10**9, "userquote": 180112, "vaultbase": 999999900,
             "vaultquote": -181061, "buyback": 0, "buyback22": 749}
EXACT_B100_Q100 = {"userbase": 53038168841, "userquote": -9999541, "vaultbase": -53573907921,
                   "vaultquote": 9854533, "buyback": 0, "buyback22": 45012}
EXACT_B10000_Q100 = {"userbase": 0, "userquote": -9999541, "vaultbase": -53573907921,
                     "vaultquote": 9854533, "buyback": 0, "buyback22": 45012}
EXACT_CAPS = {"userbase": 54114475811, "userquote": -10000000, "vaultbase": -54114475911,
              "vaultquote": 9953975, "buyback": 0, "buyback22": 45825}

# (label, instruction, amount, limit, override, unsigned, expected)
# override: "notf" | ("both", base_bps, quote_bps, base_max, quote_max)
# expected: ("trade", delta-dict) | ("error", code, fragment)
MAX = 2**64 - 1
CASES = [
    ("buy-notf", "buy_v2", 10**10, MAX, "notf", False, ("trade", BUY_NOTF)),
    ("sell-notf", "sell_v2", 10**9, 1, "notf", False, ("trade", SELL_NOTF)),
    ("exact-notf", "buy_exact_quote_in_v2", 10**7, 1, "notf", False, ("trade", EXACT_NOTF)),
    ("buy-b100-q100", "buy_v2", 10**10, MAX, ("both", 100, 100, MAX, MAX), False, ("trade", BUY_B100_Q100)),
    ("buy-b5000-q5000", "buy_v2", 10**10, MAX, ("both", 5000, 5000, MAX, MAX), False, ("trade", BUY_B5000_Q5000)),
    ("buy-b10000-q100", "buy_v2", 10**10, MAX, ("both", 10000, 100, MAX, MAX), False, ("trade", BUY_B10000_Q100)),
    ("buy-b100-q10000", "buy_v2", 10**10, MAX, ("both", 100, 10000, MAX, MAX), False, ("error", "6023", "Overflow")),
    ("buy-b100-q100-limit-nofee", "buy_v2", 10**10, 1847796, ("both", 100, 100, MAX, MAX), False, ("error", "6004", "ExceededSlippage")),
    ("buy-b100-q100-limit-gross", "buy_v2", 10**10, 1866375, ("both", 100, 100, MAX, MAX), False, ("trade", BUY_B100_Q100)),
    ("buy-caps", "buy_v2", 10**10, MAX, ("both", 5000, 5000, 100, 100), False, ("trade", BUY_CAPS)),
    ("sell-b100-q100", "sell_v2", 10**9, 1, ("both", 100, 100, MAX, MAX), False, ("trade", SELL_B100_Q100)),
    ("sell-b5000-q5000", "sell_v2", 10**9, 1, ("both", 5000, 5000, MAX, MAX), False, ("trade", SELL_B5000_Q5000)),
    ("sell-b10000-q100", "sell_v2", 10**9, 1, ("both", 10000, 100, MAX, MAX), False, ("trade", SELL_B10000_Q100)),
    ("sell-b100-q10000-limit1", "sell_v2", 10**9, 1, ("both", 100, 10000, MAX, MAX), False, ("error", "6004", "ExceededSlippage")),
    ("sell-b100-q10000-limit0", "sell_v2", 10**9, 0, ("both", 100, 10000, MAX, MAX), False, ("trade", SELL_B100_Q10000_L0)),
    ("sell-b100-q100-limit-net", "sell_v2", 10**9, 178409, ("both", 100, 100, MAX, MAX), False, ("trade", SELL_B100_Q100)),
    ("sell-caps", "sell_v2", 10**9, 1, ("both", 5000, 5000, 100, 100), False, ("trade", SELL_CAPS)),
    ("exact-b100-q100", "buy_exact_quote_in_v2", 10**7, 1, ("both", 100, 100, MAX, MAX), False, ("trade", EXACT_B100_Q100)),
    ("exact-b10000-q100", "buy_exact_quote_in_v2", 10**7, 1, ("both", 10000, 100, MAX, MAX), False, ("trade", EXACT_B10000_Q100)),
    ("exact-b100-q10000", "buy_exact_quote_in_v2", 10**7, 1, ("both", 100, 10000, MAX, MAX), False, ("error", "6039", "BuyNotEnoughQuoteTokensToCoverFees")),
    ("exact-caps", "buy_exact_quote_in_v2", 10**7, 1, ("both", 5000, 5000, 100, 100), False, ("trade", EXACT_CAPS)),
    ("buy-b100-q100-unsigned", "buy_v2", 10**10, MAX, ("both", 100, 100, MAX, MAX), True, ("error", "3010", "AccountNotSigner")),
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


def make_override(override):
    def ov(h, m):
        if override == "notf":
            return
        _, bbps, qbps, bmax, qmax = override
        combine(trade_transferfee(base, bbps, bmax),
                trade_transferfee(quote, qbps, qmax))(h, m)
    return ov


receipts_global = []
report_cases = []
for index, (label, name, amount, limit, override, unsigned, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    row = {"case": {"instruction": name, "label": label,
                    "amount": amount, "limit": limit,
                    "override": label if override == "notf" else
                                "both-%s-%s" % (override[1], override[2]),
                    "unsigned": unsigned,
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
                              str(buyback), str(BB22)}, key=str)
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
            observed = {"deltas": deltas, "payer_lamports_delta": -1849400,
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
                        "payer_lamports_delta": -5000}
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
             "trade_v2 and buy_exact_quote_in_v2 under Token-2022 transfer "
             "fees on BOTH mints at once: buy_v2 10^10 base out moves the "
             "user by +10^10 with no fee, +9,900,000,000 at base 1% + quote "
             "1% (spending the grossed-up 1,866,375), +5,000,000,000 at 50% "
             "+ 50%, 0 at base 100% + quote 1% while the vault still pays "
             "the gross, and fails Overflow 6023 at base 1% + quote 100%; "
             "the buy limit is checked against the grossed spend (1,847,796 "
             "fails 6004, 1,866,375 succeeds); sell_v2 10^9 base in moves "
             "the user by +180,212 with no fee, +178,409 at 1% + 1% while "
             "the vault receives only the net 990,000,000 base yet still "
             "pays the gross 181,061 quote payout, 0 at base 100% + quote "
             "1% with the vault still paying gross, and fails 6004 at "
             "quote 100% with limit 1 while limit 0 succeeds with user 0; "
             "the sell limit is net-receipt based and inclusive (178,409 "
             "succeeds); buy_exact_quote_in_v2 10^7 quote in moves the user "
             "by +54,115,018,303 with no fee, +53,038,168,841 at 1% + 1%, 0 "
             "at base 100% + quote 1%, and fails 6039 at base 1% + quote "
             "100%; 100 caps on both legs at 50% bind each leg separately "
             "(buy +9,999,999,900 spending 1,847,896, sell +180,112 with "
             "vault +999,999,900, exact +54,114,475,811 spending the full "
             "10,000,000). Every success funds the user volume accumulator "
             "with 1,844,400 lamports (payer delta -1,849,400 with the "
             "5,000 fee). All error cases roll back everything except the "
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
    "classifications": {"trade-dual-transfer-fee": len(report_cases)},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")
