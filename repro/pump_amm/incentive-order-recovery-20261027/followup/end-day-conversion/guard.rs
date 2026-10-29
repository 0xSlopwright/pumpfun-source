use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint;
#[global_allocator]
static ALLOCATOR: entrypoint::BumpAllocator = entrypoint::BumpAllocator {start:entrypoint::HEAP_START_ADDRESS as usize,len:entrypoint::HEAP_LENGTH};
declare_id!("pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA");
#[account]
#[derive(Debug)]
pub struct GlobalVolumeAccumulator {
    pub start_time:i64,
    pub end_time:i64,
    pub seconds_in_a_day:i64,
    pub mint:Pubkey,
    pub total_token_supply:[u64;30],
    pub sol_volumes:[u64;30],
}

pub fn end_day(g:&GlobalVolumeAccumulator)->usize {let index=|value|usize::try_from(value).expect("SVM is 64-bit"); let end=index(g.end_time);let start=index(g.start_time);if end<start || g.seconds_in_a_day==0 {None::<usize>.expect("end_time should be bigger than start_time")} else {(end-start)/index(g.seconds_in_a_day)}}
