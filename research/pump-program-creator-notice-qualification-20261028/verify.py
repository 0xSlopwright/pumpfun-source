#!/usr/bin/env python3
"""Verify the current-C0 program-creator notice successor; execute no compiler or VM."""
if not __debug__: raise SystemExit('Optimized Python is unsupported; run without -O.')
from pathlib import Path
import argparse, base64, difflib, gzip, hashlib, io, json, re, struct, subprocess, sys, tarfile
sys.dont_write_bytecode = True
P = Path(__file__).resolve().parent
R = P.parents[1]
sys.path.insert(0, str(P / 'tools'))
import census
census.ROOT = R
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
sha = lambda b: hashlib.sha256(b).hexdigest()
def need(value, why):
    if not value: raise ValueError(why)
def doc(path):
    b = path.read_bytes()
    return json.loads(gzip.decompress(b) if b[:2] == b'\x1f\x8b' else b)
def archive(path):
    result = {}
    with tarfile.open(path, 'r:gz') as t:
        for member in t:
            name = Path(member.name)
            need(member.isfile() and not name.is_absolute() and '..' not in name.parts and member.name not in result, 'unsafe/duplicate archive input')
            result[member.name] = t.extractfile(member).read()
    return result
def stage(source):
    out = {'programs/pump/'+k:v for k,v in source.items() if k not in ('Cargo.toml','Cargo.lock')}
    text = source['Cargo.toml'].decode(); a = text.index('[profile.release]'); b = text.index('[workspace]')
    out['programs/pump/Cargo.toml'] = (text[:a].rstrip()+'\n').encode()
    out['Cargo.toml'] = ('[workspace]\nmembers = ["programs/pump"]\nresolver = "2"\n\n'+text[a:b].strip()+'\n').encode()
    out['Cargo.lock'] = source['Cargo.lock']
    return out
def logical(pins, expected):
    result = {}
    for key, value in pins.items():
        matches = [name for name in expected if key == name or key.endswith('/'+name)]
        need(matches, 'unrecognized compiler input '+key); name = max(matches, key=len)
        need(name not in result, 'duplicate compiler input'); result[name] = value
    need(result == expected, 'actual compiler input hashes differ')

LOADER_EXPECTED={}
def check_loader(load, blobs):
    digest=load['elf_sha256']; need(digest in blobs, 'unknown loaded image')
    if digest not in LOADER_EXPECTED:
        capture=doc(R/'evidence/original/pump/capture.json')
        program=(R/'evidence/original/pump/program-account.bin').read_bytes()
        pd=(R/'evidence/original/pump/programdata-account.bin').read_bytes()
        need(sha(program)==capture['program_sha256'] and sha(pd)==capture['programdata_sha256'], 'genuine captured loader bytes')
        raw=blobs[digest]; need(sha(raw)==digest, 'image digest')
        expected=dict(elf_sha256=digest,elf_bytes=len(raw),program_owner=capture['owner'],program_bytes=36,
            program_sha256=sha(program),programdata_bytes=len(pd),programdata_sha256=sha(pd[:45]+raw+bytes(capture['payload_bytes']-len(raw))),
            header_sha256=sha(pd[:45]),elf_prefix_unchanged=True,zero_allocation_tail=True)
        LOADER_EXPECTED[digest]=expected,struct.unpack_from('<Q',pd,4)[0]
    expected,slot=LOADER_EXPECTED[digest]
    need(all(load.get(k)==v for k,v in expected.items()) and load['slot']>slot, 'literal captured allocation/image derivation')

