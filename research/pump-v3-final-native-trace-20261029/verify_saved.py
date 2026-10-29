#!/usr/bin/env python3
"""Read retained native build evidence only. Never run build recipes or runtime producers."""
if not __debug__:
    raise SystemExit('Run without -O; saved integrity assertions are required.')
import sys
sys.dont_write_bytecode = True
from pathlib import Path
import argparse,contextlib,csv,difflib,gzip,hashlib,importlib.util,io,json,re,shlex,tarfile

P = Path(__file__).resolve().parent
D037 = 'ef50bb5262f67c59f4d1850f83e2821fa1e9c5f02649589cab356a6e28cffb49'
INNER = '05be7cedcb12551e620962faf13e365fc57f5ae3d1cefaa4a4c86265645e02e5'
PLAN = '15660946baa2d6676d421c9fdba5edb20f2dc0ba210eadc03d0ca452e70265d6'
PLAN_MF = '423cc2b54c178e5decfda935647f7d726e2180fd7e982ac65144caa3db133372'
OLD831 = 'ef8ba48f5cff579133360a4dc49dd0fba4d5c2791eca519b6d4b4ca8c47ce039'
NEW831 = 'ffc786b8966fb0011700483ad41b6be5c2616faa89de2719858ecf0c5205ff0c'
ORIGINAL = '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
COUNTS = dict(total=1035,normalized=1019,raw=188,unmatched=16,matched_text_bytes=1611088)
SYMBOL = '_ZN14pump_recovered5trade12v3_buy_costs17h7b9c6f53e4a86951E'
sha = lambda b: hashlib.sha256(b).hexdigest()
def digest(p): return sha(Path(p).read_bytes())
def doc(p): return json.loads(Path(p).read_text())
def need(ok, why):
    if not ok: raise ValueError(why)
def files(base): return {str(p.relative_to(base)):digest(p) for p in sorted(base.rglob('*')) if p.is_file()}
def checkmap(base,m):
    for n,h in m.items():
        need(not Path(n).is_absolute() and '..' not in Path(n).parts,'manifest relative member')
        need(digest(base/n)==h,'member hash: '+n)
def archive(p):
    with tarfile.open(p,'r:gz') as t:
        mm=t.getmembers();need(all(m.isfile() and not Path(m.name).is_absolute() and '..' not in Path(m.name).parts for m in mm),'archive member type/path')
        need(len({m.name for m in mm})==len(mm),'duplicate archive member')
        return {m.name:sha(t.extractfile(m).read()) for m in mm}
def parents(p,r):
    a=r/'research/pump-v3-costs-source-20261029';d=r/'research/pump-program-creator-notice-qualification-20261028'
    need(digest(d/'MANIFEST.json')==D037,'D037 selected parent manifest');checkmap(d,doc(d/'MANIFEST.json')['files'])
    need(digest(a/'MANIFEST.json')==NEW831 and (a/'MANIFEST.json').read_bytes()==(p/'inputs/pr831-current-MANIFEST.json').read_bytes(),'corrected public831 manifest')
    checkmap(a,doc(a/'MANIFEST.json'))
    old=p/'inputs/historical-pr831';need(digest(old/'MANIFEST.json')==OLD831,'historical1887 manifest')
    before=doc(old/'MANIFEST.json');need(len(before)==79,'historical831 member count')
    need(digest(old/'verify.py')==before['verify.py'],'historical verifier bytes')
    unchanged=[n for n in before if n!='verify.py'];need(len(unchanged)==78,'original831 unchanged count')
    for n in unchanged:need(digest(a/n)==before[n],'historical831 retained member: '+n)
    need(digest(a/'verify.py')!=before['verify.py'],'documented verifier transition')
    need(digest(r/'evidence/original/pump/deployed.so')==ORIGINAL,'original ELF comparison hash')
    need(digest(r/'repro/reconstruction-status-2026-10-26/functions.tsv')=='fb2c0a47514567d65eb45c1e268dacd5291e4659bb7dceb575a767dc20bcaff8','selected window table')
    return a,d

