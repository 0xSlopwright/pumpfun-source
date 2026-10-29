#!/usr/bin/env python3
"""Run isolated source probes without altering the selected programs or census."""
import argparse
import difflib
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import sys
import time

P = Path(__file__).resolve().parent
H = Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness')
sys.path.insert(0, str(H))
import fastbuild
import score
import win

def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def inputs(src):
    return {p.relative_to(src).as_posix(): digest(p) for p in sorted(src.rglob('*')) if p.is_file()}

def measure(image):
    census = score.score(image)
    return {'counts': {'normalized': sum(x['normalized'] for x in census.values()),
                       'raw': sum(x['raw'] for x in census.values())},
            'windows': {str(k): v for k, v in census.items()}}

def run(label, filename, transform, baseline, overlays=None):
    src = P / 'source'
    file = src / filename
    parent = file.read_text()
    candidate = transform(parent)
    assert candidate != parent, label
    out = P / 'probes' / label
    assert not out.exists(), out
    out.mkdir(parents=True)
    parents={filename:parent}
    proposed={filename:candidate}
    for name,content in (overlays or {}).items():
        assert name not in proposed and (src/name).is_file()
        parents[name]=(src/name).read_text()
        proposed[name]=content
    patch=''
    for name,content in proposed.items():
        patch+=''.join(difflib.unified_diff(parents[name].splitlines(True), content.splitlines(True), fromfile='parent/'+name, tofile='candidate/'+name))
        (src/name).write_text(content)
    (out / 'source.patch').write_text(patch)
    before = inputs(src)
    try:
        result = fastbuild.build(src, P.parents[1] / 'work/goal-pump-swap-final-20261028-build', out, quiet=True)
        result['label'] = label
        result['source_inputs'] = before
        result['source_unchanged'] = before == inputs(src)
        result['experimental_only'] = True
        result['runtime_executed'] = False
        result['stack_check_scope'] = 'The imported runtime_valid field checks absence of stack-offset warnings only; no target execution is claimed.'
        result['helpers'] = {n: digest(H / n) for n in ['fastbuild.py','score.py','win.py','pump_physical_source_wrapper.py']}
        if result['ok']:
            measured = measure(out / 'unstripped.so')
            (out / 'inventory.json').write_text(json.dumps(measured, indent=2)+'\n')
            result['counts'] = measured['counts']
            result['delta'] = {kind: {change: [hex(int(k)) for k, v in measured['windows'].items() if bool(v[kind]) != bool(baseline['windows'][k][kind]) and bool(v[kind]) == (change == 'gains')] for change in ['gains','losses']} for kind in ['normalized','raw']}
            c = win.Cand(out / 'unstripped.so')
            result['targets'] = {}
            for addr, pattern in [(0x14f4e0, 'buy_exact_sol_in'), (0x77940, 'claim_token_incentives.*claim_v2'), (0x72810, 'sweep::execute'), (0x6cd78, 'process_cashback_inner')]:
                original = next(w for w in score.original_windows() if w['start'] == addr)
                functions = [(s,n,name) for s,n,name in c.funcs if pattern.split('.*')[0] in win.demangle(name) and pattern.split('.*')[-1] in win.demangle(name)]
                if not functions:
                    continue
                s,n,name = min(functions, key=lambda f: abs(f[1]-original['bytes']))
                actual = c.fn(s,n)
                norm = score.normalize(actual,s,c.secs)
                differences = [i for i,(x,y) in enumerate(zip(norm,original['norm'])) if x!=y]
                result['targets'][hex(addr)] = {'bytes': n, 'original_bytes': original['bytes'], 'different_bytes_positional':len(differences), 'different_slots_positional':len({i//8 for i in differences}), 'normalized_equal':norm==original['norm'], 'name':win.demangle(name)}
        assert result['source_unchanged']
        (out / 'result.json').write_text(json.dumps(result,indent=2)+'\n')
        printed=['label','ok','log','seconds']if not result['ok']else['label','counts','delta','targets','seconds']
        print(json.dumps({k:result[k]for k in printed if k in result},indent=2),flush=True)
    finally:
        for name,content in parents.items():(src/name).write_text(content)
    return result

def guard(s):
    old='let quote=if total>spendable_sol_in{raw_quote.checked_sub(total.saturating_sub(spendable_sol_in)).ok_or(PumpError::Overflow)?}else{raw_quote};'
    assert s.count(old)==1
    s=s.replace(old,'let mut quote=raw_quote;if total>spendable_sol_in{quote=raw_quote.checked_sub(total.saturating_sub(spendable_sol_in)).ok_or(PumpError::Overflow)?;')
    old='require_gt!(quote,0,PumpError::BuySlippageBelowMinTokensOut);'
    assert s.count(old)==1
    return s.replace(old,old+'}')

def claim_boundary(s):
    pairs=[
      ('*a.quote_mint.owner,a.quote_token_program.key()', '*a.quote_mint.to_account_info().owner,a.quote_token_program.key()'),
      ('*a.associated_quote_user.owner,a.quote_token_program.key()', '*a.associated_quote_user.to_account_info().owner,a.quote_token_program.key()'),
      ('let amount=if native{a.user_volume_accumulator.to_account_info().lamports().saturating_sub(Rent::get()?.minimum_balance(a.user_volume_accumulator.to_account_info().data_len()))}else{let data=a.associated_user_volume_accumulator.try_borrow_data()?;if data.is_empty(){0}else{TokenAccount::try_deserialize(&mut &data[..])?.amount}};',
       'let amount=if native{let minimum=Rent::get()?.minimum_balance(a.user_volume_accumulator.to_account_info().data_len());a.user_volume_accumulator.get_lamports().saturating_sub(minimum)}else{if a.associated_user_volume_accumulator.data_is_empty(){0}else{let data=a.associated_user_volume_accumulator.try_borrow_data()?;TokenAccount::try_deserialize(&mut &data[..])?.amount}};'),
      ('if native{a.user_volume_accumulator.sub_lamports(amount)?;a.user.add_lamports(amount)?;}',
       'if native{a.user_volume_accumulator.sub_lamports(amount)?;let user_lamports=a.user.lamports().checked_add(amount).ok_or(anchor_lang::solana_program::program_error::ProgramError::ArithmeticOverflow)?; **a.user.try_borrow_mut_lamports()?=user_lamports;}'),
    ]
    for old,new in pairs:
        assert s.count(old)==1,old
        s=s.replace(old,new)
    return s

def main():
    args=argparse.ArgumentParser()
    args.add_argument('mode', choices=['baseline','guard','errors','guard2','errors2','claim'])
    a=args.parse_args()
    bpath=P/'baseline/inventory.json'
    if a.mode=='baseline':
        data=measure(P/'baseline/unstripped.so');bpath.write_text(json.dumps(data,indent=2)+'\n');print(data['counts']);return
    baseline=json.loads(bpath.read_text())
    if a.mode in ['guard','guard2']:
        run(a.mode,'src/buy.rs',guard,baseline);return
    if a.mode=='claim':
        run('claim-boundaries','src/token_incentives/claim_token_incentives.rs',claim_boundary,baseline)
        changes={
            'claim-clone-direct':lambda s:s.replace('a.quote_mint.to_account_info().owner','a.quote_mint.as_ref().clone().owner').replace('a.associated_quote_user.to_account_info().owner','a.associated_quote_user.as_ref().clone().owner'),
            'claim-owner-borrow':lambda s:s.replace('require_keys_eq!(*a.quote_mint.to_account_info().owner,a.quote_token_program.key()', 'require_keys_eq!(*a.quote_mint.to_account_info().owner,*a.quote_token_program.as_ref().key').replace('require_keys_eq!(*a.associated_quote_user.to_account_info().owner,a.quote_token_program.key()', 'require_keys_eq!(*a.associated_quote_user.to_account_info().owner,*a.quote_token_program.as_ref().key'),
            'claim-recipient-hold':lambda s:s.replace('require_keys_eq!(*a.associated_quote_user.to_account_info().owner,','let recipient_account=a.associated_quote_user.to_account_info();require_keys_eq!(*recipient_account.owner,'),
            'claim-mint-hold':lambda s:s.replace('require_keys_eq!(*a.quote_mint.to_account_info().owner,','let quote_mint_info=a.quote_mint.to_account_info();require_keys_eq!(*quote_mint_info.owner,'),
            'claim-clone-outlined':lambda s:s.replace('a.quote_mint.to_account_info().owner','super::goal_clone_info(a.quote_mint.as_ref()).owner').replace('a.associated_quote_user.to_account_info().owner','super::goal_clone_info(a.associated_quote_user.as_ref()).owner')+'\n#[inline(never)] fn goal_clone_info<\'info>(info:&AccountInfo<\'info>)->AccountInfo<\'info>{info.clone()}\n',
            'claim-recipient-outlined':lambda s:s.replace('a.associated_quote_user.to_account_info().owner','super::goal_clone_info(a.associated_quote_user.as_ref()).owner')+'\n#[inline(never)] fn goal_clone_info<\'info>(info:&AccountInfo<\'info>)->AccountInfo<\'info>{info.clone()}\n',
            'claim-both-owner-hold':lambda s:s.replace('require_keys_eq!(*a.quote_mint.to_account_info().owner,','let quote_mint_info=a.quote_mint.to_account_info();require_keys_eq!(*quote_mint_info.owner,').replace('require_keys_eq!(*a.associated_quote_user.to_account_info().owner,','let recipient_account=a.associated_quote_user.to_account_info();require_keys_eq!(*recipient_account.owner,'),
        }
        for label,change in changes.items():
            run(label,'src/token_incentives/claim_token_incentives.rs',lambda s,c=change:c(claim_boundary(s)),baseline)
        return
    macro='require_gte!(spendable_sol_in,total,PumpError::TooMuchSolRequired);'
    error='error!(PumpError::TooMuchSolRequired).with_values((spendable_sol_in,total))'
    variants={
        'inline-result': 'if spendable_sol_in < total { #[inline(always)] fn wrap(e:Error)->Result<()>{Err(e)} return wrap('+error+');}',
        'inline-try': 'if spendable_sol_in < total { #[inline(always)] fn wrap(e:Error)->Result<()>{Err(e)} wrap('+error+')?;}',
        'manualdrop': 'if spendable_sol_in < total {let e=core::mem::ManuallyDrop::new('+error+');return Err(unsafe {core::ptr::read(&*e)});}',
        'read-error': 'if spendable_sol_in < total {let e='+error+';let result=unsafe{core::ptr::read(&e)};core::mem::forget(e);return Err(result);}',
        'convert-result': 'if spendable_sol_in < total {return From::from(Err::<(),Error>('+error+'));}',
        'closure-inline': 'if spendable_sol_in < total {let wrap=|e| Err::<(),Error>(e); return wrap('+error+');}',
        'try-result': 'if spendable_sol_in < total { Err::<(),Error>('+error+')?;}',
        'blackbox-tag': 'if spendable_sol_in < total {let e='+error+';return Err(core::convert::identity(e));}',
    }
    for label,new in variants.items():
        def transform(s, new=new):
            s=guard(s);assert s.count(macro)==1;return s.replace(macro,new)
        run(('second-'if a.mode=='errors2'else'')+label,'src/buy.rs',transform,baseline)

if __name__=='__main__':main()
