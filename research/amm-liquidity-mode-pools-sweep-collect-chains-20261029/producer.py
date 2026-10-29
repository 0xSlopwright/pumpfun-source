#!/usr/bin/env python3
"""Build research/amm-liquidity-mode-pools-sweep-collect-chains-20261029 receipts.

3rd run packet #22: deposit/withdraw on cashback and mayhem pools
chained into sweep -> collect (and, for cashback legacy trades,
into claim).

The gap: 2nd #44 pinned the trade-path mode gates (v2 rejects
cashback pools with 6079, legacy sell accepts cashback pools but
rejects mayhem pools with 6013, mayhem v2 trades force buyback
to 0), and 3rd #18 chained liquidity-first sweep/collect on a
plain pool. Nobody chained LIQUIDITY on a mode-flagged pool into
the fee pipes: deposit and withdraw take no mode check at all,
so on a cashback pool a deposit should still move exactly the
seed buckets into sweep/collect even though the very next v2
trade fails 6079, and on a mayhem pool a deposit should still
sweep/collect the seed even though the protocol sweep itself
fails 6013. The packet also chains the mayhem v2 trade (buyback
forced to 0, full protocol fee accrued) into sweep/collect, and
cashback legacy trades after a deposit into claim + sweep +
collect, with totals conserved.

Sharp results (all three images agree on every step):
- Deposit/withdraw ignore both mode flags: dep-1e9 and wd-1e9
  settle with the fresh legs on cashback, mayhem, and
  both-flags pools, accrue nothing, and the following creator
  sweep moves exactly the 123,394 seed, drained in full by
  collect. A dep->wd round trip leaves the seed intact.
- Protocol sweep splits by mode: on a cashback pool it
  succeeds (2,488) and the following collect is a silent
  no-op; on a mayhem pool it fails 6013 InvalidProtocolFeeRecipient
  (swap/mod.rs:164) with full rollback, yet the creator sweep
  after it still drains the seed.
- v2 gates survive liquidity: dep->buy_v2, wd->sell_v2, and
  dep->buy_exact_v2 on a cashback pool all fail 6079
  CashbackCoinNotSupported (trade_v2.rs:103) with full
  rollback, and the following sweep/collect still drain the
  seed. Both flags set: cashback wins (6079).
- Mayhem v2 trades chain cleanly: fresh mayhem buy spends
  1,847,796 with buyback 0 (vault takes the full spend),
  pool (-148330, 19461, 128869); fresh mayhem sell pays
  1,802,115 with buyback 0 (vault sends only the receipt),
  pool (-148329, 19460, 128869). Dep before either trade
  leaves every leg byte-identical (proportional liquidity is
  invisible, as on plain pools), and sweep/collect drain
  128,869 (134,345 after a second mayhem buy).
- Cashback legacy trades after a deposit are untouched by
  it: dep->cbbuy spends 1,847,796, earns 5,475, claim pays
  5,475, sweep/collect drain 123,394 (total 128,869);
  cbbuy->dep moves the deposit legs (base 160,617,511,066 /
  quote 29,312,845, the post-buy available legs) but not the
  buckets; dep->cbsell pays 180,212, earns 548, claim pays
  548, sweep/collect drain 123,394 (total 123,942).
- Mayhem legacy sell after a deposit fails 6013 with full
  rollback; the following sweep/collect still drain the seed.

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
from pump_amm_legacy_buy_differential import uvata

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-liquidity-mode-pools-sweep-collect-chains-20261029"
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
DEST = Pubkey.from_bytes(bytes([94]) * 32)
GVOL = Pubkey.find_program_address([b'global_volume_accumulator'], PROGRAM)[0]
GDISC = bytes(next(x for x in IDL['accounts'] if x['name'] == 'GlobalVolumeAccumulator')['discriminator'])
UVA_DISC = bytes(next(x for x in IDL['accounts'] if x['name'] == 'UserVolumeAccumulator')['discriminator'])
POOLV2 = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)[0]
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
MX = 2**64 - 1
VQ0, PF0, CF0 = -125882, 2488, 123394
S_ASIS = 4194352106721
S_DEP9 = S_ASIS + 10**9
S_WD9 = S_ASIS - 10**9

DEP_KEYS = [pool, CONFIG_KEY, PAYER_KEY, base, quote, lp, userbase, userquote,
            userlp, vaultbase, vaultquote, TOKEN, TOKEN22, EVENT, PROGRAM]
TRD_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
            buyback, EVENT, PROGRAM]
SWP_KEYS_P = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, PROTOCOL, PROTOCOL_ATA,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_C = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, CREATOR_VAULT, CREATOR_ATA,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
COL_KEYS = [quote, TOKEN, CREATOR, CREATOR_VAULT, CREATOR_ATA, DEST, EVENT, PROGRAM]
CLAIM_KEYS = [PAYER_KEY, volume, quote, TOKEN, uvata, userquote, Pubkey.default(), EVENT, PROGRAM]
LEG_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote, vaultbase, vaultquote,
            PROTOCOL, PROTOCOL_ATA, TOKEN, TOKEN, Pubkey.default(), ATA_PROG, EVENT, PROGRAM,
            CREATOR_ATA, CREATOR_VAULT, feeconfig, FEES]
LEG_REM = [AccountMeta(POOLV2, False, False), AccountMeta(BB_OWNER, False, False),
           AccountMeta(buyback, False, True)]
LEG_CB_REM = [AccountMeta(uvata, False, True), AccountMeta(volume, False, True),
              AccountMeta(POOLV2, False, False), AccountMeta(BB_OWNER, False, False),
              AccountMeta(buyback, False, True)]
BUY_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote, vaultbase, vaultquote,
            PROTOCOL, PROTOCOL_ATA, TOKEN, TOKEN, Pubkey.default(), ATA_PROG, EVENT, PROGRAM,
            CREATOR_ATA, CREATOR_VAULT, GVOL, volume, feeconfig, FEES]
BUY_REM_CB = [AccountMeta(uvata, False, True), AccountMeta(POOLV2, False, False),
              AccountMeta(BB_OWNER, False, False), AccountMeta(buyback, False, True)]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTOCOL_ATA, CREATOR_ATA, DEST, uvata, GVOL]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTOCOL_ATA, "creatorata": CREATOR_ATA, "dest": DEST,
            "uvata": uvata}
DEP_DISC = "78f83d531f8e6b90"
WD_DISC = "1609851aa02c47c0"
SWP_DISC = "82a42461e48287a5"
COL_DISC = "e8f5c2eeeada3a59"
BUY_DISC = "67f4521f2cf57777"
SELL_DISC = "3e2f370aa503dc2a"
CLAIM_DISC = hashlib.sha256(b"event:ClaimCashbackEvent").digest()[:8].hex()


def sha(data):
    return hashlib.sha256(data).hexdigest()


def setup_vm(binary, mode):
    # mode: "std" | "cb" | "mayhem" | "both"
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
    vm.set_account(PROTOCOL_ATA, Account(10**15 + 2039280, token(quote, PROTOCOL, 0, True), TOKEN))
    vm.set_account(CREATOR_ATA, Account(10**9, token(quote, CREATOR_VAULT, 0, True), TOKEN))
    vm.set_account(PROTOCOL, Account(10**9, b'', Pubkey.default()))
    vm.set_account(CREATOR_VAULT, Account(10**9, b'', Pubkey.default()))
    vm.set_account(POOLV2, Account(10**9, b'', Pubkey.default()))
    vm.set_account(BB_OWNER, Account(10**9, b'', Pubkey.default()))
    vm.set_account(DEST, Account(2039280, token(quote, CREATOR, 0, True), TOKEN))
    if mode in ("cb", "both"):
        vm.set_account(volume, Account(10**9, UVA_DISC + bytes(PAYER_KEY) + bytes(97), PROGRAM))
        vm.set_account(uvata, Account(2039280, token(quote, volume, 0, True), TOKEN))
    else:
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
    if len(raw) == 0:
        return None
    return {"lamports": entry["lamports"], "len": len(raw),
            "user": raw[8:40].hex()}


def uva_fields(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    if len(raw) == 0:
        return None
    return [struct.unpack_from("<Q", raw, 74)[0],
            struct.unpack_from("<Q", raw, 82)[0]]


def u64(raw, off):
    return struct.unpack_from("<Q", raw, off)[0]


def ev_lines(logs):
    return [base64.b64decode(l.split("Program data: ", 1)[1].strip())
            for l in logs if l.startswith("Program data: ")]


def decode_event(kind, rec):
    lines = ev_lines(rec["logs"])
    if kind in ("dep", "wd"):
        if len(lines) != 1:
            return None
        raw = lines[0]
        return {"disc": raw[:8].hex(), "len": len(raw),
                "base": u64(raw, 72), "quote": u64(raw, 80)}
    if kind == "buy":
        if len(lines) != 1:
            return None
        raw = lines[0]
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_bps": u64(raw, 72),
                "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
                "proto_fee": u64(raw, 96), "qwlp": u64(raw, 104),
                "uin": u64(raw, 112)}
    if kind == "sell":
        if len(lines) != 1:
            return None
        raw = lines[0]
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_bps": u64(raw, 72),
                "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
                "proto_fee": u64(raw, 96), "quote": u64(raw, 104),
                "uout": u64(raw, 112)}
    if kind in ("swp", "swc"):
        if len(lines) != 1:
            return None
        raw = lines[0]
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "recipient": raw[112:144].hex(),
                "amount": u64(raw, 176), "bucket": raw[184]}
    if kind == "col":
        if len(lines) != 1:
            return None
        raw = lines[0]
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "creator": raw[16:48].hex(), "fee": u64(raw, 48),
                "vault_ata": raw[56:88].hex(), "dest": raw[88:120].hex()}
    if kind == "claim":
        if len(lines) != 1:
            return None
        raw = lines[0]
        return {"disc": raw[:8].hex(), "len": len(raw),
                "user": raw[8:40].hex(), "amount": u64(raw, 40),
                "ts": struct.unpack_from("<q", raw, 48)[0],
                "total_claimed": u64(raw, 56), "total_earned": u64(raw, 64)}
    if kind == "cbbuy":
        for raw in lines:
            if len(raw) == 497:
                return {"disc": raw[:8].hex(), "len": len(raw),
                        "out": u64(raw, 16), "max": u64(raw, 24),
                        "curve": u64(raw, 64), "lp_bps": u64(raw, 72),
                        "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
                        "proto_fee": u64(raw, 96), "quote": u64(raw, 104),
                        "uout": u64(raw, 112), "creator_bps": u64(raw, 344),
                        "creator_fee": u64(raw, 352), "track": raw[360],
                        "cb_bps": u64(raw, 408), "cb": u64(raw, 416),
                        "bb_bps": u64(raw, 424), "bb": u64(raw, 432)}
        return None
    if kind == "cbsell":
        if len(lines) != 1:
            return None
        raw = lines[0]
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_fee": u64(raw, 80),
                "protocol_fee": u64(raw, 96), "quote": u64(raw, 104),
                "user_out": u64(raw, 112),
                "creator_bps": u64(raw, 344), "creator_fee": u64(raw, 352),
                "cashback_bps": u64(raw, 360), "cashback": u64(raw, 368),
                "buyback_fee": u64(raw, 384)}
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
    elif kind == "exact":
        name, keys, data, rem = "buy_exact_quote_in_v2", TRD_KEYS, disc("buy_exact_quote_in_v2") + struct.pack("<QQ", args[0], args[1]), []
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
      uva=None, site_fragment=None):
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after) if pool_after is not None else None,
            "volume": volume, "event": event, "events": events, "error": error,
            "uva": uva, "site_fragment": site_fragment}


def P(vq, pf, cf, sup=S_ASIS):
    return [vq, pf, cf, sup]


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


def COL_EV(fee):
    return {"disc": COL_DISC, "len": 120, "timestamp": 1234567890,
            "creator": bytes(CREATOR).hex(), "fee": fee,
            "vault_ata": bytes(CREATOR_ATA).hex(), "dest": bytes(DEST).hex()}


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


def CLAIM_EV(amount, claimed, earned):
    return {"disc": CLAIM_DISC, "len": 72, "user": bytes(PAYER_KEY).hex(),
            "amount": amount, "ts": 1234567890,
            "total_claimed": claimed, "total_earned": earned}


def CBBUY_EV():
    return {"disc": BUY_DISC, "len": 497, "out": 10**10, "max": 10**12,
            "curve": 1824983, "lp_bps": 2, "lp_fee": 365,
            "proto_bps": 93, "proto_fee": 16973, "quote": 1825348,
            "uout": 1847796, "creator_bps": 0, "creator_fee": 0, "track": 0,
            "cb_bps": 30, "cb": 5475, "bb_bps": 5000, "bb": 8486}


def CBSELL_EV():
    return {"disc": SELL_DISC, "len": 449, "curve": 182495, "lp_fee": 37,
            "protocol_fee": 1698, "quote": 182458, "user_out": 180212,
            "creator_bps": 0, "creator_fee": 0, "cashback_bps": 30,
            "cashback": 548, "buyback_fee": 849}


POOL_ASIS = P(VQ0, PF0, CF0)
VOL_PRESENT = {"lamports": 10**9, "len": 137, "user": bytes(PAYER_KEY).hex()}
VOL_FRESH = {"lamports": 1844400, "len": 137, "user": bytes(PAYER_KEY).hex()}
D_DEP9 = {"userbase": -160619895224, "userquote": -29312410, "userlp": 10**9,
          "vaultbase": 160619895224, "vaultquote": 29312410}
D_WD9 = {"userbase": 160619895223, "userquote": 29312409, "userlp": -10**9,
         "vaultbase": -160619895223, "vaultquote": -29312409}
D_DEP_AFTER_BUY = {"userbase": -160617511066, "userquote": -29312845, "userlp": 10**9,
                   "vaultbase": 160617511066, "vaultquote": 29312845}
D_CBBUY = {"userbase": 10**10, "userquote": -1847796,
           "vaultbase": -10**10, "vaultquote": 1825348,
           "protoata": 8487, "creatorata": 0, "buyback": 8486, "uvata": 5475}
D_CBSELL = {"userbase": -10**9, "userquote": 180212,
            "vaultbase": 10**9, "vaultquote": -182458,
            "protoata": 849, "buyback": 849, "uvata": 548}
SWP = E(-5000, {"protoata": 2488, "vaultquote": -2488},
        P(-123394, 0, CF0), None, event=SWP_EV(2488, 0, PROTOCOL))
SWC = E(-5000, {"creatorata": 123394, "vaultquote": -123394},
        P(-2488, PF0, 0), None, event=SWP_EV(123394, 1, CREATOR_VAULT))
COL = E(-5000, {"creatorata": -123394, "dest": 123394},
        None, None, event=COL_EV(123394))
NOOP = E(-5000, {}, None, None, events=0)


def swp_after(pool_after, volume, uva=None):
    e = E(-5000, {"protoata": 2488, "vaultquote": -2488},
          pool_after, volume, event=SWP_EV(2488, 0, PROTOCOL))
    e["uva"] = uva
    return e


def swc_after(pool_after, volume, uva=None):
    e = E(-5000, {"creatorata": 123394, "vaultquote": -123394},
          pool_after, volume, event=SWP_EV(123394, 1, CREATOR_VAULT))
    e["uva"] = uva
    return e


def col_after(pool_after, volume, fee=123394, uva=None):
    e = E(-5000, {"creatorata": -fee, "dest": fee},
          pool_after, volume, event=COL_EV(fee))
    e["uva"] = uva
    return e


def fail_after(pool_after, volume, code, site_fragment, uva=None):
    return E(-5000, {}, pool_after, volume, events=0, error=code,
             uva=uva, site_fragment=site_fragment)


def dep_after(pool_after, volume, uva=None):
    return E(-5000, D_DEP9, pool_after, volume, event=DEP_EV(160619895224, 29312410), uva=uva)


def wd_after(pool_after, volume, uva=None):
    return E(-5000, D_WD9, pool_after, volume, event=WD_EV(160619895223, 29312409), uva=uva)


CASES = [
    # Family A -- cashback liquidity anchors (volume present, uva 0/0)
    {"label": "a-dep-swc-col", "mode": "cb",
     "steps": [("dep", (10**9, MX, MX)), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                swc_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [0, 0]),
                col_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, 123394, [0, 0])]},
    {"label": "a-wd-swc-col", "mode": "cb",
     "steps": [("wd", (10**9, 0, 0)), ("swc", ()), ("col", ())],
     "expect": [wd_after(P(VQ0, PF0, CF0, S_WD9), VOL_PRESENT, [0, 0]),
                swc_after(P(-2488, PF0, 0, S_WD9), VOL_PRESENT, [0, 0]),
                col_after(P(-2488, PF0, 0, S_WD9), VOL_PRESENT, 123394, [0, 0])]},
    {"label": "a-dep-wd-swc-col", "mode": "cb",
     "steps": [("dep", (10**9, MX, MX)), ("wd", (10**9, 0, 0)), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                wd_after(POOL_ASIS, VOL_PRESENT, [0, 0]),
                swc_after(P(-2488, PF0, 0), VOL_PRESENT, [0, 0]),
                col_after(P(-2488, PF0, 0), VOL_PRESENT, 123394, [0, 0])]},
    {"label": "a-dep-swp-colnoop", "mode": "cb",
     "steps": [("dep", (10**9, MX, MX)), ("swp", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                swp_after(P(-123394, 0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                E(-5000, {}, P(-123394, 0, CF0, S_DEP9), VOL_PRESENT, events=0, uva=[0, 0])]},
    {"label": "a-wd-swp-swc-col", "mode": "cb",
     "steps": [("wd", (10**9, 0, 0)), ("swp", ()), ("swc", ()), ("col", ())],
     "expect": [wd_after(P(VQ0, PF0, CF0, S_WD9), VOL_PRESENT, [0, 0]),
                swp_after(P(-123394, 0, CF0, S_WD9), VOL_PRESENT, [0, 0]),
                E(-5000, {"creatorata": 123394, "vaultquote": -123394},
                  P(0, 0, 0, S_WD9), VOL_PRESENT,
                  event=SWP_EV(123394, 1, CREATOR_VAULT), uva=[0, 0]),
                col_after(P(0, 0, 0, S_WD9), VOL_PRESENT, 123394, [0, 0])]},
    # Family B -- mayhem liquidity (volume absent, uva None)
    {"label": "b-dep-swc-col", "mode": "mayhem",
     "steps": [("dep", (10**9, MX, MX)), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), None),
                swc_after(P(-2488, PF0, 0, S_DEP9), None),
                col_after(P(-2488, PF0, 0, S_DEP9), None)]},
    {"label": "b-wd-swc-col", "mode": "mayhem",
     "steps": [("wd", (10**9, 0, 0)), ("swc", ()), ("col", ())],
     "expect": [wd_after(P(VQ0, PF0, CF0, S_WD9), None),
                swc_after(P(-2488, PF0, 0, S_WD9), None),
                col_after(P(-2488, PF0, 0, S_WD9), None)]},
    {"label": "b-dep-swp-fail-swc-col", "mode": "mayhem",
     "steps": [("dep", (10**9, MX, MX)), ("swp", ()), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), None),
                fail_after(P(VQ0, PF0, CF0, S_DEP9), None, "6013", None),
                swc_after(P(-2488, PF0, 0, S_DEP9), None),
                col_after(P(-2488, PF0, 0, S_DEP9), None)]},
    {"label": "b-wd-swp-fail-colnoop", "mode": "mayhem",
     "steps": [("wd", (10**9, 0, 0)), ("swp", ()), ("col", ())],
     "expect": [wd_after(P(VQ0, PF0, CF0, S_WD9), None),
                fail_after(P(VQ0, PF0, CF0, S_WD9), None, "6013", None),
                E(-5000, {}, P(VQ0, PF0, CF0, S_WD9), None, events=0)]},
    # Family C -- cashback v2 gates after liquidity
    {"label": "c-dep-buy-fail-swc-col", "mode": "cb",
     "steps": [("dep", (10**9, MX, MX)), ("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                fail_after(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, "6079", None, [0, 0]),
                swc_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [0, 0]),
                col_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, 123394, [0, 0])]},
    {"label": "c-wd-sell-fail-swc-col", "mode": "cb",
     "steps": [("wd", (10**9, 0, 0)), ("sell", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [wd_after(P(VQ0, PF0, CF0, S_WD9), VOL_PRESENT, [0, 0]),
                fail_after(P(VQ0, PF0, CF0, S_WD9), VOL_PRESENT, "6079", None, [0, 0]),
                swc_after(P(-2488, PF0, 0, S_WD9), VOL_PRESENT, [0, 0]),
                col_after(P(-2488, PF0, 0, S_WD9), VOL_PRESENT, 123394, [0, 0])]},
    {"label": "c-dep-exact-fail-swc-col", "mode": "cb",
     "steps": [("dep", (10**9, MX, MX)), ("exact", (10**7, 0)), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                fail_after(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, "6079", None, [0, 0]),
                swc_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [0, 0]),
                col_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, 123394, [0, 0])]},
    # Family D -- mayhem v2 trades into sweep/collect
    {"label": "d-buy-swc-col", "mode": "mayhem",
     "steps": [("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [E(-1849400, {"userbase": 10**10, "userquote": -1847796,
                             "vaultbase": -10**10, "vaultquote": 1847796, "buyback": 0},
                  P(-148330, 19461, 128869), VOL_FRESH,
                  event=BUY_EV(1824983, 365, 16973, 1825348, 1847796), uva=[0, 0]),
                E(-5000, {"creatorata": 128869, "vaultquote": -128869},
                  P(-19461, 19461, 0), VOL_FRESH,
                  event=SWP_EV(128869, 1, CREATOR_VAULT), uva=[0, 0]),
                E(-5000, {"creatorata": -128869, "dest": 128869},
                  P(-19461, 19461, 0), VOL_FRESH,
                  event=COL_EV(128869), uva=[0, 0])]},
    {"label": "d-dep-buy-swc-col", "mode": "mayhem",
     "steps": [("dep", (10**9, MX, MX)), ("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), None),
                E(-1849400, {"userbase": 10**10, "userquote": -1847796,
                             "vaultbase": -10**10, "vaultquote": 1847796, "buyback": 0},
                  P(-148330, 19461, 128869, S_DEP9), VOL_FRESH,
                  event=BUY_EV(1824983, 365, 16973, 1825348, 1847796), uva=[0, 0]),
                E(-5000, {"creatorata": 128869, "vaultquote": -128869},
                  P(-19461, 19461, 0, S_DEP9), VOL_FRESH,
                  event=SWP_EV(128869, 1, CREATOR_VAULT), uva=[0, 0]),
                E(-5000, {"creatorata": -128869, "dest": 128869},
                  P(-19461, 19461, 0, S_DEP9), VOL_FRESH,
                  event=COL_EV(128869), uva=[0, 0])]},
    {"label": "d-dep-sell-swc-col", "mode": "mayhem",
     "steps": [("dep", (10**9, MX, MX)), ("sell", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), None),
                E(-1849400, {"userbase": -10**10, "userquote": 1802115,
                             "vaultbase": 10**10, "vaultquote": -1802115, "buyback": 0},
                  P(-148329, 19460, 128869, S_DEP9), VOL_FRESH,
                  event=SELL_EV(1824927, 365, 16972, 1824562, 1802115), uva=[0, 0]),
                E(-5000, {"creatorata": 128869, "vaultquote": -128869},
                  P(-19460, 19460, 0, S_DEP9), VOL_FRESH,
                  event=SWP_EV(128869, 1, CREATOR_VAULT), uva=[0, 0]),
                E(-5000, {"creatorata": -128869, "dest": 128869},
                  P(-19460, 19460, 0, S_DEP9), VOL_FRESH,
                  event=COL_EV(128869), uva=[0, 0])]},
    {"label": "d-dep-buy-buy-swc-col", "mode": "mayhem",
     "steps": [("dep", (10**9, MX, MX)), ("buy", (10**10,)), ("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), None),
                E(-1849400, {"userbase": 10**10, "userquote": -1847796,
                             "vaultbase": -10**10, "vaultquote": 1847796, "buyback": 0},
                  P(-148330, 19461, 128869, S_DEP9), VOL_FRESH,
                  event=BUY_EV(1824983, 365, 16973, 1825348, 1847796), uva=[0, 0]),
                E(-5000, {"userbase": 10**10, "userquote": -1847852,
                          "vaultbase": -10**10, "vaultquote": 1847852, "buyback": 0},
                  P(-170779, 36434, 134345, S_DEP9), VOL_FRESH,
                  event=BUY_EV(1825037, 366, 16973, 1825403, 1847852), uva=[0, 0]),
                E(-5000, {"creatorata": 134345, "vaultquote": -134345},
                  P(-36434, 36434, 0, S_DEP9), VOL_FRESH,
                  event=SWP_EV(134345, 1, CREATOR_VAULT), uva=[0, 0]),
                E(-5000, {"creatorata": -134345, "dest": 134345},
                  P(-36434, 36434, 0, S_DEP9), VOL_FRESH,
                  event=COL_EV(134345), uva=[0, 0])]},
    # Family E -- cashback legacy trades after a deposit
    {"label": "e-dep-cbbuy-claim-swc-col", "mode": "cb",
     "steps": [("dep", (10**9, MX, MX)), ("cbbuy", (10**10, 10**12)), ("claim", ()), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                E(-5000, D_CBBUY, P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=CBBUY_EV(), events=None, uva=[5475, 0]),
                E(-5000, {"userquote": 5475, "uvata": -5475},
                  P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=CLAIM_EV(5475, 5475, 5475), uva=[5475, 5475]),
                swc_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [5475, 5475]),
                col_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, 123394, [5475, 5475])]},
    {"label": "e-cbbuy-dep-claim-swc-col", "mode": "cb",
     "steps": [("cbbuy", (10**10, 10**12)), ("dep", (10**9, MX, MX)), ("claim", ()), ("swc", ()), ("col", ())],
     "expect": [E(-5000, D_CBBUY, POOL_ASIS, VOL_PRESENT,
                  event=CBBUY_EV(), events=None, uva=[5475, 0]),
                E(-5000, D_DEP_AFTER_BUY, P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=DEP_EV(160617511066, 29312845), uva=[5475, 0]),
                E(-5000, {"userquote": 5475, "uvata": -5475},
                  P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=CLAIM_EV(5475, 5475, 5475), uva=[5475, 5475]),
                swc_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [5475, 5475]),
                col_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, 123394, [5475, 5475])]},
    {"label": "e-dep-cbsell-claim-swc-col", "mode": "cb",
     "steps": [("dep", (10**9, MX, MX)), ("cbsell", (10**9, 0)), ("claim", ()), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                E(-5000, D_CBSELL, P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=CBSELL_EV(), uva=[548, 0]),
                E(-5000, {"userquote": 548, "uvata": -548},
                  P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT,
                  event=CLAIM_EV(548, 548, 548), uva=[548, 548]),
                swc_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [548, 548]),
                col_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, 123394, [548, 548])]},
    # Family F -- both flags, and mayhem legacy sell after a deposit
    {"label": "f-dep-buy-fail-swc-col", "mode": "both",
     "steps": [("dep", (10**9, MX, MX)), ("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, [0, 0]),
                fail_after(P(VQ0, PF0, CF0, S_DEP9), VOL_PRESENT, "6079", None, [0, 0]),
                swc_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, [0, 0]),
                col_after(P(-2488, PF0, 0, S_DEP9), VOL_PRESENT, 123394, [0, 0])]},
    {"label": "f-dep-msell-fail-swc-col", "mode": "mayhem",
     "steps": [("dep", (10**9, MX, MX)), ("lsell", (10**9, 0)), ("swc", ()), ("col", ())],
     "expect": [dep_after(P(VQ0, PF0, CF0, S_DEP9), None),
                fail_after(P(VQ0, PF0, CF0, S_DEP9), None, "6013", None),
                swc_after(P(-2488, PF0, 0, S_DEP9), None),
                col_after(P(-2488, PF0, 0, S_DEP9), None)]},
]


def run_case(case, image_name, binary):
    h = setup_vm(binary, case["mode"])
    recs = []
    for (kind, args), exp in zip(case["steps"], case["expect"]):
        rec = do_step(h, kind, args)
        rec["step"] = kind
        check(lam_delta(rec, PAYER_KEY) == exp["dPAYER"],
              f"{case['label']}/{image_name}/{kind}: dPAYER {lam_delta(rec, PAYER_KEY)} != {exp['dPAYER']}")
        for role, want in exp["deltas"].items():
            got = tok_delta(rec, ROLE_KEY[role])
            check(got == want,
                  f"{case['label']}/{image_name}/{kind}: delta {role} {got} != {want}")
        if exp["pool_after"] is not None:
            got = pool_state(rec["after"][str(pool)])
            check(list(got) == exp["pool_after"],
                  f"{case['label']}/{image_name}/{kind}: pool {got} != {exp['pool_after']}")
        check(vol_state(rec["after"][str(volume)]) == exp["volume"],
              f"{case['label']}/{image_name}/{kind}: volume {vol_state(rec['after'][str(volume)])} != {exp['volume']}")
        check(uva_fields(rec["after"][str(volume)]) == exp["uva"],
              f"{case['label']}/{image_name}/{kind}: uva {uva_fields(rec['after'][str(volume)])} != {exp['uva']}")
        if exp["event"] is not None:
            got = decode_event(kind, rec)
            check(got == exp["event"],
                  f"{case['label']}/{image_name}/{kind}: event {got} != {exp['event']}")
        if exp["events"] is not None:
            check(len(rec["events"]) == exp["events"],
                  f"{case['label']}/{image_name}/{kind}: events {len(rec['events'])} != {exp['events']}")
        if exp["error"] is None:
            check(rec["error"] is None,
                  f"{case['label']}/{image_name}/{kind}: unexpected error {rec['error']}")
        else:
            check(rec["error"] is not None and exp["error"] in rec["error"],
                  f"{case['label']}/{image_name}/{kind}: error {rec['error']} lacks {exp['error']}")
            check(len(rec["events"]) == 0,
                  f"{case['label']}/{image_name}/{kind}: failed step emitted events")
            for k in WATCH:
                if k == PAYER_KEY:
                    continue
                check(rec["before"][str(k)] == rec["after"][str(k)],
                      f"{case['label']}/{image_name}/{kind}: failed step moved {k}")
            if exp["site_fragment"] is not None:
                check(rec["site"] is not None and exp["site_fragment"] in rec["site"],
                      f"{case['label']}/{image_name}/{kind}: site {rec['site']} lacks {exp['site_fragment']}")
        recs.append(rec)
    return recs


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
        report_cases.append({"label": case["label"], "mode": case["mode"],
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
