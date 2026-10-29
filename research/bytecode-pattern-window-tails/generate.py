"""Preserve complete tail instructions in the archived bytecode-pattern analysis."""
import argparse
import hashlib
from pathlib import Path
import sys
import types

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'scripts/bytecode_signatures.py'
SOURCE_SHA256={'c9aad66270f0fd36382fa4fd8dbea3eddf3f399b7d8bb2e4481e19f8850c6136',
               '8200e01f582be1a267d187e6340ac2d403c22cad26bfd65e2613e19ea8a55f76'}
CHANGES={
    'while offset < end - 24:':'while offset + 8 <= end:',
    'if start <= branch_target < end:':'if start <= branch_target and branch_target + 8 <= end:',
    'for offset in range(start, end - 16, 8):':'for offset in range(start, end - 7, 8):',
    '"likely_serialization": max_sequential >= 4 or memcpy_count >= 2,':'"likely_serialization": max(max_sequential, current_run) >= 4 or memcpy_count >= 2,',
}


def corrected_module():
    raw=SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in SOURCE_SHA256:
        raise ValueError('The reviewed bytecode-pattern source has changed')
    source=raw.decode('utf-8')
    for before,after in CHANGES.items():
        if source.count(before)!=1:raise ValueError('Pattern-bound adaptation is no longer unique')
        source=source.replace(before,after)
    sys.path.insert(0,str(ROOT/'scripts'))
    module=types.ModuleType('reviewed_pattern_tails')
    module.__file__=str(SOURCE)
    exec(compile(source,str(SOURCE),'exec'),module.__dict__)
    return module


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    if args.output.exists():parser.error('output already exists; preserve prior evidence')
    corrected_module().main()
