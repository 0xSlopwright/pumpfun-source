pub mod trade_v2;
pub mod sell;
pub mod buy;

use anchor_lang::prelude::*;
use crate::{GlobalConfig, PumpAmmError};

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
