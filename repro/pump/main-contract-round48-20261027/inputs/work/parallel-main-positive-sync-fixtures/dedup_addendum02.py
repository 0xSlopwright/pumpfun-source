"""Resolve six whitelisted input collisions by a decisive, source-bound curve reserve field."""
from pathlib import Path
import ast,base64,gzip,hashlib,json,struct,subprocess,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'));from paired_receipt_reader import records
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
first=read(W/'DEDUP01.json');assert first['existing_cases']==18111 and first['new_distinct_cases']==0
selected=[t for t in first['targets']if not t['name'].endswith('not_whitelisted')];assert len(selected)==6 and all(not t['exact']and len(t['ambiguous'])==3 for t in selected)
ambiguous={(r['group'],r['row'])for t in selected for r in t['ambiguous']};assert len(ambiguous)==6
archive=R/'repro/pump/main-contract-round44-20261027';manifest=read(archive/'MANIFEST.json')
files=['scripts/pump_v3_configured_fee_differential.py','scripts/pump_trade_fixture.py','work/parallel-main-global-fee-waiver/probe-v3.py','work/parallel-main-v3-fee-waiver/probe-order.py']
bound={}
for n in files:
 p=R/n;archived=archive/'inputs'/n;assert sha(p)==sha(archived)==manifest['inputs/'+n];bound[n]=sha(p)
prior_report=R/'work/parallel-main-integration/round45-captured-additional.json.gz'
with gzip.open(prior_report,'rt')as stream:
 prefix=''
 while '"suites":{'not in prefix:prefix+=stream.read(65536)
head=json.loads(prefix[:prefix.index('"suites":{')]+'"suites":{}}')
for n in [files[0],files[2],files[3]]:assert head['input_sha256'][str(R/n)]==bound[n]
fixture_name='research/imported-lab/analysis/pump_fun/curve-fresh-trades-v3-signed-surfpool.json';published=read(R/'work/parallel-main-round44-publication/PUSHED.json')['commit'];committed=subprocess.check_output(['git','show',published+':'+fixture_name],cwd=R)
fixture=R/fixture_name;assert hashlib.sha256(committed).hexdigest()==sha(fixture)== '54d69dd4f11a61cc6cea3076e3e89fd4aa31ea6ff835f8ea316646a7b1642920'
f=json.loads(committed);captured=base64.b64decode(f['steps'][4]['before']['curve']['data_base64']);curve_key=f['accounts']['curve'];old_rq=struct.unpack_from('<Q',captured,32)[0];assert old_rq==27960 and captured[81]==0
source=(R/files[0]).read_text();tree=ast.parse(source);run=next(n for n in tree.body if isinstance(n,ast.FunctionDef)and n.name=='run');run_source=ast.get_source_segment(source,run)
required=["data=bytearray(initial[curve].data)","struct.pack_into('<QQ',data,8,c['reserve_in'],c['reserve_out'])","struct.pack_into('<Q',data,115,c.get('creator_override',0))","if 'real_base' in c:struct.pack_into('<Q',data,24,c['real_base'])","for offset in c.get('flags',[]):data[offset]=1","if mutation=='complete':data[48]=1","if mutation=='creator_zero':data[49:81]=bytes(32)","vm.set_account(curve,f.Account(initial[curve].lamports,bytes(data),initial[curve].owner))","data[83:115]=bytes(quote)"]
for needle in required:assert needle in run_source,needle
# Enumerate every curve installation in the bound runner. Both start with a copy
# and only write the listed disjoint ranges; real_quote is bytes32..40.
curve_installs=[ast.get_source_segment(source,n)for n in ast.walk(run)if isinstance(n,ast.Call)and isinstance(n.func,ast.Attribute)and n.func.attr=='set_account'and n.args and isinstance(n.args[0],ast.Name)and n.args[0].id=='curve'];assert len(curve_installs)==2
assert "x=json.load(open(R/'"+fixture_name+"'))" in (R/files[1]).read_text()
for n in files[2:]:
 t=(R/n).read_text();a=ast.parse(t);writes=[ast.get_source_segment(t,x)for x in ast.walk(a)if isinstance(x,ast.Assign)and any(isinstance(y,ast.Subscript)and isinstance(y.value,ast.Attribute)and isinstance(y.value.value,ast.Name)and y.value.value.id=='h'and y.value.attr=='initial'for y in x.targets)]
 assert writes and all('h.global_key'in x for x in writes),writes
