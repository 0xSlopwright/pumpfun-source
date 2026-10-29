#!/usr/bin/env python3
"""Test root-only codegen-unit separation with the existing dependency profiles."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import probe

P=Path(__file__).resolve().parent
baseline=json.loads((P/'baseline/inventory.json').read_text())
original_run=subprocess.run

def run(units):
    label='exact-sol-root-cgu-'+str(units)
    commands=[]
    def intercepted(command,*args,**kwargs):
        if isinstance(command,list)and len(command)>2 and str(command[0]).endswith('/rust/bin/cargo')and command[1]=='build':
            actual=list(command)
            actual[1]='rustc'
            actual+=['--lib','-vv','--','-C','codegen-units='+str(units)]
            commands.append({'requested_fastbuild_command':list(command),'executed_command':actual})
            return original_run(actual,*args,**kwargs)
        return original_run(command,*args,**kwargs)
    try:
        subprocess.run=intercepted
        probe.run(label,'src/buy.rs',probe.guard,baseline)
    finally:
        subprocess.run=original_run
    out=P/'probes'/label
    assert len(commands)==1
    log=(out/'build.log').read_text()
    compiled=[line.strip()for line in log.splitlines()if line.strip().startswith('Compiling ')]
    roots=[line for line in log.splitlines()if 'Running 'in line and '--crate-name pump_recovered 'in line]
    r=json.loads((out/'result.json').read_text())
    record={'scope':__doc__,'root_codegen_units':units,'dependency_codegen_profile_changed':False,'commands':commands,'compiled_packages':compiled,'actual_root_commands':roots,'actual_root_command_count':len(roots),'driver_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'build_log_sha256':hashlib.sha256((out/'build.log').read_bytes()).hexdigest(),'experimental_only':True,'runtime_executed':False}
    (out/'build-recipe.json').write_text(json.dumps(record,indent=2)+'\n')
    shutil.copy2(__file__,out/'executed-driver.py')
    if r['ok']:
        assert len(roots)==1
        assert len(compiled)==1 and 'pump-recovered 'in compiled[0],compiled
        assert 'codegen-units='+str(units)in roots[0]

if __name__=='__main__':
    for units in [2,16]:run(units)
