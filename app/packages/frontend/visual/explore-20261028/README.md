# Explore visual review

These screenshots show the checked-in reconstruction using the authenticated
one-record historical snapshot. They are implementation acceptance evidence, not
claims of pixel parity with the live site.

| State | Viewport | File | SHA-256 |
| --- | ---: | --- | --- |
| Desktop, default snapshot | 1440 × 900 | `desktop-1440.png` | `60c6e2a40e3ce7a4bb46f88908971eda245290504a3e308db12f2fdc299b8a44` |
| Mobile, default snapshot | 390 × 844 | `mobile-390.png` | `84dadc098b9a8bff9b6ae09b95e1c7778431ab0840afb3dc1020430b4a9a2fc1` |

The browser regression suite separately exercises 320 × 640, 375 × 812,
390 × 844, 768 × 1024, 1280 × 800, and 1440 × 900. It checks search and copy
controls, long-mint layout, and document overflow at every size.

## Grounded comparison

The captured `/explore` HTML at
`evidence/web/objects/501ddca30e455495` establishes the dark token palette,
shared responsive shell, search placement, responsive screener geometry, and
coin-table hierarchy. Recovered factories listed in `EXPLORE-EVIDENCE.md`
establish coin identity, market-cap, query, loading, and empty-state structures.

The local result intentionally differs from the captured production surface:

- it renders one validated card instead of a live table/feed;
- it omits unqualified volume, activity, holders, ranking, filtering, and buy
  controls;
- it uses a local letter placeholder rather than fetching the captured IPFS
  image;
- it adds explicit snapshot provenance and data-limit language;
- it provides no token-detail navigation or trading action.

No equivalent original screenshot with this exact offline one-record state is
available. Geometry, typography, spacing, and responsive behavior therefore
remain visually unqualified.
