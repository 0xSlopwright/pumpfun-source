import struct
from types import SimpleNamespace
import unittest

import generate


class SpecialOperandTests(unittest.TestCase):
    def test_all_real_special_forms(self):
        module = generate.corrected_module()
        from window_elf_reader import Elf
        for program, expected in [('pump', (144, 25, 0)), ('pump_amm', (123, 24, 0)), ('mayhem', (93, 30, 8))]:
            with self.subTest(program=program):
                elf = Elf(generate.ROOT / f'evidence/original/{program}/deployed.so')
                self.assertEqual(struct.unpack_from('<I', elf.b, 48)[0], 0)
                counts = [0, 0, 0]
                at = elf.lo
                while at < elf.hi:
                    row, size = module.decode_instruction(elf.b, at, elf)
                    opcode = elf.b[at]
                    if opcode == 0x8d:
                        counts[0] += 1
                        self.assertEqual(row['mnemonic'], f"callx r{row['imm']}")
                        self.assertEqual(row['indirect_call_register'], row['imm'])
                        self.assertNotIn('call_target', row)
                        self.assertNotIn('syscall', row)
                    elif opcode == 0x87:
                        counts[1] += 1
                        self.assertEqual(row['mnemonic'], f"neg64 r{row['dst']}")
                    elif opcode == 0xdc:
                        counts[2] += 1
                        self.assertEqual(row['mnemonic'], f"be r{row['dst']}, {row['imm']}")
                    self.assertEqual(row['hex'], elf.b[at:at+size].hex())
                    at += size
                self.assertEqual(tuple(counts), expected)

    def test_operand_controls_and_unsupported_version(self):
        decoder = generate.corrected_module().decode_instruction
        elf = SimpleNamespace(funcs=[], relocations={})
        for opcode, regs, imm, expected in [(0x84, 3, 0, 'neg32 r3'), (0x87, 3, 0, 'neg64 r3'), (0xd4, 5, 32, 'le r5, 32'), (0xdc, 5, 16, 'be r5, 16'), (0xdc, 5, 64, 'be r5, 64'), (0x8d, 0, 10, 'callx r10'), (0x0f, 0x21, 0, 'add64 r1, r2')]:
            data = bytearray(72)
            data[:4] = b'\x7fELF'
            data[64:] = struct.pack('<BBhi', opcode, regs, 0, imm)
            row, _ = decoder(data, 64, elf)
            self.assertEqual(row['mnemonic'], expected)
        for flags, register in [(0, 11), (32, 2)]:
            data = bytearray(72)
            data[:4] = b'\x7fELF'
            struct.pack_into('<I', data, 48, flags)
            data[64:] = struct.pack('<BBhi', 0x8d, 0, 0, register)
            row, _ = decoder(data, 64, elf)
            self.assertTrue(row['mnemonic'].startswith('raw_'))
            self.assertNotIn('indirect_call_register', row)


if __name__ == '__main__':
    unittest.main()
