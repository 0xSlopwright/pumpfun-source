#!/usr/bin/env python3
"""Portable V3 buy reference audit. Reads input ELFs; emits recomputed JSON only.
CALL identity uses complete official-narrow-normalized callee bodies.
Data checks are bounded objects/classes, not recursive transitive closure.
"""
if not __debug__:
    raise SystemExit("Run without -O")

from pathlib import Path
import argparse,collections,csv,gzip,hashlib,json,re,struct,sys
sys.dont_write_bytecode=True
def sha(b): return hashlib.sha256(b).hexdigest()
def stable_name(n): return re.sub(r'17h[0-9a-f]{16}E$', '17h<HASH>E', n)

class Elf:
    def __init__(self, path):
        self.path=Path(path); raw=self.path.read_bytes(); self.data=gzip.decompress(raw) if self.path.suffix=='.gz' else raw
        assert self.data[:6] == b'\x7fELF\x02\x01'
        shoff=struct.unpack_from('<Q',self.data,40)[0]
        ent,n,ni=struct.unpack_from('<HHH',self.data,58)
        self.headers=[struct.unpack_from('<IIQQQQIIQQ',self.data,shoff+i*ent) for i in range(n)]
        def st(h,x):
            p=h[4]+x; return self.data[p:self.data.index(b'\0',p)].decode('utf-8')
        names=self.headers[ni]
        self.sections={st(names,h[0]):{'type':h[1],'addr':h[3],'offset':h[4],'size':h[5],'index':i}
                       for i,h in enumerate(self.headers)}
        self.symbols=[]
        for h in self.headers:
            if h[1]!=2: continue
            for p in range(h[4],h[4]+h[5],24):
                nm,info,other,sec,addr,size=struct.unpack_from('<IBBHQQ',self.data,p)
                self.symbols.append({'name':st(self.headers[h[6]],nm),'kind':info&15,'section':sec,'address':addr,'size':size})
        ti=self.sections['.text']['index']
        self.functions=[x for x in self.symbols if x['kind']==2 and x['section']==ti and x['size']]
    def section_bytes(self,name):
        s=self.sections[name]; return self.data[s['offset']:s['offset']+s['size']]
    def body(self,address,size):
        s=self.sections['.text']; assert s['addr']<=address<address+size<=s['addr']+s['size']
        p=s['offset']+address-s['addr']; return self.data[p:p+size]
    def normalize(self,raw,address):
        assert len(raw)%8==0
        out=bytearray(raw); refs=[]; i=0
        while i<len(raw):
            op,reg,off,imm=struct.unpack_from('<BBhi',raw,i)
            if op==0x18:
                assert i+16<=len(raw)
                value=struct.unpack_from('<I',raw,i+4)[0] | struct.unpack_from('<I',raw,i+12)[0]<<32
                ss=[name for name,s in self.sections.items() if s['addr']>0 and s['addr']<=value<s['addr']+s['size']]
                if ss:
                    out[i+4:i+8]=b'\0'*4; out[i+12:i+16]=b'\0'*4
                    refs.append({'offset':i,'kind':'elf-pointer','value':value,'sections':ss})
                i+=16
            else:
                if op==0x85 and reg>>4==1 and imm!=-1:
                    out[i+4:i+8]=b'\0'*4
                    refs.append({'offset':i,'kind':'direct-call','target':address+i+8+imm*8})
                i+=8
        return bytes(out),refs
    def target(self,original=False):
        if original: addr,size,name=0x147ba0,3672,'original window 0x147ba0'
        else:
            fs=[x for x in self.functions if '5trade3buy17h' in x['name']]
            assert len(fs)==1,fs
            f=fs[0]; addr,size,name=f['address'],f['size'],f['name']
        raw=self.body(addr,size); norm,refs=self.normalize(raw,addr)
        return {'address':addr,'bytes':size,'symbol':name,'raw':raw,'norm':norm,'refs':refs}
    def callee(self,address):
        fs=[f for f in self.functions if f['address']==address]
        bodies=[]
        for size in sorted(set(f['size'] for f in fs)):
            raw=self.body(address,size); norm,refs=self.normalize(raw,address)
            bodies.append({'bytes':size,'raw_sha256':sha(raw),'normalized_sha256':sha(norm),
                'masked_operands':len(refs)})
        return {'address':address,'names':sorted(f['name'] for f in fs),
                'stable_names':sorted(set(stable_name(f['name']) for f in fs)), 'bodies':bodies}


