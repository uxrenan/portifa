// Projetos selecionados, na ordem de projects.items nos dicionários (i18n/dictionaries), onde ficam títulos, categorias
// e textos alternativos. Um projeto com `caseKey` abre o seu estudo de caso (config/cases.ts); os demais ficam
// "Em breve", sem link, até existir material real. As imagens de AVA, Optimiz.ai e do quarto projeto são mockups
// provisórios, só com esqueletos de interface; o Waldemar mostra a página inicial real do site num notebook.
import type { CaseKey } from "@/i18n/config";

export type SelectedProject = { number: string; image: string; caseKey?: CaseKey; soon?: boolean };

export const projects: SelectedProject[] = [
  { number: "01", image: "/projects/ava.svg", soon: true },
  { number: "02", image: "/projects/waldemar.webp", caseKey: "waldemar" },
  { number: "03", image: "/projects/optimiz.svg", soon: true },
  { number: "04", image: "/projects/placeholder.svg", soon: true },
];
