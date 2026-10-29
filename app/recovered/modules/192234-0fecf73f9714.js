// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  t.i(24727);
  var e = t.i(641449),
    i = t.i(165520);
  t.i(428531);
  var a = t.i(772072);
  let { I: s } = i.e,
    r = {
      ATTRIBUTE: 1,
      CHILD: 2,
      PROPERTY: 3,
      BOOLEAN_ATTRIBUTE: 4,
      EVENT: 5,
      ELEMENT: 6,
    },
    o =
      (t) =>
      (...e) => ({ _$litDirective$: t, values: e });
  class n {
    constructor(t) {}
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t, e, i) {
      ((this._$Ct = t), (this._$AM = e), (this._$Ci = i));
    }
    _$AS(t, e) {
      return this.update(t, e);
    }
    update(t, e) {
      return this.render(...e);
    }
  }
  t.s(["C", 0, n, "x", 0, r, "l", 0, o], 972853);
  let l = (t, e) => {
      let i = t._$AN;
      if (void 0 === i) return !1;
      for (let t of i) (t._$AO?.(e, !1), l(t, e));
      return !0;
    },
    c = (t) => {
      let e, i;
      do {
        if (void 0 === (e = t._$AM)) break;
        ((i = e._$AN).delete(t), (t = e));
      } while (0 === i?.size);
    },
    h = (t) => {
      for (let e; (e = t._$AM); t = e) {
        let i = e._$AN;
        if (void 0 === i) e._$AN = i = new Set();
        else if (i.has(t)) break;
        (i.add(t), p(e));
      }
    };
  function u(t) {
    void 0 !== this._$AN
      ? (c(this), (this._$AM = t), h(this))
      : (this._$AM = t);
  }
  function m(t, e = !1, i = 0) {
    let a = this._$AH,
      s = this._$AN;
    if (void 0 !== s && 0 !== s.size)
      if (e)
        if (Array.isArray(a))
          for (let t = i; t < a.length; t++) (l(a[t], !1), c(a[t]));
        else null != a && (l(a, !1), c(a));
      else l(this, t);
  }
  let p = (t) => {
    t.type == r.CHILD && ((t._$AP ??= m), (t._$AQ ??= u));
  };
  class d extends n {
    constructor() {
      (super(...arguments), (this._$AN = void 0));
    }
    _$AT(t, e, i) {
      (super._$AT(t, e, i), h(this), (this.isConnected = t._$AU));
    }
    _$AO(t, e = !0) {
      (t !== this.isConnected &&
        ((this.isConnected = t),
        t ? this.reconnected?.() : this.disconnected?.()),
        e && (l(this, t), c(this)));
    }
    setValue(t) {
      if (void 0 === this._$Ct.strings) this._$Ct._$AI(t, this);
      else {
        let e = [...this._$Ct._$AH];
        ((e[this._$Ci] = t), this._$Ct._$AI(e, this, 0));
      }
    }
    disconnected() {}
    reconnected() {}
  }
  t.s(["f", 0, d], 372288);
  class v {
    constructor(t) {
      this.G = t;
    }
    disconnect() {
      this.G = void 0;
    }
    reconnect(t) {
      this.G = t;
    }
    deref() {
      return this.G;
    }
  }
  class g {
    constructor() {
      ((this.Y = void 0), (this.Z = void 0));
    }
    get() {
      return this.Y;
    }
    pause() {
      this.Y ??= new Promise((t) => (this.Z = t));
    }
    resume() {
      (this.Z?.(), (this.Y = this.Z = void 0));
    }
  }
  let f = (t) =>
      null !== t &&
      ("object" == typeof t || "function" == typeof t) &&
      "function" == typeof t.then,
    w = o(
      class extends d {
        constructor() {
          (super(...arguments),
            (this._$Cwt = 0x3fffffff),
            (this._$Cbt = []),
            (this._$CK = new v(this)),
            (this._$CX = new g()));
        }
        render(...t) {
          return t.find((t) => !f(t)) ?? i.r;
        }
        update(t, e) {
          let a = this._$Cbt,
            s = a.length;
          this._$Cbt = e;
          let r = this._$CK,
            o = this._$CX;
          this.isConnected || this.disconnected();
          for (let t = 0; t < e.length && !(t > this._$Cwt); t++) {
            let i = e[t];
            if (!f(i)) return ((this._$Cwt = t), i);
            (t < s && i === a[t]) ||
              ((this._$Cwt = 0x3fffffff),
              (s = 0),
              Promise.resolve(i).then(async (t) => {
                for (; o.get(); ) await o.get();
                let e = r.deref();
                if (void 0 !== e) {
                  let a = e._$Cbt.indexOf(i);
                  a > -1 && a < e._$Cwt && ((e._$Cwt = a), e.setValue(t));
                }
              }));
          }
          return i.r;
        }
        disconnected() {
          (this._$CK.disconnect(), this._$CX.pause());
        }
        reconnected() {
          (this._$CK.reconnect(this), this._$CX.resume());
        }
      },
    ),
    y = new (class {
      constructor() {
        this.cache = new Map();
      }
      set(t, e) {
        this.cache.set(t, e);
      }
      get(t) {
        return this.cache.get(t);
      }
      has(t) {
        return this.cache.has(t);
      }
      delete(t) {
        this.cache.delete(t);
      }
      clear() {
        this.cache.clear();
      }
    })();
  var b = t.i(896343),
    k = t.i(664216),
    j = t.i(940697);
  let x = j.m`
  :host {
    display: flex;
    aspect-ratio: var(--local-aspect-ratio);
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }

  .fallback {
    width: var(--local-width);
    height: var(--local-height);
  }
`;
  var $ = function (t, e, i, a) {
    var s,
      r = arguments.length,
      o =
        r < 3
          ? e
          : null === a
            ? (a = Object.getOwnPropertyDescriptor(e, i))
            : a;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
      o = Reflect.decorate(t, e, i, a);
    else
      for (var n = t.length - 1; n >= 0; n--)
        (s = t[n]) && (o = (r < 3 ? s(o) : r > 3 ? s(e, i, o) : s(e, i)) || o);
    return (r > 3 && o && Object.defineProperty(e, i, o), o);
  };
  let S = {
    add: async () => (await t.A(475526)).addSvg,
    allWallets: async () => (await t.A(929280)).allWalletsSvg,
    arrowBottomCircle: async () => (await t.A(526966)).arrowBottomCircleSvg,
    appStore: async () => (await t.A(19486)).appStoreSvg,
    apple: async () => (await t.A(575589)).appleSvg,
    arrowBottom: async () => (await t.A(445993)).arrowBottomSvg,
    arrowLeft: async () => (await t.A(314114)).arrowLeftSvg,
    arrowRight: async () => (await t.A(25271)).arrowRightSvg,
    arrowTop: async () => (await t.A(927243)).arrowTopSvg,
    bank: async () => (await t.A(778581)).bankSvg,
    browser: async () => (await t.A(896969)).browserSvg,
    card: async () => (await t.A(422940)).cardSvg,
    checkmark: async () => (await t.A(562500)).checkmarkSvg,
    checkmarkBold: async () => (await t.A(653515)).checkmarkBoldSvg,
    chevronBottom: async () => (await t.A(224739)).chevronBottomSvg,
    chevronLeft: async () => (await t.A(429711)).chevronLeftSvg,
    chevronRight: async () => (await t.A(358792)).chevronRightSvg,
    chevronTop: async () => (await t.A(220195)).chevronTopSvg,
    chromeStore: async () => (await t.A(806067)).chromeStoreSvg,
    clock: async () => (await t.A(380255)).clockSvg,
    close: async () => (await t.A(509337)).closeSvg,
    compass: async () => (await t.A(281209)).compassSvg,
    coinPlaceholder: async () => (await t.A(522586)).coinPlaceholderSvg,
    copy: async () => (await t.A(290258)).copySvg,
    cursor: async () => (await t.A(381797)).cursorSvg,
    cursorTransparent: async () => (await t.A(533709)).cursorTransparentSvg,
    desktop: async () => (await t.A(230450)).desktopSvg,
    disconnect: async () => (await t.A(320869)).disconnectSvg,
    discord: async () => (await t.A(82916)).discordSvg,
    etherscan: async () => (await t.A(920060)).etherscanSvg,
    extension: async () => (await t.A(550092)).extensionSvg,
    externalLink: async () => (await t.A(125015)).externalLinkSvg,
    facebook: async () => (await t.A(355075)).facebookSvg,
    farcaster: async () => (await t.A(889278)).farcasterSvg,
    filters: async () => (await t.A(65712)).filtersSvg,
    github: async () => (await t.A(827633)).githubSvg,
    google: async () => (await t.A(988453)).googleSvg,
    helpCircle: async () => (await t.A(640625)).helpCircleSvg,
    image: async () => (await t.A(565869)).imageSvg,
    id: async () => (await t.A(633091)).idSvg,
    infoCircle: async () => (await t.A(827708)).infoCircleSvg,
    lightbulb: async () => (await t.A(262225)).lightbulbSvg,
    mail: async () => (await t.A(825753)).mailSvg,
    mobile: async () => (await t.A(481843)).mobileSvg,
    more: async () => (await t.A(763235)).moreSvg,
    networkPlaceholder: async () => (await t.A(303634)).networkPlaceholderSvg,
    nftPlaceholder: async () => (await t.A(323685)).nftPlaceholderSvg,
    off: async () => (await t.A(103148)).offSvg,
    playStore: async () => (await t.A(491909)).playStoreSvg,
    plus: async () => (await t.A(16188)).plusSvg,
    qrCode: async () => (await t.A(371367)).qrCodeIcon,
    recycleHorizontal: async () => (await t.A(6460)).recycleHorizontalSvg,
    refresh: async () => (await t.A(460513)).refreshSvg,
    search: async () => (await t.A(789209)).searchSvg,
    send: async () => (await t.A(158009)).sendSvg,
    swapHorizontal: async () => (await t.A(531978)).swapHorizontalSvg,
    swapHorizontalMedium: async () =>
      (await t.A(600500)).swapHorizontalMediumSvg,
    swapHorizontalBold: async () => (await t.A(515968)).swapHorizontalBoldSvg,
    swapHorizontalRoundedBold: async () =>
      (await t.A(295215)).swapHorizontalRoundedBoldSvg,
    swapVertical: async () => (await t.A(480784)).swapVerticalSvg,
    telegram: async () => (await t.A(122651)).telegramSvg,
    threeDots: async () => (await t.A(341838)).threeDotsSvg,
    twitch: async () => (await t.A(935076)).twitchSvg,
    twitter: async () => (await t.A(658143)).xSvg,
    twitterIcon: async () => (await t.A(863026)).twitterIconSvg,
    verify: async () => (await t.A(795819)).verifySvg,
    verifyFilled: async () => (await t.A(866877)).verifyFilledSvg,
    wallet: async () => (await t.A(383241)).walletSvg,
    walletConnect: async () => (await t.A(864550)).walletConnectSvg,
    walletConnectLightBrown: async () =>
      (await t.A(864550)).walletConnectLightBrownSvg,
    walletConnectBrown: async () => (await t.A(864550)).walletConnectBrownSvg,
    walletPlaceholder: async () => (await t.A(615978)).walletPlaceholderSvg,
    warningCircle: async () => (await t.A(791349)).warningCircleSvg,
    x: async () => (await t.A(658143)).xSvg,
    info: async () => (await t.A(425647)).infoSvg,
    exclamationTriangle: async () => (await t.A(628773)).exclamationTriangleSvg,
    reown: async () => (await t.A(578666)).reownSvg,
  };
  async function A(t) {
    if (y.has(t)) return y.get(t);
    let e = (S[t] ?? S.copy)();
    return (y.set(t, e), e);
  }
  let P = class extends e.f {
    constructor() {
      (super(...arguments),
        (this.size = "md"),
        (this.name = "copy"),
        (this.color = "fg-300"),
        (this.aspectRatio = "1 / 1"));
    }
    render() {
      return (
        (this.style.cssText = `
      --local-color: var(--wui-color-${this.color});
      --local-width: var(--wui-icon-size-${this.size});
      --local-aspect-ratio: ${this.aspectRatio}
    `),
        i.c`${w(A(this.name), i.c`<div class="fallback"></div>`)}`
      );
    }
  };
  ((P.styles = [b.e, b.G, x]),
    $([(0, a.f)()], P.prototype, "size", void 0),
    $([(0, a.f)()], P.prototype, "name", void 0),
    $([(0, a.f)()], P.prototype, "color", void 0),
    $([(0, a.f)()], P.prototype, "aspectRatio", void 0),
    (P = $([(0, k.f)("wui-icon")], P)),
    t.s([], 192234));
  var z = e;
  let _ = o(
    class extends n {
      constructor(t) {
        if (
          (super(t),
          t.type !== r.ATTRIBUTE || "class" !== t.name || t.strings?.length > 2)
        )
          throw Error(
            "`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.",
          );
      }
      render(t) {
        return (
          " " +
          Object.keys(t)
            .filter((e) => t[e])
            .join(" ") +
          " "
        );
      }
      update(t, [e]) {
        if (void 0 === this.st) {
          for (let i in ((this.st = new Set()),
          void 0 !== t.strings &&
            (this.nt = new Set(
              t.strings
                .join(" ")
                .split(/\s/)
                .filter((t) => "" !== t),
            )),
          e))
            e[i] && !this.nt?.has(i) && this.st.add(i);
          return this.render(e);
        }
        let a = t.element.classList;
        for (let t of this.st) t in e || (a.remove(t), this.st.delete(t));
        for (let t in e) {
          let i = !!e[t];
          i === this.st.has(t) ||
            this.nt?.has(t) ||
            (i ? (a.add(t), this.st.add(t)) : (a.remove(t), this.st.delete(t)));
        }
        return i.r;
      }
    },
  );
  (t.s(["f", 0, _], 198060), t.s([], 182384));
  let C = j.m`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .wui-font-medium-400 {
    font-size: var(--wui-font-size-medium);
    font-weight: var(--wui-font-weight-light);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-medium-600 {
    font-size: var(--wui-font-size-medium);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-title-600 {
    font-size: var(--wui-font-size-title);
    letter-spacing: var(--wui-letter-spacing-title);
  }

  .wui-font-title-6-600 {
    font-size: var(--wui-font-size-title-6);
    letter-spacing: var(--wui-letter-spacing-title-6);
  }

  .wui-font-mini-700 {
    font-size: var(--wui-font-size-mini);
    letter-spacing: var(--wui-letter-spacing-mini);
    text-transform: uppercase;
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-2xl-500,
  .wui-font-2xl-600,
  .wui-font-2xl-700 {
    font-size: var(--wui-font-size-2xl);
    letter-spacing: var(--wui-letter-spacing-2xl);
  }

  .wui-font-paragraph-400,
  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-400,
  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-tiny-400,
  .wui-font-small-400,
  .wui-font-medium-400,
  .wui-font-paragraph-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700,
  .wui-font-mini-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-medium-600,
  .wui-font-medium-title-600,
  .wui-font-title-6-600,
  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }

  :host([disabled]) {
    opacity: 0.4;
  }
`;
  var T = function (t, e, i, a) {
    var s,
      r = arguments.length,
      o =
        r < 3
          ? e
          : null === a
            ? (a = Object.getOwnPropertyDescriptor(e, i))
            : a;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
      o = Reflect.decorate(t, e, i, a);
    else
      for (var n = t.length - 1; n >= 0; n--)
        (s = t[n]) && (o = (r < 3 ? s(o) : r > 3 ? s(e, i, o) : s(e, i)) || o);
    return (r > 3 && o && Object.defineProperty(e, i, o), o);
  };
  let R = class extends z.f {
    constructor() {
      (super(...arguments),
        (this.variant = "paragraph-500"),
        (this.color = "fg-300"),
        (this.align = "left"),
        (this.lineClamp = void 0));
    }
    render() {
      let t = {
        [`wui-font-${this.variant}`]: !0,
        [`wui-color-${this.color}`]: !0,
        [`wui-line-clamp-${this.lineClamp}`]: !!this.lineClamp,
      };
      return (
        (this.style.cssText = `
      --local-align: ${this.align};
      --local-color: var(--wui-color-${this.color});
    `),
        i.c`<slot class=${_(t)}></slot>`
      );
    }
  };
  ((R.styles = [b.e, C]),
    T([(0, a.f)()], R.prototype, "variant", void 0),
    T([(0, a.f)()], R.prototype, "color", void 0),
    T([(0, a.f)()], R.prototype, "align", void 0),
    T([(0, a.f)()], R.prototype, "lineClamp", void 0),
    (R = T([(0, k.f)("wui-text")], R)),
    t.s([], 135618));
};
