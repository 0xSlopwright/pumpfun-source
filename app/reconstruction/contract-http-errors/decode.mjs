// Independently maintained names for the operations in captured factories
// 898661, 858694 and 525364. No captured module is imported or evaluated.
const ERROR_CODE_PATTERN = /^[A-Z][A-Z0-9_]+$/;

export function domainCode(body) {
  if (typeof body !== "object" || body === null) return null;
  const { error } = body;
  return typeof error === "string" && ERROR_CODE_PATTERN.test(error)
    ? error
    : null;
}

export class ContractError extends Error {
  constructor(route, status, body, data, serverMessage, cause) {
    let code;
    super(
      `${route} responded ${status}${(code = domainCode(body)) ? ` ${code}` : ""}`,
    );
    this.route = route;
    this.status = status;
    this.body = body;
    this.data = data;
    this.serverMessage = serverMessage;
    this.name = "ContractError";
    this.code = domainCode(body);
    this.cause = cause;
  }

  is(status) {
    return this.status === status;
  }
}

export function isContractError(error, route) {
  return (
    error instanceof ContractError &&
    (route === undefined || error.route === route)
  );
}

function responseFor(error) {
  if (typeof error !== "object" || error === null) return undefined;
  const response = error.response;
  if (typeof response !== "object" || response === null) return undefined;
  const { status, text } = response;
  return typeof status === "number" && typeof text === "function"
    ? response
    : undefined;
}

function serverMessage(body) {
  if (typeof body !== "object" || body === null) return undefined;
  const { message } = body;
  return typeof message === "string"
    ? message
    : Array.isArray(message)
      ? message.filter((value) => typeof value === "string").join("; ")
      : undefined;
}

// The caller must supply the actual route catalog and schema implementations.
// Keeping safeParse as an explicit boundary avoids approximating captured Zod.
export async function normalizeContractHttpError(
  route,
  error,
  { contracts, routeErrorSchema, contractErrorBody } = {},
) {
  const response = responseFor(error);
  if (!response) return undefined;
  let body;
  try {
    const text = await response.text();
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  } catch {
    body = undefined;
  }
  const contract = contracts[route];
  const schema = contract
    ? routeErrorSchema(contract, response.status)
    : undefined;
  const declared =
    schema && schema !== true ? schema.safeParse(body) : undefined;
  const generic = contractErrorBody.safeParse(body);
  return new ContractError(
    route,
    response.status,
    body,
    declared?.success
      ? declared.data
      : generic.success
        ? generic.data
        : { statusCode: response.status },
    serverMessage(body),
    error,
  );
}

// Mirrors the actual createContractClient request catch. Preflight request/query
// encoding, retries and schema construction remain outside this adapter.
export async function withContractErrorNormalization(route, request, parsers) {
  try {
    return await request();
  } catch (error) {
    throw (await normalizeContractHttpError(route, error, parsers)) ?? error;
  }
}
