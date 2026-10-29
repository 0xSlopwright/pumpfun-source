import struct
from types import SimpleNamespace
import unittest

import generate


class SyscallSequenceTests(unittest.TestCase):
    def test_all_original_windows_retain_known_loader_bound_calls_in_order(self):
        module = generate.corrected_module()
        from window_elf_reader import Elf
        known = set(module.SYSCALL_NAMES.values())
        for program, expected_count in [('pump', 114), ('pump_amm', 83), ('mayhem', 104)]:
            elf = Elf(generate.ROOT / f'evidence/original/{program}/deployed.so')
            count = 0
            for start, end in zip(elf.entries, elf.entries[1:] + [elf.hi]):
                expected = [row['symbol'] for at, row in sorted(elf.relocations.items()) if start <= at < end and row['type'] == 10 and row['symbol'] in known and elf.b[at] == 0x85]
                result = module.fingerprint_window(elf, start, end)
                self.assertEqual(result['syscall_sequence'], expected)
                count += len(expected)
            self.assertEqual(count, expected_count)

    def test_direct_calls_relative_calls_and_other_relocation_controls(self):
        module = generate.corrected_module()
        instructions = [(0x85, 0x10, 0), (0x85, 0, 0xb6fc1a11), (0x85, 0x10, 0), (0x85, 0x10, 0), (0x07, 0, 0), (0x85, 0x10, 0)]
        data = b''.join(struct.pack('<BBhI', opcode, regs, 0, immediate) for opcode, regs, immediate in instructions)
        elf = SimpleNamespace(b=data, relocations={0: {'type': 10, 'symbol': 'sol_memcpy_'},
                              8: {'type': 10, 'symbol': 'sol_log_'},
                              24: {'type': 8, 'symbol': 'sol_log_'},
                              32: {'type': 10, 'symbol': 'sol_log_'},
                              40: {'type': 10, 'symbol': 'unrecognized_external'}})
        result = module.fingerprint_window(elf, 0, len(data))
        self.assertEqual(result['syscall_sequence'], ['sol_memcpy_', 'sol_log_'])
        elf.relocations = {}
        self.assertEqual(module.fingerprint_window(elf, 0, len(data))['syscall_sequence'], ['sol_log_'])


if __name__ == '__main__':
    unittest.main()
