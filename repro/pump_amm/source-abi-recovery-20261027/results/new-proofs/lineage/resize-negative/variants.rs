#![allow(dead_code)]
use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint;
#[global_allocator]
static ALLOCATOR:entrypoint::BumpAllocator=entrypoint::BumpAllocator{start:entrypoint::HEAP_START_ADDRESS as usize,len:entrypoint::HEAP_LENGTH};
pub fn baseline<'info>(pool: &AccountInfo<'info>, system_program: &AccountInfo<'info>, payer: &AccountInfo<'info>) -> Result<()> {
    if pool.to_account_info().data_len() < 287 {
        inner_baseline(pool, system_program, payer, 287)?;
    }
    Ok(())
}

fn inner_baseline<'info>(account: &AccountInfo<'info>, system_program: &AccountInfo<'info>, payer: &AccountInfo<'info>, size: usize) -> Result<()> {
    if account.to_account_info().data_len() < size {
        let needed = Rent::get()?.minimum_balance(size)
            .saturating_sub(account.to_account_info().lamports());
        if needed > 0 {
            anchor_lang::system_program::transfer(CpiContext::new(
                system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: payer.to_account_info(), to: account.to_account_info(),
                },
            ), needed)?;
        }
        account.to_account_info().realloc(size, false)?;
    }
    Ok(())
}


pub fn direct_nested<'info>(pool: &AccountInfo<'info>, system_program: &AccountInfo<'info>, payer: &AccountInfo<'info>) -> Result<()> {
    if pool.to_account_info().data_len() < 287 {
        if pool.to_account_info().data_len() < 287 {
        let needed = Rent::get()?.minimum_balance(287)
            .saturating_sub(pool.to_account_info().lamports());
        if needed > 0 {
            anchor_lang::system_program::transfer(CpiContext::new(
                system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: payer.to_account_info(), to: pool.to_account_info(),
                },
            ), needed)?;
        }
        pool.to_account_info().realloc(287, false)?;
        }
    }
    Ok(())
}

pub fn length_bindings<'info>(pool: &AccountInfo<'info>, system_program: &AccountInfo<'info>, payer: &AccountInfo<'info>) -> Result<()> {
    let first_len = pool.to_account_info().data_len();
    if first_len < 287 {
        let second_len = pool.to_account_info().data_len();
        if second_len < 287 {
        let needed = Rent::get()?.minimum_balance(287)
            .saturating_sub(pool.to_account_info().lamports());
        if needed > 0 {
            anchor_lang::system_program::transfer(CpiContext::new(
                system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: payer.to_account_info(), to: pool.to_account_info(),
                },
            ), needed)?;
        }
        pool.to_account_info().realloc(287, false)?;
        }
    }
    Ok(())
}
