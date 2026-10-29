"""Verify exact composition, both builds, the full census, and saved runtime evidence.

The default is stdlib-only and does not execute transactions or compile code.
Use --signatures to independently reverify every recorded signer with solders.
"""
from pathlib import Path
import argparse,base64,collections,gzip,hashlib,io,json,re,struct,sys,tarfile

if not __debug__:
    raise SystemExit('Verification requires assertions; run without -O.')
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
sha=lambda data:hashlib.sha256(data).hexdigest()
read=lambda name:json.loads(gzip.decompress((HERE/name).read_bytes()) if name.endswith('.gz') else (HERE/name).read_bytes())
DIGEST=re.compile(r'[0-9a-f]{64}')
COUNTS={'total':1035,'normalized':1019,'raw':183,'unmatched':16,'matched_text_bytes':1611088}
FAMILIES={
    'v2-focused':(18,54,54),'sweep':(18,54,54),'v3sell':(128,256,256),
    'constructor':(25,50,50),'quote-program':(8,24,24),'multihop':(8,16,16),
    'cashback-order':(18,54,54),'admin-source':(5,15,30),
    'admin-shared':(12,36,72),'create-keys':(4,12,24),'costs-panic':(20,60,60),
}
TOOLS={'cargo':'d28444578306fe5a4f40524331411340123004e9e6556322fcabdbe351fe265d',
       'rustc':'c8807b7ebede8578ac5a257ea333780f9d89bd356064fd8184af7e996cb71a97',
       'objcopy':'f078d5b1f9df4190e67938a13e81e1dda1057e16228ff1a6f2f5d5540c9e6aaf'}
WRAPPER='d959fe0074fafe7f310a8f40051ce87f795b1e81b104a38dfe57086efa6bae1b'

def relative(name):
    p=Path(name)
    assert name and not p.is_absolute() and '..' not in p.parts and str(p)==name,name
    return p

def apply_patch(files,patch):
    """PR569's exact-context parser; no fuzzy patching or external patch tool."""
    lines=patch.splitlines(keepends=True);i=0
    while i<len(lines):
        assert lines[i].startswith('--- a/');name=lines[i][6:].strip();i+=1
        relative(name);assert name in files,name
        assert lines[i]=='+++ b/'+name+'\n';i+=1
        old=files[name].decode().splitlines(keepends=True);new=[];cursor=0
        while i<len(lines) and not lines[i].startswith('--- a/'):
            match=re.fullmatch(r'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@[^\n]*\n',lines[i]);assert match,lines[i]
            at=int(match[1])-1;assert at>=cursor;new+=old[cursor:at];i+=1;removed=[];added=[]
            while i<len(lines) and not lines[i].startswith(('@@','--- a/')):
                line=lines[i];assert line[0] in ' +-';i+=1
                if line[0] in ' -':removed.append(line[1:])
                if line[0] in ' +':added.append(line[1:])
            assert len(removed)==int(match[2] or 1) and len(added)==int(match[4] or 1)
            assert old[at:at+len(removed)]==removed,(name,at)
            new+=added;cursor=at+len(removed)
        new+=old[cursor:];files[name]=''.join(new).encode()

def hashes(files):
    return {name:sha(data) for name,data in files.items()}

def source_composition(result):
    parent=read('composition/control-569-result.json')
    assert result['source_base_pr']==569 and result['source_base_head']=='709b56739aac757fca5b9c965454272e1a4f6893'
    assert result['parent']==parent['parent']=={'pr':559,'head':'44697701d734c93a2e2321e850d62d368627c328','source':'L39'}
    files={}
    with tarfile.open(fileobj=io.BytesIO(gzip.decompress((HERE/'composition/L39-primary.tar.gz').read_bytes())),mode='r:') as archive:
        for member in archive.getmembers():
            relative(member.name);assert member.isfile() and member.name not in files
            files[member.name]=archive.extractfile(member).read()
    pinned=read('composition/L39-MANIFEST.json');assert len(files)==65
    for name,data in files.items():assert sha(data)==pinned['source/programs/pump/'+name],name
    workspace={'programs/pump/'+name:data for name,data in files.items()}
    workspace['Cargo.lock']=files['Cargo.lock']
    workspace['Cargo.toml']=b'[workspace]\nmembers = ["programs/pump"]\nresolver = "2"\n\n[profile.release]\npanic = "abort"\noverflow-checks = true\nlto = false\ncodegen-units = 1\n'
    workspace['programs/pump/Cargo.toml']=files['Cargo.toml'].split(b'[profile.release]')[0]
    order=result['applied_pr_order']
    assert order[:6]==parent['applied_pr_order']==[555,538,560,566,563,567]
    assert order[6:10]==[570,595,616,619] and len(order)==11 and order[-1] in ['shared-buyback',627]
    assert set(result['patch_sha256'])==set(map(str,order))
    for index,number in enumerate(order):
        patch=(HERE/f'composition/patches/{number}.patch').read_bytes()
        assert sha(patch)==result['patch_sha256'][str(number)]
        if index<6:assert sha(patch)==parent['patch_sha256'][str(number)]
        apply_patch(workspace,patch.decode())
        if index==5:assert hashes(workspace)==parent['source_sha256'],'PR569 intermediate source'
    assert len(workspace)==67 and hashes(workspace)==result['source_sha256']
    actual={str(p.relative_to(HERE/'source')):p.read_bytes() for p in (HERE/'source').rglob('*') if p.is_file()}
    assert actual==workspace,'complete 67-file source differs from exact patch composition'
    return parent

