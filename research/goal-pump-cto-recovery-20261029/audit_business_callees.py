from pathlib import Path
import sys,json,gzip,hashlib,struct,importlib.util,difflib
R=Path(__file__).resolve().parent;ROOT=R.parents[1];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import score
T=ROOT/'work/latest-main/research/amm-sell-returned-key-20261028/tools';sys.path.insert(0,str(T));import cfg_attribution as cfg
class Inventory(cfg.Inventory):
 def __init__(self,path,original=False):
  super().__init__(path,False);self.original=original
  if original:self.functions={w['start']:{'start':w['start'],'size':w['bytes'],'name':''}for w in score.original_windows()}
  secs=score.sections(self.elf.b);tx=secs['.text'];lo=tx['offset'];hi=lo+tx['size'];self.elf.normalized=self.elf.b[:lo]+score.normalize(self.elf.b[lo:hi],tx['addr'],secs)+self.elf.b[hi:]
o=Inventory(H.parent/'base/original.so',True);c=Inventory(R/'cpi-inline-account-copy-out/unstripped.so');base=score.score(R.parent/'goal-pump-recovery-20261028/current-parent/unstripped.so');import win,collections
names={a:win.demangle(v['symbols'][0])if v['symbols']else hex(a)for a,v in base.items()};ca=next(a for a,f in c.functions.items()if'9admin_cto7execute17h'in f['name']);oc=o.function(0x22a10)['calls'];cc=c.function(ca)['calls'];selected=['pump_amm::cpi::','pump_fees::cpi::','collect_v2::','admin_cto::token_','trade_types::prepare_bonding_curve','anchor_spl::associated_token::create_idempotent'];groups={};pairs=[]
for old in oc:
 name=names[old['target']]
 if not any(x in name for x in selected):continue
 options=[x for x in cc if win.demangle(c.functions[x['target']]['name'])==name]
 used=groups.get(name,0);assert used<len(options),(name,used);new=options[used];groups[name]=used+1
 u=o.describe_callee(old['target'],2);v=c.describe_callee(new['target'],2);pairs.append({'name':name,'original_offset':hex(old['offset']),'candidate_offset':hex(new['offset']),'original_target':hex(old['target']),'candidate_target':hex(new['target']),'complete_normalized_body_equal':u['identity']['official_normalized_sha256']==v['identity']['official_normalized_sha256'],'actual_edges_depth2_equal':u['identity_sha256']==v['identity_sha256']})
result={'scope':'Actual selected original/current-copy caller edges, paired by semantic name and occurrence, with complete normalized callee bodies and actual outgoing edges through depth2. Does not prove caller guard order, pointer data, runtime or full-window identity.','original_root':'0x22a10','candidate_root':hex(ca),'paired_occurrences':len(pairs),'all_pairs_equal_depth2':all(x['actual_edges_depth2_equal']for x in pairs),'occurrence_counts':groups,'pairs':pairs};(R/'business-callee-closure.json').write_text(json.dumps(result,indent=2)+'\n');print({'paired':len(pairs),'all_depth2_equal':result['all_pairs_equal_depth2']})
