// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  t.i(24727);
  var e = t.i(641449),
    i = t.i(165520);
  t.i(428531);
  var a = t.i(772072);
  t.i(135618);
  var s = t.i(896343),
    r = t.i(664216),
    o = t.i(940697);
  let l = o.m`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
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
      (super(...arguments), (this.variant = "main"), (this.size = "lg"));
    }
    render() {
      ((this.dataset.variant = this.variant), (this.dataset.size = this.size));
      let t = "md" === this.size ? "mini-700" : "micro-700";
      return i.c`
      <wui-text data-variant=${this.variant} variant=${t} color="inherit">
        <slot></slot>
      </wui-text>
    `;
    }
  };
  ((c.styles = [s.e, l]),
    n([(0, a.f)()], c.prototype, "variant", void 0),
    n([(0, a.f)()], c.prototype, "size", void 0),
    (c = n([(0, r.f)("wui-tag")], c)),
    t.s([], 625427));
};
