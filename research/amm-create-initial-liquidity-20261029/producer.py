#!/usr/bin/env python3
"""Build research/amm-create-initial-liquidity-20261029 receipts.

2nd run packet #45: create_pool's initial-liquidity math, which
no earlier packet pinned. The validation packet (1st #30) pinned
same-mint / zero / vault-owner / duplicate; the creator-gate
packet (1st #13) pinned the trailing creator args; the mode
packet (2nd #28) pinned the mayhem/cashback create gates. None
of them measured what liquidity a fresh pool actually mints.

Source (instructions/create_pool.rs execute()):
- transfers happen FIRST (base_in, quote_in into the pool
  vaults, which are init_if_needed so pre-existing vault
  balances survive), then the vaults are reloaded;
- initial_liquidity(pb, pq) = floor(sqrt(pb * pq)) computed
  in u128, so it cannot overflow for u64 inputs;
- lp_supply = initial_liquidity, and the creator is minted
  output = initial_liquidity - 100 (minimum_liquidity 100).
  The 100 is never minted to anyone: user LP == output,
  LP mint supply == output, pool lp_supply == output + 100;
- liquidity < 100 (checked_sub(100) underflows; output 0 at liquidity exactly 100 succeeds) fails with 6003
  TooLittlePoolTokenLiquidity AFTER the transfers, so the
  failure is only safe because the whole transaction rolls
    back: the pool / LP mint / user LP accounts created during execution are rolled back (absent after the transaction),
  vaults keep their pre-transaction balances, payer -5,000;
- the CreatePoolEvent echoes base_amount_in / quote_amount_in
  (the instruction args) separately from pool_base_amount /
  pool_quote_amount (the post-transfer vault balances), so a
  pre-funded vault makes the two pairs differ;
- fresh-create payer cost is 10,507,640 lamports (pool rent +
  LP mint rent + 3 ATA rents + 5,000 fee); each pre-existing
  vault saves exactly its 2,039,280 ATA rent.
"""
import base64
import gzip
import hashlib
import json
import math
import shutil
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

from pump_amm_admin_differential import Harness
from pump_amm_create_differential import (
    ATA, CONFIG, CONFIG_KEY, EVENT, IDL, PAYER, PROGRAM, RAW, TOKEN,
    TOKEN22, base, f, quote, userbase, userquote,
)
from pump_amm_liquidity_differential import token as token_bytes

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-create-initial-liquidity-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
EVENT_DISC = "b1310cd2a076a774"
FRESH_PAYER = 10507640
VAULT_RENT = 2039280


def sha(data):
    return hashlib.sha256(data).hexdigest()


def amount_at(data_hex, offset=64):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        out[str(k)] = None if (not a or a.executable) else {
            "lamports": a.lamports, "owner": str(a.owner),
            "data_hex": bytes(a.data).hex()}
    return out


