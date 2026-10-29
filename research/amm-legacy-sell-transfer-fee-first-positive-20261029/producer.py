#!/usr/bin/env python3
"""Build research/amm-legacy-sell-transfer-fee-first-positive-20261029 receipts.

2nd run packet #41: the first-positive-net-receipt boundary of the legacy
sell small-amount band under a quote transfer fee.

Packet #15 bisected the nofee band edges (6053 -> 6023 at 5479/5480,
6023 -> success at 16438/16439, zero -> positive gross receipt at
21918/21919) and showed only that tf100 delays the first positive net
receipt past 21919. It never measured where the first positive net
receipt actually lands under any fee, nor how that landing amount moves
with the fee rate. This packet measures it exactly.

The governing rule, verified case by case below: the vault always moves
the GROSS total (vault delta is fee-blind: -(gross user receipt + 2),
legs gross 1/1/0), while each recipient nets gross minus the ceiling
withholding ceil(gross * bps / 10000) (capped at maxfee). A 1-unit gross
leg is therefore fully withheld at any nonzero bps (ceil(1*bps/10000)
= 1), so legs net 0/0/0 in every tf case here, and the user's first
positive net receipt lands at the first amount whose GROSS user receipt
G satisfies ceil(G * bps / 10000) = G - 1:

- nofee gross ladder (re-pinned): receipt 1 at 21919, 2 at 27398,
  3 at 32878, 4 at 38358, 5 at 43837, 10 at 71235;
- bps 100 and 5000 (executed) -> first positive net at gross 2 (27398);
- bps 5001 -> gross 3 (32878): ceil(3*5001/10000) = 2, net 1, while
  gross 2 withholds ceil(2*5001/10000) = 2, net 0;
- bps 6667 -> gross 4 (38358): ceil(4*6667/10000) = 3, net 1, while
  gross 3 withholds 3, net 0;
- bps 8000 -> gross 5 (43837): ceil(5*8000/10000) = 4, net 1, while
  gross 4 withholds 4, net 0;
- bps 9000 -> gross 10 (71235): ceil(10*9000/10000) = 9, net 1, while
  gross 9 withholds 9, net 0;
- cap 0 restores the nofee boundary (tf100max0: 21918 -> 0, 21919 -> 1,
  legs gross 1/1/0, no withholding at all);
- cap 1 does not move the tf100 boundary (tf100max1: 27397 -> 0,
  27398 -> 1; the gross-1 unit was already fully withheld uncapped);
- the error bands are fee-blind: tf5000 and tf10000 give the same
  6053 at 5479, 6023 at 5480 and 16438, and success at 16439 as nofee
  (every error receipt fails before any Token-2022 transfer is invoked; the cause of the bands is not isolated here);
- tf10000 pays no positive net at the executed amounts 16439 (gross 0) and 100000 (gross 15 fully withheld, vault -17, legs 0/0/0).

All cases are pinned on all 3 images (original / #424 control /
#427 candidate). Every success case charges the payer exactly 5,000
lamports (legacy sell creates no volume accumulator).
"""
import base64
import gzip
import hashlib
import json
import os
import shutil
import struct
import sys
import tempfile
from pathlib import Path

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
OUT = ROOT / "research/amm-legacy-sell-transfer-fee-first-positive-20261029"
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


OVERRIDES = {
    "tf100": tf(100),
    "tf5000": tf(5000),
    "tf5001": tf(5001),
    "tf6667": tf(6667),
    "tf8000": tf(8000),
    "tf9000": tf(9000),
    "tf10000": tf(10000),
    "tf100max0": tf(100, 0),
    "tf100max1": tf(100, 1),
}


def _decompress(part_path):
    """Decompress one receipt part via a temp file whose name carries
    this packet's directory name, and return its receipt lines."""
    tmp = tempfile.NamedTemporaryFile(
        prefix="amm-legacy-sell-transfer-fee-first-positive-20261029-",
        suffix=".jsonl", delete=False)
    tmp.close()
    try:
        with gzip.open(part_path, "rb") as src, open(tmp.name, "wb") as dst:
            shutil.copyfileobj(src, dst)
        with open(tmp.name, "rb") as f:
            return f.read().splitlines()
    finally:
        os.unlink(tmp.name)


