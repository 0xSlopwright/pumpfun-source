#!/usr/bin/env python3
"""Build research/amm-legacy-buy-cashback-20261029 receipts.

2nd run packet #47: legacy buy (buy + buy_exact_quote_in) on a
cashback pool. 2nd #44 pinned the legacy SELL cashback conversion
and explicitly left legacy buy out ("a separate remaining layout
is needed"); this packet fills exactly that seat.

Source (instructions/swap/buy.rs, execute + distribute_cashback):
- the named coin-creator vault ATA is NOT the cashback leg: when
  creator_fee > 0 and pool.is_cashback_coin, the handler calls
  distribute_cashback(ctx.remaining_accounts, ...) and then reads
  the buyback accounts from remaining index 2. The cashback
  remaining layout is therefore [cashback ATA, pool-v2 PDA,
  buyback owner, buyback dest] (4 accounts), versus the standard
  non-cashback layout [pool-v2 PDA, buyback owner, buyback dest]
  (3 accounts, buyback read from index 1);
- distribute_cashback writes remaining[0] as the user_volume
  accumulator's ATA (key mismatch or read-only ->
  6061 InvalidCashbackAccumulatorAta), creates it via the ATA
  program when absent, transfers creator_fee into it with
  transfer_checked, then adds creator_fee (gross, before any
  transfer fee) to user_volume.cashback_earned (overflow ->
  6023), then calls validate_pool_v2(remaining, base_mint, 1);
- gate order pinned by this packet: disable_flags buy (6020) >
  protocol-recipient validation (6013; mayhem pools check the
  RESERVED list, so a mayhem buy fails even before any cashback
  logic) > zero guards (6001/6002) > cashback conversion >
  buyback validation (6053/6058). On a cashback pool the
  conversion happens only when creator_fee > 0;
- the sharpest pin: when creator_fee == 0 the handler skips BOTH
  the cashback conversion AND validate_pool_v2, so `next` stays
  0 and the buyback accounts are read from remaining index 0.
  A standard 3-account remaining then fails 6053 (the pool-v2
  PDA is not an authorized buyback recipient) -- this is the
  mechanism behind the whitelist trap (#12/#17: the whitelist
  zeroes every fee, so creator_fee == 0 and the buyback window
  shifts left by one). Trimming the remaining to [owner, dest]
  restores success at the no-creator-fee spend, on cashback and
  non-cashback pools alike;
- remaining ladder: no remaining at all on a cashback pool ->
  6059 MissingCashbackAccounts; standard remaining, substituted
  cashback ATA, read-only cashback ATA, or cashback ATA deleted
  from the layout -> 6061; cashback ATA alone (pool-v2 missing)
  -> 6062 InvalidPoolV2; cashback ATA + pool-v2 only, or plus
  owner, -> 6058 BuybackFeeRecipientMissing; substituted
  pool-v2 -> 6062; substituted buyback owner/dest -> 6053;
  read-only pool-v2 succeeds (key-only check); read-only
  buyback dest -> runtime PrivilegeEscalation (not an Anchor
  error);
- transfer-fee overlay (quote mint, via adapt_sell_helper):
  cashback_earned always grows by the GROSS creator fee, the
  event reports gross creator/cashback/protocol figures, but
  the event's buyback_fee field is NET of transfer fee, and
  every leg's destination receives net (vault leg grossed up,
  cap binds on the pool leg only: tf100-max100 spends exactly
  nofee + 100). tf10000 buy fails 6023 in transfer_fee.rs
  (like #17's non-cashback buy, unlike buy_exact's 6039);
- buy_exact cashback mirrors buy_exact nofee (#12): the event
  reports the GROSS amount in quote_amount_in (@64) and the NET
  curve in user_quote_amount_in (@112); exact-in spends only
  the computed gross total (tf100: 9,998,786 of 10,000,000);
- track_volume does not move current_sol_volume in legacy buy:
  with a pre-existing accumulator (sol 1000) and track=1, sol
  stays 1000 while cashback_earned still += creator_fee.
"""
import base64
import gzip
import hashlib
import json
import shutil
import struct
import sys
from pathlib import Path

import os
sys.path.insert(0, str(Path.home() / "workspace/pumpfun-sparse/scripts"))
os.chdir(Path.home() / "workspace/pumpfun-sparse")
from solders.account import Account
from solders.instruction import AccountMeta
from solders.pubkey import Pubkey
from solders.transaction import Transaction

from pump_amm_legacy_buy_differential import (
    legacy_buy, cashback_buy, existing_volume, adapt_sell_helper,
)
from pump_amm_legacy_sell_differential import (
    mutate, combine, meta_mutation, legacy_transferfee, custom_fee_table,
    userbase, userquote, vaultbase, vaultquote, PROTOCOL_ATA, CREATOR_ATA,
    buyback, volume, uvata, pool, PAYER, TOKEN, TOKEN22, ATA, token, quote,
    PROTOCOL, CREATOR_VAULT, f as SELL_F,
)
from pump_amm_liquidity_differential import CONFIG_KEY

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-legacy-buy-cashback-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
BBOWNER = Pubkey.from_bytes(base64.b64decode(SELL_F["accounts"]["buyback_fee_recipient"]["data_base64"])[32:64])