def source_and_builds(selected=None):
    if selected is not None: selected=Path(selected).resolve()
    expected = doc(P/'build-inputs.json')
    source = {f.relative_to(P/'source').as_posix():f.read_bytes() for f in (P/'source').rglob('*') if f.is_file()}
    source_hashes = {k:sha(v) for k,v in source.items()}
    need(len(source)==65 and source_hashes==doc(P/'SOURCE65.json')==expected['source_inputs'], 'frozen source65')
    parent = R/expected['qualified_parent']['path']
    need(sha((parent/'MANIFEST.json').read_bytes())==expected['qualified_parent']['manifest_sha256'], 'qualified parent seal')
    parent_source = {f.relative_to(parent/'source').as_posix():f.read_bytes() for f in (parent/'source').rglob('*') if f.is_file()}
    need(set(source)==set(parent_source), 'parent input set')
    changed = [k for k in source if source[k]!=parent_source[k]]
    need(changed==['src/creator/admin_cto.rs'], 'sole current-C0 program-creator notice source correction')
    f = changed[0]
    patch = ''.join(difflib.unified_diff(parent_source[f].decode().splitlines(True),source[f].decode().splitlines(True),fromfile='selected/'+f,tofile='notice/'+f))
    need(patch==(P/'source.patch').read_text(), 'exact source delta')
    def sites(raw):
        pattern=rb'\b(error|err|require(?:_[a-z_]+)?|panic|unreachable|todo)!\s*\(|\b(unwrap|expect)\s*\('
        return [(raw[:m.start()].count(b'\n')+1,m.start()-raw.rfind(b'\n',0,m.start()),(m.group(1) or m.group(2)).decode()) for m in re.finditer(pattern,raw)]
    need(sites(parent_source[f])==sites(source[f]) and len(sites(source[f]))==17, 'unchanged17 explicit error/require/panic token coordinates')
    need(source_hashes['src/multi_hop_curve_swap.rs']=='734bdae1189dd4e4f54a27fd215624611228f36b92d3877b63f00df19ccc9e44', 'retained current accrual source; no Clock/F4 overlay')
    if selected:
        actual = source_manifest(selected,selected,R,cwd=selected)
        need({str((R/n).relative_to(selected)):h for n,h in actual.items()}==source_hashes, 'current selected compiler inputs')
    staged = stage(source); staged_hashes = {k:sha(v) for k,v in staged.items()}; need(len(staged)==66, 'stage66')
    image_hash = expected['comparison']['candidate_sha256']; symbol_hash = expected['unstripped_sha256']
    for label in ('primary','cold-01'):
        d = P/'builds'/label; b = doc(d/'build-comparison.json')
        need(b==doc(d/'build-attempt.json'), 'actual attempt/result consistency')
        need(b['returncode']==0 and b['source_unchanged'] and b['tools_unchanged'] and b['target_libraries_unchanged'], 'successful immutable build')
        need(b['tool_sha256']==expected['tool_sha256'] and b['target_libraries_sha256']==expected['target_libraries_sha256'] and b['source_wrapper_sha256']==expected['source_wrapper_sha256'], 'unchanged measured compiler/library cohort')
        need(sha((d/'executed-builder.py').read_bytes())==b['builder_sha256'], 'executed builder bytes')
        need(sha((d/'build.log').read_bytes())==b['build_log_sha256'], 'compiler log digest')
        need(b['comparison']['candidate_sha256']==image_hash==sha((d/'candidate.so').read_bytes()), 'literal compiled image')
        need(b['unstripped_sha256']==symbol_hash==sha((d/'unstripped.so').read_bytes()), 'literal compiled symbols')
        logical(b['primary_source_sha256'],source_hashes); logical(b['primary_source_after_sha256'],source_hashes)
        logical(b['source_sha256'],staged_hashes); logical(b['source_after_sha256'],staged_hashes)
        compiled = archive(d/'compiled-workspace.tar.gz')
        need(compiled==staged and {k:sha(v) for k,v in compiled.items()}==doc(d/'compiled-workspace-sha256.json'), 'retained actual compiled archive/source transform')
        if label=='primary':
            need(sha((d/'build-comparison.json').read_bytes())==expected['actual_new_warm_build_receipt_sha256'], 'actual unmodified probe receipt')
            need(all(b['fresh_local_compilations'].values()) and b['reused_external_artifacts_unchanged'] and not b['stack_warnings'] and b['executed_python_sources_unchanged'], 'fresh local crates/unchanged dependency cache')
            for n, row in b['executed_python_sources'].items(): need(sha((d/'executed-tools'/n).read_bytes())==row['sha256'], 'actual executed warm tool')
        else:
            need(b['cold_empty_target'] and b['target_existed_before'] is False and b['qualified_image_hashes_equal'] and b['registry_sources_unchanged'] and b['sdk_rust_libraries_unchanged'], 'genuine cold build')
            need(b['builder_sha256']==sha((P/'build.py').read_bytes()), 'portable executed builder')
            registry = (d/'registry-authentication.json').read_bytes()
            need(sha(registry)==b['registry_authentication_sha256'] and len(json.loads(registry)['locked_registry_archives'])==254, 'authenticated dependency archives')
            need(b['target_library_profile']['native_host_files_unchanged'] and b['target_library_profile']['status']=='verified', 'actual target-library profile completion')
    image = (P/'artifacts/candidate.so').read_bytes(); symbols = (P/'artifacts/unstripped.so').read_bytes()
    need(sha(image)==image_hash and sha(symbols)==symbol_hash, 'public artifact equality')
    secs = [sections(x) for x in (image,symbols)]
    for n in ('.text','.rodata','.data.rel.ro','.rel.dyn','.dynsym','.dynstr'):
        a,b=secs[0][n],secs[1][n]
        need((a['addr'],a['size'])==(b['addr'],b['size']) and image[a['offset']:a['offset']+a['size']]==symbols[b['offset']:b['offset']+b['size']], 'measured/tested section equality')
    fresh = census.census(P/'artifacts/unstripped.so'); old = census.census(parent/'artifacts/unstripped.so')
    need(fresh['counts']['normalized']==1019 and fresh['counts']['raw']==188 and len(fresh['windows'])==1035, 'complete window census')
    for a,b in zip(old['windows'],fresh['windows']):
        need((a['start'],bool(a['normalized_matches']),a['raw_match'])==(b['start'],bool(b['normalized_matches']),b['raw_match']), 'complete membership preservation')
    return image_hash, b