def create_event_fields(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    if raw[:8].hex() != EVENT_DISC or len(raw) < 344:
        return None
    return {
        "disc": raw[:8].hex(),
        "base_in": struct.unpack_from("<Q", raw, 116)[0],
        "quote_in": struct.unpack_from("<Q", raw, 124)[0],
        "pool_base": struct.unpack_from("<Q", raw, 132)[0],
        "pool_quote": struct.unpack_from("<Q", raw, 140)[0],
        "min_liq": struct.unpack_from("<Q", raw, 148)[0],
        "init_liq": struct.unpack_from("<Q", raw, 156)[0],
        "lp_out": struct.unpack_from("<Q", raw, 164)[0],
    }


def pool_fields(data_hex):
    d = bytes.fromhex(data_hex)
    return {
        "index": struct.unpack_from("<H", d, 9)[0],
        "creator": d[11:43].hex(),
        "base_mint": d[43:75].hex(),
        "quote_mint": d[75:107].hex(),
        "lp_mint": d[107:139].hex(),
        "vault_base": d[139:171].hex(),
        "vault_quote": d[171:203].hex(),
        "lp_supply": struct.unpack_from("<Q", d, 203)[0],
        "coin_creator_zero": d[211:243] == bytes(32),
        "mayhem": d[243],
        "cashback": d[244],
        "vq": int.from_bytes(d[245:261], "little", signed=True),
        "creator_fee_bps": struct.unpack_from("<Q", d, 261)[0],
        "can_edit": d[269],
        "holder": d[270],
        "protocol_fees": struct.unpack_from("<Q", d, 271)[0],
        "creator_fees": struct.unpack_from("<Q", d, 279)[0],
    }


def run_case(bamt, qamt, prebase, prequote, binary):
    h = Harness(binary)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, name in ((TOKEN, "spl_token"), (TOKEN22, "spl_token_2022"),
                      (ATA, "associated_token")):
        vm.add_program_from_file(pid, str(ROOT / "evidence/dependencies" / name / "deployed.so"))
    glob = bytearray(RAW)
    glob[56] = 0
    vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
    for n in ["base_mint", "quote_mint"]:
        rrow = f["accounts"][n]
        vm.set_account(Pubkey.from_string(rrow["address"]),
                       Account(rrow["lamports"], base64.b64decode(rrow["data_base64"]),
                               Pubkey.from_string(rrow["owner"])))
    for key, mint, native in ((userbase, base, False), (userquote, quote, True)):
        vm.set_account(key, Account(10**15 + 2039280 if native else 10**9,
                                    token_bytes(mint, PAYER.pubkey(), 10**15, native), TOKEN))
    pool = Pubkey.find_program_address([b"pool", struct.pack("<H", 0), bytes(PAYER.pubkey()),
                                        bytes(base), bytes(quote)], PROGRAM)[0]
    lp = Pubkey.find_program_address([b"pool_lp_mint", bytes(pool)], PROGRAM)[0]
    ata = lambda owner, mint, program: Pubkey.find_program_address(
        [bytes(owner), bytes(program), bytes(mint)], ATA)[0]
    userlp = ata(PAYER.pubkey(), lp, TOKEN22)
    vb = ata(pool, base, TOKEN)
    vq = ata(pool, quote, TOKEN)
    if prebase:
        vm.set_account(vb, Account(VAULT_RENT, token_bytes(base, pool, prebase, False), TOKEN))
    if prequote:
        vm.set_account(vq, Account(VAULT_RENT, token_bytes(quote, pool, prequote, True), TOKEN))
    keys = [pool, CONFIG_KEY, PAYER.pubkey(), base, quote, lp, userbase, userquote,
            userlp, vb, vq, Pubkey.default(), TOKEN22, TOKEN, TOKEN, ATA, EVENT, PROGRAM]
    ix = next(x for x in IDL["instructions"] if x["name"] == "create_pool")
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    args = struct.pack("<HQQ", 0, bamt, qamt) + bytes(PAYER.pubkey()) + bytes([0])
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, bytes(ix["discriminator"]) + args, metas)],
        PAYER.pubkey(), [PAYER], vm.latest_blockhash())
    assert all(tx.verify_with_results())
    watch = [pool, lp, userbase, userquote, userlp, vb, vq, PAYER.pubkey()]
    before = snap(vm, watch)
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    after = snap(vm, watch)
    logs = meta.logs()
    payer_delta = after[str(PAYER.pubkey())]["lamports"] - before[str(PAYER.pubkey())]["lamports"]
    return {
        "tx": tx, "raw": bytes(tx), "before": before, "after": after,
        "logs": logs, "err": str(r.err()) if failed else None, "failed": failed,
        "payer_delta": payer_delta, "pool": pool, "lp": lp, "userlp": userlp,
        "vb": vb, "vq": vq,
        "events": len([l for l in logs if l.startswith("Program data: ")]),
        "event": create_event_fields(logs),
        "site": next((l for l in logs if "thrown in" in l or "caused by account" in l), None),
    }


# (label, bamt, qamt, prebase, prequote)
CASES = [
    # Family A: sqrt floor + 100 lock, fresh vaults.
    ("liq-100-100", 100, 100, 0, 0),
    ("liq-101-101", 101, 101, 0, 0),
    ("liq-1-10000", 1, 10000, 0, 0),
    ("liq-10000-1", 10000, 1, 0, 0),
    ("liq-100-10200", 100, 10200, 0, 0),
    ("liq-3-1e9", 3, 10**9, 0, 0),
    ("liq-1e9-1e9", 10**9, 10**9, 0, 0),
    ("liq-1e9-4e9", 10**9, 4 * 10**9, 0, 0),
    ("liq-1e15-1e15", 10**15, 10**15, 0, 0),
    # Family B: pre-funded vaults -- liquidity uses post-transfer balances.
    ("liq-prebase", 10**9, 10**9, 10**9, 0),
    ("liq-prequote", 10**9, 10**9, 0, 3 * 10**9),
    ("liq-preboth-tiny", 1, 1, 10**9, 10**9),
    ("liq-preboth-100", 1, 1, 99, 99),
    # Family C: TooLittle failures -- transfers happen, then rollback.
    ("liq-fail-1-1", 1, 1, 0, 0),
    ("liq-fail-99-99", 99, 99, 0, 0),
    ("liq-fail-2-3", 2, 3, 0, 0),
    ("liq-fail-99-100", 99, 100, 0, 0),
    ("liq-fail-pre-50", 1, 1, 50, 50),
    ("liq-fail-pre-98", 1, 1, 98, 98),
]

receipts_global = []
report_cases = []


