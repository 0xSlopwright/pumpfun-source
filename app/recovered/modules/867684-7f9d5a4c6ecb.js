// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(938277),
    r = e.i(526080),
    i = e.i(531345),
    n = e.i(805089),
    a = e.i(737278);
  let l = (e) => e.toString().padStart(2, "0"),
    o = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  e.s([
    "I",
    0,
    (e, t) => (r) => {
      if (!Number.isFinite(r) || r <= 0) return "";
      let i = new Date(1e3 * r);
      if (Number.isNaN(i.getTime())) return "";
      let n = (t
          ? ((e, t) => {
              try {
                let r = new Intl.DateTimeFormat("en-US", {
                    timeZone: t,
                    hourCycle: "h23",
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  }).formatToParts(e),
                  i = (e) => Number(r.find((t) => t.type === e)?.value),
                  n = {
                    year: i("year"),
                    month: i("month") - 1,
                    day: i("day"),
                    hour: i("hour") % 24,
                    minute: i("minute"),
                    second: i("second"),
                  };
                return Object.values(n).every(Number.isFinite) ? n : void 0;
              } catch {
                return;
              }
            })(i, t)
          : void 0) ?? {
          year: i.getFullYear(),
          month: i.getMonth(),
          day: i.getDate(),
          hour: i.getHours(),
          minute: i.getMinutes(),
          second: i.getSeconds(),
        },
        a = l(n.hour),
        u = l(n.minute),
        s = l(n.second),
        m = n.day,
        c = o[n.month] ?? "",
        d = n.year;
      return e < 600
        ? `${a}:${u}:${s}`
        : e < 86400
          ? `${a}:${u}`
          : e < 604800
            ? `${c} ${m} ${a}:${u}`
            : e < 31536e3
              ? `${c} ${m}`
              : `${c} ${d}`;
    },
    "k",
    0,
    ({ createdTimestamp: e, nowMs: t, bufferFraction: r }) => {
      if (!e || !Number.isFinite(e)) return a.a;
      let i = t - e;
      return !Number.isFinite(i) || i <= 0
        ? a.a
        : Math.ceil((Math.floor(i / 1e3) + a.E) / (1 - r));
    },
    "z",
    0,
    (e, r) =>
      Number.isFinite(e)
        ? "marketcap" === r
          ? `$${(0, t.M)(e)}`
          : (0, n.f)({ value: e })
        : "$0",
    "r",
    0,
    (e) => {
      if (!Number.isFinite(e) || e <= 0) return a.u;
      let t = Math.max(e - a.m, 1);
      return Math.min(Math.max(a.u, a.D / t), a.M);
    },
    "i",
    0,
    ({
      historicalPoints: e,
      windowSecs: t,
      latestValue: r,
      nowSec: i,
      bufferFraction: n = a.u,
    }) => {
      let l = Number.isFinite(r) && r > 0;
      if (!l && 0 === e.length) return [];
      let o = [];
      if (l) {
        let a = i - t * (1 - n),
          l = 0;
        for (let t = e.length - 1; t >= 0; t--)
          if (e[t].time >= a) {
            if (++l >= 2) break;
          } else break;
        if (l < 2) {
          let e = Math.min(
            Math.max(i - Math.max(2, Math.floor(0.9 * t)), Math.ceil(a) + 1),
            i - 1,
          );
          o.push({ time: e, value: r });
        }
      }
      for (let t of e) o.push(t);
      if ((o.sort((e, t) => e.time - t.time), l)) {
        let e = o[o.length - 1];
        !e || e.time < i
          ? o.push({ time: i, value: r })
          : (o[o.length - 1] = { time: e.time, value: r });
      }
      return o;
    },
    "b",
    0,
    ({ current: e, trailingValue: t, trailingCandleTimestamp: r, nowMs: n }) =>
      !Number.isFinite(e) || e <= 0 || (0, i.L)({ candleTimestamp: r, now: n })
        ? t
        : e,
    "_",
    0,
    (e, t) => {
      let i = (0, r.B)(e),
        n = e.usd_market_cap ?? 0;
      return n > 0 ? ("marketcap" === t ? n : n / i) : 0;
    },
  ]);
};
