// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(658103),
    r = e.i(259506),
    n = e.i(254667),
    a = e.i(447700);
  class i extends n.v {
    init(e) {
      (super.init(e), r.f && this.installLiveKitLogBridge());
    }
    async installLiveKitLogBridge() {
      let r = (e) => super.getEnrichedContext(e),
        n = (e) => super.shouldLog(e),
        { LogLevel: i, setLogExtension: o } = await e.A(427043);
      o((e, o, s) => {
        let l = r({ ...s, livekitLogLevel: i[e] });
        switch (e) {
          case i.debug:
            n(a.d.DEBUG) && t.f.logger.debug(o, l);
            break;
          case i.info:
            n(a.d.INFO) && t.f.logger.info(o, l);
            break;
          case i.warn:
            n(a.d.WARN) && t.f.logger.warn(o, l);
            break;
          case i.error:
            n(a.d.ERROR) && t.f.logger.error(o, l);
        }
      });
    }
  }
  let o = new i();
  e.s(["logger", 0, o]);
};
