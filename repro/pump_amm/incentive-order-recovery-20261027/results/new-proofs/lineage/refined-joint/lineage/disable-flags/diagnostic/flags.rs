use anchor_lang::prelude::*;
use pump_amm_recovered::AdminGlobal;
pub fn borrowed(ctx: Context<AdminGlobal>, a: bool,b: bool,c: bool,d: bool,e: bool)->Result<()> {
 let flags=&mut ctx.accounts.global_config.disable_flags;
 *flags=(*flags & !1)|u8::from(a);
 *flags=(*flags & !2)|(u8::from(b)<<1);
 *flags=(*flags & !4)|(u8::from(c)<<2);
 *flags=(*flags & !8)|(u8::from(d)<<3);
 *flags=(*flags & !16)|(u8::from(e)<<4);
 Ok(())
}
pub fn direct(ctx: Context<AdminGlobal>, a: bool,b: bool,c: bool,d: bool,e: bool)->Result<()> {
 ctx.accounts.global_config.disable_flags=(ctx.accounts.global_config.disable_flags & !1)|u8::from(a);
 ctx.accounts.global_config.disable_flags=(ctx.accounts.global_config.disable_flags & !2)|(u8::from(b)<<1);
 ctx.accounts.global_config.disable_flags=(ctx.accounts.global_config.disable_flags & !4)|(u8::from(c)<<2);
 ctx.accounts.global_config.disable_flags=(ctx.accounts.global_config.disable_flags & !8)|(u8::from(d)<<3);
 ctx.accounts.global_config.disable_flags=(ctx.accounts.global_config.disable_flags & !16)|(u8::from(e)<<4);
 Ok(())
}
