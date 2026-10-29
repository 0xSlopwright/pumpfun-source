#!/usr/bin/env python3
"""Negative controls for the proposal/source and exact instruction witnesses."""
import argparse
import copy
import json
import pathlib
import shutil
import tempfile
import unittest

import verify

PARSER = argparse.ArgumentParser()
PARSER.add_argument("--original", type=pathlib.Path, required=True)
PARSER.add_argument("--selected-symbols", type=pathlib.Path, required=True)
ARGS = PARSER.parse_args()


class Controls(unittest.TestCase):
    def test_undeclared_source_edit_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            packet = pathlib.Path(directory)
            shutil.copytree(verify.ROOT / "source", packet / "source")
            shutil.copytree(verify.ROOT / "evidence", packet / "evidence")
            source = packet / "source/admin_cto.rs"
            source.write_bytes(source.read_bytes().replace(b"old!=Pubkey::default()", b"old==Pubkey::default()", 1))
            with self.assertRaisesRegex(ValueError, "proposal source"):
                verify.verify_source(packet)

    def test_original_argument_witness_mutation_rejected(self):
        proof = copy.deepcopy(verify.verify_source())
        proof["argument_sites"][0]["original_argument_context"] = proof["argument_sites"][0]["original_argument_context"].replace("79 62 40 00", "79 62 48 00")
        record = json.loads((verify.ROOT / "evidence/input-and-call-proof.json").read_text())
        with self.assertRaisesRegex(ValueError, "original argument witness"):
            verify.verify_elf(verify.Elf(ARGS.original), "original", proof, record)

    def test_selected_argument_witness_mutation_rejected(self):
        proof = copy.deepcopy(verify.verify_source())
        proof["argument_sites"][0]["current_argument_context"] = proof["argument_sites"][0]["current_argument_context"].replace("79 72 40 00", "79 72 48 00")
        record = json.loads((verify.ROOT / "evidence/input-and-call-proof.json").read_text())
        with self.assertRaisesRegex(ValueError, "candidate argument witness"):
            verify.verify_elf(verify.Elf(ARGS.selected_symbols), "candidate", proof, record)


if __name__ == "__main__":
    unittest.main(argv=[__file__])
