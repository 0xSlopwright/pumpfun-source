#!/usr/bin/env python3
"""Build research/amm-multi-hop-five-hop-20261029 receipts.

2nd run packet #39: multi_hop_swap through FIVE AMM hops (2nd run
packet #18 covered four hops only). The handler reads remaining
accounts in groups of 5 with no hop cap
(multi_hop_swap.rs:273 count = remaining.len() / 5), so a fifth
pool chains cleanly. All cases on the shared v1/v2 fixture, 3
images (original / #424 control / #427 candidate):

- buy 10^9 quote chains hop1 -> hop2 -> hop3 -> hop4 -> hop5 and
  lands 5,259,040,470,738 of the fifth base in U5 (4-hop landed
  5,286,914,075,404 of the fourth base, so the fifth hop costs
  27,873,604,666); buy 10^6 lands 5,415,387,061 (4-hop:
  5,415,416,462). Per-hop vault deltas are exact (see README).
  The buyback recipient takes the same whole input-side fee as
  3-hop and 4-hop: +4,607,153 on the 10^9 buy, +4,607 on the
  10^6 buy -- the fifth hop adds no buyback fee, so buyback
  accrues at the tail (main pool) hop only, not per hop.
- sell 10^9 of the fifth base lands 180,345 quote in userquote
  (IDENTICAL to the 3-hop and 4-hop sells) and sell 10^6 lands
  180 (identical). The extra hop's haircut rounds away in the
  tail hop: the 5-hop tail input is 997,496,013 base vs 4-hop's
  997,497,009 (996 less), yet the tail still pays gross
  181,191, user nets 180,345, buyback takes 846
  (181,191 = 180,345 + 846).
- the limit is a NET-receipt floor, checked once at the end:
  buy limit exactly 5,259,040,470,738 passes; sell limit
  exactly 180,345 passes, +1 fails 6004, and a sell limit set
  to the gross vault payout 181,191 FAILS, so a limit set to
  the vault delta is wrong;
- SHARPEST PIN: buy-side 5-hop limit failure does NOT return
  clean 6004. On all 3 images it surfaces as
  ProgramFailedToComplete (SBF panic "memory allocation
  failed, out of memory") after all 5 hops ran -- the original
  image logs the 6004 AnchorError first, the rebuilt images
  panic without logging it. 4-hop buy limit failure returned
  clean Tagged(6004), and 5-hop sell limit failure still
  returns clean Tagged(6004), so the panic is buy-side and
  5-hop specific in this harness. State still rolls back and
  the payer loses only 5,000;
- every successful trade funds the user volume accumulator
  with exactly 1,844,400 lamports (payer delta -1,849,400) and
  emits 5 events (one per hop);
- amount 0 fails ZeroQuoteAmount (6002) and limit 0 fails
  ZeroBaseAmount (6001) in BOTH directions, before any hop
  runs; swapping hop5's two mints fails MultiHopMixedDirection
  (6086) in both directions; a junk hop5 mint, or truncating
  the route to four hops (buy) / dropping the hop5 group
  (sell), fails MultiHopDiscontinuousPath (6084); 24 remaining
  accounts (not a multiple of 5) fails
  NotEnoughRemainingAccounts (6044); a hop5 pool owned by
  nobody fails AccountTypeNotSupported (6027) in both
  directions; an unsigned user fails AccountNotSigner (3010).
  All error cases roll back everything except the payer's
  5,000 fee, and the volume accumulator is NOT funded on
  error;
- all three images agree on every case: this packet pins
  behavior, it does not claim a divergence (except the
  log-surface split on the buy panic case, which is itself
  pinned per image).
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
from solders.instruction import AccountMeta
from solders.pubkey import Pubkey
from solders.transaction import Transaction

from pump_amm_legacy_sell_differential import (
    base, quote, pool, vaultbase, vaultquote, userbase, userquote,
    PAYER, PROGRAM, PUMP, TOKEN, ATA, poolraw, token,
)
from pump_amm_liquidity_differential import OUTSIDER
from pump_amm_multi_hop_differential import (
    run, three_amm, buyback, volume, BASE2, BASE3, P3, VB2, VB3, VQ2, VQ3,
)
from pump_amm_trade_v2_differential import feeconfig

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-multi-hop-five-hop-20261029"
WS = Path.home() / "workspace/slop-verify"

IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
FEES_SHA = hashlib.sha256((ROOT / "evidence/original/pump_fees/deployed.so").read_bytes()).hexdigest()
PUMP_SHA = hashlib.sha256((ROOT / "evidence/original/pump/deployed.so").read_bytes()).hexdigest()

BASE4 = Pubkey.from_bytes(bytes([88]) * 32)
C4 = Pubkey.find_program_address([b'pool-authority', bytes(BASE4)], PUMP)[0]
P4, B4 = Pubkey.find_program_address([b'pool', bytes(2), bytes(C4), bytes(BASE4), bytes(BASE3)], PROGRAM)
VB4 = Pubkey.find_program_address([bytes(P4), bytes(TOKEN), bytes(BASE4)], ATA)[0]
VQ4 = Pubkey.find_program_address([bytes(P4), bytes(TOKEN), bytes(BASE3)], ATA)[0]
U4 = Pubkey.from_bytes(bytes([89]) * 32)

BASE5 = Pubkey.from_bytes(bytes([90]) * 32)
C5 = Pubkey.find_program_address([b'pool-authority', bytes(BASE5)], PUMP)[0]
P5, B5 = Pubkey.find_program_address([b'pool', bytes(2), bytes(C5), bytes(BASE5), bytes(BASE4)], PROGRAM)
VB5 = Pubkey.find_program_address([bytes(P5), bytes(TOKEN), bytes(BASE5)], ATA)[0]
VQ5 = Pubkey.find_program_address([bytes(P5), bytes(TOKEN), bytes(BASE4)], ATA)[0]
U5 = Pubkey.from_bytes(bytes([91]) * 32)

WATCH = {
    "userquote": userquote,
    "u5": U5,
    "buyback": buyback,
    "vb1": vaultbase,
    "vq1": vaultquote,
    "vb2": VB2,
    "vq2": VQ2,
    "vb3": VB3,
    "vq3": VQ3,
    "vb4": VB4,
    "vq4": VQ4,
    "vb5": VB5,
    "vq5": VQ5,
}

BUY_1E9 = {
    "userquote": -10**9, "u5": 5259040470738, "buyback": 4607153,
    "vb1": -5385694844757, "vq1": 995392847,
    "vb2": -5356844515538, "vq2": 5385694844757,
    "vb3": -5328301632828, "vq3": 5356844515538,
    "vb4": -5300061308171, "vq4": 5328301632828,
    "vb5": -5259040470738, "vq5": 5300061308171,
}
BUY_1E6 = {
    "userquote": -10**6, "u5": 5415387061, "buyback": 4607,
    "vb1": -5429043355, "vq1": 995393,
    "vb2": -5429013880, "vq2": 5429043355,
    "vb3": -5428984405, "vq3": 5429013880,
    "vb4": -5428954930, "vq4": 5428984405,
    "vb5": -5415387061, "vq5": 5428954930,
}
SELL_1E9 = {
    "userquote": 180345, "u5": -10**9, "buyback": 846,
    "vb1": 997496013, "vq1": -181191,
    "vb2": 997497009, "vq2": -997496013,
    "vb3": 997498005, "vq3": -997497009,
    "vb4": 997499001, "vq4": -997498005,
    "vb5": 10**9, "vq5": -997499001,
}
SELL_1E6 = {
    "userquote": 180, "u5": -10**6, "buyback": 1,
    "vb1": 997496, "vq1": -181,
    "vb2": 997497, "vq2": -997496,
    "vb3": 997498, "vq3": -997497,
    "vb4": 997499, "vq4": -997498,
    "vb5": 10**6, "vq5": -997499,
}

# (label, amount, limit, sell, override, unsigned, expected)
# override: five | swap5 | junk5 | trunc20 | rem24 | pool5owner
# expected: ("hop5", delta-dict) | ("error", code, fragment) |
#           ("panic", "ProgramFailedToComplete", "memory allocation failed")
CASES = [
    ("buy-1e9", 10**9, 1, False, "five", False, ("hop5", BUY_1E9)),
    ("buy-1e6", 10**6, 1, False, "five", False, ("hop5", BUY_1E6)),
    ("buy-1e9-limit-exact", 10**9, 5259040470738, False, "five", False, ("hop5", BUY_1E9)),
    ("buy-1e9-limit-plus1", 10**9, 5259040470739, False, "five", False, ("panic", "ProgramFailedToComplete", "memory allocation failed")),
    ("buy-1e6-limit-plus1", 10**6, 5415387062, False, "five", False, ("panic", "ProgramFailedToComplete", "memory allocation failed")),
    ("buy-amount0", 0, 1, False, "five", False, ("error", "6002", "ZeroQuoteAmount")),
    ("buy-limit0", 10**9, 0, False, "five", False, ("error", "6001", "ZeroBaseAmount")),
    ("buy-hop5-swap", 10**9, 1, False, "swap5", False, ("error", "6086", "MultiHopMixedDirection")),
    ("buy-hop5-junk", 10**9, 1, False, "junk5", False, ("error", "6084", "MultiHopDiscontinuousPath")),
    ("buy-remaining-20", 10**9, 1, False, "trunc20", False, ("error", "6084", "MultiHopDiscontinuousPath")),
    ("buy-remaining-24", 10**9, 1, False, "rem24", False, ("error", "6044", "NotEnoughRemainingAccounts")),
    ("buy-hop5-pool-bad-owner", 10**9, 1, False, "pool5owner", False, ("error", "6027", "AccountTypeNotSupported")),
    ("buy-unsigned", 10**9, 1, False, "five", True, ("error", "3010", "AccountNotSigner")),
    ("sell-1e9", 10**9, 1, True, "five", False, ("hop5", SELL_1E9)),
    ("sell-1e6", 10**6, 1, True, "five", False, ("hop5", SELL_1E6)),
    ("sell-1e9-limit-exact", 10**9, 180345, True, "five", False, ("hop5", SELL_1E9)),
    ("sell-1e9-limit-plus1", 10**9, 180346, True, "five", False, ("error", "6004", "ExceededSlippage")),
    ("sell-1e9-limit-gross", 10**9, 181191, True, "five", False, ("error", "6004", "ExceededSlippage")),
    ("sell-hop5-swap", 10**9, 1, True, "swap5", False, ("error", "6086", "MultiHopMixedDirection")),
    ("sell-hop5-junk", 10**9, 1, True, "junk5", False, ("error", "6084", "MultiHopDiscontinuousPath")),
    ("sell-remaining-20", 10**9, 1, True, "trunc20", False, ("error", "6084", "MultiHopDiscontinuousPath")),
    ("sell-remaining-24", 10**9, 1, True, "rem24", False, ("error", "6044", "NotEnoughRemainingAccounts")),
    ("sell-hop5-pool-bad-owner", 10**9, 1, True, "pool5owner", False, ("error", "6027", "AccountTypeNotSupported")),
    ("sell-amount0", 0, 1, True, "five", False, ("error", "6002", "ZeroQuoteAmount")),
    ("sell-limit0", 10**9, 0, True, "five", False, ("error", "6001", "ZeroBaseAmount")),
]


def four_amm(sell=False):
    def ov(h, m):
        three_amm(sell)(h, m)
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
        for k, mi, ow in [(VB4, BASE4, P4), (VQ4, BASE3, P4), (U4, BASE4, PAYER.pubkey())]:
            h.vm.set_account(k, Account(10**9, token(mi, ow, 10**15), TOKEN))
        group = [AccountMeta(BASE4, False, False), AccountMeta(BASE3, False, False),
                 AccountMeta(P4, False, True), AccountMeta(VB4, False, True),
                 AccountMeta(VQ4, False, True)]
        if sell:
            m[16:16] = group
            m[1] = AccountMeta(U4, False, True)
        else:
            m.extend(group)
            m[2] = AccountMeta(U4, False, True)
    return ov


def five_amm(sell=False):
    def ov(h, m):
        four_amm(sell)(h, m)
        h.vm.set_account(BASE5, h.vm.get_account(base))
        d = bytearray(poolraw)
        d[8] = B5
        d[9:11] = bytes(2)
        d[11:43] = bytes(C5)
        d[43:75] = bytes(BASE5)
        d[75:107] = bytes(BASE4)
        d[139:171] = bytes(VB5)
        d[171:203] = bytes(VQ5)
        h.vm.set_account(P5, Account(10**9, bytes(d), PROGRAM))
        for k, mi, ow in [(VB5, BASE5, P5), (VQ5, BASE4, P5), (U5, BASE5, PAYER.pubkey())]:
            h.vm.set_account(k, Account(10**9, token(mi, ow, 10**15), TOKEN))
        group = [AccountMeta(BASE5, False, False), AccountMeta(BASE4, False, False),
                 AccountMeta(P5, False, True), AccountMeta(VB5, False, True),
                 AccountMeta(VQ5, False, True)]
        if sell:
            m[16:16] = group
            m[1] = AccountMeta(U5, False, True)
        else:
            m.extend(group)
            m[2] = AccountMeta(U5, False, True)
    return ov


def make_override(kind, sell):
    def ov(h, m):
        five_amm(sell)(h, m)
        if kind == "five":
            return
        if kind == "swap5":
            i = 16 if sell else len(m) - 5
            m[i], m[i + 1] = m[i + 1], m[i]
        elif kind == "junk5":
            i = 16 if sell else len(m) - 5
            m[i] = AccountMeta(Pubkey.from_bytes(bytes([0x99]) * 32), False, False)
        elif kind == "trunc20":
            if sell:
                del m[16:21]
            else:
                del m[36:]
        elif kind == "rem24":
            del m[-1:]
        elif kind == "pool5owner":
            a = h.vm.get_account(P5)
            h.vm.set_account(P5, Account(a.lamports, bytes(a.data), Pubkey.default()))
        else:
            raise ValueError(kind)
    return ov


def sha(data):
    return hashlib.sha256(data).hexdigest()


def amount_at(data_hex, offset=64):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


receipts_global = []
report_cases = []
for index, (label, amount, limit, sell, override, unsigned, expected) in enumerate(CASES):
    fee_payer = OUTSIDER if unsigned else PAYER
    row = {"case": {"instruction": "multi_hop_swap", "label": label,
                     "amount": amount, "limit": limit, "sell": sell,
                     "override": override, "unsigned": unsigned,
                     "expected": {"kind": expected[0],
                                  **({"deltas": expected[1]} if expected[0] == "hop5" else
                                     {"code": expected[1], "fragment": expected[2]})}}}
    seen = set()
    for image in ("original", "control", "candidate"):
        r = run(amount=amount, limit=limit, sell=sell,
                overrides=make_override(override, sell),
                candidate=None if image == "original" else IMAGES[image],
                unsigned=unsigned)
        raw = base64.b64decode(r["transaction_base64"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == 1, (label, image, checks)
        before, after = r["before"], r["after"]
        fee_key = str(fee_payer.pubkey())
        payer_delta = (after[fee_key]["lamports"] if after.get(fee_key) else 0) - \
                      (before[fee_key]["lamports"] if before.get(fee_key) else 0)
        err, logs = r["error"], r["logs"]
        logtext = "\n".join(logs)
        if expected[0] == "hop5":
            assert err is None, (label, image, err)
            deltas = {}
            for name, key in WATCH.items():
                deltas[name] = amount_at(after[str(key)]["data_hex"]) - \
                    amount_at(before[str(key)]["data_hex"])
            assert deltas == expected[1], (label, image, deltas, expected[1])
            assert payer_delta == -1849400, (label, image, payer_delta)
            vol = after[str(volume)]
            assert vol is not None and vol["lamports"] == 1844400, (label, image, vol)
            assert len(bytes.fromhex(vol["data_hex"])) == 137, (label, image, "volume len")
            assert bytes.fromhex(vol["data_hex"])[8:40] == bytes(PAYER.pubkey()), \
                (label, image, "volume user")
            assert len(r["events"]) == 5, (label, image, len(r["events"]))
            observed = {"deltas": deltas, "payer_lamports_delta": payer_delta,
                        "volume_lamports": 1844400, "volume_data_len": 137,
                        "event_count": 5, "sig_fields": 1}
        elif expected[0] == "panic":
            _, code, fragment = expected
            assert err is not None and code in err, (label, image, err)
            assert fragment in logtext, (label, image, logs[-3:])
            # Log-surface split, pinned per image: only the original
            # image logs the 6004 AnchorError before panicking; the
            # rebuilt images panic without logging it.
            if image == "original":
                assert "ExceededSlippage" in logtext, (label, image, "no 6004 log")
            else:
                assert "ExceededSlippage" not in logtext, (label, image, "unexpected 6004 log")
            assert payer_delta == -5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != fee_key), \
                (label, image, "rollback")
            assert len(r["events"]) == 5, (label, image, len(r["events"]))
            site = next((l for l in logs if "memory allocation failed" in l), None)
            row.setdefault("error_sites", {})[image] = site
            observed = {"panic": True, "fragment": fragment,
                        "payer_lamports_delta": payer_delta,
                        "event_count": 5, "sig_fields": 1}
        else:
            _, code, fragment = expected
            assert err is not None and code in err, (label, image, err)
            assert fragment in logtext, (label, image, logs[-3:])
            assert payer_delta == -5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != fee_key), \
                (label, image, "rollback")
            # NOTE: no events==0 assertion here. Unlike legacy handlers,
            # multi-hop emits one event per hop as it runs, and the
            # final limit check (6004) and the buy-side hop5 pool
            # validation (6027) happen AFTER earlier hops ran, so those
            # failed transactions still carry hop events in their logs
            # (sell limit failures: 5; buy pool5owner: 4; sell
            # pool5owner: 0, since hop5 runs first on sells). State
            # still rolls back; only the logs retain the events. The
            # count is recorded and must agree across all 3 images
            # (via `seen`).
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            row.setdefault("error_sites", {})[image] = site
            observed = {"error_code": code, "fragment": fragment,
                        "payer_lamports_delta": payer_delta,
                        "event_count": len(r["events"]), "sig_fields": 1}
        seen.add((err, json.dumps(observed, sort_keys=True)))
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image,
                        "instruction": "multi_hop_swap", "label": label},
            "transaction_base64": r["transaction_base64"],
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
            "all_signatures_verified": True, "signature_fields": 1,
            "before": before, "after": after,
            "metadata": {"signature": str(tx.signatures[0]), "logs": logs,
                         "events": r["events"]},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890,
                      "epoch": 0, "leader_schedule_epoch": 0,
                      "unix_timestamp": 1234567890},
            "loaded_programs": {
                "pAMM": {"path": "evidence/original/pump_amm/deployed.so",
                         "sha256": IMAGE_SHA[image]},
                "pFEES": {"path": "evidence/original/pump_fees/deployed.so",
                          "sha256": FEES_SHA},
                "pPUMP": {"path": "evidence/original/pump/deployed.so",
                          "sha256": PUMP_SHA}},
            "error": err, "rollback_except_payer_fee": err is not None,
            "payer_delta_lamports": payer_delta,
            "observed": observed,
            "roles": {"fee_payer": fee_key, "userquote": str(userquote),
                      "u5": str(U5), "buyback": str(buyback),
                      "vb1": str(vaultbase), "vq1": str(vaultquote),
                      "vb2": str(VB2), "vq2": str(VQ2),
                      "vb3": str(VB3), "vq3": str(VQ3),
                      "vb4": str(VB4), "vq4": str(VQ4),
                      "vb5": str(VB5), "vq5": str(VQ5),
                      "volume": str(volume)},
        })
        row[image] = {"error": err, "logs": logs, "observed": observed}
        print(f"  {label} [{image}] error={err} observed={observed}")
    assert len(seen) == 1, (label, "images must agree", seen)
    report_cases.append(row)

(OUT / "runtime").mkdir(parents=True, exist_ok=True)
lines = [json.dumps(r).encode() for r in receipts_global]
parts = []
for i in range(0, len(lines), 10):
    chunk = lines[i:i + 10]
    data = gzip.compress(b"\n".join(chunk) + b"\n", mtime=0)
    name = f"runtime/raw-transactions-part{i // 10 + 1}.jsonl.gz"
    (OUT / name).write_bytes(data)
    parts.append({"path": name, "sha256": sha(data), "receipts": len(chunk)})
    print(name, len(data), "bytes")
repo_inputs = [
    "evidence/original/pump_amm/deployed.so",
    "evidence/upstream/pump_amm.json",
    "evidence/upstream/pump.json",
    "scripts/pump_amm_multi_hop_differential.py",
    "scripts/pump_amm_legacy_sell_differential.py",
    "scripts/pump_amm_trade_v2_differential.py",
    "scripts/pump_amm_liquidity_differential.py",
    "scripts/pump_amm_reusable_harness.py",
    "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json",
    "research/imported-lab/analysis/pump_fun/config-snapshot.json",
]
report = {"schema": 1, "packet": "amm-multi-hop-five-hop-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("multi_hop_swap through FIVE AMM hops, pinned on all 3 "
                    "images (original / #424 control / #427 candidate). "
                    "Fresh VM per case per image. Receipts are stored as "
                    "parts to stay under GitHub's 25MB web-upload limit; "
                    "verify.py reads them in order. Snapshots cover "
                    "non-executable accounts only. No source change, "
                    "build, or whole-program equivalence claim."),
          "image_sha256": IMAGE_SHA,
          "cases": report_cases,
          "counts": {"vms": len(receipts_global),
                     "transactions": len(receipts_global),
                     "signature_fields": len(receipts_global)},
          "input_sha256": {n: sha((ROOT / n).read_bytes()) for n in repo_inputs},
          "transaction_receipts": {"parts": parts}}
(OUT / "runtime/report.json.gz").write_bytes(
    gzip.compress(json.dumps(report, indent=1).encode(), mtime=0))
print(f"cases: {len(report_cases)} receipts: {len(receipts_global)}")
print(f"wrote: {OUT / 'runtime/report.json.gz'}")

sites_lines = []
for row in report_cases:
    case = row["case"]
    if case["expected"]["kind"] != "error" and case["expected"]["kind"] != "panic":
        continue
    per = []
    for image in ("original", "control", "candidate"):
        site = row.get("error_sites", {}).get(image, "") or ""
        if site and "thrown in" in site:
            site = site.split("thrown in", 1)[1].strip()
        elif site:
            site = site.replace("Program log: ", "")
        per.append(f"{image} {site}")
    sites_lines.append(f"- {case['label']}: " + "; ".join(per))
SITES = "\n".join(sites_lines)

README = """# Multi-hop swap through five AMM hops

