#!/usr/bin/env python3
"""Costs reference audit. No builds; writes only new evidence JSON.
CALL identity uses complete official-narrow-normalized callee bodies.
Data checks are bounded objects/classes, not recursive transitive closure.
"""
from pathlib import Path
import collections,csv,json,struct,sys
sys.dont_write_bytecode=True
from audit_costs_refs import Elf,sha
B=Path(__file__).resolve().parent
R=B.parent.parent/'pumpfun-source'
L=Path('/home/ahi200/pumpfun-work/20261029-pump-legacy-exact-sol')
es={'original':Elf(R/'evidence/original/pump/deployed.so'),
    'parent':Elf(L/'costs-parent/symbols.so'),
    'candidate':Elf(L/'costs-direct-gross/symbols.so')}
ts={k:e.target(k=='original') for k,e in es.items()}
windows={int(r['original_start']):int(r['original_end'])-int(r['original_start'])
 for r in csv.DictReader((R/'repro/reconstruction-status-2026-10-26/functions.tsv').open(),delimiter='\t')
 if r['program']=='pump' and r['variant']=='selected'}
def fun(k,address):
 e=es[k]
 sizes=[windows[address]] if k=='original' and address in windows else sorted({f['size'] for f in e.functions if f['address']==address})
 out=[]
 for size in sizes:
  raw=e.body(address,size);norm,refs=e.normalize(raw,address)
  out.append({'bytes':size,'raw_sha256':sha(raw),'normalized_sha256':sha(norm),'masked_operands':len(refs)})
 return {'address':hex(address),'names':[f['name'] for f in e.functions if f['address']==address],'bodies':out}
def key(f):
 return [(x['bytes'],x['normalized_sha256']) for x in f['bodies']]
calls={k:[r for r in t['refs'] if r['kind']=='direct-call'] for k,t in ts.items()}
calltargets={k:{r['target']:fun(k,r['target']) for r in rr} for k,rr in calls.items()}
rows=[]
canonical={}
for oa,of in sorted(calltargets['original'].items()):
 row={'original':of,'multiplicity':{}}
 for k in es:
  matches=[a for a,f in calltargets[k].items() if key(f)==key(of)]
  row[k+'_matching_addresses']=[hex(x) for x in matches]
  assert len(matches)==1,(k,hex(oa),matches)
  a=matches[0];canonical[k,a]=hex(oa)
  row[k+'_callee']=calltargets[k][a]
  row['multiplicity'][k]=sum(r['target']==a for r in calls[k])
 row['multiplicities_equal']=len(set(row['multiplicity'].values()))==1
 rows.append(row)
seq={k:[canonical[k,r['target']] for r in rr] for k,rr in calls.items()}
def at(e,address,size):
 for name,s in e.sections.items():
  if s['addr']>0 and s['addr']<=address and address+size<=s['addr']+s['size']:
   p=s['offset']+address-s['addr'];return e.data[p:p+size]
 raise AssertionError((hex(address),size))
def section(e,address):
 return next((n for n,s in e.sections.items() if s['addr']>0 and s['addr']<=address<s['addr']+s['size']),None)
def encoded_ptr(e,word):
 if section(e,word): return word,'direct-address'
 if word&0xffffffff==0 and section(e,word>>32): return word>>32,'ELF-high32-address-field'
 return None,'unresolved'
strings=[('buyback_subtraction_panic',b'buyback_fee never exceeds protocol_fee'),
 ('buyback_conversion_panic',b'buyback fee is at most protocol_fee'),
 ('display_panic',b'a Display implementation returned an error unexpectedly'),
 ('source_filename',b'programs/pump/src/trade_v3.rs')]
data={}
for k,e in es.items():
 out=[]
 for r in ts[k]['refs']:
  if r['kind']!='elf-pointer':continue
  addr=r['value'];sn=r['sections'][0];rec={'instruction_offset':r['offset'],'address':hex(addr),'section':sn}
  if sn=='.rodata':
   found=next(((label,s) for label,s in strings if at(e,addr,len(s))==s),None)
   if found:
    label,raw=found;rec.update({'class':label,'bounded_bytes':len(raw),'content':raw.decode(),'content_sha256':sha(raw)})
   elif at(e,addr,4)==struct.pack('<I',24):
    rec.update({'class':'PumpError enum discriminant','bounded_bytes':4,'value':24})
   else:rec.update({'class':'unresolved_rodata','prefix_hex':at(e,addr,32).hex()})
  else:
   assert sn=='.data.rel.ro'
   w=struct.unpack('<3Q',at(e,addr,24))
   if (w[1],w[2]) in [(24,8),(0,1)]:
    size=48 if w[1]==24 else 32;ww=struct.unpack('<'+'Q'*(size//8),at(e,addr,size))
    rec.update({'class':'vtable','bounded_bytes':size,'object_size':w[1],'object_align':w[2],'function_fields':[]})
    for i in [0]+list(range(3,len(ww))):
     fa,encoding=encoded_ptr(e,ww[i]);assert fa is not None and section(e,fa)=='.text'
     f=fun(k,fa);assert f['bodies'],(k,hex(fa))
     rec['function_fields'].append({'field':i,'encoding':encoding,'target':f})
   else:
    sa,encoding=encoded_ptr(e,w[0]);assert sa is not None and section(e,sa)=='.rodata'
    raw=at(e,sa,w[1])
    rec.update({'class':'panic_location','bounded_bytes':24,'pointer_encoding':encoding,'filename':raw.decode(),'filename_bytes':w[1],'line':w[2]&0xffffffff,'column':w[2]>>32})
  out.append(rec)
 data[k]=out
def semantic(r):
 c=r['class']
 if c=='vtable':
  return (c,r['bounded_bytes'],r['object_size'],r['object_align'],tuple((f['field'],tuple(key(f['target']))) for f in r['function_fields']))
 if c=='panic_location':return(c,r['filename'],r['line'],r['column'])
 if c=='PumpError enum discriminant':return(c,r['value'])
 return(c,r.get('content_sha256'))
sem={k:[semantic(r) for r in rr] for k,rr in data.items()}
summary={'scope':'Bounded one-hop audit. Callee own masked operands are not recursively validated. Vtable fields checked one level by full normalized function body; location file/line/column and bounded strings checked exactly.',
 'images':{k:{'path':str(e.path),'sha256':sha(e.data)} for k,e in es.items()},
 'calls':{'sites':{k:len(v) for k,v in calls.items()},'distinct_targets':{k:len(v) for k,v in calltargets.items()},
 'original_to_parent_and_candidate_all_callees_full_normalized_equal':True,'multiplicities_all_equal':all(r['multiplicities_equal'] for r in rows),
 'original_candidate_order_equal':seq['original']==seq['candidate'],'original_parent_order_equal':seq['original']==seq['parent'],'sequences_by_original_target':seq,'rows':rows},
 'data':{'sites':{k:len(v) for k,v in data.items()},'parent_candidate_bounded_class_multiset_equal':collections.Counter(sem['parent'])==collections.Counter(sem['candidate']),
 'original_candidate_bounded_class_multiset_equal':collections.Counter(sem['original'])==collections.Counter(sem['candidate']),
 'original_candidate_bounded_class_sequence_equal':sem['original']==sem['candidate'],'rows':data},
 'script_sha256':sha(Path(__file__).read_bytes())}
out=B/'costs-reference-audit'/'original-reference-classes.json'
assert not out.exists(),out
out.write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps({'output':str(out),'calls':{k:v for k,v in summary['calls'].items() if k not in ['rows','sequences_by_original_target']},'data':{k:v for k,v in summary['data'].items() if k!='rows'}},indent=2))

