#!/usr/bin/env python3
"""Passive output-register-aware reload attribution, never a match normalizer."""
from pathlib import Path
import hashlib,importlib.util,json,re
R=Path(__file__).resolve().parent;P=R.parent
spec=importlib.util.spec_from_file_location('phase6_analysis',R/'analyze_saved.py');a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def derive(path):
 stages=[]
 for snap in a.machine(path):
  nodes=snap['blocks_data'];regs=set();exits=[]
  for n in nodes:
   if 'EXIT'not in n['instructions']:continue
   for ins in n['instructions']:
    m=re.match(r'^STD_V1 (?:killed )?\$r\d+, (?:killed )?(\$r\d+), (0|8)\b',ins)
    if m:regs.add(m[1])
   exits.append(n)
  stubs=[]
  for i,n in enumerate(nodes):
   ins=n['instructions']
   if len(ins)not in[1,2]:continue
   m=re.fullmatch(r'(\$r\d+) = LDD_V1 \$r10, (-\d+)',ins[0])
   if not m or m[1]not in regs or(len(ins)==2 and not ins[1].startswith('JMP')):continue
   stubs.append({**n,'output_register':m[1],'stack_offset':int(m[2]),'unconditional_branch_present':len(ins)==2,'physical_next_machine_block':nodes[i+1]['machine_id']if i+1<len(nodes)else None})
  stages.append({'stage':snap['stage'],'machine_blocks':len(nodes),'output_pointer_registers_in_exit_stores':sorted(regs),'exit_nodes':exits,'pure_output_pointer_reload_stubs':stubs})
 return stages
def run():
 paths=[P/'phase2/ownerwrite-trace/compiler.log',P/'phase3/whole-wrapper/compiler.log',P/'phase5/whole-tail-closure/compiler.log',*sorted(R.glob('*/compiler.log'))]
 out=[]
 for path in paths:out.append({'compiler_log':str(path.relative_to(P)),'compiler_log_sha256':sha(path),'stages':derive(path)})
 (R/'register-aware-reloads.json').write_text(json.dumps({'correction':'Earlier r6+JMP-only detector does not imply absence of output-pointer reloads in another register or without a terminator. This supplemental read-only detector derives registers from actual output stores at EXIT blocks.','analyses':out},indent=2)+'\n')
 print(json.dumps([{'log':x['compiler_log'],'stages':[{'stage':s['stage'],'output_registers':s['output_pointer_registers_in_exit_stores'],'stubs':[(n['machine_id'],n['ir_id'],n['output_register'],n['stack_offset'],n['unconditional_branch_present'])for n in s['pure_output_pointer_reload_stubs']]}for s in x['stages']]}for x in out],indent=2))
if __name__=='__main__':run()
