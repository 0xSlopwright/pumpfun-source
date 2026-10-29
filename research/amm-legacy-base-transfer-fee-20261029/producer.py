#!/usr/bin/env python3
"""Build research/amm-legacy-base-transfer-fee-20261029 receipts.

Legacy (v1) buy / sell / buy_exact under BASE transfer-fee, pinned at
runtime (2nd run packet #14; run 1 #44 pinned only the Token-2022
rejection framing, #12/#13 pinned legacy buy_exact/sell QUOTE tf --
none of them pinned the legacy BASE leg under a transfer fee):

- The legacy handlers do NOT reject a Token-2022 base mint outright:
  they transfer through whichever token-program account is passed in
  the metas. #44's InvalidAccountData came from passing the plain
  Token program against a Token-2022 mint; passing TOKEN22 (as
  legacy_transferfee does, rewriting the mint and the base token
  accounts as Token-2022 accounts) makes the base leg transfer
  succeed, with the fee withheld by the Token-2022 program itself.
- Sell 10^9 base: user always spends the full gross 10^9 and always
  receives 180,212 quote; only the vault's base receipt moves:
  nofee +10^9, tf100 +990,000,000, tf5000 +500,000,000,
  tf10000 +0 (100% withheld, still success). Quote legs are
  unchanged in every success case (protocol 849, creator 548,
  buyback 849), and the vault quote outflow stays -182,458.
- Buy 10^10 base: vault always sends the full gross -10^10 and the
  user always spends 1,847,796 quote; only the user's base receipt
  moves: nofee +10^10, tf100 +9,900,000,000, tf5000 +5,000,000,000,
  tf10000 +0 (success). Quote legs unchanged (protocol 8,487,
  creator 5,475, buyback 8,486).
- Buy_exact 10^7 quote in: gross base 54,115,018,303, vault quote
  +9,878,518, legs 45,926 / 29,630 / 45,926 in every success case;
  tf100 user receipt is 53,573,868,119 = gross - ceil(gross*100/10000)
  (ceiling rounding, pinned by the odd gross), tf10000 is 0.
- bps > 10000 on the base leg does NOT surface as the AMM's 6023
  Overflow (as quote tf does in #12/#13, where the AMM pre-computes
  amount_after_fee): the AMM never pre-computes the base fee, so the
  Token-2022 transfer CPI itself overflows and the whole transaction
  fails with Token-2022 program error 0xe, rolling everything back
  except the payer's 5,000 fee. This holds for sell, buy, and
  buy_exact alike (tf10001 and tf65535).
- Cap binding: tf100 with maxfee 100 withholds exactly 100, both
  directions (sell vault +999,999,900, buy user +9,999,999,900).
- Limits are on the quote side and are blind to the base fee: sell
  tf100 with limit = exact quote receipt 180,212 succeeds and
  +1 fails 6004 ExceededSlippage; buy tf100 with limit = exact
  quote spend 1,847,796 succeeds and -1 fails 6004.
- Payer cost: sell success/error = 5,000 only; buy/buy_exact
  success = 1,849,400 (1,844,400 volume-accumulator rent + 5,000
  fee), error = 5,000 only.
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
    legacy as legacy_sell, legacy_transferfee, base, quote,
    userbase, userquote, vaultbase, vaultquote,
    PROTOCOL_ATA, CREATOR_ATA, buyback, PAYER,
)
from pump_amm_legacy_buy_differential import legacy_buy

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-legacy-base-transfer-fee-20261029"
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


def tf(bps, maximum=2**64 - 1):
    return legacy_transferfee(base, bps, maximum)


OVERRIDES = {
    "tf100": tf(100),
    "tf5000": tf(5000),
    "tf10000": tf(10000),
    "tf10001": tf(10001),
    "tf65535": tf(65535),
    "tf100max100": tf(100, 100),
}

ERR_0E = ("error", "InstructionErrorCustom(14)", "custom program error: 0xe")

# (instruction, label, kwargs, override-tag-or-None, expected)
# ok expected: (userbase, userquote, vaultbase, vaultquote, protocol, creator, buyback)
# error expected: (code, fragment)
CASES = [
    ("sell", "sell-nofee", dict(amount=10**9, limit=0), None,
     ("ok", (-1000000000, 180212, 1000000000, -182458, 849, 548, 849))),
    ("sell", "sell-tf100", dict(amount=10**9, limit=0), "tf100",
     ("ok", (-1000000000, 180212, 990000000, -182458, 849, 548, 849))),
    ("sell", "sell-tf5000", dict(amount=10**9, limit=0), "tf5000",
     ("ok", (-1000000000, 180212, 500000000, -182458, 849, 548, 849))),
    ("sell", "sell-tf10000", dict(amount=10**9, limit=0), "tf10000",
     ("ok", (-1000000000, 180212, 0, -182458, 849, 548, 849))),
    ("sell", "sell-tf10001", dict(amount=10**9, limit=0), "tf10001", ERR_0E),
    ("sell", "sell-tf65535", dict(amount=10**9, limit=0), "tf65535", ERR_0E),
    ("sell", "sell-tf100-max100", dict(amount=10**9, limit=0), "tf100max100",
     ("ok", (-1000000000, 180212, 999999900, -182458, 849, 548, 849))),
    ("sell", "sell-tf100-limit-exact", dict(amount=10**9, limit=180212), "tf100",
     ("ok", (-1000000000, 180212, 990000000, -182458, 849, 548, 849))),
    ("sell", "sell-tf100-limit-plus1", dict(amount=10**9, limit=180213), "tf100",
     ("error", "6004", "ExceededSlippage")),
    ("buy", "buy-nofee", dict(amount=10**10, limit=10**12), None,
     ("ok", (10000000000, -1847796, -10000000000, 1825348, 8487, 5475, 8486))),
    ("buy", "buy-tf100", dict(amount=10**10, limit=10**12), "tf100",
     ("ok", (9900000000, -1847796, -10000000000, 1825348, 8487, 5475, 8486))),
    ("buy", "buy-tf5000", dict(amount=10**10, limit=10**12), "tf5000",
     ("ok", (5000000000, -1847796, -10000000000, 1825348, 8487, 5475, 8486))),
    ("buy", "buy-tf10000", dict(amount=10**10, limit=10**12), "tf10000",
     ("ok", (0, -1847796, -10000000000, 1825348, 8487, 5475, 8486))),
    ("buy", "buy-tf10001", dict(amount=10**10, limit=10**12), "tf10001", ERR_0E),
    ("buy", "buy-tf65535", dict(amount=10**10, limit=10**12), "tf65535", ERR_0E),
    ("buy", "buy-tf100-max100", dict(amount=10**10, limit=10**12), "tf100max100",
     ("ok", (9999999900, -1847796, -10000000000, 1825348, 8487, 5475, 8486))),
    ("buy", "buy-tf100-limit-exact", dict(amount=10**10, limit=1847796), "tf100",
     ("ok", (9900000000, -1847796, -10000000000, 1825348, 8487, 5475, 8486))),
    ("buy", "buy-tf100-limit-minus1", dict(amount=10**10, limit=1847795), "tf100",
     ("error", "6004", "ExceededSlippage")),
    ("buy_exact", "buy-exact-nofee", dict(amount=10**7, limit=1), None,
     ("ok", (54115018303, -10000000, -54115018303, 9878518, 45926, 29630, 45926))),
    ("buy_exact", "buy-exact-tf100", dict(amount=10**7, limit=1), "tf100",
     ("ok", (53573868119, -10000000, -54115018303, 9878518, 45926, 29630, 45926))),
    ("buy_exact", "buy-exact-tf10000", dict(amount=10**7, limit=1), "tf10000",
     ("ok", (0, -10000000, -54115018303, 9878518, 45926, 29630, 45926))),
    ("buy_exact", "buy-exact-tf10001", dict(amount=10**7, limit=1), "tf10001", ERR_0E),
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


def run_case(instruction, kwargs, tag, image):
    kw = dict(kwargs)
    if tag is not None:
        kw["overrides"] = OVERRIDES[tag]
    if instruction == "sell":
        return legacy_sell(candidate=IMAGES[image], **kw)
    if instruction == "buy":
        return legacy_buy(candidate=IMAGES[image], **kw)
    return legacy_buy(name="buy_exact_quote_in", candidate=IMAGES[image], **kw)


receipts_global = []
report_cases = []
for index, (instruction, label, kwargs, tag, expected) in enumerate(CASES):
    roles = {
        "fee_payer": str(PAYER.pubkey()),
        "userbase": str(userbase), "userquote": str(userquote),
        "vaultbase": str(vaultbase), "vaultquote": str(vaultquote),
        "protocol_ata": str(PROTOCOL_ATA), "creator_ata": str(CREATOR_ATA),
        "buyback": str(buyback),
    }
    row = {"case": {"instruction": instruction, "label": label,
                    "params": {"amount": kwargs["amount"], "limit": kwargs["limit"],
                               "override": tag},
                    "expected": list(expected)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        r = run_case(instruction, kwargs, tag, image)
        raw = base64.b64decode(r["transaction_base64"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == 1, (label, image, checks)
        before, after = r["before"], r["after"]
        fee_key = roles["fee_payer"]
        payer_delta = (lamp(after, PAYER.pubkey()) or 0) - \
                      (lamp(before, PAYER.pubkey()) or 0)
        err, logs = r["error"], r["logs"]
        if expected[0] == "ok":
            assert err is None, (label, image, err)
            deltas = (
                tok_amount(after, userbase) - tok_amount(before, userbase),
                tok_amount(after, userquote) - tok_amount(before, userquote),
                tok_amount(after, vaultbase) - tok_amount(before, vaultbase),
                tok_amount(after, vaultquote) - tok_amount(before, vaultquote),
                tok_amount(after, PROTOCOL_ATA) - tok_amount(before, PROTOCOL_ATA),
                tok_amount(after, CREATOR_ATA) - tok_amount(before, CREATOR_ATA),
                tok_amount(after, buyback) - tok_amount(before, buyback),
            )
            assert deltas == expected[1], (label, image, deltas, expected[1])
            want_payer = -5000 if instruction == "sell" else -1849400
            assert payer_delta == want_payer, (label, image, payer_delta)
            assert len(r["events"]) == 1, (label, image, "no event")
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
                site = next((l for l in logs if "failed: custom program error: 0xe" in l), None)
            if site is None:
                site = next((l for l in logs if "AnchorError occurred." in l), None)
            row.setdefault("error_sites", {})[image] = site
            observed = {"payer_delta": payer_delta,
                        "event_count": 0, "sig_fields": 1}
        seen.add((err, json.dumps(observed, sort_keys=True)))
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image,
                        "instruction": instruction, "label": label},
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
report = {"schema": 1, "packet": "amm-legacy-base-transfer-fee-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("Legacy buy / sell / buy_exact on the shared v1/v2 "
                    "fixture, fresh VM per case per image (original / "
                    "#424 control / #427 candidate). Receipts are stored "
                    "as parts to stay under GitHub's 25MB web-upload "
                    "limit; verify.py reads them in order. Snapshots "
                    "cover non-executable accounts only. The base mint "
                    "carries a Token-2022 transfer-fee extension in tf "
                    "cases, and the base token program meta is TOKEN22, "
                    "so the base token accounts are Token-2022 accounts "
                    "at the same fixture addresses. No source change, "
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

README = f"""# Legacy buy / sell / buy_exact under base transfer-fee

