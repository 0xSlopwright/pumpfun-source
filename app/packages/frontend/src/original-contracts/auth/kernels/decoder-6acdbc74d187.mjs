// Source-adapted original 683023; SHA256 6acdbc74d187866d4bc7c8fc63db88e9e7c61d2a7284dc45879ebc620e29b468.
// Generated from authenticated raw AST. Browser/runtime dependencies are injected.
export function createDecoderKernel(atob) {
  let t = e => {
    if (!e || "object" != typeof e) return null;
    let {
      address: t,
      userId: r,
      roles: n,
      permissions: i,
      exp: s,
      iat: o
    } = e;
    return "string" == typeof t && Number.isFinite(s) ? {
      address: t,
      ...("string" == typeof r && "" !== r ? {
        userId: r
      } : {}),
      roles: Array.isArray(n) ? n : [],
      ...(Array.isArray(i) && i.every(e => "string" == typeof e) ? {
        permissions: i
      } : {}),
      exp: s,
      iat: Number.isFinite(o) ? o : 0
    } : null;
  };
  return {
    S: t,
    e: e => {
      if (!e) return null;
      try {
        let r = e.split(".");
        if (3 !== r.length) return null;
        let n = r[1];
        if (!n) return null;
        return t(JSON.parse(atob(n.replace(/-/g, "+").replace(/_/g, "/"))));
      } catch {
        return null;
      }
    }
  };
}