ap=argparse.ArgumentParser(description=__doc__)
ap.add_argument('--repo-root',type=Path,required=True)
ap.add_argument('--parent',type=Path)
ap.add_argument('--candidate',type=Path)
ap.add_argument('--compare-retained',action='store_true')
args=ap.parse_args(); B=Path(__file__).resolve().parent; R=args.repo_root.resolve()
sys.path.insert(0,str(B/'tools' if (B/'tools').is_dir() else R/'scripts'))
from pump_compare_function_bytes import normalize as official_normalize
paths={'original':R/'evidence/original/pump/deployed.so',
       'parent':args.parent or B/'build/parent/symbols.so.gz',
       'candidate':args.candidate or B/'build/candidate/symbols.so.gz'}
es={k:Elf(p) for k,p in paths.items()}
assert sha(es['original'].data)=='7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
windows={int(r['original_start']):int(r['original_end'])-int(r['original_start'])
 for r in csv.DictReader((R/'repro/reconstruction-status-2026-10-26/functions.tsv').open(),delimiter='\t')
 if r['program']=='pump' and r['variant']=='selected'}
assert windows[0x147ba0]==3672

def normalized(e,raw,addr):
 n,rr=e.normalize(raw,addr); assert (n,rr)==official_normalize(raw,addr,e.sections)
 return n,rr

ts={k:e.target(k=='original') for k,e in es.items()}
for k,t in ts.items(): assert (t['norm'],t['refs'])==normalized(es[k],t['raw'],t['address'])
cache={}
def fun(k,addr):
 if (k,addr) in cache:return cache[k,addr]
 e=es[k]; fs=[f for f in e.functions if f['address']==addr]
 sizes=[windows[addr]] if k=='original' and addr in windows else sorted({f['size'] for f in fs})
 assert len(sizes)==1,(k,hex(addr),sizes)
 size=sizes[0];raw=e.body(addr,size);n,rr=normalized(e,raw,addr)
 f={'address':addr,'names':sorted({f['name'] for f in fs}),'bytes':size,
    'raw_sha256':sha(raw),'normalized_sha256':sha(n),'refs':rr}
 cache[k,addr]=f;return f

def key(f):return (f['bytes'],f['normalized_sha256'])
def compact(f):return {k:v for k,v in f.items() if k!='refs'}
def sec(e,addr):
 ss=[(name,s) for name,s in e.sections.items() if s['addr']>0 and s['addr']<=addr<s['addr']+s['size']]
 assert len(ss)==1,(hex(addr),[n for n,s in ss]);return ss[0]
def at(e,addr,size):
 name,s=sec(e,addr);assert addr+size<=s['addr']+s['size']
 p=s['offset']+addr-s['addr'];return e.data[p:p+size]
def ptr(e,word):
 if any(s['addr']>0 and s['addr']<=word<s['addr']+s['size'] for s in e.sections.values()):return word,'direct'
 assert word&0xffffffff==0
 addr=word>>32;sec(e,addr);return addr,'high32'
