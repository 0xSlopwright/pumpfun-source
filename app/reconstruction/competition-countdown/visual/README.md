# Controlled maintained-product before/after

These are standalone renders of the actual maintained CompetitionCards function,
its actual formatters and CSS. **Before** is main d3ed4863's hash-bound source;
**after** is this change. Next Link is an explicit local anchor in this fixture.
Neither image set is an authenticated upstream/reference website capture, and no
full-page or original visual equivalence is claimed.

| State | Desktop viewport1280×900 | Mobile viewport375×812 |
| --- | --- | --- |
| Before | [before-desktop.png](before-desktop.png) | [before-mobile.png](before-mobile.png) |
| After | [after-desktop.png](after-desktop.png) | [after-mobile.png](after-mobile.png) |

Full-page image heights vary because supported cards gain countdown displays.
Inputs are eight explicitly synthetic DTOs and a paused local clock at
2030-05-01T00:00:00Z. After screenshots follow a one-second tick; the timer values
therefore differ from the initial tick assertions by exactly one second.
Supported phases get the source start/end labels and four digit boxes. Ended,
unknown, null and invalid target dates get no countdown. Existing absolute-date
fields and card links remain visible. Mobile retains one column and desktop two;
all cards fit without horizontal scrolling. Images were visually inspected.

Repeat (writes only when an output directory is explicitly supplied):

```sh
COUNTDOWN_SCREENSHOTS_DIR="$PWD/reconstruction/competition-countdown/visual" \
  node --test tests/original_competition_countdown_browser.test.mjs
```

The producer tests real React timers/cleanup and product output while bundling
only maintained source. It reuses installed tools; no Next server or captured
runtime execution. Tool/input/result hashes are in the adjacent validation record.
