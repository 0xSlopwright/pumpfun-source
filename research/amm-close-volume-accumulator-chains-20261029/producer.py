#!/usr/bin/env python3
"""Build research/amm-close-volume-accumulator-chains-20261029 receipts.

3rd run packet #1: user_volume_accumulator close lifecycle chains.

2nd #10 pinned init/close in isolation (rent, rewrite rules, length
gates, close returns the full balance) and 2nd #4 pinned claim math in
isolation, but no packet ever chained them: what happens to a seeded
accumulator's unclaimed tokens when it is closed, what a claim/sync/
second close sees after the account is gone, whether re-init restores
anything, and what the close event reports after a claim or a sync
reset. This packet answers that with multi-step chains, one signed
transaction per step, on three program images (original, #424
control, #427 candidate).

Fixture (per case, fresh VM per image): global volume accumulator
(start 20, end 49, period 1, supplies 1000x30, volumes 100x30),
incentive mint, vault 10^9, user ATA 17, seeded user accumulator
(needs 1, unclaimed 500, claimed 700, volume 20, last 10, has 1,
cashback 55, cashback_claimed 13; the reward case seeds last 20).
Fee payer is the user (OUTSIDER) unless a step says otherwise, so
payer deltas are measured per step against that step's before
snapshot -- absolute lamport balances are NOT asserted because the
harness VM accumulates airdrops across setups in one process.

Measured results (all three images agree on every step):
- close of the seeded account removes it, returns the full 10^9
  lamports (payer +999,995,000 after the 5,000 fee) and emits one
  80-byte CloseUserVolumeAccumulatorEvent (user, timestamp,
  total_unclaimed 500, total_claimed 700, current_sol_volume 20,
  last_update_timestamp 10).
- after a close, claim_token_incentives, sync_user_volume_accumulator,
  a second close, and claim_cashback ALL fail 3012
  AccountNotInitialized (caused by account:
  user_volume_accumulator), full rollback, fee payer -5,000 only.
  The 500 unclaimed tokens are NOT paid out by the close -- they
  exist only in the close event.
- re-init after a close creates a FRESH 137-byte account (rent
  1,844,400, payer -1,849,400): every field zeroed, the 700 claimed
  and 55 cashback_earned history gone. A following claim at now=10
  succeeds with 0 events ("No tokens to claim") and leaves the fresh
  account untouched; at now=21 it still pays nothing but stamps
  last_update_timestamp 0 -> 21 (the timestamp<=end_time block runs
  even for a zero claim).
- init's payer need not be the user: after a close, init with payer
  = PAYER charges PAYER -1,849,400 and USER 0, and the Init event
  records payer PAYER, user USER.
- close binds to the PDA seeds, not the stored user field: close by
  another signer (PAYER) against USER's accumulator fails 2006
  ConstraintSeeds (caused by account: user_volume_accumulator);
  an unsigned user fails 3010 AccountNotSigner (caused by account:
  user). Both roll back, fee payer -5,000.
- claim-then-close: the claim at now=10 first RESETS claimed
  700 -> 0 (now < start and last < start) and then pays the 500
  unclaimed (vault 999,999,500, user ATA 517, claimed 500, volume
  still 20, needs still 1); the close event then reports
  unclaimed 0, claimed 500, volume 20, last 10.
- reward-claim-then-close (seed last 20, claim at now=21): reward
  20*1000/100 = 200 accrues, 700 paid (vault 999,999,300, user ATA
  717, claimed 1400, volume 0, needs 0, last 21); the close event
  reports unclaimed 0, claimed 1400, volume 0, last 21.
- sync-then-close: sync at now=10 resets claimed 700 -> 0 (event
  before 700 after 0, has_total_claimed_tokens 1 -> 0) and the close
  event then reports claimed 0 with unclaimed 500 still in it --
  the reset does not pay anything out.
- claim-close-init-claim: after claim, close, re-init, a claim at
  now=21 pays nothing and only stamps last 0 -> 21. The 500-token
  claim history is gone, not merely zeroed: the re-created account
  is a new account.

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
OUT = ROOT / "research/amm-close-volume-accumulator-chains-20261029"
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
CLOSE_EVT_DISC = hashlib.sha256(b"event:CloseUserVolumeAccumulatorEvent").digest()[:8]
INIT_EVT_DISC = hashlib.sha256(b"event:InitUserVolumeAccumulatorEvent").digest()[:8]
SYNC_EVT_DISC = hashlib.sha256(b"event:SyncUserVolumeAccumulatorEvent").digest()[:8]
CLAIM_EVT_DISC = hashlib.sha256(b"event:ClaimTokenIncentivesEvent").digest()[:8]

SEED = (1, 500, 700, 20, 10, 1, 55, 13)
SEED_REWARD = (1, 500, 700, 20, 20, 1, 55, 13)
FRESH = {"lamports": 1844400, "needs": 0, "unc": 0, "claimed": 0, "vol": 0,
         "last": 0, "has": 0, "cb": 0, "cbcl": 0}
SEEDED = {"lamports": 10**9, "needs": 1, "unc": 500, "claimed": 700, "vol": 20,
          "last": 10, "has": 1, "cb": 55, "cbcl": 13}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def setup_vm(binary, seed=SEED):
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
    vm.set_account(U, Account(10**9, u.ljust(137, b'\0'), PROGRAM))
    vm.set_account(MINT, Account(10**9, struct.pack('<I', 0) + bytes(32) + struct.pack('<Q', 10**12) + bytes([6, 1]) + bytes(36), TOKEN))
    vm.set_account(ga, Account(10**9, token_data(G, 10**9), TOKEN))
    vm.set_account(ua, Account(10**9, token_data(USER, 17), TOKEN))
    return h, {"ga": ga, "ua": ua}


WATCH_KEYS = None  # set after first setup_vm


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
    # clock is set by the caller via ctx['now']
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


def do_step(h, ctx, kind, now, fee_payer=OUTSIDER):
    ctx['now'] = now
    if kind == 'close':
        return _close(h, ctx, fee_payer, None, False)
    if kind == 'close_other':
        return _close(h, ctx, PAYER, PAYER_KEY, False)
    if kind == 'close_unsigned':
        return _close(h, ctx, PAYER, None, True)
    if kind == 'init':
        keys = [fee_payer.pubkey(), USER, U, Pubkey.default(), EVENT, PROGRAM]
        return send_tx(h, ctx, 'init_user_volume_accumulator', keys, fee_payer, [fee_payer], now)
    if kind == 'sync':
        keys = [USER, G, U, EVENT, PROGRAM]
        return send_tx(h, ctx, 'sync_user_volume_accumulator', keys, fee_payer, [fee_payer], now)
    if kind == 'claim':
        keys = [USER, ctx['ua'], G, ctx['ga'], U, MINT, TOKEN, Pubkey.default(), ATA, EVENT, PROGRAM, fee_payer.pubkey()]
        return send_tx(h, ctx, 'claim_token_incentives', keys, fee_payer, [fee_payer], now)
    if kind == 'cashback':
        keys = [USER, U, MINT, TOKEN, U, ctx['ua'], Pubkey.default(), EVENT, PROGRAM]
        return send_tx(h, ctx, 'claim_cashback', keys, fee_payer, [fee_payer], now)
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
    return None


CASES = [
    {"label": "c-close-seeded", "family": "C",
     "steps": [("close", 10, OUTSIDER)],
     "expect": [{"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 500, "claimed": 700, "vol": 20, "last": 10, "len": 80}}]},
    {"label": "c-close-then-claim", "family": "C",
     "steps": [("close", 10, OUTSIDER), ("claim", 10, OUTSIDER)],
     "expect": [{"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 500, "claimed": 700, "vol": 20, "last": 10, "len": 80}},
                {"name": "claim", "error": "3012", "events": 0,
                 "dUSER": -5000, "dPAYER": 0, "uva": None, "rollback": True,
                 "site_fragment": "AccountNotInitialized"}]},
    {"label": "c-close-then-sync", "family": "C",
     "steps": [("close", 10, OUTSIDER), ("sync", 10, OUTSIDER)],
     "expect": [{"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 500, "claimed": 700, "vol": 20, "last": 10, "len": 80}},
                {"name": "sync", "error": "3012", "events": 0,
                 "dUSER": -5000, "dPAYER": 0, "uva": None, "rollback": True,
                 "site_fragment": "AccountNotInitialized"}]},
    {"label": "c-close-then-close", "family": "C",
     "steps": [("close", 10, OUTSIDER), ("close", 10, OUTSIDER)],
     "expect": [{"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 500, "claimed": 700, "vol": 20, "last": 10, "len": 80}},
                {"name": "close", "error": "3012", "events": 0,
                 "dUSER": -5000, "dPAYER": 0, "uva": None, "rollback": True,
                 "site_fragment": "AccountNotInitialized"}]},
    {"label": "c-close-then-cashback", "family": "C",
     "steps": [("close", 10, OUTSIDER), ("cashback", 10, OUTSIDER)],
     "expect": [{"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 500, "claimed": 700, "vol": 20, "last": 10, "len": 80}},
                {"name": "cashback", "error": "3012", "events": 0,
                 "dUSER": -5000, "dPAYER": 0, "uva": None, "rollback": True,
                 "site_fragment": "AccountNotInitialized"}]},
    {"label": "c-close-then-init", "family": "C",
     "steps": [("close", 10, OUTSIDER), ("init", 10, OUTSIDER)],
     "expect": [{"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 500, "claimed": 700, "vol": 20, "last": 10, "len": 80}},
                {"name": "init", "error": None, "events": 1,
                 "dUSER": -1849400, "dPAYER": 0, "uva": FRESH,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": INIT_EVT_DISC.hex(), "payer": bytes(USER).hex(),
                           "user": bytes(USER).hex(), "ts": 10, "len": 80}}]},
    {"label": "c-close-init-claim10", "family": "C",
     "steps": [("close", 10, OUTSIDER), ("init", 10, OUTSIDER), ("claim", 10, OUTSIDER)],
     "expect": [{"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 500, "claimed": 700, "vol": 20, "last": 10, "len": 80}},
                {"name": "init", "error": None, "events": 1,
                 "dUSER": -1849400, "dPAYER": 0, "uva": FRESH,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": INIT_EVT_DISC.hex(), "payer": bytes(USER).hex(),
                           "user": bytes(USER).hex(), "ts": 10, "len": 80}},
                {"name": "claim", "error": None, "events": 0,
                 "dUSER": -5000, "dPAYER": 0, "uva": FRESH,
                 "vault": 10**9, "ua": 17}]},
    {"label": "c-close-init-claim21", "family": "C",
     "steps": [("close", 10, OUTSIDER), ("init", 10, OUTSIDER), ("claim", 21, OUTSIDER)],
     "expect": [{"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 500, "claimed": 700, "vol": 20, "last": 10, "len": 80}},
                {"name": "init", "error": None, "events": 1,
                 "dUSER": -1849400, "dPAYER": 0, "uva": FRESH,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": INIT_EVT_DISC.hex(), "payer": bytes(USER).hex(),
                           "user": bytes(USER).hex(), "ts": 10, "len": 80}},
                {"name": "claim", "error": None, "events": 0,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {**FRESH, "last": 21},
                 "vault": 10**9, "ua": 17}]},
    {"label": "c-close-init-by-payer", "family": "C",
     "steps": [("close", 10, OUTSIDER), ("init", 10, PAYER)],
     "expect": [{"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 500, "claimed": 700, "vol": 20, "last": 10, "len": 80}},
                {"name": "init", "error": None, "events": 1,
                 "dUSER": 0, "dPAYER": -1849400, "uva": FRESH,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": INIT_EVT_DISC.hex(), "payer": bytes(PAYER_KEY).hex(),
                           "user": bytes(USER).hex(), "ts": 10, "len": 80}}]},
    {"label": "c-close-by-other", "family": "C",
     "steps": [("close_other", 10, PAYER)],
     "expect": [{"name": "close_other", "error": "2006", "events": 0,
                 "dUSER": 0, "dPAYER": -5000, "uva": SEEDED, "rollback": True,
                 "site_fragment": "ConstraintSeeds"}]},
    {"label": "c-close-unsigned", "family": "C",
     "steps": [("close_unsigned", 10, PAYER)],
     "expect": [{"name": "close_unsigned", "error": "3010", "events": 0,
                 "dUSER": 0, "dPAYER": -5000, "uva": SEEDED, "rollback": True,
                 "site_fragment": "AccountNotSigner"}]},
    {"label": "r-claim-then-close", "family": "R",
     "steps": [("claim", 10, OUTSIDER), ("close", 10, OUTSIDER)],
     "expect": [{"name": "claim", "error": None, "events": 1,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {"lamports": 10**9, "needs": 1, "unc": 0, "claimed": 500,
                        "vol": 20, "last": 10, "has": 1, "cb": 55, "cbcl": 13},
                 "vault": 999999500, "ua": 517,
                 "event": {"disc": CLAIM_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "mint": bytes(MINT).hex(), "amount": 500, "ts": 10,
                           "claimed": 500, "vol": 20, "len": 104}},
                {"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 999999500, "ua": 517,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 0, "claimed": 500, "vol": 20, "last": 10, "len": 80}}]},
    {"label": "r-reward-claim-then-close", "family": "R", "seed": SEED_REWARD,
     "steps": [("claim", 21, OUTSIDER), ("close", 21, OUTSIDER)],
     "expect": [{"name": "claim", "error": None, "events": 1,
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
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 21, "unc": 0, "claimed": 1400, "vol": 0, "last": 21, "len": 80}}]},
    {"label": "r-sync-then-close", "family": "R",
     "steps": [("sync", 10, OUTSIDER), ("close", 10, OUTSIDER)],
     "expect": [{"name": "sync", "error": None, "events": 1,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {"lamports": 10**9, "needs": 1, "unc": 500, "claimed": 0,
                        "vol": 20, "last": 10, "has": 0, "cb": 55, "cbcl": 13},
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": SYNC_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "before": 700, "after": 0, "ts": 10, "len": 64}},
                {"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 10**9, "ua": 17,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 500, "claimed": 0, "vol": 20, "last": 10, "len": 80}}]},
    {"label": "r-claim-close-claim", "family": "R",
     "steps": [("claim", 10, OUTSIDER), ("close", 10, OUTSIDER), ("claim", 10, OUTSIDER)],
     "expect": [{"name": "claim", "error": None, "events": 1,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {"lamports": 10**9, "needs": 1, "unc": 0, "claimed": 500,
                        "vol": 20, "last": 10, "has": 1, "cb": 55, "cbcl": 13},
                 "vault": 999999500, "ua": 517,
                 "event": {"disc": CLAIM_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "mint": bytes(MINT).hex(), "amount": 500, "ts": 10,
                           "claimed": 500, "vol": 20, "len": 104}},
                {"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 999999500, "ua": 517,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 0, "claimed": 500, "vol": 20, "last": 10, "len": 80}},
                {"name": "claim", "error": "3012", "events": 0,
                 "dUSER": -5000, "dPAYER": 0, "uva": None, "rollback": True,
                 "site_fragment": "AccountNotInitialized"}]},
    {"label": "r-claim-close-init-claim", "family": "R",
     "steps": [("claim", 10, OUTSIDER), ("close", 10, OUTSIDER),
               ("init", 10, OUTSIDER), ("claim", 21, OUTSIDER)],
     "expect": [{"name": "claim", "error": None, "events": 1,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {"lamports": 10**9, "needs": 1, "unc": 0, "claimed": 500,
                        "vol": 20, "last": 10, "has": 1, "cb": 55, "cbcl": 13},
                 "vault": 999999500, "ua": 517,
                 "event": {"disc": CLAIM_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "mint": bytes(MINT).hex(), "amount": 500, "ts": 10,
                           "claimed": 500, "vol": 20, "len": 104}},
                {"name": "close", "error": None, "events": 1,
                 "dUSER": 999995000, "dPAYER": 0, "uva": None,
                 "vault": 999999500, "ua": 517,
                 "event": {"disc": CLOSE_EVT_DISC.hex(), "user": bytes(USER).hex(),
                           "ts": 10, "unc": 0, "claimed": 500, "vol": 20, "last": 10, "len": 80}},
                {"name": "init", "error": None, "events": 1,
                 "dUSER": -1849400, "dPAYER": 0, "uva": FRESH,
                 "vault": 999999500, "ua": 517,
                 "event": {"disc": INIT_EVT_DISC.hex(), "payer": bytes(USER).hex(),
                           "user": bytes(USER).hex(), "ts": 10, "len": 80}},
                {"name": "claim", "error": None, "events": 0,
                 "dUSER": -5000, "dPAYER": 0,
                 "uva": {**FRESH, "last": 21},
                 "vault": 999999500, "ua": 517}]},
]


def run_case(case, image_name, binary):
    h, ctx = setup_vm(binary, seed=case.get("seed", SEED))
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
            got = decode_event(kind if kind in ('close', 'init', 'sync', 'claim') else kind, rec)
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

        # surface comparison uses the full before/after snapshots minus
        # absolute fee-payer lamports (airdrop accumulation across setups
        # in one process makes absolutes differ, deltas do not).
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
        report_cases.append({"label": case["label"], "family": case["family"],
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
