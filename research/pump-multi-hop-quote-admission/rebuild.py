"""Rebuild the archived Rust inputs through the unchanged repository builder."""
import argparse
import gzip
import hashlib
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tarfile

PACKET = Path(__file__).resolve().parent
ROOT = PACKET.parents[1]


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--sdk', type=Path, required=True)
    p.add_argument('--target-libraries', type=Path, required=True)
    p.add_argument('--registry-home', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    a = p.parse_args()
    out = a.output.resolve()
    out.relative_to(ROOT)
    out.mkdir(parents=True, exist_ok=False)
    primary = out / 'primary'
    expected = json.loads((PACKET / 'sources/primary-sha256.json').read_text())
    with tarfile.open(fileobj=io.BytesIO(gzip.decompress((PACKET / 'sources/primary.tar.gz').read_bytes()))) as archive:
        members = archive.getmembers()
        assert len(members) == len(expected) == 65
        assert {m.name for m in members} == set(expected)
        for m in members:
            assert m.isfile() and not Path(m.name).is_absolute() and '..' not in Path(m.name).parts
            data = archive.extractfile(m).read()
            assert hashlib.sha256(data).hexdigest() == expected[m.name]
            dest = primary / m.name
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
    command = [sys.executable, '-B', str(ROOT / 'scripts/pump_build_verified.py'),
               '--source-directory', str(primary), '--sdk', str(a.sdk.resolve()),
               '--registry-home', str(a.registry_home.resolve()), '--workspace-layout',
               '--target-library-profile', 'linux-v1.44-sbpf',
               '--target-library-directory', str(a.target_libraries.resolve()),
               '--output', str(out / 'build')]
    env = os.environ.copy()
    for name in ('RUSTFLAGS', 'CARGO_ENCODED_RUSTFLAGS', 'RUSTC_WORKSPACE_WRAPPER', 'PUMP_DATA_ORDER_CERTIFICATE'):
        env.pop(name, None)
    env['CARGO_NET_OFFLINE'] = 'true'
    (out / 'command.json').write_text(json.dumps(command, indent=2) + '\n')
    subprocess.run(command, cwd=ROOT, env=env, check=True)
    result = json.loads(gzip.decompress((PACKET / 'builds/proposal-result.json.gz').read_bytes()))
    for name, field in [('candidate.so', 'candidate_sha256'), ('unstripped.so', 'unstripped_sha256')]:
        assert hashlib.sha256((out / 'build' / name).read_bytes()).hexdigest() == result[field], name
    print('Both complete ELF outputs reproduced exactly.')


if __name__ == '__main__':
    main()
