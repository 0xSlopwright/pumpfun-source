// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, i) => {
  var a = {
    single_source_shortest_paths: function (t, e, i) {
      var s,
        r,
        o,
        n,
        l,
        c,
        h,
        u = {},
        m = {};
      m[e] = 0;
      var p = a.PriorityQueue.make();
      for (p.push(e, 0); !p.empty(); )
        for (o in ((r = (s = p.pop()).value), (n = s.cost), (l = t[r] || {})))
          l.hasOwnProperty(o) &&
            ((c = n + l[o]),
            (h = m[o]),
            (void 0 === m[o] || h > c) &&
              ((m[o] = c), p.push(o, c), (u[o] = r)));
      if (void 0 !== i && void 0 === m[i])
        throw Error(
          ["Could not find a path from ", e, " to ", i, "."].join(""),
        );
      return u;
    },
    extract_shortest_path_from_predecessor_list: function (t, e) {
      for (var i = [], a = e; a; ) (i.push(a), t[a], (a = t[a]));
      return (i.reverse(), i);
    },
    find_path: function (t, e, i) {
      var s = a.single_source_shortest_paths(t, e, i);
      return a.extract_shortest_path_from_predecessor_list(s, i);
    },
    PriorityQueue: {
      make: function (t) {
        var e,
          i = a.PriorityQueue,
          s = {};
        for (e in ((t = t || {}), i)) i.hasOwnProperty(e) && (s[e] = i[e]);
        return ((s.queue = []), (s.sorter = t.sorter || i.default_sorter), s);
      },
      default_sorter: function (t, e) {
        return t.cost - e.cost;
      },
      push: function (t, e) {
        (this.queue.push({ value: t, cost: e }), this.queue.sort(this.sorter));
      },
      pop: function () {
        return this.queue.shift();
      },
      empty: function () {
        return 0 === this.queue.length;
      },
    },
  };
  e.exports = a;
};
