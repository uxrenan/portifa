export type SelectedProject = {
  number: string;
  title: string;
  year: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  href: string;
  cursorLabel?: string;
};

// Conteúdo e imagens provisórios. Substitua aqui pelos dados dos cases finais.
export const projects: SelectedProject[] = [
  { number: "01", title: "AVA / Plataforma Educacional", year: "—", category: "Produto digital · Educação", description: "Uma experiência digital voltada à aprendizagem.", image: "/projects/ava.svg", alt: "Composição gráfica provisória do projeto AVA, em tons de verde.", href: "/projetos/ava" },
  { number: "02", title: "Optimiz.ai", year: "—", category: "Produto digital · UX/UI", description: "Estratégia, interface e experiência em um mesmo produto.", image: "/projects/optimiz.svg", alt: "Composição gráfica provisória do projeto Optimiz.ai, em tons claros.", href: "/projetos/optimiz-ai" },
  { number: "03", title: "Website / Client Project", year: "—", category: "Website · Design digital", description: "Uma presença digital construída em torno da experiência.", image: "/projects/website.svg", alt: "Composição gráfica provisória para um website, em tons de azul.", href: "/projetos/website" },
  { number: "04", cursorLabel: "Em breve", title: "Projeto placeholder", year: "—", category: "Projeto em seleção", description: "Um novo trabalho para completar esta seleção.", image: "/projects/placeholder.svg", alt: "Composição gráfica neutra reservada para o quarto projeto.", href: "/projetos/placeholder" },
];
