import hashlib
import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
import analyze


def compare():
    baseline = analyze.archived()
    from window_elf_reader import Elf
    receipts = []
    for name, path in analyze.input_paths().items():
        elf = Elf(path)
        old = baseline.analyze_math_patterns(elf)
        new = analyze.analyze(elf)
        shifts, densities, witness = 0, 0, None
        for before, after in zip(old['math_intensive_windows'], new['math_intensive_windows'], strict=True):
            start = int(after['address'], 16)
            # Independent physical-slot count: LDDW consumes one extra slot.
            slots = list(range(start, start + after['size'], 8))
            count = len(slots) - sum(elf.b[at] == 0x18 for at in slots)
            assert after['instruction_count'] == count
            assert after['instruction_slots'] == len(slots)
            assert after['shifts'] == sum(elf.b[at] in (0x67,0x6f,0x77,0x7f,0xc7,0xcf) for at in slots)
            shifts += after['shifts'] - before['shifts']
            if after['arithmetic_density'] != before['arithmetic_density']:
                densities += 1
            if after['shifts'] != before['shifts'] or after['arithmetic_density'] != before['arithmetic_density']:
                witness = witness or dict(window=after['address'], before=before.copy(), after=after.copy())
            for field in ('shifts', 'arithmetic_density'):
                before[field] = after[field]
            for field in ('instruction_count', 'instruction_slots'):
                before[field] = after[field]
        assert old == new
        receipts.append(dict(program=name,input_sha256=hashlib.sha256(elf.b).hexdigest(),added_signed_shifts=shifts,corrected_densities=densities,witness=witness))
    assert len(receipts) == 9
    return receipts


class Tests(unittest.TestCase):
    def test_all_nine_real_inputs(self):
        rows = compare()
        self.assertGreater(sum(r['added_signed_shifts'] for r in rows), 0)
        self.assertGreater(sum(r['corrected_densities'] for r in rows), 0)

    def test_complete_instruction_boundaries(self):
        self.assertEqual(list(analyze.instructions(bytes([0x18])+bytes(15)+bytes([0x95])+bytes(7),0,24)),[0,16])
        with self.assertRaisesRegex(ValueError,'Incomplete'):
            list(analyze.instructions(bytes([0x18])+bytes(7),0,8))

    def test_source_drift(self):
        with patch.object(Path,'read_bytes',return_value=b'changed'):
            with self.assertRaisesRegex(ValueError,'analyzer changed'):
                analyze.archived()


if __name__ == '__main__':
    if len(sys.argv)==3 and sys.argv[1]=='--receipt':
        Path(sys.argv[2]).write_text(json.dumps(compare(),indent=2)+'\n',encoding='utf-8',newline='\n')
    else:
        unittest.main()
