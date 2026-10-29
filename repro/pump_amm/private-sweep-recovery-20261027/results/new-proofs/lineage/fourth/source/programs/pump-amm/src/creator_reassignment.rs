use crate::*;
use anchor_lang::Discriminator;
use anchor_spl::metadata::MetadataAccount;
pub const FEES_PROGRAM: Pubkey = anchor_lang::solana_program::pubkey!("pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ");
pub use crate::pump_fees::types::{ConfigStatus, Shareholder};
pub use crate::pump_fees::accounts::SharingConfig;
pub use crate::pump::accounts::BondingCurve;
#[event_cpi]
#[derive(Accounts)]
pub struct MigratePoolCoinCreator<'info>{
 #[account(mut,seeds=[b"pool",pool.index.to_le_bytes().as_ref(),pool.creator.as_ref(),pool.base_mint.as_ref(),pool.quote_mint.as_ref()],bump,constraint=pool.creator==crate::utils::pool_authority(&pool.base_mint) @ PumpAmmError::OnlyCanonicalPumpPoolsCanHaveCoinCreator)]pub pool:Account<'info,Pool>,
 #[account(seeds=[b"sharing-config",pool.base_mint.as_ref()],bump,seeds::program=FEES_PROGRAM,constraint=sharing_config.mint==pool.base_mint @ PumpAmmError::InvalidSharingConfigBaseMint,constraint=sharing_config.admin==pool.coin_creator @ PumpAmmError::InvalidSharingConfigCoinCreator)]pub sharing_config:Account<'info,SharingConfig>,
}
pub fn migrate(ctx:Context<MigratePoolCoinCreator>)->Result<()>{
 let pool=&mut ctx.accounts.pool;
 require!(!pool.is_holder_reward,PumpAmmError::HolderRewardCreatorImmutable);
 require!(pool.creator_fees==0,PumpAmmError::CreatorFeesNotSwept);
 let old_coin_creator=pool.coin_creator;pool.coin_creator=ctx.accounts.sharing_config.key();
 let event=MigratePoolCoinCreatorEvent{timestamp:Clock::get()?.unix_timestamp,base_mint:pool.base_mint,pool:pool.key(),sharing_config:ctx.accounts.sharing_config.key(),old_coin_creator,new_coin_creator:pool.coin_creator};emit!(event.clone());emit_cpi!(event);Ok(())
}
#[event_cpi]
#[derive(Accounts)]
pub struct SetCoinCreator<'info>{
 #[account(mut)]pub pool:Account<'info,Pool>,
 #[account(seeds=[b"metadata",anchor_spl::metadata::ID.as_ref(),pool.base_mint.as_ref()],bump,seeds::program=anchor_spl::metadata::ID)]pub metadata:Account<'info,MetadataAccount>,
 #[account(seeds=[b"bonding-curve",pool.base_mint.as_ref()],bump,seeds::program=trade::PUMP)]pub bonding_curve:Account<'info,BondingCurve>,
}
pub fn set(ctx:Context<SetCoinCreator>)->Result<()>{
 let pool=&mut ctx.accounts.pool;
 let authority=Pubkey::find_program_address(&[b"pool-authority",pool.base_mint.as_ref()],&trade::PUMP).0;
 require_keys_eq!(pool.creator,authority,PumpAmmError::OnlyCanonicalPumpPoolsCanHaveCoinCreator);
 if pool.coin_creator!=Pubkey::default(){msg!("Pool has coin_creator already set");return Ok(())}
 if let Some(creators)=&ctx.accounts.metadata.creators{
  pool.coin_creator=creators[0].address;
  let event=SetMetaplexCoinCreatorEvent{timestamp:Clock::get()?.unix_timestamp,base_mint:pool.base_mint,pool:pool.key(),metadata:ctx.accounts.metadata.key(),coin_creator:pool.coin_creator};emit!(event.clone());emit_cpi!(event);
 }else{
  pool.coin_creator=ctx.accounts.bonding_curve.creator;
  let event=SetBondingCurveCoinCreatorEvent{timestamp:Clock::get()?.unix_timestamp,base_mint:pool.base_mint,pool:pool.key(),bonding_curve:ctx.accounts.bonding_curve.key(),coin_creator:pool.coin_creator};emit!(event.clone());emit_cpi!(event);
 }Ok(())
}
#[event]#[derive(Clone)]pub struct MigratePoolCoinCreatorEvent{pub timestamp:i64,pub base_mint:Pubkey,pub pool:Pubkey,pub sharing_config:Pubkey,pub old_coin_creator:Pubkey,pub new_coin_creator:Pubkey}
#[event]#[derive(Clone)]pub struct SetMetaplexCoinCreatorEvent{pub timestamp:i64,pub base_mint:Pubkey,pub pool:Pubkey,pub metadata:Pubkey,pub coin_creator:Pubkey}
#[event]#[derive(Clone)]pub struct SetBondingCurveCoinCreatorEvent{pub timestamp:i64,pub base_mint:Pubkey,pub pool:Pubkey,pub bonding_curve:Pubkey,pub coin_creator:Pubkey}

