import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_SOLANA_RPC_URL,
  PortfolioRpcError,
  readLivePortfolio,
  formatBaseUnits,
  isPublicRpcAddress,
  readPortfolioWithRpc,
  rpcHttpStatusError,
  validateRpcUrl,
  validateWalletAddress,
  type RpcCall,
} from "../packages/frontend/src/app/portfolio/rpc.ts";
import {
  MAINNET_GENESIS_HASH,
  SPL_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  isPortfolioResponse,
} from "../packages/frontend/src/app/portfolio/types.ts";

const WALLET = "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH";
const SPL_ACCOUNT_ONE = "69gGSxcFan4EoL63vdHsHeP8XNpXgVCEpcSu9P4fn6xa";
const SPL_ACCOUNT_TWO = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";
const TOKEN_2022_ACCOUNT = "B5PrYwGW7KqYBUoab2GsKftCW8tzPKcZy9MSNEbvU5DF";
const MINT_ONE = "Ht3cqPuEUR6jiNiFsF1n93TPokuq1jqiMKujAjDdxXCB";
const MINT_TWO = "2NrDzgpDWQKKHmVJZqQVn3XjMt6WGhLdrr941RtzsQZG";

function tokenAccount({
  pubkey,
  mint,
  amount,
  decimals,
  programId,
  parser,
  state = "initialized",
  owner = WALLET,
  extensions,
}: {
  pubkey: string;
  mint: string;
  amount: string;
  decimals: number;
  programId: string;
  parser: "spl-token" | "spl-token-2022";
  state?: string;
  owner?: string;
  extensions?: unknown;
}) {
  return {
    pubkey,
    account: {
      lamports: 2_039_280,
      executable: false,
      owner: programId,
      data: {
        program: parser,
        parsed: {
          type: "account",
          info: {
            mint,
            owner,
            state,
            isNative: false,
            tokenAmount: {
              amount,
              decimals,
              uiAmount: null,
              uiAmountString: "ignored",
            },
            ...(extensions === undefined ? {} : { extensions }),
          },
        },
      },
    },
  };
}

function fixtureCall(
  overrides: {
    balance?: unknown;
    spl?: unknown[];
    token2022?: unknown[];
    genesis?: unknown;
    failMethod?: string;
  } = {},
): { call: RpcCall; methods: string[] } {
  const methods: string[] = [];
  const call: RpcCall = async (method, params) => {
    methods.push(method);
    if (overrides.failMethod === method) {
      throw new PortfolioRpcError("RPC_TIMEOUT", `${method} timed out`, true);
    }
    if (method === "getGenesisHash") {
      return overrides.genesis ?? MAINNET_GENESIS_HASH;
    }
    if (method === "getBalance") {
      return {
        context: { slot: 400_000_001 },
        value: overrides.balance ?? 0,
      };
    }
    const filter = params[1] as { programId: string };
    const isSpl = filter.programId === SPL_TOKEN_PROGRAM_ID;
    return {
      context: { slot: isSpl ? 400_000_002 : 400_000_003 },
      value: isSpl ? (overrides.spl ?? []) : (overrides.token2022 ?? []),
    };
  };
  return { call, methods };
}

test("formats base units without floating-point conversion", () => {
  assert.equal(formatBaseUnits(0n, 9), "0.000000000");
  assert.equal(formatBaseUnits(1n, 0), "1");
  assert.equal(formatBaseUnits(1n, 6), "0.000001");
  assert.equal(formatBaseUnits(1_234_567_890n, 9), "1.234567890");
  assert.equal(
    formatBaseUnits(18_446_744_073_709_551_615n, 6),
    "18446744073709.551615",
  );
});

test("validates canonical public keys and rejects malformed wallet input", () => {
  assert.equal(validateWalletAddress(WALLET), WALLET);
  assert.equal(validateWalletAddress(` ${WALLET} `), WALLET);
  for (const value of ["", "not-a-key", "0".repeat(44)]) {
    assert.throws(
      () => validateWalletAddress(value),
      (error: unknown) =>
        error instanceof PortfolioRpcError && error.code === "INVALID_ADDRESS",
    );
  }
});

