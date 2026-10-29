import { createModule as v0 } from "./variants/50adeb832d22.mjs";
import { createModule as v1 } from "./variants/ff013c07164d.mjs";
import { createModule as v2 } from "./variants/d99e0ef0c846.mjs";
const factories = new Map([
  ["50adeb832d22cb5cb8df1dba280ff38966dbb85f2730d94a872aedd60c2234c5", v0],
  ["ff013c07164d5f58aed101e8221f512ced1c7d39fce2896fedf6bfa548d0a99f", v1],
  ["d99e0ef0c84649f4f27ccdcd238cd183c60bfec152054a0bcce59d0945aef520", v2],
]);
export const creatorPayoutVariants = Object.freeze(
  [
    {
      sha256:
        "50adeb832d22cb5cb8df1dba280ff38966dbb85f2730d94a872aedd60c2234c5",
      source: "evidence/web/objects/57cc59637a8b8f78.js",
    },
    {
      sha256:
        "ff013c07164d5f58aed101e8221f512ced1c7d39fce2896fedf6bfa548d0a99f",
      source: "evidence/web/objects/dd1b7e2a0ecbaed0.js",
    },
    {
      sha256:
        "d99e0ef0c84649f4f27ccdcd238cd183c60bfec152054a0bcce59d0945aef520",
      source: "evidence/web/objects/bbad3cca63bc2aa5.js",
    },
  ].map(Object.freeze),
);
export function createCreatorPayoutModule({ variant, ...capabilities }) {
  const factory = factories.get(variant);
  if (!factory)
    throw new TypeError(
      "Explicit reviewed creator-payout source variant required",
    );
  return factory(capabilities);
}
