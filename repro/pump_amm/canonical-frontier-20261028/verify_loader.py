"""Verify fresh r13 loader controls; historical H19 receipts are never reused."""
from pathlib import Path
import base64
import gzip
import hashlib
import importlib.util
import json
import struct

AMM = 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
ORIGINAL = '6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
UPGRADE = 'BPFLoaderUpgradeab1e11111111111111111111111'


def verify(packet, original, candidate, signatures=False):
    packet = Path(packet)
    def require(ok, message):
        if not ok:
            raise RuntimeError(message)
    def sha(raw):
        return hashlib.sha256(raw).hexdigest()
    def raw(path):
        data = Path(path).read_bytes()
        return gzip.decompress(data) if str(path).endswith('.gz') else data
    def load(path):
        return json.loads(raw(path))
    def module(name, path):
        spec = importlib.util.spec_from_file_location(name, path)
        result = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(result)
        return result
    audit = module('loader_runtime_audit', packet/'audit_runtime.py')
    recipe = module('loader_adapter_recipe', packet/'loader_recipe.py')
    base = packet/'results/loader'
    for kind in ['allocation', 'upgradeable', 'cache']:
        require(recipe.adapt((base/'origin'/(kind+'.py')).read_text(), kind) == (base/'producers'/(kind+'.py')).read_text(), kind+' adapter has semantic edits')
    candidate_raw, original_raw = Path(candidate).read_bytes(), Path(original).read_bytes()
    c = sha(candidate_raw)
    require(sha(original_raw) == ORIGINAL, 'loader original binding')
    program = raw(base/'capture/program-account.bin.gz')
    programdata = raw(base/'capture/programdata-account.bin.gz')
    cap = load(base/'capture/capture.json')
    require(sha(program) == cap['program_sha256'] and sha(programdata) == cap['programdata_sha256'], 'captured loader accounts')
    require(len(program) == 36 and struct.unpack_from('<I', program)[0] == 2 and cap['owner'] == UPGRADE, 'captured Program layout')
    require(len(programdata) == 10485760 and struct.unpack_from('<I', programdata)[0] == 3 and programdata[45:] == original_raw, 'captured ProgramData payload')
    header = programdata[:45]
    require(struct.unpack_from('<Q', header, 4)[0] == cap['last_deploy_slot'], 'captured deploy slot')
    expected = [{'canonical': canonical, 'kind': kind, 'bps': bps, 'cap': maximum}
                for canonical in [False, True]
                for kind, bps, maximum in [('plain',0,0),('duplicate',0,0),('short',0,0)]
                + [('fee',bps,maximum) for bps in [0,1,100] for maximum in [0,1,100]]]
    total_signatures = 0
    verified_signatures = 0

    def transaction(item):
        nonlocal total_signatures, verified_signatures
        encoded = base64.b64decode(item['transaction_base64'], validate=True)
        count, start = audit.compact(encoded, 0)
        require(count > 0 and len(encoded) > start+64*count, 'loader transaction wire shape')
        require(item['all_signatures_verified'] is True and count == item['signature_count'] and sha(encoded) == item['transaction_sha256'], 'loader signed transaction binding')
        total_signatures += count
        if signatures:
            from solders.transaction import Transaction
            checks = Transaction.from_bytes(encoded).verify_with_results()
            require(len(checks) == count and all(checks), 'loader signature invalid')
            verified_signatures += count
        return encoded[start+64*count:]

    for mode, length in [('allocation-small',len(candidate_raw)), ('allocation-large',len(original_raw)), ('upgradeable',None)]:
        report = load(base/(mode+'.json.gz'))
        observed = load(base/(mode+'-transactions.json.gz'))
        kind = 'upgradeable' if length is None else 'allocation'
        require(report['candidate_sha256'] == c and report['original_sha256'] == ORIGINAL, mode+' program binding')
        require(report['producer_sha256'] == observed['script_sha256'] == sha((base/'producers'/(kind+'.py')).read_bytes()), mode+' producer binding')
        observer = base/'producers'/('observe-upgradeable.py' if length is None else 'observe-allocation.py')
        require(observed['observer_sha256'] == sha(observer.read_bytes()), mode+' observer binding')
        require(report['caller_sha256'] == sha((base/'producers/caller.so').read_bytes()), mode+' caller binding')
        require(report['case_count'] == len(report['cases']) == 24 and report['mismatch_count'] == 0, mode+' case count')
        require([row['input'] for row in report['cases']] == expected, mode+' input ledger')
        require(observed['transaction_count'] == len(observed['transactions']) == 48 and observed['signature_count'] == 48, mode+' observed transaction count')
        if length is None:
            require(observed['amm_legacy_loads_forbidden'] is True and len(observed['upgradeable_load_trace']) == 48 and len(report['upgradeable_loads']) == 48, 'upgradeable load trace')
        else:
            require(report['allocation_bytes'] == length and len(report['account_allocation_evidence']) == 48, 'allocation length')
        for i, row in enumerate(report['cases']):
            require(not row['different_fields'] and audit.clean(row['original']) == audit.clean(row['candidate']), mode+' complete observation mismatch')
            pair = observed['transactions'][2*i:2*i+2]
            require(transaction(pair[0]) == transaction(pair[1]), mode+' different signed message')
            for side, item, binary in zip(['original','candidate'], pair, [original_raw,candidate_raw]):
                observation = row[side]
                require(item['transaction_base64'] == observation['transaction_base64'] and item['error'] == observation['error'], mode+' observation binding')
                require(item['logs_sha256'] == sha(json.dumps(observation['logs'],separators=(',',':')).encode()), mode+' logs binding')
                require(item['amm_program_sha256'] == sha(binary) and item['loaded_programs'][AMM]['sha256'] == sha(binary), mode+' actual loaded code')
                index = 2*i + (side == 'candidate')
                if length is None:
                    evidence = report['upgradeable_loads'][index]
                    trace = observed['upgradeable_load_trace'][index]
                    require(item['loader_accounts_unchanged'] is True and evidence['fresh_vm_without_amm_legacy_load'] is True and trace['fresh_amm_account_absent_before_load'] is True, 'upgradeable VM/cache freshness')
                    require(evidence['file_sha256'] == evidence['payload_sha256'] == trace['sha256'] == sha(binary), 'upgradeable payload')
                    require(evidence['program_account_sha256'] == trace['program_account_sha256'] == sha(program), 'upgradeable Program account')
                    require(evidence['programdata_sha256'] == trace['programdata_sha256'] == sha(header+binary) and evidence['programdata_bytes'] == trace['programdata_bytes'] == len(header+binary), 'upgradeable ProgramData account')
                    require(evidence['owner'] == trace['owner'] == UPGRADE and evidence['loader_cache_clock_slot'] == 100, 'upgradeable loader context')
                else:
                    evidence = report['account_allocation_evidence'][index]
                    allocated = binary[:length] + bytes(max(0,length-len(binary)))
                    require(evidence['file_sha256'] == sha(binary) and evidence['input_data_bytes'] == len(binary), 'allocation input binding')
                    require(evidence['allocated_bytes'] == length and evidence['allocated_sha256'] == sha(allocated), 'allocation output binding')
                    require(evidence['truncated_suffix_all_zero'] is True and not any(binary[length:]), 'allocation truncates meaningful bytes')
                    require(evidence['executable'] is True and evidence['owner'] == 'BPFLoader2111111111111111111111111111111111', 'allocation loader context')
    cache = load(base/'cache-controls.json')
    require(cache['candidate_sha256'] == c and len(cache['negative_loads']) == 3 and all(row['rejected'] is True for row in cache['negative_loads']), 'negative ProgramData controls')
    require(cache['script_sha256'] == sha((base/'producers/cache.py').read_bytes()), 'cache producer binding')
    require(cache['programdata_write_alone_does_not_reload_cache'] is True and cache['executable_program_reinsertion_reloads_cache'] is True, 'cache selection controls')
    a,b,x,y = [cache[name] for name in ['fresh_amm_result','programdata_only_replacement_result','program_account_reloaded_result','fresh_distinct_payload_result']]
    require(a['error'] == b['error'] and a['logs'] == b['logs'] and x['error'] == y['error'] and x['logs'] == y['logs'] and a['error'] != x['error'], 'cache payload selection observations')
    for row in [a,b,x,y]:
        transaction(row)
    require(total_signatures == 148 and cache['signatures'] == 4, 'loader signature totals')
    return {'candidate_sha256': c, 'equal_allocation_control_cases':48,'equal_allocation_control_mismatches':0,
            'allocation_control_signature_fields':96,'upgradeable_policy_cases':24,'upgradeable_policy_mismatches':0,
            'upgradeable_policy_signature_fields':48,'negative_programdata_loads':3,'cache_control_signature_fields':4,
            'signature_fields':148,'cryptographically_reverified_signature_fields':verified_signatures if signatures else None,
            'deployment_lifecycle_verified':False,'broad_compute_parity_verified':False,'live_reachability_verified':False}
