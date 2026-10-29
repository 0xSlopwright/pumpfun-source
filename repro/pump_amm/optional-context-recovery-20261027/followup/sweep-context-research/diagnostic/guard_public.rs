use anchor_lang::prelude::*;
pub struct AccountsData { pub value: u64, pub recipient: Pubkey }
#[derive(Default, Debug)]
pub struct BumpData { pub recipient_token_account: u8, pub event_authority: u8 }
impl anchor_lang::Bumps for AccountsData { type Bumps = BumpData; }
mod instructions {
 pub mod sweep_fees {
  use crate::*;
  pub fn handler(ctx: Context<AccountsData>, creator: bool) -> Result<u64> {
   require_keys_neq!(ctx.accounts.recipient, Pubkey::default(), anchor_lang::error::ErrorCode::ConstraintRaw);
   Ok(ctx.accounts.value.wrapping_add(creator as u64).wrapping_add(ctx.bumps.event_authority as u64))
  }
 }
}
pub fn instantiated(value: u64, bump: u8, recipient: Pubkey, creator: bool) -> Result<u64> {
 let mut accounts = AccountsData { value, recipient };
 let program_id = Pubkey::default();
 let ctx = Context { program_id: &program_id, accounts: &mut accounts,
  remaining_accounts: &[], bumps: BumpData { recipient_token_account: 0, event_authority: bump } };
 instructions::sweep_fees::handler(ctx, creator)
}

pub use instructions::sweep_fees;
