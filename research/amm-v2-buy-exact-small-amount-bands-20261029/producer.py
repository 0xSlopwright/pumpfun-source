#!/usr/bin/env python3
"""Build research/amm-v2-buy-exact-small-amount-bands-20261029 receipts.

2nd run packet #36: v2 `buy_exact_quote_in_v2` small-amount bands.
The exact-in path was never walked at the bottom: 2nd-run #30 mapped
the exact-in wall at the top (amount 10^12, u64::MAX balances), 1st-run
#31 covered trade 0/extremes, and 2nd-run #33 mapped the bottom of the
non-exact buy curve -- but no packet pinned the exact-in estimate /
quote / out ladder for small quote inputs, the two distinct 6040
sites, or the transfer-fee shift of the ladder.

Handler shape (instructions/swap/trade_v2.rs):
- limit guard first (limit 0 -> 6001 ZeroBaseAmount), then amount
  guard (amount 0 -> 6002 ZeroQuoteAmount).
- available = amount_after_fee(amount); available 0 -> 6039
  BuyNotEnoughQuoteTokensToCoverFees (execute_buy_exact_quote site).
- estimate = available * 10000 / (fee_bps + 10000), fee_bps = lp +
  protocol + creator (121 here: 10 + 111 + 0); estimate 0 -> 6039
  (estimate_buy_quote site).
- fees are CEILING divisions on the estimate; required = estimate +
  lp + protocol; quote = estimate - max(required - available, 0);
  quote 0 -> 6040 BuySlippageBelowMinBaseAmountOut
  (estimate_buy_quote site).
- preview_total_quote recomputes the total from the estimate fees;
  quote_final = estimate - max(preview - amount, 0). The fees stay
  pinned to the estimate even after the quote is adjusted down.
- out = base_for_quote(quote_final) = floor(b * (quote_final - 1) /
  (q + quote_final - 1)); out < limit -> 6040 (execute site).
- The BuyEvent for buy_exact reports the GROSS amount in the
  quote_amount_in field (@64) and the NET curve quote in the
  user_quote_amount_in field (@112) -- the reverse of buy_v2, where
  @64 is the curve quote and @112 the total user quote.

Fixture (same synthetic fixture as #33): single tier (0, lp 10 /
protocol 111 / creator 0 bps), pool accrued fees zeroed, virtual
quote reserves 0, base mint supply 10^12, VB = 10^12, VQ = 10^10,
user base/quote 10^15. 3 images (original / #424 control / #427
candidate). The tf override goes through trade_transferfee (as in
#33): the quote mint carries the fee extension, so the pool leg is
grossed up and the buyback leg lands in a Token-2022 ATA.
"""
import base64
import gzip
import hashlib
import json
import shutil
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
    CONFIG, CONFIG_KEY, EVENT, IDL, PAYER, PROGRAM, RAW, TOKEN, TOKEN22,
    base, combine, f, pool, quote, token, userbase, userquote, vaultbase,
    vaultquote, mutate,
)
from pump_amm_trade_v2_differential import (
    FEES, buyback, feeconfig, trade_transferfee, volume,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-v2-buy-exact-small-amount-bands-20261029"
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

MAX = 2**64 - 1
TIERS = [(0, (10, 111, 0))]
SUPPLY = 10**12
VB = 10**12
VQ = 10**10


def deltas(ub, uq, vb, vq, bb, bb22=None):
    return {"userbase": ub, "userquote": uq, "vaultbase": vb,
            "vaultquote": vq, "buyback": bb, "buyback22": bb22}


def zero_deltas():
    return {"userbase": 0, "userquote": 0, "vaultbase": 0,
            "vaultquote": 0, "buyback": 0, "buyback22": None}


# (label, amount, limit, quote_tf_bps_or_None, expected)
# expected ok: ("ok", deltas, event)
#   event = (out, max, quote, lp_bps, lp_fee, protocol_bps, protocol_fee,
#            quote_with_lp_fee, user_quote_amount_in)
#   at offsets (16, 24, 64, 72, 80, 88, 96, 104, 112).
# expected err: ("err", code, fragment)
CASES = [
    ("ex-limit0-amount0", 0, 0, None, ("err", 6001, "ZeroBaseAmount")),
    ("ex-amount0", 0, 1, None, ("err", 6002, "ZeroQuoteAmount")),
    ("ex-limit0", 5, 0, None, ("err", 6001, "ZeroBaseAmount")),
    ("ex-estimate0", 1, 1, None, ("err", 6039, "BuyNotEnoughQuoteTokensToCoverFees")),
    ("ex-quote0", 2, 1, None, ("err", 6040, "BuySlippageBelowMinBaseAmountOut")),
    ("ex-out0", 3, 1, None, ("err", 6040, "BuySlippageBelowMinBaseAmountOut")),
    ("ex-first", 4, 1, None,
     ("ok", deltas(99, -4, -99, 4, 0), (99, 4, 4, 10, 1, 111, 1, 3, 2))),
    ("ex-first-limit-exact", 4, 99, None,
     ("ok", deltas(99, -4, -99, 4, 0), (99, 4, 4, 10, 1, 111, 1, 3, 2))),
    ("ex-first-limit-plus1", 4, 100, None, ("err", 6040, "BuySlippageBelowMinBaseAmountOut")),
    ("ex-a5", 5, 1, None,
     ("ok", deltas(199, -5, -199, 5, 0), (199, 5, 5, 10, 1, 111, 1, 4, 3))),
    ("ex-proto-below", 92, 1, None,
     ("ok", deltas(8899, -92, -8899, 92, 0), (8899, 92, 92, 10, 1, 111, 1, 91, 90))),
    ("ex-proto-above", 93, 1, None,
     ("ok", deltas(8899, -93, -8899, 92, 1), (8899, 93, 93, 10, 1, 111, 2, 91, 90))),
    ("ex-a99", 99, 1, None,
     ("ok", deltas(9499, -99, -9499, 98, 1), (9499, 99, 99, 10, 1, 111, 2, 97, 96))),
    ("ex-a100", 100, 1, None,
     ("ok", deltas(9599, -100, -9599, 99, 1), (9599, 100, 100, 10, 1, 111, 2, 98, 97))),
    ("ex-a100-limit-exact", 100, 9599, None,
     ("ok", deltas(9599, -100, -9599, 99, 1), (9599, 100, 100, 10, 1, 111, 2, 98, 97))),
    ("ex-a100-limit-plus1", 100, 9600, None, ("err", 6040, "BuySlippageBelowMinBaseAmountOut")),
    ("ex-lp-below", 1013, 1, None,
     ("ok", deltas(99899, -1013, -99899, 1007, 6), (99899, 1013, 1013, 10, 1, 111, 12, 1001, 1000))),
    ("ex-lp-above", 1014, 1, None,
     ("ok", deltas(99899, -1014, -99899, 1008, 6), (99899, 1014, 1014, 10, 2, 111, 12, 1002, 1000))),
    ("ex-a1000", 1000, 1, None,
     ("ok", deltas(98699, -1000, -98699, 995, 5), (98699, 1000, 1000, 10, 1, 111, 11, 989, 988))),
    ("ex-a10000", 10000, 1, None,
     ("ok", deltas(987899, -10000, -987899, 9945, 55), (987899, 10000, 10000, 10, 10, 111, 110, 9890, 9880))),
    ("ex-tf-available0", 1, 1, 100, ("err", 6039, "BuyNotEnoughQuoteTokensToCoverFees")),
    ("ex-tf-estimate0", 2, 1, 100, ("err", 6039, "BuyNotEnoughQuoteTokensToCoverFees")),
    ("ex-tf-quote0", 3, 1, 100, ("err", 6040, "BuySlippageBelowMinBaseAmountOut")),
    ("ex-tf-first", 5, 1, 100,
     ("ok", deltas(99, -5, -99, 4, 0, 0), (99, 5, 5, 10, 1, 111, 1, 3, 2))),
    ("ex-tf-a6", 6, 1, 100,
     ("ok", deltas(199, -6, -199, 5, 0, 0), (199, 6, 6, 10, 1, 111, 1, 4, 3))),
    ("ex-tf-a10", 10, 1, 100,
     ("ok", deltas(599, -10, -599, 9, 0, 0), (599, 10, 10, 10, 1, 111, 1, 8, 7))),
    ("ex-tf-a100", 100, 1, 100,
     ("ok", deltas(9499, -100, -9499, 98, 0, 0), (9499, 100, 100, 10, 1, 111, 2, 97, 96))),
    ("ex-tf-a101", 101, 1, 100,
     ("ok", deltas(9499, -100, -9499, 98, 0, 0), (9499, 101, 101, 10, 1, 111, 2, 97, 96))),
    ("ex-tf-a102", 102, 1, 100,
     ("ok", deltas(9599, -101, -9599, 99, 0, 0), (9599, 102, 102, 10, 1, 111, 2, 98, 97))),
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


def fee_table(tiers):
    def apply(h, m):
        a = h.vm.get_account(feeconfig)
        raw = bytes(a.data[:41]) + struct.pack("<QQQ", 25, 5, 0) + struct.pack("<I", len(tiers))
        for threshold, fees in tiers:
            raw += threshold.to_bytes(16, "little") + struct.pack("<QQQ", *fees)
        raw += struct.pack("<I", 0) + bytes(24)
        h.vm.set_account(feeconfig, Account(a.lamports, raw.ljust(4097, b"\0"), a.owner))
    return apply


def set_amount(vm, key, amount):
    a = vm.get_account(key)
    d = bytearray(a.data); d[64:72] = struct.pack("<Q", amount)
    vm.set_account(key, Account(a.lamports, bytes(d), a.owner))


def set_supply(vm, key, supply):
    a = vm.get_account(key)
    d = bytearray(a.data); d[36:44] = struct.pack("<Q", supply)
    vm.set_account(key, Account(a.lamports, bytes(d), a.owner))


def set_pool(vm, vq, mayhem):
    a = vm.get_account(pool)
    d = bytearray(a.data); d[245:261] = vq.to_bytes(16, "little", signed=True); d[243] = mayhem
    d[271:287] = bytes(16)
    vm.set_account(pool, Account(a.lamports, bytes(d), a.owner))


def event_fields(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    assert len(lines) == 1, lines
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    assert len(raw) >= 120, len(raw)
    return tuple(struct.unpack_from("<Q", raw, off)[0]
                 for off in (16, 24, 64, 72, 80, 88, 96, 104, 112))


receipts_global = []
report_cases = []
for index, (label, amount, limit, tf_bps, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == "buy_exact_quote_in_v2")
    if expected[0] == "ok":
        exp = {"kind": "trade", "deltas": expected[1], "event": list(expected[2])}
    else:
        exp = {"kind": "error", "code": expected[1], "fragment": expected[2]}
    row = {"case": {"instruction": "buy_exact_quote_in_v2", "label": label,
                    "amount": amount, "limit": limit,
                    "tiers": [[t, list(fs)] for t, fs in TIERS],
                    "supply": SUPPLY, "vaultbase": VB, "vaultquote": VQ,
                    "mayhem": 0, "feeconfig_len": 4097,
                    "quote_tf_bps": tf_bps,
                    "userquote_amount": 10**15, "userbase_amount": 10**15,
                    "expected": exp}}
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
        vm.set_account(userbase, Account(10**9, token(base, PAYER.pubkey(), 10**15, False), TOKEN))
        vm.set_account(userquote, Account(10**15 + 2039280, token(quote, PAYER.pubkey(), 10**15, True), TOKEN))
        vm.set_account(volume, Account(0, b"", Pubkey.default()))
        keys = [pool, PAYER.pubkey(), CONFIG_KEY, base, quote, userbase, userquote,
                vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
                buyback, EVENT, PROGRAM]
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])]
        combine(fee_table(TIERS))(SimpleNamespace(vm=vm), metas)
        if tf_bps is not None:
            combine(trade_transferfee(quote, tf_bps, MAX))(SimpleNamespace(vm=vm), metas)
        set_amount(vm, vaultbase, VB); set_amount(vm, vaultquote, VQ)
        set_supply(vm, base, SUPPLY); set_pool(vm, 0, 0)
        pool_key = str(metas[0].pubkey)
        recipient_key = str(metas[14].pubkey)
        row["case"].setdefault("pool_keys", {})[image] = pool_key
        row["case"].setdefault("buyback_recipients", {})[image] = recipient_key
        before_keys = sorted({str(m.pubkey) for m in metas} | {str(PAYER.pubkey()), str(BB22)}, key=str)
        before = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        # Fixture checks: fee table, pool vq/mayhem/fees, vault amounts, base supply.
        fc = before[str(feeconfig)]
        assert len(bytes.fromhex(fc["data_hex"])) == 4097, (label, image)
        fcd = bytes.fromhex(fc["data_hex"])
        assert struct.unpack_from("<I", fcd, 65)[0] == len(TIERS), (label, image)
        for i, (t, fs) in enumerate(TIERS):
            assert int.from_bytes(fcd[69 + 40 * i:69 + 40 * i + 16], "little") == t, (label, image, i)
            assert struct.unpack_from("<QQQ", fcd, 69 + 40 * i + 16) == fs, (label, image, i)
        pk = before[pool_key]
        pkd = bytes.fromhex(pk["data_hex"])
        assert pkd[245:261] == (0).to_bytes(16, "little", signed=True), (label, image)
        assert pkd[243] == 0, (label, image)
        assert pkd[271:287] == bytes(16), (label, image)
        assert amount_at(before[str(vaultbase)]["data_hex"], 64) == VB, (label, image)
        assert amount_at(before[str(vaultquote)]["data_hex"], 64) == VQ, (label, image)
        assert amount_at(before[str(base)]["data_hex"], 36) == SUPPLY, (label, image)
        data = bytes(ix["discriminator"]) + struct.pack("<QQ", amount, limit)
        tx = Transaction.new_signed_with_payer(
            [Instruction(PROGRAM, data, metas)], PAYER.pubkey(), [PAYER], vm.latest_blockhash())
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
        payer_delta = after[payer_key]["lamports"] - before[payer_key]["lamports"] \
            if before[payer_key] and after[payer_key] else None
        if expected[0] == "ok":
            assert not failed and err is None, (label, image, err)
            deltas = {}
            for wname, key in (("userbase", userbase), ("userquote", userquote),
                               ("vaultbase", vaultbase), ("vaultquote", vaultquote)):
                b, a = before[str(key)], after[str(key)]
                deltas[wname] = None if b is None or a is None else \
                    amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            b, a = before[recipient_key], after[recipient_key]
            deltas["buyback"] = None if b is None or a is None else \
                amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            b, a = before[str(BB22)], after[str(BB22)]
            deltas["buyback22"] = None if b is None or a is None else \
                amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            assert deltas == expected[1], (label, image, deltas, expected[1])
            assert payer_delta == -1849400, (label, image, payer_delta)
            vol = after[str(volume)]
            assert vol is not None and vol["lamports"] == 1844400, (label, image, vol)
            assert len(bytes.fromhex(vol["data_hex"])) == 137, (label, image, len(bytes.fromhex(vol["data_hex"])))
            assert bytes.fromhex(vol["data_hex"])[8:40] == bytes(PAYER.pubkey()), (label, image, "volume user")
            got_ev = event_fields(logs)
            assert got_ev == expected[2], (label, image, got_ev, expected[2])
            observed = {"deltas": deltas, "payer_lamports_delta": -1849400,
                        "volume_lamports": 1844400, "volume_data_len": 137,
                        "event": list(got_ev)}
            site = None
        else:
            assert failed, (label, image, "expected failure")
            code, fragment = expected[1], expected[2]
            assert f"custom program error: 0x{0x1770 + code:04x}" in err or f"({code})" in err or str(code) in err, (label, image, err)
            assert fragment in "\n".join(logs), (label, image, logs[-3:])
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            if site is None:
                site = next((l for l in logs if "AnchorError occurred." in l), None)
            row.setdefault("error_sites", {})[image] = site
            deltas = {}
            for wname, key in (("userbase", userbase), ("userquote", userquote),
                               ("vaultbase", vaultbase), ("vaultquote", vaultquote)):
                b, a = before[str(key)], after[str(key)]
                deltas[wname] = None if b is None or a is None else \
                    amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            b, a = before[recipient_key], after[recipient_key]
            deltas["buyback"] = None if b is None or a is None else \
                amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            b, a = before[str(BB22)], after[str(BB22)]
            deltas["buyback22"] = None if b is None or a is None else \
                amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            assert deltas == zero_deltas() or (
                tf_bps is not None and deltas["buyback"] == 0 and deltas["buyback22"] == 0
                and deltas["userbase"] == 0 and deltas["userquote"] == 0
                and deltas["vaultbase"] == 0 and deltas["vaultquote"] == 0), (label, image, deltas)
            assert payer_delta == -5000, (label, image, payer_delta)
            vol = after[str(volume)]
            assert vol is None or (vol["lamports"] == 0 and vol["data_hex"] == ""), (label, image, vol)
            assert len([l for l in logs if l.startswith("Program data: ")]) == 0, (label, image, logs)
            # NB: the site line is NOT part of observed: it differs
            # between original and rebuilt images (line numbers move),
            # and observed must agree across all 3 images. Sites live
            # in row["error_sites"] and verify.py checks each image's
            # site against that image's own logs.
            observed = {"deltas": deltas, "payer_lamports_delta": -5000,
                        "volume_lamports": 0, "volume_data_len": 0,
                        "event": None}
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": "buy_exact_quote_in_v2",
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
            "roles": {"fee_payer": str(PAYER.pubkey()), "volume": str(volume),
                      "pool": pool_key, "buyback_recipient": recipient_key,
                      "userbase": str(userbase), "userquote": str(userquote),
                      "vaultbase": str(vaultbase), "vaultquote": str(vaultquote)},
        })
        row[image] = {"error": err, "logs": logs,
                      "accounts": {k: v for k, v in after.items()},
                      "observed": observed}
        print(f"  {label} [{image}] observed={observed}", flush=True)
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
             "the bottom of the v2 exact-in buy curve in "
             "instructions/swap/trade_v2.rs execute_buy_exact_quote and "
             "estimate_buy_quote, on the same synthetic fixture as #33 "
             "(single tier lp 10 / protocol 111 / creator 0, VB 10^12, "
             "VQ 10^10, supply 10^12). The guard order is limit first "
             "(limit 0 -> 6001 ZeroBaseAmount) then amount (amount 0 -> "
             "6002 ZeroQuoteAmount). The estimate ladder: amount 1 gives "
             "estimate 0 -> 6039; amount 2 gives estimate 1 with fees "
             "1 + 1 > available 2, so quote 0 -> 6040 at the "
             "estimate_buy_quote site; amount 3 gives quote 1, so out "
             "0 -> 6040 at the execute site; amount 4 is the first "
             "success (out 99, spend 4, vault +4). The protocol-fee "
             "ceiling step at amounts 92/93 (estimate 90 -> 91, "
             "protocol 1 -> 2) leaves out (8899) and vault (+92) "
             "unchanged while spend moves 92 -> 93 and buyback 0 -> 1. "
             "The lp-fee ceiling step at amounts 1013/1014 (estimate "
             "1000 -> 1001, lp 1 -> 2) leaves out (99899) and buyback "
             "(6) unchanged while spend moves 1013 -> 1014 and vault "
             "1007 -> 1008. Limit inclusivity: amount 4 with limit 99 "
             "succeeds and limit 100 gives 6040; amount 100 with limit "
             "9599 succeeds and limit 9600 gives 6040. The BuyEvent "
             "for buy_exact reports the GROSS amount in the "
             "quote_amount_in field (@64) and the NET curve quote in "
             "the user_quote_amount_in field (@112) -- the reverse of "
             "buy_v2. Under quote tf100 the ladder shifts by the fee: "
             "amount 1 fails 6039 at the available check (not the "
             "estimate check), amount 2 fails 6039 at the estimate "
             "check, amount 3 fails 6040 at the quote-0 site; amount 5 "
             "succeeds with out 99, gross spend 5, net vault +4; "
             "amounts 100 and 101 give identical results (out 9499, "
             "spend 100, vault +98, buyback net 0 with gross 1 fully "
             "withheld) because both map to available 99, while "
             "amount 102 jumps to out 9599, spend 101, vault +99. "
             "Every success funds the user volume accumulator with "
             "1,844,400 lamports (payer delta -1,849,400 with the "
             "5,000 fee); every failure rolls back fully with payer "
             "-5,000 only. All three images behave identically. "
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
        "evidence/upstream/pump.json":
            sha((ROOT / "evidence/upstream/pump.json").read_bytes()),
        "evidence/dependencies/spl_token/deployed.so":
            sha((ROOT / "evidence/dependencies/spl_token/deployed.so").read_bytes()),
        "evidence/dependencies/spl_token_2022/deployed.so":
            sha((ROOT / "evidence/dependencies/spl_token_2022/deployed.so").read_bytes()),
        "evidence/original/pump_fees/deployed.so": FEES_SHA,
        "evidence/original/pump/deployed.so": PUMP_SHA,
        "scripts/pump_amm_admin_differential.py":
            sha((ROOT / "scripts/pump_amm_admin_differential.py").read_bytes()),
        "scripts/pump_amm_liquidity_differential.py":
            sha((ROOT / "scripts/pump_amm_liquidity_differential.py").read_bytes()),
        "scripts/pump_amm_reusable_harness.py":
            sha((ROOT / "scripts/pump_amm_reusable_harness.py").read_bytes()),
        "scripts/pump_amm_trade_v2_differential.py":
            sha((ROOT / "scripts/pump_amm_trade_v2_differential.py").read_bytes()),
    },
    "counts": {"vms": len(receipts_global), "transactions": len(receipts_global),
               "signature_fields": len(receipts_global)},
    "case_count": len(report_cases),
    "classifications": {"v2-buy-exact-small-amount-bands": len(report_cases)},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
