use anchor_lang::prelude::*;
use pump_amm_recovered::boost::InitBoost;
pub fn quote_program_pointer<'info>(accounts: &InitBoost<'info>) -> *const AccountInfo<'info> {
    accounts.quote_token_program.as_ref()
}
