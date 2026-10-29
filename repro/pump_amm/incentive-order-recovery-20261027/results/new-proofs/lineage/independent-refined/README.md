# Independent PumpSwap refined-source review

Candidate `58478a978292ea6bc4e6a9776a536f91a9384da7f1f82a2e1f9743659a34b58b` independently recounts to **656/785 normalized original windows (83.5669%)**, with **129/785 remaining (16.4331%)**. **148 windows are raw-equal.** Normalized matches cover **826,112/1,162,040 original executable bytes (71.0915%)**; **335,928 bytes remain (28.9085%)**. Whole ELF equality remains false.

The baseline is the 653-window event-ownership candidate `4e6a5617a7a8c3474ed7662f0188df4b1824c08253ebfb08212351ca5249da12`. All existing raw and normalized matches survive. The three complete new normalized bodies are:

| Original window | Bytes | Role | Verified internal direct calls |
|---|---:|---|---:|
| `0x17960` | 3,024 | Disable handler | 9 |
| `0x74e30` | 1,480 | AMM withheld-fee harvest helper | 2 |
| `0xf6eb0` | 2,664 | AnchorSPL withheld-fee harvest provider | 28 |

All **39 internal direct callees** have complete paired normalized bodies and matching relocation patterns. Each new body also has one external `abort` relocation, which is retained separately and is not an authenticated external-provider implementation. Total internal plus external calls are 10, 3 and 29 respectively.

The complete recount includes every original window and checks every worker-reported candidate alternative against the actual original/candidate ELF and candidate symbols. The independent bounded direct-call and recognized-data closure rises from **587 to 592 original windows**. Including recorded source coordinates gives **585**, compared with 580 at baseline. The 64 other normalized matches are not certified by this bounded closure. This does not establish full data, indirect-call, absolute-address, external-provider, original-source or whole-ELF identity.

## Source review

Exactly five files change from the baseline, and the aggregate patch applies to a copied baseline to produce the complete final source tree byte-for-byte:

- `lib.rs`: perform the five Disable flag stores through direct account-field accesses in original order, and reuse the same event for both emissions. The 3,024-byte handler now matches completely under existing normalization.
- `instructions/boost.rs`: restore temporary token-program/pool AccountInfo lifetimes and inline signer-seed temporaries. The resulting InitBoost body is 3,888 bytes against 3,912 in the original; it remains unmatched.
- `instructions/create_pool.rs`: initialize Pool fields before the checked subtraction of the 100-token minimum, with the dedicated error closure. The complete CreatePool body remains unmatched; no source-coordinate fitting is claimed.
- `boost_burn.rs`: call the natural AMM helper through the existing writable-mint gate instead of manually constructing and invoking the SPL instruction.
- `utils/token.rs`: add that helper using the existing AnchorSPL harvest API and natural owned AccountInfo inputs. No Cargo manifest, lock selection, release profile, forced-inline attribute or added dependency changes.

The standalone-to-workspace recipe verifies **51 canonical inputs**, **52 workspace inputs**, and **175 registry files**, totalling **227 compiler inputs**. The nine archive-backed dependency roots contain 166 authenticated archive files and nine Cargo metadata markers. Both recorded strict builds bind the same final source and produce identical stripped and unstripped artifacts; all **762 cached dependency artifacts** remain unchanged. The full historical toolchain/source provenance remains unresolved. The SDK archive is not physically reopened by this saved-evidence review.

This independent packet re-audits static artifacts and build records. It does not execute a new compiler or VM. The separate worker packet owns the fresh full-core and supplemental signed differential executions; no worker packet seal is required here, so a later storage-only repackaging does not invalidate this independent review.

## Remaining work

The [129-window ledger](remaining.md) and [machine-readable audit](remaining-audit.json) assign every remaining original window exactly once. Domain counts are 21 math/token/runtime helpers, 28 liquidity/admin/incentive business windows, 35 instruction error-construction windows, 24 swap/route business windows, 18 state/serialization windows and three generated account-validation windows.

Continue with the large unmatched Deposit/Withdraw, legacy and V2 trades, routes, creator transfer, sweep and incentive bodies; the original transfer-fee representation/decoder and source organization; recognized data/relocation closure; and full binary identity. The separate multi-hop flags iterator lane remains active. InitBoost and CreatePool improvements are structural progress, not new matched windows. Near instruction-shape alternatives in the ledger are diagnostic only and do not increase any completion count.

## Portable verification

Requires Python 3.11 or newer and the standard `patch` command. All inputs resolve inside this packet; recorded historical absolute paths are evidence, not locations read by the verifier.

```sh
python3.11 -B verify.py
```

The API `verify(root=None)` accepts the repository-root argument used by parent checkpoint verifiers, resolves its own artifacts relative to `__file__`, and returns `candidate_sha256`, `normalized_windows`, `raw_windows`, `bounded_static_closed_windows` and the other measured limits. Six independently executed negative controls reject an altered instruction, a valid but wrong actual callee, changed canonical source, a missing remaining window, a duplicated window and a false percentage.
