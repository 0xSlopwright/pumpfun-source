#!/usr/bin/env python3
from pathlib import Path
import copy,hashlib,importlib.util,json,shutil,struct,sys,tempfile
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W))
import analyze as audit
from elf_reader import Elf
import verify_source_binding as bind
import verify as main

def run():
 o=Elf(W/'input-root/evidence/original/pump_amm/deployed.so');c=Elf(W/'artifacts/candidate.so');s=Elf(W/'artifacts/unstripped.so');f=next(x for x in s.funcs if '7disable17h'in x['name']and x['size']==3024)
 out=[]
 def reject(name,fn):
  try:fn()
  except (AssertionError,KeyError,ValueError):out.append({'name':name,'rejected':True});return
  raise AssertionError(name+' was accepted')
 with tempfile.TemporaryDirectory()as td:
  t=Path(td)
  b=bytearray(c.b);b[f['start']+1]^=1;p=t/'body.so';p.write_bytes(b)
  reject('changed_normalized_instruction',lambda:audit.gains(o,Elf(p),s))
  b=bytearray(c.b);pc=f['start']+384;target=next(x['start']for x in s.funcs if '12handle_error17h'in x['name']);assert b[pc]==0x85;struct.pack_into('<i',b,pc+4,(target-pc-8)//8);p=t/'callee.so';p.write_bytes(b)
  reject('valid_but_wrong_actual_callee',lambda:audit.gains(o,Elf(p),s))
  canonical=t/'canonical';shutil.copytree(W/'canonical-source',canonical);target=canonical/'programs/pump-amm/src/utils/token.rs';target.write_bytes(target.read_bytes()+b'\n')
  reject('changed_canonical_source',lambda:bind.verify(canonical,W/'source',W/'worker-records/build/build-comparison.json',W/'artifacts/candidate.so',W/'artifacts/unstripped.so',W/'dependency-proof'))
  # Each accounting control retains the real measurement and changes only the
  # proposed audit. This checks missing/duplicate claims independently of hash seals.
  a=t/'accounting';a.mkdir();(a/'worker-records').mkdir();shutil.copy2(W/'worker-records/measurement-full.json',a/'worker-records/measurement-full.json');base=json.loads((W/'remaining-audit.json').read_bytes())
  d=copy.deepcopy(base);d['rows'].pop();(a/'remaining-audit.json').write_text(json.dumps(d));reject('missing_remaining_window',lambda:main.check_remaining(a))
  d=copy.deepcopy(base);d['rows'][-1]=d['rows'][0];(a/'remaining-audit.json').write_text(json.dumps(d));reject('duplicate_remaining_window',lambda:main.check_remaining(a))
  d=copy.deepcopy(base);d['metrics']['remaining_window_percent']+=1;(a/'remaining-audit.json').write_text(json.dumps(d));reject('wrong_remaining_percent',lambda:main.check_remaining(a))
 return {'controls':out,'all_rejected':all(x['rejected']for x in out),'new_builds':0,'new_vm_executions':0}
if __name__=='__main__':print(json.dumps(run(),indent=2))
