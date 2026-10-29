// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(645912);
  e.s([
    "f",
    0,
    function () {
      let e = "",
        n = 0;
      return {
        isAsync: !1,
        get isEmpty() {
          return !e;
        },
        write(r, o) {
          let i = (0, t.C)(r);
          ((n += i), (e += r), o && o(i));
        },
        finish(e) {
          e(this.finishSync());
        },
        finishSync() {
          let t = {
            output: e,
            outputBytesCount: n,
            rawBytesCount: n,
            pendingData: "",
          };
          return ((e = ""), (n = 0), t);
        },
        estimateEncodedBytesCount: (e) => e.length,
      };
    },
  ]);
};
