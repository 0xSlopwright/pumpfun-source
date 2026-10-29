// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, i) => {
  Object.defineProperty(i, "__esModule", { value: !0 });
  var n = e.r(352386),
    r = n && "object" == typeof n && "default" in n ? n.default : n,
    o = e.r(123382),
    a = new o(),
    s = a.getBrowser(),
    l = a.getCPU(),
    c = a.getDevice(),
    d = a.getEngine(),
    u = a.getOS(),
    h = a.getUA(),
    w = function (e) {
      return a.setUA(e);
    },
    m = function (e) {
      if (!e) return void console.error("No userAgent string was provided");
      var t = new o(e);
      return {
        UA: t,
        browser: t.getBrowser(),
        cpu: t.getCPU(),
        device: t.getDevice(),
        engine: t.getEngine(),
        os: t.getOS(),
        ua: t.getUA(),
        setUserAgent: function (e) {
          return t.setUA(e);
        },
      };
    },
    p = Object.freeze({
      ClientUAInstance: a,
      browser: s,
      cpu: l,
      device: c,
      engine: d,
      os: u,
      ua: h,
      setUa: w,
      parseUserAgent: m,
    });
  function b(e, t) {
    var i = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(e);
      (t &&
        (n = n.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        i.push.apply(i, n));
    }
    return i;
  }
  function f(e) {
    return (f =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function g() {
    return (g =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var i = arguments[t];
          for (var n in i)
            Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n]);
        }
        return e;
      }).apply(this, arguments);
  }
  function v(e) {
    return (v = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (e) {
          return e.__proto__ || Object.getPrototypeOf(e);
        })(e);
  }
  function y(e, t) {
    return (y =
      Object.setPrototypeOf ||
      function (e, t) {
        return ((e.__proto__ = t), e);
      })(e, t);
  }
  function C(e, t) {
    if (null == e) return {};
    var i,
      n,
      r = (function (e, t) {
        if (null == e) return {};
        var i,
          n,
          r = {},
          o = Object.keys(e);
        for (n = 0; n < o.length; n++)
          ((i = o[n]), t.indexOf(i) >= 0 || (r[i] = e[i]));
        return r;
      })(e, t);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      for (n = 0; n < o.length; n++)
        ((i = o[n]),
          !(t.indexOf(i) >= 0) &&
            Object.prototype.propertyIsEnumerable.call(e, i) &&
            (r[i] = e[i]));
    }
    return r;
  }
  function A(e) {
    if (void 0 === e)
      throw ReferenceError(
        "this hasn't been initialised - super() hasn't been called",
      );
    return e;
  }
  function x(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var i = 0, n = Array(t); i < t; i++) n[i] = e[i];
    return n;
  }
  var k = "mobile",
    E = "tablet",
    T = "smarttv",
    O = "console",
    P = "wearable",
    S = "embedded",
    j = void 0,
    _ = {
      Chrome: "Chrome",
      Firefox: "Firefox",
      Opera: "Opera",
      Yandex: "Yandex",
      Safari: "Safari",
      InternetExplorer: "Internet Explorer",
      Edge: "Edge",
      Chromium: "Chromium",
      Ie: "IE",
      MobileSafari: "Mobile Safari",
      EdgeChromium: "Edge Chromium",
      MIUI: "MIUI Browser",
      SamsungBrowser: "Samsung Browser",
    },
    I = {
      IOS: "iOS",
      Android: "Android",
      WindowsPhone: "Windows Phone",
      Windows: "Windows",
      MAC_OS: "Mac OS",
    },
    N = {
      isMobile: !1,
      isTablet: !1,
      isBrowser: !1,
      isSmartTV: !1,
      isConsole: !1,
      isWearable: !1,
    },
    z = function (e) {
      switch (e) {
        case k:
          return { isMobile: !0 };
        case E:
          return { isTablet: !0 };
        case T:
          return { isSmartTV: !0 };
        case O:
          return { isConsole: !0 };
        case P:
          return { isWearable: !0 };
        case j:
          return { isBrowser: !0 };
        case S:
          return { isEmbedded: !0 };
        default:
          return N;
      }
    },
    M = function (e) {
      var t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "none";
      return e || t;
    },
    W = function () {
      return "u" > typeof window && (window.navigator || navigator);
    },
    L = function (e) {
      var t = W();
      return (
        t &&
        t.platform &&
        (-1 !== t.platform.indexOf(e) ||
          ("MacIntel" === t.platform &&
            t.maxTouchPoints > 1 &&
            !window.MSStream))
      );
    },
    U = function (e) {
      return e.type === k;
    },
    R = function (e) {
      return e.type === E;
    },
    F = function (e) {
      var t = e.type;
      return t === k || t === E;
    },
    D = function (e) {
      return e.type === T;
    },
    V = function (e) {
      return e.type === j;
    },
    B = function (e) {
      return e.type === P;
    },
    q = function (e) {
      return e.type === O;
    },
    G = function (e) {
      return e.type === S;
    },
    Y = function (e) {
      return M(e.vendor);
    },
    X = function (e) {
      return M(e.model);
    },
    J = function (e) {
      return M(e.type, "browser");
    },
    Z = function (e) {
      return e.name === I.Android;
    },
    H = function (e) {
      return e.name === I.Windows;
    },
    $ = function (e) {
      return e.name === I.MAC_OS;
    },
    Q = function (e) {
      return e.name === I.WindowsPhone;
    },
    K = function (e) {
      return e.name === I.IOS;
    },
    ee = function (e) {
      return M(e.version);
    },
    et = function (e) {
      return M(e.name);
    },
    ei = function (e) {
      return e.name === _.Chrome;
    },
    en = function (e) {
      return e.name === _.Firefox;
    },
    er = function (e) {
      return e.name === _.Chromium;
    },
    eo = function (e) {
      return e.name === _.Edge;
    },
    ea = function (e) {
      return e.name === _.Yandex;
    },
    es = function (e) {
      var t = e.name;
      return t === _.Safari || t === _.MobileSafari;
    },
    el = function (e) {
      return e.name === _.MobileSafari;
    },
    ec = function (e) {
      return e.name === _.Opera;
    },
    ed = function (e) {
      var t = e.name;
      return t === _.InternetExplorer || t === _.Ie;
    },
    eu = function (e) {
      return e.name === _.MIUI;
    },
    eh = function (e) {
      return e.name === _.SamsungBrowser;
    },
    ew = function (e) {
      return M(e.version);
    },
    em = function (e) {
      return M(e.major);
    },
    ep = function (e) {
      return M(e.name);
    },
    eb = function (e) {
      return M(e.name);
    },
    ef = function (e) {
      return M(e.version);
    },
    eg = function () {
      var e = W(),
        t = e && e.userAgent && e.userAgent.toLowerCase();
      return "string" == typeof t && /electron/.test(t);
    },
    ev = function (e) {
      return "string" == typeof e && -1 !== e.indexOf("Edg/");
    },
    ey = function () {
      var e = W();
      return (
        e &&
        (/iPad|iPhone|iPod/.test(e.platform) ||
          ("MacIntel" === e.platform && e.maxTouchPoints > 1)) &&
        !window.MSStream
      );
    },
    eC = function () {
      return L("iPad");
    },
    eA = function () {
      return L("iPhone");
    },
    ex = function () {
      return L("iPod");
    },
    ek = function (e) {
      return M(e);
    };
  function eE(e) {
    var t = e || p,
      i = t.device,
      n = t.browser,
      r = t.os,
      o = t.engine,
      a = t.ua;
    return {
      isSmartTV: D(i),
      isConsole: q(i),
      isWearable: B(i),
      isEmbedded: G(i),
      isMobileSafari: el(n) || eC(),
      isChromium: er(n),
      isMobile: F(i) || eC(),
      isMobileOnly: U(i),
      isTablet: R(i) || eC(),
      isBrowser: V(i),
      isDesktop: V(i),
      isAndroid: Z(r),
      isWinPhone: Q(r),
      isIOS: K(r) || eC(),
      isChrome: ei(n),
      isFirefox: en(n),
      isSafari: es(n),
      isOpera: ec(n),
      isIE: ed(n),
      osVersion: ee(r),
      osName: et(r),
      fullBrowserVersion: ew(n),
      browserVersion: em(n),
      browserName: ep(n),
      mobileVendor: Y(i),
      mobileModel: X(i),
      engineName: eb(o),
      engineVersion: ef(o),
      getUA: ek(a),
      isEdge: eo(n) || ev(a),
      isYandex: ea(n),
      deviceType: J(i),
      isIOS13: ey(),
      isIPad13: eC(),
      isIPhone13: eA(),
      isIPod13: ex(),
      isElectron: eg(),
      isEdgeChromium: ev(a),
      isLegacyEdge: eo(n) && !ev(a),
      isWindows: H(r),
      isMacOs: $(r),
      isMIUI: eu(n),
      isSamsungBrowser: eh(n),
    };
  }
  var eT = D(c),
    eO = q(c),
    eP = B(c),
    eS = G(c),
    ej = el(s) || eC(),
    e_ = er(s),
    eI = F(c) || eC(),
    eN = U(c),
    ez = R(c) || eC(),
    eM = V(c),
    eW = V(c),
    eL = Z(u),
    eU = Q(u),
    eR = K(u) || eC(),
    eF = ei(s),
    eD = en(s),
    eV = es(s),
    eB = ec(s),
    eq = ed(s),
    eG = ee(u),
    eY = et(u),
    eX = ew(s),
    eJ = em(s),
    eZ = ep(s),
    eH = Y(c),
    e$ = X(c),
    eQ = eb(d),
    eK = ef(d),
    e1 = ek(h),
    e0 = eo(s) || ev(h),
    e2 = ea(s),
    e3 = J(c),
    e6 = ey(),
    e4 = eC(),
    e8 = eA(),
    e5 = ex(),
    e9 = eg(),
    e7 = ev(h),
    te = eo(s) && !ev(h),
    tt = H(u),
    ti = $(u),
    tn = eu(s),
    tr = eh(s);
  function to(e) {
    return m(e || window.navigator.userAgent);
  }
  ((i.AndroidView = function (e) {
    var t = e.renderWithFragment,
      i = e.children,
      o = C(e, ["renderWithFragment", "children"]);
    return eL
      ? t
        ? r.createElement(n.Fragment, null, i)
        : r.createElement("div", o, i)
      : null;
  }),
    (i.BrowserTypes = _),
    (i.BrowserView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        o = C(e, ["renderWithFragment", "children"]);
      return eM
        ? t
          ? r.createElement(n.Fragment, null, i)
          : r.createElement("div", o, i)
        : null;
    }),
    (i.ConsoleView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        o = C(e, ["renderWithFragment", "children"]);
      return eO
        ? t
          ? r.createElement(n.Fragment, null, i)
          : r.createElement("div", o, i)
        : null;
    }),
    (i.CustomView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        o = (e.viewClassName, e.style, e.condition),
        a = C(e, [
          "renderWithFragment",
          "children",
          "viewClassName",
          "style",
          "condition",
        ]);
      return o
        ? t
          ? r.createElement(n.Fragment, null, i)
          : r.createElement("div", a, i)
        : null;
    }),
    (i.IEView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        o = C(e, ["renderWithFragment", "children"]);
      return eq
        ? t
          ? r.createElement(n.Fragment, null, i)
          : r.createElement("div", o, i)
        : null;
    }),
    (i.IOSView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        o = C(e, ["renderWithFragment", "children"]);
      return eR
        ? t
          ? r.createElement(n.Fragment, null, i)
          : r.createElement("div", o, i)
        : null;
    }),
    (i.MobileOnlyView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        o =
          (e.viewClassName,
          e.style,
          C(e, ["renderWithFragment", "children", "viewClassName", "style"]));
      return eN
        ? t
          ? r.createElement(n.Fragment, null, i)
          : r.createElement("div", o, i)
        : null;
    }),
    (i.MobileView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        o = C(e, ["renderWithFragment", "children"]);
      return eI
        ? t
          ? r.createElement(n.Fragment, null, i)
          : r.createElement("div", o, i)
        : null;
    }),
    (i.OsTypes = I),
    (i.SmartTVView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        o = C(e, ["renderWithFragment", "children"]);
      return eT
        ? t
          ? r.createElement(n.Fragment, null, i)
          : r.createElement("div", o, i)
        : null;
    }),
    (i.TabletView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        o = C(e, ["renderWithFragment", "children"]);
      return ez
        ? t
          ? r.createElement(n.Fragment, null, i)
          : r.createElement("div", o, i)
        : null;
    }),
    (i.WearableView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        o = C(e, ["renderWithFragment", "children"]);
      return eP
        ? t
          ? r.createElement(n.Fragment, null, i)
          : r.createElement("div", o, i)
        : null;
    }),
    (i.WinPhoneView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        o = C(e, ["renderWithFragment", "children"]);
      return eU
        ? t
          ? r.createElement(n.Fragment, null, i)
          : r.createElement("div", o, i)
        : null;
    }),
    (i.browserName = eZ),
    (i.browserVersion = eJ),
    (i.deviceDetect = function (e) {
      var t,
        i,
        n,
        r,
        o = e ? m(e) : p,
        a = o.device,
        s = o.browser,
        l = o.engine,
        c = o.os,
        d = o.ua,
        u = z(a.type),
        h = u.isBrowser,
        w = u.isMobile,
        f = u.isTablet,
        g = u.isSmartTV,
        v = u.isConsole,
        y = u.isWearable,
        C = u.isEmbedded;
      if (h)
        return {
          isBrowser: h,
          browserMajorVersion: M(s.major),
          browserFullVersion: M(s.version),
          browserName: M(s.name),
          engineName: M(l.name),
          engineVersion: M(l.version),
          osName: M(c.name),
          osVersion: M(c.version),
          userAgent: M(d),
        };
      if (g)
        return {
          isSmartTV: g,
          engineName: M(l.name),
          engineVersion: M(l.version),
          osName: M(c.name),
          osVersion: M(c.version),
          userAgent: M(d),
        };
      if (v)
        return {
          isConsole: v,
          engineName: M(l.name),
          engineVersion: M(l.version),
          osName: M(c.name),
          osVersion: M(c.version),
          userAgent: M(d),
        };
      if (w || f) {
        return (
          (t = u),
          (i = a),
          (n = c),
          (r = d),
          (function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var i = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? b(Object(i), !0).forEach(function (t) {
                    var n, r, o;
                    ((n = e),
                      (r = t),
                      (o = i[t]),
                      r in n
                        ? Object.defineProperty(n, r, {
                            value: o,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                          })
                        : (n[r] = o));
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                      e,
                      Object.getOwnPropertyDescriptors(i),
                    )
                  : b(Object(i)).forEach(function (t) {
                      Object.defineProperty(
                        e,
                        t,
                        Object.getOwnPropertyDescriptor(i, t),
                      );
                    });
            }
            return e;
          })({}, t, {
            vendor: M(i.vendor),
            model: M(i.model),
            os: M(n.name),
            osVersion: M(n.version),
            ua: M(r),
          })
        );
      }
      return y
        ? {
            isWearable: y,
            engineName: M(l.name),
            engineVersion: M(l.version),
            osName: M(c.name),
            osVersion: M(c.version),
            userAgent: M(d),
          }
        : C
          ? {
              isEmbedded: C,
              vendor: M(a.vendor),
              model: M(a.model),
              engineName: M(l.name),
              engineVersion: M(l.version),
              osName: M(c.name),
              osVersion: M(c.version),
              userAgent: M(d),
            }
          : void 0;
    }),
    (i.deviceType = e3),
    (i.engineName = eQ),
    (i.engineVersion = eK),
    (i.fullBrowserVersion = eX),
    (i.getSelectorsByUserAgent = function (e) {
      if (!e || "string" != typeof e)
        return void console.error("No valid user agent string was provided");
      var t = m(e);
      return eE({
        device: t.device,
        browser: t.browser,
        os: t.os,
        engine: t.engine,
        ua: t.ua,
      });
    }),
    (i.getUA = e1),
    (i.isAndroid = eL),
    (i.isBrowser = eM),
    (i.isChrome = eF),
    (i.isChromium = e_),
    (i.isConsole = eO),
    (i.isDesktop = eW),
    (i.isEdge = e0),
    (i.isEdgeChromium = e7),
    (i.isElectron = e9),
    (i.isEmbedded = eS),
    (i.isFirefox = eD),
    (i.isIE = eq),
    (i.isIOS = eR),
    (i.isIOS13 = e6),
    (i.isIPad13 = e4),
    (i.isIPhone13 = e8),
    (i.isIPod13 = e5),
    (i.isLegacyEdge = te),
    (i.isMIUI = tn),
    (i.isMacOs = ti),
    (i.isMobile = eI),
    (i.isMobileOnly = eN),
    (i.isMobileSafari = ej),
    (i.isOpera = eB),
    (i.isSafari = eV),
    (i.isSamsungBrowser = tr),
    (i.isSmartTV = eT),
    (i.isTablet = ez),
    (i.isWearable = eP),
    (i.isWinPhone = eU),
    (i.isWindows = tt),
    (i.isYandex = e2),
    (i.mobileModel = e$),
    (i.mobileVendor = eH),
    (i.osName = eY),
    (i.osVersion = eG),
    (i.parseUserAgent = m),
    (i.setUserAgent = function (e) {
      return w(e);
    }),
    (i.useDeviceData = to),
    (i.useDeviceSelectors = function (e) {
      var t = to(e || window.navigator.userAgent);
      return [eE(t), t];
    }),
    (i.useMobileOrientation = function () {
      var e,
        t =
          (function (e) {
            if (Array.isArray(e)) return e;
          })(
            (e = n.useState(function () {
              var e = 90 * (window.innerWidth > window.innerHeight);
              return {
                isPortrait: 0 === e,
                isLandscape: 90 === e,
                orientation: 0 === e ? "portrait" : "landscape",
              };
            })),
          ) ||
          (function (e) {
            var t,
              i,
              n =
                null == e
                  ? null
                  : ("u" > typeof Symbol && e[Symbol.iterator]) ||
                    e["@@iterator"];
            if (null != n) {
              var r = [],
                o = !0,
                a = !1;
              try {
                for (
                  n = n.call(e);
                  !(o = (t = n.next()).done) &&
                  (r.push(t.value), 2 !== r.length);
                  o = !0
                );
              } catch (e) {
                ((a = !0), (i = e));
              } finally {
                try {
                  o || null == n.return || n.return();
                } finally {
                  if (a) throw i;
                }
              }
              return r;
            }
          })(e) ||
          (function (e) {
            if (e) {
              if ("string" == typeof e) return x(e, 2);
              var t = Object.prototype.toString.call(e).slice(8, -1);
              if (
                ("Object" === t && e.constructor && (t = e.constructor.name),
                "Map" === t || "Set" === t)
              )
                return Array.from(e);
              if (
                "Arguments" === t ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
              )
                return x(e, 2);
            }
          })(e) ||
          (function () {
            throw TypeError(
              "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
            );
          })(),
        i = t[0],
        r = t[1],
        o = n.useCallback(
          function () {
            var e = 90 * (window.innerWidth > window.innerHeight),
              t = {
                isPortrait: 0 === e,
                isLandscape: 90 === e,
                orientation: 0 === e ? "portrait" : "landscape",
              };
            i.orientation !== t.orientation && r(t);
          },
          [i.orientation],
        );
      return (
        n.useEffect(
          function () {
            return (
              ("u" < typeof window ? "undefined" : f(window)) !== void 0 &&
                eI &&
                (o(),
                window.addEventListener("load", o, !1),
                window.addEventListener("resize", o, !1)),
              function () {
                (window.removeEventListener("resize", o, !1),
                  window.removeEventListener("load", o, !1));
              }
            );
          },
          [o],
        ),
        i
      );
    }),
    (i.withOrientationChange = function (e) {
      return (function (t) {
        var i;
        if ("function" != typeof t && null !== t)
          throw TypeError("Super expression must either be null or a function");
        function n(e) {
          var t;
          if (!(this instanceof n))
            throw TypeError("Cannot call a class as a function");
          return (
            ((t = (function (e, t) {
              if (t && ("object" == typeof t || "function" == typeof t))
                return t;
              if (void 0 !== t)
                throw TypeError(
                  "Derived constructors may only return object or undefined",
                );
              return A(e);
            })(this, v(n).call(this, e))).isEventListenerAdded = !1),
            (t.handleOrientationChange = t.handleOrientationChange.bind(A(t))),
            (t.onOrientationChange = t.onOrientationChange.bind(A(t))),
            (t.onPageLoad = t.onPageLoad.bind(A(t))),
            (t.state = { isLandscape: !1, isPortrait: !1 }),
            t
          );
        }
        return (
          (n.prototype = Object.create(t && t.prototype, {
            constructor: { value: n, writable: !0, configurable: !0 },
          })),
          t && y(n, t),
          (i = [
            {
              key: "handleOrientationChange",
              value: function () {
                this.isEventListenerAdded || (this.isEventListenerAdded = !0);
                var e = 90 * (window.innerWidth > window.innerHeight);
                this.setState({ isPortrait: 0 === e, isLandscape: 90 === e });
              },
            },
            {
              key: "onOrientationChange",
              value: function () {
                this.handleOrientationChange();
              },
            },
            {
              key: "onPageLoad",
              value: function () {
                this.handleOrientationChange();
              },
            },
            {
              key: "componentDidMount",
              value: function () {
                ("u" < typeof window ? "undefined" : f(window)) !== void 0 &&
                  eI &&
                  (this.isEventListenerAdded
                    ? window.removeEventListener("load", this.onPageLoad, !1)
                    : (this.handleOrientationChange(),
                      window.addEventListener("load", this.onPageLoad, !1)),
                  window.addEventListener(
                    "resize",
                    this.onOrientationChange,
                    !1,
                  ));
              },
            },
            {
              key: "componentWillUnmount",
              value: function () {
                window.removeEventListener(
                  "resize",
                  this.onOrientationChange,
                  !1,
                );
              },
            },
            {
              key: "render",
              value: function () {
                return r.createElement(
                  e,
                  g({}, this.props, {
                    isLandscape: this.state.isLandscape,
                    isPortrait: this.state.isPortrait,
                  }),
                );
              },
            },
          ]),
          (function (e, t) {
            for (var i = 0; i < t.length; i++) {
              var n = t[i];
              ((n.enumerable = n.enumerable || !1),
                (n.configurable = !0),
                "value" in n && (n.writable = !0),
                Object.defineProperty(e, n.key, n));
            }
          })(n.prototype, i),
          n
        );
      })(r.Component);
    }));
};
