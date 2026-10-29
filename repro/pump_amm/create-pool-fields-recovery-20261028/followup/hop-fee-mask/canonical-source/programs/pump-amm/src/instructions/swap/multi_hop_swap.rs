//! Partial reconstruction from captured AMM execution and static control flow.
//! Ordinary signed offline fixtures cover AMM legs and genuine captured Pump CPIs;
//! this is not the historical source or a claim of whole-program equivalence.
use anchor_lang::{
    accounts::{
        account::Account,
        interface_account::InterfaceAccount,
        program::Program,
        signer::Signer,
        unchecked_account::UncheckedAccount,
    },
    prelude::{
        AccountInfo, Clock, Context, CpiContext, Id, Key, Pubkey, Rent, Result,
        SolanaSysvar, System, ToAccountInfo,
    },
    solana_program::{
        instruction::{AccountMeta, Instruction},
        program::invoke_signed,
    },
    AccountDeserialize, Accounts, AccountsExit,
    err, error, require, require_eq, require_gt, require_gte, require_keys_eq, require_keys_neq,
};
use anchor_spl::{
    token::Token,
    token_2022::Token2022,
    token_interface::{self, Mint, TokenAccount},
};
use crate::{
    quote_transfer_fee,
    state::{GlobalConfig, Pool, UserVolumeAccumulator},
    trade::{BuyEvent, SellEvent, FEE_OWNER, PUMP, PumpAmmProgram, TradeFeeConfig},
    PumpAmmError,
};
use std::collections::BTreeSet;

pub struct PumpProgram;
impl Id for PumpProgram {
    fn id() -> Pubkey {
        PUMP
    }
}

#[derive(Accounts)]
pub struct AmmHop<'info> {
    pub base_mint: Box<InterfaceAccount<'info, Mint>>,
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut,
        has_one = base_mint @ PumpAmmError::InvalidBaseMint,
        has_one = quote_mint @ PumpAmmError::InvalidQuoteMint,
        has_one = pool_base_token_account @ PumpAmmError::InvalidPoolBaseTokenAccount,
        has_one = pool_quote_token_account @ PumpAmmError::InvalidPoolQuoteTokenAccount,
    )]
    pub pool: Box<Account<'info, Pool>>,
    #[account(mut)]
    pub pool_base_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub pool_quote_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
}

/// Fee endpoints carried together through an AMM leg.
#[derive(Clone, Copy)]
pub struct HopFeeGates {
    pub protocol: bool,
    pub creator: bool,
    pub lp: bool,
}

#[derive(Accounts)]
pub struct MultiHop<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_in_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub user_out_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(seeds=[b"global_config"],bump)]
    pub global_config: Box<Account<'info, GlobalConfig>>,
    #[account(seeds=[b"fee_config",crate::ID.as_ref()],bump=fee_config.bump,seeds::program=FEE_OWNER)]
    pub fee_config: Box<Account<'info, TradeFeeConfig>>,
    #[account(init_if_needed,payer=user,space=137,seeds=[b"user_volume_accumulator",user.key().as_ref()],bump)]
    pub user_volume_accumulator: Box<Account<'info, UserVolumeAccumulator>>,
    /// CHECK: Validated at a protocol-fee endpoint or by the captured Pump CPI.
    #[account(mut)]
    pub buyback_fee_recipient: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub token_2022_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    /// CHECK: Self-event PDA.
    #[account(seeds=[b"__event_authority"],bump)]
    pub event_authority: AccountInfo<'info>,
    pub program: Program<'info, PumpAmmProgram>,
    pub pump_program: Program<'info, PumpProgram>,
    /// CHECK: Forwarded unchanged to Pump, which validates its context.
    pub pump_global: UncheckedAccount<'info>,
    /// CHECK: Forwarded unchanged to Pump, which validates its context.
    pub pump_fee_config: UncheckedAccount<'info>,
    /// CHECK: Forwarded unchanged to Pump, which validates its context.
    pub pump_event_authority: UncheckedAccount<'info>,
}

