"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import "./editorial-pause.css";

export function EditorialPause() {
 const section = useRef<HTMLElement>(null);
 const reduced = !!useReducedMotion();
 // Lenis scrolls the document itself, so the native scroll progress is shared.
 const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
 const firstX = useTransform(scrollYProgress, [0, .32, .62, 1], ["24%", "6%", "-8%", "-30%"]);
 const secondX = useTransform(scrollYProgress, [0, .28, .48, 1], ["34%", "24%", "0%", "-22%"]);
 const scale = useTransform(scrollYProgress, [0, .5, 1], [.98, 1, 1.025]);
 const secondMask = useTransform(scrollYProgress, [.18, .46], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
 return <section ref={section} className="editorial-pause" data-reduced-motion={reduced} aria-label="Pausa editorial">
  <div className="editorial-pause-stage">
   <motion.h2 className="editorial-pause-heading" style={reduced ? undefined : { scale }}>
    <motion.span className="editorial-pause-first" style={reduced ? undefined : { x: firstX }}>O complexo.</motion.span>
    <motion.span className="editorial-pause-second" style={reduced ? undefined : { x: secondX, clipPath: secondMask }}>Feito <span className="editorial-pause-pixel">simples.</span></motion.span>
   </motion.h2>
  </div>
 </section>;
}