def fresh_commands(commands,log):
    assert len(commands)==2
    for name in ['pump_token_ext','pump_recovered']:
        found=[c for c in commands if '--crate-name' in c and c[c.index('--crate-name')+1]==name]
        assert len(found)==1
        command=found[0]
        assert command[command.index('--target')+1]=='sbpf-solana-solana'
        for flag in ['opt-level=3','panic=abort','codegen-units=1','overflow-checks=on','-Zremap-cwd-prefix=']:
            assert flag in command,(name,flag)
        assert 'Compiling '+name.replace('_','-')+' ' in log

def verify_builds(result):
    record=read('build-record.json');repeat=read('reproduction/receipt.json')
    log=gzip.decompress((HERE/'rebuild.log.gz').read_bytes())
    assert sha(log)==record['log_sha256']
    assert record['returncode']==0 and record['source_unchanged']
    assert result['source_sha256']==record['source_sha256']==record['source_after_sha256']
    for flag in ['--release','--offline','sbpf-solana-solana','pump-recovered','pump-token-ext','--manifest-path']:
        assert flag in record['clean_command']
    for r in [record,repeat]:
        assert r['returncode']==0
        for key in ['candidate_sha256','unstripped_sha256']:assert r[key]==result[key]
        cmd=r['command'];assert cmd[1]=='build' and cmd[cmd.index('--target')+1]=='sbpf-solana-solana'
        for flag in ['--release','--locked','--offline','--manifest-path']:assert flag in cmd
        assert cmd[cmd.index('--manifest-path')+1].endswith('/source/programs/pump/Cargo.toml')
        assert r['environment']['CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS']=='-Zremap-cwd-prefix='
        assert r['target_libraries_sha256'] and all(DIGEST.fullmatch(v) for v in r['target_libraries_sha256'].values())
    assert repeat['source_before_sha256']==repeat['source_after_sha256']==result['source_sha256']
    assert repeat['target_libraries_sha256']==record['target_libraries_sha256']
    assert repeat['tool_sha256']==TOOLS and repeat['source_wrapper_sha256']==WRAPPER
    tool_names={Path(k).name:v for k,v in record['tool_sha256'].items()}
    assert tool_names=={'cargo':TOOLS['cargo'],'rustc':TOOLS['rustc'],'llvm-objcopy':TOOLS['objcopy'],'pump_physical_source_wrapper.py':WRAPPER}
    assert record['seed_external_artifacts_sha256']
    assert not any('pump_recovered' in k or 'pump_token_ext' in k for k in record['seed_external_artifacts_sha256'])
    assert read('post-build-audit.json')=={'source_unchanged':True,'sdk_tools_unchanged':True,'target_libraries_unchanged':True}
    fresh_commands(read('compiler-commands.json'),log.decode())
    fresh_commands(read('reproduction/compiler-commands.json'),gzip.decompress((HERE/'reproduction/build.log.gz').read_bytes()).decode())

def shortvec(raw,at):
    value=0;start=at
    for shift in [0,7,14]:
        assert at<len(raw);byte=raw[at];at+=1;value|=(byte&127)<<shift
        if not byte&128:
            assert value<=65535 and (at-start==1 or byte!=0),'noncanonical compact-u16'
            return value,at
    raise AssertionError('invalid compact-u16')

