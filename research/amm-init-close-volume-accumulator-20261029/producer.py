#!/usr/bin/env python3
"""Build research/amm-init-close-volume-accumulator-20261029 receipts.

init_user_volume_accumulator / close_user_volume_accumulator, pinned at
runtime (2nd run packet #10; run 1 and 2nd #1-#9 never covered these two
instructions; only claim_token_incentives (#4) and extend_account (#1)
touched the accumulator account itself):

init:
- fresh init creates exactly the 137-byte account with 1,844,400
  lamports of rent (265 bytes x 6960), funded by the payer, plus the
  5000 tx fee; the payer tops up only the shortfall (prefund 1 ->
  payer -1,849,399; prefund 10^6 -> -849,400) and an already
  rent-exempt prefund (10^9) is kept in full, not refunded;
- the handler writes only the user field: fresh data is
  discriminator + user + 97 zero bytes; a re-init of an existing
  137-byte account rewrites bytes 8..40 to the payer and leaves
  every other byte (including the 0x61 tail past the 90-byte
  serialized body) untouched, and even overwrites a stored
  other-user key;
- the user need not sign init (user meta is read-only, non-signer):
  init for OUTSIDER, default and program keys all succeed with the
  payer paying;
- an existing account must deserialize (>= 90 bytes) AND be exactly
  137 bytes: <8 -> 3001 AccountDiscriminatorNotFound, 8..89 ->
  3003 AccountDidNotDeserialize, 90/136/138 -> 2019 ConstraintSpace
  (Left: 137, Right: actual); a flipped discriminator on an
  existing account -> 3002 AccountDiscriminatorMismatch;
- non-PDA accumulator or event authority -> 2006 ConstraintSeeds;
  read-only accumulator or read-only payer -> PrivilegeEscalation
  at the system CPI (read-only payer still pays the 2-signer fee
  of 10000); a substituted program account -> MissingAccount
  ("An account required by the instruction is missing"), after
  the event log line is already emitted;

close:
- close succeeds at >= 90 bytes (90/137/138) and returns the FULL
  accumulator balance to the user: 10^9 -> payer +999,995,000
  (minus the 5000 fee); 1 lamport -> -4,999; rent-exempt 1,844,400
  -> +1,839,400; the account is removed (after snapshot None);
- close checks only deserialization, not exact length: <8 -> 3001,
  8..89 -> 3003, and bool fields must be 0/1 (needs_claim=2 or
  has_total_claimed_tokens=2 -> 3003) while u64 totals at any value
  (including u64max) close fine -- the event only reports them;
- the stored user field is NOT re-checked on close (stored-other
  user closes fine, because the PDA seeds bind the account);
- close bindings: non-PDA accumulator or event -> 2006, read-only
  accumulator -> 2000 ConstraintMut, unsigned user -> 3010
  AccountNotSigner (fee payer OUTSIDER pays 5000), non-program
  owner -> 3007 AccountOwnedByWrongProgram, flipped discriminator -> 3002,
  substituted program -> MissingAccount (event log already out);
- all three images (original / #424 control / #427 candidate)
  agree on every case: this packet pins behavior, it does not
  claim a divergence.
"""
import base64
import gzip
import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path.home() / "workspace/pumpfun-sparse/scripts"))
from solders.account import Account
from solders.clock import Clock
from solders.instruction import AccountMeta, Instruction
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

from pump_amm_admin_differential import EVENT, IDL, OUTSIDER, PAYER, PROGRAM, Harness

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-init-close-volume-accumulator-20261029"
WS = Path.home() / "workspace/slop-verify"

DISC = bytes(next(x for x in IDL["accounts"] if x["name"] == "UserVolumeAccumulator")["discriminator"])
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}

INIT = "init_user_volume_accumulator"
CLOSE = "close_user_volume_accumulator"
PAYER_B = bytes(PAYER.pubkey())
OUTSIDER_B = bytes(OUTSIDER.pubkey())
DEFAULT_B = bytes(Pubkey.default())
PROGRAM_B = bytes(PROGRAM)

