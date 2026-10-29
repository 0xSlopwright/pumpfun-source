#!/usr/bin/env python3
"""Build research/amm-fee-tier-double-crossing-chains-20261029 receipts.

3rd run packet #35: v2 fee-tier selection CROSSING inside one VM
sequence, chained into sweep/collect.

The gap: 2nd #8 measured fee-table priority, 2nd #29 measured the
tier boundary in isolation (fresh VM per case: cap exactly on a
threshold selects that tier, cap floors, mayhem substitutes 10^15
for the supply) -- but nobody chained the crossing: a trade moves
the reserves, so the market cap supply*q/b moves with it, and the
NEXT trade in the same sequence can pay a different tier. The
bucket then mixes creator fees from two tiers, and sweep/collect
must drain exactly that mixed bucket.

Sharp results (all three images agree on every step):
- Buy crossing up: with tiers A=(10,111,333) below threshold
  T=cap0+3,000,000 and B=(20,222,444) at/above T, buy1 (cap
  182,350,153,971) pays A (spend 1,907,838) and buy2 (cap
  182,355,570,222) pays B (spend 1,950,236); sweep/collect drain
  the mixed bucket 265,198 exactly.
- Exact-threshold inclusivity inside a chain: with T set exactly
  to the post-buy1 cap (182,355,570,222), buy2 still pays B
  (>=), and with T set exactly to the post-sell1 cap
  (182,349,613,172), sell2 still pays B and only sell3 pays A.
- Sell crossing down: with T=cap0-300,000, sell1 pays B
  (receipt 169,975) and sell2 pays A (receipt 174,207).
- Round trip: buy A, buy B, sell B, sell B, sell A -- the third
  10^10 sell drops the cap back below T and pays A again
  (receipt 1,742,075); the mixed bucket 488,031 sweeps/collects
  exactly.
- Creator-fee override masks the tier creator leg: with pool
  creator_fee_bps=500, buy1/buy2 still cross (lp/proto legs
  change, creator leg stays 500bps) and the bucket is 305,896;
  sell crossing under the override gives bucket 141,644.
- Mayhem pins the top tier for the whole chain: mayhem buy1/buy2
  both pay B with buyback 0 (spends 1,950,178 / 1,950,236,
  bucket 285,456); mayhem sell1/sell2 both pay B (bucket
  139,600).
- Crossing survives transfer fee and the exact path: tf100
  buy crossing (spends 1,927,007 / 1,969,731 gross, sweep net
  262,546, collect net 259,920), tf100 sell crossing (receipts
  168,275 / 172,464 net, bucket net 136,199/134,837), tf100
  exact crossing (outs 51,888,004,321 / 50,753,750,277, bucket
  net 841,588/833,172).
- Sweep does not reset the tier: buy A, buy B, sweep, buy B
  again (spend 1,950,295) -- the sweep relabels cf into vq 1:1,
  so the cap (and the tier) is unchanged by the sweep, and the
  later collect drains only the swept 265,198 while the new
  accrual 81,035 stays in the pool.
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
    base, f, lp, pool, poolraw, quote, supply, token, transferfee,
    userbase, userlp, userquote, vaultbase, vaultquote,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, volume

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-fee-tier-double-crossing-chains-20261029"
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
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
BOOST, _ = Pubkey.find_program_address([b'boost_vault', bytes(pool)], PROGRAM)
POOLV2 = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)[0]
GVOL = Pubkey.find_program_address([b'global_volume_accumulator'], PROGRAM)[0]
GDISC = bytes(next(x for x in IDL['accounts'] if x['name'] == 'GlobalVolumeAccumulator')['discriminator'])
MX = 2**64 - 1
S_ASIS = 4194352106721
S_DEP9 = S_ASIS + 10**9
S_WD9 = S_ASIS - 10**9
RENT22 = 2157600


def ata22(owner):
    return Pubkey.find_program_address([bytes(owner), bytes(TOKEN22), bytes(quote)], ATA_PROG)[0]


def vault_of(creator):
    return Pubkey.find_program_address([b'creator_vault', bytes(creator)], PROGRAM)[0]


CREAT_VAULT = vault_of(CREATOR)
PROTOCOL = Pubkey.from_bytes(bytes(RAW[57:89]))
PROTO22 = ata22(PROTOCOL)
CREAT22 = ata22(CREAT_VAULT)
DEST22 = ata22(CREATOR)
BB22 = ata22(BB_OWNER)
BOOST_ATA22 = ata22(BOOST)

TRD_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
            buyback, EVENT, PROGRAM]
DEP_KEYS = [pool, CONFIG_KEY, PAYER_KEY, base, quote, lp, userbase, userquote,
            userlp, vaultbase, vaultquote, TOKEN, TOKEN22, EVENT, PROGRAM]
BST_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, vaultbase, vaultquote,
            BOOST, BOOST_ATA22, TOKEN, TOKEN, EVENT, PROGRAM]
SWC_KEYS = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, CREAT_VAULT, CREAT22,
            Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
COL_KEYS = [quote, TOKEN22, CREATOR, CREAT_VAULT, CREAT22, DEST22, EVENT, PROGRAM]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTO22, CREAT22, DEST22, BB22, BOOST, BOOST_ATA22, CREAT_VAULT]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTO22, "creatorata": CREAT22, "dest": DEST22, "bbata": BB22,
            "boostata": BOOST_ATA22}
SWP_DISC = "82a42461e48287a5"
COL_DISC = "e8f5c2eeeada3a59"
BUY_DISC = "67f4521f2cf57777"
SELL_DISC = "3e2f370aa503dc2a"
DEP_DISC = "78f83d531f8e6b90"
WD_DISC = "1609851aa02c47c0"
BST_DISC = "3f451c16305cc2b9"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def t22acct(owner, amount, withheld=0):
    data = bytearray(165)
    data[0:32] = bytes(quote)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) + struct.pack("<HHQ", 2, 8, withheld)


def setup_vm(binary, setup):
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
    glob[907:939] = bytes(PAYER_KEY)
    glob[939] = 1
    vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
    for n, row in f["accounts"].items():
        vm.set_account(Pubkey.from_string(row["address"]),
                       Account(row["lamports"], base64.b64decode(row["data_base64"]),
                               Pubkey.from_string(row["owner"])))
    pd = bytearray(poolraw)
    if setup.get("vq") is not None:
        pd[245:261] = setup["vq"].to_bytes(16, "little", signed=True)
    if setup.get("mayhem"):
        pd[243] = 1
    vm.set_account(pool, Account(f["accounts"]["pool"]["lamports"], bytes(pd), PROGRAM))
    mint = struct.pack("<I", 1) + bytes(pool) + struct.pack("<Q", supply) + bytes([9, 1]) + bytes(36)
    vm.set_account(lp, Account(10**9, mint, TOKEN22))
    vm.set_account(userbase, Account(10**9, token(base, PAYER_KEY, 10**15, False), TOKEN))
    vm.set_account(userquote, Account(10**15 + 2039280, token(quote, PAYER_KEY, 10**15, True), TOKEN))
    vm.set_account(userlp, Account(10**9, token(lp, PAYER_KEY, supply // 2, False), TOKEN22))
    vm.set_account(volume, Account(0, b"", Pubkey.default()))
    vm.set_account(GVOL, Account(10**9, GDISC + struct.pack('<qqq', 0, 0, 86400) + bytes(base) + bytes(480), PROGRAM))
    vm.set_account(BOOST, Account(10**9, b"", Pubkey.default()))
    vm.set_account(CREAT_VAULT, Account(10**9, b"", Pubkey.default()))
    vm.set_account(PROTO22, Account(RENT22, t22acct(PROTOCOL, 0), TOKEN22))
    vm.set_account(CREAT22, Account(RENT22, t22acct(CREAT_VAULT, 0), TOKEN22))
    vm.set_account(DEST22, Account(RENT22, t22acct(CREATOR, 0), TOKEN22))
    vm.set_account(BB22, Account(RENT22, t22acct(BB_OWNER, 0), TOKEN22))
    transferfee(quote, setup.get("bps", 0), MX)(h, [])
    # Boost vault ATA in the Token-2022 world: 178-byte account.
    a = vm.get_account(BOOST_ATA22)
    if a is None:
        # derive from the TOKEN boost ATA data pattern used by the boost harness
        raw = token(quote, BOOST, 10**12, True)
        d = bytes(raw[:165]) + bytes([2]) + struct.pack('<HHQ', 2, 8, 0)
        vm.set_account(BOOST_ATA22, Account(10**12 + 10**9, d, TOKEN22))
    else:
        d = bytes(a.data[:165]) + bytes([2]) + struct.pack('<HHQ', 2, 8, 0)
        vm.set_account(BOOST_ATA22, Account(10**12 + 10**9, d, TOKEN22))
    if setup.get("tiers") is not None:
        a = vm.get_account(feeconfig)
        raw = bytes(a.data[:41]) + struct.pack("<QQQ", 25, 5, 0) + struct.pack("<I", len(setup["tiers"]))
        for t, fs in setup["tiers"]:
            raw += t.to_bytes(16, "little") + struct.pack("<QQQ", *fs)
        raw += struct.pack("<I", 0) + bytes(24)
        vm.set_account(feeconfig, Account(a.lamports, raw.ljust(4097, b"\0"), a.owner))
    if setup.get("creator_bps") is not None:
        a = vm.get_account(pool)
        d = bytearray(a.data); d[261:269] = struct.pack("<Q", setup["creator_bps"])
        vm.set_account(pool, Account(a.lamports, bytes(d), a.owner))
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


def ev_list(logs):
    out = []
    for l in logs:
        if l.startswith("Program data: "):
            out.append(base64.b64decode(l.split("Program data: ", 1)[1].strip()))
    return out


def u64(raw, off):
    return struct.unpack_from("<Q", raw, off)[0]


def decode_event(kind, raw):
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
    if kind == "buyx":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "out": u64(raw, 16), "quote_in": u64(raw, 64),
                "lp_bps": u64(raw, 72), "lp_fee": u64(raw, 80),
                "proto_bps": u64(raw, 88), "proto_fee": u64(raw, 96),
                "qwlp": u64(raw, 104), "uin": u64(raw, 112)}
    if kind == "swc":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "recipient": raw[112:144].hex(),
                "amount": u64(raw, 176), "bucket": raw[184]}
    if kind == "col":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "creator": raw[16:48].hex(), "fee": u64(raw, 48),
                "vault_ata": raw[56:88].hex(), "dest": raw[88:120].hex()}
    if kind == "boost":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "requested": u64(raw, 144), "used": u64(raw, 152),
                "burned": u64(raw, 160),
                "vq": int.from_bytes(raw[168:184], "little", signed=True),
                "quote_after": u64(raw, 184), "base_after": u64(raw, 192),
                "remaining": u64(raw, 200)}
    return None


def check(cond, msg):
    if not cond:
        raise AssertionError(msg)


def disc(name):
    return bytes(next(x for x in IDL["instructions"] if x["name"] == name)["discriminator"])


def do_step(h, kind, args):
    if kind == "dep":
        name, keys, data = "deposit", DEP_KEYS, disc("deposit") + struct.pack("<QQQ", *args)
        metas_extra = {}
    elif kind == "wd":
        name, keys, data = "withdraw", DEP_KEYS, disc("withdraw") + struct.pack("<QQQ", *args)
        metas_extra = {}
    elif kind == "buy":
        name, keys, data = "buy_v2", TRD_KEYS, disc("buy_v2") + struct.pack("<QQ", args[0], MX)
        metas_extra = {}
    elif kind == "sell":
        name, keys, data = "sell_v2", TRD_KEYS, disc("sell_v2") + struct.pack("<QQ", args[0], 0)
        metas_extra = {}
    elif kind == "buyx":
        name, keys, data = "buy_exact_quote_in_v2", TRD_KEYS, disc("buy_exact_quote_in_v2") + struct.pack("<QQ", *args)
        metas_extra = {}
    elif kind in ("boost", "boostw"):
        name, keys, data = "boost_buy_and_burn", BST_KEYS, disc("boost_buy_and_burn") + struct.pack("<QQ", *args)
        metas_extra = {"writable_mint": kind == "boostw"}
    elif kind == "swc":
        name, keys, data = "sweep_creator_fee", SWC_KEYS, disc("sweep_creator_fee")
        metas_extra = {}
    elif kind == "col":
        name, keys, data = "collect_coin_creator_fee", COL_KEYS, disc("collect_coin_creator_fee")
        metas_extra = {}
    else:
        raise ValueError(kind)
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    if kind in ("buy", "sell", "buyx"):
        metas[10] = AccountMeta(TOKEN22, False, False)
        metas[14] = AccountMeta(BB22, False, True)
    if kind in ("boost", "boostw"):
        metas[8] = AccountMeta(BOOST_ATA22, False, True)
        metas[10] = AccountMeta(TOKEN22, False, False)
        if metas_extra.get("writable_mint"):
            metas[4] = AccountMeta(quote, False, True)
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
      rollback=False, wh_after=None, lam_deltas=None, boost_event=None,
      ata_none=False):
    if lam_deltas is None:
        lam_deltas = {k: v for k, v in deltas.items()
                      if k not in ("userbase", "vaultbase", "userlp")}
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after),
            "volume": volume, "event": event, "events": events, "error": error,
            "rollback": rollback, "wh_after": wh_after or {},
            "lam_deltas": lam_deltas, "boost_event": boost_event,
            "ata_none": ata_none}


def P(vq, pf, cf, sup=S_ASIS):
    return [vq, pf, cf, sup]


def SWP_EV(amount, bucket=1):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(CREAT_VAULT).hex(), "amount": amount, "bucket": bucket}


def COL_EV(fee):
    return {"disc": COL_DISC, "len": 120, "timestamp": 1234567890,
            "creator": bytes(CREATOR).hex(), "fee": fee,
            "vault_ata": bytes(CREAT22).hex(), "dest": bytes(DEST22).hex()}


def BUY_EV(curve, lp_fee, proto_fee, qwlp, uin):
    return {"disc": BUY_DISC, "len": 500, "curve": curve, "lp_bps": 2,
            "lp_fee": lp_fee, "proto_bps": 93, "proto_fee": proto_fee,
            "qwlp": qwlp, "uin": uin}


def SELL_EV(curve, lp_fee, proto_fee, quote, uout):
    return {"disc": SELL_DISC, "len": 449, "curve": curve, "lp_bps": 2,
            "lp_fee": lp_fee, "proto_bps": 93, "proto_fee": proto_fee,
            "quote": quote, "uout": uout}


def BUYX_EV(out, lp_fee, proto_fee, qwlp, uin):
    return {"disc": BUY_DISC, "len": 515, "out": out, "quote_in": 10**7,
            "lp_bps": 2, "lp_fee": lp_fee, "proto_bps": 93, "proto_fee": proto_fee,
            "qwlp": qwlp, "uin": uin}


def BST_EV(used, burned, vq, quote_after, base_after, remaining, requested=None):
    return {"disc": BST_DISC, "len": 208,
            "requested": used if requested is None else requested, "used": used,
            "burned": burned, "vq": vq, "quote_after": quote_after,
            "base_after": base_after, "remaining": remaining}


def DEP_EV(base, quote):
    return {"disc": DEP_DISC, "len": 264, "base": base, "quote": quote}


def WD_EV(base, quote):
    return {"disc": WD_DISC, "len": 264, "base": base, "quote": quote}


def FAIL(pool_after, volume, code, events=0):
    return E(-5000, {}, pool_after, volume, events=events, error=code, rollback=True)


VOL_NONE = None
VOL_CREATED = {"lamports": 1844400, "len": 137, "user": bytes(PAYER_KEY).hex()}
P0 = P(10**9, 2488, 123394)
P_FRESH = P(-125882, 2488, 123394)
P_BUY = P(999985697, 11182, 129003)
P_SELL = P(999998569, 3358, 123955)
P_BUYX = P(999924444, 48414, 153024)
P_SWEPT_BUY = P(1000114700, 11182, 0)
P_SWEPT_SELL = P(1000122524, 3358, 0)
P_SWEPT_BUYX = P(1000077468, 48414, 0)
P_ANCHOR_BUY = P(999985924, 11044, 128914)
P_BUY2 = P(999971619, 19739, 134524)
P_BOOST2_BUY = P(999985466, 11322, 129094)
P_BOOST_BUY2 = P(999971392, 19877, 134613)
P_DEP = P(1000238445, 2488, 123394, S_DEP9)
P_DEP_BUY = P(1000224142, 11182, 129003, S_DEP9)
P_DEP_SWEPT = P(1000353145, 11182, 0, S_DEP9)
P_WD = P(999761554, 2488, 123394, S_WD9)
P_WD_SELL = P(999760123, 3358, 123955, S_WD9)
P_WD_SWEPT = P(999884078, 3358, 0, S_WD9)
P_DEPWD = P(999999999, 2488, 123394)
P_DEPWD_BUY = P(999985696, 11182, 129003)
P_SWEPT_SEED = P(1000123394, 2488, 0)
P_MAYHEM_BUY = P(999977003, 19876, 129003)
P_MAYHEM_SWEPT = P(1000106006, 19876, 0)

def BUY_T(curve, lp_bps, lp_fee, proto_bps, proto_fee, qwlp, uin):
    return {"disc": BUY_DISC, "len": 500, "curve": curve, "lp_bps": lp_bps,
            "lp_fee": lp_fee, "proto_bps": proto_bps, "proto_fee": proto_fee,
            "qwlp": qwlp, "uin": uin}


def SELL_T(curve, lp_bps, lp_fee, proto_bps, proto_fee, quote, uout):
    return {"disc": SELL_DISC, "len": 449, "curve": curve, "lp_bps": lp_bps,
            "lp_fee": lp_fee, "proto_bps": proto_bps, "proto_fee": proto_fee,
            "quote": quote, "uout": uout}


def BUYX_T(out, quote_in, lp_bps, lp_fee, proto_bps, proto_fee, qwlp, uin):
    return {"disc": BUY_DISC, "len": 515, "out": out, "quote_in": quote_in,
            "lp_bps": lp_bps, "lp_fee": lp_fee, "proto_bps": proto_bps,
            "proto_fee": proto_fee, "qwlp": qwlp, "uin": uin}


VOL_NONE = None
VOL_CREATED = {"lamports": 1844400, "len": 137, "user": bytes(PAYER_KEY).hex()}
CAP0 = 182350153971
A_TIER = (10, 111, 333)
B_TIER = (20, 222, 444)
C_TIER = (30, 333, 555)
T1U = CAP0 + 3000000
T2U = CAP0 + 10000000
T1D = CAP0 - 10500000
T2D = CAP0 - 300000
T2X = 182360989422
T1XS = 182339341145
T2BX = CAP0 + 30000000
T_FAR1 = CAP0 + 10**12
T_FAR2 = CAP0 + 2 * 10**12


def T3(t1, t2):
    return [(100, A_TIER), (t1, B_TIER), (t2, C_TIER)]


CASES = [
    {"label": "a-buy-double-cross-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T3(T1U, T2U)}, "steps": [
        ("buy", (10000000000,), E(-1849400, {"userbase": 10000000000, "userquote": -1907838, "vaultbase": -10000000000, "vaultquote": 1897709, "bbata": 10129}, P(-196783, 12617, 184166, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1824983, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20258, "qwlp": 1826808, "uin": 1907838})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1950236, "vaultbase": -10000000000, "vaultquote": 1929978, "bbata": 20258}, P(-298073, 32875, 265198, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825037, "lp_bps": 20, "lp_fee": 3651, "proto_bps": 222, "proto_fee": 40516, "qwlp": 1828688, "uin": 1950236})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1992636, "vaultbase": -10000000000, "vaultquote": 1962248, "bbata": 30388}, P(-429754, 63263, 366491, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825091, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60776, "qwlp": 1830567, "uin": 1992636})),
        ("swc", (), E(-5000, {"vaultquote": -366491, "creatorata": 366491}, P(-63263, 63263, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 366491, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -366491, "dest": 366491}, P(-63263, 63263, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 366491, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "a-buy-double-cross-exact-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T3(T1U, T2X)}, "steps": [
        ("buy", (10000000000,), E(-1849400, {"userbase": 10000000000, "userquote": -1907838, "vaultbase": -10000000000, "vaultquote": 1897709, "bbata": 10129}, P(-196783, 12617, 184166, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1824983, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20258, "qwlp": 1826808, "uin": 1907838})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1950236, "vaultbase": -10000000000, "vaultquote": 1929978, "bbata": 20258}, P(-298073, 32875, 265198, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825037, "lp_bps": 20, "lp_fee": 3651, "proto_bps": 222, "proto_fee": 40516, "qwlp": 1828688, "uin": 1950236})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1992636, "vaultbase": -10000000000, "vaultquote": 1962248, "bbata": 30388}, P(-429754, 63263, 366491, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825091, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60776, "qwlp": 1830567, "uin": 1992636})),
        ("swc", (), E(-5000, {"vaultquote": -366491, "creatorata": 366491}, P(-63263, 63263, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 366491, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -366491, "dest": 366491}, P(-63263, 63263, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 366491, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "a-buy-double-cross-loop", "setup": {"vq": None, "bps": 0, "tiers": T3(T1U, T2U)}, "steps": [
        ("buy", (10000000000,), E(-1849400, {"userbase": 10000000000, "userquote": -1907838, "vaultbase": -10000000000, "vaultquote": 1897709, "bbata": 10129}, P(-196783, 12617, 184166, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1824983, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20258, "qwlp": 1826808, "uin": 1907838})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1950236, "vaultbase": -10000000000, "vaultquote": 1929978, "bbata": 20258}, P(-298073, 32875, 265198, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825037, "lp_bps": 20, "lp_fee": 3651, "proto_bps": 222, "proto_fee": 40516, "qwlp": 1828688, "uin": 1950236})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1992636, "vaultbase": -10000000000, "vaultquote": 1962248, "bbata": 30388}, P(-429754, 63263, 366491, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825091, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60776, "qwlp": 1830567, "uin": 1992636})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1992695, "vaultbase": -10000000000, "vaultquote": 1962306, "bbata": 30389}, P(-561439, 93652, 467787, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825145, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60778, "qwlp": 1830621, "uin": 1992695})),
        ("swc", (), E(-5000, {"vaultquote": -467787, "creatorata": 467787}, P(-93652, 93652, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 467787, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -467787, "dest": 467787}, P(-93652, 93652, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 467787, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "a-sell-double-cross-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T3(T1D, T2D)}, "steps": [
        ("sell", (10000000000,), E(-1849400, {"userbase": -10000000000, "userquote": 1657397, "vaultbase": 10000000000, "vaultquote": -1687782, "bbata": 30385}, P(-257552, 32874, 224678, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824927, "lp_bps": 30, "lp_fee": 5475, "proto_bps": 333, "proto_fee": 60771, "quote": 1819452, "uout": 1657397})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1699685, "vaultbase": 10000000000, "vaultquote": -1719941, "bbata": 20256}, P(-358834, 53131, 305703, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824873, "lp_bps": 20, "lp_fee": 3650, "proto_bps": 222, "proto_fee": 40513, "quote": 1821223, "uout": 1699685})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1741971, "vaultbase": 10000000000, "vaultquote": -1752099, "bbata": 10128}, P(-429729, 63259, 366470, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824819, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20256, "quote": 1822994, "uout": 1741971})),
        ("swc", (), E(-5000, {"vaultquote": -366470, "creatorata": 366470}, P(-63259, 63259, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 366470, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -366470, "dest": 366470}, P(-63259, 63259, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 366470, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "a-sell-double-cross-exact-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T3(T1XS, T2D)}, "steps": [
        ("sell", (10000000000,), E(-1849400, {"userbase": -10000000000, "userquote": 1657397, "vaultbase": 10000000000, "vaultquote": -1687782, "bbata": 30385}, P(-257552, 32874, 224678, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824927, "lp_bps": 30, "lp_fee": 5475, "proto_bps": 333, "proto_fee": 60771, "quote": 1819452, "uout": 1657397})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1699685, "vaultbase": 10000000000, "vaultquote": -1719941, "bbata": 20256}, P(-358834, 53131, 305703, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824873, "lp_bps": 20, "lp_fee": 3650, "proto_bps": 222, "proto_fee": 40513, "quote": 1821223, "uout": 1699685})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1699636, "vaultbase": 10000000000, "vaultquote": -1719891, "bbata": 20255}, P(-460112, 73387, 386725, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824819, "lp_bps": 20, "lp_fee": 3650, "proto_bps": 222, "proto_fee": 40511, "quote": 1821169, "uout": 1699636})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1741920, "vaultbase": 10000000000, "vaultquote": -1752047, "bbata": 10127}, P(-531005, 83515, 447490, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824765, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20255, "quote": 1822940, "uout": 1741920})),
        ("swc", (), E(-5000, {"vaultquote": -447490, "creatorata": 447490}, P(-83515, 83515, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 447490, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -447490, "dest": 447490}, P(-83515, 83515, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 447490, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "a-buy-sell-full-round-trip", "setup": {"vq": None, "bps": 0, "tiers": T3(T1U, T2U)}, "steps": [
        ("buy", (10000000000,), E(-1849400, {"userbase": 10000000000, "userquote": -1907838, "vaultbase": -10000000000, "vaultquote": 1897709, "bbata": 10129}, P(-196783, 12617, 184166, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1824983, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20258, "qwlp": 1826808, "uin": 1907838})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1950236, "vaultbase": -10000000000, "vaultquote": 1929978, "bbata": 20258}, P(-298073, 32875, 265198, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825037, "lp_bps": 20, "lp_fee": 3651, "proto_bps": 222, "proto_fee": 40516, "qwlp": 1828688, "uin": 1950236})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1992636, "vaultbase": -10000000000, "vaultquote": 1962248, "bbata": 30388}, P(-429754, 63263, 366491, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825091, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60776, "qwlp": 1830567, "uin": 1992636})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1657545, "vaultbase": 10000000000, "vaultquote": -1687933, "bbata": 30388}, P(-561435, 93651, 467784, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1825090, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60776, "quote": 1819614, "uout": 1657545})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1657496, "vaultbase": 10000000000, "vaultquote": -1687883, "bbata": 30387}, P(-693112, 124038, 569074, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1825036, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60774, "quote": 1819560, "uout": 1657496})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1699787, "vaultbase": 10000000000, "vaultquote": -1720044, "bbata": 20257}, P(-794400, 144296, 650104, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824982, "lp_bps": 20, "lp_fee": 3650, "proto_bps": 222, "proto_fee": 40515, "quote": 1821332, "uout": 1699787})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1742075, "vaultbase": 10000000000, "vaultquote": -1752203, "bbata": 10128}, P(-865300, 154425, 710875, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824928, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20257, "quote": 1823103, "uout": 1742075})),
        ("swc", (), E(-5000, {"vaultquote": -710875, "creatorata": 710875}, P(-154425, 154425, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 710875, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -710875, "dest": 710875}, P(-154425, 154425, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 710875, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "a-buyx-double-cross-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T3(T1U, T2BX)}, "steps": [
        ("buyx", (10000000, 1), E(-1849400, {"userbase": 52412084027, "userquote": -10000000, "vaultbase": -52412084027, "vaultquote": 9946910, "bbata": 53090}, P(-497511, 55578, 441933, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 515, "out": 52412084027, "quote_in": 10000000, "lp_bps": 10, "lp_fee": 9566, "proto_bps": 111, "proto_fee": 106180, "qwlp": 9575281, "uin": 9565715})),
        ("buyx", (10000000, 1), E(-5000, {"userbase": 51266288076, "userquote": -10000000, "vaultbase": -51266288076, "vaultquote": 9896126, "bbata": 103874}, P(-1016883, 159453, 857430, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 515, "out": 51266288076, "quote_in": 10000000, "lp_bps": 20, "lp_fee": 18717, "proto_bps": 222, "proto_fee": 207749, "qwlp": 9376754, "uin": 9358037})),
        ("buyx", (10000000, 1), E(-5000, {"userbase": 50169356101, "userquote": -10000000, "vaultbase": -50169356101, "vaultquote": 9847500, "bbata": 152500}, P(-1677719, 311954, 1365765, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 515, "out": 50169356101, "quote_in": 10000000, "lp_bps": 30, "lp_fee": 27478, "proto_bps": 333, "proto_fee": 305001, "qwlp": 9186664, "uin": 9159186})),
        ("swc", (), E(-5000, {"vaultquote": -1365765, "creatorata": 1365765}, P(-311954, 311954, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 1365765, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -1365765, "dest": 1365765}, P(-311954, 311954, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 1365765, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "b-override-buy-double-cross", "setup": {"vq": None, "bps": 0, "tiers": T3(T1U, T2U), "creator_bps": 500}, "steps": [
        ("buy", (10000000000,), E(-1849400, {"userbase": 10000000000, "userquote": -1938316, "vaultbase": -10000000000, "vaultquote": 1928187, "bbata": 10129}, P(-227261, 12617, 214644, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1824983, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20258, "qwlp": 1826808, "uin": 1938316})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1960456, "vaultbase": -10000000000, "vaultquote": 1940198, "bbata": 20258}, P(-338771, 32875, 305896, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825037, "lp_bps": 20, "lp_fee": 3651, "proto_bps": 222, "proto_fee": 40516, "qwlp": 1828688, "uin": 1960456})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1982598, "vaultbase": -10000000000, "vaultquote": 1952210, "bbata": 30388}, P(-460414, 63263, 397151, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825091, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60776, "qwlp": 1830567, "uin": 1982598})),
        ("swc", (), E(-5000, {"vaultquote": -397151, "creatorata": 397151}, P(-63263, 63263, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 397151, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -397151, "dest": 397151}, P(-63263, 63263, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 397151, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "b-override-sell-double-cross", "setup": {"vq": None, "bps": 0, "tiers": T3(T1D, T2D), "creator_bps": 500}, "steps": [
        ("sell", (10000000000,), E(-1849400, {"userbase": -10000000000, "userquote": 1667434, "vaultbase": 10000000000, "vaultquote": -1697819, "bbata": 30385}, P(-247515, 32874, 214641, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824927, "lp_bps": 30, "lp_fee": 5475, "proto_bps": 333, "proto_fee": 60771, "quote": 1819452, "uout": 1667434})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1689466, "vaultbase": 10000000000, "vaultquote": -1709722, "bbata": 20256}, P(-359016, 53131, 305885, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824873, "lp_bps": 20, "lp_fee": 3650, "proto_bps": 222, "proto_fee": 40513, "quote": 1821223, "uout": 1689466})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1711497, "vaultbase": 10000000000, "vaultquote": -1721625, "bbata": 10128}, P(-460385, 63259, 397126, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824819, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20256, "quote": 1822994, "uout": 1711497})),
        ("swc", (), E(-5000, {"vaultquote": -397126, "creatorata": 397126}, P(-63259, 63259, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 397126, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -397126, "dest": 397126}, P(-63259, 63259, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 397126, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "c-mayhem-top-tier", "setup": {"vq": None, "bps": 0, "tiers": T3(T1U, T2U), "mayhem": True}, "steps": [
        ("buy", (10000000000,), E(-1849400, {"userbase": 10000000000, "userquote": -1992517, "vaultbase": -10000000000, "vaultquote": 1992517}, P(-287941, 63260, 224681, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1824983, "lp_bps": 30, "lp_fee": 5475, "proto_bps": 333, "proto_fee": 60772, "qwlp": 1830458, "uin": 1992517})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1992577, "vaultbase": -10000000000, "vaultquote": 1992577}, P(-450005, 124034, 325971, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825037, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60774, "qwlp": 1830513, "uin": 1992577})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1992636, "vaultbase": -10000000000, "vaultquote": 1992636}, P(-612074, 184810, 427264, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825091, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60776, "qwlp": 1830567, "uin": 1992636})),
        ("swc", (), E(-5000, {"vaultquote": -427264, "creatorata": 427264}, P(-184810, 184810, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 427264, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -427264, "dest": 427264}, P(-184810, 184810, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 427264, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "c-mayhem-sell-top-tier", "setup": {"vq": None, "bps": 0, "tiers": T3(T1U, T2U), "mayhem": True}, "steps": [
        ("sell", (10000000000,), E(-1849400, {"userbase": -10000000000, "userquote": 1657397, "vaultbase": 10000000000, "vaultquote": -1657397}, P(-287937, 63259, 224678, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824927, "lp_bps": 30, "lp_fee": 5475, "proto_bps": 333, "proto_fee": 60771, "quote": 1819452, "uout": 1657397})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1657348, "vaultbase": 10000000000, "vaultquote": -1657348}, P(-449987, 124028, 325959, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824873, "lp_bps": 30, "lp_fee": 5475, "proto_bps": 333, "proto_fee": 60769, "quote": 1819398, "uout": 1657348})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1657299, "vaultbase": 10000000000, "vaultquote": -1657299}, P(-612032, 184795, 427237, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824819, "lp_bps": 30, "lp_fee": 5475, "proto_bps": 333, "proto_fee": 60767, "quote": 1819344, "uout": 1657299})),
        ("swc", (), E(-5000, {"vaultquote": -427237, "creatorata": 427237}, P(-184795, 184795, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 427237, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -427237, "dest": 427237}, P(-184795, 184795, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 427237, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "d-tf-buy-double-cross", "setup": {"vq": None, "bps": 100, "tiers": T3(T1U, T2U)}, "steps": [
        ("buy", (10000000000,), E(-1849400, {"userbase": 10000000000, "userquote": -1927007, "vaultbase": -10000000000, "vaultquote": 1897709, "bbata": 10027}, P(-196783, 12617, 184166, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1824983, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20258, "qwlp": 1826808, "uin": 1907838}, wh_after={"vaultquote": 19169, "bbata": 102}, lam_deltas={"userquote": -1927007, "vaultquote": 1916878, "bbata": 10129})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1969731, "vaultbase": -10000000000, "vaultquote": 1929978, "bbata": 20055}, P(-298073, 32875, 265198, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825037, "lp_bps": 20, "lp_fee": 3651, "proto_bps": 222, "proto_fee": 40516, "qwlp": 1828688, "uin": 1950236}, wh_after={"vaultquote": 38664, "bbata": 305}, lam_deltas={"userquote": -1969731, "vaultquote": 1949473, "bbata": 20258})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -2012457, "vaultbase": -10000000000, "vaultquote": 1962248, "bbata": 30084}, P(-429754, 63263, 366491, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825091, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60776, "qwlp": 1830567, "uin": 1992636}, wh_after={"vaultquote": 58485, "bbata": 609}, lam_deltas={"userquote": -2012457, "vaultquote": 1982069, "bbata": 30388})),
        ("swc", (), E(-5000, {"vaultquote": -366491, "creatorata": 362826}, P(-63263, 63263, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 366491, "bucket": 1}, wh_after={"vaultquote": 58485, "bbata": 609, "creatorata": 3665}, lam_deltas={"vaultquote": -366491, "creatorata": 366491})),
        ("col", (), E(-5000, {"creatorata": -362826, "dest": 359197}, P(-63263, 63263, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 362826, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "d-tf-sell-double-cross", "setup": {"vq": None, "bps": 100, "tiers": T3(T1D, T2D)}, "steps": [
        ("sell", (10000000000,), E(-1849400, {"userbase": -10000000000, "userquote": 1640823, "vaultbase": 10000000000, "vaultquote": -1687782, "bbata": 30081}, P(-257552, 32874, 224678, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824927, "lp_bps": 30, "lp_fee": 5475, "proto_bps": 333, "proto_fee": 60771, "quote": 1819452, "uout": 1657397}, wh_after={"bbata": 304}, lam_deltas={"userquote": 1657397, "vaultquote": -1687782, "bbata": 30385})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1682688, "vaultbase": 10000000000, "vaultquote": -1719941, "bbata": 20053}, P(-358834, 53131, 305703, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824873, "lp_bps": 20, "lp_fee": 3650, "proto_bps": 222, "proto_fee": 40513, "quote": 1821223, "uout": 1699685}, wh_after={"bbata": 507}, lam_deltas={"userquote": 1699685, "vaultquote": -1719941, "bbata": 20256})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1724551, "vaultbase": 10000000000, "vaultquote": -1752099, "bbata": 10026}, P(-429729, 63259, 366470, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824819, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20256, "quote": 1822994, "uout": 1741971}, wh_after={"bbata": 609}, lam_deltas={"userquote": 1741971, "vaultquote": -1752099, "bbata": 10128})),
        ("swc", (), E(-5000, {"vaultquote": -366470, "creatorata": 362805}, P(-63259, 63259, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 366470, "bucket": 1}, wh_after={"bbata": 609, "creatorata": 3665}, lam_deltas={"vaultquote": -366470, "creatorata": 366470})),
        ("col", (), E(-5000, {"creatorata": -362805, "dest": 359176}, P(-63259, 63259, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 362805, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "d-tf-buyx-double-cross", "setup": {"vq": None, "bps": 100, "tiers": T3(T1U, T2BX)}, "steps": [
        ("buyx", (10000000, 1), E(-1849400, {"userbase": 51888004321, "userquote": -9999470, "vaultbase": -51888004321, "vaultquote": 9847441, "bbata": 52033}, P(-493794, 55047, 438747, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 515, "out": 51888004321, "quote_in": 10000000, "lp_bps": 10, "lp_fee": 9471, "proto_bps": 111, "proto_fee": 105118, "qwlp": 9479529, "uin": 9470058}, wh_after={"vaultquote": 99470, "bbata": 526}, lam_deltas={"userquote": -9999470, "vaultquote": 9946911, "bbata": 52559})),
        ("buyx", (10000000, 1), E(-5000, {"userbase": 50753750277, "userquote": -9998962, "vaultbase": -50753750277, "vaultquote": 9797165, "bbata": 101806}, P(-1007972, 157883, 850089, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 515, "out": 50753750277, "quote_in": 10000000, "lp_bps": 20, "lp_fee": 18529, "proto_bps": 222, "proto_fee": 205671, "qwlp": 9282987, "uin": 9264458}, wh_after={"vaultquote": 198432, "bbata": 1555}, lam_deltas={"userquote": -9998962, "vaultquote": 9896127, "bbata": 102835})),
        ("buyx", (10000000, 1), E(-5000, {"userbase": 49667851691, "userquote": -9998475, "vaultbase": -49667851691, "vaultquote": 9749025, "bbata": 149465}, P(-1662200, 308859, 1353341, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 515, "out": 49667851691, "quote_in": 10000000, "lp_bps": 30, "lp_fee": 27203, "proto_bps": 333, "proto_fee": 301951, "qwlp": 9094797, "uin": 9067594}, wh_after={"vaultquote": 296907, "bbata": 3065}, lam_deltas={"userquote": -9998475, "vaultquote": 9847500, "bbata": 150975})),
        ("swc", (), E(-5000, {"vaultquote": -1353341, "creatorata": 1339807}, P(-308859, 308859, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 1353341, "bucket": 1}, wh_after={"vaultquote": 296907, "bbata": 3065, "creatorata": 13534}, lam_deltas={"vaultquote": -1353341, "creatorata": 1353341})),
        ("col", (), E(-5000, {"creatorata": -1339807, "dest": 1326408}, P(-308859, 308859, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 1339807, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "e-sweep-mid-stays-C", "setup": {"vq": None, "bps": 0, "tiers": T3(T1U, T2U)}, "steps": [
        ("buy", (10000000000,), E(-1849400, {"userbase": 10000000000, "userquote": -1907838, "vaultbase": -10000000000, "vaultquote": 1897709, "bbata": 10129}, P(-196783, 12617, 184166, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1824983, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20258, "qwlp": 1826808, "uin": 1907838})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1950236, "vaultbase": -10000000000, "vaultquote": 1929978, "bbata": 20258}, P(-298073, 32875, 265198, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825037, "lp_bps": 20, "lp_fee": 3651, "proto_bps": 222, "proto_fee": 40516, "qwlp": 1828688, "uin": 1950236})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1992636, "vaultbase": -10000000000, "vaultquote": 1962248, "bbata": 30388}, P(-429754, 63263, 366491, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825091, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60776, "qwlp": 1830567, "uin": 1992636})),
        ("swc", (), E(-5000, {"vaultquote": -366491, "creatorata": 366491}, P(-63263, 63263, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 366491, "bucket": 1})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1992695, "vaultbase": -10000000000, "vaultquote": 1962306, "bbata": 30389}, P(-194948, 93652, 101296, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825145, "lp_bps": 30, "lp_fee": 5476, "proto_bps": 333, "proto_fee": 60778, "qwlp": 1830621, "uin": 1992695})),
        ("col", (), E(-5000, {"creatorata": -366491, "dest": 366491}, P(-194948, 93652, 101296, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 366491, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "e-buy-nocross", "setup": {"vq": None, "bps": 0, "tiers": T3(T_FAR1, T_FAR2)}, "steps": [
        ("buy", (10000000000,), E(-1849400, {"userbase": 10000000000, "userquote": -1907838, "vaultbase": -10000000000, "vaultquote": 1897709, "bbata": 10129}, P(-196783, 12617, 184166, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1824983, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20258, "qwlp": 1826808, "uin": 1907838})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1907895, "vaultbase": -10000000000, "vaultquote": 1897766, "bbata": 10129}, P(-267686, 22746, 244940, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825037, "lp_bps": 10, "lp_fee": 1826, "proto_bps": 111, "proto_fee": 20258, "qwlp": 1826863, "uin": 1907895})),
        ("buy", (10000000000,), E(-5000, {"userbase": 10000000000, "userquote": -1907952, "vaultbase": -10000000000, "vaultquote": 1897823, "bbata": 10129}, P(-338592, 32876, 305716, 4194352106721), VOL_CREATED, event={"disc": "67f4521f2cf57777", "len": 500, "curve": 1825091, "lp_bps": 10, "lp_fee": 1826, "proto_bps": 111, "proto_fee": 20259, "qwlp": 1826917, "uin": 1907952})),
        ("swc", (), E(-5000, {"vaultquote": -305716, "creatorata": 305716}, P(-32876, 32876, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 305716, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -305716, "dest": 305716}, P(-32876, 32876, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 305716, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
    {"label": "e-sell-nocross", "setup": {"vq": None, "bps": 0, "tiers": T3(T_FAR1, T_FAR2)}, "steps": [
        ("sell", (10000000000,), E(-1849400, {"userbase": -10000000000, "userquote": 1742074, "vaultbase": 10000000000, "vaultquote": -1752202, "bbata": 10128}, P(-196782, 12617, 184165, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824927, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20257, "quote": 1823102, "uout": 1742074})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1742022, "vaultbase": 10000000000, "vaultquote": -1752150, "bbata": 10128}, P(-267680, 22746, 244934, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824873, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20257, "quote": 1823048, "uout": 1742022})),
        ("sell", (10000000000,), E(-5000, {"userbase": -10000000000, "userquote": 1741971, "vaultbase": 10000000000, "vaultquote": -1752099, "bbata": 10128}, P(-338575, 32874, 305701, 4194352106721), VOL_CREATED, event={"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824819, "lp_bps": 10, "lp_fee": 1825, "proto_bps": 111, "proto_fee": 20256, "quote": 1822994, "uout": 1741971})),
        ("swc", (), E(-5000, {"vaultquote": -305701, "creatorata": 305701}, P(-32874, 32874, 0, 4194352106721), VOL_CREATED, event={"disc": "82a42461e48287a5", "len": 185, "timestamp": 1234567890, "recipient": "318133f36894131b95112673435f729234e7b96e1b217e685594eb883dcf34dd", "amount": 305701, "bucket": 1})),
        ("col", (), E(-5000, {"creatorata": -305701, "dest": 305701}, P(-32874, 32874, 0, 4194352106721), VOL_CREATED, event={"disc": "e8f5c2eeeada3a59", "len": 120, "timestamp": 1234567890, "creator": "4052257bce28a510753a2426213a620a1c1b2a6cc2586e616e76e874212e1bae", "fee": 305701, "vault_ata": "f45038d386b6b4dfb1f3302293c6a3afff53e012aa95859d156a7701d0afdd4a", "dest": "bfe73ef7edb7c482a5a91e392da7c2db4e766136c6d063f6fab07faa20d479dd"}, lam_deltas={})),
    ]},
]


def run_case(case, image_name, binary):
    h = setup_vm(binary, case["setup"])
    out = []
    for kind, args, exp in case["steps"]:
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
        for role, want in exp["lam_deltas"].items():
            got_d = lam_delta(rec, ROLE_KEY[role])
            check(got_d == want, f"{tag}: lam_delta {role} {got_d} != {want}")
        for role, want in exp["wh_after"].items():
            got_e = rec["after"][str(ROLE_KEY[role])]
            got_w = tok_withheld(got_e)
            check(got_w == want, f"{tag}: wh_after {role} {got_w} != {want}")
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
        if exp.get("ata_none"):
            check(rec["after"][str(BOOST_ATA22)] is None, f"{tag}: boost ATA not closed")
        raws = ev_list(rec["logs"])
        if exp.get("boost_event") is not None:
            check(len(raws) == 2, f"{tag}: boost events {len(raws)} != 2")
            buy_raw, bst_raw = raws
            check(buy_raw[:8].hex() == BUY_DISC and len(buy_raw) == 512,
                  f"{tag}: boost BuyEvent {buy_raw[:8].hex()}/{len(buy_raw)}")
            got = decode_event("boost", bst_raw)
            for fkey, want in exp["boost_event"].items():
                check(got.get(fkey) == want, f"{tag}: boost event {fkey} {got.get(fkey)} != {want}")
        elif exp.get("event") is not None:
            check(len(raws) == 1, f"{tag}: event raws {len(raws)} != 1")
            got = decode_event(kind, raws[0])
            check(got is not None, f"{tag}: event decode failed")
            for fkey, want in exp["event"].items():
                check(got.get(fkey) == want, f"{tag}: event {fkey} {got.get(fkey)} != {want}")
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
        for image_name in ("original", "control", "candidate"):
            for rec in per_image[image_name]:
                receipts.append(rec)
        report_cases.append({"label": case["label"],
                             "setup": {k: (str(v) if not isinstance(v, list) else [str(x) for x in v]) for k, v in case["setup"].items()},
                             "steps": [e for _, _, e in case["steps"]],
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
