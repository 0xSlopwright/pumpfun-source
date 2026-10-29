#!/usr/bin/python3
"""Delegate Cargo's rustc invocation; select only the explicit root linker recipe."""
import json
import os
from pathlib import Path
import sys

compiler, *arguments = sys.argv[1:]
environment = os.environ.copy()
if '--crate-name' in arguments and arguments[arguments.index('--crate-name') + 1] == 'pump_amm_recovered':
    original = list(arguments)
    environment['AMM_LAYOUT_REAL_LLD'] = str(Path(compiler).parent.parent / 'lib/rustlib/x86_64-unknown-linux-gnu/bin/rust-lld')
    arguments += ['-C', 'linker=/out/linker_wrapper.py']
    Path('/out/root-rustc-invocation.json').write_text(json.dumps({
        'compiler': compiler, 'original_arguments': original,
        'effective_arguments': arguments,
        'change': 'Only the root link-driver selection; no instruction, source or object transformation',
    }, indent=2) + '\n')
os.execvpe(compiler, [compiler, *arguments], environment)
