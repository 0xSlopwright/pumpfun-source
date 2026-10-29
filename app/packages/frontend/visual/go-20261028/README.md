# GO bounty explorer visual acceptance

These screenshots were captured from the actual local Next.js application on
2026-10-28. They qualify layout and interaction behavior only. No equivalent
original filter/detail screenshots were retained, so pixel-level upstream
parity is not claimed.

## Before

- `baseline-desktop-1440x900.png`
- `baseline-mobile-375x812.png`

Both baseline images show the latest upstream `/go` route using the generic
“Feature unavailable” scaffold.

## Locally accepted reconstruction

- `desktop-1440x900.png`: authenticated snapshot disclosure, URL controls and
  historical bounty cards.
- `detail-1440x900.png`: read-only selected bounty and explicit unavailable
  account actions.
- `tablet-768x1024.png`
- `mobile-375x812.png`
- `small-mobile-320x640.png`

The Playwright viewport matrix separately asserts no horizontal document
overflow at 320×640, 375×812, 768×1024 and 1440×900. Remote assets and
production services are not requested while capturing these images.
