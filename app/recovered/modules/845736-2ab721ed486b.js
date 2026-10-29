// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, a) => {
  (e.i(149502),
    Object.defineProperty(a, "__esModule", { value: !0 }),
    Object.defineProperty(a, "useRouterBFCache", {
      enumerable: !0,
      get: function () {
        return u;
      },
    }));
  let n = e.r(352386);
  function u(e, t, a) {
    let [u, r] = (0, n.useState)(() => ({
      tree: e,
      renderTree: t,
      stateKey: a,
      next: null,
    }));
    if (u.tree === e) return u;
    let l = { tree: e, renderTree: t, stateKey: a, next: null },
      s = 1,
      i = u,
      o = l;
    for (; null !== i && s < 3; ) {
      if (i.stateKey === a) {
        o.next = i.next;
        break;
      }
      {
        s++;
        let e = {
          tree: i.tree,
          renderTree: i.renderTree,
          stateKey: i.stateKey,
          next: null,
        };
        ((o.next = e), (o = e));
      }
      i = i.next;
    }
    return (r(l), l);
  }
  ("function" == typeof a.default ||
    ("object" == typeof a.default && null !== a.default)) &&
    void 0 === a.default.__esModule &&
    (Object.defineProperty(a.default, "__esModule", { value: !0 }),
    Object.assign(a.default, a),
    (t.exports = a.default));
};
