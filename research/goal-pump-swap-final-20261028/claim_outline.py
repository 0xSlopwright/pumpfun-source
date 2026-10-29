#!/usr/bin/env python3
"""Test the two observed AccountInfo clone and diagnostic format boundaries."""
import json
from pathlib import Path
import probe

P=Path(__file__).resolve().parent
baseline=json.loads((P/'baseline/inventory.json').read_text())
clone="\n#[inline(never)] fn goal_clone_info<'info>(info:&AccountInfo<'info>)->AccountInfo<'info>{info.clone()}\n"
formatter="\n#[inline(never)] fn goal_error_msg(error:&crate::PumpError)->String{error.to_string()}\n"

def source(parent, outline_message=True, clone_mint=False):
    s=probe.claim_boundary(parent)
    s=s.replace('a.associated_quote_user.to_account_info().owner','super::goal_clone_info(a.associated_quote_user.as_ref()).owner')
    if clone_mint:s=s.replace('a.quote_mint.to_account_info().owner','super::goal_clone_info(a.quote_mint.as_ref()).owner')
    if outline_message:
        for left in ['*a.quote_mint.to_account_info().owner','*super::goal_clone_info(a.quote_mint.as_ref()).owner','*super::goal_clone_info(a.associated_quote_user.as_ref()).owner']:
            old='require_keys_eq!('+left+',a.quote_token_program.key(),PumpError::AccountTypeNotSupported);'
            if old not in s:continue
            error='PumpError::AccountTypeNotSupported'
            constructed='anchor_lang::error::Error::from(anchor_lang::error::AnchorError{error_name:'+error+'.name(),error_code_number:'+error+'.into(),error_msg:super::goal_error_msg(&'+error+'),error_origin:Some(anchor_lang::error::ErrorOrigin::Source(anchor_lang::error::Source{filename:file!(),line:line!()})),compared_values:None})'
            new='if '+left+'!=a.quote_token_program.key(){return Err('+constructed+'.with_pubkeys(('+left+',a.quote_token_program.key())));}'
            assert s.count(old)==1
            s=s.replace(old,new)
    return s+clone+(formatter if outline_message else '')

if __name__=='__main__':
    probe.run('claim-recipient-format-outlined-fixed','src/token_incentives/claim_token_incentives.rs',source,baseline)
    probe.run('claim-all-format-outlined-fixed','src/token_incentives/claim_token_incentives.rs',lambda s:source(s,clone_mint=True),baseline)
