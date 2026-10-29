#!/usr/bin/env python3
"""Audit actual call closure of every published normalized Pump673 pair.

Read-only original/current ELF + official inventory; no code/layout mutation,
compiler, VM, proposed match, semantic-equivalence or byte-count increase.
"""
from pathlib import Path
from collections import Counter,defaultdict
import argparse,gzip,hashlib,json,struct

REVISION='1285b5e9e3a29c1e2cf32246d6046035e5d66fad'
HASHES={
 'original':'7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d',
 'candidate':'49df399b8a36a0a60de03e8d55f1417261dc451e44845ca9d17a94040968c680',
 'inventory':'c66bb5ece1676933838403fa99c120b636eba9c3db4e543bb32d614bcac6451d'}
sha=lambda b:hashlib.sha256(b).hexdigest()

class ELF:
 def __init__(self,data):
  assert data[:6]==b'\x7fELF\x02\x01'
  assert struct.unpack_from('<H',data,16)[0]==3,'Expected linked ET_DYN SBPF'
  self.data=data;table=struct.unpack_from('<Q',data,40)[0]
  width,count,names=struct.unpack_from('<HHH',data,58)
  sections=[struct.unpack_from('<IIQQQQIIQQ',data,table+i*width) for i in range(count)]
  self.sections=sections;strings=self.slice_section(sections[names])
  self.named={self.string(strings,s[0]):s for s in sections}
  self.symbol_tables={};self.functions=defaultdict(list)
  for idx,section in enumerate(sections):
   if section[1] not in (2,11):continue
   names=self.slice_section(sections[section[6]]);rows=[]
   for pos in range(section[4],section[4]+section[5],section[9]):
    name,info,other,index,value,size=struct.unpack_from('<IBBHQQ',data,pos)
    row=dict(symbol=self.string(names,name),type=info&15,binding=info>>4,section=index,start=value,bytes=size)
    rows.append(row)
    if row['type']==2 and row['section'] and row['bytes'] and row not in self.functions[value]:self.functions[value].append(row)
   self.symbol_tables[idx]=rows
  self.relocations=defaultdict(list)
  for section in sections:
   if section[1] not in (4,9):continue
   assert section[9] in (16,24)
   for pos in range(section[4],section[4]+section[5],section[9]):
    offset,info=struct.unpack_from('<QQ',data,pos);kind=info&0xffffffff;index=info>>32
    symbol=self.symbol_tables[section[6]][index]
    self.relocations[offset].append(dict(type=kind,symbol=symbol,addend=struct.unpack_from('<q',data,pos+16)[0] if section[1]==4 else None))
 def slice_section(self,s):
  assert s[4]+s[5]<=len(self.data)
  return self.data[s[4]:s[4]+s[5]]
 @staticmethod
 def string(strings,start):
  end=strings.find(b'\0',start);assert 0<=start<=end
  return strings[start:end].decode('utf-8')
 def body(self,start,size):
  text=self.named['.text'];assert text[3]<=start<start+size<=text[3]+text[5]
  offset=text[4]+start-text[3]
  return self.data[offset:offset+size]
 def normalize(self,raw):
  # Same narrowly bounded CALL/LDDW operands as the maintained official matcher.
  result=bytearray(raw);p=0
  while p<len(raw):
   op,regs,off,imm=struct.unpack_from('<BBhi',raw,p)
   if op==0x18:
    assert p+16<=len(raw)
    value=struct.unpack_from('<I',raw,p+4)[0]|struct.unpack_from('<I',raw,p+12)[0]<<32
    if any(s[3]>0 and s[3]<=value<s[3]+s[5] for s in self.sections):
     result[p+4:p+8]=bytes(4);result[p+12:p+16]=bytes(4)
    p+=16
   else:
    if op==0x85 and regs>>4==1 and imm!=-1:result[p+4:p+8]=bytes(4)
    p+=8
  assert p==len(raw)
  return bytes(result)
 def calls(self,start,size):
  raw=self.body(start,size);result=[];p=0
  while p<len(raw):
   op,regs,off,imm=struct.unpack_from('<BBhi',raw,p)
   if op in (0x85,0x8d):
    relocs=[r for r in self.relocations.get(start+p,[]) if r['type']==10]
    assert len(relocs)<=1,(start,p,relocs)
    record=dict(offset=p,instruction_hex=raw[p:p+8].hex(),opcode=op,source_register_nibble=regs>>4,immediate=imm)
    if relocs:
     record['relocation']=relocs[0]
     symbol=relocs[0]['symbol']
     if symbol['section']==0:record.update(kind='external_import',import_symbol=symbol['symbol'])
     else:record.update(kind='defined_call_relocation',relocation_symbol=symbol)
    elif op==0x8d:record.update(kind='indirect_register_call')
    elif regs>>4==1 and imm!=-1:record.update(kind='internal_relative',target=start+p+8+imm*8)
    else:record.update(kind='unresolved_call')
    result.append(record)
   p+=16 if op==0x18 else 8
  assert p==len(raw)
  return result

