"use client";


import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects, PROJECT_FILTERS, PROJECTS_COPY, type ProjectCategory, type SelectedProject } from "@/config/projects";
import "./projects.css";
import { RenanLabzPreview } from "@/components/RenanLabzPreview/RenanLabzPreview";

const ease = [0.22, 1, 0.36, 1] as const;

function Project({ project, reduced }: { project: SelectedProject; reduced: boolean }) {
  return <motion.article layout={!reduced} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .22 }} className="project" aria-labelledby={`project-${project.number}`}>
    <a className="project-visual" aria-disabled="true" tabIndex={-1} title="Case em preparação" aria-label={`${PROJECTS_COPY.case}: ${project.title} — em preparação`}>
      <motion.div className="project-image-reveal" initial={false} whileInView={reduced ? {} : { clipPath: ["inset(10% 0 10% 0)", "inset(0% 0 0% 0)"] }} viewport={{ once: true, amount: .2 }} transition={{ duration: .95, ease }}>
        <motion.div className="project-image-motion" initial={false} whileInView={reduced ? {} : { scale: [1.06, 1] }} viewport={{ once: true, amount: .2 }} transition={{ duration: 1.1, ease }}>
          <Image src={project.image} alt={project.alt} fill sizes="(max-width: 767px) 92vw, 46vw" className="project-image" />
        </motion.div>
      </motion.div>
      <span className="project-case" aria-hidden="true"><span>{PROJECTS_COPY.case}</span><span>↗</span></span>
    </a>
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
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "Todos">("Todos");
  const filters = ["Todos" as const, ...PROJECT_FILTERS.filter(category => projects.some(project => project.categories.includes(category)))];
  const visibleProjects = projects.filter(project => activeFilter === "Todos" || project.categories.includes(activeFilter));
  return <section ref={section} id="projetos" className="projects-section" data-reduced-motion={reduced} aria-labelledby="projects-title">



    <div className="projects-intro">
      <div className="projects-eyebrow"><span>(02)</span><span>{PROJECTS_COPY.label}</span><span>01 — 04</span></div>
      <h2 id="projects-title">{PROJECTS_COPY.headline.map(line => <span key={line}>{line}</span>)}</h2>
      <div className="projects-filters" role="group" aria-label="Filtrar projetos por categoria">
        {filters.map(filter => <button key={filter} type="button" aria-pressed={activeFilter === filter} aria-controls="projects-grid" onClick={() => setActiveFilter(filter)}>{filter}</button>)}
      </div>
    </div>
    <motion.div layout={!reduced} transition={{ duration: reduced ? 0 : .25 }} id="projects-grid" className="projects-grid"><AnimatePresence initial={false}>{visibleProjects.map(project => <Project key={project.number} project={project} reduced={reduced} />)}</AnimatePresence></motion.div>
    <span className="projects-filter-status" role="status">{visibleProjects.length} {visibleProjects.length === 1 ? "projeto exibido" : "projetos exibidos"}</span>
    <div className="projects-outro"><span>(04 / 04)</span><a href="#projetos" onClick={() => setActiveFilter("Todos")}>{PROJECTS_COPY.all}<span aria-hidden="true">↗</span></a></div>
    <RenanLabzPreview />
  </section>;
}
