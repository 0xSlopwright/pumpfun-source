#!/usr/bin/env python3
"""Portable ELF-bound verification of the 64-window dependency cut-set ledger."""
from pathlib import Path,PurePosixPath
import copy,hashlib,importlib.util,json,struct,sys,tempfile
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent
sys.path.insert(0,str(W))
import analyze
from elf_reader import Elf

def check_structure(d,o,c):
 roots=d['roots'];leaves={x['id']for x in d['terminal_targets']}
 assert len(roots)==len({x['original_start']for x in roots})==64
 for root in roots:
  for alternative in root['alternatives']:
   expected=set(alternative['required_terminal_pair_ids'])
   assert expected<=leaves
   assert {x['terminal_pair']for x in alternative['terminal_paths']}==expected
   for route in alternative['terminal_paths']:
    current=alternative['pair']
    for edge in route['path']:
     assert edge['parent_pair']==current
     oa=int(edge['original_callsite'],16);ca=int(edge['candidate_callsite'],16)
     ot=int(edge['original_target'],16);ct=int(edge['candidate_target'],16)
     assert o.calls[oa]==ot and c.calls[ca]==ct
     assert o.b[oa:oa+8].hex()==edge['original_instruction']and c.b[ca:ca+8].hex()==edge['candidate_instruction']
     current=hex(ot)+'->'+hex(ct)
    assert current==route['terminal_pair']
 for x in d['pair_ranking']:
  assert x['affected_count']==len(set(x['affected_original_windows']))
  assert x['conditional_single_pair_closure_count']==len(set(x['conditional_single_pair_closure_originals']))
  assert set(x['conditional_single_pair_closure_originals'])<=set(x['affected_original_windows'])
 return True

def controls(d,o,c):
 out=[]
 def rejected(name,fn):
  try:fn()
  except(AssertionError,KeyError):out.append({'name':name,'rejected':True});return
  raise AssertionError(name+' was accepted')
 x=copy.deepcopy(d);x['roots'].pop();rejected('missing_original_window',lambda:check_structure(x,o,c))
 x=copy.deepcopy(d);x['roots'][-1]=x['roots'][0];rejected('duplicate_original_window',lambda:check_structure(x,o,c))
 x=copy.deepcopy(d);x['terminal_targets'].pop();rejected('missing_terminal_pair',lambda:check_structure(x,o,c))
 x=copy.deepcopy(d);edge=x['roots'][0]['alternatives'][0]['terminal_paths'][0]['path'][-1];edge['candidate_target']='0x0';rejected('substituted_actual_callee',lambda:check_structure(x,o,c))
 x=copy.deepcopy(d);x['pair_ranking'][0]['conditional_single_pair_closure_count']+=1;rejected('inflated_conditional_coverage',lambda:check_structure(x,o,c))
 # Change the actual call immediate while retaining all claimed ledger fields.
 edge=d['roots'][0]['alternatives'][0]['terminal_paths'][0]['path'][-1]
 with tempfile.TemporaryDirectory()as td:
  b=bytearray(c.b);ca=int(edge['candidate_callsite'],16);assert b[ca]==0x85
  imm=struct.unpack_from('<i',b,ca+4)[0];struct.pack_into('<i',b,ca+4,imm+1)
  p=Path(td)/'wrong-callee.so';p.write_bytes(b)
  rejected('changed_call_immediate_in_ELF',lambda:check_structure(d,o,Elf(p)))
 return {'controls':out,'all_rejected':True}

def verify(root=None):
 w=W;m=json.loads((w/'manifest.json').read_bytes())
 actual={str(p.relative_to(w))for p in w.rglob('*')if p.is_file()and '__pycache__'not in p.parts}
 assert actual==set(m['files'])|{'manifest.json'}
 for name,digest in m['files'].items():
  rel=PurePosixPath(name);assert not rel.is_absolute()and '..'not in rel.parts
  p=w/name;assert not any(x.is_symlink()for x in(p,*p.parents)if x!=w.parent)
  assert hashlib.sha256(p.read_bytes()).hexdigest()==digest,name
 d=analyze.run(w);assert d==json.loads((w/'cutsets.json').read_bytes())
 o=Elf(w/'input-root/evidence/original/pump_amm/deployed.so');c=Elf(w/'artifacts/candidate.so')
 assert check_structure(d,o,c)
 neg=controls(d,o,c);assert neg==json.loads((w/'negative-controls.json').read_bytes())
 return {'passed':True,**d['summary'],'negative_controls':len(neg['controls']),'manifest_sha256':hashlib.sha256((w/'manifest.json').read_bytes()).hexdigest(),'new_compiler_executions':0,'new_VM_executions':0}

if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
