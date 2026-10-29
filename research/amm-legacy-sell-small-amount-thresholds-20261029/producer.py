#!/usr/bin/env python3
"""Build research/amm-legacy-sell-small-amount-thresholds-20261029 receipts.

2nd run packet #15: exact integer thresholds of the legacy sell
small-amount bands that #13 left at tested points only (6053 at
<= 5000, 6023 at 6000..16000, success at >= 17000). Bisected on the
original image and pinned on all 3 images (original / #424 control /
#427 candidate), nofee and under a 1% quote transfer fee:

- 6053 -> 6023 boundary: amount 5479 is the last 6053
  (BuybackFeeRecipientNotAuthorized), 5480 the first 6023 Overflow.
  The boundary is tf-blind: tf100 gives the same codes at 5479/5480;
- 6023 -> success boundary: amount 16438 is the last 6023, 16439 the
  first success (user receipt 0, vault -2, proto 1, creator 1,
  buyback 0). Also tf-blind: tf100 at 16438 is 6023, at 16439 a
  success with receipt 0 and legs 0/0/0 (the 1-unit leg fees are
  fully withheld by the 1% fee);
- zero -> positive receipt boundary (nofee): amount 21918 is the last
  success with user receipt 0 (vault -2), 21919 the first with a
  positive receipt (user +1, vault -3, proto 1, creator 1, buyback 0).
  This boundary is NOT tf-blind: under tf100, 21919 still receipts 0
  (the single unit is withheld as fee), legs 0/0/0, vault -3;
- anchors: 5000 (6053), 10000 (6023), 20000 (receipt 0, vault -2),
  100000 (user 15, vault -17, proto 1, creator 1, buyback 0).
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

from pump_amm_legacy_sell_differential import (
    legacy as legacy_sell, legacy_transferfee, quote, mutate, CONFIG_KEY,
    PAYER, PROTOCOL_ATA, CREATOR_ATA, buyback, TOKEN22, PROTOCOL,
    CREATOR_VAULT, ATA,
)
import pump_amm_legacy_sell_differential as S
from pump_amm_legacy_buy_differential import userbase, userquote, vaultbase, vaultquote

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-legacy-sell-small-amount-thresholds-20261029"
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
    return legacy_transferfee(quote, bps, maximum)


def wl(h, m):
    mutate(CONFIG_KEY, 353, bytes(PAYER.pubkey()))(h, m)


def wl_trim(h, m):
    mutate(CONFIG_KEY, 353, bytes(PAYER.pubkey()))(h, m)
    del m[21]


def wl_tf_trim(h, m):
    legacy_transferfee(quote, 100)(h, m)
    mutate(CONFIG_KEY, 353, bytes(PAYER.pubkey()))(h, m)
    del m[21]


OVERRIDES = {
    "tf100": tf(100),
    "tf5000": tf(5000),
    "tf10000": tf(10000),
    "tf10001": tf(10001),
    "tf65535": tf(65535),
    "tf100max100": tf(100, 100),
    "whitelist": wl,
    "whitelist_trim": wl_trim,
    "whitelist_tf100_trim": wl_tf_trim,
}

# (label, kwargs, override-tag-or-None, expected)
# ok expected: (userbase, userquote, vaultbase, vaultquote, protocol, creator, buyback)
# error expected: (code, fragment)
CASES = [
    ("amount5000", dict(amount=5000, limit=0), None,
     ("error", "6053", "BuybackFeeRecipientNotAuthorized")),
    ("amount5479", dict(amount=5479, limit=0), None,
     ("error", "6053", "BuybackFeeRecipientNotAuthorized")),
    ("amount5480", dict(amount=5480, limit=0), None,
     ("error", "6023", "Overflow")),
    ("amount10000", dict(amount=10000, limit=0), None,
     ("error", "6023", "Overflow")),
    ("amount16438", dict(amount=16438, limit=0), None,
     ("error", "6023", "Overflow")),
    ("amount16439", dict(amount=16439, limit=0), None,
     ("ok", (-16439, 0, 16439, -2, 1, 1, 0))),
    ("amount20000", dict(amount=20000, limit=0), None,
     ("ok", (-20000, 0, 20000, -2, 1, 1, 0))),
    ("amount21918", dict(amount=21918, limit=0), None,
     ("ok", (-21918, 0, 21918, -2, 1, 1, 0))),
    ("amount21919", dict(amount=21919, limit=0), None,
     ("ok", (-21919, 1, 21919, -3, 1, 1, 0))),
    ("amount100000", dict(amount=100000, limit=0), None,
     ("ok", (-100000, 15, 100000, -17, 1, 1, 0))),
    ("tf100-amount5479", dict(amount=5479, limit=0), "tf100",
     ("error", "6053", "BuybackFeeRecipientNotAuthorized")),
    ("tf100-amount5480", dict(amount=5480, limit=0), "tf100",
     ("error", "6023", "Overflow")),
    ("tf100-amount16438", dict(amount=16438, limit=0), "tf100",
     ("error", "6023", "Overflow")),
    ("tf100-amount16439", dict(amount=16439, limit=0), "tf100",
     ("ok", (-16439, 0, 16439, -2, 0, 0, 0))),
    ("tf100-amount21919", dict(amount=21919, limit=0), "tf100",
     ("ok", (-21919, 0, 21919, -3, 0, 0, 0))),
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
    is_tf = tag is not None and (tag.startswith("tf") or tag == "whitelist_tf100_trim")
    pa = ata22(PROTOCOL) if is_tf else PROTOCOL_ATA
    ca = ata22(CREATOR_VAULT) if is_tf else CREATOR_ATA
    bb = ata22(BUYBACK_OWNER) if is_tf else buyback
    roles = {
        "fee_payer": str(PAYER.pubkey()),
        "userbase": str(userbase), "userquote": str(userquote),
        "vaultbase": str(vaultbase), "vaultquote": str(vaultquote),
        "protocol_ata": str(pa), "creator_ata": str(ca), "buyback": str(bb),
    }
    row = {"case": {"instruction": "sell", "label": label,
                    "params": {"amount": kwargs["amount"], "limit": kwargs["limit"],
                               "override": tag},
                    "expected": list(expected)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        kw = dict(kwargs)
        if tag is not None:
            kw["overrides"] = OVERRIDES[tag]
        r = legacy_sell(candidate=IMAGES[image], **kw)
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
            assert payer_delta == -5000, (label, image, payer_delta)
            assert len(r["events"]) == 1, (label, image, "no SellEvent")
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
                # Control/candidate builds emit a location-less
                # "AnchorError occurred." line for the transfer_fee
                # overflow (no "thrown in" site at all); record that
                # line itself as the site so verify can pin it.
                site = next((l for l in logs if "AnchorError occurred." in l), None)
            row.setdefault("error_sites", {})[image] = site
            observed = {"payer_delta": payer_delta,
                        "event_count": 0, "sig_fields": 1}
        seen.add((err, json.dumps(observed, sort_keys=True)))
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image,
                        "instruction": "sell", "label": label},
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
report = {"schema": 1, "packet": "amm-legacy-sell-small-amount-thresholds-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("Exact integer thresholds of the legacy sell small-amount "
                    "bands that #13 left at tested points only, bisected on "
                    "the original image and pinned on all 3 images (original "
                    "/ #424 control / #427 candidate), nofee and under a 1% "
                    "quote transfer fee. Fresh VM per case per image. "
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

README = f"""# Legacy sell small-amount thresholds (exact)

