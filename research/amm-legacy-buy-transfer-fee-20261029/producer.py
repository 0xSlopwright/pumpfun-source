#!/usr/bin/env python3
"""Build research/amm-legacy-buy-transfer-fee-20261029 receipts.

2nd run packet #17: legacy `buy` (non-exact, amount = base out,
limit = max quote in) under quote transfer fees. #25 pinned legacy
buy only at one no-fee point (10^10 spends 1,847,796); #12/#13/#14
covered buy_exact quote tf, sell quote tf, and the legacy base leg.
The non-exact buy quote leg, its spend plateau, its limit rule, and
its whitelist path were unpinned. All cases on the shared v1/v2
fixture, 3 images (original / #424 control / #427 candidate):

- Spend plateau: amounts 1..5479 spend exactly 4 nofee / 5 tf100 /
  6 tf5000 (vault 2, legs 1/1/0 nofee, 0/0/0 under fees); amount
  5480 spends 5 / 6 / 8 (vault 3). The 1-unit legs are fully
  withheld by any fee.
- Buyback onset: amount 586315 is the last buyback 0 (spend 110,
  vault 108, legs 1/1/0); 586316 is the first buyback 1 (spend 112,
  vault 109, legs 1/1/1).
- Large amounts: nofee 10^10 spends 1,847,796 (vault 1,825,348,
  legs 8487/5475/8486); tf100 spends 1,866,234 (vault unchanged,
  legs 8402/5420/8401 = nominal minus ceiling withholding);
  tf5000 spends 3,673,144 (legs 4243/2737/4243). The vault leg is
  grossed up (tf100 gross pool 1,843,786 = ceil(1,825,348 x
  10000/9900)); the fee legs are transferred at nominal value and
  the recipients receive net.
- Caps bind spend only through the pool leg: tf100-max100 and
  tf5000-max100 both spend nofee + 100 = 1,847,896 (pool-leg fee
  capped at 100; tf100 leg fees 85/55/85 are below the cap so leg
  receipts equal uncapped tf100, while tf5000 leg receipts show
  capped withholding 8387/5375/8386 = nominal - 100).
  tf100-max10000 spends nofee + 10,000 = 1,857,796.
- tf10000 gives 6023 Overflow (transfer_fee.rs:67 original) at
  every amount -- unlike buy_exact's 6039, because non-exact buy
  has no net > 0 pre-check and the pool-leg gross-up divides by
  (10000 - 10000).
- Limit is the full user spend, inclusive: nofee 1,847,796,
  tf100 1,866,234, tf5000 3,673,144, tf100-max100 1,847,896;
  minus 1 gives 6004 ExceededSlippage. The check uses total =
  pool_quote + full (pre-split) protocol fee + creator fee, plus
  quote_transfer_fee = gross_pool - pool_quote; since the full
  protocol fee = net + buyback, total + fee = full spend.
- amount0 -> 6001 ZeroBaseAmount, limit0 -> 6002 ZeroQuoteAmount.
- Whitelist (user == whitelist_pda): standard layout -> 6053
  BuybackFeeRecipientNotAuthorized (same trap as #12/#13, third
  handler); trimmed layout succeeds with fees 0, spend = curve
  1,824,983, vault +1,824,983; tf100 trimmed spends 1,843,418 =
  ceil(1,824,983 x 10000/9900), vault +1,824,983. The trimmed
  nofee case also reveals the curve itself: lp_fee = 1,825,348 -
  1,824,983 = 365, full protocol fee = 8,487 + 8,486 = 16,973.

NOTE: the tf override must go through adapt_sell_helper (as in
#12/#16). The raw legacy_transferfee override leaves the buy
harness's remaining accounts unadapted and every tf case then
fails 6062 InvalidPoolV2 -- a harness artifact, not handler
behavior. The whitelist trim deletes meta 23 (poolv2) after the
adapt step, which preserves indices.
"""
import base64
import gzip
import hashlib
import json
import shutil
import struct
import sys
from pathlib import Path

