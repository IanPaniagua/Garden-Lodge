import type { LearnEntry } from "../content.config";
import { labelAll, monthNamesAll, type I18nText } from "./i18n";

export type Tone = "emerald" | "aubergine" | "indigo" | "teal" | "amber";

// Each category gets a stable jewel tone so a grid shows a mix (brand kit §10).
export const categoryTone: Record<LearnEntry["category"], Tone> = {
  vegetable: "emerald",
  flower: "aubergine",
  fauna: "indigo",
  tool: "teal",
};

export type IconName =
  | "sun"
  | "droplet"
  | "calendar"
  | "sprout"
  | "bolt"
  | "tag"
  | "leaf"
  | "bug";

export interface Badge {
  icon: IconName;
  text: I18nText;
}

const yesNo = (
  value: boolean,
  yes: I18nText,
  no: I18nText,
): I18nText => (value ? yes : no);

const POWERED: I18nText = { en: "Powered", es: "Motorizada", de: "Motorisiert" };
const MANUAL: I18nText = { en: "Manual", es: "Manual", de: "Handbetrieb" };

/** The 3-4 "useful data" badges shown on a card, adapted by category. */
export function cardBadges(entry: LearnEntry): Badge[] {
  switch (entry.category) {
    case "vegetable":
    case "flower":
      return [
        { icon: "sun", text: labelAll("sun", entry.data.sun) },
        { icon: "droplet", text: labelAll("water", entry.data.water) },
        { icon: "calendar", text: monthNamesAll(entry.data.transplantMonths ?? entry.data.sowMonths) },
      ];
    case "fauna":
      return [
        { icon: "leaf", text: labelAll("role", entry.data.role) },
        { icon: "calendar", text: monthNamesAll(entry.data.season) },
      ];
    case "tool":
      return [
        { icon: "bolt", text: yesNo(entry.data.powered, POWERED, MANUAL) },
        { icon: "tag", text: labelAll("ownOrRent", entry.data.ownOrRent) },
      ];
  }
}
