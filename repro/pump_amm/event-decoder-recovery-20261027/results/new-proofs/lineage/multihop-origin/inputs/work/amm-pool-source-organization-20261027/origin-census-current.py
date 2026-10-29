"""Read-only residual census: prove source-origin-only body differences conservatively.

The origin mask only covers immediate stores in an actual file/length/line
record. It does not blanket-mask error constants or accept near byte similarity.
Other pairings require a real call edge from a body already matched under exact
normalization (or under this narrowly defined source-origin rule).
"""
from pathlib import Path
import collections,hashlib,json,struct,sys,gzip
W=Path(__file__).resolve().parent;ROOT=W.parents[1]
sys.path.insert(0,str(ROOT/'repro/pump_amm/claim-self-transfer-v144/static-tool'))
from elf_reader import Elf
B=ROOT/'repro/pump_amm/error-order-recovery-20261027/results'
MEASUREMENT=B/'measurement.json.gz'
measure=json.loads(gzip.decompress(MEASUREMENT.read_bytes()))
o=Elf(ROOT/'evidence/original/pump_amm/deployed.so');c=Elf(B/'build/unstripped.so')
sha=lambda b:hashlib.sha256(b).hexdigest()
assert measure['candidate_sha256']==sha((B/'build/candidate.so').read_bytes())
assert measure['symbols_sha256']==sha(c.b)

def source_fields(e,start,size):
    out=[]
    for at in range(start,start+size-16,8):
        if e.b[at]!=0x18 or e.relocations.get(at,{}).get('type')!=8:continue
        reg=e.b[at+1]&15;ptr=struct.unpack_from('<I',e.b,at+4)[0]|struct.unpack_from('<I',e.b,at+12)[0]<<32
        for st in range(at+16,min(at+96,start+size),8):
            op,rs,off,imm=struct.unpack_from('<BBhi',e.b,st)
            if op in(0x85,0x8d,0x95)or op&7==5:break
            # Only an immediate store of the just-loaded pointer to r10 counts.
            # This excludes register-overwrite and alias-tracking assumptions.
            if st!=at+16 or op!=0x7b or rs>>4!=reg or rs&15!=10:continue
            base=rs&15;fields={}
            for p in range(st+8,min(st+192,start+size),8):
                op2,rs2,off2,imm2=struct.unpack_from('<BBhi',e.b,p)
                if op2 in(0x85,0x8d,0x95)or op2&7==5:break
                if rs2&15==base and ((op2==0x7a and off2==off+8)or(op2==0x62 and off2==off+16)):
                    fields[off2-off]=(p,imm2)
            if 8 not in fields or 16 not in fields:continue
            n=fields[8][1];line=fields[16][1]
            if not(0<n<512 and 0<line<100000):continue
            text=e.b[ptr:ptr+n]
            if not text.endswith(b'.rs')or any(v<32 or v>126 for v in text):continue
            out.append({'reference':at,'pointer':ptr,'pointer_store':st,'base_register':base,'field_offset':off,'length_store':fields[8][0],'line_store':fields[16][0],'filename':text.decode(),'length':n,'line':line})
            break
    # One physical source record may be reached from duplicate LDDWs; do not
    # invent separate record extents or count a store twice.
    unique={ (x['length_store'],x['line_store']):x for x in out }
    return list(unique.values())

def masked(e,a,n):
    data=bytearray(e.normalized[a:a+n]);fields=source_fields(e,a,n)
    for f in fields:
        for p in [f['length_store'],f['line_store']]:data[p-a+4:p-a+8]=bytes(4)
    return bytes(data),fields

funcs=collections.defaultdict(list)
for f in c.funcs:funcs[f['start']].append(f)
unique={ (f['start'],f['size']):f for f in c.funcs }
masked_index=collections.defaultdict(list);same_size=collections.defaultdict(list)
for (a,n),f in unique.items():
    data,fields=masked(c,a,n);row={**f,'source_fields':fields,'masked_sha256':sha(data)}
    masked_index[n,sha(data),json.dumps(c.pattern(a,n),sort_keys=True)].append(row)
    same_size[n].append(f)
