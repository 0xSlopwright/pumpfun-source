// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(872682),
    i = e.i(168266),
    r = e.i(776238),
    a = e.i(369773),
    n = e.i(163401);
  let s = BigInt(0),
    l = BigInt(1),
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
    m = (e) => {
      let t = -1;
      for (let i = e.length - 1; i >= 0; i--)
        if (e[i]?.kind === "frame") {
          t = i;
          break;
        }
      return e.filter((e, i) => "frame" !== e.kind || i === t);
    },
    p = (e) => [...e.rank.keys(), ...e.members.keys()],
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
      let g,
        v,
        h,
        b,
        S,
        k,
        y,
        w = e.now ?? (() => Date.now()),
        T = e.random ?? Math.random,
        _ = e.scheduler ?? c,
        E = e.visibility ?? u,
        M = e.socketFactory ?? ((e, t) => new globalThis.WebSocket(e, t)),
        A = e.log ?? (() => {}),
        O = (t, i, r) => e.onMetric?.({ name: t, value: i, tags: r }),
        I = new Map(),
        C = new Map(),
        L = new Map(),
        B = new Set(),
        D = new Set(),
        P = new Set(),
        N = new Set(),
        R = new Map(),
        F = new Set(),
        K = new Set(),
        U = "idle",
        q = 0,
        x = 0,
        W = 0,
        H = 0,
        $ = new WeakSet(),
        V = !1,
        X = null,
        z = !1,
        j = !E.isVisible(),
        J = !1,
        G = 0,
        Q = !1,
        Y = (e) => {
          if (e !== U) for (let t of ((U = e), B)) t(e);
        },
        Z = () => (z || (X = e.getToken()), X),
        ee = () =>
          [...I.values()].filter(
            (e) =>
              e.holders.size > 0 && !e.unsubscribing && !eo(e, el(e).parts),
          ),
        et = () => {
          v || (v = _.schedule(en, j || !E.isVisible()));
        },
        ei = (e, t) => {
          if ((e.queue.push(t), e.queue.length > 256)) {
            let t = m(e.queue);
            ((e.queue = t.some((e) => "gap" === e.kind)
              ? t
              : [{ kind: "gap" }, ...t]),
              O("queue_coalesced", 1));
          }
          (F.add(e.topic), et());
        },
        er = (e, t, i) => {
          (t.direct.push(i), F.add(e.topic), et());
        },
        ea = (e) => {
          (K.add(e), et());
        };
      function en() {
        ((v = void 0), ($ = new WeakSet()));
        let e = 0,
          t = 0,
          i = [...F];
        for (let r of (F.clear(), i)) {
          let i = I.get(r);
          if (!i) continue;
          let a = i.queue;
          i.queue = [];
          let n = C.get(r);
          for (let s of (e++, [...i.holders.values()])) {
            let e = s.direct;
            s.direct = [];
            let i = "all" === s.delivery ? a : m(a),
              l = e.length ? [...e, ...i] : i;
            if (l.length) {
              t += l.length;
              try {
                s.listener(l, n);
              } catch (e) {
                A("error", "uapi-stream listener threw", {
                  topic: r,
                  err: String(e),
                });
              }
            }
          }
        }
        let r = [...K];
        for (let e of (K.clear(), r)) for (let t of [...(L.get(e) ?? [])]) t();
        e && O("flush", t, { topics: String(e) });
      }
      let es = (e) =>
          e.parts.filter((e) => !D.has(e) && !(e === t.Part.POSITION && !Z())),
        el = (e) => {
          let i = [
              ...new Set([...e.holders.values()].flatMap((e) => es(e))),
            ].sort((e, t) => e - t),
            r = [...e.holders.values()],
            a = r.some((e) => e.commitment === t.Commitment.PROCESSED)
              ? t.Commitment.PROCESSED
              : t.Commitment.CONFIRMED,
            n = new Map();
          for (let e of r)
            for (let t of e.candles) n.set(`${t.res}:${t.measure}`, t);
          let s = [...r].reverse().find((e) => e.list)?.list,
            l = JSON.stringify([
              i,
              a,
              [...n.keys()].sort(),
              s
                ? JSON.stringify(s, (e, t) =>
                    "bigint" == typeof t ? String(t) : t,
                  )
                : "",
            ]);
          return {
            parts: i,
            commitment: a,
            candles: [...n.values()],
            list: s,
            key: l,
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
                for (let t of I.values()) {
                  if (t.unsubscribing || !t.holders.size) continue;
                  let i = C.get(t.topic),
                    r = (0, a.isListState)(i) ? i.members.get(e) : void 0;
                  if (r) return r;
                }
              })(e.topic.slice(5)),
        ec = (e) => {
          let t = R.get(e) ?? [];
          (t.push(w() + 5e3), R.set(e, t));
        },
        eu = () => {
          Q ||
            ((Q = !0),
            queueMicrotask(() => {
              ((Q = !1), ep());
            }));
        },
        em = (e) => {
          let t = el(e);
          return (
            (e.union = t.parts),
            (e.commitment = t.commitment),
            (e.candles = t.candles),
            (e.list = t.list),
            (e.sentKey = t.key),
            (e.sent = !0),
            e.epoch++,
            (e.expectedSeq = l),
            (e.awaitingSnapshot = !0),
            {
              topic: e.topic,
              parts: t.parts,
              commitment: t.commitment,
              candles: t.candles,
              since: e.lastBlock,
              lastVersion: e.lastVersion ?? s,
              filters: t.list
                ? { case: "list", value: t.list }
                : { case: void 0 },
            }
          );
        };
      function ep() {
        if (!g || 1 !== g.readyState) return;
        let e = [];
        for (let t of P) {
          if (I.get(t.topic) !== t || t.capped || t.unsubscribing) continue;
          let i = el(t);
          !t.holders.size || eo(t, i.parts) || ed(t, i) || e.push(em(t));
        }
        P.clear();
        let t = [...N];
        if ((N.clear(), e.length || t.length)) {
          for (let i = 0; i < Math.max(e.length, 1); i += 32) {
            let a = e.slice(i, i + 32);
            g.send(
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
          [...I.values()].filter(
            (e) => !e.capped && !e.unsubscribing && !eo(e, el(e).parts),
          ).length,
        eg = (e, t = !1) => {
          if (e.capped || e.unsubscribing || !e.holders.size) return;
          let i = el(e),
            r = ed(e, i);
          if (eo(e, i.parts) || r) {
            (P.delete(e),
              e.sent &&
                ((e.sent = !1), (e.sentKey = void 0), N.add(e.topic), eu()),
              r
                ? ((e.lastBlock = void 0),
                  C.get(e.topic) !== r && (C.set(e.topic, r), ea(e.topic)))
                : ev());
            return;
          }
          (t || !e.sent || i.key !== e.sentKey) &&
            (N.delete(e.topic), P.add(e), eu());
        },
        ev = () => {
          h ||
            ee().length ||
            (h = setTimeout(() => {
              ((h = void 0), ee().length || (eb(), eT("idle")));
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
            !(!t || I.has(e)) &&
              C.has(e) &&
              ([...I.values()].some((e) => {
                let i = C.get(e.topic);
                return (
                  (0, a.isListState)(i) && (i.rank.has(t) || i.members.has(t))
                );
              }) ||
                (C.delete(e), ea(e)));
          }
        },
        ek = () => {
          for (let e of I.values())
            "coin" === (0, n.topicKind)(e.topic) && eg(e);
        },
        ey = (e) => {
          if (
            (e.dropTimer && clearTimeout(e.dropTimer),
            e.retryTimer && clearTimeout(e.retryTimer),
            I.get(e.topic) !== e)
          )
            return;
          (I.delete(e.topic), P.delete(e));
          let t = C.get(e.topic);
          (C.delete(e.topic),
            (0, a.isListState)(t) && (eS(p(t)), ek()),
            ea(e.topic),
            (() => {
              for (let e of I.values()) {
                if (ef() >= 64) return;
                e.capped && e.holders.size && ((e.capped = !1), eg(e, !0));
              }
            })(),
            ev());
        },
        ew = () => {
          (y && clearInterval(y),
            (y = void 0),
            k && clearTimeout(k),
            (k = void 0));
        };
      function eT(e) {
        let t = g;
        if (((g = void 0), ew(), t)) {
          ((t.onopen = null),
            (t.onmessage = null),
            (t.onclose = null),
            (t.onerror = null));
          try {
            t.close(1e3);
          } catch (e) {
            A("debug", "uapi-stream close threw", { err: String(e) });
          }
          O("close", 1e3, { code: "1000" });
        }
        for (let e of (R.clear(), I.values())) e.sent = !1;
        "idle" === e
          ? Y("idle")
          : "paused" === e
            ? Y("paused")
            : "redial" === e && eE();
      }
      let e_ = (e) => {
        (eb(),
          Y("down"),
          (b = setTimeout(() => {
            ((b = void 0), eE());
          }, e)));
      };
      function eE() {
        let c;
        if (g || J || j || !ee().length) return;
        eb();
        let u = Z(),
          m = e.url + (u ? `?token=${encodeURIComponent(u)}` : "");
        for (let e of ((W = 0), I.values())) e.sent = !1;
        (Y("connecting"), O("connect"), (q = w()));
        try {
          c = M(m, [r.STREAM_PROTOCOL]);
        } catch (e) {
          (A("error", "uapi-stream socket ctor threw", { err: String(e) }),
            e_((0, i.backoffDelay)(H++, T)));
          return;
        }
        ((c.binaryType = "arraybuffer"),
          (g = c),
          (c.onopen = () => {
            if (g !== c) return;
            (Y("open"),
              O("open", w() - q),
              (W = x = w()),
              (y = setInterval(eM, 5e3)),
              (k = setTimeout(() => {
                H = 0;
              }, 1e4)));
            let e = ee().filter((e) => e.lastBlock || e.lastVersion);
            for (let t of (e.length &&
              O("resume", e.length, { topics: String(e.length) }),
            ee()))
              t.capped || P.add(t);
            ep();
          }),
          (c.onmessage = (e) => {
            g === c &&
              (function (e) {
                let d, c;
                if (((x = w()), "string" == typeof e)) {
                  (A("warn", "uapi-stream ignored a text message"),
                    O("client_bug", 1, { reason: "text_message" }));
                  return;
                }
                try {
                  d = (0, r.decodeFrame)(e);
                } catch (e) {
                  (A("error", "uapi-stream frame decode failed", {
                    err: String(e),
                  }),
                    O("client_bug", 1, { reason: "decode" }));
                  return;
                }
                let u = d.payload;
                if ("heartbeat" === u.case) {
                  var m,
                    g,
                    v = d;
                  if ("heartbeat" !== v.payload.case) return;
                  let e = v.payload.value;
                  O("heartbeat", e.lagMs, {
                    chain: e.chainId,
                    degraded: String(e.degraded),
                  });
                  let t = C.get(""),
                    i = {
                      topic: "",
                      degradedLanes: e.degraded ? e.degradedLanes : [],
                      lagMsByChain: {
                        ...t?.lagMsByChain,
                        [e.chainId]: e.lagMs,
                      },
                    };
                  (C.set("", i),
                    (t &&
                      t.degradedLanes.join() === i.degradedLanes.join() &&
                      t.lagMsByChain[e.chainId] === e.lagMs) ||
                      ea(""));
                  return;
                }
                if (
                  ((m = d.topic),
                  (c = R.get(m)?.filter((e) => e > w())),
                  c?.length ? (R.set(m, c), !0) : (R.delete(m), !1))
                ) {
                  let e;
                  if ("end" !== u.case) return;
                  ((g = d.topic),
                    (e = R.get(g)),
                    e?.shift(),
                    e?.length || R.delete(g));
                  let t = I.get(d.topic);
                  t?.unsubscribing && ey(t);
                  return;
                }
                let h = I.get(d.topic);
                if (h) {
                  if ("gap" === u.case) {
                    (O("gap"),
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
                            s = n?.[1]
                              ? ((i = n[1].replace(/^PART_/, "")),
                                "number" == typeof (r = t.Part[i]) ? r : void 0)
                              : void 0;
                          if (void 0 !== s) {
                            (D.add(s),
                              eA(
                                e,
                                [...e.holders.values()].filter((e) =>
                                  e.parts.includes(s),
                                ),
                                [s],
                                "not-served",
                              ),
                              (e.sent = !1),
                              eg(e, !0));
                            return;
                          }
                        }
                        if (((e.sent = !1), r === t.EndReason.UNAVAILABLE)) {
                          if (e.unavailableEnds++ >= 1)
                            for (let t of [...e.holders.values()])
                              eA(e, [t], es(t), "unavailable");
                          (e.retryTimer && clearTimeout(e.retryTimer),
                            (e.retryTimer = setTimeout(
                              () => {
                                ((e.retryTimer = void 0),
                                  I.get(e.topic) === e && eg(e, !0));
                              },
                              (0, i.backoffDelay)(e.retries++, T),
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
                          O("frames", 1, {
                            topic_kind: (0, n.topicKind)(i.topic) ?? "unknown",
                          }),
                          d)
                        )
                          ((e.awaitingSnapshot = !1),
                            (e.expectedSeq = i.seq + l),
                            (e.retries = 0));
                        else if (e.awaitingSnapshot) {
                          let t;
                          i.seq !== s &&
                            ((("coin" === (t = i.payload).case ||
                              "list" === t.case ||
                              "wallet" === t.case) &&
                              t.value.replayed) ||
                              i.seq === e.expectedSeq) &&
                            ((e.awaitingSnapshot = !1),
                            (e.expectedSeq = i.seq + l),
                            (e.retries = 0));
                        } else
                          i.seq !== s &&
                            (i.seq !== e.expectedSeq
                              ? (O("seq_skip", 1, {
                                  topic_kind:
                                    (0, n.topicKind)(i.topic) ?? "unknown",
                                }),
                                (c = !0),
                                ei(e, {
                                  kind: "gap",
                                  lastDelivered: e.lastBlock,
                                }),
                                eg(e, !0))
                              : (e.expectedSeq = i.seq + l));
                        let u = w(),
                          m = C.get(e.topic),
                          g = !1;
                        if ("coin" === o.case) {
                          let t = o.value;
                          ((g = t.replayed),
                            C.set(
                              e.topic,
                              (0, a.foldCoin)(
                                (0, a.isCoinState)(m) ? m : void 0,
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
                          g = i.replayed;
                          let r = (0, a.isListState)(m) ? m : void 0,
                            n = (0, a.foldList)(r, i, e.topic, u, $);
                          (C.set(e.topic, n),
                            "member" === i.body.case
                              ? ((e, i, r) => {
                                  if (!i.id) return;
                                  let n = (0, a.memberTopic)(i.id),
                                    s = e.members.get((0, a.refKey)(i.id)),
                                    l = I.get(n);
                                  if (s && (i.market || l || C.has(n))) {
                                    if (l) {
                                      if ((eg(l), !ed(l, el(l)))) return;
                                      ei(l, {
                                        kind: "frame",
                                        frame: new t.Frame({
                                          topic: n,
                                          payload: { case: "coin", value: i },
                                        }),
                                        snapshot: !1,
                                        replayed: r,
                                      });
                                    }
                                    (C.set(n, s), ea(n));
                                  }
                                })(n, i.body.value, i.replayed)
                              : (r && eS(p(r)), ek()),
                            c || (e.lastBlock = f(e.lastBlock, i.asOf)),
                            i.version > s && (e.lastVersion = i.version));
                        } else if ("wallet" === o.case) {
                          let t = o.value;
                          ((g = t.replayed),
                            C.set(e.topic, { topic: e.topic, wallet: t }),
                            c || (e.lastBlock = f(e.lastBlock, t.asOf)));
                        }
                        (ea(e.topic),
                          ei(e, {
                            kind: "frame",
                            frame: i,
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
                for (let e of ((g = void 0), ew(), R.clear(), I.values()))
                  e.sent = !1;
                if ((O("close", e, { code: String(e) }), !J)) {
                  if ((1001 === e && D.clear(), !ee().length)) return Y("idle");
                  if (j) return Y("paused");
                  if (1008 === e) {
                    if (
                      (O("client_bug", 1, { reason: t || "policy" }),
                      d.test(t) && !V)
                    ) {
                      ((V = !0), (z = !1), e_(0));
                      return;
                    }
                    (A("error", "uapi-stream closed by policy", { reason: t }),
                      Y("down"));
                    return;
                  }
                  if (
                    ((1003 === e || 1007 === e) &&
                      (A("error", "uapi-stream rejected a message", {
                        code: e,
                        reason: t,
                      }),
                      O("client_bug", 1, { reason: `close_${e}` })),
                    1013 === e)
                  ) {
                    (e_(
                      W > 0 && w() - W >= 1e4
                        ? (0, i.drainDelay)(T)
                        : Math.min(i.BACKOFF_MAX_MS, (0, i.backoffDelay)(H, T)),
                    ),
                      H++);
                    return;
                  }
                  e_((0, i.backoffDelay)(H++, T));
                }
              })(e.code, e.reason);
          }),
          (c.onerror = () => {
            g === c && A("warn", "uapi-stream socket error");
          }));
      }
      function eM() {
        g &&
          ee().length &&
          (w() - x < 15e3 ||
            (O("stale_close"),
            A("warn", "uapi-stream stale socket, redialing"),
            eT("redial")));
      }
      let eA = (e, t, i, r) => {
          for (let a of t) er(e, a, { kind: "unavailable", parts: i, why: r });
        },
        eO = () => {
          if (J) return;
          (S && clearTimeout(S), (S = void 0));
          let e = j;
          ((j = !1),
            !g &&
              (e || "down" === U || "paused" === U) &&
              ((H = 0), eb(), eE()));
        },
        eI = (e) => {
          if (!J) {
            if (e) {
              (S && clearTimeout(S),
                (S = void 0),
                (j = !0),
                eb(),
                eT("paused"));
              return;
            }
            S ||
              (S = setTimeout(() => {
                ((S = void 0), (j = !0), eb(), eT("paused"));
              }, 15e3));
          }
        },
        eC = E.subscribe((e) => (e ? eO() : eI(!1)));
      return {
        subscribe(e, i, r) {
          if (J) return () => {};
          let a = (0, n.topicKind)(e),
            s = ++G,
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
            d = I.get(e);
          (d?.unsubscribing &&
            (d.dropTimer && clearTimeout(d.dropTimer),
            d.retryTimer && clearTimeout(d.retryTimer),
            I.delete(e),
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
                expectedSeq: l,
                awaitingSnapshot: !0,
                queue: [],
                sent: !1,
                capped: ef() >= 64,
                unsubscribing: !1,
                retries: 0,
                unavailableEnds: 0,
              }),
              I.set(e, d),
              d.capped && O("topics_capped", 1)));
          let c = d;
          if ((c.holders.set(s, o), eh(), c.capped))
            eA(c, [o], o.parts, "topic-cap");
          else {
            o.parts.includes(t.Part.POSITION) &&
              !Z() &&
              eA(c, [o], [t.Part.POSITION], "no-viewer");
            let e = o.parts.filter((e) => D.has(e));
            (e.length && eA(c, [o], e, "not-served"), eg(c));
          }
          return (
            g || b || eE(),
            () => {
              if (c.holders.delete(s) && I.get(e) === c)
                if (0 === c.holders.size)
                  !c.capped && c.sent && g && 1 === g.readyState
                    ? ((c.unsubscribing = !0),
                      P.delete(c),
                      N.add(c.topic),
                      eu(),
                      (c.dropTimer = setTimeout(() => ey(c), 5e3)))
                    : ey(c);
                else eg(c);
            }
          );
        },
        getState: (e) => C.get(e),
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
        status: () => U,
        lastFrameAt: () => x,
        onStatus: (e) => (
          B.add(e),
          () => {
            B.delete(e);
          }
        ),
        setToken(e) {
          let t = Z();
          ((X = e), (z = !0), (V = !1), t !== e && g && eT("redial"));
        },
        pause() {
          eI(!0);
        },
        resume() {
          eO();
        },
        close() {
          for (let e of ((J = !0),
          eC(),
          eh(),
          eb(),
          S && clearTimeout(S),
          v?.(),
          (v = void 0),
          eT("idle"),
          I.values()))
            (e.dropTimer && clearTimeout(e.dropTimer),
              e.retryTimer && clearTimeout(e.retryTimer));
          (I.clear(), C.clear(), D.clear());
        },
        heldTopics: () => [...I.keys()],
      };
    },
  ]);
};
