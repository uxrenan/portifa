"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { quoteHref } from "@/config/identity";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/Button/Button";
import "./contact.css";
import { PixelConstellation } from "@/components/PixelConstellation/PixelConstellation";

export function Contact() {
 const { t } = useI18n();
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
    <motion.span className="contact-label" {...reveal(0, 6)}><span className="pixel-marker"><PixelConstellation variant="spark" />{t.contact.label}</span></motion.span>
    <motion.h2 id="contact-heading" className="contact-heading" {...reveal(.06, 12)}>{t.contact.heading}</motion.h2>
   </div>
   <motion.div className="contact-bottom" {...reveal(.12, 10)}>
    <p>{t.contact.text}</p>
    <Button className="contact-action" tone="dark" href={quoteHref(t.contact.quoteMessage)} external aria-label={t.contact.quoteLabel}>{t.contact.quote}</Button>
   </motion.div>
  </div>
 </section>;
}
