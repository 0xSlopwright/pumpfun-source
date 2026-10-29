from pathlib import Path
import collections,gzip,hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent;R=Path.cwd();D=R/'research/pump-program-creator-notice-qualification-20261028';Q=R/'research/pump-exact-sol-guard-20261029';sha=lambda b:hashlib.sha256(b).hexdigest();sys.path.insert(0,str(D/'tools'))
import census as c
c.ROOT=R
spec=importlib.util.spec_from_file_location('native_buy_guard_elf',Q/'audit_target.py');a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)
out=P/'warm';fresh=c.census(out/'unstripped.so');(out/'inventory.json.gz').write_bytes(gzip.compress(json.dumps(fresh,sort_keys=True).encode(),mtime=0))
control=json.loads(gzip.decompress((D/'builds/primary/inventory.json.gz').read_bytes()));delta={'normalized':{'gains':[],'losses':[]},'raw':{'gains':[],'losses':[]}}
for left,right in zip(control['windows'],fresh['windows']):
 assert (left['start'],left['bytes'],left['raw_sha256'])==(right['start'],right['bytes'],right['raw_sha256'])
 for label,key in (('normalized','normalized_matches'),('raw','raw_match')):
  if bool(left[key])!=bool(right[key]):delta[label]['gains'if right[key]else'losses'].append(hex(left['start']))
paths={'original':R/'evidence/original/pump/deployed.so','control_D037':D/'artifacts/unstripped.so','native_trial':out/'unstripped.so'};elves={k:a.Elf(path)for k,path in paths.items()};targets={k:e.target(original=k=='original')for k,e in elves.items()}
results={};calls={};class_names=collections.defaultdict(set);classes={};counts={}
for label,e in elves.items():
 t=targets[label];rows=[];externals=[];section=e.sections['.text'];raw=t['raw'];pc=0
 while pc<len(raw):
  op,reg,disp,imm=struct.unpack_from('<BBhi',raw,pc)
  if op==0x85 and reg>>4==1:
   absolute=t['address']+pc
   if imm!=-1:
    target=absolute+8+imm*8;rows.append(dict(offset=hex(pc),absolute_address=hex(absolute),instruction_hex=raw[pc:pc+8].hex(),signed_immediate=imm,actual_target=hex(target)))
   else:externals.append(dict(offset=hex(pc),absolute_address=hex(absolute),instruction_hex=raw[pc:pc+8].hex(),signed_immediate=imm))
  pc+=16 if op==0x18 else 8
 calls[label]=dict(defined_calls=rows,external_relocated_calls=externals)
 results[label]=dict(start=hex(t['address']),bytes=t['bytes'],whole_image_sha256=sha(e.data),raw_body_sha256=sha(t['raw']),complete_normalized_sha256=sha(t['norm']),actual_defined_calls=len(rows),external_relocated_calls=len(externals),masked_operands=t['refs'])
 if label!='original':
  classes[label]={}
  for f in e.functions:
   raw=e.body(f['address'],f['size']);norm,refs=e.normalize(raw,f['address']);key=(f['size'],sha(norm));classes[label][f['address']]=key;class_names[key].add(f['name'])
  counts[label]=collections.Counter(classes[label][int(row['actual_target'],16)]for row in rows)
  for row in rows:
   key=classes[label][int(row['actual_target'],16)];row['target_bytes']=key[0];row['complete_normalized_callee_sha256']=key[1]
different=[]
for key in counts['control_D037'].keys()|counts['native_trial'].keys():
 if counts['control_D037'][key]!=counts['native_trial'][key]:different.append(dict(bytes=key[0],complete_normalized_callee_sha256=key[1],control=counts['control_D037'][key],trial=counts['native_trial'][key],candidate_symbol_aliases=sorted(class_names[key])))
left,right=targets['original'],targets['native_trial'];different_bytes=[i for i,(x,y)in enumerate(zip(left['norm'],right['norm']))if x!=y];slots=sorted({i//8 for i in different_bytes});residual=[]
for slot in slots:
 row={'slot':slot}
 for label in ('original','native_trial'):
  raw=targets[label]['raw'][slot*8:slot*8+8];op,reg,disp,imm=struct.unpack('<BBhi',raw);row[label]=dict(raw_instruction=raw.hex(),opcode=hex(op),dst=reg&15,src=reg>>4,offset=disp,immediate=imm)
 residual.append(row)
trialnorm=targets['native_trial']['norm'];linux_images=P/'linux-guard-symbols.so';linux_images.write_bytes(gzip.decompress((Q/'candidate/symbols.so.gz').read_bytes()));linux=a.Elf(linux_images).target()
result=dict(scope='Full canonical census and actual target/call operands; ordinary native build, no VM or promotion',counts=fresh['counts'],memberships_vs_D037=delta,targets=results,target_diff_original=dict(different_bytes=len(different_bytes),different_slots=slots,residual=residual),native_trial_normalized_equal_retained_linux_guard=trialnorm==linux['norm'],control_to_trial_complete_callee_class_differences=different,whole_original_target_equal=trialnorm==left['norm'],original_target_full_window=next(bool(w['normalized_matches'])for w in fresh['windows']if w['start']==0x14f4e0),actual_call_operands='actual-call-operands.json')
(P/'actual-call-operands.json').write_text(json.dumps(calls,indent=2)+'\n');(P/'MEASURED.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:result[k]for k in ('counts','memberships_vs_D037','target_diff_original','native_trial_normalized_equal_retained_linux_guard','control_to_trial_complete_callee_class_differences','whole_original_target_equal')},indent=2))
