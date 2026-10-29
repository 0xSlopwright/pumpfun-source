from pathlib import Path
import urllib.request,urllib.error,json,hashlib,time
W=Path(__file__).resolve().parent
RPC='https://api.mainnet-beta.solana.com'
ADMIN='8LWu7QM2dGR1G8nKDHthckea57bkCzXyBTAKPJUBDHo8'
Q={'jsonrpc':'2.0','id':'fixed-admin-100','method':'getSignaturesForAddress','params':[ADMIN,{'commitment':'finalized','limit':100}]}
(W/'rpc-request.json').write_text(json.dumps({'endpoint':RPC,'request':Q,'scope':'Read-only fixed-admin signature listing, maximum100 signatures; no signing, credentials, or transaction submission.'},indent=2)+'\n')
start=time.time()
try:
 req=urllib.request.Request(RPC,data=json.dumps(Q).encode(),headers={'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=20)as resp:raw=resp.read();status=resp.status
 (W/'rpc-response.json').write_bytes(raw)
 payload=json.loads(raw);result=payload.get('result',[])
 summary={'http_status':status,'response_sha256':hashlib.sha256(raw).hexdigest(),'elapsed_seconds':time.time()-start,'rpc_error':payload.get('error'),'returned_signatures':len(result),'signature_rows':result}
except urllib.error.HTTPError as e:
 raw=e.read();(W/'rpc-response-error.bin').write_bytes(raw);summary={'http_status':e.code,'response_sha256':hashlib.sha256(raw).hexdigest(),'elapsed_seconds':time.time()-start,'returned_signatures':None,'error_type':'HTTPError'}
except Exception as e:
 summary={'http_status':None,'elapsed_seconds':time.time()-start,'returned_signatures':None,'error_type':type(e).__name__}
(W/'rpc-status.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps({k:v for k,v in summary.items()if k!='signature_rows'},indent=2))
