#!/usr/bin/env python3
"""Build research/amm-legacy-buy-exact-small-amount-bands-20261029 receipts.

2nd run packet #16: exact small-amount bands of legacy
buy_exact_quote_in that #12 left at single points only (amount1 ->
6039, amount0 -> 6002, limit0 -> 6001, floors at 10^7). Bisected on
the original image and pinned on all 3 images (original / #424
control / #427 candidate), nofee and under quote transfer fees:

- nofee: amounts 1..2 -> 6039 BuyNotEnoughQuoteTokensToCoverFees,
  3..4 -> 6040 BuySlippageBelowMinBaseAmountOut, >= 5 success;
- tf100: amounts 2..3 -> 6039, 4..5 -> 6040, >= 6 success. The fee
  shifts both edges by exactly +1 amount (and the 6039 edge by +1
  from nofee's 2 to 3);
- tf5000: amounts 3..5 -> 6039, 6..9 -> 6040, >= 10 success;
- tf10000 at amount 1000 -> 6039 (== #12 at 10^7);
- boundary successes pin the fee-eaten legs: nofee amount 5 gives
  base 5479, vault 3, legs 1/1/0; tf100 amount 6 gives the same base
  5479 for spend 6 with legs 0/0/0 (the 1-unit legs are fully
  withheld by the 1% fee); tf5000 amount 10 gives base 5479 for
  spend 8 with legs 0/0/0;
- floors at small amounts are net base_out based: nofee amount 5
  limit 5479 succeeds, 5480 -> 6040; tf100 amount 6 limit 5479
  succeeds, 5480 -> 6040.

NOTE: the tf override must go through adapt_sell_helper (as in
#12). The raw legacy_transferfee override leaves the buy harness's
remaining accounts unadapted and every tf case then fails 6062
InvalidPoolV2 -- a harness artifact, not handler behavior.
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
OUT = ROOT / "research/amm-legacy-buy-exact-small-amount-bands-20261029"
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
    "tf10000": tf(10000),
}

# (label, kwargs, override-tag-or-None, expected)
# ok expected: (userbase, userquote, vaultbase, vaultquote, protocol, creator, buyback)
# error expected: (code, fragment)
CASES = [
    ("nofee-amount1", dict(amount=1, limit=1), None,
     ("error", "6039", "BuyNotEnoughQuoteTokensToCoverFees")),
    ("nofee-amount2", dict(amount=2, limit=1), None,
     ("error", "6039", "BuyNotEnoughQuoteTokensToCoverFees")),
    ("nofee-amount3", dict(amount=3, limit=1), None,
     ("error", "6040", "BuySlippageBelowMinBaseAmountOut")),
    ("nofee-amount4", dict(amount=4, limit=1), None,
     ("error", "6040", "BuySlippageBelowMinBaseAmountOut")),
    ("nofee-amount5", dict(amount=5, limit=1), None,
     ("ok", (5479, -5, -5479, 3, 1, 1, 0))),
    ("nofee-amount10", dict(amount=10, limit=1), None,
     ("ok", (32877, -10, -32877, 8, 1, 1, 0))),
    ("nofee-amount100", dict(amount=100, limit=1), None,
     ("ok", (526040, -100, -526040, 98, 1, 1, 0))),
    ("tf100-amount2", dict(amount=2, limit=1), "tf100",
     ("error", "6039", "BuyNotEnoughQuoteTokensToCoverFees")),
    ("tf100-amount3", dict(amount=3, limit=1), "tf100",
     ("error", "6039", "BuyNotEnoughQuoteTokensToCoverFees")),
    ("tf100-amount4", dict(amount=4, limit=1), "tf100",
     ("error", "6040", "BuySlippageBelowMinBaseAmountOut")),
    ("tf100-amount5", dict(amount=5, limit=1), "tf100",
     ("error", "6040", "BuySlippageBelowMinBaseAmountOut")),
    ("tf100-amount6", dict(amount=6, limit=1), "tf100",
     ("ok", (5479, -6, -5479, 3, 0, 0, 0))),
    ("tf100-amount10", dict(amount=10, limit=1), "tf100",
     ("ok", (27397, -10, -27397, 7, 0, 0, 0))),
    ("tf100-amount100", dict(amount=100, limit=1), "tf100",
     ("ok", (520560, -100, -520560, 97, 0, 0, 0))),
    ("tf5000-amount5", dict(amount=5, limit=1), "tf5000",
     ("error", "6039", "BuyNotEnoughQuoteTokensToCoverFees")),
    ("tf5000-amount6", dict(amount=6, limit=1), "tf5000",
     ("error", "6040", "BuySlippageBelowMinBaseAmountOut")),
    ("tf5000-amount9", dict(amount=9, limit=1), "tf5000",
     ("error", "6040", "BuySlippageBelowMinBaseAmountOut")),
    ("tf5000-amount10", dict(amount=10, limit=1), "tf5000",
     ("ok", (5479, -8, -5479, 3, 0, 0, 0))),
    ("tf10000-amount1000", dict(amount=1000, limit=1), "tf10000",
     ("error", "6039", "BuyNotEnoughQuoteTokensToCoverFees")),
    ("nofee-floor-exact", dict(amount=5, limit=5479), None,
     ("ok", (5479, -5, -5479, 3, 1, 1, 0))),
    ("nofee-floor-plus1", dict(amount=5, limit=5480), None,
     ("error", "6040", "BuySlippageBelowMinBaseAmountOut")),
    ("tf100-floor-exact", dict(amount=6, limit=5479), "tf100",
     ("ok", (5479, -6, -5479, 3, 0, 0, 0))),
    ("tf100-floor-plus1", dict(amount=6, limit=5480), "tf100",
     ("error", "6040", "BuySlippageBelowMinBaseAmountOut")),
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
    is_tf = tag is not None
    pa = ata22(PROTOCOL) if is_tf else PROTOCOL_ATA
    ca = ata22(CREATOR_VAULT) if is_tf else CREATOR_ATA
    bb = ata22(BUYBACK_OWNER) if is_tf else buyback
    roles = {
        "fee_payer": str(PAYER.pubkey()),
        "userbase": str(userbase), "userquote": str(userquote),
        "vaultbase": str(vaultbase), "vaultquote": str(vaultquote),
        "protocol_ata": str(pa), "creator_ata": str(ca), "buyback": str(bb),
    }
    row = {"case": {"instruction": "buy_exact_quote_in", "label": label,
                    "params": {"amount": kwargs["amount"], "limit": kwargs["limit"],
                               "override": tag},
                    "expected": list(expected)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        kw = dict(kwargs)
        if tag is not None:
            kw["overrides"] = OVERRIDES[tag]
        r = legacy_buy(name="buy_exact_quote_in", candidate=IMAGES[image], **kw)
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
                        "instruction": "buy_exact_quote_in", "label": label},
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
report = {"schema": 1, "packet": "amm-legacy-buy-exact-small-amount-bands-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("Exact small-amount bands of legacy buy_exact_quote_in "
                    "that #12 left at single points only, bisected on the "
                    "original image and pinned on all 3 images (original "
                    "/ #424 control / #427 candidate), nofee and under "
                    "quote transfer fees. Fresh VM per case per image. "
                    "Receipts are stored as parts to stay under GitHub's "
                    "25MB web-upload limit; verify.py reads them in order. "
                    "Snapshots cover non-executable accounts only. The quote "
                    "mint carries the transfer-fee extension in tf cases, so "
                    "protocol/creator/buyback legs land in Token-2022 ATAs. "
                    "No source change, build, or whole-program equivalence "
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

README = f"""# Legacy buy_exact small-amount bands (exact)

