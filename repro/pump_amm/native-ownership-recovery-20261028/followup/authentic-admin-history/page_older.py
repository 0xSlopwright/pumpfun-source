from pathlib import Path
import urllib.request,urllib.error,json,hashlib,time,datetime
W=Path(__file__).resolve().parent;RPC='https://api.mainnet-beta.solana.com';ADMIN='8LWu7QM2dGR1G8nKDHthckea57bkCzXyBTAKPJUBDHo8'
rows=json.loads((W/'rpc-status.json').read_text())['signature_rows'];before=rows[-1]['signature'];additional=[];pages=[]
for page in range(1,4):
 req={'jsonrpc':'2.0','id':'older-'+str(page),'method':'getSignaturesForAddress','params':[ADMIN,{'commitment':'finalized','limit':100,'before':before}]};(W/f'older-{page}-request.json').write_text(json.dumps({'endpoint':RPC,'request':req},indent=2)+'\n')
 try:
  with urllib.request.urlopen(urllib.request.Request(RPC,data=json.dumps(req).encode(),headers={'Content-Type':'application/json'}),timeout=20)as r:raw=r.read();status=r.status
  (W/f'older-{page}-response.json').write_bytes(raw);data=json.loads(raw);xs=data.get('result',[]);record={'page':page,'http_status':status,'response_sha256':hashlib.sha256(raw).hexdigest(),'rpc_error':data.get('error'),'count':len(xs)};pages.append(record)
  if data.get('error')or not xs:break
  additional+=xs;before=xs[-1]['signature'];record['oldest_block_time']=xs[-1]['blockTime'];record['oldest_utc']=datetime.datetime.fromtimestamp(xs[-1]['blockTime'],datetime.timezone.utc).isoformat()if xs[-1]['blockTime']else None
  if xs[-1]['blockTime']and xs[-1]['blockTime']<1740787200:break
 except Exception as e:pages.append({'page':page,'error_type':type(e).__name__});break
 time.sleep(.6)
(W/'older-status.json').write_text(json.dumps({'pages':pages,'signature_rows':additional},indent=2)+'\n');print(json.dumps({'pages':pages,'additional_signatures':len(additional),'successful':sum(x['err']is None for x in additional)},indent=2))
