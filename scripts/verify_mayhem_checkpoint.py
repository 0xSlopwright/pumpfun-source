#!/usr/bin/env python3
"""Verify the exact maintained Mayhem source, hosted builds and signed corpus."""
import argparse
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PACKET = 'research/mayhem-canonical-promotion-20261028'


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def module(name, path):
    spec = importlib.util.spec_from_file_location(name,path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


def verify(root=ROOT):
    root = Path(root).resolve()
    selected = json.loads((root/'repro/status.json').read_text())['mayhem']
    packet = root/PACKET
    require(sha(packet/'manifest.json') == selected['checkpoint_manifest_sha256'] == '352ff61d70e81bdb009bf23ca8effe14cd7789d86f13ea214ddbd381f802239e', 'Mayhem current packet seal')
    require(sha(packet/'selection.json') == selected['source_identity_report_sha256'] == '40878ee84e8d26d67f630979a9c3b7a8d023d1e3da397ac57eabbfcb6daaa29a', 'Mayhem selected source identity')
    report = module('current_mayhem_source',packet/'verify.py').verify(root)
    signatures = module('current_mayhem_signatures',packet/'verify_signatures.py').verify(packet)
    require(selected['candidate_artifact'] == PACKET+'/hosted/40770208958/candidate.so' and selected['candidate_symbols_artifact'] == PACKET+'/hosted/40770208958/symbols.so', 'Mayhem selected image paths')
    require(report['candidate_sha256'] == selected['candidate_sha256'] == sha(root/selected['candidate_artifact']), 'Mayhem literal selected image')
    require(report['symbols_sha256'] == selected['symbols_sha256'] == sha(root/selected['candidate_symbols_artifact']), 'Mayhem literal selected symbols')
    require(report['verified_source_is_canonical'] is True and report['fresh_windows_builds'] == 2 and report['meaningful_elf_bytes'] == 775416, 'Mayhem maintained exact build scope')
    require(selected['full_byte_equality'] is True and selected['validated_cases'] == 9592 and selected['validated_instruction_comparisons'] == 9595, 'Mayhem finite runtime scope')
    require(signatures['transactions'] == 20056 and signatures['signature_fields'] == selected['verified_transaction_signatures'] == 39062, 'Mayhem retained signature scope')
    log = selected['build_log_archive']
    with zipfile.ZipFile(root/log['path']) as archive:
        actual_log = archive.read(log['member'])
    require(hashlib.sha256(actual_log).hexdigest() == log['uncompressed_sha256'] and gzip.decompress((root/selected['build_log']).read_bytes()) == actual_log, 'Mayhem actual compiler log binding')
    return {'status':'PASS','program':'mayhem','candidate_sha256':report['candidate_sha256'],
            'symbols_sha256':report['symbols_sha256'],'current_source_verified':True,
            'meaningful_elf_equal':True,'source_and_build':report,'signature_verification':signatures}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,default=ROOT)
    args = parser.parse_args()
    print(json.dumps(verify(args.repo),indent=2))
