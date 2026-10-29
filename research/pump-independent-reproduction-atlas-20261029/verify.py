#!/usr/bin/env python3
"""Offline, stdlib-only verifier for the independent reproduction + residual atlas.

Checks, from committed repository artifacts only:
 1. the published Pump census still reports 1,019 / 188 / 16 (no window gain);
 2. the committed atlas.json is exactly reproducible from the selected and
    original images by this packet's own generator;
 3. the committed reproduction receipt binds the qualified image hashes
    (c0e29.../dd73...) to the public, pinned v1.44 toolchain hashes; and
 4. the image the atlas describes is the qualified symbols image.

No build, network access or source change is performed.
"""
import hashlib
import json
import sys
from pathlib import Path

PKG = Path(__file__).resolve().parent
ROOT = PKG.parents[1]
sys.path.insert(0, str(PKG / 'tools'))
import build_atlas  # noqa: E402

QUALIFIED_CANDIDATE = 'c0e29e2d41c30e854f3548b37e87798d516e4e0e7769f40b7d8d16e31429795f'
QUALIFIED_UNSTRIPPED = 'dd73afe77d90d289e9383ee1aa12cdb26608752eb1a1f8b3a4135c0af786cb17'
EXPECTED_COUNTS = {'total': 1035, 'normalized': 1019, 'raw': 188,
                   'unmatched': 16, 'matched_text_bytes': 1611088}
SELECTED = ROOT / 'research/pump-multihop-accrual-qualification-20261028/artifacts/unstripped.so'
ORIGINAL = ROOT / 'evidence/original/pump/deployed.so'


def check(cond, label):
    print(('PASS ' if cond else 'FAIL ') + label)
    if not cond:
        raise SystemExit(1)


def main():
    # 1 + 2: recompute census and atlas from committed images; match the committed file.
    rebuilt = build_atlas.build()
    committed = json.loads((PKG / 'atlas.json').read_text())
    check(rebuilt['official_counts'] == EXPECTED_COUNTS, f"census counts {rebuilt['official_counts']}")
    check(rebuilt == committed, 'atlas.json reproducible from committed images')
    check(len(committed['unmatched_windows']) == 16, '16 residual windows enumerated')

    # 3: the reproduction receipt binds the qualified hashes to the public toolchain.
    rec = json.loads((PKG / 'reproduction/build-comparison.json').read_text())
    prov = json.loads((PKG / 'reproduction/toolchain-public-hashes.json').read_text())
    check(rec.get('qualified_image_hashes_equal') is True, 'receipt reports qualified image hashes equal')
    check(rec['comparison']['candidate_sha256'] == QUALIFIED_CANDIDATE, 'reproduced stripped image == qualified c0e29')
    check(rec['unstripped_sha256'] == QUALIFIED_UNSTRIPPED, 'reproduced symbols image == qualified dd73')
    check(rec['tool_sha256'] == prov['tool_sha256'], 'receipt tools == recorded v1.44 cohort tool hashes (not authenticated against the release)')
    check(rec['target_libraries_sha256'] == prov['target_libraries_sha256'], 'receipt target libs == recorded v1.44 cohort lib hashes (not authenticated against the release)')

    # 4: the atlas describes the qualified symbols image and the deployed original.
    check(hashlib.sha256(SELECTED.read_bytes()).hexdigest() == QUALIFIED_UNSTRIPPED, 'committed selected image == qualified dd73')
    check(committed['selected_symbols_sha256'] == QUALIFIED_UNSTRIPPED, 'atlas selected hash == qualified dd73')
    check(committed['original_sha256'] == hashlib.sha256(ORIGINAL.read_bytes()).hexdigest(), 'atlas original hash == deployed image')

    summary = committed['classification_summary']
    print(f"\nResidual classes: {summary}")
    print('All checks passed. No window gain, source, image, normalizer or count change is claimed.')


if __name__ == '__main__':
    main()
