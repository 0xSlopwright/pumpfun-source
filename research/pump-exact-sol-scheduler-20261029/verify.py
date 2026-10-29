#!/usr/bin/env python3
"""Replay saved compiler evidence only; never compile or execute program code."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,re,struct,sys,tarfile,tempfile,tomllib
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent
SYMBOL='_ZN14pump_recovered14pump_recovered16buy_exact_sol_in17h28eae2e2fdc8f8b2E'
OLD=b'  %_208.0.i = extractvalue { i64, ptr } %104, 0\r\n  %_208.1.i = extractvalue { i64, ptr } %104, 1\r\n'
NEW=b'  %_208.1.i = extractvalue { i64, ptr } %104, 1\r\n  %_208.0.i = extractvalue { i64, ptr } %104, 0\r\n'
def require(value,message):
 if not value:raise AssertionError(message)
def sha(b):return hashlib.sha256(b).hexdigest()
def read(p):
 b=p.read_bytes();return gzip.decompress(b) if p.suffix=='.gz' else b
def js(p):return json.loads(read(p))
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def manifest(packet):
 expected=js(packet/'MANIFEST.json');actual={p.relative_to(packet).as_posix():sha(p.read_bytes()) for p in packet.rglob('*') if p.is_file() and p.name!='MANIFEST.json'}
 require(not any(p.is_symlink() for p in packet.rglob('*')),'packet symlink')
 require(actual==expected,'packet membership/hash mismatch');return len(expected)
def object_target(audit,path):
 e=audit.Elf(path);fs=[f for f in e.symbols if f['name']==SYMBOL and f['size'] and f['kind']==2];require(len(fs)==1,'target symbol ambiguity')
 f=fs[0];sec=e.headers[f['section']];start=sec[4]+f['address']-sec[3];raw=e.data[start:start+f['size']];require(len(raw)==f['size'],'truncated target');relocs=[]
 for h in e.headers:
  if h[1] not in [4,9] or h[7]!=f['section']:continue
  sh=e.headers[h[6]];require(sh[1]==2,'relocation symbol table');strings=e.headers[sh[6]]
  for offset in range(h[4],h[4]+h[5],h[9]):
   addr,info=struct.unpack_from('<QQ',e.data,offset)
   if not f['address']<=addr<f['address']+f['size']:continue
   sym=struct.unpack_from('<IBBHQQ',e.data,sh[4]+24*(info>>32));p=strings[4]+sym[0];name=e.data[p:e.data.index(b'\0',p)].decode()
   relocs.append({'offset':addr-f['address'],'type':info&0xffffffff,'symbol':name,'addend':struct.unpack_from('<q',e.data,offset+16)[0] if h[1]==4 else None})
 return raw,relocs
def normalize_object(raw,relocs):
 out=bytearray(raw);seen=set()
 for r in relocs:
  i=r['offset'];require(i%8==0 and i not in seen and 0<=i<len(raw),'invalid/duplicate relocation');seen.add(i)
  if r['type']==1:
   require(i+16<=len(raw) and raw[i]==0x18 and raw[i+8]==0,'invalid LDDW relocation');out[i+4:i+8]=b'\0'*4;out[i+12:i+16]=b'\0'*4
  elif r['type']==10:
   require(raw[i:i+2]==b'\x85\x10','invalid internal call relocation');out[i+4:i+8]=b'\0'*4
  else:raise AssertionError('unsupported relocation type')
 return bytes(out)
def counterfactual(a,b,raw,changed,relocs,changed_relocs):
 require(a.count(OLD)==1 and b==a.replace(OLD,NEW),'IR change is not exactly the two extracts')
 require(len(raw)==len(changed)==13224,'target size changed')
 require(relocs==changed_relocs,'counterfactual relocations changed')
 slots=[i//8 for i in range(0,len(raw),8) if raw[i:i+8]!=changed[i:i+8]]
 require(slots==[1003,1004],'unexpected changed instruction slots')
 require(raw[8024:8040]==bytes.fromhex('79a160f90000000079a358f900000000'),'control load pair')
 require(changed[8024:8040]==bytes.fromhex('79a358f90000000079a160f900000000'),'counterfactual load pair')
 require(sum(x!=y for x,y in zip(raw,changed))==4,'unexpected differing bytes');return slots
def schedule(trace,order):
 s=trace.decode();start=s.index('********** List Scheduling %bb.53 ');end=s.index('********** List Scheduling',start+20);block=s[start:end]
 require('TargetConstant:i64<133>' in block,'Source133 anchor missing')
 rows=re.findall(r'^\*\*\* Scheduling \[(\d+)\]: SU\((\d+)\):.*LDD_V1<Mem:\(load \(s64\) from %stack\.107(?: \+ (8))?\)>.*$',block,re.M)
 rows=[(int(step),int(node),8 if off else 0) for step,node,off in rows]
 require([(r[0],r[2]) for r in rows]==[(3,order[0]),(5,order[1])],'unexpected bottom-up load order')
 chosen=rows[0][1];require(f'RegPressureDiff SU(33): 1 != SU({chosen}): -1' in block,'register-pressure decision missing');return rows
def stock_boundary(trace):
 s=trace.decode();heads=list(re.finditer(r'^.*IR Dump (?:Before|After).+$',s,re.M));require(len(heads)==392,'stock pass count')
 parts=[s[h.end():heads[i+1].start() if i+1<len(heads) else len(s)] for i,h in enumerate(heads)]
 first=next(i for i,p in enumerate(parts) if '# Machine code for function' in p);require(first==276,'first captured machine boundary')
 require('%392 = extractvalue { i64, ptr } %391, 0' in parts[first-1] and '%393 = extractvalue { i64, ptr } %391, 1' in parts[first-1],'last LLVM extract order')
 m=parts[first];a=m.index('%81:gpr = LDD_V1 %stack.107, 8');b=m.index('%80:gpr = LDD_V1 %stack.107, 0');require(a<b,'first machine load order');return first
def sdk_features(packet,build):
 # The retained target specification omits cpu, whose recorded invocation uses
 # generic; its explicit feature list must reach every qualified LLC command.
 spec_path=packet/'inputs/stock-target-spec.json'
 require(sha(spec_path.read_bytes())=='e078e6f5c261e3d472d5b04b4fc7e2c0bed0c108786e4ecebc359521121eefa6','stock SDK target specification changed')
 spec=js(spec_path);require(spec['arch']=='sbf' and spec['llvm-target']=='sbf' and spec.get('cpu','generic')=='generic' and spec['features']=='+store-imm,+jmp-ext','stock SDK CPU/features changed')
 expected_cpu='-mcpu='+spec.get('cpu','generic');expected_features='-mattr='+spec['features']
 names=['observations/qualification03-sdk-features/whole-module-launch.json.gz','observations/extracted01/compile-launch.json.gz','observations/scheduler01/launch.json.gz',*[f'observations/extract-order02/{kind}-launch.json.gz' for kind in ['control','swapped']]]
 for name in names:
  launch=js(packet/name);command=launch['command']
  require(launch['tool_sha256']==build['outputs']['llc.exe'],'qualified SDK-feature tool binding')
  require([arg for arg in command if arg.startswith('-mcpu')]==[expected_cpu],'qualified SDK CPU flag')
  require([arg for arg in command if arg.startswith('-mattr')]==[expected_features],'qualified SDK feature flags')
  if 'qualification03-sdk-features' in name:
   result=js(packet/'observations/qualification03-sdk-features/whole-module-result.json.gz')
   require(all(result[key]==launch[key] for key in ['command','cwd','environment','tool_sha256']),'qualified launch/result mismatch')
 return len(names)
def verify(repo,packet=P):
 count=manifest(packet);pin=js(packet/'PROVENANCE.json');parent=repo/pin['source_packet']
 require(sha((parent/'MANIFEST.json').read_bytes())==pin['source_packet_manifest_sha256'],'parent seal changed')
 require(sha((parent/'audit_target.py').read_bytes())==pin['parent_audit_sha256'],'parent reader changed')
 require(sha((parent/'SOURCE.json').read_bytes())==pin['source_record_sha256'],'parent source record changed')
 require(sha((repo/'evidence/original/pump/deployed.so').read_bytes())==pin['original_image_sha256'],'original image changed')
 audit=module('pump_scheduler_parent_audit',parent/'audit_target.py');source=js(parent/'SOURCE.json');binding=js(packet/'inputs/source-binding.json.gz')
 require(binding['source']['candidate']==source['candidate_inputs'] and len(source['candidate_inputs'])==66,'source binding mismatch')
 for label in ['02-guard','05-passive-stages','06-bitcode-object']:
  launch=js(packet/f'build/windows/{label}/launch.json.gz');result=js(packet/f'build/windows/{label}/result.json.gz')
  require(launch['source_inputs']==source['candidate_inputs'],'compiled source mismatch')
  require(result['returncode']==0 and result['source_unchanged'] and result['target_executions']==0,'stock compilation result')
 require(js(packet/'build/windows/02-guard/result.json.gz')['rustc_commands']==210,'fresh rustc census')
 logs=read(packet/'build/windows/02-guard/stderr.log.gz').decode()
 require(sum(x.strip().startswith('Running `') and 'rustc.exe' in x for x in logs.splitlines())==210,'fresh compile log census')
 require(not any(x.strip().startswith('Fresh ') for x in logs.splitlines()),'fresh compile reused artifacts')
 archive=parent/'source-candidate.tar.gz';require(sha(archive.read_bytes())==js(parent/'MANIFEST.json')['source-candidate.tar.gz'],'parent source archive changed')
 with tarfile.open(archive,'r:gz') as tf:
  members=[m for m in tf if not m.isdir()];require(all(m.isfile() for m in members) and len(members)==66,'source archive members')
  files={m.name:tf.extractfile(m).read() for m in members};require({n:sha(b) for n,b in files.items()}==source['candidate_inputs'],'source archive file hashes')
  lock=tomllib.loads(files['Cargo.lock'].decode())
 packages={x['name']+'-'+x['version']:x['checksum'] for x in lock['package'] if x.get('source','').startswith('registry+')}
 require(len(packages)==254 and packages=={x['package']:x['archive_sha256'] for x in binding['registry']},'locked dependency binding')
 sources=js(packet/'compiler/sources.json.gz');inventory=js(packet/'build/diagnostic/source-inventory.json.gz')
 require(len(sources)==13,'compiler source count')
 for row in sources:
  b=row['content'].encode();require(sha(b)==row['sha256']==inventory[row['path']],'compiler source digest')
  require(hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==row['git_blob'],'compiler Git blob')
 build=js(packet/'build/diagnostic/build-result.json.gz');require(build['returncode']==0 and build['source_unchanged'],'diagnostic build result')
 qualified_feature_commands=sdk_features(packet,build)
 cache=read(packet/'build/diagnostic/CMakeCache.txt.gz').decode();require('LLVM_ENABLE_ASSERTIONS:BOOL=ON' in cache and 'LLVM_TARGETS_TO_BUILD:STRING=SBF' in cache,'diagnostic build configuration')
 gitlink=js(packet/'build/diagnostic/sdk-gitlink.json.gz');require(gitlink['sha']==pin['llvm_source_revision'],'SDK LLVM gitlink')
 text_binding=js(packet/'observations/text-binding02/result.json.gz');text_launch=js(packet/'observations/text-binding02/launch.json.gz')
 require(text_binding['returncode']==0 and text_binding['complete_text_equal_to_control'],'text disassembly repeat')
 require(text_binding['output_sha256']==sha(read(packet/'inputs/control.ll.gz')),'text control binding')
 require(text_launch['input_sha256']==sha(read(packet/'inputs/extracted.bc.gz')),'text bitcode binding')
 require(text_launch['tool_sha256']==build['outputs']['llvm-dis.exe'],'text tool binding')
 first_machine=stock_boundary(read(packet/'traces/stock-passes.log.gz'))
 passive=js(packet/'build/windows/05-passive-stages/result.json.gz');require(passive['logs']['stderr.log']['sha256']==sha(read(packet/'traces/stock-passes.log.gz')),'stock pass log binding')
 for kind in ['control','swapped']:
  result=js(packet/f'observations/extract-order02/{kind}-result.json.gz');launch=js(packet/f'observations/extract-order02/{kind}-launch.json.gz')
  require(result['returncode']==0 and result['logs']['stderr']['sha256']==sha(read(packet/f'traces/{kind}-scheduler.log.gz')),'scheduler log binding')
  require(launch['tool_sha256']==build['outputs']['llc.exe'] and launch['input_sha256']==sha(read(packet/f'inputs/{kind}.ll.gz')),'scheduler input/tool binding')
 with tempfile.TemporaryDirectory(prefix='pump-scheduler-') as tmp:
  temp=Path(tmp);paths={}
  for f in (packet/'outputs').glob('*.gz'):
   p=temp/f.stem;p.write_bytes(read(f));paths[f.stem]=p
  guard=audit.Elf(paths['guard.so']);capture=audit.Elf(paths['capture.so']);original=audit.Elf(repo/'evidence/original/pump/deployed.so')
  require(js(packet/'build/windows/02-guard/result.json.gz')['symbols_sha256']==sha(guard.data),'guard output binding')
  require(passive['whole_output_equal'] and passive['symbols_sha256']==sha(guard.data),'passive output binding')
  emission=js(packet/'build/windows/06-bitcode-object/result.json.gz');require(not emission['whole_output_equal'],'emission whole-ELF failure must remain visible')
  for name,data in [('symbols.so',capture.data),('root.o',paths['stock-root.o'].read_bytes()),('root.bc',read(packet/'inputs/stock-root.bc.gz'))]:require(emission['outputs'][name]['sha256']==sha(data),'emission output binding')
  require(set(guard.sections)==set(capture.sections),'capture section membership')
  changed_sections=[n for n in guard.sections if guard.section_bytes(n)!=capture.section_bytes(n)]
  require(changed_sections==['.symtab','.strtab'],'bitcode capture changed code/data/relocations')
  require(guard.data!=capture.data and guard.target()['raw']==capture.target()['raw'],'capture qualification scope')
  targets={n:object_target(audit,p) for n,p in paths.items() if n.endswith('.o')}
  stock=targets['stock-root.o'];require(targets['diagnostic-root.o']==stock,'diagnostic target/relocations differ from stock')
  for label,name in [('qualification01','failed-triple.o'),('qualification02-module-triple','failed-features.o'),('qualification03-sdk-features','diagnostic-root.o')]:
   result=js(packet/f'observations/{label}/whole-module-result.json.gz');require(result['returncode']==0 and result['tool_sha256']==build['outputs']['llc.exe'],'diagnostic run binding')
   require(list(result['outputs'].values())==[sha(paths[name].read_bytes())],'diagnostic object receipt')
  require(paths['stock-root.o'].read_bytes()!=paths['diagnostic-root.o'].read_bytes(),'whole-object scope unexpectedly changed')
  require(len(stock[0])==13224 and len(stock[1])==144,'stock target dimensions')
  require(normalize_object(*stock)==guard.target()['norm'],'stock object not bound to linked target')
  require(targets['extracted.o'][0]==stock[0],'extraction changed instructions')
  a,b=stock[1],targets['extracted.o'][1];require(len(a)==len(b),'extraction relocation count')
  renamed=[]
  for x,y in zip(a,b):
   require({k:v for k,v in x.items() if k!='symbol'}=={k:v for k,v in y.items() if k!='symbol'},'extraction relocation sites changed')
   if x!=y:require(x['symbol']=='.L'+y['symbol'] and x['type']==1,'unexpected extraction symbol change');renamed.append(x['offset'])
  require(len(renamed)==41,'extraction local-prefix rename count')
  require(paths['extracted.o'].read_bytes()==paths['traced-extracted.o'].read_bytes(),'scheduler tracing changed object')
  require(targets['control.o']==targets['extracted.o'],'IR text control changed code/relocations')
  slots=counterfactual(read(packet/'inputs/control.ll.gz'),read(packet/'inputs/swapped.ll.gz'),targets['control.o'][0],targets['swapped.o'][0],targets['control.o'][1],targets['swapped.o'][1])
  norm=normalize_object(*targets['swapped.o']);require(norm==original.target(True)['norm'],'counterfactual normalized target mismatch')
  expected_sites={(r['offset'],10 if r['kind']=='direct-call' else 1) for r in original.target(True)['refs']}
  require(expected_sites=={(r['offset'],r['type']) for r in stock[1]},'original relocation-mask sites differ')
  for name in ['failed-triple.o','failed-features.o']:require(targets[name][0]!=stock[0] and len(targets[name][0])==13784,'failed LLC control not retained')
 control_steps=schedule(read(packet/'traces/control-scheduler.log.gz'),[0,8]);swapped_steps=schedule(read(packet/'traces/swapped-scheduler.log.gz'),[8,0])
 report={'sealed_files':count,'source_inputs':66,'qualified_SDK_feature_commands':qualified_feature_commands,'locked_archives':254,'compiler_source_git_blobs':len(sources),'diagnostic_target_raw_bytes':13224,'diagnostic_target_relocations':144,'stock_first_machine_snapshot':first_machine,'extraction_data_symbol_prefix_changes':41,'ir_changed_lines':2,'changed_instruction_slots':slots,'changed_instruction_bytes':4,'control_bottom_up_loads':control_steps,'counterfactual_bottom_up_loads':swapped_steps,'counterfactual_normalized_sha256':sha(norm),'stock_capture_changed_sections':changed_sections,'canonical_artifact_or_count_updates':False,'target_executions':0,'scope':'Saved evidence consistency, not cryptographic execution attestation. Edited IR is a diagnostic counterfactual, not reconstructed Rust or a selected executable.'}
 return report
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--repo-root',type=Path,default=P.parents[1]);a=ap.parse_args();print(json.dumps(verify(a.repo_root.resolve()),indent=2))
if __name__=='__main__':main()
