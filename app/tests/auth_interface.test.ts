import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  AuthDialogController,
  type AuthTimer,
} from "../packages/frontend/src/app/auth/auth-controller.ts";
import {
  AUTH_OPEN_TIMEOUT_MS,
  parseAuthPresentation,
  unavailableAuthAdapter,
  walletChoices,
  type AuthPresentation,
  type AuthPresentationAdapter,
} from "../packages/frontend/src/app/auth/auth-model.ts";

const flush = async () => {
  for (let i = 0; i < 6; i++) await Promise.resolve();
};

function deferred() {
  let resolve!: (value: unknown) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<unknown>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

function synthetic(
  overrides: Partial<AuthPresentation> = {},
): AuthPresentation {
  return {
    source: "synthetic-test",
    session: "anonymous",
    recentWallet: null,
    wallets: [
      { name: "Phantom", readiness: "loadable" },
      { name: "Coinbase Wallet", readiness: "loadable" },
      { name: "Test Wallet", readiness: "installed" },
      { name: "Another Test Wallet", readiness: "installed" },
    ],
    ...overrides,
  };
}

function manualTimer() {
  let next = 0;
  const tasks = new Map<number, { callback: () => void; delay: number }>();
  const timer: AuthTimer = {
    set(callback, delay) {
      const id = ++next;
      tasks.set(id, { callback, delay });
      return id as unknown as ReturnType<typeof setTimeout>;
    },
    clear(id) {
      tasks.delete(id as unknown as number);
    },
  };
  return {
    timer,
    tasks,
    fire() {
      for (const [id, task] of tasks) {
        tasks.delete(id);
        task.callback();
      }
    },
  };
}

test("default adapter reports unavailable, never detected wallets or a session", async () => {
  const value = parseAuthPresentation(
    await unavailableAuthAdapter.read(new AbortController().signal),
  );
  assert.equal(value.source, "unavailable");
  assert.equal(value.session, "unavailable");
  assert.equal(value.recentWallet, null);
  assert.deepEqual(
    walletChoices(value, false).map((wallet) => wallet.name),
    ["Phantom", "Coinbase Wallet"],
  );
  assert.deepEqual(
    walletChoices(value, true).map((wallet) => wallet.name),
    ["Phantom", "Coinbase Wallet", "Magic Eden"],
  );
  assert(value.wallets.every((wallet) => wallet.readiness === "unavailable"));
  const cancelled = new AbortController();
  cancelled.abort();
  await assert.rejects(unavailableAuthAdapter.read(cancelled.signal), {
    name: "AbortError",
  });
});

test("synthetic states require explicit opt-in and signed-in claims are always rejected", () => {
  assert.throws(() => parseAuthPresentation(synthetic()), /source/);
  assert.equal(
    parseAuthPresentation(synthetic(), true).source,
    "synthetic-test",
  );
  for (const session of [
    "authenticated",
    "signed-in",
    "connected",
    "resolving",
    null,
  ]) {
    assert.throws(
      () => parseAuthPresentation({ ...synthetic(), session }, true),
      /session/,
    );
  }
  for (const session of ["anonymous", "expired"]) {
    assert.throws(
      () =>
        parseAuthPresentation({
          ...synthetic(),
          source: "unavailable",
          wallets: [],
          recentWallet: null,
          session,
        }),
      /session/,
    );
  }
  assert.throws(
    () =>
      parseAuthPresentation({
        ...synthetic(),
        source: "unavailable",
        session: "unavailable",
      }),
    /detected/,
  );
});

test("read contract rejects invalid names, readiness, duplicates and missing recent identity", () => {
  assert.throws(
    () =>
      parseAuthPresentation(
        {
          ...synthetic(),
          wallets: [
            { name: "Test", readiness: { toString: () => "installed" } },
          ],
        },
        true,
      ),
    /wallet/,
  );
  for (const name of ["", " Duplicate ", "x\n", "x".repeat(81), 10]) {
    assert.throws(() =>
      parseAuthPresentation(
        { ...synthetic(), wallets: [{ name, readiness: "installed" }] },
        true,
      ),
    );
  }
  assert.throws(() =>
    parseAuthPresentation(
      {
        ...synthetic(),
        wallets: Array(101).fill({ name: "Test", readiness: "loadable" }),
      },
      true,
    ),
  );
  assert.throws(() =>
    parseAuthPresentation(
      { ...synthetic(), wallets: [{ name: "Test", readiness: "connected" }] },
      true,
    ),
  );
  assert.throws(() =>
    parseAuthPresentation(
      {
        ...synthetic(),
        wallets: [synthetic().wallets[0], synthetic().wallets[0]],
      },
      true,
    ),
  );
  assert.throws(() =>
    parseAuthPresentation(synthetic({ recentWallet: "Missing" }), true),
  );
  assert.throws(() => parseAuthPresentation(null, true));
});

test("wallet preview mirrors recent/installed priority, fallback and stable ordering without mutation", () => {
  const value = parseAuthPresentation(
    synthetic({ recentWallet: "Coinbase Wallet" }),
    true,
  );
  const before = JSON.stringify(value);
  assert.deepEqual(
    walletChoices(value, false).map((wallet) => wallet.name),
    ["Coinbase Wallet", "Test Wallet"],
  );
  assert.deepEqual(
    walletChoices(value, true).map((wallet) => wallet.name),
    ["Coinbase Wallet", "Test Wallet", "Another Test Wallet", "Phantom"],
  );
  assert.equal(JSON.stringify(value), before);
  assert.deepEqual(
    walletChoices(
      parseAuthPresentation(synthetic({ wallets: [] }), true),
      false,
    ),
    [],
  );
  assert.deepEqual(
    walletChoices(
      parseAuthPresentation(
        synthetic({ wallets: [{ name: "Test only", readiness: "loadable" }] }),
        true,
      ),
      false,
    ),
    [],
  );
});

test("open, ready, expand, back and close; repeated open does not create extra reads", async () => {
  let reads = 0;
  const clock = manualTimer();
  const controller = new AuthDialogController(
    {
      async read() {
        reads++;
        return synthetic();
      },
    },
    { allowSynthetic: true, timer: clock.timer },
  );
  controller.retry();
  assert.equal(controller.getSnapshot().status, "closed");
  controller.open();
  controller.open();
  assert.equal(controller.getSnapshot().status, "loading");
  assert.equal([...clock.tasks.values()][0].delay, AUTH_OPEN_TIMEOUT_MS);
  await flush();
  assert.equal(reads, 1);
  assert.equal(clock.tasks.size, 0);
  assert.equal(controller.getSnapshot().status, "ready");
  controller.setExpanded(true);
  assert.equal(
    (controller.getSnapshot() as { expanded: boolean }).expanded,
    true,
  );
  controller.setExpanded(false);
  assert.equal(
    (controller.getSnapshot() as { expanded: boolean }).expanded,
    false,
  );
  controller.close();
  controller.setExpanded(true);
  controller.retry();
  assert.equal(controller.getSnapshot().status, "closed");
});

test("close before the microtask prevents the adapter from being called", async () => {
  let reads = 0;
  const controller = new AuthDialogController({
    async read() {
      reads++;
      return synthetic();
    },
  });
  controller.open();
  controller.close();
  await flush();
  assert.equal(reads, 0);
  assert.equal(controller.getSnapshot().status, "closed");
});

test("failure and retry redact errors, clear timer and reset expanded state", async () => {
  let reads = 0;
  const clock = manualTimer();
  const controller = new AuthDialogController(
    {
      read() {
        if (++reads === 1)
          throw new Error("PRIVATE provider payload must never appear");
        return Promise.resolve(synthetic({ session: "expired" }));
      },
    },
    { allowSynthetic: true, timer: clock.timer },
  );
  controller.open();
  await flush();
  assert.deepEqual(controller.getSnapshot(), {
    status: "error",
    reason: "failed",
  });
  assert.equal(clock.tasks.size, 0);
  controller.retry();
  controller.retry();
  await flush();
  assert.equal(reads, 2);
  const state = controller.getSnapshot();
  assert.equal(state.status, "ready");
  if (state.status === "ready") {
    assert.equal(state.expanded, false);
    assert.equal(state.presentation.session, "expired");
  }
});

test("timeout aborts the read and late completion cannot erase error or newer results", async () => {
  const old = deferred();
  let signal: AbortSignal | undefined;
  let reads = 0;
  const clock = manualTimer();
  const controller = new AuthDialogController(
    {
      read(current) {
        if (++reads === 1) {
          signal = current;
          return old.promise;
        }
        return Promise.resolve(synthetic({ session: "expired" }));
      },
    },
    { allowSynthetic: true, timer: clock.timer },
  );
  controller.open();
  await flush();
  clock.fire();
  assert.deepEqual(controller.getSnapshot(), {
    status: "error",
    reason: "timeout",
  });
  assert.equal(signal?.aborted, true);
  controller.retry();
  await flush();
  old.resolve(synthetic());
  await flush();
  const state = controller.getSnapshot();
  assert.equal(state.status, "ready");
  if (state.status === "ready")
    assert.equal(state.presentation.session, "expired");
  assert.equal(clock.tasks.size, 0);
});

test("dismiss, reopen and dispose reject stale resolve/reject and release all timers", async () => {
  const old = deferred();
  const next = deferred();
  const signals: AbortSignal[] = [];
  const clock = manualTimer();
  const controller = new AuthDialogController(
    {
      read(signal) {
        signals.push(signal);
        return signals.length === 1 ? old.promise : next.promise;
      },
    },
    { allowSynthetic: true, timer: clock.timer },
  );
  let changes = 0;
  const unsubscribe = controller.subscribe(() => {
    changes++;
  });
  controller.open();
  await flush();
  controller.close();
  controller.open();
  await flush();
  old.resolve(synthetic());
  await flush();
  assert.equal(controller.getSnapshot().status, "loading");
  assert.equal(signals[0].aborted, true);
  controller.dispose();
  const atDispose = changes;
  next.reject(new Error("late failure"));
  await flush();
  clock.fire();
  unsubscribe();
  assert.equal(controller.getSnapshot().status, "closed");
  assert.equal(signals[1].aborted, true);
  assert.equal(clock.tasks.size, 0);
  assert.equal(changes, atDispose);
});

test("invalid adapter data fails closed rather than rendering an invented session", async () => {
  const adapter: AuthPresentationAdapter = {
    async read() {
      return { source: "live", session: "authenticated" };
    },
  };
  const controller = new AuthDialogController(adapter);
  controller.open();
  await flush();
  assert.deepEqual(controller.getSnapshot(), {
    status: "error",
    reason: "failed",
  });
});

test("product entrypoint is fixed to unavailable adapter and contains no credential collection", async () => {
  const entry = await readFile(
    new URL(
      "../packages/frontend/src/app/auth/sign-in-control.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const ui = await readFile(
    new URL(
      "../packages/frontend/src/app/auth/auth-control.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  // The entrypoint fixes the unavailable adapter; the only forwarded prop is
  // presentation-only trigger class and the fixed public-address-only panel.
  assert.match(
    entry,
    /<AuthControl\s+adapter=\{unavailableAuthAdapter\}\s+publicWallet\s+(?:triggerClassName=\{triggerClassName\}\s+)?\/>/,
  );
  assert.deepEqual(
    [...entry.matchAll(/<AuthControl\b[^>]*>/g)].length,
    1,
  );
  assert.match(
    entry,
    /export function SignInControl\(\{\s*triggerClassName,\s*\}: \{[^}]*triggerClassName\?: string;\s*\} = \{\}\)/,
  );
  assert.doesNotMatch(
    entry,
    /syntheticTest|process\.env|localStorage|sessionStorage|fetch\(/,
  );
  assert.doesNotMatch(
    ui,
    /<(?:input|form|textarea)\b|dangerouslySetInnerHTML|fetch\(|localStorage|sessionStorage|window\.open\(/,
  );
});

test("closing synchronously on loading does not leave an orphan timer", async () => {
  const clock = manualTimer();
  let reads = 0;
  const controller = new AuthDialogController({ read: async () => { reads++; return synthetic(); } }, { timer: clock.timer, allowSynthetic: true });
  controller.subscribe(() => { if (controller.getSnapshot().status === "loading") controller.close(); });
  controller.open();
  await flush();
  assert.equal(controller.getSnapshot().status, "closed");
  assert.equal(clock.tasks.size, 0);
  assert.equal(reads, 0);
  controller.dispose();
});
