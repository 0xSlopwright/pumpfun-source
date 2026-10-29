#!/usr/bin/env python3
"""Counterexamples for selector widening, ordering and source staging."""
import json
from pathlib import Path
import shutil
import tempfile
import unittest
from unittest.mock import patch

import build_exact
import verify


class LinkerLocatorControls(unittest.TestCase):
    def copy_support(self, root):
        for name in ("inputs.json", "ordered-native.ld", "observed-link.map.gz"):
            shutil.copy2(verify.HERE / name, root / name)

    def test_all_539_selectors_match_old_and_actual_inputs(self):
        self.assertEqual(verify.verify_recipe(), 539)

    def test_section_order_change_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.copy_support(root)
            path = root / "ordered-native.ld"
            lines = path.read_text().splitlines(keepends=True)
            indices = [i for i, line in enumerate(lines) if '.text._ZN' in line][:2]
            lines[indices[0]], lines[indices[1]] = lines[indices[1]], lines[indices[0]]
            path.write_text("".join(lines))
            with patch.object(verify, "HERE", root):
                with self.assertRaisesRegex(ValueError, "derived linker recipe changes"):
                    verify.verify_recipe()

    def test_widening_internal_cgu_identity_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            self.copy_support(root)
            path = root / "inputs.json"
            pins = json.loads(path.read_text())
            pins["locator_changes"][0]["portable_glob"] = "*"
            path.write_text(json.dumps(pins))
            with patch.object(verify, "HERE", root):
                with self.assertRaisesRegex(ValueError, "exceeds Cargo artifact digest"):
                    verify.verify_recipe()

    def test_current_67_raw_source_inputs_and_changed_script_are_bound(self):
        with tempfile.TemporaryDirectory() as temporary:
            recipe, record = build_exact.stage(Path(temporary) / "stage", verify.REPO,
                verify.REPO / "research/all-contract-completion-20261028/mayhem-proposal/source")
            self.assertEqual(record["source_files"], 67)
            self.assertEqual(len(record["canonical_inputs"]), 67)
            self.assertEqual(record["linker_locator_transform"]["changed_selectors"], 539)
            self.assertEqual(record["copied_recipe_inputs"]["controller/ordered-native.ld"],
                             build_exact.sha(recipe / "controller/ordered-native.ld"))
            self.assertFalse(record["compiler_executed"])


if __name__ == "__main__":
    unittest.main()
