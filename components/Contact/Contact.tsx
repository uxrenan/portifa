"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { CONTACT_HREF } from "@/config/identity";
import "./contact.css";

export function Contact() {
 const reduced = useReducedMotion();
 const section = useRef<HTMLElement>(null);
 useEffect(() => {
  const measure = () => section.current?.style.setProperty("--contact-scrollbar", `${window.innerWidth - document.documentElement.clientWidth}px`);
  const observer = new ResizeObserver(measure);
  observer.observe(document.documentElement);
  measure();
  return () => observer.disconnect();
 }, []);
 const reveal = (delay = 0, y = 16) => ({
  initial: reduced ? false as const : { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: .2 },
  transition: { duration: reduced ? 0 : .65, delay: reduced ? 0 : delay, ease: [.22, 1, .36, 1] as const },
 });
 return <section ref={section} id="contato" className="contact-section" aria-labelledby="contact-heading">
  <div className="contact-panel" aria-hidden="true" />
  <div className="site-container contact-content">
   <div className="contact-intro">
    <motion.span className="contact-label" {...reveal(0, 6)}>(05) CONTATO</motion.span>
    <motion.h2 id="contact-heading" className="contact-heading" {...reveal(.06, 12)}>Tem algo em mente?</motion.h2>
   </div>
   <motion.div className="contact-bottom" {...reveal(.12, 10)}>
    <p>Tem um projeto, uma ideia ou só quer conversar sobre design e tecnologia?</p>
    <a className="contact-action" href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" aria-label="Vamos conversar pelo WhatsApp, abre em nova aba"><span>Vamos conversar</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg></a>
   </motion.div>
  </div>
 </section>;
}
