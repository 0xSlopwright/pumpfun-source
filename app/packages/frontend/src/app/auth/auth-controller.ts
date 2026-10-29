import {
  AUTH_OPEN_TIMEOUT_MS,
  parseAuthPresentation,
  type AuthPresentation,
  type AuthPresentationAdapter,
} from "./auth-model";

export type AuthDialogState =
  | Readonly<{ status: "closed" }>
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "error"; reason: "failed" | "timeout" }>
  | Readonly<{
      status: "ready";
      presentation: AuthPresentation;
      expanded: boolean;
    }>;

type TimerHandle = ReturnType<typeof setTimeout>;
export interface AuthTimer {
  set(callback: () => void, delay: number): TimerHandle;
  clear(handle: TimerHandle): void;
}
const timer: AuthTimer = {
  set: (callback, delay) => setTimeout(callback, delay),
  clear: (handle) => clearTimeout(handle),
};

/** Local concurrency/cancellation mechanics, not upstream auth or session logic. */
export class AuthDialogController {
  private state: AuthDialogState = Object.freeze({ status: "closed" });
  private readonly listeners = new Set<() => void>();
  private attempt = 0;
  private abort: AbortController | null = null;
  private timeout: TimerHandle | null = null;
  private readonly adapter: AuthPresentationAdapter;
  private readonly clock: AuthTimer;
  private readonly allowSynthetic: boolean;

  constructor(
    adapter: AuthPresentationAdapter,
    options: { allowSynthetic?: boolean; timer?: AuthTimer } = {},
  ) {
    this.adapter = adapter;
    this.clock = options.timer ?? timer;
    this.allowSynthetic = options.allowSynthetic === true;
  }

  getSnapshot = (): AuthDialogState => this.state;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private publish(state: AuthDialogState) {
    this.state = Object.freeze(state);
    for (const listener of this.listeners) listener();
  }

  private cancelAttempt() {
    this.attempt += 1;
    this.abort?.abort();
    this.abort = null;
    if (this.timeout !== null) this.clock.clear(this.timeout);
    this.timeout = null;
  }

  open = () => {
    if (this.state.status !== "closed") return;
    this.load();
  };

  retry = () => {
    if (this.state.status === "error") this.load();
  };

  private load() {
    this.cancelAttempt();
    const attempt = this.attempt;
    const abort = new AbortController();
    this.abort = abort;
    this.publish({ status: "loading" });
    if (attempt !== this.attempt || abort.signal.aborted) return;
    this.timeout = this.clock.set(() => {
      if (attempt !== this.attempt) return;
      this.cancelAttempt();
      this.publish({ status: "error", reason: "timeout" });
    }, AUTH_OPEN_TIMEOUT_MS);

    // Promise boundary also catches a synchronous adapter failure.
    Promise.resolve()
      .then(() => {
        abort.signal.throwIfAborted();
        return this.adapter.read(abort.signal);
      })
      .then((value) => {
        if (attempt !== this.attempt || abort.signal.aborted) return;
        const presentation = parseAuthPresentation(value, this.allowSynthetic);
        this.cancelAttempt();
        this.publish({ status: "ready", presentation, expanded: false });
      })
      .catch(() => {
        if (attempt !== this.attempt || abort.signal.aborted) return;
        this.cancelAttempt();
        // Never expose provider errors, URLs, user identity or credential-shaped payloads.
        this.publish({ status: "error", reason: "failed" });
      });
  }

  setExpanded = (expanded: boolean) => {
    if (this.state.status === "ready")
      this.publish({ ...this.state, expanded });
  };

  close = () => {
    this.cancelAttempt();
    if (this.state.status !== "closed") this.publish({ status: "closed" });
  };

  dispose = () => {
    this.cancelAttempt();
    this.listeners.clear();
    this.state = Object.freeze({ status: "closed" });
  };
}
