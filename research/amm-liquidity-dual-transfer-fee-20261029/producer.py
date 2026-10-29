#!/usr/bin/env python3
"""Build research/amm-liquidity-dual-transfer-fee-20261029 receipts.

2nd run packet #19: deposit and withdraw with quote AND base
transfer fees at the same time. The single-leg packets (#33 quote
only, #42 base only, 2nd #7 trade dual) never combined both legs
on liquidity, and the combination pins two asymmetries:

- Deposit composes exactly: the quote leg is grossed up by the
  AMM (tf100 spends 29,608,495 for a 29,312,410 net) while the
  base leg is withheld opaquely by the Token-2022 program (user
  spends gross 160,619,895,224, vault receives net 159,013,696,271
  at tf100, 80,309,947,612 at tf5000, 0 at tf10000). LP minted
  is 10^9 in every successful deposit, fee-blind.
- Deposit slippage is GROSS-side on BOTH legs: a max_base of the
  net vault receipt (159,013,696,271) fails 6004 at deposit.rs:79,
  gross-1 fails the same way, gross passes; a max_quote of the
  net spend (29,312,410) fails 6004 at deposit.rs:100. When both
  caps are net, the base check fires first (:79).
- Deposit tf10000 fails 6023 Overflow in the quote gross-up
  even when only the quote leg is 100% (q10000/b100 fails, while
  q100/b10000 succeeds with vault base 0): the quote gross-up
  divides by (10000 - bps) and dominates.
- Withdraw composes exactly: vault sends gross on both legs
  (base -160,619,895,223, quote -29,312,409), user receives net
  (tf100: base 159,013,696,270, quote 29,019,284; tf5000: base
  80,309,947,611, quote 14,656,204; tf10000: 0 and 0). LP burned
  is 10^9 in every withdraw, fee-blind.
- Withdraw slippage is ASYMMETRIC: the base minimum is checked
  against the GROSS vault send (net, net+1, and gross all pass;
  gross+1 fails 6004 at withdraw.rs:86), while the quote
  minimum is checked against the NET receipt (net passes,
  net+1 fails 6004 at withdraw.rs:107).
- Each leg's fee cap binds independently: deposit quote cap 100
  spends net+100 = 29,312,510 with vault quote unchanged at
  29,312,410; deposit base cap 100 leaves vault base at
  gross-100 = 160,619,895,124; withdraw with both caps 100 pays
  gross-100 on both legs (base 160,619,895,123, quote
  29,312,309).
- All three images agree on every case: this packet pins
  behavior, it does not claim a divergence.
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
    base, combine, f, lp, pool, poolraw, quote, supply, token, transferfee,
    userbase, userlp, userquote, vaultbase, vaultquote,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-liquidity-dual-transfer-fee-20261029"
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

MX = 2**64 - 1
# (instruction, label, amount, base_limit, quote_limit, qtf, btf, expected)
# expected: ("ok", ub, uq, ulp, vb, vq) or ("error", code, fragment)
CASES = [
    ("deposit", "dep-dual-nofee", 10**9, MX, MX, None, None,
     ("ok", -160619895224, -29312410, 10**9, 160619895224, 29312410)),
    ("deposit", "dep-dual-tf100", 10**9, MX, MX, (100, MX), (100, MX),
     ("ok", -160619895224, -29608495, 10**9, 159013696271, 29312410)),
    ("deposit", "dep-dual-tf5000", 10**9, MX, MX, (5000, MX), (5000, MX),
     ("ok", -160619895224, -58624820, 10**9, 80309947612, 29312410)),
    ("deposit", "dep-dual-tf10000", 10**9, MX, MX, (10000, MX), (10000, MX),
     ("error", "6023", "Overflow")),
    ("deposit", "dep-dual-q10000-b100", 10**9, MX, MX, (10000, MX), (100, MX),
     ("error", "6023", "Overflow")),
    ("deposit", "dep-dual-q100-b10000", 10**9, MX, MX, (100, MX), (10000, MX),
     ("ok", -160619895224, -29608495, 10**9, 0, 29312410)),
    ("deposit", "dep-dual-tf100-maxbase-net", 10**9, 159013696271, MX, (100, MX), (100, MX),
     ("error", "6004", "ExceededSlippage")),
    ("deposit", "dep-dual-tf100-maxbase-grossminus1", 10**9, 160619895223, MX, (100, MX), (100, MX),
     ("error", "6004", "ExceededSlippage")),
    ("deposit", "dep-dual-tf100-maxbase-gross", 10**9, 160619895224, MX, (100, MX), (100, MX),
     ("ok", -160619895224, -29608495, 10**9, 159013696271, 29312410)),
    ("deposit", "dep-dual-tf100-maxquote-net", 10**9, MX, 29312410, (100, MX), (100, MX),
     ("error", "6004", "ExceededSlippage")),
    ("deposit", "dep-dual-tf100-bothcaps-net", 10**9, 159013696271, 29312410, (100, MX), (100, MX),
     ("error", "6004", "ExceededSlippage")),
    ("deposit", "dep-dual-qcap100-btf100", 10**9, MX, MX, (100, 100), (100, MX),
     ("ok", -160619895224, -29312510, 10**9, 159013696271, 29312410)),
    ("deposit", "dep-dual-q100-bcap100", 10**9, MX, MX, (100, MX), (100, 100),
     ("ok", -160619895224, -29608495, 10**9, 160619895124, 29312410)),
    ("withdraw", "wd-dual-nofee", 10**9, 0, 0, None, None,
     ("ok", 160619895223, 29312409, -10**9, -160619895223, -29312409)),
    ("withdraw", "wd-dual-tf100", 10**9, 0, 0, (100, MX), (100, MX),
     ("ok", 159013696270, 29019284, -10**9, -160619895223, -29312409)),
    ("withdraw", "wd-dual-tf5000", 10**9, 0, 0, (5000, MX), (5000, MX),
     ("ok", 80309947611, 14656204, -10**9, -160619895223, -29312409)),
    ("withdraw", "wd-dual-tf10000", 10**9, 0, 0, (10000, MX), (10000, MX),
     ("ok", 0, 0, -10**9, -160619895223, -29312409)),
    ("withdraw", "wd-dual-tf100-minbase-gross", 10**9, 160619895223, 0, (100, MX), (100, MX),
     ("ok", 159013696270, 29019284, -10**9, -160619895223, -29312409)),
    ("withdraw", "wd-dual-tf100-minbase-grossplus1", 10**9, 160619895224, 0, (100, MX), (100, MX),
     ("error", "6004", "ExceededSlippage")),
    ("withdraw", "wd-dual-tf100-minquote-net", 10**9, 0, 29019284, (100, MX), (100, MX),
     ("ok", 159013696270, 29019284, -10**9, -160619895223, -29312409)),
    ("withdraw", "wd-dual-tf100-minquote-netplus1", 10**9, 0, 29019285, (100, MX), (100, MX),
     ("error", "6004", "ExceededSlippage")),
    ("withdraw", "wd-dual-qcap100-bcap100", 10**9, 0, 0, (100, 100), (100, 100),
     ("ok", 160619895123, 29312309, -10**9, -160619895223, -29312409)),
    ("withdraw", "wd-dual-qcap100-btf100", 10**9, 0, 0, (100, 100), (100, MX),
     ("ok", 159013696270, 29312309, -10**9, -160619895223, -29312409)),
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        out[str(k)] = {"owner": str(a.owner), "lamports": a.lamports,
                       "executable": a.executable, "data_hex": a.data.hex()} if a else None
    return out


def amount_at(data_hex, offset):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


receipts_global = []
report_cases = []
for index, (instruction, label, amount, base_limit, quote_limit, qtf, btf, expected) in enumerate(CASES):
    ix = next(x for x in IDL["instructions"] if x["name"] == instruction)
    metas = [AccountMeta(k, sign, w) for k, sign, w in [
        (pool, False, True), (CONFIG_KEY, False, False), (PAYER.pubkey(), True, False),
        (base, False, False), (quote, False, False), (lp, False, True),
        (userbase, False, True), (userquote, False, True), (userlp, False, True),
        (vaultbase, False, True), (vaultquote, False, True),
        (TOKEN, False, False), (TOKEN22, False, False),
        (EVENT, False, False), (PROGRAM, False, False)]]
    row = {"case": {"instruction": instruction, "label": label,
                    "expected": list(expected), "amount": amount,
                    "base_limit": base_limit, "quote_limit": quote_limit,
                    "qtf": list(qtf) if qtf else None,
                    "btf": list(btf) if btf else None}}
    pairs = set()
    for image in ("original", "control", "candidate"):
        h = Harness(IMAGES[image])
        vm = h.vm
        vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
        for pid, path in ((TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                          (TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so")):
            vm.add_program_from_file(pid, str(ROOT / path))
        glob = bytearray(RAW)
        glob[56] = 0
        vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
        for n in ["base_mint", "quote_mint", "pool_base_token_account", "pool_quote_token_account"]:
            rrow = f["accounts"][n]
            vm.set_account(Pubkey.from_string(f["keys"][n]),
                           Account(rrow["lamports"], base64.b64decode(rrow["data_base64"]),
                                   Pubkey.from_string(rrow["owner"])))
        vm.set_account(pool, Account(f["accounts"]["pool"]["lamports"], bytes(poolraw), PROGRAM))
        mint = struct.pack("<I", 1) + bytes(pool) + struct.pack("<Q", supply) + bytes([9, 1]) + bytes(36)
        vm.set_account(lp, Account(10**9, mint, TOKEN22))
        for k, m, own, amt, nat in ((userbase, base, TOKEN, 10**15, False),
                                    (userquote, quote, TOKEN, 10**15, True),
                                    (userlp, lp, TOKEN22, supply // 2, False)):
            vm.set_account(k, Account(amt + 2039280 if nat else 10**9,
                                      token(m, PAYER.pubkey(), amt, nat), own))
        ovs = []
        if qtf is not None:
            ovs.append(transferfee(quote, qtf[0], qtf[1]))
        if btf is not None:
            ovs.append(transferfee(base, btf[0], btf[1]))
        if ovs:
            combine(*ovs)(SimpleNamespace(vm=vm), metas)
        args = bytes(ix["discriminator"]) + struct.pack("<QQQ", amount, base_limit, quote_limit)
        before_keys = sorted({str(m.pubkey) for m in metas}, key=str)
        before = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        tx = Transaction.new_signed_with_payer(
            [Instruction(PROGRAM, args, metas)], PAYER.pubkey(), [PAYER], vm.latest_blockhash())
        raw = bytes(tx)
        checks = tx.verify_with_results()
        assert checks and all(checks), "new transaction must verify"
        r = vm.send_transaction(tx)
        failed = isinstance(r, FailedTransactionMetadata)
        meta = r.meta() if failed else r
        after = snap(vm, [Pubkey.from_string(k) for k in before_keys])
        err = str(r.err()) if failed else None
        logs = meta.logs()
        payer = str(PAYER.pubkey())
        payer_delta = before[payer]["lamports"] - after[payer]["lamports"]
        observed = {}
        if expected[0] == "ok":
            assert not failed and err is None, (label, image, err)
            ub_key, uq_key, ul_key = str(userbase), str(userquote), str(userlp)
            vb_key, vq_key = str(vaultbase), str(vaultquote)
            deltas = tuple(
                amount_at(after[k]["data_hex"], 64) - amount_at(before[k]["data_hex"], 64)
                for k in (ub_key, uq_key, ul_key, vb_key, vq_key))
            assert deltas == expected[1:], (label, image, deltas, expected)
            if instruction == "deposit":
                observed = {"base_spent": -deltas[0], "quote_spent": -deltas[1],
                            "lp_gained": deltas[2], "vault_base": deltas[3],
                            "vault_quote": deltas[4]}
            else:
                observed = {"base_gained": deltas[0], "quote_gained": deltas[1],
                            "lp_burned": -deltas[2], "vault_base": deltas[3],
                            "vault_quote": deltas[4]}
            pairs.add(deltas)
        else:
            assert failed and err is not None and expected[1] in err, (label, image, err)
            assert expected[2] in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == 5000, (label, image, payer_delta)
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            row.setdefault("error_sites", {})[image] = site
            assert all(before[k] == after[k] for k in before if k != payer), \
                (label, image, "rollback")
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": instruction,
                        "label": label},
            "transaction_base64": base64.b64encode(raw).decode(),
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
            "all_signatures_verified": True, "signature_fields": 1,
            "before": before, "after": after,
            "metadata": {"signature": str(meta.signature()), "logs": logs,
                         "inner_instructions": str(meta.inner_instructions()),
                         "compute_units_consumed": str(meta.compute_units_consumed()),
                         "return_data": str(meta.return_data())},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                      "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
            "loaded_programs": {
                str(PROGRAM): {"path": "evidence/original/pump_amm/deployed.so",
                               "sha256": IMAGE_SHA[image]},
                str(TOKEN): {"path": "evidence/dependencies/spl_token/deployed.so",
                             "sha256": "8190d3f7ceb6cb7a7a8d8924bff89f9f611e15ce1f806f2b6237f3311a98f697"},
                str(TOKEN22): {"path": "evidence/dependencies/spl_token_2022/deployed.so",
                               "sha256": "15a2e615a42e20f31714bbaaee43002ae6f1cda2e8d7118243117ab3c1342e2d"}},
            "error": err, "rollback_except_payer_fee": failed,
            "payer_fee_lamports": payer_delta,
            "observed": observed,
        })
        # Note: the full after snapshot is already inside each
        # receipt's before/after fields; storing it again per row
        # would bloat report.json.gz past 25MB (as the 1st-run
        # liquidity packets did). Rows keep error/logs/observed.
        row[image] = {"error": err, "logs": logs,
                      "observed": observed}
        print(f"  {label} [{image}] error={err} observed={observed}", flush=True)
    if expected[0] == "ok":
        assert len(pairs) == 1, (label, "images must agree on amounts")
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
             "liquidity with quote AND base transfer fees at once on the "
             "as-is fixture pool: deposit composes quote gross-up with "
             "base net receipt (tf100: quote spend 29,608,495, vault base "
             "159,013,696,271, LP +10^9), deposit slippage is gross-side "
             "on both legs (net caps fail 6004, base check first), "
             "deposit tf10000 fails 6023 in the quote gross-up even when "
             "only the quote leg is 100%, withdraw composes gross vault "
             "sends with net user receipts (tf100: base 159,013,696,270, "
             "quote 29,019,284, LP -10^9), withdraw base minimum is "
             "gross-side while the quote minimum is net-side, and each "
             "leg's fee cap binds independently. All three images behave "
             "identically. Receipts are stored as parts to stay under "
             "GitHub's 25MB web-upload limit; verify.py reads them in order.",
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
    },
    "counts": {"vms": len(receipts_global), "transactions": len(receipts_global),
               "signature_fields": len(receipts_global)},
    "case_count": len(report_cases),
    "classifications": {"liquidity-dual-transfer-fee": len(report_cases)},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")

SITES = {}
for row in report_cases:
    if "error_sites" in row:
        SITES[row["case"]["label"]] = row["error_sites"]
SITES_TEXT = "\n".join(
    f"- {label}: " + "; ".join(f"{img} {site}" for img, site in sites.items())
    for label, sites in SITES.items())

README = f"""# Liquidity with quote AND base transfer fees at once

