#!/usr/bin/env python3
"""Reject altered archive bytes and any registry network fallback."""
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

import prepare


class OfflineTransportControls(unittest.TestCase):
    def test_complete_archive_set_and_plus_versions(self):
        pins = json.loads((prepare.HERE / "inputs.json").read_text())
        with tempfile.TemporaryDirectory() as temporary:
            expected = prepare.seed(Path(temporary), pins)
            self.assertEqual(len(expected), 215)
            for name in ("toml_datetime", "toml_edit", "toml_parser"):
                row = next(x for x in pins["packages"] if x["name"] == name)
                self.assertIn("+spec-1.1.0", row["version"])
                self.assertEqual(row["directory"], name + "-" + row["version"])

    def test_network_fallback_is_forbidden(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "toml_edit-0.25.17+spec-1.1.0.crate"
            data = b"authenticated fixture"
            digest = hashlib.sha256(data).hexdigest()
            path.write_bytes(data)
            called = []
            def network(*args):
                called.append(args)
                raise AssertionError("registry network called")
            download = prepare.cache_only_download(network, {path.name: {"archive_sha256": digest}})
            malformed = "https://static.crates.io/crates/toml_edit-0.25.17+spec/" + path.name
            self.assertEqual(download(malformed, path, digest), path)
            path.unlink()
            with self.assertRaisesRegex(ValueError, "registry network fallback forbidden"):
                download(malformed, path, digest)
            self.assertEqual(called, [])

    def test_resealed_bad_archive_rejected(self):
        pins = json.loads((prepare.HERE / "inputs.json").read_text())
        with tempfile.TemporaryDirectory() as temporary:
            # Keep the valid outer bundle but reseal one false inner archive
            # expectation: the authenticated package bytes must still agree.
            pins["packages"][0]["archive_sha256"] = "0" * 64
            with self.assertRaisesRegex(ValueError, "registry archive differs"):
                prepare.seed(Path(temporary), pins)


if __name__ == "__main__":
    unittest.main()
