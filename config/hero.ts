// Estrutura do Hero. Os textos (headline, coordenadas, descrições dos adesivos) ficam em i18n/dictionaries (hero).
export const HERO_MOTION = { afterMenu: 420, lineStagger: 0.14, ease: [0.22, 1, 0.36, 1] as const };
export const HERO_ASSETS = [
  { id: "personal", slot: 0, rotation: -4, offset: 0 },
  { id: "ui", slot: 1, rotation: 3, offset: 0 },
  { id: "print", slot: 2, rotation: -8, offset: -0.22 },
  { id: "landscape", slot: 2, rotation: 2, offset: 0 },
  { id: "flower", slot: 2, rotation: 9, offset: 0.22 },
] as const;
