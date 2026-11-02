"use client";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ALWAYS_SHOW_INTRO, CONTACT_HREF, INTRO_FONTS, INTRO_SESSION_KEY, INTRO_TIMING, MOTION_EASE, NAV_ITEMS, WORDMARK_FONT } from "@/config/identity";
import { Intro } from "@/components/Intro/Intro";
import { MobileMenu } from "@/components/MobileMenu/MobileMenu";
import { NavLink } from "./NavLink";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@/components/Button/Button";
import { useI18n } from "@/i18n/I18nProvider";
import "./header.css";

type Phase = "loading" | "sequence" | "resolved" | "travel" | "ready";

/** `intro`: plays the wordmark sequence (home only); other pages start ready. Section links lead back to the home of
 * the current language from other pages. */
export function Header({ intro = true }: { intro?: boolean }) {
 const { t, sections: base } = useI18n();
 const reduced = useReducedMotion();
 const controls = useAnimationControls();
 const wordmark = useRef<HTMLAnchorElement>(null);
 const header = useRef<HTMLElement>(null);
 const [phase, setPhase] = useState<Phase>(intro ? "loading" : "ready");
 const [index, setIndex] = useState(0);
 const [open, setOpen] = useState(false);
 const close = useCallback(() => setOpen(false), []);
 useEffect(() => {
  let scrolled = false;
  let frame = 0;
  const update = () => {
   frame = 0;
   const next = scrolled ? window.scrollY > 16 : window.scrollY > 32;
   if (next !== scrolled) {
    scrolled = next;
    header.current?.setAttribute("data-scrolled", String(next));
   }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  update();
  window.addEventListener("scroll", schedule, { passive: true });
  return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); };
 }, []);

 useEffect(() => {
  if (!intro) return;
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout>;
  let releaseWait: (() => void) | undefined;
  const wait = (ms: number) => new Promise<void>(resolve => { releaseWait = resolve; timer = setTimeout(resolve, ms); });
  const previousOverflow = document.body.style.overflow;
  const previousRootOverflow = document.documentElement.style.overflow;
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  window.scrollTo(0, 0);
  const unlockScroll = () => {
   document.body.style.overflow = previousOverflow;
   document.documentElement.style.overflow = previousRootOverflow;
  };
  async function run() {
   let seen = false;
   try { seen = sessionStorage.getItem(INTRO_SESSION_KEY) === "true"; } catch { /* Storage may be disabled. */ }
   const play = !reduced && (ALWAYS_SHOW_INTRO || !seen);
   // The intro's seven display fonts are only downloaded when the sequence will actually play.
   const fontVariables = getComputedStyle(document.documentElement);
   if (play) await Promise.allSettled(INTRO_FONTS.map(font => document.fonts.load(`${font.style} ${font.weight} 100px ${fontVariables.getPropertyValue(font.family.slice(4, -1)).trim()}`, "Renan")));
   await document.fonts.ready;
   if (cancelled) return;
   if (!play) {
    controls.set({ x: 0, y: 0, scale: 1, opacity: 1 });
   } else {
    setPhase("sequence");
    // The final stage is the real header wordmark, so it never swaps elements during travel.
    for (let i = 0; i < INTRO_FONTS.length - 1; i++) {
     setIndex(i);
     await wait(INTRO_FONTS[i].duration);
     if (cancelled) return;
    }
    const element = wordmark.current!;
    const base = element.getBoundingClientRect();
    const fontSize = parseFloat(getComputedStyle(element).fontSize);
    const viewportWidth = document.documentElement.clientWidth;
    const largeSize = Math.min(240, Math.max(96, viewportWidth * (viewportWidth < 640 ? 0.24 : 0.17)));
    const scale = largeSize / fontSize;
    controls.set({ x: (viewportWidth - base.width * scale) / 2 - base.left, y: (window.innerHeight - base.height * scale) / 2 - base.top, scale, opacity: 1 });
    setPhase("resolved");
    await wait(INTRO_TIMING.resolve);
    if (cancelled) return;
    setPhase("travel");
    await controls.start({ x: 0, y: 0, scale: 1, transition: { duration: INTRO_TIMING.travel, ease: MOTION_EASE } });
   }
   if (cancelled) return;
   setPhase("ready");
   unlockScroll();
   try { sessionStorage.setItem(INTRO_SESSION_KEY, "true"); } catch { /* Intro still works without storage. */ }
  }
  void run();
  return () => { cancelled = true; clearTimeout(timer); releaseWait?.(); controls.stop(); unlockScroll(); };
 }, [controls, reduced, intro]);

 useEffect(() => {
  const media = window.matchMedia("(min-width: 1024px)");
  const onChange = () => { if (media.matches) close(); };
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
 }, [close]);

 const ready = phase === "ready";
 return <>
  {!ready && <div className="intro-backdrop" aria-hidden="true" data-lenis-prevent="true" />}
  <header ref={header} className="site-header" data-phase={phase} data-scrolled="false">
   <motion.a ref={wordmark} href={base || "#"} aria-label={t.nav.home} className="wordmark" style={{ fontFamily: WORDMARK_FONT, transformOrigin: "0 0" }} initial={{ opacity: intro ? 0 : 1 }} animate={controls} tabIndex={ready ? 0 : -1} aria-hidden={!ready}>Renan</motion.a>
   <motion.nav className="desktop-nav" aria-label={t.nav.main} inert={!ready} initial="hidden" animate={ready ? "visible" : "hidden"} variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : INTRO_TIMING.menuStagger } } }}>{NAV_ITEMS.map(item => <div className="nav-mask" key={item.href}><motion.div variants={{ hidden: { y: "110%", opacity: 0 }, visible: { y: 0, opacity: 1 } }} transition={{ duration: reduced ? 0 : 0.24, ease: MOTION_EASE }}><NavLink href={base + item.href}>{t.nav.items[item.key]}</NavLink></motion.div></div>)}</motion.nav>
   <motion.button className="menu-button mobile-trigger" aria-expanded={open} aria-haspopup="dialog" aria-controls={open ? "mobile-navigation" : undefined} onClick={() => setOpen(true)} disabled={!ready} initial={{ opacity: 0, y: 8 }} animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 8 }} transition={{ duration: reduced ? 0 : 0.24 }}>{t.nav.menu} <span className="menu-symbol" aria-hidden="true"><i /><i /></span></motion.button>
   <motion.div className="header-actions" inert={!ready} initial={{ opacity: 0, y: 8 }} animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 8 }} transition={{ duration: reduced ? 0 : .24, delay: reduced ? 0 : .18 }}>
    <LanguageSelector />
    <Button className="header-contact" size="sm" href={CONTACT_HREF} external aria-label={t.contact.talkLabel}>{t.contact.talk}</Button>
   </motion.div>
  </header>
  {phase === "sequence" && <Intro index={index} />}
  <AnimatePresence>{open && <MobileMenu onClose={close} reduced={!!reduced} />}</AnimatePresence>
 </>;
}
