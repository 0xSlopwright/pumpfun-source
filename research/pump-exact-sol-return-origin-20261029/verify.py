#!/usr/bin/env python3
"""Offline saved-evidence replay. No compiler, VM, target execution, or image editing."""
if not __debug__:
 raise SystemExit('Run without -O; inherited readers require assertions.')
from pathlib import Path
import argparse, collections, csv, gzip, hashlib, importlib.util, io, json, re, struct, tarfile, tempfile

P=Path(__file__).resolve().parent
INNER='_ZN14pump_recovered10legacy_buy16buy_exact_sol_in17h56330eb58410ba36E'
WRAPPER='_ZN14pump_recovered14pump_recovered16buy_exact_sol_in17h28eae2e2fdc8f8b2E'
WINDOW_CATALOG='repro/reconstruction-status-2026-10-26/functions.tsv'
WINDOW_CATALOG_SHA256='fb2c0a47514567d65eb45c1e268dacd5291e4659bb7dceb575a767dc20bcaff8'
PINS={
 'lld/ELF/Arch/SBF.cpp':'0a31bc1a725bc3fb229908122875179ca38ffbdd',
 'llvm/lib/Target/SBF/MCTargetDesc/SBFELFObjectWriter.cpp':'15c1ae681402de53fa76683bcea8ab031436ef4f',
 'llvm/lib/Target/SBF/MCTargetDesc/SBFAsmBackend.cpp':'628a82d2354400a84f379bea83c522a3a2071f2b',
 'llvm/include/llvm/BinaryFormat/ELFRelocs/SBF.def':'01a7eb09e8ec6614e777918d1837649962886efe',
 'llvm/lib/Target/SBF/SBFTargetFeatures.td':'a1ff0b940a4256131ad27f5a44dea248b3353941',
 'compiler/rustc_codegen_ssa/src/mir/operand.rs':'e5fd59657a490839a0f8f440d93c189be8df2e91',
 'compiler/rustc_codegen_ssa/src/mir/block.rs':'d4d172c000f3f087e9f51a1193b7c4d812de0ffc',
 'compiler/rustc_codegen_llvm/src/abi.rs':'123aef0f3107616755d5b1d72b6872d9a7ff0409',
 'compiler/rustc_mir_transform/src/inline.rs':'7a3b08f82f619f83de0285ccc79ab6b67a43c493'}

def need(ok,message):
 if not ok:raise AssertionError(message)
def sha(b):return hashlib.sha256(b).hexdigest()
def read(p):
 b=p.read_bytes();return gzip.decompress(b) if p.suffix=='.gz' else b
def js(p):return json.loads(read(p))
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def seal(p):
 expected=js(p/'MANIFEST.json');actual={f.relative_to(p).as_posix():sha(f.read_bytes()) for f in p.rglob('*') if f.is_file() and f.name!='MANIFEST.json'}
 need(actual==expected,'packet seal/file set');return len(actual)
def tar_members(blob):
 out={}
 with tarfile.open(fileobj=io.BytesIO(blob),mode='r:*') as tar:
  for member in tar:
   need(member.isfile() and not member.name.startswith('/') and '..' not in Path(member.name).parts,'archive entry')
   need(member.name not in out,'duplicate archive entry');out[member.name]=tar.extractfile(member).read()
 return out
def fn_body(text,symbol):
 m=re.search(r'^define[^\n]*@'+re.escape(symbol)+r'\([^\n]*\{.*?^\}',text,re.M|re.S);return m.group() if m else None

