// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  function e(t) {
    this._context = t;
  }
  ((e.prototype = {
    areaStart: function () {
      this._line = 0;
    },
    areaEnd: function () {
      this._line = 0 / 0;
    },
    lineStart: function () {
      this._point = 0;
    },
    lineEnd: function () {
      ((this._line || (0 !== this._line && 1 === this._point)) &&
        this._context.closePath(),
        (this._line = 1 - this._line));
    },
    point: function (t, e) {
      switch (((t *= 1), (e *= 1), this._point)) {
        case 0:
          ((this._point = 1),
            this._line
              ? this._context.lineTo(t, e)
              : this._context.moveTo(t, e));
          break;
        case 1:
          this._point = 2;
        default:
          this._context.lineTo(t, e);
      }
    },
  }),
    t.s([
      "f",
      0,
      function (t) {
        return new e(t);
      },
    ]));
};
