#!/usr/bin/env python3
"""Build research/amm-trade-mode-gates-20261029 receipts.

2nd run packet #44: the cashback / mayhem pool-flag gates across
the three trade paths -- and a genuine original-vs-rebuilt
divergence in multi-hop buys.

Pool flags: is_mayhem_mode is pool byte 243, is_cashback_coin is
pool byte 244 (state.rs Pool layout).

Family A -- trade_v2 (single tier (0, lp 10 / protocol 111 /
creator 0 bps), VB 10^12, VQ 10^10, supply 10^12, accrued 0,
vq 0; the #33/#38 fixture):
- buy_v2 / sell_v2 / buy_exact_quote_in_v2 on a cashback pool
  all fail 6079 CashbackCoinNotSupported (trade.rs prepare() -> trade_v2.rs validate_cashback_coin), after the volume-accumulator init CPI (rolled back) and before any token transfer: payer -5,000 only, 0 events,
  pool bytes unchanged, no volume accumulator.
- Gate order on v2: disable_flags beats cashback (cashback +
  flags 8 -> 6020 DisabledBuy; cashback + flags 16 -> 6021
  DisabledSell); cashback beats the zero guards (cashback +
  amount 0 -> 6079, not 6001; cashback + limit 0 -> 6079, not
  6002) and beats buyback-recipient validation (cashback +
  a non-token buyback account -> 6079, while the same bad
  recipient without cashback fails 6027
  AccountTypeNotSupported).
- Mayhem pools trade fine on v2 (buyback forced to 0, supply substitution for tier selection is not exercised: the fixture has a single fee tier, so mayhem and non-mayhem pools necessarily use the same tier): buy 10^6 spends 10124 exactly as the non-mayhem
  anchor, but the whole 10124 lands in the vault (buyback 0,
  pool protocol +112, vq -112); sell 10^6 pays the same 9878
  to the user, but the vault sends only 9878 (buyback 0, pool
  protocol +111, vq -111); buy_exact 10000 outs the same
  987899 with vault +10000 (buyback 0, pool protocol +110,
  vq -110). Same spend/receipt, different vault/pool split.
- Both flags set: v2 fails 6079 (cashback first).

Family B -- multi_hop_swap, 3 AMM hops (tail pool quote<->base
-> POOL2 base<->BASE2 -> P3 BASE2<->BASE3; #5 anchors):
- Mayhem is enforced at EVERY hop in both directions on all
  three images: first failing hop, 0/1/2 prior-hop events for
  hop 1/2/3 failures, 6080 MayhemPoolNotSupported.
- Cashback is where the images SPLIT. On the rebuilt images
  (#424 control / #427 candidate) it is enforced at every hop,
  before mayhem: first failing hop, 6079. On the ORIGINAL
  image it is enforced only at the CREATOR-FEE hop: for buys
  the creator fee is paid at the LAST hop, for sells at the
  FIRST hop, and in this route that hop is P3 in both
  directions -- so original buys ignore cashback on the tail
  pool and POOL2 (both succeed with anchor-identical deltas)
  and fail only at P3 (2 prior events); original sells ignore
  cashback on POOL2 and the tail pool and fail only at P3
  (0 prior events). Both-flags cells confirm the order: at
  an enforced hop the original fails 6079 (cashback first),
  at an ignored hop it fails 6080 (mayhem only).
- Order pins (receipts agree on all images; ordering pinned on the original only for the sell disable cell at P3): disable beats cashback
  (cashback + flags 8 -> 6020 buy / flags 16 -> 6021 sell);
  the amount guard beats the hop checks (amount 0 +
  cashback tail pool -> 6002); canonical beats mode
  (mayhem pool with a non-canonical creator -> 6078
  OnlyPumpPools).

Family C -- legacy sell (the v1 path, #13 fixture):
- Legacy sell does NOT reject cashback pools: with the
  cashback remaining layout [accumulator ATA, accumulator PDA,
  pool-v2, buyback owner, buyback dest] it succeeds with the
  anchor token deltas, except the 548 creator fee lands in
  the accumulator's ATA as cashback (creator leg 0, event
  creator_fee 0 / cashback 548 / cashback_bps 30, accumulator
  cashback_earned +548). Pre-created accumulator: payer
  -5,000 only. Fresh accumulator + ATA: payer -3,888,680
  (5,000 fee + 1,844,400 accumulator rent + 2,039,280 ATA
  rent; the ATA is native, so its lamports land at
  2,039,280 + 548).
- With the standard 3-account remaining layout on a cashback
  pool it fails 6060 InvalidCashbackAccumulator (remaining[1]
  is not the accumulator PDA).
- Legacy sell on a mayhem pool fails 6013
  InvalidProtocolFeeRecipient: mayhem pools validate the
  protocol recipient against the RESERVED list, not the
  protocol list, and the fixture recipient is not reserved
  (the #43 update_fee_config binding mechanism, seen from the
  trade side).

All three images agree everywhere EXCEPT the multi-hop
cashback cells listed above, where the original and the
rebuilt images genuinely differ. verify.py checks each image
against its own recorded expectation for those cells instead
of forcing cross-image agreement.
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
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

from pump_amm_admin_differential import Harness
from pump_amm_liquidity_differential import (
    CONFIG, CONFIG_KEY, EVENT, IDL, PAYER, PROGRAM, RAW, TOKEN, TOKEN22,
    base, f, pool, quote, token, userbase, userquote, vaultbase, vaultquote,
    OUTSIDER,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig, volume
from pump_amm_legacy_sell_differential import (
    legacy as legacy_sell, mutate, cash, PROTOCOL_ATA, CREATOR_ATA,
    buyback as LS_BUYBACK,
)
import pump_amm_legacy_sell_differential as LS
from pump_amm_legacy_buy_differential import (
    userbase as LB_USERBASE, userquote as LB_USERQUOTE,
    vaultbase as LB_VB, vaultquote as LB_VQ,
)
from pump_amm_multi_hop_differential import run as mh_run, three_amm
from pump_amm_multi_hop_differential import P3
import pump_amm_multi_hop_differential as MH

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-trade-mode-gates-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
FEES_SHA = hashlib.sha256((ROOT / "evidence/original/pump_fees/deployed.so").read_bytes()).hexdigest()
PUMP_SHA = hashlib.sha256((ROOT / "evidence/original/pump/deployed.so").read_bytes()).hexdigest()
ATA = Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
BB_OWNER = Pubkey.from_bytes(base64.b64decode(f['accounts']['buyback_fee_recipient']['data_base64'])[32:64])
MAX = 2**64 - 1
TIERS = [(0, (10, 111, 0))]
SUPPLY = 10**12
VB = 10**12
VQ = 10**10


def sha(data):
    return hashlib.sha256(data).hexdigest()


def amount_at(data_hex, offset=64):
    return struct.unpack_from("<Q", bytes.fromhex(data_hex), offset)[0]


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        out[str(k)] = None if (not a or a.executable) else {
            "lamports": a.lamports, "owner": str(a.owner),
            "data_hex": bytes(a.data).hex()}
    return out


def fee_table(tiers):
    def apply(h, m):
        a = h.vm.get_account(feeconfig)
        raw = bytes(a.data[:41]) + struct.pack("<QQQ", 25, 5, 0) + struct.pack("<I", len(tiers))
        for threshold, fees in tiers:
            raw += threshold.to_bytes(16, "little") + struct.pack("<QQQ", *fees)
        raw += struct.pack("<I", 0) + bytes(24)
        h.vm.set_account(feeconfig, Account(a.lamports, raw.ljust(4097, b"\0"), a.owner))
    return apply


def pool_state(data_hex):
    d = bytes.fromhex(data_hex)
    return (int.from_bytes(d[245:261], "little", signed=True),
            struct.unpack_from("<Q", d, 271)[0],
            struct.unpack_from("<Q", d, 279)[0],
            d[243], d[244])


def v2_event_fields(ix_name, logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    if ix_name == "buy_v2":
        offs = (64, 72, 80, 88, 96, 104, 112)
    elif ix_name == "sell_v2":
        offs = (64, 72, 80, 88, 96)
    else:
        offs = (16, 24, 64, 72, 80, 88, 96, 104, 112)
    return tuple(struct.unpack_from("<Q", raw, off)[0] for off in offs)


def v2_run(ix_name, amount, limit, cashback, mayhem, flags, badbb, binary):
    ix = next(x for x in IDL["instructions"] if x["name"] == ix_name)
    h = Harness(binary)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, p in [(TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                   (TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so"),
                   (FEES, "evidence/original/pump_fees/deployed.so")]:
        vm.add_program_from_file(pid, ROOT / p)
    glob = bytearray(RAW)
    glob[56] = flags
    vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
    for n, rrow in f["accounts"].items():
        vm.set_account(Pubkey.from_string(rrow["address"]),
                       Account(rrow["lamports"], base64.b64decode(rrow["data_base64"]),
                               Pubkey.from_string(rrow["owner"])))
    vm.set_account(userbase, Account(10**9, token(base, PAYER.pubkey(), 10**15, False), TOKEN))
    vm.set_account(userquote, Account(10**15 + 2039280, token(quote, PAYER.pubkey(), 10**15, True), TOKEN))
    vm.set_account(volume, Account(0, b"", Pubkey.default()))
    keys = [pool, PAYER.pubkey(), CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, TOKEN, TOKEN, Pubkey.default(), volume, feeconfig,
            buyback, EVENT, PROGRAM]
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    if badbb:
        metas[14] = AccountMeta(PAYER.pubkey(), False, True)
    fee_table(TIERS)(SimpleNamespace(vm=vm), metas)
    for key, amt in ((vaultbase, VB), (vaultquote, VQ)):
        a = vm.get_account(key)
        d = bytearray(a.data); d[64:72] = struct.pack("<Q", amt)
        vm.set_account(key, Account(a.lamports, bytes(d), a.owner))
    a = vm.get_account(base)
    d = bytearray(a.data); d[36:44] = struct.pack("<Q", SUPPLY)
    vm.set_account(base, Account(a.lamports, bytes(d), a.owner))
    a = vm.get_account(pool)
    d = bytearray(a.data)
    d[245:261] = (0).to_bytes(16, "little", signed=True)
    d[243] = mayhem
    d[244] = cashback
    d[271:279] = struct.pack("<Q", 0)
    d[279:287] = struct.pack("<Q", 0)
    vm.set_account(pool, Account(a.lamports, bytes(d), a.owner))
    watch = [userbase, userquote, vaultbase, vaultquote, buyback, pool, volume, PAYER.pubkey()]
    before = snap(vm, watch)
    data = bytes(ix["discriminator"]) + struct.pack("<QQ", amount, limit)
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, data, metas)], PAYER.pubkey(), [PAYER], vm.latest_blockhash())
    assert all(tx.verify_with_results())
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    after = snap(vm, watch)
    logs = meta.logs()
    deltas = {}
    for name, key in (("userbase", userbase), ("userquote", userquote),
                      ("vaultbase", vaultbase), ("vaultquote", vaultquote),
                      ("buyback", buyback)):
        b, a2 = before[str(key)], after[str(key)]
        deltas[name] = None if b is None or a2 is None else amount_at(a2["data_hex"]) - amount_at(b["data_hex"])
    payer_delta = after[str(PAYER.pubkey())]["lamports"] - before[str(PAYER.pubkey())]["lamports"]
    vol = after[str(volume)]
    vol_ok = vol is not None and vol["lamports"] == 1844400 and len(bytes.fromhex(vol["data_hex"])) == 137 \
        and bytes.fromhex(vol["data_hex"])[8:40] == bytes(PAYER.pubkey())
    vol_empty = vol is None or (vol["lamports"] == 0 and vol["data_hex"] == "")
    return {
        "tx": tx, "raw": bytes(tx), "before": before, "after": after,
        "logs": logs, "err": str(r.err()) if failed else None,
        "failed": failed, "deltas": deltas, "payer_delta": payer_delta,
        "events": len([l for l in logs if l.startswith("Program data: ")]),
        "event": v2_event_fields(ix_name, logs),
        "pool_after": pool_state(after[str(pool)]["data_hex"]),
        "vol_ok": vol_ok, "vol_empty": vol_empty,
        "site": next((l for l in logs if "thrown in" in l or "caused by account" in l), None),
    }


# (label, ix, amount, limit, cashback, mayhem, flags, badbb, expected)
# ok: ("ok", deltas, event, pool_after(vq, pf, cf))
# err: ("err", code, fragment)
V2_CASES = [
    ("v2-buy-anchor", "buy_v2", 10**6, MAX, 0, 0, 0, False,
     ("ok", {"userbase": 10**6, "userquote": -10124, "vaultbase": -10**6, "vaultquote": 10068, "buyback": 56},
      (10001, 10, 11, 111, 112, 10012, 10124), (-56, 56, 0))),
    ("v2-sell-anchor", "sell_v2", 10**6, 1, 0, 0, 0, False,
     ("ok", {"userbase": -10**6, "userquote": 9878, "vaultbase": 10**6, "vaultquote": -9933, "buyback": 55},
      (9999, 10, 10, 111, 111), (-56, 56, 0))),
    ("v2-buyexact-anchor", "buy_exact_quote_in_v2", 10000, 987899, 0, 0, 0, False,
     ("ok", {"userbase": 987899, "userquote": -10000, "vaultbase": -987899, "vaultquote": 9945, "buyback": 55},
      (987899, 10000, 10000, 10, 10, 111, 110, 9890, 9880), (-55, 55, 0))),
    ("v2-buy-cashback", "buy_v2", 10**6, MAX, 1, 0, 0, False, ("err", 6079, "CashbackCoinNotSupported")),
    ("v2-sell-cashback", "sell_v2", 10**6, 1, 1, 0, 0, False, ("err", 6079, "CashbackCoinNotSupported")),
    ("v2-buyexact-cashback", "buy_exact_quote_in_v2", 10000, 987899, 1, 0, 0, False, ("err", 6079, "CashbackCoinNotSupported")),
    ("v2-buy-cashback-disable", "buy_v2", 10**6, MAX, 1, 0, 8, False, ("err", 6020, "DisabledBuy")),
    ("v2-sell-cashback-disable", "sell_v2", 10**6, 1, 1, 0, 16, False, ("err", 6021, "DisabledSell")),
    ("v2-buy-cashback-amount0", "buy_v2", 0, MAX, 1, 0, 0, False, ("err", 6079, "CashbackCoinNotSupported")),
    ("v2-buy-cashback-limit0", "buy_v2", 10**6, 0, 1, 0, 0, False, ("err", 6079, "CashbackCoinNotSupported")),
    ("v2-buy-badbb", "buy_v2", 10**6, MAX, 0, 0, 0, True, ("err", 6027, "AccountTypeNotSupported")),
    ("v2-buy-cashback-badbb", "buy_v2", 10**6, MAX, 1, 0, 0, True, ("err", 6079, "CashbackCoinNotSupported")),
    ("v2-buy-mayhem", "buy_v2", 10**6, MAX, 0, 1, 0, False,
     ("ok", {"userbase": 10**6, "userquote": -10124, "vaultbase": -10**6, "vaultquote": 10124, "buyback": 0},
      (10001, 10, 11, 111, 112, 10012, 10124), (-112, 112, 0))),
    ("v2-sell-mayhem", "sell_v2", 10**6, 1, 0, 1, 0, False,
     ("ok", {"userbase": -10**6, "userquote": 9878, "vaultbase": 10**6, "vaultquote": -9878, "buyback": 0},
      (9999, 10, 10, 111, 111), (-111, 111, 0))),
    ("v2-buyexact-mayhem", "buy_exact_quote_in_v2", 10000, 987899, 0, 1, 0, False,
     ("ok", {"userbase": 987899, "userquote": -10000, "vaultbase": -987899, "vaultquote": 10000, "buyback": 0},
      (987899, 10000, 10000, 10, 10, 111, 110, 9890, 9880), (-110, 110, 0))),
    ("v2-buy-both", "buy_v2", 10**6, MAX, 1, 1, 0, False, ("err", 6079, "CashbackCoinNotSupported")),
    ("v2-sell-both", "sell_v2", 10**6, 1, 1, 1, 0, False, ("err", 6079, "CashbackCoinNotSupported")),
]

receipts_global = []
report_cases = []


def add_receipt(context, raw, signatures, before, after, logs, events, err, payer_delta, observed, roles):
    receipts_global.append({
        "sequence": len(receipts_global), "vm": len(receipts_global),
        "context": context, "transaction_base64": base64.b64encode(raw).decode(),
        "signatures": signatures, "transaction_sha256": sha(raw),
        "all_signatures_verified": True, "signature_fields": len(signatures),
        "before": before, "after": after,
        "metadata": {"signature": signatures[0] if signatures else None, "logs": logs,
                     "events": events},
        "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                  "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
        "error": err, "rollback_except_payer_fee": err is not None,
        "payer_delta_lamports": payer_delta, "observed": observed, "roles": roles,
    })


for index, (label, ix_name, amount, limit, cashback, mayhem, flags, badbb, expected) in enumerate(V2_CASES):
    row = {"case": {"instruction": ix_name, "label": label, "amount": amount, "limit": limit,
                    "cashback": cashback, "mayhem": mayhem, "flags": flags, "badbb": badbb,
                    "expected": {"kind": expected[0],
                                 **({"deltas": expected[1], "event": list(expected[2]),
                                     "pool_after": list(expected[3])} if expected[0] == "ok" else
                                    {"code": expected[1], "fragment": expected[2]})}}}
    seen = set()
    for image, binary in IMAGES.items():
        r = v2_run(ix_name, amount, limit, cashback, mayhem, flags, badbb, binary)
        tx = r["tx"]
        if expected[0] == "ok":
            _, deltas, ev, pool_after = expected
            assert not r["failed"] and r["err"] is None, (label, image, r["err"])
            assert r["deltas"] == deltas, (label, image, r["deltas"], deltas)
            assert r["event"] == ev, (label, image, r["event"], ev)
            assert r["pool_after"][:3] == pool_after and r["pool_after"][3] == mayhem \
                and r["pool_after"][4] == cashback, (label, image, r["pool_after"])
            assert r["payer_delta"] == -1849400, (label, image, r["payer_delta"])
            assert r["vol_ok"], (label, image, "volume not funded")
            assert r["events"] == 1, (label, image, r["events"])
            observed = {"deltas": deltas, "event": list(ev), "pool_after": list(pool_after),
                        "payer_lamports_delta": -1849400, "volume_lamports": 1844400,
                        "volume_data_len": 137, "event_count": 1, "sig_fields": 1}
        else:
            _, code, fragment = expected
            assert r["failed"], (label, image, "expected failure")
            assert str(code) in r["err"], (label, image, r["err"])
            assert fragment in "\n".join(r["logs"]), (label, image, r["logs"][-3:])
            assert r["deltas"] == {"userbase": 0, "userquote": 0, "vaultbase": 0,
                                   "vaultquote": 0, "buyback": 0}, (label, image, r["deltas"])
            assert r["pool_after"] == (0, 0, 0, mayhem, cashback), (label, image, r["pool_after"])
            assert r["payer_delta"] == -5000, (label, image, r["payer_delta"])
            assert r["vol_empty"], (label, image, "volume funded on error")
            assert r["events"] == 0, (label, image, r["events"])
            row.setdefault("error_sites", {})[image] = r["site"]
            observed = {"error_code": code, "fragment": fragment,
                        "payer_lamports_delta": -5000, "volume_lamports": 0,
                        "volume_data_len": 0, "pool_after": [0, 0, 0, mayhem, cashback],
                        "event_count": 0, "sig_fields": 1}
        seen.add(json.dumps(observed, sort_keys=True))
        add_receipt({"index": index, "image": image, "instruction": ix_name, "label": label},
                    r["raw"], [str(s) for s in tx.signatures], r["before"], r["after"],
                    r["logs"], r["events"], r["err"], r["payer_delta"], observed,
                    {"fee_payer": str(PAYER.pubkey()), "pool": str(pool),
                     "userbase": str(userbase), "userquote": str(userquote),
                     "vaultbase": str(vaultbase), "vaultquote": str(vaultquote),
                     "buyback": str(buyback), "volume": str(volume)})
        row[image] = {"error": r["err"], "logs": r["logs"], "observed": observed}
        print(f"  {label} [{image}] observed={observed}", flush=True)
    assert len(seen) == 1, (label, "v2 images must agree", seen)
    report_cases.append(row)

# ---------------- family B: multi-hop ----------------
MH_WATCH = {
    "userquote": userquote, "u3": MH.U3, "buyback": LS_BUYBACK,
    "vb1": vaultbase, "vq1": vaultquote, "vb2": MH.VB2, "vq2": MH.VQ2,
    "vb3": MH.VB3, "vq3": MH.VQ3,
}
MH_BUY_1E9 = {
    "userquote": -10**9, "u3": 5315084721958, "buyback": 4607153,
    "vb1": -5385694844757, "vq1": 995392847,
    "vb2": -5356844515538, "vq2": 5385694844757,
    "vb3": -5315084721958, "vq3": 5356844515538,
}
MH_SELL_1E9 = {
    "userquote": 180345, "u3": -10**9, "buyback": 846,
    "vb1": 997498005, "vq1": -181191,
    "vb2": 997499001, "vq2": -997498005,
    "vb3": 10**9, "vq3": -997499001,
}


def mh_patch(key, off, val):
    def ov(h, m):
        a = h.vm.get_account(key)
        d = bytearray(a.data); d[off] = val
        h.vm.set_account(key, Account(a.lamports, bytes(d), a.owner))
    return ov


def mh_patch_creator(key):
    def ov(h, m):
        a = h.vm.get_account(key)
        d = bytearray(a.data); d[11:43] = bytes(OUTSIDER.pubkey())
        h.vm.set_account(key, Account(a.lamports, bytes(d), a.owner))
    return ov


def mh_patch_flags(flags):
    def ov(h, m):
        a = h.vm.get_account(CONFIG_KEY)
        d = bytearray(a.data); d[56] = flags
        h.vm.set_account(CONFIG_KEY, Account(a.lamports, bytes(d), a.owner))
    return ov


def mh_ok(deltas):
    return ("ok", deltas)


def mh_err(code, fragment, events):
    return ("err", code, fragment, events)


# expected per image: {"original": ..., "control": ..., "candidate": ...}
# control and candidate always share the rebuilt expectation here.
OK_B = mh_ok(MH_BUY_1E9)
OK_S = mh_ok(MH_SELL_1E9)
E79_0 = mh_err(6079, "CashbackCoinNotSupported", 0)
E79_1 = mh_err(6079, "CashbackCoinNotSupported", 1)
E79_2 = mh_err(6079, "CashbackCoinNotSupported", 2)
E80_0 = mh_err(6080, "MayhemPoolNotSupported", 0)
E80_1 = mh_err(6080, "MayhemPoolNotSupported", 1)
E80_2 = mh_err(6080, "MayhemPoolNotSupported", 2)
MH_CASES = [
    # (label, amount, limit, sell, patches, expected_by_image)
    ("mh-buy-anchor", 10**9, 1, False, [], {"original": OK_B, "control": OK_B, "candidate": OK_B}),
    ("mh-sell-anchor", 10**9, 1, True, [], {"original": OK_S, "control": OK_S, "candidate": OK_S}),
    ("mh-buy-cb-main", 10**9, 1, False, [mh_patch(pool, 244, 1)],
     {"original": OK_B, "control": E79_0, "candidate": E79_0}),
    ("mh-buy-cb-p2", 10**9, 1, False, [mh_patch(MH.POOL2, 244, 1)],
     {"original": OK_B, "control": E79_1, "candidate": E79_1}),
    ("mh-buy-cb-p3", 10**9, 1, False, [mh_patch(P3, 244, 1)],
     {"original": E79_2, "control": E79_2, "candidate": E79_2}),
    ("mh-buy-cb-all", 10**9, 1, False, [mh_patch(pool, 244, 1), mh_patch(MH.POOL2, 244, 1), mh_patch(P3, 244, 1)],
     {"original": E79_2, "control": E79_0, "candidate": E79_0}),
    ("mh-sell-cb-p3", 10**9, 1, True, [mh_patch(P3, 244, 1)],
     {"original": E79_0, "control": E79_0, "candidate": E79_0}),
    ("mh-sell-cb-p2", 10**9, 1, True, [mh_patch(MH.POOL2, 244, 1)],
     {"original": OK_S, "control": E79_1, "candidate": E79_1}),
    ("mh-sell-cb-main", 10**9, 1, True, [mh_patch(pool, 244, 1)],
     {"original": OK_S, "control": E79_2, "candidate": E79_2}),
    ("mh-sell-cb-all", 10**9, 1, True, [mh_patch(pool, 244, 1), mh_patch(MH.POOL2, 244, 1), mh_patch(P3, 244, 1)],
     {"original": E79_0, "control": E79_0, "candidate": E79_0}),
    ("mh-buy-mh-main", 10**9, 1, False, [mh_patch(pool, 243, 1)],
     {"original": E80_0, "control": E80_0, "candidate": E80_0}),
    ("mh-buy-mh-p2", 10**9, 1, False, [mh_patch(MH.POOL2, 243, 1)],
     {"original": E80_1, "control": E80_1, "candidate": E80_1}),
    ("mh-buy-mh-p3", 10**9, 1, False, [mh_patch(P3, 243, 1)],
     {"original": E80_2, "control": E80_2, "candidate": E80_2}),
    ("mh-sell-mh-p3", 10**9, 1, True, [mh_patch(P3, 243, 1)],
     {"original": E80_0, "control": E80_0, "candidate": E80_0}),
    ("mh-sell-mh-p2", 10**9, 1, True, [mh_patch(MH.POOL2, 243, 1)],
     {"original": E80_1, "control": E80_1, "candidate": E80_1}),
    ("mh-sell-mh-main", 10**9, 1, True, [mh_patch(pool, 243, 1)],
     {"original": E80_2, "control": E80_2, "candidate": E80_2}),
    ("mh-buy-both-main", 10**9, 1, False, [mh_patch(pool, 244, 1), mh_patch(pool, 243, 1)],
     {"original": E80_0, "control": E79_0, "candidate": E79_0}),
    ("mh-buy-both-p2", 10**9, 1, False, [mh_patch(MH.POOL2, 244, 1), mh_patch(MH.POOL2, 243, 1)],
     {"original": E80_1, "control": E79_1, "candidate": E79_1}),
    ("mh-buy-both-p3", 10**9, 1, False, [mh_patch(P3, 244, 1), mh_patch(P3, 243, 1)],
     {"original": E79_2, "control": E79_2, "candidate": E79_2}),
    ("mh-sell-both-p3", 10**9, 1, True, [mh_patch(P3, 244, 1), mh_patch(P3, 243, 1)],
     {"original": E79_0, "control": E79_0, "candidate": E79_0}),
    ("mh-sell-both-p2", 10**9, 1, True, [mh_patch(MH.POOL2, 244, 1), mh_patch(MH.POOL2, 243, 1)],
     {"original": E80_1, "control": E79_1, "candidate": E79_1}),
    ("mh-sell-both-main", 10**9, 1, True, [mh_patch(pool, 244, 1), mh_patch(pool, 243, 1)],
     {"original": E80_2, "control": E79_2, "candidate": E79_2}),
    ("mh-buy-cb-disable", 10**9, 1, False, [mh_patch(pool, 244, 1), mh_patch_flags(8)],
     {"original": mh_err(6020, "DisabledBuy", 0), "control": mh_err(6020, "DisabledBuy", 0),
      "candidate": mh_err(6020, "DisabledBuy", 0)}),
    ("mh-sell-cb-disable", 10**9, 1, True, [mh_patch(P3, 244, 1), mh_patch_flags(16)],
     {"original": mh_err(6021, "DisabledSell", 0), "control": mh_err(6021, "DisabledSell", 0),
      "candidate": mh_err(6021, "DisabledSell", 0)}),
    ("mh-buy-cb-amount0", 0, 1, False, [mh_patch(pool, 244, 1)],
     {"original": mh_err(6002, "ZeroQuoteAmount", 0), "control": mh_err(6002, "ZeroQuoteAmount", 0),
      "candidate": mh_err(6002, "ZeroQuoteAmount", 0)}),
    ("mh-buy-mh-noncanon", 10**9, 1, False, [mh_patch(pool, 243, 1), mh_patch_creator(pool)],
     {"original": mh_err(6078, "OnlyPumpPools", 0), "control": mh_err(6078, "OnlyPumpPools", 0),
      "candidate": mh_err(6078, "OnlyPumpPools", 0)}),
    ("mh-sell-mh-noncanon", 10**9, 1, True, [mh_patch(P3, 243, 1), mh_patch_creator(P3)],
     {"original": mh_err(6078, "OnlyPumpPools", 0), "control": mh_err(6078, "OnlyPumpPools", 0),
      "candidate": mh_err(6078, "OnlyPumpPools", 0)}),
]

for mindex, (label, amount, limit, sell, patches, exp_by_image) in enumerate(MH_CASES):
    index = len(report_cases)
    row = {"case": {"instruction": "multi_hop_swap", "label": label, "amount": amount,
                    "limit": limit, "sell": sell,
                    "expected_by_image": {img: {"kind": e[0],
                                                **({"deltas": e[1]} if e[0] == "ok" else
                                                   {"code": e[1], "fragment": e[2], "events": e[3]})}
                                          for img, e in exp_by_image.items()}}}
    for image, binary in IMAGES.items():
        expected = exp_by_image[image]
        cand = None if image == "original" else binary

        def ov(h, m, patches=patches, sell=sell):
            three_amm(sell)(h, m)
            for p in patches:
                p(h, m)

        r = mh_run(amount=amount, limit=limit, sell=sell, overrides=ov, candidate=cand)
        raw = base64.b64decode(r["transaction_base64"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == 1, (label, image, checks)
        before, after = r["before"], r["after"]
        fee_key = str(PAYER.pubkey())
        payer_delta = (after[fee_key]["lamports"] if after.get(fee_key) else 0) - \
                      (before[fee_key]["lamports"] if before.get(fee_key) else 0)
        err, logs = r["error"], r["logs"]
        logtext = "\n".join(logs)
        vol = after.get(str(volume))
        vol_ok = vol is not None and vol["lamports"] == 1844400 \
            and len(bytes.fromhex(vol["data_hex"])) == 137 \
            and bytes.fromhex(vol["data_hex"])[8:40] == bytes(PAYER.pubkey())
        vol_empty = vol is None or (vol["lamports"] == 0 and vol["data_hex"] == "")

        def mh_deltas(b, a):
            out = {}
            for name, key in MH_WATCH.items():
                bb, aa = b.get(str(key)), a.get(str(key))
                out[name] = None if bb is None or aa is None else \
                    amount_at(aa["data_hex"]) - amount_at(bb["data_hex"])
            return out

        if expected[0] == "ok":
            assert err is None, (label, image, err)
            deltas = mh_deltas(before, after)
            assert deltas == expected[1], (label, image, deltas, expected[1])
            assert payer_delta == -1849400, (label, image, payer_delta)
            assert vol_ok, (label, image, "volume not funded")
            assert len(r["events"]) == 3, (label, image, len(r["events"]))
            observed = {"deltas": deltas, "payer_lamports_delta": payer_delta,
                        "volume_lamports": 1844400, "volume_data_len": 137,
                        "event_count": 3, "sig_fields": 1}
        else:
            _, code, fragment, nev = expected
            assert err is not None and str(code) in err, (label, image, err)
            assert fragment in logtext, (label, image, logs[-3:])
            assert payer_delta == -5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != fee_key), \
                (label, image, "rollback")
            assert vol_empty, (label, image, "volume funded on error")
            assert len(r["events"]) == nev, (label, image, len(r["events"]), nev)
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            row.setdefault("error_sites", {})[image] = site
            observed = {"error_code": code, "fragment": fragment,
                        "payer_lamports_delta": payer_delta,
                        "event_count": nev, "sig_fields": 1}
        add_receipt({"index": index, "image": image, "instruction": "multi_hop_swap",
                     "label": label},
                    raw, [str(s) for s in tx.signatures], before, after, logs,
                    r["events"], err, payer_delta, observed,
                    {"fee_payer": fee_key, "userquote": str(userquote),
                     "u3": str(MH.U3), "buyback": str(LS_BUYBACK),
                     "vb1": str(vaultbase), "vq1": str(vaultquote),
                     "vb2": str(MH.VB2), "vq2": str(MH.VQ2),
                     "vb3": str(MH.VB3), "vq3": str(MH.VQ3),
                     "volume": str(volume)})
        row[image] = {"error": err, "logs": logs, "observed": observed}
        print(f"  {label} [{image}] observed={observed}", flush=True)
    report_cases.append(row)

# ---------------- family C: legacy sell ----------------
def ls_event_fields(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    assert len(lines) == 1, lines
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    assert len(raw) == 449, len(raw)
    return {
        "quote": struct.unpack_from("<Q", raw, 64)[0],
        "lp_fee": struct.unpack_from("<Q", raw, 80)[0],
        "protocol_fee": struct.unpack_from("<Q", raw, 96)[0],
        "user_out": struct.unpack_from("<Q", raw, 112)[0],
        "creator_bps": struct.unpack_from("<Q", raw, 344)[0],
        "creator_fee": struct.unpack_from("<Q", raw, 352)[0],
        "cashback_bps": struct.unpack_from("<Q", raw, 360)[0],
        "cashback": struct.unpack_from("<Q", raw, 368)[0],
        "buyback_fee": struct.unpack_from("<Q", raw, 384)[0],
    }


def ls_amount(snapshot, key):
    row = snapshot.get(str(key))
    return None if row is None else struct.unpack_from("<Q", bytes.fromhex(row["data_hex"]), 64)[0]


def ls_delta(before, after, key):
    b, a = ls_amount(before, key), ls_amount(after, key)
    return None if b is None or a is None else a - b


# (label, override, expected)
# ok: ("ok", deltas(ub,uq,vb,vq,proto,creator,bb), event_subset, payer, uvata, vol)
#   uvata: None | ("amount", amt_delta, lamp_delta) | ("fresh", amt, lamports)
#   vol: None | ("earned", 548, lamports) | ("absent",)
# err: ("err", code, fragment)
LS_CASES = [
    ("ls-anchor", None,
     ("ok", (-10**9, 180212, 10**9, -182458, 849, 548, 849),
      {"quote": 182495, "lp_fee": 37, "protocol_fee": 1698, "user_out": 180212,
       "creator_bps": 30, "creator_fee": 548, "cashback_bps": 0, "cashback": 0,
       "buyback_fee": 849}, -5000, None, None)),
    ("ls-cashback-present", cash(present=True),
     ("ok", (-10**9, 180212, 10**9, -182458, 849, 0, 849),
      {"quote": 182495, "lp_fee": 37, "protocol_fee": 1698, "user_out": 180212,
       "creator_bps": 0, "creator_fee": 0, "cashback_bps": 30, "cashback": 548,
       "buyback_fee": 849}, -5000, ("amount", 548, 548), ("earned", 548, 10**9))),
    ("ls-cashback-fresh", cash(present=False),
     ("ok", (-10**9, 180212, 10**9, -182458, 849, 0, 849),
      {"quote": 182495, "lp_fee": 37, "protocol_fee": 1698, "user_out": 180212,
       "creator_bps": 0, "creator_fee": 0, "cashback_bps": 30, "cashback": 548,
       "buyback_fee": 849}, -3888680, ("fresh", 548, 2039828), ("earned", 548, 1844400))),
    ("ls-cashback-std-remaining", mutate(pool, 244, b'\x01'),
     ("err", 6060, "InvalidCashbackAccumulator")),
    ("ls-mayhem", mutate(pool, 243, b'\x01'),
     ("err", 6013, "InvalidProtocolFeeRecipient")),
]

for label, override, expected in LS_CASES:
    index = len(report_cases)
    row = {"case": {"instruction": "sell", "label": label,
                    "params": {"amount": 10**9, "limit": 0},
                    "expected": {"kind": expected[0],
                                 **({"deltas": list(expected[1]), "event": expected[2],
                                     "payer": expected[3]} if expected[0] == "ok" else
                                    {"code": expected[1], "fragment": expected[2]})}}}
    seen = set()
    for image, binary in IMAGES.items():
        kw = dict(amount=10**9, limit=0)
        if override is not None:
            kw["overrides"] = override
        r = legacy_sell(candidate=binary, **kw)
        raw = base64.b64decode(r["transaction_base64"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == 1, (label, image, checks)
        before, after = r["before"], r["after"]
        fee_key = str(PAYER.pubkey())
        payer_delta = (after[fee_key]["lamports"] if after.get(fee_key) else 0) - \
                      (before[fee_key]["lamports"] if before.get(fee_key) else 0)
        err, logs = r["error"], r["logs"]
        if expected[0] == "ok":
            _, deltas, ev, payer, uvata_exp, vol_exp = expected
            assert err is None, (label, image, err)
            got = (ls_delta(before, after, LB_USERBASE), ls_delta(before, after, LB_USERQUOTE),
                   ls_delta(before, after, LB_VB), ls_delta(before, after, LB_VQ),
                   ls_delta(before, after, PROTOCOL_ATA), ls_delta(before, after, CREATOR_ATA),
                   ls_delta(before, after, LS_BUYBACK))
            assert got == deltas, (label, image, got, deltas)
            assert ls_event_fields(logs) == ev, (label, image, ls_event_fields(logs), ev)
            assert payer_delta == payer, (label, image, payer_delta, payer)
            assert len(r["events"]) == 1, (label, image, "event count")
            if uvata_exp is not None:
                uva_after = after.get(str(LS.uvata))
                assert uva_after is not None, (label, image, "uvata missing")
                if uvata_exp[0] == "amount":
                    assert ls_delta(before, after, LS.uvata) == uvata_exp[1], (label, image, "uvata amount")
                    assert (uva_after["lamports"] - before[str(LS.uvata)]["lamports"]) == uvata_exp[2], \
                        (label, image, "uvata lamports")
                else:
                    assert ls_amount(after, LS.uvata) == uvata_exp[1], (label, image, "uvata amount")
                    assert uva_after["lamports"] == uvata_exp[2], (label, image, "uvata lamports")
            if vol_exp is not None:
                vol_after = after.get(str(LS.volume))
                assert vol_after is not None, (label, image, "volume missing")
                vd = bytes.fromhex(vol_after["data_hex"])
                assert len(vd) == 137 and vd[8:40] == bytes(PAYER.pubkey()), (label, image, "volume layout")
                assert struct.unpack_from("<Q", vd, 74)[0] == vol_exp[1], (label, image, "earned")
                assert vol_after["lamports"] == vol_exp[2], (label, image, "volume lamports")
            observed = {"deltas": list(deltas), "event": ev, "payer_delta": payer_delta,
                        "event_count": 1, "sig_fields": 1}
        else:
            _, code, fragment = expected
            assert err is not None and str(code) in err, (label, image, err)
            assert fragment in "\n".join(logs), (label, image, logs[-3:])
            assert payer_delta == -5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != fee_key), \
                (label, image, "rollback")
            assert len(r["events"]) == 0, (label, image, "unexpected event")
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            if site is None:
                site = next((l for l in logs if "AnchorError occurred." in l), None)
            row.setdefault("error_sites", {})[image] = site
            observed = {"error_code": code, "fragment": fragment,
                        "payer_delta": payer_delta, "event_count": 0, "sig_fields": 1}
        seen.add(json.dumps(observed, sort_keys=True))
        add_receipt({"index": index, "image": image, "instruction": "sell", "label": label},
                    raw, [str(s) for s in tx.signatures], before, after, logs,
                    r["events"], err, payer_delta, observed,
                    {"fee_payer": fee_key, "userbase": str(LB_USERBASE),
                     "userquote": str(LB_USERQUOTE), "vaultbase": str(LB_VB),
                     "vaultquote": str(LB_VQ), "protocol_ata": str(PROTOCOL_ATA),
                     "creator_ata": str(CREATOR_ATA), "buyback": str(LS_BUYBACK),
                     "volume": str(LS.volume), "uvata": str(LS.uvata)})
        row[image] = {"error": err, "logs": logs, "observed": observed}
        print(f"  {label} [{image}] observed={observed}", flush=True)
    assert len(seen) == 1, (label, "legacy images must agree", seen)
    report_cases.append(row)

# ---------------- report + parts ----------------
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
    "evidence/original/pump/deployed.so",
    "evidence/upstream/pump_amm.json",
    "evidence/upstream/pump.json",
    "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json",
    "research/imported-lab/analysis/pump_fun/config-snapshot.json",
    "scripts/pump_amm_admin_differential.py",
    "scripts/pump_amm_liquidity_differential.py",
    "scripts/pump_amm_reusable_harness.py",
    "scripts/pump_amm_trade_v2_differential.py",
    "scripts/pump_amm_legacy_sell_differential.py",
    "scripts/pump_amm_legacy_buy_differential.py",
    "scripts/pump_amm_multi_hop_differential.py",
]
divergent = [c["case"]["label"] for c in report_cases
             if c["case"].get("expected_by_image") and
             len({json.dumps(v, sort_keys=True) for v in c["case"]["expected_by_image"].values()}) > 1]
report = {
    "schema": 1, "packet": "amm-trade-mode-gates-20261029",
    "case_count": len(report_cases), "mismatches": [],
    "scope": ("trade_v2, multi_hop_swap and legacy sell on pools whose "
              "is_cashback_coin (byte 244) or is_mayhem_mode (byte 243) "
              "flag is set, pinned on all 3 images (original / #424 "
              "control / #427 candidate). v2 rejects cashback pools "
              "with 6079 on all handlers and trades mayhem pools with "
              "buyback forced to 0. Multi-hop enforces mayhem at every "
              "hop on all images, but cashback enforcement DIVERGES: "
              "the rebuilt images enforce 6079 at every hop, while the "
              "original enforces it only at the creator-fee hop "
              "(last hop on buys, first hop on sells; P3 in this "
              "route). Legacy sell accepts cashback pools (creator "
              "fee diverted to the cashback accumulator) and rejects "
              "mayhem pools with 6013 (reserved-recipient rule). "
              "Fresh VM per case per image. Receipts are stored as "
              "parts to stay under GitHub's 25MB web-upload limit; "
              "verify.py reads them in order. No source change, "
              "build, or whole-program equivalence claim."),
    "image_sha256": IMAGE_SHA,
    "cases": report_cases,
    "divergent_cases": divergent,
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
print("NEXT: write verify.py into the packet dir, then generate MANIFEST.json")

sites_lines = []
for row in report_cases:
    case = row["case"]
    if "error_sites" not in row:
        continue
    per = []
    for image in ("original", "control", "candidate"):
        site = row.get("error_sites", {}).get(image, "") or ""
        if site and "thrown in" in site:
            site = site.split("thrown in", 1)[1].strip()
        elif site:
            site = site.replace("Program log: ", "")
        per.append(f"{image} {site}")
    sites_lines.append(f"- {case['label']}: " + "; ".join(per))
SITES = "\n".join(sites_lines)

README = f"""# Trade mode gates: cashback and mayhem pool flags across v2, multi-hop, and legacy sell

