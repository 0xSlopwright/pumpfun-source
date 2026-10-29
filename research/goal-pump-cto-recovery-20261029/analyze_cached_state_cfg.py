from pathlib import Path
import sys,json,gzip,hashlib,struct,importlib.util,difflib
R=Path(__file__).resolve().parent;ROOT=R.parents[1];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import score
T=ROOT/'work/latest-main/research/amm-sell-returned-key-20261028/tools';sys.path.insert(0,str(T));import cfg_attribution as cfg
class Inventory(cfg.Inventory):
 def __init__(self,path,original=False):
  super().__init__(path,False);self.original=original
  if original:self.functions={w['start']:{'start':w['start'],'size':w['bytes'],'name':''}for w in score.original_windows()}
  secs=score.sections(self.elf.b);tx=secs['.text'];lo=tx['offset'];hi=lo+tx['size'];self.elf.normalized=self.elf.b[:lo]+score.normalize(self.elf.b[lo:hi],tx['addr'],secs)+self.elf.b[hi:]
o=Inventory(H.parent/'base/original.so',True);c=Inventory(R/'entry-cached-state-out/unstripped.so');ca=next(a for a,f in c.functions.items()if '9admin_cto7execute17h' in f['name']);oa=0x22a10
og=o.graph(oa,True);cg=c.graph(ca,True);top=cfg.bijection(og,cg,True)
report={'scope':'Diagnostic CFG/callee/slot attribution only. Does not change strict acceptance or establish complete semantic equivalence.','original':og,'candidate':cg,'topology':top}
summary={'original_bytes':og['bytes'],'candidate_bytes':cg['bytes'],'original_machine_blocks':og['machine_blocks'],'candidate_machine_blocks':cg['machine_blocks'],'original_blocks':og['canonical_reachable_blocks'],'candidate_blocks':cg['canonical_reachable_blocks'],'topology':{k:v for k,v in top.items()if k not in ['mapping','partial_mapping']},'unmatched':True}
if top['verified']:
 ds=cfg.mapped_differences(og,cg,top['mapping']);report['differences']=ds;summary['differing_blocks']=len(ds);summary['block_map']=top['mapping']
 (R/'entry-cached-structure/block-map.tsv').write_text('original\tcandidate\n'+'\n'.join(a+'\t'+b for a,b in top['mapping'].items())+'\n')
 on={n['offset']:n for n in og['nodes']};cn={n['offset']:n for n in cg['nodes']};calls=[];inversions=[];diffsummaries=[]
 for a,b in top['mapping'].items():
  x,y=on[a],cn[b]
  xc=[r for r in x['code']if r['actual_direct_callee']];yc=[r for r in y['code']if r['actual_direct_callee']]
  if len(xc)==len(yc):
   for u,v in zip(xc,yc):calls.append({'original_offset':u['offset'],'candidate_offset':v['offset'],'immediate_equal':u['actual_direct_callee']['identity']['official_normalized_sha256']==v['actual_direct_callee']['identity']['official_normalized_sha256'],'depth2_equal':u['actual_direct_callee']['identity_sha256']==v['actual_direct_callee']['identity_sha256']})
  else:calls.append({'original_block':a,'candidate_block':b,'count_mismatch':[len(xc),len(yc)]})
  if x['term']['kind']=='conditional' and x['machine_terminators'][-1]['official_normalized_value'][:2]!=y['machine_terminators'][-1]['official_normalized_value'][:2]:inversions.append({'original':x['machine_terminators'][-1]['offset'],'candidate':y['machine_terminators'][-1]['offset']})
 summary['aligned_calls']=calls;summary['branch_inversions']=inversions;summary['different_block_offsets']=[[d['original_block'],d['candidate_block']]for d in ds]
 report['aligned_calls']=calls
oc=o.function(oa)['calls'];cc=c.function(ca)['calls'];ordered=[]
for x,y in zip(oc,cc):
 u=o.describe_callee(x['target'],2);v=c.describe_callee(y['target'],2)
 ordered.append({'original_offset':hex(x['offset']),'candidate_offset':hex(y['offset']),'original_target':u['actual_target'],'candidate_target':v['actual_target'],'candidate_symbol':v['symbol'],'immediate_equal':u['identity']['official_normalized_sha256']==v['identity']['official_normalized_sha256'],'depth2_equal':u['identity_sha256']==v['identity_sha256']})
summary['ordered_direct_calls']=[len(oc),len(cc)]
summary['ordered_callees_equal_depth2']=len(oc)==len(cc) and all(x['depth2_equal'] for x in ordered)
report['ordered_calls']=ordered
(R/'entry-cached-structure/cfg-report.json.gz').write_bytes(gzip.compress(json.dumps(report,indent=2).encode(),mtime=0));(R/'entry-cached-structure/summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps({k:v for k,v in summary.items()if k not in ['block_map','aligned_calls']},indent=2))
