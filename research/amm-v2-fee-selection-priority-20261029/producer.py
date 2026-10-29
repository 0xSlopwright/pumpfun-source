#!/usr/bin/env python3
"""Build research/amm-v2-fee-selection-priority-20261029 receipts.

v2 fee-table selection priority in select_and_apply_v2 (2nd run packet
#8; run 1 #8/#9/#10 measured each table in isolation, never the
priority between them). Pinned at runtime with buy_v2 (10^10 base out)
and sell_v2 (10^9 base in) on the trade-v2 differential harness:

- The stable branch never consults the exotic table: a canonical
  STABLE pool with exotic (30, 333, 0) set fails 6082 FeeTiersEmpty
  (fees.rs:160) at fee_config_len 4072 AND at 2512, because the
  stable branch takes tier([]) below 4073. The exotic table sitting
  at offset 2073 does not rescue a short stable config.
- The two gates are independent: at exactly 4073 the stable pool
  pays its stable spend (buy 1,846,884; sell +180,304) while the
  exotic pool at the same length still pays flat fees (buy
  1,830,459) -- 4073 opens the stable table only, 4097 opens the
  exotic table only.
- The exotic table's nonzero test is an OR over all three legs:
  all-zero exotic at full length 4097 pays flat fees (buy
  1,830,459), while creator-only (0, 0, 333) selects the table and
  charges the creator leg (buy 1,885,755, buyback 0).
- NORMAL_QUOTE routes exactly like the native mint: with exotic set
  it pays the tier spend (buy 1,847,796, buyback 8,486), never the
  exotic table.
- Control anchors from run 1 reproduced: native + exotic at 4097
  pays tier spend 1,847,796; stable + exotic at 4097 pays stable
  spend 1,846,884; exotic + exotic at 4097 pays 1,891,230 (buyback
  30,386). Sell anchors: exotic + exotic at 4097 pays +175,869
  (vault -178,908, buyback 3,039); stable + exotic at 4097 pays
  +180,304 (vault -180,350, buyback 46). In every success, spend
  equals vault quote delta plus buyback recipient delta.
- The 6082 gate is in the shared selector, not buy-specific:
  sell_v2 on a stable pool with exotic set at 4072 fails 6082 too.
- Every success funds the user volume accumulator with exactly
  1,844,400 lamports (137 bytes, payer key at [8:40]), so the payer
  delta is -1,849,400 (rent + 5,000 fee). Every error rolls back
  everything except the payer's 5,000 fee.
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
    CONFIG, CONFIG_KEY, EVENT, IDL, OUTSIDER, PAYER, PROGRAM, RAW, TOKEN, TOKEN22,
    base, combine, f, pool, quote, token, userbase, userquote, vaultbase,
    vaultquote, mutate,
)
from pump_amm_trade_v2_differential import (
    FEES, buyback, feeconfig, rekey_pool, volume,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-v2-fee-selection-priority-20261029"
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

STABLE = Pubkey.from_string('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
EXOTIC_KEY = Pubkey.from_bytes(bytes([90]) * 32)
NORMAL_KEY = Pubkey.from_bytes(bytes([131, 13, 252, 159, 222, 95, 230, 184, 170, 124, 4, 164, 118, 233, 30, 138, 198, 187, 38, 74, 173, 144, 250, 25, 201, 223, 73, 216, 92, 62, 91, 94]))
QUOTE_KEYS = {"native": quote, "stable": STABLE, "exotic": EXOTIC_KEY, "normal": NORMAL_KEY}

MAX = 2**64 - 1


def trade_deltas(ub, uq, vb, vq, bb):
    return {"userbase": ub, "userquote": uq, "vaultbase": vb,
            "vaultquote": vq, "buyback": bb, "buyback22": None}


# (label, instruction, amount, limit, quote_kind, exotic, length, expected)
# expected: ("trade", deltas) | ("error", code, fragment)
CASES = [
    ("buy-stable-exotic-4072", "buy_v2", 10**10, MAX, "stable", (30, 333, 0), 4072,
     ("error", "6082", "FeeTiersEmpty")),
    ("buy-stable-exotic-2512", "buy_v2", 10**10, MAX, "stable", (30, 333, 0), 2512,
     ("error", "6082", "FeeTiersEmpty")),
    ("buy-stable-exotic-4073", "buy_v2", 10**10, MAX, "stable", (30, 333, 0), 4073,
     ("trade", trade_deltas(10**10, -1846884, -10**10, 1846428, 456))),
    ("buy-exotic-4073", "buy_v2", 10**10, MAX, "exotic", (30, 333, 0), 4073,
     ("trade", trade_deltas(10**10, -1830459, -10**10, 1830003, 456))),
    ("buy-exotic-zero-4097", "buy_v2", 10**10, MAX, "exotic", (0, 0, 0), None,
     ("trade", trade_deltas(10**10, -1830459, -10**10, 1830003, 456))),
    ("buy-exotic-creator-only-4097", "buy_v2", 10**10, MAX, "exotic", (0, 0, 333), None,
     ("trade", trade_deltas(10**10, -1885755, -10**10, 1885755, 0))),
    ("buy-normal-exotic-4097", "buy_v2", 10**10, MAX, "normal", (30, 333, 0), None,
     ("trade", trade_deltas(10**10, -1847796, -10**10, 1839310, 8486))),
    ("buy-native-exotic-4097", "buy_v2", 10**10, MAX, "native", (30, 333, 0), None,
     ("trade", trade_deltas(10**10, -1847796, -10**10, 1839310, 8486))),
    ("buy-stable-exotic-4097", "buy_v2", 10**10, MAX, "stable", (30, 333, 0), None,
     ("trade", trade_deltas(10**10, -1846884, -10**10, 1846428, 456))),
    ("buy-exotic-exotic-4097", "buy_v2", 10**10, MAX, "exotic", (30, 333, 0), None,
     ("trade", trade_deltas(10**10, -1891230, -10**10, 1860844, 30386))),
    ("sell-stable-exotic-4072", "sell_v2", 10**9, 1, "stable", (30, 333, 0), 4072,
     ("error", "6082", "FeeTiersEmpty")),
    ("sell-exotic-exotic-4097", "sell_v2", 10**9, 1, "exotic", (30, 333, 0), None,
     ("trade", trade_deltas(-10**9, 175869, 10**9, -178908, 3039))),
    ("sell-stable-exotic-4097", "sell_v2", 10**9, 1, "stable", (30, 333, 0), None,
     ("trade", trade_deltas(-10**9, 180304, 10**9, -180350, 46))),
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


receipts_global = []
report_cases = []
for index, (label, name, amount, limit, quote_kind, exotic, length, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    expected_len = 4097 if length is None else length
    row = {"case": {"instruction": name, "label": label,
                    "amount": amount, "limit": limit,
                    "quote_kind": quote_kind, "exotic": list(exotic),
                    "feeconfig_len": expected_len,
                    "expected": {"kind": expected[0],
                                 **({"deltas": expected[1]} if expected[0] == "trade" else
                                    {"code": expected[1], "fragment": expected[2]})}}}
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
        ovs = []
        if quote_kind != "native":
            ovs.append(rekey_pool(QUOTE_KEYS[quote_kind], True))
        ovs.append(mutate(feeconfig, 2073, struct.pack("<QQQ", *exotic)))
        if length is not None:
            ovs.append(mutate(feeconfig, 0, b"", length))
        combine(*ovs)(SimpleNamespace(vm=vm), metas)
        pool_key = str(metas[0].pubkey)
        recipient_key = str(metas[14].pubkey)
        if index == 0 and image == "original":
            row["case"]["pool_key_note"] = "per-image pool/recipient keys recorded below"
        row["case"].setdefault("pool_keys", {})[image] = pool_key
        row["case"].setdefault("buyback_recipients", {})[image] = recipient_key
        before_keys = sorted({str(m.pubkey) for m in metas} | {str(PAYER.pubkey()), str(BB22)}, key=str)
        before = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        # Fixture checks: fee config length, exotic table bytes, pool quote mint.
        fc = before[str(feeconfig)]
        assert len(bytes.fromhex(fc["data_hex"])) == expected_len, (label, image, len(bytes.fromhex(fc["data_hex"])))
        assert bytes.fromhex(fc["data_hex"])[2073:2097] == struct.pack("<QQQ", *exotic), (label, image, "exotic bytes")
        pk = before[pool_key]
        assert bytes.fromhex(pk["data_hex"])[75:107] == bytes(QUOTE_KEYS[quote_kind]), (label, image, "pool quote")
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
        observed = {}
        if expected[0] == "trade":
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
            observed = {"deltas": deltas, "payer_lamports_delta": -1849400,
                        "volume_lamports": 1844400, "volume_data_len": 137}
        else:
            assert failed and err is not None and expected[1] in err, (label, image, err)
            assert expected[2] in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == -5000, (label, image, payer_delta)
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            assert site is not None and "fees.rs" in site, (label, image, site)
            row.setdefault("error_sites", {})[image] = site
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback")
            observed = {"error_code": expected[1], "fragment": expected[2],
                        "payer_lamports_delta": -5000}
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
        print(f"  {label} [{image}] error={err} observed={observed}")
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
             "v2 fee-table selection priority: the stable branch never "
             "consults the exotic table (stable + exotic at 4072 and 2512 "
             "both fail 6082 FeeTiersEmpty); the 4073 gate opens the stable "
             "table only (stable pays 1,846,884 buy / +180,304 sell) while "
             "the exotic pool at 4073 still pays flat fees (1,830,459); "
             "the exotic nonzero test is an OR over all three legs "
             "(all-zero exotic at 4097 pays flat 1,830,459, creator-only "
             "selects the table and charges 1,885,755 with buyback 0); "
             "NORMAL_QUOTE routes exactly like the native mint (tier spend "
             "1,847,796, buyback 8,486, exotic ignored); control anchors "
             "reproduced (native + exotic 1,847,796, stable + exotic "
             "1,846,884, exotic + exotic 1,891,230 buy / +175,869 sell); "
             "the 6082 gate is in the shared selector (sell fails it too). "
             "Every success funds the user volume accumulator with "
             "1,844,400 lamports (payer delta -1,849,400 with the 5,000 "
             "fee). All error cases roll back everything except the "
             "payer's 5,000 fee. All three images behave identically. "
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
    "classifications": {"v2-fee-selection-priority": len(report_cases)},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")
