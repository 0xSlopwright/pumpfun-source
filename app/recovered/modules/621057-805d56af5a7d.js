// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n =
    (e.e && e.e.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.sendGAEvent =
      r.GoogleAnalytics =
      r.sendGTMEvent =
      r.GoogleTagManager =
      r.YouTubeEmbed =
      r.GoogleMapsEmbed =
        void 0));
  var i = e.r(144473);
  Object.defineProperty(r, "GoogleMapsEmbed", {
    enumerable: !0,
    get: function () {
      return n(i).default;
    },
  });
  var s = e.r(848388);
  Object.defineProperty(r, "YouTubeEmbed", {
    enumerable: !0,
    get: function () {
      return n(s).default;
    },
  });
  var o = e.r(831856);
  (Object.defineProperty(r, "GoogleTagManager", {
    enumerable: !0,
    get: function () {
      return o.GoogleTagManager;
    },
  }),
    Object.defineProperty(r, "sendGTMEvent", {
      enumerable: !0,
      get: function () {
        return o.sendGTMEvent;
      },
    }));
  var a = e.r(130256);
  (Object.defineProperty(r, "GoogleAnalytics", {
    enumerable: !0,
    get: function () {
      return a.GoogleAnalytics;
    },
  }),
    Object.defineProperty(r, "sendGAEvent", {
      enumerable: !0,
      get: function () {
        return a.sendGAEvent;
      },
    }));
};
