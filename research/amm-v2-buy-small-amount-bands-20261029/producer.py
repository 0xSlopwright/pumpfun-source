#!/usr/bin/env python3
"""Build research/amm-v2-buy-small-amount-bands-20261029 receipts.

v2 non-exact buy small-amount bands: buy_v2 prices a base output
through curve/constant_product.rs quote_for_base(amount, b, q) =
ceil(q * amount / (b - amount)), then curve/fees.rs fee() applies
CEILING division (ceil_div(amount * bps, 10000)) to the lp and
protocol fees, then instructions/swap/trade_v2.rs
calculate_buy_result totals quote + lp + protocol + creator and
splits protocol into buyback = floor(protocol * 5000 / 10000)
with the remainder to the pool. The small-amount structure is a
plateau-and-step schedule that the large-amount packets never saw
(2nd run packet #30 covered the buy reserve wall at the top,
1st-run #31 covered trade 0/extremes, 2nd run #32 covered the
sell small-amount bands, but no packet walked the bottom of the
buy curve):

- quote plateau: amounts 1..99 all give quote 1 (spend 3: quote 1
  + lp 1 + protocol 1, buyback 0, vault +3); amounts 100..199 all
  give quote 2 (spend 4); amount 200 gives quote 3 (spend 5).
  The plateau edges are exact: 99 -> 100 flips quote 1 -> 2,
  199 -> 200 flips quote 2 -> 3.
- protocol-fee ceiling steps move the buyback split: quote 90
  (amount 8999) gives protocol 1, spend 92, buyback 0, vault +92;
  quote 91 (amount 9000) gives protocol 2, spend 94, buyback 1,
  vault +93 -- the spend grows by 2 while the vault grows by 1,
  the extra unit going to buyback. Quote 180 (amount 17999)
  gives protocol 2, spend 183, buyback 1, vault +182; quote 181
  (amount 18000) gives protocol 3, spend 185, buyback still 1,
  vault +184 -- buyback only steps on even protocol values
  (floor(protocol/2)), so the 2 -> 3 step moves spend and vault
  by 2 with buyback unchanged.
- lp-fee ceiling step: quote 1000 (amount 99999) gives lp 1,
  spend 1013, buyback 6, vault +1007; quote 1001 (amount
  100000) gives lp 2, spend 1015, buyback 6, vault +1009 --
  the lp step adds exactly 1 to spend and vault with buyback
  unchanged.
- mid anchor: amount 50000 gives quote 501, spend 508,
  buyback 3, vault +505.
- zero guards and limit inclusivity: amount 0 gives 6001
  ZeroBaseAmount (original trade_v2.rs:671, rebuilt :431);
  limit 0 gives 6002 ZeroQuoteAmount (original :672, rebuilt
  :432); limit exactly spend succeeds, limit spend-1 gives
  6004 ExceededSlippage (original :706, rebuilt :448), both
  at the bottom (amount 100, limit 3) and at the lp step
  (amount 100000, limit 1014). Unlike the sell curve's curve-1
  hole (#32), the buy curve has no failing small amount: every
  amount >= 1 succeeds, because calculate_buy_result only adds
  (quote + lp + protocol + creator) and buyback never exceeds
  protocol/2.
- transfer-fee overlay (quote tf100, via trade_transferfee):
  the pool leg is grossed up (pool_quote_amount_in =
  amount_before_fee(net)) while the event still reports the
  pre-gross-up user_quote_amount_in. Amount 1: spend 4 (gross)
  against vault +3, buyback 0. Amount 100: spend 5, vault +4.
  Amount 9000: spend 95, vault +93, buyback gross 1 withheld
  in full (net 0) -- the buyback step is invisible net. Amount
  100000: spend 1026, vault +1009, buyback net 5 (gross 6
  withheld 1). Limit 3 on amount 1 under tf100 gives 6004,
  because the limit check runs on the grossed total (4).
- Fixture: single tier (0, A = (lp 10, protocol 111, creator 0))
  so the fee bps are constant; pool accrued protocol/creator
  fees zeroed so available quote = raw vault quote; virtual
  quote reserves 0; base mint supply 10^12; VB = 10^12,
  VQ = 10^10.
- Every success funds the user volume accumulator with exactly
  1,844,400 lamports (137 bytes, payer key at [8:40]), so the
  payer delta is -1,849,400 (rent + 5,000 fee); every failure
  rolls back fully with payer -5,000 only.
- All three images (original / #424 control / #427 candidate)
  agree on every case: this packet pins behavior, it does not
  claim a divergence.
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
OUT = ROOT / "research/amm-v2-buy-small-amount-bands-20261029"
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


def buy_deltas(amount, uq, vq, bb, bb22=None):
    return {"userbase": amount, "userquote": uq, "vaultbase": -amount,
            "vaultquote": vq, "buyback": bb, "buyback22": bb22}


def zero_deltas(amount):
    return {"userbase": 0, "userquote": 0, "vaultbase": 0,
            "vaultquote": 0, "buyback": 0, "buyback22": None}


# (label, amount, limit, quote_tf_bps_or_None, expected)
# expected ok: ("ok", deltas, event)
#   event = (quote, lp_bps, lp_fee, protocol_bps, protocol_fee,
#            quote_with_lp_fee, user_quote_amount_in)
# expected err: ("err", code, orig_site_line, rebuilt_site_line)
CASES = [
    ("buy-plateau-a1", 1, 3, None,
     ("ok", buy_deltas(1, -3, 3, 0), (1, 10, 1, 111, 1, 2, 3))),
    ("buy-plateau-a99", 99, 3, None,
     ("ok", buy_deltas(99, -3, 3, 0), (1, 10, 1, 111, 1, 2, 3))),
    ("buy-plateau-a100", 100, 4, None,
     ("ok", buy_deltas(100, -4, 4, 0), (2, 10, 1, 111, 1, 3, 4))),
    ("buy-plateau-a199", 199, 4, None,
     ("ok", buy_deltas(199, -4, 4, 0), (2, 10, 1, 111, 1, 3, 4))),
    ("buy-plateau-a200", 200, 5, None,
     ("ok", buy_deltas(200, -5, 5, 0), (3, 10, 1, 111, 1, 4, 5))),
    ("buy-proto-below", 8999, 92, None,
     ("ok", buy_deltas(8999, -92, 92, 0), (90, 10, 1, 111, 1, 91, 92))),
    ("buy-proto-above", 9000, 94, None,
     ("ok", buy_deltas(9000, -94, 93, 1), (91, 10, 1, 111, 2, 92, 94))),
    ("buy-proto2-below", 17999, 183, None,
     ("ok", buy_deltas(17999, -183, 182, 1), (180, 10, 1, 111, 2, 181, 183))),
    ("buy-proto2-above", 18000, 185, None,
     ("ok", buy_deltas(18000, -185, 184, 1), (181, 10, 1, 111, 3, 182, 185))),
    ("buy-mid", 50000, 508, None,
     ("ok", buy_deltas(50000, -508, 505, 3), (501, 10, 1, 111, 6, 502, 508))),
    ("buy-lp-below", 99999, 1013, None,
     ("ok", buy_deltas(99999, -1013, 1007, 6), (1000, 10, 1, 111, 12, 1001, 1013))),
    ("buy-lp-above", 100000, 1015, None,
     ("ok", buy_deltas(100000, -1015, 1009, 6), (1001, 10, 2, 111, 12, 1003, 1015))),
    ("buy-amount0", 0, 1, None,
     ("err", 6001, "trade_v2.rs:671", "trade_v2.rs:431")),
    ("buy-limit0", 1, 0, None,
     ("err", 6002, "trade_v2.rs:672", "trade_v2.rs:432")),
    ("buy-limit-below", 100, 3, None,
     ("err", 6004, "trade_v2.rs:706", "trade_v2.rs:448")),
    ("buy-lp-limit-below", 100000, 1014, None,
     ("err", 6004, "trade_v2.rs:706", "trade_v2.rs:448")),
    ("buy-tf-a1", 1, 4, 100,
     ("ok", buy_deltas(1, -4, 3, 0, 0), (1, 10, 1, 111, 1, 2, 3))),
    ("buy-tf-a1-limit3", 1, 3, 100,
     ("err", 6004, "trade_v2.rs:706", "trade_v2.rs:448")),
    ("buy-tf-a100", 100, 5, 100,
     ("ok", buy_deltas(100, -5, 4, 0, 0), (2, 10, 1, 111, 1, 3, 4))),
    ("buy-tf-a9000", 9000, 95, 100,
     ("ok", buy_deltas(9000, -95, 93, 0, 0), (91, 10, 1, 111, 2, 92, 94))),
    ("buy-tf-a100000", 100000, 1026, 100,
     ("ok", buy_deltas(100000, -1026, 1009, 5, 5), (1001, 10, 2, 111, 12, 1003, 1015))),
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
    return tuple(struct.unpack_from("<Q", raw, off)[0] for off in (64, 72, 80, 88, 96, 104, 112))


receipts_global = []
report_cases = []
for index, (label, amount, limit, tf_bps, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == "buy_v2")
    if expected[0] == "ok":
        exp = {"kind": "trade", "deltas": expected[1], "event": list(expected[2])}
    else:
        exp = {"kind": "error", "code": expected[1],
               "site_original": expected[2], "site_rebuilt": expected[3]}
    row = {"case": {"instruction": "buy_v2", "label": label,
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
            code = expected[1]
            assert f"custom program error: 0x{0x1770 + code:04x}" in err or f"({code})" in err or str(code) in err, (label, image, err)
            want_site = expected[2] if image == "original" else expected[3]
            site_lines = [l for l in logs if "AnchorError thrown in" in l
                          and f"Error Number: {code}." in l and want_site in l]
            assert len(site_lines) == 1, (label, image, logs)
            site = site_lines[0]
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
            assert deltas == zero_deltas(amount) or (
                tf_bps is not None and deltas["buyback"] == 0 and deltas["buyback22"] == 0
                and deltas["userbase"] == 0 and deltas["userquote"] == 0
                and deltas["vaultbase"] == 0 and deltas["vaultquote"] == 0), (label, image, deltas)
            assert payer_delta == -5000, (label, image, payer_delta)
            vol = after[str(volume)]
            assert vol is None or (vol["lamports"] == 0 and vol["data_hex"] == ""), (label, image, vol)
            assert len([l for l in logs if l.startswith("Program data: ")]) == 0, (label, image, logs)
            observed = {"deltas": deltas, "payer_lamports_delta": -5000,
                        "volume_lamports": 0, "volume_data_len": 0,
                        "event": None, "site": site}
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": "buy_v2",
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
report = {
    "scope": "Fresh normally signed original/control/candidate triples pinning "
             "the bottom of the v2 buy curve in "
             "curve/constant_product.rs quote_for_base(amount, b, q) = "
             "ceil(q * amount / (b - amount)) combined with the "
             "CEILING fee division in curve/fees.rs fee() and the "
             "total/split order in instructions/swap/trade_v2.rs "
             "calculate_buy_result: amounts 1..99 all give quote 1 "
             "(spend 3: quote 1 + lp 1 + protocol 1, buyback 0, "
             "vault +3); amounts 100..199 all give quote 2 (spend "
             "4); amount 200 gives quote 3 (spend 5). The "
             "protocol-fee ceiling step at quote 91 (amounts "
             "8999/9000, protocol 1 -> 2) moves spend 92 -> 94 "
             "while the vault moves 92 -> 93, the extra unit "
             "going to buyback 0 -> 1; the second protocol step "
             "at quote 181 (amounts 17999/18000, protocol 2 -> 3) "
             "moves spend 183 -> 185 and vault 182 -> 184 with "
             "buyback unchanged at 1 (buyback is "
             "floor(protocol/2), so it only steps on even "
             "protocol values). The lp-fee ceiling step at quote "
             "1001 (amounts 99999/100000, lp 1 -> 2) moves spend "
             "1013 -> 1015 and vault 1007 -> 1009 with buyback "
             "unchanged at 6. Zero guards: amount 0 gives 6001 "
             "ZeroBaseAmount, limit 0 gives 6002 ZeroQuoteAmount; "
             "limit exactly spend succeeds while limit spend-1 "
             "gives 6004 ExceededSlippage (amount 100 limit 3, "
             "amount 100000 limit 1014). Unlike the sell curve's "
             "curve-1 hole, the buy curve has no failing small "
             "amount: every amount >= 1 succeeds, because "
             "calculate_buy_result only adds and buyback never "
             "exceeds protocol/2. A quote tf100 overlay grosses "
             "up the pool leg (pool_quote_amount_in = "
             "amount_before_fee(net)) while the event still "
             "reports the pre-gross-up user_quote_amount_in: "
             "amount 1 spends 4 against vault +3, amount 100 "
             "spends 5 against vault +4, amount 9000 spends 95 "
             "against vault +93 with buyback gross 1 withheld in "
             "full (net 0), amount 100000 spends 1026 against "
             "vault +1009 with buyback net 5 (gross 6 withheld "
             "1); limit 3 on amount 1 under tf100 gives 6004 "
             "because the limit check runs on the grossed total "
             "(4). Every success funds the user volume "
             "accumulator with 1,844,400 lamports (payer delta "
             "-1,849,400 with the 5,000 fee); every failure "
             "rolls back fully with payer -5,000 only. All three "
             "images behave identically. Receipts are stored as "
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
        "evidence/original/pump_fees/deployed.so": FEES_SHA,
        "evidence/original/pump/deployed.so": PUMP_SHA,
    },
    "counts": {"vms": len(receipts_global), "transactions": len(receipts_global),
               "signature_fields": len(receipts_global)},
    "case_count": len(report_cases),
    "classifications": {"v2-buy-small-amount-bands": len(report_cases)},
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
