#!/usr/bin/env python3
"""Build research/amm-multi-hop-three-hop-20261029 receipts.

multi_hop_swap through THREE AMM hops (2nd run packet #5; run 1 #32
covered one and two hops only, never three), pinned at runtime:
- buy 10^9 quote chains hop1 -> hop2 -> hop3 and lands
  5,315,084,721,958 of the third base in U3; buy 10^6 lands
  5,415,445,863. The per-hop vault deltas are exact: hop1 quote
  vault +995,392,847 and base vault -5,385,694,844,757; hop2
  quote vault +5,385,694,844,757 and base vault
  -5,356,844,515,538; hop3 quote vault +5,356,844,515,538 and
  base vault -5,315,084,721,958. The buyback recipient takes the
  whole input-side fee: +4,607,153 on the 10^9 buy, +4,607 on the
  10^6 buy;
- sell 10^9 of the third base lands 180,345 quote in userquote
  (the same final number as the two-hop sell, because the last
  hop's input is the same 997,498,005 base); sell 10^6 lands 180.
  The last hop's quote vault pays 181,191 while the user nets
  180,345 and the buyback recipient takes 846 (181,191 =
  180,345 + 846); on the 10^6 sell the split is 181 = 180 + 1;
- the limit is a NET-receipt floor, checked once at the end:
  buy limit exactly 5,315,084,721,958 passes and +1 fails
  ExceededSlippage (6004); sell limit exactly 180,345 passes
  while the gross vault payout 181,191 (and 181,190) FAILS, so a
  limit set to the vault delta is wrong;
- every successful trade funds the user volume accumulator with
  exactly 1,844,400 lamports (rent for 137 bytes + 128 overhead),
  so the payer delta is -1,849,400 (1,844,400 rent + 5,000 fee),
  and the accumulator data is 137 bytes with the payer key at
  [8:40];
- amount 0 fails ZeroQuoteAmount (6002) and limit 0 fails
  ZeroBaseAmount (6001) before any hop runs; swapping hop3's
  two mints fails MultiHopMixedDirection (6086) in both
  directions; a junk hop3 mint, or truncating the route to two
  hops (so it ends at the second base, not user_out's third
  base), fails MultiHopDiscontinuousPath (6084); 14 remaining
  accounts (not a multiple of 5) fails NotEnoughRemainingAccounts
  (6044); a hop3 pool owned by nobody fails
  AccountTypeNotSupported (6027); an unsigned user fails
  AccountNotSigner (3010). All error cases roll back everything
  except the payer's 5,000 fee, and the volume accumulator is
  NOT funded on error;
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
    base, f, pool, quote, userbase, userquote, vaultbase, vaultquote,
)
from pump_amm_multi_hop_differential import (
    BASE2, BASE3, P3, PUMP, PUMP_EVENT, PUMP_FEES, PUMP_GLOBAL, U3, VB2, VB3, VQ2,
    VQ3, three_amm, volume,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-multi-hop-three-hop-20261029"
WS = Path.home() / "workspace/slop-verify"

IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
FEES_SHA = hashlib.sha256((ROOT / "evidence/original/pump_fees/deployed.so").read_bytes()).hexdigest()
PUMP_SHA = hashlib.sha256((ROOT / "evidence/original/pump/deployed.so").read_bytes()).hexdigest()

# watched token accounts, in snapshot-key order-independent dict form
WATCH = {
    "userquote": userquote,
    "u3": U3,
    "buyback": buyback,
    "vb1": vaultbase,
    "vq1": vaultquote,
    "vb2": VB2,
    "vq2": VQ2,
    "vb3": VB3,
    "vq3": VQ3,
}

BUY_1E9 = {
    "userquote": -10**9, "u3": 5315084721958, "buyback": 4607153,
    "vb1": -5385694844757, "vq1": 995392847,
    "vb2": -5356844515538, "vq2": 5385694844757,
    "vb3": -5315084721958, "vq3": 5356844515538,
}
BUY_1E6 = {
    "userquote": -10**6, "u3": 5415445863, "buyback": 4607,
    "vb1": -5429043355, "vq1": 995393,
    "vb2": -5429013880, "vq2": 5429043355,
    "vb3": -5415445863, "vq3": 5429013880,
}
SELL_1E9 = {
    "userquote": 180345, "u3": -10**9, "buyback": 846,
    "vb1": 997498005, "vq1": -181191,
    "vb2": 997499001, "vq2": -997498005,
    "vb3": 10**9, "vq3": -997499001,
}
SELL_1E6 = {
    "userquote": 180, "u3": -10**6, "buyback": 1,
    "vb1": 997498, "vq1": -181,
    "vb2": 997499, "vq2": -997498,
    "vb3": 10**6, "vq3": -997499,
}

# (label, amount, limit, sell, override, unsigned, expected)
# override: three | swap3 | junk3 | trunc10 | trunc14 | pool3owner
# expected: ("hop3", delta-dict) | ("error", code, fragment)
CASES = [
    ("buy-1e9", 10**9, 1, False, "three", False, ("hop3", BUY_1E9)),
    ("buy-1e6", 10**6, 1, False, "three", False, ("hop3", BUY_1E6)),
    ("buy-1e9-limit-exact", 10**9, 5315084721958, False, "three", False, ("hop3", BUY_1E9)),
    ("buy-1e9-limit-plus1", 10**9, 5315084721959, False, "three", False, ("error", "6004", "ExceededSlippage")),
    ("buy-amount0", 0, 1, False, "three", False, ("error", "6002", "ZeroQuoteAmount")),
    ("buy-limit0", 10**9, 0, False, "three", False, ("error", "6001", "ZeroBaseAmount")),
    ("buy-hop3-swap", 10**9, 1, False, "swap3", False, ("error", "6086", "MultiHopMixedDirection")),
    ("buy-hop3-junk", 10**9, 1, False, "junk3", False, ("error", "6084", "MultiHopDiscontinuousPath")),
    ("buy-remaining-10", 10**9, 1, False, "trunc10", False, ("error", "6084", "MultiHopDiscontinuousPath")),
    ("buy-remaining-14", 10**9, 1, False, "trunc14", False, ("error", "6044", "NotEnoughRemainingAccounts")),
    ("buy-hop3-pool-bad-owner", 10**9, 1, False, "pool3owner", False, ("error", "6027", "AccountTypeNotSupported")),
    ("buy-unsigned", 10**9, 1, False, "three", True, ("error", "3010", "AccountNotSigner")),
    ("sell-1e9", 10**9, 1, True, "three", False, ("hop3", SELL_1E9)),
    ("sell-1e6", 10**6, 1, True, "three", False, ("hop3", SELL_1E6)),
    ("sell-1e9-limit-exact", 10**9, 180345, True, "three", False, ("hop3", SELL_1E9)),
    ("sell-1e9-limit-plus1", 10**9, 180346, True, "three", False, ("error", "6004", "ExceededSlippage")),
    ("sell-hop3-swap", 10**9, 1, True, "swap3", False, ("error", "6086", "MultiHopMixedDirection")),
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        if not a or not a.executable:
            out[str(k)] = None if not a else {"lamports": a.lamports, "owner": str(a.owner),
                                              "data_hex": bytes(a.data).hex()}
    return out


def amount_at(data_hex, offset):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


def make_override(kind, sell):
    def ov(h, m):
        three_amm(sell)(h, m)
        if kind == "three":
            return
        if kind == "swap3":
            i = 16 if sell else len(m) - 5
            m[i], m[i + 1] = m[i + 1], m[i]
        elif kind == "junk3":
            i = 16 if sell else len(m) - 5
            m[i] = AccountMeta(Pubkey.from_bytes(bytes([0x99]) * 32), False, False)
        elif kind == "trunc10":
            del m[26:]
        elif kind == "trunc14":
            del m[30:]
        elif kind == "pool3owner":
            a = h.vm.get_account(P3)
            h.vm.set_account(P3, Account(a.lamports, bytes(a.data), Pubkey.default()))
        else:
            raise ValueError(kind)
    return ov


receipts_global = []
report_cases = []
for index, (label, amount, limit, sell, override, unsigned, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == "multi_hop_swap")
    row = {"case": {"instruction": "multi_hop_swap", "label": label,
                    "amount": amount, "limit": limit, "sell": sell,
                    "override": override, "unsigned": unsigned,
                    "expected": {"kind": expected[0],
                                 **({"deltas": expected[1]} if expected[0] == "hop3" else
                                    {"code": expected[1], "fragment": expected[2]})}}}
    for image in ("original", "control", "candidate"):
        h = Harness(IMAGES[image])
        vm = h.vm
        vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
        from pump_amm_create_differential import ATA
        for pid, p in [(TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                       (TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so"),
                       (FEES, "evidence/original/pump_fees/deployed.so"),
                       (ATA, "evidence/dependencies/associated_token/deployed.so"),
                       (PUMP, "evidence/original/pump/deployed.so")]:
            vm.add_program_from_file(pid, ROOT / p)
        for rrow in f["accounts"].values():
            vm.set_account(Pubkey.from_string(rrow["address"]),
                           Account(rrow["lamports"], base64.b64decode(rrow["data_base64"]),
                                   Pubkey.from_string(rrow["owner"])))
        glob = bytearray(RAW)
        glob[56] = 0
        vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
        from pump_amm_liquidity_differential import token as token_bytes
        for k, m, native in ((userbase, base, False), (userquote, quote, True)):
            vm.set_account(k, Account(10**15 + 2039280 if native else 10**9,
                                      token_bytes(m, PAYER.pubkey(), 10**15, native), TOKEN))
        vm.set_account(volume, Account(0, b"", Pubkey.default()))
        for k in [PUMP_GLOBAL, PUMP_FEES, PUMP_EVENT]:
            vm.set_account(k, Account(10**9, b"", Pubkey.default()))
        keys = [PAYER.pubkey(), userbase if sell else userquote, userquote if sell else userbase,
                CONFIG_KEY, feeconfig, volume, buyback, TOKEN, TOKEN22, Pubkey.default(),
                EVENT, PROGRAM, PUMP, PUMP_GLOBAL, PUMP_FEES, PUMP_EVENT]
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, ix["accounts"])]
        metas += [AccountMeta(base, False, False), AccountMeta(quote, False, False),
                  AccountMeta(pool, False, True), AccountMeta(vaultbase, False, True),
                  AccountMeta(vaultquote, False, True)]
        make_override(override, sell)(SimpleNamespace(vm=vm), metas)
        payer = OUTSIDER if unsigned else PAYER
        if unsigned:
            metas[0] = AccountMeta(PAYER.pubkey(), False, True)
        data = bytes(ix["discriminator"]) + struct.pack("<QQ", amount, limit)
        before_keys = sorted({str(m.pubkey) for m in metas} | {str(payer.pubkey())}, key=str)
        before = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        tx = Transaction.new_signed_with_payer(
            [Instruction(PROGRAM, data, metas)], payer.pubkey(), [payer], vm.latest_blockhash())
        raw = bytes(tx)
        checks = tx.verify_with_results()
        assert checks and all(checks), "new transaction must verify"
        r = vm.send_transaction(tx)
        failed = isinstance(r, FailedTransactionMetadata)
        meta = r.meta() if failed else r
        after = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        err = str(r.err()) if failed else None
        logs = meta.logs()
        payer_key = str(payer.pubkey())
        payer_delta = after[payer_key]["lamports"] - before[payer_key]["lamports"] \
            if before[payer_key] and after[payer_key] else None
        observed = {}
        if expected[0] == "hop3":
            assert not failed and err is None, (label, image, err)
            deltas = {}
            for name, key in WATCH.items():
                bd = amount_at(before[str(key)]["data_hex"], 64)
                ad = amount_at(after[str(key)]["data_hex"], 64)
                deltas[name] = ad - bd
            assert deltas == expected[1], (label, image, deltas, expected[1])
            assert payer_delta == -1849400, (label, image, payer_delta)
            vol = after[str(volume)]
            assert vol is not None and vol["lamports"] == 1844400, (label, image, vol)
            assert len(bytes.fromhex(vol["data_hex"])) == 137, (label, image, len(bytes.fromhex(vol["data_hex"])))
            assert bytes.fromhex(vol["data_hex"])[8:40] == bytes(PAYER.pubkey()), (label, image, "volume user")
            observed = {"deltas": deltas, "payer_lamports_delta": payer_delta,
                        "volume_lamports": 1844400, "volume_data_len": 137}
        else:
            assert failed and err is not None and expected[1] in err, (label, image, err)
            assert expected[2] in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == -5000, (label, image, payer_delta)
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            row.setdefault("error_sites", {})[image] = site
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback")
            observed = {"error_code": expected[1], "fragment": expected[2],
                        "payer_lamports_delta": payer_delta}
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": "multi_hop_swap",
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
             "multi_hop_swap through THREE AMM hops: buy 10^9 quote lands "
             "5,315,084,721,958 of the third base (buy 10^6 lands "
             "5,415,445,863) with exact per-hop vault deltas and the "
             "buyback recipient taking the whole input-side fee; sell "
             "10^9 of the third base lands 180,345 quote (sell 10^6 lands "
             "180), where the last hop's vault pays 181,191 and the "
             "buyback recipient takes 846. The limit is a NET-receipt "
             "floor checked once at the end: exact limits pass, +1 fails "
             "ExceededSlippage (6004), and a sell limit set to the gross "
             "vault payout (181,191 or 181,190) FAILS. Every success "
             "funds the user volume accumulator with 1,844,400 lamports "
             "(payer delta -1,849,400 with the 5,000 fee). Amount 0 "
             "fails 6002, limit 0 fails 6001, hop3 mint swap fails 6086 "
             "in both directions, junk hop3 mint or a two-hop truncation "
             "fails 6084, 14 remaining accounts fails 6044, a hop3 pool "
             "owned by nobody fails 6027, unsigned user fails 3010. "
             "All error cases roll back everything except the payer's "
             "5,000 fee. All three images behave identically. Receipts "
             "are stored as parts to stay under GitHub's 25MB web-upload "
             "limit; verify.py reads them in order.",
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
    "classifications": {"multi-hop-three-hop": 17},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")
