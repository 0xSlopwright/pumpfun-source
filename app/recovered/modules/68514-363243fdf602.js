// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(213618),
    i = e.i(894114),
    a = e.i(241175),
    s = e.i(51435),
    o = class extends s.f {
      constructor(e = {}) {
        (super(), (this.config = e), (this.#e = new Map()));
      }
      #e;
      build(e, t, r) {
        let a = t.queryKey,
          s = t.queryHash ?? (0, n.J)(a, t),
          o = this.get(s);
        return (
          o ||
            ((o = new i.X({
              client: e,
              queryKey: a,
              queryHash: s,
              options: e.defaultQueryOptions(t),
              state: r,
              defaultOptions: e.getQueryDefaults(a),
            })),
            this.add(o)),
          o
        );
      }
      add(e) {
        this.#e.has(e.queryHash) ||
          (this.#e.set(e.queryHash, e),
          this.notify({ type: "added", query: e }));
      }
      remove(e) {
        let t = this.#e.get(e.queryHash);
        t &&
          (e.destroy(),
          t === e && this.#e.delete(e.queryHash),
          this.notify({ type: "removed", query: e }));
      }
      clear() {
        a.f.batch(() => {
          this.getAll().forEach((e) => {
            this.remove(e);
          });
        });
      }
      get(e) {
        return this.#e.get(e);
      }
      getAll() {
        return [...this.#e.values()];
      }
      find(e) {
        let t = { exact: !0, ...e };
        return this.getAll().find((e) => (0, n.N)(t, e));
      }
      findAll(e = {}) {
        let t = this.getAll();
        return Object.keys(e).length > 0 ? t.filter((t) => (0, n.N)(e, t)) : t;
      }
      notify(e) {
        a.f.batch(() => {
          this.listeners.forEach((t) => {
            t(e);
          });
        });
      }
      onFocus() {
        a.f.batch(() => {
          this.getAll().forEach((e) => {
            e.onFocus();
          });
        });
      }
      onOnline() {
        a.f.batch(() => {
          this.getAll().forEach((e) => {
            e.onOnline();
          });
        });
      }
    },
    l = e.i(462852),
    c = s,
    u = class extends c.f {
      constructor(e = {}) {
        (super(),
          (this.config = e),
          (this.#t = new Set()),
          (this.#r = new Map()),
          (this.#n = 0));
      }
      #t;
      #r;
      #n;
      build(e, t, r) {
        let n = new l.I({
          mutationCache: this,
          mutationId: ++this.#n,
          options: e.defaultMutationOptions(t),
          state: r,
        });
        return (this.add(n), n);
      }
      add(e) {
        this.#t.add(e);
        let t = d(e);
        if ("string" == typeof t) {
          let r = this.#r.get(t);
          r ? r.push(e) : this.#r.set(t, [e]);
        }
        this.notify({ type: "added", mutation: e });
      }
      remove(e) {
        if (this.#t.delete(e)) {
          let t = d(e);
          if ("string" == typeof t) {
            let r = this.#r.get(t);
            if (r)
              if (r.length > 1) {
                let t = r.indexOf(e);
                -1 !== t && r.splice(t, 1);
              } else r[0] === e && this.#r.delete(t);
          }
        }
        this.notify({ type: "removed", mutation: e });
      }
      canRun(e) {
        let t = d(e);
        if ("string" != typeof t) return !0;
        {
          let r = this.#r.get(t),
            n = r?.find((e) => "pending" === e.state.status);
          return !n || n === e;
        }
      }
      runNext(e) {
        let t = d(e);
        if ("string" != typeof t) return Promise.resolve();
        {
          let r = this.#r.get(t)?.find((t) => t !== e && t.state.isPaused);
          return r?.continue() ?? Promise.resolve();
        }
      }
      clear() {
        a.f.batch(() => {
          (this.#t.forEach((e) => {
            this.notify({ type: "removed", mutation: e });
          }),
            this.#t.clear(),
            this.#r.clear());
        });
      }
      getAll() {
        return Array.from(this.#t);
      }
      find(e) {
        let t = { exact: !0, ...e };
        return this.getAll().find((e) => (0, n.L)(t, e));
      }
      findAll(e = {}) {
        return this.getAll().filter((t) => (0, n.L)(e, t));
      }
      notify(e) {
        a.f.batch(() => {
          this.listeners.forEach((t) => {
            t(e);
          });
        });
      }
      resumePausedMutations() {
        let e = this.getAll().filter((e) => e.state.isPaused);
        return a.f.batch(() =>
          Promise.all(e.map((e) => e.continue().catch(n.z))),
        );
      }
    };
  function d(e) {
    return e.options.scope?.id;
  }
  var m = e.i(982069),
    f = e.i(523218),
    p = e.i(119031),
    h = class {
      #i;
      #a;
      #s;
      #o;
      #l;
      #c;
      #u;
      #d;
      constructor(e = {}) {
        ((this.#i = e.queryCache || new o()),
          (this.#a = e.mutationCache || new u()),
          (this.#s = e.defaultOptions || {}),
          (this.#o = new Map()),
          (this.#l = new Map()),
          (this.#c = 0));
      }
      mount() {
        (this.#c++,
          1 === this.#c &&
            ((this.#u = m.f.subscribe(async (e) => {
              e && (await this.resumePausedMutations(), this.#i.onFocus());
            })),
            (this.#d = f.f.subscribe(async (e) => {
              e && (await this.resumePausedMutations(), this.#i.onOnline());
            }))));
      }
      unmount() {
        (this.#c--,
          0 === this.#c &&
            (this.#u?.(), (this.#u = void 0), this.#d?.(), (this.#d = void 0)));
      }
      isFetching(e) {
        return this.#i.findAll({ ...e, fetchStatus: "fetching" }).length;
      }
      isMutating(e) {
        return this.#a.findAll({ ...e, status: "pending" }).length;
      }
      getQueryData(e) {
        let t = this.defaultQueryOptions({ queryKey: e });
        return this.#i.get(t.queryHash)?.state.data;
      }
      ensureQueryData(e) {
        let t = this.defaultQueryOptions(e),
          r = this.#i.build(this, t),
          i = r.state.data;
        return void 0 === i
          ? this.fetchQuery(e)
          : (e.revalidateIfStale &&
              r.isStaleByTime((0, n.H)(t.staleTime, r)) &&
              this.prefetchQuery(t),
            Promise.resolve(i));
      }
      getQueriesData(e) {
        return this.#i
          .findAll(e)
          .map(({ queryKey: e, state: t }) => [e, t.data]);
      }
      setQueryData(e, t, r) {
        let i = this.defaultQueryOptions({ queryKey: e }),
          a = this.#i.get(i.queryHash),
          s = a?.state.data,
          o = (0, n.b)(t, s);
        if (void 0 !== o)
          return this.#i.build(this, i).setData(o, { ...r, manual: !0 });
      }
      setQueriesData(e, t, r) {
        return a.f.batch(() =>
          this.#i
            .findAll(e)
            .map(({ queryKey: e }) => [e, this.setQueryData(e, t, r)]),
        );
      }
      getQueryState(e) {
        let t = this.defaultQueryOptions({ queryKey: e });
        return this.#i.get(t.queryHash)?.state;
      }
      removeQueries(e) {
        let t = this.#i;
        a.f.batch(() => {
          t.findAll(e).forEach((e) => {
            t.remove(e);
          });
        });
      }
      resetQueries(e, t) {
        let r = this.#i;
        return a.f.batch(
          () => (
            r.findAll(e).forEach((e) => {
              e.reset();
            }),
            this.refetchQueries({ type: "active", ...e }, t)
          ),
        );
      }
      cancelQueries(e, t = {}) {
        let r = { revert: !0, ...t };
        return Promise.all(
          a.f.batch(() => this.#i.findAll(e).map((e) => e.cancel(r))),
        )
          .then(n.z)
          .catch(n.z);
      }
      invalidateQueries(e, t = {}) {
        return a.f.batch(() =>
          (this.#i.findAll(e).forEach((e) => {
            e.invalidate();
          }),
          e?.refetchType === "none")
            ? Promise.resolve()
            : this.refetchQueries(
                { ...e, type: e?.refetchType ?? e?.type ?? "active" },
                t,
              ),
        );
      }
      refetchQueries(e, t = {}) {
        let r = { ...t, cancelRefetch: t.cancelRefetch ?? !0 };
        return Promise.all(
          a.f.batch(() =>
            this.#i
              .findAll(e)
              .filter((e) => !e.isDisabled())
              .map((e) => {
                let t = e.fetch(void 0, r);
                return (
                  r.throwOnError || (t = t.catch(n.z)),
                  "paused" === e.state.fetchStatus ? Promise.resolve() : t
                );
              }),
          ),
        ).then(n.z);
      }
      fetchQuery(e) {
        let t = this.defaultQueryOptions(e);
        void 0 === t.retry && (t.retry = !1);
        let r = this.#i.build(this, t);
        return r.isStaleByTime((0, n.H)(t.staleTime, r))
          ? r.fetch(t)
          : Promise.resolve(r.state.data);
      }
      prefetchQuery(e) {
        return this.fetchQuery(e).then(n.z).catch(n.z);
      }
      fetchInfiniteQuery(e) {
        return ((e.behavior = (0, p.T)(e.pages)), this.fetchQuery(e));
      }
      prefetchInfiniteQuery(e) {
        return this.fetchInfiniteQuery(e).then(n.z).catch(n.z);
      }
      ensureInfiniteQueryData(e) {
        return ((e.behavior = (0, p.T)(e.pages)), this.ensureQueryData(e));
      }
      resumePausedMutations() {
        return f.f.isOnline()
          ? this.#a.resumePausedMutations()
          : Promise.resolve();
      }
      getQueryCache() {
        return this.#i;
      }
      getMutationCache() {
        return this.#a;
      }
      getDefaultOptions() {
        return this.#s;
      }
      setDefaultOptions(e) {
        this.#s = e;
      }
      setQueryDefaults(e, t) {
        this.#o.set((0, n.q)(e), { queryKey: e, defaultOptions: t });
      }
      getQueryDefaults(e) {
        let t = [...this.#o.values()],
          r = {};
        return (
          t.forEach((t) => {
            (0, n.P)(e, t.queryKey) && Object.assign(r, t.defaultOptions);
          }),
          r
        );
      }
      setMutationDefaults(e, t) {
        this.#l.set((0, n.q)(e), { mutationKey: e, defaultOptions: t });
      }
      getMutationDefaults(e) {
        let t = [...this.#l.values()],
          r = {};
        return (
          t.forEach((t) => {
            (0, n.P)(e, t.mutationKey) && Object.assign(r, t.defaultOptions);
          }),
          r
        );
      }
      defaultQueryOptions(e) {
        if (e._defaulted) return e;
        let t = {
          ...this.#s.queries,
          ...this.getQueryDefaults(e.queryKey),
          ...e,
          _defaulted: !0,
        };
        return (
          t.queryHash || (t.queryHash = (0, n.J)(t.queryKey, t)),
          void 0 === t.refetchOnReconnect &&
            (t.refetchOnReconnect = "always" !== t.networkMode),
          void 0 === t.throwOnError && (t.throwOnError = !!t.suspense),
          !t.networkMode && t.persister && (t.networkMode = "offlineFirst"),
          t.queryFn === n.V && (t.enabled = !1),
          t
        );
      }
      defaultMutationOptions(e) {
        return e?._defaulted
          ? e
          : {
              ...this.#s.mutations,
              ...(e?.mutationKey && this.getMutationDefaults(e.mutationKey)),
              ...e,
              _defaulted: !0,
            };
      }
      clear() {
        (this.#i.clear(), this.#a.clear());
      }
    },
    y = e.i(606933),
    b = e.i(352386),
    g = e.i(394156);
  function v() {
    return (0, g.p)(null);
  }
  function w() {
    return new h({ defaultOptions: { queries: { retry: 1 } } });
  }
  e.s(
    [
      "ReactQueryProvider",
      0,
      function (e) {
        let n,
          i,
          a,
          s = (0, r.c)(6),
          { children: o } = e,
          [l] = (0, b.useState)(w);
        return (
          s[0] !== l
            ? ((n = () => ((0, g.p)(l), v)),
              (i = [l]),
              (s[0] = l),
              (s[1] = n),
              (s[2] = i))
            : ((n = s[1]), (i = s[2])),
          (0, b.useEffect)(n, i),
          s[3] !== o || s[4] !== l
            ? ((a = (0, t.jsx)(y.QueryClientProvider, {
                client: l,
                children: o,
              })),
              (s[3] = o),
              (s[4] = l),
              (s[5] = a))
            : (a = s[5]),
          a
        );
      },
    ],
    68514,
  );
};
