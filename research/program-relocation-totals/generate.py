"""Count whole-ELF relocations separately from relocations in text windows."""
import argparse
import hashlib
from pathlib import Path
import sys
import types

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'scripts/analyze_program.py'
REVIEWED={'b6e945c08aac13ebd5c4411b9f7ce21fecd8daf6753eb432769189b96a820e5a',
          '149d5d3dd0a9765f0da71abcdda42169d4e06ee0ed1bd64e355b8d3978aa8969'}


def reviewed_module(correct=True):
    raw=SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in REVIEWED:raise ValueError('Reviewed program analyzer changed')
    text=raw.decode('utf-8')
    changes={
        '"total_relocations": sum(w["relocations"] for w in windows),':'"total_relocations": len(elf.relocations),\n        "text_window_relocations": sum(w["relocations"] for w in windows),',
        '| Total relocations | {sum(w["relocations"] for w in windows)} |':'| Total ELF relocations | {len(elf.relocations)} |\n| Text-window relocations | {sum(w["relocations"] for w in windows)} |',
    }
    for before,after in changes.items():
        if text.count(before)!=1:raise ValueError('Relocation-total adaptation is not unique')
        if correct:text=text.replace(before,after)
    sys.path.insert(0,str(ROOT/'scripts'))
    module=types.ModuleType('reviewed_program_relocation_totals');module.__file__=str(SOURCE)
    exec(compile(text,str(SOURCE),'exec'),module.__dict__)
    return module


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program',choices=['pump','pump_amm','pump_fees','mayhem'],required=True)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    if args.output.exists():parser.error('output exists; preserve prior evidence')
    sys.exit(reviewed_module().analyze_program(args.program,args.output))
