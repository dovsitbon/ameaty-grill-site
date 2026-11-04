import site from "@/data/site.json";
import calendar from "@/data/dates.json";
import formulasData from "@/data/formules.json";
import menuData from "@/data/menu.json";
import type { Dict } from "@/lib/i18n";
import { intlLocale, type Locale } from "@/lib/locales";

export type FormulaId = "live" | "table" | "signature";
export type IncludeId = keyof Dict["formulas"]["includes"];
export type Formula = { id: FormulaId; from: number; minGuests: number; image: string; includes: IncludeId[] };
export const formulas = formulasData.formulas as Formula[];
export const bar = formulasData.bar as { from: number; minGuests: number; image: string; includes: IncludeId[] };
export const pricesConfirmed = formulasData.pricesConfirmed;

export type MenuSectionId = "meats" | "starters" | "sides";
export type MenuItemId = keyof Dict["menu"]["items"];
export const menuSections = menuData.sections as { id: MenuSectionId; items: MenuItemId[] }[];

export const TYPES = ["friends", "birthday", "sheva", "barmitzvah", "party", "corporate", "other"] as const;
export const FORMULA_CHOICES = ["live", "table", "both"] as const;
export const YESNO = ["yes", "no"] as const;
export type EventType = (typeof TYPES)[number];
export type FormulaChoice = (typeof FORMULA_CHOICES)[number];
export type YesNo = (typeof YESNO)[number];

export const takenDates = new Set<string>(calendar.taken as string[]);

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const shekels = (n: number, lang: Locale) => new Intl.NumberFormat(intlLocale[lang], { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);

/** Date du jour au format AAAA-MM-JJ, en heure d'Israël. */
export function isoDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function formatDay(iso: string, lang: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[lang], { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

const colon = (lang: Locale) => (lang === "fr" ? " :" : ":");
const join = (blocks: string[][]) => blocks.map((b) => b.filter(Boolean).join("\n")).filter(Boolean).join("\n\n");

export type QuoteRequest = {
  type: EventType;
  date: string;
  time: string;
  place: string;
  guests: string;
  formula: FormulaChoice | "";
  bar: YesNo | "";
  kashrut: string;
  budget: string;
  name: string;
  phone: string;
  message: string;
};

/** Récapitulatif de demande de devis envoyé sur WhatsApp, dans la langue du visiteur. */
export function quoteMessage(q: QuoteRequest, lang: Locale, d: Dict) {
  const m = d.quote.message;
  const f = d.quote.fields;
  const c = colon(lang);
  const line = (label: string, value: string) => (value ? `${label}${c} ${value}` : "");
  return join([
    [`*${m.title}*`],
    [line(m.type, f.types[q.type]), line(m.date, q.date ? formatDay(q.date, lang) : ""), line(m.time, q.time), line(m.place, q.place), line(m.guests, q.guests)],
    [line(m.formula, q.formula ? f.formulas[q.formula] : ""), line(m.bar, q.bar ? f.yesno[q.bar] : ""), line(m.kashrut, q.kashrut), line(m.budget, q.budget)],
    [line(m.name, q.name), line(m.phone, q.phone), line(m.notes, q.message)],
    [m.closing],
  ]);
}
