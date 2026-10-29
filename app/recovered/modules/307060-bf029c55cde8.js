// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  t.i(24727);
  var e = t.i(641449),
    i = t.i(165520);
  t.i(428531);
  var a = t.i(772072),
    s = t.i(896343),
    r = t.i(664216),
    o = t.i(940697);
  let l = o.m`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`;
  var n = function (t, e, i, a) {
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
      for (var l = t.length - 1; l >= 0; l--)
        (s = t[l]) && (o = (r < 3 ? s(o) : r > 3 ? s(e, i, o) : s(e, i)) || o);
    return (r > 3 && o && Object.defineProperty(e, i, o), o);
  };
  let c = class extends e.f {
    constructor() {
      (super(...arguments),
        (this.src = "./path/to/image.jpg"),
        (this.alt = "Image"),
        (this.size = void 0));
    }
    render() {
      return (
        (this.style.cssText = `
      --local-width: ${this.size ? `var(--wui-icon-size-${this.size});` : "100%"};
      --local-height: ${this.size ? `var(--wui-icon-size-${this.size});` : "100%"};
      `),
        i.c`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`
      );
    }
    handleImageError() {
      this.dispatchEvent(
        new CustomEvent("onLoadError", { bubbles: !0, composed: !0 }),
      );
    }
  };
  ((c.styles = [s.e, s.G, l]),
    n([(0, a.f)()], c.prototype, "src", void 0),
    n([(0, a.f)()], c.prototype, "alt", void 0),
    n([(0, a.f)()], c.prototype, "size", void 0),
    (c = n([(0, r.f)("wui-image")], c)),
    t.s([], 307060));
};
