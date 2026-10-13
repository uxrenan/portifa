// Signature font; the main editorial typography remains independent.
export const WORDMARK_FONT = "var(--font-bitcount)";
export const EDITORIAL_FONT = "var(--font-wordmark)";
export const CONTACT_HREF = "https://wa.me/5553991739258";
export const ALWAYS_SHOW_INTRO = true;
export const INTRO_SESSION_KEY = "renan:intro-seen";
export const MOTION_EASE = [0.76, 0, 0.24, 1] as const;
export const INTRO_TIMING = { resolve: 580, travel: 0.78, menuStagger: 0.045 };
export const INTRO_FONTS = [
 { family: "var(--font-editorial)", weight: 500, style: "normal", color: "var(--accent-blue)", duration: 120, reveal: true },
 { family: "var(--font-contrast)", weight: 500, style: "normal", color: "var(--accent-purple)", duration: 120, reveal: false },
 { family: "var(--font-mono)", weight: 400, style: "normal", color: "var(--accent-green)", duration: 130, reveal: false },
 { family: "var(--font-geometric)", weight: 500, style: "normal", color: "var(--accent-blue)", duration: 140, reveal: true },
 { family: "var(--font-condensed)", weight: 500, style: "normal", color: "var(--accent-orange)", duration: 160, reveal: false },
 { family: "var(--font-display)", weight: 800, style: "normal", color: "var(--accent-yellow)", duration: 180, reveal: true },
 { family: "var(--font-expressive)", weight: 600, style: "italic", color: "var(--accent-purple)", duration: 220, reveal: true },
 { family: WORDMARK_FONT, weight: 400, style: "normal", color: "var(--ink)", duration: INTRO_TIMING.resolve, reveal: false },
] as const;
export const NAV_ITEMS = [
 { label: "Projetos", href: "#projetos" },
 { label: "Serviços", href: "#servicos" },
 { label: "Sobre", href: "#sobre" },
 { label: "Labz", href: "#labz" },
 { label: "Contato", href: "#contato" },
] as const;
