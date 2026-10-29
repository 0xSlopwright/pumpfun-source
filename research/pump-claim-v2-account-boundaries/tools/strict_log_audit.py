"""Compare whole ordered retained Pump log lists, excluding runtime CU lines only.

Source filenames, line/column coordinates, panic text, program invocations,
events and all other retained lines remain literal. This audits saved evidence;
it neither executes a program nor adds input-space or instruction coverage.
"""
from pathlib import Path
from collections import Counter
import argparse
import gzip
import hashlib
import json
import re

if not __debug__:
    raise RuntimeError('Run without Python -O')

CU = re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')


def logs(value):
    result = []
    if isinstance(value, dict):
        for key, item in value.items():
            if 'log' in key.lower() and isinstance(item, list):
                result.extend(x for x in item if isinstance(x, str))
    return result


def audit(suites):
    coverage = Counter()
    mismatches = []

    def walk(value, path):
        if isinstance(value, dict):
            if isinstance(value.get('original'), dict) and isinstance(value.get('candidate'), dict):
                left, right = logs(value['original']), logs(value['candidate'])
                if left or right:
                    coverage[path.split('/')[0]] += 1
                    left = [line for line in left if not CU.fullmatch(line)]
                    right = [line for line in right if not CU.fullmatch(line)]
                    if left != right:
                        mismatches.append(dict(path=path, case=value.get('case', value.get('name')),
                                               original_logs=left, candidate_logs=right))
            for key, item in value.items():
                if key not in ('original', 'candidate'):
                    walk(item, path + '/' + key)
        elif isinstance(value, list):
            for index, item in enumerate(value):
                walk(item, path + '/' + str(index))

    for name, suite in suites.items():
        walk(suite, name)
    return dict(coverage=dict(coverage), log_bearing_cases=sum(coverage.values()),
                mismatches=mismatches, excluded_log_pattern=CU.pattern)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--report', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    raw = args.report.read_bytes()
    report = json.loads(gzip.decompress(raw) if raw.startswith(b'\x1f\x8b') else raw)
    result = audit(report['suites'])
    result.update(scope=__doc__, source_report_sha256=hashlib.sha256(raw).hexdigest(),
                  script_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest())
    args.output.write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(dict(log_bearing_cases=result['log_bearing_cases'],
                          mismatch_count=len(result['mismatches']),
                          source_report_sha256=result['source_report_sha256'])))
    return bool(result['mismatches'])


if __name__ == '__main__':
    raise SystemExit(main())
