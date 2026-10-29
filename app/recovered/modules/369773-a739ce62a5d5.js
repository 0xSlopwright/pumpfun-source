// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(872682);
  let r = BigInt(0),
    i = (e) => (e ? `${e.chainId}/${e.address}` : ""),
    a = (e) => `coin/${e.chainId}/${e.address}`,
    n = (e, t) => {
      if (!t.holders) return e;
      let r = new Map(e?.rows),
        i = t.holders.delta;
      for (let e of i?.upserts ?? []) r.set(e.address, e);
      for (let e of i?.removed ?? []) r.delete(e);
      return {
        summary: t.holders.summary ?? e?.summary,
        rows: r,
        total: i?.holderCount ?? e?.total,
        asOf: i?.asOf ?? t.holders.summary?.asOf ?? e?.asOf,
      };
    },
    l = (e, t) => {
      let r = new Map(e);
      for (let e of t) r.set(e.wallet, e);
      return r;
    };
  function s(e, r, i, a) {
    return e && r.kind !== t.FrameKind.SNAPSHOT
      ? {
          ...e,
          id: r.id ?? e.id,
          block: r.block ?? e.block,
          kind: r.kind,
          updatedAt: a,
          market: r.market ?? e.market,
          phase: r.phase ?? e.phase,
          coin: r.coin ?? e.coin,
          aggregates: r.aggregates ?? e.aggregates,
          holders: n(e.holders, r),
          position: r.position ?? e.position,
          followed: r.followed.length ? l(e.followed, r.followed) : e.followed,
          marks: r.marks.length ? r.marks : e.marks,
          candles: r.candles.length ? r.candles : e.candles,
          unavailable: r.unavailable.length
            ? r.unavailable
            : e.unavailable.filter(
                (e) =>
                  !((e, r) => {
                    switch (r) {
                      case t.Part.MARKET:
                        return !!e.market;
                      case t.Part.PHASE:
                        return !!e.phase;
                      case t.Part.META:
                        return !!e.coin;
                      case t.Part.HOLDERS:
                        return !!e.holders;
                      case t.Part.POSITION:
                        return !!e.position;
                      case t.Part.MARKS:
                        return e.marks.length > 0;
                      case t.Part.CANDLES:
                        return e.candles.length > 0;
                      default:
                        return !1;
                    }
                  })(r, e),
              ),
        }
      : {
          topic: i,
          id: r.id,
          block: r.block,
          kind: r.kind,
          snapshotAt: a,
          updatedAt: a,
          market: r.market,
          phase: r.phase,
          coin: r.coin,
          aggregates: r.aggregates,
          holders: n(void 0, r),
          position: r.position,
          followed: l(void 0, r.followed),
          marks: r.marks,
          candles: r.candles,
          unavailable: r.unavailable,
        };
  }
  let o = (e) => i(e.coin?.id ?? e.market?.id),
    d = (e) => {
      let t = new Map();
      return (e.forEach((e, r) => t.set(o(e), r + 1)), t);
    },
    c = (e, t, r) => {
      let i = Math.max(0, Math.min(e.length, t - 1));
      e.splice(i, 0, r);
    },
    u = (e, t) => {
      t?.has(e.members) ||
        ((e.members = new Map(e.members)), t?.add(e.members));
    };
  e.s([
    "foldCoin",
    0,
    s,
    "foldList",
    0,
    function (e, n, l, p, f) {
      let m = e
        ? { ...e }
        : {
            topic: l,
            kind: n.kind || t.ListKind.UNSPECIFIED,
            version: r,
            cards: [],
            rank: new Map(),
            members: new Map(),
            marks: [],
          };
      (n.kind && (m.kind = n.kind),
        n.version > r && (m.version = n.version),
        n.asOf && (m.asOf = n.asOf));
      let g = n.body;
      if ("snapshot" === g.case)
        ((m.cards = [...g.value.cards]),
          (m.rank = d(m.cards)),
          (m.aggregates = g.value.aggregates),
          (m.marks = g.value.marks),
          (m.members = new Map([...m.members].filter(([e]) => m.rank.has(e)))));
      else if ("patch" === g.case) {
        let e = [...m.cards];
        for (let t of g.value.ops)
          if ("add" === t.op.case) {
            let r = t.op.value.card;
            if (!r) continue;
            let i = o(r),
              a = e.findIndex((e) => o(e) === i);
            (a >= 0 && e.splice(a, 1), c(e, t.op.value.rank, r));
          } else if ("remove" === t.op.case) {
            let r = i(t.op.value),
              a = e.findIndex((e) => o(e) === r);
            (a >= 0 && e.splice(a, 1),
              m.members.has(r) && (u(m, f), m.members.delete(r)));
          } else if ("move" === t.op.case) {
            let r = i(t.op.value.ref),
              a = e.findIndex((e) => o(e) === r);
            if (a < 0) continue;
            let [n] = e.splice(a, 1);
            n && c(e, t.op.value.rank, n);
          }
        ((m.cards = e),
          (m.rank = d(e)),
          g.value.aggregates && (m.aggregates = g.value.aggregates),
          g.value.marks.length && (m.marks = g.value.marks));
      } else if ("member" === g.case) {
        let e = g.value;
        if (e.id) {
          let t = i(e.id);
          (u(m, f), m.members.set(t, s(m.members.get(t), e, a(e.id), p)));
        }
      }
      return m;
    },
    "isCoinState",
    0,
    (e) => !!e && "followed" in e,
    "isListState",
    0,
    (e) => !!e && "cards" in e,
    "memberTopic",
    0,
    a,
    "refKey",
    0,
    i,
  ]);
};
