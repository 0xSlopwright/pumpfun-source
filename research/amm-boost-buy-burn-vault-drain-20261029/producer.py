#!/usr/bin/env python3
"""Build research/amm-boost-buy-burn-vault-drain-20261029 receipts.

boost_buy_and_burn draining the boost vault in full (2nd run packet
#26; 1st run #50 covered only a partial spend of 10^9 out of 10^12,
the quote/base fee split, the net-based floor, and tf10000 -> 6002):

- a full drain closes the boost vault ATA and returns its rent:
  no-fee drain gains the payer 2,034,280 (rent 2,039,280 - 5,000
  fee); a Token-2022 drain gains 999,995,000 (the vault's
  10^12 lamports move to the pool quote ATA as the native token
  moves, leaving 10^9 rent lamports to the authority, minus 5,000);
- requesting more than the vault holds spends exactly the vault
  balance (used = min(requested, balance)): 10^12+1 drains
  identically to 10^12;
- the Token-2022 writable-mint gate fires ONLY on a full drain:
  a drain with a non-writable quote mint fails 6088
  QuoteMintNotWritable (boost.rs:403), while a partial spend of
  10^12-1 with the same non-writable mint succeeds and leaves
  exactly 1 token in the vault;
- the 6088 failure is the one error case whose logs still carry
  both events (BuyEvent + BoostBuyAndBurnEvent), because the
  events are emitted before the writable gate runs; state still
  rolls back fully, and the logged burn (used 10^12, burned
  598,735,502,793,632) never happened;
- under a fee the pool quote ATA's withheld tail (offset 170 u64)
  records exactly the fee of this transfer: tf100 -> 10^10,
  tf5000 -> 500,000,000,000, tf100 with maxfee 123 -> 123 (the
  cap binds, so the vault gains 999,999,999,877 net instead of
  990,000,000,000);
- the drain slippage floor is net-based: limit equal to the
  drained burn (598,735,502,793,632) succeeds, limit +1 fails
  6004 ExceededSlippage (boost.rs:274);
- gate map: wrong boost authority -> 6005 InvalidAdmin
  (global_config.rs:297); boost disabled -> 6066 BoostDisabled
  (boost.rs:238); buy disabled -> 6020 DisabledBuy
  (boost.rs:240); total virtual reserves zero -> 6065
  PoolCannotBoost (boost.rs:245); curve quote zero -> 6003
  TooLittlePoolTokenLiquidity (boost.rs:280, burned would equal
  the whole base supply); accrued fees overflowing the quote
  balance -> 6023 Overflow (pool.rs:417);
- tiny-amount edges: amount 0 -> 6002 ZeroQuoteAmount
  (boost.rs:250); amount 1 no-fee -> 6001 ZeroBaseAmount
  (boost.rs:273, net-1 adjustment makes the burn zero); amount 2
  no-fee succeeds with burn 5,435; amount 2 under tf100 -> 6001
  (net 1 after the 1% fee, same adjustment);
- all three images (original / #424 control / #427 candidate)
  agree on every case: this packet pins behavior, it does not
  claim a divergence.
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
from solders.clock import Clock
from solders.instruction import AccountMeta, Instruction
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

from pump_amm_admin_differential import Harness, OUTSIDER
from pump_amm_liquidity_differential import (
    EVENT, IDL, PAYER, PROGRAM, TOKEN, TOKEN22,
    f, mutate, pool, quote, token,
)
from pump_amm_boost_burn_differential import BOOST, BOOST_ATA, boost_transferfee
from pump_amm_liquidity_differential import (
    CONFIG, CONFIG_KEY, RAW, base, vaultbase, vaultquote,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-boost-buy-burn-vault-drain-20261029"
WS = Path.home() / "workspace/slop-verify"
ATA = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
M = 2 ** 64 - 1

IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
TOKEN_SHA = {
    "spl_token": hashlib.sha256(
        (ROOT / "evidence/dependencies/spl_token/deployed.so").read_bytes()).hexdigest(),
    "spl_token_2022": hashlib.sha256(
        (ROOT / "evidence/dependencies/spl_token_2022/deployed.so").read_bytes()).hexdigest(),
    "associated_token": hashlib.sha256(
        (ROOT / "evidence/dependencies/associated_token/deployed.so").read_bytes()).hexdigest(),
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def tok_amount(entry):
    if entry is None:
        return None
    data = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", data, 64)[0] if len(data) >= 72 else None


def withheld_at(entry):
    if entry is None:
        return None
    data = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", data, 170)[0] if len(data) >= 178 else None


def decode_boost_event(events):
    """Return the decoded 208-byte BoostBuyAndBurnEvent, or None."""
    raws = [base64.b64decode(e[len('Program data: '):])
            for e in events if e.startswith('Program data: ')]
    boosts = [r for r in raws if len(r) == 208]
    if not boosts:
        return None
    assert len(boosts) == 1, f"expected one 208-byte event, got {len(boosts)}"
    r = boosts[0]
    return {"requested": struct.unpack_from("<Q", r, 144)[0],
            "used": struct.unpack_from("<Q", r, 152)[0],
            "burned": struct.unpack_from("<Q", r, 160)[0],
            "vq": int.from_bytes(r[168:184], 'little', signed=True),
            "quote_after": struct.unpack_from("<Q", r, 184)[0],
            "base_after": struct.unpack_from("<Q", r, 192)[0],
            "remaining": struct.unpack_from("<Q", r, 200)[0]}


# ok expected: ("ok", vq_gained, vb_spent, boost_spent, closed,
#   payer_delta, pool_withheld_after, ev_used, ev_burned, ev_remaining)
# error expected: ("error", code, fragment, event_count,
#   ev_used_or_None, ev_burned_or_None, ev_remaining_or_None)
CASES = [
    ("drain-nofee", {"amount": 10 ** 12},
     ("ok", 10 ** 12, 599402446286043, 10 ** 12, True, -2034280, None,
      10 ** 12, 599402446286043, 0)),
    ("drain-nofee-over", {"amount": 10 ** 12 + 1},
     ("ok", 10 ** 12, 599402446286043, 10 ** 12, True, -2034280, None,
      10 ** 12, 599402446286043, 0)),
    ("drain-tf100-write", {"amount": 10 ** 12, "tf": (100, M, 0, True)},
     ("ok", 990000000000, 598735502793632, 10 ** 12, True, -999995000,
      10000000000, 10 ** 12, 598735502793632, 0)),
    ("drain-tf100-cap123", {"amount": 10 ** 12, "tf": (100, 123, 123, True)},
     ("ok", 999999999877, 599402446277912, 10 ** 12, True, -999995000,
      123, 10 ** 12, 599402446277912, 0)),
    ("drain-tf5000-write", {"amount": 10 ** 12, "tf": (5000, M, 0, True)},
     ("ok", 500000000000, 539866951722324, 10 ** 12, True, -999995000,
      500000000000, 10 ** 12, 539866951722324, 0)),
    ("partial-tf100-nowrite", {"amount": 10 ** 12 - 1, "tf": (100, M, 0, False)},
     ("ok", 989999999999, 598735502793565, 999999999999, False, 5000,
      10000000000, 999999999999, 598735502793565, 1)),
    ("amount2-nofee", {"amount": 2},
     ("ok", 2, 5435, 2, False, 5000, None, 2, 5435, 999999999998)),
    ("drain-tf100-write-min-exact",
     {"amount": 10 ** 12, "limit": 598735502793632, "tf": (100, M, 0, True)},
     ("ok", 990000000000, 598735502793632, 10 ** 12, True, -999995000,
      10000000000, 10 ** 12, 598735502793632, 0)),
    ("drain-tf100-nowrite", {"amount": 10 ** 12, "tf": (100, M, 0, False)},
     ("error", "6088", "QuoteMintNotWritable", 2,
      10 ** 12, 598735502793632, 0)),
    ("drain-tf10000", {"amount": 10 ** 12, "tf": (10000, M, 0, True)},
     ("error", "6002", "ZeroQuoteAmount", 0, None, None, None)),
    ("drain-tf100-write-min-plus1",
     {"amount": 10 ** 12, "limit": 598735502793633, "tf": (100, M, 0, True)},
     ("error", "6004", "ExceededSlippage", 0, None, None, None)),
    ("auth-mismatch", {"amount": 10 ** 9, "ov": "auth"},
     ("error", "6005", "InvalidAdmin", 0, None, None, None)),
    ("boost-disabled", {"amount": 10 ** 9, "ov": "disabled"},
     ("error", "6066", "BoostDisabled", 0, None, None, None)),
    ("disable-buy", {"amount": 10 ** 9, "ov": "disablebuy"},
     ("error", "6020", "DisabledBuy", 0, None, None, None)),
    ("cannot-boost", {"amount": 10 ** 9, "ov": "cannot"},
     ("error", "6065", "PoolCannotBoost", 0, None, None, None)),
    ("q-zero", {"amount": 10 ** 9, "ov": "qzero"},
     ("error", "6003", "TooLittlePoolTokenLiquidity", 0, None, None, None)),
    ("fees-overflow", {"amount": 10 ** 9, "ov": "fees"},
     ("error", "6023", "Overflow", 0, None, None, None)),
    ("amount0", {"amount": 0},
     ("error", "6002", "ZeroQuoteAmount", 0, None, None, None)),
    ("amount1-nofee", {"amount": 1},
     ("error", "6001", "ZeroBaseAmount", 0, None, None, None)),
    ("amount2-tf100", {"amount": 2, "tf": (100, M, 0, True)},
     ("error", "6001", "ZeroBaseAmount", 0, None, None, None)),
]


def run_case(params, binary):
    h = Harness(binary)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, n in ((TOKEN, 'spl_token'), (TOKEN22, 'spl_token_2022'),
                   (ATA, 'associated_token')):
        vm.add_program_from_file(pid, str(ROOT / 'evidence/dependencies' / n / 'deployed.so'))
    for rrow in f["accounts"].values():
        vm.set_account(Pubkey.from_string(rrow["address"]),
                       Account(rrow["lamports"], base64.b64decode(rrow["data_base64"]),
                               Pubkey.from_string(rrow["owner"])))
    raw = bytearray(RAW)
    raw[907:939] = bytes(PAYER.pubkey())
    raw[939] = 1
    vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(raw), PROGRAM))
    mutate(pool, 245, (10 ** 9).to_bytes(16, 'little', signed=True))(h, [])
    vm.set_account(BOOST, Account(10 ** 9, b"", Pubkey.default()))
    vm.set_account(BOOST_ATA, Account(10 ** 12 + 2039280,
                                      token(quote, BOOST, 10 ** 12, True), TOKEN))
    ix = next(x for x in IDL["instructions"] if x["name"] == "boost_buy_and_burn")
    keys = [pool, PAYER.pubkey(), CONFIG_KEY, base, quote, vaultbase, vaultquote,
            BOOST, BOOST_ATA, TOKEN, TOKEN, EVENT, PROGRAM]
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    if params.get("tf") is not None:
        bps, maximum, withheld, writable = params["tf"]
        boost_transferfee(quote, bps, maximum, withheld, writable)(h, metas)
    ov = params.get("ov")
    if ov == "auth":
        mutate(CONFIG_KEY, 907, bytes(OUTSIDER.pubkey()))(h, metas)
    elif ov == "disabled":
        mutate(CONFIG_KEY, 939, b'\x00')(h, metas)
    elif ov == "disablebuy":
        mutate(CONFIG_KEY, 56, b'\x08')(h, metas)
    elif ov == "cannot":
        mutate(pool, 245, (-125882).to_bytes(16, 'little', signed=True))(h, metas)
    elif ov == "qzero":
        mutate(pool, 245, (-122946690720).to_bytes(16, 'little', signed=True))(h, metas)
    elif ov == "fees":
        mutate(pool, 271, struct.pack('<Q', 200_000_000_000))(h, metas)

    def snap():
        out = {}
        for k in [pool, PAYER.pubkey(), CONFIG_KEY, base, quote, vaultbase,
                  vaultquote, BOOST, BOOST_ATA, metas[8].pubkey, EVENT]:
            a = vm.get_account(k)
            if a is None or not a.executable:
                out[str(k)] = None if a is None else {
                    "owner": str(a.owner), "lamports": a.lamports,
                    "data_hex": bytes(a.data).hex()}
        return out

    before = snap()
    data = bytes(ix["discriminator"]) + struct.pack(
        "<QQ", params["amount"], params.get("limit", 0))
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, data, metas)], PAYER.pubkey(), [PAYER],
        vm.latest_blockhash())
    assert all(tx.verify_with_results())
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    after = snap()
    logs = meta.logs()
    events = [l for l in logs if l.startswith('Program data: ')]
    boost_ev = decode_boost_event(events)
    boost_key = str(metas[8].pubkey)
    vq_key, vb_key, payer_key = str(vaultquote), str(vaultbase), str(PAYER.pubkey())
    boost_before = tok_amount(before[boost_key])
    boost_after = tok_amount(after[boost_key])
    observed = {
        "vq_before": tok_amount(before[vq_key]),
        "vq_after": tok_amount(after[vq_key]),
        "vb_before": tok_amount(before[vb_key]),
        "vb_after": tok_amount(after[vb_key]),
        "boost_before": boost_before,
        "boost_after": boost_after,
        "closed": after[boost_key] is None,
        "pool_withheld_after": withheld_at(after[vq_key]),
        "payer_delta": before[payer_key]["lamports"] - after[payer_key]["lamports"],
        "event_count": len(events),
        "boost_event": boost_ev,
    }
    return {"tx": base64.b64encode(bytes(tx)).decode(),
            "error": str(r.err()) if failed else None, "logs": logs,
            "events": events, "before": before, "after": after,
            "observed": observed, "payer_key": payer_key}


receipts_global = []
report_cases = []
for index, (label, params, expected) in enumerate(CASES):
    row = {"case": {"instruction": "boost_buy_and_burn", "label": label,
                    "params": {k: (list(v) if isinstance(v, tuple) else v)
                               for k, v in params.items()},
                    "expected": list(expected)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        r = run_case(params, IMAGES[image])
        raw = base64.b64decode(r["tx"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == 1, (label, image, checks)
        before, after, obs = r["before"], r["after"], r["observed"]
        payer_key = r["payer_key"]
        err, logs = r["error"], r["logs"]
        if expected[0] == "ok":
            (_, vq_gained, vb_spent, boost_spent, closed, payer_delta,
             withheld, ev_used, ev_burned, ev_remaining) = expected
            assert err is None, (label, image, err)
            assert obs["vq_after"] - obs["vq_before"] == vq_gained, (label, image, obs)
            assert obs["vb_before"] - obs["vb_after"] == vb_spent, (label, image, obs)
            assert obs["boost_before"] - (obs["boost_after"] or 0) == boost_spent, \
                (label, image, obs)
            assert obs["closed"] == closed, (label, image, obs)
            assert obs["payer_delta"] == payer_delta, (label, image, obs)
            assert obs["pool_withheld_after"] == withheld, (label, image, obs)
            assert obs["event_count"] == 2, (label, image, obs)
            ev = obs["boost_event"]
            assert ev is not None, (label, image, "no boost event")
            assert (ev["used"], ev["burned"], ev["remaining"]) == \
                (ev_used, ev_burned, ev_remaining), (label, image, ev)
        else:
            (_, code, fragment, event_count, ev_used, ev_burned, ev_remaining) = expected
            assert err is not None and code in err, (label, image, err)
            assert fragment in "\n".join(logs), (label, image, logs[-3:])
            assert obs["payer_delta"] == 5000, (label, image, obs)
            assert obs["event_count"] == event_count, (label, image, obs)
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback")
            ev = obs["boost_event"]
            if ev_used is None:
                assert ev is None, (label, image, ev)
            else:
                assert ev is not None and \
                    (ev["used"], ev["burned"], ev["remaining"]) == \
                    (ev_used, ev_burned, ev_remaining), (label, image, ev)
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l),
                        None)
            assert site is not None, (label, image, "no site line")
            row.setdefault("error_sites", {})[image] = site
        seen.add((err, tuple(sorted((k, str(v)) for k, v in obs.items()))))
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image,
                        "instruction": "boost_buy_and_burn", "label": label},
            "transaction_base64": r["tx"],
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
            "all_signatures_verified": True, "signature_fields": 1,
            "before": before, "after": after,
            "metadata": {"signature": str(tx.signatures[0]), "logs": logs,
                         "inner_instructions": [], "events": r["events"]},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890,
                      "epoch": 0, "leader_schedule_epoch": 0,
                      "unix_timestamp": 1234567890},
            "loaded_programs": {
                "pAMM": {"path": "evidence/original/pump_amm/deployed.so",
                         "sha256": IMAGE_SHA[image]},
                "spl_token": {"path": "evidence/dependencies/spl_token/deployed.so",
                              "sha256": TOKEN_SHA["spl_token"]},
                "spl_token_2022": {"path": "evidence/dependencies/spl_token_2022/deployed.so",
                                   "sha256": TOKEN_SHA["spl_token_2022"]},
                "associated_token": {"path": "evidence/dependencies/associated_token/deployed.so",
                                     "sha256": TOKEN_SHA["associated_token"]}},
            "error": err, "rollback_except_payer_fee": err is not None,
            "payer_fee_lamports": obs["payer_delta"],
            "observed": obs,
        })
        row[image] = {"error": err, "logs": logs, "observed": obs}
        print(f"  {label} [{image}] error={err} observed={obs}", flush=True)
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
    "evidence/dependencies/spl_token/deployed.so",
    "evidence/dependencies/spl_token_2022/deployed.so",
    "evidence/dependencies/associated_token/deployed.so",
    "scripts/pump_amm_admin_differential.py",
    "scripts/pump_amm_liquidity_differential.py",
    "scripts/pump_amm_boost_burn_differential.py",
    "scripts/pump_amm_reusable_harness.py",
]
report = {"schema": 1, "packet": "amm-boost-buy-burn-vault-drain-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("boost_buy_and_burn draining the boost vault in full, "
                    "on synthetic fixtures with the pool virtual quote "
                    "reserves set to 10^9 and the boost vault funded with "
                    "10^12 quote tokens, fresh VM per case per image "
                    "(original / #424 control / #427 candidate). "
                    "Receipts are stored as parts to stay under GitHub's "
                    "25MB web-upload limit; verify.py reads them in order. "
                    "Snapshots cover non-executable accounts only."),
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
