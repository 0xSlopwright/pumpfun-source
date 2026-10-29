#!/usr/bin/env python3
"""Check current-source staging and safe, checksum-pinned input extraction."""
import gzip
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import shutil
import tarfile
import tempfile
import unittest

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value


PREPARE = module("mayhem_proposal_prepare", HERE / "prepare_mayhem_windows_inputs.py")
STAGE = module("mayhem_proposal_stage", HERE / "mayhem-proposal/source/build_exact.py")


def archive(name, data):
    output = io.BytesIO()
    with tarfile.open(fileobj=output, mode="w:bz2") as tar:
        member = tarfile.TarInfo(name)
        member.size = len(data)
        tar.addfile(member, io.BytesIO(data))
    return output.getvalue()


class MayhemProposalControls(unittest.TestCase):
    def test_stage_and_reject_changed_current_source(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            live = root / "live"
            shutil.copytree(HERE / "mayhem-proposal/source", live)
            previous = STAGE.HERE
            STAGE.HERE = live
            try:
                recipe, receipt = STAGE.stage(root / "baseline", REPO)
                self.assertEqual(receipt["source_files"], 67)
                self.assertFalse(receipt["compiler_executed"])
                for name, values in receipt["mapping"].items():
                    self.assertEqual(values["canonical_sha256"], values["staged_raw_sha256"])
                    self.assertEqual(gzip.decompress((recipe / "controller/sources" / (name + ".gz")).read_bytes()), (live / name).read_bytes())
                rust = live / "src/lib.rs"
                rust.write_bytes(rust.read_bytes() + b"\n// changed source\n")
                with self.assertRaisesRegex(ValueError, "current Mayhem inputs differ"):
                    STAGE.stage(root / "changed", REPO)
            finally:
                STAGE.HERE = previous

    def test_reject_untracked_current_rust(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            live = root / "live"
            shutil.copytree(HERE / "mayhem-proposal/source", live)
            (live / "src/untracked.rs").write_bytes(b"pub fn untracked() {}\n")
            previous, STAGE.HERE = STAGE.HERE, live
            try:
                with self.assertRaisesRegex(ValueError, "current Mayhem inputs differ"):
                    STAGE.stage(root / "extra", REPO)
            finally:
                STAGE.HERE = previous

    def test_sdk_selection_and_bad_hash(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            path = root / "sdk.tar.bz2"
            path.write_bytes(archive("platform-tools/rust/bin/rustc.exe", b"pinned executable"))
            row = {"path": "rust/bin/rustc.exe", "bytes": 17,
                   "sha256": hashlib.sha256(b"pinned executable").hexdigest()}
            PREPARE.extract_components(path, root / "valid", [row])
            self.assertEqual((root / "valid/rust/bin/rustc.exe").read_bytes(), b"pinned executable")
            with self.assertRaisesRegex(ValueError, "SDK component differs"):
                PREPARE.extract_components(path, root / "wrong", [dict(row, sha256="0" * 64)])

    def test_reject_sdk_traversal(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            path = root / "unsafe.tar.bz2"
            path.write_bytes(archive("../escape", b"no"))
            with self.assertRaisesRegex(ValueError, "unsafe SDK member"):
                PREPARE.extract_components(path, root / "output", [])
            self.assertFalse((root / "escape").exists())

    def test_retention_excludes_cached_receipt_substitution(self):
        runner = module("mayhem_proposal_runner", HERE / "run_mayhem_windows.py")
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "build/build/host/target/release").mkdir(parents=True)
            (root / "build/build/target/target").mkdir(parents=True)
            (root / "qualification.json").write_text('{"status":"FAILED"}')
            (root / "build/build/host/result.json").write_text('{"status":"FAILED"}')
            (root / "build/build/host/target/release/anchor_attribute_program.dll").write_bytes(b"fresh DLL")
            (root / "build/build/target/target/cached.rlib").write_bytes(b"excluded cache")
            runner.retain(root)
            evidence = root / "evidence"
            manifest = json.loads((evidence / "MANIFEST.json").read_text())
            self.assertIn("qualification.json", manifest)
            self.assertIn("build/build/host/result.json", manifest)
            self.assertNotIn("build/build/target/target/cached.rlib", manifest)
            self.assertEqual(gzip.decompress((evidence / "build/build/host/anchor_attribute_program.dll.gz").read_bytes()), b"fresh DLL")


if __name__ == "__main__":
    unittest.main()
