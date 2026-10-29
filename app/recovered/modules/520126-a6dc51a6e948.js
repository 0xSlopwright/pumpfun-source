// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(753887),
    r = e.i(761321),
    i = e.i(575281),
    n = e.i(959719),
    a = e.i(971370),
    l = e.i(655397);
  new a.PublicKey("33MxwC33Eqgmon152hBcpEYuXUmf2kaK1P74wVz3ry8k");
  let o = new a.PublicKey("HTVZVEQMBsNanubDPTs3CxDAEGNFQHJY8c1441iy2S5r");
  e.s(
    [
      "S",
      0,
      () => o,
      "c",
      0,
      (e, t) => (0, l.N)(e, t),
      "p",
      0,
      (e, a, l = n.z) =>
        (0, i.h)(
          a,
          (0, r.g)([t.Buffer.from("boost_vault"), e.toBuffer()]),
          !0,
          l,
        ),
      "B",
      0,
      (e, t, i) => {
        try {
          return t ? new a.PublicKey(t) : (0, r.n)(new a.PublicKey(e), i);
        } catch {
          return null;
        }
      },
    ],
    520126,
  );
  let u = {
      ungraduated: {
        solid: "#4ADE80",
        gradient: ["#22C55E", "#4ADE80", "#86EFAC"],
        textClass: "text-gain",
      },
      boost: {
        solid: "#f59e0b",
        gradient: ["#f59e0b", "#fbbf24", "#fcd34d"],
        textClass: "text-boost-gold",
      },
      graduated: {
        solid: "#F7931A",
        gradient: ["#FF8A00", "#F7931A", "#FFC44D"],
        textClass: "text-boost-orange",
      },
    },
    s = (e) => u[e].solid,
    m = (e, t) => {
      let r = e.replace("#", ""),
        i = parseInt(r.slice(0, 2), 16),
        n = parseInt(r.slice(2, 4), 16),
        a = parseInt(r.slice(4, 6), 16);
      return `rgba(${i}, ${n}, ${a}, ${t})`;
    },
    c = (e) =>
      e.toLocaleString(void 0, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  e.s(
    [
      "D",
      0,
      (e, t, r) => `${c(e)} / ${c(t)} ${r}`,
      "j",
      0,
      (e) => u[e].gradient,
      "o",
      0,
      (e) => `${Math.round(e)}%`,
      "A",
      0,
      (e) => m(s(e), 0.16),
      "T",
      0,
      s,
      "L",
      0,
      (e) => u[e].textClass,
      "O",
      0,
      (e, t, r) =>
        "USDC" === r || null === t
          ? `${c(e)} ${r}`
          : `${c(e)} ${r} ($${Math.round(t).toLocaleString(void 0)})`,
      "w",
      0,
      (e, t) => `${c(e)} ${t}`,
      "c",
      0,
      (e) => Math.min(100, Math.max(0, e)),
      "M",
      0,
      m,
    ],
    357171,
  );
};
