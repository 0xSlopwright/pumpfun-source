#!/usr/bin/env python3
"""Build research/amm-sweep-liquidity-legacy-neutrality-20261029 receipts.

3rd run packet #6: a sweep is price-neutral for EVERY downstream path,
not just v2 trades (3rd #4). 3rd #3 pinned deposit/withdraw legs to
AVAILABLE reserves (raw vault quote minus accrued fees), which invites
the misreading that sweeping the accrual to zero must raise the legs
to the raw vault quote. It does not: the sweep also drains the vault
by exactly the swept amount, so available (raw - accrued) is invariant
under a sweep, exactly as effective (raw + vq) is. This packet measures
that invariance directly for deposit, withdraw, and legacy buy -- the
paths 3rd #4 and #3 left unchained across a sweep -- and pins it to the
unit with post-sweep limit gates.

Sharp results (all three images agree on every step):
- Sweep -> deposit legs are BYTE-IDENTICAL to fresh anchors at both
  scales: dep-1e9 quote 29,312,410 (not the raw-vault 29,312,440 a
  naive available reading predicts), dep-1e12 quote 29,312,409,095,
  base legs identical. Partial sweeps (protocol-only, creator-only)
  also leave the legs untouched: the leg moves with neither bucket.
- Sweep -> withdraw legs are likewise identical: wd-1e9 quote
  29,312,409, wd-1e12 quote 29,312,409,094, base legs identical.
- Limit gates pin the post-sweep available to the unit: after both
  sweeps, dep-1e9 with maxquote 29,312,410 succeeds and 29,312,409
  fails 6004 ExceededSlippage; wd-1e9 with minquote 29,312,409
  succeeds and 29,312,410 fails 6004. Available after both sweeps is
  still 122,946,564,838, not the raw 122,946,690,720.
- The deposit/withdraw virtual update stays disarmed across sweeps:
  a sweep converts accrual to vq 1:1, so vq + accrued stays 0, and
  no dep/wd step in this packet moves vq (contrast 3rd #3 family D,
  where a patched vq + accrued != 0 drifted vq by +30/-31).
- Round trips are sweep-transparent: dep-1e9 -> both sweeps -> wd-1e9
  nets exactly -1 base / -1 quote, the same as 3rd #3's sweep-free
  round trip; buy-1e10 -> both sweeps -> wd-1e9 returns exactly
  3rd #3's b-buy-wd legs (160,617,511,065 / 29,312,844).
- A deposit accrues nothing: dep-1e9 -> both sweeps -> both sweeps
  again ends in two silent no-ops (0 events, "Nothing to sweep").
- Legacy buy is sweep-invariant too: after both sweeps, or after the
  creator sweep alone, legacy buy 10^10 still spends 1,847,796 with
  vault +1,825,348 and legs protocol 8,487 / creator 5,475 / buyback
  8,486 -- the legacy curve prices off a sweep-invariant reserve,
  the same conclusion 3rd #4 drew for v2. (Legacy sell after a sweep
  was not chained here; see Limits.)
- Trade control arms re-confirm 3rd #4: both sweeps -> buy-1e10 and
  sell-1e10 settle byte-identical to fresh anchors.

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
OUT = ROOT / "research/amm-sweep-liquidity-legacy-neutrality-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}

ATA_PROG = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
PAYER_KEY = PAYER.pubkey()
CREATOR = Pubkey.from_bytes(bytes(poolraw[211:243]))
CREATOR_VAULT, _ = Pubkey.find_program_address([b'creator_vault', bytes(CREATOR)], PROGRAM)
CREATOR_ATA, _ = Pubkey.find_program_address([bytes(CREATOR_VAULT), bytes(TOKEN), bytes(quote)], ATA_PROG)
PROTOCOL = Pubkey.from_bytes(bytes(RAW[57:89]))
PROTOCOL_ATA, _ = Pubkey.find_program_address([bytes(PROTOCOL), bytes(TOKEN), bytes(quote)], ATA_PROG)
GVOL = Pubkey.find_program_address([b'global_volume_accumulator'], PROGRAM)[0]
GDISC = bytes(next(x for x in IDL['accounts'] if x['name'] == 'GlobalVolumeAccumulator')['discriminator'])
POOLV2 = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)[0]
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
MX = 2**64 - 1
VQ0, PF0, CF0 = -125882, 2488, 123394
S_ASIS = 4194352106721
S_DEP9 = S_ASIS + 10**9
S_WD9 = S_ASIS - 10**9
S_DEP12 = S_ASIS + 10**12
S_WD12 = S_ASIS - 10**12

DEP_KEYS = [pool, CONFIG_KEY, PAYER_KEY, base, quote, lp, userbase, userquote,
            userlp, vaultbase, vaultquote, TOKEN, TOKEN22, EVENT, PROGRAM]
TRD_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
            buyback, EVENT, PROGRAM]
SWP_KEYS_P = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, PROTOCOL, PROTOCOL_ATA,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_C = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, CREATOR_VAULT, CREATOR_ATA,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
LEG_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote, vaultbase, vaultquote,
            PROTOCOL, PROTOCOL_ATA, TOKEN, TOKEN, Pubkey.default(), ATA_PROG, EVENT, PROGRAM,
            CREATOR_ATA, CREATOR_VAULT, GVOL, volume, feeconfig, FEES]
LEG_REM = [AccountMeta(POOLV2, False, False), AccountMeta(BB_OWNER, False, False),
           AccountMeta(buyback, False, True)]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTOCOL_ATA, CREATOR_ATA]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTOCOL_ATA, "creatorata": CREATOR_ATA}
DEP_DISC = "78f83d531f8e6b90"
WD_DISC = "1609851aa02c47c0"
SWP_DISC = "82a42461e48287a5"
BUY_DISC = "67f4521f2cf57777"
SELL_DISC = "3e2f370aa503dc2a"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def setup_vm(binary, variant):
    h = Harness(binary)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, p in [(TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                   (TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so"),
                   (FEES, "evidence/original/pump_fees/deployed.so"),
                   (ATA_PROG, "evidence/dependencies/associated_token/deployed.so")]:
        vm.add_program_from_file(pid, ROOT / p)
    glob = bytearray(RAW)
    glob[56] = 0
    vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
    for n, row in f["accounts"].items():
        vm.set_account(Pubkey.from_string(row["address"]),
                       Account(row["lamports"], base64.b64decode(row["data_base64"]),
                               Pubkey.from_string(row["owner"])))
    vm.set_account(pool, Account(f["accounts"]["pool"]["lamports"], bytes(poolraw), PROGRAM))
    mint = struct.pack("<I", 1) + bytes(pool) + struct.pack("<Q", supply) + bytes([9, 1]) + bytes(36)
    vm.set_account(lp, Account(10**9, mint, TOKEN22))
    vm.set_account(userbase, Account(10**9, token(base, PAYER_KEY, 10**15, False), TOKEN))
    vm.set_account(userquote, Account(10**15 + 2039280, token(quote, PAYER_KEY, 10**15, True), TOKEN))
    vm.set_account(userlp, Account(10**9, token(lp, PAYER_KEY, supply // 2, False), TOKEN22))
    vm.set_account(volume, Account(0, b"", Pubkey.default()))
    if variant == "legacy":
        vm.set_account(GVOL, Account(10**9, GDISC + struct.pack('<qqq', 0, 0, 86400) + bytes(base) + bytes(480), PROGRAM))
        vm.set_account(PROTOCOL_ATA, Account(10**15 + 2039280, token(quote, PROTOCOL, 0, True), TOKEN))
        vm.set_account(CREATOR_ATA, Account(10**9, token(quote, CREATOR_VAULT, 0, True), TOKEN))
        vm.set_account(PROTOCOL, Account(10**9, b'', Pubkey.default()))
        vm.set_account(CREATOR_VAULT, Account(10**9, b'', Pubkey.default()))
        vm.set_account(POOLV2, Account(10**9, b'', Pubkey.default()))
        vm.set_account(BB_OWNER, Account(10**9, b'', Pubkey.default()))
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
    if kind in ("swp", "swc"):
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "recipient": raw[112:144].hex(),
                "amount": u64(raw, 176), "bucket": raw[184]}
    if kind == "lbuy":
        return {"disc": raw[:8].hex(), "len": len(raw)}
    return None


def check(cond, msg):
    if not cond:
        raise AssertionError(msg)


def disc(name):
    return bytes(next(x for x in IDL["instructions"] if x["name"] == name)["discriminator"])


def do_step(h, kind, args):
    if kind == "dep":
        name, keys, data, rem = "deposit", DEP_KEYS, disc("deposit") + struct.pack("<QQQ", *args), []
    elif kind == "wd":
        name, keys, data, rem = "withdraw", DEP_KEYS, disc("withdraw") + struct.pack("<QQQ", *args), []
    elif kind == "buy":
        name, keys, data, rem = "buy_v2", TRD_KEYS, disc("buy_v2") + struct.pack("<QQ", args[0], MX), []
    elif kind == "sell":
        name, keys, data, rem = "sell_v2", TRD_KEYS, disc("sell_v2") + struct.pack("<QQ", args[0], 0), []
    elif kind == "swp":
        name, keys, data, rem = "sweep_protocol_fee", SWP_KEYS_P, disc("sweep_protocol_fee"), []
    elif kind == "swc":
        name, keys, data, rem = "sweep_creator_fee", SWP_KEYS_C, disc("sweep_creator_fee"), []
    elif kind == "lbuy":
        name, keys, data, rem = "buy", LEG_KEYS, disc("buy") + struct.pack("<QQ", args[0], 10**12) + b'\x00', LEG_REM
    else:
        raise ValueError(kind)
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])] + list(rem)
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
      rollback=False, site_fragment=None, log_fragment=None, absent=None, lam_after=None):
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after),
            "volume": volume, "event": event, "events": events, "error": error,
            "rollback": rollback, "site_fragment": site_fragment,
            "log_fragment": log_fragment, "absent": absent or [],
            "lam_after": lam_after or {}}


def P(vq, pf, cf, sup=S_ASIS):
    return [vq, pf, cf, sup]


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


def DEP_EV(base_, quote_):
    return {"disc": DEP_DISC, "len": 264, "base": base_, "quote": quote_}


def WD_EV(base_, quote_):
    return {"disc": WD_DISC, "len": 264, "base": base_, "quote": quote_}


def BUY_EV(curve, lp_fee, proto_fee, qwlp, uin):
    return {"disc": BUY_DISC, "len": 500, "curve": curve, "lp_bps": 2,
            "lp_fee": lp_fee, "proto_bps": 93, "proto_fee": proto_fee,
            "qwlp": qwlp, "uin": uin}


def SELL_EV(curve, lp_fee, proto_fee, quote, uout):
    return {"disc": SELL_DISC, "len": 449, "curve": curve, "lp_bps": 2,
            "lp_fee": lp_fee, "proto_bps": 93, "proto_fee": proto_fee,
            "quote": quote, "uout": uout}


POOL_ASIS = P(VQ0, PF0, CF0)
D_DEP9 = {"userbase": -160619895224, "userquote": -29312410, "userlp": 10**9,
          "vaultbase": 160619895224, "vaultquote": 29312410}
D_WD9 = {"userbase": 160619895223, "userquote": 29312409, "userlp": -10**9,
         "vaultbase": -160619895223, "vaultquote": -29312409}
D_DEP12 = {"userbase": -160619895223680, "userquote": -29312409095, "userlp": 10**12,
           "vaultbase": 160619895223680, "vaultquote": 29312409095}
D_WD12 = {"userbase": 160619895223679, "userquote": 29312409094, "userlp": -10**12,
          "vaultbase": -160619895223679, "vaultquote": -29312409094}
D_BUY10 = {"userbase": 10**10, "userquote": -1847796, "userlp": 0,
           "vaultbase": -10**10, "vaultquote": 1839310, "buyback": 8486}
D_SELL10 = {"userbase": -10**10, "userquote": 1802115, "userlp": 0,
            "vaultbase": 10**10, "vaultquote": -1810601, "buyback": 8486}
EV_BUY10 = BUY_EV(1824983, 365, 16973, 1825348, 1847796)
EV_SELL10 = SELL_EV(1824927, 365, 16972, 1824562, 1802115)
SWP_P = E(-2044280, {"protoata": 2488, "vaultquote": -2488},
          P(-123394, 0, CF0), None,
          event=SWP_EV(2488, 0, PROTOCOL),
          lam_after={"protoata": 2039280 + 2488})
SWP_C = E(-2044280, {"creatorata": 123394, "vaultquote": -123394},
          P(-2488, PF0, 0), None,
          event=SWP_EV(123394, 1, CREATOR_VAULT),
          lam_after={"creatorata": 2039280 + 123394})
# Same sweeps, but in the legacy variant the recipient ATAs pre-exist,
# so each sweep costs only the 5,000 fee and moves no lamports.
SWP_P_LEG = E(-5000, {"protoata": 2488, "vaultquote": -2488},
               P(-123394, 0, CF0), None,
               event=SWP_EV(2488, 0, PROTOCOL))
SWP_C_LEG = E(-5000, {"creatorata": 123394, "vaultquote": -123394},
               P(-2488, PF0, 0), None,
               event=SWP_EV(123394, 1, CREATOR_VAULT))
D_LBUY10 = {"userbase": 10**10, "userquote": -1847796, "userlp": 0,
            "vaultbase": -10**10, "vaultquote": 1825348,
            "protoata": 8487, "creatorata": 5475, "buyback": 8486}

import copy
def swp_after(pool_after):
    e = copy.deepcopy(SWP_P)
    e["pool_after"] = list(pool_after)
    return e
def swc_after(pool_after):
    e = copy.deepcopy(SWP_C)
    e["pool_after"] = list(pool_after)
    return e

CASES = [
    # Family A -- fresh anchors (3rd #3 values, re-measured here)
    {"label": "a-dep-1e9", "variant": "std", "steps": [("dep", (10**9, MX, MX))],
     "expect": [E(-5000, D_DEP9, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410))]},
    {"label": "a-wd-1e9", "variant": "std", "steps": [("wd", (10**9, 0, 0))],
     "expect": [E(-5000, D_WD9, P(VQ0, PF0, CF0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409))]},
    {"label": "a-dep-1e12", "variant": "std", "steps": [("dep", (10**12, MX, MX))],
     "expect": [E(-5000, D_DEP12, P(VQ0, PF0, CF0, S_DEP12), None,
                  event=DEP_EV(160619895223680, 29312409095))]},
    {"label": "a-wd-1e12", "variant": "std", "steps": [("wd", (10**12, 0, 0))],
     "expect": [E(-5000, D_WD12, P(VQ0, PF0, CF0, S_WD12), None,
                  event=WD_EV(160619895223679, 29312409094))]},
    # Family S -- sweep -> deposit: legs identical to anchors
    {"label": "s-both-dep-1e9", "variant": "std",
     "steps": [("swp", ()), ("swc", ()), ("dep", (10**9, MX, MX))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, D_DEP9, P(0, 0, 0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410))]},
    {"label": "s-creator-dep-1e9", "variant": "std",
     "steps": [("swc", ()), ("dep", (10**9, MX, MX))],
     "expect": [SWP_C,
                E(-5000, D_DEP9, P(-2488, PF0, 0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410))]},
    {"label": "s-proto-dep-1e9", "variant": "std",
     "steps": [("swp", ()), ("dep", (10**9, MX, MX))],
     "expect": [SWP_P,
                E(-5000, D_DEP9, P(-123394, 0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410))]},
    {"label": "s-both-dep-1e12", "variant": "std",
     "steps": [("swp", ()), ("swc", ()), ("dep", (10**12, MX, MX))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, D_DEP12, P(0, 0, 0, S_DEP12), None,
                  event=DEP_EV(160619895223680, 29312409095))]},
    {"label": "s-creator-dep-1e12", "variant": "std",
     "steps": [("swc", ()), ("dep", (10**12, MX, MX))],
     "expect": [SWP_C,
                E(-5000, D_DEP12, P(-2488, PF0, 0, S_DEP12), None,
                  event=DEP_EV(160619895223680, 29312409095))]},
    {"label": "s-proto-dep-1e12", "variant": "std",
     "steps": [("swp", ()), ("dep", (10**12, MX, MX))],
     "expect": [SWP_P,
                E(-5000, D_DEP12, P(-123394, 0, CF0, S_DEP12), None,
                  event=DEP_EV(160619895223680, 29312409095))]},
    # Family W -- sweep -> withdraw: legs identical to anchors
    {"label": "w-both-wd-1e9", "variant": "std",
     "steps": [("swp", ()), ("swc", ()), ("wd", (10**9, 0, 0))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, D_WD9, P(0, 0, 0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409))]},
    {"label": "w-creator-wd-1e9", "variant": "std",
     "steps": [("swc", ()), ("wd", (10**9, 0, 0))],
     "expect": [SWP_C,
                E(-5000, D_WD9, P(-2488, PF0, 0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409))]},
    {"label": "w-proto-wd-1e9", "variant": "std",
     "steps": [("swp", ()), ("wd", (10**9, 0, 0))],
     "expect": [SWP_P,
                E(-5000, D_WD9, P(-123394, 0, CF0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409))]},
    {"label": "w-both-wd-1e12", "variant": "std",
     "steps": [("swp", ()), ("swc", ()), ("wd", (10**12, 0, 0))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, D_WD12, P(0, 0, 0, S_WD12), None,
                  event=WD_EV(160619895223679, 29312409094))]},
    # Family L -- limit gates pin the post-sweep available to the unit
    {"label": "l-both-dep-maxquote-low", "variant": "std",
     "steps": [("swp", ()), ("swc", ()), ("dep", (10**9, MX, 29312409))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, {}, P(0, 0, 0), None, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage")]},
    {"label": "l-both-dep-maxquote-exact", "variant": "std",
     "steps": [("swp", ()), ("swc", ()), ("dep", (10**9, MX, 29312410))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, D_DEP9, P(0, 0, 0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410))]},
    {"label": "l-both-wd-minquote-high", "variant": "std",
     "steps": [("swp", ()), ("swc", ()), ("wd", (10**9, 0, 29312410))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, {}, P(0, 0, 0), None, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage")]},
    {"label": "l-both-wd-minquote-exact", "variant": "std",
     "steps": [("swp", ()), ("swc", ()), ("wd", (10**9, 0, 29312409))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, D_WD9, P(0, 0, 0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409))]},
    # Family R -- round trips with a sweep in the middle
    {"label": "r-dep-sweep-wd", "variant": "std",
     "steps": [("dep", (10**9, MX, MX)), ("swp", ()), ("swc", ()), ("wd", (10**9, 0, 0))],
     "expect": [E(-5000, D_DEP9, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410)),
                swp_after(P(-123394, 0, CF0, S_DEP9)),
                swc_after(P(0, 0, 0, S_DEP9)),
                E(-5000, D_WD9, P(0, 0, 0), None,
                  event=WD_EV(160619895223, 29312409))]},
    {"label": "r-dep-sweep-sweep", "variant": "std",
     "steps": [("dep", (10**9, MX, MX)), ("swp", ()), ("swc", ()), ("swp", ()), ("swc", ())],
     "expect": [E(-5000, D_DEP9, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410)),
                swp_after(P(-123394, 0, CF0, S_DEP9)),
                swc_after(P(0, 0, 0, S_DEP9)),
                E(-5000, {}, P(0, 0, 0, S_DEP9), None, events=0,
                  log_fragment="Nothing to sweep"),
                E(-5000, {}, P(0, 0, 0, S_DEP9), None, events=0,
                  log_fragment="Nothing to sweep")]},
    {"label": "r-buy-sweep-wd", "variant": "std",
     "steps": [("buy", (10**10,)), ("swp", ()), ("swc", ()), ("wd", (10**9, 0, 0))],
     "expect": [E(-1849400, D_BUY10, P(-139844, 10975, 128869), VOL_CREATED, event=EV_BUY10),
                E(-2044280, {"protoata": 10975, "vaultquote": -10975},
                  P(-128869, 0, 128869), VOL_CREATED,
                  event=SWP_EV(10975, 0, PROTOCOL),
                  lam_after={"protoata": 2039280 + 10975}),
                E(-2044280, {"creatorata": 128869, "vaultquote": -128869},
                  P(0, 0, 0), VOL_CREATED,
                  event=SWP_EV(128869, 1, CREATOR_VAULT),
                  lam_after={"creatorata": 2039280 + 128869}),
                E(-5000, {"userbase": 160617511065, "userquote": 29312844, "userlp": -10**9,
                          "vaultbase": -160617511065, "vaultquote": -29312844},
                  P(0, 0, 0, S_WD9), VOL_CREATED,
                  event=WD_EV(160617511065, 29312844))]},
    # Family T -- trade control arms (3rd #4 result, re-measured)
    {"label": "t-both-buy-1e10", "variant": "std",
     "steps": [("swp", ()), ("swc", ()), ("buy", (10**10,))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-1849400, D_BUY10, P(-13962, 8487, 5475), VOL_CREATED, event=EV_BUY10)]},
    {"label": "t-both-sell-1e10", "variant": "std",
     "steps": [("swp", ()), ("swc", ()), ("sell", (10**10,))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-1849400, D_SELL10, P(-13961, 8486, 5475), VOL_CREATED, event=EV_SELL10)]},
    # Family G -- legacy buy after a sweep (legacy variant: ATAs pre-exist)
    {"label": "g-both-lbuy", "variant": "legacy",
     "steps": [("swp", ()), ("swc", ()), ("lbuy", (10**10,))],
     "expect": [SWP_P_LEG, E(-5000, {"creatorata": 123394, "vaultquote": -123394},
                              P(0, 0, 0), None,
                              event=SWP_EV(123394, 1, CREATOR_VAULT)),
                E(-1849400, D_LBUY10, P(0, 0, 0), VOL_CREATED,
                  event={"disc": BUY_DISC, "len": 497})]},
    {"label": "g-creator-lbuy", "variant": "legacy",
     "steps": [("swc", ()), ("lbuy", (10**10,))],
     "expect": [SWP_C_LEG,
                E(-1849400, D_LBUY10, P(-2488, PF0, 0), VOL_CREATED,
                  event={"disc": BUY_DISC, "len": 497})]},
]

STEP_KIND = {"dep": "dep", "wd": "wd", "buy": "buy", "sell": "sell",
             "swp": "swp", "swc": "swc", "lbuy": "lbuy"}


def run_case(case, image_name, binary):
    h = setup_vm(binary, case["variant"])
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
            got_d = tok_delta(rec, ROLE_KEY[role])
            check(got_d == want, f"{tag}: delta {role} {got_d} != {want}")
        for role, want in exp["lam_after"].items():
            got = rec["after"][str(ROLE_KEY[role])]
            check(got is not None and got["lamports"] == want,
                  f"{tag}: lam_after {role} {None if got is None else got['lamports']} != {want}")
        for role in exp["absent"]:
            check(rec["after"][str(ROLE_KEY[role])] is None,
                  f"{tag}: {role} should stay absent")
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
        if exp.get("log_fragment"):
            blob = "\n".join(rec["logs"])
            check(exp["log_fragment"] in blob,
                  f"{tag}: log fragment {exp['log_fragment']} not in logs")
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
        report_cases.append({"label": case["label"], "variant": case["variant"],
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
