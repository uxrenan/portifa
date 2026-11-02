// Fotos da seção Sobre. Os textos e as descrições das fotos ficam em i18n/dictionaries (about).

/** `position` é o ponto do recorte (`object-position`), para enquadrar cada imagem no seu espaço. */
type MuralPhoto = { src: string; position?: string };

// Fotos da seção, numa moldura 3:4 de tamanho fixo: o switch alterna entre as duas vistas sem mudar o espaço ocupado.
// - professional: um retrato, exibido em preto e branco.
// - personal: um mural de 4 fotos coloridas, nesta ordem: horizontal (largura toda), quadrada, quadrada, horizontal.
// O retrato é a foto real de Renan. PROVISÓRIO: o mural ainda usa cenas sem pessoas do acervo picsum.photos
// (Unsplash); substitua pelas fotos reais de Renan.
// Mantenha `null` para mostrar a seção só com o texto.
export const ABOUT_PHOTOS: { professional: { src: string; width: number; height: number }; personal: readonly [MuralPhoto, MuralPhoto, MuralPhoto, MuralPhoto] } | null = {
  professional: { src: "/about/renan-professional.webp", width: 900, height: 1200 },
  personal: [
    { src: "/about/placeholder-mural-1.webp", position: "50% 60%" },
    { src: "/about/placeholder-mural-2.webp", position: "40% 35%" },
    { src: "/about/placeholder-mural-3.webp", position: "60% 50%" },
    { src: "/about/placeholder-mural-4.webp", position: "62% 55%" },
  ],
};
