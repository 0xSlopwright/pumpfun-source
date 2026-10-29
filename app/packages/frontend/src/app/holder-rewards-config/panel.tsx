"use client";
import { useEffect, useRef, useState } from "react";
import { readHolderConfiguration } from "./client";
import type { HolderConfiguration } from "./types";
type State =
  | { status: "idle" | "loading" }
  | { status: "error" }
  | { status: "ready"; value: HolderConfiguration };
const unknown = "Unknown. The field is not present in this account version.";
const flag = (value: boolean | null) =>
  value === null ? unknown : value ? "Stored true" : "Stored false";
export function HolderConfigurationPanel({
  mint,
  rewardsPda,
}: {
  mint: string;
  rewardsPda: string;
}) {
  const [state, setState] = useState<State>({ status: "idle" });
  const pending = useRef<AbortController | null>(null),
    generation = useRef(0),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      generation.current++;
      pending.current?.abort();
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );
  async function read() {
    const sequence = ++generation.current;
    pending.current?.abort();
    if (timer.current !== null) clearTimeout(timer.current);
    const controller = new AbortController();
    pending.current = controller;
    setState({ status: "loading" });
    const deadline = setTimeout(() => {
      if (sequence !== generation.current) return;
      generation.current++;
      controller.abort();
      setState({ status: "error" });
    }, 20_000);
    timer.current = deadline;
    try {
      const value = await readHolderConfiguration(
        mint,
        rewardsPda,
        controller.signal,
      );
      if (sequence === generation.current && !controller.signal.aborted)
        setState({ status: "ready", value });
    } catch {
      if (sequence === generation.current && !controller.signal.aborted)
        setState({ status: "error" });
    } finally {
      clearTimeout(deadline);
      if (timer.current === deadline) timer.current = null;
      if (pending.current === controller) pending.current = null;
    }
  }
  const value = state.status === "ready" ? state.value : null;
  return (
    <section
      className="rounded-2xl border border-border-secondary bg-bg-secondary p-5 sm:p-7"
      aria-labelledby="holder-configuration-title"
      data-testid="holder-configuration"
    >
      <h2
        id="holder-configuration-title"
        className="text-xl font-semibold text-text-primary"
      >
        Public holder-reward configuration
      </h2>
      <p className="mt-2 text-sm leading-6 text-text-tertiary">
        Inspect the program's public Global and curve account records for this
        mint. Stored flags describe configuration; they do not establish reward
        eligibility, payout amounts or whether a transaction could succeed.
      </p>
      <button
        type="button"
        className="mt-4 min-h-11 rounded-lg border border-border-tertiary px-4 py-2 text-sm font-semibold text-text-primary hover:bg-bg-tertiary disabled:opacity-50"
        disabled={state.status === "loading"}
        onClick={() => void read()}
      >
        {state.status === "loading"
          ? "Reading public configuration…"
          : value
            ? "Refresh public configuration"
            : "Read public configuration"}
      </button>
      {state.status === "loading" && (
        <p className="mt-3 text-sm text-text-tertiary" role="status">
          Reading public accounts. No wallet or signature is requested.
        </p>
      )}
      {state.status === "error" && (
        <p className="mt-3 text-sm text-text-error" role="alert">
          Public configuration is unavailable or unsupported. No eligibility is
          inferred.
        </p>
      )}
      {value && (
        <div
          className="mt-5 grid min-w-0 gap-4 text-sm"
          data-testid="holder-configuration-result"
        >
          <p className="break-words text-text-tertiary">
            Response slot {value.contextSlot} · mainnet-beta · confirmed ·{" "}
            {value.endpointHost} ·{" "}
            <time dateTime={value.observedAt}>
              {new Date(value.observedAt).toISOString()}
            </time>
          </p>
          <section
            className="min-w-0 rounded-xl border border-border-tertiary p-4"
            aria-label="Global configuration"
          >
            <h3 className="font-semibold">Global configuration</h3>
            <p className="mt-1 break-all font-mono text-xs text-text-tertiary">
              {value.globalPda}
            </p>
            {value.global.status === "missing" ? (
              <p className="mt-3">
                No Global account was returned in this observation. Its fields
                remain unknown.
              </p>
            ) : (
              <dl className="mt-3 grid gap-3">
                <div>
                  <dt className="text-text-tertiary">
                    New holder-reward coin creation/conversion flag
                  </dt>
                  <dd data-testid="holder-global-flag">
                    {flag(value.global.isHolderRewardEnabled)}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-tertiary">
                    Encoded claim authority
                  </dt>
                  <dd className="break-all font-mono">
                    {value.global.holderRewardClaimAuthority ?? unknown}
                  </dd>
                </div>
              </dl>
            )}
            <p className="mt-3 leading-6 text-text-tertiary">
              The creation/conversion flag is not a general switch for
              existing-coin payouts. A public authority address is not evidence
              that this browser controls it.
            </p>
          </section>
          <section
            className="min-w-0 rounded-xl border border-border-tertiary p-4"
            aria-label="Curve configuration"
          >
            <h3 className="font-semibold">Curve configuration</h3>
            <p className="mt-1 break-all font-mono text-xs text-text-tertiary">
              {value.curvePda}
            </p>
            {value.curve.status === "missing" ? (
              <p className="mt-3">
                No curve account was returned in this observation. This does not
                establish holder eligibility.
              </p>
            ) : (
              <dl className="mt-3 grid gap-3">
                <div>
                  <dt className="text-text-tertiary">
                    Curve holder-reward flag
                  </dt>
                  <dd data-testid="holder-curve-flag">
                    {flag(value.curve.isHolderReward)}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-tertiary">Encoded creator</dt>
                  <dd className="break-all font-mono">
                    {value.curve.creator ?? unknown}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-tertiary">
                    Creator field equals the derived holder-rewards PDA
                  </dt>
                  <dd>
                    {value.curve.creatorMatchesHolderRewardsPda === null
                      ? "Unknown"
                      : value.curve.creatorMatchesHolderRewardsPda
                        ? "Yes"
                        : "No"}
                  </dd>
                </div>
              </dl>
            )}
          </section>
          <p className="leading-6 text-text-tertiary">
            Older account versions can omit these fields. SDK defaults for
            missing bytes are shown as unknown here. Refresh for a new
            observation; these two configuration records share one response
            slot.
          </p>
        </div>
      )}
    </section>
  );
}
