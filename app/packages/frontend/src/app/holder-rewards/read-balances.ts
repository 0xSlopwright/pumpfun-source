import {
  isPortfolioResponse,
  SPL_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  type PortfolioSuccess,
} from "../portfolio/types";

export class PublicBalanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicBalanceError";
  }
}

/** Uses the existing read-only server RPC boundary. A balance is not a reward. */
export async function readPdaBalances(
  address: string,
  options: { signal: AbortSignal; fetch?: typeof fetch },
): Promise<PortfolioSuccess> {
  options.signal.throwIfAborted();
  const response = await (options.fetch ?? fetch)(
    `/api/portfolio?${new URLSearchParams({ address })}`,
    {
      method: "GET",
      credentials: "omit",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: options.signal,
    },
  );
  options.signal.throwIfAborted();
  if (
    !/^application\/json(?:\s*;|$)/i.test(
      response.headers.get("Content-Type") ?? "",
    )
  )
    throw new PublicBalanceError(
      "The public balance service returned an invalid response.",
    );
  const payload: unknown = await response.json();
  options.signal.throwIfAborted();
  if (!isPortfolioResponse(payload))
    throw new PublicBalanceError(
      "The public balance service returned an invalid response.",
    );
  if (!response.ok || !payload.ok) {
    const code = payload.ok ? null : payload.error.code;
    throw new PublicBalanceError(
      code === "RPC_RATE_LIMITED"
        ? "The public RPC service is rate limited. Try again later."
        : code === "RPC_TIMEOUT"
          ? "The public balance request timed out. Try again."
          : "Public balances are unavailable. Try again later.",
    );
  }
  if (
    payload.address !== address ||
    payload.splToken.program !== "spl-token" ||
    payload.splToken.programId !== SPL_TOKEN_PROGRAM_ID ||
    payload.token2022.program !== "token-2022" ||
    payload.token2022.programId !== TOKEN_2022_PROGRAM_ID ||
    [...payload.splToken.accounts, ...payload.token2022.accounts].some(
      (account) => account.owner !== address,
    )
  )
    throw new PublicBalanceError(
      "The public balance response did not match this derived address.",
    );
  return payload;
}
