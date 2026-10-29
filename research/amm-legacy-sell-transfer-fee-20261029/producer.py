#!/usr/bin/env python3
"""Build research/amm-legacy-sell-transfer-fee-20261029 receipts.

Legacy (v1) sell under quote transfer-fee, pinned at runtime (2nd run
packet #13; run 1 #44 pinned only the nofee legacy sell baseline and
#14 pinned v2 sell quote tf -- none of them pinned the legacy sell
fee legs, the vault/leg split under tf, the small-amount error bands,
or the sell-side whitelist path):

- nofee: user +180,212, vault -182,458, legs protocol 849 / creator
  548 / buyback 849. Gross curve quote is 182,495; lp_fee 37 stays in
  the vault, so vault out (182,458) = user total + net protocol +
  creator + buyback. User receipt matches v2 #14 exactly, but the
  vault/leg split does not (v2 sell vault quote was -181,061);
- tf100: user 178,409 (== v2 #14), vault still -182,458 (gross),
  legs 840 / 542 / 840 = gross legs net of ceil transfer fee
  (849 -> 840, 548 -> 542). Vault out is tf-blind; only the
  recipients' net changes;
- tf5000: user 90,106 (== v2 #14), vault -182,458, legs 424 / 274 / 424;
- tf10000: user 0, legs 0, vault still -182,458 (100% withheld);
  tf10000 with limit 1 -> 6004 ExceededSlippage (limit is on the net
  receipt, == v2 #14);
- tf10001 / tf65535 -> 6023 Overflow in utils/transfer_fee.rs;
- tf100-max100 (cap binding): user 180,112 (== v2 #14 cap) but legs
  stay 840 / 542 / 840 -- the 100 cap binds only on the user leg,
  whose fee (1,803) exceeds it, while leg fees (9 / 6 / 9) do not;
- small-amount bands on the standard layout: amount <= 5000 ->
  6053 BuybackFeeRecipientNotAuthorized (curve quote rounds to 0,
  so creator_fee == 0 and get_buyback_accounts reads remaining[0..1]
  = poolv2 + owner instead of owner + buyback); amount 6000..16000
  -> 6023 Overflow (fee subtraction underflows the tiny quote);
  amount >= 17000 succeeds, including amount 20000 with user receipt
  0 (vault -2, proto 1, creator 1, buyback 0);
- floors are on the net receipt: exact limit succeeds, +1 fails
  6004, both nofee and tf100; limit 0 succeeds (accept-anything);
- whitelist (user == global_config.whitelist_pda, 353..385) with the
  standard 3-account remaining layout -> 6053, because zeroed fees
  again put the buyback index at 0. Dropping poolv2 (remaining[0])
  succeeds with zero fees: user 182,495 (the full gross quote,
  lp_fee 0), vault -182,495, legs 0; tf100 trimmed: user 180,670 =
  182,495 - ceil(182,495 * 100 / 10000), vault -182,495, legs 0.
  (Sell differs from buy #12 here only in the trimmed index: sell
  remaining accounts start at meta 21, so poolv2 is m[21].)
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
OUT = ROOT / "research/amm-legacy-sell-transfer-fee-20261029"
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
    ("nofee", dict(amount=10**9, limit=0), None,
     ("ok", (-1000000000, 180212, 1000000000, -182458, 849, 548, 849))),
    ("tf100", dict(amount=10**9, limit=0), "tf100",
     ("ok", (-1000000000, 178409, 1000000000, -182458, 840, 542, 840))),
    ("tf5000", dict(amount=10**9, limit=0), "tf5000",
     ("ok", (-1000000000, 90106, 1000000000, -182458, 424, 274, 424))),
    ("tf10000", dict(amount=10**9, limit=0), "tf10000",
     ("ok", (-1000000000, 0, 1000000000, -182458, 0, 0, 0))),
    ("tf10000-limit1", dict(amount=10**9, limit=1), "tf10000",
     ("error", "6004", "ExceededSlippage")),
    ("tf10001", dict(amount=10**9, limit=0), "tf10001",
     ("error", "6023", "Overflow")),
    ("tf65535", dict(amount=10**9, limit=0), "tf65535",
     ("error", "6023", "Overflow")),
    ("tf100-max100", dict(amount=10**9, limit=0), "tf100max100",
     ("ok", (-1000000000, 180112, 1000000000, -182458, 840, 542, 840))),
    ("amount0", dict(amount=0, limit=0), None,
     ("error", "6001", "ZeroBaseAmount")),
    ("amount5000", dict(amount=5000, limit=0), None,
     ("error", "6053", "BuybackFeeRecipientNotAuthorized")),
    ("amount10000", dict(amount=10000, limit=0), None,
     ("error", "6023", "Overflow")),
    ("amount20000", dict(amount=20000, limit=0), None,
     ("ok", (-20000, 0, 20000, -2, 1, 1, 0))),
    ("amount100000", dict(amount=100000, limit=0), None,
     ("ok", (-100000, 15, 100000, -17, 1, 1, 0))),
    ("nofee-floor-exact", dict(amount=10**9, limit=180212), None,
     ("ok", (-1000000000, 180212, 1000000000, -182458, 849, 548, 849))),
    ("nofee-floor-plus1", dict(amount=10**9, limit=180213), None,
     ("error", "6004", "ExceededSlippage")),
    ("tf100-floor-exact", dict(amount=10**9, limit=178409), "tf100",
     ("ok", (-1000000000, 178409, 1000000000, -182458, 840, 542, 840))),
    ("tf100-floor-plus1", dict(amount=10**9, limit=178410), "tf100",
     ("error", "6004", "ExceededSlippage")),
    ("tf100-limit0", dict(amount=10**9, limit=0), "tf100",
     ("ok", (-1000000000, 178409, 1000000000, -182458, 840, 542, 840))),
    ("whitelist", dict(amount=10**9, limit=0), "whitelist",
     ("error", "6053", "BuybackFeeRecipientNotAuthorized")),
    ("whitelist-trimmed", dict(amount=10**9, limit=0), "whitelist_trim",
     ("ok", (-1000000000, 182495, 1000000000, -182495, 0, 0, 0))),
    ("whitelist-tf100-trimmed", dict(amount=10**9, limit=0), "whitelist_tf100_trim",
     ("ok", (-1000000000, 180670, 1000000000, -182495, 0, 0, 0))),
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
report = {"schema": 1, "packet": "amm-legacy-sell-transfer-fee-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("Legacy sell on the shared v1/v2 fixture, fresh VM "
                    "per case per image (original / #424 control / #427 "
                    "candidate). Receipts are stored as parts to stay "
                    "under GitHub's 25MB web-upload limit; verify.py reads "
                    "them in order. Snapshots cover non-executable accounts "
                    "only. The quote mint carries the transfer-fee extension "
                    "in tf cases, so protocol/creator/buyback legs land in "
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

README = f"""# Legacy sell under quote transfer-fee

