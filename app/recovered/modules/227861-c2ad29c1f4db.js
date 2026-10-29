// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  function i(t, e, r) {
    return e <= t && t <= r;
  }
  function n(t) {
    if (void 0 === t) return {};
    if (t === Object(t)) return t;
    throw TypeError("Could not convert argument to dictionary");
  }
  function s(t) {
    this.tokens = [].slice.call(t);
  }
  function o(t, e) {
    if (t) throw TypeError("Decoder error");
    return e || 65533;
  }
  s.prototype = {
    endOfStream: function () {
      return !this.tokens.length;
    },
    read: function () {
      return this.tokens.length ? this.tokens.shift() : -1;
    },
    prepend: function (t) {
      if (Array.isArray(t)) for (; t.length; ) this.tokens.unshift(t.pop());
      else this.tokens.unshift(t);
    },
    push: function (t) {
      if (Array.isArray(t)) for (; t.length; ) this.tokens.push(t.shift());
      else this.tokens.push(t);
    },
  };
  var a = "utf-8";
  function u(t, e) {
    if (!(this instanceof u)) return new u(t, e);
    if ((t = void 0 !== t ? String(t).toLowerCase() : a) !== a)
      throw Error("Encoding not supported. Only utf-8 is supported");
    ((e = n(e)),
      (this._streaming = !1),
      (this._BOMseen = !1),
      (this._decoder = null),
      (this._fatal = !!e.fatal),
      (this._ignoreBOM = !!e.ignoreBOM),
      Object.defineProperty(this, "encoding", { value: "utf-8" }),
      Object.defineProperty(this, "fatal", { value: this._fatal }),
      Object.defineProperty(this, "ignoreBOM", { value: this._ignoreBOM }));
  }
  function c(t, e) {
    if (!(this instanceof c)) return new c(t, e);
    if ((t = void 0 !== t ? String(t).toLowerCase() : a) !== a)
      throw Error("Encoding not supported. Only utf-8 is supported");
    ((e = n(e)),
      (this._streaming = !1),
      (this._encoder = null),
      (this._options = { fatal: !!e.fatal }),
      Object.defineProperty(this, "encoding", { value: "utf-8" }));
  }
  function l(t) {
    var e = t.fatal,
      r = 0,
      n = 0,
      s = 0,
      a = 128,
      u = 191;
    this.handler = function (t, c) {
      if (-1 === c && 0 !== s) return ((s = 0), o(e));
      if (-1 === c) return -1;
      if (0 === s) {
        if (i(c, 0, 127)) return c;
        if (i(c, 194, 223)) ((s = 1), (r = c - 192));
        else if (i(c, 224, 239))
          (224 === c && (a = 160),
            237 === c && (u = 159),
            (s = 2),
            (r = c - 224));
        else {
          if (!i(c, 240, 244)) return o(e);
          (240 === c && (a = 144),
            244 === c && (u = 143),
            (s = 3),
            (r = c - 240));
        }
        return ((r <<= 6 * s), null);
      }
      if (!i(c, a, u))
        return ((r = s = n = 0), (a = 128), (u = 191), t.prepend(c), o(e));
      if (
        ((a = 128),
        (u = 191),
        (n += 1),
        (r += (c - 128) << (6 * (s - n))),
        n !== s)
      )
        return null;
      var l = r;
      return ((r = s = n = 0), l);
    };
  }
  function h(t) {
    (t.fatal,
      (this.handler = function (t, e) {
        if (-1 === e) return -1;
        if (i(e, 0, 127)) return e;
        i(e, 128, 2047)
          ? ((r = 1), (n = 192))
          : i(e, 2048, 65535)
            ? ((r = 2), (n = 224))
            : i(e, 65536, 1114111) && ((r = 3), (n = 240));
        for (var r, n, s = [(e >> (6 * r)) + n]; r > 0; ) {
          var o = e >> (6 * (r - 1));
          (s.push(128 | (63 & o)), (r -= 1));
        }
        return s;
      }));
  }
  ((u.prototype = {
    decode: function (t, e) {
      ((r =
        "object" == typeof t && t instanceof ArrayBuffer
          ? new Uint8Array(t)
          : "object" == typeof t &&
              "buffer" in t &&
              t.buffer instanceof ArrayBuffer
            ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength)
            : new Uint8Array(0)),
        (e = n(e)),
        this._streaming ||
          ((this._decoder = new l({ fatal: this._fatal })),
          (this._BOMseen = !1)),
        (this._streaming = !!e.stream));
      for (
        var r, i, o = new s(r), a = [];
        !o.endOfStream() && -1 !== (i = this._decoder.handler(o, o.read()));

      )
        null !== i && (Array.isArray(i) ? a.push.apply(a, i) : a.push(i));
      if (!this._streaming) {
        do {
          if (-1 === (i = this._decoder.handler(o, o.read()))) break;
          if (null === i) continue;
          Array.isArray(i) ? a.push.apply(a, i) : a.push(i);
        } while (!o.endOfStream());
        this._decoder = null;
      }
      !a.length ||
        -1 === ["utf-8"].indexOf(this.encoding) ||
        this._ignoreBOM ||
        this._BOMseen ||
        (65279 === a[0]
          ? ((this._BOMseen = !0), a.shift())
          : (this._BOMseen = !0));
      for (var u = "", c = 0; c < a.length; ++c) {
        var h = a[c];
        h <= 65535
          ? (u += String.fromCharCode(h))
          : ((h -= 65536),
            (u += String.fromCharCode((h >> 10) + 55296, (1023 & h) + 56320)));
      }
      return u;
    },
  }),
    (c.prototype = {
      encode: function (t, e) {
        ((t = t ? String(t) : ""),
          (e = n(e)),
          this._streaming || (this._encoder = new h(this._options)),
          (this._streaming = !!e.stream));
        for (
          var r,
            i = [],
            o = new s(
              (function (t) {
                for (var e = String(t), r = e.length, i = 0, n = []; i < r; ) {
                  var s = e.charCodeAt(i);
                  if (s < 55296 || s > 57343) n.push(s);
                  else if (56320 <= s && s <= 57343) n.push(65533);
                  else if (55296 <= s && s <= 56319)
                    if (i === r - 1) n.push(65533);
                    else {
                      var o = t.charCodeAt(i + 1);
                      if (56320 <= o && o <= 57343) {
                        var a = 1023 & s,
                          u = 1023 & o;
                        (n.push(65536 + (a << 10) + u), (i += 1));
                      } else n.push(65533);
                    }
                  i += 1;
                }
                return n;
              })(t),
            );
          !o.endOfStream() && -1 !== (r = this._encoder.handler(o, o.read()));

        )
          Array.isArray(r) ? i.push.apply(i, r) : i.push(r);
        if (!this._streaming) {
          for (; -1 !== (r = this._encoder.handler(o, o.read())); )
            Array.isArray(r) ? i.push.apply(i, r) : i.push(r);
          this._encoder = null;
        }
        return new Uint8Array(i);
      },
    }),
    (r.TextEncoder = c),
    (r.TextDecoder = u));
};
