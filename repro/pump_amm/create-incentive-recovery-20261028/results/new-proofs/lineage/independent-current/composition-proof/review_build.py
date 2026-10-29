from pathlib import Path
import hashlib,json,struct,sys
W=Path(__file__).resolve().parent;R=W.parents[1];sys.path.insert(0,str(W));from elf_reader import Elf;import measure
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
O=Elf(W/'original.so');C=Elf(W/'build/artifacts/pump_amm_recovered.so');S=Elf(W/'build/artifacts/unstripped.so');B=Elf(W/'baseline/artifacts/pump_amm_recovered.so');BS=Elf(W/'baseline/artifacts/unstripped.so')
assert sha(C.path)=='9e4891b1a25fc8f7413e1e9f2ed8e5730a1c39301e306ab68fc4e82acfd952c3'
m,rows=measure.measured(O,C,S,B,BS);assert(m['normalized'],m['raw'],m['windows'])==(660,159,785);assert all(m[x]==[]for x in ['normalized_gains','normalized_losses','raw_gains','raw_losses'])
record=json.loads((W/'build/build-comparison.json').read_bytes());assert record['returncode']==0 and record['source_unchanged'] and record['source_sha256']==record['source_after_sha256']and record['dependency_cache_before']==record['dependency_cache_after']and len(record['dependency_cache_before'])==765
src={str(p.relative_to(W/'source')):sha(p)for p in(W/'source').rglob('*')if p.is_file()};recorded=record['source_sha256'];prefix=next(k for k in recorded if k.endswith('programs/pump-amm/Cargo.toml')).removesuffix('programs/pump-amm/Cargo.toml');assert {k[len(prefix):]:v for k,v in recorded.items()if k.startswith(prefix)}==src and len(src)==57 and len(recorded)==232
ins=lambda e,p:struct.unpack_from('<BBhi',e.b,p)
def f(e,needle):return next(v for v in e.funcs if needle in v['name'])
def body(e,fn):return e.normalized[fn['start']:fn['start']+fn['size']],e.pattern(fn['start'],fn['size'])
comp=[]
for needle,location,size,oldsize in [('11create_pool7execute17','amm-create-pool-arguments-next-20261028',10048,10240),('18pump_amm_recovered29admin_update_token_incentives17','amm-incentive-mint-snapshot-only-next-20261028',3128,3168)]:
 T=Elf(W/'isolated'/location/'build/artifacts/pump_amm_recovered.so');TS=Elf(W/'isolated'/location/'build/artifacts/unstripped.so');fn=f(S,needle);peer=f(TS,needle);assert fn['size']==peer['size']==size and body(C,fn)==body(T,peer)
 pairs=[]
 for a,b in zip(C.callsites(fn['start'],fn['size']),T.callsites(peer['start'],peer['size'])):
  x=next(v for v in S.funcs if v['start']==a['target']);y=next(v for v in TS.funcs if v['start']==b['target']);assert a['offset']==b['offset']and x['size']==y['size']and body(C,x)==body(T,y);pairs.append({'offset':a['offset'],'target':hex(a['target']),'size':x['size']})
 comp.append({'name':needle,'start':fn['start'],'size':size,'original_size':oldsize,'isolated_full_normalized_body_equal':True,'internal_callees_equal_to_isolated':pairs})
create=comp[0];a=0x2ba60;b=create['start'];assert len(create['internal_callees_equal_to_isolated'])==66
for off,word in [(64,24),(80,16),(96,8),(112,0)]:assert ins(O,a+off)==ins(C,b+off)==(0x79,0x12 if word else 0x11,word,0)
def ptr(e,p):assert e.b[p]==0x18 and e.relocations[p]['type']==8;return int.from_bytes(e.b[p+4:p+8],'little')|(int.from_bytes(e.b[p+12:p+16],'little')<<32)
op,np=ptr(O,a+320),ptr(C,b+328);key=bytes.fromhex('0156e0f693665acf44db1568bf175baa5189cb97f5d2ff3b655d2bb6fd6d18b0');assert O.b[op:op+32]==C.b[np:np+32]==key
# Actual strcmp-style comparator arguments: original creator snapshot, then PDA output.
assert ins(O,a+416)==(0x07,0x01,0,-0x358)and ins(O,a+432)==(0x07,0x02,0,-0x28)
assert ins(C,b+360)==(0x07,0x01,0,-0x28)and ins(C,b+368)==(0xbf,0x62,0,0)
admin=comp[1];a=admin['start'];assert len(admin['internal_callees_equal_to_isolated'])==11
for off,expected in [(120,'7b1a10ff00000000'),(256,'7b1a08f000000000'),(824,'79a210ff00000000'),(1464,'79a110ff00000000'),(32,'7127220000000000')]:assert C.b[a+off:a+off+8].hex()==expected,(off,C.b[a+off:a+off+8].hex())
r={'passed':True,'candidate_sha256':sha(C.path),'symbols_sha256':sha(S.path),'measurement':m,'handlers':comp,'create_original_pump_pointer':hex(op),'create_current_pump_pointer':hex(np),'create_creator_snapshot_before_pda':True,'create_original_memcmp_argument_order_restored':True,'mint_snapshot_for_helper_and_both_events':True,'context_borrow_change_absent':True,'original_late_bump_recovered':False,'source_inputs':232,'unchanged_cached_dependencies':765,'scope':'Independent saved-source and instruction review only. Full handlers remain unmatched; current runtime acceptance and strict repeat are separate worker gates.'}
