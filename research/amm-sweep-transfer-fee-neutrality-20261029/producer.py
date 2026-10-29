#!/usr/bin/env python3
"""Build research/amm-sweep-transfer-fee-neutrality-20261029 receipts.

3rd run packet #8: sweep price neutrality UNDER a quote transfer fee --
the two gaps 3rd #6 and #7 left open in their Limits (sweep ->
deposit/withdraw under tf, sweep -> legacy sell under tf). The
question is sharp because a sweep itself moves quote tokens under
the fee (3rd #5: vault spends gross, recipient gains net, event
gross), so the neutrality 3rd #6/#7 proved for nofee legs could
have broken in three places: the sweep's own withholding, the
downstream leg's gross-up/net-down, or the limit gates' sides.

Sharp results (all three images agree on every step):
- Sweep -> deposit/withdraw/legacy-sell legs are BYTE-IDENTICAL
  to the tf anchors at both tf100 and (for sell) tf5000: the
  sweep's withholding is confined to the sweep step itself and
  never leaks into the downstream leg. Deposit still grosses up
  the user spend (tf100: 29,608,495 for a 29,312,410 vault
  receipt); withdraw still nets the user down (tf100: 29,019,284
  from a 29,312,409 vault send); legacy sell still nets every
  leg by ceiling withholding (tf100: user 178,409, proto 840,
  creator 542, buyback 840 from gross 180,212 / 849 / 548 / 849)
  while the vault always moves gross (-182,458) and the event
  reports gross throughout (SellEvent uout 180,212).
- Limit gates keep their sides under tf after a sweep:
  deposit maxquote is gross-side (gross-1 -> 6004, gross exact
  -> success, net -> 6004), withdraw minquote is net-side
  (net exact -> success, net+1 -> 6004, gross -> 6004), and
  legacy-sell minquote is net-side too (net exact -> success,
  net+1 -> 6004, and the nofee anchor limit 180,212 itself
  FAILS 6004 under tf -- a limit copied from a nofee anchor
  does not survive the fee).
- Round trip dep -> sweeps -> wd under tf100 nets exactly -1
  base / -589,211 quote (dep spend 29,608,495 minus wd receipt
  29,019,284); the vault nets +1 quote; withheld accumulates on
  both sides (vault 296,085 from the deposit, user 293,125 from
  the withdraw).
- Underfunded-ATA rent asymmetry (tf100): a Token-2022 ATA
  funded at the 165-byte rent (2,039,280) instead of the
  182-byte rent (2,157,600) fails the protocol sweep at the
  TRANSACTION level with InsufficientFundsForRent (the sweep
  event is still logged, but all state rolls back -- a ghost
  event), fails legacy sell with 2005 ConstraintRentExempt
  (caused by account: protocol_fee_recipient_token_account),
  yet the creator sweep against an identically underfunded ATA
  SUCCEEDS (+122,160, withheld 1,234). The rent gate is not
  uniform across handlers.

The builder asserts every expected value below per image before
writing. The packet's producer.py is this file.
"""
import base64
import copy
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
    base, f, lp, pool, poolraw, quote, supply, token, transferfee,
    userbase, userlp, userquote, vaultbase, vaultquote,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, volume

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-sweep-transfer-fee-neutrality-20261029"
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
PROTOCOL = Pubkey.from_bytes(bytes(RAW[57:89]))
POOLV2 = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)[0]
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
MX = 2**64 - 1
VQ0, PF0, CF0 = -125882, 2488, 123394
S_ASIS = 4194352106721
S_DEP9 = S_ASIS + 10**9
S_WD9 = S_ASIS - 10**9
RENT22 = 2157600
RENT165 = 2039280


def ata22(owner):
    return Pubkey.find_program_address([bytes(owner), bytes(TOKEN22), bytes(quote)], ATA_PROG)[0]


PROTO22 = ata22(PROTOCOL)
CREAT22 = ata22(CREATOR_VAULT)
BB22 = ata22(BB_OWNER)

DEP_KEYS = [pool, CONFIG_KEY, PAYER_KEY, base, quote, lp, userbase, userquote,
            userlp, vaultbase, vaultquote, TOKEN, TOKEN22, EVENT, PROGRAM]
SWP_KEYS_P = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, PROTOCOL, PROTO22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_C = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, CREATOR_VAULT, CREAT22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
LEG_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote, vaultbase, vaultquote,
            PROTOCOL, PROTO22, TOKEN, TOKEN22, Pubkey.default(), ATA_PROG, EVENT, PROGRAM,
            CREAT22, CREATOR_VAULT, feeconfig, FEES]
