// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(532617);
  class i extends t.f {
    constructor({ offset: e }) {
      super(`Offset \`${e}\` cannot be negative.`, {
        name: "NegativeOffsetError",
      });
    }
  }
  class f extends t.f {
    constructor({ length: e, position: t }) {
      super(`Position \`${t}\` is out of bounds (\`0 < position < ${e}\`).`, {
        name: "PositionOutOfBoundsError",
      });
    }
  }
  class s extends t.f {
    constructor({ count: e, limit: t }) {
      super(
        `Recursive read limit of \`${t}\` exceeded (recursive read count: \`${e}\`).`,
        { name: "RecursiveReadLimitExceededError" },
      );
    }
  }
  e.s(["R", 0, i, "n", 0, f, "_", 0, s], 782102);
  let n = {
    bytes: new Uint8Array(),
    dataView: new DataView(new ArrayBuffer(0)),
    position: 0,
    positionReadCount: new Map(),
    recursiveReadCount: 0,
    recursiveReadLimit: 1 / 0,
    assertReadLimit() {
      if (this.recursiveReadCount >= this.recursiveReadLimit)
        throw new s({
          count: this.recursiveReadCount + 1,
          limit: this.recursiveReadLimit,
        });
    },
    assertPosition(e) {
      if (e < 0 || e > this.bytes.length - 1)
        throw new f({ length: this.bytes.length, position: e });
    },
    decrementPosition(e) {
      if (e < 0) throw new i({ offset: e });
      let t = this.position - e;
      (this.assertPosition(t), (this.position = t));
    },
    getReadCount(e) {
      return this.positionReadCount.get(e || this.position) || 0;
    },
    incrementPosition(e) {
      if (e < 0) throw new i({ offset: e });
      let t = this.position + e;
      (this.assertPosition(t), (this.position = t));
    },
    inspectByte(e) {
      let t = e ?? this.position;
      return (this.assertPosition(t), this.bytes[t]);
    },
    inspectBytes(e, t) {
      let i = t ?? this.position;
      return (this.assertPosition(i + e - 1), this.bytes.subarray(i, i + e));
    },
    inspectUint8(e) {
      let t = e ?? this.position;
      return (this.assertPosition(t), this.bytes[t]);
    },
    inspectUint16(e) {
      let t = e ?? this.position;
      return (this.assertPosition(t + 1), this.dataView.getUint16(t));
    },
    inspectUint24(e) {
      let t = e ?? this.position;
      return (
        this.assertPosition(t + 2),
        (this.dataView.getUint16(t) << 8) + this.dataView.getUint8(t + 2)
      );
    },
    inspectUint32(e) {
      let t = e ?? this.position;
      return (this.assertPosition(t + 3), this.dataView.getUint32(t));
    },
    pushByte(e) {
      (this.assertPosition(this.position),
        (this.bytes[this.position] = e),
        this.position++);
    },
    pushBytes(e) {
      (this.assertPosition(this.position + e.length - 1),
        this.bytes.set(e, this.position),
        (this.position += e.length));
    },
    pushUint8(e) {
      (this.assertPosition(this.position),
        (this.bytes[this.position] = e),
        this.position++);
    },
    pushUint16(e) {
      (this.assertPosition(this.position + 1),
        this.dataView.setUint16(this.position, e),
        (this.position += 2));
    },
    pushUint24(e) {
      (this.assertPosition(this.position + 2),
        this.dataView.setUint16(this.position, e >> 8),
        this.dataView.setUint8(this.position + 2, 255 & e),
        (this.position += 3));
    },
    pushUint32(e) {
      (this.assertPosition(this.position + 3),
        this.dataView.setUint32(this.position, e),
        (this.position += 4));
    },
    readByte() {
      (this.assertReadLimit(), this._touch());
      let e = this.inspectByte();
      return (this.position++, e);
    },
    readBytes(e, t) {
      (this.assertReadLimit(), this._touch());
      let i = this.inspectBytes(e);
      return ((this.position += t ?? e), i);
    },
    readUint8() {
      (this.assertReadLimit(), this._touch());
      let e = this.inspectUint8();
      return ((this.position += 1), e);
    },
    readUint16() {
      (this.assertReadLimit(), this._touch());
      let e = this.inspectUint16();
      return ((this.position += 2), e);
    },
    readUint24() {
      (this.assertReadLimit(), this._touch());
      let e = this.inspectUint24();
      return ((this.position += 3), e);
    },
    readUint32() {
      (this.assertReadLimit(), this._touch());
      let e = this.inspectUint32();
      return ((this.position += 4), e);
    },
    get remaining() {
      return this.bytes.length - this.position;
    },
    setPosition(e) {
      let t = this.position;
      return (
        this.assertPosition(e),
        (this.position = e),
        () => (this.position = t)
      );
    },
    _touch() {
      if (1 / 0 === this.recursiveReadLimit) return;
      let e = this.getReadCount();
      (this.positionReadCount.set(this.position, e + 1),
        e > 0 && this.recursiveReadCount++);
    },
  };
  e.s(
    [
      "f",
      0,
      function (e, { recursiveReadLimit: t = 8192 } = {}) {
        let i = Object.create(n);
        return (
          (i.bytes = e),
          (i.dataView = new DataView(
            e.buffer ?? e,
            e.byteOffset,
            e.byteLength,
          )),
          (i.positionReadCount = new Map()),
          (i.recursiveReadLimit = t),
          i
        );
      },
    ],
    811369,
  );
};