shutil.copy(__file__, OUT / "producer.py")
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")

sites_lines = []
for row in report_cases:
    case = row["case"]
    if case["expected"]["kind"] != "error":
        continue
    per = []
    for image in ("original", "control", "candidate"):
        site = row.get("error_sites", {}).get(image, "")
        if site and "thrown in" in site:
            site = site.split("thrown in", 1)[1].strip()
        elif site:
            site = site.replace("Program log: ", "")
        per.append(f"{image} {site}")
    sites_lines.append(f"- {case['label']}: " + "; ".join(per))
SITES = "\n".join(sites_lines)

README = f"""# v2 buy_exact_quote_in small-amount bands

## Problem

The exact-in path was never walked at the bottom. Packet #30 mapped
the exact-in wall at the top (amount 10^12, u64::MAX balances),
packet #31 (1st run) covered trade 0/extremes, and packet #33 (2nd
run) mapped the bottom of the non-exact buy curve -- but no packet
pinned the exact-in estimate / quote / out ladder for small quote
inputs, the two distinct 6040 sites, the guard order, or the
transfer-fee shift of the ladder.

## Cases

All cases `buy_exact_quote_in_v2` (amount = quote in, limit = min
base out) on the same synthetic fixture as #33: single tier (0, lp
10 / protocol 111 / creator 0 bps), pool accrued fees zeroed,
virtual quote reserves 0, base mint supply 10^12, VB = 10^12,
VQ = 10^10, user base/quote 10^15, 3 images each. The quote mint
carries a Token-2022 transfer-fee extension in tf cases, so the
pool leg is grossed up and the buyback leg lands in a Token-2022
ATA.

- ex-limit0-amount0 / ex-amount0 / ex-limit0: guard order (limit
  0 -> 6001 even when amount is also 0; amount 0 with limit 1 ->
  6002).
- ex-estimate0 / ex-quote0 / ex-out0 (amounts 1 / 2 / 3): the
  three-step failure ladder below the first success.
- ex-first / ex-first-limit-exact / ex-first-limit-plus1 (amount
  4, limits 1 / 99 / 100): first success and limit inclusivity.
- ex-a5 (amount 5): the next rung (out 199).
- ex-proto-below / ex-proto-above (amounts 92 / 93): the
  protocol-fee ceiling step.
- ex-a99 / ex-a100 / ex-a100-limit-exact / ex-a100-limit-plus1
  (amounts 99 / 100, limits 1 / 9599 / 9600): buyback onset anchor
  and limit inclusivity at amount 100.
- ex-lp-below / ex-lp-above (amounts 1013 / 1014): the lp-fee
  ceiling step.
- ex-a1000 / ex-a10000: large-amount anchors (out 98699 /
  987899).
- ex-tf-available0 / ex-tf-estimate0 / ex-tf-quote0 (tf100
  amounts 1 / 2 / 3): the same ladder shifted by the fee, with
  the 6039 site moving to the available check for amount 1.
- ex-tf-first / ex-tf-a6 / ex-tf-a10 (tf100 amounts 5 / 6 / 10):
  first tf successes.
- ex-tf-a100 / ex-tf-a101 / ex-tf-a102: the tf plateau pair
  (100 and 101 identical) and the next rung (102).

## Result

Handler shape (instructions/swap/trade_v2.rs): limit is guarded
before amount; available = amount_after_fee(amount); estimate =
available * 10000 / (fee_bps + 10000) with fee_bps = 121 here;
fees are CEILING divisions on the estimate; required = estimate +
lp + protocol; quote = estimate - max(required - available, 0);
preview_total_quote recomputes the total from the estimate fees
and quote_final = estimate - max(preview - amount, 0); the fees
stay pinned to the estimate after the quote is adjusted down;
out = base_for_quote(quote_final) = floor(b * (quote_final - 1) /
(q + quote_final - 1)).

- Guard order: limit 0 gives 6001 ZeroBaseAmount even when amount
  is also 0; amount 0 with limit 1 gives 6002 ZeroQuoteAmount.
- Failure ladder: amount 1 gives estimate 0 -> 6039
  BuyNotEnoughQuoteTokensToCoverFees; amount 2 gives estimate 1
  with fees 1 + 1 > available 2, so quote 0 -> 6040
  BuySlippageBelowMinBaseAmountOut at the estimate_buy_quote
  site; amount 3 gives quote 1, so out 0 -> 6040 at the execute
  site. Same code, two distinct sites for 6040.
- First success: amount 4 gives out 99, spend 4, vault +4,
  buyback 0, event (out 99, max 4, quote 4, lp_bps 10, lp_fee 1,
  protocol_bps 111, protocol_fee 1, quote_with_lp 3,
  user_quote_in 2). Amount 5 gives out 199, spend 5, vault +5.
  Across the early rungs out rises by 100 per unit of quote_final
  (4 -> 99 with quote_final 2, 5 -> 199 with quote_final 3); the
  protocol step breaks the amount link (93 keeps quote_final 90,
  so out stays 8899).
- Protocol step: amounts 92 / 93 move estimate 90 -> 91 and
  protocol 1 -> 2, but out stays 8899 and vault stays +92 while
  spend moves 92 -> 93 and buyback 0 -> 1 -- the step is
  invisible in out and vault, visible only in spend and buyback.
- Lp step: amounts 1013 / 1014 move estimate 1000 -> 1001 and
  lp 1 -> 2, but out stays 99899 and buyback stays 6 while spend
  moves 1013 -> 1014 and vault 1007 -> 1008.
- Limit inclusivity: amount 4 with limit 99 succeeds, limit 100
  gives 6040; amount 100 with limit 9599 succeeds, limit 9600
  gives 6040.
- Event semantics flip vs buy_v2: for buy_exact the BuyEvent
  quote_amount_in field (@64) reports the GROSS amount and the
  user_quote_amount_in field (@112) reports the NET curve quote
  (for buy_v2 @64 is the curve quote and @112 the total user
  quote). Pinned event fields: out @16, max @24, quote @64,
  lp_bps @72, lp_fee @80, protocol_bps @88, protocol_fee @96,
  quote_with_lp @104, user_quote_in @112.
- Transfer-fee overlay (tf100): amount 1 fails 6039 at the
  available check (available 0), not the estimate check -- same
  code as nofee amount 1, different site. Amount 2 fails 6039 at
  the estimate check, amount 3 fails 6040 at the quote-0 site.
  Amount 5 succeeds with out 99, gross spend 5, net vault +4.
  Amount 6 gives out 199, spend 6, vault +5; amount 10 gives out
  599 (vs nofee 699), spend 10, vault +9. Amounts 100 and 101
  give identical results (out 9499, spend 100, vault +98,
  buyback net 0 with gross 1 fully withheld) because both map to
  available 99, while amount 102 jumps to out 9599, spend 101,
  vault +99. Exact-in does not spend the full amount when the
  computed total is lower (amount 101 spends 100).
- All 3 images agree on every case. Error cases roll back
  everything except the payer's 5,000 fee. Success cases charge
  the payer 1,849,400 (1,844,400 volume-accumulator rent + 5,000
  fee) and emit 1 BuyEvent.

Error sites (log paths as emitted by each image):

{SITES}

## Limits

Offline LiteSVM synthetic fixture only (same fixture as #33,
clock slot 100). No source change, build, or whole-program
equivalence claim. The thresholds (4, 92/93, 1013/1014) and the
out values are exact for this fixture's curve state and fee
configuration; they are not claimed for other pool states. The
tf override goes through trade_transferfee (as in #33); the
buyback gross/net split under tf follows from the event
protocol_fee and buyback_bps 5000 (floor division), with the net
leg observed as the Token-2022 ATA amount delta.
"""
(OUT / "README.md").write_text(README)
print(f"wrote: {OUT / 'README.md'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