def pda22(owner_key):
    return Pubkey.find_program_address([bytes(owner_key), bytes(TOKEN22), bytes(quote)], ATA)[0]


PROTO22 = pda22(PROTOCOL)
CREATOR22 = pda22(CREATOR_VAULT)
BB22 = pda22(BBOWNER)
UVATA22 = pda22(volume)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def amount_at(data_hex, offset=64):
    if data_hex is None:
        return None
    raw = bytes.fromhex(data_hex)
    if len(raw) < offset + 8:
        return None
    return struct.unpack_from("<Q", raw, offset)[0]


def withheld_at(data_hex):
    if data_hex is None:
        return None
    raw = bytes.fromhex(data_hex)
    if len(raw) == 178:
        return struct.unpack_from("<Q", raw, 170)[0]
    if len(raw) == 182:
        return struct.unpack_from("<Q", raw, 174)[0]
    return None


def vol_field(data_hex, offset):
    if data_hex is None:
        return None
    raw = bytes.fromhex(data_hex)
    if len(raw) < offset + 8:
        return None
    return struct.unpack_from("<Q", raw, offset)[0]


def decode_buy_event(logs, exact):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    if len(raw) != (512 if exact else 497):
        return None
    ev = {"out": struct.unpack_from("<Q", raw, 16)[0],
          "max": struct.unpack_from("<Q", raw, 24)[0],
          "curve": struct.unpack_from("<Q", raw, 64)[0],
          "lp_bps": struct.unpack_from("<Q", raw, 72)[0],
          "lp": struct.unpack_from("<Q", raw, 80)[0],
          "proto_bps": struct.unpack_from("<Q", raw, 88)[0],
          "proto": struct.unpack_from("<Q", raw, 96)[0],
          "qwlp": struct.unpack_from("<Q", raw, 104)[0],
          "uqin": struct.unpack_from("<Q", raw, 112)[0],
          "creator_bps": struct.unpack_from("<Q", raw, 344)[0],
          "creator": struct.unpack_from("<Q", raw, 352)[0],
          "track": raw[360],
          "min_base": struct.unpack_from("<Q", raw, 393)[0]}
    if exact:
        ev.update({"cb_bps": struct.unpack_from("<Q", raw, 423)[0],
                   "cb": struct.unpack_from("<Q", raw, 431)[0],
                   "bb_bps": struct.unpack_from("<Q", raw, 439)[0],
                   "bb": struct.unpack_from("<Q", raw, 447)[0]})
    else:
        ev.update({"cb_bps": struct.unpack_from("<Q", raw, 408)[0],
                   "cb": struct.unpack_from("<Q", raw, 416)[0],
                   "bb_bps": struct.unpack_from("<Q", raw, 424)[0],
                   "bb": struct.unpack_from("<Q", raw, 432)[0]})
    return ev


def site_line(logs):
    return next((l for l in logs if "thrown in" in l or "caused by account" in l), None)


# ---------------- override helpers ----------------
def cb_std(h, m):
    mutate(pool, 244, b"\x01")(h, m)


def cb_noremain(h, m):
    mutate(pool, 244, b"\x01")(h, m)


def cb_trunc(n):
    def ov(h, m):
        cashback_buy(False)(h, m)
        del m[23 + n:]
    return ov


def cb_del_uvata(h, m):
    cashback_buy(False)(h, m)
    del m[23]


def creator0_trim(h, m):
    custom_fee_table([(0, (2, 93, 0))])(h, m)
    del m[23]


def creator0_trim_cb(h, m):
    custom_fee_table([(0, (2, 93, 0))])(h, m)
    mutate(pool, 244, b"\x01")(h, m)
    del m[23]


def cash_tf(bps, maximum, present=False):
    def ov(h, m):
        adapt_sell_helper(legacy_transferfee(quote, bps, maximum))(h, m)
        cashback_buy(False)(h, m)
        m[23] = AccountMeta(UVATA22, False, True)
        if present:
            h.vm.set_account(UVATA22, Account(
                2157600, token(quote, volume, 0, True) + bytes([2]) + struct.pack("<HHQ", 2, 8, 0),
                TOKEN22))
    return ov


def track1_existing(h, m):
    existing_volume(offset=57, value=struct.pack("<Q", 1000))(h, m)
    cashback_buy(True)(h, m)


def earned_accum(h, m):
    existing_volume(offset=74, value=struct.pack("<Q", 1000))(h, m)
    cashback_buy(True)(h, m)
    h.vm.set_account(uvata, Account(2039280, token(quote, volume, 1000, True), TOKEN))


