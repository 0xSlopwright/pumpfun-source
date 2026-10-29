#!/usr/bin/env python3
"""Build research/amm-legacy-buy-reserve-wall-20261029 receipts.

2nd run packet #31: legacy `buy` (non-exact, amount = base out,
limit = max quote in) against the pool's base reserve wall. 2nd #30
pinned the same wall for trade_v2 `execute_buy`; the legacy handler
shares `quote_for_base` but runs a different fee path (Fees-program
CPI `get_fees_with_quote_mint`, lp 2 / protocol 93 / creator 30 bps,
buyback split of the protocol fee) and different total accounting,
so its ladder -- last success, overflow window width, truncation
onset, and the transfer-fee shift of the wall -- is measured here,
not assumed from #30. All cases on the shared v1/v2 fixture
(b = 673,696,395,912,745 vault base, raw vault quote
122,946,690,720, effective q = 122,946,438,956 after accrued fees
125,882 and virtual -125,882), 3 images (original / #424 control /
#427 candidate). Limit is u64::MAX unless stated, so slippage never
masks the wall; the user quote account is funded to u64::MAX so
balance never masks it either.

- Wall ladder (nofee): last success amount b-4,546,278
  (673,696,391,366,467); first Overflow b-4,546,277; Overflow window
  exactly 56,127 amounts (b-4,546,277 .. b-4,490,151); first
  Truncation b-4,490,150; b-1 Truncation; b DivisionByZero; b+1 and
  u64::MAX BuyMoreBaseAmountThanPoolReserves. The window is far
  wider than v2's 6 amounts (#30) because the legacy fee total is
  only 125 bps on a much larger curve.
- Last-success math (nofee): curve 18,219,003,998,933,624,041, lp
  fee 3,643,800,799,786,725 (2 bps), protocol fee
  169,436,737,190,082,704 (93 bps, split net 84,718,368,595,041,352
  + buyback 84,718,368,595,041,352 at buyback_bps 5000), creator fee
  54,657,011,996,800,873 (30 bps); pool_quote (curve + lp)
  18,222,647,799,733,410,766; total user spend
  18,446,741,548,920,294,343.
- The wall is limit-masked: the last-success amount with limit
  spend-1 gives 6004 ExceededSlippage, with limit exactly spend it
  succeeds with identical deltas.
- Transfer fee shifts the wall: tf100 last success is b-4,591,642
  (673,696,391,321,103), i.e. 45,364 amounts earlier than nofee,
  because the pool leg is grossed up (gross pool
  18,224,862,308,581,757,326 vs net pool_quote
  18,042,613,685,495,939,752; transfer fee
  182,248,623,085,817,574). The event's user_quote_in field is the
  pre-gross-up total (18,264,493,457,873,064,387); actual user spend
  is that plus the transfer fee (18,446,742,080,958,881,961).
  tf100 first Overflow is the very next amount.

NOTE: the tf override must go through adapt_sell_helper (as in
#12/#16/#17). The tf override rekeys userquote to a TOKEN22-owned
account; a big-balance override must therefore preserve the
TOKEN22 owner and extension bytes and only rewrite lamports and
the amount field -- overwriting the account with a TOKEN-owned one
gives IncorrectProgramId (a harness artifact, not handler
behavior).
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
    CREATOR_VAULT, ATA, TOKEN, token, Account,
)
import pump_amm_legacy_sell_differential as S

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-legacy-buy-reserve-wall-20261029"
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


def biguser(h, m):
    h.vm.set_account(userquote, Account(
        2**64 - 1, token(quote, PAYER.pubkey(), 2**64 - 1 - 2039280, True), TOKEN))


def tf100(h, m):
    adapt_sell_helper(legacy_transferfee(quote, 100))(h, m)
    a = h.vm.get_account(userquote)
    d = bytearray(a.data)
    d[64:72] = struct.pack("<Q", 2**64 - 1 - 2039280)
    h.vm.set_account(userquote, Account(2**64 - 1, bytes(d), a.owner))


OVERRIDES = {
    "biguser": biguser,
    "tf100": tf100,
}
# override tags whose quote mint carries the transfer-fee extension
TF_TAGS = {"tf100"}

B = 673696395912745
LS = 673696391366467
SPEND = 18446741548920294343
TF_LS = 673696391321103
MAX = 2**64 - 1

# event-field expectations: offsets into the BuyEvent payload
# (discriminator 8 + fields): curve @64, lp_bps @72, lp_fee @80,
# protocol_bps @88, protocol_fee @96, quote_with_lp @104,
# user_quote_in @112, creator_bps @344, creator_fee @352,
# buyback_bps @424.
EV_NOFEE_LS = {
    64: 18219003998933624041, 72: 2, 80: 3643800799786725,
    88: 93, 96: 169436737190082704, 104: 18222647799733410766,
    112: 18446741548920294343, 344: 30, 352: 54657011996800873,
    424: 5000,
}
EV_TF_LS = {
    64: 18039005884319075936, 72: 2, 80: 3607801176863816,
    88: 93, 96: 167762754724167407, 104: 18042613685495939752,
    112: 18264493457873064387, 344: 30, 352: 54117017652957228,
    424: 5000,
}

# (label, kwargs, override-tag-or-None, expected)
# ok expected: ("ok", (userbase, userquote, vaultbase, vaultquote, protocol, creator, buyback), event_fields-or-None)
# error expected: ("error", code, fragment)
CASES = [
    ("anchor-amount1", dict(amount=1, limit=MAX), "biguser",
     ("ok", (1, -4, -1, 2, 1, 1, 0), None)),
    ("anchor-amount1e10", dict(amount=10**10, limit=MAX), "biguser",
     ("ok", (10**10, -1847796, -10**10, 1825348, 8487, 5475, 8486), None)),
    ("wall-last-success", dict(amount=LS, limit=MAX), "biguser",
     ("ok", (LS, -SPEND, -LS, 18222647799733410766,
             84718368595041352, 54657011996800873, 84718368595041352),
      EV_NOFEE_LS)),
    ("wall-first-overflow", dict(amount=LS + 1, limit=MAX), "biguser",
     ("error", "6023", "Overflow")),
    ("wall-mid-overflow", dict(amount=673696391394531, limit=MAX), "biguser",
     ("error", "6023", "Overflow")),
    ("wall-last-overflow", dict(amount=673696391422594, limit=MAX), "biguser",
     ("error", "6023", "Overflow")),
    ("wall-first-truncation", dict(amount=673696391422595, limit=MAX), "biguser",
     ("error", "6024", "Truncation")),
    ("wall-trunc-b-minus1", dict(amount=B - 1, limit=MAX), "biguser",
     ("error", "6024", "Truncation")),
    ("wall-div0-b", dict(amount=B, limit=MAX), "biguser",
     ("error", "6025", "DivisionByZero")),
    ("wall-reserves-b-plus1", dict(amount=B + 1, limit=MAX), "biguser",
     ("error", "6016", "BuyMoreBaseAmountThanPoolReserves")),
    ("wall-reserves-max", dict(amount=MAX, limit=MAX), "biguser",
     ("error", "6016", "BuyMoreBaseAmountThanPoolReserves")),
    ("wall-limit-minus1", dict(amount=LS, limit=SPEND - 1), "biguser",
     ("error", "6004", "ExceededSlippage")),
    ("wall-limit-exact", dict(amount=LS, limit=SPEND), "biguser",
     ("ok", (LS, -SPEND, -LS, 18222647799733410766,
             84718368595041352, 54657011996800873, 84718368595041352),
      EV_NOFEE_LS)),
    ("tf100-wall-last-success", dict(amount=TF_LS, limit=MAX), "tf100",
     ("ok", (TF_LS, -18446742080958881961, -TF_LS, 18042613685495939752,
             83042563588462866, 53575847476427655, 83042563588462865),
      EV_TF_LS)),
    ("tf100-wall-first-overflow", dict(amount=TF_LS + 1, limit=MAX), "tf100",
     ("error", "6023", "Overflow")),
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
                    "expected": [expected[0]] + ([list(expected[1])] if expected[0] == "ok" else list(expected[1:]))}}
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
            _, deltas_expected, ev_fields = expected
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
            assert deltas == deltas_expected, (label, image, deltas, deltas_expected)
            assert payer_delta == -1849400, (label, image, payer_delta)
            assert len(r["events"]) >= 1, (label, image, "no BuyEvent")
            ev_observed = None
            if ev_fields is not None:
                assert len(r["events"]) == 1, (label, image, len(r["events"]))
                ev = base64.b64decode(r["events"][0].split("Program data: ", 1)[1])
                assert len(ev) == 497, (label, image, len(ev))
                ev_observed = {}
                for off, val in ev_fields.items():
                    got = struct.unpack_from("<Q", ev, off)[0]
                    assert got == val, (label, image, off, got, val)
                    ev_observed[off] = got
            observed = {"userbase": deltas[0], "userquote": deltas[1],
                        "vaultbase": deltas[2], "vaultquote": deltas[3],
                        "protocol_ata": deltas[4], "creator_ata": deltas[5],
                        "buyback": deltas[6], "payer_delta": payer_delta,
                        "event_count": len(r["events"]), "sig_fields": 1}
            if ev_observed is not None:
                observed["event_fields"] = {str(k): v for k, v in ev_observed.items()}
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
report = {"schema": 1, "packet": "amm-legacy-buy-reserve-wall-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("Legacy buy (non-exact) against the pool base reserve "
                    "wall, pinned on all 3 images (original / #424 control / "
                    "#427 candidate). Fresh VM per case per image. Receipts "
                    "are stored as parts to stay under GitHub's 25MB "
                    "web-upload limit; verify.py reads them in order. "
                    "Snapshots cover non-executable accounts only. Limit is "
                    "u64::MAX unless stated so slippage never masks the "
                    "wall; the user quote account is funded to u64::MAX so "
                    "balance never masks it. No source change, build, or "
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

README = f"""# Legacy buy (non-exact) reserve wall

