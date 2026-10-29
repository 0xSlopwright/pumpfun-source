"""Named signed CPI controls for canonical/holder identity ordering."""
from pathlib import Path
import argparse,hashlib,json,sys,types
W=Path(__file__).resolve().parent;R=W.parents[1];sys.path.insert(0,str(R/'scripts'))
import pump_amm_creator_reassignment_cto_differential as h
p=R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';clean=types.ModuleType('cleaner');exec(compile(p.read_bytes(),str(p),'exec'),clean.__dict__)
def cases():
 other=bytes(h.OTHER.pubkey()).hex();mint=bytes(h.MINT).hex();zero=bytes(32).hex()
 return [
 {'name':'canonical-success'},
 {'name':'wrong-pool-creator','pool_patches':[(11,other)]},
 {'name':'wrong-authority-account','wrong':'pool_authority'},
 {'name':'wrong-pool-base-mint','pool_patches':[(43,other)]},
 {'name':'mayhem-before-holder','holder':True,'new_none':True,'pool_patches':[(243,'01'),(270,'01')]},
 {'name':'mayhem-before-wrong-creator','pool_patches':[(243,'01'),(11,other)]},
 {'name':'existing-holder-downgrade','pool_patches':[(270,'01')]},
 {'name':'existing-holder-canonical-success','holder':True,'new_none':True,'pool_patches':[(270,'01')]},
 {'name':'existing-holder-wrong-creator','holder':True,'new_creator':str(h.OTHER.pubkey()),'pool_patches':[(270,'01')]},
 {'name':'new-holder-wrong-creator','holder':True,'new_creator':str(h.OTHER.pubkey())},
 {'name':'existing-holder-zero-creator','holder':True,'new_creator':str(h.Pubkey.default()),'pool_patches':[(270,'01')]},
 {'name':'holder-with-prior-cashback','holder':True,'new_none':True,'pool_patches':[(244,'01'),(270,'01')]},
 ]
def run(candidate,output):
 rows=[]
 for c in cases():
  a=h.run_case(c);b=h.run_case(c,candidate);aa,bb=clean.clean(a),clean.clean(b);diff=sorted(k for k in set(aa)|set(bb)if aa.get(k)!=bb.get(k));reached=[any('Instruction: AdminCtoPool' in x for x in r['logs'])for r in[a,b]];rows.append({'input':c,'original':a,'candidate':b,'different_fields':diff,'handler_reached':reached});print(json.dumps({'name':c['name'],'different_fields':diff,'handler_reached':reached,'original_error':a['error'],'candidate_error':b['error']}),flush=True)
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest();report={'candidate_sha256':sha(candidate),'original_sha256':sha(R/'evidence/original/pump_amm/deployed.so'),'producer_sha256':sha(__file__),'fixture_sha256':sha(R/'scripts/pump_amm_creator_reassignment_cto_differential.py'),'case_count':len(rows),'mismatch_count':sum(bool(x['different_fields'])for x in rows),'cases':rows};output.write_text(json.dumps(report,separators=(',',':'))+'\n')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();run(a.candidate.resolve(),a.output.resolve())
