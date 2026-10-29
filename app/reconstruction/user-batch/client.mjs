// Independent reconstruction of 544930.u. Share the actual maintained error
// class from528600 so typed predicates/retry consumers keep one identity.
import { UserFetchError } from "../profile-lookup/client.mjs";
export const USER_BATCH_LIMIT = 100;

export function parseUserBatchText(text) {
  if (text.trim() === "") throw new UserFetchError({ reason: "empty_body" });
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new UserFetchError({ reason: "invalid_json" });
  }
  if (Array.isArray(value)) return value;
  if (
    value &&
    typeof value === "object" &&
    "users" in value &&
    Array.isArray(value.users)
  )
    return value.users;
  throw new UserFetchError({ reason: "invalid_shape" });
}

export async function requireUserBatchResponse(_request, _options, response) {
  if (!response.ok)
    throw new UserFetchError({ reason: "http_error", status: response.status });
  if (!(await response.clone().text()).trim())
    throw new UserFetchError({ reason: "empty_body" });
}

function requestBatch(transport, addresses, fetchOptions) {
  return transport("POST /users/batch", {
    body: { addresses },
    headers: { "Content-Type": "application/json" },
    ...fetchOptions,
    throwHttpErrors: false,
    parseJson: parseUserBatchText,
    hooks: { afterResponse: [requireUserBatchResponse] },
  });
}

export async function fetchUsersBatch(transport, input) {
  const { fetchOptions, userAddresses } = input;
  if (userAddresses.length <= USER_BATCH_LIMIT)
    return requestBatch(transport, userAddresses, fetchOptions);
  const batches = [];
  for (
    let offset = 0;
    offset < userAddresses.length;
    offset += USER_BATCH_LIMIT
  )
    batches.push(userAddresses.slice(offset, offset + USER_BATCH_LIMIT));
  return (
    await Promise.all(
      batches.map((batch) => requestBatch(transport, batch, fetchOptions)),
    )
  ).flat();
}
