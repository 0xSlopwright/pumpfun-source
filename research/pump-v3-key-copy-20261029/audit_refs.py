#!/usr/bin/env python3
"""Portable V3 execute-buy reference audit. Reads input ELFs; emits recomputed JSON only.
CALL identity uses complete official-narrow-normalized callee bodies.
Data checks are bounded objects/classes, not recursive transitive closure.
"""
import sys
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
ap.add_argument('--compare-retained',action='store_true')
args=ap.parse_args()
B=Path(__file__).resolve().parent
R=args.repo_root.resolve()
paths={'original':R/'evidence/original/pump/deployed.so','parent':B/'build/parent/symbols.so.gz','candidate':B/'build/candidate/symbols.so.gz'};es={k:Elf(p) for k,p in paths.items()};ts={}
windows={int(r['original_start']):int(r['original_end'])-int(r['original_start']) for r in csv.DictReader((R/'repro/reconstruction-status-2026-10-26/functions.tsv').open(),delimiter='\t') if r['program']=='pump' and r['variant']=='selected'}
for k,e in es.items():
 if k=='original':addr,size=0x83c00,3440
 else:
  fs=[f for f in e.functions if '5trade14v3_execute_buy17h' in f['name']];assert len(fs)==1;addr,size=fs[0]['address'],fs[0]['size']
 raw=e.body(addr,size);norm,refs=e.normalize(raw,addr);ts[k]={'address':addr,'size':size,'raw':raw,'norm':norm,'refs':refs}
def identity(k,addr):
 e=es[k];sizes=[windows[addr]] if k=='original' else sorted({f['size'] for f in e.functions if f['address']==addr})
 assert len(sizes)==1,(k,addr,sizes)
 raw=e.body(addr,sizes[0]);n,_=e.normalize(raw,addr);return {'bytes':sizes[0],'normalized_sha256':sha(n),'raw_sha256':sha(raw)}
calls={k:[r for r in t['refs'] if r['kind']=='direct-call'] for k,t in ts.items()}
ids={k:{r['target']:identity(k,r['target']) for r in rr} for k,rr in calls.items()}
key=lambda d:(d['bytes'],d['normalized_sha256']);mapped={};rows=[]
for oa,oi in ids['original'].items():
 row={'original_address':oa,'original':oi}
 for k in ['parent','candidate']:
  m=[addr for addr,v in ids[k].items() if key(v)==key(oi)];assert len(m)==1,(k,oa,m);mapped[k,m[0]]=oa;row[k]={'address':m[0],**ids[k][m[0]]}
 rows.append(row)
seq={'original':[r['target'] for r in calls['original']]}
for k in ['parent','candidate']:seq[k]=[mapped[k,r['target']] for r in calls[k]]
assert seq['original']==seq['parent']==seq['candidate']
assert ts['parent']['refs']==ts['candidate']['refs'],'target reference records changed'
# Every referenced parent/candidate callee is raw-identical as well.
for row in rows:assert row['parent']['raw_sha256']==row['candidate']['raw_sha256']
# Check identical entire referenced data sections, stronger than an arbitrary prefix.
datarefs=[r for r in ts['parent']['refs'] if r['kind']=='elf-pointer'];sections=sorted({s for r in datarefs for s in r['sections']});data={}
for section in sections:
 p=es['parent'].section_bytes(section);c=es['candidate'].section_bytes(section);assert p==c,section;data[section]={'bytes':len(p),'sha256':sha(p)}
summary={'scope':'Original22 call sites mapped by full narrow-normalized callee body, exact ordering. Parent/candidate callee raw bytes and all target reference records equal. Referenced complete data sections equal parent/candidate. No original whole-data or recursive closure claim.', 'images':{k:{'sha256':sha(e.data),'path':str(e.path),'target_address':ts[k]['address'],'target_bytes':ts[k]['size']} for k,e in es.items()},'calls':{'sites':{k:len(rr) for k,rr in calls.items()},'rows':rows,'original_address_sequences':seq},'parent_candidate_reference_records':ts['parent']['refs'],'data_section_identity':data,'script_sha256':sha(Path(__file__).read_bytes())}

if args.compare_retained:
 retained=json.loads((B/'audit/reference-audit.json').read_text())
 for field in ['calls','parent_candidate_reference_records','data_section_identity']:
  assert summary[field]==retained[field],field
 assert all(summary['images'][k]['sha256']==retained['images'][k]['sha256'] for k in es)
 summary['retained_comparison']='calls, data and image hashes equal'
print(json.dumps(summary,indent=2))
