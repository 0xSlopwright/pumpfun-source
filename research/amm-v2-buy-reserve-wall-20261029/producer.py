#!/usr/bin/env python3
"""Build research/amm-v2-buy-reserve-wall-20261029 receipts.

v2 buy reserve wall: trade_v2 execute_buy prices an exact base-out
through curve/constant_product.rs quote_for_base(amount, b, q) =
ceil(q * amount / (b - amount)), so the wall at the base reserve is
not a single gate but a ladder of four distinct failures, while the
exact-in and sell paths have no wall at all (2nd run packet #30;
1st-run #31 covered trade 0/extremes and #29 covered fee-tier
boundaries, but neither walked the reserve wall itself):

- amount == b: checked_sub gives 0, then ceil_div by 0 ->
  6025 DivisionByZero (original fees.rs:21).
- amount > b: checked_sub underflows ->
  6016 BuyMoreBaseAmountThanPoolReserves (original
  constant_product.rs:21).
- amount just below b: the curve quote itself exceeds u64 ->
  6024 Truncation (original constant_product.rs:24). First
  Truncation at b - 542 (999,999,999,458) with fixture
  VB = 10^12, VQ = 10^10.
- between the last success and the first Truncation, the quote
  fits u64 but quote + fees overflows the u64 total ->
  6023 Overflow (original trade_v2.rs:241). Window is exactly
  6 amounts: 999,999,999,452 .. 999,999,999,457.
- last buy_v2 success is 999,999,999,451 = b - 549: spend
  18,435,336,966,199,582,879, vault +18,334,244,070,080,219,491,
  buyback +101,092,896,119,363,388.
- buy_exact_quote_in_v2 has no wall: amount up to the user's
  whole balance (MAX - 2,039,280) succeeds with out exactly
  b - 549 again -- the exact-in max spend and the exact-out max
  amount meet at the same base-out. One unit above the balance
  fails with Token custom error 0x1 (insufficient funds); only
  amount = u64::MAX itself reaches the AMM's own 6023 Overflow
  (trade_v2.rs:241) before any transfer.
- sell_v2 has no wall either: sell (MAX - VB) succeeds with the
  vault base landing exactly on u64::MAX, and even sell MAX
  succeeds in this fixture with the vault base wrapping to VB - 1
  (a direct SPL Token transfer of MAX into a 10^12 balance in the
  same fixture reproduces the wrap, so the wrap is attributed to
  the fixture token program, not to AMM curve math -- see README
  Limits). Both sell-max cases share curve quote 9,999,999,457
  (just under VQ = 10^10): the curve saturates, it never errors.
- Small-reserve ladder (VB = 3, VQ = 100) shows the same wall in
  miniature: amount 1 -> quote 50, fees (1, 1), total 52;
  amount 2 -> quote 200, fees (1, 3), vault +203, buyback 1;
  amount 3 == b -> 6025; amount 4 > b -> 6016.
- Fixture: single tier (0, A = (10, 111, 0)) so the fee bps are
  constant; pool accrued protocol/creator fees zeroed so
  available quote reserves equal raw vault quote; virtual quote
  reserves 0; supply 10^12.
- Every success funds the user volume accumulator with exactly
  1,844,400 lamports (137 bytes, payer key at [8:40]), so the
  payer delta is -1,849,400 (rent + 5,000 fee); every failure
  rolls back fully with payer -5,000 only.
- All three images (original / #424 control / #427 candidate)
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
from types import SimpleNamespace

import os
sys.path.insert(0, str(Path.home() / "workspace/pumpfun-sparse/scripts"))
os.chdir(Path.home() / "workspace/pumpfun-sparse")
from solders.account import Account
from solders.clock import Clock
from solders.instruction import AccountMeta, Instruction
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

from pump_amm_admin_differential import Harness
from pump_amm_liquidity_differential import (
    CONFIG, CONFIG_KEY, EVENT, IDL, PAYER, PROGRAM, RAW, TOKEN, TOKEN22,
    base, combine, f, pool, quote, token, userbase, userquote, vaultbase,
    vaultquote, mutate,
)
from pump_amm_trade_v2_differential import (
    FEES, buyback, feeconfig, volume,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-v2-buy-reserve-wall-20261029"
WS = Path.home() / "workspace/slop-verify"

IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
FEES_SHA = hashlib.sha256((ROOT / "evidence/original/pump_fees/deployed.so").read_bytes()).hexdigest()
PUMP_SHA = hashlib.sha256((ROOT / "evidence/original/pump/deployed.so").read_bytes()).hexdigest()

ATA = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
BB22 = Pubkey.find_program_address([bytes(BB_OWNER), bytes(TOKEN22), bytes(quote)], ATA)[0]

MAX = 2**64 - 1
TIERS = [(0, (10, 111, 0))]
SUPPLY = 10**12


def trade_deltas(ub, uq, vb, vq, bb):
    return {"userbase": ub, "userquote": uq, "vaultbase": vb,
            "vaultquote": vq, "buyback": bb, "buyback22": None}


def zero_deltas():
    return {"userbase": 0, "userquote": 0, "vaultbase": 0,
            "vaultquote": 0, "buyback": 0, "buyback22": None}


# (label, instruction, amount, limit, vb, vq, uq_amount, uq_lamports, ub_amount, expected)
# expected: ("ok", deltas, event) or ("err", code, "anchor"|"token")
CASES = [
    ("buy-small-a1", "buy_v2", 1, MAX, 3, 100, 10**15, 10**15 + 2039280, 10**15,
     ("ok", trade_deltas(1, -52, -1, 52, 0), (50, 10, 1, 111, 1))),
    ("buy-small-a2", "buy_v2", 2, MAX, 3, 100, 10**15, 10**15 + 2039280, 10**15,
     ("ok", trade_deltas(2, -204, -2, 203, 1), (200, 10, 1, 111, 3))),
    ("buy-small-a3-eq", "buy_v2", 3, MAX, 3, 100, 10**15, 10**15 + 2039280, 10**15,
     ("err", 6025, "anchor")),
    ("buy-small-a4-gt", "buy_v2", 4, MAX, 3, 100, 10**15, 10**15 + 2039280, 10**15,
     ("err", 6016, "anchor")),
    ("buy-half", "buy_v2", 5 * 10**11, MAX, 10**12, 10**10, MAX - 2039280, MAX, 10**15,
     ("ok", trade_deltas(5 * 10**11, -10121000000, -5 * 10**11, 10065500000, 55500000),
      (10000000000, 10, 10000000, 111, 111000000))),
    ("buy-boundary-succ", "buy_v2", 999999999451, MAX, 10**12, 10**10, MAX - 2039280, MAX, 10**15,
     ("ok", trade_deltas(999999999451, -18435336966199582879, -999999999451,
                          18334244070080219491, 101092896119363388),
      (18214936237723132970, 10, 18214936237723133, 111, 202185792238726776))),
    ("buy-boundary-plus1", "buy_v2", 999999999452, MAX, 10**12, 10**10, MAX - 2039280, MAX, 10**15,
     ("err", 6023, "anchor")),
    ("buy-overflow-last", "buy_v2", 999999999457, MAX, 10**12, 10**10, MAX - 2039280, MAX, 10**15,
     ("err", 6023, "anchor")),
    ("buy-trunc-first", "buy_v2", 999999999458, MAX, 10**12, 10**10, MAX - 2039280, MAX, 10**15,
     ("err", 6024, "anchor")),
    ("buy-b-minus1", "buy_v2", 10**12 - 1, MAX, 10**12, 10**10, MAX - 2039280, MAX, 10**15,
     ("err", 6024, "anchor")),
    ("buy-b-eq", "buy_v2", 10**12, MAX, 10**12, 10**10, MAX - 2039280, MAX, 10**15,
     ("err", 6025, "anchor")),
    ("buy-b-plus1", "buy_v2", 10**12 + 1, MAX, 10**12, 10**10, MAX - 2039280, MAX, 10**15,
     ("err", 6016, "anchor")),
    ("buyexact-mid", "buy_exact_quote_in_v2", 10**12, 1, 10**12, 10**10, MAX - 2039280, MAX, 10**15,
     ("ok", trade_deltas(989980408287, -10**12, -989980408287, 994516352139, 5483647861),
      (1000000000000, 10, 988044660, 111, 10967295722))),
    ("buyexact-maxsucc", "buy_exact_quote_in_v2", MAX - 2039280, 1, 10**12, 10**10, MAX - 2039280, MAX, 10**15,
     ("ok", trade_deltas(999999999451, -18446744073707512335, -999999999451,
                          18345588625027464224, 101155448680048111),
      (18446744073707512335, 10, 18226206969378039, 111, 202310897360096223))),
    ("buyexact-above-balance", "buy_exact_quote_in_v2", MAX - 2039280 + 1, 1, 10**12, 10**10,
     MAX - 2039280, MAX, 10**15,
     ("err", 1, "token")),
    ("buyexact-max", "buy_exact_quote_in_v2", MAX, 1, 10**12, 10**10, MAX - 2039280, MAX, 10**15,
     ("err", 6023, "anchor")),
    ("sell-mid", "sell_v2", 10**6, 1, 10**12, 10**10, 10**15, 10**15 + 2039280, 10**15,
     ("ok", trade_deltas(-10**6, 9878, 10**6, -9933, 55),
      (9999, 10, 10, 111, 111))),
    ("sell-max-minus-vb", "sell_v2", MAX - 10**12, 1, 10**12, 10**10, 10**15, 10**15 + 2039280, MAX,
     ("ok", trade_deltas(-(MAX - 10**12), 9878999463, MAX - 10**12, -9934499460, 55499997),
      (9999999457, 10, 10000000, 111, 110999994))),
    ("sell-max-wrap", "sell_v2", MAX, 1, 10**12, 10**10, 10**15, 10**15 + 2039280, MAX,
     ("ok", trade_deltas(-MAX, 9878999463, -1, -9934499460, 55499997),
      (9999999457, 10, 10000000, 111, 110999994))),
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        if not a or a.executable:
            out[str(k)] = None
        else:
            out[str(k)] = {"lamports": a.lamports, "owner": str(a.owner),
                           "data_hex": bytes(a.data).hex()}
    return out


def amount_at(data_hex, offset):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


def fee_table(tiers):
    def apply(h, m):
        a = h.vm.get_account(feeconfig)
        raw = bytes(a.data[:41]) + struct.pack("<QQQ", 25, 5, 0) + struct.pack("<I", len(tiers))
        for threshold, fees in tiers:
            raw += threshold.to_bytes(16, "little") + struct.pack("<QQQ", *fees)
        raw += struct.pack("<I", 0) + bytes(24)
        h.vm.set_account(feeconfig, Account(a.lamports, raw.ljust(4097, b"\0"), a.owner))
    return apply


def set_amount(vm, key, amount):
    a = vm.get_account(key)
    d = bytearray(a.data); d[64:72] = struct.pack("<Q", amount)
    vm.set_account(key, Account(a.lamports, bytes(d), a.owner))


def set_supply(vm, key, supply):
    a = vm.get_account(key)
    d = bytearray(a.data); d[36:44] = struct.pack("<Q", supply)
    vm.set_account(key, Account(a.lamports, bytes(d), a.owner))


def set_pool(vm, vq, mayhem):
    a = vm.get_account(pool)
    d = bytearray(a.data); d[245:261] = vq.to_bytes(16, "little", signed=True); d[243] = mayhem
    d[271:287] = bytes(16)
    vm.set_account(pool, Account(a.lamports, bytes(d), a.owner))


def event_fields(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    assert len(lines) == 1, lines
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    assert len(raw) >= 104, len(raw)
    return tuple(struct.unpack_from("<Q", raw, off)[0] for off in (64, 72, 80, 88, 96))


receipts_global = []
report_cases = []
for index, (label, name, amount, limit, vb, vq, uq_amount, uq_lamports, ub_amount, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    cap = (SUPPLY * vq) // vb
    if expected[0] == "ok":
        exp = {"kind": "trade", "deltas": expected[1], "event": list(expected[2])}
    else:
        exp = {"kind": "error", "code": expected[1], "error_kind": expected[2]}
    row = {"case": {"instruction": name, "label": label,
                    "amount": amount, "limit": limit,
                    "tiers": [[t, list(fs)] for t, fs in TIERS],
                    "supply": SUPPLY, "vaultbase": vb, "vaultquote": vq,
                    "mayhem": 0, "market_cap": cap, "feeconfig_len": 4097,
                    "userquote_amount": uq_amount, "userbase_amount": ub_amount,
                    "expected": exp}}
    for image in ("original", "control", "candidate"):
        h = Harness(IMAGES[image])
        vm = h.vm
        vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
        for pid, p in [(TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                       (TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so"),
                       (FEES, "evidence/original/pump_fees/deployed.so")]:
            vm.add_program_from_file(pid, ROOT / p)
        glob = bytearray(RAW)
        glob[56] = 0
        vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
        for n, rrow in f["accounts"].items():
            vm.set_account(Pubkey.from_string(rrow["address"]),
                           Account(rrow["lamports"], base64.b64decode(rrow["data_base64"]),
                                   Pubkey.from_string(rrow["owner"])))
        vm.set_account(userbase, Account(10**9, token(base, PAYER.pubkey(), ub_amount, False), TOKEN))
        vm.set_account(userquote, Account(uq_lamports, token(quote, PAYER.pubkey(), uq_amount, True), TOKEN))
        vm.set_account(volume, Account(0, b"", Pubkey.default()))
        keys = [pool, PAYER.pubkey(), CONFIG_KEY, base, quote, userbase, userquote,
                vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
                buyback, EVENT, PROGRAM]
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])]
        combine(fee_table(TIERS))(SimpleNamespace(vm=vm), metas)
        set_amount(vm, vaultbase, vb); set_amount(vm, vaultquote, vq)
        set_supply(vm, base, SUPPLY); set_pool(vm, 0, 0)
        pool_key = str(metas[0].pubkey)
        recipient_key = str(metas[14].pubkey)
        row["case"].setdefault("pool_keys", {})[image] = pool_key
        row["case"].setdefault("buyback_recipients", {})[image] = recipient_key
        before_keys = sorted({str(m.pubkey) for m in metas} | {str(PAYER.pubkey()), str(BB22)}, key=str)
        before = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        # Fixture checks: fee table, pool vq/mayhem/fees, vault amounts, base supply.
        fc = before[str(feeconfig)]
        assert len(bytes.fromhex(fc["data_hex"])) == 4097, (label, image)
        fcd = bytes.fromhex(fc["data_hex"])
        assert struct.unpack_from("<I", fcd, 65)[0] == len(TIERS), (label, image)
        for i, (t, fs) in enumerate(TIERS):
            assert int.from_bytes(fcd[69 + 40 * i:69 + 40 * i + 16], "little") == t, (label, image, i)
            assert struct.unpack_from("<QQQ", fcd, 69 + 40 * i + 16) == fs, (label, image, i)
        pk = before[pool_key]
        pkd = bytes.fromhex(pk["data_hex"])
        assert pkd[245:261] == (0).to_bytes(16, "little", signed=True), (label, image)
        assert pkd[243] == 0, (label, image)
        assert pkd[271:287] == bytes(16), (label, image)
        assert amount_at(before[str(vaultbase)]["data_hex"], 64) == vb, (label, image)
        assert amount_at(before[str(vaultquote)]["data_hex"], 64) == vq, (label, image)
        assert amount_at(before[str(base)]["data_hex"], 36) == SUPPLY, (label, image)
        data = bytes(ix["discriminator"]) + struct.pack("<QQ", amount, limit)
        tx = Transaction.new_signed_with_payer(
            [Instruction(PROGRAM, data, metas)], PAYER.pubkey(), [PAYER], vm.latest_blockhash())
        raw = bytes(tx)
        checks = tx.verify_with_results()
        assert checks and all(checks), "new transaction must verify"
        r = vm.send_transaction(tx)
        failed = isinstance(r, FailedTransactionMetadata)
        meta = r.meta() if failed else r
        after = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        err = str(r.err()) if failed else None
        logs = meta.logs()
        payer_key = str(PAYER.pubkey())
        payer_delta = after[payer_key]["lamports"] - before[payer_key]["lamports"] \
            if before[payer_key] and after[payer_key] else None
        if expected[0] == "ok":
            assert not failed and err is None, (label, image, err)
            deltas = {}
            for wname, key in (("userbase", userbase), ("userquote", userquote),
                               ("vaultbase", vaultbase), ("vaultquote", vaultquote)):
                b, a = before[str(key)], after[str(key)]
                deltas[wname] = None if b is None or a is None else \
                    amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            b, a = before[recipient_key], after[recipient_key]
            deltas["buyback"] = None if b is None or a is None else \
                amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            b, a = before[str(BB22)], after[str(BB22)]
            deltas["buyback22"] = None if b is None or a is None else \
                amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            assert deltas == expected[1], (label, image, deltas, expected[1])
            assert payer_delta == -1849400, (label, image, payer_delta)
            vol = after[str(volume)]
            assert vol is not None and vol["lamports"] == 1844400, (label, image, vol)
            assert len(bytes.fromhex(vol["data_hex"])) == 137, (label, image, len(bytes.fromhex(vol["data_hex"])))
            assert bytes.fromhex(vol["data_hex"])[8:40] == bytes(PAYER.pubkey()), (label, image, "volume user")
            got_ev = event_fields(logs)
            assert got_ev == expected[2], (label, image, got_ev, expected[2])
            observed = {"deltas": deltas, "payer_lamports_delta": -1849400,
                        "volume_lamports": 1844400, "volume_data_len": 137,
                        "event": list(got_ev)}
            site = None
        else:
            assert failed, (label, image, "expected failure")
            code = expected[1]
            if expected[2] == "anchor":
                assert f"custom program error: 0x{0x1770 + code:04x}" in err or f"({code})" in err or str(code) in err, (label, image, err)
                site_lines = [l for l in logs if "AnchorError thrown in" in l and f"Error Number: {code}." in l]
                assert len(site_lines) == 1, (label, image, logs)
                site = site_lines[0]
            else:
                assert "(1)" in err, (label, image, err)
                assert any("Error: insufficient funds" in l for l in logs), (label, image, logs)
                assert any("failed: custom program error: 0x1" in l for l in logs), (label, image, logs)
                site = [l for l in logs if "failed: custom program error: 0x1" in l][0]
            deltas = {}
            for wname, key in (("userbase", userbase), ("userquote", userquote),
                               ("vaultbase", vaultbase), ("vaultquote", vaultquote)):
                b, a = before[str(key)], after[str(key)]
                deltas[wname] = None if b is None or a is None else \
                    amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            b, a = before[recipient_key], after[recipient_key]
            deltas["buyback"] = None if b is None or a is None else \
                amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            b, a = before[str(BB22)], after[str(BB22)]
            deltas["buyback22"] = None if b is None or a is None else \
                amount_at(a["data_hex"], 64) - amount_at(b["data_hex"], 64)
            assert deltas == zero_deltas(), (label, image, deltas)
            assert payer_delta == -5000, (label, image, payer_delta)
            vol = after[str(volume)]
            assert vol is None or (vol["lamports"] == 0 and vol["data_hex"] == ""), (label, image, vol)
            assert len([l for l in logs if l.startswith("Program data: ")]) == 0, (label, image, logs)
            observed = {"deltas": deltas, "payer_lamports_delta": -5000,
                        "volume_lamports": 0, "volume_data_len": 0,
                        "event": None, "site": site}
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": name,
                        "label": label},
            "transaction_base64": base64.b64encode(raw).decode(),
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
            "all_signatures_verified": True, "signature_fields": 1,
            "before": before, "after": after,
            "metadata": {"signature": str(meta.signature()), "logs": logs,
                         "inner_instructions": str(meta.inner_instructions()),
                         "return_data": str(meta.return_data())},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                      "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
            "loaded_programs": {
                "pAMM": {"path": "evidence/original/pump_amm/deployed.so",
                         "sha256": IMAGE_SHA[image]},
                "pFEES": {"path": "evidence/original/pump_fees/deployed.so",
                          "sha256": FEES_SHA},
                "pPUMP": {"path": "evidence/original/pump/deployed.so",
                          "sha256": PUMP_SHA}},
            "error": err, "rollback_except_payer_fee": err is not None,
            "payer_fee_lamports": -payer_delta if payer_delta is not None else None,
            "observed": observed,
        })
        row[image] = {"error": err, "logs": logs,
                      "accounts": {k: v for k, v in after.items()},
                      "observed": observed}
        print(f"  {label} [{image}] observed={observed}", flush=True)
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
report = {
    "scope": "Fresh normally signed original/control/candidate triples pinning "
             "the v2 buy reserve wall in curve/constant_product.rs "
             "quote_for_base(amount, b, q) = ceil(q * amount / (b - amount)): "
             "amount == b gives 6025 DivisionByZero, amount > b gives 6016 "
             "BuyMoreBaseAmountThanPoolReserves, amounts just below b give "
             "6024 Truncation once the curve quote itself exceeds u64 "
             "(first at b - 542), and the 6 amounts between the last "
             "success (b - 549) and the first Truncation give 6023 "
             "Overflow from the u64 quote + fees total. The exact-in "
             "path has no wall (max spend succeeds with out exactly "
             "b - 549; one unit above the user balance gives Token "
             "insufficient funds; only amount = u64::MAX reaches the "
             "AMM's own 6023 Overflow), and the sell path has no wall "
             "either (sell MAX - VB lands the vault base exactly on "
             "u64::MAX; sell MAX succeeds in this fixture with the "
             "vault base wrapping to VB - 1, a fixture token-program "
             "property reproduced by a direct token transfer). A "
             "small-reserve ladder (VB = 3, VQ = 100) shows the same "
             "wall in miniature. Every success funds the user volume "
             "accumulator with 1,844,400 lamports (payer delta "
             "-1,849,400 with the 5,000 fee); every failure rolls "
             "back fully with payer -5,000 only. All three images "
             "behave identically. Receipts are stored as parts to "
             "stay under GitHub's 25MB web-upload limit; verify.py "
             "reads them in order.",
    "fresh_vm_environment": "1",
    "image_sha256": IMAGE_SHA,
    "input_sha256": {
        "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json":
            sha((ROOT / "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json").read_bytes()),
        "research/imported-lab/analysis/pump_fun/config-snapshot.json":
            sha((ROOT / "research/imported-lab/analysis/pump_fun/config-snapshot.json").read_bytes()),
        "evidence/upstream/pump_amm.json":
            sha((ROOT / "evidence/upstream/pump_amm.json").read_bytes()),
        "evidence/dependencies/spl_token/deployed.so":
            sha((ROOT / "evidence/dependencies/spl_token/deployed.so").read_bytes()),
        "evidence/dependencies/spl_token_2022/deployed.so":
            sha((ROOT / "evidence/dependencies/spl_token_2022/deployed.so").read_bytes()),
        "evidence/original/pump_fees/deployed.so": FEES_SHA,
        "evidence/original/pump/deployed.so": PUMP_SHA,
    },
    "counts": {"vms": len(receipts_global), "transactions": len(receipts_global),
               "signature_fields": len(receipts_global)},
    "case_count": len(report_cases),
    "classifications": {"v2-buy-reserve-wall": len(report_cases)},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")
