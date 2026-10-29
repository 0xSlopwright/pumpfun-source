#!/usr/bin/env python3
"""Build research/amm-legacy-buy-exact-transfer-fee-20261029 receipts.

Legacy (v1) buy_exact_quote_in under quote transfer-fee, pinned at
runtime (2nd run packet #12; run 1 #25 pinned only the nofee baseline
equivalence, #12 pinned v2 buy_exact tf, #46 pinned v2 buy_exact
base tf, #31 pinned v2 buy_exact zeros -- none of them pinned the
legacy exact quote-fee math, its fee split, or the whitelist path):

- nofee baseline: base 54,115,018,303 (== v2) for 10^7 quote spent,
  but the quote split differs from v2: legacy vault quote
  9,878,518 vs v2's 9,954,074 (delta 75,556), fee legs protocol
  45,926 + creator 29,630 + buyback 45,926 = 121,482 vs v2's implied
  45,926 total. Same base delivery, different quote split;
- tf100: base 53,573,907,921 (== v2 #12), spent 9,998,786 (v2:
  9,999,541, delta 755), vault 9,779,732, legs 45,012/29,040/45,012;
- tf5000: base 27,058,593,160 (== v2 #12), spent 9,939,259 (v2:
  9,977,037, delta 37,778), vault 4,939,259, legs 11,481/7,407/11,481;
- tf10000 -> 6039 BuyNotEnoughQuoteTokensToCoverFees (== v2 #12);
  tf10001/tf65535 -> 6023 Overflow (transfer_fee.rs);
- tf100 with maxfee cap 100: base 54,114,475,911 (== v2 #12 cap),
  spent 10,000,000, vault 9,878,419;
- amount0 -> 6002 ZeroQuoteAmount, limit0 -> 6001 ZeroBaseAmount
  (== v2 #31); amount1 -> 6039 (fee estimation eats the unit);
- floors are on the net base_out: the exact base_out limit succeeds
  and +1 fails 6040 BuySlippageBelowMinBaseAmountOut, both nofee and
  tf100;
- whitelist (user == global_config.whitelist_pda, 353..385): fees are
  zeroed, so creator_fee == 0 leaves the remaining-account index at
  0 and get_buyback_accounts reads poolv2+owner instead of
  owner+buyback -> 6053 BuybackFeeRecipientNotAuthorized with the
  standard 3-account remaining layout. Dropping poolv2 (2-account
  layout) succeeds with zero fees: nofee base 54,791,407,798,
  vault 10,000,000, all legs 0; tf100 base 54,243,537,781, vault
  9,900,000, all legs 0. v2 trade has no whitelist path at all.
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
    legacy_transferfee, quote, mutate, CONFIG_KEY, PAYER, PROTOCOL_ATA,
    CREATOR_ATA, buyback, TOKEN22, PROTOCOL, CREATOR_VAULT, ATA,
)
import pump_amm_legacy_sell_differential as S

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-legacy-buy-exact-transfer-fee-20261029"
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
    base64.b64decode(S.f["accounts"]["buyback_fee_recipient"]["data_base64"])[32:64]
)


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
    tf(100)(h, m)
    mutate(CONFIG_KEY, 353, bytes(PAYER.pubkey()))(h, m)
    del m[23]


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
    ("nofee", dict(amount=10**7, limit=1), None,
     ("ok", (54115018303, -10000000, -54115018303, 9878518, 45926, 29630, 45926))),
    ("tf100", dict(amount=10**7, limit=1), "tf100",
     ("ok", (53573907921, -9998786, -53573907921, 9779732, 45012, 29040, 45012))),
    ("tf5000", dict(amount=10**7, limit=1), "tf5000",
     ("ok", (27058593160, -9939259, -27058593160, 4939259, 11481, 7407, 11481))),
    ("tf10000", dict(amount=10**7, limit=1), "tf10000",
     ("error", "6039", "BuyNotEnoughQuoteTokensToCoverFees")),
    ("tf10001", dict(amount=10**7, limit=1), "tf10001",
     ("error", "6023", "Overflow")),
    ("tf65535", dict(amount=10**7, limit=1), "tf65535",
     ("error", "6023", "Overflow")),
    ("tf100-max100", dict(amount=10**7, limit=1), "tf100max100",
     ("ok", (54114475911, -10000000, -54114475911, 9878419, 45826, 29530, 45825))),
    ("amount0", dict(amount=0, limit=1), None,
     ("error", "6002", "ZeroQuoteAmount")),
    ("limit0", dict(amount=10**7, limit=0), None,
     ("error", "6001", "ZeroBaseAmount")),
    ("amount1", dict(amount=1, limit=1), None,
     ("error", "6039", "BuyNotEnoughQuoteTokensToCoverFees")),
    ("nofee-floor-exact", dict(amount=10**7, limit=54115018303), None,
     ("ok", (54115018303, -10000000, -54115018303, 9878518, 45926, 29630, 45926))),
    ("nofee-floor-plus1", dict(amount=10**7, limit=54115018304), None,
     ("error", "6040", "BuySlippageBelowMinBaseAmountOut")),
    ("tf100-floor-exact", dict(amount=10**7, limit=53573907921), "tf100",
     ("ok", (53573907921, -9998786, -53573907921, 9779732, 45012, 29040, 45012))),
    ("tf100-floor-plus1", dict(amount=10**7, limit=53573907922), "tf100",
     ("error", "6040", "BuySlippageBelowMinBaseAmountOut")),
    ("whitelist", dict(amount=10**7, limit=1), "whitelist",
     ("error", "6053", "BuybackFeeRecipientNotAuthorized")),
    ("whitelist-trimmed", dict(amount=10**7, limit=1), "whitelist_trim",
     ("ok", (54791407798, -10000000, -54791407798, 10000000, 0, 0, 0))),
    ("whitelist-tf100-trimmed", dict(amount=10**7, limit=1), "whitelist_tf100_trim",
     ("ok", (54243537781, -10000000, -54243537781, 9900000, 0, 0, 0))),
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
    if tag in ("whitelist_tf100_trim",):
        is_tf = True
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
report = {"schema": 1, "packet": "amm-legacy-buy-exact-transfer-fee-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("Legacy buy_exact_quote_in on the shared v1/v2 fixture, "
                    "fresh VM per case per image (original / #424 control / "
                    "#427 candidate). Receipts are stored as parts to stay "
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

README = """# Legacy buy_exact_quote_in under quote transfer-fee

