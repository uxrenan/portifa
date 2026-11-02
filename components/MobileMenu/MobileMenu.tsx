"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CONTACT_HREF, MOTION_EASE, NAV_ITEMS } from "@/config/identity";
import { Button } from "@/components/Button/Button";
import { LanguageSelector } from "@/components/Header/LanguageSelector";
import { useI18n } from "@/i18n/I18nProvider";

export function MobileMenu({ onClose, reduced }: { onClose: () => void; reduced: boolean }) {
 const { t, sections: base } = useI18n();
 const dialog = useRef<HTMLDialogElement>(null);
 useEffect(() => {
  const element = dialog.current!;
  const previous = document.activeElement as HTMLElement | null;
  element.showModal();
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => { element.close(); document.body.style.overflow = previousOverflow; previous?.focus(); };
 }, []);
 return <motion.dialog ref={dialog} id="mobile-navigation" aria-label={t.nav.main} className="mobile-overlay" onKeyDown={event => {
  if (event.key !== "Tab") return;
  const targets = dialog.current!.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]");
  const first = targets[0];
  const last = targets[targets.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
 }} onCancel={event => { event.preventDefault(); onClose(); }} initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: reduced ? 0 : 0.45, ease: MOTION_EASE }}>
  <div className="overlay-top"><span className="overlay-label">{t.nav.overlay}</span><button autoFocus onClick={onClose} className="menu-button">{t.nav.close} <span aria-hidden="true">×</span></button></div>
  <nav aria-label={t.nav.mobile} className="mobile-links">{NAV_ITEMS.map((item, index) => <div className="mobile-link-mask" key={item.href}><motion.a href={base + item.href} onClick={onClose} initial={{ y: "110%" }} animate={{ y: 0 }} exit={{ y: "110%" }} transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.12 + index * 0.045, ease: MOTION_EASE }}><span className="mobile-number">0{index + 1}</span><span>{t.nav.items[item.key]}</span><span className="mobile-arrow" aria-hidden="true">↗</span></motion.a></div>)}</nav>
  <div className="mobile-menu-actions"><LanguageSelector placement="top" /><Button className="header-contact" size="sm" href={CONTACT_HREF} external onClick={onClose} aria-label={t.contact.talkLabel}>{t.contact.talk}</Button></div>
 </motion.dialog>;
}
