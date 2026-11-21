// Languages and localized routes. Portuguese is the default and keeps the root URLs; English lives under /en.
export const LOCALES = ["pt-BR", "en"] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = "pt-BR";

/** Every page, by key, with its path in each language. A page missing in a language falls back to that home. */
export const ROUTES = {
  home: { "pt-BR": "/", en: "/en" },
  sites: { "pt-BR": "/criacao-de-sites-rio-grande", en: "/en/website-design" },
  waldemar: { "pt-BR": "/projetos/waldemar", en: "/en/projects/waldemar" },
} as const satisfies Record<string, Record<Locale, string>>;
export type RouteKey = keyof typeof ROUTES;

/** Pages that are project case studies; each has its copy under `cases` in the dictionaries. */
export const CASE_KEYS = ["waldemar"] as const;
export type CaseKey = typeof CASE_KEYS[number];
export const isCase = (route: RouteKey): route is CaseKey => (CASE_KEYS as readonly string[]).includes(route);

export const pathFor = (locale: Locale, route: RouteKey) => ROUTES[route][locale];

/** Prefix for links to the home's sections ("" on the home itself, so they stay in-page anchors). */
export const sectionBase = (locale: Locale, route: RouteKey) => route === "home" ? "" : ROUTES.home[locale];

/** `alternates` for a page's metadata: its canonical URL plus hreflang links to every language and x-default. */
export function alternatesFor(locale: Locale, route: RouteKey) {
  return {
    canonical: ROUTES[route][locale],
    languages: { "pt-BR": ROUTES[route]["pt-BR"], en: ROUTES[route].en, "x-default": ROUTES[route]["pt-BR"] },
  };
}

/** Open Graph locale codes. */
export const OG_LOCALE: Record<Locale, string> = { "pt-BR": "pt_BR", en: "en_US" };