import os
sys.path.insert(0, str(Path.home() / "workspace/pumpfun-sparse/scripts"))
os.chdir(Path.home() / "workspace/pumpfun-sparse")
from solders.pubkey import Pubkey
from solders.transaction import Transaction

from pump_amm_legacy_buy_differential import (
    legacy_buy, adapt_sell_helper, userbase, userquote, vaultbase, vaultquote,
)
from pump_amm_legacy_sell_differential import (
    legacy_transferfee, quote, mutate, CONFIG_KEY,
    PAYER, PROTOCOL_ATA, CREATOR_ATA, buyback, TOKEN22, PROTOCOL,
    CREATOR_VAULT, ATA,
)
import pump_amm_legacy_sell_differential as S

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-legacy-buy-transfer-fee-20261029"
WS = Path.home() / "workspace/slop-verify"

IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {
    "original": "6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7",
    "control": "7a300434dced61413bde10788594b427d5649563e0223efcf09e6b214aff7ad3",
    "candidate": "d17a657baf5cc19736a924c41e75424604411ddbe9f6e72cddf41ab72a695007",
}

BUYBACK_OWNER = Pubkey.from_bytes(
    base64.b64decode(S.f["accounts"]["buyback_fee_recipient"]["data_base64"])[32:64])


def ata22(owner):
    return Pubkey.find_program_address(
        [bytes(owner), bytes(TOKEN22), bytes(quote)], ATA)[0]


def tf(bps, maximum=2**64 - 1):
    return adapt_sell_helper(legacy_transferfee(quote, bps, maximum))


def wl(h, m):
    mutate(CONFIG_KEY, 353, bytes(PAYER.pubkey()))(h, m)


def wl_trim(h, m):
    mutate(CONFIG_KEY, 353, bytes(PAYER.pubkey()))(h, m)
    del m[23]


def wl_tf_trim(h, m):
    mutate(CONFIG_KEY, 353, bytes(PAYER.pubkey()))(h, m)
    tf(100)(h, m)
    del m[23]


OVERRIDES = {
    "tf100": tf(100),
    "tf5000": tf(5000),
    "tf10000": tf(10000),
    "tf100-max100": tf(100, 100),
    "tf5000-max100": tf(5000, 100),
    "tf100-max10000": tf(100, 10000),
    "wl": wl,
    "wl-trim": wl_trim,
    "wl-tf-trim": wl_tf_trim,
}
# override tags whose quote mint carries the transfer-fee extension
TF_TAGS = {"tf100", "tf5000", "tf10000", "tf100-max100", "tf5000-max100",
           "tf100-max10000", "wl-tf-trim"}