def verify_sources(p,r):
    e=p/'evidence';d=r/'research/pump-program-creator-notice-qualification-20261028';q=p/'inputs/approved-plan'
    need(digest(q/'PLAN.json')==PLAN and digest(q/'MANIFEST.json')==PLAN_MF,'approved plan bytes')
    plan=doc(q/'PLAN.json');src=doc(q/'SOURCE65.json');old=doc(d/'SOURCE65.json')
    need(len(src)==len(old)==65 and src.keys()==old.keys() and [n for n in old if old[n]!=src[n]]==['src/trade_v3.rs'],'source65_D037_join')
    stock=e/'stock/source';primary={n:(stock/'programs/pump'/n if n=='src/trade_v3.rs' else d/'source'/n) for n in src}
    need(all(digest(primary[n])==h for n,h in src.items()),'source65_D037_join')
    aa=(d/'source/src/trade_v3.rs').read_text().splitlines();bb=primary['src/trade_v3.rs'].read_text().splitlines()
    need(len(aa)==len(bb) and [i+1 for i,(a,b) in enumerate(zip(aa,bb)) if a!=b]==[366,376],'sole two source lines')
    pm=doc(q/'MANIFEST.json')['files'];need(len(pm)==76,'plan member census')
    for n,h in pm.items():
        f=primary[n.removeprefix('source65/')] if n.startswith('source65/') else e/'stock/executed-tools'/n.removeprefix('tools/') if n.startswith('tools/') else q/n
        need(digest(f)==h,'approved plan member: '+n)
    env=doc(e/'environment-reference.json');need(len(env['sdk_and_tool_files'])==1855 and len(env['locked_registry_archives'])==254 and sum(map(len,env['actual_registry_source_files'].values()))==4176,'recorded native input inventory')
    need(env['expected_current_tools']==plan['recipe']['tool_sha256'] and env['admitted_target_libraries']==plan['recipe']['target_libraries_sha256'],'native recorded tools/libraries')
    need(digest(e/'environment-reference.json')==plan['recipe']['retained_environment_reference_sha256'],'retained environment hash')
    parent66=doc(d/'builds/primary/compiled-workspace-sha256.json')
    need(archive(d/'builds/primary/compiled-workspace.tar.gz')==parent66 and len(parent66)==66,'D037 actual compiled66 archive')
    attempts=doc(e/'native-attempts.json');need([x['mode'] for x in attempts]==['stock','passive'],'two actual build attempts')
    for role in ['stock','passive']:
        b=e/role;v=doc(b/'build-comparison.json');c=doc(b/'compiled66.json')
        need((b/'build-attempt.json').read_bytes()==(b/'build-comparison.json').read_bytes(),'literal attempt/result retained')
        need(v['returncode']==v['clean_returncode']==0 and v['mode']==role and v['authorized_plan_sha256']==PLAN,'actual native receipt')
        need(len(c)==66 and archive(b/'compiled-workspace.tar.gz')==c and files(b/'source')==c,'compiled66_archive_join')
        need(c.keys()==parent66.keys() and [n for n in parent66 if parent66[n]!=c[n]]==['programs/pump/src/trade_v3.rs'],'source65_D037_join')
        need(all(c['programs/pump/'+n]==h for n,h in src.items() if n not in ['Cargo.toml','Cargo.lock']),'source65_D037_join')
        need(c['Cargo.lock']==src['Cargo.lock'] and c['Cargo.toml']=='adfeee82af4178636813c170b650934d552ec08954a5abb369f7512b21a0b20c' and c['programs/pump/Cargo.toml']=='e81841e686018bc20019d31054d56510bad11089fe876d5feb7bea753f2bdff0','recorded stage65_to66 manifests')
        prefix='work/pump-v3-final-native-trace-20261028/'+role+'/source/'
        need(v['source_sha256']==v['source_after_sha256']=={prefix+n:h for n,h in c.items()},'actual compiled receipt source map')
        prefix='work/pump-v3-final-native-trace-plan-20261028/source65/'
        need(v['primary_source_sha256']==v['primary_source_after_sha256']=={prefix+n:h for n,h in src.items()},'actual primary receipt source map')
        need(v['primary_source_directory']==plan['source65'] and v['source_directory']==v['workspace_directory']+'/programs/pump','recorded source locators')
        need(v['tool_sha256']==plan['recipe']['tool_sha256'] and v['target_libraries_sha256']==plan['recipe']['target_libraries_sha256'],'actual native tool pins')
        for n,x in v['executed_python_sources'].items():need(digest(b/'executed-tools'/n)==x['sha256']==pm['tools/'+n],'retained reader/wrapper tool: '+n)
        need(digest(b/'executed-builder.py')==v['builder_sha256']==digest(e/'build.py'),'literal actual builder')
        need(v['source_wrapper_sha256']==pm['tools/pump_physical_source_wrapper.py'],'actual source wrapper')
        need(v['environment']['CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS']=='-Zremap-cwd-prefix=' and v['environment']['RUSTC']==plan['recipe']['tool_paths']['rustc'],'actual compiler environment')
        cmd=[plan['recipe']['tool_paths']['cargo'],'build' if role=='stock' else 'rustc','--manifest-path',v['source_directory']+'/Cargo.toml','--release','--target','sbpf-solana-solana','--offline','--locked','-vv']
        if role=='passive':cmd+=['--','-Cllvm-args=-filter-print-funcs='+SYMBOL,'-Cllvm-args=-print-before-all','-Cllvm-args=-print-after-all']
        need(v['command']==cmd==attempts[0 if role=='stock' else 1]['command'],'actual command/launch agreement')
        need(v['compiled_packages']==['pump-token-ext','pump-recovered'] and all(v['fresh_local_compilations'].values()) and not v['external_dependency_rebuild'] and not v['stack_warnings'],'two local crates fresh, dependencies reused')
        need(all(v[k] for k in ['source_unchanged','tools_unchanged','target_libraries_unchanged','reused_external_artifacts_unchanged','executed_python_sources_unchanged']),'recorded post-build checks')
        need(digest(b/'compiled66.json')==v['compiled66_sha256'] and digest(b/'compiled-workspace.tar.gz')==v['compiled_workspace_archive_sha256'] and digest(b/'build.log')==v['build_log_sha256'],'actual artifact receipt join')
        runs=[shlex.split(l.split('Running `',1)[1].removesuffix('`')) for l in (b/'build.log').read_text().splitlines() if 'Running `' in l and '--crate-name pump_' in l]
        need([x[x.index('--crate-name')+1] for x in runs]==['pump_token_ext','pump_recovered'],'literal local compiler invocations')
        for args in runs:
            need(plan['recipe']['tool_paths']['rustc'] in args and args[args.index('--target')+1]=='sbpf-solana-solana' and '-Zremap-cwd-prefix=' in args,'literal native compiler/flags')
            diag=[x for x in args if x.startswith('-Cllvm-args=')]
            need(diag==(cmd[-3:] if role=='passive' and args[args.index('--crate-name')+1]=='pump_recovered' else []),'passive root-only diagnostic flags')
    need(doc(e/'precompiler-path-failure.json')['compiler_invocations']==0 and doc(e/'precompiler-path-failure.json')['clean_invocations']==0,'preserved precompiler setup failure')
    return {'source65':65,'compiled66_per_build':66,'unchanged_D037_inputs':64,'actual_builds':2,'precompiler_setup_failures':1,'recorded_SDK_tool_files':1855,'recorded_locked_archives':254,'recorded_registry_source_files':4176}