## Problem

Packet #13 pinned the legacy sell small-amount bands only at tested
points: 6053 at amount <= 5000, 6023 at 6000..16000, success at
>= 17000. The exact integer thresholds between those points were
explicitly left unbisected. This packet bisects them on the original
image and pins the boundary amounts on all 3 images (original /
#424 control / #427 candidate), nofee and under a 1% quote transfer
fee, so the band edges are exact numbers rather than intervals.

## Cases

All cases sell base on the shared v1/v2 fixture, limit 0, 3 images
each. The quote mint carries a Token-2022 transfer-fee extension in
tf100 cases, so the protocol/creator/buyback legs land in Token-2022
ATAs; the base mint has no fee, so base deltas are exact.

- amount5000 / amount10000 / amount20000 / amount100000: anchors
  carried over from #13 (6053 / 6023 / receipt 0 / receipt 15).
- amount5479 / amount5480: the 6053 -> 6023 edge, both sides.
- amount16438 / amount16439: the 6023 -> success edge, both sides.
- amount21918 / amount21919: the zero -> positive user receipt
  edge, both sides.
- tf100-amount5479 / tf100-amount5480 / tf100-amount16438 /
  tf100-amount16439 / tf100-amount21919: the same edges under a 1%
  quote transfer fee.

## Result

- 6053 -> 6023 boundary: amount 5479 is the last 6053
  BuybackFeeRecipientNotAuthorized, amount 5480 the first 6023
  Overflow. The boundary is fee-blind: tf100 gives the same codes
  at 5479 and 5480 (the band is driven by the curve quote and the
  fee-subtraction underflow, both computed before any transfer fee
  is withheld from the legs).
- 6023 -> success boundary: amount 16438 is the last 6023,
  amount 16439 the first success, with user receipt 0, vault -2,
  proto 1, creator 1, buyback 0. Also fee-blind: tf100 at 16438 is
  6023 and at 16439 a success with receipt 0 and legs 0 / 0 / 0 --
  the 1-unit leg fees are fully withheld by the 1% fee
  (ceil(1 * 100 / 10000) = 1).
- Zero -> positive receipt boundary (nofee): amount 21918 is the
  last success with user receipt 0 (vault -2, proto 1, creator 1,
  buyback 0), amount 21919 the first with a positive receipt
  (user +1, vault -3, proto 1, creator 1, buyback 0). This boundary
  is NOT fee-blind: under tf100, amount 21919 still receipts 0
  (the single unit is withheld as fee), legs 0 / 0 / 0, vault -3.
- Anchors agree with #13 exactly: 5000 -> 6053, 10000 -> 6023,
  20000 -> receipt 0 with vault -2, 100000 -> user 15, vault -17,
  proto 1, creator 1, buyback 0.
- All 3 images agree on every case. Error cases roll back
  everything except the payer's 5,000 fee. Success cases also
  charge the payer only 5,000 (legacy sell creates no volume
  accumulator, unlike buy).

Error sites (log paths as emitted by each image):

{SITES}

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The thresholds are exact for this fixture's
curve state (virtual reserves and fee parameters as snapshotted);
they are not claimed for other pool states. The whitelist finding
from #12/#13 is not revisited here.
"""
(OUT / "README.md").write_text(README)
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
