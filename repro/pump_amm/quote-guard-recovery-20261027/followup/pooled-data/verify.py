"""Portable, read-only replay of exact pooled-data byte-range evidence."""
from pathlib import Path
import argparse, collections, hashlib, json, struct, sys, types
W=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
CANDIDATE='be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6'
SYMBOLS='39420099acbe3f90c1e62d449e8892775b751f8c84aa61ac78c8425fdf9c2af3'

def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def module(name):
 p=W/(name+'.py');m=types.ModuleType(name);m.__file__=str(p);sys.modules[name]=m
 exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def range_equal(original,candidate,a,b,n):
 return n>0 and len(original[a:a+n])==n and len(candidate[b:b+n])==n and original[a:a+n]==candidate[b:b+n]

def negative_controls(o,c,rows):
 unique={(r['original_pointer'],r['candidate_pointer'],r['bytes']):r for r in rows};tail=shift=wrong=0;by_width=collections.defaultdict(set)
 for a,b,n in unique:by_width[n].add(b)
 for (a,b,n),r in unique.items():
  assert range_equal(o.b,c.b,a,b,n)
  changed=bytearray(c.b[b:b+n]);changed[-1]^=1
  assert bytes(changed)!=o.b[a:a+n];tail+=1
  if c.b[b+1:b+1+n]!=o.b[a:a+n]:
   assert not range_equal(o.b,c.b,a,b+1,n);shift+=1
  alternate=next((x for x in sorted(by_width[n])if c.b[x:x+n]!=o.b[a:a+n]),None)
  if alternate is not None:
   assert not range_equal(o.b,c.b,a,alternate,n);wrong+=1
 assert tail==55 and shift>=50 and wrong==55
 groups=collections.Counter((r['original_pointer'],r['candidate_pointer'],r['bytes'])for r in rows)
 return {'tail_byte_mutations_rejected':tail,'one_byte_pointer_shifts_rejected':shift,'same_width_other_literal_substitutions_rejected':wrong,'positive_shared_literal_groups':sum(n>1 for n in groups.values()),'positive_shared_literal_observations':sum(n for n in groups.values()if n>1),'scope':'All controls compare in-memory byte slices; no executable bytes or files are modified. Same-width substitutions are deliberately wrong pairings, not claims of actual linker aliases.'}

def object_starts(symbols):
 b=Path(symbols).read_bytes();off=struct.unpack_from('<Q',b,40)[0];size,count=struct.unpack_from('<HH',b,58);ss=[struct.unpack_from('<IIQQQQIIQQ',b,off+i*size)for i in range(count)];out=set()
 for s in ss:
  if s[1]!=2:continue
  for p in range(s[4],s[4]+s[5],24):
   _,info,_,_,value,n=struct.unpack_from('<IBBHQQ',b,p)
   if info&15==1 and n:out.add(value)
 return out

