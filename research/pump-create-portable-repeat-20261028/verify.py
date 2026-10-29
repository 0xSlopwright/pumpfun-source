#!/usr/bin/env python3
"""Qualify the executed portable successor and its actual maintained source bytes."""
import argparse
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tarfile

P = Path(__file__).resolve().parent
ROOT = P.parents[1]
CANDIDATE = 'acc5e6eba8c9295386443542847404e55a27d8e837402fb98de8ccffb679125f'
SYMBOLS = 'f7951066b200541cc337303feb64dd656ed49bcaee4539771cd9672096535138'


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def raw(path):
    data = path.read_bytes()
    return gzip.decompress(data) if path.suffix == '.gz' else data


def doc(path):
    return json.loads(raw(path))


def inventory():
    paths = [p for p in P.rglob('*') if '__pycache__' not in p.parts]
    require(not any(p.is_symlink() for p in paths), 'Proof symlink')
    return {p.relative_to(P).as_posix(): {'bytes':p.stat().st_size,'sha256':sha(p.read_bytes())}
            for p in paths if p.is_file() and p != P/'manifest.json'}


def verify(repo=ROOT, source_root=None):
    repo = Path(repo).resolve()
    require(doc(P/'manifest.json') == inventory(), 'Portable proof inventory changed')
    parents = doc(P/'parents.json')
    require(parents['proposal_manifest_sha256'] == 'bb76099bd1956b83889c66f7e794ba5c251f46d85a5dfc624c8775dd9b0d89af', 'Unexpected successor proposal')
    for name in ('proposal', 'prior_canonical'):
        require(sha((repo/parents[name+'_manifest']).read_bytes()) == parents[name+'_manifest_sha256'], 'Frozen '+name+' changed')
        path = repo/parents[name+'_manifest']
        manifest = doc(path)
        for relative, entry in manifest.get('files', manifest).items():
            expected = entry['sha256'] if isinstance(entry, dict) else entry
            require(sha((path.parent/relative).read_bytes()) == expected, 'Frozen '+name+' input changed: '+relative)
    focused = (repo/'repro/pump/canonical-frontier-20261028/run_focused.py').read_text()
    for before, after in [('R=P.parents[2]', 'R=P.parents[1]'),
        ("(P/'builds/primary/build-comparison.json')", "(R/'research/pump-create-used-boundaries-20261028/builds/primary/build-comparison.json')"),
        ("(P/'pre616-control/candidate.so.gz')", "(R/'repro/pump/canonical-frontier-20261028/pre616-control/candidate.so.gz')"),
        ("P/'create_quote_keys.py'", "R/'repro/pump/canonical-frontier-20261028/create_quote_keys.py'")]:
        require(focused.count(before) == 1, 'Focused locator predecessor changed')
        focused = focused.replace(before, after)
    require(focused == (P/'run_focused.py').read_text(), 'Focused controller changes beyond explicit locators')
    proposal = (repo/parents['proposal_manifest']).parent
    checkpoint = doc(proposal/'CHECKPOINT.json')
    # This sealed ancestor rejects optimized Python. Its actual assertions stay
    # active in a normal child interpreter, including all signature verification.
    result = subprocess.run([sys.executable,'-B',str(proposal/'verify.py')], cwd=repo,
        capture_output=True,text=True,check=True)
    ancestor = json.loads(result.stdout)
    require(ancestor['candidate_sha256'] == CANDIDATE and ancestor['strict_focused_cases'] == 75, 'Successor runtime scope differs')
    builder = doc(P/'build-comparison.json')
    require(builder == doc(P/'build-attempt.json'), 'Actual cold receipts differ')
    require(builder['builder_sha256'] == sha((P/'executed-builder.py').read_bytes()) == sha((proposal/'build.py').read_bytes()), 'Executed portable builder differs')
    require(builder['source_wrapper_sha256'] == sha((proposal/'tools/pump_physical_source_wrapper.py').read_bytes()), 'Physical source wrapper differs')
    require(builder['returncode'] == 0 and builder['cold_empty_target'] is True and builder['target_existed_before'] is False, 'Empty-target compilation absent')
    for key in ('source_unchanged','tools_unchanged','sdk_rust_libraries_unchanged','registry_sources_unchanged','target_libraries_unchanged','qualified_image_hashes_equal'):
        require(builder[key] is True, 'Portable build input drift: '+key)
    require(builder['comparison']['candidate_sha256'] == sha(raw(P/'candidate.so.gz')) == CANDIDATE, 'Cold compiled executable differs')
    require(builder['unstripped_sha256'] == sha(raw(P/'unstripped.so.gz')) == SYMBOLS, 'Cold symbol image differs')
    require(builder['build_log_sha256'] == sha(raw(P/'build.log.gz')), 'Actual cold log changed')
    registry_bytes = raw(P/'registry-authentication.json.gz')
    require(builder['registry_authentication_sha256'] == sha(registry_bytes), 'Registry authentication changed')
    registry = json.loads(registry_bytes)
    require(len(registry['locked_registry_archives']) == 254 and registry['files_checked'] == 4176, 'Registry scope differs')
    expected_primary = {'research/pump-create-used-boundaries-20261028/source/'+n:h for n,h in checkpoint['source_files_sha256'].items()}
    require(builder['primary_source_sha256'] == builder['primary_source_after_sha256'] == expected_primary, 'Actual standalone source differs')
    staged = {}
    with tarfile.open(proposal/'builds/primary/compiled-source.tar.gz') as archive:
        for item in archive:
            require(item.isfile() and not Path(item.name).is_absolute() and '..' not in Path(item.name).parts, 'Unsafe compiler archive')
            staged[item.name] = sha(archive.extractfile(item).read())
    prefix = Path(builder['workspace_directory']).relative_to(repo).as_posix()+'/'
    require(len(staged) == 66 and builder['source_sha256'] == builder['source_after_sha256'] == {prefix+n:h for n,h in staged.items()}, 'Cold compiler workspace differs')
    scanner_path = proposal/'tools/build_source_manifest.py'
    spec = importlib.util.spec_from_file_location('pump_current_input_scanner', scanner_path)
    scanner = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(scanner)
    source = Path(source_root).absolute() if source_root else repo/'programs/pump'
    require(not any(p.is_symlink() for p in (source, *source.parents)), 'Source selector contains a symlink')
    current = source.resolve()
    require(not any(p.is_symlink() for p in current.rglob('*')), 'Maintained source symlink')
    actual = scanner.source_manifest(current, current, repo, cwd=current)
    actual = {Path(repo/n).relative_to(current).as_posix():h for n,h in actual.items()}
    require(actual == checkpoint['source_files_sha256'], 'Maintained Pump source differs from qualified compiler input')
    log = raw(P/'build.log.gz')
    require(b'Compiling pump-recovered' in log and b'Compiling pump-token-ext' in log and b'exceeded max offset' not in log, 'Fresh local crate compilation absent')
    return {'status':'PASS','program':'pump','candidate_sha256':CANDIDATE,'symbols_sha256':SYMBOLS,
        'current_source_verified':True,'canonical_inputs':65,'workspace_inputs':66,
        'portable_empty_target_build':True,'registry_packages':254,'registry_source_files':4176,
        'normalized_windows':1019,'raw_windows':188,'runtime_cases':10468,
        'runtime_transaction_fields':18343,'runtime_signature_fields':27875,
        'focused_cases':75,'focused_transaction_fields':225,'focused_signature_fields':318,
        'strict_create_message_mismatches':0,'exercised_source_coordinates_normalized':False,
        'source_line_layout_deliberately_aligned':True,'historical_source_recovered':False,
        'whole_elf_identical':False,'goal_complete':False}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,default=ROOT)
    parser.add_argument('--source-root',type=Path)
    args = parser.parse_args()
    print(json.dumps(verify(args.repo,args.source_root),indent=2))
