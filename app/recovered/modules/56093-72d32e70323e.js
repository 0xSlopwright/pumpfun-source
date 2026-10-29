// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  Object.defineProperty(n, "__esModule", { value: !0 });
  var r = {
    bindSnapshot: function () {
      return c;
    },
    createAsyncLocalStorage: function () {
      return s;
    },
    createSnapshot: function () {
      return f;
    },
    getOrCreateGlobalAsyncLocalStorage: function () {
      return u;
    },
  };
  for (var a in r) Object.defineProperty(n, a, { enumerable: !0, get: r[a] });
  let i = Error(
    "Invariant: AsyncLocalStorage accessed in runtime where it is not available",
  );
  class l {
    disable() {
      throw i;
    }
    getStore() {}
    run() {
      throw i;
    }
    exit() {
      throw i;
    }
    enterWith() {
      throw i;
    }
    static bind(e) {
      return e;
    }
  }
  let o = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
  function s() {
    return o ? new o() : new l();
  }
  function u(e) {
    let t = Symbol.for(`@next/${e}@16.4.1`),
      n = globalThis;
    return (n[t] ??= s());
  }
  function c(e) {
    return o ? o.bind(e) : l.bind(e);
  }
  function f() {
    return o
      ? o.snapshot()
      : function (e, ...t) {
          return e(...t);
        };
  }
};