def verify_outputs(p):
    e=p/'evidence'
    for role in ['stock','passive']:
        b=e/role;v=doc(b/'build-comparison.json')
        need(digest(b/'candidate.so')==v['comparison']['candidate_sha256'] and digest(b/'unstripped.so')==v['unstripped_sha256'],'actual output receipt hash')
        need(v['comparison']['original_sha256']==ORIGINAL and not v['comparison']['full_byte_equality'],'original comparison only')
    need(all((e/'stock'/n).read_bytes()==(e/'passive'/n).read_bytes() for n in ['candidate.so','unstripped.so']),'whole_outputs_equal')
    q=doc(e/'trace-qualification.json');need(q['qualified'] and all(q['whole_files_equal'].values()) and q['native_builds']==2 and q['VM_executions']==0,'passive whole-output qualification')
    need(q['stock_candidate_sha256']==q['passive_candidate_sha256']==digest(e/'stock/candidate.so') and q['stock_symbols_sha256']==q['passive_symbols_sha256']==digest(e/'stock/unstripped.so'),'qualification output join')
    return {'stripped_sha256':digest(e/'stock/candidate.so'),'symbols_sha256':digest(e/'stock/unstripped.so'),'whole_stripped_and_symbols_equal':True}

def verify_census(p,r):
    e=p/'evidence';a=r/'research/pump-v3-costs-source-20261029';tools=a/'tools'
    oldpath=sys.path[:];sys.path.insert(0,str(tools))
    try:
        sp=importlib.util.spec_from_file_location('native_saved_census',tools/'census.py');c=importlib.util.module_from_spec(sp);sp.loader.exec_module(c);c.ROOT=r
        actual=c.census(e/'stock/unstripped.so')
    finally:sys.path[:]=oldpath
    retained=json.loads(gzip.decompress((e/'stock/inventory.json.gz').read_bytes()))
    need(actual==retained and actual['counts']==COUNTS,'census_rederived')
    parent=json.loads(gzip.decompress((r/'research/pump-program-creator-notice-qualification-20261028/analysis/inventory.json.gz').read_bytes()))
    need(len(parent['windows'])==len(actual['windows'])==1035,'whole1035 census')
    for old,new in zip(parent['windows'],actual['windows']):
        need((old['start'],old['bytes'],old['raw_sha256'])==(new['start'],new['bytes'],new['raw_sha256']),'original window association')
        need(bool(old['normalized_matches'])==bool(new['normalized_matches']) and old['raw_match']==new['raw_match'],'no gained/lost memberships')
    need(doc(e/'stock/measurement.json')['official_counts']==COUNTS,'measurement census join')
    return {**COUNTS,'normalized_gains':0,'normalized_losses':0,'raw_gains':0,'raw_losses':0}

