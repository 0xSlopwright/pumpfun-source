// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  t.exports = {
    format: (e, ...t) =>
      e.replace(/%([sdifj])/g, function (...[e, r]) {
        let n = t.shift();
        if ("f" === r) return n.toFixed(6);
        if ("j" === r) return JSON.stringify(n);
        if ("s" !== r || "object" != typeof n) return n.toString();
        {
          let e = n.constructor !== Object ? n.constructor.name : "";
          return `${e} {}`.trim();
        }
      }),
    inspect(e) {
      switch (typeof e) {
        case "string":
          if (e.includes("'")) {
            if (!e.includes('"')) return `"${e}"`;
            else if (!e.includes("`") && !e.includes("${")) return `\`${e}\``;
          }
          return `'${e}'`;
        case "number":
          if (isNaN(e)) return "NaN";
          if (Object.is(e, -0)) return String(e);
          return e;
        case "bigint":
          return `${String(e)}n`;
        case "boolean":
        case "undefined":
          return String(e);
        case "object":
          return "{}";
      }
    },
  };
};
