// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  t.i(24727);
  var e = t.i(641449),
    i = t.i(165520);
  t.i(428531);
  var a = t.i(772072);
  t.i(192234);
  var s = t.i(896343),
    r = t.i(664216),
    o = t.i(940697);
  let l = o.m`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
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
        (this.size = "md"),
        (this.backgroundColor = "accent-100"),
        (this.iconColor = "accent-100"),
        (this.background = "transparent"),
        (this.border = !1),
        (this.borderColor = "wui-color-bg-125"),
        (this.icon = "copy"));
    }
    render() {
      let t = this.iconSize || this.size,
        e = "lg" === this.size,
        a = "xl" === this.size,
        s = "gray" === this.background,
        r = "opaque" === this.background,
        o =
          ("accent-100" === this.backgroundColor && r) ||
          ("success-100" === this.backgroundColor && r) ||
          ("error-100" === this.backgroundColor && r) ||
          ("inverse-100" === this.backgroundColor && r),
        l = `var(--wui-color-${this.backgroundColor})`;
      return (
        o
          ? (l = `var(--wui-icon-box-bg-${this.backgroundColor})`)
          : s && (l = `var(--wui-color-gray-${this.backgroundColor})`),
        (this.style.cssText = `
       --local-bg-value: ${l};
       --local-bg-mix: ${o || s ? "100%" : e ? "12%" : "16%"};
       --local-border-radius: var(--wui-border-radius-${e ? "xxs" : a ? "s" : "3xl"});
       --local-size: var(--wui-icon-box-size-${this.size});
       --local-border: ${"wui-color-bg-125" === this.borderColor ? "2px" : "1px"} solid ${this.border ? `var(--${this.borderColor})` : "transparent"}
   `),
        i.c` <wui-icon color=${this.iconColor} size=${t} name=${this.icon}></wui-icon> `
      );
    }
  };
  ((c.styles = [s.e, s.j, l]),
    n([(0, a.f)()], c.prototype, "size", void 0),
    n([(0, a.f)()], c.prototype, "backgroundColor", void 0),
    n([(0, a.f)()], c.prototype, "iconColor", void 0),
    n([(0, a.f)()], c.prototype, "iconSize", void 0),
    n([(0, a.f)()], c.prototype, "background", void 0),
    n([(0, a.f)({ type: Boolean })], c.prototype, "border", void 0),
    n([(0, a.f)()], c.prototype, "borderColor", void 0),
    n([(0, a.f)()], c.prototype, "icon", void 0),
    (c = n([(0, r.f)("wui-icon-box")], c)),
    t.s([], 809090));
};