def earned_overflow(h, m):
    existing_volume(offset=74, value=struct.pack("<Q", 2**64 - 1))(h, m)
    cashback_buy(True)(h, m)


def cb_mayhem(h, m):
    mutate(pool, 243, b"\x01")(h, m)
    cashback_buy(False)(h, m)


# ---------------- case table ----------------
# roles: token roles map to TOKEN keys, or (tf=True) to TOKEN22 keys.
def roles_for(tf):
    if tf:
        return {"fee_payer": PAYER.pubkey(), "pool": pool, "global_config": CONFIG_KEY,
                "userbase": userbase, "userquote": userquote,
                "vaultbase": vaultbase, "vaultquote": vaultquote,
                "protocol_ata": PROTO22, "creator_ata": CREATOR22,
                "buyback": BB22, "uvata": UVATA22, "volume": volume}
    return {"fee_payer": PAYER.pubkey(), "pool": pool, "global_config": CONFIG_KEY,
            "userbase": userbase, "userquote": userquote,
            "vaultbase": vaultbase, "vaultquote": vaultquote,
            "protocol_ata": PROTOCOL_ATA, "creator_ata": CREATOR_ATA,
            "buyback": buyback, "uvata": uvata, "volume": volume}


BUY_EV = {"lp_bps": 2, "proto_bps": 93, "bb_bps": 5000, "track": 0}
BUY_ANCHOR_EV = dict(BUY_EV, curve=1824983, lp=365, proto=16973, qwlp=1825348,
                     uqin=1847796, creator_bps=30, creator=5475,
                     cb_bps=0, cb=0, bb=8486)
BUY_CB_EV = dict(BUY_EV, curve=1824983, lp=365, proto=16973, qwlp=1825348,
                 uqin=1847796, creator_bps=0, creator=0,
                 cb_bps=30, cb=5475, bb=8486)
BUY_CB_EV_1M = dict(BUY_EV, curve=183, lp=1, proto=2, qwlp=184, uqin=187,
                    creator_bps=0, creator=0, cb_bps=30, cb=1, bb=1)
BUY_CB_EV_1 = dict(BUY_EV, curve=1, lp=1, proto=1, qwlp=2, uqin=4,
                   creator_bps=0, creator=0, cb_bps=30, cb=1, bb=0)
BUYEX_CB_EV = dict(BUY_EV, curve=10000000, lp=1976, proto=91852, qwlp=9878518,
                   uqin=9876542, creator_bps=0, creator=0,
                   cb_bps=30, cb=29630, bb=45926)
BUYEX_TF_EV = dict(BUY_EV, curve=10000000, lp=1956, proto=90934, qwlp=9779732,
                   uqin=9777776, creator_bps=0, creator=0,
                   cb_bps=30, cb=29334, bb=45012)
CREATOR0_EV = dict(BUY_EV, curve=1824983, lp=365, proto=16973, qwlp=1825348,
                   uqin=1842321, creator_bps=0, creator=0,
                   cb_bps=0, cb=0, bb=8486)


def ok(deltas, event, payer, earned_after, sol_after=0, uvata_lamports=None,
       withheld=None, out=None, max_=None, min_base=None):
    ev = dict(event)
    if "max_" in ev:  # call sites pass max_ inside dict(...)
        ev["max"] = ev.pop("max_")
    if out is not None:
        ev["out"] = out
    if max_ is not None:
        ev["max"] = max_
    if min_base is not None:
        ev["min_base"] = min_base
    return {"kind": "ok", "deltas": deltas, "event": ev, "payer": payer,
            "earned_after": earned_after, "sol_after": sol_after,
            "uvata_lamports": uvata_lamports, "withheld": withheld or {}}


def err(code, fragment, sites, payer=5000):
    return {"kind": "err", "code": code, "fragment": fragment, "sites": sites, "payer": payer}


def sites(orig, rebuilt, cand=None):
    return {"original": orig, "control": rebuilt,
            "candidate": rebuilt if cand is None else cand}