def trace_orders(blob):
 text=blob.decode().replace('\r\n','\n').replace('\r','\n');heads=list(re.finditer(r'^.*IR Dump (?:Before|After).+$',text,re.M))
 need(len(heads)==512,'LLVM snapshot count');rows={'inner':[],'wrapper':[]};stores={'inner':[],'wrapper':[]};first={};last={}
 for k,h in enumerate(heads):
  part=text[h.end():heads[k+1].start() if k+1<len(heads) else len(text)]
  for name,symbol in [('inner',INNER),('wrapper',WRAPPER)]:
   body=fn_body(part,symbol)
   if not body:continue
   anchors=list(re.finditer(r'\bstore i32 133,',body))
   if not anchors:continue
   need(len(anchors)==1,'Source133 anchor');tail=body[anchors[0].start():]
   call=re.search(r'^  (%[\w.]+) = (?:tail )?call .*with_values[^\n]+',tail,re.M);need(call is not None,'Source133 call')
   extracts=list(re.finditer(r'^  (%[\w.]+) = extractvalue \{ i64, ptr \} '+re.escape(call.group(1))+r', ([01])$',tail,re.M))
   need([m.group(2) for m in extracts]==['0','1'] and call.end()<extracts[0].start(),'extract order')
   tag_stores=list(re.finditer(r'^  store i64 '+re.escape(extracts[0].group(1))+r', [^\n]+',tail,re.M))
   payload_stores=list(re.finditer(r'^  store ptr '+re.escape(extracts[1].group(1))+r', [^\n]+',tail,re.M))
   if tag_stores or payload_stores:
    need(len(tag_stores)==len(payload_stores)==1 and tag_stores[0].start()<payload_stores[0].start(),'explicit return store order')
    stores[name].append(k)
   rows[name].append(k);first.setdefault(name,body);last[name]=body
 need(len(rows['inner'])==144 and rows['inner'][0]==0 and rows['inner'][-1]==169,'inner observations')
 need(rows['wrapper']==list(range(171,396)),'wrapper observations')
 need('Before Annotation2MetadataPass' in heads[0].group() and 'After InlinerPass' in heads[171].group(),'initial/inlining boundary')
 need('%1086 = extractvalue { i64, ptr } %1085, 0\n  %1087 = extractvalue { i64, ptr } %1085, 1' in first['inner'],'initial pair')
 need('store i64 %1086, ptr %346, align 8\n  %1088 = getelementptr inbounds i8, ptr %346, i64 8\n  store ptr %1087, ptr %1088, align 8' in first['inner'],'initial stores')
 need(len(stores['inner'])==19 and not stores['wrapper'],'explicit return store observations')
 rows['inner_direct_store_pairs']=stores['inner']
 return rows,last

def vbytes(e,address,size):
 sections=[s for s in e.sections.values() if s['type']==1 and s['addr']<=address and address+size<=s['addr']+s['size']]
 need(len(sections)==1,'bounded image range');s=sections[0];offset=s['offset']+address-s['addr'];return e.data[offset:offset+size]
def dynrels(e):
 need(struct.unpack_from('<H',e.data,18)[0]==263 and struct.unpack_from('<I',e.data,48)[0]==0,'SBF legacy image kind')
 s=e.sections['.rel.dyn'];need(s['type']==9 and s['size']%16==0,'REL table');out={}
 for p in range(s['offset'],s['offset']+s['size'],16):
  address,info=struct.unpack_from('<QQ',e.data,p);need(address not in out,'duplicate relocation');out[address]=(info&0xffffffff,info>>32)
 return out
def pointer(e,rels,address):
 need(rels.get(address)==(8,0),'relative data relocation type/symbol')
 lo,value=struct.unpack('<II',vbytes(e,address,8));need(lo==0 and value!=0,'legacy data pointer encoding');return value
def object_extent(e,address,size):
 need(any(s['kind']==1 and s['address']==address and s['size']==size for s in e.symbols),'candidate object extent')

def memberships(original,candidate,windows):
 raw=set();normalized=set()
 for f in candidate.functions:
  b=candidate.body(f['address'],f['size']);raw.add((len(b),sha(b)))
  normalized.add((len(b),sha(candidate.normalize(b,f['address'])[0])))
 result={'raw_match':set(),'normalized_matches':set()}
 for address,size in windows.items():
  b=original.body(address,size)
  if (size,sha(b)) in raw:result['raw_match'].add(address)
  if (size,sha(original.normalize(b,address)[0])) in normalized:result['normalized_matches'].add(address)
 return result

