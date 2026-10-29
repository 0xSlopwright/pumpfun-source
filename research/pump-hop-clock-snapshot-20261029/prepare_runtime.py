#!/usr/bin/env python3
"""Stage the unchanged accepted harness, then the explicit Clock receipt adapters."""
from pathlib import Path
import argparse
import hashlib
import json
import shutil
import subprocess
import sys

HERE = Path(__file__).resolve().parent
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', type=Path, required=True)
    parser.add_argument('--parent-packet', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    assert not args.output.exists()
    subprocess.run([sys.executable, '-B', str(args.parent_packet / 'qualification/prepare_runtime.py'),
                    '--repository', str(args.repository), '--output', str(args.output)], check=True)
    original = json.loads((args.output / 'STAGED.json').read_bytes())
    for row in original['files']:
        assert sha(args.output / row['path']) == row['sha256']
    staged = []
    for source in sorted((HERE / 'qualification/executed-tools').rglob('*')):
        if not source.is_file():
            continue
        target = args.output / source.relative_to(HERE / 'qualification/executed-tools')
        target.parent.mkdir(parents=True, exist_ok=True)
        # These are explicit new local adapters, never replacement build receipts.
        shutil.copyfile(source, target)
        staged.append({'path': target.relative_to(args.output).as_posix(), 'sha256': sha(target)})
    (args.output / 'CLOCK-STAGED.json').write_text(json.dumps({'accepted_inputs': original,
        'clock_adapters': staged, 'clock_packet': str(HERE)}, indent=2) + '\n')
    print(json.dumps({'runtime': str(args.output), 'new_adapters': len(staged), 'network_requests': 0}))


if __name__ == '__main__':
    main()