## Problem

Packet #30 pinned the base-reserve wall for trade_v2
`execute_buy`: a 4-step failure ladder as exact base-out
approaches the pool's base reserves. The legacy `buy` handler
shares the same `quote_for_base` curve function but runs a
different fee path (Fees-program CPI `get_fees_with_quote_mint`,
lp 2 / protocol 93 / creator 30 bps, buyback split of the protocol
fee) and different total accounting, so whether its ladder has
the same shape, the same width, and the same transfer-fee shift
was unmeasured. This packet measures the legacy wall directly.

## Cases

All cases legacy `buy` on the shared v1/v2 fixture, 3 images each.
Pool base reserves b = 673,696,395,912,745 (vault base), raw vault
quote 122,946,690,720, effective q = 122,946,438,956 (raw minus
accrued fees 125,882 plus virtual -125,882). Limit is u64::MAX
unless stated, so slippage never masks the wall; the user quote
account is funded to u64::MAX (lamports u64::MAX, token amount
u64::MAX - 2,039,280 rent), so balance never masks it either.
Success cases charge the payer 1,849,400 (1,844,400
volume-accumulator rent + 5,000 fee) and emit 1 BuyEvent;
error cases roll back everything except the payer's 5,000 fee
and emit 0 events.

- anchor-amount1 / anchor-amount1e10: the low anchors (spend 4 /
  1,847,796, matching #17).
- wall-last-success: amount b-4,546,278 = 673,696,391,366,467,
  the largest amount that succeeds.
- wall-first-overflow / wall-mid-overflow / wall-last-overflow:
  the Overflow window's first, middle, and last amounts
  (b-4,546,277, b-4,518,214, b-4,490,151).
- wall-first-truncation / wall-trunc-b-minus1: the first amount
  whose curve itself exceeds u64 (b-4,490,150) and b-1.
- wall-div0-b: amount exactly b.
- wall-reserves-b-plus1 / wall-reserves-max: amounts above b.
- wall-limit-minus1 / wall-limit-exact: the last-success amount
  with limit spend-1 (fails) and limit exactly spend (succeeds).
- tf100-wall-last-success / tf100-wall-first-overflow: the wall
  under a 100bps quote transfer fee (legs in Token-2022 ATAs).

## Result

- Wall ladder (nofee), all 3 images identical: last success
  b-4,546,278; then an Overflow window exactly 56,127 amounts
  wide (b-4,546,277 .. b-4,490,151, first/middle/last all 6023);
  then Truncation from b-4,490,150 through b-1; then amount == b
  gives 6025 DivisionByZero; then amount > b gives 6016
  BuyMoreBaseAmountThanPoolReserves (b+1 and u64::MAX alike).
  The window is far wider than v2's 6 amounts (#30): the legacy
  fee total is only 125 bps, so total = curve + fees crosses
  u64::MAX long before the curve itself does.
- Why each step fails: below the window, curve + lp + protocol +
  creator still fits u64. Inside the window the curve fits but
  the fee-inclusive total does not (6023). Past the window the
  curve itself exceeds u64 (6024 Truncation). At amount == b the
  `checked_sub(b, b)` yields 0 without failing and the following
  `ceil_div` divides by zero (6025) -- a division error, not a
  reserve check. Only above b does the subtraction itself
  underflow (6016).
- The 6023 site migrates earlier as amount grows: at window start
  the final add overflows (original buy.rs:395, rebuild :255),
  mid-window an earlier add (rebuild :252), at window end the
  earliest add (original :387, rebuild :249) -- as the curve
  grows, earlier partial sums cross u64::MAX first. Under tf100
  the 6023 lands on the limit check instead (original :409,
  rebuild :274), where total + transfer_fee is summed.
- Last-success math (nofee), event-decoded and delta-checked:
  curve 18,219,003,998,933,624,041, lp fee 3,643,800,799,786,725
  (2 bps), protocol fee 169,436,737,190,082,704 (93 bps, split
  net 84,718,368,595,041,352 + buyback 84,718,368,595,041,352 at
  buyback_bps 5000), creator fee 54,657,011,996,800,873
  (30 bps); pool_quote (curve + lp) 18,222,647,799,733,410,766;
  total user spend 18,446,741,548,920,294,343. The event's
  user_quote_in field equals the total exactly.
- The wall is limit-masked: the last-success amount with limit
  spend-1 (18,446,741,548,920,294,342) fails 6004
  ExceededSlippage; with limit exactly spend it succeeds with
  deltas identical to wall-last-success.
- Transfer fee shifts the wall earlier: tf100 last success is
  b-4,591,642 = 673,696,391,321,103, i.e. 45,364 amounts earlier
  than nofee, and the very next amount already gives 6023. The
  gross-up is the cause: net pool_quote 18,042,613,685,495,939,752
  is grossed to 18,224,862,308,581,757,326 (transfer fee
  182,248,623,085,817,574), so the fee-inclusive gross total
  crosses u64::MAX sooner. tf100 last-success math: curve
  18,039,005,884,319,075,936, lp fee 3,607,801,176,863,816,
  nominal protocol fee 167,762,754,724,167,407 (net protocol
  83,042,563,588,462,866 + buyback 83,042,563,588,462,865 after
  per-leg 1% withholding), nominal creator fee
  54,117,017,652,957,228 (net 53,575,847,476,427,655). The event's
  user_quote_in field (18,264,493,457,873,064,387) is the
  pre-gross-up total; actual user spend is that plus the
  transfer fee (18,446,742,080,958,881,961).
- All 3 images agree on every case.

Error sites (log paths as emitted by each image):

{SITES}

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The wall amounts (b-4,546,278, the 56,127-wide
Overflow window, b-4,490,150) are exact for this fixture's curve
state and fee configuration; they are not claimed for other pool
states. The tf override must go through adapt_sell_helper (as in
#12/#16/#17): the tf override rekeys userquote to a TOKEN22-owned
account, so a big-balance override must preserve the TOKEN22
owner and extension bytes and only rewrite lamports and the
amount field -- overwriting the account with a TOKEN-owned one
gives IncorrectProgramId, a harness artifact, not handler
behavior.
"""
(OUT / "README.md").write_text(README)
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
