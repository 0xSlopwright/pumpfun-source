#!/usr/bin/env python3
"""Build research/amm-v2-sell-small-amount-bands-20261029 receipts.

v2 sell small-amount bands: sell_v2 prices a gross base input through
curve/constant_product.rs quote_for_sell(amount, b, q) =
floor(q * amount / (b + amount)), then curve/fees.rs fee() applies
CEILING division (ceil_div(amount * bps, 10000)) to the lp and
protocol fees, then instructions/swap/trade_v2.rs
calculate_sell_quote subtracts lp, creator, protocol in order with
checked_sub. That ordering creates a one-curve failure hole that
the large-amount packets never saw (2nd run packet #30 covered
sell saturation at the top, 1st-run #31 covered trade 0/extremes,
but neither walked the bottom of the sell curve):

- curve 0 succeeds with receipt 0: amounts 1..100 give curve 0,
  all fees ceil to 0, the sell succeeds (limit 0) and still funds
  the volume accumulator (payer -1,849,400). Limit 1 on a
  zero-receipt sell gives 6004 ExceededSlippage.
- curve 1 is the ONLY failing small curve: amounts 101..200 give
  curve 1, lp_fee = ceil(1*10/10000) = 1, protocol_fee =
  ceil(1*111/10000) = 1, so quote_without_lp = 1 - 1 = 0 and
  0 - creator(0) - protocol(1) underflows in calculate_sell_quote
  -> 6023 Overflow (original trade_v2.rs:385, rebuilt :187).
  The failure precedes the limit check: limit 0 and limit 1 both
  give 6023, with full rollback and payer -5,000 only.
- curve 2 recovers with receipt 0: amount 201 gives curve 2,
  lp 1, protocol 1, quote_without_lp 1, receipt 1 - 1 = 0
  (limit 0 succeeds, limit 1 gives 6004).
- curve 3 is the first positive receipt: amount 301 gives curve 3,
  lp 1, protocol 1, receipt 1 (limit 1 succeeds, limit 2 gives
  6004).
- curve 4: amount 500 gives receipt 2 (quote_without_lp 3 minus
  protocol 1).
- protocol-fee ceiling steps: protocol = ceil(curve*111/10000),
  so protocol steps 1 -> 2 at curve 91 (amounts 9100/9101) and
  2 -> 3 at curve 181 (amounts 18100/18101). Buyback is
  floor(protocol/2): at the 91 step the receipt stays 88 while
  the vault send grows 88 -> 89 via buyback 0 -> 1; at the 181
  step receipt (177), vault send (178) and buyback (1) are all
  unchanged and only the event fee fields move.
- lp-fee ceiling step: lp = ceil(curve*10/10000), so lp steps
  1 -> 2 at curve 1001 (amounts 100100/100101). Receipt (987),
  vault send (993) and buyback (6) are unchanged across the
  step; only the event lp_fee field moves 1 -> 2.
- transfer-fee overlay (quote tf100, via trade_transferfee):
  the 6023 hole is unchanged (calculate_sell_quote precedes any
  transfer-fee math, so amount 101 still gives 6023); the
  first positive NET receipt moves from amount 301 (nofee) to
  amount 500 (tf100), because a gross total of 1 is withheld in
  full (net 0, vault -1) while a gross total of 2 nets 1
  (vault -2). At the protocol step (amount 9101) tf100 nets 87
  against a gross send of 89 (user gross 88 withheld 1, buyback
  gross 1 withheld 1, buyback net 0).
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
OUT = ROOT / "research/amm-v2-sell-small-amount-bands-20261029"
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


def sell_deltas(amount, uq, vq, bb, bb22=None):
    return {"userbase": -amount, "userquote": uq, "vaultbase": amount,
            "vaultquote": vq, "buyback": bb, "buyback22": bb22}


def zero_deltas(amount):
    return {"userbase": 0, "userquote": 0, "vaultbase": 0,
            "vaultquote": 0, "buyback": 0, "buyback22": None}


# (label, amount, limit, quote_tf_bps_or_None, expected)
# expected ok: ("ok", deltas, event)
# expected err: ("err", code, orig_site_line, rebuilt_site_line)
CASES = [
    ("sell-zero-a1", 1, 0, None,
     ("ok", sell_deltas(1, 0, 0, 0), (0, 10, 0, 111, 0))),
    ("sell-zero-a100", 100, 0, None,
     ("ok", sell_deltas(100, 0, 0, 0), (0, 10, 0, 111, 0))),
    ("sell-zero-limit1", 100, 1, None,
     ("err", 6004, "trade_v2.rs:906", "trade_v2.rs:385")),
    ("sell-underflow-first", 101, 0, None,
     ("err", 6023, "trade_v2.rs:385", "trade_v2.rs:187")),
    ("sell-underflow-limit1", 101, 1, None,
     ("err", 6023, "trade_v2.rs:385", "trade_v2.rs:187")),
    ("sell-underflow-mid", 150, 0, None,
     ("err", 6023, "trade_v2.rs:385", "trade_v2.rs:187")),
    ("sell-underflow-last", 200, 0, None,
     ("err", 6023, "trade_v2.rs:385", "trade_v2.rs:187")),
    ("sell-curve2", 201, 0, None,
     ("ok", sell_deltas(201, 0, 0, 0), (2, 10, 1, 111, 1))),
    ("sell-curve2-limit1", 201, 1, None,
     ("err", 6004, "trade_v2.rs:906", "trade_v2.rs:385")),
    ("sell-curve3", 301, 0, None,
     ("ok", sell_deltas(301, 1, -1, 0), (3, 10, 1, 111, 1))),
    ("sell-curve3-limit1", 301, 1, None,
     ("ok", sell_deltas(301, 1, -1, 0), (3, 10, 1, 111, 1))),
    ("sell-curve3-limit2", 301, 2, None,
     ("err", 6004, "trade_v2.rs:906", "trade_v2.rs:385")),
    ("sell-curve4", 500, 0, None,
     ("ok", sell_deltas(500, 2, -2, 0), (4, 10, 1, 111, 1))),
    ("sell-proto-step-below", 9100, 1, None,
     ("ok", sell_deltas(9100, 88, -88, 0), (90, 10, 1, 111, 1))),
    ("sell-proto-step-above", 9101, 1, None,
     ("ok", sell_deltas(9101, 88, -89, 1), (91, 10, 1, 111, 2))),
    ("sell-proto-step2-below", 18100, 1, None,
     ("ok", sell_deltas(18100, 177, -178, 1), (180, 10, 1, 111, 2))),
    ("sell-proto-step2-above", 18101, 1, None,
     ("ok", sell_deltas(18101, 177, -178, 1), (181, 10, 1, 111, 3))),
    ("sell-lp-step-below", 100000, 1, None,
     ("ok", sell_deltas(100000, 986, -992, 6), (999, 10, 1, 111, 12))),
    ("sell-lp-step-mid", 100100, 1, None,
     ("ok", sell_deltas(100100, 987, -993, 6), (1000, 10, 1, 111, 12))),
    ("sell-lp-step-above", 100101, 1, None,
     ("ok", sell_deltas(100101, 987, -993, 6), (1001, 10, 2, 111, 12))),
    ("sell-tf-underflow", 101, 0, 100,
     ("err", 6023, "trade_v2.rs:385", "trade_v2.rs:187")),
    ("sell-tf-curve2", 201, 0, 100,
     ("ok", sell_deltas(201, 0, 0, 0, 0), (2, 10, 1, 111, 1))),
    ("sell-tf-curve3-net0", 301, 0, 100,
     ("ok", sell_deltas(301, 0, -1, 0, 0), (3, 10, 1, 111, 1))),
    ("sell-tf-curve3-limit1", 301, 1, 100,
     ("err", 6004, "trade_v2.rs:906", "trade_v2.rs:385")),
    ("sell-tf-curve4-net1", 500, 0, 100,
     ("ok", sell_deltas(500, 1, -2, 0, 0), (4, 10, 1, 111, 1))),
    ("sell-tf-curve4-limit1", 500, 1, 100,
     ("ok", sell_deltas(500, 1, -2, 0, 0), (4, 10, 1, 111, 1))),
    ("sell-tf-proto-step", 9101, 1, 100,
     ("ok", sell_deltas(9101, 87, -89, 0, 0), (91, 10, 1, 111, 2))),
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
    assert len(raw) >= 104, len(raw)
    return tuple(struct.unpack_from("<Q", raw, off)[0] for off in (64, 72, 80, 88, 96))


receipts_global = []
report_cases = []
for index, (label, amount, limit, tf_bps, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == "sell_v2")
    if expected[0] == "ok":
        exp = {"kind": "trade", "deltas": expected[1], "event": list(expected[2])}
    else:
        exp = {"kind": "error", "code": expected[1],
               "site_original": expected[2], "site_rebuilt": expected[3]}
    row = {"case": {"instruction": "sell_v2", "label": label,
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
            "context": {"index": index, "image": image, "instruction": "sell_v2",
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
             "the bottom of the v2 sell curve in "
             "curve/constant_product.rs quote_for_sell(amount, b, q) = "
             "floor(q * amount / (b + amount)) combined with the "
             "CEILING fee division in curve/fees.rs fee() and the "
             "checked_sub order in instructions/swap/trade_v2.rs "
             "calculate_sell_quote: curve 0 succeeds with receipt 0 "
             "(amounts 1..100, limit 0; limit 1 gives 6004); curve 1 "
             "is the only failing small curve (amounts 101..200 give "
             "lp 1 + protocol 1 against curve 1, so "
             "quote_without_lp = 0 and 0 - protocol underflows to "
             "6023 Overflow, before the limit check, with full "
             "rollback); curve 2 recovers with receipt 0 (amount "
             "201); curve 3 is the first positive receipt (amount "
             "301, receipt 1); curve 4 gives receipt 2 (amount "
             "500). Protocol-fee ceiling steps at curve 91 "
             "(amounts 9100/9101, protocol 1 -> 2, buyback 0 -> 1, "
             "receipt unchanged at 88) and curve 181 (amounts "
             "18100/18101, protocol 2 -> 3, receipt/vault/buyback "
             "all unchanged) and the lp-fee ceiling step at curve "
             "1001 (amounts 100100/100101, lp 1 -> 2, receipt/vault/"
             "buyback all unchanged) pin the ceiling schedule. A "
             "quote tf100 overlay leaves the 6023 hole unchanged "
             "but moves the first positive NET receipt from amount "
             "301 to amount 500 (gross total 1 withheld in full, "
             "gross total 2 nets 1). Every success funds the user "
             "volume accumulator with 1,844,400 lamports (payer "
             "delta -1,849,400 with the 5,000 fee); every failure "
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
    "classifications": {"v2-sell-small-amount-bands": len(report_cases)},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")
