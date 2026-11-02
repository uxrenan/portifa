// Conteúdo da seção Sobre. Use apenas fatos confirmados por Renan.

type Photo = { src: string; alt: string };
/** `position` é o ponto do recorte (`object-position`), para enquadrar cada imagem no seu espaço. */
type MuralPhoto = Photo & { position?: string };

// Fotos da seção, numa moldura 3:4 de tamanho fixo: o switch alterna entre as duas vistas sem mudar o espaço ocupado.
// - professional: um retrato, exibido em preto e branco.
// - personal: um mural de 4 fotos coloridas, nesta ordem: horizontal (largura toda), quadrada, quadrada, horizontal.
// O retrato é a foto real de Renan. PROVISÓRIO: o mural ainda usa cenas sem pessoas do acervo picsum.photos
// (Unsplash); substitua pelas fotos reais de Renan.
// Mantenha `null` para mostrar a seção só com o texto.
export const ABOUT_PHOTOS: { professional: Photo & { width: number; height: number }; personal: readonly [MuralPhoto, MuralPhoto, MuralPhoto, MuralPhoto] } | null = {
  professional: { src: "/about/renan-professional.webp", alt: "Renan sorrindo, de óculos e camiseta preta, diante de um céu com nuvens", width: 900, height: 1200 },
  personal: [
    { src: "/about/placeholder-mural-1.webp", alt: "Foto provisória: floresta diante de um lago e montanhas", position: "50% 60%" },
    { src: "/about/placeholder-mural-2.webp", alt: "Foto provisória: flores rosadas contra o céu", position: "40% 35%" },
    { src: "/about/placeholder-mural-3.webp", alt: "Foto provisória: notebook e caderno sobre uma mesa de madeira", position: "60% 50%" },
    { src: "/about/placeholder-mural-4.webp", alt: "Foto provisória: bule de chá e flores amarelas sobre a mesa", position: "62% 55%" },
  ],
};

export const ABOUT_TITLE = "Designer de produto, UX/UI e tecnologia.";

// Trechos entre **asteriscos** aparecem em negrito.
export const ABOUT_PARAGRAPHS = [
  "Atuo conectando **design, tecnologia e pessoas** para transformar problemas em **experiências digitais simples, funcionais e acessíveis**.",
  "Gosto de participar de **todo o processo**: entender o problema, investigar possibilidades, desenhar interfaces e acompanhar as soluções **ganharem vida**.",
  "Fora do trabalho, **exploro ideias**, experimento tecnologias e desenvolvo **projetos próprios**.",
] as const;