# (label, kwargs, expected)
# expected ok-init:  ("ok-init", acc_lamports, payer_delta)
# expected ok-close: ("ok-close", payer_delta)
# expected error:    ("error", code, fragment, fee_charged)
CASES = [
    ("init-fresh", dict(instruction=INIT), ("ok-init", 1844400, -1849400)),
    ("init-fresh-prefund1", dict(instruction=INIT, prefund=1), ("ok-init", 1844400, -1849399)),
    ("init-fresh-prefund1m", dict(instruction=INIT, prefund=10**6), ("ok-init", 1844400, -849400)),
    ("init-fresh-prefund1b", dict(instruction=INIT, prefund=10**9), ("ok-init", 10**9, -5000)),
    ("init-fresh-user-outsider", dict(instruction=INIT, user_bytes=OUTSIDER_B), ("ok-init", 1844400, -1849400)),
    ("init-fresh-user-default", dict(instruction=INIT, user_bytes=DEFAULT_B), ("ok-init", 1844400, -1849400)),
    ("init-fresh-user-program", dict(instruction=INIT, user_bytes=PROGRAM_B), ("ok-init", 1844400, -1849400)),
    ("init-existing", dict(instruction=INIT, mutation="existing"), ("ok-init", 10**9, -5000)),
    ("init-existing-user-outsider", dict(instruction=INIT, mutation="existing", offset=8, value=OUTSIDER_B), ("ok-init", 10**9, -5000)),
    ("init-existing-off41-max", dict(instruction=INIT, mutation="existing", offset=41, value=(2**64 - 1).to_bytes(8, "little")), ("ok-init", 10**9, -5000)),
    ("init-pda", dict(instruction=INIT, mutation="pda"), ("error", "2006", "ConstraintSeeds", 5000)),
    ("init-readonly", dict(instruction=INIT, mutation="readonly"), ("error", "PrivilegeEscalation", "writable privilege escalated", 5000)),
    ("init-payer-readonly", dict(instruction=INIT, mutation="payer-readonly"), ("error", "PrivilegeEscalation", "writable privilege escalated", 10000)),
    ("init-event", dict(instruction=INIT, mutation="event"), ("error", "2006", "ConstraintSeeds", 5000)),
    ("init-program", dict(instruction=INIT, mutation="program"), ("error", "MissingAccount", "An account required by the instruction is missing", 5000)),
    ("init-existing-len0", dict(instruction=INIT, mutation="existing", length=0), ("error", "3001", "AccountDiscriminatorNotFound", 5000)),
    ("init-existing-len8", dict(instruction=INIT, mutation="existing", length=8), ("error", "3003", "AccountDidNotDeserialize", 5000)),
    ("init-existing-len90", dict(instruction=INIT, mutation="existing", length=90), ("error", "2019", "ConstraintSpace", 5000)),
    ("init-existing-len138", dict(instruction=INIT, mutation="existing", length=138), ("error", "2019", "ConstraintSpace", 5000)),
    ("init-existing-disc", dict(instruction=INIT, mutation="existing", offset=0, value=bytes([0x57])), ("error", "3002", "AccountDiscriminatorMismatch", 5000)),
    ("close-base", dict(instruction=CLOSE), ("ok-close", 999995000)),
    ("close-len90", dict(instruction=CLOSE, length=90), ("ok-close", 999995000)),
    ("close-len138", dict(instruction=CLOSE, length=138), ("ok-close", 999995000)),
    ("close-len0", dict(instruction=CLOSE, length=0), ("error", "3001", "AccountDiscriminatorNotFound", 5000)),
    ("close-len8", dict(instruction=CLOSE, length=8), ("error", "3003", "AccountDidNotDeserialize", 5000)),
    ("close-len89", dict(instruction=CLOSE, length=89), ("error", "3003", "AccountDidNotDeserialize", 5000)),
    ("close-discriminator", dict(instruction=CLOSE, mutation="discriminator"), ("error", "3002", "AccountDiscriminatorMismatch", 5000)),
    ("close-owner", dict(instruction=CLOSE, mutation="owner"), ("error", "3007", "AccountOwnedByWrongProgram", 5000)),
    ("close-pda", dict(instruction=CLOSE, mutation="pda"), ("error", "2006", "ConstraintSeeds", 5000)),
    ("close-readonly", dict(instruction=CLOSE, mutation="readonly"), ("error", "2000", "ConstraintMut", 5000)),
    ("close-unsigned", dict(instruction=CLOSE, mutation="unsigned"), ("error", "3010", "AccountNotSigner", 5000)),
    ("close-event", dict(instruction=CLOSE, mutation="event"), ("error", "2006", "ConstraintSeeds", 5000)),
    ("close-program", dict(instruction=CLOSE, mutation="program"), ("error", "MissingAccount", "An account required by the instruction is missing", 5000)),
    ("close-stored-user", dict(instruction=CLOSE, mutation="stored-user"), ("ok-close", 999995000)),
    ("close-off40-bool2", dict(instruction=CLOSE, offset=40, value=(2).to_bytes(1, "little")), ("error", "3003", "AccountDidNotDeserialize", 5000)),
    ("close-off73-bool2", dict(instruction=CLOSE, offset=73, value=(2).to_bytes(1, "little")), ("error", "3003", "AccountDidNotDeserialize", 5000)),
    ("close-off41-max", dict(instruction=CLOSE, offset=41, value=(2**64 - 1).to_bytes(8, "little")), ("ok-close", 999995000)),
    ("close-off82-max", dict(instruction=CLOSE, offset=82, value=(2**64 - 1).to_bytes(8, "little")), ("ok-close", 999995000)),
    ("close-lamports1", dict(instruction=CLOSE, acc_lamports=1), ("ok-close", -4999)),
    ("close-lamports-rent", dict(instruction=CLOSE, acc_lamports=1844400), ("ok-close", 1839400)),
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        out[str(k)] = None if a is None else {
            "owner": str(a.owner), "lamports": a.lamports, "data_hex": bytes(a.data).hex()}
    return out


def run(image_path, instruction, user_bytes=None, mutation=None, length=137,
        offset=None, value=None, prefund=0, acc_lamports=10**9):
    h = Harness(image_path)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for k in [PAYER, OUTSIDER]:
        vm.set_account(k.pubkey(), Account(10**12, b"", Pubkey.default()))
    user = Pubkey.from_bytes(user_bytes) if user_bytes is not None else PAYER.pubkey()
    accumulator = Pubkey.find_program_address([b"user_volume_accumulator", bytes(user)], PROGRAM)[0]
    if mutation == "pda":
        accumulator = Pubkey.from_bytes(bytes([88]) * 32)
    raw = (DISC + bytes(user) + bytes(97))[:length].ljust(length, b"\0")
    owner = PROGRAM if instruction.startswith("close") or mutation == "existing" else Pubkey.default()
    if instruction.startswith("init") and mutation != "existing":
        raw = b""
    if mutation == "stored-user":
        raw = raw[:8] + OUTSIDER_B + raw[40:]
    if mutation == "owner":
        owner = Pubkey.default()
    if mutation == "discriminator":
        raw = bytes([raw[0] ^ 1]) + raw[1:]
    if offset is not None:
        raw = raw[:offset] + value + raw[offset + len(value):]
    funded = acc_lamports if instruction.startswith("close") or mutation == "existing" else prefund
    vm.set_account(accumulator, Account(funded, raw, owner))
    event = EVENT if mutation != "event" else OUTSIDER.pubkey()
    program = PROGRAM if mutation != "program" else OUTSIDER.pubkey()
    if instruction.startswith("init"):
        payer = OUTSIDER if mutation == "payer-readonly" else PAYER
        accounts = [AccountMeta(PAYER.pubkey(), True, mutation != "payer-readonly"),
                    AccountMeta(user, False, False),
                    AccountMeta(accumulator, False, mutation != "readonly"),
                    AccountMeta(Pubkey.default(), False, False),
                    AccountMeta(event, False, False),
                    AccountMeta(program, False, False)]
        signers = [PAYER] if payer == PAYER else [payer, PAYER]
    else:
        payer = OUTSIDER if mutation == "unsigned" else PAYER
        accounts = [AccountMeta(user, mutation != "unsigned", True),
                    AccountMeta(accumulator, False, mutation != "readonly"),
                    AccountMeta(event, False, False),
                    AccountMeta(program, False, False)]
        signers = [payer]
    keys = [PAYER.pubkey(), OUTSIDER.pubkey(), accumulator, EVENT]
    before = snap(vm, keys)
    data = bytes(next(x for x in IDL["instructions"] if x["name"] == instruction)["discriminator"])
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, data, accounts)], payer.pubkey(), signers, vm.latest_blockhash())
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    after = snap(vm, keys)
    logs = meta.logs()
    return {"error": str(r.err()) if failed else None,
            "tx": base64.b64encode(bytes(tx)).decode(),
            "before": before, "after": after, "logs": logs,
            "events": [x for x in logs if x.startswith("Program data: ")],
            "acc_key": str(accumulator), "user_bytes": bytes(user),
            "tx_payer": str(tx.message.account_keys[0]),
            "sig_fields": len(tx.signatures)}


