#!/usr/bin/env python3
"""Build research/amm-v2-trade-accrued-fees-20261029 receipts.

v2 trades on a pool whose accrued protocol/creator fees are NONZERO.
Every earlier v2 trade packet zeroed the pool's accrued fees, so
available quote (= raw vault quote - accrued) always equalled the
raw vault quote and the sell side's real-reserve gate never bound.
This packet varies the accrued fees and pins what changes and what
does not:

- Pricing is accrued-blind: buy_v2, sell_v2 and buy_exact_quote_in_v2
  all price off the EFFECTIVE quote reserve (raw vault quote +
  virtual quote reserves), never off available. A buy of 10^6 costs
  exactly 10124 (quote 10001 + lp 11 + protocol 112) and a sell of
  10^6 pays exactly 9878 (curve 9999 - lp 10 - protocol 111) whether
  accrued is 0, small (2488/123394), or the whole raw vault
  (10^10). Only the pool's fee fields accumulate on top.
- The sell side alone is gated by REAL reserves: calculate_sell_quote
  requires real_quote_reserves (= raw - accrued) >=
  quote_without_lp_fee, else 6063 InsufficientRealQuoteReserves.
  With real = 5000 the gate is inclusive and exact: sell 500700
  (curve 5006, lp 6, quote_without_lp exactly 5000) succeeds, sell
  500701 (curve 5007, lp 6, quote_without_lp 5001) fails 6063.
- Accrued == raw is the sharpest asymmetry: buys still succeed
  (buy and buy_exact only check that available does not UNDERFLOW),
  while sells collapse to the real = 0 line: sell amount 1 succeeds
  with receipt 0 (curve 0, no fees, base still moves), sell 101
  fails 6023 Overflow in calculate_sell_quote (the real check
  0 >= 0 passes, then 0 - protocol 1 underflows -- the same
  curve-1 hole as #32, reached through a different gate), and sell
  10^6 fails 6063.
- Accrued > raw fails every trade at the liquidity check with 6023
  Overflow (state/pool.rs available_quote_reserves checked_sub),
  before any curve math. Accrued whose SUM overflows u64
  (protocol u64::MAX + creator 1) fails 6023 even earlier, in
  total_accrued_fees -- the sum is checked before the subtraction.
- The accrued SPLIT is irrelevant: only the total matters for the
  available/real checks. Sell 500000 with accrued split
  (5,000,000,000 / 4,999,995,000) gives byte-identical token deltas
  to the same sale with all-accrued-protocol (9,999,995,000 / 0);
  only the pool's post-trade protocol/creator fields differ, by
  exactly the new accrual.
- Virtual reserves can also break pricing: virtual quote reserves
  of -(VQ+1) make the effective reserve negative, so buy and sell
  both fail 6023 Overflow in effective_quote_reserves
  (state/pool.rs u64 try_from), again before any curve math.
- Buy/sell/buy_exact limit semantics are unchanged under accrued:
  buy limit exact 10124 succeeds and 10123 fails 6004; buy_exact
  limit exact 987899 succeeds and 987900 fails 6040.

Fixture (same as #33 otherwise): single tier (0, lp 10 / protocol
111 / creator 0 bps), virtual quote reserves 0 except the two
vq-overflow cases, base mint supply 10^12, VB = 10^12,
VQ = 10^10, user base/quote 10^15. No transfer-fee cases: the
packet isolates the accrued-fee geometry, and tf overlays were
already pinned for buy (#33), sell (#32) and buy_exact (#36).

Every success funds the user volume accumulator with exactly
1,844,400 lamports (137 bytes, payer key at [8:40]), so the payer
delta is -1,849,400 (rent + 5,000 fee); every failure rolls back
fully with payer -5,000 only and 0 events.
All three images (original / #424 control / #427 candidate) agree
on every case: this packet pins behavior, it does not claim a
divergence.
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
    vaultquote,
)
from pump_amm_trade_v2_differential import (
    FEES, buyback, feeconfig, volume,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-v2-trade-accrued-fees-20261029"
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
PF_SMALL, CF_SMALL = 2488, 123394
RAWQ = 10**10


def buy_deltas(amount, uq, vq, bb):
    return {"userbase": amount, "userquote": uq, "vaultbase": -amount,
            "vaultquote": vq, "buyback": bb}


def sell_deltas(amount, uq, vq, bb):
    return {"userbase": -amount, "userquote": uq, "vaultbase": amount,
            "vaultquote": -vq, "buyback": bb}


def zero_deltas():
    return {"userbase": 0, "userquote": 0, "vaultbase": 0,
            "vaultquote": 0, "buyback": 0}


# (ix, label, amount, limit, vq, pf, cf, expected)
# expected ok: ("ok", deltas, event, pool_after)
#   buy event: (quote, lp_bps, lp_fee, protocol_bps, protocol_fee,
#               quote_with_lp_fee, user_quote_amount_in)
#   sell event: (curve, lp_bps, lp_fee, protocol_bps, protocol_fee)
#   buy_exact event: (out, max, quote, lp_bps, lp_fee, protocol_bps,
#                     protocol_fee, quote_with_lp_fee, user_quote_amount_in)
#   pool_after: (vq, protocol_fees, creator_fees)
# expected err: ("err", code, orig_site, rebuilt_site)
BUY_EV = (10001, 10, 11, 111, 112, 10012, 10124)
CASES = [
    ("buy_v2", "buy-anchor-accrued0", 10**6, MAX, 0, 0, 0,
     ("ok", buy_deltas(10**6, -10124, 10068, 56), BUY_EV, (-56, 56, 0))),
    ("buy_v2", "buy-accrued-small", 10**6, MAX, 0, PF_SMALL, CF_SMALL,
     ("ok", buy_deltas(10**6, -10124, 10068, 56), BUY_EV, (-56, 2544, CF_SMALL))),
    ("buy_v2", "buy-accrued-eq-raw", 10**6, MAX, 0, RAWQ, 0,
     ("ok", buy_deltas(10**6, -10124, 10068, 56), BUY_EV, (-56, RAWQ + 56, 0))),
    ("buy_v2", "buy-accrued-eq-raw-limit-exact", 10**6, 10124, 0, RAWQ, 0,
     ("ok", buy_deltas(10**6, -10124, 10068, 56), BUY_EV, (-56, RAWQ + 56, 0))),
    ("buy_v2", "buy-accrued-eq-raw-limit-below", 10**6, 10123, 0, RAWQ, 0,
     ("err", 6004, "trade_v2.rs:706", "trade_v2.rs:448")),
    ("buy_v2", "buy-accrued-over-raw", 10**6, MAX, 0, RAWQ + 1, 0,
     ("err", 6023, "state/pool.rs:417", "state/pool.rs:64")),
    ("buy_v2", "buy-accrued-sum-overflow", 10**6, MAX, 0, MAX, 1,
     ("err", 6023, "state/pool.rs:408", "state/pool.rs:57")),
    ("buy_v2", "buy-vq-neg-overflow", 10**6, MAX, -(RAWQ + 1), 0, 0,
     ("err", 6023, "state/pool.rs:440", "state/pool.rs:48")),
    ("sell_v2", "sell-anchor-accrued0", 10**6, 1, 0, 0, 0,
     ("ok", sell_deltas(10**6, 9878, 9933, 55), (9999, 10, 10, 111, 111), (-56, 56, 0))),
    ("sell_v2", "sell-accrued-small", 10**6, 1, 0, PF_SMALL, CF_SMALL,
     ("ok", sell_deltas(10**6, 9878, 9933, 55), (9999, 10, 10, 111, 111), (-56, 2544, CF_SMALL))),
    ("sell_v2", "sell-accrued-eq-raw-amt1", 1, 0, 0, RAWQ, 0,
     ("ok", sell_deltas(1, 0, 0, 0), (0, 10, 0, 111, 0), (0, RAWQ, 0))),
    ("sell_v2", "sell-accrued-eq-raw-amt101", 101, 0, 0, RAWQ, 0,
     ("err", 6023, "trade_v2.rs:385", "trade_v2.rs:187")),
    ("sell_v2", "sell-accrued-eq-raw-amt1m", 10**6, 1, 0, RAWQ, 0,
     ("err", 6063, "trade_v2.rs:377", "trade_v2.rs:183")),
    ("sell_v2", "sell-real5000-below", 500000, 1, 0, RAWQ - 5000, 0,
     ("ok", sell_deltas(500000, 4938, 4966, 28), (4999, 10, 5, 111, 56), (-28, RAWQ - 5000 + 28, 0))),
    ("sell_v2", "sell-real5000-boundary-ok", 500700, 1, 0, RAWQ - 5000, 0,
     ("ok", sell_deltas(500700, 4944, 4972, 28), (5006, 10, 6, 111, 56), (-28, RAWQ - 5000 + 28, 0))),
    ("sell_v2", "sell-real5000-boundary-err", 500701, 1, 0, RAWQ - 5000, 0,
     ("err", 6063, "trade_v2.rs:377", "trade_v2.rs:183")),
    ("sell_v2", "sell-real5000-split", 500000, 1, 0, 5000000000, 4999995000,
     ("ok", sell_deltas(500000, 4938, 4966, 28), (4999, 10, 5, 111, 56), (-28, 5000000028, 4999995000))),
    ("sell_v2", "sell-accrued-over-raw", 10**6, 1, 0, RAWQ + 1, 0,
     ("err", 6023, "state/pool.rs:417", "state/pool.rs:64")),
    ("sell_v2", "sell-vq-neg-overflow", 10**6, 1, -(RAWQ + 1), 0, 0,
     ("err", 6023, "state/pool.rs:440", "state/pool.rs:48")),
    ("buy_exact_quote_in_v2", "buyexact-accrued-eq-raw-ok", 10000, 987899, 0, RAWQ, 0,
     ("ok", buy_deltas(987899, -10000, 9945, 55),
      (987899, 10000, 10000, 10, 10, 111, 110, 9890, 9880), (-55, RAWQ + 55, 0))),
    ("buy_exact_quote_in_v2", "buyexact-accrued-eq-raw-limit-above", 10000, 987900, 0, RAWQ, 0,
     ("err", 6040, "trade_v2.rs:816", "trade_v2.rs:494")),
    ("buy_exact_quote_in_v2", "buyexact-accrued-over-raw", 10000, 1, 0, RAWQ + 1, 0,
     ("err", 6023, "state/pool.rs:417", "state/pool.rs:64")),
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


def set_pool(vm, vq, pf, cf):
    a = vm.get_account(pool)
    d = bytearray(a.data)
    d[245:261] = vq.to_bytes(16, "little", signed=True)
    d[243] = 0
    d[271:279] = struct.pack("<Q", pf)
    d[279:287] = struct.pack("<Q", cf)
    vm.set_account(pool, Account(a.lamports, bytes(d), a.owner))


def pool_state(data_hex):
    d = bytes.fromhex(data_hex)
    return (int.from_bytes(d[245:261], "little", signed=True),
            struct.unpack_from("<Q", d, 271)[0],
            struct.unpack_from("<Q", d, 279)[0])


def event_fields(ix_name, logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    assert len(lines) == 1, lines
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    if ix_name == "buy_v2":
        offs = (64, 72, 80, 88, 96, 104, 112)
    elif ix_name == "sell_v2":
        offs = (64, 72, 80, 88, 96)
    else:
        offs = (16, 24, 64, 72, 80, 88, 96, 104, 112)
    assert len(raw) >= max(offs) + 8, len(raw)
    return tuple(struct.unpack_from("<Q", raw, off)[0] for off in offs)


receipts_global = []
report_cases = []
for index, (ix_name, label, amount, limit, vq, pf, cf, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == ix_name)
    if expected[0] == "ok":
        exp = {"kind": "trade", "deltas": expected[1], "event": list(expected[2]),
               "pool_after": list(expected[3])}
    else:
        exp = {"kind": "error", "code": expected[1],
               "site_original": expected[2], "site_rebuilt": expected[3]}
    row = {"case": {"instruction": ix_name, "label": label,
                    "amount": amount, "limit": limit,
                    "tiers": [[t, list(fs)] for t, fs in TIERS],
                    "supply": SUPPLY, "vaultbase": VB, "vaultquote": VQ,
                    "mayhem": 0, "feeconfig_len": 4097,
                    "pool_vq": vq, "pool_protocol_fees": pf, "pool_creator_fees": cf,
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
        set_amount(vm, vaultbase, VB); set_amount(vm, vaultquote, VQ)
        set_supply(vm, base, SUPPLY); set_pool(vm, vq, pf, cf)
        pool_key = str(metas[0].pubkey)
        recipient_key = str(metas[14].pubkey)
        row["case"].setdefault("pool_keys", {})[image] = pool_key
        row["case"].setdefault("buyback_recipients", {})[image] = recipient_key
        before_keys = sorted({str(m.pubkey) for m in metas} | {str(PAYER.pubkey()), str(BB22)}, key=str)
        before = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        # Fixture checks: fee table, pool vq/mayhem/accrued, vault amounts, base supply.
        fc = before[str(feeconfig)]
        assert len(bytes.fromhex(fc["data_hex"])) == 4097, (label, image)
        fcd = bytes.fromhex(fc["data_hex"])
        assert struct.unpack_from("<I", fcd, 65)[0] == len(TIERS), (label, image)
        for i, (t, fs) in enumerate(TIERS):
            assert int.from_bytes(fcd[69 + 40 * i:69 + 40 * i + 16], "little") == t, (label, image, i)
            assert struct.unpack_from("<QQQ", fcd, 69 + 40 * i + 16) == fs, (label, image, i)
        pk = before[pool_key]
        pkd = bytes.fromhex(pk["data_hex"])
        assert pkd[243] == 0, (label, image)
        assert pool_state(pk["data_hex"]) == (vq, pf, cf), (label, image, pool_state(pk["data_hex"]))
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

        def deltas_of(b, a):
            out = {}
            for wname, key in (("userbase", userbase), ("userquote", userquote),
                               ("vaultbase", vaultbase), ("vaultquote", vaultquote)):
                bb, aa = b[str(key)], a[str(key)]
                out[wname] = None if bb is None or aa is None else \
                    amount_at(aa["data_hex"], 64) - amount_at(bb["data_hex"], 64)
            bb, aa = b[recipient_key], a[recipient_key]
            out["buyback"] = None if bb is None or aa is None else \
                amount_at(aa["data_hex"], 64) - amount_at(bb["data_hex"], 64)
            return out

        if expected[0] == "ok":
            assert not failed and err is None, (label, image, err)
            deltas = deltas_of(before, after)
            assert deltas == expected[1], (label, image, deltas, expected[1])
            ev = event_fields(ix_name, logs)
            assert ev == expected[2], (label, image, ev, expected[2])
            assert pool_state(after[pool_key]["data_hex"]) == expected[3], \
                (label, image, pool_state(after[pool_key]["data_hex"]), expected[3])
            assert payer_delta == -1849400, (label, image, payer_delta)
            vol = after[str(volume)]
            assert vol is not None and vol["lamports"] == 1844400, (label, image, vol)
            vd = bytes.fromhex(vol["data_hex"])
            assert len(vd) == 137 and vd[8:40] == bytes(PAYER.pubkey()), (label, image)
            assert len([l for l in logs if l.startswith("Program data: ")]) == 1, (label, image)
            observed = {"deltas": deltas, "event": list(ev),
                        "pool_after": list(expected[3]),
                        "payer_lamports_delta": -1849400,
                        "volume_lamports": 1844400, "volume_data_len": 137}
        else:
            assert failed, (label, image, "expected failure")
            code = expected[1]
            assert f"custom program error: 0x{0x1770 + code:04x}" in err or f"({code})" in err \
                or str(code) in err, (label, image, err)
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            if site is None:
                site = next((l for l in logs if "AnchorError occurred." in l), None)
            want = expected[2] if image == "original" else expected[3]
            assert site is not None and want in site, (label, image, site, want)
            row.setdefault("error_sites", {})[image] = site
            deltas = deltas_of(before, after)
            assert deltas == zero_deltas(), (label, image, deltas)
            assert pool_state(after[pool_key]["data_hex"]) == (vq, pf, cf), (label, image)
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
                        "pool_after": [vq, pf, cf],
                        "event": None}
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": ix_name,
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
             "v2 trades (buy_v2, sell_v2, buy_exact_quote_in_v2) on a pool "
             "whose accrued protocol/creator fees are NONZERO, in "
             "instructions/swap/trade_v2.rs and state/pool.rs. Pricing is "
             "accrued-blind: all three handlers price off the effective "
             "quote reserve (raw vault quote + virtual quote reserves), so "
             "a 10^6 buy costs 10124 and a 10^6 sell pays 9878 whether "
             "accrued is 0, small (2488/123394), or the whole raw vault "
             "(10^10); only the pool fee fields accumulate on top. The "
             "sell side alone is gated by real reserves (raw - accrued): "
             "with real = 5000, sell 500700 (quote_without_lp exactly "
             "5000) succeeds and sell 500701 (5001) fails 6063 "
             "InsufficientRealQuoteReserves, inclusively. With accrued == "
             "raw, buys still succeed (only an available underflow is "
             "checked) while sells collapse to the real = 0 line: amount 1 "
             "succeeds with receipt 0, amount 101 fails 6023 Overflow in "
             "calculate_sell_quote (the 0 >= 0 real check passes, then 0 - "
             "protocol 1 underflows), amount 10^6 fails 6063. Accrued > raw "
             "fails every trade at the liquidity check with 6023 "
             "(available checked_sub); an accrued SUM overflowing u64 "
             "fails 6023 even earlier in total_accrued_fees. The accrued "
             "split is irrelevant: only the total gates available/real, "
             "shown by identical deltas for a split (5,000,000,000 / "
             "4,999,995,000) and an all-protocol (9,999,995,000 / 0) "
             "accrual. Virtual reserves of -(VQ+1) make the effective "
             "reserve negative, so buy and sell both fail 6023 in "
             "effective_quote_reserves. Limit semantics are unchanged "
             "under accrued: buy limit exact 10124 succeeds, 10123 fails "
             "6004; buy_exact limit exact 987899 succeeds, 987900 fails "
             "6040. Fixture otherwise identical to #33 (single tier lp 10 "
             "/ protocol 111 / creator 0, VB 10^12, VQ 10^10, supply "
             "10^12). Every success funds the user volume accumulator "
             "with 1,844,400 lamports (payer delta -1,849,400 with the "
             "5,000 fee); every failure rolls back fully with payer "
             "-5,000 only. All three images behave identically. Receipts "
             "are stored as parts to stay under GitHub's 25MB web-upload "
             "limit; verify.py reads them in order.",
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
    "classifications": {"v2-trade-accrued-fees": len(report_cases)},
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

README = f"""# v2 trades with nonzero accrued fees

