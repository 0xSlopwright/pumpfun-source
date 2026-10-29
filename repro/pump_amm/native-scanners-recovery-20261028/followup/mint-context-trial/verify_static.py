from pathlib import Path
import collections,hashlib,json,sys
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent;R=W/'runtime-inputs';sys.path.insert(0,str(W))
from elf_reader import Elf
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
o=Elf(R/'evidence/original/pump_amm/deployed.so');c=Elf(W/'build/artifacts/pump_amm_recovered.so');s=Elf(W/'build/artifacts/unstripped.so');b=Elf(W/'baseline/candidate.so');bs=Elf(W/'baseline/unstripped.so')
f=next(f for f in s.funcs if f['name'].startswith('_ZN18pump_amm_recovered18pump_amm_recovered29admin_update_token_incentives17'));bf=next(f for f in bs.funcs if f['name'].startswith('_ZN18pump_amm_recovered18pump_amm_recovered29admin_update_token_incentives17'));a=0x16128;size=3168
calls=[o.callsites(a,size),b.callsites(bf['start'],bf['size']),c.callsites(f['start'],f['size'])]
assert list(map(len,calls))==[11,11,11]
def win(e,start):
 end=next(t for t in e.entries if t>start);return e.normalized[start:end],e.pattern(start,end-start)
def symbolwin(e,symbols,start):
 fs=[x for x in symbols.funcs if x['start']==start];assert fs,hex(start);f=fs[0];return e.normalized[start:start+f['size']],e.pattern(start,f['size'])
rows=[]
for i,(old,base,new)in enumerate(zip(*calls)):
 cw=symbolwin(c,s,new['target']);bw=symbolwin(b,bs,base['target']);ow=win(o,old['target'])
 rows.append({'index':i,'original_offset':old['offset'],'base_offset':base['offset'],'trial_offset':new['offset'],'original_target':hex(old['target']),'base_target':hex(base['target']),'trial_target':hex(new['target']),'original_target_size':len(ow[0]),'trial_target_size':len(cw[0]),'base_trial_full_normalized_target_equal':cw==bw,'original_trial_full_normalized_target_equal':cw==ow})
assert all(v['base_trial_full_normalized_target_equal']for v in rows)
# Witness exact instruction bytes, not merely disassembler labels.
checks={'mint_snapshot_low':(0xc4d90,'7b1a10ff00000000'),'helper_mint_pointer':(0xc4e18,'7b1a08f000000000'),'first_event_mint_low':(0xc5050,'79a210ff00000000'),'second_event_mint_low':(0xc52d0,'79a110ff00000000'),'eager_bump_still_present':(0xc4d38,'7127220000000000')}
for name,(pc,data)in checks.items():assert c.b[pc:pc+8].hex()==data,(name,hex(pc))
first=[c.b[pc:pc+8].hex()for pc in [0xc5050,0xc5060,0xc5070,0xc5080]]
second=[c.b[pc:pc+8].hex()for pc in [0xc52d0,0xc52e0,0xc52f0,0xc5300]]
assert [int.from_bytes(bytes.fromhex(x)[2:4],'little',signed=True)for x in first]==[-240,-232,-224,-216]
assert [int.from_bytes(bytes.fromhex(x)[2:4],'little',signed=True)for x in second]==[-240,-232,-224,-216]
external=lambda e,start,size:[{'offset':p-start,**v}for p,v in e.relocations.items()if start<=p<start+size and v['type']==10]
exts=[external(o,a,size),external(b,bf['start'],bf['size']),external(c,f['start'],f['size'])]
assert len(exts[0])==len(exts[1])==len(exts[2])==2
assert [v['symbol']for v in exts[0]]==[v['symbol']for v in exts[1]]==[v['symbol']for v in exts[2]]
out={'passed':True,'candidate_sha256':sha(c.path),'base_candidate_sha256':sha(b.path),'original_sha256':sha(o.path),'handler':{'original_start':hex(a),'original_size':size,'base_start':hex(bf['start']),'base_size':bf['size'],'trial_start':hex(f['start']),'trial_size':f['size'],'exact_body_match':False},'internal_calls':rows,'external_calls':exts,'snapshot_byte_witnesses':{k:{'pc':hex(v[0]),'bytes':v[1]}for k,v in checks.items()},'all_base_trial_callees_full_normalized_equal':True,'mint_snapshot_before_clock':True,'same_snapshot_for_helper_and_both_event_serializations':True,'original_late_bump_recovered':False,'event_clone_removed':False,'semantic_bug_claim':False,'scope':'Source-supported ownership restoration. Full handler remains unmatched; no runtime or historical-source identity is inferred from normalized callees.'}

