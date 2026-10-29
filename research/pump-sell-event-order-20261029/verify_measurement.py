#!/usr/bin/env python3
"""Check the one cold compiler artifact and emitted event snapshots. No build/VM.

The original static proof remains an immutable premeasurement record. This
supplement accepts the separately published PR720 ZIP as explicit immutable input;
missing/wrong evidence fails closed, without assuming that PR has merged.
"""
from pathlib import Path,PurePosixPath
import argparse,gzip,hashlib,importlib.util,io,json,struct,tarfile,zipfile
HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('static_order',HERE/'verify.py')
v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
ZIP_SHA='9db254ba1d516c88425f344e439291ff1d584d6937c5d748157eeea199c9c8bd'
SYMBOLS_SHA='3d7c549f16e854b866d72ad86347f6048c04e8f22115c56f2c8ef0f023a1ee53'
STRIPPED_SHA='844415f7d0615f0cfc1db695a5e0521dd9166802ae76286d46d8deb331989910'
INVENTORY_SHA='67ac2e4218b91091d450025df72d2c262130ef4d30985908aad7d567946e2468'
SOURCE_MANIFEST_SHA='974468bf7a2756089bf1b8729115cc03c20cc011bb39af4d1deb23b8e62d133a'

class Image:
 def __init__(self,data):
  self.data=data;t=struct.unpack_from('<Q',data,40)[0];w,n,k=struct.unpack_from('<HHH',data,58)
  self.sections=[struct.unpack_from('<IIQQQQIIQQ',data,t+i*w) for i in range(n)];self.functions=[]
  for s in self.sections:
   if s[1]!=2:continue
   st=self.sections[s[6]];names=data[st[4]:st[4]+st[5]]
   for p in range(s[4],s[4]+s[5],s[9]):
    name,info,other,index,start,size=struct.unpack_from('<IBBHQQ',data,p)
    if info&15==2 and size:self.functions.append(dict(start=start,bytes=size,symbol=names[name:names.find(b'\0',name)].decode()))
 def body(self,start,size):return v.elf_body(self.data,start,size)
 def normalized(self,start,size):
  raw=self.body(start,size);b=bytearray(raw);p=0
  while p<len(raw):
   op,regs,off,imm=struct.unpack_from('<BBhi',raw,p)
   if op==0x18:
    value=struct.unpack_from('<I',raw,p+4)[0]|struct.unpack_from('<I',raw,p+12)[0]<<32
    if any(s[3]>0 and s[3]<=value<s[3]+s[5] for s in self.sections):b[p+4:p+8]=bytes(4);b[p+12:p+16]=bytes(4)
    p+=16
   else:
    if op==0x85 and regs>>4==1 and imm!=-1:b[p+4:p+8]=bytes(4)
    p+=8
  assert p==len(raw);return bytes(b)
 def calls(self,start,size):
  return [dict(offset=p,target=start+p+8+i['imm']*8) for p,i in v.instructions(self.body(start,size)).items() if i['op']==0x85 and i['src']==1 and i['imm']!=-1]

def artifact(data):
 assert v.sha(data)==ZIP_SHA,'Wrong/mutated compiler artifact ZIP'
 with zipfile.ZipFile(io.BytesIO(data)) as z:
  entries=z.infolist();names=[e.filename for e in entries]
  assert len(names)==len(set(names))==29
  for e in entries:
   p=PurePosixPath(e.filename)
   assert not p.is_absolute() and '..' not in p.parts and '\\' not in e.filename
   assert not e.is_dir() and e.file_size<32*1024*1024
   assert (e.external_attr>>16)&0o170000!=0o120000
  contents={name:z.read(name) for name in names}
 manifest=json.loads(contents['MANIFEST.json'])
 assert set(contents)==set(manifest)|{'MANIFEST.json'}
 assert all(v.sha(contents[name])==digest for name,digest in manifest.items())
 assert v.sha(contents['unstripped.so'])==SYMBOLS_SHA and v.sha(contents['candidate.so'])==STRIPPED_SHA
 return contents,manifest

