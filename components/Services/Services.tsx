"use client";
import { StructuralGrid } from "@/components/StructuralGrid/StructuralGrid";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { services } from "@/config/services";
import "./services.css";


function Service({ service, compact, onHover, onFocus }: { service: typeof services[number]; compact: boolean; onHover: (active: boolean) => void; onFocus: (active: boolean) => void }) {
  const reduced = !!useReducedMotion();
  const [open, setOpen] = useState(false);

  return <motion.article className="service-row" data-open={open} tabIndex={compact ? undefined : 0}
    aria-labelledby={`service-title-${service.number}`}
    initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: .15 }} transition={{ duration: reduced ? 0 : .6, ease: [.22, 1, .36, 1] }}
    onPointerEnter={event => { if (event.pointerType === "mouse") onHover(true); }}
    onPointerLeave={() => onHover(false)}
    onFocus={() => onFocus(true)} onBlur={() => onFocus(false)}>
    <span className="service-number">{service.number} / 04</span>
    <div className="service-main">
      <span className="service-eyebrow">{service.eyebrow}</span>
      <h3 id={`service-title-${service.number}`}>{compact ? <button type="button" aria-expanded={open} aria-controls={`service-body-${service.number}`} onClick={() => setOpen(!open)}>{service.title}<span aria-hidden="true">{open ? "−" : "+"}</span></button> : service.title}</h3>
      <div id={`service-body-${service.number}`} className="service-description" hidden={compact && !open}>
        <p>{service.description}</p>
      </div>
    </div>
    {compact && <div className="service-preview" hidden={!open}>
      <Image src={service.preview} alt={service.alt} width={640} height={480} sizes="85vw" />
    </div>}
    <div className="service-support" hidden={compact && !open}>
      <span>Posso ajudar com</span>
      <ul>{service.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
    </div>
  </motion.article>;
}

export function Services() {
  const reduced = !!useReducedMotion();
  const list = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [scrollActive, setScrollActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const previewIndex = hovered ?? focused ?? scrollActive;
  const preview = services[previewIndex];
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => { setHovered(null); setFocused(null); setCompact(media.matches); };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (compact) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rows = list.current?.querySelectorAll<HTMLElement>(".service-row");
      if (!rows) return;
      const axis = Math.max(144, window.innerHeight * .35);
      let active = 0;
      rows.forEach((row, index) => { if (row.getBoundingClientRect().top <= axis) active = index; });
      // The last service must activate even when the page ends before its top reaches the axis.
      if (rows.length && rows[rows.length - 1].getBoundingClientRect().bottom <= window.innerHeight - 120) active = rows.length - 1;
      setScrollActive(active);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    if (list.current) observer.observe(list.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [compact]);
  return <section id="servicos" className="services-section" aria-labelledby="services-title">
  <StructuralGrid variant="minimal" />
    <div className="services-header-surface" aria-hidden="true" />
    <div className="services-content">
    <header className="services-intro">
      <div className="services-label"><span>(03) O QUE EU FAÇO</span><span>ESTRATÉGIA → INTERFACE</span></div>
      <h2 id="services-title">Da ideia à interface.<br /><span>Design para produtos<br />que precisam funcionar.</span></h2>
      {!compact && <div className="services-sticky-preview" data-scroll-active={services[scrollActive].number} data-preview-active={preview.number}>
        <div className="services-preview-frame">
          <AnimatePresence initial={false}>
            <motion.div key={preview.number} className="services-preview-image" initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8, scale: reduced ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .3 }}>
              <Image src={preview.preview} alt={preview.alt} width={640} height={480} sizes="(min-width: 1024px) 420px, 85vw" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="services-preview-caption"><span>{preview.number} / 04</span><span>{preview.title}</span></div>
      </div>}
    </header>
    <div ref={list} className="services-list">{services.map((service, index) => <Service key={service.number} service={service} compact={compact} onHover={active => setHovered(active ? index : null)} onFocus={active => setFocused(active ? index : null)} />)}</div>
    </div>
  </section>;
}
