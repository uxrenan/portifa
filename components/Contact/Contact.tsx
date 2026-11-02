"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { CONTACT_EMAIL, CONTACT_PHONE, quoteHref } from "@/config/identity";
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
   <motion.div className="contact-topline" {...reveal(0, 6)}>
    <span className="contact-label"><span className="pixel-marker"><PixelConstellation variant="spark" />{t.contact.label}</span></span>
    <span className="contact-status"><i aria-hidden="true" />{t.hero.status}</span>
   </motion.div>
   <motion.h2 id="contact-heading" className="contact-heading" aria-label={t.contact.heading} {...reveal(.06, 24)}>
    <span aria-hidden="true">{t.contact.headingBefore} <span className="contact-accent">{t.contact.headingAccent}</span></span>
   </motion.h2>
   <motion.div className="contact-bottom" {...reveal(.14, 12)}>
    <div className="contact-note">
     <Image className="contact-avatar" src="/hero/renan-sticker.webp" alt="" width={640} height={907} sizes="56px" />
     <p>{t.contact.text}</p>
    </div>
    <ul className="contact-channels">
     <li><span>WhatsApp</span><a href={quoteHref(t.contact.quoteMessage)} target="_blank" rel="noopener noreferrer">{CONTACT_PHONE}</a></li>
     <li><span>{t.footer.email}</span><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
    </ul>
    <Button className="contact-action" variant="secondary" tone="dark" href={quoteHref(t.contact.quoteMessage)} external aria-label={t.contact.quoteLabel}>{t.contact.quote}</Button>
   </motion.div>
  </div>
 </section>;
}
