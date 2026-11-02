import type { ReactNode } from "react";
import { Bitcount_Prop_Single, Instrument_Sans, Space_Grotesk, Cormorant_Garamond, Bodoni_Moda, IBM_Plex_Mono, Outfit, Oswald, Syne, Fraunces } from "next/font/google";
import "@/app/globals.css";
import { SmoothScroll } from "@/components/SmoothScroll/SmoothScroll";
import type { Locale } from "@/i18n/config";

const ui = Instrument_Sans({ subsets: ["latin"], weight: "400", variable: "--font-ui" });
const signature = Bitcount_Prop_Single({ subsets: ["latin"], weight: "variable", axes: ["CRSV", "ELSH"], variable: "--font-bitcount", adjustFontFallback: false, fallback: ["monospace"] });
const wordmark = Space_Grotesk({ subsets: ["latin"], weight: "500", variable: "--font-wordmark" });
// Fonts seen only in the intro wordmark sequence: not preloaded, so they never compete with the page's own text.
const editorial = Cormorant_Garamond({ subsets: ["latin"], weight: "500", variable: "--font-editorial", preload: false });
const contrast = Bodoni_Moda({ subsets: ["latin"], weight: "500", variable: "--font-contrast", preload: false });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono", preload: false });
const geometric = Outfit({ subsets: ["latin"], weight: "500", variable: "--font-geometric", preload: false });
const condensed = Oswald({ subsets: ["latin"], weight: "500", variable: "--font-condensed", preload: false });
const display = Syne({ subsets: ["latin"], weight: "800", variable: "--font-display", preload: false });
const expressive = Fraunces({ subsets: ["latin"], weight: "600", style: "italic", variable: "--font-expressive", preload: false });
const FONT_VARIABLES = [ui, signature, wordmark, editorial, contrast, mono, geometric, condensed, display, expressive].map(font => font.variable).join(" ");

/** The <html> document shared by both languages' root layouts; only `lang` changes. */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
 return <html lang={locale} className={FONT_VARIABLES}><body><SmoothScroll />{children}</body></html>;
}
