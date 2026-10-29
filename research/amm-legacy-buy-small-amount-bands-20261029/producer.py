#!/usr/bin/env python3
"""Build research/amm-legacy-buy-small-amount-bands-20261029 receipts.

2nd run packet #35: legacy `buy` (non-exact) small-amount bands at
exact integer thresholds. Packet #17 pinned the spend plateau and
the buyback onset only as spot points (amounts 1, 5479, 5480,
586315, 586316); packets #15/#16 did the same bisect job for the
legacy sell and buy_exact small bands. This packet bisects the
legacy buy curve bottom:

- Curve math (verified against every case below): quote =
  ceil(q * amount / (b - amount)); vault quote = quote +
  lp_fee; lp_fee = ceil(quote * 2 / 10000); protocol_fee =
  ceil(quote * 93 / 10000); creator_fee = ceil(quote * 30 /
  10000); buyback = floor(protocol_fee / 2); the protocol ATA
  receives protocol_fee - buyback; user spend = vault quote +
  net protocol + creator + buyback.
- Quote steps: 1 -> 2 at amount 5480 (vault 2 -> 3), 2 -> 3 at
  amount 10960 (vault 3 -> 4). The 5479/5480 pair is an anchor
  re-pinned from #17, not a new discovery.
- Buyback steps: 0 -> 1 at amount 586316 (quote 107 -> 108,
  protocol 1 -> 2; anchor from #17), 1 -> 2 at amount 1764428
  (quote 322 -> 323, protocol 3 -> 4, protocol net unchanged
  at 2).
- Creator step: 1 -> 2 at amount 1824703 (quote 333 -> 334);
  protocol and buyback are unchanged across it (4 = 2 + 2).
- Lp step: 1 -> 2 at amount 27397934 (quote 5000 -> 5001);
  the vault jumps 5001 -> 5003 (quote +1, lp +1) and spend
  jumps 5063 -> 5066 (vault +2, creator +1, protocol and
  buyback unchanged: 47 = 24 + 23, creator 15 -> 16).
- Transfer-fee overlay: the curve is unchanged by tf, so the
  plateau boundary is the same pair (5479/5480) under tf100
  (spend 5/6) and tf5000 (spend 6/8); the 1-unit legs are fully
  withheld at the bottom (0/0/0) and spend = gross pool +
  gross legs (tf100 5479: gross pool ceil(2*10000/9900) = 3 +
  legs 1+1+0 = 5; tf5000 5479: gross pool 4 + 2 = 6).
  The tf buyback-net onset sits at the same amounts
  (1764427/1764428) but for a different reason: nominal
  buyback 1 is fully withheld by any fee (ceil(1*100/10000)
  = 1, ceil(1*5000/10000) = 1), so net buyback first appears
  at nominal buyback 2 (withheld only 1 -> net 1), under
  both tf100 (spend 331/333, legs 1/0/0 -> 1/0/1) and tf5000
  (spend 650/653, legs 1/0/0 -> 1/0/1).
- Limit inclusivity at the quote-3 boundary: amount 10960
  with limit 6 succeeds, limit 5 gives 6004 ExceededSlippage.

All cases on the shared v1/v2 fixture, 3 images (original /
#424 control / #427 candidate). The tf override goes through
adapt_sell_helper (as in #12/#16/#17): the raw transfer-fee
override leaves the buy harness's remaining accounts unadapted
and every tf case then fails 6062 InvalidPoolV2, a harness
artifact, not handler behavior.
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
OUT = ROOT / "research/amm-legacy-buy-small-amount-bands-20261029"
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


OVERRIDES = {
    "tf100": tf(100),
    "tf5000": tf(5000),
}
TF_TAGS = {"tf100", "tf5000"}

BIG = 10**12
# (label, kwargs, override-tag-or-None, expected)
# ok expected: (userbase, userquote, vaultbase, vaultquote, protocol, creator, buyback)
# error expected: (code, fragment)
CASES = [
    ("nofee-q1-last", dict(amount=5479, limit=BIG), None,
     ("ok", (5479, -4, -5479, 2, 1, 1, 0))),
    ("nofee-q2-first", dict(amount=5480, limit=BIG), None,
     ("ok", (5480, -5, -5480, 3, 1, 1, 0))),
    ("nofee-q2-last", dict(amount=10959, limit=BIG), None,
     ("ok", (10959, -5, -10959, 3, 1, 1, 0))),
    ("nofee-q3-first", dict(amount=10960, limit=BIG), None,
     ("ok", (10960, -6, -10960, 4, 1, 1, 0))),
    ("nofee-bb1-last", dict(amount=586315, limit=BIG), None,
     ("ok", (586315, -110, -586315, 108, 1, 1, 0))),
    ("nofee-bb1-first", dict(amount=586316, limit=BIG), None,
     ("ok", (586316, -112, -586316, 109, 1, 1, 1))),
    ("nofee-bb2-last", dict(amount=1764427, limit=BIG), None,
     ("ok", (1764427, -327, -1764427, 323, 2, 1, 1))),
    ("nofee-bb2-first", dict(amount=1764428, limit=BIG), None,
     ("ok", (1764428, -329, -1764428, 324, 2, 1, 2))),
    ("nofee-creator1-last", dict(amount=1824702, limit=BIG), None,
     ("ok", (1824702, -339, -1824702, 334, 2, 1, 2))),
    ("nofee-creator2-first", dict(amount=1824703, limit=BIG), None,
     ("ok", (1824703, -341, -1824703, 335, 2, 2, 2))),
    ("nofee-lp1-last", dict(amount=27397933, limit=BIG), None,
     ("ok", (27397933, -5063, -27397933, 5001, 24, 15, 23))),
    ("nofee-lp2-first", dict(amount=27397934, limit=BIG), None,
     ("ok", (27397934, -5066, -27397934, 5003, 24, 16, 23))),
    ("tf100-plateau-last", dict(amount=5479, limit=BIG), "tf100",
     ("ok", (5479, -5, -5479, 2, 0, 0, 0))),
    ("tf100-plateau-first", dict(amount=5480, limit=BIG), "tf100",
     ("ok", (5480, -6, -5480, 3, 0, 0, 0))),
    ("tf5000-plateau-last", dict(amount=5479, limit=BIG), "tf5000",
     ("ok", (5479, -6, -5479, 2, 0, 0, 0))),
    ("tf5000-plateau-first", dict(amount=5480, limit=BIG), "tf5000",
     ("ok", (5480, -8, -5480, 3, 0, 0, 0))),
    ("tf100-bbnet-last", dict(amount=1764427, limit=BIG), "tf100",
     ("ok", (1764427, -331, -1764427, 323, 1, 0, 0))),
    ("tf100-bbnet-first", dict(amount=1764428, limit=BIG), "tf100",
     ("ok", (1764428, -333, -1764428, 324, 1, 0, 1))),
    ("tf5000-bbnet-last", dict(amount=1764427, limit=BIG), "tf5000",
     ("ok", (1764427, -650, -1764427, 323, 1, 0, 0))),
    ("tf5000-bbnet-first", dict(amount=1764428, limit=BIG), "tf5000",
     ("ok", (1764428, -653, -1764428, 324, 1, 0, 1))),
    ("nofee-limit-exact-q3", dict(amount=10960, limit=6), None,
     ("ok", (10960, -6, -10960, 4, 1, 1, 0))),
    ("nofee-limit-minus1-q3", dict(amount=10960, limit=5), None,
     ("error", "6004", "ExceededSlippage")),
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
report = {"schema": 1, "packet": "amm-legacy-buy-small-amount-bands-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("Legacy buy (non-exact) small-amount bands at exact "
                    "integer thresholds, pinned on all 3 images "
                    "(original / #424 control / #427 candidate). "
                    "Quote steps 1->2 at amount 5480 and 2->3 at "
                    "10960; buyback steps 0->1 at 586316 and 1->2 at "
                    "1764428; creator step 1->2 at 1824703; lp step "
                    "1->2 at 27397934; the same plateau pair under "
                    "tf100/tf5000 and the tf buyback-net onset at "
                    "1764427/1764428; limit inclusivity at the "
                    "quote-3 boundary (limit 6 succeeds, 5 gives "
                    "6004). Fresh VM per case per image. Receipts "
                    "are stored as parts to stay under GitHub's 25MB "
                    "web-upload limit; verify.py reads them in order. "
                    "Snapshots cover non-executable accounts only. "
                    "The quote mint carries the transfer-fee "
                    "extension in tf cases, so protocol/creator/"
                    "buyback legs land in Token-2022 ATAs. No source "
                    "change, build, or whole-program equivalence "
                    "claim."),
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

README = f"""# Legacy buy (non-exact) small-amount bands

