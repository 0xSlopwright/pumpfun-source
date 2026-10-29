#!/usr/bin/env python3
"""Read-only ELF comparison; output only audit_current_* evidence files.

Only internal direct-call immediates and section-pointing LDDW values are
normalized. Branches, registers, stack offsets, syscall IDs and scalar literals
remain exact. Outbound-reference analysis is parent-to-guard only, one hop.
"""
import argparse, collections, difflib, hashlib, importlib, json, re, struct, sys
from pathlib import Path
sys.dont_write_bytecode = True

def sha(b): return hashlib.sha256(b).hexdigest()
def stable_name(n): return re.sub(r'17h[0-9a-f]{16}E$', '17h<HASH>E', n)

class Elf:
    def __init__(self, path):
        self.path=Path(path); self.data=self.path.read_bytes()
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
        if original: addr,size,name=0x14f4e0,13224,'original window 0x14f4e0'
        else:
            fs=[x for x in self.functions if '14pump_recovered14pump_recovered16buy_exact_sol_in17h' in x['name']]
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

def instructions(b):
    out=[]; i=0
    while i<len(b):
        n=16 if b[i]==0x18 else 8
        assert i+n<=len(b)
        out.append((i,b[i:i+n]));i+=n
    return out

def comparison(a,b):
    x,y=a['norm'],b['norm']; xi,yi=instructions(x),instructions(y)
    differences=[{'slot':i//8,'byte_offset':i,'left':x[i:i+8].hex(),'right':y[i:i+8].hex()}
                 for i in range(0,max(len(x),len(y)),8) if x[i:i+8]!=y[i:i+8]]
    edits=[]
    for tag,i,j,k,l in difflib.SequenceMatcher(None,[v for _,v in xi],[v for _,v in yi],autojunk=False).get_opcodes():
        if tag=='equal': continue
        edits.append({'kind':tag,'left_instruction_range':[i,j],'right_instruction_range':[k,l],
                      'left_byte_range':[xi[i][0] if i<len(xi) else len(x),xi[j][0] if j<len(xi) else len(x)],
                      'right_byte_range':[yi[k][0] if k<len(yi) else len(y),yi[l][0] if l<len(yi) else len(y)]})
    return {'left_bytes':len(x),'right_bytes':len(y),'raw_equal':a['raw']==b['raw'],'normalized_equal':x==y,
            'positional_different_bytes':sum(i>=len(x) or i>=len(y) or x[i]!=y[i] for i in range(max(len(x),len(y)))),
            'positional_different_slots':len(differences),
            'positional_different_instructions':sum(i>=len(xi) or i>=len(yi) or xi[i][1]!=yi[i][1] for i in range(max(len(xi),len(yi)))),
            'left_instructions':len(xi),'right_instructions':len(yi),
            'sequence_edit_instruction_count':sum(max(e['left_instruction_range'][1]-e['left_instruction_range'][0],
                e['right_instruction_range'][1]-e['right_instruction_range'][0]) for e in edits),
            'sequence_edits':edits,'different_slots':differences}

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--original',type=Path,required=True);ap.add_argument('--parent',type=Path,required=True)
    ap.add_argument('--guard',type=Path,required=True);ap.add_argument('--output-directory',type=Path,required=True)
    ap.add_argument('--official-tools',type=Path)
    a=ap.parse_args()
    es={k:Elf(getattr(a,k)) for k in ['original','parent','guard']}
    ts={k:e.target(k=='original') for k,e in es.items()}
    verification={}
    if a.official_tools:
        sys.path.insert(0,str(a.official_tools))
        official=importlib.import_module('pump_compare_function_bytes')
        for k,e in es.items():
            n,r=official.normalize(ts[k]['raw'],ts[k]['address'],e.sections)
            assert n==ts[k]['norm'] and r==ts[k]['refs'],k
        verification={'official_normalizer_crosscheck':'all three target byte strings and operand lists identical',
                      'official_tool_sha256':sha((a.official_tools/'pump_compare_function_bytes.py').read_bytes())}
    images={k:{'input_path':str(e.path),'image_sha256':sha(e.data),'target':{q:v for q,v in ts[k].items() if q not in ['raw','norm']},
               'target_raw_sha256':sha(ts[k]['raw']),'target_normalized_sha256':sha(ts[k]['norm'])}
            for k,e in es.items()}
    diff={'scope':__doc__,'script_sha256':sha(Path(__file__).read_bytes()),'normalizer_verification':verification,
          'images':images,'comparisons':{x+'_vs_'+y:comparison(ts[x],ts[y]) for x,y in [('original','parent'),('original','guard'),('parent','guard')]}}
    ps,gs=es['parent'],es['guard'];pr,gr=ts['parent']['refs'],ts['guard']['refs']
    pc=collections.defaultdict(list);gc=collections.defaultdict(list)
    for r in pr:
        if r['kind']=='direct-call':pc[r['target']].append(r['offset'])
    for r in gr:
        if r['kind']=='direct-call':gc[r['target']].append(r['offset'])
    callee_rows=[]; unpaired=set(gc)
    for target,sites in sorted(pc.items()):
        p=ps.callee(target); pkeys={(b['bytes'],b['normalized_sha256']) for b in p['bodies']}
        candidates=[]
        for gtarget in unpaired:
            g=gs.callee(gtarget);gkeys={(b['bytes'],b['normalized_sha256']) for b in g['bodies']}
            if pkeys and pkeys==gkeys and set(p['stable_names'])&set(g['stable_names']):
                candidates.append((gtarget,g))
        same=[v for v in candidates if v[0]==target]
        chosen=same[0] if len(same)==1 else candidates[0] if len(candidates)==1 else None
        row={'parent':p,'parent_call_offsets':sites,'candidate_matches':[x[0] for x in candidates]}
        if chosen:
            gt,g=chosen;unpaired.remove(gt)
            row.update({'guard':g,'guard_call_offsets':gc[gt],'full_normalized_callee_bodies_equal':True,
                        'call_multiplicity_equal':len(sites)==len(gc[gt]),
                        'mapping_basis':'identical complete narrowly normalized callee bodies and shared symbol identity excluding Rust hash; same address preferred',
                        'raw_callee_bodies_equal':[(x['bytes'],x['raw_sha256']) for x in p['bodies']]==[(x['bytes'],x['raw_sha256']) for x in g['bodies']]})
        else: row['unresolved']=True
        callee_rows.append(row)
    data_rows=[]; pd=collections.defaultdict(list);gd=collections.defaultdict(list)
    for r in pr:
        if r['kind']=='elf-pointer':
            assert len(r['sections'])==1
            sn=r['sections'][0];pd[(sn,r['value']-ps.sections[sn]['addr'])].append(r['offset'])
    for r in gr:
        if r['kind']=='elf-pointer':
            assert len(r['sections'])==1
            sn=r['sections'][0];gd[(sn,r['value']-gs.sections[sn]['addr'])].append(r['offset'])
    for key in sorted(set(pd)|set(gd)):
        sn,off=key; pb=ps.section_bytes(sn);gb=gs.section_bytes(sn)
        row={'section':sn,'section_relative_offset':off,'parent_instruction_offsets':pd.get(key,[]),
             'guard_instruction_offsets':gd.get(key,[]),'parent_value':ps.sections[sn]['addr']+off,
             'guard_value':gs.sections[sn]['addr']+off,'callsite_multiplicity_equal':len(pd.get(key,[]))==len(gd.get(key,[])),
             'entire_section_bytes_equal':pb==gb,'section_size_parent':len(pb),'section_size_guard':len(gb),
             'section_sha256_parent':sha(pb),'section_sha256_guard':sha(gb)}
        if pb==gb and key in pd and key in gd:
            row['referent_check']='same section-relative address in a byte-identical complete section'
        else:
            objs=[]
            for e in [ps,gs]:
                s=e.sections[sn];v=s['addr']+off
                objs.append([f for f in e.symbols if f['kind']==1 and f['section']==s['index'] and f['size'] and f['address']<=v<f['address']+f['size']])
            row['covering_object_symbols']=objs;row['referent_check']='unresolved: whole section not equal or pointer missing'
        data_rows.append(row)
    refs={'scope':'Parent-to-guard outbound reference comparison only. CALLs grouped by target with multiplicities, not claimed per-site semantic correspondence. Callees checked one level using complete narrow-normalized bodies; their own masked CALL/LDDW operands are not recursively validated. LDDW data pointers paired by section-relative address and checked against entire section bytes. Does not establish original-to-candidate call/data closure.',
          'script_sha256':sha(Path(__file__).read_bytes()),'images':{k:images[k]['image_sha256'] for k in ['parent','guard']},
          'direct_calls':{'parent_sites':sum(map(len,pc.values())),'guard_sites':sum(map(len,gc.values())),
                          'parent_distinct_targets':len(pc),'guard_distinct_targets':len(gc),'rows':callee_rows,
                          'unpaired_guard_targets':sorted(unpaired)},
          'lddw_pointers':{'parent_sites':sum(map(len,pd.values())),'guard_sites':sum(map(len,gd.values())),
                           'parent_distinct_referents':len(pd),'guard_distinct_referents':len(gd),'rows':data_rows}}
    a.output_directory.mkdir(parents=True,exist_ok=True)
    for name,data in [('audit_current_diff.json',diff),('audit_current_refs.json',refs)]:
        (a.output_directory/name).write_text(json.dumps(data,indent=2)+'\n')
    summary={'comparisons':{k:{q:v for q,v in r.items() if q not in ['sequence_edits','different_slots']} for k,r in diff['comparisons'].items()},
             'calls':{q:v for q,v in refs['direct_calls'].items() if q!='rows'},
             'unresolved_callees':sum(bool(r.get('unresolved')) for r in callee_rows),
             'calls_with_multiplicity_difference':sum(not r.get('call_multiplicity_equal',False) for r in callee_rows),
             'callees_with_raw_body_difference':sum(not r.get('raw_callee_bodies_equal',False) for r in callee_rows),
             'pointers':{q:v for q,v in refs['lddw_pointers'].items() if q!='rows'},
             'unresolved_data_referents':sum(r['referent_check'].startswith('unresolved') for r in data_rows)}
    (a.output_directory/'audit_current_summary.json').write_text(json.dumps(summary,indent=2)+'\n')
    print(json.dumps(summary,indent=2))

if __name__=='__main__':main()
