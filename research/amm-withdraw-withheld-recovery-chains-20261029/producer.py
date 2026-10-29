#!/usr/bin/env python3
"""Build research/amm-withdraw-withheld-recovery-chains-20261029 receipts.

3rd run packet #28: Token-2022 withdraw-withheld recovery of the
stranded balances prior packets documented. 3rd #5 pinned that each
sweep/collect hop strands its withheld balance in its own ATA and
noted only a withdraw-withheld path (not a pump-amm instruction)
could ever move it -- but that path was never executed. 3rd #19
then showed the same stranding across deposit/withdraw/trade legs
under tf. This packet executes the recovery on those exact
balances: sweep -> collect -> WithdrawWithheldTokensFromAccounts,
plus the harvest -> WithdrawWithheldTokensFromMint route, and the
authority, mint-binding, and tolerance edges around them.

The mint's withdraw_withheld_authority is synthesized to the fee
payer at setup (prior packets zeroed it, which is exactly why
their withheld was stranded -- case b-ww-zero-authority pins that
boundary). Everything else is the same fixture state as 3rd #19.

Sharp results (all three images agree on every step; the
withdraw/harvest instructions run in the Token-2022 program, so
the pump-amm image is irrelevant to those steps, but the full
chains still execute identically):
- Seed recovery: sweep -> collect strands 1,234 (vault ATA) +
  1,222 (dest ATA); one withdraw recovers exactly 2,456 into a
  fresh ATA, both sources' withheld -> 0, amounts otherwise
  untouched, no lamports moved (payer fee 5,000 only).
- Destination need not be fresh: withdrawing into the vault ATA
  itself credits it 2,456 (0 + 1,234 + 1,222).
- tf5000 scale: 61,697 + 30,849 = 92,546 recovered.
- Authority gates: wrong signer -> Token-2022 custom error 4
  with full rollback, then the correct signer recovers; zeroed
  authority (prior packets' setup) -> custom error 29, stranded;
  harvest on a zero-authority mint still strands the mint
  balance (withdraw-from-mint -> custom 29); payer != authority
  with the authority not signing -> MissingRequiredSignature.
- Harvest route: harvest moves 2,456 into the mint's
  withheld_amount (accounts -> 0), withdraw-from-mint moves it
  to the destination (mint -> 0). Withdraw-from-mint on a zero
  mint balance succeeds with 0 moved.
- Idempotency: a second withdraw succeeds with 0 moved; zero
  sources succeeds with 0 moved; a duplicated source is counted
  once (2,456, not 3,690).
- Tolerance: an extension-less source and a wrong-mint source
  are silently skipped (no error, their balances untouched);
  only the destination's mint is enforced: a wrong-mint
  destination -> custom error 3, a Token-owned destination ->
  IncorrectProgramId, both with full rollback.
- Trade/liquidity legs: buy -> sweep -> collect -> withdraw
  recovers 18,579 (vault) + 85 (buyback) + 1,289 (vault ATA) +
  1,276 (dest) = 21,229; deposit -> withdraw recovers the vault's
  296,085; withdraw -> withdraw recovers the user's 293,125;
  protocol sweep -> withdraw recovers 25 even though the
  protocol net itself is not collectible.
- Sweep lamports follow the gross: seed sweep credits +123,394
  lamports to the recipient ATA (vault -123,394); bucket sweep
  +128,869; protocol sweep +2,488. Collect and withdraw move no
  lamports at all.

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
from types import SimpleNamespace

import os
sys.path.insert(0, str(Path.home() / "workspace/pumpfun-sparse/scripts"))
os.chdir(Path.home() / "workspace/pumpfun-sparse")
from solders.account import Account
from solders.clock import Clock
from solders.instruction import AccountMeta, Instruction
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

from pump_amm_admin_differential import Harness, PAYER, OUTSIDER
from pump_amm_liquidity_differential import (
    CONFIG, CONFIG_KEY, EVENT, IDL, PROGRAM, RAW, TOKEN, TOKEN22,
    base, f, lp, pool, poolraw, quote, supply, token, transferfee,
    userbase, userlp, userquote, vaultbase, vaultquote,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, volume

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-withdraw-withheld-recovery-chains-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}

ATA_PROG = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
PAYER_KEY = PAYER.pubkey()
OUTSIDER_KEY = OUTSIDER.pubkey()
CREATOR = Pubkey.from_bytes(bytes(poolraw[211:243]))
CREATOR_VAULT, _ = Pubkey.find_program_address([b'creator_vault', bytes(CREATOR)], PROGRAM)
PROTOCOL = Pubkey.from_bytes(bytes(RAW[57:89]))
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
MX = 2**64 - 1
VQ0, PF0, CF0 = -125882, 2488, 123394
S_ASIS = 4194352106721
S_DEP9 = S_ASIS + 10**9
S_WD9 = S_ASIS - 10**9
RENT22 = 2157600


def ata22(owner):
    return Pubkey.find_program_address([bytes(owner), bytes(TOKEN22), bytes(quote)], ATA_PROG)[0]


PROTO22 = ata22(PROTOCOL)
CREAT22 = ata22(CREATOR_VAULT)
DEST22 = ata22(CREATOR)
BB22 = ata22(BB_OWNER)
WDEST = ata22(PAYER_KEY)
BASE22 = Pubkey.from_bytes(bytes([78]) * 32)
PLAIN = Pubkey.from_bytes(bytes([77]) * 32)

DEP_KEYS = [pool, CONFIG_KEY, PAYER_KEY, base, quote, lp, userbase, userquote,
            userlp, vaultbase, vaultquote, TOKEN, TOKEN22, EVENT, PROGRAM]
V2_KEYS = [pool, PAYER_KEY, CONFIG_KEY, base, quote, userbase, userquote,
           vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
           buyback, EVENT, PROGRAM]
SWP_KEYS_P = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, PROTOCOL, PROTO22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
SWP_KEYS_C = [PAYER_KEY, CONFIG_KEY, pool, quote, TOKEN22, vaultquote, CREATOR_VAULT, CREAT22,
              Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
COL_KEYS = [quote, TOKEN22, CREATOR, CREATOR_VAULT, CREAT22, DEST22, EVENT, PROGRAM]
WATCH = [PAYER_KEY, OUTSIDER_KEY, pool, base, quote, lp, userbase, userquote, userlp,
         vaultbase, vaultquote, buyback, volume, feeconfig, CONFIG_KEY,
         PROTO22, CREAT22, DEST22, BB22, WDEST, BASE22, PLAIN]
ROLE_KEY = {"userbase": userbase, "userquote": userquote, "userlp": userlp,
            "vaultbase": vaultbase, "vaultquote": vaultquote, "buyback": buyback,
            "protoata": PROTO22, "creatorata": CREAT22, "dest": DEST22, "bbata": BB22,
            "wdest": WDEST, "base22": BASE22, "plain": PLAIN}
DEP_DISC = "78f83d531f8e6b90"
WD_DISC = "1609851aa02c47c0"
SWP_DISC = "82a42461e48287a5"
COL_DISC = "e8f5c2eeeada3a59"
BUY_DISC = "67f4521f2cf57777"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def t22acct(mint, owner, amount, withheld=0):
    data = bytearray(165)
    data[0:32] = bytes(mint)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) + struct.pack("<HHQ", 2, 8, withheld)


def setup_vm(binary, bps, ww_auth=True):
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
    vm.set_account(pool, Account(f["accounts"]["pool"]["lamports"], bytes(poolraw), PROGRAM))
    mint = struct.pack("<I", 1) + bytes(pool) + struct.pack("<Q", supply) + bytes([9, 1]) + bytes(36)
    vm.set_account(lp, Account(10**9, mint, TOKEN22))
    vm.set_account(userbase, Account(10**9, token(base, PAYER_KEY, 10**15, False), TOKEN))
    vm.set_account(userquote, Account(10**15 + 2039280, token(quote, PAYER_KEY, 10**15, True), TOKEN))
    vm.set_account(userlp, Account(10**9, token(lp, PAYER_KEY, supply // 2, False), TOKEN22))
    vm.set_account(volume, Account(0, b"", Pubkey.default()))
    transferfee(quote, bps, MX)(h, [])
    if ww_auth:
        m = vm.get_account(quote)
        d = bytearray(m.data)
        d[202:234] = bytes(PAYER_KEY)
        vm.set_account(quote, Account(m.lamports, bytes(d), TOKEN22))
    vm.set_account(PROTO22, Account(RENT22, t22acct(quote, PROTOCOL, 0), TOKEN22))
    vm.set_account(CREAT22, Account(RENT22, t22acct(quote, CREATOR_VAULT, 0), TOKEN22))
    vm.set_account(DEST22, Account(RENT22, t22acct(quote, CREATOR, 0), TOKEN22))
    vm.set_account(BB22, Account(RENT22, t22acct(quote, BB_OWNER, 0), TOKEN22))
    vm.set_account(WDEST, Account(RENT22, t22acct(quote, PAYER_KEY, 0), TOKEN22))
    vm.set_account(BASE22, Account(RENT22, t22acct(base, PAYER_KEY, 7000, 999), TOKEN22))
    vm.set_account(PLAIN, Account(RENT22, token(quote, PAYER_KEY, 5000, False), TOKEN22))
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


def mint_wh(entry):
    raw = bytes.fromhex(entry["data_hex"])
    return struct.unpack_from("<Q", raw, 234)[0] if len(raw) >= 242 else None


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
    if kind in ("dep", "wd"):
        return {"disc": raw[:8].hex(), "len": len(raw),
                "base": u64(raw, 72), "quote": u64(raw, 80)}
    if kind == "buy":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "curve": u64(raw, 64), "lp_bps": u64(raw, 72),
                "lp_fee": u64(raw, 80), "proto_bps": u64(raw, 88),
                "proto_fee": u64(raw, 96), "qwlp": u64(raw, 104),
                "uin": u64(raw, 112)}
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
    return None


def check(cond, msg):
    if not cond:
        raise AssertionError(msg)


def disc(name):
    return bytes(next(x for x in IDL["instructions"] if x["name"] == name)["discriminator"])


def send_tx(h, ix, signer):
    tx = Transaction.new_signed_with_payer([ix], signer.pubkey(), [signer], h.vm.latest_blockhash())
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


def do_step(h, kind, args):
    if kind == "dep":
        name, keys, data = "deposit", DEP_KEYS, disc("deposit") + struct.pack("<QQQ", *args)
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, next(x for x in IDL["instructions"] if x["name"] == name)["accounts"])]
        return send_tx(h, Instruction(PROGRAM, data, metas), PAYER)
    if kind == "wd":
        name, keys, data = "withdraw", DEP_KEYS, disc("withdraw") + struct.pack("<QQQ", *args)
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, next(x for x in IDL["instructions"] if x["name"] == name)["accounts"])]
        return send_tx(h, Instruction(PROGRAM, data, metas), PAYER)
    if kind == "buy":
        keys = V2_KEYS
        data = disc("buy_v2") + struct.pack("<QQ", args[0], MX)
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, next(x for x in IDL["instructions"] if x["name"] == "buy_v2")["accounts"])]
        metas[10] = AccountMeta(TOKEN22, False, False)
        metas[14] = AccountMeta(BB22, False, True)
        return send_tx(h, Instruction(PROGRAM, data, metas), PAYER)
    if kind == "swp":
        keys, data = SWP_KEYS_P, disc("sweep_protocol_fee")
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, next(x for x in IDL["instructions"] if x["name"] == "sweep_protocol_fee")["accounts"])]
        return send_tx(h, Instruction(PROGRAM, data, metas), PAYER)
    if kind == "swc":
        keys, data = SWP_KEYS_C, disc("sweep_creator_fee")
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, next(x for x in IDL["instructions"] if x["name"] == "sweep_creator_fee")["accounts"])]
        return send_tx(h, Instruction(PROGRAM, data, metas), PAYER)
    if kind == "col":
        keys, data = COL_KEYS, disc("collect_coin_creator_fee")
        metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
                 for k, a in zip(keys, next(x for x in IDL["instructions"] if x["name"] == "collect_coin_creator_fee")["accounts"])]
        return send_tx(h, Instruction(PROGRAM, data, metas), PAYER)
    if kind == "ww":
        dest_role, signer_mode, source_roles = args
        dest = ROLE_KEY[dest_role]
        if signer_mode == "payer":
            signer, payer, auth_meta = PAYER, PAYER, AccountMeta(PAYER_KEY, True, False)
        elif signer_mode == "outsider":
            signer, payer, auth_meta = OUTSIDER, OUTSIDER, AccountMeta(OUTSIDER_KEY, True, False)
        elif signer_mode == "payer_unsigned":
            signer, payer, auth_meta = OUTSIDER, OUTSIDER, AccountMeta(PAYER_KEY, False, False)
        else:
            raise ValueError(signer_mode)
        metas = ([AccountMeta(quote, False, False), AccountMeta(dest, False, True), auth_meta] +
                 [AccountMeta(ROLE_KEY[r], False, True) for r in source_roles])
        return send_tx(h, Instruction(TOKEN22, bytes([26, 3, len(source_roles)]), metas), payer)
    if kind == "harvest":
        source_roles = args[0]
        metas = ([AccountMeta(quote, False, True)] +
                 [AccountMeta(ROLE_KEY[r], False, True) for r in source_roles])
        return send_tx(h, Instruction(TOKEN22, bytes([26, 4]), metas), PAYER)
    if kind == "wfm":
        dest_role = args[0]
        metas = [AccountMeta(quote, False, True), AccountMeta(ROLE_KEY[dest_role], False, True),
                 AccountMeta(PAYER_KEY, True, False)]
        return send_tx(h, Instruction(TOKEN22, bytes([26, 2]), metas), PAYER)
    raise ValueError(kind)


VOL_CREATED = {"lamports": 1844400, "len": 137, "user": bytes(PAYER_KEY).hex()}


def E(dPAYER, deltas, pool_after, volume, event=None, events=1, error=None,
      rollback=False, wh_after=None, lam_deltas=None, mint_wh=0, dOUT=0):
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after),
            "volume": volume, "event": event, "events": events, "error": error,
            "rollback": rollback, "wh_after": wh_after or {},
            "lam_deltas": lam_deltas or {}, "mint_wh": mint_wh, "dOUT": dOUT}


def P(vq, pf, cf, sup=S_ASIS):
    return [vq, pf, cf, sup]


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


def COL_EV(fee):
    return {"disc": COL_DISC, "len": 120, "timestamp": 1234567890,
            "creator": bytes(CREATOR).hex(), "fee": fee,
            "vault_ata": bytes(CREAT22).hex(), "dest": bytes(DEST22).hex()}


def DEP_EV(base_, quote_):
    return {"disc": DEP_DISC, "len": 264, "base": base_, "quote": quote_}


def WD_EV(base_, quote_):
    return {"disc": WD_DISC, "len": 264, "base": base_, "quote": quote_}


def BUY_EV():
    return {"disc": BUY_DISC, "len": 500, "curve": 1824983, "lp_bps": 2,
            "lp_fee": 365, "proto_bps": 93, "proto_fee": 16973,
            "qwlp": 1825348, "uin": 1847796}


POOL_ASIS = P(VQ0, PF0, CF0)
D_DEP9_TF100 = {"userbase": -160619895224, "userquote": -29608495, "userlp": 10**9,
                "vaultbase": 160619895224, "vaultquote": 29312410}
D_WD9_TF100 = {"userbase": 160619895223, "userquote": 29019284, "userlp": -10**9,
               "vaultbase": -160619895223, "vaultquote": -29312409}
D_BUY10_TF100 = {"userbase": 10**10, "userquote": -1866375, "userlp": 0,
                 "vaultbase": -10**10, "vaultquote": 1839310, "bbata": 8401}
LAM_DEP_TF100 = {"userquote": -29608495, "vaultquote": 29608495}
LAM_WD_TF100 = {"userquote": 29312409, "vaultquote": -29312409}
LAM_BUY_TF100 = {"userquote": -1866375, "vaultquote": 1857889, "bbata": 8486}


def SWC_SEED(pool_after, tf5000=False):
    if tf5000:
        return E(-5000, {"creatorata": 61697, "vaultquote": -123394}, pool_after, None,
                 event=SWP_EV(123394, 1, CREATOR_VAULT), wh_after={"creatorata": 61697},
                 lam_deltas={"creatorata": 123394, "vaultquote": -123394})
    return E(-5000, {"creatorata": 122160, "vaultquote": -123394}, pool_after, None,
             event=SWP_EV(123394, 1, CREATOR_VAULT), wh_after={"creatorata": 1234},
             lam_deltas={"creatorata": 123394, "vaultquote": -123394})


def COL_SEED(pool_after, tf5000=False):
    if tf5000:
        return E(-5000, {"creatorata": -61697, "dest": 30848}, pool_after, None,
                 event=COL_EV(61697), wh_after={"creatorata": 61697, "dest": 30849})
    return E(-5000, {"creatorata": -122160, "dest": 120938}, pool_after, None,
             event=COL_EV(122160), wh_after={"creatorata": 1234, "dest": 1222})


def WW(dPAYER, deltas, wh_after, pool_after, volume=None, dOUT=0):
    return E(dPAYER, deltas, pool_after, volume, events=0,
             wh_after=wh_after, dOUT=dOUT)


def WW_FAIL(dPAYER, error, wh_after, pool_after, volume=None, dOUT=0):
    return E(dPAYER, {}, pool_after, volume, events=0, error=error, rollback=True,
             wh_after=wh_after, dOUT=dOUT)


CASES = [
    # Family A -- seed sweep/collect recovery.
    {"label": "a-swc-col-ww", "bps": 100,
     "steps": [("swc", ()), ("col", ()), ("ww", ("wdest", "payer", ["creatorata", "dest"]))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                WW(-5000, {"wdest": 2456}, {"creatorata": 0, "dest": 0, "wdest": 0},
                   P(-2488, PF0, 0))]},
    {"label": "a-swc-col-ww-dest-is-source", "bps": 100,
     "steps": [("swc", ()), ("col", ()), ("ww", ("creatorata", "payer", ["creatorata", "dest"]))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                WW(-5000, {"creatorata": 2456}, {"creatorata": 0, "dest": 0},
                   P(-2488, PF0, 0))]},
    {"label": "a-swc-col-ww-tf5000", "bps": 5000,
     "steps": [("swc", ()), ("col", ()), ("ww", ("wdest", "payer", ["creatorata", "dest"]))],
     "expect": [SWC_SEED(P(-2488, PF0, 0), tf5000=True),
                COL_SEED(P(-2488, PF0, 0), tf5000=True),
                WW(-5000, {"wdest": 92546}, {"creatorata": 0, "dest": 0, "wdest": 0},
                   P(-2488, PF0, 0))]},
    # Family B -- authority gates.
    {"label": "b-ww-wrong-authority", "bps": 100,
     "steps": [("swc", ()), ("col", ()),
               ("ww", ("wdest", "outsider", ["creatorata", "dest"])),
               ("ww", ("wdest", "payer", ["creatorata", "dest"]))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                WW_FAIL(0, "InstructionErrorCustom(4)", {"creatorata": 1234, "dest": 1222},
                        P(-2488, PF0, 0), dOUT=-5000),
                WW(-5000, {"wdest": 2456}, {"creatorata": 0, "dest": 0, "wdest": 0},
                   P(-2488, PF0, 0))]},
    {"label": "b-ww-zero-authority", "bps": 100, "ww_auth": False,
     "steps": [("swc", ()), ("col", ()), ("ww", ("wdest", "payer", ["creatorata", "dest"]))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                WW_FAIL(-5000, "InstructionErrorCustom(29)", {"creatorata": 1234, "dest": 1222},
                        P(-2488, PF0, 0))]},
    {"label": "b-zero-auth-harvest-wfm-fails", "bps": 100, "ww_auth": False,
     "steps": [("swc", ()), ("col", ()), ("harvest", (["creatorata", "dest"],)),
               ("wfm", ("wdest",))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                E(-5000, {}, P(-2488, PF0, 0), None, events=0,
                  wh_after={"creatorata": 0, "dest": 0}, mint_wh=2456),
                E(-5000, {}, P(-2488, PF0, 0), None, events=0,
                  error="InstructionErrorCustom(29)", rollback=True,
                  wh_after={"creatorata": 0, "dest": 0}, mint_wh=2456)]},
    {"label": "b-ww-payer-outsider-unsigned", "bps": 100,
     "steps": [("swc", ()), ("col", ()),
               ("ww", ("wdest", "payer_unsigned", ["creatorata", "dest"])),
               ("ww", ("wdest", "payer", ["creatorata", "dest"]))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                WW_FAIL(0, "MissingRequiredSignature", {"creatorata": 1234, "dest": 1222},
                        P(-2488, PF0, 0), dOUT=-5000),
                WW(-5000, {"wdest": 2456}, {"creatorata": 0, "dest": 0, "wdest": 0},
                   P(-2488, PF0, 0))]},
    # Family C -- harvest route.
    {"label": "c-harvest-then-wfm", "bps": 100,
     "steps": [("swc", ()), ("col", ()), ("harvest", (["creatorata", "dest"],)),
               ("wfm", ("wdest",))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                E(-5000, {}, P(-2488, PF0, 0), None, events=0,
                  wh_after={"creatorata": 0, "dest": 0}, mint_wh=2456),
                E(-5000, {"wdest": 2456}, P(-2488, PF0, 0), None, events=0,
                  wh_after={"wdest": 0}, mint_wh=0)]},
    {"label": "c-wfm-zero", "bps": 100,
     "steps": [("wfm", ("wdest",))],
     "expect": [E(-5000, {}, POOL_ASIS, None, events=0, wh_after={"wdest": 0}, mint_wh=0)]},
    # Family D -- idempotency.
    {"label": "d-ww-twice", "bps": 100,
     "steps": [("swc", ()), ("col", ()), ("ww", ("wdest", "payer", ["creatorata", "dest"])),
               ("ww", ("wdest", "payer", ["creatorata", "dest"]))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                WW(-5000, {"wdest": 2456}, {"creatorata": 0, "dest": 0, "wdest": 0},
                   P(-2488, PF0, 0)),
                WW(-5000, {}, {"creatorata": 0, "dest": 0, "wdest": 0},
                   P(-2488, PF0, 0))]},
    {"label": "d-ww-zero-sources", "bps": 100,
     "steps": [("swc", ()), ("col", ()), ("ww", ("wdest", "payer", []))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                WW(-5000, {}, {"creatorata": 1234, "dest": 1222, "wdest": 0},
                   P(-2488, PF0, 0))]},
    {"label": "d-ww-dup-source", "bps": 100,
     "steps": [("swc", ()), ("col", ()),
               ("ww", ("wdest", "payer", ["creatorata", "creatorata", "dest"]))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                WW(-5000, {"wdest": 2456}, {"creatorata": 0, "dest": 0, "wdest": 0},
                   P(-2488, PF0, 0))]},
    # Family E -- tolerance: skipped sources.
    {"label": "e-ww-extensionless-source", "bps": 100,
     "steps": [("swc", ()), ("col", ()),
               ("ww", ("wdest", "payer", ["creatorata", "plain"])),
               ("ww", ("wdest", "payer", ["dest"]))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                WW(-5000, {"wdest": 1234}, {"creatorata": 0, "dest": 1222, "wdest": 0},
                   P(-2488, PF0, 0)),
                WW(-5000, {"wdest": 1222}, {"dest": 0, "wdest": 0},
                   P(-2488, PF0, 0))]},
    {"label": "e-ww-wrongmint-source", "bps": 100,
     "steps": [("swc", ()), ("col", ()),
               ("ww", ("wdest", "payer", ["creatorata", "base22"]))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                WW(-5000, {"wdest": 1234},
                   {"creatorata": 0, "dest": 1222, "wdest": 0, "base22": 999},
                   P(-2488, PF0, 0))]},
    # Family F -- destination mint binding.
    {"label": "f-ww-wrongmint-dest", "bps": 100,
     "steps": [("swc", ()), ("col", ()),
               ("ww", ("base22", "payer", ["creatorata", "dest"]))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                WW_FAIL(-5000, "InstructionErrorCustom(3)",
                        {"creatorata": 1234, "dest": 1222, "base22": 999},
                        P(-2488, PF0, 0))]},
    {"label": "f-ww-tokenowned-dest", "bps": 100,
     "steps": [("swc", ()), ("col", ()),
               ("ww", ("userbase", "payer", ["creatorata", "dest"]))],
     "expect": [SWC_SEED(P(-2488, PF0, 0)),
                COL_SEED(P(-2488, PF0, 0)),
                WW_FAIL(-5000, "IncorrectProgramId",
                        {"creatorata": 1234, "dest": 1222},
                        P(-2488, PF0, 0))]},
    # Family G -- trade/liquidity/protocol withheld.
    {"label": "g-buy-ww-all", "bps": 100,
     "steps": [("buy", (10**10,)), ("swc", ()), ("col", ()),
               ("ww", ("wdest", "payer", ["vaultquote", "bbata", "creatorata", "dest"]))],
     "expect": [E(-1849400, D_BUY10_TF100, P(-139844, 10975, 128869), VOL_CREATED,
                  event=BUY_EV(),
                  wh_after={"vaultquote": 18579, "bbata": 85, "userquote": 0},
                  lam_deltas=LAM_BUY_TF100),
                E(-5000, {"creatorata": 127580, "vaultquote": -128869},
                  P(-10975, 10975, 0), VOL_CREATED,
                  event=SWP_EV(128869, 1, CREATOR_VAULT), wh_after={"creatorata": 1289},
                  lam_deltas={"creatorata": 128869, "vaultquote": -128869}),
                E(-5000, {"creatorata": -127580, "dest": 126304},
                  P(-10975, 10975, 0), VOL_CREATED,
                  event=COL_EV(127580), wh_after={"creatorata": 1289, "dest": 1276}),
                WW(-5000, {"wdest": 21229},
                   {"vaultquote": 0, "bbata": 0, "creatorata": 0, "dest": 0, "wdest": 0},
                   P(-10975, 10975, 0), volume=VOL_CREATED)]},
    {"label": "g-dep-ww", "bps": 100,
     "steps": [("dep", (10**9, MX, MX)), ("ww", ("wdest", "payer", ["vaultquote"]))],
     "expect": [E(-5000, D_DEP9_TF100, P(VQ0, PF0, CF0, S_DEP9), None,
                  event=DEP_EV(160619895224, 29312410),
                  wh_after={"vaultquote": 296085, "userquote": 0},
                  lam_deltas=LAM_DEP_TF100),
                WW(-5000, {"wdest": 296085}, {"vaultquote": 0, "wdest": 0},
                   P(VQ0, PF0, CF0, S_DEP9))]},
    {"label": "g-wd-ww", "bps": 100,
     "steps": [("wd", (10**9, 0, 0)), ("ww", ("wdest", "payer", ["userquote"]))],
     "expect": [E(-5000, D_WD9_TF100, P(VQ0, PF0, CF0, S_WD9), None,
                  event=WD_EV(160619895223, 29312409),
                  wh_after={"userquote": 293125, "vaultquote": 0},
                  lam_deltas=LAM_WD_TF100),
                WW(-5000, {"wdest": 293125}, {"userquote": 0, "wdest": 0},
                   P(VQ0, PF0, CF0, S_WD9))]},
    {"label": "g-proto-ww", "bps": 100,
     "steps": [("swp", ()), ("ww", ("wdest", "payer", ["protoata"]))],
     "expect": [E(-5000, {"protoata": 2463, "vaultquote": -2488},
                  P(-123394, 0, 123394), None,
                  event=SWP_EV(2488, 0, PROTOCOL), wh_after={"protoata": 25},
                  lam_deltas={"protoata": 2488, "vaultquote": -2488}),
                WW(-5000, {"wdest": 25}, {"protoata": 0, "wdest": 0},
                   P(-123394, 0, 123394))]},
]

STEP_KIND = {"dep": "dep", "wd": "wd", "buy": "buy",
             "swp": "swp", "swc": "swc", "col": "col",
             "ww": None, "harvest": None, "wfm": None}


def run_case(case, image_name, binary):
    h = setup_vm(binary, case["bps"], case.get("ww_auth", True))
    out = []
    for (kind, args), exp in zip(case["steps"], case["expect"]):
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
        d_out = lam_delta(rec, OUTSIDER_KEY)
        check(d_out == exp["dOUT"], f"{tag}: dOUT {d_out} != {exp['dOUT']}")
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
        got_mint_wh = mint_wh(rec["after"][str(quote)])
        check(got_mint_wh == exp["mint_wh"],
              f"{tag}: mint_wh {got_mint_wh} != {exp['mint_wh']}")
        if exp.get("rollback"):
            for k, b in rec["before"].items():
                if k in (str(PAYER_KEY), str(OUTSIDER_KEY)):
                    continue
                check(rec["after"][k] == b, f"{tag}: rollback violated for {k}")
        if exp.get("event") is not None:
            got = decode_event(STEP_KIND[kind], rec)
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
        for rec in per_image["original"]:
            receipts.append(rec)

        def surface(recs):
            out = []
            for rec in recs:
                def strip(snap):
                    d = dict(snap)
                    for pk in (str(PAYER_KEY), str(OUTSIDER_KEY)):
                        if d.get(pk) is not None:
                            d[pk] = dict(d[pk])
                            d[pk]["lamports"] = 0
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
        report_cases.append({"label": case["label"], "bps": case["bps"],
                             "ww_auth": case.get("ww_auth", True),
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
