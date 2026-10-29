// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var n = e.i(292686),
    t = e.i(404224),
    r = e.i(424579);
  let i = new Set(),
    o = (e) => {
      if (null == e) return;
      let n = Date.parse(e);
      return Number.isNaN(n) ? void 0 : n;
    },
    E = ({
      messageId: e,
      conversationId: n,
      peerId: E,
      deliveryChannel: s,
      createdAt: u,
    }) => {
      if (i.has(e)) return;
      if (i.size >= 500) {
        let e = i.values().next().value;
        void 0 !== e && i.delete(e);
      }
      i.add(e);
      let _ = o(u);
      (0, r.N)({
        messageId: e,
        conversationId: n,
        peerId: E,
        deliveryChannel: s,
        isAppForeground:
          "u" > typeof document && "visible" === document.visibilityState,
        isActiveThread: (0, t.X)(n) || (0, t.X)(E),
        deliveryLatencyMs: void 0 === _ ? 0 : Math.max(0, Date.now() - _),
      });
    },
    s = (e) => {
      let n = new Map(),
        t = 0;
      for (let r of e) {
        let e = r.lastMessage;
        if (null === e) continue;
        n.set(r.conversationId, e.messageId);
        let i = o(e.createdAt);
        void 0 !== i && i > t && (t = i);
      }
      return { newestMessageIdByConversation: n, newestMessageMs: t };
    };
  e.s([
    "L",
    0,
    s,
    "x",
    0,
    ({ previous: e, entries: t }) => {
      for (let r of t) {
        let t = r.lastMessage;
        if (
          null === t ||
          t.senderId !== r.peerId ||
          e.newestMessageIdByConversation.get(r.conversationId) === t.messageId
        )
          continue;
        let i = o(t.createdAt);
        void 0 === i ||
          i <= e.newestMessageMs ||
          E({
            messageId: t.messageId,
            conversationId: r.conversationId,
            peerId: r.peerId,
            deliveryChannel: n.jC.INBOX_POLL,
            createdAt: t.createdAt,
          });
      }
      let r = s(t);
      return {
        ...r,
        newestMessageMs: Math.max(e.newestMessageMs, r.newestMessageMs),
      };
    },
    "S",
    0,
    E,
  ]);
};
