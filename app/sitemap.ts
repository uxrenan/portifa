import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { LOCALES, ROUTES, type RouteKey } from "@/i18n/config";

const url = (path: string) => path === "/" ? SITE_URL : `${SITE_URL}${path}`;
const PRIORITY: Record<RouteKey, number> = { home: 1, sites: .9 };

// Every page in every language, each listing its translations (hreflang). Project case pages join here once they exist.
export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(ROUTES) as RouteKey[]).flatMap(route => LOCALES.map(locale => ({
    url: url(ROUTES[route][locale]),
    changeFrequency: "monthly" as const,
    priority: PRIORITY[route],
    alternates: { languages: Object.fromEntries(LOCALES.map(code => [code, url(ROUTES[route][code])])) },
  })));
}
