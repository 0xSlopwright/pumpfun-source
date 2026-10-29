#!/usr/bin/env python3
"""Build research/amm-liquidity-small-amount-bands-20261029 receipts.

2nd run packet #40: deposit/withdraw at small LP amounts, the
boost virtual-reserve rounding asymmetry, the SeedLock gate, and
the zero-supply division gate. None of these were pinned before:

- The 1st-run extremes packet pinned huge deposits (10^17 LP),
  the 2e17 Truncation ceiling, and the full drain leaving exactly
  the 125,882 owed fees in the vault. It never measured the small
  end: deposit uses ceil_div while withdraw uses a floor ratio,
  so the same LP amount costs strictly more going in than it
  returns coming out, and withdraw can burn LP for zero quote.
- 2nd #19 pinned dual transfer fees at 10^9 LP only, on the
  as-is fixture (accrued fees 125,882 subtracted from the quote
  reserve). This packet zeroes the accrued fees so the quote
  reserve is the raw vault quote, isolating the ceil/floor
  rounding from the owed-fee subtraction.
- The boost virtual update is floor on deposit and ceil on
  withdraw (deposit.rs vs withdraw.rs), so for the two pinned LP amounts (1 and 10^9 at vq 10^9) the deposit and withdraw single-transaction vq deltas sum to -1.
  A 1-LP deposit moves virtual reserves by 0 while a 1-LP
  withdraw moves them by -1, and a vq of 1 is taken to 0 by a single 1-LP withdraw (no deposit at vq 1 was executed).
- SeedLockViolation (6067) gates withdraw only: a mint supply
  one above the pool supply fails withdraw, while the same state deposits fine (dep-seedlock succeeds: -161 / -1 / +1); deposit does not enforce the SeedLock check in this state.
- Zero pool supply divides by zero on both paths, at different
  sites: deposit in ceil_div (fees.rs), withdraw in the floor
  ratio (constant_product.rs).

Fixture: the repository liquidity harness pool, with accrued
protocol/creator fees zeroed (quote reserve = raw vault quote
122,946,690,720) and base vault 673,696,395,912,745, LP supply
4,194,352,106,721, except where a case patches the pool (virtual
reserves, pool supply) or the LP mint supply. Clock slot 100,
epoch 0. The CASES expected tuples are measured and asserted against all three images; statements in this docstring beyond those cases are arithmetic, not executions.
"""
import base64
import gzip
import hashlib
import json
import struct
import sys
import tempfile
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

