import { PortfolioRpcError } from "../portfolio/rpc";
import { readLiveHolderConfiguration } from "./server";
import type { HolderConfiguration } from "./types";
const headers = { "Cache-Control": "no-store" };
export async function handleHolderConfiguration(
  request: Request,
  read: (
    mint: string,
    signal?: AbortSignal,
  ) => Promise<HolderConfiguration> = readLiveHolderConfiguration,
): Promise<Response> {
  const url = new URL(request.url),
    mints = url.searchParams.getAll("mint");
  if (request.method !== "GET")
    return Response.json(
      {
        ok: false,
        error: {
          code: "METHOD_NOT_ALLOWED",
          message: "Use GET for public configuration reads.",
          retryable: false,
        },
      },
      { status: 405, headers: { ...headers, Allow: "GET" } },
    );
  if (
    mints.length !== 1 ||
    [...url.searchParams.keys()].some((key) => key !== "mint")
  )
    return Response.json(
      {
        ok: false,
        error: {
          code: "INVALID_ADDRESS",
          message: "Provide exactly one mint public-key address.",
          retryable: false,
        },
      },
      { status: 400, headers },
    );
  try {
    return Response.json(await read(mints[0], request.signal), { headers });
  } catch (error) {
    const code =
      error instanceof PortfolioRpcError ? error.code : "RPC_UNAVAILABLE";
    const status =
      code === "INVALID_ADDRESS"
        ? 400
        : code === "RPC_RATE_LIMITED"
          ? 429
          : code === "RPC_TIMEOUT"
            ? 504
            : [
                  "RPC_CONFIGURATION_INVALID",
                  "RPC_DNS_REJECTED",
                  "WRONG_CLUSTER",
                ].includes(code)
              ? 503
              : 502;
    return Response.json(
      {
        ok: false,
        error: {
          code,
          message: "Public holder configuration is unavailable or unsupported.",
          retryable: error instanceof PortfolioRpcError && error.retryable,
        },
      },
      { status, headers },
    );
  }
}
