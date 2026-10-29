"""Finite saved-wire, declared fixture and watched-state correspondence only.

This module never imports a producer/harness or constructs a VM. Historical
image declarations are checked, not execution-attested. It does not claim a
complete economic implementation or a current selected-image runtime result.
"""
if not __debug__:
    raise SystemExit('Run without -O')
import base64, hashlib, json, struct
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.transaction import Transaction

PROGRAM=Pubkey.from_string('pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA')
TOKEN=Pubkey.from_string('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
TOKEN22=Pubkey.from_string('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb')
ATA=Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
FEES=Pubkey.from_string('pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ')
PAYER=Keypair.from_seed(bytes([201])*32).pubkey()
OUTSIDER=Keypair.from_seed(bytes([202])*32).pubkey()
IMAGE_BINDINGS={
 'original':('evidence/original/pump_amm/deployed.so','6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'),
 'control':('research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz','7a300434dced61413bde10788594b427d5649563e0223efcf09e6b214aff7ad3'),
 'candidate':('research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz','d17a657baf5cc19736a924c41e75424604411ddbe9f6e72cddf41ab72a695007'),
}
BUY_EVENT_DISC=bytes.fromhex('67f4521f2cf57777')
def sha(b):return hashlib.sha256(b).hexdigest()
def canonical(value):return json.dumps(value,sort_keys=True,separators=(',',':')).encode()
def pda(seeds,program=PROGRAM):return Pubkey.find_program_address(seeds,program)[0]
def ata(owner,mint,token):return pda([bytes(owner),bytes(token),bytes(mint)],ATA)
def snapshot(data,lamports,owner):return dict(data_hex=bytes(data).hex(),lamports=lamports,owner=str(owner))
def u64(data,offset):return struct.unpack_from('<Q',data,offset)[0]

def prepare(repo,packet,report,receipts,case_pin,input_pin,producer_pin,repo_pins):
 import gzip
 assert sha(canonical([row['case']for row in report['cases']]))==case_pin,'exact42case definitions'
 assert len({row['case']['label']for row in report['cases']})==42,'42unique case labels'
 assert sha((packet/'case-inputs.json').read_bytes())==input_pin,'case input declarations'
 assert sha((packet/'producer.py').read_bytes())==producer_pin,'preserved producer'
 for name,digest in repo_pins.items():assert sha((repo/name).read_bytes())==digest,'fixture/helper input '+name
 declared={}
 for label,(name,digest)in IMAGE_BINDINGS.items():
  raw=(repo/name).read_bytes();raw=gzip.decompress(raw)if name.endswith('.gz')else raw
  assert sha(raw)==digest,'historical image bytes '+label;declared[label]=digest
 assert report['image_sha256']==declared,'historical image declarations'
 inputs=json.loads((packet/'case-inputs.json').read_text());cases=[row['case']for row in report['cases']]
 assert list(inputs)==[c['label']for c in cases],'ordered42input declarations'
 assert len(receipts)==126 and report['counts']==dict(vms=126,transactions=126,signature_fields=126),'all126receipts'
 for i,row in enumerate(receipts):
  c=cases[i//3];assert row['context']==dict(index=i//3,image=('original','control','candidate')[i%3],family=c['family'],instruction=c['instruction'],label=c['label']),'exactcase/image receipt consumption'
  assert row['sequence']==row['vm']==i,'receipt order'
 for i in range(0,126,3):
  group=receipts[i:i+3]
  assert all(r['before']==group[0]['before'] and r['transaction_base64']==group[0]['transaction_base64']for r in group),'same retained prestate/wire across three historical images'
 idl=json.loads((repo/'evidence/upstream/pump_amm.json').read_text())
 assert bytes(next(e for e in idl['events']if e['name']=='BuyEvent')['discriminator'])==BUY_EVENT_DISC,'IDL BuyEvent discriminator'
 fixture=json.loads((repo/'research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json').read_text())
 cfg=next(x for x in json.loads((repo/'research/imported-lab/analysis/pump_fun/config-snapshot.json').read_text())['accounts']if x['program_name']=='pump_amm')
 return dict(inputs=inputs,idl=idl,fixture=fixture,config=cfg)

def check(row,case,ctx):
 spec=ctx['inputs'][case['label']];label=case['label'];fixture=ctx['fixture'];f=fixture['accounts']
 pool=Pubkey.from_string(fixture['pool']);base=Pubkey.from_string(fixture['keys']['base_mint']);quote=Pubkey.from_string(fixture['keys']['quote_mint']);rawpool=bytearray(base64.b64decode(f['pool']['data_base64']))
 cfg=ctx['config'];config=Pubkey.from_string(cfg['address']);glob=bytearray(base64.b64decode(cfg['data_base64']));glob[8:40]=bytes(PAYER);glob[56]=8 if label=='cb-disable8'else 0
 protocol=Pubkey.from_bytes(bytes(glob[57:89]));creator=pda([b'creator_vault',bytes(rawpool[211:243])]);volume=pda([b'user_volume_accumulator',bytes(PAYER)]);globalvol=pda([b'global_volume_accumulator']);p2=pda([b'pool-v2',bytes(base)]);buyback=Pubkey.from_string(f['buyback_fee_recipient']['address']);bbowner=Pubkey.from_bytes(base64.b64decode(f['buyback_fee_recipient']['data_base64'])[32:64]);feeconfig=Pubkey.from_string(fixture['keys']['fee_config'])
 quote_token=TOKEN22 if spec['tf']else TOKEN
 roles=dict(fee_payer=PAYER,pool=pool,global_config=config,userbase=Pubkey.from_bytes(bytes([70])*32),userquote=Pubkey.from_bytes(bytes([71])*32),vaultbase=Pubkey.from_string(fixture['keys']['pool_base_token_account']),vaultquote=Pubkey.from_string(fixture['keys']['pool_quote_token_account']),protocol_ata=ata(protocol,quote,quote_token),creator_ata=ata(creator,quote,quote_token),buyback=ata(bbowner,quote,quote_token)if spec['tf']else buyback,uvata=ata(volume,quote,quote_token),volume=volume)
 assert row['roles']=={k:str(v)for k,v in roles.items()},'fixture/signed watched roles'
 cashback=not(label=='anchor-nocb-buy'or label=='mayhem-buy'or label.startswith('creator0-noncb'))
 rawpool[243]=int(label in ['mayhem-buy','cb-mayhem-buy']);rawpool[244]=int(cashback)
 before,after=row['before'],row['after']
 assert before[str(pool)]==snapshot(rawpool,f['pool']['lamports'],PROGRAM),'actual pool prestate flags/fixture'
 assert before[str(config)]==snapshot(glob,cfg['lamports'],PROGRAM),'actual global config prestate'
 fee=next(x for x in f.values()if x['address']==str(feeconfig));rawfee=base64.b64decode(fee['data_base64'])
 if case['family']=='C':rawfee=(rawfee[:41]+struct.pack('<QQQI',25,5,0,1)+bytes(16)+struct.pack('<QQQ',2,93,0)+struct.pack('<I',0)+bytes(24)).ljust(4097,b'\0')
 assert before[str(feeconfig)]==snapshot(rawfee,fee['lamports'],Pubkey.from_string(fee['owner'])),'actual feeconfig fixture/tier'
 mint=f['quote_mint'];rawmint=base64.b64decode(mint['data_base64'])
 if spec['tf']:
  transfer=bytes(72)+struct.pack('<QQH',0,spec['transfer_fee_maximum'],spec['transfer_fee_bps'])*2
  rawmint=rawmint[:82]+bytes(83)+b'\1'+struct.pack('<HH',1,len(transfer))+transfer
 assert before[str(quote)]==snapshot(rawmint,mint['lamports'],quote_token),'actual quote mint/transfer-fee fixture'
 existing={'cb-track1-existing':(57,1000),'cb-earned-accum':(74,1000),'cb-earned-overflow':(74,2**64-1)}
 volume_before=None
 if label in existing:
  disc=bytes(next(x for x in ctx['idl']['accounts']if x['name']=='UserVolumeAccumulator')['discriminator']);data=bytearray(disc+bytes(PAYER)+bytes(97));offset,value=existing[label];struct.pack_into('<Q',data,offset,value);volume_before=snapshot(data,10**9,PROGRAM)
 assert before[str(volume)]==volume_before,'actual initial volume fixture'
 keys=[pool,PAYER,config,base,quote,roles['userbase'],roles['userquote'],roles['vaultbase'],roles['vaultquote'],protocol,roles['protocol_ata'],TOKEN,quote_token,Pubkey.default(),ATA,pda([b'__event_authority']),PROGRAM,roles['creator_ata'],creator,globalvol,volume,feeconfig,FEES]
 desc=next(x for x in ctx['idl']['instructions']if x['name']==case['instruction']);metas=[(k,bool(a.get('signer')),bool(a.get('writable')))for k,a in zip(keys,desc['accounts'])]
 if spec['remaining']:metas +=[(p2,False,False),(bbowner,False,False),(roles['buyback'],False,True)]
 with_cashback=(cashback and label not in ['cb-noremain','cb-std-remaining','creator0-cb-std','creator0-cb-trimmed'])
 if with_cashback:metas.insert(23,(roles['uvata'],False,True))
 if label=='cb-del-uvata':del metas[23]
 if label.startswith('creator0-')and label.endswith('-trimmed'):del metas[23]
 trims={'cb-trunc-uvata-only':1,'cb-trunc-uvata-poolv2':2,'cb-trunc-uvata-poolv2-owner':3}
 if label in trims:del metas[23+trims[label]:]
 overrides={'cb-sub-uvata':(23,'substitute'),'cb-readonly-uvata':(23,'readonly'),'cb-sub-poolv2':(24,'substitute'),'cb-sub-bbowner':(25,'substitute'),'cb-sub-bbdest':(26,'substitute'),'cb-readonly-poolv2':(24,'readonly'),'cb-readonly-bbdest':(26,'readonly')}
 if label in overrides:
  index,kind=overrides[label];key,sign,writable=metas[index];metas[index]=(Pubkey.from_bytes(bytes([89])*32),sign,writable)if kind=='substitute'else(key,sign,False)
 if spec['unsigned']:metas[1]=(PAYER,False,True)
 raw=base64.b64decode(row['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);assert bytes(tx)==raw and len(tx.signatures)==1,'canonical single-signature wire'
 assert tx.verify_with_results()==[True],'signed transaction validity';assert row['signatures']==[str(tx.signatures[0])]==[row['metadata']['signature']],'exact signature fields'
 msg=tx.message;assert len(msg.instructions)==1,'single declared AMM instruction';ix=msg.instructions[0]
 assert str(msg.account_keys[ix.program_id_index])==str(PROGRAM),'signed AMM program'
 assert bytes(ix.data)==bytes(desc['discriminator'])+struct.pack('<QQ',spec['amount'],spec['limit'])+bytes.fromhex(spec['track']),'signed case amount/limit/track'
 assert len(ix.accounts)==len(metas)and[str(msg.account_keys[i])for i in ix.accounts]==[str(m[0])for m in metas],'signed exact account layout'
 payer=OUTSIDER if spec['unsigned']else PAYER;assert msg.account_keys[0]==payer,'signed actual payer'
 effective={str(payer):(True,True)}
 for key,sign,writable in metas:
  a,b=effective.get(str(key),(False,False));effective[str(key)]=(a or sign,b or writable)
 assert len(msg.account_keys)==len(set(msg.account_keys))==len(effective)and set(map(str,msg.account_keys))==set(effective),'signed exact key membership'
 for index,key in enumerate(msg.account_keys):
  hdr=msg.header;sign=index<hdr.num_required_signatures;writable=index<hdr.num_required_signatures-hdr.num_readonly_signed_accounts if sign else index<len(msg.account_keys)-hdr.num_readonly_unsigned_accounts
  assert(sign,writable)==effective[str(key)],'signed effective privileges'
 executable=set(map(str,[PROGRAM,TOKEN,TOKEN22,FEES,ATA,Pubkey.default()]));watched=({str(m[0])for m in metas}|{str(volume)})-executable
 assert set(before)==set(after)==watched,'exact watched membership/roles'
 paid=before[str(PAYER)]['lamports']-after[str(PAYER)]['lamports'];assert paid==case['expected']['payer']==row['observed']['payer_paid']==row['payer_delta_lamports'],'declared payer debit'
 other=sum((a['lamports']if a else 0)-(before[k]['lamports']if before[k]else 0)for k,a in after.items()if k!=str(PAYER))
 if spec['unsigned']:
  assert str(OUTSIDER)not in watched and paid==other==0,'unsigned watched-user scope'
 else:
  assert paid-other==5000,'watched lamport conservation/transaction fee'
  rents=0
  if row['error']is None:
   for key in [str(volume),str(roles['uvata'])]:
    b,a=before.get(key),after.get(key)
    if b is None and a:
     data=bytes.fromhex(a['data_hex']);rent=(len(data)+128)*6960
     if key==str(volume):assert a['owner']==str(PROGRAM)and a['lamports']==rent,'new volume rent snapshot'
     else:
      assert a['owner']==str(quote_token),'new cashback ATA owner';withheld=u64(data,170)if len(data)==178 else u64(data,174)if len(data)==182 else 0
      assert a['lamports']-u64(data,64)-withheld==rent,'new native cashback ATA rent snapshot'
     rents+=rent
   assert paid==5000+rents,'payer fee and new account rents'
 expected=case['expected'];obs=row['observed']
 if expected['kind']=='ok':
  assert obs['event']==expected['event']and obs['deltas']==expected['deltas'],'pinned expected successful event/deltas'
  assert obs['volume']['earned_after']==expected['earned_after']and obs['volume']['sol_after']==expected['sol_after'],'pinned expected volume values'
  if expected['uvata_lamports']is not None:assert obs['uvata_lamports']==expected['uvata_lamports'],'pinned expected cashback ATA lamports'
  assert all(obs['withheld'].get(k)==v for k,v in expected['withheld'].items()),'pinned expected withheld amounts'
