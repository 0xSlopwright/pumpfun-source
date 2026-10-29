use crate::*;

pub fn set(ctx:Context<SetCoinCreator>)->Result<()>{
 let pool=&mut ctx.accounts.pool;
 require_keys_eq!(pool.creator,
  Pubkey::find_program_address(&[b"pool-authority",pool.base_mint.as_ref()],&trade::PUMP).0,PumpAmmError::OnlyCanonicalPumpPoolsCanHaveCoinCreator);
 if pool.coin_creator!=Pubkey::default(){msg!("Pool has coin_creator already set");return Ok(())}
 if let Some(creators)=&ctx.accounts.metadata.creators{
  pool.coin_creator=creators[0].address;
  let event=SetMetaplexCoinCreatorEvent{timestamp:Clock::get()?.unix_timestamp,base_mint:pool.base_mint,pool:pool.key(),metadata:ctx.accounts.metadata.key(),coin_creator:pool.coin_creator};emit!(event);emit_cpi!(event);
 }else{
  pool.coin_creator=ctx.accounts.bonding_curve.creator;
  let event=SetBondingCurveCoinCreatorEvent{timestamp:Clock::get()?.unix_timestamp,base_mint:pool.base_mint,pool:pool.key(),bonding_curve:ctx.accounts.bonding_curve.key(),coin_creator:pool.coin_creator};emit!(event);emit_cpi!(event);
 }Ok(())
}
