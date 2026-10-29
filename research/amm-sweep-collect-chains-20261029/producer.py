#!/usr/bin/env python3
"""Build research/amm-sweep-collect-chains-20261029 receipts.

3rd run packet #4: the full fee pipeline from trade accrual to the
creator's wallet, chained one signed transaction per step on three
program images (original, #424 control, #427 candidate).

Sharp results (all three images agree on every step):
- Sweep anchors on the as-is fixture (protocol_fees 2,488,
  creator_fees 123,394, virtual_quote_reserves -125,882): a sweep to
  a fresh ATA costs 2,044,280 lamports (5,000 fee + 2,039,280 rent)
  and converts the accrual into virtual quote reserves -- sweep
  protocol leaves (vq -123,394, pf 0, cf 123,394), sweep creator
  leaves (vq -2,488, pf 2,488, cf 0), both leave (vq 0, pf 0, cf 0).
- Zero sweeps are silent no-ops: 0 events, payer 5,000 only, and a
  zero sweep does NOT create the recipient ATA (it returns before
  create_ata_if_empty). A second sweep of an emptied bucket is also
  a silent no-op ("Nothing to sweep for fee bucket N").
- Sweep gates: protocol sweep to a non-listed recipient fails 6013
  InvalidProtocolFeeRecipient (swap/mod.rs:164); creator sweep to a
  non-PDA recipient fails 2006 ConstraintSeeds (sweep_fees.rs:113).
- v2 pipeline: buy 10^10 accrues pf 10,975 / cf 128,869 in the pool;
  sweep_creator_fee moves exactly 128,869 to the creator vault ATA
  (pool cf 0, vq -10,975) and collect_coin_creator_fee drains exactly
  128,869 to the creator's token account (pool untouched). A collect
  after a protocol-only sweep is a silent no-op ("No coin creator
  fee to collect") -- protocol sweep output is NOT collectable.
- Sweeping does not move trade prices: after both sweeps, after the
  creator sweep alone, or after the protocol sweep alone, a 10^10
  trade settles byte-identical to its fresh anchor (buy spend
  1,847,796, sell payout 1,802,115, same events); only the pool
  pf/cf/vq starting point differs, because a sweep converts an
  accrual into virtual reserves 1:1 and the effective reserve
  (raw vault quote + vq) is unchanged.
- Legacy routing contrast: legacy buy 10^10 pays the creator leg
  5,475 straight to the creator vault ATA and leaves pool
  creator_fees untouched at 123,394, so a following sweep still
  moves 123,394 and a following collect drains 5,475 + 123,394 =
  128,869 in two steps. v2 buy, by contrast, accrues in the pool
  field and only the sweep feeds the vault ATA.

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

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-sweep-collect-chains-20261029"
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
OUTSIDER = Pubkey.from_bytes(bytes([7]) * 32)
OUTSIDER_ATA, _ = Pubkey.find_program_address([bytes(OUTSIDER), bytes(TOKEN), bytes(quote)], ATA_PROG)
GVOL = Pubkey.find_program_address([b'global_volume_accumulator'], PROGRAM)[0]
GDISC = bytes(next(x for x in IDL['accounts'] if x['name'] == 'GlobalVolumeAccumulator')['discriminator'])
POOLV2 = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)[0]
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
MX = 2**64 - 1
VQ0, PF0, CF0 = -125882, 2488, 123394
S_ASIS = 4194352106721

TRD_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
            buyback, EVENT, PROGRAM]
SWP_KEYS_P = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, PROTOCOL, PROTOCOL_ATA,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_C = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, CREATOR_VAULT, CREATOR_ATA,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_WP = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, OUTSIDER, OUTSIDER_ATA,
               Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_WC = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, PROTOCOL, PROTOCOL_ATA,
               Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
COL_KEYS = [quote, TOKEN, CREATOR, CREATOR_VAULT, CREATOR_ATA, DEST, EVENT, PROGRAM]
LEG_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote, vaultbase, vaultquote,
            PROTOCOL, PROTOCOL_ATA, TOKEN, TOKEN, Pubkey.default(), ATA_PROG, EVENT, PROGRAM,
            CREATOR_ATA, CREATOR_VAULT, GVOL, volume, feeconfig, FEES]
LEG_REM = [AccountMeta(POOLV2, False, False), AccountMeta(BB_OWNER, False, False),
           AccountMeta(buyback, False, True)]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTOCOL_ATA, CREATOR_ATA, DEST]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTOCOL_ATA, "creatorata": CREATOR_ATA, "dest": DEST}
SWP_DISC = "82a42461e48287a5"
COL_DISC = "e8f5c2eeeada3a59"
BUY_DISC = "67f4521f2cf57777"
SELL_DISC = "3e2f370aa503dc2a"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def setup_vm(binary, patch, variant):
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
    if patch.get("pf") is not None:
        pd[271:279] = struct.pack("<Q", patch["pf"])
    if patch.get("cf") is not None:
        pd[279:287] = struct.pack("<Q", patch["cf"])
    vm.set_account(pool, Account(f["accounts"]["pool"]["lamports"], bytes(pd), PROGRAM))
    mint = struct.pack("<I", 1) + bytes(pool) + struct.pack("<Q", supply) + bytes([9, 1]) + bytes(36)
    vm.set_account(lp, Account(10**9, mint, TOKEN22))
    vm.set_account(userbase, Account(10**9, token(base, PAYER_KEY, 10**15, False), TOKEN))
    vm.set_account(userquote, Account(10**15 + 2039280, token(quote, PAYER_KEY, 10**15, True), TOKEN))
    vm.set_account(userlp, Account(10**9, token(lp, PAYER_KEY, supply // 2, False), TOKEN22))
    vm.set_account(volume, Account(0, b"", Pubkey.default()))
    vm.set_account(DEST, Account(2039280, token(quote, CREATOR, 0, True), TOKEN))
    if variant == "creator_empty":
        vm.set_account(CREATOR_ATA, Account(2039280, token(quote, CREATOR_VAULT, 0, True), TOKEN))
    if variant == "legacy":
        vm.set_account(GVOL, Account(10**9, GDISC + struct.pack('<qqq', 0, 0, 86400) + bytes(base) + bytes(480), PROGRAM))
        vm.set_account(PROTOCOL_ATA, Account(10**15 + 2039280, token(quote, PROTOCOL, 0, True), TOKEN))
        vm.set_account(CREATOR_ATA, Account(10**9, token(quote, CREATOR_VAULT, 0, True), TOKEN))
        vm.set_account(PROTOCOL, Account(10**9, b'', Pubkey.default()))
        vm.set_account(CREATOR_VAULT, Account(10**9, b'', Pubkey.default()))
        vm.set_account(POOLV2, Account(10**9, b'', Pubkey.default()))
        vm.set_account(BB_OWNER, Account(10**9, b'', Pubkey.default()))
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
    if kind in ("buy", "lbuy"):
        base_ev = {"disc": raw[:8].hex(), "len": len(raw)}
        if kind == "buy":
            base_ev.update({"curve": u64(raw, 64), "lp_bps": u64(raw, 72),
                            "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
                            "proto_fee": u64(raw, 96), "qwlp": u64(raw, 104),
                            "uin": u64(raw, 112)})
        return base_ev
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
                "creator": raw[16:48].hex(),
                "fee": u64(raw, 48),
                "vault_ata": raw[56:88].hex(),
                "dest": raw[88:120].hex()}
    return None


def check(cond, msg):
    if not cond:
        raise AssertionError(msg)


def disc(name):
    return bytes(next(x for x in IDL["instructions"] if x["name"] == name)["discriminator"])


def do_step(h, kind, args):
    if kind == "buy":
        name, keys, data, rem = "buy_v2", TRD_KEYS, disc("buy_v2") + struct.pack("<QQ", args[0], MX), []
    elif kind == "sell":
        name, keys, data, rem = "sell_v2", TRD_KEYS, disc("sell_v2") + struct.pack("<QQ", args[0], 0), []
    elif kind == "lbuy":
        name, keys, data, rem = "buy", LEG_KEYS, disc("buy") + struct.pack("<QQ", args[0], 10**12) + b'\x00', LEG_REM
    elif kind == "swp":
        name, keys, data, rem = "sweep_protocol_fee", SWP_KEYS_P, disc("sweep_protocol_fee"), []
    elif kind == "swc":
        name, keys, data, rem = "sweep_creator_fee", SWP_KEYS_C, disc("sweep_creator_fee"), []
    elif kind == "swp_wrong":
        name, keys, data, rem = "sweep_protocol_fee", SWP_KEYS_WP, disc("sweep_protocol_fee"), []
    elif kind == "swc_wrong":
        name, keys, data, rem = "sweep_creator_fee", SWP_KEYS_WC, disc("sweep_creator_fee"), []
    elif kind == "col":
        name, keys, data, rem = "collect_coin_creator_fee", COL_KEYS, disc("collect_coin_creator_fee"), []
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


VOL_CREATED = {"lamports": 1844400, "len": 137, "user": bytes(PAYER_KEY).hex()}


def E(dPAYER, deltas, pool_after, volume, event=None, events=1, error=None,
      rollback=False, site_fragment=None, log_fragment=None, absent=None, lam_after=None):
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after),
            "volume": volume, "event": event, "events": events, "error": error,
            "rollback": rollback, "site_fragment": site_fragment,
            "log_fragment": log_fragment, "absent": absent or [],
            "lam_after": lam_after or {}}


def P(vq, pf, cf, sup=S_ASIS):
    return [vq, pf, cf, sup]


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


def COL_EV(fee):
    return {"disc": COL_DISC, "len": 120, "timestamp": 1234567890,
            "creator": bytes(CREATOR).hex(), "fee": fee,
            "vault_ata": bytes(CREATOR_ATA).hex(), "dest": bytes(DEST).hex()}


def BUY_EV(curve, lp_fee, proto_fee, qwlp, uin):
    return {"disc": BUY_DISC, "len": 500, "curve": curve, "lp_bps": 2,
            "lp_fee": lp_fee, "proto_bps": 93, "proto_fee": proto_fee,
            "qwlp": qwlp, "uin": uin}


def SELL_EV(curve, lp_fee, proto_fee, quote, uout):
    return {"disc": SELL_DISC, "len": 449, "curve": curve, "lp_bps": 2,
            "lp_fee": lp_fee, "proto_bps": 93, "proto_fee": proto_fee,
            "quote": quote, "uout": uout}


POOL_ASIS = P(VQ0, PF0, CF0)
D_BUY10 = {"userbase": 10**10, "userquote": -1847796, "userlp": 0,
           "vaultbase": -10**10, "vaultquote": 1839310, "buyback": 8486}
D_SELL10 = {"userbase": -10**10, "userquote": 1802115, "userlp": 0,
            "vaultbase": 10**10, "vaultquote": -1810601, "buyback": 8486}
D_BUY6 = {"userbase": 10**6, "userquote": -187, "userlp": 0,
          "vaultbase": -10**6, "vaultquote": 186, "buyback": 1}
EV_BUY10 = BUY_EV(1824983, 365, 16973, 1825348, 1847796)
EV_SELL10 = SELL_EV(1824927, 365, 16972, 1824562, 1802115)
EV_BUY6 = BUY_EV(183, 1, 2, 184, 187)

CASES = [
    # Family A -- sweep anchors
    {"label": "a-sweep-proto", "patch": {}, "variant": "std", "steps": [("swp", ())],
     "expect": [E(-2044280, {"protoata": 2488, "vaultquote": -2488},
                  P(-123394, 0, CF0), None,
                  event=SWP_EV(2488, 0, PROTOCOL),
                  lam_after={"protoata": 2039280 + 2488})]},
    {"label": "a-sweep-creator", "patch": {}, "variant": "std", "steps": [("swc", ())],
     "expect": [E(-2044280, {"creatorata": 123394, "vaultquote": -123394},
                  P(-2488, PF0, 0), None,
                  event=SWP_EV(123394, 1, CREATOR_VAULT),
                  lam_after={"creatorata": 2039280 + 123394})]},
    {"label": "a-sweep-both", "patch": {}, "variant": "std", "steps": [("swp", ()), ("swc", ())],
     "expect": [E(-2044280, {"protoata": 2488, "vaultquote": -2488},
                  P(-123394, 0, CF0), None,
                  event=SWP_EV(2488, 0, PROTOCOL),
                  lam_after={"protoata": 2039280 + 2488}),
                E(-2044280, {"creatorata": 123394, "vaultquote": -123394},
                  P(0, 0, 0), None,
                  event=SWP_EV(123394, 1, CREATOR_VAULT),
                  lam_after={"creatorata": 2039280 + 123394})]},
    {"label": "a-sweep-proto-zero", "patch": {"pf": 0}, "variant": "std", "steps": [("swp", ())],
     "expect": [E(-5000, {}, P(VQ0, 0, CF0), None, events=0,
                  log_fragment="Nothing to sweep", absent=["protoata"])]},
    {"label": "a-sweep-creator-zero", "patch": {"cf": 0}, "variant": "std", "steps": [("swc", ())],
     "expect": [E(-5000, {}, P(VQ0, PF0, 0), None, events=0,
                  log_fragment="Nothing to sweep", absent=["creatorata"])]},
    {"label": "a-sweep-proto-twice", "patch": {}, "variant": "std", "steps": [("swp", ()), ("swp", ())],
     "expect": [E(-2044280, {"protoata": 2488, "vaultquote": -2488},
                  P(-123394, 0, CF0), None,
                  event=SWP_EV(2488, 0, PROTOCOL),
                  lam_after={"protoata": 2039280 + 2488}),
                E(-5000, {}, P(-123394, 0, CF0), None, events=0,
                  log_fragment="Nothing to sweep")]},
    {"label": "a-sweep-creator-twice", "patch": {}, "variant": "std", "steps": [("swc", ()), ("swc", ())],
     "expect": [E(-2044280, {"creatorata": 123394, "vaultquote": -123394},
                  P(-2488, PF0, 0), None,
                  event=SWP_EV(123394, 1, CREATOR_VAULT),
                  lam_after={"creatorata": 2039280 + 123394}),
                E(-5000, {}, P(-2488, PF0, 0), None, events=0,
                  log_fragment="Nothing to sweep")]},
    {"label": "a-sweep-wrong-proto", "patch": {}, "variant": "std", "steps": [("swp_wrong", ())],
     "expect": [E(-5000, {}, POOL_ASIS, None, events=0, error="6013",
                  rollback=True, site_fragment="InvalidProtocolFeeRecipient")]},
    {"label": "a-sweep-wrong-creator", "patch": {}, "variant": "std", "steps": [("swc_wrong", ())],
     "expect": [E(-5000, {}, POOL_ASIS, None, events=0, error="2006",
                  rollback=True, site_fragment="ConstraintSeeds")]},
    # Family B -- v2 pipeline
    {"label": "b-v2buy-sweep-creator-collect", "patch": {}, "variant": "std",
     "steps": [("buy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [E(-1849400, D_BUY10, P(-139844, 10975, 128869), VOL_CREATED, event=EV_BUY10),
                E(-2044280, {"creatorata": 128869, "vaultquote": -128869},
                  P(-10975, 10975, 0), VOL_CREATED,
                  event=SWP_EV(128869, 1, CREATOR_VAULT),
                  lam_after={"creatorata": 2039280 + 128869}),
                E(-5000, {"creatorata": -128869, "dest": 128869},
                  P(-10975, 10975, 0), VOL_CREATED, event=COL_EV(128869),
                  lam_after={"dest": 2039280 + 128869})]},
    {"label": "b-v2buy-sweep-creator-collect-twice", "patch": {}, "variant": "std",
     "steps": [("buy", (10**10,)), ("swc", ()), ("col", ()), ("col", ())],
     "expect": [E(-1849400, D_BUY10, P(-139844, 10975, 128869), VOL_CREATED, event=EV_BUY10),
                E(-2044280, {"creatorata": 128869, "vaultquote": -128869},
                  P(-10975, 10975, 0), VOL_CREATED,
                  event=SWP_EV(128869, 1, CREATOR_VAULT),
                  lam_after={"creatorata": 2039280 + 128869}),
                E(-5000, {"creatorata": -128869, "dest": 128869},
                  P(-10975, 10975, 0), VOL_CREATED, event=COL_EV(128869),
                  lam_after={"dest": 2039280 + 128869}),
                E(-5000, {}, P(-10975, 10975, 0), VOL_CREATED, events=0,
                  log_fragment="No coin creator fee")]},
    {"label": "b-v2buy-sweep-proto-collect-empty", "patch": {}, "variant": "creator_empty",
     "steps": [("buy", (10**10,)), ("swp", ()), ("col", ())],
     "expect": [E(-1849400, D_BUY10, P(-139844, 10975, 128869), VOL_CREATED, event=EV_BUY10),
                E(-2044280, {"protoata": 10975, "vaultquote": -10975},
                  P(-128869, 0, 128869), VOL_CREATED,
                  event=SWP_EV(10975, 0, PROTOCOL),
                  lam_after={"protoata": 2039280 + 10975}),
                E(-5000, {}, P(-128869, 0, 128869), VOL_CREATED, events=0,
                  log_fragment="No coin creator fee")]},
    {"label": "b-v2buy-sweep-proto-buy-sweep-proto", "patch": {}, "variant": "std",
     "steps": [("buy", (10**10,)), ("swp", ()), ("buy", (10**6,)), ("swp", ())],
     "expect": [E(-1849400, D_BUY10, P(-139844, 10975, 128869), VOL_CREATED, event=EV_BUY10),
                E(-2044280, {"protoata": 10975, "vaultquote": -10975},
                  P(-128869, 0, 128869), VOL_CREATED,
                  event=SWP_EV(10975, 0, PROTOCOL),
                  lam_after={"protoata": 2039280 + 10975}),
                E(-5000, D_BUY6, P(-128871, 1, 128870), VOL_CREATED, event=EV_BUY6),
                E(-5000, {"protoata": 1, "vaultquote": -1},
                  P(-128870, 0, 128870), VOL_CREATED,
                  event=SWP_EV(1, 0, PROTOCOL),
                  lam_after={"protoata": 2039280 + 10976})]},
    {"label": "b-v2sell-sweep-creator-collect", "patch": {}, "variant": "std",
     "steps": [("sell", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [E(-1849400, D_SELL10, P(-139843, 10974, 128869), VOL_CREATED, event=EV_SELL10),
                E(-2044280, {"creatorata": 128869, "vaultquote": -128869},
                  P(-10974, 10974, 0), VOL_CREATED,
                  event=SWP_EV(128869, 1, CREATOR_VAULT),
                  lam_after={"creatorata": 2039280 + 128869}),
                E(-5000, {"creatorata": -128869, "dest": 128869},
                  P(-10974, 10974, 0), VOL_CREATED, event=COL_EV(128869),
                  lam_after={"dest": 2039280 + 128869})]},
    # Family C -- sweep preserves trade price
    {"label": "c-sweep-both-buy", "patch": {}, "variant": "std",
     "steps": [("swp", ()), ("swc", ()), ("buy", (10**10,))],
     "expect": [E(-2044280, {"protoata": 2488, "vaultquote": -2488},
                  P(-123394, 0, CF0), None,
                  event=SWP_EV(2488, 0, PROTOCOL),
                  lam_after={"protoata": 2039280 + 2488}),
                E(-2044280, {"creatorata": 123394, "vaultquote": -123394},
                  P(0, 0, 0), None,
                  event=SWP_EV(123394, 1, CREATOR_VAULT),
                  lam_after={"creatorata": 2039280 + 123394}),
                E(-1849400, D_BUY10, P(-13962, 8487, 5475), VOL_CREATED, event=EV_BUY10)]},
    {"label": "c-sweep-creator-buy", "patch": {}, "variant": "std",
     "steps": [("swc", ()), ("buy", (10**10,))],
     "expect": [E(-2044280, {"creatorata": 123394, "vaultquote": -123394},
                  P(-2488, PF0, 0), None,
                  event=SWP_EV(123394, 1, CREATOR_VAULT),
                  lam_after={"creatorata": 2039280 + 123394}),
                E(-1849400, D_BUY10, P(-16450, 10975, 5475), VOL_CREATED, event=EV_BUY10)]},
    {"label": "c-sweep-proto-sell", "patch": {}, "variant": "std",
     "steps": [("swp", ()), ("sell", (10**10,))],
     "expect": [E(-2044280, {"protoata": 2488, "vaultquote": -2488},
                  P(-123394, 0, CF0), None,
                  event=SWP_EV(2488, 0, PROTOCOL),
                  lam_after={"protoata": 2039280 + 2488}),
                E(-1849400, D_SELL10, P(-137355, 8486, 128869), VOL_CREATED, event=EV_SELL10)]},
    # Family D -- legacy routing contrast
    {"label": "d-legacybuy-sweep-creator-collect", "patch": {}, "variant": "legacy",
     "steps": [("lbuy", (10**10,)), ("swc", ()), ("col", ())],
     "expect": [E(-1849400, {"userbase": 10**10, "userquote": -1847796, "userlp": 0,
                             "vaultbase": -10**10, "vaultquote": 1825348,
                             "protoata": 8487, "creatorata": 5475, "buyback": 8486},
                  POOL_ASIS, VOL_CREATED,
                  event={"disc": BUY_DISC, "len": 497}),
                E(-5000, {"creatorata": 123394, "vaultquote": -123394},
                  P(-2488, PF0, 0), VOL_CREATED,
                  event=SWP_EV(123394, 1, CREATOR_VAULT)),
                E(-5000, {"creatorata": -128869, "dest": 128869},
                  P(-2488, PF0, 0), VOL_CREATED, event=COL_EV(128869))]},
    {"label": "d-legacybuy-collect-sweep-creator-collect", "patch": {}, "variant": "legacy",
     "steps": [("lbuy", (10**10,)), ("col", ()), ("swc", ()), ("col", ())],
     "expect": [E(-1849400, {"userbase": 10**10, "userquote": -1847796, "userlp": 0,
                             "vaultbase": -10**10, "vaultquote": 1825348,
                             "protoata": 8487, "creatorata": 5475, "buyback": 8486},
                  POOL_ASIS, VOL_CREATED,
                  event={"disc": BUY_DISC, "len": 497}),
                E(-5000, {"creatorata": -5475, "dest": 5475},
                  POOL_ASIS, VOL_CREATED, event=COL_EV(5475)),
                E(-5000, {"creatorata": 123394, "vaultquote": -123394},
                  P(-2488, PF0, 0), VOL_CREATED,
                  event=SWP_EV(123394, 1, CREATOR_VAULT)),
                E(-5000, {"creatorata": -123394, "dest": 123394},
                  P(-2488, PF0, 0), VOL_CREATED, event=COL_EV(123394))]},
]

STEP_KIND = {"buy": "buy", "sell": "sell", "lbuy": "lbuy", "swp": "swp",
             "swc": "swc", "swp_wrong": "swp", "swc_wrong": "swc", "col": "col"}


def run_case(case, image_name, binary):
    h = setup_vm(binary, case["patch"], case["variant"])
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
        report_cases.append({"label": case["label"], "patch": case["patch"],
                             "variant": case["variant"],
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
