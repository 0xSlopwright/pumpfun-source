// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  ((r.byteLength = function (t) {
    var e = c(t),
      r = e[0],
      i = e[1];
    return ((r + i) * 3) / 4 - i;
  }),
    (r.toByteArray = function (t) {
      var e,
        r,
        i = c(t),
        o = i[0],
        a = i[1],
        u = new s(((o + a) * 3) / 4 - a),
        l = 0,
        h = a > 0 ? o - 4 : o;
      for (r = 0; r < h; r += 4)
        ((e =
          (n[t.charCodeAt(r)] << 18) |
          (n[t.charCodeAt(r + 1)] << 12) |
          (n[t.charCodeAt(r + 2)] << 6) |
          n[t.charCodeAt(r + 3)]),
          (u[l++] = (e >> 16) & 255),
          (u[l++] = (e >> 8) & 255),
          (u[l++] = 255 & e));
      return (
        2 === a &&
          ((e = (n[t.charCodeAt(r)] << 2) | (n[t.charCodeAt(r + 1)] >> 4)),
          (u[l++] = 255 & e)),
        1 === a &&
          ((e =
            (n[t.charCodeAt(r)] << 10) |
            (n[t.charCodeAt(r + 1)] << 4) |
            (n[t.charCodeAt(r + 2)] >> 2)),
          (u[l++] = (e >> 8) & 255),
          (u[l++] = 255 & e)),
        u
      );
    }),
    (r.fromByteArray = function (t) {
      for (
        var e, r = t.length, n = r % 3, s = [], o = 0, a = r - n;
        o < a;
        o += 16383
      )
        s.push(
          (function (t, e, r) {
            for (var n, s = [], o = e; o < r; o += 3)
              ((n =
                ((t[o] << 16) & 0xff0000) +
                ((t[o + 1] << 8) & 65280) +
                (255 & t[o + 2])),
                s.push(
                  i[(n >> 18) & 63] +
                    i[(n >> 12) & 63] +
                    i[(n >> 6) & 63] +
                    i[63 & n],
                ));
            return s.join("");
          })(t, o, o + 16383 > a ? a : o + 16383),
        );
      return (
        1 === n
          ? s.push(i[(e = t[r - 1]) >> 2] + i[(e << 4) & 63] + "==")
          : 2 === n &&
            s.push(
              i[(e = (t[r - 2] << 8) + t[r - 1]) >> 10] +
                i[(e >> 4) & 63] +
                i[(e << 2) & 63] +
                "=",
            ),
        s.join("")
      );
    }));
  for (
    var i = [],
      n = [],
      s = "u" > typeof Uint8Array ? Uint8Array : Array,
      o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      a = 0,
      u = o.length;
    a < u;
    ++a
  )
    ((i[a] = o[a]), (n[o.charCodeAt(a)] = a));
  function c(t) {
    var e = t.length;
    if (e % 4 > 0)
      throw Error("Invalid string. Length must be a multiple of 4");
    var r = t.indexOf("=");
    -1 === r && (r = e);
    var i = r === e ? 0 : 4 - (r % 4);
    return [r, i];
  }
  ((n[45] = 62), (n[95] = 63));
};
