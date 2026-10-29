// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  t.i(24727);
  var e = t.i(641449),
    i = t.i(165520);
  t.i(428531);
  var a = t.i(772072),
    s = t.i(896343),
    r = t.i(299055),
    o = t.i(664216),
    l = t.i(940697);
  let n = l.m`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;
  var c = function (t, e, i, a) {
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
  let h = class extends e.f {
    render() {
      return (
        (this.style.cssText = `
      flex-direction: ${this.flexDirection};
      flex-wrap: ${this.flexWrap};
      flex-basis: ${this.flexBasis};
      flex-grow: ${this.flexGrow};
      flex-shrink: ${this.flexShrink};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      column-gap: ${this.columnGap && `var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap && `var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap && `var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding && r.f.getSpacingStyles(this.padding, 0)};
      padding-right: ${this.padding && r.f.getSpacingStyles(this.padding, 1)};
      padding-bottom: ${this.padding && r.f.getSpacingStyles(this.padding, 2)};
      padding-left: ${this.padding && r.f.getSpacingStyles(this.padding, 3)};
      margin-top: ${this.margin && r.f.getSpacingStyles(this.margin, 0)};
      margin-right: ${this.margin && r.f.getSpacingStyles(this.margin, 1)};
      margin-bottom: ${this.margin && r.f.getSpacingStyles(this.margin, 2)};
      margin-left: ${this.margin && r.f.getSpacingStyles(this.margin, 3)};
    `),
        i.c`<slot></slot>`
      );
    }
  };
  ((h.styles = [s.e, n]),
    c([(0, a.f)()], h.prototype, "flexDirection", void 0),
    c([(0, a.f)()], h.prototype, "flexWrap", void 0),
    c([(0, a.f)()], h.prototype, "flexBasis", void 0),
    c([(0, a.f)()], h.prototype, "flexGrow", void 0),
    c([(0, a.f)()], h.prototype, "flexShrink", void 0),
    c([(0, a.f)()], h.prototype, "alignItems", void 0),
    c([(0, a.f)()], h.prototype, "justifyContent", void 0),
    c([(0, a.f)()], h.prototype, "columnGap", void 0),
    c([(0, a.f)()], h.prototype, "rowGap", void 0),
    c([(0, a.f)()], h.prototype, "gap", void 0),
    c([(0, a.f)()], h.prototype, "padding", void 0),
    c([(0, a.f)()], h.prototype, "margin", void 0),
    (h = c([(0, o.f)("wui-flex")], h)),
    t.s([], 659355),
    t.s([], 915389));
};
