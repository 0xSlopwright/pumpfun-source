#!/usr/bin/env python3
"""Stage authenticated existing fixtures and retained native replay tools locally."""
from pathlib import Path
import argparse
import hashlib
import json
import os
import shutil

HERE = Path(__file__).resolve().parent
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    repository, output = args.repository.resolve(), args.output.resolve()
    assert not output.exists(), 'Use a new output directory; prior evidence is preserved.'
    inputs = json.loads((HERE / 'INPUTS.json').read_bytes())
    assert not inputs['missing']
    output.mkdir(parents=True)
    records = []
    for row in inputs['files'] + inputs['physical_existing_inputs']:
        relative = Path(row['path'])
        assert not relative.is_absolute() and '..' not in relative.parts
        source, target = repository / relative, output / relative
        assert source.is_file() and sha(source) == row['sha256'], row['path']
        if 'git_oid' in row:
            raw = source.read_bytes()
            assert hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest() == row['git_oid']
        target.parent.mkdir(parents=True, exist_ok=True)
        try:
            os.link(source, target)
        except OSError:
            shutil.copyfile(source, target)
        assert sha(target) == row['sha256']
        records.append({'path': row['path'], 'sha256': row['sha256']})
    for source in sorted((HERE / 'executed-tools').rglob('*')):
        if not source.is_file():
            continue
        target = output / source.relative_to(HERE / 'executed-tools')
        assert not target.exists()
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        records.append({'path': target.relative_to(output).as_posix(), 'sha256': sha(target)})
    (output / 'STAGED.json').write_text(json.dumps({'source_revision': inputs['revision'], 'files': records}, indent=2) + '\n')
    print(json.dumps({'output': str(output), 'authenticated_files': len(records), 'network_requests': 0}, indent=2))


if __name__ == '__main__':
    main()
