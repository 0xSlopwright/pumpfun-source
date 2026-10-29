// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(824425),
    n = e.i(575281),
    r = e.i(959719),
    a = e.i(655397);
  let s = async (e, t, n) => {
      if (!e || n?.aborted) return;
      let r = t.map((e) => e.pubkey),
        a = await e.getMultipleAccountsInfo(r);
      if (n?.aborted) return;
      for (let e = 0; e < t.length; e++) {
        let n = a[e];
        if (n)
          try {
            t[e].callback(n);
          } catch (n) {
            console.error(
              "[getAccountsAndSubscribeToChanges] initial callback failed",
              t[e].pubkey.toBase58(),
              n,
            );
          }
        else t[e].onNull?.();
      }
      let s = t.map(() => -1),
        i = [];
      if (
        (t.forEach(({ pubkey: t, callback: r }, a) => {
          let o = e.onAccountChange(t, (e, i) => {
            if (n?.aborted) return;
            let o = i?.slot;
            if (void 0 !== o) {
              if (o < s[a]) return;
              s[a] = o;
            }
            try {
              r(e);
            } catch (e) {
              console.error(
                "[getAccountsAndSubscribeToChanges] account change callback failed",
                t.toBase58(),
                e,
              );
            }
          });
          i.push(o);
        }),
        n)
      ) {
        let t = () => {
          for (let t of i) e.removeAccountChangeListener(t);
        };
        n.aborted ? t() : n.addEventListener("abort", t, { once: !0 });
      }
      return async () => {
        if (n?.aborted) return;
        let { context: a, value: i } =
          await e.getMultipleAccountsInfoAndContext(r);
        n?.aborted ||
          t.forEach((e, t) => {
            if (a.slot <= s[t]) return;
            s[t] = a.slot;
            let n = i[t];
            try {
              n ? e.callback(n) : e.onNull?.();
            } catch (t) {
              console.error(
                "[getAccountsAndSubscribeToChanges] refresh callback failed",
                e.pubkey.toBase58(),
                t,
              );
            }
          });
      };
    },
    i =
      /failed to fetch|networkerror|load failed|fetch failed|network request failed/i,
    o = (e, t) => {
      let n = BigInt(0);
      for (let r = 7; r >= 0; r--) n = n * BigInt(256) + BigInt(e[t + r]);
      return n;
    };
  e.s([
    "f",
    0,
    9,
    "K",
    0,
    6,
    "s",
    0,
    function (e, t, n = !0) {
      let r = (t * e) / BigInt(1e4);
      return n ? e + r : e - r;
    },
    "F",
    0,
    function (e, t) {
      let n = e.toString();
      if (n.length <= t) {
        let e = n.padStart(t, "0");
        return `0.${e}`;
      }
      let r = n.length - t;
      return `${n.slice(0, r)}.${n.slice(r)}`;
    },
    "W",
    0,
    ({ connection: e, pubkey: t, deliver: n }) => {
      let r = -1;
      return {
        onChange: (e, t) => {
          let a = t?.slot;
          if (void 0 !== a) {
            if (a < r) return;
            r = a;
          }
          n(e);
        },
        refresh: async () => {
          let { context: a, value: s } = await e.getAccountInfoAndContext(t);
          a.slot <= r || ((r = a.slot), n(s));
        },
      };
    },
    "q",
    0,
    ({ quoteMintKey: e, poolKey: t, quoteTokenProgramKey: r }) =>
      r ? (0, n.h)(e, t, !0, r) : void 0,
    "c",
    0,
    () => `lease_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    "L",
    0,
    s,
    "d",
    0,
    (e) => e?.data[270] === 1,
    "R",
    0,
    function (e) {
      return e instanceof Error && i.test(e.message);
    },
    "t",
    0,
    (e) => e?.data[940] === 1,
    "r",
    0,
    function (e) {
      try {
        return n.x.decode(new Uint8Array(e));
      } catch (e) {
        return (console.warn("Failed to parse mint account", e), null);
      }
    },
    "G",
    0,
    function (e) {
      try {
        return t.d.decode(new Uint8Array(e));
      } catch (e) {
        return (console.warn("Failed to parse token account", e), null);
      }
    },
    "u",
    0,
    function (e) {
      return Math.floor(100 * e);
    },
    "Y",
    0,
    (e) => {
      let t,
        n = e?.data;
      if (!n || n.byteLength < 261) return null;
      let r = new DataView(n.buffer, n.byteOffset, n.byteLength),
        a = r.getBigUint64(245, !0);
      return (
        (r.getBigInt64(253, !0) << BigInt(64)) +
        a +
        ((t = e?.data) && !(t.length < 287) ? o(t, 271) + o(t, 279) : BigInt(0))
      );
    },
    "$",
    0,
    (e) => {
      let t = e?.data;
      return !t || t.length < 269 ? 0 : Number(o(t, 261));
    },
    "o",
    0,
    (e) => {
      ((e.active = !1),
        (e.rpcSubId = null),
        (e.pendingUnsubAt = null),
        (e.activeGeneration = null),
        (e.lastUnsubscribedAt = Date.now()));
    },
    "b",
    0,
    (e, t) => t ?? ((0, a.Z)(e) ? void 0 : r.z),
    "I",
    0,
    function (e) {
      let n = e?.data;
      if (!n || n.byteLength < t.d.span) return null;
      try {
        return t.d.decode(new Uint8Array(n.buffer, n.byteOffset, n.byteLength));
      } catch {
        return null;
      }
    },
    "i",
    0,
    function (e, t) {
      try {
        return e(t);
      } catch (e) {
        return (console.error("parse account info failed", e), null);
      }
    },
    "v",
    0,
    function (e, t) {
      if (!Number.isFinite(e) || e < 0) return null;
      let [n, r = ""] = e.toFixed(t).split(".");
      if (!/^\d+$/.test(n) || !/^\d*$/.test(r)) return null;
      let a = r.padEnd(t, "0").slice(0, t);
      try {
        return BigInt(`${n}${a}`);
      } catch {
        return null;
      }
    },
  ]);
};
