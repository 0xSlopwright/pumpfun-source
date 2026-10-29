from pathlib import Path
import sys,json,gzip,hashlib,struct,importlib.util,difflib
R=Path(__file__).resolve().parent;ROOT=R.parents[1];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import score
T=ROOT/'work/latest-main/research/amm-sell-returned-key-20261028/tools';sys.path.insert(0,str(T));import cfg_attribution as cfg
class Inventory(cfg.Inventory):
 def __init__(self,path,original=False):
  super().__init__(path,False);self.original=original
  if original:self.functions={w['start']:{'start':w['start'],'size':w['bytes'],'name':''}for w in score.original_windows()}
  secs=score.sections(self.elf.b);tx=secs['.text'];lo=tx['offset'];hi=lo+tx['size'];self.elf.normalized=self.elf.b[:lo]+score.normalize(self.elf.b[lo:hi],tx['addr'],secs)+self.elf.b[hi:]
o=Inventory(H.parent/'base/original.so',True);c=Inventory(R/'validation-closure-boundary-out/unstripped.so');data=json.loads((R/'error-formatting-sites.json').read_text());left=data['original'];right=data['validation-closure-boundary'];used={};rows=[]
for x in left:
 code=x['variant'];choices=[y for y in right if y['variant']==code];i=used.get(code,0);used[code]=i+1;y=choices[i];u=x['formatting'];v=y['formatting'];a=int(u['target'],16);b=int(v['target'],16);aa=o.describe_callee(a,2);bb=c.describe_callee(b,2);rows.append({'variant':code,'occurrence':i,'original_format':u['callee'],'candidate_format':v['callee'],'original_actual_target':u['target'],'candidate_actual_target':v['target'],'complete_normalized_body_equal':aa['identity']['official_normalized_sha256']==bb['identity']['official_normalized_sha256'],'actual_depth2_identity_equal':aa['identity_sha256']==bb['identity_sha256']})
result={'scope':'Actual per-variant formatting edges, not arbitrary same-named substitute functions. Source literal codes/rows are separately bound in SOURCE-ARGUMENTS-AUDIT.json; actual expect Location in panic-Location-audit.json. No whole caller/runtime/pointee claim.','pairs':rows,'same_actual_depth2_pairs':sum(x['actual_depth2_identity_equal']for x in rows),'role_mismatches':[x for x in rows if x['original_format']!=x['candidate_format']]};(R/'VALIDATION-FORMATTING-CALLEES.json').write_text(json.dumps(result,indent=2)+'\n');print({'same_depth2':result['same_actual_depth2_pairs'],'mismatch_variants':[x['variant']for x in result['role_mismatches']]})