test("reads SOL, SPL and Token-2022 accounts with exact aggregation", async () => {
  const { call, methods } = fixtureCall({
    balance: "18446744073709551615",
    spl: [
      tokenAccount({
        pubkey: SPL_ACCOUNT_ONE,
        mint: MINT_ONE,
        amount: "9007199254740993",
        decimals: 6,
        programId: SPL_TOKEN_PROGRAM_ID,
        parser: "spl-token",
      }),
      tokenAccount({
        pubkey: SPL_ACCOUNT_TWO,
        mint: MINT_ONE,
        amount: "7",
        decimals: 6,
        programId: SPL_TOKEN_PROGRAM_ID,
        parser: "spl-token",
        state: "frozen",
      }),
    ],
    token2022: [
      tokenAccount({
        pubkey: TOKEN_2022_ACCOUNT,
        mint: MINT_TWO,
        amount: "5000000",
        decimals: 6,
        programId: TOKEN_2022_PROGRAM_ID,
        parser: "spl-token-2022",
        extensions: [{ extension: "immutableOwner" }],
      }),
    ],
  });
  const result = await readPortfolioWithRpc(WALLET, call, "rpc.example.com");
  assert.deepEqual(methods.sort(), [
    "getBalance",
    "getGenesisHash",
    "getTokenAccountsByOwner",
    "getTokenAccountsByOwner",
  ]);
  assert.equal(result.sol.lamports, "18446744073709551615");
  assert.equal(result.sol.amount, "18446744073.709551615");
  assert.equal(result.splToken.accounts.length, 2);
  assert.equal(result.splToken.mints[0]?.rawAmount, "9007199254741000");
  assert.equal(result.splToken.mints[0]?.amount, "9007199254.741000");
  assert.equal(result.splToken.mints[0]?.accountCount, 2);
  assert.equal(result.splToken.accounts[1]?.state, "frozen");
  assert.deepEqual(result.token2022.accounts[0]?.extensions, [
    "immutableOwner",
  ]);
  assert.equal(result.token2022.accounts[0]?.amount, "5.000000");
  assert.equal(result.splToken.contextSlot, 400_000_002);
  assert.equal(result.token2022.contextSlot, 400_000_003);
  assert.equal(result.snapshotAtomic, false);
  assert.equal(isPortfolioResponse(result), true);
});

test("represents an empty wallet without inventing holdings", async () => {
  const { call } = fixtureCall();
  const result = await readPortfolioWithRpc(WALLET, call, "rpc.example.com");
  assert.equal(result.sol.amount, "0.000000000");
  assert.deepEqual(result.splToken.accounts, []);
  assert.deepEqual(result.token2022.mints, []);
});

test("rejects duplicate account identities across program queries", async () => {
  const duplicated = tokenAccount({
    pubkey: SPL_ACCOUNT_ONE,
    mint: MINT_ONE,
    amount: "1",
    decimals: 0,
    programId: SPL_TOKEN_PROGRAM_ID,
    parser: "spl-token",
  });
  const duplicate2022 = tokenAccount({
    pubkey: SPL_ACCOUNT_ONE,
    mint: MINT_TWO,
    amount: "1",
    decimals: 0,
    programId: TOKEN_2022_PROGRAM_ID,
    parser: "spl-token-2022",
  });
  const { call } = fixtureCall({
    spl: [duplicated],
    token2022: [duplicate2022],
  });
  await assert.rejects(
    readPortfolioWithRpc(WALLET, call, "rpc.example.com"),
    /returned more than once/,
  );
});

test("rejects unexpected token programs, owners and parsed account states", async () => {
  const cases = [
    tokenAccount({
      pubkey: SPL_ACCOUNT_ONE,
      mint: MINT_ONE,
      amount: "1",
      decimals: 0,
      programId: TOKEN_2022_PROGRAM_ID,
      parser: "spl-token",
    }),
    tokenAccount({
      pubkey: SPL_ACCOUNT_ONE,
      mint: MINT_ONE,
      amount: "1",
      decimals: 0,
      programId: SPL_TOKEN_PROGRAM_ID,
      parser: "spl-token",
      owner: SPL_ACCOUNT_TWO,
    }),
    tokenAccount({
      pubkey: SPL_ACCOUNT_ONE,
      mint: MINT_ONE,
      amount: "1",
      decimals: 0,
      programId: SPL_TOKEN_PROGRAM_ID,
      parser: "spl-token",
      state: "paused",
    }),
  ];
  for (const row of cases) {
    const { call } = fixtureCall({ spl: [row] });
    await assert.rejects(
      readPortfolioWithRpc(WALLET, call, "rpc.example.com"),
      PortfolioRpcError,
    );
  }
});

test("fails closed on malformed RPC quantities and inventories", async () => {
  const badRows = [
    tokenAccount({
      pubkey: SPL_ACCOUNT_ONE,
      mint: MINT_ONE,
      amount: "-1",
      decimals: 0,
      programId: SPL_TOKEN_PROGRAM_ID,
      parser: "spl-token",
    }),
    tokenAccount({
      pubkey: SPL_ACCOUNT_ONE,
      mint: MINT_ONE,
      amount: "18446744073709551616",
      decimals: 0,
      programId: SPL_TOKEN_PROGRAM_ID,
      parser: "spl-token",
    }),
    tokenAccount({
      pubkey: SPL_ACCOUNT_ONE,
      mint: MINT_ONE,
      amount: "1",
      decimals: 256,
      programId: SPL_TOKEN_PROGRAM_ID,
      parser: "spl-token",
    }),
  ];
  for (const row of badRows) {
    const { call } = fixtureCall({ spl: [row] });
    await assert.rejects(
      readPortfolioWithRpc(WALLET, call, "rpc.example.com"),
      PortfolioRpcError,
    );
  }
  const { call: wrongGenesis } = fixtureCall({ genesis: "devnet" });
  await assert.rejects(
    readPortfolioWithRpc(WALLET, wrongGenesis, "rpc.example.com"),
    (error: unknown) =>
      error instanceof PortfolioRpcError && error.code === "WRONG_CLUSTER",
  );
});

