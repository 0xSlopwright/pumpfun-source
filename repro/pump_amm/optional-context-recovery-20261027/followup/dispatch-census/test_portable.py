#!/usr/bin/env python3
from pathlib import Path
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--root', type=Path, required=True)
    p.add_argument('--candidate', type=Path, required=True)
    p.add_argument('--symbols', type=Path, required=True)
    args = p.parse_args()
    with tempfile.TemporaryDirectory(prefix='amm-dispatch-census-') as tmp:
        dst = Path(tmp) / 'packet'
        shutil.copytree(Path(__file__).resolve().parent, dst)
        env = {**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'}
        result = subprocess.run([sys.executable, '-B', str(dst / 'verify.py'), '--root', str(args.root.resolve()), '--candidate', str(args.candidate.resolve()), '--symbols', str(args.symbols.resolve())], cwd=tmp, env=env, check=True, text=True, capture_output=True)
        report = json.loads(result.stdout)
        assert report['passed']
        print(json.dumps({'outside_repository': True, **report}, indent=2))
