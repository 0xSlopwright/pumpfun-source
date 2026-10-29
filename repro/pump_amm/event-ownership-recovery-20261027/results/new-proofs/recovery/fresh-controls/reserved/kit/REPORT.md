# Reserved recipient account guards: checkpoint 642 negative control

This packet binds original `6a7ad345...` and selected checkpoint 642 `3fcae021...` to 21 distinct local signed inputs. It preserves all 42 signatures, serialized transactions, complete non-executable transaction-account snapshots, raw logs, return data and inner instructions. Runtime-loaded program digests are bound to each side. The input fixtures use an ordinary locally owned admin key; no chain action is performed.

The original `set_reserved_fee_recipients` handler at `0x19138` collects the first eight recipient keys, reads Rent once, and checks each account in index order: nonzero key, not executable, then rent exemption using actual lamports/data length. Executable and rent failures are Anchor errors 2007 and 2005 with the exact account name `reserved_fee_recipients[i]`. Its length guard is `require_gte!`, including Left/Right comparison logs. The raw original body, calls, and string evidence are retained in `static-evidence.json`.

Checkpoint 642 checks only the nonzero keys. The 21 cases have 11 mismatches:

- Eight cases: executable or non-rent-exempt accounts at index 0 or 7 are accepted instead of rejected. This includes one lamport below the exact rent threshold.
- Two cases: an earlier executable/rent failure is replaced by a later zero-key error.
- One case: a short list returns the correct 6044 error but omits the original `Left: 7` and `Right: 8` logs.

The six successful original controls include an exact rent boundary, duplicate recipients, more than eight remaining accounts, and a non-system-owned recipient with enough lamports. Those controls constrain the correction: it must not invent uniqueness, owner, or exact-count checks.

`recovery.patch` is the minimal proposed source fix. It retains the existing array, gathers keys, reads Rent, then applies the original per-index checks and names. The original Vec allocation remains a separate structural difference. The proposed source has not been compiled in this packet. Root integration must run the positive replay; this is deliberately a negative checkpoint proof.

## Verification

Saved negative proof, portable with the existing Python/solders environment:

```
work/test-env/bin/python -B <packet>/verify.py
```

For a freshly built corrected candidate, run the frozen producer from its existing repository location using a new empty output directory and empty unique bytecode cache:

```
PYTHONPYCACHEPREFIX=<empty-cache-dir> work/test-env/bin/python -B \
  work/amm-reserved-account-guards-next-20261027/observer.py <new-dir>/transactions.json.gz \
  work/amm-reserved-account-guards-next-20261027/probe.py \
  --candidate <candidate.so> --output <new-dir>/report.json.gz
work/test-env/bin/python -B <packet>/verify.py \
  --candidate <candidate.so> --reports <new-dir>
```

The replay verifier defaults to zero mismatches. The 11-mismatch allowance is accepted only for the exact pinned checkpoint-642 artifact; it cannot excuse differences in a new candidate. All log content is retained except the existing narrowly defined compute-consumption and source-location normalization.
