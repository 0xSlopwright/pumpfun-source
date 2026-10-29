// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(872682),
    i = e.i(168266),
    r = e.i(776238),
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
            i = requestAnimationFrame(() => {
              (clearTimeout(t), e());
            });
          return (
            (t = setTimeout(() => {
              (cancelAnimationFrame(i), e());
            }, 250)),
            () => {
              (cancelAnimationFrame(i), clearTimeout(t));
            }
          );
        }
        let i = setTimeout(e, t ? 1e3 : 16);
        return () => clearTimeout(i);
      },
    },
    u = { isVisible: () => !0, subscribe: () => () => {} },
    p = (e) => {
      let t = -1;
      for (let i = e.length - 1; i >= 0; i--)
        if (e[i]?.kind === "frame") {
          t = i;
          break;
        }
      return e.filter((e, i) => "frame" !== e.kind || i === t);
    },
    m = (e) => [...e.rank.keys(), ...e.members.keys()],
    f = (e, t) => (t && (!e || t.blockId > e.blockId) ? t : e);
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
      let v,
        g,
        h,
        b,
        S,
        k,
        y,
        T = e.now ?? (() => Date.now()),
        w = e.random ?? Math.random,
        E = e.scheduler ?? c,
        A = e.visibility ?? u,
        M = e.socketFactory ?? ((e, t) => new globalThis.WebSocket(e, t)),
        O = e.log ?? (() => {}),
        C = (t, i, r) => e.onMetric?.({ name: t, value: i, tags: r }),
        _ = new Map(),
        I = new Map(),
        L = new Map(),
        P = new Set(),
        R = new Set(),
        D = new Set(),
        N = new Set(),
        q = new Map(),
        B = new Set(),
        U = new Set(),
        F = "idle",
        K = 0,
        x = 0,
        H = 0,
        W = 0,
        $ = new WeakSet(),
        V = !1,
        X = null,
        z = !1,
        G = !A.isVisible(),
        j = !1,
        J = 0,
        Q = !1,
        Y = (e) => {
          if (e !== F) for (let t of ((F = e), P)) t(e);
        },
        Z = () => (z || (X = e.getToken()), X),
        ee = () =>
          [..._.values()].filter(
            (e) =>
              e.holders.size > 0 && !e.unsubscribing && !eo(e, es(e).parts),
          ),
        et = () => {
          g || (g = E.schedule(en, G || !A.isVisible()));
        },
        ei = (e, t) => {
          if ((e.queue.push(t), e.queue.length > 256)) {
            let t = p(e.queue);
            ((e.queue = t.some((e) => "gap" === e.kind)
              ? t
              : [{ kind: "gap" }, ...t]),
              C("queue_coalesced", 1));
          }
          (B.add(e.topic), et());
        },
        er = (e, t, i) => {
          (t.direct.push(i), B.add(e.topic), et());
        },
        ea = (e) => {
          (U.add(e), et());
        };
      function en() {
        ((g = void 0), ($ = new WeakSet()));
        let e = 0,
          t = 0,
          i = [...B];
        for (let r of (B.clear(), i)) {
          let i = _.get(r);
          if (!i) continue;
          let a = i.queue;
          i.queue = [];
          let n = I.get(r);
          for (let l of (e++, [...i.holders.values()])) {
            let e = l.direct;
            l.direct = [];
            let i = "all" === l.delivery ? a : p(a),
              s = e.length ? [...e, ...i] : i;
            if (s.length) {
              t += s.length;
              try {
                l.listener(s, n);
              } catch (e) {
                O("error", "uapi-stream listener threw", {
                  topic: r,
                  err: String(e),
                });
              }
            }
          }
        }
        let r = [...U];
        for (let e of (U.clear(), r)) for (let t of [...(L.get(e) ?? [])]) t();
        e && C("flush", t, { topics: String(e) });
      }
      let el = (e) =>
          e.parts.filter((e) => !R.has(e) && !(e === t.Part.POSITION && !Z())),
        es = (e) => {
          let i = [
              ...new Set([...e.holders.values()].flatMap((e) => el(e))),
            ].sort((e, t) => e - t),
            r = [...e.holders.values()],
            a = r.some((e) => e.commitment === t.Commitment.PROCESSED)
              ? t.Commitment.PROCESSED
              : t.Commitment.CONFIRMED,
            n = new Map();
          for (let e of r)
            for (let t of e.candles) n.set(`${t.res}:${t.measure}`, t);
          let l = [...r].reverse().find((e) => e.list)?.list,
            s = JSON.stringify([
              i,
              a,
              [...n.keys()].sort(),
              l
                ? JSON.stringify(l, (e, t) =>
                    "bigint" == typeof t ? String(t) : t,
                  )
                : "",
            ]);
          return {
            parts: i,
            commitment: a,
            candles: [...n.values()],
            list: l,
            key: s,
          };
        },
        eo = (e, t) => !t.length && "coin" === (0, n.topicKind)(e.topic),
        ed = (e, i) =>
          1 !== i.parts.length ||
          i.parts[0] !== t.Part.MARKET ||
          i.candles.length ||
          i.list ||
          "coin" !== (0, n.topicKind)(e.topic)
            ? void 0
            : ((e) => {
                for (let t of _.values()) {
                  if (t.unsubscribing || !t.holders.size) continue;
                  let i = I.get(t.topic),
                    r = (0, a.isListState)(i) ? i.members.get(e) : void 0;
                  if (r) return r;
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
              ((Q = !1), em());
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
      function em() {
        if (!v || 1 !== v.readyState) return;
        let e = [];
        for (let t of D) {
          if (_.get(t.topic) !== t || t.capped || t.unsubscribing) continue;
          let i = es(t);
          !t.holders.size || eo(t, i.parts) || ed(t, i) || e.push(ep(t));
        }
        D.clear();
        let t = [...N];
        if ((N.clear(), e.length || t.length)) {
          for (let i = 0; i < Math.max(e.length, 1); i += 32) {
            let a = e.slice(i, i + 32);
            v.send(
              (0, r.encodeWatch)({
                subscribe: a,
                unsubscribe: 0 === i ? t : [],
              }),
            );
          }
          for (let e of t) ec(e);
        }
      }
      let ef = () =>
          [..._.values()].filter(
            (e) => !e.capped && !e.unsubscribing && !eo(e, es(e).parts),
          ).length,
        ev = (e, t = !1) => {
          if (e.capped || e.unsubscribing || !e.holders.size) return;
          let i = es(e),
            r = ed(e, i);
          if (eo(e, i.parts) || r) {
            (D.delete(e),
              e.sent &&
                ((e.sent = !1), (e.sentKey = void 0), N.add(e.topic), eu()),
              r
                ? ((e.lastBlock = void 0),
                  I.get(e.topic) !== r && (I.set(e.topic, r), ea(e.topic)))
                : eg());
            return;
          }
          (t || !e.sent || i.key !== e.sentKey) &&
            (N.delete(e.topic), D.add(e), eu());
        },
        eg = () => {
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
            !(!t || _.has(e)) &&
              I.has(e) &&
              ([..._.values()].some((e) => {
                let i = I.get(e.topic);
                return (
                  (0, a.isListState)(i) && (i.rank.has(t) || i.members.has(t))
                );
              }) ||
                (I.delete(e), ea(e)));
          }
        },
        ek = () => {
          for (let e of _.values())
            "coin" === (0, n.topicKind)(e.topic) && ev(e);
        },
        ey = (e) => {
          if (
            (e.dropTimer && clearTimeout(e.dropTimer),
            e.retryTimer && clearTimeout(e.retryTimer),
            _.get(e.topic) !== e)
          )
            return;
          (_.delete(e.topic), D.delete(e));
          let t = I.get(e.topic);
          (I.delete(e.topic),
            (0, a.isListState)(t) && (eS(m(t)), ek()),
            ea(e.topic),
            (() => {
              for (let e of _.values()) {
                if (ef() >= 64) return;
                e.capped && e.holders.size && ((e.capped = !1), ev(e, !0));
              }
            })(),
            eg());
        },
        eT = () => {
          (y && clearInterval(y),
            (y = void 0),
            k && clearTimeout(k),
            (k = void 0));
        };
      function ew(e) {
        let t = v;
        if (((v = void 0), eT(), t)) {
          ((t.onopen = null),
            (t.onmessage = null),
            (t.onclose = null),
            (t.onerror = null));
          try {
            t.close(1e3);
          } catch (e) {
            O("debug", "uapi-stream close threw", { err: String(e) });
          }
          C("close", 1e3, { code: "1000" });
        }
        for (let e of (q.clear(), _.values())) e.sent = !1;
        "idle" === e
          ? Y("idle")
          : "paused" === e
            ? Y("paused")
            : "redial" === e && eA();
      }
      let eE = (e) => {
        (eb(),
          Y("down"),
          (b = setTimeout(() => {
            ((b = void 0), eA());
          }, e)));
      };
      function eA() {
        let c;
        if (v || j || G || !ee().length) return;
        eb();
        let u = Z(),
          p = e.url + (u ? `?token=${encodeURIComponent(u)}` : "");
        for (let e of ((H = 0), _.values())) e.sent = !1;
        (Y("connecting"), C("connect"), (K = T()));
        try {
          c = M(p, [r.STREAM_PROTOCOL]);
        } catch (e) {
          (O("error", "uapi-stream socket ctor threw", { err: String(e) }),
            eE((0, i.backoffDelay)(W++, w)));
          return;
        }
        ((c.binaryType = "arraybuffer"),
          (v = c),
          (c.onopen = () => {
            if (v !== c) return;
            (Y("open"),
              C("open", T() - K),
              (H = x = T()),
              (y = setInterval(eM, 5e3)),
              (k = setTimeout(() => {
                W = 0;
              }, 1e4)));
            let e = ee().filter((e) => e.lastBlock || e.lastVersion);
            for (let t of (e.length &&
              C("resume", e.length, { topics: String(e.length) }),
            ee()))
              t.capped || D.add(t);
            em();
          }),
          (c.onmessage = (e) => {
            v === c &&
              (function (e) {
                let d, c;
                if (((x = T()), "string" == typeof e)) {
                  (O("warn", "uapi-stream ignored a text message"),
                    C("client_bug", 1, { reason: "text_message" }));
                  return;
                }
                try {
                  d = (0, r.decodeFrame)(e);
                } catch (e) {
                  (O("error", "uapi-stream frame decode failed", {
                    err: String(e),
                  }),
                    C("client_bug", 1, { reason: "decode" }));
                  return;
                }
                let u = d.payload;
                if ("heartbeat" === u.case) {
                  var p,
                    v,
                    g = d;
                  if ("heartbeat" !== g.payload.case) return;
                  let e = g.payload.value;
                  C("heartbeat", e.lagMs, {
                    chain: e.chainId,
                    degraded: String(e.degraded),
                  });
                  let t = I.get(""),
                    i = {
                      topic: "",
                      degradedLanes: e.degraded ? e.degradedLanes : [],
                      lagMsByChain: {
                        ...t?.lagMsByChain,
                        [e.chainId]: e.lagMs,
                      },
                    };
                  (I.set("", i),
                    (t &&
                      t.degradedLanes.join() === i.degradedLanes.join() &&
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
                  ((v = d.topic),
                    (e = q.get(v)),
                    e?.shift(),
                    e?.length || q.delete(v));
                  let t = _.get(d.topic);
                  t?.unsubscribing && ey(t);
                  return;
                }
                let h = _.get(d.topic);
                if (h) {
                  if ("gap" === u.case) {
                    (C("gap"),
                      (h.awaitingSnapshot = !0),
                      ei(h, {
                        kind: "gap",
                        lastDelivered: u.value.lastDelivered,
                        ringFloor: u.value.ringFloor,
                      }));
                    return;
                  }
                  "end" === u.case
                    ? ((e, r, a) => {
                        if (e.unsubscribing) return ey(e);
                        if (r === t.EndReason.NOT_FOUND) {
                          let i,
                            r,
                            n = o.exec(a),
                            l = n?.[1]
                              ? ((i = n[1].replace(/^PART_/, "")),
                                "number" == typeof (r = t.Part[i]) ? r : void 0)
                              : void 0;
                          if (void 0 !== l) {
                            (R.add(l),
                              eO(
                                e,
                                [...e.holders.values()].filter((e) =>
                                  e.parts.includes(l),
                                ),
                                [l],
                                "not-served",
                              ),
                              (e.sent = !1),
                              ev(e, !0));
                            return;
                          }
                        }
                        if (((e.sent = !1), r === t.EndReason.UNAVAILABLE)) {
                          if (e.unavailableEnds++ >= 1)
                            for (let t of [...e.holders.values()])
                              eO(e, [t], el(t), "unavailable");
                          (e.retryTimer && clearTimeout(e.retryTimer),
                            (e.retryTimer = setTimeout(
                              () => {
                                ((e.retryTimer = void 0),
                                  _.get(e.topic) === e && ev(e, !0));
                              },
                              (0, i.backoffDelay)(e.retries++, w),
                            )));
                          return;
                        }
                        ei(e, { kind: "end", reason: r, detail: a });
                      })(h, u.value.reason, u.value.detail)
                    : !h.unsubscribing &&
                      u.case &&
                      ((e, i) => {
                        let r,
                          o = i.payload,
                          d =
                            "coin" === (r = i.payload).case
                              ? r.value.kind === t.FrameKind.SNAPSHOT
                              : "list" === r.case
                                ? "snapshot" === r.value.body.case
                                : "wallet" === r.case &&
                                  r.value.kind === t.WalletFrameKind.SNAPSHOT,
                          c = !1;
                        if (
                          ((e.unavailableEnds = 0),
                          C("frames", 1, {
                            topic_kind: (0, n.topicKind)(i.topic) ?? "unknown",
                          }),
                          d)
                        )
                          ((e.awaitingSnapshot = !1),
                            (e.expectedSeq = i.seq + s),
                            (e.retries = 0));
                        else if (e.awaitingSnapshot) {
                          let t;
                          i.seq !== l &&
                            ((("coin" === (t = i.payload).case ||
                              "list" === t.case ||
                              "wallet" === t.case) &&
                              t.value.replayed) ||
                              i.seq === e.expectedSeq) &&
                            ((e.awaitingSnapshot = !1),
                            (e.expectedSeq = i.seq + s),
                            (e.retries = 0));
                        } else
                          i.seq !== l &&
                            (i.seq !== e.expectedSeq
                              ? (C("seq_skip", 1, {
                                  topic_kind:
                                    (0, n.topicKind)(i.topic) ?? "unknown",
                                }),
                                (c = !0),
                                ei(e, {
                                  kind: "gap",
                                  lastDelivered: e.lastBlock,
                                }),
                                ev(e, !0))
                              : (e.expectedSeq = i.seq + s));
                        let u = T(),
                          p = I.get(e.topic),
                          v = !1;
                        if ("coin" === o.case) {
                          let t = o.value;
                          ((v = t.replayed),
                            I.set(
                              e.topic,
                              (0, a.foldCoin)(
                                (0, a.isCoinState)(p) ? p : void 0,
                                t,
                                e.topic,
                                u,
                              ),
                            ),
                            c || (e.lastBlock = f(e.lastBlock, t.block)),
                            d &&
                              t.unavailable.length &&
                              ei(e, {
                                kind: "unavailable",
                                parts: t.unavailable,
                                why: "snapshot",
                              }));
                        } else if ("list" === o.case) {
                          let i = o.value;
                          v = i.replayed;
                          let r = (0, a.isListState)(p) ? p : void 0,
                            n = (0, a.foldList)(r, i, e.topic, u, $);
                          (I.set(e.topic, n),
                            "member" === i.body.case
                              ? ((e, i, r) => {
                                  if (!i.id) return;
                                  let n = (0, a.memberTopic)(i.id),
                                    l = e.members.get((0, a.refKey)(i.id)),
                                    s = _.get(n);
                                  if (l && (i.market || s || I.has(n))) {
                                    if (s) {
                                      if ((ev(s), !ed(s, es(s)))) return;
                                      ei(s, {
                                        kind: "frame",
                                        frame: new t.Frame({
                                          topic: n,
                                          payload: { case: "coin", value: i },
                                        }),
                                        snapshot: !1,
                                        replayed: r,
                                      });
                                    }
                                    (I.set(n, l), ea(n));
                                  }
                                })(n, i.body.value, i.replayed)
                              : (r && eS(m(r)), ek()),
                            c || (e.lastBlock = f(e.lastBlock, i.asOf)),
                            i.version > l && (e.lastVersion = i.version));
                        } else if ("wallet" === o.case) {
                          let t = o.value;
                          ((v = t.replayed),
                            I.set(e.topic, { topic: e.topic, wallet: t }),
                            c || (e.lastBlock = f(e.lastBlock, t.asOf)));
                        }
                        (ea(e.topic),
                          ei(e, {
                            kind: "frame",
                            frame: i,
                            snapshot: d,
                            replayed: v,
                          }));
                      })(h, d);
                }
              })(e.data);
          }),
          (c.onclose = (e) => {
            v === c &&
              ((e, t) => {
                for (let e of ((v = void 0), eT(), q.clear(), _.values()))
                  e.sent = !1;
                if ((C("close", e, { code: String(e) }), !j)) {
                  if ((1001 === e && R.clear(), !ee().length)) return Y("idle");
                  if (G) return Y("paused");
                  if (1008 === e) {
                    if (
                      (C("client_bug", 1, { reason: t || "policy" }),
                      d.test(t) && !V)
                    ) {
                      ((V = !0), (z = !1), eE(0));
                      return;
                    }
                    (O("error", "uapi-stream closed by policy", { reason: t }),
                      Y("down"));
                    return;
                  }
                  if (
                    ((1003 === e || 1007 === e) &&
                      (O("error", "uapi-stream rejected a message", {
                        code: e,
                        reason: t,
                      }),
                      C("client_bug", 1, { reason: `close_${e}` })),
                    1013 === e)
                  ) {
                    (eE(
                      H > 0 && T() - H >= 1e4
                        ? (0, i.drainDelay)(w)
                        : Math.min(i.BACKOFF_MAX_MS, (0, i.backoffDelay)(W, w)),
                    ),
                      W++);
                    return;
                  }
                  eE((0, i.backoffDelay)(W++, w));
                }
              })(e.code, e.reason);
          }),
          (c.onerror = () => {
            v === c && O("warn", "uapi-stream socket error");
          }));
      }
      function eM() {
        v &&
          ee().length &&
          (T() - x < 15e3 ||
            (C("stale_close"),
            O("warn", "uapi-stream stale socket, redialing"),
            ew("redial")));
      }
      let eO = (e, t, i, r) => {
          for (let a of t) er(e, a, { kind: "unavailable", parts: i, why: r });
        },
        eC = () => {
          if (j) return;
          (S && clearTimeout(S), (S = void 0));
          let e = G;
          ((G = !1),
            !v &&
              (e || "down" === F || "paused" === F) &&
              ((W = 0), eb(), eA()));
        },
        e_ = (e) => {
          if (!j) {
            if (e) {
              (S && clearTimeout(S),
                (S = void 0),
                (G = !0),
                eb(),
                ew("paused"));
              return;
            }
            S ||
              (S = setTimeout(() => {
                ((S = void 0), (G = !0), eb(), ew("paused"));
              }, 15e3));
          }
        },
        eI = A.subscribe((e) => (e ? eC() : e_(!1)));
      return {
        subscribe(e, i, r) {
          if (j) return () => {};
          let a = (0, n.topicKind)(e),
            l = ++J,
            o = {
              parts: i.parts ?? ("coin" === a ? [t.Part.MARKET] : []),
              commitment:
                i.commitment ??
                ("wallet" === a
                  ? t.Commitment.CONFIRMED
                  : t.Commitment.PROCESSED),
              candles: i.candles ?? [],
              list: i.list,
              delivery: i.delivery ?? "latest",
              listener: r,
              direct: [],
            },
            d = _.get(e);
          (d?.unsubscribing &&
            (d.dropTimer && clearTimeout(d.dropTimer),
            d.retryTimer && clearTimeout(d.retryTimer),
            _.delete(e),
            N.delete(e),
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
                capped: ef() >= 64,
                unsubscribing: !1,
                retries: 0,
                unavailableEnds: 0,
              }),
              _.set(e, d),
              d.capped && C("topics_capped", 1)));
          let c = d;
          if ((c.holders.set(l, o), eh(), c.capped))
            eO(c, [o], o.parts, "topic-cap");
          else {
            o.parts.includes(t.Part.POSITION) &&
              !Z() &&
              eO(c, [o], [t.Part.POSITION], "no-viewer");
            let e = o.parts.filter((e) => R.has(e));
            (e.length && eO(c, [o], e, "not-served"), ev(c));
          }
          return (
            v || b || eA(),
            () => {
              if (c.holders.delete(l) && _.get(e) === c)
                if (0 === c.holders.size)
                  !c.capped && c.sent && v && 1 === v.readyState
                    ? ((c.unsubscribing = !0),
                      D.delete(c),
                      N.add(c.topic),
                      eu(),
                      (c.dropTimer = setTimeout(() => ey(c), 5e3)))
                    : ey(c);
                else ev(c);
            }
          );
        },
        getState: (e) => I.get(e),
        onTopic(e, t) {
          let i = L.get(e);
          return (
            i || ((i = new Set()), L.set(e, i)),
            i.add(t),
            () => {
              (i.delete(t), i.size || L.delete(e));
            }
          );
        },
        status: () => F,
        lastFrameAt: () => x,
        onStatus: (e) => (
          P.add(e),
          () => {
            P.delete(e);
          }
        ),
        setToken(e) {
          let t = Z();
          ((X = e), (z = !0), (V = !1), t !== e && v && ew("redial"));
        },
        pause() {
          e_(!0);
        },
        resume() {
          eC();
        },
        close() {
          for (let e of ((j = !0),
          eI(),
          eh(),
          eb(),
          S && clearTimeout(S),
          g?.(),
          (g = void 0),
          ew("idle"),
          _.values()))
            (e.dropTimer && clearTimeout(e.dropTimer),
              e.retryTimer && clearTimeout(e.retryTimer));
          (_.clear(), I.clear(), R.clear());
        },
        heldTopics: () => [..._.keys()],
      };
    },
  ]);
};
