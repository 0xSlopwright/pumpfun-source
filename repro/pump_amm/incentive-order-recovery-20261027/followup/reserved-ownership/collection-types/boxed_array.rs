use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint;
#[global_allocator]
static ALLOCATOR: entrypoint::BumpAllocator = entrypoint::BumpAllocator {start:entrypoint::HEAP_START_ADDRESS as usize,len:entrypoint::HEAP_LENGTH};
pub fn collect(accounts: &[AccountInfo<'_>]) -> (Pubkey,[Pubkey;7]) { assert!(accounts.len() >= 8); let recipients=Box::new(core::array::from_fn::<Pubkey,8,_>(|i| accounts[i].key()));
 let first=recipients[0];let rest=recipients[1..].try_into().unwrap();(first,rest)}
