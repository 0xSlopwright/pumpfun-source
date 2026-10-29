from pathlib import Path
import sys,json,gzip,hashlib,struct,importlib.util,difflib
R=Path(__file__).resolve().parent;ROOT=R.parents[1];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import score
T=ROOT/'work/latest-main/research/amm-sell-returned-key-20261028/tools';sys.path.insert(0,str(T));import cfg_attribution as cfg
class Inventory(cfg.Inventory):
 def __init__(self,path,original=False):
  super().__init__(path,False);self.original=original
  if original:self.functions={w['start']:{'start':w['start'],'size':w['bytes'],'name':''}for w in score.original_windows()}
  secs=score.sections(self.elf.b);tx=secs['.text'];lo=tx['offset'];hi=lo+tx['size'];self.elf.normalized=self.elf.b[:lo]+score.normalize(self.elf.b[lo:hi],tx['addr'],secs)+self.elf.b[hi:]

o=Inventory(H.parent/'base/original.so',True)
rows=[]
for label,path in [('canonical',ROOT/'research/goal-pump-create-recovery-20261028/baseline/unstripped.so'),('helper',ROOT/'research/goal-pump-buyv2-recovery-20261028/separate-crate/unstripped.so')]:
 c=Inventory(path)
 for name,oa,pattern in [('sell_v2',0x144508,'7sell_v27execute17h'),('buy_exact_quote',0x13f630,'buy_exact_quote_in_handler17h')]:
  ca=next(a for a,f in c.functions.items()if pattern in f['name']);og=o.graph(oa,True);cg=c.graph(ca,True);top=cfg.bijection(og,cg,True)
  oc=[r for n in og['nodes']for r in n['code']if r['actual_direct_callee']];cc=[r for n in cg['nodes']for r in n['code']if r['actual_direct_callee']];oc.sort(key=lambda r:int(r['offset'],0));cc.sort(key=lambda r:int(r['offset'],0))
  key=lambda r:r['actual_direct_callee']['identity_sha256'];sm=difflib.SequenceMatcher(None,list(map(key,oc)),list(map(key,cc)),autojunk=False)
  audit=[]
  for m in sm.get_matching_blocks():
   for k in range(m.size):
    u,v=oc[m.a+k],cc[m.b+k];audit.append({'original_offset':u['offset'],'candidate_offset':v['offset'],'original_callee':u['actual_direct_callee']['actual_target'],'candidate_callee':v['actual_direct_callee']['actual_target'],'depth2_equal':True})
  rep={'scope':'Read-only diagnostic graph/callee comparison, not strict function acceptance or full semantic proof.','symbols_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'original':og,'candidate':cg,'topology':top,'ordered_actual_callee_alignment':audit}
  if top['verified']:rep['differences']=cfg.mapped_differences(og,cg,top['mapping'])
  out=R/(label+'-'+name);out.mkdir(exist_ok=True);(out/'report.json.gz').write_bytes(gzip.compress(json.dumps(rep,indent=2).encode(),mtime=0))
  row={'label':label,'name':name,'original':hex(oa),'candidate':hex(ca),'bytes':[og['bytes'],cg['bytes']],'machine_blocks':[og['machine_blocks'],cg['machine_blocks']],'reduced_blocks':[og['canonical_reachable_blocks'],cg['canonical_reachable_blocks']],'topology':{k:v for k,v in top.items()if k not in ['mapping','partial_mapping']},'actual_direct_calls':[len(oc),len(cc)],'ordered_actual_depth2_callees_equal':len(audit),'different_blocks':len(rep.get('differences',[]))if top['verified']else None};rows.append(row);print(json.dumps(row),flush=True)
(R/'initial-structure.json').write_text(json.dumps(rows,indent=2)+'\n')
