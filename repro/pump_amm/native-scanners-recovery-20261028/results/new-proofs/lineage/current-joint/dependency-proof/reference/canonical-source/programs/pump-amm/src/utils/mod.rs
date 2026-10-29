pub mod math;
pub mod token;

pub mod transfer_fee;

/// Canonical Pump authority for pools created from a bonding curve.
pub fn pool_authority(base_mint: &anchor_lang::prelude::Pubkey) -> anchor_lang::prelude::Pubkey {
    let seeds: &[&[u8]] = &[b"pool-authority", base_mint.as_ref()];
    anchor_lang::prelude::Pubkey::find_program_address(seeds, &crate::trade::PUMP).0
}

/// Pump bonding curve account associated with a base mint.
pub fn bonding_curve(base_mint: &anchor_lang::prelude::Pubkey) -> anchor_lang::prelude::Pubkey {
    let seeds: &[&[u8]] = &[b"bonding-curve", base_mint.as_ref()];
    anchor_lang::prelude::Pubkey::find_program_address(seeds, &crate::trade::PUMP).0
}

pub mod quote;