receipts_global = []
report_cases = []
for index, (label, case, expected) in enumerate(CASES):
    row = {"case": {"instruction": case["instruction"], "label": label,
                    "params": {k: (v.hex() if isinstance(v, bytes) else v)
                               for k, v in case.items() if k != "instruction"},
                    "expected": list(expected)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        r = run(IMAGES[image], **case)
        raw = base64.b64decode(r["tx"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == r["sig_fields"], (label, image, checks)
        before, after = r["before"], r["after"]
        acc_key, payer_key = r["acc_key"], r["tx_payer"]
        payer_delta = (after[payer_key]["lamports"] if after[payer_key] else 0) - \
                      (before[payer_key]["lamports"] if before[payer_key] else 0)
        acc_after = after[acc_key]
        observed = {
            "acc_lamports_after": None if acc_after is None else acc_after["lamports"],
            "acc_data_hex_after": None if acc_after is None else acc_after["data_hex"],
            "payer_delta": payer_delta,
            "event_count": len(r["events"]),
            "sig_fields": r["sig_fields"],
        }
        err, logs = r["error"], r["logs"]
        if expected[0] == "ok-init":
            assert err is None, (label, image, err)
            assert observed["acc_lamports_after"] == expected[1], (label, image, observed, expected)
            assert observed["payer_delta"] == expected[2], (label, image, observed, expected)
            assert observed["event_count"] == 1, (label, image, "no event")
            if case.get("mutation") == "existing":
                bdata = bytes.fromhex(before[acc_key]["data_hex"])
                assert observed["acc_data_hex_after"] == (bdata[:8] + PAYER_B + bdata[40:]).hex(), \
                    (label, image, "existing data not preserved")
            else:
                assert observed["acc_data_hex_after"] == (DISC + r["user_bytes"] + bytes(97)).hex(), \
                    (label, image, "fresh data mismatch")
        elif expected[0] == "ok-close":
            assert err is None, (label, image, err)
            assert acc_after is None, (label, image, "account not closed")
            assert observed["payer_delta"] == expected[1], (label, image, observed, expected)
            assert observed["event_count"] == 1, (label, image, "no event")
        else:
            _, code, fragment, fee = expected
            assert err is not None and code in err, (label, image, err)
            assert fragment in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == -fee, (label, image, payer_delta, fee)
            assert all(before[k] == after[k] for k in before if k != payer_key), \
                (label, image, "rollback")
            if code == "MissingAccount":
                assert observed["event_count"] == 1, (label, image, "event missing on MissingAccount")
            else:
                assert observed["event_count"] == 0, (label, image, "unexpected event")
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            row.setdefault("error_sites", {})[image] = site
        seen.add((err, tuple(sorted((k, str(v)) for k, v in observed.items()))))
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image,
                        "instruction": case["instruction"], "label": label},
            "transaction_base64": r["tx"],
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
            "all_signatures_verified": True, "signature_fields": r["sig_fields"],
            "before": before, "after": after,
            "metadata": {"signature": str(tx.signatures[0]), "logs": logs,
                         "events": r["events"]},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                      "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
            "loaded_programs": {
                "pAMM": {"path": "evidence/original/pump_amm/deployed.so",
                         "sha256": IMAGE_SHA[image]}},
            "error": err, "rollback_except_payer_fee": err is not None,
            "payer_delta_lamports": payer_delta,
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
    "scripts/pump_amm_accumulator_differential.py",
    "scripts/pump_amm_admin_differential.py",
]
report = {"schema": 1, "packet": "amm-init-close-volume-accumulator-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("init_user_volume_accumulator and close_user_volume_accumulator on "
                    "synthetic fixtures, fresh VM per case per image (original / #424 "
                    "control / #427 candidate). Receipts are stored as parts to stay "
                    "under GitHub's 25MB web-upload limit; verify.py reads them in "
                    "order. Snapshots cover non-executable accounts only (payer, "
                    "outsider, accumulator PDA, event authority). No token program "
                    "is involved, so no inner token instructions are recorded."),
          "image_sha256": IMAGE_SHA,
          "cases": report_cases,
          "counts": {"vms": len(receipts_global),
                     "transactions": len(receipts_global),
                     "signature_fields": sum(r["signature_fields"] for r in receipts_global)},
          "input_sha256": {n: sha((ROOT / n).read_bytes()) for n in repo_inputs},
          "transaction_receipts": {"parts": parts}}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(json.dumps(report, indent=1).encode(), mtime=0))
print(f"cases: {len(report_cases)} receipts: {len(receipts_global)}")
print(f"wrote: {OUT / 'runtime/report.json.gz'}")
