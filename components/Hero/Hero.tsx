"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { HERO_COPY, HERO_MOTION, HERO_ASSETS } from "@/config/hero";
import { CONTACT_HREF, EDITORIAL_FONT } from "@/config/identity";
import { HeroObject } from "./HeroObject";
import { useHeroEntrance } from "./useHeroEntrance";
import "./hero.css";

export function Hero() {
  const reduced = useReducedMotion();
  const ready = useHeroEntrance(reduced);
  const section = useRef<HTMLElement>(null);
  const slots = useRef<(HTMLSpanElement | null)[]>([]);
  return <main><section ref={section} className="hero-poster" data-visible={ready} aria-hidden={!ready} inert={!ready} aria-labelledby="hero-headline">
    <motion.div className="hero-topline" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: reduced ? .12 : .3 }}>
      <span>PRODUCT / UX/UI DESIGNER · BRASIL · 2026</span>
    </motion.div>
    <div className="hero-composition">
      <h1 id="hero-headline" className="hero-headline" style={{ fontFamily: EDITORIAL_FONT }} aria-label={HERO_COPY.accessibleHeadline}>
        {HERO_COPY.lines.map((line, index) => <div key={index} className={`hero-line hero-line--${index}`} aria-hidden="true">
          {line.before.map(text => <span key={text} className="hero-word-mask"><motion.span initial={{ y: reduced ? 0 : "110%", opacity: reduced ? 0 : 1 }} animate={ready ? { y: 0, opacity: 1 } : undefined} transition={{ duration: reduced ? .12 : .65, delay: reduced ? 0 : index * HERO_MOTION.lineStagger, ease: HERO_MOTION.ease }}>{text}</motion.span></span>)}
          <span ref={el => { slots.current[index] = el; }} className={`hero-slot hero-slot--${index}`} />
          <span className="hero-word-mask"><motion.span initial={{ y: reduced ? 0 : "110%", opacity: reduced ? 0 : 1 }} animate={ready ? { y: 0, opacity: 1 } : undefined} transition={{ duration: reduced ? .12 : .65, delay: reduced ? 0 : index * HERO_MOTION.lineStagger, ease: HERO_MOTION.ease }}>{line.after}</motion.span></span>
        </div>)}
      </h1>
    </div>
    <div className="hero-object-layer">{HERO_ASSETS.map((asset, index) => <HeroObject key={asset.id} asset={asset} index={index} section={section} slots={slots} ready={ready} reduced={!!reduced} />)}</div>
    <motion.div className="hero-editorial-bottom" initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : reduced ? 0 : 8 }} transition={{ duration: reduced ? .12 : .35, delay: reduced ? 0 : .65 }}>
      <div className="hero-expertise">
        <dl className="hero-coordinates">
          <div><dt><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c5 5 5 11 0 16-5-5-5-11 0-16Z" /><circle cx="17" cy="17" r="3" className="coordinate-dot" /></svg><span>BASE</span></dt><dd>Rio Grande, Brasil</dd></div>
          <div><dt><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18M8 9v11M12 13h5M12 16h3" /></svg><span>FOCO</span></dt><dd>Produto · Interface · Web</dd></div>
          <div><dt><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 6-5 6 5 6m8-12 5 6-5 6M14 4l-4 16" /></svg><span>MODO</span></dt><dd>Design + desenvolvimento + curiosidade</dd></div>
        </dl>
        <p className="hero-coordinate-note">Interfaces com estratégia, clareza e personalidade.</p>
      </div>
      <div className="hero-connect">
        <p>Transformo problemas complexos em interfaces mais claras, estratégicas e fáceis de usar — do conceito à implementação.</p>
        <a className="header-contact" href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" aria-label="Vamos conversar pelo WhatsApp, abre em nova aba">Vamos conversar <span aria-hidden="true">↗</span></a>
      </div>
    </motion.div>
  </section></main>;
}
