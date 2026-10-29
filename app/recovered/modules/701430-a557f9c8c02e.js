// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let {
      StringPrototypeSlice: n,
      SymbolIterator: i,
      TypedArrayPrototypeSet: o,
      Uint8Array: a,
    } = e.r(763323),
    { Buffer: s } = e.r(259390),
    { inspect: l } = e.r(984651);
  t.exports = class {
    constructor() {
      ((this.head = null), (this.tail = null), (this.length = 0));
    }
    push(e) {
      let t = { data: e, next: null };
      (this.length > 0 ? (this.tail.next = t) : (this.head = t),
        (this.tail = t),
        ++this.length);
    }
    unshift(e) {
      let t = { data: e, next: this.head };
      (0 === this.length && (this.tail = t), (this.head = t), ++this.length);
    }
    shift() {
      if (0 === this.length) return;
      let e = this.head.data;
      return (
        1 === this.length
          ? (this.head = this.tail = null)
          : (this.head = this.head.next),
        --this.length,
        e
      );
    }
    clear() {
      ((this.head = this.tail = null), (this.length = 0));
    }
    join(e) {
      if (0 === this.length) return "";
      let t = this.head,
        r = "" + t.data;
      for (; null !== (t = t.next); ) r += e + t.data;
      return r;
    }
    concat(e) {
      if (0 === this.length) return s.alloc(0);
      let t = s.allocUnsafe(e >>> 0),
        r = this.head,
        n = 0;
      for (; r; ) (o(t, r.data, n), (n += r.data.length), (r = r.next));
      return t;
    }
    consume(e, t) {
      let r = this.head.data;
      if (e < r.length) {
        let t = r.slice(0, e);
        return ((this.head.data = r.slice(e)), t);
      }
      return e === r.length
        ? this.shift()
        : t
          ? this._getString(e)
          : this._getBuffer(e);
    }
    first() {
      return this.head.data;
    }
    *[i]() {
      for (let e = this.head; e; e = e.next) yield e.data;
    }
    _getString(e) {
      let t = "",
        r = this.head,
        i = 0;
      do {
        let o = r.data;
        if (e > o.length) ((t += o), (e -= o.length));
        else {
          e === o.length
            ? ((t += o),
              ++i,
              r.next ? (this.head = r.next) : (this.head = this.tail = null))
            : ((t += n(o, 0, e)), (this.head = r), (r.data = n(o, e)));
          break;
        }
        ++i;
      } while (null !== (r = r.next));
      return ((this.length -= i), t);
    }
    _getBuffer(e) {
      let t = s.allocUnsafe(e),
        r = e,
        n = this.head,
        i = 0;
      do {
        let s = n.data;
        if (e > s.length) (o(t, s, r - e), (e -= s.length));
        else {
          e === s.length
            ? (o(t, s, r - e),
              ++i,
              n.next ? (this.head = n.next) : (this.head = this.tail = null))
            : (o(t, new a(s.buffer, s.byteOffset, e), r - e),
              (this.head = n),
              (n.data = s.slice(e)));
          break;
        }
        ++i;
      } while (null !== (n = n.next));
      return ((this.length -= i), t);
    }
    [Symbol.for("nodejs.util.inspect.custom")](e, t) {
      return l(this, { ...t, depth: 0, customInspect: !1 });
    }
  };
};