def verify_full44(candidate):
    from solders.transaction import VersionedTransaction
    full = doc(P/'runtime/full44.json.gz'); b = doc(P/'builds/primary/build-comparison.json')
    need(full['candidate_sha256']==candidate and full['compiled_source_sha256']==b['source_sha256'], 'actual replay compiler-prefix/source binding')
    original = sha((R/'evidence/original/pump/deployed.so').read_bytes())
    need(full['original_sha256']==original and full['case_count']==10468 and len(full['suites'])==44 and not full['mismatches'], 'full44 complete')
    cu = re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
    clean = lambda xs:[s for s in xs if not cu.fullmatch(s)]
    counts = dict(pairs=0,transaction_fields=0,signature_fields=0)
    def walk(v):
        if isinstance(v,dict):
            if isinstance(v.get('original'),dict) and isinstance(v.get('candidate'),dict):
                left,right=v['original'],v['candidate']; need(left.keys()==right.keys(), 'paired fields'); counts['pairs']+=1
                for key in left:
                    if key=='logs': need(clean(left[key])==clean(right[key]), 'strict original Source/log order')
                    elif key=='metadata':
                        need(left[key].keys()==right[key].keys(), 'metadata fields')
                        for name in left[key]:
                            if name=='logs': need(clean(left[key][name])==clean(right[key][name]), 'strict metadata logs')
                            elif name=='compute_units_consumed': need(type(left[key][name])==type(right[key][name])==int, 'compute meter types')
                            else: need(left[key][name]==right[key][name], 'raw metadata '+name)
                    elif key=='program_sha256':
                        a,c=left[key],right[key]; pid='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
                        need(a.keys()==c.keys() and [k for k in a if a[k]!=c[k]]==[pid] and a[pid]==original and c[pid]==candidate, 'program image map')
                    else: need(left[key]==right[key], 'raw paired '+key)
            if isinstance(v.get('transaction_base64'),str):
                raw=base64.b64decode(v['transaction_base64'],validate=True); tx=VersionedTransaction.from_bytes(raw)
                need(bytes(tx)==raw and all(tx.verify_with_results()), 'actual corpus signatures'); counts['transaction_fields']+=1; counts['signature_fields']+=len(tx.signatures)
            for item in v.values(): walk(item)
        elif isinstance(v,list):
            for item in v: walk(item)
    walk(full['suites']); need(counts==dict(pairs=10468,transaction_fields=18343,signature_fields=27875), 'full signature/field totals')
    prefix=doc(P/'runtime/actual-loader-prefix-map.json'); need(set(prefix)=={row['path'] for row in full['loader_receipts'].values()}, 'retained actual loader prefix set')
    for row in full['loader_receipts'].values():
        item=prefix[row['path']]; raw=(P/item['retained']).read_bytes(); need(sha(raw)==row['sha256']==item['sha256'], 'actual immutable loader receipt')
        loads=json.loads(raw)['loads']; need(len(loads)==row['load_count'] and {x['elf_sha256'] for x in loads}=={original,candidate}, 'actual loader images')
        need(all(x['elf_prefix_unchanged'] and x['zero_allocation_tail'] and x['program_bytes']==36 and x['programdata_bytes']==10485760 for x in loads), 'actual loader allocation')
        blobs={original:(R/'evidence/original/pump/deployed.so').read_bytes(),candidate:(P/'artifacts/candidate.so').read_bytes()}
        for load in loads: check_loader(load,blobs)
    return counts

