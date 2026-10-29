from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import urllib.request,urllib.error,json,hashlib,time,base64
from solders.transaction import VersionedTransaction
W=Path(__file__).resolve().parent;RPC='https://api.mainnet-beta.solana.com';AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';CONFIG='ADyA8hdefvWN2dbGGWFotbzWxrAvLW83WG6QCVXvJKqw';ADMIN='8LWu7QM2dGR1G8nKDHthckea57bkCzXyBTAKPJUBDHo8'
rows=[r for r in json.loads((W/'older-status.json').read_text())['signature_rows']if r['err']is None]
D=W/'transactions';D.mkdir(exist_ok=True)
def fetch(t):
 sig=t['signature'];req={'jsonrpc':'2.0','id':sig,'method':'getTransaction','params':[sig,{'commitment':'finalized','encoding':'base64','maxSupportedTransactionVersion':0}]};(D/(sig+'.request.json')).write_text(json.dumps(req,indent=2)+'\n')
 out={'signature':sig,'slot_from_listing':t['slot']}
 try:
  with urllib.request.urlopen(urllib.request.Request(RPC,data=json.dumps(req).encode(),headers={'Content-Type':'application/json'}),timeout=20)as r:raw=r.read();out['http_status']=r.status
  (D/(sig+'.response.json')).write_bytes(raw);out['response_sha256']=hashlib.sha256(raw).hexdigest();p=json.loads(raw);v=p.get('result');out['rpc_error']=p.get('error');out['result_present']=v is not None
  if v is not None:
   tx=VersionedTransaction.from_bytes(base64.b64decode(v['transaction'][0]));keys=list(map(str,tx.message.account_keys));keys+=v['meta'].get('loadedAddresses',{}).get('writable',[])+v['meta'].get('loadedAddresses',{}).get('readonly',[])
   out['all_signatures_verify']=all(tx.verify_with_results());out['fixed_admin_required_signer']=ADMIN in list(map(str,tx.message.account_keys[:tx.message.header.num_required_signatures]));out['config_present']=CONFIG in keys;out['error']=v['meta']['err'];out['amm_instructions']=[{'index':i,'discriminator':bytes(ix.data)[:8].hex(),'data_hex':bytes(ix.data).hex(),'account_addresses':[keys[k]for k in ix.accounts]}for i,ix in enumerate(tx.message.instructions)if keys[ix.program_id_index]==AMM]
 except urllib.error.HTTPError as e:
  raw=e.read();(D/(sig+'.error.bin')).write_bytes(raw);out.update(http_status=e.code,response_sha256=hashlib.sha256(raw).hexdigest(),error_type='HTTPError')
 except Exception as e:out['error_type']=type(e).__name__
 time.sleep(.3);return out
with ThreadPoolExecutor(max_workers=2)as ex:out=list(ex.map(fetch,rows))
(W/'older-transaction-index.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps({'fetched':len(out),'present':sum(v.get('result_present',False)for v in out),'all_signatures_verified':sum(v.get('all_signatures_verify',False)for v in out),'amm_transactions':sum(bool(v.get('amm_instructions',[]))for v in out),'errors':[{k:v[k]for k in ['http_status','error_type','rpc_error']if k in v}for v in out if v.get('error_type')or v.get('rpc_error')]},indent=2))
