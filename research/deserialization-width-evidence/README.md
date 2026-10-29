# Conflicting static load widths

The archived deserialization report chooses the first observed load width for
each displayed base-register/offset pair. Real windows can read that same offset
with several widths. The former single width hides conflicting observations.

This successor composes the accepted full-span correction in
`research/deser-struct-size`, authenticates its reviewed LF/CRLF source, and keeps
its existing size bounds. Each displayed offset retains all observed widths and
physical instruction sites. A `field_sizes` entry becomes `null` when widths
conflict; one observed width remains unchanged. A base register is not proven to
retain one semantic identity throughout the window, so these are load observations,
not recovered account fields or a unique struct layout.

```
python research/deserialization-width-evidence/test_analyze.py
python research/deserialization-width-evidence/analyze.py --program pump --output <new-directory>
```

All displayed patterns in all nine retained captures are compared to independent
raw-instruction observations. `validation.json` binds the inputs and gives raw-site
witnesses. Root helpers, historical reports, captures and all other report fields
remain intact; generated outputs require a fresh directory and a hash-bound manifest.
