#!/usr/bin/env python3
"""Build research/amm-admin-authority-rotation-20261029 receipts.

Admin authority rotation and global-config extension (2nd run packet
#27). Nothing in the 1st run or 2nd #1-#26 covers these three
instructions as state transitions: update_admin, set_boost_authority,
and update_creator_fee_config. 1st #23 pinned has_one authorization
checks and 1st #27 pinned update_fee_config fee values; this packet
pins what rotation actually writes, that rotation chains compose,
that the new admin / new authority keys are never validated, and
that the extend_global_config realloc path behaves differently for
the Box<Account> (update_admin) and plain Account (set_boost_authority
/ update_creator_fee_config) account types:

- update_admin writes only bytes 8..40 and emits an 80-byte
  UpdateAdminEvent (timestamp i64, old admin, new admin). Any key
  at all is accepted as the new admin: program id, event authority,
  the config key itself, the current admin, or an unfunded random
  key all succeed, because new_admin is a CHECK-only AccountInfo.
- A rotation chain composes: after rotating PAYER -> OUTSIDER, the
  old admin's disable fails 6005 InvalidAdmin while the new admin's
  disable succeeds (flags 0 -> 1, 53-byte DisableEvent). Rotating
  back restores the old admin (round-trip, flags 0 -> 2).
- Rotating to the default pubkey bricks admin control: no one can
  sign as the default key, so later disable and set_boost_authority
  calls by the old admin both fail 6005.
- set_boost_authority writes only bytes 907..939 and emits a
  112-byte SetBoostAuthorityEvent (timestamp, admin, old, new).
  The new authority is likewise unvalidated: default and unfunded
  keys succeed.
- update_creator_fee_config writes only byte 940 (configurable)
  and bytes 941..949 (max) and emits a 57-byte
  UpdateCreatorFeeConfigEvent. max_configurable_creator_fee_bps has
  NO upper bound: 10000 and u64::MAX both succeed, unlike the
  fee-basis-points setters which cap at 1000. A bool byte of 2, or
  missing args, fails 102 InstructionDidNotDeserialize; a trailing
  arg byte is ignored and the write still succeeds.
- Error map (all with caused-by site lines, all fully rolled back,
  payer cost 5,000): outsider signer -> 6005 InvalidAdmin
  (caused by account: global_config); unsigned admin -> 3010
  AccountNotSigner (caused by account: admin); readonly config ->
  2000 ConstraintMut (caused by account: global_config); wrong
  config owner -> 3007 AccountOwnedByWrongProgram (caused by
  account: global_config).
- Extension asymmetry (the sharpest pin): extend_global_config
  reallocs a short config to 949 bytes, but only for the plain
  Account instructions. At exactly 907 bytes (the end of
  buyback_basis_points, data 899..907) set_boost_authority and
  update_creator_fee_config SUCCEED and realloc to 949 with a
  zero-filled tail, while update_admin FAILS with BorshIoError
  ("failed to write whole buffer", caused by account:
  global_config) -- but only at write-back: the handler itself
  runs, the UpdateAdminEvent CPI succeeds and the event log
  survives, and only then does the 949-byte struct fail to fit
  back into the short account, so the whole transaction fails
  and the state rolls back. The emitted event is a ghost: it
  records a rotation that never landed. At 906 bytes or less
  all three fail with InvalidAccountData before any handler
  runs (no event). The 907 boundary is exact: 906 fails,
  907 succeeds (for the Account instructions).
- Extension economics: when the short config is underfunded
  (100 lamports, 948 bytes), the top-up is exact: config lamports
  100 -> 7,495,920 (= rent for 949 bytes: 890,880 + 6,960 * 949)
  and the payer pays 7,500,820 (top-up 7,495,820 + 5,000 fee) --
  even for set_boost_authority, whose admin account is NOT marked
  mut. When the config is already 949 bytes, no top-up happens
  even if it holds only 100 lamports: the handler never checks
  rent on a full-size config.
- All three images (original / #424 control / #427 candidate)
  agree on every case: this packet pins behavior, it does not
  claim a divergence.
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
from solders.instruction import AccountMeta, Instruction
from solders.keypair import Keypair
from solders.litesvm import LiteSVM
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-admin-authority-rotation-20261029"
WS = Path.home() / "workspace/slop-verify"
PROGRAM = Pubkey.from_string('pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA')
EVENT = Pubkey.find_program_address([b'__event_authority'], PROGRAM)[0]
SYSTEM = Pubkey.from_string('11111111111111111111111111111111')
PAYER = Keypair.from_seed(bytes([201]) * 32)
OUTSIDER = Keypair.from_seed(bytes([202]) * 32)
UNFUNDED77 = Pubkey.from_bytes(bytes([77]) * 32)
UNFUNDED88 = Pubkey.from_bytes(bytes([88]) * 32)
IDL = json.loads((ROOT / 'evidence/upstream/pump_amm.json').read_text())
CONFIG = next(x for x in json.loads((ROOT / 'research/imported-lab/analysis/pump_fun/config-snapshot.json').read_text())['accounts'] if x['program_name'] == 'pump_amm')
CONFIG_KEY = Pubkey.from_string(CONFIG['address'])
RAW = bytearray(base64.b64decode(CONFIG['data_base64']))
RAW[8:40] = bytes(PAYER.pubkey())
DISC = {x['name']: bytes(x['discriminator']) for x in IDL['instructions']}
EV_DISC = {
    'e198ab57f63f42ea': 'UpdateAdminEvent',
    '5980f08d5bca4769': 'SetBoostAuthorityEvent',
    '98c67c7c6af67fbf': 'UpdateCreatorFeeConfigEvent',
    '6bfdc14ce4ca1b68': 'DisableEvent',
}
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}
FIXTURE_BOOST = bytes(RAW[907:939])
RENT949 = 7495920


def sha(data):
    return hashlib.sha256(data).hexdigest()


def hx(b):
    return bytes(b).hex()


def decode_event(raw):
    """Decode one Program-data event blob into a dict, or None."""
    if len(raw) < 8 or raw[:8].hex() not in EV_DISC:
        return None
    name = EV_DISC[raw[:8].hex()]
    ts = struct.unpack_from('<q', raw, 8)[0]
    if name == 'UpdateAdminEvent':
        assert len(raw) == 80, len(raw)
        return {"event": name, "timestamp": ts, "admin": hx(raw[16:48]),
                "new_admin": hx(raw[48:80])}
    if name == 'SetBoostAuthorityEvent':
        assert len(raw) == 112, len(raw)
        return {"event": name, "timestamp": ts, "admin": hx(raw[16:48]),
                "old": hx(raw[48:80]), "new": hx(raw[80:112])}
    if name == 'UpdateCreatorFeeConfigEvent':
        assert len(raw) == 57, len(raw)
        return {"event": name, "timestamp": ts, "admin": hx(raw[16:48]),
                "configurable": raw[48], "max": struct.unpack_from('<Q', raw, 49)[0]}
    if name == 'DisableEvent':
        assert len(raw) == 53, len(raw)
        return {"event": name, "timestamp": ts, "admin": hx(raw[16:48]),
                "flags": list(raw[48:53])}
    return None


def admin_ix(signer_keypair, signer_flag, new_key, cfg_writable=True):
    return Instruction(PROGRAM, DISC['update_admin'], [
        AccountMeta(signer_keypair.pubkey(), signer_flag, False),
        AccountMeta(CONFIG_KEY, False, cfg_writable),
        AccountMeta(new_key, False, False),
        AccountMeta(EVENT, False, False),
        AccountMeta(PROGRAM, False, False)])


def boost_ix(signer_keypair, signer_flag, new_key, cfg_writable=True):
    return Instruction(PROGRAM, DISC['set_boost_authority'], [
        AccountMeta(signer_keypair.pubkey(), signer_flag, False),
        AccountMeta(CONFIG_KEY, False, cfg_writable),
        AccountMeta(new_key, False, False),
        AccountMeta(SYSTEM, False, False),
        AccountMeta(EVENT, False, False),
        AccountMeta(PROGRAM, False, False)])


def creator_ix(signer_keypair, payload):
    return Instruction(PROGRAM, DISC['update_creator_fee_config'] + payload, [
        AccountMeta(signer_keypair.pubkey(), True, True),
        AccountMeta(CONFIG_KEY, False, True),
        AccountMeta(SYSTEM, False, False),
        AccountMeta(EVENT, False, False),
        AccountMeta(PROGRAM, False, False)])


def disable_ix(signer_keypair, flags):
    return Instruction(PROGRAM, DISC['disable'] + bytes(flags), [
        AccountMeta(signer_keypair.pubkey(), True, False),
        AccountMeta(CONFIG_KEY, False, True),
        AccountMeta(EVENT, False, False),
        AccountMeta(PROGRAM, False, False)])


def creator_payload(cfg, mx):
    return bytes([cfg]) + struct.pack('<Q', mx)


# Step: (ix_builder, tx_payer_keypair, expected)
# ix_builder: callable returning Instruction
# expected keys: err (None or substring), site (substring or None),
#   events (list of decoded event dicts), admin/boost/conf/max/flags
#   (hex str / int, or None to skip), length, cfg_lamports,
#   payer_delta, rollback (bool), tail_zero (range tuple or None),
#   diff_subset (range tuple or None: allowed diff byte range vs
#   the step's before-state; only for same-length success steps).
def S(ix, payer, **exp):
    return (ix, payer, exp)


P = PAYER.pubkey()
O = OUTSIDER.pubkey()
EV_ADMIN = lambda admin, new: {"event": "UpdateAdminEvent", "timestamp": 0,
                               "admin": hx(bytes(admin)), "new_admin": hx(bytes(new))}
EV_BOOST = lambda admin, old, new: {"event": "SetBoostAuthorityEvent", "timestamp": 0,
                                     "admin": hx(bytes(admin)), "old": hx(old),
                                     "new": hx(bytes(new))}
EV_CREATOR = lambda admin, cfg, mx: {"event": "UpdateCreatorFeeConfigEvent",
                                      "timestamp": 0, "admin": hx(bytes(admin)),
                                      "configurable": cfg, "max": mx}
EV_DISABLE = lambda admin, flags: {"event": "DisableEvent", "timestamp": 0,
                                    "admin": hx(bytes(admin)), "flags": flags}

CASES = [
    # ---- update_admin singles (setup: raw fixture, admin=PAYER) ----
    ("admin-rotate-outsider", {}, [
        S(admin_ix(PAYER, True, O), PAYER, err=None,
          events=[EV_ADMIN(P, O)], admin=hx(bytes(O)), length=949,
          cfg_lamports=CONFIG['lamports'], payer_delta=5000,
          diff_subset=(8, 40)),
    ]),
    ("admin-rotate-program", {}, [
        S(admin_ix(PAYER, True, PROGRAM), PAYER, err=None,
          events=[EV_ADMIN(P, PROGRAM)], admin=hx(bytes(PROGRAM)),
          length=949, payer_delta=5000, diff_subset=(8, 40)),
    ]),
    ("admin-rotate-event", {}, [
        S(admin_ix(PAYER, True, EVENT), PAYER, err=None,
          events=[EV_ADMIN(P, EVENT)], admin=hx(bytes(EVENT)),
          length=949, payer_delta=5000, diff_subset=(8, 40)),
    ]),
    ("admin-rotate-config", {}, [
        S(admin_ix(PAYER, True, CONFIG_KEY), PAYER, err=None,
          events=[EV_ADMIN(P, CONFIG_KEY)], admin=hx(bytes(CONFIG_KEY)),
          length=949, payer_delta=5000, diff_subset=(8, 40)),
    ]),
    ("admin-rotate-self", {}, [
        S(admin_ix(PAYER, True, P), PAYER, err=None,
          events=[EV_ADMIN(P, P)], admin=hx(bytes(P)),
          length=949, payer_delta=5000, diff_subset=(8, 40)),
    ]),
    ("admin-rotate-unfunded", {}, [
        S(admin_ix(PAYER, True, UNFUNDED77), PAYER, err=None,
          events=[EV_ADMIN(P, UNFUNDED77)], admin=hx(bytes(UNFUNDED77)),
          length=949, payer_delta=5000, diff_subset=(8, 40)),
    ]),
    ("admin-rotate-outsider-signer", {}, [
        S(admin_ix(OUTSIDER, True, P), OUTSIDER,
          err="InstructionErrorCustom(6005)", site="InvalidAdmin",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("admin-rotate-unsigned", {}, [
        S(admin_ix(PAYER, False, O), OUTSIDER,
          err="InstructionErrorCustom(3010)", site="AccountNotSigner",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("admin-rotate-readonly-config", {}, [
        S(admin_ix(PAYER, True, O, cfg_writable=False), PAYER,
          err="InstructionErrorCustom(2000)", site="ConstraintMut",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("admin-rotate-wrong-owner", {"owner": Pubkey.default()}, [
        S(admin_ix(PAYER, True, O), PAYER,
          err="InstructionErrorCustom(3007)", site="AccountOwnedByWrongProgram",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("admin-trunc-907", {"data": bytes(RAW[:907])}, [
        S(admin_ix(PAYER, True, O), PAYER,
          err="BorshIoError", site="BorshIoError",
          events=[EV_ADMIN(P, O)], rollback=True, payer_delta=5000),
    ]),
    ("admin-trunc-948", {"data": bytes(RAW[:948])}, [
        S(admin_ix(PAYER, True, O), PAYER,
          err="BorshIoError", site="BorshIoError",
          events=[EV_ADMIN(P, O)], rollback=True, payer_delta=5000),
    ]),
    ("admin-trunc-906", {"data": bytes(RAW[:906])}, [
        S(admin_ix(PAYER, True, O), PAYER,
          err="InvalidAccountData", site="InvalidAccountData",
          events=[], rollback=True, payer_delta=5000),
    ]),
    # ---- update_admin chains ----
    ("admin-chain-rotate-disable", {}, [
        S(admin_ix(PAYER, True, O), PAYER, err=None,
          events=[EV_ADMIN(P, O)], admin=hx(bytes(O)), payer_delta=5000,
          diff_subset=(8, 40)),
        S(disable_ix(PAYER, [1, 0, 0, 0, 0]), PAYER,
          err="InstructionErrorCustom(6005)", site="InvalidAdmin",
          events=[], rollback=True, payer_delta=5000),
        S(disable_ix(OUTSIDER, [1, 0, 0, 0, 0]), OUTSIDER, err=None,
          events=[EV_DISABLE(O, [1, 0, 0, 0, 0])], flags=1,
          payer_delta=5000, diff_subset=(56, 57)),
    ]),
    ("admin-chain-rotate-default-brick", {}, [
        S(admin_ix(PAYER, True, Pubkey.default()), PAYER, err=None,
          events=[EV_ADMIN(P, Pubkey.default())],
          admin=hx(bytes(32)), payer_delta=5000, diff_subset=(8, 40)),
        S(disable_ix(PAYER, [1, 0, 0, 0, 0]), PAYER,
          err="InstructionErrorCustom(6005)", site="InvalidAdmin",
          events=[], rollback=True, payer_delta=5000),
        S(boost_ix(PAYER, True, O), PAYER,
          err="InstructionErrorCustom(6005)", site="InvalidAdmin",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("admin-chain-roundtrip", {}, [
        S(admin_ix(PAYER, True, O), PAYER, err=None,
          events=[EV_ADMIN(P, O)], admin=hx(bytes(O)), payer_delta=5000,
          diff_subset=(8, 40)),
        S(admin_ix(OUTSIDER, True, P), OUTSIDER, err=None,
          events=[EV_ADMIN(O, P)], admin=hx(bytes(P)), payer_delta=5000,
          diff_subset=(8, 40)),
        S(disable_ix(PAYER, [0, 1, 0, 0, 0]), PAYER, err=None,
          events=[EV_DISABLE(P, [0, 1, 0, 0, 0])], flags=2,
          payer_delta=5000, diff_subset=(56, 57)),
    ]),
    # ---- set_boost_authority ----
    ("boost-to-outsider", {}, [
        S(boost_ix(PAYER, True, O), PAYER, err=None,
          events=[EV_BOOST(P, FIXTURE_BOOST, O)], boost=hx(bytes(O)),
          length=949, cfg_lamports=CONFIG['lamports'], payer_delta=5000,
          diff_subset=(907, 939)),
    ]),
    ("boost-to-default", {}, [
        S(boost_ix(PAYER, True, Pubkey.default()), PAYER, err=None,
          events=[EV_BOOST(P, FIXTURE_BOOST, Pubkey.default())],
          boost=hx(bytes(32)), payer_delta=5000, diff_subset=(907, 939)),
    ]),
    ("boost-to-unfunded", {}, [
        S(boost_ix(PAYER, True, UNFUNDED88), PAYER, err=None,
          events=[EV_BOOST(P, FIXTURE_BOOST, UNFUNDED88)],
          boost=hx(bytes(UNFUNDED88)), payer_delta=5000,
          diff_subset=(907, 939)),
    ]),
    ("boost-outsider-signer", {}, [
        S(boost_ix(OUTSIDER, True, O), OUTSIDER,
          err="InstructionErrorCustom(6005)", site="InvalidAdmin",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("boost-unsigned", {}, [
        S(boost_ix(PAYER, False, O), OUTSIDER,
          err="InstructionErrorCustom(3010)", site="AccountNotSigner",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("boost-readonly-config", {}, [
        S(boost_ix(PAYER, True, O, cfg_writable=False), PAYER,
          err="InstructionErrorCustom(2000)", site="ConstraintMut",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("boost-wrong-owner", {"owner": Pubkey.default()}, [
        S(boost_ix(PAYER, True, O), PAYER,
          err="InstructionErrorCustom(3007)", site="AccountOwnedByWrongProgram",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("boost-trunc-907", {"data": bytes(RAW[:907])}, [
        S(boost_ix(PAYER, True, O), PAYER, err=None,
          events=[{"event": "SetBoostAuthorityEvent", "timestamp": 0,
                   "admin": hx(bytes(P)), "old": hx(bytes(32)),
                   "new": hx(bytes(O))}],
          boost=hx(bytes(O)), length=949,
          cfg_lamports=CONFIG['lamports'], payer_delta=5000,
          tail_zero=(939, 949)),
    ]),
    ("boost-trunc-906", {"data": bytes(RAW[:906])}, [
        S(boost_ix(PAYER, True, O), PAYER,
          err="InvalidAccountData", site="InvalidAccountData",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("boost-trunc-948-lowlamports", {"data": bytes(RAW[:948]), "lamports": 100}, [
        S(boost_ix(PAYER, True, O), PAYER, err=None,
          events=[EV_BOOST(P, FIXTURE_BOOST, O)], boost=hx(bytes(O)),
          length=949, cfg_lamports=RENT949, payer_delta=7500820,
          tail_zero=(948, 949)),
    ]),
    ("boost-full-949-lowlamports", {"lamports": 100}, [
        S(boost_ix(PAYER, True, O), PAYER, err=None,
          events=[EV_BOOST(P, FIXTURE_BOOST, O)], boost=hx(bytes(O)),
          length=949, cfg_lamports=100, payer_delta=5000,
          diff_subset=(907, 939)),
    ]),
    # ---- update_creator_fee_config ----
    ("creator-false-max0", {}, [
        S(creator_ix(PAYER, creator_payload(0, 0)), PAYER, err=None,
          events=[EV_CREATOR(P, 0, 0)], conf=0, max=0,
          payer_delta=5000, diff_subset=(940, 949)),
    ]),
    ("creator-true-max10000", {}, [
        S(creator_ix(PAYER, creator_payload(1, 10000)), PAYER, err=None,
          events=[EV_CREATOR(P, 1, 10000)], conf=1, max=10000,
          payer_delta=5000, diff_subset=(940, 949)),
    ]),
    ("creator-true-maxu64", {}, [
        S(creator_ix(PAYER, creator_payload(1, 2 ** 64 - 1)), PAYER, err=None,
          events=[EV_CREATOR(P, 1, 2 ** 64 - 1)], conf=1, max=2 ** 64 - 1,
          payer_delta=5000, diff_subset=(940, 949)),
    ]),
    ("creator-bool2", {}, [
        S(creator_ix(PAYER, creator_payload(2, 300)), PAYER,
          err="InstructionErrorCustom(102)", site="InstructionDidNotDeserialize",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("creator-args-empty", {}, [
        S(creator_ix(PAYER, b''), PAYER,
          err="InstructionErrorCustom(102)", site="InstructionDidNotDeserialize",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("creator-args-trailing", {}, [
        S(creator_ix(PAYER, creator_payload(1, 300) + b'X'), PAYER, err=None,
          events=[EV_CREATOR(P, 1, 300)], conf=1, max=300,
          payer_delta=5000, diff_subset=(940, 949)),
    ]),
    ("creator-outsider", {}, [
        S(creator_ix(OUTSIDER, creator_payload(1, 300)), OUTSIDER,
          err="InstructionErrorCustom(6005)", site="InvalidAdmin",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("creator-wrong-owner", {"owner": Pubkey.default()}, [
        S(creator_ix(PAYER, creator_payload(1, 300)), PAYER,
          err="InstructionErrorCustom(3007)", site="AccountOwnedByWrongProgram",
          events=[], rollback=True, payer_delta=5000),
    ]),
    ("creator-trunc-907", {"data": bytes(RAW[:907])}, [
        S(creator_ix(PAYER, creator_payload(1, 777)), PAYER, err=None,
          events=[EV_CREATOR(P, 1, 777)], conf=1, max=777,
          length=949, cfg_lamports=CONFIG['lamports'], payer_delta=5000,
          tail_zero=(939, 940)),
    ]),
    ("creator-trunc-948-lowlamports", {"data": bytes(RAW[:948]), "lamports": 100}, [
        S(creator_ix(PAYER, creator_payload(1, 300)), PAYER, err=None,
          events=[EV_CREATOR(P, 1, 300)], conf=1, max=300,
          length=949, cfg_lamports=RENT949, payer_delta=7500820),
    ]),
]


def run_step(vm, ix, tx_payer):
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
    events = [l for l in logs if l.startswith('Program data: ')]
    decoded = []
    for e in events:
        d = decode_event(base64.b64decode(e[len('Program data: '):]))
        assert d is not None, (e, "unknown event")
        decoded.append(d)
    observed = {
        "error": str(r.err()) if failed else None,
        "events": decoded,
        "admin": hx(after[8:40]) if after and len(after) >= 40 else None,
        "boost": hx(after[907:939]) if after and len(after) >= 939 else None,
        "conf": after[940] if after and len(after) >= 941 else None,
        "max": struct.unpack_from('<Q', after, 941)[0] if after and len(after) >= 949 else None,
        "flags": after[56] if after and len(after) >= 57 else None,
        "length": len(after) if after is not None else None,
        "cfg_lamports": after_lamp,
        "payer_delta": payer_before - payer_after,
        "rollback": (before == after and before_lamp == after_lamp),
    }
    return {
        "tx": base64.b64encode(bytes(tx)).decode(),
        "signatures": [str(s) for s in tx.signatures],
        "transaction_sha256": sha(bytes(tx)),
        "logs": logs, "events": events,
        "before_hex": before.hex() if before is not None else None,
        "after_hex": after.hex() if after is not None else None,
        "before_lamports": before_lamp, "after_lamports": after_lamp,
        "payer_before": payer_before, "payer_after": payer_after,
        "observed": observed,
    }


def check_step(label, image, step_index, res, exp):
    obs = res["observed"]
    if exp.get("err") is None:
        assert obs["error"] is None, (label, image, step_index, obs["error"])
    else:
        assert obs["error"] is not None and exp["err"] in obs["error"], \
            (label, image, step_index, obs["error"])
    if exp.get("site"):
        assert exp["site"] in "\n".join(res["logs"]), \
            (label, image, step_index, res["logs"][-4:])
    assert obs["events"] == exp.get("events", []), \
        (label, image, step_index, obs["events"], exp.get("events"))
    for key in ("admin", "boost", "conf", "max", "flags", "length", "cfg_lamports"):
        if key in exp:
            assert obs[key] == exp[key], \
                (label, image, step_index, key, obs[key], exp[key])
    assert obs["payer_delta"] == exp["payer_delta"], \
        (label, image, step_index, obs["payer_delta"], exp["payer_delta"])
    if exp.get("rollback"):
        assert obs["rollback"], (label, image, step_index, "no rollback")
    if exp.get("tail_zero"):
        lo, hi = exp["tail_zero"]
        after = bytes.fromhex(res["after_hex"])
        assert all(b == 0 for b in after[lo:hi]), \
            (label, image, step_index, after[lo:hi].hex())
    if exp.get("diff_subset"):
        lo, hi = exp["diff_subset"]
        before = bytes.fromhex(res["before_hex"])
        after = bytes.fromhex(res["after_hex"])
        assert len(before) == len(after), (label, image, step_index, "length changed")
        diffs = [i for i in range(len(before)) if before[i] != after[i]]
        assert all(lo <= i < hi for i in diffs), \
            (label, image, step_index, diffs)


def run_case(label, setup, steps, binary):
    vm = LiteSVM().with_transaction_history(0)
    vm.add_program_from_file(PROGRAM, binary)
    for who in [PAYER, OUTSIDER]:
        vm.airdrop(who.pubkey(), 10 ** 12)
    vm.set_account(EVENT, Account(10 ** 9, b'', Pubkey.default()))
    data = setup.get("data", bytes(RAW))
    vm.set_account(CONFIG_KEY, Account(
        setup.get("lamports", CONFIG['lamports']), bytes(data),
        setup.get("owner", PROGRAM)))
    receipts = []
    for step_index, (ix, tx_payer, exp) in enumerate(steps):
        res = run_step(vm, ix, tx_payer)
        check_step(label, binary, step_index, res, exp)
        receipts.append(res)
    return receipts


receipts_global = []
report_cases = []
for index, (label, setup, steps) in enumerate(CASES):
    row = {"case": {"label": label, "steps": len(steps)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        receipts = run_case(label, setup, steps, IMAGES[image])
        for step_index, res in enumerate(receipts):
            raw = base64.b64decode(res["tx"])
            tx = Transaction.from_bytes(raw)
            checks = tx.verify_with_results()
            assert checks and all(checks) and len(checks) == 1
            assert res["transaction_sha256"] == sha(raw)
            seen.add((step_index, res["observed"]["error"],
                      json.dumps(res["observed"]["events"], sort_keys=True),
                      res["after_hex"], res["after_lamports"],
                      res["observed"]["payer_delta"]))
            receipts_global.append({
                "sequence": len(receipts_global),
                "vm": len(receipts_global),
                "context": {"index": index, "image": image, "label": label,
                            "step": step_index},
                "transaction_base64": res["tx"],
                "signatures": res["signatures"],
                "transaction_sha256": res["transaction_sha256"],
                "all_signatures_verified": True, "signature_fields": 1,
                "before_hex": res["before_hex"],
                "after_hex": res["after_hex"],
                "before_lamports": res["before_lamports"],
                "after_lamports": res["after_lamports"],
                "payer_before": res["payer_before"],
                "payer_after": res["payer_after"],
                "metadata": {"logs": res["logs"], "events": res["events"],
                             "inner_instructions": []},
                "loaded_programs": {"pAMM": {"sha256": IMAGE_SHA[image]}},
                "error": res["observed"]["error"],
                "observed": res["observed"],
            })
            print(f"  {label}[{image}] step{step_index} "
                  f"err={res['observed']['error']} "
                  f"events={len(res['observed']['events'])} "
                  f"payer_delta={res['observed']['payer_delta']}", flush=True)
        row[image] = {"steps": [r["observed"] for r in receipts]}
    assert len(seen) == len(steps), (label, "images must agree", seen)
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
    "evidence/upstream/pump_amm.json",
    "research/imported-lab/analysis/pump_fun/config-snapshot.json",
    "programs/pump-amm/src/lib.rs",
    "programs/pump-amm/src/instructions/admin/mod.rs",
    "programs/pump-amm/src/instructions/admin/create_config.rs",
    "programs/pump-amm/src/state/global_config.rs",
]
report = {"schema": 1, "packet": "amm-admin-authority-rotation-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("update_admin / set_boost_authority / "
                    "update_creator_fee_config as state transitions on "
                    "synthetic GlobalConfig fixtures, fresh VM per case "
                    "per image (original / #424 control / #427 candidate). "
                    "Receipts are stored as parts to stay under GitHub's "
                    "25MB web-upload limit; verify.py reads them in order."),
          "image_sha256": IMAGE_SHA,
          "cases": report_cases,
          "counts": {"vms": len(receipts_global),
                     "transactions": len(receipts_global),
                     "signature_fields": len(receipts_global)},
          "input_sha256": {n: sha((ROOT / n).read_bytes()) for n in repo_inputs},
          "transaction_receipts": {"parts": parts}}
(OUT / "runtime/report.json.gz").write_bytes(
    gzip.compress(json.dumps(report, indent=1).encode(), mtime=0))
print(f"cases: {len(report_cases)} receipts: {len(receipts_global)}")
print(f"wrote: {OUT / 'runtime/report.json.gz'}")