## Problem

Packet #18 pinned multi_hop_swap through four AMM hops (packet
#5 covered one to three hops). The handler reads remaining
accounts in groups of 5 with no hop cap
(multi_hop_swap.rs:273: count = remaining.len() / 5), so a
fifth pool should chain cleanly -- but whether the fifth hop
preserves the 4-hop invariants (buyback only at the tail hop,
net-receipt limit, per-hop vault deltas) was unpinned, whether
the sell direction's final receipt survives a fifth hop was
unpinned, and whether the buy-side limit failure still returns
clean 6004 at five hops was unpinned.

## Cases

All cases multi_hop_swap on the shared v1/v2 fixture, 3 images
each. The route is tail pool (quote <-> base) -> POOL2 (base <->
BASE2) -> P3 (BASE2 <-> BASE3) -> P4 (BASE3 <-> BASE4) -> P5
(BASE4 <-> BASE5), with the user output U5 (BASE5,
payer-owned) on buys and the user input U5 on sells. Limit is
1 unless stated (accept-anything floor for buys is the base
receipt, for sells the quote receipt). The fifth pool P5 is
synthesized by copying the tail pool's layout (same reserves
shape as P4/P3/POOL2); only AMM hops are chained here, no
curve hops.

- buy-1e9 / buy-1e6: the five-hop buy anchors.
- buy-1e9-limit-exact: the buy limit rule at the fifth hop's
  output.
