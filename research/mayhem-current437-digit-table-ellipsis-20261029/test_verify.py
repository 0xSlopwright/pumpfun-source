"""Mutation controls for digit-table / ellipsis / early-crumb claims."""
from pathlib import Path
import copy, gzip, json, os, shutil, struct, tempfile, unittest
import proof
P = Path(__file__).resolve().parent
R = next(parent for parent in P.parents if (parent / 'evidence/original/mayhem/deployed.so').is_file())


class DigitTableEllipsis(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original = (R / 'evidence/original/mayhem/deployed.so').read_bytes()
        cls.candidate = proof.candidate_bytes(R)
        cls.prefix, cls.original_elf, cls.candidate_elf = proof.images(R, cls.original, cls.candidate)
        cls.report = proof.verify_images(cls.original_elf, cls.candidate_elf)
        cls.strings = cls.report['strings']
        cls.text_sites = cls.report['text_sites']
        cls.digit = cls.report['digit_table']

    def elf(self, blob):
        image = copy.copy(self.candidate_elf)
        image.b = bytes(blob)
        return image

    def file_offset(self, address):
        section = next(
            section for section in self.candidate_elf.sections
            if section['type'] != 8 and section['address'] <= address < section['address'] + section['size']
        )
        return section['offset'] + address - section['address']

    def mutated_string(self, row, index):
        blob = bytearray(self.candidate)
        blob[self.file_offset(row['candidate_ptr']) + index] ^= 1
        return self.elf(blob)

    def mutated_digit(self, index):
        blob = bytearray(self.candidate)
        blob[self.file_offset(self.digit['candidate_ptr']) + index] ^= 1
        return self.elf(blob)

    def mutated_text(self, row):
        blob = bytearray(self.candidate)
        struct.pack_into(
            '<i',
            blob,
            self.file_offset(row['candidate_pc']) + row['length_at'] + 4,
            row['length'] + 1,
        )
        return self.elf(blob)

    def mutated_index_mask(self, row):
        blob = bytearray(self.candidate)
        pc = row['candidate_pc']
        # Flip the and-mask immediate in the 96 bytes before lddw.
        found = False
        for delta in range(8, 96, 8):
            at = self.file_offset(pc - delta)
            op, regs, off, imm = struct.unpack_from('<BBhi', blob, at)
            if op == 0x57 and imm == row['and_mask']:
                struct.pack_into('<i', blob, at + 4, imm ^ 2)
                found = True
                break
        self.assertTrue(found)
        return self.elf(blob)

    def test_complete(self):
        summary = proof.check(P, R)
        self.assertEqual(
            (summary['normalized_windows'], summary['raw_windows'], summary['extended_windows'], summary['extended_pairs']),
            (437, 141, 431, 581),
        )
        self.assertEqual(
            (summary['string_count'], summary['descriptor_count'], summary['text_site_count'], summary['index_site_count']),
            (2, 0, 2, 4),
        )
        self.assertEqual(
            (summary['literal_bytes'], summary['descriptor_bytes'], summary['new_payload_bytes'], summary['rejected_pairs']),
            (208, 0, 208, 0),
        )

    def test_every_string_byte(self):
        for row in self.strings:
            expected = row['text'].encode().hex()
            self.assertEqual(row['original_bytes_hex'], expected)
            self.assertEqual(row['candidate_bytes_hex'], expected)
            for index in range(row['length']):
                with self.subTest(index=row['index'], byte=index):
                    with self.assertRaises(AssertionError):
                        proof.verify_images(self.original_elf, self.mutated_string(row, index))

    def test_every_digit_table_byte(self):
        self.assertEqual(self.digit['original_bytes_hex'], proof.DIGIT_TABLE.hex())
        for index in (0, 1, 50, 51, 198, 199):
            with self.subTest(byte=index):
                with self.assertRaises(AssertionError):
                    proof.verify_images(self.original_elf, self.mutated_digit(index))

    def test_every_text_length_immediate(self):
        for row in self.text_sites:
            with self.subTest(pc=row['original_pc']):
                with self.assertRaises(AssertionError):
                    proof.verify_images(self.original_elf, self.mutated_text(row))

    def test_every_index_mask(self):
        for row in self.digit['index_sites']:
            with self.subTest(pc=row['original_pc']):
                with self.assertRaises(AssertionError):
                    proof.verify_images(self.original_elf, self.mutated_index_mask(row))

    def test_actual_register_and_load_chains(self):
        for label,image in [('original',self.original_elf),('candidate',self.candidate_elf)]:
            for j,(op,cp,mask)in enumerate(proof.INDEX_SITES):
                pc=op if label=='original'else cp
                for delta,kind in [(-24,'register'),(16,'register'),(24 if j==0 else 40,'load')]:
                    mutated=copy.copy(image);blob=bytearray(image.b)
                    if kind=='register':blob[pc+delta+1]^=0x10
                    else:struct.pack_into('<h',blob,pc+delta+2,201)
                    mutated.b=bytes(blob)
                    with self.subTest(image=label,site=j,delta=delta):
                        with self.assertRaises(AssertionError):proof.index_site(mutated,pc,proof.DIGIT_ORIGINAL if label=='original'else proof.DIGIT_CANDIDATE,mask)
            for j,(op,cp,ptr,cptr,length,reg,length_at)in enumerate(proof.TEXT_SITES):
                pc=op if label=='original'else cp
                for kind in ['pointer','clobber']:
                    mutated=copy.copy(image);blob=bytearray(image.b)
                    if kind=='pointer':blob[pc+1]^=1
                    elif j==0:blob[pc+17]=(blob[pc+17]&0xf0)|2
                    else:blob[pc+17]^=1
                    mutated.b=bytes(blob)
                    with self.subTest(image=label,text=j,kind=kind):
                        with self.assertRaises(AssertionError):proof.text_site(mutated,pc,ptr if label=='original'else cptr,length,reg,length_at)

    def test_following_byte_is_not_absorbed(self):
        # Ellipsis end sits at the rust-panic boundary; mutate the following covered byte.
        end = self.digit['candidate_ptr'] + self.digit['length'] + 5  # after [...]
        # Prefer a hole inside still-open early crumbs on the candidate image.
        early_end = 703884  # start of claimed early crumb on candidate
        probe = early_end - 1
        blob = bytearray(self.candidate)
        blob[self.file_offset(probe)] ^= 1
        self.assertEqual(proof.verify_images(self.original_elf, self.elf(blob)), self.report)

    def copied(self, change, reseal=False):
        with tempfile.TemporaryDirectory() as temporary:
            packet = Path(temporary) / 'packet'
            shutil.copytree(P, packet, ignore=shutil.ignore_patterns('__pycache__'))
            change(packet)
            if reseal:
                inventory = {
                    str(path.relative_to(packet)): proof.sha(path.read_bytes())
                    for path in packet.rglob('*')
                    if path.is_file() and path != packet / 'manifest.json' and '__pycache__' not in path.parts
                }
                (packet / 'manifest.json').write_text(json.dumps(inventory, indent=2) + '\n')
            with self.assertRaises((AssertionError, ValueError)):
                proof.check(packet, R)

    def test_unlisted_file(self):
        self.copied(lambda packet: (packet / 'extra').write_bytes(b'x'))

    def test_symlink(self):
        self.copied(lambda packet: (packet / 'alias').symlink_to('inputs.json'))

    def test_fifo(self):
        self.copied(lambda packet: os.mkfifo(packet / 'pipe'))

    def test_resealed_report(self):
        def change(packet):
            report = json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes()))
            report['observations']['strings'][0]['candidate_ptr'] += 1
            (packet / 'observations.json.gz').write_bytes(
                gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0)
            )
        self.copied(change, True)

    def test_resealed_coverage(self):
        def change(packet):
            delta = json.loads((packet / 'coverage-delta.json').read_bytes())
            delta['new_payload_bytes'] += 1
            (packet / 'coverage-delta.json').write_text(json.dumps(delta))
        self.copied(change, True)


if __name__ == '__main__':
    unittest.main(verbosity=2)
