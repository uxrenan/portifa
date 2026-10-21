"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { MiniRenanAvatar } from "../MiniRenan/MiniRenanAvatar";
import { MiniDialog } from "../MiniRenan/NoteDialog";
import { prepareTargets } from "./targets";
import styles from "./destruction.module.css";

export default function DestructionMode({ onExit }: { onExit: () => void }) {
 const reduced = !!useReducedMotion();
 const [chaos, setChaos] = useState(0);
 const [message, setMessage] = useState("Tá. Você que pediu.");
 const [confirmExit, setConfirmExit] = useState(false);
 const player = useRef<HTMLDivElement>(null);
 const controls = useRef({ direction: 0, jump: false, attack: false, paused: false });
 useEffect(() => { controls.current.paused = confirmExit; controls.current.direction = 0; }, [confirmExit]);
 useEffect(() => {
  const { targets, restore } = prepareTargets();
  const previousMode = document.documentElement.getAttribute("data-destruction-mode");
  document.documentElement.setAttribute("data-destruction-mode", "true");
  const destroyed = new Set<HTMLElement>();
  const clones = new Set<HTMLElement>();
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const keys = new Set<string>();
  let x = innerWidth - 100, y = 0, velocity = 0, facing = -1, last = 0, lastAttack = 0, frame = 0;
  const announce = (text: string) => { setMessage(text); const timer = setTimeout(() => setMessage(""), 3500); timers.add(timer); };
  const initialTimer = setTimeout(() => setMessage(""), 3500); timers.add(initialTimer);
  const attack = (now: number) => {
   if (now - lastAttack < 350) return;
   lastAttack = now;
   const centerX = x + 24 + facing * 50, centerY = innerHeight - 118 - y;
   player.current?.animate(reduced ? [{ opacity: .6 }, { opacity: 1 }] : [{ rotate: "0deg" }, { rotate: `${facing * 12}deg` }, { rotate: "0deg" }], { duration: 220 });
   const target = targets.filter(element => !destroyed.has(element) && element.isConnected).map(element => {
    const rect = element.getBoundingClientRect();
    const distance = Math.hypot(centerX - Math.max(rect.left, Math.min(centerX, rect.right)), centerY - Math.max(rect.top, Math.min(centerY, rect.bottom)));
    return { element, rect, distance };
   }).filter(item => item.rect.width && item.rect.height && item.rect.bottom > 0 && item.rect.top < innerHeight && item.distance < 145).sort((a, b) => a.distance - b.distance)[0];
   if (!target) return;
   const { element, rect } = target;
   const clone = element.cloneNode(true) as HTMLElement;
   clone.removeAttribute("id"); clone.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
   clone.inert = true; clone.setAttribute("aria-hidden", "true");
   Object.assign(clone.style, { position: "fixed", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, margin: "0", zIndex: "29", pointerEvents: "none", visibility: "visible", transform: "none", color: getComputedStyle(element).color, font: getComputedStyle(element).font });
   document.body.append(clone); clones.add(clone);
   element.style.setProperty("visibility", "hidden", "important"); element.setAttribute("data-destroyed", "true"); destroyed.add(element);
   clone.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: reduced ? "translateY(4px)" : `translate(${facing * 80}px, 90px) rotate(${facing * 14}deg)` }], { duration: reduced ? 180 : 500, fill: "forwards", easing: "ease-in" }).onfinish = () => { clone.remove(); clones.delete(clone); };
   const count = destroyed.size; setChaos(count);
   if (count === 1) announce("..."); else if (count === 4) announce("Você tá gostando disso, né?"); else if (count === 9) announce("Era pra ser só um easter egg."); else if (count === 15) announce("Meu Lighthouse…");
  };
  const tick = (now: number) => {
   const dt = Math.min((now - (last || now)) / 1000, .04); last = now;
   if (!controls.current.paused) {
    const direction = controls.current.direction || (keys.has("arrowright") || keys.has("d") ? 1 : 0) - (keys.has("arrowleft") || keys.has("a") ? 1 : 0);
    if (direction) facing = direction;
    x = Math.max(8, Math.min(innerWidth - 56, x + direction * 290 * dt));
    if (controls.current.jump && y === 0) velocity = 650;
    controls.current.jump = false;
    velocity -= 1500 * dt; y = Math.max(0, y + velocity * dt); if (y === 0) velocity = 0;
    if (controls.current.attack) { attack(now); controls.current.attack = false; }
    if (player.current) player.current.style.transform = `translate3d(${x}px, ${-y}px, 0) scaleX(${facing})`;
   }
   frame = requestAnimationFrame(tick);
  };
  const keydown = (event: KeyboardEvent) => {
   if (event.key === "Escape") { event.preventDefault(); keys.clear(); setConfirmExit(true); return; }
   if (controls.current.paused || (event.target instanceof HTMLElement && event.target.closest("input,textarea,select,a"))) return;
   if (event.key === "Enter" && event.target instanceof HTMLElement && event.target.closest("button")) return;
   const key = event.key.toLowerCase();
   if (!["arrowleft", "arrowright", "a", "d", " ", "x", "enter"].includes(key)) return;
   event.preventDefault(); keys.add(key);
   if (key === " " && !event.repeat) controls.current.jump = true;
   if ((key === "x" || key === "enter") && !event.repeat) controls.current.attack = true;
  };
  const keyup = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
  const blur = () => { keys.clear(); controls.current.direction = 0; };
  document.addEventListener("keydown", keydown); document.addEventListener("keyup", keyup); window.addEventListener("blur", blur);
  frame = requestAnimationFrame(tick);
  return () => { cancelAnimationFrame(frame); document.removeEventListener("keydown", keydown); document.removeEventListener("keyup", keyup); window.removeEventListener("blur", blur); timers.forEach(clearTimeout); clones.forEach(clone => clone.remove()); restore(); if (previousMode === null) document.documentElement.removeAttribute("data-destruction-mode"); else document.documentElement.setAttribute("data-destruction-mode", previousMode); };
 }, [reduced]);
 return <div data-mini-game className={styles.layer}>
  <div className={styles.hud}><span>MODO DESTRUIÇÃO</span><span aria-live="polite">Caos: {chaos}</span><button onClick={onExit}>Reconstruir site</button></div>
  <div ref={player} className={styles.player}><MiniRenanAvatar state="judging" variant="default" /></div>
  {message && <div className={styles.speech} role="status">{message}</div>}
  <div className={styles.controls} aria-label="Controles do modo destruição">
   {([-1, 1] as const).map(direction => <button key={direction} aria-label={direction === -1 ? "Mover para esquerda" : "Mover para direita"} onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); controls.current.direction = direction; }} onPointerUp={() => { controls.current.direction = 0; }} onPointerCancel={() => { controls.current.direction = 0; }}>{direction === -1 ? "←" : "→"}</button>)}
   <button aria-label="Pular" onClick={() => { controls.current.jump = true; }}>↑</button><button aria-label="Atacar" onClick={() => { controls.current.attack = true; }}>✳</button>
  </div>
  {confirmExit && <MiniDialog title="Sair do modo destruição?" onClose={() => setConfirmExit(false)}><div className={styles.actions}><button onClick={() => setConfirmExit(false)}>Continuar destruindo</button><button onClick={onExit}>Reconstruir site</button></div></MiniDialog>}
 </div>;
}
