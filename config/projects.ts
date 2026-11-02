// Projetos selecionados, na ordem de projects.items nos dicionários (i18n/dictionaries), onde ficam títulos, categorias
// e textos alternativos. Conteúdo e imagens provisórios: as imagens são mockups ilustrativos, só com esqueletos de
// interface (sem dados reais); substitua pelos dados e telas dos cases finais.
export type SelectedProject = { number: string; year: string; image: string; href: string; soon?: boolean };

export const projects: SelectedProject[] = [
  { number: "01", year: "—", image: "/projects/ava.svg", href: "/projetos/ava" },
  { number: "02", year: "—", image: "/projects/optimiz.svg", href: "/projetos/optimiz-ai" },
  { number: "03", year: "—", image: "/projects/website.svg", href: "/projetos/website" },
  { number: "04", year: "—", image: "/projects/placeholder.svg", href: "/projetos/placeholder", soon: true },
];