def captured_create(candidate):
    from solders.transaction import VersionedTransaction
    d=P/'runtime/captured-create-supplement'; execution=doc(d/'execution.json'); x=doc(d/'cases.json.gz'); inputs=doc(P/'inputs.json')
    need(execution['returncode']==0 and execution['candidate_sha256']==candidate and execution['controller_sha256']==sha((P/'replay_captured_create.py').read_bytes()), 'fresh captured create execution')
    need(execution['report_sha256']==sha((d/'cases.json.gz').read_bytes()) and execution['loader_sha256']==sha((d/'loader.json').read_bytes()), 'actual captured create outputs')
    for name in ('producer','wrapper','actual_build_receipt','source_frozen'):
        need(sha((R/inputs[name]).read_bytes())==inputs[name+'_sha256'], 'captured replay input '+name)
    need(x['runner_sha256']==inputs['producer_sha256'] and x['build_receipt_sha256']==inputs['actual_build_receipt_sha256'] and x['source_coordinate_normalization'] is None, 'captured actual source/build binding')
    need(len(x['cases'])==14 and {r['family'] for r in x['cases']}=={'616','651'}, 'captured fixture set')
    compute=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
    program=lambda run:[s for s in run['logs'] if not compute.fullmatch(s)]
    txs=sigs=0
    for row in x['cases']:
        runs=row['results']; a,b=runs['original'],runs['candidate']
        need(set(runs)=={'original','canonical','candidate'} and program(a)==program(b), 'captured strict Source messages')
        for k in ('before','after','error','events','inner','return'): need(a[k]==b[k], 'captured state/result '+k)
        need(len({r['transaction_base64'] for r in runs.values()})==1, 'same captured fixture wire')
        for run in runs.values():
            raw=base64.b64decode(run['transaction_base64'],validate=True); tx=VersionedTransaction.from_bytes(raw)
            need(bytes(tx)==raw and all(tx.verify_with_results()), 'captured actual signatures'); txs+=1; sigs+=len(tx.signatures)
    original=(R/'evidence/original/pump/deployed.so').read_bytes(); old=(R/'repro/pump/canonical-frontier-20261028/candidate.so').read_bytes(); new=(P/'artifacts/candidate.so').read_bytes()
    blobs={sha(v):v for v in (original,old,new)}; loads=doc(d/'loader.json')['loads']
    need((txs,sigs,len(loads))==(42,84,42) and {r['elf_sha256'] for r in loads}==set(blobs), 'captured execution/signature/image totals')
    need([r['elf_sha256'] for r in loads]==[sha(original),sha(old),sha(new)]*14, 'per-case captured creation image association')
    for load in loads: check_loader(load,blobs)
    return dict(cases=14,executions=42,signature_fields=84,actual_captured_loads=42,source_normalization=None)

