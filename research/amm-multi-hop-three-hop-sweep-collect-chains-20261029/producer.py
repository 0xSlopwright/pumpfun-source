#!/usr/bin/env python3
"""Build research/amm-multi-hop-three-hop-sweep-collect-chains-20261029 receipts.

3rd run packet #16: 3-hop multi-hop trades chained into sweep -> collect.

3rd #12 chained 1-hop multi-hop trades into sweep -> collect, but left
3-hop routes open with the note that intermediate pools' accruals were
unaddressed. This packet measures them, and the middle hop is the
surprise: a 3-hop trade accrues fees into exactly TWO pools -- the
first hop and the tail hop -- and the middle pool's state is
byte-identical before and after, in both directions:
- 3-hop BUY (quote -> base -> BASE2 -> BASE3): hop1 (main pool)
  accrues protocol only (pf +4,607,154, cf +0), the tail hop (P3)
  accrues creator only (cf +2,671,742,901, pf +0), and POOL2
  (middle) accrues NOTHING (state exactly (-125882, 2488, 123394)).
- 3-hop SELL (BASE3 -> BASE2 -> base -> quote): hop1 (P3) accrues
  creator only (cf +500,000 exactly, pf +0), the tail hop (main)
  accrues protocol only (pf +847, cf +0), and POOL2 again accrues
  NOTHING.
So sweeping the middle pool after either direction moves only its
123,394 seed, while sweeping the tail pool moves the multi-million
bucket (buy: 2,671,866,295; sell-loop second sell: 1,123,393).
Every sweep converts its bucket into virtual quote reserves 1:1, so
each pool's vq after a creator sweep is exactly -(its pf).

The packet also pins, all on three images (original, #424 control,
#427 candidate), in single VMs, one signed transaction per step:
- buy and sell loops (trade -> sweep -> collect -> trade -> sweep
  -> collect): the second buy's hop1 quote leg (+995,392,847) and
  buyback (+4,607,153) repeat byte-identically while the curve legs
  move (U3 out 5,315,084,721,958 -> 5,121,405,353,567); the second
  sell reprices by exactly 1 (180,345 -> 180,344) with buyback 846
  unchanged; the protocol bucket keeps accruing across loops while
  only the creator bucket is swept.
- sweep-first neutrality at every hop: sweeping ALL THREE pools
  (both buckets each) before a buy or a sell leaves every trade leg
  byte-identical to the fresh anchor, and the pool DELTAS identical
  too; sweeping only the tail pool before a buy is equally neutral.
- sweep-first limit gates: after sweeping all pools, a buy with
  limit exactly the anchor out (5,315,084,721,958) succeeds, while
  limit +1 fails 6004 ExceededSlippage with a full rollback -- but
  the three hop events are already in the logs (ghost events on a
  rolled-back trade).
- protocol sweep output is never collectable, now for the 3-hop
  tail pool too: buy -> protocol-sweep P3 (2,488) -> collect is a
  silent no-op, as is sell-loop protocol-sweep P3 -> collect.
- cross-direction chain: buy -> sell in one VM. The sell after the
  buy pays 187,229 quote (vs the fresh 180,345 anchor) because the
  buy moved all three pools' vaults, and it accrues 879 into the
  main protocol bucket and 505,363 into the P3 creator bucket on
  top of the buy's buckets; the following P3 sweep moves the full
  2,672,371,658 and the collect drains it.

Fixture note: the P3/POOL2 creator/protocol vault ATAs and collect
destinations use the NON-native token layout (like userbase),
because BASE2/base are SPL mints, not the native SOL mint. An
earlier probe that flagged those accounts native=True produced
runtime-level collect failures (UnbalancedInstruction /
InsufficientFundsForRent) that are a harness artifact, not program
behavior; with the correct non-native layout every collect
succeeds. Those artifact failures are NOT part of this packet.

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
    base, f, lp, pool, poolraw, quote, supply, token,
    userbase, userlp, userquote, vaultbase, vaultquote,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, volume
from pump_amm_multi_hop_differential import (
    BASE2, BASE3, P3, POOL2, PUMP, PUMP_GLOBAL, PUMP_FEES, PUMP_EVENT,
    U3, VB2, VB3, VQ2, VQ3, three_amm,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-multi-hop-three-hop-sweep-collect-chains-20261029"
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
CREATOR_ATA, _ = Pubkey.find_program_address([bytes(CREATOR_VAULT), bytes(TOKEN), bytes(quote)], ATA_PROG)
PROTOCOL = Pubkey.from_bytes(bytes(RAW[57:89]))
PROTOCOL_ATA, _ = Pubkey.find_program_address([bytes(PROTOCOL), bytes(TOKEN), bytes(quote)], ATA_PROG)
CREATOR_ATA_P3, _ = Pubkey.find_program_address([bytes(CREATOR_VAULT), bytes(TOKEN), bytes(BASE2)], ATA_PROG)
PROTOCOL_ATA_P3, _ = Pubkey.find_program_address([bytes(PROTOCOL), bytes(TOKEN), bytes(BASE2)], ATA_PROG)
CREATOR_ATA_P2, _ = Pubkey.find_program_address([bytes(CREATOR_VAULT), bytes(TOKEN), bytes(base)], ATA_PROG)
PROTOCOL_ATA_P2, _ = Pubkey.find_program_address([bytes(PROTOCOL), bytes(TOKEN), bytes(base)], ATA_PROG)
DEST = Pubkey.from_bytes(bytes([94]) * 32)
DEST3 = Pubkey.from_bytes(bytes([95]) * 32)
DEST2 = Pubkey.from_bytes(bytes([96]) * 32)
S_ASIS = 4194352106721

MH_KEYS_BUY = [PAYER_KEY, userquote, userbase, CONFIG_KEY, feeconfig, volume, buyback,
               TOKEN, TOKEN22, Pubkey.default(), EVENT, PROGRAM, PUMP, PUMP_GLOBAL, PUMP_FEES, PUMP_EVENT]
MH_KEYS_SELL = [PAYER_KEY, userbase, userquote, CONFIG_KEY, feeconfig, volume, buyback,
                TOKEN, TOKEN22, Pubkey.default(), EVENT, PROGRAM, PUMP, PUMP_GLOBAL, PUMP_FEES, PUMP_EVENT]
MH_TAIL = [AccountMeta(base, False, False), AccountMeta(quote, False, False),
           AccountMeta(pool, False, True), AccountMeta(vaultbase, False, True),
           AccountMeta(vaultquote, False, True)]
# pool tag -> (pool, quote mint, quote vault, protocol ATA, creator ATA, dest)
POOLS = {
    "main": (pool, quote, vaultquote, PROTOCOL_ATA, CREATOR_ATA, DEST),
    "p2": (POOL2, base, VQ2, PROTOCOL_ATA_P2, CREATOR_ATA_P2, DEST2),
    "p3": (P3, BASE2, VQ3, PROTOCOL_ATA_P3, CREATOR_ATA_P3, DEST3),
}
WATCH = [PAYER_KEY, pool, POOL2, P3, base, quote, BASE2, BASE3, lp, userbase,
         userquote, userlp, vaultbase, vaultquote, VB2, VQ2, VB3, VQ3, U3,
         buyback, volume, feeconfig, CONFIG_KEY,
         PROTOCOL_ATA, CREATOR_ATA, DEST,
         PROTOCOL_ATA_P3, CREATOR_ATA_P3, DEST3,
         PROTOCOL_ATA_P2, CREATOR_ATA_P2, DEST2]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "vb1": vaultbase, "vq1": vaultquote, "vb2": VB2, "vq2": VQ2,
            "vb3": VB3, "vq3": VQ3, "u3": U3,
            "protoata": PROTOCOL_ATA, "creatorata": CREATOR_ATA, "dest": DEST,
            "protoata3": PROTOCOL_ATA_P3, "creatorata3": CREATOR_ATA_P3, "dest3": DEST3,
            "protoata2": PROTOCOL_ATA_P2, "creatorata2": CREATOR_ATA_P2, "dest2": DEST2}
TOKEN_ROLES = ["userbase", "userquote", "userlp", "vb1", "vq1", "vb2", "vq2",
               "vb3", "vq3", "u3", "buyback",
               "protoata", "creatorata", "dest",
               "protoata3", "creatorata3", "dest3",
               "protoata2", "creatorata2", "dest2"]
SWP_DISC = "82a42461e48287a5"
COL_DISC = "e8f5c2eeeada3a59"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def setup_vm(binary):
    h = Harness(binary)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, p in [(TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                   (TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so"),
                   (FEES, "evidence/original/pump_fees/deployed.so"),
                   (ATA_PROG, "evidence/dependencies/associated_token/deployed.so"),
                   (PUMP, "evidence/original/pump/deployed.so")]:
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
    vm.set_account(DEST, Account(2039280, token(quote, CREATOR, 0, True), TOKEN))
    vm.set_account(CREATOR_ATA, Account(2039280, token(quote, CREATOR_VAULT, 0, True), TOKEN))
    vm.set_account(PROTOCOL_ATA, Account(2039280, token(quote, PROTOCOL, 0, True), TOKEN))
    # BASE2/base are SPL mints, NOT the native SOL mint: non-native layout.
    vm.set_account(DEST3, Account(2039280, token(BASE2, CREATOR, 0, False), TOKEN))
    vm.set_account(CREATOR_ATA_P3, Account(2039280, token(BASE2, CREATOR_VAULT, 0, False), TOKEN))
    vm.set_account(PROTOCOL_ATA_P3, Account(2039280, token(BASE2, PROTOCOL, 0, False), TOKEN))
    vm.set_account(DEST2, Account(2039280, token(base, CREATOR, 0, False), TOKEN))
    vm.set_account(CREATOR_ATA_P2, Account(2039280, token(base, CREATOR_VAULT, 0, False), TOKEN))
    vm.set_account(PROTOCOL_ATA_P2, Account(2039280, token(base, PROTOCOL, 0, False), TOKEN))
    for k in [PUMP_GLOBAL, PUMP_FEES, PUMP_EVENT]:
        vm.set_account(k, Account(10**9, b"", Pubkey.default()))
    return h


def build_route(h, sell):
    keys = MH_KEYS_SELL if sell else MH_KEYS_BUY
    ix = next(x for x in IDL["instructions"] if x["name"] == "multi_hop_swap")
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])] + list(MH_TAIL)
    three_amm(sell)(SimpleNamespace(vm=h.vm), metas)
    return metas


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
    return [int.from_bytes(d[245:261], "little", signed=True),
            struct.unpack_from("<Q", d, 271)[0],
            struct.unpack_from("<Q", d, 279)[0],
            struct.unpack_from("<Q", d, 203)[0]]


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
            raw = base64.b64decode(l.split("Program data: ", 1)[1].strip())
            out.append(raw)
    return out


def u64(raw, off):
    return struct.unpack_from("<Q", raw, off)[0]


def decode_event(kind, raw):
    if kind in ("mhbuy3", "mhsell3"):
        return {"disc": raw[:8].hex(), "len": len(raw)}
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


def do_step(h, kind, args, routes):
    if kind in ("mhbuy3", "mhsell3"):
        ix = next(x for x in IDL["instructions"] if x["name"] == "multi_hop_swap")
        metas = routes["sell" if kind == "mhsell3" else "buy"]
        data = bytes(ix["discriminator"]) + struct.pack("<QQ", args[0], args[1])
    elif kind in ("swp", "swc"):
        pool_k, mint_k, vq_k, proto_ata, creat_ata, _dest = POOLS[args]
        name = "sweep_protocol_fee" if kind == "swp" else "sweep_creator_fee"
        ix = next(x for x in IDL["instructions"] if x["name"] == name)
        keys = [PAYER_KEY, CONFIG_KEY, pool_k, mint_k, TOKEN, vq_k,
                PROTOCOL if kind == "swp" else CREATOR_VAULT,
                proto_ata if kind == "swp" else creat_ata,
                Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])]
        data = disc(name)
    elif kind == "col":
        _pool_k, mint_k, _vq_k, _proto_ata, creat_ata, dest = POOLS[args]
        ix = next(x for x in IDL["instructions"] if x["name"] == "collect_coin_creator_fee")
        keys = [mint_k, TOKEN, CREATOR, CREATOR_VAULT, creat_ata, dest, EVENT, PROGRAM]
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])]
        data = disc("collect_coin_creator_fee")
    else:
        raise ValueError(kind)
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


def E(dPAYER, deltas, pools, volume, event=None, events=1, error=None,
      rollback=False):
    return {"dPAYER": dPAYER, "deltas": deltas, "pools": pools,
            "volume": volume, "event": event, "events": events, "error": error,
            "rollback": rollback}


def P(vq, pf, cf, sup=S_ASIS):
    return [vq, pf, cf, sup]


INIT = P(-125882, 2488, 123394)
ZERO = P(0, 0, 0)
VOL = {"lamports": 1844400, "len": 137, "user": PAYER_HEX}


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


def COL_EV(amount, vault_ata, dest):
    return {"disc": COL_DISC, "len": 120, "timestamp": 1234567890,
            "creator": bytes(CREATOR).hex(), "fee": amount,
            "vault_ata": bytes(vault_ata).hex(), "dest": bytes(dest).hex()}


MHBUY_EV = {"disc": "67f4521f2cf57777", "len": 508}
MHSELL_EV = {"disc": "3e2f370aa503dc2a", "len": 449}

D_BUY3_1E9 = {"userquote": -10**9, "vb1": -5385694844757, "vq1": 995392847,
              "vb2": -5356844515538, "vq2": 5385694844757,
              "vb3": -5315084721958, "vq3": 5356844515538,
              "u3": 5315084721958, "buyback": 4607153}
D_SELL3_1E9 = {"userquote": 180345, "vb1": 997498005, "vq1": -181191,
               "vb2": 997499001, "vq2": -997498005,
               "vb3": 10**9, "vq3": -997499001, "u3": -10**9, "buyback": 846}
D_BUY3_1E6 = {"userquote": -10**6, "vb1": -5429043355, "vq1": 995393,
              "vb2": -5429013880, "vq2": 5429043355,
              "vb3": -5415445863, "vq3": 5429013880,
              "u3": 5415445863, "buyback": 4607}
D_SELL3_1E6 = {"userquote": 180, "vb1": 997498, "vq1": -181,
               "vb2": 997499, "vq2": -997498,
               "vb3": 10**6, "vq3": -997499, "u3": -10**6, "buyback": 1}
D_BUY3_2ND = {"userquote": -10**9, "vb1": -5300268622007, "vq1": 995392847,
              "vb2": -5216136464071, "vq2": 5300268622007,
              "vb3": -5121405353567, "vq3": 5216136464071,
              "u3": 5121405353567, "buyback": 4607153}
D_SELL3_2ND = {"userquote": 180344, "vb1": 997494021, "vq1": -181190,
               "vb2": 997497007, "vq2": -997494021,
               "vb3": 10**9, "vq3": -997497007, "u3": -10**9, "buyback": 846}
D_CROSS_SELL = {"userquote": 187229, "vb1": 1019086346, "vq1": -188108,
                "vb2": 1008198438, "vq2": -1019086346,
                "vb3": 10**9, "vq3": -1008198438, "u3": -10**9, "buyback": 879}


def POOLS3(main, pool2, p3):
    return {"main": main, "pool2": pool2, "p3": p3}


def MH(dPAYER, deltas, pools, event):
    return E(dPAYER, deltas, pools, VOL, event=event, events=3)


def SWC(pool_tag, amount, pools, volume=VOL):
    return E(-5000, {"vq" + {"main": "1", "p2": "2", "p3": "3"}[pool_tag]: -amount,
                     "creatorata" + {"main": "", "p2": "2", "p3": "3"}[pool_tag]: amount},
             pools, volume, event=SWP_EV(amount, 1, CREATOR_VAULT))


def SWP(pool_tag, amount, pools, volume=VOL):
    return E(-5000, {"vq" + {"main": "1", "p2": "2", "p3": "3"}[pool_tag]: -amount,
                     "protoata" + {"main": "", "p2": "2", "p3": "3"}[pool_tag]: amount},
             pools, volume, event=SWP_EV(amount, 0, PROTOCOL))


def COL(pool_tag, amount, pools, volume=VOL):
    suffix = {"main": "", "p2": "2", "p3": "3"}[pool_tag]
    vault_ata = {"main": CREATOR_ATA, "p2": CREATOR_ATA_P2, "p3": CREATOR_ATA_P3}[pool_tag]
    dest = {"main": DEST, "p2": DEST2, "p3": DEST3}[pool_tag]
    return E(-5000, {"creatorata" + suffix: -amount, "dest" + suffix: amount},
             pools, volume, event=COL_EV(amount, vault_ata, dest))


def NOOP(pools, volume=VOL):
    return E(-5000, {}, pools, volume, events=0)


# --- case expectations ---
A1_POOLS = POOLS3(P(-4733036, 4609642, 123394), INIT, P(-2671868783, 2488, 2671866295))
A2_POOLS = POOLS3(P(-126729, 3335, 123394), INIT, P(-625882, 2488, 623394))
A3_POOLS = POOLS3(P(-130490, 7096, 123394), INIT, P(-2833620, 2488, 2831132))
A4_POOLS = POOLS3(P(-125883, 2489, 123394), INIT, P(-126382, 2488, 123894))
# sweep-all intermediate states
S_P3C = POOLS3(INIT, INIT, P(-2488, 2488, 0))
S_P3Z = POOLS3(INIT, INIT, ZERO)
S_P2C = POOLS3(INIT, P(-2488, 2488, 0), ZERO)
S_P2Z = POOLS3(INIT, ZERO, ZERO)
S_MC = POOLS3(P(-2488, 2488, 0), ZERO, ZERO)
S_ALLZ = POOLS3(ZERO, ZERO, ZERO)
SWEEPS_ALL = [("swc", "p3"), ("swp", "p3"), ("swc", "p2"), ("swp", "p2"),
              ("swc", "main"), ("swp", "main")]
SWEEPS_ALL_EXPECT = [
    SWC("p3", 123394, S_P3C, volume=None),
    SWP("p3", 2488, S_P3Z, volume=None),
    SWC("p2", 123394, S_P2C, volume=None),
    SWP("p2", 2488, S_P2Z, volume=None),
    SWC("main", 123394, S_MC, volume=None),
    SWP("main", 2488, S_ALLZ, volume=None),
]

CASES = [
    # Family A -- fresh 3-hop anchors
    {"label": "a-mhbuy3-1e9", "steps": [("mhbuy3", (10**9, 1))],
     "expect": [MH(-1849400, D_BUY3_1E9, A1_POOLS, MHBUY_EV)]},
    {"label": "a-mhsell3-1e9", "steps": [("mhsell3", (10**9, 1))],
     "expect": [MH(-1849400, D_SELL3_1E9, A2_POOLS, MHSELL_EV)]},
    {"label": "a-mhbuy3-1e6", "steps": [("mhbuy3", (10**6, 1))],
     "expect": [MH(-1849400, D_BUY3_1E6, A3_POOLS, MHBUY_EV)]},
    {"label": "a-mhsell3-1e6", "steps": [("mhsell3", (10**6, 1))],
     "expect": [MH(-1849400, D_SELL3_1E6, A4_POOLS, MHSELL_EV)]},
    # Family B -- buy loop
    {"label": "b-mhbuy3-loop",
     "steps": [("mhbuy3", (10**9, 1)), ("swc", "p3"), ("col", "p3"),
               ("swc", "p2"), ("col", "p2"), ("swc", "main"), ("col", "main"),
               ("mhbuy3", (10**9, 1)), ("swc", "p3"), ("col", "p3")],
     "expect": [MH(-1849400, D_BUY3_1E9, A1_POOLS, MHBUY_EV),
                SWC("p3", 2671866295, POOLS3(P(-4733036, 4609642, 123394), INIT, P(-2488, 2488, 0))),
                COL("p3", 2671866295, POOLS3(P(-4733036, 4609642, 123394), INIT, P(-2488, 2488, 0))),
                SWC("p2", 123394, POOLS3(P(-4733036, 4609642, 123394), P(-2488, 2488, 0), P(-2488, 2488, 0))),
                COL("p2", 123394, POOLS3(P(-4733036, 4609642, 123394), P(-2488, 2488, 0), P(-2488, 2488, 0))),
                SWC("main", 123394, POOLS3(P(-4609642, 4609642, 0), P(-2488, 2488, 0), P(-2488, 2488, 0))),
                COL("main", 123394, POOLS3(P(-4609642, 4609642, 0), P(-2488, 2488, 0), P(-2488, 2488, 0))),
                MH(-5000, D_BUY3_2ND, POOLS3(P(-9216796, 9216796, 0), P(-2488, 2488, 0), P(-2601566810, 2488, 2601564322)), MHBUY_EV),
                SWC("p3", 2601564322, POOLS3(P(-9216796, 9216796, 0), P(-2488, 2488, 0), P(-2488, 2488, 0))),
                COL("p3", 2601564322, POOLS3(P(-9216796, 9216796, 0), P(-2488, 2488, 0), P(-2488, 2488, 0)))]},
    # Family C -- sell loop
    {"label": "c-mhsell3-loop",
     "steps": [("mhsell3", (10**9, 1)), ("swc", "main"), ("col", "main"),
               ("mhsell3", (10**9, 1)), ("swc", "p3"), ("col", "p3"),
               ("swp", "p3"), ("col", "p3")],
     "expect": [MH(-1849400, D_SELL3_1E9, A2_POOLS, MHSELL_EV),
                SWC("main", 123394, POOLS3(P(-3335, 3335, 0), INIT, P(-625882, 2488, 623394))),
                COL("main", 123394, POOLS3(P(-3335, 3335, 0), INIT, P(-625882, 2488, 623394))),
                MH(-5000, D_SELL3_2ND, POOLS3(P(-4182, 4182, 0), INIT, P(-1125881, 2488, 1123393)), MHSELL_EV),
                SWC("p3", 1123393, POOLS3(P(-4182, 4182, 0), INIT, P(-2488, 2488, 0))),
                COL("p3", 1123393, POOLS3(P(-4182, 4182, 0), INIT, P(-2488, 2488, 0))),
                SWP("p3", 2488, POOLS3(P(-4182, 4182, 0), INIT, ZERO)),
                NOOP(POOLS3(P(-4182, 4182, 0), INIT, ZERO))]},
    # Family D -- sweep-first
    {"label": "d-sweeps-all-mhbuy3",
     "steps": SWEEPS_ALL + [("mhbuy3", (10**9, 1))],
     "expect": SWEEPS_ALL_EXPECT + [
         MH(-1849400, D_BUY3_1E9, POOLS3(P(-4607154, 4607154, 0), ZERO, P(-2671742901, 0, 2671742901)), MHBUY_EV)]},
    {"label": "d-tail-sweeps-mhbuy3",
     "steps": [("swc", "p3"), ("swp", "p3"), ("mhbuy3", (10**9, 1))],
     "expect": [SWC("p3", 123394, S_P3C, volume=None),
                SWP("p3", 2488, S_P3Z, volume=None),
                MH(-1849400, D_BUY3_1E9, POOLS3(P(-4733036, 4609642, 123394), INIT, P(-2671742901, 0, 2671742901)), MHBUY_EV)]},
    {"label": "d-sweeps-all-mhsell3",
     "steps": SWEEPS_ALL + [("mhsell3", (10**9, 1))],
     "expect": SWEEPS_ALL_EXPECT + [
         MH(-1849400, D_SELL3_1E9, POOLS3(P(-847, 847, 0), ZERO, P(-500000, 0, 500000)), MHSELL_EV)]},
    {"label": "d-sweeps-all-mhbuy3-limit-exact",
     "steps": SWEEPS_ALL + [("mhbuy3", (10**9, 5315084721958))],
     "expect": SWEEPS_ALL_EXPECT + [
         MH(-1849400, D_BUY3_1E9, POOLS3(P(-4607154, 4607154, 0), ZERO, P(-2671742901, 0, 2671742901)), MHBUY_EV)]},
    {"label": "d-sweeps-all-mhbuy3-limit-plus1",
     "steps": SWEEPS_ALL + [("mhbuy3", (10**9, 5315084721959))],
     "expect": SWEEPS_ALL_EXPECT + [
         E(-5000, {}, S_ALLZ, None, event=MHBUY_EV, events=3, error="6004", rollback=True)]},
    # Family E -- protocol no-op + middle-pool independence
    {"label": "e-mhbuy3-proto-noop",
     "steps": [("mhbuy3", (10**9, 1)), ("swp", "p3"), ("col", "p3")],
     "expect": [MH(-1849400, D_BUY3_1E9, A1_POOLS, MHBUY_EV),
                SWP("p3", 2488, POOLS3(P(-4733036, 4609642, 123394), INIT, P(-2671866295, 0, 2671866295))),
                NOOP(POOLS3(P(-4733036, 4609642, 123394), INIT, P(-2671866295, 0, 2671866295)))]},
    {"label": "e-mhsell3-middle",
     "steps": [("mhsell3", (10**9, 1)), ("swc", "p2"), ("col", "p2")],
     "expect": [MH(-1849400, D_SELL3_1E9, A2_POOLS, MHSELL_EV),
                SWC("p2", 123394, POOLS3(P(-126729, 3335, 123394), P(-2488, 2488, 0), P(-625882, 2488, 623394))),
                COL("p2", 123394, POOLS3(P(-126729, 3335, 123394), P(-2488, 2488, 0), P(-625882, 2488, 623394)))]},
    # Family F -- cross-direction chain
    {"label": "f-mhbuy3-mhsell3-cross",
     "steps": [("mhbuy3", (10**9, 1)), ("mhsell3", (10**9, 1)), ("swc", "p3"), ("col", "p3")],
     "expect": [MH(-1849400, D_BUY3_1E9, A1_POOLS, MHBUY_EV),
                MH(-5000, D_CROSS_SELL, POOLS3(P(-4733915, 4610521, 123394), INIT, P(-2672374146, 2488, 2672371658)), MHSELL_EV),
                SWC("p3", 2672371658, POOLS3(P(-4733915, 4610521, 123394), INIT, P(-2488, 2488, 0))),
                COL("p3", 2672371658, POOLS3(P(-4733915, 4610521, 123394), INIT, P(-2488, 2488, 0)))]},
]

STEP_KIND = {"mhbuy3": "mhbuy3", "mhsell3": "mhsell3", "swp": "swp", "swc": "swc", "col": "col"}


def run_case(case, image_name, binary):
    h = setup_vm(binary)
    routes = {"buy": build_route(h, False), "sell": build_route(h, True)}
    out = []
    for step, exp in zip(case["steps"], case["expect"]):
        kind = step[0]
        args = step[1] if len(step) > 1 else None
        rec = do_step(h, kind, args, routes)
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
        for role in TOKEN_ROLES:
            if role in exp["deltas"]:
                continue
            got_d = tok_delta(rec, ROLE_KEY[role])
            check(got_d == 0, f"{tag}: unexpected delta {role} {got_d}")
        for pool_name, pool_key in (("main", pool), ("pool2", POOL2), ("p3", P3)):
            got_pool = pool_state(rec["after"][str(pool_key)])
            check(got_pool == exp["pools"][pool_name],
                  f"{tag}: pool {pool_name} {got_pool} != {exp['pools'][pool_name]}")
        got_vol = vol_state(rec["after"][str(volume)])
        check(got_vol == exp["volume"], f"{tag}: volume {got_vol} != {exp['volume']}")
        if exp.get("rollback"):
            for k, b in rec["before"].items():
                if k == str(PAYER_KEY):
                    continue
                check(rec["after"][k] == b, f"{tag}: rollback violated for {k}")
        if exp.get("event") is not None:
            raws = ev_list(rec["logs"])
            check(len(raws) == exp["events"],
                  f"{tag}: decoded events {len(raws)} != {exp['events']}")
            for raw in raws:
                got = decode_event(STEP_KIND[kind], raw)
                check(got is not None, f"{tag}: event decode failed")
                for fkey, want in exp["event"].items():
                    check(got.get(fkey) == want,
                          f"{tag}: event {fkey} {got.get(fkey)} != {want}")
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
        report_cases.append({"label": case["label"],
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
    print("ADDRESSES for verify.py:")
    for name, key in [("POOL", pool), ("POOL2", POOL2), ("P3", P3),
                      ("BASE2", BASE2), ("BASE3", BASE3),
                      ("VB2", VB2), ("VQ2", VQ2), ("VB3", VB3), ("VQ3", VQ3), ("U3", U3),
                      ("CREATOR", CREATOR), ("CREATOR_VAULT", CREATOR_VAULT),
                      ("PROTOCOL", PROTOCOL),
                      ("PROTOCOL_ATA", PROTOCOL_ATA), ("CREATOR_ATA", CREATOR_ATA),
                      ("DEST", DEST),
                      ("PROTOCOL_ATA_P3", PROTOCOL_ATA_P3), ("CREATOR_ATA_P3", CREATOR_ATA_P3),
                      ("DEST3", DEST3),
                      ("PROTOCOL_ATA_P2", PROTOCOL_ATA_P2), ("CREATOR_ATA_P2", CREATOR_ATA_P2),
                      ("DEST2", DEST2)]:
        print(f"  {name} = {key}")


if __name__ == "__main__":
    main()
