#!/usr/bin/env python3
"""Read-only score of isolated Pump probes; requires the local lane harness.
No compiler invocation or runtime claim. Source/binary identities are retained.
"""
import difflib, hashlib, json, re, subprocess, sys
from pathlib import Path
HARNESS=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness')
sys.path.insert(0,str(HARNESS))
import score, win
ROOT=Path(__file__).resolve().parent
BASE=ROOT/'current-parent/unstripped.so'
base=score.score(BASE)
orig={w['start']:w for w in score.original_windows()}
targets={0x80df8:r'trade::v3_buy_costs$',0x83c00:r'trade::v3_execute_buy$',0x147ba0:r'trade::buy$',0x1489f8:r'trade::buy_exact_quote$',0x14a8a8:r'trade::sell$',0x14f4e0:r'pump_recovered::buy_exact_sol_in$'}
rows=[]
for d in sorted(ROOT.iterdir()):
 p=d/'unstripped.so'
 if not p.exists():continue
 census=score.score(p);cand=win.Cand(p)
 row={'probe':d.name,'unstripped_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'normalized':sum(v['normalized'] for v in census.values()),'raw':sum(v['raw'] for v in census.values()),'normalized_gains':[hex(k) for k,v in census.items() if v['normalized'] and not base[k]['normalized']],'normalized_losses':[hex(k) for k,v in census.items() if not v['normalized'] and base[k]['normalized']],'raw_gains':[hex(k) for k,v in census.items() if v['raw'] and not base[k]['raw']],'raw_losses':[hex(k) for k,v in census.items() if not v['raw'] and base[k]['raw']],'targets':{}}
 q=d/'candidate.so'
 if q.exists():row['candidate_sha256']=hashlib.sha256(q.read_bytes()).hexdigest()
 for st,rx in targets.items():
  funcs=[(a,n,name) for a,n,name in cand.funcs if re.search(rx,win.demangle(name))]
  if not funcs:continue
  a,n,name=funcs[0];o=orig[st];ot=[v[2] for v in win.insns(o['raw'],st,win.ORIG_SECS)];ct=[v[2] for v in win.insns(cand.fn(a,n),a,cand.secs)]
  sm=difflib.SequenceMatcher(None,ot,ct,autojunk=False)
  row['targets'][hex(st)]={'original_bytes':o['bytes'],'candidate_bytes':n,'normalized_instruction_similarity':sm.ratio(),'aligned_instruction_difference_slots':sum(max(i2-i1,j2-j1) for t,i1,i2,j1,j2 in sm.get_opcodes() if t!='equal')}
 source=(ROOT/d.name.removesuffix('-out')) if d.name.endswith('-out') else None
 if d.name=='current-parent':source=ROOT/'programs/pump'
 if d.name.startswith('codegen-') or d.name=='opt2-out':source=ROOT/'cost-second-if'
 if d.name=='shared-errors-out':source=ROOT/'cost-shared-errors'
 if d.name=='shared-transfer-out':source=ROOT/'shared-transfer-fees'
 if d.name=='current-pr831':source=ROOT/'source-current'
 if d.name=='sell-passive-ir-out':source=ROOT/'sell-inline-quote-options'
 if source and (source/'src').is_dir():
  row['source_files_sha256']={str(f.relative_to(source)):hashlib.sha256(f.read_bytes()).hexdigest() for f in sorted(source.rglob('*')) if f.is_file()}
 row['stack_offset_warnings']=[l.strip() for l in (d/'build.log').read_text().splitlines() if 'exceeded max offset' in l] if (d/'build.log').exists() else None
 rows.append(row)
commit='e38a8b97a'
entries=subprocess.check_output(['git','ls-tree','-r',commit,'--','programs/pump'],cwd=ROOT.parent.parent,text=True).splitlines()
verified=[];bad=[]
for line in entries:
 info,path=line.split('\t',1);mode,typ,expected=info.split();f=ROOT/path
 if not f.is_file():bad.append({'path':path,'reason':'missing'});continue
 data=f.read_bytes();actual=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
 (verified if actual==expected else bad).append(path)
report={'status':'incomplete_no_new_window','scope':'Read-only independent census of isolated source probes. No source has been promoted and no runtime was executed for these probes.','maintained_source_commit':commit,'maintained_source_files_verified':len(verified),'maintained_source_mismatches':bad,'original_sha256':hashlib.sha256((score.BASE/'original.so').read_bytes()).hexdigest(),'baseline':{'normalized':sum(v['normalized'] for v in base.values()),'raw':sum(v['raw'] for v in base.values())},'probes':rows,'limitations':['Early cost-port/cost-u8 probes used L42, older than current maintained source; do not promote.','Source experiments include existing synthetic source-line positioning.','Normalization masks only the established direct-call and section-address operands.','Fast builder uses persistent external dependencies and recompiles main; this report is not a fresh qualified repository build or runtime receipt.','Any complete gain requires source binding, repeat build, current baseline retention and runtime qualification.']}
(ROOT/'PROBE-REPORT.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'status':report['status'],'probes':len(rows),'baseline':report['baseline'],'maintained_source_files_verified':len(verified),'source_mismatches':bad,'complete_gains':[(r['probe'],r['normalized_gains']) for r in rows if r['normalized_gains']]},indent=2))
