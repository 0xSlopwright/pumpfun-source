pub mod trade_v2;
pub mod sell;
pub mod buy;

use anchor_lang::prelude::*;
use crate::{GlobalConfig, Pool, PumpAmmError};

pub fn validate_protocol_fee_recipient(
    global_config: &Account<GlobalConfig>,
    protocol_fee_recipient: &AccountInfo,
    is_mayhem_mode: bool,
) -> Result<()> {
    let protocol_fee_recipient = protocol_fee_recipient.key();
    let valid = if is_mayhem_mode {
        protocol_fee_recipient == global_config.reserved_fee_recipient.key()
            || global_config.reserved_fee_recipients.contains(&protocol_fee_recipient)
    } else {
        global_config.protocol_fee_recipients.binary_search(&protocol_fee_recipient).is_ok()
    };
    require!(valid, PumpAmmError::InvalidProtocolFeeRecipient);
    Ok(())
}
pub mod multi_hop_swap;


pub fn prepare_pool<'info>(
    pool: &Account<'info, Pool>,
    system_program: &AccountInfo<'info>,
    payer: &AccountInfo<'info>,
) -> Result<()> {
    if pool.to_account_info().data_len() < 287 {
        extend_account_if_needed(pool, system_program, payer, 287)?;
    }
    Ok(())
}

fn extend_account_if_needed<'info, T, S, P>(
    account: &T, system_program: &S, payer: &P, size: usize,
) -> Result<()>
where
    T: ToAccountInfo<'info>, S: ToAccountInfo<'info>, P: ToAccountInfo<'info>,
{
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
