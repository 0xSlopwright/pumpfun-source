"""Retain actual proposal/preflight receipts and outputs, excluding caches."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--root', type=Path, required=True)
args = parser.parse_args()
root = args.root.resolve()
evidence = root / 'evidence'
evidence.mkdir(parents=True, exist_ok=True)
for name in ('inputs', 'native-postcheck', 'default'):
    source = root / name
    if not source.exists():
        continue
    for path in source.iterdir():
        if path.is_file() and path.suffix in ('.json', '.log', '.so', '.map', '.tar'):
            target = evidence / name / path.name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, target)
    if (source / 'link').is_dir():
        shutil.copytree(source / 'link', evidence / name / 'link', dirs_exist_ok=True)
here = Path(__file__).resolve().parent
for name in ('proposal-pins.json', 'source-binding.json', 'source.tar.gz', 'build.py',
             'prepare.py', 'vendor.py', 'check_vendor.py', 'vendor-control.json.gz',
             'failure-control.json', 'previous-hosted-failure.json',
             'previous-hosted-failure.log.gz', 'parent-proposal.json', 'README.md'):
    shutil.copy2(here / name, evidence / name)
manifest = {}
for path in sorted(evidence.rglob('*')):
    if path.is_file():
        data = path.read_bytes()
        manifest[path.relative_to(evidence).as_posix()] = {
            'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(),
        }
(evidence / 'MANIFEST.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
