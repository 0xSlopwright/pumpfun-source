"""The archived gate accepts upstream evidence substitution; this gate must not."""
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import verify

ROOT = verify.ROOT
ARCHIVED = ROOT / 'scripts/verify_evidence.py'
ARCHIVED_HELPERS = ('verify_evidence.py', 'analyze.py', 'capture.py')
PINNED_PUMP_FEES = verify.IDL_ADDRESS['pump_fees.json']


def archived_on(root):
    return subprocess.run(
        [sys.executable, str(root / 'scripts/verify_evidence.py')],
        capture_output=True, text=True,
    )


def copy_archived_helpers(source, destination):
    destination.mkdir(parents=True)
    for name in ARCHIVED_HELPERS:
        shutil.copy(source / 'scripts' / name, destination / name)


def rewrite_json(path, mutate):
    record = json.loads(path.read_text(encoding='utf-8'))
    mutate(record)
    path.write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8', newline='\n')


class SealedCopy:
    """A throwaway repository root; every mutation happens here, never in the tree."""

    def __init__(self, full):
        self.full = full

    def __enter__(self):
        self.temporary = tempfile.TemporaryDirectory()
        root = Path(self.temporary.name) / 'sealed'
        if self.full:
            shutil.copytree(ROOT / 'evidence', root / 'evidence', symlinks=True)
            copy_archived_helpers(ROOT, root / 'scripts')
        else:
            (root / 'evidence').mkdir(parents=True)
            shutil.copytree(ROOT / 'evidence/upstream', root / 'evidence/upstream')
            shutil.copy(ROOT / 'evidence/interface-inventory.json', root / 'evidence/interface-inventory.json')
            (root / 'docs').mkdir()
            shutil.copy(ROOT / 'docs/SCOPE.md', root / 'docs/SCOPE.md')
        return root

    def __exit__(self, *_):
        self.temporary.cleanup()
        return False


class UpstreamProvenanceTests(unittest.TestCase):
    def test_current_evidence_matches_every_pin(self):
        counts = verify.check(ROOT)
        self.assertEqual(counts['files'], 6)
        self.assertEqual(counts['idls'], 3)
        self.assertEqual(counts['repositories'], 5)

    def test_archived_gate_accepts_coordinated_idl_deletion(self):
        with SealedCopy(full=True) as root:
            (root / 'evidence/upstream/pump_fees.json').unlink()
            rewrite_json(root / 'evidence/upstream/provenance.json', lambda record: record['file_sha256'].pop('pump_fees.json'))
            archived = archived_on(root)
            self.assertEqual(archived.returncode, 0, archived.stderr)
            with self.assertRaisesRegex(verify.UpstreamEvidenceError, 'upstream evidence set differs'):
                verify.check(root)

    def test_archived_gate_accepts_substituted_idl(self):
        with SealedCopy(full=True) as root:
            target = root / 'evidence/upstream/pump_fees.json'
            original = target.read_bytes()
            substituted = original.replace(PINNED_PUMP_FEES.encode(), b'11111111111111111111111111111111')
            self.assertNotEqual(original, substituted)
            target.write_bytes(substituted)
            rewrite_json(
                root / 'evidence/upstream/provenance.json',
                lambda record: record['file_sha256'].__setitem__('pump_fees.json', hashlib.sha256(substituted).hexdigest()),
            )
            archived = archived_on(root)
            self.assertEqual(archived.returncode, 0, archived.stderr)
            with self.assertRaisesRegex(verify.UpstreamEvidenceError, 'sha256'):
                verify.check(root)

    def test_archived_gate_accepts_unread_upstream_mutations(self):
        with SealedCopy(full=True) as root:
            listing = root / 'evidence/upstream/tree.txt'
            listing.write_text(
                '\n'.join(line for line in listing.read_text(encoding='utf-8').splitlines() if 'COIN_CREATION' not in line) + '\n',
                encoding='utf-8',
                newline='\n',
            )
            (root / 'evidence/upstream/official-repositories.json').write_text('[]\n', encoding='utf-8', newline='\n')
            archived = archived_on(root)
            self.assertEqual(archived.returncode, 0, archived.stderr)

    def test_successor_rejects_unread_upstream_mutations(self):
        with SealedCopy(full=False) as root:
            listing = root / 'evidence/upstream/tree.txt'
            listing.write_text(
                '\n'.join(line for line in listing.read_text(encoding='utf-8').splitlines() if 'COIN_CREATION' not in line) + '\n',
                encoding='utf-8',
                newline='\n',
            )
            with self.assertRaisesRegex(verify.UpstreamEvidenceError, 'tree.txt sha256'):
                verify.check(root)
        with SealedCopy(full=False) as root:
            (root / 'evidence/upstream/official-repositories.json').write_text('[]\n', encoding='utf-8', newline='\n')
            with self.assertRaisesRegex(verify.UpstreamEvidenceError, 'official-repositories.json sha256'):
                verify.check(root)

    def test_successor_rejects_extra_upstream_file(self):
        with SealedCopy(full=False) as root:
            (root / 'evidence/upstream/pump_fees.json.bak').write_bytes(b'{}\n')
            with self.assertRaisesRegex(verify.UpstreamEvidenceError, 'unexpected='):
                verify.check(root)

    def test_successor_rejects_provenance_commit_rewrite(self):
        with SealedCopy(full=False) as root:
            rewrite_json(root / 'evidence/upstream/provenance.json', lambda record: record.__setitem__('commit', '0' * 40))
            with self.assertRaisesRegex(verify.UpstreamEvidenceError, 'provenance.json sha256'):
                verify.check(root)

    def test_successor_rejects_scope_address_rewrite(self):
        with SealedCopy(full=False) as root:
            scope = root / 'docs/SCOPE.md'
            scope.write_text(scope.read_text(encoding='utf-8').replace(PINNED_PUMP_FEES, '11111111111111111111111111111111'), encoding='utf-8', newline='\n')
            with self.assertRaisesRegex(verify.UpstreamEvidenceError, 'no longer publishes the pump_fees address'):
                verify.check(root)

    def test_successor_rejects_inventory_not_derived_from_pinned_idls(self):
        with SealedCopy(full=False) as root:
            rewrite_json(root / 'evidence/interface-inventory.json', lambda record: record['pump_fees'].__setitem__('instructions', 30))
            with self.assertRaisesRegex(verify.UpstreamEvidenceError, 'instruction count was not derived'):
                verify.check(root)


if __name__ == '__main__':
    unittest.main()
