#!/usr/bin/env python3
"""Build research/amm-fee-tier-crossing-chains-20261029 receipts.

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
OUT = ROOT / "research/amm-fee-tier-crossing-chains-20261029"
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
T_UP = CAP0 + 3000000
T_DN = CAP0 - 300000
T_EXACT_BUY = 182355570222
T_EXACT_SELL = 182349613172
T_FAR = CAP0 + 10**12


def T2(threshold):
    return [(100, A_TIER), (threshold, B_TIER)]


CASES = [
    {"label": "a-buy-cross-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T2(T_UP)}, "steps": [
        ("buy", (10**10,), E(-1849400, {"userbase": 10**10, "userquote": -1907838,
         "vaultbase": -10**10, "vaultquote": 1897709, "bbata": 10129},
         P(-196783, 12617, 184166), VOL_CREATED, event=BUY_T(1824983, 10, 1825, 111, 20258, 1826808, 1907838))),
        ("buy", (10**10,), E(-5000, {"userbase": 10**10, "userquote": -1950236,
         "vaultbase": -10**10, "vaultquote": 1929978, "bbata": 20258},
         P(-298073, 32875, 265198), VOL_CREATED, event=BUY_T(1825037, 20, 3651, 222, 40516, 1828688, 1950236))),
        ("swc", (), E(-5000, {"vaultquote": -265198, "creatorata": 265198},
         P(-32875, 32875, 0), VOL_CREATED, event=SWP_EV(265198))),
        ("col", (), E(-5000, {"creatorata": -265198, "dest": 265198},
         P(-32875, 32875, 0), VOL_CREATED, event=COL_EV(265198), lam_deltas={})),
    ]},
    {"label": "a-buy-cross-exact-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T2(T_EXACT_BUY)}, "steps": [
        ("buy", (10**10,), E(-1849400, {"userbase": 10**10, "userquote": -1907838,
         "vaultbase": -10**10, "vaultquote": 1897709, "bbata": 10129},
         P(-196783, 12617, 184166), VOL_CREATED, event=BUY_T(1824983, 10, 1825, 111, 20258, 1826808, 1907838))),
        ("buy", (10**10,), E(-5000, {"userbase": 10**10, "userquote": -1950236,
         "vaultbase": -10**10, "vaultquote": 1929978, "bbata": 20258},
         P(-298073, 32875, 265198), VOL_CREATED, event=BUY_T(1825037, 20, 3651, 222, 40516, 1828688, 1950236))),
        ("swc", (), E(-5000, {"vaultquote": -265198, "creatorata": 265198},
         P(-32875, 32875, 0), VOL_CREATED, event=SWP_EV(265198))),
        ("col", (), E(-5000, {"creatorata": -265198, "dest": 265198},
         P(-32875, 32875, 0), VOL_CREATED, event=COL_EV(265198), lam_deltas={})),
    ]},
    {"label": "a-buy-nocross-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T2(T_FAR)}, "steps": [
        ("buy", (10**10,), E(-1849400, {"userbase": 10**10, "userquote": -1907838,
         "vaultbase": -10**10, "vaultquote": 1897709, "bbata": 10129},
         P(-196783, 12617, 184166), VOL_CREATED, event=BUY_T(1824983, 10, 1825, 111, 20258, 1826808, 1907838))),
        ("buy", (10**10,), E(-5000, {"userbase": 10**10, "userquote": -1907895,
         "vaultbase": -10**10, "vaultquote": 1897766, "bbata": 10129},
         P(-267686, 22746, 244940), VOL_CREATED, event=BUY_T(1825037, 10, 1826, 111, 20258, 1826863, 1907895))),
        ("swc", (), E(-5000, {"vaultquote": -244940, "creatorata": 244940},
         P(-22746, 22746, 0), VOL_CREATED, event=SWP_EV(244940))),
        ("col", (), E(-5000, {"creatorata": -244940, "dest": 244940},
         P(-22746, 22746, 0), VOL_CREATED, event=COL_EV(244940), lam_deltas={})),
    ]},
    {"label": "a-buy-cross-loop", "setup": {"vq": None, "bps": 0, "tiers": T2(T_UP)}, "steps": [
        ("buy", (10**10,), E(-1849400, {"userbase": 10**10, "userquote": -1907838,
         "vaultbase": -10**10, "vaultquote": 1897709, "bbata": 10129},
         P(-196783, 12617, 184166), VOL_CREATED, event=BUY_T(1824983, 10, 1825, 111, 20258, 1826808, 1907838))),
        ("buy", (10**10,), E(-5000, {"userbase": 10**10, "userquote": -1950236,
         "vaultbase": -10**10, "vaultquote": 1929978, "bbata": 20258},
         P(-298073, 32875, 265198), VOL_CREATED, event=BUY_T(1825037, 20, 3651, 222, 40516, 1828688, 1950236))),
        ("buy", (10**10,), E(-5000, {"userbase": 10**10, "userquote": -1950295,
         "vaultbase": -10**10, "vaultquote": 1930036, "bbata": 20259},
         P(-399367, 53134, 346233), VOL_CREATED, event=BUY_T(1825091, 20, 3651, 222, 40518, 1828742, 1950295))),
        ("swc", (), E(-5000, {"vaultquote": -346233, "creatorata": 346233},
         P(-53134, 53134, 0), VOL_CREATED, event=SWP_EV(346233))),
        ("col", (), E(-5000, {"creatorata": -346233, "dest": 346233},
         P(-53134, 53134, 0), VOL_CREATED, event=COL_EV(346233), lam_deltas={})),
    ]},
    {"label": "a-sell-cross-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T2(T_DN)}, "steps": [
        ("sell", (10**9,), E(-1849400, {"userbase": -10**9, "userquote": 169975,
         "vaultbase": 10**9, "vaultquote": -172001, "bbata": 2026},
         P(-136011, 4514, 131497), VOL_CREATED, event=SELL_T(182495, 20, 365, 222, 4052, 182130, 169975))),
        ("sell", (10**9,), E(-5000, {"userbase": -10**9, "userquote": 174207,
         "vaultbase": 10**9, "vaultquote": -175220, "bbata": 1013},
         P(-143102, 5527, 137575), VOL_CREATED, event=SELL_T(182494, 10, 183, 111, 2026, 182311, 174207))),
        ("swc", (), E(-5000, {"vaultquote": -137575, "creatorata": 137575},
         P(-5527, 5527, 0), VOL_CREATED, event=SWP_EV(137575))),
        ("col", (), E(-5000, {"creatorata": -137575, "dest": 137575},
         P(-5527, 5527, 0), VOL_CREATED, event=COL_EV(137575), lam_deltas={})),
    ]},
    {"label": "a-sell-cross-exact-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T2(T_EXACT_SELL)}, "steps": [
        ("sell", (10**9,), E(-1849400, {"userbase": -10**9, "userquote": 169975,
         "vaultbase": 10**9, "vaultquote": -172001, "bbata": 2026},
         P(-136011, 4514, 131497), VOL_CREATED, event=SELL_T(182495, 20, 365, 222, 4052, 182130, 169975))),
        ("sell", (10**9,), E(-5000, {"userbase": -10**9, "userquote": 169974,
         "vaultbase": 10**9, "vaultquote": -172000, "bbata": 2026},
         P(-146140, 6540, 139600), VOL_CREATED, event=SELL_T(182494, 20, 365, 222, 4052, 182129, 169974))),
        ("sell", (10**9,), E(-5000, {"userbase": -10**9, "userquote": 174207,
         "vaultbase": 10**9, "vaultquote": -175220, "bbata": 1013},
         P(-153231, 7553, 145678), VOL_CREATED, event=SELL_T(182494, 10, 183, 111, 2026, 182311, 174207))),
        ("swc", (), E(-5000, {"vaultquote": -145678, "creatorata": 145678},
         P(-7553, 7553, 0), VOL_CREATED, event=SWP_EV(145678))),
        ("col", (), E(-5000, {"creatorata": -145678, "dest": 145678},
         P(-7553, 7553, 0), VOL_CREATED, event=COL_EV(145678), lam_deltas={})),
    ]},
    {"label": "a-buy-sell-back-cross", "setup": {"vq": None, "bps": 0, "tiers": T2(T_UP)}, "steps": [
        ("buy", (10**10,), E(-1849400, {"userbase": 10**10, "userquote": -1907838,
         "vaultbase": -10**10, "vaultquote": 1897709, "bbata": 10129},
         P(-196783, 12617, 184166), VOL_CREATED, event=BUY_T(1824983, 10, 1825, 111, 20258, 1826808, 1907838))),
        ("buy", (10**10,), E(-5000, {"userbase": 10**10, "userquote": -1950236,
         "vaultbase": -10**10, "vaultquote": 1929978, "bbata": 20258},
         P(-298073, 32875, 265198), VOL_CREATED, event=BUY_T(1825037, 20, 3651, 222, 40516, 1828688, 1950236))),
        ("sell", (10**10,), E(-5000, {"userbase": -10**10, "userquote": 1699837,
         "vaultbase": 10**10, "vaultquote": -1720095, "bbata": 20258},
         P(-399363, 53133, 346230), VOL_CREATED, event=SELL_T(1825036, 20, 3651, 222, 40516, 1821385, 1699837))),
        ("sell", (10**10,), E(-5000, {"userbase": -10**10, "userquote": 1699787,
         "vaultbase": 10**10, "vaultquote": -1720044, "bbata": 20257},
         P(-500651, 73391, 427260), VOL_CREATED, event=SELL_T(1824982, 20, 3650, 222, 40515, 1821332, 1699787))),
        ("sell", (10**10,), E(-5000, {"userbase": -10**10, "userquote": 1742075,
         "vaultbase": 10**10, "vaultquote": -1752203, "bbata": 10128},
         P(-571551, 83520, 488031), VOL_CREATED, event=SELL_T(1824928, 10, 1825, 111, 20257, 1823103, 1742075))),
        ("swc", (), E(-5000, {"vaultquote": -488031, "creatorata": 488031},
         P(-83520, 83520, 0), VOL_CREATED, event=SWP_EV(488031))),
        ("col", (), E(-5000, {"creatorata": -488031, "dest": 488031},
         P(-83520, 83520, 0), VOL_CREATED, event=COL_EV(488031), lam_deltas={})),
    ]},
    {"label": "a-buyx-cross-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T2(T_UP)}, "steps": [
        ("buyx", (10**7, 1), E(-1849400, {"userbase": 52412084027, "userquote": -10**7,
         "vaultbase": -52412084027, "vaultquote": 9946910, "bbata": 53090},
         P(-497511, 55578, 441933), VOL_CREATED, event=BUYX_T(52412084027, 10**7, 10, 9566, 111, 106180, 9575281, 9565715))),
        ("buyx", (10**7, 1), E(-5000, {"userbase": 51266288076, "userquote": -10**7,
         "vaultbase": -51266288076, "vaultquote": 9896126, "bbata": 103874},
         P(-1016883, 159453, 857430), VOL_CREATED, event=BUYX_T(51266288076, 10**7, 20, 18717, 222, 207749, 9376754, 9358037))),
        ("swc", (), E(-5000, {"vaultquote": -857430, "creatorata": 857430},
         P(-159453, 159453, 0), VOL_CREATED, event=SWP_EV(857430))),
        ("col", (), E(-5000, {"creatorata": -857430, "dest": 857430},
         P(-159453, 159453, 0), VOL_CREATED, event=COL_EV(857430), lam_deltas={})),
    ]},
    {"label": "a-buyx-cross-loop", "setup": {"vq": None, "bps": 0, "tiers": T2(T_UP)}, "steps": [
        ("buyx", (10**7, 1), E(-1849400, {"userbase": 52412084027, "userquote": -10**7,
         "vaultbase": -52412084027, "vaultquote": 9946910, "bbata": 53090},
         P(-497511, 55578, 441933), VOL_CREATED, event=BUYX_T(52412084027, 10**7, 10, 9566, 111, 106180, 9575281, 9565715))),
        ("buyx", (10**7, 1), E(-5000, {"userbase": 51266288076, "userquote": -10**7,
         "vaultbase": -51266288076, "vaultquote": 9896126, "bbata": 103874},
         P(-1016883, 159453, 857430), VOL_CREATED, event=BUYX_T(51266288076, 10**7, 20, 18717, 222, 207749, 9376754, 9358037))),
        ("buyx", (10**7, 1), E(-5000, {"userbase": 51258477837, "userquote": -10**7,
         "vaultbase": -51258477837, "vaultquote": 9896126, "bbata": 103874},
         P(-1536255, 263328, 1272927), VOL_CREATED, event=BUYX_T(51258477837, 10**7, 20, 18717, 222, 207749, 9376754, 9358037))),
        ("swc", (), E(-5000, {"vaultquote": -1272927, "creatorata": 1272927},
         P(-263328, 263328, 0), VOL_CREATED, event=SWP_EV(1272927))),
        ("col", (), E(-5000, {"creatorata": -1272927, "dest": 1272927},
         P(-263328, 263328, 0), VOL_CREATED, event=COL_EV(1272927), lam_deltas={})),
    ]},
    {"label": "b-override-cross-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T2(T_UP), "creator_bps": 500}, "steps": [
        ("buy", (10**10,), E(-1849400, {"userbase": 10**10, "userquote": -1938316,
         "vaultbase": -10**10, "vaultquote": 1928187, "bbata": 10129},
         P(-227261, 12617, 214644), VOL_CREATED, event=BUY_T(1824983, 10, 1825, 111, 20258, 1826808, 1938316))),
        ("buy", (10**10,), E(-5000, {"userbase": 10**10, "userquote": -1960456,
         "vaultbase": -10**10, "vaultquote": 1940198, "bbata": 20258},
         P(-338771, 32875, 305896), VOL_CREATED, event=BUY_T(1825037, 20, 3651, 222, 40516, 1828688, 1960456))),
        ("swc", (), E(-5000, {"vaultquote": -305896, "creatorata": 305896},
         P(-32875, 32875, 0), VOL_CREATED, event=SWP_EV(305896))),
        ("col", (), E(-5000, {"creatorata": -305896, "dest": 305896},
         P(-32875, 32875, 0), VOL_CREATED, event=COL_EV(305896), lam_deltas={})),
    ]},
    {"label": "b-override-sell-cross", "setup": {"vq": None, "bps": 0, "tiers": T2(T_DN), "creator_bps": 500}, "steps": [
        ("sell", (10**9,), E(-1849400, {"userbase": -10**9, "userquote": 168953,
         "vaultbase": 10**9, "vaultquote": -170979, "bbata": 2026},
         P(-137033, 4514, 132519), VOL_CREATED, event=SELL_T(182495, 20, 365, 222, 4052, 182130, 168953))),
        ("sell", (10**9,), E(-5000, {"userbase": -10**9, "userquote": 171160,
         "vaultbase": 10**9, "vaultquote": -172173, "bbata": 1013},
         P(-147171, 5527, 141644), VOL_CREATED, event=SELL_T(182494, 10, 183, 111, 2026, 182311, 171160))),
        ("swc", (), E(-5000, {"vaultquote": -141644, "creatorata": 141644},
         P(-5527, 5527, 0), VOL_CREATED, event=SWP_EV(141644))),
        ("col", (), E(-5000, {"creatorata": -141644, "dest": 141644},
         P(-5527, 5527, 0), VOL_CREATED, event=COL_EV(141644), lam_deltas={})),
    ]},
    {"label": "c-mayhem-top-tier-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T2(T_UP), "mayhem": True}, "steps": [
        ("buy", (10**10,), E(-1849400, {"userbase": 10**10, "userquote": -1950178,
         "vaultbase": -10**10, "vaultquote": 1950178},
         P(-247427, 43003, 204424), VOL_CREATED, event=BUY_T(1824983, 20, 3650, 222, 40515, 1828633, 1950178))),
        ("buy", (10**10,), E(-5000, {"userbase": 10**10, "userquote": -1950236,
         "vaultbase": -10**10, "vaultquote": 1950236},
         P(-368975, 83519, 285456), VOL_CREATED, event=BUY_T(1825037, 20, 3651, 222, 40516, 1828688, 1950236))),
        ("swc", (), E(-5000, {"vaultquote": -285456, "creatorata": 285456},
         P(-83519, 83519, 0), VOL_CREATED, event=SWP_EV(285456))),
        ("col", (), E(-5000, {"creatorata": -285456, "dest": 285456},
         P(-83519, 83519, 0), VOL_CREATED, event=COL_EV(285456), lam_deltas={})),
    ]},
    {"label": "c-mayhem-sell-top-tier", "setup": {"vq": None, "bps": 0, "tiers": T2(T_UP), "mayhem": True}, "steps": [
        ("sell", (10**9,), E(-1849400, {"userbase": -10**9, "userquote": 169975,
         "vaultbase": 10**9, "vaultquote": -169975},
         P(-138037, 6540, 131497), VOL_CREATED, event=SELL_T(182495, 20, 365, 222, 4052, 182130, 169975))),
        ("sell", (10**9,), E(-5000, {"userbase": -10**9, "userquote": 169974,
         "vaultbase": 10**9, "vaultquote": -169974},
         P(-150192, 10592, 139600), VOL_CREATED, event=SELL_T(182494, 20, 365, 222, 4052, 182129, 169974))),
        ("swc", (), E(-5000, {"vaultquote": -139600, "creatorata": 139600},
         P(-10592, 10592, 0), VOL_CREATED, event=SWP_EV(139600))),
        ("col", (), E(-5000, {"creatorata": -139600, "dest": 139600},
         P(-10592, 10592, 0), VOL_CREATED, event=COL_EV(139600), lam_deltas={})),
    ]},
    {"label": "d-tf-cross-swc-col", "setup": {"vq": None, "bps": 100, "tiers": T2(T_UP)}, "steps": [
        ("buy", (10**10,), E(-1849400, {"userbase": 10**10, "userquote": -1927007,
         "vaultbase": -10**10, "vaultquote": 1897709, "bbata": 10027},
         P(-196783, 12617, 184166), VOL_CREATED, event=BUY_T(1824983, 10, 1825, 111, 20258, 1826808, 1907838),
         wh_after={"vaultquote": 19169, "bbata": 102},
         lam_deltas={"userquote": -1927007, "vaultquote": 1916878, "bbata": 10129})),
        ("buy", (10**10,), E(-5000, {"userbase": 10**10, "userquote": -1969731,
         "vaultbase": -10**10, "vaultquote": 1929978, "bbata": 20055},
         P(-298073, 32875, 265198), VOL_CREATED, event=BUY_T(1825037, 20, 3651, 222, 40516, 1828688, 1950236),
         wh_after={"vaultquote": 38664, "bbata": 305},
         lam_deltas={"userquote": -1969731, "vaultquote": 1949473, "bbata": 20258})),
        ("swc", (), E(-5000, {"vaultquote": -265198, "creatorata": 262546},
         P(-32875, 32875, 0), VOL_CREATED, event=SWP_EV(265198),
         wh_after={"creatorata": 2652},
         lam_deltas={"vaultquote": -265198, "creatorata": 265198})),
        ("col", (), E(-5000, {"creatorata": -262546, "dest": 259920},
         P(-32875, 32875, 0), VOL_CREATED, event=COL_EV(262546),
         wh_after={"creatorata": 2652, "dest": 2626}, lam_deltas={})),
    ]},
    {"label": "d-tf-sell-cross", "setup": {"vq": None, "bps": 100, "tiers": T2(T_DN)}, "steps": [
        ("sell", (10**9,), E(-1849400, {"userbase": -10**9, "userquote": 168275,
         "vaultbase": 10**9, "vaultquote": -172001, "bbata": 2005},
         P(-136011, 4514, 131497), VOL_CREATED, event=SELL_T(182495, 20, 365, 222, 4052, 182130, 169975),
         wh_after={"bbata": 21},
         lam_deltas={"userquote": 169975, "vaultquote": -172001, "bbata": 2026})),
        ("sell", (10**9,), E(-5000, {"userbase": -10**9, "userquote": 172464,
         "vaultbase": 10**9, "vaultquote": -175220, "bbata": 1002},
         P(-143102, 5527, 137575), VOL_CREATED, event=SELL_T(182494, 10, 183, 111, 2026, 182311, 174207),
         wh_after={"bbata": 32},
         lam_deltas={"userquote": 174207, "vaultquote": -175220, "bbata": 1013})),
        ("swc", (), E(-5000, {"vaultquote": -137575, "creatorata": 136199},
         P(-5527, 5527, 0), VOL_CREATED, event=SWP_EV(137575),
         wh_after={"creatorata": 1376},
         lam_deltas={"vaultquote": -137575, "creatorata": 137575})),
        ("col", (), E(-5000, {"creatorata": -136199, "dest": 134837},
         P(-5527, 5527, 0), VOL_CREATED, event=COL_EV(136199),
         wh_after={"creatorata": 1376, "dest": 1362}, lam_deltas={})),
    ]},
    {"label": "d-tf-buyx-cross", "setup": {"vq": None, "bps": 100, "tiers": T2(T_UP)}, "steps": [
        ("buyx", (10**7, 1), E(-1849400, {"userbase": 51888004321, "userquote": -9999470,
         "vaultbase": -51888004321, "vaultquote": 9847441, "bbata": 52033},
         P(-493794, 55047, 438747), VOL_CREATED, event=BUYX_T(51888004321, 10**7, 10, 9471, 111, 105118, 9479529, 9470058),
         wh_after={"vaultquote": 99470, "bbata": 526},
         lam_deltas={"userquote": -9999470, "vaultquote": 9946911, "bbata": 52559})),
        ("buyx", (10**7, 1), E(-5000, {"userbase": 50753750277, "userquote": -9998962,
         "vaultbase": -50753750277, "vaultquote": 9797165, "bbata": 101806},
         P(-1007972, 157883, 850089), VOL_CREATED, event=BUYX_T(50753750277, 10**7, 20, 18529, 222, 205671, 9282987, 9264458),
         wh_after={"vaultquote": 198432, "bbata": 1555},
         lam_deltas={"userquote": -9998962, "vaultquote": 9896127, "bbata": 102835})),
        ("swc", (), E(-5000, {"vaultquote": -850089, "creatorata": 841588},
         P(-157883, 157883, 0), VOL_CREATED, event=SWP_EV(850089),
         wh_after={"creatorata": 8501},
         lam_deltas={"vaultquote": -850089, "creatorata": 850089})),
        ("col", (), E(-5000, {"creatorata": -841588, "dest": 833172},
         P(-157883, 157883, 0), VOL_CREATED, event=COL_EV(841588),
         wh_after={"creatorata": 8501, "dest": 8416}, lam_deltas={})),
    ]},
    {"label": "e-sweep-mid-buy-stays-B", "setup": {"vq": None, "bps": 0, "tiers": T2(T_UP)}, "steps": [
        ("buy", (10**10,), E(-1849400, {"userbase": 10**10, "userquote": -1907838,
         "vaultbase": -10**10, "vaultquote": 1897709, "bbata": 10129},
         P(-196783, 12617, 184166), VOL_CREATED, event=BUY_T(1824983, 10, 1825, 111, 20258, 1826808, 1907838))),
        ("buy", (10**10,), E(-5000, {"userbase": 10**10, "userquote": -1950236,
         "vaultbase": -10**10, "vaultquote": 1929978, "bbata": 20258},
         P(-298073, 32875, 265198), VOL_CREATED, event=BUY_T(1825037, 20, 3651, 222, 40516, 1828688, 1950236))),
        ("swc", (), E(-5000, {"vaultquote": -265198, "creatorata": 265198},
         P(-32875, 32875, 0), VOL_CREATED, event=SWP_EV(265198))),
        ("buy", (10**10,), E(-5000, {"userbase": 10**10, "userquote": -1950295,
         "vaultbase": -10**10, "vaultquote": 1930036, "bbata": 20259},
         P(-134169, 53134, 81035), VOL_CREATED, event=BUY_T(1825091, 20, 3651, 222, 40518, 1828742, 1950295))),
        ("col", (), E(-5000, {"creatorata": -265198, "dest": 265198},
         P(-134169, 53134, 81035), VOL_CREATED, event=COL_EV(265198), lam_deltas={})),
    ]},
    {"label": "e-sell-nocross-swc-col", "setup": {"vq": None, "bps": 0, "tiers": T2(T_FAR)}, "steps": [
        ("sell", (10**9,), E(-1849400, {"userbase": -10**9, "userquote": 174208,
         "vaultbase": 10**9, "vaultquote": -175221, "bbata": 1013},
         P(-132973, 3501, 129472), VOL_CREATED, event=SELL_T(182495, 10, 183, 111, 2026, 182312, 174208))),
        ("sell", (10**9,), E(-5000, {"userbase": -10**9, "userquote": 174207,
         "vaultbase": 10**9, "vaultquote": -175220, "bbata": 1013},
         P(-140064, 4514, 135550), VOL_CREATED, event=SELL_T(182494, 10, 183, 111, 2026, 182311, 174207))),
        ("swc", (), E(-5000, {"vaultquote": -135550, "creatorata": 135550},
         P(-4514, 4514, 0), VOL_CREATED, event=SWP_EV(135550))),
        ("col", (), E(-5000, {"creatorata": -135550, "dest": 135550},
         P(-4514, 4514, 0), VOL_CREATED, event=COL_EV(135550), lam_deltas={})),
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
