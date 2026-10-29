#!/usr/bin/python3
# Native transport: original root wrapper; qualified registry argv canonicalizer for other crates.
import os,sys
from pathlib import Path
p=Path(__file__).resolve().parent
compiler,*args=sys.argv[1:]
root='--crate-name' in args and args[args.index('--crate-name')+1]=='pump_amm_recovered'
wrapper=Path(os.environ['AMM_NATIVE_ROOT_WRAPPER']) if root else p/'reference/physical_source_wrapper.py'
os.execv(str(wrapper),[str(wrapper),compiler,*args])