pub struct HopFeeContext<'a, 'info> {
    pub pool: &'a Box<Account<'info, Pool>>,
    pub global_config: &'a Account<'info, GlobalConfig>,
    pub accounts: &'a MultiHop<'info>,
    pub fee_config_len: &'a usize,
    pub base_supply: &'a u64,
    pub base_reserve: &'a u64,
    pub quote_reserve: &'a u64,
    pub gates: &'a HopFeeGates,
}

fn checked64(n: u128) -> Result<u64> {
    u64::try_from(n).map_err(|_| error!(PumpAmmError::Truncation))
}
fn fee(n: u64, bps: u64) -> Result<u64> {
    checked64(((n as u128) * (bps as u128) + 9999) / 10000)
}
fn token_amount(a: &AccountInfo) -> Result<u64> {
    let data = a.try_borrow_data()?;
    let account = TokenAccount::try_deserialize(&mut &data[..])?;
    Ok(account.amount)
}
fn program_for<'info>(
    a: &MultiHop<'info>,
    mint: &InterfaceAccount<'info, Mint>,
) -> Result<AccountInfo<'info>> {
    let owner = mint.to_account_info().owner;
    if *owner == anchor_spl::token_2022::ID {
        Ok(a.token_2022_program.to_account_info())
    } else if *owner == anchor_spl::token::ID {
        Ok(a.token_program.to_account_info())
    } else {
        err!(PumpAmmError::AccountTypeNotSupported)
    }
}
fn pool_seed_parts(pool: &Pool) -> Vec<Vec<u8>> {
    vec![
        b"pool".to_vec(),
        pool.index.to_le_bytes().to_vec(),
        pool.creator.to_bytes().to_vec(),
        pool.base_mint.to_bytes().to_vec(),
        pool.quote_mint.to_bytes().to_vec(),
        vec![pool.pool_bump],
    ]
}
fn transfer<'info>(
    program: AccountInfo<'info>,
    mint: AccountInfo<'info>,
    from: AccountInfo<'info>,
    to: AccountInfo<'info>,
    authority: AccountInfo<'info>,
    amount: u64,
    decimals: u8,
    seeds: &[Vec<u8>],
) -> Result<()> {
    if amount == 0 {
        return Ok(());
    }
    if from.key() == to.key() {
        let state = TokenAccount::try_deserialize(&mut &from.try_borrow_data()?[..])?;
        require_keys_eq!(
            state.owner,
            authority.key(),
            PumpAmmError::SelfTransferNotAllowed
        );
    }
    let refs: Vec<&[u8]> = seeds.iter().map(|s| s.as_slice()).collect();
    let signers = [refs.as_slice()];
    token_interface::transfer_checked(
        CpiContext::new_with_signer(
            program,
            token_interface::TransferChecked {
                from,
                to,
                mint,
                authority,
            },
            if seeds.is_empty() { &[] } else { &signers },
        ),
        amount,
        decimals,
    )
}
fn emit_event<'info, T: anchor_lang::Event + Clone>(a: &MultiHop<'info>, event: T) -> Result<()> {
    anchor_lang::solana_program::log::sol_log_data(&[&event.data()]);
    let data = [
        vec![0xe4, 0x45, 0xa5, 0x2e, 0x51, 0xcb, 0x9a, 0x1d],
        event.data(),
    ]
    .concat();
    let bump = Pubkey::find_program_address(&[b"__event_authority"], &crate::ID).1;
    invoke_signed(
        &Instruction {
            program_id: crate::ID,
            accounts: vec![AccountMeta::new_readonly(a.event_authority.key(), true)],
            data,
        },
        &[
            a.event_authority.to_account_info(),
            a.program.to_account_info(),
        ],
        &[&[b"__event_authority", &[bump]]],
    )?;
    Ok(())
}

