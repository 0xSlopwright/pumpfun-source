"""Require a discriminator comparison to actually read the loaded register."""
import argparse
import hashlib
from pathlib import Path
import sys
import types

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'scripts/deep_section_analysis.py'
REVIEWED={'805379ab5b529f77fd9207155f3bf0f19442a818749d3a55152f83007b861310',
          'a35097bc16fdc9a9f051b00671c523136d7d3a17467de33806f95cec707f54d4'}


def comparison_reads_register(data, at, register):
    opcode=data[at]
    dst,src=data[at+1]&15,data[at+1]>>4
    return (opcode in (0x15,0x55) and dst==register) or (opcode in (0x1d,0x5d) and register in (dst,src))


def reviewed_module(correct=True):
    raw=SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in REVIEWED:
        raise ValueError('Reviewed section analyzer changed')
    text=raw.decode('utf-8')
    before='if b[next_off] in (0x1d, 0x5d, 0x15, 0x55):'
    if text.count(before)!=1:
        raise ValueError('Discriminator comparison adaptation is not unique')
    if correct:
        text=text.replace(before,'if comparison_reads_register(b, next_off, b[offset + 1] & 15):')
    sys.path.insert(0,str(ROOT/'scripts'))
    module=types.ModuleType('reviewed_idl_comparison')
    module.__file__=str(SOURCE)
    module.comparison_reads_register=comparison_reads_register
    exec(compile(text,str(SOURCE),'exec'),module.__dict__)
    return module


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program',choices=['pump','pump_amm','mayhem'],required=True)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    if args.output.exists():parser.error('output exists; preserve prior evidence')
    sys.exit(reviewed_module().main())
