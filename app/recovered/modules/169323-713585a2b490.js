// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(314012),
    r = e.i(822173);
  e.s([
    "_",
    0,
    (e) => {
      let t = e.lastActivityAt ?? e.lastMessage?.createdAt ?? null;
      if (null === t) return null;
      let r = Date.parse(t);
      return Number.isNaN(r) ? null : r;
    },
    "T",
    0,
    (e) => {
      let n = e.lastMessage;
      if (null === n) return { kind: "none" };
      if (n.isSpam || n.isHarmful)
        return { kind: "flagged", isHarmful: n.isHarmful };
      if (null !== n.media && "" === n.content) {
        let e;
        return {
          kind: "media",
          isGif:
            ((e = n.media.mimeType),
            e?.toLowerCase().split(";")[0]?.trim() === "image/gif"),
        };
      }
      return (0, r.containsDmSensitiveContent)(n.content)
        ? { kind: "redacted" }
        : "" === n.content
          ? { kind: "none" }
          : { kind: "text", text: (0, t.e)(n.content) };
    },
  ]);
};
