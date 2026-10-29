use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token_interface::{Mint,TokenAccount,TokenInterface}}; use crate::GlobalParams;

















#[account]
pub struct FeeRecipient {
 pub bump:u8,pub index:u8,
 pub field_10:u64,pub field_18:u64,pub field_26:u64,pub field_34:u64,
}




















impl FeeRecipient {
    pub fn validate_sweep(&mut self, global_params:&GlobalParams, native:bool)->Result<()> {
        let current_time = Clock::get().unwrap().unix_timestamp;






        let last = if native {self.field_10}else{self.field_34} as i64;
        let interval = global_params.field_10 as i64;
        if last != 0 && interval != 0 {

            let next_time =    last + interval;


            require!(current_time >= next_time, crate::MayhemError::SweepFeeRateLimit);
        }
        if native {self.field_10=current_time as u64;}else{self.field_34=current_time as u64;}
        Ok(())
    }
}






#[derive(Accounts)]
#[instruction(index: u8)]
pub struct InitializeFeeRecipient<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub wsol_mint: InterfaceAccount<'info, Mint>,
    #[account(init, payer = admin, space = 42, seeds = [b"fee-recipient".as_ref(), &[index]], bump)]
    pub fee_recipient: Account<'info, FeeRecipient>,
    #[account(init_if_needed, payer = admin, associated_token::mint = wsol_mint, associated_token::authority = fee_recipient, associated_token::token_program = token_program)]
    pub fee_recipient_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, seeds = [b"global-params"], bump)]
    pub global_params: Account<'info, GlobalParams>,
    pub system_program: Program<'info,System>,
    #[account(address = anchor_spl::token::ID)]
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}






























































































pub fn initialize(ctx: Context<InitializeFeeRecipient>, index:u8)->Result<()> {
    require_gt!(8,index,crate::MayhemError::MaxFeeRecipientsExceeded);
    ctx.accounts.fee_recipient.bump=ctx.bumps.fee_recipient;
    ctx.accounts.fee_recipient.index=index;
    ctx.accounts.fee_recipient.field_10=0;
    ctx.accounts.fee_recipient.field_18=0;
    ctx.accounts.fee_recipient.field_26=0;
    ctx.accounts.fee_recipient.field_34=0;
    Ok(())
}








































































































impl FeeRecipient {
    #[inline(always)]
    pub fn record_trader_sweep(&mut self, amount:u64, native:bool) {
        if native {
                self.field_18 += amount;
        } else {

                self.field_26 += amount;
        }
    }
}





























































impl FeeRecipient {
    #[inline(always)]
    pub fn record_admin_sweep(&mut self, amount:u64, native:bool) {
        if native {
                self.field_18 += amount;
        } else {

                self.field_26 += amount;
        }
    }
}
