// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let { format: n, inspect: i } = e.r(478968),
    { AggregateError: o } = e.r(763323),
    a = globalThis.AggregateError || o,
    s = Symbol("kIsNodeError"),
    l = [
      "string",
      "function",
      "number",
      "object",
      "Function",
      "Object",
      "boolean",
      "bigint",
      "symbol",
    ],
    u = /^([A-Z][a-z0-9]*)+$/,
    d = {};
  function c(e, t) {
    if (!e) throw new d.ERR_INTERNAL_ASSERTION(t);
  }
  function f(e) {
    let t = "",
      r = e.length,
      n = +("-" === e[0]);
    for (; r >= n + 4; r -= 3) t = `_${e.slice(r - 3, r)}${t}`;
    return `${e.slice(0, r)}${t}`;
  }
  function h(e, t, r) {
    r || (r = Error);
    class i extends r {
      constructor(...r) {
        super(
          (function (e, t, r) {
            if ("function" == typeof t)
              return (
                c(
                  t.length <= r.length,
                  `Code: ${e}; The provided arguments length (${r.length}) does not match the required ones (${t.length}).`,
                ),
                t(...r)
              );
            let i = (t.match(/%[dfijoOs]/g) || []).length;
            return (c(
              i === r.length,
              `Code: ${e}; The provided arguments length (${r.length}) does not match the required ones (${i}).`,
            ),
            0 === r.length)
              ? t
              : n(t, ...r);
          })(e, t, r),
        );
      }
      toString() {
        return `${this.name} [${e}]: ${this.message}`;
      }
    }
    (Object.defineProperties(i.prototype, {
      name: { value: r.name, writable: !0, enumerable: !1, configurable: !0 },
      toString: {
        value() {
          return `${this.name} [${e}]: ${this.message}`;
        },
        writable: !0,
        enumerable: !1,
        configurable: !0,
      },
    }),
      (i.prototype.code = e),
      (i.prototype[s] = !0),
      (d[e] = i));
  }
  function p(e) {
    let t = "__node_internal_" + e.name;
    return (Object.defineProperty(e, "name", { value: t }), e);
  }
  (h("ERR_ASSERTION", "%s", Error),
    h(
      "ERR_INVALID_ARG_TYPE",
      (e, t, r) => {
        (c("string" == typeof e, "'name' must be a string"),
          Array.isArray(t) || (t = [t]));
        let n = "The ";
        (e.endsWith(" argument")
          ? (n += `${e} `)
          : (n += `"${e}" ${e.includes(".") ? "property" : "argument"} `),
          (n += "must be "));
        let o = [],
          a = [],
          s = [];
        for (let e of t)
          (c(
            "string" == typeof e,
            "All expected entries have to be of type string",
          ),
            l.includes(e)
              ? o.push(e.toLowerCase())
              : u.test(e)
                ? a.push(e)
                : (c(
                    "object" !== e,
                    'The value "object" should be written as "Object"',
                  ),
                  s.push(e)));
        if (a.length > 0) {
          let e = o.indexOf("object");
          -1 !== e && (o.splice(o, e, 1), a.push("Object"));
        }
        if (o.length > 0) {
          switch (o.length) {
            case 1:
              n += `of type ${o[0]}`;
              break;
            case 2:
              n += `one of type ${o[0]} or ${o[1]}`;
              break;
            default: {
              let e = o.pop();
              n += `one of type ${o.join(", ")}, or ${e}`;
            }
          }
          (a.length > 0 || s.length > 0) && (n += " or ");
        }
        if (a.length > 0) {
          switch (a.length) {
            case 1:
              n += `an instance of ${a[0]}`;
              break;
            case 2:
              n += `an instance of ${a[0]} or ${a[1]}`;
              break;
            default: {
              let e = a.pop();
              n += `an instance of ${a.join(", ")}, or ${e}`;
            }
          }
          s.length > 0 && (n += " or ");
        }
        switch (s.length) {
          case 0:
            break;
          case 1:
            (s[0].toLowerCase() !== s[0] && (n += "an "), (n += `${s[0]}`));
            break;
          case 2:
            n += `one of ${s[0]} or ${s[1]}`;
            break;
          default: {
            let e = s.pop();
            n += `one of ${s.join(", ")}, or ${e}`;
          }
        }
        if (null == r) n += `. Received ${r}`;
        else if ("function" == typeof r && r.name)
          n += `. Received function ${r.name}`;
        else if ("object" == typeof r) {
          var d;
          if (null != (d = r.constructor) && d.name)
            n += `. Received an instance of ${r.constructor.name}`;
          else {
            let e = i(r, { depth: -1 });
            n += `. Received ${e}`;
          }
        } else {
          let e = i(r, { colors: !1 });
          (e.length > 25 && (e = `${e.slice(0, 25)}...`),
            (n += `. Received type ${typeof r} (${e})`));
        }
        return n;
      },
      TypeError,
    ),
    h(
      "ERR_INVALID_ARG_VALUE",
      (e, t, r = "is invalid") => {
        let n = i(t);
        n.length > 128 && (n = n.slice(0, 128) + "...");
        let o = e.includes(".") ? "property" : "argument";
        return `The ${o} '${e}' ${r}. Received ${n}`;
      },
      TypeError,
    ),
    h(
      "ERR_INVALID_RETURN_VALUE",
      (e, t, r) => {
        var n;
        let i =
          null != r && null != (n = r.constructor) && n.name
            ? `instance of ${r.constructor.name}`
            : `type ${typeof r}`;
        return `Expected ${e} to be returned from the "${t}" function but got ${i}.`;
      },
      TypeError,
    ),
    h(
      "ERR_MISSING_ARGS",
      (...e) => {
        let t;
        c(e.length > 0, "At least one arg needs to be specified");
        let r = e.length;
        switch (
          ((e = (Array.isArray(e) ? e : [e]).map((e) => `"${e}"`).join(" or ")),
          r)
        ) {
          case 1:
            t += `The ${e[0]} argument`;
            break;
          case 2:
            t += `The ${e[0]} and ${e[1]} arguments`;
            break;
          default: {
            let r = e.pop();
            t += `The ${e.join(", ")}, and ${r} arguments`;
          }
        }
        return `${t} must be specified`;
      },
      TypeError,
    ),
    h(
      "ERR_OUT_OF_RANGE",
      (e, t, r) => {
        let n;
        if (
          (c(t, 'Missing "range" argument'),
          Number.isInteger(r) && Math.abs(r) > 0x100000000)
        )
          n = f(String(r));
        else if ("bigint" == typeof r) {
          n = String(r);
          let e = BigInt(2) ** BigInt(32);
          ((r > e || r < -e) && (n = f(n)), (n += "n"));
        } else n = i(r);
        return `The value of "${e}" is out of range. It must be ${t}. Received ${n}`;
      },
      RangeError,
    ),
    h("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error),
    h("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error),
    h(
      "ERR_STREAM_ALREADY_FINISHED",
      "Cannot call %s after a stream was finished",
      Error,
    ),
    h("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error),
    h(
      "ERR_STREAM_DESTROYED",
      "Cannot call %s after a stream was destroyed",
      Error,
    ),
    h(
      "ERR_STREAM_NULL_VALUES",
      "May not write null values to stream",
      TypeError,
    ),
    h("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error),
    h("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error),
    h(
      "ERR_STREAM_UNSHIFT_AFTER_END_EVENT",
      "stream.unshift() after end event",
      Error,
    ),
    h("ERR_STREAM_WRITE_AFTER_END", "write after end", Error),
    h("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError),
    (t.exports = {
      AbortError: class extends Error {
        constructor(e = "The operation was aborted", t) {
          if (void 0 !== t && "object" != typeof t)
            throw new d.ERR_INVALID_ARG_TYPE("options", "Object", t);
          (super(e, t), (this.code = "ABORT_ERR"), (this.name = "AbortError"));
        }
      },
      aggregateTwoErrors: p(function (e, t) {
        if (e && t && e !== t) {
          if (Array.isArray(t.errors)) return (t.errors.push(e), t);
          let r = new a([t, e], t.message);
          return ((r.code = t.code), r);
        }
        return e || t;
      }),
      hideStackFrames: p,
      codes: d,
    }));
};