def copy_key(ins,pc,account_field,info_field,slots):
 proof=[v.expect(ins,pc,op=0x79,dst=1,src=9,off=account_field)];pc+=8
 if info_field is not None:proof.append(v.expect(ins,pc,op=0x79,dst=1,src=1,off=info_field));pc+=8
 proof.append(v.expect(ins,pc,op=0x79,dst=1,src=1,off=0));pc+=8
 stores=[]
 for word in (3,2,1):
  proof.append(v.expect(ins,pc,op=0x79,dst=2,src=1,off=word*8));pc+=8
  proof.append(v.expect(ins,pc,op=0x7b,dst=10,src=2,off=slots[word]));stores.append(pc);pc+=8
 proof.append(v.expect(ins,pc,op=0x79,dst=1,src=1,off=0));pc+=8
 proof.append(v.expect(ins,pc,op=0x7b,dst=10,src=1,off=slots[0]));stores.append(pc)
 return dict(stack_word_offsets=slots,stores=stores,instructions=proof)

def emitted(raw):
 ins=v.instructions(raw);g=v.graph(ins);memcmp=0x2a68;clock=0x2b30;event=0x3278
 for pc in (memcmp,clock,event):v.expect(ins,pc,op=0x85,src=1)
 assert v.dominates(g,memcmp,clock)
 proof={}
 for name,start,field,info,slots,reads,eventbase in [
  ('user',0x2a78,0x158,None,[-0x348,-0x340,-0x338,-0x330],[0x2ff8,0x3008,0x3018,0x3028],-0x2a8),
  ('mint',0x2ac8,0xf8,0x58,[-0x328,-0x320,-0x318,-0x310],[0x2fe0,0x2fd0,0x2fc0,0x2fb0],-0x2d8),
 ]:
  snapshot=copy_key(ins,start,field,info,slots);used=[]
  for k,read in enumerate(reads):
   store=next(p for p in snapshot['stores'] if ins[p]['off']==slots[k])
   assert v.dominates(g,store,clock) and v.dominates(g,store,read)
   transfer=v.transfer(ins,read,slots[k],eventbase+8*k,3)
   assert v.dominates(g,read+8,event)
   assert not v.stack_writes_overlapping(ins,v.between_nodes(g,store,read),slots[k])
   assert not v.stack_writes_overlapping(ins,v.between_nodes(g,read+8,event),eventbase+8*k)
   used.append(transfer)
  proof[name]=dict(snapshot=snapshot,used_event_copies=used,all_snapshot_words_dominate_clock=True)
 preds={p:[] for p in ins}
 for p,edges in g.items():
  for q in edges:preds[q].append(p)
 assert all(preds[p]==[p-8] for p in range(memcmp+8,clock+8,8))
 return dict(memcmp=memcmp,clock=clock,event_data=event,memcmp_dominates_clock=True,keys=proof,no_midregion_CFG_entry=True)

