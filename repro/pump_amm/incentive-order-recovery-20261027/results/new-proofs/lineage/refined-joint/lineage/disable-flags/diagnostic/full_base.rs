use anchor_lang::prelude::*;
use pump_amm_recovered::AdminGlobal;
pub use pump_amm_recovered::ID;
#[event]
#[derive(Clone)]
pub struct DisableEvent {
    pub timestamp: i64,
    pub admin: Pubkey,
    pub disable_create_pool: bool,
    pub disable_deposit: bool,
    pub disable_withdraw: bool,
    pub disable_buy: bool,
    pub disable_sell: bool,
}
pub fn disable(ctx: Context<AdminGlobal>, disable_create_pool: bool,
        disable_deposit: bool, disable_withdraw: bool,
        disable_buy: bool, disable_sell: bool) -> Result<()> {
        let flags = &mut ctx.accounts.global_config.disable_flags;
        *flags = (*flags & !1) | u8::from(disable_create_pool);
        *flags = (*flags & !2) | (u8::from(disable_deposit) << 1);
        *flags = (*flags & !4) | (u8::from(disable_withdraw) << 2);
        *flags = (*flags & !8) | (u8::from(disable_buy) << 3);
        *flags = (*flags & !16) | (u8::from(disable_sell) << 4);
        let event = DisableEvent { timestamp: Clock::get()?.unix_timestamp,
            admin: ctx.accounts.admin.key(), disable_create_pool,
            disable_deposit, disable_withdraw, disable_buy, disable_sell };
        emit!(event.clone());
        emit_cpi!(event);
        Ok(())
    }
