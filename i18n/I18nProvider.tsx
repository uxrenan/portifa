"use client";

import { createContext, useContext, type ReactNode } from "react";
import { pathFor, sectionBase, type Locale, type RouteKey } from "./config";
import type { Dictionary } from "./dictionaries";

type I18n = {
  locale: Locale;
  /** The page being shown, so the language selector can switch to its equivalent. */
  route: RouteKey;
  t: Dictionary;
  /** Prefix for links to the home's sections from this page. */
  sections: string;
  path: (route: RouteKey) => string;
};

const I18nContext = createContext<I18n | null>(null);

/** Set by each page with its locale and dictionary; only the active language's text is sent to the browser. */
export function I18nProvider({ locale, route, dictionary, children }: { locale: Locale; route: RouteKey; dictionary: Dictionary; children: ReactNode }) {
  const value: I18n = { locale, route, t: dictionary, sections: sectionBase(locale, route), path: key => pathFor(locale, key) };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}

/** Fills {placeholders} in a dictionary string. */
export const format = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
