// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(590719),
    i = e.i(19648);
  function f(e) {
    let { kzg: f } = e,
      s = e.to ?? ("string" == typeof e.blobs[0] ? "hex" : "bytes"),
      n =
        "string" == typeof e.blobs[0]
          ? e.blobs.map((e) => (0, t.X)(e))
          : e.blobs,
      o = [];
    for (let e of n) o.push(Uint8Array.from(f.blobToKzgCommitment(e)));
    return "bytes" === s ? o : o.map((e) => (0, i.v)(e));
  }
  function s(e) {
    let { kzg: f } = e,
      s = e.to ?? ("string" == typeof e.blobs[0] ? "hex" : "bytes"),
      n =
        "string" == typeof e.blobs[0]
          ? e.blobs.map((e) => (0, t.X)(e))
          : e.blobs,
      o =
        "string" == typeof e.commitments[0]
          ? e.commitments.map((e) => (0, t.X)(e))
          : e.commitments,
      r = [];
    for (let e = 0; e < n.length; e++) {
      let t = n[e],
        i = o[e];
      r.push(Uint8Array.from(f.computeBlobKzgProof(t, i)));
    }
    return "bytes" === s ? r : r.map((e) => (0, i.v)(e));
  }
  (e.s(["f", 0, f], 373967), e.s(["f", 0, s], 873055));
  var n = e.i(403893),
    o = e.i(470083);
  e.s(
    [
      "f",
      0,
      function (e) {
        let { commitments: f, version: s } = e,
          r = e.to ?? ("string" == typeof f[0] ? "hex" : "bytes"),
          a = [];
        for (let e of f)
          a.push(
            (function (e) {
              let { commitment: f, version: s = 1 } = e,
                r = e.to ?? ("string" == typeof f ? "hex" : "bytes"),
                a = (0, n.f)((0, o.f)(f, { strict: !1 }) ? (0, t.D)(f) : f);
              return (a.set([s], 0), "bytes" === r ? a : (0, i.v)(a));
            })({ commitment: e, to: r, version: s }),
          );
        return a;
      },
    ],
    651464,
  );
  e.s(["f", 0, 1], 242749);
  var r = e.i(532617);
  class a extends r.f {
    constructor({ maxSize: e, size: t }) {
      super("Blob size is too large.", {
        metaMessages: [`Max: ${e} bytes`, `Given: ${t} bytes`],
        name: "BlobSizeTooLargeError",
      });
    }
  }
  class c extends r.f {
    constructor() {
      super("Blob data must not be empty.", { name: "EmptyBlobError" });
    }
  }
  class l extends r.f {
    constructor({ hash: e, size: t }) {
      super(`Versioned hash "${e}" size is invalid.`, {
        metaMessages: ["Expected: 32", `Received: ${t}`],
        name: "InvalidVersionedHashSizeError",
      });
    }
  }
  class u extends r.f {
    constructor({ hash: e, version: t }) {
      super(`Versioned hash "${e}" version is invalid.`, {
        metaMessages: ["Expected: 1", `Received: ${t}`],
        name: "InvalidVersionedHashVersionError",
      });
    }
  }
  e.s(["G", 0, a, "h", 0, c, "S", 0, l, "t", 0, u], 995688);
  var d = e.i(811369),
    h = e.i(612735);
  e.s(
    [
      "f",
      0,
      function (e) {
        let { data: n, kzg: o, to: r } = e,
          l =
            e.blobs ??
            (function (e) {
              let f = e.to ?? ("string" == typeof e.data ? "hex" : "bytes"),
                s = "string" == typeof e.data ? (0, t.X)(e.data) : e.data,
                n = (0, h.f)(s);
              if (!n) throw new c();
              if (n > 761855) throw new a({ maxSize: 761855, size: n });
              let o = [],
                r = !0,
                l = 0;
              for (; r; ) {
                let e = (0, d.f)(new Uint8Array(131072)),
                  t = 0;
                for (; t < 4096; ) {
                  let i = s.slice(l, l + 31);
                  if ((e.pushByte(0), e.pushBytes(i), i.length < 31)) {
                    (e.pushByte(128), (r = !1));
                    break;
                  }
                  (t++, (l += 31));
                }
                o.push(e);
              }
              return "bytes" === f
                ? o.map((e) => e.bytes)
                : o.map((e) => (0, i.v)(e.bytes));
            })({ data: n, to: r }),
          u = e.commitments ?? f({ blobs: l, kzg: o, to: r }),
          b = e.proofs ?? s({ blobs: l, commitments: u, kzg: o, to: r }),
          p = [];
        for (let e = 0; e < l.length; e++)
          p.push({ blob: l[e], commitment: u[e], proof: b[e] });
        return p;
      },
    ],
    406638,
  );
  var b = e.i(534446);
  e.s(
    [
      "f",
      0,
      function (e) {
        if (e.type) return e.type;
        if (void 0 !== e.authorizationList) return "eip7702";
        if (
          void 0 !== e.blobs ||
          void 0 !== e.blobVersionedHashes ||
          void 0 !== e.maxFeePerBlobGas ||
          void 0 !== e.sidecars
        )
          return "eip4844";
        if (void 0 !== e.maxFeePerGas || void 0 !== e.maxPriorityFeePerGas)
          return "eip1559";
        if (void 0 !== e.gasPrice)
          return void 0 !== e.accessList ? "eip2930" : "legacy";
        throw new b.v({ transaction: e });
      },
    ],
    23094,
  );
};
