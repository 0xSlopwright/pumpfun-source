// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t, r, n;
  var i,
    o = e.i(679877),
    s = e.i(550483);
  class a {}
  e.s(["f", 0, a], 862570);
  class c extends a {
    constructor(e) {
      super();
    }
  }
  let l = s.FIVE_SECONDS,
    u = { pulse: "heartbeat_pulse" };
  e.s(
    [
      "W",
      0,
      u,
      "k",
      0,
      class e extends c {
        constructor(e) {
          (super(e),
            (this.events = new o.EventEmitter()),
            (this.interval = l),
            (this.interval = e?.interval || l));
        }
        static async init(t) {
          let r = new e(t);
          return (await r.init(), r);
        }
        async init() {
          await this.initialize();
        }
        stop() {
          clearInterval(this.intervalRef);
        }
        on(e, t) {
          this.events.on(e, t);
        }
        once(e, t) {
          this.events.once(e, t);
        }
        off(e, t) {
          this.events.off(e, t);
        }
        removeListener(e, t) {
          this.events.removeListener(e, t);
        }
        async initialize() {
          this.intervalRef = setInterval(
            () => this.pulse(),
            (0, s.toMiliseconds)(this.interval),
          );
        }
        pulse() {
          this.events.emit(u.pulse);
        }
      },
    ],
    710600,
  );
  var f = e.i(632220),
    h = e.i(753887);
  function d(e, ...t) {
    try {
      var r;
      return (r = e(...t)) && "function" == typeof r.then
        ? r
        : Promise.resolve(r);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  function p(e) {
    let t, r;
    if (((t = typeof e), null === e || ("object" !== t && "function" !== t)))
      return String(e);
    if (
      !(r = Object.getPrototypeOf(e)) ||
      r.isPrototypeOf(Object) ||
      Array.isArray(e)
    )
      return JSON.stringify(e);
    if ("function" == typeof e.toJSON) return p(e.toJSON());
    throw Error("[unstorage] Cannot stringify value!");
  }
  let b = "base64:";
  function y(e) {
    return (
      (e &&
        e
          .split("?")[0]
          ?.replace(/[/\\]/g, ":")
          .replace(/:+/g, ":")
          .replace(/^:|:$/g, "")) ||
      ""
    );
  }
  function g(e) {
    return (e = y(e)) ? e + ":" : "";
  }
  function m(e, t, r) {
    return e.watch ? e.watch((e, n) => t(e, r + n)) : () => {};
  }
  async function w(e) {
    "function" == typeof e.dispose && (await d(e.dispose));
  }
  function v(e) {
    return new Promise((t, r) => {
      ((e.oncomplete = e.onsuccess = () => t(e.result)),
        (e.onabort = e.onerror = () => r(e.error)));
    });
  }
  function x(e, t) {
    let r;
    return (n, i) =>
      (() => {
        if (r) return r;
        let n = indexedDB.open(e);
        return (
          (n.onupgradeneeded = () => n.result.createObjectStore(t)),
          (r = v(n)).then(
            (e) => {
              e.onclose = () => (r = void 0);
            },
            () => {},
          ),
          r
        );
      })().then((e) => i(e.transaction(t, n).objectStore(t)));
  }
  function E() {
    return (t || (t = x("keyval-store", "keyval")), t);
  }
  function _(e, t = E()) {
    return t("readonly", (t) => v(t.get(e)));
  }
  function O(e) {
    if ("string" != typeof e)
      throw Error(`Cannot safe json parse value of type ${typeof e}`);
    try {
      return JSON.parse(
        e.replace(
          /([\[:])?(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))([,\}\]])/g,
          '$1"$2n"$3',
        ),
        (e, t) =>
          "string" == typeof t && t.match(/^\d+n$/)
            ? BigInt(t.substring(0, t.length - 1))
            : t,
      );
    } catch (t) {
      return e;
    }
  }
  function S(e) {
    return "string" == typeof e
      ? e
      : JSON.stringify(e, (e, t) =>
          "bigint" == typeof t ? t.toString() + "n" : t,
        ) || "";
  }
  e.s(["U", 0, O, "I", 0, S], 243274);
  class A {
    constructor() {
      this.indexedDb = (function (e = {}) {
        let t,
          r = {
            mounts: {
              "":
                e.driver ||
                ((t = new Map()),
                {
                  name: "memory",
                  getInstance: () => t,
                  hasItem: (e) => t.has(e),
                  getItem: (e) => t.get(e) ?? null,
                  getItemRaw: (e) => t.get(e) ?? null,
                  setItem(e, r) {
                    t.set(e, r);
                  },
                  setItemRaw(e, r) {
                    t.set(e, r);
                  },
                  removeItem(e) {
                    t.delete(e);
                  },
                  getKeys: () => [...t.keys()],
                  clear() {
                    t.clear();
                  },
                  dispose() {
                    t.clear();
                  },
                }),
            },
            mountpoints: [""],
            watching: !1,
            watchListeners: [],
            unwatch: {},
          },
          n = (e) => {
            for (let t of r.mountpoints)
              if (e.startsWith(t))
                return {
                  base: t,
                  relativeKey: e.slice(t.length),
                  driver: r.mounts[t],
                };
            return { base: "", relativeKey: e, driver: r.mounts[""] };
          },
          i = (e, t) =>
            r.mountpoints
              .filter((r) => r.startsWith(e) || (t && e.startsWith(r)))
              .map((t) => ({
                relativeBase: e.length > t.length ? e.slice(t.length) : void 0,
                mountpoint: t,
                driver: r.mounts[t],
              })),
          o = (e, t) => {
            if (r.watching)
              for (let n of ((t = y(t)), r.watchListeners)) n(e, t);
          },
          s = async () => {
            if (!r.watching)
              for (let e in ((r.watching = !0), r.mounts))
                r.unwatch[e] = await m(r.mounts[e], o, e);
          },
          a = async () => {
            if (r.watching) {
              for (let e in r.unwatch) await r.unwatch[e]();
              ((r.unwatch = {}), (r.watching = !1));
            }
          },
          c = (e, t, r) => {
            let i = new Map(),
              o = (e) => {
                let t = i.get(e.base);
                return (
                  t ||
                    ((t = { driver: e.driver, base: e.base, items: [] }),
                    i.set(e.base, t)),
                  t
                );
              };
            for (let r of e) {
              let e = "string" == typeof r,
                i = y(e ? r : r.key),
                s = e ? void 0 : r.value,
                a = e || !r.options ? t : { ...t, ...r.options },
                c = n(i);
              o(c).items.push({
                key: i,
                value: s,
                relativeKey: c.relativeKey,
                options: a,
              });
            }
            return Promise.all([...i.values()].map((e) => r(e))).then((e) =>
              e.flat(),
            );
          },
          l = {
            hasItem(e, t = {}) {
              let { relativeKey: r, driver: i } = n((e = y(e)));
              return d(i.hasItem, r, t);
            },
            getItem(e, t = {}) {
              let { relativeKey: r, driver: i } = n((e = y(e)));
              return d(i.getItem, r, t).then((e) => (0, f.f)(e));
            },
            getItems: (e, t = {}) =>
              c(e, t, (e) =>
                e.driver.getItems
                  ? d(
                      e.driver.getItems,
                      e.items.map((e) => ({
                        key: e.relativeKey,
                        options: e.options,
                      })),
                      t,
                    ).then((t) =>
                      t.map((t) => ({
                        key: (function (...e) {
                          return y(e.join(":"));
                        })(e.base, t.key),
                        value: (0, f.f)(t.value),
                      })),
                    )
                  : Promise.all(
                      e.items.map((t) =>
                        d(e.driver.getItem, t.relativeKey, t.options).then(
                          (e) => ({ key: t.key, value: (0, f.f)(e) }),
                        ),
                      ),
                    ),
              ),
            getItemRaw(e, t = {}) {
              let { relativeKey: r, driver: i } = n((e = y(e)));
              return i.getItemRaw
                ? d(i.getItemRaw, r, t)
                : d(i.getItem, r, t).then((e) => {
                    var t;
                    return "string" == typeof e && e.startsWith(b)
                      ? ((t = e.slice(b.length)),
                        globalThis.Buffer
                          ? h.Buffer.from(t, "base64")
                          : Uint8Array.from(globalThis.atob(t), (e) =>
                              e.codePointAt(0),
                            ))
                      : e;
                  });
            },
            async setItem(e, t, r = {}) {
              if (void 0 === t) return l.removeItem(e);
              let { relativeKey: i, driver: s } = n((e = y(e)));
              s.setItem &&
                (await d(s.setItem, i, p(t), r), s.watch || o("update", e));
            },
            async setItems(e, t) {
              await c(e, t, async (e) => {
                if (e.driver.setItems)
                  return d(
                    e.driver.setItems,
                    e.items.map((e) => ({
                      key: e.relativeKey,
                      value: p(e.value),
                      options: e.options,
                    })),
                    t,
                  );
                e.driver.setItem &&
                  (await Promise.all(
                    e.items.map((t) =>
                      d(e.driver.setItem, t.relativeKey, p(t.value), t.options),
                    ),
                  ));
              });
            },
            async setItemRaw(e, t, r = {}) {
              if (void 0 === t) return l.removeItem(e, r);
              let { relativeKey: i, driver: s } = n((e = y(e)));
              if (s.setItemRaw) await d(s.setItemRaw, i, t, r);
              else {
                var a;
                if (!s.setItem) return;
                await d(
                  s.setItem,
                  i,
                  "string" == typeof t
                    ? t
                    : b +
                        ((a = t),
                        globalThis.Buffer
                          ? h.Buffer.from(a).toString("base64")
                          : globalThis.btoa(String.fromCodePoint(...a))),
                  r,
                );
              }
              s.watch || o("update", e);
            },
            async removeItem(e, t = {}) {
              "boolean" == typeof t && (t = { removeMeta: t });
              let { relativeKey: r, driver: i } = n((e = y(e)));
              i.removeItem &&
                (await d(i.removeItem, r, t),
                (t.removeMeta || t.removeMata) &&
                  (await d(i.removeItem, r + "$", t)),
                i.watch || o("remove", e));
            },
            async getMeta(e, t = {}) {
              "boolean" == typeof t && (t = { nativeOnly: t });
              let { relativeKey: r, driver: i } = n((e = y(e))),
                o = Object.create(null);
              if (
                (i.getMeta && Object.assign(o, await d(i.getMeta, r, t)),
                !t.nativeOnly)
              ) {
                let e = await d(i.getItem, r + "$", t).then((e) => (0, f.f)(e));
                e &&
                  "object" == typeof e &&
                  ("string" == typeof e.atime && (e.atime = new Date(e.atime)),
                  "string" == typeof e.mtime && (e.mtime = new Date(e.mtime)),
                  Object.assign(o, e));
              }
              return o;
            },
            setMeta(e, t, r = {}) {
              return this.setItem(e + "$", t, r);
            },
            removeMeta(e, t = {}) {
              return this.removeItem(e + "$", t);
            },
            async getKeys(e, t = {}) {
              let r = i((e = g(e)), !0),
                n = [],
                o = [],
                s = !0;
              for (let e of r) {
                for (let r of (e.driver.flags?.maxDepth || (s = !1),
                await d(e.driver.getKeys, e.relativeBase, t))) {
                  let t = e.mountpoint + y(r);
                  n.some((e) => t.startsWith(e)) || o.push(t);
                }
                n = [
                  e.mountpoint,
                  ...n.filter((t) => !t.startsWith(e.mountpoint)),
                ];
              }
              let a = void 0 !== t.maxDepth && !s;
              return o.filter((r) => {
                var n;
                return (
                  (!a ||
                    (function (e, t) {
                      if (void 0 === t) return !0;
                      let r = 0,
                        n = e.indexOf(":");
                      for (; n > -1; ) (r++, (n = e.indexOf(":", n + 1)));
                      return r <= t;
                    })(r, t.maxDepth)) &&
                  ((n = e)
                    ? r.startsWith(n) && "$" !== r[r.length - 1]
                    : "$" !== r[r.length - 1])
                );
              });
            },
            async clear(e, t = {}) {
              ((e = g(e)),
                await Promise.all(
                  i(e, !1).map(async (e) =>
                    e.driver.clear
                      ? d(e.driver.clear, e.relativeBase, t)
                      : e.driver.removeItem
                        ? Promise.all(
                            (
                              await e.driver.getKeys(e.relativeBase || "", t)
                            ).map((r) => e.driver.removeItem(r, t)),
                          )
                        : void 0,
                  ),
                ));
            },
            async dispose() {
              await Promise.all(Object.values(r.mounts).map((e) => w(e)));
            },
            watch: async (e) => (
              await s(),
              r.watchListeners.push(e),
              async () => {
                ((r.watchListeners = r.watchListeners.filter((t) => t !== e)),
                  0 === r.watchListeners.length && (await a()));
              }
            ),
            async unwatch() {
              ((r.watchListeners = []), await a());
            },
            mount(e, t) {
              if ((e = g(e)) && r.mounts[e])
                throw Error(`already mounted at ${e}`);
              return (
                e &&
                  (r.mountpoints.push(e),
                  r.mountpoints.sort((e, t) => t.length - e.length)),
                (r.mounts[e] = t),
                r.watching &&
                  Promise.resolve(m(t, o, e))
                    .then((t) => {
                      r.unwatch[e] = t;
                    })
                    .catch(console.error),
                l
              );
            },
            async unmount(e, t = !0) {
              (e = g(e)) &&
                r.mounts[e] &&
                (r.watching &&
                  e in r.unwatch &&
                  (r.unwatch[e]?.(), delete r.unwatch[e]),
                t && (await w(r.mounts[e])),
                (r.mountpoints = r.mountpoints.filter((t) => t !== e)),
                delete r.mounts[e]);
            },
            getMount(e = "") {
              let t = n((e = y(e) + ":"));
              return { driver: t.driver, base: t.base };
            },
            getMounts: (e = "", t = {}) =>
              i((e = y(e)), t.parents).map((e) => ({
                driver: e.driver,
                base: e.mountpoint,
              })),
            keys: (e, t = {}) => l.getKeys(e, t),
            get: (e, t = {}) => l.getItem(e, t),
            set: (e, t, r = {}) => l.setItem(e, t, r),
            has: (e, t = {}) => l.hasItem(e, t),
            del: (e, t = {}) => l.removeItem(e, t),
            remove: (e, t = {}) => l.removeItem(e, t),
          };
        return l;
      })({
        driver: ((e = {}) => {
          let t,
            r = e.base && e.base.length > 0 ? `${e.base}:` : "";
          return (
            e.dbName && e.storeName && (t = x(e.dbName, e.storeName)),
            {
              name: "idb-keyval",
              options: e,
              hasItem: async (e) => !(typeof (await _(r + e, t)) > "u"),
              getItem: async (e) => (await _(r + e, t)) ?? null,
              setItem: (e, n) =>
                (function (e, t, r = E()) {
                  return r("readwrite", (r) => (r.put(t, e), v(r.transaction)));
                })(r + e, n, t),
              removeItem: (e) =>
                (function (e, t = E()) {
                  return t("readwrite", (t) => (t.delete(e), v(t.transaction)));
                })(r + e, t),
              getKeys: () =>
                (function (e = E()) {
                  return e("readonly", (e) => {
                    var t;
                    if (e.getAllKeys) return v(e.getAllKeys());
                    let r = [];
                    return ((t = (e) => r.push(e.key)),
                    (e.openCursor().onsuccess = function () {
                      this.result && (t(this.result), this.result.continue());
                    }),
                    v(e.transaction)).then(() => r);
                  });
                })(t),
              clear: () =>
                (function (e = E()) {
                  return e("readwrite", (e) => (e.clear(), v(e.transaction)));
                })(t),
            }
          );
        })({
          dbName: "WALLET_CONNECT_V2_INDEXED_DB",
          storeName: "keyvaluestorage",
        }),
      });
    }
    async getKeys() {
      return this.indexedDb.getKeys();
    }
    async getEntries() {
      return (
        await this.indexedDb.getItems(await this.indexedDb.getKeys())
      ).map((e) => [e.key, e.value]);
    }
    async getItem(e) {
      let t = await this.indexedDb.getItem(e);
      if (null !== t) return t;
    }
    async setItem(e, t) {
      await this.indexedDb.setItem(e, S(t));
    }
    async removeItem(e) {
      await this.indexedDb.removeItem(e);
    }
  }
  var I =
      "u" > typeof globalThis ? globalThis : "u" > typeof window ? window : e.g,
    B = { exports: {} };
  function T(e) {
    var t;
    return [e[0], O(null != (t = e[1]) ? t : "")];
  }
  function P() {}
  ((P.prototype.getItem = function (e) {
    return this.hasOwnProperty(e) ? String(this[e]) : null;
  }),
    (P.prototype.setItem = function (e, t) {
      this[e] = String(t);
    }),
    (P.prototype.removeItem = function (e) {
      delete this[e];
    }),
    (P.prototype.clear = function () {
      let e = this;
      Object.keys(e).forEach(function (t) {
        ((e[t] = void 0), delete e[t]);
      });
    }),
    (P.prototype.key = function (e) {
      return ((e = e || 0), Object.keys(this)[e]);
    }),
    P.prototype.__defineGetter__("length", function () {
      return Object.keys(this).length;
    }),
    "u" > typeof I && I.localStorage
      ? (B.exports = I.localStorage)
      : "u" > typeof window && window.localStorage
        ? (B.exports = window.localStorage)
        : (B.exports = new P()));
  class N {
    constructor() {
      this.localStorage = B.exports;
    }
    async getKeys() {
      return Object.keys(this.localStorage);
    }
    async getEntries() {
      return Object.entries(this.localStorage).map(T);
    }
    async getItem(e) {
      let t = this.localStorage.getItem(e);
      if (null !== t) return O(t);
    }
    async setItem(e, t) {
      this.localStorage.setItem(e, S(t));
    }
    async removeItem(e) {
      this.localStorage.removeItem(e);
    }
  }
  let U = async (e, t, r) => {
      let n = "wc_storage_version",
        i = await t.getItem(n);
      if (i && i >= 1) return void r(t);
      let o = await e.getKeys();
      if (!o.length) return void r(t);
      let s = [];
      for (; o.length; ) {
        let r = o.shift();
        if (!r) continue;
        let n = r.toLowerCase();
        if (
          n.includes("wc@") ||
          n.includes("walletconnect") ||
          n.includes("wc_") ||
          n.includes("wallet_connect")
        ) {
          let n = await e.getItem(r);
          (await t.setItem(r, n), s.push(r));
        }
      }
      (await t.setItem(n, 1), r(t), C(e, s));
    },
    C = async (e, t) => {
      t.length &&
        t.forEach(async (t) => {
          await e.removeItem(t);
        });
    };
  function R(e, ...t) {
    if (
      !(
        e instanceof Uint8Array ||
        (ArrayBuffer.isView(e) && "Uint8Array" === e.constructor.name)
      )
    )
      throw Error("Uint8Array expected");
    if (t.length > 0 && !t.includes(e.length))
      throw Error(
        "Uint8Array expected of length " + t + ", got length=" + e.length,
      );
  }
  function j(e, t = !0) {
    if (e.destroyed) throw Error("Hash instance has been destroyed");
    if (t && e.finished) throw Error("Hash#digest() has already been called");
  }
  e.s(
    [
      "f",
      0,
      class {
        constructor() {
          ((this.initialized = !1),
            (this.setInitialized = (e) => {
              ((this.storage = e), (this.initialized = !0));
            }));
          let e = new N();
          this.storage = e;
          try {
            let t = new A();
            U(e, t, this.setInitialized);
          } catch {
            this.initialized = !0;
          }
        }
        async getKeys() {
          return (await this.initialize(), this.storage.getKeys());
        }
        async getEntries() {
          return (await this.initialize(), this.storage.getEntries());
        }
        async getItem(e) {
          return (await this.initialize(), this.storage.getItem(e));
        }
        async setItem(e, t) {
          return (await this.initialize(), this.storage.setItem(e, t));
        }
        async removeItem(e) {
          return (await this.initialize(), this.storage.removeItem(e));
        }
        async initialize() {
          this.initialized ||
            (await new Promise((e) => {
              let t = setInterval(() => {
                this.initialized && (clearInterval(t), e());
              }, 20);
            }));
        }
      },
    ],
    441631,
  );
  let D =
      "object" == typeof globalThis && "crypto" in globalThis
        ? globalThis.crypto
        : void 0,
    M = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength);
  function k(e) {
    return (
      "string" == typeof e &&
        (e = (function (e) {
          if ("string" != typeof e)
            throw Error("utf8ToBytes expected string, got " + typeof e);
          return new Uint8Array(new TextEncoder().encode(e));
        })(e)),
      R(e),
      e
    );
  }
  class L {
    clone() {
      return this._cloneInto();
    }
  }
  function W(e = 32) {
    if (D && "function" == typeof D.getRandomValues)
      return D.getRandomValues(new Uint8Array(e));
    if (D && "function" == typeof D.randomBytes) return D.randomBytes(e);
    throw Error("crypto.getRandomValues must be defined");
  }
  class H extends L {
    constructor(e, t, r, n) {
      (super(),
        (this.blockLen = e),
        (this.outputLen = t),
        (this.padOffset = r),
        (this.isLE = n),
        (this.finished = !1),
        (this.length = 0),
        (this.pos = 0),
        (this.destroyed = !1),
        (this.buffer = new Uint8Array(e)),
        (this.view = M(this.buffer)));
    }
    update(e) {
      j(this);
      let { view: t, buffer: r, blockLen: n } = this,
        i = (e = k(e)).length;
      for (let o = 0; o < i; ) {
        let s = Math.min(n - this.pos, i - o);
        if (s === n) {
          let t = M(e);
          for (; n <= i - o; o += n) this.process(t, o);
          continue;
        }
        (r.set(e.subarray(o, o + s), this.pos),
          (this.pos += s),
          (o += s),
          this.pos === n && (this.process(t, 0), (this.pos = 0)));
      }
      return ((this.length += e.length), this.roundClean(), this);
    }
    digestInto(e) {
      (j(this),
        (function (e, t) {
          R(e);
          let r = t.outputLen;
          if (e.length < r)
            throw Error(
              "digestInto() expects output buffer of length at least " + r,
            );
        })(e, this),
        (this.finished = !0));
      let { buffer: t, view: r, blockLen: n, isLE: i } = this,
        { pos: o } = this;
      ((t[o++] = 128),
        this.buffer.subarray(o).fill(0),
        this.padOffset > n - o && (this.process(r, 0), (o = 0)));
      for (let e = o; e < n; e++) t[e] = 0;
      ((function (e, t, r, n) {
        if ("function" == typeof e.setBigUint64) return e.setBigUint64(t, r, n);
        let i = BigInt(32),
          o = BigInt(0xffffffff),
          s = Number((r >> i) & o),
          a = Number(r & o),
          c = 4 * !!n,
          l = 4 * !n;
        (e.setUint32(t + c, s, n), e.setUint32(t + l, a, n));
      })(r, n - 8, BigInt(8 * this.length), i),
        this.process(r, 0));
      let s = M(e),
        a = this.outputLen;
      if (a % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
      let c = a / 4,
        l = this.get();
      if (c > l.length) throw Error("_sha2: outputLen bigger than state");
      for (let e = 0; e < c; e++) s.setUint32(4 * e, l[e], i);
    }
    digest() {
      let { buffer: e, outputLen: t } = this;
      this.digestInto(e);
      let r = e.slice(0, t);
      return (this.destroy(), r);
    }
    _cloneInto(e) {
      (e || (e = new this.constructor()), e.set(...this.get()));
      let {
        blockLen: t,
        buffer: r,
        length: n,
        finished: i,
        destroyed: o,
        pos: s,
      } = this;
      return (
        (e.length = n),
        (e.pos = s),
        (e.finished = i),
        (e.destroyed = o),
        n % t && e.buffer.set(r),
        e
      );
    }
  }
  let z = BigInt(0xffffffff),
    F = BigInt(32),
    K = (e, t, r) => e >>> r,
    q = (e, t, r) => (e << (32 - r)) | (t >>> r),
    V = (e, t, r) => (e >>> r) | (t << (32 - r)),
    $ = (e, t, r) => (e << (32 - r)) | (t >>> r),
    Y = (e, t, r) => (e << (64 - r)) | (t >>> (r - 32)),
    G = (e, t, r) => (e >>> (r - 32)) | (t << (64 - r)),
    Z = function (e, t, r, n) {
      let i = (t >>> 0) + (n >>> 0);
      return { h: (e + r + ((i / 0x100000000) | 0)) | 0, l: 0 | i };
    },
    J = (e, t, r) => (e >>> 0) + (t >>> 0) + (r >>> 0),
    X = (e, t, r, n) => (t + r + n + ((e / 0x100000000) | 0)) | 0,
    Q = (e, t, r, n) => (e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0),
    ee = (e, t, r, n, i) => (t + r + n + i + ((e / 0x100000000) | 0)) | 0,
    et = (e, t, r, n, i, o) =>
      (t + r + n + i + o + ((e / 0x100000000) | 0)) | 0,
    er = (e, t, r, n, i) =>
      (e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0) + (i >>> 0),
    [en, ei] = (function (e, t = !1) {
      let r = new Uint32Array(e.length),
        n = new Uint32Array(e.length);
      for (let i = 0; i < e.length; i++) {
        let { h: o, l: s } = (function (e, t = !1) {
          return t
            ? { h: Number(e & z), l: Number((e >> F) & z) }
            : { h: 0 | Number((e >> F) & z), l: 0 | Number(e & z) };
        })(e[i], t);
        [r[i], n[i]] = [o, s];
      }
      return [r, n];
    })(
      [
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817",
      ].map((e) => BigInt(e)),
    ),
    eo = new Uint32Array(80),
    es = new Uint32Array(80);
  class ea extends H {
    constructor() {
      (super(128, 64, 16, !1),
        (this.Ah = 0x6a09e667),
        (this.Al = -0xc4336f8),
        (this.Bh = -0x4498517b),
        (this.Bl = -0x7b3558c5),
        (this.Ch = 0x3c6ef372),
        (this.Cl = -0x16b07d5),
        (this.Dh = -0x5ab00ac6),
        (this.Dl = 0x5f1d36f1),
        (this.Eh = 0x510e527f),
        (this.El = -0x52197d2f),
        (this.Fh = -0x64fa9774),
        (this.Fl = 0x2b3e6c1f),
        (this.Gh = 0x1f83d9ab),
        (this.Gl = -0x4be4295),
        (this.Hh = 0x5be0cd19),
        (this.Hl = 0x137e2179));
    }
    get() {
      let {
        Ah: e,
        Al: t,
        Bh: r,
        Bl: n,
        Ch: i,
        Cl: o,
        Dh: s,
        Dl: a,
        Eh: c,
        El: l,
        Fh: u,
        Fl: f,
        Gh: h,
        Gl: d,
        Hh: p,
        Hl: b,
      } = this;
      return [e, t, r, n, i, o, s, a, c, l, u, f, h, d, p, b];
    }
    set(e, t, r, n, i, o, s, a, c, l, u, f, h, d, p, b) {
      ((this.Ah = 0 | e),
        (this.Al = 0 | t),
        (this.Bh = 0 | r),
        (this.Bl = 0 | n),
        (this.Ch = 0 | i),
        (this.Cl = 0 | o),
        (this.Dh = 0 | s),
        (this.Dl = 0 | a),
        (this.Eh = 0 | c),
        (this.El = 0 | l),
        (this.Fh = 0 | u),
        (this.Fl = 0 | f),
        (this.Gh = 0 | h),
        (this.Gl = 0 | d),
        (this.Hh = 0 | p),
        (this.Hl = 0 | b));
    }
    process(e, t) {
      for (let r = 0; r < 16; r++, t += 4)
        ((eo[r] = e.getUint32(t)), (es[r] = e.getUint32((t += 4))));
      for (let e = 16; e < 80; e++) {
        let t = 0 | eo[e - 15],
          r = 0 | es[e - 15],
          n = V(t, r, 1) ^ V(t, r, 8) ^ K(t, r, 7),
          i = $(t, r, 1) ^ $(t, r, 8) ^ q(t, r, 7),
          o = 0 | eo[e - 2],
          s = 0 | es[e - 2],
          a = V(o, s, 19) ^ Y(o, s, 61) ^ K(o, s, 6),
          c = Q(
            i,
            $(o, s, 19) ^ G(o, s, 61) ^ q(o, s, 6),
            es[e - 7],
            es[e - 16],
          ),
          l = ee(c, n, a, eo[e - 7], eo[e - 16]);
        ((eo[e] = 0 | l), (es[e] = 0 | c));
      }
      let {
        Ah: r,
        Al: n,
        Bh: i,
        Bl: o,
        Ch: s,
        Cl: a,
        Dh: c,
        Dl: l,
        Eh: u,
        El: f,
        Fh: h,
        Fl: d,
        Gh: p,
        Gl: b,
        Hh: y,
        Hl: g,
      } = this;
      for (let e = 0; e < 80; e++) {
        let t = V(u, f, 14) ^ V(u, f, 18) ^ Y(u, f, 41),
          m = $(u, f, 14) ^ $(u, f, 18) ^ G(u, f, 41),
          w = (u & h) ^ (~u & p),
          v = er(g, m, (f & d) ^ (~f & b), ei[e], es[e]),
          x = et(v, y, t, w, en[e], eo[e]),
          E = 0 | v,
          _ = V(r, n, 28) ^ Y(r, n, 34) ^ Y(r, n, 39),
          O = $(r, n, 28) ^ G(r, n, 34) ^ G(r, n, 39),
          S = (r & i) ^ (r & s) ^ (i & s),
          A = (n & o) ^ (n & a) ^ (o & a);
        ((y = 0 | p),
          (g = 0 | b),
          (p = 0 | h),
          (b = 0 | d),
          (h = 0 | u),
          (d = 0 | f),
          ({ h: u, l: f } = Z(0 | c, 0 | l, 0 | x, 0 | E)),
          (c = 0 | s),
          (l = 0 | a),
          (s = 0 | i),
          (a = 0 | o),
          (i = 0 | r),
          (o = 0 | n));
        let I = J(E, O, A);
        ((r = X(I, x, _, S)), (n = 0 | I));
      }
      (({ h: r, l: n } = Z(0 | this.Ah, 0 | this.Al, 0 | r, 0 | n)),
        ({ h: i, l: o } = Z(0 | this.Bh, 0 | this.Bl, 0 | i, 0 | o)),
        ({ h: s, l: a } = Z(0 | this.Ch, 0 | this.Cl, 0 | s, 0 | a)),
        ({ h: c, l: l } = Z(0 | this.Dh, 0 | this.Dl, 0 | c, 0 | l)),
        ({ h: u, l: f } = Z(0 | this.Eh, 0 | this.El, 0 | u, 0 | f)),
        ({ h: h, l: d } = Z(0 | this.Fh, 0 | this.Fl, 0 | h, 0 | d)),
        ({ h: p, l: b } = Z(0 | this.Gh, 0 | this.Gl, 0 | p, 0 | b)),
        ({ h: y, l: g } = Z(0 | this.Hh, 0 | this.Hl, 0 | y, 0 | g)),
        this.set(r, n, i, o, s, a, c, l, u, f, h, d, p, b, y, g));
    }
    roundClean() {
      (eo.fill(0), es.fill(0));
    }
    destroy() {
      (this.buffer.fill(0),
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
    }
  }
  let ec =
      ((i = () => new ea()),
      ((r = (e) => i().update(k(e)).digest()).outputLen = (n = i()).outputLen),
      (r.blockLen = n.blockLen),
      (r.create = () => i()),
      r),
    el = BigInt(0),
    eu = BigInt(1),
    ef = BigInt(2);
  function eh(e) {
    return (
      e instanceof Uint8Array ||
      (ArrayBuffer.isView(e) && "Uint8Array" === e.constructor.name)
    );
  }
  function ed(e) {
    if (!eh(e)) throw Error("Uint8Array expected");
  }
  function ep(e, t) {
    if ("boolean" != typeof t) throw Error(e + " boolean expected, got " + t);
  }
  let eb = Array.from({ length: 256 }, (e, t) =>
    t.toString(16).padStart(2, "0"),
  );
  function ey(e) {
    ed(e);
    let t = "";
    for (let r = 0; r < e.length; r++) t += eb[e[r]];
    return t;
  }
  function eg(e) {
    if ("string" != typeof e)
      throw Error("hex string expected, got " + typeof e);
    return "" === e ? el : BigInt("0x" + e);
  }
  function em(e) {
    return e >= 48 && e <= 57
      ? e - 48
      : e >= 65 && e <= 70
        ? e - 55
        : e >= 97 && e <= 102
          ? e - 87
          : void 0;
  }
  function ew(e) {
    if ("string" != typeof e)
      throw Error("hex string expected, got " + typeof e);
    let t = e.length,
      r = t / 2;
    if (t % 2)
      throw Error("hex string expected, got unpadded hex of length " + t);
    let n = new Uint8Array(r);
    for (let t = 0, i = 0; t < r; t++, i += 2) {
      let r = em(e.charCodeAt(i)),
        o = em(e.charCodeAt(i + 1));
      if (void 0 === r || void 0 === o)
        throw Error(
          'hex string expected, got non-hex character "' +
            (e[i] + e[i + 1]) +
            '" at index ' +
            i,
        );
      n[t] = 16 * r + o;
    }
    return n;
  }
  function ev(e) {
    return (ed(e), eg(ey(Uint8Array.from(e).reverse())));
  }
  function ex(e, t) {
    return ew(e.toString(16).padStart(2 * t, "0"));
  }
  function eE(e, t) {
    return ex(e, t).reverse();
  }
  function e_(e, t, r) {
    let n;
    if ("string" == typeof t)
      try {
        n = ew(t);
      } catch (t) {
        throw Error(e + " must be hex string or Uint8Array, cause: " + t);
      }
    else if (eh(t)) n = Uint8Array.from(t);
    else throw Error(e + " must be hex string or Uint8Array");
    let i = n.length;
    if ("number" == typeof r && i !== r)
      throw Error(e + " of length " + r + " expected, got " + i);
    return n;
  }
  function eO(...e) {
    let t = 0;
    for (let r = 0; r < e.length; r++) {
      let n = e[r];
      (ed(n), (t += n.length));
    }
    let r = new Uint8Array(t);
    for (let t = 0, n = 0; t < e.length; t++) {
      let i = e[t];
      (r.set(i, n), (n += i.length));
    }
    return r;
  }
  let eS = (e) => "bigint" == typeof e && el <= e;
  function eA(e, t, r, n) {
    if (!(eS(t) && eS(r) && eS(n)) || !(r <= t) || !(t < n))
      throw Error(
        "expected valid " + e + ": " + r + " <= n < " + n + ", got " + t,
      );
  }
  let eI = {
    bigint: (e) => "bigint" == typeof e,
    function: (e) => "function" == typeof e,
    boolean: (e) => "boolean" == typeof e,
    string: (e) => "string" == typeof e,
    stringOrUint8Array: (e) => "string" == typeof e || eh(e),
    isSafeInteger: (e) => Number.isSafeInteger(e),
    array: (e) => Array.isArray(e),
    field: (e, t) => t.Fp.isValid(e),
    hash: (e) => "function" == typeof e && Number.isSafeInteger(e.outputLen),
  };
  function eB(e, t, r = {}) {
    let n = (t, r, n) => {
      let i = eI[r];
      if ("function" != typeof i) throw Error("invalid validator function");
      let o = e[t];
      if (!(n && void 0 === o) && !i(o, e))
        throw Error(
          "param " + String(t) + " is invalid. Expected " + r + ", got " + o,
        );
    };
    for (let [e, r] of Object.entries(t)) n(e, r, !1);
    for (let [e, t] of Object.entries(r)) n(e, t, !0);
    return e;
  }
  function eT(e) {
    let t = new WeakMap();
    return (r, ...n) => {
      let i = t.get(r);
      if (void 0 !== i) return i;
      let o = e(r, ...n);
      return (t.set(r, o), o);
    };
  }
  let eP = BigInt(0),
    eN = BigInt(1),
    eU = BigInt(2),
    eC = BigInt(3),
    eR = BigInt(4),
    ej = BigInt(5),
    eD = BigInt(8);
  function eM(e, t) {
    let r = e % t;
    return r >= eP ? r : t + r;
  }
  function ek(e, t, r) {
    let n = e;
    for (; t-- > eP; ) ((n *= n), (n %= r));
    return n;
  }
  function eL(e, t) {
    if (e === eP) throw Error("invert: expected non-zero number");
    if (t <= eP) throw Error("invert: expected positive modulus, got " + t);
    let r = eM(e, t),
      n = t,
      i = eP,
      o = eN;
    for (; r !== eP; ) {
      let e = n / r,
        t = n % r,
        s = i - o * e;
      ((n = r), (r = t), (i = o), (o = s));
    }
    if (n !== eN) throw Error("invert: does not exist");
    return eM(i, t);
  }
  let eW = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN",
  ];
  function eH(e, t) {
    let r = void 0 !== t ? t : e.toString(2).length,
      n = Math.ceil(r / 8);
    return { nBitLength: r, nByteLength: n };
  }
  function ez(e, t, r = !1, n = {}) {
    let i;
    if (e <= eP) throw Error("invalid field: expected ORDER > 0, got " + e);
    let { nBitLength: o, nByteLength: s } = eH(e, t);
    if (s > 2048) throw Error("invalid field: expected ORDER of <= 2048 bytes");
    let a = Object.freeze({
      ORDER: e,
      isLE: r,
      BITS: o,
      BYTES: s,
      MASK: (ef << BigInt(o - 1)) - eu,
      ZERO: eP,
      ONE: eN,
      create: (t) => eM(t, e),
      isValid: (t) => {
        if ("bigint" != typeof t)
          throw Error(
            "invalid field element: expected bigint, got " + typeof t,
          );
        return eP <= t && t < e;
      },
      is0: (e) => e === eP,
      isOdd: (e) => (e & eN) === eN,
      neg: (t) => eM(-t, e),
      eql: (e, t) => e === t,
      sqr: (t) => eM(t * t, e),
      add: (t, r) => eM(t + r, e),
      sub: (t, r) => eM(t - r, e),
      mul: (t, r) => eM(t * r, e),
      pow: (e, t) =>
        (function (e, t, r) {
          if (r < eP) throw Error("invalid exponent, negatives unsupported");
          if (r === eP) return e.ONE;
          if (r === eN) return t;
          let n = e.ONE,
            i = t;
          for (; r > eP; )
            (r & eN && (n = e.mul(n, i)), (i = e.sqr(i)), (r >>= eN));
          return n;
        })(a, e, t),
      div: (t, r) => eM(t * eL(r, e), e),
      sqrN: (e) => e * e,
      addN: (e, t) => e + t,
      subN: (e, t) => e - t,
      mulN: (e, t) => e * t,
      inv: (t) => eL(t, e),
      sqrt:
        n.sqrt ||
        ((t) => (
          i ||
            (i = (function (e) {
              if (e % eR === eC) {
                let t = (e + eN) / eR;
                return function (e, r) {
                  let n = e.pow(r, t);
                  if (!e.eql(e.sqr(n), r))
                    throw Error("Cannot find square root");
                  return n;
                };
              }
              if (e % eD === ej) {
                let t = (e - ej) / eD;
                return function (e, r) {
                  let n = e.mul(r, eU),
                    i = e.pow(n, t),
                    o = e.mul(r, i),
                    s = e.mul(e.mul(o, eU), i),
                    a = e.mul(o, e.sub(s, e.ONE));
                  if (!e.eql(e.sqr(a), r))
                    throw Error("Cannot find square root");
                  return a;
                };
              }
              return (function (e) {
                let t,
                  r,
                  n,
                  i = (e - eN) / eU;
                for (t = e - eN, r = 0; t % eU === eP; t /= eU, r++);
                for (
                  n = eU;
                  n < e &&
                  (function (e, t, r) {
                    if (t < eP)
                      throw Error("invalid exponent, negatives unsupported");
                    if (r <= eP) throw Error("invalid modulus");
                    if (r === eN) return eP;
                    let n = eN;
                    for (; t > eP; )
                      (t & eN && (n = (n * e) % r),
                        (e = (e * e) % r),
                        (t >>= eN));
                    return n;
                  })(n, i, e) !==
                    e - eN;
                  n++
                )
                  if (n > 1e3)
                    throw Error("Cannot find square root: likely non-prime P");
                if (1 === r) {
                  let t = (e + eN) / eR;
                  return function (e, r) {
                    let n = e.pow(r, t);
                    if (!e.eql(e.sqr(n), r))
                      throw Error("Cannot find square root");
                    return n;
                  };
                }
                let o = (t + eN) / eU;
                return function (e, s) {
                  if (e.pow(s, i) === e.neg(e.ONE))
                    throw Error("Cannot find square root");
                  let a = r,
                    c = e.pow(e.mul(e.ONE, n), t),
                    l = e.pow(s, o),
                    u = e.pow(s, t);
                  for (; !e.eql(u, e.ONE); ) {
                    if (e.eql(u, e.ZERO)) return e.ZERO;
                    let t = 1;
                    for (let r = e.sqr(u); t < a && !e.eql(r, e.ONE); t++)
                      r = e.sqr(r);
                    let r = e.pow(c, eN << BigInt(a - t - 1));
                    ((c = e.sqr(r)),
                      (l = e.mul(l, r)),
                      (u = e.mul(u, c)),
                      (a = t));
                  }
                  return l;
                };
              })(e);
            })(e)),
          i(a, t)
        )),
      invertBatch: (e) => {
        let t, r, n;
        return (
          (t = Array(e.length)),
          (r = e.reduce(
            (e, r, n) => (a.is0(r) ? e : ((t[n] = e), a.mul(e, r))),
            a.ONE,
          )),
          (n = a.inv(r)),
          e.reduceRight(
            (e, r, n) =>
              a.is0(r) ? e : ((t[n] = a.mul(e, t[n])), a.mul(e, r)),
            n,
          ),
          t
        );
      },
      cmov: (e, t, r) => (r ? t : e),
      toBytes: (e) => (r ? eE(e, s) : ex(e, s)),
      fromBytes: (e) => {
        if (e.length !== s)
          throw Error(
            "Field.fromBytes: expected " + s + " bytes, got " + e.length,
          );
        return r ? ev(e) : eg(ey(e));
      },
    });
    return Object.freeze(a);
  }
  let eF = BigInt(0),
    eK = BigInt(1);
  function eq(e, t) {
    let r = t.negate();
    return e ? r : t;
  }
  function eV(e, t) {
    if (!Number.isSafeInteger(e) || e <= 0 || e > t)
      throw Error("invalid window size, expected [1.." + t + "], got W=" + e);
  }
  function e$(e, t) {
    return (
      eV(e, t),
      { windows: Math.ceil(t / e) + 1, windowSize: 2 ** (e - 1) }
    );
  }
  let eY = new WeakMap(),
    eG = new WeakMap();
  function eZ(e) {
    return eG.get(e) || 1;
  }
  let eJ = BigInt(0),
    eX = BigInt(1),
    eQ = BigInt(2),
    e0 = BigInt(8),
    e1 = { zip215: !0 };
  (BigInt(0), BigInt(1));
  let e2 = BigInt(
      "57896044618658097711785492504343953926634992332820282019728792003956564819949",
    ),
    e8 = BigInt(
      "19681161376707505956807079304988542015446066515923890162744021073123829784752",
    );
  BigInt(0);
  let e5 = BigInt(1),
    e3 = BigInt(2);
  BigInt(3);
  let e6 = BigInt(5),
    e9 = BigInt(8),
    e4 = ez(e2, void 0, !0),
    e7 = (function (e) {
      var t;
      let r,
        n =
          (eB(
            e.Fp,
            eW.reduce((e, t) => ((e[t] = "function"), e), {
              ORDER: "bigint",
              MASK: "bigint",
              BYTES: "isSafeInteger",
              BITS: "isSafeInteger",
            }),
          ),
          eB(
            e,
            { n: "bigint", h: "bigint", Gx: "field", Gy: "field" },
            { nBitLength: "isSafeInteger", nByteLength: "isSafeInteger" },
          ),
          (r = Object.freeze({
            ...eH(e.n, e.nBitLength),
            ...e,
            p: e.Fp.ORDER,
          })),
          eB(
            e,
            {
              hash: "function",
              a: "bigint",
              d: "bigint",
              randomBytes: "function",
            },
            {
              adjustScalarBytes: "function",
              domain: "function",
              uvRatio: "function",
              mapToCurve: "function",
            },
          ),
          Object.freeze({ ...r })),
        {
          Fp: i,
          n: o,
          prehash: s,
          hash: a,
          randomBytes: c,
          nByteLength: l,
          h: u,
        } = n,
        f = eQ << (BigInt(8 * l) - eX),
        h = i.create,
        d = ez(n.n, n.nBitLength),
        p =
          n.uvRatio ||
          ((e, t) => {
            try {
              return { isValid: !0, value: i.sqrt(e * i.inv(t)) };
            } catch {
              return { isValid: !1, value: eJ };
            }
          }),
        b = n.adjustScalarBytes || ((e) => e),
        y =
          n.domain ||
          ((e, t, r) => {
            if ((ep("phflag", r), t.length || r))
              throw Error("Contexts/pre-hash are not supported");
            return e;
          });
      function g(e, t) {
        eA("coordinate " + e, t, eJ, f);
      }
      function m(e) {
        if (!(e instanceof x)) throw Error("ExtendedPoint expected");
      }
      let w = eT((e, t) => {
          let { ex: r, ey: n, ez: o } = e,
            s = e.is0();
          null == t && (t = s ? e0 : i.inv(o));
          let a = h(r * t),
            c = h(n * t),
            l = h(o * t);
          if (s) return { x: eJ, y: eX };
          if (l !== eX) throw Error("invZ was invalid");
          return { x: a, y: c };
        }),
        v = eT((e) => {
          let { a: t, d: r } = n;
          if (e.is0()) throw Error("bad point: ZERO");
          let { ex: i, ey: o, ez: s, et: a } = e,
            c = h(i * i),
            l = h(o * o),
            u = h(s * s),
            f = h(u * u),
            d = h(c * t);
          if (h(u * h(d + l)) !== h(f + h(r * h(c * l))))
            throw Error("bad point: equation left != right (1)");
          if (h(i * o) !== h(s * a))
            throw Error("bad point: equation left != right (2)");
          return !0;
        });
      class x {
        constructor(e, t, r, n) {
          ((this.ex = e),
            (this.ey = t),
            (this.ez = r),
            (this.et = n),
            g("x", e),
            g("y", t),
            g("z", r),
            g("t", n),
            Object.freeze(this));
        }
        get x() {
          return this.toAffine().x;
        }
        get y() {
          return this.toAffine().y;
        }
        static fromAffine(e) {
          if (e instanceof x) throw Error("extended point not allowed");
          let { x: t, y: r } = e || {};
          return (g("x", t), g("y", r), new x(t, r, eX, h(t * r)));
        }
        static normalizeZ(e) {
          let t = i.invertBatch(e.map((e) => e.ez));
          return e.map((e, r) => e.toAffine(t[r])).map(x.fromAffine);
        }
        static msm(e, t) {
          return (function (e, t, r, n) {
            if (
              ((function (e, t) {
                if (!Array.isArray(e)) throw Error("array expected");
                e.forEach((e, r) => {
                  if (!(e instanceof t))
                    throw Error("invalid point at index " + r);
                });
              })(r, e),
              (function (e, t) {
                if (!Array.isArray(e)) throw Error("array of scalars expected");
                e.forEach((e, r) => {
                  if (!t.isValid(e))
                    throw Error("invalid scalar at index " + r);
                });
              })(n, t),
              r.length !== n.length)
            )
              throw Error(
                "arrays of points and scalars must have equal length",
              );
            let i = e.ZERO,
              o = (function (e) {
                let t;
                for (t = 0; e > el; e >>= eu, t += 1);
                return t;
              })(BigInt(r.length)),
              s = o > 12 ? o - 3 : o > 4 ? o - 2 : o ? 2 : 1,
              a = (1 << s) - 1,
              c = Array(a + 1).fill(i),
              l = Math.floor((t.BITS - 1) / s) * s,
              u = i;
            for (let e = l; e >= 0; e -= s) {
              c.fill(i);
              for (let t = 0; t < n.length; t++) {
                let i = Number((n[t] >> BigInt(e)) & BigInt(a));
                c[i] = c[i].add(r[t]);
              }
              let t = i;
              for (let e = c.length - 1, r = i; e > 0; e--)
                ((r = r.add(c[e])), (t = t.add(r)));
              if (((u = u.add(t)), 0 !== e))
                for (let e = 0; e < s; e++) u = u.double();
            }
            return u;
          })(x, d, e, t);
        }
        _setWindowSize(e) {
          O.setWindowSize(this, e);
        }
        assertValidity() {
          v(this);
        }
        equals(e) {
          m(e);
          let { ex: t, ey: r, ez: n } = this,
            { ex: i, ey: o, ez: s } = e,
            a = h(t * s),
            c = h(i * n),
            l = h(r * s),
            u = h(o * n);
          return a === c && l === u;
        }
        is0() {
          return this.equals(x.ZERO);
        }
        negate() {
          return new x(h(-this.ex), this.ey, this.ez, h(-this.et));
        }
        double() {
          let { a: e } = n,
            { ex: t, ey: r, ez: i } = this,
            o = h(t * t),
            s = h(r * r),
            a = h(eQ * h(i * i)),
            c = h(e * o),
            l = t + r,
            u = h(h(l * l) - o - s),
            f = c + s,
            d = f - a,
            p = c - s,
            b = h(u * d),
            y = h(f * p),
            g = h(u * p);
          return new x(b, y, h(d * f), g);
        }
        add(e) {
          m(e);
          let { a: t, d: r } = n,
            { ex: i, ey: o, ez: s, et: a } = this,
            { ex: c, ey: l, ez: u, et: f } = e;
          if (t === BigInt(-1)) {
            let e = h((o - i) * (l + c)),
              t = h((o + i) * (l - c)),
              r = h(t - e);
            if (r === eJ) return this.double();
            let n = h(s * eQ * f),
              d = h(a * eQ * u),
              p = d + n,
              b = t + e,
              y = d - n,
              g = h(p * r),
              m = h(b * y),
              w = h(p * y);
            return new x(g, m, h(r * b), w);
          }
          let d = h(i * c),
            p = h(o * l),
            b = h(a * r * f),
            y = h(s * u),
            g = h((i + o) * (c + l) - d - p),
            w = y - b,
            v = y + b,
            E = h(p - t * d),
            _ = h(g * w),
            O = h(v * E),
            S = h(g * E);
          return new x(_, O, h(w * v), S);
        }
        subtract(e) {
          return this.add(e.negate());
        }
        wNAF(e) {
          return O.wNAFCached(this, e, x.normalizeZ);
        }
        multiply(e) {
          eA("scalar", e, eX, o);
          let { p: t, f: r } = this.wNAF(e);
          return x.normalizeZ([t, r])[0];
        }
        multiplyUnsafe(e, t = x.ZERO) {
          return (
            eA("scalar", e, eJ, o),
            e === eJ
              ? _
              : this.is0() || e === eX
                ? this
                : O.wNAFCachedUnsafe(this, e, x.normalizeZ, t)
          );
        }
        isSmallOrder() {
          return this.multiplyUnsafe(u).is0();
        }
        isTorsionFree() {
          return O.unsafeLadder(this, o).is0();
        }
        toAffine(e) {
          return w(this, e);
        }
        clearCofactor() {
          let { h: e } = n;
          return e === eX ? this : this.multiplyUnsafe(e);
        }
        static fromHex(e, t = !1) {
          let { d: r, a: o } = n,
            s = i.BYTES;
          ((e = e_("pointHex", e, s)), ep("zip215", t));
          let a = e.slice(),
            c = e[s - 1];
          a[s - 1] = -129 & c;
          let l = ev(a);
          eA("pointHex.y", l, eJ, t ? f : i.ORDER);
          let u = h(l * l),
            { isValid: d, value: b } = p(h(u - eX), h(r * u - o));
          if (!d) throw Error("Point.fromHex: invalid y coordinate");
          let y = (b & eX) === eX,
            g = (128 & c) != 0;
          if (!t && b === eJ && g) throw Error("Point.fromHex: x=0 and x_0=1");
          return (g !== y && (b = h(-b)), x.fromAffine({ x: b, y: l }));
        }
        static fromPrivateKey(e) {
          return S(e).point;
        }
        toRawBytes() {
          let { x: e, y: t } = this.toAffine(),
            r = eE(t, i.BYTES);
          return ((r[r.length - 1] |= e & eX ? 128 : 0), r);
        }
        toHex() {
          return ey(this.toRawBytes());
        }
      }
      ((x.BASE = new x(n.Gx, n.Gy, eX, h(n.Gx * n.Gy))),
        (x.ZERO = new x(eJ, eX, eX, eJ)));
      let { BASE: E, ZERO: _ } = x,
        O =
          ((t = 8 * l),
          {
            constTimeNegate: eq,
            hasPrecomputes: (e) => 1 !== eZ(e),
            unsafeLadder(e, t, r = x.ZERO) {
              let n = e;
              for (; t > eF; )
                (t & eK && (r = r.add(n)), (n = n.double()), (t >>= eK));
              return r;
            },
            precomputeWindow(e, r) {
              let { windows: n, windowSize: i } = e$(r, t),
                o = [],
                s = e,
                a = s;
              for (let e = 0; e < n; e++) {
                ((a = s), o.push(a));
                for (let e = 1; e < i; e++) ((a = a.add(s)), o.push(a));
                s = a.double();
              }
              return o;
            },
            wNAF(e, r, n) {
              let { windows: i, windowSize: o } = e$(e, t),
                s = x.ZERO,
                a = x.BASE,
                c = BigInt(2 ** e - 1),
                l = 2 ** e,
                u = BigInt(e);
              for (let e = 0; e < i; e++) {
                let t = e * o,
                  i = Number(n & c);
                ((n >>= u), i > o && ((i -= l), (n += eK)));
                let f = t + Math.abs(i) - 1,
                  h = e % 2 != 0,
                  d = i < 0;
                0 === i ? (a = a.add(eq(h, r[t]))) : (s = s.add(eq(d, r[f])));
              }
              return { p: s, f: a };
            },
            wNAFUnsafe(e, r, n, i = x.ZERO) {
              let { windows: o, windowSize: s } = e$(e, t),
                a = BigInt(2 ** e - 1),
                c = 2 ** e,
                l = BigInt(e);
              for (let e = 0; e < o; e++) {
                let t = e * s;
                if (n === eF) break;
                let o = Number(n & a);
                if (((n >>= l), o > s && ((o -= c), (n += eK)), 0 === o))
                  continue;
                let u = r[t + Math.abs(o) - 1];
                (o < 0 && (u = u.negate()), (i = i.add(u)));
              }
              return i;
            },
            getPrecomputes(e, t, r) {
              let n = eY.get(t);
              return (
                n ||
                  ((n = this.precomputeWindow(t, e)),
                  1 !== e && eY.set(t, r(n))),
                n
              );
            },
            wNAFCached(e, t, r) {
              let n = eZ(e);
              return this.wNAF(n, this.getPrecomputes(n, e, r), t);
            },
            wNAFCachedUnsafe(e, t, r, n) {
              let i = eZ(e);
              return 1 === i
                ? this.unsafeLadder(e, t, n)
                : this.wNAFUnsafe(i, this.getPrecomputes(i, e, r), t, n);
            },
            setWindowSize(e, r) {
              (eV(r, t), eG.set(e, r), eY.delete(e));
            },
          });
      function S(e) {
        let t = i.BYTES;
        e = e_("private key", e, t);
        let r = e_("hashed private key", a(e), 2 * t),
          n = b(r.slice(0, t)),
          s = r.slice(t, 2 * t),
          c = eM(ev(n), o),
          l = E.multiply(c),
          u = l.toRawBytes();
        return { head: n, prefix: s, scalar: c, point: l, pointBytes: u };
      }
      function A(e = new Uint8Array(), ...t) {
        return eM(ev(a(y(eO(...t), e_("context", e), !!s))), o);
      }
      return (
        E._setWindowSize(8),
        {
          CURVE: n,
          getPublicKey: function (e) {
            return S(e).pointBytes;
          },
          sign: function (e, t, r = {}) {
            ((e = e_("message", e)), s && (e = s(e)));
            let { prefix: n, scalar: a, pointBytes: c } = S(t),
              l = A(r.context, n, e),
              u = E.multiply(l).toRawBytes(),
              f = eM(l + A(r.context, u, c, e) * a, o);
            return (
              eA("signature.s", f, eJ, o),
              e_("result", eO(u, eE(f, i.BYTES)), 2 * i.BYTES)
            );
          },
          verify: function (e, t, r, n = e1) {
            let o,
              a,
              c,
              { context: l, zip215: u } = n,
              f = i.BYTES;
            ((e = e_("signature", e, 2 * f)),
              (t = e_("message", t)),
              (r = e_("publicKey", r, f)),
              void 0 !== u && ep("zip215", u),
              s && (t = s(t)));
            let h = ev(e.slice(f, 2 * f));
            try {
              ((o = x.fromHex(r, u)),
                (a = x.fromHex(e.slice(0, f), u)),
                (c = E.multiplyUnsafe(h)));
            } catch {
              return !1;
            }
            if (!u && o.isSmallOrder()) return !1;
            let d = A(l, a.toRawBytes(), o.toRawBytes(), t);
            return a
              .add(o.multiplyUnsafe(d))
              .subtract(c)
              .clearCofactor()
              .equals(x.ZERO);
          },
          ExtendedPoint: x,
          utils: {
            getExtendedPublicKey: S,
            randomPrivateKey: () => c(i.BYTES),
            precompute: (e = 8, t = x.BASE) => (
              t._setWindowSize(e),
              t.multiply(BigInt(3)),
              t
            ),
          },
        }
      );
    })({
      a: BigInt(-1),
      d: BigInt(
        "37095705934669439343138083508754565189542113879843219016388785533085940283555",
      ),
      Fp: e4,
      n: BigInt(
        "7237005577332262213973186563042994240857116359379907606001950938285454250989",
      ),
      h: e9,
      Gx: BigInt(
        "15112221349535400772501151409588531511454012693041857206046113283949847762202",
      ),
      Gy: BigInt(
        "46316835694926478169428394003475163141307993866256225615783033603165251855960",
      ),
      hash: ec,
      randomBytes: W,
      adjustScalarBytes: function (e) {
        return ((e[0] &= 248), (e[31] &= 127), (e[31] |= 64), e);
      },
      uvRatio: function (e, t) {
        var r;
        let n,
          i,
          o,
          s,
          a,
          c,
          l,
          u,
          f,
          h,
          d,
          p,
          b,
          y,
          g = eM(t * t * t, e2),
          m = ((r = e * eM(g * g * t, e2)),
          (n = BigInt(10)),
          (i = BigInt(20)),
          (o = BigInt(40)),
          (s = BigInt(80)),
          (c = (ek((a = (((r * r) % e2) * r) % e2), e3, e2) * a) % e2),
          (l = (ek(c, e5, e2) * r) % e2),
          (u = (ek(l, e6, e2) * l) % e2),
          (f = (ek(u, n, e2) * u) % e2),
          (h = (ek(f, i, e2) * f) % e2),
          (d = (ek(h, o, e2) * h) % e2),
          (p = (ek(d, s, e2) * d) % e2),
          (b = (ek(p, s, e2) * d) % e2),
          (y = (ek(b, n, e2) * u) % e2),
          { pow_p_5_8: (ek(y, e3, e2) * r) % e2, b2: a }).pow_p_5_8,
          w = eM(e * g * m, e2),
          v = eM(t * w * w, e2),
          x = w,
          E = eM(w * e8, e2),
          _ = v === e,
          O = v === eM(-e, e2),
          S = v === eM(-e * e8, e2);
        return (
          _ && (w = x),
          (O || S) && (w = E),
          (eM(w, e2) & eN) === eN && (w = eM(-w, e2)),
          { isValid: _ || O, value: w }
        );
      },
    }),
    te = "base64url",
    tt = "utf8",
    tr = "utf8",
    tn = "base58btc";
  function ti(e) {
    return null != globalThis.Buffer
      ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength)
      : e;
  }
  function to(e = 0) {
    return null != globalThis.Buffer && null != globalThis.Buffer.allocUnsafe
      ? ti(globalThis.Buffer.allocUnsafe(e))
      : new Uint8Array(e);
  }
  function ts(e, t) {
    t || (t = e.reduce((e, t) => e + t.length, 0));
    let r = to(t),
      n = 0;
    for (let t of e) (r.set(t, n), (n += t.length));
    return ti(r);
  }
  var ta = function (e, t) {
    if (e.length >= 255) throw TypeError("Alphabet too long");
    for (var r = new Uint8Array(256), n = 0; n < r.length; n++) r[n] = 255;
    for (var i = 0; i < e.length; i++) {
      var o = e.charAt(i),
        s = o.charCodeAt(0);
      if (255 !== r[s]) throw TypeError(o + " is ambiguous");
      r[s] = i;
    }
    var a = e.length,
      c = e.charAt(0),
      l = Math.log(a) / Math.log(256),
      u = Math.log(256) / Math.log(a);
    function f(e) {
      if ("string" != typeof e) throw TypeError("Expected String");
      if (0 === e.length) return new Uint8Array();
      var t = 0;
      if (" " !== e[0]) {
        for (var n = 0, i = 0; e[t] === c; ) (n++, t++);
        for (
          var o = ((e.length - t) * l + 1) >>> 0, s = new Uint8Array(o);
          e[t];

        ) {
          var u = r[e.charCodeAt(t)];
          if (255 === u) return;
          for (var f = 0, h = o - 1; (0 !== u || f < i) && -1 !== h; h--, f++)
            ((u += (a * s[h]) >>> 0),
              (s[h] = u % 256 >>> 0),
              (u = (u / 256) >>> 0));
          if (0 !== u) throw Error("Non-zero carry");
          ((i = f), t++);
        }
        if (" " !== e[t]) {
          for (var d = o - i; d !== o && 0 === s[d]; ) d++;
          for (var p = new Uint8Array(n + (o - d)), b = n; d !== o; )
            p[b++] = s[d++];
          return p;
        }
      }
    }
    return {
      encode: function (t) {
        if (
          (t instanceof Uint8Array ||
            (ArrayBuffer.isView(t)
              ? (t = new Uint8Array(t.buffer, t.byteOffset, t.byteLength))
              : Array.isArray(t) && (t = Uint8Array.from(t))),
          !(t instanceof Uint8Array))
        )
          throw TypeError("Expected Uint8Array");
        if (0 === t.length) return "";
        for (var r = 0, n = 0, i = 0, o = t.length; i !== o && 0 === t[i]; )
          (i++, r++);
        for (
          var s = ((o - i) * u + 1) >>> 0, l = new Uint8Array(s);
          i !== o;

        ) {
          for (
            var f = t[i], h = 0, d = s - 1;
            (0 !== f || h < n) && -1 !== d;
            d--, h++
          )
            ((f += (256 * l[d]) >>> 0),
              (l[d] = f % a >>> 0),
              (f = (f / a) >>> 0));
          if (0 !== f) throw Error("Non-zero carry");
          ((n = h), i++);
        }
        for (var p = s - n; p !== s && 0 === l[p]; ) p++;
        for (var b = c.repeat(r); p < s; ++p) b += e.charAt(l[p]);
        return b;
      },
      decodeUnsafe: f,
      decode: function (e) {
        var r = f(e);
        if (r) return r;
        throw Error(`Non-${t} character`);
      },
    };
  };
  let tc = (e) => {
    if (e instanceof Uint8Array && "Uint8Array" === e.constructor.name)
      return e;
    if (e instanceof ArrayBuffer) return new Uint8Array(e);
    if (ArrayBuffer.isView(e))
      return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
    throw Error("Unknown type, must be binary type");
  };
  class tl {
    constructor(e, t, r) {
      ((this.name = e), (this.prefix = t), (this.baseEncode = r));
    }
    encode(e) {
      if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
      throw Error("Unknown type, must be binary type");
    }
  }
  class tu {
    constructor(e, t, r) {
      if (((this.name = e), (this.prefix = t), void 0 === t.codePointAt(0)))
        throw Error("Invalid prefix character");
      ((this.prefixCodePoint = t.codePointAt(0)), (this.baseDecode = r));
    }
    decode(e) {
      if ("string" == typeof e) {
        if (e.codePointAt(0) !== this.prefixCodePoint)
          throw Error(
            `Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`,
          );
        return this.baseDecode(e.slice(this.prefix.length));
      }
      throw Error("Can only multibase decode strings");
    }
    or(e) {
      return th(this, e);
    }
  }
  class tf {
    constructor(e) {
      this.decoders = e;
    }
    or(e) {
      return th(this, e);
    }
    decode(e) {
      let t = e[0],
        r = this.decoders[t];
      if (r) return r.decode(e);
      throw RangeError(
        `Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`,
      );
    }
  }
  let th = (e, t) =>
    new tf({
      ...(e.decoders || { [e.prefix]: e }),
      ...(t.decoders || { [t.prefix]: t }),
    });
  class td {
    constructor(e, t, r, n) {
      ((this.name = e),
        (this.prefix = t),
        (this.baseEncode = r),
        (this.baseDecode = n),
        (this.encoder = new tl(e, t, r)),
        (this.decoder = new tu(e, t, n)));
    }
    encode(e) {
      return this.encoder.encode(e);
    }
    decode(e) {
      return this.decoder.decode(e);
    }
  }
  let tp = ({ name: e, prefix: t, encode: r, decode: n }) => new td(e, t, r, n),
    tb = ({ prefix: e, name: t, alphabet: r }) => {
      let { encode: n, decode: i } = ta(r, t);
      return tp({ prefix: e, name: t, encode: n, decode: (e) => tc(i(e)) });
    },
    ty = ({ name: e, prefix: t, bitsPerChar: r, alphabet: n }) =>
      tp({
        prefix: t,
        name: e,
        encode: (e) =>
          ((e, t, r) => {
            let n = "=" === t[t.length - 1],
              i = (1 << r) - 1,
              o = "",
              s = 0,
              a = 0;
            for (let n = 0; n < e.length; ++n)
              for (a = (a << 8) | e[n], s += 8; s > r; )
                ((s -= r), (o += t[i & (a >> s)]));
            if ((s && (o += t[i & (a << (r - s))]), n))
              for (; (o.length * r) & 7; ) o += "=";
            return o;
          })(e, n, r),
        decode: (t) =>
          ((e, t, r, n) => {
            let i = {};
            for (let e = 0; e < t.length; ++e) i[t[e]] = e;
            let o = e.length;
            for (; "=" === e[o - 1]; ) --o;
            let s = new Uint8Array(((o * r) / 8) | 0),
              a = 0,
              c = 0,
              l = 0;
            for (let t = 0; t < o; ++t) {
              let o = i[e[t]];
              if (void 0 === o) throw SyntaxError(`Non-${n} character`);
              ((c = (c << r) | o),
                (a += r) >= 8 && ((a -= 8), (s[l++] = 255 & (c >> a))));
            }
            if (a >= r || 255 & (c << (8 - a)))
              throw SyntaxError("Unexpected end of data");
            return s;
          })(t, n, r, e),
      });
  var tg = Object.freeze({
      __proto__: null,
      identity: tp({
        prefix: "\0",
        name: "identity",
        encode: (e) => new TextDecoder().decode(e),
        decode: (e) => new TextEncoder().encode(e),
      }),
    }),
    tm = Object.freeze({
      __proto__: null,
      base2: ty({ prefix: "0", name: "base2", alphabet: "01", bitsPerChar: 1 }),
    }),
    tw = Object.freeze({
      __proto__: null,
      base8: ty({
        prefix: "7",
        name: "base8",
        alphabet: "01234567",
        bitsPerChar: 3,
      }),
    }),
    tv = Object.freeze({
      __proto__: null,
      base10: tb({ prefix: "9", name: "base10", alphabet: "0123456789" }),
    }),
    tx = Object.freeze({
      __proto__: null,
      base16: ty({
        prefix: "f",
        name: "base16",
        alphabet: "0123456789abcdef",
        bitsPerChar: 4,
      }),
      base16upper: ty({
        prefix: "F",
        name: "base16upper",
        alphabet: "0123456789ABCDEF",
        bitsPerChar: 4,
      }),
    }),
    tE = Object.freeze({
      __proto__: null,
      base32: ty({
        prefix: "b",
        name: "base32",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567",
        bitsPerChar: 5,
      }),
      base32upper: ty({
        prefix: "B",
        name: "base32upper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        bitsPerChar: 5,
      }),
      base32pad: ty({
        prefix: "c",
        name: "base32pad",
        alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
        bitsPerChar: 5,
      }),
      base32padupper: ty({
        prefix: "C",
        name: "base32padupper",
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
        bitsPerChar: 5,
      }),
      base32hex: ty({
        prefix: "v",
        name: "base32hex",
        alphabet: "0123456789abcdefghijklmnopqrstuv",
        bitsPerChar: 5,
      }),
      base32hexupper: ty({
        prefix: "V",
        name: "base32hexupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
        bitsPerChar: 5,
      }),
      base32hexpad: ty({
        prefix: "t",
        name: "base32hexpad",
        alphabet: "0123456789abcdefghijklmnopqrstuv=",
        bitsPerChar: 5,
      }),
      base32hexpadupper: ty({
        prefix: "T",
        name: "base32hexpadupper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
        bitsPerChar: 5,
      }),
      base32z: ty({
        prefix: "h",
        name: "base32z",
        alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
        bitsPerChar: 5,
      }),
    }),
    t_ = Object.freeze({
      __proto__: null,
      base36: tb({
        prefix: "k",
        name: "base36",
        alphabet: "0123456789abcdefghijklmnopqrstuvwxyz",
      }),
      base36upper: tb({
        prefix: "K",
        name: "base36upper",
        alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      }),
    }),
    tO = Object.freeze({
      __proto__: null,
      base58btc: tb({
        name: "base58btc",
        prefix: "z",
        alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
      }),
      base58flickr: tb({
        name: "base58flickr",
        prefix: "Z",
        alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",
      }),
    }),
    tS = Object.freeze({
      __proto__: null,
      base64: ty({
        prefix: "m",
        name: "base64",
        alphabet:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        bitsPerChar: 6,
      }),
      base64pad: ty({
        prefix: "M",
        name: "base64pad",
        alphabet:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        bitsPerChar: 6,
      }),
      base64url: ty({
        prefix: "u",
        name: "base64url",
        alphabet:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
        bitsPerChar: 6,
      }),
      base64urlpad: ty({
        prefix: "U",
        name: "base64urlpad",
        alphabet:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
        bitsPerChar: 6,
      }),
    });
  let tA = Array.from(
      "🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂",
    ),
    tI = tA.reduce((e, t, r) => ((e[r] = t), e), []),
    tB = tA.reduce((e, t, r) => ((e[t.codePointAt(0)] = r), e), []);
  var tT = Object.freeze({
    __proto__: null,
    base256emoji: tp({
      prefix: "🚀",
      name: "base256emoji",
      encode: function (e) {
        return e.reduce((e, t) => (e += tI[t]), "");
      },
      decode: function (e) {
        let t = [];
        for (let r of e) {
          let e = tB[r.codePointAt(0)];
          if (void 0 === e) throw Error(`Non-base256emoji character: ${r}`);
          t.push(e);
        }
        return new Uint8Array(t);
      },
    }),
  });
  function tP(e, t, r) {
    ((t = t || []), (r = r || 0));
    for (var n = r; e >= 0x80000000; ) ((t[r++] = (255 & e) | 128), (e /= 128));
    for (; -128 & e; ) ((t[r++] = (255 & e) | 128), (e >>>= 7));
    return ((t[r] = 0 | e), (tP.bytes = r - n + 1), t);
  }
  var tN = function (e) {
    return e < 128
      ? 1
      : e < 16384
        ? 2
        : e < 2097152
          ? 3
          : e < 0x10000000
            ? 4
            : e < 0x800000000
              ? 5
              : e < 0x40000000000
                ? 6
                : e < 0x2000000000000
                  ? 7
                  : e < 0x100000000000000
                    ? 8
                    : e < 0x8000000000000000
                      ? 9
                      : 10;
  };
  let tU = (e, t, r = 0) => (tP(e, t, r), t),
    tC = (e, t) => {
      let r = t.byteLength,
        n = tN(e),
        i = n + tN(r),
        o = new Uint8Array(i + r);
      return (tU(e, o, 0), tU(r, o, n), o.set(t, i), new tR(e, r, t, o));
    };
  class tR {
    constructor(e, t, r, n) {
      ((this.code = e), (this.size = t), (this.digest = r), (this.bytes = n));
    }
  }
  let tj = ({ name: e, code: t, encode: r }) => new tD(e, t, r);
  class tD {
    constructor(e, t, r) {
      ((this.name = e), (this.code = t), (this.encode = r));
    }
    digest(e) {
      if (e instanceof Uint8Array) {
        let t = this.encode(e);
        return t instanceof Uint8Array
          ? tC(this.code, t)
          : t.then((e) => tC(this.code, e));
      }
      throw Error("Unknown type, must be binary type");
    }
  }
  let tM = (e) => async (t) => new Uint8Array(await crypto.subtle.digest(e, t));
  var tk = Object.freeze({
      __proto__: null,
      sha256: tj({ name: "sha2-256", code: 18, encode: tM("SHA-256") }),
      sha512: tj({ name: "sha2-512", code: 19, encode: tM("SHA-512") }),
    }),
    tL = Object.freeze({
      __proto__: null,
      identity: {
        code: 0,
        name: "identity",
        encode: tc,
        digest: (e) => tC(0, tc(e)),
      },
    });
  (new TextEncoder(), new TextDecoder());
  let tW = {
    ...tg,
    ...tm,
    ...tw,
    ...tv,
    ...tx,
    ...tE,
    ...t_,
    ...tO,
    ...tS,
    ...tT,
  };
  function tH(e, t, r, n) {
    return {
      name: e,
      prefix: t,
      encoder: { name: e, prefix: t, encode: r },
      decoder: { decode: n },
    };
  }
  ({ ...tk, ...tL });
  let tz = tH(
      "utf8",
      "u",
      (e) => "u" + new TextDecoder("utf8").decode(e),
      (e) => new TextEncoder().encode(e.substring(1)),
    ),
    tF = tH(
      "ascii",
      "a",
      (e) => {
        let t = "a";
        for (let r = 0; r < e.length; r++) t += String.fromCharCode(e[r]);
        return t;
      },
      (e) => {
        let t = to((e = e.substring(1)).length);
        for (let r = 0; r < e.length; r++) t[r] = e.charCodeAt(r);
        return t;
      },
    ),
    tK = {
      utf8: tz,
      "utf-8": tz,
      hex: tW.base16,
      latin1: tF,
      ascii: tF,
      binary: tF,
      ...tW,
    };
  function tq(e, t = "utf8") {
    let r = tK[t];
    if (!r) throw Error(`Unsupported encoding "${t}"`);
    return ("utf8" === t || "utf-8" === t) &&
      null != globalThis.Buffer &&
      null != globalThis.Buffer.from
      ? globalThis.Buffer.from(e.buffer, e.byteOffset, e.byteLength).toString(
          "utf8",
        )
      : r.encoder.encode(e).substring(1);
  }
  function tV(e, t = "utf8") {
    let r = tK[t];
    if (!r) throw Error(`Unsupported encoding "${t}"`);
    return ("utf8" === t || "utf-8" === t) &&
      null != globalThis.Buffer &&
      null != globalThis.Buffer.from
      ? ti(globalThis.Buffer.from(e, "utf-8"))
      : r.decoder.decode(`${r.prefix}${e}`);
  }
  function t$(e) {
    return O(tq(tV(e, te), tt));
  }
  function tY(e) {
    return tq(tV(S(e), tt), te);
  }
  function tG(e) {
    return ["did:key", "z" + tq(ts([tV("K36", tn), e]), tn)].join(":");
  }
  async function tZ(e, t, r, n, i = (0, s.fromMiliseconds)(Date.now())) {
    let o = { alg: "EdDSA", typ: "JWT" },
      a = { iss: tG(n.publicKey), sub: e, aud: t, iat: i, exp: i + r },
      c = tV(
        [tY((l = { header: o, payload: a }).header), tY(l.payload)].join("."),
        tr,
      );
    var l,
      u = {
        header: o,
        payload: a,
        signature: e7.sign(c, n.secretKey.slice(0, 32)),
      };
    return [tY(u.header), tY(u.payload), tq(u.signature, te)].join(".");
  }
  e.s(
    [
      "R",
      0,
      function (e) {
        let t = e.split(".");
        return {
          header: t$(t[0]),
          payload: t$(t[1]),
          signature: tV(t[2], te),
          data: tV(t.slice(0, 2).join("."), tr),
        };
      },
      "j",
      0,
      tG,
      "G",
      0,
      function (e = W(32)) {
        let t = e7.getPublicKey(e);
        return { secretKey: ts([e, t]), publicKey: t };
      },
      "X",
      0,
      tZ,
    ],
    232232,
  );
  var tJ = e.i(149502),
    tX = function (e, t, r) {
      if (r || 2 == arguments.length)
        for (var n, i = 0, o = t.length; i < o; i++)
          (!n && i in t) ||
            (n || (n = Array.prototype.slice.call(t, 0, i)), (n[i] = t[i]));
      return e.concat(n || Array.prototype.slice.call(t));
    },
    tQ = function (e, t, r) {
      ((this.name = e),
        (this.version = t),
        (this.os = r),
        (this.type = "browser"));
    },
    t0 = function (e) {
      ((this.version = e),
        (this.type = "node"),
        (this.name = "node"),
        (this.os = tJ.default.platform));
    },
    t1 = function (e, t, r, n) {
      ((this.name = e),
        (this.version = t),
        (this.os = r),
        (this.bot = n),
        (this.type = "bot-device"));
    },
    t2 = function () {
      ((this.type = "bot"),
        (this.bot = !0),
        (this.name = "bot"),
        (this.version = null),
        (this.os = null));
    },
    t8 = function () {
      ((this.type = "react-native"),
        (this.name = "react-native"),
        (this.version = null),
        (this.os = null));
    },
    t5 =
      /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/,
    t3 = [
      ["aol", /AOLShield\/([0-9\._]+)/],
      ["edge", /Edge\/([0-9\._]+)/],
      ["edge-ios", /EdgiOS\/([0-9\._]+)/],
      ["yandexbrowser", /YaBrowser\/([0-9\._]+)/],
      ["kakaotalk", /KAKAOTALK\s([0-9\.]+)/],
      ["samsung", /SamsungBrowser\/([0-9\.]+)/],
      ["silk", /\bSilk\/([0-9._-]+)\b/],
      ["miui", /MiuiBrowser\/([0-9\.]+)$/],
      ["beaker", /BeakerBrowser\/([0-9\.]+)/],
      ["edge-chromium", /EdgA?\/([0-9\.]+)/],
      [
        "chromium-webview",
        /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
      ],
      ["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
      ["phantomjs", /PhantomJS\/([0-9\.]+)(:?\s|$)/],
      ["crios", /CriOS\/([0-9\.]+)(:?\s|$)/],
      ["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/],
      ["fxios", /FxiOS\/([0-9\.]+)/],
      ["opera-mini", /Opera Mini.*Version\/([0-9\.]+)/],
      ["opera", /Opera\/([0-9\.]+)(?:\s|$)/],
      ["opera", /OPR\/([0-9\.]+)(:?\s|$)/],
      ["pie", /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
      [
        "pie",
        /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/,
      ],
      ["netfront", /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
      ["ie", /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
      ["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
      ["ie", /MSIE\s(7\.0)/],
      ["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/],
      ["android", /Android\s([0-9\.]+)/],
      ["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/],
      ["safari", /Version\/([0-9\._]+).*Safari/],
      ["facebook", /FB[AS]V\/([0-9\.]+)/],
      ["instagram", /Instagram\s([0-9\.]+)/],
      ["ios-webview", /AppleWebKit\/([0-9\.]+).*Mobile/],
      ["ios-webview", /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
      ["curl", /^curl\/([0-9\.]+)$/],
      [
        "searchbot",
        /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/,
      ],
    ],
    t6 = [
      ["iOS", /iP(hone|od|ad)/],
      ["Android OS", /Android/],
      ["BlackBerry OS", /BlackBerry|BB10/],
      ["Windows Mobile", /IEMobile/],
      ["Amazon OS", /Kindle/],
      ["Windows 3.11", /Win16/],
      ["Windows 95", /(Windows 95)|(Win95)|(Windows_95)/],
      ["Windows 98", /(Windows 98)|(Win98)/],
      ["Windows 2000", /(Windows NT 5.0)|(Windows 2000)/],
      ["Windows XP", /(Windows NT 5.1)|(Windows XP)/],
      ["Windows Server 2003", /(Windows NT 5.2)/],
      ["Windows Vista", /(Windows NT 6.0)/],
      ["Windows 7", /(Windows NT 6.1)/],
      ["Windows 8", /(Windows NT 6.2)/],
      ["Windows 8.1", /(Windows NT 6.3)/],
      ["Windows 10", /(Windows NT 10.0)/],
      ["Windows ME", /Windows ME/],
      ["Windows CE", /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
      ["Open BSD", /OpenBSD/],
      ["Sun OS", /SunOS/],
      ["Chrome OS", /CrOS/],
      ["Linux", /(Linux)|(X11)/],
      ["Mac OS", /(Mac_PowerPC)|(Macintosh)/],
      ["QNX", /QNX/],
      ["BeOS", /BeOS/],
      ["OS/2", /OS\/2/],
    ];
  function t9(e) {
    var t =
      "" !== e &&
      t3.reduce(function (t, r) {
        var n = r[0],
          i = r[1];
        if (t) return t;
        var o = i.exec(e);
        return !!o && [n, o];
      }, !1);
    if (!t) return null;
    var r = t[0],
      n = t[1];
    if ("searchbot" === r) return new t2();
    var i = n[1] && n[1].split(".").join("_").split("_").slice(0, 3);
    i
      ? i.length < 3 &&
        (i = tX(
          tX([], i, !0),
          (function (e) {
            for (var t = [], r = 0; r < e; r++) t.push("0");
            return t;
          })(3 - i.length),
          !0,
        ))
      : (i = []);
    var o = i.join("."),
      s = (function (e) {
        for (var t = 0, r = t6.length; t < r; t++) {
          var n = t6[t],
            i = n[0];
          if (n[1].exec(e)) return i;
        }
        return null;
      })(e),
      a = t5.exec(e);
    return a && a[1] ? new t1(r, o, s, a[1]) : new tQ(r, o, s);
  }
  e.s(
    [
      "f",
      0,
      function (e) {
        return e
          ? t9(e)
          : "u" < typeof document &&
              "u" > typeof navigator &&
              "ReactNative" === navigator.product
            ? new t8()
            : "u" > typeof navigator
              ? t9(navigator.userAgent)
              : void 0 !== tJ.default && tJ.default.version
                ? new t0(tJ.default.version.slice(1))
                : null;
      },
    ],
    33898,
  );
  let t4 = function (e, t) {
      if (e.length >= 255) throw TypeError("Alphabet too long");
      for (var r = new Uint8Array(256), n = 0; n < r.length; n++) r[n] = 255;
      for (var i = 0; i < e.length; i++) {
        var o = e.charAt(i),
          s = o.charCodeAt(0);
        if (255 !== r[s]) throw TypeError(o + " is ambiguous");
        r[s] = i;
      }
      var a = e.length,
        c = e.charAt(0),
        l = Math.log(a) / Math.log(256),
        u = Math.log(256) / Math.log(a);
      function f(e) {
        if ("string" != typeof e) throw TypeError("Expected String");
        if (0 === e.length) return new Uint8Array();
        var t = 0;
        if (" " !== e[0]) {
          for (var n = 0, i = 0; e[t] === c; ) (n++, t++);
          for (
            var o = ((e.length - t) * l + 1) >>> 0, s = new Uint8Array(o);
            e[t];

          ) {
            var u = r[e.charCodeAt(t)];
            if (255 === u) return;
            for (var f = 0, h = o - 1; (0 !== u || f < i) && -1 !== h; h--, f++)
              ((u += (a * s[h]) >>> 0),
                (s[h] = u % 256 >>> 0),
                (u = (u / 256) >>> 0));
            if (0 !== u) throw Error("Non-zero carry");
            ((i = f), t++);
          }
          if (" " !== e[t]) {
            for (var d = o - i; d !== o && 0 === s[d]; ) d++;
            for (var p = new Uint8Array(n + (o - d)), b = n; d !== o; )
              p[b++] = s[d++];
            return p;
          }
        }
      }
      return {
        encode: function (t) {
          if (
            (t instanceof Uint8Array ||
              (ArrayBuffer.isView(t)
                ? (t = new Uint8Array(t.buffer, t.byteOffset, t.byteLength))
                : Array.isArray(t) && (t = Uint8Array.from(t))),
            !(t instanceof Uint8Array))
          )
            throw TypeError("Expected Uint8Array");
          if (0 === t.length) return "";
          for (var r = 0, n = 0, i = 0, o = t.length; i !== o && 0 === t[i]; )
            (i++, r++);
          for (
            var s = ((o - i) * u + 1) >>> 0, l = new Uint8Array(s);
            i !== o;

          ) {
            for (
              var f = t[i], h = 0, d = s - 1;
              (0 !== f || h < n) && -1 !== d;
              d--, h++
            )
              ((f += (256 * l[d]) >>> 0),
                (l[d] = f % a >>> 0),
                (f = (f / a) >>> 0));
            if (0 !== f) throw Error("Non-zero carry");
            ((n = h), i++);
          }
          for (var p = s - n; p !== s && 0 === l[p]; ) p++;
          for (var b = c.repeat(r); p < s; ++p) b += e.charAt(l[p]);
          return b;
        },
        decodeUnsafe: f,
        decode: function (e) {
          var r = f(e);
          if (r) return r;
          throw Error(`Non-${t} character`);
        },
      };
    },
    t7 = new Uint8Array(0),
    re = (e, t) => {
      if (e === t) return !0;
      if (e.byteLength !== t.byteLength) return !1;
      for (let r = 0; r < e.byteLength; r++) if (e[r] !== t[r]) return !1;
      return !0;
    },
    rt = (e) => {
      if (e instanceof Uint8Array && "Uint8Array" === e.constructor.name)
        return e;
      if (e instanceof ArrayBuffer) return new Uint8Array(e);
      if (ArrayBuffer.isView(e))
        return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
      throw Error("Unknown type, must be binary type");
    },
    rr = (e) => new TextEncoder().encode(e),
    rn = (e) => new TextDecoder().decode(e);
  e.s(
    [
      "coerce",
      0,
      rt,
      "empty",
      0,
      t7,
      "equals",
      0,
      re,
      "fromHex",
      0,
      (e) => {
        let t = e.match(/../g);
        return t ? new Uint8Array(t.map((e) => parseInt(e, 16))) : t7;
      },
      "fromString",
      0,
      rr,
      "isBinary",
      0,
      (e) => e instanceof ArrayBuffer || ArrayBuffer.isView(e),
      "toHex",
      0,
      (e) => e.reduce((e, t) => e + t.toString(16).padStart(2, "0"), ""),
      "toString",
      0,
      rn,
    ],
    528695,
  );
  class ri {
    constructor(e, t, r) {
      ((this.name = e), (this.prefix = t), (this.baseEncode = r));
    }
    encode(e) {
      if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
      throw Error("Unknown type, must be binary type");
    }
  }
  class ro {
    constructor(e, t, r) {
      if (((this.name = e), (this.prefix = t), void 0 === t.codePointAt(0)))
        throw Error("Invalid prefix character");
      ((this.prefixCodePoint = t.codePointAt(0)), (this.baseDecode = r));
    }
    decode(e) {
      if ("string" == typeof e) {
        if (e.codePointAt(0) !== this.prefixCodePoint)
          throw Error(
            `Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`,
          );
        return this.baseDecode(e.slice(this.prefix.length));
      }
      throw Error("Can only multibase decode strings");
    }
    or(e) {
      return ra(this, e);
    }
  }
  class rs {
    constructor(e) {
      this.decoders = e;
    }
    or(e) {
      return ra(this, e);
    }
    decode(e) {
      let t = e[0],
        r = this.decoders[t];
      if (r) return r.decode(e);
      throw RangeError(
        `Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`,
      );
    }
  }
  let ra = (e, t) =>
    new rs({
      ...(e.decoders || { [e.prefix]: e }),
      ...(t.decoders || { [t.prefix]: t }),
    });
  class rc {
    constructor(e, t, r, n) {
      ((this.name = e),
        (this.prefix = t),
        (this.baseEncode = r),
        (this.baseDecode = n),
        (this.encoder = new ri(e, t, r)),
        (this.decoder = new ro(e, t, n)));
    }
    encode(e) {
      return this.encoder.encode(e);
    }
    decode(e) {
      return this.decoder.decode(e);
    }
  }
  let rl = ({ name: e, prefix: t, encode: r, decode: n }) => new rc(e, t, r, n),
    ru = ({ prefix: e, name: t, alphabet: r }) => {
      let { encode: n, decode: i } = t4(r, t);
      return rl({ prefix: e, name: t, encode: n, decode: (e) => rt(i(e)) });
    },
    rf = ({ name: e, prefix: t, bitsPerChar: r, alphabet: n }) =>
      rl({
        prefix: t,
        name: e,
        encode: (e) =>
          ((e, t, r) => {
            let n = "=" === t[t.length - 1],
              i = (1 << r) - 1,
              o = "",
              s = 0,
              a = 0;
            for (let n = 0; n < e.length; ++n)
              for (a = (a << 8) | e[n], s += 8; s > r; )
                ((s -= r), (o += t[i & (a >> s)]));
            if ((s && (o += t[i & (a << (r - s))]), n))
              for (; (o.length * r) & 7; ) o += "=";
            return o;
          })(e, n, r),
        decode: (t) =>
          ((e, t, r, n) => {
            let i = {};
            for (let e = 0; e < t.length; ++e) i[t[e]] = e;
            let o = e.length;
            for (; "=" === e[o - 1]; ) --o;
            let s = new Uint8Array(((o * r) / 8) | 0),
              a = 0,
              c = 0,
              l = 0;
            for (let t = 0; t < o; ++t) {
              let o = i[e[t]];
              if (void 0 === o) throw SyntaxError(`Non-${n} character`);
              ((c = (c << r) | o),
                (a += r) >= 8 && ((a -= 8), (s[l++] = 255 & (c >> a))));
            }
            if (a >= r || 255 & (c << (8 - a)))
              throw SyntaxError("Unexpected end of data");
            return s;
          })(t, n, r, e),
      }),
    rh = rl({
      prefix: "\0",
      name: "identity",
      encode: (e) => rn(e),
      decode: (e) => rr(e),
    });
  e.s(["identity", 0, rh], 747665);
  var rd = e.i(747665);
  let rp = rf({ prefix: "0", name: "base2", alphabet: "01", bitsPerChar: 1 });
  e.s(["base2", 0, rp], 856013);
  var rb = e.i(856013);
  let ry = rf({
    prefix: "7",
    name: "base8",
    alphabet: "01234567",
    bitsPerChar: 3,
  });
  e.s(["base8", 0, ry], 955747);
  var rg = e.i(955747);
  let rm = ru({ prefix: "9", name: "base10", alphabet: "0123456789" });
  e.s(["base10", 0, rm], 99783);
  var rw = e.i(99783);
  let rv = rf({
      prefix: "f",
      name: "base16",
      alphabet: "0123456789abcdef",
      bitsPerChar: 4,
    }),
    rx = rf({
      prefix: "F",
      name: "base16upper",
      alphabet: "0123456789ABCDEF",
      bitsPerChar: 4,
    });
  e.s(["base16", 0, rv, "base16upper", 0, rx], 918115);
  var rE = e.i(918115);
  let r_ = rf({
      prefix: "b",
      name: "base32",
      alphabet: "abcdefghijklmnopqrstuvwxyz234567",
      bitsPerChar: 5,
    }),
    rO = rf({
      prefix: "B",
      name: "base32upper",
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
      bitsPerChar: 5,
    }),
    rS = rf({
      prefix: "c",
      name: "base32pad",
      alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
      bitsPerChar: 5,
    }),
    rA = rf({
      prefix: "C",
      name: "base32padupper",
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
      bitsPerChar: 5,
    }),
    rI = rf({
      prefix: "v",
      name: "base32hex",
      alphabet: "0123456789abcdefghijklmnopqrstuv",
      bitsPerChar: 5,
    }),
    rB = rf({
      prefix: "V",
      name: "base32hexupper",
      alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
      bitsPerChar: 5,
    }),
    rT = rf({
      prefix: "t",
      name: "base32hexpad",
      alphabet: "0123456789abcdefghijklmnopqrstuv=",
      bitsPerChar: 5,
    }),
    rP = rf({
      prefix: "T",
      name: "base32hexpadupper",
      alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
      bitsPerChar: 5,
    }),
    rN = rf({
      prefix: "h",
      name: "base32z",
      alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
      bitsPerChar: 5,
    });
  e.s(
    [
      "base32",
      0,
      r_,
      "base32hex",
      0,
      rI,
      "base32hexpad",
      0,
      rT,
      "base32hexpadupper",
      0,
      rP,
      "base32hexupper",
      0,
      rB,
      "base32pad",
      0,
      rS,
      "base32padupper",
      0,
      rA,
      "base32upper",
      0,
      rO,
      "base32z",
      0,
      rN,
    ],
    712751,
  );
  var rU = e.i(712751);
  let rC = ru({
      prefix: "k",
      name: "base36",
      alphabet: "0123456789abcdefghijklmnopqrstuvwxyz",
    }),
    rR = ru({
      prefix: "K",
      name: "base36upper",
      alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    });
  e.s(["base36", 0, rC, "base36upper", 0, rR], 171883);
  var rj = e.i(171883);
  let rD = ru({
      name: "base58btc",
      prefix: "z",
      alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
    }),
    rM = ru({
      name: "base58flickr",
      prefix: "Z",
      alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",
    });
  e.s(["base58btc", 0, rD, "base58flickr", 0, rM], 8825);
  var rk = e.i(8825);
  let rL = rf({
      prefix: "m",
      name: "base64",
      alphabet:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      bitsPerChar: 6,
    }),
    rW = rf({
      prefix: "M",
      name: "base64pad",
      alphabet:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      bitsPerChar: 6,
    }),
    rH = rf({
      prefix: "u",
      name: "base64url",
      alphabet:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
      bitsPerChar: 6,
    }),
    rz = rf({
      prefix: "U",
      name: "base64urlpad",
      alphabet:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
      bitsPerChar: 6,
    });
  e.s(
    [
      "base64",
      0,
      rL,
      "base64pad",
      0,
      rW,
      "base64url",
      0,
      rH,
      "base64urlpad",
      0,
      rz,
    ],
    39684,
  );
  var rF = e.i(39684);
  let rK = Array.from(
      "🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂",
    ),
    rq = rK.reduce((e, t, r) => ((e[r] = t), e), []),
    rV = rK.reduce((e, t, r) => ((e[t.codePointAt(0)] = r), e), []),
    r$ = rl({
      prefix: "🚀",
      name: "base256emoji",
      encode: function (e) {
        return e.reduce((e, t) => (e += rq[t]), "");
      },
      decode: function (e) {
        let t = [];
        for (let r of e) {
          let e = rV[r.codePointAt(0)];
          if (void 0 === e) throw Error(`Non-base256emoji character: ${r}`);
          t.push(e);
        }
        return new Uint8Array(t);
      },
    });
  e.s(["base256emoji", 0, r$], 78161);
  var rY = e.i(78161);
  function rG(e, t, r) {
    t = t || [];
    for (var n = (r = r || 0); e >= 0x80000000; )
      ((t[r++] = (255 & e) | 128), (e /= 128));
    for (; -128 & e; ) ((t[r++] = (255 & e) | 128), (e >>>= 7));
    return ((t[r] = 0 | e), (rG.bytes = r - n + 1), t);
  }
  function rZ(e, t) {
    var r,
      n = 0,
      t = t || 0,
      i = 0,
      o = t,
      s = e.length;
    do {
      if (o >= s) throw ((rZ.bytes = 0), RangeError("Could not decode varint"));
      ((r = e[o++]),
        (n += i < 28 ? (127 & r) << i : (127 & r) * Math.pow(2, i)),
        (i += 7));
    } while (r >= 128);
    return ((rZ.bytes = o - t), n);
  }
  let rJ = (e, t = 0) => [rZ(e, t), rZ.bytes],
    rX = (e, t, r = 0) => (rG(e, t, r), t),
    rQ = (e) => {
      var t;
      return (t = e) < 128
        ? 1
        : t < 16384
          ? 2
          : t < 2097152
            ? 3
            : t < 0x10000000
              ? 4
              : t < 0x800000000
                ? 5
                : t < 0x40000000000
                  ? 6
                  : t < 0x2000000000000
                    ? 7
                    : t < 0x100000000000000
                      ? 8
                      : t < 0x8000000000000000
                        ? 9
                        : 10;
    };
  e.s(["decode", 0, rJ, "encodeTo", 0, rX, "encodingLength", 0, rQ], 631426);
  let r0 = (e, t) => {
    let r = t.byteLength,
      n = rQ(e),
      i = n + rQ(r),
      o = new Uint8Array(i + r);
    return (rX(e, o, 0), rX(r, o, n), o.set(t, i), new r1(e, r, t, o));
  };
  class r1 {
    constructor(e, t, r, n) {
      ((this.code = e), (this.size = t), (this.digest = r), (this.bytes = n));
    }
  }
  e.s(
    [
      "Digest",
      0,
      r1,
      "create",
      0,
      r0,
      "decode",
      0,
      (e) => {
        let t = rt(e),
          [r, n] = rJ(t),
          [i, o] = rJ(t.subarray(n)),
          s = t.subarray(n + o);
        if (s.byteLength !== i) throw Error("Incorrect length");
        return new r1(r, i, s, t);
      },
      "equals",
      0,
      (e, t) =>
        e === t ||
        (e.code === t.code && e.size === t.size && re(e.bytes, t.bytes)),
    ],
    956954,
  );
  let r2 = ({ name: e, code: t, encode: r }) => new r8(e, t, r);
  class r8 {
    constructor(e, t, r) {
      ((this.name = e), (this.code = t), (this.encode = r));
    }
    digest(e) {
      if (e instanceof Uint8Array) {
        let t = this.encode(e);
        return t instanceof Uint8Array
          ? r0(this.code, t)
          : t.then((e) => r0(this.code, e));
      }
      throw Error("Unknown type, must be binary type");
    }
  }
  e.s(["Hasher", 0, r8, "from", 0, r2], 79727);
  let r5 = (e) => async (t) => new Uint8Array(await crypto.subtle.digest(e, t)),
    r3 = r2({ name: "sha2-256", code: 18, encode: r5("SHA-256") }),
    r6 = r2({ name: "sha2-512", code: 19, encode: r5("SHA-512") });
  e.s(["sha256", 0, r3, "sha512", 0, r6], 668878);
  e.i(668878);
  e.s(
    [
      "identity",
      0,
      { code: 0, name: "identity", encode: rt, digest: (e) => r0(0, rt(e)) },
    ],
    155061,
  );
  e.i(155061);
  (e.s(
    [
      "code",
      0,
      85,
      "decode",
      0,
      (e) => rt(e),
      "encode",
      0,
      (e) => rt(e),
      "name",
      0,
      "raw",
    ],
    444570,
  ),
    e.i(444570));
  let r9 = new TextEncoder(),
    r4 = new TextDecoder();
  (e.s(
    [
      "code",
      0,
      512,
      "decode",
      0,
      (e) => JSON.parse(r4.decode(e)),
      "encode",
      0,
      (e) => r9.encode(JSON.stringify(e)),
      "name",
      0,
      "json",
    ],
    772932,
  ),
    e.i(772932),
    Symbol.for("nodejs.util.inspect.custom"),
    Symbol.for("@ipld/js-cid/CID"),
    e.i(631426),
    e.i(528695),
    e.i(79727),
    e.i(956954));
  let r7 = {
    ...rd,
    ...rb,
    ...rg,
    ...rw,
    ...rE,
    ...rU,
    ...rj,
    ...rk,
    ...rF,
    ...rY,
  };
  (e.s(["f", 0, r7], 957736),
    e.s(
      [
        "f",
        0,
        {
          waku: {
            publish: "waku_publish",
            batchPublish: "waku_batchPublish",
            subscribe: "waku_subscribe",
            batchSubscribe: "waku_batchSubscribe",
            subscription: "waku_subscription",
            unsubscribe: "waku_unsubscribe",
            batchUnsubscribe: "waku_batchUnsubscribe",
            batchFetchMessages: "waku_batchFetchMessages",
          },
          irn: {
            publish: "irn_publish",
            batchPublish: "irn_batchPublish",
            subscribe: "irn_subscribe",
            batchSubscribe: "irn_batchSubscribe",
            subscription: "irn_subscription",
            unsubscribe: "irn_unsubscribe",
            batchUnsubscribe: "irn_batchUnsubscribe",
            batchFetchMessages: "irn_batchFetchMessages",
          },
          iridium: {
            publish: "iridium_publish",
            batchPublish: "iridium_batchPublish",
            subscribe: "iridium_subscribe",
            batchSubscribe: "iridium_batchSubscribe",
            subscription: "iridium_subscription",
            unsubscribe: "iridium_unsubscribe",
            batchUnsubscribe: "iridium_batchUnsubscribe",
            batchFetchMessages: "iridium_batchFetchMessages",
          },
        },
      ],
      208910,
    ));
  var ne = e.i(21318);
  (ne.isNode, e.s([], 660075));
  class nt {}
  class nr extends nt {
    constructor() {
      super();
    }
  }
  class nn extends nr {
    constructor(e) {
      super();
    }
  }
  let ni = "INTERNAL_ERROR",
    no = "SERVER_ERROR",
    ns = [-32700, -32600, -32601, -32602, -32603],
    na = {
      PARSE_ERROR: { code: -32700, message: "Parse error" },
      INVALID_REQUEST: { code: -32600, message: "Invalid Request" },
      METHOD_NOT_FOUND: { code: -32601, message: "Method not found" },
      INVALID_PARAMS: { code: -32602, message: "Invalid params" },
      [ni]: { code: -32603, message: "Internal error" },
      [no]: { code: -32e3, message: "Server error" },
    };
  function nc(e) {
    return Object.keys(na).includes(e) ? na[e] : na[no];
  }
  function nl(e, t, r) {
    return e.message.includes("getaddrinfo ENOTFOUND") ||
      e.message.includes("connect ECONNREFUSED")
      ? Error(`Unavailable ${r} RPC url at ${t}`)
      : e;
  }
  function nu(e = 3) {
    return (
      Date.now() * Math.pow(10, e) + Math.floor(Math.random() * Math.pow(10, e))
    );
  }
  function nf(e = 6) {
    return BigInt(nu(e));
  }
  function nh(e, t, r) {
    return { id: r || nu(), jsonrpc: "2.0", method: e, params: t };
  }
  function nd(e, t, r) {
    var n, i, o, s;
    let a;
    return {
      id: e,
      jsonrpc: "2.0",
      error:
        ((n = t),
        (i = r),
        void 0 === n
          ? nc(ni)
          : ("string" == typeof n &&
              (n = Object.assign(Object.assign({}, nc(no)), { message: n })),
            void 0 !== i && (n.data = i),
            (o = n.code),
            ns.includes(o) &&
              ((s = n.code),
              (n =
                (a = Object.values(na).find((e) => e.code === s)) || na[no])),
            n)),
    };
  }
  function np(e) {
    return (
      "object" == typeof e && "id" in e && "jsonrpc" in e && "2.0" === e.jsonrpc
    );
  }
  function nb(e) {
    return np(e) && (ny(e) || ng(e));
  }
  function ny(e) {
    return "result" in e;
  }
  function ng(e) {
    return "error" in e;
  }
  function nm(e, t) {
    let r = (function (e) {
      let t = e.match(RegExp(/^\w+:/, "gi"));
      if (t && t.length) return t[0];
    })(e);
    return void 0 !== r && new RegExp(t).test(r);
  }
  function nw(e) {
    return nm(e, "^https?:");
  }
  function nv(e) {
    return nm(e, "^wss?:");
  }
  (e.s(
    [
      "U",
      0,
      nd,
      "i",
      0,
      nh,
      "P",
      0,
      function (e, t) {
        return { id: e, jsonrpc: "2.0", result: t };
      },
      "f",
      0,
      nf,
      "I",
      0,
      nu,
    ],
    669941,
  ),
    e.s(
      [
        "x",
        0,
        ng,
        "N",
        0,
        function (e) {
          return np(e) && "method" in e;
        },
        "Z",
        0,
        nb,
        "t",
        0,
        ny,
      ],
      139434,
    ),
    e.s(
      [
        "f",
        0,
        class extends nn {
          constructor(e) {
            (super(e),
              (this.events = new o.EventEmitter()),
              (this.hasRegisteredEventListeners = !1),
              (this.connection = this.setConnection(e)),
              this.connection.connected && this.registerEventListeners());
          }
          async connect(e = this.connection) {
            await this.open(e);
          }
          async disconnect() {
            await this.close();
          }
          on(e, t) {
            this.events.on(e, t);
          }
          once(e, t) {
            this.events.once(e, t);
          }
          off(e, t) {
            this.events.off(e, t);
          }
          removeListener(e, t) {
            this.events.removeListener(e, t);
          }
          async request(e, t) {
            return this.requestStrict(
              nh(e.method, e.params || [], e.id || nf().toString()),
              t,
            );
          }
          async requestStrict(e, t) {
            return new Promise(async (r, n) => {
              if (!this.connection.connected)
                try {
                  await this.open();
                } catch (e) {
                  n(e);
                }
              this.events.on(`${e.id}`, (e) => {
                ng(e) ? n(e.error) : r(e.result);
              });
              try {
                await this.connection.send(e, t);
              } catch (e) {
                n(e);
              }
            });
          }
          setConnection(e = this.connection) {
            return e;
          }
          onPayload(e) {
            (this.events.emit("payload", e),
              nb(e)
                ? this.events.emit(`${e.id}`, e)
                : this.events.emit("message", {
                    type: e.method,
                    data: e.params,
                  }));
          }
          onClose(e) {
            (e &&
              3e3 === e.code &&
              this.events.emit(
                "error",
                Error(
                  `WebSocket connection closed abnormally with code: ${e.code} ${e.reason ? `(${e.reason})` : ""}`,
                ),
              ),
              this.events.emit("disconnect"));
          }
          async open(e = this.connection) {
            (this.connection === e && this.connection.connected) ||
              (this.connection.connected && this.close(),
              "string" == typeof e &&
                (await this.connection.open(e), (e = this.connection)),
              (this.connection = this.setConnection(e)),
              await this.connection.open(),
              this.registerEventListeners(),
              this.events.emit("connect"));
          }
          async close() {
            await this.connection.close();
          }
          registerEventListeners() {
            this.hasRegisteredEventListeners ||
              (this.connection.on("payload", (e) => this.onPayload(e)),
              this.connection.on("close", (e) => this.onClose(e)),
              this.connection.on("error", (e) => this.events.emit("error", e)),
              this.connection.on("register_error", (e) => this.onClose()),
              (this.hasRegisteredEventListeners = !0));
          }
        },
      ],
      409482,
    ));
  let nx = (e) => e.split("?")[0],
    nE =
      "u" > typeof WebSocket
        ? WebSocket
        : "u" > typeof e.g.WebSocket
          ? e.g.WebSocket
          : "u" > typeof window && "u" > typeof window.WebSocket
            ? window.WebSocket
            : "u" > typeof self && "u" > typeof self.WebSocket
              ? self.WebSocket
              : e.r(213171);
  e.s(
    [
      "f",
      0,
      class {
        constructor(e) {
          if (
            ((this.url = e),
            (this.events = new o.EventEmitter()),
            (this.registering = !1),
            !nv(e))
          )
            throw Error(
              `Provided URL is not compatible with WebSocket connection: ${e}`,
            );
          this.url = e;
        }
        get connected() {
          return "u" > typeof this.socket;
        }
        get connecting() {
          return this.registering;
        }
        on(e, t) {
          this.events.on(e, t);
        }
        once(e, t) {
          this.events.once(e, t);
        }
        off(e, t) {
          this.events.off(e, t);
        }
        removeListener(e, t) {
          this.events.removeListener(e, t);
        }
        async open(e = this.url) {
          await this.register(e);
        }
        async close() {
          return new Promise((e, t) => {
            typeof this.socket > "u"
              ? t(Error("Connection already closed"))
              : ((this.socket.onclose = (t) => {
                  (this.onClose(t), e());
                }),
                this.socket.close());
          });
        }
        async send(e) {
          typeof this.socket > "u" && (this.socket = await this.register());
          try {
            this.socket.send(S(e));
          } catch (t) {
            this.onError(e.id, t);
          }
        }
        register(t = this.url) {
          if (!nv(t))
            throw Error(
              `Provided URL is not compatible with WebSocket connection: ${t}`,
            );
          if (this.registering) {
            let e = this.events.getMaxListeners();
            return (
              (this.events.listenerCount("register_error") >= e ||
                this.events.listenerCount("open") >= e) &&
                this.events.setMaxListeners(e + 1),
              new Promise((e, t) => {
                (this.events.once("register_error", (e) => {
                  (this.resetMaxListeners(), t(e));
                }),
                  this.events.once("open", () => {
                    if ((this.resetMaxListeners(), typeof this.socket > "u"))
                      return t(
                        Error("WebSocket connection is missing or invalid"),
                      );
                    e(this.socket);
                  }));
              })
            );
          }
          return (
            (this.url = t),
            (this.registering = !0),
            new Promise((r, n) => {
              let i = (0, ne.isReactNative)()
                  ? void 0
                  : {
                      rejectUnauthorized: !RegExp(
                        "wss?://localhost(:d{2,5})?",
                      ).test(t),
                    },
                o = new nE(t, [], i);
              ("u" > typeof WebSocket ||
              "u" > typeof e.g.WebSocket ||
              ("u" > typeof window && "u" > typeof window.WebSocket) ||
              ("u" > typeof self && "u" > typeof self.WebSocket)
                ? (o.onerror = (e) => {
                    n(this.emitError(e.error));
                  })
                : o.on("error", (e) => {
                    n(this.emitError(e));
                  }),
                (o.onopen = () => {
                  (this.onOpen(o), r(o));
                }));
            })
          );
        }
        onOpen(e) {
          ((e.onmessage = (e) => this.onPayload(e)),
            (e.onclose = (e) => this.onClose(e)),
            (this.socket = e),
            (this.registering = !1),
            this.events.emit("open"));
        }
        onClose(e) {
          ((this.socket = void 0),
            (this.registering = !1),
            this.events.emit("close", e));
        }
        onPayload(e) {
          if (typeof e.data > "u") return;
          let t = "string" == typeof e.data ? O(e.data) : e.data;
          this.events.emit("payload", t);
        }
        onError(e, t) {
          let r = this.parseError(t),
            n = nd(e, r.message || r.toString());
          this.events.emit("payload", n);
        }
        parseError(e, t = this.url) {
          return nl(e, nx(t), "WS");
        }
        resetMaxListeners() {
          this.events.getMaxListeners() > 10 && this.events.setMaxListeners(10);
        }
        emitError(e) {
          let t = this.parseError(
            Error(
              e?.message ||
                `WebSocket connection failed for host: ${nx(this.url)}`,
            ),
          );
          return (this.events.emit("register_error", t), t);
        }
      },
    ],
    327026,
  );
  var n_ = e.i(667337),
    nO = Object.defineProperty,
    nS = Object.defineProperties,
    nA = Object.getOwnPropertyDescriptors,
    nI = Object.getOwnPropertySymbols,
    nB = Object.prototype.hasOwnProperty,
    nT = Object.prototype.propertyIsEnumerable,
    nP = (e, t, r) =>
      t in e
        ? nO(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
        : (e[t] = r),
    nN = (e, t) => {
      for (var r in t || (t = {})) nB.call(t, r) && nP(e, r, t[r]);
      if (nI) for (var r of nI(t)) nT.call(t, r) && nP(e, r, t[r]);
      return e;
    };
  let nU = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    method: "POST",
  };
  class nC {
    constructor(e, t = !1) {
      if (
        ((this.url = e),
        (this.disableProviderPing = t),
        (this.events = new o.EventEmitter()),
        (this.isAvailable = !1),
        (this.registering = !1),
        !nw(e))
      )
        throw Error(
          `Provided URL is not compatible with HTTP connection: ${e}`,
        );
      ((this.url = e), (this.disableProviderPing = t));
    }
    get connected() {
      return this.isAvailable;
    }
    get connecting() {
      return this.registering;
    }
    on(e, t) {
      this.events.on(e, t);
    }
    once(e, t) {
      this.events.once(e, t);
    }
    off(e, t) {
      this.events.off(e, t);
    }
    removeListener(e, t) {
      this.events.removeListener(e, t);
    }
    async open(e = this.url) {
      await this.register(e);
    }
    async close() {
      if (!this.isAvailable) throw Error("Connection already closed");
      this.onClose();
    }
    async send(e) {
      this.isAvailable || (await this.register());
      try {
        let t,
          r,
          n = S(e),
          i = await (
            await (0, n_.default)(
              this.url,
              ((t = nN({}, nU)), (r = { body: n }), nS(t, nA(r))),
            )
          ).json();
        this.onPayload({ data: i });
      } catch (t) {
        this.onError(e.id, t);
      }
    }
    async register(e = this.url) {
      if (!nw(e))
        throw Error(
          `Provided URL is not compatible with HTTP connection: ${e}`,
        );
      if (this.registering) {
        let e = this.events.getMaxListeners();
        return (
          (this.events.listenerCount("register_error") >= e ||
            this.events.listenerCount("open") >= e) &&
            this.events.setMaxListeners(e + 1),
          new Promise((e, t) => {
            (this.events.once("register_error", (e) => {
              (this.resetMaxListeners(), t(e));
            }),
              this.events.once("open", () => {
                if ((this.resetMaxListeners(), typeof this.isAvailable > "u"))
                  return t(Error("HTTP connection is missing or invalid"));
                e();
              }));
          })
        );
      }
      ((this.url = e), (this.registering = !0));
      try {
        if (!this.disableProviderPing) {
          let t,
            r,
            n = S({ id: 1, jsonrpc: "2.0", method: "test", params: [] });
          await (0, n_.default)(
            e,
            ((t = nN({}, nU)), (r = { body: n }), nS(t, nA(r))),
          );
        }
        this.onOpen();
      } catch (t) {
        let e = this.parseError(t);
        throw (this.events.emit("register_error", e), this.onClose(), e);
      }
    }
    onOpen() {
      ((this.isAvailable = !0),
        (this.registering = !1),
        this.events.emit("open"));
    }
    onClose() {
      ((this.isAvailable = !1),
        (this.registering = !1),
        this.events.emit("close"));
    }
    onPayload(e) {
      if (typeof e.data > "u") return;
      let t = "string" == typeof e.data ? O(e.data) : e.data;
      this.events.emit("payload", t);
    }
    onError(e, t) {
      let r = this.parseError(t),
        n = nd(e, r.message || r.toString());
      this.events.emit("payload", n);
    }
    parseError(e, t = this.url) {
      return nl(e, t, "HTTP");
    }
    resetMaxListeners() {
      this.events.getMaxListeners() > 10 && this.events.setMaxListeners(10);
    }
  }
  e.s(["t", 0, nC, "U", 0, nC], 700545);
};
