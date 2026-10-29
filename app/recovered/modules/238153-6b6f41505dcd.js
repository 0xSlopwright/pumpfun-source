// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t;
  let n = {
    lessThanXSeconds: {
      one: "less than a second",
      other: "less than {{count}} seconds",
    },
    xSeconds: { one: "1 second", other: "{{count}} seconds" },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
      one: "less than a minute",
      other: "less than {{count}} minutes",
    },
    xMinutes: { one: "1 minute", other: "{{count}} minutes" },
    aboutXHours: { one: "about 1 hour", other: "about {{count}} hours" },
    xHours: { one: "1 hour", other: "{{count}} hours" },
    xDays: { one: "1 day", other: "{{count}} days" },
    aboutXWeeks: { one: "about 1 week", other: "about {{count}} weeks" },
    xWeeks: { one: "1 week", other: "{{count}} weeks" },
    aboutXMonths: { one: "about 1 month", other: "about {{count}} months" },
    xMonths: { one: "1 month", other: "{{count}} months" },
    aboutXYears: { one: "about 1 year", other: "about {{count}} years" },
    xYears: { one: "1 year", other: "{{count}} years" },
    overXYears: { one: "over 1 year", other: "over {{count}} years" },
    almostXYears: { one: "almost 1 year", other: "almost {{count}} years" },
  };
  function a(e) {
    return (t = {}) => {
      let n = t.width ? String(t.width) : e.defaultWidth;
      return e.formats[n] || e.formats[e.defaultWidth];
    };
  }
  let i = {
      date: a({
        formats: {
          full: "EEEE, MMMM do, y",
          long: "MMMM do, y",
          medium: "MMM d, y",
          short: "MM/dd/yyyy",
        },
        defaultWidth: "full",
      }),
      time: a({
        formats: {
          full: "h:mm:ss a zzzz",
          long: "h:mm:ss a z",
          medium: "h:mm:ss a",
          short: "h:mm a",
        },
        defaultWidth: "full",
      }),
      dateTime: a({
        formats: {
          full: "{{date}} 'at' {{time}}",
          long: "{{date}} 'at' {{time}}",
          medium: "{{date}}, {{time}}",
          short: "{{date}}, {{time}}",
        },
        defaultWidth: "full",
      }),
    },
    r = {
      lastWeek: "'last' eeee 'at' p",
      yesterday: "'yesterday at' p",
      today: "'today at' p",
      tomorrow: "'tomorrow at' p",
      nextWeek: "eeee 'at' p",
      other: "P",
    };
  function o(e) {
    return (t, n) => {
      let a;
      if (
        "formatting" === (n?.context ? String(n.context) : "standalone") &&
        e.formattingValues
      ) {
        let t = e.defaultFormattingWidth || e.defaultWidth,
          i = n?.width ? String(n.width) : t;
        a = e.formattingValues[i] || e.formattingValues[t];
      } else {
        let t = e.defaultWidth,
          i = n?.width ? String(n.width) : e.defaultWidth;
        a = e.values[i] || e.values[t];
      }
      return a[e.argumentCallback ? e.argumentCallback(t) : t];
    };
  }
  let s = {
    ordinalNumber: (e, t) => {
      let n = Number(e),
        a = n % 100;
      if (a > 20 || a < 10)
        switch (a % 10) {
          case 1:
            return n + "st";
          case 2:
            return n + "nd";
          case 3:
            return n + "rd";
        }
      return n + "th";
    },
    era: o({
      values: {
        narrow: ["B", "A"],
        abbreviated: ["BC", "AD"],
        wide: ["Before Christ", "Anno Domini"],
      },
      defaultWidth: "wide",
    }),
    quarter: o({
      values: {
        narrow: ["1", "2", "3", "4"],
        abbreviated: ["Q1", "Q2", "Q3", "Q4"],
        wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"],
      },
      defaultWidth: "wide",
      argumentCallback: (e) => e - 1,
    }),
    month: o({
      values: {
        narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        abbreviated: [
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
        ],
        wide: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      },
      defaultWidth: "wide",
    }),
    day: o({
      values: {
        narrow: ["S", "M", "T", "W", "T", "F", "S"],
        short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        wide: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
      defaultWidth: "wide",
    }),
    dayPeriod: o({
      values: {
        narrow: {
          am: "a",
          pm: "p",
          midnight: "mi",
          noon: "n",
          morning: "morning",
          afternoon: "afternoon",
          evening: "evening",
          night: "night",
        },
        abbreviated: {
          am: "AM",
          pm: "PM",
          midnight: "midnight",
          noon: "noon",
          morning: "morning",
          afternoon: "afternoon",
          evening: "evening",
          night: "night",
        },
        wide: {
          am: "a.m.",
          pm: "p.m.",
          midnight: "midnight",
          noon: "noon",
          morning: "morning",
          afternoon: "afternoon",
          evening: "evening",
          night: "night",
        },
      },
      defaultWidth: "wide",
      formattingValues: {
        narrow: {
          am: "a",
          pm: "p",
          midnight: "mi",
          noon: "n",
          morning: "in the morning",
          afternoon: "in the afternoon",
          evening: "in the evening",
          night: "at night",
        },
        abbreviated: {
          am: "AM",
          pm: "PM",
          midnight: "midnight",
          noon: "noon",
          morning: "in the morning",
          afternoon: "in the afternoon",
          evening: "in the evening",
          night: "at night",
        },
        wide: {
          am: "a.m.",
          pm: "p.m.",
          midnight: "midnight",
          noon: "noon",
          morning: "in the morning",
          afternoon: "in the afternoon",
          evening: "in the evening",
          night: "at night",
        },
      },
      defaultFormattingWidth: "wide",
    }),
  };
  function l(e) {
    return (t, n = {}) => {
      let a,
        i = n.width,
        r = (i && e.matchPatterns[i]) || e.matchPatterns[e.defaultMatchWidth],
        o = t.match(r);
      if (!o) return null;
      let s = o[0],
        l = (i && e.parsePatterns[i]) || e.parsePatterns[e.defaultParseWidth],
        u = Array.isArray(l)
          ? (function (e, t) {
              for (let n = 0; n < e.length; n++) if (t(e[n])) return n;
            })(l, (e) => e.test(s))
          : (function (e, t) {
              for (let n in e)
                if (Object.prototype.hasOwnProperty.call(e, n) && t(e[n]))
                  return n;
            })(l, (e) => e.test(s));
      return (
        (a = e.valueCallback ? e.valueCallback(u) : u),
        {
          value: (a = n.valueCallback ? n.valueCallback(a) : a),
          rest: t.slice(s.length),
        }
      );
    };
  }
  let u = {
    ordinalNumber:
      ((t = {
        matchPattern: /^(\d+)(th|st|nd|rd)?/i,
        parsePattern: /\d+/i,
        valueCallback: (e) => parseInt(e, 10),
      }),
      (e, n = {}) => {
        let a = e.match(t.matchPattern);
        if (!a) return null;
        let i = a[0],
          r = e.match(t.parsePattern);
        if (!r) return null;
        let o = t.valueCallback ? t.valueCallback(r[0]) : r[0];
        return {
          value: (o = n.valueCallback ? n.valueCallback(o) : o),
          rest: e.slice(i.length),
        };
      }),
    era: l({
      matchPatterns: {
        narrow: /^(b|a)/i,
        abbreviated:
          /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
        wide: /^(before christ|before common era|anno domini|common era)/i,
      },
      defaultMatchWidth: "wide",
      parsePatterns: { any: [/^b/i, /^(a|c)/i] },
      defaultParseWidth: "any",
    }),
    quarter: l({
      matchPatterns: {
        narrow: /^[1234]/i,
        abbreviated: /^q[1234]/i,
        wide: /^[1234](th|st|nd|rd)? quarter/i,
      },
      defaultMatchWidth: "wide",
      parsePatterns: { any: [/1/i, /2/i, /3/i, /4/i] },
      defaultParseWidth: "any",
      valueCallback: (e) => e + 1,
    }),
    month: l({
      matchPatterns: {
        narrow: /^[jfmasond]/i,
        abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
        wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
      },
      defaultMatchWidth: "wide",
      parsePatterns: {
        narrow: [
          /^j/i,
          /^f/i,
          /^m/i,
          /^a/i,
          /^m/i,
          /^j/i,
          /^j/i,
          /^a/i,
          /^s/i,
          /^o/i,
          /^n/i,
          /^d/i,
        ],
        any: [
          /^ja/i,
          /^f/i,
          /^mar/i,
          /^ap/i,
          /^may/i,
          /^jun/i,
          /^jul/i,
          /^au/i,
          /^s/i,
          /^o/i,
          /^n/i,
          /^d/i,
        ],
      },
      defaultParseWidth: "any",
    }),
    day: l({
      matchPatterns: {
        narrow: /^[smtwf]/i,
        short: /^(su|mo|tu|we|th|fr|sa)/i,
        abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
        wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
      },
      defaultMatchWidth: "wide",
      parsePatterns: {
        narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
        any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
      },
      defaultParseWidth: "any",
    }),
    dayPeriod: l({
      matchPatterns: {
        narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
        any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
      },
      defaultMatchWidth: "any",
      parsePatterns: {
        any: {
          am: /^a/i,
          pm: /^p/i,
          midnight: /^mi/i,
          noon: /^no/i,
          morning: /morning/i,
          afternoon: /afternoon/i,
          evening: /evening/i,
          night: /night/i,
        },
      },
      defaultParseWidth: "any",
    }),
  };
  e.s(
    [
      "f",
      0,
      {
        code: "en-US",
        formatDistance: (e, t, a) => {
          let i,
            r = n[e];
          if (
            ((i =
              "string" == typeof r
                ? r
                : 1 === t
                  ? r.one
                  : r.other.replace("{{count}}", t.toString())),
            a?.addSuffix)
          )
            if (a.comparison && a.comparison > 0) return "in " + i;
            else return i + " ago";
          return i;
        },
        formatLong: i,
        formatRelative: (e, t, n, a) => r[e],
        localize: s,
        match: u,
        options: { weekStartsOn: 0, firstWeekContainsDate: 1 },
      },
    ],
    238153,
  );
  let d = {};
  e.s(
    [
      "f",
      0,
      function () {
        return d;
      },
    ],
    492421,
  );
};
