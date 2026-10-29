#!/usr/bin/env python3
"""Build research/amm-claim-token-incentives-token22-transfer-fee-20261029 receipts.

claim_token_incentives under a matching Token-2022 transfer fee (2nd
run packet #25; run 2 #4 covered claim_token_incentives without fees,
2nd #24 covered the sibling claim_cashback under a fee, not this
instruction):

- with a matching Token-2022 program, the claim still succeeds and
  the recipient receives the NET amount while the fee is withheld
  into the recipient ATA's TransferFeeAmount extension (offset 174
  u64); the vault loses the GROSS claim amount;
- total_claimed_tokens increments by the GROSS claim amount, not the
  net receipt, so the claimed-max unwrap panic still fires under a
  fee (ProgramFailedToComplete, "called `Option::unwrap()` on a
  `None` value");
- the ClaimTokenIncentivesEvent reports the GROSS amount (event
  layout: disc 8 + user 32 + mint 32 + amount u64 @72 + timestamp
  i64 @80 + total_claimed_tokens u64 @88 + current_sol_volume u64
  @96, 104 bytes total), so reading only events overstates
  delivery under any nonzero fee;
- 100% fee still succeeds with receipt 0 (opposite of the trade
  paths' 100% errors: buy_exact 6039, non-exact buy 6023);
- caps bind the withheld amount only (tf5000-max100 -> withheld
  exactly 100);
- the fee schedule switches from older to newer exactly at the
  newer epoch (older 100bps / newer 5000bps @ epoch 10);
- a pre-existing destination without extension space fails with
  Token-2022 custom error 0xd, while one with extension space
  accumulates withheld fees; a no-fee destination needs no
  extension at all (165 bytes works);
- a pre-existing 182-byte destination funded at only the 165-byte
  rent (2,039,280) fails 2005 ConstraintRentExempt under
  init_if_needed, because the 182-byte rent is 2,157,600;
- a missing user ATA is created by init_if_needed under a fee:
  payer 2,162,600, created ATA 182 bytes with 2,157,600 lamports,
  net receipt and withheld as in the pre-existing case;
- a zero claim under a fee is a silent no-op (no transfer, no
  event, "No tokens to claim" log) that still advances
  last_update_timestamp and recomputes needs_claim;
- a reward-day claim under a fee pays the reward net of the fee
  (claim 205 -> receipt 202, withheld 3, claimed 212);
- a Token program meta with Token-2022-owned accounts fails 2023
  ConstraintAssociatedTokenTokenProgram (AnchorError form, no
  thrown-in site);
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

from pump_amm_liquidity_differential import (
    EVENT, IDL, OUTSIDER, PAYER, PROGRAM, ROOT, TOKEN, TOKEN22,
)
from pump_amm_reusable_harness import acquire_harness

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-claim-token-incentives-token22-transfer-fee-20261029"
WS = Path.home() / "workspace/slop-verify"
ATA = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
USER = OUTSIDER.pubkey()
MINT = Pubkey.from_bytes(bytes([226]) * 32)
G = Pubkey.find_program_address([b'global_volume_accumulator'], PROGRAM)[0]
U = Pubkey.find_program_address([b'user_volume_accumulator', bytes(USER)], PROGRAM)[0]
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
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def disc(name):
    return bytes(next(x for x in IDL['accounts'] if x['name'] == name)['discriminator'])


def token_data(owner, amount):
    d = bytearray(165)
    d[:32] = bytes(MINT)
    d[32:64] = bytes(owner)
    struct.pack_into('<Q', d, 64, amount)
    d[108] = 1
    return bytes(d)


def token_ext(owner, amount, withheld):
    data = token_data(owner, amount)
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) + struct.pack("<HHQ", 2, 8, withheld)


def tok_amount(entry):
    if entry is None:
        return None
    data = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", data, 64)[0] if len(data) >= 72 else None


def withheld_at(entry):
    if entry is None:
        return None
    data = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", data, 174)[0] if len(data) >= 182 else None


def parse_uva(entry):
    if entry is None:
        return {"uva_len": None, "needs": None, "unclaimed": None, "claimed": None,
                "volume": None, "last": None, "has_claimed": None}
    data = bytes.fromhex(entry["data_hex"])
    if len(data) < 90:
        return {"uva_len": len(data), "needs": None, "unclaimed": None, "claimed": None,
                "volume": None, "last": None, "has_claimed": None}
    needs, unclaimed, claimed, volume, last, hasc, _, _ = struct.unpack_from(
        "<BQQQqBQQ", data, 40)
    return {"uva_len": len(data), "needs": needs, "unclaimed": unclaimed,
            "claimed": claimed, "volume": volume, "last": last, "has_claimed": hasc}


def conv(snap):
    out = {}
    for k, v in snap.items():
        out[k] = None if v is None else {
            "owner": v["owner"], "lamports": v["lamports"], "data_hex": v["data"]}
    return out


# ok expected: ("ok", claim, gain, withheld_after, claimed_after,
#   unclaimed_after, volume_after, last_after, needs_after,
#   dest_len_after, event_amount, payer_delta)
# zero expected: ("zero", claimed_after, unclaimed_after, volume_after,
#   last_after, needs_after, dest_len_after)
# error expected: ("error", code, fragment)
CASES = [
    ("token-baseline", {},
     ("ok", 5, 5, None, 5, 0, 20, 10, 1, 165, 5, 5000)),
    ("token22-nofee", {"token22": True, "dest_ext": True},
     ("ok", 5, 5, 0, 5, 0, 20, 10, 1, 182, 5, 5000)),
    ("token22-nofee-plain-dest", {"token22": True},
     ("ok", 5, 5, None, 5, 0, 20, 10, 1, 165, 5, 5000)),
    ("tf100", {"token22": True, "tf": (100, M), "dest_ext": True},
     ("ok", 5, 4, 1, 5, 0, 20, 10, 1, 182, 5, 5000)),
    ("tf5000", {"token22": True, "tf": (5000, M), "dest_ext": True},
     ("ok", 5, 2, 3, 5, 0, 20, 10, 1, 182, 5, 5000)),
    ("tf10000", {"token22": True, "tf": (10000, M), "dest_ext": True},
     ("ok", 5, 0, 5, 5, 0, 20, 10, 1, 182, 5, 5000)),
    ("tf5000-max100", {"token22": True, "tf": (5000, 100), "dest_ext": True,
                       "unclaimed": 100000},
     ("ok", 100000, 99900, 100, 100000, 0, 20, 10, 1, 182, 100000, 5000)),
    ("tf100-amount1000", {"token22": True, "tf": (100, M), "dest_ext": True,
                          "unclaimed": 1000},
     ("ok", 1000, 990, 10, 1000, 0, 20, 10, 1, 182, 1000, 5000)),
    ("tf100-amount1", {"token22": True, "tf": (100, M), "dest_ext": True,
                       "unclaimed": 1},
     ("ok", 1, 0, 1, 1, 0, 20, 10, 1, 182, 1, 5000)),
    ("tf100-amount0", {"token22": True, "tf": (100, M), "dest_ext": True,
                       "now": 21, "last": 20, "unclaimed": 0, "volume": 0},
     ("zero", 7, 0, 0, 21, 0, 182)),
    ("tf100-prewithheld", {"token22": True, "tf": (100, M), "dest_ext": True,
                           "dest_withheld": 1000},
     ("ok", 5, 4, 1001, 5, 0, 20, 10, 1, 182, 5, 5000)),
    ("tf100-dest-noext", {"token22": True, "tf": (100, M)},
     ("error", "InstructionErrorCustom(13)", "custom program error: 0xd")),
    ("tf100-dest-underfunded-rent", {"token22": True, "tf": (100, M),
                                     "dest_ext": True, "dest_lamports": 2039280},
     ("error", "2005", "ConstraintRentExempt")),
    ("tf-epoch0", {"token22": True, "tf": (100, M), "older_bps": 100,
                   "newer_bps": 5000, "newer_epoch": 10, "epoch": 0,
                   "dest_ext": True},
     ("ok", 5, 4, 1, 5, 0, 20, 10, 1, 182, 5, 5000)),
    ("tf-epoch9", {"token22": True, "tf": (100, M), "older_bps": 100,
                   "newer_bps": 5000, "newer_epoch": 10, "epoch": 9,
                   "dest_ext": True},
     ("ok", 5, 4, 1, 5, 0, 20, 10, 1, 182, 5, 5000)),
    ("tf-epoch10", {"token22": True, "tf": (100, M), "older_bps": 100,
                    "newer_bps": 5000, "newer_epoch": 10, "epoch": 10,
                    "dest_ext": True},
     ("ok", 5, 2, 3, 5, 0, 20, 10, 1, 182, 5, 5000)),
    ("tf-epoch11", {"token22": True, "tf": (100, M), "older_bps": 100,
                    "newer_bps": 5000, "newer_epoch": 10, "epoch": 11,
                    "dest_ext": True},
     ("ok", 5, 2, 3, 5, 0, 20, 10, 1, 182, 5, 5000)),
    ("tf100-reward-day", {"token22": True, "tf": (100, M), "dest_ext": True,
                          "now": 21, "last": 20},
     ("ok", 205, 202, 3, 212, 0, 0, 21, 0, 182, 205, 5000)),
    ("tf100-claimed-max", {"token22": True, "tf": (100, M), "dest_ext": True,
                           "now": 21, "last": 20, "volume": 0, "claimed": M},
     ("error", "ProgramFailedToComplete",
      "called `Option::unwrap()` on a `None` value")),
    ("tf100-missing-user-ata", {"token22": True, "tf": (100, M),
                                "missing_user_ata": True},
     ("ok", 5, 4, 1, 5, 0, 20, 10, 1, 182, 5, 2162600)),
    ("prog-mismatch", {"token22": True, "meta_prog": "token", "dest_ext": True},
     ("error", "2023", "ConstraintAssociatedTokenTokenProgram")),
]


def run_case(case, binary):
    h = acquire_harness(binary)
    vm = h.vm
    vm.with_sigverify(True)
    now = case.get("now", 10)
    vm.set_clock(Clock(100, now, case.get("epoch", 0), 0, now))
    for pid, n in [(TOKEN, 'spl_token'), (TOKEN22, 'spl_token_2022')]:
        vm.add_program_from_file(pid, ROOT / 'evidence/dependencies' / n / 'deployed.so')
    own_prog = TOKEN22 if case.get("token22") else TOKEN
    meta_prog = TOKEN if case.get("meta_prog") == "token" else own_prog
    mint_data = struct.pack('<I', 0) + bytes(32) + struct.pack('<Q', 10 ** 12) \
        + bytes([6, 1]) + bytes(36)
    if case.get("tf") is not None:
        bps, maxfee = case["tf"]
        older_bps = case.get("older_bps", bps)
        newer_bps = case.get("newer_bps", bps)
        newer_epoch = case.get("newer_epoch", 0)
        d = bytearray(mint_data[:82])
        d += bytes(83) + bytes([1])
        conf = bytes(72) + struct.pack("<QQH", 0, maxfee, older_bps) \
            + struct.pack("<QQH", newer_epoch, maxfee, newer_bps)
        d += struct.pack("<HH", 1, len(conf)) + conf
        mint_data = bytes(d)
    vm.set_account(MINT, Account(10 ** 9, mint_data, own_prog))
    g = disc('GlobalVolumeAccumulator') + struct.pack('<qqq', 20, 49, 1) \
        + bytes(MINT) + struct.pack('<30Q', *([1000] * 30)) \
        + struct.pack('<30Q', *([100] * 30))
    vm.set_account(G, Account(10 ** 9, g.ljust(600, b'\0'), PROGRAM))
    u = disc('UserVolumeAccumulator') + bytes(USER) + struct.pack(
        '<BQQQqBQQ', 1, case.get('unclaimed', 5), case.get('claimed', 7),
        case.get('volume', 20), case.get('last', 0), 1, 11, 13)
    vm.set_account(U, Account(10 ** 9, u.ljust(137, b'\0'), PROGRAM))
    ga = Pubkey.find_program_address([bytes(G), bytes(own_prog), bytes(MINT)], ATA)[0]
    ua = Pubkey.find_program_address([bytes(USER), bytes(own_prog), bytes(MINT)], ATA)[0]
    vm.set_account(ga, Account(10 ** 9, token_data(G, case.get('vault_amount', 10 ** 9)),
                               own_prog))
    if not case.get("missing_user_ata"):
        if case.get("dest_ext"):
            dest_data = token_ext(USER, case.get('user_amount', 17),
                                  case.get('dest_withheld', 0))
            dest_lamports = case.get('dest_lamports', 2157600)
        else:
            dest_data = token_data(USER, case.get('user_amount', 17))
            dest_lamports = 2039280
        vm.set_account(ua, Account(dest_lamports, dest_data, own_prog))
    ix = next(i for i in IDL['instructions'] if i['name'] == 'claim_token_incentives')
    keys = [USER, ua, G, ga, U, MINT, meta_prog, Pubkey.default(), ATA, EVENT,
            PROGRAM, PAYER.pubkey()]
    metas = [AccountMeta(k, bool(a.get('signer')), bool(a.get('writable')))
             for k, a in zip(keys, ix['accounts'])]

    def snap():
        out = {}
        for k in keys + [PAYER.pubkey()]:
            a = vm.get_account(k)
            if a is None or not a.executable:
                out[str(k)] = None if a is None else {
                    'data': bytes(a.data).hex(), 'lamports': a.lamports,
                    'owner': str(a.owner)}
        return out

    before = snap()
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, bytes(ix['discriminator']), metas)],
        PAYER.pubkey(), [PAYER], vm.latest_blockhash())
    assert all(tx.verify_with_results())
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    after = snap()
    logs = meta.logs()
    events = [l for l in logs if l.startswith('Program data: ')]
    ev = None
    if events:
        raw = base64.b64decode(events[0][len('Program data: '):])
        assert len(raw) == 104, (len(raw), raw.hex())
        ev = {"amount": struct.unpack_from('<Q', raw, 72)[0],
              "timestamp": struct.unpack_from('<q', raw, 80)[0],
              "claimed": struct.unpack_from('<Q', raw, 88)[0],
              "volume": struct.unpack_from('<Q', raw, 96)[0]}
    return {"tx": base64.b64encode(bytes(tx)).decode(),
            "error": str(r.err()) if failed else None, "logs": logs,
            "events": events, "event": ev,
            "before": conv(before), "after": conv(after),
            "vault_key": str(ga), "dest_key": str(ua), "acc_key": str(U),
            "payer_key": str(PAYER.pubkey())}


receipts_global = []
report_cases = []
for index, (label, case, expected) in enumerate(CASES):
    row = {"case": {"instruction": "claim_token_incentives", "label": label,
                    "params": case, "expected": list(expected)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        r = run_case(case, IMAGES[image])
        raw = base64.b64decode(r["tx"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == 1, (label, image, checks)
        before, after = r["before"], r["after"]
        payer_key = r["payer_key"]
        payer_delta = before[payer_key]["lamports"] - after[payer_key]["lamports"]
        vault_key, dest_key, acc_key = r["vault_key"], r["dest_key"], r["acc_key"]
        dest_before = tok_amount(before[dest_key])
        dest_after = tok_amount(after[dest_key])
        dest_len_after = len(bytes.fromhex(after[dest_key]["data_hex"])) \
            if after[dest_key] else None
        dest_lamports_after = after[dest_key]["lamports"] if after[dest_key] else None
        uva_after = parse_uva(after[acc_key])
        observed = {
            "vault_before": tok_amount(before[vault_key]),
            "vault_after": tok_amount(after[vault_key]),
            "dest_before": dest_before,
            "dest_after": dest_after,
            "dest_withheld_before": withheld_at(before[dest_key]),
            "dest_withheld_after": withheld_at(after[dest_key]),
            "dest_len_after": dest_len_after,
            "dest_lamports_after": dest_lamports_after,
            "claimed_before": parse_uva(before[acc_key])["claimed"],
            "claimed_after": uva_after["claimed"],
            "unclaimed_after": uva_after["unclaimed"],
            "volume_after": uva_after["volume"],
            "last_after": uva_after["last"],
            "needs_after": uva_after["needs"],
            "has_claimed_after": uva_after["has_claimed"],
            "event_count": len(r["events"]),
            "event_amount": r["event"]["amount"] if r["event"] else None,
            "event_claimed": r["event"]["claimed"] if r["event"] else None,
            "event_volume": r["event"]["volume"] if r["event"] else None,
            "payer_delta": payer_delta,
        }
        err = r["error"]
        logs = r["logs"]
        if expected[0] == "ok":
            _, claim, gain, withheld, claimed_after, unclaimed_after, volume_after, \
                last_after, needs_after, dest_len, event_amount, payer_exp = expected
            assert err is None, (label, image, err)
            assert observed["vault_before"] - observed["vault_after"] == claim, \
                (label, image, observed, expected)
            assert (observed["dest_after"] or 0) - (observed["dest_before"] or 0) == gain, \
                (label, image, observed, expected)
            assert observed["dest_withheld_after"] == withheld, \
                (label, image, observed, expected)
            assert observed["claimed_after"] == claimed_after, \
                (label, image, observed, expected)
            assert observed["unclaimed_after"] == unclaimed_after, \
                (label, image, observed, expected)
            assert observed["volume_after"] == volume_after, \
                (label, image, observed, expected)
            assert observed["last_after"] == last_after, \
                (label, image, observed, expected)
            assert observed["needs_after"] == needs_after, \
                (label, image, observed, expected)
            assert observed["dest_len_after"] == dest_len, \
                (label, image, observed, expected)
            assert observed["event_count"] == 1, (label, image, observed)
            assert observed["event_amount"] == event_amount, \
                (label, image, observed, expected)
            assert observed["event_claimed"] == claimed_after, \
                (label, image, observed, expected)
            assert observed["event_volume"] == volume_after, \
                (label, image, observed, expected)
            assert payer_delta == payer_exp, (label, image, payer_delta, expected)
            if label == "tf100-missing-user-ata":
                assert observed["dest_lamports_after"] == 2157600, \
                    (label, image, observed)
        elif expected[0] == "zero":
            _, claimed_after, unclaimed_after, volume_after, last_after, needs_after, \
                dest_len = expected
            assert err is None, (label, image, err)
            assert observed["vault_before"] == observed["vault_after"], \
                (label, image, observed)
            assert observed["dest_after"] == observed["dest_before"], \
                (label, image, observed)
            assert observed["claimed_after"] == claimed_after, \
                (label, image, observed, expected)
            assert observed["unclaimed_after"] == unclaimed_after, \
                (label, image, observed, expected)
            assert observed["volume_after"] == volume_after, \
                (label, image, observed, expected)
            assert observed["last_after"] == last_after, \
                (label, image, observed, expected)
            assert observed["needs_after"] == needs_after, \
                (label, image, observed, expected)
            assert observed["dest_len_after"] == dest_len, \
                (label, image, observed, expected)
            assert observed["event_count"] == 0, (label, image, observed)
            assert any("No tokens to claim" in l for l in logs), (label, image, logs)
            assert payer_delta == 5000, (label, image, payer_delta)
        else:
            assert err is not None and expected[1] in err, (label, image, err)
            assert expected[2] in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == 5000, (label, image, payer_delta)
            assert observed["event_count"] == 0, (label, image, observed)
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback")
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l),
                        None)
            row.setdefault("error_sites", {})[image] = site
        seen.add((err, tuple(sorted((k, str(v)) for k, v in observed.items()))))
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": "claim_token_incentives",
                        "label": label},
            "transaction_base64": r["tx"],
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
            "all_signatures_verified": True, "signature_fields": 1,
            "before": before, "after": after,
            "metadata": {"signature": str(tx.signatures[0]), "logs": logs,
                         "inner_instructions": [], "events": r["events"]},
            "clock": {"slot": 100, "epoch_start_timestamp": case.get("now", 10),
                      "epoch": case.get("epoch", 0),
                      "leader_schedule_epoch": 0, "unix_timestamp": case.get("now", 10)},
            "loaded_programs": {
                "pAMM": {"path": "evidence/original/pump_amm/deployed.so",
                         "sha256": IMAGE_SHA[image]},
                "spl_token": {"path": "evidence/dependencies/spl_token/deployed.so",
                              "sha256": TOKEN_SHA["spl_token"]},
                "spl_token_2022": {"path": "evidence/dependencies/spl_token_2022/deployed.so",
                                   "sha256": TOKEN_SHA["spl_token_2022"]}},
            "error": err, "rollback_except_payer_fee": err is not None,
            "payer_fee_lamports": payer_delta,
            "observed": observed,
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
    "evidence/dependencies/spl_token/deployed.so",
    "evidence/dependencies/spl_token_2022/deployed.so",
    "scripts/pump_amm_liquidity_differential.py",
    "scripts/pump_amm_reusable_harness.py",
]
report = {"schema": 1, "packet": "amm-claim-token-incentives-token22-transfer-fee-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("claim_token_incentives on synthetic user-volume-accumulator "
                    "fixtures with a matching Token-2022 transfer-fee extension on the "
                    "incentive mint, fresh VM per case per image (original / #424 "
                    "control / #427 candidate). Receipts are stored as parts "
                    "to stay under GitHub's 25MB web-upload limit; verify.py "
                    "reads them in order. Snapshots cover non-executable "
                    "accounts only."),
          "image_sha256": IMAGE_SHA,
          "cases": report_cases,
          "counts": {"vms": len(receipts_global),
                     "transactions": len(receipts_global),
                     "signature_fields": len(receipts_global)},
          "input_sha256": {n: sha((ROOT / n).read_bytes()) for n in repo_inputs},
          "transaction_receipts": {"parts": parts}}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(json.dumps(report, indent=1).encode(), mtime=0))
print(f"cases: {len(report_cases)} receipts: {len(receipts_global)}")
print(f"wrote: {OUT / 'runtime/report.json.gz'}")
