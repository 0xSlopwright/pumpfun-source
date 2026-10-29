#!/usr/bin/env python3
"""Build research/amm-update-buyback-config-20261029 receipts.

update_buyback_config: the one admin instruction no earlier packet
pinned. 1st #23 pinned has_one authorization and 1st #27 pinned
update_fee_config fee values; 2nd #27 pinned update_admin /
set_boost_authority / update_creator_fee_config state transitions
and 2nd #34 pinned the trade-side buyback split with fixture-set
buyback_basis_points. What was never pinned is the setter itself:
what it writes, what it validates, in what order, and whether the
value it writes actually drives the next trade. This packet pins
both halves -- the setter in isolation (family A, admin-only VM)
and the setter driving a real buy_v2 / sell_v2 (family B, chained
transactions in a trade VM).

Setter semantics (family A, config bytes: buyback recipients
643..899, buyback_basis_points 899..907):
- buyback_basis_points is Option<u64>: None leaves bps untouched
  (a bare None call with no remaining accounts is a silent no-op:
  bytes unchanged, 0 events, payer -5,000). Some(v) writes
  899..907 and nothing else.
- The bps cap is 10000, enforced by set_buyback_basis_points:
  Some(10000) succeeds, Some(10001) and Some(u64::MAX) fail with
  6056 BuybackBasisPointsOutOfRange (global_config.rs:306), fully
  rolled back.
- Recipients are replaced only when remaining_accounts is
  non-empty, and then it must be exactly 8: 7 or 9 remaining
  accounts fail with 6057 WrongBuybackFeeRecipientsCount
  (update_buyback_config.rs:40). Exactly 8 writes 643..899.
- Recipient validation is unique + nonzero ONLY, unlike the
  protocol-fee recipients which additionally require sorted order
  (set_protocol_fee_recipients): 8 strictly descending keys
  succeed and land in exactly that input order. One default key
  fails 6054 AllBuybackFeeRecipientsShouldBeNonZero
  (global_config.rs:347); one duplicate fails 6055
  NotUniqueBuybackFeeRecipients (global_config.rs:357).
- Order and atomicity: bps is set before recipients are checked,
  but a failure anywhere rolls the whole transaction back -- a
  valid bps plus duplicate recipients fails 6055 with bps still
  5000, and an invalid bps plus duplicate recipients fails 6056
  (bps checked first).
- One call can set both: Some(6000) + 8 new recipients writes
  643..907 in one transaction.
- Args: empty args and an option tag of 2 both fail 102
  InstructionDidNotDeserialize; a trailing byte after a valid
  Some payload is ignored and the write still succeeds.
- Auth (shared AdminGlobal map, same as #27): outsider signer
  6005 InvalidAdmin (caused by account: global_config), unsigned
  admin 3010 AccountNotSigner, readonly config 2000
  ConstraintMut, wrong-owner config 3007
  AccountOwnedByWrongProgram -- all fully rolled back, payer
  -5,000.
- Silence: every successful setter call emits 0 events, even
  though AdminGlobal carries #[event_cpi] -- the handler never
  calls emit_cpi (same silence #28 found for the toggles).
- Truncation: the custom GlobalConfig deserializer needs 907
  bytes total (899 after the 8-byte discriminator), so 906 bytes
  fails InvalidAccountData before the handler runs. At 907 or
  948 bytes the handler runs but the 949-byte struct cannot be
  written back, so the transaction fails with BorshIoError
  ("failed to write whole buffer", caused by account:
  global_config) and rolls back -- and unlike #27's update_admin
  ghost event, there is no event at all, because this handler
  emits nothing. The setter has no extend_global_config path, so
  no short config can ever be updated in place.
- The setter's 10000 cap also means the #34 buyback panic
  (buyback 10090, floor > protocol) is unreachable through this
  instruction: only direct config manipulation reaches it.

Downstream binding (family B, each case = update tx then trade
tx in one trade VM, tier (0, (lp 10, protocol 111, creator
300)), pool creator_fee_bps 0, configurable 1, VB 10^12,
VQ 10^10, supply 10^12):
- update bps 7500 -> buy 10^6: buyback floor(112*7500/10000)
  = 84, vault +10341, pool protocol 28, vq -329, event
  buyback_bps 7500 / buyback_fee 84.
- update bps 10000 -> buy 10^6: buyback 112 (whole protocol
  fee), vault +10313, pool protocol 0, vq -301.
- update bps 0 -> buy 10^6: buyback 0, vault +10425, pool
  protocol 112, vq -413.
- update bps 7500 -> sell 10^6: buyback floor(111*7500/10000)
  = 83, user +9578, vault -9661, pool protocol 28, vq -328.
- update recipients to 8 new keys including NEWREC -> buy with
  NEWREC's ATA: buyback 56 at the unchanged bps 5000, vault
  +10369, pool protocol 56.
- update recipients to 8 keys excluding the old recipient ->
  buy with the old buyback ATA: 6053
  BuybackFeeRecipientNotAuthorized, zero deltas, pool
  unchanged, payer -5,000 for the failed buy.
- update bps 7500 AND recipients in one call -> buy with
  NEWREC's ATA: buyback 84, vault +10341.

All three images (original / #424 control / #427 candidate)
agree on every case: this packet pins behavior, it does not
claim a divergence. Error sites are recorded per image in the
report; verify checks error codes and error names, which are
image-independent, since rebuilt images may report different
line numbers (the #36 precedent).
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
from solders.litesvm import LiteSVM
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

from pump_amm_admin_differential import Harness
from pump_amm_liquidity_differential import (
    CONFIG, CONFIG_KEY, EVENT, IDL, PAYER, PROGRAM, RAW, TOKEN, TOKEN22,
    base, combine, f, pool, quote, token, userbase, userquote, vaultbase,
    vaultquote,
)
from pump_amm_trade_v2_differential import (
    FEES, buyback, feeconfig, volume,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-update-buyback-config-20261029"
WS = Path.home() / "workspace/slop-verify"
OUTSIDER = Keypair.from_seed(bytes([202]) * 32)
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
FEES_SHA = hashlib.sha256((ROOT / "evidence/original/pump_fees/deployed.so").read_bytes()).hexdigest()
PUMP_SHA = hashlib.sha256((ROOT / "evidence/original/pump/deployed.so").read_bytes()).hexdigest()

ATA_PROG = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
BB_DISC = bytes.fromhex('fbe0ab92a01a71e9')
FIXTURE_RECIP = [bytes(RAW[643 + i * 32:643 + (i + 1) * 32]).hex() for i in range(8)]
NEW = [Pubkey.from_bytes(bytes([210 + i]) * 32) for i in range(9)]
UNSORTED = sorted(NEW[:8], reverse=True)
NEW8A = NEW[:8]
NEWREC = Pubkey.from_bytes(bytes([240]) * 32)
CHAIN_NEW8 = [NEWREC] + [Pubkey.from_bytes(bytes([241 + i]) * 32) for i in range(7)]
CHAIN_OLD8 = [Pubkey.from_bytes(bytes([248 + i]) * 32) for i in range(8)]
NEWATA = Pubkey.find_program_address([bytes(NEWREC), bytes(TOKEN), bytes(quote)], ATA_PROG)[0]
TIERS = [(0, (10, 111, 300))]
VB, VQ, SUPPLY = 10 ** 12, 10 ** 10, 10 ** 12
BUY_EV_OFFS = (64, 72, 80, 88, 96, 104, 112, 344, 352, 427, 435, 468, 476, 484)
SELL_EV_OFFS = (64, 72, 80, 88, 96, 104, 112, 344, 352, 376, 384, 417, 425, 433)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def hx(b):
    return bytes(b).hex()


def some(v):
    return b'\x01' + struct.pack('<Q', v)


def none():
    return b'\x00'


def recip_hex(keys):
    return [hx(bytes(k)) for k in keys]


def bb_ix(signer, signer_flag, payload, remaining, cfg_writable=True):
    metas = [AccountMeta(signer.pubkey(), signer_flag, False),
             AccountMeta(CONFIG_KEY, False, cfg_writable),
             AccountMeta(EVENT, False, False),
             AccountMeta(PROGRAM, False, False)]
    for k in remaining:
        metas.append(AccountMeta(k, False, False))
    return Instruction(PROGRAM, BB_DISC + payload, metas)


# ---------------- family A: admin-only VM ----------------
def S(ix, payer, **exp):
    return (ix, payer, exp)


CASES_A = [
    ("bb-none-noop", {}, [
        S(bb_ix(PAYER, True, none(), []), PAYER, err=None, events=[],
          bps=5000, recipients=FIXTURE_RECIP, length=949, payer_delta=5000,
          rollback=True),
    ]),
    ("bb-set-0", {}, [
        S(bb_ix(PAYER, True, some(0), []), PAYER, err=None, events=[],
          bps=0, recipients=FIXTURE_RECIP, length=949, payer_delta=5000,
          diff_subsets=[(899, 907)]),
    ]),
    ("bb-set-1", {}, [
        S(bb_ix(PAYER, True, some(1), []), PAYER, err=None, events=[],
          bps=1, recipients=FIXTURE_RECIP, length=949, payer_delta=5000,
          diff_subsets=[(899, 907)]),
    ]),
    ("bb-set-7500", {}, [
        S(bb_ix(PAYER, True, some(7500), []), PAYER, err=None, events=[],
          bps=7500, recipients=FIXTURE_RECIP, length=949, payer_delta=5000,
          diff_subsets=[(899, 907)]),
    ]),
    ("bb-set-9999", {}, [
        S(bb_ix(PAYER, True, some(9999), []), PAYER, err=None, events=[],
          bps=9999, recipients=FIXTURE_RECIP, length=949, payer_delta=5000,
          diff_subsets=[(899, 907)]),
    ]),
    ("bb-set-10000", {}, [
        S(bb_ix(PAYER, True, some(10000), []), PAYER, err=None, events=[],
          bps=10000, recipients=FIXTURE_RECIP, length=949, payer_delta=5000,
          diff_subsets=[(899, 907)]),
    ]),
    ("bb-set-10001", {}, [
        S(bb_ix(PAYER, True, some(10001), []), PAYER,
          err="InstructionErrorCustom(6056)", site="BuybackBasisPointsOutOfRange",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-set-u64max", {}, [
        S(bb_ix(PAYER, True, some(2 ** 64 - 1), []), PAYER,
          err="InstructionErrorCustom(6056)", site="BuybackBasisPointsOutOfRange",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-recip-unsorted8", {}, [
        S(bb_ix(PAYER, True, none(), UNSORTED), PAYER, err=None, events=[],
          bps=5000, recipients=recip_hex(UNSORTED), length=949,
          payer_delta=5000, diff_subsets=[(643, 899)]),
    ]),
    ("bb-both-6000-new8", {}, [
        S(bb_ix(PAYER, True, some(6000), NEW8A), PAYER, err=None, events=[],
          bps=6000, recipients=recip_hex(NEW8A), length=949,
          payer_delta=5000, diff_subsets=[(643, 907)]),
    ]),
    ("bb-recip-7", {}, [
        S(bb_ix(PAYER, True, none(), NEW[:7]), PAYER,
          err="InstructionErrorCustom(6057)", site="WrongBuybackFeeRecipientsCount",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-recip-9", {}, [
        S(bb_ix(PAYER, True, none(), NEW[:9]), PAYER,
          err="InstructionErrorCustom(6057)", site="WrongBuybackFeeRecipientsCount",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-recip-default", {}, [
        S(bb_ix(PAYER, True, none(), [Pubkey.default()] + NEW[1:8]), PAYER,
          err="InstructionErrorCustom(6054)", site="AllBuybackFeeRecipientsShouldBeNonZero",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-recip-dup", {}, [
        S(bb_ix(PAYER, True, none(), [NEW[0], NEW[0]] + NEW[2:8]), PAYER,
          err="InstructionErrorCustom(6055)", site="NotUniqueBuybackFeeRecipients",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-bps6000-duprecip", {}, [
        S(bb_ix(PAYER, True, some(6000), [NEW[0], NEW[0]] + NEW[2:8]), PAYER,
          err="InstructionErrorCustom(6055)", site="NotUniqueBuybackFeeRecipients",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-bps10001-duprecip", {}, [
        S(bb_ix(PAYER, True, some(10001), [NEW[0], NEW[0]] + NEW[2:8]), PAYER,
          err="InstructionErrorCustom(6056)", site="BuybackBasisPointsOutOfRange",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-outsider", {}, [
        S(bb_ix(OUTSIDER, True, some(6000), []), OUTSIDER,
          err="InstructionErrorCustom(6005)", site="InvalidAdmin",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-unsigned", {}, [
        S(bb_ix(PAYER, False, some(6000), []), OUTSIDER,
          err="InstructionErrorCustom(3010)", site="AccountNotSigner",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-readonly", {}, [
        S(bb_ix(PAYER, True, some(6000), [], cfg_writable=False), PAYER,
          err="InstructionErrorCustom(2000)", site="ConstraintMut",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-wrongowner", {"owner": Pubkey.default()}, [
        S(bb_ix(PAYER, True, some(6000), []), PAYER,
          err="InstructionErrorCustom(3007)", site="AccountOwnedByWrongProgram",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-args-empty", {}, [
        S(bb_ix(PAYER, True, b'', []), PAYER,
          err="InstructionErrorCustom(102)", site="InstructionDidNotDeserialize",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-args-tag2", {}, [
        S(bb_ix(PAYER, True, b'\x02' + struct.pack('<Q', 6000), []), PAYER,
          err="InstructionErrorCustom(102)", site="InstructionDidNotDeserialize",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=949,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-args-trailing", {}, [
        S(bb_ix(PAYER, True, some(6000) + b'X', []), PAYER, err=None, events=[],
          bps=6000, recipients=FIXTURE_RECIP, length=949, payer_delta=5000,
          diff_subsets=[(899, 907)]),
    ]),
    ("bb-trunc-907", {"data": bytes(RAW[:907])}, [
        S(bb_ix(PAYER, True, some(6000), []), PAYER,
          err="BorshIoError", site="BorshIoError",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=907,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-trunc-948", {"data": bytes(RAW[:948])}, [
        S(bb_ix(PAYER, True, some(6000), []), PAYER,
          err="BorshIoError", site="BorshIoError",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=948,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-trunc-906", {"data": bytes(RAW[:906])}, [
        S(bb_ix(PAYER, True, some(6000), []), PAYER,
          err="InvalidAccountData", site="InvalidAccountData",
          events=[], bps=None, recipients=None, length=906,
          payer_delta=5000, rollback=True),
    ]),
    ("bb-trunc-907-recip", {"data": bytes(RAW[:907])}, [
        S(bb_ix(PAYER, True, none(), NEW8A), PAYER,
          err="BorshIoError", site="BorshIoError",
          events=[], bps=5000, recipients=FIXTURE_RECIP, length=907,
          payer_delta=5000, rollback=True),
    ]),
]


def run_admin_step(vm, ix, tx_payer):
    cfg_before_acct = vm.get_account(CONFIG_KEY)
    before = bytes(cfg_before_acct.data) if cfg_before_acct else None
    before_lamp = cfg_before_acct.lamports if cfg_before_acct else None
    payer_before = vm.get_account(tx_payer.pubkey()).lamports
    tx = Transaction.new_signed_with_payer(
        [ix], tx_payer.pubkey(), [tx_payer], vm.latest_blockhash())
    assert all(tx.verify_with_results())
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    logs = meta.logs()
    cfg_after_acct = vm.get_account(CONFIG_KEY)
    after = bytes(cfg_after_acct.data) if cfg_after_acct else None
    after_lamp = cfg_after_acct.lamports if cfg_after_acct else None
    payer_after = vm.get_account(tx_payer.pubkey()).lamports
    events = [l for l in logs if l.startswith('Program data: ')]
    observed = {
        "error": str(r.err()) if failed else None,
        "events": len(events),
        "bps": struct.unpack_from('<Q', after, 899)[0] if after and len(after) >= 907 else None,
        "recipients": [bytes(after[643 + i * 32:643 + (i + 1) * 32]).hex() for i in range(8)] if after and len(after) >= 899 else None,
        "length": len(after) if after is not None else None,
        "cfg_lamports": after_lamp,
        "payer_delta": payer_before - payer_after,
        "rollback": (before == after and before_lamp == after_lamp),
    }
    return {
        "tx": base64.b64encode(bytes(tx)).decode(),
        "signatures": [str(s) for s in tx.signatures],
        "transaction_sha256": sha(bytes(tx)),
        "logs": logs, "events": events,
        "before": {str(CONFIG_KEY): {"lamports": before_lamp, "data_hex": before.hex() if before is not None else None},
                   str(tx_payer.pubkey()): {"lamports": payer_before, "data_hex": ""}},
        "after": {str(CONFIG_KEY): {"lamports": after_lamp, "data_hex": after.hex() if after is not None else None},
                  str(tx_payer.pubkey()): {"lamports": payer_after, "data_hex": ""}},
        "observed": observed,
    }


def check_admin_step(label, image, step_index, res, exp):
    obs = res["observed"]
    if exp.get("err") is None:
        assert obs["error"] is None, (label, image, step_index, obs["error"])
    else:
        assert obs["error"] is not None and exp["err"] in obs["error"], \
            (label, image, step_index, obs["error"])
    if exp.get("site"):
        assert exp["site"] in "\n".join(res["logs"]), \
            (label, image, step_index, res["logs"][-4:])
    assert obs["events"] == len(exp.get("events", [])), \
        (label, image, step_index, obs["events"])
    for key in ("bps", "recipients", "length", "cfg_lamports"):
        if key in exp and exp[key] is not None:
            assert obs[key] == exp[key], \
                (label, image, step_index, key, obs[key], exp[key])
    if exp.get("bps") is None and "bps" in exp:
        assert obs["bps"] is None, (label, image, step_index, obs["bps"])
    assert obs["payer_delta"] == exp["payer_delta"], \
        (label, image, step_index, obs["payer_delta"])
    if exp.get("rollback"):
        assert obs["rollback"], (label, image, step_index, "no rollback")
    if exp.get("diff_subsets") is not None:
        before = bytes.fromhex(res["before"][str(CONFIG_KEY)]["data_hex"])
        after = bytes.fromhex(res["after"][str(CONFIG_KEY)]["data_hex"])
        assert len(before) == len(after), (label, image, step_index, "length changed")
        diffs = [i for i in range(len(before)) if before[i] != after[i]]
        assert all(any(lo <= i < hi for lo, hi in exp["diff_subsets"]) for i in diffs), \
            (label, image, step_index, diffs)


def run_case_A(label, setup, steps, binary):
    vm = LiteSVM().with_transaction_history(0)
    vm.add_program_from_file(PROGRAM, binary)
    for who in [PAYER, OUTSIDER]:
        vm.airdrop(who.pubkey(), 10 ** 12)
    vm.set_account(EVENT, Account(10 ** 9, b'', Pubkey.default()))
    data = setup.get("data", bytes(RAW))
    vm.set_account(CONFIG_KEY, Account(
        setup.get("lamports", CONFIG['lamports']), bytes(data),
        setup.get("owner", PROGRAM)))
    receipts = []
    for step_index, (ix, tx_payer, exp) in enumerate(steps):
        res = run_admin_step(vm, ix, tx_payer)
        check_admin_step(label, binary, step_index, res, exp)
        receipts.append(res)
    return receipts


# ---------------- family B: chained trade VM ----------------
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


def set_pool(vm):
    a = vm.get_account(pool)
    d = bytearray(a.data)
    d[245:261] = (0).to_bytes(16, "little", signed=True); d[243] = 0
    d[271:287] = bytes(16)
    d[261:269] = struct.pack("<Q", 0)
    vm.set_account(pool, Account(a.lamports, bytes(d), a.owner))


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        if not a or a.executable:
            out[str(k)] = None
        else:
            out[str(k)] = {"lamports": a.lamports, "data_hex": bytes(a.data).hex()}
    return out


def amount_at(data_hex, offset=64):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


def event_fields(logs, offs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    assert len(lines) == 1, lines
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    return tuple(struct.unpack_from("<Q", raw, off)[0] for off in offs)


# (label, update_payload, update_remaining, trade_instr, amount, limit,
#  buyback_key, expected_buy)
# expected_buy: ("ok", deltas, event, pool_state) or ("err", code, site_name)
CASES_B = [
    ("chain-bps7500-buy", some(7500), [], "buy_v2", 10 ** 6, 10425, buyback,
     ("ok", {"userbase": 10 ** 6, "userquote": -10425, "vaultbase": -10 ** 6,
             "vaultquote": 10341, "buyback": 84},
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 7500, 84, 0, 0, 301),
      [-329, 28, 301])),
    ("chain-bps10000-buy", some(10000), [], "buy_v2", 10 ** 6, 10425, buyback,
     ("ok", {"userbase": 10 ** 6, "userquote": -10425, "vaultbase": -10 ** 6,
             "vaultquote": 10313, "buyback": 112},
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 10000, 112, 0, 0, 301),
      [-301, 0, 301])),
    ("chain-bps0-buy", some(0), [], "buy_v2", 10 ** 6, 10425, buyback,
     ("ok", {"userbase": 10 ** 6, "userquote": -10425, "vaultbase": -10 ** 6,
             "vaultquote": 10425, "buyback": 0},
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 0, 0, 0, 0, 301),
      [-413, 112, 301])),
    ("chain-bps7500-sell", some(7500), [], "sell_v2", 10 ** 6, 1, buyback,
     ("ok", {"userbase": -10 ** 6, "userquote": 9578, "vaultbase": 10 ** 6,
             "vaultquote": -9661, "buyback": 83},
      (9999, 10, 10, 111, 111, 9989, 9578, 300, 300, 7500, 83, 0, 0, 300),
      [-328, 28, 300])),
    ("chain-recip-new-buy", none(), CHAIN_NEW8, "buy_v2", 10 ** 6, 10425, NEWATA,
     ("ok", {"userbase": 10 ** 6, "userquote": -10425, "vaultbase": -10 ** 6,
             "vaultquote": 10369, "buyback": 56},
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 5000, 56, 0, 0, 301),
      [-357, 56, 301])),
    ("chain-recip-old-buy", none(), CHAIN_OLD8, "buy_v2", 10 ** 6, 10425, buyback,
     ("err", "InstructionErrorCustom(6053)", "BuybackFeeRecipientNotAuthorized")),
    ("chain-both-buy", some(7500), CHAIN_NEW8, "buy_v2", 10 ** 6, 10425, NEWATA,
     ("ok", {"userbase": 10 ** 6, "userquote": -10425, "vaultbase": -10 ** 6,
             "vaultquote": 10341, "buyback": 84},
      (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 7500, 84, 0, 0, 301),
      [-329, 28, 301])),
]


def run_case_B(label, upd_payload, upd_remaining, instr, amount, limit,
               bb_key, expected, binary):
    h = Harness(binary)
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
    vm.set_account(userbase, Account(10 ** 9, token(base, PAYER.pubkey(), 10 ** 15, False), TOKEN))
    vm.set_account(userquote, Account(10 ** 15 + 2039280, token(quote, PAYER.pubkey(), 10 ** 15, True), TOKEN))
    vm.set_account(volume, Account(0, b"", Pubkey.default()))
    if bb_key != buyback:
        vm.set_account(bb_key, Account(2039280, token(quote, NEWREC, 0, False), TOKEN))
    ix = next(x for x in IDL["instructions"] if x["name"] == instr)
    keys = [pool, PAYER.pubkey(), CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
            bb_key, EVENT, PROGRAM]
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    combine(fee_table(TIERS))(SimpleNamespace(vm=vm), metas)
    set_amount(vm, vaultbase, VB); set_amount(vm, vaultquote, VQ)
    set_supply(vm, base, SUPPLY); set_pool(vm)
    snap_keys = [pool, userbase, userquote, vaultbase, vaultquote, bb_key,
                 CONFIG_KEY, PAYER.pubkey(), volume]
    # step 0: update_buyback_config
    upd_metas = [AccountMeta(PAYER.pubkey(), True, False),
                 AccountMeta(CONFIG_KEY, False, True),
                 AccountMeta(EVENT, False, False),
                 AccountMeta(PROGRAM, False, False)]
    for k in upd_remaining:
        upd_metas.append(AccountMeta(k, False, False))
    before0 = snap(vm, snap_keys)
    payer0 = before0[str(PAYER.pubkey())]["lamports"]
    tx0 = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, BB_DISC + upd_payload, upd_metas)],
        PAYER.pubkey(), [PAYER], vm.latest_blockhash())
    assert all(tx0.verify_with_results())
    r0 = vm.send_transaction(tx0)
    failed0 = isinstance(r0, FailedTransactionMetadata)
    meta0 = r0.meta() if failed0 else r0
    logs0 = meta0.logs()
    after0 = snap(vm, snap_keys)
    cfg0 = bytes.fromhex(after0[str(CONFIG_KEY)]["data_hex"])
    assert not failed0, (label, binary, "update step must succeed")
    assert len([l for l in logs0 if l.startswith("Program data: ")]) == 0, (label, binary, "update must be silent")
    obs0 = {
        "error": None, "events": 0,
        "bps": struct.unpack_from('<Q', cfg0, 899)[0],
        "recipients": [cfg0[643 + i * 32:643 + (i + 1) * 32].hex() for i in range(8)],
        "length": len(cfg0),
        "cfg_lamports": after0[str(CONFIG_KEY)]["lamports"],
        "payer_delta": payer0 - after0[str(PAYER.pubkey())]["lamports"],
    }
    assert obs0["payer_delta"] == 5000, (label, binary, obs0["payer_delta"])
    res0 = {
        "tx": base64.b64encode(bytes(tx0)).decode(),
        "signatures": [str(s) for s in tx0.signatures],
        "transaction_sha256": sha(bytes(tx0)),
        "logs": logs0, "events": [],
        "before": before0, "after": after0, "observed": obs0,
    }
    # step 1: trade
    before1 = snap(vm, snap_keys)
    payer1 = before1[str(PAYER.pubkey())]["lamports"]
    data = bytes(ix["discriminator"]) + struct.pack("<QQ", amount, limit)
    tx1 = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, data, metas)], PAYER.pubkey(), [PAYER], vm.latest_blockhash())
    assert all(tx1.verify_with_results())
    r1 = vm.send_transaction(tx1)
    failed1 = isinstance(r1, FailedTransactionMetadata)
    meta1 = r1.meta() if failed1 else r1
    logs1 = meta1.logs()
    after1 = snap(vm, snap_keys)
    if expected[0] == "ok":
        assert not failed1, (label, binary, "trade step must succeed")
        deltas = {}
        for wname, key in (("userbase", userbase), ("userquote", userquote),
                           ("vaultbase", vaultbase), ("vaultquote", vaultquote),
                           ("buyback", bb_key)):
            b, a = before1[str(key)], after1[str(key)]
            deltas[wname] = None if b is None or a is None else \
                amount_at(a["data_hex"]) - amount_at(b["data_hex"])
        assert deltas == expected[1], (label, binary, deltas, expected[1])
        offs = BUY_EV_OFFS if instr == "buy_v2" else SELL_EV_OFFS
        got_ev = event_fields(logs1, offs)
        assert got_ev == expected[2], (label, binary, got_ev, expected[2])
        pk_after = bytes.fromhex(after1[str(pool)]["data_hex"])
        pool_state = [struct.unpack_from("<q", pk_after, 245)[0],
                      struct.unpack_from("<Q", pk_after, 271)[0],
                      struct.unpack_from("<Q", pk_after, 279)[0]]
        assert pool_state == list(expected[3]), (label, binary, pool_state, expected[3])
        vol = after1[str(volume)]
        assert vol is not None and vol["lamports"] == 1844400, (label, binary, vol)
        assert len(bytes.fromhex(vol["data_hex"])) == 137, (label, binary, vol)
        assert bytes.fromhex(vol["data_hex"])[8:40] == bytes(PAYER.pubkey()), (label, binary, "volume user")
        obs1 = {"error": None, "deltas": deltas, "event": list(got_ev),
                "pool_state": pool_state,
                "payer_delta": payer1 - after1[str(PAYER.pubkey())]["lamports"],
                "volume_lamports": 1844400, "volume_len": 137}
        assert obs1["payer_delta"] == 1849400, (label, binary, obs1["payer_delta"])
    else:
        assert failed1, (label, binary, "expected failure")
        err = str(r1.err())
        assert expected[1] in err, (label, binary, err)
        deltas = {}
        for wname, key in (("userbase", userbase), ("userquote", userquote),
                           ("vaultbase", vaultbase), ("vaultquote", vaultquote),
                           ("buyback", bb_key)):
            b, a = before1[str(key)], after1[str(key)]
            deltas[wname] = None if b is None or a is None else \
                amount_at(a["data_hex"]) - amount_at(b["data_hex"])
        assert deltas == {"userbase": 0, "userquote": 0, "vaultbase": 0,
                          "vaultquote": 0, "buyback": 0}, (label, binary, deltas)
        assert len([l for l in logs1 if l.startswith("Program data: ")]) == 0, (label, binary, logs1)
        pk_after = bytes.fromhex(after1[str(pool)]["data_hex"])
        pool_state = [struct.unpack_from("<q", pk_after, 245)[0],
                      struct.unpack_from("<Q", pk_after, 271)[0],
                      struct.unpack_from("<Q", pk_after, 279)[0]]
        assert pool_state == [0, 0, 0], (label, binary, pool_state)
        obs1 = {"error": err, "deltas": deltas, "event": None,
                "pool_state": pool_state,
                "payer_delta": payer1 - after1[str(PAYER.pubkey())]["lamports"],
                "volume_lamports": 0, "volume_len": 0}
        assert obs1["payer_delta"] == 5000, (label, binary, obs1["payer_delta"])
    res1 = {
        "tx": base64.b64encode(bytes(tx1)).decode(),
        "signatures": [str(s) for s in tx1.signatures],
        "transaction_sha256": sha(bytes(tx1)),
        "logs": logs1,
        "events": [l for l in logs1 if l.startswith("Program data: ")],
        "before": before1, "after": after1, "observed": obs1,
    }
    return [res0, res1]


receipts_global = []
report_cases = []
index = 0
for label, setup, steps in CASES_A:
    row = {"case": {"label": label, "family": "admin", "steps": len(steps)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        receipts = run_case_A(label, setup, steps, IMAGES[image])
        for step_index, res in enumerate(receipts):
            raw = base64.b64decode(res["tx"])
            tx = Transaction.from_bytes(raw)
            checks = tx.verify_with_results()
            assert checks and all(checks) and len(checks) == 1
            assert res["transaction_sha256"] == sha(raw)
            seen.add((step_index, res["observed"]["error"],
                      json.dumps(res["observed"], sort_keys=True),
                      json.dumps(res["after"], sort_keys=True)))
            receipts_global.append({
                "sequence": len(receipts_global),
                "vm": len(receipts_global),
                "context": {"index": index, "image": image, "label": label,
                            "family": "admin", "step": step_index},
                "transaction_base64": res["tx"],
                "signatures": res["signatures"],
                "transaction_sha256": res["transaction_sha256"],
                "all_signatures_verified": True, "signature_fields": 1,
                "before": res["before"], "after": res["after"],
                "metadata": {"logs": res["logs"], "events": res["events"],
                             "inner_instructions": []},
                "loaded_programs": {"pAMM": {"sha256": IMAGE_SHA[image]}},
                "error": res["observed"]["error"],
                "observed": res["observed"],
            })
            print(f"  {label}[{image}] step{step_index} "
                  f"err={res['observed']['error']} "
                  f"bps={res['observed']['bps']} "
                  f"payer_delta={res['observed']['payer_delta']}", flush=True)
        row[image] = {"steps": [r["observed"] for r in receipts]}
    assert len(seen) == len(steps), (label, "images must agree", seen)
    report_cases.append(row)
    index += 1

for label, upd_payload, upd_remaining, instr, amount, limit, bb_key, expected in CASES_B:
    row = {"case": {"label": label, "family": "chain", "steps": 2,
                    "instruction": instr, "amount": amount, "limit": limit}}
    seen = set()
    for image in ("original", "control", "candidate"):
        receipts = run_case_B(label, upd_payload, upd_remaining, instr, amount,
                              limit, bb_key, expected, IMAGES[image])
        for step_index, res in enumerate(receipts):
            raw = base64.b64decode(res["tx"])
            tx = Transaction.from_bytes(raw)
            checks = tx.verify_with_results()
            assert checks and all(checks) and len(checks) == 1
            assert res["transaction_sha256"] == sha(raw)
            seen.add((step_index, res["observed"]["error"],
                      json.dumps(res["observed"], sort_keys=True),
                      json.dumps(res["after"], sort_keys=True)))
            receipts_global.append({
                "sequence": len(receipts_global),
                "vm": len(receipts_global),
                "context": {"index": index, "image": image, "label": label,
                            "family": "chain", "step": step_index},
                "transaction_base64": res["tx"],
                "signatures": res["signatures"],
                "transaction_sha256": res["transaction_sha256"],
                "all_signatures_verified": True, "signature_fields": 1,
                "before": res["before"], "after": res["after"],
                "metadata": {"logs": res["logs"], "events": res["events"],
                             "inner_instructions": []},
                "loaded_programs": {"pAMM": {"sha256": IMAGE_SHA[image]}},
                "error": res["observed"]["error"],
                "observed": res["observed"],
            })
            print(f"  {label}[{image}] step{step_index} "
                  f"err={res['observed']['error']} "
                  f"obs={res['observed']}", flush=True)
        row[image] = {"steps": [r["observed"] for r in receipts]}
    assert len(seen) == 2, (label, "images must agree", seen)
    report_cases.append(row)
    index += 1

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
    "evidence/upstream/pump_amm.json",
    "research/imported-lab/analysis/pump_fun/config-snapshot.json",
    "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json",
    "programs/pump-amm/src/lib.rs",
    "programs/pump-amm/src/instructions/admin/update_buyback_config.rs",
    "programs/pump-amm/src/instructions/admin/mod.rs",
    "programs/pump-amm/src/state/global_config.rs",
    "programs/pump-amm/src/instructions/swap/trade_v2.rs",
    "scripts/pump_amm_admin_differential.py",
    "scripts/pump_amm_liquidity_differential.py",
    "scripts/pump_amm_trade_v2_differential.py",
    "scripts/pump_amm_reusable_harness.py",
]
report = {"schema": 1, "packet": "amm-update-buyback-config-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("update_buyback_config as state transitions on synthetic "
                    "GlobalConfig fixtures (family A, admin-only VM) and as "
                    "the driver of a following buy_v2 / sell_v2 (family B, "
                    "chained transactions in a trade VM), fresh VM per case "
                    "per image (original / #424 control / #427 candidate). "
                    "Receipts are stored as parts to stay under GitHub's "
                    "25MB web-upload limit; verify.py reads them in order."),
          "image_sha256": IMAGE_SHA,
          "cases": report_cases,
          "counts": {"vms": len(receipts_global),
                     "transactions": len(receipts_global),
                     "signature_fields": len(receipts_global)},
          "input_sha256": {n: sha((ROOT / n).read_bytes()) for n in repo_inputs},
          "transaction_receipts": {"parts": parts}}
(OUT / "runtime/report.json.gz").write_bytes(
    gzip.compress(json.dumps(report, indent=1).encode(), mtime=0))
shutil.copy(__file__, OUT / "producer.py")
print(f"cases: {len(report_cases)} receipts: {len(receipts_global)}")
print(f"wrote: {OUT / 'runtime/report.json.gz'}")
print("NEXT: write verify.py and README.md into the packet dir, then generate MANIFEST.json")