LEG_REM = [AccountMeta(POOLV2, False, False), AccountMeta(BB_OWNER, False, False),
           AccountMeta(BB22, False, True)]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTO22, CREAT22, BB22]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTO22, "creatorata": CREAT22, "bbata": BB22}
DEP_DISC = "78f83d531f8e6b90"
WD_DISC = "1609851aa02c47c0"
SWP_DISC = "82a42461e48287a5"
SELL_DISC = "3e2f370aa503dc2a"


def t22acct(owner, amount, withheld):
    data = bytearray(165)
    data[0:32] = bytes(quote)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) + struct.pack("<HHQ", 2, 8, withheld)


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
    vm.set_account(PROTOCOL, Account(10**9, b'', Pubkey.default()))
    vm.set_account(CREATOR_VAULT, Account(10**9, b'', Pubkey.default()))
    vm.set_account(POOLV2, Account(10**9, b'', Pubkey.default()))
    vm.set_account(BB_OWNER, Account(10**9, b'', Pubkey.default()))
    bps = 100 if variant in ("tf100", "uf-proto", "uf-creat") else 5000
    metas = [AccountMeta(k, False, False) for k in DEP_KEYS]
    transferfee(quote, bps, MX)(h, metas)
    vm.set_account(PROTO22, Account(RENT165 if variant == "uf-proto" else RENT22,
                                    t22acct(PROTOCOL, 0, 0), TOKEN22))
    vm.set_account(CREAT22, Account(RENT165 if variant == "uf-creat" else RENT22,
                                    t22acct(CREATOR_VAULT, 0, 0), TOKEN22))
    vm.set_account(BB22, Account(RENT22, t22acct(BB_OWNER, 0, 0), TOKEN22))
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


def tok_withheld(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    # t22acct-built ATAs are 182 bytes with withheld at 174; the
    # transferfee override converts mint/vault/user accounts to
    # 178 bytes with withheld at 170.
    if len(raw) >= 182:
        return struct.unpack_from("<Q", raw, 174)[0]
    if len(raw) >= 178:
        return struct.unpack_from("<Q", raw, 170)[0]
    return None


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
    if kind in ("swp", "swc"):
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "recipient": raw[112:144].hex(),
                "amount": u64(raw, 176), "bucket": raw[184]}
    if kind == "lsell":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_bps": u64(raw, 72),
                "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
                "proto_fee": u64(raw, 96), "quote": u64(raw, 104),
                "uout": u64(raw, 112)}
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
    elif kind == "swp":
        name, keys, data, rem = "sweep_protocol_fee", SWP_KEYS_P, disc("sweep_protocol_fee"), []
    elif kind == "swc":
        name, keys, data, rem = "sweep_creator_fee", SWP_KEYS_C, disc("sweep_creator_fee"), []
    elif kind == "lsell":
        name, keys, data, rem = "sell", LEG_KEYS, disc("sell") + struct.pack("<QQ", args[0], args[1] if len(args) > 1 else 0), LEG_REM
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


def E(dPAYER, deltas, pool_after, volume, event=None, events=1, error=None,
      rollback=False, site_fragment=None, log_fragment=None, absent=None, lam_after=None,
      wh=None):
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after),
            "volume": volume, "event": event, "events": events, "error": error,
            "rollback": rollback, "site_fragment": site_fragment,
            "log_fragment": log_fragment, "absent": absent or [],
            "lam_after": lam_after or {}, "wh": wh or {}}


def P(vq, pf, cf, sup=S_ASIS):
    return [vq, pf, cf, sup]


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


def DEP_EV(base_, quote_):
    return {"disc": DEP_DISC, "len": 264, "base": base_, "quote": quote_}


def WD_EV(base_, quote_):
    return {"disc": WD_DISC, "len": 264, "base": base_, "quote": quote_}


def LSELL_EV(curve, lp_fee, proto_fee, quote, uout):
    return {"disc": SELL_DISC, "len": 449, "curve": curve, "lp_bps": 2,
            "lp_fee": lp_fee, "proto_bps": 93, "proto_fee": proto_fee,
            "quote": quote, "uout": uout}


POOL_ASIS = P(VQ0, PF0, CF0)
# tf100 sweep steps (pre-created 22 ATAs: 5,000 each, no creation cost)
SWP_P = E(-5000, {"protoata": 2463, "vaultquote": -2488},
          P(-123394, 0, CF0), None, event=SWP_EV(2488, 0, PROTOCOL),
          wh={"protoata": 25})