def verify(source_directory=None, allow_unsealed=False):
    if not allow_unsealed:
        manifest=doc(P/'MANIFEST.json')['files']
        excluded=('builds/cold-01/profile-sdk','builds/cold-01/source')
        actual={f.relative_to(P).as_posix() for f in P.rglob('*') if f.is_file() and not any(f.is_relative_to(P/x) for x in excluded)}
        need(actual==set(manifest)|{'MANIFEST.json'}, 'exact publication inventory')
        for name,digest in manifest.items(): need(not(P/name).is_symlink() and sha((P/name).read_bytes())==digest, 'sealed successor bytes '+name)
    candidate,_=source_and_builds(source_directory)
    counter=json.loads(subprocess.check_output([sys.executable,'-B',str(P/'runtime/counter/verify_counter.py'),'--no-write'],text=True))
    need(counter['passed'] and counter['fixtures']==12 and counter['executions']==36 and counter['verified_signature_fields']==36 and counter['captured_loader_observations']==36 and not counter['proposal_differences'], 'fresh inherited counter12')
    original=(R/'evidence/original/pump/deployed.so').read_bytes();historical=(R/'research/pump-final-composition-673-20261028/artifacts/candidate.so').read_bytes();new=(P/'artifacts/candidate.so').read_bytes()
    blobs={sha(v):v for v in (original,historical,new)}
    for filename in ('counter-witness.json.gz','counter-witness-protocol.json.gz'):
        report=doc(P/'runtime/counter'/filename)
        need(report['images_sha256']=={'original':sha(original),'parent':sha(historical),'proposal':candidate}, 'actual inherited counter image roles')
        for row in report['cases']:
            for label,observation in row['observations'].items():
                load,=observation['loads']; need(load['elf_sha256']==report['images_sha256'][label], 'counter literal selected-image association');check_loader(load,blobs)
    full=verify_full44(candidate)
    focused=json.loads(subprocess.check_output([sys.executable,'-B',str(P/'verify_focused.py'),'--candidate',str(P/'artifacts/candidate.so')],text=True))
    need(focused['candidate_sha256']==candidate and focused['all_selected_observation_differences']==0, 'fresh inherited focused corpora')
    captured=captured_create(candidate)
    notice=json.loads(subprocess.check_output([sys.executable,'-B',str(P/'verify_notice.py')],text=True))
    need(notice==dict(cases=1,executions=3,signature_fields=6,actual_captured_loads=3,parent_notice_differences=1,candidate_notice_differences=0,strict_ordered_log_mismatches=0,source_normalization=None), 'bounded current-parent notice correction')
    return dict(passed=True,sealed=not allow_unsealed,candidate_sha256=candidate,normalized=1019,raw=188,window_gain=0,
        actual_builds=2,cold_empty_target=True,full44=full,counter_cases=12,counter_executions=36,parent_Source_differences=3,
        counter_historical_parent_sha256=sha(historical),current_parent_sha256='c0e29e2d41c30e854f3548b37e87798d516e4e0e7769f40b7d8d16e31429795f',
        source_normalization=None,focused=focused,captured_create=captured,program_creator_notice=notice,whole_elf_equal=False,goal_complete=False)

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--source-directory',type=Path);parser.add_argument('--allow-unsealed',action='store_true');parser.add_argument('--report',type=Path);args=parser.parse_args()
    result=verify(args.source_directory,args.allow_unsealed)
    if args.report:
        need(not args.report.resolve().is_relative_to(P), 'write external verification report only')
        args.report.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result,indent=2))
if __name__=='__main__':main()
