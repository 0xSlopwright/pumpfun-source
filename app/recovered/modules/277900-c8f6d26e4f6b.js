// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }), (r.Watch = void 0));
  class n {
    constructor() {
      this.timestamps = new Map();
    }
    start(e) {
      if (this.timestamps.has(e))
        throw Error(`Watch already started for label: ${e}`);
      this.timestamps.set(e, { started: Date.now() });
    }
    stop(e) {
      let t = this.get(e);
      if (void 0 !== t.elapsed)
        throw Error(`Watch already stopped for label: ${e}`);
      let r = Date.now() - t.started;
      this.timestamps.set(e, { started: t.started, elapsed: r });
    }
    get(e) {
      let t = this.timestamps.get(e);
      if (void 0 === t) throw Error(`No timestamp found for label: ${e}`);
      return t;
    }
    elapsed(e) {
      let t = this.get(e);
      return t.elapsed || Date.now() - t.started;
    }
  }
  ((r.Watch = n), (r.default = n));
};
