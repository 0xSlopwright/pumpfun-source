# Component-host rendering evidence

These four images are local Chromium screenshots of the actual reconstructed
components at1280×900 and375×812, for each explicit NumberFormat source variant.
The host uses synthetic `fixture-*` translations and already-admitted synthetic
prize props. It is not the main competition page or an authenticated upstream
reference. No visual identity/parity claim is made.

The captured component DOM/classes are rendered with the maintained product CSS
and fonts. Heading, controls and rank labels belong only to the test host. The
same run asserts optional badges, tier-vs-badge amount differences, locale
updates, rejection/clear states and responsive fit. Screenshots show the English
number-format state before the locale-change assertion.

Regenerate with:

```sh
PRIZE_DISPLAY_SCREENSHOTS_DIR=reconstruction/competition-prizes/visual \
  node --test tests/original_competition_prizes_browser.test.mjs
```

No live API, credentials, accounts or transaction signing are used. Original
factory registration/source witnesses are checked separately by the generator;
these images establish only the bounded local rendering result.