- buy-1e9-limit-plus1 / buy-1e6-limit-plus1: buy-side limit
  failures at five hops (see the panic pin below).
- buy-amount0, buy-limit0: the zero guards (buy direction).
- buy-hop5-swap / buy-hop5-junk / buy-remaining-20 /
  buy-remaining-24 / buy-hop5-pool-bad-owner / buy-unsigned:
  the hop5 route-shape and account errors (buy direction).
- sell-1e9 / sell-1e6: the five-hop sell anchors.
- sell-1e9-limit-exact / sell-1e9-limit-plus1 /
  sell-1e9-limit-gross: the sell limit rule, including a limit
  set to the gross vault payout.
- sell-hop5-swap / sell-hop5-junk / sell-remaining-20 /
  sell-remaining-24 / sell-hop5-pool-bad-owner: the hop5
  route-shape and account errors (sell direction).
- sell-amount0, sell-limit0: the zero guards (sell direction).

## Result

- Buy 10^9 quote lands 5,259,040,470,738 of the fifth base in
  U5 (4-hop landed 5,286,914,075,404 of the fourth base, so
  the fifth hop costs 27,873,604,666). Buy 10^6 lands
  5,415,387,061 (4-hop: 5,415,416,462). Per-hop vault deltas,
  buy 10^9: hop1 quote vault +995,392,847 and base vault
  -5,385,694,844,757; hop2 quote vault +5,385,694,844,757 and
  base vault -5,356,844,515,538; hop3 quote vault
  +5,356,844,515,538 and base vault -5,328,301,632,828; hop4
  quote vault +5,328,301,632,828 and base vault
  -5,300,061,308,171; hop5 quote vault +5,300,061,308,171 and
  base vault -5,259,040,470,738.
