#!/usr/bin/env python3
"""Build research/amm-cashback-claim-chains-20261029 receipts.

3rd run packet #2: legacy buy / buy_exact / sell cashback accrual
chained into claim_cashback payouts.

2nd #2 pinned claim_cashback in isolation (full-balance payout, the
u64 claimed edge, earned ignored, stored user ignored, vault
ATA-bound, destination not ATA-bound) and 2nd #47 pinned legacy buy
cashback accrual in isolation (creator leg diverted to the
accumulator ATA, earned += gross creator fee), but no packet ever
chained them: does a claim after a buy pay exactly what the buy
accredited, does earned keep growing across claims while claimed
catches up, does a second buy accredit the same amount as the first
once the curve moved, does a transfer-fee buy leave a permanent gap
between earned and claimable, and does an overflowing claim stay
blocked forever? This packet answers that with multi-step chains,
one signed transaction per step, on three program images (original,
#424 control, #427 candidate).

Fixture (per case, fresh VM per image): the legacy buy/sell fixture
(pool with is_cashback_coin set, fee table lp 2 / protocol 93 /
creator 30 bps, buyback 5000 bps, clock 1234567890), user = PAYER,
user_volume_accumulator seeded or fresh per case, accumulator ATA
(uvata) present or fresh per case. Fee payer is PAYER for every
step, so payer deltas are exactly -5,000 except account-creation
steps (fresh UVA rent 1,844,400, fresh ATA rent 2,039,280).

Measured results (all three images agree on every step):
- fresh buy -> claim: buy 10^10 creates the UVA (all fields zero
  except earned 5,475) and the uvata (5,475 tokens, 2,044,755
  lamports = rent + 5,475); payer -3,888,680. The claim then pays
  the full 5,475, claimed 0 -> 5,475, earned unchanged; uvata
  lamports return to exactly rent (2,039,280).
- seeded buy -> claim -> buy -> claim: first buy credits 5,475
  (earned 1,000 -> 6,475, uvata 1,000 -> 6,475, spend 1,847,796);
  claim pays 6,475 (claimed 6,475 = earned). The SECOND identical
  buy credits 5,476, not 5,475 (the first buy moved the curve),
  spends 1,847,852, and the second claim pays 5,476 (claimed
  11,951 = earned again). A third claim pays 0 but still emits
  exactly one ClaimCashbackEvent (amount 0) -- unlike
  claim_token_incentives, whose zero claim emits nothing.
- buy_exact -> claim: buy_exact 10^7 credits 29,630 (earned
  1,000 -> 30,630, uvata 1,000 -> 30,630, spend exactly 10,000,000);
  claim pays 30,630.
- sell -> claim: sell 10^9 credits 548 (earned 0 -> 548, user
  +180,212); claim pays 548. Sell -> buy -> claim: the buy after
  the sell credits 5,475 again (earned 548 -> 6,023) but spends
  1,847,790, 6 less than a fresh buy -- the sell moved the curve
  the other way.
- creator-0 buy -> claim: with a creator-0 fee table and trimmed
  remaining, buy 10^10 spends 1,842,321, credits nothing (earned
  and uvata unchanged at 2,000); the claim then pays only the
  pre-seeded 2,000. The claim is independent of the buy's creator
  fee: it pays the ATA balance, whatever its source.
- claim overflow is sticky: with claimed = u64max - 100, a buy
  credits 5,475 (uvata 1,000 -> 6,475) and the claim then fails
  6023 Overflow with full rollback (uvata stays 6,475, claimed
  stays u64max - 100); a second identical claim fails 6023 again.
  The 6,475 tokens are claimable in principle but permanently
  blocked while claimed sits at the edge.
- transfer-fee buy -> claim: tf100 buy credits earned += 5,475
  (gross) but uvata22 nets 5,420 with 55 withheld (lamports
  2,157,600 -> 2,163,075 = base + gross). The claim pays 5,420
  (claimed 5,420, earned 5,475 -- a permanent gap of 55), and the
  claim transfer itself withholds another 55, so the user nets
  only 5,365 while the event reports amount 5,420. After a second
  tf buy -> claim round, earned 10,951, claimed 10,841 (gap 110),
  uvata22 withheld 110, userquote withheld 110, second claim
  user net 5,366 vs event 5,421. Withheld tokens are never
  claimable: earned permanently overstates claimable by the
  cumulative withheld.

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

from pump_amm_legacy_buy_differential import (
    f, pool, base, quote, userbase, userquote, vaultbase, vaultquote,
    PROTOCOL_ATA, CREATOR_ATA, buyback, volume, uvata, GLOBAL_VOLUME,
    GDISC, feeconfig, FEES, TOKEN, TOKEN22, ATA, token, PAYER, PROGRAM,
    EVENT, CONFIG_KEY, IDL, RAW, CONFIG, PROTOCOL, CREATOR_VAULT,
)
from pump_amm_trade_v2_differential import custom_fee_table
from pump_amm_liquidity_differential import transferfee
from pump_amm_reusable_harness import acquire_harness

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-cashback-claim-chains-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}

PAYER_KEY = PAYER.pubkey()
POOLV2 = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)[0]
BBOWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
PROTO22 = Pubkey.find_program_address([bytes(PROTOCOL), bytes(TOKEN22), bytes(quote)], ATA)[0]
CREATOR22 = Pubkey.find_program_address([bytes(CREATOR_VAULT), bytes(TOKEN22), bytes(quote)], ATA)[0]
BB22 = Pubkey.find_program_address([bytes(BBOWNER), bytes(TOKEN22), bytes(quote)], ATA)[0]
UVATA22 = Pubkey.find_program_address([bytes(volume), bytes(TOKEN22), bytes(quote)], ATA)[0]
CLAIM_EVT_DISC = hashlib.sha256(b"event:ClaimCashbackEvent").digest()[:8]
U64MAX = 2**64 - 1

BUY_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, PROTOCOL, PROTOCOL_ATA, TOKEN, TOKEN,
            Pubkey.default(), ATA, EVENT, PROGRAM, CREATOR_ATA, CREATOR_VAULT,
            GLOBAL_VOLUME, volume, feeconfig, FEES]
BUY_KEYS_TF = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
               vaultbase, vaultquote, PROTOCOL, PROTO22, TOKEN, TOKEN22,
               Pubkey.default(), ATA, EVENT, PROGRAM, CREATOR22, CREATOR_VAULT,
               GLOBAL_VOLUME, volume, feeconfig, FEES]
SELL_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
             vaultbase, vaultquote, PROTOCOL, PROTOCOL_ATA, TOKEN, TOKEN,
             Pubkey.default(), ATA, EVENT, PROGRAM, CREATOR_ATA, CREATOR_VAULT,
             feeconfig, FEES]
CB_KEYS = [PAYER_KEY, volume, quote, TOKEN, uvata, userquote, Pubkey.default(), EVENT, PROGRAM]
CB_KEYS_TF = [PAYER_KEY, volume, quote, TOKEN22, UVATA22, userquote, Pubkey.default(), EVENT, PROGRAM]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def uva_bytes(needs, unc, claimed, vol, last, hasc, cb, cbcl):
    disc = bytes(next(x for x in IDL['accounts'] if x['name'] == 'UserVolumeAccumulator')['discriminator'])
    return (disc + bytes(PAYER_KEY) + struct.pack(
        '<BQQQqBQQ', needs, unc, claimed, vol, last, hasc, cb, cbcl)).ljust(137, b'\0')


def uva_state(lamports, needs, unc, claimed, vol, last, hasc, cb, cbcl):
    return {"lamports": lamports, "needs": needs, "unc": unc, "claimed": claimed,
            "vol": vol, "last": last, "has": hasc, "cb": cb, "cbcl": cbcl}


SEEDED = lambda cb, cbcl=0: uva_state(10**9, 1, 0, 0, 0, 0, 0, cb, cbcl)
FRESH = lambda cb, cbcl=0: uva_state(1844400, 0, 0, 0, 0, 0, 0, cb, cbcl)


def setup_vm(binary, cfg):
    h = acquire_harness(binary)
    h.vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, filepath in [(TOKEN, 'evidence/dependencies/spl_token/deployed.so'),
                          (TOKEN22, 'evidence/dependencies/spl_token_2022/deployed.so'),
                          (FEES, 'evidence/original/pump_fees/deployed.so'),
                          (ATA, 'evidence/dependencies/associated_token/deployed.so')]:
        h.vm.add_program_from_file(pid, ROOT / filepath)
    for n, row in f['accounts'].items():
        h.vm.set_account(Pubkey.from_string(row['address']),
                         Account(row['lamports'], base64.b64decode(row['data_base64']),
                                 Pubkey.from_string(row['owner'])))
    glob = bytearray(RAW); glob[56] = 0
    h.vm.set_account(CONFIG_KEY, Account(CONFIG['lamports'], bytes(glob), PROGRAM))
    for k, m, owner, native in [(userbase, base, PAYER_KEY, False),
                                (userquote, quote, PAYER_KEY, True),
                                (PROTOCOL_ATA, quote, PROTOCOL, True),
                                (CREATOR_ATA, quote, CREATOR_VAULT, True)]:
        h.vm.set_account(k, Account(10**15 + 2039280 if native else 10**9,
                                    token(m, owner, 10**15 if k in (userbase, userquote) else 0, native), TOKEN))
    for k in [PROTOCOL, CREATOR_VAULT]:
        h.vm.set_account(k, Account(10**9, b'', Pubkey.default()))
    pa = h.vm.get_account(pool); pd = bytearray(pa.data); pd[244] = 1
    h.vm.set_account(pool, Account(pa.lamports, bytes(pd), pa.owner))
    if cfg.get("uva_present", True):
        h.vm.set_account(volume, Account(10**9, uva_bytes(
            1, 0, 0, 0, 0, 0, cfg.get("earned", 0), cfg.get("cbcl", 0)), PROGRAM))
    else:
        h.vm.set_account(volume, Account(0, b'', Pubkey.default()))
    h.vm.set_account(GLOBAL_VOLUME, Account(
        10**9, GDISC + struct.pack('<qqq', 0, 0, 86400) + bytes(base) + bytes(480), PROGRAM))
    if cfg.get("tf"):
        transferfee(quote, 100, U64MAX)(h, None)
        for old in [PROTOCOL_ATA, CREATOR_ATA, buyback]:
            a = h.vm.get_account(old); ow = Pubkey.from_bytes(a.data[32:64])
            new = Pubkey.find_program_address([bytes(ow), bytes(TOKEN22), bytes(quote)], ATA)[0]
            d = bytearray(a.data[:165]) + bytes([2]) + struct.pack('<HHQ', 2, 8, 0)
            h.vm.set_account(new, Account(a.lamports, bytes(d), TOKEN22))
        h.vm.set_account(UVATA22, Account(
            2157600, token(quote, volume, 0, True) + bytes([2]) + struct.pack('<HHQ', 2, 8, 0), TOKEN22))
    elif cfg.get("uvata_bal") is not None:
        h.vm.set_account(uvata, Account(
            2039280 + cfg["uvata_bal"], token(quote, volume, cfg["uvata_bal"], True), TOKEN))
    if cfg.get("fee_tiers") is not None:
        custom_fee_table(cfg["fee_tiers"])(h, None)
    for key in [POOLV2, BBOWNER]:
        h.vm.set_account(key, Account(10**9, b'', Pubkey.default()))
    watch = [PAYER_KEY, volume, UVATA22 if cfg.get("tf") else uvata, userquote,
             userbase, vaultbase, vaultquote,
             PROTO22 if cfg.get("tf") else PROTOCOL_ATA,
             BB22 if cfg.get("tf") else buyback, pool]
    return h, watch


def snap(vm, watch):
    out = {}
    for k in watch:
        a = vm.get_account(k)
        out[str(k)] = None if a is None else {
            "lamports": a.lamports, "owner": str(a.owner),
            "data_hex": bytes(a.data).hex()}
    return out


def parse_uva(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    if len(raw) < 90:
        return None
    v = struct.unpack_from('<BQQQqBQQ', raw, 40)
    return {"lamports": entry["lamports"], "needs": v[0], "unc": v[1],
            "claimed": v[2], "vol": v[3], "last": v[4], "has": v[5],
            "cb": v[6], "cbcl": v[7]}


def tok_amount(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from('<Q', raw, 64)[0] if len(raw) >= 72 else None


def withheld(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    if len(raw) == 182:
        return struct.unpack_from('<Q', raw, 174)[0]
    if len(raw) == 178:
        return struct.unpack_from('<Q', raw, 170)[0]
    return None


def ev_data(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    return base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())


def u64(raw, off):
    return struct.unpack_from('<Q', raw, off)[0]


def i64(raw, off):
    return struct.unpack_from('<q', raw, off)[0]


def send_tx(h, ix_name, base_keys, data, remaining=()):
    ix = next(x for x in IDL['instructions'] if x['name'] == ix_name)
    metas = [AccountMeta(k, bool(row.get('signer')), bool(row.get('writable')))
             for k, row in zip(base_keys, ix['accounts'])]
    metas += [AccountMeta(k, s, w) for (k, s, w) in remaining]
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, data, metas)], PAYER_KEY, [PAYER], h.vm.latest_blockhash())
    assert tx.verify_with_results() and all(tx.verify_with_results())
    return tx


def do_step(h, watch, kind, cfg):
    if kind == 'buy':
        data = bytes(next(x for x in IDL['instructions'] if x['name'] == 'buy')['discriminator']) \
            + struct.pack('<QQ', 10**10, 10**12) + b'\x00'
        keys = BUY_KEYS_TF if cfg.get("tf") else BUY_KEYS
        rem = [(UVATA22, False, True), (POOLV2, False, False), (BBOWNER, False, False), (BB22, False, True)] \
            if cfg.get("tf") else \
            [(uvata, False, True), (POOLV2, False, False), (BBOWNER, False, False), (buyback, False, True)]
        tx = send_tx(h, 'buy', keys, data, rem)
    elif kind == 'buy_small':
        data = bytes(next(x for x in IDL['instructions'] if x['name'] == 'buy')['discriminator']) \
            + struct.pack('<QQ', 10**6, 10**12) + b'\x00'
        rem = [(uvata, False, True), (POOLV2, False, False), (BBOWNER, False, False), (buyback, False, True)]
        tx = send_tx(h, 'buy', BUY_KEYS, data, rem)
    elif kind == 'buy_one':
        data = bytes(next(x for x in IDL['instructions'] if x['name'] == 'buy')['discriminator']) \
            + struct.pack('<QQ', 1, 10**12) + b'\x00'
        rem = [(uvata, False, True), (POOLV2, False, False), (BBOWNER, False, False), (buyback, False, True)]
        tx = send_tx(h, 'buy', BUY_KEYS, data, rem)
    elif kind == 'buyex':
        data = bytes(next(x for x in IDL['instructions'] if x['name'] == 'buy_exact_quote_in')['discriminator']) \
            + struct.pack('<QQ', 10**7, 1) + b'\x00'
        rem = [(uvata, False, True), (POOLV2, False, False), (BBOWNER, False, False), (buyback, False, True)]
        tx = send_tx(h, 'buy_exact_quote_in', BUY_KEYS, data, rem)
    elif kind == 'buy0':
        data = bytes(next(x for x in IDL['instructions'] if x['name'] == 'buy')['discriminator']) \
            + struct.pack('<QQ', 10**10, 10**12) + b'\x00'
        rem = [(BBOWNER, False, False), (buyback, False, True)]
        tx = send_tx(h, 'buy', BUY_KEYS, data, rem)
    elif kind == 'sell':
        data = bytes(next(x for x in IDL['instructions'] if x['name'] == 'sell')['discriminator']) \
            + struct.pack('<QQ', 10**9, 0)
        rem = [(uvata, False, True), (volume, False, True), (POOLV2, False, False),
               (BBOWNER, False, False), (buyback, False, True)]
        tx = send_tx(h, 'sell', SELL_KEYS, data, rem)
    elif kind == 'claim':
        data = bytes(next(x for x in IDL['instructions'] if x['name'] == 'claim_cashback')['discriminator'])
        keys = CB_KEYS_TF if cfg.get("tf") else CB_KEYS
        tx = send_tx(h, 'claim_cashback', keys, data)
    else:
        raise ValueError(kind)
    before = snap(h.vm, watch)
    r = h.vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    logs = meta.logs()
    return {"transaction_base64": base64.b64encode(bytes(tx)).decode(),
            "error": str(r.err()) if failed else None, "logs": logs,
            "events": [l for l in logs if l.startswith("Program data: ")],
            "before": before, "after": snap(h.vm, watch),
            "site": next((l for l in logs if "thrown in" in l or "caused by account" in l), None)}


def check(cond, msg):
    if not cond:
        raise AssertionError(msg)


def decode_event(kind, rec):
    raw = ev_data(rec["logs"])
    if raw is None:
        return None
    if kind in ('buy', 'buy_small', 'buy_one', 'buy0'):
        return {"disc": raw[:8].hex(), "len": len(raw),
                "cb": u64(raw, 416), "uqin": u64(raw, 112)}
    if kind == 'buyex':
        return {"disc": raw[:8].hex(), "len": len(raw),
                "cb": u64(raw, 431)}
    if kind == 'claim':
        return {"disc": raw[:8].hex(), "user": raw[8:40].hex(), "len": len(raw),
                "amount": u64(raw, 40), "ts": i64(raw, 48),
                "total_claimed": u64(raw, 56), "total_earned": u64(raw, 64)}
    return None


def tok_delta(rec, key):
    b = rec["before"][str(key)]; a = rec["after"][str(key)]
    return (tok_amount(a) or 0) - (tok_amount(b) or 0)


def lam_delta(rec, key):
    b = rec["before"][str(key)]; a = rec["after"][str(key)]
    return (a["lamports"] if a else 0) - (b["lamports"] if b else 0)


# step expectation builder
def E(name, dPAYER, uva, uvata_bal, userquote_delta, events=1, error=None,
      event=None, rollback=False, site_fragment=None, uvata_withheld=None,
      deltas=None, uvata_lamports=None, uq_withheld=None):
    d = {"name": name, "dPAYER": dPAYER, "uva": uva, "uvata_bal": uvata_bal,
         "userquote_delta": userquote_delta, "events": events, "error": error,
         "event": event, "rollback": rollback, "site_fragment": site_fragment,
         "uvata_withheld": uvata_withheld, "deltas": deltas or {},
         "uvata_lamports": uvata_lamports, "uq_withheld": uq_withheld}
    return d


def claim_ev(amount, cbcl, cb):
    return {"disc": CLAIM_EVT_DISC.hex(), "user": bytes(PAYER_KEY).hex(), "len": 72,
            "amount": amount, "ts": 1234567890, "total_claimed": cbcl, "total_earned": cb}


BUY_DELTA = {"userbase": 10**10, "vaultbase": -10**10, "vaultquote": 1825348,
             "proto": 8487, "buyback": 8486}
SELL_DELTA = {"userbase": -10**9, "vaultbase": 10**9, "vaultquote": -182458,
              "proto": 849, "buyback": 849}
BUYEX_DELTA = {"userbase": 54115018303, "vaultbase": -54115018303, "vaultquote": 9878518,
               "proto": 45926, "buyback": 45926}
TFBUY_DELTA = {"userbase": 10**10, "vaultbase": -10**10, "vaultquote": 1825348,
               "proto": 8402, "buyback": 8401}

CASES = [
    {"label": "f-fresh-buy-claim", "cfg": {"uva_present": False, "uvata_bal": None},
     "steps": ["buy", "claim"],
     "expect": [
         E("buy", -3888680, FRESH(5475), 5475, -1847796,
           event={"len": 497, "cb": 5475, "uqin": 1847796}, deltas=BUY_DELTA,
           uvata_lamports=2044755),
         E("claim", -5000, FRESH(5475, 5475), 0, 5475,
           event=claim_ev(5475, 5475, 5475), uvata_lamports=2039280),
     ]},
    {"label": "f-fresh-buy-claim-zero", "cfg": {"uva_present": False, "uvata_bal": None},
     "steps": ["buy", "claim", "claim"],
     "expect": [
         E("buy", -3888680, FRESH(5475), 5475, -1847796,
           event={"len": 497, "cb": 5475, "uqin": 1847796}, deltas=BUY_DELTA,
           uvata_lamports=2044755),
         E("claim", -5000, FRESH(5475, 5475), 0, 5475,
           event=claim_ev(5475, 5475, 5475), uvata_lamports=2039280),
         E("claim", -5000, FRESH(5475, 5475), 0, 0,
           event=claim_ev(0, 5475, 5475), uvata_lamports=2039280),
     ]},
    {"label": "b-seeded-buy-claim", "cfg": {"earned": 1000, "uvata_bal": 1000},
     "steps": ["buy", "claim"],
     "expect": [
         E("buy", -5000, SEEDED(6475), 6475, -1847796,
           event={"len": 497, "cb": 5475, "uqin": 1847796}, deltas=BUY_DELTA,
           uvata_lamports=2045755),
         E("claim", -5000, SEEDED(6475, 6475), 0, 6475,
           event=claim_ev(6475, 6475, 6475), uvata_lamports=2039280),
     ]},
    {"label": "b-buy-claim-buy-claim", "cfg": {"earned": 1000, "uvata_bal": 1000},
     "steps": ["buy", "claim", "buy", "claim"],
     "expect": [
         E("buy", -5000, SEEDED(6475), 6475, -1847796,
           event={"len": 497, "cb": 5475, "uqin": 1847796}, deltas=BUY_DELTA,
           uvata_lamports=2045755),
         E("claim", -5000, SEEDED(6475, 6475), 0, 6475,
           event=claim_ev(6475, 6475, 6475), uvata_lamports=2039280),
         E("buy", -5000, SEEDED(11951, 6475), 5476, -1847852,
           event={"len": 497, "cb": 5476, "uqin": 1847852},
           uvata_lamports=2044756),
         E("claim", -5000, SEEDED(11951, 11951), 0, 5476,
           event=claim_ev(5476, 11951, 11951), uvata_lamports=2039280),
     ]},
    {"label": "b-buy-claim-buy-claim-zero", "cfg": {"earned": 1000, "uvata_bal": 1000},
     "steps": ["buy", "claim", "buy", "claim", "claim"],
     "expect": [
         E("buy", -5000, SEEDED(6475), 6475, -1847796,
           event={"len": 497, "cb": 5475, "uqin": 1847796}, deltas=BUY_DELTA,
           uvata_lamports=2045755),
         E("claim", -5000, SEEDED(6475, 6475), 0, 6475,
           event=claim_ev(6475, 6475, 6475), uvata_lamports=2039280),
         E("buy", -5000, SEEDED(11951, 6475), 5476, -1847852,
           event={"len": 497, "cb": 5476, "uqin": 1847852},
           uvata_lamports=2044756),
         E("claim", -5000, SEEDED(11951, 11951), 0, 5476,
           event=claim_ev(5476, 11951, 11951), uvata_lamports=2039280),
         E("claim", -5000, SEEDED(11951, 11951), 0, 0,
           event=claim_ev(0, 11951, 11951), uvata_lamports=2039280),
     ]},
    {"label": "b-present-uva-fresh-uvata-buy-claim", "cfg": {"uvata_bal": None},
     "steps": ["buy", "claim"],
     "expect": [
         E("buy", -2044280, SEEDED(5475), 5475, -1847796,
           event={"len": 497, "cb": 5475, "uqin": 1847796}, deltas=BUY_DELTA,
           uvata_lamports=2044755),
         E("claim", -5000, SEEDED(5475, 5475), 0, 5475,
           event=claim_ev(5475, 5475, 5475), uvata_lamports=2039280),
     ]},
    {"label": "b-small-buy-claim", "cfg": {"uvata_bal": 0},
     "steps": ["buy_small", "claim"],
     "expect": [
         E("buy_small", -5000, SEEDED(1), 1, -187,
           event={"len": 497, "cb": 1, "uqin": 187},
           deltas={"userbase": 10**6, "vaultbase": -10**6, "vaultquote": 184,
                   "proto": 1, "buyback": 1},
           uvata_lamports=2039281),
         E("claim", -5000, SEEDED(1, 1), 0, 1,
           event=claim_ev(1, 1, 1), uvata_lamports=2039280),
     ]},
    {"label": "b-buy-one-claim", "cfg": {"uvata_bal": 0},
     "steps": ["buy_one", "claim"],
     "expect": [
         E("buy_one", -5000, SEEDED(1), 1, -4,
           event={"len": 497, "cb": 1, "uqin": 4},
           deltas={"userbase": 1, "vaultbase": -1, "vaultquote": 2,
                   "proto": 1, "buyback": 0},
           uvata_lamports=2039281),
         E("claim", -5000, SEEDED(1, 1), 0, 1,
           event=claim_ev(1, 1, 1), uvata_lamports=2039280),
     ]},
    {"label": "e-buyexact-claim", "cfg": {"earned": 1000, "uvata_bal": 1000},
     "steps": ["buyex", "claim"],
     "expect": [
         E("buyex", -5000, SEEDED(30630), 30630, -10000000,
           event={"len": 512, "cb": 29630}, deltas=BUYEX_DELTA,
           uvata_lamports=2069910),
         E("claim", -5000, SEEDED(30630, 30630), 0, 30630,
           event=claim_ev(30630, 30630, 30630), uvata_lamports=2039280),
     ]},
    {"label": "s-sell-claim", "cfg": {"uvata_bal": 0},
     "steps": ["sell", "claim"],
     "expect": [
         E("sell", -5000, SEEDED(548), 548, 180212, deltas=SELL_DELTA,
           uvata_lamports=2039828),
         E("claim", -5000, SEEDED(548, 548), 0, 548,
           event=claim_ev(548, 548, 548), uvata_lamports=2039280),
     ]},
    {"label": "s-sell-buy-claim", "cfg": {"uvata_bal": 0},
     "steps": ["sell", "buy", "claim"],
     "expect": [
         E("sell", -5000, SEEDED(548), 548, 180212, deltas=SELL_DELTA,
           uvata_lamports=2039828),
         E("buy", -5000, SEEDED(6023), 6023, -1847790,
           event={"len": 497, "cb": 5475, "uqin": 1847790},
           uvata_lamports=2045303),
         E("claim", -5000, SEEDED(6023, 6023), 0, 6023,
           event=claim_ev(6023, 6023, 6023), uvata_lamports=2039280),
     ]},
    {"label": "c-creator0-buy-claim",
     "cfg": {"earned": 2000, "uvata_bal": 2000, "fee_tiers": [(0, (2, 93, 0))]},
     "steps": ["buy0", "claim"],
     "expect": [
         E("buy0", -5000, SEEDED(2000), 2000, -1842321,
           event={"len": 497, "cb": 0, "uqin": 1842321},
           deltas={"userbase": 10**10, "vaultbase": -10**10, "vaultquote": 1825348,
                   "proto": 8487, "buyback": 8486},
           uvata_lamports=2041280),
         E("claim", -5000, SEEDED(2000, 2000), 0, 2000,
           event=claim_ev(2000, 2000, 2000), uvata_lamports=2039280),
     ]},
    {"label": "o-buy-claim-overflow",
     "cfg": {"cbcl": U64MAX - 100, "uvata_bal": 1000},
     "steps": ["buy", "claim", "claim"],
     "expect": [
         E("buy", -5000, SEEDED(5475, U64MAX - 100), 6475, -1847796,
           event={"len": 497, "cb": 5475, "uqin": 1847796}, deltas=BUY_DELTA,
           uvata_lamports=2045755),
         E("claim", -5000, SEEDED(5475, U64MAX - 100), 6475, 0, events=0,
           error="6023", rollback=True, site_fragment="Overflow",
           uvata_lamports=2045755),
         E("claim", -5000, SEEDED(5475, U64MAX - 100), 6475, 0, events=0,
           error="6023", rollback=True, site_fragment="Overflow",
           uvata_lamports=2045755),
     ]},
    {"label": "t-tf-buy-claim", "cfg": {"tf": True},
     "steps": ["buy", "claim"],
     "expect": [
         E("buy", -5000, SEEDED(5475), 5420, -1866234,
           event={"len": 497, "cb": 5475}, deltas=TFBUY_DELTA,
           uvata_withheld=55, uvata_lamports=2163075),
         E("claim", -5000, SEEDED(5475, 5420), 0, 5365,
           event=claim_ev(5420, 5420, 5475),
           uvata_withheld=55, uvata_lamports=2157655, uq_withheld=55),
     ]},
    {"label": "t-tf-buy-claim-buy-claim", "cfg": {"tf": True},
     "steps": ["buy", "claim", "buy", "claim"],
     "expect": [
         E("buy", -5000, SEEDED(5475), 5420, -1866234,
           event={"len": 497, "cb": 5475}, deltas=TFBUY_DELTA,
           uvata_withheld=55, uvata_lamports=2163075),
         E("claim", -5000, SEEDED(5475, 5420), 0, 5365,
           event=claim_ev(5420, 5420, 5475),
           uvata_withheld=55, uvata_lamports=2157655),
         E("buy", -5000, SEEDED(10951, 5420), 5421, -1866291,
           event={"len": 497, "cb": 5476},
           uvata_withheld=110, uvata_lamports=2163131),
         E("claim", -5000, SEEDED(10951, 10841), 0, 5366,
           event=claim_ev(5421, 10841, 10951),
           uvata_withheld=110, uvata_lamports=2157710, uq_withheld=110),
     ]},
]


def run_case(case, image_name, binary):
    cfg = case["cfg"]
    h, watch = setup_vm(binary, cfg)
    uvata_key = UVATA22 if cfg.get("tf") else uvata
    proto_key = PROTO22 if cfg.get("tf") else PROTOCOL_ATA
    buyback_key = BB22 if cfg.get("tf") else buyback
    out = []
    for kind, exp in zip(case["steps"], case["expect"]):
        rec = do_step(h, watch, kind, cfg)
        tag = f"{case['label']}/{image_name}/{kind}"
        if exp["error"] is None:
            check(rec["error"] is None, f"{tag}: unexpected error {rec['error']}")
        else:
            check(rec["error"] is not None and exp["error"] in rec["error"],
                  f"{tag}: expected error {exp['error']}, got {rec['error']}")
        check(len(rec["events"]) == exp["events"],
              f"{tag}: events {len(rec['events'])} != {exp['events']}")
        d_payer = lam_delta(rec, PAYER_KEY)
        check(d_payer == exp["dPAYER"], f"{tag}: dPAYER {d_payer} != {exp['dPAYER']}")
        got_uva = parse_uva(rec["after"][str(volume)])
        check(got_uva == exp["uva"], f"{tag}: uva {got_uva} != {exp['uva']}")
        got_bal = tok_amount(rec["after"][str(uvata_key)])
        check(got_bal == exp["uvata_bal"], f"{tag}: uvata {got_bal} != {exp['uvata_bal']}")
        if exp["uvata_withheld"] is not None:
            got_wh = withheld(rec["after"][str(uvata_key)])
            check(got_wh == exp["uvata_withheld"],
                  f"{tag}: withheld {got_wh} != {exp['uvata_withheld']}")
        if exp.get("uq_withheld") is not None:
            got_uqw = withheld(rec["after"][str(userquote)])
            check(got_uqw == exp["uq_withheld"],
                  f"{tag}: userquote withheld {got_uqw} != {exp['uq_withheld']}")
        if exp["uvata_lamports"] is not None:
            got_lamp = rec["after"][str(uvata_key)]["lamports"]
            check(got_lamp == exp["uvata_lamports"],
                  f"{tag}: uvata lamports {got_lamp} != {exp['uvata_lamports']}")
        d_uq = tok_delta(rec, userquote)
        check(d_uq == exp["userquote_delta"],
              f"{tag}: userquote delta {d_uq} != {exp['userquote_delta']}")
        for role, want in exp["deltas"].items():
            key = {"userbase": userbase, "vaultbase": vaultbase, "vaultquote": vaultquote,
                   "proto": proto_key, "buyback": buyback_key}[role]
            got_d = tok_delta(rec, key)
            check(got_d == want, f"{tag}: delta {role} {got_d} != {want}")
        if exp.get("rollback"):
            for k, b in rec["before"].items():
                if k == str(PAYER_KEY):
                    continue
                check(rec["after"][k] == b, f"{tag}: rollback violated for {k}")
        if exp.get("event") is not None:
            got = decode_event(kind, rec)
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
                    if d.get(str(PAYER_KEY)) is not None:
                        d[str(PAYER_KEY)] = dict(d[str(PAYER_KEY)])
                        d[str(PAYER_KEY)]["lamports"] = 0
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
        report_cases.append({"label": case["label"], "tf": bool(case["cfg"].get("tf")),
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
