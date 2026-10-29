#!/usr/bin/env python3
"""Build research/amm-multi-hop-four-hop-20261029 receipts.

2nd run packet #18: multi_hop_swap through FOUR AMM hops (2nd run
packet #5 covered one to three hops only, never four). The handler
reads remaining accounts in groups of 5 with no hop cap
(multi_hop_swap.rs:273 count = remaining.len() / 5), so a fourth
pool chains cleanly. All cases on the shared v1/v2 fixture, 3
images (original / #424 control / #427 candidate):

- buy 10^9 quote chains hop1 -> hop2 -> hop3 -> hop4 and lands
  5,286,914,075,404 of the fourth base in U4 (3-hop landed
  5,315,084,721,958 of the third base, so the fourth hop costs
  28,170,646,554); buy 10^6 lands 5,415,416,462 (3-hop: 5,415,445,863).
  Per-hop vault deltas are exact (see README). The buyback
  recipient takes the same whole input-side fee as 3-hop:
  +4,607,153 on the 10^9 buy, +4,607 on the 10^6 buy -- the fourth
  hop adds no buyback fee, so buyback accrues at the tail (main
  pool) hop only, not per hop.
- sell 10^9 of the fourth base lands 180,345 quote in userquote
  (IDENTICAL to the 3-hop sell) and sell 10^6 lands 180
  (identical). The extra hop's haircut rounds away in the tail
  hop: the 4-hop tail input is 997,497,009 base vs 3-hop's
  997,498,005 (996 less), yet the tail still pays gross 181,191,
  user nets 180,345, buyback takes 846 (181,191 = 180,345 + 846).
- the limit is a NET-receipt floor, checked once at the end:
  buy limit exactly 5,286,914,075,404 passes and +1 fails
  ExceededSlippage (6004); sell limit exactly 180,345 passes,
  +1 fails 6004, and a sell limit set to the gross vault payout
  181,191 FAILS, so a limit set to the vault delta is wrong;
- every successful trade funds the user volume accumulator with
  exactly 1,844,400 lamports (payer delta -1,849,400) and emits
  4 events (one per hop);
- amount 0 fails ZeroQuoteAmount (6002) and limit 0 fails
  ZeroBaseAmount (6001) in BOTH directions, before any hop runs;
  swapping hop4's two mints fails MultiHopMixedDirection (6086)
  in both directions; a junk hop4 mint, or truncating the route
  to three hops (buy) / dropping the hop4 group (sell), fails
  MultiHopDiscontinuousPath (6084); 19 remaining accounts (not a
  multiple of 5) fails NotEnoughRemainingAccounts (6044); a hop4
  pool owned by nobody fails AccountTypeNotSupported (6027) in
  both directions; an unsigned user fails AccountNotSigner
  (3010). All error cases roll back everything except the
  payer's 5,000 fee, and the volume accumulator is NOT funded
  on error;
- all three images agree on every case: this packet pins
  behavior, it does not claim a divergence.
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
OUT = ROOT / "research/amm-multi-hop-four-hop-20261029"
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

WATCH = {
    "userquote": userquote,
    "u4": U4,
    "buyback": buyback,
    "vb1": vaultbase,
    "vq1": vaultquote,
    "vb2": VB2,
    "vq2": VQ2,
    "vb3": VB3,
    "vq3": VQ3,
    "vb4": VB4,
    "vq4": VQ4,
}

BUY_1E9 = {
    "userquote": -10**9, "u4": 5286914075404, "buyback": 4607153,
    "vb1": -5385694844757, "vq1": 995392847,
    "vb2": -5356844515538, "vq2": 5385694844757,
    "vb3": -5328301632828, "vq3": 5356844515538,
    "vb4": -5286914075404, "vq4": 5328301632828,
}
BUY_1E6 = {
    "userquote": -10**6, "u4": 5415416462, "buyback": 4607,
    "vb1": -5429043355, "vq1": 995393,
    "vb2": -5429013880, "vq2": 5429043355,
    "vb3": -5428984405, "vq3": 5429013880,
    "vb4": -5415416462, "vq4": 5428984405,
}
SELL_1E9 = {
    "userquote": 180345, "u4": -10**9, "buyback": 846,
    "vb1": 997497009, "vq1": -181191,
    "vb2": 997498005, "vq2": -997497009,
    "vb3": 997499001, "vq3": -997498005,
    "vb4": 10**9, "vq4": -997499001,
}
SELL_1E6 = {
    "userquote": 180, "u4": -10**6, "buyback": 1,
    "vb1": 997497, "vq1": -181,
    "vb2": 997498, "vq2": -997497,
    "vb3": 997499, "vq3": -997498,
    "vb4": 10**6, "vq4": -997499,
}

# (label, amount, limit, sell, override, unsigned, expected)
# override: four | swap4 | junk4 | trunc15 | rem19 | pool4owner
# expected: ("hop4", delta-dict) | ("error", code, fragment)
CASES = [
    ("buy-1e9", 10**9, 1, False, "four", False, ("hop4", BUY_1E9)),
    ("buy-1e6", 10**6, 1, False, "four", False, ("hop4", BUY_1E6)),
    ("buy-1e9-limit-exact", 10**9, 5286914075404, False, "four", False, ("hop4", BUY_1E9)),
    ("buy-1e9-limit-plus1", 10**9, 5286914075405, False, "four", False, ("error", "6004", "ExceededSlippage")),
    ("buy-amount0", 0, 1, False, "four", False, ("error", "6002", "ZeroQuoteAmount")),
    ("buy-limit0", 10**9, 0, False, "four", False, ("error", "6001", "ZeroBaseAmount")),
    ("buy-hop4-swap", 10**9, 1, False, "swap4", False, ("error", "6086", "MultiHopMixedDirection")),
    ("buy-hop4-junk", 10**9, 1, False, "junk4", False, ("error", "6084", "MultiHopDiscontinuousPath")),
    ("buy-remaining-15", 10**9, 1, False, "trunc15", False, ("error", "6084", "MultiHopDiscontinuousPath")),
    ("buy-remaining-19", 10**9, 1, False, "rem19", False, ("error", "6044", "NotEnoughRemainingAccounts")),
    ("buy-hop4-pool-bad-owner", 10**9, 1, False, "pool4owner", False, ("error", "6027", "AccountTypeNotSupported")),
    ("buy-unsigned", 10**9, 1, False, "four", True, ("error", "3010", "AccountNotSigner")),
    ("sell-1e9", 10**9, 1, True, "four", False, ("hop4", SELL_1E9)),
    ("sell-1e6", 10**6, 1, True, "four", False, ("hop4", SELL_1E6)),
    ("sell-1e9-limit-exact", 10**9, 180345, True, "four", False, ("hop4", SELL_1E9)),
    ("sell-1e9-limit-plus1", 10**9, 180346, True, "four", False, ("error", "6004", "ExceededSlippage")),
    ("sell-1e9-limit-gross", 10**9, 181191, True, "four", False, ("error", "6004", "ExceededSlippage")),
    ("sell-hop4-swap", 10**9, 1, True, "swap4", False, ("error", "6086", "MultiHopMixedDirection")),
    ("sell-hop4-junk", 10**9, 1, True, "junk4", False, ("error", "6084", "MultiHopDiscontinuousPath")),
    ("sell-remaining-15", 10**9, 1, True, "trunc15", False, ("error", "6084", "MultiHopDiscontinuousPath")),
    ("sell-remaining-19", 10**9, 1, True, "rem19", False, ("error", "6044", "NotEnoughRemainingAccounts")),
    ("sell-hop4-pool-bad-owner", 10**9, 1, True, "pool4owner", False, ("error", "6027", "AccountTypeNotSupported")),
    ("sell-amount0", 0, 1, True, "four", False, ("error", "6002", "ZeroQuoteAmount")),
    ("sell-limit0", 10**9, 0, True, "four", False, ("error", "6001", "ZeroBaseAmount")),
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


def make_override(kind, sell):
    def ov(h, m):
        four_amm(sell)(h, m)
        if kind == "four":
            return
        if kind == "swap4":
            i = 16 if sell else len(m) - 5
            m[i], m[i + 1] = m[i + 1], m[i]
        elif kind == "junk4":
            i = 16 if sell else len(m) - 5
            m[i] = AccountMeta(Pubkey.from_bytes(bytes([0x99]) * 32), False, False)
        elif kind == "trunc15":
            if sell:
                del m[16:21]
            else:
                del m[31:]
        elif kind == "rem19":
            del m[-1:]
        elif kind == "pool4owner":
            a = h.vm.get_account(P4)
            h.vm.set_account(P4, Account(a.lamports, bytes(a.data), Pubkey.default()))
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
                                  **({"deltas": expected[1]} if expected[0] == "hop4" else
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
        if expected[0] == "hop4":
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
            assert len(r["events"]) == 4, (label, image, len(r["events"]))
            observed = {"deltas": deltas, "payer_lamports_delta": payer_delta,
                        "volume_lamports": 1844400, "volume_data_len": 137,
                        "event_count": 4, "sig_fields": 1}
        else:
            _, code, fragment = expected
            assert err is not None and code in err, (label, image, err)
            assert fragment in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == -5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != fee_key), \
                (label, image, "rollback")
            # NOTE: no events==0 assertion here. Unlike legacy handlers,
            # multi-hop emits one event per hop as it runs, and the
            # final limit check (6004) and the buy-side hop4 pool
            # validation (6027) happen AFTER earlier hops ran, so those
            # failed transactions still carry hop events in their logs
            # (limit failures: 4; buy pool4owner: 3; sell pool4owner:
            # 0, since hop4 runs first on sells). State still rolls
            # back; only the logs retain the events. The count is
            # recorded and must agree across all 3 images (via `seen`).
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
                      "u4": str(U4), "buyback": str(buyback),
                      "vb1": str(vaultbase), "vq1": str(vaultquote),
                      "vb2": str(VB2), "vq2": str(VQ2),
                      "vb3": str(VB3), "vq3": str(VQ3),
                      "vb4": str(VB4), "vq4": str(VQ4),
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
report = {"schema": 1, "packet": "amm-multi-hop-four-hop-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("multi_hop_swap through FOUR AMM hops, pinned on all 3 "
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
    if case["expected"]["kind"] != "error":
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

README = f"""# Multi-hop swap through four AMM hops

