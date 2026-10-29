use anchor_lang::prelude::*;
use std::marker::PhantomData;

use crate::trade_types::{BondingCurve, Fees};
use anchor_spl::token_interface::Mint;

/// Checked normal-buy quote calculation precedes the fee CPI.
pub fn buy_quote(curve: &BondingCurve, amount: u64) -> Result<u64> {
    let denominator = curve.virtual_token_reserves.checked_sub(amount)
        .ok_or_else(|| error!(crate::PumpError::Overflow))?;
    require!(denominator != 0, crate::PumpError::DivisionByZero);
    let quote = u128::from(amount) * u128::from(curve.virtual_quote_reserves)
        / u128::from(denominator) + 1;
    u64::try_from(quote).map_err(|_| error!(crate::PumpError::Truncation))
}

/// The context is constructed before the fallible market-cap calculation.
/// Its account clones are therefore dropped on both calculation and CPI errors.
pub fn query_fees<'a, 'b, 'c, 'info>(
    ctx: CpiContext<'a, 'b, 'c, 'info, GetFeesWithQuoteMint<'info>>,
    curve: &BondingCurve,
    mint: &Mint,
) -> Result<Fees> {
    let cap = market_cap(curve, mint)?;
    Ok(get_fees_with_quote_mint(ctx, true, cap, curve.quote_mint)?.get())
}

fn market_cap(curve: &BondingCurve, mint: &Mint) -> Result<u128> {
    require!(curve.virtual_token_reserves != 0, crate::PumpError::DivisionByZero);
    let supply = if curve.is_mayhem_mode {
        curve.token_total_supply
    } else {
        mint.supply
    };
    Ok(u128::from(supply) * u128::from(curve.virtual_quote_reserves)
        / u128::from(curve.virtual_token_reserves))
}

// Use Anchor's generated CPI account implementation, including its fixed
// readonly/non-signer account metas, rather than transaction account flags.
mod definition {
    use super::*;

    #[derive(Accounts)]
    pub struct GetFeesWithQuoteMint<'info> {
        /// CHECK: the fee program validates its configuration.
        pub fee_config: AccountInfo<'info>,
        /// CHECK: namespace passed to the fee program.
        pub config_program_id: AccountInfo<'info>,
    }
}

pub(crate) use definition::__cpi_client_accounts_get_fees_with_quote_mint::GetFeesWithQuoteMint;

#[derive(AnchorSerialize)]
struct GetFeesWithQuoteMintArgs {
    is_pump_pool: bool,
    market_cap_lamports: u128,
    quote_mint: Pubkey,
}

/// The Anchor CPI return API consumes the entire serialized return value.
pub struct Return<T> {
    phantom: PhantomData<T>,
}

impl<T: AnchorDeserialize> Return<T> {
    pub fn get(&self) -> T {
        let (_key, data) = anchor_lang::solana_program::program::get_return_data().unwrap();
        T::try_from_slice(&data).unwrap()
    }
}

pub fn get_fees_with_quote_mint<'a, 'b, 'c, 'info>(
    ctx: CpiContext<'a, 'b, 'c, 'info, GetFeesWithQuoteMint<'info>>,
    is_pump_pool: bool,
    market_cap_lamports: u128,
    quote_mint: Pubkey,
) -> Result<Return<Fees>> {
    let ix = {
        let args = GetFeesWithQuoteMintArgs {
            is_pump_pool,
            market_cap_lamports,
            quote_mint,
        };
        let mut data = Vec::with_capacity(256);
        data.extend_from_slice(&[154, 237, 138, 92, 162, 2, 162, 187]);
        AnchorSerialize::serialize(&args, &mut data)
            .map_err(|_| anchor_lang::error::ErrorCode::InstructionDidNotSerialize)?;
        anchor_lang::solana_program::instruction::Instruction {
            program_id: ctx.program.key(),
            accounts: ctx.to_account_metas(None),
            data,
        }
    };
    let acc_infos = ctx.to_account_infos();
    anchor_lang::solana_program::program::invoke_signed(&ix, &acc_infos, ctx.signer_seeds)
        .map_or_else(|e| Err(Into::into(e)), |_| Ok(Return { phantom: PhantomData }))
}
