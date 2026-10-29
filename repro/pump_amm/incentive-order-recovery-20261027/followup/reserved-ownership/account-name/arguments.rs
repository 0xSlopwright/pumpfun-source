use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint;
#[global_allocator]
static ALLOCATOR: entrypoint::BumpAllocator = entrypoint::BumpAllocator {start:entrypoint::HEAP_START_ADDRESS as usize,len:entrypoint::HEAP_LENGTH};
pub fn attach(error: anchor_lang::error::Error, name: std::fmt::Arguments<'_>) -> anchor_lang::error::Error { error.with_account_name(name) }
