#!/usr/bin/env python3
"""Build research/amm-cashback-legacy-tf-chains-20261029 receipts.

3rd run packet #15: cashback legacy buy AND sell chained into
sweep -> collect -> claim under a quote transfer fee.

The gap: 3rd #13 chained the cashback sell through both pipes
without a fee, 3rd #14 chained the cashback buy through both
pipes without a fee, 3rd #02 pinned buy -> claim under tf100
only (no sweep/collect), and 2nd #47 pinned the cashback buy
accrual under tf only. Nobody chained the full cashback pipes
under a transfer fee. The question is sharp because the fee
withholds at every hop: the buy/sell creator leg is withheld
into the accumulator ATA, the sweep is withheld into the vault
ATA, the collect is withheld into DEST, and the claim itself
withholds into the user quote ATA -- so the two pipes no
longer conserve the non-cashback total, and the gaps are
pinned hop by hop.

Sharp results (all three images agree on every step):
- tf100 buy: spend 1,866,234 (grossed up from the nofee
  1,847,796); vault nets the nofee 1,825,348 while its
  lamports rise by the gross 1,843,786; proto nets 8,402
  (wh 85), buyback nets 8,401 (wh 85), uvata nets 5,420
  (wh 55) while earned rises by the gross 5,475. The buy
  event reports gross everywhere EXCEPT buyback_fee, which
  is net (8,401).
- tf100 buy -> sweep -> collect -> claim: sweep nets
  122,160 (wh 1,234, event gross 123,394); collect drains
  the 122,160 and DEST nets 120,938 (wh 1,222, event gross
  122,160) while the vault ATA keeps its 1,234 stranded;
  claim pays the uvata 5,420 and the user nets 5,365
  (wh 55), claimed 5,420 vs earned 5,475 -- gap 55, never
  closed. Pipe order does not matter: claim-first ends at
  the same DEST 120,938 + user +5,365.
- tf100 sell: user nets 178,409 of the gross 180,212
  (wh 1,803); proto/buyback net 840 each (wh 9), uvata nets
  542 (wh 6), earned rises by the gross 548; the sell event
  reports gross except buyback_fee net (840). Sell ->
  sweep -> collect -> claim ends DEST 120,938 + user
  +536 (claim pays 542, wh 6), claimed 542 vs earned 548.
- tf5000 buy chain: spend 3,673,144; vault nets 1,825,348
  (wh 1,825,348); proto/buyback net 4,243 each; uvata nets
  2,737 (wh 2,738), earned 5,475; sweep nets 61,697
  (wh 61,697); collect DEST nets 30,848 (wh 30,849);
  claim user nets 1,368 (wh 1,369), claimed 2,737 vs
  earned 5,475 -- gap 2,738.
- tf100 buy -> buy -> claim: second buy spends 1,866,291
  (curve moved), uvata 5,420 -> 10,841 (wh 110), earned
  10,951; claim pays the full 10,841, user nets 10,732
  (wh 109), gap 110.
- tf100 buy_exact cashback: spend 9,998,786 (LESS than the
  nofee 10,000,000); out falls to 53,573,907,921; vault nets
  9,779,732 (wh 98,786); proto/buyback net 45,012 each
  (wh 455); uvata nets 29,040 (wh 294), earned 29,334.
- tf100 fresh buy: payer -4,007,000 (fee 5,000 + volume
  rent 1,844,400 + 182-byte uvata rent 2,157,600); uvata
  lamports 2,163,075 = rent + gross 5,475, and the claim
  leaves uvata lamports unchanged (unlike the nofee claim,
  which restores rent).
- Limit sides under tf100 on a cashback pool: buy limit is
  gross-spend-side (1,866,234 success, 1,866,233 -> 6004,
  nofee 1,847,796 -> 6004); sell limit is net-side
  (178,409 success, 178,410 -> 6004, gross 180,212 -> 6004).

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
from pump_amm_trade_v2_differential import FEES, feeconfig, volume

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-cashback-legacy-tf-chains-20261029"
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


def ata22(owner):
    return Pubkey.find_program_address([bytes(owner), bytes(TOKEN22), bytes(quote)], ATA_PROG)[0]


GVOL = Pubkey.find_program_address([b'global_volume_accumulator'], PROGRAM)[0]
GDISC = bytes(next(x for x in IDL['accounts'] if x['name'] == 'GlobalVolumeAccumulator')['discriminator'])
UVA_DISC = bytes(next(x for x in IDL['accounts'] if x['name'] == 'UserVolumeAccumulator')['discriminator'])
POOLV2 = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)[0]
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
PROTO22 = ata22(PROTOCOL)
CREAT22 = ata22(CREATOR_VAULT)
BB22 = ata22(BB_OWNER)
UVA22 = ata22(volume)
DEST22 = ata22(CREATOR)


def t22acct(owner, amount, withheld=0):
    data = bytearray(165)
    data[0:32] = bytes(quote)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) + struct.pack("<HHQ", 2, 8, withheld)
MX = 2**64 - 1
VQ0, PF0, CF0 = -125882, 2488, 123394
S_ASIS = 4194352106721

SWP_KEYS_P = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, PROTOCOL, PROTO22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_C = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, CREATOR_VAULT, CREAT22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
COL_KEYS = [quote, TOKEN22, CREATOR, CREATOR_VAULT, CREAT22, DEST22, EVENT, PROGRAM]
CLAIM_KEYS = [PAYER_KEY, volume, quote, TOKEN22, UVA22, userquote, Pubkey.default(), EVENT, PROGRAM]
LEG_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote, vaultbase, vaultquote,
            PROTOCOL, PROTO22, TOKEN, TOKEN22, Pubkey.default(), ATA_PROG, EVENT, PROGRAM,
            CREAT22, CREATOR_VAULT, feeconfig, FEES]
LEG_CB_REM = [AccountMeta(UVA22, False, True), AccountMeta(volume, False, True),
              AccountMeta(POOLV2, False, False), AccountMeta(BB_OWNER, False, False),
              AccountMeta(BB22, False, True)]
BUY_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote, vaultbase, vaultquote,
            PROTOCOL, PROTO22, TOKEN, TOKEN22, Pubkey.default(), ATA_PROG, EVENT, PROGRAM,
            CREAT22, CREATOR_VAULT, GVOL, volume, feeconfig, FEES]
BUY_REM_CB = [AccountMeta(UVA22, False, True), AccountMeta(POOLV2, False, False),
              AccountMeta(BB_OWNER, False, False), AccountMeta(BB22, False, True)]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, volume, feeconfig, CONFIG_KEY,
         PROTO22, CREAT22, BB22, DEST22, UVA22, GVOL]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote,
            "protoata": PROTO22, "creatorata": CREAT22, "bbata": BB22,
            "dest": DEST22, "uvata": UVA22}
SWP_DISC = "82a42461e48287a5"
SELL_DISC = "3e2f370aa503dc2a"
COL_DISC = "e8f5c2eeeada3a59"
CLAIM_DISC = hashlib.sha256(b"event:ClaimCashbackEvent").digest()[:8].hex()


def sha(data):
    return hashlib.sha256(data).hexdigest()


def setup_vm(binary, mode):
    # mode: "tf100" | "tf100-fresh" | "tf5000" -- all cashback pools (byte 244 = 1)
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
    pd[244] = 1
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
    bps = 5000 if mode == "tf5000" else 100
    transferfee(quote, bps, MX)(h, [])
    vm.set_account(PROTO22, Account(2157600, t22acct(PROTOCOL, 0), TOKEN22))
    vm.set_account(CREAT22, Account(2157600, t22acct(CREATOR_VAULT, 0), TOKEN22))
    vm.set_account(BB22, Account(2157600, t22acct(BB_OWNER, 0), TOKEN22))
    vm.set_account(DEST22, Account(2157600, t22acct(CREATOR, 0), TOKEN22))
    if mode == "tf100-fresh":
        vm.set_account(volume, Account(0, b"", Pubkey.default()))
        vm.set_account(UVA22, Account(0, b"", Pubkey.default()))
    else:
        vm.set_account(volume, Account(10**9, UVA_DISC + bytes(PAYER_KEY) + bytes(97), PROGRAM))
        vm.set_account(UVA22, Account(2157600, t22acct(volume, 0), TOKEN22))
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


def uva_fields(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    return {"earned": struct.unpack_from("<Q", raw, 74)[0],
            "claimed": struct.unpack_from("<Q", raw, 82)[0]}


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
    if kind == "lsell":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_bps": u64(raw, 72),
                "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
                "proto_fee": u64(raw, 96), "quote": u64(raw, 104),
                "uout": u64(raw, 112)}
    if kind == "cbsell":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_fee": u64(raw, 80),
                "protocol_fee": u64(raw, 96), "quote": u64(raw, 104),
                "user_out": u64(raw, 112),
                "creator_bps": u64(raw, 344), "creator_fee": u64(raw, 352),
                "cashback_bps": u64(raw, 360), "cashback": u64(raw, 368),
                "buyback_fee": u64(raw, 384)}
    if kind in ("buy", "exact"):
        ev = {"disc": raw[:8].hex(), "len": len(raw),
              "out": u64(raw, 16), "max": u64(raw, 24),
              "curve": u64(raw, 64), "lp_bps": u64(raw, 72),
              "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
              "proto_fee": u64(raw, 96), "quote": u64(raw, 104),
              "uout": u64(raw, 112),
              "creator_bps": u64(raw, 344), "creator_fee": u64(raw, 352),
              "track": raw[360]}
        if len(raw) == 497:
            ev.update({"cb_bps": u64(raw, 408), "cb": u64(raw, 416),
                       "bb_bps": u64(raw, 424), "bb": u64(raw, 432)})
        else:
            ev.update({"cb_bps": u64(raw, 423), "cb": u64(raw, 431),
                       "bb_bps": u64(raw, 439), "bb": u64(raw, 447)})
        return ev
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
    if kind == "claim":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "user": raw[8:40].hex(), "amount": u64(raw, 40),
                "ts": struct.unpack_from("<q", raw, 48)[0],
                "total_claimed": u64(raw, 56), "total_earned": u64(raw, 64)}
    return None


def check(cond, msg):
    if not cond:
        raise AssertionError(msg)


def disc(name):
    return bytes(next(x for x in IDL["instructions"] if x["name"] == name)["discriminator"])


def do_step(h, kind, args):
    if kind == "swp":
        name, keys, data, rem = "sweep_protocol_fee", SWP_KEYS_P, disc("sweep_protocol_fee"), []
    elif kind == "swc":
        name, keys, data, rem = "sweep_creator_fee", SWP_KEYS_C, disc("sweep_creator_fee"), []
    elif kind == "col":
        name, keys, data, rem = "collect_coin_creator_fee", COL_KEYS, disc("collect_coin_creator_fee"), []
    elif kind == "claim":
        name, keys, data, rem = "claim_cashback", CLAIM_KEYS, disc("claim_cashback"), []
    elif kind == "cbsell":
        name, keys, data, rem = "sell", LEG_KEYS, disc("sell") + struct.pack("<QQ", args[0], args[1] if len(args) > 1 else 0), LEG_CB_REM
    elif kind == "cbbuy":
        name, keys, data, rem = "buy", BUY_KEYS, disc("buy") + struct.pack("<QQ", args[0], args[1]) + b"\0", BUY_REM_CB
    elif kind == "cbexact":
        name, keys, data, rem = "buy_exact_quote_in", BUY_KEYS, disc("buy_exact_quote_in") + struct.pack("<QQ", args[0], args[1]) + b"\0", BUY_REM_CB
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
      uva=None, withheld=None):
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after),
            "volume": volume, "event": event, "events": events, "error": error,
            "rollback": rollback, "site_fragment": site_fragment,
            "log_fragment": log_fragment, "absent": absent or [],
            "lam_after": lam_after or {}, "uva": uva,
            "withheld": withheld or {}}


def P(vq, pf, cf, sup=S_ASIS):
    return [vq, pf, cf, sup]


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


def CLAIM_EV(amount, claimed, earned):
    return {"disc": CLAIM_DISC, "len": 72, "user": bytes(PAYER_KEY).hex(),
            "amount": amount, "ts": 1234567890,
            "total_claimed": claimed, "total_earned": earned}


def COL_EV(fee):
    return {"disc": COL_DISC, "len": 120, "timestamp": 1234567890,
            "creator": bytes(CREATOR).hex(), "fee": fee,
            "vault_ata": bytes(CREAT22).hex(), "dest": bytes(DEST22).hex()}


def CBSELL_EV(curve, lp_fee, proto_fee, quote, uout, cashback, bb=840):
    return {"disc": SELL_DISC, "len": 449, "curve": curve, "lp_fee": lp_fee,
            "protocol_fee": proto_fee, "quote": quote, "user_out": uout,
            "creator_bps": 0, "creator_fee": 0, "cashback_bps": 30,
            "cashback": cashback, "buyback_fee": bb}


POOL_ASIS = P(VQ0, PF0, CF0)
POOL_SWC = P(-2488, PF0, 0)
POOL_SWP = P(-123394, 0, CF0)
POOL_BOTH = P(0, 0, 0)
VOL_PRESENT = {"lamports": 10**9, "len": 137, "user": bytes(PAYER_KEY).hex()}
VOL_FRESH = {"lamports": 1844400, "len": 137, "user": bytes(PAYER_KEY).hex()}


def swc_after(pool_after, volume, uva, rate):
    if rate == "100":
        return E(-5000, {"creatorata": 122160, "vaultquote": -123394},
                 pool_after, volume, event=SWP_EV(123394, 1, CREATOR_VAULT),
                 withheld={"creatorata": 1234}, lam_after={"creatorata": 2280994}, uva=uva)
    return E(-5000, {"creatorata": 61697, "vaultquote": -123394},
             pool_after, volume, event=SWP_EV(123394, 1, CREATOR_VAULT),
             withheld={"creatorata": 61697}, lam_after={"creatorata": 2280994}, uva=uva)


def col_after(pool_after, volume, uva, rate):
    if rate == "100":
        return E(-5000, {"creatorata": -122160, "dest": 120938},
                 pool_after, volume, event=COL_EV(122160),
                 withheld={"creatorata": 1234, "dest": 1222}, uva=uva)
    return E(-5000, {"creatorata": -61697, "dest": 30848},
             pool_after, volume, event=COL_EV(61697),
             withheld={"creatorata": 61697, "dest": 30849}, uva=uva)


def BUY_EV_TF(curve, lp_fee, proto_fee, qwlp, uqin, cb, bb, maxv, length=497, out=10**10):
    return {"disc": "67f4521f2cf57777", "len": length, "out": out, "max": maxv,
            "curve": curve, "lp_bps": 2, "lp_fee": lp_fee,
            "proto_bps": 93, "proto_fee": proto_fee, "quote": qwlp,
            "uout": uqin, "creator_bps": 0, "creator_fee": 0,
            "track": 0, "cb_bps": 30, "cb": cb, "bb_bps": 5000, "bb": bb}


# --- tf100 buy ---
D_TFBUY100 = {"userbase": 10**10, "userquote": -1866234,
              "vaultbase": -10**10, "vaultquote": 1825348,
              "protoata": 8402, "bbata": 8401, "uvata": 5420}
WH_TFBUY100 = {"vaultquote": 18438, "protoata": 85, "bbata": 85, "uvata": 55, "userquote": 0}
LAM_TFBUY100 = {"uvata": 2163075, "protoata": 2166087, "bbata": 2166086,
                "vaultquote": 122950573788}
EV_TFBUY100 = BUY_EV_TF(1824983, 365, 16973, 1825348, 1847796, 5475, 8401, 10**12)
EV_TFBUY100_LIMEXACT = BUY_EV_TF(1824983, 365, 16973, 1825348, 1847796, 5475, 8401, 1866234)
# --- tf5000 buy ---
D_TFBUY5000 = {"userbase": 10**10, "userquote": -3673144,
               "vaultbase": -10**10, "vaultquote": 1825348,
               "protoata": 4243, "bbata": 4243, "uvata": 2737}
WH_TFBUY5000 = {"vaultquote": 1825348, "protoata": 4244, "bbata": 4243, "uvata": 2738, "userquote": 0}
LAM_TFBUY5000 = {"uvata": 2163075, "protoata": 2166087, "bbata": 2166086,
                 "vaultquote": 122952380698}
EV_TFBUY5000 = BUY_EV_TF(1824983, 365, 16973, 1825348, 1847796, 5475, 4243, 10**12)
# --- tf100 second buy (curve moved) ---
D_TFBUY100_2ND = {"userbase": 10**10, "userquote": -1866291,
                  "vaultbase": -10**10, "vaultquote": 1825403,
                  "protoata": 8402, "bbata": 8401, "uvata": 5421}
WH_TFBUY100_2ND = {"vaultquote": 36877, "protoata": 170, "bbata": 170, "uvata": 110, "userquote": 0}
LAM_TFBUY100_2ND = {"uvata": 2168551, "protoata": 2174574, "bbata": 2174572}
EV_TFBUY100_2ND = BUY_EV_TF(1825037, 366, 16973, 1825403, 1847852, 5476, 8401, 10**12)
# --- tf100 buy_exact ---
D_TFEXACT100 = {"userbase": 53573907921, "userquote": -9998786,
                "vaultbase": -53573907921, "vaultquote": 9779732,
                "protoata": 45012, "bbata": 45012, "uvata": 29040}
WH_TFEXACT100 = {"vaultquote": 98786, "protoata": 455, "bbata": 455, "uvata": 294, "userquote": 0}
LAM_TFEXACT100 = {"uvata": 2186934, "protoata": 2203067, "bbata": 2203067}
EV_TFEXACT100 = BUY_EV_TF(10000000, 1956, 90934, 9779732, 9777776, 29334, 45012, 10000000,
                         length=512, out=53573907921)
# --- tf100 sell ---
D_TFSELL100 = {"userbase": -10**9, "userquote": 178409,
               "vaultbase": 10**9, "vaultquote": -182458,
               "protoata": 840, "bbata": 840, "uvata": 542}
WH_TFSELL100 = {"userquote": 1803, "protoata": 9, "bbata": 9, "uvata": 6, "vaultquote": 0}
LAM_TFSELL100 = {"uvata": 2158148, "protoata": 2158449, "bbata": 2158449}
EV_TFSELL100 = CBSELL_EV(182495, 37, 1698, 182458, 180212, 548, bb=840)

UVA_BUY100 = {"earned": 5475, "claimed": 0}
UVA_BUY5000 = {"earned": 5475, "claimed": 0}
UVA_BUYBUY100 = {"earned": 10951, "claimed": 0}
UVA_EXACT100 = {"earned": 29334, "claimed": 0}
UVA_SELL100 = {"earned": 548, "claimed": 0}
UVA_ZERO = {"earned": 0, "claimed": 0}


def buy_step(deltas, withheld, lam_after, event, volume, uva):
    return E(-5000, deltas, POOL_ASIS, volume, event=event,
             lam_after=lam_after, uva=uva, withheld=withheld)


def claim_step(deltas, event, pool_after, volume, uva, withheld, lam_after):
    return E(-5000, deltas, pool_after, volume, event=event,
             withheld=withheld, lam_after=lam_after, uva=uva)


CASES = [
    # Family B -- tf100 buy chains (seeded accumulator)
    {"label": "b-buy-tf100", "mode": "tf100",
     "steps": [("cbbuy", (10**10, 10**12))],
     "expect": [buy_step(D_TFBUY100, WH_TFBUY100, LAM_TFBUY100, EV_TFBUY100,
                         VOL_PRESENT, UVA_BUY100)]},
    {"label": "b-buy-collect-noop-tf100", "mode": "tf100",
     "steps": [("cbbuy", (10**10, 10**12)), ("col", ())],
     "expect": [buy_step(D_TFBUY100, WH_TFBUY100, LAM_TFBUY100, EV_TFBUY100,
                         VOL_PRESENT, UVA_BUY100),
                E(-5000, {"creatorata": 0, "dest": 0}, POOL_ASIS, VOL_PRESENT,
                  events=0, uva=UVA_BUY100, withheld={"creatorata": 0, "dest": 0})]},
    {"label": "b-buy-sweep-collect-claim-tf100", "mode": "tf100",
     "steps": [("cbbuy", (10**10, 10**12)), ("swc", ()), ("col", ()), ("claim", ())],
     "expect": [buy_step(D_TFBUY100, WH_TFBUY100, LAM_TFBUY100, EV_TFBUY100,
                         VOL_PRESENT, UVA_BUY100),
                swc_after(POOL_SWC, VOL_PRESENT, UVA_BUY100, "100"),
                col_after(POOL_SWC, VOL_PRESENT, UVA_BUY100, "100"),
                claim_step({"uvata": -5420, "userquote": 5365},
                           CLAIM_EV(5420, 5420, 5475), POOL_SWC, VOL_PRESENT,
                           {"earned": 5475, "claimed": 5420},
                           {"userquote": 55, "uvata": 55}, {"uvata": 2163075})]},
    {"label": "b-buy-claim-sweep-collect-tf100", "mode": "tf100",
     "steps": [("cbbuy", (10**10, 10**12)), ("claim", ()), ("swc", ()), ("col", ())],
     "expect": [buy_step(D_TFBUY100, WH_TFBUY100, LAM_TFBUY100, EV_TFBUY100,
                         VOL_PRESENT, UVA_BUY100),
                claim_step({"uvata": -5420, "userquote": 5365},
                           CLAIM_EV(5420, 5420, 5475), POOL_ASIS, VOL_PRESENT,
                           {"earned": 5475, "claimed": 5420},
                           {"userquote": 55, "uvata": 55}, {"uvata": 2163075}),
                swc_after(POOL_SWC, VOL_PRESENT, {"earned": 5475, "claimed": 5420}, "100"),
                col_after(POOL_SWC, VOL_PRESENT, {"earned": 5475, "claimed": 5420}, "100")]},
    {"label": "b-buy-buy-claim-tf100", "mode": "tf100",
     "steps": [("cbbuy", (10**10, 10**12)), ("cbbuy", (10**10, 10**12)), ("claim", ())],
     "expect": [buy_step(D_TFBUY100, WH_TFBUY100, LAM_TFBUY100, EV_TFBUY100,
                         VOL_PRESENT, UVA_BUY100),
                buy_step(D_TFBUY100_2ND, WH_TFBUY100_2ND, LAM_TFBUY100_2ND, EV_TFBUY100_2ND,
                         VOL_PRESENT, UVA_BUYBUY100),
                claim_step({"uvata": -10841, "userquote": 10732},
                           CLAIM_EV(10841, 10841, 10951), POOL_ASIS, VOL_PRESENT,
                           {"earned": 10951, "claimed": 10841},
                           {"userquote": 109, "uvata": 110}, {"uvata": 2168551})]},
    {"label": "b-buy-fresh-chain-tf100", "mode": "tf100-fresh",
     "steps": [("cbbuy", (10**10, 10**12)), ("swc", ()), ("col", ()), ("claim", ())],
     "expect": [E(-4007000, D_TFBUY100, POOL_ASIS, VOL_FRESH, event=EV_TFBUY100,
                  lam_after=LAM_TFBUY100, uva=UVA_BUY100, withheld=WH_TFBUY100),
                swc_after(POOL_SWC, VOL_FRESH, UVA_BUY100, "100"),
                col_after(POOL_SWC, VOL_FRESH, UVA_BUY100, "100"),
                claim_step({"uvata": -5420, "userquote": 5365},
                           CLAIM_EV(5420, 5420, 5475), POOL_SWC, VOL_FRESH,
                           {"earned": 5475, "claimed": 5420},
                           {"userquote": 55, "uvata": 55}, {"uvata": 2163075})]},
    {"label": "b-buyexact-sweep-collect-claim-tf100", "mode": "tf100",
     "steps": [("cbexact", (10**7, 1)), ("swc", ()), ("col", ()), ("claim", ())],
     "expect": [buy_step(D_TFEXACT100, WH_TFEXACT100, LAM_TFEXACT100, EV_TFEXACT100,
                         VOL_PRESENT, UVA_EXACT100),
                swc_after(POOL_SWC, VOL_PRESENT, UVA_EXACT100, "100"),
                col_after(POOL_SWC, VOL_PRESENT, UVA_EXACT100, "100"),
                claim_step({"uvata": -29040, "userquote": 28749},
                           CLAIM_EV(29040, 29040, 29334), POOL_SWC, VOL_PRESENT,
                           {"earned": 29334, "claimed": 29040},
                           {"userquote": 291, "uvata": 294}, {"uvata": 2186934})]},
    # Family S -- tf100 sell chains (seeded accumulator)
    {"label": "s-sell-tf100", "mode": "tf100",
     "steps": [("cbsell", (10**9, 0))],
     "expect": [E(-5000, D_TFSELL100, POOL_ASIS, VOL_PRESENT, event=EV_TFSELL100,
                  lam_after=LAM_TFSELL100, uva=UVA_SELL100, withheld=WH_TFSELL100)]},
    {"label": "s-sell-collect-noop-tf100", "mode": "tf100",
     "steps": [("cbsell", (10**9, 0)), ("col", ())],
     "expect": [E(-5000, D_TFSELL100, POOL_ASIS, VOL_PRESENT, event=EV_TFSELL100,
                  lam_after=LAM_TFSELL100, uva=UVA_SELL100, withheld=WH_TFSELL100),
                E(-5000, {"creatorata": 0, "dest": 0}, POOL_ASIS, VOL_PRESENT,
                  events=0, uva=UVA_SELL100, withheld={"creatorata": 0, "dest": 0})]},
    {"label": "s-sell-sweep-collect-claim-tf100", "mode": "tf100",
     "steps": [("cbsell", (10**9, 0)), ("swc", ()), ("col", ()), ("claim", ())],
     "expect": [E(-5000, D_TFSELL100, POOL_ASIS, VOL_PRESENT, event=EV_TFSELL100,
                  lam_after=LAM_TFSELL100, uva=UVA_SELL100, withheld=WH_TFSELL100),
                swc_after(POOL_SWC, VOL_PRESENT, UVA_SELL100, "100"),
                col_after(POOL_SWC, VOL_PRESENT, UVA_SELL100, "100"),
                claim_step({"uvata": -542, "userquote": 536},
                           CLAIM_EV(542, 542, 548), POOL_SWC, VOL_PRESENT,
                           {"earned": 548, "claimed": 542},
                           {"userquote": 1809, "uvata": 6}, {"uvata": 2158148})]},
    {"label": "s-sell-claim-tf100", "mode": "tf100",
     "steps": [("cbsell", (10**9, 0)), ("claim", ())],
     "expect": [E(-5000, D_TFSELL100, POOL_ASIS, VOL_PRESENT, event=EV_TFSELL100,
                  lam_after=LAM_TFSELL100, uva=UVA_SELL100, withheld=WH_TFSELL100),
                claim_step({"uvata": -542, "userquote": 536},
                           CLAIM_EV(542, 542, 548), POOL_ASIS, VOL_PRESENT,
                           {"earned": 548, "claimed": 542},
                           {"userquote": 1809, "uvata": 6}, {"uvata": 2158148})]},
    # Family F -- tf5000 buy chain
    {"label": "f-buy-sweep-collect-claim-tf5000", "mode": "tf5000",
     "steps": [("cbbuy", (10**10, 10**12)), ("swc", ()), ("col", ()), ("claim", ())],
     "expect": [buy_step(D_TFBUY5000, WH_TFBUY5000, LAM_TFBUY5000, EV_TFBUY5000,
                         VOL_PRESENT, UVA_BUY5000),
                swc_after(POOL_SWC, VOL_PRESENT, UVA_BUY5000, "5000"),
                col_after(POOL_SWC, VOL_PRESENT, UVA_BUY5000, "5000"),
                claim_step({"uvata": -2737, "userquote": 1368},
                           CLAIM_EV(2737, 2737, 5475), POOL_SWC, VOL_PRESENT,
                           {"earned": 5475, "claimed": 2737},
                           {"userquote": 1369, "uvata": 2738}, {"uvata": 2163075})]},
    # Family L -- limit gates under tf100 on a cashback pool
    {"label": "l-buy-limit-gross-tf100", "mode": "tf100",
     "steps": [("cbbuy", (10**10, 1866234))],
     "expect": [buy_step(D_TFBUY100, WH_TFBUY100, LAM_TFBUY100, EV_TFBUY100_LIMEXACT,
                         VOL_PRESENT, UVA_BUY100)]},
    {"label": "l-buy-limit-minus1-tf100", "mode": "tf100",
     "steps": [("cbbuy", (10**10, 1866233))],
     "expect": [E(-5000, {}, POOL_ASIS, VOL_PRESENT, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage", uva=UVA_ZERO)]},
    {"label": "l-buy-limit-nofee-tf100", "mode": "tf100",
     "steps": [("cbbuy", (10**10, 1847796))],
     "expect": [E(-5000, {}, POOL_ASIS, VOL_PRESENT, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage", uva=UVA_ZERO)]},
    {"label": "l-sell-limit-net-tf100", "mode": "tf100",
     "steps": [("cbsell", (10**9, 178409))],
     "expect": [E(-5000, D_TFSELL100, POOL_ASIS, VOL_PRESENT, event=EV_TFSELL100,
                  lam_after=LAM_TFSELL100, uva=UVA_SELL100, withheld=WH_TFSELL100)]},
    {"label": "l-sell-limit-plus1-tf100", "mode": "tf100",
     "steps": [("cbsell", (10**9, 178410))],
     "expect": [E(-5000, {}, POOL_ASIS, VOL_PRESENT, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage", uva=UVA_ZERO)]},
    {"label": "l-sell-limit-gross-tf100", "mode": "tf100",
     "steps": [("cbsell", (10**9, 180212))],
     "expect": [E(-5000, {}, POOL_ASIS, VOL_PRESENT, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage", uva=UVA_ZERO)]},
]


STEP_KIND = {"swp": "swp", "swc": "swc", "col": "col", "claim": "claim",
             "cbbuy": "buy", "cbexact": "exact", "cbsell": "cbsell"}


def run_case(case, image_name, binary):
    h = setup_vm(binary, case["mode"])
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
        for role, want in exp["withheld"].items():
            got = tok_withheld(rec["after"][str(ROLE_KEY[role])])
            check(got == want,
                  f"{tag}: withheld {role} {got} != {want}")
        for role in exp["absent"]:
            check(rec["after"][str(ROLE_KEY[role])] is None,
                  f"{tag}: {role} should stay absent")
        got_pool = pool_state(rec["after"][str(pool)])
        check(list(got_pool) == exp["pool_after"],
              f"{tag}: pool {got_pool} != {exp['pool_after']}")
        got_vol = vol_state(rec["after"][str(volume)])
        check(got_vol == exp["volume"], f"{tag}: volume {got_vol} != {exp['volume']}")
        if exp.get("uva") is not None:
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
        report_cases.append({"label": case["label"], "variant": case["mode"],
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
