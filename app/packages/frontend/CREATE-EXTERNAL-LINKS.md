# Create draft external-link confirmation

The local `/create` preview previously opened its validated website, X/Twitter
and Telegram links directly even though Settings exposed the captured device
confirmation preference. Ordinary clicks now use the existing source-derived
`outboundConfirmation` controller. Other app links are outside this change.

## Evidence and integration

The unchanged [privacy contract](../../reconstruction/privacy-external-links/contract.json)
binds descriptor 956718, storage adapter 654506, outbound hook 225641 and actual
link consumer 634557 to captured factories and original bytes. The existing
controller keeps the HTTPS normalization, exact trusted-host checks, default
confirmation, cancellation/reset and remember-only-on-confirm order. Captured
JavaScript is not imported or executed. Create's stricter URL admission remains
unchanged; this is not a reason to accept protocol-less or credential-bearing
input in the form.

`create-draft-links.tsx` renders the pending destination, cancellation, confirmation
and remembered-choice checkbox. It passes the original open arguments to
`window.open`. A null popup return is not treated as successful navigation.
Native dialog cancellation and effect cleanup release the shared body-scroll
lock. Settings and Create use the same module-lifetime preference instance,
including the in-memory fallback when storage is unavailable.

The explicit `settingsHubEnabled: true` port is a **local design** decision: the
local shell exposes the device switch. It does not establish the production
feature flag. Browser-native middle-click, context-menu navigation and other
app links are not intercepted by this bounded ordinary-click consumer. No
server request, authentication, signing, upload or production mutation is added.

## Validation

The new default-confirmation browser regression fails on base
`169c295c7b770b25c7dc9f19b08626bdfb582860`: clicking the website preview has no
confirmation dialog. The implemented flow passes focused browser controls for
Cancel/Escape/Confirm, remembered choice and reload, Settings changes, trusted
host bypass, social-link confirmation, failed-storage shared fallback and
mobile/desktop rendering. Tests replace `window.open` and block nonlocal traffic;
no actual destination is visited.

The existing source/controller and receipt negative-control suite passes 18
cases. The actual Settings qualification was rerun for its changed renderer and
notice: reload, two browser-process restarts, cross-tab events and failed storage
remain checked. Its refreshed receipt covers Settings itself, not the new link
consumer; the latter has `tests/create-external-links.spec.ts`.

Local modal screenshots at 1280x844 and 390x844 are retained in
`visual/create-external-links-20261029/`. No original Create confirmation-state
screenshot is available. The authored dialog is not claimed to have original
visual parity, and no feature completion milestone or API qualification is added.

The existing Create interaction checks pass except the pre-existing 320px
empty-form overflow case (scroll width 415px), also reproduced after restoring
the unchanged base Create form and Settings hosts. An initial safety-test run
at port3217 counted its local GETs as external because that old test hardcodes
port3010; rerunning that case on its declared port passed. Neither failure is
reported as a new feature regression or silently counted as passing.
