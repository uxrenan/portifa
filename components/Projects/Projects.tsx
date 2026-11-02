"use client";

import Image from "next/image";
import { ProjectCursor, ProjectVisual } from "./ProjectVisual";
import { useEffect, useRef, type CSSProperties } from "react";
import { motion, useInView, useScroll, useTransform, type MotionStyle, useReducedMotion } from "framer-motion";
import { projects, type SelectedProject } from "@/config/projects";
import "./projects.css";
import { RenanLabzPreview } from "@/components/RenanLabzPreview/RenanLabzPreview";
import { PixelReveal } from "@/components/PixelReveal/PixelReveal";
import { useI18n } from "@/i18n/I18nProvider";

function Project({ project, index, reduced }: { project: SelectedProject; index: number; reduced: boolean }) {
  const { t } = useI18n();
  const copy = t.projects.items[index];
  const card = useRef<HTMLElement>(null);
  const shown = useInView(card, { once: true, amount: .25 });
  // Cards side by side start a beat apart.
  const delay = (index % 2) * 140;
  const style = { "--project-delay": `${delay}ms` } as CSSProperties;
  return <motion.article ref={card} layout={!reduced} className="project" data-shown={reduced || shown} style={style} data-project-card={project.soon ? t.projects.soon : project.external ? t.projects.visit : t.projects.cursor} aria-labelledby={`project-${project.number}`}>
    <div className="project-head">
      <h3 id={`project-${project.number}`}>{copy.title}</h3>
      <span className="project-tag">{copy.tag}</span>
    </div>
    <ProjectVisual title={copy.title} href={project.external ? project.href : undefined}>
      <div className="project-image-motion">
        <Image src={project.image} alt={copy.alt} fill sizes="(max-width: 767px) 92vw, 46vw" className="project-image" />
      </div>
      {/* The image arrives in pixels, out of the dark panel. */}
      {!reduced && <PixelReveal columns={24} rows={15} shown={shown} delay={delay} color="#171a18" />}
    </ProjectVisual>
    <p className="project-description">{copy.description}</p>
  </motion.article>;
}

export function Projects() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    // The content keeps its approved viewport width; the panel follows visible edges.
    const update = () => section.current?.style.setProperty("--projects-scrollbar", `${window.innerWidth - document.documentElement.clientWidth}px`);
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    update();
    return () => observer.disconnect();
  }, []);
  const { t } = useI18n();
  const reduced = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start 75%", "start 15%"] });
  const panelInset = useTransform(scrollYProgress, value => `calc(var(--gutter) * ${1 - value} + var(--projects-final-inset) * ${value})`);
  const panelRadius = useTransform(scrollYProgress, [0, 1], ["24px", "20px"]);
  const panelStyle = reduced ? undefined : { "--projects-panel-inset": panelInset, "--projects-panel-radius": panelRadius } as MotionStyle;
  return <motion.section style={panelStyle} ref={section} id="projetos" className="projects-section" data-reduced-motion={reduced} aria-labelledby="projects-title">
    <div className="projects-intro">
      <h2 id="projects-title" aria-label={t.projects.headingLabel}>
        <span>{t.projects.headingBefore}</span>
        <svg className="projects-heading-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <path d="M50 5v90M5 50h90M18 18l64 64M18 82l64-64" stroke="currentColor" strokeWidth="14" />
        </svg>
        <span>{t.projects.headingAfter}</span>
      </h2>
    </div>
    <motion.div layout={!reduced} transition={{ duration: reduced ? 0 : .25 }} id="projects-grid" className="projects-grid">{projects.map((project, index) => <Project key={project.number} project={project} index={index} reduced={reduced} />)}</motion.div>
    <RenanLabzPreview />
    <ProjectCursor reduced={reduced} />
  </motion.section>;
}
