# Offline Home Feed visual review

These screenshots compare the homepage placeholder at upstream
`95063aee73d447dcd2c5c131ff4c9b9a5475079c` with the local read-only feed.
They are local acceptance captures, not equivalent original-site references and
do not establish pixel parity.

| State                |   Viewport | File                            | SHA-256                                                            |
| -------------------- | ---------: | ------------------------------- | ------------------------------------------------------------------ |
| Placeholder baseline | 1440 × 900 | `baseline-desktop-1440x900.png` | `f0c29ebfccb537f1440049df0d668653f36d7e214390a7321bb6cb72ed1d2af1` |
| Placeholder baseline |  390 × 844 | `baseline-mobile-390x844.png`   | `00ec61a19727c4d70cc415043aab01de410ebfbf1a9ac4328bdb4cdac219d75d` |
| Validated local feed | 1440 × 900 | `local-desktop-1440x900.png`    | `f5da64a6273f77950c8c70c113f03eb87fe27d0fcf8e52030fc4ec290affc5e0` |
| Validated local feed |  390 × 844 | `local-mobile-390x844.png`      | `ef2ae699b152d21de29d0aa218efa9125d1253bfe3922507cb1e06fa21a3a048` |

The local screenshots were generated with
`tests/capture-home-feed-visuals.mjs`. Its guard rejects browser console errors,
external-origin requests, and non-read requests. The baseline images were
captured with the same Chromium installation and viewports before source edits.

## Acceptance result

- Desktop constrains the feed to a readable central column while preserving the
  shared navigation and search shell.
- Mobile stacks provenance, author metadata, content, media placeholders, and
  counters without document-level horizontal overflow.
- Synthetic provenance remains above the rows and on every card.
- External avatar and post media are replaced with local initials and a bounded
  placeholder. No original URL is rendered into the page.
- The six-size browser matrix additionally covers 320×640, 375×812, 390×844,
  768×1024, 1280×800, and 1440×900.

## Grounded comparison and limitations

`HOME-FEED-EVIDENCE.md` maps captured dark-neutral/green tokens, feed tabs,
semantic row structure, skeleton regions, empty/error branches, and continuation
boundaries. The local implementation deliberately differs by showing three
hash-bound synthetic examples rather than captured or live activity; omitting
authenticated reactions, trading, profiles, ranking, and pagination; and adding
prominent data-source disclosure.

No original screenshot with an equivalent unauthenticated, synthetic-data state
exists. Exact geometry, card content, iconography, transitions, translated copy,
and authenticated states therefore remain visually unqualified.
