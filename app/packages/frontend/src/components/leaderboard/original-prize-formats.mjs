// Used source-bound formatter/locale helpers only; no captured runtime execution.
import { createNumberFormatter as v0 } from "./prize-number-variants/b6933f856a7f.mjs";
import { createNumberFormatter as v1 } from "./prize-number-variants/f29f27e66af2.mjs";
export { c as useMemoCache } from "react/compiler-runtime";
const numberVariants = new Map([
  ["b6933f856a7fe6205483d9adca13b97117fed3fc3822f1383ed3ba99e512040b", v0],
  ["f29f27e66af25973af60575b0ffea4e03a9fc939855c0ff7d4a8f3c02d448e09", v1],
]);
export const prizeNumberVariants = Object.freeze([
  {
    sha256: "b6933f856a7fe6205483d9adca13b97117fed3fc3822f1383ed3ba99e512040b",
    path: "packages/frontend/src/components/leaderboard/prize-number-variants/b6933f856a7f.mjs",
    source: "evidence/web/objects/994c0030bcc62017.js",
  },
  {
    sha256: "f29f27e66af25973af60575b0ffea4e03a9fc939855c0ff7d4a8f3c02d448e09",
    path: "packages/frontend/src/components/leaderboard/prize-number-variants/f29f27e66af2.mjs",
    source: "evidence/web/objects/7128bd47b219d222.js",
  },
]);
export function createPrizeFormats({ numberVariant, Intl }) {
  const createNumberFormatter = numberVariants.get(numberVariant);
  if (!createNumberFormatter)
    throw new TypeError(
      "Explicit reviewed prize NumberFormat source variant required",
    );
  const numberFormatter = createNumberFormatter({ Intl });
  const canonicalLocale = (() => {
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
      r = new Map(
        Object.entries(t).flatMap(([e, { aliases: t }]) =>
          (t ?? []).map((t) => [t, e]),
        ),
      );
    return (e) => {
      if (!e) return null;
      let n = e.trim().toLowerCase();
      if (!n) return null;
      if (Object.hasOwn(t, n)) return n;
      let a = r.get(n);
      if (a) return a;
      let i = n.split("-", 1)[0];
      return i === n ? null : Object.hasOwn(t, i) ? i : (r.get(i) ?? null);
    };
  })();
  const formatRank = (() => {
    const t = { R: numberFormatter };
    return (e, r) => (0, t.R)(r).format(e);
  })();
  const formatAmount = (() => {
    const t = { R: numberFormatter };
    let r = /^\d+(?:\.\d+)?$/;
    return ({ text: e, locale: l }) => {
      let i = e.trim();
      if (!r.test(i)) return e;
      let a = Number(i);
      return (0, t.R)(l, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2 * !Number.isInteger(a),
      }).format(a);
    };
  })();
  return {
    canonicalLocale,
    formatRank,
    formatAmount,
    findPrize: (e, t) =>
      t < 1 ? null : (e.find((e) => t >= e.rankFrom && t <= e.rankTo) ?? null),
  };
}
