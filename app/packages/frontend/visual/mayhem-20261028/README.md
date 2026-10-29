# Mayhem screener visual acceptance

These screenshots compare the former generic placeholder with the local
reconstruction. The reconstructed screenshots use a visibly labelled synthetic
browser fixture solely to exercise populated layout. They are not market data.

| State                              |   Viewport | File                                     | SHA-256                                                            |
| ---------------------------------- | ---------: | ---------------------------------------- | ------------------------------------------------------------------ |
| Baseline placeholder               | 1440 × 900 | `baseline-desktop-1440x900.png`          | `3e0bd664c9de86ab12465a7919671952304604d823dafe1d650175eb104535f7` |
| Baseline placeholder               |  390 × 844 | `baseline-mobile-390x844.png`            | `96be682d66169e2b8396e70cbf696b3fcbc815c65b37ffe0c9dc8abaad6e7ced` |
| Reconstructed populated test state |  320 × 640 | `reconstructed-small-mobile-320x640.png` | `b2fd4a63c8d3c8e670340720000e499025b791b9b7e87d404f33e7c215eb46ef` |
| Reconstructed populated test state |  375 × 812 | `reconstructed-mobile-375x812.png`       | `76fe096902e52cff852184cbef40891b25d70c721c1222a1f0cd5a85ce8b6cbb` |
| Reconstructed populated test state | 768 × 1024 | `reconstructed-tablet-768x1024.png`      | `bf7d58cdf4b1034f6b06fff75127cd33b660455decfee1824728ca5bd7b96de4` |
| Reconstructed populated test state | 1440 × 900 | `reconstructed-desktop-1440x900.png`     | `7ef8228f02c393b97facb323370b6aeb3f663294448e0d5b449ae48d2b39b524` |

The reconstructed views retain the shared dark shell, Geist typography, green
accent, filter hierarchy and compact screener rows established by captured
markup and factories. The browser suite checks document overflow at all four
viewports.

No captured reference screenshot exists with equivalent data and viewport
state. Original pixel parity therefore remains unqualified. Current production
behavior renders the explicit unavailable state because no authenticated
Mayhem response body is present in the repository.