def reference_comparison(original,candidate,windows):
 ot=original.target(True);ct=candidate.target()
 oc={r['offset']:r['target'] for r in ot['refs'] if r['kind']=='direct-call'};cc={r['offset']:r['target'] for r in ct['refs'] if r['kind']=='direct-call'}
 need(oc[8016]==4528 and cc[8016]==8568,'actual Source133 call binding')
 seen={}
 def function(x,y):
  need(x in windows,'original function boundary');n=windows[x]
  info=candidate.callee(y);need(any(z['bytes']==n for z in info['bodies']),'actual candidate function extent')
  left,right=original.body(x,n),candidate.body(y,n);ln,lr=original.normalize(left,x);rn,rr=candidate.normalize(right,y)
  need(ln==rn,'referent function bytes')
  row={'original':x,'candidate':y,'bytes':n,'names':info['names'],'raw_equal':left==right,'normalized_sha256':sha(ln),
       'original_raw_sha256':sha(left),'candidate_raw_sha256':sha(right),'deeper_masked_operands':len(lr)}
  seen[(x,y)]=row;return row
 root=function(oc[8016],cc[8016]);need(root['bytes']==1336,'error helper size')
 ob=original.body(oc[8016],1336);cb=candidate.body(cc[8016],1336)
 need(ob[-32:]==cb[-32:]==bytes.fromhex('79a1d0fe000000007b810000000000007b610800000000009500000000000000'),'return stores')
 need(ob[248:256]==cb[248:256]==bytes.fromhex('b702000037000000'),'message length operand')
 _,orr=original.normalize(ob,oc[8016]);_,crr=candidate.normalize(cb,cc[8016]);need(len(orr)==len(crr)==13,'helper reference count')
 od={r['offset']:r for r in orr};cd={r['offset']:r for r in crr};need(set(od)==set(cd),'helper reference sites')
 direct=[]
 for offset in od:
  x,y=od[offset],cd[offset];need(x['kind']==y['kind'],'reference kind')
  if x['kind']=='direct-call':direct.append({'offset':offset,**function(x['target'],y['target'])})
 need(len(direct)==8,'direct edge count')
 need(od[88]['value']==od[320]['value'] and cd[88]['value']==cd[320]['value'],'repeated vtable reference')
 rels=[dynrels(original),dynrels(candidate)];objects=[];vtables=[]
 for site,size,fields,label in [(88,48,[0,24,32,40],'String fmt::Write vtable'),(256,32,[0,24],'fmt::Error Debug vtable'),(272,24,[0],'panic location')]:
  starts=[od[site]['value'],cd[site]['value']];object_extent(candidate,starts[1],size)
  blocks=[bytearray(vbytes(e,start,size)) for e,start in zip([original,candidate],starts)]
  for start,rs in zip(starts,rels):need({a-start for a in rs if start<=a<start+size}==set(fields),'data relocation sites')
  for offset in fields:
   addresses=[pointer(e,rs,start+offset) for e,rs,start in zip([original,candidate],rels,starts)]
   if label=='panic location':
    lengths=[struct.unpack('<Q',vbytes(e,start+8,8))[0] for e,start in zip([original,candidate],starts)]
    need(lengths==[84,84],'path length');object_extent(candidate,addresses[1],84)
    paths=[vbytes(e,address,84) for e,address in zip([original,candidate],addresses)]
    need(paths[0]==paths[1]==b'/home/runner/work/platform-tools/platform-tools/out/rust/library/alloc/src/string.rs','panic source path')
    need(struct.unpack('<II',blocks[0][16:24])==(2559,14),'panic coordinates')
   else:vtables.append({'object':label,'field':offset,**function(*addresses)})
   for b in blocks:b[offset:offset+8]=b'\0'*8
  need(blocks[0]==blocks[1],'non-pointer data bytes')
  objects.append({'site':site,'kind':label,'original':starts[0],'candidate':starts[1],'bytes':size,'pointer_fields':fields,'scalar_bytes_sha256':sha(blocks[0])})
 starts=[od[232]['value'],cd[232]['value']];object_extent(candidate,starts[1],55)
 messages=[vbytes(e,start,55) for e,start in zip([original,candidate],starts)]
 need(messages[0]==messages[1]==b'a Display implementation returned an error unexpectedly','message bytes')
 need(len(vtables)==6,'vtable edge count')
 return {'root':root,'direct_edges':direct,'vtable_edges':vtables,'unique_child_functions':[v for k,v in sorted(seen.items()) if k!=(oc[8016],cc[8016])],
         'data_objects':objects,'raw_identical_message_bytes':55,'raw_identical_path_bytes':84,'relocation_checked_object_bytes':104,
         'data_pointer_fields':7,'root_raw_different_bytes':sum(x!=y for x,y in zip(ob,cb)),
         'scope':'One edge from the actual helper, including six vtable targets. Descendant operands/dynamic dispatch and behavior remain unqualified; no recursive closure or raw helper identity.'}