## Problem

Every earlier v2 trade packet zeroed the pool's accrued
protocol/creator fees, so available quote (raw vault quote minus
accrued) always equalled the raw vault quote and the sell side's
real-reserve gate never bound. Nothing pinned whether pricing
follows the effective reserve or the available reserve, whether
the sell gate is inclusive, what happens when accrued equals or
exceeds the raw vault, whether the accrued split matters, or
whether a negative virtual reserve breaks pricing before the
curve runs.

## Cases

22 cases x 3 images (original / #424 control / #427 candidate),
66 signed receipts, parts [10, 10, 10, 10, 10, 10, 6]. Fixture
otherwise identical to #33: single tier (0, lp 10 / protocol 111
/ creator 0 bps), virtual quote reserves 0 except the two
vq-overflow cases, base mint supply 10^12, VB = 10^12,
VQ = 10^10, user base/quote 10^15. No transfer-fee cases: this
packet isolates the accrued-fee geometry (tf overlays were
already pinned for buy in #33, sell in #32, buy_exact in #36).

- buy-anchor-accrued0 / buy-accrued-small /
  buy-accrued-eq-raw (buy 10^6, accrued 0 / 2488+123394 /
  10^10+0): identical pricing (spend 10124, vault +10068,
  buyback 56); only the pool's post-trade fee fields move.
- buy-accrued-eq-raw-limit-exact / -limit-below (limits 10124 /
  10123): limit semantics unchanged under accrued.
- buy-accrued-over-raw (accrued 10^10+1): 6023 at the liquidity
  check, before any curve math.
- buy-accrued-sum-overflow (protocol u64::MAX + creator 1):
  6023 in total_accrued_fees, before the subtraction.
- buy-vq-neg-overflow (virtual -(VQ+1)): 6023 in
  effective_quote_reserves.
- sell-anchor-accrued0 / sell-accrued-small (sell 10^6):
  identical payout (user +9878, vault -9933, buyback 55).
- sell-accrued-eq-raw-amt1 / -amt101 / -amt1m (accrued 10^10):
  the real = 0 line -- amount 1 succeeds with receipt 0, amount
  101 fails 6023 in calculate_sell_quote, amount 10^6 fails 6063.
- sell-real5000-below / -boundary-ok / -boundary-err (real
  5000, amounts 500000 / 500700 / 500701): the inclusive gate --
  quote_without_lp exactly 5000 succeeds, 5001 fails 6063.
- sell-real5000-split (accrued 5,000,000,000 / 4,999,995,000):
  byte-identical deltas to the all-protocol accrual; only the
  total gates.
- sell-accrued-over-raw / sell-vq-neg-overflow: the same 6023
  sites through the sell path.
- buyexact-accrued-eq-raw-ok / -limit-above /
  -over-raw (amount 10000): buy_exact follows the buy side --
  succeeds with accrued == raw (out 987899), limit 987900 fails
  6040, accrued > raw fails 6023.

## Result

- Pricing is accrued-blind. buy_v2, sell_v2 and
  buy_exact_quote_in_v2 all price off the effective quote
  reserve (raw vault quote + virtual quote reserves). Buy 10^6
  is quote 10001 + lp 11 + protocol 112 = spend 10124, vault
  +10068, buyback 56, pool vq -56, at accrued 0, at
  2488/123394 (pool protocol 2544 after), and at accrued ==
  raw 10^10 (pool protocol 10000000056 after). Sell 10^6 is
  curve 9999 - lp 10 - protocol 111 = user +9878, vault -9933,
  buyback 55, at all three accrual levels.
- The sell gate is real-only and inclusive. calculate_sell_quote
  requires real_quote_reserves >= quote_without_lp_fee, else
  6063 InsufficientRealQuoteReserves. With real = 5000, sell
  500700 (curve 5006, lp 6, quote_without_lp exactly 5000)
  succeeds (user +4944, vault -4972, buyback 28) and sell
  500701 (curve 5007, lp 6, quote_without_lp 5001) fails 6063.
  Amounts 500625..500700 all give the same payout (curve/lp/
  protocol plateau), so the boundary is a single amount, not a
  band.
- Accrued == raw splits buy from sell. Buys only check that
  available does not underflow, so buy 10^6 and buy_exact 10000
  succeed unchanged (buy_exact out 987899, vault +9945,
  buyback 55). Sells collapse to the real = 0 line: amount 1
  succeeds with receipt 0 (curve 0, fees 0, base still moves
  -1/+1, volume funded, event emitted); amount 101 fails 6023
  Overflow in calculate_sell_quote -- the real check 0 >= 0
  passes, then 0 - protocol 1 underflows (the same curve-1 hole
  as #32, reached through a different gate); amount 10^6 fails
  6063.
- Accrued > raw fails everything at the liquidity check.
  available_quote_reserves checked_sub gives 6023 Overflow
  (state/pool.rs) before any curve math, for buy, sell and
  buy_exact alike. An accrued sum overflowing u64 (protocol
  u64::MAX + creator 1) fails 6023 even earlier, in
  total_accrued_fees -- the sum is checked before the
  subtraction, so the failure does not depend on the raw vault
  at all.
- Only the accrued total matters. Sell 500000 with accrued
  split (5,000,000,000 / 4,999,995,000) gives byte-identical
  token deltas (user +4938, vault -4966, buyback 28, event
  curve 4999 / lp 5 / protocol 56) to the same sale with
  all-protocol accrued (9,999,995,000 / 0); the post-trade pool
  fields differ only by the new accrual (protocol +28,
  creator +0 in both).
- Negative virtual reserves break pricing first. Virtual quote
  reserves of -(VQ+1) make the effective reserve negative, so
  buy and sell both fail 6023 Overflow in
  effective_quote_reserves (u64 try_from), before the curve.
- Limit semantics are unchanged under accrued. Buy limit
  exactly 10124 succeeds, 10123 fails 6004 ExceededSlippage.
  Buy_exact limit exactly 987899 succeeds, 987900 fails 6040
  BuySlippageBelowMinBaseAmountOut.
- Every success case funds the user volume accumulator with
  1,844,400 lamports (137 bytes, payer key [8:40]), payer
  -1,849,400. Every failure case rolls back fully, payer
  -5,000 only, 0 events, pool bytes unchanged.
- All 3 images agree on every case.

Error sites (original / rebuilt):

{SITES}

## Limits

Offline LiteSVM synthetic fixtures only. No source change,
build, or whole-program equivalence claim. Accrued values,
boundaries (500700/500701) and amounts are exact for this
fixture (single tier lp 10 / protocol 111 / creator 0,
VB 10^12, VQ 10^10), not claims about other pool states or
mainnet settings. Accrued fees above the raw vault and negative
virtual reserves are synthetic pool states used to pin the
gate order, not claims about reachable mainnet states.
"""
(OUT / "README.md").write_text(README)
print("wrote:", OUT / "README.md")
