"use client";

import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import "./footer.css";

const stickers = [
 { name: "Interface", rotation: -12, kind: "ui" },
 { name: "UX", rotation: 9, kind: "ux" },
 { name: "Cachorro", rotation: -7, kind: "dog" },
 { name: "Futebol tricolor", rotation: 12, kind: "football" },
 { name: "Renan Labz", rotation: -8, kind: "labz" },
 { name: "Cursor pixelado", rotation: 16, kind: "pixel" },
];

function StickerArt({ kind }: { kind: string }) {
 return <svg viewBox="0 0 220 220" fill="none" aria-hidden="true">
  {kind === "ui" ? <><rect x="12" y="30" width="196" height="156" rx="16" fill="#eceee8" /><rect x="20" y="38" width="180" height="140" rx="10" fill="#3f5fff" /><path d="M20 67h180" stroke="#eceee8" strokeWidth="6" /><circle cx="36" cy="52" r="4" fill="#eceee8" /><circle cx="51" cy="52" r="4" fill="#eceee8" /><rect x="35" y="84" width="46" height="78" rx="5" fill="#eceee8" /><rect x="94" y="84" width="91" height="20" rx="5" fill="#eceee8" /><path d="M96 123h70m-70 16h52" stroke="#eceee8" strokeWidth="7" strokeLinecap="round" /></> :
   kind === "ux" ? <><path d="M110 10 133 28l28-1 8 27 24 16-8 28 8 27-24 17-8 27-28-1-23 18-23-18-28 1-8-27-24-17 8-27-8-28 24-16 8-27 28 1Z" fill="#eceee8" /><circle cx="110" cy="100" r="75" fill="#e9bb3f" /><text x="110" y="119" textAnchor="middle" fontFamily="var(--type-display)" fontWeight="700" fontSize="57" fill="#242623">UX</text><path d="M77 145q33 23 66 0" stroke="#242623" strokeWidth="5" strokeLinecap="round" /></> :
   kind === "dog" ? <><path d="M40 45q35-30 70 0 35-30 70 0l20 82q-20 44-40 15-10 50-50 50t-50-50q-20 29-40-15Z" fill="#eceee8" /><path d="M48 55q30-20 52 2h20q22-22 52-2l19 68q-14 29-28 5-5 53-53 53t-53-53q-14 24-28-5Z" fill="#bd9978" /><path d="M100 57h20l14 103q-24 30-48 0Z" fill="#f2f3f0" /><circle cx="77" cy="107" r="7" fill="#242623" /><circle cx="143" cy="107" r="7" fill="#242623" /><path d="M96 143q14-9 28 0l-14 16Z" fill="#242623" /><path d="M110 159v12" stroke="#242623" strokeWidth="4" /></> :
   kind === "football" ? <><path d="m61 23 29-10q20 20 40 0l29 10 50 39-25 37-26-18v112H62V81L36 99 11 62Z" fill="#eceee8" /><path d="m64 32 25-10q21 19 42 0l25 10 42 32-16 24-32-20v116H70V68L38 88 22 64Z" fill="#3c9dd2" /><path d="M89 42v142m42-142v142" stroke="#171a18" strokeWidth="16" /><path d="M110 42v142" stroke="#eceee8" strokeWidth="7" /></> :
   kind === "pixel" ? <><path d="M42 20h26v26h26v26h26v26h26v26h26v26h-52l26 52h-39l-26-52-39 26Z" fill="#eceee8" /><path d="M52 40h10v16h26v26h26v26h26v26h-38l26 58h-15l-30-60-31 24Z" fill="#ff6433" /></> : <><rect x="13" y="33" width="194" height="150" rx="16" fill="#eceee8" /><rect x="21" y="41" width="178" height="134" rx="9" fill="#4f7355" /><path d="m62 82-22 26 22 26m96-52 22 26-22 26m-36-64-24 80" stroke="#eceee8" strokeWidth="8" strokeLinejoin="round" /><text x="110" y="164" textAnchor="middle" fontFamily="var(--type-accent)" fontSize="16" fill="#eceee8">RENAN LABZ</text></>}
 </svg>;
}