orig={r['start']:r for r in measure['rows']};origin_rows={};allpairs=set()
for r in measure['rows']:
    a=r['start'];n=r['end']-a
    if r['matches']:
        allpairs.update((a,x['start'])for x in r['matches']);continue
    data,fields=masked(o,a,n)
    matches=masked_index[n,sha(data),json.dumps(o.pattern(a,n),sort_keys=True)]
    if fields and matches:
        row={'original':a,'bytes':n,'original_source_fields':fields,'matches':matches,'classification':'Only proved source file length/line stores differ in normalized body'}
        origin_rows[a]=row;allpairs.update((a,x['start'])for x in matches)

edges=collections.defaultdict(list)
for a,b in sorted(allpairs):
    r=orig[a];n=r['end']-a
    oc=o.callsites(a,n);cc=c.callsites(b,n)
    assert [x['offset']for x in oc]==[x['offset']for x in cc]
    for x,y in zip(oc,cc):
        edges[x['target']].append({'original_parent':a,'candidate_parent':b,'call_offset':x['offset'],'candidate_target':y['target'],'parent_status':'exact body'if orig[a]['matches']else'proved source-origin-only body'})

def diff(a,b,n,k):
    x,y=o.normalized[a:a+n],c.normalized[b:b+k];overlap=min(n,k)
    ins=[off for off in range(0,overlap,8)if x[off:off+8]!=y[off:off+8]]
    return {'original_bytes':n,'candidate_bytes':k,'shared_instruction_differences':len(ins),'difference_offsets':ins,'normalized_equal_bytes_in_shared':sum(p==q for p,q in zip(x,y)),'shared_bytes':overlap,'call_offsets_equal': [z['offset']for z in o.callsites(a,n)]==[z['offset']for z in c.callsites(b,k)]}

residuals=[]
for a,r in orig.items():
    if r['matches']:continue
    n=r['end']-a
    if a in origin_rows:residuals.append(origin_rows[a]);continue
    actual=[]
    for b in sorted({x['candidate_target']for x in edges[a]}):
        for f in funcs.get(b,[]):
            actual.append({'candidate':f,'proof_edges':[x for x in edges[a]if x['candidate_target']==b],**diff(a,b,n,f['size'])})
    actual.sort(key=lambda x:(abs(x['candidate_bytes']-n),x['shared_instruction_differences']))
    near=[]
    if not actual:
        for f in same_size[n]:
            d=diff(a,f['start'],n,n);near.append({'candidate':f,**d})
        near.sort(key=lambda x:x['shared_instruction_differences']);near=near[:3]
    residuals.append({'original':a,'bytes':n,'classification':'Actual callees differ beyond proved source-origin stores'if actual else'No counterpart established by exact/source-origin parent calls','actual_call_pairs':actual,'nearest_equal_size_diagnostics_only':near})

report={'scope':__doc__,'candidate_sha256':measure['candidate_sha256'],'symbols_sha256':sha(c.b),'measurement_sha256':sha(MEASUREMENT.read_bytes()),'source_coordinate_rule':'A relocated pointer is immediately stored to r10, followed in the same branch-free call-free block by exact field offsets+8 length and+16 line; the pointed ASCII slice must end in .rs. Only those identified store immediate bytes may differ.','summary':{'windows':len(orig),'exact_normalized':sum(bool(r['matches'])for r in orig.values()),'residuals':len(residuals),'classes':dict(collections.Counter(r['classification']for r in residuals))},'residuals':residuals,'limits':['Source-origin-only is a statement about normalized body bytes and the typed record stores, not whole object/data/callee identity.','Actual call pairs are established from matched parent call offsets; different parent instantiations can supply several legitimate counterparts.','Nearest same-size candidates without call evidence are only search leads, not established source mappings.','A non-origin body difference does not establish a runtime behavior mismatch. Existing runtime evidence remains separate.']}
(W/'census.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report['summary'],indent=2))
