"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type FocusEvent } from "react";
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { CaseStudy } from "@/config/cases";
import { useI18n } from "@/i18n/I18nProvider";
import { CasePanelView } from "./CasePanels";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import "./case-track.css";

type CaseTrackState = {
 /** The track runs sideways (desktop, motion allowed); otherwise the panels stack in a column. */
 horizontal: boolean;
 /** Progress through the track, 0 → 1, driven by the page's own vertical scroll. */
 progress: MotionValue<number>;
 /** The part of `progress` during which a panel crosses the screen, as [enters, leaves]. */
 panelRange: (element: HTMLElement) => [number, number];
};

const CaseTrackContext = createContext<CaseTrackState | null>(null);

export function useCaseTrack() {
 const value = useContext(CaseTrackContext);
 if (!value) throw new Error("useCaseTrack must be used inside CaseTrack");
 return value;
}

const WIDE = "(min-width: 768px)";
const subscribeNothing = () => () => {};
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * The case as a row of full-height panels. The section is as tall as the row is wide, and its stage stays pinned
 * (sticky) while the page scrolls, so ordinary vertical scrolling — wheel, trackpad, keys, scrollbar, Lenis — slides
 * the row sideways. Phones and reduced motion get the same panels in a plain column.
 */
export function CaseTrack({ study }: { study: CaseStudy }) {
 const { t } = useI18n();
 const section = useRef<HTMLElement>(null);
 const rail = useRef<HTMLDivElement>(null);
 const reduced = usePrefersReducedMotion();
 // The panel at the centre of the screen, kept up to date while scrolling, so a change of layout (row ↔ column),
 // a reload or a return through Back lands on the same panel instead of the top of the page.
 const anchor = useRef(-1);
 const pending = useRef(false);
 const navigationChecked = useRef(false);
 const storageKey = `case:${study.key}:panel`;
 const hydrated = useSyncExternalStore(subscribeNothing, () => true, () => false);
 const subscribeWide = useCallback((onChange: () => void) => {
  const media = window.matchMedia(WIDE);
  const update = () => { if (anchor.current >= 0) pending.current = true; onChange(); };
  media.addEventListener("change", update);
  return () => media.removeEventListener("change", update);
 }, []);
 const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => false);
 const [travel, setTravel] = useState(0);
 const horizontal = wide && !reduced;
 useEffect(() => { if (anchor.current >= 0) pending.current = true; }, [reduced]);

 useEffect(() => {
  let frame = 0;
  const update = () => {
   frame = 0;
   const panels = rail.current?.querySelectorAll<HTMLElement>(".case-panel");
   if (pending.current || !panels) return;
   let best = 0, distance = Infinity;
   panels.forEach((panel, index) => {
    const box = panel.getBoundingClientRect();
    const away = Math.hypot(box.left + box.width / 2 - window.innerWidth / 2, box.top + box.height / 2 - window.innerHeight / 2);
    if (away < distance) { distance = away; best = index; }
   });
   anchor.current = best;
   try { sessionStorage.setItem(storageKey, String(best)); } catch { /* storage blocked: position just isn't kept */ }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener("scroll", schedule, { passive: true });
  return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); };
 }, [storageKey]);

 // On reload or Back, the browser's own restoration can't work (the page is one screen tall until the row is
 // measured), so the page takes it over and returns to the saved panel (below, once the layout is known).
 useEffect(() => {
  const previous = history.scrollRestoration;
  history.scrollRestoration = "manual";
  return () => { history.scrollRestoration = previous; };
 }, []);

 // How far the row has to slide: its full width minus one screen. Measured before paint, and again whenever the row
 // or the window resizes.
 useLayoutEffect(() => {
  const element = rail.current;
  if (!horizontal || !element) return;
  const measure = () => setTravel(Math.max(0, element.scrollWidth - document.documentElement.clientWidth));
  const observer = new ResizeObserver(measure);
  observer.observe(element);
  window.addEventListener("resize", measure);
  measure();
  return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
 }, [horizontal]);

 // Where the page has to be for a panel to sit in the middle of the screen, in either layout.
 const topFor = useCallback((panel: HTMLElement) => {
  const width = document.documentElement.clientWidth;
  const sectionTop = (section.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
  if (horizontal) return sectionTop + clamp(panel.offsetLeft - (width - panel.offsetWidth) / 2, 0, travel);
  return panel.getBoundingClientRect().top + window.scrollY - (window.innerHeight - panel.offsetHeight) / 2;
 }, [horizontal, travel]);

 useLayoutEffect(() => {
  if (!hydrated) return;
  if (!navigationChecked.current) {
   navigationChecked.current = true;
   const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
   let saved = -1;
   try { saved = Number(sessionStorage.getItem(storageKey) ?? -1); } catch { /* storage blocked */ }
   if ((navigation?.type === "reload" || navigation?.type === "back_forward") && saved > 0) { anchor.current = saved; pending.current = true; }
  }
  if (!pending.current || (horizontal && !travel)) return;
  pending.current = false;
  const panel = rail.current?.querySelectorAll<HTMLElement>(".case-panel")[anchor.current];
  if (panel) window.scrollTo({ top: Math.max(0, topFor(panel)), behavior: "instant" });
 }, [hydrated, horizontal, travel, topFor, storageKey]);

 const travelValue = useMotionValue(0);
 useEffect(() => travelValue.set(travel), [travel, travelValue]);
 const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
 const x = useTransform(() => -scrollYProgress.get() * travelValue.get());

 const panelRange = useCallback((element: HTMLElement): [number, number] => {
  if (!travel) return [0, 1];
  const width = document.documentElement.clientWidth;
  return [clamp((element.offsetLeft - width) / travel, 0, 1), clamp((element.offsetLeft + element.offsetWidth) / travel, 0, 1)];
 }, [travel]);

 // A focused element off to the side is brought on screen by scrolling the page to the spot that centres its panel;
 // one already on screen (a click, or Tab within the visible panel) leaves the page where it is.
 const onFocus = useCallback((event: FocusEvent<HTMLDivElement>) => {
  const target = event.target as HTMLElement;
  const panel = target.closest<HTMLElement>(".case-panel");
  if (!horizontal || !panel) return;
  const box = target.getBoundingClientRect();
  if (box.left >= 0 && box.right <= document.documentElement.clientWidth) return;
  window.scrollTo({ top: topFor(panel), behavior: "instant" });
 }, [horizontal, topFor]);

 const state = useMemo(() => ({ horizontal, progress: scrollYProgress, panelRange }), [horizontal, scrollYProgress, panelRange]);
 return <CaseTrackContext.Provider value={state}>
  <section ref={section} className="case-track" data-horizontal={horizontal} data-motion={!reduced} style={horizontal ? { height: `calc(100dvh + ${travel}px)` } : undefined}>
   <div className="case-track-stage">
    <motion.div ref={rail} className="case-track-rail" style={{ x: horizontal ? x : 0 }} onFocus={onFocus}>
     {study.panels.map((panel, index) => <CasePanelView key={`${panel.kind}-${index}`} panel={panel} study={study} />)}
    </motion.div>
    {horizontal && <motion.div className="case-progress" aria-hidden="true" title={t.cases.labels.progress} style={{ scaleX: scrollYProgress }} />}
   </div>
  </section>
 </CaseTrackContext.Provider>;
}