## Problem

Packet #5 pinned multi_hop_swap through one to three AMM hops
(run 1 #32 covered one and two hops only, never three; #5 added
the third). The handler reads remaining accounts in groups of 5
with no hop cap (multi_hop_swap.rs:273: count = remaining.len()
/ 5), so a fourth pool should chain cleanly -- but whether the
fourth hop preserves the 3-hop invariants (buyback only at the
tail hop, net-receipt limit, per-hop vault deltas) was unpinned,
and the sell direction had never been checked for whether the
extra hop changes the final receipt at all.

## Cases

All cases multi_hop_swap on the shared v1/v2 fixture, 3 images
each. The route is tail pool (quote <-> base) -> POOL2 (base <->
BASE2) -> P3 (BASE2 <-> BASE3) -> P4 (BASE3 <-> BASE4), with the
user output U4 (BASE4, payer-owned) on buys and the user input U4
on sells. Limit is 1 unless stated (accept-anything floor for
buys is the base receipt, for sells the quote receipt).

- buy-1e9 / buy-1e6: the four-hop buy anchors.
- buy-1e9-limit-exact / buy-1e9-limit-plus1: the buy limit rule
  at the fourth hop's output.
- buy-amount0, buy-limit0: the zero guards (buy direction).
- buy-hop4-swap / buy-hop4-junk / buy-remaining-15 /
  buy-remaining-19 / buy-hop4-pool-bad-owner / buy-unsigned:
  the hop4 route-shape and account errors (buy direction).
