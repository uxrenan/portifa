"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { CONTACT_HREF } from "@/config/identity";
import { HERO_COPY, HERO_MOTION, HERO_ASSETS } from "@/config/hero";
import { HeroObject } from "./HeroObject";
import { useHeroEntrance } from "./useHeroEntrance";
import "./hero.css";

export function Hero() {
  const reduced = useReducedMotion();
  const ready = useHeroEntrance(reduced);
  const section = useRef<HTMLElement>(null);
  const slots = useRef<(HTMLSpanElement | null)[]>([]);
  return <main className="hero-frame"><section ref={section} className="hero-poster" data-visible={ready} aria-hidden={!ready} inert={!ready} aria-labelledby="hero-headline">
    <motion.div className="hero-topline" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: reduced ? .12 : .3 }}>
      <span>PRODUCT / UX/UI DESIGNER · BRASIL · 2026</span>
      <span className="hero-status"><i aria-hidden="true" />Disponível para projetos</span>
    </motion.div>
    <div className="hero-composition">
      <h1 id="hero-headline" className="hero-headline" aria-label={HERO_COPY.accessibleHeadline}>
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
      </div>
      <div className="hero-connect">
        <p className="hero-support-copy"><strong>+5 anos transformando ideias em sites, produtos e experiências digitais</strong>{" "}<span>que impactam pessoas — e</span>{" "}<strong>geram resultados.</strong></p>
        <div className="hero-actions">
         <a className="hero-primary" href="#projetos"><span className="hero-cta-label">Ver projetos</span><span className="hero-cta-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" /></svg><svg viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" /></svg></span></a>
         <a className="hero-secondary" href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" aria-label="Vamos conversar pelo WhatsApp, abre em nova aba"><span className="hero-cta-label">Vamos conversar</span><span className="hero-cta-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" /></svg><svg viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" /></svg></span></a>
        </div>
      </div>
    </motion.div>
  </section>
    <motion.a className="hero-explore" href="#projetos" aria-label="Explorar projetos selecionados" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: reduced ? .12 : .35, delay: reduced ? 0 : .65 }}>
      <svg className="hero-explore-ring" viewBox="0 0 88 88" aria-hidden="true">
        <defs><path id="hero-explore-orbit" d="M44 10a34 34 0 1 1 0 68a34 34 0 1 1 0-68" /></defs>
        <text textLength="211" lengthAdjust="spacing"><textPath href="#hero-explore-orbit">VER PROJETOS · CONTINUE EXPLORANDO · </textPath></text>
      </svg>
      <svg className="hero-explore-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" /></svg>
    </motion.a>
  </main>;
}
