#!/usr/bin/env python3
"""Build research/amm-liquidity-trade-chains-20261029 receipts.

3rd run packet #3: deposit/withdraw quote legs price off AVAILABLE
reserves (raw vault quote minus accrued protocol/creator fees), not
off raw vault quote and not off virtual reserves; liquidity<->trade
chains move big trades by a few quote units while small trades are
byte-identical; and the can_boost virtual-drift branch fires on
vq + accrued != 0 alone -- no boost vault needed -- with deposit
floor / withdraw ceil drift and a 6023 Overflow when the sum is
negative (u128 conversion of a negative effective virtual).

Measured on the repository liquidity fixture (base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882, so available == effective ==
122,946,564,838 on the as-is fixture), on three program images
(original, #424 control, #427 candidate). One signed transaction
per step; receipts stored 10 per part.

Sharp results (all three images agree on every step):
- dep-1e9 costs 29,312,410 quote on the as-is fixture, 30 less
  than 2nd #40's zeroed-accrued fixture (29,312,440): the quote
  leg is ceil(lp * available / supply), available = raw - accrued.
  Base leg is ceil(lp * raw_base / supply), unchanged by accrued.
- Small trades are invariant to a 10^9 LP deposit: buy_v2 10^6
  spends 187 and sell_v2 10^6 pays 178 with or without the deposit.
- A 10^12 LP deposit (+24% vaults) moves a 10^10 trade by exactly
  6 quote units in the trader's favor both ways (buy 1,847,796 ->
  1,847,790; sell 1,802,115 -> 1,802,121) while pool fee accruals
  (pf/cf/vq deltas) are identical.
- Trade -> withdraw: withdraw legs price off POST-trade vaults
  and POST-trade accrued (buy-1e10 -> wd-1e9 returns base
  160,617,511,065 / quote 29,312,844; sell-1e10 -> wd-1e9 returns
  160,622,279,382 / 29,311,974, vs fresh wd 160,619,895,223 /
  29,312,409).
- Round trips lose exactly 1 base + 1 quote (ceil in, floor out)
  at 10^9 and 10^12, with or without trades in between; the full
  dep->buy->sell->wd chain nets user base -1, quote -10 (vault
  +1/+8, buyback +2, payer fees -1,864,400).
- Limit gates pin the available basis: dep-1e9 maxquote 29,312,409
  -> 6004, 29,312,410 ok; wd-1e9 minquote 29,312,410 -> 6004,
  29,312,409 ok.
- Reserve-definition separation: patching vq to 0 or +10^9 with
  accrued kept leaves dep/wd quote legs EXACTLY unchanged
  (29,312,410 / 29,312,409) -- vq is never consulted by the
  liquidity quote legs -- but the can_boost branch still runs
  (vq + accrued != 0) and drifts vq: dep +30 (floor), wd -31
  (ceil), dep->wd round trip net -1; vq=+10^9 dep drifts +238,445.
  Trade pricing DOES consult vq (effective = raw + vq): on the
  vq=0 fixture buy-1e10 spends 1,847,798 (+2 vs as-is) and
  sell-1e10 pays 1,802,117 (+2).
- Negative effective virtual kills both paths: accrued zeroed
  with vq -125,882 left -> dep and wd both fail 6023 Overflow
  (deposit.rs:152 / withdraw.rs:160 original; rebuilt lines in
  report error_sites), full rollback, because can_boost is true
  (vq + accrued = -125,882 != 0) and u128::try_from(negative)
  fails before any transfer settles.

The builder asserts every expected value below per image before
writing. The packet's producer.py is this file.
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
    CONFIG, CONFIG_KEY, EVENT, IDL, PAYER, PROGRAM, RAW, TOKEN, TOKEN22,
    base, f, lp, pool, poolraw, quote, supply, token,
    userbase, userlp, userquote, vaultbase, vaultquote,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, volume

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-liquidity-trade-chains-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}

PAYER_KEY = PAYER.pubkey()
SUPPLY = supply
MX = 2**64 - 1
VQ0, PF0, CF0 = -125882, 2488, 123394

DEP_KEYS = [pool, CONFIG_KEY, PAYER_KEY, base, quote, lp, userbase, userquote,
            userlp, vaultbase, vaultquote, TOKEN, TOKEN22, EVENT, PROGRAM]
TRD_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
            buyback, EVENT, PROGRAM]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY]
DEP_DISC = "78f83d531f8e6b90"
WD_DISC = "1609851aa02c47c0"
BUY_DISC = "67f4521f2cf57777"
SELL_DISC = "3e2f370aa503dc2a"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def setup_vm(binary, patch):
    h = Harness(binary)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, p in [(TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                   (TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so"),
                   (FEES, "evidence/original/pump_fees/deployed.so")]:
        vm.add_program_from_file(pid, ROOT / p)
    glob = bytearray(RAW)
    glob[56] = 0
    vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
    for n, row in f["accounts"].items():
        vm.set_account(Pubkey.from_string(row["address"]),
                       Account(row["lamports"], base64.b64decode(row["data_base64"]),
                               Pubkey.from_string(row["owner"])))
    pd = bytearray(poolraw)
    if patch.get("vq") is not None:
        pd[245:261] = patch["vq"].to_bytes(16, "little", signed=True)
    if patch.get("pf") is not None:
        pd[271:279] = struct.pack("<Q", patch["pf"])
    if patch.get("cf") is not None:
        pd[279:287] = struct.pack("<Q", patch["cf"])
    vm.set_account(pool, Account(f["accounts"]["pool"]["lamports"], bytes(pd), PROGRAM))
    mint = struct.pack("<I", 1) + bytes(pool) + struct.pack("<Q", SUPPLY) + bytes([9, 1]) + bytes(36)
    vm.set_account(lp, Account(10**9, mint, TOKEN22))
    vm.set_account(userbase, Account(10**9, token(base, PAYER_KEY, 10**15, False), TOKEN))
    vm.set_account(userquote, Account(10**15 + 2039280, token(quote, PAYER_KEY, 10**15, True), TOKEN))
    vm.set_account(userlp, Account(10**9, token(lp, PAYER_KEY, SUPPLY // 2, False), TOKEN22))
    vm.set_account(volume, Account(0, b"", Pubkey.default()))
    return h


def snap(vm):
    out = {}
    for k in WATCH:
        a = vm.get_account(k)
        out[str(k)] = None if a is None else {
            "lamports": a.lamports, "owner": str(a.owner),
            "data_hex": bytes(a.data).hex()}
    return out


def tok_amount(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", raw, 64)[0] if len(raw) >= 72 else None


def tok_delta(rec, key):
    b = rec["before"][str(key)]
    a = rec["after"][str(key)]
    return (tok_amount(a) or 0) - (tok_amount(b) or 0)


def lam_delta(rec, key):
    b = rec["before"][str(key)]
    a = rec["after"][str(key)]
    return (a["lamports"] if a else 0) - (b["lamports"] if b else 0)


def pool_state(entry):
    d = bytes.fromhex(entry["data_hex"])
    return (int.from_bytes(d[245:261], "little", signed=True),
            struct.unpack_from("<Q", d, 271)[0],
            struct.unpack_from("<Q", d, 279)[0],
            struct.unpack_from("<Q", d, 203)[0])


def vol_state(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    return {"lamports": entry["lamports"], "len": len(raw),
            "user": raw[8:40].hex()}


def ev_data(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    return base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())


def u64(raw, off):
    return struct.unpack_from("<Q", raw, off)[0]


def decode_event(kind, rec):
    raw = ev_data(rec["logs"])
    if raw is None:
        return None
    if kind in ("dep", "wd"):
        return {"disc": raw[:8].hex(), "len": len(raw),
                "base": u64(raw, 72), "quote": u64(raw, 80)}
    if kind == "buy":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_bps": u64(raw, 72),
                "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
                "proto_fee": u64(raw, 96), "qwlp": u64(raw, 104),
                "uin": u64(raw, 112)}
    if kind == "sell":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_bps": u64(raw, 72),
                "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
                "proto_fee": u64(raw, 96), "quote": u64(raw, 104),
                "uout": u64(raw, 112)}
    return None


def check(cond, msg):
    if not cond:
        raise AssertionError(msg)


def do_step(h, kind, args):
    if kind == "dep":
        name, keys, data = "deposit", DEP_KEYS, bytes(
            next(x for x in IDL["instructions"] if x["name"] == "deposit")["discriminator"]
        ) + struct.pack("<QQQ", *args)
    elif kind == "wd":
        name, keys, data = "withdraw", DEP_KEYS, bytes(
            next(x for x in IDL["instructions"] if x["name"] == "withdraw")["discriminator"]
        ) + struct.pack("<QQQ", *args)
    elif kind == "buy":
        name, keys, data = "buy_v2", TRD_KEYS, bytes(
            next(x for x in IDL["instructions"] if x["name"] == "buy_v2")["discriminator"]
        ) + struct.pack("<QQ", args[0], MX)
    elif kind == "sell":
        name, keys, data = "sell_v2", TRD_KEYS, bytes(
            next(x for x in IDL["instructions"] if x["name"] == "sell_v2")["discriminator"]
        ) + struct.pack("<QQ", args[0], 0)
    else:
        raise ValueError(kind)
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, data, metas)], PAYER_KEY, [PAYER], h.vm.latest_blockhash())
    assert tx.verify_with_results() and all(tx.verify_with_results())
    before = snap(h.vm)
    r = h.vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    logs = meta.logs()
    return {"transaction_base64": base64.b64encode(bytes(tx)).decode(),
            "error": str(r.err()) if failed else None, "logs": logs,
            "events": [l for l in logs if l.startswith("Program data: ")],
            "before": before, "after": snap(h.vm),
            "site": next((l for l in logs if "thrown in" in l or "caused by account" in l), None)}


VOL_CREATED = {"lamports": 1844400, "len": 137, "user": bytes(PAYER_KEY).hex()}


def E(dPAYER, deltas, pool_after, volume, event=None, events=1, error=None,
      rollback=False, site_fragment=None):
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after),
            "volume": volume, "event": event, "events": events, "error": error,
            "rollback": rollback, "site_fragment": site_fragment}


def DEP_EV(base, quote):
    return {"disc": DEP_DISC, "len": 264, "base": base, "quote": quote}


def WD_EV(base, quote):
    return {"disc": WD_DISC, "len": 264, "base": base, "quote": quote}


def BUY_EV(curve, lp_fee, proto_fee, qwlp, uin):
    return {"disc": BUY_DISC, "len": 500, "curve": curve, "lp_bps": 2,
            "lp_fee": lp_fee, "proto_bps": 93, "proto_fee": proto_fee,
            "qwlp": qwlp, "uin": uin}


def SELL_EV(curve, lp_fee, proto_fee, quote, uout):
    return {"disc": SELL_DISC, "len": 449, "curve": curve, "lp_bps": 2,
            "lp_fee": lp_fee, "proto_bps": 93, "proto_fee": proto_fee,
            "quote": quote, "uout": uout}


S_ASIS = 4194352106721
S_DEP9 = 4195352106721
S_WD9 = 4193352106721
S_DEP12 = 5194352106721
POOL_ASIS = (VQ0, PF0, CF0, S_ASIS)
D_DEP9 = {"userbase": -160619895224, "userquote": -29312410, "userlp": 10**9,
          "vaultbase": 160619895224, "vaultquote": 29312410, "buyback": 0}
D_WD9 = {"userbase": 160619895223, "userquote": 29312409, "userlp": -10**9,
         "vaultbase": -160619895223, "vaultquote": -29312409, "buyback": 0}
D_DEP12 = {"userbase": -160619895223680, "userquote": -29312409095, "userlp": 10**12,
           "vaultbase": 160619895223680, "vaultquote": 29312409095, "buyback": 0}
D_WD12 = {"userbase": 160619895223679, "userquote": 29312409094, "userlp": -10**12,
          "vaultbase": -160619895223679, "vaultquote": -29312409094, "buyback": 0}
D_BUY6 = {"userbase": 10**6, "userquote": -187, "userlp": 0,
          "vaultbase": -10**6, "vaultquote": 186, "buyback": 1}
D_SELL6 = {"userbase": -10**6, "userquote": 178, "userlp": 0,
           "vaultbase": 10**6, "vaultquote": -179, "buyback": 1}
D_BUY10 = {"userbase": 10**10, "userquote": -1847796, "userlp": 0,
           "vaultbase": -10**10, "vaultquote": 1839310, "buyback": 8486}
D_SELL10 = {"userbase": -10**10, "userquote": 1802115, "userlp": 0,
            "vaultbase": 10**10, "vaultquote": -1810601, "buyback": 8486}
POOL_BUY6 = (-125884, 2489, 123395)
POOL_SELL6 = (-125884, 2489, 123395)
POOL_BUY10 = (-139844, 10975, 128869)
POOL_SELL10 = (-139843, 10974, 128869)


def P(vq, pf, cf, sup):
    return [vq, pf, cf, sup]


CASES = [
    # Family A -- anchors, as-is fixture
    {"label": "a-dep-1e9", "patch": {}, "steps": [("dep", (10**9, MX, MX))],
     "expect": [E(-5000, D_DEP9, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410))]},
    {"label": "a-wd-1e9", "patch": {}, "steps": [("wd", (10**9, 0, 0))],
     "expect": [E(-5000, D_WD9, P(VQ0, PF0, CF0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409))]},
    {"label": "a-buy-1e6", "patch": {}, "steps": [("buy", (10**6,))],
     "expect": [E(-1849400, D_BUY6, P(*POOL_BUY6, S_ASIS), VOL_CREATED,
                  event=BUY_EV(183, 1, 2, 184, 187))]},
    {"label": "a-sell-1e6", "patch": {}, "steps": [("sell", (10**6,))],
     "expect": [E(-1849400, D_SELL6, P(*POOL_SELL6, S_ASIS), VOL_CREATED,
                  event=SELL_EV(182, 1, 2, 181, 178))]},
    {"label": "a-buy-1e10", "patch": {}, "steps": [("buy", (10**10,))],
     "expect": [E(-1849400, D_BUY10, P(*POOL_BUY10, S_ASIS), VOL_CREATED,
                  event=BUY_EV(1824983, 365, 16973, 1825348, 1847796))]},
    {"label": "a-sell-1e10", "patch": {}, "steps": [("sell", (10**10,))],
     "expect": [E(-1849400, D_SELL10, P(*POOL_SELL10, S_ASIS), VOL_CREATED,
                  event=SELL_EV(1824927, 365, 16972, 1824562, 1802115))]},
    {"label": "a-dep-1e12", "patch": {}, "steps": [("dep", (10**12, MX, MX))],
     "expect": [E(-5000, D_DEP12, P(VQ0, PF0, CF0, S_DEP12), None,
                  event=DEP_EV(160619895223680, 29312409095))]},
    {"label": "a-wd-1e12", "patch": {}, "steps": [("wd", (10**12, 0, 0))],
     "expect": [E(-5000, D_WD12, P(VQ0, PF0, CF0, S_ASIS - 10**12), None,
                  event=WD_EV(160619895223679, 29312409094))]},
    # Family B -- chains
    {"label": "b-dep-buy-1e6", "patch": {},
     "steps": [("dep", (10**9, MX, MX)), ("buy", (10**6,))],
     "expect": [E(-5000, D_DEP9, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410)),
                E(-1849400, D_BUY6, P(*POOL_BUY6, S_DEP9), VOL_CREATED,
                  event=BUY_EV(183, 1, 2, 184, 187))]},
    {"label": "b-dep-sell-1e6", "patch": {},
     "steps": [("dep", (10**9, MX, MX)), ("sell", (10**6,))],
     "expect": [E(-5000, D_DEP9, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410)),
                E(-1849400, D_SELL6, P(*POOL_SELL6, S_DEP9), VOL_CREATED,
                  event=SELL_EV(182, 1, 2, 181, 178))]},
    {"label": "b-dep12-buy-1e10", "patch": {},
     "steps": [("dep", (10**12, MX, MX)), ("buy", (10**10,))],
     "expect": [E(-5000, D_DEP12, P(VQ0, PF0, CF0, S_DEP12), None,
                  event=DEP_EV(160619895223680, 29312409095)),
                E(-1849400, {"userbase": 10**10, "userquote": -1847790, "userlp": 0,
                             "vaultbase": -10**10, "vaultquote": 1839304, "buyback": 8486},
                  P(*POOL_BUY10, S_DEP12), VOL_CREATED,
                  event=BUY_EV(1824977, 365, 16973, 1825342, 1847790))]},
    {"label": "b-dep12-sell-1e10", "patch": {},
     "steps": [("dep", (10**12, MX, MX)), ("sell", (10**10,))],
     "expect": [E(-5000, D_DEP12, P(VQ0, PF0, CF0, S_DEP12), None,
                  event=DEP_EV(160619895223680, 29312409095)),
                E(-1849400, {"userbase": -10**10, "userquote": 1802121, "userlp": 0,
                             "vaultbase": 10**10, "vaultquote": -1810607, "buyback": 8486},
                  P(*POOL_SELL10, S_DEP12), VOL_CREATED,
                  event=SELL_EV(1824933, 365, 16972, 1824568, 1802121))]},
    {"label": "b-buy-wd", "patch": {},
     "steps": [("buy", (10**10,)), ("wd", (10**9, 0, 0))],
     "expect": [E(-1849400, D_BUY10, P(*POOL_BUY10, S_ASIS), VOL_CREATED,
                  event=BUY_EV(1824983, 365, 16973, 1825348, 1847796)),
                E(-5000, {"userbase": 160617511065, "userquote": 29312844, "userlp": -10**9,
                          "vaultbase": -160617511065, "vaultquote": -29312844, "buyback": 0},
                  P(*POOL_BUY10, S_WD9), VOL_CREATED,
                  event=WD_EV(160617511065, 29312844))]},
    {"label": "b-sell-wd", "patch": {},
     "steps": [("sell", (10**10,)), ("wd", (10**9, 0, 0))],
     "expect": [E(-1849400, D_SELL10, P(*POOL_SELL10, S_ASIS), VOL_CREATED,
                  event=SELL_EV(1824927, 365, 16972, 1824562, 1802115)),
                E(-5000, {"userbase": 160622279382, "userquote": 29311974, "userlp": -10**9,
                          "vaultbase": -160622279382, "vaultquote": -29311974, "buyback": 0},
                  P(*POOL_SELL10, S_WD9), VOL_CREATED,
                  event=WD_EV(160622279382, 29311974))]},
    {"label": "b-roundtrip-small", "patch": {},
     "steps": [("dep", (10**9, MX, MX)), ("buy", (10**6,)), ("sell", (10**6,)),
               ("wd", (10**9, 0, 0))],
     "expect": [E(-5000, D_DEP9, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410)),
                E(-1849400, D_BUY6, P(*POOL_BUY6, S_DEP9), VOL_CREATED,
                  event=BUY_EV(183, 1, 2, 184, 187)),
                E(-5000, D_SELL6, P(-125886, 2490, 123396, S_DEP9), VOL_CREATED,
                  event=SELL_EV(182, 1, 2, 181, 178)),
                E(-5000, D_WD9, P(-125886, 2490, 123396, S_ASIS), VOL_CREATED,
                  event=WD_EV(160619895223, 29312409))]},
    {"label": "b-roundtrip-1e9", "patch": {},
     "steps": [("dep", (10**9, MX, MX)), ("wd", (10**9, 0, 0))],
     "expect": [E(-5000, D_DEP9, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410)),
                E(-5000, D_WD9, P(VQ0, PF0, CF0, S_ASIS), None,
                  event=WD_EV(160619895223, 29312409))]},
    {"label": "b-roundtrip-1e12", "patch": {},
     "steps": [("dep", (10**12, MX, MX)), ("wd", (10**12, 0, 0))],
     "expect": [E(-5000, D_DEP12, P(VQ0, PF0, CF0, S_DEP12), None,
                  event=DEP_EV(160619895223680, 29312409095)),
                E(-5000, D_WD12, P(VQ0, PF0, CF0, S_ASIS), None,
                  event=WD_EV(160619895223679, 29312409094))]},
    # Family C -- limit gates pin the available basis
    {"label": "c-dep-maxquote-low", "patch": {}, "steps": [("dep", (10**9, MX, 29312409))],
     "expect": [E(-5000, {}, POOL_ASIS, None, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage")]},
    {"label": "c-dep-maxquote-exact", "patch": {}, "steps": [("dep", (10**9, MX, 29312410))],
     "expect": [E(-5000, D_DEP9, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410))]},
    {"label": "c-wd-minquote-high", "patch": {}, "steps": [("wd", (10**9, 0, 29312410))],
     "expect": [E(-5000, {}, POOL_ASIS, None, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage")]},
    {"label": "c-wd-minquote-exact", "patch": {}, "steps": [("wd", (10**9, 0, 29312409))],
     "expect": [E(-5000, D_WD9, P(VQ0, PF0, CF0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409))]},
    # Family D -- reserve-definition separation
    {"label": "d-vq0-dep", "patch": {"vq": 0}, "steps": [("dep", (10**9, MX, MX))],
     "expect": [E(-5000, D_DEP9, P(30, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410))]},
    {"label": "d-vq0-wd", "patch": {"vq": 0}, "steps": [("wd", (10**9, 0, 0))],
     "expect": [E(-5000, D_WD9, P(-31, PF0, CF0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409))]},
    {"label": "d-vq1e9-dep", "patch": {"vq": 10**9}, "steps": [("dep", (10**9, MX, MX))],
     "expect": [E(-5000, D_DEP9, P(1000238445, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410))]},
    {"label": "d-vq0-roundtrip", "patch": {"vq": 0},
     "steps": [("dep", (10**9, MX, MX)), ("wd", (10**9, 0, 0))],
     "expect": [E(-5000, D_DEP9, P(30, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410)),
                E(-5000, D_WD9, P(-1, PF0, CF0, S_ASIS), None,
                  event=WD_EV(160619895223, 29312409))]},
    {"label": "d-vq0-buy", "patch": {"vq": 0}, "steps": [("buy", (10**10,))],
     "expect": [E(-1849400, {"userbase": 10**10, "userquote": -1847798, "userlp": 0,
                             "vaultbase": -10**10, "vaultquote": 1839312, "buyback": 8486},
                  P(-13962, 10975, 128869, S_ASIS), VOL_CREATED,
                  event=BUY_EV(1824985, 365, 16973, 1825350, 1847798))]},
    {"label": "d-vq0-sell", "patch": {"vq": 0}, "steps": [("sell", (10**10,))],
     "expect": [E(-1849400, {"userbase": -10**10, "userquote": 1802117, "userlp": 0,
                             "vaultbase": 10**10, "vaultquote": -1810603, "buyback": 8486},
                  P(-13961, 10974, 128869, S_ASIS), VOL_CREATED,
                  event=SELL_EV(1824929, 365, 16972, 1824564, 1802117))]},
    {"label": "d-negvq-acc0-dep", "patch": {"pf": 0, "cf": 0},
     "steps": [("dep", (10**9, MX, MX))],
     "expect": [E(-5000, {}, P(VQ0, 0, 0, S_ASIS), None, events=0, error="6023",
                  rollback=True, site_fragment="Overflow")]},
    {"label": "d-negvq-acc0-wd", "patch": {"pf": 0, "cf": 0},
     "steps": [("wd", (10**9, 0, 0))],
     "expect": [E(-5000, {}, P(VQ0, 0, 0, S_ASIS), None, events=0, error="6023",
                  rollback=True, site_fragment="Overflow")]},
]

STEP_KIND = {"dep": "dep", "wd": "wd", "buy": "buy", "sell": "sell"}


def run_case(case, image_name, binary):
    h = setup_vm(binary, case["patch"])
    out = []
    for (kind, args), exp in zip(case["steps"], case["expect"]):
        rec = do_step(h, kind, args)
        tag = f"{case['label']}/{image_name}/{kind}"
        if exp["error"] is None:
            check(rec["error"] is None, f"{tag}: unexpected error {rec['error']}")
        else:
            check(rec["error"] is not None and exp["error"] in rec["error"],
                  f"{tag}: expected error {exp['error']}, got {rec['error']}")
        check(len(rec["events"]) == exp["events"],
              f"{tag}: events {len(rec['events'])} != {exp['events']}")
        d_payer = lam_delta(rec, PAYER_KEY)
        check(d_payer == exp["dPAYER"], f"{tag}: dPAYER {d_payer} != {exp['dPAYER']}")
        for role, want in exp["deltas"].items():
            key = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
                   "vaultbase": vaultbase, "vaultquote": vaultquote,
                   "buyback": buyback}[role]
            got_d = tok_delta(rec, key)
            check(got_d == want, f"{tag}: delta {role} {got_d} != {want}")
        got_pool = pool_state(rec["after"][str(pool)])
        check(list(got_pool) == exp["pool_after"],
              f"{tag}: pool {got_pool} != {exp['pool_after']}")
        got_vol = vol_state(rec["after"][str(volume)])
        check(got_vol == exp["volume"], f"{tag}: volume {got_vol} != {exp['volume']}")
        if exp.get("rollback"):
            for k, b in rec["before"].items():
                if k == str(PAYER_KEY):
                    continue
                check(rec["after"][k] == b, f"{tag}: rollback violated for {k}")
        if exp.get("event") is not None:
            got = decode_event(STEP_KIND[kind], rec)
            check(got is not None, f"{tag}: event decode failed")
            for fkey, want in exp["event"].items():
                check(got.get(fkey) == want, f"{tag}: event {fkey} {got.get(fkey)} != {want}")
        if exp.get("site_fragment"):
            blob = "\n".join(rec["logs"])
            check(exp["site_fragment"] in blob,
                  f"{tag}: site fragment {exp['site_fragment']} not in logs")
        rec["case"] = case["label"]
        rec["image"] = image_name
        rec["step"] = kind
        out.append(rec)
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "runtime").mkdir(exist_ok=True)
    receipts = []
    report_cases = []
    for case in CASES:
        per_image = {}
        for image_name, binary in IMAGES.items():
            per_image[image_name] = run_case(case, image_name, binary)
        for rec in per_image["original"]:
            receipts.append(rec)

        def surface(recs):
            out = []
            for rec in recs:
                def strip(snap):
                    d = dict(snap)
                    if d.get(str(PAYER_KEY)) is not None:
                        d[str(PAYER_KEY)] = dict(d[str(PAYER_KEY)])
                        d[str(PAYER_KEY)]["lamports"] = 0
                    return d
                out.append({"step": rec["step"], "error": rec["error"],
                            "events": len(rec["events"]),
                            "before": strip(rec["before"]), "after": strip(rec["after"])})
            return out
        base = surface(per_image["original"])
        for image_name in ("control", "candidate"):
            check(surface(per_image[image_name]) == base,
                  f"{case['label']}: {image_name} observed surface differs from original")
            for rec in per_image[image_name]:
                receipts.append(rec)
        report_cases.append({"label": case["label"], "patch": case["patch"],
                             "steps": case["expect"],
                             "error_sites": {image_name: [r["site"] for r in per_image[image_name]] for image_name in IMAGES}})
        print(f"OK {case['label']} ({len(case['steps'])} steps x 3 images)")
    parts = []
    for i in range(0, len(receipts), 10):
        chunk = receipts[i:i + 10]
        name = f"raw-transactions-part{i // 10 + 1:02d}.jsonl.gz"
        path = OUT / "runtime" / name
        with gzip.open(path, "wt", encoding="utf-8") as fh:
            for rec in chunk:
                fh.write(json.dumps(rec) + "\n")
        parts.append({"file": f"runtime/{name}", "count": len(chunk),
                      "sha256": sha(path.read_bytes()), "bytes": path.stat().st_size})
    report = {"case_count": len(CASES), "receipt_count": len(receipts),
              "counts": {"cases": len(CASES), "receipts": len(receipts),
                         "parts": len(parts)},
              "mismatches": [],
              "input_sha256": {k: IMAGE_SHA[k] for k in IMAGES},
              "parts": parts, "cases": report_cases,
              "images": {k: IMAGE_SHA[k] for k in IMAGES}}
    with gzip.open(OUT / "runtime" / "report.json.gz", "wt", encoding="utf-8") as fh:
        fh.write(json.dumps(report, indent=2))
    print(f"cases={len(CASES)} receipts={len(receipts)} parts={len(parts)}")
    for p in parts:
        print(f"  {p['file']} {p['count']} receipts {p['bytes']} bytes")
    print("NEXT: write verify.py and README.md, then regenerate MANIFEST.json")


if __name__ == "__main__":
    main()
