"use client";
import { StructuralGrid } from "@/components/StructuralGrid/StructuralGrid";

import { motion, useReducedMotion } from "framer-motion";
import "./about.css";

// Public profiles supplied by Renan.
const socialProfiles = { linkedin: "https://www.linkedin.com/in/renansm/", github: "https://github.com/uxrenan" };

export function About() {
 const reduced = useReducedMotion();
 const reveal = (delay = 0, distance = 12) => ({
  initial: reduced ? false as const : { opacity: 0, y: distance },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: .2 },
  transition: { duration: reduced ? 0 : .6, delay: reduced ? 0 : delay, ease: [.22, 1, .36, 1] as const },
 });
 return <section id="sobre" className="about-section" aria-labelledby="about-heading">
  <StructuralGrid />
  <div className="site-container about-container">
   <header className="about-intro">
    <motion.span className="type-signature about-label" {...reveal(0, 6)}>(04) SOBRE</motion.span>
    <h2 id="about-heading">
     <span className="about-line-mask"><motion.span {...reveal(.06, 24)}>Um pouco sobre quem</motion.span></span>
     <span className="about-line-mask"><motion.span {...reveal(.14, 24)}>está por trás das interfaces.</motion.span></span>
    </h2>
    <motion.p className="about-subtitle" {...reveal(.2, 8)}>Design, curiosidade e um pouco do que existe além das interfaces.</motion.p>
   </header>
   <motion.div className="about-sheet" {...reveal(.12, 16)}>
    <div className="about-copy">
     <h3 className="about-line-mask"><motion.span {...reveal(.2, 16)}>Oi, eu sou o Renan.</motion.span></h3>
     <motion.p {...reveal(.26)}>Trabalho com Product e UX/UI Design, criando interfaces e experiências digitais que ajudam a transformar coisas complexas em algo mais claro, simples e fácil de usar.</motion.p>
     <motion.p {...reveal(.32)}>Gosto especialmente do espaço entre design e tecnologia: entender o problema, pensar a experiência, desenhar a interface e acompanhar como aquilo realmente vira produto.</motion.p>
     <motion.p {...reveal(.38)}>Também gosto de criar coisas por conta própria. Sites, ferramentas, experimentos e ideias que muitas vezes começam com uma pergunta:</motion.p>
     <blockquote className="type-signature about-line-mask"><motion.span {...reveal(.44, 24)}>“será que dá pra fazer isso?”</motion.span></blockquote>
     <motion.p {...reveal(.48)}>É justamente desse lado mais curioso e experimental que nasce o Renan Labz.</motion.p>
     <div className="about-signature" aria-hidden="true" />
     <motion.div className="about-actions" {...reveal(.54, 8)}>
      <a className="header-contact" href="#contato">Vamos conversar <span aria-hidden="true">↗</span></a>
      <div className="about-socials">{Object.entries(socialProfiles).map(([key, href]) => href ? <a key={key} href={href} target="_blank" rel="noopener noreferrer">{key === "linkedin" ? "LinkedIn" : "GitHub"} ↗</a> : <span key={key} aria-label={`${key === "linkedin" ? "LinkedIn" : "GitHub"}, link em breve`}>{key === "linkedin" ? "LinkedIn" : "GitHub"}</span>)}</div>
     </motion.div>
    </div>
    <motion.figure className="about-portrait" {...reveal(.62, 8)} aria-label="Área reservada para a foto recortada de Renan">
     <svg viewBox="0 80 440 540" fill="none" aria-hidden="true"><defs><linearGradient id="about-silhouette" x1="220" y1="180" x2="220" y2="620" gradientUnits="userSpaceOnUse"><stop stopColor="#d4d9d0" /><stop offset="1" stopColor="#f5f6f3" /></linearGradient></defs><path d="M130 226c0-77 31-123 91-123s91 46 91 123c0 70-39 122-91 122s-91-52-91-122Z" fill="url(#about-silhouette)" /><path d="M178 327v54c-86 14-157 60-163 150L4 620h432l-11-89c-6-90-77-136-163-150v-54" fill="url(#about-silhouette)" /><path d="m331 125 19-19m-7 30 26-3" stroke="#4f7355" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" /></svg>
     <figcaption className="type-signature">Retrato em breve.</figcaption>
    </motion.figure>
   </motion.div>
  </div>
 </section>;
}
