"use client";

import Image from "next/image";
import { ProjectCursor, ProjectVisual } from "./ProjectVisual";
import { useEffect, useRef, type CSSProperties } from "react";
import { motion, useInView, useScroll, useTransform, type MotionStyle, useReducedMotion } from "framer-motion";
import { projects, type SelectedProject } from "@/config/projects";
import "./projects.css";
import { RenanLabzPreview } from "@/components/RenanLabzPreview/RenanLabzPreview";

/** The image arrives in pixels: a grid of panel-coloured squares (24×15, square cells on the 16:10 frame) that blink out
 * in a diagonal wave from the top-left, each with a scattered offset so the wave dissolves instead of stepping. */
const PIXEL_COLUMNS = 24;
const PIXEL_ROWS = 15;
const PIXELS = Array.from({ length: PIXEL_COLUMNS * PIXEL_ROWS }, (_, index) => {
  const x = index % PIXEL_COLUMNS, y = Math.floor(index / PIXEL_COLUMNS);
  const jitter = (Math.imul(index + 1, 2654435761) >>> 0) % 1000 / 1000; // a fixed hash, so server and client agree
  return `${Math.round((x + y) * 14 + jitter * 260)}ms`;
});

function Project({ project, index, reduced }: { project: SelectedProject; index: number; reduced: boolean }) {
  const card = useRef<HTMLElement>(null);
  const shown = useInView(card, { once: true, amount: .25 });
  // Cards side by side start a beat apart.
  const style = { "--project-delay": `${(index % 2) * 140}ms` } as CSSProperties;
  return <motion.article ref={card} layout={!reduced} className="project" data-shown={reduced || shown} style={style} data-project-card={project.cursorLabel ?? "Ver projeto"} aria-labelledby={`project-${project.number}`}>
    <ProjectVisual title={project.title}>
      <div className="project-image-motion">
        <Image src={project.image} alt={project.alt} fill sizes="(max-width: 767px) 92vw, 46vw" className="project-image" />
      </div>
      {!reduced && <span className="project-pixels" aria-hidden="true">{PIXELS.map((delay, cell) => <span key={cell} style={{ "--pixel-delay": delay } as CSSProperties} />)}</span>}
    </ProjectVisual>
    <h3 id={`project-${project.number}`}>{project.title}</h3>
    <div className="project-meta"><span>{project.category}</span><span aria-label={`Ano: ${project.year}`}>{project.year}</span></div>
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
  const reduced = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start 75%", "start 15%"] });
  const panelInset = useTransform(scrollYProgress, value => `calc(var(--gutter) * ${1 - value} + var(--projects-final-inset) * ${value})`);
  const panelRadius = useTransform(scrollYProgress, [0, 1], ["24px", "20px"]);
  const panelStyle = reduced ? undefined : { "--projects-panel-inset": panelInset, "--projects-panel-radius": panelRadius } as MotionStyle;
  return <motion.section style={panelStyle} ref={section} id="projetos" className="projects-section" data-reduced-motion={reduced} aria-labelledby="projects-title">
    <div className="projects-intro">
      <h2 id="projects-title" aria-label="Meus projetos">
        <span>Meus</span>
        <svg className="projects-heading-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <path d="M50 5v90M5 50h90M18 18l64 64M18 82l64-64" stroke="currentColor" strokeWidth="14" />
        </svg>
        <span>projetos</span>
      </h2>
    </div>
    <motion.div layout={!reduced} transition={{ duration: reduced ? 0 : .25 }} id="projects-grid" className="projects-grid">{projects.map((project, index) => <Project key={project.number} project={project} index={index} reduced={reduced} />)}</motion.div>
    <RenanLabzPreview />
    <ProjectCursor reduced={reduced} />
  </motion.section>;
}
