from pathlib import Path
import json, shutil, tempfile, unittest
import proof
ROOT = Path(__file__).resolve().parents[2]

class MutationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        old = proof.prior(ROOT); cls.original, cls.candidate = old.images(ROOT)
        cls.report = proof.inspect(ROOT, cls.original, cls.candidate)
        cls.bundle = old.prior(ROOT).images(ROOT, cls.original, cls.candidate)

    def test_each_payload_pointer_length_and_call(self):
        for row in self.report['observations']:
            expected = bytes.fromhex(row['original']['bytes_hex'])
            for side in ('original', 'candidate'):
                image = self.bundle[side+'_elf']; window = self.bundle[side+'_windows'][row[side+'_owner']]
                info = row[side]; section = next(s for s in image.sections if s['name']=='.rodata')
                at = section['offset'] + info['pointer'] - section['address']; pc = window['start'] + info['pointer_offset']
                for pos in list(range(at,at+len(expected))) + [pc+4,pc+20,pc+24,pc+28]:
                    original = image.b; changed = bytearray(original); changed[pos] ^= 1; image.b = bytes(changed)
                    try:
                        with self.assertRaises((AssertionError, KeyError, IndexError)): proof.trace(image,window,info['pointer_offset'],expected)
                    finally: image.b = original

    def test_coverage_mutation(self):
        with tempfile.TemporaryDirectory() as tmp:
            packet = Path(tmp)/'packet'; shutil.copytree(Path(__file__).resolve().parent,packet)
            data = json.loads((packet/'coverage-delta.json').read_bytes()); data['new_payload_bytes'] += 1
            (packet/'coverage-delta.json').write_text(json.dumps(data))
            with self.assertRaises(AssertionError): proof.check(packet,ROOT)

if __name__ == '__main__': unittest.main()
