#!/usr/bin/env python3
"""Build research/amm-coin-creator-downstream-binding-20261029 receipts.

2nd run packet #49: what coin-creator reassignment BINDS downstream.
2nd #9 pinned only the set_coin_creator / migrate_pool_coin_creator
setter gates (first-creator rule, 6028/6045/6046/6074/6081, PDA and
owner checks, the already-set no-op). It never chained a trade, a
sweep, or a collect after a reassignment, so the binding questions
were open:

- Legacy buy/sell read the creator vault from pool.coin_creator
  through a PDA seeds constraint
  (coin_creator_vault_authority = PDA [b"creator_vault",
  pool.coin_creator]). After a set, the OLD vault PDA fails
  2006 ConstraintSeeds and the old vault ATA fails 2015
  ConstraintTokenOwner; only the NEW vault PDA + ATA routes the
  creator leg. A pool with coin_creator == default charges NO
  creator fee at all (buy.rs creator_bps = 0), so the same buy
  costs 1,842,321 before a set and 1,847,796 after it.
- set has NO sweep gate: it succeeds with creator_fees = 123,394
  still accrued, while migrate refuses the same state with 6081
  CreatorFeesNotSwept. The unblocker is sweep_creator_fee, whose
  recipient must equal the CURRENT creator's vault PDA (old vault
  -> 2006); sweeping also converts the accrual into virtual
  quote reserves (take_accrued_fees adds to vq), so the curve
  does not move and the post-sweep buy anchors are unchanged.
- collect_coin_creator_fee does NOT read the pool at all: after
  a set it still pays the OLD creator's vault, and after a
  migrate it pays the NEW creator's vault; only the migrated
  sharing-config PDA itself is refused, with 6048
  CreatorVaultMigratedToSharingConfig (owner == FEES program).
- v2 trades accrue the creator fee in pool.creator_fees (a pool
  field, creator-agnostic): before a set the event still reports
  creator_bps 30 but creator_fee 0 and the pool field does not
  move; after a set the same buy accrues 5,475, which a sweep
  then moves to the new vault ATA and zeroes, unblocking migrate.

Cases (18, each run on original / #424 control / #427 candidate):
Family A (set -> legacy buy, 7): buy-before-set (creator 0,
spend 1,842,321, trimmed remaining); set -> buy (creator 5,475
to the NEW ATA, old ATA 0); set -> buy with the ATA absent
(init_if_needed creates it, payer 3,888,680); set -> buy with
the OLD vault PDA (2006); set -> buy with the new vault PDA
but the OLD ATA (2015); set with unswept fees (success,
fees unchanged); set -> set again (no-op, 0 events) -> buy
still routes to the FIRST creator.
Family B (migrate, 3): set -> sweep (123,394 to the NEW ATA,
pool creator 0) -> migrate -> buy (creator 5,475 to the
SHARING vault ATA); set -> sweep with the OLD vault (2006);
set -> migrate without sweeping (6081).
Family C (collect keying, 3): set -> collect OLD creator
(success, 1000 paid); sweep -> migrate -> collect the SHARING
PDA (6048); set -> collect NEW creator (success, 1000 paid).
Family D (v2 accrual + sweep, 3): v2 buy before set (event
creator 30/0, pool creator unchanged); v2 buy after set
(spend 1,847,796, vault +1,839,310, pool creator +5,475);
set -> v2 buy -> sweep (128,869 to the NEW ATA, pool
creator 0) -> migrate (success).
Family S (legacy sell, 2): set -> sell (creator 548 to the
NEW ATA, #44 anchor otherwise unchanged); set -> sell with
the OLD vault PDA (2006).

Receipts are one signed transaction per step (39 steps per
image, 117 total), stored 10 per part. The builder asserts
every expected value below per image before writing.
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

from pump_amm_legacy_buy_differential import (
    IDL, PAYER, PROGRAM, TOKEN, TOKEN22, FEES, ATA, CONFIG, CONFIG_KEY,
    RAW, EVENT, base, quote, pool, poolraw, userbase, userquote,
    vaultbase, vaultquote, PROTOCOL, PROTOCOL_ATA, CREATOR_VAULT,
    CREATOR_ATA, feeconfig, volume, buyback, token, f,
)
from pump_amm_reusable_harness import acquire_harness

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-coin-creator-downstream-binding-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}

META_PROG = Pubkey.from_string('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
PUMP_PROG = Pubkey.from_string('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P')
FEES_PROG = Pubkey.from_string('pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ')
META_PDA, _ = Pubkey.find_program_address([b'metadata', bytes(META_PROG), bytes(base)], META_PROG)
BC_PDA, _ = Pubkey.find_program_address([b'bonding-curve', bytes(base)], PUMP_PROG)
SHARING_PDA, _ = Pubkey.find_program_address([b'sharing-config', bytes(base)], FEES_PROG)
GLOBAL_VOLUME, _ = Pubkey.find_program_address([b'global_volume_accumulator'], PROGRAM)
SH_DISC = bytes([216, 74, 9, 0, 56, 140, 93, 75])
CREATOR0 = bytes([0x11]) * 32
CREATOR1 = bytes([0x22]) * 32
FIX_CC = bytes(poolraw[211:243])
FIX_CC_KEY = Pubkey.from_bytes(FIX_CC)
BUYBACK_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
POOLV2, _ = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)
PAYER_KEY = PAYER.pubkey()

SET_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'set_coin_creator')['discriminator'])
MIG_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'migrate_pool_coin_creator')['discriminator'])
BUY_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'buy')['discriminator'])
SELL_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'sell')['discriminator'])
V2BUY_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'buy_v2')['discriminator'])
SWEEP_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'sweep_creator_fee')['discriminator'])
COLLECT_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'collect_coin_creator_fee')['discriminator'])


def sha(data):
    return hashlib.sha256(data).hexdigest()


def s32(b):
    return struct.pack('<I', len(b)) + b


def metadata_bytes(creators):
    d = bytearray()
    d += bytes([4])
    d += bytes([0x44]) * 32
    d += bytes(base)
    d += s32(b'TEST') + s32(b'TST') + s32(b'https://example.invalid/x.json')
    d += struct.pack('<H', 500)
    if creators is None:
        d += bytes([0])
    else:
        d += bytes([1]) + struct.pack('<I', len(creators))
        for c in creators:
            d += bytes(c) + bytes([1, 100])
    d += bytes([0, 0, 1, 1, 0, 0, 0])
    return bytes(d)


def bonding_curve_bytes(creator=bytes([0x33]) * 32):
    d = bytearray(bytes([23, 183, 248, 55, 96, 216, 172, 96]))
    d += struct.pack('<QQQQQ', 10**9, 10**9, 10**9, 10**9, 10**12)
    d += bytes([0])
    d += bytes(creator)
    d += bytes([0, 0])
    return bytes(d)


def sharing_bytes(admin):
    d = bytearray(80)
    d[0:8] = SH_DISC
    d[10] = 1
    d[11:43] = bytes(base)
    d[43:75] = bytes(admin)
    d[76:80] = struct.pack('<I', 0)
    return bytes(d)


def vault_of(creator_bytes):
    v, _ = Pubkey.find_program_address([b'creator_vault', bytes(creator_bytes)], PROGRAM)
    ata = Pubkey.find_program_address([bytes(v), bytes(TOKEN), bytes(quote)], ATA)[0]
    return v, ata


NEW_VAULT, NEW_ATA = vault_of(CREATOR0)
NEW2_VAULT, NEW2_ATA = vault_of(CREATOR1)
DEF_VAULT, DEF_ATA = vault_of(bytes(32))
SH_VAULT, SH_ATA = vault_of(bytes(SHARING_PDA))
DEST_OLD = Pubkey.from_bytes(bytes([0x55]) * 32)
DEST_NEW = Pubkey.from_bytes(bytes([0x56]) * 32)
DEST_SH = Pubkey.from_bytes(bytes([0x57]) * 32)

WATCH = [pool, userquote, userbase, vaultbase, vaultquote, PROTOCOL_ATA,
         CREATOR_ATA, NEW_ATA, SH_ATA, DEF_ATA, volume, buyback, PAYER_KEY,
         DEST_OLD, DEST_NEW, DEST_SH]


def snap(vm, keys=WATCH):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        out[str(k)] = None if (not a or a.executable) else {
            "lamports": a.lamports, "owner": str(a.owner),
            "data_hex": bytes(a.data).hex()}
    return out


def tok_amount(snap_entry):
    if snap_entry is None:
        return None
    raw = bytes.fromhex(snap_entry["data_hex"])
    if len(raw) < 72:
        return None
    return struct.unpack_from('<Q', raw, 64)[0]


def tok_delta(before, after):
    b = tok_amount(before) or 0
    a = tok_amount(after) or 0
    return a - b


def lam_delta(before, after):
    b = before["lamports"] if before else 0
    a = after["lamports"] if after else 0
    return a - b


def pool_cc(snap_entry):
    return bytes.fromhex(snap_entry["data_hex"])[211:243].hex()


def pool_fees(snap_entry):
    raw = bytes.fromhex(snap_entry["data_hex"])
    return [struct.unpack_from('<Q', raw, 271)[0],
            struct.unpack_from('<Q', raw, 279)[0]]


def ev_data(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    return base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())


def u64(raw, off):
    return struct.unpack_from('<Q', raw, off)[0]


def setup_vm(binary, pool_mut=None, sharing_admin=None, pre_new=True,
             pre_sh=True, pre_def=True, meta_creators=(CREATOR0, CREATOR1),
             collect_seed=None):
    h = acquire_harness(binary)
    h.vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    h.vm.airdrop(PAYER_KEY, 10**12)
    for pid, filepath in [(TOKEN, 'evidence/dependencies/spl_token/deployed.so'),
                          (TOKEN22, 'evidence/dependencies/spl_token_2022/deployed.so'),
                          (FEES, 'evidence/original/pump_fees/deployed.so'),
                          (ATA, 'evidence/dependencies/associated_token/deployed.so')]:
        h.vm.add_program_from_file(pid, ROOT / filepath)
    for n, row in f['accounts'].items():
        h.vm.set_account(Pubkey.from_string(row['address']),
                         Account(row['lamports'], base64.b64decode(row['data_base64']),
                                 Pubkey.from_string(row['owner'])))
    glob = bytearray(RAW)
    glob[56] = 0
    h.vm.set_account(CONFIG_KEY, Account(CONFIG['lamports'], bytes(glob), PROGRAM))
    for k, m, owner, native in [(userbase, base, PAYER_KEY, False),
                                (userquote, quote, PAYER_KEY, True),
                                (PROTOCOL_ATA, quote, PROTOCOL, True),
                                (CREATOR_ATA, quote, CREATOR_VAULT, True)]:
        h.vm.set_account(k, Account(10**15 + 2039280 if native else 10**9,
                                    token(m, owner, 10**15 if k in [userbase, userquote] else 0, native), TOKEN))
    for k in [PROTOCOL, CREATOR_VAULT]:
        h.vm.set_account(k, Account(10**9, b'', Pubkey.default()))
    h.vm.set_account(volume, Account(0, b'', Pubkey.default()))
    gdisc = bytes(next(x for x in IDL['accounts'] if x['name'] == 'GlobalVolumeAccumulator')['discriminator'])
    h.vm.set_account(GLOBAL_VOLUME, Account(10**9, gdisc + struct.pack('<qqq', 0, 0, 86400) + bytes(base) + bytes(480), PROGRAM))
    pdata = bytearray(poolraw)
    if pool_mut:
        pool_mut(pdata)
    h.vm.set_account(pool, Account(10**9, bytes(pdata), PROGRAM))
    h.vm.set_account(META_PDA, Account(10**9, metadata_bytes(list(meta_creators)), META_PROG))
    h.vm.set_account(BC_PDA, Account(10**9, bonding_curve_bytes(), PUMP_PROG))
    if sharing_admin is not None:
        h.vm.set_account(SHARING_PDA, Account(10**9, sharing_bytes(sharing_admin), FEES_PROG))
    for k in [POOLV2, BUYBACK_OWNER]:
        h.vm.set_account(k, Account(10**9, b'', Pubkey.default()))
    # creator vault PDAs (empty accounts) + their ATAs
    for vault in [NEW_VAULT, SH_VAULT, DEF_VAULT]:
        h.vm.set_account(vault, Account(10**9, b'', Pubkey.default()))
    if pre_def:
        h.vm.set_account(DEF_ATA, Account(2039280, token(quote, DEF_VAULT, 0, True), TOKEN))
    if pre_new:
        h.vm.set_account(NEW_ATA, Account(2039280, token(quote, NEW_VAULT, 0, True), TOKEN))
    if pre_sh:
        h.vm.set_account(SH_ATA, Account(2039280, token(quote, SH_VAULT, 0, True), TOKEN))
    # collect destinations (owned by the named creator)
    h.vm.set_account(DEST_OLD, Account(2039280, token(quote, FIX_CC_KEY, 0, True), TOKEN))
    h.vm.set_account(DEST_NEW, Account(2039280, token(quote, Pubkey.from_bytes(CREATOR0), 0, True), TOKEN))
    h.vm.set_account(DEST_SH, Account(2039280, token(quote, SHARING_PDA, 0, True), TOKEN))
    if collect_seed:
        for ata_key, vault_key, amount in collect_seed:
            h.vm.set_account(ata_key, Account(amount + 2039280, token(quote, vault_key, amount, True), TOKEN))
    return h


def send_tx(h, data, metas):
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, data, metas)], PAYER_KEY, [PAYER], h.vm.latest_blockhash())
    assert tx.verify_with_results() and all(tx.verify_with_results())
    before = snap(h.vm)
    r = h.vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    logs = meta.logs()
    after = snap(h.vm)
    site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
    return {"transaction_base64": base64.b64encode(bytes(tx)).decode(),
            "error": str(r.err()) if failed else None,
            "logs": logs,
            "events": [l for l in logs if l.startswith("Program data: ")],
            "before": before, "after": after, "site": site}


def idl_metas(name, keys):
    ix = next(x for x in IDL['instructions'] if x['name'] == name)
    return [AccountMeta(k, bool(row.get('signer')), bool(row.get('writable')))
            for k, row in zip(keys, ix['accounts'])]


def do_set(h):
    return send_tx(h, SET_DISC, [AccountMeta(pool, False, True),
                                 AccountMeta(META_PDA, False, False),
                                 AccountMeta(BC_PDA, False, False),
                                 AccountMeta(EVENT, False, False),
                                 AccountMeta(PROGRAM, False, False)])


def do_mig(h):
    return send_tx(h, MIG_DISC, [AccountMeta(pool, False, True),
                                 AccountMeta(SHARING_PDA, False, False),
                                 AccountMeta(EVENT, False, False),
                                 AccountMeta(PROGRAM, False, False)])


def buy_keys(vault_ata, vault_pda):
    return [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, PROTOCOL, PROTOCOL_ATA, TOKEN, TOKEN,
            Pubkey.default(), ATA, EVENT, PROGRAM, vault_ata, vault_pda,
            GLOBAL_VOLUME, volume, feeconfig, FEES]


def do_buy(h, vault_ata, vault_pda, remaining, amount, limit):
    metas = idl_metas('buy', buy_keys(vault_ata, vault_pda)) + remaining
    return send_tx(h, BUY_DISC + struct.pack('<QQ', amount, limit) + b'\0', metas)


def do_sell(h, vault_ata, vault_pda, remaining, amount, limit):
    keys = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, PROTOCOL, PROTOCOL_ATA, TOKEN, TOKEN,
            Pubkey.default(), ATA, EVENT, PROGRAM, vault_ata, vault_pda,
            feeconfig, FEES]
    metas = idl_metas('sell', keys) + remaining
    return send_tx(h, SELL_DISC + struct.pack('<QQ', amount, limit), metas)


def do_v2buy(h, amount, limit):
    keys = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume,
            feeconfig, buyback, EVENT, PROGRAM]
    metas = idl_metas('buy_v2', keys)
    return send_tx(h, V2BUY_DISC + struct.pack('<QQ', amount, limit), metas)


def do_sweep(h, recipient, recipient_ata):
    keys = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN, vaultquote, recipient,
            recipient_ata, Pubkey.default(), ATA, EVENT, PROGRAM]
    metas = idl_metas('sweep_creator_fee', keys)
    return send_tx(h, SWEEP_DISC, metas)


def do_collect(h, creator, vault_auth, vault_ata, dest):
    keys = [quote, TOKEN, creator, vault_auth, vault_ata, dest, EVENT, PROGRAM]
    metas = idl_metas('collect_coin_creator_fee', keys)
    return send_tx(h, COLLECT_DISC, metas)


def rem_std():
    return [AccountMeta(POOLV2, False, False),
            AccountMeta(BUYBACK_OWNER, False, False),
            AccountMeta(buyback, False, True)]


def rem_trim():
    return [AccountMeta(BUYBACK_OWNER, False, False),
            AccountMeta(buyback, False, True)]


def check(cond, msg):
    if not cond:
        raise AssertionError(msg)


ZERO_CC = lambda d: d.__setitem__(slice(211, 243), bytes(32))


# ---------------------------------------------------------------- cases
BUY_ANCHOR = {"spend": 1847796, "vaultq": 1825348, "proto": 8487,
              "creator": 5475, "buyback": 8486}
CASES = [
    {"label": "buy-before-set", "family": "A",
     "pool_mut": ZERO_CC,
     "steps": [("buy", {"vault_ata": DEF_ATA, "vault_pda": DEF_VAULT,
                        "remaining": rem_trim(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -1842321, "vaultquote": 1825348,
                            "PROTOCOL_ATA": 8487, "DEF_ATA": 0, "buyback": 8486},
                 "pool_cc": bytes(32).hex(), "pool_fees": [2488, 123394],
                 "event": {"curve": 1824983, "lp_fee": 365, "proto_fee": 16973,
                           "qwlp": 1825348, "uqin": 1842321, "creator_bps": 30,
                           "creator_fee": 0, "buyback_fee": 8486}}]},
    {"label": "set-then-buy", "family": "A",
     "pool_mut": ZERO_CC,
     "steps": [("set", {}),
               ("buy", {"vault_ata": NEW_ATA, "vault_pda": NEW_VAULT,
                        "remaining": rem_std(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -1847796, "vaultquote": 1825348,
                            "PROTOCOL_ATA": 8487, "NEW_ATA": 5475,
                            "CREATOR_ATA": 0, "buyback": 8486},
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"curve": 1824983, "lp_fee": 365, "proto_fee": 16973,
                           "qwlp": 1825348, "uqin": 1847796, "creator_bps": 30,
                           "creator_fee": 5475, "buyback_fee": 8486}}]},
    {"label": "set-then-buy-uncreated-ata", "family": "A",
     "pool_mut": ZERO_CC, "pre_new": False,
     "steps": [("set", {}),
               ("buy", {"vault_ata": NEW_ATA, "vault_pda": NEW_VAULT,
                        "remaining": rem_std(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "buy", "error": None, "events": 1, "payer": 3888680,
                 "deltas": {"userquote": -1847796, "vaultquote": 1825348,
                            "PROTOCOL_ATA": 8487, "NEW_ATA": 5475,
                            "buyback": 8486},
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"curve": 1824983, "lp_fee": 365, "proto_fee": 16973,
                           "qwlp": 1825348, "uqin": 1847796, "creator_bps": 30,
                           "creator_fee": 5475, "buyback_fee": 8486}}]},
    {"label": "set-then-buy-old-vault", "family": "A",
     "pool_mut": ZERO_CC,
     "steps": [("set", {}),
               ("buy", {"vault_ata": DEF_ATA, "vault_pda": DEF_VAULT,
                        "remaining": rem_std(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "buy", "error": "2006", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "coin_creator_vault_authority",
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394]}]},
    {"label": "set-then-buy-new-vault-old-ata", "family": "A",
     "pool_mut": ZERO_CC,
     "steps": [("set", {}),
               ("buy", {"vault_ata": CREATOR_ATA, "vault_pda": NEW_VAULT,
                        "remaining": rem_std(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "buy", "error": "2015", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "coin_creator_vault_ata",
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394]}]},
    {"label": "set-unswept", "family": "A",
     "pool_mut": ZERO_CC,
     "steps": [("set", {})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}}]},
    {"label": "set-twice-then-buy", "family": "A",
     "pool_mut": ZERO_CC,
     "steps": [("set", {}), ("set2", {}),
               ("buy", {"vault_ata": NEW_ATA, "vault_pda": NEW_VAULT,
                        "remaining": rem_std(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "set2", "error": None, "events": 0, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "log_fragment": "already set"},
                {"name": "buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -1847796, "vaultquote": 1825348,
                            "PROTOCOL_ATA": 8487, "NEW_ATA": 5475,
                            "buyback": 8486},
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"curve": 1824983, "lp_fee": 365, "proto_fee": 16973,
                           "qwlp": 1825348, "uqin": 1847796, "creator_bps": 30,
                           "creator_fee": 5475, "buyback_fee": 8486}}]},
    {"label": "set-sweep-migrate-buy", "family": "B",
     "pool_mut": ZERO_CC, "sharing_admin": CREATOR0,
     "steps": [("set", {}),
               ("sweep", {"recipient": NEW_VAULT, "recipient_ata": NEW_ATA}),
               ("mig", {}),
               ("buy", {"vault_ata": SH_ATA, "vault_pda": SH_VAULT,
                        "remaining": rem_std(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "sweep", "error": None, "events": 1, "payer": 5000,
                 "deltas": {"vaultquote": -123394, "NEW_ATA": 123394},
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 0],
                 "event": {"amount": 123394, "bucket": 1}},
                {"name": "mig", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": bytes(SHARING_PDA).hex(), "pool_fees": [2488, 0],
                 "event": {"old": CREATOR0.hex(),
                           "new": bytes(SHARING_PDA).hex()}},
                {"name": "buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -1847796, "vaultquote": 1825348,
                            "PROTOCOL_ATA": 8487, "SH_ATA": 5475,
                            "buyback": 8486},
                 "pool_cc": bytes(SHARING_PDA).hex(), "pool_fees": [2488, 0],
                 "event": {"curve": 1824983, "lp_fee": 365, "proto_fee": 16973,
                           "qwlp": 1825348, "uqin": 1847796, "creator_bps": 30,
                           "creator_fee": 5475, "buyback_fee": 8486}}]},
    {"label": "set-then-sweep-old-vault", "family": "B",
     "pool_mut": ZERO_CC,
     "steps": [("set", {}),
               ("sweep", {"recipient": CREATOR_VAULT, "recipient_ata": CREATOR_ATA})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "sweep", "error": "2006", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "sweep_fees",
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394]}]},
    {"label": "set-then-migrate-unswept", "family": "B",
     "pool_mut": ZERO_CC, "sharing_admin": CREATOR0,
     "steps": [("set", {}), ("mig", {})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "mig", "error": "6081", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "CreatorFeesNotSwept",
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394]}]},
    {"label": "set-then-collect-old", "family": "C",
     "pool_mut": ZERO_CC,
     "collect_seed": [(CREATOR_ATA, CREATOR_VAULT, 1000)],
     "steps": [("set", {}),
               ("collect", {"creator": FIX_CC_KEY, "vault_auth": CREATOR_VAULT,
                            "vault_ata": CREATOR_ATA, "dest": DEST_OLD})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "collect", "error": None, "events": 1, "payer": 5000,
                 "deltas": {"CREATOR_ATA": -1000, "DEST_OLD": 1000},
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"fee": 1000}}]},
    {"label": "sweep-migrate-collect-sharing", "family": "C",
     "pool_mut": None, "sharing_admin": FIX_CC_KEY,
     "collect_seed": [(SH_ATA, SH_VAULT, 1000)],
     "steps": [("sweep", {"recipient": CREATOR_VAULT, "recipient_ata": CREATOR_ATA}),
               ("mig", {}),
               ("collect", {"creator": SHARING_PDA, "vault_auth": SH_VAULT,
                            "vault_ata": SH_ATA, "dest": DEST_SH})],
     "expect": [{"name": "sweep", "error": None, "events": 1, "payer": 5000,
                 "deltas": {"vaultquote": -123394, "CREATOR_ATA": 123394},
                 "pool_cc": FIX_CC.hex(), "pool_fees": [2488, 0],
                 "event": {"amount": 123394, "bucket": 1}},
                {"name": "mig", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": bytes(SHARING_PDA).hex(), "pool_fees": [2488, 0],
                 "event": {"old": FIX_CC.hex(),
                           "new": bytes(SHARING_PDA).hex()}},
                {"name": "collect", "error": "6048", "events": 0, "payer": 5000,
                 "rollback": True,
                 "site_fragment": "CreatorVaultMigratedToSharingConfig",
                 "pool_cc": bytes(SHARING_PDA).hex(), "pool_fees": [2488, 0]}]},
    {"label": "set-then-collect-new", "family": "C",
     "pool_mut": ZERO_CC,
     "collect_seed": [(NEW_ATA, NEW_VAULT, 1000)],
     "steps": [("set", {}),
               ("collect", {"creator": Pubkey.from_bytes(CREATOR0),
                            "vault_auth": NEW_VAULT, "vault_ata": NEW_ATA,
                            "dest": DEST_NEW})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "collect", "error": None, "events": 1, "payer": 5000,
                 "deltas": {"NEW_ATA": -1000, "DEST_NEW": 1000},
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"fee": 1000}}]},
    {"label": "v2buy-before-set", "family": "D",
     "pool_mut": ZERO_CC,
     "steps": [("v2buy", {"amount": 10**6, "limit": 10**12})],
     "expect": [{"name": "v2buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -186, "vaultquote": 185, "buyback": 1},
                 "pool_cc": bytes(32).hex(), "pool_fees": [2489, 123394],
                 "event": {"quote": 183, "lp_fee": 1, "proto_fee": 2,
                           "qwlp": 184, "uqin": 186, "creator_bps": 30,
                           "creator_fee": 0, "buyback_fee": 1}}]},
    {"label": "v2buy-after-set", "family": "D",
     "pool_mut": ZERO_CC,
     "steps": [("set", {}),
               ("v2buy", {"amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "v2buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -1847796, "vaultquote": 1839310,
                            "buyback": 8486},
                 "pool_cc": CREATOR0.hex(), "pool_fees": [10975, 128869],
                 "event": {"quote": 1824983, "lp_fee": 365, "proto_fee": 16973,
                           "qwlp": 1825348, "uqin": 1847796, "creator_bps": 30,
                           "creator_fee": 5475, "buyback_fee": 8486}}]},
    {"label": "set-v2buy-sweep-migrate", "family": "D",
     "pool_mut": ZERO_CC, "sharing_admin": CREATOR0,
     "steps": [("set", {}),
               ("v2buy", {"amount": 10**10, "limit": 10**12}),
               ("sweep", {"recipient": NEW_VAULT, "recipient_ata": NEW_ATA}),
               ("mig", {})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "v2buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -1847796, "vaultquote": 1839310,
                            "buyback": 8486},
                 "pool_cc": CREATOR0.hex(), "pool_fees": [10975, 128869],
                 "event": {"quote": 1824983, "lp_fee": 365, "proto_fee": 16973,
                           "qwlp": 1825348, "uqin": 1847796, "creator_bps": 30,
                           "creator_fee": 5475, "buyback_fee": 8486}},
                {"name": "sweep", "error": None, "events": 1, "payer": 5000,
                 "deltas": {"vaultquote": -128869, "NEW_ATA": 128869},
                 "pool_cc": CREATOR0.hex(), "pool_fees": [10975, 0],
                 "event": {"amount": 128869, "bucket": 1}},
                {"name": "mig", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": bytes(SHARING_PDA).hex(), "pool_fees": [10975, 0],
                 "event": {"old": CREATOR0.hex(),
                           "new": bytes(SHARING_PDA).hex()}}]},
    {"label": "set-then-sell", "family": "S",
     "pool_mut": ZERO_CC,
     "steps": [("set", {}),
               ("sell", {"vault_ata": NEW_ATA, "vault_pda": NEW_VAULT,
                         "remaining": rem_std(), "amount": 10**9, "limit": 1})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "sell", "error": None, "events": 1, "payer": 5000,
                 "deltas": {"userquote": 180212, "vaultbase": 10**9,
                            "vaultquote": -182458, "PROTOCOL_ATA": 849,
                            "NEW_ATA": 548, "buyback": 849},
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"proto_fee": 1698}}]},
    {"label": "set-then-sell-old-vault", "family": "S",
     "pool_mut": ZERO_CC,
     "steps": [("set", {}),
               ("sell", {"vault_ata": DEF_ATA, "vault_pda": DEF_VAULT,
                         "remaining": rem_std(), "amount": 10**9, "limit": 1})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394],
                 "event": {"coin_creator": CREATOR0.hex()}},
                {"name": "sell", "error": "2006", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "coin_creator_vault_authority",
                 "pool_cc": CREATOR0.hex(), "pool_fees": [2488, 123394]}]},
]

KEYNAME = {str(pool): "pool", str(userquote): "userquote", str(userbase): "userbase",
           str(vaultbase): "vaultbase", str(vaultquote): "vaultquote",
           str(PROTOCOL_ATA): "PROTOCOL_ATA", str(CREATOR_ATA): "CREATOR_ATA",
           str(NEW_ATA): "NEW_ATA", str(SH_ATA): "SH_ATA", str(DEF_ATA): "DEF_ATA",
           str(volume): "volume", str(buyback): "buyback", str(PAYER_KEY): "payer",
           str(DEST_OLD): "DEST_OLD", str(DEST_NEW): "DEST_NEW", str(DEST_SH): "DEST_SH"}


def decode_event(kind, rec):
    raw = ev_data(rec["logs"])
    if raw is None:
        return None
    if kind in ("buy", "v2buy"):
        return {"curve": u64(raw, 64), "lp_fee": u64(raw, 80),
                "proto_fee": u64(raw, 96), "qwlp": u64(raw, 104),
                "uqin": u64(raw, 112), "creator_bps": u64(raw, 344),
                "creator_fee": u64(raw, 352),
                "buyback_fee": u64(raw, 432) if kind == "buy" else u64(raw, 435),
                "quote": u64(raw, 64)}
    if kind == "sell":
        return {"proto_fee": u64(raw, 96)}
    if kind == "set":
        return {"coin_creator": raw[112:144].hex()}
    if kind == "mig":
        return {"old": raw[112:144].hex(), "new": raw[144:176].hex()}
    if kind == "sweep":
        return {"amount": u64(raw, 176), "bucket": raw[184]}
    if kind == "collect":
        return {"fee": u64(raw, 48)}
    return None


def run_case(case, image_name, binary):
    h = setup_vm(binary, pool_mut=case.get("pool_mut"),
                 sharing_admin=case.get("sharing_admin"),
                 pre_new=case.get("pre_new", True),
                 pre_sh=case.get("pre_sh", True),
                 pre_def=case.get("pre_def", True),
                 collect_seed=case.get("collect_seed"))
    out = []
    for (kind, params), exp in zip(case["steps"], case["expect"]):
        if kind == "set":
            rec = do_set(h)
        elif kind == "set2":
            h.vm.set_account(META_PDA, Account(10**9, metadata_bytes([CREATOR1]), META_PROG))
            rec = do_set(h)
        elif kind == "mig":
            rec = do_mig(h)
        elif kind == "buy":
            rec = do_buy(h, params["vault_ata"], params["vault_pda"],
                         params["remaining"], params["amount"], params["limit"])
        elif kind == "sell":
            rec = do_sell(h, params["vault_ata"], params["vault_pda"],
                          params["remaining"], params["amount"], params["limit"])
        elif kind == "v2buy":
            rec = do_v2buy(h, params["amount"], params["limit"])
        elif kind == "sweep":
            rec = do_sweep(h, params["recipient"], params["recipient_ata"])
        elif kind == "collect":
            rec = do_collect(h, params["creator"], params["vault_auth"],
                             params["vault_ata"], params["dest"])
        else:
            raise ValueError(kind)
        tag = f"{case['label']}/{image_name}/{kind}"
        if exp["error"] is None:
            check(rec["error"] is None, f"{tag}: unexpected error {rec['error']}")
        else:
            check(rec["error"] is not None and exp["error"] in rec["error"],
                  f"{tag}: expected error {exp['error']}, got {rec['error']}")
        check(len(rec["events"]) == exp["events"],
              f"{tag}: events {len(rec['events'])} != {exp['events']}")
        payer_d = lam_delta(rec["before"][str(PAYER_KEY)], rec["after"][str(PAYER_KEY)])
        check(payer_d == -exp["payer"], f"{tag}: payer {payer_d} != {-exp['payer']}")
        check(pool_cc(rec["after"][str(pool)]) == exp["pool_cc"],
              f"{tag}: pool_cc {pool_cc(rec['after'][str(pool)])} != {exp['pool_cc']}")
        check(pool_fees(rec["after"][str(pool)]) == exp["pool_fees"],
              f"{tag}: pool_fees {pool_fees(rec['after'][str(pool)])} != {exp['pool_fees']}")
        if exp.get("rollback"):
            for k in WATCH:
                if str(k) == str(PAYER_KEY):
                    continue
                check(rec["before"][str(k)] == rec["after"][str(k)],
                      f"{tag}: rollback violated for {k}")
        for keyname, want in exp.get("deltas", {}).items():
            key = next(k for k in WATCH if KEYNAME[str(k)] == keyname)
            got = tok_delta(rec["before"][str(key)], rec["after"][str(key)])
            check(got == want, f"{tag}: delta {keyname} {got} != {want}")
        if exp.get("event") is not None:
            got = decode_event(kind, rec)
            check(got is not None, f"{tag}: event decode failed")
            for fkey, want in exp["event"].items():
                check(got.get(fkey) == want, f"{tag}: event {fkey} {got.get(fkey)} != {want}")
        if exp.get("site_fragment"):
            blob = "\n".join(rec["logs"])
            check(exp["site_fragment"] in blob,
                  f"{tag}: site fragment {exp['site_fragment']} not in logs")
        if exp.get("log_fragment"):
            blob = "\n".join(rec["logs"])
            check(exp["log_fragment"] in blob,
                  f"{tag}: log fragment {exp['log_fragment']} not in logs")
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
        # cross-image agreement on the deterministic observed surface
        def surface(recs):
            out = []
            for rec in recs:
                out.append({"step": rec["step"], "error": rec["error"],
                            "events": len(rec["events"]),
                            "pool_cc": pool_cc(rec["after"][str(pool)]),
                            "pool_fees": pool_fees(rec["after"][str(pool)]),
                            "deltas": {KEYNAME[str(k)]: tok_delta(rec["before"][str(k)], rec["after"][str(k)]) for k in WATCH},
                            "payer": lam_delta(rec["before"][str(PAYER_KEY)], rec["after"][str(PAYER_KEY)])})
            return out
        base = surface(per_image["original"])
        for image_name in ("control", "candidate"):
            check(surface(per_image[image_name]) == base,
                  f"{case['label']}: {image_name} observed surface differs from original")
            for rec in per_image[image_name]:
                receipts.append(rec)
        report_cases.append({"label": case["label"], "family": case["family"],
                             "steps": case["expect"],
                             "error_sites": {image_name: [r["site"] for r in per_image[image_name]] for image_name in IMAGES}})
        print(f"OK {case['label']} ({len(case['steps'])} steps x 3 images)")
    # parts of 10 receipts
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
    (OUT / "runtime" / "report.json").write_text(json.dumps(report, indent=2))
    print(f"cases={len(CASES)} receipts={len(receipts)} parts={len(parts)}")
    for p in parts:
        print(f"  {p['file']} {p['count']} receipts {p['bytes']} bytes")
    print("NEXT: write verify.py and README.md, then regenerate MANIFEST.json")


if __name__ == "__main__":
    main()
