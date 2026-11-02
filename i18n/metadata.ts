import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { alternatesFor, OG_LOCALE, type Locale, type RouteKey } from "./config";
import { getDictionary } from "./dictionaries";

const ROBOTS: Metadata["robots"] = { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } };

/** Complete metadata for one page in one language: its own title, description, canonical URL and hreflang alternates. */
export function pageMetadata(locale: Locale, route: RouteKey): Metadata {
  const t = getDictionary(locale).meta;
  const home = route === "home";
  const title = home ? t.homeTitle : `${t.sitesTitle} | ${SITE_NAME}`;
  const description = home ? t.homeDescription : t.sitesDescription;
  const alternates = alternatesFor(locale, route);
  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    robots: ROBOTS,
    alternates,
    openGraph: {
      type: "website", siteName: SITE_NAME, title, description, url: alternates.canonical,
      locale: OG_LOCALE[locale], alternateLocale: Object.entries(OG_LOCALE).filter(([code]) => code !== locale).map(([, value]) => value),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