BIG = 10**12
# (label, kwargs, override-tag-or-None, expected)
# ok expected: (userbase, userquote, vaultbase, vaultquote, protocol, creator, buyback)
# error expected: (code, fragment)
CASES = [
    ("nofee-amount1", dict(amount=1, limit=BIG), None,
     ("ok", (1, -4, -1, 2, 1, 1, 0))),
    ("nofee-amount5479", dict(amount=5479, limit=BIG), None,
     ("ok", (5479, -4, -5479, 2, 1, 1, 0))),
    ("nofee-amount5480", dict(amount=5480, limit=BIG), None,
     ("ok", (5480, -5, -5480, 3, 1, 1, 0))),
    ("nofee-amount586315", dict(amount=586315, limit=BIG), None,
     ("ok", (586315, -110, -586315, 108, 1, 1, 0))),
    ("nofee-amount586316", dict(amount=586316, limit=BIG), None,
     ("ok", (586316, -112, -586316, 109, 1, 1, 1))),
    ("nofee-amount1e7", dict(amount=10**7, limit=BIG), None,
     ("ok", (10**7, -1849, -10**7, 1826, 9, 6, 8))),
    ("nofee-amount1e9", dict(amount=10**9, limit=BIG), None,
     ("ok", (10**9, -184779, -10**9, 182533, 849, 548, 849))),
    ("nofee-amount1e10", dict(amount=10**10, limit=BIG), None,
     ("ok", (10**10, -1847796, -10**10, 1825348, 8487, 5475, 8486))),
    ("tf100-amount1", dict(amount=1, limit=BIG), "tf100",
     ("ok", (1, -5, -1, 2, 0, 0, 0))),
    ("tf100-amount5479", dict(amount=5479, limit=BIG), "tf100",
     ("ok", (5479, -5, -5479, 2, 0, 0, 0))),
    ("tf100-amount5480", dict(amount=5480, limit=BIG), "tf100",
     ("ok", (5480, -6, -5480, 3, 0, 0, 0))),
    ("tf100-amount1e7", dict(amount=10**7, limit=BIG), "tf100",
     ("ok", (10**7, -1868, -10**7, 1826, 8, 5, 7))),
    ("tf100-amount1e9", dict(amount=10**9, limit=BIG), "tf100",
     ("ok", (10**9, -186623, -10**9, 182533, 840, 542, 840))),
    ("tf100-amount1e10", dict(amount=10**10, limit=BIG), "tf100",
     ("ok", (10**10, -1866234, -10**10, 1825348, 8402, 5420, 8401))),
    ("tf5000-amount1", dict(amount=1, limit=BIG), "tf5000",
     ("ok", (1, -6, -1, 2, 0, 0, 0))),
    ("tf5000-amount5479", dict(amount=5479, limit=BIG), "tf5000",
     ("ok", (5479, -6, -5479, 2, 0, 0, 0))),
    ("tf5000-amount5480", dict(amount=5480, limit=BIG), "tf5000",
     ("ok", (5480, -8, -5480, 3, 0, 0, 0))),
    ("tf5000-amount1e7", dict(amount=10**7, limit=BIG), "tf5000",
     ("ok", (10**7, -3675, -10**7, 1826, 4, 3, 4))),
    ("tf5000-amount1e9", dict(amount=10**9, limit=BIG), "tf5000",
     ("ok", (10**9, -367312, -10**9, 182533, 424, 274, 424))),
    ("tf5000-amount1e10", dict(amount=10**10, limit=BIG), "tf5000",
     ("ok", (10**10, -3673144, -10**10, 1825348, 4243, 2737, 4243))),
    ("tf10000-amount1", dict(amount=1, limit=BIG), "tf10000",
     ("error", "6023", "Overflow")),
    ("tf10000-amount1e10", dict(amount=10**10, limit=BIG), "tf10000",
     ("error", "6023", "Overflow")),
    ("tf100-max100-amount1e10", dict(amount=10**10, limit=BIG), "tf100-max100",
     ("ok", (10**10, -1847896, -10**10, 1825348, 8402, 5420, 8401))),
    ("tf5000-max100-amount1e10", dict(amount=10**10, limit=BIG), "tf5000-max100",
     ("ok", (10**10, -1847896, -10**10, 1825348, 8387, 5375, 8386))),
    ("tf100-max10000-amount1e10", dict(amount=10**10, limit=BIG), "tf100-max10000",
     ("ok", (10**10, -1857796, -10**10, 1825348, 8402, 5420, 8401))),
    ("nofee-limit-minus1", dict(amount=10**10, limit=1847795), None,
     ("error", "6004", "ExceededSlippage")),
    ("nofee-limit-exact", dict(amount=10**10, limit=1847796), None,
     ("ok", (10**10, -1847796, -10**10, 1825348, 8487, 5475, 8486))),
    ("tf100-limit-minus1", dict(amount=10**10, limit=1866233), "tf100",
     ("error", "6004", "ExceededSlippage")),
    ("tf100-limit-exact", dict(amount=10**10, limit=1866234), "tf100",
     ("ok", (10**10, -1866234, -10**10, 1825348, 8402, 5420, 8401))),
    ("tf5000-limit-minus1", dict(amount=10**10, limit=3673143), "tf5000",
     ("error", "6004", "ExceededSlippage")),
    ("tf5000-limit-exact", dict(amount=10**10, limit=3673144), "tf5000",
     ("ok", (10**10, -3673144, -10**10, 1825348, 4243, 2737, 4243))),
    ("amount0", dict(amount=0, limit=BIG), None,
     ("error", "6001", "ZeroBaseAmount")),
    ("limit0", dict(amount=10**10, limit=0), None,
     ("error", "6002", "ZeroQuoteAmount")),
    ("whitelist-standard", dict(amount=10**10, limit=BIG), "wl",
     ("error", "6053", "BuybackFeeRecipientNotAuthorized")),
    ("whitelist-trimmed", dict(amount=10**10, limit=BIG), "wl-trim",
     ("ok", (10**10, -1824983, -10**10, 1824983, 0, 0, 0))),
    ("whitelist-trimmed-tf100", dict(amount=10**10, limit=BIG), "wl-tf-trim",
     ("ok", (10**10, -1843418, -10**10, 1824983, 0, 0, 0))),
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def tok_amount(snapshot, key):
    row = snapshot.get(str(key))
    assert row is not None, f"missing snapshot row {key}"
    return struct.unpack_from("<Q", bytes.fromhex(row["data_hex"]), 64)[0]


def lamp(snapshot, key):
    row = snapshot.get(str(key))
    return None if row is None else row["lamports"]


receipts_global = []
report_cases = []
for index, (label, kwargs, tag, expected) in enumerate(CASES):
    is_tf = tag in TF_TAGS
    pa = ata22(PROTOCOL) if is_tf else PROTOCOL_ATA
    ca = ata22(CREATOR_VAULT) if is_tf else CREATOR_ATA
    bb = ata22(BUYBACK_OWNER) if is_tf else buyback
    roles = {
        "fee_payer": str(PAYER.pubkey()),
        "userbase": str(userbase), "userquote": str(userquote),
        "vaultbase": str(vaultbase), "vaultquote": str(vaultquote),
        "protocol_ata": str(pa), "creator_ata": str(ca), "buyback": str(bb),
    }
    row = {"case": {"instruction": "buy", "label": label,
                    "params": {"amount": kwargs["amount"], "limit": kwargs["limit"],
                               "override": tag},
                    "expected": list(expected)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        kw = dict(kwargs)
        if tag is not None:
            kw["overrides"] = OVERRIDES[tag]
        r = legacy_buy(name="buy", candidate=IMAGES[image], **kw)
        raw = base64.b64decode(r["transaction_base64"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == 1, (label, image, checks)
        before, after = r["before"], r["after"]
        fee_key = str(PAYER.pubkey())
        payer_delta = (lamp(after, PAYER.pubkey()) or 0) - (lamp(before, PAYER.pubkey()) or 0)
        err, logs = r["error"], r["logs"]
        if expected[0] == "ok":
            assert err is None, (label, image, err)
            deltas = (
                tok_amount(after, userbase) - tok_amount(before, userbase),
                tok_amount(after, userquote) - tok_amount(before, userquote),
                tok_amount(after, vaultbase) - tok_amount(before, vaultbase),
                tok_amount(after, vaultquote) - tok_amount(before, vaultquote),
                tok_amount(after, pa) - tok_amount(before, pa),
                tok_amount(after, ca) - tok_amount(before, ca),
                tok_amount(after, bb) - tok_amount(before, bb),
            )
            assert deltas == expected[1], (label, image, deltas, expected[1])
            assert payer_delta == -1849400, (label, image, payer_delta)
            assert len(r["events"]) >= 1, (label, image, "no BuyEvent")
            observed = {"userbase": deltas[0], "userquote": deltas[1],
                        "vaultbase": deltas[2], "vaultquote": deltas[3],
                        "protocol_ata": deltas[4], "creator_ata": deltas[5],
                        "buyback": deltas[6], "payer_delta": payer_delta,
                        "event_count": len(r["events"]), "sig_fields": 1}
        else:
            _, code, fragment = expected
            assert err is not None and code in err, (label, image, err)
            assert fragment in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == -5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != fee_key), \
                (label, image, "rollback")
            assert len(r["events"]) == 0, (label, image, "unexpected event")
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            if site is None:
                site = next((l for l in logs if "AnchorError occurred." in l), None)
            row.setdefault("error_sites", {})[image] = site
            observed = {"payer_delta": payer_delta,
                        "event_count": 0, "sig_fields": 1}
        seen.add((err, json.dumps(observed, sort_keys=True)))
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image,
                        "instruction": "buy", "label": label},
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
                         "sha256": IMAGE_SHA[image]}},
            "error": err, "rollback_except_payer_fee": err is not None,
            "payer_delta_lamports": payer_delta,
            "observed": observed,
            "roles": roles,
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
    "scripts/pump_amm_legacy_buy_differential.py",
    "scripts/pump_amm_legacy_sell_differential.py",
    "scripts/pump_amm_trade_v2_differential.py",
    "scripts/pump_amm_liquidity_differential.py",
    "scripts/pump_amm_reusable_harness.py",
    "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json",
    "research/imported-lab/analysis/pump_fun/config-snapshot.json",
]
report = {"schema": 1, "packet": "amm-legacy-buy-transfer-fee-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("Legacy buy (non-exact) quote transfer-fee math, spend "
                    "plateau, limit rule, and whitelist path, pinned on "
                    "all 3 images (original / #424 control / #427 "
                    "candidate). Fresh VM per case per image. Receipts "
                    "are stored as parts to stay under GitHub's 25MB "
                    "web-upload limit; verify.py reads them in order. "
                    "Snapshots cover non-executable accounts only. The "
                    "quote mint carries the transfer-fee extension in "
                    "tf cases, so protocol/creator/buyback legs land in "
                    "Token-2022 ATAs. No source change, build, or "
                    "whole-program equivalence claim."),
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
    if case["expected"][0] != "error":
        continue
    per = []
    for image in ("original", "control", "candidate"):
        site = row.get("error_sites", {}).get(image, "")
        if site and "thrown in" in site:
            site = site.split("thrown in", 1)[1].strip()
        elif site:
            site = site.replace("Program log: ", "")
        per.append(f"{image} {site}")
    sites_lines.append(f"- {case['label']}: " + "; ".join(per))
