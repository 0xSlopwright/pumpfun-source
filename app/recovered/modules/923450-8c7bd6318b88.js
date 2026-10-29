// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  Object.defineProperty(n, "__esModule", { value: !0 });
  var r = {
    cancelIdleCallback: function () {
      return o;
    },
    requestIdleCallback: function () {
      return a;
    },
  };
  for (var i in r) Object.defineProperty(n, i, { enumerable: !0, get: r[i] });
  let a =
      ("u" > typeof self &&
        self.requestIdleCallback &&
        self.requestIdleCallback.bind(window)) ||
      function (e) {
        let t = Date.now();
        return self.setTimeout(function () {
          e({
            didTimeout: !1,
            timeRemaining: function () {
              return Math.max(0, 50 - (Date.now() - t));
            },
          });
        }, 1);
      },
    o =
      ("u" > typeof self &&
        self.cancelIdleCallback &&
        self.cancelIdleCallback.bind(window)) ||
      function (e) {
        return clearTimeout(e);
      };
  ("function" == typeof n.default ||
    ("object" == typeof n.default && null !== n.default)) &&
    void 0 === n.default.__esModule &&
    (Object.defineProperty(n.default, "__esModule", { value: !0 }),
    Object.assign(n.default, n),
    (t.exports = n.default));
};
