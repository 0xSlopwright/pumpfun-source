// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(406288);
  let r = /\b(PSA|BGS|CGC|SGC|TAG|ACE|ARS)\s*(\d{1,2}(?:\.\d)?)\b/i,
    n = /#\s*([A-Z0-9-]+)/i,
    i = /^\s*((?:19|20)\d{2})\b/,
    l = /^([A-Za-z][A-Za-z ]{1,20})\/(?=[A-Za-z0-9])/,
    a = /\s*\([^)]*$/,
    u = /[\s/·,:;-]+$/,
    s = (e) => e.replace(a, "").replace(u, "").trim(),
    o = (e) => {
      let t = e.replace(/\s+/g, " ").trim(),
        a = t.match(r),
        u = a ? `${(a[1] ?? "").toUpperCase()} ${a[2] ?? ""}` : null;
      if (t.includes("·")) {
        let [e = t, ...n] = t
            .split("·")
            .map((e) => e.trim())
            .filter(Boolean)
            .filter((e) => !r.test(e)),
          i = n.length > 0 ? c(n.join(" · ")) : null;
        return { name: d(s(e) || e), set: i, grade: u };
      }
      let o = t.match(i)?.[1] ?? null,
        m = t.match(n),
        f = m ? `#${m[1]}` : null,
        g = m ? t.slice((m.index ?? 0) + m[0].length) : t.replace(i, ""),
        p = a ? g.search(r) : -1,
        h = (p >= 0 ? g.slice(0, p) : g).trim(),
        b = p >= 0 && a ? g.slice(p + a[0].length).trim() : "",
        v = h.match(l)?.[1] ?? null,
        y = v ? h.slice(v.length + 1).trim() : h,
        w = s(y) || y,
        C = [o, v ? d(v) : null, b ? c(b) : null, f].filter(
          (e) => null !== e && "" !== e,
        );
      return {
        name: d(w || t),
        set: C.length > 0 ? C.join(" · ") : null,
        grade: u,
      };
    },
    c = (e) =>
      d(e.replace(/\|.*$/, "").trim())
        .replace(/\s+pok[eé]mon$/i, "")
        .replace(/\bpok[eé]mon\b/i, "Pokémon")
        .replace(/\s+#/, " · #")
        .trim(),
    d = (e) =>
      e !== e.toUpperCase()
        ? e
        : e
            .toLowerCase()
            .replace(/(^|[\s/(-])([a-z])/g, (e, t, r) => t + r.toUpperCase())
            .replace(/\b(Ex|Gx|Vmax|Vstar|V|Xy|Sm|Sv|Bw|Dp|Tcg)\b/g, (e) =>
              e.toUpperCase(),
            );
  e.s(
    [
      "N",
      0,
      ({ set: e, serial: t, year: r }) => {
        let n = [
          e?.trim() ? c(e) : r && r > 0 ? String(r) : null,
          t?.trim() ? `#${t.trim()}` : null,
        ].filter((e) => null !== e);
        return n.length > 0 ? n.join(" · ") : null;
      },
      "O",
      0,
      o,
    ],
    444158,
  );
  let m = (e) => (void 0 === e ? {} : { provider: e });
  e.s(
    [
      "v",
      0,
      (e) => ({
        nftAddress: e.nftAddress,
        cardName: e.name,
        itemName: null,
        category: null,
        set: null,
        year: null,
        serial: null,
        grade: e.grade ?? null,
        gradingCompany: e.gradingCompany ?? null,
        certNumber: null,
        insuredValueUsd: e.priceUsd,
        isHorizontal: !1,
        setUrl: null,
        frontImage: e.image ?? null,
        thumbImage: e.image ?? null,
        backImage: null,
        lastTransferredAtMs: null,
        isCore: !0,
      }),
      "B",
      0,
      (e, t) => ({
        nftAddress: e.nftAddress,
        name: e.name || null,
        image: e.detailImage ?? e.pocketImage,
        priceUsd: e.priceUsd,
        grade: e.grade,
        gradingCompany: e.gradingCompany,
        ...(void 0 === t ? {} : { rarity: t }),
        ...(void 0 === e.provider ? {} : { provider: e.provider }),
      }),
      "A",
      0,
      (e) => ({
        nftAddress: e.nftAddress,
        name: e.name,
        image: e.image,
        priceUsd: e.markUsd,
        grade: e.grade,
        ...m((0, t.W)(e.provider) ?? void 0),
      }),
      "t",
      0,
      (e) => ({
        nftAddress: e.nftAddress,
        name: e.name,
        image: e.image,
        priceUsd: e.marketValueUsd,
        grade: e.grade,
      }),
      "_",
      0,
      (e, t, r) => {
        let n = o(e.name);
        return {
          nftAddress: e.nftAddress,
          name: n.name || e.name,
          image: e.image,
          priceUsd: e.priceUsd > 0 ? e.priceUsd : null,
          rarity: e.rarity,
          grade: n.grade,
          pack: { packType: t, relation: "inside" },
          ...m(r),
        };
      },
      "m",
      0,
      (e, t, r) => {
        let n = o(e.name);
        return {
          nftAddress: e.nftAddress,
          name: n.name || e.name,
          image: e.image,
          priceUsd: e.priceUsd > 0 ? e.priceUsd : null,
          rarity: "epic",
          grade: n.grade,
          pack: { packType: t, relation: "pulled" },
          ...m(r),
        };
      },
      "G",
      0,
      (e, t) => (e?.rarity === void 0 ? (t ?? null) : e.rarity),
    ],
    338664,
  );
};
