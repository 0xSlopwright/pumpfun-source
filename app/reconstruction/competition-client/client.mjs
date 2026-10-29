import { createForegroundModule as v0 } from "./foreground/0024317d4e63.mjs";
import { createForegroundModule as v1 } from "./foreground/67966a7a877f.mjs";
import { createHook as createList } from "./useList.mjs";
import { createHook as createDetail } from "./useDetail.mjs";
import { keys } from "./keys.mjs";
import { selectCompetition, hasLiveCompetition } from "./selection.mjs";
const variants = new Map([
  ["0024317d4e63db1b1791329f7416024563bc11858041efaa1e185556e58baae1", v0],
  ["67966a7a877f6aaeac36c545415ddfc2d534bcb892a9b11c56e45a5aa5560cfc", v1],
]);
export const foregroundVariants = Object.freeze([
  "0024317d4e63db1b1791329f7416024563bc11858041efaa1e185556e58baae1",
  "67966a7a877f6aaeac36c545415ddfc2d534bcb892a9b11c56e45a5aa5560cfc",
]);
export function createCompetitionClient({
  foregroundVariant,
  document,
  window,
  useSyncExternalStore,
  ...providers
}) {
  const create = variants.get(foregroundVariant);
  if (!create)
    throw new TypeError("Explicit reviewed foreground source variant required");
  const foreground = create({ document, window, useSyncExternalStore });
  const caps = {
    ...providers,
    keys,
    useForegroundInterval: foreground.useForegroundInterval,
  };
  return {
    useList: createList(caps),
    useDetail: createDetail(caps),
    keys,
    selectCompetition,
    hasLiveCompetition,
    foreground,
  };
}
