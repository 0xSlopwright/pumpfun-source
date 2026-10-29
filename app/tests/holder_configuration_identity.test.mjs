import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../packages/frontend/package.json', import.meta.url));
const { PublicKey } = require('@solana/web3.js');
const { require: requireTs } = createRequire(new URL('../packages/backend/package.json', import.meta.url))('tsx/cjs/api');
const { isHolderConfiguration } = requireTs('../packages/frontend/src/app/holder-rewards-config/client.ts', import.meta.url);
const contract = require('./src/app/holder-rewards-config/contract.json');
const mint = 'So11111111111111111111111111111111111111112';
const derive = seed => PublicKey.findProgramAddressSync([new TextEncoder().encode(seed), new PublicKey(mint).toBytes()], new PublicKey(contract.programId))[0].toBase58();
const rewards = derive('holder-rewards');
const value = () => ({ ok:true,mint,holderRewardsPda:rewards,programId:contract.programId,globalPda:contract.globalPda,curvePda:derive('bonding-curve'),cluster:'mainnet-beta',commitment:'confirmed',contextSlot:1,observedAt:'2026-10-29T00:00:00Z',endpointHost:'example.invalid',global:{status:'decoded',dataBytes:1088,isHolderRewardEnabled:false,holderRewardClaimAuthority:mint},curve:{status:'decoded',dataBytes:166,isHolderReward:false,creator:rewards,creatorMatchesHolderRewardsPda:true} });
test('configuration guards bind PDAs to the mint and require exact 32-byte public keys', () => {
  assert.equal(isHolderConfiguration(value(),mint,rewards),true);
  for (const mutate of [r => r.curvePda=mint,r => r.curve.creator='z'.repeat(44),r => r.global.holderRewardClaimAuthority='z'.repeat(44)]) {
    const row=value();mutate(row);assert.equal(isHolderConfiguration(row,mint,rewards),false);
  }
  const wrong=value();wrong.holderRewardsPda=mint;
  assert.equal(isHolderConfiguration(wrong,mint,mint),false);
});
