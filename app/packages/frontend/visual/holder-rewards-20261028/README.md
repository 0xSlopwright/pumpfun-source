# Offline Holder Rewards visual review

These images compare the unavailable `/holder-rewards` scaffold at upstream
`95063aee73d447dcd2c5c131ff4c9b9a5475079c` with the local offline PDA
inspector. They are local implementation screenshots, not original-site
references, and do not establish pixel parity.

| Image | SHA-256 | Review |
| --- | --- | --- |
| `baseline-desktop-1440x900.png` | `a9ce6ff629d45bdf397daa77696252c2c75d68f028f94f330db331ccc5a4e337` | Existing desktop shell and unavailable scaffold. |
| `baseline-mobile-390x844.png` | `7fdba2049f44059d7530131e781760ed5285ecf4e020a018173083f74d793611` | Existing mobile shell and unavailable scaffold. |
| `default-desktop-1440x900.png` | `93b25ff5fc3dbc94ef3111fc4cd18cbb88d1dbce32e06407312a12f207a781bd` | Inspector, initial unknown state and reward boundaries remain readable in the shell. |
| `derived-laptop-1280x800.png` | `70b43d503952208e70a4ecc58ae80402767b22a5d035b2c4e9dd7a2ab24a0504` | Normalized mint and PDA are visible with separate copy controls. |
| `derived-tablet-768x1024.png` | `f2041b51cce43bb32724a1806df2718588aed6d3fda6b0f7f8509535162343b7` | Long Base58 values wrap within the tablet content column without overflow. |
| `invalid-mobile-390x844.png` | `653ea3641a599f14100016e7e1fd3606276a6ff0b2782611a8ca92927524f13c` | Mobile validation is associated with the input and remains unclipped. |
| `derived-small-mobile-375x667.png` | `778da94a32e80724b978c65a1893b41d7ae41b40972fa0bc5f969707045340e8` | The result card and both addresses fit the narrow flow after scrolling into view. |

The acceptance suite also checks 1440×900, 1280×800, 768×1024, 390×844 and
375×667 for document overflow. `tests/capture-holder-rewards-visuals.mjs`
regenerates the five implementation screenshots and rejects console/page errors.

## Review result

- The existing dark shell, sidebar/mobile navigation, top search and focus style
  remain intact.
- Controls meet the shell's 44px touch-target convention and stack on mobile.
- Long addresses wrap rather than expanding the document.
- Unknown rewards show `Unavailable`; no zero or example amount is displayed.
- The disabled claim boundary is visually distinct from the usable derivation
  and copy controls.

No matching authenticated original state was captured. Live tables, balances,
filters, wallet state, payouts and claim behavior remain visually unqualified.
