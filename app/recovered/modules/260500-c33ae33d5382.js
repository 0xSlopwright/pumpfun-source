// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  Object.defineProperty(r, "__esModule", { value: !0 });
  var n = {
    GracefulDegradeBoundary: function () {
      return l;
    },
    default: function () {
      return u;
    },
  };
  for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
  let a = e.r(732486),
    i = e.r(352386);
  class l extends i.Component {
    constructor(e) {
      (super(e),
        (this.state = { hasError: !1 }),
        (this.rootHtml = ""),
        (this.htmlAttributes = {}),
        (this.htmlRef = (0, i.createRef)()));
    }
    static getDerivedStateFromError(e) {
      return { hasError: !0 };
    }
    componentDidMount() {
      let e = this.htmlRef.current;
      this.state.hasError &&
        e &&
        Object.entries(this.htmlAttributes).forEach(([t, r]) => {
          e.setAttribute(t, r);
        });
    }
    render() {
      let { hasError: e } = this.state;
      return ("u" > typeof window &&
        !this.rootHtml &&
        ((this.rootHtml = document.documentElement.innerHTML),
        (this.htmlAttributes = (function (e) {
          let t = {};
          for (let r = 0; r < e.attributes.length; r++) {
            let n = e.attributes[r];
            t[n.name] = n.value;
          }
          return t;
        })(document.documentElement))),
      e)
        ? (0, a.jsx)("html", {
            ref: this.htmlRef,
            suppressHydrationWarning: !0,
            dangerouslySetInnerHTML: { __html: this.rootHtml },
          })
        : this.props.children;
    }
  }
  let u = l;
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
