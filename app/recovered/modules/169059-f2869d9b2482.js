// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.default = function (t) {
      if (t.length >= 255) throw TypeError("Alphabet too long");
      let e = new Uint8Array(256);
      for (let t = 0; t < e.length; t++) e[t] = 255;
      for (let r = 0; r < t.length; r++) {
        let i = t.charAt(r),
          n = i.charCodeAt(0);
        if (255 !== e[n]) throw TypeError(i + " is ambiguous");
        e[n] = r;
      }
      let r = t.length,
        i = t.charAt(0),
        n = Math.log(r) / Math.log(256),
        s = Math.log(256) / Math.log(r);
      function o(t) {
        if ("string" != typeof t) throw TypeError("Expected String");
        if (0 === t.length) return new Uint8Array();
        let s = 0,
          o = 0,
          a = 0;
        for (; t[s] === i; ) (o++, s++);
        let u = ((t.length - s) * n + 1) >>> 0,
          c = new Uint8Array(u);
        for (; s < t.length; ) {
          let i = t.charCodeAt(s);
          if (i > 255) return;
          let n = e[i];
          if (255 === n) return;
          let o = 0;
          for (let t = u - 1; (0 !== n || o < a) && -1 !== t; t--, o++)
            ((n += (r * c[t]) >>> 0),
              (c[t] = n % 256 >>> 0),
              (n = (n / 256) >>> 0));
          if (0 !== n) throw Error("Non-zero carry");
          ((a = o), s++);
        }
        let l = u - a;
        for (; l !== u && 0 === c[l]; ) l++;
        let h = new Uint8Array(o + (u - l)),
          f = o;
        for (; l !== u; ) h[f++] = c[l++];
        return h;
      }
      return {
        encode: function (e) {
          if (
            (e instanceof Uint8Array ||
              (ArrayBuffer.isView(e)
                ? (e = new Uint8Array(e.buffer, e.byteOffset, e.byteLength))
                : Array.isArray(e) && (e = Uint8Array.from(e))),
            !(e instanceof Uint8Array))
          )
            throw TypeError("Expected Uint8Array");
          if (0 === e.length) return "";
          let n = 0,
            o = 0,
            a = 0,
            u = e.length;
          for (; a !== u && 0 === e[a]; ) (a++, n++);
          let c = ((u - a) * s + 1) >>> 0,
            l = new Uint8Array(c);
          for (; a !== u; ) {
            let t = e[a],
              i = 0;
            for (let e = c - 1; (0 !== t || i < o) && -1 !== e; e--, i++)
              ((t += (256 * l[e]) >>> 0),
                (l[e] = t % r >>> 0),
                (t = (t / r) >>> 0));
            if (0 !== t) throw Error("Non-zero carry");
            ((o = i), a++);
          }
          let h = c - o;
          for (; h !== c && 0 === l[h]; ) h++;
          let f = i.repeat(n);
          for (; h < c; ++h) f += t.charAt(l[h]);
          return f;
        },
        decodeUnsafe: o,
        decode: function (t) {
          let e = o(t);
          if (e) return e;
          throw Error("Non-base" + r + " character");
        },
      };
    }));
};
