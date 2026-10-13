"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "./labz.module.css";

// Connect this destination when the full experience is available.
const LABZ_HREF: string | null = null;
const objects = [
 { label: "GAMES", detail: "PLAY / 01", kind: "game", rotation: -10 },
 { label: "EXPERIMENTOS", detail: "BUILD → TEST", kind: "experiment", rotation: 7 },
 { label: "IA", detail: "INPUT _", kind: "ai", rotation: -6 },
 { label: "WEB", detail: "</>", kind: "web", rotation: 9 },
];

export function RenanLabzPreview() {
 const reduced = !!useReducedMotion();
 return <section id="labz" className={styles.section} aria-labelledby="labz-title">
  <p className={styles.entrance}>EXPERIMENTOS / EM CONSTRUÇÃO</p>
  <div className={styles.universe}>
   <div className={styles.objects} aria-hidden="true">{objects.map((item, index) => <motion.div key={item.kind} className={`${styles.object} ${styles[item.kind]}`} initial={reduced ? false : { opacity: 0, y: 12, rotate: item.rotation - 3 }} whileInView={{ opacity: 1, y: 0, rotate: item.rotation }} viewport={{ once: true, amount: .2 }} transition={{ duration: reduced ? 0 : .55, delay: reduced ? 0 : index * .04 }}><span className={styles.objectDetail}>{item.detail}</span><span>{item.label}</span></motion.div>)}</div>
   <motion.div className={styles.center} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: reduced ? 0 : .65 }}>
    <div className={styles.sign}><h2 id="labz-title">RENAN LABZ</h2></div>
    <p className={styles.headline}>Experimentos, produtos, jogos<br />e ideias que eu precisava ver funcionando.</p>
    <p className={styles.description}>Um espaço para testar, criar e construir sem precisar justificar demais a ideia primeiro.</p>
    <div className={styles.action}>{LABZ_HREF ? <a href={LABZ_HREF}>Conhecer o Labz <span aria-hidden="true">↗</span></a> : <><button type="button" disabled aria-describedby="labz-coming-soon">Conhecer o Labz <span aria-hidden="true">↗</span></button><span id="labz-coming-soon" className={styles.status}>Em breve</span></>}</div>
   </motion.div>
  </div>
 </section>;
}
