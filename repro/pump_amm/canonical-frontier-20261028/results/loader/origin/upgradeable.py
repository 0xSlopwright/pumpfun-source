from pathlib import Path
import sys,json,base64,struct,hashlib,argparse,re
from types import SimpleNamespace
from solders.litesvm import LiteSVM
W=Path(__file__).parent;R=W.parents[1];I=R/'work/amm-v2-mint-clone-combined-20261028/runtime-inputs';sys.path.insert(0,str(I/'scripts'));import pump_amm_create_differential as b
PUMP=b.Pubkey.from_string('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P')

LOADS=[]
CAPTURE=json.loads((W/'capture/capture.json').read_text())
UPGRADE=b.Pubkey.from_string(CAPTURE['owner'])
PD=b.Pubkey.from_string(CAPTURE['programdata'])
def fresh_upgradeable(candidate):
 vm=LiteSVM().with_transaction_history(0)
 vm.set_clock(b.Clock(100,1234567890,0,0,1234567890))
 for who in [b.PAYER,b.OUTSIDER]:vm.airdrop(who.pubkey(),10**12)
 vm.set_account(b.EVENT,b.Account(10**9,b'',b.Pubkey.default()))
 assert vm.get_account(b.PROGRAM) is None
 program=(W/'capture/program-account.bin').read_bytes()
 header=(W/'capture/programdata-account.bin').read_bytes()[:45]
 payload=Path(candidate).read_bytes();pd=header+payload
 vm.set_account(PD,b.Account(CAPTURE['lamports'],pd,UPGRADE,False))
 vm.set_account(b.PROGRAM,b.Account(10**9,program,UPGRADE,True))
 a=vm.get_account(b.PROGRAM);d=vm.get_account(PD)
 assert bytes(a.data)==program and a.owner==UPGRADE and a.executable
 assert bytes(d.data)==pd and d.owner==UPGRADE and not d.executable
 LOADS.append({'file_sha256':hashlib.sha256(payload).hexdigest(),'program_account_bytes':len(a.data),'program_account_sha256':hashlib.sha256(bytes(a.data)).hexdigest(),'programdata_bytes':len(d.data),'programdata_sha256':hashlib.sha256(bytes(d.data)).hexdigest(),'payload_sha256':hashlib.sha256(bytes(d.data)[45:]).hexdigest(),'owner':str(UPGRADE),'programdata_key':str(PD),'metadata_sha256':hashlib.sha256(header).hexdigest(),'loader_cache_clock_slot':100,'captured_deploy_slot':CAPTURE['last_deploy_slot'],'fresh_vm_without_amm_legacy_load':True})
 return SimpleNamespace(vm=vm)

