"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { Sticker } from "@/components/Sticker/Sticker";
import { MiniRenanAvatar } from "@/components/MiniRenan/MiniRenanAvatar";
import { useI18n } from "@/i18n/I18nProvider";
import "./footer.css";

// A band of stickers along the bottom edge, overlapping and running off it. x and y place each one in the band
// (percentages), w sets its width in --unit; the back row comes first, the front row (higher z) sits lower.
const stickers = [
 { kind: "ui", rotation: -8, x: -4, y: 10, w: 24, z: 1 },
 { kind: "place", rotation: 6, x: 12, y: 2, w: 19, z: 2 },
 { kind: "dog", rotation: -5, x: 33, y: 46, w: 22, z: 4 },
 { kind: "palette", rotation: 9, x: 43, y: 0, w: 18, z: 2 },
 { kind: "football", rotation: -10, x: 56, y: 10, w: 20, z: 1 },
 { kind: "labz", rotation: 5, x: 70, y: 4, w: 23, z: 2 },
 { kind: "phone", rotation: -9, x: 87, y: 12, w: 19, z: 1 },
 { kind: "ux", rotation: 10, x: 3, y: 58, w: 17, z: 4 },
 { kind: "mini", rotation: -6, x: 17, y: 52, w: 19, z: 5 },
 { kind: "hello", rotation: 7, x: 27, y: 6, w: 20, z: 1 },
 { kind: "pen", rotation: -12, x: 51, y: 56, w: 18, z: 5 },
 { kind: "pixel", rotation: 14, x: 65, y: 48, w: 11, z: 6 },
 { kind: "mini-labz", rotation: 8, x: 76, y: 58, w: 18, z: 4 },
] as const;

