"""Keep known relocation-bound syscall names in static sequence fingerprints."""
import argparse
import importlib.util
from pathlib import Path
import struct
import sys

ROOT = Path(__file__).resolve().parents[2]


def corrected_module():
    path = ROOT / 'research/deep-disassembly-relative-calls/generate.py'
    spec = importlib.util.spec_from_file_location('accepted_relative_fingerprints', path)
    base = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(base)
    module = base.corrected_module()
    original = module.fingerprint_window
    known_names = frozenset(module.SYSCALL_NAMES.values())

    def fingerprint_window(elf, start, end):
        result = original(elf, start, end)
        sequence = []
        for at in range(start, end - 7, 8):
            if elf.b[at] != 0x85:
                continue
            relocation = elf.relocations.get(at, {})
            name = relocation.get('symbol')
            if relocation.get('type') == 10 and name in known_names:
                sequence.append(name)
            elif elf.b[at + 1] == 0:
                immediate = struct.unpack_from('<I', elf.b, at + 4)[0]
                sequence.append(module.SYSCALL_NAMES.get(immediate, f'unknown_{immediate:#x}'))
        result['syscall_sequence'] = sequence
        return result

    module.fingerprint_window = fingerprint_window
    return module


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program', required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.output.exists():
        parser.error('output already exists; preserve prior evidence')
    sys.exit(corrected_module().main())
