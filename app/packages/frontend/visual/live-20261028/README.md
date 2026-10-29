# Live discovery visual acceptance

These screenshots are local reconstruction evidence, not claims of original
pixel parity. The capture contains first-party HTML and style/factory text, but
no equivalent original screenshots for all interaction and responsive states.

Captured states:

- `discovery-desktop-1440x900.png`
- `discovery-laptop-1280x800.png`
- `discovery-tablet-768x1024.png`
- `discovery-mobile-375x812.png`
- `discovery-small-mobile-320x640.png`
- `playback-unavailable-mobile-375x812.png`
- `keyboard-focus-mobile-375x812.png`

Reproduce from `app/packages/frontend` while the frontend runs at
`http://127.0.0.1:3011`:

```sh
LIVE_VISUAL_BASE_URL=http://127.0.0.1:3011 node tests/capture-live-visuals.mjs
```

The capture script fails on browser console errors or requests to external
origins. It does not initialize a production media provider.