def one(candidate,canonical,kind='fee',bps=0,cap=0):
 h=fresh_upgradeable(candidate);h.vm.set_clock(b.Clock(100,1234567890,0,0,1234567890))
 for pid,name in [(b.TOKEN,'spl_token'),(b.TOKEN22,'spl_token_2022'),(b.ATA,'associated_token')]:h.vm.add_program_from_file(pid,I/'evidence/dependencies'/name/'deployed.so')
 if canonical:h.vm.add_program_from_file(PUMP,W/'caller.so')
 glob=bytearray(b.RAW);glob[56]=0;h.vm.set_account(b.CONFIG_KEY,b.Account(b.CONFIG['lamports'],bytes(glob),b.PROGRAM))
 creator=b.Pubkey.find_program_address([b'pool-authority',bytes(b.base)],PUMP)[0] if canonical else b.PAYER.pubkey()
 if canonical:h.vm.set_account(creator,b.Account(10**13,b'',b.Pubkey.default()))
 for name in ['base_mint','quote_mint']:
  row=b.f['accounts'][name];key=b.Pubkey.from_string(row['address']);raw=base64.b64decode(row['data_base64']);owner=b.Pubkey.from_string(row['owner'])
  if name=='quote_mint':
   owner=b.TOKEN22;raw=raw[:82]
   if kind!='plain':
    value=bytes(72)+struct.pack('<QQH',0,cap,bps)*2
    tlv=struct.pack('<HH',1,108)+value
    if kind=='duplicate':tlv+=tlv
    if kind=='short':tlv=struct.pack('<HH',1,1)+b'\x00'
    raw+=bytes(83)+b'\x01'+tlv
  h.vm.set_account(key,b.Account(row['lamports'],raw,owner))
 for key,mint,program in [(b.userbase,b.base,b.TOKEN),(b.userquote,b.quote,b.TOKEN22)]:
  data=b.token(mint,creator,10**12,False)
  if program==b.TOKEN22 and kind!='plain':data+=b'\x02'+struct.pack('<HHQ',2,8,0)
  h.vm.set_account(key,b.Account(10**9,data,program))
 pool=b.Pubkey.find_program_address([b'pool',struct.pack('<H',0),bytes(creator),bytes(b.base),bytes(b.quote)],b.PROGRAM)[0];lp=b.Pubkey.find_program_address([b'pool_lp_mint',bytes(pool)],b.PROGRAM)[0]
 ata=lambda owner,mint,program:b.Pubkey.find_program_address([bytes(owner),bytes(program),bytes(mint)],b.ATA)[0]
 keys=[pool,b.CONFIG_KEY,creator,b.base,b.quote,lp,b.userbase,b.userquote,ata(creator,lp,b.TOKEN22),ata(pool,b.base,b.TOKEN),ata(pool,b.quote,b.TOKEN22),b.Pubkey.default(),b.TOKEN22,b.TOKEN,b.TOKEN22,b.ATA,b.EVENT,b.PROGRAM]
 spec=next(x for x in b.IDL['instructions']if x['name']=='create_pool');metas=[b.AccountMeta(k,bool(a.get('signer'))and not canonical,bool(a.get('writable')))for k,a in zip(keys,spec['accounts'])]
 data=bytes(spec['discriminator'])+struct.pack('<HQQ',0,10**6,10**6)+bytes(b.OUTSIDER.pubkey())+b'\x00'+bytes(11)
 tx=b.Transaction.new_signed_with_payer([b.Instruction(PUMP if canonical else b.PROGRAM,data,metas)],b.PAYER.pubkey(),[b.PAYER],h.vm.latest_blockhash());before={str(k):None if(a:=h.vm.get_account(k))is None else {'lamports':a.lamports,'owner':str(a.owner),'data':bytes(a.data).hex()}for k in keys[:11]}
 result=h.vm.send_transaction(tx);failed=isinstance(result,b.FailedTransactionMetadata);meta=result.meta()if failed else result
 after={str(k):None if(a:=h.vm.get_account(k))is None else {'lamports':a.lamports,'owner':str(a.owner),'data':bytes(a.data).hex()}for k in keys[:11]}
 return {'transaction_base64':base64.b64encode(bytes(tx)).decode(),'before':before,'after':after,'error':str(result.err())if failed else None,'logs':meta.logs(),'inner':json.loads(meta.to_json())['inner_instructions']}

def clean(r):
 r=dict(r);r['logs']=[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',x)for x in r['logs']if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',x)];return r

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();rows=[]
 for canonical in [False,True]:
  for kind,bps,cap in [('plain',0,0),('duplicate',0,0),('short',0,0)]+[('fee',bps,cap)for bps in [0,1,100]for cap in [0,1,100]]:
   old=one(I/'evidence/original/pump_amm/deployed.so',canonical,kind,bps,cap);new=one(a.candidate,canonical,kind,bps,cap);x,y=clean(old),clean(new);diff=[k for k in x if x[k]!=y[k]];rows.append({'input':{'canonical':canonical,'kind':kind,'bps':bps,'cap':cap},'original':old,'candidate':new,'different_fields':diff})
 H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r={'upgradeable_loads':LOADS,'candidate_sha256':H(a.candidate),'original_sha256':H(I/'evidence/original/pump_amm/deployed.so'),'caller_sha256':H(W/'caller.so'),'producer_sha256':H(Path(__file__)),'case_count':len(rows),'mismatch_count':sum(bool(x['different_fields'])for x in rows),'cases':rows,'scope':'Fresh VMs load AMM only from captured upgradeable Program and ProgramData accounts; synthetic Pump only in canonical cases. Current Clock slot100 retained; LiteSVM cache uses current slot instead of captured deploy slot. No broad deployment/clock or network claim.'};a.output.write_text(json.dumps(r,separators=(',',':'))+'\n');print({k:v for k,v in r.items()if k!='cases'});assert r['mismatch_count']==0
if __name__=='__main__':main()
