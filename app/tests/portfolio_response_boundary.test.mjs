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
test("exact u64 precision remains valid", () =>
  assert.equal(isPortfolioResponse(valid()), true));
test("response guard rejects malformed amounts, slots and program relationships", () => {
  for (const mutate of [
    (r) => (r.splToken.accounts[0].state = ["frozen"]),
    (r) => (r.splToken.accounts[0].decimals = -1),
    (r) => (r.splToken.accounts[0].decimals = 256),
    (r) => (r.splToken.accounts[0].rawAmount = "18446744073709551616"),
    (r) => (r.splToken.accounts[0].rawAmount = "01"),
    (r) => (r.splToken.accounts[0].amount = "wrong"),
    (r) => (r.splToken.mints[0].amount = "wrong"),
    (r) => (r.sol.lamports = "-1"),
    (r) => (r.sol.amount = "1"),
    (r) => (r.sol.contextSlot = -1),
    (r) => (r.splToken.contextSlot = -1),
    (r) => (r.splToken.accounts[0].programId = TOKEN_2022_PROGRAM_ID),
    (r) => (r.splToken.mints[0].program = "token-2022"),
    (r) => ([r.splToken, r.token2022] = [r.token2022, r.splToken]),
  ]) {
    const response = valid();
    mutate(response);
    assert.equal(isPortfolioResponse(response), false, mutate.toString());
  }
});
