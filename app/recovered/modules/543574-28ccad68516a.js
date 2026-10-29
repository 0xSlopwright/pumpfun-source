// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(645912);
  e.s([
    "f",
    0,
    function () {
      let e = "",
        r = 0;
      return {
        isAsync: !1,
        get isEmpty() {
          return !e;
        },
        write(n, i) {
          let o = (0, t.C)(n);
          ((r += o), (e += n), i && i(o));
        },
        finish(e) {
          e(this.finishSync());
        },
        finishSync() {
          let t = {
            output: e,
            outputBytesCount: r,
            rawBytesCount: r,
            pendingData: "",
          };
          return ((e = ""), (r = 0), t);
        },
        estimateEncodedBytesCount: (e) => e.length,
      };
    },
  ]);
};
