export const HERO_COPY = {
  role: "Product / UX/UI Designer",
  location: "Brazil · 2026",
  accessibleHeadline: "Olá, Eu sou Renan. Eu crio interfaces que ajudam produtos a crescer.",
  lines: [{ before: ["Olá, Eu sou"], after: "Renan." }, { before: ["Eu crio"], after: "interfaces que ajudam" }, { before: ["produtos"], after: "a crescer." }],
  scroll: "Scroll",
} as const;
export const HERO_MOTION = { afterMenu: 420, lineStagger: 0.14, ease: [0.22, 1, 0.36, 1] as const };
export const HERO_ASSETS = [
  { id: "personal", slot: 0, rotation: -4, offset: 0, label: "Objeto pessoal ilustrado. Use as setas para mover; Home para reposicionar." },
  { id: "ui", slot: 1, rotation: 3, offset: 0, label: "Recorte de interface. Use as setas para mover; Home para reposicionar." },
  { id: "print", slot: 2, rotation: -8, offset: -0.22, label: "Recorte gráfico. Use as setas para mover; Home para reposicionar." },
  { id: "landscape", slot: 2, rotation: 2, offset: 0, label: "Paisagem ilustrada. Use as setas para mover; Home para reposicionar." },
  { id: "flower", slot: 2, rotation: 9, offset: 0.22, label: "Flor ilustrada. Use as setas para mover; Home para reposicionar." },
] as const;
