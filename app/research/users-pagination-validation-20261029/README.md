# User pagination validates the declared integer bounds

On main `e38a8b97a18d33417e364487eb69f8ed74aff19e`, both local developer
reads `/v1/users` and `/v1/users/search-v2` accepted fractional pagination by
truncating it. Nonfinite or nonnumeric values became absent parameters, and
unsafe integers passed through. All 32 real loopback requests across the two
routes, two pagination fields and eight invalid values returned 200 on that
base. The focused regression failed with `offset=1.5: 200 !== 400`.

The unchanged captured developer specification
`contracts/developer.openapi.json` (SHA-256
`ad2fdc2bbf0b86d92e01f539ca609fff8164fcc44556bb2691378a869f73ad73`)
declares both fields optional integers with minimum -9007199254740991 and
maximum 9007199254740991 on both operations. The test authenticates those
exact declarations instead of introducing a positive lower bound or page cap.

The fix checks both Number-converted values with `Number.isSafeInteger` before
either store read. An invalid value receives the existing local-style 400
`{ statusCode: 400, error: 'INVALID_QUERY' }` envelope. The specification does
not establish this diagnostic's exact text; that text is a local compatibility
choice, not an observed upstream response. Number conversion syntax remains
unchanged; this is not a new lexical grammar for HTTP numeric parameters.

Undefined parameters retain defaults. Valid negative integers retain the
already documented local clamping assumption: negative offset means zero,
negative limit means an empty page. Both signed safe-integer edges are
accepted. The existing API-key gate still runs first; missing or malformed
credentials return 401. Encoded duplicate query keys still return the existing
501 ambiguity result before pagination validation. Successful domain responses
retain their synthetic-data marker, while rejected queries have no domain data
or marker. No response-row projection, underlying store or other endpoint is
changed.

Run from `app/packages/backend`:

```sh
corepack pnpm exec tsx --test test/users-pagination-contract.test.ts test/users.test.ts
corepack pnpm exec tsc --noEmit
```

The new tests exercise actual local HTTP for 32 invalid requests and verify
that neither store method is called, plus valid/default/range edges, current
clamping and auth/duplicate precedence. The same regression test fails on the
base and passes with the source fix. All network requests are to an ephemeral
loopback listener with synthetic test data and a deliberately synthetic
shape-only test credential. No production request or secret is used.

This is bounded local input validation against the published declaration.
Upstream server decoding/error identity, key verification, service availability,
other numeric endpoints and full API compatibility remain unqualified. It adds
no feature milestone, domain seed, backend route, dependency or captured source.
