#!/usr/bin/env python3
"""Build research/amm-update-fee-config-20261029 receipts.

2nd run packet #43: pump-amm update_fee_config -- the sorted-order
gate, the check order, atomicity, the emitted event, the truncated
config ghost, and the downstream legacy-sell binding.

1st #27 pinned only the field values: each bps setter's 1000 cap,
recipients nonzero, and auth (6005/3010/2000). It never pinned
whether recipients must be sorted, what beats what when several
checks fail at once, whether a failure rolls every field back,
what the UpdateFeeConfigEvent actually carries, what happens on a
short config, or whether the new recipient list actually drives
the next trade. 2nd #42 pinned the analogous setter questions for
update_buyback_config, whose recipients are explicitly NOT sorted
(descending input succeeds and lands in input order). This packet
pins the opposite rule for the protocol-fee recipients, and the
binding that explains why the rule exists.

Setter semantics (family A, admin-only VM; config bytes: lp fee
40..48, protocol fee 48..56, recipients 57..313, creator fee
313..321, admin_set_coin_creator_authority 321..353; fixture
lp 20, protocol 5, creator 5, sorted fixture recipients):
- Field caps: each bps setter caps at 1000 (set_lp_fee /
  set_protocol_fee / set_coin_creator_fee in
  state/global_config.rs). lp 1001, protocol 1001, creator 1001
  and lp u64::MAX all fail 6000 FeeBasisPointsExceedsMaximum
  (global_config.rs:7 / :13 / :19), fully rolled back. 1000 on
  all three succeeds.
- Recipients must be strictly ascending: descending input, one
  adjacent swap, and one duplicate all fail 6012
  UnsortedNotUniqueProtocolFeeRecipients (global_config.rs:27)
  -- the exact opposite of update_buyback_config (#42), whose
  recipients land in input order.
- Recipients must all be nonzero: a default key first or last
  fails 6011 AllProtocolFeeRecipientsShouldBeNonZero
  (global_config.rs:25), and nonzero beats sorted: a default key
  inside a descending list still fails 6011, not 6012.
- Check order follows the write order (lib.rs:85): set_lp_fee,
  set_protocol_fee, set_protocol_fee_recipients,
  set_coin_creator_fee, authority assignment, then the event.
  lp 1001 + unsorted fails 6000 (lp first); protocol 1001 +
  unsorted fails 6000 (protocol before recipients); unsorted +
  creator 1001 fails 6012 (recipients before creator).
- Atomicity: every failure rolls all five fields back -- a
  failing call leaves lp 20, protocol 5, creator 5, the fixture
  recipients and the fixture authority untouched.
- Event: every success emits exactly one UpdateFeeConfigEvent
  (360 bytes, discriminator 5a1741233ef4bcd0 =
  sha256("event:UpdateFeeConfigEvent")[:8], timestamp 0 under
  the default LiteSVM clock): admin (the signer) @16..48,
  lp @48, protocol @56, recipients @64..320, creator @320,
  authority @328..360 -- the event echoes the written values.
- Args: empty args, an lp-only prefix (8 bytes) and an
  lp+protocol prefix (16 bytes) all fail 102
  InstructionDidNotDeserialize; one trailing byte after a full
  payload is ignored and the write still succeeds.
- Truncation: the custom GlobalConfig deserializer needs 907
  bytes, so 906 bytes fails InvalidAccountData before the
  handler runs (0 events). At 907 or 948 bytes the handler runs
  and the event CPI succeeds, but the 949-byte struct cannot be
  written back, so the transaction fails with BorshIoError
  ("failed to write whole buffer", caused by account:
  global_config) and rolls back -- with the event left in the
  logs: a GHOST event, the #27 update_admin pattern, here with
  the new values in the event and the fixture values in state.
  There is no extend_global_config path in this instruction, so
  no short config can ever be updated in place.
- Auth (shared AdminGlobal map, same as #27/#42): outsider
  signer 6005 InvalidAdmin (caused by account: global_config),
  unsigned admin 3010 AccountNotSigner, readonly config 2000
  ConstraintMut, wrong-owner config 3007
  AccountOwnedByWrongProgram -- all fully rolled back, payer
  -5,000.

Downstream binding (family B, each case = update tx then
legacy sell 10^9 tx in one legacy-sell VM; legacy sell pays
protocol fee 849 / creator 548 / buyback 849, user +180,212,
vault base +10^9, vault quote -182,458, as in 2nd #13):
- update recipients to NEW8, sell with a NEW8 member: success.
  The member's ATA is created by init_if_needed (payer
  2,044,280 = 2,039,280 rent + 5,000 fee), lands exactly 849
  (lamports 2,040,129, 165 bytes); a second NEW8 member with a
  pre-created ATA costs only the 5,000 fee and also lands 849.
- update recipients to NEW8, sell with the OLD fixture
  recipient: 6013 InvalidProtocolFeeRecipient
  (instructions/swap/mod.rs), zero deltas, pool unchanged,
  payer 5,000 -- the setter change binds the next trade
  immediately and invalidates the old set at once.
- update with the unchanged fixture list, sell with the old
  recipient: success, protocol leg 849 (control anchor).
- update with an unsorted list FAILS (6012) and the following
  sell with the old recipient still succeeds -- the failed
  setter left the config untouched across instructions.
- The bps fields have no downstream trade consumer in this
  source tree: legacy sell prices through the Fees-program CPI
  and trade_v2 through the FeeConfig tiers, so family B pins
  the recipients binding only; the bps values are pinned in
  family A as writes plus the event echo.

All three images (original / #424 control / #427 candidate)
agree on every case: this packet pins behavior, it does not
claim a divergence. Error sites appear per image only in the receipt logs (not as report fields); verify checks error codes and error names, which are
image-independent, since rebuilt images may report different
line numbers (the #36 precedent).
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
from solders.keypair import Keypair
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata
from solders.pubkey import Pubkey

from pump_amm_admin_differential import Harness
from pump_amm_liquidity_differential import (
    CONFIG, CONFIG_KEY, EVENT, IDL, PAYER, PROGRAM, RAW, TOKEN, TOKEN22,
    base, f, pool, quote, token, userbase, userquote, vaultbase,
    vaultquote,
)
from pump_amm_trade_v2_differential import FEES, buyback, feeconfig
from pump_amm_legacy_sell_differential import (
    PROTOCOL, PROTOCOL_ATA, CREATOR_ATA, CREATOR_VAULT, ATA,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-update-fee-config-20261029"
WS = Path.home() / "workspace/slop-verify"
OUTSIDER = Keypair.from_seed(bytes([202]) * 32)
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}

UFC_DISC = bytes([104, 184, 103, 242, 88, 151, 107, 20])
EVENT_DISC = bytes.fromhex("5a1741233ef4bcd0")
FIX_LP, FIX_PROTO, FIX_CREATOR = 20, 5, 5
FIX_AUTH = bytes(bytes(RAW)[321:353])
FIX_RECIP = [Pubkey.from_bytes(bytes(RAW)[57 + i * 32:57 + (i + 1) * 32]) for i in range(8)]
NEW = [Pubkey.from_bytes(bytes([210 + i]) * 32) for i in range(8)]
NEW_SORTED = sorted(NEW, key=bytes)
NEW_DESC = sorted(NEW, key=bytes, reverse=True)
NEWREC = NEW_SORTED[3]
NEWREC2 = NEW_SORTED[5]
NEWREC_ATA = Pubkey.find_program_address([bytes(NEWREC), bytes(TOKEN), bytes(quote)], ATA)[0]
NEWREC2_ATA = Pubkey.find_program_address([bytes(NEWREC2), bytes(TOKEN), bytes(quote)], ATA)[0]
AUTH_NEW = bytes([99]) * 32


def sha(data):
    return hashlib.sha256(data).hexdigest()


def hx(b):
    return bytes(b).hex()


def ufc_payload(lp, proto, recips, creator, auth):
    return struct.pack("<QQ", lp, proto) + b"".join(bytes(r) for r in recips) + struct.pack("<Q", creator) + bytes(auth)


def ufc_ix(signer, signer_flag, payload, cfg_writable=True):
    metas = [AccountMeta(signer.pubkey(), signer_flag, False),
             AccountMeta(CONFIG_KEY, False, cfg_writable),
             AccountMeta(EVENT, False, False),
             AccountMeta(PROGRAM, False, False)]
    return Instruction(PROGRAM, UFC_DISC + payload, metas)


def base_payload():
    return ufc_payload(30, 40, NEW_SORTED, 100, AUTH_NEW)


def decode_event(logs):
    lines = [l for l in logs if l.startswith("Program data: ")]
    if len(lines) != 1:
        return None
    raw = base64.b64decode(lines[0].split("Program data: ", 1)[1].strip())
    if len(raw) != 360 or raw[:8] != EVENT_DISC:
        return None
    return {
        "disc": raw[:8].hex(),
        "admin": raw[16:48].hex(),
        "lp": struct.unpack_from("<Q", raw, 48)[0],
        "proto": struct.unpack_from("<Q", raw, 56)[0],
        "recipients": [raw[64 + i * 32:64 + (i + 1) * 32].hex() for i in range(8)],
        "creator": struct.unpack_from("<Q", raw, 320)[0],
        "authority": raw[328:360].hex(),
    }


def cfg_fields(data):
    if data is None:
        return {}
    out = {}
    if len(data) >= 48:
        out["lp"] = struct.unpack_from("<Q", data, 40)[0]
    if len(data) >= 56:
        out["proto"] = struct.unpack_from("<Q", data, 48)[0]
    if len(data) >= 313:
        out["recipients"] = [bytes(data[57 + i * 32:57 + (i + 1) * 32]).hex() for i in range(8)]
    if len(data) >= 321:
        out["creator"] = struct.unpack_from("<Q", data, 313)[0]
    if len(data) >= 353:
        out["authority"] = bytes(data[321:353]).hex()
    out["length"] = len(data)
    return out


# ---------------- family A: admin-only VM ----------------
def S(ix, payer, **exp):
    return (ix, payer, exp)


FIX_RECIP_HEX = [hx(bytes(k)) for k in FIX_RECIP]
NEW_HEX = [hx(bytes(k)) for k in NEW_SORTED]
BASE_EVENT = {"disc": EVENT_DISC.hex(), "admin": hx(bytes(PAYER.pubkey())),
              "lp": 30, "proto": 40, "recipients": NEW_HEX,
              "creator": 100, "authority": hx(AUTH_NEW)}
ALL1000_EVENT = dict(BASE_EVENT, lp=1000, proto=1000, creator=1000)
FIX_STATE = {"lp": FIX_LP, "proto": FIX_PROTO, "recipients": FIX_RECIP_HEX,
             "creator": FIX_CREATOR, "authority": hx(FIX_AUTH)}
BASE_STATE = {"lp": 30, "proto": 40, "recipients": NEW_HEX,
              "creator": 100, "authority": hx(AUTH_NEW)}
ALL1000_STATE = {"lp": 1000, "proto": 1000, "recipients": NEW_HEX,
                 "creator": 1000, "authority": hx(AUTH_NEW)}


def fail(err, site, state=None, events=0, event=None):
    d = {"err": err, "site": site, "events": events, "event": event,
         "state": state if state is not None else FIX_STATE,
         "length": 949, "payer_delta": 5000, "rollback": True}
    return d


def ok(state, event, length=949):
    return {"err": None, "site": None, "events": 1, "event": event,
            "state": state, "length": length, "payer_delta": 5000,
            "rollback": False, "diff_subsets": [(40, 56), (57, 313), (313, 321), (321, 353)]}


CASES_A = [
    ("fc-base", {}, [S(ufc_ix(PAYER, True, base_payload()), PAYER, **ok(BASE_STATE, BASE_EVENT))]),
    ("fc-all-1000", {}, [S(ufc_ix(PAYER, True, ufc_payload(1000, 1000, NEW_SORTED, 1000, AUTH_NEW)), PAYER, **ok(ALL1000_STATE, ALL1000_EVENT))]),
    ("fc-lp-1001", {}, [S(ufc_ix(PAYER, True, ufc_payload(1001, 40, NEW_SORTED, 100, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6000)", "FeeBasisPointsExceedsMaximum"))]),
    ("fc-proto-1001", {}, [S(ufc_ix(PAYER, True, ufc_payload(30, 1001, NEW_SORTED, 100, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6000)", "FeeBasisPointsExceedsMaximum"))]),
    ("fc-creator-1001", {}, [S(ufc_ix(PAYER, True, ufc_payload(30, 40, NEW_SORTED, 1001, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6000)", "FeeBasisPointsExceedsMaximum"))]),
    ("fc-lp-u64max", {}, [S(ufc_ix(PAYER, True, ufc_payload(2 ** 64 - 1, 40, NEW_SORTED, 100, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6000)", "FeeBasisPointsExceedsMaximum"))]),
    ("fc-recip-zero-first", {}, [S(ufc_ix(PAYER, True, ufc_payload(30, 40, [Pubkey.default()] + NEW_SORTED[1:], 100, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6011)", "AllProtocolFeeRecipientsShouldBeNonZero"))]),
    ("fc-recip-zero-last", {}, [S(ufc_ix(PAYER, True, ufc_payload(30, 40, NEW_SORTED[:7] + [Pubkey.default()], 100, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6011)", "AllProtocolFeeRecipientsShouldBeNonZero"))]),
    ("fc-recip-desc", {}, [S(ufc_ix(PAYER, True, ufc_payload(30, 40, NEW_DESC, 100, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6012)", "UnsortedNotUniqueProtocolFeeRecipients"))]),
    ("fc-recip-dup", {}, [S(ufc_ix(PAYER, True, ufc_payload(30, 40, [NEW_SORTED[0], NEW_SORTED[0]] + NEW_SORTED[2:], 100, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6012)", "UnsortedNotUniqueProtocolFeeRecipients"))]),
    ("fc-recip-oneswap", {}, [S(ufc_ix(PAYER, True, ufc_payload(30, 40, NEW_SORTED[:3] + [NEW_SORTED[4], NEW_SORTED[3]] + NEW_SORTED[5:], 100, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6012)", "UnsortedNotUniqueProtocolFeeRecipients"))]),
    ("fc-lp1001-unsorted", {}, [S(ufc_ix(PAYER, True, ufc_payload(1001, 40, NEW_DESC, 100, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6000)", "FeeBasisPointsExceedsMaximum"))]),
    ("fc-proto1001-unsorted", {}, [S(ufc_ix(PAYER, True, ufc_payload(30, 1001, NEW_DESC, 100, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6000)", "FeeBasisPointsExceedsMaximum"))]),
    ("fc-unsorted-creator1001", {}, [S(ufc_ix(PAYER, True, ufc_payload(30, 40, NEW_DESC, 1001, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6012)", "UnsortedNotUniqueProtocolFeeRecipients"))]),
    ("fc-zero-unsorted", {}, [S(ufc_ix(PAYER, True, ufc_payload(30, 40, [Pubkey.default()] + NEW_DESC[1:], 100, AUTH_NEW)), PAYER, **fail("InstructionErrorCustom(6011)", "AllProtocolFeeRecipientsShouldBeNonZero"))]),
    ("fc-trailing", {}, [S(ufc_ix(PAYER, True, base_payload() + b"X"), PAYER, **ok(BASE_STATE, BASE_EVENT))]),
    ("fc-args-empty", {}, [S(ufc_ix(PAYER, True, b""), PAYER, **fail("InstructionErrorCustom(102)", "InstructionDidNotDeserialize"))]),
    ("fc-args-lp-only", {}, [S(ufc_ix(PAYER, True, struct.pack("<Q", 30)), PAYER, **fail("InstructionErrorCustom(102)", "InstructionDidNotDeserialize"))]),
    ("fc-args-lp-proto", {}, [S(ufc_ix(PAYER, True, struct.pack("<QQ", 30, 40)), PAYER, **fail("InstructionErrorCustom(102)", "InstructionDidNotDeserialize"))]),
    ("fc-trunc-907", {"data": bytes(RAW[:907])}, [S(ufc_ix(PAYER, True, base_payload()), PAYER, **{**fail("BorshIoError", "BorshIoError", state=FIX_STATE, events=1, event=BASE_EVENT), "length": 907})]),
    ("fc-trunc-948", {"data": bytes(RAW[:948])}, [S(ufc_ix(PAYER, True, base_payload()), PAYER, **{**fail("BorshIoError", "BorshIoError", state=FIX_STATE, events=1, event=BASE_EVENT), "length": 948})]),
    ("fc-trunc-906", {"data": bytes(RAW[:906])}, [S(ufc_ix(PAYER, True, base_payload()), PAYER, **{**fail("InvalidAccountData", "InvalidAccountData", state=FIX_STATE, events=0), "length": 906})]),
    ("fc-outsider", {}, [S(ufc_ix(OUTSIDER, True, base_payload()), OUTSIDER, **fail("InstructionErrorCustom(6005)", "InvalidAdmin"))]),
    ("fc-unsigned", {}, [S(ufc_ix(PAYER, False, base_payload()), OUTSIDER, **fail("InstructionErrorCustom(3010)", "AccountNotSigner"))]),
    ("fc-readonly", {}, [S(ufc_ix(PAYER, True, base_payload(), cfg_writable=False), PAYER, **fail("InstructionErrorCustom(2000)", "ConstraintMut"))]),
    ("fc-wrongowner", {"owner": Pubkey.default()}, [S(ufc_ix(PAYER, True, base_payload()), PAYER, **fail("InstructionErrorCustom(3007)", "AccountOwnedByWrongProgram"))]),
]


def run_admin_step(vm, ix, tx_payer):
    cfg_before_acct = vm.get_account(CONFIG_KEY)
    before = bytes(cfg_before_acct.data) if cfg_before_acct else None
    before_lamp = cfg_before_acct.lamports if cfg_before_acct else None
    payer_before = vm.get_account(tx_payer.pubkey()).lamports
    tx = Transaction.new_signed_with_payer(
        [ix], tx_payer.pubkey(), [tx_payer], vm.latest_blockhash())
    assert all(tx.verify_with_results())
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    logs = meta.logs()
    cfg_after_acct = vm.get_account(CONFIG_KEY)
    after = bytes(cfg_after_acct.data) if cfg_after_acct else None
    after_lamp = cfg_after_acct.lamports if cfg_after_acct else None
    payer_after = vm.get_account(tx_payer.pubkey()).lamports
    events = [l for l in logs if l.startswith("Program data: ")]
    fields = cfg_fields(after)
    observed = {
        "error": str(r.err()) if failed else None,
        "events": len(events),
        "event": decode_event(logs),
        "cfg_lamports": after_lamp,
        "payer_delta": payer_before - payer_after,
        "rollback": (before == after and before_lamp == after_lamp),
    }
    observed.update(fields)
    return {
        "tx": base64.b64encode(bytes(tx)).decode(),
        "signatures": [str(s) for s in tx.signatures],
        "transaction_sha256": sha(bytes(tx)),
        "logs": logs, "events": events,
        "before": {str(CONFIG_KEY): {"lamports": before_lamp, "data_hex": before.hex() if before is not None else None},
                   str(tx_payer.pubkey()): {"lamports": payer_before, "data_hex": ""}},
        "after": {str(CONFIG_KEY): {"lamports": after_lamp, "data_hex": after.hex() if after is not None else None},
                  str(tx_payer.pubkey()): {"lamports": payer_after, "data_hex": ""}},
        "observed": observed,
    }


def check_admin_step(label, image, step_index, res, exp):
    obs = res["observed"]
    if exp.get("err") is None:
        assert obs["error"] is None, (label, image, step_index, obs["error"])
    else:
        assert obs["error"] is not None and exp["err"] in obs["error"], \
            (label, image, step_index, obs["error"])
    if exp.get("site"):
        assert exp["site"] in "\n".join(res["logs"]), \
            (label, image, step_index, res["logs"][-4:])
    assert obs["events"] == exp["events"], (label, image, step_index, obs["events"])
    assert obs["event"] == exp["event"], (label, image, step_index, obs["event"], exp["event"])
    for key, val in exp["state"].items():
        assert obs.get(key) == val, (label, image, step_index, key, obs.get(key), val)
    assert obs["length"] == exp["length"], (label, image, step_index, obs["length"])
    assert obs["payer_delta"] == exp["payer_delta"], (label, image, step_index, obs["payer_delta"])
    if exp.get("rollback"):
        assert obs["rollback"], (label, image, step_index, "no rollback")
    if exp.get("diff_subsets") is not None:
        before = bytes.fromhex(res["before"][str(CONFIG_KEY)]["data_hex"])
        after = bytes.fromhex(res["after"][str(CONFIG_KEY)]["data_hex"])
        assert len(before) == len(after), (label, image, step_index, "length changed")
        diffs = [i for i in range(len(before)) if before[i] != after[i]]
        assert all(any(lo <= i < hi for lo, hi in exp["diff_subsets"]) for i in diffs), \
            (label, image, step_index, diffs)


def run_case_A(label, setup, steps, binary):
    from solders.litesvm import LiteSVM
    vm = LiteSVM().with_transaction_history(0)
    vm.add_program_from_file(PROGRAM, binary)
    for who in [PAYER, OUTSIDER]:
        vm.airdrop(who.pubkey(), 10 ** 12)
    vm.set_account(EVENT, Account(10 ** 9, b"", Pubkey.default()))
    data = setup.get("data", bytes(RAW))
    vm.set_account(CONFIG_KEY, Account(
        setup.get("lamports", CONFIG["lamports"]), bytes(data),
        setup.get("owner", PROGRAM)))
    receipts = []
    for step_index, (ix, tx_payer, exp) in enumerate(steps):
        res = run_admin_step(vm, ix, tx_payer)
        check_admin_step(label, binary, step_index, res, exp)
        receipts.append(res)
    return receipts


# ---------------- family B: legacy-sell chain VM ----------------
def build_legacy_vm(binary):
    h = Harness(binary)
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, fp in [(TOKEN, "evidence/dependencies/spl_token/deployed.so"),
                    (TOKEN22, "evidence/dependencies/spl_token_2022/deployed.so"),
                    (FEES, "evidence/original/pump_fees/deployed.so"),
                    (ATA, "evidence/dependencies/associated_token/deployed.so")]:
        vm.add_program_from_file(pid, ROOT / fp)
    for n, row in f["accounts"].items():
        vm.set_account(Pubkey.from_string(row["address"]),
                       Account(row["lamports"], base64.b64decode(row["data_base64"]),
                               Pubkey.from_string(row["owner"])))
    glob = bytearray(RAW)
    glob[56] = 0
    vm.set_account(CONFIG_KEY, Account(CONFIG["lamports"], bytes(glob), PROGRAM))
    for k, m, owner, native in [(userbase, base, PAYER.pubkey(), False),
                                (userquote, quote, PAYER.pubkey(), True),
                                (PROTOCOL_ATA, quote, PROTOCOL, True),
                                (CREATOR_ATA, quote, CREATOR_VAULT, True)]:
        vm.set_account(k, Account(10 ** 15 + 2039280 if native else 10 ** 9,
                                  token(m, owner, 10 ** 15 if k in [userbase, userquote] else 0, native), TOKEN))
    for k in [PROTOCOL, CREATOR_VAULT]:
        vm.set_account(k, Account(10 ** 9, b"", Pubkey.default()))
    owner = Pubkey.from_bytes(base64.b64decode(f["accounts"]["buyback_fee_recipient"]["data_base64"])[32:64])
    poolv2 = Pubkey.find_program_address([b"pool-v2", bytes(base)], PROGRAM)[0]
    for key in [poolv2, owner]:
        vm.set_account(key, Account(10 ** 9, b"", Pubkey.default()))
    return vm, poolv2, owner


def snap_b(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        if not a or a.executable:
            out[str(k)] = None
        else:
            out[str(k)] = {"lamports": a.lamports, "data_hex": bytes(a.data).hex()}
    return out


def tok_amt(row, offset=64):
    if row is None:
        return None
    return struct.unpack_from("<Q", bytes.fromhex(row["data_hex"]), offset)[0]


SELL_DELTAS = {"userbase": -10 ** 9, "userquote": 180212, "vaultbase": 10 ** 9,
               "vaultquote": -182458, "proto": 849, "creator": 548, "buyback": 849}
# (label, upd_recips, upd_expect, sell_proto, sell_proto_ata, precreate_ata, sell_expect)
# upd_expect: ("ok", recip_hex_list) | ("err", code, site)
# sell_expect: ("ok", payer_delta, proto_after_lamports, proto_after_amount) | ("err", code, site)
CASES_B = [
    ("chain-newrec-sell", NEW_SORTED, ("ok", NEW_HEX), NEWREC, NEWREC_ATA, False,
     ("ok", 2044280, 2040129, 849)),
    ("chain-newrec2-presell", NEW_SORTED, ("ok", NEW_HEX), NEWREC2, NEWREC2_ATA, True,
     ("ok", 5000, 2040129, 849)),
    ("chain-oldrec-sell", NEW_SORTED, ("ok", NEW_HEX), PROTOCOL, PROTOCOL_ATA, False,
     ("err", "InstructionErrorCustom(6013)", "InvalidProtocolFeeRecipient")),
    ("chain-fixture-sell", FIX_RECIP, ("ok", FIX_RECIP_HEX), PROTOCOL, PROTOCOL_ATA, False,
     ("ok", 5000, None, 849)),
    ("chain-failedupdate-sell", NEW_DESC, ("err", "InstructionErrorCustom(6012)", "UnsortedNotUniqueProtocolFeeRecipients"),
     PROTOCOL, PROTOCOL_ATA, False, ("ok", 5000, None, 849)),
]


def run_case_B(label, upd_recips, upd_expect, sell_proto, sell_proto_ata,
               precreate, sell_expect, binary):
    vm, poolv2, bb_owner = build_legacy_vm(binary)
    if precreate:
        vm.set_account(sell_proto_ata, Account(2039280, token(quote, sell_proto, 0, True), TOKEN))
    snap_keys = [pool, userbase, userquote, vaultbase, vaultquote, sell_proto_ata,
                 CREATOR_ATA, buyback, CONFIG_KEY, PAYER.pubkey()]
    # step 0: update_fee_config (bps/authority unchanged, recipients only)
    pay = ufc_payload(FIX_LP, FIX_PROTO, upd_recips, FIX_CREATOR, FIX_AUTH)
    upd_metas = [AccountMeta(PAYER.pubkey(), True, False),
                 AccountMeta(CONFIG_KEY, False, True),
                 AccountMeta(EVENT, False, False),
                 AccountMeta(PROGRAM, False, False)]
    before0 = snap_b(vm, snap_keys)
    payer0 = before0[str(PAYER.pubkey())]["lamports"]
    tx0 = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, UFC_DISC + pay, upd_metas)],
        PAYER.pubkey(), [PAYER], vm.latest_blockhash())
    assert all(tx0.verify_with_results())
    r0 = vm.send_transaction(tx0)
    failed0 = isinstance(r0, FailedTransactionMetadata)
    meta0 = r0.meta() if failed0 else r0
    logs0 = meta0.logs()
    after0 = snap_b(vm, snap_keys)
    cfg0 = bytes.fromhex(after0[str(CONFIG_KEY)]["data_hex"])
    cfg_fields0 = cfg_fields(cfg0)
    obs0 = {"error": str(r0.err()) if failed0 else None,
            "events": len([l for l in logs0 if l.startswith("Program data: ")]),
            "event": decode_event(logs0),
            "recipients": cfg_fields0.get("recipients"),
            "lp": cfg_fields0.get("lp"), "proto": cfg_fields0.get("proto"),
            "creator": cfg_fields0.get("creator"),
            "authority": cfg_fields0.get("authority"),
            "length": len(cfg0),
            "payer_delta": payer0 - after0[str(PAYER.pubkey())]["lamports"]}
    if upd_expect[0] == "ok":
        assert not failed0, (label, binary, "update step must succeed")
        assert obs0["events"] == 1, (label, binary, logs0)
        assert obs0["event"] == {"disc": EVENT_DISC.hex(), "admin": hx(bytes(PAYER.pubkey())),
                                 "lp": FIX_LP, "proto": FIX_PROTO, "recipients": upd_expect[1],
                                 "creator": FIX_CREATOR, "authority": hx(FIX_AUTH)}, (label, binary, obs0["event"])
        assert obs0["recipients"] == upd_expect[1], (label, binary, obs0["recipients"])
        assert (obs0["lp"], obs0["proto"], obs0["creator"]) == (FIX_LP, FIX_PROTO, FIX_CREATOR), (label, binary, obs0)
        assert obs0["authority"] == hx(FIX_AUTH), (label, binary, obs0["authority"])
        assert obs0["payer_delta"] == 5000, (label, binary, obs0["payer_delta"])
    else:
        assert failed0, (label, binary, "update step must fail")
        assert upd_expect[1] in obs0["error"], (label, binary, obs0["error"])
        assert upd_expect[2] in "\n".join(logs0), (label, binary, logs0[-4:])
        assert obs0["recipients"] == FIX_RECIP_HEX, (label, binary, obs0["recipients"])
        assert obs0["payer_delta"] == 5000, (label, binary, obs0["payer_delta"])
    res0 = {"tx": base64.b64encode(bytes(tx0)).decode(),
            "signatures": [str(s) for s in tx0.signatures],
            "transaction_sha256": sha(bytes(tx0)),
            "logs": logs0, "events": [l for l in logs0 if l.startswith("Program data: ")],
            "before": before0, "after": after0, "observed": obs0}
    # step 1: legacy sell 10^9, limit 0
    ix = next(x for x in IDL["instructions"] if x["name"] == "sell")
    keys = [pool, PAYER.pubkey(), CONFIG_KEY, base, quote, userbase, userquote,
            vaultbase, vaultquote, sell_proto, sell_proto_ata, TOKEN, TOKEN,
            Pubkey.default(), ATA, EVENT, PROGRAM, CREATOR_ATA, CREATOR_VAULT,
            feeconfig, FEES]
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    metas += [AccountMeta(poolv2, False, False), AccountMeta(bb_owner, False, False),
              AccountMeta(buyback, False, True)]
    before1 = snap_b(vm, snap_keys)
    payer1 = before1[str(PAYER.pubkey())]["lamports"]
    data = bytes(ix["discriminator"]) + struct.pack("<QQ", 10 ** 9, 0)
    tx1 = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, data, metas)], PAYER.pubkey(), [PAYER], vm.latest_blockhash())
    assert all(tx1.verify_with_results())
    r1 = vm.send_transaction(tx1)
    failed1 = isinstance(r1, FailedTransactionMetadata)
    meta1 = r1.meta() if failed1 else r1
    logs1 = meta1.logs()
    after1 = snap_b(vm, snap_keys)
    deltas = {}
    for wname, key in (("userbase", userbase), ("userquote", userquote),
                       ("vaultbase", vaultbase), ("vaultquote", vaultquote),
                       ("proto", sell_proto_ata), ("creator", CREATOR_ATA),
                       ("buyback", buyback)):
        b, a = before1[str(key)], after1[str(key)]
        b_amt = tok_amt(b) if b is not None else 0
        a_amt = tok_amt(a) if a is not None else 0
        deltas[wname] = a_amt - b_amt
    proto_after = after1[str(sell_proto_ata)]
    obs1 = {"error": str(r1.err()) if failed1 else None,
            "events": len([l for l in logs1 if l.startswith("Program data: ")]),
            "deltas": deltas,
            "proto_after_lamports": proto_after["lamports"] if proto_after else None,
            "proto_after_amount": tok_amt(proto_after) if proto_after else None,
            "proto_after_len": len(bytes.fromhex(proto_after["data_hex"])) if proto_after else None,
            "pool_unchanged": before1[str(pool)] == after1[str(pool)],
            "payer_delta": payer1 - after1[str(PAYER.pubkey())]["lamports"]}
    if sell_expect[0] == "ok":
        assert not failed1, (label, binary, "sell step must succeed")
        assert deltas == SELL_DELTAS, (label, binary, deltas)
        assert obs1["events"] == 1, (label, binary, logs1)
        assert obs1["payer_delta"] == sell_expect[1], (label, binary, obs1["payer_delta"])
        if sell_expect[2] is not None:
            assert obs1["proto_after_lamports"] == sell_expect[2], (label, binary, obs1["proto_after_lamports"])
        assert obs1["proto_after_amount"] == sell_expect[3], (label, binary, obs1["proto_after_amount"])
        assert obs1["proto_after_len"] == 165, (label, binary, obs1["proto_after_len"])
    else:
        assert failed1, (label, binary, "sell step must fail")
        assert sell_expect[1] in obs1["error"], (label, binary, obs1["error"])
        assert sell_expect[2] in "\n".join(logs1), (label, binary, logs1[-4:])
        assert deltas == {k: 0 for k in SELL_DELTAS}, (label, binary, deltas)
        assert obs1["events"] == 0, (label, binary, logs1)
        assert obs1["pool_unchanged"], (label, binary, "pool moved on failure")
        assert obs1["payer_delta"] == 5000, (label, binary, obs1["payer_delta"])
    res1 = {"tx": base64.b64encode(bytes(tx1)).decode(),
            "signatures": [str(s) for s in tx1.signatures],
            "transaction_sha256": sha(bytes(tx1)),
            "logs": logs1, "events": [l for l in logs1 if l.startswith("Program data: ")],
            "before": before1, "after": after1, "observed": obs1}
    return [res0, res1]


receipts_global = []
report_cases = []
index = 0
for label, setup, steps in CASES_A:
    row = {"case": {"label": label, "family": "admin", "steps": len(steps)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        receipts = run_case_A(label, setup, steps, IMAGES[image])
        for step_index, res in enumerate(receipts):
            raw = base64.b64decode(res["tx"])
            tx = Transaction.from_bytes(raw)
            checks = tx.verify_with_results()
            assert checks and all(checks) and len(checks) == 1
            assert res["transaction_sha256"] == sha(raw)
            seen.add((step_index, res["observed"]["error"],
                      json.dumps(res["observed"], sort_keys=True),
                      json.dumps(res["after"], sort_keys=True)))
            receipts_global.append({
                "sequence": len(receipts_global),
                "vm": len(receipts_global),
                "context": {"index": index, "image": image, "label": label,
                            "family": "admin", "step": step_index},
                "transaction_base64": res["tx"],
                "signatures": res["signatures"],
                "transaction_sha256": res["transaction_sha256"],
                "all_signatures_verified": True, "signature_fields": 1,
                "before": res["before"], "after": res["after"],
                "metadata": {"logs": res["logs"], "events": res["events"],
                             "inner_instructions": []},
                "loaded_programs": {"pAMM": {"sha256": IMAGE_SHA[image]}},
                "error": res["observed"]["error"],
                "observed": res["observed"],
            })
            print(f"  {label}[{image}] step{step_index} "
                  f"err={res['observed']['error']} "
                  f"lp={res['observed'].get('lp')} proto={res['observed'].get('proto')} "
                  f"events={res['observed']['events']} "
                  f"payer_delta={res['observed']['payer_delta']}", flush=True)
        row[image] = {"steps": [r["observed"] for r in receipts]}
    assert len(seen) == len(steps), (label, "images must agree", seen)
    report_cases.append(row)
    index += 1

for label, upd_recips, upd_expect, sell_proto, sell_proto_ata, precreate, sell_expect in CASES_B:
    row = {"case": {"label": label, "family": "chain", "steps": 2}}
    seen = set()
    for image in ("original", "control", "candidate"):
        receipts = run_case_B(label, upd_recips, upd_expect, sell_proto,
                              sell_proto_ata, precreate, sell_expect, IMAGES[image])
        for step_index, res in enumerate(receipts):
            raw = base64.b64decode(res["tx"])
            tx = Transaction.from_bytes(raw)
            checks = tx.verify_with_results()
            assert checks and all(checks) and len(checks) == 1
            assert res["transaction_sha256"] == sha(raw)
            seen.add((step_index, res["observed"]["error"],
                      json.dumps(res["observed"], sort_keys=True),
                      json.dumps(res["after"], sort_keys=True)))
            receipts_global.append({
                "sequence": len(receipts_global),
                "vm": len(receipts_global),
                "context": {"index": index, "image": image, "label": label,
                            "family": "chain", "step": step_index},
                "transaction_base64": res["tx"],
                "signatures": res["signatures"],
                "transaction_sha256": res["transaction_sha256"],
                "all_signatures_verified": True, "signature_fields": 1,
                "before": res["before"], "after": res["after"],
                "metadata": {"logs": res["logs"], "events": res["events"],
                             "inner_instructions": []},
                "loaded_programs": {"pAMM": {"sha256": IMAGE_SHA[image]}},
                "error": res["observed"]["error"],
                "observed": res["observed"],
            })
            print(f"  {label}[{image}] step{step_index} "
                  f"err={res['observed']['error']} "
                  f"obs={res['observed']}", flush=True)
        row[image] = {"steps": [r["observed"] for r in receipts]}
    assert len(seen) == 2, (label, "images must agree", seen)
    report_cases.append(row)
    index += 1

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
    "evidence/upstream/pump_amm.json",
    "evidence/original/pump_fees/deployed.so",
    "research/imported-lab/analysis/pump_fun/config-snapshot.json",
    "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json",
    "programs/pump-amm/src/lib.rs",
    "programs/pump-amm/src/instructions/admin/mod.rs",
    "programs/pump-amm/src/state/global_config.rs",
    "programs/pump-amm/src/instructions/swap/mod.rs",
    "programs/pump-amm/src/instructions/swap/sell.rs",
    "scripts/pump_amm_admin_differential.py",
    "scripts/pump_amm_liquidity_differential.py",
    "scripts/pump_amm_trade_v2_differential.py",
    "scripts/pump_amm_legacy_sell_differential.py",
    "scripts/pump_amm_reusable_harness.py",
]
report = {"schema": 1, "packet": "amm-update-fee-config-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("update_fee_config as state transitions on synthetic "
                    "GlobalConfig fixtures (family A, admin-only VM) and as "
                    "the driver of a following legacy sell (family B, "
                    "chained transactions in a legacy-sell VM), fresh VM per "
                    "case per image (original / #424 control / #427 "
                    "candidate). Receipts are stored as parts to stay under "
                    "GitHub's 25MB web-upload limit; verify.py reads them "
                    "in order."),
          "image_sha256": IMAGE_SHA,
          "cases": report_cases,
          "counts": {"vms": len(receipts_global),
                     "transactions": len(receipts_global),
                     "signature_fields": len(receipts_global)},
          "input_sha256": {n: sha((ROOT / n).read_bytes()) for n in repo_inputs},
          "transaction_receipts": {"parts": parts}}
(OUT / "runtime/report.json.gz").write_bytes(
    gzip.compress(json.dumps(report, indent=1).encode(), mtime=0))
shutil.copy(__file__, OUT / "producer.py")
print(f"cases: {len(report_cases)} receipts: {len(receipts_global)}")
print(f"wrote: {OUT / 'runtime/report.json.gz'}")
print("NEXT: write verify.py and README.md into the packet dir, then generate MANIFEST.json")