## Problem

Run 1 #44 pinned only the nofee legacy sell baseline (sell 10^9 ->
+180,212 quote, vault -182,458), and #14 pinned v2 sell quote
transfer-fee. Neither pinned the legacy sell fee legs, the
vault/leg split under a quote transfer fee, the small-amount error
bands, or the sell-side whitelist path -- and legacy sell computes
its payouts differently from v2: it transfers the user leg, the net
protocol leg, the creator leg, and the buyback leg as four separate
pool-signed transfers, and it resolves the buyback accounts
unconditionally (legacy_sell.rs) with an index that depends on
whether creator_fee > 0. This packet pins the legacy sell numbers on
the shared fixture and records where they agree with v2 #14 and
where they do not.

## Cases

All cases sell base on the shared v1/v2 fixture, limit 0 unless
noted, 3 images each (original / #424 control / #427 candidate).
The quote mint carries a Token-2022 transfer-fee extension in tf
cases, so the protocol/creator/buyback legs land in Token-2022 ATAs;
the base mint has no fee, so base deltas are exact.

- nofee: baseline sell 10^9.
- tf100 / tf5000 / tf10000 / tf10001 / tf65535: quote fee at 1%,
  50%, 100%, 100.01%, 655.35% (maxfee u64max).
- tf10000-limit1: 100% fee with limit 1.
- tf100-max100: 1% fee with maxfee cap 100 (cap binding).
- amount0 / amount5000 / amount10000 / amount20000 / amount100000:
  small-amount bands.
- nofee-floor-exact / nofee-floor-plus1, tf100-floor-exact /
  tf100-floor-plus1: slippage floor at the exact net receipt and +1.
- tf100-limit0: 1% fee with limit 0 (accept-anything).
- whitelist: user == global_config.whitelist_pda (353..385 set to
  the payer) with the standard 3-account remaining layout
  (poolv2, owner, buyback).
- whitelist-trimmed / whitelist-tf100-trimmed: same whitelist with
  the poolv2 remaining account dropped (2-account layout).

## Result

User receipts agree with v2 #14 everywhere, but the vault/leg split
does not -- legacy sell keeps the vault outflow at the gross
(minus lp_fee) figure under every fee, and only the recipients'
nets move:

- nofee: user +180,212 (== v2 #14), vault -182,458 (v2: -181,061),
  legs protocol +849, creator +548, buyback +849. Gross curve
  quote is 182,495; lp_fee 37 stays in the vault, so vault out
  (182,458) = user total + net protocol + creator + buyback.
- tf100: user +178,409 (== v2 #14), vault still -182,458, legs
  840 / 542 / 840 = gross legs net of the ceiling transfer fee
  (849 -> 840, 548 -> 542). The vault outflow is tf-blind.
- tf5000: user +90,106 (== v2 #14), vault -182,458, legs
  424 / 274 / 424.
- tf10000: user 0, legs 0, vault still -182,458 (100% withheld).
  tf10000 with limit 1: 6004 ExceededSlippage -- the limit is on
  the net receipt (== v2 #14).
- tf10001 and tf65535: 6023 Overflow in utils/transfer_fee.rs.
- tf100-max100 (cap binding): user +180,112 (== v2 #14 cap) but
  legs stay 840 / 542 / 840 -- the 100 cap binds only on the user
  leg, whose fee (1,803) exceeds it, while leg fees (9 / 6 / 9)
  do not.
- small-amount bands: amount <= 5000 -> 6053
  BuybackFeeRecipientNotAuthorized (curve quote rounds to 0, so
  creator_fee == 0 and get_buyback_accounts reads remaining[0..1]
  = poolv2 + owner instead of owner + buyback); amount 6000..16000
  -> 6023 Overflow (fee subtraction underflows the tiny quote);
  amount >= 17000 succeeds, including amount 20000 with user
  receipt 0 (vault -2, proto 1, creator 1, buyback 0) and amount
  100000 with user 15, vault -17, proto 1, creator 1, buyback 0.
- floors are on the net receipt: the exact limit succeeds and +1
  fails 6004 ExceededSlippage, both nofee and tf100. limit 0
  succeeds (accept-anything, == v2 #31).
- amount0: 6001 ZeroBaseAmount.
- whitelist with the standard 3-account remaining layout: 6053
  BuybackFeeRecipientNotAuthorized -- zeroed fees again put the
  buyback index at 0 (same trap as the small-amount band, and as
  buy #12). Dropping poolv2 succeeds with zero fees: user
  +182,495 (the full gross quote, lp_fee 0), vault -182,495, all
  legs 0; tf100 trimmed: user +180,670 = 182,495 -
  ceil(182,495 * 100 / 10000), vault -182,495, legs 0. Sell
  remaining accounts start at meta 21, so poolv2 is m[21] here
  (buy #12 dropped m[23]).

All 3 images agree on every case. Error cases roll back everything
except the payer's 5,000 fee. Success cases also charge the payer
only 5,000 (legacy sell creates no volume accumulator, unlike buy).

Error sites (log paths as emitted by each image):

{SITES}

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The v2 comparison numbers are cited from the
prior packets #14 (v2 sell quote tf) and #44 (legacy sell nofee
baseline) on the same fixture and images, not re-measured here.
The whitelist finding is about the legacy handler's
remaining-account indexing, not about a deployed whitelist
configuration. The small-amount band edges are reported at the
tested points (6053 at <= 5000, 6023 at 6000..16000, success at
>= 17000); the exact integer thresholds between the tested points
were not bisected.
"""
(OUT / "README.md").write_text(README)
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
