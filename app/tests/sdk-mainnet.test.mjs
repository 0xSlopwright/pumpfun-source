import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const require=createRequire(new URL('../packages/sdk/package.json',import.meta.url));
const BN=require('bn.js');
const {PublicKey}=require('@solana/web3.js');
const published=mkdtempSync(join(tmpdir(),'pump-sdk-mainnet-'));
mkdirSync(join(published,'swap'));
symlinkSync(join(root,'packages/sdk/node_modules'),join(published,'node_modules'),process.platform==='win32'?'junction':'dir');
for(const sub of ['index.js','swap/index.js'])writeFileSync(join(published,sub),execFileSync('tar',['-xOf',join(root,'evidence/sdk/pump-sdk-4.3.1.tgz'),`package/dist/${sub}`]));
process.on('exit',()=>rmSync(published,{recursive:true,force:true}));
// Finalized mainnet `Program data:` payloads of pump TradeEvent; provenance is in the fixture header.
const fixture=JSON.parse(readFileSync(new URL('./fixtures/mainnet-trade-events.json',import.meta.url),'utf8'));
const DISCRIMINATOR=createHash('sha256').update('event:TradeEvent').digest().subarray(0,8);
const SUPPLY=new BN('1000000000000000');
// Field order of `TradeEvent` in programs/pump/src/lib.rs, including the final `unparsed_trailing_field`.
const decode=(data)=>{
 const b=Buffer.from(data,'base64'); let o=8;
 const pk=()=>new PublicKey(b.subarray(o,o+=32)), u64=()=>new BN(b.subarray(o,o+=8),'le'), i64=()=>b.readBigInt64LE((o+=8)-8), bool=()=>b[o++]===1;
 const str=()=>{const n=b.readUInt32LE(o);o+=4;return b.subarray(o,o+=n).toString('utf8');};
 const e={discriminator:b.subarray(0,8),mint:pk(),solAmount:u64(),tokenAmount:u64(),isBuy:bool(),user:pk(),timestamp:i64(),virtualSolReserves:u64(),virtualTokenReserves:u64(),realSolReserves:u64(),realTokenReserves:u64(),feeRecipient:pk(),feeBasisPoints:u64(),fee:u64(),creator:pk(),creatorFeeBasisPoints:u64(),creatorFee:u64(),trackVolume:bool(),totalUnclaimedTokens:u64(),totalClaimedTokens:u64(),currentSolVolume:u64(),lastUpdateTimestamp:i64(),ixName:str(),mayhemMode:bool(),cashbackFeeBasisPoints:u64(),cashback:u64(),buybackFeeBasisPoints:u64(),buybackFee:u64()};
 const n=b.readUInt32LE(o);o+=4; e.shareholders=[]; for(let k=0;k<n;k++){const address=pk();e.shareholders.push({address,shareBps:b.readUInt16LE(o)});o+=2;}
 Object.assign(e,{quoteMint:pk(),quoteAmount:u64(),virtualQuoteReserves:u64(),realQuoteReserves:u64(),holderRewardsBps:u64(),holderRewards:u64(),creatorFeeUnclaimed:u64(),unparsedTrailingField:u64()});
 e.unread=b.length-o; return e;
};
const events=fixture.events.map((row)=>({row,event:decode(row.data)}));
test('retained mainnet TradeEvents decode exactly with the reconstructed field order',()=>{
 assert.ok(events.length>=100,`fixture has ${events.length} events`);
 assert.equal(new Set(fixture.events.map((row)=>`${row.signature}:${row.eventIndex}`)).size,events.length,'duplicate fixture rows');
 for(const {row,event} of events){
  const label=`${row.signature}#${row.eventIndex}`;
  assert.deepEqual(event.discriminator,DISCRIMINATOR,label);
  assert.equal(event.unread,0,`${label} leaves ${event.unread} bytes after unparsed_trailing_field`);
  assert.ok(['buy','sell','buy_exact_sol_in','buy_exact_quote_in'].includes(event.ixName),`${label} ${event.ixName}`);
  assert.equal(event.isBuy,event.ixName!=='sell',label);
  // The legacy producers store an immediate zero here (repro/parallel-work/2026-10-24/results/pump_event); mainnet agrees.
  assert.equal(event.unparsedTrailingField.toString(),'0',label);
  if(event.quoteMint.equals(PublicKey.default))assert.equal(event.quoteAmount.toString(),event.solAmount.toString(),label);
 }
});
test('published and rebuilt SDK reproduce non-Mayhem mainnet buy and sell amounts',()=>{
 const original=require(join(published,'index.js')), built=require(join(root,'packages/sdk/dist/index.js'));
 const zero=PublicKey.default;
 let compared=0;
 for(const {row,event:e} of events){
  // Mayhem curves are excluded: their emitted post-trade virtual reserves are not pre-trade reserves plus the traded amounts.
  if(e.mayhemMode||!['buy','sell'].includes(e.ixName))continue;
  const label=`${e.ixName} ${row.signature}#${row.eventIndex}`;
  // The rates actually charged come from the event; FeeConfig tier selection is not exercised here.
  const global={initialized:true,authority:zero,feeRecipient:zero,initialVirtualTokenReserves:new BN('1073000000000000'),initialVirtualSolReserves:new BN('30000000000'),initialRealTokenReserves:new BN('793100000000000'),tokenTotalSupply:SUPPLY,feeBasisPoints:e.feeBasisPoints,withdrawAuthority:zero,enableMigrate:true,poolMigrationFee:new BN(0),creatorFeeBasisPoints:e.creatorFeeBasisPoints,feeRecipients:[zero],setCreatorAuthority:zero,adminSetCreatorAuthority:zero,createV2Enabled:true,whitelistPda:zero,reservedFeeRecipient:zero,mayhemModeEnabled:false,reservedFeeRecipients:[],isCashbackEnabled:false,buybackFeeRecipients:[],buybackBasisPoints:e.buybackFeeBasisPoints,initialVirtualQuoteReserves:new BN('30000000000'),whitelistedQuoteMints:[],creatorFeeConfigurable:false,maxConfigurableCreatorFeeBps:new BN(500),holderRewardClaimAuthority:zero,isHolderRewardEnabled:false,maxCurveDepth:2};
  // Undo the trade on the emitted post-trade reserves.
  const sign=e.isBuy?-1:1;
  const bondingCurve={virtualTokenReserves:e.virtualTokenReserves.sub(e.tokenAmount.muln(sign)),virtualQuoteReserves:e.virtualQuoteReserves.add(e.quoteAmount.muln(sign)),realTokenReserves:e.realTokenReserves.sub(e.tokenAmount.muln(sign)),realQuoteReserves:e.realQuoteReserves.add(e.quoteAmount.muln(sign)),tokenTotalSupply:SUPPLY,complete:false,creator:e.creator,isMayhemMode:false,isCashbackCoin:false,quoteMint:e.quoteMint,creatorFeeBps:new BN(0),isHolderReward:!e.holderRewardsBps.isZero(),depth:0};
  const run=(sdk)=>e.isBuy
   ?sdk.getBuySolAmountFromTokenAmount({global,feeConfig:null,mintSupply:SUPPLY,bondingCurve,amount:e.tokenAmount,quoteMint:e.quoteMint}).toString()
   :sdk.getSellSolAmountFromTokenAmount({global,feeConfig:null,mintSupply:SUPPLY,bondingCurve,amount:e.tokenAmount}).toString();
  // A token-exact buy pays quote plus both fees; a sell receives quote less both fees.
  const observed=(e.isBuy?e.quoteAmount.add(e.fee).add(e.creatorFee):e.quoteAmount.sub(e.fee).sub(e.creatorFee)).toString();
  assert.equal(run(original),observed,`published ${label}`);
  assert.equal(run(built),observed,`rebuilt ${label}`);
  compared++;
 }
 assert.ok(compared>=80,`only ${compared} non-Mayhem buy/sell events compared`);
});
test('mainnet exact-in buys follow the reconstructed pricing and the SDK quote bounds them from above',()=>{
 const original=require(join(published,'index.js')), built=require(join(root,'packages/sdk/dist/index.js'));
 const exact=JSON.parse(readFileSync(new URL('./fixtures/mainnet-exact-in-buys.json',import.meta.url),'utf8'));
 const zero=PublicKey.default, ceilFee=(amount,bps)=>amount.mul(bps).addn(9_999).divn(10_000);
 assert.ok(exact.events.length>=50,`fixture has ${exact.events.length} events`);
 let overQuoted=0;
 for(const row of exact.events){
  const e=decode(row.data), ix=Buffer.from(row.instruction,'base64'), label=`${row.ix} ${row.signature}`;
  assert.equal(e.ixName,row.ix==='buy_exact_sol_in'?'buy_exact_sol_in':'buy_exact_quote_in',label);
  const budget=new BN(ix.subarray(8,16),'le');
  const vt=e.virtualTokenReserves.add(e.tokenAmount), vq=e.virtualQuoteReserves.sub(e.quoteAmount);
  // programs/pump/src/buy.rs: fees are charged on raw_quote, which steps down by one when they overflow the budget; util/constant_product.rs prices quote-1.
  const pb=e.feeBasisPoints, cb=e.creator.equals(zero)?new BN(0):e.creatorFeeBasisPoints;
  const raw=budget.muln(10_000).div(pb.add(cb).addn(10_000));
  const quote=raw.add(ceilFee(raw,pb)).add(ceilFee(raw,cb)).gt(budget)?raw.subn(1):raw;
  const tokens=quote.subn(1).mul(vt).div(vq.add(quote.subn(1)));
  assert.deepEqual([e.quoteAmount,e.fee,e.creatorFee,e.tokenAmount].map(String),[quote,ceilFee(raw,pb),ceilFee(raw,cb),tokens].map(String),label);
  if(e.mayhemMode)continue;
  const global={feeBasisPoints:pb,creatorFeeBasisPoints:e.creatorFeeBasisPoints,creatorFeeConfigurable:false,tokenTotalSupply:SUPPLY};
  const bondingCurve={virtualTokenReserves:vt,virtualQuoteReserves:vq,realTokenReserves:e.realTokenReserves.add(e.tokenAmount),realQuoteReserves:e.realQuoteReserves.sub(e.quoteAmount),creator:e.creator,quoteMint:e.quoteMint,isMayhemMode:false,creatorFeeBps:new BN(0),complete:false};
  const run=(sdk)=>sdk.getBuyTokenAmountFromSolAmount({global,feeConfig:null,mintSupply:SUPPLY,bondingCurve,amount:budget,quoteMint:e.quoteMint});
  const reference=run(original);
  assert.equal(run(built).toString(),reference.toString(),`rebuilt ${label}`);
  assert.ok(reference.gte(e.tokenAmount),`${label}: SDK ${reference} below mainnet ${e.tokenAmount}`);
  if(reference.gt(e.tokenAmount))overQuoted++;
 }
 // The SDK prices floor((budget-1)*1e4/(1e4+bps)) without the program's quote-1, so it over-quotes whenever that equals the charged quote.
 assert.ok(overQuoted>0,'expected at least one SDK over-quote');
});
