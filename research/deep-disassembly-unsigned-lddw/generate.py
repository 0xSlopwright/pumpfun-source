"""Reviewed unsigned LDDW successor; original captures and helper stay intact."""
import argparse
import hashlib
from pathlib import Path
import sys
import types

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/deep_disassembly.py'
SOURCE_SHA256 = {
    'e0241c00f43218f15a127ded6c6e5398811faa38d7b6fcd8f875029135db0ceb',
    'bcc2c08b7f6e800ea484b81fc188324c89ca5f197d55815e98efa89beaca6c8e',
}


def reviewed_module(corrected=True):
    raw = SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in SOURCE_SHA256:
        raise ValueError('Reviewed disassembler source changed')
    source = raw.decode('utf-8')
    before = 'imm2 = struct.unpack_from("<i", b, offset + 12)[0]'
    if source.count(before) != 1:
        raise ValueError('LDDW high-word adaptation is not unique')
    if corrected:
        source = source.replace(before, 'imm2 = struct.unpack_from("<I", b, offset + 12)[0]')
    sys.path.insert(0, str(ROOT / 'scripts'))
    module = types.ModuleType('reviewed_unsigned_lddw')
    module.__file__ = str(SOURCE)
    exec(compile(source, str(SOURCE), 'exec'), module.__dict__)
    return module


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program', choices=['pump', 'pump_amm', 'mayhem'], required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.output.exists():
        parser.error('output exists; preserve prior evidence')
    sys.exit(reviewed_module().main())