def verify(root,candidate=None,symbols=None,original=None):
 root=Path(root).resolve();base=root/'repro/pump_amm/quote-guard-recovery-20261027/results/build';candidate=Path(candidate or base/'candidate.so');symbols=Path(symbols or base/'unstripped.so');original=Path(original or root/'evidence/original/pump_amm/deployed.so')
 assert (sha(original),sha(candidate),sha(symbols))==(ORIGINAL,CANDIDATE,SYMBOLS)
 manifest=json.loads((W/'manifest.json').read_bytes());actual={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'};assert actual==manifest['files']
 reader=module('elf_reader');o,c,s=reader.Elf(original),reader.Elf(candidate),reader.Elf(symbols);fs={f['start']:f for f in s.funcs};starts=object_starts(symbols)
 rows=json.loads((W/'input-observations.json').read_bytes());assert len(rows)==280 and len({r['original_pointer']for r in rows})==66
 closure=json.loads((W/'inputs/call-closure.json').read_bytes());assert (closure['candidate_sha256'],closure['symbols_sha256'],closure['original_sha256'])==(CANDIDATE,SYMBOLS,ORIGINAL)
 pairs={(r['original'],r['candidate'])for r in closure['pairs']}
 for row in rows:
  a,b,off=row['original'],row['candidate'],row['offset'];f=fs[b];n=f['size'];assert(a,b)in pairs
  assert o.normalized[a:a+n]==c.normalized[b:b+n]and o.pattern(a,n)==c.pattern(b,n)
  assert row['candidate_pointer']not in starts
  for e,start,k in[(o,a,'original_pointer'),(c,b,'candidate_pointer')]:
   at=start+off;assert e.relocations[at]['type']==8 and e.b[at]==0x18
   p=struct.unpack_from('<I',e.b,at+4)[0]|struct.unpack_from('<I',e.b,at+12)[0]<<32;assert p==row[k]
 sl=module('slices').analyze(root,original,candidate,symbols,W/'input-observations.json');assert sl==json.loads((W/'slices.json').read_bytes());assert(sl['bounded_observations'],sl['unique_bounded_ranges'],sl['mismatches'])==(236,54,0)
 consumers=json.loads((W/'consumer-callees.json').read_bytes());assert len(consumers['consumers'])==16 and consumers['all_direct_calls_equal']
 for rec in consumers['consumers']:
  a,b=rec['original'],rec['candidate'];f=rec['consumer'];assert f==fs[b]
  assert o.normalized[a:a+f['size']]==c.normalized[b:b+f['size']]and o.pattern(a,f['size'])==c.pattern(b,f['size'])
  calls=[]
  for pc,ct in sorted(c.calls.items()):
   if not b<=pc<b+f['size']:continue
   ot=o.calls[a+pc-b];g=fs[ct]
   equal=o.normalized[ot:ot+g['size']]==c.normalized[ct:ct+g['size']]and o.pattern(ot,g['size'])==c.pattern(ct,g['size'])
   assert equal
   calls.append({'offset':pc-b,'original_target':ot,'candidate_target':ct,'candidate_name':g['name'],'bytes':g['size'],'normalized_body_and_relocations_equal':equal})
  assert calls==rec['direct_calls']
 assert sum(len(r['direct_calls'])for r in consumers['consumers'])==153
 ix=module('indexed').analyze(original,candidate,symbols,W/'input-observations.json');assert ix==json.loads((W/'indexed.json').read_bytes());assert(ix['observations'],ix['unique_ranges'],ix['mismatches'])==(12,1,0)
 assert all((r['index_min'],r['index_max'],r['bytes'])==(0,15,16)for r in ix['rows']);assert all(bytes.fromhex(r['original_hex'])==b'0123456789abcdef'for r in ix['rows'])
 cl=module('clusters').analyze(original,W/'input-observations.json',W/'inputs/call-closure.json',sl,ix);assert cl==json.loads((W/'clusters.json').read_bytes());assert(cl['exact_pointer_relocations'],cl['code_relocations_in_unmatched_owners'])==(286,19)
 combined=sl['rows']+ix['rows'];keys={(r['original'],r['candidate'],r['offset'])for r in combined};assert len(keys)==248
 remaining=[r for r in rows if(r['original'],r['candidate'],r['offset'])not in keys];assert remaining==json.loads((W/'remaining.json').read_bytes())['rows']and len(remaining)==32
 assert json.loads((W/'provenance.json').read_bytes())['candidate_sha256']==CANDIDATE
 neg=negative_controls(o,c,combined)
 naive=sum(not r['equal_first64']for r in rows)
 return {'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':CANDIDATE,'original_target_clusters':66,'input_observations':280,'bounded_observations':248,'unique_bounded_ranges':55,'range_mismatches':0,'proven_consumer_bodies':16,'matched_one_hop_consumer_calls':153,'remaining_observations':32,'exact_pointer_relocations':286,'unmatched_owner_code_relocations':19,'unmatched_owner_functions':len({u['owner']for t in cl['clusters']for u in t['exact_pointer_users']if u['kind']=='code'and not u['owner_has_equal_body_candidate']}),'naive_64_byte_disagreements':naive,'negative_controls':neg,'source_change_proposed':False,'scope':'Actual bounded uses of pooled static values only; original whole allocations, remaining dynamic/indirect reads, full data closure, and whole-ELF identity remain unproved.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);p.add_argument('--original',type=Path);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols,a.original),indent=2))
