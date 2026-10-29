"""Decode special operand forms in the captured SBPF v0 disassemblies."""
import argparse
import importlib.util
from pathlib import Path
import struct
import sys

ROOT = Path(__file__).resolve().parents[2]


def corrected_module():
    path = ROOT / 'research/deep-disassembly-relative-calls/generate.py'
    spec = importlib.util.spec_from_file_location('accepted_relative_decoder', path)
    base = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(base)
    module = base.corrected_module()
    original = module.decode_instruction

    def decode_instruction(data, offset, elf):
        row, size = original(data, offset, elf)
        if row is None or len(data) < 52 or data[:4] != b'\x7fELF' or struct.unpack_from('<I', data, 48)[0] != 0:
            return row, size
        opcode = data[offset]
        if opcode == 0x8d and 0 <= row['imm'] <= 10:
            row['mnemonic'] = f"callx r{row['imm']}"
            row['indirect_call_register'] = row['imm']
        elif opcode in (0x84, 0x87):
            row['mnemonic'] = f"{'neg32' if opcode == 0x84 else 'neg64'} r{row['dst']}"
        elif opcode in (0xd4, 0xdc):
            row['mnemonic'] = f"{'le' if opcode == 0xd4 else 'be'} r{row['dst']}, {row['imm']}"
        return row, size

    module.decode_instruction = decode_instruction
    return module


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program', required=True)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    if args.output.exists():
        parser.error('output already exists; preserve prior evidence')
    sys.exit(corrected_module().main())
