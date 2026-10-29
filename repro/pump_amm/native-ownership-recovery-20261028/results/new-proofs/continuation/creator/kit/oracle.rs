use anchor_lang::solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult,
    instruction::{AccountMeta,Instruction}, program::invoke_signed,
    program_error::ProgramError, pubkey::Pubkey,
};
entrypoint!(process_instruction);
fn process_instruction(program_id:&Pubkey,accounts:&[AccountInfo],data:&[u8])->ProgramResult {
    if accounts.len()!=8 || data.len()<8 {return Err(ProgramError::InvalidArgument);}
    let mint=accounts[7].key;
    let (authority,bump)=Pubkey::find_program_address(&[b"pool-authority",mint.as_ref()],program_id);
    if authority!=*accounts[3].key {return Err(ProgramError::InvalidSeeds);}
    let instruction=Instruction {
        program_id:*accounts[6].key,
        accounts:vec![
            AccountMeta::new(*accounts[0].key,true),
            AccountMeta::new_readonly(*accounts[1].key,false),
            AccountMeta::new(*accounts[2].key,false),
            AccountMeta::new_readonly(*accounts[3].key,true),
            AccountMeta::new_readonly(*accounts[4].key,false),
            AccountMeta::new_readonly(*accounts[5].key,false),
            AccountMeta::new_readonly(*accounts[6].key,false),
        ],
        data:data.to_vec(),
    };
    invoke_signed(&instruction,&accounts[..7],&[&[b"pool-authority",mint.as_ref(),&[bump]]])
}