## Problem

Packet #17 pinned the legacy `buy` spend plateau and the buyback
onset only as spot points (amounts 1, 5479, 5480, 586315, 586316),
and packets #15/#16 did the exact-threshold bisect job for the
legacy sell and buy_exact small bands. The non-exact buy curve
bottom -- where each fee leg steps, and how transfer fees shift
the buyback onset -- was never bisected to exact integers.

## Cases

All cases legacy `buy` (amount = base out, limit = max quote in)
on the shared v1/v2 fixture, 3 images each. The quote mint carries
a Token-2022 transfer-fee extension in tf cases, so the
protocol/creator/buyback legs land in Token-2022 ATAs; the base
mint has no fee, so base deltas are exact. Limit is 10^12 unless
stated. Each band is pinned as a last/first pair (bisect: the
lower amount has the old value, the next integer has the new one).

- nofee-q1-last / nofee-q2-first (5479 / 5480): the quote 1 -> 2
  step (anchor re-pinned from #17).
- nofee-q2-last / nofee-q3-first (10959 / 10960): the quote 2 -> 3
  step.
- nofee-bb1-last / nofee-bb1-first (586315 / 586316): the buyback
  0 -> 1 step (anchor from #17).
- nofee-bb2-last / nofee-bb2-first (1764427 / 1764428): the
  buyback 1 -> 2 step.
- nofee-creator1-last / nofee-creator2-first (1824702 / 1824703):
  the creator-fee 1 -> 2 step.
- nofee-lp1-last / nofee-lp2-first (27397933 / 27397934): the
  lp-fee 1 -> 2 step.
- tf100-plateau-last / tf100-plateau-first, tf5000-plateau-last /
  tf5000-plateau-first (5479 / 5480 under each fee): the plateau
  boundary under transfer fees.
- tf100-bbnet-last / tf100-bbnet-first, tf5000-bbnet-last /
  tf5000-bbnet-first (1764427 / 1764428 under each fee): the
  transfer-fee buyback-net onset.
- nofee-limit-exact-q3 / nofee-limit-minus1-q3 (amount 10960,
  limit 6 / 5): limit inclusivity at the quote-3 boundary.

## Result

Curve math, verified against every case: quote = ceil(q * amount /
(b - amount)); vault quote = quote + lp_fee; lp_fee = ceil(quote *
2 / 10000); protocol_fee = ceil(quote * 93 / 10000); creator_fee =
ceil(quote * 30 / 10000); buyback = floor(protocol_fee / 2); the
protocol ATA receives protocol_fee - buyback; user spend = vault
quote + net protocol + creator + buyback.

- Quote steps: 1 -> 2 at amount 5480 (vault 2 -> 3, spend 4 -> 5,
  legs 1/1/0 unchanged); 2 -> 3 at amount 10960 (vault 3 -> 4,
  spend 5 -> 6, legs unchanged).
- Buyback steps: 0 -> 1 at amount 586316 (quote 107 -> 108,
  protocol 1 -> 2, vault 108 -> 109, spend 110 -> 112); 1 -> 2 at
  amount 1764428 (quote 322 -> 323, protocol 3 -> 4, protocol net
  unchanged at 2, vault 323 -> 324, spend 327 -> 329).
- Creator step: 1 -> 2 at amount 1824703 (quote 333 -> 334, vault
  334 -> 335, spend 339 -> 341, protocol 4 = 2 + 2 and buyback 2
  unchanged across it).
- Lp step: 1 -> 2 at amount 27397934 (quote 5000 -> 5001, vault
  jumps 5001 -> 5003 because quote +1 and lp +1, spend jumps
  5063 -> 5066 because vault +2 and creator +1, protocol 47 =
  24 + 23 and buyback 23 unchanged).
- Transfer-fee plateau: the curve is unchanged by tf, so the
  plateau boundary is the same pair under fees -- tf100 spends
  5 / 6, tf5000 spends 6 / 8 at 5479 / 5480, with legs fully
  withheld at the bottom (0/0/0). Spend = gross pool + gross
  legs: tf100 5479 is gross pool ceil(2*10000/9900) = 3 plus
  legs 1+1+0 = 5; tf5000 5479 is gross pool 4 plus 2 = 6.
- Transfer-fee buyback-net onset: the same amounts 1764427 /
  1764428, but for a different reason than the nofee step.
  Nominal buyback 1 is fully withheld by any fee (ceil(1*100/
  10000) = 1, ceil(1*5000/10000) = 1), so net buyback first
  appears at nominal buyback 2, which withholds only 1 and nets
  1 -- under both tf100 (spend 331 / 333, legs 1/0/0 -> 1/0/1)
  and tf5000 (spend 650 / 653, legs 1/0/0 -> 1/0/1).
- Limit inclusivity at the quote-3 boundary: amount 10960 with
  limit 6 succeeds (spend exactly 6), limit 5 gives 6004
  ExceededSlippage.
- All 3 images agree on every case. Error cases roll back
  everything except the payer's 5,000 fee. Success cases charge
  the payer 1,849,400 (1,844,400 volume-accumulator rent + 5,000
  fee) and emit 1 BuyEvent.

Error sites (log paths as emitted by each image):

{SITES}

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The thresholds (5480, 10960, 586316, 1764428,
1824703, 27397934) are exact for this fixture's curve state and
fee configuration; they are not claimed for other pool states.
The tf override must go through adapt_sell_helper (as in
#12/#16/#17): the raw transfer-fee override leaves the buy
harness's remaining accounts unadapted and every tf case then
fails 6062 InvalidPoolV2, a harness artifact, not handler
behavior.
"""
(OUT / "README.md").write_text(README)
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
