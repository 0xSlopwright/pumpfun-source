import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("auth_copy", ROOT / "scripts/extract-auth-copy.py")
AUTH = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(AUTH)


def synthetic_html(resources=None, locale="en", duplicate=False):
    # Synthetic labels test parsing only. They are never used by the product UI.
    if resources is None:
        resources = {}
        for key in AUTH.KEYS:
            cursor = resources
            parts = key.split(".")
            for part in parts[:-1]:
                cursor = cursor.setdefault(part, {})
            cursor[parts[-1]] = f"synthetic {key}"
    row = "c6:" + json.dumps({"locale": locale, "resources": resources}) + "\n"
    if duplicate:
        row += row
    return '<script>self.__next_f.push(' + json.dumps([1, row]) + ')</script>'


class AuthCopyTests(unittest.TestCase):
    def test_checked_in_copy_matches_hash_bound_capture(self):
        self.assertEqual((ROOT / AUTH.OUTPUT).read_text(), AUTH.generate(ROOT))

    def test_json_only_script_parsing(self):
        values = AUTH.extract(synthetic_html())
        self.assertEqual(len(values), len(AUTH.KEYS))
        self.assertEqual(values["common.close"], "synthetic common.close")
        with self.assertRaises((ValueError, json.JSONDecodeError)):
            AUTH.extract('<script>self.__next_f.push(doNotExecute())</script>')

    def test_wrong_locale_duplicate_missing_or_non_string_labels_fail(self):
        for source in [synthetic_html(locale="fr"), synthetic_html(duplicate=True), synthetic_html(resources={}), "<html></html>"]:
            with self.assertRaises(ValueError):
                AUTH.extract(source)
        source = synthetic_html().replace("synthetic common.close", "")
        with self.assertRaises(ValueError):
            AUTH.extract(source)

    def test_tampered_bytes_and_changed_manifest_fail_before_writing(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "evidence/web/objects").mkdir(parents=True)
            record = dict(AUTH.SOURCE)
            manifest = {"captured_at": AUTH.CAPTURED_AT, "records": [record]}
            destination = root / "evidence/web/manifest.json"
            destination.write_text(json.dumps(manifest))
            (root / AUTH.SOURCE["path"]).write_text("not the retained HTML")
            with self.assertRaisesRegex(ValueError, "bytes"):
                AUTH.generate(root)
            record["sha256"] = "0" * 64
            destination.write_text(json.dumps(manifest))
            with self.assertRaisesRegex(ValueError, "identity"):
                AUTH.generate(root)


if __name__ == "__main__":
    unittest.main()
