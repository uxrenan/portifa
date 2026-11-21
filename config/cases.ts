// Estudos de caso: a sequência de painéis de cada case. Os textos (título, contexto, objetivo, papel, frase e textos
// alternativos por `id` de tela) ficam em `cases` nos dicionários (i18n/dictionaries). As telas são capturas reais do
// site publicado, em 2x (public/cases/<case>/).
import type { CaseKey } from "@/i18n/config";

/** One screenshot; width and height are its pixel size, used for the panel's proportions. */
export type CaseShot = { id: string; src: string; width: number; height: number };
export type CasePanel =
  | { kind: "opening" } | { kind: "about" } | { kind: "statement" } | { kind: "end" }
  | { kind: "image"; id: string; shot: CaseShot }
  | { kind: "phones"; id: string; shots: CaseShot[] };
export type CaseStudy = { key: CaseKey; site: string; panels: CasePanel[] };

const shot = (id: string, width: number, height: number): CaseShot => ({ id, src: `/cases/waldemar/${id}.webp`, width, height });

export const CASES: Record<CaseKey, CaseStudy> = {
  waldemar: {
    key: "waldemar",
    site: "https://condominio-waldemar.vercel.app/",
    panels: [
      { kind: "opening" },
      { kind: "about" },
      { kind: "image", id: "hero", shot: shot("hero", 2880, 1800) },
      { kind: "statement" },
      { kind: "image", id: "history", shot: shot("history", 2880, 2021) },
      { kind: "image", id: "routine", shot: shot("routine", 2880, 2660) },
      { kind: "image", id: "spaces", shot: shot("spaces", 2160, 2507) },
      { kind: "phones", id: "mobile", shots: [shot("mobile-1", 780, 1688), shot("mobile-2", 780, 1688), shot("mobile-3", 780, 1688)] },
      { kind: "end" },
    ],
  },
};
