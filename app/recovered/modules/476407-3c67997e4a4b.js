// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  let i = t.r(539451).v4,
    n = t.r(842973),
    s = function (t, e) {
      if (!(this instanceof s)) return new s(t, e);
      (e || (e = {}),
        (this.options = {
          reviver: void 0 !== e.reviver ? e.reviver : null,
          replacer: void 0 !== e.replacer ? e.replacer : null,
          generator:
            void 0 !== e.generator
              ? e.generator
              : function () {
                  return i();
                },
          version: void 0 !== e.version ? e.version : 2,
          notificationIdNull:
            "boolean" == typeof e.notificationIdNull && e.notificationIdNull,
        }),
        (this.callServer = t));
    };
  ((e.exports = s),
    (s.prototype.request = function (t, e, r, i) {
      let s,
        o = this,
        a = null,
        u = Array.isArray(t) && "function" == typeof e;
      if (1 === this.options.version && u)
        throw TypeError("JSON-RPC 1.0 does not support batching");
      let c = !u && t && "object" == typeof t && "function" == typeof e;
      if (u || c) ((i = e), (a = t));
      else {
        "function" == typeof r && ((i = r), (r = void 0));
        let s = "function" == typeof i;
        try {
          a = n(t, e, r, {
            generator: this.options.generator,
            version: this.options.version,
            notificationIdNull: this.options.notificationIdNull,
          });
        } catch (t) {
          if (s) return void i(t);
          throw t;
        }
        if (!s) return a;
      }
      try {
        s = JSON.stringify(a, this.options.replacer);
      } catch (t) {
        i(t);
        return;
      }
      return (
        this.callServer(s, function (t, e) {
          o._parseResponse(t, e, i);
        }),
        a
      );
    }),
    (s.prototype._parseResponse = function (t, e, r) {
      let i;
      if (t) return void r(t);
      if (!e) return void r();
      try {
        i = JSON.parse(e, this.options.reviver);
      } catch (t) {
        r(t);
        return;
      }
      if (3 === r.length)
        if (!Array.isArray(i)) return void r(null, i.error, i.result);
        else {
          let t = function (t) {
            return void 0 !== t.error;
          };
          r(
            null,
            i.filter(t),
            i.filter(function (e) {
              return !t(e);
            }),
          );
          return;
        }
      r(null, i);
    }));
};
