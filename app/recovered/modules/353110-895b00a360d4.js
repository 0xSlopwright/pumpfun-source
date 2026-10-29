// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  let e, r, n, i, o, s;
  var a,
    u,
    l,
    h,
    c,
    d,
    f,
    p,
    m,
    _ = t.i(753887),
    g = t.i(424509),
    y = t.i(971370),
    w = t.i(259390),
    v = t.i(344048),
    b = t.i(937307),
    R = t.i(26984),
    E = t.i(403893);
  function A(t) {
    let e = t.length;
    for (; --e >= 0; ) t[e] = 0;
  }
  let O = 573,
    T = new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5,
      5, 5, 5, 0,
    ]),
    N = new Uint8Array([
      0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10,
      11, 11, 12, 12, 13, 13,
    ]),
    M = new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7,
    ]),
    I = new Uint8Array([
      16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
    ]),
    x = Array(576);
  A(x);
  let C = Array(60);
  A(C);
  let S = Array(512);
  A(S);
  let k = Array(256);
  A(k);
  let L = Array(29);
  A(L);
  let D = Array(30);
  function P(t, e, r, n, i) {
    ((this.static_tree = t),
      (this.extra_bits = e),
      (this.extra_base = r),
      (this.elems = n),
      (this.max_length = i),
      (this.has_stree = t && t.length));
  }
  function U(t, e) {
    ((this.dyn_tree = t), (this.max_code = 0), (this.stat_desc = e));
  }
  A(D);
  let B = (t) => (t < 256 ? S[t] : S[256 + (t >>> 7)]),
    z = (t, e) => {
      ((t.pending_buf[t.pending++] = 255 & e),
        (t.pending_buf[t.pending++] = (e >>> 8) & 255));
    },
    H = (t, e, r) => {
      t.bi_valid > 16 - r
        ? ((t.bi_buf |= (e << t.bi_valid) & 65535),
          z(t, t.bi_buf),
          (t.bi_buf = e >> (16 - t.bi_valid)),
          (t.bi_valid += r - 16))
        : ((t.bi_buf |= (e << t.bi_valid) & 65535), (t.bi_valid += r));
    },
    G = (t, e, r) => {
      H(t, r[2 * e], r[2 * e + 1]);
    },
    j = (t, e) => {
      let r = 0;
      do ((r |= 1 & t), (t >>>= 1), (r <<= 1));
      while (--e > 0);
      return r >>> 1;
    },
    V = (t, e, r) => {
      let n,
        i,
        o = Array(16),
        s = 0;
      for (n = 1; n <= 15; n++) ((s = (s + r[n - 1]) << 1), (o[n] = s));
      for (i = 0; i <= e; i++) {
        let e = t[2 * i + 1];
        0 !== e && (t[2 * i] = j(o[e]++, e));
      }
    },
    F = (t) => {
      let e;
      for (e = 0; e < 286; e++) t.dyn_ltree[2 * e] = 0;
      for (e = 0; e < 30; e++) t.dyn_dtree[2 * e] = 0;
      for (e = 0; e < 19; e++) t.bl_tree[2 * e] = 0;
      ((t.dyn_ltree[512] = 1),
        (t.opt_len = t.static_len = 0),
        (t.sym_next = t.matches = 0));
    },
    K = (t) => {
      (t.bi_valid > 8
        ? z(t, t.bi_buf)
        : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf),
        (t.bi_buf = 0),
        (t.bi_valid = 0));
    },
    Z = (t, e, r, n) => {
      let i = 2 * e,
        o = 2 * r;
      return t[i] < t[o] || (t[i] === t[o] && n[e] <= n[r]);
    },
    q = (t, e, r) => {
      let n = t.heap[r],
        i = r << 1;
      for (
        ;
        i <= t.heap_len &&
        (i < t.heap_len && Z(e, t.heap[i + 1], t.heap[i], t.depth) && i++,
        !Z(e, n, t.heap[i], t.depth));

      )
        ((t.heap[r] = t.heap[i]), (r = i), (i <<= 1));
      t.heap[r] = n;
    },
    $ = (t, e, r) => {
      let n,
        i,
        o,
        s,
        a = 0;
      if (0 !== t.sym_next)
        do
          ((n =
            (255 & t.pending_buf[t.sym_buf + a++]) +
            ((255 & t.pending_buf[t.sym_buf + a++]) << 8)),
            (i = t.pending_buf[t.sym_buf + a++]),
            0 === n
              ? G(t, i, e)
              : (G(t, (o = k[i]) + 256 + 1, e),
                0 !== (s = T[o]) && H(t, (i -= L[o]), s),
                G(t, (o = B(--n)), r),
                0 !== (s = N[o]) && H(t, (n -= D[o]), s)));
        while (a < t.sym_next);
      G(t, 256, e);
    },
    W = (t, e) => {
      let r,
        n,
        i,
        o = e.dyn_tree,
        s = e.stat_desc.static_tree,
        a = e.stat_desc.has_stree,
        u = e.stat_desc.elems,
        l = -1;
      for (t.heap_len = 0, t.heap_max = O, r = 0; r < u; r++)
        0 !== o[2 * r]
          ? ((t.heap[++t.heap_len] = l = r), (t.depth[r] = 0))
          : (o[2 * r + 1] = 0);
      for (; t.heap_len < 2; )
        ((o[2 * (i = t.heap[++t.heap_len] = l < 2 ? ++l : 0)] = 1),
          (t.depth[i] = 0),
          t.opt_len--,
          a && (t.static_len -= s[2 * i + 1]));
      for (e.max_code = l, r = t.heap_len >> 1; r >= 1; r--) q(t, o, r);
      i = u;
      do
        ((r = t.heap[1]),
          (t.heap[1] = t.heap[t.heap_len--]),
          q(t, o, 1),
          (n = t.heap[1]),
          (t.heap[--t.heap_max] = r),
          (t.heap[--t.heap_max] = n),
          (o[2 * i] = o[2 * r] + o[2 * n]),
          (t.depth[i] =
            (t.depth[r] >= t.depth[n] ? t.depth[r] : t.depth[n]) + 1),
          (o[2 * r + 1] = o[2 * n + 1] = i),
          (t.heap[1] = i++),
          q(t, o, 1));
      while (t.heap_len >= 2);
      ((t.heap[--t.heap_max] = t.heap[1]),
        ((t, e) => {
          let r,
            n,
            i,
            o,
            s,
            a,
            u = e.dyn_tree,
            l = e.max_code,
            h = e.stat_desc.static_tree,
            c = e.stat_desc.has_stree,
            d = e.stat_desc.extra_bits,
            f = e.stat_desc.extra_base,
            p = e.stat_desc.max_length,
            m = 0;
          for (o = 0; o <= 15; o++) t.bl_count[o] = 0;
          for (
            u[2 * t.heap[t.heap_max] + 1] = 0, r = t.heap_max + 1;
            r < O;
            r++
          )
            ((o = u[2 * u[2 * (n = t.heap[r]) + 1] + 1] + 1) > p &&
              ((o = p), m++),
              (u[2 * n + 1] = o),
              !(n > l) &&
                (t.bl_count[o]++,
                (s = 0),
                n >= f && (s = d[n - f]),
                (a = u[2 * n]),
                (t.opt_len += a * (o + s)),
                c && (t.static_len += a * (h[2 * n + 1] + s))));
          if (0 !== m) {
            do {
              for (o = p - 1; 0 === t.bl_count[o]; ) o--;
              (t.bl_count[o]--,
                (t.bl_count[o + 1] += 2),
                t.bl_count[p]--,
                (m -= 2));
            } while (m > 0);
            for (o = p; 0 !== o; o--)
              for (n = t.bl_count[o]; 0 !== n; )
                !((i = t.heap[--r]) > l) &&
                  (u[2 * i + 1] !== o &&
                    ((t.opt_len += (o - u[2 * i + 1]) * u[2 * i]),
                    (u[2 * i + 1] = o)),
                  n--);
          }
        })(t, e),
        V(o, l, t.bl_count));
    },
    X = (t, e, r) => {
      let n,
        i,
        o = -1,
        s = e[1],
        a = 0,
        u = 7,
        l = 4;
      for (
        0 === s && ((u = 138), (l = 3)), e[(r + 1) * 2 + 1] = 65535, n = 0;
        n <= r;
        n++
      )
        ((i = s),
          (s = e[(n + 1) * 2 + 1]),
          (++a < u && i === s) ||
            (a < l
              ? (t.bl_tree[2 * i] += a)
              : 0 !== i
                ? (i !== o && t.bl_tree[2 * i]++, t.bl_tree[32]++)
                : a <= 10
                  ? t.bl_tree[34]++
                  : t.bl_tree[36]++,
            (a = 0),
            (o = i),
            0 === s
              ? ((u = 138), (l = 3))
              : i === s
                ? ((u = 6), (l = 3))
                : ((u = 7), (l = 4))));
    },
    Y = (t, e, r) => {
      let n,
        i,
        o = -1,
        s = e[1],
        a = 0,
        u = 7,
        l = 4;
      for (0 === s && ((u = 138), (l = 3)), n = 0; n <= r; n++)
        if (((i = s), (s = e[(n + 1) * 2 + 1]), !(++a < u) || i !== s)) {
          if (a < l)
            do G(t, i, t.bl_tree);
            while (0 != --a);
          else
            0 !== i
              ? (i !== o && (G(t, i, t.bl_tree), a--),
                G(t, 16, t.bl_tree),
                H(t, a - 3, 2))
              : a <= 10
                ? (G(t, 17, t.bl_tree), H(t, a - 3, 3))
                : (G(t, 18, t.bl_tree), H(t, a - 11, 7));
          ((a = 0),
            (o = i),
            0 === s
              ? ((u = 138), (l = 3))
              : i === s
                ? ((u = 6), (l = 3))
                : ((u = 7), (l = 4)));
        }
    },
    Q = !1,
    J = (t, e, r, n) => {
      (H(t, 0 + +!!n, 3),
        K(t),
        z(t, r),
        z(t, ~r),
        r && t.pending_buf.set(t.window.subarray(e, e + r), t.pending),
        (t.pending += r));
    };
  var tt = {
      _tr_init: (t) => {
        (Q ||
          ((() => {
            let t,
              i,
              o,
              s,
              a,
              u = Array(16);
            for (s = 0, o = 0; s < 28; s++)
              for (L[s] = o, t = 0; t < 1 << T[s]; t++) k[o++] = s;
            for (k[o - 1] = s, a = 0, s = 0; s < 16; s++)
              for (D[s] = a, t = 0; t < 1 << N[s]; t++) S[a++] = s;
            for (a >>= 7; s < 30; s++)
              for (D[s] = a << 7, t = 0; t < 1 << (N[s] - 7); t++)
                S[256 + a++] = s;
            for (i = 0; i <= 15; i++) u[i] = 0;
            for (t = 0; t <= 143; ) ((x[2 * t + 1] = 8), t++, u[8]++);
            for (; t <= 255; ) ((x[2 * t + 1] = 9), t++, u[9]++);
            for (; t <= 279; ) ((x[2 * t + 1] = 7), t++, u[7]++);
            for (; t <= 287; ) ((x[2 * t + 1] = 8), t++, u[8]++);
            for (V(x, 287, u), t = 0; t < 30; t++)
              ((C[2 * t + 1] = 5), (C[2 * t] = j(t, 5)));
            ((e = new P(x, T, 257, 286, 15)),
              (r = new P(C, N, 0, 30, 15)),
              (n = new P([], M, 0, 19, 7)));
          })(),
          (Q = !0)),
          (t.l_desc = new U(t.dyn_ltree, e)),
          (t.d_desc = new U(t.dyn_dtree, r)),
          (t.bl_desc = new U(t.bl_tree, n)),
          (t.bi_buf = 0),
          (t.bi_valid = 0),
          F(t));
      },
      _tr_stored_block: J,
      _tr_flush_block: (t, e, r, n) => {
        let i,
          o,
          s = 0;
        (t.level > 0
          ? (2 === t.strm.data_type &&
              (t.strm.data_type = ((t) => {
                let e,
                  r = 0xf3ffc07f;
                for (e = 0; e <= 31; e++, r >>>= 1)
                  if (1 & r && 0 !== t.dyn_ltree[2 * e]) return 0;
                if (
                  0 !== t.dyn_ltree[18] ||
                  0 !== t.dyn_ltree[20] ||
                  0 !== t.dyn_ltree[26]
                )
                  return 1;
                for (e = 32; e < 256; e++)
                  if (0 !== t.dyn_ltree[2 * e]) return 1;
                return 0;
              })(t)),
            W(t, t.l_desc),
            W(t, t.d_desc),
            (s = ((t) => {
              let e;
              for (
                X(t, t.dyn_ltree, t.l_desc.max_code),
                  X(t, t.dyn_dtree, t.d_desc.max_code),
                  W(t, t.bl_desc),
                  e = 18;
                e >= 3 && 0 === t.bl_tree[2 * I[e] + 1];
                e--
              );
              return ((t.opt_len += 3 * (e + 1) + 5 + 5 + 4), e);
            })(t)),
            (i = (t.opt_len + 3 + 7) >>> 3),
            (o = (t.static_len + 3 + 7) >>> 3) <= i && (i = o))
          : (i = o = r + 5),
          r + 4 <= i && -1 !== e
            ? J(t, e, r, n)
            : 4 === t.strategy || o === i
              ? (H(t, 2 + +!!n, 3), $(t, x, C))
              : (H(t, 4 + +!!n, 3),
                ((t, e, r, n) => {
                  let i;
                  for (
                    H(t, e - 257, 5), H(t, r - 1, 5), H(t, n - 4, 4), i = 0;
                    i < n;
                    i++
                  )
                    H(t, t.bl_tree[2 * I[i] + 1], 3);
                  (Y(t, t.dyn_ltree, e - 1), Y(t, t.dyn_dtree, r - 1));
                })(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, s + 1),
                $(t, t.dyn_ltree, t.dyn_dtree)),
          F(t),
          n && K(t));
      },
      _tr_tally: (t, e, r) => (
        (t.pending_buf[t.sym_buf + t.sym_next++] = e),
        (t.pending_buf[t.sym_buf + t.sym_next++] = e >> 8),
        (t.pending_buf[t.sym_buf + t.sym_next++] = r),
        0 === e
          ? t.dyn_ltree[2 * r]++
          : (t.matches++,
            e--,
            t.dyn_ltree[(k[r] + 256 + 1) * 2]++,
            t.dyn_dtree[2 * B(e)]++),
        t.sym_next === t.sym_end
      ),
      _tr_align: (t) => {
        (H(t, 2, 3),
          G(t, 256, x),
          16 === t.bi_valid
            ? (z(t, t.bi_buf), (t.bi_buf = 0), (t.bi_valid = 0))
            : t.bi_valid >= 8 &&
              ((t.pending_buf[t.pending++] = 255 & t.bi_buf),
              (t.bi_buf >>= 8),
              (t.bi_valid -= 8)));
      },
    },
    te = (t, e, r, n) => {
      let i = 65535 & t,
        o = (t >>> 16) & 65535,
        s = 0;
      for (; 0 !== r; ) {
        ((s = r > 2e3 ? 2e3 : r), (r -= s));
        do o = (o + (i = (i + e[n++]) | 0)) | 0;
        while (--s);
        ((i %= 65521), (o %= 65521));
      }
      return i | (o << 16);
    };
  let tr = new Uint32Array(
    (() => {
      let t,
        e = [];
      for (var r = 0; r < 256; r++) {
        t = r;
        for (var n = 0; n < 8; n++)
          t = 1 & t ? 0xedb88320 ^ (t >>> 1) : t >>> 1;
        e[r] = t;
      }
      return e;
    })(),
  );
  var tn = (t, e, r, n) => {
      let i = n + r;
      t ^= -1;
      for (let r = n; r < i; r++) t = (t >>> 8) ^ tr[(t ^ e[r]) & 255];
      return -1 ^ t;
    },
    ti = {
      2: "need dictionary",
      1: "stream end",
      0: "",
      "-1": "file error",
      "-2": "stream error",
      "-3": "data error",
      "-4": "insufficient memory",
      "-5": "buffer error",
      "-6": "incompatible version",
    },
    to = {
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      Z_MEM_ERROR: -4,
      Z_BUF_ERROR: -5,
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      Z_BINARY: 0,
      Z_TEXT: 1,
      Z_UNKNOWN: 2,
      Z_DEFLATED: 8,
    };
  let {
      _tr_init: ts,
      _tr_stored_block: ta,
      _tr_flush_block: tu,
      _tr_tally: tl,
      _tr_align: th,
    } = tt,
    {
      Z_NO_FLUSH: tc,
      Z_PARTIAL_FLUSH: td,
      Z_FULL_FLUSH: tf,
      Z_FINISH: tp,
      Z_BLOCK: tm,
      Z_OK: t_,
      Z_STREAM_END: tg,
      Z_STREAM_ERROR: ty,
      Z_DATA_ERROR: tw,
      Z_BUF_ERROR: tv,
      Z_DEFAULT_COMPRESSION: tb,
      Z_FILTERED: tR,
      Z_HUFFMAN_ONLY: tE,
      Z_RLE: tA,
      Z_FIXED: tO,
      Z_DEFAULT_STRATEGY: tT,
      Z_UNKNOWN: tN,
      Z_DEFLATED: tM,
    } = to,
    tI = 573,
    tx = (t, e) => ((t.msg = ti[e]), e),
    tC = (t) => 2 * t - 9 * (t > 4),
    tS = (t) => {
      let e = t.length;
      for (; --e >= 0; ) t[e] = 0;
    },
    tk = (t) => {
      let e,
        r,
        n,
        i = t.w_size;
      n = e = t.hash_size;
      do ((r = t.head[--n]), (t.head[n] = r >= i ? r - i : 0));
      while (--e);
      n = e = i;
      do ((r = t.prev[--n]), (t.prev[n] = r >= i ? r - i : 0));
      while (--e);
    },
    tL = (t, e, r) => ((e << t.hash_shift) ^ r) & t.hash_mask,
    tD = (t) => {
      let e = t.state,
        r = e.pending;
      (r > t.avail_out && (r = t.avail_out),
        0 !== r &&
          (t.output.set(
            e.pending_buf.subarray(e.pending_out, e.pending_out + r),
            t.next_out,
          ),
          (t.next_out += r),
          (e.pending_out += r),
          (t.total_out += r),
          (t.avail_out -= r),
          (e.pending -= r),
          0 === e.pending && (e.pending_out = 0)));
    },
    tP = (t, e) => {
      (tu(
        t,
        t.block_start >= 0 ? t.block_start : -1,
        t.strstart - t.block_start,
        e,
      ),
        (t.block_start = t.strstart),
        tD(t.strm));
    },
    tU = (t, e) => {
      t.pending_buf[t.pending++] = e;
    },
    tB = (t, e) => {
      ((t.pending_buf[t.pending++] = (e >>> 8) & 255),
        (t.pending_buf[t.pending++] = 255 & e));
    },
    tz = (t, e, r, n) => {
      let i = t.avail_in;
      return (i > n && (i = n), 0 === i)
        ? 0
        : ((t.avail_in -= i),
          e.set(t.input.subarray(t.next_in, t.next_in + i), r),
          1 === t.state.wrap
            ? (t.adler = te(t.adler, e, i, r))
            : 2 === t.state.wrap && (t.adler = tn(t.adler, e, i, r)),
          (t.next_in += i),
          (t.total_in += i),
          i);
    },
    tH = (t, e) => {
      let r,
        n,
        i = t.max_chain_length,
        o = t.strstart,
        s = t.prev_length,
        a = t.nice_match,
        u = t.strstart > t.w_size - 262 ? t.strstart - (t.w_size - 262) : 0,
        l = t.window,
        h = t.w_mask,
        c = t.prev,
        d = t.strstart + 258,
        f = l[o + s - 1],
        p = l[o + s];
      (t.prev_length >= t.good_match && (i >>= 2),
        a > t.lookahead && (a = t.lookahead));
      do {
        if (
          l[(r = e) + s] !== p ||
          l[r + s - 1] !== f ||
          l[r] !== l[o] ||
          l[++r] !== l[o + 1]
        )
          continue;
        ((o += 2), r++);
        do;
        while (
          l[++o] === l[++r] &&
          l[++o] === l[++r] &&
          l[++o] === l[++r] &&
          l[++o] === l[++r] &&
          l[++o] === l[++r] &&
          l[++o] === l[++r] &&
          l[++o] === l[++r] &&
          l[++o] === l[++r] &&
          o < d
        );
        if (((n = 258 - (d - o)), (o = d - 258), n > s)) {
          if (((t.match_start = e), (s = n), n >= a)) break;
          ((f = l[o + s - 1]), (p = l[o + s]));
        }
      } while ((e = c[e & h]) > u && 0 != --i);
      return s <= t.lookahead ? s : t.lookahead;
    },
    tG = (t) => {
      let e,
        r,
        n,
        i = t.w_size;
      do {
        if (
          ((r = t.window_size - t.lookahead - t.strstart),
          t.strstart >= i + (i - 262) &&
            (t.window.set(t.window.subarray(i, i + i - r), 0),
            (t.match_start -= i),
            (t.strstart -= i),
            (t.block_start -= i),
            t.insert > t.strstart && (t.insert = t.strstart),
            tk(t),
            (r += i)),
          0 === t.strm.avail_in)
        )
          break;
        if (
          ((e = tz(t.strm, t.window, t.strstart + t.lookahead, r)),
          (t.lookahead += e),
          t.lookahead + t.insert >= 3)
        )
          for (
            n = t.strstart - t.insert,
              t.ins_h = t.window[n],
              t.ins_h = tL(t, t.ins_h, t.window[n + 1]);
            t.insert &&
            ((t.ins_h = tL(t, t.ins_h, t.window[n + 3 - 1])),
            (t.prev[n & t.w_mask] = t.head[t.ins_h]),
            (t.head[t.ins_h] = n),
            n++,
            t.insert--,
            !(t.lookahead + t.insert < 3));

          );
      } while (t.lookahead < 262 && 0 !== t.strm.avail_in);
    },
    tj = (t, e) => {
      let r =
          t.pending_buf_size - 5 > t.w_size ? t.w_size : t.pending_buf_size - 5,
        n,
        i,
        o,
        s = 0,
        a = t.strm.avail_in;
      do {
        if (
          ((n = 65535),
          (o = (t.bi_valid + 42) >> 3),
          t.strm.avail_out < o ||
            ((o = t.strm.avail_out - o),
            n > (i = t.strstart - t.block_start) + t.strm.avail_in &&
              (n = i + t.strm.avail_in),
            n > o && (n = o),
            n < r &&
              ((0 === n && e !== tp) || e === tc || n !== i + t.strm.avail_in)))
        )
          break;
        ((s = +(e === tp && n === i + t.strm.avail_in)),
          ta(t, 0, 0, s),
          (t.pending_buf[t.pending - 4] = n),
          (t.pending_buf[t.pending - 3] = n >> 8),
          (t.pending_buf[t.pending - 2] = ~n),
          (t.pending_buf[t.pending - 1] = ~n >> 8),
          tD(t.strm),
          i &&
            (i > n && (i = n),
            t.strm.output.set(
              t.window.subarray(t.block_start, t.block_start + i),
              t.strm.next_out,
            ),
            (t.strm.next_out += i),
            (t.strm.avail_out -= i),
            (t.strm.total_out += i),
            (t.block_start += i),
            (n -= i)),
          n &&
            (tz(t.strm, t.strm.output, t.strm.next_out, n),
            (t.strm.next_out += n),
            (t.strm.avail_out -= n),
            (t.strm.total_out += n)));
      } while (0 === s);
      return ((a -= t.strm.avail_in) &&
        (a >= t.w_size
          ? ((t.matches = 2),
            t.window.set(
              t.strm.input.subarray(t.strm.next_in - t.w_size, t.strm.next_in),
              0,
            ),
            (t.strstart = t.w_size),
            (t.insert = t.strstart))
          : (t.window_size - t.strstart <= a &&
              ((t.strstart -= t.w_size),
              t.window.set(
                t.window.subarray(t.w_size, t.w_size + t.strstart),
                0,
              ),
              t.matches < 2 && t.matches++,
              t.insert > t.strstart && (t.insert = t.strstart)),
            t.window.set(
              t.strm.input.subarray(t.strm.next_in - a, t.strm.next_in),
              t.strstart,
            ),
            (t.strstart += a),
            (t.insert += a > t.w_size - t.insert ? t.w_size - t.insert : a)),
        (t.block_start = t.strstart)),
      t.high_water < t.strstart && (t.high_water = t.strstart),
      s)
        ? 4
        : e !== tc &&
            e !== tp &&
            0 === t.strm.avail_in &&
            t.strstart === t.block_start
          ? 2
          : ((o = t.window_size - t.strstart),
            t.strm.avail_in > o &&
              t.block_start >= t.w_size &&
              ((t.block_start -= t.w_size),
              (t.strstart -= t.w_size),
              t.window.set(
                t.window.subarray(t.w_size, t.w_size + t.strstart),
                0,
              ),
              t.matches < 2 && t.matches++,
              (o += t.w_size),
              t.insert > t.strstart && (t.insert = t.strstart)),
            o > t.strm.avail_in && (o = t.strm.avail_in),
            o &&
              (tz(t.strm, t.window, t.strstart, o),
              (t.strstart += o),
              (t.insert += o > t.w_size - t.insert ? t.w_size - t.insert : o)),
            t.high_water < t.strstart && (t.high_water = t.strstart),
            (o = (t.bi_valid + 42) >> 3),
            (r =
              (o =
                t.pending_buf_size - o > 65535
                  ? 65535
                  : t.pending_buf_size - o) > t.w_size
                ? t.w_size
                : o),
            ((i = t.strstart - t.block_start) >= r ||
              ((i || e === tp) &&
                e !== tc &&
                0 === t.strm.avail_in &&
                i <= o)) &&
              ((n = i > o ? o : i),
              (s = +(e === tp && 0 === t.strm.avail_in && n === i)),
              ta(t, t.block_start, n, s),
              (t.block_start += n),
              tD(t.strm)),
            s ? 3 : 1);
    },
    tV = (t, e) => {
      let r, n;
      for (;;) {
        if (t.lookahead < 262) {
          if ((tG(t), t.lookahead < 262 && e === tc)) return 1;
          if (0 === t.lookahead) break;
        }
        if (
          ((r = 0),
          t.lookahead >= 3 &&
            ((t.ins_h = tL(t, t.ins_h, t.window[t.strstart + 3 - 1])),
            (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
            (t.head[t.ins_h] = t.strstart)),
          0 !== r &&
            t.strstart - r <= t.w_size - 262 &&
            (t.match_length = tH(t, r)),
          t.match_length >= 3)
        )
          if (
            ((n = tl(t, t.strstart - t.match_start, t.match_length - 3)),
            (t.lookahead -= t.match_length),
            t.match_length <= t.max_lazy_match && t.lookahead >= 3)
          ) {
            t.match_length--;
            do
              (t.strstart++,
                (t.ins_h = tL(t, t.ins_h, t.window[t.strstart + 3 - 1])),
                (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                (t.head[t.ins_h] = t.strstart));
            while (0 != --t.match_length);
            t.strstart++;
          } else
            ((t.strstart += t.match_length),
              (t.match_length = 0),
              (t.ins_h = t.window[t.strstart]),
              (t.ins_h = tL(t, t.ins_h, t.window[t.strstart + 1])));
        else
          ((n = tl(t, 0, t.window[t.strstart])), t.lookahead--, t.strstart++);
        if (n && (tP(t, !1), 0 === t.strm.avail_out)) return 1;
      }
      return ((t.insert = t.strstart < 2 ? t.strstart : 2), e === tp)
        ? (tP(t, !0), 0 === t.strm.avail_out)
          ? 3
          : 4
        : t.sym_next && (tP(t, !1), 0 === t.strm.avail_out)
          ? 1
          : 2;
    },
    tF = (t, e) => {
      let r, n, i;
      for (;;) {
        if (t.lookahead < 262) {
          if ((tG(t), t.lookahead < 262 && e === tc)) return 1;
          if (0 === t.lookahead) break;
        }
        if (
          ((r = 0),
          t.lookahead >= 3 &&
            ((t.ins_h = tL(t, t.ins_h, t.window[t.strstart + 3 - 1])),
            (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
            (t.head[t.ins_h] = t.strstart)),
          (t.prev_length = t.match_length),
          (t.prev_match = t.match_start),
          (t.match_length = 2),
          0 !== r &&
            t.prev_length < t.max_lazy_match &&
            t.strstart - r <= t.w_size - 262 &&
            ((t.match_length = tH(t, r)),
            t.match_length <= 5 &&
              (t.strategy === tR ||
                (3 === t.match_length && t.strstart - t.match_start > 4096)) &&
              (t.match_length = 2)),
          t.prev_length >= 3 && t.match_length <= t.prev_length)
        ) {
          ((i = t.strstart + t.lookahead - 3),
            (n = tl(t, t.strstart - 1 - t.prev_match, t.prev_length - 3)),
            (t.lookahead -= t.prev_length - 1),
            (t.prev_length -= 2));
          do
            ++t.strstart <= i &&
              ((t.ins_h = tL(t, t.ins_h, t.window[t.strstart + 3 - 1])),
              (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
              (t.head[t.ins_h] = t.strstart));
          while (0 != --t.prev_length);
          if (
            ((t.match_available = 0),
            (t.match_length = 2),
            t.strstart++,
            n && (tP(t, !1), 0 === t.strm.avail_out))
          )
            return 1;
        } else if (t.match_available) {
          if (
            ((n = tl(t, 0, t.window[t.strstart - 1])) && tP(t, !1),
            t.strstart++,
            t.lookahead--,
            0 === t.strm.avail_out)
          )
            return 1;
        } else ((t.match_available = 1), t.strstart++, t.lookahead--);
      }
      return (t.match_available &&
        ((n = tl(t, 0, t.window[t.strstart - 1])), (t.match_available = 0)),
      (t.insert = t.strstart < 2 ? t.strstart : 2),
      e === tp)
        ? (tP(t, !0), 0 === t.strm.avail_out)
          ? 3
          : 4
        : t.sym_next && (tP(t, !1), 0 === t.strm.avail_out)
          ? 1
          : 2;
    };
  function tK(t, e, r, n, i) {
    ((this.good_length = t),
      (this.max_lazy = e),
      (this.nice_length = r),
      (this.max_chain = n),
      (this.func = i));
  }
  let tZ = [
    new tK(0, 0, 0, 0, tj),
    new tK(4, 4, 8, 4, tV),
    new tK(4, 5, 16, 8, tV),
    new tK(4, 6, 32, 32, tV),
    new tK(4, 4, 16, 16, tF),
    new tK(8, 16, 32, 32, tF),
    new tK(8, 16, 128, 128, tF),
    new tK(8, 32, 128, 256, tF),
    new tK(32, 128, 258, 1024, tF),
    new tK(32, 258, 258, 4096, tF),
  ];
  function tq() {
    ((this.strm = null),
      (this.status = 0),
      (this.pending_buf = null),
      (this.pending_buf_size = 0),
      (this.pending_out = 0),
      (this.pending = 0),
      (this.wrap = 0),
      (this.gzhead = null),
      (this.gzindex = 0),
      (this.method = tM),
      (this.last_flush = -1),
      (this.w_size = 0),
      (this.w_bits = 0),
      (this.w_mask = 0),
      (this.window = null),
      (this.window_size = 0),
      (this.prev = null),
      (this.head = null),
      (this.ins_h = 0),
      (this.hash_size = 0),
      (this.hash_bits = 0),
      (this.hash_mask = 0),
      (this.hash_shift = 0),
      (this.block_start = 0),
      (this.match_length = 0),
      (this.prev_match = 0),
      (this.match_available = 0),
      (this.strstart = 0),
      (this.match_start = 0),
      (this.lookahead = 0),
      (this.prev_length = 0),
      (this.max_chain_length = 0),
      (this.max_lazy_match = 0),
      (this.level = 0),
      (this.strategy = 0),
      (this.good_match = 0),
      (this.nice_match = 0),
      (this.dyn_ltree = new Uint16Array(2 * tI)),
      (this.dyn_dtree = new Uint16Array(122)),
      (this.bl_tree = new Uint16Array(78)),
      tS(this.dyn_ltree),
      tS(this.dyn_dtree),
      tS(this.bl_tree),
      (this.l_desc = null),
      (this.d_desc = null),
      (this.bl_desc = null),
      (this.bl_count = new Uint16Array(16)),
      (this.heap = new Uint16Array(573)),
      tS(this.heap),
      (this.heap_len = 0),
      (this.heap_max = 0),
      (this.depth = new Uint16Array(573)),
      tS(this.depth),
      (this.sym_buf = 0),
      (this.lit_bufsize = 0),
      (this.sym_next = 0),
      (this.sym_end = 0),
      (this.opt_len = 0),
      (this.static_len = 0),
      (this.matches = 0),
      (this.insert = 0),
      (this.bi_buf = 0),
      (this.bi_valid = 0));
  }
  let t$ = (t) => {
    if (!t) return 1;
    let e = t.state;
    return e &&
      e.strm === t &&
      (42 === e.status ||
        57 === e.status ||
        69 === e.status ||
        73 === e.status ||
        91 === e.status ||
        103 === e.status ||
        113 === e.status ||
        666 === e.status)
      ? 0
      : 1;
  };
  var tW = (t, e) => {
      if (t$(t) || e > tm || e < 0) return t ? tx(t, ty) : ty;
      let r = t.state;
      if (
        !t.output ||
        (0 !== t.avail_in && !t.input) ||
        (666 === r.status && e !== tp)
      )
        return tx(t, 0 === t.avail_out ? tv : ty);
      let n = r.last_flush;
      if (((r.last_flush = e), 0 !== r.pending)) {
        if ((tD(t), 0 === t.avail_out)) return ((r.last_flush = -1), t_);
      } else if (0 === t.avail_in && tC(e) <= tC(n) && e !== tp)
        return tx(t, tv);
      if (666 === r.status && 0 !== t.avail_in) return tx(t, tv);
      if (
        (42 === r.status && 0 === r.wrap && (r.status = 113), 42 === r.status)
      ) {
        let e = (tM + ((r.w_bits - 8) << 4)) << 8;
        if (
          ((e |=
            (r.strategy >= tE || r.level < 2
              ? 0
              : r.level < 6
                ? 1
                : 6 === r.level
                  ? 2
                  : 3) << 6),
          0 !== r.strstart && (e |= 32),
          tB(r, (e += 31 - (e % 31))),
          0 !== r.strstart && (tB(r, t.adler >>> 16), tB(r, 65535 & t.adler)),
          (t.adler = 1),
          (r.status = 113),
          tD(t),
          0 !== r.pending)
        )
          return ((r.last_flush = -1), t_);
      }
      if (57 === r.status) {
        if (((t.adler = 0), tU(r, 31), tU(r, 139), tU(r, 8), r.gzhead))
          (tU(
            r,
            +!!r.gzhead.text +
              2 * !!r.gzhead.hcrc +
              4 * !!r.gzhead.extra +
              8 * !!r.gzhead.name +
              16 * !!r.gzhead.comment,
          ),
            tU(r, 255 & r.gzhead.time),
            tU(r, (r.gzhead.time >> 8) & 255),
            tU(r, (r.gzhead.time >> 16) & 255),
            tU(r, (r.gzhead.time >> 24) & 255),
            tU(r, 9 === r.level ? 2 : 4 * (r.strategy >= tE || r.level < 2)),
            tU(r, 255 & r.gzhead.os),
            r.gzhead.extra &&
              r.gzhead.extra.length &&
              (tU(r, 255 & r.gzhead.extra.length),
              tU(r, (r.gzhead.extra.length >> 8) & 255)),
            r.gzhead.hcrc &&
              (t.adler = tn(t.adler, r.pending_buf, r.pending, 0)),
            (r.gzindex = 0),
            (r.status = 69));
        else if (
          (tU(r, 0),
          tU(r, 0),
          tU(r, 0),
          tU(r, 0),
          tU(r, 0),
          tU(r, 9 === r.level ? 2 : 4 * (r.strategy >= tE || r.level < 2)),
          tU(r, 3),
          (r.status = 113),
          tD(t),
          0 !== r.pending)
        )
          return ((r.last_flush = -1), t_);
      }
      if (69 === r.status) {
        if (r.gzhead.extra) {
          let e = r.pending,
            n = (65535 & r.gzhead.extra.length) - r.gzindex;
          for (; r.pending + n > r.pending_buf_size; ) {
            let i = r.pending_buf_size - r.pending;
            if (
              (r.pending_buf.set(
                r.gzhead.extra.subarray(r.gzindex, r.gzindex + i),
                r.pending,
              ),
              (r.pending = r.pending_buf_size),
              r.gzhead.hcrc &&
                r.pending > e &&
                (t.adler = tn(t.adler, r.pending_buf, r.pending - e, e)),
              (r.gzindex += i),
              tD(t),
              0 !== r.pending)
            )
              return ((r.last_flush = -1), t_);
            ((e = 0), (n -= i));
          }
          let i = new Uint8Array(r.gzhead.extra);
          (r.pending_buf.set(i.subarray(r.gzindex, r.gzindex + n), r.pending),
            (r.pending += n),
            r.gzhead.hcrc &&
              r.pending > e &&
              (t.adler = tn(t.adler, r.pending_buf, r.pending - e, e)),
            (r.gzindex = 0));
        }
        r.status = 73;
      }
      if (73 === r.status) {
        if (r.gzhead.name) {
          let e,
            n = r.pending;
          do {
            if (r.pending === r.pending_buf_size) {
              if (
                (r.gzhead.hcrc &&
                  r.pending > n &&
                  (t.adler = tn(t.adler, r.pending_buf, r.pending - n, n)),
                tD(t),
                0 !== r.pending)
              )
                return ((r.last_flush = -1), t_);
              n = 0;
            }
            ((e =
              r.gzindex < r.gzhead.name.length
                ? 255 & r.gzhead.name.charCodeAt(r.gzindex++)
                : 0),
              tU(r, e));
          } while (0 !== e);
          (r.gzhead.hcrc &&
            r.pending > n &&
            (t.adler = tn(t.adler, r.pending_buf, r.pending - n, n)),
            (r.gzindex = 0));
        }
        r.status = 91;
      }
      if (91 === r.status) {
        if (r.gzhead.comment) {
          let e,
            n = r.pending;
          do {
            if (r.pending === r.pending_buf_size) {
              if (
                (r.gzhead.hcrc &&
                  r.pending > n &&
                  (t.adler = tn(t.adler, r.pending_buf, r.pending - n, n)),
                tD(t),
                0 !== r.pending)
              )
                return ((r.last_flush = -1), t_);
              n = 0;
            }
            ((e =
              r.gzindex < r.gzhead.comment.length
                ? 255 & r.gzhead.comment.charCodeAt(r.gzindex++)
                : 0),
              tU(r, e));
          } while (0 !== e);
          r.gzhead.hcrc &&
            r.pending > n &&
            (t.adler = tn(t.adler, r.pending_buf, r.pending - n, n));
        }
        r.status = 103;
      }
      if (103 === r.status) {
        if (r.gzhead.hcrc) {
          if (r.pending + 2 > r.pending_buf_size && (tD(t), 0 !== r.pending))
            return ((r.last_flush = -1), t_);
          (tU(r, 255 & t.adler), tU(r, (t.adler >> 8) & 255), (t.adler = 0));
        }
        if (((r.status = 113), tD(t), 0 !== r.pending))
          return ((r.last_flush = -1), t_);
      }
      if (
        0 !== t.avail_in ||
        0 !== r.lookahead ||
        (e !== tc && 666 !== r.status)
      ) {
        let n =
          0 === r.level
            ? tj(r, e)
            : r.strategy === tE
              ? ((t, e) => {
                  let r;
                  for (;;) {
                    if (0 === t.lookahead && (tG(t), 0 === t.lookahead)) {
                      if (e === tc) return 1;
                      break;
                    }
                    if (
                      ((t.match_length = 0),
                      (r = tl(t, 0, t.window[t.strstart])),
                      t.lookahead--,
                      t.strstart++,
                      r && (tP(t, !1), 0 === t.strm.avail_out))
                    )
                      return 1;
                  }
                  return ((t.insert = 0), e === tp)
                    ? (tP(t, !0), 0 === t.strm.avail_out)
                      ? 3
                      : 4
                    : t.sym_next && (tP(t, !1), 0 === t.strm.avail_out)
                      ? 1
                      : 2;
                })(r, e)
              : r.strategy === tA
                ? ((t, e) => {
                    let r,
                      n,
                      i,
                      o,
                      s = t.window;
                    for (;;) {
                      if (t.lookahead <= 258) {
                        if ((tG(t), t.lookahead <= 258 && e === tc)) return 1;
                        if (0 === t.lookahead) break;
                      }
                      if (
                        ((t.match_length = 0),
                        t.lookahead >= 3 &&
                          t.strstart > 0 &&
                          (n = s[(i = t.strstart - 1)]) === s[++i] &&
                          n === s[++i] &&
                          n === s[++i])
                      ) {
                        o = t.strstart + 258;
                        do;
                        while (
                          n === s[++i] &&
                          n === s[++i] &&
                          n === s[++i] &&
                          n === s[++i] &&
                          n === s[++i] &&
                          n === s[++i] &&
                          n === s[++i] &&
                          n === s[++i] &&
                          i < o
                        );
                        ((t.match_length = 258 - (o - i)),
                          t.match_length > t.lookahead &&
                            (t.match_length = t.lookahead));
                      }
                      if (
                        (t.match_length >= 3
                          ? ((r = tl(t, 1, t.match_length - 3)),
                            (t.lookahead -= t.match_length),
                            (t.strstart += t.match_length),
                            (t.match_length = 0))
                          : ((r = tl(t, 0, t.window[t.strstart])),
                            t.lookahead--,
                            t.strstart++),
                        r && (tP(t, !1), 0 === t.strm.avail_out))
                      )
                        return 1;
                    }
                    return ((t.insert = 0), e === tp)
                      ? (tP(t, !0), 0 === t.strm.avail_out)
                        ? 3
                        : 4
                      : t.sym_next && (tP(t, !1), 0 === t.strm.avail_out)
                        ? 1
                        : 2;
                  })(r, e)
                : tZ[r.level].func(r, e);
        if (((3 === n || 4 === n) && (r.status = 666), 1 === n || 3 === n))
          return (0 === t.avail_out && (r.last_flush = -1), t_);
        if (
          2 === n &&
          (e === td
            ? th(r)
            : e !== tm &&
              (ta(r, 0, 0, !1),
              e === tf &&
                (tS(r.head),
                0 === r.lookahead &&
                  ((r.strstart = 0), (r.block_start = 0), (r.insert = 0)))),
          tD(t),
          0 === t.avail_out)
        )
          return ((r.last_flush = -1), t_);
      }
      return e !== tp
        ? t_
        : r.wrap <= 0
          ? tg
          : (2 === r.wrap
              ? (tU(r, 255 & t.adler),
                tU(r, (t.adler >> 8) & 255),
                tU(r, (t.adler >> 16) & 255),
                tU(r, (t.adler >> 24) & 255),
                tU(r, 255 & t.total_in),
                tU(r, (t.total_in >> 8) & 255),
                tU(r, (t.total_in >> 16) & 255),
                tU(r, (t.total_in >> 24) & 255))
              : (tB(r, t.adler >>> 16), tB(r, 65535 & t.adler)),
            tD(t),
            r.wrap > 0 && (r.wrap = -r.wrap),
            0 !== r.pending ? t_ : tg);
    },
    tX = (t) => {
      if (t$(t)) return ty;
      let e = t.state.status;
      return ((t.state = null), 113 === e ? tx(t, tw) : t_);
    };
  let tY = (t, e) => Object.prototype.hasOwnProperty.call(t, e);
  var tQ = function (t) {
      let e = Array.prototype.slice.call(arguments, 1);
      for (; e.length; ) {
        let r = e.shift();
        if (r) {
          if ("object" != typeof r) throw TypeError(r + "must be non-object");
          for (let e in r) tY(r, e) && (t[e] = r[e]);
        }
      }
      return t;
    },
    tJ = (t) => {
      let e = 0;
      for (let r = 0, n = t.length; r < n; r++) e += t[r].length;
      let r = new Uint8Array(e);
      for (let e = 0, n = 0, i = t.length; e < i; e++) {
        let i = t[e];
        (r.set(i, n), (n += i.length));
      }
      return r;
    };
  let t0 = !0;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (t) {
    t0 = !1;
  }
  let t1 = new Uint8Array(256);
  for (let t = 0; t < 256; t++)
    t1[t] =
      t >= 252
        ? 6
        : t >= 248
          ? 5
          : t >= 240
            ? 4
            : t >= 224
              ? 3
              : t >= 192
                ? 2
                : 1;
  t1[254] = t1[254] = 1;
  var t2 = (t) => {
      if ("function" == typeof TextEncoder && TextEncoder.prototype.encode)
        return new TextEncoder().encode(t);
      let e,
        r,
        n,
        i,
        o,
        s = t.length,
        a = 0;
      for (i = 0; i < s; i++)
        ((64512 & (r = t.charCodeAt(i))) == 55296 &&
          i + 1 < s &&
          (64512 & (n = t.charCodeAt(i + 1))) == 56320 &&
          ((r = 65536 + ((r - 55296) << 10) + (n - 56320)), i++),
          (a += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4));
      for (e = new Uint8Array(a), o = 0, i = 0; o < a; i++)
        ((64512 & (r = t.charCodeAt(i))) == 55296 &&
          i + 1 < s &&
          (64512 & (n = t.charCodeAt(i + 1))) == 56320 &&
          ((r = 65536 + ((r - 55296) << 10) + (n - 56320)), i++),
          r < 128
            ? (e[o++] = r)
            : (r < 2048
                ? (e[o++] = 192 | (r >>> 6))
                : (r < 65536
                    ? (e[o++] = 224 | (r >>> 12))
                    : ((e[o++] = 240 | (r >>> 18)),
                      (e[o++] = 128 | ((r >>> 12) & 63))),
                  (e[o++] = 128 | ((r >>> 6) & 63))),
              (e[o++] = 128 | (63 & r))));
      return e;
    },
    t6 = (t, e) => {
      let r,
        n,
        i = e || t.length;
      if ("function" == typeof TextDecoder && TextDecoder.prototype.decode)
        return new TextDecoder().decode(t.subarray(0, e));
      let o = Array(2 * i);
      for (n = 0, r = 0; r < i; ) {
        let e = t[r++];
        if (e < 128) {
          o[n++] = e;
          continue;
        }
        let s = t1[e];
        if (s > 4) {
          ((o[n++] = 65533), (r += s - 1));
          continue;
        }
        for (e &= 2 === s ? 31 : 3 === s ? 15 : 7; s > 1 && r < i; )
          ((e = (e << 6) | (63 & t[r++])), s--);
        if (s > 1) {
          o[n++] = 65533;
          continue;
        }
        e < 65536
          ? (o[n++] = e)
          : ((e -= 65536),
            (o[n++] = 55296 | ((e >> 10) & 1023)),
            (o[n++] = 56320 | (1023 & e)));
      }
      var s = n;
      if (s < 65534 && o.subarray && t0)
        return String.fromCharCode.apply(
          null,
          o.length === s ? o : o.subarray(0, s),
        );
      let a = "";
      for (let t = 0; t < s; t++) a += String.fromCharCode(o[t]);
      return a;
    },
    t3 = (t, e) => {
      (e = e || t.length) > t.length && (e = t.length);
      let r = e - 1;
      for (; r >= 0 && (192 & t[r]) == 128; ) r--;
      return r < 0 || 0 === r ? e : r + t1[t[r]] > e ? r : e;
    },
    t5 = function () {
      ((this.input = null),
        (this.next_in = 0),
        (this.avail_in = 0),
        (this.total_in = 0),
        (this.output = null),
        (this.next_out = 0),
        (this.avail_out = 0),
        (this.total_out = 0),
        (this.msg = ""),
        (this.state = null),
        (this.data_type = 2),
        (this.adler = 0));
    };
  let t8 = Object.prototype.toString,
    {
      Z_NO_FLUSH: t4,
      Z_SYNC_FLUSH: t9,
      Z_FULL_FLUSH: t7,
      Z_FINISH: et,
      Z_OK: ee,
      Z_STREAM_END: er,
      Z_DEFAULT_COMPRESSION: en,
      Z_DEFAULT_STRATEGY: ei,
      Z_DEFLATED: eo,
    } = to;
  function es(t) {
    let e, r;
    this.options = tQ(
      {
        level: en,
        method: eo,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: ei,
      },
      t || {},
    );
    let n = this.options;
    (n.raw && n.windowBits > 0
      ? (n.windowBits = -n.windowBits)
      : n.gzip && n.windowBits > 0 && n.windowBits < 16 && (n.windowBits += 16),
      (this.err = 0),
      (this.msg = ""),
      (this.ended = !1),
      (this.chunks = []),
      (this.strm = new t5()),
      (this.strm.avail_out = 0));
    let i = ((t, e, r, n, i, o) => {
      var s, a;
      let u;
      if (!t) return ty;
      let l = 1;
      if (
        (e === tb && (e = 6),
        n < 0 ? ((l = 0), (n = -n)) : n > 15 && ((l = 2), (n -= 16)),
        i < 1 ||
          i > 9 ||
          r !== tM ||
          n < 8 ||
          n > 15 ||
          e < 0 ||
          e > 9 ||
          o < 0 ||
          o > tO ||
          (8 === n && 1 !== l))
      )
        return tx(t, ty);
      8 === n && (n = 9);
      let h = new tq();
      return (
        (t.state = h),
        (h.strm = t),
        (h.status = 42),
        (h.wrap = l),
        (h.gzhead = null),
        (h.w_bits = n),
        (h.w_size = 1 << h.w_bits),
        (h.w_mask = h.w_size - 1),
        (h.hash_bits = i + 7),
        (h.hash_size = 1 << h.hash_bits),
        (h.hash_mask = h.hash_size - 1),
        (h.hash_shift = ~~((h.hash_bits + 3 - 1) / 3)),
        (h.window = new Uint8Array(2 * h.w_size)),
        (h.head = new Uint16Array(h.hash_size)),
        (h.prev = new Uint16Array(h.w_size)),
        (h.lit_bufsize = 1 << (i + 6)),
        (h.pending_buf_size = 4 * h.lit_bufsize),
        (h.pending_buf = new Uint8Array(h.pending_buf_size)),
        (h.sym_buf = h.lit_bufsize),
        (h.sym_end = (h.lit_bufsize - 1) * 3),
        (h.level = e),
        (h.strategy = o),
        (h.method = r),
        (u = ((t) => {
          if (t$(t)) return tx(t, ty);
          ((t.total_in = t.total_out = 0), (t.data_type = tN));
          let e = t.state;
          return (
            (e.pending = 0),
            (e.pending_out = 0),
            e.wrap < 0 && (e.wrap = -e.wrap),
            (e.status = 2 === e.wrap ? 57 : e.wrap ? 42 : 113),
            (t.adler = +(2 !== e.wrap)),
            (e.last_flush = -2),
            ts(e),
            t_
          );
        })((s = t))) === t_ &&
          (((a = s.state).window_size = 2 * a.w_size),
          tS(a.head),
          (a.max_lazy_match = tZ[a.level].max_lazy),
          (a.good_match = tZ[a.level].good_length),
          (a.nice_match = tZ[a.level].nice_length),
          (a.max_chain_length = tZ[a.level].max_chain),
          (a.strstart = 0),
          (a.block_start = 0),
          (a.lookahead = 0),
          (a.insert = 0),
          (a.match_length = a.prev_length = 2),
          (a.match_available = 0),
          (a.ins_h = 0)),
        u
      );
    })(this.strm, n.level, n.method, n.windowBits, n.memLevel, n.strategy);
    if (i !== ee) throw Error(ti[i]);
    if (
      (n.header &&
        ((e = this.strm),
        (r = n.header),
        t$(e) || 2 !== e.state.wrap || (e.state.gzhead = r)),
      n.dictionary)
    ) {
      let t;
      if (
        ((t =
          "string" == typeof n.dictionary
            ? t2(n.dictionary)
            : "[object ArrayBuffer]" === t8.call(n.dictionary)
              ? new Uint8Array(n.dictionary)
              : n.dictionary),
        (i = ((t, e) => {
          let r = e.length;
          if (t$(t)) return ty;
          let n = t.state,
            i = n.wrap;
          if (2 === i || (1 === i && 42 !== n.status) || n.lookahead) return ty;
          if (
            (1 === i && (t.adler = te(t.adler, e, r, 0)),
            (n.wrap = 0),
            r >= n.w_size)
          ) {
            0 === i &&
              (tS(n.head),
              (n.strstart = 0),
              (n.block_start = 0),
              (n.insert = 0));
            let t = new Uint8Array(n.w_size);
            (t.set(e.subarray(r - n.w_size, r), 0), (e = t), (r = n.w_size));
          }
          let o = t.avail_in,
            s = t.next_in,
            a = t.input;
          for (
            t.avail_in = r, t.next_in = 0, t.input = e, tG(n);
            n.lookahead >= 3;

          ) {
            let t = n.strstart,
              e = n.lookahead - 2;
            do
              ((n.ins_h = tL(n, n.ins_h, n.window[t + 3 - 1])),
                (n.prev[t & n.w_mask] = n.head[n.ins_h]),
                (n.head[n.ins_h] = t),
                t++);
            while (--e);
            ((n.strstart = t), (n.lookahead = 2), tG(n));
          }
          return (
            (n.strstart += n.lookahead),
            (n.block_start = n.strstart),
            (n.insert = n.lookahead),
            (n.lookahead = 0),
            (n.match_length = n.prev_length = 2),
            (n.match_available = 0),
            (t.next_in = s),
            (t.input = a),
            (t.avail_in = o),
            (n.wrap = i),
            t_
          );
        })(this.strm, t)) !== ee)
      )
        throw Error(ti[i]);
      this._dict_set = !0;
    }
  }
  function ea(t, e) {
    let r = new es(e);
    if ((r.push(t, !0), r.err)) throw r.msg || ti[r.err];
    return r.result;
  }
  ((es.prototype.push = function (t, e) {
    let r,
      n,
      i = this.strm,
      o = this.options.chunkSize;
    if (this.ended) return !1;
    for (
      n = e === ~~e ? e : !0 === e ? et : t4,
        "string" == typeof t
          ? (i.input = t2(t))
          : "[object ArrayBuffer]" === t8.call(t)
            ? (i.input = new Uint8Array(t))
            : (i.input = t),
        i.next_in = 0,
        i.avail_in = i.input.length;
      ;

    ) {
      if (
        (0 === i.avail_out &&
          ((i.output = new Uint8Array(o)), (i.next_out = 0), (i.avail_out = o)),
        (n === t9 || n === t7) && i.avail_out <= 6)
      ) {
        (this.onData(i.output.subarray(0, i.next_out)), (i.avail_out = 0));
        continue;
      }
      if ((r = tW(i, n)) === er)
        return (
          i.next_out > 0 && this.onData(i.output.subarray(0, i.next_out)),
          (r = tX(this.strm)),
          this.onEnd(r),
          (this.ended = !0),
          r === ee
        );
      if (0 === i.avail_out) {
        this.onData(i.output);
        continue;
      }
      if (n > 0 && i.next_out > 0) {
        (this.onData(i.output.subarray(0, i.next_out)), (i.avail_out = 0));
        continue;
      }
      if (0 === i.avail_in) break;
    }
    return !0;
  }),
    (es.prototype.onData = function (t) {
      this.chunks.push(t);
    }),
    (es.prototype.onEnd = function (t) {
      (t === ee && (this.result = tJ(this.chunks)),
        (this.chunks = []),
        (this.err = t),
        (this.msg = this.strm.msg));
    }));
  var eu = function (t, e) {
    let r,
      n,
      i,
      o,
      s,
      a,
      u,
      l,
      h,
      c,
      d,
      f,
      p,
      m,
      _,
      g,
      y,
      w,
      v,
      b,
      R,
      E,
      A,
      O,
      T = t.state;
    ((r = t.next_in),
      (A = t.input),
      (n = r + (t.avail_in - 5)),
      (i = t.next_out),
      (O = t.output),
      (o = i - (e - t.avail_out)),
      (s = i + (t.avail_out - 257)),
      (a = T.dmax),
      (u = T.wsize),
      (l = T.whave),
      (h = T.wnext),
      (c = T.window),
      (d = T.hold),
      (f = T.bits),
      (p = T.lencode),
      (m = T.distcode),
      (_ = (1 << T.lenbits) - 1),
      (g = (1 << T.distbits) - 1));
    t: do
      for (
        f < 15 && ((d += A[r++] << f), (f += 8), (d += A[r++] << f), (f += 8)),
          y = p[d & _];
        ;

      ) {
        if (((d >>>= w = y >>> 24), (f -= w), 0 == (w = (y >>> 16) & 255)))
          O[i++] = 65535 & y;
        else if (16 & w)
          for (
            v = 65535 & y,
              (w &= 15) &&
                (f < w && ((d += A[r++] << f), (f += 8)),
                (v += d & ((1 << w) - 1)),
                (d >>>= w),
                (f -= w)),
              f < 15 &&
                ((d += A[r++] << f), (f += 8), (d += A[r++] << f), (f += 8)),
              y = m[d & g];
            ;

          ) {
            if (
              ((d >>>= w = y >>> 24), (f -= w), 16 & (w = (y >>> 16) & 255))
            ) {
              if (
                ((b = 65535 & y),
                f < (w &= 15) &&
                  ((d += A[r++] << f),
                  (f += 8) < w && ((d += A[r++] << f), (f += 8))),
                (b += d & ((1 << w) - 1)) > a)
              ) {
                ((t.msg = "invalid distance too far back"), (T.mode = 16209));
                break t;
              }
              if (((d >>>= w), (f -= w), b > (w = i - o))) {
                if ((w = b - w) > l && T.sane) {
                  ((t.msg = "invalid distance too far back"), (T.mode = 16209));
                  break t;
                }
                if (((R = 0), (E = c), 0 === h)) {
                  if (((R += u - w), w < v)) {
                    v -= w;
                    do O[i++] = c[R++];
                    while (--w);
                    ((R = i - b), (E = O));
                  }
                } else if (h < w) {
                  if (((R += u + h - w), (w -= h) < v)) {
                    v -= w;
                    do O[i++] = c[R++];
                    while (--w);
                    if (((R = 0), h < v)) {
                      v -= w = h;
                      do O[i++] = c[R++];
                      while (--w);
                      ((R = i - b), (E = O));
                    }
                  }
                } else if (((R += h - w), w < v)) {
                  v -= w;
                  do O[i++] = c[R++];
                  while (--w);
                  ((R = i - b), (E = O));
                }
                for (; v > 2; )
                  ((O[i++] = E[R++]),
                    (O[i++] = E[R++]),
                    (O[i++] = E[R++]),
                    (v -= 3));
                v && ((O[i++] = E[R++]), v > 1 && (O[i++] = E[R++]));
              } else {
                R = i - b;
                do
                  ((O[i++] = O[R++]),
                    (O[i++] = O[R++]),
                    (O[i++] = O[R++]),
                    (v -= 3));
                while (v > 2);
                v && ((O[i++] = O[R++]), v > 1 && (O[i++] = O[R++]));
              }
            } else if ((64 & w) == 0) {
              y = m[(65535 & y) + (d & ((1 << w) - 1))];
              continue;
            } else {
              ((t.msg = "invalid distance code"), (T.mode = 16209));
              break t;
            }
            break;
          }
        else if ((64 & w) == 0) {
          y = p[(65535 & y) + (d & ((1 << w) - 1))];
          continue;
        } else if (32 & w) {
          T.mode = 16191;
          break t;
        } else {
          ((t.msg = "invalid literal/length code"), (T.mode = 16209));
          break t;
        }
        break;
      }
    while (r < n && i < s);
    ((r -= v = f >> 3),
      (f -= v << 3),
      (d &= (1 << f) - 1),
      (t.next_in = r),
      (t.next_out = i),
      (t.avail_in = r < n ? 5 + (n - r) : 5 - (r - n)),
      (t.avail_out = i < s ? 257 + (s - i) : 257 - (i - s)),
      (T.hold = d),
      (T.bits = f));
  };
  let el = new Uint16Array([
      3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59,
      67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
    ]),
    eh = new Uint8Array([
      16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19,
      19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78,
    ]),
    ec = new Uint16Array([
      1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513,
      769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0,
    ]),
    ed = new Uint8Array([
      16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23,
      24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64,
    ]);
  var ef = (t, e, r, n, i, o, s, a) => {
    let u,
      l,
      h,
      c,
      d,
      f,
      p,
      m,
      _,
      g = a.bits,
      y = 0,
      w = 0,
      v = 0,
      b = 0,
      R = 0,
      E = 0,
      A = 0,
      O = 0,
      T = 0,
      N = 0,
      M = null,
      I = new Uint16Array(16),
      x = new Uint16Array(16),
      C = null;
    for (y = 0; y <= 15; y++) I[y] = 0;
    for (w = 0; w < n; w++) I[e[r + w]]++;
    for (R = g, b = 15; b >= 1 && 0 === I[b]; b--);
    if ((R > b && (R = b), 0 === b))
      return ((i[o++] = 0x1400000), (i[o++] = 0x1400000), (a.bits = 1), 0);
    for (v = 1; v < b && 0 === I[v]; v++);
    for (R < v && (R = v), O = 1, y = 1; y <= 15; y++)
      if (((O <<= 1), (O -= I[y]) < 0)) return -1;
    if (O > 0 && (0 === t || 1 !== b)) return -1;
    for (x[1] = 0, y = 1; y < 15; y++) x[y + 1] = x[y] + I[y];
    for (w = 0; w < n; w++) 0 !== e[r + w] && (s[x[e[r + w]]++] = w);
    if (
      (0 === t
        ? ((M = C = s), (f = 20))
        : 1 === t
          ? ((M = el), (C = eh), (f = 257))
          : ((M = ec), (C = ed), (f = 0)),
      (N = 0),
      (w = 0),
      (y = v),
      (d = o),
      (E = R),
      (A = 0),
      (h = -1),
      (c = (T = 1 << R) - 1),
      (1 === t && T > 852) || (2 === t && T > 592))
    )
      return 1;
    for (;;) {
      ((p = y - A),
        s[w] + 1 < f
          ? ((m = 0), (_ = s[w]))
          : s[w] >= f
            ? ((m = C[s[w] - f]), (_ = M[s[w] - f]))
            : ((m = 96), (_ = 0)),
        (u = 1 << (y - A)),
        (v = l = 1 << E));
      do i[d + (N >> A) + (l -= u)] = (p << 24) | (m << 16) | _;
      while (0 !== l);
      for (u = 1 << (y - 1); N & u; ) u >>= 1;
      if ((0 !== u ? ((N &= u - 1), (N += u)) : (N = 0), w++, 0 == --I[y])) {
        if (y === b) break;
        y = e[r + s[w]];
      }
      if (y > R && (N & c) !== h) {
        for (
          0 === A && (A = R), d += v, O = 1 << (E = y - A);
          E + A < b && !((O -= I[E + A]) <= 0);

        )
          (E++, (O <<= 1));
        if (((T += 1 << E), (1 === t && T > 852) || (2 === t && T > 592)))
          return 1;
        i[(h = N & c)] = (R << 24) | (E << 16) | (d - o);
      }
    }
    return (0 !== N && (i[d + N] = ((y - A) << 24) | 4194304), (a.bits = R), 0);
  };
  let {
      Z_FINISH: ep,
      Z_BLOCK: em,
      Z_TREES: e_,
      Z_OK: eg,
      Z_STREAM_END: ey,
      Z_NEED_DICT: ew,
      Z_STREAM_ERROR: ev,
      Z_DATA_ERROR: eb,
      Z_MEM_ERROR: eR,
      Z_BUF_ERROR: eE,
      Z_DEFLATED: eA,
    } = to,
    eO = (t) =>
      ((t >>> 24) & 255) +
      ((t >>> 8) & 65280) +
      ((65280 & t) << 8) +
      ((255 & t) << 24);
  function eT() {
    ((this.strm = null),
      (this.mode = 0),
      (this.last = !1),
      (this.wrap = 0),
      (this.havedict = !1),
      (this.flags = 0),
      (this.dmax = 0),
      (this.check = 0),
      (this.total = 0),
      (this.head = null),
      (this.wbits = 0),
      (this.wsize = 0),
      (this.whave = 0),
      (this.wnext = 0),
      (this.window = null),
      (this.hold = 0),
      (this.bits = 0),
      (this.length = 0),
      (this.offset = 0),
      (this.extra = 0),
      (this.lencode = null),
      (this.distcode = null),
      (this.lenbits = 0),
      (this.distbits = 0),
      (this.ncode = 0),
      (this.nlen = 0),
      (this.ndist = 0),
      (this.have = 0),
      (this.next = null),
      (this.lens = new Uint16Array(320)),
      (this.work = new Uint16Array(288)),
      (this.lendyn = null),
      (this.distdyn = null),
      (this.sane = 0),
      (this.back = 0),
      (this.was = 0));
  }
  let eN = (t) => {
      if (!t) return 1;
      let e = t.state;
      return +(!e || e.strm !== t || e.mode < 16180 || e.mode > 16211);
    },
    eM = (t) => {
      if (eN(t)) return ev;
      let e = t.state;
      return (
        (e.wsize = 0),
        (e.whave = 0),
        (e.wnext = 0),
        ((t) => {
          if (eN(t)) return ev;
          let e = t.state;
          return (
            (t.total_in = t.total_out = e.total = 0),
            (t.msg = ""),
            e.wrap && (t.adler = 1 & e.wrap),
            (e.mode = 16180),
            (e.last = 0),
            (e.havedict = 0),
            (e.flags = -1),
            (e.dmax = 32768),
            (e.head = null),
            (e.hold = 0),
            (e.bits = 0),
            (e.lencode = e.lendyn = new Int32Array(852)),
            (e.distcode = e.distdyn = new Int32Array(592)),
            (e.sane = 1),
            (e.back = -1),
            eg
          );
        })(t)
      );
    },
    eI = !0,
    ex = (t) => {
      if (eI) {
        ((i = new Int32Array(512)), (o = new Int32Array(32)));
        let e = 0;
        for (; e < 144; ) t.lens[e++] = 8;
        for (; e < 256; ) t.lens[e++] = 9;
        for (; e < 280; ) t.lens[e++] = 7;
        for (; e < 288; ) t.lens[e++] = 8;
        for (ef(1, t.lens, 0, 288, i, 0, t.work, { bits: 9 }), e = 0; e < 32; )
          t.lens[e++] = 5;
        (ef(2, t.lens, 0, 32, o, 0, t.work, { bits: 5 }), (eI = !1));
      }
      ((t.lencode = i), (t.lenbits = 9), (t.distcode = o), (t.distbits = 5));
    },
    eC = (t, e, r, n) => {
      let i,
        o = t.state;
      return (
        null === o.window &&
          ((o.wsize = 1 << o.wbits),
          (o.wnext = 0),
          (o.whave = 0),
          (o.window = new Uint8Array(o.wsize))),
        n >= o.wsize
          ? (o.window.set(e.subarray(r - o.wsize, r), 0),
            (o.wnext = 0),
            (o.whave = o.wsize))
          : ((i = o.wsize - o.wnext) > n && (i = n),
            o.window.set(e.subarray(r - n, r - n + i), o.wnext),
            (n -= i)
              ? (o.window.set(e.subarray(r - n, r), 0),
                (o.wnext = n),
                (o.whave = o.wsize))
              : ((o.wnext += i),
                o.wnext === o.wsize && (o.wnext = 0),
                o.whave < o.wsize && (o.whave += i))),
        0
      );
    };
  var eS = (t, e) => {
      let r,
        n,
        i,
        o,
        s,
        a,
        u,
        l,
        h,
        c,
        d,
        f,
        p,
        m,
        _,
        g,
        y,
        w,
        v,
        b,
        R,
        E,
        A,
        O,
        T = 0,
        N = new Uint8Array(4),
        M = new Uint8Array([
          16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
        ]);
      if (eN(t) || !t.output || (!t.input && 0 !== t.avail_in)) return ev;
      (16191 === (r = t.state).mode && (r.mode = 16192),
        (s = t.next_out),
        (i = t.output),
        (u = t.avail_out),
        (o = t.next_in),
        (n = t.input),
        (a = t.avail_in),
        (l = r.hold),
        (h = r.bits),
        (c = a),
        (d = u),
        (E = eg));
      e: for (;;)
        switch (r.mode) {
          case 16180:
            if (0 === r.wrap) {
              r.mode = 16192;
              break;
            }
            for (; h < 16; ) {
              if (0 === a) break e;
              (a--, (l += n[o++] << h), (h += 8));
            }
            if (2 & r.wrap && 35615 === l) {
              (0 === r.wbits && (r.wbits = 15),
                (r.check = 0),
                (N[0] = 255 & l),
                (N[1] = (l >>> 8) & 255),
                (r.check = tn(r.check, N, 2, 0)),
                (l = 0),
                (h = 0),
                (r.mode = 16181));
              break;
            }
            if (
              (r.head && (r.head.done = !1),
              !(1 & r.wrap) || (((255 & l) << 8) + (l >> 8)) % 31)
            ) {
              ((t.msg = "incorrect header check"), (r.mode = 16209));
              break;
            }
            if ((15 & l) !== eA) {
              ((t.msg = "unknown compression method"), (r.mode = 16209));
              break;
            }
            if (
              ((l >>>= 4),
              (h -= 4),
              (R = (15 & l) + 8),
              0 === r.wbits && (r.wbits = R),
              R > 15 || R > r.wbits)
            ) {
              ((t.msg = "invalid window size"), (r.mode = 16209));
              break;
            }
            ((r.dmax = 1 << r.wbits),
              (r.flags = 0),
              (t.adler = r.check = 1),
              (r.mode = 512 & l ? 16189 : 16191),
              (l = 0),
              (h = 0));
            break;
          case 16181:
            for (; h < 16; ) {
              if (0 === a) break e;
              (a--, (l += n[o++] << h), (h += 8));
            }
            if (((r.flags = l), (255 & r.flags) !== eA)) {
              ((t.msg = "unknown compression method"), (r.mode = 16209));
              break;
            }
            if (57344 & r.flags) {
              ((t.msg = "unknown header flags set"), (r.mode = 16209));
              break;
            }
            (r.head && (r.head.text = (l >> 8) & 1),
              512 & r.flags &&
                4 & r.wrap &&
                ((N[0] = 255 & l),
                (N[1] = (l >>> 8) & 255),
                (r.check = tn(r.check, N, 2, 0))),
              (l = 0),
              (h = 0),
              (r.mode = 16182));
          case 16182:
            for (; h < 32; ) {
              if (0 === a) break e;
              (a--, (l += n[o++] << h), (h += 8));
            }
            (r.head && (r.head.time = l),
              512 & r.flags &&
                4 & r.wrap &&
                ((N[0] = 255 & l),
                (N[1] = (l >>> 8) & 255),
                (N[2] = (l >>> 16) & 255),
                (N[3] = (l >>> 24) & 255),
                (r.check = tn(r.check, N, 4, 0))),
              (l = 0),
              (h = 0),
              (r.mode = 16183));
          case 16183:
            for (; h < 16; ) {
              if (0 === a) break e;
              (a--, (l += n[o++] << h), (h += 8));
            }
            (r.head && ((r.head.xflags = 255 & l), (r.head.os = l >> 8)),
              512 & r.flags &&
                4 & r.wrap &&
                ((N[0] = 255 & l),
                (N[1] = (l >>> 8) & 255),
                (r.check = tn(r.check, N, 2, 0))),
              (l = 0),
              (h = 0),
              (r.mode = 16184));
          case 16184:
            if (1024 & r.flags) {
              for (; h < 16; ) {
                if (0 === a) break e;
                (a--, (l += n[o++] << h), (h += 8));
              }
              ((r.length = l),
                r.head && (r.head.extra_len = l),
                512 & r.flags &&
                  4 & r.wrap &&
                  ((N[0] = 255 & l),
                  (N[1] = (l >>> 8) & 255),
                  (r.check = tn(r.check, N, 2, 0))),
                (l = 0),
                (h = 0));
            } else r.head && (r.head.extra = null);
            r.mode = 16185;
          case 16185:
            if (
              1024 & r.flags &&
              ((f = r.length) > a && (f = a),
              f &&
                (r.head &&
                  ((R = r.head.extra_len - r.length),
                  r.head.extra ||
                    (r.head.extra = new Uint8Array(r.head.extra_len)),
                  r.head.extra.set(n.subarray(o, o + f), R)),
                512 & r.flags && 4 & r.wrap && (r.check = tn(r.check, n, f, o)),
                (a -= f),
                (o += f),
                (r.length -= f)),
              r.length)
            )
              break e;
            ((r.length = 0), (r.mode = 16186));
          case 16186:
            if (2048 & r.flags) {
              if (0 === a) break e;
              f = 0;
              do
                ((R = n[o + f++]),
                  r.head &&
                    R &&
                    r.length < 65536 &&
                    (r.head.name += String.fromCharCode(R)));
              while (R && f < a);
              if (
                (512 & r.flags &&
                  4 & r.wrap &&
                  (r.check = tn(r.check, n, f, o)),
                (a -= f),
                (o += f),
                R)
              )
                break e;
            } else r.head && (r.head.name = null);
            ((r.length = 0), (r.mode = 16187));
          case 16187:
            if (4096 & r.flags) {
              if (0 === a) break e;
              f = 0;
              do
                ((R = n[o + f++]),
                  r.head &&
                    R &&
                    r.length < 65536 &&
                    (r.head.comment += String.fromCharCode(R)));
              while (R && f < a);
              if (
                (512 & r.flags &&
                  4 & r.wrap &&
                  (r.check = tn(r.check, n, f, o)),
                (a -= f),
                (o += f),
                R)
              )
                break e;
            } else r.head && (r.head.comment = null);
            r.mode = 16188;
          case 16188:
            if (512 & r.flags) {
              for (; h < 16; ) {
                if (0 === a) break e;
                (a--, (l += n[o++] << h), (h += 8));
              }
              if (4 & r.wrap && l !== (65535 & r.check)) {
                ((t.msg = "header crc mismatch"), (r.mode = 16209));
                break;
              }
              ((l = 0), (h = 0));
            }
            (r.head && ((r.head.hcrc = (r.flags >> 9) & 1), (r.head.done = !0)),
              (t.adler = r.check = 0),
              (r.mode = 16191));
            break;
          case 16189:
            for (; h < 32; ) {
              if (0 === a) break e;
              (a--, (l += n[o++] << h), (h += 8));
            }
            ((t.adler = r.check = eO(l)), (l = 0), (h = 0), (r.mode = 16190));
          case 16190:
            if (0 === r.havedict)
              return (
                (t.next_out = s),
                (t.avail_out = u),
                (t.next_in = o),
                (t.avail_in = a),
                (r.hold = l),
                (r.bits = h),
                ew
              );
            ((t.adler = r.check = 1), (r.mode = 16191));
          case 16191:
            if (e === em || e === e_) break e;
          case 16192:
            if (r.last) {
              ((l >>>= 7 & h), (h -= 7 & h), (r.mode = 16206));
              break;
            }
            for (; h < 3; ) {
              if (0 === a) break e;
              (a--, (l += n[o++] << h), (h += 8));
            }
            switch (((r.last = 1 & l), (h -= 1), 3 & (l >>>= 1))) {
              case 0:
                r.mode = 16193;
                break;
              case 1:
                if ((ex(r), (r.mode = 16199), e === e_)) {
                  ((l >>>= 2), (h -= 2));
                  break e;
                }
                break;
              case 2:
                r.mode = 16196;
                break;
              case 3:
                ((t.msg = "invalid block type"), (r.mode = 16209));
            }
            ((l >>>= 2), (h -= 2));
            break;
          case 16193:
            for (l >>>= 7 & h, h -= 7 & h; h < 32; ) {
              if (0 === a) break e;
              (a--, (l += n[o++] << h), (h += 8));
            }
            if ((65535 & l) != ((l >>> 16) ^ 65535)) {
              ((t.msg = "invalid stored block lengths"), (r.mode = 16209));
              break;
            }
            if (
              ((r.length = 65535 & l),
              (l = 0),
              (h = 0),
              (r.mode = 16194),
              e === e_)
            )
              break e;
          case 16194:
            r.mode = 16195;
          case 16195:
            if ((f = r.length)) {
              if ((f > a && (f = a), f > u && (f = u), 0 === f)) break e;
              (i.set(n.subarray(o, o + f), s),
                (a -= f),
                (o += f),
                (u -= f),
                (s += f),
                (r.length -= f));
              break;
            }
            r.mode = 16191;
            break;
          case 16196:
            for (; h < 14; ) {
              if (0 === a) break e;
              (a--, (l += n[o++] << h), (h += 8));
            }
            if (
              ((r.nlen = (31 & l) + 257),
              (h -= 5),
              (r.ndist = (31 & (l >>>= 5)) + 1),
              (h -= 5),
              (r.ncode = (15 & (l >>>= 5)) + 4),
              (l >>>= 4),
              (h -= 4),
              r.nlen > 286 || r.ndist > 30)
            ) {
              ((t.msg = "too many length or distance symbols"),
                (r.mode = 16209));
              break;
            }
            ((r.have = 0), (r.mode = 16197));
          case 16197:
            for (; r.have < r.ncode; ) {
              for (; h < 3; ) {
                if (0 === a) break e;
                (a--, (l += n[o++] << h), (h += 8));
              }
              ((r.lens[M[r.have++]] = 7 & l), (l >>>= 3), (h -= 3));
            }
            for (; r.have < 19; ) r.lens[M[r.have++]] = 0;
            if (
              ((r.lencode = r.lendyn),
              (r.lenbits = 7),
              (A = { bits: r.lenbits }),
              (E = ef(0, r.lens, 0, 19, r.lencode, 0, r.work, A)),
              (r.lenbits = A.bits),
              E)
            ) {
              ((t.msg = "invalid code lengths set"), (r.mode = 16209));
              break;
            }
            ((r.have = 0), (r.mode = 16198));
          case 16198:
            for (; r.have < r.nlen + r.ndist; ) {
              for (
                ;
                (_ = (T = r.lencode[l & ((1 << r.lenbits) - 1)]) >>> 24),
                  (g = (T >>> 16) & 255),
                  (y = 65535 & T),
                  !(_ <= h);

              ) {
                if (0 === a) break e;
                (a--, (l += n[o++] << h), (h += 8));
              }
              if (y < 16) ((l >>>= _), (h -= _), (r.lens[r.have++] = y));
              else {
                if (16 === y) {
                  for (O = _ + 2; h < O; ) {
                    if (0 === a) break e;
                    (a--, (l += n[o++] << h), (h += 8));
                  }
                  if (((l >>>= _), (h -= _), 0 === r.have)) {
                    ((t.msg = "invalid bit length repeat"), (r.mode = 16209));
                    break;
                  }
                  ((R = r.lens[r.have - 1]),
                    (f = 3 + (3 & l)),
                    (l >>>= 2),
                    (h -= 2));
                } else if (17 === y) {
                  for (O = _ + 3; h < O; ) {
                    if (0 === a) break e;
                    (a--, (l += n[o++] << h), (h += 8));
                  }
                  ((l >>>= _),
                    (h -= _),
                    (R = 0),
                    (f = 3 + (7 & l)),
                    (l >>>= 3),
                    (h -= 3));
                } else {
                  for (O = _ + 7; h < O; ) {
                    if (0 === a) break e;
                    (a--, (l += n[o++] << h), (h += 8));
                  }
                  ((l >>>= _),
                    (h -= _),
                    (R = 0),
                    (f = 11 + (127 & l)),
                    (l >>>= 7),
                    (h -= 7));
                }
                if (r.have + f > r.nlen + r.ndist) {
                  ((t.msg = "invalid bit length repeat"), (r.mode = 16209));
                  break;
                }
                for (; f--; ) r.lens[r.have++] = R;
              }
            }
            if (16209 === r.mode) break;
            if (0 === r.lens[256]) {
              ((t.msg = "invalid code -- missing end-of-block"),
                (r.mode = 16209));
              break;
            }
            if (
              ((r.lenbits = 9),
              (A = { bits: r.lenbits }),
              (E = ef(1, r.lens, 0, r.nlen, r.lencode, 0, r.work, A)),
              (r.lenbits = A.bits),
              E)
            ) {
              ((t.msg = "invalid literal/lengths set"), (r.mode = 16209));
              break;
            }
            if (
              ((r.distbits = 6),
              (r.distcode = r.distdyn),
              (A = { bits: r.distbits }),
              (E = ef(2, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, A)),
              (r.distbits = A.bits),
              E)
            ) {
              ((t.msg = "invalid distances set"), (r.mode = 16209));
              break;
            }
            if (((r.mode = 16199), e === e_)) break e;
          case 16199:
            r.mode = 16200;
          case 16200:
            if (a >= 6 && u >= 258) {
              ((t.next_out = s),
                (t.avail_out = u),
                (t.next_in = o),
                (t.avail_in = a),
                (r.hold = l),
                (r.bits = h),
                eu(t, d),
                (s = t.next_out),
                (i = t.output),
                (u = t.avail_out),
                (o = t.next_in),
                (n = t.input),
                (a = t.avail_in),
                (l = r.hold),
                (h = r.bits),
                16191 === r.mode && (r.back = -1));
              break;
            }
            for (
              r.back = 0;
              (_ = (T = r.lencode[l & ((1 << r.lenbits) - 1)]) >>> 24),
                (g = (T >>> 16) & 255),
                (y = 65535 & T),
                !(_ <= h);

            ) {
              if (0 === a) break e;
              (a--, (l += n[o++] << h), (h += 8));
            }
            if (g && (240 & g) == 0) {
              for (
                w = _, v = g, b = y;
                (_ =
                  (T = r.lencode[b + ((l & ((1 << (w + v)) - 1)) >> w)]) >>>
                  24),
                  (g = (T >>> 16) & 255),
                  (y = 65535 & T),
                  !(w + _ <= h);

              ) {
                if (0 === a) break e;
                (a--, (l += n[o++] << h), (h += 8));
              }
              ((l >>>= w), (h -= w), (r.back += w));
            }
            if (
              ((l >>>= _), (h -= _), (r.back += _), (r.length = y), 0 === g)
            ) {
              r.mode = 16205;
              break;
            }
            if (32 & g) {
              ((r.back = -1), (r.mode = 16191));
              break;
            }
            if (64 & g) {
              ((t.msg = "invalid literal/length code"), (r.mode = 16209));
              break;
            }
            ((r.extra = 15 & g), (r.mode = 16201));
          case 16201:
            if (r.extra) {
              for (O = r.extra; h < O; ) {
                if (0 === a) break e;
                (a--, (l += n[o++] << h), (h += 8));
              }
              ((r.length += l & ((1 << r.extra) - 1)),
                (l >>>= r.extra),
                (h -= r.extra),
                (r.back += r.extra));
            }
            ((r.was = r.length), (r.mode = 16202));
          case 16202:
            for (
              ;
              (_ = (T = r.distcode[l & ((1 << r.distbits) - 1)]) >>> 24),
                (g = (T >>> 16) & 255),
                (y = 65535 & T),
                !(_ <= h);

            ) {
              if (0 === a) break e;
              (a--, (l += n[o++] << h), (h += 8));
            }
            if ((240 & g) == 0) {
              for (
                w = _, v = g, b = y;
                (_ =
                  (T = r.distcode[b + ((l & ((1 << (w + v)) - 1)) >> w)]) >>>
                  24),
                  (g = (T >>> 16) & 255),
                  (y = 65535 & T),
                  !(w + _ <= h);

              ) {
                if (0 === a) break e;
                (a--, (l += n[o++] << h), (h += 8));
              }
              ((l >>>= w), (h -= w), (r.back += w));
            }
            if (((l >>>= _), (h -= _), (r.back += _), 64 & g)) {
              ((t.msg = "invalid distance code"), (r.mode = 16209));
              break;
            }
            ((r.offset = y), (r.extra = 15 & g), (r.mode = 16203));
          case 16203:
            if (r.extra) {
              for (O = r.extra; h < O; ) {
                if (0 === a) break e;
                (a--, (l += n[o++] << h), (h += 8));
              }
              ((r.offset += l & ((1 << r.extra) - 1)),
                (l >>>= r.extra),
                (h -= r.extra),
                (r.back += r.extra));
            }
            if (r.offset > r.dmax) {
              ((t.msg = "invalid distance too far back"), (r.mode = 16209));
              break;
            }
            r.mode = 16204;
          case 16204:
            if (0 === u) break e;
            if (((f = d - u), r.offset > f)) {
              if ((f = r.offset - f) > r.whave && r.sane) {
                ((t.msg = "invalid distance too far back"), (r.mode = 16209));
                break;
              }
              (f > r.wnext
                ? ((f -= r.wnext), (p = r.wsize - f))
                : (p = r.wnext - f),
                f > r.length && (f = r.length),
                (m = r.window));
            } else ((m = i), (p = s - r.offset), (f = r.length));
            (f > u && (f = u), (u -= f), (r.length -= f));
            do i[s++] = m[p++];
            while (--f);
            0 === r.length && (r.mode = 16200);
            break;
          case 16205:
            if (0 === u) break e;
            ((i[s++] = r.length), u--, (r.mode = 16200));
            break;
          case 16206:
            if (r.wrap) {
              for (; h < 32; ) {
                if (0 === a) break e;
                (a--, (l |= n[o++] << h), (h += 8));
              }
              if (
                ((d -= u),
                (t.total_out += d),
                (r.total += d),
                4 & r.wrap &&
                  d &&
                  (t.adler = r.check =
                    r.flags
                      ? tn(r.check, i, d, s - d)
                      : te(r.check, i, d, s - d)),
                (d = u),
                4 & r.wrap && (r.flags ? l : eO(l)) !== r.check)
              ) {
                ((t.msg = "incorrect data check"), (r.mode = 16209));
                break;
              }
              ((l = 0), (h = 0));
            }
            r.mode = 16207;
          case 16207:
            if (r.wrap && r.flags) {
              for (; h < 32; ) {
                if (0 === a) break e;
                (a--, (l += n[o++] << h), (h += 8));
              }
              if (4 & r.wrap && l !== (0 | r.total)) {
                ((t.msg = "incorrect length check"), (r.mode = 16209));
                break;
              }
              ((l = 0), (h = 0));
            }
            r.mode = 16208;
          case 16208:
            E = ey;
            break e;
          case 16209:
            E = eb;
            break e;
          case 16210:
            return eR;
          default:
            return ev;
        }
      return (
        (t.next_out = s),
        (t.avail_out = u),
        (t.next_in = o),
        (t.avail_in = a),
        (r.hold = l),
        (r.bits = h),
        (r.wsize ||
          (d !== t.avail_out &&
            r.mode < 16209 &&
            (r.mode < 16206 || e !== ep))) &&
          eC(t, t.output, t.next_out, d - t.avail_out),
        (c -= t.avail_in),
        (d -= t.avail_out),
        (t.total_in += c),
        (t.total_out += d),
        (r.total += d),
        4 & r.wrap &&
          d &&
          (t.adler = r.check =
            r.flags
              ? tn(r.check, i, d, t.next_out - d)
              : te(r.check, i, d, t.next_out - d)),
        (t.data_type =
          r.bits +
          64 * !!r.last +
          128 * (16191 === r.mode) +
          256 * (16199 === r.mode || 16194 === r.mode)),
        ((0 === c && 0 === d) || e === ep) && E === eg && (E = eE),
        E
      );
    },
    ek = (t) => {
      if (eN(t)) return ev;
      let e = t.state;
      return (e.window && (e.window = null), (t.state = null), eg);
    },
    eL = (t, e) => {
      let r,
        n = e.length;
      return eN(t) || (0 !== (r = t.state).wrap && 16190 !== r.mode)
        ? ev
        : 16190 === r.mode && te(1, e, n, 0) !== r.check
          ? eb
          : eC(t, e, n, n)
            ? ((r.mode = 16210), eR)
            : ((r.havedict = 1), eg);
    },
    eD = function () {
      ((this.text = 0),
        (this.time = 0),
        (this.xflags = 0),
        (this.os = 0),
        (this.extra = null),
        (this.extra_len = 0),
        (this.name = ""),
        (this.comment = ""),
        (this.hcrc = 0),
        (this.done = !1));
    };
  let eP = Object.prototype.toString,
    {
      Z_NO_FLUSH: eU,
      Z_FINISH: eB,
      Z_OK: ez,
      Z_STREAM_END: eH,
      Z_NEED_DICT: eG,
      Z_STREAM_ERROR: ej,
      Z_DATA_ERROR: eV,
      Z_MEM_ERROR: eF,
    } = to;
  function eK(t) {
    this.options = tQ({ chunkSize: 65536, windowBits: 15, to: "" }, t || {});
    let e = this.options;
    (e.raw &&
      e.windowBits >= 0 &&
      e.windowBits < 16 &&
      ((e.windowBits = -e.windowBits),
      0 === e.windowBits && (e.windowBits = -15)),
      e.windowBits >= 0 &&
        e.windowBits < 16 &&
        !(t && t.windowBits) &&
        (e.windowBits += 32),
      e.windowBits > 15 &&
        e.windowBits < 48 &&
        (15 & e.windowBits) == 0 &&
        (e.windowBits |= 15),
      (this.err = 0),
      (this.msg = ""),
      (this.ended = !1),
      (this.chunks = []),
      (this.strm = new t5()),
      (this.strm.avail_out = 0));
    let r = ((t, e) => {
      if (!t) return ev;
      let r = new eT();
      ((t.state = r), (r.strm = t), (r.window = null), (r.mode = 16180));
      let n = ((t, e) => {
        let r;
        if (eN(t)) return ev;
        let n = t.state;
        return (e < 0
          ? ((r = 0), (e = -e))
          : ((r = (e >> 4) + 5), e < 48 && (e &= 15)),
        e && (e < 8 || e > 15))
          ? ev
          : (null !== n.window && n.wbits !== e && (n.window = null),
            (n.wrap = r),
            (n.wbits = e),
            eM(t));
      })(t, e);
      return (n !== eg && (t.state = null), n);
    })(this.strm, e.windowBits);
    if (
      r !== ez ||
      ((this.header = new eD()),
      ((t, e) => {
        if (eN(t)) return;
        let r = t.state;
        return (2 & r.wrap) == 0 || ((r.head = e), (e.done = !1));
      })(this.strm, this.header),
      e.dictionary &&
        ("string" == typeof e.dictionary
          ? (e.dictionary = t2(e.dictionary))
          : "[object ArrayBuffer]" === eP.call(e.dictionary) &&
            (e.dictionary = new Uint8Array(e.dictionary)),
        e.raw) &&
        (r = eL(this.strm, e.dictionary)) !== ez)
    )
      throw Error(ti[r]);
  }
  function eZ(t, e) {
    let r = new eK(e);
    if ((r.push(t), r.err)) throw r.msg || ti[r.err];
    return r.result;
  }
  ((eK.prototype.push = function (t, e) {
    let r,
      n,
      i,
      o = this.strm,
      s = this.options.chunkSize,
      a = this.options.dictionary;
    if (this.ended) return !1;
    for (
      n = e === ~~e ? e : !0 === e ? eB : eU,
        "[object ArrayBuffer]" === eP.call(t)
          ? (o.input = new Uint8Array(t))
          : (o.input = t),
        o.next_in = 0,
        o.avail_in = o.input.length;
      ;

    ) {
      for (
        0 === o.avail_out &&
          ((o.output = new Uint8Array(s)), (o.next_out = 0), (o.avail_out = s)),
          (r = eS(o, n)) === eG &&
            a &&
            ((r = eL(o, a)) === ez ? (r = eS(o, n)) : r === eV && (r = eG));
        o.avail_in > 0 && r === eH && o.state.wrap > 0 && 0 !== t[o.next_in];

      )
        (eM(o), (r = eS(o, n)));
      switch (r) {
        case ej:
        case eV:
        case eG:
        case eF:
          return (this.onEnd(r), (this.ended = !0), !1);
      }
      if (((i = o.avail_out), o.next_out && (0 === o.avail_out || r === eH)))
        if ("string" === this.options.to) {
          let t = t3(o.output, o.next_out),
            e = o.next_out - t,
            r = t6(o.output, t);
          ((o.next_out = e),
            (o.avail_out = s - e),
            e && o.output.set(o.output.subarray(t, t + e), 0),
            this.onData(r));
        } else
          this.onData(
            o.output.length === o.next_out
              ? o.output
              : o.output.subarray(0, o.next_out),
          );
      if (r !== ez || 0 !== i) {
        if (r === eH)
          return ((r = ek(this.strm)), this.onEnd(r), (this.ended = !0), !0);
        if (0 === o.avail_in) break;
      }
    }
    return !0;
  }),
    (eK.prototype.onData = function (t) {
      this.chunks.push(t);
    }),
    (eK.prototype.onEnd = function (t) {
      (t === ez &&
        ("string" === this.options.to
          ? (this.result = this.chunks.join(""))
          : (this.result = tJ(this.chunks))),
        (this.chunks = []),
        (this.err = t),
        (this.msg = this.strm.msg));
    }));
  let {
      Deflate: eq,
      deflate: e$,
      deflateRaw: eW,
      gzip: eX,
    } = {
      Deflate: es,
      deflate: ea,
      deflateRaw: function (t, e) {
        return (((e = e || {}).raw = !0), ea(t, e));
      },
      gzip: function (t, e) {
        return (((e = e || {}).gzip = !0), ea(t, e));
      },
      constants: to,
    },
    {
      Inflate: eY,
      inflate: eQ,
      inflateRaw: eJ,
      ungzip: e0,
    } = {
      Inflate: eK,
      inflate: eZ,
      inflateRaw: function (t, e) {
        return (((e = e || {}).raw = !0), eZ(t, e));
      },
      ungzip: eZ,
      constants: to,
    };
  var e1 = t.i(610482);
  let e2 = (t) => "version" in t;
  function e6(t) {
    return new TextDecoder("utf-8").decode(t);
  }
  function e3(t) {
    return v.f.encode(t);
  }
  function e5(t) {
    return w.Buffer.from(t, "base64");
  }
  var e8 = Object.freeze({
    __proto__: null,
    hex: Object.freeze({
      __proto__: null,
      encode: function (t) {
        return t.reduce((t, e) => t + e.toString(16).padStart(2, "0"), "0x");
      },
      decode: function (t) {
        (0 === t.indexOf("0x") && (t = t.substr(2)),
          t.length % 2 == 1 && (t = "0" + t));
        let e = t.match(/.{2}/g);
        return null === e
          ? w.Buffer.from([])
          : w.Buffer.from(e.map((t) => parseInt(t, 16)));
      },
    }),
    utf8: Object.freeze({
      __proto__: null,
      decode: e6,
      encode: function (t) {
        return new TextEncoder().encode(t);
      },
    }),
    bs58: Object.freeze({
      __proto__: null,
      encode: e3,
      decode: function (t) {
        return v.f.decode(t);
      },
    }),
    base64: Object.freeze({
      __proto__: null,
      encode: function (t) {
        return t.toString("base64");
      },
      decode: e5,
    }),
  });
  function e4(t) {
    return "accounts" in t;
  }
  async function e9(t) {
    let e = (await y.PublicKey.findProgramAddress([], t))[0];
    return await y.PublicKey.createWithSeed(e, "anchor:idl", t);
  }
  let e7 = R.struct([R.publicKey("authority"), R.vecU8("data")]);
  function rt(t, e, r, n) {
    return (null == t ? void 0 : t.length) ? (t[0].name ? r(t) : n(t)) : e();
  }
  function re(t) {
    let e = new Map();
    return (
      t.errors &&
        t.errors.forEach((t) => {
          var r;
          let n = null != (r = t.msg) ? r : t.name;
          e.set(t.code, n);
        }),
      e
    );
  }
  function rr(t, ...e) {
    if (t.args.length != e.length) throw Error("Invalid argument length");
    let r = {},
      n = 0;
    return (
      t.args.forEach((t) => {
        ((r[t.name] = e[n]), (n += 1));
      }),
      r
    );
  }
  function rn(t, e = {}) {
    t.forEach((t) => {
      if (e4(t)) rn(t.accounts, e[t.name]);
      else if (!e[t.name]) throw Error(`Account \`${t.name}\` not provided.`);
    });
  }
  function ri(t) {
    return t instanceof y.PublicKey ? t : new y.PublicKey(t);
  }
  class ro extends TypeError {
    constructor(t, e) {
      let r,
        { message: n, ...i } = t,
        { path: o } = t;
      (super(0 === o.length ? n : "At path: " + o.join(".") + " -- " + n),
        (this.value = void 0),
        (this.key = void 0),
        (this.type = void 0),
        (this.refinement = void 0),
        (this.path = void 0),
        (this.branch = void 0),
        (this.failures = void 0),
        Object.assign(this, i),
        (this.name = this.constructor.name),
        (this.failures = () => {
          var n;
          return null != (n = r) ? n : (r = [t, ...e()]);
        }));
    }
  }
  function rs(t) {
    return "object" == typeof t && null != t;
  }
  function ra(t) {
    return "string" == typeof t ? JSON.stringify(t) : "" + t;
  }
  function* ru(t, e, r, n) {
    var i;
    for (let o of ((rs((i = t)) && "function" == typeof i[Symbol.iterator]) ||
      (t = [t]),
    t)) {
      let t = (function (t, e, r, n) {
        if (!0 === t) return;
        !1 === t ? (t = {}) : "string" == typeof t && (t = { message: t });
        let { path: i, branch: o } = e,
          { type: s } = r,
          {
            refinement: a,
            message: u = "Expected a value of type `" +
              s +
              "`" +
              (a ? " with refinement `" + a + "`" : "") +
              ", but received: `" +
              ra(n) +
              "`",
          } = t;
        return {
          value: n,
          type: s,
          refinement: a,
          key: i[i.length - 1],
          path: i,
          branch: o,
          ...t,
          message: u,
        };
      })(o, e, r, n);
      t && (yield t);
    }
  }
  function* rl(t, e, r) {
    void 0 === r && (r = {});
    let { path: n = [], branch: i = [t], coerce: o = !1, mask: s = !1 } = r,
      a = { path: n, branch: i };
    if (
      o &&
      ((t = e.coercer(t, a)),
      s && "type" !== e.type && rs(e.schema) && rs(t) && !Array.isArray(t))
    )
      for (let r in t) void 0 === e.schema[r] && delete t[r];
    let u = !0;
    for (let r of e.validator(t, a)) ((u = !1), yield [r, void 0]);
    for (let [r, l, h] of e.entries(t, a))
      for (let e of rl(l, h, {
        path: void 0 === r ? n : [...n, r],
        branch: void 0 === r ? i : [...i, l],
        coerce: o,
        mask: s,
      }))
        e[0]
          ? ((u = !1), yield [e[0], void 0])
          : o &&
            ((l = e[1]),
            void 0 === r
              ? (t = l)
              : t instanceof Map
                ? t.set(r, l)
                : t instanceof Set
                  ? t.add(l)
                  : rs(t) && (t[r] = l));
    if (u) for (let r of e.refiner(t, a)) ((u = !1), yield [r, void 0]);
    u && (yield [void 0, t]);
  }
  class rh {
    constructor(t) {
      ((this.TYPE = void 0),
        (this.type = void 0),
        (this.schema = void 0),
        (this.coercer = void 0),
        (this.validator = void 0),
        (this.refiner = void 0),
        (this.entries = void 0));
      let {
        type: e,
        schema: r,
        validator: n,
        refiner: i,
        coercer: o = (t) => t,
        entries: s = function* () {},
      } = t;
      ((this.type = e),
        (this.schema = r),
        (this.entries = s),
        (this.coercer = o),
        n
          ? (this.validator = (t, e) => ru(n(t, e), e, this, t))
          : (this.validator = () => []),
        i
          ? (this.refiner = (t, e) => ru(i(t, e), e, this, t))
          : (this.refiner = () => []));
    }
    assert(t) {
      var e = t,
        r = this;
      let n = rd(e, r);
      if (n[0]) throw n[0];
    }
    create(t) {
      return rc(t, this);
    }
    is(t) {
      var e, r;
      return ((e = t), (r = this), !rd(e, r)[0]);
    }
    mask(t) {
      var e = t,
        r = this;
      let n = rd(e, r, { coerce: !0, mask: !0 });
      if (!n[0]) return n[1];
      throw n[0];
    }
    validate(t, e) {
      return (void 0 === e && (e = {}), rd(t, this, e));
    }
  }
  function rc(t, e) {
    let r = rd(t, e, { coerce: !0 });
    if (!r[0]) return r[1];
    throw r[0];
  }
  function rd(t, e, r) {
    void 0 === r && (r = {});
    let n = rl(t, e, r),
      i = (function (t) {
        let { done: e, value: r } = t.next();
        return e ? void 0 : r;
      })(n);
    return i[0]
      ? [
          new ro(i[0], function* () {
            for (let t of n) t[0] && (yield t[0]);
          }),
          void 0,
        ]
      : [void 0, i[1]];
  }
  function rf(t, e) {
    return new rh({ type: t, schema: null, validator: e });
  }
  function rp(t) {
    return new rh({
      type: "array",
      schema: t,
      *entries(e) {
        if (t && Array.isArray(e))
          for (let [r, n] of e.entries()) yield [r, n, t];
      },
      coercer: (t) => (Array.isArray(t) ? t.slice() : t),
      validator: (t) =>
        Array.isArray(t) || "Expected an array value, but received: " + ra(t),
    });
  }
  function rm(t) {
    let e = ra(t),
      r = typeof t;
    return new rh({
      type: "literal",
      schema: "string" === r || "number" === r || "boolean" === r ? t : null,
      validator: (r) =>
        r === t || "Expected the literal `" + e + "`, but received: " + ra(r),
    });
  }
  function r_(t) {
    return new rh({
      ...t,
      validator: (e, r) => null === e || t.validator(e, r),
      refiner: (e, r) => null === e || t.refiner(e, r),
    });
  }
  function rg() {
    return rf(
      "number",
      (t) =>
        ("number" == typeof t && !isNaN(t)) ||
        "Expected a number, but received: " + ra(t),
    );
  }
  function ry(t) {
    return new rh({
      ...t,
      validator: (e, r) => void 0 === e || t.validator(e, r),
      refiner: (e, r) => void 0 === e || t.refiner(e, r),
    });
  }
  function rw() {
    return rf(
      "string",
      (t) =>
        "string" == typeof t || "Expected a string, but received: " + ra(t),
    );
  }
  function rv(t) {
    let e = Object.keys(t);
    return new rh({
      type: "type",
      schema: t,
      *entries(r) {
        if (rs(r)) for (let n of e) yield [n, r[n], t[n]];
      },
      validator: (t) => rs(t) || "Expected an object, but received: " + ra(t),
    });
  }
  function rb(t) {
    let e = t.map((t) => t.type).join(" | ");
    return new rh({
      type: "union",
      schema: null,
      coercer: (e, r) =>
        (
          t.find((t) => {
            let [r] = t.validate(e, { coerce: !0 });
            return !r;
          }) || rR()
        ).coercer(e, r),
      validator(r, n) {
        let i = [];
        for (let e of t) {
          let [...t] = rl(r, e, n),
            [o] = t;
          if (!o[0]) return [];
          for (let [e] of t) e && i.push(e);
        }
        return [
          "Expected the value to satisfy a union of `" +
            e +
            "`, but received: " +
            ra(r),
          ...i,
        ];
      },
    });
  }
  function rR() {
    return rf("unknown", () => !0);
  }
  async function rE(t, e, r, n) {
    ((t = ri(t)), n || (n = rP()));
    let i = new y.Transaction();
    if (
      (i.add(
        new y.TransactionInstruction({
          programId: t,
          keys: null != e ? e : [],
          data: r,
        }),
      ),
      void 0 === n.sendAndConfirm)
    )
      throw Error(
        "This function requires 'Provider.sendAndConfirm' to be implemented.",
      );
    return await n.sendAndConfirm(i, []);
  }
  async function rA(t, e, r) {
    return (await rO(t, e, r)).map((t) =>
      t ? { publicKey: t.publicKey, account: t.account } : null,
    );
  }
  async function rO(t, e, r) {
    if (e.length <= 99) return await rT(t, e, r);
    {
      let n = Array.apply(0, Array(Math.ceil(e.length / 99))).map((t, r) =>
        e.slice(99 * r, (r + 1) * 99),
      );
      return (await Promise.all(n.map((e) => rT(t, e, r)))).flat();
    }
  }
  async function rT(t, e, r) {
    let n = null != r ? r : t.commitment,
      { value: i, context: o } = await t.getMultipleAccountsInfoAndContext(
        e,
        n,
      );
    return i.map((t, r) =>
      null === t ? null : { publicKey: e[r], account: t, context: o },
    );
  }
  async function rN(t, e, r, n, i) {
    var o;
    r && r.length > 0 && e.sign(...r);
    let s = e._compile(),
      a = s.serialize(),
      u = e._serialize(a).toString("base64"),
      l = { encoding: "base64", commitment: null != n ? n : t.commitment };
    (i &&
      (l.accounts = {
        encoding: "base64",
        addresses: (Array.isArray(i) ? i : s.nonProgramIds()).map((t) =>
          t.toBase58(),
        ),
      }),
      r && r.length > 0 && (l.sigVerify = !0));
    let h = [u, l],
      c = rc(await t._rpcRequest("simulateTransaction", h), rx);
    if ("error" in c) {
      let t;
      if (
        "data" in c.error &&
        (t = null == (o = c.error.data) ? void 0 : o.logs) &&
        Array.isArray(t)
      ) {
        let e = "\n    ",
          r = e + t.join(e);
        console.error(c.error.message, r);
      }
      throw new y.SendTransactionError(
        "failed to simulate transaction: " + c.error.message,
        t,
      );
    }
    return c.result;
  }
  let rM = rI(rR());
  function rI(t) {
    return rb([
      rv({ jsonrpc: rm("2.0"), id: rw(), result: t }),
      rv({
        jsonrpc: rm("2.0"),
        id: rw(),
        error: rv({ code: rR(), message: rw(), data: ry(rf("any", () => !0)) }),
      }),
    ]);
  }
  let rx =
    ((a = rv({
      err: r_(rb([rv({}), rw()])),
      logs: r_(rp(rw())),
      accounts: ry(
        r_(
          rp(
            r_(
              rv({
                executable: rf("boolean", (t) => "boolean" == typeof t),
                owner: rw(),
                lamports: rg(),
                data: rp(rw()),
                rentEpoch: ry(rg()),
              }),
            ),
          ),
        ),
      ),
      unitsConsumed: ry(rg()),
    })),
    (l = rI((u = rv({ context: rv({ slot: rg() }), value: a })))),
    (h = (t) => ("error" in t ? t : { ...t, result: rc(t.result, u) })),
    new rh({
      ...l,
      coercer: (t, e) => (rd(t, rM)[0] ? l.coercer(t, e) : l.coercer(h(t), e)),
    }));
  var rC = Object.freeze({
    __proto__: null,
    invoke: rE,
    getMultipleAccounts: rA,
    getMultipleAccountsAndContext: rO,
    simulateTransaction: rN,
  });
  class rS {
    constructor(t, e, r = rS.defaultOptions()) {
      ((this.connection = t),
        (this.wallet = e),
        (this.opts = r),
        (this.publicKey = null == e ? void 0 : e.publicKey));
    }
    static defaultOptions() {
      return { preflightCommitment: "processed", commitment: "processed" };
    }
    static local(t, e = rS.defaultOptions()) {
      throw Error("Provider local is not available on browser.");
    }
    static env() {
      throw Error("Provider env is not available on browser.");
    }
    async sendAndConfirm(t, e, r) {
      var n, i, o, s;
      if ((void 0 === r && (r = this.opts), e2(t))) e && t.sign(e);
      else if (
        ((t.feePayer = null != (n = t.feePayer) ? n : this.wallet.publicKey),
        (t.recentBlockhash = (
          await this.connection.getLatestBlockhash(r.preflightCommitment)
        ).blockhash),
        e)
      )
        for (let r of e) t.partialSign(r);
      let a = (t = await this.wallet.signTransaction(t)).serialize();
      try {
        return await rL(this.connection, a, r);
      } catch (e) {
        if (e instanceof rD) {
          let r = e3(
              e2(t)
                ? (null == (i = t.signatures) ? void 0 : i[0]) ||
                    new Uint8Array()
                : null != (o = t.signature)
                  ? o
                  : new Uint8Array(),
            ),
            n = e2(t) ? 0 : void 0,
            a = await this.connection.getTransaction(r, {
              commitment: "confirmed",
              maxSupportedTransactionVersion: n,
            });
          if (a) {
            let t = null == (s = a.meta) ? void 0 : s.logMessages;
            throw t ? new y.SendTransactionError(e.message, t) : e;
          }
        }
        throw e;
      }
    }
    async sendAll(t, e) {
      var r, n, i;
      void 0 === e && (e = this.opts);
      let o = (await this.connection.getLatestBlockhash(e.preflightCommitment))
          .blockhash,
        s = t.map((t) => {
          var e, r;
          if (e2(t.tx)) {
            let e = t.tx;
            return (t.signers && e.sign(t.signers), e);
          }
          {
            let n = t.tx,
              i = null != (e = t.signers) ? e : [];
            return (
              (n.feePayer =
                null != (r = n.feePayer) ? r : this.wallet.publicKey),
              (n.recentBlockhash = o),
              i.forEach((t) => {
                n.partialSign(t);
              }),
              n
            );
          }
        }),
        a = await this.wallet.signAllTransactions(s),
        u = [];
      for (let t = 0; t < s.length; t += 1) {
        let o = a[t],
          s = o.serialize();
        try {
          u.push(await rL(this.connection, s, e));
        } catch (t) {
          if (t instanceof rD) {
            let e = e3(
                e2(o)
                  ? (null == (r = o.signatures) ? void 0 : r[0]) ||
                      new Uint8Array()
                  : null != (n = o.signature)
                    ? n
                    : new Uint8Array(),
              ),
              s = e2(o) ? 0 : void 0,
              a = await this.connection.getTransaction(e, {
                commitment: "confirmed",
                maxSupportedTransactionVersion: s,
              });
            if (a) {
              let e = null == (i = a.meta) ? void 0 : i.logMessages;
              throw e ? new y.SendTransactionError(t.message, e) : t;
            }
          }
          throw t;
        }
      }
      return u;
    }
    async simulate(t, e, r, n) {
      let i,
        o = (
          await this.connection.getLatestBlockhash(
            null != r ? r : this.connection.commitment,
          )
        ).blockhash;
      if (
        (e2(t)
          ? (e &&
              e.length > 0 &&
              (t.sign(e), (t = await this.wallet.signTransaction(t))),
            (i = await this.connection.simulateTransaction(t, {
              commitment: r,
            })))
          : ((t.feePayer = t.feePayer || this.wallet.publicKey),
            (t.recentBlockhash = o),
            e && e.length > 0 && (t = await this.wallet.signTransaction(t)),
            (i = await rN(this.connection, t, e, r, n))),
        i.value.err)
      )
        throw new rk(i.value);
      return i.value;
    }
  }
  class rk extends Error {
    constructor(t, e) {
      (super(e), (this.simulationResponse = t));
    }
  }
  async function rL(t, e, r) {
    let n,
      i = r
        ? {
            skipPreflight: r.skipPreflight,
            preflightCommitment: r.preflightCommitment || r.commitment,
            maxRetries: r.maxRetries,
            minContextSlot: r.minContextSlot,
          }
        : {},
      o = Date.now();
    for (; Date.now() - o < 6e4; )
      try {
        let o = await t.sendRawTransaction(e, i);
        if (null == r ? void 0 : r.blockhash)
          if (0 === i.maxRetries) {
            let e = AbortSignal.timeout(15e3);
            n = (
              await t.confirmTransaction(
                { abortSignal: e, signature: o, ...r.blockhash },
                r && r.commitment,
              )
            ).value;
          } else
            n = (
              await t.confirmTransaction(
                { signature: o, ...r.blockhash },
                r && r.commitment,
              )
            ).value;
        else n = (await t.confirmTransaction(o, r && r.commitment)).value;
        if (n.err)
          throw new rD(`Raw transaction ${o} failed (${JSON.stringify(n)})`);
        return o;
      } catch (t) {
        if ("TimeoutError" === t.name) continue;
        throw t;
      }
    throw Error("Transaction failed to confirm in 60s");
  }
  class rD extends Error {
    constructor(t) {
      super(t);
    }
  }
  function rP() {
    return null === rU ? rS.local() : rU;
  }
  let rU = null;
  var rB =
      "u" > typeof globalThis ? globalThis : "u" > typeof window ? window : t.g,
    rz = {};
  Object.defineProperty(rz, "__esModule", { value: !0 });
  var rH =
      (rz.ANCHOR_ERROR__REQUIRE_EQ_VIOLATED =
      nT =
      rz.ANCHOR_ERROR__REQUIRE_VIOLATED =
      nO =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_PROGRAM_ID =
      nA =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_AUTHORITY =
      nE =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION =
      nR =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION_DELEGATE =
      nb =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION =
      nv =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION_AUTHORITY =
      nw =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION =
      ny =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_METADATA_ADDRESS =
      ng =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_AUTHORITY =
      n_ =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION =
      nm =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_MEMBER_ADDRESS =
      np =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_AUTHORITY =
      nf =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION =
      nd =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_GROUP_ADDRESS =
      nc =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_AUTHORITY =
      nh =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION =
      nl =
      rz.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_TOKEN_TOKEN_PROGRAM =
      nu =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_TOKEN_PROGRAM =
      na =
      rz.ANCHOR_ERROR__CONSTRAINT_TOKEN_TOKEN_PROGRAM =
      ns =
      rz.ANCHOR_ERROR__CONSTRAINT_ACCOUNT_IS_NONE =
      no =
      rz.ANCHOR_ERROR__CONSTRAINT_SPACE =
      ni =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_DECIMALS =
      nn =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_FREEZE_AUTHORITY =
      nr =
      rz.ANCHOR_ERROR__CONSTRAINT_MINT_MINT_AUTHORITY =
      ne =
      rz.ANCHOR_ERROR__CONSTRAINT_TOKEN_OWNER =
      nt =
      rz.ANCHOR_ERROR__CONSTRAINT_TOKEN_MINT =
      r7 =
      rz.ANCHOR_ERROR__CONSTRAINT_ZERO =
      r9 =
      rz.ANCHOR_ERROR__CONSTRAINT_ADDRESS =
      r4 =
      rz.ANCHOR_ERROR__CONSTRAINT_CLOSE =
      r8 =
      rz.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_INIT =
      r5 =
      rz.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED =
      r3 =
      rz.ANCHOR_ERROR__CONSTRAINT_STATE =
      r6 =
      rz.ANCHOR_ERROR__CONSTRAINT_EXECUTABLE =
      r2 =
      rz.ANCHOR_ERROR__CONSTRAINT_SEEDS =
      r1 =
      rz.ANCHOR_ERROR__CONSTRAINT_RENT_EXEMPT =
      r0 =
      rz.ANCHOR_ERROR__CONSTRAINT_OWNER =
      rJ =
      rz.ANCHOR_ERROR__CONSTRAINT_RAW =
      rQ =
      rz.ANCHOR_ERROR__CONSTRAINT_SIGNER =
      rY =
      rz.ANCHOR_ERROR__CONSTRAINT_HAS_ONE =
      rX =
      rz.ANCHOR_ERROR__CONSTRAINT_MUT =
      rW =
      rz.ANCHOR_ERROR__EVENT_INSTRUCTION_STUB =
      r$ =
      rz.ANCHOR_ERROR__IDL_ACCOUNT_NOT_EMPTY =
      rq =
      rz.ANCHOR_ERROR__IDL_INSTRUCTION_INVALID_PROGRAM =
      rZ =
      rz.ANCHOR_ERROR__IDL_INSTRUCTION_STUB =
      rK =
      rz.ANCHOR_ERROR__INSTRUCTION_DID_NOT_SERIALIZE =
      rF =
      rz.ANCHOR_ERROR__INSTRUCTION_DID_NOT_DESERIALIZE =
      rV =
      rz.ANCHOR_ERROR__INSTRUCTION_FALLBACK_NOT_FOUND =
      rj =
      rz.ANCHOR_ERROR__INSTRUCTION_MISSING =
        void 0),
    rG =
      (rz.ANCHOR_ERROR__DEPRECATED =
      nQ =
      rz.ANCHOR_ERROR__INVALID_NUMERIC_CONVERSION =
      nY =
      rz.ANCHOR_ERROR__TRYING_TO_INIT_PAYER_AS_PROGRAM_ACCOUNT =
      nX =
      rz.ANCHOR_ERROR__DECLARED_PROGRAM_ID_MISMATCH =
      nW =
      rz.ANCHOR_ERROR__ACCOUNT_DUPLICATE_REALLOCS =
      n$ =
      rz.ANCHOR_ERROR__ACCOUNT_REALLOC_EXCEEDS_LIMIT =
      nq =
      rz.ANCHOR_ERROR__ACCOUNT_SYSVAR_MISMATCH =
      nZ =
      rz.ANCHOR_ERROR__ACCOUNT_NOT_ASSOCIATED_TOKEN_ACCOUNT =
      nK =
      rz.ANCHOR_ERROR__ACCOUNT_NOT_PROGRAM_DATA =
      nF =
      rz.ANCHOR_ERROR__ACCOUNT_NOT_INITIALIZED =
      nV =
      rz.ANCHOR_ERROR__ACCOUNT_NOT_SYSTEM_OWNED =
      nj =
      rz.ANCHOR_ERROR__ACCOUNT_NOT_SIGNER =
      nG =
      rz.ANCHOR_ERROR__INVALID_PROGRAM_EXECUTABLE =
      nH =
      rz.ANCHOR_ERROR__INVALID_PROGRAM_ID =
      nz =
      rz.ANCHOR_ERROR__ACCOUNT_OWNED_BY_WRONG_PROGRAM =
      nB =
      rz.ANCHOR_ERROR__ACCOUNT_NOT_MUTABLE =
      nU =
      rz.ANCHOR_ERROR__ACCOUNT_NOT_ENOUGH_KEYS =
      nP =
      rz.ANCHOR_ERROR__ACCOUNT_DID_NOT_SERIALIZE =
      nD =
      rz.ANCHOR_ERROR__ACCOUNT_DID_NOT_DESERIALIZE =
      nL =
      rz.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_MISMATCH =
      nk =
      rz.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_NOT_FOUND =
      nS =
      rz.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_ALREADY_SET =
      nC =
      rz.ANCHOR_ERROR__REQUIRE_GTE_VIOLATED =
      nx =
      rz.ANCHOR_ERROR__REQUIRE_GT_VIOLATED =
      nI =
      rz.ANCHOR_ERROR__REQUIRE_KEYS_NEQ_VIOLATED =
      nM =
      rz.ANCHOR_ERROR__REQUIRE_NEQ_VIOLATED =
      nN =
      rz.ANCHOR_ERROR__REQUIRE_KEYS_EQ_VIOLATED =
        void 0),
    rj = (rz.ANCHOR_ERROR__INSTRUCTION_MISSING = 100),
    rV = (rz.ANCHOR_ERROR__INSTRUCTION_FALLBACK_NOT_FOUND = 101),
    rF = (rz.ANCHOR_ERROR__INSTRUCTION_DID_NOT_DESERIALIZE = 102),
    rK = (rz.ANCHOR_ERROR__INSTRUCTION_DID_NOT_SERIALIZE = 103),
    rZ = (rz.ANCHOR_ERROR__IDL_INSTRUCTION_STUB = 1e3),
    rq = (rz.ANCHOR_ERROR__IDL_INSTRUCTION_INVALID_PROGRAM = 1001),
    r$ = (rz.ANCHOR_ERROR__IDL_ACCOUNT_NOT_EMPTY = 1002),
    rW = (rz.ANCHOR_ERROR__EVENT_INSTRUCTION_STUB = 1500),
    rX = (rz.ANCHOR_ERROR__CONSTRAINT_MUT = 2e3),
    rY = (rz.ANCHOR_ERROR__CONSTRAINT_HAS_ONE = 2001),
    rQ = (rz.ANCHOR_ERROR__CONSTRAINT_SIGNER = 2002),
    rJ = (rz.ANCHOR_ERROR__CONSTRAINT_RAW = 2003),
    r0 = (rz.ANCHOR_ERROR__CONSTRAINT_OWNER = 2004),
    r1 = (rz.ANCHOR_ERROR__CONSTRAINT_RENT_EXEMPT = 2005),
    r2 = (rz.ANCHOR_ERROR__CONSTRAINT_SEEDS = 2006),
    r6 = (rz.ANCHOR_ERROR__CONSTRAINT_EXECUTABLE = 2007),
    r3 = (rz.ANCHOR_ERROR__CONSTRAINT_STATE = 2008),
    r5 = (rz.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED = 2009),
    r8 = (rz.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_INIT = 2010),
    r4 = (rz.ANCHOR_ERROR__CONSTRAINT_CLOSE = 2011),
    r9 = (rz.ANCHOR_ERROR__CONSTRAINT_ADDRESS = 2012),
    r7 = (rz.ANCHOR_ERROR__CONSTRAINT_ZERO = 2013),
    nt = (rz.ANCHOR_ERROR__CONSTRAINT_TOKEN_MINT = 2014),
    ne = (rz.ANCHOR_ERROR__CONSTRAINT_TOKEN_OWNER = 2015),
    nr = (rz.ANCHOR_ERROR__CONSTRAINT_MINT_MINT_AUTHORITY = 2016),
    nn = (rz.ANCHOR_ERROR__CONSTRAINT_MINT_FREEZE_AUTHORITY = 2017),
    ni = (rz.ANCHOR_ERROR__CONSTRAINT_MINT_DECIMALS = 2018),
    no = (rz.ANCHOR_ERROR__CONSTRAINT_SPACE = 2019),
    ns = (rz.ANCHOR_ERROR__CONSTRAINT_ACCOUNT_IS_NONE = 2020),
    na = (rz.ANCHOR_ERROR__CONSTRAINT_TOKEN_TOKEN_PROGRAM = 2021),
    nu = (rz.ANCHOR_ERROR__CONSTRAINT_MINT_TOKEN_PROGRAM = 2022),
    nl = (rz.ANCHOR_ERROR__CONSTRAINT_ASSOCIATED_TOKEN_TOKEN_PROGRAM = 2023),
    nh = (rz.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION = 2024),
    nc =
      (rz.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_AUTHORITY = 2025),
    nd =
      (rz.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_POINTER_EXTENSION_GROUP_ADDRESS = 2026),
    nf =
      (rz.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION = 2027),
    np =
      (rz.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_AUTHORITY = 2028),
    nm =
      (rz.ANCHOR_ERROR__CONSTRAINT_MINT_GROUP_MEMBER_POINTER_EXTENSION_MEMBER_ADDRESS = 2029),
    n_ = (rz.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION = 2030),
    ng =
      (rz.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_AUTHORITY = 2031),
    ny =
      (rz.ANCHOR_ERROR__CONSTRAINT_MINT_METADATA_POINTER_EXTENSION_METADATA_ADDRESS = 2032),
    nw = (rz.ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION = 2033),
    nv =
      (rz.ANCHOR_ERROR__CONSTRAINT_MINT_CLOSE_AUTHORITY_EXTENSION_AUTHORITY = 2034),
    nb = (rz.ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION = 2035),
    nR =
      (rz.ANCHOR_ERROR__CONSTRAINT_MINT_PERMANENT_DELEGATE_EXTENSION_DELEGATE = 2036),
    nE = (rz.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION = 2037),
    nA =
      (rz.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_AUTHORITY = 2038),
    nO =
      (rz.ANCHOR_ERROR__CONSTRAINT_MINT_TRANSFER_HOOK_EXTENSION_PROGRAM_ID = 2039),
    nT = (rz.ANCHOR_ERROR__REQUIRE_VIOLATED = 2500);
  rH = rz.ANCHOR_ERROR__REQUIRE_EQ_VIOLATED = 2501;
  var nN = (rz.ANCHOR_ERROR__REQUIRE_KEYS_EQ_VIOLATED = 2502),
    nM = (rz.ANCHOR_ERROR__REQUIRE_NEQ_VIOLATED = 2503),
    nI = (rz.ANCHOR_ERROR__REQUIRE_KEYS_NEQ_VIOLATED = 2504),
    nx = (rz.ANCHOR_ERROR__REQUIRE_GT_VIOLATED = 2505),
    nC = (rz.ANCHOR_ERROR__REQUIRE_GTE_VIOLATED = 2506),
    nS = (rz.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_ALREADY_SET = 3e3),
    nk = (rz.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_NOT_FOUND = 3001),
    nL = (rz.ANCHOR_ERROR__ACCOUNT_DISCRIMINATOR_MISMATCH = 3002),
    nD = (rz.ANCHOR_ERROR__ACCOUNT_DID_NOT_DESERIALIZE = 3003),
    nP = (rz.ANCHOR_ERROR__ACCOUNT_DID_NOT_SERIALIZE = 3004),
    nU = (rz.ANCHOR_ERROR__ACCOUNT_NOT_ENOUGH_KEYS = 3005),
    nB = (rz.ANCHOR_ERROR__ACCOUNT_NOT_MUTABLE = 3006),
    nz = (rz.ANCHOR_ERROR__ACCOUNT_OWNED_BY_WRONG_PROGRAM = 3007),
    nH = (rz.ANCHOR_ERROR__INVALID_PROGRAM_ID = 3008),
    nG = (rz.ANCHOR_ERROR__INVALID_PROGRAM_EXECUTABLE = 3009),
    nj = (rz.ANCHOR_ERROR__ACCOUNT_NOT_SIGNER = 3010),
    nV = (rz.ANCHOR_ERROR__ACCOUNT_NOT_SYSTEM_OWNED = 3011),
    nF = (rz.ANCHOR_ERROR__ACCOUNT_NOT_INITIALIZED = 3012),
    nK = (rz.ANCHOR_ERROR__ACCOUNT_NOT_PROGRAM_DATA = 3013),
    nZ = (rz.ANCHOR_ERROR__ACCOUNT_NOT_ASSOCIATED_TOKEN_ACCOUNT = 3014),
    nq = (rz.ANCHOR_ERROR__ACCOUNT_SYSVAR_MISMATCH = 3015),
    n$ = (rz.ANCHOR_ERROR__ACCOUNT_REALLOC_EXCEEDS_LIMIT = 3016),
    nW = (rz.ANCHOR_ERROR__ACCOUNT_DUPLICATE_REALLOCS = 3017),
    nX = (rz.ANCHOR_ERROR__DECLARED_PROGRAM_ID_MISMATCH = 4100),
    nY = (rz.ANCHOR_ERROR__TRYING_TO_INIT_PAYER_AS_PROGRAM_ACCOUNT = 4101),
    nQ = (rz.ANCHOR_ERROR__INVALID_NUMERIC_CONVERSION = 4102);
  rG = rz.ANCHOR_ERROR__DEPRECATED = 5e3;
  let nJ = new Set(["debug-logs"]),
    n0 = new Map();
  function n1(t) {
    return void 0 !== n0.get(t);
  }
  var n2 = Object.freeze({
    __proto__: null,
    set: function (t) {
      if (!nJ.has(t)) throw Error("Invalid feature");
      n0.set(t, !0);
    },
    isSet: n1,
  });
  class n6 extends Error {
    constructor(t) {
      (super(t), (this.name = "IdlError"));
    }
  }
  class n3 {
    constructor(t) {
      this.stack = t;
    }
    static parse(t) {
      var e;
      let r = /^Program (\w*) invoke/,
        n = /^Program \w* success/,
        i = [];
      for (let o = 0; o < t.length; o++) {
        if (n.exec(t[o])) {
          i.pop();
          continue;
        }
        let s = null == (e = r.exec(t[o])) ? void 0 : e[1];
        s && i.push(new y.PublicKey(s));
      }
      return new n3(i);
    }
  }
  class n5 extends Error {
    constructor(t, e, r, n, i, o) {
      (super(r.join("\n").replace("Program log: ", "")),
        (this.errorLogs = r),
        (this.logs = n),
        (this.error = {
          errorCode: t,
          errorMessage: e,
          comparedValues: o,
          origin: i,
        }),
        (this._programErrorStack = n3.parse(n)));
    }
    static parse(t) {
      let e;
      if (!t) return null;
      let r = t.findIndex((t) => t.startsWith("Program log: AnchorError"));
      if (-1 === r) return null;
      let n = t[r],
        i = [n];
      if (r + 1 < t.length) {
        if ("Program log: Left:" === t[r + 1]) {
          let n = /^Program log: (.*)$/,
            o = n.exec(t[r + 2])[1],
            s = n.exec(t[r + 4])[1];
          ((e = [new y.PublicKey(o), new y.PublicKey(s)]),
            i.push(...t.slice(r + 1, r + 5)));
        } else if (t[r + 1].startsWith("Program log: Left:")) {
          let n = /^Program log: (Left|Right): (.*)$/,
            o = n.exec(t[r + 1])[2],
            s = n.exec(t[r + 2])[2];
          (i.push(...t.slice(r + 1, r + 3)), (e = [o, s]));
        }
      }
      let o =
          /^Program log: AnchorError occurred\. Error Code: (.*)\. Error Number: (\d*)\. Error Message: (.*)\./.exec(
            n,
          ),
        s =
          /^Program log: AnchorError thrown in (.*):(\d*)\. Error Code: (.*)\. Error Number: (\d*)\. Error Message: (.*)\./.exec(
            n,
          ),
        a =
          /^Program log: AnchorError caused by account: (.*)\. Error Code: (.*)\. Error Number: (\d*)\. Error Message: (.*)\./.exec(
            n,
          );
      if (o) {
        let [r, n, s] = o.slice(1, 4);
        return new n5({ code: r, number: parseInt(n) }, s, i, t, void 0, e);
      }
      if (s) {
        let [r, n, o, a, u] = s.slice(1, 6);
        return new n5(
          { code: o, number: parseInt(a) },
          u,
          i,
          t,
          { file: r, line: parseInt(n) },
          e,
        );
      }
      if (!a) return null;
      {
        let [r, n, o, s] = a.slice(1, 5);
        return new n5({ code: n, number: parseInt(o) }, s, i, t, r, e);
      }
    }
    get program() {
      return this._programErrorStack.stack[
        this._programErrorStack.stack.length - 1
      ];
    }
    get programErrorStack() {
      return this._programErrorStack.stack;
    }
    toString() {
      return this.message;
    }
  }
  class n8 extends Error {
    constructor(t, e, r) {
      (super(),
        (this.code = t),
        (this.msg = e),
        (this.logs = r),
        r && (this._programErrorStack = n3.parse(r)));
    }
    static parse(t, e) {
      let r,
        n,
        i = t.toString();
      if (i.includes("custom program error:")) {
        let t = i.split("custom program error: ");
        if (2 !== t.length) return null;
        r = t[1];
      } else {
        let t = i.match(/"Custom":([0-9]+)}/g);
        if (!t || t.length > 1) return null;
        r = t[0].match(/([0-9]+)/g)[0];
      }
      try {
        n = parseInt(r);
      } catch (t) {
        return null;
      }
      let o = e.get(n);
      return void 0 !== o || void 0 !== (o = n7.get(n))
        ? new n8(n, o, t.logs)
        : null;
    }
    get program() {
      var t;
      return null == (t = this._programErrorStack)
        ? void 0
        : t.stack[this._programErrorStack.stack.length - 1];
    }
    get programErrorStack() {
      var t;
      return null == (t = this._programErrorStack) ? void 0 : t.stack;
    }
    toString() {
      return this.msg;
    }
  }
  function n4(t, e) {
    n1("debug-logs") && console.log("Translating error:", t);
    let r = n5.parse(t.logs);
    if (r) return r;
    let n = n8.parse(t, e);
    return (
      n ||
      (t.logs
        ? ((t.programErrorStack = n3.parse(t.logs)),
          new Proxy(t, {
            get: function (e, r) {
              return "programErrorStack" === r
                ? e.programErrorStack.stack
                : "program" === r
                  ? e.programErrorStack.stack[
                      t.programErrorStack.stack.length - 1
                    ]
                  : Reflect.get(...arguments);
            },
          }))
        : t)
    );
  }
  let n9 = {
      InstructionMissing: rj,
      InstructionFallbackNotFound: rV,
      InstructionDidNotDeserialize: rF,
      InstructionDidNotSerialize: rK,
      IdlInstructionStub: rZ,
      IdlInstructionInvalidProgram: rq,
      IdlAccountNotEmpty: r$,
      EventInstructionStub: rW,
      ConstraintMut: rX,
      ConstraintHasOne: rY,
      ConstraintSigner: rQ,
      ConstraintRaw: rJ,
      ConstraintOwner: r0,
      ConstraintRentExempt: r1,
      ConstraintSeeds: r2,
      ConstraintExecutable: r6,
      ConstraintState: r3,
      ConstraintAssociated: r5,
      ConstraintAssociatedInit: r8,
      ConstraintClose: r4,
      ConstraintAddress: r9,
      ConstraintZero: r7,
      ConstraintTokenMint: nt,
      ConstraintTokenOwner: ne,
      ConstraintMintMintAuthority: nr,
      ConstraintMintFreezeAuthority: nn,
      ConstraintMintDecimals: ni,
      ConstraintSpace: no,
      ConstraintAccountIsNone: ns,
      ConstraintTokenTokenProgram: na,
      ConstraintMintTokenProgram: nu,
      ConstraintAssociatedTokenTokenProgram: nl,
      ConstraintMintGroupPointerExtension: nh,
      ConstraintMintGroupPointerExtensionAuthority: nc,
      ConstraintMintGroupPointerExtensionGroupAddress: nd,
      ConstraintMintGroupMemberPointerExtension: nf,
      ConstraintMintGroupMemberPointerExtensionAuthority: np,
      ConstraintMintGroupMemberPointerExtensionMemberAddress: nm,
      ConstraintMintMetadataPointerExtension: n_,
      ConstraintMintMetadataPointerExtensionAuthority: ng,
      ConstraintMintMetadataPointerExtensionMetadataAddress: ny,
      ConstraintMintCloseAuthorityExtension: nw,
      ConstraintMintCloseAuthorityExtensionAuthority: nv,
      ConstraintMintPermanentDelegateExtension: nb,
      ConstraintMintPermanentDelegateExtensionDelegate: nR,
      ConstraintMintTransferHookExtension: nE,
      ConstraintMintTransferHookExtensionAuthority: nA,
      ConstraintMintTransferHookExtensionProgramId: nO,
      RequireViolated: nT,
      RequireEqViolated: rH,
      RequireKeysEqViolated: nN,
      RequireNeqViolated: nM,
      RequireKeysNeqViolated: nI,
      RequireGtViolated: nx,
      RequireGteViolated: nC,
      AccountDiscriminatorAlreadySet: nS,
      AccountDiscriminatorNotFound: nk,
      AccountDiscriminatorMismatch: nL,
      AccountDidNotDeserialize: nD,
      AccountDidNotSerialize: nP,
      AccountNotEnoughKeys: nU,
      AccountNotMutable: nB,
      AccountOwnedByWrongProgram: nz,
      InvalidProgramId: nH,
      InvalidProgramExecutable: nG,
      AccountNotSigner: nj,
      AccountNotSystemOwned: nV,
      AccountNotInitialized: nF,
      AccountNotProgramData: nK,
      AccountNotAssociatedTokenAccount: nZ,
      AccountSysvarMismatch: nq,
      AccountReallocExceedsLimit: n$,
      AccountDuplicateReallocs: nW,
      DeclaredProgramIdMismatch: nX,
      TryingToInitPayerAsProgramAccount: nY,
      InvalidNumericConversion: nQ,
      Deprecated: rG,
    },
    n7 = new Map([
      [n9.InstructionMissing, "Instruction discriminator not provided"],
      [n9.InstructionFallbackNotFound, "Fallback functions are not supported"],
      [
        n9.InstructionDidNotDeserialize,
        "The program could not deserialize the given instruction",
      ],
      [
        n9.InstructionDidNotSerialize,
        "The program could not serialize the given instruction",
      ],
      [
        n9.IdlInstructionStub,
        "The program was compiled without idl instructions",
      ],
      [
        n9.IdlInstructionInvalidProgram,
        "The transaction was given an invalid program for the IDL instruction",
      ],
      [
        n9.IdlAccountNotEmpty,
        "IDL account must be empty in order to resize, try closing first",
      ],
      [
        n9.EventInstructionStub,
        "The program was compiled without `event-cpi` feature",
      ],
      [n9.ConstraintMut, "A mut constraint was violated"],
      [n9.ConstraintHasOne, "A has one constraint was violated"],
      [n9.ConstraintSigner, "A signer constraint was violated"],
      [n9.ConstraintRaw, "A raw constraint was violated"],
      [n9.ConstraintOwner, "An owner constraint was violated"],
      [n9.ConstraintRentExempt, "A rent exemption constraint was violated"],
      [n9.ConstraintSeeds, "A seeds constraint was violated"],
      [n9.ConstraintExecutable, "An executable constraint was violated"],
      [
        n9.ConstraintState,
        "Deprecated Error, feel free to replace with something else",
      ],
      [n9.ConstraintAssociated, "An associated constraint was violated"],
      [
        n9.ConstraintAssociatedInit,
        "An associated init constraint was violated",
      ],
      [n9.ConstraintClose, "A close constraint was violated"],
      [n9.ConstraintAddress, "An address constraint was violated"],
      [n9.ConstraintZero, "Expected zero account discriminant"],
      [n9.ConstraintTokenMint, "A token mint constraint was violated"],
      [n9.ConstraintTokenOwner, "A token owner constraint was violated"],
      [
        n9.ConstraintMintMintAuthority,
        "A mint mint authority constraint was violated",
      ],
      [
        n9.ConstraintMintFreezeAuthority,
        "A mint freeze authority constraint was violated",
      ],
      [n9.ConstraintMintDecimals, "A mint decimals constraint was violated"],
      [n9.ConstraintSpace, "A space constraint was violated"],
      [
        n9.ConstraintAccountIsNone,
        "A required account for the constraint is None",
      ],
      [
        n9.ConstraintTokenTokenProgram,
        "A token account token program constraint was violated",
      ],
      [
        n9.ConstraintMintTokenProgram,
        "A mint token program constraint was violated",
      ],
      [
        n9.ConstraintAssociatedTokenTokenProgram,
        "An associated token account token program constraint was violated",
      ],
      [
        n9.ConstraintMintGroupPointerExtension,
        "A group pointer extension constraint was violated",
      ],
      [
        n9.ConstraintMintGroupPointerExtensionAuthority,
        "A group pointer extension authority constraint was violated",
      ],
      [
        n9.ConstraintMintGroupPointerExtensionGroupAddress,
        "A group pointer extension group address constraint was violated",
      ],
      [
        n9.ConstraintMintGroupMemberPointerExtension,
        "A group member pointer extension constraint was violated",
      ],
      [
        n9.ConstraintMintGroupMemberPointerExtensionAuthority,
        "A group member pointer extension authority constraint was violated",
      ],
      [
        n9.ConstraintMintGroupMemberPointerExtensionMemberAddress,
        "A group member pointer extension group address constraint was violated",
      ],
      [
        n9.ConstraintMintMetadataPointerExtension,
        "A metadata pointer extension constraint was violated",
      ],
      [
        n9.ConstraintMintMetadataPointerExtensionAuthority,
        "A metadata pointer extension authority constraint was violated",
      ],
      [
        n9.ConstraintMintMetadataPointerExtensionMetadataAddress,
        "A metadata pointer extension metadata address constraint was violated",
      ],
      [
        n9.ConstraintMintCloseAuthorityExtension,
        "A close authority constraint was violated",
      ],
      [
        n9.ConstraintMintCloseAuthorityExtensionAuthority,
        "A close authority extension authority constraint was violated",
      ],
      [
        n9.ConstraintMintPermanentDelegateExtension,
        "A permanent delegate extension constraint was violated",
      ],
      [
        n9.ConstraintMintPermanentDelegateExtensionDelegate,
        "A permanent delegate extension delegate constraint was violated",
      ],
      [
        n9.ConstraintMintTransferHookExtension,
        "A transfer hook extension constraint was violated",
      ],
      [
        n9.ConstraintMintTransferHookExtensionAuthority,
        "A transfer hook extension authority constraint was violated",
      ],
      [
        n9.ConstraintMintTransferHookExtensionProgramId,
        "A transfer hook extension transfer hook program id constraint was violated",
      ],
      [n9.RequireViolated, "A require expression was violated"],
      [n9.RequireEqViolated, "A require_eq expression was violated"],
      [n9.RequireKeysEqViolated, "A require_keys_eq expression was violated"],
      [n9.RequireNeqViolated, "A require_neq expression was violated"],
      [n9.RequireKeysNeqViolated, "A require_keys_neq expression was violated"],
      [n9.RequireGtViolated, "A require_gt expression was violated"],
      [n9.RequireGteViolated, "A require_gte expression was violated"],
      [
        n9.AccountDiscriminatorAlreadySet,
        "The account discriminator was already set on this account",
      ],
      [
        n9.AccountDiscriminatorNotFound,
        "No discriminator was found on the account",
      ],
      [
        n9.AccountDiscriminatorMismatch,
        "Account discriminator did not match what was expected",
      ],
      [n9.AccountDidNotDeserialize, "Failed to deserialize the account"],
      [n9.AccountDidNotSerialize, "Failed to serialize the account"],
      [
        n9.AccountNotEnoughKeys,
        "Not enough account keys given to the instruction",
      ],
      [n9.AccountNotMutable, "The given account is not mutable"],
      [
        n9.AccountOwnedByWrongProgram,
        "The given account is owned by a different program than expected",
      ],
      [n9.InvalidProgramId, "Program ID was not as expected"],
      [n9.InvalidProgramExecutable, "Program account is not executable"],
      [n9.AccountNotSigner, "The given account did not sign"],
      [
        n9.AccountNotSystemOwned,
        "The given account is not owned by the system program",
      ],
      [
        n9.AccountNotInitialized,
        "The program expected this account to be already initialized",
      ],
      [
        n9.AccountNotProgramData,
        "The given account is not a program data account",
      ],
      [
        n9.AccountNotAssociatedTokenAccount,
        "The given account is not the associated token account",
      ],
      [
        n9.AccountSysvarMismatch,
        "The given public key does not match the required sysvar",
      ],
      [
        n9.AccountReallocExceedsLimit,
        "The account reallocation exceeds the MAX_PERMITTED_DATA_INCREASE limit",
      ],
      [
        n9.AccountDuplicateReallocs,
        "The account was duplicated for more than one reallocation",
      ],
      [
        n9.DeclaredProgramIdMismatch,
        "The declared program id does not match the actual program id",
      ],
      [
        n9.TryingToInitPayerAsProgramAccount,
        "You cannot/should not initialize the payer account as a program account",
      ],
      [
        n9.InvalidNumericConversion,
        "The program could not perform the numeric conversion, out of range integral type conversion attempted",
      ],
      [
        n9.Deprecated,
        "The API being used is deprecated and should no longer be used",
      ],
    ]);
  class it {
    static fieldLayout(t, e = [], r) {
      let n = t.name;
      switch (t.type) {
        case "bool":
          return R.bool(n);
        case "u8":
          return R.u8(n);
        case "i8":
          return R.i8(n);
        case "u16":
          return R.u16(n);
        case "i16":
          return R.i16(n);
        case "u32":
          return R.u32(n);
        case "i32":
          return R.i32(n);
        case "f32":
          return R.f32(n);
        case "u64":
          return R.u64(n);
        case "i64":
          return R.i64(n);
        case "f64":
          return R.f64(n);
        case "u128":
          return R.u128(n);
        case "i128":
          return R.i128(n);
        case "u256":
          return R.u256(n);
        case "i256":
          return R.i256(n);
        case "bytes":
          return R.vecU8(n);
        case "string":
          return R.str(n);
        case "pubkey":
          return R.publicKey(n);
        default:
          if ("option" in t.type)
            return R.option(it.fieldLayout({ type: t.type.option }, e, r), n);
          if ("vec" in t.type)
            return R.vec(it.fieldLayout({ type: t.type.vec }, e, r), n);
          if ("array" in t.type) {
            let [i, o] = t.type.array;
            return (
              (o = it.resolveArrayLen(o, r)),
              R.array(it.fieldLayout({ type: i }, e, r), o, n)
            );
          }
          if ("defined" in t.type) {
            if (!e) throw new n6("User defined types not provided");
            let i = t.type.defined.name,
              o = e.find((t) => t.name === i);
            if (!o) throw new n6(`Type not found: ${t.name}`);
            return it.typeDefLayout({
              typeDef: o,
              types: e,
              genericArgs: null != r ? r : t.type.defined.generics,
              name: n,
            });
          }
          if ("generic" in t.type) {
            let n = null == r ? void 0 : r.at(0);
            if ((null == n ? void 0 : n.kind) !== "type")
              throw new n6(`Invalid generic field: ${t.name}`);
            return it.fieldLayout({ ...t, type: n.type }, e);
          }
          throw new n6(`Not yet implemented: ${JSON.stringify(t.type)}`);
      }
    }
    static typeDefLayout({ typeDef: t, types: e, name: r, genericArgs: n }) {
      switch (t.type.kind) {
        case "struct": {
          let i = rt(
            t.type.fields,
            () => [],
            (r) =>
              r.map((r) => {
                let i = n
                  ? it.resolveGenericArgs({
                      type: r.type,
                      typeDef: t,
                      genericArgs: n,
                    })
                  : n;
                return it.fieldLayout(r, e, i);
              }),
            (r) =>
              r.map((r, i) => {
                let o = n
                  ? it.resolveGenericArgs({
                      type: r,
                      typeDef: t,
                      genericArgs: n,
                    })
                  : n;
                return it.fieldLayout({ name: i.toString(), type: r }, e, o);
              }),
          );
          return R.struct(i, r);
        }
        case "enum": {
          let i = t.type.variants.map((r) => {
            let i = rt(
              r.fields,
              () => [],
              (r) =>
                r.map((r) => {
                  let i = n
                    ? it.resolveGenericArgs({
                        type: r.type,
                        typeDef: t,
                        genericArgs: n,
                      })
                    : n;
                  return it.fieldLayout(r, e, i);
                }),
              (r) =>
                r.map((r, i) => {
                  let o = n
                    ? it.resolveGenericArgs({
                        type: r,
                        typeDef: t,
                        genericArgs: n,
                      })
                    : n;
                  return it.fieldLayout({ name: i.toString(), type: r }, e, o);
                }),
            );
            return R.struct(i, r.name);
          });
          if (void 0 !== r) return R.rustEnum(i).replicate(r);
          return R.rustEnum(i, r);
        }
        case "type":
          return it.fieldLayout({ type: t.type.alias, name: r }, e);
      }
    }
    static typeSize(t, e, r) {
      var n;
      switch (t) {
        case "bool":
        case "u8":
        case "i8":
        case "bytes":
        case "string":
          return 1;
        case "i16":
        case "u16":
          return 2;
        case "u32":
        case "i32":
        case "f32":
          return 4;
        case "u64":
        case "i64":
        case "f64":
          return 8;
        case "u128":
        case "i128":
          return 16;
        case "u256":
        case "i256":
        case "pubkey":
          return 32;
        default:
          if ("option" in t) return 1 + it.typeSize(t.option, e, r);
          if ("coption" in t) return 4 + it.typeSize(t.coption, e, r);
          if ("vec" in t) return 1;
          if ("array" in t) {
            let [n, i] = t.array;
            return ((i = it.resolveArrayLen(i, r)), it.typeSize(n, e, r) * i);
          }
          if ("defined" in t) {
            let i =
              null == (n = e.types)
                ? void 0
                : n.find((e) => e.name === t.defined.name);
            if (!i) throw new n6(`Type not found: ${JSON.stringify(t)}`);
            let o = (n) => {
              let o = null != r ? r : t.defined.generics,
                s = o
                  ? it.resolveGenericArgs({
                      type: n,
                      typeDef: i,
                      genericArgs: o,
                    })
                  : o;
              return it.typeSize(n, e, s);
            };
            switch (i.type.kind) {
              case "struct":
                return rt(
                  i.type.fields,
                  () => [0],
                  (t) => t.map((t) => o(t.type)),
                  (t) => t.map((t) => o(t)),
                ).reduce((t, e) => t + e, 0);
              case "enum":
                return (
                  Math.max(
                    ...i.type.variants.map((t) =>
                      rt(
                        t.fields,
                        () => [0],
                        (t) => t.map((t) => o(t.type)),
                        (t) => t.map((t) => o(t)),
                      ).reduce((t, e) => t + e, 0),
                    ),
                  ) + 1
                );
              case "type":
                return it.typeSize(i.type.alias, e, r);
            }
          }
          if ("generic" in t) {
            let n = null == r ? void 0 : r.at(0);
            if ((null == n ? void 0 : n.kind) !== "type")
              throw new n6(`Invalid generic: ${t.generic}`);
            return it.typeSize(n.type, e, r);
          }
          throw Error(`Invalid type ${JSON.stringify(t)}`);
      }
    }
    static resolveArrayLen(t, e) {
      if ("number" == typeof t) return t;
      if (e) {
        let r = e.find((t) => "const" === t.kind);
        (null == r ? void 0 : r.kind) === "const" && (t = +r.value);
      }
      if ("number" != typeof t)
        throw new n6("Generic array length did not resolve");
      return t;
    }
    static resolveGenericArgs({
      type: t,
      typeDef: e,
      genericArgs: r,
      isDefined: n,
    }) {
      if ("object" != typeof t) return null;
      for (let i in e.generics) {
        let o = e.generics[i];
        if ("generic" in t && o.name === t.generic) return [r[i]];
        if ("option" in t) {
          let i = it.resolveGenericArgs({
            type: t.option,
            typeDef: e,
            genericArgs: r,
            isDefined: n,
          });
          if (!i || !n) return i;
          if ("type" === i[0].kind)
            return [{ kind: "type", type: { option: i[0].type } }];
        }
        if ("vec" in t) {
          let i = it.resolveGenericArgs({
            type: t.vec,
            typeDef: e,
            genericArgs: r,
            isDefined: n,
          });
          if (!i || !n) return i;
          if ("type" === i[0].kind)
            return [{ kind: "type", type: { vec: i[0].type } }];
        }
        if ("array" in t) {
          let [s, a] = t.array,
            u = "object" == typeof a,
            l =
              it.resolveGenericArgs({
                type: s,
                typeDef: e,
                genericArgs: r,
                isDefined: n,
              }) || [];
          if (u) {
            let t = e.generics.findIndex((t) => t.name === a.generic);
            -1 !== t && l.push(r[t]);
          }
          if (l.length > 0) {
            if (!n) return l;
            if ("type" === l[0].kind && "const" === l[1].kind)
              return [
                { kind: "type", type: { array: [l[0].type, +l[1].value] } },
              ];
          }
          if (u && o.name === a.generic) {
            let t = r[i];
            if (!n) return [t];
            return [{ kind: "type", type: { array: [s, +t.value] } }];
          }
          break;
        }
        if ("defined" in t) {
          if (!t.defined.generics) return null;
          return t.defined.generics
            .flatMap((t) => {
              switch (t.kind) {
                case "type":
                  return it.resolveGenericArgs({
                    type: t.type,
                    typeDef: e,
                    genericArgs: r,
                    isDefined: !0,
                  });
                case "const":
                  return [t];
              }
            })
            .filter((t) => null !== t);
        }
      }
      return null;
    }
  }
  class ie {
    constructor(t) {
      this.idl = t;
      let e = t.instructions.map((e) => {
        let r = e.name,
          n = e.args.map((e) => it.fieldLayout(e, t.types)),
          i = R.struct(n, r);
        return [r, { discriminator: e.discriminator, layout: i }];
      });
      this.ixLayouts = new Map(e);
    }
    encode(t, e) {
      let r = w.Buffer.alloc(1e3),
        n = this.ixLayouts.get(t);
      if (!n) throw Error(`Unknown method: ${t}`);
      let i = n.layout.encode(e, r),
        o = r.slice(0, i);
      return w.Buffer.concat([w.Buffer.from(n.discriminator), o]);
    }
    decode(t, e = "hex") {
      for (let [r, n] of ("string" == typeof t &&
        (t = "hex" === e ? w.Buffer.from(t, "hex") : v.f.decode(t)),
      this.ixLayouts)) {
        let e = t.subarray(0, n.discriminator.length);
        if (e.equals(w.Buffer.from(n.discriminator)))
          return { name: r, data: n.layout.decode(t.subarray(e.length)) };
      }
      return null;
    }
    format(t, e) {
      return ir.format(t, e, this.idl);
    }
  }
  class ir {
    static format(t, e, r) {
      let n = r.instructions.find((e) => t.name === e.name);
      if (!n) return (console.error("Invalid instruction given"), null);
      let i = n.args.map((e) => ({
          name: e.name,
          type: ir.formatIdlType(e.type),
          data: ir.formatIdlData(e, t.data[e.name], r.types),
        })),
        o = ir.flattenIdlAccounts(n.accounts);
      return {
        args: i,
        accounts: e.map((t, e) =>
          e < o.length ? { name: o[e].name, ...t } : { name: void 0, ...t },
        ),
      };
    }
    static formatIdlType(t) {
      if ("string" == typeof t) return t;
      if ("option" in t) return `Option<${this.formatIdlType(t.option)}>`;
      if ("coption" in t) return `COption<${this.formatIdlType(t.coption)}>`;
      if ("vec" in t) return `Vec<${this.formatIdlType(t.vec)}>`;
      if ("array" in t) return `Array<${t.array[0]}; ${t.array[1]}>`;
      if ("defined" in t) {
        let e = t.defined.name;
        if (t.defined.generics) {
          let r = t.defined.generics
            .map((t) => {
              switch (t.kind) {
                case "type":
                  return ir.formatIdlType(t.type);
                case "const":
                  return t.value;
              }
            })
            .join(", ");
          return `${e}<${r}>`;
        }
        return e;
      }
      throw Error(`Unknown IDL type: ${t}`);
    }
    static formatIdlData(t, e, r) {
      if ("string" == typeof t.type) return e.toString();
      if ("vec" in t.type)
        return (
          "[" +
          e
            .map((e) =>
              this.formatIdlData({ name: "", type: t.type.vec }, e, r),
            )
            .join(", ") +
          "]"
        );
      if ("option" in t.type)
        return null === e
          ? "null"
          : this.formatIdlData({ name: "", type: t.type.option }, e, r);
      if ("defined" in t.type) {
        if (!r) throw Error("User defined types not provided");
        let n = t.type.defined.name,
          i = r.find((t) => t.name === n);
        if (!i) throw Error(`Type not found: ${n}`);
        return ir.formatIdlDataDefined(i, e, r);
      }
      return "unknown";
    }
    static formatIdlDataDefined(t, e, r) {
      switch (t.type.kind) {
        case "struct":
          return (
            "{ " +
            rt(
              t.type.fields,
              () => "",
              (t) =>
                Object.entries(e)
                  .map(([e, n]) => {
                    let i = t.find((t) => t.name === e);
                    if (!i) throw Error(`Field not found: ${e}`);
                    return e + ": " + ir.formatIdlData(i, n, r);
                  })
                  .join(", "),
              (t) =>
                Object.entries(e)
                  .map(
                    ([e, n]) =>
                      e +
                      ": " +
                      ir.formatIdlData({ name: "", type: t[e] }, n, r),
                  )
                  .join(", "),
            ) +
            " }"
          );
        case "enum": {
          let n = Object.keys(e)[0],
            i = t.type.variants.find((t) => t.name === n);
          if (!i) throw Error(`Unable to find variant: ${n}`);
          let o = e[n];
          return rt(
            i.fields,
            () => n,
            (t) => {
              let e = Object.keys(o)
                .map((e) => {
                  let n = o[e],
                    i = t.find((t) => t.name === e);
                  if (!i) throw Error(`Field not found: ${e}`);
                  return e + ": " + ir.formatIdlData(i, n, r);
                })
                .join(", ");
              return `${n} { ${e} }`;
            },
            (t) => {
              let e = Object.entries(o)
                .map(
                  ([e, n]) =>
                    e + ": " + ir.formatIdlData({ name: "", type: t[e] }, n, r),
                )
                .join(", ");
              return `${n} { ${e} }`;
            },
          );
        }
        case "type":
          return ir.formatIdlType(t.type.alias);
      }
    }
    static flattenIdlAccounts(t, e) {
      return t
        .map((t) => {
          let r,
            n =
              (r = t.name.replace(/([A-Z])/g, " $1")).charAt(0).toUpperCase() +
              r.slice(1);
          if (!t.hasOwnProperty("accounts"))
            return { ...t, name: e ? `${e} > ${n}` : n };
          {
            let r = e ? `${e} > ${n}` : n;
            return ir.flattenIdlAccounts(t.accounts, r);
          }
        })
        .flat();
    }
  }
  class ii {
    constructor(t) {
      if (((this.idl = t), !t.accounts)) {
        this.accountLayouts = new Map();
        return;
      }
      let e = t.types;
      if (!e) throw Error("Accounts require `idl.types`");
      let r = t.accounts.map((t) => {
        let r = e.find((e) => e.name === t.name);
        if (!r) throw Error(`Account not found: ${t.name}`);
        return [
          t.name,
          {
            discriminator: t.discriminator,
            layout: it.typeDefLayout({ typeDef: r, types: e }),
          },
        ];
      });
      this.accountLayouts = new Map(r);
    }
    async encode(t, e) {
      let r = w.Buffer.alloc(1e3),
        n = this.accountLayouts.get(t);
      if (!n) throw Error(`Unknown account: ${t}`);
      let i = n.layout.encode(e, r),
        o = r.slice(0, i),
        s = this.accountDiscriminator(t);
      return w.Buffer.concat([s, o]);
    }
    decode(t, e) {
      let r = this.accountDiscriminator(t);
      if (r.compare(e.slice(0, r.length)))
        throw Error("Invalid account discriminator");
      return this.decodeUnchecked(t, e);
    }
    decodeAny(t) {
      for (let [e, r] of this.accountLayouts)
        if (
          t
            .subarray(0, r.discriminator.length)
            .equals(w.Buffer.from(r.discriminator))
        )
          return this.decodeUnchecked(e, t);
      throw Error("Account not found");
    }
    decodeUnchecked(t, e) {
      let r = this.accountDiscriminator(t),
        n = e.subarray(r.length),
        i = this.accountLayouts.get(t);
      if (!i) throw Error(`Unknown account: ${t}`);
      return i.layout.decode(n);
    }
    memcmp(t, e) {
      let r = this.accountDiscriminator(t);
      return { offset: 0, bytes: v.f.encode(e ? w.Buffer.concat([r, e]) : r) };
    }
    size(t) {
      return (
        this.accountDiscriminator(t).length +
        it.typeSize({ defined: { name: t } }, this.idl)
      );
    }
    accountDiscriminator(t) {
      var e;
      let r =
        null == (e = this.idl.accounts) ? void 0 : e.find((e) => e.name === t);
      if (!r) throw Error(`Account not found: ${t}`);
      return w.Buffer.from(r.discriminator);
    }
  }
  class io {
    constructor(t) {
      if (!t.events) {
        this.layouts = new Map();
        return;
      }
      let e = t.types;
      if (!e) throw Error("Events require `idl.types`");
      let r = t.events.map((t) => {
        let r = e.find((e) => e.name === t.name);
        if (!r) throw Error(`Event not found: ${t.name}`);
        return [
          t.name,
          {
            discriminator: t.discriminator,
            layout: it.typeDefLayout({ typeDef: r, types: e }),
          },
        ];
      });
      this.layouts = new Map(r);
    }
    decode(t) {
      let e;
      try {
        e = e5(t);
      } catch (t) {
        return null;
      }
      for (let [t, r] of this.layouts) {
        let n = e.subarray(0, r.discriminator.length);
        if (n.equals(w.Buffer.from(r.discriminator)))
          return { name: t, data: r.layout.decode(e.subarray(n.length)) };
      }
      return null;
    }
  }
  class is {
    constructor(t) {
      let e = t.types;
      if (!e) {
        this.typeLayouts = new Map();
        return;
      }
      let r = e
        .filter((t) => !t.generics)
        .map((t) => [t.name, it.typeDefLayout({ typeDef: t, types: e })]);
      this.typeLayouts = new Map(r);
    }
    encode(t, e) {
      let r = w.Buffer.alloc(1e3),
        n = this.typeLayouts.get(t);
      if (!n) throw Error(`Unknown type: ${t}`);
      let i = n.encode(e, r);
      return r.slice(0, i);
    }
    decode(t, e) {
      let r = this.typeLayouts.get(t);
      if (!r) throw Error(`Unknown type: ${t}`);
      return r.decode(e);
    }
  }
  class ia {
    constructor(t) {
      ((this.instruction = new ie(t)),
        (this.accounts = new ii(t)),
        (this.events = new io(t)),
        (this.types = new is(t)));
    }
  }
  class iu {
    constructor(t, e) {
      if (!Number.isInteger(t)) throw TypeError("span must be an integer");
      ((this.span = t), (this.property = e));
    }
    makeDestinationObject() {
      return {};
    }
    decode(t, e) {
      throw Error("Layout is abstract");
    }
    encode(t, e, r) {
      throw Error("Layout is abstract");
    }
    getSpan(t, e) {
      if (0 > this.span) throw RangeError("indeterminate span");
      return this.span;
    }
    replicate(t) {
      let e = Object.create(this.constructor.prototype);
      return (Object.assign(e, this), (e.property = t), e);
    }
    fromArray(t) {}
  }
  var il = iu;
  class ih extends iu {
    isCount() {
      throw Error("ExternalLayout is abstract");
    }
  }
  class ic extends ih {
    constructor(t, e, r) {
      if (!(t instanceof iu)) throw TypeError("layout must be a Layout");
      if (void 0 === e) e = 0;
      else if (!Number.isInteger(e))
        throw TypeError("offset must be integer or undefined");
      (super(t.span, r || t.property), (this.layout = t), (this.offset = e));
    }
    isCount() {
      return this.layout instanceof id || this.layout instanceof ip;
    }
    decode(t, e) {
      return (void 0 === e && (e = 0), this.layout.decode(t, e + this.offset));
    }
    encode(t, e, r) {
      return (
        void 0 === r && (r = 0),
        this.layout.encode(t, e, r + this.offset)
      );
    }
  }
  class id extends iu {
    constructor(t, e) {
      if ((super(t, e), 6 < this.span))
        throw RangeError("span must not exceed 6 bytes");
    }
    decode(t, e) {
      return (void 0 === e && (e = 0), t.readUIntLE(e, this.span));
    }
    encode(t, e, r) {
      return (
        void 0 === r && (r = 0),
        e.writeUIntLE(t, r, this.span),
        this.span
      );
    }
  }
  class ip extends iu {
    constructor(t, e) {
      if ((super(t, e), 6 < this.span))
        throw RangeError("span must not exceed 6 bytes");
    }
    decode(t, e) {
      return (void 0 === e && (e = 0), t.readUIntBE(e, this.span));
    }
    encode(t, e, r) {
      return (
        void 0 === r && (r = 0),
        e.writeUIntBE(t, r, this.span),
        this.span
      );
    }
  }
  function im(t) {
    let e = Math.floor(t / 0x100000000);
    return { hi32: e, lo32: t - 0x100000000 * e };
  }
  function i_(t, e) {
    return 0x100000000 * t + e;
  }
  class ig extends iu {
    constructor(t) {
      super(8, t);
    }
    decode(t, e) {
      void 0 === e && (e = 0);
      let r = t.readUInt32LE(e);
      return i_(t.readInt32LE(e + 4), r);
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = im(t);
      return (e.writeUInt32LE(n.lo32, r), e.writeInt32LE(n.hi32, r + 4), 8);
    }
  }
  class iy extends iu {
    constructor(t, e, r) {
      if (!(Array.isArray(t) && t.reduce((t, e) => t && e instanceof iu, !0)))
        throw TypeError("fields must be array of Layout instances");
      for (let n of ("boolean" == typeof e &&
        void 0 === r &&
        ((r = e), (e = void 0)),
      t))
        if (0 > n.span && void 0 === n.property)
          throw Error("fields cannot contain unnamed variable-length layout");
      let n = -1;
      try {
        n = t.reduce((t, e) => t + e.getSpan(), 0);
      } catch (t) {}
      (super(n, e), (this.fields = t), (this.decodePrefixes = !!r));
    }
    getSpan(t, e) {
      if (0 <= this.span) return this.span;
      void 0 === e && (e = 0);
      let r = 0;
      try {
        r = this.fields.reduce((r, n) => {
          let i = n.getSpan(t, e);
          return ((e += i), r + i);
        }, 0);
      } catch (t) {
        throw RangeError("indeterminate span");
      }
      return r;
    }
    decode(t, e) {
      void 0 === e && (e = 0);
      let r = this.makeDestinationObject();
      for (let n of this.fields)
        if (
          (void 0 !== n.property && (r[n.property] = n.decode(t, e)),
          (e += n.getSpan(t, e)),
          this.decodePrefixes && t.length === e)
        )
          break;
      return r;
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = r,
        i = 0,
        o = 0;
      for (let n of this.fields) {
        let s = n.span;
        if (((o = 0 < s ? s : 0), void 0 !== n.property)) {
          let i = t[n.property];
          void 0 !== i &&
            ((o = n.encode(i, e, r)), 0 > s && (s = n.getSpan(e, r)));
        }
        ((i = r), (r += s));
      }
      return i + o - n;
    }
    fromArray(t) {
      let e = this.makeDestinationObject();
      for (let r of this.fields)
        void 0 !== r.property && 0 < t.length && (e[r.property] = t.shift());
      return e;
    }
    layoutFor(t) {
      if ("string" != typeof t) throw TypeError("property must be string");
      for (let e of this.fields) if (e.property === t) return e;
    }
    offsetOf(t) {
      if ("string" != typeof t) throw TypeError("property must be string");
      let e = 0;
      for (let r of this.fields) {
        if (r.property === t) return e;
        0 > r.span ? (e = -1) : 0 <= e && (e += r.span);
      }
    }
  }
  class iw {
    constructor(t) {
      this.property = t;
    }
    decode() {
      throw Error("UnionDiscriminator is abstract");
    }
    encode() {
      throw Error("UnionDiscriminator is abstract");
    }
  }
  class iv extends iw {
    constructor(t, e) {
      if (!(t instanceof ih && t.isCount()))
        throw TypeError("layout must be an unsigned integer ExternalLayout");
      (super(e || t.property || "variant"), (this.layout = t));
    }
    decode(t, e) {
      return this.layout.decode(t, e);
    }
    encode(t, e, r) {
      return this.layout.encode(t, e, r);
    }
  }
  class ib extends iu {
    constructor(t, e, r) {
      let n = t instanceof id || t instanceof ip;
      if (n) t = new iv(new ic(t));
      else if (t instanceof ih && t.isCount()) t = new iv(t);
      else if (!(t instanceof iw))
        throw TypeError(
          "discr must be a UnionDiscriminator or an unsigned integer layout",
        );
      if ((void 0 === e && (e = null), !(null === e || e instanceof iu)))
        throw TypeError("defaultLayout must be null or a Layout");
      if (null !== e) {
        if (0 > e.span) throw Error("defaultLayout must have constant span");
        void 0 === e.property && (e = e.replicate("content"));
      }
      let i = -1;
      (e && 0 <= (i = e.span) && n && (i += t.layout.span),
        super(i, r),
        (this.discriminator = t),
        (this.usesPrefixDiscriminator = n),
        (this.defaultLayout = e),
        (this.registry = {}));
      let o = this.defaultGetSourceVariant.bind(this);
      ((this.getSourceVariant = function (t) {
        return o(t);
      }),
        (this.configGetSourceVariant = function (t) {
          o = t.bind(this);
        }));
    }
    getSpan(t, e) {
      if (0 <= this.span) return this.span;
      void 0 === e && (e = 0);
      let r = this.getVariant(t, e);
      if (!r) throw Error("unable to determine span for unrecognized variant");
      return r.getSpan(t, e);
    }
    defaultGetSourceVariant(t) {
      if (t.hasOwnProperty(this.discriminator.property)) {
        if (this.defaultLayout && t.hasOwnProperty(this.defaultLayout.property))
          return;
        let e = this.registry[t[this.discriminator.property]];
        if (e && (!e.layout || t.hasOwnProperty(e.property))) return e;
      } else
        for (let e in this.registry) {
          let r = this.registry[e];
          if (t.hasOwnProperty(r.property)) return r;
        }
      throw Error("unable to infer src variant");
    }
    decode(t, e) {
      let r;
      void 0 === e && (e = 0);
      let n = this.discriminator,
        i = n.decode(t, e),
        o = this.registry[i];
      if (void 0 === o) {
        let s = 0;
        ((o = this.defaultLayout),
          this.usesPrefixDiscriminator && (s = n.layout.span),
          ((r = this.makeDestinationObject())[n.property] = i),
          (r[o.property] = this.defaultLayout.decode(t, e + s)));
      } else r = o.decode(t, e);
      return r;
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = this.getSourceVariant(t);
      if (void 0 === n) {
        let n = this.discriminator,
          i = this.defaultLayout,
          o = 0;
        return (
          this.usesPrefixDiscriminator && (o = n.layout.span),
          n.encode(t[n.property], e, r),
          o + i.encode(t[i.property], e, r + o)
        );
      }
      return n.encode(t, e, r);
    }
    addVariant(t, e, r) {
      let n = new iR(this, t, e, r);
      return ((this.registry[t] = n), n);
    }
    getVariant(t, e) {
      let r = t;
      return (
        _.Buffer.isBuffer(t) &&
          (void 0 === e && (e = 0), (r = this.discriminator.decode(t, e))),
        this.registry[r]
      );
    }
  }
  class iR extends iu {
    constructor(t, e, r, n) {
      if (!(t instanceof ib)) throw TypeError("union must be a Union");
      if (!Number.isInteger(e) || 0 > e)
        throw TypeError("variant must be a (non-negative) integer");
      if (("string" == typeof r && void 0 === n && ((n = r), (r = null)), r)) {
        if (!(r instanceof iu)) throw TypeError("layout must be a Layout");
        if (
          null !== t.defaultLayout &&
          0 <= r.span &&
          r.span > t.defaultLayout.span
        )
          throw Error("variant span exceeds span of containing union");
        if ("string" != typeof n)
          throw TypeError("variant must have a String property");
      }
      let i = t.span;
      (0 > t.span &&
        0 <= (i = r ? r.span : 0) &&
        t.usesPrefixDiscriminator &&
        (i += t.discriminator.layout.span),
        super(i, n),
        (this.union = t),
        (this.variant = e),
        (this.layout = r || null));
    }
    getSpan(t, e) {
      if (0 <= this.span) return this.span;
      void 0 === e && (e = 0);
      let r = 0;
      return (
        this.union.usesPrefixDiscriminator &&
          (r = this.union.discriminator.layout.span),
        r + this.layout.getSpan(t, e + r)
      );
    }
    decode(t, e) {
      let r = this.makeDestinationObject();
      if ((void 0 === e && (e = 0), this !== this.union.getVariant(t, e)))
        throw Error("variant mismatch");
      let n = 0;
      return (
        this.union.usesPrefixDiscriminator &&
          (n = this.union.discriminator.layout.span),
        this.layout
          ? (r[this.property] = this.layout.decode(t, e + n))
          : this.property
            ? (r[this.property] = !0)
            : this.union.usesPrefixDiscriminator &&
              (r[this.union.discriminator.property] = this.variant),
        r
      );
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = 0;
      if (
        (this.union.usesPrefixDiscriminator &&
          (n = this.union.discriminator.layout.span),
        this.layout && !t.hasOwnProperty(this.property))
      )
        throw TypeError("variant lacks property " + this.property);
      this.union.discriminator.encode(this.variant, e, r);
      let i = n;
      if (
        this.layout &&
        (this.layout.encode(t[this.property], e, r + n),
        (i += this.layout.getSpan(e, r + n)),
        0 <= this.union.span && i > this.union.span)
      )
        throw Error("encoded variant overruns containing union");
      return i;
    }
    fromArray(t) {
      if (this.layout) return this.layout.fromArray(t);
    }
  }
  class iE extends iu {
    constructor(t, e) {
      if (
        !((t instanceof ih && t.isCount()) || (Number.isInteger(t) && 0 <= t))
      )
        throw TypeError(
          "length must be positive integer or an unsigned integer ExternalLayout",
        );
      let r = -1;
      (t instanceof ih || (r = t), super(r, e), (this.length = t));
    }
    getSpan(t, e) {
      let r = this.span;
      return (0 > r && (r = this.length.decode(t, e)), r);
    }
    decode(t, e) {
      void 0 === e && (e = 0);
      let r = this.span;
      return (0 > r && (r = this.length.decode(t, e)), t.slice(e, e + r));
    }
    encode(t, e, r) {
      let n = this.length;
      if (
        (this.length instanceof ih && (n = t.length),
        !(_.Buffer.isBuffer(t) && n === t.length))
      ) {
        var i;
        throw TypeError(
          ((i = "Blob.encode"),
          (this.property ? i + "[" + this.property + "]" : i) +
            " requires (length " +
            n +
            ") Buffer as src"),
        );
      }
      if (r + n > e.length) throw RangeError("encoding overruns Buffer");
      return (
        e.write(t.toString("hex"), r, n, "hex"),
        this.length instanceof ih && this.length.encode(n, e, r),
        n
      );
    }
  }
  var iA = (t) => new id(4, t),
    iO = (t) => new ig(t),
    iT = (t, e, r) => new iy(t, e, r),
    iN = (t, e, r) => new ib(t, e, r),
    iM = (t, e) => new iE(t, e);
  class iI {
    constructor(t) {}
    encode(t, e) {
      switch (t) {
        case "createAccount":
          return (function ({ lamports: t, space: e, owner: r }) {
            return iL({
              createAccount: { lamports: t, space: e, owner: r.toBuffer() },
            });
          })(e);
        case "assign":
          return (function ({ owner: t }) {
            return iL({ assign: { owner: t.toBuffer() } });
          })(e);
        case "transfer":
          return (function ({ lamports: t }) {
            return iL({ transfer: { lamports: t } });
          })(e);
        case "createAccountWithSeed":
          return (function ({
            base: t,
            seed: e,
            lamports: r,
            space: n,
            owner: i,
          }) {
            return iL(
              {
                createAccountWithSeed: {
                  base: t.toBuffer(),
                  seed: e,
                  lamports: r,
                  space: n,
                  owner: i.toBuffer(),
                },
              },
              ik.getVariant(3).span + e.length,
            );
          })(e);
        case "advanceNonceAccount":
          return (function ({ authorized: t }) {
            return iL({ advanceNonceAccount: { authorized: t.toBuffer() } });
          })(e);
        case "withdrawNonceAccount":
          return (function ({ lamports: t }) {
            return iL({ withdrawNonceAccount: { lamports: t } });
          })(e);
        case "initializeNonceAccount":
          return (function ({ authorized: t }) {
            return iL({ initializeNonceAccount: { authorized: t.toBuffer() } });
          })(e);
        case "authorizeNonceAccount":
          return (function ({ authorized: t }) {
            return iL({ authorizeNonceAccount: { authorized: t.toBuffer() } });
          })(e);
        case "allocate":
          return (function ({ space: t }) {
            return iL({ allocate: { space: t } });
          })(e);
        case "allocateWithSeed":
          return (function ({ base: t, seed: e, space: r, owner: n }) {
            return iL(
              {
                allocateWithSeed: {
                  base: t.toBuffer(),
                  seed: e,
                  space: r,
                  owner: n.toBuffer(),
                },
              },
              ik.getVariant(9).span + e.length,
            );
          })(e);
        case "assignWithSeed":
          return (function ({ base: t, seed: e, owner: r }) {
            return iL(
              {
                assignWithSeed: {
                  base: t.toBuffer(),
                  seed: e,
                  owner: r.toBuffer(),
                },
              },
              ik.getVariant(10).span + e.length,
            );
          })(e);
        case "transferWithSeed":
          return (function ({ lamports: t, seed: e, owner: r }) {
            return iL(
              {
                transferWithSeed: { lamports: t, seed: e, owner: r.toBuffer() },
              },
              ik.getVariant(11).span + e.length,
            );
          })(e);
        default:
          throw Error(`Invalid instruction: ${t}`);
      }
    }
    encodeState(t, e) {
      throw Error("System does not have state");
    }
  }
  class ix extends il {
    constructor(t) {
      (super(-1, t),
        (this.property = t),
        (this.layout = iT(
          [
            iA("length"),
            iA("lengthPadding"),
            iM(new ic(iA(), -8, void 0), "chars"),
          ],
          this.property,
        )));
    }
    encode(t, e, r = 0) {
      if (null == t) return this.layout.span;
      let n = { chars: _.Buffer.from(t, "utf8") };
      return this.layout.encode(n, e, r);
    }
    decode(t, e = 0) {
      return this.layout.decode(t, e).chars.toString();
    }
    getSpan(t, e = 0) {
      return (
        iA().span +
        iA().span +
        new g.default(new Uint8Array(t).slice(e, e + 4), 10, "le").toNumber()
      );
    }
  }
  function iC(t) {
    return new ix(t);
  }
  function iS(t) {
    return iM(32, t);
  }
  let ik = iN(iA("instruction"));
  function iL(t, e) {
    let r = _.Buffer.alloc(null != e ? e : iD),
      n = ik.encode(t, r);
    return void 0 === e ? r.slice(0, n) : r;
  }
  (ik.addVariant(
    0,
    iT([iO("lamports"), iO("space"), iS("owner")]),
    "createAccount",
  ),
    ik.addVariant(1, iT([iS("owner")]), "assign"),
    ik.addVariant(2, iT([iO("lamports")]), "transfer"),
    ik.addVariant(
      3,
      iT([iS("base"), iC("seed"), iO("lamports"), iO("space"), iS("owner")]),
      "createAccountWithSeed",
    ),
    ik.addVariant(4, iT([iS("authorized")]), "advanceNonceAccount"),
    ik.addVariant(5, iT([iO("lamports")]), "withdrawNonceAccount"),
    ik.addVariant(6, iT([iS("authorized")]), "initializeNonceAccount"),
    ik.addVariant(7, iT([iS("authorized")]), "authorizeNonceAccount"),
    ik.addVariant(8, iT([iO("space")]), "allocate"),
    ik.addVariant(
      9,
      iT([iS("base"), iC("seed"), iO("space"), iS("owner")]),
      "allocateWithSeed",
    ),
    ik.addVariant(
      10,
      iT([iS("base"), iC("seed"), iS("owner")]),
      "assignWithSeed",
    ),
    ik.addVariant(
      11,
      iT([iO("lamports"), iC("seed"), iS("owner")]),
      "transferWithSeed",
    ));
  let iD = Math.max(...Object.values(ik.registry).map((t) => t.span));
  class iP {
    constructor(t) {
      this.idl = t;
    }
    async encode(t, e) {
      if ("nonce" === t) {
        let t = _.Buffer.alloc(y.NONCE_ACCOUNT_LENGTH),
          r = iz.encode(e, t);
        return t.slice(0, r);
      }
      throw Error(`Invalid account name: ${t}`);
    }
    decode(t, e) {
      return this.decodeUnchecked(t, e);
    }
    decodeUnchecked(t, e) {
      if ("nonce" === t) {
        var r;
        return ((r = e), iz.decode(r));
      }
      throw Error(`Invalid account name: ${t}`);
    }
    memcmp(t, e) {
      if ("nonce" === t) return { dataSize: y.NONCE_ACCOUNT_LENGTH };
      throw Error(`Invalid account name: ${t}`);
    }
    size(t) {
      return it.typeSize({ defined: { name: t } }, this.idl);
    }
  }
  class iU extends il {
    constructor(t, e, r, n) {
      (super(t.span, n),
        (this.layout = t),
        (this.decoder = e),
        (this.encoder = r));
    }
    decode(t, e) {
      return this.decoder(this.layout.decode(t, e));
    }
    encode(t, e, r) {
      return this.layout.encode(this.encoder(t), e, r);
    }
    getSpan(t, e) {
      return this.layout.getSpan(t, e);
    }
  }
  function iB(t) {
    return new iU(
      iM(32),
      (t) => new y.PublicKey(t),
      (t) => t.toBuffer(),
      t,
    );
  }
  let iz = iT([
    iA("version"),
    iA("state"),
    iB("authorizedPubkey"),
    iB("nonce"),
    iT(
      [
        new (class t extends iu {
          constructor(t) {
            super(8, t);
          }
          decode(t, e) {
            void 0 === e && (e = 0);
            let r = t.readUInt32LE(e);
            return i_(t.readUInt32LE(e + 4), r);
          }
          encode(t, e, r) {
            void 0 === r && (r = 0);
            let n = im(t);
            return (
              e.writeUInt32LE(n.lo32, r),
              e.writeUInt32LE(n.hi32, r + 4),
              8
            );
          }
        })("lamportsPerSignature"),
      ],
      "feeCalculator",
    ),
  ]);
  class iH {
    constructor(t) {}
    decode(t) {
      throw Error("System program does not have events");
    }
  }
  class iG {
    constructor(t) {}
    encode(t, e) {
      throw Error("System does not have user-defined types");
    }
    decode(t, e) {
      throw Error("System does not have user-defined types");
    }
  }
  class ij {
    constructor(t) {
      ((this.instruction = new iI(t)),
        (this.accounts = new iP(t)),
        (this.events = new iH(t)),
        (this.types = new iG(t)));
    }
  }
  var iV = Object.freeze({
      __proto__: null,
      hash: function (t) {
        return new TextDecoder().decode((0, E.f)(t));
      },
    }),
    iF = Object.freeze({
      __proto__: null,
      createWithSeedSync: function (t, e, r) {
        let n = w.Buffer.concat([t.toBuffer(), w.Buffer.from(e), r.toBuffer()]);
        return new y.PublicKey((0, E.f)(n));
      },
    });
  let iK = new y.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    iZ = new y.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
  var iq = Object.freeze({
      __proto__: null,
      TOKEN_PROGRAM_ID: iK,
      ASSOCIATED_PROGRAM_ID: iZ,
      associatedAddress: function ({ mint: t, owner: e }) {
        return y.PublicKey.findProgramAddressSync(
          [e.toBuffer(), iK.toBuffer(), t.toBuffer()],
          iZ,
        )[0];
      },
    }),
    i$ = { exports: {} };
  ((c = i$.exports),
    (d = "u" > typeof self ? self : rB),
    (p = f =
      (function () {
        function t() {
          ((this.fetch = !1), (this.DOMException = d.DOMException));
        }
        return ((t.prototype = d), new t());
      })()),
    (function (t) {
      var e = {
        searchParams: "URLSearchParams" in p,
        iterable: "Symbol" in p && "iterator" in Symbol,
        blob:
          "FileReader" in p &&
          "Blob" in p &&
          (function () {
            try {
              return (new Blob(), !0);
            } catch (t) {
              return !1;
            }
          })(),
        formData: "FormData" in p,
        arrayBuffer: "ArrayBuffer" in p,
      };
      if (e.arrayBuffer)
        var r = [
            "[object Int8Array]",
            "[object Uint8Array]",
            "[object Uint8ClampedArray]",
            "[object Int16Array]",
            "[object Uint16Array]",
            "[object Int32Array]",
            "[object Uint32Array]",
            "[object Float32Array]",
            "[object Float64Array]",
          ],
          n =
            ArrayBuffer.isView ||
            function (t) {
              return t && r.indexOf(Object.prototype.toString.call(t)) > -1;
            };
      function i(t) {
        if (
          ("string" != typeof t && (t = String(t)),
          /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t))
        )
          throw TypeError("Invalid character in header field name");
        return t.toLowerCase();
      }
      function o(t) {
        return ("string" != typeof t && (t = String(t)), t);
      }
      function s(t) {
        var r = {
          next: function () {
            var e = t.shift();
            return { done: void 0 === e, value: e };
          },
        };
        return (
          e.iterable &&
            (r[Symbol.iterator] = function () {
              return r;
            }),
          r
        );
      }
      function a(t) {
        ((this.map = {}),
          t instanceof a
            ? t.forEach(function (t, e) {
                this.append(e, t);
              }, this)
            : Array.isArray(t)
              ? t.forEach(function (t) {
                  this.append(t[0], t[1]);
                }, this)
              : t &&
                Object.getOwnPropertyNames(t).forEach(function (e) {
                  this.append(e, t[e]);
                }, this));
      }
      function u(t) {
        if (t.bodyUsed) return Promise.reject(TypeError("Already read"));
        t.bodyUsed = !0;
      }
      function l(t) {
        return new Promise(function (e, r) {
          ((t.onload = function () {
            e(t.result);
          }),
            (t.onerror = function () {
              r(t.error);
            }));
        });
      }
      function h(t) {
        var e = new FileReader(),
          r = l(e);
        return (e.readAsArrayBuffer(t), r);
      }
      function c(t) {
        if (t.slice) return t.slice(0);
        var e = new Uint8Array(t.byteLength);
        return (e.set(new Uint8Array(t)), e.buffer);
      }
      function d() {
        return (
          (this.bodyUsed = !1),
          (this._initBody = function (t) {
            if (((this._bodyInit = t), t))
              if ("string" == typeof t) this._bodyText = t;
              else if (e.blob && Blob.prototype.isPrototypeOf(t))
                this._bodyBlob = t;
              else if (e.formData && FormData.prototype.isPrototypeOf(t))
                this._bodyFormData = t;
              else if (
                e.searchParams &&
                URLSearchParams.prototype.isPrototypeOf(t)
              )
                this._bodyText = t.toString();
              else {
                var r;
                e.arrayBuffer &&
                e.blob &&
                (r = t) &&
                DataView.prototype.isPrototypeOf(r)
                  ? ((this._bodyArrayBuffer = c(t.buffer)),
                    (this._bodyInit = new Blob([this._bodyArrayBuffer])))
                  : e.arrayBuffer &&
                      (ArrayBuffer.prototype.isPrototypeOf(t) || n(t))
                    ? (this._bodyArrayBuffer = c(t))
                    : (this._bodyText = t = Object.prototype.toString.call(t));
              }
            else this._bodyText = "";
            !this.headers.get("content-type") &&
              ("string" == typeof t
                ? this.headers.set("content-type", "text/plain;charset=UTF-8")
                : this._bodyBlob && this._bodyBlob.type
                  ? this.headers.set("content-type", this._bodyBlob.type)
                  : e.searchParams &&
                    URLSearchParams.prototype.isPrototypeOf(t) &&
                    this.headers.set(
                      "content-type",
                      "application/x-www-form-urlencoded;charset=UTF-8",
                    ));
          }),
          e.blob &&
            ((this.blob = function () {
              var t = u(this);
              if (t) return t;
              if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
              if (this._bodyArrayBuffer)
                return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              if (!this._bodyFormData)
                return Promise.resolve(new Blob([this._bodyText]));
              throw Error("could not read FormData body as blob");
            }),
            (this.arrayBuffer = function () {
              return this._bodyArrayBuffer
                ? u(this) || Promise.resolve(this._bodyArrayBuffer)
                : this.blob().then(h);
            })),
          (this.text = function () {
            var t,
              e,
              r,
              n = u(this);
            if (n) return n;
            if (this._bodyBlob)
              return (
                (t = this._bodyBlob),
                (r = l((e = new FileReader()))),
                e.readAsText(t),
                r
              );
            if (this._bodyArrayBuffer)
              return Promise.resolve(
                (function (t) {
                  for (
                    var e = new Uint8Array(t), r = Array(e.length), n = 0;
                    n < e.length;
                    n++
                  )
                    r[n] = String.fromCharCode(e[n]);
                  return r.join("");
                })(this._bodyArrayBuffer),
              );
            if (!this._bodyFormData) return Promise.resolve(this._bodyText);
            throw Error("could not read FormData body as text");
          }),
          e.formData &&
            (this.formData = function () {
              return this.text().then(_);
            }),
          (this.json = function () {
            return this.text().then(JSON.parse);
          }),
          this
        );
      }
      ((a.prototype.append = function (t, e) {
        ((t = i(t)), (e = o(e)));
        var r = this.map[t];
        this.map[t] = r ? r + ", " + e : e;
      }),
        (a.prototype.delete = function (t) {
          delete this.map[i(t)];
        }),
        (a.prototype.get = function (t) {
          return ((t = i(t)), this.has(t) ? this.map[t] : null);
        }),
        (a.prototype.has = function (t) {
          return this.map.hasOwnProperty(i(t));
        }),
        (a.prototype.set = function (t, e) {
          this.map[i(t)] = o(e);
        }),
        (a.prototype.forEach = function (t, e) {
          for (var r in this.map)
            this.map.hasOwnProperty(r) && t.call(e, this.map[r], r, this);
        }),
        (a.prototype.keys = function () {
          var t = [];
          return (
            this.forEach(function (e, r) {
              t.push(r);
            }),
            s(t)
          );
        }),
        (a.prototype.values = function () {
          var t = [];
          return (
            this.forEach(function (e) {
              t.push(e);
            }),
            s(t)
          );
        }),
        (a.prototype.entries = function () {
          var t = [];
          return (
            this.forEach(function (e, r) {
              t.push([r, e]);
            }),
            s(t)
          );
        }),
        e.iterable && (a.prototype[Symbol.iterator] = a.prototype.entries));
      var f = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      function m(t, e) {
        var r,
          n,
          i = (e = e || {}).body;
        if (t instanceof m) {
          if (t.bodyUsed) throw TypeError("Already read");
          ((this.url = t.url),
            (this.credentials = t.credentials),
            e.headers || (this.headers = new a(t.headers)),
            (this.method = t.method),
            (this.mode = t.mode),
            (this.signal = t.signal),
            i || null == t._bodyInit || ((i = t._bodyInit), (t.bodyUsed = !0)));
        } else this.url = String(t);
        if (
          ((this.credentials =
            e.credentials || this.credentials || "same-origin"),
          (e.headers || !this.headers) && (this.headers = new a(e.headers)),
          (this.method =
            ((n = (r = e.method || this.method || "GET").toUpperCase()),
            f.indexOf(n) > -1 ? n : r)),
          (this.mode = e.mode || this.mode || null),
          (this.signal = e.signal || this.signal),
          (this.referrer = null),
          ("GET" === this.method || "HEAD" === this.method) && i)
        )
          throw TypeError("Body not allowed for GET or HEAD requests");
        this._initBody(i);
      }
      function _(t) {
        var e = new FormData();
        return (
          t
            .trim()
            .split("&")
            .forEach(function (t) {
              if (t) {
                var r = t.split("="),
                  n = r.shift().replace(/\+/g, " "),
                  i = r.join("=").replace(/\+/g, " ");
                e.append(decodeURIComponent(n), decodeURIComponent(i));
              }
            }),
          e
        );
      }
      function g(t, e) {
        (e || (e = {}),
          (this.type = "default"),
          (this.status = void 0 === e.status ? 200 : e.status),
          (this.ok = this.status >= 200 && this.status < 300),
          (this.statusText = "statusText" in e ? e.statusText : "OK"),
          (this.headers = new a(e.headers)),
          (this.url = e.url || ""),
          this._initBody(t));
      }
      ((m.prototype.clone = function () {
        return new m(this, { body: this._bodyInit });
      }),
        d.call(m.prototype),
        d.call(g.prototype),
        (g.prototype.clone = function () {
          return new g(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new a(this.headers),
            url: this.url,
          });
        }),
        (g.error = function () {
          var t = new g(null, { status: 0, statusText: "" });
          return ((t.type = "error"), t);
        }));
      var y = [301, 302, 303, 307, 308];
      ((g.redirect = function (t, e) {
        if (-1 === y.indexOf(e)) throw RangeError("Invalid status code");
        return new g(null, { status: e, headers: { location: t } });
      }),
        (t.DOMException = p.DOMException));
      try {
        new t.DOMException();
      } catch (e) {
        ((t.DOMException = function (t, e) {
          ((this.message = t), (this.name = e));
          var r = Error(t);
          this.stack = r.stack;
        }),
          (t.DOMException.prototype = Object.create(Error.prototype)),
          (t.DOMException.prototype.constructor = t.DOMException));
      }
      function w(r, n) {
        return new Promise(function (i, o) {
          var s = new m(r, n);
          if (s.signal && s.signal.aborted)
            return o(new t.DOMException("Aborted", "AbortError"));
          var u = new XMLHttpRequest();
          function l() {
            u.abort();
          }
          ((u.onload = function () {
            var t,
              e,
              r = {
                status: u.status,
                statusText: u.statusText,
                headers:
                  ((t = u.getAllResponseHeaders() || ""),
                  (e = new a()),
                  t
                    .replace(/\r?\n[\t ]+/g, " ")
                    .split(/\r?\n/)
                    .forEach(function (t) {
                      var r = t.split(":"),
                        n = r.shift().trim();
                      if (n) {
                        var i = r.join(":").trim();
                        e.append(n, i);
                      }
                    }),
                  e),
              };
            ((r.url =
              "responseURL" in u
                ? u.responseURL
                : r.headers.get("X-Request-URL")),
              i(new g("response" in u ? u.response : u.responseText, r)));
          }),
            (u.onerror = function () {
              o(TypeError("Network request failed"));
            }),
            (u.ontimeout = function () {
              o(TypeError("Network request failed"));
            }),
            (u.onabort = function () {
              o(new t.DOMException("Aborted", "AbortError"));
            }),
            u.open(s.method, s.url, !0),
            "include" === s.credentials
              ? (u.withCredentials = !0)
              : "omit" === s.credentials && (u.withCredentials = !1),
            "responseType" in u && e.blob && (u.responseType = "blob"),
            s.headers.forEach(function (t, e) {
              u.setRequestHeader(e, t);
            }),
            s.signal &&
              (s.signal.addEventListener("abort", l),
              (u.onreadystatechange = function () {
                4 === u.readyState && s.signal.removeEventListener("abort", l);
              })),
            u.send(void 0 === s._bodyInit ? null : s._bodyInit));
        });
      }
      ((w.polyfill = !0),
        p.fetch ||
          ((p.fetch = w), (p.Headers = a), (p.Request = m), (p.Response = g)),
        (t.Headers = a),
        (t.Request = m),
        (t.Response = g),
        (t.fetch = w),
        Object.defineProperty(t, "__esModule", { value: !0 }));
    })({}),
    (f.fetch.ponyfill = !0),
    delete f.fetch.polyfill,
    ((c = f.fetch).default = f.fetch),
    (c.fetch = f.fetch),
    (c.Headers = f.Headers),
    (c.Request = f.Request),
    (c.Response = f.Response),
    (i$.exports = c));
  var iW =
    (m = i$.exports) &&
    m.__esModule &&
    Object.prototype.hasOwnProperty.call(m, "default")
      ? m.default
      : m;
  async function iX(t, e, r = 5) {
    let n = `https://api.apr.dev/api/v0/program/${e.toString()}/latest?limit=${r}`,
      [i, o] = await Promise.all([iY(t, e), iW(n)]),
      s = (await o.json()).filter(
        (t) => !t.aborted && "Built" === t.state && "Verified" === t.verified,
      );
    if (0 === s.length) return null;
    let a = s[0];
    return i.slot.toNumber() !== a.verified_slot ? null : a;
  }
  async function iY(t, e) {
    let r = await t.getAccountInfo(e);
    if (null === r) throw Error("program account not found");
    let { program: n } = iJ(r.data),
      i = await t.getAccountInfo(n.programdataAddress);
    if (null === i) throw Error("program data account not found");
    let { programData: o } = iJ(i.data);
    return o;
  }
  let iQ = R.rustEnum(
    [
      R.struct([], "uninitialized"),
      R.struct([R.option(R.publicKey(), "authorityAddress")], "buffer"),
      R.struct([R.publicKey("programdataAddress")], "program"),
      R.struct(
        [R.u64("slot"), R.option(R.publicKey(), "upgradeAuthorityAddress")],
        "programData",
      ),
    ],
    void 0,
    R.u32(),
  );
  function iJ(t) {
    return iQ.decode(t);
  }
  var i0 = Object.freeze({
    __proto__: null,
    sha256: iV,
    rpc: rC,
    publicKey: iF,
    bytes: e8,
    token: iq,
    features: n2,
    registry: Object.freeze({
      __proto__: null,
      verifiedBuild: iX,
      fetchData: iY,
      decodeUpgradeableLoaderState: iJ,
    }),
  });
  let i1 = "Program log: ",
    i2 = "Program data: ",
    i6 = i1.length,
    i3 = i2.length;
  class i5 {
    constructor(t, e, r) {
      ((this._programId = t),
        (this._provider = e),
        (this._eventParser = new i8(t, r)),
        (this._eventCallbacks = new Map()),
        (this._eventListeners = new Map()),
        (this._listenerIdCount = 0));
    }
    addEventListener(t, e, r) {
      var n;
      let i = this._listenerIdCount;
      return (
        (this._listenerIdCount += 1),
        this._eventListeners.has(t) || this._eventListeners.set(t, []),
        this._eventListeners.set(
          t,
          (null != (n = this._eventListeners.get(t)) ? n : []).concat(i),
        ),
        this._eventCallbacks.set(i, [t, e]),
        void 0 !== this._onLogsSubscriptionId ||
          (this._onLogsSubscriptionId = this._provider.connection.onLogs(
            this._programId,
            (t, e) => {
              if (!t.err)
                for (let r of this._eventParser.parseLogs(t.logs)) {
                  let n = this._eventListeners.get(r.name);
                  n &&
                    n.forEach((n) => {
                      let i = this._eventCallbacks.get(n);
                      if (i) {
                        let [, n] = i;
                        n(r.data, e.slot, t.signature);
                      }
                    });
                }
            },
            r,
          )),
        i
      );
    }
    async removeEventListener(t) {
      let e = this._eventCallbacks.get(t);
      if (!e) throw Error(`Event listener ${t} doesn't exist!`);
      let [r] = e,
        n = this._eventListeners.get(r);
      if (!n) throw Error(`Event listeners don't exist for ${r}!`);
      if (
        (this._eventCallbacks.delete(t),
        (n = n.filter((e) => e !== t)),
        this._eventListeners.set(r, n),
        0 === n.length && this._eventListeners.delete(r),
        0 === this._eventCallbacks.size)
      ) {
        if (0 !== this._eventListeners.size)
          throw Error(
            `Expected event listeners size to be 0 but got ${this._eventListeners.size}`,
          );
        void 0 !== this._onLogsSubscriptionId &&
          (await this._provider.connection.removeOnLogsListener(
            this._onLogsSubscriptionId,
          ),
          (this._onLogsSubscriptionId = void 0));
      }
    }
  }
  class i8 {
    constructor(t, e) {
      ((this.coder = e), (this.programId = t));
    }
    *parseLogs(t, e = !1) {
      let r = new i9(t),
        n = new i4(),
        i = r.next();
      for (; null !== i; ) {
        let [t, o, s] = this.handleLog(n, i, e);
        (t && (yield t), o && n.push(o), s && n.pop(), (i = r.next()));
      }
    }
    handleLog(t, e, r) {
      return t.stack.length > 0 && t.program() === this.programId.toString()
        ? this.handleProgramLog(e, r)
        : [null, ...this.handleSystemLog(e)];
    }
    handleProgramLog(t, e) {
      if (!(t.startsWith(i1) || t.startsWith(i2)))
        return [null, ...this.handleSystemLog(t)];
      {
        let r = t.startsWith(i1) ? t.slice(i6) : t.slice(i3),
          n = this.coder.events.decode(r);
        if (e && null === n) throw Error(`Unable to decode event ${r}`);
        return [n, null, !1];
      }
    }
    handleSystemLog(t) {
      let e = t.split(":")[0];
      return null !== e.match(/^Program (.*) success/g)
        ? [null, !0]
        : e.startsWith(`Program ${this.programId.toString()} invoke`)
          ? [this.programId.toString(), !1]
          : e.includes("invoke")
            ? ["cpi", !1]
            : [null, !1];
    }
  }
  class i4 {
    constructor() {
      this.stack = [];
    }
    program() {
      if (!this.stack.length)
        throw Error("Expected the stack to have elements");
      return this.stack[this.stack.length - 1];
    }
    push(t) {
      this.stack.push(t);
    }
    pop() {
      if (!this.stack.length)
        throw Error("Expected the stack to have elements");
      this.stack.pop();
    }
  }
  class i9 {
    constructor(t) {
      this.logs = t;
    }
    next() {
      if (0 === this.logs.length) return null;
      let t = this.logs[0];
      return ((this.logs = this.logs.slice(1)), t);
    }
  }
  function i7(t, e) {
    var r, n;
    let i = {},
      o = t.args ? t.args.length : 0;
    if (e.length > o) {
      if (e.length !== o + 1)
        throw Error(
          `provided too many arguments ${e} to instruction ${null == t ? void 0 : t.name} expecting: ${null != (n = null == (r = t.args) ? void 0 : r.map((t) => t.name)) ? n : []}`,
        );
      i = e.pop();
    }
    return [e, i];
  }
  class ot {
    static build(t, e, r) {
      if ("_inner" === t.name) throw new n6("the _inner name is reserved");
      let n = (...i) => {
        let [o, s] = i7(t, [...i]);
        rn(t.accounts, s.accounts);
        let a = n.accounts(s.accounts);
        return (
          void 0 !== s.remainingAccounts && a.push(...s.remainingAccounts),
          n1("debug-logs") && console.log("Outgoing account metas:", a),
          new y.TransactionInstruction({
            keys: a,
            programId: r,
            data: e(t.name, rr(t, ...o)),
          })
        );
      };
      return (
        (n.accounts = (e) => ot.accountsArray(e, t.accounts, r, t.name)),
        n
      );
    }
    static accountsArray(t, e, r, n) {
      return t
        ? e
            .map((e) => {
              let i;
              if (e4(e)) {
                let i = t[e.name];
                return ot.accountsArray(i, e.accounts, r, n).flat();
              }
              try {
                i = ri(t[e.name]);
              } catch (t) {
                throw Error(
                  `Wrong input type for account "${e.name}" in the instruction accounts object${void 0 !== n ? ' for instruction "' + n + '"' : ""}. Expected PublicKey or string.`,
                );
              }
              let o = e.optional && i.equals(r);
              return {
                pubkey: i,
                isWritable: !!(e.writable && !o),
                isSigner: !!(e.signer && !o),
              };
            })
            .flat()
        : [];
    }
  }
  class oe {
    static build(t, e) {
      return (...r) => {
        var n, i, o;
        let [, s] = i7(t, [...r]),
          a = new y.Transaction();
        if (s.preInstructions && s.instructions)
          throw Error("instructions is deprecated, use preInstructions");
        return (
          null == (n = s.preInstructions) || n.forEach((t) => a.add(t)),
          null == (i = s.instructions) || i.forEach((t) => a.add(t)),
          a.add(e(...r)),
          null == (o = s.postInstructions) || o.forEach((t) => a.add(t)),
          a
        );
      };
    }
  }
  class or {
    static build(t, e, r, n) {
      return async (...i) => {
        var o;
        let s = e(...i),
          [, a] = i7(t, [...i]);
        if (void 0 === n.sendAndConfirm)
          throw Error(
            "This function requires 'Provider.sendAndConfirm' to be implemented.",
          );
        try {
          return await n.sendAndConfirm(
            s,
            null != (o = a.signers) ? o : [],
            a.options,
          );
        } catch (t) {
          throw n4(t, r);
        }
      };
    }
  }
  class on {
    static build(t, e, r, n) {
      var i;
      return (null != (i = t.accounts) ? i : []).reduce(
        (i, o) => ((i[o.name] = new oi(t, o, r, n, e)), i),
        {},
      );
    }
  }
  class oi {
    get size() {
      return this._size;
    }
    get programId() {
      return this._programId;
    }
    get provider() {
      return this._provider;
    }
    get coder() {
      return this._coder;
    }
    constructor(t, e, r, n, i) {
      ((this._idlAccount = e),
        (this._programId = r),
        (this._provider = null != n ? n : rP()),
        (this._coder = null != i ? i : new ia(t)),
        (this._size = this._coder.accounts.size(e.name)));
    }
    async fetchNullable(t, e) {
      let { data: r } = await this.fetchNullableAndContext(t, e);
      return r;
    }
    async fetchNullableAndContext(t, e) {
      let { value: r, context: n } = await this.getAccountInfoAndContext(t, e);
      return {
        data:
          r && 0 !== r.data.length
            ? this._coder.accounts.decode(this._idlAccount.name, r.data)
            : null,
        context: n,
      };
    }
    async fetch(t, e) {
      let { data: r } = await this.fetchNullableAndContext(t, e);
      if (null === r)
        throw Error(`Account does not exist or has no data ${t.toString()}`);
      return r;
    }
    async fetchAndContext(t, e) {
      let { data: r, context: n } = await this.fetchNullableAndContext(t, e);
      if (null === r) throw Error(`Account does not exist ${t.toString()}`);
      return { data: r, context: n };
    }
    async fetchMultiple(t, e) {
      return (await this.fetchMultipleAndContext(t, e)).map((t) =>
        t ? t.data : null,
      );
    }
    async fetchMultipleAndContext(t, e) {
      return (
        await rO(
          this._provider.connection,
          t.map((t) => ri(t)),
          e,
        )
      ).map((t) => {
        if (null == t) return null;
        let { account: e, context: r } = t;
        return {
          data: this._coder.accounts.decode(this._idlAccount.name, e.data),
          context: r,
        };
      });
    }
    async all(t) {
      let e = this.coder.accounts.memcmp(
          this._idlAccount.name,
          t instanceof _.Buffer ? t : void 0,
        ),
        r = [];
      return (
        (null == e ? void 0 : e.offset) != void 0 &&
          (null == e ? void 0 : e.bytes) != void 0 &&
          r.push({ memcmp: { offset: e.offset, bytes: e.bytes } }),
        (null == e ? void 0 : e.dataSize) != void 0 &&
          r.push({ dataSize: e.dataSize }),
        (
          await this._provider.connection.getProgramAccounts(this._programId, {
            commitment: this._provider.connection.commitment,
            filters: [...r, ...(Array.isArray(t) ? t : [])],
          })
        ).map(({ pubkey: t, account: e }) => ({
          publicKey: t,
          account: this._coder.accounts.decode(this._idlAccount.name, e.data),
        }))
      );
    }
    subscribe(t, e) {
      let r = oo.get(t.toString());
      if (r) return r.ee;
      let n = new e1.default();
      t = ri(t);
      let i = this._provider.connection.onAccountChange(
        t,
        (t) => {
          let e = this._coder.accounts.decode(this._idlAccount.name, t.data);
          n.emit("change", e);
        },
        e,
      );
      return (oo.set(t.toString(), { ee: n, listener: i }), n);
    }
    async unsubscribe(t) {
      let e = oo.get(t.toString());
      e
        ? oo &&
          (await this._provider.connection
            .removeAccountChangeListener(e.listener)
            .then(() => {
              oo.delete(t.toString());
            })
            .catch(console.error))
        : console.warn("Address is not subscribed");
    }
    async createInstruction(t, e) {
      let r = this.size;
      if (void 0 === this._provider.publicKey)
        throw Error(
          "This function requires the Provider interface implementor to have a 'publicKey' field.",
        );
      return y.SystemProgram.createAccount({
        fromPubkey: this._provider.publicKey,
        newAccountPubkey: t.publicKey,
        space: null != e ? e : r,
        lamports:
          await this._provider.connection.getMinimumBalanceForRentExemption(
            null != e ? e : r,
          ),
        programId: this._programId,
      });
    }
    async getAccountInfo(t, e) {
      return await this._provider.connection.getAccountInfo(ri(t), e);
    }
    async getAccountInfoAndContext(t, e) {
      return await this._provider.connection.getAccountInfoAndContext(ri(t), e);
    }
  }
  let oo = new Map();
  class os {
    static build(t, e, r, n, i, o, s) {
      return async (...a) => {
        var u;
        let l,
          h = e(...a),
          [, c] = i7(t, [...a]);
        if (void 0 === n.simulate)
          throw Error(
            "This function requires 'Provider.simulate' to be implemented.",
          );
        try {
          l = await n.simulate(
            h,
            c.signers,
            null == (u = c.options) ? void 0 : u.commitment,
          );
        } catch (t) {
          throw n4(t, r);
        }
        if (void 0 === l) throw Error("Unable to simulate transaction");
        let d = l.logs;
        if (!d) throw Error("Simulated logs not found");
        let f = [];
        if (s.events) for (let t of new i8(o, i).parseLogs(d)) f.push(t);
        return { events: f, raw: d };
      };
    }
  }
  function oa(t) {
    return new ol(
      iM(8),
      (t) => oc.fromBuffer(t),
      (t) => t.toBuffer(),
      t,
    );
  }
  function ou(t) {
    return new ol(
      iM(32),
      (t) => new y.PublicKey(t),
      (t) => t.toBuffer(),
      t,
    );
  }
  class ol extends il {
    constructor(t, e, r, n) {
      (super(t.span, n),
        (this.layout = t),
        (this.decoder = e),
        (this.encoder = r));
    }
    decode(t, e) {
      return this.decoder(this.layout.decode(t, e));
    }
    encode(t, e, r) {
      return this.layout.encode(this.encoder(t), e, r);
    }
    getSpan(t, e) {
      return this.layout.getSpan(t, e);
    }
  }
  class oh extends il {
    constructor(t, e) {
      (super(-1, e), (this.layout = t), (this.discriminator = iA()));
    }
    encode(t, e, r = 0) {
      return null == t
        ? this.layout.span + this.discriminator.encode(0, e, r)
        : (this.discriminator.encode(1, e, r),
          this.layout.encode(t, e, r + 4) + 4);
    }
    decode(t, e = 0) {
      let r = this.discriminator.decode(t, e);
      if (0 === r) return null;
      if (1 === r) return this.layout.decode(t, e + 4);
      throw Error("Invalid coption " + this.layout.property);
    }
    getSpan(t, e = 0) {
      return this.layout.getSpan(t, e + 4) + 4;
    }
  }
  class oc extends g.default {
    toBuffer() {
      let t = super.toArray().reverse(),
        e = _.Buffer.from(t);
      if (8 === e.length) return e;
      if (e.length >= 8) throw Error("u64 too large");
      let r = _.Buffer.alloc(8);
      return (e.copy(r), r);
    }
    static fromBuffer(t) {
      if (8 !== t.length) throw Error(`Invalid buffer length: ${t.length}`);
      return new oc(
        [...t]
          .reverse()
          .map((t) => `00${t.toString(16)}`.slice(-2))
          .join(""),
        16,
      );
    }
  }
  let od = iT([
    ou("mint"),
    ou("owner"),
    oa("amount"),
    new oh(ou(), "delegate"),
    ((s = iN(new id(1, "discriminator"), null, "state")).addVariant(
      0,
      iT([]),
      "uninitialized",
    ),
    s.addVariant(1, iT([]), "initialized"),
    s.addVariant(2, iT([]), "frozen"),
    s),
    new oh(oa(), "isNative"),
    oa("delegatedAmount"),
    new oh(ou(), "closeAuthority"),
  ]);
  class of {
    constructor(t, e, r, n, i, o, s, a) {
      ((this._args = t),
        (this._accounts = e),
        (this._provider = r),
        (this._programId = n),
        (this._idlIx = i),
        (this._idlTypes = s),
        (this._customResolver = a),
        (this._accountStore = new op(r, o, n)));
    }
    args(t) {
      this._args = t;
    }
    async resolve() {
      (this.resolveEventCpi(this._idlIx.accounts),
        this.resolveConst(this._idlIx.accounts));
      let t = 0;
      for (
        ;
        (await this.resolvePdasAndRelations(this._idlIx.accounts)) +
          (await this.resolveCustom()) >
        0;

      )
        if (16 == ++t) {
          let t = (e) =>
              e4(e)
                ? e.accounts.some(t)
                : !!(e.address || e.pda || e.relations),
            e = (t, r = [], n = []) => {
              for (let i of t)
                e4(i)
                  ? n.push(...e(i.accounts, [...r, i.name]))
                  : n.push([...r, i.name]);
              return n;
            },
            r = e(this._idlIx.accounts.filter(t))
              .filter((t) => !this.get(t))
              .map((t) => t.reduce((t, e) => t + "." + e))
              .map((t) => `\`${t}\``)
              .join(", ");
          throw Error(
            `Reached maximum depth for account resolution. Unresolved accounts: ${r}`,
          );
        }
    }
    resolveOptionals(t) {
      Object.assign(
        this._accounts,
        this.resolveOptionalsHelper(t, this._idlIx.accounts),
      );
    }
    get(t) {
      let e = t.reduce((t, e) => t && t[e], this._accounts);
      if (e && e.toBase58) return e;
    }
    set(t, e) {
      let r = this._accounts;
      t.forEach((n, i) => {
        var o;
        (i === t.length - 1 && (r[n] = e),
          (r[n] = null != (o = r[n]) ? o : {}),
          (r = r[n]));
      });
    }
    resolveOptionalsHelper(t, e) {
      let r = {};
      for (let n of e) {
        let e = n.name,
          i = t[e];
        void 0 !== i &&
          (o_(i)
            ? e4(n)
              ? (r[e] = this.resolveOptionalsHelper(i, n.accounts))
              : (r[e] = (function t(e, r) {
                  let n = {};
                  for (let i in e) {
                    let o = e[i];
                    if (null === o) {
                      if (r)
                        throw Error(
                          "Failed to resolve optionals due to IDL type mismatch with input accounts!",
                        );
                      continue;
                    }
                    n[i] = o_(o) ? t(o, !0) : ri(o);
                  }
                  return n;
                })(i, !0))
            : null !== i
              ? (r[e] = ri(i))
              : n.optional && (r[e] = this._programId));
      }
      return r;
    }
    async resolveCustom() {
      if (this._customResolver) {
        let { accounts: t, resolved: e } = await this._customResolver({
          args: this._args,
          accounts: this._accounts,
          provider: this._provider,
          programId: this._programId,
          idlIx: this._idlIx,
        });
        return ((this._accounts = t), e);
      }
      return 0;
    }
    resolveEventCpi(t, e = []) {
      for (let r in t) {
        let n = t[r];
        e4(n) && this.resolveEventCpi(n.accounts, [...e, n.name]);
        let i = +r + 1;
        if (i === t.length) return;
        let o = t[r].name,
          s = t[i].name;
        if ("eventAuthority" === o && "program" === s) {
          let t = [...e, o],
            r = [...e, s];
          (this.get(t) ||
            this.set(
              t,
              y.PublicKey.findProgramAddressSync(
                [_.Buffer.from("__event_authority")],
                this._programId,
              )[0],
            ),
            this.get(r) || this.set(r, this._programId));
          return;
        }
      }
    }
    resolveConst(t, e = []) {
      for (let r of t) {
        let t = r.name;
        if (e4(r)) this.resolveConst(r.accounts, [...e, t]);
        else if ((r.signer || r.address) && !this.get([...e, t])) {
          if (r.signer) {
            if (!this._provider.publicKey)
              throw Error(
                "This function requires the `Provider` interface implementor to have a `publicKey` field.",
              );
            this.set([...e, t], this._provider.publicKey);
          }
          r.address && this.set([...e, t], ri(r.address));
        }
      }
    }
    async resolvePdasAndRelations(t, e = []) {
      let r = 0;
      for (let n of t) {
        let t = n.name;
        if (e4(n))
          r += await this.resolvePdasAndRelations(n.accounts, [...e, t]);
        else if ((n.pda || n.relations) && !this.get([...e, t])) {
          r++;
          try {
            if (n.pda) {
              let r = await Promise.all(
                n.pda.seeds.map((t) => this.toBuffer(t, e)),
              );
              if (r.some((t) => !t)) continue;
              let i = await this.parseProgramId(n, e),
                [o] = y.PublicKey.findProgramAddressSync(r, i);
              this.set([...e, t], o);
            }
          } catch {}
          try {
            if (n.relations) {
              let r = this.get([...e, n.relations[0]]);
              if (r) {
                let n = await this._accountStore.fetchAccount({ publicKey: r });
                this.set([...e, t], n[t]);
              }
            }
          } catch {}
        }
      }
      return r;
    }
    async parseProgramId(t, e = []) {
      var r;
      if (!(null == (r = t.pda) ? void 0 : r.program)) return this._programId;
      let n = await this.toBuffer(t.pda.program, e);
      if (!n) throw Error(`Program seed not resolved: ${t.name}`);
      return new y.PublicKey(n);
    }
    async toBuffer(t, e = []) {
      switch (t.kind) {
        case "const":
          return this.toBufferConst(t);
        case "arg":
          return await this.toBufferArg(t);
        case "account":
          return await this.toBufferAccount(t, e);
        default:
          throw Error(`Unexpected seed: ${t}`);
      }
    }
    toBufferConst(t) {
      return this.toBufferValue("bytes", t.value);
    }
    async toBufferArg(t) {
      let [e, ...r] = t.path.split("."),
        n = this._idlIx.args.findIndex((t) => t.name === e);
      if (-1 === n) throw Error(`Unable to find argument for seed: ${e}`);
      let i = r.reduce((t, e) => (null != t ? t : {})[e], this._args[n]);
      if (void 0 === i) return;
      let o = this.getType(this._idlIx.args[n].type, r);
      return this.toBufferValue(o, i);
    }
    async toBufferAccount(t, e = []) {
      let [r, ...n] = t.path.split("."),
        i = this.get([...e, r]);
      if (!i) return;
      if (!n.length) return this.toBufferValue("pubkey", i);
      if (!t.account)
        throw Error(
          `Seed account is required in order to resolve type: ${t.path}`,
        );
      let o = await this._accountStore.fetchAccount({
          publicKey: i,
          name: t.account,
        }),
        s = n;
      for (; s.length > 0; ) ((o = o[s[0]]), (s = s.slice(1)));
      if (void 0 === o) return;
      let a = this.getType({ defined: { name: t.account } }, n);
      return this.toBufferValue(a, o);
    }
    toBufferValue(t, e) {
      switch (t) {
        case "u8":
        case "i8":
          return _.Buffer.from([e]);
        case "u16":
        case "i16":
          return new g.default(e).toArrayLike(_.Buffer, "le", 2);
        case "u32":
        case "i32":
          return new g.default(e).toArrayLike(_.Buffer, "le", 4);
        case "u64":
        case "i64":
          return new g.default(e).toArrayLike(_.Buffer, "le", 8);
        case "u128":
        case "i128":
          return new g.default(e).toArrayLike(_.Buffer, "le", 16);
        case "u256":
        case "i256":
          return new g.default(e).toArrayLike(_.Buffer, "le", 32);
        case "string":
        case "bytes":
          return _.Buffer.from(e);
        case "pubkey":
          return e.toBuffer();
        default:
          if (null == t ? void 0 : t.array) return _.Buffer.from(e);
          throw Error(`Unexpected seed type: ${t}`);
      }
    }
    getType(t, e = []) {
      var r;
      let n = null == (r = null == t ? void 0 : t.defined) ? void 0 : r.name;
      if (n) {
        if ("tokenAccount" === n)
          switch (e.at(0)) {
            case "mint":
            case "owner":
              return "pubkey";
            case "amount":
            case "delagatedAmount":
              return "u64";
            default:
              throw Error(`Unknown token account path: ${e}`);
          }
        let t = this._idlTypes.find((t) => t.name === n);
        if (!t) throw Error(`Type not found: ${n}`);
        let [r, ...i] = e,
          o = t.type.fields.find((t) => t.name === r);
        if (!o) throw Error(`Field not found: ${r}`);
        return this.getType(o.type, i);
      }
      return t;
    }
  }
  class op {
    constructor(t, e, r) {
      ((this._provider = t),
        (this._cache = new Map()),
        (this._idls = {}),
        (this._idls[r.toBase58()] = e));
    }
    async fetchAccount({ publicKey: t, name: e }) {
      let r = t.toBase58();
      if (!this._cache.has(r)) {
        let i = await this._provider.connection.getAccountInfo(t);
        if (null === i) throw Error(`Account not found: ${r}`);
        if ("tokenAccount" === e) {
          var n;
          let t = ((n = i.data), od.decode(n));
          this._cache.set(r, t);
        } else {
          let t = await this.getAccountsNs(i.owner);
          if (t) {
            let e = Object.values(t)[0];
            if (e) {
              let t = e.coder.accounts.decodeAny(i.data);
              this._cache.set(r, t);
            }
          }
        }
      }
      return this._cache.get(r);
    }
    async getAccountsNs(t) {
      let e = t.toBase58();
      if (!this._idls[e]) {
        let r = await ov.fetchIdl(t, this._provider);
        if (r) {
          let t = new ov(r, this._provider);
          this._idls[e] = t.account;
        }
      }
      return this._idls[e];
    }
  }
  class om {
    static build(t, e, r, n, i, o, s, a, u, l, h) {
      return (...c) => new og(c, n, i, o, s, a, t, e, r, u, l, h);
    }
  }
  function o_(t) {
    return "object" == typeof t && null !== t && !("_bn" in t);
  }
  class og {
    constructor(t, e, r, n, i, o, s, a, u, l, h, c) {
      ((this._args = t),
        (this._ixFn = e),
        (this._txFn = r),
        (this._rpcFn = n),
        (this._simulateFn = i),
        (this._viewFn = o),
        (this._accounts = {}),
        (this._remainingAccounts = []),
        (this._signers = []),
        (this._preInstructions = []),
        (this._postInstructions = []),
        (this._resolveAccounts = !0),
        (this._accountsResolver = new of(t, this._accounts, s, a, u, l, h, c)));
    }
    args(t) {
      ((this._args = t), this._accountsResolver.args(t));
    }
    accounts(t) {
      return this.accountsPartial(t);
    }
    accountsPartial(t) {
      return (
        (this._resolveAccounts = !0),
        this._accountsResolver.resolveOptionals(t),
        this
      );
    }
    accountsStrict(t) {
      return (
        (this._resolveAccounts = !1),
        this._accountsResolver.resolveOptionals(t),
        this
      );
    }
    signers(t) {
      return ((this._signers = this._signers.concat(t)), this);
    }
    remainingAccounts(t) {
      return (
        (this._remainingAccounts = this._remainingAccounts.concat(t)),
        this
      );
    }
    preInstructions(t, e = !1) {
      return (
        e
          ? (this._preInstructions = t.concat(this._preInstructions))
          : (this._preInstructions = this._preInstructions.concat(t)),
        this
      );
    }
    postInstructions(t) {
      return (
        (this._postInstructions = this._postInstructions.concat(t)),
        this
      );
    }
    async pubkeys() {
      return (
        this._resolveAccounts && (await this._accountsResolver.resolve()),
        this._accounts
      );
    }
    async instruction() {
      return (
        this._resolveAccounts && (await this._accountsResolver.resolve()),
        this._ixFn(...this._args, {
          accounts: this._accounts,
          signers: this._signers,
          remainingAccounts: this._remainingAccounts,
          preInstructions: this._preInstructions,
          postInstructions: this._postInstructions,
        })
      );
    }
    async transaction() {
      return (
        this._resolveAccounts && (await this._accountsResolver.resolve()),
        this._txFn(...this._args, {
          accounts: this._accounts,
          signers: this._signers,
          remainingAccounts: this._remainingAccounts,
          preInstructions: this._preInstructions,
          postInstructions: this._postInstructions,
        })
      );
    }
    async simulate(t) {
      return (
        this._resolveAccounts && (await this._accountsResolver.resolve()),
        this._simulateFn(...this._args, {
          accounts: this._accounts,
          signers: this._signers,
          remainingAccounts: this._remainingAccounts,
          preInstructions: this._preInstructions,
          postInstructions: this._postInstructions,
          options: t,
        })
      );
    }
    async view(t) {
      if (
        (this._resolveAccounts && (await this._accountsResolver.resolve()),
        !this._viewFn)
      )
        throw Error(
          "Method does not support views. The instruction should return a value, and its accounts must be read-only",
        );
      return this._viewFn(...this._args, {
        accounts: this._accounts,
        signers: this._signers,
        remainingAccounts: this._remainingAccounts,
        preInstructions: this._preInstructions,
        postInstructions: this._postInstructions,
        options: t,
      });
    }
    async rpc(t) {
      return (
        this._resolveAccounts && (await this._accountsResolver.resolve()),
        this._rpcFn(...this._args, {
          accounts: this._accounts,
          signers: this._signers,
          remainingAccounts: this._remainingAccounts,
          preInstructions: this._preInstructions,
          postInstructions: this._postInstructions,
          options: t,
        })
      );
    }
    async rpcAndKeys(t) {
      return { signature: await this.rpc(t), pubkeys: await this.pubkeys() };
    }
    async prepare() {
      return {
        instruction: await this.instruction(),
        signers: this._signers,
        pubkeys: await this.pubkeys(),
      };
    }
  }
  class oy {
    static build(t, e, r, n) {
      let i = e.accounts.find((t) => t.writable),
        o = !!e.returns;
      if (!i && o)
        return async (...i) => {
          let o = await r(...i),
            s = `Program return: ${t} `,
            a = o.raw.find((t) => t.startsWith(s));
          if (!a) throw Error("View expected return log");
          let u = e5(a.slice(s.length)),
            l = e.returns;
          if (!l) throw Error("View expected return type");
          return it.fieldLayout({ type: l }, n.types).decode(u);
        };
    }
  }
  class ow {
    static build(t, e, r, n, i) {
      let o = {},
        s = {},
        a = {},
        u = {},
        l = {},
        h = {},
        c = re(t),
        d = t.accounts ? on.build(t, e, r, n) : {};
      return (
        t.instructions.forEach((f) => {
          let p = ot.build(f, (t, r) => e.instruction.encode(t, r), r),
            m = oe.build(f, p),
            _ = or.build(f, m, c, n),
            g = os.build(f, m, c, n, e, r, t),
            y = oy.build(r, f, g, t),
            w = om.build(
              n,
              r,
              f,
              p,
              m,
              _,
              g,
              y,
              d,
              t.types || [],
              null == i ? void 0 : i(f),
            ),
            v = f.name;
          ((s[v] = p),
            (a[v] = m),
            (o[v] = _),
            (u[v] = g),
            (l[v] = w),
            y && (h[v] = y));
        }),
        [o, s, a, d, u, l, h]
      );
    }
  }
  class ov {
    get programId() {
      return this._programId;
    }
    get idl() {
      return this._idl;
    }
    get rawIdl() {
      return this._rawIdl;
    }
    get coder() {
      return this._coder;
    }
    get provider() {
      return this._provider;
    }
    constructor(t, e = rP(), r, n) {
      let i, o, s, a;
      ((this._idl =
        ((i = ["name", "path", "account", "relations", "generic"]),
        (o = (t) => t.split(".").map(b.default).join(".")),
        (s = (t) => {
          for (let e in t) {
            let r = t[e];
            i.includes(e)
              ? (t[e] = Array.isArray(r) ? r.map(o) : o(r))
              : "object" == typeof r && s(r);
          }
        }),
        (a = structuredClone(t)),
        s(a),
        a)),
        (this._rawIdl = t),
        (this._provider = e),
        (this._programId = ri(t.address)),
        (this._coder = null != r ? r : new ia(this._idl)),
        (this._events = new i5(this._programId, e, this._coder)));
      let [u, l, h, c, d, f, p] = ow.build(
        this._idl,
        this._coder,
        this._programId,
        e,
        n,
      );
      ((this.rpc = u),
        (this.instruction = l),
        (this.transaction = h),
        (this.account = c),
        (this.simulate = d),
        (this.methods = f),
        (this.views = p));
    }
    static async at(t, e) {
      let r = ri(t),
        n = await ov.fetchIdl(r, e);
      if (!n) throw Error(`IDL not found for program: ${t.toString()}`);
      return new ov(n, e);
    }
    static async fetchIdl(t, e) {
      var r;
      e = null != e ? e : rP();
      let n = ri(t),
        i = await e9(n),
        o = await e.connection.getAccountInfo(i);
      return o
        ? JSON.parse(e6(eQ(((r = o.data.slice(8)), e7.decode(r)).data)))
        : null;
    }
    addEventListener(t, e, r) {
      return this._events.addEventListener(t, e, r);
    }
    async removeEventListener(t) {
      return await this._events.removeEventListener(t);
    }
  }
  new y.PublicKey("11111111111111111111111111111111");
  let ob = {
    address: "11111111111111111111111111111111",
    metadata: { name: "systemProgram", version: "0.1.0", spec: "0.1.0" },
    instructions: [
      {
        name: "advanceNonceAccount",
        discriminator: [4, 0, 0, 0],
        accounts: [
          { name: "nonce", writable: !0 },
          { name: "recentBlockhashes" },
          { name: "authorized", signer: !0 },
        ],
        args: [{ name: "authorized", type: "pubkey" }],
      },
      {
        name: "allocate",
        discriminator: [8, 0, 0, 0],
        accounts: [{ name: "pubkey", writable: !0, signer: !0 }],
        args: [{ name: "space", type: "u64" }],
      },
      {
        name: "allocateWithSeed",
        discriminator: [9, 0, 0, 0],
        accounts: [
          { name: "account", writable: !0 },
          { name: "base", signer: !0 },
        ],
        args: [
          { name: "base", type: "pubkey" },
          { name: "seed", type: "string" },
          { name: "space", type: "u64" },
          { name: "owner", type: "pubkey" },
        ],
      },
      {
        name: "assign",
        discriminator: [1, 0, 0, 0],
        accounts: [{ name: "pubkey", writable: !0, signer: !0 }],
        args: [{ name: "owner", type: "pubkey" }],
      },
      {
        name: "assignWithSeed",
        discriminator: [10, 0, 0, 0],
        accounts: [
          { name: "account", writable: !0 },
          { name: "base", signer: !0 },
        ],
        args: [
          { name: "base", type: "pubkey" },
          { name: "seed", type: "string" },
          { name: "owner", type: "pubkey" },
        ],
      },
      {
        name: "authorizeNonceAccount",
        discriminator: [7, 0, 0, 0],
        accounts: [
          { name: "nonce", writable: !0 },
          { name: "authorized", signer: !0 },
        ],
        args: [{ name: "authorized", type: "pubkey" }],
      },
      {
        name: "createAccount",
        discriminator: [0, 0, 0, 0],
        accounts: [
          { name: "from", writable: !0, signer: !0 },
          { name: "to", writable: !0, signer: !0 },
        ],
        args: [
          { name: "lamports", type: "u64" },
          { name: "space", type: "u64" },
          { name: "owner", type: "pubkey" },
        ],
      },
      {
        name: "createAccountWithSeed",
        discriminator: [3, 0, 0, 0],
        accounts: [
          { name: "from", writable: !0, signer: !0 },
          { name: "to", writable: !0 },
          { name: "base", signer: !0 },
        ],
        args: [
          { name: "base", type: "pubkey" },
          { name: "seed", type: "string" },
          { name: "lamports", type: "u64" },
          { name: "space", type: "u64" },
          { name: "owner", type: "pubkey" },
        ],
      },
      {
        name: "initializeNonceAccount",
        discriminator: [6, 0, 0, 0],
        accounts: [
          { name: "nonce", writable: !0, signer: !0 },
          { name: "recentBlockhashes" },
          {
            name: "rent",
            address: "SysvarRent111111111111111111111111111111111",
          },
        ],
        args: [{ name: "authorized", type: "pubkey" }],
      },
      {
        name: "transfer",
        discriminator: [2, 0, 0, 0],
        accounts: [
          { name: "from", writable: !0, signer: !0 },
          { name: "to", writable: !0 },
        ],
        args: [{ name: "lamports", type: "u64" }],
      },
      {
        name: "transferWithSeed",
        discriminator: [11, 0, 0, 0],
        accounts: [
          { name: "from", writable: !0 },
          { name: "base", signer: !0 },
          { name: "to", writable: !0 },
        ],
        args: [
          { name: "lamports", type: "u64" },
          { name: "seed", type: "string" },
          { name: "owner", type: "pubkey" },
        ],
      },
      {
        name: "withdrawNonceAccount",
        discriminator: [5, 0, 0, 0],
        accounts: [
          { name: "nonce", writable: !0 },
          { name: "to", writable: !0 },
          { name: "recentBlockhashes" },
          {
            name: "rent",
            address: "SysvarRent111111111111111111111111111111111",
          },
          { name: "authorized", signer: !0 },
        ],
        args: [{ name: "lamports", type: "u64" }],
      },
    ],
    accounts: [{ name: "nonce", discriminator: [] }],
    types: [
      {
        name: "feeCalculator",
        type: {
          kind: "struct",
          fields: [{ name: "lamportsPerSignature", type: "u64" }],
        },
      },
      {
        name: "nonce",
        type: {
          kind: "struct",
          fields: [
            { name: "version", type: "u32" },
            { name: "state", type: "u32" },
            { name: "authorizedPubkey", type: "pubkey" },
            { name: "nonce", type: "pubkey" },
            {
              name: "feeCalculator",
              type: { defined: { name: "feeCalculator" } },
            },
          ],
        },
      },
    ],
  };
  t.s(
    [
      "r",
      0,
      oi,
      "x",
      0,
      n5,
      "F",
      0,
      rS,
      "u",
      0,
      ii,
      "$",
      0,
      ia,
      "R",
      0,
      io,
      "S",
      0,
      ie,
      "c",
      0,
      i5,
      "Z",
      0,
      i8,
      "P",
      0,
      n6,
      "Q",
      0,
      n9,
      "T",
      0,
      n7,
      "s",
      0,
      om,
      "q",
      0,
      class {
        static system(t) {
          return new ov(ob, t, new ij(ob));
        }
      },
      "v",
      0,
      ov,
      "U",
      0,
      n8,
      "w",
      0,
      n3,
      "E",
      0,
      ij,
      "A",
      0,
      rP,
      "y",
      0,
      re,
      "h",
      0,
      function (t) {
        rU = t;
      },
      "m",
      0,
      i7,
      "e",
      0,
      rr,
      "V",
      0,
      ri,
      "z",
      0,
      n4,
      "Y",
      0,
      i0,
      "W",
      0,
      rn,
    ],
    353110,
  );
};