## Problem

Run 1 #25 pinned only the nofee baseline of legacy `buy_exact_quote_in`
(base 54,115,018,303 for 10^7 quote, identical to v2), #12 pinned v2
buy_exact quote transfer-fee, #46 pinned v2 buy_exact base transfer-fee,
and #31 pinned v2 buy_exact zeros. None of them pinned the legacy exact
path's quote-fee math, its fee split, or the whitelist zero-fee path --
and the legacy path computes fees differently from v2: legacy
`buy.rs` estimates `available*10000/(total_bps+10000)`, takes
`curve = min(available - lp - protocol - creator, estimate)`, and
grosses up only the pool leg via `amount_before_fee(curve + lp_fee)`,
while v2 `trade_v2.rs` runs `estimate_buy_quote` plus
`preview_total_quote`. This packet pins the legacy exact numbers on
the shared fixture and records where they agree with v2 and where
they do not.

## Cases

All cases use amount 10^7 quote unless noted, limit 1 unless noted,
on the shared v1/v2 fixture, 3 images each (original / #424 control /
#427 candidate). The quote mint carries a Token-2022 transfer-fee
extension in tf cases, so the protocol/creator/buyback legs land in
Token-2022 ATAs; the base mint has no fee, so base deltas are exact.

- nofee: baseline.
- tf100 / tf5000 / tf10000 / tf10001 / tf65535: quote fee at 1%,
  50%, 100%, 100.01%, 655.35% (maxfee u64max).
- tf100-max100: 1% fee with maxfee cap 100 (cap binding).
- amount0 / limit0 / amount1: zero and unit-amount edges.
- nofee-floor-exact / nofee-floor-plus1, tf100-floor-exact /
  tf100-floor-plus1: slippage floor at the exact base_out and +1.
- whitelist: user == global_config.whitelist_pda (353..385 set to
  the payer) with the standard 3-account remaining layout.
- whitelist-trimmed / whitelist-tf100-trimmed: same whitelist with
  the poolv2 remaining account dropped (2-account layout).

## Result

Base delivery agrees with v2 everywhere, but the quote split does
not -- legacy exact takes more total quote fees than v2 exact on the
same fixture:

- nofee: base +54,115,018,303 (== v2), spent 10,000,000, vault quote
  +9,878,518 (v2: +9,954,074, delta 75,556), fee legs protocol
  +45,926, creator +29,630, buyback +45,926 (total 121,482 vs v2's
  implied 45,926). Same base delivery, different quote split.
- tf100: base +53,573,907,921 (== v2 #12), spent 9,998,786 (v2:
  9,999,541, delta 755), vault +9,779,732, legs 45,012 / 29,040 /
  45,012.
- tf5000: base +27,058,593,160 (== v2 #12), spent 9,939,259 (v2:
  9,977,037, delta 37,778), vault +4,939,259, legs 11,481 / 7,407 /
  11,481.
- tf10000: 6039 BuyNotEnoughQuoteTokensToCoverFees (== v2 #12).
  tf10001 and tf65535: 6023 Overflow in utils/transfer_fee.rs
  (== v2 #12's overflow site).
- tf100-max100 (cap binding): base +54,114,475,911 (== v2 #12 cap),
  spent 10,000,000, vault +9,878,419, legs 45,826 / 29,530 / 45,825.
- amount0: 6002 ZeroQuoteAmount; limit0: 6001 ZeroBaseAmount
  (== v2 #31). amount1: 6039 -- the unit is eaten by fee estimation.
- floors are on the net base_out: the exact base_out limit succeeds
  and +1 fails 6040 BuySlippageBelowMinBaseAmountOut, both nofee and
  tf100.
- whitelist with the standard 3-account remaining layout: 6053
  BuybackFeeRecipientNotAuthorized. Cause: zeroed fees make
  creator_fee == 0, so the remaining-account index stays at 0 and
  get_buyback_accounts reads poolv2+owner instead of owner+buyback.
  Dropping poolv2 succeeds with zero fees: nofee base
  +54,791,407,798, vault +10,000,000, all legs 0; tf100 base
  +54,243,537,781, vault +9,900,000, all legs 0. v2 trade has no
  whitelist path at all (no whitelist reference in trade_v2.rs).

All 3 images agree on every case. Error cases roll back everything
except the payer's 5,000 fee. Success cases charge the payer
1,849,400 lamports (1,844,400 volume-accumulator rent + 5,000 fee).

Error sites (original : control/candidate line in the AnchorError
log line): 6039 at buy.rs:646/:156 for tf10000 (available == 0) but
buy.rs:700/:197 for amount1 (curve eaten by fee estimation) -- two
distinct 6039 sites; 6023 at transfer_fee.rs:57/:28 (control) with
candidate also :57; 6002 at buy.rs:638/:148; 6001 at buy.rs:636/:147;
6040 at buy.rs:776/:270; 6053 at global_config.rs:326/:43.

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The v2 comparison numbers are cited from the
prior packets #12 (quote tf) and #46 (nofee vault quote) on the same
fixture and images, not re-measured here. The whitelist finding is
about the legacy handler's remaining-account indexing, not about a
deployed whitelist configuration.
"""
(OUT / "README.md").write_text(README)
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
