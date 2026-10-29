# Known OptionalU64 short-tail gap on the 647-window checkpoint

This immutable negative packet targets candidate `0881a95dafe465623c7220fb3da84b3f9c7d9b0094d572f62487f05cbd80a07c`. It does not change that selected source or its earlier sealed evidence.

All 264 signed CreatePool fixtures enter the original AMM. They exercise zero through seven explicitly supplied optional-u64 prefix bytes with following boolean/trailing bytes, plus complete eight-byte controls. Some assembled tails have at least eight bytes; their actual available length is recorded separately. There are 123 result differences, all with fewer than eight bytes available at the optional-u64 position: 91 different errors and 32 original successes that the candidate rejects. Those 32 also differ in final account snapshots. All 528 original/candidate signatures and identical transaction pairs are verified.

The original wrapper defaults the optional u64 to zero without consuming a short slice, then lets the following optional booleans consume those bytes. The maintained read loop consumes them and constructs a partially zero-padded integer. For example, optional bytes `000001` produce original success and candidate error6028; `0002` produces original instruction-deserialization error102 but candidate error6028 after entering the handler. The first byte of these examples is the optional cashback flag.

This is an entrypoint `&[u8]` observation. It does not establish historical behavior for arbitrary custom Read implementations. A separate proposed read_exact/UnexpectedEof fallback must pass these same cases before being qualified.

Run `python3 -B verify.py` to verify the saved negative evidence without VM execution. The manifest seals the original/candidate/dependency bytes, producers, all comparison fields, full non-executable-account snapshots and receipts. No network or live-chain transactions are involved.