# (label, kwargs, override-tag-or-None, expected)
# ok expected: (userbase, userquote, vaultbase, vaultquote, protocol, creator, buyback)
# error expected: (code, fragment)
CASES = [
    # nofee gross ladder (re-pinned anchors; vault = -(receipt + 2))
    ("amount21918", dict(amount=21918, limit=0), None,
     ("ok", (-21918, 0, 21918, -2, 1, 1, 0))),
    ("amount21919", dict(amount=21919, limit=0), None,
     ("ok", (-21919, 1, 21919, -3, 1, 1, 0))),
    ("amount27397", dict(amount=27397, limit=0), None,
     ("ok", (-27397, 1, 27397, -3, 1, 1, 0))),
    ("amount27398", dict(amount=27398, limit=0), None,
     ("ok", (-27398, 2, 27398, -4, 1, 1, 0))),
    ("amount32877", dict(amount=32877, limit=0), None,
     ("ok", (-32877, 2, 32877, -4, 1, 1, 0))),
    ("amount32878", dict(amount=32878, limit=0), None,
     ("ok", (-32878, 3, 32878, -5, 1, 1, 0))),
    ("amount38357", dict(amount=38357, limit=0), None,
     ("ok", (-38357, 3, 38357, -5, 1, 1, 0))),
    ("amount38358", dict(amount=38358, limit=0), None,
     ("ok", (-38358, 4, 38358, -6, 1, 1, 0))),
    ("amount43836", dict(amount=43836, limit=0), None,
     ("ok", (-43836, 4, 43836, -6, 1, 1, 0))),
    ("amount43837", dict(amount=43837, limit=0), None,
     ("ok", (-43837, 5, 43837, -7, 1, 1, 0))),
    ("amount71234", dict(amount=71234, limit=0), None,
     ("ok", (-71234, 9, 71234, -11, 1, 1, 0))),
    ("amount71235", dict(amount=71235, limit=0), None,
     ("ok", (-71235, 10, 71235, -12, 1, 1, 0))),
    # first positive net under tf100 / tf5000: gross 2 (27398)
    ("tf100-amount27397", dict(amount=27397, limit=0), "tf100",
     ("ok", (-27397, 0, 27397, -3, 0, 0, 0))),
    ("tf100-amount27398", dict(amount=27398, limit=0), "tf100",
     ("ok", (-27398, 1, 27398, -4, 0, 0, 0))),
    ("tf5000-amount27397", dict(amount=27397, limit=0), "tf5000",
     ("ok", (-27397, 0, 27397, -3, 0, 0, 0))),
    ("tf5000-amount27398", dict(amount=27398, limit=0), "tf5000",
     ("ok", (-27398, 1, 27398, -4, 0, 0, 0))),
    # tf5001: gross 3 (32878)
    ("tf5001-amount32877", dict(amount=32877, limit=0), "tf5001",
     ("ok", (-32877, 0, 32877, -4, 0, 0, 0))),
    ("tf5001-amount32878", dict(amount=32878, limit=0), "tf5001",
     ("ok", (-32878, 1, 32878, -5, 0, 0, 0))),
    # tf6667: gross 4 (38358)
    ("tf6667-amount38357", dict(amount=38357, limit=0), "tf6667",
     ("ok", (-38357, 0, 38357, -5, 0, 0, 0))),
    ("tf6667-amount38358", dict(amount=38358, limit=0), "tf6667",
     ("ok", (-38358, 1, 38358, -6, 0, 0, 0))),
    # tf8000: gross 5 (43837)
    ("tf8000-amount43836", dict(amount=43836, limit=0), "tf8000",
     ("ok", (-43836, 0, 43836, -6, 0, 0, 0))),
    ("tf8000-amount43837", dict(amount=43837, limit=0), "tf8000",
     ("ok", (-43837, 1, 43837, -7, 0, 0, 0))),
    # tf9000: gross 10 (71235)
    ("tf9000-amount71234", dict(amount=71234, limit=0), "tf9000",
     ("ok", (-71234, 0, 71234, -11, 0, 0, 0))),
    ("tf9000-amount71235", dict(amount=71235, limit=0), "tf9000",
     ("ok", (-71235, 1, 71235, -12, 0, 0, 0))),
    # caps: maxfee 0 restores nofee boundary; maxfee 1 does not move tf100
    ("tf100max0-amount21918", dict(amount=21918, limit=0), "tf100max0",
     ("ok", (-21918, 0, 21918, -2, 1, 1, 0))),
    ("tf100max0-amount21919", dict(amount=21919, limit=0), "tf100max0",
     ("ok", (-21919, 1, 21919, -3, 1, 1, 0))),
    ("tf100max1-amount27397", dict(amount=27397, limit=0), "tf100max1",
     ("ok", (-27397, 0, 27397, -3, 0, 0, 0))),
    ("tf100max1-amount27398", dict(amount=27398, limit=0), "tf100max1",
     ("ok", (-27398, 1, 27398, -4, 0, 0, 0))),
    # mid-ladder anchors: gross 10 under tf100 / tf5000
    ("tf100-amount71235", dict(amount=71235, limit=0), "tf100",
     ("ok", (-71235, 9, 71235, -12, 0, 0, 0))),
    ("tf5000-amount71235", dict(amount=71235, limit=0), "tf5000",
     ("ok", (-71235, 5, 71235, -12, 0, 0, 0))),
    # error bands are fee-blind (tf5000, tf10000)
    ("tf5000-amount5479", dict(amount=5479, limit=0), "tf5000",
     ("error", "6053", "BuybackFeeRecipientNotAuthorized")),
    ("tf5000-amount5480", dict(amount=5480, limit=0), "tf5000",
     ("error", "6023", "Overflow")),
    ("tf5000-amount16438", dict(amount=16438, limit=0), "tf5000",
     ("error", "6023", "Overflow")),
    ("tf5000-amount16439", dict(amount=16439, limit=0), "tf5000",
     ("ok", (-16439, 0, 16439, -2, 0, 0, 0))),
    ("tf10000-amount5479", dict(amount=5479, limit=0), "tf10000",
     ("error", "6053", "BuybackFeeRecipientNotAuthorized")),
    ("tf10000-amount5480", dict(amount=5480, limit=0), "tf10000",
     ("error", "6023", "Overflow")),
    ("tf10000-amount16438", dict(amount=16438, limit=0), "tf10000",
     ("error", "6023", "Overflow")),
    ("tf10000-amount16439", dict(amount=16439, limit=0), "tf10000",
     ("ok", (-16439, 0, 16439, -2, 0, 0, 0))),
    ("tf10000-amount100000", dict(amount=100000, limit=0), "tf10000",
     ("ok", (-100000, 0, 100000, -17, 0, 0, 0))),
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
    is_tf = tag is not None and tag.startswith("tf")
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
for part in parts:
    got = _decompress(OUT / part["path"])
    assert len(got) == part["receipts"], (part, len(got))
print(f"_decompress sanity check: {len(parts)} parts re-read OK")
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
report = {"schema": 1, "packet": "amm-legacy-sell-transfer-fee-first-positive-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("First-positive-net-receipt boundaries of the legacy sell "
                    "small-amount band under quote transfer fees. #15 left "
                    "the tf first-positive amount unmeasured (only that "
                    "tf100 delays it past 21919); this packet pins hard-coded adjacent-amount pairs on the "
                    "nofee gross ladder and pins the first positive net "
                    "receipt for bps 100, 5000, 5001, 6667, 8000, 9000, "
                    "caps 0 and 1, plus fee-blindness of the 6053/6023 "
                    "bands under tf5000/tf10000. One cached VM per image, reset before each case (acquire_harness; PUMP_AMM_FRESH_VM not set). Receipts are stored as parts to stay under "
                    "GitHub's 25MB web-upload limit; verify.py reads them "
                    "in order. Snapshots cover non-executable accounts "
                    "only. The quote mint carries the transfer-fee "
                    "extension in tf cases, so the protocol/creator/"
                    "buyback legs land in Token-2022 ATAs. No source "
                    "change, build, or whole-program equivalence claim."),
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

README = f"""# Legacy sell: first positive net receipt under transfer fee

## Problem

Packet #15 bisected the legacy sell small-amount bands only for the
nofee case (6053 -> 6023 at 5479/5480, 6023 -> success at 16438/16439,
zero -> positive gross receipt at 21918/21919) and showed only that a
1% quote transfer fee delays the first positive net receipt past
21919. Where that first positive net receipt actually lands, how it
moves with the fee rate, whether a fee cap moves it, and whether the
error bands themselves move under a fee were all unmeasured.

## Cases

All cases sell base on the shared v1/v2 fixture, limit 0, 3 images
each. The quote mint carries a Token-2022 transfer-fee extension in
tf cases, so the protocol/creator/buyback legs land in Token-2022
ATAs; the base mint has no fee, so base deltas are exact.

- amount21918 / 21919 / 27397 / 27398 / 32877 / 32878 / 38357 / 38358
  / 43836 / 43837 / 71234 / 71235: the nofee gross-receipt ladder,
  re-pinned (receipt 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 9, 10).
- tf100-amount27397 / 27398 and tf5000-amount27397 / 27398: first
  positive net at gross 2.
- tf5001-amount32877 / 32878: first positive net at gross 3.
- tf6667-amount38357 / 38358: first positive net at gross 4.
- tf8000-amount43836 / 43837: first positive net at gross 5.
- tf9000-amount71234 / 71235: first positive net at gross 10.
- tf100max0-amount21918 / 21919: cap 0 restores the nofee boundary.
- tf100max1-amount27397 / 27398: cap 1 does not move the tf100
  boundary.
- tf100-amount71235 / tf5000-amount71235: mid-ladder anchors
  (gross 10 nets 9 / 5).
- tf5000-amount5479 / 5480 / 16438 / 16439 and
  tf10000-amount5479 / 5480 / 16438 / 16439 / 100000: the error
  bands under fee, plus tf10000 never paying a positive net.

## Result

- The vault always moves the GROSS total, fee-blind: vault delta is
  -(gross user receipt + 2) in every case (legs gross 1/1/0), e.g.
  tf9000 at 71235 moves vault -12 exactly like nofee at 71235.
- Each recipient nets gross minus the ceiling withholding
  ceil(gross * bps / 10000) (capped at maxfee). A 1-unit gross leg
  is fully withheld at any nonzero bps (ceil(1 * bps / 10000) = 1),
  so legs net 0/0/0 in every tf case here.
- The user's first positive net receipt lands at the first amount
  whose gross receipt G satisfies ceil(G * bps / 10000) = G - 1:
  bps 100 and 5000 -> G = 2 (amount 27398); bps 5001 -> G = 3
  (32878, since gross 2 withholds ceil(2 * 5001 / 10000) = 2);
  bps 6667 -> G = 4 (38358, since gross 3 withholds 3); bps 8000
  -> G = 5 (43837, since gross 4 withholds 4); bps 9000 -> G = 10
  (71235, since gross 9 withholds 9 and gross 10 withholds 9).
  The step from one gross level to the next is exactly the nofee
  ladder (27398 -> 32878 -> 38358 -> 43837 -> 71235).
- Cap 0 restores the nofee boundary exactly: tf100max0 at 21918
  nets 0 with legs 1/1/0, at 21919 nets 1 with legs 1/1/0 -- no
  withholding at all. Cap 1 does not move the tf100 boundary:
  tf100max1 at 27397 nets 0, at 27398 nets 1, legs 0/0/0 -- the
  gross-1 unit was already fully withheld uncapped.
- Mid-ladder anchors confirm the same rule above the first step:
  gross 10 nets 9 under tf100 (withheld 1) and 5 under tf5000
  (withheld 5), vault -12 in both, legs 0/0/0.
- The error bands are fee-blind: tf5000 and tf10000 give the same
  6053 at 5479, 6023 at 5480 and 16438, and success at 16439 as
  nofee -- the band is driven by the curve quote and the
  fee-subtraction underflow, both computed before any transfer fee
  is withheld from the legs.
- tf10000 pays no positive net at the executed amounts 16439 (gross 0) and 100000 (gross 15 fully withheld, vault -17, legs 0/0/0).
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
they are not claimed for other pool states. The bps -> gross-level
rule is pinned at the probed representatives (100, 5000, 5001,
6667, 8000, 9000), not at every bps value; the formula
net = gross - ceil(gross * bps / 10000) is the Token-2022
withholding rule as observed in the receipts. The whitelist finding
from #12/#13 is not revisited here.
"""
(OUT / "README.md").write_text(README)
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
