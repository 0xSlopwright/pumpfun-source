import assert from "node:assert/strict";
import test from "node:test";
import {
  isPortfolioResponse,
  MAINNET_GENESIS_HASH,
  SPL_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from "../packages/frontend/src/app/portfolio/types.ts";
function valid() {
  const account = {
    tokenAccount: "synthetic-account",
    mint: "synthetic-mint",
    owner: "synthetic-owner",
    program: "spl-token",
    programId: SPL_TOKEN_PROGRAM_ID,
    rawAmount: "18446744073709551615",
    decimals: 6,
    amount: "18446744073709.551615",
    state: "initialized",
    isNative: false,
    extensions: [],
  };
  return {
    ok: true,
    address: "synthetic-owner",
    cluster: "mainnet-beta",
    genesisHash: MAINNET_GENESIS_HASH,
    commitment: "confirmed",
    observedAt: "2026-10-29T00:00:00Z",
    endpointHost: "example.invalid",
    sol: { lamports: "1", amount: "0.000000001", contextSlot: 1 },
    splToken: {
      program: "spl-token",
      programId: SPL_TOKEN_PROGRAM_ID,
      contextSlot: 1,
      accounts: [account],
      mints: [{ ...account, accountCount: 1 }],
    },
    token2022: {
      program: "token-2022",
      programId: TOKEN_2022_PROGRAM_ID,
      contextSlot: 2,
      accounts: [],
      mints: [],
    },
    snapshotAtomic: false,
  };
}

test('a successful portfolio must belong to the requested address', () => {
  const response=valid();
  assert.equal(isPortfolioResponse(response,'synthetic-owner'),true);
  assert.equal(isPortfolioResponse(response,'other-owner'),false);
  const missingOwner=valid();missingOwner.splToken.accounts=new Array(1);
  assert.equal(isPortfolioResponse(missingOwner,'synthetic-owner'),false);
  const wrongOwner=valid();wrongOwner.splToken.accounts[0].owner='other-owner';
  assert.equal(isPortfolioResponse(wrongOwner,'synthetic-owner'),false);
  assert.equal(isPortfolioResponse({ok:false,error:{code:'UNAVAILABLE',message:'Unavailable',retryable:true}},'synthetic-owner'),true);
});