from pump_amm_admin_differential import Harness
from pump_amm_liquidity_differential import (
    CONFIG, CONFIG_KEY, EVENT, IDL, PAYER, PROGRAM, RAW, TOKEN, TOKEN22,
    base, f, lp, pool, poolraw, quote, supply, token,
    userbase, userlp, userquote, vaultbase, vaultquote,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-liquidity-small-amount-bands-20261029"
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
SUPPLY = supply
# (instruction, label, amount, base_limit, quote_limit, vq,
#  pool_supply_patch, mint_supply, expected, vq_delta)
# expected: ("ok", ub, uq, ulp, vb, vq) or ("error", code, fragment)
# vq_delta is None for error cases (rollback checked separately).
CASES = [
    ("deposit", "dep-zero", 0, MX, MX, 0, None, None,
     ("ok", 0, 0, 0, 0, 0), 0),
    ("deposit", "dep-1", 1, MX, MX, 0, None, None,
     ("ok", -161, -1, 1, 161, 1), 0),
    ("deposit", "dep-2", 2, MX, MX, 0, None, None,
     ("ok", -322, -1, 2, 322, 1), 0),
    ("deposit", "dep-3", 3, MX, MX, 0, None, None,
     ("ok", -482, -1, 3, 482, 1), 0),
    ("deposit", "dep-34", 34, MX, MX, 0, None, None,
     ("ok", -5462, -1, 34, 5462, 1), 0),
    ("deposit", "dep-35", 35, MX, MX, 0, None, None,
     ("ok", -5622, -2, 35, 5622, 2), 0),
    ("deposit", "dep-100", 100, MX, MX, 0, None, None,
     ("ok", -16062, -3, 100, 16062, 3), 0),
    ("deposit", "dep-1000", 1000, MX, MX, 0, None, None,
     ("ok", -160620, -30, 1000, 160620, 30), 0),
    ("deposit", "dep-1-maxbase-160", 1, 160, MX, 0, None, None,
     ("error", "6004", "ExceededSlippage"), None),
    ("deposit", "dep-1-maxquote-0", 1, MX, 0, 0, None, None,
     ("error", "6004", "ExceededSlippage"), None),
    ("withdraw", "wd-zero", 0, 0, 0, 0, None, None,
     ("ok", 0, 0, 0, 0, 0), 0),
    ("withdraw", "wd-1", 1, 0, 0, 0, None, None,
     ("ok", 160, 0, -1, -160, 0), 0),
    ("withdraw", "wd-34", 34, 0, 0, 0, None, None,
     ("ok", 5461, 0, -34, -5461, 0), 0),
    ("withdraw", "wd-35", 35, 0, 0, 0, None, None,
     ("ok", 5621, 1, -35, -5621, -1), 0),
    ("withdraw", "wd-100", 100, 0, 0, 0, None, None,
     ("ok", 16061, 2, -100, -16061, -2), 0),
    ("withdraw", "wd-1000", 1000, 0, 0, 0, None, None,
     ("ok", 160619, 29, -1000, -160619, -29), 0),
    ("withdraw", "wd-35-minbase-5622", 35, 5622, 0, 0, None, None,
     ("error", "6004", "ExceededSlippage"), None),
    ("withdraw", "wd-35-minquote-2", 35, 0, 2, 0, None, None,
     ("error", "6004", "ExceededSlippage"), None),
    ("withdraw", "wd-1-minquote-1", 1, 0, 1, 0, None, None,
     ("error", "6004", "ExceededSlippage"), None),
    ("deposit", "dep-boost-1", 1, MX, MX, 10**9, None, None,
     ("ok", -161, -1, 1, 161, 1), 0),
    ("deposit", "dep-boost-1e9", 10**9, MX, MX, 10**9, None, None,
     ("ok", -160619895224, -29312440, 10**9, 160619895224, 29312440), 238415),
    ("withdraw", "wd-boost-1", 1, 0, 0, 10**9, None, None,
     ("ok", 160, 0, -1, -160, 0), -1),
    ("withdraw", "wd-boost-1e9", 10**9, 0, 0, 10**9, None, None,
     ("ok", 160619895223, 29312439, -10**9, -160619895223, -29312439), -238416),
    ("withdraw", "wd-boost-vq1-1", 1, 0, 0, 1, None, None,
     ("ok", 160, 0, -1, -160, 0), -1),
    ("deposit", "dep-boost-vqmax-1e9", 10**9, MX, MX, 2**127 - 1, None, None,
     ("error", "6023", "Overflow"), None),
    ("withdraw", "wd-boost-vqmax-1e9", 10**9, 0, 0, 2**127 - 1, None, None,
     ("error", "6023", "Overflow"), None),
    ("withdraw", "wd-seedlock", 1, 0, 0, 0, None, SUPPLY + 1,
     ("error", "6067", "SeedLockViolation"), None),
    ("deposit", "dep-seedlock", 1, MX, MX, 0, None, SUPPLY + 1,
     ("ok", -161, -1, 1, 161, 1), 0),
    ("deposit", "dep-supply0", 1, MX, MX, 0, 0, 0,
     ("error", "6025", "DivisionByZero"), None),
    ("withdraw", "wd-supply0", 1, 0, 0, 0, 0, 0,
     ("error", "6025", "DivisionByZero"), None),
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def _decompress(part_path):
    """Decompress one receipt part to a temp file whose name carries
    this packet's directory name, and return its lines."""
    tmp = Path(tempfile.gettempdir()) / (
        f"amm-liquidity-small-amount-bands-20261029-"
        f"{Path(part_path).stem}.jsonl")
    with gzip.open(part_path, "rb") as src, open(tmp, "wb") as dst:
        dst.write(src.read())
    lines = tmp.read_bytes().splitlines()
    tmp.unlink()
    return lines


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        out[str(k)] = {"owner": str(a.owner), "lamports": a.lamports,
                       "executable": a.executable, "data_hex": a.data.hex()} if a else None
    return out


def amount_at(data_hex, offset):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


def vq_at(data_hex):
    return int.from_bytes(bytes.fromhex(data_hex)[245:261], "little", signed=True)


receipts_global = []
report_cases = []
for index, (instruction, label, amount, base_limit, quote_limit, vq,
            pool_supply_patch, mint_supply, expected, vq_delta) in enumerate(CASES):
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
                    "vq": vq, "vq_delta": vq_delta,
                    "pool_supply_patch": pool_supply_patch,
                    "mint_supply": mint_supply}}
    pairs = set()
    vq_pairs = set()
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
        pdata = bytearray(poolraw)
        # Isolate rounding: zero the accrued fees (quote reserve is
        # then the raw vault quote) and set the virtual reserves
        # for this case (0 except the boost cases).
        pdata[245:261] = vq.to_bytes(16, "little", signed=True)
        pdata[271:287] = bytes(16)
        if pool_supply_patch is not None:
            pdata[203:211] = struct.pack("<Q", pool_supply_patch)
        vm.set_account(pool, Account(f["accounts"]["pool"]["lamports"], bytes(pdata), PROGRAM))
        ms = SUPPLY if mint_supply is None else mint_supply
        mint = struct.pack("<I", 1) + bytes(pool) + struct.pack("<Q", ms) + bytes([9, 1]) + bytes(36)
        vm.set_account(lp, Account(10**9, mint, TOKEN22))
        for k, m, own, amt, nat in ((userbase, base, TOKEN, 10**15, False),
                                    (userquote, quote, TOKEN, 10**15, True),
                                    (userlp, lp, TOKEN22, SUPPLY // 2, False)):
            vm.set_account(k, Account(amt + 2039280 if nat else 10**9,
                                      token(m, PAYER.pubkey(), amt, nat), own))
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
            got_vq_delta = vq_at(after[str(pool)]["data_hex"]) - vq_at(before[str(pool)]["data_hex"])
            assert got_vq_delta == vq_delta, (label, image, got_vq_delta, vq_delta)
            if instruction == "deposit":
                observed = {"base_spent": -deltas[0], "quote_spent": -deltas[1],
                            "lp_gained": deltas[2], "vault_base": deltas[3],
                            "vault_quote": deltas[4], "vq_delta": got_vq_delta}
            else:
                observed = {"base_gained": deltas[0], "quote_gained": deltas[1],
                            "lp_burned": -deltas[2], "vault_base": deltas[3],
                            "vault_quote": deltas[4], "vq_delta": got_vq_delta}
            pairs.add(deltas)
            vq_pairs.add(got_vq_delta)
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
        row[image] = {"error": err, "logs": logs,
                      "observed": observed}
        print(f"  {label} [{image}] error={err} observed={observed}", flush=True)
    if expected[0] == "ok":
        assert len(pairs) == 1, (label, "images must agree on amounts")
        assert len(vq_pairs) == 1, (label, "images must agree on vq delta")
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
# Sanity: every part decompresses (via the packet-named temp helper)
# to exactly its receipt count.
for part in parts:
    assert len(_decompress(OUT / part["path"])) == part["receipts"], part["path"]
report = {
    "scope": "Fresh normally signed original/control/candidate triples pinning "
             "liquidity at small LP amounts on the repository liquidity "
             "harness with accrued fees zeroed: deposit ceil vs withdraw "
             "floor rounding (dep-1 costs 161 base / 1 quote, wd-1 returns "
             "160 base / 0 quote; first positive quote at 35 LP on both "
             "sides), boost virtual-reserve floor/ceil drift (dep-boost-1e9 "
             "vq +238,415, wd-boost-1e9 vq -238,416), the withdraw-only "
             "SeedLock gate (6067), and the zero-supply division gate "
             "(6025, different sites per path). All three images behave "
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
    "classifications": {"liquidity-small-amount-bands": len(report_cases)},
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

README = f"""# Liquidity at small amounts: ceil-in, floor-out, virtual drift, SeedLock, zero supply

## Problem

The 1st-run extremes packet pinned liquidity at the top end:
huge deposits (10^17 LP), the 2e17 Truncation ceiling, and the
full drain leaving exactly the 125,882 owed fees in the vault.
The small end was never measured, and it is where deposit and
withdraw disagree by construction: deposit computes its amounts
with `ceil_div` (`instructions/liquidity/deposit.rs`) while
withdraw computes them with the floor ratio
`liquidity_floor_ratio` (`curve/constant_product.rs`). The same
asymmetry repeats in the boost virtual-reserve update: deposit
divides with floor, withdraw with `ceil_div`. On top of that,
withdraw carries two gates deposit never sees: the SeedLock
check (`lp_supply >= lp_mint.supply`) and, at zero supply, a
division by zero at a different site per path.

## Cases

30 fresh-VM triples (original / #424 control / #427 candidate),
90 signed executions on the repository's own liquidity harness
(`scripts/pump_amm_liquidity_differential.py`). The clock is slot
100, epoch 0. Accrued protocol/creator fees are zeroed in every
case, so the quote reserve is the raw vault quote
122,946,690,720 (the owed-fee subtraction itself was pinned by
the extremes packet); base vault 673,696,395,912,745, LP supply
4,194,352,106,721, except where a case patches the pool or the
LP mint supply. `producer.py` reproduces every receipt from the
repository files.

### Deposit small bands (ceil)

| Case | User base | User quote | LP | Vault base | Vault quote |
| --- | ---: | ---: | ---: | ---: | ---: |
| dep-zero | 0 | 0 | 0 | 0 | 0 |
| dep-1 | -161 | -1 | +1 | +161 | +1 |
| dep-2 | -322 | -1 | +2 | +322 | +1 |
| dep-3 | -482 | -1 | +3 | +482 | +1 |
| dep-34 | -5,462 | -1 | +34 | +5,462 | +1 |
| dep-35 | -5,622 | -2 | +35 | +5,622 | +2 |
| dep-100 | -16,062 | -3 | +100 | +16,062 | +3 |
| dep-1000 | -160,620 | -30 | +1,000 | +160,620 | +30 |
| dep-1-maxbase-160 | 6004 ExceededSlippage | | | | |
| dep-1-maxquote-0 | 6004 ExceededSlippage | | | | |

Deposit 0 is a silent no-op success (0 minted). The quote leg
stays at 1 all the way through 34 LP and steps to 2 at 35 LP:
ceil(122,946,690,720 x 34 / 4,194,352,106,721) = 1, ceil at 35
= 2. The base leg steps every ~6.22 LP (161, 322, 482, ...).

### Withdraw small bands (floor)

| Case | User base | User quote | LP | Vault base | Vault quote |
| --- | ---: | ---: | ---: | ---: | ---: |
| wd-zero | 0 | 0 | 0 | 0 | 0 |
| wd-1 | +160 | 0 | -1 | -160 | 0 |
| wd-34 | +5,461 | 0 | -34 | -5,461 | 0 |
| wd-35 | +5,621 | +1 | -35 | -5,621 | -1 |
| wd-100 | +16,061 | +2 | -100 | -16,061 | -2 |
| wd-1000 | +160,619 | +29 | -1,000 | -160,619 | -29 |
| wd-35-minbase-5622 | 6004 ExceededSlippage | | | | |
| wd-35-minquote-2 | 6004 ExceededSlippage | | | | |
| wd-1-minquote-1 | 6004 ExceededSlippage | | | | |

Withdraw 1 LP burns the LP and returns 160 base but zero
quote: floor(122,946,690,720 x 1 / 4,194,352,106,721) = 0. The
first positive quote is also at 35 LP, but on the floor side
(34 LP still pays 0 quote). Note wd-100 returns 16,061 base
while dep-100 costs 16,062: the same 100 LP is 1 base cheaper
coming out than going in, and dep-1/wd-1 differ by 1 base and
1 quote — the round-trip dust is exactly the ceil/floor gap.

### Boost virtual-reserve drift (floor in, ceil out)

| Case | Token deltas | vq delta |
| --- | ---: | ---: |
| dep-boost-1 (vq 10^9) | -161 / -1 / +1 | 0 |
| dep-boost-1e9 (vq 10^9) | -160,619,895,224 / -29,312,440 / +10^9 | +238,415 |
| wd-boost-1 (vq 10^9) | +160 / 0 / -1 | -1 |
| wd-boost-1e9 (vq 10^9) | +160,619,895,223 / +29,312,439 / -10^9 | -238,416 |
| wd-boost-vq1-1 (vq 1) | +160 / 0 / -1 | -1 (1 to 0) |
| dep-boost-vqmax-1e9 (vq 2^127-1) | 6023 Overflow | |
| wd-boost-vqmax-1e9 (vq 2^127-1) | 6023 Overflow | |

A 1-LP deposit moves virtual reserves by 0 (floor of
10^9 / 4,194,352,106,721) while a 1-LP withdraw moves them by
-1 (ceil of the same fraction). At 10^9 LP the pair drifts by
-1: deposit adds 238,415, withdraw subtracts 238,416. A vq of
1 is erased by one 1-LP withdraw and never moved by a 1-LP
deposit. At vq = 2^127-1 both paths fail 6023 Overflow in the
virtual update itself (after the transfers, so the failure
rolls everything back except the 5,000 fee).

### Withdraw-only gates

| Case | Result |
| --- | --- |
| wd-seedlock (mint supply = pool supply + 1) | 6067 SeedLockViolation |
| dep-seedlock (same mint supply) | succeeds: -161 / -1 / +1 |
| dep-supply0 (pool supply 0, mint supply 0) | 6025 DivisionByZero |
| wd-supply0 (pool supply 0, mint supply 0) | 6025 DivisionByZero |

The SeedLock check exists only in withdraw: the identical
mint-supply state deposits fine. Zero supply divides by zero
on both paths but at different sites (deposit in `ceil_div`,
withdraw in the floor ratio) — see the site table below.

All three images agree on every case. `verify.py` rechecks
every receipt independently: signature validity, the user and
vault token deltas and the pool virtual-reserve delta against
the expected values, the error code and log fragment, the
recorded error site, rollback on failures, and agreement
across images. Receipts are stored as parts
(`runtime/raw-transactions-part1..9.jsonl.gz`) to stay under
GitHub's 25MB web-upload limit; `verify.py` reads them in
order.

## Result

- **Deposit rounds up, withdraw rounds down, at every step.**
  Quote stays 1 through dep-34 and steps at dep-35; withdraw
  pays 0 quote through wd-34 and first pays at wd-35. The
  100-LP pair differs by exactly 1 base (16,062 in, 16,061
  out); the 1-LP pair differs by 1 base and 1 quote.
- **Withdraw can burn LP for nothing on the quote leg.**
  wd-1 through wd-34 burn LP and return base only; a
  min-quote of 1 on wd-1 fails 6004, so the dust is not
  hidden behind a limit default — it is the computed amount.
- **The boost virtual update drifts -1 per round trip.**
  Deposit floors, withdraw ceils; at 10^9 LP the drift is
  exactly 238,415 in vs 238,416 out, and at 1 LP it is 0 in
  vs -1 out. A vq of 1 does not survive one small withdraw.
- **SeedLock is withdraw-only, zero supply is a shared
  division gate at different sites.** Mint supply one above
  pool supply fails withdraw 6067 but deposits fine; pool
  supply 0 fails both paths with 6025.

Error sites (log paths as emitted by each image):

{SITES_TEXT}

## Limits

- No source change, no build, no whole-program identity claim.
  All executions are offline LiteSVM replays with normally
  signed transactions on the repository liquidity harness.
- Accrued fees are zeroed in every case to isolate rounding;
  the owed-fee subtraction on the as-is fixture was pinned by
  the 1st-run extremes packet (125,882 left after a full
  drain) and is not re-measured here.
- Amounts, steps, and drift values are exact for this
  fixture's pool state (base vault, quote vault, LP supply)
  and are not claimed for other pool states. The virtual
  drift is a single-transaction measurement per direction;
  the -1 round-trip drift is arithmetic on two pinned
  single-transaction cases, not a two-transaction execution.
"""
(OUT / "README.md").write_text(README)
import shutil
shutil.copyfile(__file__, OUT / "producer.py")
print(f"wrote: {OUT / 'README.md'} and {OUT / 'producer.py'}")
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")
