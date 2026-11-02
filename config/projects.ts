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

// Conteúdo e imagens provisórios. As imagens são mockups ilustrativos, só com esqueletos de interface (sem dados reais);
// substitua aqui pelos dados e telas dos cases finais.
export const projects: SelectedProject[] = [
  { number: "01", title: "AVA / Plataforma Educacional", year: "—", category: "Produto digital · Educação", description: "Uma experiência digital voltada à aprendizagem.", image: "/projects/ava.svg", alt: "Mockup provisório do AVA: painel de cursos num notebook e num celular, em tons de verde.", href: "/projetos/ava" },
  { number: "02", title: "Optimiz.ai", year: "—", category: "Produto digital · UX/UI", description: "Estratégia, interface e experiência em um mesmo produto.", image: "/projects/optimiz.svg", alt: "Mockup provisório do Optimiz.ai: painel com gráficos e indicadores numa janela de navegador.", href: "/projetos/optimiz-ai" },
  { number: "03", title: "Website / Client Project", year: "—", category: "Website · Design digital", description: "Uma presença digital construída em torno da experiência.", image: "/projects/website.svg", alt: "Mockup provisório de um website institucional no desktop e no celular, em tons de azul.", href: "/projetos/website" },
  { number: "04", cursorLabel: "Em breve", title: "Projeto placeholder", year: "—", category: "Projeto em seleção", description: "Um novo trabalho para completar esta seleção.", image: "/projects/placeholder.svg", alt: "Mockup provisório e neutro de um aplicativo em dois celulares, reservado para o quarto projeto.", href: "/projetos/placeholder" },
];