def pointer_pair(pa,ca):
 pn,ps=sec(es['parent'],pa);cn,cs=sec(es['candidate'],ca);assert pn==cn
 row={'parent_address':pa,'candidate_address':ca,'address_delta':ca-pa,'section':pn}
 if pn=='.text':
  pf,cf=fun('parent',pa),fun('candidate',ca);assert pf['names']==cf['names'] and pf['names']
  row.update({'names':pf['names'],'same_full_normalized_body':key(pf)==key(cf)})
 else:
  po,co=pa-ps['addr'],ca-cs['addr'];assert po==co
  row.update({'section_offset':po})
 return row

# Audit the complete read-only data section, identifying changed words ONLY at
# actual ELF relocation records. This is a relocation identity check, not a
# recursive proof of function bodies behind every vtable in the section.
sections={}
for sn in ['.rodata','.data.rel.ro']:
 p,c=[e.section_bytes(sn) for e in [es['parent'],es['candidate']]]
 assert len(p)==len(c)
 rec={'bytes':len(p),'parent_sha256':sha(p),'candidate_sha256':sha(c),'raw_equal':p==c}
 if sn=='.rodata':assert p==c
 else:
  rels=[]
  for e in [es['parent'],es['candidate']]:
   blob=e.section_bytes('.rel.dyn');s=e.sections[sn]
   rels.append({a-s['addr']:info for a,info in struct.iter_unpack('<QQ',blob) if s['addr']<=a<s['addr']+s['size']})
  assert rels[0]==rels[1]
  changed=[];pm=bytearray(p);cm=bytearray(c)
  stable_relocation_words=0
  for i,info in rels[0].items():
   if p[i:i+8]!=c[i:i+8]:continue
   assert info==8 and i%8==0
   pw=struct.unpack_from('<Q',p,i)[0]
   pa,pe=ptr(es['parent'],pw);ca,ce=ptr(es['candidate'],pw);assert pe==ce
   same=pointer_pair(pa,ca);assert same.get('same_full_normalized_body',True)
   stable_relocation_words+=1
  for i in range(0,len(p),8):
   if p[i:i+8]==c[i:i+8]:continue
   assert i in rels[0] and rels[0][i]==8 and len(p[i:i+8])==8
   pw,cw=struct.unpack_from('<Q',p,i)[0],struct.unpack_from('<Q',c,i)[0]
   pa,pe=ptr(es['parent'],pw);ca,ce=ptr(es['candidate'],cw);assert pe==ce
   row=pointer_pair(pa,ca);assert row.get('same_full_normalized_body',True);row.update({'word_offset':i,'parent_word':pw,'candidate_word':cw,'encoding':pe})
   changed.append(row);pm[i:i+8]=cm[i:i+8]=bytes(8)
  assert pm==cm
  rec.update({'unchanged_relocated_words_checked':stable_relocation_words,'changed_relocated_words':len(changed),'all_other_bytes_equal':True,'changed_words':changed})
 sections[sn]=rec

calls={k:[r for r in t['refs'] if r['kind']=='direct-call'] for k,t in ts.items()}
ct={k:{r['target']:fun(k,r['target']) for r in rr} for k,rr in calls.items()}
assert all(len(rr)==29 for rr in calls.values()) and all(len(ff)==22 for ff in ct.values())
call_sites=[];pairs={}
for i,(p,c) in enumerate(zip(calls['parent'],calls['candidate'])):
 pf,cf=ct['parent'][p['target']],ct['candidate'][c['target']]
 assert pf['names']==cf['names'] and key(pf)==key(cf)
 assert pairs.setdefault(p['target'],c['target'])==c['target']
 call_sites.append({'ordinal':i,'parent_offset':p['offset'],'candidate_offset':c['offset'],
                    'parent_target':p['target'],'candidate_target':c['target'],'names':pf['names']})
