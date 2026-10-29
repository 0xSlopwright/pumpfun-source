# Historical Mayhem data attribution: PR #890

This packet independently bounds **16 new bytes** against the common reviewed,
merged #846 data baseline: **21,796 / 26,180 bytes**. Its own bounded historical
union with that baseline is **21,812 / 26,180**. Other open packets are not
included in this per-packet baseline. The separate batch review deduplicates all
eight additions; these figures are not a latest complete source footprint.

The original and qualified437 candidate payload/descriptor/argument/index paths
are checked. This adds finite historical data attribution only: no maintained
code, normalized window or current-native-ELF progress is credited. Text and
relocation-table bytes are proof evidence, not credited payload.

The one formatting record has both concrete discriminants equal to2. Its
actual conditional-success path loads record bytes[16,18),[0,2),[32,40) and
[40,44). The old[18,20) credit followed an unreachable alternate load at344;
those two bytes remain unclaimed. The corrected branch sequence is
200,208,216,224,272,280,368,376,392,400. Count1 and stride48 close the loop after
one record. Callback success is a static path condition, not an observed output.

The derived observations are intentionally regenerated for the corrected16-byte
scope and actual load/branch offsets. The original18-byte report remains in the
private review provenance. No original payload, executable, producer or compiler
input is changed.

Original packet provenance: head `fa3e3d6263505d7a2addc49e3109b067a520892b`;
original `proof.py` SHA-256 `f2afb944709907e2b6a0091422c176a3ec753b764f51a608d24f10eda12259f2`;
original `observations.json.gz` SHA-256 `19b6ad8584aca6f57ca4f0dbc2dd95192313626ed8eeb94685aff72caf197c0c`.
The original bytes remain recoverable at that parent commit and in the private
review snapshot. This corrected checker produced the disclosed16-byte report.

Original packet attribution (retained): OpenAI / gpt-6.1-terra / codex-cli / high.

```sh
python3 -B research/mayhem-current437-format-record-fields-20261029/verify.py --repo .
python3 -B research/mayhem-current437-format-record-fields-20261029/test_verify.py
```

Verification requires the already-merged #846 baseline at its pinned hash.
Use normal Python: public entrypoints refuse `-O` because the retained proof
chain uses assertions. Tests mutate in-memory analysis copies only; these are
never compiler inputs or replacement artifacts.
