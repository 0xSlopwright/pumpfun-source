#!/usr/bin/env python3
"""Build research/amm-multi-hop-four-hop-mode-pools-chains-20261029 receipts.

3rd run packet #29: 4-hop multi-hop trades on cashback/mayhem pools chained
into sweep -> collect.

3rd #25 pinned a genuine original-vs-rebuilt divergence at 3 hops and 3rd #26
at 5 hops: the original image gates cashback only at the buy-direction tail
pool, while the rebuilt images (#424 control, #427 candidate) gate cashback
at every hop. Both prior hop counts are odd. This packet tests the even hop
count: at 4 hops, does the same rule hold with tail pool P4? Measured answer:
yes -- the rule is hop-count independent. The original passes non-terminal
cashback hops (main, P2, P3) in both directions and fails only at P4 (buy 3
ghost events, sell 0 ghost events); the rebuilds fail at every cashback hop
(buy ghosts 0/1/2/3, sell ghosts 3/2/1/0 for main/P2/P3/P4). Mayhem gates
every hop on all three images (buy ghosts 0/1/2/3, sell ghosts 3/2/1/0).
Both-flags precedence splits the same way: at a non-terminal hop the original
reports mayhem (6080) while the rebuilds report cashback (6079); at the
terminal P4 hop all images report cashback (6079). The cross combo
buy main-cashback + P4-mayhem diverges (original 6080 at P4 with 3 ghosts,
rebuilds 6079 at main with 0 ghosts); sell main-mayhem + P4-cashback agrees
(6079, 0 ghosts -- the first sell hop P4 is the cashback terminal hop on
every image). The loop case persists the divergence: on the original the
second buy through a cashback main pool still succeeds (out 5,041,513,990,535,
tail bucket re-accrued to 2,560,628,922 and drained); on the rebuilds every
attempt fails 6079 and the second sweep/collect are silent no-ops.

Plain 4-hop anchors (all images agree): buy 1e9 quote -> out 5,286,914,075,404
BASE4, buyback 4,607,153; main protocol +4,607,154, tail creator
+2,657,630,443, middle pools byte-identical. Sell 1e9 BASE4 -> out 180,345
quote, buyback 846; tail creator +500,000 exactly, main protocol +847.
Sweep converts its bucket into virtual quote reserves 1:1, so each pool's vq
after a creator sweep is exactly -(its pf). Protocol sweep output is never
collectable. The first successful multi-hop in a VM pays 1,844,400 rent +
5,000 fee and leaves a 137-byte accumulator for the payer; failed trades
never init it.

Fixture note: BASE3/base are SPL mints, not the native SOL mint, so the
P3/P4 creator/protocol vault ATAs and collect destinations use the NON-native
token layout (like userbase). The builder asserts every expected value below
per image before writing. The packet's producer.py is this file.
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
OUT = ROOT / "research/amm-multi-hop-four-hop-mode-pools-chains-20261029"
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
BASE4 = Pubkey.from_bytes(bytes([88]) * 32)
C4 = Pubkey.find_program_address([b'pool-authority', bytes(BASE4)], PUMP)[0]
P4, B4 = Pubkey.find_program_address([b'pool', bytes(2), bytes(C4), bytes(BASE4), bytes(BASE3)], PROGRAM)
VB4 = Pubkey.find_program_address([bytes(P4), bytes(TOKEN), bytes(BASE4)], ATA_PROG)[0]
VQ4 = Pubkey.find_program_address([bytes(P4), bytes(TOKEN), bytes(BASE3)], ATA_PROG)[0]
U4 = Pubkey.from_bytes(bytes([89]) * 32)
DEST4 = Pubkey.from_bytes(bytes([97]) * 32)
CREATOR_ATA_P4, _ = Pubkey.find_program_address([bytes(CREATOR_VAULT), bytes(TOKEN), bytes(BASE3)], ATA_PROG)
PROTOCOL_ATA_P4, _ = Pubkey.find_program_address([bytes(PROTOCOL), bytes(TOKEN), bytes(BASE3)], ATA_PROG)
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
    "p4": (P4, BASE3, VQ4, PROTOCOL_ATA_P4, CREATOR_ATA_P4, DEST4),
}
WATCH = [PAYER_KEY, pool, POOL2, P3, P4, base, quote, BASE2, BASE3, BASE4, lp, userbase,
         userquote, userlp, vaultbase, vaultquote, VB2, VQ2, VB3, VQ3, VB4, VQ4, U3, U4,
         buyback, volume, feeconfig, CONFIG_KEY,
         PROTOCOL_ATA, CREATOR_ATA, DEST,
         PROTOCOL_ATA_P3, CREATOR_ATA_P3, DEST3,
         PROTOCOL_ATA_P2, CREATOR_ATA_P2, DEST2,
         PROTOCOL_ATA_P4, CREATOR_ATA_P4, DEST4]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "vb1": vaultbase, "vq1": vaultquote, "vb2": VB2, "vq2": VQ2,
            "vb3": VB3, "vq3": VQ3, "vb4": VB4, "vq4": VQ4,
            "u3": U3, "u4": U4,
            "protoata": PROTOCOL_ATA, "creatorata": CREATOR_ATA, "dest": DEST,
            "protoata3": PROTOCOL_ATA_P3, "creatorata3": CREATOR_ATA_P3, "dest3": DEST3,
            "protoata2": PROTOCOL_ATA_P2, "creatorata2": CREATOR_ATA_P2, "dest2": DEST2,
            "protoata4": PROTOCOL_ATA_P4, "creatorata4": CREATOR_ATA_P4, "dest4": DEST4}
TOKEN_ROLES = ["userbase", "userquote", "userlp", "vb1", "vq1", "vb2", "vq2",
               "vb3", "vq3", "vb4", "vq4", "u3", "u4", "buyback",
               "protoata", "creatorata", "dest",
               "protoata3", "creatorata3", "dest3",
               "protoata2", "creatorata2", "dest2",
               "protoata4", "creatorata4", "dest4",
]
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
    vm.set_account(DEST4, Account(2039280, token(BASE3, CREATOR, 0, False), TOKEN))
    vm.set_account(CREATOR_ATA_P4, Account(2039280, token(BASE3, CREATOR_VAULT, 0, False), TOKEN))
    vm.set_account(PROTOCOL_ATA_P4, Account(2039280, token(BASE3, PROTOCOL, 0, False), TOKEN))
    for k in [PUMP_GLOBAL, PUMP_FEES, PUMP_EVENT]:
        vm.set_account(k, Account(10**9, b"", Pubkey.default()))
    return h


def build_route(h, sell):
    keys = MH_KEYS_SELL if sell else MH_KEYS_BUY
    ix = next(x for x in IDL["instructions"] if x["name"] == "multi_hop_swap")
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])] + list(MH_TAIL)
    three_amm(sell)(SimpleNamespace(vm=h.vm), metas)
    # P4 hop (mirrors 2nd #39 four_amm)
    h.vm.set_account(BASE4, h.vm.get_account(base))
    d = bytearray(poolraw)
    d[8] = B4
    d[9:11] = bytes(2)
    d[11:43] = bytes(C4)
    d[43:75] = bytes(BASE4)
    d[75:107] = bytes(BASE3)
    d[139:171] = bytes(VB4)
    d[171:203] = bytes(VQ4)
    h.vm.set_account(P4, Account(10**9, bytes(d), PROGRAM))
    for k, mi, ow in [(VB4, BASE4, P4), (VQ4, BASE3, P4), (U4, BASE4, PAYER_KEY)]:
        h.vm.set_account(k, Account(10**9, token(mi, ow, 10**15), TOKEN))
    g4 = [AccountMeta(BASE4, False, False), AccountMeta(BASE3, False, False),
          AccountMeta(P4, False, True), AccountMeta(VB4, False, True),
          AccountMeta(VQ4, False, True)]
    if sell:
        metas[16:16] = g4
        metas[1] = AccountMeta(U4, False, True)
    else:
        metas.extend(g4)
        metas[2] = AccountMeta(U4, False, True)
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
    if kind in ("mhbuy4", "mhsell4"):
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
    if kind in ("mhbuy4", "mhsell4"):
        ix = next(x for x in IDL["instructions"] if x["name"] == "multi_hop_swap")
        metas = routes["sell" if kind == "mhsell4" else "buy"]
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

D_BUY4_1E9 = {"userquote": -10**9, "vb1": -5385694844757, "vq1": 995392847,
              "vb2": -5356844515538, "vq2": 5385694844757,
              "vb3": -5328301632828, "vq3": 5356844515538,
              "vb4": -5286914075404, "vq4": 5328301632828,
              "u4": 5286914075404, "buyback": 4607153}
D_SELL4_1E9 = {"userquote": 180345, "vb1": 997497009, "vq1": -181191,
               "vb2": 997498005, "vq2": -997497009,
               "vb3": 997499001, "vq3": -997498005,
               "vb4": 10**9, "vq4": -997499001, "u4": -10**9, "buyback": 846}
D_BUY4_2ND = {"userquote": -10**9, "vb1": -5300268622007, "vq1": 995392847,
              "vb2": -5216136464071, "vq2": 5300268622007,
              "vb3": -5134060987112, "vq3": 5216136464071,
              "vb4": -5041513990535, "vq4": 5134060987112,
              "u4": 5041513990535, "buyback": 4607153}


def POOLS4(main, pool2, p3, p4):
    return {"main": main, "pool2": pool2, "p3": p3, "p4": p4}


def MH(dPAYER, deltas, pools, event):
    return E(dPAYER, deltas, pools, VOL, event=event, events=4)


def SWC(pool_tag, amount, pools, volume=VOL):
    return E(-5000, {"vq" + {"main": "1", "p2": "2", "p3": "3", "p4": "4"}[pool_tag]: -amount,
                     "creatorata" + {"main": "", "p2": "2", "p3": "3", "p4": "4"}[pool_tag]: amount},
             pools, volume, event=SWP_EV(amount, 1, CREATOR_VAULT))


def SWP(pool_tag, amount, pools, volume=VOL):
    return E(-5000, {"vq" + {"main": "1", "p2": "2", "p3": "3", "p4": "4"}[pool_tag]: -amount,
                     "protoata" + {"main": "", "p2": "2", "p3": "3", "p4": "4"}[pool_tag]: amount},
             pools, volume, event=SWP_EV(amount, 0, PROTOCOL))


def COL(pool_tag, amount, pools, volume=VOL):
    suffix = {"main": "", "p2": "2", "p3": "3", "p4": "4"}[pool_tag]
    vault_ata = {"main": CREATOR_ATA, "p2": CREATOR_ATA_P2, "p3": CREATOR_ATA_P3,
                 "p4": CREATOR_ATA_P4}[pool_tag]
    dest = {"main": DEST, "p2": DEST2, "p3": DEST3, "p4": DEST4}[pool_tag]
    return E(-5000, {"creatorata" + suffix: -amount, "dest" + suffix: amount},
             pools, volume, event=COL_EV(amount, vault_ata, dest))


def NOOP(pools, volume=VOL):
    return E(-5000, {}, pools, volume, events=0)


def FAIL(code, events, pools, event, volume=None):
    return E(-5000, {}, pools, volume, event=event, events=events,
             error=code, rollback=True)


def flag_pool(h, poolkey, mode):
    a = h.vm.get_account(poolkey)
    d = bytearray(a.data)
    if mode in ("cb", "both"):
        d[244] = 1
    if mode in ("mayhem", "both"):
        d[243] = 1
    h.vm.set_account(poolkey, Account(a.lamports, bytes(d), a.owner))


POOLKEYS = {"main": pool, "p2": POOL2, "p3": P3, "p4": P4}

# --- case expectations ---
A1_POOLS = POOLS4(P(-4733036, 4609642, 123394), INIT, INIT, P(-2657632931, 2488, 2657630443))
A2_POOLS = POOLS4(P(-126729, 3335, 123394), INIT, INIT, P(-625882, 2488, 623394))
A1_SWC = POOLS4(P(-4733036, 4609642, 123394), INIT, INIT, P(-2488, 2488, 0))
A2_SWC = POOLS4(P(-126729, 3335, 123394), INIT, INIT, P(-2488, 2488, 0))
S_P4C_SEED = POOLS4(INIT, INIT, INIT, P(-2488, 2488, 0))
L2_POOLS = POOLS4(P(-9340190, 9216796, 123394), INIT, INIT, P(-2560631410, 2488, 2560628922))
L2_SWC = POOLS4(P(-9340190, 9216796, 123394), INIT, INIT, P(-2488, 2488, 0))


def BUY_ORIG():
    return [MH(-1849400, D_BUY4_1E9, A1_POOLS, MHBUY_EV),
            SWC("p4", 2657630443, A1_SWC),
            COL("p4", 2657630443, A1_SWC)]


def SELL_ORIG():
    return [MH(-1849400, D_SELL4_1E9, A2_POOLS, MHSELL_EV),
            SWC("p4", 623394, A2_SWC),
            COL("p4", 623394, A2_SWC)]


def FAIL_SEED(code, ghosts, event):
    return [FAIL(code, ghosts, POOLS4(INIT, INIT, INIT, INIT), event),
            SWC("p4", 123394, S_P4C_SEED, volume=None),
            COL("p4", 123394, S_P4C_SEED, volume=None)]


CASES = [
    # Family A -- plain 4-hop anchors (agreement)
    {"label": "a-buy4", "flags": {}, "steps": [("mhbuy4", (10**9, 1))],
     "expect": [MH(-1849400, D_BUY4_1E9, A1_POOLS, MHBUY_EV)]},
    {"label": "a-sell4", "flags": {}, "steps": [("mhsell4", (10**9, 1))],
     "expect": [MH(-1849400, D_SELL4_1E9, A2_POOLS, MHSELL_EV)]},
    # Family B -- non-terminal cashback: DIVERGENCE (original passes, rebuilt fails)
    {"label": "b-buy-main-cb", "flags": {"main": "cb"},
     "steps": [("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": {"original": BUY_ORIG(), "rebuilt": FAIL_SEED("6079", 0, MHBUY_EV)}},
    {"label": "b-buy-p2-cb", "flags": {"p2": "cb"},
     "steps": [("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": {"original": BUY_ORIG(), "rebuilt": FAIL_SEED("6079", 1, MHBUY_EV)}},
    {"label": "b-buy-p3-cb", "flags": {"p3": "cb"},
     "steps": [("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": {"original": BUY_ORIG(), "rebuilt": FAIL_SEED("6079", 2, MHBUY_EV)}},
    {"label": "b-sell-main-cb", "flags": {"main": "cb"},
     "steps": [("mhsell4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": {"original": SELL_ORIG(), "rebuilt": FAIL_SEED("6079", 3, MHSELL_EV)}},
    {"label": "b-sell-p2-cb", "flags": {"p2": "cb"},
     "steps": [("mhsell4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": {"original": SELL_ORIG(), "rebuilt": FAIL_SEED("6079", 2, MHSELL_EV)}},
    {"label": "b-sell-p3-cb", "flags": {"p3": "cb"},
     "steps": [("mhsell4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": {"original": SELL_ORIG(), "rebuilt": FAIL_SEED("6079", 1, MHSELL_EV)}},
    # Family C -- terminal cashback (agreement: all fail)
    {"label": "c-buy-p4-cb", "flags": {"p4": "cb"},
     "steps": [("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6079", 3, MHBUY_EV)},
    {"label": "c-sell-p4-cb", "flags": {"p4": "cb"},
     "steps": [("mhsell4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6079", 0, MHSELL_EV)},
    # Family D -- mayhem every hop (agreement: all fail, ghost events = hops done)
    {"label": "d-buy-main-mayhem", "flags": {"main": "mayhem"},
     "steps": [("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6080", 0, MHBUY_EV)},
    {"label": "d-buy-p2-mayhem", "flags": {"p2": "mayhem"},
     "steps": [("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6080", 1, MHBUY_EV)},
    {"label": "d-buy-p3-mayhem", "flags": {"p3": "mayhem"},
     "steps": [("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6080", 2, MHBUY_EV)},
    {"label": "d-buy-p4-mayhem", "flags": {"p4": "mayhem"},
     "steps": [("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6080", 3, MHBUY_EV)},
    {"label": "d-sell-main-mayhem", "flags": {"main": "mayhem"},
     "steps": [("mhsell4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6080", 3, MHSELL_EV)},
    {"label": "d-sell-p2-mayhem", "flags": {"p2": "mayhem"},
     "steps": [("mhsell4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6080", 2, MHSELL_EV)},
    {"label": "d-sell-p3-mayhem", "flags": {"p3": "mayhem"},
     "steps": [("mhsell4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6080", 1, MHSELL_EV)},
    {"label": "d-sell-p4-mayhem", "flags": {"p4": "mayhem"},
     "steps": [("mhsell4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6080", 0, MHSELL_EV)},
    # Family E -- both-flags precedence (divergence except terminal-agreement cases)
    {"label": "e-buy-main-both", "flags": {"main": "both"},
     "steps": [("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": {"original": FAIL_SEED("6080", 0, MHBUY_EV),
                "rebuilt": FAIL_SEED("6079", 0, MHBUY_EV)}},
    {"label": "e-buy-p4-both", "flags": {"p4": "both"},
     "steps": [("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6079", 3, MHBUY_EV)},
    {"label": "e-sell-main-both", "flags": {"main": "both"},
     "steps": [("mhsell4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": {"original": FAIL_SEED("6080", 3, MHSELL_EV),
                "rebuilt": FAIL_SEED("6079", 3, MHSELL_EV)}},
    {"label": "e-sell-p4-both", "flags": {"p4": "both"},
     "steps": [("mhsell4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6079", 0, MHSELL_EV)},
    {"label": "e-buy-maincb-p4mayhem", "flags": {"main": "cb", "p4": "mayhem"},
     "steps": [("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": {"original": FAIL_SEED("6080", 3, MHBUY_EV),
                "rebuilt": FAIL_SEED("6079", 0, MHBUY_EV)}},
    {"label": "e-sell-mainmayhem-p4cb", "flags": {"main": "mayhem", "p4": "cb"},
     "steps": [("mhsell4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": FAIL_SEED("6079", 0, MHSELL_EV)},
    # Family F -- loop persistence of the divergence
    {"label": "f-buy-main-cb-loop", "flags": {"main": "cb"},
     "steps": [("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4"),
               ("mhbuy4", (10**9, 1)), ("swc", "p4"), ("col", "p4")],
     "expect": {
        "original": [MH(-1849400, D_BUY4_1E9, A1_POOLS, MHBUY_EV),
                     SWC("p4", 2657630443, A1_SWC),
                     COL("p4", 2657630443, A1_SWC),
                     MH(-5000, D_BUY4_2ND, L2_POOLS, MHBUY_EV),
                     SWC("p4", 2560628922, L2_SWC),
                     COL("p4", 2560628922, L2_SWC)],
        "rebuilt": [FAIL("6079", 0, POOLS4(INIT, INIT, INIT, INIT), MHBUY_EV),
                    SWC("p4", 123394, S_P4C_SEED, volume=None),
                    COL("p4", 123394, S_P4C_SEED, volume=None),
                    FAIL("6079", 0, S_P4C_SEED, MHBUY_EV),
                    NOOP(S_P4C_SEED, volume=None),
                    NOOP(S_P4C_SEED, volume=None)]}},
]


STEP_KIND = {"mhbuy4": "mhbuy4", "mhsell4": "mhsell4", "swp": "swp", "swc": "swc", "col": "col"}


def case_expect(case, image_name):
    exp = case["expect"]
    if isinstance(exp, dict):
        return exp["original" if image_name == "original" else "rebuilt"]
    return exp


def run_case(case, image_name, binary):
    h = setup_vm(binary)
    routes = {"buy": build_route(h, False), "sell": build_route(h, True)}
    for tag, mode in case.get("flags", {}).items():
        flag_pool(h, POOLKEYS[tag], mode)
    out = []
    for step, exp in zip(case["steps"], case_expect(case, image_name)):
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
        for pool_name, pool_key in (("main", pool), ("pool2", POOL2), ("p3", P3),
                                    ("p4", P4)):
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
        for image_name in IMAGES:
            for rec in per_image[image_name]:
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
        # This packet PINS a divergence on purpose: do not assert surface
        # equality. Record it instead; control must still equal candidate.
        base = surface(per_image["original"])
        divergent = (surface(per_image["control"]) != base
                     or surface(per_image["candidate"]) != base)
        check(surface(per_image["control"]) == surface(per_image["candidate"]),
              f"{case['label']}: control and candidate surfaces differ")
        report_cases.append({"label": case["label"],
                             "flags": case.get("flags", {}),
                             "divergent": divergent,
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
    for name, key in [("POOL", pool), ("POOL2", POOL2), ("P3", P3), ("P4", P4),
                      ("BASE2", BASE2), ("BASE3", BASE3), ("BASE4", BASE4),
                      ("VB2", VB2), ("VQ2", VQ2), ("VB3", VB3), ("VQ3", VQ3),
                      ("VB4", VB4), ("VQ4", VQ4),
                      ("U3", U3), ("U4", U4),
                      ("CREATOR", CREATOR), ("CREATOR_VAULT", CREATOR_VAULT),
                      ("PROTOCOL", PROTOCOL),
                      ("PROTOCOL_ATA", PROTOCOL_ATA), ("CREATOR_ATA", CREATOR_ATA),
                      ("DEST", DEST),
                      ("PROTOCOL_ATA_P3", PROTOCOL_ATA_P3), ("CREATOR_ATA_P3", CREATOR_ATA_P3),
                      ("DEST3", DEST3),
                      ("PROTOCOL_ATA_P2", PROTOCOL_ATA_P2), ("CREATOR_ATA_P2", CREATOR_ATA_P2),
                      ("DEST2", DEST2),
                      ("PROTOCOL_ATA_P4", PROTOCOL_ATA_P4), ("CREATOR_ATA_P4", CREATOR_ATA_P4),
                      ("DEST4", DEST4),
                                            ]:
        print(f"  {name} = {key}")


if __name__ == "__main__":
    main()
