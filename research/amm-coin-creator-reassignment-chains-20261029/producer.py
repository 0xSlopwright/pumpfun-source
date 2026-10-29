#!/usr/bin/env python3
"""Build research/amm-coin-creator-reassignment-chains-20261029 receipts.

3rd run packet #33: coin-creator reassignment chained into trades,
sweeps, collects, and migration.

The gap: 2nd #9 pinned set_coin_creator / migrate_pool_coin_creator
as isolated setter calls, and 2nd #49 pinned their downstream
bindings, but nobody chained a reassignment INTO the fee pipes:
after a trade accrues a creator bucket, does set/migrate reroute
the unswept bucket to the new creator, or does the old vault keep
it? And what does a trade do on a pool whose coin_creator was
never set (zero)?

Sharp results (all three images agree on every step):
- Zero-creator v2 trades SKIP the creator fee entirely: buy_v2
  spends 1,842,321 (not 1,847,796), vault nets 1,833,835 (not
  1,839,310), bucket stays at the seed 123,394. Sell_v2 receipts
  1,807,590 (not 1,802,115). Buy_exact_v2 outs 54,275,823,786
  (not 54,115,018,303 -- the skipped fee stays in the curve
  input, worth ~160M base at this slope).
- Zero-creator legacy trades do NOT tolerate the zero: buy and
  sell both fail 6053 BuybackFeeRecipientNotAuthorized
  (global_config.rs:326) with full rollback.
- set_coin_creator reroutes the bucket: after zero-buy + set
  (metaplex first creator), the OLD vault sweep fails 2006
  ConstraintSeeds (sweep_fees.rs:113) while the NEW vault sweep
  drains exactly the seed 123,394. A second buy after the set
  accrues 5,476 to the bucket and the new vault drains 128,870.
- set-bonding routes the same way (bonding-curve creator), and
  set on an already-set pool is a silent no-op (0 events).
- migrate is gated on the swept bucket: buy -> migrate fails
  6081 CreatorFeesNotSwept (migrate_pool_coin_creator.rs:59);
  after sweep + collect, migrate succeeds and coin_creator
  becomes the sharing-config PDA.
- After migration the creator bucket is collect-blocked: a
  post-migrate buy accrues 5,476, the sharing-vault sweep drains
  it, but collect fails 6048 CreatorVaultMigratedToSharingConfig
  (collect_coin_creator_fee.rs:68) -- the bucket sits in the
  sharing vault ATA, reachable only via pump:distribute_creator_fees.
  The protocol sweep still works after migration.
- Under tf100 the zero-creator skip survives: buy spends
  1,860,845 (not 1,866,375), vault nets 1,833,835, bucket stays
  123,394, and the BuyEvent still reports the pre-tf figures
  (uin 1,842,321, qwlp 1,825,348). Set + sweep + collect under
  tf100 drain the seed with the usual per-hop withholding
  (122,160 / 120,938).

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

from pump_amm_admin_differential import Harness
from pump_amm_liquidity_differential import (
    CONFIG, CONFIG_KEY, EVENT, IDL, PAYER, PROGRAM, RAW, TOKEN, TOKEN22,
    base, f, lp, pool, poolraw, quote, supply, token, transferfee,
    userbase, userlp, userquote, vaultbase, vaultquote,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, volume

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-coin-creator-reassignment-chains-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}

ATA_PROG = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
META_PROG = Pubkey.from_string('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
PUMP = Pubkey.from_string('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P')
FEES_PROG = Pubkey.from_string('pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ')
PAYER_KEY = PAYER.pubkey()
CREATOR = Pubkey.from_bytes(bytes(poolraw[211:243]))
CREATOR0 = Pubkey.from_bytes(bytes([0x11]) * 32)
BC_CREATOR = Pubkey.from_bytes(bytes([0x33]) * 32)
ZERO = Pubkey.default()
META_PDA, _ = Pubkey.find_program_address([b'metadata', bytes(META_PROG), bytes(base)], META_PROG)
BC_PDA, _ = Pubkey.find_program_address([b'bonding-curve', bytes(base)], PUMP)
SHARING_PDA, _ = Pubkey.find_program_address([b'sharing-config', bytes(base)], FEES_PROG)
PROTOCOL = Pubkey.from_bytes(bytes(RAW[57:89]))
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
POOLV2 = Pubkey.find_program_address([b'pool-v2', bytes(base)], PROGRAM)[0]
GVOL = Pubkey.find_program_address([b'global_volume_accumulator'], PROGRAM)[0]
GDISC = bytes(next(x for x in IDL['accounts'] if x['name'] == 'GlobalVolumeAccumulator')['discriminator'])
UVA_DISC = bytes(next(x for x in IDL['accounts'] if x['name'] == 'UserVolumeAccumulator')['discriminator'])
MX = 2**64 - 1
S_ASIS = 4194352106721
RENT22 = 2157600


def ata22(owner):
    return Pubkey.find_program_address([bytes(owner), bytes(TOKEN22), bytes(quote)], ATA_PROG)[0]


def vault_of(creator):
    return Pubkey.find_program_address([b'creator_vault', bytes(creator)], PROGRAM)[0]


PROTO22 = ata22(PROTOCOL)
CREAT22 = ata22(vault_of(CREATOR))
DEST22 = ata22(CREATOR)
BB22 = ata22(BB_OWNER)
UVA22 = ata22(volume)
NEWVAULT = vault_of(CREATOR0)
NEWVAULT22 = ata22(NEWVAULT)
NEWDEST22 = ata22(CREATOR0)
BCVAULT = vault_of(BC_CREATOR)
BCVAULT22 = ata22(BCVAULT)
BCDEST22 = ata22(BC_CREATOR)
SHVAULT = vault_of(SHARING_PDA)
SHVAULT22 = ata22(SHVAULT)
SHDEST22 = ata22(SHARING_PDA)
ZEROVAULT = vault_of(ZERO)
ZEROVAULT22 = ata22(ZEROVAULT)
ZERODEST22 = ata22(ZERO)

V2_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
           vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
           buyback, EVENT, PROGRAM]
SWP_KEYS_P = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, PROTOCOL, PROTO22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SET_KEYS = [pool, META_PDA, BC_PDA, EVENT, PROGRAM]
MIG_KEYS = [pool, SHARING_PDA, EVENT, PROGRAM]


def swc_keys(creator):
    v = vault_of(creator)
    return [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, v, ata22(v),
            Pubkey.default(), ATA_PROG, EVENT, PROGRAM]


def col_keys(creator):
    v = vault_of(creator)
    return [quote, TOKEN22, creator, v, ata22(v), ata22(creator), EVENT, PROGRAM]


def buy_keys(creator):
    v = vault_of(creator)
    return [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote, vaultbase, vaultquote,
            PROTOCOL, PROTO22, TOKEN, TOKEN22, Pubkey.default(), ATA_PROG, EVENT, PROGRAM,
            ata22(v), v, GVOL, volume, feeconfig, FEES]


def leg_keys(creator):
    v = vault_of(creator)
    return [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote, vaultbase, vaultquote,
            PROTOCOL, PROTO22, TOKEN, TOKEN22, Pubkey.default(), ATA_PROG, EVENT, PROGRAM,
            ata22(v), v, feeconfig, FEES]


LEG_REM = [AccountMeta(POOLV2, False, False), AccountMeta(BB_OWNER, False, False),
           AccountMeta(BB22, False, True)]
WATCH = [PAYER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTO22, CREAT22, DEST22, BB22, UVA22, NEWVAULT22, NEWDEST22,
         BCVAULT22, BCDEST22, SHVAULT22, SHDEST22, ZEROVAULT22, ZERODEST22,
         META_PDA, BC_PDA, SHARING_PDA, vault_of(CREATOR), NEWVAULT, BCVAULT,
         SHVAULT, ZEROVAULT]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTO22, "creatorata": CREAT22, "dest": DEST22, "bbata": BB22,
            "uvata": UVA22, "newvault": NEWVAULT22, "newdest": NEWDEST22,
            "bcvault": BCVAULT22, "bcdest": BCDEST22, "shvault": SHVAULT22,
            "shdest": SHDEST22, "zerovault": ZEROVAULT22, "zerodest": ZERODEST22}
SWP_DISC = "82a42461e48287a5"
COL_DISC = "e8f5c2eeeada3a59"
BUY_DISC = "67f4521f2cf57777"
SELL_DISC = "3e2f370aa503dc2a"
SET_DISC = "966bc77b7ccf66e4"
SETBC_DISC = "f2e7eb664163bdd3"
MIG_DISC = "aadd52c793a5f72e"
BC_DISC = bytes([23, 183, 248, 55, 96, 216, 172, 96])
SH_DISC = bytes([216, 74, 9, 0, 56, 140, 93, 75])


def sha(data):
    return hashlib.sha256(data).hexdigest()


def s32(b):
    return struct.pack('<I', len(b)) + b


def metadata(creators, key=4):
    d = bytearray()
    d += bytes([key])
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
    d += bytes([0]) + bytes([0]) + bytes([1, 1]) + bytes([0]) + bytes([0]) + bytes([0])
    return bytes(d)


def bonding_curve(creator=BC_CREATOR):
    d = bytearray(BC_DISC)
    d += struct.pack('<QQQQQ', 10**9, 10**9, 10**9, 10**9, 10**12)
    d += bytes([0]) + bytes(creator) + bytes([0, 0])
    return bytes(d)


def sharing(admin, mint, status=1, revoked=0):
    d = bytearray(80)
    d[0:8] = SH_DISC
    d[10] = status
    d[11:43] = bytes(mint)
    d[43:75] = bytes(admin)
    d[75] = revoked
    d[76:80] = struct.pack('<I', 0)
    return bytes(d)


def t22acct(owner, amount, withheld=0):
    data = bytearray(165)
    data[0:32] = bytes(quote)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) + struct.pack("<HHQ", 2, 8, withheld)


def setup_vm(binary, setup):
    h = Harness(binary)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, p in [(TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                   (TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so"),
                   (FEES, "evidence/original/pump_fees/deployed.so"),
                   (ATA_PROG, "evidence/dependencies/associated_token/deployed.so")]:
        vm.add_program_from_file(pid, ROOT / p)
    glob = bytearray(RAW)
    glob[56] = 0
    vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
    for n, row in f["accounts"].items():
        vm.set_account(Pubkey.from_string(row["address"]),
                       Account(row["lamports"], base64.b64decode(row["data_base64"]),
                               Pubkey.from_string(row["owner"])))
    pd = bytearray(poolraw)
    if setup.get("zero"):
        pd[211:243] = bytes(32)
    vm.set_account(pool, Account(f["accounts"]["pool"]["lamports"], bytes(pd), PROGRAM))
    mint = struct.pack("<I", 1) + bytes(pool) + struct.pack("<Q", supply) + bytes([9, 1]) + bytes(36)
    vm.set_account(lp, Account(10**9, mint, TOKEN22))
    vm.set_account(userbase, Account(10**9, token(base, PAYER_KEY, 10**15, False), TOKEN))
    vm.set_account(userquote, Account(10**15 + 2039280, token(quote, PAYER_KEY, 10**15, True), TOKEN))
    vm.set_account(userlp, Account(10**9, token(lp, PAYER_KEY, supply // 2, False), TOKEN22))
    vm.set_account(GVOL, Account(10**9, GDISC + struct.pack('<qqq', 0, 0, 86400) + bytes(base) + bytes(480), PROGRAM))
    vm.set_account(PROTOCOL, Account(10**9, b'', Pubkey.default()))
    for v in (vault_of(CREATOR), NEWVAULT, BCVAULT, SHVAULT, ZEROVAULT):
        vm.set_account(v, Account(10**9, b'', Pubkey.default()))
    vm.set_account(POOLV2, Account(10**9, b'', Pubkey.default()))
    vm.set_account(BB_OWNER, Account(10**9, b'', Pubkey.default()))
    transferfee(quote, setup.get("bps", 0), MX)(h, [])
    for cr in (CREATOR, CREATOR0, BC_CREATOR, SHARING_PDA):
        vm.set_account(ata22(vault_of(cr)), Account(RENT22, t22acct(vault_of(cr), 0), TOKEN22))
        vm.set_account(ata22(cr), Account(RENT22, t22acct(cr, 0), TOKEN22))
    vm.set_account(PROTO22, Account(RENT22, t22acct(PROTOCOL, 0), TOKEN22))
    vm.set_account(BB22, Account(RENT22, t22acct(BB_OWNER, 0), TOKEN22))
    vm.set_account(ZEROVAULT22, Account(RENT22, t22acct(ZEROVAULT, 0), TOKEN22))
    if setup.get("zero_dest"):
        vm.set_account(ZERODEST22, Account(RENT22, t22acct(ZERO, 0), TOKEN22))
    vm.set_account(volume, Account(0, b"", Pubkey.default()))
    vm.set_account(UVA22, Account(RENT22, t22acct(volume, 0), TOKEN22))
    vm.set_account(META_PDA, Account(10**9, metadata(setup.get("meta", [CREATOR0])), META_PROG))
    vm.set_account(BC_PDA, Account(10**9, bonding_curve(), PUMP))
    if setup.get("sharing") is not None:
        vm.set_account(SHARING_PDA, Account(10**9, sharing(setup["sharing"], bytes(base)), FEES_PROG))
    h._bps = setup.get("bps", 0)
    return h


def snap(vm):
    out = {}
    for k in WATCH:
        a = vm.get_account(k)
        out[str(k)] = None if a is None else {
            "lamports": a.lamports, "owner": str(a.owner),
            "data_hex": bytes(a.data).hex()}
    return out


def tok_amount(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", raw, 64)[0] if len(raw) >= 72 else None


def tok_withheld(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    if len(raw) >= 182:
        return struct.unpack_from("<Q", raw, 174)[0]
    if len(raw) >= 178:
        return struct.unpack_from("<Q", raw, 170)[0]
    return None


def tok_delta(rec, key):
    b = rec["before"][str(key)]
    a = rec["after"][str(key)]
    return (tok_amount(a) or 0) - (tok_amount(b) or 0)


def lam_delta(rec, key):
    b = rec["before"][str(key)]
    a = rec["after"][str(key)]
    return (a["lamports"] if a else 0) - (b["lamports"] if b else 0)


def pool_state(entry):
    d = bytes.fromhex(entry["data_hex"])
    return (int.from_bytes(d[245:261], "little", signed=True),
            struct.unpack_from("<Q", d, 271)[0],
            struct.unpack_from("<Q", d, 279)[0],
            struct.unpack_from("<Q", d, 203)[0])


def vol_state(entry):
    if entry is None:
        return None
    raw = bytes.fromhex(entry["data_hex"])
    return {"lamports": entry["lamports"], "len": len(raw),
            "user": raw[8:40].hex()}


def ev_data(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    return base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())


def u64(raw, off):
    return struct.unpack_from("<Q", raw, off)[0]


def decode_event(kind, rec):
    raw = ev_data(rec["logs"])
    if raw is None:
        return None
    if kind == "buy":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_bps": u64(raw, 72),
                "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
                "proto_fee": u64(raw, 96), "qwlp": u64(raw, 104),
                "uin": u64(raw, 112)}
    if kind == "sell":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_bps": u64(raw, 72),
                "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
                "proto_fee": u64(raw, 96), "quote": u64(raw, 104),
                "uout": u64(raw, 112)}
    if kind == "buyx":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "out": u64(raw, 16), "quote_in": u64(raw, 64),
                "lp_bps": u64(raw, 72), "lp_fee": u64(raw, 80),
                "proto_bps": u64(raw, 88), "proto_fee": u64(raw, 96),
                "qwlp": u64(raw, 104), "uin": u64(raw, 112)}
    if kind in ("swp", "swc"):
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "recipient": raw[112:144].hex(),
                "amount": u64(raw, 176), "bucket": raw[184]}
    if kind == "col":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "creator": raw[16:48].hex(), "fee": u64(raw, 48),
                "vault_ata": raw[56:88].hex(), "dest": raw[88:120].hex()}
    if kind == "set":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "creator": raw[112:144].hex()}
    if kind == "mig":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "old": raw[112:144].hex(), "new": raw[144:176].hex()}
    return None


def check(cond, msg):
    if not cond:
        raise AssertionError(msg)


def disc(name):
    return bytes(next(x for x in IDL["instructions"] if x["name"] == name)["discriminator"])


def do_step(h, kind, args):
    if kind == "buy":
        name, keys, data, rem = "buy_v2", V2_KEYS, disc("buy_v2") + struct.pack("<QQ", args[0], MX), []
    elif kind == "sell":
        name, keys, data, rem = "sell_v2", V2_KEYS, disc("sell_v2") + struct.pack("<QQ", args[0], 0), []
    elif kind == "buyx":
        name, keys, data, rem = ("buy_exact_quote_in_v2", V2_KEYS,
                                 disc("buy_exact_quote_in_v2") + struct.pack("<QQ", args[0], args[1]), [])
    elif kind == "swp":
        name, keys, data, rem = "sweep_protocol_fee", SWP_KEYS_P, disc("sweep_protocol_fee"), []
    elif kind == "swc":
        name, keys, data, rem = "sweep_creator_fee", swc_keys(args[0]), disc("sweep_creator_fee"), []
    elif kind == "col":
        name, keys, data, rem = "collect_coin_creator_fee", col_keys(args[0]), disc("collect_coin_creator_fee"), []
    elif kind == "set":
        name, keys, data, rem = "set_coin_creator", SET_KEYS, disc("set_coin_creator"), []
    elif kind == "mig":
        name, keys, data, rem = "migrate_pool_coin_creator", MIG_KEYS, disc("migrate_pool_coin_creator"), []
    elif kind == "legbuy":
        name, keys, data, rem = "buy", buy_keys(args[2]), disc("buy") + struct.pack("<QQ", args[0], args[1]) + b"\0", LEG_REM
    elif kind == "legsell":
        name, keys, data, rem = "sell", leg_keys(args[2]), disc("sell") + struct.pack("<QQ", args[0], args[1]), LEG_REM
    else:
        raise ValueError(kind)
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])] + list(rem)
    if kind in ("buy", "sell", "buyx"):
        metas[10] = AccountMeta(TOKEN22, False, False)
        metas[14] = AccountMeta(BB22, False, True)
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, data, metas)], PAYER_KEY, [PAYER], h.vm.latest_blockhash())
    assert tx.verify_with_results() and all(tx.verify_with_results())
    before = snap(h.vm)
    r = h.vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    logs = meta.logs()
    return {"transaction_base64": base64.b64encode(bytes(tx)).decode(),
            "error": str(r.err()) if failed else None, "logs": logs,
            "events": [l for l in logs if l.startswith("Program data: ")],
            "before": before, "after": snap(h.vm),
            "site": next((l for l in logs if "thrown in" in l or "caused by account" in l), None)}


def E(dPAYER, deltas, pool_after, volume, event=None, events=1, error=None,
      rollback=False, wh_after=None, lam_deltas=None):
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after),
            "volume": volume, "event": event, "events": events, "error": error,
            "rollback": rollback, "wh_after": wh_after or {},
            "lam_deltas": lam_deltas or {}}


def P(vq, pf, cf, sup=S_ASIS):
    return [vq, pf, cf, sup]


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


def COL_EV(creator, fee, vault_ata, dest):
    return {"disc": COL_DISC, "len": 120, "timestamp": 1234567890,
            "creator": bytes(creator).hex(), "fee": fee,
            "vault_ata": bytes(vault_ata).hex(), "dest": bytes(dest).hex()}


def BUY_EV(uin, curve=1824983, lp_fee=365, proto_fee=16973, qwlp=1825348):
    return {"disc": BUY_DISC, "len": 500, "curve": curve, "lp_bps": 2,
            "lp_fee": lp_fee, "proto_bps": 93, "proto_fee": proto_fee,
            "qwlp": qwlp, "uin": uin}


def SELL_EV_Z():
    return {"disc": SELL_DISC, "len": 449, "curve": 1824927, "lp_bps": 2,
            "lp_fee": 365, "proto_bps": 93, "proto_fee": 16972,
            "quote": 1824562, "uout": 1807590}


def BUYX_EV_Z():
    return {"disc": BUY_DISC, "len": 515, "out": 54275823786, "quote_in": 10**7,
            "lp_bps": 2, "lp_fee": 1982, "proto_bps": 93, "proto_fee": 92125,
            "qwlp": 9907875, "uin": 9905893}


def SET_EV(creator, disc_hex=SET_DISC):
    return {"disc": disc_hex, "len": 144, "creator": bytes(creator).hex()}


def MIG_EV(old, new):
    return {"disc": MIG_DISC, "len": 176, "old": bytes(old).hex(), "new": bytes(new).hex()}


def FAIL(pool_after, volume, code):
    return E(-5000, {}, pool_after, volume, events=0, error=code, rollback=True)


VOL_ABSENT = None
VOL_CREATED = {"lamports": 1844400, "len": 137, "user": bytes(PAYER_KEY).hex()}
P0 = P(-125882, 2488, 123394)
P_ZERO_BUY = P(-134369, 10975, 123394)
P_BUY = P(-139844, 10975, 128869)
P_ZERO_SELL = P(-134368, 10974, 123394)
P_ZERO_BUYX = P(-171945, 48551, 123394)
P_SWEPT = P(-10975, 10975, 0)
P_BUY2 = P(-148332, 19462, 128870)
P_SWEPT2 = P(-19462, 19462, 0)
P_POSTMIG = P(-24938, 19462, 5476)
P_PROTO_SWEPT = P(-5476, 0, 5476)
P_ZEROED = P(0, 0, 0)


def C(dPAYER, deltas, pool_after, volume, event=None, wh_after=None):
    # collect moves tokens only; lamports stay put (unlike sweep)
    return E(dPAYER, deltas, pool_after, volume, event=event, wh_after=wh_after, lam_deltas={})


def N(dPAYER, deltas, pool_after, volume, event=None, events=1, wh_after=None):
    lam = {k: v for k, v in deltas.items() if k not in ("userbase", "vaultbase", "userlp")}
    return E(dPAYER, deltas, pool_after, volume, event=event, events=events,
             wh_after=wh_after, lam_deltas=lam)


CASES = [
    {"label": "a-zero-buy-v2-fee-skipped", "setup": {"zero": True, "bps": 0}, "steps": [
        ("buy", (10**10,), N(-1849400, {"userbase": 10**10, "userquote": -1842321,
         "vaultbase": -10**10, "vaultquote": 1833835, "bbata": 8486},
         P_ZERO_BUY, VOL_CREATED, event=BUY_EV(1842321))),
    ]},
    {"label": "a-zero-sell-v2-fee-skipped", "setup": {"zero": True, "bps": 0}, "steps": [
        ("sell", (10**10,), N(-1849400, {"userbase": -10**10, "userquote": 1807590,
         "vaultbase": 10**10, "vaultquote": -1816076, "bbata": 8486},
         P_ZERO_SELL, VOL_CREATED, event=SELL_EV_Z())),
    ]},
    {"label": "a-zero-buyx-v2-fee-skipped", "setup": {"zero": True, "bps": 0}, "steps": [
        ("buyx", (10**7, 1), N(-1849400, {"userbase": 54275823786, "userquote": -10**7,
         "vaultbase": -54275823786, "vaultquote": 9953938, "bbata": 46062},
         P_ZERO_BUYX, VOL_CREATED, event=BUYX_EV_Z())),
    ]},
    {"label": "a-zero-buy-sweep-collect-zero", "setup": {"zero": True, "bps": 0, "zero_dest": True}, "steps": [
        ("buy", (10**10,), N(-1849400, {"userbase": 10**10, "userquote": -1842321,
         "vaultbase": -10**10, "vaultquote": 1833835, "bbata": 8486},
         P_ZERO_BUY, VOL_CREATED, event=BUY_EV(1842321))),
        ("swc", (ZERO,), N(-5000, {"vaultquote": -123394, "zerovault": 123394},
         P_SWEPT, VOL_CREATED, event=SWP_EV(123394, 1, ZEROVAULT))),
        ("col", (ZERO,), C(-5000, {"zerovault": -123394, "zerodest": 123394},
         P_SWEPT, VOL_CREATED, event=COL_EV(ZERO, 123394, ZEROVAULT22, ZERODEST22))),
    ]},
    {"label": "a-zero-legacy-buy-sell-rejected", "setup": {"zero": True, "bps": 0}, "steps": [
        ("legbuy", (10**10, 10**12, ZERO), FAIL(P0, VOL_ABSENT, "6053")),
        ("legsell", (10**9, 0, ZERO), FAIL(P0, VOL_ABSENT, "6053")),
    ]},
    {"label": "a-zero-collect-dest-missing", "setup": {"zero": True, "bps": 0}, "steps": [
        ("buy", (10**10,), N(-1849400, {"userbase": 10**10, "userquote": -1842321,
         "vaultbase": -10**10, "vaultquote": 1833835, "bbata": 8486},
         P_ZERO_BUY, VOL_CREATED, event=BUY_EV(1842321))),
        ("swc", (ZERO,), N(-5000, {"vaultquote": -123394, "zerovault": 123394},
         P_SWEPT, VOL_CREATED, event=SWP_EV(123394, 1, ZEROVAULT))),
        ("col", (ZERO,), FAIL(P_SWEPT, VOL_CREATED, "3012")),
    ]},
    {"label": "b-zero-buy-set-metaplex-sweep-routes-new", "setup": {"zero": True, "bps": 0, "meta": [CREATOR0]}, "steps": [
        ("buy", (10**10,), N(-1849400, {"userbase": 10**10, "userquote": -1842321,
         "vaultbase": -10**10, "vaultquote": 1833835, "bbata": 8486},
         P_ZERO_BUY, VOL_CREATED, event=BUY_EV(1842321))),
        ("set", (), N(-5000, {}, P_ZERO_BUY, VOL_CREATED, event=SET_EV(CREATOR0))),
        ("swc", (CREATOR,), FAIL(P_ZERO_BUY, VOL_CREATED, "2006")),
        ("swc", (CREATOR0,), N(-5000, {"vaultquote": -123394, "newvault": 123394},
         P_SWEPT, VOL_CREATED, event=SWP_EV(123394, 1, NEWVAULT))),
        ("col", (CREATOR0,), C(-5000, {"newvault": -123394, "newdest": 123394},
         P_SWEPT, VOL_CREATED, event=COL_EV(CREATOR0, 123394, NEWVAULT22, NEWDEST22))),
    ]},
    {"label": "b-zero-buy-set-buy-sweep-collect-new", "setup": {"zero": True, "bps": 0, "meta": [CREATOR0]}, "steps": [
        ("buy", (10**10,), N(-1849400, {"userbase": 10**10, "userquote": -1842321,
         "vaultbase": -10**10, "vaultquote": 1833835, "bbata": 8486},
         P_ZERO_BUY, VOL_CREATED, event=BUY_EV(1842321))),
        ("set", (), N(-5000, {}, P_ZERO_BUY, VOL_CREATED, event=SET_EV(CREATOR0))),
        ("buy", (10**10,), N(-5000, {"userbase": 10**10, "userquote": -1847852,
         "vaultbase": -10**10, "vaultquote": 1839366, "bbata": 8486},
         P_BUY2, VOL_CREATED, event=BUY_EV(1847852, curve=1825037, lp_fee=366, qwlp=1825403))),
        ("swc", (CREATOR0,), N(-5000, {"vaultquote": -128870, "newvault": 128870},
         P_SWEPT2, VOL_CREATED, event=SWP_EV(128870, 1, NEWVAULT))),
        ("col", (CREATOR0,), C(-5000, {"newvault": -128870, "newdest": 128870},
         P_SWEPT2, VOL_CREATED, event=COL_EV(CREATOR0, 128870, NEWVAULT22, NEWDEST22))),
    ]},
    {"label": "b-set-bonding-buy-sweep-collect", "setup": {"zero": True, "bps": 0, "meta": None}, "steps": [
        ("set", (), N(-5000, {}, P0, VOL_ABSENT, event=SET_EV(BC_CREATOR, SETBC_DISC))),
        ("buy", (10**10,), N(-1849400, {"userbase": 10**10, "userquote": -1847796,
         "vaultbase": -10**10, "vaultquote": 1839310, "bbata": 8486},
         P_BUY, VOL_CREATED, event=BUY_EV(1847796))),
        ("swc", (BC_CREATOR,), N(-5000, {"vaultquote": -128869, "bcvault": 128869},
         P_SWEPT, VOL_CREATED, event=SWP_EV(128869, 1, BCVAULT))),
        ("col", (BC_CREATOR,), C(-5000, {"bcvault": -128869, "bcdest": 128869},
         P_SWEPT, VOL_CREATED, event=COL_EV(BC_CREATOR, 128869, BCVAULT22, BCDEST22))),
    ]},
    {"label": "b-set-already-set-buy-sweep-collect", "setup": {"bps": 0, "meta": [CREATOR0]}, "steps": [
        ("set", (), N(-5000, {}, P0, VOL_ABSENT, events=0)),
        ("buy", (10**10,), N(-1849400, {"userbase": 10**10, "userquote": -1847796,
         "vaultbase": -10**10, "vaultquote": 1839310, "bbata": 8486},
         P_BUY, VOL_CREATED, event=BUY_EV(1847796))),
        ("swc", (CREATOR,), N(-5000, {"vaultquote": -128869, "creatorata": 128869},
         P_SWEPT, VOL_CREATED, event=SWP_EV(128869, 1, vault_of(CREATOR)))),
        ("col", (CREATOR,), C(-5000, {"creatorata": -128869, "dest": 128869},
         P_SWEPT, VOL_CREATED, event=COL_EV(CREATOR, 128869, CREAT22, DEST22))),
    ]},
    {"label": "c-buy-migrate-gate-sweep-collect-migrate", "setup": {"bps": 0, "sharing": CREATOR}, "steps": [
        ("buy", (10**10,), N(-1849400, {"userbase": 10**10, "userquote": -1847796,
         "vaultbase": -10**10, "vaultquote": 1839310, "bbata": 8486},
         P_BUY, VOL_CREATED, event=BUY_EV(1847796))),
        ("mig", (), FAIL(P_BUY, VOL_CREATED, "6081")),
        ("swc", (CREATOR,), N(-5000, {"vaultquote": -128869, "creatorata": 128869},
         P_SWEPT, VOL_CREATED, event=SWP_EV(128869, 1, vault_of(CREATOR)))),
        ("col", (CREATOR,), C(-5000, {"creatorata": -128869, "dest": 128869},
         P_SWEPT, VOL_CREATED, event=COL_EV(CREATOR, 128869, CREAT22, DEST22))),
        ("mig", (), N(-5000, {}, P_SWEPT, VOL_CREATED, event=MIG_EV(CREATOR, SHARING_PDA))),
    ]},
    {"label": "c-migrate-then-trade-sweep-collect-blocked", "setup": {"bps": 0, "sharing": CREATOR}, "steps": [
        ("buy", (10**10,), N(-1849400, {"userbase": 10**10, "userquote": -1847796,
         "vaultbase": -10**10, "vaultquote": 1839310, "bbata": 8486},
         P_BUY, VOL_CREATED, event=BUY_EV(1847796))),
        ("swc", (CREATOR,), N(-5000, {"vaultquote": -128869, "creatorata": 128869},
         P_SWEPT, VOL_CREATED, event=SWP_EV(128869, 1, vault_of(CREATOR)))),
        ("col", (CREATOR,), C(-5000, {"creatorata": -128869, "dest": 128869},
         P_SWEPT, VOL_CREATED, event=COL_EV(CREATOR, 128869, CREAT22, DEST22))),
        ("mig", (), N(-5000, {}, P_SWEPT, VOL_CREATED, event=MIG_EV(CREATOR, SHARING_PDA))),
        ("buy", (10**10,), N(-5000, {"userbase": 10**10, "userquote": -1847852,
         "vaultbase": -10**10, "vaultquote": 1839366, "bbata": 8486},
         P_POSTMIG, VOL_CREATED, event=BUY_EV(1847852, curve=1825037, lp_fee=366, qwlp=1825403))),
        ("swp", (), N(-5000, {"vaultquote": -19462, "protoata": 19462},
         P_PROTO_SWEPT, VOL_CREATED, event=SWP_EV(19462, 0, PROTOCOL))),
        ("swc", (SHARING_PDA,), N(-5000, {"vaultquote": -5476, "shvault": 5476},
         P_ZEROED, VOL_CREATED, event=SWP_EV(5476, 1, SHVAULT))),
        ("col", (SHARING_PDA,), FAIL(P_ZEROED, VOL_CREATED, "6048")),
    ]},
    {"label": "c-zero-buy-set-sweep-collect-migrate", "setup": {"zero": True, "bps": 0, "meta": [CREATOR0], "sharing": CREATOR0}, "steps": [
        ("buy", (10**10,), N(-1849400, {"userbase": 10**10, "userquote": -1842321,
         "vaultbase": -10**10, "vaultquote": 1833835, "bbata": 8486},
         P_ZERO_BUY, VOL_CREATED, event=BUY_EV(1842321))),
        ("set", (), N(-5000, {}, P_ZERO_BUY, VOL_CREATED, event=SET_EV(CREATOR0))),
        ("swc", (CREATOR0,), N(-5000, {"vaultquote": -123394, "newvault": 123394},
         P_SWEPT, VOL_CREATED, event=SWP_EV(123394, 1, NEWVAULT))),
        ("col", (CREATOR0,), C(-5000, {"newvault": -123394, "newdest": 123394},
         P_SWEPT, VOL_CREATED, event=COL_EV(CREATOR0, 123394, NEWVAULT22, NEWDEST22))),
        ("mig", (), N(-5000, {}, P_SWEPT, VOL_CREATED, event=MIG_EV(CREATOR0, SHARING_PDA))),
    ]},
    {"label": "c-buy-migrate-bad-admin-sweep-collect", "setup": {"bps": 0, "sharing": CREATOR0}, "steps": [
        ("buy", (10**10,), N(-1849400, {"userbase": 10**10, "userquote": -1847796,
         "vaultbase": -10**10, "vaultquote": 1839310, "bbata": 8486},
         P_BUY, VOL_CREATED, event=BUY_EV(1847796))),
        ("mig", (), FAIL(P_BUY, VOL_CREATED, "6046")),
        ("swc", (CREATOR,), N(-5000, {"vaultquote": -128869, "creatorata": 128869},
         P_SWEPT, VOL_CREATED, event=SWP_EV(128869, 1, vault_of(CREATOR)))),
        ("col", (CREATOR,), C(-5000, {"creatorata": -128869, "dest": 128869},
         P_SWEPT, VOL_CREATED, event=COL_EV(CREATOR, 128869, CREAT22, DEST22))),
    ]},
    {"label": "d-zero-buy-tf100-fee-skipped", "setup": {"zero": True, "bps": 100}, "steps": [
        ("buy", (10**10,), E(-1849400, {"userbase": 10**10, "userquote": -1860845,
         "vaultbase": -10**10, "vaultquote": 1833835, "bbata": 8401},
         P_ZERO_BUY, VOL_CREATED, event=BUY_EV(1842321),
         wh_after={"vaultquote": 18524, "bbata": 85},
         lam_deltas={"userquote": -1860845, "vaultquote": 1852359, "bbata": 8486})),
    ]},
    {"label": "d-zero-buy-tf100-set-sweep-collect-new", "setup": {"zero": True, "bps": 100, "meta": [CREATOR0]}, "steps": [
        ("buy", (10**10,), E(-1849400, {"userbase": 10**10, "userquote": -1860845,
         "vaultbase": -10**10, "vaultquote": 1833835, "bbata": 8401},
         P_ZERO_BUY, VOL_CREATED, event=BUY_EV(1842321),
         wh_after={"vaultquote": 18524, "bbata": 85},
         lam_deltas={"userquote": -1860845, "vaultquote": 1852359, "bbata": 8486})),
        ("set", (), N(-5000, {}, P_ZERO_BUY, VOL_CREATED, event=SET_EV(CREATOR0))),
        ("swc", (CREATOR0,), E(-5000, {"vaultquote": -123394, "newvault": 122160},
         P_SWEPT, VOL_CREATED, event=SWP_EV(123394, 1, NEWVAULT),
         wh_after={"newvault": 1234},
         lam_deltas={"vaultquote": -123394, "newvault": 123394})),
        ("col", (CREATOR0,), E(-5000, {"newvault": -122160, "newdest": 120938},
         P_SWEPT, VOL_CREATED, event=COL_EV(CREATOR0, 122160, NEWVAULT22, NEWDEST22),
         wh_after={"newvault": 1234, "newdest": 1222},
         lam_deltas={})),
    ]},
]


def run_case(case, image_name, binary):
    h = setup_vm(binary, case["setup"])
    out = []
    for kind, args, exp in case["steps"]:
        rec = do_step(h, kind, args)
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
        for role, want in exp["deltas"].items():
            got_d = tok_delta(rec, ROLE_KEY[role])
            check(got_d == want, f"{tag}: delta {role} {got_d} != {want}")
        for role, want in exp["lam_deltas"].items():
            got_d = lam_delta(rec, ROLE_KEY[role])
            check(got_d == want, f"{tag}: lam_delta {role} {got_d} != {want}")
        for role, want in exp["wh_after"].items():
            got_e = rec["after"][str(ROLE_KEY[role])]
            got_w = tok_withheld(got_e)
            check(got_w == want, f"{tag}: wh_after {role} {got_w} != {want}")
        got_pool = pool_state(rec["after"][str(pool)])
        check(list(got_pool) == exp["pool_after"],
              f"{tag}: pool {got_pool} != {exp['pool_after']}")
        got_vol = vol_state(rec["after"][str(volume)])
        check(got_vol == exp["volume"], f"{tag}: volume {got_vol} != {exp['volume']}")
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

        def surface(recs):
            out = []
            for rec in recs:
                def strip(snap):
                    d = dict(snap)
                    if d.get(str(PAYER_KEY)) is not None:
                        d[str(PAYER_KEY)] = dict(d[str(PAYER_KEY)])
                        d[str(PAYER_KEY)]["lamports"] = 0
                    return d
                out.append({"step": rec["step"], "error": rec["error"],
                            "events": len(rec["events"]),
                            "before": strip(rec["before"]), "after": strip(rec["after"])})
            return out
        base = surface(per_image["original"])
        for image_name in ("control", "candidate"):
            check(surface(per_image[image_name]) == base,
                  f"{case['label']}: {image_name} observed surface differs from original")
            for rec in per_image[image_name]:
                receipts.append(rec)
        for rec in per_image["original"]:
            receipts.append(rec)
        # keep receipt order deterministic: original first per case is fine;
        # receipts were appended control/candidate before original above, reorder:
        report_cases.append({"label": case["label"], "setup": {k: (str(v) if not isinstance(v, list) else [str(x) for x in v]) for k, v in case["setup"].items()},
                             "steps": [e for _, _, e in case["steps"]],
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
