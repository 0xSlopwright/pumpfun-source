// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = "[big.js] ",
    r = e + "Invalid ",
    i = r + "decimal places",
    n = r + "rounding mode",
    s = e + "Division by zero",
    o = {},
    u = void 0,
    f = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
  function c(t, e, r, i) {
    var s = t.c;
    if (
      (r === u && (r = t.constructor.RM),
      0 !== r && 1 !== r && 2 !== r && 3 !== r)
    )
      throw Error(n);
    if (e < 1)
      ((i =
        (3 === r && (i || !!s[0])) ||
        (0 === e &&
          ((1 === r && s[0] >= 5) ||
            (2 === r && (s[0] > 5 || (5 === s[0] && (i || s[1] !== u))))))),
        (s.length = 1),
        i ? ((t.e = t.e - e + 1), (s[0] = 1)) : (s[0] = t.e = 0));
    else if (e < s.length) {
      if (
        ((i =
          (1 === r && s[e] >= 5) ||
          (2 === r &&
            (s[e] > 5 ||
              (5 === s[e] && (i || s[e + 1] !== u || 1 & s[e - 1])))) ||
          (3 === r && (i || !!s[0]))),
        (s.length = e),
        i)
      ) {
        for (; ++s[--e] > 9; )
          if (((s[e] = 0), 0 === e)) {
            (++t.e, s.unshift(1));
            break;
          }
      }
      for (e = s.length; !s[--e]; ) s.pop();
    }
    return t;
  }
  function h(t, e, r) {
    var i = t.e,
      n = t.c.join(""),
      s = n.length;
    if (e)
      n =
        n.charAt(0) +
        (s > 1 ? "." + n.slice(1) : "") +
        (i < 0 ? "e" : "e+") +
        i;
    else if (i < 0) {
      for (; ++i; ) n = "0" + n;
      n = "0." + n;
    } else if (i > 0)
      if (++i > s) for (i -= s; i--; ) n += "0";
      else i < s && (n = n.slice(0, i) + "." + n.slice(i));
    else s > 1 && (n = n.charAt(0) + "." + n.slice(1));
    return t.s < 0 && r ? "-" + n : n;
  }
  ((o.abs = function () {
    var t = new this.constructor(this);
    return ((t.s = 1), t);
  }),
    (o.cmp = function (t) {
      var e,
        r = this.c,
        i = (t = new this.constructor(t)).c,
        n = this.s,
        s = t.s,
        o = this.e,
        u = t.e;
      if (!r[0] || !i[0]) return r[0] ? n : i[0] ? -s : 0;
      if (n != s) return n;
      if (((e = n < 0), o != u)) return (o > u) ^ e ? 1 : -1;
      for (s = (o = r.length) < (u = i.length) ? o : u, n = -1; ++n < s; )
        if (r[n] != i[n]) return (r[n] > i[n]) ^ e ? 1 : -1;
      return o == u ? 0 : (o > u) ^ e ? 1 : -1;
    }),
    (o.div = function (t) {
      var e = this.constructor,
        r = this.c,
        n = (t = new e(t)).c,
        o = this.s == t.s ? 1 : -1,
        f = e.DP;
      if (f !== ~~f || f < 0 || f > 1e6) throw Error(i);
      if (!n[0]) throw Error(s);
      if (!r[0]) return ((t.s = o), (t.c = [(t.e = 0)]), t);
      var h,
        l,
        a,
        d,
        g,
        p = n.slice(),
        w = (h = n.length),
        v = r.length,
        m = r.slice(0, h),
        E = m.length,
        N = t,
        b = (N.c = []),
        A = 0,
        y = f + (N.e = this.e - t.e) + 1;
      for (N.s = o, o = y < 0 ? 0 : y, p.unshift(0); E++ < h; ) m.push(0);
      do {
        for (a = 0; a < 10; a++) {
          if (h != (E = m.length)) d = h > E ? 1 : -1;
          else
            for (g = -1, d = 0; ++g < h; )
              if (n[g] != m[g]) {
                d = n[g] > m[g] ? 1 : -1;
                break;
              }
          if (d < 0) {
            for (l = E == h ? n : p; E; ) {
              if (m[--E] < l[E]) {
                for (g = E; g && !m[--g]; ) m[g] = 9;
                (--m[g], (m[E] += 10));
              }
              m[E] -= l[E];
            }
            for (; !m[0]; ) m.shift();
          } else break;
        }
        ((b[A++] = d ? a : ++a), m[0] && d ? (m[E] = r[w] || 0) : (m = [r[w]]));
      } while ((w++ < v || m[0] !== u) && o--);
      return (
        !b[0] && 1 != A && (b.shift(), N.e--, y--),
        A > y && c(N, y, e.RM, m[0] !== u),
        N
      );
    }),
    (o.eq = function (t) {
      return 0 === this.cmp(t);
    }),
    (o.gt = function (t) {
      return this.cmp(t) > 0;
    }),
    (o.gte = function (t) {
      return this.cmp(t) > -1;
    }),
    (o.lt = function (t) {
      return 0 > this.cmp(t);
    }),
    (o.lte = function (t) {
      return 1 > this.cmp(t);
    }),
    (o.minus = o.sub =
      function (t) {
        var e,
          r,
          i,
          n,
          s = this.constructor,
          o = this.s,
          u = (t = new s(t)).s;
        if (o != u) return ((t.s = -u), this.plus(t));
        var f = this.c.slice(),
          c = this.e,
          h = t.c,
          l = t.e;
        if (!f[0] || !h[0])
          return (h[0] ? (t.s = -u) : f[0] ? (t = new s(this)) : (t.s = 1), t);
        if ((o = c - l)) {
          for (
            (n = o < 0) ? ((o = -o), (i = f)) : ((l = c), (i = h)),
              i.reverse(),
              u = o;
            u--;

          )
            i.push(0);
          i.reverse();
        } else
          for (
            r = ((n = f.length < h.length) ? f : h).length, o = u = 0;
            u < r;
            u++
          )
            if (f[u] != h[u]) {
              n = f[u] < h[u];
              break;
            }
        if (
          (n && ((i = f), (f = h), (h = i), (t.s = -t.s)),
          (u = (r = h.length) - (e = f.length)) > 0)
        )
          for (; u--; ) f[e++] = 0;
        for (u = e; r > o; ) {
          if (f[--r] < h[r]) {
            for (e = r; e && !f[--e]; ) f[e] = 9;
            (--f[e], (f[r] += 10));
          }
          f[r] -= h[r];
        }
        for (; 0 === f[--u]; ) f.pop();
        for (; 0 === f[0]; ) (f.shift(), --l);
        return (f[0] || ((t.s = 1), (f = [(l = 0)])), (t.c = f), (t.e = l), t);
      }),
    (o.mod = function (t) {
      var e,
        r = this,
        i = r.constructor,
        n = r.s,
        o = (t = new i(t)).s;
      if (!t.c[0]) throw Error(s);
      return ((r.s = t.s = 1), (e = 1 == t.cmp(r)), (r.s = n), (t.s = o), e)
        ? new i(r)
        : ((n = i.DP),
          (o = i.RM),
          (i.DP = i.RM = 0),
          (r = r.div(t)),
          (i.DP = n),
          (i.RM = o),
          this.minus(r.times(t)));
    }),
    (o.neg = function () {
      var t = new this.constructor(this);
      return ((t.s = -t.s), t);
    }),
    (o.plus = o.add =
      function (t) {
        var e,
          r,
          i,
          n = this.constructor;
        if (((t = new n(t)), this.s != t.s))
          return ((t.s = -t.s), this.minus(t));
        var s = this.e,
          o = this.c,
          u = t.e,
          f = t.c;
        if (!o[0] || !f[0])
          return (f[0] || (o[0] ? (t = new n(this)) : (t.s = this.s)), t);
        if (((o = o.slice()), (e = s - u))) {
          for (
            e > 0 ? ((u = s), (i = f)) : ((e = -e), (i = o)), i.reverse();
            e--;

          )
            i.push(0);
          i.reverse();
        }
        for (
          o.length - f.length < 0 && ((i = f), (f = o), (o = i)),
            e = f.length,
            r = 0;
          e;
          o[e] %= 10
        )
          r = ((o[--e] = o[e] + f[e] + r) / 10) | 0;
        for (r && (o.unshift(r), ++u), e = o.length; 0 === o[--e]; ) o.pop();
        return ((t.c = o), (t.e = u), t);
      }),
    (o.pow = function (t) {
      var e = this,
        i = new e.constructor("1"),
        n = i,
        s = t < 0;
      if (t !== ~~t || t < -1e6 || t > 1e6) throw Error(r + "exponent");
      for (s && (t = -t); 1 & t && (n = n.times(e)), (t >>= 1); )
        e = e.times(e);
      return s ? i.div(n) : n;
    }),
    (o.prec = function (t, e) {
      if (t !== ~~t || t < 1 || t > 1e6) throw Error(r + "precision");
      return c(new this.constructor(this), t, e);
    }),
    (o.round = function (t, e) {
      if (t === u) t = 0;
      else if (t !== ~~t || t < -1e6 || t > 1e6) throw Error(i);
      return c(new this.constructor(this), t + this.e + 1, e);
    }),
    (o.sqrt = function () {
      var t,
        r,
        i,
        n = this.constructor,
        s = this.s,
        o = this.e,
        u = new n("0.5");
      if (!this.c[0]) return new n(this);
      if (s < 0) throw Error(e + "No square root");
      (0 === (s = Math.sqrt(+h(this, !0, !0))) || 1 / 0 === s
        ? (((r = this.c.join("")).length + o) & 1 || (r += "0"),
          (o = (((o + 1) / 2) | 0) - (o < 0 || 1 & o)),
          (t = new n(
            (1 / 0 == (s = Math.sqrt(r))
              ? "5e"
              : (s = s.toExponential()).slice(0, s.indexOf("e") + 1)) + o,
          )))
        : (t = new n(s + "")),
        (o = t.e + (n.DP += 4)));
      do ((i = t), (t = u.times(i.plus(this.div(i)))));
      while (i.c.slice(0, o).join("") !== t.c.slice(0, o).join(""));
      return c(t, (n.DP -= 4) + t.e + 1, n.RM);
    }),
    (o.times = o.mul =
      function (t) {
        var e,
          r = this.constructor,
          i = this.c,
          n = (t = new r(t)).c,
          s = i.length,
          o = n.length,
          u = this.e,
          f = t.e;
        if (((t.s = this.s == t.s ? 1 : -1), !i[0] || !n[0]))
          return ((t.c = [(t.e = 0)]), t);
        for (
          t.e = u + f,
            s < o && ((e = i), (i = n), (n = e), (f = s), (s = o), (o = f)),
            e = Array((f = s + o));
          f--;

        )
          e[f] = 0;
        for (u = o; u--; ) {
          for (o = 0, f = s + u; f > u; )
            ((o = e[f] + n[u] * i[f - u - 1] + o),
              (e[f--] = o % 10),
              (o = (o / 10) | 0));
          e[f] = o;
        }
        for (o ? ++t.e : e.shift(), u = e.length; !e[--u]; ) e.pop();
        return ((t.c = e), t);
      }),
    (o.toExponential = function (t, e) {
      var r = this,
        n = r.c[0];
      if (t !== u) {
        if (t !== ~~t || t < 0 || t > 1e6) throw Error(i);
        for (r = c(new r.constructor(r), ++t, e); r.c.length < t; ) r.c.push(0);
      }
      return h(r, !0, !!n);
    }),
    (o.toFixed = function (t, e) {
      var r = this,
        n = r.c[0];
      if (t !== u) {
        if (t !== ~~t || t < 0 || t > 1e6) throw Error(i);
        for (
          r = c(new r.constructor(r), t + r.e + 1, e), t = t + r.e + 1;
          r.c.length < t;

        )
          r.c.push(0);
      }
      return h(r, !1, !!n);
    }),
    (o[Symbol.for("nodejs.util.inspect.custom")] =
      o.toJSON =
      o.toString =
        function () {
          var t = this.constructor;
          return h(this, this.e <= t.NE || this.e >= t.PE, !!this.c[0]);
        }),
    (o.toNumber = function () {
      var t = +h(this, !0, !0);
      if (!0 === this.constructor.strict && !this.eq(t.toString()))
        throw Error(e + "Imprecise conversion");
      return t;
    }),
    (o.toPrecision = function (t, e) {
      var i = this,
        n = i.constructor,
        s = i.c[0];
      if (t !== u) {
        if (t !== ~~t || t < 1 || t > 1e6) throw Error(r + "precision");
        for (i = c(new n(i), t, e); i.c.length < t; ) i.c.push(0);
      }
      return h(i, t <= i.e || i.e <= n.NE || i.e >= n.PE, !!s);
    }),
    (o.valueOf = function () {
      var t = this.constructor;
      if (!0 === t.strict) throw Error(e + "valueOf disallowed");
      return h(this, this.e <= t.NE || this.e >= t.PE, !0);
    }));
  var l = (function t() {
    function e(i) {
      if (!(this instanceof e)) return i === u ? t() : new e(i);
      if (i instanceof e)
        ((this.s = i.s), (this.e = i.e), (this.c = i.c.slice()));
      else {
        if ("string" != typeof i) {
          if (!0 === e.strict && "bigint" != typeof i)
            throw TypeError(r + "value");
          i = 0 === i && 1 / i < 0 ? "-0" : String(i);
        }
        !(function (t, e) {
          var i, n, s;
          if (!f.test(e)) throw Error(r + "number");
          for (
            t.s = "-" == e.charAt(0) ? ((e = e.slice(1)), -1) : 1,
              (i = e.indexOf(".")) > -1 && (e = e.replace(".", "")),
              (n = e.search(/e/i)) > 0
                ? (i < 0 && (i = n),
                  (i += +e.slice(n + 1)),
                  (e = e.substring(0, n)))
                : i < 0 && (i = e.length),
              s = e.length,
              n = 0;
            n < s && "0" == e.charAt(n);

          )
            ++n;
          if (n == s) t.c = [(t.e = 0)];
          else {
            for (; s > 0 && "0" == e.charAt(--s); );
            for (t.e = i - n - 1, t.c = [], i = 0; n <= s; )
              t.c[i++] = +e.charAt(n++);
          }
        })(this, i);
      }
      this.constructor = e;
    }
    return (
      (e.prototype = o),
      (e.DP = 20),
      (e.RM = 1),
      (e.NE = -7),
      (e.PE = 21),
      (e.strict = !1),
      (e.roundDown = 0),
      (e.roundHalfUp = 1),
      (e.roundHalfEven = 2),
      (e.roundUp = 3),
      e
    );
  })();
  t.s(["f", 0, l]);
};
