"""Check required manifest coverage for the five archived static-analysis packets."""
import argparse
import hashlib
import json
from pathlib import Path
import re

COMMON = {'README.md', 'summary.json', 'verify.py'}
REQUIRED = {
    'windows': COMMON | {'window-inventory.json', 'call-graph.json', 'function-index.json', 'section-layout.json'},
    'sections': COMMON | {'layer1-data-layout.json', 'layer2-relocation-map.json', 'layer3-cross-section.json', 'layer4-anchor-idl.json', 'layer5-math-analysis.json'},
    'disassembly': COMMON | {'disassembly.json.gz', 'dispatch-table.json', 'error-strings.json', 'extern-usage.json', 'fingerprints.json', 'rodata-strings.json', 'syscall-usage.json', 'windows-deep.json'},
    'signatures': COMMON | {'shared-signatures.json', 'top-ngrams.json'} | {f'{program}-{kind}.json' for program in ('pump', 'pump_amm', 'mayhem') for kind in ('patterns', 'signatures')},
    'roadmap': COMMON | {'pump-details.json', 'pump_amm-details.json', 'mayhem-details.json', 'reconstruction-plan.json'},
}


def check_manifest(packet, kind):
    packet = Path(packet)
    if kind not in REQUIRED:
        raise ValueError('Unknown analysis packet kind')
    manifest = json.loads((packet / 'manifest.json').read_text(encoding='utf-8'))
    if not isinstance(manifest, dict):
        raise ValueError('Manifest must be a filename-to-SHA256 object')
    missing = REQUIRED[kind] - manifest.keys()
    if missing:
        raise ValueError(f'Required artifacts omitted from manifest: {sorted(missing)}')
    # Validate every name before opening any payload, including optional additions.
    for name, digest in manifest.items():
        if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]*', name) or name == 'manifest.json':
            raise ValueError(f'Invalid artifact name: {name!r}')
        if not isinstance(digest, str) or not re.fullmatch(r'[0-9a-f]{64}', digest):
            raise ValueError(f'Invalid SHA256 for {name}')
    for name, expected in manifest.items():
        path = packet / name
        if path.is_symlink() or not path.is_file():
            raise ValueError(f'Artifact must be a regular, non-symlink file: {name}')
        if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            raise ValueError(f'Artifact hash mismatch: {name}')
    return {'kind': kind, 'required_artifacts': len(REQUIRED[kind]), 'hashed_artifacts': len(manifest)}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--kind', choices=sorted(REQUIRED), required=True)
    parser.add_argument('--packet', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(check_manifest(args.packet, args.kind)))
