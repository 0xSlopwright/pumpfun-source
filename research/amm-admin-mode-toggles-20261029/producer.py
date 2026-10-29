#!/usr/bin/env python3
"""Build research/amm-admin-mode-toggles-20261029 receipts.

Admin mode toggles (2nd run packet #28). Nothing in the 1st run or
2nd #1-#27 covers toggle_mayhem_mode / toggle_boost /
toggle_cashback_enabled as state transitions:
- toggle_mayhem_mode writes only byte 417 and toggle_cashback_enabled
  only byte 642; both are SILENT (no event) even though AdminGlobal
  carries #[event_cpi] -- the handlers never call emit_cpi. The same
  holds for toggle_boost on AdminGlobalNoEvent.
- mayhem and cashback toggles REJECT same-state writes:
  6043 MayhemModeInDesiredState (toggle_mayhem_mode.rs:17) and
  6051 CashbackNotInDesiredState, fully rolled back.
- toggle_boost has NO same-state check: toggling to the state the
  flag already holds SUCCEEDS (byte unchanged, payer 5,000). This
  asymmetry is the sharpest pin of the packet.
- toggle_boost additionally requires a non-default boost authority:
  with authority bytes 907..939 all zero, either direction fails
  6005 InvalidAdmin (toggle_boost.rs:14) before any write.
- Shared auth map (all fully rolled back, payer 5,000): outsider
  signer -> 6005 InvalidAdmin, unsigned admin -> 3010
  AccountNotSigner, readonly config -> 2000 ConstraintMut,
  wrong-owner config -> 3007 AccountOwnedByWrongProgram, bool byte 2
  or missing arg -> 102 InstructionDidNotDeserialize.
- Chains compose: off -> on round-trips for all three toggles, and
  boost same-state writes succeed repeatedly (on -> on, off -> off).
- Downstream create_pool gates (create harness, same PAYER creator):
  mayhem off -> create with is_mayhem_mode fails 6041
  MayhemModeDisabled (create_pool.rs:171); mayhem on with a
  non-canonical creator fails 6042 OnlyPumpPoolsMayhemMode (:177);
  cashback off -> create with is_cashback_coin fails 6049
  CashbackNotEnabled (:183); cashback on with a non-canonical
  creator fails 6050 OnlyPumpPoolsCashback (:189); both flags off
  with both modes requested fails 6041 first (mayhem checked first).
- claim_cashback IGNORES the global cashback flag: with a disabled
  (byte 642 = 0) config present in the VM, the base claim still
  succeeds (vault 1000 -> 0, dest +1000, claimed 13 -> 1013, event
  present). The flag gates creation only, never claims -- the claim
  instruction's account list contains no global_config at all.
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
from solders.clock import Clock
from solders.instruction import AccountMeta, Instruction
from solders.keypair import Keypair
from solders.litesvm import LiteSVM
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

from pump_amm_admin_differential import Harness
from pump_amm_create_differential import (
    ATA as CREATE_ATA, CONFIG as CREATE_CONFIG, CONFIG_KEY as CREATE_CONFIG_KEY,
    EVENT as CREATE_EVENT, IDL as CREATE_IDL, PAYER as CREATE_PAYER,
    PROGRAM as CREATE_PROGRAM, RAW as CREATE_RAW, TOKEN as CREATE_TOKEN,
    TOKEN22 as CREATE_TOKEN22, base as CREATE_BASE, f as CREATE_F,
    quote as CREATE_QUOTE, userbase as CREATE_USERBASE,
    userquote as CREATE_USERQUOTE,
)
from pump_amm_liquidity_differential import (
    PAYER as LIQ_PAYER, TOKEN as LIQ_TOKEN, TOKEN22 as LIQ_TOKEN22,
    acquire_harness, base as LIQ_BASE, f as LIQ_F, quote as LIQ_QUOTE,
    token as liq_token, token as liq_token_create,
)

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-admin-mode-toggles-20261029"
WS = Path.home() / "workspace/slop-verify"
PROGRAM = Pubkey.from_string('pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA')
EVENT = Pubkey.find_program_address([b'__event_authority'], PROGRAM)[0]
PAYER = Keypair.from_seed(bytes([201]) * 32)
OUTSIDER = Keypair.from_seed(bytes([202]) * 32)
IDL = json.loads((ROOT / 'evidence/upstream/pump_amm.json').read_text())
CONFIG = next(x for x in json.loads((ROOT / 'research/imported-lab/analysis/pump_fun/config-snapshot.json').read_text())['accounts'] if x['program_name'] == 'pump_amm')
CONFIG_KEY = Pubkey.from_string(CONFIG['address'])
RAW = bytearray(base64.b64decode(CONFIG['data_base64']))
RAW[8:40] = bytes(PAYER.pubkey())
DISC = {x['name']: bytes(x['discriminator']) for x in IDL['instructions']}
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def hx(b):
    return bytes(b).hex()


def tog_ix(name, enabled, signer, sign=True, writable=True, payload=None):
    metas = [AccountMeta(signer.pubkey(), sign, False),
             AccountMeta(CONFIG_KEY, False, writable)]
    if name != 'toggle_boost':
        metas += [AccountMeta(EVENT, False, False), AccountMeta(PROGRAM, False, False)]
    data = DISC[name] if payload is not None else DISC[name] + bytes([1 if enabled else 0])
    if payload is not None:
        data = DISC[name] + payload
    return Instruction(PROGRAM, data, metas)


def S(ix, payer, **exp):
    return (ix, payer, exp)


def setup_data(setup):
    data = bytearray(setup.get("data", bytes(RAW)))
    for off, val in setup.get("patch", []):
        data[off] = val
    if setup.get("auth_zero"):
        data[907:939] = bytes(32)
    return bytes(data)


# ---------------- toggle cases ----------------
# (label, setup, [(ix, payer, expected), ...])
# expected: err (None or substring), site, mayhem/cashback/boost (int),
#   auth (hex), length, payer_delta, rollback, diff_subset.
TOGGLE_CASES = [
    ("mayhem-off", {}, [
        S(tog_ix('toggle_mayhem_mode', False, PAYER), PAYER, err=None,
          mayhem=0, payer_delta=5000, diff_subset=(417, 418)),
    ]),
    ("mayhem-on-from-off", {"patch": [(417, 0)]}, [
        S(tog_ix('toggle_mayhem_mode', True, PAYER), PAYER, err=None,
          mayhem=1, payer_delta=5000, diff_subset=(417, 418)),
    ]),
    ("mayhem-same-on", {}, [
        S(tog_ix('toggle_mayhem_mode', True, PAYER), PAYER,
          err="InstructionErrorCustom(6043)", site="MayhemModeInDesiredState",
          mayhem=1, payer_delta=5000, rollback=True),
    ]),
    ("mayhem-same-off", {"patch": [(417, 0)]}, [
        S(tog_ix('toggle_mayhem_mode', False, PAYER), PAYER,
          err="InstructionErrorCustom(6043)", site="MayhemModeInDesiredState",
          mayhem=0, payer_delta=5000, rollback=True),
    ]),
    ("mayhem-outsider", {}, [
        S(tog_ix('toggle_mayhem_mode', False, OUTSIDER), OUTSIDER,
          err="InstructionErrorCustom(6005)", site="InvalidAdmin",
          mayhem=1, payer_delta=5000, rollback=True),
    ]),
    ("mayhem-unsigned", {}, [
        S(tog_ix('toggle_mayhem_mode', False, PAYER, sign=False), OUTSIDER,
          err="InstructionErrorCustom(3010)", site="AccountNotSigner",
          mayhem=1, payer_delta=5000, rollback=True),
    ]),
    ("mayhem-readonly", {}, [
        S(tog_ix('toggle_mayhem_mode', False, PAYER, writable=False), PAYER,
          err="InstructionErrorCustom(2000)", site="ConstraintMut",
          mayhem=1, payer_delta=5000, rollback=True),
    ]),
    ("mayhem-wrong-owner", {"owner": Pubkey.default()}, [
        S(tog_ix('toggle_mayhem_mode', False, PAYER), PAYER,
          err="InstructionErrorCustom(3007)", site="AccountOwnedByWrongProgram",
          mayhem=1, payer_delta=5000, rollback=True),
    ]),
    ("mayhem-bool2", {}, [
        S(tog_ix('toggle_mayhem_mode', None, PAYER, payload=bytes([2])), PAYER,
          err="InstructionErrorCustom(102)", site="InstructionDidNotDeserialize",
          mayhem=1, payer_delta=5000, rollback=True),
    ]),
    ("mayhem-noarg", {}, [
        S(tog_ix('toggle_mayhem_mode', None, PAYER, payload=b''), PAYER,
          err="InstructionErrorCustom(102)", site="InstructionDidNotDeserialize",
          mayhem=1, payer_delta=5000, rollback=True),
    ]),
    ("cashback-off", {}, [
        S(tog_ix('toggle_cashback_enabled', False, PAYER), PAYER, err=None,
          cashback=0, payer_delta=5000, diff_subset=(642, 643)),
    ]),
    ("cashback-on-from-off", {"patch": [(642, 0)]}, [
        S(tog_ix('toggle_cashback_enabled', True, PAYER), PAYER, err=None,
          cashback=1, payer_delta=5000, diff_subset=(642, 643)),
    ]),
    ("cashback-same-on", {}, [
        S(tog_ix('toggle_cashback_enabled', True, PAYER), PAYER,
          err="InstructionErrorCustom(6051)", site="CashbackNotInDesiredState",
          cashback=1, payer_delta=5000, rollback=True),
    ]),
    ("cashback-same-off", {"patch": [(642, 0)]}, [
        S(tog_ix('toggle_cashback_enabled', False, PAYER), PAYER,
          err="InstructionErrorCustom(6051)", site="CashbackNotInDesiredState",
          cashback=0, payer_delta=5000, rollback=True),
    ]),
    ("cashback-outsider", {}, [
        S(tog_ix('toggle_cashback_enabled', False, OUTSIDER), OUTSIDER,
          err="InstructionErrorCustom(6005)", site="InvalidAdmin",
          cashback=1, payer_delta=5000, rollback=True),
    ]),
    ("cashback-unsigned", {}, [
        S(tog_ix('toggle_cashback_enabled', False, PAYER, sign=False), OUTSIDER,
          err="InstructionErrorCustom(3010)", site="AccountNotSigner",
          cashback=1, payer_delta=5000, rollback=True),
    ]),
    ("boost-off", {}, [
        S(tog_ix('toggle_boost', False, PAYER), PAYER, err=None,
          boost=0, payer_delta=5000, diff_subset=(939, 940)),
    ]),
    ("boost-on-from-off", {"patch": [(939, 0)]}, [
        S(tog_ix('toggle_boost', True, PAYER), PAYER, err=None,
          boost=1, payer_delta=5000, diff_subset=(939, 940)),
    ]),
    ("boost-same-on", {}, [
        S(tog_ix('toggle_boost', True, PAYER), PAYER, err=None,
          boost=1, payer_delta=5000, diff_subset=(939, 940)),
    ]),
    ("boost-same-off", {"patch": [(939, 0)]}, [
        S(tog_ix('toggle_boost', False, PAYER), PAYER, err=None,
          boost=0, payer_delta=5000, diff_subset=(939, 940)),
    ]),
    ("boost-default-auth-off", {"auth_zero": True}, [
        S(tog_ix('toggle_boost', False, PAYER), PAYER,
          err="InstructionErrorCustom(6005)", site="InvalidAdmin",
          boost=1, payer_delta=5000, rollback=True),
    ]),
    ("boost-default-auth-same-on", {"auth_zero": True}, [
        S(tog_ix('toggle_boost', True, PAYER), PAYER,
          err="InstructionErrorCustom(6005)", site="InvalidAdmin",
          boost=1, payer_delta=5000, rollback=True),
    ]),
    ("boost-outsider", {}, [
        S(tog_ix('toggle_boost', False, OUTSIDER), OUTSIDER,
          err="InstructionErrorCustom(6005)", site="InvalidAdmin",
          boost=1, payer_delta=5000, rollback=True),
    ]),
    ("boost-unsigned", {}, [
        S(tog_ix('toggle_boost', False, PAYER, sign=False), OUTSIDER,
          err="InstructionErrorCustom(3010)", site="AccountNotSigner",
          boost=1, payer_delta=5000, rollback=True),
    ]),
    ("boost-readonly", {}, [
        S(tog_ix('toggle_boost', False, PAYER, writable=False), PAYER,
          err="InstructionErrorCustom(2000)", site="ConstraintMut",
          boost=1, payer_delta=5000, rollback=True),
    ]),
    ("chain-mayhem-off-on", {}, [
        S(tog_ix('toggle_mayhem_mode', False, PAYER), PAYER, err=None,
          mayhem=0, payer_delta=5000, diff_subset=(417, 418)),
        S(tog_ix('toggle_mayhem_mode', True, PAYER), PAYER, err=None,
          mayhem=1, payer_delta=5000, diff_subset=(417, 418)),
    ]),
    ("chain-cashback-off-on", {}, [
        S(tog_ix('toggle_cashback_enabled', False, PAYER), PAYER, err=None,
          cashback=0, payer_delta=5000, diff_subset=(642, 643)),
        S(tog_ix('toggle_cashback_enabled', True, PAYER), PAYER, err=None,
          cashback=1, payer_delta=5000, diff_subset=(642, 643)),
    ]),
    ("chain-boost-off-on", {}, [
        S(tog_ix('toggle_boost', False, PAYER), PAYER, err=None,
          boost=0, payer_delta=5000, diff_subset=(939, 940)),
        S(tog_ix('toggle_boost', True, PAYER), PAYER, err=None,
          boost=1, payer_delta=5000, diff_subset=(939, 940)),
    ]),
    ("chain-boost-samestate", {}, [
        S(tog_ix('toggle_boost', True, PAYER), PAYER, err=None,
          boost=1, payer_delta=5000, diff_subset=(939, 940)),
        S(tog_ix('toggle_boost', False, PAYER), PAYER, err=None,
          boost=0, payer_delta=5000, diff_subset=(939, 940)),
        S(tog_ix('toggle_boost', False, PAYER), PAYER, err=None,
          boost=0, payer_delta=5000, diff_subset=(939, 940)),
    ]),
]


def run_toggle_step(vm, ix, tx_payer):
    cfg_before = vm.get_account(CONFIG_KEY)
    before = bytes(cfg_before.data) if cfg_before else None
    before_lamp = cfg_before.lamports if cfg_before else None
    payer_before = vm.get_account(tx_payer.pubkey()).lamports
    tx = Transaction.new_signed_with_payer(
        [ix], tx_payer.pubkey(), [tx_payer], vm.latest_blockhash())
    assert all(tx.verify_with_results())
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    logs = meta.logs()
    cfg_after = vm.get_account(CONFIG_KEY)
    after = bytes(cfg_after.data) if cfg_after else None
    after_lamp = cfg_after.lamports if cfg_after else None
    payer_after = vm.get_account(tx_payer.pubkey()).lamports
    events = [l for l in logs if l.startswith('Program data: ')]
    observed = {
        "error": str(r.err()) if failed else None,
        "event_count": len(events),
        "mayhem": after[417] if after and len(after) > 417 else None,
        "cashback": after[642] if after and len(after) > 642 else None,
        "boost": after[939] if after and len(after) > 939 else None,
        "auth": hx(after[907:939]) if after and len(after) >= 939 else None,
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


def check_toggle_step(label, image, step_index, res, exp):
    obs = res["observed"]
    if exp.get("err") is None:
        assert obs["error"] is None, (label, image, step_index, obs["error"])
    else:
        assert obs["error"] is not None and exp["err"] in obs["error"], \
            (label, image, step_index, obs["error"])
    if exp.get("site"):
        assert exp["site"] in "\n".join(res["logs"]), \
            (label, image, step_index, res["logs"][-4:])
    assert obs["event_count"] == 0, (label, image, step_index, "toggle emitted an event")
    for key in ("mayhem", "cashback", "boost", "auth", "length", "cfg_lamports"):
        if key in exp:
            assert obs[key] == exp[key], \
                (label, image, step_index, key, obs[key], exp[key])
    assert obs["payer_delta"] == exp["payer_delta"], \
        (label, image, step_index, obs["payer_delta"])
    if exp.get("rollback"):
        assert obs["rollback"], (label, image, step_index, "no rollback")
    if exp.get("diff_subset"):
        lo, hi = exp["diff_subset"]
        before = bytes.fromhex(res["before_hex"])
        after = bytes.fromhex(res["after_hex"])
        assert len(before) == len(after), (label, image, step_index, "length changed")
        diffs = [i for i in range(len(before)) if before[i] != after[i]]
        assert all(lo <= i < hi for i in diffs), (label, image, step_index, diffs)


def run_toggle_case(label, setup, steps, binary):
    vm = LiteSVM().with_transaction_history(0)
    vm.add_program_from_file(PROGRAM, binary)
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for who in [PAYER, OUTSIDER]:
        vm.airdrop(who.pubkey(), 10 ** 12)
    vm.set_account(EVENT, Account(10 ** 9, b'', Pubkey.default()))
    vm.set_account(CONFIG_KEY, Account(
        setup.get("lamports", CONFIG['lamports']), setup_data(setup),
        setup.get("owner", PROGRAM)))
    receipts = []
    for step_index, (ix, tx_payer, exp) in enumerate(steps):
        res = run_toggle_step(vm, ix, tx_payer)
        check_toggle_step(label, binary, step_index, res, exp)
        receipts.append(res)
    return receipts


# ---------------- create cases ----------------
# (label, cfg_patch, mayhem, cashback, err_substr, site_fragment)
CREATE_CASES = [
    ("create-mayhem-off", [(417, 0)], True, False, "6041", "MayhemModeDisabled"),
    ("create-mayhem-on-noncanon", [], True, False, "6042", "OnlyPumpPoolsMayhemMode"),
    ("create-cashback-off", [(642, 0)], False, True, "6049", "CashbackNotEnabled"),
    ("create-cashback-on-noncanon", [], False, True, "6050", "OnlyPumpPoolsCashback"),
    ("create-both-off", [(417, 0), (642, 0)], True, True, "6041", "MayhemModeDisabled"),
]


def setup_create_vm(image, patch):
    h = Harness(str(image))
    vm = h.vm
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, name in ((CREATE_TOKEN, "spl_token"), (CREATE_TOKEN22, "spl_token_2022"),
                      (CREATE_ATA, "associated_token")):
        vm.add_program_from_file(pid, str(ROOT / "evidence/dependencies" / name / "deployed.so"))
    glob = bytearray(CREATE_RAW)
    glob[56] = 0
    for off, val in patch:
        glob[off] = val
    vm.set_account(CREATE_CONFIG_KEY, Account(CREATE_CONFIG["lamports"], bytes(glob), CREATE_PROGRAM))
    for n in ["base_mint", "quote_mint"]:
        rrow = CREATE_F["accounts"][n]
        vm.set_account(Pubkey.from_string(rrow["address"]),
                       Account(rrow["lamports"], base64.b64decode(rrow["data_base64"]),
                               Pubkey.from_string(rrow["owner"])))
    for key, mint, native in ((CREATE_USERBASE, CREATE_BASE, False),
                              (CREATE_USERQUOTE, CREATE_QUOTE, True)):
        vm.set_account(key, Account(10 ** 15 + 2039280 if native else 10 ** 9,
                                    liq_token_create(
                                        mint, CREATE_PAYER.pubkey(), 10 ** 15, native),
                                    CREATE_TOKEN))
    return vm


def build_create(vm, mayhem, cashback):
    bmint, qmint = CREATE_BASE, CREATE_QUOTE
    pool = Pubkey.find_program_address(
        [b"pool", struct.pack("<H", 0), bytes(CREATE_PAYER.pubkey()), bytes(bmint), bytes(qmint)],
        CREATE_PROGRAM)[0]
    lp = Pubkey.find_program_address([b"pool_lp_mint", bytes(pool)], CREATE_PROGRAM)[0]
    ata = lambda owner, mint, program: Pubkey.find_program_address(
        [bytes(owner), bytes(program), bytes(mint)], CREATE_ATA)[0]
    vaultbase = ata(pool, bmint, CREATE_TOKEN)
    vaultquote = ata(pool, qmint, CREATE_TOKEN)
    keys = [pool, CREATE_CONFIG_KEY, CREATE_PAYER.pubkey(), bmint, qmint, lp,
            CREATE_USERBASE, CREATE_USERQUOTE, ata(CREATE_PAYER.pubkey(), lp, CREATE_TOKEN22),
            vaultbase, vaultquote, Pubkey.default(), CREATE_TOKEN22, CREATE_TOKEN,
            CREATE_TOKEN, CREATE_ATA, CREATE_EVENT, CREATE_PROGRAM]
    ix = next(x for x in CREATE_IDL["instructions"] if x["name"] == "create_pool")
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    args = struct.pack("<HQQ", 0, 10 ** 9, 10 ** 9) + bytes(CREATE_PAYER.pubkey()) \
        + bytes([1 if mayhem else 0, 1 if cashback else 0])
    return Transaction.new_signed_with_payer(
        [Instruction(CREATE_PROGRAM, bytes(ix["discriminator"]) + args, metas)],
        CREATE_PAYER.pubkey(), [CREATE_PAYER], vm.latest_blockhash())


def snap(vm, keys):
    # Skip executable accounts: the program account itself carries the
    # whole .so (10MB for original vs 1.3MB for the rebuilds) and its
    # lamports differ per image, which would both bloat receipts and
    # break cross-image equality. Non-executable state is what matters.
    out = {}
    for k in keys:
        a = vm.get_account(k)
        if a is not None and a.executable:
            continue
        out[str(k)] = {"owner": str(a.owner), "lamports": a.lamports,
                       "executable": a.executable, "data_hex": a.data.hex()} if a else None
    return out


def run_create_case(label, patch, mayhem, cashback, err_sub, site, binary):
    vm = setup_create_vm(binary, patch)
    tx = build_create(vm, mayhem, cashback)
    before_keys = sorted({str(k) for k in tx.message.account_keys}, key=str)
    before = snap(vm, [Pubkey.from_string(k) for k in before_keys])
    raw = bytes(tx)
    assert all(tx.verify_with_results()), "new transaction must verify"
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    after = snap(vm, [Pubkey.from_string(k) for k in before_keys])
    err = str(r.err()) if failed else None
    logs = meta.logs()
    payer_key = str(CREATE_PAYER.pubkey())
    payer_delta = before[payer_key]["lamports"] - after[payer_key]["lamports"]
    assert failed and err is not None and err_sub in err, (label, binary, err)
    assert site in "\n".join(logs), (label, binary, logs[-3:])
    assert payer_delta == 5000, (label, binary, payer_delta)
    assert all(before[k] == after[k] for k in before if k != payer_key), \
        (label, binary, "rollback")
    observed = {"error": err, "site": next(
        (l for l in logs if "thrown in" in l or "caused by account" in l), None),
        "payer_delta": payer_delta, "rollback": True}
    return {
        "tx": base64.b64encode(raw).decode(),
        "signatures": [str(s) for s in tx.signatures],
        "transaction_sha256": sha(raw),
        "logs": logs, "events": [],
        "before": before, "after": after,
        "observed": observed,
    }


# ---------------- claim case ----------------
# claim_cashback with a DISABLED global config present in the VM.
CLAIM_USER = OUTSIDER.pubkey()
CLAIM_U = Pubkey.find_program_address([b'user_volume_accumulator', bytes(CLAIM_USER)], PROGRAM)[0]
CLAIM_DEST = Pubkey.from_bytes(bytes([237]) * 32)


def run_claim_case(binary):
    h = acquire_harness(binary)
    vm = h.vm
    vm.with_sigverify(True)
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, n in [(LIQ_TOKEN, 'spl_token'), (LIQ_TOKEN22, 'spl_token_2022')]:
        vm.add_program_from_file(pid, str(ROOT / 'evidence/dependencies' / n / 'deployed.so'))
    mint = LIQ_QUOTE
    tp = LIQ_TOKEN
    v = Pubkey.find_program_address([bytes(CLAIM_U), bytes(tp), bytes(mint)], Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'))[0]
    row = LIQ_F['accounts']['quote_mint']
    vm.set_account(mint, Account(row['lamports'], base64.b64decode(row['data_base64']), tp))
    ud = hashlib.sha256(b'account:UserVolumeAccumulator').digest()[:8] + bytes(CLAIM_USER) \
        + struct.pack('<BQQQqBQQ', 1, 5, 7, 20, 0, 1, 11, 13)
    vm.set_account(CLAIM_U, Account(10 ** 9, ud.ljust(137, b'\0'), PROGRAM))
    vm.set_account(v, Account(1000 + 2039280, liq_token(mint, CLAIM_U, 1000, True), tp))
    vm.set_account(CLAIM_DEST, Account(2039280, liq_token(mint, CLAIM_USER, 0, True), tp))
    cfg = bytearray(setup_data({}))
    cfg[642] = 0
    vm.set_account(CONFIG_KEY, Account(CONFIG['lamports'], bytes(cfg), PROGRAM))
    ix = next(i for i in IDL['instructions'] if i['name'] == 'claim_cashback')
    keys = [CLAIM_USER, CLAIM_U, mint, tp, v, CLAIM_DEST, Pubkey.default(), EVENT, PROGRAM]
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    snap_keys = keys + [LIQ_PAYER.pubkey(), CONFIG_KEY]

    def snap2():
        out = {}
        for k in snap_keys:
            a = vm.get_account(k)
            if a is not None and a.executable:
                continue
            out[str(k)] = None if a is None else {
                "owner": str(a.owner), "lamports": a.lamports, "data_hex": bytes(a.data).hex()}
        return out

    before = snap2()
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, bytes(ix["discriminator"]), metas)],
        LIQ_PAYER.pubkey(), [LIQ_PAYER], vm.latest_blockhash())
    assert all(tx.verify_with_results())
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    after = snap2()
    err = str(r.err()) if failed else None
    logs = meta.logs()

    def tok(entry):
        if entry is None:
            return None
        data = bytes.fromhex(entry["data_hex"])
        return struct.unpack_from("<Q", data, 64)[0] if len(data) >= 72 else None

    def claimed(entry):
        if entry is None:
            return None
        data = bytes.fromhex(entry["data_hex"])
        return struct.unpack_from("<Q", data, 82)[0] if len(data) >= 90 else None

    vault_key, dest_key, acc_key = str(v), str(CLAIM_DEST), str(CLAIM_U)
    payer_key = str(LIQ_PAYER.pubkey())
    observed = {
        "error": err,
        "vault_before": tok(before[vault_key]), "vault_after": tok(after[vault_key]),
        "dest_before": tok(before[dest_key]), "dest_after": tok(after[dest_key]),
        "claimed_before": claimed(before[acc_key]), "claimed_after": claimed(after[acc_key]),
        "cfg_cashback_before": bytes.fromhex(before[str(CONFIG_KEY)]["data_hex"])[642],
        "cfg_cashback_after": bytes.fromhex(after[str(CONFIG_KEY)]["data_hex"])[642],
        "event_count": len([l for l in logs if l.startswith('Program data: ')]),
        "payer_delta": before[payer_key]["lamports"] - after[payer_key]["lamports"],
    }
    assert err is None, ("claim-cashback-disabled", binary, err)
    assert observed["vault_before"] == 1000 and observed["vault_after"] == 0, observed
    assert observed["dest_after"] - observed["dest_before"] == 1000, observed
    assert observed["claimed_before"] == 13 and observed["claimed_after"] == 1013, observed
    assert observed["cfg_cashback_before"] == 0 and observed["cfg_cashback_after"] == 0, observed
    assert observed["event_count"] >= 1, observed
    assert observed["payer_delta"] == 5000, observed
    return {
        "tx": base64.b64encode(bytes(tx)).decode(),
        "signatures": [str(s) for s in tx.signatures],
        "transaction_sha256": sha(bytes(tx)),
        "logs": logs, "events": [l for l in logs if l.startswith('Program data: ')],
        "before": before, "after": after,
        "observed": observed,
    }


receipts_global = []
report_cases = []
for index, (label, setup, steps) in enumerate(TOGGLE_CASES):
    row = {"case": {"label": label, "kind": "toggle", "steps": len(steps)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        receipts = run_toggle_case(label, setup, steps, IMAGES[image])
        for step_index, res in enumerate(receipts):
            raw = base64.b64decode(res["tx"])
            tx = Transaction.from_bytes(raw)
            checks = tx.verify_with_results()
            assert checks and all(checks) and len(checks) == 1
            assert res["transaction_sha256"] == sha(raw)
            seen.add((step_index, res["observed"]["error"], res["after_hex"],
                      res["after_lamports"], res["observed"]["payer_delta"]))
            receipts_global.append({
                "sequence": len(receipts_global), "vm": len(receipts_global),
                "context": {"index": index, "image": image, "label": label,
                            "step": step_index, "kind": "toggle"},
                "transaction_base64": res["tx"], "signatures": res["signatures"],
                "transaction_sha256": res["transaction_sha256"],
                "all_signatures_verified": True, "signature_fields": 1,
                "before_hex": res["before_hex"], "after_hex": res["after_hex"],
                "before_lamports": res["before_lamports"],
                "after_lamports": res["after_lamports"],
                "payer_before": res["payer_before"], "payer_after": res["payer_after"],
                "metadata": {"logs": res["logs"], "events": res["events"],
                             "inner_instructions": []},
                "loaded_programs": {"pAMM": {"sha256": IMAGE_SHA[image]}},
                "error": res["observed"]["error"], "observed": res["observed"],
            })
            print(f"  {label}[{image}] step{step_index} "
                  f"err={res['observed']['error']} "
                  f"payer_delta={res['observed']['payer_delta']}", flush=True)
        row[image] = {"steps": [r["observed"] for r in receipts]}
    assert len(seen) == len(steps), (label, "images must agree", seen)
    report_cases.append(row)

for label, patch, mayhem, cashback, err_sub, site in CREATE_CASES:
    index = len(report_cases)
    row = {"case": {"label": label, "kind": "create", "steps": 1}}
    seen = set()
    for image in ("original", "control", "candidate"):
        res = run_create_case(label, patch, mayhem, cashback, err_sub, site, IMAGES[image])
        raw = base64.b64decode(res["tx"])
        tx = Transaction.from_bytes(raw)
        assert all(tx.verify_with_results()) and len(tx.verify_with_results()) == 1
        assert res["transaction_sha256"] == sha(raw)
        seen.add((res["observed"]["error"], json.dumps(res["after"], sort_keys=True)))
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "label": label, "step": 0,
                        "kind": "create"},
            "transaction_base64": res["tx"], "signatures": res["signatures"],
            "transaction_sha256": res["transaction_sha256"],
            "all_signatures_verified": True, "signature_fields": 1,
            "before": res["before"], "after": res["after"],
            "metadata": {"logs": res["logs"], "events": res["events"],
                         "inner_instructions": []},
            "loaded_programs": {"pAMM": {"sha256": IMAGE_SHA[image]}},
            "error": res["observed"]["error"], "observed": res["observed"],
        })
        print(f"  {label}[{image}] err={res['observed']['error']}", flush=True)
        row[image] = {"steps": [res["observed"]]}
    assert len(seen) == 1, (label, "images must agree", seen)
    report_cases.append(row)

index = len(report_cases)
row = {"case": {"label": "claim-cashback-disabled", "kind": "claim", "steps": 1}}
seen = set()
for image in ("original", "control", "candidate"):
    res = run_claim_case(IMAGES[image])
    raw = base64.b64decode(res["tx"])
    tx = Transaction.from_bytes(raw)
    assert all(tx.verify_with_results()) and len(tx.verify_with_results()) == 1
    assert res["transaction_sha256"] == sha(raw)
    seen.add((res["observed"]["error"], json.dumps(res["observed"], sort_keys=True)))
    receipts_global.append({
        "sequence": len(receipts_global), "vm": len(receipts_global),
        "context": {"index": index, "image": image, "label": "claim-cashback-disabled",
                    "step": 0, "kind": "claim"},
        "transaction_base64": res["tx"], "signatures": res["signatures"],
        "transaction_sha256": res["transaction_sha256"],
        "all_signatures_verified": True, "signature_fields": 1,
        "before": res["before"], "after": res["after"],
        "metadata": {"logs": res["logs"], "events": res["events"],
                     "inner_instructions": []},
        "loaded_programs": {"pAMM": {"sha256": IMAGE_SHA[image]}},
        "error": res["observed"]["error"], "observed": res["observed"],
    })
    print(f"  claim-cashback-disabled[{image}] observed={res['observed']}", flush=True)
    row[image] = {"steps": [res["observed"]]}
assert len(seen) == 1, ("claim-cashback-disabled", "images must agree", seen)
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
    "evidence/dependencies/spl_token/deployed.so",
    "evidence/dependencies/spl_token_2022/deployed.so",
    "evidence/upstream/pump_amm.json",
    "research/imported-lab/analysis/pump_fun/config-snapshot.json",
    "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json",
    "programs/pump-amm/src/lib.rs",
    "programs/pump-amm/src/instructions/create_pool.rs",
    "programs/pump-amm/src/cashback.rs",
    "scripts/pump_amm_admin_differential.py",
    "scripts/pump_amm_create_differential.py",
    "scripts/pump_amm_cashback_differential.py",
    "scripts/pump_amm_liquidity_differential.py",
]
report = {"schema": 1, "packet": "amm-admin-mode-toggles-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("toggle_mayhem_mode / toggle_boost / "
                    "toggle_cashback_enabled as state transitions, plus "
                    "their downstream create_pool gates and the "
                    "claim_cashback flag-independence case, on synthetic "
                    "fixtures, fresh VM per case per image (original / "
                    "#424 control / #427 candidate). Receipts are stored "
                    "as parts to stay under GitHub's 25MB web-upload "
                    "limit; verify.py reads them in order."),
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