def verify_operands(p,r):
    # Only two literal data locators change in the sealed read-only reference audit.
    e=p/'evidence';a=r/'research/pump-v3-costs-source-20261029';source=(e/'audit_native_refs.py').read_text()
    substitutions={"B=Path('/Users/shawwalters/.codex/worktrees/pump-swap-remaining-20261028/pumpfun-source/work/pr831-review-20261028/projection/research/pump-v3-costs-source-20261029')":'B=Path('+repr(str(a))+')',"Path('/Users/shawwalters/.codex/worktrees/pump-swap-remaining-20261028/pumpfun-source/work/pump-v3-final-native-trace-20261028/stock/unstripped.so')":'Path('+repr(str(e/'stock/unstripped.so'))+')'}
    for before,after in substitutions.items():need(source.count(before)==1,'explicit reference path view');source=source.replace(before,after)
    argv=sys.argv[:];ns={'__name__':'__main__','__file__':str(e/'audit_native_refs.py')};out=io.StringIO()
    try:
        sys.argv=['audit_native_refs.py','--repo-root',str(r)]
        with contextlib.redirect_stdout(out):
            try:exec(compile(source,str(e/'audit_native_refs.py'),'exec'),ns)
            except AssertionError as exc:raise ValueError('bounded operand audit rederivation: '+repr(exc)) from exc
    finally:sys.argv=argv
    actual=json.loads(out.getvalue());retained=doc(e/'stock/reference-audit.json')
    need(actual['calls']==retained['calls'] and actual['data']==retained['data'],'original_Linux_native_operand_joins')
    need(all(actual['images'][k]['sha256']==retained['images'][k]['sha256'] for k in actual['images']),'reference image association')
    t=ns['ts'];m=doc(e/'stock/measurement.json')
    need(t['original']['bytes']==2120 and t['parent']['bytes']==t['candidate']['bytes']==2144 and t['parent']['norm']==t['candidate']['norm'] and t['original']['norm']!=t['candidate']['norm'],'original_Linux_native_target_join')
    need(t['candidate']['address']==m['native_target']['start'] and sha(t['candidate']['raw'])==m['native_target']['raw_sha256'] and sha(t['candidate']['norm'])==m['native_target']['normalized_sha256'],'native target measurement')
    slots=lambda b:[b[i:i+8] for i in range(0,len(b),8)]
    changed=sum(max(j-i,l-k) for tag,i,j,k,l in difflib.SequenceMatcher(None,slots(t['original']['norm']),slots(t['candidate']['norm']),autojunk=False).get_opcodes() if tag!='equal')
    need(changed==25==m['original_native']['aligned_changed_slots'],'25-slot alignment diagnostic')
    need(actual['calls']['sites']==dict(original=17,parent=17,candidate=17) and actual['calls']['distinct_targets']==dict(original=10,parent=10,candidate=10) and actual['data']['sites']==dict(original=16,parent=16,candidate=16),'bounded17call16data census')
    return {'original_bytes':2120,'Linux_final_bytes':2144,'native_final_bytes':2144,'native_Linux_narrow_body_equal':True,'aligned_changed_slots':25,'ordered_call_sites':17,'distinct_full_normalized_callee_classes':10,'ordered_bounded_data_refs':16,'recursive_operand_closure':False,'path_view_substitutions':2}

