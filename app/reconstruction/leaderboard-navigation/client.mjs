import { createQueryState } from "./query-state.mjs";
import { createPeriod } from "./period.mjs";
import { createTab } from "./tab.mjs";
import { createLanding } from "./landing.mjs";
export function createLeaderboardNavigation(capabilities) {
  const query = createQueryState(capabilities);
  const hooks = { useMemoCache: capabilities.useMemoCache, ...query };
  return {
    ...query,
    ...createPeriod(hooks),
    ...createTab(hooks),
    useLanding: createLanding({
      useMemoCache: capabilities.useMemoCache,
      useState: capabilities.react.useState,
      useList: capabilities.useList,
      hasLiveCompetition: capabilities.hasLiveCompetition,
    }),
  };
}
