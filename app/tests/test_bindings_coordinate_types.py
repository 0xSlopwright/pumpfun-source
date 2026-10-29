import importlib.util
from pathlib import Path
import unittest
spec = importlib.util.spec_from_file_location('bindings_coordinates', Path(__file__).resolve().parents[1] / 'scripts/verify-bindings.py')
bindings = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bindings)
class CoordinateTypes(unittest.TestCase):
    def test_boolean_coordinates_are_not_manifest_integer_offsets(self):
        for start, end in [(False, True), (False, 1), (0, True)]:
            with self.assertRaises((ValueError, AssertionError, SystemExit)):
                bindings.utf16_slice('abc', start, end)
    def test_real_utf16_offsets_keep_astral_boundaries(self):
        self.assertEqual(bindings.utf16_slice('a😀b', 1, 3), '😀')
        self.assertEqual(bindings.utf16_slice('abc', 0, 1), 'a')
        with self.assertRaises(UnicodeError): bindings.utf16_slice('a😀b', 1, 2)