#[inline(never)]
pub fn apply_hop_fees(context: HopFeeContext, amount: u64) -> Result<crate::curve::fees::AppliedFees> {
    let fees = crate::curve::fees::select_and_apply_v2(
        context.pool, context.global_config, &context.accounts.fee_config,
        *context.fee_config_len, *context.base_supply, *context.base_reserve,
        *context.quote_reserve, amount,
    )?;
    let creator_mask = 0u64.wrapping_sub(u64::from(context.gates.creator));
    let lp_mask = 0u64.wrapping_sub(u64::from(context.gates.lp));
    let protocol_mask = 0u64.wrapping_sub(u64::from(context.gates.protocol));
    Ok(crate::curve::fees::AppliedFees {
        lp_fee_bps: fees.lp_fee_bps & lp_mask,
        protocol_fee_bps: fees.protocol_fee_bps & protocol_mask,
        creator_fee_bps: fees.creator_fee_bps & creator_mask,
        lp_fee: fees.lp_fee & lp_mask,
        protocol_fee: fees.protocol_fee & protocol_mask,
        creator_fee: fees.creator_fee & creator_mask,
    })
}

fn vault_for_mint<'info>(
    accounts: &[AccountInfo<'info>],
    mint: &Pubkey,
) -> Result<AccountInfo<'info>> {
    let account = if accounts[1].key() == *mint {
        &accounts[4]
    } else if accounts[0].key() == *mint {
        &accounts[3]
    } else {
        return err!(PumpAmmError::MultiHopDiscontinuousPath);
    };
    Ok(account.clone())
}

fn is_curve_hop(accounts: &[AccountInfo]) -> Result<bool> {
    let owner = accounts[2].owner;
    if *owner == crate::ID {
        Ok(false)
    } else if *owner == PUMP {
        Ok(true)
    } else {
        err!(PumpAmmError::AccountTypeNotSupported)
    }
}