CASES = [
    # family A: success anchors
    ("A", "buy", "anchor-nocb-buy",
     dict(name="buy", amount=10**10, limit=10**12), False,
     ok({"userbase": 10**10, "userquote": -1847796, "vaultbase": -10**10,
         "vaultquote": 1825348, "protocol_ata": 8487, "creator_ata": 5475,
         "buyback": 8486},
        dict(BUY_ANCHOR_EV, out=10**10, max_=10**12, min_base=10**10),
        1849400, 0)),
    ("A", "buy", "cb-fresh-buy",
     dict(name="buy", amount=10**10, limit=10**12, overrides=cashback_buy(False)), False,
     ok({"userbase": 10**10, "userquote": -1847796, "vaultbase": -10**10,
         "vaultquote": 1825348, "protocol_ata": 8487, "creator_ata": 0,
         "buyback": 8486, "uvata": 5475},
        dict(BUY_CB_EV, out=10**10, max_=10**12, min_base=10**10),
        3888680, 5475, uvata_lamports=[None, 2044755])),
    ("A", "buy", "cb-present-buy",
     dict(name="buy", amount=10**10, limit=10**12, overrides=cashback_buy(True)), False,
     ok({"userbase": 10**10, "userquote": -1847796, "vaultbase": -10**10,
         "vaultquote": 1825348, "protocol_ata": 8487, "creator_ata": 0,
         "buyback": 8486, "uvata": 5475},
        dict(BUY_CB_EV, out=10**10, max_=10**12, min_base=10**10),
        1849400, 5475, uvata_lamports=[2039280, 2044755])),
    ("A", "buy", "cb-fresh-buy-1m",
     dict(name="buy", amount=10**6, limit=10**12, overrides=cashback_buy(False)), False,
     ok({"userbase": 10**6, "userquote": -187, "vaultbase": -10**6,
         "vaultquote": 184, "protocol_ata": 1, "creator_ata": 0,
         "buyback": 1, "uvata": 1},
        dict(BUY_CB_EV_1M, out=10**6, max_=10**12, min_base=10**6),
        3888680, 1, uvata_lamports=[None, 2039281])),
    ("A", "buy", "cb-fresh-buy-1",
     dict(name="buy", amount=1, limit=10**12, overrides=cashback_buy(False)), False,
     ok({"userbase": 1, "userquote": -4, "vaultbase": -1,
         "vaultquote": 2, "protocol_ata": 1, "creator_ata": 0,
         "buyback": 0, "uvata": 1},
        dict(BUY_CB_EV_1, out=1, max_=10**12, min_base=1),
        3888680, 1, uvata_lamports=[None, 2039281])),
    ("A", "buy_exact_quote_in", "cb-fresh-buyexact",
     dict(name="buy_exact_quote_in", amount=10**7, limit=1, overrides=cashback_buy(False)), False,
     ok({"userbase": 54115018303, "userquote": -10000000, "vaultbase": -54115018303,
         "vaultquote": 9878518, "protocol_ata": 45926, "creator_ata": 0,
         "buyback": 45926, "uvata": 29630},
        dict(BUYEX_CB_EV, out=54115018303, max_=10**7, min_base=1),
        3888680, 29630, uvata_lamports=[None, 2068910])),
    ("A", "buy", "cb-buy-limit-exact",
     dict(name="buy", amount=10**10, limit=1847796, overrides=cashback_buy(False)), False,
     ok({"userbase": 10**10, "userquote": -1847796, "vaultbase": -10**10,
         "vaultquote": 1825348, "protocol_ata": 8487, "creator_ata": 0,
         "buyback": 8486, "uvata": 5475},
        dict(BUY_CB_EV, out=10**10, max_=1847796, min_base=10**10),
        3888680, 5475, uvata_lamports=[None, 2044755])),
    ("A", "buy_exact_quote_in", "cb-buyexact-limit-exact",
     dict(name="buy_exact_quote_in", amount=10**7, limit=54115018303, overrides=cashback_buy(False)), False,
     ok({"userbase": 54115018303, "userquote": -10000000, "vaultbase": -54115018303,
         "vaultquote": 9878518, "protocol_ata": 45926, "creator_ata": 0,
         "buyback": 45926, "uvata": 29630},
        dict(BUYEX_CB_EV, out=54115018303, max_=10**7, min_base=54115018303),
        3888680, 29630, uvata_lamports=[None, 2068910])),
    ("A", "buy", "cb-track1-existing",
     dict(name="buy", amount=10**10, limit=10**12, track=b"\x01", overrides=track1_existing), False,
     ok({"userbase": 10**10, "userquote": -1847796, "vaultbase": -10**10,
         "vaultquote": 1825348, "protocol_ata": 8487, "creator_ata": 0,
         "buyback": 8486, "uvata": 5475},
        dict(BUY_CB_EV, out=10**10, max_=10**12, min_base=10**10, track=1),
        5000, 5475, sol_after=1000, uvata_lamports=[2039280, 2044755])),
    ("A", "buy", "cb-earned-accum",
     dict(name="buy", amount=10**10, limit=10**12, overrides=earned_accum), False,
     ok({"userbase": 10**10, "userquote": -1847796, "vaultbase": -10**10,
         "vaultquote": 1825348, "protocol_ata": 8487, "creator_ata": 0,
         "buyback": 8486, "uvata": 5475},
        dict(BUY_CB_EV, out=10**10, max_=10**12, min_base=10**10),
        5000, 6475, uvata_lamports=[2039280, 2044755])),
    # family B: remaining ladder (all buy 10^10)
    ("B", "buy", "cb-noremain",
     dict(name="buy", amount=10**10, limit=10**12, remaining=False, overrides=cb_noremain), False,
     err("6059", "MissingCashbackAccounts", sites("buy.rs:44", "buy.rs:499"))),
    ("B", "buy", "cb-std-remaining",
     dict(name="buy", amount=10**10, limit=10**12, overrides=cb_std), False,
     err("6061", "InvalidCashbackAccumulatorAta", sites("buy.rs:54", "buy.rs:503"))),
    ("B", "buy", "cb-sub-uvata",
     dict(name="buy", amount=10**10, limit=10**12,
          overrides=combine(cashback_buy(False), meta_mutation(23, "substitute"))), False,
     err("6061", "InvalidCashbackAccumulatorAta", sites("buy.rs:54", "buy.rs:503"))),
    ("B", "buy", "cb-readonly-uvata",
     dict(name="buy", amount=10**10, limit=10**12,
          overrides=combine(cashback_buy(False), meta_mutation(23, "readonly"))), False,
     err("6061", "InvalidCashbackAccumulatorAta", sites("buy.rs:57", "buy.rs:504"))),
    ("B", "buy", "cb-del-uvata",
     dict(name="buy", amount=10**10, limit=10**12, overrides=cb_del_uvata), False,
     err("6061", "InvalidCashbackAccumulatorAta", sites("buy.rs:54", "buy.rs:503"))),
    ("B", "buy", "cb-trunc-uvata-only",
     dict(name="buy", amount=10**10, limit=10**12, overrides=cb_trunc(1)), False,
     err("6062", "InvalidPoolV2", sites("sell.rs:520", "sell.rs:8"))),
    ("B", "buy", "cb-trunc-uvata-poolv2",
     dict(name="buy", amount=10**10, limit=10**12, overrides=cb_trunc(2)), False,
     err("6058", "BuybackFeeRecipientMissing", sites("buy.rs:116", "buy.rs:477"))),
    ("B", "buy", "cb-trunc-uvata-poolv2-owner",
     dict(name="buy", amount=10**10, limit=10**12, overrides=cb_trunc(3)), False,
     err("6058", "BuybackFeeRecipientMissing", sites("buy.rs:121", "buy.rs:479"))),
    ("B", "buy", "cb-sub-poolv2",
     dict(name="buy", amount=10**10, limit=10**12,
          overrides=combine(cashback_buy(False), meta_mutation(24, "substitute"))), False,
     err("6062", "InvalidPoolV2", sites("sell.rs:526", "sell.rs:10"))),
    ("B", "buy", "cb-sub-bbowner",
     dict(name="buy", amount=10**10, limit=10**12,
          overrides=combine(cashback_buy(False), meta_mutation(25, "substitute"))), False,
     err("6053", "BuybackFeeRecipientNotAuthorized", sites("global_config.rs:326", "global_config.rs:43"))),
    ("B", "buy", "cb-sub-bbdest",
     dict(name="buy", amount=10**10, limit=10**12,
          overrides=combine(cashback_buy(False), meta_mutation(26, "substitute"))), False,
     err("6053", "BuybackFeeRecipientNotAuthorized", sites("global_config.rs:336", "global_config.rs:47"))),
    ("B", "buy", "cb-readonly-poolv2",
     dict(name="buy", amount=10**10, limit=10**12,
          overrides=combine(cashback_buy(False), meta_mutation(24, "readonly"))), False,
     ok({"userbase": 10**10, "userquote": -1847796, "vaultbase": -10**10,
         "vaultquote": 1825348, "protocol_ata": 8487, "creator_ata": 0,
         "buyback": 8486, "uvata": 5475},
        dict(BUY_CB_EV, out=10**10, max_=10**12, min_base=10**10),
        3888680, 5475, uvata_lamports=[None, 2044755])),
    ("B", "buy", "cb-readonly-bbdest",
     dict(name="buy", amount=10**10, limit=10**12,
          overrides=combine(cashback_buy(False), meta_mutation(26, "readonly"))), False,
     err("PrivilegeEscalation", "PrivilegeEscalation", sites(None, None))),
    # family C: creator-0 next=0 shift (buy 10^10)
    ("C", "buy", "creator0-noncb-std",
     dict(name="buy", amount=10**10, limit=10**12,
          overrides=combine(custom_fee_table([(0, (2, 93, 0))]))), False,
     err("6053", "BuybackFeeRecipientNotAuthorized", sites("global_config.rs:326", "global_config.rs:43"))),
    ("C", "buy", "creator0-cb-cblayout",
     dict(name="buy", amount=10**10, limit=10**12,
          overrides=combine(custom_fee_table([(0, (2, 93, 0))]), cashback_buy(False))), False,
     err("6053", "BuybackFeeRecipientNotAuthorized", sites("global_config.rs:326", "global_config.rs:43"))),
    ("C", "buy", "creator0-cb-std",
     dict(name="buy", amount=10**10, limit=10**12,
          overrides=combine(custom_fee_table([(0, (2, 93, 0))]), cb_std)), False,
     err("6053", "BuybackFeeRecipientNotAuthorized", sites("global_config.rs:326", "global_config.rs:43"))),
    ("C", "buy", "creator0-noncb-trimmed",
     dict(name="buy", amount=10**10, limit=10**12, overrides=creator0_trim), False,
     ok({"userbase": 10**10, "userquote": -1842321, "vaultbase": -10**10,
         "vaultquote": 1825348, "protocol_ata": 8487, "creator_ata": 0,
         "buyback": 8486},
        dict(CREATOR0_EV, out=10**10, max_=10**12, min_base=10**10),
        1849400, 0)),
    ("C", "buy", "creator0-cb-trimmed",
     dict(name="buy", amount=10**10, limit=10**12, overrides=creator0_trim_cb), False,
     ok({"userbase": 10**10, "userquote": -1842321, "vaultbase": -10**10,
         "vaultquote": 1825348, "protocol_ata": 8487, "creator_ata": 0,
         "buyback": 8486},
        dict(CREATOR0_EV, out=10**10, max_=10**12, min_base=10**10),
        1849400, 0)),
    # family D: gates / order / guards
    ("D", "buy", "cb-disable8",
     dict(name="buy", amount=10**10, limit=10**12,
          overrides=combine(cashback_buy(False), mutate(CONFIG_KEY, 56, bytes([8])))), False,
     err("6020", "DisabledBuy", sites("buy.rs:317", "buy.rs:134"))),
    ("D", "buy", "mayhem-buy",
     dict(name="buy", amount=10**10, limit=10**12, overrides=mutate(pool, 243, b"\x01")), False,
     err("6013", "InvalidProtocolFeeRecipient", sites("swap/mod.rs:164", "swap/mod.rs:23"))),
    ("D", "buy", "cb-mayhem-buy",
     dict(name="buy", amount=10**10, limit=10**12, overrides=cb_mayhem), False,
     err("6013", "InvalidProtocolFeeRecipient", sites("swap/mod.rs:164", "swap/mod.rs:23"))),
    ("D", "buy", "cb-amount0",
     dict(name="buy", amount=0, limit=10**12, overrides=cashback_buy(False)), False,
     err("6001", "ZeroBaseAmount", sites("buy.rs:326", "buy.rs:150"))),
    ("D", "buy", "cb-unsigned",
     dict(name="buy", amount=10**10, limit=10**12, unsigned=True, overrides=cashback_buy(False)), False,
     err("3010", "AccountNotSigner", sites("caused by account: user", "caused by account: user"), payer=0)),
    ("D", "buy", "cb-earned-overflow",
     dict(name="buy", amount=10**10, limit=10**12, overrides=earned_overflow), False,
     err("6023", "Overflow", sites("buy.rs:98", "buy.rs:529"))),
    ("D", "buy", "cb-buy-limit-minus1",
     dict(name="buy", amount=10**10, limit=1847795, overrides=cashback_buy(False)), False,
     err("6004", "ExceededSlippage", sites("buy.rs:405", "buy.rs:272"))),
    ("D", "buy_exact_quote_in", "cb-buyexact-limit-plus1",
     dict(name="buy_exact_quote_in", amount=10**7, limit=54115018304, overrides=cashback_buy(False)), False,
     err("6040", "BuySlippageBelowMinBaseAmountOut", sites("buy.rs:776", "buy.rs:270"))),
    # family E: transfer-fee overlays
    ("E", "buy", "cb-tf100-fresh",
     dict(name="buy", amount=10**10, limit=10**12, overrides=cash_tf(100, 2**64 - 1)), True,
     ok({"userbase": 10**10, "userquote": -1866234, "vaultbase": -10**10,
         "vaultquote": 1825348, "protocol_ata": 8402, "creator_ata": 0,
         "buyback": 8401, "uvata": 5420},
        dict(BUY_CB_EV, out=10**10, max_=10**12, min_base=10**10, bb=8401),
        4007000, 5475, uvata_lamports=[None, 2163075],
        withheld={"vaultquote": 18438, "protocol_ata": 85, "buyback": 85,
                  "uvata": 55, "creator_ata": 0})),
    ("E", "buy", "cb-tf5000-fresh",
     dict(name="buy", amount=10**10, limit=10**12, overrides=cash_tf(5000, 2**64 - 1)), True,
     ok({"userbase": 10**10, "userquote": -3673144, "vaultbase": -10**10,
         "vaultquote": 1825348, "protocol_ata": 4243, "creator_ata": 0,
         "buyback": 4243, "uvata": 2737},
        dict(BUY_CB_EV, out=10**10, max_=10**12, min_base=10**10, bb=4243),
        4007000, 5475, uvata_lamports=[None, 2163075],
        withheld={"vaultquote": 1825348, "protocol_ata": 4244, "buyback": 4243,
                  "uvata": 2738, "creator_ata": 0})),
    ("E", "buy", "cb-tf100-max100",
     dict(name="buy", amount=10**10, limit=10**12, overrides=cash_tf(100, 100)), True,
     ok({"userbase": 10**10, "userquote": -1847896, "vaultbase": -10**10,
         "vaultquote": 1825348, "protocol_ata": 8402, "creator_ata": 0,
         "buyback": 8401, "uvata": 5420},
        dict(BUY_CB_EV, out=10**10, max_=10**12, min_base=10**10, bb=8401),
        4007000, 5475, uvata_lamports=[None, 2163075],
        withheld={"vaultquote": 100, "protocol_ata": 85, "buyback": 85,
                  "uvata": 55, "creator_ata": 0})),
    ("E", "buy", "cb-tf10000-fresh",
     dict(name="buy", amount=10**10, limit=10**12, overrides=cash_tf(10000, 2**64 - 1)), True,
     err("6023", "Overflow", sites("transfer_fee.rs:67", "transfer_fee.rs:35", cand="transfer_fee.rs:67"))),
    ("E", "buy_exact_quote_in", "cb-buyexact-tf100-fresh",
     dict(name="buy_exact_quote_in", amount=10**7, limit=1, overrides=cash_tf(100, 2**64 - 1)), True,
     ok({"userbase": 53573907921, "userquote": -9998786, "vaultbase": -53573907921,
         "vaultquote": 9779732, "protocol_ata": 45012, "creator_ata": 0,
         "buyback": 45012, "uvata": 29040},
        dict(BUYEX_TF_EV, out=53573907921, max_=10**7, min_base=1),
        4007000, 29334, uvata_lamports=[None, 2186934],
        withheld={"vaultquote": 98786, "protocol_ata": 455, "buyback": 455,
                  "uvata": 294, "creator_ata": 0})),
    ("E", "buy_exact_quote_in", "cb-buyexact-tf100-present",
     dict(name="buy_exact_quote_in", amount=10**7, limit=1, overrides=cash_tf(100, 2**64 - 1, present=True)), True,
     ok({"userbase": 53573907921, "userquote": -9998786, "vaultbase": -53573907921,
         "vaultquote": 9779732, "protocol_ata": 45012, "creator_ata": 0,
         "buyback": 45012, "uvata": 29040},
        dict(BUYEX_TF_EV, out=53573907921, max_=10**7, min_base=1),
        1849400, 29334, uvata_lamports=[2157600, 2186934],
        withheld={"vaultquote": 98786, "protocol_ata": 455, "buyback": 455,
                  "uvata": 294, "creator_ata": 0})),
]