assert len(set(pairs.values()))==len(pairs)
callee_rows=[]
for pa,ca in pairs.items():
 pf,cf=ct['parent'][pa],ct['candidate'][ca]
 pr,cr=es['parent'].body(pa,pf['bytes']),es['candidate'].body(ca,cf['bytes'])
 assert len(pf['refs'])==len(cf['refs'])
 rr=[]
 for p,c in zip(pf['refs'],cf['refs']):
  assert p['offset']==c['offset'] and p['kind']==c['kind']
  row={'offset':p['offset'],'kind':p['kind']}
  if p['kind']=='direct-call':
   f,g=fun('parent',p['target']),fun('candidate',c['target'])
   assert f['names']==g['names'] and f['names'] and key(f)==key(g)
   row.update({'parent_target':p['target'],'candidate_target':c['target'],'names':f['names'],
               'same_full_normalized_body':key(f)==key(g)})
  else:
   row.update(pointer_pair(p['value'],c['value']))
   assert row['section'] in sections or (row['section']=='.text' and row['same_full_normalized_body']),(pf['names'],row)
  rr.append(row)
 callee_rows.append({'parent':compact(pf),'candidate':compact(cf),'raw_equal':pr==cr,
   'full_narrow_normalized_equal':True,'changed_bytes':sum(a!=b for a,b in zip(pr,cr)),
   'changed_8byte_slots':[i//8 for i in range(0,len(pr),8) if pr[i:i+8]!=cr[i:i+8]],'own_refs':rr})

# Original mappings require complete size+normalized-body equality, never names.
original_rows=[];canonical={}
for oa,of in ct['original'].items():
 row={'original':compact(of),'matches':{}}
 for k in ['parent','candidate']:
  matches=[a for a,f in ct[k].items() if key(f)==key(of)]
  assert len(matches)<=1
  row['matches'][k]=matches
  if matches:canonical[k,matches[0]]=oa
 original_rows.append(row)
unmatched=[r['original']['address'] for r in original_rows if not r['matches']['candidate']]
assert sorted(unmatched)==[0x80df8,0x83c00]
seq={'original':[r['target'] for r in calls['original']]}
for k in ['parent','candidate']:
 seq[k]=[canonical.get((k,r['target']), 'unmatched:'+','.join(ct[k][r['target']]['names'])) for r in calls[k]]
# Keep unresolved calls explicit. Even after removing unmatched calls, original
# linear order differs (memcmp is elsewhere); do not imply all-call ordering.
known_seq={k:[a for a in s if isinstance(a,int) and a not in unmatched] for k,s in seq.items()}

# Every directly referenced LDDW data object is bounded by its actual type.
# Enum values feed PumpError formatting; strings have explicit lengths; vtables
# are 48/32 bytes and panic location is a 24-byte Rust Location record.
def data_object(k,r):
 e=es[k];a=r['value'];sn=r['sections'][0];out={'offset':r['offset'],'address':a,'section':sn}
 if sn=='.rodata':
  strings=[b'a Display implementation returned an error unexpectedly',b'programs/pump/src/trade_v3.rs',b'buy']
  found=next((s for s in strings if at(e,a,len(s))==s),None)
  if found:out.update({'class':'string','bytes':len(found),'content':found.decode(),'raw_sha256':sha(found)})
  else:
   raw=at(e,a,4);value=struct.unpack('<I',raw)[0];assert value in [21,20,2]
   out.update({'class':'PumpError_discriminant','bytes':4,'value':value,'raw_sha256':sha(raw)})
 elif sn=='.data.rel.ro':
  w=struct.unpack('<3Q',at(e,a,24))
  if (w[1],w[2]) in [(24,8),(0,1)]:
   size=48 if w[1]==24 else 32;raw=at(e,a,size);ww=struct.unpack('<'+'Q'*(size//8),raw)
   out.update({'class':'vtable','bytes':size,'object_size':w[1],'object_align':w[2],
               'raw_sha256':sha(raw),'function_fields':[]})
   for i in [0]+list(range(3,len(ww))):
    fa,encoding=ptr(e,ww[i]);f=fun(k,fa)
    out['function_fields'].append({'field':i,'encoding':encoding,'target':compact(f)})
  else:
   fa,encoding=ptr(e,w[0]);raw=at(e,fa,w[1])
   out.update({'class':'panic_location','bytes':24,'raw_sha256':sha(at(e,a,24)),
               'filename_pointer':fa,'pointer_encoding':encoding,'filename':raw.decode(),
               'filename_bytes':w[1],'line':w[2]&0xffffffff,'column':w[2]>>32})
 else:raise AssertionError(sn)
 return out

def semantic(r):
 c=r['class']
 if c=='vtable':return(c,r['bytes'],r['object_size'],r['object_align'],tuple((x['field'],key(x['target'])) for x in r['function_fields']))
 if c=='panic_location':return(c,r['filename'],r['line'],r['column'])
 if c=='PumpError_discriminant':return(c,r['value'])
 return(c,r['content'])
data={k:[data_object(k,r) for r in t['refs'] if r['kind']=='elf-pointer'] for k,t in ts.items()}
assert all(len(rr)==15 for rr in data.values())
sem={k:[semantic(r) for r in rr] for k,rr in data.items()}
assert sem['parent']==sem['candidate']
data_pairs=[]
for p,c in zip(data['parent'],data['candidate']):
 row=pointer_pair(p['address'],c['address']);row.update({'parent_offset':p['offset'],'candidate_offset':c['offset'],
   'class':p['class'],'bytes':p['bytes'],'raw_equal':p['raw_sha256']==c['raw_sha256'],'bounded_semantics_equal':True})
 data_pairs.append(row)

summary={'scope':'V3 buy only. Parent/candidate call identities and full callee bodies are checked with official narrow normalization; callee own CALL targets are resolved by exact symbol identities and reported full normalized body equality. Their function-pointer LDDWs also have equal full normalized bodies; their data references retain section-relative offsets into byte-identical rodata or relocation-audited data.rel.ro. Direct target data objects are checked by bounded types, including vtable function bodies one level. No recursive transitive closure, runtime, build, or original whole-data equivalence claim.',
 'images':{k:{'sha256':sha(e.data),'target_address':ts[k]['address'],'target_bytes':ts[k]['bytes'],
   'target_raw_sha256':sha(ts[k]['raw']),'target_narrow_normalized_sha256':sha(ts[k]['norm'])} for k,e in es.items()},
 'calls':{'sites':{k:len(v) for k,v in calls.items()},'distinct_targets':{k:len(v) for k,v in ct.items()},
   'parent_candidate_order_and_identity_equal':True,'parent_candidate_all_full_normalized_equal':True,
   'original_full_normalized_matched_distinct':len(original_rows)-len(unmatched),
   'original_full_normalized_matched_sites':sum(isinstance(x,int) for x in seq['candidate']),
   'parent_candidate_raw_equal_distinct':sum(r['raw_equal'] for r in callee_rows),
   'sites_parent_candidate':call_sites,'parent_candidate_callees':callee_rows,
   'original_full_normalized_mapping':original_rows,'original_unmatched_addresses':unmatched,
   'sequences_using_original_exact_matches':seq,
   'original_known_match_multiset_equal':collections.Counter(known_seq['original'])==collections.Counter(known_seq['candidate']),
   'original_known_match_order_equal':known_seq['original']==known_seq['candidate']},
 'data':{'sites':{k:len(v) for k,v in data.items()},'parent_candidate_direct_object_sequence_equal':sem['parent']==sem['candidate'],
   'original_candidate_direct_object_sequence_equal':sem['original']==sem['candidate'],
   'parent_candidate_pairs':data_pairs,'bounded_objects':data,'parent_candidate_sections':sections},
 'script_sha256':sha(Path(__file__).read_bytes())}
if args.compare_retained:
 retained=json.loads((B/'audit/reference-audit.json').read_text())
 assert summary==retained,'Recomputed audit differs from retained report'
print(json.dumps(summary,indent=2))
