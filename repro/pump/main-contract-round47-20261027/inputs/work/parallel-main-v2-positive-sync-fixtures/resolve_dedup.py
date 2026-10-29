"""Resolve two retained V2 collisions using bound fixture source; no execution."""
from pathlib import Path
import base64,gzip,hashlib,json,struct
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
result=W/'RESULT01.json.gz';j=json.loads(gzip.decompress(result.read_bytes()))
unknown={x['case']['name']:{'tx':x['original']['transaction_base64'],'before':x['original']['full_before'],'novelty':x['novelty']}for x in j['cases']if x['novelty']['status']=='unknown'}
known=sum(x['novelty']['status']=='distinct'for x in j['cases']);assert known==10 and len(unknown)==2;del j
base=R/'work/parallel-main-integration/round45-captured-additional.json.gz'
j=json.loads(gzip.decompress(base.read_bytes()));old=j['suites']['fee_waiver_27']
assert old['script_sha256']=='b52657498fd9e9b976f6196ad5d64184c7eab60442cc2a1e3659dd6b3713741b'
probe=R/'work/parallel-main-global-fee-waiver/probe-v2.py'
fixture=R/'research/imported-lab/analysis/pump_fun/curve-fresh-trades-v3-signed-surfpool.json'
harness=R/'scripts/pump_sell_v2_differential.py';imports=R/'scripts/pump_trade_fixture.py'
assert sha(probe)==old['script_sha256']
assert sha(harness)=='08d4ff860d64fb7bf65dd6b26e5ec38f8f0030873ce488919fdc3189c7e0a99f'
assert sha(imports)=='9ee647c928070734fe700929b87d4016f76ec244c873e6f484318b5212aea1e1'
f=json.loads(fixture.read_text());curve_key=f['accounts']['curve']
raw=base64.b64decode(f['steps'][4]['before']['curve']['data_base64'])
old_vqr=struct.unpack_from('<Q',raw,16)[0];old_rqr=struct.unpack_from('<Q',raw,32)[0]
ht=harness.read_text()
assert 'data=bytearray(INITIAL[CURVE].data)'in ht
assert "if c.get('token_quote'):data[83:115]=bytes(quote)"in ht
assert "for off,val in c.get('curve_bytes',[]):data[off]=val"in ht
assert "for name,spec in c.get('account_mutations',{}).items():"in ht
assert 'vm.set_account(CURVE,f.Account(INITIAL[CURVE].lamports,bytes(data),P))'in ht
pt=imports.read_text()
assert "s=x['steps'][4]"in pt
assert "for name,r in s['before'].items():"in pt
assert 'base64.b64decode(r[\'data_base64\'])'in pt
proof=[]
for name,new in unknown.items():
 matches=[(i,x)for i,x in enumerate(old['cases'])if x['original']['transaction_base64']==new['tx']and x['mode']=='whitelist_user']
 assert len(matches)==1,(name,len(matches))
 i,x=matches[0];c=x['case']
 assert set(c)<={'name','kind','token_quote','account_mutations'}and c['kind']=='sell_v2'
 assert set(c['account_mutations'])=={'global'}and set(c['account_mutations']['global'])=={'bytes'}
 assert all(451<=off<483 for off,v in c['account_mutations']['global']['bytes'])
 nd=bytes(new['before'][curve_key]['data']);nv=struct.unpack_from('<Q',nd,16)[0];nr=struct.unpack_from('<Q',nd,32)[0]
 assert nv!=old_vqr and nr!=old_rqr
 proof.append({'new_case':name,'baseline_group':'additional/fee_waiver_27','baseline_case_index':i,'baseline_case_name':c['name'],
  'identical_transaction_bytes':True,'old_curve_virtual_quote_prestate':old_vqr,'new_curve_virtual_quote_prestate':nv,
  'old_curve_real_quote_prestate':old_rqr,'new_curve_real_quote_prestate':nr,
  'basis':'The bound unchanged source initializes curve data from the retained step4 fixture. This exact case mutates only Global bytes451..482; its token-quote branch changes only quote_mint bytes83..114. No reserve bytes are changed. The curve prestate therefore differs despite identical signed transaction bytes. Missing executable data is not used as a difference.'})
out={'status':'12 distinct inputs proved; execution result preserved unchanged','raw_result_sha256':sha(result),
 'previously_directly_distinct':known,'conservative_unknowns_resolved':proof,'new_distinct_case_count':known+len(proof),
 'execution_qualifier':'R47 identity candidate only; repeat on final ordered candidate required',
 'input_sha256':{str(p.relative_to(R)):sha(p)for p in[result,base,probe,harness,imports,fixture,Path(__file__)]},'no_new_execution':True}
(W/'DEDUP-ADDENDUM01.json').write_text(json.dumps(out,indent=2)+'\n')
print({'sha256':sha(W/'DEDUP-ADDENDUM01.json'),'resolved':len(proof),'new_distinct_case_count':out['new_distinct_case_count']})
