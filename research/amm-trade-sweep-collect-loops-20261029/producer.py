#!/usr/bin/env python3
"""Build research/amm-trade-sweep-collect-loops-20261029 receipts.

3rd run packet #10: the full fee pipeline LOOPED. 3rd #4 chained a
single trade -> sweep -> collect pass and left the loop open: does
the pipeline reset cleanly for the next trade, or does the drained
state move the next trade's price? This packet runs buy, sell, and
buy_exact loops (trade -> sweep_creator_fee -> collect -> trade ->
sweep_creator_fee -> collect) in single VMs, one signed transaction
per step, on three program images (original, #424 control, #427
candidate).

Sharp results (all three images agree on every step):
- Collect drains exactly what the sweep moved, and the pool is
  untouched by collect: buy 10^10 accrues cf 128,869, the creator
  sweep moves exactly 128,869 to the creator vault ATA (pool cf 0,
  vq -10,975), and collect drains exactly 128,869 to DEST. The
  second collect after a drained vault ATA is a silent no-op
  (0 events, payer 5,000 only).
- The loop does NOT reset the price: the second buy 10^10 costs
  1,847,852, 56 more than the fresh anchor (1,847,796), with vault
  +1,839,366 vs +1,839,310 -- the first buy moved the curve, and
  neither the sweep nor the collect undoes that. The second sell
  pays 1,802,061, 54 less than its anchor (1,802,115). The second
  buy_exact lands 54,106,324,497, a full 8,693,806 below its anchor
  (54,115,018,303) at the same 10,000,000 spend -- exact is the
  most curve-sensitive leg in the loop.
- What DOES reset is the fee plumbing: every sweep moves exactly
  the current pool creator bucket (128,869, then 5,476 on the buy
  loop; 128,869, then 5,475 on the sell loop; 153,024, then 29,630
  on the exact loop) and every collect drains exactly that sweep's
  output. The creator vault ATA ends at 0 after every collect.
- Protocol sweep output is NOT collectable, in-chain: after both
  creator sweeps and collects, a protocol sweep moves 19,462 to
  the protocol ATA and the following collect is a silent no-op
  (0 events), with the protocol ATA balance untouched -- the same
  gate 3rd #4 pinned for a single pass, now verified after a full
  loop has already drained the creator side twice.
- Pool fee fields after each trade are the running sum, not a
  reset: after buy -> sweep -> collect -> buy, pf is 19,462
  (10,975 + 8,487) and cf is 5,476 -- the collect drained the
  vault ATA, not the pool, so the pool's protocol bucket keeps
  accruing across loops while only the creator bucket is swept.

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
OUT = ROOT / "research/amm-trade-sweep-collect-loops-20261029"
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
MX = 2**64 - 1
S_ASIS = 4194352106721

TRD_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
            buyback, EVENT, PROGRAM]
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
    vm.set_account(DEST, Account(2039280, token(quote, CREATOR, 0, True), TOKEN))
    vm.set_account(CREATOR_ATA, Account(2039280, token(quote, CREATOR_VAULT, 0, True), TOKEN))
    vm.set_account(PROTOCOL_ATA, Account(2039280, token(quote, PROTOCOL, 0, True), TOKEN))
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
    if kind == "buy":
        name, keys, data = "buy_v2", TRD_KEYS, disc("buy_v2") + struct.pack("<QQ", args[0], MX)
    elif kind == "sell":
        name, keys, data = "sell_v2", TRD_KEYS, disc("sell_v2") + struct.pack("<QQ", args[0], 0)
    elif kind == "exact":
        name, keys, data = "buy_exact_quote_in_v2", TRD_KEYS, disc("buy_exact_quote_in_v2") + struct.pack("<QQ", args[0], 1)
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


BUY_EV1 = {"disc": "67f4521f2cf57777", "len": 500, "curve": 1824983, "lp_bps": 2,
           "lp_fee": 365, "proto_bps": 93, "proto_fee": 16973, "qwlp": 1825348, "uin": 1847796}
BUY_EV2 = {"disc": "67f4521f2cf57777", "len": 500, "curve": 1825037, "lp_bps": 2,
           "lp_fee": 366, "proto_bps": 93, "proto_fee": 16973, "qwlp": 1825403, "uin": 1847852}
SELL_EV1 = {"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824927, "lp_bps": 2,
            "lp_fee": 365, "proto_bps": 93, "proto_fee": 16972, "quote": 1824562, "uout": 1802115}
SELL_EV2 = {"disc": "3e2f370aa503dc2a", "len": 449, "curve": 1824873, "lp_bps": 2,
            "lp_fee": 365, "proto_bps": 93, "proto_fee": 16972, "quote": 1824508, "uout": 1802061}
EXACT_EV = {"disc": "67f4521f2cf57777", "len": 515}

D_BUY1 = {"userbase": 10**10, "userquote": -1847796, "vaultbase": -10**10,
          "vaultquote": 1839310, "buyback": 8486, "protoata": 0, "creatorata": 0, "dest": 0}
D_BUY2 = {"userbase": 10**10, "userquote": -1847852, "vaultbase": -10**10,
          "vaultquote": 1839366, "buyback": 8486, "protoata": 0, "creatorata": 0, "dest": 0}
D_SELL1 = {"userbase": -10**10, "userquote": 1802115, "vaultbase": 10**10,
           "vaultquote": -1810601, "buyback": 8486, "protoata": 0, "creatorata": 0, "dest": 0}
D_SELL2 = {"userbase": -10**10, "userquote": 1802061, "vaultbase": 10**10,
           "vaultquote": -1810547, "buyback": 8486, "protoata": 0, "creatorata": 0, "dest": 0}
D_EXACT1 = {"userbase": 54115018303, "userquote": -10**7, "vaultbase": -54115018303,
            "vaultquote": 9954074, "buyback": 45926, "protoata": 0, "creatorata": 0, "dest": 0}
D_EXACT2 = {"userbase": 54106324497, "userquote": -10**7, "vaultbase": -54106324497,
            "vaultquote": 9954074, "buyback": 45926, "protoata": 0, "creatorata": 0, "dest": 0}


def SWC(amount, pool_after):
    return E(-5000, {"vaultquote": -amount, "creatorata": amount}, pool_after, VOL,
             event=SWP_EV(amount, 1, CREATOR_VAULT))


def COL(amount, pool_after):
    return E(-5000, {"creatorata": -amount, "dest": amount}, pool_after, VOL,
             event=COL_EV(amount))


def NOOP(pool_after):
    return E(-5000, {}, pool_after, VOL, events=0)


CASES = [
    # Family A -- fresh anchors
    {"label": "a-buy-1e10", "steps": [("buy", (10**10,))],
     "expect": [E(-1849400, D_BUY1, P(-139844, 10975, 128869), VOL, event=BUY_EV1)]},
    {"label": "a-sell-1e10", "steps": [("sell", (10**10,))],
     "expect": [E(-1849400, D_SELL1, P(-139843, 10974, 128869), VOL, event=SELL_EV1)]},
    {"label": "a-exact-1e7", "steps": [("exact", (10**7,))],
     "expect": [E(-1849400, D_EXACT1, P(-201438, 48414, 153024), VOL, event=EXACT_EV)]},
    # Family B -- buy loop: buy -> swc -> col -> buy -> swc -> col -> swp -> col-noop
    {"label": "b-buy-loop",
     "steps": [("buy", (10**10,)), ("swc", ()), ("col", ()), ("buy", (10**10,)),
               ("swc", ()), ("col", ()), ("swp", ()), ("col", ())],
     "expect": [E(-1849400, D_BUY1, P(-139844, 10975, 128869), VOL, event=BUY_EV1),
                SWC(128869, P(-10975, 10975, 0)),
                COL(128869, P(-10975, 10975, 0)),
                E(-5000, D_BUY2, P(-24938, 19462, 5476), VOL, event=BUY_EV2),
                SWC(5476, P(-19462, 19462, 0)),
                COL(5476, P(-19462, 19462, 0)),
                E(-5000, {"vaultquote": -19462, "protoata": 19462}, P(0, 0, 0), VOL,
                  event=SWP_EV(19462, 0, PROTOCOL)),
                NOOP(P(0, 0, 0))]},
    # Family C -- sell loop: sell -> swc -> col -> sell -> swc -> col -> col-noop
    {"label": "c-sell-loop",
     "steps": [("sell", (10**10,)), ("swc", ()), ("col", ()), ("sell", (10**10,)),
               ("swc", ()), ("col", ()), ("col", ())],
     "expect": [E(-1849400, D_SELL1, P(-139843, 10974, 128869), VOL, event=SELL_EV1),
                SWC(128869, P(-10974, 10974, 0)),
                COL(128869, P(-10974, 10974, 0)),
                E(-5000, D_SELL2, P(-24935, 19460, 5475), VOL, event=SELL_EV2),
                SWC(5475, P(-19460, 19460, 0)),
                COL(5475, P(-19460, 19460, 0)),
                NOOP(P(-19460, 19460, 0))]},
    # Family D -- exact loop: exact -> swc -> col -> exact -> swc -> col
    {"label": "d-exact-loop",
     "steps": [("exact", (10**7,)), ("swc", ()), ("col", ()), ("exact", (10**7,)),
               ("swc", ()), ("col", ())],
     "expect": [E(-1849400, D_EXACT1, P(-201438, 48414, 153024), VOL, event=EXACT_EV),
                SWC(153024, P(-48414, 48414, 0)),
                COL(153024, P(-48414, 48414, 0)),
                E(-5000, D_EXACT2, P(-123970, 94340, 29630), VOL, event=EXACT_EV),
                SWC(29630, P(-94340, 94340, 0)),
                COL(29630, P(-94340, 94340, 0))]},
]

STEP_KIND = {"buy": "buy", "sell": "sell", "exact": "exact",
             "swp": "swp", "swc": "swc", "col": "col"}


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
