"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MiniRenanAvatar } from "./MiniRenanAvatar";
import { MiniDialog, NoteComposer } from "./NoteDialog";
import { CONTEXT_LINES, LINES, NOTE_KEY, NOTE_MODELS, NOTE_SECTIONS, SESSION_KEY, type AvatarState, type Note } from "./data";
import styles from "./mini.module.css";

type Session = { hidden: boolean; seen: string[]; count: number; last: number };
type Mode = "idle" | "menu" | "more" | "hide";
const freshSession = (): Session => ({ hidden: false, seen: [], count: 0, last: 0 });

export function MiniRenan() {
 const reduced = !!useReducedMotion();
 const [ready, setReady] = useState(false);
 const [hidden, setHidden] = useState(false);
 const [mode, setMode] = useState<Mode>("idle");
 const [speech, setSpeech] = useState("");
 const [expression, setExpression] = useState<AvatarState>("neutral");
 const [variant, setVariant] = useState<"default" | "labz">("default");
 const [dark, setDark] = useState(false);
 const [raised, setRaised] = useState(false);
 const [hideStep, setHideStep] = useState(0);
 const [composer, setComposer] = useState(false);
 const [notes, setNotes] = useState<Note[]>([]);
 const [reading, setReading] = useState<string | null>(null);
 const session = useRef<Session>(freshSession());
 const speechTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
 const panel = useRef<HTMLDivElement>(null);
 const avatar = useRef<HTMLButtonElement>(null);
 const widget = useRef<HTMLDivElement>(null);
 const current = useRef({ mode, hidden, composer, reading });
 useEffect(() => { current.current = { mode, hidden, composer, reading }; }, [mode, hidden, composer, reading]);
 const storeSession = useCallback(() => { try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session.current)); } catch { /* Session still works in memory. */ } }, []);
 const speak = useCallback((text: string, state: AvatarState = "talking", duration = 6500) => {
  clearTimeout(speechTimer.current); setSpeech(text); setExpression(state);
  speechTimer.current = setTimeout(() => { setSpeech(""); setExpression("neutral"); }, duration);
 }, []);
 const close = useCallback(() => { setMode("idle"); setSpeech(""); setExpression("neutral"); avatar.current?.focus(); }, []);
 useEffect(() => {
  try { const value = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); if (value && Array.isArray(value.seen) && typeof value.count === "number" && typeof value.last === "number") session.current = { ...freshSession(), ...value }; } catch { /* Use defaults. */ }
  setHidden(!!session.current.hidden);
  try { const saved = JSON.parse(localStorage.getItem(NOTE_KEY) || "[]"); if (Array.isArray(saved)) setNotes(saved.filter((n): n is Note => !!n && typeof n.id === "string" && typeof n.name === "string" && typeof n.comment === "string" && NOTE_SECTIONS.some(s => s.label === n.section) && NOTE_MODELS.includes(n.model)).slice(-30).map(n => ({ ...n, name: n.name.slice(0, 48), comment: n.comment.slice(0, 600) }))); } catch { /* Empty notebook if storage is unavailable. */ }
  const header = document.querySelector(".site-header");
  const check = () => { if (header?.getAttribute("data-phase") === "ready") { setReady(true); observer.disconnect(); } };
  const observer = new MutationObserver(check);
  if (header) observer.observe(header, { attributes: true, attributeFilter: ["data-phase"] }); check();
  return () => { observer.disconnect(); clearTimeout(speechTimer.current); };
 }, []);
 useEffect(() => {
  if (!ready || hidden) return;
  const spontaneous = (key: string, text: string) => {
   const s = session.current;
   const limit = matchMedia("(max-width: 767px)").matches ? 1 : 3;
   if (current.current.mode !== "idle" || current.current.composer || current.current.reading || current.current.hidden || s.seen.includes(key) || s.count >= limit || Date.now() - s.last < 60000) return false;
   s.seen.push(key); s.count++; s.last = Date.now(); storeSession(); speak(text); return true;
  };
  let invitation: ReturnType<typeof setTimeout>;
  const greeting = setTimeout(() => { if (spontaneous("intro", LINES.greeting)) invitation = setTimeout(() => { if (current.current.mode === "idle" && !current.current.composer && !current.current.hidden) speak(LINES.invitation, "talking", 8000); }, 1400); }, 8000);
  const observer = new IntersectionObserver(entries => {
   for (const entry of entries) if (entry.isIntersecting) {
    const target = entry.target;
    const labz = target.id === "labz";
    setVariant(labz ? "labz" : "default");
    setDark(["projetos", "labz", "contato"].includes(target.id) || target.tagName === "FOOTER");
    const key = Object.keys(CONTEXT_LINES).find(selector => target.matches(selector));
    if (key && session.current.seen.includes("intro") && Date.now() - session.current.last >= 60000) spontaneous(key, CONTEXT_LINES[key as keyof typeof CONTEXT_LINES]);
   }
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
  document.querySelectorAll(".hero-poster,#projetos,#labz,#servicos,#sobre,#contato,.site-footer,.editorial-pause").forEach(e => observer.observe(e));
  return () => { clearTimeout(greeting); clearTimeout(invitation); observer.disconnect(); };
 }, [ready, hidden, speak, storeSession]);
 useEffect(() => {
  if (!ready) return;
  let observer: IntersectionObserver;
  const setup = () => {
   observer?.disconnect();
   const collisions = new Set<Element>();
   observer = new IntersectionObserver(entries => {
    for (const entry of entries) { if (entry.isIntersecting) collisions.add(entry.target); else collisions.delete(entry.target); }
    setRaised(collisions.size > 0);
   }, { rootMargin: `-${Math.max(0, innerHeight - 120)}px 0px 0px -${Math.max(0, innerWidth - 120)}px`, threshold: 0 });
   document.querySelectorAll(".header-contact,.contact-action,.projects-outro a,.projects-filters button,.project-visual").forEach(e => observer.observe(e));
  };
  setup(); window.addEventListener("resize", setup);
  return () => { observer.disconnect(); window.removeEventListener("resize", setup); };
 }, [ready]);
 useEffect(() => {
  if (mode !== "hide") return;
  const a = setTimeout(() => setHideStep(1), reduced ? 0 : 550);
  const b = setTimeout(() => setHideStep(2), reduced ? 0 : 1100);
  return () => { clearTimeout(a); clearTimeout(b); };
 }, [mode, reduced]);
 useEffect(() => {
  if (mode === "idle") return;
  panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
  const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && !current.current.composer) close(); };
  const outside = (event: PointerEvent) => { if (event.target instanceof Node && !widget.current?.contains(event.target) && !current.current.composer) close(); };
  document.addEventListener("keydown", escape); document.addEventListener("pointerdown", outside);
  return () => { document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); };
 }, [mode, close]);
 const save = (note: Note) => {
  const next = [...notes, note].slice(-30);
  try { localStorage.setItem(NOTE_KEY, JSON.stringify(next)); } catch { return "Não foi possível salvar neste navegador. Tente liberar o armazenamento local."; }
  setNotes(next); setComposer(false); setMode("idle");
  speak(LINES.saved, "happy", 7500);
  const targetIndex = NOTE_SECTIONS.findIndex(s => s.label === note.section);
  // Use the existing delegated anchor navigation (Lenis); no second scroll engine.
  requestAnimationFrame(() => { const anchor = document.createElement("a"); anchor.href = `#mini-note-anchor-${targetIndex}`; document.body.append(anchor); anchor.click(); anchor.remove(); });
  return null;
 };
 if (!ready) return null;
 return <>
  <div ref={widget} className={styles.widget} data-tone={dark ? "dark" : "light"} data-raised={raised}>
   <AnimatePresence mode="wait">{hidden ? <motion.button key="restore" className={styles.restore} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { session.current.hidden = false; storeSession(); setHidden(false); speak(LINES.returned, "happy"); }}>chamar Mini Renan</motion.button> : <motion.div key="avatar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, rotate: 8 }} transition={{ duration: .25 }}>
    {(speech && mode === "idle") && <div className={styles.bubble} role="status">{speech}<button type="button" onClick={() => setSpeech("")} aria-label="Fechar fala">×</button></div>}
    {mode !== "idle" && <div ref={panel} className={styles.panel} role="dialog" aria-label="Mini Renan" data-lenis-prevent="true">
     <div className={styles.panelHeader}><h2>{mode === "menu" ? "O que foi?" : "Ei, pessoa."}</h2><button type="button" onClick={close} aria-label="Fechar menu">×</button></div>
     {mode === "menu" ? <div className={styles.options}><button onClick={() => { setMode("idle"); setSpeech(""); setComposer(true); }}>✎ Deixar um recado</button><button onClick={() => { setMode("more"); setExpression("judging"); setSpeech(""); }}>? Saber mais</button><button onClick={() => { setHideStep(0); setMode("hide"); setExpression("panic"); setSpeech(""); }}>× Me esconder</button></div> : mode === "more" ? <><p>{LINES.more}</p><div className={styles.options}><button onClick={close}>Tá bom, eu leio</button><a href="#sobre" onClick={close}>Me leva pro Sobre ↗</a></div></> : <><p aria-live="polite">{LINES.hide.slice(0, hideStep + 1).map(text => <span key={text} className={styles.line}>{text}</span>)}</p>{hideStep === 2 && <div className={styles.options}><button onClick={() => { close(); speak(LINES.cancel, "happy", 2500); }}>Cancelar</button><button onClick={() => { session.current.hidden = true; storeSession(); setHidden(true); setMode("idle"); setExpression("hidden"); setSpeech(""); }}>Sim, pode sumir</button></div>}</>}
    </div>}
    <button ref={avatar} className={styles.avatar} aria-label="Mini Renan — abrir menu" aria-expanded={mode !== "idle"} onClick={() => { clearTimeout(speechTimer.current); setSpeech(""); setExpression("neutral"); setMode(mode === "idle" ? "menu" : "idle"); }}><MiniRenanAvatar state={expression} variant={variant} /></button>
   </motion.div>}</AnimatePresence>
  </div>
  {composer && <NoteComposer onSave={save} onClose={() => { setComposer(false); avatar.current?.focus(); }} />}
  {NOTE_SECTIONS.map((s, index) => { const target = document.querySelector(s.selector); const group = notes.filter(n => n.section === s.label); return target && group.length ? createPortal(<><span id={`mini-note-anchor-${index}`} className={styles.noteAnchor} aria-hidden="true" /><button key={group[group.length - 1].id} className={styles.noteSeal} data-section={target.id} data-model={group[group.length - 1].model} aria-label={`Ler ${group.length} recados em ${s.label}`} onClick={() => setReading(s.label)}>✎ {group.length} {group.length === 1 ? "recado" : "recados"}</button></>, target, s.label) : null; })}
  {reading && <MiniDialog title={`Recados · ${reading}`} onClose={() => setReading(null)}><p className={styles.localHint}>Salvos apenas neste navegador.</p><div className={styles.noteList}>{notes.filter(n => n.section === reading).map(n => <article key={n.id} className={styles.note} data-model={n.model}><span>{n.model}</span><p>{n.comment}</p><strong>{n.name}</strong><button type="button" onClick={() => { const next = notes.filter(item => item.id !== n.id); try { localStorage.setItem(NOTE_KEY, JSON.stringify(next)); setNotes(next); } catch { /* Keep visible if deletion could not be saved. */ } }}>Remover recado</button></article>)}</div></MiniDialog>}
 </>;
}
