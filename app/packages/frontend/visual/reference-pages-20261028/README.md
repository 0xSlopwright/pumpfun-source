# Reference-page visual review

The screenshots in this directory compare the local scaffold baseline with the reconstructed archived reference pages. They are local application screenshots, not authenticated screenshots of the original public pages.

## Viewports

| Suffix | Viewport |
| --- | ---: |
| `desktop-1440x900` | 1440×900 |
| `tablet-768x1024` | 768×1024 |
| `mobile-390x844` | 390×844 |
| `small-mobile-375x812` | 375×812 |

For each viewport, `baseline-{fees,privacy,terms}-*.png` records the prior generic unavailable scaffold and `local-{fees,privacy,terms}-*.png` records the reconstructed page. Regenerate local screenshots while the frontend is available at `http://127.0.0.1:3010`:

```sh
cd app/packages/frontend
node tests/capture-reference-visuals.mjs local
```

## Review

- The existing desktop sidebar, mobile header/drawer, top search, and footer links remain intact.
- Page titles, archive authority notices, table-of-contents links, and content remain readable at all four sizes.
- Long fee tables stay inside a keyboard-focusable horizontal table region instead of widening the document.
- Long terms and privacy headings wrap without clipping.
- The document remains semantically ordered on mobile; the contents list changes from two columns to one.
- Browser tests confirm document width never exceeds viewport width.
- There are no agreement, launch, wallet, or production mutation controls.

These images qualify the local responsive presentation only. No equivalent original-state screenshots were available, so `visualQualified` remains false and pixel parity is not claimed.
