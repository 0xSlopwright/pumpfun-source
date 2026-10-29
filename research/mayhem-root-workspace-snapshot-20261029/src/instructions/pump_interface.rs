use anchor_lang::prelude::*;

#[repr(C)]
pub struct SellEvent {
 pub sol_vault: Pubkey,
 pub mint: Pubkey,
 pub sol_amount: u64,
 pub token_amount: u64,
 pub sol_vault_balance: u64,
 pub token_vault_balance: u64,
 pub state_sol_deployed: i128,
 pub state_token_net: i128,
 pub virtual_sol: u64,
 pub virtual_tokens: u64,
 pub global_sol_deployed: i128,
 pub timestamp: i64,
 pub end_timestamp: i64,
 pub real_sol: u64,
 pub real_tokens: u64,
 pub quote_amount: u64,
 pub quote_vault_balance: u64,
 pub state_quote_deployed: i128,
 pub virtual_quote: u64,
 pub global_quote_deployed: i128,
 pub real_quote: u64,
 pub quote_mint: Pubkey,
 pub version: u32,
 pub retained_reserve_bps: u16,
 pub side: u8,
}

impl AnchorSerialize for SellEvent {
 fn serialize<W: std::io::Write>(&self, writer:&mut W)->std::io::Result<()> {
  writer.write_all(&[self.side])?;
  AnchorSerialize::serialize(&self.sol_vault, writer)?;
  AnchorSerialize::serialize(&self.mint, writer)?;
  AnchorSerialize::serialize(&self.sol_amount, writer)?;
  AnchorSerialize::serialize(&self.token_amount, writer)?;
  AnchorSerialize::serialize(&self.sol_vault_balance, writer)?;
  AnchorSerialize::serialize(&self.token_vault_balance, writer)?;
  AnchorSerialize::serialize(&self.state_sol_deployed, writer)?;
  AnchorSerialize::serialize(&self.state_token_net, writer)?;
  AnchorSerialize::serialize(&self.virtual_sol, writer)?;
  AnchorSerialize::serialize(&self.virtual_tokens, writer)?;
  AnchorSerialize::serialize(&self.global_sol_deployed, writer)?;
  AnchorSerialize::serialize(&self.timestamp, writer)?;
  AnchorSerialize::serialize(&self.end_timestamp, writer)?;
  AnchorSerialize::serialize(&self.real_sol, writer)?;
  AnchorSerialize::serialize(&self.real_tokens, writer)?;
  AnchorSerialize::serialize(&self.version, writer)?;
  AnchorSerialize::serialize(&self.retained_reserve_bps, writer)?;
  AnchorSerialize::serialize(&self.quote_amount, writer)?;
  AnchorSerialize::serialize(&self.quote_vault_balance, writer)?;
  AnchorSerialize::serialize(&self.state_quote_deployed, writer)?;
  AnchorSerialize::serialize(&self.virtual_quote, writer)?;
  AnchorSerialize::serialize(&self.global_quote_deployed, writer)?;
  AnchorSerialize::serialize(&self.real_quote, writer)?;
  AnchorSerialize::serialize(&self.quote_mint, writer)?;
  Ok(())
 }
}
impl AnchorDeserialize for SellEvent {
 fn deserialize_reader<R: std::io::Read>(reader:&mut R)->std::io::Result<Self> {
  let side=AnchorDeserialize::deserialize_reader(reader)?;
  let sol_vault=AnchorDeserialize::deserialize_reader(reader)?;
  let mint=AnchorDeserialize::deserialize_reader(reader)?;
  let sol_amount=AnchorDeserialize::deserialize_reader(reader)?;
  let token_amount=AnchorDeserialize::deserialize_reader(reader)?;
  let sol_vault_balance=AnchorDeserialize::deserialize_reader(reader)?;
  let token_vault_balance=AnchorDeserialize::deserialize_reader(reader)?;
  let state_sol_deployed=AnchorDeserialize::deserialize_reader(reader)?;
  let state_token_net=AnchorDeserialize::deserialize_reader(reader)?;
  let virtual_sol=AnchorDeserialize::deserialize_reader(reader)?;
  let virtual_tokens=AnchorDeserialize::deserialize_reader(reader)?;
  let global_sol_deployed=AnchorDeserialize::deserialize_reader(reader)?;
  let timestamp=AnchorDeserialize::deserialize_reader(reader)?;
  let end_timestamp=AnchorDeserialize::deserialize_reader(reader)?;
  let real_sol=AnchorDeserialize::deserialize_reader(reader)?;
  let real_tokens=AnchorDeserialize::deserialize_reader(reader)?;
  let version=AnchorDeserialize::deserialize_reader(reader)?;
  let retained_reserve_bps=AnchorDeserialize::deserialize_reader(reader)?;
  let quote_amount=AnchorDeserialize::deserialize_reader(reader)?;
  let quote_vault_balance=AnchorDeserialize::deserialize_reader(reader)?;
  let state_quote_deployed=AnchorDeserialize::deserialize_reader(reader)?;
  let virtual_quote=AnchorDeserialize::deserialize_reader(reader)?;
  let global_quote_deployed=AnchorDeserialize::deserialize_reader(reader)?;
  let real_quote=AnchorDeserialize::deserialize_reader(reader)?;
  let quote_mint=AnchorDeserialize::deserialize_reader(reader)?;
  Ok(Self { side,sol_vault,mint,sol_amount,token_amount,sol_vault_balance,token_vault_balance,state_sol_deployed,state_token_net,virtual_sol,virtual_tokens,global_sol_deployed,timestamp,end_timestamp,real_sol,real_tokens,version,retained_reserve_bps,quote_amount,quote_vault_balance,state_quote_deployed,virtual_quote,global_quote_deployed,real_quote,quote_mint })
 }
}
impl Discriminator for SellEvent { const DISCRIMINATOR: &'static [u8]=&[0x31,0x48,0x7b,0x2d,0x6e,0x40,0xb0,0x85]; }





































































































impl anchor_lang::Event for SellEvent {
 fn data(&self)->Vec<u8> {
  let mut data =
Vec::with_capacity(256);
  data.extend_from_slice(Self::DISCRIMINATOR); self.serialize(&mut data).unwrap(); data
 }
}
