"""Reviewed successor for relative-call decoding; leaves archived helpers intact."""
import argparse
import hashlib
from pathlib import Path
import sys
import types

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/deep_disassembly.py'
SOURCE_SHA256 = {
    'e0241c00f43218f15a127ded6c6e5398811faa38d7b6fcd8f875029135db0ceb',  # Git/LF
    'bcc2c08b7f6e800ea484b81fc188324c89ca5f197d55815e98efa89beaca6c8e',  # CRLF checkout
}


def corrected_module():
    raw = SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in SOURCE_SHA256:
        raise ValueError('The reviewed disassembler source has changed')
    before = 'if src_reg == 0x10:'
    after = 'if src_reg == 1 and elf.relocations.get(offset, {}).get("type") != 10:'
    source = raw.decode('utf-8')
    if source.count(before) != 1:
        raise ValueError('Relative-call adaptation is no longer unique')
    sys.path.insert(0, str(ROOT / 'scripts'))
    module = types.ModuleType('reviewed_deep_disassembly')
    module.__file__ = str(SOURCE)
    exec(compile(source.replace(before, after), str(SOURCE), 'exec'), module.__dict__)
    return module


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program', choices=['pump', 'pump_amm', 'mayhem'], required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.output.exists():
        parser.error('output already exists; preserve prior evidence')
    sys.exit(corrected_module().main())
