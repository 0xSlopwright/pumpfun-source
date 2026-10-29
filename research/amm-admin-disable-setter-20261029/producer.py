#!/usr/bin/env python3
"""Build research/amm-admin-disable-setter-20261029 receipts.

2nd run packet #46: the admin `disable` instruction's own setter
semantics plus its downstream binding to all five gated paths.

Prior packets only ever PATCHED disable_flags directly in the
fixture: 1st trade-disable-flags (buy 6020 / sell 6021),
1st liquidity-disable-flags (deposit 6018 / withdraw 6019), and
2nd #27 used `disable` once as a probe after an admin rotation
(flags 0 -> 1, 53-byte DisableEvent). Nobody pinned what the
`disable` instruction itself does: which byte it writes, whether
it preserves the high bits, how its five bools map to bits, its
event layout, its argument validation, its truncation boundary,
its authorization map, or a chained setter -> gated-instruction
proof for every one of the five gates (create 6017 included,
which no earlier packet chained at all).

Source (lib.rs `disable`, AdminGlobal context):
- five bools are written bit by bit into global_config byte 56:
  create -> bit 0, deposit -> bit 1, withdraw -> bit 2,
  buy -> bit 3, sell -> bit 4, each as
  (flags & !bit) | (bool << shift). Bits 5..7 are never touched;
- a 53-byte DisableEvent is emitted (disc, timestamp, admin,
  five bools) via emit! + emit_cpi!;
- the instruction takes exactly five Borsh bools: a byte other
  than 0/1, or fewer than five bytes, fails 102
  InstructionDidNotDeserialize before any state change; a
  trailing byte is ignored;
- because Anchor serializes the whole GlobalConfig on exit,
  a config shorter than 949 bytes fails at write-back:
  906 bytes -> InvalidAccountData before the handler runs
  (0 events), 907/948 bytes -> BorshIoError("failed to write
  whole buffer") AFTER the handler ran, so the DisableEvent
  stays in the log as a ghost (the #27 update_admin pattern);
- authorization is the shared AdminGlobal map: outside signer
  6005 InvalidAdmin (caused by account: global_config),
  unsigned admin 3010 AccountNotSigner (caused by account:
  admin), read-only config 2000 ConstraintMut, wrong-owner
  config 3007 AccountOwnedByWrongProgram.
"""
import base64
import gzip
import hashlib
import json
import shutil
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
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

