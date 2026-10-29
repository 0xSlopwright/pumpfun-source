pub mod trade_v2;
pub mod sell;
pub mod buy;

use anchor_lang::prelude::*;
use crate::{GlobalConfig, Pool, PumpAmmError};

pub fn validate_protocol_fee_recipient(
    global_config: &Account<GlobalConfig>,
    protocol_fee_recipient: &AccountInfo,
    is_mayhem_mode: u8,
) -> Result<()> {
    let protocol_fee_recipient = protocol_fee_recipient.key();
    if is_mayhem_mode != 0 {
        if protocol_fee_recipient == global_config.reserved_fee_recipient.key()
            || global_config.reserved_fee_recipients.contains(&protocol_fee_recipient)
        {
            return Ok(());
        }
    } else if global_config.protocol_fee_recipients.binary_search(&protocol_fee_recipient).is_ok() {
        return Ok(());
    }
    err!(PumpAmmError::InvalidProtocolFeeRecipient)
}
pub mod multi_hop_swap;


pub fn prepare_pool<'info>(
    pool: &Account<'info, Pool>,
    system_program: &AccountInfo<'info>,
    payer: &AccountInfo<'info>,
) -> Result<()> {
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