def audit(zip_bytes,inventory_bytes,baseline_bytes,baseline_inventory,source_manifest):
 contents,manifest=artifact(zip_bytes)
 assert v.sha(inventory_bytes)==INVENTORY_SHA and v.sha(baseline_bytes)==v.EXPECTED['candidate']
 assert v.sha(baseline_inventory)==v.EXPECTED['inventory'] and v.sha(source_manifest)==SOURCE_MANIFEST_SHA
 inventory=json.loads(gzip.decompress(inventory_bytes));old_inventory=json.loads(gzip.decompress(baseline_inventory))
 original=Image(contents['original/pump/deployed.so']);candidate=Image(contents['unstripped.so']);baseline=Image(baseline_bytes)
 assert v.sha(original.data)==v.EXPECTED['original']
 attempt=json.loads(contents['build-attempt.json']);result=json.loads(contents['RESULT.json']);control=json.loads(contents['control-proof.json'])
 assert attempt['returncode']==0 and attempt['cold_empty_target'] and not attempt['target_existed_before']
 for key in ('source_unchanged','tools_unchanged','sdk_rust_libraries_unchanged','registry_sources_unchanged','target_libraries_unchanged'):assert attempt[key]
 assert result['both_local_crates_compiled'] and result['proposal']['after_sha256']==v.EXPECTED['overlay']
 assert control['result']['candidate_sha256']=='199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473'
 assert control['result']['unstripped_sha256']==v.EXPECTED['candidate'] and control['result']['status']=='reproduced'
 expected=dict(json.loads(source_manifest)['source_files']);assert len(expected)==65
 expected['src/sell_v2.rs']=v.EXPECTED['overlay']
 assert {'source/'+p:h for p,h in expected.items()}==attempt['primary_source_sha256']==attempt['primary_source_after_sha256']
 with tarfile.open(fileobj=io.BytesIO(contents['compiled-source.tar.gz']),mode='r:gz') as t:
  members=t.getmembers();assert len(members)==66 and all(m.isfile() for m in members)
  assert len({m.name for m in members})==66
  compiled={m.name:t.extractfile(m).read() for m in members}
 assert {'build/source/'+p:v.sha(b) for p,b in compiled.items()}==attempt['source_sha256']==attempt['source_after_sha256']
 assert compiled['programs/pump/src/sell_v2.rs']==contents['proposed-source.rs']==(HERE/'overlay/sell_v2.rs').read_bytes()
 assert v.sha(contents['executed-builder.py'])==attempt['builder_sha256']
 log=gzip.decompress(contents['build.log.gz']);assert v.sha(log)==attempt['build_log_sha256']
 for name in ('pump-token-ext','pump-recovered'):assert ('Compiling '+name).encode() in log
 for name in ('pump_token_ext','pump_recovered'):assert ('--crate-name '+name).encode() in log
 assert all(flag in attempt['command'] for flag in ('--locked','--offline','--release','--target','sbpf-solana-solana'))
 windows={w['start']:w for w in inventory['windows']};old_windows={w['start']:w for w in old_inventory['windows']}
 assert set(windows)==set(old_windows) and len(windows)==1035
 # Exhaustive index over every actual sized FUNC symbol, not just listed matches.
 candidate_index={}
 for f in candidate.functions:
  key=(f['bytes'],v.sha(candidate.normalized(f['start'],f['bytes'])))
  record=(f['start'],f['symbol'],v.sha(candidate.body(f['start'],f['bytes'])))
  candidate_index.setdefault(key,set()).add(record)
 for start,w in windows.items():
  key=(w['bytes'],v.sha(original.normalized(start,w['bytes'])))
  recorded={(m['start'],m['symbol'],m['raw_sha256']) for m in w['normalized_matches']}
  assert candidate_index.get(key,set())==recorded,(hex(start),'census membership mismatch')
  assert w['raw_match']==any(m['raw_sha256']==w['raw_sha256'] for m in w['normalized_matches'])
  assert v.sha(original.body(start,w['bytes']))==w['raw_sha256']
  assert bool(w['normalized_matches'])==bool(old_windows[start]['normalized_matches'])
  assert w['raw_match']==old_windows[start]['raw_match']
  for m in w['normalized_matches']:
   assert any(f['start']==m['start'] and f['bytes']==w['bytes'] and f['symbol']==m['symbol'] for f in candidate.functions)
   assert v.sha(candidate.body(m['start'],w['bytes']))==m['raw_sha256']
   assert original.normalized(start,w['bytes'])==candidate.normalized(m['start'],w['bytes'])
 assert sum(bool(w['normalized_matches']) for w in windows.values())==1019 and sum(w['raw_match'] for w in windows.values())==188
 fun=next(f for f in candidate.functions if '7sell_v27execute17' in f['symbol']);assert (fun['start'],fun['bytes'])==(0x86170,14128)
 proof=emitted(candidate.body(fun['start'],fun['bytes']))
 oc=original.calls(0x144508,13976);cc=candidate.calls(fun['start'],fun['bytes']);bc=baseline.calls(0x86170,14104)
 assert len(oc)==len(cc)==len(bc)==80
 call_pairs=[]
 for old,new in zip(oc,cc):
  assert any(m['start']==new['target'] for m in windows[old['target']]['normalized_matches'])
  call_pairs.append(dict(original=old,candidate=new,complete_callee_member=True))
 incoming=[]
 for f in candidate.functions:
  for c in candidate.calls(f['start'],f['bytes']):
   if c['target']==fun['start']:incoming.append(dict(function=f,call=c))
 assert len(incoming)==1
 wrapper=incoming[0];assert wrapper['call']['offset']==0x210
 assert any(m['start']==wrapper['function']['start'] for m in windows[0x1281a0]['normalized_matches'])
 old_memberships=sum(any(m['start']==b['target'] for m in old_windows[o['target']]['normalized_matches']) for o,b in zip(oc,bc))
 return dict(schema=1,run_id=40793772555,control_run_id=40791064153,artifact_sha256=ZIP_SHA,artifact_entry_sha256=manifest,
  original_sha256=v.EXPECTED['original'],baseline_symbols_sha256=v.EXPECTED['candidate'],candidate_sha256=STRIPPED_SHA,symbols_sha256=SYMBOLS_SHA,
  overlay_sha256=v.EXPECTED['overlay'],cold_empty_target=True,both_local_crates_compiled=True,primary_source_files=65,compiled_workspace_files=66,
  build_attempt_sha256=v.sha(contents['build-attempt.json']),source_manifest_sha256=SOURCE_MANIFEST_SHA,inventory_sha256=INVENTORY_SHA,
  official_counts=inventory['counts'],normalized_gains=[],normalized_losses=[],raw_gains=[],raw_losses=[],
  function=fun,body_sha256=v.sha(candidate.body(fun['start'],fun['bytes'])),body_sizes=dict(original=13976,baseline=14104,measured=14128),
  event_static_proof=proof,actual_outgoing_calls=call_pairs,ordinal_complete_callee_memberships=dict(baseline=old_memberships,measured=80),actual_incoming_wrapper=wrapper,
  canonical_source_changed=False,sell_v2_vm_executed=False,new_matching_window=False,
  limits=['Cold compilation and bounded emitted-code attribution only; no SellV2 VM, runtime-defect claim or canonical promotion.',
   'All existing matching memberships are retained, but the target window remains unmatched and grows24bytes from the baseline.',
   'The captured used event-key order is now emitted; exact whole-body/whole-ELF identity, full aliasing and all runtime paths remain unproved.',
   'Original premeasurement STATIC-PROOF.json is preserved unchanged; this is a separately pinned compiler supplement.'])

