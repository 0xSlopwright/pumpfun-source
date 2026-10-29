#!/usr/bin/env python3
"""Build research/amm-extend-volume-accumulator-chains-20261029 receipts.

3rd run packet #27: extend_account chained into the user volume
accumulator lifecycle.

2nd #1 pinned extend_account in isolation (fresh VM per case, synthetic
program-owned accounts: target sizes, rent delta (target-current)*6960,
body preservation, no-op at/above target, 6027/2004/2000/3010/101 gates)
and 3rd #1 pinned the close lifecycle on 137-byte seeded accumulators,
but no packet ever chained them: what does an extended accumulator
actually do afterwards -- does a 90-byte account extended to 137 keep
its claimable fields, does its close refund the extended rent or the
seeded balance, does a truncated 50-byte account's field layout survive
the zero-filled tail, and can a failed extend (missing account,
unsigned user, read-only target) be followed by a successful one in
the same chain?

This packet answers that with multi-step chains, one signed
transaction per step, on three program images (original, #424
control, #427 candidate).

Fixture (per case, fresh VM per image): global volume accumulator
(start 20, end 49, period 1, supplies 1000x30, volumes 100x30),
incentive mint, vault 10^9, user ATA 17, seeded user accumulator
(needs 1, unclaimed 500, claimed 700, volume 20, last 10, has 1,
cashback 55, cashback_claimed 13; the reward case seeds last 20).
The accumulator is seeded at a chosen byte length and lamport
balance so the extend rent math is observable. Fee payer is the
user (OUTSIDER) unless a step says otherwise, so payer deltas are
measured per step against that step's before snapshot -- absolute
lamport balances are NOT asserted because the harness VM accumulates
airdrop across setups in one process.

Measured results (all three images agree on every step):
- extend 90 -> 137 preserves every field byte-for-byte and tops the
  balance up to the 137-byte rent-exempt 1,844,400 (payer -332,120 =
  5,000 fee + 47*6960 rent delta), emitting one 96-byte
  ExtendAccount event (timestamp, account, user, old size 90,
  new size 137). The extended account then claims, syncs, and
  closes exactly like a natively seeded 137-byte account: claim at
  now=10 pays the 500 unclaimed, close refunds 1,839,400
  (1,844,400 - 5,000) with a close event reporting the post-claim
  fields (unc 0, claimed 500, vol 20, last 10).
- extend at target (137) and above target (138) are silent no-ops:
  0 events, payer -5,000 only, fields and balance untouched; the
  following sync/claim/close chains run identically.
- extend 50 -> 137 rewrites the truncated field layout: the
  50-byte account holds needs + full unclaimed (500) + only the
  low byte of claimed (700 = 0x02BC -> 188), and the zero-filled
  tail zeroes volume, last, has, cashback, cashback_claimed.
  The following claim at now=10 still pays the full 500
  (claimed 188 -> 500, needs 1 -> 0, has 0 -> 1) and the close
  after it refunds the extended balance.
- extend of a missing account (after a close) fails 2004
  ConstraintOwner (caused by account: account), not 3012: the
  missing account's default owner fails the program-owner check
  before any existence check. Full rollback, fee payer -5,000.
  A re-init after it creates a fresh 137-byte account, and a
  further extend on that fresh account is a silent no-op.
- extend with an unsigned user fails 3010 AccountNotSigner
  (caused by account: user), fee payer PAYER -5,000, account still
  90 bytes; the signed extend right after it succeeds and the
  chain closes normally. Extend with a read-only target fails
  2000 ConstraintMut (caused by account: account), same recovery.
- extend twice: the second extend is a silent no-op (0 events,
  -5,000), proving the first extend already reached target.
- close refunds are balance-driven, not size-driven: a prefunded
  extended account (10^9 + 605,520 after a 50-byte extend) closes
  for 1,000,600,520, while a rent-exact extended account closes
  for 1,839,400. The close event always reports the live fields.

Error sites are recorded per image in the report; verify.py checks
each image's site line against that image's own logs (original and
rebuilt sources differ in line numbers, so sites are never compared
across images -- the 2nd #36 lesson).

Receipts are one signed transaction per step, stored 10 per part.
The builder asserts every expected value below per image before
writing. The packet's producer.py is this file.
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

from pump_amm_admin_differential import IDL, PAYER, OUTSIDER, PROGRAM, CONFIG_KEY, RAW, CONFIG
from pump_amm_incentives_differential import TOKEN, TOKEN22, ATA, MINT, G, U, disc, token_data
from pump_amm_reusable_harness import acquire_harness

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-extend-volume-accumulator-chains-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}

USER = OUTSIDER.pubkey()
PAYER_KEY = PAYER.pubkey()
EVENT, _ = Pubkey.find_program_address([b"__event_authority"], PROGRAM)
SYSTEM = Pubkey.default()
CLOSE_EVT_DISC = hashlib.sha256(b"event:CloseUserVolumeAccumulatorEvent").digest()[:8]
INIT_EVT_DISC = hashlib.sha256(b"event:InitUserVolumeAccumulatorEvent").digest()[:8]
SYNC_EVT_DISC = hashlib.sha256(b"event:SyncUserVolumeAccumulatorEvent").digest()[:8]
CLAIM_EVT_DISC = hashlib.sha256(b"event:ClaimTokenIncentivesEvent").digest()[:8]
EXTEND_EVT_DISC = "6161d7905d92167c"

SEED = (1, 500, 700, 20, 10, 1, 55, 13)
SEED_REWARD = (1, 500, 700, 20, 20, 1, 55, 13)
FRESH = {"lamports": 1844400, "needs": 0, "unc": 0, "claimed": 0, "vol": 0,
         "last": 0, "has": 0, "cb": 0, "cbcl": 0}
SEEDED = {"lamports": 10**9, "needs": 1, "unc": 500, "claimed": 700, "vol": 20,
          "last": 10, "has": 1, "cb": 55, "cbcl": 13}
SEEDED_REWARD = {"lamports": 10**9, "needs": 1, "unc": 500, "claimed": 700, "vol": 20,
                 "last": 20, "has": 1, "cb": 55, "cbcl": 13}
EXT90 = {"lamports": 1844400, "needs": 1, "unc": 500, "claimed": 700, "vol": 20,
         "last": 10, "has": 1, "cb": 55, "cbcl": 13}
EXT50 = {"lamports": 1000605520, "needs": 1, "unc": 500, "claimed": 188, "vol": 0,
         "last": 0, "has": 0, "cb": 0, "cbcl": 0}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def setup_vm(binary, seed=SEED, uva_len=137, uva_lamports=10**9):
    h = acquire_harness(binary)
    vm = h.vm
    vm.with_sigverify(True)
    for pid, n in [(TOKEN, 'spl_token'), (TOKEN22, 'spl_token_2022'), (ATA, 'associated_token')]:
        vm.add_program_from_file(pid, ROOT / 'evidence/dependencies' / n / 'deployed.so')
    vm.airdrop(USER, 10**12)
    vm.airdrop(PAYER_KEY, 10**12)
    ga = Pubkey.find_program_address([bytes(G), bytes(TOKEN), bytes(MINT)], ATA)[0]
    ua = Pubkey.find_program_address([bytes(USER), bytes(TOKEN), bytes(MINT)], ATA)[0]
    cfg = bytearray(RAW)
    cfg[8:40] = bytes(PAYER_KEY)
    g = disc('GlobalVolumeAccumulator') + struct.pack('<qqq', 20, 49, 1) + bytes(MINT) \
        + struct.pack('<30Q', *[1000] * 30) + struct.pack('<30Q', *[100] * 30)
    needs, unc, claimed, vol, last, hasc, cb, cbcl = seed
    u = disc('UserVolumeAccumulator') + bytes(USER) + struct.pack(
        '<BQQQqBQQ', needs, unc, claimed, vol, last, hasc, cb, cbcl)
    vm.set_account(CONFIG_KEY, Account(CONFIG['lamports'], bytes(cfg), PROGRAM))
    vm.set_account(G, Account(10**9, g.ljust(600, b'\0'), PROGRAM))
    vm.set_account(U, Account(uva_lamports, u.ljust(uva_len, b'\0')[:uva_len], PROGRAM))
    vm.set_account(MINT, Account(10**9, struct.pack('<I', 0) + bytes(32) + struct.pack('<Q', 10**12) + bytes([6, 1]) + bytes(36), TOKEN))
    vm.set_account(ga, Account(10**9, token_data(G, 10**9), TOKEN))
    vm.set_account(ua, Account(10**9, token_data(USER, 17), TOKEN))
    return h, {"ga": ga, "ua": ua}


def snap(vm, ctx):
    keys = [USER, PAYER_KEY, U, G, ctx["ga"], ctx["ua"], CONFIG_KEY, MINT]
    out = {}
    for k in keys:
        a = vm.get_account(k)
        out[str(k)] = None if (not a or a.executable) else {
            "lamports": a.lamports, "owner": str(a.owner),
            "data_hex": bytes(a.data).hex()}
    return out


def tok_amount(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from('<Q', raw, 64)[0] if len(raw) >= 72 else None


def parse_uva(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    if len(raw) < 90:
        return {"lamports": entry["lamports"], "len": len(raw)}
    v = struct.unpack_from('<BQQQqBQQ', raw, 40)
    return {"lamports": entry["lamports"], "needs": v[0], "unc": v[1],
            "claimed": v[2], "vol": v[3], "last": v[4], "has": v[5],
            "cb": v[6], "cbcl": v[7]}


def lam_delta(before, after):
    b = before["lamports"] if before else 0
    a = after["lamports"] if after else 0
    return a - b


def ev_data(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    return base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())


def u64(raw, off):
    return struct.unpack_from('<Q', raw, off)[0]


def i64(raw, off):
    return struct.unpack_from('<q', raw, off)[0]


def idl_metas(name, keys):
    ix = next(x for x in IDL['instructions'] if x['name'] == name)
    return [AccountMeta(k, bool(row.get('signer')), bool(row.get('writable')))
            for k, row in zip(keys, ix['accounts'])]


def send_tx(h, ctx, name, keys, fee_payer, signers, now, unsigned_user=False):
    h.vm.set_clock(Clock(100, 0, 0, 0, now))
    ix = next(x for x in IDL['instructions'] if x['name'] == name)
    metas = idl_metas(name, keys)
    if unsigned_user:
        for m in metas:
            if m.pubkey == USER:
                m.is_signer = False
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, bytes(ix['discriminator']), metas)],
        fee_payer.pubkey(), signers, h.vm.latest_blockhash())
    assert tx.verify_with_results() and all(tx.verify_with_results())
    before = snap(h.vm, ctx)
    r = h.vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    logs = meta.logs()
    after = snap(h.vm, ctx)
    site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
    return {"transaction_base64": base64.b64encode(bytes(tx)).decode(),
            "error": str(r.err()) if failed else None,
            "logs": logs,
            "events": [l for l in logs if l.startswith("Program data: ")],
            "before": before, "after": after, "site": site}


def _close(h, ctx, fee_payer, user_key, unsigned):
    h.vm.set_clock(Clock(100, 0, 0, 0, ctx['now']))
    ix = next(x for x in IDL['instructions'] if x['name'] == 'close_user_volume_accumulator')
    keys = [(user_key or USER), U, EVENT, PROGRAM]
    metas = []
    for k, row in zip(keys, ix['accounts']):
        signer = bool(row.get('signer'))
        if unsigned and k == (user_key or USER):
            signer = False
        metas.append(AccountMeta(k, signer, bool(row.get('writable'))))
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, bytes(ix['discriminator']), metas)],
        fee_payer.pubkey(), [fee_payer], h.vm.latest_blockhash())
    assert tx.verify_with_results() and all(tx.verify_with_results())
    before = snap(h.vm, ctx)
    r = h.vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    logs = meta.logs()
    return {"transaction_base64": base64.b64encode(bytes(tx)).decode(),
            "error": str(r.err()) if failed else None, "logs": logs,
            "events": [l for l in logs if l.startswith("Program data: ")],
            "before": before, "after": snap(h.vm, ctx),
            "site": next((l for l in logs if "thrown in" in l or "caused by account" in l), None)}


def _extend(h, ctx, fee_payer, unsigned=False, readonly=False):
    h.vm.set_clock(Clock(100, 0, 0, 0, ctx['now']))
    ix = next(x for x in IDL['instructions'] if x['name'] == 'extend_account')
    metas = [AccountMeta(U, False, not readonly),
             AccountMeta(USER, not unsigned, True),
             AccountMeta(SYSTEM, False, False),
             AccountMeta(EVENT, False, False),
             AccountMeta(PROGRAM, False, False)]
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, bytes(ix['discriminator']), metas)],
        fee_payer.pubkey(), [fee_payer], h.vm.latest_blockhash())
    assert tx.verify_with_results() and all(tx.verify_with_results())
    before = snap(h.vm, ctx)
    r = h.vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    logs = meta.logs()
    return {"transaction_base64": base64.b64encode(bytes(tx)).decode(),
            "error": str(r.err()) if failed else None, "logs": logs,
            "events": [l for l in logs if l.startswith("Program data: ")],
            "before": before, "after": snap(h.vm, ctx),
            "site": next((l for l in logs if "thrown in" in l or "caused by account" in l), None)}


def do_step(h, ctx, kind, now, fee_payer=OUTSIDER):
    ctx['now'] = now
    if kind == 'close':
        return _close(h, ctx, fee_payer, None, False)
    if kind == 'extend':
        return _extend(h, ctx, fee_payer)
    if kind == 'extend_unsigned':
        return _extend(h, ctx, fee_payer, unsigned=True)
    if kind == 'extend_readonly':
        return _extend(h, ctx, fee_payer, readonly=True)
    if kind == 'init':
        keys = [fee_payer.pubkey(), USER, U, Pubkey.default(), EVENT, PROGRAM]
        return send_tx(h, ctx, 'init_user_volume_accumulator', keys, fee_payer, [fee_payer], now)
    if kind == 'sync':
        keys = [USER, G, U, EVENT, PROGRAM]
        return send_tx(h, ctx, 'sync_user_volume_accumulator', keys, fee_payer, [fee_payer], now)
    if kind == 'claim':
        keys = [USER, ctx['ua'], G, ctx['ga'], U, MINT, TOKEN, Pubkey.default(), ATA, EVENT, PROGRAM, fee_payer.pubkey()]
        return send_tx(h, ctx, 'claim_token_incentives', keys, fee_payer, [fee_payer], now)
    raise ValueError(kind)


def check(cond, msg):
    if not cond:
        raise AssertionError(msg)


def decode_event(kind, rec):
    raw = ev_data(rec["logs"])
    if raw is None:
        return None
    if kind == 'close':
        return {"disc": raw[:8].hex(), "user": raw[8:40].hex(), "ts": i64(raw, 40),
                "unc": u64(raw, 48), "claimed": u64(raw, 56), "vol": u64(raw, 64),
                "last": i64(raw, 72), "len": len(raw)}
    if kind == 'init':
        return {"disc": raw[:8].hex(), "payer": raw[8:40].hex(), "user": raw[40:72].hex(),
                "ts": i64(raw, 72), "len": len(raw)}
    if kind == 'sync':
        return {"disc": raw[:8].hex(), "user": raw[8:40].hex(), "before": u64(raw, 40),
                "after": u64(raw, 48), "ts": i64(raw, 56), "len": len(raw)}
    if kind == 'claim':
        return {"disc": raw[:8].hex(), "user": raw[8:40].hex(), "mint": raw[40:72].hex(),
                "amount": u64(raw, 72), "ts": i64(raw, 80), "claimed": u64(raw, 88),
                "vol": u64(raw, 96), "len": len(raw)}
    if kind == 'extend':
        return {"disc": raw[:8].hex(), "ts": i64(raw, 8), "account": raw[16:48].hex(),
                "user": raw[48:80].hex(), "old": u64(raw, 80), "new": u64(raw, 88),
                "len": len(raw)}
    return None


def EXT_EV(old, new):
    return {"disc": EXTEND_EVT_DISC, "ts": 10, "account": bytes(U).hex(),
            "user": bytes(USER).hex(), "old": old, "new": new, "len": 96}


def CLOSE_EV(unc, claimed, vol, last, ts=10):
    return {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(), "ts": ts,
            "unc": unc, "claimed": claimed, "vol": vol, "last": last, "len": 80}


CASES = [
    {"label": "x-extend90-claim-close", "uva_len": 90, "uva_lamports": 1517280,
     "steps": [("extend", 10, OUTSIDER), ("claim", 10, OUTSIDER), ("close", 10, OUTSIDER)],
     "expect": [{"name": "extend", "error": None, "events": 1,
                 "dUSER": -332120, "dPAYER": 0, "uva": EXT90,
                 "vault": 10**9, "ua": 17, "event": EXT_EV(90, 137)},
                {"name": "claim", "error": None, "events": 1,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {"lamports": 1844400, "needs": 1, "unc": 0, "claimed": 500,
                        "vol": 20, "last": 10, "has": 1, "cb": 55, "cbcl": 13},
                 "vault": 999999500, "ua": 517,
                 "event": {"disc": CLAIM_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "mint": bytes(MINT).hex(), "amount": 500, "ts": 10,
                           "claimed": 500, "vol": 20, "len": 104}},
                {"name": "close", "error": None, "events": 1,
                 "dUSER": 1839400, "dPAYER": 0, "uva": None,
                 "vault": 999999500, "ua": 517,
                 "event": CLOSE_EV(0, 500, 20, 10)}]},
    {"label": "x-extend90-close-claim-init-claim21", "uva_len": 90, "uva_lamports": 1517280,
     "steps": [("extend", 10, OUTSIDER), ("close", 10, OUTSIDER), ("claim", 10, OUTSIDER),
               ("init", 10, OUTSIDER), ("claim", 21, OUTSIDER)],
     "expect": [{"name": "extend", "error": None, "events": 1,
                 "dUSER": -332120, "dPAYER": 0, "uva": EXT90,
                 "vault": 10**9, "ua": 17, "event": EXT_EV(90, 137)},
                {"name": "close", "error": None, "events": 1,
                 "dUSER": 1839400, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": CLOSE_EV(500, 700, 20, 10)},
                {"name": "claim", "error": "3012", "events": 0,
                 "dUSER": -5000, "dPAYER": 0, "uva": None, "rollback": True,
                 "site_fragment": "AccountNotInitialized"},
                {"name": "init", "error": None, "events": 1,
                 "dUSER": -1849400, "dPAYER": 0, "uva": FRESH,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": INIT_EVT_DISC.hex(), "payer": bytes(USER).hex(),
                           "user": bytes(USER).hex(), "ts": 10, "len": 80}},
                {"name": "claim", "error": None, "events": 0,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {**FRESH, "last": 21},
                 "vault": 10**9, "ua": 17}]},
    {"label": "x-extend137-sync-close", "uva_len": 137, "uva_lamports": 10**9,
     "steps": [("extend", 10, OUTSIDER), ("sync", 10, OUTSIDER), ("close", 10, OUTSIDER)],
     "expect": [{"name": "extend", "error": None, "events": 0,
                 "dUSER": -5000, "dPAYER": 0, "uva": SEEDED,
                 "vault": 10**9, "ua": 17},
                {"name": "sync", "error": None, "events": 1,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {"lamports": 10**9, "needs": 1, "unc": 500, "claimed": 0,
                        "vol": 20, "last": 10, "has": 0, "cb": 55, "cbcl": 13},
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": SYNC_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "before": 700, "after": 0, "ts": 10, "len": 64}},
                {"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": CLOSE_EV(500, 0, 20, 10)}]},
    {"label": "x-extend138-reward-claim-close", "seed": SEED_REWARD,
     "uva_len": 138, "uva_lamports": 10**9,
     "steps": [("extend", 10, OUTSIDER), ("claim", 21, OUTSIDER), ("close", 21, OUTSIDER)],
     "expect": [{"name": "extend", "error": None, "events": 0,
                 "dUSER": -5000, "dPAYER": 0, "uva": SEEDED_REWARD,
                 "vault": 10**9, "ua": 17},
                {"name": "claim", "error": None, "events": 1,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {"lamports": 10**9, "needs": 0, "unc": 0, "claimed": 1400,
                        "vol": 0, "last": 21, "has": 1, "cb": 55, "cbcl": 13},
                 "vault": 999999300, "ua": 717,
                 "event": {"disc": CLAIM_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "mint": bytes(MINT).hex(), "amount": 700, "ts": 21,
                           "claimed": 1400, "vol": 0, "len": 104}},
                {"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 999999300, "ua": 717,
                 "event": CLOSE_EV(0, 1400, 0, 21, ts=21)}]},
    {"label": "x-extend50-claim-close", "uva_len": 50, "uva_lamports": 10**9,
     "steps": [("extend", 10, OUTSIDER), ("claim", 10, OUTSIDER), ("close", 10, OUTSIDER)],
     "expect": [{"name": "extend", "error": None, "events": 1,
                 "dUSER": -610520, "dPAYER": 0, "uva": EXT50,
                 "vault": 10**9, "ua": 17, "event": EXT_EV(50, 137)},
                {"name": "claim", "error": None, "events": 1,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {"lamports": 1000605520, "needs": 0, "unc": 0, "claimed": 500,
                        "vol": 0, "last": 10, "has": 1, "cb": 0, "cbcl": 0},
                 "vault": 999999500, "ua": 517,
                 "event": {"disc": CLAIM_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "mint": bytes(MINT).hex(), "amount": 500, "ts": 10,
                           "claimed": 500, "vol": 0, "len": 104}},
                {"name": "close", "error": None, "events": 1,
                 "dUSER": 1000600520, "dPAYER": 0, "uva": None,
                 "vault": 999999500, "ua": 517,
                 "event": CLOSE_EV(0, 500, 0, 10)}]},
    {"label": "x-extend50-close", "uva_len": 50, "uva_lamports": 10**9,
     "steps": [("extend", 10, OUTSIDER), ("close", 10, OUTSIDER)],
     "expect": [{"name": "extend", "error": None, "events": 1,
                 "dUSER": -610520, "dPAYER": 0, "uva": EXT50,
                 "vault": 10**9, "ua": 17, "event": EXT_EV(50, 137)},
                {"name": "close", "error": None, "events": 1,
                 "dUSER": 1000600520, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": CLOSE_EV(500, 188, 0, 0)}]},
    {"label": "x-close-extend-init-extend", "uva_len": 137, "uva_lamports": 10**9,
     "steps": [("close", 10, OUTSIDER), ("extend", 10, OUTSIDER),
               ("init", 10, OUTSIDER), ("extend", 10, OUTSIDER)],
     "expect": [{"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": CLOSE_EV(500, 700, 20, 10)},
                {"name": "extend", "error": "2004", "events": 0,
                 "dUSER": -5000, "dPAYER": 0, "uva": None, "rollback": True,
                 "site_fragment": "ConstraintOwner"},
                {"name": "init", "error": None, "events": 1,
                 "dUSER": -1849400, "dPAYER": 0, "uva": FRESH,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": INIT_EVT_DISC.hex(), "payer": bytes(USER).hex(),
                           "user": bytes(USER).hex(), "ts": 10, "len": 80}},
                {"name": "extend", "error": None, "events": 0,
                 "dUSER": -5000, "dPAYER": 0, "uva": FRESH,
                 "vault": 10**9, "ua": 17}]},
    {"label": "x-extend-unsigned-then-signed-close", "uva_len": 90, "uva_lamports": 1517280,
     "steps": [("extend_unsigned", 10, PAYER), ("extend", 10, OUTSIDER), ("close", 10, OUTSIDER)],
     "expect": [{"name": "extend_unsigned", "error": "3010", "events": 0,
                 "dUSER": 0, "dPAYER": -5000,
                 "uva": {"lamports": 1517280, "needs": 1, "unc": 500, "claimed": 700,
                        "vol": 20, "last": 10, "has": 1, "cb": 55, "cbcl": 13},
                 "rollback": True,
                 "site_fragment": "AccountNotSigner"},
                {"name": "extend", "error": None, "events": 1,
                 "dUSER": -332120, "dPAYER": 0, "uva": EXT90,
                 "vault": 10**9, "ua": 17, "event": EXT_EV(90, 137)},
                {"name": "close", "error": None, "events": 1,
                 "dUSER": 1839400, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": CLOSE_EV(500, 700, 20, 10)}]},
    {"label": "x-extend-readonly-then-signed-claim", "uva_len": 90, "uva_lamports": 1517280,
     "steps": [("extend_readonly", 10, OUTSIDER), ("extend", 10, OUTSIDER), ("claim", 10, OUTSIDER)],
     "expect": [{"name": "extend_readonly", "error": "2000", "events": 0,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {"lamports": 1517280, "needs": 1, "unc": 500, "claimed": 700,
                        "vol": 20, "last": 10, "has": 1, "cb": 55, "cbcl": 13},
                 "rollback": True,
                 "site_fragment": "ConstraintMut"},
                {"name": "extend", "error": None, "events": 1,
                 "dUSER": -332120, "dPAYER": 0, "uva": EXT90,
                 "vault": 10**9, "ua": 17, "event": EXT_EV(90, 137)},
                {"name": "claim", "error": None, "events": 1,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {"lamports": 1844400, "needs": 1, "unc": 0, "claimed": 500,
                        "vol": 20, "last": 10, "has": 1, "cb": 55, "cbcl": 13},
                 "vault": 999999500, "ua": 517,
                 "event": {"disc": CLAIM_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "mint": bytes(MINT).hex(), "amount": 500, "ts": 10,
                           "claimed": 500, "vol": 20, "len": 104}}]},
    {"label": "x-extend-twice-close", "uva_len": 90, "uva_lamports": 1517280,
     "steps": [("extend", 10, OUTSIDER), ("extend", 10, OUTSIDER), ("close", 10, OUTSIDER)],
     "expect": [{"name": "extend", "error": None, "events": 1,
                 "dUSER": -332120, "dPAYER": 0, "uva": EXT90,
                 "vault": 10**9, "ua": 17, "event": EXT_EV(90, 137)},
                {"name": "extend", "error": None, "events": 0,
                 "dUSER": -5000, "dPAYER": 0, "uva": EXT90,
                 "vault": 10**9, "ua": 17},
                {"name": "close", "error": None, "events": 1,
                 "dUSER": 1839400, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": CLOSE_EV(500, 700, 20, 10)}]},
]


def run_case(case, image_name, binary):
    h, ctx = setup_vm(binary, seed=case.get("seed", SEED),
                      uva_len=case["uva_len"], uva_lamports=case["uva_lamports"])
    ctx['now'] = 10
    out = []
    for (kind, now, fee_payer), exp in zip(case["steps"], case["expect"]):
        rec = do_step(h, ctx, kind, now, fee_payer)
        tag = f"{case['label']}/{image_name}/{kind}"
        if exp["error"] is None:
            check(rec["error"] is None, f"{tag}: unexpected error {rec['error']}")
        else:
            check(rec["error"] is not None and exp["error"] in rec["error"],
                  f"{tag}: expected error {exp['error']}, got {rec['error']}")
        check(len(rec["events"]) == exp["events"],
              f"{tag}: events {len(rec['events'])} != {exp['events']}")
        d_user = lam_delta(rec["before"][str(USER)], rec["after"][str(USER)])
        d_payer = lam_delta(rec["before"][str(PAYER_KEY)], rec["after"][str(PAYER_KEY)])
        check(d_user == exp["dUSER"], f"{tag}: dUSER {d_user} != {exp['dUSER']}")
        check(d_payer == exp["dPAYER"], f"{tag}: dPAYER {d_payer} != {exp['dPAYER']}")
        got_uva = parse_uva(rec["after"][str(U)])
        check(got_uva == exp["uva"], f"{tag}: uva {got_uva} != {exp['uva']}")
        if exp.get("vault") is not None:
            got_v = tok_amount(rec["after"][str(ctx["ga"])])
            check(got_v == exp["vault"], f"{tag}: vault {got_v} != {exp['vault']}")
        if exp.get("ua") is not None:
            got_a = tok_amount(rec["after"][str(ctx["ua"])])
            check(got_a == exp["ua"], f"{tag}: ua {got_a} != {exp['ua']}")
        if exp.get("rollback"):
            fee_key = str(fee_payer.pubkey())
            for k, b in rec["before"].items():
                if k == fee_key:
                    continue
                check(rec["after"][k] == b, f"{tag}: rollback violated for {k}")
        if exp.get("event") is not None:
            got = decode_event(kind if kind in ('close', 'init', 'sync', 'claim', 'extend') else kind, rec)
            check(got is not None, f"{tag}: event decode failed")
            for fkey, want in exp["event"].items():
                check(got.get(fkey) == want, f"{tag}: event {fkey} {got.get(fkey)} != {want}")
        if exp.get("site_fragment"):
            blob = "\n".join(rec["logs"])
            check(exp["site_fragment"] in blob,
                  f"{tag}: site fragment {exp['site_fragment']} not in logs")
        rec["case"] = case["label"]
        rec["image"] = image_name
        rec["step"] = kind
        out.append(rec)
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "runtime").mkdir(exist_ok=True)
    receipts = []
    report_cases = []
    for case in CASES:
        per_image = {}
        for image_name, binary in IMAGES.items():
            per_image[image_name] = run_case(case, image_name, binary)
        for rec in per_image["original"]:
            receipts.append(rec)

        def surface2(recs):
            out = []
            for rec in recs:
                b, a = rec["before"], rec["after"]
                def strip(snap):
                    d = dict(snap)
                    for k in (str(USER), str(PAYER_KEY)):
                        if d.get(k) is not None:
                            d[k] = dict(d[k]); d[k]["lamports"] = 0
                    return d
                out.append({"step": rec["step"], "error": rec["error"],
                            "events": len(rec["events"]),
                            "before": strip(b), "after": strip(a)})
            return out
        base = surface2(per_image["original"])
        for image_name in ("control", "candidate"):
            check(surface2(per_image[image_name]) == base,
                  f"{case['label']}: {image_name} observed surface differs from original")
            for rec in per_image[image_name]:
                receipts.append(rec)
        report_cases.append({"label": case["label"],
                             "steps": case["expect"],
                             "error_sites": {image_name: [r["site"] for r in per_image[image_name]] for image_name in IMAGES}})
        print(f"OK {case['label']} ({len(case['steps'])} steps x 3 images)")
    parts = []
    for i in range(0, len(receipts), 10):
        chunk = receipts[i:i + 10]
        name = f"raw-transactions-part{i // 10 + 1:02d}.jsonl.gz"
        path = OUT / "runtime" / name
        with gzip.open(path, "wt", encoding="utf-8") as fh:
            for rec in chunk:
                fh.write(json.dumps(rec) + "\n")
        parts.append({"file": f"runtime/{name}", "count": len(chunk),
                      "sha256": sha(path.read_bytes()), "bytes": path.stat().st_size})
    report = {"case_count": len(CASES), "receipt_count": len(receipts),
              "counts": {"cases": len(CASES), "receipts": len(receipts),
                         "parts": len(parts)},
              "mismatches": [],
              "input_sha256": {k: IMAGE_SHA[k] for k in IMAGES},
              "parts": parts, "cases": report_cases,
              "images": {k: IMAGE_SHA[k] for k in IMAGES}}
    with gzip.open(OUT / "runtime" / "report.json.gz", "wt", encoding="utf-8") as fh:
        fh.write(json.dumps(report, indent=2))
    print(f"cases={len(CASES)} receipts={len(receipts)} parts={len(parts)}")
    for p in parts:
        print(f"  {p['file']} {p['count']} receipts {p['bytes']} bytes")
    print("NEXT: write verify.py and README.md, then regenerate MANIFEST.json")


if __name__ == "__main__":
    main()
