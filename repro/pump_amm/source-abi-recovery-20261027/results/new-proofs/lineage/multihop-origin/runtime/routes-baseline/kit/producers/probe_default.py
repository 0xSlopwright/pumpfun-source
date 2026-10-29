"""Signed route-preflight and curve boundary collision matrix."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,struct,sys
R=Path(__file__).resolve().parents[2];sys.path.insert(0,str(R/'scripts'));import pump_amm_multi_hop_differential as h
s=importlib.util.spec_from_file_location('cleaner',R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');cleaner=importlib.util.module_from_spec(s);s.loader.exec_module(cleaner)
ROUTES={'two-amm':h.route2,'two-curve':h.two_curves,'curve-amm':h.curve_then_amm,'amm-curve':h.amm_then_curve}
def change(vm,key,offset,value,owner=None,length=None):
 a=vm.vm.get_account(key);raw=bytearray(a.data);raw[offset:offset+len(value)]=value
 if length is not None:raw=raw[:length].ljust(length,b'\0')
 vm.vm.set_account(key,h.Account(a.lamports,bytes(raw),owner or a.owner))
def setup(sell,route,mutation):
 def apply(vm,m):
  (h.curve_route if route=='one-curve'else ROUTES[route])(sell)(vm,m)
  if mutation in ['valid','amount-zero','limit-zero']:return
  if mutation=='wrong-output-mint':change(vm,m[2].pubkey,0,bytes(h.OUTSIDER.pubkey()))
  elif mutation=='swap-next-mints':m[21],m[22]=m[22],m[21]
  elif mutation=='duplicate-next-mints':m[21]=m[22]
  elif mutation=='first-owner':change(vm,m[18].pubkey,0,b'',owner=h.Pubkey.default())
  elif mutation=='next-owner':change(vm,m[23].pubkey,0,b'',owner=h.Pubkey.default())
  elif mutation=='swap-plus-next-owner':
   m[21],m[22]=m[22],m[21];change(vm,m[23].pubkey,0,b'',owner=h.Pubkey.default())
  elif mutation=='output-plus-first-owner':
   change(vm,m[2].pubkey,0,bytes(h.OUTSIDER.pubkey()));change(vm,m[18].pubkey,0,b'',owner=h.Pubkey.default())
  elif mutation=='first-mint-short':change(vm,m[16].pubkey,0,b'',length=1)
  elif mutation=='next-mint-short':change(vm,m[21].pubkey,0,b'',length=1)
  elif mutation=='repeat-first-group':m[21:26]=m[16:21]
  else:
   destination=m[2].pubkey if route=='one-curve'else m[24 if sell else 25].pubkey
   source=m[1].pubkey
   if mutation.startswith('dest-owner-'):
    owner={'system':h.Pubkey.default(),'token':h.TOKEN,'token22':h.TOKEN22,'amm':h.PROGRAM}[mutation[11:]];change(vm,destination,0,b'',owner=owner)
   elif mutation=='src-owner-flip':change(vm,source,0,b'',owner=h.TOKEN22 if vm.vm.get_account(source).owner==h.TOKEN else h.TOKEN)
   elif mutation=='src-authority':change(vm,source,32,bytes(h.OUTSIDER.pubkey()))
   elif mutation=='src-zero':change(vm,source,64,struct.pack('<Q',0))
   elif mutation=='dest-max':change(vm,destination,64,struct.pack('<Q',2**64-1))
   elif mutation=='src-state':change(vm,source,108,b'\3')
   elif mutation=='src-auth-dest-empty':
    change(vm,source,32,bytes(h.OUTSIDER.pubkey()));change(vm,destination,0,b'',length=0)
   elif mutation=='src-zero-dest-owner':
    change(vm,source,64,struct.pack('<Q',0));change(vm,destination,0,b'',owner=h.PROGRAM)
   elif mutation=='src-owner-dest-empty':
    change(vm,source,0,b'',owner=h.TOKEN22 if vm.vm.get_account(source).owner==h.TOKEN else h.TOKEN);change(vm,destination,0,b'',length=0)
   else:raise AssertionError(mutation)
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();specs=[]
 preflight=['valid','amount-zero','limit-zero','wrong-output-mint','swap-next-mints','duplicate-next-mints','first-owner','next-owner','swap-plus-next-owner','output-plus-first-owner','first-mint-short','next-mint-short','repeat-first-group']
 for sell in [False,True]:
  for route in ROUTES:
   for mutation in preflight:specs.append(('preflight',sell,route,mutation))
  route='amm-curve'if sell else'curve-amm'
  for selected in ['one-curve',route]:
   for mutation in ['dest-owner-system','dest-owner-token','dest-owner-token22','dest-owner-amm','src-owner-flip','src-authority','src-zero','dest-max','src-state','src-auth-dest-empty','src-zero-dest-owner','src-owner-dest-empty']:specs.append(('curve-boundary',sell,selected,mutation))
 rows=[]
 for group,sell,route,mutation in specs:
  kw={'sell':sell,'amount':0 if mutation=='amount-zero'else 10**6,'limit':0 if mutation=='limit-zero'else 1,'overrides':setup(sell,route,mutation)};x=h.run(**kw);y=h.run(candidate=a.candidate,**kw);assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':{'group':group,'sell':sell,'route':route,'mutation':mutation},'original':x,'candidate':y,'mismatched_fields':diff})
 out={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as f:
  with gzip.GzipFile(fileobj=f,filename='',mode='wb',mtime=0)as z:z.write((json.dumps(out,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(r['original']['error']is None for r in rows),'differences':[{'case':r['case'],'fields':r['mismatched_fields'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error']}for r in rows if r['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
