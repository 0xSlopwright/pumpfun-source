#!/usr/bin/env python3
"""Build research/amm-sweep-collect-tf-chains-20261029 receipts.

3rd run packet #5: sweep -> collect chains under a matching
Token-2022 transfer fee, plus collect with a missing vault ATA.

What was already pinned elsewhere (and is NOT repeated here):
- 2nd #20 pinned single sweeps under tf (gross vault spend, net
  recipient gain, withheld in the recipient extension, gross event).
- 2nd #21 pinned single collects under tf (vault drains in full,
  net dest gain, withheld in the dest extension, gross event).
- 3rd #4 pinned sweep -> collect chains under the plain Token
  program, and left "collect with a missing vault ATA, and
  sweep/collect under transfer-fee mints" explicitly unexecuted.

What this packet pins, one signed transaction per step on three
program images (original, #424 control, #427 candidate):
- Double withholding: a tf100 creator sweep delivers net 122,160
  (withheld 1,234) into the vault ATA, and the following collect
  withholds AGAIN on the swept balance: dest gains 120,938
  (withheld 1,222), event gross 122,160. The vault ATA's own
  withheld 1,234 is NOT moved or cleared by the collect -- it stays
  in the vault ATA after the drain (amount 0, withheld 1,234).
- tf5000: sweep net 61,697 / withheld 61,697; collect fee
  ceil(61,697 * 0.5) = 30,849, dest 30,848 / withheld 30,849.
- tf10000: sweep delivers net 0 (withheld 123,394); the collect is
  a silent no-op (0 events, "No coin creator fee to collect") --
  a zero-amount vault ATA with a full withheld balance collects
  nothing and errors nothing.
- tf100 with maxfee 100: sweep net 123,294 / withheld 100; collect
  fee is capped at 100 again (dest 123,194 / withheld 100) -- the
  cap binds at both hops.
- Pre-withheld vault (5,000 / 1,000): sweep tf100 lands
  127,160 / 2,234; collect fee ceil(127,160 * 0.01) = 1,272, dest
  125,888 / withheld 1,272; vault withheld stays 2,234.
- Pre-withheld dest (5,000 / 1,000): collect accumulates to
  125,938 / 2,222.
- Accrual simulation (pool cf 128,869, pf 10,975, vq -139,844, the
  3rd #4 v2-buy accrual state): sweep tf100 net 127,580 /
  withheld 1,289; collect dest 126,304 / withheld 1,276.
- Protocol sweep under tf does not feed collect: proto sweep
  tf100 lands 2,463 / withheld 25 in the protocol ATA, and the
  collect is a silent no-op with the protocol ATA untouched.
- Sweep then collect with no destination: 3012 AccountNotInitialized
  (caused by account: coin_creator_token_account), full rollback,
  vault ATA keeps its swept 122,160 / 1,234.
- Sweep then collect to a no-extension destination: Token-2022
  custom error 0xd, full rollback.
- Collect with a missing vault ATA: 3012 AccountNotInitialized
  (caused by account: coin_creator_vault_ata), both under the Token
  program and under tf -- the vault ATA is deserialized before any
  amount check, unlike the empty-vault no-op.
- Token baseline anchor: fixture sweep 123,394 -> collect 123,394.

Handler-created ATA lamports are rent + gross (Token 2,039,280 +
gross, Token-2022 2,157,600 + gross). A sweep also credits gross
lamports into a PRE-EXISTING recipient ATA (the pool vault is a
native account, so the sweep's lamport leg moves with the tokens);
a Token-2022 collect between non-native accounts moves no lamports
at all on either side.

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
    f, pool, poolraw, quote, token, vaultquote,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-sweep-collect-tf-chains-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}

ATA_PROG = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
PAYER_KEY = PAYER.pubkey()
CREATOR = Pubkey.from_bytes(bytes(poolraw[211:243]))
CREATOR_VAULT, _ = Pubkey.find_program_address([b'creator_vault', bytes(CREATOR)], PROGRAM)
PROTOCOL = Pubkey.from_bytes(bytes(RAW[57:89]))
M = 2 ** 64 - 1
VQ0, PF0, CF0 = -125882, 2488, 123394
S_ASIS = 4194352106721
SWP_DISC = "82a42461e48287a5"
COL_DISC = "e8f5c2eeeada3a59"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def ata(owner, prog):
    return Pubkey.find_program_address([bytes(owner), bytes(prog), bytes(quote)], ATA_PROG)[0]


def t22acct(owner, amount, withheld):
    data = bytearray(165)
    data[0:32] = bytes(quote)
    data[32:64] = bytes(owner)
    struct.pack_into("<Q", data, 64, amount)
    data[108] = 1
    if withheld is None:
        return bytes(data)
    return bytes(data) + bytes([2]) + struct.pack("<HH", 7, 0) \
        + struct.pack("<HHQ", 2, 8, withheld)


def apply_tf(vm, bps, maxfee):
    mint = vm.get_account(quote)
    d = bytearray(mint.data[:82])
    d += bytes(83) + bytes([1])
    conf = bytes(72) + struct.pack("<QQH", 0, maxfee, bps) \
        + struct.pack("<QQH", 0, maxfee, bps)
    d += struct.pack("<HH", 1, len(conf)) + conf
    vm.set_account(quote, Account(mint.lamports, bytes(d), TOKEN22))
    a = vm.get_account(vaultquote)
    dd = bytearray(a.data[:165])
    dd += bytes([2]) + struct.pack("<HHQ", 2, 8, 0)
    vm.set_account(vaultquote, Account(a.lamports, bytes(dd), TOKEN22))


def convert_token22(vm):
    mint = vm.get_account(quote)
    vm.set_account(quote, Account(mint.lamports, bytes(mint.data), TOKEN22))
    a = vm.get_account(vaultquote)
    vm.set_account(vaultquote, Account(a.lamports, bytes(a.data), TOKEN22))


def setup_vm(binary, case):
    prog = case["prog"]
    h = Harness(binary)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, p in [(TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                   (TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so"),
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
    if case["patch"].get("pf") is not None:
        pd[271:279] = struct.pack("<Q", case["patch"]["pf"])
    if case["patch"].get("cf") is not None:
        pd[279:287] = struct.pack("<Q", case["patch"]["cf"])
    if case["patch"].get("vq") is not None:
        pd[245:261] = case["patch"]["vq"].to_bytes(16, "little", signed=True)
    vm.set_account(pool, Account(f["accounts"]["pool"]["lamports"], bytes(pd), PROGRAM))
    if prog == TOKEN22:
        if case.get("tf") is not None:
            apply_tf(vm, *case["tf"])
        else:
            convert_token22(vm)
    pre = case.get("pre", {})
    if "creator" in pre:
        amt, wh = pre["creator"]
        if prog == TOKEN:
            vm.set_account(ata(CREATOR_VAULT, prog),
                           Account(2039280, token(quote, CREATOR_VAULT, amt, True), TOKEN))
        else:
            vm.set_account(ata(CREATOR_VAULT, prog),
                           Account(amt + 2039280, t22acct(CREATOR_VAULT, amt, wh), TOKEN22))
    if "dest" in pre:
        amt, wh = pre["dest"]
        if prog == TOKEN:
            vm.set_account(ata(CREATOR, prog),
                           Account(2039280, token(quote, CREATOR, amt, True), TOKEN))
        else:
            vm.set_account(ata(CREATOR, prog),
                           Account(amt + 2039280, t22acct(CREATOR, amt, wh), TOKEN22))
    if "proto" in pre:
        amt, wh = pre["proto"]
        vm.set_account(ata(PROTOCOL, prog),
                       Account(amt + 2039280, t22acct(PROTOCOL, amt, wh), TOKEN22))
    return h


def snap(vm, keys):
    out = {}
    for k in keys:
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
    return struct.unpack_from("<Q", raw, 174)[0] if len(raw) >= 182 else None


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
    if kind in ("swp", "swc"):
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "recipient": raw[112:144].hex(),
                "amount": u64(raw, 176), "bucket": raw[184]}
    if kind == "col":
        return {"disc": raw[:8].hex(), "len": len(raw),
                "timestamp": struct.unpack_from("<q", raw, 8)[0],
                "creator": raw[16:48].hex(),
                "fee": u64(raw, 48),
                "vault_ata": raw[56:88].hex(),
                "dest": raw[88:120].hex()}
    return None


def check(cond, msg):
    if not cond:
        raise AssertionError(msg)


def disc(name):
    return bytes(next(x for x in IDL["instructions"] if x["name"] == name)["discriminator"])


def keys_for(case, kind):
    prog = case["prog"]
    if kind == "swp":
        return [PAYER_KEY, CONFIG_KEY, pool, quote, prog, vaultquote,
                PROTOCOL, ata(PROTOCOL, prog), Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
    if kind == "swc":
        return [PAYER_KEY, CONFIG_KEY, pool, quote, prog, vaultquote,
                CREATOR_VAULT, ata(CREATOR_VAULT, prog), Pubkey.default(), ATA_PROG, EVENT, PROGRAM]
    if kind == "col":
        return [quote, prog, CREATOR, CREATOR_VAULT, ata(CREATOR_VAULT, prog),
                ata(CREATOR, prog), EVENT, PROGRAM]
    raise ValueError(kind)


def do_step(h, case, kind):
    name = {"swp": "sweep_protocol_fee", "swc": "sweep_creator_fee",
            "col": "collect_coin_creator_fee"}[kind]
    keys = keys_for(case, kind)
    ix = next(x for x in IDL["instructions"] if x["name"] == name)
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, disc(name), metas)], PAYER_KEY, [PAYER], h.vm.latest_blockhash())
    assert tx.verify_with_results() and all(tx.verify_with_results())
    watch = [PAYER_KEY, pool, vaultquote, ata(PROTOCOL, case["prog"]),
             ata(CREATOR_VAULT, case["prog"]), ata(CREATOR, case["prog"])]
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


def E(dPAYER, deltas, pool_after, event=None, events=1, error=None,
      rollback=False, site_fragment=None, log_fragment=None, absent=None,
      ata_after=None):
    return {"dPAYER": dPAYER, "deltas": deltas, "pool_after": list(pool_after),
            "event": event, "events": events, "error": error,
            "rollback": rollback, "site_fragment": site_fragment,
            "log_fragment": log_fragment, "absent": absent or [],
            "ata_after": ata_after or {}}


def P(vq, pf, cf, sup=S_ASIS):
    return [vq, pf, cf, sup]


def SWP_EV(amount, bucket, recipient):
    return {"disc": SWP_DISC, "len": 185, "timestamp": 1234567890,
            "recipient": bytes(recipient).hex(), "amount": amount, "bucket": bucket}


def COL_EV(fee, vault_ata, dest):
    return {"disc": COL_DISC, "len": 120, "timestamp": 1234567890,
            "creator": bytes(CREATOR).hex(), "fee": fee,
            "vault_ata": bytes(vault_ata).hex(), "dest": bytes(dest).hex()}


POOL_ASIS = P(VQ0, PF0, CF0)
T22 = TOKEN22
TOK = TOKEN

CASES = [
    # Family A -- Token baseline anchor
    {"label": "a-token-sweep-collect", "prog": TOK, "tf": None, "patch": {},
     "pre": {"dest": (0, None)},
     "steps": [("swc", ()), ("col", ())],
     "expect": [E(-2044280, {"creatorata": 123394, "vaultquote": -123394},
                  P(-2488, PF0, 0), event=SWP_EV(123394, 1, CREATOR_VAULT),
                  ata_after={"creatorata": [123394, None, 2039280 + 123394]}),
                E(-5000, {"creatorata": -123394, "dest": 123394},
                  P(-2488, PF0, 0), event=COL_EV(123394, ata(CREATOR_VAULT, TOK), ata(CREATOR, TOK)),
                  ata_after={"dest": [123394, None, 2039280 + 123394]})]},
    # Family T -- tf chains
    {"label": "t-tf100", "prog": T22, "tf": (100, M), "patch": {},
     "pre": {"dest": (0, 0)},
     "steps": [("swc", ()), ("col", ())],
     "expect": [E(-2162600, {"creatorata": 122160, "vaultquote": -123394},
                  P(-2488, PF0, 0), event=SWP_EV(123394, 1, CREATOR_VAULT),
                  ata_after={"creatorata": [122160, 1234, 2157600 + 123394]}),
                E(-5000, {"creatorata": -122160, "dest": 120938},
                  P(-2488, PF0, 0),
                  event=COL_EV(122160, ata(CREATOR_VAULT, T22), ata(CREATOR, T22)),
                  ata_after={"creatorata": [0, 1234, 2157600 + 123394],
                             "dest": [120938, 1222, 2039280]})]},
    {"label": "t-tf5000", "prog": T22, "tf": (5000, M), "patch": {},
     "pre": {"dest": (0, 0)},
     "steps": [("swc", ()), ("col", ())],
     "expect": [E(-2162600, {"creatorata": 61697, "vaultquote": -123394},
                  P(-2488, PF0, 0), event=SWP_EV(123394, 1, CREATOR_VAULT),
                  ata_after={"creatorata": [61697, 61697, 2157600 + 123394]}),
                E(-5000, {"creatorata": -61697, "dest": 30848},
                  P(-2488, PF0, 0),
                  event=COL_EV(61697, ata(CREATOR_VAULT, T22), ata(CREATOR, T22)),
                  ata_after={"creatorata": [0, 61697, 2157600 + 123394],
                             "dest": [30848, 30849, 2039280]})]},
    {"label": "t-tf10000", "prog": T22, "tf": (10000, M), "patch": {},
     "pre": {"dest": (0, 0)},
     "steps": [("swc", ()), ("col", ())],
     "expect": [E(-2162600, {"creatorata": 0, "vaultquote": -123394},
                  P(-2488, PF0, 0), event=SWP_EV(123394, 1, CREATOR_VAULT),
                  ata_after={"creatorata": [0, 123394, 2157600 + 123394]}),
                E(-5000, {}, P(-2488, PF0, 0), events=0,
                  log_fragment="No coin creator fee",
                  ata_after={"creatorata": [0, 123394, 2157600 + 123394],
                             "dest": [0, 0, 2039280]})]},
    {"label": "t-tf100-max100", "prog": T22, "tf": (100, 100), "patch": {},
     "pre": {"dest": (0, 0)},
     "steps": [("swc", ()), ("col", ())],
     "expect": [E(-2162600, {"creatorata": 123294, "vaultquote": -123394},
                  P(-2488, PF0, 0), event=SWP_EV(123394, 1, CREATOR_VAULT),
                  ata_after={"creatorata": [123294, 100, 2157600 + 123394]}),
                E(-5000, {"creatorata": -123294, "dest": 123194},
                  P(-2488, PF0, 0),
                  event=COL_EV(123294, ata(CREATOR_VAULT, T22), ata(CREATOR, T22)),
                  ata_after={"creatorata": [0, 100, 2157600 + 123394],
                             "dest": [123194, 100, 2039280]})]},
    {"label": "t-prewithheld-vault", "prog": T22, "tf": (100, M), "patch": {},
     "pre": {"creator": (5000, 1000), "dest": (0, 0)},
     "steps": [("swc", ()), ("col", ())],
     "expect": [E(-5000, {"creatorata": 122160, "vaultquote": -123394},
                  P(-2488, PF0, 0), event=SWP_EV(123394, 1, CREATOR_VAULT),
                  ata_after={"creatorata": [127160, 2234, 5000 + 2039280 + 123394]}),
                E(-5000, {"creatorata": -127160, "dest": 125888},
                  P(-2488, PF0, 0),
                  event=COL_EV(127160, ata(CREATOR_VAULT, T22), ata(CREATOR, T22)),
                  ata_after={"creatorata": [0, 2234, 5000 + 2039280 + 123394],
                             "dest": [125888, 1272, 2039280]})]},
    {"label": "t-prewithheld-dest", "prog": T22, "tf": (100, M), "patch": {},
     "pre": {"dest": (5000, 1000)},
     "steps": [("swc", ()), ("col", ())],
     "expect": [E(-2162600, {"creatorata": 122160, "vaultquote": -123394},
                  P(-2488, PF0, 0), event=SWP_EV(123394, 1, CREATOR_VAULT),
                  ata_after={"creatorata": [122160, 1234, 2157600 + 123394]}),
                E(-5000, {"creatorata": -122160, "dest": 120938},
                  P(-2488, PF0, 0),
                  event=COL_EV(122160, ata(CREATOR_VAULT, T22), ata(CREATOR, T22)),
                  ata_after={"creatorata": [0, 1234, 2157600 + 123394],
                             "dest": [125938, 2222, 5000 + 2039280]})]},
    {"label": "t-accrual128869", "prog": T22, "tf": (100, M),
     "patch": {"pf": 10975, "cf": 128869, "vq": -139844},
     "pre": {"dest": (0, 0)},
     "steps": [("swc", ()), ("col", ())],
     "expect": [E(-2162600, {"creatorata": 127580, "vaultquote": -128869},
                  P(-10975, 10975, 0), event=SWP_EV(128869, 1, CREATOR_VAULT),
                  ata_after={"creatorata": [127580, 1289, 2157600 + 128869]}),
                E(-5000, {"creatorata": -127580, "dest": 126304},
                  P(-10975, 10975, 0),
                  event=COL_EV(127580, ata(CREATOR_VAULT, T22), ata(CREATOR, T22)),
                  ata_after={"creatorata": [0, 1289, 2157600 + 128869],
                             "dest": [126304, 1276, 2039280]})]},
    {"label": "t-twice", "prog": T22, "tf": (100, M), "patch": {},
     "pre": {"dest": (0, 0)},
     "steps": [("swc", ()), ("col", ()), ("col", ())],
     "expect": [E(-2162600, {"creatorata": 122160, "vaultquote": -123394},
                  P(-2488, PF0, 0), event=SWP_EV(123394, 1, CREATOR_VAULT),
                  ata_after={"creatorata": [122160, 1234, 2157600 + 123394]}),
                E(-5000, {"creatorata": -122160, "dest": 120938},
                  P(-2488, PF0, 0),
                  event=COL_EV(122160, ata(CREATOR_VAULT, T22), ata(CREATOR, T22)),
                  ata_after={"creatorata": [0, 1234, 2157600 + 123394],
                             "dest": [120938, 1222, 2039280]}),
                E(-5000, {}, P(-2488, PF0, 0), events=0,
                  log_fragment="No coin creator fee",
                  ata_after={"creatorata": [0, 1234, 2157600 + 123394],
                             "dest": [120938, 1222, 2039280]})]},
    {"label": "t-proto-then-collect", "prog": T22, "tf": (100, M), "patch": {},
     "pre": {"creator": (0, 0), "dest": (0, 0)},
     "steps": [("swp", ()), ("col", ())],
     "expect": [E(-2162600, {"protoata": 2463, "vaultquote": -2488},
                  P(-123394, 0, CF0), event=SWP_EV(2488, 0, PROTOCOL),
                  ata_after={"protoata": [2463, 25, 2157600 + 2488]}),
                E(-5000, {}, P(-123394, 0, CF0), events=0,
                  log_fragment="No coin creator fee",
                  ata_after={"creatorata": [0, 0, 2039280],
                             "protoata": [2463, 25, 2157600 + 2488],
                             "dest": [0, 0, 2039280]})]},
    {"label": "t-nodest", "prog": T22, "tf": (100, M), "patch": {},
     "pre": {},
     "steps": [("swc", ()), ("col", ())],
     "expect": [E(-2162600, {"creatorata": 122160, "vaultquote": -123394},
                  P(-2488, PF0, 0), event=SWP_EV(123394, 1, CREATOR_VAULT),
                  ata_after={"creatorata": [122160, 1234, 2157600 + 123394]}),
                E(-5000, {}, P(-2488, PF0, 0), events=0, error="3012",
                  rollback=True, site_fragment="coin_creator_token_account",
                  absent=["dest"],
                  ata_after={"creatorata": [122160, 1234, 2157600 + 123394]})]},
    {"label": "t-noext-dest", "prog": T22, "tf": (100, M), "patch": {},
     "pre": {"dest": (0, None)},
     "steps": [("swc", ()), ("col", ())],
     "expect": [E(-2162600, {"creatorata": 122160, "vaultquote": -123394},
                  P(-2488, PF0, 0), event=SWP_EV(123394, 1, CREATOR_VAULT),
                  ata_after={"creatorata": [122160, 1234, 2157600 + 123394]}),
                E(-5000, {}, P(-2488, PF0, 0), events=0,
                  error="InstructionErrorCustom(13)",
                  rollback=True, site_fragment="0xd",
                  ata_after={"creatorata": [122160, 1234, 2157600 + 123394],
                             "dest": [0, None, 2039280]})]},
    # Family M -- missing vault ATA
    {"label": "m-missing-vault-token", "prog": TOK, "tf": None, "patch": {},
     "pre": {"dest": (0, None)},
     "steps": [("col", ())],
     "expect": [E(-5000, {}, POOL_ASIS, events=0, error="3012",
                  rollback=True, site_fragment="coin_creator_vault_ata",
                  absent=["creatorata"])]},
    {"label": "m-missing-vault-tf", "prog": T22, "tf": (100, M), "patch": {},
     "pre": {"dest": (0, 0)},
     "steps": [("col", ())],
     "expect": [E(-5000, {}, POOL_ASIS, events=0, error="3012",
                  rollback=True, site_fragment="coin_creator_vault_ata",
                  absent=["creatorata"])]},
]


def role_keys(case):
    prog = case["prog"]
    return {"protoata": ata(PROTOCOL, prog),
            "creatorata": ata(CREATOR_VAULT, prog),
            "dest": ata(CREATOR, prog),
            "vaultquote": vaultquote}


def run_case(case, image_name, binary):
    h = setup_vm(binary, case)
    rk = role_keys(case)
    out = []
    for (kind, args), exp in zip(case["steps"], case["expect"]):
        rec = do_step(h, case, kind)
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
            got_d = tok_delta(rec, rk[role])
            check(got_d == want, f"{tag}: delta {role} {got_d} != {want}")
        for role, want in exp["ata_after"].items():
            got = rec["after"][str(rk[role])]
            check(got is not None, f"{tag}: ata_after {role} missing")
            amt, wh, lam = want
            check(tok_amount(got) == amt, f"{tag}: ata {role} amount {tok_amount(got)} != {amt}")
            if wh is not None:
                check(tok_withheld(got) == wh, f"{tag}: ata {role} withheld {tok_withheld(got)} != {wh}")
            if lam is not None:
                check(got["lamports"] == lam, f"{tag}: ata {role} lamports {got['lamports']} != {lam}")
        for role in exp["absent"]:
            check(rec["after"][str(rk[role])] is None,
                  f"{tag}: {role} should stay absent")
        got_pool = pool_state(rec["after"][str(pool)])
        check(list(got_pool) == exp["pool_after"],
              f"{tag}: pool {got_pool} != {exp['pool_after']}")
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
        rk = role_keys(case)
        report_cases.append({"label": case["label"],
                             "prog": "token" if case["prog"] == TOKEN else "token22",
                             "tf": list(case["tf"]) if case.get("tf") else None,
                             "patch": case["patch"],
                             "keys": {role: str(k) for role, k in rk.items()},
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