- The buyback recipient takes the same whole input-side fee
  as 3-hop and 4-hop: +4,607,153 on the 10^9 buy, +4,607 on
  the 10^6 buy. The fifth hop adds no buyback fee, so
  buyback accrues at the tail (main pool) hop only, not per
  hop.
- Sell 10^9 of the fifth base lands 180,345 quote in
  userquote -- IDENTICAL to the 3-hop and 4-hop sells -- and
  sell 10^6 lands 180 (identical). The extra hop's haircut
  rounds away in the tail hop: the 5-hop tail input is
  997,496,013 base vs 4-hop's 997,497,009 (996 less), yet the
  tail still pays gross 181,191, the user nets 180,345, and
  the buyback recipient takes 846 (181,191 = 180,345 + 846).
  Per-hop vault deltas, sell 10^9: hop5 base vault +10^9 and
  quote vault -997,499,001; hop4 base vault +997,499,001 and
  quote vault -997,498,005; hop3 base vault +997,498,005 and
  quote vault -997,497,009; hop2 base vault +997,497,009 and
  quote vault -997,496,013; hop1 (tail) base vault
  +997,496,013 and quote vault -181,191.
- The limit is a NET-receipt floor, checked once at the end:
  buy limit exactly 5,259,040,470,738 passes; sell limit
  exactly 180,345 passes, +1 fails 6004, and a sell limit set
  to the gross vault payout 181,191 FAILS, so a limit set to
  the vault delta is wrong.