def verify(repo,packet=P):
 count=seal(packet);pin=js(packet/'PROVENANCE.json');parent=repo/pin['parent_packet'];source=repo/pin['source_packet']
 need(sha((parent/'MANIFEST.json').read_bytes())==pin['parent_manifest_sha256'],'reviewed parent seal')
 need(sha((source/'MANIFEST.json').read_bytes())==pin['source_manifest_sha256'],'source seal')
 pv=module('return_origin_parent',parent/'verify.py');pv.verify(repo,parent)
 audit=module('return_origin_audit',source/'audit_target.py')
 original_path=repo/'evidence/original/pump/deployed.so';need(sha(original_path.read_bytes())==pin['original_sha256'],'original image')
 sources=js(packet/'compiler/sources.json.gz');need({x['path']:x['sha'] for x in sources}==PINS,'compiler Git pins')
 for x in sources:
  b=x['content'].encode();need(len(b)==x['size'] and sha(b)==x['sha256'],'compiler source digest')
  need(hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==x['sha'],'compiler Git blob')
  need(x['revision']==pin['rust_revision' if x['path'].startswith('compiler/') else 'llvm_revision'],'compiler source revision')
 src={x['path']:x['content'] for x in sources}
 need('let a_llval = bx.extract_value(llval, 0);\n            let b_llval = bx.extract_value(llval, 1);' in src['compiler/rustc_codegen_ssa/src/mir/operand.rs'],'front-end extract order')
 need('We still apply our cost threshold to #[inline(always)] functions.' in src['compiler/rustc_mir_transform/src/inline.rs'],'inliner limit')
 need('return relocAbs64 ? ELF::R_SBF_64_ABS64 : ELF::R_SBF_64_64;' in src['llvm/lib/Target/SBF/MCTargetDesc/SBFELFObjectWriter.cpp'],'legacy relocation selection')
 need('write32le(loc + 4, val & 0xFFFFFFFF);' in src['lld/ELF/Arch/SBF.cpp'],'linker encoding')
 need('def : Proc<"generic", []>;' in src['llvm/lib/Target/SBF/SBFTargetFeatures.td'],'generic defaults')
 baseline=js(parent/'build/windows/02-guard/launch.json.gz');root=js(parent/'inputs/root-command.json.gz')
 launch=js(packet/'capture/launch.json.gz');result=js(packet/'capture/result.json.gz')
 need(launch['source_inputs']==baseline['source_inputs'] and len(launch['source_inputs'])==66,'capture source inputs')
 need(launch['tools']==baseline['tools'],'capture tools')
 oldbase=baseline['cwd'].removesuffix('\\source');newbase=launch['cwd'].removesuffix('\\source')
 flags=['-C','llvm-args=-print-before-all','-C','llvm-args=-print-after-all','-C','llvm-args=-filter-print-funcs='+WRAPPER+','+INNER,'-Zdump-mir=buy_exact_sol_in','-Zdump-mir-dir='+result['mir_directory']]
 need(launch['extra_arguments']==flags and launch['command']==[x.replace(oldbase,newbase) for x in root]+flags,'capture command binding')
 env={k:v.replace(oldbase,newbase) for k,v in baseline['environment'].items()};env.update(CARGO_MANIFEST_DIR=newbase+'\\source/programs/pump',CARGO_PKG_NAME='pump-recovered',CARGO_PKG_VERSION='0.1.0',CARGO_CRATE_NAME='pump_recovered')
 # pathlib on the recorded Windows host uses a backslash before source too.
 env['CARGO_MANIFEST_DIR']=newbase+'\\source\\programs\\pump'
 need(launch['environment']==env,'capture environment binding')
 need(launch['compiler_commands']==1 and launch['target_executions']==result['target_executions']==0,'capture execution scope')
 need(result['returncode']==0 and result['source_unchanged'] and result['tools_unchanged'] and result['whole_output_equal'],'capture result')
 need(launch['controller_sha256']==sha(read(packet/'controllers/trace_origin.py')),'capture producer')
 for n,r in result['logs'].items():b=read(packet/('capture/'+n+'.gz'));need(sha(b)==r['sha256'] and len(b)==r['bytes'],'capture log')
 image=read(packet/'capture/symbols.so.gz');need(image==read(parent/'outputs/guard.so.gz') and sha(image)==result['symbols_sha256']==pin['baseline_sha256'],'passive whole ELF')
 mir=tar_members((packet/'capture/mir.tar.gz').read_bytes());need({p:sha(b) for p,b in mir.items()}==result['mir_files'] and len(mir)==1667,'MIR archive')
 for name in ['legacy_buy','pump_recovered']:
  files=[n for n in mir if n.startswith('pump_recovered.'+name+'-buy_exact_sol_in.') and n.endswith('.mir')];need(len(files)==104,'selected MIR count')
 inner=mir['pump_recovered.legacy_buy-buy_exact_sol_in.006-000.runtime-optimized.after.mir'].decode()
 need('line: const 133_u32' in inner and '_208 = anchor_lang::error::Error::with_values::<u64, u64>(move _209, move _218) -> [return: bb68, unwind unreachable];' in inner and '_0 = std::result::Result::<(), anchor_lang::error::Error>::Err(move _208);' in inner,'MIR return')
 rows,last=trace_orders(read(packet/'capture/stderr.log.gz'))
 prior=read(parent/'traces/stock-passes.log.gz').decode().replace('\r\n','\n');heads=list(re.finditer(r'^.*IR Dump (?:Before|After).+$',prior,re.M))
 need(fn_body(prior[heads[275].end():heads[276].start()],WRAPPER)==last['wrapper'],'prior final LLVM binding')
 windows={int(x['original_start']):int(x['bytes']) for x in csv.DictReader(io.StringIO(read(packet/'inputs/original-function-boundaries.tsv.gz').decode()),delimiter='\t') if x['program']=='pump' and x['variant']=='selected'}
 need(len(windows)==1035,'original boundary count')
 catalog=repo/WINDOW_CATALOG;need(sha(catalog.read_bytes())==WINDOW_CATALOG_SHA256,'canonical selected-window catalog hash')
 canonical={int(x['original_start']):int(x['original_end'])-int(x['original_start']) for x in csv.DictReader(io.StringIO(catalog.read_text()),delimiter='\t') if x['program']=='pump' and x['variant']=='selected'}
 need(windows==canonical and len(canonical)==1035,'canonical original-window membership/extents')
 baseline_census=js(packet/'inputs/baseline-census.json.gz');need({x['start']:x['bytes'] for x in baseline_census['windows']}==windows and baseline_census['candidate_sha256']==sha(image),'boundary/census binding')
 with tempfile.TemporaryDirectory() as tmp:
  path=Path(tmp)/'candidate.so';path.write_bytes(image);original=audit.Elf(original_path);candidate=audit.Elf(path)
  refs=reference_comparison(original,candidate,windows)
  bad=read(packet/'rejected/symbols.so.gz');path=Path(tmp)/'rejected.so';path.write_bytes(bad);negative=audit.Elf(path)
  bad_result=js(packet/'rejected/result.json.gz');bad_launch=js(packet/'rejected/launch.json.gz')
  need(sha(bad)==bad_result['symbols_sha256'] and bad_result['returncode']==0 and bad_result['source_unchanged'] and bad_result['tools_unchanged'] and not bad_result['whole_output_equal'],'rejected result')
  need(bad_launch['tools']==baseline['tools'] and bad_launch['controller_sha256']==sha(read(packet/'controllers/addressable_return.py')),'rejected producer/tools')
  badbase=bad_launch['cwd'].removesuffix('\\source');need(bad_launch['command']==[x.replace(oldbase,badbase) for x in root],'rejected command')
  originals=tar_members((source/'source-candidate.tar.gz').read_bytes());change=bad_launch['source_change'];path=change['path']
  need(path=='programs/pump/src/buy.rs' and change['line']==133 and originals[path].splitlines()[132]==change['old'].encode(),'rejected source anchor')
  originals[path]=originals[path].replace(change['old'].encode(),change['new'].encode());need({p:sha(b) for p,b in originals.items()}==bad_launch['source_inputs'],'rejected exact source change')
  for n,h in bad_result['logs'].items():need(sha(read(packet/('rejected/'+n+'.gz')))==h,'rejected logs')
  bc=js(packet/'rejected/census.json.gz');need(bc['candidate_sha256']==sha(bad) and bc['counts']==baseline_census['counts'],'rejected census')
  baseline_members=memberships(original,candidate,windows);negative_members=memberships(original,negative,windows)
  for key in ['raw_match','normalized_matches']:
   need(baseline_members[key]=={x['start'] for x in baseline_census['windows'] if x[key]},'recomputed baseline membership')
   need(negative_members[key]=={x['start'] for x in bc['windows'] if x[key]}==baseline_members[key],'recomputed rejected membership')
  need(len(baseline_members['raw_match'])==186 and len(baseline_members['normalized_matches'])==1019,'recomputed window counts')
  t=negative.target();calls=[x for x in t['refs'] if x['kind']=='direct-call'];need(t['bytes']==13272 and len(calls)==102 and calls[-1]['offset']==13264 and any('4core6option13unwrap_failed' in n for n in negative.callee(calls[-1]['target'])['names']),'rejected panic tail')
  values=[r for r in calls if any('with_values' in n for n in negative.callee(r['target'])['names'])]
  need(len(values)==7 and values[-1]['offset']==8024,'rejected error-return site')
  need(t['raw'][8032:8064]==bytes.fromhex('79a158f900000000bf13000000000000150189020200000079a160f900000000'),'rejected tag test and load order')
  need(8048+8+649*8==13248,'rejected branch destination')
 return {'sealed_files':count,'compiler_git_blobs':len(sources),'source_inputs':66,'whole_baseline_ELF_equal':True,'MIR_files':1667,'selected_MIR_snapshots':208,'LLVM_snapshots':512,'inner_tag_first_observations':len(rows['inner']),'wrapper_tag_first_observations':len(rows['wrapper']),
         'inner_direct_store_pair_observations':len(rows['inner_direct_store_pairs']),'trace_order_scope':'144/225 observations check extract order; 19 early inner states also contain explicit tag/payload stores checked individually. Later return/phi forms are not generalized as direct store pairs.',
         'references':refs,'rejected_control':{'target_bytes':13272,'extra_bytes':48,'direct_calls':102,'extra_panic_call':True,'normalized_windows':1019,'raw_windows':186,'membership_gain':False},
         'target_executions':0,'canonical_count_update':False,'scope':pin['scope']}
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--repo-root',type=Path,default=P.parents[1]);a=ap.parse_args();print(json.dumps(verify(a.repo_root.resolve()),indent=2))
if __name__=='__main__':main()
