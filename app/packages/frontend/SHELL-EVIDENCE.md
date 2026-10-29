# Shared shell evidence map

The captured shell is now reached by the root layout. See [SHELL-INTEGRATION-EVIDENCE.md](SHELL-INTEGRATION-EVIDENCE.md) and the physical hash/range bindings for the integration, local adaptations, corrected reference renderer and current limits.

This note records the static evidence used for the local shared application shell. It does not establish original source identity or visual parity. Captured bundles were inspected as inert text and were not executed.

## Observed

- The captured root HTML is `evidence/web/objects/b713215f09b03c14` (SHA-256 `5c54a668997394767a338ff5efe132ba3400bd5e1c4b6bb16c9c075b6a389409`). Its rendered markup contains a left sidebar, a `pump.fun` brand link, grouped navigation, a Create control, a top search trigger and footer controls.
- The same HTML contains links for `/`, `/explore`, `/leaderboard`, `/live`, `/go`, `/mayhem` and `/holder-rewards`. The search trigger is labelled `Search for coins and users`, displays `Search for coins and users...`, and exposes a Command-K hint.
- Recovered factory `721426` (`recovered/modules/721426-84f074bca773.js`, SHA-256 `84f074bca773d01c2507e778b3855c4d4ff9a64c55c6e48dcac82417eb4e960a`) defines primary and Discover navigation groups, the route mapping, active-route selection, a Create control, a collapsible sidebar and the same included route set. Its exact origin is `evidence/web/objects/13c13db9eb86191b.js`, UTF-16 range `67265..92155`.
- Recovered factory `103547` (`recovered/modules/103547-a3f92e0aa424.js`, SHA-256 `a3f92e0aa42472b121190dc3f0cbaeaf495ad1d80b8d3aaf06835779db394434`) defines a `13rem` desktop sidebar, `3.5rem` collapsed rail, `18rem` mobile drawer, a mobile boundary below 768 px, focus rings and a mobile overlay. Its exact origin is `evidence/web/objects/13c13db9eb86191b.js`, UTF-16 range `190519..213344`.
- Recovered factory `400466` (`recovered/modules/400466-b55e1d783411.js`, SHA-256 `b55e1d78341162edfc6c5ff1ba32c4b4faa3d0ade6de3a39f440fe39f2e9e5dd`) defines a sticky top bar and a search trigger capped at 420 px, with accessible focus treatment and the search label/placeholder above. Its exact origin is `evidence/web/objects/13c13db9eb86191b.js`, UTF-16 range `92522..190511`.
- Recovered factory `29542` (`recovered/modules/29542-ede316c07dd8.js`, SHA-256 `ede316c07dd8ceb3faff4f840fefbb61a5b1a18d372e600225db0f8410a661bd`) retains the navigation and search English strings. Its exact origin is `evidence/web/objects/fd402d4185b44ce9.js`, UTF-16 range `5207..9672`.
- Captured CSS `evidence/web/objects/c86dcf5ccf0527e9.css` (SHA-256 `14804137a142561602d60e11af5a3b5dcb9f4281df03d098443adf5f4e7eb1ca`) defines the dark neutral, zinc and green accent tokens used by the local shell. Captured CSS `evidence/web/objects/26bc2224429aacd3.css` (SHA-256 `8faed4840b5b667adc6f5b368301c05a692a937dd1acc51defa45a17f72b2944`) contains the captured Geist font declarations.

## Inferred

- The sidebar is the shared navigation surface across the captured included routes because the same route inventory and shell markup recur in the captured page HTML.
- The recovered sidebar includes an icon-only collapsed state, while the recovered mobile drawer activates below 768 px.
- Search belongs in the shared top bar. The available evidence establishes its label, placeholder and dialog trigger, but not a qualified local result service.

## Local design

- The local search submits an encoded `q` parameter to `/explore`, synchronizes the field with browser history and exposes an explicit unavailable state. This preserves useful navigation without claiming reconstruction of the upstream search dialog or backend.
- The local mobile drawer closes after navigation, on Escape and on backdrop activation. These behaviors are accessibility safeguards; the captured factory proves a dismissible mobile overlay, not each local event choice.
- The local shell keeps labelled navigation at 768 px and above, and contains keyboard focus while the mobile drawer is open. These are local accessibility decisions; the retained source does not qualify the exact upstream tablet or focus behavior.
- The active shell uses the previously extracted captured SVG icons and logomark unchanged. Portfolio retains a local navigation addition with the captured Positions glyph.
- Individual maintained page bodies keep their historical/synthetic/unavailable labels. Captured sign-in controls remain disabled.

## Unknown / not qualified

- Exact pixel geometry for an equivalent authenticated browser state, feature-flag-dependent rows, account controls and original animation timing.
- The original search result contract, ranking, filters, authenticated states and keyboard-command dialog behavior.
- Pixel-perfect visual parity. The retained HTML and CSS are static source references, not matched reference screenshots at every requested viewport.
