#!/usr/bin/env python3
"""Build research/amm-v2-fee-tier-boundary-20261029 receipts.

v2 fee-tier boundary inclusivity, market-cap floor division, and the
mayhem cap override in curve/fees.rs tier() + state/pool.rs
market_cap() (2nd run packet #29; run 1 #8 measured tier ORDER
-- last wins, duplicate wins, first-threshold short-circuit -- but
never whether a cap exactly ON a threshold selects that tier, never
the floor division of the cap itself, and never the mayhem supply
override).

Pinned at runtime with buy_v2 (10^6 base out) and sell_v2 (10^6 base
in) on the trade-v2 differential harness, with the pool's virtual
quote reserves zeroed and the vault balances set to round numbers
so the market cap is exactly supply * VQ / VB:

- The tier boundary is inclusive (>=): with tiers [(100, A),
  (1000, B)], cap 999 pays tier A (spend 1,013,116) while cap 1000
  pays tier B (spend 1,025,228) -- one unit of supply flips the
  tier. Cap 100 pays A, cap 1001 pays B, cap 0 pays A.
- The cap itself is floor-divided: supply 1000 with VB = 10^9 + 1
  gives cap floor(10^12 / 1000000001) = 999, so tier A pays again
  (spend 1,013,115 -- one less than the exact-999 case, because the
  larger base reserve also moves the curve quote by one), while the
  same supply with VB = 10^9 gives cap exactly 1000 and tier B.
- Mayhem overrides the supply in the cap: a mayhem pool with real
  supply 50 (real cap 50, tier A) pays tier B, because market_cap
  substitutes 10^15 for the supply (cap 10^15). The same tiers and
  supply on a non-mayhem pool pay tier A. Mayhem also zeroes the
  buyback split (buyback_bps = 0 in mayhem mode), so the mayhem
  tier-B buy puts the full 1,025,228 into the vault with buyback 0,
  versus vault 1,014,117 + buyback 11,111 off mayhem.
- The selector is shared by buy and sell: sell at cap 1000 pays
  tier B (user +974,824, vault -985,913, buyback +11,089) while
  sell at cap 999 pays tier A (user +986,912, vault -992,456,
  buyback +5,544).
- Every success emits exactly 1 event whose fixed-offset prefix
  pins the tier directly: quote @64, lp_bps @72, lp_fee @80,
  protocol_bps @88, protocol_fee @96. Buy A: (1001002, 10, 1002,
  111, 11112); buy B: (1001002, 20, 2003, 222, 22223); floor-below
  A: (1001001, 10, 1002, 111, 11112); sell A: (999000, 10, 999,
  111, 11089); sell B: (999000, 20, 1998, 222, 22178).
- Every success funds the user volume accumulator with exactly
  1,844,400 lamports (137 bytes, payer key at [8:40]), so the
  payer delta is -1,849,400 (rent + 5,000 fee).
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
OUT = ROOT / "research/amm-v2-fee-tier-boundary-20261029"
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
A = (10, 111, 0)
B = (20, 222, 0)


def trade_deltas(ub, uq, vb, vq, bb):
    return {"userbase": ub, "userquote": uq, "vaultbase": vb,
            "vaultquote": vq, "buyback": bb, "buyback22": None}


# (label, instruction, tiers, supply, VB, VQ, mayhem, expected deltas, event fields)
CASES = [
    ("buy-below-first-99", "buy_v2", [(100, A), (1000, B)], 99, 10**9, 10**9, 0,
     trade_deltas(10**6, -1013116, -10**6, 1007560, 5556),
     (1001002, 10, 1002, 111, 11112)),
    ("buy-at-first-100", "buy_v2", [(100, A), (1000, B)], 100, 10**9, 10**9, 0,
     trade_deltas(10**6, -1013116, -10**6, 1007560, 5556),
     (1001002, 10, 1002, 111, 11112)),
    ("buy-below-second-999", "buy_v2", [(100, A), (1000, B)], 999, 10**9, 10**9, 0,
     trade_deltas(10**6, -1013116, -10**6, 1007560, 5556),
     (1001002, 10, 1002, 111, 11112)),
    ("buy-at-second-1000", "buy_v2", [(100, A), (1000, B)], 1000, 10**9, 10**9, 0,
     trade_deltas(10**6, -1025228, -10**6, 1014117, 11111),
     (1001002, 20, 2003, 222, 22223)),
    ("buy-above-second-1001", "buy_v2", [(100, A), (1000, B)], 1001, 10**9, 10**9, 0,
     trade_deltas(10**6, -1025228, -10**6, 1014117, 11111),
     (1001002, 20, 2003, 222, 22223)),
    ("buy-floor-below", "buy_v2", [(100, A), (1000, B)], 1000, 10**9 + 1, 10**9, 0,
     trade_deltas(10**6, -1013115, -10**6, 1007559, 5556),
     (1001001, 10, 1002, 111, 11112)),
    ("buy-floor-exact", "buy_v2", [(100, A), (1000, B)], 1000, 10**9, 10**9, 0,
     trade_deltas(10**6, -1025228, -10**6, 1014117, 11111),
     (1001002, 20, 2003, 222, 22223)),
    ("buy-mayhem-override", "buy_v2", [(100, A), (10**15, B)], 50, 10**9, 10**9, 1,
     trade_deltas(10**6, -1025228, -10**6, 1025228, 0),
     (1001002, 20, 2003, 222, 22223)),
    ("buy-nonmayhem-same", "buy_v2", [(100, A), (10**15, B)], 50, 10**9, 10**9, 0,
     trade_deltas(10**6, -1013116, -10**6, 1007560, 5556),
     (1001002, 10, 1002, 111, 11112)),
    ("buy-supply-zero", "buy_v2", [(100, A), (1000, B)], 0, 10**9, 10**9, 0,
     trade_deltas(10**6, -1013116, -10**6, 1007560, 5556),
     (1001002, 10, 1002, 111, 11112)),
    ("sell-at-second-1000", "sell_v2", [(100, A), (1000, B)], 1000, 10**9, 10**9, 0,
     trade_deltas(-10**6, 974824, 10**6, -985913, 11089),
     (999000, 20, 1998, 222, 22178)),
    ("sell-below-second-999", "sell_v2", [(100, A), (1000, B)], 999, 10**9, 10**9, 0,
     trade_deltas(-10**6, 986912, 10**6, -992456, 5544),
     (999000, 10, 999, 111, 11089)),
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
    vm.set_account(pool, Account(a.lamports, bytes(d), a.owner))


def event_fields(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    assert len(lines) == 1, lines
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    assert len(raw) >= 104, len(raw)
    return tuple(struct.unpack_from("<Q", raw, off)[0] for off in (64, 72, 80, 88, 96))


receipts_global = []
report_cases = []
for index, (label, name, tiers, supply, vb, vq, mayhem, expected, ev) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    amount = 10**6
    limit = MAX if name == "buy_v2" else 1
    cap = ((10**15 if mayhem else supply) * vq) // vb
    row = {"case": {"instruction": name, "label": label,
                    "amount": amount, "limit": limit,
                    "tiers": [[t, list(fs)] for t, fs in tiers],
                    "supply": supply, "vaultbase": vb, "vaultquote": vq,
                    "mayhem": mayhem, "market_cap": cap, "feeconfig_len": 4097,
                    "expected": {"kind": "trade", "deltas": expected,
                                 "event": list(ev)}}}
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
        for k, m, native in ((userbase, base, False), (userquote, quote, True)):
            vm.set_account(k, Account(10**15 + 2039280 if native else 10**9,
                                      token(m, PAYER.pubkey(), 10**15, native), TOKEN))
        vm.set_account(volume, Account(0, b"", Pubkey.default()))
        keys = [pool, PAYER.pubkey(), CONFIG_KEY, base, quote, userbase, userquote,
                vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
                buyback, EVENT, PROGRAM]
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])]
        combine(fee_table(tiers))(SimpleNamespace(vm=vm), metas)
        set_amount(vm, vaultbase, vb); set_amount(vm, vaultquote, vq)
        set_supply(vm, base, supply); set_pool(vm, 0, mayhem)
        pool_key = str(metas[0].pubkey)
        recipient_key = str(metas[14].pubkey)
        row["case"].setdefault("pool_keys", {})[image] = pool_key
        row["case"].setdefault("buyback_recipients", {})[image] = recipient_key
        before_keys = sorted({str(m.pubkey) for m in metas} | {str(PAYER.pubkey()), str(BB22)}, key=str)
        before = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        # Fixture checks: fee table, pool vq/mayhem, vault amounts, base supply.
        fc = before[str(feeconfig)]
        assert len(bytes.fromhex(fc["data_hex"])) == 4097, (label, image)
        fcd = bytes.fromhex(fc["data_hex"])
        assert struct.unpack_from("<I", fcd, 65)[0] == len(tiers), (label, image)
        for i, (t, fs) in enumerate(tiers):
            assert int.from_bytes(fcd[69 + 40 * i:69 + 40 * i + 16], "little") == t, (label, image, i)
            assert struct.unpack_from("<QQQ", fcd, 69 + 40 * i + 16) == fs, (label, image, i)
        pk = before[pool_key]
        pkd = bytes.fromhex(pk["data_hex"])
        assert pkd[245:261] == (0).to_bytes(16, "little", signed=True), (label, image)
        assert pkd[243] == mayhem, (label, image)
        assert amount_at(before[str(vaultbase)]["data_hex"], 64) == vb, (label, image)
        assert amount_at(before[str(vaultquote)]["data_hex"], 64) == vq, (label, image)
        assert amount_at(before[str(base)]["data_hex"], 36) == supply, (label, image)
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
        assert deltas == expected, (label, image, deltas, expected)
        assert payer_delta == -1849400, (label, image, payer_delta)
        vol = after[str(volume)]
        assert vol is not None and vol["lamports"] == 1844400, (label, image, vol)
        assert len(bytes.fromhex(vol["data_hex"])) == 137, (label, image, len(bytes.fromhex(vol["data_hex"])))
        assert bytes.fromhex(vol["data_hex"])[8:40] == bytes(PAYER.pubkey()), (label, image, "volume user")
        got_ev = event_fields(logs)
        assert got_ev == ev, (label, image, got_ev, ev)
        observed = {"deltas": deltas, "payer_lamports_delta": -1849400,
                    "volume_lamports": 1844400, "volume_data_len": 137,
                    "event": list(got_ev)}
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
        print(f"  {label} [{image}] cap={cap} observed={observed}")
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
             "v2 fee-tier boundary inclusivity, market-cap floor division, "
             "and the mayhem cap override: with tiers [(100, A), (1000, B)] "
             "cap 999 pays tier A (buy spend 1,013,116) while cap 1000 pays "
             "tier B (spend 1,025,228); supply 1000 with VB = 10^9 + 1 floors "
             "the cap to 999 and pays tier A again (spend 1,013,115, one "
             "less because the larger base reserve also moves the curve "
             "quote by one); a mayhem pool with real supply 50 pays tier B "
             "because market_cap substitutes 10^15 for the supply, and "
             "mayhem zeroes the buyback split (full 1,025,228 into the "
             "vault, buyback 0) versus vault 1,014,117 + buyback 11,111 off "
             "mayhem; sell shares the selector (cap 1000 tier B user "
             "+974,824, cap 999 tier A user +986,912). Every success emits "
             "exactly 1 event whose fixed-offset prefix pins the tier "
             "(quote @64, lp_bps @72, lp_fee @80, protocol_bps @88, "
             "protocol_fee @96). Every success funds the user volume "
             "accumulator with 1,844,400 lamports (payer delta -1,849,400 "
             "with the 5,000 fee). All three images behave identically. "
             "Receipts are stored as parts to stay under GitHub's 25MB "
             "web-upload limit; verify.py reads them in order.",
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
    "classifications": {"v2-fee-tier-boundary": len(report_cases)},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")