pub fn execute<'info>(
    ctx: Context<'_, '_, 'info, 'info, MultiHop<'info>>,
    amount: u64,
    minimum: u64,
) -> Result<()> {
    let a = &mut *ctx.accounts;
    require_gt!(amount,0, PumpAmmError::ZeroQuoteAmount);
    require_gt!(minimum,0, PumpAmmError::ZeroBaseAmount);
    let remaining = ctx.remaining_accounts;
    require!(
        !remaining.is_empty() && remaining.len() % 5 == 0,
        PumpAmmError::NotEnoughRemainingAccounts
    );
    let count = remaining.len() / 5;
    let mut current_mint = a.user_in_token_account.mint;
    let mut hop_output_mints = Vec::with_capacity(count);
    let mut sell = None;
    for group in remaining.chunks(5) {
        let next_sell = if current_mint == group[1].key() {
            current_mint = group[0].key();
            false
        } else if current_mint == group[0].key() {
            current_mint = group[1].key();
            true
        } else {
            return err!(PumpAmmError::MultiHopDiscontinuousPath);
        };
        if let Some(old) = sell {
            require!(old == next_sell, PumpAmmError::MultiHopMixedDirection);
        } else {
            sell = Some(next_sell);
        }
        hop_output_mints.push(current_mint);
    }
    require_keys_eq!(
        current_mint,
        a.user_out_token_account.mint,
        PumpAmmError::MultiHopDiscontinuousPath
    );
    let sell = sell.ok_or_else(|| error!(PumpAmmError::NotEnoughRemainingAccounts))?;
    let mut i = 0;
    let mut current = amount;
    let mut source = a.user_in_token_account.to_account_info();
    let mut authority = a.user.to_account_info();
    let mut source_seeds: Vec<Vec<u8>> = vec![];
    let mut prepaid = false;
    while i < count {
        let group = &remaining[i * 5..(i + 1) * 5];
        if is_curve_hop(group)? {
            let start = i;
            i += 1;
            while i < count && is_curve_hop(&remaining[i * 5..(i + 1) * 5])? {
                i += 1;
            }
            let current_mint = hop_output_mints[i.saturating_sub(1)];
            let destination = if i == count {
                a.user_out_token_account.to_account_info()
            } else {
                vault_for_mint(&remaining[i * 5..(i + 1) * 5], &current_mint)?
            };
            let before = token_amount(&destination)?;
            let source_before = token_amount(&source)?;
            let input_native = !sell
                && remaining[start * 5 + 1].key() == anchor_spl::token::spl_token::native_mint::ID;
            let output_native = sell
                && remaining[(i - 1) * 5 + 1].key()
                    == anchor_spl::token::spl_token::native_mint::ID;
            let flags: Vec<u8> = (start..i)
                .map(|j| {
                    let protocol = if sell { j + 1 == count } else { j == 0 };
                    let creator = if sell { j == 0 } else { j + 1 == count };
                    (protocol as u8) | ((creator as u8) << 1)
                })
                .collect();
            let bump = [ctx.bumps.global_config];
            let config_seeds: &[&[u8]] = &[b"global_config", &bump];
            let refs: Vec<&[u8]> = source_seeds.iter().map(|v| v.as_slice()).collect();
            let cpi_program = a.pump_program.to_account_info();
            let cpi_accounts = crate::pump::cpi::accounts::MultiHopCurveSwap {
                global: a.pump_global.to_account_info(),
                fee_config: a.pump_fee_config.to_account_info(),
                pump_amm_global_config: a.global_config.to_account_info(),
                user: a.user.to_account_info(),
                source_authority: authority.clone(),
                source: source.clone(),
                destination: destination.clone(),
                buyback_fee_recipient: a.buyback_fee_recipient.to_account_info(),
                token_program: a.token_program.to_account_info(),
                token_2022_program: a.token_2022_program.to_account_info(),
                system_program: a.system_program.to_account_info(),
                event_authority: a.pump_event_authority.to_account_info(),
                program: a.pump_program.to_account_info(),
            };
            let cpi_remaining = remaining[start * 5..i * 5].to_vec();
            let result = if refs.is_empty() {
                crate::pump::cpi::multi_hop_curve_swap(
                    CpiContext::new_with_signer(cpi_program, cpi_accounts, &[config_seeds])
                        .with_remaining_accounts(cpi_remaining),
                    current,
                    flags,
                )?.get()
            } else {
                crate::pump::cpi::multi_hop_curve_swap(
                    CpiContext::new_with_signer(cpi_program, cpi_accounts, &[config_seeds, refs.as_slice()])
                        .with_remaining_accounts(cpi_remaining),
                    current,
                    flags,
                )?.get()
            };
            let output = result.amount_out;
            let buyback = result.buyback_fee;
            if !input_native {
                let expected = source_before
                    .checked_sub(current)
                    .and_then(|v| {
                        v.checked_add(if source.key() == destination.key() {
                            output
                        } else {
                            0
                        })
                    })
                    .and_then(|v| {
                        v.checked_add(if source.key() == a.buyback_fee_recipient.key() {
                            buyback
                        } else {
                            0
                        })
                    })
                    .ok_or_else(|| error!(PumpAmmError::Overflow))?;
                require_eq!(
                    token_amount(&source)?, expected,
                    PumpAmmError::MultiHopCurveRunMismatch
                );
            }
            if !output_native && source.key() != destination.key() {
                let expected = before
                    .checked_add(output)
                    .and_then(|v| {
                        v.checked_add(if destination.key() == a.buyback_fee_recipient.key() {
                            buyback
                        } else {
                            0
                        })
                    })
                    .ok_or_else(|| error!(PumpAmmError::Overflow))?;
                require_eq!(
                    token_amount(&destination)?, expected,
                    PumpAmmError::MultiHopCurveRunMismatch
                );
            }
            current = output;
            source = destination;
            prepaid = true;
            source_seeds.clear();
        } else {
            let mut slice = group;
            let mut bumps = AmmHopBumps {};
            let mut reallocs = BTreeSet::new();
            let mut hop =
                AmmHop::try_accounts(&crate::ID, &mut slice, &[], &mut bumps, &mut reallocs)?;
            current = amm_hop(
                a,
                &mut hop,
                current,
                if i + 1 == count { minimum } else { 0 },
                sell,
                i == 0,
                i + 1 == count,
                prepaid,
                &source,
                &authority,
                &source_seeds,
            )?;
            hop.exit(&crate::ID)?;
            source = if sell {
                hop.pool_quote_token_account.to_account_info()
            } else {
                hop.pool_base_token_account.to_account_info()
            };
            authority = hop.pool.to_account_info();
            source_seeds = pool_seed_parts(&hop.pool);
            prepaid = false;
            i += 1;
        }
    }
    require_gte!(current,minimum, PumpAmmError::ExceededSlippage);
    if a.user_volume_accumulator.user == Pubkey::default() {
        a.user_volume_accumulator.user = a.user.key();
    }
    Ok(())
}
fn amount_bytes(n: u64) -> [u8; 8] {
    n.to_le_bytes()
}

