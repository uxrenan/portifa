"use client";


import Image from "next/image";
import { ProjectCursor, ProjectVisual } from "./ProjectVisual";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, type MotionStyle, useReducedMotion } from "framer-motion";
import { projects, type SelectedProject } from "@/config/projects";
import "./projects.css";
import { RenanLabzPreview } from "@/components/RenanLabzPreview/RenanLabzPreview";

const ease = [0.22, 1, 0.36, 1] as const;

function Project({ project, reduced }: { project: SelectedProject; reduced: boolean }) {
  return <motion.article layout={!reduced} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .22 }} className="project" data-project-card={project.cursorLabel ?? "Ver projeto ↗"} aria-labelledby={`project-${project.number}`}>
    <ProjectVisual title={project.title}>
      <motion.div className="project-image-reveal" initial={false} whileInView={reduced ? {} : { clipPath: ["inset(10% 0 10% 0)", "inset(0% 0 0% 0)"] }} viewport={{ once: true, amount: .2 }} transition={{ duration: .95, ease }}>
        <motion.div className="project-image-motion" initial={false} whileInView={reduced ? {} : { scale: [1.06, 1] }} viewport={{ once: true, amount: .2 }} transition={{ duration: 1.1, ease }}>
          <Image src={project.image} alt={project.alt} fill sizes="(max-width: 767px) 92vw, 46vw" className="project-image" />
        </motion.div>
      </motion.div>
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
    <motion.div layout={!reduced} transition={{ duration: reduced ? 0 : .25 }} id="projects-grid" className="projects-grid">{projects.map(project => <Project key={project.number} project={project} reduced={reduced} />)}</motion.div>
    <RenanLabzPreview />
    <ProjectCursor reduced={reduced} />
  </motion.section>;
}
