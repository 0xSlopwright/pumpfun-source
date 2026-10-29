"""Retain every bounded entry scalar/call candidate instead of last-write wins."""
import argparse
from collections import defaultdict
import hashlib
import json
from pathlib import Path
import struct
import sys
import types

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'scripts/deep_disassembly.py'
REVIEWED={'e0241c00f43218f15a127ded6c6e5398811faa38d7b6fcd8f875029135db0ceb',
          'bcc2c08b7f6e800ea484b81fc188324c89ca5f197d55815e98efa89beaca6c8e'}
PRESERVES_SCALAR={0x05,0x15,0x1d,0x25,0x55,0x5d,0xb7,0xbf,0x79,0x61,0x71}


def archived():
    raw=SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in REVIEWED:raise ValueError('Reviewed disassembler changed')
    sys.path.insert(0,str(ROOT/'scripts'))
    module=types.ModuleType('reviewed_entry_candidates');module.__file__=str(SOURCE)
    exec(compile(raw.decode('utf-8'),str(SOURCE),'exec'),module.__dict__)
    return module


def recover(elf,include_external=False):
    archived()
    entry=struct.unpack_from('<Q',elf.b,24)[0]
    groups=defaultdict(list)
    if not elf.lo<=entry<elf.hi:return {}
    at,end,previous=entry,min(entry+4000,elf.hi),None
    while at+8<=end:
        opcode=elf.b[at]
        if opcode==0x18:
            if at+16>end:break
            value=int.from_bytes(elf.b[at+4:at+8]+elf.b[at+12:at+16],'little')
            previous=(value,at)
            at+=16
            continue
        if opcode==0x85 and elf.b[at+1]==0x10:
            external=elf.relocations.get(at,{}).get('type')==10
            if previous is not None and (include_external or not external):
                value,load_at=previous
                target=at+8+struct.unpack_from('<i',elf.b,at+4)[0]*8
                name=next((f['name'] for f in elf.funcs if f['start']==target),None)
                groups[hex(value)].append(dict(scalar=hex(value),load_address=hex(load_at),call_address=hex(at),
                    target_address=hex(target),target_name=name,load_raw=elf.b[load_at:load_at+16].hex(),
                    call_raw=elf.b[at:at+8].hex(),relocated_external=external))
            previous=None
        elif opcode not in PRESERVES_SCALAR:previous=None
        at+=8
    return dict(groups)


def inputs():return {p.parent.name:p for p in sorted((ROOT/'evidence').glob('**/deployed.so'))}


if __name__=='__main__':
    archived()
    from window_elf_reader import Elf
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program',choices=sorted(inputs()),required=True)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args();path=inputs()[args.program];elf=Elf(path)
    groups=recover(elf)
    payload=json.dumps(dict(scope='Bounded scalar/call adjacency candidates; no selector/dataflow qualification',
        scan_bytes=4000,candidates=groups,proves_anchor_dispatch=False),indent=2).encode('utf-8')+b'\n'
    args.output.mkdir(parents=True,exist_ok=False)
    (args.output/'entry-call-candidates.json').write_bytes(payload)
    manifest=dict(input=path.relative_to(ROOT).as_posix(),input_sha256=hashlib.sha256(elf.b).hexdigest(),
        helper_sha256=hashlib.sha256(SOURCE.read_bytes()).hexdigest(),generator_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        output_sha256=hashlib.sha256(payload).hexdigest())
    (args.output/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(f"{args.program}: {sum(map(len,groups.values()))} call-site candidates under {len(groups)} scalar keys")
