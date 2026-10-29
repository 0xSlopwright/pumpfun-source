"""Recognize relocation-bound CPI/memcpy calls without editing archived helpers."""
import argparse
import hashlib
from pathlib import Path
import struct
import sys
import types

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'scripts/bytecode_signatures.py'
SOURCE_SHA256={'c9aad66270f0fd36382fa4fd8dbea3eddf3f399b7d8bb2e4481e19f8850c6136',
               '8200e01f582be1a267d187e6340ac2d403c22cad26bfd65e2613e19ea8a55f76'}
CPI_NAMES={'sol_invoke_signed_rust','sol_invoke_signed_c'}


def corrected_module():
    raw=SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in SOURCE_SHA256:
        raise ValueError('The reviewed bytecode-pattern source has changed')
    sys.path.insert(0,str(ROOT/'scripts'))
    module=types.ModuleType('reviewed_relocated_syscalls')
    module.__file__=str(SOURCE)
    exec(compile(raw,str(SOURCE),'exec'),module.__dict__)
    original_cpi=module.detect_cpi_patterns
    original_serialization=module.detect_serialization_patterns

    def relocated_name(elf,at):
        relocation=elf.relocations.get(at,{})
        if elf.b[at]==0x85 and relocation.get('type')==10:
            return relocation.get('symbol')
        return None

    def detect_cpi_patterns(elf,start,end):
        result=original_cpi(elf,start,end)
        seen={row['offset'] for row in result}
        for at in range(start,end-7,8):
            name=relocated_name(elf,at)
            if name not in CPI_NAMES or at-start in seen:continue
            stores=sum(elf.b[scan] in (0x63,0x6b,0x73,0x7b) for scan in range(at-8,max(start-1,at-200),-8))
            result.append({'offset':at-start,'syscall':name,'setup_stores':stores})
        return sorted(result,key=lambda row:row['offset'])

    def detect_serialization_patterns(elf,start,end):
        result=original_serialization(elf,start,end)
        for at in range(start,end-7,8):
            if relocated_name(elf,at)!='sol_memcpy_':continue
            # Keep the existing direct-call path without counting the same slot twice.
            if elf.b[at+1]==0 and struct.unpack_from('<I',elf.b,at+4)[0]==0xa22b9c85:continue
            result['memcpy_calls']+=1
        result['likely_serialization']=result['likely_serialization'] or result['memcpy_calls']>=2
        return result

    module.detect_cpi_patterns=detect_cpi_patterns
    module.detect_serialization_patterns=detect_serialization_patterns
    return module


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    if args.output.exists():parser.error('output already exists; preserve prior evidence')
    corrected_module().main()