def signed_shape(raw):
    """Count actual serialized signatures; no cryptographic claim in default mode."""
    count,at=shortvec(raw,0);assert 0<count<=255
    signatures=raw[at:at+64*count];assert len(signatures)==64*count
    assert all(any(signatures[i:i+64]) for i in range(0,len(signatures),64))
    at+=64*count;assert at+3<len(raw) and not raw[at]&128,'expected legacy Transaction'
    required,readonly_signed,readonly_unsigned=raw[at:at+3]
    assert required==count and readonly_signed<=required
    keys,after=shortvec(raw,at+3);assert keys>=count and readonly_unsigned<=keys-count
    assert after+32*keys+32<len(raw),'truncated message'
    return count

def program_messages(outcome):
    return [s for s in outcome['logs'] if s.startswith(('Program log: ','Program data: '))]

def anchor_messages(outcome):
    return [s for s in outcome['logs'] if 'AnchorError thrown' in s]

def compare_family(name,row):
    outcomes=row.get('results',row.get('outcomes',row));original=outcomes['original'];candidate=outcomes['candidate']
    fields=['error','accounts','events','inner','return_data']
    if name=='sweep':
        fields=['error','before','after']
        for key in ['inner_instructions','return_data']:assert original['metadata'][key]==candidate['metadata'][key],(name,key)
        assert [s for s in original['logs'] if s.startswith('Program data: ')]==[s for s in candidate['logs'] if s.startswith('Program data: ')]
        if row['case']['name'].startswith('zero-recipient'):
            assert '6000' in original['error'] and anchor_messages(original)==anchor_messages(candidate)
            assert any('sweep_fees.rs:123.' in s for s in anchor_messages(candidate))
    elif name in ['v3sell','costs-panic']:
        fields=['error','accounts','inner_instructions','event_payloads','return_data']
        if name=='costs-panic':
            compute=re.compile(r'^Program .* consumed \d+ of \d+ compute units$')
            logs=lambda r:[s for s in r['logs'] if not compute.fullmatch(s)]
            assert logs(original)==logs(candidate),'costs-panic ordered logs, excluding only compute counts'
    elif name in ['admin-source','admin-shared','create-keys']:
        fields=['error','before','after','events','inner','return']
        if name!='create-keys':
            assert program_messages(original)==program_messages(candidate),(name,'ordered program messages')
            for outcome in [outcomes[k] for k in ['original','baseline','candidate']]:
                assert outcome['signatures_verified'] and not outcome['pool_authority_top_level_signer']
        if name=='admin-source':
            assert any(f"admin_cto.rs:{row['original_line']}." in s for s in original['logs'])
            assert any(f"admin_cto.rs:{row['baseline_line']}." in s for s in outcomes['baseline']['logs'])
        elif name=='admin-shared' and row['original_error_source_line'] is not None:
            assert any(f"admin_cto.rs:{row['original_error_source_line']}." in s for s in original['logs'])
        elif name=='create-keys':
            case=row['case']
            if 'quote_pubkey' in case:
                assert '6063' in original['error']
                payload=['Program log: Left:','Program log: '+case['quote_pubkey'],'Program log: Right:','Program log: '+case['quote_pubkey']]
                for label in ['original','baseline','candidate']:
                    outcome=outcomes[label]
                    hits=[i for i,s in enumerate(outcome['logs']) if 'Error Code: UnsupportedQuoteMint.' in s]
                    assert len(hits)==1;at=hits[0]
                    # Explicit acknowledged remaining Source-site discrepancy.
                    line=220 if label=='original' else 70
                    assert f'create_v2.rs:{line}.' in outcome['logs'][at]
                    assert (outcome['logs'][at+1:at+5]==payload)==(label!='baseline')
            else:assert original['error'] is None
    elif name=='multihop':
        fields=['error','events','inner','return_data','after']
        assert not row['saved_original_differences']
    if name=='cashback-order' and row['case']['name'].startswith('both-mint-and'):
        code='6010' if 'owner' in row['case']['name'] else '6076'
        assert code in original['error'] and 'InvalidAccountData' in outcomes['baseline']['error']
        assert anchor_messages(original)==anchor_messages(candidate)
    for key in fields:assert original[key]==candidate[key],(name,row.get('case'),key)
    return outcomes

