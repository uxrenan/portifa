// Dados do site para SEO (metadados, sitemap, robots e dados estruturados). Use apenas fatos confirmados por Renan:
// sem endereço comercial, horários, avaliações ou preços. Os textos de cada idioma ficam em i18n/dictionaries.

/** Endereço público do site, sem barra no final. NEXT_PUBLIC_SITE_URL permite sobrescrever (ex.: em testes). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://renansm.com").replace(/\/$/, "");

export const SITE_NAME = "Renan Marques";
export const PERSON = {
  name: "Renan Marques",
  email: "renansomarques@gmail.com",
  /** O mesmo número do link de WhatsApp já publicado no site. */
  telephone: "+55 53 99173-9258",
  sameAs: ["https://www.linkedin.com/in/renansm/", "https://github.com/uxrenan"],
} as const;

/** Base de trabalho. Sem endereço público: o atendimento é na região e remoto. */
export const LOCATION = { city: "Rio Grande", region: "RS", regionName: "Rio Grande do Sul", country: "BR", countryName: "Brasil" } as const;
