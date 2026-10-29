"""Signed offline cashback state-boundary cases using the unchanged legacy-sell producer."""
from pathlib import Path
import argparse,base64,hashlib,json,struct,sys
R=Path(__file__).resolve().parents[2];sys.path.insert(0,str(R/'scripts'))
import pump_legacy_sell_differential as f
from solders.rent import Rent
p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
key=f.f.ixs[-1].accounts[11].pubkey;original=f.INITIAL[key]
minimum=Rent.default().minimum_balance(137)
specs=[{'name':'existing-valid'},{'name':'existing-user-zero','zero_user':True},{'name':'existing-wrong-owner','system_owner':True},{'name':'existing-bad-discriminator','bad_disc':True},{'name':'existing-counter-overflow','overflow':True}]
specs += [{'name':f'existing-short-{n}','length':n}for n in [1,7,8,39,40,73,74,81,82,105,106]]
specs += [{'name':f'empty-system-{lamports}','length':0,'system_owner':True,'lamports':lamports}for lamports in [0,1,minimum-1,minimum,minimum+1]]
specs += [{'name':'empty-already-program-owned','length':0,'lamports':minimum}]
rows=[]
try:
 for spec in specs:
  data=bytearray(original.data)
  if spec.get('zero_user'):data[8:40]=bytes(32)
  if spec.get('bad_disc'):data[0]^=1
  if spec.get('overflow'):struct.pack_into('<Q',data,74,2**64-1)
  data=data[:spec.get('length',len(data))]
  owner=f.f.Pubkey.default()if spec.get('system_owner')else original.owner
  f.INITIAL[key]=f.f.Account(spec.get('lamports',original.lamports),bytes(data),owner)
  case={'name':spec['name'],'curve_bytes':[[82,1]],'cashback_account':True}
  o=f.run(case);b=f.run(case,a.candidate)
  diff=[k for k in ['error','accounts','events','inner','return_data']if o[k]!=b[k]]
  rows.append({'case':spec,'original':o,'candidate':b,'different_fields':diff,'match':not diff})
finally:f.INITIAL[key]=original
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
d={'scope':__doc__,'original_sha256':sha(R/'evidence/original/pump/deployed.so'),'candidate_sha256':sha(a.candidate),'producer_sha256':sha(Path(__file__)),'unchanged_base_producer_sha256':sha(Path(f.__file__)),'case_count':len(rows),'cases':rows,'mismatches':[i for i,x in enumerate(rows)if not x['match']]}
a.output.write_text(json.dumps(d,indent=2)+'\n')
print(json.dumps({'cases':len(rows),'mismatches':d['mismatches'],'original_outcomes':{x['case']['name']:x['original']['error']for x in rows}},indent=2))
assert not d['mismatches']