def verify_runtime(repo,result):
    audit=read('signature-audit.json');pins=read('composition/runtime-producer-pins.json')
    totals={'cases':0,'executed_transactions':0,'independently_verified_signatures':0}
    expected_keys=list(totals)
    assert set(audit['families'])==set(FAMILIES)
    for name,pin in pins.items():
        filename=name+'.py' if name in FAMILIES else name
        assert sha((HERE/'runtime/producers'/filename).read_bytes())==pin['sha256'],name
    execution=read('runtime/execution.json.gz');assert execution['candidate_sha256']==result['candidate_sha256']
    assert {r['name'] for r in execution['results']}==set(FAMILIES)
    cap=json.loads((repo/'evidence/original/pump/capture.json').read_bytes())
    program=(repo/'evidence/original/pump/program-account.bin').read_bytes()
    programdata=(repo/'evidence/original/pump/programdata-account.bin').read_bytes();header=programdata[:45]
    assert sha(program)==cap['program_sha256'] if 'program_sha256' in cap else sha(program)=='8101492b544ce08703d5de95363bf796e7e4cd17d03639cfe603071fb59652eb'
    assert sha(programdata)==cap['programdata_sha256'] and sha(programdata[45:])==result['original_sha256']
    candidate=(HERE/'candidate.so').read_bytes()
    known={result['original_sha256']:(len(programdata)-45,sha(programdata)),
           result['candidate_sha256']:(len(candidate),sha(header+candidate+bytes(len(programdata)-45-len(candidate))))}
    if ARGS.signatures:
        from solders.transaction import Transaction
    for name,expected in FAMILIES.items():
        report=read('runtime/'+name+'.json.gz');rows=report['cases']
        assert len(rows)==report.get('case_count',len(rows))==expected[0]
        for key in ['mismatches','candidate_mismatches','candidate_semantic_mismatches','candidate_log_mismatches']:
            assert not report.get(key,[]),(name,key)
        if name=='v2-focused':
            assert result['candidate_sha256'] in report['inputs_sha256'].values()
            assert pins[name]['sha256'] in report['inputs_sha256'].values()
        else:assert report['candidate_sha256']==result['candidate_sha256']
        if 'original_sha256' in report:assert report['original_sha256']==result['original_sha256']
        if 'producer_sha256' in report:assert report['producer_sha256']==pins[name]['sha256']
        command=read('runtime/'+name+'.command.json.gz')
        assert command in execution['results'] and command['name']==name and command['returncode']==0
        assert command['producer_sha256']==pins[name]['sha256']
        assert command['command'][command['command'].index('--candidate')+1].endswith('/candidate.so')
        loader_path=HERE/'runtime'/f'{name}.loader.json.gz'
        if loader_path.exists():
            receipt=read('runtime/'+loader_path.name);loads=receipt['loads']
            for path,digest in receipt['input_sha256'].items():
                if '/scripts/' in path:assert sha((HERE/'runtime/producers'/Path(path).name).read_bytes())==digest
                else:
                    suffix=path.split('/evidence/',1)[1];assert sha((repo/'evidence'/suffix).read_bytes())==digest
        else:loads=report['loader_loads']
        assert sum(load['elf_sha256']==result['candidate_sha256'] for load in loads)==len(rows)
        allowed={result['original_sha256'],result['candidate_sha256']}
        allowed.update(report[k] for k in ['baseline_sha256','control_sha256'] if report.get(k))
        if name=='v2-focused':allowed.update(v for k,v in report['inputs_sha256'].items() if k.endswith('/native-control/candidate.so'))
        if name=='create-keys':allowed.update(report['image_sha256'].values())
        for load in loads:
            assert load['elf_sha256'] in allowed,(name,'unbound loader image')
            assert load['elf_prefix_unchanged'] and load['zero_allocation_tail']
            assert load['program_owner']==cap['owner'] and load['program_sha256']==sha(program)
            assert load['program_bytes']==len(program) and load['programdata_bytes']==len(programdata)
            assert load['header_sha256']==sha(header) and load['slot']>struct.unpack_from('<Q',header,4)[0]
            if load['elf_sha256'] in known:
                size,digest=known[load['elf_sha256']]
                assert load['elf_bytes']==size and load['programdata_sha256']==digest
        actual={'cases':len(rows),'executed_transactions':0,'independently_verified_signatures':0}
        labels=['original','candidate'] if name in ['v3sell','constructor','multihop'] else ['original','baseline','candidate']
        if name=='costs-panic':labels=['original','control','candidate']
        for row in rows:
            outcomes=compare_family(name,row);raws=[]
            for label in labels:
                encoded=outcomes[label]['transaction_base64'];raw=base64.b64decode(encoded,validate=True)
                count=signed_shape(raw);raws.append(raw)
                actual['executed_transactions']+=1;actual['independently_verified_signatures']+=count
                if ARGS.signatures:
                    tx=Transaction.from_bytes(raw);tx.verify();checks=tx.verify_with_results()
                    assert len(tx.signatures)==len(checks)==count and all(checks)
            assert len(set(raws))==1,(name,'transaction changed across images')
        assert tuple(actual[k] for k in expected_keys)==expected
        assert actual==audit['families'][name]
        for k in totals:totals[k]+=actual[k]
    assert totals==audit['totals']=={'cases':264,'executed_transactions':631,'independently_verified_signatures':694}
    assert result['paired_cases']==264 and result['executed_transactions']==631 and result['independently_verified_signatures']==694
    assert result['runtime']==dict(totals,structured_mismatches=0)
    return totals

