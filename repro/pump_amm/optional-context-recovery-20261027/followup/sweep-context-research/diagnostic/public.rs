use anchor_lang::prelude::*;
pub struct AccountsData { pub value: u64 }
#[derive(Default, Debug)]
pub struct BumpData { pub recipient_token_account: u8, pub event_authority: u8 }
impl anchor_lang::Bumps for AccountsData { type Bumps = BumpData; }
mod instructions {
    pub mod sweep_fees {
        use crate::*;
        #[inline(never)]
        pub fn handler(ctx: Context<AccountsData>, amount: u64) -> u64 {
            ctx.accounts.value.wrapping_add(amount).wrapping_add(ctx.bumps.event_authority as u64)
        }
    }
}
pub fn call(ctx: Context<AccountsData>, amount: u64) -> u64 {
    instructions::sweep_fees::handler(ctx, amount)
}

pub use instructions::sweep_fees;
