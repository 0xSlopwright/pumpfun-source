"""Make archived deep packets independent of hash seed and gzip wall-clock time."""
import argparse
from contextlib import contextmanager
import gzip
import hashlib
import io
from pathlib import Path
import sys
import types

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'scripts/deep_disassembly.py'
REVIEWED={'e0241c00f43218f15a127ded6c6e5398811faa38d7b6fcd8f875029135db0ceb',
          'bcc2c08b7f6e800ea484b81fc188324c89ca5f197d55815e98efa89beaca6c8e'}


@contextmanager
def deterministic_gzip_text(path):
    with open(path,'wb') as raw:
        with gzip.GzipFile(filename='',mode='wb',fileobj=raw,mtime=0) as compressed:
            with io.TextIOWrapper(compressed,encoding='utf-8',newline='\n') as text:
                yield text


def reviewed_module():
    raw=SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in REVIEWED:raise ValueError('Reviewed disassembler changed')
    text=raw.decode('utf-8')
    if text.count('list(set(')!=2:raise ValueError('Set-order adaptations are not unique')
    before='with gzip.open(str(disasm_path), "wt") as f:'
    if text.count(before)!=1:raise ValueError('Gzip adaptation is not unique')
    text=text.replace('list(set(','sorted(set(').replace(before,'with deterministic_gzip_text(disasm_path) as f:')
    sys.path.insert(0,str(ROOT/'scripts'))
    module=types.ModuleType('reviewed_deterministic_deep');module.__file__=str(SOURCE)
    module.deterministic_gzip_text=deterministic_gzip_text
    exec(compile(text,str(SOURCE),'exec'),module.__dict__)
    return module


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program',choices=['pump','pump_amm','mayhem'],required=True)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    if args.output.exists():parser.error('output exists; preserve prior evidence')
    sys.exit(reviewed_module().main())