/// Apply this AMM hop's fee accounting before its optional endpoint payout.
pub fn accrue_hop_fees<'info>(
    global_config: &Account<'info, GlobalConfig>,
    recipient: &AccountInfo<'info>,
    hop: &mut AmmHop<'info>,
    token_program: &AccountInfo<'info>,
    protocol_fee: u64,
    creator_fee: u64,
    gates: HopFeeGates,
) -> Result<u64> {
    let buyback_fee = hop.pool.accrue_fees(global_config, protocol_fee, creator_fee)?;
    if gates.protocol {
        crate::utils::token::transfer_from_pool_to_raw(
            token_program, &hop.quote_mint, &hop.pool_quote_token_account,
            &hop.pool, recipient, buyback_fee,
        )?;
    }
    Ok(buyback_fee)
}

#[inline(never)]
fn amm_hop<'info>(
    a: &MultiHop<'info>,
    h: &mut AmmHop<'info>,
    amount: u64,
    minimum: u64,
    sell: bool,
    first: bool,
    last: bool,
    prepaid: bool,
    source: &AccountInfo<'info>,
    source_authority: &AccountInfo<'info>,
    source_seeds: &[Vec<u8>],
) -> Result<u64> {
    require!(
        a.global_config.disable_flags & (if sell { 16 } else { 8 }) == 0,
        if sell {
            PumpAmmError::DisabledSell
        } else {
            PumpAmmError::DisabledBuy
        }
    );
    let canonical =
        Pubkey::find_program_address(&[b"pool-authority", h.base_mint.key().as_ref()], &PUMP).0;
    require!(h.pool.creator == canonical, PumpAmmError::OnlyPumpPools);
    require!(
        !h.pool.is_cashback_coin,
        PumpAmmError::CashbackCoinNotSupported
    );
    require!(!h.pool.is_mayhem_mode, PumpAmmError::MayhemPoolNotSupported);
    crate::instructions::swap::prepare_pool(
        &h.pool, a.system_program.as_ref(), a.user.as_ref(),
    )?;
    let base_program = program_for(a, &h.base_mint)?;
    let quote_program = program_for(a, &h.quote_mint)?;
    let gates = HopFeeGates {
        protocol: if sell { last } else { first },
        lp: if sell { first } else { last },
        creator: if sell { first } else { last },
    };
    if gates.protocol {
        crate::instructions::swap::trade_v2::validate_buyback_token_account(
            &a.global_config, a.buyback_fee_recipient.as_ref(), &h.quote_mint.key(), &quote_program.key(),
        )?;
    }
    let user_input_balance = if first {
        a.user_in_token_account.amount
    } else {
        0
    };
    let user_output_balance = if last {
        token_amount(&a.user_out_token_account.to_account_info())?
    } else {
        0
    };
    let input_mint = if sell {
        h.base_mint.to_account_info()
    } else {
        h.quote_mint.to_account_info()
    };
    let input_program = if sell {
        base_program.clone()
    } else {
        quote_program.clone()
    };
    let input_decimals = if sell {
        h.base_mint.decimals
    } else {
        h.quote_mint.decimals
    };
    let input_vault = if sell {
        h.pool_base_token_account.to_account_info()
    } else {
        h.pool_quote_token_account.to_account_info()
    };
    if !prepaid && (first || source.key() != input_vault.key()) {
        transfer(
            input_program,
            input_mint,
            source.clone(),
            input_vault,
            source_authority.clone(),
            amount,
            input_decimals,
            source_seeds,
        )?;
    }
    h.pool_base_token_account.reload()?;
    h.pool_quote_token_account.reload()?;
    let input_tf = if sell {
        0
    } else {
        quote_transfer_fee(&h.quote_mint.to_account_info(), amount, false)?
    };
    let received = amount.checked_sub(input_tf).ok_or_else(|| error!(PumpAmmError::Overflow))?;
    let b = if sell {
        h.pool_base_token_account
            .amount
            .checked_sub(amount)
            .ok_or_else(|| error!(PumpAmmError::Overflow))?
    } else {
        h.pool_base_token_account.amount
    };
    let raw_q = if sell {
        h.pool_quote_token_account.amount
    } else {
        h.pool_quote_token_account
            .amount
            .checked_sub(received)
            .ok_or_else(|| error!(PumpAmmError::Overflow))?
    };
    let old_virtual = h.pool.virtual_quote_reserves;
    let (real_quote_reserves, q) = crate::instructions::swap::trade_v2::quote_reserves(&h.pool, raw_q)?;
    let old_accrued = h
        .pool
        .protocol_fees
        .checked_add(h.pool.creator_fees)
        .ok_or_else(|| error!(PumpAmmError::Overflow))?;
    let can_boost = old_virtual
        .checked_add(old_accrued as i128)
        .ok_or_else(|| error!(PumpAmmError::Overflow))?
        != 0;
    // Fee selection uses the reserves before the already-completed input transfer.
    let fee_quote = if sell {
        crate::curve::constant_product::quote_for_sell(amount, b, q)?
    } else {
        received
    };
    let fee_config_len = a.fee_config.to_account_info().data_len();
    let base_supply = h.base_mint.supply;
    let selected = apply_hop_fees(HopFeeContext {
        pool: &h.pool, global_config: &a.global_config, accounts: a,
        fee_config_len: &fee_config_len, base_supply: &base_supply,
        base_reserve: &b, quote_reserve: &q, gates: &gates,
    }, fee_quote)?;
    let initial_lp_fee = selected.lp_fee;
    let initial_protocol_fee = selected.protocol_fee;
    let initial_creator_fee = selected.creator_fee;
    let creator_bps = if h.pool.coin_creator == Pubkey::default() {
        0
    } else {
        selected.creator_fee_bps
    };
    let (base_amount, curve_quote, lp_fee, protocol_fee, creator_fee, total_quote) = if sell {
        let curve = fee_quote;
        let l = initial_lp_fee;
        let p = initial_protocol_fee;
        let c = initial_creator_fee;
        let (_, total) = crate::instructions::swap::trade_v2::calculate_sell_quote(
            curve,
            &crate::curve::fees::AppliedFees {
                lp_fee_bps: selected.lp_fee_bps,
                protocol_fee_bps: selected.protocol_fee_bps,
                creator_fee_bps: selected.creator_fee_bps,
                lp_fee: l,
                protocol_fee: p,
                creator_fee: c,
            },
            real_quote_reserves,
        )?;
        require_gt!(total,0, PumpAmmError::ZeroQuoteAmount);
        (amount, curve, l, p, c, total)
    } else {
        let total_fee_bps = selected.lp_fee_bps
            .saturating_add(selected.protocol_fee_bps)
            .saturating_add(creator_bps);
        let sum = 10000u128 + total_fee_bps as u128;
        let estimate = checked64((received as u128) * 10000 / sum)?;
        require_gt!(
            estimate,0,
            PumpAmmError::BuyNotEnoughQuoteTokensToCoverFees
        );
        let l = fee(estimate, selected.lp_fee_bps)?;
        let p = fee(estimate, selected.protocol_fee_bps)?;
        let c = fee(estimate, creator_bps)?;
        let total = estimate
            .checked_add(l)
            .and_then(|v| v.checked_add(p))
            .and_then(|v| v.checked_add(c))
            .ok_or(PumpAmmError::Overflow)?;
        let excess = total.saturating_sub(received);
        let adjusted_estimate = estimate
            .checked_sub(excess)
            .ok_or(PumpAmmError::BuyNotEnoughQuoteTokensToCoverFees)?;
        require_gt!(
            adjusted_estimate,0,
            PumpAmmError::BuySlippageBelowMinBaseAmountOut
        );
        let curve = received
            .checked_sub(l)
            .and_then(|v| v.checked_sub(p))
            .and_then(|v| v.checked_sub(c))
            .ok_or(PumpAmmError::BuyNotEnoughQuoteTokensToCoverFees)?;
        let out = crate::curve::constant_product::base_for_quote(curve, b, q)?;
        require_gt!(out,0, PumpAmmError::ZeroBaseAmount);
        (out, curve, l, p, c, curve + l + p + c)
    };
    let buyback_bps = a.global_config.buyback_basis_points;
    let quote_transfer_fee = if sell {
        crate::quote_transfer_fee(&h.quote_mint.to_account_info(), total_quote, false)?
    } else {
        input_tf
    };
    let output = if sell {
        total_quote
            .checked_sub(quote_transfer_fee)
            .ok_or(PumpAmmError::Overflow)?
    } else {
        base_amount
    };
    let seeds = pool_seed_parts(&h.pool);
    if last {
        if sell {
            transfer(
                quote_program.clone(),
                h.quote_mint.to_account_info(),
                h.pool_quote_token_account.to_account_info(),
                a.user_out_token_account.to_account_info(),
                h.pool.to_account_info(),
                total_quote,
                h.quote_mint.decimals,
                &seeds,
            )?;
        } else {
            transfer(
                base_program,
                h.base_mint.to_account_info(),
                h.pool_base_token_account.to_account_info(),
                a.user_out_token_account.to_account_info(),
                h.pool.to_account_info(),
                base_amount,
                h.base_mint.decimals,
                &seeds,
            )?;
        }
    }
    let buyback_fee = accrue_hop_fees(
        &a.global_config, a.buyback_fee_recipient.as_ref(), h, &quote_program,
        protocol_fee, creator_fee, gates,
    )?;
    let buyback_received = buyback_fee
        .checked_sub(crate::quote_transfer_fee(
            &h.quote_mint.to_account_info(), buyback_fee, false,
        )?)
        .ok_or(PumpAmmError::Overflow)?;
    let user_base_balance = if sell {
        user_input_balance
    } else {
        user_output_balance
    };
    let user_quote_balance = if sell {
        user_output_balance
    } else {
        user_input_balance
    };
    let user_base = if sell && first {
        a.user_in_token_account.key()
    } else if !sell && last {
        a.user_out_token_account.key()
    } else {
        Pubkey::default()
    };
    let user_quote = if !sell && first {
        a.user_in_token_account.key()
    } else if sell && last {
        a.user_out_token_account.key()
    } else {
        Pubkey::default()
    };
    if sell {
        emit_event(
            a,
            SellEvent {
                timestamp: Clock::get()?.unix_timestamp,
                base_amount_in: base_amount,
                min_quote_amount_out: minimum,
                user_base_token_reserves: user_base_balance,
                user_quote_token_reserves: user_quote_balance,
                pool_base_token_reserves: b,
                pool_quote_token_reserves: raw_q,
                quote_amount_out: curve_quote,
                lp_fee_basis_points: selected.lp_fee_bps,
                lp_fee,
                protocol_fee_basis_points: selected.protocol_fee_bps,
                protocol_fee,
                quote_amount_out_without_lp_fee: curve_quote - lp_fee,
                user_quote_amount_out: total_quote,
                pool: h.pool.key(),
                user: a.user.key(),
                user_base_token_account: user_base,
                user_quote_token_account: user_quote,
                protocol_fee_recipient: Pubkey::default(),
                protocol_fee_recipient_token_account: Pubkey::default(),
                coin_creator: h.pool.coin_creator,
                coin_creator_fee_basis_points: selected.creator_fee_bps,
                coin_creator_fee: creator_fee,
                cashback_fee_basis_points: 0,
                cashback: 0,
                buyback_fee_basis_points: buyback_bps,
                buyback_fee: buyback_received,
                virtual_quote_reserves: old_virtual,
                can_boost,
                base_supply: h.base_mint.supply,
                holder_rewards_bps: if h.pool.is_holder_reward {
                    selected.creator_fee_bps
                } else {
                    0
                },
                holder_rewards: if h.pool.is_holder_reward {
                    creator_fee
                } else {
                    0
                },
                creator_fee_unclaimed: h.pool.creator_fees,
                quote_transfer_fee,
            },
        )?;
    } else {
        emit_event(
            a,
            BuyEvent {
                timestamp: Clock::get()?.unix_timestamp,
                base_amount_out: base_amount,
                max_quote_amount_in: amount,
                user_base_token_reserves: user_base_balance,
                user_quote_token_reserves: user_quote_balance,
                pool_base_token_reserves: b,
                pool_quote_token_reserves: raw_q,
                quote_amount_in: amount,
                lp_fee_basis_points: selected.lp_fee_bps,
                lp_fee,
                protocol_fee_basis_points: selected.protocol_fee_bps,
                protocol_fee,
                quote_amount_in_with_lp_fee: curve_quote + lp_fee,
                user_quote_amount_in: curve_quote,
                pool: h.pool.key(),
                user: a.user.key(),
                user_base_token_account: user_base,
                user_quote_token_account: user_quote,
                protocol_fee_recipient: Pubkey::default(),
                protocol_fee_recipient_token_account: Pubkey::default(),
                coin_creator: h.pool.coin_creator,
                coin_creator_fee_basis_points: selected.creator_fee_bps,
                coin_creator_fee: creator_fee,
                track_volume: false,
                total_unclaimed_tokens: a.user_volume_accumulator.total_unclaimed_tokens,
                total_claimed_tokens: a.user_volume_accumulator.total_claimed_tokens,
                current_sol_volume: a.user_volume_accumulator.current_sol_volume,
                last_update_timestamp: a.user_volume_accumulator.last_update_timestamp,
                min_base_amount_out: minimum,
                ix_name: "multi_hop_swap".into(),
                cashback_fee_basis_points: 0,
                cashback: 0,
                buyback_fee_basis_points: buyback_bps,
                buyback_fee: buyback_received,
                virtual_quote_reserves: old_virtual,
                can_boost,
                base_supply: h.base_mint.supply,
                holder_rewards_bps: if h.pool.is_holder_reward {
                    selected.creator_fee_bps
                } else {
                    0
                },
                holder_rewards: if h.pool.is_holder_reward {
                    creator_fee
                } else {
                    0
                },
                creator_fee_unclaimed: h.pool.creator_fees,
                quote_transfer_fee,
            },
        )?;
    }
    Ok(output)
}

