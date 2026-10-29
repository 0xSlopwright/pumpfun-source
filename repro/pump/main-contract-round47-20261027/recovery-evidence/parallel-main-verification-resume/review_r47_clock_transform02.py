"""Independent exact Clock transform audit on hash-bound completed suite outputs."""
from pathlib import Path
import base64
import gzip
import hashlib
import json
import struct
from solders.transaction import VersionedTransaction

R=Path(__file__).resolve().parents[2]
W=R/'work/parallel-main-r47-acceptance'
O=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
read=lambda p:json.loads(p.read_text())
load=lambda p:json.loads(gzip.decompress(p.read_bytes()))
state_path=R/'work/parallel-main-integration/round47-unified/state.json'
state=read(state_path)
assert state['status']=='passed'
original=R/'evidence/original/pump/deployed.so'
candidate=R/'work/parallel-main-integration/build-round47/candidate.so'
assert state['candidate_sha256']==sha(candidate)
pd=R/'evidence/original/pump/programdata-account.bin'
capture=read(R/'evidence/original/pump/capture.json')
assert sha(pd)==capture['programdata_sha256']
header=pd.read_bytes()[:45]
slot=struct.unpack_from('<Q',header,4)[0]
assert slot==458921440
groups=[('sell_v3_positive_sync','parallel-main-positive-sync-fixtures',6),('v3_buy_positive_sync','parallel-main-v3-buy-positive-sync-fixtures',8),('sell_v3_nonwhite_sync_controls','parallel-main-positive-sync-nonwhite-controls',2),('v2_positive_sync','parallel-main-v2-positive-sync-fixtures',12),('legacy_positive_sync','parallel-main-legacy-positive-sync-fixtures',6)]
reviewed=[];files=[state_path,pd,original,candidate]
for suite,folder,count in groups:
    golden_path=R/'work'/folder/'RESULT01.json.gz';golden=load(golden_path)['cases']
    if suite=='sell_v3_positive_sync':
        allowed=set(read(golden_path.parent/'DEDUP-ADDENDUM02.json')['admitted_names'])
        golden=[r for r in golden if r['case']['name']in allowed]
    saved=state['completed']['additional.'+suite]
    current_path=Path(saved['output']);loader_path=Path(saved['loader'])
    assert sha(current_path)==saved['result_sha256'] and sha(loader_path)==saved['loader_sha256']
    current=load(current_path)
    assert current['candidate_sha256']==sha(candidate) and not current['mismatches']
    assert len(golden)==len(current['cases'])==count
    files.extend([golden_path,current_path,loader_path])
    for a,b in zip(golden,current['cases']):
        old,new,peer=a['original'],b['original'],b['candidate']
        assert a['case']==b['case']
        assert old['clock']['slot']==0
        expected=old['clock']|{'slot':slot+1}
        assert new['clock']==peer['clock']==expected
        assert new['transaction_base64']==peer['transaction_base64']==old['transaction_base64']
        assert all(VersionedTransaction.from_bytes(base64.b64decode(new['transaction_base64'])).verify_with_results())
        fields=[k for k in ['full_before','accounts','inner_instructions','event_payloads','inner','events','return_data']if k in old]
        for k in fields:
            assert old[k]==new[k]==peer[k],(suite,a['case']['name'],k)
        assert old['error'] is None and new['error'] is None and peer['error'] is None
        reviewed.append({'suite':suite,'name':a['case']['name'],'slot_before':0,'slot_after':slot+1,'all_other_clock_fields_exact':True,'qualified_original_fields_exact':fields,'paired_fields_exact':True})
    receipt=read(loader_path)
    for p,digest in receipt['input_sha256'].items():assert sha(Path(p))==digest
    for item in receipt['loads']:
        raw=Path(item['input_path']).read_bytes()
        assert hashlib.sha256(raw).hexdigest()==item['elf_sha256']
        image=header+raw+bytes(len(pd.read_bytes())-45-len(raw))
        assert hashlib.sha256(image).hexdigest()==item['programdata_sha256']
        assert item['slot']==slot+1 and item['elf_prefix_unchanged'] and item['zero_allocation_tail']
assert len(reviewed)==34
proof_path=W/'CLOCK-TRANSFORM02.json';addendum_path=W/'ACCEPTANCE-ADDENDUM02.json'
assert read(proof_path)['status']=='all34_exact_captured_loader_slot_transitions_verified'
assert read(addendum_path)['status']=='passed_with_explicit_captured_loader_slot_binding'
assert len(read(proof_path)['rows'])==34
for p,digest in read(proof_path)['input_sha256'].items():assert sha(R/p)==digest
files.extend([proof_path,addendum_path,W/'clock_transform_addendum02.py'])
out=O/'R47-CLOCK-TRANSFORM-REVIEW02.json'
result={'status':'passed_independent_exact_clock_transform_review','cases':34,'actual_completed_suites':5,'deployment_slot':slot,'runtime_slot':slot+1,'rows':reviewed,'input_sha256':{str(p.relative_to(R)):sha(p)for p in files},'limits':['Read-only review of hash-bound completed suite outputs; no new VM or build.','No unrestricted Clock normalization: only the captured deployment slot+1 transformation is admitted.','The raw original-receipt equality claim remains false and its failed audit is preserved.']}
out.write_text(json.dumps(result,indent=2)+'\n')
print({'status':result['status'],'sha256':sha(out),'cases':34})
