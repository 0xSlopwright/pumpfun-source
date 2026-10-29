#!/usr/bin/env python3
"""Build research/amm-init-boost-20261029 receipts.

init_boost, pinned at runtime (2nd run packet #11; run 1 and 2nd #1-#10
never covered init_boost directly; #50 covered boost_buy_and_burn and
#28 covered toggle_boost / set_boost_authority, but not the boost
initialization itself):

- direct init_boost NEVER transfers and NEVER sets virtual_quote_reserves:
  the transfer path requires creator == pool-authority PDA, and a PDA
  cannot sign a direct transaction. Every direct case succeeds with
  pool, vaultbase and vaultquote data byte-identical and no event
  line, whatever the pool's virtual reserves (0, 10^9, fixture
  -125,882) or the global boost_enabled flag (0 or 1);
- what direct init_boost DOES do, unconditionally, is create the
  boost vault ATA (init_if_needed, payer=creator): a missing vault
  appears at 2,039,280 lamports with amount 0, mint=quote,
  owner=boost_vault_authority PDA, and the creator pays exactly
  2,039,280 + 5,000 fee; a pre-existing vault (empty or funded) is
  left untouched and only the 5,000 fee is charged;
- with a separate fee payer (OUTSIDER signs, creator PAYER signs),
  the rent still comes from the creator (-2,039,280) and the fee
  from the outsider (-5,000 per signature, 2 signatures = -10,000);
- account validation, all 3 images agreeing: pool base/quote/vault
  field mismatches give 6008/6009/6014/6015 (caused by account:
  pool); read-only pool gives 2000 ConstraintMut; config key
  substitution gives 2006 ConstraintSeeds (global_config); pool
  key substitution gives 2006 (boost_vault_authority, because the
  authority PDA derives from the pool key); authority or vault key
  substitution gives MissingAccount; pool truncation to 0/100 bytes
  or a flipped discriminator gives InvalidAccountData (17179869184),
  truncation to 286 bytes gives BorshIoError (failed to write whole
  buffer); a vault with the base mint gives 2014 ConstraintTokenMint
  (boost_vault); a vault with a foreign owner gives 2015
  ConstraintTokenOwner (boost_vault); a Token-2022-owned quote mint
  gives IncorrectProgramId (the vault ATA is created through the
  Token program); an unsigned creator (fee payer OUTSIDER, creator
  meta non-signer) gives 3010 AccountNotSigner (creator);
- the only reachable caller of the transfer path is the Pump
  migrate_v2 CPI, replayed here with the saved signed canonical
  migration transaction: Pump always invokes init_boost during
  migrate, and the AMM gates on boost_enabled. With
  boost_enabled=0 the migration completes, the new pool has
  virtual_quote_reserves 0, and the boost vault ATA is created at
  2,039,280 lamports with amount 0 (no quote moves). With
  boost_enabled=1 the transfer runs with amount =
  floor(bonding_curve_base * q / 10^15), where q is the pool
  quote balance the migration itself establishes (84,990,359,062
  in this fixture, read from the disabled control case's pool
  quote vault), taken from the pool quote vault into the boost
  vault, and pool virtual_quote_reserves is set to exactly that
  amount:
  baseline (base 206,900,000,000,000, quote 84,990,359,062) moves
  17,584,505,289; base 10^9 moves 84,990; base 10^12 moves
  84,990,359; base 10^15-1 moves 84,990,359,061 and leaves the
  quote vault at 1. The transfer is skipped (vault created but
  amount 0, vq 0, quote vault untouched, no InitBoostEvent) when
  amount == 0 (base 1 or 100) or amount >= quote (base 10^15
  gives exactly quote, base 10^15+1 and u64max give more). The
  base vault is never touched. A second saved migration shape
  ('missing_boost') that carries no boost remaining accounts
  fails in Pump itself with 6027 NotEnoughRemainingAccounts
  (thrown in programs/pump/src/migrate_v2.rs:658) when boost is
  enabled, and the whole migration rolls back except the fee
  payer's fee;
- all three images (original / #424 control / #427 candidate)
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

sys.path.insert(0, str(Path.home() / "workspace/pumpfun-sparse/scripts"))
from solders.account import Account
from solders.clock import Clock
from solders.instruction import AccountMeta, Instruction
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata

import pump_amm_boost_differential as B
from pump_amm_admin_differential import CONFIG_KEY, EVENT, IDL, OUTSIDER, PAYER, PROGRAM
from pump_amm_boost_differential import quote, token
from pump_amm_create_differential import Harness, create, f, meta_mutation
from pump_amm_create_differential import base

ROOT = Path.home() / "workspace/pumpfun-sparse"
OUT = ROOT / "research/amm-init-boost-20261029"
WS = Path.home() / "workspace/slop-verify"

TOKEN = Pubkey.from_string("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
TOKEN22 = Pubkey.from_string("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
ATA = Pubkey.from_string("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
OUTSIDER_B = bytes(OUTSIDER.pubkey())
IMAGES = {
    "original": ROOT / "evidence/original/pump_amm/deployed.so",
    "control": WS / "control.so",
    "candidate": WS / "candidate.so",
}
IMAGE_SHA = {k: hashlib.sha256(v.read_bytes()).hexdigest() for k, v in IMAGES.items()}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def snap(vm, keys):
    out = {}
    for k in keys:
        a = vm.get_account(k)
        if a is None or not a.executable:
            out[str(k)] = None if a is None else {
                "owner": str(a.owner), "lamports": a.lamports,
                "data_hex": bytes(a.data).hex()}
    return out


def direct_setup(image_path, fixture=False):
    r = create()
    h = Harness(image_path)
    h.vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, n in [(TOKEN, "spl_token"), (TOKEN22, "spl_token_2022"), (ATA, "associated_token")]:
        h.vm.add_program_from_file(pid, ROOT / "evidence/dependencies" / n / "deployed.so")
    for k, a in r["states"].items():
        if a:
            h.vm.set_account(Pubkey.from_string(k), Account(
                a["lamports"], bytes.fromhex(a["data"]), Pubkey.from_string(a["owner"])))
    pool = next(Pubkey.from_string(k) for k, a in r["states"].items()
                if a and a["owner"] == str(PROGRAM) and len(bytes.fromhex(a["data"])) == 287)
    if fixture:
        for row in f["accounts"].values():
            h.vm.set_account(Pubkey.from_string(row["address"]), Account(
                row["lamports"], base64.b64decode(row["data_base64"]),
                Pubkey.from_string(row["owner"])))
        pool = Pubkey.from_string(f["pool"])
    d = h.vm.get_account(pool).data
    vaultbase = Pubkey.from_bytes(d[139:171])
    vaultquote = Pubkey.from_bytes(d[171:203])
    authority = Pubkey.find_program_address([b"boost_vault", bytes(pool)], PROGRAM)[0]
    vault = Pubkey.find_program_address([bytes(authority), bytes(TOKEN), bytes(quote)], ATA)[0]
    keys = [pool, CONFIG_KEY, PAYER.pubkey(), base, quote, vaultbase, vaultquote,
            authority, vault, TOKEN, Pubkey.default(), ATA, EVENT, PROGRAM]
    ix = next(x for x in IDL["instructions"] if x["name"] == "init_boost")
    metas = [AccountMeta(k, bool(a.get("signer")), bool(a.get("writable")))
             for k, a in zip(keys, ix["accounts"])]
    return h, pool, vaultbase, vaultquote, authority, vault, metas


def run_direct(image_path, fixture=False, overrides=None, custom=None):
    h, pool, vaultbase, vaultquote, authority, vault, metas = direct_setup(image_path, fixture)
    if overrides:
        overrides(h, metas)
    if custom == "separate-payer":
        payer, signers = OUTSIDER.pubkey(), [PAYER, OUTSIDER]
    elif custom == "unsigned-creator":
        metas[2] = AccountMeta(metas[2].pubkey, False, metas[2].is_writable)
        payer, signers = OUTSIDER.pubkey(), [OUTSIDER]
    else:
        payer, signers = PAYER.pubkey(), [PAYER]
    # Snapshot the mutated meta keys AND the original role keys: a key
    # substitution (e.g. pool -> 0x59 key) moves the validated account,
    # but the original key must stay observable for the unchanged check.
    role_keys = [pool, CONFIG_KEY, PAYER.pubkey(), OUTSIDER.pubkey(),
                 base, quote, vaultbase, vaultquote, authority, vault]
    keys = list(dict.fromkeys([m.pubkey for m in metas] + role_keys))
    before = snap(h.vm, keys)
    ix = next(x for x in IDL["instructions"] if x["name"] == "init_boost")
    tx = Transaction.new_signed_with_payer(
        [Instruction(PROGRAM, bytes(ix["discriminator"]), metas)],
        payer, signers, h.vm.latest_blockhash())
    r = h.vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    after = snap(h.vm, keys)
    logs = meta.logs()
    return {"error": str(r.err()) if failed else None,
            "tx": base64.b64encode(bytes(tx)).decode(),
            "before": before, "after": after, "logs": logs,
            "events": [x for x in logs if x.startswith("Program data: ")],
            "sig_fields": len(tx.signatures),
            "roles": {"pool": str(pool), "config": str(CONFIG_KEY),
                      "creator": str(PAYER.pubkey()), "fee_payer": str(payer),
                      "outsider": str(OUTSIDER.pubkey()),
                      "vaultbase": str(vaultbase), "vaultquote": str(vaultquote),
                      "authority": str(authority), "vault": str(vault)},
            "expected_vault_data": token(quote, authority, 0, True).hex()}


def run_migration(image_path, boost_enabled, label="migration", curvebase=None):
    from pump_amm_admin_differential import LiteSVM
    p = json.load(open(ROOT / "research/imported-lab/analysis/pump_fun/curve-migrate-v2-signed-surfpool.json"))
    row = p[label]
    tx = Transaction.from_bytes(base64.b64decode(row["transaction_base64"]))
    assert all(tx.verify_with_results())
    vm = LiteSVM().with_transaction_history(0).with_blockhash_check(False).with_log_bytes_limit(None)
    vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
    for pid, path in [(PROGRAM, image_path),
                      (B.PUMP, ROOT / "evidence/original/pump/deployed.so"),
                      (TOKEN, ROOT / "evidence/dependencies/spl_token/deployed.so"),
                      (TOKEN22, ROOT / "evidence/dependencies/spl_token_2022/deployed.so"),
                      (ATA, ROOT / "evidence/dependencies/associated_token/deployed.so")]:
        vm.add_program_from_file(pid, path)
    ix = tx.message.instructions[-1]
    spec = next(x for x in json.load(open(ROOT / "evidence/upstream/pump.json"))["instructions"]
                if x["name"] == "migrate_v2")
    keys = {a["name"]: tx.message.account_keys[i] for a, i in zip(spec["accounts"], ix.accounts)}
    aliases = {"mint": "base_mint", "curve": "bonding_curve",
               "curve_base": "associated_base_bonding_curve",
               "pool_authority_mint": "pool_authority_mint_account",
               "pool_authority_quote": "pool_authority_quote_account",
               "pool_base": "pool_base_token_account",
               "pool_quote": "pool_quote_token_account",
               "user_lp": "user_pool_token_account"}
    for name, account in row["before"].items():
        key = keys.get(aliases.get(name, name))
        if name in ["boost_authority", "boost_vault"]:
            key = Pubkey.from_string(p[name])
        if key is not None and account:
            vm.set_account(key, Account(account["lamports"],
                                       base64.b64decode(account["data_base64"]),
                                       Pubkey.from_string(account["owner"])))
    q = f["accounts"]["quote_mint"]
    vm.set_account(keys["quote_mint"], Account(
        q["lamports"], base64.b64decode(q["data_base64"]), Pubkey.from_string(q["owner"])))
    cfg = vm.get_account(keys["amm_global_config"])
    d = bytearray(cfg.data)
    d[939] = boost_enabled
    vm.set_account(keys["amm_global_config"], Account(cfg.lamports, bytes(d), cfg.owner))
    if curvebase is not None:
        cb = vm.get_account(keys["associated_base_bonding_curve"])
        dd = bytearray(cb.data)
        dd[64:72] = struct.pack("<Q", curvebase)
        vm.set_account(keys["associated_base_bonding_curve"], Account(cb.lamports, bytes(dd), cb.owner))
    snap_keys = [k for k in tx.message.account_keys]
    before = snap(vm, snap_keys)
    r = vm.send_transaction(tx)
    failed = isinstance(r, FailedTransactionMetadata)
    meta = r.meta() if failed else r
    after = snap(vm, snap_keys)
    logs = meta.logs()
    return {"error": str(r.err()) if failed else None,
            "tx": base64.b64encode(bytes(tx)).decode(),
            "before": before, "after": after, "logs": logs,
            "events": [x for x in logs if x.startswith("Program data: ")],
            "sig_fields": len(tx.signatures),
            "roles": {"pool": str(keys["pool"]),
                      "fee_payer": str(tx.message.account_keys[0]),
                      "vault": str(Pubkey.from_string(p["boost_vault"])),
                      "config": str(keys["amm_global_config"]),
                      "poolquote": str(keys["pool_quote_token_account"]),
                      "poolbase": str(keys["pool_base_token_account"]),
                      "curvebase": str(keys["associated_base_bonding_curve"])}}


# (label, kind, kwargs, expected)
# expected ok-create-vault: ("ok-create-vault",)
# expected ok-vault-kept:   ("ok-vault-kept",)
# expected ok-separate:     ("ok-separate",)
# expected error:           ("error", code, fragment)
# expected ok-mig:          ("ok-mig",)
# expected error-mig:       ("error-mig", code, fragment)
def pool_mut(offset, value):
    def ov(h, m):
        a = h.vm.get_account(m[0].pubkey)
        d = bytearray(a.data)
        d[offset:offset + len(value)] = value
        h.vm.set_account(m[0].pubkey, Account(a.lamports, bytes(d), a.owner))
    return ov


def pool_vq(value):
    return pool_mut(245, int(value).to_bytes(16, "little", signed=True))


def config_mut(offset, value):
    def ov(h, m):
        a = h.vm.get_account(CONFIG_KEY)
        d = bytearray(a.data)
        d[offset] = value
        h.vm.set_account(CONFIG_KEY, Account(a.lamports, bytes(d), a.owner))
    return ov


def vault_amount_mut(amount, index=5):
    def ov(h, m):
        a = h.vm.get_account(m[index].pubkey)
        d = bytearray(a.data)
        d[64:72] = struct.pack("<Q", amount)
        h.vm.set_account(m[index].pubkey, Account(a.lamports, bytes(d), a.owner))
    return ov


def set_vault(amount=None, mint=None, owner=None):
    def ov(h, m):
        a = h.vm.get_account(m[8].pubkey)
        if a is None:
            data = bytearray(token(quote, m[7].pubkey, amount or 0, True))
            if mint is not None:
                data[0:32] = bytes(mint)
            if owner is not None:
                data[32:64] = bytes(owner)
            h.vm.set_account(m[8].pubkey, Account(2039280, bytes(data), TOKEN))
            return
        d = bytearray(a.data)
        if amount is not None:
            d[64:72] = struct.pack("<Q", amount)
        if mint is not None:
            d[0:32] = bytes(mint)
        if owner is not None:
            d[32:64] = bytes(owner)
        h.vm.set_account(m[8].pubkey, Account(a.lamports, bytes(d), a.owner))
    return ov


def pool_size(size):
    def ov(h, m):
        a = h.vm.get_account(m[0].pubkey)
        h.vm.set_account(m[0].pubkey, Account(
            a.lamports, a.data[:size] + bytes(max(0, size - len(a.data))), a.owner))
    return ov


def combine(*fns):
    def ov(h, m):
        for fn in fns:
            fn(h, m)
    return ov


def quote_token22(h, m):
    a = h.vm.get_account(m[4].pubkey)
    h.vm.set_account(m[4].pubkey, Account(a.lamports, a.data, TOKEN22))


CASES = [
    ("direct-create-baseline", "direct", dict(), ("ok-create-vault",)),
    ("direct-fixture-baseline", "direct", dict(fixture=True), ("ok-create-vault",)),
    ("direct-vq-positive", "direct", dict(overrides=pool_vq(10**9)), ("ok-create-vault",)),
    ("direct-boost-disabled", "direct", dict(overrides=config_mut(939, 0)), ("ok-create-vault",)),
    ("direct-boost-disabled-vq0", "direct",
     dict(overrides=combine(config_mut(939, 0), pool_vq(0))), ("ok-create-vault",)),
    ("direct-big-vaults", "direct",
     dict(overrides=combine(pool_vq(0), vault_amount_mut(10**12, 5),
                             vault_amount_mut(10**12, 6))), ("ok-create-vault",)),
    ("direct-vault-exists-empty", "direct", dict(overrides=set_vault(amount=0)), ("ok-vault-kept",)),
    ("direct-vault-exists-funded", "direct", dict(overrides=set_vault(amount=10**9)), ("ok-vault-kept",)),
    ("direct-vault-wrong-mint", "direct",
     dict(overrides=set_vault(amount=0, mint=base)), ("error", "2014", "ConstraintTokenMint")),
    ("direct-vault-wrong-owner", "direct",
     dict(overrides=set_vault(amount=0, owner=OUTSIDER.pubkey())), ("error", "2015", "ConstraintTokenOwner")),
    ("direct-pool-base-field", "direct",
     dict(overrides=pool_mut(43, OUTSIDER_B)), ("error", "6008", "InvalidBaseMint")),
    ("direct-pool-quote-field", "direct",
     dict(overrides=pool_mut(75, OUTSIDER_B)), ("error", "6009", "InvalidQuoteMint")),
    ("direct-pool-vaultbase-field", "direct",
     dict(overrides=pool_mut(139, OUTSIDER_B)), ("error", "6014", "InvalidPoolBaseTokenAccount")),
    ("direct-pool-vaultquote-field", "direct",
     dict(overrides=pool_mut(171, OUTSIDER_B)), ("error", "6015", "InvalidPoolQuoteTokenAccount")),
    ("direct-pool-readonly", "direct",
     dict(overrides=meta_mutation(0, "readonly")), ("error", "2000", "ConstraintMut")),
    ("direct-config-substitute", "direct",
     dict(overrides=meta_mutation(1, "substitute")), ("error", "2006", "ConstraintSeeds")),
    ("direct-pool-substitute", "direct",
     dict(overrides=meta_mutation(0, "substitute")), ("error", "2006", "ConstraintSeeds")),
    ("direct-authority-substitute", "direct",
     dict(overrides=meta_mutation(7, "substitute")), ("error", "MissingAccount", "An account required by the instruction is missing")),
    ("direct-vault-substitute", "direct",
     dict(overrides=meta_mutation(8, "substitute")), ("error", "MissingAccount", "An account required by the instruction is missing")),
    ("direct-pool-size-0", "direct",
     dict(overrides=pool_size(0)), ("error", "InvalidAccountData", "An account's data contents was invalid")),
    ("direct-pool-size-100", "direct",
     dict(overrides=pool_size(100)), ("error", "InvalidAccountData", "An account's data contents was invalid")),
    ("direct-pool-size-286", "direct",
     dict(overrides=pool_size(286)), ("error", "BorshIoError", "failed to write whole buffer")),
    ("direct-pool-disc-flip", "direct",
     dict(overrides=pool_mut(0, bytes([0xFF]))), ("error", "InvalidAccountData", "An account's data contents was invalid")),
    ("direct-quote-token22", "direct",
     dict(overrides=quote_token22), ("error", "IncorrectProgramId", "IncorrectProgramId")),
    ("direct-separate-payer", "direct", dict(custom="separate-payer"), ("ok-separate",)),
    ("direct-unsigned-creator", "direct", dict(custom="unsigned-creator"), ("error", "3010", "AccountNotSigner")),
    ("mig-boost-disabled", "migration", dict(boost_enabled=0), ("ok-mig",)),
    ("mig-enabled-baseline", "migration", dict(boost_enabled=1), ("ok-mig",)),
    ("mig-enabled-curvebase-1", "migration",
     dict(boost_enabled=1, curvebase=1), ("ok-mig",)),
    ("mig-enabled-curvebase-100", "migration",
     dict(boost_enabled=1, curvebase=100), ("ok-mig",)),
    ("mig-enabled-curvebase-1b", "migration",
     dict(boost_enabled=1, curvebase=10**9), ("ok-mig",)),
    ("mig-enabled-curvebase-1t", "migration",
     dict(boost_enabled=1, curvebase=10**12), ("ok-mig",)),
    ("mig-enabled-curvebase-1e15m1", "migration",
     dict(boost_enabled=1, curvebase=10**15 - 1), ("ok-mig",)),
    ("mig-enabled-curvebase-1e15", "migration",
     dict(boost_enabled=1, curvebase=10**15), ("ok-mig",)),
    ("mig-enabled-curvebase-u64max", "migration",
     dict(boost_enabled=1, curvebase=2**64 - 1), ("ok-mig",)),
    ("mig-missing-boost-enabled", "migration",
     dict(boost_enabled=1, label="missing_boost"),
     ("error-mig", "6027", "NotEnoughRemainingAccounts")),
]

# NOTE on direct-pool-disc-flip: pool_mut(0, ...) overwrites byte 0 with
# 0xFF outright; the create pool discriminator's first byte is not 0xFF,
# so this flips the discriminator (equivalent to the probe's XOR flip
# for this fixture).


receipts_global = []
report_cases = []
q_ref = None
for index, (label, kind, case, expected) in enumerate(CASES):
    instruction = "init_boost" if kind == "direct" else "migrate_v2"
    params = {}
    if kind == "direct":
        params = {"fixture": case.get("fixture", False), "custom": case.get("custom")}
    else:
        params = {"boost_enabled": case.get("boost_enabled"),
                  "curvebase": case.get("curvebase"),
                  "row": case.get("label", "migration")}
    row = {"case": {"instruction": instruction, "label": label,
                    "params": params, "expected": list(expected)}}
    seen = set()
    for image in ("original", "control", "candidate"):
        if kind == "direct":
            r = run_direct(IMAGES[image], **case)
        else:
            r = run_migration(IMAGES[image], **case)
        raw = base64.b64decode(r["tx"])
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        assert checks and all(checks) and len(checks) == r["sig_fields"], (label, image, checks)
        before, after = r["before"], r["after"]
        roles = r["roles"]
        fee_key = roles["fee_payer"]
        payer_delta = (after[fee_key]["lamports"] if after.get(fee_key) else 0) - \
                      (before[fee_key]["lamports"] if before.get(fee_key) else 0)
        err, logs = r["error"], r["logs"]
        if kind == "direct":
            pool_same = before[roles["pool"]] == after[roles["pool"]]
            vb_same = before[roles["vaultbase"]] == after[roles["vaultbase"]]
            vq_same = before[roles["vaultquote"]] == after[roles["vaultquote"]]
            vault_after = after[roles["vault"]]
            if expected[0] == "ok-create-vault":
                assert err is None, (label, image, err)
                assert vault_after is not None, (label, image, "vault not created")
                assert vault_after["lamports"] == 2039280, (label, image, vault_after)
                assert vault_after["data_hex"] == r["expected_vault_data"], (label, image, "vault data")
                assert payer_delta == -(2039280 + 5000 * r["sig_fields"]), (label, image, payer_delta)
                assert pool_same and vb_same and vq_same, (label, image, "pool/vaults changed")
                assert len(r["events"]) == 0, (label, image, "unexpected event")
                observed = {"vault_lamports_after": vault_after["lamports"],
                            "vault_data_hex_after": vault_after["data_hex"],
                            "payer_delta": payer_delta, "pool_data_same": pool_same,
                            "vaultbase_data_same": vb_same, "vaultquote_data_same": vq_same,
                            "event_count": 0, "sig_fields": r["sig_fields"]}
            elif expected[0] == "ok-vault-kept":
                assert err is None, (label, image, err)
                assert vault_after == before[roles["vault"]], (label, image, "vault changed")
                assert payer_delta == -5000 * r["sig_fields"], (label, image, payer_delta)
                assert pool_same and vb_same and vq_same, (label, image, "pool/vaults changed")
                assert len(r["events"]) == 0, (label, image, "unexpected event")
                observed = {"vault_lamports_after": vault_after["lamports"],
                            "vault_data_hex_after": vault_after["data_hex"],
                            "payer_delta": payer_delta, "pool_data_same": pool_same,
                            "vaultbase_data_same": vb_same, "vaultquote_data_same": vq_same,
                            "event_count": 0, "sig_fields": r["sig_fields"]}
            elif expected[0] == "ok-separate":
                assert err is None, (label, image, err)
                assert vault_after is not None, (label, image, "vault not created")
                assert vault_after["lamports"] == 2039280, (label, image, vault_after)
                assert vault_after["data_hex"] == r["expected_vault_data"], (label, image, "vault data")
                creator_key = roles["creator"]
                creator_delta = after[creator_key]["lamports"] - before[creator_key]["lamports"]
                assert creator_delta == -2039280, (label, image, creator_delta)
                assert payer_delta == -5000 * r["sig_fields"], (label, image, payer_delta)
                assert pool_same and vb_same and vq_same, (label, image, "pool/vaults changed")
                assert len(r["events"]) == 0, (label, image, "unexpected event")
                observed = {"vault_lamports_after": vault_after["lamports"],
                            "vault_data_hex_after": vault_after["data_hex"],
                            "creator_delta": creator_delta, "payer_delta": payer_delta,
                            "pool_data_same": pool_same,
                            "vaultbase_data_same": vb_same, "vaultquote_data_same": vq_same,
                            "event_count": 0, "sig_fields": r["sig_fields"]}
            else:
                _, code, fragment = expected
                assert err is not None and code in err, (label, image, err)
                assert fragment in "\n".join(logs), (label, image, logs[-3:])
                assert payer_delta == -5000 * r["sig_fields"], (label, image, payer_delta)
                assert all(before[k] == after[k] for k in before if k != fee_key), \
                    (label, image, "rollback")
                assert len(r["events"]) == 0, (label, image, "unexpected event")
                site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
                row.setdefault("error_sites", {})[image] = site
                observed = {"payer_delta": payer_delta,
                            "vault_after": None if vault_after is None else vault_after["lamports"],
                            "pool_data_same": pool_same,
                            "event_count": 0, "sig_fields": r["sig_fields"]}
        else:
            pool_after = after[roles["pool"]]
            # The missing_boost shape has no boost vault key in the
            # transaction at all, so it is absent from the snapshots.
            vault_after = after.get(roles["vault"])
            if expected[0] == "ok-mig":
                assert err is None, (label, image, err)
                assert pool_after is not None, (label, image, "pool not created")
                pd = bytes.fromhex(pool_after["data_hex"])
                vq = int.from_bytes(pd[245:261], "little", signed=True)
                assert before[roles["vault"]] is None, (label, image, "vault pre-existed")
                assert vault_after is not None, (label, image, "vault not created")
                vd = bytes.fromhex(vault_after["data_hex"])
                assert len(vd) == 165, (label, image, len(vd))
                assert vd[0:32] == pd[75:107], (label, image, "vault mint != pool quote")
                authority = Pubkey.find_program_address(
                    [b"boost_vault", bytes(Pubkey.from_string(roles["pool"]))], PROGRAM)[0]
                assert vd[32:64] == bytes(authority), (label, image, "vault owner != boost PDA")
                # The migration always moves the full bonding-curve base
                # balance into the pool base vault, independent of boost.
                # Transfer formula: the pool quote vault does not exist
                # before migrate, so the quote input q is the pool quote
                # balance the migration itself establishes, read from the
                # disabled control case (which runs first and transfers
                # nothing). amount = floor(curvebase * q / 10^15);
                # transfer iff boost_enabled and 0 < amount < q.
                bb = struct.unpack("<Q", bytes.fromhex(before[roles["curvebase"]]["data_hex"])[64:72])[0]
                if not case.get("boost_enabled"):
                    qb = None  # set below from this case's poolquote_after
                else:
                    assert q_ref is not None, (label, "disabled control must run first")
                    qb = q_ref
                pb_after = struct.unpack("<Q", bytes.fromhex(after[roles["poolbase"]]["data_hex"])[64:72])[0]
                assert pb_after == bb, (label, image, pb_after, bb)
                qa = struct.unpack("<Q", bytes.fromhex(after[roles["poolquote"]]["data_hex"])[64:72])[0]
                va = struct.unpack("<Q", vd[64:72])[0]
                if not case.get("boost_enabled"):
                    # Disabled control: defines q for the whole fixture.
                    assert vq == 0, (label, image, vq)
                    assert va == 0, (label, image, va)
                    assert vault_after["lamports"] == 2039280, (label, image, vault_after)
                    assert len(r["events"]) == 2, (label, image, "unexpected InitBoostEvent")
                    amount = 0
                    if image == "original":
                        q_ref = qa
                    observed = {"pool_vq_after": vq, "vault_lamports_after": vault_after["lamports"],
                                "vault_amount_after": va, "poolquote_after": qa,
                                "amount_formula": amount, "q_ref": qa,
                                "sig_fields": r["sig_fields"], "event_count": len(r["events"])}
                else:
                    amount = (bb * qb) // 10**15
                    if 0 < amount < qb:
                        assert vq == amount, (label, image, vq, amount)
                        assert va == amount, (label, image, va, amount)
                        assert vault_after["lamports"] == 2039280 + amount, (label, image, vault_after)
                        assert qa == qb - amount, (label, image, qa, qb, amount)
                        assert len(r["events"]) == 3, (label, image, "InitBoostEvent missing")
                    else:
                        assert vq == 0, (label, image, vq)
                        assert va == 0, (label, image, va)
                        assert vault_after["lamports"] == 2039280, (label, image, vault_after)
                        assert qa == qb, (label, image, qa, qb)
                        assert len(r["events"]) == 2, (label, image, "unexpected InitBoostEvent")
                    observed = {"pool_vq_after": vq, "vault_lamports_after": vault_after["lamports"],
                                "vault_amount_after": va, "poolquote_after": qa,
                                "amount_formula": amount, "q_ref": qb,
                                "sig_fields": r["sig_fields"], "event_count": len(r["events"])}
            else:
                _, code, fragment = expected
                assert err is not None and code in err, (label, image, err)
                assert fragment in "\n".join(logs), (label, image, logs[-3:])
                assert pool_after is None, (label, image, "pool created despite rollback")
                assert payer_delta == -5000 * r["sig_fields"], (label, image, payer_delta)
                assert all(before[k] == after[k] for k in before if k != fee_key), \
                    (label, image, "rollback")
                site = next((l for l in logs if "thrown in" in l or "caused by account" in l), None)
                row.setdefault("error_sites", {})[image] = site
                observed = {"payer_delta": payer_delta, "pool_after": None,
                            "sig_fields": r["sig_fields"], "event_count": len(r["events"])}
        seen.add((err, tuple(sorted((k, str(v)) for k, v in observed.items()))))
        receipts_global.append({
            "sequence": len(receipts_global), "vm": len(receipts_global),
            "context": {"index": index, "image": image,
                        "instruction": instruction, "label": label},
            "transaction_base64": r["tx"],
            "signatures": [str(s) for s in tx.signatures],
            "transaction_sha256": sha(raw),
            "all_signatures_verified": True, "signature_fields": r["sig_fields"],
            "before": before, "after": after,
            "metadata": {"signature": str(tx.signatures[0]), "logs": logs,
                         "events": r["events"]},
            "clock": {"slot": 100, "epoch_start_timestamp": 1234567890, "epoch": 0,
                      "leader_schedule_epoch": 0, "unix_timestamp": 1234567890},
            "loaded_programs": {
                "pAMM": {"path": "evidence/original/pump_amm/deployed.so",
                         "sha256": IMAGE_SHA[image]}},
            "error": err, "rollback_except_payer_fee": err is not None,
            "payer_delta_lamports": payer_delta,
            "observed": observed,
            "roles": roles,
        })
        row[image] = {"error": err, "logs": logs, "observed": observed}
        print(f"  {label} [{image}] error={err} observed={observed}")
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
    "evidence/original/pump/deployed.so",
    "scripts/pump_amm_boost_differential.py",
    "scripts/pump_amm_create_differential.py",
    "scripts/pump_amm_admin_differential.py",
    "scripts/pump_amm_liquidity_differential.py",
    "evidence/upstream/pump_amm.json",
    "evidence/upstream/pump.json",
    "research/imported-lab/analysis/pump_fun/curve-migrate-v2-signed-surfpool.json",
]
report = {"schema": 1, "packet": "amm-init-boost-20261029",
          "case_count": len(report_cases), "mismatches": [],
          "scope": ("init_boost direct calls on synthetic fixtures plus the saved "
                    "signed Pump migrate_v2 CPI path, fresh VM per case per image "
                    "(original / #424 control / #427 candidate). Receipts are "
                    "stored as parts to stay under GitHub's 25MB web-upload "
                    "limit; verify.py reads them in order. Snapshots cover "
                    "non-executable accounts only. No token program is involved "
                    "in direct cases except the ATA creation CPI; migration "
                    "cases replay the full saved transaction."),
          "image_sha256": IMAGE_SHA,
          "cases": report_cases,
          "counts": {"vms": len(receipts_global),
                     "transactions": len(receipts_global),
                     "signature_fields": sum(r["signature_fields"] for r in receipts_global)},
          "input_sha256": {n: sha((ROOT / n).read_bytes()) for n in repo_inputs},
          "transaction_receipts": {"parts": parts}}
(OUT / "runtime/report.json.gz").write_bytes(gzip.compress(json.dumps(report, indent=1).encode(), mtime=0))
print(f"cases: {len(report_cases)} receipts: {len(receipts_global)}")
print(f"wrote: {OUT / 'runtime/report.json.gz'}")
