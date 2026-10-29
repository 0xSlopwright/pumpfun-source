from pathlib import Path
import base64,gzip,hashlib,json,re,sys
from solders.transaction import Transaction
R=Path('/mnt/c/Users/ahi20/Documents/ChatGPT/pumpfun-source')
L=Path('/home/ahi200/pumpfun-work/20261029-pump-legacy-exact-sol')
out=L/'costs-direct-gross/runtime'; target=out/'independent-audit.json'
assert not target.exists(),'Refuse audit overwrite'
sha=lambda b:hashlib.sha256(b).hexdigest()
doc=lambda p:json.loads(gzip.decompress(p.read_bytes()) if p.suffix=='.gz' else p.read_bytes())
run=doc(out/'execution.json'); six=doc(out/'costs-six.json.gz'); twenty=doc(out/'costs20.json.gz'); receipt=doc(out/'costs20-loader.json')
paths=dict(original=R/'evidence/original/pump/deployed.so',parent=L/'costs-parent/candidate.so',candidate=L/'costs-direct-gross/candidate.so')
raw={k:p.read_bytes() for k,p in paths.items()}; hashes={k:sha(b) for k,b in raw.items()}
problems=[]
def require(ok,label):
    if not ok: problems.append(label)
require([r['returncode'] for r in run['results']]==[0,0],'Both actual producers returned0')
require(all(run['inputs_unchanged'].values()),'Every runtime input unchanged')
for n,record in run['inputs'].items():require(sha(Path(n).read_bytes())==record['sha256'],'actual input '+n)
require(len(six['cases'])==6 and len(twenty['cases'])==20,'Exactly26 cases')
require(six['binary_sha256']==dict(original=hashes['original'],parent=hashes['parent'],proposal=hashes['candidate']),'Six report image identities')
for key,label in [('original_sha256','original'),('control_sha256','parent'),('candidate_sha256','candidate')]:require(twenty[key]==hashes[label],'Twenty report '+label+' identity')
compute=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
clean=lambda r:[s for s in r['logs'] if not compute.fullmatch(s)]
fields=['error','accounts','inner_instructions','event_payloads','return_data']
results=[]; signatures=0; txset=set(); loads=[]
for family,records in [('six',six['cases']),('twenty',twenty['cases'])]:
    for i,row in enumerate(records):
        runs=({'original':row['runs']['original'],'parent':row['runs']['parent'],'candidate':row['runs']['proposal']} if family=='six' else {'original':row['original'],'parent':row['control'],'candidate':row['candidate']})
        base=runs['original']; wire=base['transaction_base64']; row_diffs={}
        for label,r in runs.items():
            tx=Transaction.from_bytes(base64.b64decode(r['transaction_base64']))
            checks=tx.verify_with_results(); require(all(checks) and len(checks)==len(tx.signatures),f'{family}/{i}/{label} verified signatures')
            signatures+=len(tx.signatures); txset.add(bytes(tx))
            require(r['signature_verified'] is True,f'{family}/{i}/{label} retained signature flag')
            require(r['transaction_base64']==wire,f'{family}/{i}/{label} same signed wire')
            semantic=[f for f in fields if r[f]!=base[f]]; log_equal=clean(r)==clean(base)
            row_diffs[label]=dict(semantic_differences=semantic,ordered_logs_equal=log_equal)
            require(not semantic and log_equal,f'{family}/{i}/{label} exact observations and ordered logs')
        if family=='six':
            obs=row['observations']
            for label,canonical in [('original','original'),('parent','parent'),('proposal','candidate')]:
                require(obs[label]['transaction_base64']==runs[canonical]['transaction_base64'],f'six/{i}/{label} observed wire')
                require(obs[label]['before']==obs['original']['before'],f'six/{i}/{label} exact prestate')
                require(obs[label]['after']==obs['original']['after'],f'six/{i}/{label} exact poststate')
                require(len(obs[label]['loaded_programs'])==1,f'six/{i}/{label} one actual Pump load')
                for load in obs[label]['loaded_programs']:loads.append((f'six/{i}/{label}',load,canonical))
        results.append(dict(family=family,index=i,name=row['case'].get('label',row['case'].get('name')),differences=row_diffs,error=base['error']))
require(not twenty['candidate_semantic_mismatches'] and not twenty['candidate_log_mismatches'],'Twenty producer reports zero candidate mismatches')
for i,row in enumerate(twenty['cases']):require(row['control_semantic_equal'] and row['control_ordered_logs_equal_except_compute'],f'twenty/{i} control report parity')
expected=['original']+['original','candidate','parent']*20
require(len(receipt['loads'])==len(expected),'Twenty loader init plus60 execution loads')
for i,(load,label) in enumerate(zip(receipt['loads'],expected)):loads.append((f'twenty/{i}',load,label))
for n,h in receipt['input_sha256'].items():require(sha(Path(n).read_bytes())==h,'Actual loader receipt source '+n)
cap=doc(R/'evidence/original/pump/capture.json'); pd=(R/'evidence/original/pump/programdata-account.bin').read_bytes(); program=(R/'evidence/original/pump/program-account.bin').read_bytes(); header=pd[:45]
require(sha(pd)==cap['programdata_sha256'] and sha(pd[45:])==cap['payload_sha256'],'Authenticated original captured allocation')
alloc={label:header+b+bytes(cap['payload_bytes']-len(b)) for label,b in raw.items()}
for name,l,label in loads:
    require(l['elf_sha256']==hashes[label] and l['elf_bytes']==len(raw[label]),name+' actual image')
    require(l['program_owner']==cap['owner'] and l['program_sha256']==sha(program),name+' captured program owner/bytes')
    require(l['programdata_sha256']==sha(alloc[label]) and l['programdata_bytes']==len(alloc[label]),name+' exact allocated ProgramData')
    require(l['header_sha256']==sha(header) and l['elf_prefix_unchanged'] is True and l['zero_allocation_tail'] is True,name+' header/prefix/zero tail')
report=dict(passed=not problems,scope='Independent stored-output audit; no VM or compilation',auditor_sha256=sha(Path(__file__).read_bytes()),case_count=len(results),executions=len(results)*3,verified_signature_fields=signatures,unique_signed_wires=len(txset),actual_loader_records=len(loads),execution_loader_records=78,additional_fixture_initialization_loads=1,binary_sha256=hashes,all_inputs_unchanged=all(run['inputs_unchanged'].values()),semantic_and_ordered_log_differences=[r for r in results if any(v['semantic_differences'] or not v['ordered_logs_equal'] for v in r['differences'].values())],cases=results,problems=problems,input_report_sha256={p.name:sha(p.read_bytes()) for p in [out/'execution.json',out/'costs-six.json.gz',out/'costs20.json.gz',out/'costs20-loader.json']})
target.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['cases']},indent=2))
assert not problems, problems
