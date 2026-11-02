// Projetos selecionados, na ordem de projects.items nos dicionários (i18n/dictionaries), onde ficam títulos, categorias
// e textos alternativos. Conteúdo e imagens provisórios: as imagens são mockups ilustrativos, só com esqueletos de
// interface (sem dados reais); substitua pelos dados e telas dos cases finais. Exceção: o Waldemar é um site no ar,
// com a página inicial real num mockup de notebook, e o card leva direto a ele (external), sem página própria.
export type SelectedProject = { number: string; year: string; image: string; href: string; soon?: boolean; external?: boolean };

export const projects: SelectedProject[] = [
  { number: "01", year: "—", image: "/projects/ava.svg", href: "/projetos/ava" },
  { number: "02", year: "—", image: "/projects/waldemar.webp", href: "https://condominio-waldemar.vercel.app/", external: true },
  { number: "03", year: "—", image: "/projects/optimiz.svg", href: "/projetos/optimiz-ai" },
  { number: "04", year: "—", image: "/projects/placeholder.svg", href: "/projetos/placeholder", soon: true },
];
