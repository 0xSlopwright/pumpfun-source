use anchor_lang::prelude::*;
pub struct AccountsData { pub value: u64 }
#[derive(Default, Debug)]
pub struct BumpData { pub user_volume_accumulator: u8, pub event_authority: u8 }
impl anchor_lang::Bumps for AccountsData { type Bumps = BumpData; }
mod instructions {
    pub mod trade_v2 {
        use crate::*;
        #[inline(never)]
        pub fn handler(ctx: Context<AccountsData>, amount: u64) -> u64 {
            ctx.accounts.value.wrapping_add(amount).wrapping_add(ctx.bumps.event_authority as u64)
        }
    }
}
pub fn call(ctx: Context<AccountsData>, amount: u64) -> u64 {
    instructions::trade_v2::handler(ctx, amount)
}