function StickerArt({ kind, hello }: { kind: string; hello: string }) {
 return <svg viewBox="0 0 220 220" fill="none" aria-hidden="true">
  {kind === "place" ? <><rect x="18" y="10" width="184" height="200" rx="14" fill="#eceee8" /><rect x="30" y="22" width="160" height="140" rx="6" fill="#c9d3ff" /><circle cx="64" cy="56" r="15" fill="#e9bb3f" /><path d="M126 66l60-18v38Z" fill="#f2f3f0" opacity=".7" /><path d="M30 130q20-10 40 0t40 0 40 0 40 0v32H30Z" fill="#3f5fff" /><path d="M30 146q20-9 40 0t40 0 40 0 40 0" stroke="#eceee8" strokeWidth="3" /><path d="M66 136h86l-12-14h-62Z" fill="#242623" /><path d="M98 122l4-62h14l4 62Z" fill="#f2f3f0" /><path d="M100 102h18l1 13h-20ZM101.5 76h15l.7 11h-16.4Z" fill="#ff6433" /><rect x="97" y="48" width="24" height="14" rx="2" fill="#242623" /><path d="M109 36l14 12h-28Z" fill="#ff6433" /><text x="110" y="192" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="15" letterSpacing="1.5" fill="#242623">RIO GRANDE</text></> :
   kind === "mini" || kind === "mini-labz" ? <><circle cx="110" cy="110" r="100" fill="#eceee8" /><circle cx="110" cy="110" r="90" fill={kind === "mini" ? "#8a63d2" : "#211239"} /><g transform="translate(42 36) scale(.62)"><MiniRenanAvatar state={kind === "mini" ? "happy" : "judging"} variant={kind === "mini" ? "default" : "labz"} /></g></> :
   kind === "palette" ? <><rect x="22" y="14" width="176" height="192" rx="18" fill="#eceee8" /><rect x="34" y="26" width="152" height="112" rx="10" fill="#242623" /><text x="110" y="104" textAnchor="middle" fontFamily="var(--type-display)" fontWeight="700" fontSize="62" fill="#eceee8">Aa</text>{["#3f5fff", "#8a63d2", "#4f7355", "#ff6433", "#e9bb3f"].map((fill, i) => <circle key={fill} cx={48 + i * 31} cy="170" r="13" fill={fill} />)}</> :
   kind === "phone" ? <><rect x="52" y="8" width="116" height="204" rx="26" fill="#eceee8" /><rect x="62" y="18" width="96" height="184" rx="18" fill="#242623" /><rect x="70" y="30" width="80" height="164" rx="12" fill="#e9bb3f" /><rect x="80" y="44" width="60" height="46" rx="6" fill="#3f5fff" /><path d="M80 104h60M80 116h40" stroke="#242623" strokeWidth="7" strokeLinecap="round" /><rect x="80" y="134" width="27" height="27" rx="5" fill="#ff6433" /><rect x="113" y="134" width="27" height="27" rx="5" fill="#8a63d2" /><rect x="80" y="172" width="60" height="12" rx="6" fill="#242623" /></> :
   kind === "hello" ? <><path d="M30 34h160q16 0 16 16v92q0 16-16 16H96l-42 40 6-40H30q-16 0-16-16V50q0-16 16-16Z" fill="#eceee8" /><path d="M36 44h148q12 0 12 12v80q0 12-12 12H92l-30 28 4-28H36q-12 0-12-12V56q0-12 12-12Z" fill="#ff6433" /><text x="110" y="114" textAnchor="middle" fontFamily="var(--type-display)" fontWeight="700" fontSize="46" fill="#242623">{hello}</text></> :
   kind === "pen" ? <><circle cx="110" cy="110" r="100" fill="#eceee8" /><circle cx="110" cy="110" r="90" fill="#4f7355" /><path d="M38 150Q80 50 182 70" stroke="#eceee8" strokeWidth="4" /><path d="M38 150 70 104m112-34-40-22" stroke="#e9bb3f" strokeWidth="2.5" /><rect x="63" y="97" width="14" height="14" fill="#e9bb3f" /><rect x="135" y="41" width="14" height="14" fill="#e9bb3f" /><rect x="31" y="143" width="14" height="14" fill="#eceee8" /><rect x="175" y="63" width="14" height="14" fill="#eceee8" /><path d="M110 92l26 40-12 44h-28l-12-44Z" fill="#242623" /><path d="M110 92v46" stroke="#eceee8" strokeWidth="3" /><circle cx="110" cy="140" r="6" fill="#eceee8" /><rect x="94" y="176" width="32" height="14" rx="3" fill="#242623" /></> :
   kind === "ui" ? <><rect x="12" y="30" width="196" height="156" rx="16" fill="#eceee8" /><rect x="20" y="38" width="180" height="140" rx="10" fill="#3f5fff" /><path d="M20 67h180" stroke="#eceee8" strokeWidth="6" /><circle cx="36" cy="52" r="4" fill="#eceee8" /><circle cx="51" cy="52" r="4" fill="#eceee8" /><rect x="35" y="84" width="46" height="78" rx="5" fill="#eceee8" /><rect x="94" y="84" width="91" height="20" rx="5" fill="#eceee8" /><path d="M96 123h70m-70 16h52" stroke="#eceee8" strokeWidth="7" strokeLinecap="round" /></> :
   kind === "ux" ? <><path d="M110 10 133 28l28-1 8 27 24 16-8 28 8 27-24 17-8 27-28-1-23 18-23-18-28 1-8-27-24-17 8-27-8-28 24-16 8-27 28 1Z" fill="#eceee8" /><circle cx="110" cy="100" r="75" fill="#e9bb3f" /><text x="110" y="119" textAnchor="middle" fontFamily="var(--type-display)" fontWeight="700" fontSize="57" fill="#242623">UX</text><path d="M77 145q33 23 66 0" stroke="#242623" strokeWidth="5" strokeLinecap="round" /></> :
   kind === "dog" ? <><path d="M40 45q35-30 70 0 35-30 70 0l20 82q-20 44-40 15-10 50-50 50t-50-50q-20 29-40-15Z" fill="#eceee8" /><path d="M48 55q30-20 52 2h20q22-22 52-2l19 68q-14 29-28 5-5 53-53 53t-53-53q-14 24-28-5Z" fill="#bd9978" /><path d="M100 57h20l14 103q-24 30-48 0Z" fill="#f2f3f0" /><circle cx="77" cy="107" r="7" fill="#242623" /><circle cx="143" cy="107" r="7" fill="#242623" /><path d="M96 143q14-9 28 0l-14 16Z" fill="#242623" /><path d="M110 159v12" stroke="#242623" strokeWidth="4" /></> :
   kind === "football" ? <><path d="m61 23 29-10q20 20 40 0l29 10 50 39-25 37-26-18v112H62V81L36 99 11 62Z" fill="#eceee8" /><path d="m64 32 25-10q21 19 42 0l25 10 42 32-16 24-32-20v116H70V68L38 88 22 64Z" fill="#3c9dd2" /><path d="M89 42v142m42-142v142" stroke="#171a18" strokeWidth="16" /><path d="M110 42v142" stroke="#eceee8" strokeWidth="7" /></> :
   kind === "pixel" ? <><path d="M42 20h26v26h26v26h26v26h26v26h26v26h-52l26 52h-39l-26-52-39 26Z" fill="#eceee8" /><path d="M52 40h10v16h26v26h26v26h26v26h-38l26 58h-15l-30-60-31 24Z" fill="#ff6433" /></> : <><rect x="13" y="33" width="194" height="150" rx="16" fill="#eceee8" /><rect x="21" y="41" width="178" height="134" rx="9" fill="#4f7355" /><path d="m62 82-22 26 22 26m96-52 22 26-22 26m-36-64-24 80" stroke="#eceee8" strokeWidth="8" strokeLinejoin="round" /><text x="110" y="164" textAnchor="middle" fontFamily="var(--type-accent)" fontSize="16" fill="#eceee8">RENAN LABZ</text></>}
 </svg>;
}