from pump_amm_admin_differential import Harness
from pump_amm_admin_differential import (
    CONFIG, CONFIG_KEY, EVENT, IDL, PAYER, PROGRAM, RAW,
)
from pump_amm_liquidity_differential import (
    TOKEN, TOKEN22,
    f as LIQ_F, pool as LIQ_POOL, base as LIQ_BASE, quote as LIQ_QUOTE,
    vaultbase as LIQ_VB, vaultquote as LIQ_VQ, userbase as LIQ_UB,
    userquote as LIQ_UQ, userlp as LIQ_ULP, lp as LIQ_LP, supply as LIQ_SUPPLY,
    token as liq_token,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, volume
from pump_amm_create_differential import (
    ATA, base as CRE_BASE, quote as CRE_QUOTE, userbase as CRE_UB,
    userquote as CRE_UQ, f as CRE_F,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-admin-disable-setter-20261029"
WS = Path.home() / "workspace/slop-verify"
OUTSIDER = Keypair.from_seed(bytes([202]) * 32)
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
DISABLE_DISC = bytes.fromhex("b9adbb5ad80feee9")
EVENT_DISC = "6bfdc14ce4ca1b68"
PAYER_HEX = bytes(PAYER.pubkey()).hex()


def sha(data):
    return hashlib.sha256(data).hexdigest()


def hx(b):
    return bytes(b).hex()


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        out[str(k)] = None if (not a or a.executable) else {
            "lamports": a.lamports, "owner": str(a.owner),
            "data_hex": bytes(a.data).hex()}
    return out


def amount_at(data_hex, offset=64):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


def disable_ix(signer, signer_flag, payload, cfg_writable=True):
    metas = [AccountMeta(signer.pubkey(), signer_flag, False),
             AccountMeta(CONFIG_KEY, False, cfg_writable),
             AccountMeta(EVENT, False, False),
             AccountMeta(PROGRAM, False, False)]
    return Instruction(PROGRAM, DISABLE_DISC + payload, metas)


def decode_disable_event(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    if raw[:8].hex() != EVENT_DISC or len(raw) != 53:
        return None
    return {"disc": raw[:8].hex(),
            "timestamp": struct.unpack_from("<q", raw, 8)[0],
            "admin": raw[16:48].hex(),
            "bools": list(raw[48:53])}


def send(vm, ix, payer):
    tx = Transaction.new_signed_with_payer(
        [ix], payer.pubkey(), [payer], vm.latest_blockhash())
    assert all(tx.verify_with_results())
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    logs = meta.logs()
    return {"tx": tx, "raw": bytes(tx), "logs": logs,
            "err": str(r.err()) if failed else None, "failed": failed,
            "events": len([l for l in logs if l.startswith("Program data: ")]),
            "site": next((l for l in logs if "thrown in" in l or "caused by account" in l), None)}


def disable_event_for(bools, ts):
    return {"disc": EVENT_DISC, "timestamp": ts, "admin": PAYER_HEX,
            "bools": list(bools)}


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


# ---------------- family A: admin-only VM ----------------
def run_case_A(label, setup, payload, signer, signer_flag, payer, cfg_writable,
               owner, exp, binary):
    vm = Harness(binary).vm
    data = setup.get("data", bytes(RAW))
    vm.set_account(CONFIG_KEY, Account(
        setup.get("lamports", CONFIG["lamports"]), bytes(data),
        setup.get("owner", owner)))
    before_cfg = bytes(vm.get_account(CONFIG_KEY).data)
    before_lamp = vm.get_account(CONFIG_KEY).lamports
    payer_before = vm.get_account(payer.pubkey()).lamports
    r = send(vm, disable_ix(signer, signer_flag, payload, cfg_writable), payer)
    after_acct = vm.get_account(CONFIG_KEY)
    after_cfg = bytes(after_acct.data) if after_acct else None
    after_lamp = after_acct.lamports if after_acct else None
    payer_after = vm.get_account(payer.pubkey()).lamports
    ev = decode_disable_event(r["logs"]) if r["events"] == 1 else None
    if r["events"] not in (0, 1):
        ev = "multiple"
    flags_after = after_cfg[56] if after_cfg and len(after_cfg) > 56 else None
    diffs = ([i for i in range(min(len(before_cfg), len(after_cfg)))
              if before_cfg[i] != after_cfg[i]] if after_cfg else None)
    observed = {"flags_before": before_cfg[56], "flags_after": flags_after,
                "length": len(after_cfg) if after_cfg else None,
                "diffs": diffs, "event": ev, "event_count": r["events"],
                "payer_paid": payer_before - payer_after,
                "rollback": before_cfg == after_cfg and before_lamp == after_lamp,
                "error": r["err"]}
    # assertions (measured truth, per image)
    if exp["kind"] == "ok":
        assert not r["failed"] and r["err"] is None, (label, binary, r["err"])
        assert flags_after == exp["flags"], (label, binary, flags_after, exp["flags"])
        assert diffs == exp["diffs"], (label, binary, diffs, exp["diffs"])
        assert ev == disable_event_for(exp["bools"], 0), (label, binary, ev)
    else:
        assert r["failed"], (label, binary, "expected failure")
        assert exp["code"] in (r["err"] or ""), (label, binary, r["err"])
        assert exp["fragment"] in "\n".join(r["logs"]), (label, binary, r["logs"][-3:])
        assert observed["rollback"], (label, binary, "no rollback")
        assert flags_after == before_cfg[56], (label, binary, "flags moved on failure")
        if exp.get("ghost"):
            assert r["events"] == 1 and ev == disable_event_for(exp["bools"], 0), \
                (label, binary, ev)
        else:
            assert r["events"] == 0, (label, binary, r["events"])
        if exp.get("site_fragment"):
            assert r["site"] and exp["site_fragment"] in r["site"], \
                (label, binary, r["site"])
    assert observed["payer_paid"] == 5000, (label, binary, observed["payer_paid"])
    assert observed["length"] == exp["length"], (label, binary, observed["length"])
    before = {str(CONFIG_KEY): {"lamports": before_lamp, "data_hex": before_cfg.hex()},
              str(payer.pubkey()): {"lamports": payer_before, "data_hex": ""}}
    after = {str(CONFIG_KEY): {"lamports": after_lamp,
                               "data_hex": after_cfg.hex() if after_cfg else None},
             str(payer.pubkey()): {"lamports": payer_after, "data_hex": ""}}
    return observed, before, after, r


def A_ok(flags, bools, diffs):
    return {"kind": "ok", "flags": flags, "bools": bools, "diffs": diffs, "length": 949}


def A_err(code, fragment, length=949, ghost=False, bools=None, site_fragment=None):
    return {"kind": "err", "code": code, "fragment": fragment, "length": length,
            "ghost": ghost, "bools": bools, "site_fragment": site_fragment}


BASE = bytearray(RAW)
BASE[56] = 0
P224 = bytearray(RAW)
P224[56] = 224
P31 = bytearray(RAW)
P31[56] = 31
CASES_A = [
    ("dis-all-false", {}, bytes([0, 0, 0, 0, 0]), PAYER, True, PAYER, True, PROGRAM,
     A_ok(0, [0, 0, 0, 0, 0], [])),
    ("dis-all-true", {}, bytes([1, 1, 1, 1, 1]), PAYER, True, PAYER, True, PROGRAM,
     A_ok(31, [1, 1, 1, 1, 1], [56])),
    ("dis-create-only", {}, bytes([1, 0, 0, 0, 0]), PAYER, True, PAYER, True, PROGRAM,
     A_ok(1, [1, 0, 0, 0, 0], [56])),
    ("dis-deposit-only", {}, bytes([0, 1, 0, 0, 0]), PAYER, True, PAYER, True, PROGRAM,
     A_ok(2, [0, 1, 0, 0, 0], [56])),
    ("dis-withdraw-only", {}, bytes([0, 0, 1, 0, 0]), PAYER, True, PAYER, True, PROGRAM,
     A_ok(4, [0, 0, 1, 0, 0], [56])),
    ("dis-buy-only", {}, bytes([0, 0, 0, 1, 0]), PAYER, True, PAYER, True, PROGRAM,
     A_ok(8, [0, 0, 0, 1, 0], [56])),
    ("dis-sell-only", {}, bytes([0, 0, 0, 0, 1]), PAYER, True, PAYER, True, PROGRAM,
     A_ok(16, [0, 0, 0, 0, 1], [56])),
    ("dis-preset224-false", {"data": P224}, bytes([0, 0, 0, 0, 0]),
     PAYER, True, PAYER, True, PROGRAM, A_ok(224, [0, 0, 0, 0, 0], [])),
    ("dis-preset224-true", {"data": P224}, bytes([1, 1, 1, 1, 1]),
     PAYER, True, PAYER, True, PROGRAM, A_ok(255, [1, 1, 1, 1, 1], [56])),
    ("dis-preset31-false", {"data": P31}, bytes([0, 0, 0, 0, 0]),
     PAYER, True, PAYER, True, PROGRAM, A_ok(0, [0, 0, 0, 0, 0], [56])),
    ("dis-bool2", {}, bytes([2, 0, 0, 0, 0]), PAYER, True, PAYER, True, PROGRAM,
     A_err("102", "InstructionDidNotDeserialize")),
    ("dis-args-empty", {}, b"", PAYER, True, PAYER, True, PROGRAM,
     A_err("102", "InstructionDidNotDeserialize")),
    ("dis-args-4bytes", {}, bytes([1, 1, 1, 1]), PAYER, True, PAYER, True, PROGRAM,
     A_err("102", "InstructionDidNotDeserialize")),
    ("dis-trailing", {}, bytes([1, 0, 0, 0, 0, 0xFF]), PAYER, True, PAYER, True, PROGRAM,
     A_ok(1, [1, 0, 0, 0, 0], [56])),
    ("dis-trunc-906", {"data": bytes(RAW[:906])}, bytes([1, 1, 1, 1, 1]),
     PAYER, True, PAYER, True, PROGRAM,
     A_err("InvalidAccountData", "InvalidAccountData", length=906,
           site_fragment="caused by account: global_config")),
    ("dis-trunc-907", {"data": bytes(RAW[:907])}, bytes([1, 1, 1, 1, 1]),
     PAYER, True, PAYER, True, PROGRAM,
     A_err("BorshIoError", "failed to write whole buffer", length=907,
           ghost=True, bools=[1, 1, 1, 1, 1],
           site_fragment="caused by account: global_config")),
    ("dis-trunc-948", {"data": bytes(RAW[:948])}, bytes([1, 1, 1, 1, 1]),
     PAYER, True, PAYER, True, PROGRAM,
     A_err("BorshIoError", "failed to write whole buffer", length=948,
           ghost=True, bools=[1, 1, 1, 1, 1],
           site_fragment="caused by account: global_config")),
    ("dis-outsider", {}, bytes([1, 0, 0, 0, 0]), OUTSIDER, True, OUTSIDER, True, PROGRAM,
     A_err("6005", "InvalidAdmin", site_fragment="caused by account: global_config")),
    ("dis-unsigned", {}, bytes([1, 0, 0, 0, 0]), PAYER, False, OUTSIDER, True, PROGRAM,
     A_err("3010", "AccountNotSigner", site_fragment="caused by account: admin")),
    ("dis-readonly", {}, bytes([1, 0, 0, 0, 0]), PAYER, True, PAYER, False, PROGRAM,
     A_err("2000", "ConstraintMut", site_fragment="caused by account: global_config")),
    ("dis-wrongowner", {}, bytes([1, 0, 0, 0, 0]), PAYER, True, PAYER, True, TOKEN,
     A_err("3007", "AccountOwnedByWrongProgram",
           site_fragment="caused by account: global_config")),
]

for index, (label, setup, payload, signer, sflag, payer, cw, owner, exp) in enumerate(CASES_A):
    row = {"case": {"family": "A", "instruction": "disable", "label": label,
                    "payload": list(payload), "expected": exp}}
    seen = set()
    for image, binary in IMAGES.items():
        observed, before, after, r = run_case_A(
            label, setup, payload, signer, sflag, payer, cw, owner, exp, binary)
        seen.add(json.dumps(observed, sort_keys=True))
        if exp["kind"] == "err":
            row.setdefault("error_sites", {})[image] = r["site"]
        add_receipt({"index": index, "image": image, "family": "A",
                     "instruction": "disable", "label": label},
                    r["raw"], [str(s) for s in r["tx"].signatures], before, after,
                    r["logs"], r["events"], r["err"], observed["payer_paid"],
                    observed, {"fee_payer": str(payer.pubkey()),
                               "global_config": str(CONFIG_KEY)})
        row[image] = {"error": r["err"], "logs": r["logs"], "observed": observed}
        print(f"  A {label} [{image}] flags={observed['flags_after']} "
              f"events={r['events']} err={r['err']}", flush=True)
    assert len(seen) == 1, (label, "images must agree", seen)
    report_cases.append(row)


# ---------------- family B: chained VMs ----------------
def fee_table_apply(vm, tiers):
    a = vm.get_account(feeconfig)
    raw = bytes(a.data[:41]) + struct.pack("<QQQ", 25, 5, 0) + struct.pack("<I", len(tiers))
    for threshold, fees in tiers:
        raw += threshold.to_bytes(16, "little") + struct.pack("<QQQ", *fees)
    raw += struct.pack("<I", 0) + bytes(24)
    vm.set_account(feeconfig, Account(a.lamports, raw.ljust(4097, b"\0"), a.owner))


def build_trade_vm(binary):
    h = Harness(binary)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, p in [(TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                   (TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so"),
                   (FEES, "evidence/original/pump_fees/deployed.so")]:
        vm.add_program_from_file(pid, ROOT / p)
    for n, rrow in LIQ_F["accounts"].items():
        vm.set_account(Pubkey.from_string(rrow["address"]),
                       Account(rrow["lamports"], base64.b64decode(rrow["data_base64"]),
                               Pubkey.from_string(rrow["owner"])))
    vm.set_account(LIQ_UB, Account(10**9, liq_token(LIQ_BASE, PAYER.pubkey(), 10**15, False), TOKEN))
    vm.set_account(LIQ_UQ, Account(10**15 + 2039280, liq_token(LIQ_QUOTE, PAYER.pubkey(), 10**15, True), TOKEN))
    vm.set_account(volume, Account(0, b"", Pubkey.default()))
    fee_table_apply(vm, [(0, (10, 111, 0))])
    for key, amount in ((LIQ_VB, 10**12), (LIQ_VQ, 10**10)):
        a = vm.get_account(key)
        d = bytearray(a.data); d[64:72] = struct.pack("<Q", amount)
        vm.set_account(key, Account(a.lamports, bytes(d), a.owner))
    a = vm.get_account(LIQ_BASE)
    d = bytearray(a.data); d[36:44] = struct.pack("<Q", 10**12)
    vm.set_account(LIQ_BASE, Account(a.lamports, bytes(d), a.owner))
    a = vm.get_account(LIQ_POOL)
    d = bytearray(a.data)
    d[245:261] = (0).to_bytes(16, "little", signed=True)
    d[243] = 0
    d[271:279] = struct.pack("<Q", 0)
    d[279:287] = struct.pack("<Q", 0)
    vm.set_account(LIQ_POOL, Account(a.lamports, bytes(d), a.owner))
    glob = bytearray(RAW); glob[56] = 0
    vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
    vm.set_account(EVENT, Account(10**9, b"", Pubkey.default()))
    assert bytes(vm.get_account(LIQ_POOL).data)[244] == 0
    return vm


def trade_keys():
    ix_names = {}
    return [LIQ_POOL, PAYER.pubkey(), CONFIG_KEY, LIQ_BASE, LIQ_QUOTE, LIQ_UB,
            LIQ_UQ, LIQ_VB, LIQ_VQ, TOKEN, TOKEN, Pubkey.default(), volume,
            feeconfig, buyback, EVENT, PROGRAM]


def trade_ix(ix_name, amount, limit):
    ix = next(x for x in IDL["instructions"] if x["name"] == ix_name)
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(trade_keys(), ix["accounts"])]
    return Instruction(PROGRAM, bytes(ix["discriminator"]) + struct.pack("<QQ", amount, limit), metas)


def trade_event_fields(ix_name, logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    assert len(lines) == 1, lines
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    offs = (64, 72, 80, 88, 96, 104, 112) if ix_name == "buy_v2" else (64, 72, 80, 88, 96)
    assert len(raw) >= max(offs) + 8, len(raw)
    return tuple(struct.unpack_from("<Q", raw, off)[0] for off in offs)


def pool_deltas(before_hex, after_hex):
    b, a = bytes.fromhex(before_hex), bytes.fromhex(after_hex)
    return (int.from_bytes(a[245:261], "little", signed=True) - int.from_bytes(b[245:261], "little", signed=True),
            struct.unpack_from("<Q", a, 271)[0] - struct.unpack_from("<Q", b, 271)[0],
            struct.unpack_from("<Q", a, 279)[0] - struct.unpack_from("<Q", b, 279)[0])


def run_trade_chain(label, gate_bools, gate_ix_label, gated_ix, gated_code,
                    gated_fragment, live_ix, live_deltas, live_event, binary):
    vm = build_trade_vm(binary)
    watch = trade_keys()
    steps = []
    # step 0: disable
    before = snap(vm, watch)
    payer_before = before[str(PAYER.pubkey())]["lamports"]
    r = send(vm, disable_ix(PAYER, True, bytes(gate_bools)), PAYER)
    after = snap(vm, watch)
    assert not r["failed"], (label, binary, r["err"])
    assert after[str(CONFIG_KEY)]["data_hex"][112:114] == f"{sum(b << i for i, b in enumerate(gate_bools)):02x}", (label, binary)
    ev = decode_disable_event(r["logs"])
    assert ev == disable_event_for(gate_bools, 1234567890), (label, binary, ev)
    assert payer_before - after[str(PAYER.pubkey())]["lamports"] == 5000
    steps.append(("disable", r, before, after, {
        "flags_after": sum(b << i for i, b in enumerate(gate_bools)),
        "event": ev, "payer_paid": 5000}))
    # step 1: gated trade must fail
    before = snap(vm, watch)
    r = send(vm, trade_ix(gated_ix, 10**6, 2**64 - 1 if gated_ix == "buy_v2" else 1), PAYER)
    after = snap(vm, watch)
    assert r["failed"] and gated_code in (r["err"] or ""), (label, binary, r["err"])
    assert gated_fragment in "\n".join(r["logs"]), (label, binary, r["logs"][-3:])
    assert r["events"] == 0, (label, binary, r["events"])
    for k in watch:
        if k == PAYER.pubkey():
            assert before[str(k)]["lamports"] - after[str(k)]["lamports"] == 5000
        else:
            assert before[str(k)] == after[str(k)], (label, binary, k, "no rollback")
    steps.append((gated_ix, r, before, after, {
        "error_code": gated_code, "fragment": gated_fragment,
        "event_count": 0, "payer_paid": 5000}))
    # step 2: live trade succeeds with anchor deltas
    before = snap(vm, watch)
    r = send(vm, trade_ix(live_ix, 10**6, 2**64 - 1 if live_ix == "buy_v2" else 1), PAYER)
    after = snap(vm, watch)
    assert not r["failed"] and r["err"] is None, (label, binary, r["err"])
    assert r["events"] == 1, (label, binary, r["events"])
    deltas = {}
    for name, key in (("userbase", LIQ_UB), ("userquote", LIQ_UQ),
                      ("vaultbase", LIQ_VB), ("vaultquote", LIQ_VQ),
                      ("buyback", buyback)):
        deltas[name] = amount_at(after[str(key)]["data_hex"]) - amount_at(before[str(key)]["data_hex"])
    assert deltas == live_deltas, (label, binary, deltas, live_deltas)
    assert trade_event_fields(live_ix, r["logs"]) == live_event, (label, binary)
    assert pool_deltas(before[str(LIQ_POOL)]["data_hex"], after[str(LIQ_POOL)]["data_hex"]) == (-56, 56, 0), (label, binary)
    assert before[str(PAYER.pubkey())]["lamports"] - after[str(PAYER.pubkey())]["lamports"] == 1849400
    steps.append((live_ix, r, before, after, {
        "deltas": deltas, "event": list(live_event), "pool_deltas": [-56, 56, 0],
        "event_count": 1, "payer_paid": 1849400}))
    return steps


def build_liq_vm(binary):
    h = Harness(binary)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    vm.add_program_from_file(TOKEN, ROOT / "evidence/dependencies/spl_token/deployed.so")
    vm.add_program_from_file(TOKEN22, ROOT / "evidence/dependencies/spl_token_2022/deployed.so")
    for n in ["base_mint", "quote_mint", "pool_base_token_account", "pool_quote_token_account"]:
        row = LIQ_F["accounts"][n]
        key = Pubkey.from_string(LIQ_F["keys"][n])
        vm.set_account(key, Account(row["lamports"], base64.b64decode(row["data_base64"]),
                                    Pubkey.from_string(row["owner"])))
    data = bytearray(base64.b64decode(LIQ_F["accounts"]["pool"]["data_base64"]))
    data[245:261] = (0).to_bytes(16, "little", signed=True)
    data[271:287] = bytes(16)
    vm.set_account(LIQ_POOL, Account(LIQ_F["accounts"]["pool"]["lamports"], bytes(data), PROGRAM))
    mint = struct.pack("<I", 1) + bytes(LIQ_POOL) + struct.pack("<Q", LIQ_SUPPLY) + bytes([9, 1]) + bytes(36)
    vm.set_account(LIQ_LP, Account(10**9, mint, TOKEN22))
    for k, m, own, amt, nat in [(LIQ_UB, LIQ_BASE, TOKEN, 10**15, False),
                                (LIQ_UQ, LIQ_QUOTE, TOKEN, 10**15, True),
                                (LIQ_ULP, LIQ_LP, TOKEN22, LIQ_SUPPLY // 2, False)]:
        vm.set_account(k, Account(amt + 2039280 if nat else 10**9,
                                  liq_token(m, PAYER.pubkey(), amt, nat), own))
    glob = bytearray(RAW); glob[56] = 0
    vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
    return vm


LIQ_METAS = [(LIQ_POOL, False, True), (CONFIG_KEY, False, False), (PAYER.pubkey(), True, False),
             (LIQ_BASE, False, False), (LIQ_QUOTE, False, False), (LIQ_LP, False, True),
             (LIQ_UB, False, True), (LIQ_UQ, False, True), (LIQ_ULP, False, True),
             (LIQ_VB, False, True), (LIQ_VQ, False, True), (TOKEN, False, False),
             (TOKEN22, False, False), (EVENT, False, False), (PROGRAM, False, False)]


def liq_ix(name, amount, maxbase, maxquote):
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    metas = [AccountMeta(k, s, w) for k, s, w in LIQ_METAS]
    return Instruction(PROGRAM, bytes(ix["discriminator"]) + struct.pack("<QQQ", amount, maxbase, maxquote), metas)


def run_liq_chain(label, gate_bools, gated_name, gated_code, gated_fragment,
                  live_name, live_deltas, binary):
    vm = build_liq_vm(binary)
    watch = [k for k, _, _ in LIQ_METAS]
    steps = []
    before = snap(vm, watch)
    r = send(vm, disable_ix(PAYER, True, bytes(gate_bools)), PAYER)
    after = snap(vm, watch)
    assert not r["failed"], (label, binary, r["err"])
    assert decode_disable_event(r["logs"]) == disable_event_for(gate_bools, 1234567890)
    steps.append(("disable", r, before, after, {
        "flags_after": sum(b << i for i, b in enumerate(gate_bools)),
        "event": decode_disable_event(r["logs"]), "payer_paid": 5000}))
    before = snap(vm, watch)
    if gated_name == "deposit":
        ix = liq_ix("deposit", 10**9, 2**64 - 1, 2**64 - 1)
    else:
        ix = liq_ix("withdraw", 10**9, 0, 0)
    r = send(vm, ix, PAYER)
    after = snap(vm, watch)
    assert r["failed"] and gated_code in (r["err"] or ""), (label, binary, r["err"])
    assert gated_fragment in "\n".join(r["logs"]), (label, binary, r["logs"][-3:])
    assert r["events"] == 0
    for k in watch:
        if k == PAYER.pubkey():
            assert before[str(k)]["lamports"] - after[str(k)]["lamports"] == 5000
        else:
            assert before[str(k)] == after[str(k)], (label, binary, k)
    steps.append((gated_name, r, before, after, {
        "error_code": gated_code, "fragment": gated_fragment,
        "event_count": 0, "payer_paid": 5000}))
    before = snap(vm, watch)
    if live_name == "deposit":
        ix = liq_ix("deposit", 10**9, 2**64 - 1, 2**64 - 1)
    else:
        ix = liq_ix("withdraw", 10**9, 0, 0)
    r = send(vm, ix, PAYER)
    after = snap(vm, watch)
    assert not r["failed"] and r["err"] is None, (label, binary, r["err"])
    assert r["events"] == 1, (label, binary, r["events"])
    deltas = {}
    for name, key in (("userbase", LIQ_UB), ("userquote", LIQ_UQ), ("userlp", LIQ_ULP),
                      ("vaultbase", LIQ_VB), ("vaultquote", LIQ_VQ)):
        deltas[name] = amount_at(after[str(key)]["data_hex"]) - amount_at(before[str(key)]["data_hex"])
    assert deltas == live_deltas, (label, binary, deltas, live_deltas)
    assert before[str(PAYER.pubkey())]["lamports"] - after[str(PAYER.pubkey())]["lamports"] == 5000
    steps.append((live_name, r, before, after, {
        "deltas": deltas, "event_count": 1, "payer_paid": 5000}))
    return steps


def build_create_vm(binary):
    h = Harness(binary)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, name in ((TOKEN, "spl_token"), (TOKEN22, "spl_token_2022"),
                      (ATA, "associated_token")):
        vm.add_program_from_file(pid, str(ROOT / "evidence/dependencies" / name / "deployed.so"))
    glob = bytearray(RAW); glob[56] = 0
    vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
    for n in ["base_mint", "quote_mint"]:
        rrow = CRE_F["accounts"][n]
        vm.set_account(Pubkey.from_string(rrow["address"]),
                       Account(rrow["lamports"], base64.b64decode(rrow["data_base64"]),
                               Pubkey.from_string(rrow["owner"])))
    for key, mint, native in ((CRE_UB, CRE_BASE, False), (CRE_UQ, CRE_QUOTE, True)):
        vm.set_account(key, Account(10**15 + 2039280 if native else 10**9,
                                    liq_token(mint, PAYER.pubkey(), 10**15, native), TOKEN))
    pool = Pubkey.find_program_address([b"pool", struct.pack("<H", 0), bytes(PAYER.pubkey()),
                                        bytes(CRE_BASE), bytes(CRE_QUOTE)], PROGRAM)[0]
    lp = Pubkey.find_program_address([b"pool_lp_mint", bytes(pool)], PROGRAM)[0]
    ata = lambda owner, mint, program: Pubkey.find_program_address(
        [bytes(owner), bytes(program), bytes(mint)], ATA)[0]
    userlp = ata(PAYER.pubkey(), lp, TOKEN22)
    vb = ata(pool, CRE_BASE, TOKEN)
    vq = ata(pool, CRE_QUOTE, TOKEN)
    return vm, pool, lp, userlp, vb, vq


def create_ix(pool, lp, userlp, vb, vq, bamt, qamt):
    keys = [pool, CONFIG_KEY, PAYER.pubkey(), CRE_BASE, CRE_QUOTE, lp, CRE_UB, CRE_UQ,
            userlp, vb, vq, Pubkey.default(), TOKEN22, TOKEN, TOKEN, ATA, EVENT, PROGRAM]
    ix = next(x for x in IDL["instructions"] if x["name"] == "create_pool")
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    args = struct.pack("<HQQ", 0, bamt, qamt) + bytes(PAYER.pubkey()) + bytes([0])
    return Instruction(PROGRAM, bytes(ix["discriminator"]) + args, metas)


def create_event_fields(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    if raw[:8].hex() != "b1310cd2a076a774" or len(raw) < 344:
        return None
    return {"disc": raw[:8].hex(),
            "base_in": struct.unpack_from("<Q", raw, 116)[0],
            "quote_in": struct.unpack_from("<Q", raw, 124)[0],
            "pool_base": struct.unpack_from("<Q", raw, 132)[0],
            "pool_quote": struct.unpack_from("<Q", raw, 140)[0],
            "min_liq": struct.unpack_from("<Q", raw, 148)[0],
            "init_liq": struct.unpack_from("<Q", raw, 156)[0],
            "lp_out": struct.unpack_from("<Q", raw, 164)[0]}


def run_create_chain(label, binary):
    vm, pool, lp, userlp, vb, vq = build_create_vm(binary)
    watch = [pool, lp, CRE_UB, CRE_UQ, userlp, vb, vq, PAYER.pubkey(), CONFIG_KEY]
    steps = []
    before = snap(vm, watch)
    r = send(vm, disable_ix(PAYER, True, bytes([1, 0, 0, 0, 0])), PAYER)
    after = snap(vm, watch)
    assert not r["failed"], (label, binary, r["err"])
    assert decode_disable_event(r["logs"]) == disable_event_for([1, 0, 0, 0, 0], 1234567890)
    steps.append(("disable", r, before, after, {
        "flags_after": 1, "event": decode_disable_event(r["logs"]), "payer_paid": 5000}))
    before = snap(vm, watch)
    r = send(vm, create_ix(pool, lp, userlp, vb, vq, 100, 10200), PAYER)
    after = snap(vm, watch)
    assert r["failed"] and "6017" in (r["err"] or ""), (label, binary, r["err"])
    assert "DisabledCreatePool" in "\n".join(r["logs"]), (label, binary, r["logs"][-3:])
    assert r["events"] == 0
    assert after[str(pool)] is None and after[str(lp)] is None and after[str(userlp)] is None
    assert after[str(vb)] == before[str(vb)] and after[str(vq)] == before[str(vq)]
    steps.append(("create_pool", r, before, after, {
        "error_code": "6017", "fragment": "DisabledCreatePool",
        "event_count": 0, "payer_paid": 5000}))
    before = snap(vm, watch)
    r = send(vm, disable_ix(PAYER, True, bytes([0, 0, 0, 0, 0])), PAYER)
    after = snap(vm, watch)
    assert not r["failed"], (label, binary, r["err"])
    assert decode_disable_event(r["logs"]) == disable_event_for([0, 0, 0, 0, 0], 1234567890)
    steps.append(("disable", r, before, after, {
        "flags_after": 0, "event": decode_disable_event(r["logs"]), "payer_paid": 5000}))
    before = snap(vm, watch)
    r = send(vm, create_ix(pool, lp, userlp, vb, vq, 100, 10200), PAYER)
    after = snap(vm, watch)
    assert not r["failed"] and r["err"] is None, (label, binary, r["err"])
    assert r["events"] == 1
    assert create_event_fields(r["logs"]) == {
        "disc": "b1310cd2a076a774", "base_in": 100, "quote_in": 10200,
        "pool_base": 100, "pool_quote": 10200, "min_liq": 100,
        "init_liq": 1009, "lp_out": 909}, (label, binary, create_event_fields(r["logs"]))
    assert amount_at(after[str(userlp)]["data_hex"]) == 909
    assert amount_at(after[str(lp)]["data_hex"], 36) == 909
    assert amount_at(after[str(vb)]["data_hex"]) == 100
    assert amount_at(after[str(vq)]["data_hex"]) == 10200
    assert before[str(PAYER.pubkey())]["lamports"] - after[str(PAYER.pubkey())]["lamports"] == 10507640
    steps.append(("create_pool", r, before, after, {
        "init_liq": 1009, "lp_out": 909, "event_count": 1, "payer_paid": 10507640}))
    roles = {"fee_payer": str(PAYER.pubkey()), "global_config": str(CONFIG_KEY),
             "pool": str(pool), "lp_mint": str(lp), "userlp": str(userlp),
             "vaultbase": str(vb), "vaultquote": str(vq),
             "userbase": str(CRE_UB), "userquote": str(CRE_UQ)}
    return steps, roles


BUY_DELTAS = {"userbase": 10**6, "userquote": -10124, "vaultbase": -10**6,
              "vaultquote": 10068, "buyback": 56}
SELL_DELTAS = {"userbase": -10**6, "userquote": 9878, "vaultbase": 10**6,
               "vaultquote": -9933, "buyback": 55}
DEP_DELTAS = {"userbase": -160619895224, "userquote": -29312440, "userlp": 10**9,
              "vaultbase": 160619895224, "vaultquote": 29312440}
WD_DELTAS = {"userbase": 160619895223, "userquote": 29312439, "userlp": -10**9,
             "vaultbase": -160619895223, "vaultquote": -29312439}
CASES_B = [
    ("chain-buy-gate", "trade-buy", ([0, 0, 0, 1, 0], "buy_v2", "6020", "DisabledBuy",
                                     "sell_v2", SELL_DELTAS, (9999, 10, 10, 111, 111))),
    ("chain-sell-gate", "trade-sell", ([0, 0, 0, 0, 1], "sell_v2", "6021", "DisabledSell",
                                       "buy_v2", BUY_DELTAS, (10001, 10, 11, 111, 112, 10012, 10124))),
    ("chain-deposit-gate", "liq-deposit", ([0, 1, 0, 0, 0], "deposit", "6018", "DisabledDeposit",
                                           "withdraw", WD_DELTAS)),
    ("chain-withdraw-gate", "liq-withdraw", ([0, 0, 1, 0, 0], "withdraw", "6019", "DisabledWithdraw",
                                             "deposit", DEP_DELTAS)),
]

for label, kind, spec in CASES_B:
    row = {"case": {"family": "B", "instruction": "disable-chain", "label": label}}
    seen_by_step = {}
    for image, binary in IMAGES.items():
        if kind == "trade-buy" or kind == "trade-sell":
            gate, gated_ix, code, frag, live_ix, deltas, event = spec
            steps = run_trade_chain(label, gate, kind, gated_ix, code, frag,
                                    live_ix, deltas, event, binary)
        else:
            gate, gated_name, code, frag, live_name, deltas = spec
            steps = run_liq_chain(label, gate, gated_name, code, frag, live_name, deltas, binary)
        for step_index, (step_name, r, before, after, observed) in enumerate(steps):
            seen_by_step.setdefault(step_index, set()).add(json.dumps(observed, sort_keys=True))
            if "error_code" in observed:
                row.setdefault("error_sites", {})[f"{image}:{step_name}"] = r["site"]
            if kind in ("trade-buy", "trade-sell"):
                roles = {"fee_payer": str(PAYER.pubkey()), "global_config": str(CONFIG_KEY),
                         "pool": str(LIQ_POOL), "userbase": str(LIQ_UB), "userquote": str(LIQ_UQ),
                         "vaultbase": str(LIQ_VB), "vaultquote": str(LIQ_VQ),
                         "buyback": str(buyback), "volume": str(volume), "feeconfig": str(feeconfig)}
            else:
                roles = {"fee_payer": str(PAYER.pubkey()), "global_config": str(CONFIG_KEY),
                         "pool": str(LIQ_POOL), "base_mint": str(LIQ_BASE), "quote_mint": str(LIQ_QUOTE),
                         "lp_mint": str(LIQ_LP), "userbase": str(LIQ_UB), "userquote": str(LIQ_UQ),
                         "userlp": str(LIQ_ULP), "vaultbase": str(LIQ_VB), "vaultquote": str(LIQ_VQ)}
            add_receipt({"index": len(report_cases), "image": image, "family": "B",
                         "instruction": "disable-chain", "label": label, "step": step_index,
                         "step_name": step_name},
                        r["raw"], [str(s) for s in r["tx"].signatures], before, after,
                        r["logs"], r["events"], r["err"], observed["payer_paid"],
                        observed, roles)
            print(f"  B {label} step{step_index} {step_name} [{image}] err={r['err']} "
                  f"paid={observed['payer_paid']}", flush=True)
        row[image] = {"steps": [s[4] for s in steps]}
    for step_index, s in seen_by_step.items():
        assert len(s) == 1, (label, step_index, "images must agree", s)
    report_cases.append(row)

# create chain (4 steps)
row = {"case": {"family": "B", "instruction": "disable-chain", "label": "chain-create-gate"}}
seen_by_step = {}
for image, binary in IMAGES.items():
    steps, roles = run_create_chain("chain-create-gate", binary)
    for step_index, (step_name, r, before, after, observed) in enumerate(steps):
        seen_by_step.setdefault(step_index, set()).add(json.dumps(observed, sort_keys=True))
        if "error_code" in observed:
            row.setdefault("error_sites", {})[f"{image}:{step_name}"] = r["site"]
        add_receipt({"index": len(report_cases), "image": image, "family": "B",
                     "instruction": "disable-chain", "label": "chain-create-gate",
                     "step": step_index, "step_name": step_name},
                    r["raw"], [str(s) for s in r["tx"].signatures], before, after,
                    r["logs"], r["events"], r["err"], observed["payer_paid"],
                    observed, roles)
        print(f"  B chain-create-gate step{step_index} {step_name} [{image}] err={r['err']} "
              f"paid={observed['payer_paid']}", flush=True)
    row[image] = {"steps": [s[4] for s in steps]}
for step_index, s in seen_by_step.items():
    assert len(s) == 1, ("chain-create-gate", step_index, "images must agree", s)
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
    "scripts/pump_amm_trade_v2_differential.py",
    "scripts/pump_amm_create_differential.py",
    "scripts/pump_amm_reusable_harness.py",
]
report = {
    "schema": 1, "packet": "amm-admin-disable-setter-20261029",
    "case_count": len(report_cases), "mismatches": [],
    "scope": ("admin `disable` setter semantics plus downstream binding "
              "on all 3 images (original / #424 control / #427 candidate): "
              "five bools map bit by bit into global_config byte 56 "
              "(create 1, deposit 2, withdraw 4, buy 8, sell 16) with "
              "bits 5..7 preserved; a 53-byte DisableEvent echoes the "
              "bools; non-0/1 bool bytes and short arguments fail 102; "
              "a trailing byte is ignored; 906-byte configs fail "
              "InvalidAccountData with 0 events while 907/948-byte "
              "configs fail BorshIoError at write-back with the event "
              "left as a ghost in the log; authorization is 6005/3010/"
              "2000/3007; chained setter -> gated-instruction proofs "
              "cover create 6017, deposit 6018, withdraw 6019, buy 6020 "
              "and sell 6021, each with the ungated sibling succeeding "
              "at its anchor deltas. Fresh VM per family-A case per "
              "image; one chained VM per family-B case per image. "
              "Receipts are stored as parts to stay under GitHub's "
              "25MB web-upload limit; verify.py reads them in order. "
              "No source change, build, or whole-program equivalence claim."),
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

for row in report_cases:
    case = row["case"]
    if "error_sites" not in row:
        continue
    per = []
    for key in sorted(row["error_sites"]):
        site = row["error_sites"][key] or ""
        if site and "thrown in" in site:
            site = site.split("thrown in", 1)[1].strip()
        elif site:
            site = site.replace("Program log: ", "")
        per.append(f"{key} {site}")
    print(f"- {case['label']}: " + "; ".join(per))
