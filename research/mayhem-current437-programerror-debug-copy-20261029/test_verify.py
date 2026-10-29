from pathlib import Path
import unittest
import proof

ROOT = Path(__file__).resolve().parents[2]

class MutationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.old = proof.prior(ROOT)
        original, candidate = proof.images(ROOT)
        cls.report = proof.inspect(ROOT, original, candidate)
        cls.bundle = cls.old.images(ROOT, original, candidate)

    def test_each_counted_byte_pointer_and_length(self):
        for row in self.report['observations']:
            for side in ('original', 'candidate'):
                image = self.bundle[side+'_elf']
                windows = self.bundle[side+'_windows']
                window = windows[row[side+'_owner']]
                expected = row[side]
                original = image.b
                section = next(s for s in image.sections if s['name']=='.rodata')
                payload_at = section['offset'] + expected['pointer'] - section['address']
                locations = list(range(payload_at, payload_at + expected['length'])) + [window['start'] + expected['pointer_offset'] + 4, window['start'] + expected['length_offset'] + 4]
                for at in locations:
                    data = bytearray(original); data[at] ^= 1; image.b = bytes(data)
                    try:
                        changed = self.old.trace(image, window, row['tag'])
                    except (AssertionError, KeyError, IndexError):
                        changed = None
                    finally:
                        image.b = original
                    self.assertTrue(changed is None or changed['bytes_hex'] != row['name'].encode().hex() or changed['length'] != len(row['name']))

    def test_excluded_tags(self):
        b = self.bundle
        for tag in (0, 26):
            with self.assertRaises(AssertionError): self.old.trace(b['original_elf'], b['original_windows'][proof.OWNER], tag)

    def test_coverage_and_inventory_mutation(self):
        import tempfile, shutil, json
        with tempfile.TemporaryDirectory() as t:
            p = Path(t)/'packet'; shutil.copytree(Path(__file__).resolve().parent, p)
            data = json.loads((p/'coverage-delta.json').read_bytes()); data['new_payload_bytes'] += 1
            (p/'coverage-delta.json').write_text(json.dumps(data))
            with self.assertRaises(AssertionError): proof.check(p, ROOT)

if __name__ == '__main__': unittest.main()
