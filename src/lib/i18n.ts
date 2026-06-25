import labelsJson from "../../data/labels.json";

export const LANGS = ["en", "es", "de"] as const;
export type Lang = (typeof LANGS)[number];

// Site-wide default language. Marketing pages are English (owner decision);
// the Learning library is fully trilingual and toggles client-side.
export const DEFAULT_LANG: Lang = "en";

export type I18nText = { en: string; es: string; de: string };

/** Pick the active-language string from an {en,es,de} object. */
export function t(text: I18nText, lang: Lang): string {
  return text[lang] ?? text.en;
}

type LabelGroup = Record<string, I18nText>;

export const labels = labelsJson as {
  sun: LabelGroup;
  water: LabelGroup;
  soil: LabelGroup;
  difficulty: LabelGroup;
  role: LabelGroup;
  ownOrRent: LabelGroup;
  categories: LabelGroup;
  months: { en: string[]; es: string[]; de: string[] };
};

/** Resolve a coded value (e.g. sun:"partial_sun") to its active-language label. */
export function label(
  group: keyof typeof labels,
  code: string,
  lang: Lang,
): string {
  const g = labels[group];
  if (group === "months") return code; // months handled separately
  const entry = (g as LabelGroup)[code];
  return entry ? t(entry, lang) : code;
}

/** Render a list of month numbers (1-12) as short month names in `lang`. */
export function monthNames(monthNums: number[], lang: Lang): string {
  return monthNums.map((m) => labels.months[lang][m - 1]).join(" · ");
}

/** Trilingual version of a coded label, for the client-side language toggle. */
export function labelAll(group: keyof typeof labels, code: string): I18nText {
  const g = labels[group] as LabelGroup;
  const entry = g[code];
  return entry ?? { en: code, es: code, de: code };
}

/** Trilingual rendering of a list of month numbers. */
export function monthNamesAll(monthNums: number[]): I18nText {
  return {
    en: monthNums.map((m) => labels.months.en[m - 1]).join(" · "),
    es: monthNums.map((m) => labels.months.es[m - 1]).join(" · "),
    de: monthNums.map((m) => labels.months.de[m - 1]).join(" · "),
  };
}

export const languageNames: Record<Lang, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
};
