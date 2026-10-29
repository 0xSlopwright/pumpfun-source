// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, i) => {
  Object.defineProperty(i, "__esModule", { value: !0 });
  var r = e.r(352386),
    n = r && "object" == typeof r && "default" in r ? r.default : r,
    a = e.r(123382),
    o = new a(),
    s = o.getBrowser(),
    l = o.getCPU(),
    d = o.getDevice(),
    c = o.getEngine(),
    u = o.getOS(),
    m = o.getUA(),
    f = function (e) {
      return o.setUA(e);
    },
    b = function (e) {
      if (!e) return void console.error("No userAgent string was provided");
      var t = new a(e);
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
      ClientUAInstance: o,
      browser: s,
      cpu: l,
      device: d,
      engine: c,
      os: u,
      ua: m,
      setUa: f,
      parseUserAgent: b,
    });
  function h(e, t) {
    var i = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      (t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        i.push.apply(i, r));
    }
    return i;
  }
  function w(e) {
    return (w =
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
  function v() {
    return (v =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var i = arguments[t];
          for (var r in i)
            Object.prototype.hasOwnProperty.call(i, r) && (e[r] = i[r]);
        }
        return e;
      }).apply(this, arguments);
  }
  function g(e) {
    return (g = Object.setPrototypeOf
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
  function x(e, t) {
    if (null == e) return {};
    var i,
      r,
      n = (function (e, t) {
        if (null == e) return {};
        var i,
          r,
          n = {},
          a = Object.keys(e);
        for (r = 0; r < a.length; r++)
          ((i = a[r]), t.indexOf(i) >= 0 || (n[i] = e[i]));
        return n;
      })(e, t);
    if (Object.getOwnPropertySymbols) {
      var a = Object.getOwnPropertySymbols(e);
      for (r = 0; r < a.length; r++)
        ((i = a[r]),
          !(t.indexOf(i) >= 0) &&
            Object.prototype.propertyIsEnumerable.call(e, i) &&
            (n[i] = e[i]));
    }
    return n;
  }
  function k(e) {
    if (void 0 === e)
      throw ReferenceError(
        "this hasn't been initialised - super() hasn't been called",
      );
    return e;
  }
  function C(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var i = 0, r = Array(t); i < t; i++) r[i] = e[i];
    return r;
  }
  var S = "mobile",
    N = "tablet",
    _ = "smarttv",
    j = "console",
    P = "wearable",
    E = "embedded",
    O = void 0,
    T = {
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
    M = {
      IOS: "iOS",
      Android: "Android",
      WindowsPhone: "Windows Phone",
      Windows: "Windows",
      MAC_OS: "Mac OS",
    },
    A = {
      isMobile: !1,
      isTablet: !1,
      isBrowser: !1,
      isSmartTV: !1,
      isConsole: !1,
      isWearable: !1,
    },
    F = function (e) {
      switch (e) {
        case S:
          return { isMobile: !0 };
        case N:
          return { isTablet: !0 };
        case _:
          return { isSmartTV: !0 };
        case j:
          return { isConsole: !0 };
        case P:
          return { isWearable: !0 };
        case O:
          return { isBrowser: !0 };
        case E:
          return { isEmbedded: !0 };
        default:
          return A;
      }
    },
    I = function (e) {
      var t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "none";
      return e || t;
    },
    R = function () {
      return "u" > typeof window && (window.navigator || navigator);
    },
    W = function (e) {
      var t = R();
      return (
        t &&
        t.platform &&
        (-1 !== t.platform.indexOf(e) ||
          ("MacIntel" === t.platform &&
            t.maxTouchPoints > 1 &&
            !window.MSStream))
      );
    },
    V = function (e) {
      return e.type === S;
    },
    L = function (e) {
      return e.type === N;
    },
    U = function (e) {
      var t = e.type;
      return t === S || t === N;
    },
    D = function (e) {
      return e.type === _;
    },
    z = function (e) {
      return e.type === O;
    },
    B = function (e) {
      return e.type === P;
    },
    q = function (e) {
      return e.type === j;
    },
    H = function (e) {
      return e.type === E;
    },
    $ = function (e) {
      return I(e.vendor);
    },
    K = function (e) {
      return I(e.model);
    },
    G = function (e) {
      return I(e.type, "browser");
    },
    Y = function (e) {
      return e.name === M.Android;
    },
    Q = function (e) {
      return e.name === M.Windows;
    },
    Z = function (e) {
      return e.name === M.MAC_OS;
    },
    X = function (e) {
      return e.name === M.WindowsPhone;
    },
    J = function (e) {
      return e.name === M.IOS;
    },
    ee = function (e) {
      return I(e.version);
    },
    et = function (e) {
      return I(e.name);
    },
    ei = function (e) {
      return e.name === T.Chrome;
    },
    er = function (e) {
      return e.name === T.Firefox;
    },
    en = function (e) {
      return e.name === T.Chromium;
    },
    ea = function (e) {
      return e.name === T.Edge;
    },
    eo = function (e) {
      return e.name === T.Yandex;
    },
    es = function (e) {
      var t = e.name;
      return t === T.Safari || t === T.MobileSafari;
    },
    el = function (e) {
      return e.name === T.MobileSafari;
    },
    ed = function (e) {
      return e.name === T.Opera;
    },
    ec = function (e) {
      var t = e.name;
      return t === T.InternetExplorer || t === T.Ie;
    },
    eu = function (e) {
      return e.name === T.MIUI;
    },
    em = function (e) {
      return e.name === T.SamsungBrowser;
    },
    ef = function (e) {
      return I(e.version);
    },
    eb = function (e) {
      return I(e.major);
    },
    ep = function (e) {
      return I(e.name);
    },
    eh = function (e) {
      return I(e.name);
    },
    ew = function (e) {
      return I(e.version);
    },
    ev = function () {
      var e = R(),
        t = e && e.userAgent && e.userAgent.toLowerCase();
      return "string" == typeof t && /electron/.test(t);
    },
    eg = function (e) {
      return "string" == typeof e && -1 !== e.indexOf("Edg/");
    },
    ey = function () {
      var e = R();
      return (
        e &&
        (/iPad|iPhone|iPod/.test(e.platform) ||
          ("MacIntel" === e.platform && e.maxTouchPoints > 1)) &&
        !window.MSStream
      );
    },
    ex = function () {
      return W("iPad");
    },
    ek = function () {
      return W("iPhone");
    },
    eC = function () {
      return W("iPod");
    },
    eS = function (e) {
      return I(e);
    };
  function eN(e) {
    var t = e || p,
      i = t.device,
      r = t.browser,
      n = t.os,
      a = t.engine,
      o = t.ua;
    return {
      isSmartTV: D(i),
      isConsole: q(i),
      isWearable: B(i),
      isEmbedded: H(i),
      isMobileSafari: el(r) || ex(),
      isChromium: en(r),
      isMobile: U(i) || ex(),
      isMobileOnly: V(i),
      isTablet: L(i) || ex(),
      isBrowser: z(i),
      isDesktop: z(i),
      isAndroid: Y(n),
      isWinPhone: X(n),
      isIOS: J(n) || ex(),
      isChrome: ei(r),
      isFirefox: er(r),
      isSafari: es(r),
      isOpera: ed(r),
      isIE: ec(r),
      osVersion: ee(n),
      osName: et(n),
      fullBrowserVersion: ef(r),
      browserVersion: eb(r),
      browserName: ep(r),
      mobileVendor: $(i),
      mobileModel: K(i),
      engineName: eh(a),
      engineVersion: ew(a),
      getUA: eS(o),
      isEdge: ea(r) || eg(o),
      isYandex: eo(r),
      deviceType: G(i),
      isIOS13: ey(),
      isIPad13: ex(),
      isIPhone13: ek(),
      isIPod13: eC(),
      isElectron: ev(),
      isEdgeChromium: eg(o),
      isLegacyEdge: ea(r) && !eg(o),
      isWindows: Q(n),
      isMacOs: Z(n),
      isMIUI: eu(r),
      isSamsungBrowser: em(r),
    };
  }
  var e_ = D(d),
    ej = q(d),
    eP = B(d),
    eE = H(d),
    eO = el(s) || ex(),
    eT = en(s),
    eM = U(d) || ex(),
    eA = V(d),
    eF = L(d) || ex(),
    eI = z(d),
    eR = z(d),
    eW = Y(u),
    eV = X(u),
    eL = J(u) || ex(),
    eU = ei(s),
    eD = er(s),
    ez = es(s),
    eB = ed(s),
    eq = ec(s),
    eH = ee(u),
    e$ = et(u),
    eK = ef(s),
    eG = eb(s),
    eY = ep(s),
    eQ = $(d),
    eZ = K(d),
    eX = eh(c),
    eJ = ew(c),
    e0 = eS(m),
    e1 = ea(s) || eg(m),
    e2 = eo(s),
    e3 = G(d),
    e4 = ey(),
    e6 = ex(),
    e5 = ek(),
    e8 = eC(),
    e9 = ev(),
    e7 = eg(m),
    te = ea(s) && !eg(m),
    tt = Q(u),
    ti = Z(u),
    tr = eu(s),
    tn = em(s);
  function ta(e) {
    return b(e || window.navigator.userAgent);
  }
  ((i.AndroidView = function (e) {
    var t = e.renderWithFragment,
      i = e.children,
      a = x(e, ["renderWithFragment", "children"]);
    return eW
      ? t
        ? n.createElement(r.Fragment, null, i)
        : n.createElement("div", a, i)
      : null;
  }),
    (i.BrowserTypes = T),
    (i.BrowserView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        a = x(e, ["renderWithFragment", "children"]);
      return eI
        ? t
          ? n.createElement(r.Fragment, null, i)
          : n.createElement("div", a, i)
        : null;
    }),
    (i.ConsoleView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        a = x(e, ["renderWithFragment", "children"]);
      return ej
        ? t
          ? n.createElement(r.Fragment, null, i)
          : n.createElement("div", a, i)
        : null;
    }),
    (i.CustomView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        a = (e.viewClassName, e.style, e.condition),
        o = x(e, [
          "renderWithFragment",
          "children",
          "viewClassName",
          "style",
          "condition",
        ]);
      return a
        ? t
          ? n.createElement(r.Fragment, null, i)
          : n.createElement("div", o, i)
        : null;
    }),
    (i.IEView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        a = x(e, ["renderWithFragment", "children"]);
      return eq
        ? t
          ? n.createElement(r.Fragment, null, i)
          : n.createElement("div", a, i)
        : null;
    }),
    (i.IOSView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        a = x(e, ["renderWithFragment", "children"]);
      return eL
        ? t
          ? n.createElement(r.Fragment, null, i)
          : n.createElement("div", a, i)
        : null;
    }),
    (i.MobileOnlyView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        a =
          (e.viewClassName,
          e.style,
          x(e, ["renderWithFragment", "children", "viewClassName", "style"]));
      return eA
        ? t
          ? n.createElement(r.Fragment, null, i)
          : n.createElement("div", a, i)
        : null;
    }),
    (i.MobileView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        a = x(e, ["renderWithFragment", "children"]);
      return eM
        ? t
          ? n.createElement(r.Fragment, null, i)
          : n.createElement("div", a, i)
        : null;
    }),
    (i.OsTypes = M),
    (i.SmartTVView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        a = x(e, ["renderWithFragment", "children"]);
      return e_
        ? t
          ? n.createElement(r.Fragment, null, i)
          : n.createElement("div", a, i)
        : null;
    }),
    (i.TabletView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        a = x(e, ["renderWithFragment", "children"]);
      return eF
        ? t
          ? n.createElement(r.Fragment, null, i)
          : n.createElement("div", a, i)
        : null;
    }),
    (i.WearableView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        a = x(e, ["renderWithFragment", "children"]);
      return eP
        ? t
          ? n.createElement(r.Fragment, null, i)
          : n.createElement("div", a, i)
        : null;
    }),
    (i.WinPhoneView = function (e) {
      var t = e.renderWithFragment,
        i = e.children,
        a = x(e, ["renderWithFragment", "children"]);
      return eV
        ? t
          ? n.createElement(r.Fragment, null, i)
          : n.createElement("div", a, i)
        : null;
    }),
    (i.browserName = eY),
    (i.browserVersion = eG),
    (i.deviceDetect = function (e) {
      var t,
        i,
        r,
        n,
        a = e ? b(e) : p,
        o = a.device,
        s = a.browser,
        l = a.engine,
        d = a.os,
        c = a.ua,
        u = F(o.type),
        m = u.isBrowser,
        f = u.isMobile,
        w = u.isTablet,
        v = u.isSmartTV,
        g = u.isConsole,
        y = u.isWearable,
        x = u.isEmbedded;
      if (m)
        return {
          isBrowser: m,
          browserMajorVersion: I(s.major),
          browserFullVersion: I(s.version),
          browserName: I(s.name),
          engineName: I(l.name),
          engineVersion: I(l.version),
          osName: I(d.name),
          osVersion: I(d.version),
          userAgent: I(c),
        };
      if (v)
        return {
          isSmartTV: v,
          engineName: I(l.name),
          engineVersion: I(l.version),
          osName: I(d.name),
          osVersion: I(d.version),
          userAgent: I(c),
        };
      if (g)
        return {
          isConsole: g,
          engineName: I(l.name),
          engineVersion: I(l.version),
          osName: I(d.name),
          osVersion: I(d.version),
          userAgent: I(c),
        };
      if (f || w) {
        return (
          (t = u),
          (i = o),
          (r = d),
          (n = c),
          (function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var i = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? h(Object(i), !0).forEach(function (t) {
                    var r, n, a;
                    ((r = e),
                      (n = t),
                      (a = i[t]),
                      n in r
                        ? Object.defineProperty(r, n, {
                            value: a,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                          })
                        : (r[n] = a));
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                      e,
                      Object.getOwnPropertyDescriptors(i),
                    )
                  : h(Object(i)).forEach(function (t) {
                      Object.defineProperty(
                        e,
                        t,
                        Object.getOwnPropertyDescriptor(i, t),
                      );
                    });
            }
            return e;
          })({}, t, {
            vendor: I(i.vendor),
            model: I(i.model),
            os: I(r.name),
            osVersion: I(r.version),
            ua: I(n),
          })
        );
      }
      return y
        ? {
            isWearable: y,
            engineName: I(l.name),
            engineVersion: I(l.version),
            osName: I(d.name),
            osVersion: I(d.version),
            userAgent: I(c),
          }
        : x
          ? {
              isEmbedded: x,
              vendor: I(o.vendor),
              model: I(o.model),
              engineName: I(l.name),
              engineVersion: I(l.version),
              osName: I(d.name),
              osVersion: I(d.version),
              userAgent: I(c),
            }
          : void 0;
    }),
    (i.deviceType = e3),
    (i.engineName = eX),
    (i.engineVersion = eJ),
    (i.fullBrowserVersion = eK),
    (i.getSelectorsByUserAgent = function (e) {
      if (!e || "string" != typeof e)
        return void console.error("No valid user agent string was provided");
      var t = b(e);
      return eN({
        device: t.device,
        browser: t.browser,
        os: t.os,
        engine: t.engine,
        ua: t.ua,
      });
    }),
    (i.getUA = e0),
    (i.isAndroid = eW),
    (i.isBrowser = eI),
    (i.isChrome = eU),
    (i.isChromium = eT),
    (i.isConsole = ej),
    (i.isDesktop = eR),
    (i.isEdge = e1),
    (i.isEdgeChromium = e7),
    (i.isElectron = e9),
    (i.isEmbedded = eE),
    (i.isFirefox = eD),
    (i.isIE = eq),
    (i.isIOS = eL),
    (i.isIOS13 = e4),
    (i.isIPad13 = e6),
    (i.isIPhone13 = e5),
    (i.isIPod13 = e8),
    (i.isLegacyEdge = te),
    (i.isMIUI = tr),
    (i.isMacOs = ti),
    (i.isMobile = eM),
    (i.isMobileOnly = eA),
    (i.isMobileSafari = eO),
    (i.isOpera = eB),
    (i.isSafari = ez),
    (i.isSamsungBrowser = tn),
    (i.isSmartTV = e_),
    (i.isTablet = eF),
    (i.isWearable = eP),
    (i.isWinPhone = eV),
    (i.isWindows = tt),
    (i.isYandex = e2),
    (i.mobileModel = eZ),
    (i.mobileVendor = eQ),
    (i.osName = e$),
    (i.osVersion = eH),
    (i.parseUserAgent = b),
    (i.setUserAgent = function (e) {
      return f(e);
    }),
    (i.useDeviceData = ta),
    (i.useDeviceSelectors = function (e) {
      var t = ta(e || window.navigator.userAgent);
      return [eN(t), t];
    }),
    (i.useMobileOrientation = function () {
      var e,
        t =
          (function (e) {
            if (Array.isArray(e)) return e;
          })(
            (e = r.useState(function () {
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
              r =
                null == e
                  ? null
                  : ("u" > typeof Symbol && e[Symbol.iterator]) ||
                    e["@@iterator"];
            if (null != r) {
              var n = [],
                a = !0,
                o = !1;
              try {
                for (
                  r = r.call(e);
                  !(a = (t = r.next()).done) &&
                  (n.push(t.value), 2 !== n.length);
                  a = !0
                );
              } catch (e) {
                ((o = !0), (i = e));
              } finally {
                try {
                  a || null == r.return || r.return();
                } finally {
                  if (o) throw i;
                }
              }
              return n;
            }
          })(e) ||
          (function (e) {
            if (e) {
              if ("string" == typeof e) return C(e, 2);
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
                return C(e, 2);
            }
          })(e) ||
          (function () {
            throw TypeError(
              "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
            );
          })(),
        i = t[0],
        n = t[1],
        a = r.useCallback(
          function () {
            var e = 90 * (window.innerWidth > window.innerHeight),
              t = {
                isPortrait: 0 === e,
                isLandscape: 90 === e,
                orientation: 0 === e ? "portrait" : "landscape",
              };
            i.orientation !== t.orientation && n(t);
          },
          [i.orientation],
        );
      return (
        r.useEffect(
          function () {
            return (
              ("u" < typeof window ? "undefined" : w(window)) !== void 0 &&
                eM &&
                (a(),
                window.addEventListener("load", a, !1),
                window.addEventListener("resize", a, !1)),
              function () {
                (window.removeEventListener("resize", a, !1),
                  window.removeEventListener("load", a, !1));
              }
            );
          },
          [a],
        ),
        i
      );
    }),
    (i.withOrientationChange = function (e) {
      return (function (t) {
        var i;
        if ("function" != typeof t && null !== t)
          throw TypeError("Super expression must either be null or a function");
        function r(e) {
          var t;
          if (!(this instanceof r))
            throw TypeError("Cannot call a class as a function");
          return (
            ((t = (function (e, t) {
              if (t && ("object" == typeof t || "function" == typeof t))
                return t;
              if (void 0 !== t)
                throw TypeError(
                  "Derived constructors may only return object or undefined",
                );
              return k(e);
            })(this, g(r).call(this, e))).isEventListenerAdded = !1),
            (t.handleOrientationChange = t.handleOrientationChange.bind(k(t))),
            (t.onOrientationChange = t.onOrientationChange.bind(k(t))),
            (t.onPageLoad = t.onPageLoad.bind(k(t))),
            (t.state = { isLandscape: !1, isPortrait: !1 }),
            t
          );
        }
        return (
          (r.prototype = Object.create(t && t.prototype, {
            constructor: { value: r, writable: !0, configurable: !0 },
          })),
          t && y(r, t),
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
                ("u" < typeof window ? "undefined" : w(window)) !== void 0 &&
                  eM &&
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
                return n.createElement(
                  e,
                  v({}, this.props, {
                    isLandscape: this.state.isLandscape,
                    isPortrait: this.state.isPortrait,
                  }),
                );
              },
            },
          ]),
          (function (e, t) {
            for (var i = 0; i < t.length; i++) {
              var r = t[i];
              ((r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(e, r.key, r));
            }
          })(r.prototype, i),
          r
        );
      })(n.Component);
    }));
};