def add_receipt(context, raw, signatures, before, after, logs, events, err,
                payer_delta, observed, roles):
    receipts_global.append({
        "sequence": len(receipts_global), "vm": len(receipts_global),
        "context": context, "transaction_base64": base64.b64encode(raw).decode(),
        "signatures": signatures, "transaction_sha256": sha(raw),
        "all_signatures_verified": True, "signature_fields": len(signatures),
        "before": before, "after": after,
        "metadata": {"signature": signatures[0] if signatures else None, "logs": logs,
                     "events": events},
        "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                  "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
        "error": err, "rollback_except_payer_fee": err is not None,
        "payer_delta_lamports": payer_delta, "observed": observed, "roles": roles,
    })


for index, (label, bamt, qamt, prebase, prequote) in enumerate(CASES):
    pb, pq = bamt + prebase, qamt + prequote
    init = math.isqrt(pb * pq)
    ok = init >= 100
    out = init - 100 if ok else None
    n_prefunded = (1 if prebase else 0) + (1 if prequote else 0)
    payer_ok = -(FRESH_PAYER - n_prefunded * VAULT_RENT)
    row = {"case": {"instruction": "create_pool", "label": label,
                    "base_in": bamt, "quote_in": qamt,
                    "pre_funded_base": prebase, "pre_funded_quote": prequote,
                    "pool_base": pb, "pool_quote": pq,
                    "expected": ({"kind": "ok", "init_liq": init, "lp_out": out,
                                  "payer_delta": payer_ok}
                                 if ok else
                                 {"kind": "err", "code": 6003,
                                  "fragment": "TooLittlePoolTokenLiquidity"})}}
    seen = set()
    for image, binary in IMAGES.items():
        r = run_case(bamt, qamt, prebase, prequote, binary)
        tx = r["tx"]
        B, A = r["before"], r["after"]
        sk = lambda k: str(k)
        if ok:
            assert not r["failed"] and r["err"] is None, (label, image, r["err"])
            assert r["events"] == 1, (label, image, r["events"])
            assert r["event"] == {"disc": EVENT_DISC, "base_in": bamt, "quote_in": qamt,
                                  "pool_base": pb, "pool_quote": pq, "min_liq": 100,
                                  "init_liq": init, "lp_out": out}, (label, image, r["event"])
            assert r["payer_delta"] == payer_ok, (label, image, r["payer_delta"], payer_ok)
            assert amount_at(A[sk(r["vb"])]["data_hex"]) == pb, (label, image, "vault base")
            assert amount_at(A[sk(r["vq"])]["data_hex"]) == pq, (label, image, "vault quote")
            assert amount_at(A[sk(r["userlp"])]["data_hex"]) == out, (label, image, "user lp")
            assert amount_at(A[sk(r["lp"])]["data_hex"], 36) == out, (label, image, "mint supply")
            pf = pool_fields(A[sk(r["pool"])]["data_hex"])
            assert pf["lp_supply"] == init, (label, image, pf["lp_supply"], init)
            assert pf["index"] == 0 and pf["creator"] == bytes(PAYER.pubkey()).hex(), (label, image, pf)
            assert pf["base_mint"] == bytes(base).hex() and pf["quote_mint"] == bytes(quote).hex(), (label, image, pf)
            assert pf["lp_mint"] == bytes(r["lp"]).hex(), (label, image, pf)
            assert pf["vault_base"] == bytes(r["vb"]).hex() and pf["vault_quote"] == bytes(r["vq"]).hex(), (label, image, pf)
            assert pf["coin_creator_zero"] and pf["mayhem"] == 0 and pf["cashback"] == 0, (label, image, pf)
            assert pf["vq"] == 0 and pf["creator_fee_bps"] == 0 and pf["can_edit"] == 0, (label, image, pf)
            assert pf["holder"] == 0 and pf["protocol_fees"] == 0 and pf["creator_fees"] == 0, (label, image, pf)
            assert amount_at(A[sk(userbase)]["data_hex"]) == 10**15 - bamt, (label, image, "user base")
            assert amount_at(A[sk(userquote)]["data_hex"]) == 10**15 - qamt, (label, image, "user quote")
            observed = {"pool_base": pb, "pool_quote": pq, "init_liq": init, "lp_out": out,
                        "min_liq": 100, "user_lp": out, "mint_supply": out,
                        "pool_lp_supply": init, "event_disc": EVENT_DISC,
                        "payer_lamports_delta": payer_ok, "event_count": 1, "sig_fields": 1}
        else:
            assert r["failed"], (label, image, "expected failure")
            assert "6003" in r["err"], (label, image, r["err"])
            assert "TooLittlePoolTokenLiquidity" in "\n".join(r["logs"]), (label, image, r["logs"][-3:])
            assert r["events"] == 0, (label, image, r["events"])
            assert r["payer_delta"] == -5000, (label, image, r["payer_delta"])
            assert A[sk(r["pool"])] is None, (label, image, "pool created on failure")
            assert A[sk(r["lp"])] is None, (label, image, "lp mint created on failure")
            assert A[sk(r["userlp"])] is None, (label, image, "user lp created on failure")
            assert A[sk(r["vb"])] == B[sk(r["vb"])], (label, image, "vault base rollback")
            assert A[sk(r["vq"])] == B[sk(r["vq"])], (label, image, "vault quote rollback")
            assert amount_at(A[sk(userbase)]["data_hex"]) == 10**15, (label, image, "user base rollback")
            assert amount_at(A[sk(userquote)]["data_hex"]) == 10**15, (label, image, "user quote rollback")
            row.setdefault("error_sites", {})[image] = r["site"]
            observed = {"error_code": 6003, "fragment": "TooLittlePoolTokenLiquidity",
                        "payer_lamports_delta": -5000, "event_count": 0, "sig_fields": 1,
                        "pool_created": False, "lp_mint_created": False,
                        "user_lp_created": False}
        seen.add(json.dumps(observed, sort_keys=True))
        add_receipt({"index": index, "image": image, "instruction": "create_pool", "label": label},
                    r["raw"], [str(s) for s in tx.signatures], B, A,
                    r["logs"], r["events"], r["err"], r["payer_delta"], observed,
                    {"fee_payer": str(PAYER.pubkey()), "pool": str(r["pool"]),
                     "lp_mint": str(r["lp"]), "user_lp": str(r["userlp"]),
                     "vault_base": str(r["vb"]), "vault_quote": str(r["vq"]),
                     "userbase": str(userbase), "userquote": str(userquote)})
        row[image] = {"error": r["err"], "logs": r["logs"], "observed": observed}
        print(f"  {label} [{image}] observed={observed}", flush=True)
    assert len(seen) == 1, (label, "images must agree", seen)
    report_cases.append(row)

