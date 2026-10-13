export const PROJECT_FILTERS = ["Corporativo", "Freelance", "Websites", "Produto"] as const;
export type ProjectCategory = typeof PROJECT_FILTERS[number];

export type SelectedProject = {
  categories: ProjectCategory[];
  number: string;
  title: string;
  year: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  href: string;
};

// Conteúdo e imagens provisórios. Substitua aqui pelos dados dos cases finais.
export const projects: SelectedProject[] = [
  { number: "01", categories: ["Corporativo", "Produto"], title: "AVA / Plataforma Educacional", year: "—", category: "Produto digital · Educação", description: "Uma experiência digital voltada à aprendizagem.", image: "/projects/ava.svg", alt: "Composição gráfica provisória do projeto AVA, em tons de verde.", href: "/projetos/ava" },
  { number: "02", categories: ["Produto"], title: "Optimiz.ai", year: "—", category: "Produto digital · UX/UI", description: "Estratégia, interface e experiência em um mesmo produto.", image: "/projects/optimiz.svg", alt: "Composição gráfica provisória do projeto Optimiz.ai, em tons claros.", href: "/projetos/optimiz-ai" },
  { number: "03", categories: ["Freelance", "Websites"], title: "Website / Client Project", year: "—", category: "Website · Design digital", description: "Uma presença digital construída em torno da experiência.", image: "/projects/website.svg", alt: "Composição gráfica provisória para um website, em tons de azul.", href: "/projetos/website" },
  { number: "04", categories: [], title: "Projeto placeholder", year: "—", category: "Projeto em seleção", description: "Um novo trabalho para completar esta seleção.", image: "/projects/placeholder.svg", alt: "Composição gráfica neutra reservada para o quarto projeto.", href: "/projetos/placeholder" },
];

export const PROJECTS_COPY = {
  label: "Projetos selecionados",
  headline: ["Projetos onde estratégia,", "interface e experiência", "se encontram."],
  description: "Uma seleção de produtos, plataformas e experiências digitais que ajudei a transformar.",
  case: "Ver case",
  all: "Ver todos os projetos",
};
