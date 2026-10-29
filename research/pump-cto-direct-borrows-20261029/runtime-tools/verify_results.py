#!/usr/bin/env python3
"""Strict fresh CTO18 verification; preserves Source and all non-CU log order."""
import base64
import collections
import gzip
import hashlib
import json
from pathlib import Path
import re

from solders.pubkey import Pubkey
from solders.transaction import VersionedTransaction

P = Path(__file__).resolve().parent
CU = re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
PID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'


def require(ok, why):
    if not ok:
        raise ValueError(why)


def read(path):
    data = Path(path).read_bytes()
    return json.loads(gzip.decompress(data) if data.startswith(b'\x1f\x8b') else data)


def ordered(result):
    return [line for line in result['logs'] if not CU.fullmatch(line)]


def verify(report, loader, control_sha, candidate_sha, reference=False, repo=None):
    manifest = read(P / 'INPUTS.json')
    cases = read(P / 'cases.json')
    require(report['case_count'] == len(report['cases']) == len(cases) == 18, 'exact18 case count')
    require([row['case'] for row in report['cases']] == cases, 'unchanged case definitions/order')
    require(not report['candidate_mismatches'], 'candidate mismatches retained')
    require(len(report['baseline_mismatches']) == (8 if reference else 0), 'control mismatch count')
    require(report['producer_sha256'] == manifest['files']['research/pump-migration-completion-20261028/probe_admin_wallet_coin_guard.py']['sha256'], 'producer binding')
    require(candidate_sha in report['inputs'].values() and control_sha in report['inputs'].values(), 'image input binding')
    repo = Path(repo) if repo is not None else P/'repo'
    idl = read(repo / 'evidence/upstream/pump.json')
    ix = next(row for row in idl['instructions'] if row['name'] == 'admin_cto')
    roles = {row['name']: index for index, row in enumerate(ix['accounts'])}
    tx_count = signature_count = 0
    for row in report['cases']:
        original = row['original']
        for label in ['original', 'baseline', 'candidate']:
            result = row[label]
            if label == 'candidate' or (label == 'baseline' and not reference):
                for key in ['error', 'before', 'after', 'events', 'inner', 'return']:
                    require(original[key] == result[key], row['case']['name'] + ':' + label + ':' + key)
                require(ordered(original) == ordered(result), row['case']['name'] + ':' + label + ':ordered non-CU logs')
            require(result['transaction_base64'] == original['transaction_base64'], 'identical signed transaction inputs')
            raw = base64.b64decode(result['transaction_base64'], validate=True)
            tx = VersionedTransaction.from_bytes(raw)
            checks = tx.verify_with_results()
            require(bytes(tx) == raw and checks and all(checks) and result['signatures_verified'], 'actual signatures')
            message = tx.message
            required = message.header.num_required_signatures
            require(required == len(tx.signatures) == 2, 'payer + genuine admin signers')
            pump = [item for item in message.instructions if str(message.account_keys[item.program_id_index]) == PID]
            require(len(pump) == 1 and len(pump[0].accounts) == len(ix['accounts']), 'one actual CTO outer instruction')
            instruction = pump[0]
            require(bytes(instruction.data[:8]) == bytes(ix['discriminator']), 'actual CTO discriminator')
            account = lambda name: message.account_keys[instruction.accounts[roles[name]]]
            mint = account('mint')
            pool_authority = Pubkey.find_program_address([b'pool-authority', bytes(mint)], Pubkey.from_string(PID))[0]
            require(account('pool_authority') == pool_authority, 'actual pool-authority PDA')
            require(pool_authority not in message.account_keys[:required] and not result['pool_authority_top_level_signer'], 'pool authority must not be an outer signer')
            require(account('admin_set_creator_authority') in message.account_keys[:required], 'genuine admin outer signature')
            tx_count += 1
            signature_count += len(tx.signatures)
    require((tx_count, signature_count) == (54, 108), 'exact transaction/signature counts')
    if loader is not None:
        original_sha = manifest['files']['evidence/original/pump/deployed.so']['sha256']
        want = collections.Counter({original_sha: 18})
        want.update({control_sha: 18})
        want.update({candidate_sha: 18})
        require(collections.Counter(row['elf_sha256'] for row in loader['loads']) == want, 'actual captured loads for all54 executions')
        capture = read(repo / 'evidence/original/pump/capture.json')
        header = (repo / 'evidence/original/pump/programdata-account.bin').read_bytes()[:45]
        header_sha = hashlib.sha256(header).hexdigest()
        for row in loader['loads']:
            require(row['elf_prefix_unchanged'] and row['zero_allocation_tail'], 'actual ELF unchanged in captured allocation')
            require(row['program_bytes'] == 36 and row['programdata_bytes'] == capture['programdata_bytes'], 'captured loader lengths')
            require(row['header_sha256'] == header_sha and row['program_owner'] == capture['owner'] and row['program_sha256'] == capture['program_sha256'], 'captured loader authority/layout')
    return {'cases': 18, 'actual_signed_executions': tx_count, 'signature_fields_verified': signature_count,
            'candidate_sha256': candidate_sha, 'control_sha256': control_sha,
            'strict_comparison': 'all structured fields and full ordered logs except exact CU consumption lines',
            'Source_substitutions': None, 'privileged_outer_PDA_signer': False,
            'historical_reference_only': reference}
