#!/usr/bin/env python3
"""Reject stale canonical source and resealed false source/build bindings."""
import gzip
import hashlib
import json
from pathlib import Path
import shutil
import tempfile
import unittest
from unittest.mock import patch

import verify_current_fees as verifier

ROOT = Path(__file__).resolve().parents[2]


class CurrentFeesTests(unittest.TestCase):
    def test_changed_vendor_rejected_despite_exact_saved_elf(self):
        with tempfile.TemporaryDirectory(prefix="fees-vendor-negative-") as td:
            source = Path(td) / "fees"
            shutil.copytree(ROOT / "programs/pump-fees", source)
            target = source / "vendor/used-public/src/lib.rs"
            target.write_bytes(target.read_bytes() + b"\n// changed canonical macro\n")
            with self.assertRaisesRegex(ValueError, "canonical Fees input set"):
                verifier.verify(ROOT, source)

    def test_resealed_false_mapping_rejected(self):
        with tempfile.TemporaryDirectory(prefix="fees-mapping-negative-") as td:
            packet = Path(td) / "packet"
            packet.mkdir()
            selection = json.loads((verifier.HERE / "fees-selection.json").read_text())
            build = packet / selection["build_directory"]
            shutil.copytree(verifier.HERE / selection["build_directory"], build)
            receipt = json.loads(gzip.decompress((build / "result.json.gz").read_bytes()))
            receipt["input_mapping"]["programs/pump-fees/src/lib.rs"]["sha256"] = "0" * 64
            raw = (json.dumps(receipt, indent=2) + "\n").encode()
            (build / "result.json.gz").write_bytes(gzip.compress(raw, mtime=0))
            selection["result_json_sha256"] = hashlib.sha256(raw).hexdigest()
            (packet / "fees-selection.json").write_text(json.dumps(selection))
            with patch.object(verifier, "HERE", packet):
                with self.assertRaisesRegex(ValueError, "canonical to qualified input mapping"):
                    verifier.verify(ROOT)

    def test_resealed_repeat_target_reuse_rejected(self):
        with tempfile.TemporaryDirectory(prefix="fees-repeat-negative-") as td:
            packet = Path(td) / "packet"
            packet.mkdir()
            selection = json.loads((verifier.HERE / "fees-selection.json").read_text())
            for binding in (selection, selection["repeat_build"]):
                shutil.copytree(verifier.HERE / binding["build_directory"], packet / binding["build_directory"])
            repeat = selection["repeat_build"]
            receipt_path = packet / repeat["build_directory"] / "result.json.gz"
            receipt = json.loads(gzip.decompress(receipt_path.read_bytes()))
            receipt["target_initially_empty"] = False
            raw = (json.dumps(receipt, indent=2) + "\n").encode()
            receipt_path.write_bytes(gzip.compress(raw, mtime=0))
            repeat["result_json_sha256"] = hashlib.sha256(raw).hexdigest()
            (packet / "fees-selection.json").write_text(json.dumps(selection))
            with patch.object(verifier, "HERE", packet):
                with self.assertRaisesRegex(ValueError, "repeat build needs a clean empty target"):
                    verifier.verify(ROOT)


if __name__ == "__main__":
    unittest.main()
