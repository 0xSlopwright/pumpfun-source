#!/usr/bin/env python3
"""Build research/amm-sweep-legacy-sell-neutrality-20261029 receipts.

3rd run packet #7: legacy sell after a sweep -- the gap 3rd #6 left
open in its Limits (it chained sweeps into deposit, withdraw, and
legacy buy, but not legacy sell). The question is sharp because
legacy sell differs from v2 sell in one structural way: it transfers
its fee legs straight to the recipient ATAs and leaves the pool
accrual fields untouched, so a sweep after a legacy sell still finds
the ORIGINAL accruals to move, while a sweep before it must leave
the sell price untouched if the legacy curve prices off a
sweep-invariant reserve (as 3rd #6 showed for legacy buy).

Sharp results (all three images agree on every step):
- Sweep -> legacy sell legs are BYTE-IDENTICAL to fresh anchors at
  three scales: sell 10^9 (user +180,212, vault -182,458,
  protocol 849 / creator 548 / buyback 849), sell 10^10 (+1,802,115 /
  -1,824,562 / 8,486 / 5,475 / 8,486), sell 10^6 (+178 / -181 /
  1 / 1 / 1). Partial sweeps (protocol-only, creator-only) also
  leave the legs untouched: the leg moves with neither bucket.
- Post-sweep limit gates pin the sell price to the unit: after both
  sweeps, sell 10^9 with minquote 180,212 succeeds and 180,213
  fails 6004 ExceededSlippage (sell.rs:189 original), full rollback.
- A legacy sell accrues nothing to the pool: pool fields are
  (-125,882, 2,488, 123,394) before and after every sell, so the
  sweeps after a sell still move the original 2,488 / 123,394.
- The sweep between two sells is transparent: sell -> sell and
  sell -> sweep -> sell agree on the second sell to the unit
  (second 10^9: +180,211 / -182,457; second 10^10 after a first
  10^9: +1,802,110 / -1,824,557). The first sell moves the curve
  by changing the vaults; the sweep in the middle moves nothing.

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
OUT = ROOT / "research/amm-sweep-legacy-sell-neutrality-20261029"
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
GVOL = Pubkey.find_program_address([b'global_volume_accumulator'], PROGRAM)[0]
GDISC = bytes(next(x for x in IDL['accounts'] if x['name'] == 'GlobalVolumeAccumulator')['discriminator'])
POOLV2 = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)[0]
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
MX = 2**64 - 1
VQ0, PF0, CF0 = -125882, 2488, 123394
S_ASIS = 4194352106721

SWP_KEYS_P = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, PROTOCOL, PROTOCOL_ATA,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_C = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, CREATOR_VAULT, CREATOR_ATA,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
LEG_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote, vaultbase, vaultquote,
            PROTOCOL, PROTOCOL_ATA, TOKEN, TOKEN, Pubkey.default(), ATA_PROG, EVENT, PROGRAM,
            CREATOR_ATA, CREATOR_VAULT, feeconfig, FEES]
LEG_REM = [AccountMeta(POOLV2, False, False), AccountMeta(BB_OWNER, False, False),
           AccountMeta(buyback, False, True)]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTOCOL_ATA, CREATOR_ATA]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTOCOL_ATA, "creatorata": CREATOR_ATA}
SWP_DISC = "82a42461e48287a5"
SELL_DISC = "3e2f370aa503dc2a"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def setup_vm(binary):
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
    if kind == "lsell":
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
    elif kind == "lsell":
        name, keys, data, rem = "sell", LEG_KEYS, disc("sell") + struct.pack("<QQ", args[0], args[1] if len(args) > 1 else 0), LEG_REM
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


def LSELL_EV(curve, lp_fee, proto_fee, quote, uout):
    return {"disc": SELL_DISC, "len": 449, "curve": curve, "lp_bps": 2,
            "lp_fee": lp_fee, "proto_bps": 93, "proto_fee": proto_fee,
            "quote": quote, "uout": uout}


POOL_ASIS = P(VQ0, PF0, CF0)
SWP_P = E(-5000, {"protoata": 2488, "vaultquote": -2488},
          P(-123394, 0, CF0), None,
          event=SWP_EV(2488, 0, PROTOCOL))
SWP_C = E(-5000, {"creatorata": 123394, "vaultquote": -123394},
          P(-2488, PF0, 0), None,
          event=SWP_EV(123394, 1, CREATOR_VAULT))
D_SELL9 = {"userbase": -10**9, "userquote": 180212, "userlp": 0,
           "vaultbase": 10**9, "vaultquote": -182458,
           "protoata": 849, "creatorata": 548, "buyback": 849}
D_SELL10 = {"userbase": -10**10, "userquote": 1802115, "userlp": 0,
            "vaultbase": 10**10, "vaultquote": -1824562,
            "protoata": 8486, "creatorata": 5475, "buyback": 8486}
D_SELL6 = {"userbase": -10**6, "userquote": 178, "userlp": 0,
           "vaultbase": 10**6, "vaultquote": -181,
           "protoata": 1, "creatorata": 1, "buyback": 1}
EV_SELL9 = LSELL_EV(182495, 37, 1698, 182458, 180212)
EV_SELL10 = LSELL_EV(1824927, 365, 16972, 1824562, 1802115)
EV_SELL6 = LSELL_EV(182, 1, 2, 181, 178)
D_SELL9_2ND = {"userbase": -10**9, "userquote": 180211, "userlp": 0,
               "vaultbase": 10**9, "vaultquote": -182457,
               "protoata": 849, "creatorata": 548, "buyback": 849}
D_SELL10_2ND = {"userbase": -10**10, "userquote": 1802110, "userlp": 0,
                "vaultbase": 10**10, "vaultquote": -1824557,
                "protoata": 8486, "creatorata": 5475, "buyback": 8486}

import copy
def swp_after(pool_after):
    e = copy.deepcopy(SWP_P)
    e["pool_after"] = list(pool_after)
    return e
def swc_after(pool_after):
    e = copy.deepcopy(SWP_C)
    e["pool_after"] = list(pool_after)
    return e

CASES = [
    # Family A -- fresh anchors
    {"label": "a-lsell-1e9", "steps": [("lsell", (10**9,))],
     "expect": [E(-5000, D_SELL9, POOL_ASIS, None, event=EV_SELL9)]},
    {"label": "a-lsell-1e10", "steps": [("lsell", (10**10,))],
     "expect": [E(-5000, D_SELL10, POOL_ASIS, None, event=EV_SELL10)]},
    {"label": "a-lsell-1e6", "steps": [("lsell", (10**6,))],
     "expect": [E(-5000, D_SELL6, POOL_ASIS, None, event=EV_SELL6)]},
    # Family S -- sweep -> sell: legs identical to anchors
    {"label": "s-both-lsell-1e9",
     "steps": [("swp", ()), ("swc", ()), ("lsell", (10**9,))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, D_SELL9, P(0, 0, 0), None, event=EV_SELL9)]},
    {"label": "s-creator-lsell-1e9",
     "steps": [("swc", ()), ("lsell", (10**9,))],
     "expect": [SWP_C,
                E(-5000, D_SELL9, P(-2488, PF0, 0), None, event=EV_SELL9)]},
    {"label": "s-proto-lsell-1e9",
     "steps": [("swp", ()), ("lsell", (10**9,))],
     "expect": [SWP_P,
                E(-5000, D_SELL9, P(-123394, 0, CF0), None, event=EV_SELL9)]},
    {"label": "s-both-lsell-1e10",
     "steps": [("swp", ()), ("swc", ()), ("lsell", (10**10,))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, D_SELL10, P(0, 0, 0), None, event=EV_SELL10)]},
    {"label": "s-both-lsell-1e6",
     "steps": [("swp", ()), ("swc", ()), ("lsell", (10**6,))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, D_SELL6, P(0, 0, 0), None, event=EV_SELL6)]},
    # Family L -- post-sweep limit gates pin the sell price to the unit
    {"label": "l-both-lsell-min-plus1",
     "steps": [("swp", ()), ("swc", ()), ("lsell", (10**9, 180213))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, {}, P(0, 0, 0), None, events=0, error="6004",
                  rollback=True, site_fragment="ExceededSlippage")]},
    {"label": "l-both-lsell-min-exact",
     "steps": [("swp", ()), ("swc", ()), ("lsell", (10**9, 180212))],
     "expect": [SWP_P, swc_after(P(0, 0, 0)),
                E(-5000, D_SELL9, P(0, 0, 0), None, event=EV_SELL9)]},
    # Family R -- sweep between two sells is transparent
    {"label": "r-sell-sell",
     "steps": [("lsell", (10**9,)), ("lsell", (10**9,))],
     "expect": [E(-5000, D_SELL9, POOL_ASIS, None, event=EV_SELL9),
                E(-5000, D_SELL9_2ND, POOL_ASIS, None,
                  event={"disc": SELL_DISC, "len": 449, "quote": 182457, "uout": 180211})]},
    {"label": "r-sell-sweep-sell",
     "steps": [("lsell", (10**9,)), ("swp", ()), ("swc", ()), ("lsell", (10**9,))],
     "expect": [E(-5000, D_SELL9, POOL_ASIS, None, event=EV_SELL9),
                swp_after(P(-123394, 0, CF0)),
                swc_after(P(0, 0, 0)),
                E(-5000, D_SELL9_2ND, P(0, 0, 0), None,
                  event={"disc": SELL_DISC, "len": 449, "quote": 182457, "uout": 180211})]},
    {"label": "r-sell-sell-1e10",
     "steps": [("lsell", (10**9,)), ("lsell", (10**10,))],
     "expect": [E(-5000, D_SELL9, POOL_ASIS, None, event=EV_SELL9),
                E(-5000, D_SELL10_2ND, POOL_ASIS, None,
                  event={"disc": SELL_DISC, "len": 449, "quote": 1824557, "uout": 1802110})]},
    {"label": "r-sell-sweep-sell-1e10",
     "steps": [("lsell", (10**9,)), ("swp", ()), ("swc", ()), ("lsell", (10**10,))],
     "expect": [E(-5000, D_SELL9, POOL_ASIS, None, event=EV_SELL9),
                swp_after(P(-123394, 0, CF0)),
                swc_after(P(0, 0, 0)),
                E(-5000, D_SELL10_2ND, P(0, 0, 0), None,
                  event={"disc": SELL_DISC, "len": 449, "quote": 1824557, "uout": 1802110})]},
]

STEP_KIND = {"swp": "swp", "swc": "swc", "lsell": "lsell"}


def run_case(case, image_name, binary):
    h = setup_vm(binary)
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
        report_cases.append({"label": case["label"], "variant": "legacy",
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