- BUY-SIDE LIMIT FAILURE PANICS AT FIVE HOPS (sharpest pin):
  buy-1e9-limit-plus1 and buy-1e6-limit-plus1 do NOT return
  clean 6004. On all 3 images they surface as
  ProgramFailedToComplete -- the SBF program panics with
  "memory allocation failed, out of memory" after all 5 hops
  ran (5 hop events remain in the logs), state rolls back,
  and the payer loses only 5,000. The original image logs
  the 6004 AnchorError (multi_hop_swap.rs:389) before
  panicking; the rebuilt images panic without logging it --
  verify.py pins this log-surface split per image. By
  contrast, 4-hop buy limit failure returned clean
  Tagged(6004) (#18), and 5-hop sell limit failure still
  returns clean Tagged(6004) here, so the panic is buy-side
  and five-hop specific in this harness. The mechanism (why
  the error return exhausts the heap at five buy hops) is
  NOT determined here -- this packet records the observed
  LiteSVM behavior only and makes no on-chain claim about it.
- Every successful trade funds the user volume accumulator
  with exactly 1,844,400 lamports (payer delta -1,849,400
  with the 5,000 fee) and emits 5 events, one per hop.
  Failed limit transactions still carry 5 hop events in
  their logs (the net-receipt check runs after all hops);
  buy pool5owner carries 4, sell pool5owner 0, and all other
  failures 0 -- while state rolls back in every failure case.
- Amount 0 fails ZeroQuoteAmount (6002) and limit 0 fails
  ZeroBaseAmount (6001) in BOTH directions, before any hop
  runs -- the guards key on the parameter positions, not the
  direction. Swapping hop5's two mints fails
  MultiHopMixedDirection (6086) in both directions. A junk
  hop5 mint, truncating the buy route to four hops, or
  dropping the hop5 group on a sell all fail
  MultiHopDiscontinuousPath (6084) -- note the 6084 site
  splits by direction: buy-side junk/trunc at
  multi_hop_swap.rs:300 (original) / :294 (rebuilds),
  sell-side at :251 / :285, so the two directions validate
  the route at different points. 24 remaining accounts (not
  a multiple of 5) fails NotEnoughRemainingAccounts (6044)
  in both directions. A hop5 pool owned by nobody fails
  AccountTypeNotSupported (6027) in both directions. An
  unsigned user fails AccountNotSigner (3010). All error
  cases roll back everything except the payer's 5,000 fee,
  and the volume accumulator is NOT funded on error.
- All 3 images agree on every case's error, deltas, payer
  delta, event count, and rollback.

Error sites (log paths as emitted by each image):

{SITES}

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The hop5 output amounts and the sell
rounding identity are exact for this fixture's pool states
and fee configuration; they are not claimed for other pool
states. The fifth pool P5 is synthesized by copying the tail
pool's layout (same reserves shape as P3/POOL2); only AMM
hops are chained here, no curve hops. The buy-side
five-hop limit panic is an observed LiteSVM behavior; its
mechanism is undetermined and no on-chain claim is made
about it.
"""
(OUT / "README.md").write_text(README)
import shutil
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
