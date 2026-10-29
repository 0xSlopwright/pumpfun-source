"""The byte verifier accepts a rewritten program id; this gate must not."""
import json
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


def archived_on(root):
    return subprocess.run(
        [sys.executable, str(root / 'scripts/verify_evidence.py')],
        capture_output=True, text=True,
    )


class CaptureIdentityTests(unittest.TestCase):
    def test_archived_helper_does_not_read_identity_fields(self):
        digest = verify.require_archived_helper()
        self.assertEqual(digest, 'de254298e2a064711f1709f5c7827fd34c2cca12af90504620e364c88d511c23')
        text = ARCHIVED.read_text(encoding='utf-8')
        self.assertNotIn("['program']", text)
        self.assertNotIn('commitment', text)

    def test_current_captures_match_scope(self):
        self.assertEqual(verify.check(ROOT), 9)

    def test_archived_verifier_accepts_a_replaced_program_id(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            shutil.copytree(ROOT / 'evidence', root / 'evidence', symlinks=True)
            scripts = root / 'scripts'
            scripts.mkdir()
            for name in ('verify_evidence.py', 'analyze.py', 'capture.py'):
                shutil.copy(ROOT / 'scripts' / name, scripts / name)
            path = root / 'evidence/original/pump/capture.json'
            record = json.loads(path.read_text(encoding='utf-8'))
            record['program'] = '11111111111111111111111111111111'
            path.write_text(json.dumps(record), encoding='utf-8')
            archived = archived_on(root)
            self.assertEqual(archived.returncode, 0, archived.stderr)
            with self.assertRaisesRegex(verify.IdentityError, 'program id'):
                verify.check(root)

    def test_successor_rejects_owner_and_commitment_rewrites(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            shutil.copytree(ROOT / 'evidence', root / 'evidence', symlinks=True)
            owner = root / 'evidence/original/pump_amm/capture.json'
            record = json.loads(owner.read_text(encoding='utf-8'))
            record['owner'] = verify.LEGACY_OWNER
            owner.write_text(json.dumps(record), encoding='utf-8')
            with self.assertRaisesRegex(verify.IdentityError, 'owner'):
                verify.check(root)
            record['owner'] = verify.UPGRADEABLE_OWNER
            record['commitment'] = 'processed'
            owner.write_text(json.dumps(record), encoding='utf-8')
            with self.assertRaisesRegex(verify.IdentityError, 'commitment'):
                verify.check(root)


if __name__ == '__main__':
    unittest.main()