SWP_C = E(-5000, {"creatorata": 122160, "vaultquote": -123394},
          P(-2488, PF0, 0), None, event=SWP_EV(123394, 1, CREATOR_VAULT),
          wh={"creatorata": 1234})
SWP_P5 = E(-5000, {"protoata": 1244, "vaultquote": -2488},
           P(-123394, 0, CF0), None, event=SWP_EV(2488, 0, PROTOCOL),
           wh={"protoata": 1244})
SWP_C5 = E(-5000, {"creatorata": 61697, "vaultquote": -123394},
           P(-2488, PF0, 0), None, event=SWP_EV(123394, 1, CREATOR_VAULT),
           wh={"creatorata": 61697})


def swp_after(pool_after, wh=None):
    e = copy.deepcopy(SWP_P)
    e["pool_after"] = list(pool_after)
    if wh is not None:
        e["wh"] = wh
    return e


def swc_after(pool_after, wh=None):
    e = copy.deepcopy(SWP_C)
    e["pool_after"] = list(pool_after)
    if wh is not None:
        e["wh"] = wh
    return e


D_DEP9_TF100 = {"userbase": -160619895224, "userquote": -29608495, "userlp": 10**9,
                "vaultbase": 160619895224, "vaultquote": 29312410}
D_WD9_TF100 = {"userbase": 160619895223, "userquote": 29019284, "userlp": -10**9,
               "vaultbase": -160619895223, "vaultquote": -29312409}
D_DEP9_TF5000 = {"userbase": -160619895224, "userquote": -58624820, "userlp": 10**9,
                 "vaultbase": 160619895224, "vaultquote": 29312410}
D_WD9_TF5000 = {"userbase": 160619895223, "userquote": 14656204, "userlp": -10**9,
                "vaultbase": -160619895223, "vaultquote": -29312409}
D_LSELL9_TF100 = {"userbase": -10**9, "userquote": 178409, "userlp": 0,
                  "vaultbase": 10**9, "vaultquote": -182458,
                  "protoata": 840, "creatorata": 542, "bbata": 840}
D_LSELL9_TF5000 = {"userbase": -10**9, "userquote": 90106, "userlp": 0,
                   "vaultbase": 10**9, "vaultquote": -182458,
                   "protoata": 424, "creatorata": 274, "bbata": 424}
EV_LSELL9 = LSELL_EV(182495, 37, 1698, 182458, 180212)

