// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(872682);
  let i = BigInt(0),
    r = (e) => (e ? `${e.chainId}/${e.address}` : ""),
    a = (e) => `coin/${e.chainId}/${e.address}`,
    n = (e, t) => {
      if (!t.holders) return e;
      let i = new Map(e?.rows),
        r = t.holders.delta;
      for (let e of r?.upserts ?? []) i.set(e.address, e);
      for (let e of r?.removed ?? []) i.delete(e);
      return {
        summary: t.holders.summary ?? e?.summary,
        rows: i,
        total: r?.holderCount ?? e?.total,
        asOf: r?.asOf ?? t.holders.summary?.asOf ?? e?.asOf,
      };
    },
    s = (e, t) => {
      let i = new Map(e);
      for (let e of t) i.set(e.wallet, e);
      return i;
    };
  function l(e, i, r, a) {
    return e && i.kind !== t.FrameKind.SNAPSHOT
      ? {
          ...e,
          id: i.id ?? e.id,
          block: i.block ?? e.block,
          kind: i.kind,
          updatedAt: a,
          market: i.market ?? e.market,
          phase: i.phase ?? e.phase,
          coin: i.coin ?? e.coin,
          aggregates: i.aggregates ?? e.aggregates,
          holders: n(e.holders, i),
          position: i.position ?? e.position,
          followed: i.followed.length ? s(e.followed, i.followed) : e.followed,
          marks: i.marks.length ? i.marks : e.marks,
          candles: i.candles.length ? i.candles : e.candles,
          unavailable: i.unavailable.length
            ? i.unavailable
            : e.unavailable.filter(
                (e) =>
                  !((e, i) => {
                    switch (i) {
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
                  })(i, e),
              ),
        }
      : {
          topic: r,
          id: i.id,
          block: i.block,
          kind: i.kind,
          snapshotAt: a,
          updatedAt: a,
          market: i.market,
          phase: i.phase,
          coin: i.coin,
          aggregates: i.aggregates,
          holders: n(void 0, i),
          position: i.position,
          followed: s(void 0, i.followed),
          marks: i.marks,
          candles: i.candles,
          unavailable: i.unavailable,
        };
  }
  let o = (e) => r(e.coin?.id ?? e.market?.id),
    d = (e) => {
      let t = new Map();
      return (e.forEach((e, i) => t.set(o(e), i + 1)), t);
    },
    c = (e, t, i) => {
      let r = Math.max(0, Math.min(e.length, t - 1));
      e.splice(r, 0, i);
    },
    u = (e, t) => {
      t?.has(e.members) ||
        ((e.members = new Map(e.members)), t?.add(e.members));
    };
  e.s([
    "foldCoin",
    0,
    l,
    "foldList",
    0,
    function (e, n, s, m, p) {
      let f = e
        ? { ...e }
        : {
            topic: s,
            kind: n.kind || t.ListKind.UNSPECIFIED,
            version: i,
            cards: [],
            rank: new Map(),
            members: new Map(),
            marks: [],
          };
      (n.kind && (f.kind = n.kind),
        n.version > i && (f.version = n.version),
        n.asOf && (f.asOf = n.asOf));
      let g = n.body;
      if ("snapshot" === g.case)
        ((f.cards = [...g.value.cards]),
          (f.rank = d(f.cards)),
          (f.aggregates = g.value.aggregates),
          (f.marks = g.value.marks),
          (f.members = new Map([...f.members].filter(([e]) => f.rank.has(e)))));
      else if ("patch" === g.case) {
        let e = [...f.cards];
        for (let t of g.value.ops)
          if ("add" === t.op.case) {
            let i = t.op.value.card;
            if (!i) continue;
            let r = o(i),
              a = e.findIndex((e) => o(e) === r);
            (a >= 0 && e.splice(a, 1), c(e, t.op.value.rank, i));
          } else if ("remove" === t.op.case) {
            let i = r(t.op.value),
              a = e.findIndex((e) => o(e) === i);
            (a >= 0 && e.splice(a, 1),
              f.members.has(i) && (u(f, p), f.members.delete(i)));
          } else if ("move" === t.op.case) {
            let i = r(t.op.value.ref),
              a = e.findIndex((e) => o(e) === i);
            if (a < 0) continue;
            let [n] = e.splice(a, 1);
            n && c(e, t.op.value.rank, n);
          }
        ((f.cards = e),
          (f.rank = d(e)),
          g.value.aggregates && (f.aggregates = g.value.aggregates),
          g.value.marks.length && (f.marks = g.value.marks));
      } else if ("member" === g.case) {
        let e = g.value;
        if (e.id) {
          let t = r(e.id);
          (u(f, p), f.members.set(t, l(f.members.get(t), e, a(e.id), m)));
        }
      }
      return f;
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
    r,
  ]);
};
