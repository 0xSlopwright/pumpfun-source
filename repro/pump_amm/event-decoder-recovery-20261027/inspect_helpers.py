"""Compare fee helper bodies without relaxing the retained ELF normalization."""
from pathlib import Path
import argparse,hashlib,importlib.util,json
ROOT=Path(__file__).resolve().parents[3]
s=importlib.util.spec_from_file_location('elf',ROOT/'repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py');elf=importlib.util.module_from_spec(s);s.loader.exec_module(elf)
SPECS=[('buy-result',0x50598,1808,'20calculate_buy_result17'),('buy-preview',0x565e8,296,'19preview_total_quote17'),('decode-transfer-fee',0x74128,1312,'9from_mint17'),('forward-fee',0x74648,696,'13calculate_fee17'),('post-fee',0x74900,640,'16amount_after_fee17'),('pre-fee',0x74b80,688,'17amount_before_fee17'),('supported-mint',0x73ef0,568,'14supported_mint17'),('mint-data-policy',0xf28b8,1192,'19supported_mint_data17'),('mint-to-pool',0x73118,1928,'mint_to_pool17'),('pool-transfer',0x72128,888,'transfer_from_pool17'),('raw-pool-transfer',0x716b8,2672,'transfer_from_pool_to_raw17'),('raw-user-transfer',0x70280,2272,'transfer_checked_to_account_info17'),('accrue-fees',0x6c768,2496,'11accrue_fees17'),('wide-division',0xd5848,4440,'4U1287div_mod17'),('integer-sqrt',0xd69a0,1704,'4U12812integer_sqrt17'),('initial-liquidity',0x2e468,696,'6create17initial_liquidity17'),('typed-transfer',0x727b8,2400,'5token16transfer_checked17'),('self-transfer',0x6f608,656,'5token22validate_self_transfer17'),('apply',0x14700,544,'4fees5apply17'),('wrapper',0x4fba0,888,'5trade4fees17'),('fee',0x13190,712,'4fees3fee17'),('tier',0x13d30,856,'4fees4tier17'),('local-selector',0x14088,1656,'4fees19select_and_apply_v217'),('market-cap',0x6b780,744,'4math10market_cap17'),('legacy-selector',0x13458,2264,'4fees16select_and_apply17'),('fee-cpi',0xdade8,3200,'3cpi24get_fees_with_quote_mint17')]
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def inspect(candidate,symbols):
 o=elf.Elf(ROOT/'evidence/original/pump_amm/deployed.so');c=elf.Elf(Path(candidate));s=elf.Elf(Path(symbols));assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi];rows=[]
 for name,start,size,needle in SPECS:
  candidates=[]
  for f in s.funcs:
   if needle not in f['name']:continue
   at,n=f['start'],f['size'];same=size==n;diff=[i for i in range(0,size,8)if o.normalized[start+i:start+i+8]!=c.normalized[at+i:at+i+8]]if same else None
   candidates.append({'function':f,'normalized_exact':same and not diff and o.pattern(start,size)==c.pattern(at,size),'raw_exact':same and o.b[start:start+size]==c.b[at:at+size],'different_instruction_offsets':diff,'actual_candidate_callers':[a for a,t in c.calls.items()if t==at]})
  rows.append({'helper':name,'original_start':start,'original_size':size,'original_callers':[a for a,t in o.calls.items()if t==start],'candidates':candidates})
 return {'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'candidate_sha256':sha(candidate),'symbols_sha256':sha(symbols),'rows':rows,'scope':'Complete helper bodies under unchanged normalization. Different-sized functions are not treated as matches. A matching caller does not prove its callees or data.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();r=inspect(a.candidate,a.symbols);a.output.write_text(json.dumps(r,indent=2)+'\n');print([(x['helper'],[(c['function']['size'],c['normalized_exact'])for c in x['candidates']])for x in r['rows']])
