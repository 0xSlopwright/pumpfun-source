// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  t.s([
    "f",
    0,
    {
      getSpacingStyles: (t, e) =>
        Array.isArray(t)
          ? t[e]
            ? `var(--wui-spacing-${t[e]})`
            : void 0
          : "string" == typeof t
            ? `var(--wui-spacing-${t})`
            : void 0,
      getFormattedDate: (t) =>
        new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
        }).format(t),
      getHostName(t) {
        try {
          return new URL(t).hostname;
        } catch (t) {
          return "";
        }
      },
      getTruncateString: ({
        string: t,
        charsStart: e,
        charsEnd: i,
        truncate: a,
      }) =>
        t.length <= e + i
          ? t
          : "end" === a
            ? `${t.substring(0, e)}...`
            : "start" === a
              ? `...${t.substring(t.length - i)}`
              : `${t.substring(0, Math.floor(e))}...${t.substring(t.length - Math.floor(i))}`,
      generateAvatarColors(t) {
        let e = t
            .toLowerCase()
            .replace(/^0x/iu, "")
            .replace(/[^a-f0-9]/gu, "")
            .substring(0, 6)
            .padEnd(6, "0"),
          i = this.hexToRgb(e),
          a = getComputedStyle(document.documentElement).getPropertyValue(
            "--w3m-border-radius-master",
          ),
          s = 100 - 3 * Number(a?.replace("px", "")),
          r = `${s}% ${s}% at 65% 40%`,
          o = [];
        for (let t = 0; t < 5; t += 1) {
          let e = this.tintColor(i, 0.15 * t);
          o.push(`rgb(${e[0]}, ${e[1]}, ${e[2]})`);
        }
        return `
    --local-color-1: ${o[0]};
    --local-color-2: ${o[1]};
    --local-color-3: ${o[2]};
    --local-color-4: ${o[3]};
    --local-color-5: ${o[4]};
    --local-radial-circle: ${r}
   `;
      },
      hexToRgb(t) {
        let e = parseInt(t, 16);
        return [(e >> 16) & 255, (e >> 8) & 255, 255 & e];
      },
      tintColor(t, e) {
        let [i, a, s] = t;
        return [
          Math.round(i + (255 - i) * e),
          Math.round(a + (255 - a) * e),
          Math.round(s + (255 - s) * e),
        ];
      },
      isNumber: (t) => /^[0-9]+$/u.test(t),
      getColorTheme: (t) =>
        t
          ? t
          : "u" > typeof window && window.matchMedia
            ? window.matchMedia("(prefers-color-scheme: dark)")?.matches
              ? "dark"
              : "light"
            : "dark",
      splitBalance(t) {
        let e = t.split(".");
        return 2 === e.length ? [e[0], e[1]] : ["0", "00"];
      },
      roundNumber: (t, e, i) =>
        t.toString().length >= e ? Number(t).toFixed(i) : t,
      formatNumberToLocalString: (t, e = 2) =>
        void 0 === t
          ? "0.00"
          : "number" == typeof t
            ? t.toLocaleString("en-US", {
                maximumFractionDigits: e,
                minimumFractionDigits: e,
              })
            : parseFloat(t).toLocaleString("en-US", {
                maximumFractionDigits: e,
                minimumFractionDigits: e,
              }),
    },
  ]);
};
