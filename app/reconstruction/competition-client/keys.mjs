// Complete original key object; a key does not implement any operation.
let t = "competitions";
export const keys = {
  all: [t],
  list: (e) => [t, "list", e],
  detail: (e, r) => [t, "detail", e, r],
  details: [t, "detail"],
  tosAccept: [t, "tos-accept"],
  entry: (e, r) => [t, "entry", e, r],
  entryPositions: (e, r) => [t, "entry-positions", e, r],
  highlights: (e, r) => [t, "highlights", e, r],
  highlightMedia: (e) => [t, "highlight-media", e],
};