receipts_global = []
report_cases = []


def run_case(family, ix_name, label, kwargs, tf, exp, binary):
    r = legacy_buy(candidate=binary, **kwargs)
    roles = roles_for(tf)
    role_keys = {name: str(key) for name, key in roles.items()}
    before, after = r["before"], r["after"]
    payer_key = role_keys["fee_payer"]
    payer_paid = before[payer_key]["lamports"] - after[payer_key]["lamports"] \
        if before.get(payer_key) and after.get(payer_key) else None
    vol_b = before.get(role_keys["volume"])
    vol_a = after.get(role_keys["volume"])
    vol = {"earned_before": vol_field(vol_b["data_hex"], 74) if vol_b else None,
           "earned_after": vol_field(vol_a["data_hex"], 74) if vol_a else None,
           "sol_before": vol_field(vol_b["data_hex"], 57) if vol_b else None,
           "sol_after": vol_field(vol_a["data_hex"], 57) if vol_a else None,
           "lamports_before": vol_b["lamports"] if vol_b else None,
           "lamports_after": vol_a["lamports"] if vol_a else None}
    uva_b = before.get(role_keys["uvata"])
    uva_a = after.get(role_keys["uvata"])
    uvata_lamports = [uva_b["lamports"] if uva_b else None,
                      uva_a["lamports"] if uva_a else None]
    exact = ix_name == "buy_exact_quote_in"
    if exp["kind"] == "ok":
        assert not r["error"], (label, binary, r["error"])
        assert r["events"] and len(r["events"]) == 1, (label, binary, r["events"])
        ev = decode_buy_event(r["logs"], exact)
        assert ev == exp["event"], (label, binary, ev, exp["event"])
        deltas = {}
        for name, want in exp["deltas"].items():
            key = role_keys[name]
            b = before.get(key)
            a = after.get(key)
            assert a, (label, binary, name, "missing after snapshot")
            b_amt = amount_at(b["data_hex"]) if b else 0
            got = amount_at(a["data_hex"]) - b_amt
            assert got == want, (label, binary, name, got, want)
            deltas[name] = got
        assert payer_paid == exp["payer"], (label, binary, payer_paid, exp["payer"])
        assert vol["earned_after"] == exp["earned_after"], (label, binary, vol)
        assert vol["sol_after"] == exp["sol_after"], (label, binary, vol)
        if exp["uvata_lamports"] is not None:
            assert uvata_lamports == exp["uvata_lamports"], \
                (label, binary, uvata_lamports, exp["uvata_lamports"])
        withheld = {}
        for name, key in role_keys.items():
            if name in ("fee_payer", "pool", "global_config", "volume"):
                continue
            snap = after.get(key)
            w = withheld_at(snap["data_hex"]) if snap else None
            if w is not None:
                withheld[name] = w
        for name, want in exp["withheld"].items():
            assert withheld.get(name) == want, (label, binary, name, withheld.get(name), want)
        observed = {"deltas": deltas, "event": ev, "event_count": 1,
                    "payer_paid": payer_paid, "volume": vol,
                    "uvata_lamports": uvata_lamports, "withheld": withheld}
    else:
        assert r["error"], (label, binary, "expected failure")
        assert exp["code"] in r["error"], (label, binary, r["error"])
        assert exp["fragment"] in (r["error"] or "") or exp["fragment"] in "\n".join(r["logs"]), \
            (label, binary, r["error"], r["logs"][-3:])
        assert r["events"] == 0 or len(r["events"]) == 0, (label, binary, r["events"])
        assert payer_paid == exp["payer"], (label, binary, payer_paid, exp["payer"])
        for key, snap_b in before.items():
            if key == payer_key:
                continue
            assert snap_b == after.get(key), (label, binary, key, "no rollback")
        observed = {"error_code": exp["code"], "fragment": exp["fragment"],
                    "event_count": 0, "payer_paid": payer_paid,
                    "rollback": True, "volume": vol,
                    "uvata_lamports": uvata_lamports}
    return observed, before, after, r


