#!/usr/bin/env python3
"""Mutation tests ensuring the byte comparator cannot hide code/padding changes."""
import contextlib
import io
import pathlib
import shutil
import struct
import tempfile
import unittest
from types import SimpleNamespace
import deep_section_analysis
import analyze
import verify_evidence
from compare import compare
class ComparisonTests(unittest.TestCase):
    def test_equal(self): self.assertTrue(compare(b'abc\0\0',b'abc\0\0')['full_byte_equality'])
    def test_code_mutation(self): self.assertEqual(compare(b'abc\0\0',b'axc\0\0')['first_difference'],1)
    def test_padding_mutation(self): self.assertEqual(compare(b'abc\0\0',b'abc\0x')['first_difference'],4)
    def test_truncated_padding(self): self.assertFalse(compare(b'abc\0\0',b'abc\0')['full_byte_equality'])
    def test_extended_padding(self): self.assertFalse(compare(b'abc\0',b'abc\0\0')['full_byte_equality'])
    def test_empty(self): self.assertEqual(compare(b'a',b'')['first_difference'],0)


class RelocationTargetTests(unittest.TestCase):
    def test_target_section_uses_address_not_file_offset(self):
        blob = bytearray(64)
        struct.pack_into('<QQ', blob, 0, 0x1000, 2)
        elf = SimpleNamespace(
            b=bytes(blob),
            symbols={},
            lo=0x2000,
            hi=0x3000,
            secs={
                '.rel.dyn': (0, 9, 0, 0, 0, 16, 0, 0, 1, 16),
                '.rodata': (0, 1, 2, 0x1000, 0x20, 0x100, 0, 0, 1, 0),
            },
        )
        report = deep_section_analysis.analyze_relocations(elf)
        self.assertEqual(report['entries'][0]['target_section'], '.rodata')


class InstructionLogNameTests(unittest.TestCase):
    def names(self, name):
        blob = (analyze.ROOT / 'evidence/original' / name / 'deployed.so').read_bytes()
        return set(analyze.instruction_log_names(blob, analyze.known_instruction_names(name)))

    def test_idl_names_do_not_absorb_adjacent_text(self):
        pump = self.names('pump')
        self.assertIn('Buy', pump)
        self.assertIn('UpdateBuybackConfig', pump)
        self.assertIn('IdlResizeAccount', pump)
        self.assertNotIn('BuyCreateV2Disabled', pump)
        self.assertNotIn('UpdateBuybackConfigAn', pump)
        self.assertNotIn('IdlResizeAccountdata', pump)

        amm = self.names('pump_amm')
        self.assertIn('ClaimCashback', amm)
        self.assertIn('IdlCreateAccount', amm)
        self.assertNotIn('ClaimCashbacksol', amm)
        self.assertNotIn('IdlCreateAccountanchor', amm)

        fees = self.names('pump_fees')
        self.assertIn('Withdraw', fees)
        self.assertIn('CrankDonationFeePda', fees)
        self.assertNotIn('Withdrawaccountsol', fees)
        self.assertNotIn('CrankDonationFeePdaFee', fees)

    def test_program_names_fall_back_to_captures(self):
        self.assertEqual(
            analyze.program_names(),
            ['pump', 'pump_amm', 'pump_fees', 'mayhem'],
        )

    def test_mayhem_fallback_is_unchanged(self):
        names = self.names('mayhem')
        self.assertEqual(len(names), 25)
        self.assertIn('Buy', names)
        self.assertIn('InitializeGlobalParams', names)


class EvidenceProgramBindingTests(unittest.TestCase):
    """A capture must carry the address of the folder that publishes it."""
    def setUp(self):
        self.tmp = pathlib.Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp)
        shutil.copytree(verify_evidence.ROOT / 'evidence', self.tmp / 'evidence')
        self.root = verify_evidence.ROOT
        self.expected = verify_evidence.EXPECTED_CAPTURES
        verify_evidence.ROOT = self.tmp
        verify_evidence.EXPECTED_CAPTURES = frozenset(
            p.parent.relative_to(self.tmp).as_posix()
            for p in (self.tmp / 'evidence').glob('**/capture.json'))
        self.addCleanup(setattr, verify_evidence, 'ROOT', self.root)
        self.addCleanup(setattr, verify_evidence, 'EXPECTED_CAPTURES', self.expected)

    def run_gate(self):
        with contextlib.redirect_stdout(io.StringIO()):
            verify_evidence.main()

    def test_control_pair_passes(self):
        self.run_gate()

    def test_swapped_captures_are_rejected(self):
        # Swap the whole folders: payloads and hashes stay self-consistent, so only
        # the program/folder binding can catch the exchange.
        original = self.tmp / 'evidence/original'
        (original / 'pump').rename(original / 'swap')
        (original / 'pump_amm').rename(original / 'pump')
        (original / 'swap').rename(original / 'pump_amm')
        with self.assertRaisesRegex(AssertionError, 'evidence/original/pump: capture program'):
            self.run_gate()


if __name__=='__main__': unittest.main()