SITES = "\n".join(sites_lines)

README = f"""# Legacy buy (non-exact) quote transfer-fee math

## Problem

Packet #25 pinned legacy `buy` only at one no-fee point (10^10
base out spends 1,847,796). Packets #12/#13/#14 covered buy_exact
quote fees, sell quote fees, and the legacy base leg, but the
non-exact buy quote leg -- where the amount is base out and the
limit is max quote in -- was unpinned: how the pool leg is grossed
up, how the fee legs are withheld, where small amounts plateau,
what the limit must cover, and whether the whitelist trap from
#12/#13 also bites this third handler.

## Cases

All cases legacy `buy` on the shared v1/v2 fixture, 3 images each.
The quote mint carries a Token-2022 transfer-fee extension in tf
cases, so the protocol/creator/buyback legs land in Token-2022
ATAs; the base mint has no fee, so base deltas are exact. Limit is
10^12 unless stated.

- nofee-amount1 / amount5479 / amount5480: the spend plateau and
  its top edge (spend 4, vault 2, legs 1/1/0 below the edge).
- nofee-amount586315 / amount586316: the buyback onset (last
  buyback 0, first buyback 1).
- nofee-amount1e7 / amount1e9 / amount1e10: scaling anchors
  (spend 1,849 / 184,779 / 1,847,796).
- tf100 / tf5000 at amounts 1, 5479, 5480, 1e7, 1e9, 1e10: the
  same points under fees (vault leg grossed up, fee legs net).
- tf10000-amount1 / tf10000-amount1e10: 100% fee at both ends.
- tf100-max100 / tf5000-max100 / tf100-max10000 at amount 1e10:
  per-transfer fee caps.
- nofee-limit-minus1 / nofee-limit-exact, tf100-limit-minus1 /
  tf100-limit-exact, tf5000-limit-minus1 / tf5000-limit-exact:
  the limit rule at amount 1e10.
- amount0, limit0: the zero guards.
- whitelist-standard / whitelist-trimmed /
  whitelist-trimmed-tf100 at amount 1e10: user == whitelist_pda.

## Result

- Spend plateau: amounts 1..5479 spend exactly 4 nofee, 5 tf100,
  6 tf5000 (vault 2, legs 1/1/0 nofee, 0/0/0 under fees -- the
  1-unit legs are fully withheld by any fee). Amount 5480 spends
  5 / 6 / 8 (vault 3). The plateau top 5479 is an exact bisect
  (5479 spends 4, 5480 spends 5 nofee).
- Buyback onset: amount 586315 is the last buyback 0 (spend 110,
  vault 108, legs 1/1/0); 586316 is the first buyback 1 (spend
  112, vault 109, legs 1/1/1). Exact bisect.
- Large amounts: nofee 10^10 spends 1,847,796 (vault 1,825,348,
  legs 8487/5475/8486). tf100 spends 1,866,234 (vault unchanged
  1,825,348, legs 8402/5420/8401 = nominal minus ceiling
  withholding: 8,487-85, 5,475-55, 8,486-85). tf5000 spends
  3,673,144 (legs 4243/2737/4243 = nominal minus 4,244/2,738/
  4,243). The pool leg is grossed up -- tf100 gross pool
  1,843,786 = ceil(1,825,348 x 10000/9900), tf5000 gross pool
  3,650,696 = 1,825,348 x 2 -- while the fee legs are transferred
  at nominal value and the recipients receive net.
- Caps bind spend only through the pool leg: tf100-max100 and
  tf5000-max100 both spend nofee + 100 = 1,847,896 (pool-leg fee
  capped at 100). tf100 leg fees (85/55/85) are below the cap, so
  tf100-max100 leg receipts equal uncapped tf100; tf5000 leg
  receipts show capped withholding (8387/5375/8386 = nominal -
  100 each). tf100-max10000 spends nofee + 10,000 = 1,857,796.
- tf10000 gives 6023 Overflow at every amount, unlike buy_exact's
  6039: non-exact buy has no net > 0 pre-check, and the pool-leg
  gross-up amount_before_fee divides by (10000 - 10000).
- Limit is the full user spend, inclusive: nofee 1,847,796,
  tf100 1,866,234, tf5000 3,673,144, tf100-max100 1,847,896;
  minus 1 gives 6004 ExceededSlippage in every case. The check
  uses total = pool_quote + full (pre-split) protocol fee +
  creator fee, plus quote_transfer_fee = gross_pool - pool_quote;
  since the full protocol fee = net + buyback, total + fee =
  full spend exactly.
- amount0 -> 6001 ZeroBaseAmount, limit0 -> 6002 ZeroQuoteAmount.
- Whitelist: standard layout -> 6053
  BuybackFeeRecipientNotAuthorized, the same trap as #12/#13 on a
  third handler (fees zeroed, remaining-account index stuck at 0,
  poolv2 read as the buyback owner). Trimmed layout succeeds with
  fees 0: spend = curve 1,824,983, vault +1,824,983; tf100
  trimmed spends 1,843,418 = ceil(1,824,983 x 10000/9900), vault
  +1,824,983. The trimmed nofee case also reveals the curve
  itself: lp_fee = 1,825,348 - 1,824,983 = 365, full protocol fee
  = 8,487 + 8,486 = 16,973.
- All 3 images agree on every case. Error cases roll back
  everything except the payer's 5,000 fee. Success cases charge
  the payer 1,849,400 (1,844,400 volume-accumulator rent + 5,000
  fee) and emit 1 BuyEvent.

Error sites (log paths as emitted by each image):

{SITES}

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The plateau top (5479), the buyback onset
(586316), and the fee splits are exact for this fixture's curve
state and fee configuration; they are not claimed for other pool
states. The tf override must go through adapt_sell_helper (as in
#12/#16): the raw transfer-fee override leaves the buy harness's
remaining accounts unadapted and every tf case then fails 6062
InvalidPoolV2, a harness artifact, not handler behavior.
"""
(OUT / "README.md").write_text(README)
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
