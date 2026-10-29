#!/usr/bin/env python3
"""Offline counterexamples for the fixed compiler installer controller."""
import hashlib
import io
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

import install


def digest(data):
    return hashlib.sha256(data).hexdigest()


class InstallerControls(unittest.TestCase):
    def test_all_product_locators_are_fixed(self):
        pins = json.loads((install.HERE / "inputs.json").read_text())
        command = install.command(Path("bootstrap.exe"), Path("isolated instance"), pins)
        for flag in ("--installChannelUri", "--channelUri"):
            self.assertEqual(command[command.index(flag)+1], "https://aka.ms/vs/17/release/626735536_703519794/channel")
        self.assertEqual(command[command.index("--installCatalogUri")+1], pins["catalog"]["url"])
        self.assertIn("--noUpdateInstaller", command)
        self.assertNotIn("https://aka.ms/vs/17/release/channel", command)

    def test_catalog_cohort_and_payload_substitution_rejected(self):
        pins = json.loads((install.HERE / "inputs.json").read_text())
        channel = {"info": {"productDisplayVersion": "17.14.40"}, "channelItems": [{
            "id": "Microsoft.VisualStudio.Manifests.VisualStudio", "payloads": [pins["catalog"]]}]}
        catalog = {"info": {"productDisplayVersion": "17.14.40"}, "packages": [{
            "id": "Microsoft.VC.14.44.17.14.Tools.HostX64.TargetX64.base", "version": "14.44.35228",
            "payloads": [pins["tools_payload"]]}]}
        install.validate_catalog(json.dumps(channel).encode(), json.dumps(catalog).encode(), pins)
        catalog["packages"][0]["version"] = "14.44.35229"
        with self.assertRaisesRegex(ValueError, "qualified compiler payload changed"):
            install.validate_catalog(json.dumps(channel).encode(), json.dumps(catalog).encode(), pins)

    def test_changed_payload_member_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            p = Path(temporary) / "compiler.vsix"
            values = {"bin/Hostx64/x64/cl.exe": b"qualified cl", "bin/Hostx64/x64/link.exe": b"qualified link"}
            pins = {"tools_payload_files": {n: {"bytes": len(b), "sha256": digest(b)} for n, b in values.items()},
                    "exact_cl_sha256": digest(values["bin/Hostx64/x64/cl.exe"]),
                    "exact_link_sha256": digest(values["bin/Hostx64/x64/link.exe"])}
            def write(contents):
                with zipfile.ZipFile(p, "w") as zipped:
                    for name, data in contents.items():
                        zipped.writestr("Contents/VC/Tools/MSVC/14.44.35207/" + name, data)
            write(values)
            self.assertEqual(len(install.payload_files(p, pins)), 2)
            write(dict(values, **{"bin/Hostx64/x64/cl.exe": b"other cl"}))
            with self.assertRaisesRegex(ValueError, "compiler payload byte inventory differs"):
                install.payload_files(p, pins)

    def test_installed_native_bytes_must_match_archive(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "cl.exe").write_bytes(b"wrong native binary")
            with self.assertRaisesRegex(ValueError, "installed compiler member differs"):
                install.check_installed(root, {"cl.exe": {"bytes": 19, "sha256": digest(b"qualified cl")}})


if __name__ == "__main__":
    unittest.main()