test("propagates partial RPC failure instead of returning partial holdings", async () => {
  const { call } = fixtureCall({ failMethod: "getTokenAccountsByOwner" });
  await assert.rejects(
    readPortfolioWithRpc(WALLET, call, "rpc.example.com"),
    (error: unknown) =>
      error instanceof PortfolioRpcError && error.code === "RPC_TIMEOUT",
  );
});

test("validates configured RPC destinations and HTTP rate limits", () => {
  assert.throws(
    () => validateRpcUrl(undefined),
    (error: unknown) =>
      error instanceof PortfolioRpcError &&
      error.code === "RPC_CONFIGURATION_INVALID",
  );
  assert.equal(validateRpcUrl(DEFAULT_SOLANA_RPC_URL).href, DEFAULT_SOLANA_RPC_URL + "/");
  assert.equal(
    validateRpcUrl("https://rpc.example.com/path?api-key=secret").hostname,
    "rpc.example.com",
  );
  for (const value of [
    "",
    "http://api.mainnet.solana.com",
    "https://localhost/rpc",
    "https://127.0.0.1/rpc",
    "https://user:pass@rpc.example.com",
    "https://rpc.example.com/#fragment",
    "https://rpc.example.com:444/rpc",
  ]) {
    assert.throws(
      () => validateRpcUrl(value),
      (error: unknown) =>
        error instanceof PortfolioRpcError &&
        error.code === "RPC_CONFIGURATION_INVALID",
    );
  }
  assert.equal(rpcHttpStatusError(200), null);
  assert.equal(rpcHttpStatusError(429)?.code, "RPC_RATE_LIMITED");
  assert.equal(rpcHttpStatusError(503)?.code, "RPC_UNAVAILABLE");
});

test("rejects private, local, reserved and malformed resolved RPC addresses", () => {
  for (const value of [
    "0.0.0.0",
    "10.0.0.1",
    "127.0.0.1",
    "169.254.1.1",
    "172.16.0.1",
    "192.168.0.1",
    "198.51.100.2",
    "203.0.113.2",
    "224.0.0.1",
    "::",
    "::1",
    "fc00::1",
    "fe80::1",
    "ff02::1",
    "2001:db8::1",
    "not-an-address",
  ]) {
    assert.equal(isPublicRpcAddress(value), false, value);
  }
  assert.equal(isPublicRpcAddress("1.1.1.1"), true);
  assert.equal(isPublicRpcAddress("2606:4700:4700::1111"), true);
});

test('invalid wallet input is rejected before reading or resolving RPC configuration',async()=>{
  for (const address of ['', 'invalid wallet', 'not-base58']) {
    await assert.rejects(readLivePortfolio(address,{rpcUrl:''}),(error:unknown)=>error instanceof PortfolioRpcError && error.code==='INVALID_ADDRESS');
  }
});
test('a valid wallet still reports missing RPC configuration',async()=>{
  await assert.rejects(readLivePortfolio('11111111111111111111111111111111',{rpcUrl:''}),(error:unknown)=>error instanceof PortfolioRpcError && error.code==='RPC_CONFIGURATION_INVALID');
});

test("rejects per-mint totals above u64 while preserving the exact boundary", async () => {
  for (const first of ['18446744073709551615', '18446744073709551614']) {
    const { call } = fixtureCall({ spl: [first, '1'].map((amount, index) => tokenAccount({ pubkey: index ? SPL_ACCOUNT_TWO : SPL_ACCOUNT_ONE, mint: MINT_ONE, amount, decimals: 6, programId: SPL_TOKEN_PROGRAM_ID, parser: 'spl-token' })) });
    if (first.endsWith('615')) {
      await assert.rejects(readPortfolioWithRpc(WALLET, call, 'rpc.example.com'), (error: unknown) => error instanceof PortfolioRpcError && error.code === 'RPC_RESPONSE_INVALID');
    } else {
      const result = await readPortfolioWithRpc(WALLET, call, 'rpc.example.com');
      assert.equal(result.splToken.mints[0].rawAmount, '18446744073709551615');
    }
  }
});
