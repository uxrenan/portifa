"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PixelArrow } from "@/components/Button/Button";
import { Lines } from "@/components/Emphasis/Emphasis";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./labz.module.css";

// Connect this destination when the full experience is available.
const LABZ_HREF: string | null = null;
const objects = [
 { detail: "PLAY / 01", kind: "game", rotation: -10 },
 { detail: "BUILD → TEST", kind: "experiment", rotation: 7 },
 { detail: "INPUT _", kind: "ai", rotation: -6 },
 { detail: "</>", kind: "web", rotation: 9 },
] as const;

export function RenanLabzPreview() {
 const { t } = useI18n();
 const reduced = !!useReducedMotion();
 return <section id="labz" className={styles.section} aria-labelledby="labz-title">
  <div className={styles.universe}>
   <div className={styles.objects} aria-hidden="true">{objects.map((item, index) => <motion.div key={item.kind} className={`${styles.object} ${styles[item.kind]}`} initial={reduced ? false : { opacity: 0, y: 12, rotate: item.rotation - 3 }} whileInView={{ opacity: 1, y: 0, rotate: item.rotation }} viewport={{ once: true, amount: .2 }} transition={{ duration: reduced ? 0 : .55, delay: reduced ? 0 : index * .04 }}><span className={styles.objectDetail}>{item.detail}</span><span>{t.labz.objects[item.kind]}</span></motion.div>)}</div>
   <motion.div className={styles.center} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: reduced ? 0 : .65 }}>
    <div className={styles.sign}><h2 id="labz-title">RENAN LABZ</h2></div>
    <p className={styles.headline}><Lines text={t.labz.headline} /></p>
    <p className={styles.description}>{t.labz.description}</p>
    <div className={styles.action}>{LABZ_HREF ? <a href={LABZ_HREF}>{t.labz.cta}<PixelArrow /></a> : <><button type="button" disabled aria-describedby="labz-coming-soon">{t.labz.cta}<PixelArrow /></button><span id="labz-coming-soon" className={styles.status}>{t.labz.soon}</span></>}</div>
   </motion.div>
  </div>
 </section>;
}
