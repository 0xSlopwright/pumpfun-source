#!/usr/bin/env python3
"""Compare typed references at the existing legacy cashback helper boundary."""
import difflib
import json
from pathlib import Path
import probe

P=Path(__file__).resolve().parent
S=P/'source'
baseline=json.loads((P/'baseline/inventory.json').read_text())
parents={name:(S/name).read_text() for name in ['src/sell.rs','src/lib.rs']}

def run(label, signer, program):
    changed=dict(parents)
    s=changed['src/sell.rs']
    if signer:
        s=s.replace('user: &AccountInfo<\'info>', 'user: &Signer<\'info>')
        s=s.replace('Transfer { from: user.clone(),', 'Transfer { from: user.to_account_info(),')
    if program:
        s=s.replace('system_program: &AccountInfo<\'info>', 'system_program: &Program<\'info,System>')
        s=s.replace('system_program.clone(),', 'system_program.to_account_info(),')
        old='crate::legacy_sell::process_cashback(ctx.remaining_accounts,&ctx.accounts.mint.key(),&ctx.accounts.user,ctx.accounts.system_program.as_ref(),bonding_curve,creator_fee)'
        new=old.replace('ctx.accounts.system_program.as_ref()','&ctx.accounts.system_program')
        assert changed['src/lib.rs'].count(old)==1
        changed['src/lib.rs']=changed['src/lib.rs'].replace(old,new)
    changed['src/sell.rs']=s
    assert changed!=parents
    out=P/'probes'/label
    assert not out.exists()
    out.mkdir(parents=True)
    patch=''
    for name in parents:
        patch+=''.join(difflib.unified_diff(parents[name].splitlines(True),changed[name].splitlines(True),fromfile='parent/'+name,tofile='candidate/'+name))
        (S/name).write_text(changed[name])
    (out/'source.patch').write_text(patch)
    before=probe.inputs(S)
    try:
        r=probe.fastbuild.build(S,P.parents[1]/'work/goal-pump-swap-final-20261028-build',out,quiet=True)
        r.update(label=label,source_inputs=before,source_unchanged=before==probe.inputs(S),runtime_executed=False,experimental_only=True)
        if r['ok']:
            measured=probe.measure(out/'unstripped.so')
            (out/'inventory.json').write_text(json.dumps(measured,indent=2)+'\n')
            r['counts']=measured['counts']
            r['delta']={kind:{change:[hex(int(k))for k,v in measured['windows'].items()if bool(v[kind])!=bool(baseline['windows'][k][kind])and bool(v[kind])==(change=='gains')]for change in ['gains','losses']}for kind in ['normalized','raw']}
            c=probe.win.Cand(out/'unstripped.so')
            a,n,name=next(f for f in c.funcs if 'process_cashback_inner' in f[2])
            original=next(w for w in probe.score.original_windows()if w['start']==0x6cd78)
            norm=probe.score.normalize(c.fn(a,n),a,c.secs)
            left=[x[2]for x in probe.win.insns(original['raw'],original['start'],probe.win.ORIG_SECS)]
            right=[x[2]for x in probe.win.insns(c.fn(a,n),a,c.secs)]
            r['target']={'original':'0x6cd78','original_bytes':original['bytes'],'candidate_bytes':n,'complete_normalized_equal':norm==original['norm'],'strict_instruction_similarity':difflib.SequenceMatcher(None,left,right,autojunk=False).ratio()}
        assert r['source_unchanged']
        (out/'result.json').write_text(json.dumps(r,indent=2)+'\n')
        print(json.dumps({k:r[k]for k in ['label','ok','counts','delta','target','seconds']if k in r},indent=2),flush=True)
    finally:
        for name,text in parents.items():(S/name).write_text(text)

if __name__=='__main__':
    for label,signer,program in [('legacy-signer',True,False),('legacy-program',False,True),('legacy-signer-program',True,True)]:run(label,signer,program)