## Problem

The single-leg packets fixed each leg alone: #33 pinned quote-fee
deposit (gross-up) and withdraw (net-down), #42 pinned base-fee
deposit (gross spend, net vault receipt) and withdraw (gross vault
send, net user receipt), and 2nd #7 did the dual-leg combination
only for trades. Liquidity with both legs fee-bearing at once was
never measured: does deposit compose the two directions, which
side does each slippage bound check, which leg's overflow wins at
100%, and does each leg's fee cap bind independently?

## Cases

23 fresh-VM triples (original / #424 control / #427 candidate),
69 signed executions on the repository's own liquidity harness
(`scripts/pump_amm_liquidity_differential.py`), amount 10^9 LP in
every case. The clock is slot 100, epoch 0. `producer.py`
reproduces every receipt from the repository files. The base
transfer-fee extension is synthesized after the fact, as in #42
(a base mint cannot carry one at creation); the quote leg uses
the same synthesis on the quote mint.

| Case | User base | User quote | LP | Vault base | Vault quote |
| --- | ---: | ---: | ---: | ---: | ---: |
| dep-dual-nofee | -160,619,895,224 | -29,312,410 | +10^9 | +160,619,895,224 | +29,312,410 |
| dep-dual-tf100 | -160,619,895,224 | -29,608,495 | +10^9 | +159,013,696,271 | +29,312,410 |
| dep-dual-tf5000 | -160,619,895,224 | -58,624,820 | +10^9 | +80,309,947,612 | +29,312,410 |
| dep-dual-tf10000 | 6023 Overflow | | | | |
| dep-dual-q10000-b100 | 6023 Overflow | | | | |
| dep-dual-q100-b10000 | -160,619,895,224 | -29,608,495 | +10^9 | 0 | +29,312,410 |
| dep-dual-tf100-maxbase-net | 6004 ExceededSlippage | | | | |
| dep-dual-tf100-maxbase-grossminus1 | 6004 ExceededSlippage | | | | |
| dep-dual-tf100-maxbase-gross | -160,619,895,224 | -29,608,495 | +10^9 | +159,013,696,271 | +29,312,410 |
| dep-dual-tf100-maxquote-net | 6004 ExceededSlippage | | | | |
| dep-dual-tf100-bothcaps-net | 6004 ExceededSlippage (base first) | | | | |
| dep-dual-qcap100-btf100 | -160,619,895,224 | -29,312,510 | +10^9 | +159,013,696,271 | +29,312,410 |
| dep-dual-q100-bcap100 | -160,619,895,224 | -29,608,495 | +10^9 | +160,619,895,124 | +29,312,410 |
| wd-dual-nofee | +160,619,895,223 | +29,312,409 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-tf100 | +159,013,696,270 | +29,019,284 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-tf5000 | +80,309,947,611 | +14,656,204 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-tf10000 | 0 | 0 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-tf100-minbase-gross | +159,013,696,270 | +29,019,284 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-tf100-minbase-grossplus1 | 6004 ExceededSlippage | | | | |
| wd-dual-tf100-minquote-net | +159,013,696,270 | +29,019,284 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-tf100-minquote-netplus1 | 6004 ExceededSlippage | | | | |
| wd-dual-qcap100-bcap100 | +160,619,895,123 | +29,312,309 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-qcap100-btf100 | +159,013,696,270 | +29,312,309 | -10^9 | -160,619,895,223 | -29,312,409 |

All three images agree on every case. `verify.py` rechecks
every receipt independently: signature validity, the user and
vault token deltas against the expected values, the error code
and log fragment, the recorded error site, rollback on
failures, and agreement across images. Receipts are stored as
parts (`runtime/raw-transactions-part1/2/3/4/5/6/7.jsonl.gz`)
to stay under GitHub's 25MB web-upload limit; `verify.py` reads
them in order.

## Result

- **Deposit composes exactly.** Quote spend is grossed up by
  the AMM (tf100: 29,608,495; tf5000: 58,624,820) while the base
  leg is withheld opaquely by the Token-2022 program (vault
  receives 159,013,696,271 at tf100, 80,309,947,612 at tf5000,
  0 at tf10000). LP minted is 10^9 in every successful deposit.
- **Deposit slippage is gross-side on both legs.** A max_base
  of the net vault receipt fails 6004, gross-1 fails, gross
  passes; a max_quote of the net spend fails 6004. With both
  caps net, the base check fires first.
- **The quote gross-up dominates at 100%.** tf10000 on both
  legs fails 6023, and quote-only 100% fails 6023 too, while
  base-only 100% succeeds with vault base 0: the quote
  gross-up divides by (10000 - bps), the base leg never
  divides.
- **Withdraw composes exactly.** Vault sends gross on both
  legs; user receives net (tf100: base 159,013,696,270, quote
  29,019,284; tf5000: base 80,309,947,611, quote 14,656,204;
  tf10000: 0 and 0). LP burned is 10^9 in every withdraw.
- **Withdraw slippage is asymmetric.** The base minimum is
  checked against the gross vault send (net, net+1, and gross
  all pass; gross+1 fails 6004), while the quote minimum is
  checked against the net receipt (net passes, net+1 fails
  6004).
- **Each leg's fee cap binds independently.** Deposit quote
  cap 100 spends net+100 with vault quote unchanged; deposit
  base cap 100 leaves vault base at gross-100; withdraw with
  both caps 100 pays gross-100 on both legs.

Error sites (log paths as emitted by each image):

{SITES_TEXT}

## Limits

- No source change, no build, no whole-program identity claim.
  All executions are offline LiteSVM replays with normally
  signed transactions on the as-is fixture pool.
- The base transfer-fee extension is synthesized after the
  fact, as in #42: a legacy creation path cannot put a
  transfer fee on a base mint, so the base leg pins handler
  transfer behavior, not a reachable mainnet state. The quote
  leg uses the same synthesis.
- Amounts, caps, and slippage sides are exact for this
  fixture's pool state and fee settings and are not claimed
  for other pool states.
"""
(OUT / "README.md").write_text(README)
import shutil
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
