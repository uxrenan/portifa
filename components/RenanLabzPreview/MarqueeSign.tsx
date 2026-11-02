"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./labz.module.css";

/** Distance between bulbs and how far the bulb line sits inside the plate's edge, in px. */
const SPACING = 26;
const INSET = 13;

/** Bulb centres along the plate's border, corners included, clockwise from the top-left. */
function perimeter(width: number, height: number) {
 const w = width - INSET * 2, h = height - INSET * 2;
 const across = Math.max(2, Math.round(w / SPACING)), down = Math.max(2, Math.round(h / SPACING));
 const points: [number, number][] = [];
 for (let i = 0; i < across; i++) points.push([INSET + w * i / across, INSET]);
 for (let i = 0; i < down; i++) points.push([INSET + w, INSET + h * i / down]);
 for (let i = 0; i < across; i++) points.push([INSET + w - w * i / across, INSET + h]);
 for (let i = 0; i < down; i++) points.push([INSET, INSET + h - h * i / down]);
 return points;
}

/**
 * The Labz's old theatre sign: the name on a plate ringed with bulbs. The bulbs glow low and a few at a time flare up
 * in no order, like an old marquee that never got its chase circuit fixed. It only runs while the sign is on screen.
 */
export function MarqueeSign({ reduced, children }: { reduced: boolean; children: React.ReactNode }) {
 const plate = useRef<HTMLDivElement>(null);
 const [bulbs, setBulbs] = useState<[number, number][]>([]);

 useEffect(() => {
  const node = plate.current;
  if (!node) return;
  const observer = new ResizeObserver(([entry]) => setBulbs(perimeter(entry.borderBoxSize[0].inlineSize, entry.borderBoxSize[0].blockSize)));
  observer.observe(node);
  return () => observer.disconnect();
 }, []);

 useEffect(() => {
  const node = plate.current;
  if (!node || reduced || !bulbs.length) return;
  const lamps = [...node.querySelectorAll<HTMLElement>("[data-bulb]")];
  const timers = new Set<ReturnType<typeof setTimeout>>();
  let tick: ReturnType<typeof setInterval> | undefined, visible = false;
  const flare = () => {
   for (let n = Math.random() < .15 ? 2 : 1; n > 0; n--) {
    const lamp = lamps[Math.floor(Math.random() * lamps.length)];
    if (lamp.dataset.on !== undefined) continue;
    lamp.dataset.on = "";
    const timer = setTimeout(() => { delete lamp.dataset.on; timers.delete(timer); }, 300 + Math.random() * 600);
    timers.add(timer);
   }
  };
  const sync = () => {
   const awake = visible && document.visibilityState === "visible";
   if (awake && !tick) tick = setInterval(flare, 160);
   if (!awake && tick) { clearInterval(tick); tick = undefined; }
  };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(node);
  document.addEventListener("visibilitychange", sync);
  return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); clearInterval(tick); timers.forEach(clearTimeout); lamps.forEach(lamp => delete lamp.dataset.on); };
 }, [bulbs, reduced]);

 return <div ref={plate} className={styles.sign} data-reduced={reduced || undefined}>
  <div className={styles.bulbs} aria-hidden="true">{bulbs.map(([x, y], index) => <i key={index} data-bulb style={{ left: x, top: y }} />)}</div>
  {children}
 </div>;
}
