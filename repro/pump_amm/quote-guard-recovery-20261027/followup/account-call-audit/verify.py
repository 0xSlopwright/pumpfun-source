"""Check generated CreatePool/Liquidity bodies and actual immediate callees."""
from pathlib import Path
import argparse,hashlib,json,sys,types
HERE=Path(__file__).resolve().parent
ROOTS=[0x9a6a8,0x9e3b0,0xa0068,0xa1dd0,0xa2ac0,0xa4048,0xa8460]
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
def verify(candidate,symbols,original):
 p=HERE/'elf_reader.py';m=types.ModuleType('e');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);o=m.Elf(Path(original));c=m.Elf(Path(candidate));s=m.Elf(Path(symbols));assert hashlib.sha256(o.b).hexdigest()==ORIGINAL and c.b[c.lo:c.hi]==s.b[s.lo:s.hi];ends={a:b for a,b in zip(o.entries,o.entries[1:])};cf={f['start']:f for f in s.funcs};rows=[];pairs=set()
 for a in ROOTS:
  n=ends[a]-a;matches=[f for f in s.funcs if f['size']==n and c.normalized[f['start']:f['start']+n]==o.normalized[a:a+n]and c.pattern(f['start'],n)==o.pattern(a,n)];assert len(matches)==1,(hex(a),len(matches));f=matches[0];b=f['start'];oc=o.callsites(a,n);cc=c.callsites(b,n);assert len(oc)==len(cc);callees=[]
  for x,y in zip(oc,cc):
   assert x['offset']==y['offset'];u,v=x['target'],y['target'];size=ends[u]-u;g=cf[v];assert size==g['size']and o.normalized[u:u+size]==c.normalized[v:v+size]and o.pattern(u,size)==c.pattern(v,size);pairs.add((u,v));callees.append({'offset':x['offset'],'original':hex(u),'candidate':hex(v),'size':size,'normalized_sha256':hashlib.sha256(o.normalized[u:u+size]).hexdigest(),'candidate_name':g['name']})
  rows.append({'original':hex(a),'candidate':hex(b),'size':n,'candidate_name':f['name'],'normalized_sha256':hashlib.sha256(o.normalized[a:a+n]).hexdigest(),'relocation_pattern':o.pattern(a,n),'calls':callees})
 return {'verified':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'symbols_sha256':hashlib.sha256(s.b).hexdigest(),'original_sha256':ORIGINAL,'root_count':len(rows),'calls':sum(len(r['calls'])for r in rows),'unique_callee_pairs':len(pairs),'rows':rows,'scope':'Exact normalized bodies, relocation patterns and actual immediate callee body/patterns. Does not establish full recursive data/TypeId/source-coordinate identity or whole program equality.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--original',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.candidate,a.symbols,a.original),indent=2))