- sell-1e9 / sell-1e6: the four-hop sell anchors.
- sell-1e9-limit-exact / sell-1e9-limit-plus1 /
  sell-1e9-limit-gross: the sell limit rule, including a limit
  set to the gross vault payout.
- sell-hop4-swap / sell-hop4-junk / sell-remaining-15 /
  sell-remaining-19 / sell-hop4-pool-bad-owner: the hop4
  route-shape and account errors (sell direction).
- sell-amount0, sell-limit0: the zero guards (sell direction).

## Result

- Buy 10^9 quote lands 5,286,914,075,404 of the fourth base in
  U4 (3-hop landed 5,315,084,721,958 of the third base, so the
  fourth hop costs 28,170,646,554). Buy 10^6 lands 5,415,416,462
  (3-hop: 5,415,445,863). Per-hop vault deltas, buy 10^9: hop1
  quote vault +995,392,847 and base vault -5,385,694,844,757;
  hop2 quote vault +5,385,694,844,757 and base vault
  -5,356,844,515,538; hop3 quote vault +5,356,844,515,538 and
  base vault -5,328,301,632,828; hop4 quote vault
  +5,328,301,632,828 and base vault -5,286,914,075,404.
- The buyback recipient takes the same whole input-side fee as
  3-hop: +4,607,153 on the 10^9 buy, +4,607 on the 10^6 buy.
  The fourth hop adds no buyback fee, so buyback accrues at the
  tail (main pool) hop only, not per hop.