def main():
 p=argparse.ArgumentParser(description=__doc__);root=HERE.parents[1];selected=root/v.PACKET
 p.add_argument('--artifact-zip',type=Path,default=root/'research/pump-current673-macos-qualification/evidence/sell-event-40793772555.zip')
 p.add_argument('--inventory',type=Path,default=HERE/'measurement/inventory.json.gz')
 p.add_argument('--baseline',type=Path,default=selected/'artifacts/unstripped.so')
 p.add_argument('--baseline-inventory',type=Path,default=selected/'analysis/inventory.json.gz')
 p.add_argument('--source-manifest',type=Path,default=selected/'SOURCE-FROZEN.json')
 p.add_argument('--output',type=Path);a=p.parse_args()
 report=audit(a.artifact_zip.read_bytes(),a.inventory.read_bytes(),a.baseline.read_bytes(),a.baseline_inventory.read_bytes(),a.source_manifest.read_bytes())
 if a.output:a.output.write_text(json.dumps(report,indent=2)+'\n')
 else:assert report==json.loads((HERE/'measurement/COMPILER-STATIC-PROOF.json').read_text())
 print(json.dumps({k:report[k] for k in ['run_id','body_sizes','ordinal_complete_callee_memberships','official_counts','sell_v2_vm_executed','new_matching_window']},indent=2))
if __name__=='__main__':main()