## Problem

Packet #12 pinned legacy `buy_exact_quote_in` only at single
points: amount1 -> 6039, amount0 -> 6002, limit0 -> 6001, and the
floors at amount 10^7. The exact small-amount bands -- where the
6039 fee-coverage failure gives way to the 6040 slippage failure
and then to success, and how a quote transfer fee shifts those
edges -- were unbisected. This packet bisects them on the original
image and pins the boundary amounts on all 3 images (original /
#424 control / #427 candidate), nofee and under quote transfer
fees, so the band edges are exact numbers rather than intervals.

## Cases

All cases buy_exact on the shared v1/v2 fixture, limit 1 unless
stated, 3 images each. The quote mint carries a Token-2022
transfer-fee extension in tf cases, so the protocol/creator/buyback
legs land in Token-2022 ATAs; the base mint has no fee, so base
deltas are exact.

- nofee-amount1 / amount2: the 6039 band, both sides of its top.
- nofee-amount3 / amount4: the 6040 band, both sides of its top.
- nofee-amount5 / amount10 / amount100: first success and larger
  successes (base 5479 / 32877 / 526040, legs 1/1/0 throughout).
- tf100-amount2 / amount3: the shifted 6039 band.
- tf100-amount4 / amount5: the shifted 6040 band.
- tf100-amount6 / amount10 / amount100: first success and larger
  successes (base 5479 / 27397 / 520560, legs 0/0/0 throughout --
  the 1-unit legs are fully withheld by the 1% fee).
- tf5000-amount5: the 6039 band top under a 50% fee.
- tf5000-amount6 / amount9: the 6040 band, both sides of its top.
- tf5000-amount10: first success (base 5479, spend 8, legs 0/0/0).
- tf10000-amount1000: 6039 under a 100% fee (== #12 at 10^7).
- nofee-floor-exact / nofee-floor-plus1: amount 5, limit 5479
  succeeds, limit 5480 -> 6040.
- tf100-floor-exact / tf100-floor-plus1: amount 6, limit 5479
  succeeds, limit 5480 -> 6040.

## Result

- Nofee bands: amounts 1..2 -> 6039
  BuyNotEnoughQuoteTokensToCoverFees, 3..4 -> 6040
  BuySlippageBelowMinBaseAmountOut, >= 5 success.
- tf100 bands: amounts 2..3 -> 6039, 4..5 -> 6040, >= 6 success.
  The 1% fee shifts both edges by exactly +1 amount (the 6039
  edge moves from 2 to 3, the success edge from 5 to 6).
- tf5000 bands: amounts 3..5 -> 6039, 6..9 -> 6040, >= 10
  success. The 50% fee widens the 6039 band to 3 amounts and the
  6040 band to 4 amounts.
- tf10000 at amount 1000 -> 6039, matching #12 at 10^7: a 100%
  fee leaves nothing to cover fees at any amount.
- Boundary successes pin the fee-eaten legs: nofee amount 5 gives
  base 5479, vault quote 3, legs 1/1/0; tf100 amount 6 gives the
  same base 5479 for spend 6 with legs 0/0/0; tf5000 amount 10
  gives base 5479 for spend 8 with legs 0/0/0. Spends under fees
  are below the nominal amount (tf5000 amount 10 spends 8), the
  same legacy behavior seen at 10^7 in #12.
- Floors at small amounts are net base_out based: nofee amount 5
  limit 5479 succeeds and 5480 -> 6040; tf100 amount 6 limit 5479
  succeeds and 5480 -> 6040.
- All 3 images agree on every case. Error cases roll back
  everything except the payer's 5,000 fee. Success cases charge
  the payer 1,849,400 (1,844,400 volume-accumulator rent + 5,000
  fee) and emit 1 BuyEvent.

Error sites (log paths as emitted by each image):

{SITES}

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The thresholds are exact for this fixture's
curve state (virtual reserves and fee parameters as snapshotted);
they are not claimed for other pool states. The whitelist finding
from #12 is not revisited here. The tf override must go through
adapt_sell_helper (as in #12): the raw transfer-fee override leaves
the buy harness's remaining accounts unadapted and every tf case
then fails 6062 InvalidPoolV2, a harness artifact, not handler
behavior.
"""
(OUT / "README.md").write_text(README)
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