CASES = [
    # Family A -- tf anchors (no sweep)
    {"label": "a-dep-tf100", "variant": "tf100", "steps": [("dep", (10**9, MX, MX))],
     "expect": [E(-5000, D_DEP9_TF100, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410), wh={"vaultquote": 296085})]},
    {"label": "a-wd-tf100", "variant": "tf100", "steps": [("wd", (10**9, 0, 0))],
     "expect": [E(-5000, D_WD9_TF100, P(VQ0, PF0, CF0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409), wh={"userquote": 293125})]},
    {"label": "a-lsell-tf100", "variant": "tf100", "steps": [("lsell", (10**9,))],
     "expect": [E(-5000, D_LSELL9_TF100, POOL_ASIS, None, event=EV_LSELL9,
                  wh={"protoata": 9, "creatorata": 6, "bbata": 9})]},
    {"label": "a-dep-tf5000", "variant": "tf5000", "steps": [("dep", (10**9, MX, MX))],
     "expect": [E(-5000, D_DEP9_TF5000, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410), wh={"vaultquote": 29312410})]},
    {"label": "a-wd-tf5000", "variant": "tf5000", "steps": [("wd", (10**9, 0, 0))],
     "expect": [E(-5000, D_WD9_TF5000, P(VQ0, PF0, CF0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409), wh={"userquote": 14656205})]},
    {"label": "a-lsell-tf5000", "variant": "tf5000", "steps": [("lsell", (10**9,))],
     "expect": [E(-5000, D_LSELL9_TF5000, POOL_ASIS, None, event=EV_LSELL9,
                  wh={"protoata": 425, "creatorata": 274, "bbata": 425})]},
    # Family S -- sweep -> deposit tf100: legs identical to anchors
    {"label": "s-both-dep-tf100", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("dep", (10**9, MX, MX))],
     "expect": [SWP_P, swc_after(P(0, 0, 0), wh={"protoata": 25, "creatorata": 1234}),
                E(-5000, D_DEP9_TF100, P(0, 0, 0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410),
                  wh={"vaultquote": 296085, "protoata": 25, "creatorata": 1234})]},
    {"label": "s-proto-dep-tf100", "variant": "tf100",
     "steps": [("swp", ()), ("dep", (10**9, MX, MX))],
     "expect": [SWP_P,
                E(-5000, D_DEP9_TF100, P(-123394, 0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410),
                  wh={"vaultquote": 296085, "protoata": 25})]},
    {"label": "s-creator-dep-tf100", "variant": "tf100",
     "steps": [("swc", ()), ("dep", (10**9, MX, MX))],
     "expect": [SWP_C,
                E(-5000, D_DEP9_TF100, P(-2488, PF0, 0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410),
                  wh={"vaultquote": 296085, "creatorata": 1234})]},
    # Family W -- sweep -> withdraw tf100: legs identical to anchors
    {"label": "w-both-wd-tf100", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("wd", (10**9, 0, 0))],
     "expect": [SWP_P, swc_after(P(0, 0, 0), wh={"protoata": 25, "creatorata": 1234}),
                E(-5000, D_WD9_TF100, P(0, 0, 0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409),
                  wh={"userquote": 293125, "protoata": 25, "creatorata": 1234})]},
    {"label": "w-proto-wd-tf100", "variant": "tf100",
     "steps": [("swp", ()), ("wd", (10**9, 0, 0))],
     "expect": [SWP_P,
                E(-5000, D_WD9_TF100, P(-123394, 0, CF0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409),
                  wh={"userquote": 293125, "protoata": 25})]},
    {"label": "w-creator-wd-tf100", "variant": "tf100",
     "steps": [("swc", ()), ("wd", (10**9, 0, 0))],
     "expect": [SWP_C,
                E(-5000, D_WD9_TF100, P(-2488, PF0, 0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409),
                  wh={"userquote": 293125, "creatorata": 1234})]},
    # Family G -- sweep -> legacy sell: legs identical to anchors, withheld accumulates
    {"label": "g-both-lsell-tf100", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("lsell", (10**9,))],
     "expect": [SWP_P, swc_after(P(0, 0, 0), wh={"protoata": 25, "creatorata": 1234}),
                E(-5000, D_LSELL9_TF100, P(0, 0, 0), None, event=EV_LSELL9,
                  wh={"protoata": 34, "creatorata": 1240, "bbata": 9})]},
    {"label": "g-proto-lsell-tf100", "variant": "tf100",
     "steps": [("swp", ()), ("lsell", (10**9,))],
     "expect": [SWP_P,
                E(-5000, D_LSELL9_TF100, P(-123394, 0, CF0), None, event=EV_LSELL9,
                  wh={"protoata": 34, "creatorata": 6, "bbata": 9})]},
    {"label": "g-creator-lsell-tf100", "variant": "tf100",
     "steps": [("swc", ()), ("lsell", (10**9,))],
     "expect": [SWP_C,
                E(-5000, D_LSELL9_TF100, P(-2488, PF0, 0), None, event=EV_LSELL9,
                  wh={"protoata": 9, "creatorata": 1240, "bbata": 9})]},
    {"label": "g-both-lsell-tf5000", "variant": "tf5000",
     "steps": [("swp", ()), ("swc", ()), ("lsell", (10**9,))],
     "expect": [SWP_P5, E(-5000, {"creatorata": 61697, "vaultquote": -123394},
                          P(0, 0, 0), None, event=SWP_EV(123394, 1, CREATOR_VAULT),
                          wh={"protoata": 1244, "creatorata": 61697}),
                E(-5000, D_LSELL9_TF5000, P(0, 0, 0), None, event=EV_LSELL9,
                  wh={"protoata": 1669, "creatorata": 61971, "bbata": 425})]},
    # Family L -- limit gates post-sweep tf100 keep their sides
    {"label": "l-dep-maxquote-grossminus1", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("dep", (10**9, MX, 29608494))],
     "expect": [SWP_P, swc_after(P(0, 0, 0), wh={"protoata": 25, "creatorata": 1234}),
                E(-5000, {}, P(0, 0, 0), None, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage")]},
    {"label": "l-dep-maxquote-gross", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("dep", (10**9, MX, 29608495))],
     "expect": [SWP_P, swc_after(P(0, 0, 0), wh={"protoata": 25, "creatorata": 1234}),
                E(-5000, D_DEP9_TF100, P(0, 0, 0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410),
                  wh={"vaultquote": 296085, "protoata": 25, "creatorata": 1234})]},
    {"label": "l-wd-minquote-netplus1", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("wd", (10**9, 0, 29019285))],
     "expect": [SWP_P, swc_after(P(0, 0, 0), wh={"protoata": 25, "creatorata": 1234}),
                E(-5000, {}, P(0, 0, 0), None, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage")]},
    {"label": "l-wd-minquote-net", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("wd", (10**9, 0, 29019284))],
     "expect": [SWP_P, swc_after(P(0, 0, 0), wh={"protoata": 25, "creatorata": 1234}),
                E(-5000, D_WD9_TF100, P(0, 0, 0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409),
                  wh={"userquote": 293125, "protoata": 25, "creatorata": 1234})]},
    {"label": "l-lsell-minquote-gross", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("lsell", (10**9, 180212))],
     "expect": [SWP_P, swc_after(P(0, 0, 0), wh={"protoata": 25, "creatorata": 1234}),
                E(-5000, {}, P(0, 0, 0), None, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage")]},
    {"label": "l-lsell-minquote-net", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("lsell", (10**9, 178409))],
     "expect": [SWP_P, swc_after(P(0, 0, 0), wh={"protoata": 25, "creatorata": 1234}),
                E(-5000, D_LSELL9_TF100, P(0, 0, 0), None, event=EV_LSELL9,
                  wh={"protoata": 34, "creatorata": 1240, "bbata": 9})]},
    # Family R -- round trip dep -> sweeps -> wd tf100
    {"label": "r-dep-sweeps-wd-tf100", "variant": "tf100",
     "steps": [("dep", (10**9, MX, MX)), ("swp", ()), ("swc", ()), ("wd", (10**9, 0, 0))],
     "expect": [E(-5000, D_DEP9_TF100, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410), wh={"vaultquote": 296085}),
                E(-5000, {"protoata": 2463, "vaultquote": -2488},
                  P(-123394, 0, CF0, S_DEP9), None, event=SWP_EV(2488, 0, PROTOCOL),
                  wh={"protoata": 25, "vaultquote": 296085}),
                E(-5000, {"creatorata": 122160, "vaultquote": -123394},
                  P(0, 0, 0, S_DEP9), None, event=SWP_EV(123394, 1, CREATOR_VAULT),
                  wh={"protoata": 25, "creatorata": 1234, "vaultquote": 296085}),
                E(-5000, D_WD9_TF100, P(0, 0, 0), None,
                  event=WD_EV(160619895223, 29312409),
                  wh={"userquote": 293125, "protoata": 25, "creatorata": 1234,
                      "vaultquote": 296085})]},
    # Family U -- underfunded 22 ATA rent asymmetry (tf100)
    {"label": "u-swp-underfunded-proto", "variant": "uf-proto",
     "steps": [("swp", ())],
     "expect": [E(-5000, {}, POOL_ASIS, None, events=1,
                  error="InsufficientFundsForRent", rollback=True)]},
    {"label": "u-swc-underfunded-creat", "variant": "uf-creat",
     "steps": [("swc", ())],
     "expect": [E(-5000, {"creatorata": 122160, "vaultquote": -123394},
                  P(-2488, PF0, 0), None, event=SWP_EV(123394, 1, CREATOR_VAULT),
                  wh={"creatorata": 1234})]},
    {"label": "u-lsell-underfunded-proto", "variant": "uf-proto",
     "steps": [("lsell", (10**9,))],
     "expect": [E(-5000, {}, POOL_ASIS, None, events=0, error="2005",
                  rollback=True, site_fragment="protocol_fee_recipient_token_account")]},
]

STEP_KIND = {"dep": "dep", "wd": "wd", "swp": "swp", "swc": "swc", "lsell": "lsell"}


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
        if exp["events"] is not None:
            check(len(rec["events"]) == exp["events"],
                  f"{tag}: events {len(rec['events'])} != {exp['events']}")
        d_payer = lam_delta(rec, PAYER_KEY)
        check(d_payer == exp["dPAYER"], f"{tag}: dPAYER {d_payer} != {exp['dPAYER']}")
        for role, want in exp["deltas"].items():
            got_d = tok_delta(rec, ROLE_KEY[role])
            check(got_d == want, f"{tag}: delta {role} {got_d} != {want}")
        for role, want in exp["wh"].items():
            got = tok_withheld(rec["after"][str(ROLE_KEY[role])])
            check(got == want, f"{tag}: withheld {role} {got} != {want}")
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
