# Live portfolio acceptance

These images record the local reconstruction rendering an actual public Solana
mainnet wallet. They are dated implementation acceptance evidence, not embedded
portfolio data and not claims of original Pump visual parity.

| State                   |   Viewport | File                   | SHA-256                                                            |
| ----------------------- | ---------: | ---------------------- | ------------------------------------------------------------------ |
| Mainnet wallet, desktop | 1440 × 900 | `mainnet-1440x900.png` | `ccd2e8a6e22b739904c3f691b12f64a75f48ff220ba03db0a09fc6aa1e3dc8b4` |
| Mainnet wallet, mobile  |  390 × 844 | `mainnet-390x844.png`  | `a889da3c618b147a4706586506e41c345a2331781e7c759ac84cacb99df5623f` |

The manifest-bound observation in `live-verification.json` was produced by:

```sh
# Terminal 1, from app/
pnpm --filter @pump-reconstruction/frontend dev --port 3010

# Terminal 2, from app/packages/frontend/
PORTFOLIO_BASE_URL=http://localhost:3010 \
  node tests/live-portfolio.mjs
```

The script performs a load, explicit refresh, and mobile reload; requires the
mainnet-beta genesis hash; validates the SOL, SPL Token, and Token-2022 context
slots; rejects browser requests to other origins and all browser mutation
methods; and checks console/page errors and mobile overflow.

The public RPC endpoint can be rate-limited, and replaying the command may
observe different balances, token accounts, slots, or an honest failure. The
screenshots contain public account data only. They are not used by the running
application.