def verify(repo):
    manifest=read('MANIFEST.json')
    assert not any(p.is_symlink() for p in HERE.rglob('*')),'packet symlinks are unsupported'
    actual={str(p.relative_to(HERE)) for p in HERE.rglob('*') if p.is_file() and p.name!='MANIFEST.json'}
    assert actual==set(manifest),'manifest must cover every packet file exactly'
    for name,digest in manifest.items():
        p=HERE/relative(name);assert not p.is_symlink() and DIGEST.fullmatch(digest)
        assert sha(p.read_bytes())==digest,name
    result=read('RESULT.json');parent=source_composition(result)
    assert result['whole_elf_equal'] is False
    for key,name in [('candidate_sha256','candidate.so'),('unstripped_sha256','unstripped.so')]:assert sha((HERE/name).read_bytes())==result[key]
    assert sha((repo/'evidence/original/pump/deployed.so').read_bytes())==result['original_sha256']
    assert sha((repo/'repro/reconstruction-status-2026-10-26/functions.tsv').read_bytes())==result['selected_windows_tsv_sha256']
    assert sha((repo/'scripts/pump_physical_source_wrapper.py').read_bytes())==WRAPPER
    verify_builds(result)
    for name in ['pump_compare_function_bytes.py','pump_quote_control_function_match.py']:
        assert (HERE/'tools'/name).read_bytes()==(repo/'scripts'/name).read_bytes(),name
    sys.path.insert(0,str(HERE/'tools'));import census
    census.ROOT=repo;computed=census.census(HERE/'unstripped.so')
    assert computed==read('inventory.json.gz') and computed['counts']==result['counts']==COUNTS
    control=read('composition/control-569-inventory.json.gz')
    assert control['counts']==COUNTS and control['candidate_sha256']==parent['unstripped_sha256']
    membership=read('membership-comparison.json')
    for key in ['normalized_matches','raw_match']:
        current={r['start'] for r in computed['windows'] if r[key]};previous={r['start'] for r in control['windows'] if r[key]}
        comparison={'gains':[hex(v) for v in sorted(current-previous)],'losses':[hex(v) for v in sorted(previous-current)]}
        assert comparison==membership[key]=={'gains':[],'losses':[]}
    inherited=read('composition/membership-comparison.json')
    for number in ['555','560']:
        previous=read('composition/control-'+number+'-inventory.json.gz')
        for key in ['normalized_matches','raw_match']:
            now={r['start'] for r in computed['windows'] if r[key]};before={r['start'] for r in previous['windows'] if r[key]}
            comparison={'gains':[hex(v) for v in sorted(now-before)],'losses':[hex(v) for v in sorted(before-now)]}
            assert comparison==inherited[number][key] and not comparison['losses']
    stripped=(HERE/'candidate.so').read_bytes();symbols=(HERE/'unstripped.so').read_bytes()
    one,two=census.sections(stripped),census.sections(symbols)
    for name in ['.text','.rodata','.data.rel.ro','.data']:
        if name in one:
            assert name in two;a,b=one[name],two[name]
            assert a['addr']==b['addr'] and a['size']==b['size']
            assert stripped[a['offset']:a['offset']+a['size']]==symbols[b['offset']:b['offset']+b['size']]
    totals=verify_runtime(repo,result)
    print(json.dumps({'counts':COUNTS,'paired_cases':totals['cases'],'executed_transactions':totals['executed_transactions'],
        'serialized_signature_entries':totals['independently_verified_signatures'],
        'signatures_reverified':totals['independently_verified_signatures'] if ARGS.signatures else 'use --signatures',
        'both_complete_builds_identical':True,'whole_elf_equal':False},indent=2))

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,default=HERE.parents[1])
    parser.add_argument('--signatures',action='store_true')
    ARGS=parser.parse_args();verify(ARGS.repo.resolve())
