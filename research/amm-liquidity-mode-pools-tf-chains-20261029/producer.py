#!/usr/bin/env python3
"""Build research/amm-liquidity-mode-pools-tf-chains-20261029 receipts.

3rd run packet #23: deposit/withdraw on cashback and mayhem pools
UNDER A TRANSFER FEE, chained into sweep -> collect (and, for
cashback legacy trades, into claim).

The gap: 3rd #22 chained liquidity on mode-flagged pools into
sweep/collect with NO fee, and 3rd #19 chained plain-pool
liquidity under tf into sweep/collect. Nobody combined the two:
on a mode-flagged pool under tf, does the deposit still gross
up exactly like a plain pool, does the tf withheld stack stay
isolated per hop, does the protocol sweep still split by mode,
and do the mayhem buyback-zero trades still gross up on the
full spend (not the split legs) once a tf deposit precedes
them? This packet answers all four, plus the cashback legacy
pipes under a tf deposit, the both-flags v2 gate, the mayhem
legacy-sell gate, and the dep/wd limit gates on a mode pool.

Sharp results (all three images agree on every step):
- Mode-blind tf liquidity: dep-1e9 and wd-1e9 on cashback,
  mayhem, and both-flags pools settle with the plain-pool tf
  legs byte-for-byte (dep gross 29,608,495 / net 29,312,410,
  vault withheld 296,085; wd gross 29,312,409 / net
  29,019,284, user withheld 293,125), accrue nothing, and
  the following creator sweep still moves exactly the
  123,394 seed, drained by collect to 120,938. A dep->wd
  round trip under tf leaves the seed intact (base 1 +
  quote gross 1 round-trip loss, as on plain pools).
- tf5000 on a cashback pool: dep gross 58,624,820, vault
  withheld 29,312,410; sweep nets 61,697, collect nets
  30,848 -- the 50% fee halves each hop exactly.
- Protocol sweep still splits by mode under tf: on a
  cashback pool it succeeds (gross 2,488, net 2,463,
  withheld 25) and the following collect is a silent no-op;
  on a mayhem pool it fails 6013 InvalidProtocolFeeRecipient
  (swap/mod.rs:164) with full rollback, yet the creator
  sweep after it still drains the seed.
- v2 gates survive tf liquidity: dep->buy_v2, wd->sell_v2 on
  a cashback pool, and dep->buy_v2 on a both-flags pool, all
  fail 6079 CashbackCoinNotSupported (trade_v2.rs:103) with
  full rollback; the following sweep/collect still drain
  the seed. Both flags set: cashback wins (6079).
- Mayhem v2 trades gross up on the FULL spend under tf:
  buy spends 1,866,461 (not the plain-pool tf split
  1,866,375) because buyback is 0, so the single vault leg
  grosses up the whole 1,847,796; sell nets 1,784,093 while
  the vault sends only the 1,802,115 receipt (no buyback
  gross-up). Dep before either trade leaves every leg
  byte-identical; a second buy spends 1,866,518 and a
  second sell nets 1,784,040, and the buckets drain to
  133,001 / 131,670 (buy loop) and 133,000 / 131,670
  (sell loop). A buy->sell loop nets 1,784,147 on the sell
  leg and drains the same 133,000 / 131,670.
- Cashback legacy pipes are untouched by a tf deposit:
  dep->cbbuy spends 1,866,234, earns 5,475, claim pays
  5,365 (net of the 55 withheld), sweep/collect drain
  122,160 / 120,938; cbbuy->dep moves the post-buy
  deposit legs (base 160,617,511,066 / quote gross
  29,608,935) but not the buckets; dep->cbsell pays
  178,409 net, earns 548, claim pays 536, sweep/collect
  drain the seed. Withheld stays isolated per hop:
  vault 314,523 after dep->cbbuy, proto/bb 85 each,
  uvata 55.
- Mayhem legacy sell after a tf deposit fails 6013 with
  full rollback; the following sweep/collect still drain
  the seed.
- Limit gates are net-vs-gross aware on a mode pool:
  dep capped at the net 29,312,410 fails 6004
  (deposit.rs:100), wd floored at the gross 29,312,409
  fails 6004 (withdraw.rs:107); both roll back fully and
  the seed sweep/collect after them are unaffected.

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
    base, f, lp, pool, poolraw, quote, supply, token, transferfee,
    userbase, userlp, userquote, vaultbase, vaultquote,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, volume

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-liquidity-mode-pools-tf-chains-20261029"
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
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
POOLV2 = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)[0]
GVOL = Pubkey.find_program_address([b'global_volume_accumulator'], PROGRAM)[0]
GDISC = bytes(next(x for x in IDL['accounts'] if x['name'] == 'GlobalVolumeAccumulator')['discriminator'])
UVA_DISC = bytes(next(x for x in IDL['accounts'] if x['name'] == 'UserVolumeAccumulator')['discriminator'])
MX = 2**64 - 1
VQ0, PF0, CF0 = -125882, 2488, 123394
S_ASIS = 4194352106721
S_DEP9 = S_ASIS + 10**9
S_WD9 = S_ASIS - 10**9
RENT22 = 2157600


def ata22(owner):
    return Pubkey.find_program_address([bytes(owner), bytes(TOKEN22), bytes(quote)], ATA_PROG)[0]


PROTO22 = ata22(PROTOCOL)
CREAT22 = ata22(CREATOR_VAULT)
DEST22 = ata22(CREATOR)
BB22 = ata22(BB_OWNER)
UVA22 = ata22(volume)

DEP_KEYS = [pool, CONFIG_KEY, PAYER_KEY, base, quote, lp, userbase, userquote,
            userlp, vaultbase, vaultquote, TOKEN, TOKEN22, EVENT, PROGRAM]
V2_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
           vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
           buyback, EVENT, PROGRAM]
SWP_KEYS_P = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, PROTOCOL, PROTO22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_C = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, CREATOR_VAULT, CREAT22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
COL_KEYS = [quote, TOKEN22, CREATOR, CREATOR_VAULT, CREAT22, DEST22, EVENT, PROGRAM]
CLAIM_KEYS = [PAYER_KEY, volume, quote, TOKEN22, UVA22, userquote, Pubkey.default(), EVENT, PROGRAM]
LEG_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote, vaultbase, vaultquote,
            PROTOCOL, PROTO22, TOKEN, TOKEN22, Pubkey.default(), ATA_PROG, EVENT, PROGRAM,
            CREAT22, CREATOR_VAULT, feeconfig, FEES]
LEG_REM = [AccountMeta(POOLV2, False, False), AccountMeta(BB_OWNER, False, False),
           AccountMeta(BB22, False, True)]
LEG_CB_REM = [AccountMeta(UVA22, False, True), AccountMeta(volume, False, True),
              AccountMeta(POOLV2, False, False), AccountMeta(BB_OWNER, False, False),
              AccountMeta(BB22, False, True)]
BUY_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote, vaultbase, vaultquote,
            PROTOCOL, PROTO22, TOKEN, TOKEN22, Pubkey.default(), ATA_PROG, EVENT, PROGRAM,
            CREAT22, CREATOR_VAULT, GVOL, volume, feeconfig, FEES]
BUY_REM_CB = [AccountMeta(UVA22, False, True), AccountMeta(POOLV2, False, False),
              AccountMeta(BB_OWNER, False, False), AccountMeta(BB22, False, True)]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTO22, CREAT22, DEST22, BB22, UVA22]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTO22, "creatorata": CREAT22, "dest": DEST22, "bbata": BB22,
            "uvata": UVA22}
DEP_DISC = "78f83d531f8e6b90"
WD_DISC = "1609851aa02c47c0"
SWP_DISC = "82a42461e48287a5"
COL_DISC = "e8f5c2eeeada3a59"
BUY_DISC = "67f4521f2cf57777"
SELL_DISC = "3e2f370aa503dc2a"
CLAIM_DISC = hashlib.sha256(b"event:ClaimCashbackEvent").digest()[:8].hex()


def sha(data):
    return hashlib.sha256(data).hexdigest()


def t22acct(owner, amount, withheld=0):
    data = bytearray(165)
    data[0:32] = bytes(quote)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) + struct.pack("<HHQ", 2, 8, withheld)


def setup_vm(binary, mode, bps):
    # mode: "cb" | "mayhem" | "both"
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
    pd = bytearray(poolraw)
    if mode in ("cb", "both"):
        pd[244] = 1
    if mode in ("mayhem", "both"):
        pd[243] = 1
    vm.set_account(pool, Account(f["accounts"]["pool"]["lamports"], bytes(pd), PROGRAM))
    mint = struct.pack("<I", 1) + bytes(pool) + struct.pack("<Q", supply) + bytes([9, 1]) + bytes(36)
    vm.set_account(lp, Account(10**9, mint, TOKEN22))
    vm.set_account(userbase, Account(10**9, token(base, PAYER_KEY, 10**15, False), TOKEN))
    vm.set_account(userquote, Account(10**15 + 2039280, token(quote, PAYER_KEY, 10**15, True), TOKEN))
    vm.set_account(userlp, Account(10**9, token(lp, PAYER_KEY, supply // 2, False), TOKEN22))
    vm.set_account(GVOL, Account(10**9, GDISC + struct.pack('<qqq', 0, 0, 86400) + bytes(base) + bytes(480), PROGRAM))
    vm.set_account(PROTOCOL, Account(10**9, b'', Pubkey.default()))
    vm.set_account(CREATOR_VAULT, Account(10**9, b'', Pubkey.default()))
    vm.set_account(POOLV2, Account(10**9, b'', Pubkey.default()))
    vm.set_account(BB_OWNER, Account(10**9, b'', Pubkey.default()))
    transferfee(quote, bps, MX)(h, [])
    vm.set_account(PROTO22, Account(RENT22, t22acct(PROTOCOL, 0), TOKEN22))
    vm.set_account(CREAT22, Account(RENT22, t22acct(CREATOR_VAULT, 0), TOKEN22))
    vm.set_account(BB22, Account(RENT22, t22acct(BB_OWNER, 0), TOKEN22))
    vm.set_account(DEST22, Account(RENT22, t22acct(CREATOR, 0), TOKEN22))
    if mode in ("cb", "both"):
        vm.set_account(volume, Account(10**9, UVA_DISC + bytes(PAYER_KEY) + bytes(97), PROGRAM))
        vm.set_account(UVA22, Account(RENT22, t22acct(volume, 0), TOKEN22))
    else:
        vm.set_account(volume, Account(0, b"", Pubkey.default()))
        vm.set_account(UVA22, Account(RENT22, t22acct(volume, 0), TOKEN22))
    h._bps = bps
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


def uva_fields(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    if len(raw) < 90:
        return None
    return [struct.unpack_from("<Q", raw, 74)[0],
            struct.unpack_from("<Q", raw, 82)[0]]


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
    if kind == "cbbuy":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "out": u64(raw, 16), "curve": u64(raw, 64),
                "lp_fee": u64(raw, 80), "proto_fee": u64(raw, 96),
                "quote": u64(raw, 104), "uout": u64(raw, 112),
                "cb_bps": u64(raw, 408), "cb": u64(raw, 416),
                "bb_bps": u64(raw, 424), "bb": u64(raw, 432)}
    if kind in ("cbsell", "lsell"):
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_fee": u64(raw, 80),
                "proto_fee": u64(raw, 96), "quote": u64(raw, 104),
                "uout": u64(raw, 112)}
    if kind == "claim":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "amount": u64(raw, 40), "claimed": u64(raw, 56),
                "earned": u64(raw, 64)}
    if kind in ("swp", "swc"):
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "recipient": raw[112:144].hex(),
                "amount": u64(raw, 176), "bucket": raw[184]}
    if kind == "col":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "creator": raw[16:48].hex(), "fee": u64(raw, 48),
                "vault_ata": raw[56:88].hex(), "dest": raw[88:120].hex()}
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
        name, keys, data, rem = "buy_v2", V2_KEYS, disc("buy_v2") + struct.pack("<QQ", args[0], MX), []
    elif kind == "sell":
        name, keys, data, rem = "sell_v2", V2_KEYS, disc("sell_v2") + struct.pack("<QQ", args[0], 0), []
    elif kind == "swp":
        name, keys, data, rem = "sweep_protocol_fee", SWP_KEYS_P, disc("sweep_protocol_fee"), []
    elif kind == "swc":
        name, keys, data, rem = "sweep_creator_fee", SWP_KEYS_C, disc("sweep_creator_fee"), []
    elif kind == "col":
        name, keys, data, rem = "collect_coin_creator_fee", COL_KEYS, disc("collect_coin_creator_fee"), []
    elif kind == "claim":
        name, keys, data, rem = "claim_cashback", CLAIM_KEYS, disc("claim_cashback"), []
    elif kind == "cbbuy":
        name, keys, data, rem = "buy", BUY_KEYS, disc("buy") + struct.pack("<QQ", args[0], args[1]) + b"\0", BUY_REM_CB
    elif kind == "cbsell":
        name, keys, data, rem = "sell", LEG_KEYS, disc("sell") + struct.pack("<QQ", args[0], args[1]), LEG_CB_REM
    elif kind == "lsell":
        name, keys, data, rem = "sell", LEG_KEYS, disc("sell") + struct.pack("<QQ", args[0], args[1]), LEG_REM
    else:
        raise ValueError(kind)
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])] + list(rem)
    if kind in ("buy", "sell"):
        metas[10] = AccountMeta(TOKEN22, False, False)
        metas[14] = AccountMeta(BB22, False, True)
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
VOL_PRESENT = {"lamports": 10**9, "len": 137, "user": bytes(PAYER_KEY).hex()}


def E(dPAYER, deltas, pool_after, volume, event=None, events=1, error=None,
      rollback=False, wh_after=None, lam_deltas=None, uva=None):
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after),
            "volume": volume, "event": event, "events": events, "error": error,
            "rollback": rollback, "wh_after": wh_after or {},
            "lam_deltas": lam_deltas or {}, "uva": uva}


def P(vq, pf, cf, sup=S_ASIS):
    return [vq, pf, cf, sup]


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


def COL_EV(fee):
    return {"disc": COL_DISC, "len": 120, "timestamp": 1234567890,
            "creator": bytes(CREATOR).hex(), "fee": fee,
            "vault_ata": bytes(CREAT22).hex(), "dest": bytes(DEST22).hex()}


def DEP_EV(base_, quote_):
    return {"disc": DEP_DISC, "len": 264, "base": base_, "quote": quote_}


def WD_EV(base_, quote_):
    return {"disc": WD_DISC, "len": 264, "base": base_, "quote": quote_}


def BUY_EV():
    return {"disc": BUY_DISC, "len": 500, "curve": 1824983, "lp_bps": 2,
            "lp_fee": 365, "proto_bps": 93, "proto_fee": 16973,
            "qwlp": 1825348, "uin": 1847796}


def SELL_EV():
    return {"disc": SELL_DISC, "len": 449, "curve": 1824927, "lp_bps": 2,
            "lp_fee": 365, "proto_bps": 93, "proto_fee": 16972,
            "quote": 1824562, "uout": 1802115}


def BUY2_EV():
    return {"disc": BUY_DISC, "len": 500, "curve": 1825037,
            "lp_fee": 366, "proto_fee": 16973,
            "qwlp": 1825403, "uin": 1847852}


def CBBUY_EV():
    return {"disc": BUY_DISC, "len": 497, "out": 10**10, "curve": 1824983,
            "lp_fee": 365, "proto_fee": 16973, "quote": 1825348,
            "uout": 1847796, "cb_bps": 30, "cb": 5475,
            "bb_bps": 5000, "bb": 8401}


def CBSELL_EV():
    return {"disc": SELL_DISC, "len": 449, "curve": 182495, "lp_fee": 37,
            "proto_fee": 1698, "quote": 182458, "uout": 180212}


def CLAIM_EV(amount, claimed, earned):
    return {"disc": CLAIM_DISC, "len": 72, "amount": amount,
            "claimed": claimed, "earned": earned}


POOL_ASIS = P(VQ0, PF0, CF0)
D_DEP9_TF100 = {"userbase": -160619895224, "userquote": -29608495, "userlp": 10**9,
                "vaultbase": 160619895224, "vaultquote": 29312410}
D_DEP9_TF5000 = {"userbase": -160619895224, "userquote": -58624820, "userlp": 10**9,
                 "vaultbase": 160619895224, "vaultquote": 29312410}
D_WD9_TF100 = {"userbase": 160619895223, "userquote": 29019284, "userlp": -10**9,
               "vaultbase": -160619895223, "vaultquote": -29312409}
LAM_DEP_TF100 = {"userquote": -29608495, "vaultquote": 29608495}
LAM_DEP_TF5000 = {"userquote": -58624820, "vaultquote": 58624820}
LAM_WD_TF100 = {"userquote": 29312409, "vaultquote": -29312409}


def SWC_SEED_TF100(pool_after, vol, uva):
    return E(-5000, {"creatorata": 122160, "vaultquote": -123394}, pool_after, vol,
             event=SWP_EV(123394, 1, CREATOR_VAULT),
             wh_after={"creatorata": 1234}, uva=uva)


def COL_SEED_TF100(pool_after, vol, uva):
    return E(-5000, {"creatorata": -122160, "dest": 120938}, pool_after, vol,
             event=COL_EV(122160),
             wh_after={"creatorata": 1234, "dest": 1222}, uva=uva)


def SWC_SEED_TF5000(pool_after, vol, uva):
    return E(-5000, {"creatorata": 61697, "vaultquote": -123394}, pool_after, vol,
             event=SWP_EV(123394, 1, CREATOR_VAULT),
             wh_after={"creatorata": 61697}, uva=uva)


def COL_SEED_TF5000(pool_after, vol, uva):
    return E(-5000, {"creatorata": -61697, "dest": 30848}, pool_after, vol,
             event=COL_EV(61697),
             wh_after={"creatorata": 61697, "dest": 30849}, uva=uva)


def SWC_BUCKET(pool_after, vol, gross, net, wh, uva):
    return E(-5000, {"creatorata": net, "vaultquote": -gross}, pool_after, vol,
             event=SWP_EV(gross, 1, CREATOR_VAULT),
             wh_after={"creatorata": wh}, uva=uva)


def COL_BUCKET(pool_after, vol, gross, net, wh, dest_wh, uva):
    return E(-5000, {"creatorata": -gross, "dest": net}, pool_after, vol,
             event=COL_EV(gross),
             wh_after={"creatorata": wh, "dest": dest_wh}, uva=uva)


def FAIL(pool_after, vol, code, uva):
    return E(-5000, {}, pool_after, vol, events=0, error=code, rollback=True, uva=uva)


def DEP_TF100(pool_after, vol, uva):
    return E(-5000, D_DEP9_TF100, pool_after, vol,
             event=DEP_EV(160619895224, 29312410),
             wh_after={"vaultquote": 296085, "userquote": 0},
             lam_deltas=LAM_DEP_TF100, uva=uva)


def WD_TF100(pool_after, vol, uva):
    return E(-5000, D_WD9_TF100, pool_after, vol,
             event=WD_EV(160619895223, 29312409),
             wh_after={"userquote": 293125, "vaultquote": 0},
             lam_deltas=LAM_WD_TF100, uva=uva)

CASES = [
    # Family A -- mode tf liquidity anchors -> sweep -> collect (seed only).
    {"label": "a-cb-dep-tf100-swc-col", "mode": "cb", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [0, 0]),
                COL_SEED_TF100(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [0, 0])]},
    {"label": "a-mayhem-dep-tf100-swc-col", "mode": "mayhem", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), None, None),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_DEP9), None, None),
                COL_SEED_TF100(P(-2488, PF0, 0, S_DEP9), None, None)]},
    {"label": "a-cb-wd-tf100-swc-col", "mode": "cb", "bps": 100,
     "steps": [("wd", (10**9, 0, 0)), ("swc", ()), ("col", ())],
     "expect": [WD_TF100(P(VQ0, PF0, CF0, S_WD9), VOL_PRESENT, [0, 0]),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_WD9), VOL_PRESENT, [0, 0]),
                COL_SEED_TF100(P(-2488, PF0, 0, S_WD9), VOL_PRESENT, [0, 0])]},
    {"label": "a-mayhem-wd-tf100-swc-col", "mode": "mayhem", "bps": 100,
     "steps": [("wd", (10**9, 0, 0)), ("swc", ()), ("col", ())],
     "expect": [WD_TF100(P(VQ0, PF0, CF0, S_WD9), None, None),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_WD9), None, None),
                COL_SEED_TF100(P(-2488, PF0, 0, S_WD9), None, None)]},
    {"label": "a-cb-dep-tf5000-swc-col", "mode": "cb", "bps": 5000,
     "steps": [("dep", (10**9, MX, MX)), ("swc", ()), ("col", ())],
     "expect": [E(-5000, D_DEP9_TF5000, P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=DEP_EV(160619895224, 29312410),
                  wh_after={"vaultquote": 29312410, "userquote": 0},
                  lam_deltas=LAM_DEP_TF5000, uva=[0, 0]),
                SWC_SEED_TF5000(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [0, 0]),
                COL_SEED_TF5000(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [0, 0])]},
    # Family B -- protocol sweep still splits by mode under tf.
    {"label": "b-cb-dep-tf100-swp-colnoop", "mode": "cb", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("swp", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                E(-5000, {"protoata": 2463, "vaultquote": -2488},
                  P(-123394, 0, 123394, S_DEP9), VOL_PRESENT,
                  event=SWP_EV(2488, 0, PROTOCOL),
                  wh_after={"protoata": 25}, uva=[0, 0]),
                E(-5000, {}, P(-123394, 0, 123394, S_DEP9), VOL_PRESENT, events=0,
                  wh_after={"protoata": 25, "vaultquote": 296085}, uva=[0, 0])]},
    {"label": "b-mayhem-dep-tf100-swp-fail-swc-col", "mode": "mayhem", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("swp", ()), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), None, None),
                FAIL(P(VQ0, PF0, CF0, S_DEP9), None, "6013", None),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_DEP9), None, None),
                COL_SEED_TF100(P(-2488, PF0, 0, S_DEP9), None, None)]},
    # Family C -- v2 gates survive tf liquidity on mode pools.
    {"label": "c-cb-dep-tf100-buy-fail-swc-col", "mode": "cb", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                FAIL(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, "6079", [0, 0]),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [0, 0]),
                COL_SEED_TF100(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [0, 0])]},
    {"label": "c-both-dep-tf100-buy-fail-swc-col", "mode": "both", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                FAIL(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, "6079", [0, 0]),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [0, 0]),
                COL_SEED_TF100(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [0, 0])]},
    {"label": "c-cb-wd-tf100-sell-fail-swc-col", "mode": "cb", "bps": 100,
     "steps": [("wd", (10**9, 0, 0)), ("sell", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [WD_TF100(P(VQ0, PF0, CF0, S_WD9), VOL_PRESENT, [0, 0]),
                FAIL(P(VQ0, PF0, CF0, S_WD9), VOL_PRESENT, "6079", [0, 0]),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_WD9), VOL_PRESENT, [0, 0]),
                COL_SEED_TF100(P(-2488, PF0, 0, S_WD9), VOL_PRESENT, [0, 0])]},
    # Family D -- mayhem v2 trades under tf (buyback 0, full-spend gross-up).
    {"label": "d-mayhem-dep-tf100-buy-swc-col", "mode": "mayhem", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), None, None),
                E(-1849400, {"userbase": 10**10, "userquote": -1866461,
                             "vaultbase": -10**10, "vaultquote": 1847796},
                  P(-148330, 19461, 128869, S_DEP9), VOL_CREATED,
                  event=BUY_EV(), wh_after={"vaultquote": 314750},
                  lam_deltas={"userquote": -1866461, "vaultquote": 1866461}, uva=[0, 0]),
                SWC_BUCKET(P(-19461, 19461, 0, S_DEP9), VOL_CREATED, 128869, 127580, 1289, [0, 0]),
                COL_BUCKET(P(-19461, 19461, 0, S_DEP9), VOL_CREATED, 127580, 126304, 1289, 1276, [0, 0])]},
    {"label": "d-mayhem-dep-tf100-sell-swc-col", "mode": "mayhem", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("sell", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), None, None),
                E(-1849400, {"userbase": -10**10, "userquote": 1784093,
                             "vaultbase": 10**10, "vaultquote": -1802115},
                  P(-148329, 19460, 128869, S_DEP9), VOL_CREATED,
                  event=SELL_EV(), wh_after={"userquote": 18022, "vaultquote": 296085},
                  lam_deltas={"userquote": 1802115, "vaultquote": -1802115}, uva=[0, 0]),
                SWC_BUCKET(P(-19460, 19460, 0, S_DEP9), VOL_CREATED, 128869, 127580, 1289, [0, 0]),
                COL_BUCKET(P(-19460, 19460, 0, S_DEP9), VOL_CREATED, 127580, 126304, 1289, 1276, [0, 0])]},
    {"label": "d-mayhem-buy-tf100-swc-col", "mode": "mayhem", "bps": 100,
     "steps": [("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [E(-1849400, {"userbase": 10**10, "userquote": -1866461,
                             "vaultbase": -10**10, "vaultquote": 1847796},
                  P(-148330, 19461, 128869), VOL_CREATED,
                  event=BUY_EV(), wh_after={"vaultquote": 18665},
                  lam_deltas={"userquote": -1866461, "vaultquote": 1866461}, uva=[0, 0]),
                SWC_BUCKET(P(-19461, 19461, 0), VOL_CREATED, 128869, 127580, 1289, [0, 0]),
                COL_BUCKET(P(-19461, 19461, 0), VOL_CREATED, 127580, 126304, 1289, 1276, [0, 0])]},
    {"label": "d-mayhem-sell-tf100-swc-col", "mode": "mayhem", "bps": 100,
     "steps": [("sell", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [E(-1849400, {"userbase": -10**10, "userquote": 1784093,
                             "vaultbase": 10**10, "vaultquote": -1802115},
                  P(-148329, 19460, 128869), VOL_CREATED,
                  event=SELL_EV(), wh_after={"userquote": 18022, "vaultquote": 0},
                  lam_deltas={"userquote": 1802115, "vaultquote": -1802115}, uva=[0, 0]),
                SWC_BUCKET(P(-19460, 19460, 0), VOL_CREATED, 128869, 127580, 1289, [0, 0]),
                COL_BUCKET(P(-19460, 19460, 0), VOL_CREATED, 127580, 126304, 1289, 1276, [0, 0])]},
    {"label": "d-mayhem-dep-tf100-buy-buy-swc-col", "mode": "mayhem", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("buy", (10**10,)), ("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), None, None),
                E(-1849400, {"userbase": 10**10, "userquote": -1866461,
                             "vaultbase": -10**10, "vaultquote": 1847796},
                  P(-148330, 19461, 128869, S_DEP9), VOL_CREATED,
                  event=BUY_EV(), wh_after={"vaultquote": 314750},
                  lam_deltas={"userquote": -1866461, "vaultquote": 1866461}, uva=[0, 0]),
                E(-5000, {"userbase": 10**10, "userquote": -1866518,
                          "vaultbase": -10**10, "vaultquote": 1847852},
                  P(-170779, 36434, 134345, S_DEP9), VOL_CREATED,
                  event=BUY2_EV(), wh_after={"vaultquote": 333416},
                  lam_deltas={"userquote": -1866518, "vaultquote": 1866518}, uva=[0, 0]),
                SWC_BUCKET(P(-36434, 36434, 0, S_DEP9), VOL_CREATED, 134345, 133001, 1344, [0, 0]),
                COL_BUCKET(P(-36434, 36434, 0, S_DEP9), VOL_CREATED, 133001, 131670, 1344, 1331, [0, 0])]},
    {"label": "d-mayhem-dep-tf100-sell-sell-swc-col", "mode": "mayhem", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("sell", (10**10,)), ("sell", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), None, None),
                E(-1849400, {"userbase": -10**10, "userquote": 1784093,
                             "vaultbase": 10**10, "vaultquote": -1802115},
                  P(-148329, 19460, 128869, S_DEP9), VOL_CREATED,
                  event=SELL_EV(), wh_after={"userquote": 18022, "vaultquote": 296085},
                  lam_deltas={"userquote": 1802115, "vaultquote": -1802115}, uva=[0, 0]),
                E(-5000, {"userbase": -10**10, "userquote": 1784040,
                          "vaultbase": 10**10, "vaultquote": -1802061},
                  P(-170776, 36432, 134344, S_DEP9), VOL_CREATED,
                  event={"disc": SELL_DISC, "len": 449},
                  wh_after={"userquote": 36043, "vaultquote": 296085},
                  lam_deltas={"userquote": 1802061, "vaultquote": -1802061}, uva=[0, 0]),
                SWC_BUCKET(P(-36432, 36432, 0, S_DEP9), VOL_CREATED, 134344, 133000, 1344, [0, 0]),
                COL_BUCKET(P(-36432, 36432, 0, S_DEP9), VOL_CREATED, 133000, 131670, 1344, 1330, [0, 0])]},
    # Family E -- cashback legacy pipes under a tf deposit.
    {"label": "e-cb-dep-tf100-cbbuy-claim-swc-col", "mode": "cb", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("cbbuy", (10**10, 10**12)), ("claim", ()), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                E(-5000, {"userbase": 10**10, "userquote": -1866234,
                          "vaultbase": -10**10, "vaultquote": 1825348,
                          "protoata": 8402, "bbata": 8401, "uvata": 5420},
                  P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=CBBUY_EV(),
                  wh_after={"vaultquote": 314523, "protoata": 85, "bbata": 85, "uvata": 55},
                  lam_deltas={"userquote": -1866234, "vaultquote": 1843786,
                              "protoata": 8487, "bbata": 8486, "uvata": 5475},
                  uva=[5475, 0]),
                E(-5000, {"userquote": 5365, "uvata": -5420},
                  P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=CLAIM_EV(5420, 5420, 5475),
                  wh_after={"userquote": 55, "uvata": 55}, uva=[5475, 5420]),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [5475, 5420]),
                COL_SEED_TF100(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [5475, 5420])]},
    {"label": "e-cb-cbbuy-tf100-dep-claim-swc-col", "mode": "cb", "bps": 100,
     "steps": [("cbbuy", (10**10, 10**12)), ("dep", (10**9, MX, MX)), ("claim", ()), ("swc", ()), ("col", ())],
     "expect": [E(-5000, {"userbase": 10**10, "userquote": -1866234,
                          "vaultbase": -10**10, "vaultquote": 1825348,
                          "protoata": 8402, "bbata": 8401, "uvata": 5420},
                  POOL_ASIS, VOL_PRESENT,
                  event=CBBUY_EV(),
                  wh_after={"vaultquote": 18438, "protoata": 85, "bbata": 85, "uvata": 55},
                  lam_deltas={"userquote": -1866234, "vaultquote": 1843786,
                              "protoata": 8487, "bbata": 8486, "uvata": 5475},
                  uva=[5475, 0]),
                E(-5000, {"userbase": -160617511066, "userquote": -29608935, "userlp": 10**9,
                          "vaultbase": 160617511066, "vaultquote": 29312845},
                  P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=DEP_EV(160617511066, 29312845),
                  wh_after={"vaultquote": 314528, "protoata": 85, "bbata": 85, "uvata": 55},
                  lam_deltas={"userquote": -29608935, "vaultquote": 29608935},
                  uva=[5475, 0]),
                E(-5000, {"userquote": 5365, "uvata": -5420},
                  P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=CLAIM_EV(5420, 5420, 5475),
                  wh_after={"userquote": 55, "uvata": 55}, uva=[5475, 5420]),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [5475, 5420]),
                COL_SEED_TF100(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [5475, 5420])]},
    {"label": "e-cb-dep-tf100-cbsell-claim-swc-col", "mode": "cb", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("cbsell", (10**9, 0)), ("claim", ()), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                E(-5000, {"userbase": -10**9, "userquote": 178409,
                          "vaultbase": 10**9, "vaultquote": -182458,
                          "protoata": 840, "bbata": 840, "uvata": 542},
                  P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=CBSELL_EV(),
                  wh_after={"userquote": 1803, "protoata": 9, "bbata": 9, "uvata": 6,
                            "vaultquote": 296085},
                  lam_deltas={"userquote": 180212, "vaultquote": -182458,
                              "protoata": 849, "bbata": 849, "uvata": 548},
                  uva=[548, 0]),
                E(-5000, {"userquote": 536, "uvata": -542},
                  P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=CLAIM_EV(542, 542, 548),
                  wh_after={"userquote": 1809, "uvata": 6}, uva=[548, 542]),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [548, 542]),
                COL_SEED_TF100(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [548, 542])]},
    # Family F -- mayhem legacy-sell gate under a tf deposit.
    {"label": "f-mayhem-dep-tf100-lsell-fail-swc-col", "mode": "mayhem", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("lsell", (10**9, 0)), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), None, None),
                FAIL(P(VQ0, PF0, CF0, S_DEP9), None, "6013", None),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_DEP9), None, None),
                COL_SEED_TF100(P(-2488, PF0, 0, S_DEP9), None, None)]},
    # Family G -- limit gates on a mode pool under tf.
    {"label": "g-cb-dep-limit-net-tf100-swc-col", "mode": "cb", "bps": 100,
     "steps": [("dep", (10**9, MX, 29312410)), ("swc", ()), ("col", ())],
     "expect": [FAIL(POOL_ASIS, VOL_PRESENT, "6004", [0, 0]),
                SWC_SEED_TF100(P(-2488, PF0, 0), VOL_PRESENT, [0, 0]),
                COL_SEED_TF100(P(-2488, PF0, 0), VOL_PRESENT, [0, 0])]},
    {"label": "g-cb-wd-limit-gross-tf100-swc-col", "mode": "cb", "bps": 100,
     "steps": [("wd", (10**9, 0, 29312409)), ("swc", ()), ("col", ())],
     "expect": [FAIL(POOL_ASIS, VOL_PRESENT, "6004", [0, 0]),
                SWC_SEED_TF100(P(-2488, PF0, 0), VOL_PRESENT, [0, 0]),
                COL_SEED_TF100(P(-2488, PF0, 0), VOL_PRESENT, [0, 0])]},
    # Family R -- round trip and buy->sell loop under tf on mode pools.
    {"label": "r-cb-dep-tf100-wd-swc-col", "mode": "cb", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("wd", (10**9, 0, 0)), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                E(-5000, D_WD9_TF100, POOL_ASIS, VOL_PRESENT,
                  event=WD_EV(160619895223, 29312409),
                  wh_after={"userquote": 293125, "vaultquote": 296085},
                  lam_deltas=LAM_WD_TF100, uva=[0, 0]),
                SWC_SEED_TF100(P(-2488, PF0, 0), VOL_PRESENT, [0, 0]),
                COL_SEED_TF100(P(-2488, PF0, 0), VOL_PRESENT, [0, 0])]},
    {"label": "r-mayhem-dep-tf100-buy-sell-swc-col", "mode": "mayhem", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("buy", (10**10,)), ("sell", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [DEP_TF100(P(VQ0, PF0, CF0, S_DEP9), None, None),
                E(-1849400, {"userbase": 10**10, "userquote": -1866461,
                             "vaultbase": -10**10, "vaultquote": 1847796},
                  P(-148330, 19461, 128869, S_DEP9), VOL_CREATED,
                  event=BUY_EV(), wh_after={"vaultquote": 314750},
                  lam_deltas={"userquote": -1866461, "vaultquote": 1866461}, uva=[0, 0]),
                E(-5000, {"userbase": -10**10, "userquote": 1784147,
                          "vaultbase": 10**10, "vaultquote": -1802169},
                  P(-170778, 36434, 134344, S_DEP9), VOL_CREATED,
                  event={"disc": SELL_DISC, "len": 449},
                  wh_after={"userquote": 18022, "vaultquote": 314750},
                  lam_deltas={"userquote": 1802169, "vaultquote": -1802169}, uva=[0, 0]),
                SWC_BUCKET(P(-36434, 36434, 0, S_DEP9), VOL_CREATED, 134344, 133000, 1344, [0, 0]),
                COL_BUCKET(P(-36434, 36434, 0, S_DEP9), VOL_CREATED, 133000, 131670, 1344, 1330, [0, 0])]},
]

STEP_KIND = {"dep": "dep", "wd": "wd", "buy": "buy", "sell": "sell",
             "swp": "swp", "swc": "swc", "col": "col", "claim": "claim",
             "cbbuy": "cbbuy", "cbsell": "cbsell", "lsell": "lsell"}


def run_case(case, image_name, binary):
    h = setup_vm(binary, case["mode"], case["bps"])
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
        got_uva = uva_fields(rec["after"][str(volume)])
        check(got_uva == exp["uva"], f"{tag}: uva {got_uva} != {exp['uva']}")
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
        report_cases.append({"label": case["label"], "mode": case["mode"], "bps": case["bps"],
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
