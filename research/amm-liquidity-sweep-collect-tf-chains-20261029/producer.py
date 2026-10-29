#!/usr/bin/env python3
"""Build research/amm-liquidity-sweep-collect-tf-chains-20261029 receipts.

3rd run packet #19: liquidity -> sweep -> collect UNDER a quote
transfer fee. 3rd #18 chained liquidity-first sweep/collect without
a fee, and 3rd #5/#8/#11 pinned sweep/collect/trade legs under tf
separately, but nobody chained deposit/withdraw INTO sweep ->
collect under tf. The question is sharp because the fee withholds
at every hop: the deposit grosses up, the withdraw nets down, the
sweep nets down again, and the collect nets down a third time --
while the pool buckets themselves accrue the same gross fee
accounting as the nofee chain, and the events keep reporting
pre-tf legs.

Sharp results (all three images agree on every step):
- Deposit under tf100 grosses up the quote leg only: dep-1e9
  spends 29,608,495 gross for a 29,312,410 net vault receipt
  (vault withheld 296,085); the base leg is fee-blind. Under
  tf5000 the same deposit spends 58,624,820 for the same net
  (withheld 29,312,410). Deposit events report the NET vault
  receipt (29,312,410), not the gross spend.
- Withdraw under tf100 nets down: wd-1e9 pays 29,019,284 net of
  the 29,312,409 gross send (user withheld 293,125); tf5000 pays
  14,656,204 (withheld 14,656,205). Withdraw events report the
  GROSS vault send (29,312,409) -- the opposite side from the
  deposit event.
- Liquidity accrues nothing under tf either: dep/wd -> sweep
  moves exactly the 123,394 seed, netted to 122,160 at tf100
  (withheld 1,234) and 61,697 at tf5000 (withheld 61,697); the
  collect nets down again to 120,938 (withheld 1,222) and
  30,848 (withheld 30,849). The first hop's withheld stays
  stranded in the vault ATA after the collect drains it to 0.
- A tf trade's accrual survives a tf deposit/withdraw untouched:
  buy-tf100 -> dep-tf100 -> sweep moves the full 128,869 bucket
  (net 127,580, withheld 1,289) and the collect drains 126,304
  (withheld 1,276). The intervening dep leg itself grosses up
  off the post-trade available reserves (dep after buy: net
  29,312,845, gross 29,608,935; dep after sell: net 29,311,975,
  gross 29,608,056) -- exactly the nofee legs, grossed up.
- Proportional tf liquidity is invisible to the tf trade:
  dep-tf100 -> buy-tf100 and wd-tf100 -> buy-tf100 settle with
  the fresh tf buy legs (spend 1,866,375, vault net 1,839,310,
  buyback net 8,401) and the same pool buckets.
- The buyback leg is transferred at face, never grossed up
  (3rd #9): buyback fee 8,486 nets 8,401 at tf100 (withheld 85)
  while the vault leg grosses up to deliver its constant net.
- Limit sides under tf, chained into sweep: a dep capped at the
  net spend (29,312,410) fails 6004 (gross-side), a wd floored
  at the gross send (29,312,409) fails 6004 (net-side); both
  roll back fully and the following sweep still moves only the
  seed. A second collect after a full drain is a silent no-op.
- Protocol bucket under tf: buy -> dep -> protocol sweep nets
  10,865 of the 10,975 bucket (withheld 110) and the following
  collect drains only the creator 127,580 -> 126,304; the
  protocol net stays stranded in the protocol ATA.
- Harness note: the Token-2022 buyback ATA is seeded at setup,
  not by the trade_transferfee full override on the first trade:
  that override rebuilds the quote accounts from 165 bytes and
  zeroes their withheld extension, which would erase a prior
  dep/wd step's withheld. Trade steps here use only the light
  meta adjustment, so withheld accounting is exact across
  every chain.

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
    base, f, lp, pool, poolraw, quote, supply, token, transferfee,
    userbase, userlp, userquote, vaultbase, vaultquote,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, volume

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-liquidity-sweep-collect-tf-chains-20261029"
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
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTO22, CREAT22, DEST22, BB22]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTO22, "creatorata": CREAT22, "dest": DEST22, "bbata": BB22}
DEP_DISC = "78f83d531f8e6b90"
WD_DISC = "1609851aa02c47c0"
SWP_DISC = "82a42461e48287a5"
COL_DISC = "e8f5c2eeeada3a59"
BUY_DISC = "67f4521f2cf57777"
SELL_DISC = "3e2f370aa503dc2a"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def t22acct(owner, amount, withheld=0):
    data = bytearray(165)
    data[0:32] = bytes(quote)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) + struct.pack("<HHQ", 2, 8, withheld)


def setup_vm(binary, bps):
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
    transferfee(quote, bps, MX)(h, [])
    vm.set_account(PROTO22, Account(RENT22, t22acct(PROTOCOL, 0), TOKEN22))
    vm.set_account(CREAT22, Account(RENT22, t22acct(CREATOR_VAULT, 0), TOKEN22))
    vm.set_account(DEST22, Account(RENT22, t22acct(CREATOR, 0), TOKEN22))
    # Seed the Token-2022 buyback ATA here, at setup, instead of via
    # trade_transferfee on the first trade step: the full override
    # rebuilds the quote accounts from their first 165 bytes and
    # zeroes their withheld extension, which would destroy the
    # withheld a prior dep/wd step accumulated. Seeding BB22 up
    # front lets trade steps use only the light meta adjustment
    # (token program -> TOKEN22, buyback ATA -> BB22) and keeps
    # withheld accounting exact across the whole chain.
    vm.set_account(BB22, Account(RENT22, t22acct(BB_OWNER, 0), TOKEN22))
    h._bps = bps
    h._v2done = False
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
        name, keys, data = "deposit", DEP_KEYS, disc("deposit") + struct.pack("<QQQ", *args)
    elif kind == "wd":
        name, keys, data = "withdraw", DEP_KEYS, disc("withdraw") + struct.pack("<QQQ", *args)
    elif kind == "buy":
        name, keys = "buy_v2", V2_KEYS
        data = disc("buy_v2") + struct.pack("<QQ", args[0], MX)
    elif kind == "sell":
        name, keys = "sell_v2", V2_KEYS
        data = disc("sell_v2") + struct.pack("<QQ", args[0], 0)
    elif kind == "swp":
        name, keys, data = "sweep_protocol_fee", SWP_KEYS_P, disc("sweep_protocol_fee")
    elif kind == "swc":
        name, keys, data = "sweep_creator_fee", SWP_KEYS_C, disc("sweep_creator_fee")
    elif kind == "col":
        name, keys, data = "collect_coin_creator_fee", COL_KEYS, disc("collect_coin_creator_fee")
    else:
        raise ValueError(kind)
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    if kind in ("buy", "sell"):
        # Light override only: the quote mint/accounts were already
        # converted at setup and BB22 was seeded there (see
        # setup_vm). The full trade_transferfee override would
        # rebuild vaultquote/userquote and zero their withheld.
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


def E(dPAYER, deltas, pool_after, volume, event=None, events=1, error=None,
      rollback=False, wh_after=None, lam_deltas=None):
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after),
            "volume": volume, "event": event, "events": events, "error": error,
            "rollback": rollback, "wh_after": wh_after or {},
            "lam_deltas": lam_deltas or {}}


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


POOL_ASIS = P(VQ0, PF0, CF0)
# --- shared legs ---
D_DEP9_TF100 = {"userbase": -160619895224, "userquote": -29608495, "userlp": 10**9,
                "vaultbase": 160619895224, "vaultquote": 29312410}
D_DEP9_TF5000 = {"userbase": -160619895224, "userquote": -58624820, "userlp": 10**9,
                 "vaultbase": 160619895224, "vaultquote": 29312410}
D_WD9_TF100 = {"userbase": 160619895223, "userquote": 29019284, "userlp": -10**9,
               "vaultbase": -160619895223, "vaultquote": -29312409}
D_WD9_TF5000 = {"userbase": 160619895223, "userquote": 14656204, "userlp": -10**9,
                "vaultbase": -160619895223, "vaultquote": -29312409}
D_BUY10_TF100 = {"userbase": 10**10, "userquote": -1866375, "userlp": 0,
                 "vaultbase": -10**10, "vaultquote": 1839310, "bbata": 8401}
D_SELL10_TF100 = {"userbase": -10**10, "userquote": 1784093, "userlp": 0,
                  "vaultbase": 10**10, "vaultquote": -1810601, "bbata": 8401}
LAM_DEP_TF100 = {"userquote": -29608495, "vaultquote": 29608495}
LAM_DEP_TF5000 = {"userquote": -58624820, "vaultquote": 58624820}
LAM_WD_TF100 = {"userquote": 29312409, "vaultquote": -29312409}
LAM_BUY_TF100 = {"userquote": -1866375, "vaultquote": 1857889}
LAM_SELL_TF100 = {"userquote": 1802115, "vaultquote": -1810601}


def SWC_SEED_TF100(pool_after):
    return E(-5000, {"creatorata": 122160, "vaultquote": -123394}, pool_after, None,
             event=SWP_EV(123394, 1, CREATOR_VAULT),
             wh_after={"creatorata": 1234})


def COL_SEED_TF100(pool_after):
    return E(-5000, {"creatorata": -122160, "dest": 120938}, pool_after, None,
             event=COL_EV(122160),
             wh_after={"creatorata": 1234, "dest": 1222})


def SWC_SEED_TF5000(pool_after):
    return E(-5000, {"creatorata": 61697, "vaultquote": -123394}, pool_after, None,
             event=SWP_EV(123394, 1, CREATOR_VAULT),
             wh_after={"creatorata": 61697})


def COL_SEED_TF5000(pool_after):
    return E(-5000, {"creatorata": -61697, "dest": 30848}, pool_after, None,
             event=COL_EV(61697),
             wh_after={"creatorata": 61697, "dest": 30849})


def SWC_BUCKET_TF100(pool_after, vol):
    return E(-5000, {"creatorata": 127580, "vaultquote": -128869}, pool_after, vol,
             event=SWP_EV(128869, 1, CREATOR_VAULT),
             wh_after={"creatorata": 1289})


def COL_BUCKET_TF100(pool_after, vol):
    return E(-5000, {"creatorata": -127580, "dest": 126304}, pool_after, vol,
             event=COL_EV(127580),
             wh_after={"creatorata": 1289, "dest": 1276})


CASES = [
    # Family A -- tf liquidity anchors -> sweep -> collect (seed only).
    {"label": "a-dep9-tf100-swc-col", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("swc", ()), ("col", ())],
     "expect": [E(-5000, D_DEP9_TF100, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410),
                  wh_after={"vaultquote": 296085, "userquote": 0},
                  lam_deltas=LAM_DEP_TF100),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_DEP9)),
                COL_SEED_TF100(P(-2488, PF0, 0, S_DEP9))]},
    {"label": "a-dep9-tf5000-swc-col", "bps": 5000,
     "steps": [("dep", (10**9, MX, MX)), ("swc", ()), ("col", ())],
     "expect": [E(-5000, D_DEP9_TF5000, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410),
                  wh_after={"vaultquote": 29312410, "userquote": 0},
                  lam_deltas=LAM_DEP_TF5000),
                SWC_SEED_TF5000(P(-2488, PF0, 0, S_DEP9)),
                COL_SEED_TF5000(P(-2488, PF0, 0, S_DEP9))]},
    {"label": "a-wd9-tf100-swc-col", "bps": 100,
     "steps": [("wd", (10**9, 0, 0)), ("swc", ()), ("col", ())],
     "expect": [E(-5000, D_WD9_TF100, P(VQ0, PF0, CF0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409),
                  wh_after={"userquote": 293125, "vaultquote": 0},
                  lam_deltas=LAM_WD_TF100),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_WD9)),
                COL_SEED_TF100(P(-2488, PF0, 0, S_WD9))]},
    {"label": "a-wd9-tf5000-swc-col", "bps": 5000,
     "steps": [("wd", (10**9, 0, 0)), ("swc", ()), ("col", ())],
     "expect": [E(-5000, D_WD9_TF5000, P(VQ0, PF0, CF0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409),
                  wh_after={"userquote": 14656205, "vaultquote": 0},
                  lam_deltas=LAM_WD_TF100),
                SWC_SEED_TF5000(P(-2488, PF0, 0, S_WD9)),
                COL_SEED_TF5000(P(-2488, PF0, 0, S_WD9))]},
    # Family B -- tf trade -> tf liquidity -> tf sweep -> tf collect.
    {"label": "b-buy-tf100-dep-swc-col", "bps": 100,
     "steps": [("buy", (10**10,)), ("dep", (10**9, MX, MX)), ("swc", ()), ("col", ())],
     "expect": [E(-1849400, D_BUY10_TF100, P(-139844, 10975, 128869), VOL_CREATED,
                  event=BUY_EV(),
                  wh_after={"vaultquote": 18579, "bbata": 85, "userquote": 0},
                  lam_deltas=LAM_BUY_TF100),
                E(-5000, {"userbase": -160617511066, "userquote": -29608935, "userlp": 10**9,
                          "vaultbase": 160617511066, "vaultquote": 29312845},
                  P(-139844, 10975, 128869, S_DEP9), VOL_CREATED,
                  event=DEP_EV(160617511066, 29312845),
                  wh_after={"vaultquote": 314669, "userquote": 0},
                  lam_deltas={"userquote": -29608935, "vaultquote": 29608935}),
                SWC_BUCKET_TF100(P(-10975, 10975, 0, S_DEP9), VOL_CREATED),
                COL_BUCKET_TF100(P(-10975, 10975, 0, S_DEP9), VOL_CREATED)]},
    {"label": "b-sell-tf100-dep-swc-col", "bps": 100,
     "steps": [("sell", (10**10,)), ("dep", (10**9, MX, MX)), ("swc", ()), ("col", ())],
     "expect": [E(-1849400, D_SELL10_TF100, P(-139843, 10974, 128869), VOL_CREATED,
                  event=SELL_EV(),
                  wh_after={"userquote": 18022, "vaultquote": 0, "bbata": 85},
                  lam_deltas=LAM_SELL_TF100),
                E(-5000, {"userbase": -160622279383, "userquote": -29608056, "userlp": 10**9,
                          "vaultbase": 160622279383, "vaultquote": 29311975},
                  P(-139843, 10974, 128869, S_DEP9), VOL_CREATED,
                  event=DEP_EV(160622279383, 29311975),
                  wh_after={"vaultquote": 296081, "userquote": 18022},
                  lam_deltas={"userquote": -29608056, "vaultquote": 29608056}),
                SWC_BUCKET_TF100(P(-10974, 10974, 0, S_DEP9), VOL_CREATED),
                COL_BUCKET_TF100(P(-10974, 10974, 0, S_DEP9), VOL_CREATED)]},
    {"label": "b-buy-tf100-wd-swc-col", "bps": 100,
     "steps": [("buy", (10**10,)), ("wd", (10**9, 0, 0)), ("swc", ()), ("col", ())],
     "expect": [E(-1849400, D_BUY10_TF100, P(-139844, 10975, 128869), VOL_CREATED,
                  event=BUY_EV(),
                  wh_after={"vaultquote": 18579, "bbata": 85, "userquote": 0},
                  lam_deltas=LAM_BUY_TF100),
                E(-5000, {"userbase": 160617511065, "userquote": 29019715, "userlp": -10**9,
                          "vaultbase": -160617511065, "vaultquote": -29312844},
                  P(-139844, 10975, 128869, S_WD9), VOL_CREATED,
                  event=WD_EV(160617511065, 29312844),
                  wh_after={"userquote": 293129, "vaultquote": 18579},
                  lam_deltas={"userquote": 29312844, "vaultquote": -29312844}),
                SWC_BUCKET_TF100(P(-10975, 10975, 0, S_WD9), VOL_CREATED),
                COL_BUCKET_TF100(P(-10975, 10975, 0, S_WD9), VOL_CREATED)]},
    # Family C -- tf liquidity -> tf trade -> tf sweep -> tf collect:
    # proportional tf liquidity is invisible to the tf trade.
    {"label": "c-dep-tf100-buy-swc-col", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [E(-5000, D_DEP9_TF100, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410),
                  wh_after={"vaultquote": 296085, "userquote": 0},
                  lam_deltas=LAM_DEP_TF100),
                E(-1849400, D_BUY10_TF100, P(-139844, 10975, 128869, S_DEP9), VOL_CREATED,
                  event=BUY_EV(),
                  wh_after={"vaultquote": 314664, "bbata": 85, "userquote": 0},
                  lam_deltas=LAM_BUY_TF100),
                SWC_BUCKET_TF100(P(-10975, 10975, 0, S_DEP9), VOL_CREATED),
                COL_BUCKET_TF100(P(-10975, 10975, 0, S_DEP9), VOL_CREATED)]},
    {"label": "c-wd-tf100-buy-swc-col", "bps": 100,
     "steps": [("wd", (10**9, 0, 0)), ("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [E(-5000, D_WD9_TF100, P(VQ0, PF0, CF0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409),
                  wh_after={"userquote": 293125, "vaultquote": 0},
                  lam_deltas=LAM_WD_TF100),
                E(-1849400, D_BUY10_TF100, P(-139844, 10975, 128869, S_WD9), VOL_CREATED,
                  event=BUY_EV(),
                  wh_after={"vaultquote": 18579, "bbata": 85, "userquote": 293125},
                  lam_deltas=LAM_BUY_TF100),
                SWC_BUCKET_TF100(P(-10975, 10975, 0, S_WD9), VOL_CREATED),
                COL_BUCKET_TF100(P(-10975, 10975, 0, S_WD9), VOL_CREATED)]},
    # Family D -- round trip, double collect, limit gates under tf.
    {"label": "d-dep-tf100-wd-swc-col", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("wd", (10**9, 0, 0)), ("swc", ()), ("col", ())],
     "expect": [E(-5000, D_DEP9_TF100, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410),
                  wh_after={"vaultquote": 296085, "userquote": 0},
                  lam_deltas=LAM_DEP_TF100),
                E(-5000, D_WD9_TF100, POOL_ASIS, None,
                  event=WD_EV(160619895223, 29312409),
                  wh_after={"userquote": 293125, "vaultquote": 296085},
                  lam_deltas=LAM_WD_TF100),
                SWC_SEED_TF100(P(-2488, PF0, 0)),
                COL_SEED_TF100(P(-2488, PF0, 0))]},
    {"label": "d-dep-tf100-swc-col-col", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("swc", ()), ("col", ()), ("col", ())],
     "expect": [E(-5000, D_DEP9_TF100, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410),
                  wh_after={"vaultquote": 296085, "userquote": 0},
                  lam_deltas=LAM_DEP_TF100),
                SWC_SEED_TF100(P(-2488, PF0, 0, S_DEP9)),
                COL_SEED_TF100(P(-2488, PF0, 0, S_DEP9)),
                E(-5000, {}, P(-2488, PF0, 0, S_DEP9), None, events=0,
                  wh_after={"creatorata": 1234, "dest": 1222})]},
    {"label": "d-dep-limit-net-tf100", "bps": 100,
     "steps": [("dep", (10**9, MX, 29312410)), ("swc", ()), ("col", ())],
     "expect": [E(-5000, {}, POOL_ASIS, None, events=0, error="6004", rollback=True,
                  wh_after={"vaultquote": 0, "userquote": 0}),
                SWC_SEED_TF100(P(-2488, PF0, 0)),
                COL_SEED_TF100(P(-2488, PF0, 0))]},
    {"label": "d-wd-limit-gross-tf100", "bps": 100,
     "steps": [("wd", (10**9, 0, 29312409)), ("swc", ()), ("col", ())],
     "expect": [E(-5000, {}, POOL_ASIS, None, events=0, error="6004", rollback=True,
                  wh_after={"vaultquote": 0, "userquote": 0}),
                SWC_SEED_TF100(P(-2488, PF0, 0)),
                COL_SEED_TF100(P(-2488, PF0, 0))]},
    # Family E -- protocol bucket under tf.
    {"label": "e-buy-tf100-dep-swp-swc-col", "bps": 100,
     "steps": [("buy", (10**10,)), ("dep", (10**9, MX, MX)), ("swp", ()), ("swc", ()), ("col", ())],
     "expect": [E(-1849400, D_BUY10_TF100, P(-139844, 10975, 128869), VOL_CREATED,
                  event=BUY_EV(),
                  wh_after={"vaultquote": 18579, "bbata": 85, "userquote": 0},
                  lam_deltas=LAM_BUY_TF100),
                E(-5000, {"userbase": -160617511066, "userquote": -29608935, "userlp": 10**9,
                          "vaultbase": 160617511066, "vaultquote": 29312845},
                  P(-139844, 10975, 128869, S_DEP9), VOL_CREATED,
                  event=DEP_EV(160617511066, 29312845),
                  wh_after={"vaultquote": 314669, "userquote": 0},
                  lam_deltas={"userquote": -29608935, "vaultquote": 29608935}),
                E(-5000, {"protoata": 10865, "vaultquote": -10975},
                  P(-128869, 0, 128869, S_DEP9), VOL_CREATED,
                  event=SWP_EV(10975, 0, PROTOCOL),
                  wh_after={"protoata": 110}),
                SWC_BUCKET_TF100(P(0, 0, 0, S_DEP9), VOL_CREATED),
                COL_BUCKET_TF100(P(0, 0, 0, S_DEP9), VOL_CREATED)]},
]

STEP_KIND = {"dep": "dep", "wd": "wd", "buy": "buy", "sell": "sell",
             "swp": "swp", "swc": "swc", "col": "col"}


def run_case(case, image_name, binary):
    h = setup_vm(binary, case["bps"])
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
        report_cases.append({"label": case["label"], "bps": case["bps"],
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
