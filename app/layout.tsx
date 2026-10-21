import type { Metadata } from "next";
import { Bitcount_Prop_Single, Instrument_Sans, Space_Grotesk, Cormorant_Garamond, Bodoni_Moda, IBM_Plex_Mono, Outfit, Oswald, Syne, Fraunces } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll/SmoothScroll";

const ui = Instrument_Sans({ subsets: ["latin"], weight: "400", variable: "--font-ui" });
const signature = Bitcount_Prop_Single({ subsets: ["latin"], weight: "variable", axes: ["CRSV", "ELSH"], variable: "--font-bitcount", adjustFontFallback: false, fallback: ["monospace"] });
const wordmark = Space_Grotesk({ subsets: ["latin"], weight: "500", variable: "--font-wordmark" });
const editorial = Cormorant_Garamond({ subsets: ["latin"], weight: "500", variable: "--font-editorial" });
const contrast = Bodoni_Moda({ subsets: ["latin"], weight: "500", variable: "--font-contrast" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono" });
const geometric = Outfit({ subsets: ["latin"], weight: "500", variable: "--font-geometric" });
const condensed = Oswald({ subsets: ["latin"], weight: "500", variable: "--font-condensed" });
const display = Syne({ subsets: ["latin"], weight: "800", variable: "--font-display" });
const expressive = Fraunces({ subsets: ["latin"], weight: "600", style: "italic", variable: "--font-expressive" });

export const metadata: Metadata = { title: "Renan Marques — Product / UX/UI Designer", description: "Portfólio de Renan Marques. Product e UX/UI Design." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="pt-BR" className={[ui, signature, wordmark, editorial, contrast, mono, geometric, condensed, display, expressive].map(font => font.variable).join(" ")}><body><SmoothScroll />{children}</body></html>;
}
