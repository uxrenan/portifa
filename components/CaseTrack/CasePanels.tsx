"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useTransform } from "framer-motion";
import { Button } from "@/components/Button/Button";
import { PixelReveal } from "@/components/PixelReveal/PixelReveal";
import type { CasePanel, CaseShot, CaseStudy } from "@/config/cases";
import { quoteHref } from "@/config/identity";
import { useI18n } from "@/i18n/I18nProvider";
import { useCaseTrack } from "./CaseTrack";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const ratio = (shot: CaseShot) => ({ "--ratio": `${shot.width} / ${shot.height}` }) as CSSProperties;
const step = (index: number) => ({ "--i": index }) as CSSProperties;
const COVER = "#171a18";

/** Whether a panel has come into view (sideways on the track, or down the column); once true it stays true. */
function useShown<T extends Element>() {
 const ref = useRef<T>(null);
 const shown = useInView(ref, { once: true, amount: .25 });
 return [ref, shown] as const;
}

function Opening({ study }: { study: CaseStudy }) {
 const { t } = useI18n();
 const copy = t.cases[study.key];
 return <div className="case-panel case-panel-opening" data-kind="opening">
  <h1 className="case-title">{copy.title.map((line, index) => <span key={line} className="case-title-line"><span style={step(index)}>{line}</span> </span>)}</h1>
  <ul className="case-tags" style={step(copy.title.length)}>{copy.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
 </div>;
}

function About({ study }: { study: CaseStudy }) {
 const { t } = useI18n();
 const [ref, shown] = useShown<HTMLDivElement>();
 const copy = t.cases[study.key];
 const labels = t.cases.labels;
 return <div ref={ref} className="case-panel case-panel-about" data-kind="about" data-shown={shown}>
  {([[labels.context, copy.context], [labels.goal, copy.goal], [labels.role, copy.role]] as const).map(([label, text], index) => <div key={label} className="case-about-block" style={step(index)}>
   <h2>{label}</h2>
   <p>{text}</p>
  </div>)}
 </div>;
}

/** The one large sentence: on the track it slides at its own pace and uncovers left to right as the row passes it,
 * like the home's editorial pause; in a column it just fades in. */
function Statement({ study }: { study: CaseStudy }) {
 const { t } = useI18n();
 const { horizontal, progress, panelRange } = useCaseTrack();
 const [ref, shown] = useShown<HTMLDivElement>();
 const [[start, end], setRange] = useState<[number, number]>([0, 1]);
 useEffect(() => { if (ref.current) setRange(panelRange(ref.current)); }, [panelRange, ref]);
 const x = useTransform(progress, [start, end], ["24%", "-8%"]);
 const clipPath = useTransform(progress, [start, start + (end - start) * .45], ["inset(0px 100% 0px 0px)", "inset(0px 0% 0px 0px)"]);
 return <div ref={ref} className="case-panel case-panel-statement" data-kind="statement" data-shown={shown}>
  <motion.p className="case-statement" style={horizontal ? { x, clipPath } : undefined}>{t.cases[study.key].statement}</motion.p>
 </div>;
}

/** A screen that arrives in pixels out of the dark panel while it settles from a slight zoom, like the project cards. */
function Shot({ study, shot, sizes, shown, delay = 0, columns }: { study: CaseStudy; shot: CaseShot; sizes: string; shown: boolean; delay?: number; columns: number }) {
 const { t } = useI18n();
 const reduced = usePrefersReducedMotion();
 return <div className="case-shot" style={{ ...ratio(shot), "--delay": `${delay}ms` } as CSSProperties}>
  <div className="case-shot-motion">
   <Image src={shot.src} alt={t.cases[study.key].alts[shot.id] ?? ""} fill sizes={sizes} className="case-shot-image" />
  </div>
  {!reduced && <PixelReveal columns={columns} rows={Math.max(1, Math.round(columns * shot.height / shot.width))} shown={shown} delay={delay} color={COVER} />}
 </div>;
}

function End({ study }: { study: CaseStudy }) {
 const { t, path } = useI18n();
 const [ref, shown] = useShown<HTMLDivElement>();
 const labels = t.cases.labels;
 return <div ref={ref} className="case-panel case-panel-end" data-kind="end" data-shown={shown}>
  <p className="case-end-heading" style={step(0)}>{t.contact.heading}</p>
  <div className="case-end-actions" style={step(1)}>
   <Button tone="dark" href={study.site} external aria-label={labels.visitLabel}>{labels.visit}</Button>
   <Button tone="dark" href={quoteHref(t.contact.quoteMessage)} external aria-label={t.contact.talkLabel}>{t.contact.talk}</Button>
   <Button tone="dark" variant="secondary" href={`${path("home")}#projetos`}>{labels.backToProjects}</Button>
  </div>
 </div>;
}

function ImagePanel({ study, panel }: { study: CaseStudy; panel: Extract<CasePanel, { kind: "image" }> }) {
 const [ref, shown] = useShown<HTMLElement>();
 return <figure ref={ref} className="case-panel case-panel-image" data-kind="image" data-id={panel.id} data-shown={shown} style={ratio(panel.shot)}>
  <Shot study={study} shot={panel.shot} sizes="(min-width: 768px) 80vw, 100vw" shown={shown} columns={24} />
 </figure>;
}

function PhonesPanel({ study, panel }: { study: CaseStudy; panel: Extract<CasePanel, { kind: "phones" }> }) {
 const [ref, shown] = useShown<HTMLElement>();
 return <figure ref={ref} className="case-panel case-panel-phones" data-kind="phones" data-id={panel.id} data-shown={shown}>
  {panel.shots.map((shot, index) => <Shot key={shot.id} study={study} shot={shot} sizes="(min-width: 768px) 24vw, 33vw" shown={shown} delay={index * 140} columns={10} />)}
 </figure>;
}

export function CasePanelView({ panel, study }: { panel: CasePanel; study: CaseStudy }) {
 switch (panel.kind) {
  case "opening": return <Opening study={study} />;
  case "about": return <About study={study} />;
  case "statement": return <Statement study={study} />;
  case "end": return <End study={study} />;
  case "image": return <ImagePanel study={study} panel={panel} />;
  case "phones": return <PhonesPanel study={study} panel={panel} />;
 }
}
