// Complete original bucket selection expressions; server ordering is retained.
export const selectCompetition = (e, t) => {
  if (!e) return null;
  let r = (e) => e.kind === t;
  return e.live.find(r) ?? e.upcoming.find(r) ?? e.past.find(r) ?? null;
};
export const hasLiveCompetition = (e, t) =>
  e?.live.some((e) => e.kind === t) ?? !1;
