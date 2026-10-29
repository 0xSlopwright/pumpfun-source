#!/usr/bin/env python3
"""Replay the maintained 25 AMM suites against one explicitly selected build."""
import argparse
import concurrent.futures
import gzip
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[3]
BASE = ROOT / 'repro/pump_amm/pool-serialization-thirty-seven'
OBSERVER = ROOT / 'repro/pump_amm/owner6048-v144/runtime/observe_suite.py'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--candidate', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    candidate, out = args.candidate.resolve(), args.output.resolve()
    out.mkdir(parents=True, exist_ok=False)
    specs = json.loads((BASE / 'replay-commands.json').read_text())['commands']
    counts = json.loads((BASE / 'summary.json').read_text())['suites']
    assert len(specs) == 25 and sum(counts.values()) == 17462
    specs.sort(key=lambda spec: counts[spec['suite']], reverse=True)
    workers = min(8, os.cpu_count() or 1)
    binding = {'candidate_sha256': sha(candidate), 'original_sha256': sha(ROOT / 'evidence/original/pump_amm/deployed.so'),
               'observer_sha256': sha(OBSERVER),
               'replay_driver_sha256': sha(Path(__file__)), 'workers': workers, 'ordering': 'descending-case-count',
               'harness_sha256': {spec['command'][1]: sha(ROOT / spec['command'][1]) for spec in specs},
               'scope': 'Fresh synthetic runtime execution. Maintained suite comparators exclude some log fields; focused receipts enforce separately recovered diagnostics.'}
    (out / 'inputs.json').write_text(json.dumps(binding, indent=2) + '\n')

    def run(spec):
        name = spec['suite']
        command = list(spec['command'])
        command[0] = sys.executable
        command[1] = str(ROOT / command[1])
        command[command.index('--candidate') + 1] = str(candidate)
        receipt = out / (name + '.json')
        command[command.index('--output') + 1] = str(receipt)
        sidecar = out / (name + '-transactions.json.gz')
        observed = [command[0], str(OBSERVER), str(sidecar), *command[1:]]
        start = time.monotonic()
        with (out / (name + '.log')).open('w') as log:
            result = subprocess.run(observed, cwd=ROOT, stdout=log, stderr=subprocess.STDOUT)
        row = {'suite': name, 'command': observed, 'returncode': result.returncode, 'seconds': time.monotonic() - start}
        if receipt.exists():
            data = json.loads(receipt.read_text())
            assert data['candidate_sha256'] == binding['candidate_sha256']
            assert data['original_sha256'] == binding['original_sha256']
            row.update(case_count=data['case_count'], mismatches=data.get('mismatches', []), receipt_sha256=sha(receipt))
        if sidecar.exists():
            tx = json.loads(gzip.decompress(sidecar.read_bytes()))
            row.update(transactions=tx['transaction_count'], signatures=tx['signature_count'], sidecar_sha256=sha(sidecar))
        print(json.dumps(row), flush=True)
        return row

    rows = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        for future in concurrent.futures.as_completed([executor.submit(run, spec) for spec in specs]):
            rows.append(future.result())
            (out / 'progress.json').write_text(json.dumps(rows, indent=2) + '\n')
    for row in rows:
        assert row['returncode'] == 0 and row['case_count'] == counts[row['suite']] and not row['mismatches'], row
        assert row['transactions'] == 2 * row['case_count'] + (150 if row['suite'] == 'boost' else 0), row
    assert sha(candidate) == binding['candidate_sha256'] and sha(OBSERVER) == binding['observer_sha256']
    assert all(sha(ROOT / name) == value for name, value in binding['harness_sha256'].items())
    summary = {**binding, 'suites': len(rows), 'cases': sum(row['case_count'] for row in rows),
               'transactions': sum(row['transactions'] for row in rows), 'signatures': sum(row['signatures'] for row in rows),
               'mismatches': [], 'inputs_unchanged': True}
    (out / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
    print(json.dumps(summary), flush=True)


if __name__ == '__main__':
    main()
