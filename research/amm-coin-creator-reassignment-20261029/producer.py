#!/usr/bin/env python3
"""Build research/amm-coin-creator-reassignment-20261029 receipts.

Coin-creator reassignment, the one instruction family the first 50-packet
run and 2nd-run packets #1-#8 never touched (2nd #1 covered extend_account,
#2 claim_cashback, #3 admin_update_token_incentives, #4
claim_token_incentives, #5 multi-hop 3-hop, #6 buyback Token-2022 tf, #7
trade dual tf, #8 v2 fee-table priority). Pinned at runtime with
set_coin_creator and migrate_pool_coin_creator on the admin/liquidity
fixture pool (whose creator already equals the pool-authority PDA, so the
canonical-pool gate passes without mutation):

set_coin_creator:
- creators [0x11, 0x22] sets coin_creator to the FIRST creator (0x11),
  not the last, and emits one event; creators None falls back to the
  bonding-curve creator (0x33), also with one event; a metadata account
  without the trailing collection_details field still deserializes
  (trailing optional fields are leniently ignored);
- a pool whose coin_creator is already set succeeds as a no-op: state
  unchanged, zero events, log "Pool has coin_creator already set";
- a noncanonical pool creator fails 6028 OnlyCanonicalPumpPoolsCanHave
  CoinCreator (deployed log site set_coin_creator.rs:63);
- wrong metadata / bonding-curve PDA keys fail 2006 ConstraintSeeds;
  wrong owners fail 3007 AccountOwnedByWrongProgram; a read-only pool
  fails 2000 ConstraintMut; a flipped pool discriminator fails
  InvalidAccountData (17179869184);
- the metadata key byte must be exactly 4 (MetadataV1): 0, 1, 2 and 9
  all fail BorshIoError DataTypeMismatch (64424509440) on metadata,
  and an empty metadata account fails the same way;
- creators Some([]) does not error cleanly: creators[0] panics and the
  transaction fails ProgramFailedToComplete with no error site line;
- trailing instruction data after the discriminator is ignored
  (success, same state and event);
- account-deserialization checks run before the handler: a
  noncanonical pool combined with a wrong metadata PDA fails 2006,
  not 6028;
- a pool truncated to 100 bytes, and an empty pool, both fail
  InvalidAccountData (17179869184), not 3003/3001 -- the Pool
  deserializer reports any short data as InvalidAccountData, while
  SharingConfig's reports truncated data as 3003 and empty data as
  3001.

migrate_pool_coin_creator (SharingConfig layout from the pump_fees IDL:
discriminator, bump, version, status, mint @11..43, admin @43..75,
admin_revoked @75, shareholders vec @76):
- success sets pool.coin_creator to the sharing-config PDA key itself
  (1XVkGUKWHkGEnvhwiHMtTgwjs1RkdjahTMnSwrqop5D) with one event;
  a Paused status, admin_revoked=1, and a non-empty shareholders list
  are all ignored (success unchanged) -- the handler reads only mint
  and admin;
- a holder-reward pool fails 6074 HolderRewardCreatorImmutable
  (migrate_pool_coin_creator.rs:52); unswept creator_fees fail 6081
  CreatorFeesNotSwept (:59);
- sharing mint != pool base fails 6045 InvalidSharingConfigBaseMint;
  sharing admin != pool coin_creator fails 6046
  InvalidSharingConfigCoinCreator; wrong PDA key fails 2006; wrong
  owner fails 3007; read-only pool fails 2000; flipped pool
  discriminator fails InvalidAccountData;
- a discriminator-only sharing config fails 3003; an empty one fails
  3001;
- constraint checks run before the handler: bad mint combined with a
  holder-reward pool fails 6045, not 6074.

Not covered: admin_cto_pool. It takes the pool-authority PDA as a
Signer account, so no directly signed transaction can pass LiteSVM
signature verification (every direct call fails SignatureFailure before
the program runs; the PDA signature is only producible by a Pump CPI).
It is therefore not packetizable under the signed-receipt standard and
is recorded here as a negative result, not a case.

All three images (original / #424 control / #427 candidate) agree on
every case: this packet pins behavior, it does not claim a divergence.
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

from pump_amm_admin_differential import PAYER, OUTSIDER, IDL
from pump_amm_liquidity_differential import pool as POOLKEY, poolraw, base as BASE
from pump_amm_reusable_harness import acquire_harness

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-coin-creator-reassignment-20261029"
WS = Path.home() / "workspace/slop-verify"

IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {
    "original": "6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7",
    "control": "7a300434dced61413bde10788594b427d5649563e0223efcf09e6b214aff7ad3",
    "candidate": "d17a657baf5cc19736a924c41e75424604411ddbe9f6e72cddf41ab72a695007",
}

PROGRAM = Pubkey.from_string('pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA')
PUMP = Pubkey.from_string('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P')
META_PROG = Pubkey.from_string('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
FEES_PROG = Pubkey.from_string('pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ')
EVENT = Pubkey.find_program_address([b'__event_authority'], PROGRAM)[0]
SET_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'set_coin_creator')['discriminator'])
MIG_DISC = bytes(next(x for x in IDL['instructions'] if x['name'] == 'migrate_pool_coin_creator')['discriminator'])
META_PDA, _ = Pubkey.find_program_address([b'metadata', bytes(META_PROG), bytes(BASE)], META_PROG)
BC_PDA, _ = Pubkey.find_program_address([b'bonding-curve', bytes(BASE)], PUMP)
SHARING_PDA, _ = Pubkey.find_program_address([b'sharing-config', bytes(BASE)], FEES_PROG)
BC_DISC = bytes([23, 183, 248, 55, 96, 216, 172, 96])
SH_DISC = bytes([216, 74, 9, 0, 56, 140, 93, 75])
CREATOR0 = bytes([0x11]) * 32
CREATOR1 = bytes([0x22]) * 32
BC_CREATOR = bytes([0x33]) * 32
FIX_CC = bytes(poolraw[211:243])
POOL_AUTH, _ = Pubkey.find_program_address([b'pool-authority', bytes(BASE)], PUMP)
assert bytes(poolraw[11:43]) == bytes(POOL_AUTH), "fixture pool must be canonical"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def s32(b):
    return struct.pack('<I', len(b)) + b


def metadata(creators, key=4, with_details=True):
    d = bytearray()
    d += bytes([key])
    d += bytes([0x44]) * 32
    d += bytes(BASE)
    d += s32(b'TEST') + s32(b'TST') + s32(b'https://example.invalid/x.json')
    d += struct.pack('<H', 500)
    if creators is None:
        d += bytes([0])
    else:
        d += bytes([1]) + struct.pack('<I', len(creators))
        for c in creators:
            d += bytes(c) + bytes([1, 100])
    d += bytes([0])  # collection None (inside data)
    d += bytes([0])  # uses None (inside data)
    d += bytes([1, 1])  # primary_sale_happened, is_mutable
    d += bytes([0])  # edition_nonce None
    d += bytes([0])  # token_standard None
    if with_details:
        d += bytes([0])  # collection_details None
    return bytes(d)


def bonding_curve(creator=BC_CREATOR):
    d = bytearray(BC_DISC)
    d += struct.pack('<QQQQQ', 10**9, 10**9, 10**9, 10**9, 10**12)
    d += bytes([0])
    d += bytes(creator)
    d += bytes([0, 0])  # is_mayhem_mode, is_cashback_coin
    return bytes(d)


def sharing(admin, mint, status=1, revoked=0, holders=b''):
    d = bytearray(80 + len(holders))
    d[0:8] = SH_DISC
    d[8] = 0
    d[9] = 0
    d[10] = status
    d[11:43] = bytes(mint)
    d[43:75] = bytes(admin)
    d[75] = revoked
    d[76:80] = struct.pack('<I', len(holders) // 34)
    if holders:
        d[80:] = bytes(holders)
    return bytes(d)


def setb(off, val):
    def f(d):
        d[off] = val
    return f


def setq(off, val):
    def f(d):
        struct.pack_into('<Q', d, off, val)
    return f


def setbytes(off, b):
    def f(d):
        d[off:off + len(b)] = b
    return f


def combine(*fs):
    def f(d):
        for g in fs:
            g(d)
    return f


ZERO_CC = setbytes(211, bytes(32))
# CASES: (instruction, label, pool_mut, meta, meta_key, meta_owner,
#          bc, bc_key, bc_owner, sh, sh_key, sh_owner, pool_writable,
#          pool_len, extra, expected)
# expected: ("ok", coin_creator_bytes, event_count)
#        or ("error", err_substr, log_fragment, site_substr_or_None)
CASES = [
    ("set", "set-metaplex-first", ZERO_CC, metadata([CREATOR0, CREATOR1]), None, None, None, None, None, None, None, None, True, None, b'', ("ok", CREATOR0, 1)),
    ("set", "set-bonding", ZERO_CC, metadata(None), None, None, None, None, None, None, None, None, True, None, b'', ("ok", BC_CREATOR, 1)),
    ("set", "set-bonding-short", ZERO_CC, metadata(None, with_details=False), None, None, None, None, None, None, None, None, True, None, b'', ("ok", BC_CREATOR, 1)),
    ("set", "set-already-set", None, metadata([CREATOR0]), None, None, None, None, None, None, None, None, True, None, b'', ("ok", FIX_CC, 0)),
    ("set", "set-noncanonical", combine(ZERO_CC, setbytes(11, bytes([0x44]) * 32)), metadata([CREATOR0]), None, None, None, None, None, None, None, None, True, None, b'', ("error", "6028", "OnlyCanonicalPumpPoolsCanHaveCoinCreator", "set_coin_creator.rs")),
    ("set", "set-meta-wrong-pda", ZERO_CC, metadata([CREATOR0]), Pubkey.from_bytes(bytes([0x66]) * 32), None, None, None, None, None, None, None, True, None, b'', ("error", "2006", "ConstraintSeeds", "metadata")),
    ("set", "set-meta-wrong-owner", ZERO_CC, metadata([CREATOR0]), None, Pubkey.default(), None, None, None, None, None, None, True, None, b'', ("error", "3007", "AccountOwnedByWrongProgram", "metadata")),
    ("set", "set-bc-wrong-pda", ZERO_CC, metadata([CREATOR0]), None, None, None, Pubkey.from_bytes(bytes([0x77]) * 32), None, None, None, None, True, None, b'', ("error", "2006", "ConstraintSeeds", "bonding_curve")),
    ("set", "set-bc-wrong-owner", ZERO_CC, metadata([CREATOR0]), None, None, None, None, Pubkey.default(), None, None, None, True, None, b'', ("error", "3007", "AccountOwnedByWrongProgram", "bonding_curve")),
    ("set", "set-meta-empty", ZERO_CC, b'', None, None, None, None, None, None, None, None, True, None, b'', ("error", "BorshIoError", 'BorshIoError("DataTypeMismatch")', "metadata")),
    ("set", "set-meta-key0", ZERO_CC, metadata([CREATOR0], key=0), None, None, None, None, None, None, None, None, True, None, b'', ("error", "BorshIoError", 'BorshIoError("DataTypeMismatch")', "metadata")),
    ("set", "set-meta-key1", ZERO_CC, metadata([CREATOR0], key=1), None, None, None, None, None, None, None, None, True, None, b'', ("error", "BorshIoError", 'BorshIoError("DataTypeMismatch")', "metadata")),
    ("set", "set-meta-key2", ZERO_CC, metadata([CREATOR0], key=2), None, None, None, None, None, None, None, None, True, None, b'', ("error", "BorshIoError", 'BorshIoError("DataTypeMismatch")', "metadata")),
    ("set", "set-meta-key9", ZERO_CC, metadata([CREATOR0], key=9), None, None, None, None, None, None, None, None, True, None, b'', ("error", "BorshIoError", 'BorshIoError("DataTypeMismatch")', "metadata")),
    ("set", "set-creators-empty", ZERO_CC, metadata([]), None, None, None, None, None, None, None, None, True, None, b'', ("error", "ProgramFailedToComplete", "", None)),
    ("set", "set-pool-readonly", ZERO_CC, metadata([CREATOR0]), None, None, None, None, None, None, None, None, False, None, b'', ("error", "2000", "ConstraintMut", "pool")),
    ("set", "set-pool-disc-flip", combine(ZERO_CC, lambda d: d.__setitem__(0, d[0] ^ 1)), metadata([CREATOR0]), None, None, None, None, None, None, None, None, True, None, b'', ("error", "InvalidAccountData", "Error Number: 17179869184", "pool")),
    ("set", "set-trailing", ZERO_CC, metadata([CREATOR0]), None, None, None, None, None, None, None, None, True, None, b'extra', ("ok", CREATOR0, 1)),
    ("set", "set-noncanonical-meta-wrong-pda", combine(ZERO_CC, setbytes(11, bytes([0x44]) * 32)), metadata([CREATOR0]), Pubkey.from_bytes(bytes([0x66]) * 32), None, None, None, None, None, None, None, True, None, b'', ("error", "2006", "ConstraintSeeds", "metadata")),
    ("set", "set-pool-truncated", ZERO_CC, metadata([CREATOR0]), None, None, None, None, None, None, None, None, True, 100, b'', ("error", "InvalidAccountData", "Error Number: 17179869184", "pool")),
    ("set", "set-pool-empty", ZERO_CC, metadata([CREATOR0]), None, None, None, None, None, None, None, None, True, 0, b'', ("error", "InvalidAccountData", "Error Number: 17179869184", "pool")),
    ("mig", "mig-ok", None, None, None, None, None, None, None, sharing(FIX_CC, bytes(BASE)), None, None, True, None, b'', ("ok", bytes(SHARING_PDA), 1)),
    ("mig", "mig-ok-paused", None, None, None, None, None, None, None, sharing(FIX_CC, bytes(BASE), status=0), None, None, True, None, b'', ("ok", bytes(SHARING_PDA), 1)),
    ("mig", "mig-ok-revoked", None, None, None, None, None, None, None, sharing(FIX_CC, bytes(BASE), revoked=1), None, None, True, None, b'', ("ok", bytes(SHARING_PDA), 1)),
    ("mig", "mig-ok-holders", None, None, None, None, None, None, None, sharing(FIX_CC, bytes(BASE), holders=bytes([0x99]) * 32 + struct.pack('<H', 5000)), None, None, True, None, b'', ("ok", bytes(SHARING_PDA), 1)),
    ("mig", "mig-holder", setb(270, 1), None, None, None, None, None, None, sharing(FIX_CC, bytes(BASE)), None, None, True, None, b'', ("error", "6074", "HolderRewardCreatorImmutable", "migrate_pool_coin_creator.rs")),
    ("mig", "mig-unswept", setq(279, 123394), None, None, None, None, None, None, sharing(FIX_CC, bytes(BASE)), None, None, True, None, b'', ("error", "6081", "CreatorFeesNotSwept", "migrate_pool_coin_creator.rs")),
    ("mig", "mig-bad-mint", None, None, None, None, None, None, None, sharing(FIX_CC, bytes([0x55]) * 32), None, None, True, None, b'', ("error", "6045", "InvalidSharingConfigBaseMint", "sharing_config")),
    ("mig", "mig-bad-admin", None, None, None, None, None, None, None, sharing(bytes([0x55]) * 32, bytes(BASE)), None, None, True, None, b'', ("error", "6046", "InvalidSharingConfigCoinCreator", "sharing_config")),
    ("mig", "mig-wrong-pda", None, None, None, None, None, None, None, sharing(FIX_CC, bytes(BASE)), Pubkey.from_bytes(bytes([0x66]) * 32), None, True, None, b'', ("error", "2006", "ConstraintSeeds", "sharing_config")),
    ("mig", "mig-wrong-owner", None, None, None, None, None, None, None, sharing(FIX_CC, bytes(BASE)), None, Pubkey.default(), True, None, b'', ("error", "3007", "AccountOwnedByWrongProgram", "sharing_config")),
    ("mig", "mig-pool-readonly", None, None, None, None, None, None, None, sharing(FIX_CC, bytes(BASE)), None, None, False, None, b'', ("error", "2000", "ConstraintMut", "pool")),
    ("mig", "mig-pool-disc-flip", lambda d: d.__setitem__(0, d[0] ^ 1), None, None, None, None, None, None, sharing(FIX_CC, bytes(BASE)), None, None, True, None, b'', ("error", "InvalidAccountData", "Error Number: 17179869184", "pool")),
    ("mig", "mig-sharing-disc-only", None, None, None, None, None, None, None, bytes(SH_DISC), None, None, True, None, b'', ("error", "3003", "AccountDidNotDeserialize", "sharing_config")),
    ("mig", "mig-sharing-empty", None, None, None, None, None, None, None, b'', None, None, True, None, b'', ("error", "3001", "AccountDiscriminatorNotFound", "sharing_config")),
    ("mig", "mig-bad-mint-holder", setb(270, 1), None, None, None, None, None, None, sharing(FIX_CC, bytes([0x55]) * 32), None, None, True, None, b'', ("error", "6045", "InvalidSharingConfigBaseMint", "sharing_config")),
]


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        out[str(k)] = {"data_hex": bytes(a.data).hex() if a else "", "owner": str(a.owner) if a else "", "lamports": a.lamports if a else 0}
    return out


receipts_global = []
report_cases = []
for index, case in enumerate(CASES):
    (instruction, label, pool_mut, meta, meta_key, meta_owner, bc, bc_key, bc_owner,
     sh, sh_key, sh_owner, pool_writable, pool_len, extra, expected) = case
    disc = SET_DISC if instruction == "set" else MIG_DISC
    row = {"instruction": instruction, "label": label, "expected": list(expected) if expected[0] == "ok" else list(expected)}
    if expected[0] == "ok":
        row["expected"][1] = expected[1].hex()
    pairs = set()
    for image, path in IMAGES.items():
        h = acquire_harness(path)
        vm = h.vm
        vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
        vm.airdrop(PAYER.pubkey(), 10**12)
        vm.set_account(EVENT, Account(10**9, b'', Pubkey.default()))
        pdata = bytearray(poolraw)
        pdata[279:287] = bytes(8)  # creator_fees = 0 unless the case sets it
        if pool_mut:
            pool_mut(pdata)
        if pool_len is not None:
            pdata = pdata[:pool_len]
        vm.set_account(POOLKEY, Account(10**9, bytes(pdata), PROGRAM))
        keys = [POOLKEY, PAYER.pubkey()]
        if instruction == "set":
            vm.set_account(meta_key or META_PDA, Account(10**9, meta if meta is not None else metadata([CREATOR0]), meta_owner or META_PROG))
            vm.set_account(bc_key or BC_PDA, Account(10**9, bc if bc is not None else bonding_curve(), bc_owner or PUMP))
            metas = [AccountMeta(POOLKEY, False, pool_writable),
                     AccountMeta(meta_key or META_PDA, False, False),
                     AccountMeta(bc_key or BC_PDA, False, False),
                     AccountMeta(EVENT, False, False),
                     AccountMeta(PROGRAM, False, False)]
            keys += [meta_key or META_PDA, bc_key or BC_PDA]
        else:
            vm.set_account(sh_key or SHARING_PDA, Account(10**9, sh if sh is not None else sharing(FIX_CC, bytes(BASE)), sh_owner or FEES_PROG))
            metas = [AccountMeta(POOLKEY, False, pool_writable),
                     AccountMeta(sh_key or SHARING_PDA, False, False),
                     AccountMeta(EVENT, False, False),
                     AccountMeta(PROGRAM, False, False)]
            keys += [sh_key or SHARING_PDA]
        before = snap(vm, keys)
        tx = Transaction.new_signed_with_payer([Instruction(PROGRAM, disc + extra, metas)], PAYER.pubkey(), [PAYER], vm.latest_blockhash())
        raw = bytes(tx)
        checks = tx.verify_with_results()
        assert checks and all(checks), "new transaction must verify"
        r = vm.send_transaction(tx)
        failed = isinstance(r, FailedTransactionMetadata)
        meta_r = r.meta() if failed else r
        after = snap(vm, keys)
        err = str(r.err()) if failed else None
        logs = meta_r.logs()
        events = [l for l in logs if l.startswith('Program data: ')]
        payer_delta = before[str(PAYER.pubkey())]["lamports"] - after[str(PAYER.pubkey())]["lamports"]
        observed = {}
        if expected[0] == "ok":
            assert not failed and err is None, (label, image, err)
            pool_after = bytes.fromhex(after[str(POOLKEY)]["data_hex"])
            assert pool_after[211:243] == expected[1], (label, image, pool_after[211:243].hex(), expected[1].hex())
            assert len(events) == expected[2], (label, image, len(events), expected[2])
            assert payer_delta == 5000, (label, image, payer_delta)
            observed = {"coin_creator": expected[1].hex(), "events": expected[2]}
            pairs.add((expected[1], expected[2]))
        else:
            assert failed and err is not None and expected[1] in err, (label, image, err, expected)
            assert expected[2] in "\n".join(logs), (label, image, logs[-3:])
            site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
            row.setdefault("error_sites", {})[image] = site
            if expected[3] is not None:
                assert site is not None and expected[3] in site, (label, image, site, expected)
            else:
                assert site is None, (label, image, site)
            assert payer_delta == 5000, (label, image, payer_delta)
            assert all(before[k] == after[k] for k in before if k != str(PAYER.pubkey())), (label, image, "rollback")
            observed = {"error": expected[1]}
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image, "instruction": instruction,
                        "label": label},
            "transaction_base64": base64.b64encode(raw).decode(),
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
            "all_signatures_verified": True, "signature_fields": 1,
            "before": before, "after": after,
            "metadata": {"signature": str(meta_r.signature()), "logs": logs,
                         "inner_instructions": str(meta_r.inner_instructions()),
                         "compute_units_consumed": str(meta_r.compute_units_consumed()),
                         "return_data": str(meta_r.return_data())},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                      "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
            "loaded_programs": {
                str(PROGRAM): {"path": "evidence/original/pump_amm/deployed.so",
                               "sha256": IMAGE_SHA[image]}},
            "error": err, "rollback_except_payer_fee": failed,
            "payer_fee_lamports": payer_delta,
            "observed": observed,
        })
        row[image] = {"error": err, "logs": logs,
                      "accounts": {k: v for k, v in after.items()},
                      "observed": observed}
        print(f"  {label} [{image}] error={err} observed={observed}")
    if expected[0] == "ok":
        assert len(pairs) == 1, (label, "images must agree on state")
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
report = {
    "scope": "Fresh normally signed original/control/candidate triples pinning "
             "coin-creator reassignment: set_coin_creator first-creator "
             "selection, bonding-curve fallback, already-set no-op, "
             "canonical-pool gate, PDA/owner/mut/discriminator checks, "
             "metadata key byte 4, empty-creators panic, trailing-data "
             "tolerance, and deserialization floors; migrate_pool_coin_"
             "creator success to the sharing-config PDA key, ignored "
             "status/revoked/shareholders, holder and unswept gates, "
             "sharing mint/admin constraints, and constraint-before-"
             "handler ordering. admin_cto_pool is not packetized: its "
             "pool-authority PDA signer makes direct signed calls fail "
             "SignatureFailure before the program runs. All error cases "
             "roll back everything except the payer's 5,000 fee. All "
             "three images behave identically. Receipts are stored as "
             "parts to stay under GitHub's 25MB web-upload limit; "
             "verify.py reads them in order.",
    "fresh_vm_environment": "1",
    "image_sha256": IMAGE_SHA,
    "input_sha256": {
        "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json":
            sha((ROOT / "research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json").read_bytes()),
        "evidence/upstream/pump_amm.json":
            sha((ROOT / "evidence/upstream/pump_amm.json").read_bytes()),
        "programs/pump-amm/idls/pump.json":
            sha((ROOT / "programs/pump-amm/idls/pump.json").read_bytes()),
        "programs/pump-amm/idls/pump_fees.json":
            sha((ROOT / "programs/pump-amm/idls/pump_fees.json").read_bytes()),
    },
    "counts": {"vms": len(receipts_global), "transactions": len(receipts_global),
               "signature_fields": len(receipts_global)},
    "case_count": len(report_cases),
    "classifications": {"coin-creator-reassignment": len(report_cases)},
    "mismatches": [],
    "cases": report_cases,
    "transaction_receipts": {"parts": parts},
}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(
    json.dumps(report, indent=1).encode(), mtime=0))
print("cases:", len(report_cases), "receipts:", len(receipts_global))
print("wrote:", OUT / "runtime/report.json.gz")
