#!/usr/bin/env python3
"""Build research/amm-reserved-fee-recipients-downstream-20261029 receipts.

2nd run packet #50: set_reserved_fee_recipients downstream binding.

The 1st run packet research/amm-reserved-fee-recipients-20261028 pinned
only the setter's storage (exactly 8 recipients, replace-not-append,
7/0 recipients -> 6044, unfunded -> 2005, outsider signer 6005,
unsigned 3010, readonly 2000, PDA 353..385, recipients 385..641) and
stated in Limits that the whitelist fee-routing effect was NOT probed.
This packet pins what the setter DOES downstream:

Family S -- setter edges the 1st packet did not cover:
- 9 remaining accounts succeed, the 9th is ignored (require_gte, not ==);
- a zero recipient -> 6011 AllProtocolFeeRecipientsShouldBeNonZero;
- duplicate recipients succeed (no sorted/unique check -- the exact
  opposite of update_fee_config's 6012 gate pinned by 2nd #43);
- an executable recipient -> 2007 ConstraintExecutable;
- an unfunded recipient -> 2005 ConstraintRentExempt;
- the event is 272 bytes (disc + i64 timestamp + 8 pubkeys) and the
  write is exactly whitelist_pda 353..385, reserved_fee_recipient
  385..417, reserved_fee_recipients 418..642; the mayhem_mode_enabled
  byte at 417 between them is untouched (fixture value 1).

Family W -- whitelist fee-zero chain (buy.rs:178, legacy_sell.rs:121,
trade.rs:52 fees()): when global_config.whitelist_pda == user.key(),
all fee bps are forced to 0 AFTER fee selection, so creator_fee == 0
and the buy/sell remaining-account window never advances (next stays
0). Consequence, the #47 creator-0 window shift reappears, now
triggered by the whitelist instead of a zero creator fee:
- legacy buy/sell with the standard 3-account remaining
  [pool-v2, buyback owner, buyback dest] FAIL 6053 (the buyback
  validator reads remaining[0] = the pool-v2 PDA);
- with EMPTY remaining they fail 6058 (get_buyback_accounts always
  reads remaining[index] and [index+1], even when buyback_fee == 0);
- with the trimmed [owner, dest] remaining they succeed and settle
  at curve only (buy 10^10: spend 1,824,983, vault +1,824,983, all
  fee legs 0; sell 10^9: user +182,495, vault -182,495, all legs 0);
- buy_exact trims the same way (10^7 in -> out 54,791,407,798);
- v2 buy/sell zero out too (buy 10^6: spend 183 vs anchor 187;
  sell 10^6: user +182 vs anchor +178);
- multi-hop IGNORES the whitelist completely (it calls
  select_and_apply_v2 directly, never trade::fees): buy and sell
  settle byte-identical to the non-whitelist anchors;
- the gate is the whitelist_pda FIELD, not the signer: a
  non-whitelisted PAYER pays full fees while the whitelist points at
  an outsider key, and a whitelisted OUTSIDER settles curve-only.

Family M -- mayhem reserved chain (swap/mod.rs validate):
- a mayhem pool with a non-reserved protocol recipient fails 6013;
- a fixture-reserved recipient (res0) trades fine WITHOUT any
  setter call (protocol 16,973 lands in res0's ATA, buyback 0);
- after the setter replaces the list, the OLD reserved member
  fails 6013 (replace, not append) while the NEW member succeeds;
- mayhem sell after the setter succeeds (user +180,212, protocol
  gross 1,698, creator 548, buyback 0);
- the reserved list gates mayhem pools ONLY: the same setter leaves
  a non-mayhem buy at full fees.

Error sites are recorded per image in the report; verify.py checks
each image's site line against that image's logs (original and
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
from solders.keypair import Keypair
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
import pump_amm_multi_hop_differential as mhmod

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-reserved-fee-recipients-downstream-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}

PUMP = mhmod.PUMP
BUYBACK_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
POOLV2, _ = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)
GLOBAL_VOLUME, _ = Pubkey.find_program_address([b'global_volume_accumulator'], PROGRAM)
PAYER_KEY = PAYER.pubkey()
R = [Pubkey.from_bytes(bytes([0x61 + i]) * 32) for i in range(9)]
OUTKEY = Pubkey.from_bytes(bytes([0x73]) * 32)
OUT2 = Keypair()
OUT2_UB, _ = Pubkey.find_program_address([bytes(OUT2.pubkey()), bytes(TOKEN), bytes(base)], ATA)
OUT2_UQ, _ = Pubkey.find_program_address([bytes(OUT2.pubkey()), bytes(TOKEN), bytes(quote)], ATA)
OUT2_VOL, _ = Pubkey.find_program_address([b'user_volume_accumulator', bytes(OUT2.pubkey())], PROGRAM)
RES0 = Pubkey.from_bytes(bytes(bytearray(RAW)[385:417]))
RES0_ATA, _ = Pubkey.find_program_address([bytes(RES0), bytes(TOKEN), bytes(quote)], ATA)
UNFUNDED = Pubkey.from_bytes(bytes([0x72]) * 32)
DUMMY_EXEC = TOKEN  # an executable program account

SETR_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'set_reserved_fee_recipients')['discriminator'])
BUY_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'buy')['discriminator'])
BUYEX_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'buy_exact_quote_in')['discriminator'])
SELL_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'sell')['discriminator'])
V2BUY_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'buy_v2')['discriminator'])
V2SELL_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'sell_v2')['discriminator'])
MH_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'multi_hop_swap')['discriminator'])
SET_EVT_DISC = hashlib.sha256(b'event:ReservedFeeRecipientsEvent').digest()[:8]

SETUP_CONFIG = bytes(bytearray(RAW[:56]) + bytes([0]) + bytes(RAW[57:]))
FIX_POOL_FEES = [2488, 123394]
FIX_VQ = -125882

WATCH = [pool, userbase, userquote, vaultbase, vaultquote, PROTOCOL_ATA,
         CREATOR_ATA, buyback, volume, CONFIG_KEY, PAYER_KEY, RES0_ATA,
         OUT2_UB, OUT2_UQ, OUT2_VOL, OUT2.pubkey()]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def snap(vm, keys=WATCH):
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


def tok_delta(before, after):
    return (tok_amount(after) or 0) - (tok_amount(before) or 0)


def lam_delta(before, after):
    b = before["lamports"] if before else 0
    a = after["lamports"] if after else 0
    return a - b


def pool_fees(entry):
    raw = bytes.fromhex(entry["data_hex"])
    return [struct.unpack_from('<Q', raw, 271)[0],
            struct.unpack_from('<Q', raw, 279)[0]]


def pool_vq(entry):
    return struct.unpack_from('<q', bytes.fromhex(entry["data_hex"]), 245)[0]


def cfg_bytes(entry):
    return bytes.fromhex(entry["data_hex"])


def ev_data(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    return base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())


def u64(raw, off):
    return struct.unpack_from('<Q', raw, off)[0]


def setup_vm(binary, pool_mut=None, user=PAYER, pre_res0=False):
    h = acquire_harness(binary)
    h.vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    h.vm.airdrop(PAYER_KEY, 10**12)
    for pid, filepath in [(TOKEN, 'evidence/dependencies/spl_token/deployed.so'),
                          (TOKEN22, 'evidence/dependencies/spl_token_2022/deployed.so'),
                          (FEES, 'evidence/original/pump_fees/deployed.so'),
                          (ATA, 'evidence/dependencies/associated_token/deployed.so'),
                          (PUMP, 'evidence/original/pump/deployed.so')]:
        h.vm.add_program_from_file(pid, ROOT / filepath)
    for n, row in f['accounts'].items():
        h.vm.set_account(Pubkey.from_string(row['address']),
                         Account(row['lamports'], base64.b64decode(row['data_base64']),
                                 Pubkey.from_string(row['owner'])))
    glob = bytearray(RAW)
    glob[56] = 0
    h.vm.set_account(CONFIG_KEY, Account(CONFIG['lamports'], bytes(glob), PROGRAM))
    uk = user.pubkey()
    ub = userbase if uk == PAYER_KEY else OUT2_UB
    uq = userquote if uk == PAYER_KEY else OUT2_UQ
    vol = volume if uk == PAYER_KEY else OUT2_VOL
    for k, m, owner, native in [(ub, base, uk, False),
                                (uq, quote, uk, True),
                                (PROTOCOL_ATA, quote, PROTOCOL, True),
                                (CREATOR_ATA, quote, CREATOR_VAULT, True)]:
        h.vm.set_account(k, Account(10**15 + 2039280 if native else 10**9,
                                    token(m, owner, 10**15 if k in [ub, uq] else 0, native), TOKEN))
    for k in [PROTOCOL, CREATOR_VAULT]:
        h.vm.set_account(k, Account(10**9, b'', Pubkey.default()))
    h.vm.set_account(vol, Account(0, b'', Pubkey.default()))
    gdisc = bytes(next(x for x in IDL['accounts'] if x['name'] == 'GlobalVolumeAccumulator')['discriminator'])
    h.vm.set_account(GLOBAL_VOLUME, Account(10**9, gdisc + struct.pack('<qqq', 0, 0, 86400) + bytes(base) + bytes(480), PROGRAM))
    pdata = bytearray(poolraw)
    if pool_mut:
        pool_mut(pdata)
    h.vm.set_account(pool, Account(10**9, bytes(pdata), PROGRAM))
    for k in [POOLV2, BUYBACK_OWNER]:
        h.vm.set_account(k, Account(10**9, b'', Pubkey.default()))
    for r in R:
        h.vm.set_account(r, Account(10**9, b'', Pubkey.default()))
    h.vm.set_account(UNFUNDED, Account(0, b'', Pubkey.default()))
    for k in [mhmod.PUMP_GLOBAL, mhmod.PUMP_FEES, mhmod.PUMP_EVENT]:
        h.vm.set_account(k, Account(10**9, b'', Pubkey.default()))
    if pre_res0:
        h.vm.set_account(RES0, Account(10**9, b'', Pubkey.default()))
        h.vm.set_account(RES0_ATA, Account(2039280, token(quote, RES0, 0, True), TOKEN))
    if user is not PAYER:
        h.vm.airdrop(uk, 10**12)
    return h, {"ub": ub, "uq": uq, "vol": vol}


def send_tx(h, data, metas, signer=PAYER):
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, data, metas)], signer.pubkey(), [signer], h.vm.latest_blockhash())
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


def do_set(h, wl, recips, signer=PAYER):
    metas = [AccountMeta(CONFIG_KEY, False, True), AccountMeta(signer.pubkey(), True, False),
             AccountMeta(EVENT, False, False), AccountMeta(PROGRAM, False, False)] + \
            [AccountMeta(r, False, False) for r in recips]
    return send_tx(h, SETR_DISC + bytes(wl), metas, signer)


def buy_keys(ctx, protocol=PROTOCOL, protocol_ata=PROTOCOL_ATA, user=PAYER):
    return [pool, user.pubkey(), CONFIG_KEY, base, quote, ctx["ub"], ctx["uq"],
            vaultbase, vaultquote, protocol, protocol_ata, TOKEN, TOKEN,
            Pubkey.default(), ATA, EVENT, PROGRAM, CREATOR_ATA, CREATOR_VAULT,
            GLOBAL_VOLUME, ctx["vol"], feeconfig, FEES]


def sell_keys(ctx, protocol=PROTOCOL, protocol_ata=PROTOCOL_ATA, user=PAYER):
    return [pool, user.pubkey(), CONFIG_KEY, base, quote, ctx["ub"], ctx["uq"],
            vaultbase, vaultquote, protocol, protocol_ata, TOKEN, TOKEN,
            Pubkey.default(), ATA, EVENT, PROGRAM, CREATOR_ATA, CREATOR_VAULT,
            feeconfig, FEES]


def do_buy(h, ctx, remaining, amount, limit, protocol=PROTOCOL, protocol_ata=PROTOCOL_ATA, user=PAYER):
    return send_tx(h, BUY_DISC + struct.pack('<QQ', amount, limit) + b'\0',
                   idl_metas('buy', buy_keys(ctx, protocol, protocol_ata, user)) + remaining, user)


def do_buyexact(h, ctx, remaining, amount, limit, user=PAYER):
    return send_tx(h, BUYEX_DISC + struct.pack('<QQ', amount, limit) + b'\0',
                   idl_metas('buy_exact_quote_in', buy_keys(ctx, user=user)) + remaining, user)


def do_sell(h, ctx, remaining, amount, limit, protocol=PROTOCOL, protocol_ata=PROTOCOL_ATA, user=PAYER):
    return send_tx(h, SELL_DISC + struct.pack('<QQ', amount, limit),
                   idl_metas('sell', sell_keys(ctx, protocol, protocol_ata, user)) + remaining, user)


def do_v2(h, ctx, name, disc, amount, limit, user=PAYER):
    keys = [pool, user.pubkey(), CONFIG_KEY, base, quote, ctx["ub"], ctx["uq"],
            vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), ctx["vol"],
            feeconfig, buyback, EVENT, PROGRAM]
    return send_tx(h, disc + struct.pack('<QQ', amount, limit), idl_metas(name, keys), user)


def do_mh(h, ctx, amount, limit, sell=False, user=PAYER):
    keys = [user.pubkey(), ctx["uq"] if not sell else ctx["ub"],
            ctx["ub"] if not sell else ctx["uq"], CONFIG_KEY, feeconfig, ctx["vol"],
            buyback, TOKEN, TOKEN22, Pubkey.default(), EVENT, PROGRAM,
            PUMP, mhmod.PUMP_GLOBAL, mhmod.PUMP_FEES, mhmod.PUMP_EVENT]
    metas = idl_metas('multi_hop_swap', keys) + \
        [AccountMeta(base, False, False), AccountMeta(quote, False, False),
         AccountMeta(pool, False, True), AccountMeta(vaultbase, False, True),
         AccountMeta(vaultquote, False, True)]
    return send_tx(h, MH_DISC + struct.pack('<QQ', amount, limit), metas, user)


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


def cfg_expect(wl, recips):
    c = bytearray(SETUP_CONFIG)
    c[353:385] = bytes(wl)
    c[385:417] = bytes(recips[0])
    c[418:642] = b''.join(bytes(r) for r in recips[1:8])
    return bytes(c)


MAYHEM = lambda d: d.__setitem__(243, 1)

# ---------------------------------------------------------------- cases
# Step expect keys: name, error, events, payer (paid lamports, positive),
# payer_key (default PAYER), deltas {KEYNAME: token delta},
# lam_deltas {KEYNAME: lamport delta}, pool_fees, pool_vq, config {wl, res},
# event {decoded fields}, rollback, site_fragment.
WL8 = R[:8]
WLPROTO = [PROTOCOL] + R[1:8]
CURVE_ONLY_BUY_EV = {"curve": 1824983, "lp_bps": 0, "lp_fee": 0,
                     "proto_bps": 0, "proto_fee": 0, "qwlp": 1824983,
                     "uqin": 1824983, "creator_bps": 0, "creator_fee": 0,
                     "buyback_bps": 5000, "buyback_fee": 0}
MAYHEM_WL_BUY_EV = {"curve": 1824983, "lp_bps": 0, "lp_fee": 0,
                    "proto_bps": 0, "proto_fee": 0, "qwlp": 1824983,
                    "uqin": 1824983, "creator_bps": 0, "creator_fee": 0,
                    "buyback_bps": 0, "buyback_fee": 0}
FULL_BUY_EV = {"curve": 1824983, "lp_bps": 2, "lp_fee": 365,
               "proto_bps": 93, "proto_fee": 16973, "qwlp": 1825348,
               "uqin": 1847796, "creator_bps": 30, "creator_fee": 5475,
               "buyback_bps": 5000, "buyback_fee": 8486}
FULL_BUY_DELTAS = {"userquote": -1847796, "userbase": 10**10,
                   "vaultquote": 1825348, "vaultbase": -10**10,
                   "PROTOCOL_ATA": 8487, "CREATOR_ATA": 5475, "buyback": 8486}
CURVE_BUY_DELTAS = {"userquote": -1824983, "userbase": 10**10,
                    "vaultquote": 1824983, "vaultbase": -10**10,
                    "PROTOCOL_ATA": 0, "CREATOR_ATA": 0, "buyback": 0}
SET_EV = lambda wl, recips: {"ts": 1234567890, "recip": bytes(recips[0]).hex(),
                             "recips": [bytes(r).hex() for r in recips[1:8]],
                             "disc": SET_EVT_DISC.hex()}
CASES = [
    {"label": "s-set-8", "family": "S",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)}]},
    {"label": "s-set-9", "family": "S",
     "steps": [("set", {"wl": PAYER_KEY, "recips": R[:9]})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)}]},
    {"label": "s-set-7", "family": "S",
     "steps": [("set", {"wl": PAYER_KEY, "recips": R[:7]})],
     "expect": [{"name": "set", "error": "6044", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "NotEnoughRemainingAccounts"}]},
    {"label": "s-set-zero", "family": "S",
     "steps": [("set", {"wl": PAYER_KEY, "recips": [Pubkey.default()] + R[1:8]})],
     "expect": [{"name": "set", "error": "6011", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "AllProtocolFeeRecipientsShouldBeNonZero"}]},
    {"label": "s-set-dup", "family": "S",
     "steps": [("set", {"wl": PAYER_KEY, "recips": [R[0]] * 8})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": [R[0]] * 8},
                 "event": SET_EV(PAYER_KEY, [R[0]] * 8)}]},
    {"label": "s-set-exec", "family": "S",
     "steps": [("set", {"wl": PAYER_KEY, "recips": [DUMMY_EXEC] + R[1:8]})],
     "expect": [{"name": "set", "error": "2007", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "ConstraintExecutable"}]},
    {"label": "s-set-unfunded", "family": "S",
     "steps": [("set", {"wl": PAYER_KEY, "recips": [UNFUNDED] + R[1:8]})],
     "expect": [{"name": "set", "error": "2005", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "ConstraintRentExempt"}]},
    {"label": "w-buy-empty", "family": "W",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8}),
               ("buy", {"remaining": [], "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)},
                {"name": "buy", "error": "6058", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "BuybackFeeRecipientMissing"}]},
    {"label": "w-buy-std", "family": "W",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8}),
               ("buy", {"remaining": rem_std(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)},
                {"name": "buy", "error": "6053", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "BuybackFeeRecipientNotAuthorized"}]},
    {"label": "w-buy-trim", "family": "W",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8}),
               ("buy", {"remaining": rem_trim(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)},
                {"name": "buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": CURVE_BUY_DELTAS,
                 "lam_deltas": {"volume": 1844400},
                 "pool_fees": FIX_POOL_FEES, "pool_vq": FIX_VQ,
                 "event": CURVE_ONLY_BUY_EV}]},
    {"label": "w-buyexact-std", "family": "W",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8}),
               ("buyexact", {"remaining": rem_std(), "amount": 10**7, "limit": 1})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)},
                {"name": "buyexact", "error": "6053", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "BuybackFeeRecipientNotAuthorized"}]},
    {"label": "w-buyexact-trim", "family": "W",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8}),
               ("buyexact", {"remaining": rem_trim(), "amount": 10**7, "limit": 1})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)},
                {"name": "buyexact", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -10**7, "userbase": 54791407798,
                            "vaultquote": 10**7, "vaultbase": -54791407798,
                            "PROTOCOL_ATA": 0, "CREATOR_ATA": 0, "buyback": 0},
                 "lam_deltas": {"volume": 1844400},
                 "pool_fees": FIX_POOL_FEES, "pool_vq": FIX_VQ,
                 "event": {"curve": 10**7, "lp_bps": 0, "lp_fee": 0,
                           "proto_bps": 0, "proto_fee": 0, "qwlp": 10**7,
                           "uqin": 10**7, "creator_bps": 0, "creator_fee": 0,
                           "buyback_bps": 5000, "buyback_fee": 0}}]},
    {"label": "w-sell-std", "family": "W",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8}),
               ("sell", {"remaining": rem_std(), "amount": 10**9, "limit": 1})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)},
                {"name": "sell", "error": "6053", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "BuybackFeeRecipientNotAuthorized"}]},
    {"label": "w-sell-empty", "family": "W",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8}),
               ("sell", {"remaining": [], "amount": 10**9, "limit": 1})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)},
                {"name": "sell", "error": "6058", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "BuybackFeeRecipientMissing"}]},
    {"label": "w-sell-trim", "family": "W",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8}),
               ("sell", {"remaining": rem_trim(), "amount": 10**9, "limit": 1})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)},
                {"name": "sell", "error": None, "events": 1, "payer": 5000,
                 "deltas": {"userquote": 182495, "userbase": -10**9,
                            "vaultquote": -182495, "vaultbase": 10**9,
                            "PROTOCOL_ATA": 0, "CREATOR_ATA": 0, "buyback": 0},
                 "pool_fees": FIX_POOL_FEES, "pool_vq": FIX_VQ,
                 "event": {"quote": 182495, "proto_fee": 0}}]},
    {"label": "w-v2buy", "family": "W",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8}),
               ("v2buy", {"amount": 10**6, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)},
                {"name": "v2buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -183, "userbase": 10**6,
                            "vaultquote": 183, "vaultbase": -10**6, "buyback": 0},
                 "lam_deltas": {"volume": 1844400},
                 "pool_fees": FIX_POOL_FEES, "pool_vq": FIX_VQ,
                 "event": {"quote": 183, "lp_bps": 0, "lp_fee": 0,
                           "proto_bps": 0, "proto_fee": 0, "qwlp": 183,
                           "uqin": 183, "creator_bps": 0, "creator_fee": 0,
                           "buyback_bps": 5000, "buyback_fee": 0}}]},
    {"label": "w-v2sell", "family": "W",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8}),
               ("v2sell", {"amount": 10**6, "limit": 1})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)},
                {"name": "v2sell", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": 182, "userbase": -10**6,
                            "vaultquote": -182, "vaultbase": 10**6, "buyback": 0},
                 "lam_deltas": {"volume": 1844400},
                 "pool_fees": FIX_POOL_FEES, "pool_vq": FIX_VQ,
                 "event": {"curve": 182, "lp_bps": 0, "lp_fee": 0,
                           "proto_bps": 0, "proto_fee": 0, "qwlp": 182,
                           "uqin": 182, "creator_bps": 0, "creator_fee": 0,
                           "buyback_bps": 5000, "buyback_fee": 0}}]},
    {"label": "w-mhbuy", "family": "W",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8}),
               ("mhbuy", {"amount": 10**9, "limit": 1})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)},
                {"name": "mhbuy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -10**9, "userbase": 5368809031467,
                            "vaultquote": 995407407, "vaultbase": -5368809031467,
                            "buyback": 4592593},
                 "lam_deltas": {"volume": 1844400},
                 "event": {"hop": [10**9, 2, 197531, 93, 9185186, 987851851, 987654320]}}]},
    {"label": "w-mhsell", "family": "W",
     "steps": [("set", {"wl": PAYER_KEY, "recips": WL8}),
               ("mhsell", {"amount": 10**9, "limit": 1})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WL8},
                 "event": SET_EV(PAYER_KEY, WL8)},
                {"name": "mhsell", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": 180212, "userbase": -10**9,
                            "vaultquote": -181061, "vaultbase": 10**9,
                            "buyback": 849},
                 "lam_deltas": {"volume": 1844400},
                 "event": {"hop": [182495, 2, 37, 93, 1698, 182458, 180212]}}]},
    {"label": "w-nonwl-buy", "family": "W",
     "steps": [("set", {"wl": OUTKEY, "recips": WL8}),
               ("buy", {"remaining": rem_std(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": OUTKEY, "res": WL8},
                 "event": SET_EV(OUTKEY, WL8)},
                {"name": "buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": FULL_BUY_DELTAS,
                 "lam_deltas": {"volume": 1844400},
                 "pool_fees": FIX_POOL_FEES, "pool_vq": FIX_VQ,
                 "event": FULL_BUY_EV}]},
    {"label": "w-outsider-buy", "family": "W", "user": OUT2,
     "steps": [("set", {"wl": OUT2.pubkey(), "recips": WL8}),
               ("buy", {"remaining": rem_trim(), "amount": 10**10, "limit": 10**12, "user": OUT2})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": OUT2.pubkey(), "res": WL8},
                 "event": SET_EV(OUT2.pubkey(), WL8)},
                {"name": "buy", "error": None, "events": 1, "payer": 1849400,
                 "payer_key": str(OUT2.pubkey()),
                 "deltas": {"userquote": -1824983, "userbase": 10**10,
                            "vaultquote": 1824983, "vaultbase": -10**10,
                            "PROTOCOL_ATA": 0, "CREATOR_ATA": 0, "buyback": 0},
                 "lam_deltas": {"volume": 1844400},
                 "pool_fees": FIX_POOL_FEES, "pool_vq": FIX_VQ,
                 "event": CURVE_ONLY_BUY_EV}]},
    {"label": "a-v2buy", "family": "W",
     "steps": [("v2buy", {"amount": 10**6, "limit": 10**12})],
     "expect": [{"name": "v2buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -187, "userbase": 10**6,
                            "vaultquote": 186, "vaultbase": -10**6, "buyback": 1},
                 "lam_deltas": {"volume": 1844400},
                 "pool_fees": [2489, 123395], "pool_vq": -125884,
                 "event": {"quote": 183, "lp_bps": 2, "lp_fee": 1,
                           "proto_bps": 93, "proto_fee": 2, "qwlp": 184,
                           "uqin": 187, "creator_bps": 30, "creator_fee": 1,
                           "buyback_bps": 5000, "buyback_fee": 1}}]},
    {"label": "a-v2sell", "family": "W",
     "steps": [("v2sell", {"amount": 10**6, "limit": 1})],
     "expect": [{"name": "v2sell", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": 178, "userbase": -10**6,
                            "vaultquote": -179, "vaultbase": 10**6, "buyback": 1},
                 "lam_deltas": {"volume": 1844400},
                 "pool_fees": [2489, 123395], "pool_vq": -125884,
                 "event": {"curve": 182, "lp_bps": 2, "lp_fee": 1,
                           "proto_bps": 93, "proto_fee": 2, "qwlp": 181,
                           "uqin": 178, "creator_bps": 30, "creator_fee": 1,
                           "buyback_bps": 5000, "buyback_fee": 1}}]},
    {"label": "a-mhbuy", "family": "W",
     "steps": [("mhbuy", {"amount": 10**9, "limit": 1})],
     "expect": [{"name": "mhbuy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -10**9, "userbase": 5368809031467,
                            "vaultquote": 995407407, "vaultbase": -5368809031467,
                            "buyback": 4592593},
                 "lam_deltas": {"volume": 1844400},
                 "event": {"hop": [10**9, 2, 197531, 93, 9185186, 987851851, 987654320]}}]},
    {"label": "a-mhsell", "family": "W",
     "steps": [("mhsell", {"amount": 10**9, "limit": 1})],
     "expect": [{"name": "mhsell", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": 180212, "userbase": -10**9,
                            "vaultquote": -181061, "vaultbase": 10**9,
                            "buyback": 849},
                 "lam_deltas": {"volume": 1844400},
                 "event": {"hop": [182495, 2, 37, 93, 1698, 182458, 180212]}}]},
    {"label": "m-buy-noset", "family": "M", "pool_mut": MAYHEM,
     "steps": [("buy", {"remaining": rem_std(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "buy", "error": "6013", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "InvalidProtocolFeeRecipient"}]},
    {"label": "m-buy-res0", "family": "M", "pool_mut": MAYHEM, "pre_res0": True,
     "steps": [("buy", {"remaining": rem_std(), "amount": 10**10, "limit": 10**12,
                        "protocol": RES0, "protocol_ata": RES0_ATA})],
     "expect": [{"name": "buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -1847796, "userbase": 10**10,
                            "vaultquote": 1825348, "vaultbase": -10**10,
                            "RES0_ATA": 16973, "CREATOR_ATA": 5475, "buyback": 0},
                 "lam_deltas": {"volume": 1844400},
                 "pool_fees": FIX_POOL_FEES, "pool_vq": FIX_VQ,
                 "event": {"curve": 1824983, "lp_bps": 2, "lp_fee": 365,
                           "proto_bps": 93, "proto_fee": 16973, "qwlp": 1825348,
                           "uqin": 1847796, "creator_bps": 30, "creator_fee": 5475,
                           "buyback_bps": 0, "buyback_fee": 0}}]},
    {"label": "m-buy-res0-replaced", "family": "M", "pool_mut": MAYHEM, "pre_res0": True,
     "steps": [("set", {"wl": OUTKEY, "recips": WLPROTO}),
               ("buy", {"remaining": rem_std(), "amount": 10**10, "limit": 10**12,
                        "protocol": RES0, "protocol_ata": RES0_ATA})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": OUTKEY, "res": WLPROTO},
                 "event": SET_EV(OUTKEY, WLPROTO)},
                {"name": "buy", "error": "6013", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "InvalidProtocolFeeRecipient"}]},
    {"label": "m-buy-protocol-set", "family": "M", "pool_mut": MAYHEM,
     "steps": [("set", {"wl": OUTKEY, "recips": WLPROTO}),
               ("buy", {"remaining": rem_std(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": OUTKEY, "res": WLPROTO},
                 "event": SET_EV(OUTKEY, WLPROTO)},
                {"name": "buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": {"userquote": -1847796, "userbase": 10**10,
                            "vaultquote": 1825348, "vaultbase": -10**10,
                            "PROTOCOL_ATA": 16973, "CREATOR_ATA": 5475, "buyback": 0},
                 "lam_deltas": {"volume": 1844400},
                 "pool_fees": FIX_POOL_FEES, "pool_vq": FIX_VQ,
                 "event": {"curve": 1824983, "lp_bps": 2, "lp_fee": 365,
                           "proto_bps": 93, "proto_fee": 16973, "qwlp": 1825348,
                           "uqin": 1847796, "creator_bps": 30, "creator_fee": 5475,
                           "buyback_bps": 0, "buyback_fee": 0}}]},
    {"label": "m-sell-protocol-set", "family": "M", "pool_mut": MAYHEM,
     "steps": [("set", {"wl": OUTKEY, "recips": WLPROTO}),
               ("sell", {"remaining": rem_std(), "amount": 10**9, "limit": 1})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": OUTKEY, "res": WLPROTO},
                 "event": SET_EV(OUTKEY, WLPROTO)},
                {"name": "sell", "error": None, "events": 1, "payer": 5000,
                 "deltas": {"userquote": 180212, "userbase": -10**9,
                            "vaultquote": -182458, "vaultbase": 10**9,
                            "PROTOCOL_ATA": 1698, "CREATOR_ATA": 548, "buyback": 0},
                 "pool_fees": FIX_POOL_FEES, "pool_vq": FIX_VQ,
                 "event": {"quote": 182495, "proto_fee": 1698}}]},
    {"label": "m-sell-noset", "family": "M", "pool_mut": MAYHEM,
     "steps": [("sell", {"remaining": rem_trim(), "amount": 10**9, "limit": 1})],
     "expect": [{"name": "sell", "error": "6013", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "InvalidProtocolFeeRecipient"}]},
    {"label": "m-wl-buy-trim", "family": "M", "pool_mut": MAYHEM,
     "steps": [("set", {"wl": PAYER_KEY, "recips": WLPROTO}),
               ("buy", {"remaining": rem_trim(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WLPROTO},
                 "event": SET_EV(PAYER_KEY, WLPROTO)},
                {"name": "buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": CURVE_BUY_DELTAS,
                 "lam_deltas": {"volume": 1844400},
                 "pool_fees": FIX_POOL_FEES, "pool_vq": FIX_VQ,
                 "event": MAYHEM_WL_BUY_EV}]},
    {"label": "m-wl-buy-std", "family": "M", "pool_mut": MAYHEM,
     "steps": [("set", {"wl": PAYER_KEY, "recips": WLPROTO}),
               ("buy", {"remaining": rem_std(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": PAYER_KEY, "res": WLPROTO},
                 "event": SET_EV(PAYER_KEY, WLPROTO)},
                {"name": "buy", "error": "6053", "events": 0, "payer": 5000,
                 "rollback": True, "site_fragment": "BuybackFeeRecipientNotAuthorized"}]},
    {"label": "m-nonmayhem-reserved", "family": "M",
     "steps": [("set", {"wl": OUTKEY, "recips": WLPROTO}),
               ("buy", {"remaining": rem_std(), "amount": 10**10, "limit": 10**12})],
     "expect": [{"name": "set", "error": None, "events": 1, "payer": 5000,
                 "config": {"wl": OUTKEY, "res": WLPROTO},
                 "event": SET_EV(OUTKEY, WLPROTO)},
                {"name": "buy", "error": None, "events": 1, "payer": 1849400,
                 "deltas": FULL_BUY_DELTAS,
                 "lam_deltas": {"volume": 1844400},
                 "pool_fees": FIX_POOL_FEES, "pool_vq": FIX_VQ,
                 "event": FULL_BUY_EV}]},
]

KEYNAME = {str(pool): "pool", str(userbase): "userbase", str(userquote): "userquote",
           str(vaultbase): "vaultbase", str(vaultquote): "vaultquote",
           str(PROTOCOL_ATA): "PROTOCOL_ATA", str(CREATOR_ATA): "CREATOR_ATA",
           str(buyback): "buyback", str(volume): "volume", str(PAYER_KEY): "payer",
           str(CONFIG_KEY): "config", str(RES0_ATA): "RES0_ATA",
           str(OUT2_UB): "userbase", str(OUT2_UQ): "userquote",
           str(OUT2_VOL): "volume", str(OUT2.pubkey()): "payer"}


def key_for(name, ctx):
    if name == "userbase":
        return ctx["ub"]
    if name == "userquote":
        return ctx["uq"]
    if name == "volume":
        return ctx["vol"]
    return next(k for k in WATCH if KEYNAME[str(k)] == name)


def decode_event(kind, rec):
    raw = ev_data(rec["logs"])
    if raw is None:
        return None
    if kind in ("buy", "buyexact"):
        # buyexact ix_name is "buy_exact_quote_in" (18 bytes) vs "buy"
        # (3 bytes), so post-ix_name fields shift by +15.
        bb, bf = (439, 447) if kind == "buyexact" else (424, 432)
        return {"curve": u64(raw, 64), "lp_bps": u64(raw, 72), "lp_fee": u64(raw, 80),
                "proto_bps": u64(raw, 88), "proto_fee": u64(raw, 96),
                "qwlp": u64(raw, 104), "uqin": u64(raw, 112),
                "creator_bps": u64(raw, 344), "creator_fee": u64(raw, 352),
                "buyback_bps": u64(raw, bb), "buyback_fee": u64(raw, bf)}
    if kind == "sell":
        return {"quote": u64(raw, 64), "proto_fee": u64(raw, 96)}
    if kind in ("v2buy", "v2sell"):
        d = {"curve": u64(raw, 64), "quote": u64(raw, 64), "lp_bps": u64(raw, 72),
             "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
             "proto_fee": u64(raw, 96), "qwlp": u64(raw, 104),
             "uqin": u64(raw, 112), "creator_bps": u64(raw, 344),
             "creator_fee": u64(raw, 352)}
        if kind == "v2buy":
            d["buyback_bps"] = u64(raw, 427)
            d["buyback_fee"] = u64(raw, 435)
        else:
            d["buyback_bps"] = u64(raw, 376)
            d["buyback_fee"] = u64(raw, 384)
        return d
    if kind in ("mhbuy", "mhsell"):
        return {"hop": [u64(raw, o) for o in (64, 72, 80, 88, 96, 104, 112)]}
    if kind == "set":
        return {"ts": struct.unpack_from('<q', raw, 8)[0],
                "recip": raw[16:48].hex(),
                "recips": [raw[48 + i * 32:80 + i * 32].hex() for i in range(7)],
                "disc": raw[:8].hex(), "len": len(raw)}
    return None


def run_case(case, image_name, binary):
    user = case.get("user", PAYER)
    h, ctx = setup_vm(binary, pool_mut=case.get("pool_mut"), user=user,
                      pre_res0=case.get("pre_res0", False))
    out = []
    for (kind, params), exp in zip(case["steps"], case["expect"]):
        if kind == "set":
            rec = do_set(h, params["wl"], params["recips"])
        elif kind == "buy":
            rec = do_buy(h, ctx, params["remaining"], params["amount"], params["limit"],
                         params.get("protocol", PROTOCOL), params.get("protocol_ata", PROTOCOL_ATA),
                         params.get("user", PAYER))
        elif kind == "buyexact":
            rec = do_buyexact(h, ctx, params["remaining"], params["amount"], params["limit"],
                              params.get("user", PAYER))
        elif kind == "sell":
            rec = do_sell(h, ctx, params["remaining"], params["amount"], params["limit"],
                          params.get("protocol", PROTOCOL), params.get("protocol_ata", PROTOCOL_ATA),
                          params.get("user", PAYER))
        elif kind == "v2buy":
            rec = do_v2(h, ctx, 'buy_v2', V2BUY_DISC, params["amount"], params["limit"])
        elif kind == "v2sell":
            rec = do_v2(h, ctx, 'sell_v2', V2SELL_DISC, params["amount"], params["limit"])
        elif kind == "mhbuy":
            rec = do_mh(h, ctx, params["amount"], params["limit"], sell=False)
        elif kind == "mhsell":
            rec = do_mh(h, ctx, params["amount"], params["limit"], sell=True)
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
        payer_key = exp.get("payer_key", str(PAYER_KEY))
        payer_d = lam_delta(rec["before"][payer_key], rec["after"][payer_key])
        check(payer_d == -exp["payer"], f"{tag}: payer {payer_d} != {-exp['payer']}")
        if exp.get("pool_fees") is not None:
            check(pool_fees(rec["after"][str(pool)]) == exp["pool_fees"],
                  f"{tag}: pool_fees {pool_fees(rec['after'][str(pool)])} != {exp['pool_fees']}")
        if exp.get("pool_vq") is not None:
            check(pool_vq(rec["after"][str(pool)]) == exp["pool_vq"],
                  f"{tag}: pool_vq {pool_vq(rec['after'][str(pool)])} != {exp['pool_vq']}")
        if exp.get("config") is not None:
            want = cfg_expect(exp["config"]["wl"], exp["config"]["res"])
            got = cfg_bytes(rec["after"][str(CONFIG_KEY)])
            check(got == want, f"{tag}: config bytes differ")
            check(got[417] == SETUP_CONFIG[417], f"{tag}: config byte 417 changed")
        if exp.get("rollback"):
            for k in WATCH:
                if str(k) == payer_key:
                    continue
                check(rec["before"][str(k)] == rec["after"][str(k)],
                      f"{tag}: rollback violated for {k}")
        for keyname, want in exp.get("deltas", {}).items():
            key = key_for(keyname, ctx)
            got = tok_delta(rec["before"][str(key)], rec["after"][str(key)])
            check(got == want, f"{tag}: delta {keyname} {got} != {want}")
        for keyname, want in exp.get("lam_deltas", {}).items():
            key = key_for(keyname, ctx)
            got = lam_delta(rec["before"][str(key)], rec["after"][str(key)])
            check(got == want, f"{tag}: lam delta {keyname} {got} != {want}")
        if exp.get("event") is not None:
            got = decode_event(kind, rec)
            check(got is not None, f"{tag}: event decode failed")
            for fkey, want in exp["event"].items():
                check(got.get(fkey) == want, f"{tag}: event {fkey} {got.get(fkey)} != {want}")
            if kind == "set":
                check(got["len"] == 272, f"{tag}: set event len {got['len']} != 272")
        if exp.get("site_fragment"):
            blob = "\n".join(rec["logs"])
            check(exp["site_fragment"] in blob,
                  f"{tag}: site fragment {exp['site_fragment']} not in logs")
        rec["case"] = case["label"]
        rec["image"] = image_name
        rec["step"] = kind
        rec["payer_key"] = payer_key
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

        def surface(recs):
            out = []
            for rec in recs:
                out.append({"step": rec["step"], "error": rec["error"],
                            "events": len(rec["events"]),
                            "pool_fees": pool_fees(rec["after"][str(pool)]),
                            "pool_vq": pool_vq(rec["after"][str(pool)]),
                            "config": rec["after"][str(CONFIG_KEY)]["data_hex"],
                            "deltas": {KEYNAME[str(k)]: tok_delta(rec["before"][str(k)], rec["after"][str(k)]) for k in WATCH},
                            "lam_deltas": {KEYNAME[str(k)]: lam_delta(rec["before"][str(k)], rec["after"][str(k)]) for k in WATCH},
                            "payer": lam_delta(rec["before"][rec["payer_key"]], rec["after"][rec["payer_key"]])})
            return out
        base = surface(per_image["original"])
        for image_name in ("control", "candidate"):
            check(surface(per_image[image_name]) == base,
                  f"{case['label']}: {image_name} observed surface differs from original")
            for rec in per_image[image_name]:
                receipts.append(rec)
        def _jsonable(o):
            if isinstance(o, Pubkey):
                return str(o)
            if isinstance(o, bytes):
                return o.hex()
            if isinstance(o, dict):
                return {k: _jsonable(v) for k, v in o.items()}
            if isinstance(o, (list, tuple)):
                return [_jsonable(v) for v in o]
            return o
        report_cases.append({"label": case["label"], "family": case["family"],
                             "steps": _jsonable(case["expect"]),
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
