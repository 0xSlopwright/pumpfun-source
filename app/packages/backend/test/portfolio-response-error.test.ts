import assert from "node:assert/strict";
import test from "node:test";
import { EventEmitter } from "node:events";
import dns from "node:dns/promises";
import https from "node:https";
import { createRequire, syncBuiltinESMExports } from "node:module";
const { readLivePortfolio, PortfolioRpcError } = createRequire(import.meta.url)("../../frontend/src/app/portfolio/rpc.ts");

test("a response stream reset rejects the portfolio read promptly", async (t) => {
  const reset = Object.assign(new Error("aborted"), { code: "ECONNRESET" });
  t.mock.method(dns, "lookup", async () => [{ address: "8.8.8.8", family: 4 }]);
  t.mock.method(https, "request", (_url: unknown, _options: unknown, callback: (response: EventEmitter) => void) => {
    const request = new EventEmitter() as EventEmitter & { end(): void };
    request.end = () => queueMicrotask(() => {
      const response = new EventEmitter();
      // Observe the synthetic transport error without crashing the test process.
      response.on("error", () => {});
      callback(response);
      response.emit("data", Buffer.from('{"jsonrpc":"2.0",'));
      response.emit("aborted");
      response.emit("error", reset);
      response.emit("close");
    });
    return request;
  });
  syncBuiltinESMExports();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      readLivePortfolio("HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH", { rpcUrl: "https://rpc.example.test", timeoutMs: 10_000 }).then(() => "resolved", error => error),
      new Promise(resolve => { timer = setTimeout(() => resolve("still pending after stream failure"), 100); }),
    ]);
    assert.ok(result instanceof PortfolioRpcError, String(result));
    assert.equal(result.code, "RPC_UNAVAILABLE");
  } finally {
    clearTimeout(timer);
    t.mock.restoreAll();
    syncBuiltinESMExports();
  }
});