/** Section links lead back to the home of the current language from other pages. */
export function Footer() {
 const { t, sections: base, path } = useI18n();
 const reduced = !!useReducedMotion();
 const footer = useRef<HTMLElement>(null);
 const area = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const measure = () => footer.current?.style.setProperty("--footer-scrollbar", `${innerWidth - document.documentElement.clientWidth}px`);
  const observer = new ResizeObserver(measure); observer.observe(document.documentElement); measure();
  return () => observer.disconnect();
 }, []);
 return <footer ref={footer} className="site-footer">
  <div className="footer-background" aria-hidden="true" />
  <motion.div className="site-container footer-content" initial={reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: reduced ? 0 : .5 }}>
   <div className="footer-top">
    <div className="footer-identity"><a href={base || "#"} aria-label={t.footer.home}>Renan Marques</a><p>{t.footer.role}<br />{t.footer.place}</p></div>
    <div className="footer-socials"><a href="https://www.linkedin.com/in/renansm/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://github.com/uxrenan" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="mailto:renansomarques@gmail.com">{t.footer.email} ↗</a></div>
    <nav aria-label={t.footer.nav} className="footer-links"><a href={`${base}#projetos`}>{t.nav.items.projects}</a><a href={`${base}#servicos`}>{t.nav.items.services}</a><a href={path("sites")}>{t.footer.sites}</a><a href={`${base}#sobre`}>{t.nav.items.about}</a><a href={`${base}#labz`}>{t.nav.items.labz}</a></nav>
   </div>
   <div className="footer-meta"><span>© 2026 Renan Marques</span><span>{t.footer.madeWith}</span></div>
  </motion.div>
  <div ref={area} className="footer-collage">{stickers.map((item, index) => <Sticker key={item.kind} className="footer-sticker" style={{ "--x": `${item.x}%`, "--y": `${item.y}%`, "--w": item.w, zIndex: item.z } as CSSProperties} label={`${t.footer.stickers[item.kind]}.`} rotation={item.rotation} shadow={1.8} delay={.1 + index * .05} constraints={area}><StickerArt kind={item.kind} hello={t.footer.hello} /></Sticker>)}</div>
 </footer>;
}
