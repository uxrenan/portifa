"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type FocusEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { CaseStudy } from "@/config/cases";
import { useI18n } from "@/i18n/I18nProvider";
import { CasePanelView } from "./CasePanels";
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
 const reduced = !!useReducedMotion();
 const [wide, setWide] = useState(false);
 const [travel, setTravel] = useState(0);
 const horizontal = wide && !reduced;

 useEffect(() => {
  const media = window.matchMedia(WIDE);
  const update = () => setWide(media.matches);
  update();
  media.addEventListener("change", update);
  return () => media.removeEventListener("change", update);
 }, []);

 // How far the row has to slide: its full width minus one screen. Re-measured whenever the row or window resizes.
 useEffect(() => {
  const element = rail.current;
  if (!horizontal || !element) { setTravel(0); return; }
  const measure = () => setTravel(Math.max(0, element.scrollWidth - document.documentElement.clientWidth));
  const observer = new ResizeObserver(measure);
  observer.observe(element);
  window.addEventListener("resize", measure);
  measure();
  return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
 }, [horizontal]);

 const travelValue = useMotionValue(0);
 useEffect(() => travelValue.set(travel), [travel, travelValue]);
 const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
 const x = useTransform(() => -scrollYProgress.get() * travelValue.get());

 const panelRange = useCallback((element: HTMLElement): [number, number] => {
  if (!travel) return [0, 1];
  const width = document.documentElement.clientWidth;
  return [clamp((element.offsetLeft - width) / travel, 0, 1), clamp((element.offsetLeft + element.offsetWidth) / travel, 0, 1)];
 }, [travel]);

 // A focused element off to the side is brought on screen by scrolling the page to the spot that centres its panel.
 const onFocus = useCallback((event: FocusEvent<HTMLDivElement>) => {
  const panel = (event.target as HTMLElement).closest<HTMLElement>(".case-panel");
  if (!horizontal || !panel || !section.current) return;
  const width = document.documentElement.clientWidth;
  const shift = clamp(panel.offsetLeft - (width - panel.offsetWidth) / 2, 0, travel);
  const top = section.current.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + shift, behavior: "instant" });
 }, [horizontal, travel]);

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
