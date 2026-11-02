// Signature font; the main editorial typography remains independent.
export const WORDMARK_FONT = "var(--font-bitcount)";
export const CONTACT_HREF = "https://wa.me/5553991739258";
/** The same WhatsApp number, as people read it, and the e-mail shown in the contact section. */
export const CONTACT_PHONE = "(53) 99173-9258";
export const CONTACT_EMAIL = "renansomarques@gmail.com";
/** WhatsApp with a ready message (contact.quoteMessage in each language), for budget requests. */
export const quoteHref = (message: string) => `${CONTACT_HREF}?text=${encodeURIComponent(message)}`;
// The intro plays once per browser session; repeat visits open straight on the page (faster first paint).
export const ALWAYS_SHOW_INTRO = false;
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
// Section anchors keep the same ids in every language; labels come from nav.items in the dictionaries.
export const NAV_ITEMS = [
 { key: "projects", href: "#projetos" },
 { key: "services", href: "#servicos" },
 { key: "about", href: "#sobre" },
 { key: "labz", href: "#labz" },
 { key: "contact", href: "#contato" },
] as const;
