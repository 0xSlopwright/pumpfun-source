"""Direct AMM holder-order controls through a retained synthetic Pump CPI caller."""
from pathlib import Path
import argparse,hashlib,json,types
import oracle_fixture as h
W=Path(__file__).resolve().parent;R=W.parents[1]
p=R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';clean=types.ModuleType('clean');exec(compile(p.read_bytes(),str(p),'exec'),clean.__dict__)
def cases():
 holder=str(h.Pubkey.find_program_address([b'holder-rewards',bytes(h.h.MINT)],h.h.PUMP)[0]);other=bytes(h.h.OTHER.pubkey()).hex()
 return [
 {'name':'canonical-success'},
 {'name':'existing-holder-success','holder':True,'coin_creator':holder,'patches':[(270,'01')]},
 {'name':'existing-holder-wrong-creator','holder':True,'patches':[(270,'01')]},
 {'name':'new-holder-wrong-creator','holder':True},
 {'name':'existing-holder-downgrade','patches':[(270,'01')]},
 {'name':'mayhem-before-holder-creator','holder':True,'patches':[(243,'01'),(270,'01')]},
 {'name':'wrong-canonical-creator-first','holder':True,'patches':[(11,other),(270,'01')]},
 {'name':'wrong-provided-authority','wrong_authority':True},
 {'name':'wrong-base-mint-constraint','patches':[(43,other)]},
 {'name':'existing-holder-zero-creator','holder':True,'coin_creator':str(h.Pubkey.default()),'patches':[(270,'01')]},
 ]
def run(candidate,output):
 rows=[]
 for c in cases():
  a=h.run(c,h.ORIGINAL);b=h.run(c,candidate);aa,bb=clean.clean(a),clean.clean(b);diff=sorted(k for k in set(aa)|set(bb)if aa.get(k)!=bb.get(k));rows.append({'input':c,'original':a,'candidate':b,'different_fields':diff});print(json.dumps({'name':c['name'],'original_error':a['error'],'candidate_error':b['error'],'different_fields':diff,'dispatch_logged':a['reached_amm']}),flush=True)
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest();r={'scope':__doc__,'candidate_sha256':sha(candidate),'original_sha256':sha(h.ORIGINAL),'oracle_sha256':sha(W/'synthetic-cpi-caller.so'),'fixture_sha256':sha(W/'oracle_fixture.py'),'producer_sha256':sha(__file__),'case_count':len(rows),'mismatch_count':sum(bool(c['different_fields'])for c in rows),'cases':rows};output.write_text(json.dumps(r,separators=(',',':'))+'\n')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();run(a.candidate,a.output)