for index, (family, ix_name, label, kwargs, tf, exp) in enumerate(CASES):
    row = {"case": {"family": family, "instruction": ix_name, "label": label,
                    "expected": exp}}
    seen = set()
    for image, binary in IMAGES.items():
        observed, before, after, r = run_case(family, ix_name, label, kwargs, tf, exp, binary)
        seen.add(json.dumps(observed, sort_keys=True))
        if exp["kind"] == "err":
            site = site_line(r["logs"])
            if exp["sites"]["original"] is not None:
                assert site and exp["sites"][image] in site, (label, image, site)
                row.setdefault("error_sites", {})[image] = site
        tx = Transaction.from_bytes(base64.b64decode(r["transaction_base64"]))
        assert tx.verify_with_results() and all(tx.verify_with_results()), (label, image)
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "family": family,
                        "instruction": ix_name, "label": label},
            "transaction_base64": r["transaction_base64"],
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(base64.b64decode(r["transaction_base64"])),
            "all_signatures_verified": True, "signature_fields": len(tx.signatures),
            "before": before, "after": after,
            "metadata": {"signature": str(tx.signatures[0]) if tx.signatures else None,
                         "logs": r["logs"], "events": len(r["events"])},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                      "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
            "error": r["error"], "rollback_except_payer_fee": r["error"] is not None,
            "payer_delta_lamports": observed["payer_paid"],
            "observed": observed, "roles": {k: str(v) for k, v in roles_for(tf).items()},
        })
        print(f"  {family} {label} [{image}] err={r['error']} paid={observed['payer_paid']}", flush=True)
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
    "evidence/original/pump_fees/deployed.so",
    "evidence/dependencies/spl_token/deployed.so",
    "evidence/dependencies/spl_token_2022/deployed.so",
    "evidence/dependencies/associated_token/deployed.so",
    "scripts/pump_amm_legacy_buy_differential.py",
    "scripts/pump_amm_legacy_sell_differential.py",
    "scripts/pump_amm_trade_v2_differential.py",
    "scripts/pump_amm_reusable_harness.py",
]
report = {
    "schema": 1, "packet": "amm-legacy-buy-cashback-20261029",
    "case_count": len(report_cases), "mismatches": [],
    "scope": ("legacy buy (buy + buy_exact_quote_in) on a cashback "
              "pool, on all 3 images (original / #424 control / #427 "
              "candidate): the 4-account cashback remaining layout "
              "[cashback ATA, pool-v2 PDA, buyback owner, buyback "
              "dest] versus the 3-account standard layout; the "
              "remaining validation ladder (6059/6061/6062/6058/"
              "6053, read-only pool-v2 success, read-only buyback "
              "dest PrivilegeEscalation); the creator_fee == 0 "
              "next=0 buyback-window shift (standard remaining "
              "fails 6053, trimmed [owner, dest] succeeds -- the "
              "whitelist-trap mechanism); gate order disable 6020 "
              "> protocol-recipient 6013 > zero guards 6001/6002 "
              "> cashback conversion; cashback_earned growing by "
              "the GROSS creator fee under transfer fee while the "
              "event reports gross creator/protocol but NET "
              "buyback; tf10000 buy failing 6023 in transfer_fee.rs; "
              "track_volume leaving current_sol_volume untouched. "
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
        if "thrown in" in site:
            site = site.split("thrown in", 1)[1].strip()
        elif site:
            site = site.replace("Program log: ", "")
        per.append(f"{key} {site}")
    print(f"- {case['label']}: " + "; ".join(per))
