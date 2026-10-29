#!/usr/bin/env python3
"""Bounded current-scanner controls using the unmodified sealed selection fixture."""
import importlib.util
from pathlib import Path
import unittest

import verify_current_bridge as bridge

ROOT = Path(__file__).resolve().parents[3]
SEALED = ROOT / "repro/donation-relay/canonical-exact-selection/test_selection.py"
spec = importlib.util.spec_from_file_location("sealed_relay_controls_fixture", SEALED)
sealed = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sealed)


class CurrentBridgeControls(unittest.TestCase):
    def setUp(self):
        self.fixture = sealed.SelectionControls("test_legitimate_baseline")
        self.fixture.setUp()

    def tearDown(self):
        self.fixture.tearDown()

    def verify(self):
        reviewed, counts = bridge.review_scanner(self.fixture.root, self.fixture.document)
        self.assertEqual(counts, {"old": 23, "new": 60})
        return sealed.gate._verify_document(self.fixture.root, reviewed)

    def test_reviewed_current_scanner_preserves_exact_selection(self):
        result = self.verify()
        self.assertTrue(result["all492_raw"])
        self.assertTrue(result["selected_payload_literal_checked"])

    def test_resealed_unrelated_scanner_change_rejected(self):
        name = self.fixture.document["scanner"]
        path = self.fixture.root / name
        path.write_bytes(path.read_bytes() + b"\n# unrelated scanner change\n")
        self.fixture.document["bindings"][name] = sealed.digest(path.read_bytes())
        with self.assertRaisesRegex(ValueError, "unreviewed scanner identity"):
            self.verify()

    def test_extra_canonical_rust_file_rejected(self):
        (self.fixture.root / "programs/donation-relay/src/unreviewed_extra.rs").write_text("pub fn extra() {}\n")
        with self.assertRaisesRegex(ValueError, "exact source map changed"):
            self.verify()

    def test_changed_canonical_rust_file_rejected(self):
        path = self.fixture.root / "programs/donation-relay/src/lib.rs"
        path.write_bytes(path.read_bytes() + b"\n// changed canonical source\n")
        with self.assertRaisesRegex(ValueError, "exact source map changed"):
            self.verify()


if __name__ == "__main__":
    unittest.main()
