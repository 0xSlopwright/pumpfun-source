#!/usr/bin/env python3
"""Build research/amm-v2-trades-tf-after-sweep-20261029 receipts.

3rd run packet #9: v2 trades under a quote transfer fee AFTER a sweep
-- the gap 3rd #8 left open in its Limits (3rd #4 + 2nd #7 cover the
two halves separately: sweeps under tf, and v2 trades under tf, but
never a sweep followed by a v2 trade in one VM). The question is
sharp because a sweep moves quote tokens under the fee AND converts
the accrual into virtual quote reserves, so a downstream v2 trade
could have broken in three places: the sweep's withholding leaking
into the trade leg, the vq shift moving the curve price, or the
limit gates changing sides under tf.

Sharp results (all three images agree on every step):
- Sweep -> v2 trades are BYTE-IDENTICAL to the no-sweep tf anchors
  at both tf100 and tf5000: buy 10^6, sell 10^6, and buy_exact 10^7
  settle with the same token deltas, the same pool deltas, and the
  same event fields whether or not a sweep ran first. The sweep's
  withholding stays confined to the sweep steps (proto 25 / creator
  1234 at tf100) and the vq shift (0 vs -125,882) does not move
  these trades at all.
- Single-bucket sweeps agree too: proto-only and creator-only
  sweeps leave the following 10^6 buy identical to the anchor,
  even though the unswept bucket stays accrued (123,394 creator
  fees after a proto-only sweep).
- A buy -> sell -> exact chain in one VM reuses the volume
  accumulator (later steps cost 5,000, not 1,849,400) and every
  leg still matches its standalone anchor.
- Split-transfer structure under tf (v2 buy): the vault leg is
  grossed up to deliver a constant net 186 (tf100: user 188 to
  vault + 2 withheld; tf5000: user 372 to vault + 186 withheld),
  while the buyback leg is transferred at face, NOT grossed up:
  buyback fee 1 nets 0 at both rates (fully withheld). For sell
  the payout is gross-side too (vault -179 = 178 payout + 1
  buyback; user nets 176 at tf100, 89 at tf5000 after ceiling
  withholding).
- buy_exact vault-leg gross is tf-invariant: 9,954,074 at nofee,
  tf100, and tf5000 alike (vault net falls 9,954,074 -> 9,854,533
  -> 4,977,037 as withholding rises). Total exact spend = vault
  leg + buyback leg (9,999,541 at tf100, 9,977,037 at tf5000).
  The exact out falls with tf (54,115,018,303 nofee ->
  53,573,907,921 tf100 -> 27,058,593,160 tf5000).
- Limit gates keep their sides post-sweep under tf100: buy limit
  is gross-spend-side (189 succeeds, 188 fails 6004, and the
  nofee spend 187 itself fails 6004); sell limit is net-side
  (176 succeeds, 177 and the gross receipt 178 fail 6004);
  exact limit is out-side (53,573,907,921 succeeds, +1 fails
  6040, and the nofee out fails 6040).
- Events report pre-tf curve amounts, never the grossed spend:
  the buy event's user_quote_in is 187 at both tf rates (the
  tf100 user actually pays 189, the tf5000 user 373).

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
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, trade_transferfee, volume

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-v2-trades-tf-after-sweep-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}

ATA_PROG = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
PAYER_KEY = PAYER.pubkey()
PAYER_HEX = bytes(PAYER_KEY).hex()
CREATOR = Pubkey.from_bytes(bytes(poolraw[211:243]))
CREATOR_VAULT, _ = Pubkey.find_program_address([b'creator_vault', bytes(CREATOR)], PROGRAM)
PROTOCOL = Pubkey.from_bytes(bytes(RAW[57:89]))
POOLV2 = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)[0]
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
MX = 2**64 - 1
VQ0, PF0, CF0 = -125882, 2488, 123394
S_ASIS = 4194352106721
RENT22 = 2157600


def ata22(owner):
    return Pubkey.find_program_address([bytes(owner), bytes(TOKEN22), bytes(quote)], ATA_PROG)[0]


PROTO22 = ata22(PROTOCOL)
CREAT22 = ata22(CREATOR_VAULT)
BB22 = ata22(BB_OWNER)

SWP_KEYS_P = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, PROTOCOL, PROTO22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_C = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, CREATOR_VAULT, CREAT22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
V2_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
           vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
           buyback, EVENT, PROGRAM]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTO22, CREAT22, BB22]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTO22, "creatorata": CREAT22, "bbata": BB22}
SWP_DISC = "82a42461e48287a5"


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
    vm.set_account(BB_OWNER, Account(10**9, b'', Pubkey.default()))
    bps = 100 if variant == "tf100" else 5000
    metas = [AccountMeta(k, False, False) for k in [pool, CONFIG_KEY, PAYER_KEY, base, quote, lp, userbase, userquote, userlp, vaultbase, vaultquote, TOKEN, TOKEN22, EVENT, PROGRAM]]
    transferfee(quote, bps, MX)(h, metas)
    vm.set_account(PROTO22, Account(RENT22, t22acct(PROTOCOL, 0, 0), TOKEN22))
    vm.set_account(CREAT22, Account(RENT22, t22acct(CREATOR_VAULT, 0, 0), TOKEN22))
    vm.set_account(BB22, Account(RENT22, t22acct(BB_OWNER, 0, 0), TOKEN22))
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
    # t22acct-built ATAs are 182 bytes with withheld at 174; the
    # transferfee override converts mint/vault/user accounts (and
    # the trade_transferfee-seeded buyback ATA) to 178 bytes with
    # withheld at 170.
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
    if kind in ("swp", "swc"):
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "recipient": raw[112:144].hex(),
                "amount": u64(raw, 176), "bucket": raw[184]}
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
    if kind == "exact":
        return {"disc": raw[:8].hex(), "len": len(raw)}
    return None


def check(cond, msg):
    if not cond:
        raise AssertionError(msg)


def disc(name):
    return bytes(next(x for x in IDL["instructions"] if x["name"] == name)["discriminator"])


def do_step(h, kind, args):
    if kind == "swp":
        name, keys, data = "sweep_protocol_fee", SWP_KEYS_P, disc("sweep_protocol_fee")
    elif kind == "swc":
        name, keys, data = "sweep_creator_fee", SWP_KEYS_C, disc("sweep_creator_fee")
    elif kind == "buy":
        name, keys = "buy_v2", V2_KEYS
        data = disc("buy_v2") + struct.pack("<QQ", *args)
    elif kind == "sell":
        name, keys = "sell_v2", V2_KEYS
        data = disc("sell_v2") + struct.pack("<QQ", *args)
    elif kind == "exact":
        name, keys = "buy_exact_quote_in_v2", V2_KEYS
        data = disc("buy_exact_quote_in_v2") + struct.pack("<QQ", *args)
    else:
        raise ValueError(kind)
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    if kind in ("buy", "sell", "exact"):
        if not h._v2done:
            # Full override: converts quote accounts (already
            # converted by setup, so idempotent) and seeds the
            # Token-2022 buyback ATA from the fixture buyback ATA.
            trade_transferfee(quote, h._bps, MX)(SimpleNamespace(vm=h.vm), metas)
            h._v2done = True
        else:
            # Light override: keep the already-seeded buyback ATA
            # so its balance accumulates across chained trades
            # instead of being re-seeded each step.
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


VOL = {"lamports": 1844400, "len": 137, "user": PAYER_HEX}


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


BUY_EV = {"disc": "67f4521f2cf57777", "len": 500, "curve": 183, "lp_bps": 2,
          "lp_fee": 1, "proto_bps": 93, "proto_fee": 2, "qwlp": 184, "uin": 187}
SELL_EV = {"disc": "3e2f370aa503dc2a", "len": 449, "curve": 182, "lp_bps": 2,
           "lp_fee": 1, "proto_bps": 93, "proto_fee": 2, "quote": 181, "uout": 178}
EXACT_EV = {"disc": "67f4521f2cf57777", "len": 515}

D_BUY100 = {"userbase": 10**6, "userquote": -189, "vaultbase": -10**6,
            "vaultquote": 186, "buyback": 0, "bbata": 0, "protoata": 0, "creatorata": 0}
D_BUY5000 = {"userbase": 10**6, "userquote": -373, "vaultbase": -10**6,
             "vaultquote": 186, "buyback": 0, "bbata": 0, "protoata": 0, "creatorata": 0}
D_SELL100 = {"userbase": -10**6, "userquote": 176, "vaultbase": 10**6,
             "vaultquote": -179, "buyback": 0, "bbata": 0, "protoata": 0, "creatorata": 0}
D_SELL5000 = {"userbase": -10**6, "userquote": 89, "vaultbase": 10**6,
              "vaultquote": -179, "buyback": 0, "bbata": 0, "protoata": 0, "creatorata": 0}
D_EXACT100 = {"userbase": 53573907921, "userquote": -9999541, "vaultbase": -53573907921,
              "vaultquote": 9854533, "buyback": 0, "bbata": 45012, "protoata": 0, "creatorata": 0}
D_EXACT5000 = {"userbase": 27058593160, "userquote": -9977037, "vaultbase": -27058593160,
               "vaultquote": 4977037, "buyback": 0, "bbata": 11481, "protoata": 0, "creatorata": 0}
# Chain exact: the prior buy+sell drift the vault quote by +7 and vq
# by -4, so the exact out lands 1 below the standalone anchor.
D_EXACT100_CHAIN = {"userbase": 53573907920, "userquote": -9999541, "vaultbase": -53573907920,
                    "vaultquote": 9854533, "buyback": 0, "bbata": 45012, "protoata": 0, "creatorata": 0}

WH0 = {"vaultquote": 0, "userquote": 0, "protoata": 0, "creatorata": 0, "bbata": 0}
WH_BUY100 = {"vaultquote": 2, "userquote": 0, "protoata": 0, "creatorata": 0, "bbata": 1}
WH_SELL100 = {"vaultquote": 0, "userquote": 2, "protoata": 0, "creatorata": 0, "bbata": 1}
WH_EXACT100 = {"vaultquote": 99541, "userquote": 0, "protoata": 0, "creatorata": 0, "bbata": 455}
WH_BUY5000 = {"vaultquote": 186, "userquote": 0, "protoata": 0, "creatorata": 0, "bbata": 1}
WH_SELL5000 = {"vaultquote": 0, "userquote": 89, "protoata": 0, "creatorata": 0, "bbata": 1}
WH_EXACT5000 = {"vaultquote": 4977037, "userquote": 0, "protoata": 0, "creatorata": 0, "bbata": 11482}
WH_SWP100 = {"vaultquote": 0, "userquote": 0, "protoata": 25, "creatorata": 0, "bbata": 0}
WH_SWC100 = {"vaultquote": 0, "userquote": 0, "protoata": 0, "creatorata": 1234, "bbata": 0}
WH_BOTH100 = {"vaultquote": 0, "userquote": 0, "protoata": 25, "creatorata": 1234, "bbata": 0}
WH_SWP5000 = {"vaultquote": 0, "userquote": 0, "protoata": 1244, "creatorata": 0, "bbata": 0}
WH_BOTH5000 = {"vaultquote": 0, "userquote": 0, "protoata": 1244, "creatorata": 61697, "bbata": 0}
WH_BBUY100 = {"vaultquote": 2, "userquote": 0, "protoata": 25, "creatorata": 1234, "bbata": 1}
WH_BSELL100 = {"vaultquote": 0, "userquote": 2, "protoata": 25, "creatorata": 1234, "bbata": 1}
WH_BEXACT100 = {"vaultquote": 99541, "userquote": 0, "protoata": 25, "creatorata": 1234, "bbata": 455}
WH_BBUY5000 = {"vaultquote": 186, "userquote": 0, "protoata": 1244, "creatorata": 61697, "bbata": 1}
WH_BSELL5000 = {"vaultquote": 0, "userquote": 89, "protoata": 1244, "creatorata": 61697, "bbata": 1}
WH_BEXACT5000 = {"vaultquote": 4977037, "userquote": 0, "protoata": 1244, "creatorata": 61697, "bbata": 11482}
WH_CSELL100 = {"vaultquote": 2, "userquote": 2, "protoata": 25, "creatorata": 1234, "bbata": 2}
WH_CEXACT100 = {"vaultquote": 99543, "userquote": 2, "protoata": 25, "creatorata": 1234, "bbata": 457}

SWP100 = E(-5000, {"vaultquote": -2488, "protoata": 2463}, P(-123394, 0, CF0), None,
           event=SWP_EV(2488, 0, PROTOCOL), wh=WH_SWP100)
SWC100 = E(-5000, {"vaultquote": -123394, "creatorata": 122160}, P(0, 0, 0), None,
           event=SWP_EV(123394, 1, CREATOR_VAULT), wh=WH_BOTH100)
SWC100_ALONE = E(-5000, {"vaultquote": -123394, "creatorata": 122160}, P(-2488, PF0, 0), None,
                 event=SWP_EV(123394, 1, CREATOR_VAULT), wh=WH_SWC100)
SWP5000 = E(-5000, {"vaultquote": -2488, "protoata": 1244}, P(-123394, 0, CF0), None,
            event=SWP_EV(2488, 0, PROTOCOL), wh=WH_SWP5000)
SWC5000 = E(-5000, {"vaultquote": -123394, "creatorata": 61697}, P(0, 0, 0), None,
            event=SWP_EV(123394, 1, CREATOR_VAULT), wh=WH_BOTH5000)

CASES = [
    # Family A -- tf anchors (no sweep)
    {"label": "a-buy-tf100", "variant": "tf100", "steps": [("buy", (10**6, MX))],
     "expect": [E(-1849400, D_BUY100, P(-125884, 2489, 123395), VOL, event=BUY_EV, wh=WH_BUY100)]},
    {"label": "a-sell-tf100", "variant": "tf100", "steps": [("sell", (10**6, 0))],
     "expect": [E(-1849400, D_SELL100, P(-125884, 2489, 123395), VOL, event=SELL_EV, wh=WH_SELL100)]},
    {"label": "a-exact-tf100", "variant": "tf100", "steps": [("exact", (10**7, 1))],
     "expect": [E(-1849400, D_EXACT100, P(-200683, 47955, 152728), VOL, event=EXACT_EV, wh=WH_EXACT100)]},
    {"label": "a-buy-tf5000", "variant": "tf5000", "steps": [("buy", (10**6, MX))],
     "expect": [E(-1849400, D_BUY5000, P(-125884, 2489, 123395), VOL, event=BUY_EV, wh=WH_BUY5000)]},
    {"label": "a-sell-tf5000", "variant": "tf5000", "steps": [("sell", (10**6, 0))],
     "expect": [E(-1849400, D_SELL5000, P(-125884, 2489, 123395), VOL, event=SELL_EV, wh=WH_SELL5000)]},
    {"label": "a-exact-tf5000", "variant": "tf5000", "steps": [("exact", (10**7, 1))],
     "expect": [E(-1849400, D_EXACT5000, P(-163660, 25451, 138209), VOL, event=EXACT_EV, wh=WH_EXACT5000)]},
    # Family S -- both sweeps -> v2 trades, tf100
    {"label": "s-both-buy-tf100", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("buy", (10**6, MX))],
     "expect": [SWP100, SWC100,
                E(-1849400, D_BUY100, P(-2, 1, 1), VOL, event=BUY_EV, wh=WH_BBUY100)]},
    {"label": "s-both-sell-tf100", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("sell", (10**6, 0))],
     "expect": [SWP100, SWC100,
                E(-1849400, D_SELL100, P(-2, 1, 1), VOL, event=SELL_EV, wh=WH_BSELL100)]},
    {"label": "s-both-exact-tf100", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("exact", (10**7, 1))],
     "expect": [SWP100, SWC100,
                E(-1849400, D_EXACT100, P(-74801, 45467, 29334), VOL, event=EXACT_EV, wh=WH_BEXACT100)]},
    # Family S -- single-bucket sweeps -> buy, tf100
    {"label": "s-proto-buy-tf100", "variant": "tf100",
     "steps": [("swp", ()), ("buy", (10**6, MX))],
     "expect": [SWP100,
                E(-1849400, D_BUY100, P(-123396, 1, 123395), VOL, event=BUY_EV,
                  wh={"vaultquote": 2, "userquote": 0, "protoata": 25, "creatorata": 0, "bbata": 1})]},
    {"label": "s-creat-buy-tf100", "variant": "tf100",
     "steps": [("swc", ()), ("buy", (10**6, MX))],
     "expect": [SWC100_ALONE,
                E(-1849400, D_BUY100, P(-2490, 2489, 1), VOL, event=BUY_EV,
                  wh={"vaultquote": 2, "userquote": 0, "protoata": 0, "creatorata": 1234, "bbata": 1})]},
    # Family S -- buy -> sell -> exact chain in one VM, tf100
    {"label": "s-chain-tf100", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("buy", (10**6, MX)), ("sell", (10**6, 0)), ("exact", (10**7, 1))],
     "expect": [SWP100, SWC100,
                E(-1849400, D_BUY100, P(-2, 1, 1), VOL, event=BUY_EV, wh=WH_BBUY100),
                E(-5000, D_SELL100, P(-4, 2, 2), VOL, event=SELL_EV, wh=WH_CSELL100),
                E(-5000, D_EXACT100_CHAIN, P(-74805, 45469, 29336), VOL, event=EXACT_EV, wh=WH_CEXACT100)]},
    # Family S5 -- both sweeps -> v2 trades, tf5000
    {"label": "s-both-buy-tf5000", "variant": "tf5000",
     "steps": [("swp", ()), ("swc", ()), ("buy", (10**6, MX))],
     "expect": [SWP5000, SWC5000,
                E(-1849400, D_BUY5000, P(-2, 1, 1), VOL, event=BUY_EV, wh=WH_BBUY5000)]},
    {"label": "s-both-sell-tf5000", "variant": "tf5000",
     "steps": [("swp", ()), ("swc", ()), ("sell", (10**6, 0))],
     "expect": [SWP5000, SWC5000,
                E(-1849400, D_SELL5000, P(-2, 1, 1), VOL, event=SELL_EV, wh=WH_BSELL5000)]},
    {"label": "s-both-exact-tf5000", "variant": "tf5000",
     "steps": [("swp", ()), ("swc", ()), ("exact", (10**7, 1))],
     "expect": [SWP5000, SWC5000,
                E(-1849400, D_EXACT5000, P(-37778, 22963, 14815), VOL, event=EXACT_EV, wh=WH_BEXACT5000)]},
    # Family L -- limit gates post-sweep, tf100
    {"label": "l-buy-limit189", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("buy", (10**6, 189))],
     "expect": [SWP100, SWC100,
                E(-1849400, D_BUY100, P(-2, 1, 1), VOL, event=BUY_EV, wh=WH_BBUY100)]},
    {"label": "l-buy-limit188", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("buy", (10**6, 188))],
     "expect": [SWP100, SWC100,
                E(-5000, {}, P(0, 0, 0), None, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage", wh=WH_BOTH100)]},
    {"label": "l-buy-limit187", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("buy", (10**6, 187))],
     "expect": [SWP100, SWC100,
                E(-5000, {}, P(0, 0, 0), None, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage", wh=WH_BOTH100)]},
    {"label": "l-sell-limit176", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("sell", (10**6, 176))],
     "expect": [SWP100, SWC100,
                E(-1849400, D_SELL100, P(-2, 1, 1), VOL, event=SELL_EV, wh=WH_BSELL100)]},
    {"label": "l-sell-limit177", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("sell", (10**6, 177))],
     "expect": [SWP100, SWC100,
                E(-5000, {}, P(0, 0, 0), None, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage", wh=WH_BOTH100)]},
    {"label": "l-sell-limit178", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("sell", (10**6, 178))],
     "expect": [SWP100, SWC100,
                E(-5000, {}, P(0, 0, 0), None, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage", wh=WH_BOTH100)]},
    {"label": "l-exact-limit-out", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("exact", (10**7, 53573907921))],
     "expect": [SWP100, SWC100,
                E(-1849400, D_EXACT100, P(-74801, 45467, 29334), VOL, event=EXACT_EV, wh=WH_BEXACT100)]},
    {"label": "l-exact-limit-outplus1", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("exact", (10**7, 53573907922))],
     "expect": [SWP100, SWC100,
                E(-5000, {}, P(0, 0, 0), None, events=0, error="6040",
                  rollback=True, site_fragment="BuySlippageBelowMinBaseAmountOut", wh=WH_BOTH100)]},
    {"label": "l-exact-limit-nofeeout", "variant": "tf100",
     "steps": [("swp", ()), ("swc", ()), ("exact", (10**7, 54115018303))],
     "expect": [SWP100, SWC100,
                E(-5000, {}, P(0, 0, 0), None, events=0, error="6040",
                  rollback=True, site_fragment="BuySlippageBelowMinBaseAmountOut", wh=WH_BOTH100)]},
]

STEP_KIND = {"swp": "swp", "swc": "swc", "buy": "buy", "sell": "sell", "exact": "exact"}


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
