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
  let n = o.m`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`;
  var l = function (t, e, i, a) {
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
  let c = class extends e.f {
    constructor() {
      (super(...arguments), (this.color = "accent-100"), (this.size = "lg"));
    }
    render() {
      return (
        (this.style.cssText = `--local-color: ${"inherit" === this.color ? "inherit" : `var(--wui-color-${this.color})`}`),
        (this.dataset.size = this.size),
        i.c`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`
      );
    }
  };
  ((c.styles = [s.e, n]),
    l([(0, a.f)()], c.prototype, "color", void 0),
    l([(0, a.f)()], c.prototype, "size", void 0),
    (c = l([(0, r.f)("wui-loading-spinner")], c)),
    t.s([], 381921),
    t.i(192234),
    t.s([], 820841));
};
