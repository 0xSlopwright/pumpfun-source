# Local Create confirmation states

Actual Chromium screenshots from `tests/create-external-links.spec.ts`, on the
local authored app at 1280x844 and 390x844. The test substitutes `window.open`
and aborts nonlocal requests. Both screenshots show the default confirmation
for the same synthetic `https://example.com/my-coin` draft website.

The modal fits both viewports; Cancel receives focus, Escape closes it, and the
background scroll lock is released. No original confirmation-state screenshot
is available, so these are local layout evidence, not visual-parity references.
The existing empty Create form still overflows at 320px (415px scroll width),
reproduced with the three unchanged base169c295c7 host files. That separate
pre-existing failure is not fixed or qualified by this feature.
