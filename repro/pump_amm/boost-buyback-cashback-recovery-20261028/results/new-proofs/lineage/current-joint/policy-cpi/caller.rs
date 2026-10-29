use anchor_lang::solana_program::{account_info::AccountInfo,entrypoint,entrypoint::ProgramResult,instruction::{AccountMeta,Instruction},program::invoke_signed,program_error::ProgramError,pubkey::Pubkey};
entrypoint!(process_instruction);
fn process_instruction(program_id:&Pubkey, accounts:&[AccountInfo],data:&[u8])->ProgramResult {
    if accounts.len()!=18 || data.len()<8 {return Err(ProgramError::InvalidArgument);}
    let mint=accounts[3].key;
    let (authority,bump)=Pubkey::find_program_address(&[b"pool-authority",mint.as_ref()],program_id);
    if authority!=*accounts[2].key{return Err(ProgramError::InvalidSeeds);}
    let metas=accounts.iter().enumerate().map(|(i,a)|AccountMeta{pubkey:*a.key,is_signer:i==2,is_writable:matches!(i,0|2|5|6|7|8|9|10)}).collect();
    let ix=Instruction{program_id:*accounts[17].key,accounts:metas,data:data.to_vec()};
    invoke_signed(&ix,accounts,&[&[b"pool-authority",mint.as_ref(),&[bump]]])
}
