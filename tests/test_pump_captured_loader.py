"""Real LiteSVM account checks for the captured-loader byte-copy optimization."""
from pathlib import Path
import hashlib
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import pump_captured_loader as loader


class CapturedLoaderTests(unittest.TestCase):
    def setUp(self):
        loader._programdata_image.cache_clear()
        loader.LOADS.clear()

    def test_real_elf_cache_keeps_each_loaded_account_exact(self):
        vm = loader.CapturedLiteSVM()
        paths = [ROOT / 'evidence/original/pump/deployed.so',
                 ROOT / 'evidence/original/pump_fees/deployed.so',
                 ROOT / 'evidence/original/pump/deployed.so']
        for path in paths:
            raw = path.read_bytes()
            vm.add_program_from_file(loader.PROGRAM, path)
            expected = loader.HEADER + raw + bytes(loader.CAPTURE['payload_bytes'] - len(raw))
            actual = vm.get_account(loader.PROGRAMDATA).data
            self.assertEqual(actual, expected)
            receipt = loader.LOADS[-1]
            self.assertEqual(receipt['elf_sha256'], hashlib.sha256(raw).hexdigest())
            self.assertEqual(receipt['programdata_sha256'], hashlib.sha256(actual).hexdigest())
            self.assertTrue(receipt['elf_prefix_unchanged'])
            self.assertTrue(receipt['zero_allocation_tail'])
        info = loader._programdata_image.cache_info()
        self.assertEqual((info.hits, info.misses, info.currsize, info.maxsize), (1, 2, 2, 2))

    def test_cached_image_does_not_hide_nonzero_account_tail(self):
        raw = (ROOT / 'evidence/original/pump/deployed.so').read_bytes()
        loader._programdata_image(raw)

        class CorruptReadVM(loader.CapturedLiteSVM):
            def get_account(self, address):
                account = super().get_account(address)
                if address == loader.PROGRAMDATA and account is not None:
                    bad = bytearray(account.data)
                    bad[-1] = 1
                    return loader.Account(account.lamports, bytes(bad), account.owner, account.executable)
                return account

        with self.assertRaises(AssertionError):
            CorruptReadVM().add_program(loader.PROGRAM, raw)
        self.assertEqual(loader.LOADS, [])

    def test_expected_image_cache_is_bounded(self):
        for raw in [b'a', b'b', b'c']:
            image, tail = loader._programdata_image(raw)
            self.assertEqual(image, loader.HEADER + raw + tail)
            self.assertEqual(tail, bytes(loader.CAPTURE['payload_bytes'] - len(raw)))
        self.assertEqual(loader._programdata_image.cache_info().currsize, 2)

    def test_oversized_image_is_rejected(self):
        with self.assertRaises(AssertionError):
            loader._programdata_image(bytes(loader.CAPTURE['payload_bytes'] + 1))


if __name__ == '__main__':
    unittest.main()
