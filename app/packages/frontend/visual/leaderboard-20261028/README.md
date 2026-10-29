# Leaderboard visual checks — 2026-10-28

These PNGs are local screenshots from the reconstructed Next.js application.
They do not establish upstream pixel parity because equivalent original
reference states were not available.

## Baseline

- `baseline-placeholder-1440x900.png`
- `baseline-placeholder-375x812.png`

The baseline shows the prior generic “Feature unavailable” route scaffold.

## Corrected local states

The final screenshots use the real local adapter with no developer credential.
They intentionally show the credential boundary rather than synthetic ranking
rows:

- `offline-traders-320x640.png`
- `offline-traders-375x812.png`
- `offline-traders-768x1024.png`
- `offline-traders-1024x768.png`
- `offline-traders-1440x900.png`
- `offline-competitions-1440x900.png`

The corresponding browser tests use explicitly synthetic route fixtures for
successful interaction states. Mocked results are not included in visual
evidence and are not counted as proof of production compatibility.