## Problem

Run 1 #44 pinned legacy buy/sell rejecting a Token-2022 mint with
InvalidAccountData, and #12/#13 pinned legacy buy_exact/sell QUOTE
transfer-fee. Neither pinned the legacy BASE leg under a transfer
fee -- and the base leg behaves differently from the quote leg in
two ways that matter: the legacy handlers do not pre-compute the
base fee at all, and the rejection in #44 turns out to be about
which token-program account is passed, not about the mint itself.
This packet pins the legacy base-fee numbers on the shared fixture
and records where they agree with v2 #43 (trade base tf) and where
they do not.

## Cases

All cases run on the shared v1/v2 fixture, 3 images each (original /
#424 control / #427 candidate). In tf cases the base mint carries a
Token-2022 transfer-fee extension and the base token-program meta is
TOKEN22 (the base token accounts are Token-2022 accounts at the same
fixture addresses); the quote mint has no fee.

- sell-nofee / sell-tf100 / sell-tf5000 / sell-tf10000 /
  sell-tf10001 / sell-tf65535: sell 10^9 base, limit 0, base fee at
  0%, 1%, 50%, 100%, 100.01%, 655.35% (maxfee u64max).
- sell-tf100-max100: sell 10^9 with 1% fee and maxfee cap 100.
- sell-tf100-limit-exact / sell-tf100-limit-plus1: sell 10^9 with
  1% fee and limit at the exact quote receipt (180,212) and +1.
- buy-nofee / buy-tf100 / buy-tf5000 / buy-tf10000 / buy-tf10001 /
  buy-tf65535: buy 10^10 base, limit 10^12, same fee grid.
- buy-tf100-max100: buy 10^10 with 1% fee and maxfee cap 100.
- buy-tf100-limit-exact / buy-tf100-limit-minus1: buy 10^10 with
  1% fee and limit at the exact quote spend (1,847,796) and -1.
- buy-exact-nofee / buy-exact-tf100 / buy-exact-tf10000 /
  buy-exact-tf10001: buy_exact 10^7 quote in, limit 1, base fee at
  0%, 1%, 100%, 100.01%.

## Result

The legacy handlers transfer through whichever token-program account
is passed in the metas: passing TOKEN22 with a Token-2022 base mint
succeeds, so #44's InvalidAccountData is a program-meta mismatch,
not a mint rejection. The fee is withheld by the Token-2022 program
during the transfer itself -- the AMM never pre-computes it:

- sell 10^9 base: the user always spends the full gross 10^9 and
  always receives 180,212 quote; only the vault's base receipt
  moves: nofee +10^9, tf100 +990,000,000, tf5000 +500,000,000,
  tf10000 +0 (100% withheld, still success). Quote legs are
  unchanged in every success case (protocol +849, creator +548,
  buyback +849) and the vault quote outflow stays -182,458
  (v2 #43 sell vault quote was -181,061 -- the legacy/v2 split
  difference persists under base tf).
- buy 10^10 base: the vault always sends the full gross -10^10 and
  the user always spends 1,847,796 quote; only the user's base
  receipt moves: nofee +10^10, tf100 +9,900,000,000, tf5000
  +5,000,000,000, tf10000 +0 (success). Quote legs unchanged
  (protocol +8,487, creator +5,475, buyback +8,486); vault quote
  +1,825,348 (v2 #43 buy vault quote was +1,839,310).
- buy_exact 10^7 quote in: gross base 54,115,018,303, vault quote
  +9,878,518, legs 45,926 / 29,630 / 45,926 in every success case
  (same gross/legs as #12's quote-tf packet, which had vault quote
  +9,878,518 vs v2's +9,954,074). tf100 user receipt is
  53,573,868,119 = gross - ceil(gross*100/10000): the odd gross
  pins ceiling rounding (floor would give 53,573,868,120).
  tf10000 is 0, still success.
- bps > 10000 on the base leg does NOT surface as the AMM's 6023
  Overflow (as quote tf does in #12/#13, where the AMM
  pre-computes amount_after_fee): the Token-2022 transfer CPI
  itself overflows, so the transaction fails with Token-2022
  program error 0xe and rolls everything back except the payer's
  5,000 fee. Identical for sell, buy, and buy_exact (tf10001 and
  tf65535).
- cap binding: tf100 with maxfee 100 withholds exactly 100, both
  directions (sell vault +999,999,900, buy user +9,999,999,900).
- limits are on the quote side and blind to the base fee: sell
  tf100 with limit = exact quote receipt 180,212 succeeds and +1
  fails 6004 ExceededSlippage; buy tf100 with limit = exact quote
  spend 1,847,796 succeeds and -1 fails 6004.
- payer cost: sell success/error = 5,000 only; buy/buy_exact
  success = 1,849,400 (1,844,400 volume-accumulator rent + 5,000
  fee), error = 5,000 only.

All 3 images agree on every case. Error cases roll back everything
except the payer's 5,000 fee.

Error sites (log paths as emitted by each image):

{SITES}

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The v2 comparison numbers are cited from prior
packets #43 (trade base tf) and #12/#13 (legacy quote tf) on the
same fixture and images, not re-measured here. The Token-2022 base
mint is synthesized post-hoc (extension data + TOKEN22 owner on the
mint and base token accounts); a base mint created through the
legacy create path cannot carry a transfer fee, so this pins the
handler's transfer behavior, not a reachable mainnet state.
"""
(OUT / "README.md").write_text(README)
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
