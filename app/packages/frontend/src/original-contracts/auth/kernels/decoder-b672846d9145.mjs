// Source-adapted original 683023; SHA256 b672846d9145be87dadae7feefaa65c12efd83257c3c48e7ca4da124b6dd4302.
// Generated from authenticated raw AST. Browser/runtime dependencies are injected.
export function createDecoderKernel(atob) {
  let t = e => {
    if (!e || "object" != typeof e) return null;
    let {
      address: t,
      userId: n,
      roles: r,
      permissions: i,
      exp: o,
      iat: s
    } = e;
    return "string" == typeof t && Number.isFinite(o) ? {
      address: t,
      ...("string" == typeof n && "" !== n ? {
        userId: n
      } : {}),
      roles: Array.isArray(r) ? r : [],
      ...(Array.isArray(i) && i.every(e => "string" == typeof e) ? {
        permissions: i
      } : {}),
      exp: o,
      iat: Number.isFinite(s) ? s : 0
    } : null;
  };
  return {
    S: t,
    e: e => {
      if (!e) return null;
      try {
        let n = e.split(".");
        if (3 !== n.length) return null;
        let r = n[1];
        if (!r) return null;
        return t(JSON.parse(atob(r.replace(/-/g, "+").replace(/_/g, "/"))));
      } catch {
        return null;
      }
    }
  };
}
