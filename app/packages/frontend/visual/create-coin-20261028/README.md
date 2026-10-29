# Offline Create Coin visual review

These screenshots compare the `/create` scaffold at upstream
`3719d910d297ad62497e2ef1b12e263d2059f2ae` with the local offline drafting
form. They are local reconstruction screenshots, not retained original-site
references, and do not establish pixel parity.

The desktop viewport is 1440×900 and the mobile viewport is 390×844. The eight
acceptance images use viewport screenshots at those exact dimensions. The two
baseline images were captured before source changes and show the unavailable
placeholder. All screenshots were created by Chromium with
`tests/capture-create-visuals.mjs`; its console-error guard passed.

| Image                            | SHA-256                                                            | Review                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `baseline-desktop-1440x900.png`  | `900ec48a16833e2c791e926997d6867fd23eef6bfe7f4d2b3abea8fb7f638b31` | Existing shell and unavailable Create scaffold.                                                            |
| `baseline-mobile-390x844.png`    | `f77bb6ee55a21c4a4b100657d3750274af2be627f84a974afe930ae96ff3d56c` | Existing mobile shell and unavailable Create scaffold.                                                     |
| `default-desktop-1440x900.png`   | `410fe9c7e397fd3f26f92ad18908e7e180fc311c8cba6fec4e92e07410e435ee` | Form and preview use a readable two-column layout; shell remains intact.                                   |
| `populated-desktop-1440x900.png` | `22a84ebfd91f43a6f6c878bee00b77a9f9e77897bc6b070a132d3b473bb2fb9a` | Populated fields, file identity and preview links remain visible without overlap.                          |
| `invalid-desktop-1440x900.png`   | `21588db5bd69fc1325f7db994af3ebed44074190256d4edbede66c467d643219` | Focus moves to the first invalid control; red borders and inline messages remain associated and unclipped. |
| `preview-desktop-1440x900.png`   | `f3041450774dc74024ce2676b787f1cd6fbb4df93c8afb6a325e4bf849290aca` | Expanded local JSON stays contained in the preview panel and discloses the not-uploaded image state.       |
| `default-mobile-390x844.png`     | `724e7d56195198e8e0ab8dd41ab5bcc6ae8da11013e569ab2da9ceaf3d9a5c95` | Form stacks below the existing mobile header with 44px controls and no horizontal clipping.                |
| `populated-mobile-390x844.png`   | `8644859d454885531013ab28885bda1f0c195a3f1b633b2232707e6c35e8d11f` | Edited fields retain their values in the single-column flow.                                               |
| `invalid-mobile-390x844.png`     | `e7c7fc16d3f621c73ffe571ca4f53389ae011c15d6de00915f6e82c27d01c3f3` | Required errors are readable at narrow width and the first error receives visible focus.                   |
| `preview-mobile-390x844.png`     | `259922468f864277ac88c36cd0c291c2be88b50fd3a4db9297b6f8d3a714f9df` | Preview and JSON fit the mobile viewport without horizontal scrolling.                                     |

## Review result

- Labels, required/optional states, filename, size and error messages remain
  readable at both viewports.
- Form controls and actions do not overlap; the preview stacks after the form on
  mobile and remains sticky in a desktop second column.
- The disabled launch control is visibly separate from the usable local preview
  action. No loading or successful-launch state is shown.
- Focus rings use the existing shell accent. The invalid screenshots show
  programmatic focus on the first invalid control rather than focus loss.
- The image fixture is intentionally minimal and local. Its black rendered pixel
  is not product artwork and makes no claim about an original coin.
- Browser tests separately cover 320×640, 375×812, 768×1024 and 1280×800. No
  requested viewport had horizontal overflow.

The exact original Create page under a matching deployment, authentication and
feature-flag state was not captured as a visual reference. Iconography, spacing,
conditional advanced controls, wallet state and production media behavior remain
visually unknown.