function FooterSticker({ item, index, area, draggable, reduced }: { item: typeof stickers[number]; index: number; area: RefObject<HTMLDivElement | null>; draggable: boolean; reduced: boolean }) {
 const x = useMotionValue(0);
 const y = useMotionValue(0);
 useEffect(() => { if (!draggable) { x.set(0); y.set(0); } }, [draggable, x, y]);
 return <motion.button type="button" className={`footer-sticker footer-sticker--${item.kind}`} aria-label={`${item.name}. ${draggable ? "Use as setas para mover; Home para reposicionar." : "Sticker decorativo."}`} tabIndex={draggable ? 0 : -1}
  style={{ x, y }} drag={draggable} dragConstraints={area} dragElastic={0} dragMomentum={false}
  initial={reduced ? false : { opacity: 0, scale: .96, rotate: item.rotation }} whileInView={{ opacity: 1, scale: 1, rotate: item.rotation }} viewport={{ once: true, amount: .1 }} transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : index * .06 }}
  whileDrag={reduced ? undefined : { scale: 1.03 }}
  onKeyDown={event => {
   if (!draggable) return;
   if (event.key === "Home") { event.preventDefault(); x.set(0); y.set(0); }
   if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
   event.preventDefault();
   const bounds = area.current;
   const element = event.currentTarget;
   if (!bounds) return;
   const dx = event.key === "ArrowLeft" ? -10 : event.key === "ArrowRight" ? 10 : 0;
   const dy = event.key === "ArrowUp" ? -10 : event.key === "ArrowDown" ? 10 : 0;
   if (dx) x.set(Math.max(-element.offsetLeft, Math.min(x.get() + dx, bounds.clientWidth - element.offsetLeft - element.offsetWidth)));
   if (dy) y.set(Math.max(-element.offsetTop, Math.min(y.get() + dy, Math.max(0, bounds.clientHeight - element.offsetTop - element.offsetHeight))));
  }}><StickerArt kind={item.kind} /></motion.button>;
}

export function Footer() {
 const reduced = !!useReducedMotion();
 const footer = useRef<HTMLElement>(null);
 const area = useRef<HTMLDivElement>(null);
 const [draggable, setDraggable] = useState(false);
 useEffect(() => {
  const media = matchMedia("(min-width: 1024px) and (pointer: fine)");
  const update = () => setDraggable(media.matches);
  update(); media.addEventListener("change", update);
  const measure = () => footer.current?.style.setProperty("--footer-scrollbar", `${innerWidth - document.documentElement.clientWidth}px`);
  const observer = new ResizeObserver(measure); observer.observe(document.documentElement); measure();
  return () => { media.removeEventListener("change", update); observer.disconnect(); };
 }, []);
 return <footer ref={footer} className="site-footer">
  <div className="footer-background" aria-hidden="true" />
  <motion.div className="site-container footer-content" initial={reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: reduced ? 0 : .5 }}>
   <div className="footer-top">
    <div className="footer-identity"><a href="#" aria-label="Renan Marques — voltar ao início">Renan Marques</a><p>Product / UX/UI Designer<br />Rio Grande, Brasil</p></div>
    <div className="footer-socials"><a href="https://www.linkedin.com/in/renansm/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://github.com/uxrenan" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="mailto:renansomarques@gmail.com">E-mail ↗</a></div>
    <nav aria-label="Navegação do rodapé" className="footer-links"><a href="#projetos">Projetos</a><a href="#servicos">Serviços</a><a href="#sobre">Sobre</a><a href="#labz">Labz</a></nav>
   </div>
   <div className="footer-meta"><span>© 2026 Renan Marques</span><span>Feito com curiosidade.</span></div>
   <div ref={area} className="footer-collage" data-draggable={draggable}>{stickers.map((item, index) => <FooterSticker key={item.kind} item={item} index={index} area={area} draggable={draggable} reduced={reduced} />)}</div>
  </motion.div>
 </footer>;
}