# ---------------- report + parts ----------------
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
    "evidence/original/pump_fees/deployed.so",
    "evidence/original/pump/deployed.so",
    "evidence/upstream/pump_amm.json",
    "evidence/upstream/pump.json",
    "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json",
    "research/imported-lab/analysis/pump_fun/config-snapshot.json",
    "scripts/pump_amm_admin_differential.py",
    "scripts/pump_amm_liquidity_differential.py",
    "scripts/pump_amm_reusable_harness.py",
    "scripts/pump_amm_create_differential.py",
]
report = {
    "schema": 1, "packet": "amm-create-initial-liquidity-20261029",
    "case_count": len(report_cases), "mismatches": [],
    "scope": ("create_pool initial-liquidity math on all 3 images "
              "(original / #424 control / #427 candidate): "
              "initial_liquidity = floor(sqrt(post-transfer vault base "
              "x post-transfer vault quote)) in u128, lp_supply = "
              "initial_liquidity, creator minted output = "
              "initial_liquidity - 100 (minimum liquidity, never "
              "minted), liquidity < 100 fails 6003 "
              "TooLittlePoolTokenLiquidity after the transfers with "
              "full rollback, and the CreatePoolEvent echoes "
              "instruction amounts separately from post-transfer "
              "vault balances. Fresh VM per case per image. Receipts "
              "are stored as parts to stay under GitHub's 25MB "
              "web-upload limit; verify.py reads them in order. No "
              "source change, build, or whole-program equivalence claim."),
    "image_sha256": IMAGE_SHA,
    "cases": report_cases,
    "divergent_cases": [],
    "counts": {"vms": len(receipts_global), "transactions": len(receipts_global),
               "signature_fields": len(receipts_global)},
    "input_sha256": {n: sha((ROOT / n).read_bytes()) for n in repo_inputs},
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(
    gzip.compress(json.dumps(report, indent=1).encode(), mtime=0))
shutil.copy(__file__, OUT / "producer.py")
print(f"cases: {len(report_cases)} receipts: {len(receipts_global)}")
print("wrote:", OUT / "runtime/report.json.gz")
print("NEXT: write verify.py and README.md into the packet dir, then generate MANIFEST.json")

sites_lines = []
for row in report_cases:
    case = row["case"]
    if "error_sites" not in row:
        continue
    per = []
    for image in ("original", "control", "candidate"):
        site = row.get("error_sites", {}).get(image, "") or ""
        if site and "thrown in" in site:
            site = site.split("thrown in", 1)[1].strip()
        elif site:
            site = site.replace("Program log: ", "")
        per.append(f"{image} {site}")
    sites_lines.append(f"- {case['label']}: " + "; ".join(per))
print("\n".join(sites_lines))
