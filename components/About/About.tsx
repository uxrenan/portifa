"use client";

import { motion, useReducedMotion } from "framer-motion";
import "./about.css";

const socialProfiles = [
 { label: "LinkedIn", href: "https://www.linkedin.com/in/renansm/" },
 { label: "GitHub", href: "https://github.com/uxrenan" },
];

function Arrow() {
 return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function About() {
 const reduced = useReducedMotion();
 return <section id="sobre" className="about-section" aria-labelledby="about-heading">
  <div className="site-container about-container">
   <div className="about-meta"><span>(04) SOBRE</span><span>Renan Marques</span></div>
   <motion.div className="about-opening" initial={false} whileInView={reduced ? {} : { opacity: [0.6, 1], y: [12, 0] }} viewport={{ once: true, amount: .2 }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }}>
    <header className="about-intro">
     <h2 id="about-heading">Entre o design<br />e a tecnologia.</h2>
     <div className="about-introduction"><span className="about-mark" aria-hidden="true"></span><p>Oi, eu sou o Renan.</p></div>
    </header>
    <div className="about-biography">
     <p className="about-lead">Trabalho com Product e UX/UI Design, transformando coisas complexas em experiências mais claras, simples e fáceis de usar.</p>
     <p>Gosto de entender o problema, pensar a experiência, desenhar a interface e acompanhar como tudo isso vira produto.</p>
    </div>
   </motion.div>
   <div className="about-curiosity">
    <div className="about-question">
     <span className="about-caption">Uma pergunta recorrente</span>
     <blockquote>“será que dá pra<br />fazer isso?”</blockquote>
    </div>
    <div className="about-experiments">
     <h3>Curiosidade que vira coisa.</h3>
     <p>Também crio sites, ferramentas e experimentos por conta própria. Ideias que começo a construir porque quero ver funcionando.</p>
     <p>Desse lado mais curioso e experimental nasce o Renan Labz.</p>
     <a className="about-labz-link" href="#labz">Esse lado mora no Labz <Arrow /></a>
    </div>
   </div>
   <div className="about-footer">
    <a className="about-contact" href="#contato"><span>Vamos conversar</span><Arrow /></a>
    <nav className="about-socials" aria-label="Perfis de Renan">{socialProfiles.map(profile => <a key={profile.label} href={profile.href} target="_blank" rel="noopener noreferrer">{profile.label}<Arrow /><span className="about-sr-only"> (abre em nova aba)</span></a>)}</nav>
   </div>
  </div>
 </section>;
}
