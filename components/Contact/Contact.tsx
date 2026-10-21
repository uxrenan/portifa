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
   <motion.span className="contact-label" {...reveal(0, 6)}>(05) CONTATO</motion.span>
   <h2 id="contact-heading" className="contact-heading">
    <span className="contact-mask"><motion.span {...reveal(.06, 28)}>Tem algo em</motion.span></span>
    <span className="contact-mask"><motion.span className="contact-pixel" {...reveal(.2, 32)}>mente?</motion.span></span>
   </h2>
   <div className="contact-bottom">
    <motion.p {...reveal(.28, 10)}>Seja para conversar sobre uma oportunidade, um projeto, uma ideia ou simplesmente trocar uma conversa sobre design e tecnologia.</motion.p>
    <motion.a className="contact-action" href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" aria-label="Vamos conversar pelo WhatsApp, abre em nova aba" {...reveal(.36, 10)}>Vamos conversar <span aria-hidden="true">↗</span></motion.a>
   </div>
  </div>
 </section>;
}
