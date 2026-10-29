// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(872682),
    r = e.i(168266),
    i = e.i(776238),
    a = e.i(369773),
    n = e.i(163401);
  let l = BigInt(0),
    s = BigInt(1),
    o = /part (\w+) not served/,
    d = /viewer mismatch/i,
    c = {
      schedule(e, t) {
        if (!t && "function" == typeof requestAnimationFrame) {
          let t,
            r = requestAnimationFrame(() => {
              (clearTimeout(t), e());
            });
          return (
            (t = setTimeout(() => {
              (cancelAnimationFrame(r), e());
            }, 250)),
            () => {
              (cancelAnimationFrame(r), clearTimeout(t));
            }
          );
        }
        let r = setTimeout(e, t ? 1e3 : 16);
        return () => clearTimeout(r);
      },
    },
    u = { isVisible: () => !0, subscribe: () => () => {} },
    p = (e) => {
      let t = -1;
      for (let r = e.length - 1; r >= 0; r--)
        if (e[r]?.kind === "frame") {
          t = r;
          break;
        }
      return e.filter((e, r) => "frame" !== e.kind || r === t);
    },
    f = (e) => [...e.rank.keys(), ...e.members.keys()],
    m = (e, t) => (t && (!e || t.blockId > e.blockId) ? t : e);
  e.s([
    "FLUSH_FALLBACK_MS",
    0,
    250,
    "HIDDEN_GRACE_MS",
    0,
    15e3,
    "IDLE_CLOSE_MS",
    0,
    1e4,
    "MAX_QUEUE",
    0,
    256,
    "MAX_SUBSCRIPTIONS_PER_REQUEST",
    0,
    32,
    "MAX_TOPICS",
    0,
    64,
    "STABLE_OPEN_MS",
    0,
    1e4,
    "STALE_MS",
    0,
    15e3,
    "UNSUBSCRIBE_DROP_MS",
    0,
    5e3,
    "WATCHDOG_INTERVAL_MS",
    0,
    5e3,
    "createStreamClient",
    0,
    function (e) {
      let g,
        v,
        h,
        b,
        S,
        k,
        y,
        T = e.now ?? (() => Date.now()),
        w = e.random ?? Math.random,
        M = e.scheduler ?? c,
        A = e.visibility ?? u,
        E = e.socketFactory ?? ((e, t) => new globalThis.WebSocket(e, t)),
        _ = e.log ?? (() => {}),
        O = (t, r, i) => e.onMetric?.({ name: t, value: r, tags: i }),
        C = new Map(),
        R = new Map(),
        I = new Map(),
        P = new Set(),
        L = new Set(),
        D = new Set(),
        B = new Set(),
        q = new Map(),
        F = new Set(),
        N = new Set(),
        K = "idle",
        U = 0,
        x = 0,
        $ = 0,
        H = 0,
        V = new WeakSet(),
        W = !1,
        z = null,
        X = !1,
        j = !A.isVisible(),
        J = !1,
        G = 0,
        Q = !1,
        Y = (e) => {
          if (e !== K) for (let t of ((K = e), P)) t(e);
        },
        Z = () => (X || (z = e.getToken()), z),
        ee = () =>
          [...C.values()].filter(
            (e) =>
              e.holders.size > 0 && !e.unsubscribing && !eo(e, es(e).parts),
          ),
        et = () => {
          v || (v = M.schedule(en, j || !A.isVisible()));
        },
        er = (e, t) => {
          if ((e.queue.push(t), e.queue.length > 256)) {
            let t = p(e.queue);
            ((e.queue = t.some((e) => "gap" === e.kind)
              ? t
              : [{ kind: "gap" }, ...t]),
              O("queue_coalesced", 1));
          }
          (F.add(e.topic), et());
        },
        ei = (e, t, r) => {
          (t.direct.push(r), F.add(e.topic), et());
        },
        ea = (e) => {
          (N.add(e), et());
        };
      function en() {
        ((v = void 0), (V = new WeakSet()));
        let e = 0,
          t = 0,
          r = [...F];
        for (let i of (F.clear(), r)) {
          let r = C.get(i);
          if (!r) continue;
          let a = r.queue;
          r.queue = [];
          let n = R.get(i);
          for (let l of (e++, [...r.holders.values()])) {
            let e = l.direct;
            l.direct = [];
            let r = "all" === l.delivery ? a : p(a),
              s = e.length ? [...e, ...r] : r;
            if (s.length) {
              t += s.length;
              try {
                l.listener(s, n);
              } catch (e) {
                _("error", "uapi-stream listener threw", {
                  topic: i,
                  err: String(e),
                });
              }
            }
          }
        }
        let i = [...N];
        for (let e of (N.clear(), i)) for (let t of [...(I.get(e) ?? [])]) t();
        e && O("flush", t, { topics: String(e) });
      }
      let el = (e) =>
          e.parts.filter((e) => !L.has(e) && !(e === t.Part.POSITION && !Z())),
        es = (e) => {
          let r = [
              ...new Set([...e.holders.values()].flatMap((e) => el(e))),
            ].sort((e, t) => e - t),
            i = [...e.holders.values()],
            a = i.some((e) => e.commitment === t.Commitment.PROCESSED)
              ? t.Commitment.PROCESSED
              : t.Commitment.CONFIRMED,
            n = new Map();
          for (let e of i)
            for (let t of e.candles) n.set(`${t.res}:${t.measure}`, t);
          let l = [...i].reverse().find((e) => e.list)?.list,
            s = JSON.stringify([
              r,
              a,
              [...n.keys()].sort(),
              l
                ? JSON.stringify(l, (e, t) =>
                    "bigint" == typeof t ? String(t) : t,
                  )
                : "",
            ]);
          return {
            parts: r,
            commitment: a,
            candles: [...n.values()],
            list: l,
            key: s,
          };
        },
        eo = (e, t) => !t.length && "coin" === (0, n.topicKind)(e.topic),
        ed = (e, r) =>
          1 !== r.parts.length ||
          r.parts[0] !== t.Part.MARKET ||
          r.candles.length ||
          r.list ||
          "coin" !== (0, n.topicKind)(e.topic)
            ? void 0
            : ((e) => {
                for (let t of C.values()) {
                  if (t.unsubscribing || !t.holders.size) continue;
                  let r = R.get(t.topic),
                    i = (0, a.isListState)(r) ? r.members.get(e) : void 0;
                  if (i) return i;
                }
              })(e.topic.slice(5)),
        ec = (e) => {
          let t = q.get(e) ?? [];
          (t.push(T() + 5e3), q.set(e, t));
        },
        eu = () => {
          Q ||
            ((Q = !0),
            queueMicrotask(() => {
              ((Q = !1), ef());
            }));
        },
        ep = (e) => {
          let t = es(e);
          return (
            (e.union = t.parts),
            (e.commitment = t.commitment),
            (e.candles = t.candles),
            (e.list = t.list),
            (e.sentKey = t.key),
            (e.sent = !0),
            e.epoch++,
            (e.expectedSeq = s),
            (e.awaitingSnapshot = !0),
            {
              topic: e.topic,
              parts: t.parts,
              commitment: t.commitment,
              candles: t.candles,
              since: e.lastBlock,
              lastVersion: e.lastVersion ?? l,
              filters: t.list
                ? { case: "list", value: t.list }
                : { case: void 0 },
            }
          );
        };
      function ef() {
        if (!g || 1 !== g.readyState) return;
        let e = [];
        for (let t of D) {
          if (C.get(t.topic) !== t || t.capped || t.unsubscribing) continue;
          let r = es(t);
          !t.holders.size || eo(t, r.parts) || ed(t, r) || e.push(ep(t));
        }
        D.clear();
        let t = [...B];
        if ((B.clear(), e.length || t.length)) {
          for (let r = 0; r < Math.max(e.length, 1); r += 32) {
            let a = e.slice(r, r + 32);
            g.send(
              (0, i.encodeWatch)({
                subscribe: a,
                unsubscribe: 0 === r ? t : [],
              }),
            );
          }
          for (let e of t) ec(e);
        }
      }
      let em = () =>
          [...C.values()].filter(
            (e) => !e.capped && !e.unsubscribing && !eo(e, es(e).parts),
          ).length,
        eg = (e, t = !1) => {
          if (e.capped || e.unsubscribing || !e.holders.size) return;
          let r = es(e),
            i = ed(e, r);
          if (eo(e, r.parts) || i) {
            (D.delete(e),
              e.sent &&
                ((e.sent = !1), (e.sentKey = void 0), B.add(e.topic), eu()),
              i
                ? ((e.lastBlock = void 0),
                  R.get(e.topic) !== i && (R.set(e.topic, i), ea(e.topic)))
                : ev());
            return;
          }
          (t || !e.sent || r.key !== e.sentKey) &&
            (B.delete(e.topic), D.add(e), eu());
        },
        ev = () => {
          h ||
            ee().length ||
            (h = setTimeout(() => {
              ((h = void 0), ee().length || (eb(), ew("idle")));
            }, 1e4));
        },
        eh = () => {
          (h && clearTimeout(h), (h = void 0));
        },
        eb = () => {
          (b && clearTimeout(b), (b = void 0));
        },
        eS = (e) => {
          for (let t of e) {
            let e = `coin/${t}`;
            !(!t || C.has(e)) &&
              R.has(e) &&
              ([...C.values()].some((e) => {
                let r = R.get(e.topic);
                return (
                  (0, a.isListState)(r) && (r.rank.has(t) || r.members.has(t))
                );
              }) ||
                (R.delete(e), ea(e)));
          }
        },
        ek = () => {
          for (let e of C.values())
            "coin" === (0, n.topicKind)(e.topic) && eg(e);
        },
        ey = (e) => {
          if (
            (e.dropTimer && clearTimeout(e.dropTimer),
            e.retryTimer && clearTimeout(e.retryTimer),
            C.get(e.topic) !== e)
          )
            return;
          (C.delete(e.topic), D.delete(e));
          let t = R.get(e.topic);
          (R.delete(e.topic),
            (0, a.isListState)(t) && (eS(f(t)), ek()),
            ea(e.topic),
            (() => {
              for (let e of C.values()) {
                if (em() >= 64) return;
                e.capped && e.holders.size && ((e.capped = !1), eg(e, !0));
              }
            })(),
            ev());
        },
        eT = () => {
          (y && clearInterval(y),
            (y = void 0),
            k && clearTimeout(k),
            (k = void 0));
        };
      function ew(e) {
        let t = g;
        if (((g = void 0), eT(), t)) {
          ((t.onopen = null),
            (t.onmessage = null),
            (t.onclose = null),
            (t.onerror = null));
          try {
            t.close(1e3);
          } catch (e) {
            _("debug", "uapi-stream close threw", { err: String(e) });
          }
          O("close", 1e3, { code: "1000" });
        }
        for (let e of (q.clear(), C.values())) e.sent = !1;
        "idle" === e
          ? Y("idle")
          : "paused" === e
            ? Y("paused")
            : "redial" === e && eA();
      }
      let eM = (e) => {
        (eb(),
          Y("down"),
          (b = setTimeout(() => {
            ((b = void 0), eA());
          }, e)));
      };
      function eA() {
        let c;
        if (g || J || j || !ee().length) return;
        eb();
        let u = Z(),
          p = e.url + (u ? `?token=${encodeURIComponent(u)}` : "");
        for (let e of (($ = 0), C.values())) e.sent = !1;
        (Y("connecting"), O("connect"), (U = T()));
        try {
          c = E(p, [i.STREAM_PROTOCOL]);
        } catch (e) {
          (_("error", "uapi-stream socket ctor threw", { err: String(e) }),
            eM((0, r.backoffDelay)(H++, w)));
          return;
        }
        ((c.binaryType = "arraybuffer"),
          (g = c),
          (c.onopen = () => {
            if (g !== c) return;
            (Y("open"),
              O("open", T() - U),
              ($ = x = T()),
              (y = setInterval(eE, 5e3)),
              (k = setTimeout(() => {
                H = 0;
              }, 1e4)));
            let e = ee().filter((e) => e.lastBlock || e.lastVersion);
            for (let t of (e.length &&
              O("resume", e.length, { topics: String(e.length) }),
            ee()))
              t.capped || D.add(t);
            ef();
          }),
          (c.onmessage = (e) => {
            g === c &&
              (function (e) {
                let d, c;
                if (((x = T()), "string" == typeof e)) {
                  (_("warn", "uapi-stream ignored a text message"),
                    O("client_bug", 1, { reason: "text_message" }));
                  return;
                }
                try {
                  d = (0, i.decodeFrame)(e);
                } catch (e) {
                  (_("error", "uapi-stream frame decode failed", {
                    err: String(e),
                  }),
                    O("client_bug", 1, { reason: "decode" }));
                  return;
                }
                let u = d.payload;
                if ("heartbeat" === u.case) {
                  var p,
                    g,
                    v = d;
                  if ("heartbeat" !== v.payload.case) return;
                  let e = v.payload.value;
                  O("heartbeat", e.lagMs, {
                    chain: e.chainId,
                    degraded: String(e.degraded),
                  });
                  let t = R.get(""),
                    r = {
                      topic: "",
                      degradedLanes: e.degraded ? e.degradedLanes : [],
                      lagMsByChain: {
                        ...t?.lagMsByChain,
                        [e.chainId]: e.lagMs,
                      },
                    };
                  (R.set("", r),
                    (t &&
                      t.degradedLanes.join() === r.degradedLanes.join() &&
                      t.lagMsByChain[e.chainId] === e.lagMs) ||
                      ea(""));
                  return;
                }
                if (
                  ((p = d.topic),
                  (c = q.get(p)?.filter((e) => e > T())),
                  c?.length ? (q.set(p, c), !0) : (q.delete(p), !1))
                ) {
                  let e;
                  if ("end" !== u.case) return;
                  ((g = d.topic),
                    (e = q.get(g)),
                    e?.shift(),
                    e?.length || q.delete(g));
                  let t = C.get(d.topic);
                  t?.unsubscribing && ey(t);
                  return;
                }
                let h = C.get(d.topic);
                if (h) {
                  if ("gap" === u.case) {
                    (O("gap"),
                      (h.awaitingSnapshot = !0),
                      er(h, {
                        kind: "gap",
                        lastDelivered: u.value.lastDelivered,
                        ringFloor: u.value.ringFloor,
                      }));
                    return;
                  }
                  "end" === u.case
                    ? ((e, i, a) => {
                        if (e.unsubscribing) return ey(e);
                        if (i === t.EndReason.NOT_FOUND) {
                          let r,
                            i,
                            n = o.exec(a),
                            l = n?.[1]
                              ? ((r = n[1].replace(/^PART_/, "")),
                                "number" == typeof (i = t.Part[r]) ? i : void 0)
                              : void 0;
                          if (void 0 !== l) {
                            (L.add(l),
                              e_(
                                e,
                                [...e.holders.values()].filter((e) =>
                                  e.parts.includes(l),
                                ),
                                [l],
                                "not-served",
                              ),
                              (e.sent = !1),
                              eg(e, !0));
                            return;
                          }
                        }
                        if (((e.sent = !1), i === t.EndReason.UNAVAILABLE)) {
                          if (e.unavailableEnds++ >= 1)
                            for (let t of [...e.holders.values()])
                              e_(e, [t], el(t), "unavailable");
                          (e.retryTimer && clearTimeout(e.retryTimer),
                            (e.retryTimer = setTimeout(
                              () => {
                                ((e.retryTimer = void 0),
                                  C.get(e.topic) === e && eg(e, !0));
                              },
                              (0, r.backoffDelay)(e.retries++, w),
                            )));
                          return;
                        }
                        er(e, { kind: "end", reason: i, detail: a });
                      })(h, u.value.reason, u.value.detail)
                    : !h.unsubscribing &&
                      u.case &&
                      ((e, r) => {
                        let i,
                          o = r.payload,
                          d =
                            "coin" === (i = r.payload).case
                              ? i.value.kind === t.FrameKind.SNAPSHOT
                              : "list" === i.case
                                ? "snapshot" === i.value.body.case
                                : "wallet" === i.case &&
                                  i.value.kind === t.WalletFrameKind.SNAPSHOT,
                          c = !1;
                        if (
                          ((e.unavailableEnds = 0),
                          O("frames", 1, {
                            topic_kind: (0, n.topicKind)(r.topic) ?? "unknown",
                          }),
                          d)
                        )
                          ((e.awaitingSnapshot = !1),
                            (e.expectedSeq = r.seq + s),
                            (e.retries = 0));
                        else if (e.awaitingSnapshot) {
                          let t;
                          r.seq !== l &&
                            ((("coin" === (t = r.payload).case ||
                              "list" === t.case ||
                              "wallet" === t.case) &&
                              t.value.replayed) ||
                              r.seq === e.expectedSeq) &&
                            ((e.awaitingSnapshot = !1),
                            (e.expectedSeq = r.seq + s),
                            (e.retries = 0));
                        } else
                          r.seq !== l &&
                            (r.seq !== e.expectedSeq
                              ? (O("seq_skip", 1, {
                                  topic_kind:
                                    (0, n.topicKind)(r.topic) ?? "unknown",
                                }),
                                (c = !0),
                                er(e, {
                                  kind: "gap",
                                  lastDelivered: e.lastBlock,
                                }),
                                eg(e, !0))
                              : (e.expectedSeq = r.seq + s));
                        let u = T(),
                          p = R.get(e.topic),
                          g = !1;
                        if ("coin" === o.case) {
                          let t = o.value;
                          ((g = t.replayed),
                            R.set(
                              e.topic,
                              (0, a.foldCoin)(
                                (0, a.isCoinState)(p) ? p : void 0,
                                t,
                                e.topic,
                                u,
                              ),
                            ),
                            c || (e.lastBlock = m(e.lastBlock, t.block)),
                            d &&
                              t.unavailable.length &&
                              er(e, {
                                kind: "unavailable",
                                parts: t.unavailable,
                                why: "snapshot",
                              }));
                        } else if ("list" === o.case) {
                          let r = o.value;
                          g = r.replayed;
                          let i = (0, a.isListState)(p) ? p : void 0,
                            n = (0, a.foldList)(i, r, e.topic, u, V);
                          (R.set(e.topic, n),
                            "member" === r.body.case
                              ? ((e, r, i) => {
                                  if (!r.id) return;
                                  let n = (0, a.memberTopic)(r.id),
                                    l = e.members.get((0, a.refKey)(r.id)),
                                    s = C.get(n);
                                  if (l && (r.market || s || R.has(n))) {
                                    if (s) {
                                      if ((eg(s), !ed(s, es(s)))) return;
                                      er(s, {
                                        kind: "frame",
                                        frame: new t.Frame({
                                          topic: n,
                                          payload: { case: "coin", value: r },
                                        }),
                                        snapshot: !1,
                                        replayed: i,
                                      });
                                    }
                                    (R.set(n, l), ea(n));
                                  }
                                })(n, r.body.value, r.replayed)
                              : (i && eS(f(i)), ek()),
                            c || (e.lastBlock = m(e.lastBlock, r.asOf)),
                            r.version > l && (e.lastVersion = r.version));
                        } else if ("wallet" === o.case) {
                          let t = o.value;
                          ((g = t.replayed),
                            R.set(e.topic, { topic: e.topic, wallet: t }),
                            c || (e.lastBlock = m(e.lastBlock, t.asOf)));
                        }
                        (ea(e.topic),
                          er(e, {
                            kind: "frame",
                            frame: r,
                            snapshot: d,
                            replayed: g,
                          }));
                      })(h, d);
                }
              })(e.data);
          }),
          (c.onclose = (e) => {
            g === c &&
              ((e, t) => {
                for (let e of ((g = void 0), eT(), q.clear(), C.values()))
                  e.sent = !1;
                if ((O("close", e, { code: String(e) }), !J)) {
                  if ((1001 === e && L.clear(), !ee().length)) return Y("idle");
                  if (j) return Y("paused");
                  if (1008 === e) {
                    if (
                      (O("client_bug", 1, { reason: t || "policy" }),
                      d.test(t) && !W)
                    ) {
                      ((W = !0), (X = !1), eM(0));
                      return;
                    }
                    (_("error", "uapi-stream closed by policy", { reason: t }),
                      Y("down"));
                    return;
                  }
                  if (
                    ((1003 === e || 1007 === e) &&
                      (_("error", "uapi-stream rejected a message", {
                        code: e,
                        reason: t,
                      }),
                      O("client_bug", 1, { reason: `close_${e}` })),
                    1013 === e)
                  ) {
                    (eM(
                      $ > 0 && T() - $ >= 1e4
                        ? (0, r.drainDelay)(w)
                        : Math.min(r.BACKOFF_MAX_MS, (0, r.backoffDelay)(H, w)),
                    ),
                      H++);
                    return;
                  }
                  eM((0, r.backoffDelay)(H++, w));
                }
              })(e.code, e.reason);
          }),
          (c.onerror = () => {
            g === c && _("warn", "uapi-stream socket error");
          }));
      }
      function eE() {
        g &&
          ee().length &&
          (T() - x < 15e3 ||
            (O("stale_close"),
            _("warn", "uapi-stream stale socket, redialing"),
            ew("redial")));
      }
      let e_ = (e, t, r, i) => {
          for (let a of t) ei(e, a, { kind: "unavailable", parts: r, why: i });
        },
        eO = () => {
          if (J) return;
          (S && clearTimeout(S), (S = void 0));
          let e = j;
          ((j = !1),
            !g &&
              (e || "down" === K || "paused" === K) &&
              ((H = 0), eb(), eA()));
        },
        eC = (e) => {
          if (!J) {
            if (e) {
              (S && clearTimeout(S),
                (S = void 0),
                (j = !0),
                eb(),
                ew("paused"));
              return;
            }
            S ||
              (S = setTimeout(() => {
                ((S = void 0), (j = !0), eb(), ew("paused"));
              }, 15e3));
          }
        },
        eR = A.subscribe((e) => (e ? eO() : eC(!1)));
      return {
        subscribe(e, r, i) {
          if (J) return () => {};
          let a = (0, n.topicKind)(e),
            l = ++G,
            o = {
              parts: r.parts ?? ("coin" === a ? [t.Part.MARKET] : []),
              commitment:
                r.commitment ??
                ("wallet" === a
                  ? t.Commitment.CONFIRMED
                  : t.Commitment.PROCESSED),
              candles: r.candles ?? [],
              list: r.list,
              delivery: r.delivery ?? "latest",
              listener: i,
              direct: [],
            },
            d = C.get(e);
          (d?.unsubscribing &&
            (d.dropTimer && clearTimeout(d.dropTimer),
            d.retryTimer && clearTimeout(d.retryTimer),
            C.delete(e),
            B.delete(e),
            (d = void 0)),
            !d &&
              ((d = {
                topic: e,
                holders: new Map(),
                union: [],
                commitment: o.commitment,
                candles: [],
                epoch: 0,
                expectedSeq: s,
                awaitingSnapshot: !0,
                queue: [],
                sent: !1,
                capped: em() >= 64,
                unsubscribing: !1,
                retries: 0,
                unavailableEnds: 0,
              }),
              C.set(e, d),
              d.capped && O("topics_capped", 1)));
          let c = d;
          if ((c.holders.set(l, o), eh(), c.capped))
            e_(c, [o], o.parts, "topic-cap");
          else {
            o.parts.includes(t.Part.POSITION) &&
              !Z() &&
              e_(c, [o], [t.Part.POSITION], "no-viewer");
            let e = o.parts.filter((e) => L.has(e));
            (e.length && e_(c, [o], e, "not-served"), eg(c));
          }
          return (
            g || b || eA(),
            () => {
              if (c.holders.delete(l) && C.get(e) === c)
                if (0 === c.holders.size)
                  !c.capped && c.sent && g && 1 === g.readyState
                    ? ((c.unsubscribing = !0),
                      D.delete(c),
                      B.add(c.topic),
                      eu(),
                      (c.dropTimer = setTimeout(() => ey(c), 5e3)))
                    : ey(c);
                else eg(c);
            }
          );
        },
        getState: (e) => R.get(e),
        onTopic(e, t) {
          let r = I.get(e);
          return (
            r || ((r = new Set()), I.set(e, r)),
            r.add(t),
            () => {
              (r.delete(t), r.size || I.delete(e));
            }
          );
        },
        status: () => K,
        lastFrameAt: () => x,
        onStatus: (e) => (
          P.add(e),
          () => {
            P.delete(e);
          }
        ),
        setToken(e) {
          let t = Z();
          ((z = e), (X = !0), (W = !1), t !== e && g && ew("redial"));
        },
        pause() {
          eC(!0);
        },
        resume() {
          eO();
        },
        close() {
          for (let e of ((J = !0),
          eR(),
          eh(),
          eb(),
          S && clearTimeout(S),
          v?.(),
          (v = void 0),
          ew("idle"),
          C.values()))
            (e.dropTimer && clearTimeout(e.dropTimer),
              e.retryTimer && clearTimeout(e.retryTimer));
          (C.clear(), R.clear(), L.clear());
        },
        heldTopics: () => [...C.keys()],
      };
    },
  ]);
};
