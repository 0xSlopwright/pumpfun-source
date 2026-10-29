import hashlib
import json
from pathlib import Path
import struct
import sys
from types import SimpleNamespace
import unittest
from unittest.mock import patch

import generate


def validate_captures():
    from window_elf_reader import Elf
    before, after = generate.reviewed_module(False), generate.reviewed_module()
    records = []
    for path in sorted((generate.ROOT / 'evidence').glob('**/deployed.so')):
        elf = Elf(path)
        at, wide, corrected, witness = elf.lo, 0, 0, None
        while at < elf.hi:
            old, step = before.decode_instruction(elf.b, at, elf)
            new, actual_step = after.decode_instruction(elf.b, at, elf)
            assert step == actual_step
            if elf.b[at] == 0x18:
                wide += 1
                # Independent oracle: reconstruct the two physical immediate words.
                expected = int.from_bytes(elf.b[at+4:at+8] + elf.b[at+12:at+16], 'little')
                assert new['imm64'] == expected
                if old['imm64'] != expected:
                    assert old['imm64'] == expected - (1 << 64)
                    corrected += 1
                    witness = witness or dict(offset=hex(at), raw=elf.b[at:at+16].hex(), before=old['imm64'], after=expected)
                    old['imm64'] = new['imm64']
                    old['mnemonic'] = new['mnemonic']
            assert old == new
            at += step
        assert at == elf.hi and corrected > 0
        records.append(dict(input=path.relative_to(generate.ROOT).as_posix(), sha256=hashlib.sha256(elf.b).hexdigest(), wide_instructions=wide, corrected_constants=corrected, witness=witness))
    assert len(records) == 9
    return records


class Tests(unittest.TestCase):
    def test_all_original_and_dependency_instructions(self):
        self.assertEqual(len(validate_captures()), 9)

    def test_unsigned_boundaries_and_negative_low_word(self):
        decoder = generate.reviewed_module()
        elf = SimpleNamespace(funcs=[], relocations={})
        for value in (0, 0x7fffffffffffffff, 0x8000000000000000, 0xffffffffffffffff, 0x01234567ffffffff):
            raw = struct.pack('<BBhI', 0x18, 3, 0, value & 0xffffffff) + struct.pack('<II', 0, value >> 32)
            row, size = decoder.decode_instruction(raw, 0, elf)
            self.assertEqual((row['imm64'], size), (value, 16))
            self.assertIn(f'{value:#018x}', row['mnemonic'])

    def test_unreviewed_source_rejected(self):
        with patch.object(Path, 'read_bytes', return_value=b'unreviewed'):
            with self.assertRaisesRegex(ValueError, 'source changed'):
                generate.reviewed_module()


if __name__ == '__main__':
    if len(sys.argv) == 3 and sys.argv[1] == '--receipt':
        generate.reviewed_module()
        records = validate_captures()
        Path(sys.argv[2]).write_text(json.dumps(dict(scope='Static immediate-bit decoding; no runtime or source-equivalence claim', programs=records), indent=2)+'\n', encoding='utf-8', newline='\n')
    else:
        generate.reviewed_module()
        unittest.main()
