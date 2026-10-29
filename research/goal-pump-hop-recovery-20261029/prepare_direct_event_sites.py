#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-snapshots';s=(prev/'src/multi_hop_curve_swap.rs').read_text()
# Exact installed Anchor emit!/emit_cpi mechanisms, using the helper's actual inputs.
def emit(name):
 return '{ let data=anchor_lang::Event::data(&'+name+'); anchor_lang::solana_program::log::sol_log_data(&[&data]); } { let authority_info=a.event_authority.to_account_info(); let disc=anchor_lang::event::EVENT_IX_TAG_LE; let inner_data=anchor_lang::Event::data(&'+name+'); let ix_data:Vec<u8>=disc.into_iter().map(|b|*b).chain(inner_data.into_iter()).collect(); let ix=Instruction::new_with_bytes(crate::ID,&ix_data,vec![AccountMeta::new_readonly(*authority_info.key,true)]); invoke_signed(&ix,&[authority_info],&[&[b"__event_authority",&[event_bump]]]).map_err(anchor_lang::error::Error::from)?; }'
for name in ['event','completion','post_event']:
 old='route_event(a,&'+name+',event_bump)?;';assert s.count(old)==1;s=s.replace(old,emit(name),1)
base=(R/'src/src/multi_hop_curve_swap.rs').read_text();assert len(s.splitlines())==len(base.splitlines())
out=R/'probes/matched-business-direct-events';out.mkdir(parents=True,exist_ok=False);files={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'Direct actual event macro blocks without a Result-returning wrapper; all inputs real and same source rows.'};(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
