// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(344160),
    i = e.r(816217),
    d = i.assert;
  function a(e, t) {
    if (e instanceof a) return e;
    this._importDER(e, t) ||
      (d(e.r && e.s, "Signature without r or s"),
      (this.r = new r(e.r, 16)),
      (this.s = new r(e.s, 16)),
      void 0 === e.recoveryParam
        ? (this.recoveryParam = null)
        : (this.recoveryParam = e.recoveryParam));
  }
  function n() {
    this.place = 0;
  }
  function c(e, t) {
    var f = e[t.place++];
    if (!(128 & f)) return f;
    var r = 15 & f;
    if (0 === r || r > 4 || 0 === e[t.place]) return !1;
    for (var i = 0, d = 0, a = t.place; d < r; d++, a++)
      ((i <<= 8), (i |= e[a]), (i >>>= 0));
    return !(i <= 127) && ((t.place = a), i);
  }
  function h(e) {
    for (var t = 0, f = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < f; )
      t++;
    return 0 === t ? e : e.slice(t);
  }
  function s(e, t) {
    if (t < 128) return void e.push(t);
    var f = 1 + ((Math.log(t) / Math.LN2) >>> 3);
    for (e.push(128 | f); --f; ) e.push((t >>> (f << 3)) & 255);
    e.push(t);
  }
  ((t.exports = a),
    (a.prototype._importDER = function (e, t) {
      e = i.toArray(e, t);
      var f = new n();
      if (48 !== e[f.place++]) return !1;
      var d = c(e, f);
      if (!1 === d || d + f.place !== e.length || 2 !== e[f.place++]) return !1;
      var a = c(e, f);
      if (!1 === a || (128 & e[f.place]) != 0) return !1;
      var h = e.slice(f.place, a + f.place);
      if (((f.place += a), 2 !== e[f.place++])) return !1;
      var s = c(e, f);
      if (!1 === s || e.length !== s + f.place || (128 & e[f.place]) != 0)
        return !1;
      var o = e.slice(f.place, s + f.place);
      if (0 === h[0])
        if (!(128 & h[1])) return !1;
        else h = h.slice(1);
      if (0 === o[0])
        if (!(128 & o[1])) return !1;
        else o = o.slice(1);
      return (
        (this.r = new r(h)),
        (this.s = new r(o)),
        (this.recoveryParam = null),
        !0
      );
    }),
    (a.prototype.toDER = function (e) {
      var t = this.r.toArray(),
        f = this.s.toArray();
      for (
        128 & t[0] && (t = [0].concat(t)),
          128 & f[0] && (f = [0].concat(f)),
          t = h(t),
          f = h(f);
        !f[0] && !(128 & f[1]);

      )
        f = f.slice(1);
      var r = [2];
      (s(r, t.length), (r = r.concat(t)).push(2), s(r, f.length));
      var d = r.concat(f),
        a = [48];
      return (s(a, d.length), (a = a.concat(d)), i.encode(a, e));
    }));
};
