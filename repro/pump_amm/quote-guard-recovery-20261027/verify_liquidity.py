#!/usr/bin/env python3
"""Verify saved signed liquidity probes and the three actual Pubkey descriptors."""
from pathlib import Path
import base64,gzip,hashlib,importlib.util,json,re,struct,sys
from solders.transaction import Transaction
CANDIDATE='be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6'
BASE='5cd7879af0d9733d1f7d3847be46aa4c5ff214fca2250d1c69d03c49cbc85d1a'
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
READER='247700e9930d5e53daf93a50888ae1e5429f74ccb19155e7a205f72ee21d5883'
EXPECTED_CASES={'deposit-44':44,'burn':18,'withdraw-order':18,'payout':336,'sweep':254,'liquidity':680}
PRODUCERS={'deposit-44': 'c52b6aae290ed9c91493f3c71693f876e8cc0e98dcb1f778d6bb7c8d0ca17fb6', 'burn': 'fd5de1447dc6861a9ad787350d5cb791eed0c6492889a89ef484a034c368656c', 'withdraw-order': 'd359bb09682bf3cb7d494ef34300de87d387dae36afbaa4f7f9355cd07fe91a5', 'payout': '842251f64e4db1f5739e15677d8c8df116a2f4442e0c1a100035db52cfae12de', 'sweep': '0408acf3c108289bcfd00b6fff7bea464584eb480a8aca524e5762e660397d1c', 'liquidity': '08449c9da8c560330eeb5b560a26cdd553d260084e78bd54d4dc7edb914320b4'}
OBSERVER='b89e749534c2c4798d8c772fa6e77f0f0e711cc43202c942a3de3627d2d5027a'
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 p=Path(p)
 if not p.exists()and p.suffix=='.json':p=p.with_suffix('.json.gz')
 b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def logs(v):
 return[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',re.sub(r'(?<=panicked at )[^ ]+:[0-9]+:[0-9]+','<source>',s))for s in v if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',s)]
def clean(v):
 if isinstance(v,dict):return{k:logs(x)if k=='logs'else clean(x)for k,x in v.items()}
 if isinstance(v,list):return[clean(x)for x in v]
 return v
def verify(d,candidate,symbols,repo_root=None):
 d,candidate,symbols=map(Path,[d,candidate,symbols]);assert H(candidate)==CANDIDATE
 root=Path(repo_root)if repo_root else next(p for p in [d,*d.resolve().parents]if(p/'evidence/original/pump_amm/deployed.so').is_file())
 original=root/'evidence/original/pump_amm/deployed.so';assert H(original)==ORIGINAL
 probes=d/'liquidity-probes'if(d/'liquidity-probes').is_dir()else d/'focused'
 integration=d/'new-integration'if(d/'new-integration').is_dir()else d
 comp=load(integration/'comparison.json');assert comp['baseline']['candidate_sha256']==BASE and comp['candidate']['candidate_sha256']==CANDIDATE
 cases=transactions=signatures=0
 for name,count in EXPECTED_CASES.items():
  report=load(probes/(name+'.json'));observed=load(probes/(name+'-transactions.json.gz'));rows=report['cases'];seq=observed['transactions'];assert report['case_count']==len(rows)==count and len(seq)==2*count
  assert report['candidate_sha256']==CANDIDATE and report['original_sha256']==ORIGINAL
  assert observed['observer_sha256']==OBSERVER and observed['script_sha256']==PRODUCERS[name]
  field={'deposit-44':'probe_sha256','burn':'probe_sha256','withdraw-order':'probe_sha256','payout':'producer_sha256','sweep':'full_diagnostic_adapter_sha256','liquidity':'script_sha256'}[name]
  assert report[field]==PRODUCERS[name]
  if name=='sweep':assert report['script_sha256']==report['original_suite_sha256']=='53ff7747ca26c2e4013c5a98e9127a5c5fb25c5ab61b4d7dc1bd1466ad07bc8c'
  for i,row in enumerate(rows):
   assert clean(row['original'])==clean(row['candidate']),(name,i)
   if 'original_receipt'in row:
    assert row['original_receipt']['before']==row['candidate_receipt']['before']and row['original_receipt']['after']==row['candidate_receipt']['after']
   pair=seq[2*i:2*i+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64']
   for txr,side,want in zip(pair,['original','candidate'],[ORIGINAL,CANDIDATE]):
    raw=base64.b64decode(txr['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and txr['all_signatures_verified'];assert len(checks)==txr['signature_count'];signatures+=len(checks)
    assert hashlib.sha256(raw).hexdigest()==txr['transaction_sha256']and txr['amm_program_sha256']==want
    assert hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()==txr['logs_sha256']
   cases+=1;transactions+=2
 reader=root/'repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py';assert H(reader)==READER
 spec=importlib.util.spec_from_file_location('checkpoint_elf',reader);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);o=m.Elf(original);c=m.Elf(symbols);s=m.Elf(candidate)
 assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]and c.pattern(c.lo,c.hi-c.lo)==s.pattern(s.lo,s.hi-s.lo)
 def wide(e,p):return struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32
 def location(e,p):
  assert e.relocations[p]=={'type':8,'symbol':''};ptr=struct.unpack_from('<Q',e.b,p)[0]>>32;ln,line,col=struct.unpack_from('<QII',e.b,p+8);return{'filename':e.b[ptr:ptr+ln].decode(),'filename_bytes':ln,'line':line,'column':col}
 desc=[]
 for start,refs,name in [(0x10e068,[0x10e130],'20find_program_address17'),(0x10e380,[0x10e688,0x10e958],'15write_as_base5817')]:
  end=o.entries[o.entries.index(start)+1];f=next(f for f in c.funcs if name in f['name']);assert f['size']==end-start and o.normalized[start:end]==c.normalized[f['start']:f['start']+f['size']]and o.pattern(start,end-start)==c.pattern(f['start'],f['size'])
  for ref in refs:
   at=f['start']+ref-start;assert o.relocations[ref]==c.relocations[at]=={'type':8,'symbol':''};a,b=location(o,wide(o,ref)),location(c,wide(c,at));assert a==b;desc.append(a)
 assert desc==[{'filename':'src/lib.rs','filename_bytes':10,'line':612,'column':32},{'filename':'src/lib.rs','filename_bytes':10,'line':817,'column':49},{'filename':'src/lib.rs','filename_bytes':10,'line':818,'column':41}]
 assert cases==1350 and transactions==signatures==2700
 return{'passed':True,'candidate_sha256':CANDIDATE,'base_candidate_sha256':BASE,'cases':cases,'transactions':transactions,'verified_signatures':signatures,'full_log_pairs':cases,'identical_signed_message_pairs':cases,'pubkey_descriptors':desc,'executes_runtime':False}
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--bundle',type=Path,default=Path(__file__).resolve().parent);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);p.add_argument('--repo-root',type=Path);a=p.parse_args();print(json.dumps(verify(a.bundle,a.candidate or a.bundle/'build/artifacts/pump_amm_recovered.so',a.symbols or a.bundle/'build/artifacts/unstripped.so',a.repo_root),indent=2))
