from pathlib import Path
import json, shutil, tempfile, unittest
import proof
ROOT=Path(__file__).resolve().parents[2]

class Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original,cls.candidate=proof.images(ROOT)
        cls.report=proof.inspect(ROOT,cls.original,cls.candidate)
        cls.helper=proof.panic(ROOT)
    def test_each_byte_and_instruction(self):
        for row in self.report['sites']:
            for side in ('original','candidate'):
                _,a,b=self.helper.images(ROOT,self.original,self.candidate)
                image=a if side=='original' else b
                pc=row[side+'_pc']; ptr=row[side+'_ptr']; n=row['length']
                section=next(s for s in image.sections if s['name']=='.rodata')
                pos=section['offset']+ptr-section['address']; saved=image.b
                for loc in list(range(pos,pos+n))+[pc,pc+1,pc+4,pc+12,pc+16,pc+17,pc+20]:
                    data=bytearray(saved); data[loc]^=1; image.b=bytes(data)
                    with self.subTest(side=side,pc=pc,location=loc):
                        try:
                            self.helper.text_site(image,pc,ptr,n,row['length_register'])
                            assert image.b[pc+1] == (1 if row['original_pc']==645800 else 2)
                            assert self.helper.rodata_bytes(image,ptr,n)==row['text'].encode()
                        except AssertionError: pass
                        else: self.fail('变异未被发现')
                image.b=saved
    def test_coverage_and_inventory(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as t:
            packet=Path(t)/'packet'; shutil.copytree(Path(__file__).resolve().parent,packet)
            d=json.loads((packet/'coverage-delta.json').read_bytes()); d['new_payload_bytes']+=1
            (packet/'coverage-delta.json').write_text(json.dumps(d))
            (packet/'manifest.json').write_text(json.dumps(proof.inventory(packet)))
            with self.assertRaises(AssertionError): proof.check(packet,ROOT)
    def test_no_baseline_overlap(self):
        d=proof.delta(ROOT,self.report)
        self.assertEqual(d['baseline_payload_bytes'],21451)
        self.assertEqual(d['new_payload_bytes'],183)
        self.assertEqual(len(self.report['sites']),10)
        baseline = json.loads((ROOT / proof.MERGED[1] / 'coverage-delta.json').read_bytes())
        before = {n for section in baseline['sections'] for a,b in section['covered_intervals'] for n in range(a,b)}
        after = {n for section in d['sections'] for a,b in section['covered_intervals'] for n in range(a,b)}
        self.assertTrue(before <= after)
        self.assertEqual(len(after - before),183)
        self.assertEqual(len(after),21634)

if __name__=='__main__': unittest.main()
