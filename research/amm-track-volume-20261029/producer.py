#!/usr/bin/env python3
"""Build research/amm-track-volume-20261029 receipts.

2nd run packet #48: the legacy buy track_volume flag and the
current_sol_volume field across every AMM trade path.

Source (instructions/swap/buy.rs execute, trade_v2.rs,
multi_hop_swap.rs, legacy sell, state/volume_accumulator.rs):
- legacy buy takes track_volume as an OptionBool argument
  (lib.rs buy / buy_exact_quote_in). The handler never reads it
  except to echo it into the BuyEvent (buy.rs:372
  `track_volume: track`). It never adds the spend to
  user_volume_accumulator.current_sol_volume, and it never
  touches any other accumulator field: the only accumulator
  write in the handler is `a.user_volume_accumulator.user =
  a.user.key()` (buy.rs:339), unconditional;
- trade_v2 and multi_hop_swap have no track argument at all:
  their events hardcode track_volume: false (trade.rs:203,
  multi_hop_swap.rs:819, boost_burn.rs:78), and they write the
  accumulator user field ONLY when it is still the default
  pubkey (trade_v2.rs:404-405, multi_hop_swap.rs:446-447) --
  the opposite of legacy buy's unconditional overwrite;
- legacy sell has no volume account in its account list at all
  (its only volume contact is the cashback remaining path,
  which writes cashback_earned, never current_sol_volume);
- current_sol_volume is never written by any trade path in
  this tree: only incentives::claim reads it (to compute a
  reward from externally seeded volume, 2nd #4) and
  incentives::sync only resets total_claimed_tokens. So a
  buy with track=1 followed by nothing leaves nothing
  claimable: volume stays exactly where the fixture put it.
- the track byte itself is an OptionBool: byte 2 fails
  deserialization with 102 InstructionDidNotDeserialize
  before any account work (accumulator never created), while
  a missing track byte deserializes as None and succeeds
  with track_volume=false in the event.

Cases (26): legacy buy / buy_exact fresh with track 0 vs 1
(byte-identical except event byte 360); legacy buy /
buy_exact on a fully pre-seeded accumulator (track 0 and 1:
accumulator bytes byte-identical before/after); the
user-field overwrite divergence (legacy buy overwrites an
OUTSIDER user field to the signer, v2 buy/sell/buy_exact and
1-hop multi-hop buy leave it OUTSIDER); v2 buy/sell/
buy_exact fresh (event track byte 0, fresh accumulator) and
pre-seeded (byte-identical); legacy sell pre-seeded
(byte-identical: no volume account) and legacy sell on a
cashback pool pre-seeded (cashback_earned 555 -> 1103, sol
unchanged); track byte 2 -> 102 and track byte absent ->
success with track=false; 1-hop multi-hop buy fresh and
1-hop multi-hop sell pre-seeded.

Accumulator seed (137 bytes): discriminator + user +
needs_claim=1, total_unclaimed=111, total_claimed=222,
current_sol_volume=333444, last_update_timestamp=999,
has_total_claimed_tokens=1, cashback_earned=555,
total_cashback_claimed=666. Field offsets: user 8..40,
needs 40, unclaimed 41..49, claimed 49..57, sol 57..65,
last 65..73, has 73, earned 74..82, cb_claimed 82..90.
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
from solders.clock import Clock
from solders.instruction import AccountMeta, Instruction
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

import pump_amm_trade_v2_differential as tv2
from pump_amm_legacy_buy_differential import legacy_buy, IDL
from pump_amm_legacy_sell_differential import (
    legacy as legacy_sell, cash as sell_cash, combine, mutate,
    volume, pool, PAYER, OUTSIDER, PROGRAM,
    userbase, userquote, vaultbase, vaultquote, PROTOCOL_ATA, CREATOR_ATA,
    buyback, CONFIG_KEY,
)
from pump_amm_multi_hop_differential import run as mh_run


def v2_run(name, amount, limit, overrides=None, binary=None):
    """Replicate pump_amm_trade_v2_differential.trade() setup exactly,
    but retain before/after snapshots and the signed transaction so
    receipts verify like every other kind."""
    h = tv2.acquire_harness(binary or ROOT / "evidence/original/pump_amm/deployed.so")
    h.vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, filepath in [(tv2.TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                          (tv2.TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so"),
                          (tv2.FEES, "evidence/original/pump_fees/deployed.so")]:
        h.vm.add_program_from_file(pid, ROOT / filepath)
    glob = bytearray(tv2.RAW)
    glob[56] = 0
    h.vm.set_account(tv2.CONFIG_KEY, Account(tv2.CONFIG["lamports"], bytes(glob), tv2.PROGRAM))
    for n, row in tv2.f["accounts"].items():
        h.vm.set_account(Pubkey.from_string(row["address"]),
                         Account(row["lamports"], base64.b64decode(row["data_base64"]),
                                 Pubkey.from_string(row["owner"])))
    for k, m, native in [(tv2.userbase, tv2.base, False), (tv2.userquote, tv2.quote, True)]:
        h.vm.set_account(k, Account(10**15 + 2039280 if native else 10**9,
                                    tv2.token(m, PAYER_KEY, 10**15, native), tv2.TOKEN))
    h.vm.set_account(tv2.volume, Account(0, b"", Pubkey.default()))
    ix = next(x for x in tv2.IDL["instructions"] if x["name"] == name)
    keys = [tv2.pool, PAYER_KEY, tv2.CONFIG_KEY, tv2.base, tv2.quote, tv2.userbase,
            tv2.userquote, tv2.vaultbase, tv2.vaultquote, tv2.TOKEN, tv2.TOKEN,
            Pubkey.default(), tv2.volume, tv2.feeconfig, tv2.buyback, tv2.EVENT, tv2.PROGRAM]
    metas = [AccountMeta(k, bool(row.get("signer")), bool(row.get("writable")))
             for k, row in zip(keys, ix["accounts"])]
    if overrides:
        overrides(h, metas)
    data = bytes(ix["discriminator"]) + struct.pack("<QQ", amount, limit)

    def snap():
        out = {}
        for k in sorted({m.pubkey for m in metas} | {PAYER_KEY}, key=str):
            a = h.vm.get_account(k)
            if not a or not a.executable:
                out[str(k)] = None if not a else {"data_hex": bytes(a.data).hex(),
                                                  "lamports": a.lamports,
                                                  "owner": str(a.owner)}
        return out

    before = snap()
    tx = Transaction.new_signed_with_payer(
        [Instruction(tv2.PROGRAM, data, metas)], PAYER_KEY, [PAYER], h.vm.latest_blockhash())
    assert tx.verify_with_results() and all(tx.verify_with_results())
    r = h.vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    return {"error": str(r.err()) if failed else None, "logs": meta.logs(),
            "events": [x for x in meta.logs() if x.startswith("Program data: ")],
            "before": before, "after": snap(),
            "transaction_base64": base64.b64encode(bytes(tx)).decode()}

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-track-volume-20261029"
WS = Path.home() / "workspace/slop-verify"
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
PAYER_KEY = PAYER.pubkey()
OUTSIDER_KEY = OUTSIDER.pubkey()
DISC = bytes(next(x for x in IDL["accounts"]
                  if x["name"] == "UserVolumeAccumulator")["discriminator"])

SEED = dict(needs=1, unclaimed=111, claimed=222, sol=333444, last=999,
            has=1, earned=555, cb_claimed=666)


def seed_bytes(user_key, earned=None):
    raw = DISC + bytes(user_key) + bytes([SEED["needs"]]) \
        + struct.pack("<Q", SEED["unclaimed"]) + struct.pack("<Q", SEED["claimed"]) \
        + struct.pack("<Q", SEED["sol"]) + struct.pack("<q", SEED["last"]) \
        + bytes([SEED["has"]]) + struct.pack("<Q", SEED["earned"] if earned is None else earned) \
        + struct.pack("<Q", SEED["cb_claimed"])
    return raw.ljust(137, b"\0")


def fresh_bytes():
    return DISC + bytes(PAYER_KEY) + bytes(97)


def vol_seed(user_key, earned=None):
    data = seed_bytes(user_key, earned)
    def ov(h, m):
        h.vm.set_account(volume, Account(10**9, data, PROGRAM))
    return ov


def sha(data):
    return hashlib.sha256(data).hexdigest()


def amount_at(data_hex, offset=64):
    if data_hex is None:
        return None
    raw = bytes.fromhex(data_hex)
    if len(raw) < offset + 8:
        return None
    return struct.unpack_from("<Q", raw, offset)[0]


def vol_bytes(snap):
    if snap is None:
        return None
    return snap["data_hex"]


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


def decode_tuple_event(logs, length, track=None):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    if len(raw) != length:
        return None
    tup = tuple(struct.unpack_from("<Q", raw, off)[0]
                for off in (16, 24, 64, 72, 80, 88, 96, 104, 112))
    if track is not None:
        assert raw[360] == track, (raw[360], track)
    return {"tuple": list(tup), "length": length, "track": track}


def pool_fields(data_hex):
    raw = bytes.fromhex(data_hex)
    return {"vq": struct.unpack_from("<q", raw, 245)[0],
            "proto": struct.unpack_from("<Q", raw, 271)[0],
            "creator": struct.unpack_from("<Q", raw, 279)[0]}


# ---------------- expected values ----------------
BUY_EV = {"lp_bps": 2, "proto_bps": 93, "bb_bps": 5000, "cb_bps": 0, "cb": 0}
BUY_ANCHOR = dict(BUY_EV, out=10**10, max_=10**12, curve=1824983, lp=365,
                  proto=16973, qwlp=1825348, uqin=1847796, creator_bps=30,
                  creator=5475, min_base=10**10, bb=8486)
BUYEX_ANCHOR = dict(BUY_EV, out=54115018303, max_=10**7, curve=10000000, lp=1976,
                    proto=91852, qwlp=9878518, uqin=9876542, creator_bps=30,
                    creator=29630, min_base=1, bb=45926)
BUY_DELTAS = {"userbase": 10**10, "userquote": -1847796, "vaultbase": -10**10,
              "vaultquote": 1825348, "protocol_ata": 8487, "creator_ata": 5475,
              "buyback": 8486}
BUYEX_DELTAS = {"userbase": 54115018303, "userquote": -10000000,
                "vaultbase": -54115018303, "vaultquote": 9878518,
                "protocol_ata": 45926, "creator_ata": 29630, "buyback": 45926}
SELL_DELTAS = {"userbase": -10**9, "userquote": 180212, "vaultbase": 10**9,
               "vaultquote": -182458, "protocol_ata": 849, "creator_ata": 548,
               "buyback": 849}
SELL_CB_DELTAS = dict(SELL_DELTAS, creator_ata=0)
SELL_TUP = [10**9, 1, 182495, 2, 37, 93, 1698, 182458, 180212]
V2_BUY_DELTAS = {"userbase": 10**6, "userquote": -187, "vaultbase": -10**6,
                 "vaultquote": 186, "buyback": 1}
V2_SELL_DELTAS = {"userbase": -10**6, "userquote": 178, "vaultbase": 10**6,
                  "vaultquote": -179, "buyback": 1}
V2_BUYEX_DELTAS = {"userbase": 54110917, "userquote": -10000,
                   "vaultbase": -54110917, "vaultquote": 9954, "buyback": 46}
V2_BUY_TUP = [10**6, 10**12, 183, 2, 1, 93, 2, 184, 187]
V2_SELL_TUP = [10**6, 1, 182, 2, 1, 93, 2, 181, 178]
V2_BUYEX_TUP = [54110917, 10**4, 10**4, 2, 2, 93, 92, 9878, 9876]
V2_BUY_POOL = {"vq": -2, "proto": 1, "creator": 1}
V2_BUYEX_POOL = {"vq": -76, "proto": 46, "creator": 30}
MH_BUY_DELTAS = {"userbase": 5368809031467, "userquote": -10**9,
                 "vaultbase": -5368809031467, "vaultquote": 995407407,
                 "buyback": 4592593}
MH_BUY_TUP = [5368809031467, 10**9, 10**9, 2, 197531, 93, 9185186, 987851851, 987654320]
# 1-hop multi-hop sell differs from legacy sell in the vault leg:
# the vault pays only receipt + buyback (180212 + 849 = 181061);
# protocol (849) and creator (548) do NOT leave the vault here --
# they accrue to pool state, unlike legacy sell's -182458 vault
# leg (180212 + 849 + 548 + 849). The mh snapshot watches no
# protocol/creator ATA, so those two legs are asserted only via
# this exact vault-leg arithmetic, not via ATA deltas.
MH_SELL_DELTAS = {"userbase": -10**9, "userquote": 180212, "vaultbase": 10**9,
                  "vaultquote": -181061, "buyback": 849}

FRESH = 1849400
FEE = 5000


def ok(deltas, event, payer, vol_after, pool_after=None):
    return {"kind": "ok", "deltas": deltas, "event": event, "payer": payer,
            "vol_after": vol_after, "pool_after": pool_after}


def err(code, fragment):
    return {"kind": "err", "code": code, "fragment": fragment, "payer": FEE}


# case: (family, kind, instruction, label, runner_kwargs, expected)
# kind: legacy_buy | legacy_sell | v2 | mh
# vol_after: ("fresh",) | ("seed", user, earned) | ("seed_user_to_payer",)
CASES = [
    ("A", "legacy_buy", "buy", "buy-fresh-track0",
     dict(name="buy", amount=10**10, limit=10**12, track=b"\x00"),
     ok(BUY_DELTAS, dict(BUY_ANCHOR, track=0), FRESH, ("fresh",))),
    ("A", "legacy_buy", "buy", "buy-fresh-track1",
     dict(name="buy", amount=10**10, limit=10**12, track=b"\x01"),
     ok(BUY_DELTAS, dict(BUY_ANCHOR, track=1), FRESH, ("fresh",))),
    ("A", "legacy_buy", "buy_exact_quote_in", "buyexact-fresh-track0",
     dict(name="buy_exact_quote_in", amount=10**7, limit=1, track=b"\x00"),
     ok(BUYEX_DELTAS, dict(BUYEX_ANCHOR, track=0), FRESH, ("fresh",))),
    ("A", "legacy_buy", "buy_exact_quote_in", "buyexact-fresh-track1",
     dict(name="buy_exact_quote_in", amount=10**7, limit=1, track=b"\x01"),
     ok(BUYEX_DELTAS, dict(BUYEX_ANCHOR, track=1), FRESH, ("fresh",))),
    ("B", "legacy_buy", "buy", "buy-seeded-track1",
     dict(name="buy", amount=10**10, limit=10**12, track=b"\x01",
          overrides=vol_seed(PAYER_KEY)),
     ok(BUY_DELTAS, dict(BUY_ANCHOR, track=1), FEE, ("seed", PAYER_KEY, None))),
    ("B", "legacy_buy", "buy", "buy-seeded-track0",
     dict(name="buy", amount=10**10, limit=10**12, track=b"\x00",
          overrides=vol_seed(PAYER_KEY)),
     ok(BUY_DELTAS, dict(BUY_ANCHOR, track=0), FEE, ("seed", PAYER_KEY, None))),
    ("B", "legacy_buy", "buy_exact_quote_in", "buyexact-seeded-track1",
     dict(name="buy_exact_quote_in", amount=10**7, limit=1, track=b"\x01",
          overrides=vol_seed(PAYER_KEY)),
     ok(BUYEX_DELTAS, dict(BUYEX_ANCHOR, track=1), FEE, ("seed", PAYER_KEY, None))),
    ("C", "legacy_buy", "buy", "buy-outsider-user",
     dict(name="buy", amount=10**10, limit=10**12, track=b"\x01",
          overrides=vol_seed(OUTSIDER_KEY)),
     ok(BUY_DELTAS, dict(BUY_ANCHOR, track=1), FEE, ("seed_user_to_payer",))),
    ("C", "legacy_buy", "buy_exact_quote_in", "buyexact-outsider-user",
     dict(name="buy_exact_quote_in", amount=10**7, limit=1, track=b"\x01",
          overrides=vol_seed(OUTSIDER_KEY)),
     ok(BUYEX_DELTAS, dict(BUYEX_ANCHOR, track=1), FEE, ("seed_user_to_payer",))),
    ("C", "v2", "buy_v2", "v2buy-outsider-user",
     dict(name="buy_v2", amount=10**6, limit=10**12, overrides=vol_seed(OUTSIDER_KEY)),
     ok(V2_BUY_DELTAS, {"tuple": V2_BUY_TUP, "length": 500, "track": 0},
        FEE, ("seed", OUTSIDER_KEY, None), V2_BUY_POOL)),
    ("C", "v2", "sell_v2", "v2sell-outsider-user",
     dict(name="sell_v2", amount=10**6, limit=1, overrides=vol_seed(OUTSIDER_KEY)),
     ok(V2_SELL_DELTAS, {"tuple": V2_SELL_TUP, "length": 449, "track": None},
        FEE, ("seed", OUTSIDER_KEY, None), V2_BUY_POOL)),
    ("C", "v2", "buy_exact_quote_in_v2", "v2buyexact-outsider-user",
     dict(name="buy_exact_quote_in_v2", amount=10**4, limit=1,
          overrides=vol_seed(OUTSIDER_KEY)),
     ok(V2_BUYEX_DELTAS, {"tuple": V2_BUYEX_TUP, "length": 515, "track": 0},
        FEE, ("seed", OUTSIDER_KEY, None), V2_BUYEX_POOL)),
    ("C", "mh", "multi_hop_swap", "mhbuy-outsider-user",
     dict(amount=10**9, limit=1, overrides=vol_seed(OUTSIDER_KEY)),
     ok(MH_BUY_DELTAS, {"tuple": MH_BUY_TUP, "length": 508, "track": 0},
        FEE, ("seed", OUTSIDER_KEY, None))),
    ("D", "v2", "buy_v2", "v2buy-seeded",
     dict(name="buy_v2", amount=10**6, limit=10**12, overrides=vol_seed(PAYER_KEY)),
     ok(V2_BUY_DELTAS, {"tuple": V2_BUY_TUP, "length": 500, "track": 0},
        FEE, ("seed", PAYER_KEY, None), V2_BUY_POOL)),
    ("D", "v2", "sell_v2", "v2sell-seeded",
     dict(name="sell_v2", amount=10**6, limit=1, overrides=vol_seed(PAYER_KEY)),
     ok(V2_SELL_DELTAS, {"tuple": V2_SELL_TUP, "length": 449, "track": None},
        FEE, ("seed", PAYER_KEY, None), V2_BUY_POOL)),
    ("D", "v2", "buy_exact_quote_in_v2", "v2buyexact-seeded",
     dict(name="buy_exact_quote_in_v2", amount=10**4, limit=1,
          overrides=vol_seed(PAYER_KEY)),
     ok(V2_BUYEX_DELTAS, {"tuple": V2_BUYEX_TUP, "length": 515, "track": 0},
        FEE, ("seed", PAYER_KEY, None), V2_BUYEX_POOL)),
    ("E", "v2", "buy_v2", "v2buy-fresh",
     dict(name="buy_v2", amount=10**6, limit=10**12),
     ok(V2_BUY_DELTAS, {"tuple": V2_BUY_TUP, "length": 500, "track": 0},
        FRESH, ("fresh",), V2_BUY_POOL)),
    ("E", "v2", "sell_v2", "v2sell-fresh",
     dict(name="sell_v2", amount=10**6, limit=1),
     ok(V2_SELL_DELTAS, {"tuple": V2_SELL_TUP, "length": 449, "track": None},
        FRESH, ("fresh",), V2_BUY_POOL)),
    ("E", "v2", "buy_exact_quote_in_v2", "v2buyexact-fresh",
     dict(name="buy_exact_quote_in_v2", amount=10**4, limit=1),
     ok(V2_BUYEX_DELTAS, {"tuple": V2_BUYEX_TUP, "length": 515, "track": 0},
        FRESH, ("fresh",), V2_BUYEX_POOL)),
    ("F", "legacy_sell", "sell", "sell-seeded",
     dict(amount=10**9, limit=1, overrides=vol_seed(PAYER_KEY)),
     ok(SELL_DELTAS, {"tuple": SELL_TUP, "length": 449, "track": None},
        FEE, ("seed", PAYER_KEY, None))),
    ("F", "legacy_sell", "sell", "sell-cashback-seeded",
     dict(amount=10**9, limit=1,
          overrides=combine(sell_cash(True), vol_seed(PAYER_KEY))),
     ok(SELL_CB_DELTAS, {"tuple": SELL_TUP, "length": 449, "track": None},
        FEE, ("seed", PAYER_KEY, 1103))),
    ("G", "legacy_buy", "buy", "buy-track2",
     dict(name="buy", amount=10**10, limit=10**12, track=b"\x02"),
     err("102", "InstructionDidNotDeserialize")),
    ("G", "legacy_buy", "buy", "buy-track-absent",
     dict(name="buy", amount=10**10, limit=10**12, track=b""),
     ok(BUY_DELTAS, dict(BUY_ANCHOR, track=0), FRESH, ("fresh",))),
    ("G", "legacy_buy", "buy_exact_quote_in", "buyexact-track2",
     dict(name="buy_exact_quote_in", amount=10**7, limit=1, track=b"\x02"),
     err("102", "InstructionDidNotDeserialize")),
    ("H", "mh", "multi_hop_swap", "mhbuy-fresh",
     dict(amount=10**9, limit=1),
     ok(MH_BUY_DELTAS, {"tuple": MH_BUY_TUP, "length": 508, "track": 0},
        FRESH, ("fresh",))),
    ("H", "mh", "multi_hop_swap", "mhsell-seeded",
     dict(amount=10**9, limit=1, sell=True, overrides=vol_seed(PAYER_KEY)),
     ok(MH_SELL_DELTAS, {"tuple": SELL_TUP, "length": 449, "track": None},
        FEE, ("seed", PAYER_KEY, None))),
]

ROLE_KEYS = {
    "fee_payer": PAYER_KEY, "pool": pool, "global_config": CONFIG_KEY,
    "userbase": userbase, "userquote": userquote, "vaultbase": vaultbase,
    "vaultquote": vaultquote, "protocol_ata": PROTOCOL_ATA,
    "creator_ata": CREATOR_ATA, "buyback": buyback, "volume": volume,
}
ROLE_STR = {k: str(v) for k, v in ROLE_KEYS.items()}


def expected_vol_bytes(spec):
    if spec[0] == "fresh":
        return fresh_bytes().hex()
    if spec[0] == "seed":
        return seed_bytes(spec[1], spec[2]).hex()
    if spec[0] == "seed_user_to_payer":
        return seed_bytes(PAYER_KEY, None).hex()
    raise AssertionError(spec)


def run_case(family, kind, ix_name, label, kwargs, exp, binary):
    if kind == "legacy_buy":
        r = legacy_buy(candidate=binary, **kwargs)
        before, after = r["before"], r["after"]
        get = lambda snap, key: snap.get(str(key))
        events = r["events"]
        logs = r["logs"]
    elif kind == "legacy_sell":
        r = legacy_sell(candidate=binary, **kwargs)
        before, after = r["before"], r["after"]
        get = lambda snap, key: snap.get(str(key))
        events = r["events"]
        logs = r["logs"]
    elif kind == "v2":
        r = v2_run(kwargs["name"], kwargs["amount"], kwargs["limit"],
                   overrides=kwargs.get("overrides"), binary=binary)
        before, after = r["before"], r["after"]
        get = lambda snap, key: snap.get(str(key))
        events = r["events"]
        logs = r["logs"]
    elif kind == "mh":
        r = mh_run(candidate=binary, **kwargs)
        before, after = r["before"], r["after"]
        get = lambda snap, key: snap.get(str(key))
        events = r["events"]
        logs = r["logs"]
    else:
        raise AssertionError(kind)

    payer_key = str(PAYER_KEY)
    b, a = get(before, PAYER_KEY), get(after, PAYER_KEY)
    payer_paid = b["lamports"] - a["lamports"] if b and a else None

    vol_a = get(after, volume)
    vol_after_hex = vol_a["data_hex"] if vol_a else None
    vol_after_lam = vol_a["lamports"] if vol_a else None

    if exp["kind"] == "ok":
        assert not r["error"], (label, binary, r["error"])
        assert len(events) == 1, (label, binary, events)
        exact = ix_name == "buy_exact_quote_in"
        if kind == "legacy_buy":
            ev = decode_buy_event(logs, exact)
            ev_cmp = dict(exp["event"])
            ev_cmp["max"] = ev_cmp.pop("max_")
            assert ev == ev_cmp, (label, binary, ev, ev_cmp)
        else:
            ev = decode_tuple_event(logs, exp["event"]["length"], exp["event"]["track"])
            assert ev == exp["event"], (label, binary, ev, exp["event"])
        deltas = {}
        for name, want in exp["deltas"].items():
            key = ROLE_KEYS[name]
            b = get(before, key)
            a = get(after, key)
            assert a, (label, binary, name, "missing after snapshot")
            b_amt = amount_at(b["data_hex"]) if b else 0
            got = amount_at(a["data_hex"]) - b_amt
            assert got == want, (label, binary, name, got, want)
            deltas[name] = got
        assert payer_paid == exp["payer"], (label, binary, payer_paid, exp["payer"])
        want_vol = expected_vol_bytes(exp["vol_after"])
        assert vol_after_hex == want_vol, (label, binary, vol_after_hex, want_vol)
        if exp["vol_after"][0] == "fresh":
            assert vol_after_lam == 1844400, (label, binary, vol_after_lam)
        else:
            assert vol_after_lam == 10**9, (label, binary, vol_after_lam)
        pool_after = None
        if exp.get("pool_after") is not None:
            pa = pool_fields(after[str(pool)]["data_hex"])
            pool_after = {"vq_delta": pa["vq"] - (-125882),
                          "proto_delta": pa["proto"] - 2488,
                          "creator_delta": pa["creator"] - 123394}
            assert pool_after == {"vq_delta": exp["pool_after"]["vq"],
                                  "proto_delta": exp["pool_after"]["proto"],
                                  "creator_delta": exp["pool_after"]["creator"]}, \
                (label, binary, pool_after, exp["pool_after"])
        observed = {"deltas": deltas, "event": ev, "event_count": 1,
                    "payer_paid": payer_paid,
                    "volume_after_hex": vol_after_hex,
                    "volume_after_lamports": vol_after_lam,
                    "pool_after": pool_after}
    else:
        assert r["error"], (label, binary, "expected failure")
        assert exp["code"] in r["error"], (label, binary, r["error"])
        assert exp["fragment"] in (r["error"] or "") or exp["fragment"] in "\n".join(logs), \
            (label, binary, r["error"])
        assert len(events) == 0, (label, binary, events)
        assert payer_paid == exp["payer"], (label, binary, payer_paid, exp["payer"])
        for key, snap_b in before.items():
            if key == payer_key:
                continue
            assert snap_b == after.get(key), (label, binary, key, "no rollback")
        observed = {"error_code": exp["code"], "fragment": exp["fragment"],
                    "event_count": 0, "payer_paid": payer_paid, "rollback": True,
                    "volume_after_hex": vol_after_hex,
                    "volume_after_lamports": vol_after_lam}
    return observed, before, after, r


receipts_global = []
report_cases = []

def jsonable(o):
    if isinstance(o, Pubkey):
        return str(o)
    if isinstance(o, tuple):
        return [jsonable(x) for x in o]
    if isinstance(o, dict):
        return {k: jsonable(v) for k, v in o.items()}
    if isinstance(o, list):
        return [jsonable(x) for x in o]
    return o


for index, (family, kind, ix_name, label, kwargs, exp) in enumerate(CASES):
    row = {"case": {"family": family, "kind": kind, "instruction": ix_name,
                    "label": label, "expected": jsonable(exp)}}
    seen = set()
    for image, binary in IMAGES.items():
        observed, before, after, r = run_case(family, kind, ix_name, label, kwargs, exp, binary)
        seen.add(json.dumps(observed, sort_keys=True))
        tx = Transaction.from_bytes(base64.b64decode(r["transaction_base64"]))
        assert tx.verify_with_results() and all(tx.verify_with_results()), (label, image)
        tx_b64 = r["transaction_base64"]
        sigs = [str(s) for s in tx.signatures]
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "family": family,
                        "kind": kind, "instruction": ix_name, "label": label},
            "transaction_base64": tx_b64,
            "signatures": sigs,
            "transaction_sha256": sha(base64.b64decode(tx_b64)),
            "all_signatures_verified": True, "signature_fields": len(sigs),
            "before": before, "after": after,
            "metadata": {"signature": sigs[0] if sigs else None,
                         "logs": r["logs"], "events": len(r["events"])},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                      "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
            "error": r["error"], "rollback_except_payer_fee": r["error"] is not None,
            "payer_delta_lamports": observed["payer_paid"],
            "observed": observed, "roles": ROLE_STR,
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
    "scripts/pump_amm_multi_hop_differential.py",
    "scripts/pump_amm_reusable_harness.py",
]
report = {
    "schema": 1, "packet": "amm-track-volume-20261029",
    "case_count": len(report_cases), "mismatches": [],
    "scope": ("legacy buy track_volume flag and current_sol_volume "
              "across legacy buy / buy_exact, legacy sell (plain and "
              "cashback), trade_v2 buy / sell / buy_exact, and "
              "1-hop multi_hop buy / sell, on all 3 images "
              "(original / #424 control / #427 candidate): the "
              "flag is event-only in legacy buy, no trade path "
              "writes current_sol_volume, legacy buy overwrites "
              "the accumulator user field unconditionally while "
              "v2 and multi-hop write it only when default, "
              "legacy sell has no volume account, cashback sell "
              "moves only cashback_earned, and the OptionBool "
              "track byte rejects 2 with 102 while a missing byte "
              "succeeds as false. Receipts are stored as parts "
              "to stay under GitHub's 25MB web-upload limit; "
              "verify.py reads them in order. No source change, "
              "build, or whole-program equivalence claim."),
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
