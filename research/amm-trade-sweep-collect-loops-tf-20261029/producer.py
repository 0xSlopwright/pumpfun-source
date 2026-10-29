#!/usr/bin/env python3
"""Build research/amm-trade-sweep-collect-loops-tf-20261029 receipts.

3rd run packet #11: the full fee pipeline LOOPED under a quote
transfer fee -- the gap 3rd #10 left open in its Limits ("Trades
under a transfer fee inside the loop were not chained here; the
sweep/collect legs under tf were pinned in 3rd #5 and the sweep ->
v2 trade legs under tf in 3rd #9"). This packet runs buy, sell,
and buy_exact loops (trade -> sweep_creator_fee -> collect ->
trade -> sweep_creator_fee -> collect) in single VMs, one signed
transaction per step, on three program images (original, #424
control, #427 candidate), under quote transfer fees of 100 and
5000 bps, plus a third buy iteration and the tf10000 edges.

Sharp results (all three images agree on every step):
- Double withholding compounds across loops, and the first hop's
  withheld is stranded forever: tf100 buy loop sweeps 128,869
  gross to net 127,580 (withheld 1,289), collects to dest
  126,304 (withheld 1,276), and the vault ATA keeps its 1,289
  after the drain (amount 0, withheld 1,289). The second sweep
  moves only the new 5,476 gross to net 5,421 (withheld 55),
  so the vault withheld climbs 1,289 -> 1,344 -> 1,399 across
  three iterations and is never cleared; the dest withheld
  climbs 1,276 -> 1,331 -> 1,386. Every collect drains exactly
  the swept net, never the stranded withheld.
- The loop does NOT reset the price, and the curve move grosses
  up with the fee rate: nofee second buy cost +56 over its
  anchor (3rd #10); under tf100 it costs +57 (1,866,375 ->
  1,866,432) and under tf5000 +112 (3,687,106 -> 3,687,218).
  The third tf100 buy costs 1,866,487 (+55 over the second).
  Sell runs the other way: nofee second sell paid -54 under
  its anchor; under tf100 it pays only -53 (1,784,093 ->
  1,784,040), because withholding shrinks the payout loss.
  The second exact lands 53,565,387,102, 8,520,819 below its
  tf anchor at the same 9,999,541 spend.
- The protocol bucket still accrues across loops and its sweep
  output is still uncollectable under tf: after the tf100 buy
  loop the protocol sweep moves 19,462 gross to net 19,267
  (withheld 195), pool (0, 0, 0), and the following collect is
  a silent no-op (0 events, protocol ATA untouched).
- tf10000 splits buy from sell: buy 10^10 fails 6023 Overflow
  (the gross-up divides by zero), full rollback, payer 5,000
  only, 0 events; sell 10^10 succeeds with user net 0 (gross
  1,802,115 fully withheld, user withheld 1,802,115, buyback
  net 0 with withheld 8,486) while the vault still moves
  -1,810,601 gross.
- Events report pre-tf curve amounts throughout: the tf100 buy
  event's user_quote_in is 1,847,796 while the user actually
  pays 1,866,375; the sell event's uout is the gross
  1,802,115 while the user nets 1,784,093.

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
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, trade_transferfee, volume

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-trade-sweep-collect-loops-tf-20261029"
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
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
MX = 2**64 - 1
RENT22 = 2157600
S_ASIS = 4194352106721


def ata22(owner):
    return Pubkey.find_program_address([bytes(owner), bytes(TOKEN22), bytes(quote)], ATA_PROG)[0]


PROTO22 = ata22(PROTOCOL)
CREAT22 = ata22(CREATOR_VAULT)
BB22 = ata22(BB_OWNER)
DEST22 = ata22(CREATOR)

SWP_KEYS_P = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, PROTOCOL, PROTO22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_C = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, CREATOR_VAULT, CREAT22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
COL_KEYS = [quote, TOKEN22, CREATOR, CREATOR_VAULT, CREAT22, DEST22, EVENT, PROGRAM]
V2_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
           vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
           buyback, EVENT, PROGRAM]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTO22, CREAT22, BB22, DEST22]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTO22, "creatorata": CREAT22, "bbata": BB22, "dest": DEST22}
SWP_DISC = "82a42461e48287a5"
COL_DISC = "e8f5c2eeeada3a59"


def t22acct(owner, amount, withheld):
    data = bytearray(165)
    data[0:32] = bytes(quote)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) + struct.pack("<HHQ", 2, 8, withheld)


def sha(data):
    return hashlib.sha256(data).hexdigest()


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
    vm.set_account(PROTOCOL, Account(10**9, b'', Pubkey.default()))
    vm.set_account(CREATOR_VAULT, Account(10**9, b'', Pubkey.default()))
    vm.set_account(BB_OWNER, Account(10**9, b'', Pubkey.default()))
    metas = [AccountMeta(k, False, False) for k in [pool, CONFIG_KEY, PAYER_KEY, base, quote, lp, userbase, userquote, userlp, vaultbase, vaultquote, TOKEN, TOKEN22, EVENT, PROGRAM]]
    transferfee(quote, bps, MX)(h, metas)
    vm.set_account(PROTO22, Account(RENT22, t22acct(PROTOCOL, 0, 0), TOKEN22))
    vm.set_account(CREAT22, Account(RENT22, t22acct(CREATOR_VAULT, 0, 0), TOKEN22))
    vm.set_account(BB22, Account(RENT22, t22acct(BB_OWNER, 0, 0), TOKEN22))
    vm.set_account(DEST22, Account(RENT22, t22acct(CREATOR, 0, 0), TOKEN22))
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
    if kind in ("buy", "sell"):
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_bps": u64(raw, 72),
                "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
                "proto_fee": u64(raw, 96), "qwlp": u64(raw, 104),
                "uin": u64(raw, 112)} if kind == "buy" else {
                "disc": raw[:8].hex(), "len": len(raw),
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
    elif kind == "col":
        name, keys, data = "collect_coin_creator_fee", COL_KEYS, disc("collect_coin_creator_fee")
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
            trade_transferfee(quote, h._bps, MX)(SimpleNamespace(vm=h.vm), metas)
            h._v2done = True
        else:
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
VOL0 = None


def WH(vq=0, uq=0, p=0, c=0, bb=0, d=0):
    return {"vaultquote": vq, "userquote": uq, "protoata": p,
            "creatorata": c, "bbata": bb, "dest": d}


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


def COL_EV(amount):
    return {"disc": COL_DISC, "len": 120, "timestamp": 1234567890,
            "creator": bytes(CREATOR).hex(), "fee": amount,
            "vault_ata": bytes(CREAT22).hex(), "dest": bytes(DEST22).hex()}


BUY_EV1 = {"disc": "67f4521f2cf57777", "len": 500, "curve": 1824983, "lp_bps": 2,
           "lp_fee": 365, "proto_bps": 93, "proto_fee": 16973, "qwlp": 1825348, "uin": 1847796}
BUY_EV2 = {"disc": "67f4521f2cf57777", "len": 500, "curve": 1825037, "lp_bps": 2,
           "lp_fee": 366, "proto_bps": 93, "proto_fee": 16973, "qwlp": 1825403, "uin": 1847852}
BUY_EV3 = {"disc": "67f4521f2cf57777", "len": 500, "curve": 1825091, "lp_bps": 2,
           "lp_fee": 366, "proto_bps": 93, "proto_fee": 16974, "qwlp": 1825457, "uin": 1847907}
SELL_EV1 = {"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824927, "lp_bps": 2,
            "lp_fee": 365, "proto_bps": 93, "proto_fee": 16972, "quote": 1824562, "uout": 1802115}
SELL_EV2 = {"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824873, "lp_bps": 2,
            "lp_fee": 365, "proto_bps": 93, "proto_fee": 16972, "quote": 1824508, "uout": 1802061}
EXACT_EV = {"disc": "67f4521f2cf57777", "len": 515}

# Deltas: full role set; untouched roles are 0.
def D(**kw):
    base_d = {"userbase": 0, "userquote": 0, "vaultbase": 0, "vaultquote": 0,
              "buyback": 0, "protoata": 0, "creatorata": 0, "bbata": 0, "dest": 0}
    base_d.update(kw)
    return base_d


BUY1_100 = E(-1849400, D(userbase=10**10, userquote=-1866375, vaultbase=-10**10,
                         vaultquote=1839310, bbata=8401),
             P(-139844, 10975, 128869), VOL, event=BUY_EV1, wh=WH(18579, 0, 0, 0, 85, 0))
BUY2_100 = E(-5000, D(userbase=10**10, userquote=-1866432, vaultbase=-10**10,
                      vaultquote=1839366, bbata=8401),
             P(-24938, 19462, 5476), VOL, event=BUY_EV2, wh=WH(37159, 0, 0, 1289, 170, 1276))
BUY3_100 = E(-5000, D(userbase=10**10, userquote=-1866487, vaultbase=-10**10,
                      vaultquote=1839420, bbata=8402),
             P(-33425, 27949, 5476), VOL, event=BUY_EV3, wh=WH(55739, 0, 0, 1344, 255, 1331))
SELL1_100 = E(-1849400, D(userbase=-10**10, userquote=1784093, vaultbase=10**10,
                          vaultquote=-1810601, bbata=8401),
              P(-139843, 10974, 128869), VOL, event=SELL_EV1, wh=WH(0, 18022, 0, 0, 85, 0))
SELL2_100 = E(-5000, D(userbase=-10**10, userquote=1784040, vaultbase=10**10,
                       vaultquote=-1810547, bbata=8401),
              P(-24935, 19460, 5475), VOL, event=SELL_EV2, wh=WH(0, 36043, 0, 1289, 170, 1276))
EXACT1_100 = E(-1849400, D(userbase=53573907921, userquote=-9999541,
                           vaultbase=-53573907921, vaultquote=9854533, bbata=45012),
               P(-200683, 47955, 152728), VOL, event=EXACT_EV, wh=WH(99541, 0, 0, 0, 455, 0))
EXACT2_100 = E(-5000, D(userbase=53565387102, userquote=-9999541,
                        vaultbase=-53565387102, vaultquote=9854533, bbata=45012),
               P(-122756, 93422, 29334), VOL, event=EXACT_EV, wh=WH(199082, 0, 0, 1528, 910, 1512))
BUY1_5000 = E(-1849400, D(userbase=10**10, userquote=-3687106, vaultbase=-10**10,
                          vaultquote=1839310, bbata=4243),
              P(-139844, 10975, 128869), VOL, event=BUY_EV1, wh=WH(1839310, 0, 0, 0, 4243, 0))
BUY2_5000 = E(-5000, D(userbase=10**10, userquote=-3687218, vaultbase=-10**10,
                       vaultquote=1839366, bbata=4243),
              P(-24938, 19462, 5476), VOL, event=BUY_EV2, wh=WH(3678676, 0, 0, 64435, 8486, 32217))


def SWC(amount, net, pool_after, wh):
    return E(-5000, D(vaultquote=-amount, creatorata=net), pool_after, VOL,
             event=SWP_EV(amount, 1, CREATOR_VAULT), wh=wh)


def COL(amount, net, pool_after, wh):
    return E(-5000, D(creatorata=-amount, dest=net), pool_after, VOL,
             event=COL_EV(amount), wh=wh)


def SWP(amount, net, pool_after, wh):
    return E(-5000, D(vaultquote=-amount, protoata=net), pool_after, VOL,
             event=SWP_EV(amount, 0, PROTOCOL), wh=wh)


def NOOP(pool_after, wh):
    return E(-5000, D(), pool_after, VOL, events=0, wh=wh)


CASES = [
    # Family A -- tf100 anchors, no sweep/collect
    {"label": "a-buy-tf100", "bps": 100, "steps": [("buy", (10**10, MX))],
     "expect": [BUY1_100]},
    {"label": "a-sell-tf100", "bps": 100, "steps": [("sell", (10**10, 0))],
     "expect": [SELL1_100]},
    {"label": "a-exact-tf100", "bps": 100, "steps": [("exact", (10**7, 1))],
     "expect": [EXACT1_100]},
    # Family B -- buy loop tf100
    {"label": "b-buy-loop-tf100", "bps": 100,
     "steps": [("buy", (10**10, MX)), ("swc", ()), ("col", ()), ("buy", (10**10, MX)),
               ("swc", ()), ("col", ()), ("swp", ()), ("col", ())],
     "expect": [BUY1_100,
                SWC(128869, 127580, P(-10975, 10975, 0), WH(18579, 0, 0, 1289, 85, 0)),
                COL(127580, 126304, P(-10975, 10975, 0), WH(18579, 0, 0, 1289, 85, 1276)),
                BUY2_100,
                SWC(5476, 5421, P(-19462, 19462, 0), WH(37159, 0, 0, 1344, 170, 1276)),
                COL(5421, 5366, P(-19462, 19462, 0), WH(37159, 0, 0, 1344, 170, 1331)),
                SWP(19462, 19267, P(0, 0, 0), WH(37159, 0, 195, 1344, 170, 1331)),
                NOOP(P(0, 0, 0), WH(37159, 0, 195, 1344, 170, 1331))]},
    # Family C -- sell loop tf100
    {"label": "c-sell-loop-tf100", "bps": 100,
     "steps": [("sell", (10**10, 0)), ("swc", ()), ("col", ()), ("sell", (10**10, 0)),
               ("swc", ()), ("col", ()), ("col", ())],
     "expect": [SELL1_100,
                SWC(128869, 127580, P(-10974, 10974, 0), WH(0, 18022, 0, 1289, 85, 0)),
                COL(127580, 126304, P(-10974, 10974, 0), WH(0, 18022, 0, 1289, 85, 1276)),
                SELL2_100,
                SWC(5475, 5420, P(-19460, 19460, 0), WH(0, 36043, 0, 1344, 170, 1276)),
                COL(5420, 5365, P(-19460, 19460, 0), WH(0, 36043, 0, 1344, 170, 1331)),
                NOOP(P(-19460, 19460, 0), WH(0, 36043, 0, 1344, 170, 1331))]},
    # Family D -- exact loop tf100
    {"label": "d-exact-loop-tf100", "bps": 100,
     "steps": [("exact", (10**7, 1)), ("swc", ()), ("col", ()), ("exact", (10**7, 1)),
               ("swc", ()), ("col", ())],
     "expect": [EXACT1_100,
                SWC(152728, 151200, P(-47955, 47955, 0), WH(99541, 0, 0, 1528, 455, 0)),
                COL(151200, 149688, P(-47955, 47955, 0), WH(99541, 0, 0, 1528, 455, 1512)),
                EXACT2_100,
                SWC(29334, 29040, P(-93422, 93422, 0), WH(199082, 0, 0, 1822, 910, 1512)),
                COL(29040, 28749, P(-93422, 93422, 0), WH(199082, 0, 0, 1822, 910, 1803))]},
    # Family E -- buy loop tf5000
    {"label": "e-buy-loop-tf5000", "bps": 5000,
     "steps": [("buy", (10**10, MX)), ("swc", ()), ("col", ()), ("buy", (10**10, MX)),
               ("swc", ()), ("col", ())],
     "expect": [BUY1_5000,
                SWC(128869, 64434, P(-10975, 10975, 0), WH(1839310, 0, 0, 64435, 4243, 0)),
                COL(64434, 32217, P(-10975, 10975, 0), WH(1839310, 0, 0, 64435, 4243, 32217)),
                BUY2_5000,
                SWC(5476, 2738, P(-19462, 19462, 0), WH(3678676, 0, 0, 67173, 8486, 32217)),
                COL(2738, 1369, P(-19462, 19462, 0), WH(3678676, 0, 0, 67173, 8486, 33586))]},
    # Family F -- third buy iteration tf100
    {"label": "f-buy3-tf100", "bps": 100,
     "steps": [("buy", (10**10, MX)), ("swc", ()), ("col", ()), ("buy", (10**10, MX)),
               ("swc", ()), ("col", ()), ("buy", (10**10, MX)), ("swc", ()), ("col", ())],
     "expect": [BUY1_100,
                SWC(128869, 127580, P(-10975, 10975, 0), WH(18579, 0, 0, 1289, 85, 0)),
                COL(127580, 126304, P(-10975, 10975, 0), WH(18579, 0, 0, 1289, 85, 1276)),
                BUY2_100,
                SWC(5476, 5421, P(-19462, 19462, 0), WH(37159, 0, 0, 1344, 170, 1276)),
                COL(5421, 5366, P(-19462, 19462, 0), WH(37159, 0, 0, 1344, 170, 1331)),
                BUY3_100,
                SWC(5476, 5421, P(-27949, 27949, 0), WH(55739, 0, 0, 1399, 255, 1331)),
                COL(5421, 5366, P(-27949, 27949, 0), WH(55739, 0, 0, 1399, 255, 1386))]},
    # Family G -- tf10000 edges
    {"label": "g-buy-tf10000", "bps": 10000, "steps": [("buy", (10**10, MX))],
     "expect": [E(-5000, D(), P(-125882, 2488, 123394), VOL0, events=0, error="6023",
                  rollback=True, wh=WH())]},
    {"label": "h-sell-tf10000", "bps": 10000, "steps": [("sell", (10**10, 0))],
     "expect": [E(-1849400, D(userbase=-10**10, vaultbase=10**10, vaultquote=-1810601),
                  P(-139843, 10974, 128869), VOL, event=SELL_EV1,
                  wh=WH(0, 1802115, 0, 0, 8486, 0))]},
]

STEP_KIND = {"buy": "buy", "sell": "sell", "exact": "exact",
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
