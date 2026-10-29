// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(824425),
    r = e.i(575281),
    n = e.i(959719),
    a = e.i(655397);
  let l = async (e, t, r) => {
      if (!e || r?.aborted) return;
      let n = t.map((e) => e.pubkey),
        a = await e.getMultipleAccountsInfo(n);
      if (r?.aborted) return;
      for (let e = 0; e < t.length; e++) {
        let r = a[e];
        if (r)
          try {
            t[e].callback(r);
          } catch (r) {
            console.error(
              "[getAccountsAndSubscribeToChanges] initial callback failed",
              t[e].pubkey.toBase58(),
              r,
            );
          }
        else t[e].onNull?.();
      }
      let l = t.map(() => -1),
        i = [];
      if (
        (t.forEach(({ pubkey: t, callback: n }, a) => {
          let s = e.onAccountChange(t, (e, i) => {
            if (r?.aborted) return;
            let s = i?.slot;
            if (void 0 !== s) {
              if (s < l[a]) return;
              l[a] = s;
            }
            try {
              n(e);
            } catch (e) {
              console.error(
                "[getAccountsAndSubscribeToChanges] account change callback failed",
                t.toBase58(),
                e,
              );
            }
          });
          i.push(s);
        }),
        r)
      ) {
        let t = () => {
          for (let t of i) e.removeAccountChangeListener(t);
        };
        r.aborted ? t() : r.addEventListener("abort", t, { once: !0 });
      }
      return async () => {
        if (r?.aborted) return;
        let { context: a, value: i } =
          await e.getMultipleAccountsInfoAndContext(n);
        r?.aborted ||
          t.forEach((e, t) => {
            if (a.slot <= l[t]) return;
            l[t] = a.slot;
            let r = i[t];
            try {
              r ? e.callback(r) : e.onNull?.();
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
    s = (e, t) => {
      let r = BigInt(0);
      for (let n = 7; n >= 0; n--) r = r * BigInt(256) + BigInt(e[t + n]);
      return r;
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
    function (e, t, r = !0) {
      let n = (t * e) / BigInt(1e4);
      return r ? e + n : e - n;
    },
    "F",
    0,
    function (e, t) {
      let r = e.toString();
      if (r.length <= t) {
        let e = r.padStart(t, "0");
        return `0.${e}`;
      }
      let n = r.length - t;
      return `${r.slice(0, n)}.${r.slice(n)}`;
    },
    "W",
    0,
    ({ connection: e, pubkey: t, deliver: r }) => {
      let n = -1;
      return {
        onChange: (e, t) => {
          let a = t?.slot;
          if (void 0 !== a) {
            if (a < n) return;
            n = a;
          }
          r(e);
        },
        refresh: async () => {
          let { context: a, value: l } = await e.getAccountInfoAndContext(t);
          a.slot <= n || ((n = a.slot), r(l));
        },
      };
    },
    "q",
    0,
    ({ quoteMintKey: e, poolKey: t, quoteTokenProgramKey: n }) =>
      n ? (0, r.h)(e, t, !0, n) : void 0,
    "c",
    0,
    () => `lease_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    "L",
    0,
    l,
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
        return r.x.decode(new Uint8Array(e));
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
        r = e?.data;
      if (!r || r.byteLength < 261) return null;
      let n = new DataView(r.buffer, r.byteOffset, r.byteLength),
        a = n.getBigUint64(245, !0);
      return (
        (n.getBigInt64(253, !0) << BigInt(64)) +
        a +
        ((t = e?.data) && !(t.length < 287) ? s(t, 271) + s(t, 279) : BigInt(0))
      );
    },
    "$",
    0,
    (e) => {
      let t = e?.data;
      return !t || t.length < 269 ? 0 : Number(s(t, 261));
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
    (e, t) => t ?? ((0, a.Z)(e) ? void 0 : n.z),
    "I",
    0,
    function (e) {
      let r = e?.data;
      if (!r || r.byteLength < t.d.span) return null;
      try {
        return t.d.decode(new Uint8Array(r.buffer, r.byteOffset, r.byteLength));
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
      let [r, n = ""] = e.toFixed(t).split(".");
      if (!/^\d+$/.test(r) || !/^\d*$/.test(n)) return null;
      let a = n.padEnd(t, "0").slice(0, t);
      try {
        return BigInt(`${r}${a}`);
      } catch {
        return null;
      }
    },
  ]);
};
