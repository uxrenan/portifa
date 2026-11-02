import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/config/site";
import type { Locale, RouteKey } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// Social share image (Open Graph / Twitter), drawn in the site's own vocabulary: paper background, ink type and a row of
// pixels in the intro's name palette.
export const SHARE_SIZE = { width: 1200, height: 630 };
const PALETTE = ["#3F5FFF", "#8A63D2", "#4F7355", "#FF6433", "#E9BB3F"];

/** The share image of one page in one language. */
export function shareImage(locale: Locale, route: RouteKey) {
  const t = getDictionary(locale).meta;
  const [eyebrow, title] = route === "home" ? [t.shareHomeEyebrow, t.shareHomeTitle] : [t.shareSitesEyebrow, t.shareSitesTitle];
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#f2f3f0", color: "#242623" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {PALETTE.map(color => <div key={color} style={{ width: 18, height: 18, background: color }} />)}
        <div style={{ marginLeft: 18, fontSize: 26, letterSpacing: 2, textTransform: "uppercase", color: "#62675f" }}>{eyebrow}</div>
      </div>
      <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05, letterSpacing: -3, fontWeight: 600, maxWidth: 980 }}>{title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#62675f" }}>
        <div style={{ display: "flex", color: "#242623", fontWeight: 600 }}>{SITE_NAME}</div>
        <div style={{ display: "flex" }}>{t.shareFooter}</div>
      </div>
    </div>,
    SHARE_SIZE,
  );
}
