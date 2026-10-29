#!/usr/bin/env python3
"""Build research/amm-v2-fee-split-creator-buyback-20261029 receipts.

trade_v2 fee split: where the creator fee lands, and how
buyback_basis_points moves the protocol split. Every earlier v2
trade packet used a tier with creator bps 0 and the fixture
buyback_basis_points 5000, so neither the creator-fee path nor
the buyback sweep was ever pinned. This packet walks both:

- Creator-fee path (curve/fees.rs select_and_apply_v2 +
  apply): the tier's creator bps is replaced by the pool's
  creator_fee_bps when global_config.creator_fee_configurable
  is set and the pool value is nonzero; otherwise the tier
  value applies. apply() then zeroes the creator fee when
  pool.coin_creator is the default pubkey, but keeps the bps
  field in the event -- so a default coin_creator reports
  creator_bps 300 with creator_fee 0. The trade path applies
  no max-configurable cap: pool creator_fee_bps 10000 (far
  above the admin_cto max of 300) is charged in full.
- Pool accrual (state/pool.rs accrue_fees): buyback =
  floor(protocol_fee * buyback_basis_points / 10000),
  protocol_fees += protocol_fee - buyback, creator_fees +=
  creator_fee, virtual_quote_reserves -=
  (protocol_fee - buyback + creator_fee). The pool state is
  checked after every success, not just the vault deltas.
- Holder reward is event-only: pool.is_holder_reward makes
  the event report holder_rewards_bps = creator bps and
  holder_rewards = creator fee, with identical state deltas.
- Buyback sweep: the split is a floor, not a cap. buyback
  10000 takes the whole protocol fee (pool protocol accrual
  0); buyback 10001 behaves identically to 10000 for a
  protocol fee of 112, because floor(112 * 10001 / 10000) =
  112. The panic only fires when the floored buyback
  exceeds the protocol fee: buy protocol 112 panics at
  buyback 10090 (floor = 113 > 112), sell protocol 111
  does not panic at 10090 (floor = 111) and panics at
  10091 (floor = 112 > 111). Both panics are the same
  "buyback_fee never exceeds protocol_fee" expect, but the
  rebuilt images report different sites: buy panics in
  instructions/swap/trade_v2.rs:122 (calculate_buy_result,
  before any transfer), sell panics in state/pool.rs:21
  (accrue_fees, after the transfers, rolled back); the
  original image reports both at
  state/global_config.rs:391. The failure form is
  ProgramFailedToComplete (a panic, not an AnchorError),
  with full rollback and payer -5,000 only.
- Fixture: single tier (0, (lp 10, protocol 111, creator
  300)); pool accrued protocol/creator fees zeroed,
  virtual quote reserves 0; base mint supply 10^12;
  VB = 10^12, VQ = 10^10; buy amount 10^6 (quote 10001,
  lp 11, protocol 112) and sell amount 10^6 (curve 9999,
  lp 10, protocol 111). Every success funds the user
  volume accumulator with exactly 1,844,400 lamports
  (137 bytes, payer key at [8:40]), so the payer delta is
  -1,849,400 (rent + 5,000 fee).
- All three images (original / #424 control / #427
  candidate) agree on every case: this packet pins
  behavior, it does not claim a divergence.
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
OUT = ROOT / "research/amm-v2-fee-split-creator-buyback-20261029"
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
TIERS = [(0, (10, 111, 300))]
SUPPLY = 10**12
VB = 10**12
VQ = 10**10


def deltas(userbase, userquote, vaultbase, vaultquote, bb):
    return {"userbase": userbase, "userquote": userquote, "vaultbase": vaultbase,
            "vaultquote": vaultquote, "buyback": bb, "buyback22": None}


def zero_deltas():
    return {"userbase": 0, "userquote": 0, "vaultbase": 0,
            "vaultquote": 0, "buyback": 0, "buyback22": None}


# (label, instruction, amount, limit, mods, expected)
# mods: buyback_bps, pool creator_fee_bps, coin_creator_default,
# holder_reward, creator_fee_configurable (defaults: 5000, 0, False, 0, 1)
# expected ok: ("ok", deltas, event, pool_state)
#   event = (quote, lp_bps, lp_fee, protocol_bps, protocol_fee,
#            quote_with_or_without_lp_fee, user_quote_amount,
#            creator_bps, creator_fee, buyback_bps, buyback_fee,
#            holder_bps, holder_rewards, creator_fee_unclaimed)
#   pool_state = (virtual_quote_reserves, protocol_fees, creator_fees) after
# expected panic: ("panic", orig_site, rebuilt_site)
CASES = [
    ("buy-creator300", "buy_v2", 10**6, 10425, {},
     ("ok", deltas(10**6, -10425, -10**6, 10369, 56),
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 5000, 56, 0, 0, 301),
      (-357, 56, 301))),
    ("buy-pool-cfbps150", "buy_v2", 10**6, 10275, {"cfbps": 150},
     ("ok", deltas(10**6, -10275, -10**6, 10219, 56),
      (10001, 10, 11, 111, 112, 10012, 10275, 150, 151, 5000, 56, 0, 0, 151),
      (-207, 56, 151))),
    ("buy-configurable0-cfbps150", "buy_v2", 10**6, 10425, {"cfbps": 150, "configurable": 0},
     ("ok", deltas(10**6, -10425, -10**6, 10369, 56),
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 5000, 56, 0, 0, 301),
      (-357, 56, 301))),
    ("buy-coin-default", "buy_v2", 10**6, 10124, {"coin_default": True},
     ("ok", deltas(10**6, -10124, -10**6, 10068, 56),
      (10001, 10, 11, 111, 112, 10012, 10124, 300, 0, 5000, 56, 0, 0, 0),
      (-56, 56, 0))),
    ("buy-holder", "buy_v2", 10**6, 10425, {"holder": 1},
     ("ok", deltas(10**6, -10425, -10**6, 10369, 56),
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 5000, 56, 300, 301, 301),
      (-357, 56, 301))),
    ("buy-cfbps10000", "buy_v2", 10**6, 20125, {"cfbps": 10000},
     ("ok", deltas(10**6, -20125, -10**6, 20069, 56),
      (10001, 10, 11, 111, 112, 10012, 20125, 10000, 10001, 5000, 56, 0, 0, 10001),
      (-10057, 56, 10001))),
    ("buy-bb0", "buy_v2", 10**6, 10425, {"bbbps": 0},
     ("ok", deltas(10**6, -10425, -10**6, 10425, 0),
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 0, 0, 0, 0, 301),
      (-413, 112, 301))),
    ("buy-bb1", "buy_v2", 10**6, 10425, {"bbbps": 1},
     ("ok", deltas(10**6, -10425, -10**6, 10425, 0),
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 1, 0, 0, 0, 301),
      (-413, 112, 301))),
    ("buy-bb4999", "buy_v2", 10**6, 10425, {"bbbps": 4999},
     ("ok", deltas(10**6, -10425, -10**6, 10370, 55),
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 4999, 55, 0, 0, 301),
      (-358, 57, 301))),
    ("buy-bb9999", "buy_v2", 10**6, 10425, {"bbbps": 9999},
     ("ok", deltas(10**6, -10425, -10**6, 10314, 111),
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 9999, 111, 0, 0, 301),
      (-302, 1, 301))),
    ("buy-bb10000", "buy_v2", 10**6, 10425, {"bbbps": 10000},
     ("ok", deltas(10**6, -10425, -10**6, 10313, 112),
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 10000, 112, 0, 0, 301),
      (-301, 0, 301))),
    ("buy-bb10001", "buy_v2", 10**6, 10425, {"bbbps": 10001},
     ("ok", deltas(10**6, -10425, -10**6, 10313, 112),
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 10001, 112, 0, 0, 301),
      (-301, 0, 301))),
    ("buy-bb10090-panic", "buy_v2", 10**6, 10425, {"bbbps": 10090},
     ("panic", "global_config.rs:391", "trade_v2.rs:122")),
    ("sell-creator300", "sell_v2", 10**6, 1, {},
     ("ok", deltas(-10**6, 9578, 10**6, -9633, 55),
      (9999, 10, 10, 111, 111, 9989, 9578, 300, 300, 5000, 55, 0, 0, 300),
      (-356, 56, 300))),
    ("sell-coin-default", "sell_v2", 10**6, 1, {"coin_default": True},
     ("ok", deltas(-10**6, 9878, 10**6, -9933, 55),
      (9999, 10, 10, 111, 111, 9989, 9878, 300, 0, 5000, 55, 0, 0, 0),
      (-56, 56, 0))),
    ("sell-bb0", "sell_v2", 10**6, 1, {"bbbps": 0},
     ("ok", deltas(-10**6, 9578, 10**6, -9578, 0),
      (9999, 10, 10, 111, 111, 9989, 9578, 300, 300, 0, 0, 0, 0, 300),
      (-411, 111, 300))),
    ("sell-bb10000", "sell_v2", 10**6, 1, {"bbbps": 10000},
     ("ok", deltas(-10**6, 9578, 10**6, -9689, 111),
      (9999, 10, 10, 111, 111, 9989, 9578, 300, 300, 10000, 111, 0, 0, 300),
      (-300, 0, 300))),
    ("sell-bb10090", "sell_v2", 10**6, 1, {"bbbps": 10090},
     ("ok", deltas(-10**6, 9578, 10**6, -9689, 111),
      (9999, 10, 10, 111, 111, 9989, 9578, 300, 300, 10090, 111, 0, 0, 300),
      (-300, 0, 300))),
    ("sell-bb10091-panic", "sell_v2", 10**6, 1, {"bbbps": 10091},
     ("panic", "global_config.rs:391", "pool.rs:21")),
]

BUY_EV_OFFS = (64, 72, 80, 88, 96, 104, 112, 344, 352, 427, 435, 468, 476, 484)
SELL_EV_OFFS = (64, 72, 80, 88, 96, 104, 112, 344, 352, 376, 384, 417, 425, 433)


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


def set_pool(vm, cfbps, coin_default, holder):
    a = vm.get_account(pool)
    d = bytearray(a.data); d[245:261] = (0).to_bytes(16, "little", signed=True); d[243] = 0
    d[271:287] = bytes(16)
    d[261:269] = struct.pack("<Q", cfbps)
    if coin_default:
        d[211:243] = bytes(32)
    d[270] = holder
    vm.set_account(pool, Account(a.lamports, bytes(d), a.owner))


def event_fields(logs, offs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    assert len(lines) == 1, lines
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    assert len(raw) >= 449, len(raw)
    return tuple(struct.unpack_from("<Q", raw, off)[0] for off in offs)


receipts_global = []
report_cases = []
for index, (label, instr, amount, limit, mods, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == instr)
    bbbps = mods.get("bbbps", 5000)
    cfbps = mods.get("cfbps", 0)
    coin_default = mods.get("coin_default", False)
    holder = mods.get("holder", 0)
    configurable = mods.get("configurable", 1)
    if expected[0] == "ok":
        exp = {"kind": "trade", "deltas": expected[1], "event": list(expected[2]),
               "pool_state": list(expected[3])}
    else:
        exp = {"kind": "panic", "site_original": expected[1], "site_rebuilt": expected[2]}
    row = {"case": {"instruction": instr, "label": label,
                    "amount": amount, "limit": limit,
                    "tiers": [[t, list(fs)] for t, fs in TIERS],
                    "supply": SUPPLY, "vaultbase": VB, "vaultquote": VQ,
                    "mayhem": 0, "feeconfig_len": 4097,
                    "quote_tf_bps": None,
                    "buyback_bps": bbbps, "pool_creator_fee_bps": cfbps,
                    "coin_creator_default": coin_default,
                    "holder_reward": holder,
                    "creator_fee_configurable": configurable,
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
        glob[899:907] = struct.pack("<Q", bbbps)
        glob[940] = configurable
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
        set_supply(vm, base, SUPPLY); set_pool(vm, cfbps, coin_default, holder)
        pool_key = str(metas[0].pubkey)
        recipient_key = str(metas[14].pubkey)
        row["case"].setdefault("pool_keys", {})[image] = pool_key
        row["case"].setdefault("buyback_recipients", {})[image] = recipient_key
        before_keys = sorted({str(m.pubkey) for m in metas} | {str(PAYER.pubkey()), str(BB22)}, key=str)
        before = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        # Fixture checks: fee table, pool vq/mayhem/fees/cfbps/coin/holder, global buyback/configurable.
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
        assert struct.unpack_from("<Q", pkd, 261)[0] == cfbps, (label, image)
        assert (pkd[211:243] == bytes(32)) == coin_default, (label, image)
        assert pkd[270] == holder, (label, image)
        assert pkd[75:107] == bytes(quote), (label, image)
        gd = bytes.fromhex(before[str(CONFIG_KEY)]["data_hex"])
        assert struct.unpack_from("<Q", gd, 899)[0] == bbbps, (label, image)
        assert gd[940] == configurable, (label, image)
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
            offs = BUY_EV_OFFS if instr == "buy_v2" else SELL_EV_OFFS
            got_ev = event_fields(logs, offs)
            assert got_ev == expected[2], (label, image, got_ev, expected[2])
            pk_after = bytes.fromhex(after[pool_key]["data_hex"])
            pool_state = [struct.unpack_from("<q", pk_after, 245)[0],
                          struct.unpack_from("<Q", pk_after, 271)[0],
                          struct.unpack_from("<Q", pk_after, 279)[0]]
            assert pool_state == list(expected[3]), (label, image, pool_state, expected[3])
            observed = {"deltas": deltas, "payer_lamports_delta": -1849400,
                        "volume_lamports": 1844400, "volume_data_len": 137,
                        "event": list(got_ev), "pool_state": pool_state}
            site = None
        else:
            assert failed, (label, image, "expected failure")
            assert "ProgramFailedToComplete" in err, (label, image, err)
            want_site = expected[1] if image == "original" else expected[2]
            site_lines = [l for l in logs if "panicked at" in l and want_site in l]
            assert len(site_lines) == 1, (label, image, logs)
            assert any("buyback_fee never exceeds protocol_fee" in l for l in logs), (label, image, logs)
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
            assert deltas == zero_deltas(), (label, image, deltas)
            assert payer_delta == -5000, (label, image, payer_delta)
            vol = after[str(volume)]
            assert vol is None or (vol["lamports"] == 0 and vol["data_hex"] == ""), (label, image, vol)
            assert len([l for l in logs if l.startswith("Program data: ")]) == 0, (label, image, logs)
            pk_after = bytes.fromhex(after[pool_key]["data_hex"])
            pool_state = [struct.unpack_from("<q", pk_after, 245)[0],
                          struct.unpack_from("<Q", pk_after, 271)[0],
                          struct.unpack_from("<Q", pk_after, 279)[0]]
            assert pool_state == [0, 0, 0], (label, image, pool_state)
            observed = {"deltas": deltas, "payer_lamports_delta": -5000,
                        "volume_lamports": 0, "volume_data_len": 0,
                        "event": None, "site": site, "pool_state": pool_state}
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": instr,
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
             "the trade_v2 fee split in curve/fees.rs "
             "select_and_apply_v2/apply and state/pool.rs accrue_fees: "
             "the tier creator bps (300) is replaced by the pool "
             "creator_fee_bps (150) when creator_fee_configurable "
             "is set, and the tier value applies when it is not "
             "set; a default coin_creator zeroes the creator fee "
             "while the event still reports creator_bps 300; the "
             "trade path applies no max-configurable cap (pool "
             "creator_fee_bps 10000 is charged in full); "
             "is_holder_reward reports holder_rewards equal to "
             "the creator fee with identical state deltas; "
             "buyback = floor(protocol_fee * buyback_basis_points "
             "/ 10000) accrues protocol_fee - buyback to the pool "
             "and subtracts protocol_fee - buyback + creator_fee "
             "from virtual quote reserves. The buyback split is "
             "a floor, not a cap: buyback 10000 takes the whole "
             "protocol fee and buyback 10001 behaves identically "
             "for protocol 112; the panic only fires when the "
             "floored buyback exceeds the protocol fee (buy "
             "protocol 112 panics at 10090, sell protocol 111 "
             "does not panic at 10090 and panics at 10091), as "
             "ProgramFailedToComplete with the message "
             "'buyback_fee never exceeds protocol_fee' and full "
             "rollback. Every success funds the user volume "
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
    "classifications": {"v2-fee-split-creator-buyback": len(report_cases)},
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
