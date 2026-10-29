#!/usr/bin/env python3
"""Build research/amm-multi-hop-sweep-collect-chains-20261029 receipts.

3rd run packet #12: multi-hop trades chained into sweep -> collect.
3rd #10 looped v2 trades through sweep -> collect, but multi-hop
was never chained: a multi-hop trade accrues its protocol/creator
fees into the pool (2nd #48: a 1-hop sell leaves protocol 849 /
creator 548 accrued, unlike legacy sell which pays the recipient
ATAs directly), so a sweep after a multi-hop trade should move a
much larger creator bucket -- and the loop question is open again:
does the drained state move the next multi-hop trade, and does a
sweep placed BEFORE a multi-hop trade reprice it? This packet runs
1-hop multi-hop buy/sell anchors, buy and sell loops
(mh -> sweep_creator_fee -> collect -> mh -> sweep -> collect),
sweep-first multi-hop trades, and a bucket-independence chain
(mh buy -> protocol sweep -> collect-noop -> creator sweep ->
collect) in single VMs, one signed transaction per step, on three
program images (original, #424 control, #427 candidate).

Sharp results (all three images agree on every step):
- A 1-hop multi-hop buy accrues BIG buckets: buy 10^9 quote lands
  5,368,809,031,467 base, vault +995,407,407, buyback +4,592,593,
  pool (-7,681,438, 4,595,081, 3,086,357) -- the creator bucket
  alone (3,086,357) is ~24x the v2 buy's 128,869, because the
  multi-hop fee split accrues the whole tail-hop fee load into
  the pool. The creator sweep moves exactly 3,086,357 and the
  collect drains exactly 3,086,357.
- The buy loop's fee legs are size-determined, not price-
  determined: the second buy 10^9 lands only 5,283,907,178,002
  base (curve moved) but its vault leg (+995,407,407), buyback
  (+4,592,593), and fee accruals (pf +4,592,593, cf +2,962,963)
  are BYTE-IDENTICAL to the first buy's. The protocol bucket
  keeps accruing across loops (4,595,081 -> 9,187,674) while
  only the creator bucket is swept.
- The sell loop reprices by exactly 1: second sell 10^9 pays
  180,211 (vs 180,212 anchor), vault -181,060 (vs -181,061),
  buyback 849 unchanged, second creator sweep moves exactly
  548. After both loops the protocol sweep moves 4,186 and the
  following collect is a silent no-op -- protocol sweep output
  is NOT collectable, now verified after multi-hop loops.
- Sweep-first multi-hop trades are byte-identical to fresh
  anchors: both sweeps then mh buy lands exactly
  5,368,809,031,467 base with identical vault/buyback legs, and
  both sweeps then mh sell pays exactly 180,212. The sweep's
  1:1 accrual-to-vq conversion keeps the effective reserve
  invariant for multi-hop pricing too (same arithmetic as
  3rd #6, now for the multi-hop path).
- Buckets are independent: after an mh buy, the protocol sweep
  moves 4,595,081, the following collect is a silent no-op, and
  the creator sweep still moves exactly 3,086,357 with a clean
  collect drain -- sweeping one bucket never disturbs the other.

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
from pump_amm_multi_hop_differential import PUMP, PUMP_GLOBAL, PUMP_FEES, PUMP_EVENT

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-multi-hop-sweep-collect-chains-20261029"
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
DEST = Pubkey.from_bytes(bytes([94]) * 32)
S_ASIS = 4194352106721

MH_KEYS_BUY = [PAYER_KEY, userquote, userbase, CONFIG_KEY, feeconfig, volume, buyback,
               TOKEN, TOKEN22, Pubkey.default(), EVENT, PROGRAM, PUMP, PUMP_GLOBAL, PUMP_FEES, PUMP_EVENT]
MH_KEYS_SELL = [PAYER_KEY, userbase, userquote, CONFIG_KEY, feeconfig, volume, buyback,
                TOKEN, TOKEN22, Pubkey.default(), EVENT, PROGRAM, PUMP, PUMP_GLOBAL, PUMP_FEES, PUMP_EVENT]
MH_TAIL = [AccountMeta(base, False, False), AccountMeta(quote, False, False),
           AccountMeta(pool, False, True), AccountMeta(vaultbase, False, True),
           AccountMeta(vaultquote, False, True)]
SWP_KEYS_P = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, PROTOCOL, PROTOCOL_ATA,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_C = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, CREATOR_VAULT, CREATOR_ATA,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
COL_KEYS = [quote, TOKEN, CREATOR, CREATOR_VAULT, CREATOR_ATA, DEST, EVENT, PROGRAM]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTOCOL_ATA, CREATOR_ATA, DEST]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTOCOL_ATA, "creatorata": CREATOR_ATA, "dest": DEST}
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
    for k in [PUMP_GLOBAL, PUMP_FEES, PUMP_EVENT]:
        vm.set_account(k, Account(10**9, b"", Pubkey.default()))
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
    if kind in ("mhbuy", "mhsell"):
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


def do_step(h, kind, args):
    if kind in ("mhbuy", "mhsell"):
        name = "multi_hop_swap"
        keys = MH_KEYS_BUY if kind == "mhbuy" else MH_KEYS_SELL
        ix = next(x for x in IDL["instructions"] if x["name"] == name)
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])] + list(MH_TAIL)
        data = bytes(ix["discriminator"]) + struct.pack("<QQ", args[0], 1)
    elif kind == "swp":
        name, keys, data = "sweep_protocol_fee", SWP_KEYS_P, disc("sweep_protocol_fee")
        ix = next(x for x in IDL["instructions"] if x["name"] == name)
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])]
    elif kind == "swc":
        name, keys, data = "sweep_creator_fee", SWP_KEYS_C, disc("sweep_creator_fee")
        ix = next(x for x in IDL["instructions"] if x["name"] == name)
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])]
    elif kind == "col":
        name, keys, data = "collect_coin_creator_fee", COL_KEYS, disc("collect_coin_creator_fee")
        ix = next(x for x in IDL["instructions"] if x["name"] == name)
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])]
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


def E(dPAYER, deltas, pool_after, volume, event=None, events=1, error=None,
      rollback=False, site_fragment=None, log_fragment=None, absent=None, lam_after=None):
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after),
            "volume": volume, "event": event, "events": events, "error": error,
            "rollback": rollback, "site_fragment": site_fragment,
            "log_fragment": log_fragment, "absent": absent or [],
            "lam_after": lam_after or {}}


def P(vq, pf, cf, sup=S_ASIS):
    return [vq, pf, cf, sup]


VOL = {"lamports": 1844400, "len": 137, "user": PAYER_HEX}


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


def COL_EV(amount):
    return {"disc": COL_DISC, "len": 120, "timestamp": 1234567890,
            "creator": bytes(CREATOR).hex(), "fee": amount,
            "vault_ata": bytes(CREATOR_ATA).hex(), "dest": bytes(DEST).hex()}


MHBUY_EV = {"disc": "67f4521f2cf57777", "len": 508}
MHSELL_EV = {"disc": "3e2f370aa503dc2a", "len": 449}

D_MHBUY1 = {"userbase": 5368809031467, "userquote": -10**9, "vaultbase": -5368809031467,
            "vaultquote": 995407407, "buyback": 4592593, "protoata": 0, "creatorata": 0, "dest": 0}
D_MHBUY2 = {"userbase": 5283907178002, "userquote": -10**9, "vaultbase": -5283907178002,
            "vaultquote": 995407407, "buyback": 4592593, "protoata": 0, "creatorata": 0, "dest": 0}
D_MHSELL1 = {"userbase": -10**9, "userquote": 180212, "vaultbase": 10**9,
             "vaultquote": -181061, "buyback": 849, "protoata": 0, "creatorata": 0, "dest": 0}
D_MHSELL2 = {"userbase": -10**9, "userquote": 180211, "vaultbase": 10**9,
             "vaultquote": -181060, "buyback": 849, "protoata": 0, "creatorata": 0, "dest": 0}
D_MHBUY_SMALL = {"userbase": 5411881565, "userquote": -10**6, "vaultbase": -5411881565,
                 "vaultquote": 995407, "buyback": 4593, "protoata": 0, "creatorata": 0, "dest": 0}


def SWC(amount, pool_after, volume=VOL):
    return E(-5000, {"vaultquote": -amount, "creatorata": amount}, pool_after, volume,
             event=SWP_EV(amount, 1, CREATOR_VAULT))


def SWP(amount, pool_after, volume=VOL):
    return E(-5000, {"vaultquote": -amount, "protoata": amount}, pool_after, volume,
             event=SWP_EV(amount, 0, PROTOCOL))


def COL(amount, pool_after, volume=VOL):
    return E(-5000, {"creatorata": -amount, "dest": amount}, pool_after, volume,
             event=COL_EV(amount))


def NOOP(pool_after, volume=VOL):
    return E(-5000, {}, pool_after, volume, events=0)


CASES = [
    # Family A -- fresh 1-hop multi-hop anchors
    {"label": "a-mhbuy-1e9", "steps": [("mhbuy", (10**9,))],
     "expect": [E(-1849400, D_MHBUY1, P(-7681438, 4595081, 3086357), VOL, event=MHBUY_EV)]},
    {"label": "a-mhsell-1e9", "steps": [("mhsell", (10**9,))],
     "expect": [E(-1849400, D_MHSELL1, P(-127279, 3337, 123942), VOL, event=MHSELL_EV)]},
    {"label": "a-mhbuy-1e6", "steps": [("mhbuy", (10**6,))],
     "expect": [E(-1849400, D_MHBUY_SMALL, P(-133438, 7081, 126357), VOL, event=MHBUY_EV)]},
    # Family B -- buy loop: mhbuy -> swc -> col -> mhbuy -> swc -> col
    {"label": "b-mhbuy-loop",
     "steps": [("mhbuy", (10**9,)), ("swc", ()), ("col", ()), ("mhbuy", (10**9,)),
               ("swc", ()), ("col", ())],
     "expect": [E(-1849400, D_MHBUY1, P(-7681438, 4595081, 3086357), VOL, event=MHBUY_EV),
                SWC(3086357, P(-4595081, 4595081, 0)),
                COL(3086357, P(-4595081, 4595081, 0)),
                E(-5000, D_MHBUY2, P(-12150637, 9187674, 2962963), VOL, event=MHBUY_EV),
                SWC(2962963, P(-9187674, 9187674, 0)),
                COL(2962963, P(-9187674, 9187674, 0))]},
    # Family C -- sell loop: mhsell -> swc -> col -> mhsell -> swc -> col -> swp -> col-noop
    {"label": "c-mhsell-loop",
     "steps": [("mhsell", (10**9,)), ("swc", ()), ("col", ()), ("mhsell", (10**9,)),
               ("swc", ()), ("col", ()), ("swp", ()), ("col", ())],
     "expect": [E(-1849400, D_MHSELL1, P(-127279, 3337, 123942), VOL, event=MHSELL_EV),
                SWC(123942, P(-3337, 3337, 0)),
                COL(123942, P(-3337, 3337, 0)),
                E(-5000, D_MHSELL2, P(-4734, 4186, 548), VOL, event=MHSELL_EV),
                SWC(548, P(-4186, 4186, 0)),
                COL(548, P(-4186, 4186, 0)),
                SWP(4186, P(0, 0, 0)),
                NOOP(P(0, 0, 0))]},
    # Family D -- sweep-first multi-hop trades (volume unfunded until the trade)
    {"label": "d-sweeps-mhbuy",
     "steps": [("swc", ()), ("swp", ()), ("mhbuy", (10**9,))],
     "expect": [SWC(123394, P(-2488, 2488, 0), volume=None),
                SWP(2488, P(0, 0, 0), volume=None),
                E(-1849400, D_MHBUY1, P(-7555556, 4592593, 2962963), VOL, event=MHBUY_EV)]},
    {"label": "d-sweeps-mhsell",
     "steps": [("swc", ()), ("swp", ()), ("mhsell", (10**9,))],
     "expect": [SWC(123394, P(-2488, 2488, 0), volume=None),
                SWP(2488, P(0, 0, 0), volume=None),
                E(-1849400, D_MHSELL1, P(-1397, 849, 548), VOL, event=MHSELL_EV)]},
    # Family E -- bucket independence: mhbuy -> swp -> col-noop -> swc -> col
    {"label": "e-mhbuy-buckets",
     "steps": [("mhbuy", (10**9,)), ("swp", ()), ("col", ()), ("swc", ()), ("col", ())],
     "expect": [E(-1849400, D_MHBUY1, P(-7681438, 4595081, 3086357), VOL, event=MHBUY_EV),
                SWP(4595081, P(-3086357, 0, 3086357)),
                NOOP(P(-3086357, 0, 3086357)),
                SWC(3086357, P(0, 0, 0)),
                COL(3086357, P(0, 0, 0))]},
]

STEP_KIND = {"mhbuy": "mhbuy", "mhsell": "mhsell", "swp": "swp", "swc": "swc", "col": "col"}


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
        if exp["events"] is not None:
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


if __name__ == "__main__":
    main()
