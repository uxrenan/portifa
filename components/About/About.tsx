"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ABOUT_PARAGRAPHS, ABOUT_PHOTOS, ABOUT_TITLE } from "@/config/about";
import { PixelConstellation } from "@/components/PixelConstellation/PixelConstellation";
import "./about.css";

const ease = [.22, 1, .36, 1] as const;

/** Renders the **bold** spans of a paragraph from the content config. */
function Emphasis({ text }: { text: string }) {
 return text.split(/(\*\*[^*]+\*\*)/).map((part, index) => part.startsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part);
}

function Arrow() {
 return <svg viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" /></svg>;
}

const MODES = [
 { id: "professional", label: "Profissional", icon: <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M4.5 7h15A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-9A1.5 1.5 0 0 1 4.5 7ZM3 12.5h18" /> },
 { id: "personal", label: "Pessoal", icon: <path d="m12 3.8 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8Z" /> },
] as const;
type Mode = typeof MODES[number]["id"];

/** Two icon-only states over the photo; behaves as a radio group (arrow keys move the choice). */
function PhotoSwitch({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
 const options = useRef<(HTMLButtonElement | null)[]>([]);
 const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const current = MODES.findIndex(item => item.id === mode);
  const next = event.key === "Home" ? 0 : event.key === "End" ? MODES.length - 1 : (current + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + MODES.length) % MODES.length;
  onChange(MODES[next].id);
  options.current[next]?.focus();
 };
 return <div className="about-switch" role="radiogroup" aria-label="Foto: lado profissional ou pessoal" data-mode={mode} onKeyDown={onKeyDown}>
  <span className="about-switch-thumb" aria-hidden="true" />
  {MODES.map((item, index) => <button key={item.id} ref={element => { options.current[index] = element; }} type="button" role="radio" aria-checked={mode === item.id} aria-label={item.label} title={item.label}
   tabIndex={mode === item.id ? 0 : -1} className="about-switch-option" onClick={() => onChange(item.id)}>
   <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{item.icon}</svg>
  </button>)}
 </div>;
}

export function About() {
 const reduced = !!useReducedMotion();
 const [mode, setMode] = useState<Mode>("professional");
 const reveal = (delay = 0) => ({
  initial: reduced ? false as const : { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: .4 },
  transition: { duration: reduced ? 0 : .65, delay: reduced ? 0 : delay, ease },
 });
 const photos = ABOUT_PHOTOS;
 return <section id="sobre" className="about-section" data-photo={!!photos} aria-labelledby="about-heading">
  <div className="site-container about-layout">
   {photos && <motion.figure className="about-photo" initial={reduced ? false : { opacity: 0, scale: 1.03 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .3 }} transition={{ duration: reduced ? 0 : .9, ease }}>
    {/* Both views are absolute layers inside the fixed 3:4 frame, so neither can change the space it takes. */}
    <div className="about-photo-layer" data-active={mode === "professional"} aria-hidden={mode !== "professional"}>
     <Image className="about-photo-image" src={photos.professional.src} alt={photos.professional.alt} width={photos.professional.width} height={photos.professional.height} sizes="(max-width: 767px) 80vw, 38vw" />
    </div>
    <div className="about-photo-layer about-mural" data-active={mode === "personal"} aria-hidden={mode !== "personal"}>
     {photos.personal.map(photo => <span key={photo.src} className="about-mural-tile">
      <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 767px) 80vw, 38vw" style={{ objectPosition: photo.position }} />
     </span>)}
    </div>
    <PhotoSwitch mode={mode} onChange={setMode} />
   </motion.figure>}
   <div className="about-content">
    <motion.span className="about-label" {...reveal(0)}><span className="pixel-marker"><PixelConstellation variant="drift" />SOBRE</span></motion.span>
    <motion.h2 id="about-heading" {...reveal(.06)}>{ABOUT_TITLE}</motion.h2>
    <div className="about-text">{ABOUT_PARAGRAPHS.map((text, index) => <motion.p key={text} {...reveal(.12 + index * .06)}><Emphasis text={text} /></motion.p>)}</div>
    <motion.div className="hero-actions about-actions" {...reveal(.32)}>
     <a className="hero-primary" href="#contato"><span className="hero-cta-label">Vamos conversar</span><span className="hero-cta-icon" aria-hidden="true"><Arrow /><Arrow /></span></a>
    </motion.div>
   </div>
  </div>
 </section>;
}