#[event_cpi]
#[derive(Accounts)]
pub struct AdminCtoPool<'info>{
 #[account(mut)]pub payer:Signer<'info>,
 pub global_config:Account<'info,GlobalConfig>,
 #[account(mut)]pub pool:Account<'info,Pool>,
 #[account(seeds=[b"pool-authority",pool.base_mint.as_ref()],bump,seeds::program=trade::PUMP)]pub pool_authority:Signer<'info>,
 pub system_program:Program<'info,System>,
}
pub fn admin_cto(ctx:Context<AdminCtoPool>,coin_creator:Pubkey,is_holder_reward:bool,creator_fee_bps:Option<u64>)->Result<()>{
 let pool=&mut ctx.accounts.pool;
 require!(pool.creator==ctx.accounts.pool_authority.key(),PumpAmmError::OnlyCanonicalPumpPoolsCanHaveCoinCreator);
 require!(!pool.is_mayhem_mode,PumpAmmError::CtoNotAllowedForMayhemPool);
 require!(!pool.is_holder_reward || is_holder_reward,PumpAmmError::HolderRewardCreatorImmutable);
 if is_holder_reward{
  require_keys_eq!(coin_creator,Pubkey::find_program_address(&[b"holder-rewards",pool.base_mint.as_ref()],&trade::PUMP).0,PumpAmmError::InvalidHolderRewardCoinCreator);
 }
 let is_cashback_coin=if is_holder_reward{false}else{pool.is_cashback_coin};
 if let Some(fee)=creator_fee_bps{
  require!(pool.quote_mint!=anchor_spl::token::spl_token::native_mint::ID && pool.quote_mint!=anchor_lang::solana_program::pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),PumpAmmError::CreatorFeeNotConfigurableForQuote);
  require!(!is_cashback_coin,PumpAmmError::CreatorFeeNotAllowedForCashbackCoin);
  require!(ctx.accounts.global_config.creator_fee_configurable,PumpAmmError::CreatorFeeNotConfigurable);
  require!(fee>0 && fee<=ctx.accounts.global_config.max_configurable_creator_fee_bps,PumpAmmError::CreatorFeeBpsOutOfRange);
 }
 require!(pool.creator_fees==0,PumpAmmError::CreatorFeesNotSwept);
 crate::instructions::swap::prepare_pool(
  pool, ctx.accounts.system_program.as_ref(), ctx.accounts.payer.as_ref(),
 )?;
 let old_coin_creator=pool.coin_creator;let old_creator_fee_bps=pool.creator_fee_bps;
 pool.coin_creator=coin_creator;pool.is_holder_reward=is_holder_reward;pool.is_cashback_coin=is_cashback_coin;pool.can_edit_creator_fee=false;
 if let Some(fee)=creator_fee_bps{pool.creator_fee_bps=fee;}
 let event=AdminCtoPoolEvent{timestamp:Clock::get()?.unix_timestamp,base_mint:pool.base_mint,pool:pool.key(),old_coin_creator,new_coin_creator:coin_creator,is_holder_reward,is_cashback_coin:pool.is_cashback_coin,old_creator_fee_bps,new_creator_fee_bps:pool.creator_fee_bps};emit!(event.clone());emit_cpi!(event);Ok(())
}
#[event]#[derive(Clone)]pub struct AdminCtoPoolEvent{pub timestamp:i64,pub base_mint:Pubkey,pub pool:Pubkey,pub old_coin_creator:Pubkey,pub new_coin_creator:Pubkey,pub is_holder_reward:bool,pub is_cashback_coin:bool,pub old_creator_fee_bps:u64,pub new_creator_fee_bps:u64}