def classify_edge(old,new,original,candidate,windows,memberships):
 row=dict(offset=old['offset'],original=old,candidate=new)
 if old['kind']=='internal_relative' and new['kind']=='internal_relative':
  ot,ct=old['target'],new['target'];ow=windows.get(ot)
  row['candidate_target_symbols']=candidate.functions.get(ct,[])
  if ow is None:
   row['status']='unresolved_original_nonboundary'
   row['original_containing_windows']=[dict(start=s,bytes=x['bytes']) for s,x in windows.items() if s<ot<x['end']]
  elif not memberships[ot]:row['status']='known_unmatched_original_target'
  elif ct in memberships[ot]:
   row['status']='matched_complete_callee';row['callee_pair']=[ot,ct]
   row['callee_raw_equal']=original.body(ot,ow['bytes'])==candidate.body(ct,ow['bytes'])
  elif not candidate.functions.get(ct):row['status']='unresolved_candidate_nonentry'
  else:row['status']='different_complete_callee'
 elif old['kind']=='external_import' and new['kind']=='external_import':
  row['status']='same_external_import' if old['import_symbol']==new['import_symbol'] else 'different_external_import'
 elif old['kind']=='indirect_register_call' and new['kind']=='indirect_register_call':
  row['status']='unresolved_indirect_same_encoding' if old['instruction_hex']==new['instruction_hex'] else 'unresolved_indirect_encoding_difference'
 else:row['status']='unresolved_call_kind_or_relocation'
 return row

def qualify_pairs(pairs):
 by_pair={}
 for row in pairs:
  key=(row['original'],row['candidate'])
  if key in by_pair:
   # Multiple symbol aliases can name the same physical candidate entry. Preserve
   # every inventory row; require identical actual edge/byte data for graph reuse.
   previous=by_pair[key]
   assert previous['edges']==row['edges'] and previous['bytes']==row['bytes'] and previous['raw_equal']==row['raw_equal']
  else:by_pair[key]=row
 for row in pairs:
  row['direct_closure']=all(e['status'] in ('matched_complete_callee','same_external_import') for e in row['edges'])
 for row in pairs:
  row['depth2_closure']=row['direct_closure'] and all(by_pair[tuple(e['callee_pair'])]['direct_closure'] for e in row['edges'] if e['status']=='matched_complete_callee')
 return by_pair

