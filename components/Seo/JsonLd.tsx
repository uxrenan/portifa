import { LOCATION, PERSON, SITE_NAME, SITE_URL } from "@/config/site";
import { SITE_TYPE_IDS } from "@/config/sites-page";
import { ROUTES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/** Renders schema.org data as a JSON-LD script, with `<` escaped so the payload can never close the tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const url = (path: string) => path === "/" ? SITE_URL : `${SITE_URL}${path}`;

/** Where Renan works from and whom he serves: Rio Grande and the rest of Brazil, remotely. No street address. */
const AREA_SERVED = [
  { "@type": "City", name: LOCATION.city, containedInPlace: { "@type": "State", name: LOCATION.regionName } },
  { "@type": "State", name: LOCATION.regionName },
  { "@type": "Country", name: LOCATION.countryName },
];

function person(locale: Locale) {
  const t = getDictionary(locale).meta;
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSON.name,
    jobTitle: t.jobTitle,
    url: url(ROUTES.home[locale]),
    image: `${SITE_URL}/about/renan-professional.webp`,
    email: `mailto:${PERSON.email}`,
    telephone: PERSON.telephone,
    sameAs: PERSON.sameAs,
    address: { "@type": "PostalAddress", addressLocality: LOCATION.city, addressRegion: LOCATION.region, addressCountry: LOCATION.country },
    knowsAbout: t.knowsAbout,
  };
}

export function homeJsonLd(locale: Locale) {
  const t = getDictionary(locale).meta;
  const home = url(ROUTES.home[locale]);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": WEBSITE_ID, url: SITE_URL, name: SITE_NAME, inLanguage: ["pt-BR", "en"], publisher: { "@id": PERSON_ID } },
      { "@type": "ProfilePage", "@id": `${home}#profile`, url: home, name: t.homeTitle, description: t.homeDescription, isPartOf: { "@id": WEBSITE_ID }, mainEntity: { "@id": PERSON_ID }, inLanguage: locale },
      person(locale),
    ],
  };
}

export function sitesJsonLd(locale: Locale) {
  const dictionary = getDictionary(locale);
  const t = dictionary.meta;
  const page = url(ROUTES.sites[locale]);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${page}#service`,
        name: t.sitesTitle,
        serviceType: t.serviceType,
        description: t.sitesDescription,
        url: page,
        inLanguage: locale,
        provider: { "@id": PERSON_ID },
        areaServed: AREA_SERVED,
        availableChannel: { "@type": "ServiceChannel", serviceUrl: page, availableLanguage: ["pt-BR", "en"] },
        hasOfferCatalog: { "@type": "OfferCatalog", name: t.offerCatalog, itemListElement: dictionary.sitesPage.types.map((type, index) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: type.title, url: `${page}#${SITE_TYPE_IDS[index]}` } })) },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.breadcrumbHome, item: url(ROUTES.home[locale]) },
          { "@type": "ListItem", position: 2, name: t.sitesTitle, item: page },
        ],
      },
      { "@type": "FAQPage", inLanguage: locale, mainEntity: dictionary.sitesPage.faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
      person(locale),
    ],
  };
}