- Sell 10^9 of the fourth base lands 180,345 quote in userquote
  -- IDENTICAL to the 3-hop sell -- and sell 10^6 lands 180
  (identical). The extra hop's haircut rounds away in the tail
  hop: the 4-hop tail input is 997,497,009 base vs 3-hop's
  997,498,005 (996 less), yet the tail still pays gross 181,191,
  the user nets 180,345, and the buyback recipient takes 846
  (181,191 = 180,345 + 846). Per-hop vault deltas, sell 10^9:
  hop4 base vault +10^9 and quote vault -997,499,001; hop3 base
  vault +997,499,001 and quote vault -997,498,005; hop2 base
  vault +997,498,005 and quote vault -997,497,009; hop1 (tail)
  base vault +997,497,009 and quote vault -181,191.
- The limit is a NET-receipt floor, checked once at the end:
  buy limit exactly 5,286,914,075,404 passes and +1 fails
  ExceededSlippage (6004); sell limit exactly 180,345 passes,
  +1 fails 6004, and a sell limit set to the gross vault payout
  181,191 FAILS, so a limit set to the vault delta is wrong.
- Every successful trade funds the user volume accumulator with
  exactly 1,844,400 lamports (payer delta -1,849,400 with the
  5,000 fee) and emits 4 events, one per hop. Failed limit
  transactions still carry 4 hop events in their logs (the
  net-receipt check runs after all hops); buy pool4owner
  carries 3, sell pool4owner 0, and all other failures 0 --
  while state rolls back in every failure case.
- Amount 0 fails ZeroQuoteAmount (6002) and limit 0 fails
  ZeroBaseAmount (6001) in BOTH directions, before any hop runs
  -- the guards key on the parameter positions, not the
  direction. Swapping hop4's two mints fails
  MultiHopMixedDirection (6086) in both directions. A junk hop4
  mint, truncating the buy route to three hops, or dropping the
  hop4 group on a sell all fail MultiHopDiscontinuousPath
  (6084) -- note the 6084 site splits by direction: buy-side
  junk/trunc at multi_hop_swap.rs:300 (original) / :294
  (rebuilds), sell-side at :251 / :285, so the two directions
  validate the route at different points. 19 remaining accounts
  (not a multiple of 5) fails
  NotEnoughRemainingAccounts (6044) in both directions. A hop4
  pool owned by nobody fails AccountTypeNotSupported (6027) in
  both directions. An unsigned user fails AccountNotSigner
  (3010). All error cases roll back everything except the
  payer's 5,000 fee, and the volume accumulator is NOT funded
  on error -- but failed transactions still carry hop events in
  their logs where hops ran before the failure: limit failures
  carry 4 events (all hops ran, the net-receipt check is last),
  buy pool4owner carries 3 (hops 1-3 ran, hop4 validation
  fails), sell pool4owner carries 0 (hop4 runs first on sells),
  and route-shape / zero-guard / unsigned failures carry 0.
- All 3 images agree on every case.

Error sites (log paths as emitted by each image):

{SITES}

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The hop4 output amounts and the sell
rounding identity are exact for this fixture's pool states and
fee configuration; they are not claimed for other pool states.
The fourth pool P4 is synthesized by copying the tail pool's
layout (same reserves shape as P3/POOL2); only AMM hops are
chained here, no curve hops.
"""
(OUT / "README.md").write_text(README)
import shutil
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