## Problem

Every pool carries two mode flags -- is_mayhem_mode (byte 243)
and is_cashback_coin (byte 244) -- but the three trade paths
do not treat them the same, and no earlier packet pinned the
matrix: v2 trades, multi-hop swaps, and legacy sells each
check (or skip) these flags at different points, and the
deployed program and the reconstruction disagree on one
whole axis of it. The flags were only ever patched as
background state before (mayhem tier selection in #29,
cashback-claim indifference in #28, mayhem reserved-recipient
validation in #43's binding); the trade-path gates themselves
were unpinned.

## Cases

{len(report_cases)} cases x 3 images (original / #424 control /
#427 candidate), {len(receipts_global)} signed receipts, parts
{[p["receipts"] for p in parts]}. Three families, each on its
own harness with a fresh VM per case per image.

Family A -- trade_v2, single tier (0, lp 10 / protocol 111 /
creator 0 bps), VB 10^12, VQ 10^10, supply 10^12, accrued 0,
vq 0 (the #33/#38 fixture):
- v2-buy-anchor / v2-sell-anchor / v2-buyexact-anchor: the
  non-flag baselines (buy 10^6 spends 10124, vault +10068,
  buyback 56; sell 10^6 pays 9878, vault -9933, buyback 55;
  buy_exact 10000 outs 987899, vault +9945, buyback 55).
- v2-buy-cashback / v2-sell-cashback /
  v2-buyexact-cashback: all three handlers fail 6079
  CashbackCoinNotSupported, payer -5,000 only, 0 events,
  pool bytes unchanged, no volume accumulator.
- v2-buy-cashback-disable / v2-sell-cashback-disable:
  disable_flags beats cashback (6020 / 6021).
- v2-buy-cashback-amount0 / v2-buy-cashback-limit0:
  cashback beats the zero guards (6079, not 6001/6002).
- v2-buy-badbb / v2-buy-cashback-badbb: cashback beats
  buyback-recipient validation (a non-token buyback account
  alone fails 6027; with cashback it fails 6079).
- v2-buy-mayhem / v2-sell-mayhem / v2-buyexact-mayhem:
  mayhem pools trade fine with buyback forced to 0 -- same
  spend/receipt as the anchors, different vault/pool split
  (buy vault +10124, pool protocol +112, vq -112; sell vault
  -9878, pool protocol +111, vq -111; buy_exact vault
  +10000, pool protocol +110, vq -110).
- v2-buy-both / v2-sell-both: both flags set, 6079
  (cashback first).

Family B -- multi_hop_swap, 3 AMM hops (tail pool
quote<->base -> POOL2 base<->BASE2 -> P3 BASE2<->BASE3;
#5 anchors: buy 10^9 lands 5,315,084,721,958 in U3, buyback
+4,607,153; sell 10^9 lands 180,345, buyback +846):
- mh-buy-anchor / mh-sell-anchor: the baselines.
- mh-buy-cb-main / -p2 / -p3 / -all and mh-sell-cb-p3 /
  -p2 / -main / -all: the cashback matrix -- see the
  divergence pin below.
- mh-buy-mh-main / -p2 / -p3 and mh-sell-mh-p3 / -p2 /
  -main: mayhem at every hop, all images agree (6080,
  0/1/2 prior-hop events for hop 1/2/3 failures).
- mh-buy-both-main / -p2 / -p3 and mh-sell-both-p3 / -p2 /
  -main: both flags -- at an enforced hop 6079 wins, at an
  ignored hop only 6080 fires (original); rebuilt images
  always fail 6079 at the first failing hop.
- mh-buy-cb-disable / mh-sell-cb-disable: disable beats
  mode (6020 / 6021). mh-buy-cb-amount0: the amount guard
  beats the hop checks (6002). mh-buy-mh-noncanon /
  mh-sell-mh-noncanon: canonical beats mode (6078).

Family C -- legacy sell (#13 fixture, sell 10^9):
- ls-anchor: user +180,212, vault -182,458, legs
  protocol 849 / creator 548 / buyback 849 (ATA deltas; the
  SellEvent protocol_fee field itself reports the gross 1698
  = net 849 + buyback 849).
- ls-cashback-present / ls-cashback-fresh: the cashback
  remaining layout [accumulator ATA, accumulator PDA,
  pool-v2, buyback owner, buyback dest] SUCCEEDS -- same
  token deltas except the creator leg is 0 and the 548
  lands in the accumulator's ATA as cashback (event
  creator_fee 0 / cashback 548 / cashback_bps 30,
  accumulator cashback_earned +548). Pre-created
  accumulator: payer -5,000 only. Fresh accumulator + ATA:
  payer -3,888,680 (5,000 fee + 1,844,400 accumulator rent
  + 2,039,280 ATA rent; the ATA is native, so its lamports
  land at 2,039,280 + 548).
- ls-cashback-std-remaining: standard 3-account remaining
  on a cashback pool fails 6060
  InvalidCashbackAccumulator.
- ls-mayhem: a mayhem pool fails 6013
  InvalidProtocolFeeRecipient -- mayhem pools validate
  the protocol recipient against the RESERVED list, and
  the fixture recipient is not reserved.

## Result

- v2 rejects cashback pools outright. buy_v2, sell_v2 and
  buy_exact_quote_in_v2 all fail 6079 in prepare(), before
  curve math, transfers, or volume funding -- payer -5,000
  only, 0 events, pool unchanged. The gate order is
  disable_flags > cashback > zero guards and buyback
  validation: disable wins over cashback, cashback wins
  over amount/limit zero guards and over recipient
  validation.
- v2 trades mayhem pools with buyback forced to 0. Pricing
  is unchanged (same tier, same spend/receipt as the
  anchors); only the split moves: the buyback leg goes to
  the vault instead, and the pool accrues the full protocol
  fee (buy: vault +10124 vs +10068, pool protocol +112 vs
  +56; sell: vault -9878 vs -9933, pool protocol +111 vs
  +56; buy_exact: vault +10000 vs +9945, pool protocol
  +110 vs +55).
- DIVERGENCE -- multi-hop cashback enforcement differs
  between the deployed program and the reconstruction.
  Rebuilt images enforce 6079 at EVERY hop, before mayhem:
  the first failing hop fails with 0/1/2 prior-hop events.
  The ORIGINAL image enforces 6079 only at the
  CREATOR-FEE hop: on buys the creator fee is paid at the
  last hop, on sells at the first hop, and in this route
  that hop is P3 in both directions -- so original buys
  ignore cashback on the tail pool and POOL2 (both succeed
  with anchor-identical deltas) and fail only at P3, and
  original sells ignore cashback on POOL2 and the tail pool
  and fail only at P3. Both-flags cells confirm the order:
  at an enforced hop the original fails 6079, at an
  ignored hop it fails 6080 (mayhem only). Mayhem
  enforcement does NOT diverge: 6080 fires at every hop
  on all three images.
- Multi-hop order pins (all images): disable beats mode,
  the amount guard beats the hop checks, canonical beats
  mode (6078 before 6079/6080).
- Legacy sell is the odd one out: it ACCEPTS cashback
  pools and diverts the creator fee into the cashback
  accumulator (548 to the accumulator ATA, creator leg 0,
  event cashback 548), while v2 and multi-hop reject the
  same pool with 6079. But it rejects mayhem pools with
  6013, because mayhem switches protocol-recipient
  validation to the reserved list.
- Every success funds the volume accumulator with
  1,844,400 lamports (137 bytes, payer key [8:40]) except
  legacy sells, which fund nothing (payer -5,000, or
  -3,888,680 when the cashback accumulator + ATA are
  created fresh). Every failure rolls back fully except
  the payer fee; multi-hop failures retain the completed
  hops' events in the logs (0/1/2 by failing hop).

Error sites (original / rebuilt):

{SITES}

## Limits

Offline LiteSVM synthetic fixtures only. No source change,
build, or whole-program equivalence claim. The creator-fee-hop
rule for the original image is the observed gate pattern
(buy-last / sell-first, P3 in this route), stated as the
failing-hop pattern rather than as original-source text,
which is not in this tree. Flag bytes, amounts, and event
offsets are exact for these fixtures, not claims about
other pool states or mainnet settings. Legacy buy on
cashback pools (which needs its own remaining-account
layout) is not covered here; only legacy sell is.
"""
(OUT / "README.md").write_text(README)
print("wrote:", OUT / "README.md")