old_rows={}
for _,where,row in records(prior_report):
 key=('additional',where)
 if key not in ambiguous:continue
 c=row['case'];assert c['operation']=='sell_v3'and not c.get('flags')and not c.get('mutation')in ['complete','creator_zero'];assert 'real_quote_reserves'not in c
 o=row['original'];after=bytes.fromhex(o['accounts'][curve_key]['data_hex']);after_rq=struct.unpack_from('<Q',after,32)[0];after_vq=struct.unpack_from('<Q',after,16)[0]
 reconstructed=after_rq if o['error']is not None else after_rq+c['reserve_out']-after_vq
 assert reconstructed==old_rq,(where,reconstructed)
 old_rows[key]={'group':'additional','row':where,'case':c,'original_error':o['error'],'source_before_real_quote_reserves':old_rq,'source_before_real_quote_bytes':captured[32:40].hex(),'recorded_after_real_quote_reserves':after_rq,'recorded_after_virtual_quote_reserves':after_vq,'arithmetic_crosscheck_reconstructed_before':reconstructed,'frozen_harness':files[2]if where.startswith('v3_waiver/')else files[3]}
assert set(old_rows)==ambiguous
new_report=json.loads(gzip.decompress((W/'RESULT01.json.gz').read_bytes()));new={r['case']['name']:r for r in new_report['cases']};closed=[]
for t in selected:
 n=new[t['name']];before=bytes(n['original']['full_before'][curve_key]['data']);value=struct.unpack_from('<Q',before,32)[0];assert value!=old_rq
 decisive=[{**old_rows[(r['group'],r['row'])],'new_before_real_quote_reserves':value,'new_before_real_quote_bytes':before[32:40].hex(),'reason':'Real quote reserve bytes32..40 differ. Prior frozen runner/wrappers leave these captured bytes unchanged.'}for r in t['ambiguous']]
 closed.append({'name':t['name'],'transaction_sha256':t['transaction_sha256'],'prestate_sha256':t['prestate_sha256'],'resolved_ambiguous_rows':decisive,'new_distinct':True})
out={'status':'six_inputs_proved_distinct; two qualification controls excluded','prior_dedup_sha256':sha(W/'DEDUP01.json'),'new_distinct_cases':6,'admitted_names':[r['name']for r in closed],'excluded_names':[t['name']for t in first['targets']if t not in selected],'closed_rows':closed,'source_checks':required,'curve_installs':curve_installs,'bound_source_sha256':bound,'committed_capture':{'commit':published,'path':fixture_name,'sha256':sha(fixture),'curve_real_quote_offset':32,'curve_real_quote_hex':captured[32:40].hex()},'evidence_sha256':{'prior_report':sha(prior_report),'new_report':sha(W/'RESULT01.json.gz'),'archive_manifest':sha(archive/'MANIFEST.json')},'limits':['No new VM or transaction execution.','Only six whitelisted definitions are admitted. Two non-whitelisted controls retain unresolved partial-prestate collisions and are excluded from the new-case count.','The decisive-field proof does not fabricate a complete prior prestate. It binds frozen input construction and crosschecks the recorded original outcome.']}
(W/'DEDUP-ADDENDUM02.json').write_text(json.dumps(out,indent=2)+'\n');print({'new_distinct_cases':6,'rows':len(closed),'sha256':sha(W/'DEDUP-ADDENDUM02.json')})
if __name__=='__main__':pass
