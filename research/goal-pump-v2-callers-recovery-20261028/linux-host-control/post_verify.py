from pathlib import Path
import json,hashlib,os,sys,collections
D=Path(__file__).resolve().parent;R=D.parent;ROOT=R.parents[1];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import score,win
sys.path.insert(0,str(ROOT/'work/latest-main/research/amm-sell-returned-key-20261028/tools'));import cfg_attribution as cfg
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def tree(p):return {str(f.relative_to(p)):({'link':os.readlink(f)}if f.is_symlink()else{'sha256':sha(f),'bytes':f.stat().st_size})for f in sorted(p.rglob('*'))if f.is_symlink()or f.is_file()}
pins=json.loads((D/'input-provenance.json').read_text());sources=[]
for row in pins['source_trees']:sources.append({'path':row['prepared'],'unchanged':tree(Path(row['prepared']))==row['files']})
class Inventory(cfg.Inventory):
 def __init__(self,p):
  super().__init__(p,False);s=score.sections(self.elf.b);t=s['.text'];lo=t['offset'];hi=lo+t['size'];self.elf.normalized=self.elf.b[:lo]+score.normalize(self.elf.b[lo:hi],t['addr'],s)+self.elf.b[hi:]
a=Inventory(R/'best-exact-quote/unstripped.so');b=Inventory(D/'out/unstripped.so');rows=[]
for name,pat in [('buy_v2','6buy_v211buy_handler17h'),('exact_quote','buy_exact_quote_in_handler17h'),('sell_v2','7sell_v27execute17h')]:
 aa=next(k for k,f in a.functions.items()if pat in f['name']);bb=next(k for k,f in b.functions.items()if pat in f['name']);ga=a.graph(aa,True);gb=b.graph(bb,True);calls=lambda g:sorted([r for n in g['nodes']for r in n['code']if r['actual_direct_callee']],key=lambda r:int(r['offset'],0));ca,cb=calls(ga),calls(gb);rows.append({'name':name,'actual_direct_call_counts':[len(ca),len(cb)],'ordered_depth2_callee_identity_equal':len(ca)==len(cb)and all(u['actual_direct_callee']['identity_sha256']==v['actual_direct_callee']['identity_sha256']for u,v in zip(ca,cb))})
pa=R/'best-exact-quote/unstripped.so';pb=D/'out/unstripped.so';ca=win.Cand(pa);cb=win.Cand(pb)
def function_inventory(c):return collections.Counter(hashlib.sha256(score.normalize(c.fn(s,n),s,c.secs)).hexdigest()for s,n,name in c.funcs)
fa,fb=function_inventory(ca),function_inventory(cb);ta=ca.secs['.text'];tb=cb.secs['.text'];na=score.normalize(ca.blob[ta['offset']:ta['offset']+ta['size']],ta['addr'],ca.secs);nb=score.normalize(cb.blob[tb['offset']:tb['offset']+tb['size']],tb['addr'],cb.secs)
r={'registry_source_trees_checked':len(sources),'registry_source_trees_unchanged':all(x['unchanged']for x in sources),'changed_registry_source_paths':[x['path']for x in sources if not x['unchanged']],'workspace_unchanged':tree(D/'ws')==pins['staged_workspace_files'],'selected_actual_callee_audits':rows,'all_candidate_function_body_multisets_official_normalized_equal':fa==fb,'candidate_function_counts':[sum(fa.values()),sum(fb.values())],'official_normalized_whole_text_equal':na==nb,'scope':'Source immutability and actual call-body binding audit; not runtime or whole-ELF equivalence.'};(D/'post-verification.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
