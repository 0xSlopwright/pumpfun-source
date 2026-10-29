# Local shell viewport review

The baseline images were rendered from the scaffold at upstream `e12df988b`; the remaining images were rendered from the local production build on `127.0.0.1:3000`. They document before/after application behavior. They are not retained original-site screenshots and do not establish pixel parity.

## Reproduced scaffold limitations

At 320×640 and 375×812, the scaffold had no menu toggle, the Create link computed to `display: none`, visible navigation labels computed to 10px, and no link exposed `aria-current="page"`. The same route had no active-route semantics at 768×1024 or 1440×900. None of the four baselines overflowed horizontally.

| Baseline | SHA-256 |
| --- | --- |
| `baseline-1440x900.png` | `edafcf482151d26bea422ec60f59fc1574042bbee1471ed2a870a9a452a8922c` |
| `baseline-768x1024.png` | `848d36763f9d3ad542af9ad95d2932e22f31202f529ba07c5a1c8406ceee2046` |
| `baseline-375x812.png` | `a79b180a3548032c9b18c61578be7e81982c878385b6bc8ff6466a6d1388e7a3` |
| `baseline-320x640.png` | `74d863c1ce53f55b536b7ce9984a077003fdb18da1993f52b551a389634e87fc` |

## Corrected local states

| State                        | SHA-256                                                            | Result                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `desktop-1440x900.png`       | `c28aac4351ecd065641192416a93a648a04d3871961e01c31dd07773a882b7ef` | Expanded 13rem navigation, search and local status visible; no horizontal overflow.                          |
| `laptop-1280x800.png`        | `6948a7a0e96a693ae4d10c1b186bcd4dd5e9f20aaabc9337a9c7d6e88789b591` | Expanded navigation and content remain readable; no horizontal overflow.                                     |
| `tablet-768x1024.png`        | `9b75eaa7ff73b0cfb1bf31ae745ed1240d20f4e6890578b76745f728eb578dfa` | Expanded labelled navigation preserves all destinations and the Mayhem active state; no horizontal overflow. |
| `mobile-390x844.png`         | `abcfd2dae6e4b22a8963185882eaa45ed91de05b2374092ded29cc4b89dd75cd` | Compact brand/header, full-width search and closed off-canvas navigation; no horizontal overflow.            |
| `small-mobile-375x667.png`   | `7fa5a265f72a38aca5b18c0281a8527cb1dbfb4c21770140051238cd44b3f140` | Search and content remain usable at the smallest requested viewport; no horizontal overflow.                 |
| `mobile-closed-375x812.png`  | `cf7a56a1c2702ed492fedebdeb0b44066c697e7cf560b9a79a50f5a25eb2d3c5` | Compact header, labelled menu toggle and usable full-width search.                                           |
| `mobile-open-375x812.png`    | `95a33857f184363e6009fa48044869fda54243e4870d3cd309ed66e13e70b905` | The mobile drawer exposes every destination and obscures the inert page behind it.                           |
| `keyboard-focus-320x640.png` | `155ff72217c1bd23908d97306ead226f0ee7dd7225bade053180b433d17cc8ed` | Visible keyboard focus reaches the Create action at a narrow negative-control width.                         |

## Static reference comparison

- Geometry follows the recovered `13rem` desktop sidebar, `18rem` mobile drawer and sub-768px mobile boundary. The recovered `3.5rem` collapsed rail remains documented but is not used at the 768px acceptance viewport so labels stay readable.
- Typography uses the retained Geist declarations. Colors, borders and focus accents use the retained neutral/zinc/green token values.
- Navigation hierarchy follows the recovered primary and Discover groups. Search placement follows the captured sticky top bar and 420px maximum width.
- The local mobile header, simple SVG icons, direct URL search form and unavailable product states are disclosed local design choices in `SHELL-EVIDENCE.md`.

No equivalent authenticated reference screenshots were retained at these exact viewports and states. Captured HTML/CSS and recovered inert factories are therefore the comparison source; exact spacing, icon artwork, feature-flag-dependent rows, account controls and animation timing remain visually unqualified.