def verify_stages(p):
    e=p/'evidence';text=(e/'passive/build.log').read_text();marks=list(re.finditer(r'^(?:; |# )?\*\*\* IR Dump[^\n]*$',text,re.M))
    need(len(marks)==392,'392 filtered stage snapshots')
    ss=[text[m.start():(marks[i+1].start() if i+1<len(marks) else len(text))] for i,m in enumerate(marks)]
    idx=[]
    for i,s in enumerate(ss):
        h,b=s.split('\n',1);idx.append(dict(index=i,header=h,machine='# Machine code for function' in b,bytes=len(b)+1,branches=len(re.findall(r'\bJMP ',b))))
    need(idx==doc(e/'passive/snapshot-index.json'),'trace index rederived')
    need(next(i for i,x in enumerate(idx) if x['machine'])==276 and all(x['machine'] for x in idx[276:]),'first observable machine boundary')
    for f in (e/'analysis').glob('snapshot-*.txt'):
        i=int(f.stem.split('-')[1]);s=ss[i]
        if '# End machine code for function' in s:s=s[:s.index('\n',s.index('# End machine code for function'))+1]
        if i==0:s=s.replace('\n','\n\n',1)
        need(f.read_text()==s,'saved stage/log association: '+f.name)
    need('JEQ_ri %15:gpr, 2, %bb.22\n  JMP %bb.23' in ss[276],'earliest second-add branch pair')
    need('%stack.19' not in ss[334] and 'STD_V1 %151:gpr, %stack.19, 0' in ss[335] and ss[335].count('LDD_V1 %stack.19, 0')==4,'greedy_retptr_spill_boundary')
    need('$r6 = LDD_V1 %stack.19, 0' in ss[337] and '$r6 = LDD_V1 $r10, -400' in ss[355],'retptr physical/frame association')
    need('Control Flow Optimizer' in idx[358]['header'] and 'Before' in idx[358]['header'] and 'After' in idx[359]['header'],'branch-folder pass identity')
    need('bb.34 (%ir-block.150)' in ss[358] and 'STD_V1 killed $r2, $r6, 16' in ss[358] and re.search(r'bb\.32 \(%ir-block\.150\).*?\$r2 = LDD_V1 \$r10, -272.*?JMP %bb\.20',ss[359],re.S),'split_pre_fee_error_tail')
    need('JEQ_ri $r1, 2, %bb.22\n  JMP %bb.18' in ss[371] and 'LDD_V1 $r10, -400' in ss[391],'final branch/retptr survives placement')
    return {'filtered_snapshots':392,'first_observable_machine_snapshot':276,'retptr_spill_pass':'334→335 Greedy Register Allocator','split_error_tail_pass':'358→359 Control Flow Optimizer','internal_SelectionDAG_steps_printed':False,'unique_original_IR_or_source_cause_proved':False}

def verify(p,r):
    need(not any(q.is_symlink() for q in p.rglob('*')),'packet excludes symlinks/SDK/target')
    mf=doc(p/'MANIFEST.json');actual=files(p);actual.pop('MANIFEST.json');need(actual==mf,'outer manifest hashes and membership')
    e=p/'evidence';need(digest(e/'MANIFEST.json')==INNER,'immutable original native inner manifest');inner=doc(e/'MANIFEST.json')['files'];need(len(inner)==295,'295 original evidence members');actual=files(e);actual.pop('MANIFEST.json');need(actual==inner,'all original native members byte exact')
    parents(p,r)
    out={'status':'PASS','scope':'Saved warm partial compiler research; original comparison only; no runtime/cold/canonical qualification or execution attestation','sources_and_recorded_native_inputs':verify_sources(p,r),'whole_outputs':verify_outputs(p),'census':verify_census(p,r),'target_and_operands':verify_operands(p,r),'compiler_stages':verify_stages(p),'historical_PR831_manifest_sha256':OLD831,'current_public_PR831_manifest_sha256':NEW831,'original_PR831_members_unchanged':78,'old_verifier_executed':False,'native_builds_performed_by_reader':0,'VM_executions':0,'cold_builds':0,'promotions':0,'complete_window_credit':0,'new_concrete_source_proposals':0}
    return out
if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--repo-root',type=Path,default=P.parents[1]);ap.add_argument('--report',type=Path);a=ap.parse_args()
    result=verify(P,a.repo_root.resolve());rendered=json.dumps(result,indent=2)+'\n'
    if a.report:
        need(not a.report.resolve().is_relative_to(P),'report must be outside sealed packet');a.report.write_text(rendered)
    print(rendered,end='')
