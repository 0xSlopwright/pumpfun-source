// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = {
      en: { label: "English", englishLabel: "English", flag: "🇺🇸" },
      zh: { label: "中文", englishLabel: "Chinese (simplified)", flag: "🇨🇳" },
      fr: { label: "Français", englishLabel: "French (Europe)", flag: "🇫🇷" },
      de: { label: "Deutsch", englishLabel: "German", flag: "🇩🇪" },
      ru: { label: "Русский", englishLabel: "Russian", flag: "🇷🇺" },
      es: {
        label: "Español",
        englishLabel: "Spanish (Latin America)",
        flag: "🇪🇸",
      },
      pt: {
        label: "Português",
        englishLabel: "Portuguese (Brazil)",
        flag: "🇧🇷",
      },
      tr: { label: "Türkçe", englishLabel: "Turkish", flag: "🇹🇷" },
      ar: { label: "العربية", englishLabel: "Arabic", flag: "🇸🇦" },
      it: { label: "Italiano", englishLabel: "Italian", flag: "🇮🇹" },
      vi: { label: "Tiếng Việt", englishLabel: "Vietnamese", flag: "🇻🇳" },
      ko: { label: "한국어", englishLabel: "Korean", flag: "🇰🇷" },
      uk: { label: "Українська", englishLabel: "Ukrainian", flag: "🇺🇦" },
      th: { label: "ไทย", englishLabel: "Thai", flag: "🇹🇭" },
      he: { label: "עברית", englishLabel: "Hebrew", flag: "🇮🇱" },
      pl: { label: "Polski", englishLabel: "Polish", flag: "🇵🇱" },
      nl: { label: "Nederlands", englishLabel: "Dutch", flag: "🇳🇱" },
      ro: { label: "Română", englishLabel: "Romanian", flag: "🇷🇴" },
      cs: { label: "Čeština", englishLabel: "Czech", flag: "🇨🇿" },
      fa: { label: "فارسی", englishLabel: "Persian", flag: "🇮🇷" },
      el: { label: "Ελληνικά", englishLabel: "Greek", flag: "🇬🇷" },
      ja: { label: "日本語", englishLabel: "Japanese", flag: "🇯🇵" },
      hu: { label: "Magyar", englishLabel: "Hungarian", flag: "🇭🇺" },
      bg: { label: "Български", englishLabel: "Bulgarian", flag: "🇧🇬" },
      sk: { label: "Slovenčina", englishLabel: "Slovak", flag: "🇸🇰" },
      sv: { label: "Svenska", englishLabel: "Swedish", flag: "🇸🇪" },
      hr: { label: "Hrvatski", englishLabel: "Croatian", flag: "🇭🇷" },
      fi: { label: "Suomi", englishLabel: "Finnish", flag: "🇫🇮" },
      nb: {
        label: "Norsk",
        englishLabel: "Norwegian (Bokmål)",
        flag: "🇳🇴",
        aliases: ["no"],
      },
      da: { label: "Dansk", englishLabel: "Danish", flag: "🇩🇰" },
      sl: { label: "Slovenščina", englishLabel: "Slovenian", flag: "🇸🇮" },
      sr: { label: "Српски", englishLabel: "Serbian", flag: "🇷🇸" },
      lt: { label: "Lietuvių", englishLabel: "Lithuanian", flag: "🇱🇹" },
      lv: { label: "Latviešu", englishLabel: "Latvian", flag: "🇱🇻" },
      et: { label: "Eesti", englishLabel: "Estonian", flag: "🇪🇪" },
    },
    n = Object.keys(t),
    r = new Map(
      Object.entries(t).flatMap(([e, { aliases: t }]) =>
        (t ?? []).map((t) => [t, e]),
      ),
    );
  e.s([
    "T",
    0,
    "en",
    "L",
    0,
    t,
    "O",
    0,
    n,
    "v",
    0,
    (e) => {
      if (!e) return null;
      let n = e.trim().toLowerCase();
      if (!n) return null;
      if (Object.hasOwn(t, n)) return n;
      let a = r.get(n);
      if (a) return a;
      let i = n.split("-", 1)[0];
      return i === n ? null : Object.hasOwn(t, i) ? i : (r.get(i) ?? null);
    },
  ]);
};