def audit(original_bytes,candidate_bytes,inventory_bytes):
 for name,data in [('original',original_bytes),('candidate',candidate_bytes),('inventory',inventory_bytes)]:assert sha(data)==HASHES[name],name
 original=ELF(original_bytes);candidate=ELF(candidate_bytes)
 inventory=json.loads(gzip.decompress(inventory_bytes));windows={w['start']:w for w in inventory['windows']}
 assert len(windows)==1035 and sum(bool(w['normalized_matches']) for w in windows.values())==1019
 assert sum(bool(w['raw_match']) for w in windows.values())==188
 assert inventory['candidate_sha256']==HASHES['candidate'],inventory['candidate_sha256']
 memberships={start:{m['start'] for m in w['normalized_matches']} for start,w in windows.items()}
 original_calls={};candidate_calls={};candidate_sizes={}
 for start,w in windows.items():
  raw=original.body(start,w['bytes']);assert sha(raw)==w['raw_sha256']
  assert w['raw_match']==any(m['raw_sha256']==w['raw_sha256'] for m in w['normalized_matches'])
  original_calls[start]=original.calls(start,w['bytes'])
  for match in w['normalized_matches']:
   current=match['start'];symbols=[s for s in candidate.functions[current] if s['symbol']==match['symbol']]
   assert len(symbols)==1,(start,match,symbols)
   assert symbols[0]['bytes']==w['bytes'],(start,match,symbols)
   cb=candidate.body(current,w['bytes']);assert sha(cb)==match['raw_sha256']
   assert original.normalize(raw)==candidate.normalize(cb),(start,current)
   if current in candidate_sizes:assert candidate_sizes[current]==w['bytes']
   candidate_sizes[current]=w['bytes'];candidate_calls[current]=candidate.calls(current,w['bytes'])
 pairs=[];edge_totals=Counter();by_pair={}
 for start,w in windows.items():
  for match in w['normalized_matches']:
   current=match['start'];oc=original_calls[start];cc=candidate_calls[current]
   assert len(oc)==len(cc)
   edges=[]
   for old,new in zip(oc,cc):
    assert old['offset']==new['offset'],'Strict normalized pairs have same call sites'
    row=classify_edge(old,new,original,candidate,windows,memberships)
    edge_totals[row['status']]+=1;edges.append(row)
   counts=Counter(e['status'] for e in edges)
   closed=all(e['status'] in ('matched_complete_callee','same_external_import') for e in edges)
   row=dict(original=start,candidate=current,candidate_symbol=match['symbol'],bytes=w['bytes'],raw_equal=w['raw_sha256']==match['raw_sha256'],
    direct_or_indirect_call_sites=len(edges),edge_counts=dict(sorted(counts.items())),direct_closure=closed,edges=edges)
   pairs.append(row);by_pair[start,current]=row
 by_pair=qualify_pairs(pairs)
 # Never select a winner from aliases merely because it closes locally.
 per_window=[]
 for start,w in windows.items():
  rows=[by_pair[start,m['start']] for m in w['normalized_matches']]
  per_window.append(dict(original=start,bytes=w['bytes'],normalized_candidate_count=len(rows),physical_candidate_count=len({r['candidate'] for r in rows}),candidates=[dict(start=r['candidate'],symbol=m['symbol'],direct_closure=r['direct_closure'],depth2_closure=r['depth2_closure'],edge_counts=r['edge_counts']) for r,m in zip(rows,w['normalized_matches'])],
   direct_closed_candidates=sum(r['direct_closure'] for r in rows),depth2_closed_candidates=sum(r['depth2_closure'] for r in rows)))
 return dict(schema=1,revision=REVISION,input_sha256=HASHES,official_counts=inventory['counts'],
  scope='Every published normalized candidate pair, actual decoded call operands and actual entry/import targets, bounded through depth2. Not layout recovery or an official count change.',
  summary=dict(original_windows=len(windows),matched_original_windows=1019,unmatched_original_windows=16,normalized_pairs=len(pairs),distinct_physical_pairs=len(by_pair),symbol_alias_pair_extras=len(pairs)-len(by_pair),candidate_function_entries=len(candidate.functions),
   original_all_window_call_kinds=dict(Counter(c['kind'] for rows in original_calls.values() for c in rows)),
   original_all_window_call_sites=sum(map(len,original_calls.values())),pair_edges=dict(sorted(edge_totals.items())),
   call_free_pairs=sum(not r['edges'] for r in pairs),matched_callee_raw_equal_pair_edges=sum(bool(e.get('callee_raw_equal')) for r in pairs for e in r['edges']),directly_closed_nonleaf_pairs=sum(r['direct_closure'] and bool(r['edges']) for r in pairs),depth2_closed_nonleaf_pairs=sum(r['depth2_closure'] and bool(r['edges']) for r in pairs),directly_closed_pairs=sum(r['direct_closure'] for r in pairs),depth2_closed_pairs=sum(r['depth2_closure'] for r in pairs),
   matched_windows_with_any_direct_closure=sum(bool(w['direct_closed_candidates']) for w in per_window),
   matched_windows_with_any_depth2_closure=sum(bool(w['depth2_closed_candidates']) for w in per_window),
   matched_windows_with_multiple_normalized_candidates=sum(w['normalized_candidate_count']>1 for w in per_window),matched_windows_with_multiple_physical_candidates=sum(w['physical_candidate_count']>1 for w in per_window)),
  windows=per_window,pairs=pairs,
  original_graph=[dict(start=start,bytes=w['bytes'],raw_sha256=w['raw_sha256'],calls=[dict(c,original_target_is_window_boundary=(c.get('target') in windows) if c['kind']=='internal_relative' else None) for c in original_calls[start]]) for start,w in windows.items()],
  candidate_graph=[dict(start=start,aliases=symbols,physical_bodies=[dict(bytes=size,raw_sha256=sha(candidate.body(start,size)),calls=candidate.calls(start,size)) for size in sorted({s['bytes'] for s in symbols})]) for start,symbols in sorted(candidate.functions.items())],
  unmatched_original_windows=[dict(start=w['start'],bytes=w['bytes']) for w in windows.values() if not w['normalized_matches']],
  limits=['Official1019 normalized/188raw counts remain unchanged. A local call-closure filter does not create or accept a function match.',
   'Every published candidate remains represented; no ambiguity is resolved by arbitrary symbol choice.',
   'Depth2 checks two actual direct-call edges, not an unbounded transitive proof, indirect targets, data-pointer closure, ABI semantics or runtime behavior.',
   'Complete callee membership uses narrow official normalization; raw body equality is reported separately.',
   'Unknown external/indirect/nonentry/different/known-unmatched edges remain explicit. No source, binaries, normalizer, flags or layout is changed.'])

def main():
 p=argparse.ArgumentParser(description=__doc__)
 root=Path(__file__).resolve().parents[2]
 selected=root/'research/pump-final-composition-673-20261028'
 p.add_argument('--original',type=Path,default=root/'evidence/original/pump/deployed.so')
 p.add_argument('--candidate',type=Path,default=selected/'artifacts/unstripped.so')
 p.add_argument('--inventory',type=Path,default=selected/'analysis/inventory.json.gz')
 p.add_argument('--output',type=Path)
 a=p.parse_args();r=audit(a.original.read_bytes(),a.candidate.read_bytes(),a.inventory.read_bytes())
 if a.output:
  a.output.parent.mkdir(parents=True,exist_ok=True)
  raw=(json.dumps(r,sort_keys=True,separators=(',',':'))+'\n').encode()
  a.output.write_bytes(gzip.compress(raw,mtime=0))
 else:
  expected=json.loads(gzip.decompress((Path(__file__).resolve().parent/'call-closure.json.gz').read_bytes()))
  assert r==expected,'Recomputed full call graph differs from the retained proof'
 print(json.dumps(r['summary'],indent=2))
if __name__=='__main__':main()
