use crate::*;

pub(crate) fn validate_pool_v2(
    remaining_accounts: &[AccountInfo<'_>],
    base_mint: &Pubkey,
    index: usize,
) -> Result<()> {
    require!(index < remaining_accounts.len(), PumpAmmError::InvalidPoolV2);
    let expected = Pubkey::find_program_address(&[b"pool-v2", base_mint.as_ref()], &crate::ID).0;
    require!(remaining_accounts[index].key() == expected, PumpAmmError::InvalidPoolV2);
    Ok(())
}
