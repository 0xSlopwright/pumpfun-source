"""Read-only Pump CFG and actual-callee attribution; never changes acceptance."""
from pathlib import Path
import argparse,sys,json,gzip,difflib
R=Path(__file__).resolve().parent;ROOT=R.parents[1]
H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness')
T=ROOT/'work/latest-main/research/amm-sell-returned-key-20261028/tools'
sys.path[:0]=[str(H),str(T)];import score,win,cfg_attribution as cfg
class Inventory(cfg.Inventory):
 def __init__(self,path,original=False):
  super().__init__(path,False);self.original=original
  if original:self.functions={w['start']:{'start':w['start'],'size':w['bytes'],'name':''}for w in score.original_windows()}
  secs=score.sections(self.elf.b);tx=secs['.text'];lo=tx['offset'];hi=lo+tx['size']
  self.elf.normalized=self.elf.b[:lo]+score.normalize(self.elf.b[lo:hi],tx['addr'],secs)+self.elf.b[hi:]
def analyze(candidate,original_start,symbol,out,adjacent_bounds=False):
 o=Inventory(H.parent/'base/original.so',True);c=Inventory(candidate)
 cf=next(f for f in c.functions.values()if symbol in win.demangle(f['name']))
 ca=cf['start'];og=o.graph(original_start,True);cg=c.graph(ca,True)
 rewrites=[]
 if adjacent_bounds:
  # Attribution-only equivalence: unsigned x>N iff x>=N+1, for these
  # nonnegative representable immediate constants. Literal terminator bytes
  # remain in machine_terminators and strict scorer output is untouched.
  for side,g in [('original',og),('candidate',cg)]:
   for node in g['nodes']:
    t=node['term']
    if t['kind']=='conditional' and t['opcode'] in (0x25,0x26) and 0<=t['immediate']<0x7fffffff:
     rewrites.append({'side':side,'offset':node['offset'],'literal':dict(t)})
     t['opcode']+=0x10;t['immediate']+=1
 top=cfg.bijection(og,cg,True)
 report={'scope':__doc__,'adjacent_unsigned_bound_attribution_only':rewrites,'original':og,'candidate':cg,'topology':top}
 summary={'original_bytes':og['bytes'],'candidate_bytes':cg['bytes'],'machine_blocks':[og['machine_blocks'],cg['machine_blocks']],'reduced_blocks':[og['canonical_reachable_blocks'],cg['canonical_reachable_blocks']],'topology':{k:v for k,v in top.items()if k not in ('mapping','partial_mapping')}}
 mapping=top.get('mapping',top.get('partial_mapping',{}))
 ds=cfg.mapped_differences(og,cg,mapping);report['differences']=ds
 summary['different_mapped_blocks']=[[r['original_block'],r['candidate_block']]for r in ds]
 oc=[o.describe_callee(r['target'],2)for r in o.function(original_start)['calls']]
 cc=[c.describe_callee(r['target'],2)for r in c.function(ca)['calls']]
 report['physical_order_callees']={'original':oc,'candidate':cc}
 summary['callee_calls']=[len(oc),len(cc)]
 summary['physical_order_callees_depth2_equal']=[r['identity_sha256']for r in oc]==[r['identity_sha256']for r in cc]
 on={n['offset']:n for n in og['nodes']};cn={n['offset']:n for n in cg['nodes']};aligned=[]
 for a,b in mapping.items():
  x=[r['actual_direct_callee']['identity_sha256']for r in on[a]['code']if r['actual_direct_callee']]
  y=[r['actual_direct_callee']['identity_sha256']for r in cn[b]['code']if r['actual_direct_callee']]
  aligned.append({'original_block':a,'candidate_block':b,'calls':len(x),'equal':x==y})
 report['mapped_block_callee_roles']=aligned
 summary['mapped_block_callee_roles']={'all_equal':all(r['equal']for r in aligned),'calls':sum(r['calls']for r in aligned),'differing':[r for r in aligned if not r['equal']]}
 oi=[r['identity_sha256']for r in oc];ci=[r['identity_sha256']for r in cc]
 summary['ordered_callee_diff_groups']=[list(x)for x in difflib.SequenceMatcher(None,oi,ci,autojunk=False).get_opcodes()if x[0]!='equal']
 out.parent.mkdir(parents=True,exist_ok=True)
 out.with_suffix('.json.gz').write_bytes(gzip.compress(json.dumps(report,indent=2).encode(),mtime=0))
 out.with_suffix('.json').write_text(json.dumps(summary,indent=2)+'\n')
 print(json.dumps(summary,indent=2))
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('candidate',type=Path);a.add_argument('start',type=lambda s:int(s,0));a.add_argument('symbol');a.add_argument('output',type=Path);a.add_argument('--adjacent-bounds',action='store_true');p=a.parse_args();analyze(p.candidate,p.start,p.symbol,p.output,p.adjacent_bounds)
