#!/usr/bin/python3
"""Use the disclosed section order with the unmodified compiler-emitted objects."""
import hashlib
import json
import os
from pathlib import Path
import sys

original = sys.argv[1:]
arguments = list(original)
if arguments.count('--script') != 1:
    raise SystemExit('Expected exactly one built-in link script')
index = arguments.index('--script') + 1
default = Path(arguments[index])
if hashlib.sha256(default.read_bytes()).hexdigest() != '5e8370b9380f55411d827721e2e43c8cfd1eac71d1383e20b938397bc0bd82c3':
    raise SystemExit('Built-in link script changed')
arguments[index] = '/workspace/pumpfun-source-workers/amm-union7/work/amm-final-five/native-layout-one-match/control/ordered.ld'
arguments += ['--Map=/workspace/pumpfun-source-workers/amm-union7/work/amm-final-five/native-layout-one-match/control/link.map', '--reproduce=/workspace/pumpfun-source-workers/amm-union7/work/amm-final-five/native-layout-one-match/control/link.tar']
Path('/workspace/pumpfun-source-workers/amm-union7/work/amm-final-five/native-layout-one-match/control/linker-invocation.json').write_text(json.dumps({
    'original_arguments': original, 'effective_arguments': arguments,
    'default_script_sha256': hashlib.sha256(default.read_bytes()).hexdigest(),
    'ordered_script_sha256': hashlib.sha256(Path('/workspace/pumpfun-source-workers/amm-union7/work/amm-final-five/native-layout-one-match/control/ordered.ld').read_bytes()).hexdigest(),
    'object_bytes_changed': False,
}, indent=2) + '\n')
linker = os.environ['AMM_LAYOUT_REAL_LLD']
os.execv(linker, [linker, *arguments])
