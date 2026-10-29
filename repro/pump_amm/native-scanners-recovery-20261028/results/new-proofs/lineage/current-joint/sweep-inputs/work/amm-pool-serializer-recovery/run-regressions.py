"""Replay exactly the existing AMM37 25 suites; no new inputs or runtime probes."""
from pathlib import Path
import concurrent.futures
import hashlib
import json
import subprocess
import tarfile

WORK = Path(__file__).resolve().parent
ROOT = WORK.parents[1]
BASE = ROOT / 'repro/pump_amm/serialization-thirty-seven'
BUILD = WORK / 'build'
OUT = WORK / 'results'
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
OUT.mkdir(exist_ok=False)
candidate = BUILD / 'artifacts/pump_amm_recovered.so'
candidate_sha = sha(candidate)
inputs = json.loads((BASE / 'test-source-sha256.json').read_text())
for path, digest in inputs.items():
    assert sha(ROOT / path) == digest, path
inputs[str(Path(__file__).relative_to(ROOT))] = sha(Path(__file__))
(OUT / 'test-source-sha256.json').write_text(json.dumps(inputs, indent=2) + '\n')
with tarfile.open(OUT / 'test-snapshot.tar.gz', 'w:gz') as archive:
    for path in inputs:
        archive.add(ROOT / path, arcname=path)
runtime = json.loads((BASE / 'runtime-input-sha256.json').read_text())
for path, digest in runtime.items():
    assert sha(ROOT / path) == digest, path
(OUT / 'runtime-input-sha256.json').write_text(json.dumps(runtime, indent=2) + '\n')
rows = json.loads((BASE / 'replay-commands.json').read_text())['commands']
expected = json.loads((BASE / 'summary.json').read_text())['suites']
assert len(rows) == len(expected) == 25 and sum(expected.values()) == 17462


def run(row):
    name = row['suite']
    command = list(row['command'])
    command[0] = str(ROOT / command[0])
    command[1] = str(ROOT / command[1])
    command[command.index('--candidate') + 1] = str(candidate)
    output = OUT / (name + '.json')
    command[command.index('--output') + 1] = str(output)
    proc = subprocess.run(command, text=True, capture_output=True, cwd=ROOT)
    (OUT / (name + '.log')).write_text(proc.stdout + proc.stderr)
    result = {'suite': name, 'command': command, 'returncode': proc.returncode,
              'log_sha256': sha(OUT / (name + '.log'))}
    if output.exists():
        report = json.loads(output.read_text())
        result.update(output_sha256=sha(output), candidate_sha256=report.get('candidate_sha256'),
                      case_count=report.get('case_count'), mismatches=report.get('mismatches'))
    print(json.dumps(result), flush=True)
    return result


with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    results = list(pool.map(run, rows))
(OUT / 'regression-run.json').write_text(json.dumps(results, indent=2) + '\n')
for path, digest in {**inputs, **runtime}.items():
    assert sha(ROOT / path) == digest, path
assert sha(candidate) == candidate_sha
for row in results:
    assert row['returncode'] == 0, row
    assert row['candidate_sha256'] == candidate_sha, row
    assert row['case_count'] == expected[row['suite']], row
    assert row['mismatches'] == [], row
summary = {'candidate_sha256': candidate_sha, 'case_count': sum(expected.values()),
           'suite_count': len(expected), 'suites': expected, 'mismatches': [],
           'additional_unique_cases': 0,
           'runtime_inputs_unchanged': True, 'test_helper_inputs_unchanged': True,
           'scope': 'Fresh comparisons of the unchanged existing 25-suite corpus against the Pool-only candidate'}
(OUT / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
print(json.dumps(summary), flush=True)
