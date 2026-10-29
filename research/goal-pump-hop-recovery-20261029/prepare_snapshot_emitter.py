#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;previous=R/'probes/matched-business-inline-events';base=(R/'src/src/multi_hop_curve_swap.rs').read_text();s=(previous/'src/multi_hop_curve_swap.rs').read_text()
a=s.index("#[inline(never)] fn swap_hop");b=s.index('pub fn trade_event(',a);chunk=s[a:b]
assert chunk.count('a.fee_config.to_account_info().data_len()')==3
chunk=chunk.replace('a.fee_config.to_account_info().data_len()','fee_config_len')
old='        let c = &h.bonding_curve;\n        let trade_amount = if buy {';assert old in chunk
chunk=chunk.replace(old,'        let c = &h.bonding_curve; let fee_config_len=AsRef::<AccountInfo>::as_ref(a.fee_config.as_ref()).data_len(); let cap=crate::buy_fee_market_cap(c,&h.base_mint)?;\n        let trade_amount = if buy {',1)
old='        let cap = crate::buy_fee_market_cap(c,&h.base_mint)?;';assert old in chunk;chunk=chunk.replace(old,'',1)
assert chunk.count('Clock::get()?.unix_timestamp')==3;chunk=chunk.replace('Clock::get()?.unix_timestamp','timestamp')
old='let event = trade_event(';assert old in chunk;chunk=chunk.replace(old,'let timestamp=Clock::get()?.unix_timestamp; let event = trade_event(',1)
old='buyback_fee: add(buyback,post_buyback)?,';assert old in chunk;chunk=chunk.replace(old,'buyback_fee: received_buyback,',1)
s=s[:a]+chunk+s[b:]
a=s.index('#[inline(always)] fn route_event');b=s.index('pub struct HopOutput',a);old=s[a:b]
new='''#[inline(always)] fn route_event<E: anchor_lang::Event>(a: &MultiHopCurve, event: &E, event_bump: u8) -> Result<()> {
    let data = anchor_lang::Event::data(event);
    anchor_lang::solana_program::log::sol_log_data(&[&data]);
    let authority = a.event_authority.to_account_info();
    let disc = anchor_lang::event::EVENT_IX_TAG_LE;
    let inner_data = anchor_lang::Event::data(event);
    let payload: Vec<u8> = disc.into_iter().map(|b| *b).chain(inner_data.into_iter()).collect();
    let ix = Instruction::new_with_bytes(crate::ID,&payload,vec![AccountMeta::new_readonly(*authority.key,true)]);
    invoke_signed(&ix,&[authority],&[&[b"__event_authority",&[event_bump]]]).map_err(anchor_lang::error::Error::from)?;
    Ok(())
}
'''
assert new.count('\n')<=old.count('\n');new+='\n'*(old.count('\n')-new.count('\n'));s=s[:a]+new+s[b:]
assert len(s.splitlines())==len(base.splitlines())
out=R/'probes/matched-business-snapshots';out.mkdir(parents=True,exist_ok=False);modified={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(previous/'src/trade_v3.rs').read_text()}
for n,t in modified.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in modified.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in modified.items()},'scope':'Actual matched business helpers, original dominated snapshots, exact installed emit_cpi payload construction. Same source rows, no emitted-byte edits.'}
(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
macro=Path('/Users/shawwalters/.cargo/registry/src/index.crates.io-6f17d22bba15001f/anchor-attribute-event-0.31.1/src/lib.rs');(out/'EMITTER-BASIS.json').write_text(json.dumps({'path':str(macro.resolve()),'sha256':hashlib.sha256(macro.read_bytes()).hexdigest(),'lines':[157,194],'real_inputs':['event authority','event bump','event data','event tag','program ID']},indent=2)+'\n')
print(manifest['changed_rows'])
